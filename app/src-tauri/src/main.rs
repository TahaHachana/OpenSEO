// No console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use openseo_core::pagespeed::{PageSpeed, SpeedReport, Strategy};
use openseo_core::{FetchOptions, ReviewResult, UserAgent};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

/// Settings file in the app's data directory, and the key holding [`Settings`].
const STORE_FILE: &str = "settings.json";
const STORE_KEY: &str = "settings";

/// User settings. Missing fields fall back to defaults, so older settings
/// files keep loading as fields are added.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
struct Settings {
    user_agent: UserAgent,
    /// Stored in plain text in the settings file. A PageSpeed key only grants
    /// PageSpeed quota, so the OS keychain would be overkill.
    pagespeed_api_key: Option<String>,
}

/// An error the UI can branch on (`kind`) and show (`message`).
#[derive(Debug, Serialize)]
struct CommandError {
    kind: &'static str,
    message: String,
}

fn load_settings(app: &AppHandle) -> Settings {
    app.store(STORE_FILE)
        .ok()
        .and_then(|store| store.get(STORE_KEY))
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default()
}

#[tauri::command]
fn get_settings(app: AppHandle) -> Settings {
    load_settings(&app)
}

#[tauri::command]
fn save_settings(app: AppHandle, settings: Settings) -> Result<(), CommandError> {
    let error = |e: &dyn std::fmt::Display| CommandError {
        kind: "settings",
        message: format!("could not save settings: {e}"),
    };
    let store = app.store(STORE_FILE).map_err(|e| error(&e))?;
    let value = serde_json::to_value(&settings).map_err(|e| error(&e))?;
    store.set(STORE_KEY, value);
    store.save().map_err(|e| error(&e))
}

/// Fetches and analyzes `url` with the saved User-Agent. Every outcome,
/// including failures, is a `ReviewResult` variant.
#[tauri::command]
async fn review(app: AppHandle, url: String) -> ReviewResult {
    let options = FetchOptions {
        user_agent: load_settings(&app).user_agent,
        ..FetchOptions::default()
    };
    openseo_core::review(&url, &options).await
}

/// Runs PageSpeed Insights on `url` with the saved API key, if any.
#[tauri::command]
async fn pagespeed(
    app: AppHandle,
    url: String,
    strategy: Strategy,
) -> Result<SpeedReport, CommandError> {
    let page = openseo_core::url::normalize(&url).ok_or_else(|| CommandError {
        kind: "invalidUrl",
        message: format!("{url:?} is not a valid http(s) URL"),
    })?;
    let to_error = |e: openseo_core::pagespeed::SpeedError| CommandError {
        kind: e.kind(),
        message: e.to_string(),
    };
    let psi = PageSpeed::new(load_settings(&app).pagespeed_api_key).map_err(to_error)?;
    psi.run(&page, strategy).await.map_err(to_error)
}

/// A URL passed on the command line (`openseo-app example.com`), analyzed on startup.
#[tauri::command]
fn initial_url() -> Option<String> {
    std::env::args().nth(1).filter(|a| !a.starts_with('-'))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            review,
            pagespeed,
            get_settings,
            save_settings,
            initial_url
        ])
        .run(tauri::generate_context!())
        .expect("failed to start the OpenSEO window");
}

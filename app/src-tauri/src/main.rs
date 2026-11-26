// No console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod render;

use std::sync::Mutex;

use openseo_core::crawl::Crawl;
use openseo_core::pagespeed::{PageSpeed, SpeedReport, Strategy};
use openseo_core::render::RenderedReview;
use openseo_core::{Analysis, FetchOptions, ReviewResult, UserAgent};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, Url, WindowEvent};
use tauri_plugin_store::StoreExt;

use render::Renderer;

/// Settings file in the app's data directory, and the key holding [`Settings`].
const STORE_FILE: &str = "settings.json";
const STORE_KEY: &str = "settings";

/// User settings. Missing fields fall back to defaults, so older settings
/// files keep loading as fields are added.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
struct Settings {
    user_agent: UserAgent,
    /// Stored in plain text in the settings file. A PageSpeed key only grants
    /// PageSpeed quota, so the OS keychain would be overkill.
    pagespeed_api_key: Option<String>,
    /// Also load each reviewed page in a hidden webview, running its
    /// JavaScript, and analyze the rendered DOM.
    render_javascript: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            user_agent: UserAgent::default(),
            pagespeed_api_key: None,
            render_javascript: true,
        }
    }
}

/// The raw-HTML analysis of the last successful review, keyed by its final
/// URL. A render is compared against it, so the UI doesn't send it back.
#[derive(Default)]
struct LastReview(Mutex<Option<(Url, Analysis)>>);

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
    // A render of the previous page is no longer wanted.
    app.state::<Renderer>().cancel();
    let options = FetchOptions {
        user_agent: load_settings(&app).user_agent,
        ..FetchOptions::default()
    };
    let result = openseo_core::review(&url, &options).await;
    let last = match &result {
        ReviewResult::Success(r) => Some((r.http.final_url.clone(), r.content.clone())),
        _ => None,
    };
    if let Ok(mut slot) = app.state::<LastReview>().0.lock() {
        *slot = last;
    }
    result
}

fn web_url(url: &str) -> Result<Url, CommandError> {
    openseo_core::url::normalize(url).ok_or_else(|| CommandError {
        kind: "invalidUrl",
        message: format!("{url:?} is not a valid http(s) URL"),
    })
}

/// Renders `url`, the final URL of the last review, in a hidden webview and
/// compares the result with that review's raw HTML.
#[tauri::command]
async fn render(app: AppHandle, url: String) -> Result<RenderedReview, CommandError> {
    let url = web_url(&url)?;
    let raw = app
        .state::<LastReview>()
        .0
        .lock()
        .ok()
        .and_then(|slot| slot.clone())
        .filter(|(reviewed, _)| *reviewed == url)
        .map(|(_, analysis)| analysis)
        .ok_or_else(|| CommandError {
            kind: "stale",
            message: "review the page before rendering it".into(),
        })?;
    let user_agent = load_settings(&app).user_agent;
    let capture = render::capture(&app, &url, &user_agent)
        .await
        .map_err(|e| CommandError {
            kind: e.kind(),
            message: e.message(),
        })?;
    RenderedReview::new(
        &raw,
        &url,
        &capture.page,
        capture.elapsed_ms,
        capture.settled,
    )
    .map_err(|e| CommandError {
        kind: "notAWebPage",
        message: e.to_string(),
    })
}

/// Checks robots.txt and the sitemaps for `url`, the final URL of the last
/// review. Its canonical URL also counts as listed in a sitemap.
#[tauri::command]
async fn crawl(app: AppHandle, url: String) -> Result<Crawl, CommandError> {
    let url = web_url(&url)?;
    let canonical = app
        .state::<LastReview>()
        .0
        .lock()
        .ok()
        .and_then(|slot| slot.clone())
        .filter(|(reviewed, _)| *reviewed == url)
        .and_then(|(_, analysis)| analysis.canonical);
    let options = FetchOptions {
        user_agent: load_settings(&app).user_agent,
        ..FetchOptions::default()
    };
    Ok(openseo_core::crawl::crawl(&url, canonical.as_deref(), &options).await)
}

/// Opens `url` in a visible preview window, with the saved User-Agent.
#[tauri::command]
fn open_preview(app: AppHandle, url: String) -> Result<(), CommandError> {
    let url = web_url(&url)?;
    render::preview(&app, &url, &load_settings(&app).user_agent).map_err(|message| CommandError {
        kind: "webview",
        message,
    })
}

/// Runs PageSpeed Insights on `url` with the saved API key, if any.
#[tauri::command]
async fn pagespeed(
    app: AppHandle,
    url: String,
    strategy: Strategy,
) -> Result<SpeedReport, CommandError> {
    let page = web_url(&url)?;
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
        .manage(Renderer::default())
        .manage(LastReview::default())
        // The preview window must not keep the app running.
        .on_window_event(|window, event| {
            if window.label() == "main" && matches!(event, WindowEvent::Destroyed) {
                window.app_handle().exit(0);
            }
        })
        .invoke_handler(tauri::generate_handler![
            review,
            render,
            crawl,
            open_preview,
            pagespeed,
            get_settings,
            save_settings,
            initial_url
        ])
        .run(tauri::generate_context!())
        .expect("failed to start the OpenSEO window");
}

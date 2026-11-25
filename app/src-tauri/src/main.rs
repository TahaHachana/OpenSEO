// No console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use openseo_core::{FetchOptions, ReviewResult, UserAgent};
use serde::Deserialize;

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReviewOptions {
    #[serde(default)]
    googlebot: bool,
}

/// Fetches and analyzes `url`. Every outcome, including failures, is a
/// `ReviewResult` variant, so the UI has a single shape to render.
#[tauri::command]
async fn review(url: String, options: Option<ReviewOptions>) -> ReviewResult {
    let options = options.unwrap_or_default();
    let fetch_options = FetchOptions {
        user_agent: if options.googlebot {
            UserAgent::Googlebot
        } else {
            UserAgent::OpenSeo
        },
        ..FetchOptions::default()
    };
    openseo_core::review(&url, &fetch_options).await
}

/// A URL passed on the command line (`openseo-app example.com`), analyzed on startup.
#[tauri::command]
fn initial_url() -> Option<String> {
    std::env::args().nth(1).filter(|a| !a.starts_with('-'))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![review, initial_url])
        .run(tauri::generate_context!())
        .expect("failed to start the OpenSEO window");
}

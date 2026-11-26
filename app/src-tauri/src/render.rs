//! Rendered-DOM capture: loads a page in an off-screen webview, waits until it
//! settles, and reads back the DOM that its scripts produced.
//!
//! The webview must be visible to the engine without being seen. A hidden window
//! would be simpler, but browser engines suspend hidden pages: animation frames
//! stop and timers stall within a couple of seconds, so pages that render on
//! them would be captured unfinished (and would look settled). Instead, the
//! webview is a child of the main window placed outside its visible area. On
//! Linux, where Tauri packs child webviews into the window's layout instead of
//! positioning them, it is moved into a zero-size container (see `prepare_linux`).
//!
//! The page is untrusted. Its webview has no IPC capability (capabilities only
//! name the `main` webview, and Tauri refuses commands from remote origins
//! without one), it may only navigate to web URLs, and it cannot open windows
//! or download files. It runs in an incognito session that is thrown away.

use std::sync::Mutex;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, Instant};

use openseo_core::UserAgent;
use openseo_core::render::RenderedPage;
use serde::Deserialize;
use serde::de::DeserializeOwned;
use tauri::webview::NewWindowResponse;
use tauri::webview::WebviewBuilder;
use tauri::{
    AppHandle, LogicalPosition, LogicalSize, Manager, Url, Webview, WebviewUrl,
    WebviewWindowBuilder,
};

const INIT_SCRIPT: &str = include_str!("../scripts/render-init.js");
const PROBE_SCRIPT: &str = include_str!("../scripts/render-probe.js");
const CAPTURE_SCRIPT: &str = include_str!("../scripts/render-capture.js");

const POLL_INTERVAL: Duration = Duration::from_millis(250);
/// The page counts as settled after this long with no network requests in
/// flight and no content changes.
const QUIET_MS: f64 = 800.0;
/// Pages that keep polling or animating content never settle; capture them
/// anyway after this long.
const TIME_LIMIT: Duration = Duration::from_secs(20);
const PROBE_TIMEOUT: Duration = Duration::from_secs(2);
const CAPTURE_TIMEOUT: Duration = Duration::from_secs(15);

const PREVIEW_LABEL: &str = "preview";

/// Hands out render runs; starting a new one (or calling [`Renderer::cancel`])
/// makes the previous one stop at its next poll.
#[derive(Default)]
pub struct Renderer {
    generation: AtomicU64,
}

impl Renderer {
    pub fn cancel(&self) {
        self.generation.fetch_add(1, Ordering::SeqCst);
    }

    fn start(&self) -> u64 {
        self.generation.fetch_add(1, Ordering::SeqCst) + 1
    }

    fn is_current(&self, generation: u64) -> bool {
        self.generation.load(Ordering::SeqCst) == generation
    }
}

pub struct Capture {
    pub page: RenderedPage,
    pub elapsed_ms: u64,
    pub settled: bool,
}

#[derive(Debug)]
pub enum RenderFailure {
    /// A newer render or review replaced this one.
    Cancelled,
    /// The page was still loading its HTML at the time limit.
    Timeout,
    Webview(String),
}

impl RenderFailure {
    pub fn kind(&self) -> &'static str {
        match self {
            RenderFailure::Cancelled => "cancelled",
            RenderFailure::Timeout => "timeout",
            RenderFailure::Webview(_) => "webview",
        }
    }

    pub fn message(&self) -> String {
        match self {
            RenderFailure::Cancelled => "a newer request replaced this one".into(),
            RenderFailure::Timeout => format!(
                "the page was still loading after {} seconds",
                TIME_LIMIT.as_secs()
            ),
            RenderFailure::Webview(e) => e.clone(),
        }
    }
}

/// What [`PROBE_SCRIPT`] reports.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Probe {
    href: String,
    ready: String,
    /// Whether [`INIT_SCRIPT`] runs in this document. It doesn't on the
    /// `about:blank` a webview starts on, nor on error pages.
    hooked: bool,
    inflight: i64,
    quiet_ms: f64,
}

impl Probe {
    fn is_web_page(&self) -> bool {
        self.hooked && (self.href.starts_with("http://") || self.href.starts_with("https://"))
    }

    fn is_settled(&self) -> bool {
        self.is_web_page()
            && self.ready == "complete"
            && self.inflight <= 0
            && self.quiet_ms >= QUIET_MS
    }
}

/// Window size for the User-Agent: a phone viewport for the mobile presets, so
/// responsive pages render the layout mobile-first indexing sees.
fn viewport(user_agent: &UserAgent) -> (f64, f64) {
    match user_agent {
        UserAgent::ChromeMobile | UserAgent::Googlebot => (412.0, 915.0),
        _ => (1366.0, 900.0),
    }
}

/// Web pages only: no custom schemes, files, or the app's own origin (which
/// Windows serves from `http://tauri.localhost`).
fn allowed_navigation(url: &Url) -> bool {
    match url.scheme() {
        "http" | "https" => !matches!(url.host_str(), Some("tauri.localhost" | "ipc.localhost")),
        "about" | "data" | "blob" => true,
        _ => false,
    }
}

/// A preview window, with the same restrictions as the renderer.
fn preview_window<'a>(
    app: &'a AppHandle,
    url: &Url,
    user_agent: &UserAgent,
) -> WebviewWindowBuilder<'a, tauri::Wry, AppHandle> {
    let (width, height) = viewport(user_agent);
    WebviewWindowBuilder::new(app, PREVIEW_LABEL, WebviewUrl::External(url.clone()))
        .inner_size(width, height)
        .incognito(true)
        .user_agent(&user_agent.header_value())
        .on_navigation(allowed_navigation)
        .on_new_window(|_, _| NewWindowResponse::Deny)
        .on_download(|_, _| false)
}

/// Readies the renderer on Linux, before it loads the page:
///
/// - Tauri packs a child webview into the main window's vertical box, where it
///   takes half the window. Its widget moves into a zero-size `GtkFixed` in
///   that box, at negative coordinates: it stays mapped in a real window (so
///   WebKit treats the page as visible and can composite with the GPU), takes
///   no space, and everything it draws is clipped away. (A `GtkOffscreenWindow`
///   would be the textbook choice, but it has no GL context on Wayland and
///   WebKit aborts the process when it needs one.)
/// - Media is turned off. The analysis doesn't need it, and WebKit's web
///   process crashes on pages with video when GStreamer plugins are missing
///   (minimal systems, or an AppImage without its media framework).
#[cfg(target_os = "linux")]
async fn prepare_linux(webview: &Webview, width: f64, height: f64) {
    use gtk::prelude::*;
    use webkit2gtk::{SettingsExt, WebViewExt};

    let (width, height) = (width as i32, height as i32);
    let (done, ready) = tokio::sync::oneshot::channel();
    let dispatched = webview.with_webview(move |platform| {
        let view = platform.inner();
        if let Some(settings) = WebViewExt::settings(&view) {
            settings.set_enable_media(false);
        }
        if let Some(parent) = view.parent().and_then(|p| p.downcast::<gtk::Box>().ok()) {
            parent.remove(&view);
            let stage = gtk::Fixed::new();
            view.set_size_request(width, height);
            stage.put(&view, -(width + 100), -(height + 100));
            parent.pack_end(&stage, false, false, 0);
            stage.show_all();
            // Closing the Tauri webview destroys the widget; take its stage along.
            view.connect_destroy(move |_| {
                if let Some(container) = stage
                    .parent()
                    .and_then(|p| p.downcast::<gtk::Container>().ok())
                {
                    container.remove(&stage);
                }
            });
        }
        let _ = done.send(());
    });
    match dispatched {
        Ok(()) => {
            let _ = ready.await;
        }
        Err(e) => eprintln!("renderer: could not prepare the webview: {e}"),
    }
}

/// Closes the webview when the render ends, however it ends (including the
/// command's future being dropped).
struct CloseOnDrop(Webview);

impl Drop for CloseOnDrop {
    fn drop(&mut self) {
        let _ = self.0.close();
    }
}

/// Evaluates `js` and parses its result. `None` if the webview could not run
/// it: still starting, between pages, or the script threw.
async fn eval<T: DeserializeOwned>(webview: &Webview, js: &str, timeout: Duration) -> Option<T> {
    let (tx, rx) = tokio::sync::oneshot::channel::<String>();
    let tx = Mutex::new(Some(tx));
    webview
        .eval_with_callback(js, move |json| {
            if let Some(tx) = tx.lock().ok().and_then(|mut tx| tx.take()) {
                let _ = tx.send(json);
            }
        })
        .ok()?;
    let json = tokio::time::timeout(timeout, rx).await.ok()?.ok()?;
    serde_json::from_str(&json).ok()
}

/// Loads `url` off-screen and captures the DOM once the page settles.
pub async fn capture(
    app: &AppHandle,
    url: &Url,
    user_agent: &UserAgent,
) -> Result<Capture, RenderFailure> {
    let renderer = app.state::<Renderer>();
    let generation = renderer.start();
    let started = Instant::now();
    let main = app
        .get_window("main")
        .ok_or_else(|| RenderFailure::Webview("the main window is gone".into()))?;
    let (width, height) = viewport(user_agent);
    // On Linux the webview must be configured before the page loads, so it
    // starts blank and navigates once ready.
    #[cfg(target_os = "linux")]
    let first_url = Url::parse("about:blank").expect("about:blank is a valid URL");
    #[cfg(not(target_os = "linux"))]
    let first_url = url.clone();
    let builder = WebviewBuilder::new(
        format!("render-{generation}"),
        WebviewUrl::External(first_url),
    )
    .incognito(true)
    .user_agent(&user_agent.header_value())
    .on_navigation(allowed_navigation)
    .on_new_window(|_, _| NewWindowResponse::Deny)
    .on_download(|_, _| false)
    .initialization_script(INIT_SCRIPT);
    // Left of the window's content area: laid out and running, but never seen.
    let position = LogicalPosition::new(-(width + 100.0), 0.0);
    let webview = main
        .add_child(builder, position, LogicalSize::new(width, height))
        .map_err(|e| RenderFailure::Webview(format!("could not open a webview: {e}")))?;
    let webview = CloseOnDrop(webview);
    #[cfg(target_os = "linux")]
    {
        prepare_linux(&webview.0, width, height).await;
        webview
            .0
            .navigate(url.clone())
            .map_err(|e| RenderFailure::Webview(format!("could not load the page: {e}")))?;
    }

    let mut last = None;
    let settled = loop {
        if !renderer.is_current(generation) {
            return Err(RenderFailure::Cancelled);
        }
        if let Some(probe) = eval::<Probe>(&webview.0, PROBE_SCRIPT, PROBE_TIMEOUT).await {
            if probe.is_settled() {
                break true;
            }
            last = Some(probe);
        }
        if started.elapsed() >= TIME_LIMIT {
            break false;
        }
        tokio::time::sleep(POLL_INTERVAL).await;
    };
    // Unsettled pages are still worth capturing once their HTML has loaded.
    if !settled && !last.is_some_and(|p| p.is_web_page() && p.ready != "loading") {
        return Err(RenderFailure::Timeout);
    }

    let page = eval::<RenderedPage>(&webview.0, CAPTURE_SCRIPT, CAPTURE_TIMEOUT)
        .await
        .ok_or_else(|| RenderFailure::Webview("could not read the rendered page".into()))?;
    if !renderer.is_current(generation) {
        return Err(RenderFailure::Cancelled);
    }
    Ok(Capture {
        page,
        elapsed_ms: started.elapsed().as_millis().try_into().unwrap_or(u64::MAX),
        settled,
    })
}

/// Shows `url` in a visible preview window, reusing it if already open.
pub fn preview(app: &AppHandle, url: &Url, user_agent: &UserAgent) -> Result<(), String> {
    let title = format!("Preview: {url}");
    if let Some(window) = app.get_webview_window(PREVIEW_LABEL) {
        window.navigate(url.clone()).map_err(|e| e.to_string())?;
        let _ = window.set_title(&title);
        let _ = window.unminimize();
        return window.set_focus().map_err(|e| e.to_string());
    }
    preview_window(app, url, user_agent)
        .title(&title)
        .build()
        .map(|_| ())
        .map_err(|e| format!("could not open the preview: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn navigation_is_limited_to_web_pages() {
        let ok = |u: &str| allowed_navigation(&Url::parse(u).unwrap());
        assert!(ok("https://example.com/"));
        assert!(ok("http://example.com/"));
        assert!(ok("about:blank"));
        assert!(!ok("http://tauri.localhost/index.html"));
        assert!(!ok("tauri://localhost/"));
        assert!(!ok("file:///etc/passwd"));
    }

    #[test]
    fn probe_settles_only_on_a_quiet_loaded_web_page() {
        let probe = |href: &str, ready: &str, inflight, quiet_ms| Probe {
            href: href.into(),
            ready: ready.into(),
            hooked: true,
            inflight,
            quiet_ms,
        };
        assert!(probe("https://a.example/", "complete", 0, 900.0).is_settled());
        assert!(!probe("https://a.example/", "complete", 1, 900.0).is_settled());
        assert!(!probe("https://a.example/", "complete", 0, 100.0).is_settled());
        assert!(!probe("https://a.example/", "interactive", 0, 900.0).is_settled());
        assert!(!probe("about:blank", "complete", 0, 900.0).is_settled());
    }
}

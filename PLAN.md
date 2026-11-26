# OpenSEO Rust Rewrite Plan

Goal: revive OpenSEO as a free, hosting-free desktop app. Enter a URL, get an SEO
report. Built with Rust + Tauri v2, reaching feature parity with the original
WebSharper site and SEOLib 0.7, then going beyond it where free APIs allow.

Developed on the `rust-rewrite` branch, merged into `master` and released as v0.1.0 (November 2026).

## Status

- [x] Phase 0: scaffolding (Tauri system packages still to install before Phase 3)
- [x] Phase 1: core parity with SEOLib, minus PageSpeed (Phase 4)
- [x] Phase 2: CLI (`openseo report <url> [--json] [-v] [--top N] [--googlebot]`)
- [x] Phase 3: Tauri app MVP (`cargo run -p openseo-app [-- <url>]`)
- [x] Phase 4: PageSpeed Insights + CrUX field data, settings (User-Agent presets, API key)
- [x] Phase 5: rendered-DOM mode (app only; verified on Linux X11 and Wayland, not yet on Windows/macOS)
- [x] Phase 6: modernized rules, new page/response checks, robots.txt + sitemap crawl checks (external validators not done)
- [x] Phase 7: release workflow, licenses (Linux bundles verified locally; Windows/macOS built by CI only; no updater yet)
- [x] Phase 8: .NET project removed, new README with screenshots

Deliberate deviations from SEOLib (bugs fixed while porting, modernized rules) are
listed in the module docs of `keywords.rs`, `rules/mod.rs` and `html.rs`.

## 1. What we are porting

The analysis lives in [SEOLib](https://github.com/TahaHachana/SEOLib) (~1,200 lines
of F#). This repo added a thin `Review` aggregation and a WebSharper UI, now replaced
entirely (removed in Phase 8; the F# code remains in the git history).

| SEOLib module | What it does | Rust destination |
|---|---|---|
| `Http.fs` | GET with Googlebot UA, status, headers, media type, size (KB), elapsed ms | `core::fetch` |
| `Html.fs` | title, meta tags, meta description/keywords, headings, text/HTML ratio, hyperlinks (absolute resolution, `<base>`, internal/external, follow/nofollow) | `core::html` |
| `Keywords.fs` | strip markup and 671 English stop words; 1/2/3-word combinations with occurrence and density | `core::keywords` |
| `Violations.fs` | 20 rule codes (title, description, h1, alt, inline CSS/JS size, query params, link count, meta refresh), Error/Warning, line/column position | `core::rules` |
| `PageSpeed.fs` | PageSpeed Online **v1** (dead API) | `core::pagespeed` on PSI **v5** |
| `Sitelet/Details.fs`, `Review.fs` | aggregate into `ReviewResult = InvalidUri \| GetFailed \| NotHtml \| Success of Review` | `core::review` |

The F# types map almost 1:1 to Rust enums/structs, e.g.:

```rust
pub enum ReviewResult { InvalidUri, GetFailed(FetchError), NotHtml { media_type: String }, Success(Box<Review>) }
```

## 2. Architecture

```
OpenSEO/
├── Cargo.toml              # workspace
├── crates/
│   ├── openseo-core/       # pure library: fetch, parse, analyze. No Tauri dependency.
│   └── openseo-cli/        # `openseo report <url> [--json]`: fast iteration and testing
└── app/
    ├── src-tauri/          # Tauri v2 shell: commands call openseo-core
    └── ui/                 # frontend (see decision D1)
```

Principles:
- **Core is UI-agnostic.** It takes HTML + URL (or fetches it) and returns serializable
  structs (`serde`). Both the CLI and the app consume the same API. That makes it
  testable without a webview.
- **Parse with a real DOM, not regexes.** SEOLib used regexes over raw HTML. Use
  `scraper` (html5ever), which handles malformed markup like browsers do. Rule
  thresholds and messages are ported verbatim first, then modernized (Phase 6).
- **Report sections are independent.** Local analysis returns in milliseconds; PageSpeed
  takes 10–30 s. The UI shows each section as it completes.

Key crates: `tokio`, `reqwest` (rustls), `scraper`, `url`, `serde`/`serde_json`,
`thiserror`, `texting_robots`, `quick-xml`, `clap` (CLI), `insta` (snapshot tests).

## 3. Phases

### Phase 0: Scaffolding
- Cargo workspace, `openseo-core` and `openseo-cli` crates.
- Install Tauri Linux prerequisites (`libwebkit2gtk-4.1-dev`, `libsoup-3.0-dev`,
  `libjavascriptcoregtk-4.1-dev`, `librsvg2-dev`, `build-essential`). They are currently missing on the dev machine.
- GitHub Actions: `cargo fmt --check`, `clippy -D warnings`, `cargo test`.
- Leave the .NET projects untouched until parity (removed in Phase 8).

### Phase 1: Core parity with SEOLib
- `fetch`: URL normalization (port `tryCreateUri`: prepend `http://` when the scheme is missing),
  redirect chain capture, timing, headers, content type, size, body for `text/html` only.
- `html`: title, metas, headings, text/HTML ratio, hyperlinks with `<base>` handling and
  dedup by URL.
- `keywords`: embed `EnglishStopWords.txt` via `include_str!`; same density formula
  (`occurrence / total_words * 100 * n`).
- `rules`: all 20 `ViolationCode`s with the same levels, categories, headings,
  descriptions and recommendations. Compute line/column from html5ever source
  positions or by locating the element's opening tag in the source.
- Fixture-based tests: a set of `tests/fixtures/*.html` pages, each triggering known
  violations, with `insta` snapshots of the full report.

**Done when:** `openseo report <url> --json` produces everything the old site showed,
except speed.

### Phase 2: CLI
- `openseo report <url>`: human-readable output; `--json` for the full struct.
- Stays useful afterward for debugging, CI checks and scripting.

### Phase 3: Tauri app MVP
- `app/` scaffold with a `review(url)` command that calls core.
- UI mirrors the old report: Details (URL, response time, text/HTML ratio, title,
  description, headings tabbed H1–H6), Keywords (1/2/3-word tables, sortable),
  Links (internal/external, follow/nofollow, filterable), Errors, Warnings, HTTP headers.
- Loading/error states for each `ReviewResult` variant.

### Phase 4: PageSpeed Insights v5 + CrUX, settings
- PSI v5 `runPagespeed` with `category=performance,seo,accessibility,best-practices`,
  mobile and desktop strategies. **In practice an API key is required**: the keyless
  quota is shared by everyone and was exhausted when tested (429 "Queries per day").
  Tests therefore run on demand (a button), not on every review.
- CrUX field data comes from the PSI response (`loadingExperience`), so no separate
  CrUX API call or key is needed.
- Optional user-supplied API key stored in the app config dir (Tauri `store` plugin);
  never bundled in the binary.
- Show Lighthouse scores, Core Web Vitals (lab + CrUX field data when available), and
  top failing audits with their savings.
- Settings panel (persisted with the same store): PageSpeed API key and User-Agent.
- User-Agent presets replace the Googlebot checkbox: `OpenSEO` (default),
  `Chrome desktop`, `Chrome mobile` (closest to Google's mobile-first crawl, rarely
  blocked), `Googlebot` (kept, but labelled as often blocked by bot protection) and
  custom. Core: add the Chrome presets to `UserAgent`. CLI: `--googlebot` becomes
  `--user-agent <openseo|chrome|chrome-mobile|googlebot|STRING>`.

### Phase 5: Rendered-DOM mode (the new capability)
- Load the target URL in a hidden secondary Tauri webview, wait for load + idle,
  extract `document.documentElement.outerHTML`, and run the same analyzers.
- Report the **raw vs rendered** difference: title/description/h1/canonical changed by
  JS, links that only exist after rendering. This catches problems on SPA sites.
- Optional live preview pane showing the page.
- Use the rendered DOM's `innerText` for anchor and heading text. In raw HTML,
  sibling `<span>`s that CSS displays as blocks run together ("GitHubRepository
  hosting" on github.com); only a CSS-aware renderer can separate them.

**As built:**
- Core: `render::{RenderedPage, RenderedReview, compare}` (diff of URL, title,
  description, canonical, H1s, links added/removed by JS); `Analysis.canonical`;
  `ElementTexts` aligns browser text with parsed elements by `href`/tag name.
- Text comes from a CSS-aware DOM walk (`display` decides word boundaries), not
  `innerText`, which would apply `text-transform` (uppercase menus).
- App: a child webview of the main window kept out of sight (off-window position;
  on Linux a zero-size `GtkFixed`, since Tauri packs children into the layout and
  `GtkOffscreenWindow` aborts on Wayland). Hidden windows don't work: WebKit
  suspends their timers. Settles on 800 ms without DOM changes or fetch/XHR in
  flight, 20 s cap. Incognito, web-only navigation, no popups/downloads/dialogs,
  no IPC capability. Setting "Render pages with JavaScript" (default on).
- UI: Source HTML / Rendered switch for all content tabs, JavaScript tab with the
  diff, preview window.

**Known gaps:**
- The webview is never painted, so animation frames are shimmed with timers and
  `IntersectionObserver` never fires: lazy-loaded content is missed. A tall
  viewport plus scrolling (as Googlebot does) would help.
- Shadow DOM content isn't serialized (`outerHTML`).
- The CLI has no renderer (would need a headless browser).
- Off-window child positioning is untested on Windows/macOS: check that pages
  aren't throttled there (Phase 7 CI matrix is a good moment).

### Phase 6: New checks and modernized rules
- Update outdated thresholds: title ~30–60 chars (or ~580px), description ~70–160 chars,
  and drop or soften the 250-link error (Google removed that guideline).
- Add `meta robots` to the raw/rendered diff (a noindex injected by JS is a classic).
- New checks: HTTP status and redirect chain, HTTPS/HSTS, mixed content, `robots.txt`
  (is this URL allowed?), sitemap discovery and inclusion, canonical, `meta robots` /
  `X-Robots-Tag`, `hreflang`, `lang`, viewport, Open Graph / Twitter cards, JSON-LD
  presence and parse validity, favicon, image dimensions/lazy loading.
- Optional external: W3C Nu HTML validator, Google Safe Browsing (needs a free key).

**As built:**
- Rules engine in `rules/` (content, head, resources, response); a new `Notice`
  level for best practices and facts, so warnings stay meaningful; new
  categories Security and Social.
- Modernized: title 30–60, description 70–160, links notice above 1,000, multiple
  H1 / many URL parameters / `alt=""` as notices, inline CSS/JS above 20,000
  characters (JSON blocks excluded).
- Page checks: HTTPS, mixed content (active/passive), canonical (missing,
  conflicting, invalid, elsewhere, http), meta robots, `lang`, viewport (+ zoom),
  hreflang (codes, self-reference, duplicates), Open Graph / Twitter card, JSON-LD
  validity and `@context`, favicon, image dimensions, lazy-loaded first image.
- Response checks: `X-Robots-Tag` (Google-applicable values), HSTS, redirect chains,
  temporary redirects.
- `crawl` module (separate call, extra requests): own RFC 9309 robots.txt matcher
  (Googlebot token, reports the deciding rule and line), Google's 4xx/5xx
  semantics, sitemap discovery (robots.txt, else `/sitemap.xml`), indexes and
  `.gz`, matching the page or its canonical URL; sitemaps naming the page's path
  segments are read first, 20 files at most.
- Meta robots is part of the raw/rendered diff.
- App: Indexing / Page setup / Social / Structured data cards, Issues tab merging
  page, response and crawl findings with a level filter. CLI: same data, crawl on
  by default (`--no-crawl`), JSON gains `crawl`.

**Not done:** W3C Nu validator and Safe Browsing (optional external services);
image byte sizes and favicon reachability (would need more requests).

### Phase 7: Packaging and release
- Tauri bundler: AppImage + .deb (Linux), .msi (Windows), .dmg (macOS) via a GitHub
  Actions matrix on tag push → GitHub Releases. Free hosting for binaries.
- Optional: Tauri updater plugin pointed at GitHub Releases.

**As built** (`.github/workflows/release.yml`):
- A `v*` tag builds the app on Ubuntu 22.04 (AppImage, .deb, .rpm), Windows (.msi,
  NSIS .exe) and macOS (universal .dmg, ad-hoc signed) with `tauri-action`, plus
  `openseo` CLI archives for Linux, Windows and macOS (arm64, x86_64), all
  attached to a **draft** release. Manual runs, and pushes that change the
  packaging files, build the same files as workflow artifacts.
- No code signing (needs paid certificates): the release notes explain the macOS
  quarantine and Windows SmartScreen workarounds.
- The AppImage bundles GStreamer (159 MB instead of 88 MB): without it, pages
  with video crash the web process. The renderer also runs with media off.
- Updater plugin: deferred (needs a signing key stored as a repository secret).

**Releasing:**
1. Bump `version` in the root `Cargo.toml` (`[workspace.package]`), run
   `cargo build` to update `Cargo.lock`, commit.
2. `git tag v0.1.0 && git push origin v0.1.0`.
3. When the workflow finishes, review the draft on GitHub Releases and publish it.

### Phase 8: Cleanup
- Remove the .NET solution, WebSharper scripts and `.nuget/` (git history keeps them).
- New README: screenshots, install, build-from-source, data sources and their limits.

## 4. Decisions to make

| # | Question | Recommendation |
|---|---|---|
| D1 | Frontend tech | **Decided:** plain HTML/CSS/JS, no build step. Node isn't installed, and the UI is mostly tables and tabs. Alternatives: Leptos (all-Rust, via `trunk`), or Svelte/TS (needs Node). |
| D2 | User-Agent | **Decided:** honest `OpenSEO/<version>` default; presets (Chrome desktop/mobile, Googlebot) and custom live in Settings, not the toolbar (Phase 4). Fake Googlebot is often blocked by reverse-DNS checks, so it's a preset, not a headline option. Revisit a browser default if 403s from bot protection turn out to be common. |
| D3 | Rule fidelity | **Done:** ported verbatim (Phase 1), then modernized (Phase 6); the changes are listed in `rules/mod.rs`. |
| D4 | Keyword language | English stop words only, as before; consider detecting `<html lang>` and adding stop word lists later. |
| D5 | License | **Decided:** MIT OR Apache-2.0 (`LICENSE-MIT`, `LICENSE-APACHE`). |

## 5. Out of scope
Backlinks, domain authority, keyword search volume, rank tracking: no viable free APIs.
Multi-page site crawling is a possible future feature (the core design allows it), not
part of this plan.

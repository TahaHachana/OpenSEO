# OpenSEO Rust Rewrite Plan

Goal: revive OpenSEO as a free, hosting-free desktop app. Enter a URL, get an SEO
report. Built with Rust + Tauri v2, reaching feature parity with the original
WebSharper site and SEOLib 0.7, then going beyond it where free APIs allow.

Branch: `rust-rewrite`

## 1. What we are porting

The analysis lives in [SEOLib](https://github.com/TahaHachana/SEOLib) (~1,200 lines
of F#). This repo adds a thin `Review` aggregation and a WebSharper UI, which will be
replaced entirely.

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

### Phase 4: PageSpeed Insights v5 + CrUX
- PSI v5 `runPagespeed` with `category=performance,seo,accessibility,best-practices`,
  mobile and desktop strategies. Works keyless at low volume.
- Optional user-supplied API key stored in the app config dir (Tauri `store` plugin);
  never bundled in the binary.
- Show Lighthouse scores, Core Web Vitals (lab + CrUX field data when available), and
  top failing audits with their savings.

### Phase 5: Rendered-DOM mode (the new capability)
- Load the target URL in a hidden secondary Tauri webview, wait for load + idle,
  extract `document.documentElement.outerHTML`, and run the same analyzers.
- Report the **raw vs rendered** difference: title/description/h1/canonical changed by
  JS, links that only exist after rendering. This catches problems on SPA sites.
- Optional live preview pane showing the page.

### Phase 6: New checks and modernized rules
- Update outdated thresholds: title ~30–60 chars (or ~580px), description ~70–160 chars,
  and drop or soften the 250-link error (Google removed that guideline).
- New checks: HTTP status and redirect chain, HTTPS/HSTS, mixed content, `robots.txt`
  (is this URL allowed?), sitemap discovery and inclusion, canonical, `meta robots` /
  `X-Robots-Tag`, `hreflang`, `lang`, viewport, Open Graph / Twitter cards, JSON-LD
  presence and parse validity, favicon, image dimensions/lazy loading.
- Optional external: W3C Nu HTML validator, Google Safe Browsing (needs a free key).

### Phase 7: Packaging and release
- Tauri bundler: AppImage + .deb (Linux), .msi (Windows), .dmg (macOS) via a GitHub
  Actions matrix on tag push → GitHub Releases. Free hosting for binaries.
- Optional: Tauri updater plugin pointed at GitHub Releases.

### Phase 8: Cleanup
- Remove the .NET solution, WebSharper scripts and `.nuget/` (git history keeps them).
- New README: screenshots, install, build-from-source, data sources and their limits.

## 4. Decisions to make

| # | Question | Recommendation |
|---|---|---|
| D1 | Frontend tech | **Plain HTML/CSS/JS, no build step**, for the MVP. Node isn't installed, and the UI is mostly tables and tabs. Alternatives: Leptos (all-Rust, via `trunk`), or Svelte/TS (needs Node). |
| D2 | User-Agent | Default to an honest `OpenSEO/<version>` UA with a setting to spoof Googlebot. Some sites block fake Googlebot by reverse-DNS check, so spoofing gives misleading results. |
| D3 | Rule fidelity | Port verbatim first (Phase 1), modernize later (Phase 6), so parity is verifiable. |
| D4 | Keyword language | English stop words only, as before; consider detecting `<html lang>` and adding stop word lists later. |
| D5 | License | The repo has none. Pick one (MIT/Apache-2.0 is the Rust norm) before the first release. |

## 5. Out of scope
Backlinks, domain authority, keyword search volume, rank tracking: no viable free APIs.
Multi-page site crawling is a possible future feature (the core design allows it), not
part of this plan.

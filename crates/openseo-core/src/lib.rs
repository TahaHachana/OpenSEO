//! OpenSEO core: fetches a web page and produces an SEO report.
//!
//! This crate is UI-agnostic. The CLI (`openseo-cli`) and the desktop app both
//! consume it. See `PLAN.md` at the repository root for the roadmap.
//!
//! Entry points:
//! - [`review`]: normalize a URL, fetch it, analyze it.
//! - [`analyze`]: analyze HTML you already have (no network).

pub mod fetch;
pub mod html;
pub mod keywords;
pub mod pagespeed;
pub mod review;
pub mod rules;
pub mod source;
mod text;
pub mod url;

pub use fetch::{FetchOptions, UserAgent};
pub use review::{Analysis, Review, ReviewResult, analyze, review};

/// The crate version, shown in the CLI and app.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

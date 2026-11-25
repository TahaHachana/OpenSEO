//! OpenSEO core: fetches a web page and produces an SEO report.
//!
//! This crate is UI-agnostic. The CLI (`openseo-cli`) and the desktop app both
//! consume it. See `PLAN.md` at the repository root for the roadmap.

/// The crate version, shown in the CLI and app.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_is_set() {
        assert!(!VERSION.is_empty());
    }
}

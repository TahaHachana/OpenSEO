//! Rendered-page analysis: the DOM after JavaScript ran, compared with the raw
//! HTML the server sent.
//!
//! Rendering needs a browser engine, so it happens outside this crate (the desktop
//! app uses a hidden webview). The renderer hands over a [`RenderedPage`]; this
//! module analyzes it and reports what scripts changed ([`RenderDiff`]).

use std::collections::HashSet;

use serde::{Deserialize, Serialize};
use url::Url;

use crate::html::{ElementTexts, Hyperlink};
use crate::review::{Analysis, analyze_with_text};

/// A page as a browser rendered it.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RenderedPage {
    /// `location.href` at capture time. Differs from the requested URL after a
    /// JavaScript redirect or `history.pushState`.
    pub url: String,
    /// The serialized DOM: doctype plus `document.documentElement.outerHTML`.
    pub html: String,
    pub text: ElementTexts,
}

/// The rendered page's analysis and how it differs from the raw HTML.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenderedReview {
    pub url: Url,
    /// Time from starting the load to capturing the DOM.
    pub elapsed_ms: u64,
    /// False when the page kept changing or loading until the time limit, so
    /// the capture may miss content that arrives later.
    pub settled: bool,
    /// Size of the serialized DOM, comparable with the raw response size.
    pub size_kb: f64,
    pub content: Analysis,
    pub diff: RenderDiff,
}

#[derive(Debug, thiserror::Error)]
pub enum RenderError {
    #[error("the rendered page has no web address ({0}); it probably failed to load")]
    NotAWebPage(String),
}

impl RenderedReview {
    /// Analyzes `page` and compares it with `raw`, the analysis of the HTML
    /// served at `raw_url`.
    pub fn new(
        raw: &Analysis,
        raw_url: &Url,
        page: &RenderedPage,
        elapsed_ms: u64,
        settled: bool,
    ) -> Result<Self, RenderError> {
        let url = Url::parse(&page.url)
            .ok()
            .filter(|u| matches!(u.scheme(), "http" | "https"))
            .ok_or_else(|| RenderError::NotAWebPage(page.url.clone()))?;
        let content = analyze_with_text(&page.html, &url, &page.text);
        let diff = compare(raw, raw_url, &content, &url);
        Ok(Self {
            size_kb: crate::text::round2(page.html.len() as f64 / 1024.0),
            url,
            elapsed_ms,
            settled,
            content,
            diff,
        })
    }
}

/// A page property that scripts may change.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Field {
    Url,
    Title,
    MetaDescription,
    Canonical,
    H1,
}

/// One property in the raw and the rendered page. Lists, because a page can
/// have several `<h1>`s; a missing value is an empty list.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldDiff {
    pub field: Field,
    pub raw: Vec<String>,
    pub rendered: Vec<String>,
    pub changed: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenderDiff {
    pub fields: Vec<FieldDiff>,
    /// Links in the rendered page only: search engines that don't run
    /// JavaScript, and the first indexing pass of those that do, miss them.
    pub links_added: Vec<Hyperlink>,
    /// Links in the raw HTML that scripts removed.
    pub links_removed: Vec<Hyperlink>,
}

impl RenderDiff {
    /// True when any field or link differs.
    pub fn has_changes(&self) -> bool {
        self.fields.iter().any(|f| f.changed)
            || !self.links_added.is_empty()
            || !self.links_removed.is_empty()
    }
}

/// Values compare equal if they differ only in whitespace. Raw headings get
/// their text from the DOM and rendered ones from CSS layout, which can
/// separate words differently ("GitHubDocs" vs "GitHub Docs"); that is not
/// something a script changed.
fn same(a: &[String], b: &[String]) -> bool {
    let squash = |v: &[String]| -> Vec<String> {
        v.iter()
            .map(|s| s.split_whitespace().collect::<String>())
            .collect()
    };
    squash(a) == squash(b)
}

fn without_fragment(url: &Url) -> String {
    let mut url = url.clone();
    url.set_fragment(None);
    url.into()
}

/// What scripts changed between the raw page (`raw`, served at `raw_url`) and
/// the rendered one.
pub fn compare(
    raw: &Analysis,
    raw_url: &Url,
    rendered: &Analysis,
    rendered_url: &Url,
) -> RenderDiff {
    fn h1s(a: &Analysis) -> Vec<String> {
        a.headings
            .iter()
            .filter(|h| h.level == 1)
            .map(|h| h.text.clone())
            .collect()
    }
    let field = |field, raw: Vec<String>, rendered: Vec<String>| FieldDiff {
        field,
        changed: !same(&raw, &rendered),
        raw,
        rendered,
    };
    let opt = |v: &Option<String>| v.iter().cloned().collect::<Vec<_>>();

    let links_diff = |from: &[Hyperlink], other: &[Hyperlink]| -> Vec<Hyperlink> {
        let urls: HashSet<&str> = other.iter().map(|l| l.url.as_str()).collect();
        from.iter()
            .filter(|l| !urls.contains(l.url.as_str()))
            .cloned()
            .collect()
    };

    RenderDiff {
        fields: vec![
            field(
                Field::Url,
                vec![without_fragment(raw_url)],
                vec![without_fragment(rendered_url)],
            ),
            field(Field::Title, opt(&raw.title), opt(&rendered.title)),
            field(
                Field::MetaDescription,
                opt(&raw.meta_description),
                opt(&rendered.meta_description),
            ),
            field(
                Field::Canonical,
                opt(&raw.canonical),
                opt(&rendered.canonical),
            ),
            field(Field::H1, h1s(raw), h1s(rendered)),
        ],
        links_added: links_diff(&rendered.links, &raw.links),
        links_removed: links_diff(&raw.links, &rendered.links),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::analyze;
    use crate::html::RenderedText;

    const RAW: &str = r#"<!doctype html><html><head><title>Loading…</title>
        <meta name="description" content="Shop for shoes">
        <link rel="canonical" href="/shoes"></head>
        <body><h1><span>Spring</span><span>Sale</span></h1>
        <a href="/a">A</a><a href="/old">Old</a><div id="app"></div></body></html>"#;

    fn url() -> Url {
        Url::parse("https://shop.example/shoes").unwrap()
    }

    fn rendered_page() -> RenderedPage {
        RenderedPage {
            url: "https://shop.example/shoes#top".into(),
            html: r#"<!DOCTYPE html><html><head><title>Shoes | Shop</title>
                <meta name="description" content="Shop for shoes">
                <link rel="canonical" href="https://shop.example/shoes"></head>
                <body><h1><span>Spring</span><span>Sale</span></h1>
                <a href="/a">A</a><div id="app"><a href="/new">New <b>in</b></a></div></body></html>"#
                .into(),
            text: ElementTexts {
                links: vec![
                    RenderedText { key: "/a".into(), text: "A".into() },
                    RenderedText { key: "/new".into(), text: "New\nin".into() },
                ],
                headings: vec![RenderedText { key: "h1".into(), text: "Spring\nSale".into() }],
            },
        }
    }

    #[test]
    fn reports_what_scripts_changed() {
        let raw = analyze(RAW, &url());
        let r = RenderedReview::new(&raw, &url(), &rendered_page(), 1200, true).unwrap();
        let changed: Vec<Field> = r
            .diff
            .fields
            .iter()
            .filter(|f| f.changed)
            .map(|f| f.field)
            .collect();
        // The URL differs only by fragment, the canonical only by being absolute,
        // and the h1 only by where words split.
        assert_eq!(changed, [Field::Title]);
        assert_eq!(r.content.headings[0].text, "Spring Sale");
        assert_eq!(raw.headings[0].text, "SpringSale");

        let urls = |v: &[Hyperlink]| v.iter().map(|l| l.url.clone()).collect::<Vec<_>>();
        assert_eq!(urls(&r.diff.links_added), ["https://shop.example/new"]);
        assert_eq!(r.diff.links_added[0].anchor, "New in");
        assert_eq!(urls(&r.diff.links_removed), ["https://shop.example/old"]);
        assert!(r.diff.has_changes());
    }

    #[test]
    fn identical_pages_have_no_changes() {
        let raw = analyze(RAW, &url());
        let page = RenderedPage {
            url: url().into(),
            html: RAW.into(),
            text: ElementTexts::default(),
        };
        let r = RenderedReview::new(&raw, &url(), &page, 10, true).unwrap();
        assert!(!r.diff.has_changes(), "{:#?}", r.diff);
    }

    #[test]
    fn a_page_that_never_loaded_is_an_error() {
        let raw = analyze(RAW, &url());
        let page = RenderedPage {
            url: "about:blank".into(),
            html: "<html></html>".into(),
            text: ElementTexts::default(),
        };
        assert!(RenderedReview::new(&raw, &url(), &page, 10, false).is_err());
    }
}

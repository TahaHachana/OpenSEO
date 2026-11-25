//! Page details extracted from the DOM: title, meta tags, headings, text/HTML
//! ratio and hyperlinks. Port of `SEOLib.Html`.

use std::collections::HashSet;
use std::sync::LazyLock;

use scraper::{ElementRef, Html, Selector};
use serde::Serialize;
use url::Url;

use crate::text::{raw_text, round2, visible_text};

pub(crate) fn selector(css: &str) -> Selector {
    Selector::parse(css).unwrap_or_else(|e| panic!("invalid selector {css:?}: {e}"))
}

static TITLE: LazyLock<Selector> = LazyLock::new(|| selector("title"));
static META: LazyLock<Selector> = LazyLock::new(|| selector("meta"));
static HEADINGS: LazyLock<Selector> = LazyLock::new(|| selector("h1, h2, h3, h4, h5, h6"));
static BASE: LazyLock<Selector> = LazyLock::new(|| selector("base[href]"));
static LINKS: LazyLock<Selector> = LazyLock::new(|| selector("a[href]"));
static IMG_ALT: LazyLock<Selector> = LazyLock::new(|| selector("img[alt]"));

/// A `<meta>` element's identifying attributes and content.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Meta {
    pub http_equiv: Option<String>,
    pub name: Option<String>,
    pub property: Option<String>,
    pub content: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Heading {
    pub level: u8,
    pub text: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum LinkKind {
    Internal,
    External,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum LinkRel {
    Follow,
    NoFollow,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Hyperlink {
    pub url: String,
    pub anchor: String,
    pub kind: LinkKind,
    pub rel: LinkRel,
}

fn non_empty(s: String) -> Option<String> {
    let s = s.trim();
    (!s.is_empty()).then(|| s.to_owned())
}

fn attr(el: ElementRef<'_>, name: &str) -> Option<String> {
    el.value().attr(name).map(str::to_owned)
}

fn inside_svg(el: ElementRef<'_>) -> bool {
    el.ancestors()
        .filter_map(|n| n.value().as_element())
        .any(|e| e.name() == "svg")
}

/// The document's `<title>` element and its index among all `<title>` elements.
/// An SVG `<title>` is an image caption, not the page title.
pub(crate) fn title_element(doc: &Html) -> Option<(usize, ElementRef<'_>)> {
    doc.select(&TITLE)
        .enumerate()
        .find(|(_, el)| !inside_svg(*el))
}

/// The page title, whitespace-collapsed, or `None` if missing or empty.
pub fn title(doc: &Html) -> Option<String> {
    title_element(doc).and_then(|(_, el)| non_empty(visible_text(*el)))
}

pub(crate) fn meta_elements(doc: &Html) -> impl Iterator<Item = ElementRef<'_>> {
    doc.select(&META)
}

pub(crate) fn is_meta_named(el: ElementRef<'_>, name: &str) -> bool {
    el.value()
        .attr("name")
        .is_some_and(|n| n.trim().eq_ignore_ascii_case(name))
}

pub fn metas(doc: &Html) -> Vec<Meta> {
    meta_elements(doc)
        .map(|el| Meta {
            http_equiv: attr(el, "http-equiv"),
            name: attr(el, "name"),
            property: attr(el, "property"),
            content: attr(el, "content"),
        })
        .collect()
}

/// Content of the first `<meta name="…">` with the given name, if non-empty.
fn named_meta_content(doc: &Html, name: &str) -> Option<String> {
    meta_elements(doc)
        .find(|el| is_meta_named(*el, name))
        .and_then(|el| attr(el, "content"))
        .and_then(non_empty)
}

pub fn meta_description(doc: &Html) -> Option<String> {
    named_meta_content(doc, "description")
}

pub fn meta_keywords(doc: &Html) -> Option<String> {
    named_meta_content(doc, "keywords")
}

/// All `<h1>`–`<h6>` headings in document order.
pub fn headings(doc: &Html) -> Vec<Heading> {
    doc.select(&HEADINGS)
        .map(|el| Heading {
            level: el.value().name().as_bytes()[1] - b'0',
            text: visible_text(*el),
        })
        .collect()
}

/// Percentage of visible text characters relative to the whole HTML source.
pub fn text_html_ratio(doc: &Html, source: &str) -> f64 {
    let source_len = source.chars().count();
    if source_len == 0 {
        return 0.0;
    }
    let text = crate::text::collapse_whitespace(&raw_text(*doc.root_element()));
    round2(text.chars().count() as f64 / source_len as f64 * 100.0)
}

/// The URL relative links resolve against: `<base href>` if present, else the page URL.
fn base_url(doc: &Html, page_url: &Url) -> Url {
    doc.select(&BASE)
        .next()
        .and_then(|el| el.value().attr("href"))
        .and_then(|href| page_url.join(href.trim()).ok())
        .unwrap_or_else(|| page_url.clone())
}

/// Anchor text; for image links, the image's `alt` (what search engines use).
fn anchor_text(el: ElementRef<'_>) -> String {
    let text = visible_text(*el);
    if !text.is_empty() {
        return text;
    }
    el.select(&IMG_ALT)
        .filter_map(|img| img.value().attr("alt"))
        .map(crate::text::collapse_whitespace)
        .find(|alt| !alt.is_empty())
        .unwrap_or_default()
}

fn is_nofollow(el: ElementRef<'_>) -> bool {
    el.value().attr("rel").is_some_and(|rel| {
        rel.split_whitespace()
            .any(|t| t.eq_ignore_ascii_case("nofollow"))
    })
}

/// Unique `http(s)` hyperlinks of the page, resolved to absolute URLs.
///
/// In-page fragments (`#top`) and non-web schemes (`mailto:`, `javascript:`,
/// `tel:`) are skipped. Duplicates keep their first occurrence.
pub fn hyperlinks(doc: &Html, page_url: &Url) -> Vec<Hyperlink> {
    let base = base_url(doc, page_url);
    let mut seen = HashSet::new();
    doc.select(&LINKS)
        .filter_map(|el| {
            let href = el.value().attr("href")?.trim();
            if href.is_empty() || href.starts_with('#') {
                return None;
            }
            let url = base.join(href).ok()?;
            if !matches!(url.scheme(), "http" | "https") {
                return None;
            }
            let kind = if url.host_str() == page_url.host_str() {
                LinkKind::Internal
            } else {
                LinkKind::External
            };
            let rel = if is_nofollow(el) {
                LinkRel::NoFollow
            } else {
                LinkRel::Follow
            };
            let url = url.to_string();
            if !seen.insert(url.clone()) {
                return None;
            }
            Some(Hyperlink {
                anchor: anchor_text(el),
                url,
                kind,
                rel,
            })
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn doc(html: &str) -> Html {
        Html::parse_document(html)
    }

    fn page() -> Url {
        Url::parse("https://example.com/blog/post").unwrap()
    }

    #[test]
    fn title_ignores_svg_titles_and_collapses_whitespace() {
        let d = doc(
            "<body><svg><title>icon</title></svg></body><head><title>\n  My   page </title></head>",
        );
        assert_eq!(title(&d).as_deref(), Some("My page"));
        assert_eq!(title(&doc("<title>  </title>")), None);
        assert_eq!(title(&doc("<p>no title</p>")), None);
    }

    #[test]
    fn title_decodes_entities() {
        assert_eq!(
            title(&doc("<title>Fish &amp; Chips</title>")).as_deref(),
            Some("Fish & Chips")
        );
    }

    #[test]
    fn meta_description_is_case_insensitive_and_skips_empty() {
        let d = doc(r#"<meta name="Description" content=" Hello, it's me ">"#);
        assert_eq!(meta_description(&d).as_deref(), Some("Hello, it's me"));
        assert_eq!(
            meta_description(&doc(r#"<meta name="description" content="">"#)),
            None
        );
        assert_eq!(
            meta_description(&doc(r#"<meta name="keywords" content="a">"#)),
            None
        );
    }

    #[test]
    fn headings_in_document_order_without_script_text() {
        let d = doc("<h2>B</h2><h1>A <script>x()</script><em>!</em></h1><h6></h6>");
        let h = headings(&d);
        assert_eq!(
            h,
            vec![
                Heading {
                    level: 2,
                    text: "B".into()
                },
                Heading {
                    level: 1,
                    text: "A !".into()
                },
                Heading {
                    level: 6,
                    text: String::new()
                },
            ]
        );
    }

    #[test]
    fn text_html_ratio_counts_visible_text_only() {
        // "Hello world" (11 chars) over the source length; script content is excluded.
        let src = "<p>Hello world</p><script>var x = 1;</script>";
        let ratio = text_html_ratio(&doc(src), src);
        assert_eq!(ratio, round2(11.0 / src.len() as f64 * 100.0));
        assert_eq!(text_html_ratio(&doc(""), ""), 0.0);
    }

    #[test]
    fn hyperlinks_resolve_classify_and_dedup() {
        let d = doc(r##"
            <a href="/about">About <b>us</b></a>
            <a href="about">Relative</a>
            <a href="https://example.com/about">Dup</a>
            <a href="https://other.org/x" rel="NoFollow sponsored">Other</a>
            <a href="https://www.example.com/">WWW is another host</a>
            <a href="#top">Top</a>
            <a href="mailto:a@b.c">Mail</a>
            <a href="javascript:void(0)">JS</a>
            <a href="">Empty</a>
            <a href="/img"><img src="x.png" alt="Logo"></a>
            <a>No href</a>
            "##);
        let links = hyperlinks(&d, &page());
        let summary: Vec<_> = links
            .iter()
            .map(|l| (l.url.as_str(), l.anchor.as_str(), l.kind, l.rel))
            .collect();
        assert_eq!(
            summary,
            vec![
                (
                    "https://example.com/about",
                    "About us",
                    LinkKind::Internal,
                    LinkRel::Follow
                ),
                (
                    "https://example.com/blog/about",
                    "Relative",
                    LinkKind::Internal,
                    LinkRel::Follow
                ),
                (
                    "https://other.org/x",
                    "Other",
                    LinkKind::External,
                    LinkRel::NoFollow
                ),
                (
                    "https://www.example.com/",
                    "WWW is another host",
                    LinkKind::External,
                    LinkRel::Follow
                ),
                (
                    "https://example.com/img",
                    "Logo",
                    LinkKind::Internal,
                    LinkRel::Follow
                ),
            ]
        );
    }

    #[test]
    fn hyperlinks_honor_base_href() {
        let d =
            doc(r#"<head><base href="https://cdn.example.com/docs/"></head><a href="page">P</a>"#);
        let links = hyperlinks(&d, &page());
        assert_eq!(links[0].url, "https://cdn.example.com/docs/page");
        assert_eq!(links[0].kind, LinkKind::External);
    }
}

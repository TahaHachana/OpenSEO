//! Page metadata beyond the basics in [`crate::html`]: indexing directives,
//! language, viewport, favicon, hreflang alternates, social tags and
//! structured data.

use std::sync::LazyLock;

use scraper::{ElementRef, Html, Selector};
use serde::Serialize;
use url::Url;

use crate::html::{base_url, is_meta_named, meta_elements, selector};

static HTML: LazyLock<Selector> = LazyLock::new(|| selector("html"));
static LINK_REL: LazyLock<Selector> = LazyLock::new(|| selector("link[rel][href]"));
static HREFLANG: LazyLock<Selector> = LazyLock::new(|| selector("link[rel][hreflang][href]"));
static JSON_LD: LazyLock<Selector> = LazyLock::new(|| selector("script[type]"));

/// Meta names whose robots directives apply to Google.
const ROBOTS_META_NAMES: &[&str] = &["robots", "googlebot"];

/// Whether `el`'s space-separated `rel` attribute contains `token`.
pub(crate) fn has_rel(el: ElementRef<'_>, token: &str) -> bool {
    el.value().attr("rel").is_some_and(|rel| {
        rel.split_whitespace()
            .any(|t| t.eq_ignore_ascii_case(token))
    })
}

/// The `content` of every `<meta name="robots">` and `<meta name="googlebot">`.
pub(crate) fn robots_metas(doc: &Html) -> impl Iterator<Item = (ElementRef<'_>, &str)> {
    meta_elements(doc).filter_map(|el| {
        let named = ROBOTS_META_NAMES.iter().any(|n| is_meta_named(el, n));
        named.then(|| (el, el.value().attr("content").unwrap_or("")))
    })
}

/// Robots directives from the page's meta tags, joined (`"noindex, nofollow"`).
pub fn robots(doc: &Html) -> Option<String> {
    let all: Vec<&str> = robots_metas(doc)
        .map(|(_, c)| c.trim())
        .filter(|c| !c.is_empty())
        .collect();
    (!all.is_empty()).then(|| all.join(", "))
}

/// Indexing directives in a robots meta tag or `X-Robots-Tag` value.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct Directives {
    pub noindex: bool,
    pub nofollow: bool,
}

impl Directives {
    /// Parses a comma-separated directive list. `none` means both.
    pub fn parse(value: &str) -> Self {
        let mut d = Self::default();
        for token in value.split(',').map(|t| t.trim().to_ascii_lowercase()) {
            match token.as_str() {
                "noindex" => d.noindex = true,
                "nofollow" => d.nofollow = true,
                "none" => {
                    d.noindex = true;
                    d.nofollow = true;
                }
                _ => {}
            }
        }
        d
    }
}

/// `<html lang>`, trimmed, if present and non-empty.
pub fn lang(doc: &Html) -> Option<String> {
    doc.select(&HTML)
        .next()
        .and_then(|el| el.value().attr("lang"))
        .map(str::trim)
        .filter(|l| !l.is_empty())
        .map(str::to_owned)
}

/// `<meta name="viewport">` content.
pub fn viewport(doc: &Html) -> Option<String> {
    meta_elements(doc)
        .find(|el| is_meta_named(*el, "viewport"))
        .map(|el| el.value().attr("content").unwrap_or("").trim().to_owned())
}

/// The favicon declared with `<link rel="icon">` (or `shortcut icon`,
/// `apple-touch-icon`), resolved to an absolute URL.
pub fn favicon(doc: &Html, page_url: &Url) -> Option<String> {
    let base = base_url(doc, page_url);
    let links: Vec<_> = doc.select(&LINK_REL).collect();
    ["icon", "apple-touch-icon"]
        .iter()
        .find_map(|rel| links.iter().find(|el| has_rel(**el, rel)))
        .and_then(|el| el.value().attr("href"))
        .and_then(|href| base.join(href.trim()).ok())
        .map(String::from)
}

/// A `<link rel="alternate" hreflang>` entry.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Hreflang {
    pub lang: String,
    /// Resolved to an absolute URL; `None` when the `href` is not a valid URL.
    pub url: Option<String>,
}

pub fn hreflang(doc: &Html, page_url: &Url) -> Vec<Hreflang> {
    let base = base_url(doc, page_url);
    doc.select(&HREFLANG)
        .filter(|el| has_rel(*el, "alternate"))
        .map(|el| Hreflang {
            lang: el.value().attr("hreflang").unwrap_or("").trim().to_owned(),
            url: el
                .value()
                .attr("href")
                .and_then(|href| base.join(href.trim()).ok())
                .filter(|u| matches!(u.scheme(), "http" | "https"))
                .map(String::from),
        })
        .collect()
}

/// An Open Graph (`og:…`) or Twitter card (`twitter:…`) meta tag.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialTag {
    pub name: String,
    pub content: String,
}

/// Open Graph and Twitter card tags in document order. Open Graph uses
/// `property`, Twitter uses `name`, and pages mix them up, so both are read.
pub fn social(doc: &Html) -> Vec<SocialTag> {
    meta_elements(doc)
        .filter_map(|el| {
            let v = el.value();
            let name = v.attr("property").or_else(|| v.attr("name"))?.trim();
            let lower = name.to_ascii_lowercase();
            (lower.starts_with("og:") || lower.starts_with("twitter:")).then(|| SocialTag {
                name: lower,
                content: v.attr("content").unwrap_or("").trim().to_owned(),
            })
        })
        .collect()
}

/// One `<script type="application/ld+json">` block.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StructuredData {
    /// Schema.org types declared (`@type`), including items of an `@graph`.
    pub types: Vec<String>,
    /// Whether the top-level items declare an `@context`.
    pub has_context: bool,
    /// The JSON parse error, if the block is not valid JSON.
    pub error: Option<String>,
}

pub(crate) fn json_ld_elements(doc: &Html) -> impl Iterator<Item = ElementRef<'_>> {
    doc.select(&JSON_LD).filter(|el| {
        el.value()
            .attr("type")
            .is_some_and(|t| t.trim().eq_ignore_ascii_case("application/ld+json"))
    })
}

pub fn structured_data(doc: &Html) -> Vec<StructuredData> {
    json_ld_elements(doc)
        .map(|el| parse_json_ld(&el.text().collect::<String>()))
        .collect()
}

fn parse_json_ld(text: &str) -> StructuredData {
    use serde_json::Value;

    let value: Value = match serde_json::from_str(text.trim()) {
        Ok(v) => v,
        Err(e) => {
            return StructuredData {
                types: Vec::new(),
                has_context: false,
                error: Some(e.to_string()),
            };
        }
    };
    let top: Vec<&Value> = match &value {
        Value::Array(items) => items.iter().collect(),
        other => vec![other],
    };
    let has_context = !top.is_empty() && top.iter().all(|v| v.get("@context").is_some());

    fn push_types(v: &Value, out: &mut Vec<String>) {
        match v.get("@type") {
            Some(Value::String(t)) => out.push(t.clone()),
            Some(Value::Array(ts)) => {
                out.extend(ts.iter().filter_map(Value::as_str).map(str::to_owned))
            }
            _ => {}
        }
        if let Some(Value::Array(graph)) = v.get("@graph") {
            for item in graph {
                push_types(item, out);
            }
        }
    }
    let mut types = Vec::new();
    for v in &top {
        push_types(v, &mut types);
    }
    StructuredData {
        types,
        has_context,
        error: None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn doc(html: &str) -> Html {
        Html::parse_document(html)
    }

    fn page() -> Url {
        Url::parse("https://example.com/en/page").unwrap()
    }

    #[test]
    fn robots_combines_robots_and_googlebot_metas() {
        let d = doc(
            r#"<meta name="Robots" content="noindex"><meta name="googlebot" content=" nofollow ">
            <meta name="bingbot" content="none">"#,
        );
        assert_eq!(robots(&d).as_deref(), Some("noindex, nofollow"));
        assert_eq!(robots(&doc("<p>")), None);
    }

    #[test]
    fn directives() {
        assert_eq!(
            Directives::parse("NoIndex, follow"),
            Directives {
                noindex: true,
                nofollow: false
            }
        );
        assert_eq!(
            Directives::parse("none"),
            Directives {
                noindex: true,
                nofollow: true
            }
        );
        assert_eq!(Directives::parse("max-snippet:-1"), Directives::default());
    }

    #[test]
    fn lang_viewport_favicon() {
        let d = doc(r#"<html lang=" fr-CA "><head>
            <meta name="viewport" content="width=device-width">
            <link rel="apple-touch-icon" href="/apple.png">
            <link rel="shortcut icon" href="/favicon.ico"></head></html>"#);
        assert_eq!(lang(&d).as_deref(), Some("fr-CA"));
        assert_eq!(viewport(&d).as_deref(), Some("width=device-width"));
        assert_eq!(
            favicon(&d, &page()).as_deref(),
            Some("https://example.com/favicon.ico")
        );
        assert_eq!(lang(&doc("<html lang=''>")), None);
    }

    #[test]
    fn hreflang_entries_are_resolved() {
        let d = doc(r#"<link rel="alternate" hreflang="de" href="/de/page">
            <link rel="alternate" hreflang="x-default" href="https://example.com/">
            <link rel="alternate" hreflang="fr" href="mailto:x@y.z">
            <link rel="canonical" hreflang="es" href="/es">"#);
        let h = hreflang(&d, &page());
        assert_eq!(h.len(), 3);
        assert_eq!(h[0].url.as_deref(), Some("https://example.com/de/page"));
        assert_eq!(h[1].lang, "x-default");
        assert_eq!(h[2].url, None);
    }

    #[test]
    fn social_reads_property_and_name() {
        let d = doc(
            r#"<meta property="og:title" content="T"><meta name="twitter:card" content="summary">
            <meta name="description" content="d"><meta name="OG:Image" content="/i.png">"#,
        );
        let names: Vec<_> = social(&d).into_iter().map(|t| t.name).collect();
        assert_eq!(names, ["og:title", "twitter:card", "og:image"]);
    }

    #[test]
    fn structured_data_types_and_errors() {
        let d = doc(r#"
            <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
            <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite"},{"@type":["Organization","Brand"]}]}</script>
            <script type="application/ld+json">{"@type":"Product",}</script>
            <script type="application/json">{"not":"ld"}</script>"#);
        let s = structured_data(&d);
        assert_eq!(s.len(), 3);
        assert_eq!(s[0].types, ["Article"]);
        assert!(s[0].has_context);
        assert_eq!(s[1].types, ["WebSite", "Organization", "Brand"]);
        assert!(s[2].error.is_some());
    }
}

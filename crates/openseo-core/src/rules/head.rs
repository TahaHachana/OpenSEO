//! Rules on the page's metadata: canonical URL, robots directives, language,
//! viewport, hreflang, social tags, structured data and favicon.

use std::collections::{BTreeSet, HashMap};
use std::sync::LazyLock;

use scraper::Selector;
use url::Url;

use super::{Page, Violation, ViolationCode, position_of};
use crate::head::{self, Directives, has_rel};
use crate::html::{base_url, selector};

static LINK_REL: LazyLock<Selector> = LazyLock::new(|| selector("link[rel]"));
static HTML: LazyLock<Selector> = LazyLock::new(|| selector("html"));

pub(super) fn check(page: &Page<'_>, out: &mut Vec<Violation>) {
    check_canonical(page, out);
    check_robots_meta(page, out);
    check_lang(page, out);
    check_viewport(page, out);
    check_hreflang(page, out);
    check_social(page, out);
    check_structured_data(page, out);
    check_favicon(page, out);
}

pub(crate) fn without_fragment(url: &Url) -> String {
    let mut url = url.clone();
    url.set_fragment(None);
    url.into()
}

fn check_canonical(page: &Page<'_>, out: &mut Vec<Violation>) {
    let base = base_url(page.doc, page.url);
    let links: Vec<_> = page
        .doc
        .select(&LINK_REL)
        .filter(|el| has_rel(*el, "canonical"))
        .collect();
    let Some(&first) = links.first() else {
        return out.push(Violation::new(
            ViolationCode::CanonicalMissing,
            "Without <link rel=\"canonical\">, search engines decide which variant of the URL (with or without parameters, http or https, trailing slash) to index.",
            None,
        ));
    };
    let resolve = |href: Option<&str>| {
        href.and_then(|h| base.join(h.trim()).ok())
            .filter(|u| matches!(u.scheme(), "http" | "https"))
    };
    let distinct: BTreeSet<_> = links
        .iter()
        .map(|el| resolve(el.value().attr("href")).map(|u| without_fragment(&u)))
        .collect();
    if distinct.len() > 1 {
        return out.push(Violation::new(
            ViolationCode::CanonicalMultiple,
            format!(
                "The page has {} canonical links pointing to different URLs. Google ignores all of them when they conflict.",
                links.len()
            ),
            position_of(page.doc, &page.map, links[1]),
        ));
    }
    let href = first.value().attr("href");
    let position = position_of(page.doc, &page.map, first);
    let Some(canonical) = resolve(href) else {
        return out.push(Violation::new(
            ViolationCode::CanonicalInvalid,
            format!(
                "The canonical link points to {:?}, which is not a valid http(s) URL.",
                href.unwrap_or("")
            ),
            position,
        ));
    };
    if without_fragment(&canonical) != without_fragment(page.url) {
        out.push(Violation::new(
            ViolationCode::CanonicalElsewhere,
            format!("This page names {canonical} as its canonical URL, so search engines will likely index that URL instead of this one."),
            position,
        ));
    }
    if page.url.scheme() == "https" && canonical.scheme() == "http" {
        out.push(Violation::new(
            ViolationCode::CanonicalInsecure,
            format!("The page is served over HTTPS but its canonical URL is {canonical}."),
            position,
        ));
    }
}

fn check_robots_meta(page: &Page<'_>, out: &mut Vec<Violation>) {
    let mut noindex = None;
    let mut nofollow = None;
    for (el, content) in head::robots_metas(page.doc) {
        let d = Directives::parse(content);
        let name = el.value().attr("name").unwrap_or("robots").trim();
        let tag = format!("<meta name=\"{name}\" content=\"{}\">", content.trim());
        if d.noindex && noindex.is_none() {
            noindex = Some((tag.clone(), el));
        }
        if d.nofollow && nofollow.is_none() {
            nofollow = Some((tag, el));
        }
    }
    if let Some((tag, el)) = noindex {
        out.push(Violation::new(
            ViolationCode::Noindex,
            format!("{tag} keeps the page out of search results."),
            position_of(page.doc, &page.map, el),
        ));
    }
    if let Some((tag, el)) = nofollow {
        out.push(Violation::new(
            ViolationCode::Nofollow,
            format!("{tag} tells search engines not to follow any link on the page, so pages linked only from here may not be discovered."),
            position_of(page.doc, &page.map, el),
        ));
    }
}

fn check_lang(page: &Page<'_>, out: &mut Vec<Violation>) {
    if head::lang(page.doc).is_none() {
        let position = page
            .doc
            .select(&HTML)
            .next()
            .and_then(|el| position_of(page.doc, &page.map, el));
        out.push(Violation::new(
            ViolationCode::LangMissing,
            "The <html> element has no lang attribute. Screen readers use it to pick a pronunciation, and browsers and search engines use it as a language hint.",
            position,
        ));
    }
}

/// `key=value` pairs of a viewport `content`, keys lowercased.
fn viewport_pairs(content: &str) -> HashMap<String, String> {
    content
        .split([',', ';'])
        .filter_map(|pair| {
            let (k, v) = pair.split_once('=')?;
            Some((k.trim().to_ascii_lowercase(), v.trim().to_ascii_lowercase()))
        })
        .collect()
}

fn check_viewport(page: &Page<'_>, out: &mut Vec<Violation>) {
    let Some(content) = head::viewport(page.doc) else {
        return out.push(Violation::new(
            ViolationCode::ViewportMissing,
            "Without <meta name=\"viewport\">, phones render the page at desktop width and shrink it. Google indexes the mobile version of pages.",
            None,
        ));
    };
    let pairs = viewport_pairs(&content);
    if pairs.get("width").map(String::as_str) != Some("device-width") {
        out.push(Violation::new(
            ViolationCode::ViewportNotResponsive,
            format!("The viewport is {content:?}, without width=device-width, so the page doesn't adapt to phone screens."),
            None,
        ));
    }
    let no_zoom = matches!(
        pairs.get("user-scalable").map(String::as_str),
        Some("no" | "0")
    );
    let max_scale_low = pairs
        .get("maximum-scale")
        .and_then(|s| s.parse::<f64>().ok())
        .is_some_and(|s| s < 2.0);
    if no_zoom || max_scale_low {
        out.push(Violation::new(
            ViolationCode::ZoomDisabled,
            format!("The viewport ({content:?}) stops users from zooming in, which makes the page hard to read for people with low vision."),
            None,
        ));
    }
}

/// `en`, `en-GB`, `zh-Hant`, `zh-Hant-TW`, `es-419` or `x-default`.
fn valid_hreflang(code: &str) -> bool {
    if code.eq_ignore_ascii_case("x-default") {
        return true;
    }
    let parts: Vec<&str> = code.split('-').collect();
    let alpha = |s: &str, n: usize| s.len() == n && s.chars().all(|c| c.is_ascii_alphabetic());
    let region = |s: &str| alpha(s, 2) || (s.len() == 3 && s.chars().all(|c| c.is_ascii_digit()));
    match parts.as_slice() {
        [lang] => alpha(lang, 2) || alpha(lang, 3),
        [lang, sub] => (alpha(lang, 2) || alpha(lang, 3)) && (alpha(sub, 4) || region(sub)),
        [lang, script, reg] => {
            (alpha(lang, 2) || alpha(lang, 3)) && alpha(script, 4) && region(reg)
        }
        _ => false,
    }
}

fn check_hreflang(page: &Page<'_>, out: &mut Vec<Violation>) {
    let entries = head::hreflang(page.doc, page.url);
    if entries.is_empty() {
        return;
    }
    for e in &entries {
        let problem = if !valid_hreflang(&e.lang) {
            Some(format!(
                "hreflang {:?} is not a language code (use en or en-GB, with a hyphen).",
                e.lang
            ))
        } else if e.url.is_none() {
            Some(format!(
                "hreflang {:?} doesn't point to a valid http(s) URL.",
                e.lang
            ))
        } else {
            None
        };
        if let Some(problem) = problem {
            out.push(Violation::new(
                ViolationCode::HreflangInvalid,
                problem,
                None,
            ));
        }
    }
    let this = without_fragment(page.url);
    let lists_self = entries.iter().any(|e| {
        e.url
            .as_deref()
            .and_then(|u| Url::parse(u).ok())
            .is_some_and(|u| without_fragment(&u) == this)
    });
    if !lists_self {
        out.push(Violation::new(
            ViolationCode::HreflangMissingSelf,
            format!(
                "The page lists {} language alternates, but none points to the page itself. Google may ignore annotations that aren't confirmed both ways.",
                entries.len()
            ),
            None,
        ));
    }
    let mut by_lang: HashMap<String, BTreeSet<&str>> = HashMap::new();
    for e in &entries {
        if let Some(url) = e.url.as_deref() {
            by_lang
                .entry(e.lang.to_ascii_lowercase())
                .or_default()
                .insert(url);
        }
    }
    let mut duplicates: Vec<_> = by_lang
        .into_iter()
        .filter(|(_, urls)| urls.len() > 1)
        .collect();
    duplicates.sort();
    for (lang, urls) in duplicates {
        out.push(Violation::new(
            ViolationCode::HreflangDuplicate,
            format!(
                "hreflang \"{lang}\" points to {} different URLs.",
                urls.len()
            ),
            None,
        ));
    }
}

const OPEN_GRAPH_BASICS: &[&str] = &["og:title", "og:type", "og:image", "og:url"];

fn check_social(page: &Page<'_>, out: &mut Vec<Violation>) {
    let tags = head::social(page.doc);
    let has = |name: &str| tags.iter().any(|t| t.name == name && !t.content.is_empty());
    if !tags.iter().any(|t| t.name.starts_with("og:")) {
        out.push(Violation::new(
            ViolationCode::OpenGraphMissing,
            "When the page is shared on Facebook, LinkedIn, Slack and the like, the preview's title, image and description are guessed from the page.",
            None,
        ));
    } else {
        let missing: Vec<_> = OPEN_GRAPH_BASICS
            .iter()
            .copied()
            .filter(|n| !has(n))
            .collect();
        if !missing.is_empty() {
            out.push(Violation::new(
                ViolationCode::OpenGraphIncomplete,
                format!(
                    "Missing: {}. Social networks then guess these from the page.",
                    missing.join(", ")
                ),
                None,
            ));
        }
    }
    if let Some(image) = tags
        .iter()
        .find(|t| t.name == "og:image" && !t.content.is_empty())
        && !Url::parse(&image.content).is_ok_and(|u| matches!(u.scheme(), "http" | "https"))
    {
        out.push(Violation::new(
            ViolationCode::OpenGraphImageRelative,
            format!("og:image is {:?}. Social networks need an absolute URL and won't show the image otherwise.", image.content),
            None,
        ));
    }
    if !has("twitter:card") {
        out.push(Violation::new(
            ViolationCode::TwitterCardMissing,
            "Without twitter:card, X shows a small summary preview. (It falls back to Open Graph for the title, description and image.)",
            None,
        ));
    }
}

fn check_structured_data(page: &Page<'_>, out: &mut Vec<Violation>) {
    let blocks: Vec<_> = head::json_ld_elements(page.doc).collect();
    if blocks.is_empty() {
        return out.push(Violation::new(
            ViolationCode::StructuredDataMissing,
            "JSON-LD structured data (schema.org) helps search engines understand the page and can earn rich results: ratings, prices, breadcrumbs, events…",
            None,
        ));
    }
    for (el, data) in blocks.iter().zip(head::structured_data(page.doc)) {
        let position = position_of(page.doc, &page.map, *el);
        if let Some(error) = data.error {
            out.push(Violation::new(
                ViolationCode::StructuredDataInvalid,
                format!("Search engines ignore structured data they can't parse ({error})."),
                position,
            ));
        } else if !data.has_context {
            out.push(Violation::new(
                ViolationCode::StructuredDataNoContext,
                "Without \"@context\": \"https://schema.org\", the types and properties in this block aren't recognized.",
                position,
            ));
        }
    }
}

fn check_favicon(page: &Page<'_>, out: &mut Vec<Violation>) {
    if head::favicon(page.doc, page.url).is_none() {
        out.push(Violation::new(
            ViolationCode::FaviconMissing,
            "Browsers and Google then fall back to /favicon.ico, which may not exist. Google shows the favicon next to the page in search results.",
            None,
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::super::ViolationCode::*;
    use super::super::test_util::codes_in;
    use super::*;

    const URL: &str = "https://example.com/page";

    fn codes(head: &str, only: &[ViolationCode]) -> Vec<ViolationCode> {
        codes_in(
            &format!("<html><head>{head}</head><body></body></html>"),
            URL,
            only,
        )
    }

    #[test]
    fn canonical_rules() {
        let only = &[
            CanonicalMissing,
            CanonicalMultiple,
            CanonicalInvalid,
            CanonicalElsewhere,
            CanonicalInsecure,
        ];
        assert_eq!(codes("", only), [CanonicalMissing]);
        assert_eq!(
            codes(r#"<link rel="canonical" href="/page#top">"#, only),
            []
        );
        assert_eq!(
            codes(
                r#"<link rel="canonical" href="/page"><link rel="canonical" href="https://example.com/page">"#,
                only
            ),
            [],
            "duplicates of the same URL are harmless"
        );
        assert_eq!(
            codes(
                r#"<link rel="canonical" href="/a"><link rel="canonical" href="/b">"#,
                only
            ),
            [CanonicalMultiple]
        );
        assert_eq!(
            codes(r#"<link rel="canonical" href="javascript:x">"#, only),
            [CanonicalInvalid]
        );
        assert_eq!(
            codes(r#"<link rel="canonical" href="/other">"#, only),
            [CanonicalElsewhere]
        );
        assert_eq!(
            codes(
                r#"<link rel="canonical" href="http://example.com/page">"#,
                only
            ),
            [CanonicalElsewhere, CanonicalInsecure]
        );
    }

    #[test]
    fn robots_meta_rules() {
        let only = &[Noindex, Nofollow];
        assert_eq!(
            codes(r#"<meta name="robots" content="index, follow">"#, only),
            []
        );
        assert_eq!(
            codes(r#"<meta name="robots" content="noindex">"#, only),
            [Noindex]
        );
        assert_eq!(
            codes(r#"<meta name="googlebot" content="none">"#, only),
            [Noindex, Nofollow]
        );
        assert_eq!(
            codes(r#"<meta name="bingbot" content="noindex">"#, only),
            []
        );
    }

    #[test]
    fn lang_and_viewport_rules() {
        let only = &[
            LangMissing,
            ViewportMissing,
            ViewportNotResponsive,
            ZoomDisabled,
        ];
        assert_eq!(codes("", only), [LangMissing, ViewportMissing]);
        let page = |viewport: &str| {
            codes_in(
                &format!(
                    r#"<html lang="en"><head><meta name="viewport" content="{viewport}"></head></html>"#
                ),
                URL,
                only,
            )
        };
        assert_eq!(page("width=device-width, initial-scale=1"), []);
        assert_eq!(page("width=1024"), [ViewportNotResponsive]);
        assert_eq!(page("width=device-width, user-scalable=no"), [ZoomDisabled]);
        assert_eq!(
            page("width=device-width; maximum-scale=1.0"),
            [ZoomDisabled]
        );
    }

    #[test]
    fn hreflang_validation() {
        for ok in [
            "en",
            "en-GB",
            "zh-Hant",
            "zh-Hant-TW",
            "es-419",
            "X-Default",
            "fil",
        ] {
            assert!(valid_hreflang(ok), "{ok}");
        }
        for bad in ["en_US", "english", "en-", "e", "en-GB-x"] {
            assert!(!valid_hreflang(bad), "{bad}");
        }
    }

    #[test]
    fn hreflang_rules() {
        let only = &[HreflangInvalid, HreflangMissingSelf, HreflangDuplicate];
        assert_eq!(codes("", only), []);
        let alt = |lang: &str, href: &str| {
            format!(r#"<link rel="alternate" hreflang="{lang}" href="{href}">"#)
        };
        assert_eq!(
            codes(&(alt("en", "/page") + &alt("de", "/de/page")), only),
            []
        );
        assert_eq!(codes(&alt("de", "/de/page"), only), [HreflangMissingSelf]);
        assert_eq!(
            codes(
                &(alt("en_US", "/page") + &alt("de", "/de/a") + &alt("DE", "/de/b")),
                only
            ),
            [HreflangInvalid, HreflangDuplicate]
        );
    }

    #[test]
    fn social_rules() {
        let only = &[
            OpenGraphMissing,
            OpenGraphIncomplete,
            OpenGraphImageRelative,
            TwitterCardMissing,
        ];
        assert_eq!(codes("", only), [OpenGraphMissing, TwitterCardMissing]);
        let full = r#"<meta property="og:title" content="T"><meta property="og:type" content="website">
            <meta property="og:url" content="https://example.com/page"><meta name="twitter:card" content="summary">"#;
        assert_eq!(
            codes(
                &format!(r#"{full}<meta property="og:image" content="https://example.com/i.png">"#),
                only
            ),
            []
        );
        assert_eq!(codes(full, only), [OpenGraphIncomplete]);
        assert_eq!(
            codes(
                &format!(r#"{full}<meta property="og:image" content="/i.png">"#),
                only
            ),
            [OpenGraphImageRelative]
        );
    }

    #[test]
    fn structured_data_rules() {
        let only = &[
            StructuredDataInvalid,
            StructuredDataNoContext,
            StructuredDataMissing,
        ];
        assert_eq!(codes("", only), [StructuredDataMissing]);
        let ld = |json: &str| format!(r#"<script type="application/ld+json">{json}</script>"#);
        assert_eq!(
            codes(
                &ld(r#"{"@context":"https://schema.org","@type":"Thing"}"#),
                only
            ),
            []
        );
        assert_eq!(
            codes(&ld(r#"{"@type":"Thing"}"#), only),
            [StructuredDataNoContext]
        );
        assert_eq!(codes(&ld(r#"{"@type":}"#), only), [StructuredDataInvalid]);
    }

    #[test]
    fn favicon_rule() {
        assert_eq!(codes("", &[FaviconMissing]), [FaviconMissing]);
        assert_eq!(
            codes(r#"<link rel="icon" href="/f.png">"#, &[FaviconMissing]),
            []
        );
    }
}

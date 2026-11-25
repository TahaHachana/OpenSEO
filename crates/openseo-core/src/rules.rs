//! Markup rule checks. Port of `SEOLib.Violations`.
//!
//! Thresholds, levels and messages are copied verbatim from SEOLib so the
//! output can be compared with the original tool. Modernizing them is Phase 6.
//!
//! Deliberate fixes over SEOLib:
//! - Meta refresh is detected on `http-equiv="refresh"`. SEOLib matched
//!   `name="refresh"`, which real pages don't use, so the rule never fired.
//! - Meta description length counts the whole decoded content. SEOLib's regex
//!   stopped at the first apostrophe.
//! - An `<h1>` holding only an image with `alt` text (a common logo pattern) is not empty.
//! - The query-parameter rule checks the final URL after redirects.

use std::sync::LazyLock;

use scraper::{ElementRef, Html, Selector};
use serde::Serialize;
use url::Url;

use crate::html::{self, selector};
use crate::source::{Position, SourceMap};
use crate::text::visible_text;

static IMG: LazyLock<Selector> = LazyLock::new(|| selector("img"));
static IMG_ALT: LazyLock<Selector> = LazyLock::new(|| selector("img[alt]"));
static H1: LazyLock<Selector> = LazyLock::new(|| selector("h1"));
static STYLE: LazyLock<Selector> = LazyLock::new(|| selector("style"));
static SCRIPT: LazyLock<Selector> = LazyLock::new(|| selector("script"));
static LINKS: LazyLock<Selector> = LazyLock::new(|| selector("a[href]"));

const DESCRIPTION_MIN: usize = 25;
const DESCRIPTION_MAX: usize = 150;
const TITLE_MIN: usize = 5;
const TITLE_MAX: usize = 65;
const INLINE_BLOCK_MAX: usize = 1024;
const QUERY_PARAMS_MAX: usize = 4;
const LINKS_MAX: usize = 250;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum Level {
    Error,
    Warning,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum Category {
    Content,
    Performance,
    #[serde(rename = "SEO")]
    Seo,
    Standards,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum ViolationCode {
    AltEmpty,
    AltMissing,
    DescriptionEmpty,
    DescriptionLong,
    DescriptionMissing,
    DescriptionMultiple,
    DescriptionShort,
    H1Empty,
    H1Missing,
    H1Multiple,
    LargeInlineCss,
    LargeInlineScript,
    QueryParameterCount,
    RefreshToRedirect,
    TitleEqDescription,
    TitleEmpty,
    TitleLong,
    TitleMissing,
    TitleShort,
    TooManyLinks,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Violation {
    pub code: ViolationCode,
    pub category: Category,
    pub level: Level,
    pub heading: String,
    pub description: String,
    pub recommendation: String,
    pub position: Option<Position>,
}

impl Violation {
    /// Builds a violation. `n` fills the count/length in descriptions that have one.
    fn new(code: ViolationCode, n: usize, position: Option<Position>) -> Self {
        use Category::*;
        use Level::*;
        use ViolationCode::*;

        const ALT_DESC: &str = "The \"alt\" attribute is used to provide relevant information about the image to search engines.";
        const DESC_RANGE: &str = "The description must be between 25 and 150 characters long, human readable, actionable, and rich in keywords.";
        const H1_DESC: &str = "The <h1> heading summarizes the page’s topic.";
        const TITLE_RANGE: &str = "The title must be between 5 and 65 characters long.";

        let (category, level, heading, description, recommendation): (_, _, &str, String, &str) =
            match code {
                AltMissing => (Seo, Warning,
                    "The \"alt\" attribute of the <img> tag is missing.",
                    ALT_DESC.into(),
                    "Add an \"alt\" attribute that describes the image."),
                AltEmpty => (Seo, Warning,
                    "The \"alt\" attribute of the <img> tag is empty.",
                    ALT_DESC.into(),
                    "Add content to the \"alt\" attribute."),
                DescriptionEmpty => (Seo, Warning,
                    "The meta description is empty.",
                    "The meta description tag is empty. The description meta tag is used to provide a short description of the page.".into(),
                    "Modify the meta description tag in the <head> section of the page to contain the page's description."),
                DescriptionLong => (Seo, Warning,
                    "The meta description is too long.",
                    format!("The content of the meta description tag is too long ({n} characters). The description must not exceed 150 characters."),
                    DESC_RANGE),
                DescriptionShort => (Seo, Warning,
                    "The meta description is too short.",
                    format!("The content of the meta description tag is too short ({n} characters). The description must be at least 25 characters long."),
                    DESC_RANGE),
                DescriptionMissing => (Seo, Warning,
                    "The meta description is missing.",
                    "The page's markup does not contain the meta description tag.".into(),
                    "Add a meta description tag to the <head> section of the page."),
                DescriptionMultiple => (Standards, Warning,
                    "The page contains multiple meta description tags.",
                    format!("The page's markup contains {n} meta description tags."),
                    "Keep a single meta description tag on the page."),
                H1Missing => (Seo, Warning,
                    "The <h1> tag is missing.",
                    H1_DESC.into(),
                    "Add an <h1> tag to the <body> section of the page."),
                H1Empty => (Seo, Warning,
                    "The <h1> tag is empty.",
                    H1_DESC.into(),
                    "Add a keyword rich heading inside the <h1> tag."),
                H1Multiple => (Standards, Warning,
                    "The page contains multiple <h1> tags.",
                    format!("{H1_DESC} Search engines diminish the value of a page that contains multiple <h1> tags."),
                    "Use the <h1> tag once per page."),
                LargeInlineCss => (Performance, Warning,
                    "The page contains a large number of CSS definitions.",
                    format!("The page contains a large block of embedded Cascading Style Sheet (CSS) code ({n} characters). Search engines will ignore CSS code, but large quantities of CSS code that precede the actual text content of the page will force the text content further down in the HTML."),
                    "Move large blocks of CSS code to externally linked CSS files."),
                LargeInlineScript => (Performance, Warning,
                    "The page contains a large amount of script code.",
                    format!("The page contains a large block of embedded script code ({n} characters). Search engines will ignore script code, but large quantities of script will force the actual text content of the page further down in the HTML."),
                    "Move all inline script code to externally linked script files."),
                QueryParameterCount => (Seo, Warning,
                    "The URL contains too many query string parameters.",
                    format!("The URL contains {n} query string parameters. Most search engines will analyze up to four URL parameters and ignore any additional parameters."),
                    "Consider reducing the number of query string parameters, or use a URL Rewrite Module to simplify the URL structure."),
                TitleMissing => (Seo, Error,
                    "The title is missing.",
                    "The page markup does not contain the <title> tag. An inaccurate or irrelevant title can affect how the content of the page is indexed, ranked, and presented by search engines.".into(),
                    "Add the <title> tag inside the <head> section of the page."),
                TitleEmpty => (Seo, Error,
                    "The title is empty.",
                    "The <title> tag is empty. An inaccurate or irrelevant title can affect how the content of the page is indexed, ranked, and presented by search engines.".into(),
                    "Add a relevant title inside the <title> tag."),
                TitleLong => (Seo, Warning,
                    "The title is too long.",
                    format!("The text in the <title> tag is too long ({n} characters). The title must not exceed 65 characters, including spaces. Most search engines will truncate the text in the <title> tag after a fixed number of characters."),
                    TITLE_RANGE),
                TitleShort => (Seo, Warning,
                    "The title is too short.",
                    format!("The text in the <title> tag is too short ({n} characters). The title must contain at least 5 characters. A title that is too short can affect how the content of the page is indexed, ranked, and presented by search engines."),
                    TITLE_RANGE),
                TitleEqDescription => (Seo, Warning,
                    "The title and description are identical.",
                    "The <title> and the meta description tags of the page contain identical text.".into(),
                    "Don't reuse the page's title in the meta description."),
                TooManyLinks => (Seo, Error,
                    "The page contains too many hyperlinks.",
                    format!("The page contains {n} links. Too many links in the same page may affect the indexing process that is used by search engine crawlers. This may result in poor search rankings for the page or in the search engine ignoring the page."),
                    "Reduce the number of links on the page to less than 250."),
                RefreshToRedirect => (Standards, Warning,
                    "The page uses a refresh definition instead of using redirection.",
                    "The page uses a meta refresh tag to implement redirection. Using meta refresh syntax is discouraged by the W3C, because unexpected refresh may confuse users and may impair the \"back\" button functionality in some browsers.".into(),
                    "Use HTTP Redirection instead of using HTTP Refresh headers or meta refresh tags."),
            };
        Violation {
            code,
            category,
            level,
            heading: heading.into(),
            description,
            recommendation: recommendation.into(),
            position,
        }
    }
}

/// Positions of the elements with a given tag name, indexed by DOM order.
struct Locator<'a> {
    map: &'a SourceMap<'a>,
    offsets: Vec<usize>,
}

impl<'a> Locator<'a> {
    fn new(map: &'a SourceMap<'a>, tag: &str) -> Self {
        Self {
            map,
            offsets: map.tag_offsets(tag),
        }
    }

    fn at(&self, index: usize) -> Option<Position> {
        self.offsets.get(index).map(|&o| self.map.position(o))
    }
}

/// Checks a page against all rules, in SEOLib's order.
pub fn review(doc: &Html, source: &str, url: &Url) -> Vec<Violation> {
    let map = SourceMap::new(source);
    let mut out = Vec::new();
    check_alt(doc, &map, &mut out);
    check_meta_description(doc, &map, &mut out);
    check_h1(doc, &map, &mut out);
    check_inline_blocks(
        doc,
        &map,
        &STYLE,
        "style",
        ViolationCode::LargeInlineCss,
        &mut out,
    );
    check_inline_blocks(
        doc,
        &map,
        &SCRIPT,
        "script",
        ViolationCode::LargeInlineScript,
        &mut out,
    );
    check_query(url, &mut out);
    check_title(doc, &map, &mut out);
    check_links(doc, &mut out);
    check_meta_refresh(doc, &map, &mut out);
    out
}

fn check_alt(doc: &Html, map: &SourceMap<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(map, "img");
    for (i, img) in doc.select(&IMG).enumerate() {
        let code = match img.value().attr("alt") {
            None => ViolationCode::AltMissing,
            Some("") => ViolationCode::AltEmpty,
            Some(_) => continue,
        };
        out.push(Violation::new(code, 0, loc.at(i)));
    }
}

fn check_meta_description(doc: &Html, map: &SourceMap<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(map, "meta");
    let descriptions: Vec<_> = html::meta_elements(doc)
        .enumerate()
        .filter(|(_, el)| html::is_meta_named(*el, "description"))
        .collect();
    let (i, el) = match descriptions.as_slice() {
        [] => return out.push(Violation::new(ViolationCode::DescriptionMissing, 0, None)),
        [one] => *one,
        many => {
            return out.push(Violation::new(
                ViolationCode::DescriptionMultiple,
                many.len(),
                None,
            ));
        }
    };
    let len = el
        .value()
        .attr("content")
        .map_or(0, |c| c.trim().chars().count());
    let code = match len {
        0 => ViolationCode::DescriptionEmpty,
        n if n > DESCRIPTION_MAX => ViolationCode::DescriptionLong,
        n if n < DESCRIPTION_MIN => ViolationCode::DescriptionShort,
        _ => return,
    };
    out.push(Violation::new(code, len, loc.at(i)));
}

fn has_content(el: ElementRef<'_>) -> bool {
    !visible_text(*el).is_empty()
        || el.select(&IMG_ALT).any(|img| {
            img.value()
                .attr("alt")
                .is_some_and(|a| !a.trim().is_empty())
        })
}

fn check_h1(doc: &Html, map: &SourceMap<'_>, out: &mut Vec<Violation>) {
    let h1s: Vec<_> = doc.select(&H1).collect();
    match h1s.as_slice() {
        [] => out.push(Violation::new(ViolationCode::H1Missing, 0, None)),
        [h1] if !has_content(*h1) => {
            let loc = Locator::new(map, "h1");
            out.push(Violation::new(ViolationCode::H1Empty, 0, loc.at(0)));
        }
        [_] => {}
        _ => out.push(Violation::new(ViolationCode::H1Multiple, 0, None)),
    }
}

fn check_inline_blocks(
    doc: &Html,
    map: &SourceMap<'_>,
    sel: &Selector,
    tag: &str,
    code: ViolationCode,
    out: &mut Vec<Violation>,
) {
    let loc = Locator::new(map, tag);
    for (i, el) in doc.select(sel).enumerate() {
        let len: usize = el.text().map(|t| t.chars().count()).sum();
        if len > INLINE_BLOCK_MAX {
            out.push(Violation::new(code, len, loc.at(i)));
        }
    }
}

fn check_query(url: &Url, out: &mut Vec<Violation>) {
    let count = url.query_pairs().count();
    if count > QUERY_PARAMS_MAX {
        out.push(Violation::new(
            ViolationCode::QueryParameterCount,
            count,
            None,
        ));
    }
}

fn check_title(doc: &Html, map: &SourceMap<'_>, out: &mut Vec<Violation>) {
    let Some((index, _)) = html::title_element(doc) else {
        return out.push(Violation::new(ViolationCode::TitleMissing, 0, None));
    };
    let title = html::title(doc).unwrap_or_default();
    let pos = Locator::new(map, "title").at(index);
    let len = title.chars().count();
    let code = match len {
        0 => Some(ViolationCode::TitleEmpty),
        n if n < TITLE_MIN => Some(ViolationCode::TitleShort),
        n if n > TITLE_MAX => Some(ViolationCode::TitleLong),
        _ => None,
    };
    if let Some(code) = code {
        out.push(Violation::new(code, len, pos));
    }
    if let Some(description) = html::meta_description(doc)
        && !title.is_empty()
        && title.to_lowercase() == description.to_lowercase()
    {
        out.push(Violation::new(ViolationCode::TitleEqDescription, 0, None));
    }
}

fn check_links(doc: &Html, out: &mut Vec<Violation>) {
    let count = doc.select(&LINKS).count();
    if count > LINKS_MAX {
        out.push(Violation::new(ViolationCode::TooManyLinks, count, None));
    }
}

fn check_meta_refresh(doc: &Html, map: &SourceMap<'_>, out: &mut Vec<Violation>) {
    let refresh = html::meta_elements(doc).position(|el| {
        el.value()
            .attr("http-equiv")
            .is_some_and(|v| v.trim().eq_ignore_ascii_case("refresh"))
    });
    if let Some(i) = refresh {
        let loc = Locator::new(map, "meta");
        out.push(Violation::new(
            ViolationCode::RefreshToRedirect,
            0,
            loc.at(i),
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::ViolationCode::*;
    use super::*;

    const OK_HEAD: &str = r#"<title>A good page title</title><meta name="description" content="A description that is long enough to pass the rule.">"#;

    fn codes_for(html: &str, url: &str) -> Vec<ViolationCode> {
        let doc = Html::parse_document(html);
        review(&doc, html, &Url::parse(url).unwrap())
            .into_iter()
            .map(|v| v.code)
            .collect()
    }

    fn codes(body: &str) -> Vec<ViolationCode> {
        codes_for(
            &format!("{OK_HEAD}<h1>Heading</h1>{body}"),
            "https://example.com/",
        )
    }

    #[test]
    fn clean_page_has_no_violations() {
        assert_eq!(codes(r#"<img src=a alt="A cat">"#), vec![]);
    }

    #[test]
    fn alt_missing_and_empty() {
        assert_eq!(
            codes(r#"<img src=a><img src=b alt=""><img src=c alt=x>"#),
            vec![AltMissing, AltEmpty]
        );
    }

    #[test]
    fn description_rules() {
        let page = |head: &str| {
            codes_for(
                &format!("<title>Good title</title>{head}<h1>H</h1>"),
                "https://e.com/",
            )
        };
        assert_eq!(page(""), vec![DescriptionMissing]);
        assert_eq!(page(r#"<meta name="description">"#), vec![DescriptionEmpty]);
        assert_eq!(
            page(r#"<meta name="description" content="too short">"#),
            vec![DescriptionShort]
        );
        let long = "x".repeat(151);
        assert_eq!(
            page(&format!(r#"<meta name="description" content="{long}">"#)),
            vec![DescriptionLong]
        );
        assert_eq!(
            page(r#"<meta name="description" content="a"><meta name="DESCRIPTION" content="b">"#),
            vec![DescriptionMultiple]
        );
        // SEOLib stopped counting at the apostrophe and reported this as too short.
        assert_eq!(
            page(
                r#"<meta name="description" content="It's a description long enough to pass the rule.">"#
            ),
            vec![]
        );
    }

    #[test]
    fn h1_rules() {
        let page = |body: &str| codes_for(&format!("{OK_HEAD}{body}"), "https://e.com/");
        assert_eq!(page(""), vec![H1Missing]);
        assert_eq!(page("<h1> </h1>"), vec![H1Empty]);
        assert_eq!(page("<h1>a</h1><h1>b</h1>"), vec![H1Multiple]);
        assert_eq!(page(r#"<h1><img src=logo alt="Acme"></h1>"#), vec![]);
    }

    #[test]
    fn large_inline_blocks() {
        let big = "x".repeat(1025);
        let ok = "x".repeat(1024);
        assert_eq!(
            codes(&format!(
                "<style>{big}</style><style>{ok}</style><script>{big}</script>"
            )),
            vec![LargeInlineCss, LargeInlineScript]
        );
    }

    #[test]
    fn query_parameters() {
        let page = format!("{OK_HEAD}<h1>H</h1>");
        assert_eq!(codes_for(&page, "https://e.com/?a=1&b=2&c=3&d=4"), vec![]);
        assert_eq!(
            codes_for(&page, "https://e.com/?a=1&b=2&c=3&d=4&e"),
            vec![QueryParameterCount]
        );
    }

    #[test]
    fn title_rules() {
        let desc = r#"<meta name="description" content="A description that is long enough to pass the rule.">"#;
        let page = |head: &str| codes_for(&format!("{head}{desc}<h1>H</h1>"), "https://e.com/");
        assert_eq!(page(""), vec![TitleMissing]);
        assert_eq!(page("<title> </title>"), vec![TitleEmpty]);
        assert_eq!(page("<title>Hey</title>"), vec![TitleShort]);
        assert_eq!(
            page(&format!("<title>{}</title>", "t".repeat(66))),
            vec![TitleLong]
        );
        assert_eq!(
            page("<title>A DESCRIPTION that is long enough to pass the rule.</title>"),
            vec![TitleEqDescription]
        );
    }

    #[test]
    fn too_many_links() {
        assert_eq!(codes(&"<a href=/x>x</a>".repeat(250)), vec![]);
        assert_eq!(codes(&"<a href=/x>x</a>".repeat(251)), vec![TooManyLinks]);
    }

    #[test]
    fn meta_refresh_uses_http_equiv() {
        assert_eq!(
            codes(r#"<meta http-equiv="Refresh" content="0; url=/x">"#),
            vec![RefreshToRedirect]
        );
        assert_eq!(codes(r#"<meta name="refresh" content="0">"#), vec![]);
    }

    #[test]
    fn errors_carry_source_positions() {
        let html = format!("{OK_HEAD}\n<h1>H</h1>\n  <img src=a>");
        let doc = Html::parse_document(&html);
        let v = review(&doc, &html, &Url::parse("https://e.com/").unwrap());
        assert_eq!(v[0].position, Some(Position { line: 3, column: 3 }));
        assert_eq!(v[0].level, Level::Warning);
        assert_eq!(v[0].category, Category::Seo);
    }
}

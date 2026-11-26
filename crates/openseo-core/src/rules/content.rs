//! Content rules ported from SEOLib: title, description, headings, images'
//! alt text, inline code size, URL parameters, link count, meta refresh.

use std::sync::LazyLock;

use scraper::{ElementRef, Selector};

use super::{Locator, Page, Violation, ViolationCode};
use crate::html::{self, selector};
use crate::text::visible_text;

static IMG: LazyLock<Selector> = LazyLock::new(|| selector("img"));
static IMG_ALT: LazyLock<Selector> = LazyLock::new(|| selector("img[alt]"));
static H1: LazyLock<Selector> = LazyLock::new(|| selector("h1"));
static STYLE: LazyLock<Selector> = LazyLock::new(|| selector("style"));
static SCRIPT: LazyLock<Selector> = LazyLock::new(|| selector("script"));
static LINKS: LazyLock<Selector> = LazyLock::new(|| selector("a[href]"));

pub(super) const TITLE_MIN: usize = 30;
pub(super) const TITLE_MAX: usize = 60;
pub(super) const DESCRIPTION_MIN: usize = 70;
pub(super) const DESCRIPTION_MAX: usize = 160;
const INLINE_BLOCK_MAX: usize = 20_000;
const QUERY_PARAMS_MAX: usize = 4;
const LINKS_MAX: usize = 1000;

pub(super) fn check(page: &Page<'_>, out: &mut Vec<Violation>) {
    check_alt(page, out);
    check_meta_description(page, out);
    check_h1(page, out);
    check_inline_css(page, out);
    check_inline_scripts(page, out);
    check_query(page, out);
    check_title(page, out);
    check_links(page, out);
    check_meta_refresh(page, out);
}

/// One warning per image without `alt`; one notice for all decorative
/// (`alt=""`) images, since that is correct markup for most of them.
fn check_alt(page: &Page<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(&page.map, "img");
    let mut decorative = Vec::new();
    for (i, img) in page.doc.select(&IMG).enumerate() {
        match img.value().attr("alt") {
            None => {
                let src = img.value().attr("src").unwrap_or("").trim();
                let which = if src.is_empty() || src.starts_with("data:") {
                    "An image".to_owned()
                } else {
                    format!("The image {src}")
                };
                out.push(Violation::new(
                    ViolationCode::AltMissing,
                    format!("{which} has no alt text. Search engines and screen readers rely on it to understand images."),
                    loc.at(i),
                ));
            }
            Some(alt) if alt.trim().is_empty() => decorative.push(i),
            Some(_) => {}
        }
    }
    if let Some(&first) = decorative.first() {
        let n = decorative.len();
        let which = if n == 1 {
            "1 image is".to_owned()
        } else {
            format!("{n} images are")
        };
        out.push(Violation::new(
            ViolationCode::AltEmpty,
            format!("{which} marked as decorative (alt=\"\"): screen readers skip them and search engines get no text for them. The position is the first one's."),
            loc.at(first),
        ));
    }
}

fn check_meta_description(page: &Page<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(&page.map, "meta");
    let descriptions: Vec<_> = html::meta_elements(page.doc)
        .enumerate()
        .filter(|(_, el)| html::is_meta_named(*el, "description"))
        .collect();
    let (i, el) = match descriptions.as_slice() {
        [] => {
            return out.push(Violation::new(
                ViolationCode::DescriptionMissing,
                "Without a meta description, search engines build the result snippet from page text, which may not represent the page well.",
                None,
            ));
        }
        [one] => *one,
        many => {
            return out.push(Violation::new(
                ViolationCode::DescriptionMultiple,
                format!(
                    "The page has {} meta description tags; search engines may use any of them.",
                    many.len()
                ),
                loc.at(many[1].0),
            ));
        }
    };
    let len = el
        .value()
        .attr("content")
        .map_or(0, |c| c.trim().chars().count());
    let (code, description) = match len {
        0 => (
            ViolationCode::DescriptionEmpty,
            "The meta description tag has no content, so search engines build the snippet from page text.".to_owned(),
        ),
        n if n > DESCRIPTION_MAX => (
            ViolationCode::DescriptionLong,
            format!("The meta description has {n} characters. Google truncates snippets after about {DESCRIPTION_MAX} characters (around 920 pixels on desktop)."),
        ),
        n if n < DESCRIPTION_MIN => (
            ViolationCode::DescriptionShort,
            format!("The meta description has {n} characters. Under {DESCRIPTION_MIN} characters it wastes snippet space, and Google is more likely to replace it with text from the page."),
        ),
        _ => return,
    };
    out.push(Violation::new(code, description, loc.at(i)));
}

fn has_content(el: ElementRef<'_>) -> bool {
    !visible_text(*el).is_empty()
        || el.select(&IMG_ALT).any(|img| {
            img.value()
                .attr("alt")
                .is_some_and(|a| !a.trim().is_empty())
        })
}

fn check_h1(page: &Page<'_>, out: &mut Vec<Violation>) {
    let h1s: Vec<_> = page.doc.select(&H1).collect();
    let loc = || Locator::new(&page.map, "h1");
    match h1s.as_slice() {
        [] => out.push(Violation::new(
            ViolationCode::H1Missing,
            "The main heading tells users and search engines what the page is about.",
            None,
        )),
        [h1] if !has_content(*h1) => out.push(Violation::new(
            ViolationCode::H1Empty,
            "The page's <h1> has no text, so it doesn't say what the page is about.",
            loc().at(0),
        )),
        [_] => {}
        many => out.push(Violation::new(
            ViolationCode::H1Multiple,
            format!(
                "The page has {} <h1> elements. Google handles several fine, but one main heading keeps the outline clear for users and assistive technology.",
                many.len()
            ),
            loc().at(1),
        )),
    }
}

fn check_inline_css(page: &Page<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(&page.map, "style");
    for (i, el) in page.doc.select(&STYLE).enumerate() {
        let len: usize = el.text().map(|t| t.chars().count()).sum();
        if len > INLINE_BLOCK_MAX {
            out.push(Violation::new(
                ViolationCode::LargeInlineCss,
                format!("A <style> block of {len} characters is downloaded with every page view and can't be cached separately. Inlining a little critical CSS helps the first render; large blocks slow it down."),
                loc.at(i),
            ));
        }
    }
}

/// Whether a `<script>` holds JavaScript, as opposed to data (JSON, JSON-LD,
/// templates), which browsers don't execute.
fn is_javascript(el: ElementRef<'_>) -> bool {
    match el
        .value()
        .attr("type")
        .map(|t| t.trim().to_ascii_lowercase())
    {
        None => true,
        Some(t) => {
            t.is_empty() || t == "module" || t.contains("javascript") || t.contains("ecmascript")
        }
    }
}

fn check_inline_scripts(page: &Page<'_>, out: &mut Vec<Violation>) {
    let loc = Locator::new(&page.map, "script");
    for (i, el) in page.doc.select(&SCRIPT).enumerate() {
        if !is_javascript(el) {
            continue;
        }
        let len: usize = el.text().map(|t| t.chars().count()).sum();
        if len > INLINE_BLOCK_MAX {
            out.push(Violation::new(
                ViolationCode::LargeInlineScript,
                format!("A <script> block of {len} characters is downloaded with every page view, can't be cached separately, and delays parsing."),
                loc.at(i),
            ));
        }
    }
}

fn check_query(page: &Page<'_>, out: &mut Vec<Violation>) {
    let count = page.url.query_pairs().count();
    if count > QUERY_PARAMS_MAX {
        out.push(Violation::new(
            ViolationCode::QueryParameterCount,
            format!("The URL has {count} query parameters. Parameter combinations create many URLs for the same content, which wastes crawl budget and splits ranking signals."),
            None,
        ));
    }
}

fn check_title(page: &Page<'_>, out: &mut Vec<Violation>) {
    let Some((index, _)) = html::title_element(page.doc) else {
        return out.push(Violation::new(
            ViolationCode::TitleMissing,
            "The page has no <title>. Search engines show the title as the headline of the result, and browsers show it in tabs and bookmarks.",
            None,
        ));
    };
    let title = html::title(page.doc).unwrap_or_default();
    let pos = Locator::new(&page.map, "title").at(index);
    let len = title.chars().count();
    let found = match len {
        0 => Some((
            ViolationCode::TitleEmpty,
            "The <title> is empty. Search engines show the title as the headline of the result, so they will make one up.".to_owned(),
        )),
        n if n < TITLE_MIN => Some((
            ViolationCode::TitleShort,
            format!("The title has {n} characters. Short titles miss the chance to describe the page, and Google is more likely to rewrite them."),
        )),
        n if n > TITLE_MAX => Some((
            ViolationCode::TitleLong,
            format!("The title has {n} characters. Google truncates titles after about {TITLE_MAX} characters (around 580 pixels)."),
        )),
        _ => None,
    };
    if let Some((code, description)) = found {
        out.push(Violation::new(code, description, pos));
    }
    if let Some(description) = html::meta_description(page.doc)
        && !title.is_empty()
        && title.to_lowercase() == description.to_lowercase()
    {
        out.push(Violation::new(
            ViolationCode::TitleEqDescription,
            "The <title> and the meta description contain the same text, so the result snippet repeats the headline.",
            None,
        ));
    }
}

fn check_links(page: &Page<'_>, out: &mut Vec<Violation>) {
    let count = page.doc.select(&LINKS).count();
    if count > LINKS_MAX {
        out.push(Violation::new(
            ViolationCode::TooManyLinks,
            format!("The page has {count} links. Search engines no longer set a limit, but each link passes a smaller share of the page's value, and very long link lists are hard to use."),
            None,
        ));
    }
}

fn check_meta_refresh(page: &Page<'_>, out: &mut Vec<Violation>) {
    let refresh = html::meta_elements(page.doc).position(|el| {
        el.value()
            .attr("http-equiv")
            .is_some_and(|v| v.trim().eq_ignore_ascii_case("refresh"))
    });
    if let Some(i) = refresh {
        out.push(Violation::new(
            ViolationCode::RefreshToRedirect,
            "The page uses <meta http-equiv=\"refresh\">. It breaks the back button, is slower than a server redirect, and search engines may not treat it as a permanent move.",
            Locator::new(&page.map, "meta").at(i),
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::super::test_util::{OK_HEAD, codes_in, violations_for};
    use super::super::{Category, Level, ViolationCode::*};
    use super::*;
    use crate::source::Position;

    const CONTENT: &[ViolationCode] = &[
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
    ];

    fn codes_for(html: &str, url: &str) -> Vec<ViolationCode> {
        codes_in(html, url, CONTENT)
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
                &format!("<title>A good page title that is long enough</title>{head}<h1>H</h1>"),
                "https://e.com/",
            )
        };
        assert_eq!(page(""), vec![DescriptionMissing]);
        assert_eq!(page(r#"<meta name="description">"#), vec![DescriptionEmpty]);
        let sized = |n: usize| {
            page(&format!(
                r#"<meta name="description" content="{}">"#,
                "x".repeat(n)
            ))
        };
        assert_eq!(sized(69), vec![DescriptionShort]);
        assert_eq!(sized(70), vec![]);
        assert_eq!(sized(160), vec![]);
        assert_eq!(sized(161), vec![DescriptionLong]);
        assert_eq!(
            page(r#"<meta name="description" content="a"><meta name="DESCRIPTION" content="b">"#),
            vec![DescriptionMultiple]
        );
        // SEOLib stopped counting at the apostrophe and reported this as too short.
        assert_eq!(
            page(
                r#"<meta name="description" content="It's a description long enough to pass the rule, well over seventy characters.">"#
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
    fn large_inline_blocks_ignore_json_scripts() {
        let big = "x".repeat(20_001);
        let ok = "x".repeat(20_000);
        assert_eq!(
            codes(&format!(
                r#"<style>{big}</style><style>{ok}</style><script>{big}</script>
                <script type="module">{big}</script>
                <script type="application/ld+json">{big}</script><script type="application/json">{big}</script>"#
            )),
            vec![LargeInlineCss, LargeInlineScript, LargeInlineScript]
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
        let desc = r#"<meta name="description" content="A description that is long enough to pass the rule, at seventy characters or more.">"#;
        let page = |head: &str| codes_for(&format!("{head}{desc}<h1>H</h1>"), "https://e.com/");
        assert_eq!(page(""), vec![TitleMissing]);
        assert_eq!(page("<title> </title>"), vec![TitleEmpty]);
        let sized = |n: usize| page(&format!("<title>{}</title>", "t".repeat(n)));
        assert_eq!(sized(29), vec![TitleShort]);
        assert_eq!(sized(30), vec![]);
        assert_eq!(sized(60), vec![]);
        assert_eq!(sized(61), vec![TitleLong]);
        assert_eq!(
            page(
                "<title>A DESCRIPTION that is long enough to pass the rule, at seventy characters or more.</title>"
            ),
            vec![TitleLong, TitleEqDescription]
        );
    }

    #[test]
    fn too_many_links() {
        assert_eq!(codes(&"<a href=/x>x</a>".repeat(1000)), vec![]);
        assert_eq!(codes(&"<a href=/x>x</a>".repeat(1001)), vec![TooManyLinks]);
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
    fn violations_carry_levels_and_source_positions() {
        let html = format!("{OK_HEAD}\n<h1>H</h1>\n  <img src=a>");
        let v: Vec<_> = violations_for(&html, "https://e.com/")
            .into_iter()
            .filter(|v| v.code == AltMissing)
            .collect();
        assert_eq!(v[0].position, Some(Position { line: 3, column: 3 }));
        assert_eq!(v[0].level, Level::Warning);
        assert_eq!(v[0].category, Category::Seo);
        assert!(v[0].description.starts_with("The image a "));
    }
}

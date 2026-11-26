//! Rule checks: each finding is a [`Violation`] with a level, a category and
//! advice.
//!
//! - [`review`]: rules on the HTML document and its URL. They apply to the raw
//!   and the rendered page alike.
//! - [`review_response`]: rules on the HTTP response (headers, redirects).
//! - Crawl rules (robots.txt, sitemaps) live in [`crate::crawl`], since they
//!   need more requests.
//!
//! The rules started as a port of SEOLib's `Violations` module (Phase 1). Phase 6
//! modernized them; differences from SEOLib 0.7:
//! - Title 30–60 characters (was 5–65), meta description 70–160 (was 25–150),
//!   matching what Google displays today.
//! - The 250-link error is now a notice above 1,000 links: Google dropped its
//!   link-count guideline.
//! - Multiple `<h1>`s and URLs with many parameters are notices: neither is an
//!   indexing problem for current search engines.
//! - An empty `alt` is a notice: it is the correct markup for decorative images.
//! - Inline CSS/JS is flagged above 20,000 characters (was 1,024): inlining
//!   critical CSS is recommended practice. JSON data blocks (`application/json`,
//!   JSON-LD) are not scripts and are not counted.
//! - Bugs fixed while porting: meta refresh is detected on `http-equiv`, the
//!   description length counts the whole content (SEOLib stopped at an
//!   apostrophe), an `<h1>` holding only an image with `alt` text is not
//!   empty, and the query rule checks the final URL after redirects.

mod content;
mod head;
mod resources;
mod response;

use scraper::{ElementRef, Html};
use serde::Serialize;
use url::Url;

use crate::source::{Position, SourceMap};

pub(crate) use head::without_fragment;
pub use response::review_response;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum Level {
    /// Keeps the page out of search results or breaks it for users.
    Error,
    /// Likely hurts how the page ranks, looks in results, or performs.
    Warning,
    /// A best practice that is missing, or a fact worth knowing.
    Notice,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum Category {
    Content,
    Performance,
    #[serde(rename = "SEO")]
    Seo,
    Standards,
    Security,
    Social,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum ViolationCode {
    // Content (ported from SEOLib, thresholds modernized)
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
    // Head metadata
    CanonicalMissing,
    CanonicalMultiple,
    CanonicalInvalid,
    CanonicalElsewhere,
    CanonicalInsecure,
    Noindex,
    Nofollow,
    LangMissing,
    ViewportMissing,
    ViewportNotResponsive,
    ZoomDisabled,
    HreflangInvalid,
    HreflangMissingSelf,
    HreflangDuplicate,
    OpenGraphMissing,
    OpenGraphIncomplete,
    OpenGraphImageRelative,
    TwitterCardMissing,
    StructuredDataInvalid,
    StructuredDataNoContext,
    StructuredDataMissing,
    FaviconMissing,
    // Resources
    NotHttps,
    MixedContentActive,
    MixedContentPassive,
    ImageNoDimensions,
    LazyFirstImage,
    // HTTP response
    HstsMissing,
    RedirectChain,
    TemporaryRedirect,
    // Crawling
    RobotsBlocked,
    RobotsServerError,
    RobotsUnreachable,
    RobotsMissing,
    SitemapMissing,
    SitemapNotListed,
    SitemapError,
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

/// The fixed part of a rule: everything but the description, which each
/// check writes with the specifics it found.
struct Spec {
    category: Category,
    level: Level,
    heading: &'static str,
    recommendation: &'static str,
}

const fn spec(
    category: Category,
    level: Level,
    heading: &'static str,
    recommendation: &'static str,
) -> Spec {
    Spec {
        category,
        level,
        heading,
        recommendation,
    }
}

const TITLE_ADVICE: &str =
    "Keep titles between 30 and 60 characters, with the most important words first.";
const DESCRIPTION_ADVICE: &str =
    "Write a 70–160 character summary of the page that makes people want to click.";
const VIEWPORT_ADVICE: &str =
    "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.";
const OPEN_GRAPH_ADVICE: &str = "Add og:title, og:type, og:image and og:url meta tags.";
const HTTPS_RESOURCE_ADVICE: &str = "Load the resource over https.";

impl ViolationCode {
    fn spec(self) -> Spec {
        use Category::*;
        use Level::*;
        use ViolationCode::*;
        match self {
            AltMissing => spec(
                Seo,
                Warning,
                "An image has no \"alt\" attribute.",
                "Add an \"alt\" attribute that describes the image, or alt=\"\" if it is purely decorative.",
            ),
            AltEmpty => spec(
                Seo,
                Notice,
                "An image has an empty \"alt\" attribute.",
                "Keep alt=\"\" for decorative images; describe images that carry meaning (product photos, charts, image links).",
            ),
            DescriptionEmpty => spec(
                Seo,
                Warning,
                "The meta description is empty.",
                DESCRIPTION_ADVICE,
            ),
            DescriptionLong => spec(
                Seo,
                Warning,
                "The meta description is too long.",
                DESCRIPTION_ADVICE,
            ),
            DescriptionShort => spec(
                Seo,
                Warning,
                "The meta description is too short.",
                DESCRIPTION_ADVICE,
            ),
            DescriptionMissing => spec(
                Seo,
                Warning,
                "The meta description is missing.",
                "Add a <meta name=\"description\"> tag with a 70–160 character summary of the page.",
            ),
            DescriptionMultiple => spec(
                Standards,
                Warning,
                "The page has several meta descriptions.",
                "Keep a single meta description tag.",
            ),
            H1Missing => spec(
                Seo,
                Warning,
                "The page has no <h1> heading.",
                "Add one <h1> that summarizes the page's topic.",
            ),
            H1Empty => spec(
                Seo,
                Warning,
                "The <h1> heading is empty.",
                "Put the page's main heading text in the <h1>.",
            ),
            H1Multiple => spec(
                Standards,
                Notice,
                "The page has several <h1> headings.",
                "Consider one <h1> for the main topic and <h2>–<h6> for sections.",
            ),
            LargeInlineCss => spec(
                Performance,
                Warning,
                "The page embeds a large block of CSS.",
                "Inline only the CSS needed for the first screen and load the rest from a cached stylesheet.",
            ),
            LargeInlineScript => spec(
                Performance,
                Warning,
                "The page embeds a large block of JavaScript.",
                "Move large scripts to external files that browsers can cache.",
            ),
            QueryParameterCount => spec(
                Seo,
                Notice,
                "The URL has many query parameters.",
                "Prefer short, descriptive paths, and point parameter variants to one URL with a canonical link.",
            ),
            RefreshToRedirect => spec(
                Standards,
                Warning,
                "The page redirects with a meta refresh.",
                "Use an HTTP 301 redirect instead.",
            ),
            TitleEqDescription => spec(
                Seo,
                Warning,
                "The title and meta description are identical.",
                "Write a description that adds to the title instead of repeating it.",
            ),
            TitleMissing => spec(
                Seo,
                Error,
                "The title is missing.",
                "Add a <title> inside the <head> of the page.",
            ),
            TitleEmpty => spec(
                Seo,
                Error,
                "The title is empty.",
                "Put a descriptive title inside the <title> tag.",
            ),
            TitleLong => spec(Seo, Warning, "The title is too long.", TITLE_ADVICE),
            TitleShort => spec(Seo, Warning, "The title is too short.", TITLE_ADVICE),
            TooManyLinks => spec(
                Seo,
                Notice,
                "The page has a very large number of links.",
                "Keep navigation focused and link to the pages that matter most.",
            ),

            CanonicalMissing => spec(
                Seo,
                Warning,
                "The page has no canonical URL.",
                "Add a <link rel=\"canonical\"> pointing to the preferred URL of this page, usually the page itself.",
            ),
            CanonicalMultiple => spec(
                Seo,
                Error,
                "The page declares several canonical URLs.",
                "Keep a single canonical link.",
            ),
            CanonicalInvalid => spec(
                Seo,
                Error,
                "The canonical URL is invalid.",
                "Use an absolute http(s) URL in the canonical link.",
            ),
            CanonicalElsewhere => spec(
                Seo,
                Notice,
                "The canonical URL points to another page.",
                "Fine for duplicates and variants of another page; otherwise point the canonical link to this page.",
            ),
            CanonicalInsecure => spec(
                Security,
                Warning,
                "The canonical URL uses http.",
                "Point the canonical link to the https URL.",
            ),
            Noindex => spec(
                Seo,
                Error,
                "The page asks search engines not to index it.",
                "Remove noindex if the page should appear in search results.",
            ),
            Nofollow => spec(
                Seo,
                Warning,
                "The page asks search engines not to follow its links.",
                "Remove nofollow unless you deliberately don't want this page's links crawled.",
            ),
            LangMissing => spec(
                Standards,
                Warning,
                "The page doesn't declare its language.",
                "Add a lang attribute to the <html> element, e.g. <html lang=\"en\">.",
            ),
            ViewportMissing => spec(
                Seo,
                Warning,
                "The page has no viewport meta tag.",
                VIEWPORT_ADVICE,
            ),
            ViewportNotResponsive => spec(
                Seo,
                Warning,
                "The viewport doesn't adapt to the device width.",
                VIEWPORT_ADVICE,
            ),
            ZoomDisabled => spec(
                Standards,
                Notice,
                "The viewport prevents zooming.",
                "Remove user-scalable=no, and any maximum-scale below 2.",
            ),
            HreflangInvalid => spec(
                Seo,
                Warning,
                "An hreflang annotation is invalid.",
                "Use a language code (en), optionally with a region (en-GB), or x-default, with an absolute URL.",
            ),
            HreflangMissingSelf => spec(
                Seo,
                Warning,
                "The hreflang annotations don't include this page.",
                "Add an hreflang link for this page's own language that points to its own URL.",
            ),
            HreflangDuplicate => spec(
                Seo,
                Warning,
                "An hreflang code points to several URLs.",
                "Map each language-region code to exactly one URL.",
            ),
            OpenGraphMissing => spec(
                Social,
                Notice,
                "The page has no Open Graph tags.",
                OPEN_GRAPH_ADVICE,
            ),
            OpenGraphIncomplete => spec(
                Social,
                Notice,
                "Some basic Open Graph tags are missing.",
                OPEN_GRAPH_ADVICE,
            ),
            OpenGraphImageRelative => spec(
                Social,
                Warning,
                "The og:image URL is not absolute.",
                "Use a full https:// URL for og:image.",
            ),
            TwitterCardMissing => spec(
                Social,
                Notice,
                "The page has no Twitter card tag.",
                "Add <meta name=\"twitter:card\" content=\"summary_large_image\"> for a large image preview.",
            ),
            StructuredDataInvalid => spec(
                Seo,
                Error,
                "A JSON-LD block is not valid JSON.",
                "Fix the JSON syntax, then check the page with Google's Rich Results Test.",
            ),
            StructuredDataNoContext => spec(
                Seo,
                Warning,
                "A JSON-LD block has no @context.",
                "Add \"@context\": \"https://schema.org\" to the top-level object.",
            ),
            StructuredDataMissing => spec(
                Seo,
                Notice,
                "The page has no structured data.",
                "Add JSON-LD for the page type, e.g. Article, Product, Organization or BreadcrumbList.",
            ),
            FaviconMissing => spec(
                Standards,
                Notice,
                "The page doesn't declare a favicon.",
                "Add <link rel=\"icon\" href=\"/favicon.ico\">. Google wants a square icon of at least 48×48 pixels.",
            ),

            NotHttps => spec(
                Security,
                Error,
                "The page is not served over HTTPS.",
                "Serve the site over HTTPS and redirect http URLs to it with 301 redirects.",
            ),
            MixedContentActive => spec(
                Security,
                Error,
                "A script, stylesheet or frame loads over http.",
                HTTPS_RESOURCE_ADVICE,
            ),
            MixedContentPassive => spec(
                Security,
                Warning,
                "An image or media file loads over http.",
                HTTPS_RESOURCE_ADVICE,
            ),
            ImageNoDimensions => spec(
                Performance,
                Warning,
                "Images lack width and height attributes.",
                "Set width and height attributes (or a CSS aspect-ratio) on images so the browser can reserve their space.",
            ),
            LazyFirstImage => spec(
                Performance,
                Warning,
                "The first image is lazy-loaded.",
                "Load images in the first screen eagerly; lazy-load only those further down.",
            ),

            HstsMissing => spec(
                Security,
                Warning,
                "The response has no Strict-Transport-Security header.",
                "Send Strict-Transport-Security: max-age=31536000; includeSubDomains.",
            ),
            RedirectChain => spec(
                Seo,
                Warning,
                "The URL goes through a chain of redirects.",
                "Redirect to the final URL in a single step, and update links to point to it directly.",
            ),
            TemporaryRedirect => spec(
                Seo,
                Notice,
                "The URL uses a temporary redirect.",
                "Use a 301 (or 308) redirect for permanent moves.",
            ),

            RobotsBlocked => spec(
                Seo,
                Error,
                "robots.txt blocks Googlebot from this page.",
                "If the page belongs in search results, remove or narrow the rule. To keep a page out of the index, allow crawling and use noindex instead.",
            ),
            RobotsServerError => spec(
                Seo,
                Error,
                "robots.txt returns a server error.",
                "Make robots.txt return 200 (or 404 if you have none).",
            ),
            RobotsUnreachable => spec(
                Seo,
                Warning,
                "robots.txt could not be fetched.",
                "Check that robots.txt is reachable for crawlers.",
            ),
            RobotsMissing => spec(
                Seo,
                Notice,
                "The site has no robots.txt.",
                "Add a robots.txt, if only to point crawlers to your sitemap.",
            ),
            SitemapMissing => spec(
                Seo,
                Warning,
                "No XML sitemap was found.",
                "Create an XML sitemap and reference it in robots.txt with a Sitemap: line.",
            ),
            SitemapNotListed => spec(
                Seo,
                Warning,
                "The page is not in the sitemap.",
                "List every page you want indexed in the sitemap, by its canonical URL.",
            ),
            SitemapError => spec(
                Seo,
                Warning,
                "A sitemap could not be read.",
                "Make sure the sitemap returns 200 with valid sitemap XML.",
            ),
        }
    }
}

impl Violation {
    pub(crate) fn new(
        code: ViolationCode,
        description: impl Into<String>,
        position: Option<Position>,
    ) -> Self {
        let spec = code.spec();
        Violation {
            code,
            category: spec.category,
            level: spec.level,
            heading: spec.heading.into(),
            description: description.into(),
            recommendation: spec.recommendation.into(),
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

/// Source position of any element: its index among same-named elements in
/// document order, matched with the opening tags in the source.
fn position_of(doc: &Html, map: &SourceMap<'_>, el: ElementRef<'_>) -> Option<Position> {
    let name = el.value().name();
    let index = doc
        .root_element()
        .descendants()
        .filter_map(ElementRef::wrap)
        .filter(|e| e.value().name() == name)
        .position(|e| e.id() == el.id())?;
    Locator::new(map, name).at(index)
}

/// The inputs every document rule needs.
struct Page<'a> {
    doc: &'a Html,
    map: SourceMap<'a>,
    url: &'a Url,
}

/// Checks the HTML document served at `url` against all document rules.
pub fn review(doc: &Html, source: &str, url: &Url) -> Vec<Violation> {
    let page = Page {
        doc,
        map: SourceMap::new(source),
        url,
    };
    let mut out = Vec::new();
    content::check(&page, &mut out);
    head::check(&page, &mut out);
    resources::check(&page, &mut out);
    out
}

#[cfg(test)]
mod test_util {
    use super::*;

    pub(super) const OK_HEAD: &str = r#"<title>A good page title that is long enough</title><meta name="description" content="A description that is long enough to pass the rule, at seventy characters or more.">"#;

    pub(super) fn violations_for(html: &str, url: &str) -> Vec<Violation> {
        let doc = Html::parse_document(html);
        review(&doc, html, &Url::parse(url).unwrap())
    }

    /// Codes of the violations, leaving out the head and resource rules that
    /// a minimal test page trips (canonical, lang, viewport, social…), so
    /// each test sees only what it is about.
    pub(super) fn codes_in(html: &str, url: &str, only: &[ViolationCode]) -> Vec<ViolationCode> {
        violations_for(html, url)
            .into_iter()
            .map(|v| v.code)
            .filter(|c| only.contains(c))
            .collect()
    }
}

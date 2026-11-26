//! Full page review: fetch, then analyze. Port of the original site's `Review` module.

use scraper::Html;
use serde::Serialize;
use url::Url;

use crate::fetch::{self, FetchOptions, Fetched};
use crate::head::{self, Hreflang, SocialTag, StructuredData};
use crate::html::{self, ElementTexts, Heading, Hyperlink};
use crate::keywords::{self, Keyword};
use crate::rules::{self, Level, Violation};

/// Everything derived from an HTML document. Independent of how it was obtained,
/// so a rendered DOM is analyzed the same way as the raw response.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Analysis {
    pub title: Option<String>,
    pub meta_description: Option<String>,
    pub meta_keywords: Option<String>,
    /// `<link rel="canonical">`, resolved to an absolute URL.
    pub canonical: Option<String>,
    /// Directives of the robots and googlebot meta tags (`"noindex, nofollow"`).
    pub robots: Option<String>,
    /// `<html lang>`.
    pub lang: Option<String>,
    /// `<meta name="viewport">` content.
    pub viewport: Option<String>,
    /// Declared favicon, resolved to an absolute URL.
    pub favicon: Option<String>,
    pub hreflang: Vec<Hreflang>,
    /// Open Graph and Twitter card tags.
    pub social: Vec<SocialTag>,
    /// JSON-LD blocks.
    pub structured_data: Vec<StructuredData>,
    pub headings: Vec<Heading>,
    pub text_html_ratio: f64,
    pub keywords: Vec<Keyword>,
    pub links: Vec<Hyperlink>,
    pub errors: Vec<Violation>,
    pub warnings: Vec<Violation>,
    pub notices: Vec<Violation>,
}

/// Analyzes an HTML document served at `url`.
pub fn analyze(source: &str, url: &Url) -> Analysis {
    analyze_with_text(source, url, &ElementTexts::default())
}

/// [`analyze`], with heading and anchor text a browser computed (see
/// [`ElementTexts`]) in place of the DOM text where it is available.
pub fn analyze_with_text(source: &str, url: &Url, text: &ElementTexts) -> Analysis {
    let doc = Html::parse_document(source);
    let violations = rules::review(&doc, source, url);
    let of = |level| {
        violations
            .iter()
            .filter(|v| v.level == level)
            .cloned()
            .collect()
    };
    let (errors, warnings, notices) = (of(Level::Error), of(Level::Warning), of(Level::Notice));
    Analysis {
        title: html::title(&doc),
        meta_description: html::meta_description(&doc),
        meta_keywords: html::meta_keywords(&doc),
        canonical: html::canonical(&doc, url),
        robots: head::robots(&doc),
        lang: head::lang(&doc),
        viewport: head::viewport(&doc),
        favicon: head::favicon(&doc, url),
        hreflang: head::hreflang(&doc, url),
        social: head::social(&doc),
        structured_data: head::structured_data(&doc),
        headings: html::headings_with(&doc, &text.headings),
        text_html_ratio: html::text_html_ratio(&doc, source),
        keywords: keywords::analyze(&doc),
        links: html::hyperlinks_with(&doc, url, &text.links),
        errors,
        warnings,
        notices,
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Review {
    pub http: Fetched,
    pub content: Analysis,
    /// Findings on the HTTP response (headers, redirects), independent of
    /// which HTML is analyzed.
    pub http_issues: Vec<Violation>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "result", rename_all = "camelCase")]
pub enum ReviewResult {
    /// The input could not be turned into an http(s) URL.
    InvalidUrl {
        input: String,
    },
    /// No HTTP response (DNS, connection, TLS, timeout, redirect loop…).
    FetchFailed {
        url: Url,
        reason: String,
    },
    /// The server answered with a status other than 200.
    HttpError {
        http: Fetched,
    },
    /// The response is not an HTML document.
    NotHtml {
        http: Fetched,
    },
    Success(Box<Review>),
}

/// Reviews the page at `input` (a URL, `http://` assumed when the scheme is missing).
pub async fn review(input: &str, options: &FetchOptions) -> ReviewResult {
    let Some(url) = crate::url::normalize(input) else {
        return ReviewResult::InvalidUrl {
            input: input.to_owned(),
        };
    };
    let mut http = match fetch::fetch(&url, options).await {
        Ok(http) => http,
        Err(e) => {
            return ReviewResult::FetchFailed {
                url,
                reason: e.to_string(),
            };
        }
    };
    if http.status != 200 {
        return ReviewResult::HttpError { http };
    }
    let Some(source) = http.html.take() else {
        return ReviewResult::NotHtml { http };
    };
    let content = analyze(&source, &http.final_url);
    let http_issues = rules::review_response(&http);
    ReviewResult::Success(Box::new(Review {
        http,
        content,
        http_issues,
    }))
}

//! Full page review: fetch, then analyze. Port of the original site's `Review` module.

use scraper::Html;
use serde::Serialize;
use url::Url;

use crate::fetch::{self, FetchOptions, Fetched};
use crate::html::{self, Heading, Hyperlink};
use crate::keywords::{self, Keyword};
use crate::rules::{self, Level, Violation};

/// Everything derived from an HTML document. Independent of how it was obtained,
/// so a rendered DOM (Phase 5) can be analyzed the same way as the raw response.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Analysis {
    pub title: Option<String>,
    pub meta_description: Option<String>,
    pub meta_keywords: Option<String>,
    pub headings: Vec<Heading>,
    pub text_html_ratio: f64,
    pub keywords: Vec<Keyword>,
    pub links: Vec<Hyperlink>,
    pub errors: Vec<Violation>,
    pub warnings: Vec<Violation>,
}

/// Analyzes an HTML document served at `url`.
pub fn analyze(source: &str, url: &Url) -> Analysis {
    let doc = Html::parse_document(source);
    let (errors, warnings) = rules::review(&doc, source, url)
        .into_iter()
        .partition(|v| v.level == Level::Error);
    Analysis {
        title: html::title(&doc),
        meta_description: html::meta_description(&doc),
        meta_keywords: html::meta_keywords(&doc),
        headings: html::headings(&doc),
        text_html_ratio: html::text_html_ratio(&doc, source),
        keywords: keywords::analyze(&doc),
        links: html::hyperlinks(&doc, url),
        errors,
        warnings,
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Review {
    pub http: Fetched,
    pub content: Analysis,
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
    ReviewResult::Success(Box::new(Review { http, content }))
}

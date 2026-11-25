//! Fetching a page over HTTP. Port of `SEOLib.Http`.
//!
//! Redirects are followed manually so the report can show the full chain.

use std::time::{Duration, Instant};

use reqwest::{StatusCode, header};
use serde::Serialize;
use url::Url;

/// The User-Agent sent with requests.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub enum UserAgent {
    /// `OpenSEO/<version>` (default).
    #[default]
    OpenSeo,
    /// Googlebot's UA string, as the original tool sent. Sites that verify
    /// Googlebot by reverse DNS may block or treat these requests differently.
    Googlebot,
    Custom(String),
}

impl UserAgent {
    fn as_header(&self) -> String {
        match self {
            UserAgent::OpenSeo => format!(
                "Mozilla/5.0 (compatible; OpenSEO/{}; +https://github.com/TahaHachana/OpenSEO)",
                crate::VERSION
            ),
            UserAgent::Googlebot => {
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)".into()
            }
            UserAgent::Custom(ua) => ua.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct FetchOptions {
    pub user_agent: UserAgent,
    /// Timeout for each request in the redirect chain.
    pub timeout: Duration,
    pub max_redirects: usize,
    /// Bodies larger than this are not read; the page is reported as too large.
    pub max_body_bytes: usize,
}

impl Default for FetchOptions {
    fn default() -> Self {
        Self {
            user_agent: UserAgent::default(),
            timeout: Duration::from_secs(30),
            max_redirects: 10,
            max_body_bytes: 10 * 1024 * 1024,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpHeader {
    pub name: String,
    pub values: Vec<String>,
}

/// One hop of a redirect chain: `url` answered with `status` and pointed to `location`.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Redirect {
    pub url: String,
    pub status: u16,
    pub location: String,
}

/// The final response of a fetch.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Fetched {
    pub requested_url: Url,
    pub final_url: Url,
    pub status: u16,
    pub redirects: Vec<Redirect>,
    pub headers: Vec<HttpHeader>,
    /// Lowercased media type without parameters, e.g. `text/html`.
    pub media_type: Option<String>,
    /// Body size in KB (decoded, UTF-8), 0 when the body was not read.
    pub size_kb: f64,
    /// Time from the first request to the end of the body download, redirects included.
    pub elapsed_ms: u64,
    /// The body, read only for successful HTML responses.
    #[serde(skip)]
    pub html: Option<String>,
}

impl Fetched {
    pub fn is_html_media_type(&self) -> bool {
        matches!(
            self.media_type.as_deref(),
            Some("text/html" | "application/xhtml+xml")
        )
    }
}

#[derive(Debug, thiserror::Error)]
pub enum FetchError {
    #[error("the request timed out")]
    Timeout,
    #[error("could not connect: {0}")]
    Connect(String),
    #[error("more than {0} redirects")]
    TooManyRedirects(usize),
    #[error("redirect with an invalid Location header: {0:?}")]
    InvalidRedirect(String),
    #[error("the page is larger than {0} bytes")]
    TooLarge(usize),
    #[error("{0}")]
    Other(String),
}

impl From<reqwest::Error> for FetchError {
    fn from(e: reqwest::Error) -> Self {
        // reqwest's top-level message is terse; the source chain has the cause (DNS, TLS…).
        let mut msg = e.to_string();
        let mut source = std::error::Error::source(&e);
        while let Some(s) = source {
            msg = format!("{msg}: {s}");
            source = s.source();
        }
        if e.is_timeout() {
            FetchError::Timeout
        } else if e.is_connect() {
            FetchError::Connect(msg)
        } else {
            FetchError::Other(msg)
        }
    }
}

pub fn client(options: &FetchOptions) -> Result<reqwest::Client, FetchError> {
    Ok(reqwest::Client::builder()
        .user_agent(options.user_agent.as_header())
        .redirect(reqwest::redirect::Policy::none())
        .timeout(options.timeout)
        .build()?)
}

/// Fetches `url`, following redirects, and reads the body when it is HTML.
pub async fn fetch(url: &Url, options: &FetchOptions) -> Result<Fetched, FetchError> {
    let client = client(options)?;
    let started = Instant::now();
    let mut current = url.clone();
    let mut redirects = Vec::new();

    let response = loop {
        let response = client.get(current.clone()).send().await?;
        let status = response.status();
        let location = response.headers().get(header::LOCATION);
        let (true, Some(location)) = (status.is_redirection(), location) else {
            break response;
        };
        let location = String::from_utf8_lossy(location.as_bytes()).into_owned();
        if redirects.len() == options.max_redirects {
            return Err(FetchError::TooManyRedirects(options.max_redirects));
        }
        let next = current
            .join(&location)
            .map_err(|_| FetchError::InvalidRedirect(location.clone()))?;
        redirects.push(Redirect {
            url: current.to_string(),
            status: status.as_u16(),
            location,
        });
        current = next;
    };

    let status = response.status();
    let headers = collect_headers(response.headers());
    let media_type = response
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.split(';').next())
        .map(|v| v.trim().to_ascii_lowercase())
        .filter(|v| !v.is_empty());

    let mut fetched = Fetched {
        requested_url: url.clone(),
        final_url: current,
        status: status.as_u16(),
        redirects,
        headers,
        media_type,
        size_kb: 0.0,
        elapsed_ms: 0,
        html: None,
    };

    if status == StatusCode::OK && fetched.is_html_media_type() {
        if response
            .content_length()
            .is_some_and(|len| len > options.max_body_bytes as u64)
        {
            return Err(FetchError::TooLarge(options.max_body_bytes));
        }
        let html = response.text().await?;
        if html.len() > options.max_body_bytes {
            return Err(FetchError::TooLarge(options.max_body_bytes));
        }
        fetched.size_kb = crate::text::round2(html.len() as f64 / 1024.0);
        fetched.html = Some(html);
    }
    fetched.elapsed_ms = started.elapsed().as_millis() as u64;
    Ok(fetched)
}

/// Headers in response order, with repeated headers grouped under one name.
fn collect_headers(map: &header::HeaderMap) -> Vec<HttpHeader> {
    map.keys()
        .map(|name| HttpHeader {
            name: name.to_string(),
            values: map
                .get_all(name)
                .iter()
                .map(|v| String::from_utf8_lossy(v.as_bytes()).into_owned())
                .collect(),
        })
        .collect()
}

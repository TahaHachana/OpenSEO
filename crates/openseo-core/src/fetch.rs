//! Fetching a page over HTTP. Port of `SEOLib.Http`.
//!
//! Redirects are followed manually so the report can show the full chain.

use std::str::FromStr;
use std::time::{Duration, Instant};

use reqwest::{StatusCode, header};
use serde::{Deserialize, Serialize};
use url::Url;

/// Chrome major version used in the browser presets. Bump it now and then:
/// a very old version can trigger "update your browser" pages.
const CHROME_MAJOR: u32 = 158;

/// The User-Agent sent with requests.
#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "preset", content = "value", rename_all = "camelCase")]
pub enum UserAgent {
    /// `OpenSEO/<version>` (default): honest, but bot protection may block it.
    #[default]
    OpenSeo,
    /// Desktop Chrome on Windows.
    ChromeDesktop,
    /// Chrome on Android: the page Google's mobile-first indexing sees, and rarely blocked.
    ChromeMobile,
    /// Googlebot Smartphone, Google's main crawler. Sites that verify Googlebot
    /// by reverse DNS often block or treat these requests differently.
    Googlebot,
    Custom(String),
}

impl UserAgent {
    /// The User-Agent header value.
    pub fn header_value(&self) -> String {
        match self {
            UserAgent::OpenSeo => format!(
                "Mozilla/5.0 (compatible; OpenSEO/{}; +https://github.com/TahaHachana/OpenSEO)",
                crate::VERSION
            ),
            UserAgent::ChromeDesktop => format!(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) \
                 Chrome/{CHROME_MAJOR}.0.0.0 Safari/537.36"
            ),
            UserAgent::ChromeMobile => format!(
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) \
                 Chrome/{CHROME_MAJOR}.0.0.0 Mobile Safari/537.36"
            ),
            UserAgent::Googlebot => format!(
                "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 \
                 (KHTML, like Gecko) Chrome/{CHROME_MAJOR}.0.0.0 Mobile Safari/537.36 \
                 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
            ),
            UserAgent::Custom(ua) => ua.clone(),
        }
    }
}

/// Parses a preset name (`openseo`, `chrome`, `chrome-mobile`, `googlebot`);
/// anything else is used verbatim as a custom User-Agent.
impl FromStr for UserAgent {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let s = s.trim();
        Ok(match s.to_ascii_lowercase().as_str() {
            "" => return Err("the User-Agent can't be empty".into()),
            "openseo" => UserAgent::OpenSeo,
            "chrome" | "chrome-desktop" => UserAgent::ChromeDesktop,
            "chrome-mobile" => UserAgent::ChromeMobile,
            "googlebot" => UserAgent::Googlebot,
            _ => UserAgent::Custom(s.to_owned()),
        })
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
        .user_agent(options.user_agent.header_value())
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_presets_and_custom_user_agents() {
        assert_eq!("OpenSEO".parse(), Ok(UserAgent::OpenSeo));
        assert_eq!("chrome".parse(), Ok(UserAgent::ChromeDesktop));
        assert_eq!("chrome-mobile".parse(), Ok(UserAgent::ChromeMobile));
        assert_eq!("googlebot".parse(), Ok(UserAgent::Googlebot));
        assert_eq!(
            " MyBot/1.0 ".parse(),
            Ok(UserAgent::Custom("MyBot/1.0".into()))
        );
        assert!("  ".parse::<UserAgent>().is_err());
    }

    #[test]
    fn serializes_for_settings_files() {
        let json = |ua: &UserAgent| serde_json::to_string(ua).unwrap();
        assert_eq!(
            json(&UserAgent::ChromeMobile),
            r#"{"preset":"chromeMobile"}"#
        );
        assert_eq!(
            json(&UserAgent::Custom("X".into())),
            r#"{"preset":"custom","value":"X"}"#
        );
        let back: UserAgent = serde_json::from_str(r#"{"preset":"googlebot"}"#).unwrap();
        assert_eq!(back, UserAgent::Googlebot);
        assert!(
            UserAgent::Googlebot
                .header_value()
                .contains("Googlebot/2.1")
        );
        assert!(
            UserAgent::ChromeMobile
                .header_value()
                .contains("Mobile Safari")
        );
    }
}

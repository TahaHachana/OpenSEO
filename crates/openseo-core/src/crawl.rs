//! Site-level crawl checks for one page: is it allowed by robots.txt, and is
//! it listed in the site's XML sitemaps?
//!
//! These take extra requests (robots.txt, then sitemap files), so they run
//! separately from [`crate::review`].
//!
//! Matching follows Google: robots.txt is read for the `Googlebot` token; a
//! 4xx robots.txt means no restrictions, a 5xx (or 429) means Google stops
//! crawling the site. Sitemaps come from robots.txt `Sitemap:` lines, or
//! `/sitemap.xml` when there are none.

use std::io::Read;

use reqwest::header;
use serde::Serialize;
use url::Url;

use crate::fetch::{FetchOptions, client};
use crate::robots::Robots;
use crate::rules::{Violation, ViolationCode, without_fragment};

/// The crawler whose robots.txt rules are checked.
pub const CRAWLER: &str = "Googlebot";
/// Google reads at most 500 KiB of robots.txt.
const ROBOTS_MAX_BYTES: usize = 500 * 1024;
/// The sitemap protocol's limit for one (uncompressed) file.
const SITEMAP_MAX_BYTES: usize = 50 * 1024 * 1024;
/// Sitemap files fetched at most, index files included.
const MAX_SITEMAP_FILES: usize = 20;
const MAX_REDIRECTS: usize = 5;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Crawl {
    pub robots: RobotsReport,
    pub sitemaps: SitemapReport,
    pub issues: Vec<Violation>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(tag = "status", rename_all = "camelCase")]
pub enum RobotsStatus {
    /// robots.txt was read.
    Found,
    /// 4xx: crawlers may fetch anything.
    Missing { http_status: u16 },
    /// 5xx or 429: Google treats the whole site as disallowed for now.
    ServerError { http_status: u16 },
    /// No response (DNS, connection, timeout).
    Unreachable { reason: String },
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RobotsReport {
    pub url: String,
    pub status: RobotsStatus,
    /// Whether [`CRAWLER`] may crawl the page.
    pub allowed: bool,
    /// The rule that decided, e.g. `Disallow: /private/` (line 4).
    pub rule: Option<String>,
    pub rule_line: Option<usize>,
    pub sitemaps: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SitemapFile {
    pub url: String,
    /// Whether robots.txt listed it (rather than the `/sitemap.xml` guess or an index).
    pub from_robots: bool,
    pub kind: Option<SitemapKind>,
    /// Number of `<loc>` entries: page URLs, or child sitemaps for an index.
    pub entries: usize,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SitemapKind {
    Urlset,
    Index,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SitemapReport {
    pub files: Vec<SitemapFile>,
    /// The sitemap that lists the page (by its URL or its canonical URL).
    pub listed_in: Option<String>,
    /// Page URLs looked through.
    pub urls_checked: usize,
    /// True when the file limit stopped the search before every sitemap was read.
    pub truncated: bool,
}

/// A response body read up to a size limit.
struct Body {
    status: u16,
    bytes: Vec<u8>,
    gzip: bool,
}

/// GET with up to [`MAX_REDIRECTS`] redirects, reading at most `limit` bytes.
async fn get(client: &reqwest::Client, url: &Url, limit: usize) -> Result<Body, String> {
    let mut current = url.clone();
    for _ in 0..=MAX_REDIRECTS {
        let mut response = client
            .get(current.clone())
            .send()
            .await
            .map_err(|e| crate::fetch::FetchError::from(e).to_string())?;
        let status = response.status();
        if status.is_redirection()
            && let Some(location) = response.headers().get(header::LOCATION)
        {
            let location = String::from_utf8_lossy(location.as_bytes());
            current = current
                .join(&location)
                .map_err(|_| format!("invalid redirect to {location:?}"))?;
            continue;
        }
        let gzip = response
            .headers()
            .get(header::CONTENT_TYPE)
            .and_then(|v| v.to_str().ok())
            .is_some_and(|t| t.contains("gzip"))
            || current.path().ends_with(".gz");
        let mut bytes = Vec::new();
        while let Some(chunk) = response.chunk().await.map_err(|e| e.to_string())? {
            let room = limit.saturating_sub(bytes.len());
            bytes.extend_from_slice(&chunk[..chunk.len().min(room)]);
            if bytes.len() >= limit {
                break;
            }
        }
        return Ok(Body {
            status: status.as_u16(),
            bytes,
            gzip,
        });
    }
    Err(format!("more than {MAX_REDIRECTS} redirects"))
}

/// The robots.txt URL for a page: the root of its origin.
pub fn robots_url(page: &Url) -> Url {
    let mut url = page.clone();
    url.set_path("/robots.txt");
    url.set_query(None);
    url.set_fragment(None);
    url
}

/// The URL path plus query, as robots.txt rules see it.
fn robots_path(page: &Url) -> String {
    match page.query() {
        Some(q) => format!("{}?{q}", page.path()),
        None => page.path().to_owned(),
    }
}

async fn check_robots(client: &reqwest::Client, page: &Url) -> (RobotsReport, Robots) {
    let url = robots_url(page);
    let (status, robots) = match get(client, &url, ROBOTS_MAX_BYTES).await {
        Err(reason) => (RobotsStatus::Unreachable { reason }, Robots::default()),
        Ok(body) if body.status == 200 => (
            RobotsStatus::Found,
            Robots::parse(&String::from_utf8_lossy(&body.bytes)),
        ),
        Ok(body) if body.status >= 500 || body.status == 429 => {
            let robots = Robots::parse("User-agent: *\nDisallow: /\n");
            (
                RobotsStatus::ServerError {
                    http_status: body.status,
                },
                robots,
            )
        }
        Ok(body) => (
            RobotsStatus::Missing {
                http_status: body.status,
            },
            Robots::default(),
        ),
    };
    let verdict = robots.check(CRAWLER, &robots_path(page));
    let found = status == RobotsStatus::Found;
    let report = RobotsReport {
        url: url.into(),
        allowed: verdict.allowed,
        rule: verdict
            .rule
            .as_ref()
            .filter(|_| found)
            .map(ToString::to_string),
        rule_line: verdict.rule.as_ref().filter(|_| found).map(|r| r.line),
        sitemaps: robots.sitemaps.clone(),
        status,
    };
    (report, robots)
}

/// Decompresses gzip if the body is gzip (checking the magic bytes, since
/// HTTP clients may already have decoded a `Content-Encoding: gzip` body).
fn decompress(body: Body) -> Result<Vec<u8>, String> {
    if !(body.gzip && body.bytes.starts_with(&[0x1f, 0x8b])) {
        return Ok(body.bytes);
    }
    let mut out = Vec::new();
    flate2::read::GzDecoder::new(body.bytes.as_slice())
        .take(SITEMAP_MAX_BYTES as u64)
        .read_to_end(&mut out)
        .map_err(|e| format!("invalid gzip data: {e}"))?;
    Ok(out)
}

/// The kind of sitemap and its `<loc>` values.
fn parse_sitemap(xml: &[u8]) -> Result<(SitemapKind, Vec<String>), String> {
    use quick_xml::events::Event;

    let mut reader = quick_xml::Reader::from_reader(xml);
    reader.config_mut().trim_text(true);
    let mut buf = Vec::new();
    let mut kind = None;
    let mut locs = Vec::new();
    let mut loc: Option<String> = None;
    loop {
        match reader.read_event_into(&mut buf) {
            Err(e) => return Err(format!("invalid XML: {e}")),
            Ok(Event::Eof) => break,
            Ok(Event::Start(e)) => match e.local_name().as_ref() {
                "urlset" => kind = kind.or(Some(SitemapKind::Urlset)),
                "sitemapindex" => kind = kind.or(Some(SitemapKind::Index)),
                "loc" => loc = Some(String::new()),
                _ => {}
            },
            Ok(Event::Text(t)) => {
                if let Some(loc) = loc.as_mut() {
                    loc.push_str(&t.xml10_content());
                }
            }
            Ok(Event::CData(t)) => {
                if let Some(loc) = loc.as_mut() {
                    loc.push_str(&t.into_inner());
                }
            }
            Ok(Event::GeneralRef(r)) => {
                if let Some(loc) = loc.as_mut() {
                    let entity = match r.resolve_char_ref() {
                        Ok(Some(c)) => Some(c),
                        _ => match r.xml10_content().as_ref() {
                            "amp" => Some('&'),
                            "lt" => Some('<'),
                            "gt" => Some('>'),
                            "quot" => Some('"'),
                            "apos" => Some('\''),
                            _ => None,
                        },
                    };
                    loc.extend(entity);
                }
            }
            Ok(Event::End(e)) if e.local_name().as_ref() == "loc" => {
                if let Some(l) = loc.take() {
                    locs.push(l.trim().to_owned());
                }
            }
            Ok(_) => {}
        }
        buf.clear();
    }
    let kind = kind.ok_or("not a sitemap (no <urlset> or <sitemapindex>)")?;
    Ok((kind, locs))
}

/// Orders sitemap URLs so the ones likely to list `page` come first: large
/// sites split sitemaps by section (`/news` → `sitemap-news.xml`), and the
/// file budget runs out long before every file is read. Stable otherwise.
fn by_relevance(urls: &mut [(String, bool)], page: &Url) {
    let words: Vec<String> = page
        .path_segments()
        .into_iter()
        .flatten()
        .map(str::to_ascii_lowercase)
        .filter(|s| s.len() >= 3)
        .collect();
    let score = |url: &str| {
        let url = url.to_ascii_lowercase();
        words.iter().filter(|w| url.contains(w.as_str())).count()
    };
    urls.sort_by_key(|(url, _)| std::cmp::Reverse(score(url)));
}

/// Normalized forms of the URLs that count as "this page" in a sitemap.
fn page_keys(page: &Url, canonical: Option<&str>) -> Vec<String> {
    std::iter::once(without_fragment(page))
        .chain(
            canonical
                .and_then(|c| Url::parse(c).ok())
                .map(|u| without_fragment(&u)),
        )
        .collect()
}

async fn check_sitemaps(
    client: &reqwest::Client,
    page: &Url,
    canonical: Option<&str>,
    from_robots: &[String],
) -> SitemapReport {
    let keys = page_keys(page, canonical);
    let mut queue: Vec<(String, bool)> = if from_robots.is_empty() {
        let mut guess = page.clone();
        guess.set_path("/sitemap.xml");
        guess.set_query(None);
        guess.set_fragment(None);
        vec![(guess.into(), false)]
    } else {
        from_robots.iter().map(|u| (u.clone(), true)).collect()
    };
    by_relevance(&mut queue, page);
    queue.reverse(); // pop() takes the most relevant first

    let mut report = SitemapReport {
        files: Vec::new(),
        listed_in: None,
        urls_checked: 0,
        truncated: false,
    };
    while let Some((url, robots_listed)) = queue.pop() {
        if report.files.len() == MAX_SITEMAP_FILES {
            report.truncated = true;
            break;
        }
        let mut file = SitemapFile {
            url: url.clone(),
            from_robots: robots_listed,
            kind: None,
            entries: 0,
            error: None,
        };
        let parsed = async {
            let parsed_url = Url::parse(&url).map_err(|e| format!("invalid URL: {e}"))?;
            let body = get(client, &parsed_url, SITEMAP_MAX_BYTES).await?;
            if body.status != 200 {
                return Err(format!("HTTP {}", body.status));
            }
            parse_sitemap(&decompress(body)?)
        }
        .await;
        match parsed {
            Err(e) => file.error = Some(e),
            Ok((kind, locs)) => {
                file.kind = Some(kind);
                file.entries = locs.len();
                match kind {
                    SitemapKind::Index => {
                        // Children go next, ahead of the remaining robots.txt sitemaps.
                        let mut children: Vec<_> = locs.into_iter().map(|l| (l, false)).collect();
                        by_relevance(&mut children, page);
                        queue.extend(children.into_iter().rev());
                    }
                    SitemapKind::Urlset => {
                        report.urls_checked += locs.len();
                        let listed = locs.iter().any(|l| {
                            Url::parse(l).is_ok_and(|u| keys.contains(&without_fragment(&u)))
                        });
                        if listed {
                            report.listed_in = Some(url.clone());
                        }
                    }
                }
            }
        }
        report.files.push(file);
        if report.listed_in.is_some() {
            break;
        }
    }
    report
}

fn issues(robots: &RobotsReport, sitemaps: &SitemapReport) -> Vec<Violation> {
    let mut out = Vec::new();
    match &robots.status {
        RobotsStatus::Found => {}
        RobotsStatus::Missing { http_status } => out.push(Violation::new(
            ViolationCode::RobotsMissing,
            format!("{} returned HTTP {http_status}, which crawlers read as permission to crawl everything.", robots.url),
            None,
        )),
        RobotsStatus::ServerError { http_status } => out.push(Violation::new(
            ViolationCode::RobotsServerError,
            format!("{} returned HTTP {http_status}. While robots.txt fails like this, Google treats the whole site as disallowed and stops crawling it.", robots.url),
            None,
        )),
        RobotsStatus::Unreachable { reason } => out.push(Violation::new(
            ViolationCode::RobotsUnreachable,
            format!("{} could not be fetched ({reason}). If crawlers can't reach it either, Google stops crawling the site.", robots.url),
            None,
        )),
    }
    if !robots.allowed && robots.status == RobotsStatus::Found {
        let rule = match (&robots.rule, robots.rule_line) {
            (Some(rule), Some(line)) => format!("\"{rule}\" (line {line})"),
            _ => "A rule".to_owned(),
        };
        out.push(Violation::new(
            ViolationCode::RobotsBlocked,
            format!("{rule} in {} disallows this URL for {CRAWLER}. Google can't crawl the page; it may still index the bare URL if other pages link to it.", robots.url),
            None,
        ));
    }
    // A failed /sitemap.xml guess (robots.txt named no sitemap) just means
    // there is no sitemap; that is reported as SitemapMissing below.
    let guessed = robots.sitemaps.is_empty();
    for file in &sitemaps.files {
        if let Some(error) = &file.error
            && !(guessed && !file.from_robots && sitemaps.files.len() == 1)
        {
            out.push(Violation::new(
                ViolationCode::SitemapError,
                format!("{}: {error}.", file.url),
                None,
            ));
        }
    }
    let readable = sitemaps.files.iter().any(|f| f.kind.is_some());
    if !readable && robots.sitemaps.is_empty() {
        out.push(Violation::new(
            ViolationCode::SitemapMissing,
            "robots.txt lists no sitemap and /sitemap.xml doesn't exist. Sitemaps help search engines find new and updated pages.",
            None,
        ));
    } else if readable && sitemaps.listed_in.is_none() {
        let files = sitemaps
            .files
            .iter()
            .filter(|f| f.kind == Some(SitemapKind::Urlset))
            .count();
        let scope = if sitemaps.truncated {
            format!("the first {files} sitemap files (of more)")
        } else {
            format!("{files} sitemap file{}", if files == 1 { "" } else { "s" })
        };
        out.push(Violation::new(
            ViolationCode::SitemapNotListed,
            format!(
                "Neither this URL nor its canonical URL is among the {} URLs in {scope}.",
                sitemaps.urls_checked
            ),
            None,
        ));
    }
    out
}

/// Checks `page` (the final URL after redirects) against its site's
/// robots.txt and sitemaps. `canonical` also counts as a sitemap match.
pub async fn crawl(page: &Url, canonical: Option<&str>, options: &FetchOptions) -> Crawl {
    let client = match client(options) {
        Ok(c) => c,
        Err(e) => {
            let robots = RobotsReport {
                url: robots_url(page).into(),
                status: RobotsStatus::Unreachable {
                    reason: e.to_string(),
                },
                allowed: true,
                rule: None,
                rule_line: None,
                sitemaps: Vec::new(),
            };
            let sitemaps = SitemapReport {
                files: Vec::new(),
                listed_in: None,
                urls_checked: 0,
                truncated: false,
            };
            let issues = issues(&robots, &sitemaps);
            return Crawl {
                robots,
                sitemaps,
                issues,
            };
        }
    };
    let (robots, parsed) = check_robots(&client, page).await;
    let sitemaps = check_sitemaps(&client, page, canonical, &parsed.sitemaps).await;
    let issues = issues(&robots, &sitemaps);
    Crawl {
        robots,
        sitemaps,
        issues,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_urlsets_and_indexes() {
        let (kind, locs) = parse_sitemap(
            br#"<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <url><loc> https://e.com/a?x=1&amp;y=2 </loc><lastmod>2024-01-01</lastmod></url>
              <url><loc><![CDATA[https://e.com/b]]></loc></url>
            </urlset>"#,
        )
        .unwrap();
        assert_eq!(kind, SitemapKind::Urlset);
        assert_eq!(locs, ["https://e.com/a?x=1&y=2", "https://e.com/b"]);

        let (kind, locs) = parse_sitemap(
            br#"<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
              <sitemap><loc>https://e.com/s1.xml.gz</loc></sitemap></sitemapindex>"#,
        )
        .unwrap();
        assert_eq!(kind, SitemapKind::Index);
        assert_eq!(locs, ["https://e.com/s1.xml.gz"]);

        assert!(parse_sitemap(b"<html><body>Not found</body></html>").is_err());
    }

    #[test]
    fn sitemaps_mentioning_the_page_section_come_first() {
        let page = Url::parse("https://e.com/news/world-12345").unwrap();
        let mut urls: Vec<_> = [
            "https://e.com/sitemap-audio.xml",
            "https://e.com/sitemap-news.xml",
            "https://e.com/sitemap-sport.xml",
        ]
        .into_iter()
        .map(|u| (u.to_owned(), true))
        .collect();
        by_relevance(&mut urls, &page);
        assert_eq!(urls[0].0, "https://e.com/sitemap-news.xml");
        assert_eq!(
            urls[1].0, "https://e.com/sitemap-audio.xml",
            "otherwise file order"
        );
    }

    #[test]
    fn robots_paths_include_the_query() {
        let u = Url::parse("https://e.com/shop/item?id=3#top").unwrap();
        assert_eq!(robots_path(&u), "/shop/item?id=3");
        assert_eq!(robots_url(&u).as_str(), "https://e.com/robots.txt");
    }
}

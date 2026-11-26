//! robots.txt and sitemap checks against a local mock server.

use std::io::Write;

use openseo_core::FetchOptions;
use openseo_core::crawl::{RobotsStatus, SitemapKind, crawl};
use openseo_core::rules::ViolationCode::{self, *};
use url::Url;
use wiremock::matchers::{method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn text(body: &str) -> ResponseTemplate {
    ResponseTemplate::new(200).set_body_raw(body.to_owned(), "text/plain")
}

fn xml(body: &str) -> ResponseTemplate {
    ResponseTemplate::new(200).set_body_raw(body.to_owned(), "application/xml")
}

async fn serve(server: &MockServer, p: &str, response: ResponseTemplate) {
    Mock::given(method("GET"))
        .and(path(p))
        .respond_with(response)
        .mount(server)
        .await;
}

fn urlset(urls: &[String]) -> String {
    let entries: String = urls
        .iter()
        .map(|u| format!("<url><loc>{u}</loc></url>"))
        .collect();
    format!(r#"<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{entries}</urlset>"#)
}

fn codes(v: &[openseo_core::rules::Violation]) -> Vec<ViolationCode> {
    v.iter().map(|v| v.code).collect()
}

#[tokio::test]
async fn finds_the_page_through_a_gzipped_sitemap_index() {
    let server = MockServer::start().await;
    let base = server.uri();
    serve(
        &server,
        "/robots.txt",
        text(&format!(
            "User-agent: *\nDisallow: /admin/\n\nSitemap: {base}/sitemap_index.xml\n"
        )),
    )
    .await;
    serve(
        &server,
        "/sitemap_index.xml",
        xml(&format!(
            r#"<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
           <sitemap><loc>{base}/posts.xml</loc></sitemap>
           <sitemap><loc>{base}/pages.xml.gz</loc></sitemap></sitemapindex>"#
        )),
    )
    .await;
    serve(
        &server,
        "/posts.xml",
        xml(&urlset(&[format!("{base}/post-1")])),
    )
    .await;
    let mut gz = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::default());
    gz.write_all(urlset(&[format!("{base}/about")]).as_bytes())
        .unwrap();
    serve(
        &server,
        "/pages.xml.gz",
        ResponseTemplate::new(200).set_body_raw(gz.finish().unwrap(), "application/x-gzip"),
    )
    .await;

    let page = Url::parse(&format!("{base}/about?ref=x")).unwrap();
    // The page URL has a parameter; its canonical URL is what the sitemap lists.
    let canonical = format!("{base}/about");
    let c = crawl(&page, Some(&canonical), &FetchOptions::default()).await;

    assert_eq!(c.robots.status, RobotsStatus::Found);
    assert!(c.robots.allowed);
    assert_eq!(
        c.sitemaps.listed_in.as_deref(),
        Some(format!("{base}/pages.xml.gz").as_str())
    );
    let kinds: Vec<_> = c.sitemaps.files.iter().map(|f| f.kind).collect();
    assert_eq!(
        kinds,
        [
            Some(SitemapKind::Index),
            Some(SitemapKind::Urlset),
            Some(SitemapKind::Urlset)
        ]
    );
    assert_eq!(c.sitemaps.urls_checked, 2);
    assert_eq!(codes(&c.issues), []);
}

#[tokio::test]
async fn reports_a_blocked_page_that_is_not_in_the_sitemap() {
    let server = MockServer::start().await;
    let base = server.uri();
    serve(
        &server,
        "/robots.txt",
        text("User-agent: Googlebot\nDisallow: /admin\n"),
    )
    .await;
    serve(&server, "/sitemap.xml", xml(&urlset(&[format!("{base}/")]))).await;

    let page = Url::parse(&format!("{base}/admin/login")).unwrap();
    let c = crawl(&page, None, &FetchOptions::default()).await;
    assert!(!c.robots.allowed);
    assert_eq!(c.robots.rule.as_deref(), Some("Disallow: /admin"));
    assert_eq!(c.robots.rule_line, Some(2));
    assert_eq!(codes(&c.issues), [RobotsBlocked, SitemapNotListed]);
    assert!(c.issues[0].description.contains("line 2"));
}

#[tokio::test]
async fn missing_robots_and_sitemap() {
    let server = MockServer::start().await;
    let page = Url::parse(&format!("{}/", server.uri())).unwrap();
    let c = crawl(&page, None, &FetchOptions::default()).await;
    assert_eq!(c.robots.status, RobotsStatus::Missing { http_status: 404 });
    assert!(c.robots.allowed);
    assert_eq!(codes(&c.issues), [RobotsMissing, SitemapMissing]);
}

#[tokio::test]
async fn robots_server_error_blocks_everything() {
    let server = MockServer::start().await;
    serve(&server, "/robots.txt", ResponseTemplate::new(503)).await;
    let page = Url::parse(&format!("{}/page", server.uri())).unwrap();
    let c = crawl(&page, None, &FetchOptions::default()).await;
    assert_eq!(
        c.robots.status,
        RobotsStatus::ServerError { http_status: 503 }
    );
    assert!(!c.robots.allowed);
    assert_eq!(codes(&c.issues), [RobotsServerError, SitemapMissing]);
}

#[tokio::test]
async fn broken_sitemap_listed_in_robots_is_reported() {
    let server = MockServer::start().await;
    let base = server.uri();
    serve(
        &server,
        "/robots.txt",
        text(&format!(
            "Sitemap: {base}/sitemap.xml\nSitemap: {base}/gone.xml\n"
        )),
    )
    .await;
    serve(
        &server,
        "/sitemap.xml",
        ResponseTemplate::new(200).set_body_raw("<html>Oops</html>", "text/html"),
    )
    .await;
    let page = Url::parse(&format!("{base}/")).unwrap();
    let c = crawl(&page, None, &FetchOptions::default()).await;
    assert_eq!(codes(&c.issues), [SitemapError, SitemapError]);
    assert!(c.issues[1].description.contains("HTTP 404"));
}

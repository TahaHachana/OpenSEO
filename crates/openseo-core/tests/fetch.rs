//! Fetch and review tests against a local mock server (no internet access needed).

use std::time::Duration;

use openseo_core::fetch::{FetchError, fetch};
use openseo_core::{FetchOptions, ReviewResult, UserAgent, review};
use url::Url;
use wiremock::matchers::{header_regex, method, path};
use wiremock::{Mock, MockServer, ResponseTemplate};

const PAGE: &str = "<html><head><title>Hello there</title></head><body><h1>Hi</h1></body></html>";

fn html(body: &str) -> ResponseTemplate {
    ResponseTemplate::new(200).set_body_raw(body.to_owned(), "text/html; charset=utf-8")
}

fn redirect(status: u16, to: &str) -> ResponseTemplate {
    ResponseTemplate::new(status).insert_header("Location", to)
}

fn url(server: &MockServer, p: &str) -> Url {
    Url::parse(&format!("{}{p}", server.uri())).unwrap()
}

#[tokio::test]
async fn reads_html_with_headers_and_size() {
    let server = MockServer::start().await;
    Mock::given(method("GET"))
        .and(path("/"))
        .and(header_regex("user-agent", "OpenSEO/"))
        .respond_with(
            html(PAGE)
                .insert_header("X-Test", "a")
                .append_header("X-Test", "b"),
        )
        .mount(&server)
        .await;

    let f = fetch(&url(&server, "/"), &FetchOptions::default())
        .await
        .unwrap();
    assert_eq!(f.status, 200);
    assert_eq!(f.media_type.as_deref(), Some("text/html"));
    assert_eq!(f.html.as_deref(), Some(PAGE));
    assert_eq!(
        f.size_kb,
        (PAGE.len() as f64 / 1024.0 * 100.0).round() / 100.0
    );
    assert!(f.redirects.is_empty());
    let x_test = f.headers.iter().find(|h| h.name == "x-test").unwrap();
    assert_eq!(x_test.values, vec!["a", "b"]);
}

#[tokio::test]
async fn follows_and_records_redirect_chain() {
    let server = MockServer::start().await;
    Mock::given(path("/old"))
        .respond_with(redirect(301, "/mid"))
        .mount(&server)
        .await;
    Mock::given(path("/mid"))
        .respond_with(redirect(302, "new"))
        .mount(&server)
        .await;
    Mock::given(path("/new"))
        .respond_with(html(PAGE))
        .mount(&server)
        .await;

    let f = fetch(&url(&server, "/old"), &FetchOptions::default())
        .await
        .unwrap();
    assert_eq!(f.final_url, url(&server, "/new"));
    let chain: Vec<_> = f
        .redirects
        .iter()
        .map(|r| (r.status, r.location.as_str()))
        .collect();
    assert_eq!(chain, vec![(301, "/mid"), (302, "new")]);
    assert_eq!(f.requested_url, url(&server, "/old"));
}

#[tokio::test]
async fn stops_redirect_loops() {
    let server = MockServer::start().await;
    Mock::given(path("/loop"))
        .respond_with(redirect(302, "/loop"))
        .mount(&server)
        .await;
    let options = FetchOptions {
        max_redirects: 3,
        ..FetchOptions::default()
    };
    let err = fetch(&url(&server, "/loop"), &options).await.unwrap_err();
    assert!(matches!(err, FetchError::TooManyRedirects(3)), "{err:?}");
}

#[tokio::test]
async fn sends_googlebot_user_agent_when_asked() {
    let server = MockServer::start().await;
    Mock::given(header_regex("user-agent", "Googlebot/2.1"))
        .respond_with(html(PAGE))
        .mount(&server)
        .await;
    let options = FetchOptions {
        user_agent: UserAgent::Googlebot,
        ..FetchOptions::default()
    };
    let f = fetch(&url(&server, "/"), &options).await.unwrap();
    assert_eq!(f.status, 200);
}

#[tokio::test]
async fn times_out() {
    let server = MockServer::start().await;
    Mock::given(path("/slow"))
        .respond_with(html(PAGE).set_delay(Duration::from_secs(5)))
        .mount(&server)
        .await;
    let options = FetchOptions {
        timeout: Duration::from_millis(200),
        ..FetchOptions::default()
    };
    let err = fetch(&url(&server, "/slow"), &options).await.unwrap_err();
    assert!(matches!(err, FetchError::Timeout), "{err:?}");
}

#[tokio::test]
async fn review_success() {
    let server = MockServer::start().await;
    Mock::given(path("/"))
        .respond_with(html(PAGE))
        .mount(&server)
        .await;
    let result = review(&server.uri(), &FetchOptions::default()).await;
    let ReviewResult::Success(r) = result else {
        panic!("{result:?}")
    };
    assert_eq!(r.content.title.as_deref(), Some("Hello there"));
    assert_eq!(r.http.status, 200);
}

#[tokio::test]
async fn review_reports_non_html_and_http_errors() {
    let server = MockServer::start().await;
    Mock::given(path("/data.json"))
        .respond_with(ResponseTemplate::new(200).set_body_raw("{}", "application/json"))
        .mount(&server)
        .await;
    Mock::given(path("/gone"))
        .respond_with(ResponseTemplate::new(404))
        .mount(&server)
        .await;

    let opts = FetchOptions::default();
    let not_html = review(url(&server, "/data.json").as_str(), &opts).await;
    assert!(
        matches!(&not_html, ReviewResult::NotHtml { http } if http.media_type.as_deref() == Some("application/json")),
        "{not_html:?}"
    );
    let gone = review(url(&server, "/gone").as_str(), &opts).await;
    assert!(
        matches!(&gone, ReviewResult::HttpError { http } if http.status == 404),
        "{gone:?}"
    );
}

#[tokio::test]
async fn review_invalid_and_unreachable() {
    let opts = FetchOptions {
        timeout: Duration::from_secs(5),
        ..FetchOptions::default()
    };
    assert!(matches!(
        review("ftp://x", &opts).await,
        ReviewResult::InvalidUrl { .. }
    ));
    // Port 9 (discard) on localhost: nothing listens, so the connection is refused.
    let failed = review("http://127.0.0.1:9/", &opts).await;
    assert!(
        matches!(&failed, ReviewResult::FetchFailed { .. }),
        "{failed:?}"
    );
}

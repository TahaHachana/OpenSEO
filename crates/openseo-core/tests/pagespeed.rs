//! PageSpeed client tests against a mock of the PSI v5 endpoint.

use openseo_core::pagespeed::{PageSpeed, Rating, SpeedError, Strategy, Unit};
use url::Url;
use wiremock::matchers::{method, query_param, query_param_is_missing};
use wiremock::{Mock, MockServer, ResponseTemplate};

fn fixture() -> String {
    let path = format!(
        "{}/tests/fixtures/pagespeed-mobile.json",
        env!("CARGO_MANIFEST_DIR")
    );
    std::fs::read_to_string(path).unwrap()
}

fn page() -> Url {
    Url::parse("https://shop.example/").unwrap()
}

#[tokio::test]
async fn sends_expected_query_and_parses_report() {
    let server = MockServer::start().await;
    Mock::given(method("GET"))
        .and(query_param("url", "https://shop.example/"))
        .and(query_param("strategy", "mobile"))
        .and(query_param("category", "SEO"))
        .and(query_param("key", "secret-key"))
        .respond_with(ResponseTemplate::new(200).set_body_raw(fixture(), "application/json"))
        .expect(1)
        .mount(&server)
        .await;

    let psi = PageSpeed::with_endpoint(&server.uri(), Some(" secret-key ".into())).unwrap();
    let r = psi.run(&page(), Strategy::Mobile).await.unwrap();

    assert_eq!(r.lighthouse_version.as_deref(), Some("13.0.1"));
    assert_eq!(r.warnings.len(), 1);

    let scores: Vec<_> = r
        .categories
        .iter()
        .map(|c| (c.id.as_str(), c.score))
        .collect();
    assert_eq!(
        scores,
        vec![
            ("performance", Some(47)),
            ("accessibility", Some(88)),
            ("best-practices", Some(100)),
            ("seo", Some(92))
        ]
    );

    // Metric and hidden audits are excluded; passing and unscored audits too.
    // Sorted by estimated savings: overallSavingsMs 2050, LCP 1200, LCP 450.
    let perf: Vec<_> = r.categories[0]
        .failing
        .iter()
        .map(|a| (a.id.as_str(), a.savings_ms))
        .collect();
    assert_eq!(
        perf,
        vec![
            ("unused-javascript", Some(2050.0)),
            ("render-blocking-insight", Some(1200.0)),
            ("image-delivery-insight", Some(450.0)),
        ]
    );
    let render = &r.categories[0].failing[1];
    assert_eq!(
        render.description,
        "Requests are blocking the page's initial render."
    );
    assert_eq!(
        render.learn_more.as_deref(),
        Some("https://developer.chrome.com/docs/performance/insights/render-blocking")
    );
    assert_eq!(r.categories[0].failing[2].savings_bytes, Some(348160.0));

    let a11y: Vec<_> = r.categories[1]
        .failing
        .iter()
        .map(|a| a.id.as_str())
        .collect();
    assert_eq!(a11y, vec!["image-alt", "color-contrast"]);
    assert!(r.categories[3].failing.is_empty());

    let lab: Vec<_> = r
        .lab_metrics
        .iter()
        .map(|m| (m.id.as_str(), m.display_value.as_deref()))
        .collect();
    assert_eq!(lab[1], ("largest-contentful-paint", Some("5.5 s")));
    assert_eq!(lab.len(), 5);

    let field = r.field.unwrap();
    assert!(field.origin_fallback);
    assert_eq!(field.overall, Some(Rating::NeedsImprovement));
    assert_eq!(field.metrics.len(), 5, "unknown metrics are ignored");
    let cls = field
        .metrics
        .iter()
        .find(|m| m.id == "CUMULATIVE_LAYOUT_SHIFT_SCORE")
        .unwrap();
    assert_eq!((cls.p75, cls.unit), (0.12, Unit::Unitless));
    assert_eq!(field.metrics[1].rating, Some(Rating::Good));
}

#[tokio::test]
async fn omits_key_when_none_and_reports_quota() {
    let server = MockServer::start().await;
    Mock::given(query_param_is_missing("key"))
        .and(query_param("strategy", "desktop"))
        .respond_with(ResponseTemplate::new(429).set_body_raw(
            r#"{"error":{"code":429,"message":"Quota exceeded for quota metric 'Queries'","errors":[{"reason":"rateLimitExceeded"}]}}"#,
            "application/json",
        ))
        .mount(&server)
        .await;

    let psi = PageSpeed::with_endpoint(&server.uri(), Some("   ".into())).unwrap();
    let err = psi.run(&page(), Strategy::Desktop).await.unwrap_err();
    assert!(matches!(err, SpeedError::Quota(_)), "{err:?}");
    assert_eq!(err.kind(), "quota");
}

#[tokio::test]
async fn bad_key_and_non_json_errors() {
    let server = MockServer::start().await;
    Mock::given(query_param("key", "wrong"))
        .respond_with(ResponseTemplate::new(400).set_body_raw(
            r#"{"error":{"code":400,"message":"API key not valid. Please pass a valid API key.","errors":[{"reason":"badRequest"}]}}"#,
            "application/json",
        ))
        .mount(&server)
        .await;
    Mock::given(query_param("key", "html"))
        .respond_with(
            ResponseTemplate::new(502).set_body_raw("<html>Bad gateway</html>", "text/html"),
        )
        .mount(&server)
        .await;

    let bad = PageSpeed::with_endpoint(&server.uri(), Some("wrong".into())).unwrap();
    assert!(matches!(
        bad.run(&page(), Strategy::Mobile).await,
        Err(SpeedError::BadKey(_))
    ));

    let html = PageSpeed::with_endpoint(&server.uri(), Some("html".into())).unwrap();
    let err = html.run(&page(), Strategy::Mobile).await.unwrap_err();
    assert!(
        matches!(&err, SpeedError::Parse(m) if m.contains("HTTP 502")),
        "{err:?}"
    );
}

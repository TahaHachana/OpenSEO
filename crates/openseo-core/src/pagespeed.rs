//! PageSpeed Insights v5: Lighthouse lab results plus Chrome UX Report field data.
//! Replaces SEOLib's PageSpeed v1 client (that API no longer exists).
//!
//! The response is read loosely (`serde_json::Value`) because Lighthouse adds,
//! renames and retires audits between versions. Failing audits are found through
//! each category's `auditRefs`, so new audits show up without code changes.
//!
//! The keyless quota is shared by everyone and is usually exhausted: expect a
//! [`SpeedError::Quota`] without an API key.

use std::time::Duration;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use url::Url;

pub const ENDPOINT: &str = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/// Lighthouse runs take 10–60 s; leave headroom.
const TIMEOUT: Duration = Duration::from_secs(150);

const CATEGORIES: &[&str] = &["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"];

/// Lab metrics shown in the summary, in display order.
const LAB_METRICS: &[&str] = &[
    "first-contentful-paint",
    "largest-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
];

/// Field (CrUX) metrics, in display order: (API key, label, unit).
const FIELD_METRICS: &[(&str, &str, Unit)] = &[
    (
        "LARGEST_CONTENTFUL_PAINT_MS",
        "Largest Contentful Paint",
        Unit::Ms,
    ),
    (
        "INTERACTION_TO_NEXT_PAINT",
        "Interaction to Next Paint",
        Unit::Ms,
    ),
    (
        "CUMULATIVE_LAYOUT_SHIFT_SCORE",
        "Cumulative Layout Shift",
        Unit::Unitless,
    ),
    (
        "FIRST_CONTENTFUL_PAINT_MS",
        "First Contentful Paint",
        Unit::Ms,
    ),
    (
        "EXPERIMENTAL_TIME_TO_FIRST_BYTE",
        "Time to First Byte",
        Unit::Ms,
    ),
];

/// Audits scoring below this are reported as failing (Lighthouse shows < 0.9 as not passed).
const PASS_SCORE: f64 = 0.9;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Strategy {
    Mobile,
    Desktop,
}

impl Strategy {
    fn as_param(self) -> &'static str {
        match self {
            Strategy::Mobile => "mobile",
            Strategy::Desktop => "desktop",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Unit {
    Ms,
    Unitless,
}

/// Core Web Vitals rating (CrUX calls these FAST / AVERAGE / SLOW).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Rating {
    Good,
    NeedsImprovement,
    Poor,
}

impl Rating {
    fn from_crux(category: &str) -> Option<Self> {
        match category {
            "FAST" => Some(Rating::Good),
            "AVERAGE" => Some(Rating::NeedsImprovement),
            "SLOW" => Some(Rating::Poor),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeedReport {
    pub strategy: Strategy,
    pub lighthouse_version: Option<String>,
    /// The URL Lighthouse ended up on.
    pub final_url: Option<String>,
    pub categories: Vec<CategoryResult>,
    pub lab_metrics: Vec<LabMetric>,
    /// Real-user data from the Chrome UX Report; `None` for low-traffic pages.
    pub field: Option<FieldData>,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryResult {
    pub id: String,
    pub title: String,
    /// 0–100.
    pub score: Option<u8>,
    /// Audits below the passing score, biggest estimated savings first.
    pub failing: Vec<AuditResult>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuditResult {
    pub id: String,
    pub title: String,
    /// Plain text (Markdown links reduced to their text).
    pub description: String,
    pub learn_more: Option<String>,
    pub display_value: Option<String>,
    /// 0–1.
    pub score: Option<f64>,
    pub savings_ms: Option<f64>,
    pub savings_bytes: Option<f64>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LabMetric {
    pub id: String,
    pub title: String,
    pub display_value: Option<String>,
    pub numeric_value: Option<f64>,
    /// 0–1.
    pub score: Option<f64>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldData {
    /// True when the page has too little traffic and the data is for the whole origin.
    pub origin_fallback: bool,
    pub overall: Option<Rating>,
    pub metrics: Vec<FieldMetric>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FieldMetric {
    pub id: String,
    pub label: String,
    /// 75th percentile. Milliseconds, or the raw score for CLS.
    pub p75: f64,
    pub unit: Unit,
    pub rating: Option<Rating>,
}

#[derive(Debug, thiserror::Error)]
pub enum SpeedError {
    #[error("PageSpeed quota exceeded. Add a free API key to get your own quota. ({0})")]
    Quota(String),
    #[error("the PageSpeed API key was rejected: {0}")]
    BadKey(String),
    #[error("PageSpeed could not test the page: {0}")]
    Lighthouse(String),
    #[error("PageSpeed API error {status}: {message}")]
    Api { status: u16, message: String },
    #[error("could not reach PageSpeed: {0}")]
    Network(String),
    #[error("unexpected PageSpeed response: {0}")]
    Parse(String),
}

impl SpeedError {
    /// A short, stable identifier for UIs.
    pub fn kind(&self) -> &'static str {
        match self {
            SpeedError::Quota(_) => "quota",
            SpeedError::BadKey(_) => "badKey",
            SpeedError::Lighthouse(_) => "lighthouse",
            SpeedError::Api { .. } => "api",
            SpeedError::Network(_) => "network",
            SpeedError::Parse(_) => "parse",
        }
    }
}

/// A PageSpeed Insights client.
#[derive(Debug, Clone)]
pub struct PageSpeed {
    endpoint: String,
    api_key: Option<String>,
    http: reqwest::Client,
}

impl PageSpeed {
    /// `api_key` is optional, but the shared keyless quota is usually exhausted.
    pub fn new(api_key: Option<String>) -> Result<Self, SpeedError> {
        Self::with_endpoint(ENDPOINT, api_key)
    }

    /// Uses another endpoint (tests).
    pub fn with_endpoint(endpoint: &str, api_key: Option<String>) -> Result<Self, SpeedError> {
        let http = reqwest::Client::builder()
            .timeout(TIMEOUT)
            .build()
            .map_err(|e| SpeedError::Network(e.to_string()))?;
        Ok(Self {
            endpoint: endpoint.to_owned(),
            api_key: api_key
                .map(|k| k.trim().to_owned())
                .filter(|k| !k.is_empty()),
            http,
        })
    }

    pub async fn run(&self, url: &Url, strategy: Strategy) -> Result<SpeedReport, SpeedError> {
        let mut request =
            Url::parse(&self.endpoint).map_err(|e| SpeedError::Network(e.to_string()))?;
        {
            let mut q = request.query_pairs_mut();
            q.append_pair("url", url.as_str());
            q.append_pair("strategy", strategy.as_param());
            for c in CATEGORIES {
                q.append_pair("category", c);
            }
            if let Some(key) = &self.api_key {
                q.append_pair("key", key);
            }
        }

        let response = self.http.get(request).send().await.map_err(|e| {
            // Never include the request URL in errors: it carries the API key.
            SpeedError::Network(e.without_url().to_string())
        })?;
        let status = response.status().as_u16();
        let body = response
            .bytes()
            .await
            .map_err(|e| SpeedError::Network(e.without_url().to_string()))?;
        let json: Value = serde_json::from_slice(&body)
            .map_err(|e| SpeedError::Parse(format!("HTTP {status}, body is not JSON ({e})")))?;

        if let Some(error) = json.get("error") {
            return Err(api_error(status, error));
        }
        if !(200..300).contains(&status) {
            return Err(SpeedError::Api {
                status,
                message: "no error details".into(),
            });
        }
        parse_report(&json, strategy)
    }
}

fn api_error(status: u16, error: &Value) -> SpeedError {
    let message = str_at(error, "/message").unwrap_or("no message").to_owned();
    let reason = str_at(error, "/errors/0/reason").unwrap_or_default();
    let lower = message.to_lowercase();
    match status {
        429 => SpeedError::Quota(message),
        400 | 403 if lower.contains("api key") || reason.contains("keyInvalid") => {
            SpeedError::BadKey(message)
        }
        // e.g. "Lighthouse returned error: FAILED_DOCUMENT_REQUEST. ..."
        _ if lower.contains("lighthouse returned error") => SpeedError::Lighthouse(message),
        _ => SpeedError::Api { status, message },
    }
}

fn str_at<'a>(v: &'a Value, pointer: &str) -> Option<&'a str> {
    v.pointer(pointer).and_then(Value::as_str)
}

fn f64_at(v: &Value, pointer: &str) -> Option<f64> {
    v.pointer(pointer).and_then(Value::as_f64)
}

/// Builds a report from a successful `runPagespeed` response.
pub fn parse_report(json: &Value, strategy: Strategy) -> Result<SpeedReport, SpeedError> {
    let lh = json
        .get("lighthouseResult")
        .ok_or_else(|| SpeedError::Parse("no lighthouseResult".into()))?;

    if let Some(code) = str_at(lh, "/runtimeError/code")
        && code != "NO_ERROR"
    {
        let message = str_at(lh, "/runtimeError/message").unwrap_or(code);
        return Err(SpeedError::Lighthouse(message.to_owned()));
    }

    let audits = lh.get("audits").cloned().unwrap_or(Value::Null);
    let audit = |id: &str| audits.get(id);

    let categories = CATEGORIES
        .iter()
        .map(|c| c.to_ascii_lowercase().replace('_', "-"))
        .filter_map(|id| {
            let cat = lh.pointer(&format!("/categories/{id}"))?;
            let mut failing: Vec<AuditResult> = cat
                .get("auditRefs")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .filter(|r| !matches!(str_at(r, "/group"), Some("metrics" | "hidden")))
                .filter_map(|r| audit(str_at(r, "/id")?))
                .filter_map(failing_audit)
                .collect();
            failing.sort_by(|a, b| {
                let savings = |x: &AuditResult| x.savings_ms.unwrap_or(0.0);
                savings(b)
                    .total_cmp(&savings(a))
                    .then(a.score.unwrap_or(0.0).total_cmp(&b.score.unwrap_or(0.0)))
            });
            Some(CategoryResult {
                title: str_at(cat, "/title").unwrap_or(&id).to_owned(),
                score: f64_at(cat, "/score").map(|s| (s * 100.0).round() as u8),
                id,
                failing,
            })
        })
        .collect();

    let lab_metrics = LAB_METRICS
        .iter()
        .filter_map(|id| {
            let a = audit(id)?;
            Some(LabMetric {
                id: (*id).to_owned(),
                title: str_at(a, "/title").unwrap_or(id).to_owned(),
                display_value: str_at(a, "/displayValue").map(str::to_owned),
                numeric_value: f64_at(a, "/numericValue"),
                score: f64_at(a, "/score"),
            })
        })
        .collect();

    let warnings = lh
        .get("runWarnings")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(|w| w.as_str().map(str::to_owned))
        .collect();

    Ok(SpeedReport {
        strategy,
        lighthouse_version: str_at(lh, "/lighthouseVersion").map(str::to_owned),
        final_url: str_at(lh, "/finalDisplayedUrl")
            .or_else(|| str_at(lh, "/finalUrl"))
            .map(str::to_owned),
        categories,
        lab_metrics,
        field: field_data(json),
        warnings,
    })
}

/// Page-level CrUX data, falling back to origin-level data PSI marks as such.
fn field_data(json: &Value) -> Option<FieldData> {
    let le = json.get("loadingExperience")?;
    let metrics_json = le.get("metrics")?.as_object()?;
    let metrics: Vec<FieldMetric> = FIELD_METRICS
        .iter()
        .filter_map(|&(key, label, unit)| {
            let m = metrics_json.get(key)?;
            let raw = f64_at(m, "/percentile")?;
            Some(FieldMetric {
                id: key.to_owned(),
                label: label.to_owned(),
                // CrUX reports CLS multiplied by 100 (5 means 0.05).
                p75: if unit == Unit::Unitless {
                    raw / 100.0
                } else {
                    raw
                },
                unit,
                rating: str_at(m, "/category").and_then(Rating::from_crux),
            })
        })
        .collect();
    if metrics.is_empty() {
        return None;
    }
    Some(FieldData {
        origin_fallback: le
            .get("origin_fallback")
            .and_then(Value::as_bool)
            .unwrap_or(false),
        overall: str_at(le, "/overall_category").and_then(Rating::from_crux),
        metrics,
    })
}

fn failing_audit(a: &Value) -> Option<AuditResult> {
    // notApplicable / informative / manual / error audits have no meaningful score.
    if !matches!(
        str_at(a, "/scoreDisplayMode"),
        Some("numeric" | "binary" | "metricSavings")
    ) {
        return None;
    }
    let score = f64_at(a, "/score")?;
    if score >= PASS_SCORE {
        return None;
    }
    let (description, learn_more) =
        strip_markdown_links(str_at(a, "/description").unwrap_or_default());
    let savings_ms = f64_at(a, "/details/overallSavingsMs")
        .or_else(|| {
            // Newer Lighthouse: per-metric savings; LCP is the one to show.
            f64_at(a, "/metricSavings/LCP").or_else(|| f64_at(a, "/metricSavings/FCP"))
        })
        .filter(|ms| *ms > 0.0);
    Some(AuditResult {
        id: str_at(a, "/id").unwrap_or_default().to_owned(),
        title: str_at(a, "/title").unwrap_or_default().to_owned(),
        description,
        learn_more,
        display_value: str_at(a, "/displayValue").map(str::to_owned),
        score: Some(score),
        savings_ms,
        savings_bytes: f64_at(a, "/details/overallSavingsBytes").filter(|b| *b > 0.0),
    })
}

/// `"Do X. [Learn more](https://…)."` → (`"Do X."`, `Some("https://…")`).
/// Links become their text, and the last link's URL is returned: Lighthouse
/// ends descriptions with a "Learn more"/"Learn how" link, which the UI shows
/// as its own link, so that trailing phrase is dropped from the text.
fn strip_markdown_links(s: &str) -> (String, Option<String>) {
    let mut out = String::with_capacity(s.len());
    let mut last_url = None;
    // Where the last link's text starts in `out`, and whether it reads "Learn …".
    let mut last_link: Option<(usize, bool)> = None;
    let mut rest = s;
    while let Some(open) = rest.find('[') {
        let after = &rest[open + 1..];
        let parsed = after.find("](").and_then(|close| {
            let url_part = &after[close + 2..];
            url_part
                .find(')')
                .map(|end| (close, &url_part[..end], &url_part[end + 1..]))
        });
        match parsed {
            Some((close, url, tail)) => {
                out.push_str(&rest[..open]);
                let text = &after[..close];
                last_link = Some((out.len(), text.trim_start().starts_with("Learn")));
                out.push_str(text);
                last_url = Some(url.to_owned());
                rest = tail;
            }
            None => {
                out.push_str(&rest[..=open]);
                rest = after;
            }
        }
    }
    // Drop a trailing "Learn more" link phrase (followed by nothing but punctuation).
    if let Some((start, true)) = last_link
        && rest.trim().chars().all(|c| c.is_ascii_punctuation())
    {
        out.truncate(start);
    } else {
        out.push_str(rest);
    }
    (out.trim().to_owned(), last_url)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn strips_markdown_links() {
        assert_eq!(
            strip_markdown_links("Serve images in modern formats. [Learn more](https://dev/x)."),
            (
                "Serve images in modern formats.".into(),
                Some("https://dev/x".into())
            )
        );
        assert_eq!(
            strip_markdown_links("No links [here]"),
            ("No links [here]".into(), None)
        );
        // Links mid-sentence keep their text.
        assert_eq!(
            strip_markdown_links("See [the guide](https://g) for details."),
            (
                "See the guide for details.".into(),
                Some("https://g".into())
            )
        );
    }

    #[test]
    fn maps_api_errors() {
        let e = |status, msg: &str| api_error(status, &json!({ "message": msg }));
        assert!(matches!(e(429, "Quota exceeded"), SpeedError::Quota(_)));
        assert!(matches!(
            e(400, "API key not valid. Please pass a valid API key."),
            SpeedError::BadKey(_)
        ));
        assert!(matches!(
            e(
                500,
                "Lighthouse returned error: FAILED_DOCUMENT_REQUEST. Lighthouse was unable to reliably load the page"
            ),
            SpeedError::Lighthouse(_)
        ));
        assert!(matches!(
            e(503, "Backend error"),
            SpeedError::Api { status: 503, .. }
        ));
    }

    #[test]
    fn runtime_error_is_reported() {
        let r = parse_report(
            &json!({ "lighthouseResult": { "runtimeError": { "code": "ERRORED_DOCUMENT_REQUEST", "message": "Status code: 404" } } }),
            Strategy::Mobile,
        );
        assert!(matches!(r, Err(SpeedError::Lighthouse(m)) if m == "Status code: 404"));
    }
}

//! Turning user input into a fetchable URL.

use url::Url;

/// Parses user input into an absolute `http`/`https` URL.
///
/// Port of `tryCreateUri` from the original site: input without a scheme gets
/// `http://` prepended (`example.com` → `http://example.com/`). Most sites then
/// redirect to HTTPS, and the redirect chain shows up in the report.
pub fn normalize(input: &str) -> Option<Url> {
    let input = input.trim();
    if input.is_empty() {
        return None;
    }
    if let Ok(url) = Url::parse(input)
        && is_web_url(&url)
    {
        return Some(url);
    }
    // An explicit non-web scheme (ftp://, file://) is not something we can review.
    if input.contains("://") {
        return None;
    }
    Url::parse(&format!("http://{input}"))
        .ok()
        .filter(is_web_url)
}

fn is_web_url(url: &Url) -> bool {
    matches!(url.scheme(), "http" | "https") && url.host_str().is_some_and(|h| !h.is_empty())
}

#[cfg(test)]
mod tests {
    use super::normalize;

    fn n(input: &str) -> Option<String> {
        normalize(input).map(|u| u.to_string())
    }

    #[test]
    fn keeps_absolute_web_urls() {
        assert_eq!(
            n("https://example.com/a?b=1").as_deref(),
            Some("https://example.com/a?b=1")
        );
        assert_eq!(
            n("http://example.com").as_deref(),
            Some("http://example.com/")
        );
    }

    #[test]
    fn prepends_http_when_scheme_missing() {
        assert_eq!(n("example.com").as_deref(), Some("http://example.com/"));
        assert_eq!(
            n("  example.com/path ").as_deref(),
            Some("http://example.com/path")
        );
        // `localhost:8080` parses as scheme "localhost"; it must still be treated as a host.
        assert_eq!(
            n("localhost:8080").as_deref(),
            Some("http://localhost:8080/")
        );
    }

    #[test]
    fn rejects_unusable_input() {
        assert_eq!(n(""), None);
        assert_eq!(n("   "), None);
        assert_eq!(n("ftp://example.com"), None);
        assert_eq!(n("http://"), None);
        assert_eq!(n("not a url"), None);
    }
}

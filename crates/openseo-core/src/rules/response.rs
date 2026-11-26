//! Rules on the HTTP response: indexing headers, HSTS and redirects.

use super::{Violation, ViolationCode};
use crate::fetch::Fetched;
use crate::head::Directives;

/// Checks the response headers and redirect chain of a fetched page.
pub fn review_response(http: &Fetched) -> Vec<Violation> {
    let mut out = Vec::new();
    check_x_robots_tag(http, &mut out);
    check_hsts(http, &mut out);
    check_redirects(http, &mut out);
    out
}

fn header_values<'a>(http: &'a Fetched, name: &str) -> impl Iterator<Item = &'a str> {
    http.headers
        .iter()
        .filter(move |h| h.name.eq_ignore_ascii_case(name))
        .flat_map(|h| h.values.iter().map(String::as_str))
}

/// The directives in one `X-Robots-Tag` value that apply to Google. A value
/// may start with a crawler name (`googlebot: noindex`); values for other
/// crawlers are ignored.
fn google_directives(value: &str) -> Option<&str> {
    match value.split_once(':') {
        // `unavailable_after: <date>` and `max-snippet:-1` are directives, not crawler names.
        Some((agent, rest))
            if !agent.contains(',')
                && !agent.trim().contains(['_', '-'])
                && !agent.trim().is_empty() =>
        {
            agent
                .trim()
                .eq_ignore_ascii_case("googlebot")
                .then_some(rest)
        }
        _ => Some(value),
    }
}

fn check_x_robots_tag(http: &Fetched, out: &mut Vec<Violation>) {
    let mut noindex = None;
    let mut nofollow = None;
    for value in header_values(http, "x-robots-tag") {
        let Some(directives) = google_directives(value) else {
            continue;
        };
        let d = Directives::parse(directives);
        if d.noindex {
            noindex.get_or_insert(value);
        }
        if d.nofollow {
            nofollow.get_or_insert(value);
        }
    }
    if let Some(value) = noindex {
        out.push(Violation::new(
            ViolationCode::Noindex,
            format!("The X-Robots-Tag header ({value:?}) keeps the page out of search results."),
            None,
        ));
    }
    if let Some(value) = nofollow {
        out.push(Violation::new(
            ViolationCode::Nofollow,
            format!("The X-Robots-Tag header ({value:?}) tells search engines not to follow any link on the page."),
            None,
        ));
    }
}

fn check_hsts(http: &Fetched, out: &mut Vec<Violation>) {
    if http.final_url.scheme() == "https"
        && header_values(http, "strict-transport-security")
            .next()
            .is_none()
    {
        out.push(Violation::new(
            ViolationCode::HstsMissing,
            "Without HSTS, browsers may make the first request to the site over http, where it can be intercepted before the redirect to https.",
            None,
        ));
    }
}

fn check_redirects(http: &Fetched, out: &mut Vec<Violation>) {
    let hops = http.redirects.len();
    if hops > 1 {
        let chain: Vec<&str> = http
            .redirects
            .iter()
            .map(|r| r.url.as_str())
            .chain(std::iter::once(http.final_url.as_str()))
            .collect();
        out.push(Violation::new(
            ViolationCode::RedirectChain,
            format!(
                "Reaching the page takes {hops} redirects ({}). Each hop adds latency, and crawlers may stop following long chains.",
                chain.join(" → ")
            ),
            None,
        ));
    }
    if let Some(r) = http
        .redirects
        .iter()
        .find(|r| matches!(r.status, 302 | 303 | 307))
    {
        out.push(Violation::new(
            ViolationCode::TemporaryRedirect,
            format!(
                "{} answers {}, a temporary redirect. For a permanent move, a 301 or 308 moves ranking signals to the new URL sooner.",
                r.url, r.status
            ),
            None,
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::super::ViolationCode::*;
    use super::*;
    use crate::fetch::{HttpHeader, Redirect};
    use url::Url;

    fn fetched(url: &str, headers: &[(&str, &str)], redirects: &[(&str, u16)]) -> Fetched {
        Fetched {
            requested_url: Url::parse(url).unwrap(),
            final_url: Url::parse(url).unwrap(),
            status: 200,
            redirects: redirects
                .iter()
                .map(|(u, s)| Redirect {
                    url: (*u).into(),
                    status: *s,
                    location: url.into(),
                })
                .collect(),
            headers: headers
                .iter()
                .map(|(n, v)| HttpHeader {
                    name: (*n).into(),
                    values: vec![(*v).into()],
                })
                .collect(),
            media_type: Some("text/html".into()),
            size_kb: 1.0,
            elapsed_ms: 1,
            html: None,
        }
    }

    fn codes(f: &Fetched) -> Vec<ViolationCode> {
        review_response(f).into_iter().map(|v| v.code).collect()
    }

    const HSTS: (&str, &str) = ("strict-transport-security", "max-age=31536000");

    #[test]
    fn clean_https_response() {
        assert_eq!(codes(&fetched("https://e.com/", &[HSTS], &[])), []);
        assert_eq!(
            codes(&fetched("http://e.com/", &[], &[])),
            [],
            "HSTS only applies to https"
        );
        assert_eq!(codes(&fetched("https://e.com/", &[], &[])), [HstsMissing]);
    }

    #[test]
    fn x_robots_tag_applies_to_google_only() {
        let page = |value| {
            codes(&fetched(
                "https://e.com/",
                &[HSTS, ("X-Robots-Tag", value)],
                &[],
            ))
        };
        assert_eq!(page("noindex, nofollow"), [Noindex, Nofollow]);
        assert_eq!(page("googlebot: noindex"), [Noindex]);
        assert_eq!(page("bingbot: noindex"), []);
        assert_eq!(page("unavailable_after: 25 Jun 2010 15:00:00 PST"), []);
        assert_eq!(page("max-snippet:-1, none"), [Noindex, Nofollow]);
    }

    #[test]
    fn redirect_rules() {
        let page = |r: &[(&str, u16)]| codes(&fetched("https://www.e.com/", &[HSTS], r));
        assert_eq!(page(&[("http://e.com/", 301)]), []);
        assert_eq!(
            page(&[("http://e.com/", 301), ("https://e.com/", 301)]),
            [RedirectChain]
        );
        assert_eq!(page(&[("http://e.com/", 302)]), [TemporaryRedirect]);
    }
}

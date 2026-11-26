//! Rules on how the page loads: HTTPS, mixed content and images.

use std::sync::LazyLock;

use scraper::{ElementRef, Selector};

use super::{Page, Violation, ViolationCode, position_of};
use crate::head::has_rel;
use crate::html::{base_url, selector};

static IMG: LazyLock<Selector> = LazyLock::new(|| selector("img"));
static BODY_IMG: LazyLock<Selector> = LazyLock::new(|| selector("body img"));
static SUBRESOURCES: LazyLock<Selector> = LazyLock::new(|| {
    selector(
        "script[src], link[href], iframe[src], frame[src], embed[src], object[data], \
         img[src], video[src], video[poster], audio[src], source[src], track[src], input[type=image][src]",
    )
});

pub(super) fn check(page: &Page<'_>, out: &mut Vec<Violation>) {
    check_https(page, out);
    check_images(page, out);
}

/// The URL an element loads, and whether browsers block it as active mixed
/// content (code that can change the page) rather than passive (media).
fn subresource(el: ElementRef<'_>) -> Option<(&str, bool)> {
    let v = el.value();
    match v.name() {
        "script" => Some((v.attr("src")?, true)),
        "link" => {
            // Only links the browser loads: stylesheets, preloads, icons, manifests.
            let loads = ["stylesheet", "preload", "modulepreload", "icon", "manifest"]
                .iter()
                .any(|rel| has_rel(el, rel));
            loads.then_some((
                v.attr("href")?,
                has_rel(el, "stylesheet") || has_rel(el, "modulepreload"),
            ))
        }
        "iframe" | "frame" | "embed" => Some((v.attr("src")?, true)),
        "object" => Some((v.attr("data")?, true)),
        "video" => Some((v.attr("src").or_else(|| v.attr("poster"))?, false)),
        _ => Some((v.attr("src")?, false)),
    }
}

fn check_https(page: &Page<'_>, out: &mut Vec<Violation>) {
    match page.url.scheme() {
        "http" => {
            return out.push(Violation::new(
                ViolationCode::NotHttps,
                format!("{} is served over plain http. Browsers mark it \"Not secure\", and HTTPS is a Google ranking signal.", page.url),
                None,
            ));
        }
        "https" => {}
        _ => return,
    }
    let base = base_url(page.doc, page.url);
    for el in page.doc.select(&SUBRESOURCES) {
        let Some((href, active)) = subresource(el) else {
            continue;
        };
        let Ok(url) = base.join(href.trim()) else {
            continue;
        };
        if url.scheme() != "http" {
            continue;
        }
        let (code, effect) = if active {
            (
                ViolationCode::MixedContentActive,
                "Browsers block it, which can break the page.",
            )
        } else {
            (
                ViolationCode::MixedContentPassive,
                "Browsers upgrade or block it, and may show the page as not fully secure.",
            )
        };
        out.push(Violation::new(
            code,
            format!(
                "<{}> loads {url} over http on an https page. {effect}",
                el.value().name()
            ),
            position_of(page.doc, &page.map, el),
        ));
    }
}

fn check_images(page: &Page<'_>, out: &mut Vec<Violation>) {
    let images: Vec<_> = page.doc.select(&IMG).collect();
    let no_size: Vec<_> = images
        .iter()
        .filter(|img| {
            let v = img.value();
            v.attr("width").is_none() || v.attr("height").is_none()
        })
        .collect();
    if let Some(first) = no_size.first() {
        out.push(Violation::new(
            ViolationCode::ImageNoDimensions,
            format!(
                "{} of {} images have no width and height attributes. The browser can't reserve their space, so the layout jumps as they load (Cumulative Layout Shift).",
                no_size.len(),
                images.len()
            ),
            position_of(page.doc, &page.map, **first),
        ));
    }
    if let Some(first) = page.doc.select(&BODY_IMG).next()
        && first
            .value()
            .attr("loading")
            .is_some_and(|l| l.trim().eq_ignore_ascii_case("lazy"))
    {
        out.push(Violation::new(
            ViolationCode::LazyFirstImage,
            "The first image on the page has loading=\"lazy\". If it shows in the first screen, lazy loading delays it and hurts Largest Contentful Paint.",
            position_of(page.doc, &page.map, first),
        ));
    }
}

#[cfg(test)]
mod tests {
    use super::super::ViolationCode::*;
    use super::super::test_util::codes_in;

    fn codes(url: &str, body: &str) -> Vec<super::ViolationCode> {
        let only = &[
            NotHttps,
            MixedContentActive,
            MixedContentPassive,
            ImageNoDimensions,
            LazyFirstImage,
        ];
        codes_in(&format!("<html><body>{body}</body></html>"), url, only)
    }

    #[test]
    fn https_and_mixed_content() {
        assert_eq!(codes("http://e.com/", ""), [NotHttps]);
        assert_eq!(
            codes(
                "https://e.com/",
                r#"<script src="http://cdn.e.com/a.js"></script><img src="http://e.com/i.png" width=1 height=1>
                <link rel="stylesheet" href="http://e.com/s.css"><link rel="alternate" href="http://e.com/feed">
                <a href="http://e.com/page">link</a><script src="//cdn.e.com/b.js"></script><img src="/ok.png" width=1 height=1>"#
            ),
            [MixedContentActive, MixedContentPassive, MixedContentActive]
        );
    }

    #[test]
    fn image_rules() {
        let url = "https://e.com/";
        assert_eq!(
            codes(
                url,
                r#"<img src=a width=10 height=10><img src=b loading=lazy width=1 height=1>"#
            ),
            []
        );
        assert_eq!(
            codes(url, r#"<img src=a width=10><img src=b>"#),
            [ImageNoDimensions]
        );
        assert_eq!(
            codes(url, r#"<img src=a loading="lazy" width=1 height=1>"#),
            [LazyFirstImage]
        );
    }
}

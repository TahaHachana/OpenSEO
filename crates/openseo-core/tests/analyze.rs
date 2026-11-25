//! Whole-report tests over fixture pages. The explicit assertions document the
//! expected findings; the snapshots catch any other change in the output.

use openseo_core::rules::ViolationCode::{self, *};
use openseo_core::{Analysis, analyze};
use url::Url;

fn fixture(name: &str, url: &str) -> Analysis {
    let path = format!("{}/tests/fixtures/{name}", env!("CARGO_MANIFEST_DIR"));
    let html = std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("{path}: {e}"));
    analyze(&html, &Url::parse(url).unwrap())
}

fn codes(v: &[openseo_core::rules::Violation]) -> Vec<ViolationCode> {
    v.iter().map(|v| v.code).collect()
}

#[test]
fn clean_page() {
    let a = fixture("clean.html", "https://acme.example/");
    assert!(a.errors.is_empty(), "{:#?}", a.errors);
    assert!(a.warnings.is_empty(), "{:#?}", a.warnings);
    assert_eq!(
        a.title.as_deref(),
        Some("Fresh Roasted Coffee Beans | Acme Roasters")
    );
    assert_eq!(a.headings.len(), 3);
    assert_eq!(a.links.len(), 6);
    let top = &a.keywords[0];
    assert_eq!((top.words, top.combination.as_str()), (1, "coffee"));
    insta::assert_json_snapshot!(a);
}

#[test]
fn page_with_violations() {
    let a = fixture(
        "violations.html",
        "https://shop.example/?a=1&b=2&c=3&d=4&e=5",
    );
    assert_eq!(codes(&a.errors), vec![]);
    assert_eq!(
        codes(&a.warnings),
        vec![
            AltMissing,
            AltEmpty,
            DescriptionLong,
            H1Multiple,
            LargeInlineCss,
            LargeInlineScript,
            QueryParameterCount,
            TitleShort,
            RefreshToRedirect,
        ]
    );
    // The commented-out <img> must not shift positions of the real ones.
    let alt_missing = a.warnings[0].position.unwrap();
    assert_eq!((alt_missing.line, alt_missing.column), (93, 1));
    insta::assert_json_snapshot!(a);
}

#[test]
fn page_missing_basics() {
    let a = fixture("missing.html", "https://bare.example/");
    assert_eq!(codes(&a.errors), vec![TitleMissing]);
    assert_eq!(codes(&a.warnings), vec![DescriptionMissing, H1Missing]);
    insta::assert_json_snapshot!(a);
}

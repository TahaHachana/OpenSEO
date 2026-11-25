//! Keyword density analysis. Port of `SEOLib.Keywords`.
//!
//! Like the original, text is lowercased, stop words act as phrase breaks, and
//! combinations of 1, 2 and 3 consecutive words are counted. Density is
//! `occurrence / total_words * 100 * words_in_combination`.
//!
//! Deliberate fixes over SEOLib:
//! - Text comes from the DOM, so entities are decoded (`&amp;` no longer yields "amp").
//! - 2- and 3-word combinations are counted with a sliding window. SEOLib's
//!   non-overlapping regex scan missed combinations such as "b c" in "a b c".
//! - Inline formatting (`<b>`, `<em>`, `<span>`…) does not break phrases; block
//!   elements and links do (adjacent nav links are separate phrases, not one).
//!   Punctuation still breaks phrases, as before.

use std::collections::{HashMap, HashSet};
use std::sync::LazyLock;

use ego_tree::NodeRef;
use scraper::{Html, Node};
use serde::Serialize;

use crate::text::{INLINE, is_hidden, round2};

static STOP_WORDS: LazyLock<HashSet<&'static str>> = LazyLock::new(|| {
    include_str!("../data/english-stopwords.txt")
        .lines()
        .map(str::trim)
        .filter(|w| !w.is_empty())
        .collect()
});

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Keyword {
    /// Number of words in the combination (1, 2 or 3).
    pub words: u8,
    pub combination: String,
    pub occurrence: u32,
    /// Percentage of the page's (non-stop) words covered by this combination.
    pub density: f64,
}

/// Keyword combinations of the page, grouped by word count (1, 2, 3), then by
/// occurrence (descending), then by first appearance.
pub fn analyze(doc: &Html) -> Vec<Keyword> {
    let mut segments = vec![String::new()];
    collect_segments(*doc.root_element(), &mut segments);

    let runs: Vec<Vec<String>> = segments.iter().flat_map(|s| word_runs(s)).collect();
    let total: usize = runs.iter().map(Vec::len).sum();
    if total == 0 {
        return Vec::new();
    }

    let mut keywords = Vec::new();
    for n in 1..=3 {
        // combination -> (occurrence, first appearance)
        let mut counts: HashMap<String, (u32, usize)> = HashMap::new();
        let mut order = 0;
        for run in &runs {
            for window in run.windows(n) {
                let entry = counts.entry(window.join(" ")).or_insert((0, order));
                entry.0 += 1;
                order += 1;
            }
        }
        let mut found: Vec<_> = counts.into_iter().collect();
        found.sort_by(|(_, (oa, fa)), (_, (ob, fb))| ob.cmp(oa).then(fa.cmp(fb)));
        keywords.extend(
            found
                .into_iter()
                .map(|(combination, (occurrence, _))| Keyword {
                    words: n as u8,
                    density: round2(f64::from(occurrence) / total as f64 * 100.0 * n as f64),
                    combination,
                    occurrence,
                }),
        );
    }
    keywords
}

/// Splits the document's visible text into blocks: a new segment starts at
/// every non-inline element boundary.
fn collect_segments(node: NodeRef<'_, Node>, segments: &mut Vec<String>) {
    for child in node.children() {
        match child.value() {
            Node::Text(text) => segments.last_mut().expect("never empty").push_str(text),
            Node::Element(el) if is_hidden(el.name()) => {}
            Node::Element(el) if INLINE.contains(&el.name()) => collect_segments(child, segments),
            Node::Element(_) => {
                segments.push(String::new());
                collect_segments(child, segments);
                segments.push(String::new());
            }
            _ => {}
        }
    }
}

/// Lowercased runs of consecutive non-stop words. Punctuation and stop words
/// end a run; whitespace does not.
fn word_runs(text: &str) -> Vec<Vec<String>> {
    let mut runs = Vec::new();
    let mut run: Vec<String> = Vec::new();
    let mut word = String::new();

    let end_word = |word: &mut String, run: &mut Vec<String>, runs: &mut Vec<Vec<String>>| {
        if word.is_empty() {
            return;
        }
        let w = std::mem::take(word);
        if STOP_WORDS.contains(w.as_str()) {
            runs.push(std::mem::take(run));
        } else {
            run.push(w);
        }
    };

    let chars: Vec<char> = text.chars().collect();
    for (i, &c) in chars.iter().enumerate() {
        if c.is_alphanumeric() || c == '_' {
            word.extend(c.to_lowercase());
        } else if (c == '\'' || c == '’')
            && !word.is_empty()
            && chars.get(i + 1).is_some_and(|n| n.is_alphanumeric())
        {
            // Apostrophe inside a word ("don't"); stop words use ASCII apostrophes.
            word.push('\'');
        } else {
            end_word(&mut word, &mut run, &mut runs);
            if !c.is_whitespace() {
                runs.push(std::mem::take(&mut run));
            }
        }
    }
    end_word(&mut word, &mut run, &mut runs);
    runs.push(run);
    runs.retain(|r| !r.is_empty());
    runs
}

#[cfg(test)]
mod tests {
    use super::*;

    fn kw(html: &str) -> Vec<(u8, String, u32, f64)> {
        analyze(&Html::parse_document(html))
            .into_iter()
            .map(|k| (k.words, k.combination, k.occurrence, k.density))
            .collect()
    }

    #[test]
    fn stop_words_and_punctuation_break_phrases() {
        assert_eq!(
            word_runs("The Coffee beans, roasted beans and don't panic"),
            vec![
                vec!["coffee", "beans"],
                vec!["roasted", "beans"],
                vec!["panic"]
            ]
        );
    }

    #[test]
    fn curly_apostrophes_match_stop_words() {
        assert_eq!(word_runs("don’t panic"), vec![vec!["panic"]]);
    }

    #[test]
    fn counts_sliding_combinations_with_density() {
        // 3 non-stop words: "espresso machine reviews"
        let k = kw("<p>Espresso machine reviews</p>");
        assert_eq!(
            k,
            vec![
                (1, "espresso".into(), 1, 33.33),
                (1, "machine".into(), 1, 33.33),
                (1, "reviews".into(), 1, 33.33),
                (2, "espresso machine".into(), 1, 66.67),
                (2, "machine reviews".into(), 1, 66.67),
                (3, "espresso machine reviews".into(), 1, 100.0),
            ]
        );
    }

    #[test]
    fn sorts_by_occurrence_then_first_appearance() {
        let k = kw("<p>tea coffee coffee tea coffee</p>");
        assert_eq!(k[0], (1, "coffee".into(), 3, 60.0));
        assert_eq!(k[1], (1, "tea".into(), 2, 40.0));
    }

    #[test]
    fn blocks_break_phrases_but_inline_elements_do_not() {
        let k = kw("<h1>green</h1><p>tea <b>leaves</b></p><script>green tea</script>");
        let pairs: Vec<_> = k
            .iter()
            .filter(|k| k.0 == 2)
            .map(|k| k.1.as_str())
            .collect();
        assert_eq!(pairs, vec!["tea leaves"]);
    }

    #[test]
    fn adjacent_links_are_separate_phrases() {
        let k = kw(r#"<nav><a href="/">Shop</a> <a href="/c">Cart</a></nav>"#);
        assert!(k.iter().all(|k| k.0 == 1), "{k:?}");
    }

    #[test]
    fn decodes_entities() {
        let k = kw("<p>fish &amp; chips</p>");
        assert!(k.iter().all(|k| !k.1.contains("amp")));
    }

    #[test]
    fn empty_page_has_no_keywords() {
        assert!(kw("<p>the and of</p>").is_empty());
    }
}

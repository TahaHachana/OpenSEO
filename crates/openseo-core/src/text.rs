//! DOM text helpers shared by the analyzers.

use ego_tree::NodeRef;
use scraper::Node;

/// Elements whose text is never rendered as page content.
const HIDDEN: &[&str] = &["script", "style", "noscript", "template"];

pub(crate) fn is_hidden(name: &str) -> bool {
    HIDDEN.contains(&name)
}

/// Inline formatting elements: text on either side of them belongs to the same
/// run of text. Any other element (block, `<br>`, table cell…) separates text.
/// `<a>` is not listed: keyword analysis treats links as phrase boundaries,
/// while text extraction handles it separately in [`push_text`].
pub(crate) const INLINE: &[&str] = &[
    "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "font", "i", "kbd", "mark",
    "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var",
];

/// Concatenates the text under `node`, skipping script/style/noscript/template.
/// Comments are not text nodes, so they are skipped too. Non-inline elements are
/// surrounded by spaces, so `<div>A</div><div>B</div>` reads "A B", not "AB".
pub(crate) fn raw_text(node: NodeRef<'_, Node>) -> String {
    let mut out = String::new();
    push_text(node, &mut out);
    out
}

fn push_text(node: NodeRef<'_, Node>, out: &mut String) {
    for child in node.children() {
        match child.value() {
            Node::Text(text) => out.push_str(text),
            Node::Element(el) if is_hidden(el.name()) => {}
            Node::Element(el) if el.name() == "a" || INLINE.contains(&el.name()) => {
                push_text(child, out)
            }
            Node::Element(_) => {
                out.push(' ');
                push_text(child, out);
                out.push(' ');
            }
            _ => {}
        }
    }
}

/// Visible text with whitespace runs collapsed to single spaces and trimmed.
pub(crate) fn visible_text(node: NodeRef<'_, Node>) -> String {
    collapse_whitespace(&raw_text(node))
}

pub(crate) fn collapse_whitespace(s: &str) -> String {
    s.split_whitespace().collect::<Vec<_>>().join(" ")
}

pub(crate) fn round2(x: f64) -> f64 {
    (x * 100.0).round() / 100.0
}

#[cfg(test)]
mod tests {
    use super::*;
    use scraper::Html;

    fn text(html: &str) -> String {
        visible_text(*Html::parse_fragment(html).root_element())
    }

    #[test]
    fn block_boundaries_become_spaces() {
        assert_eq!(
            text("<a><div>GitHub</div><div>Repository hosting</div></a>"),
            "GitHub Repository hosting"
        );
        assert_eq!(text("one<br>two"), "one two");
    }

    #[test]
    fn inline_elements_do_not_split_words() {
        assert_eq!(text("<p>Hel<b>lo</b> <a>wor</a>ld</p>"), "Hello world");
    }
}

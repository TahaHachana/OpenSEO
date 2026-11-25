//! DOM text helpers shared by the analyzers.

use ego_tree::NodeRef;
use scraper::Node;

/// Elements whose text is never rendered as page content.
const HIDDEN: &[&str] = &["script", "style", "noscript", "template"];

pub(crate) fn is_hidden(name: &str) -> bool {
    HIDDEN.contains(&name)
}

/// Concatenates the text under `node`, skipping script/style/noscript/template.
/// Comments are not text nodes, so they are skipped too.
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
            Node::Element(_) => push_text(child, out),
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

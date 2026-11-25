//! Maps DOM elements back to line/column positions in the HTML source.
//!
//! The DOM parser does not keep source locations, so we scan the raw HTML for
//! opening tags (skipping comments and raw-text `<script>`/`<style>` content)
//! and match the n-th `<img>` in the DOM with the n-th `<img` in the source.
//! This is exact for well-formed pages and a close approximation otherwise.

use serde::Serialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub struct Position {
    /// 1-based line number.
    pub line: usize,
    /// 1-based column, in characters.
    pub column: usize,
}

pub(crate) struct SourceMap<'a> {
    src: &'a str,
    line_starts: Vec<usize>,
}

impl<'a> SourceMap<'a> {
    pub(crate) fn new(src: &'a str) -> Self {
        let line_starts = std::iter::once(0)
            .chain(src.match_indices('\n').map(|(i, _)| i + 1))
            .collect();
        Self { src, line_starts }
    }

    /// Byte offsets of every `<name` opening tag, in source order.
    pub(crate) fn tag_offsets(&self, name: &str) -> Vec<usize> {
        let bytes = self.src.as_bytes();
        let mut found = Vec::new();
        let mut i = 0;
        while let Some(rel) = bytes[i..].iter().position(|&b| b == b'<') {
            let at = i + rel;
            let rest = &bytes[at + 1..];
            if rest.starts_with(b"!--") {
                i = find(bytes, at + 4, b"-->").map_or(bytes.len(), |e| e + 3);
                continue;
            }
            let tag = tag_name_at(rest);
            if tag.eq_ignore_ascii_case(name.as_bytes()) {
                found.push(at);
            }
            i = at + 1;
            // Skip raw-text element content so `"<img"` inside a script is not a tag.
            for raw in ["script", "style"] {
                if tag.eq_ignore_ascii_case(raw.as_bytes()) {
                    let close = format!("</{raw}");
                    i = find_ci(bytes, at + 1, close.as_bytes()).unwrap_or(bytes.len());
                }
            }
        }
        found
    }

    pub(crate) fn position(&self, offset: usize) -> Position {
        let line = self.line_starts.partition_point(|&s| s <= offset);
        let start = self.line_starts[line - 1];
        let column = self.src[start..offset].chars().count() + 1;
        Position { line, column }
    }
}

/// The tag name right after `<`, if it is followed by whitespace, `>` or `/`.
fn tag_name_at(rest: &[u8]) -> &[u8] {
    let len = rest
        .iter()
        .position(|b| !b.is_ascii_alphanumeric())
        .unwrap_or(rest.len());
    match rest.get(len) {
        Some(b' ' | b'\t' | b'\n' | b'\r' | b'\x0c' | b'>' | b'/') | None if len > 0 => {
            &rest[..len]
        }
        _ => &[],
    }
}

fn find(hay: &[u8], from: usize, needle: &[u8]) -> Option<usize> {
    hay.get(from..)?
        .windows(needle.len())
        .position(|w| w == needle)
        .map(|p| from + p)
}

fn find_ci(hay: &[u8], from: usize, needle: &[u8]) -> Option<usize> {
    hay.get(from..)?
        .windows(needle.len())
        .position(|w| w.eq_ignore_ascii_case(needle))
        .map(|p| from + p)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_tags_outside_comments_and_scripts() {
        let src = "<IMG src=a>\n<!-- <img> -->\n<script>'<img>'</script><img/><imgx><img\nalt>";
        let map = SourceMap::new(src);
        let offsets = map.tag_offsets("img");
        let positions: Vec<_> = offsets.iter().map(|&o| map.position(o)).collect();
        assert_eq!(
            positions,
            vec![
                Position { line: 1, column: 1 },
                Position {
                    line: 3,
                    column: 25
                },
                Position {
                    line: 3,
                    column: 37
                },
            ]
        );
    }

    #[test]
    fn finds_script_and_style_tags_themselves() {
        let src = "<style>p{}</style><script src=x></script><SCRIPT>1</SCRIPT>";
        let map = SourceMap::new(src);
        assert_eq!(map.tag_offsets("script"), vec![18, 41]);
        assert_eq!(map.tag_offsets("style"), vec![0]);
    }

    #[test]
    fn columns_count_characters_not_bytes() {
        let src = "héllo <h1>";
        let map = SourceMap::new(src);
        assert_eq!(
            map.position(map.tag_offsets("h1")[0]),
            Position { line: 1, column: 7 }
        );
    }
}

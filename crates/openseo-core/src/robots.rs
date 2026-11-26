//! robots.txt parsing and matching, following RFC 9309 and Google's documented
//! behavior:
//! - A crawler obeys the groups naming its product token (case-insensitive),
//!   merged, or else the `*` groups. Consecutive `User-agent` lines share a group.
//! - The longest matching rule wins; on a tie, `Allow` wins.
//! - `*` matches any sequence, a trailing `$` anchors the end of the URL path.
//! - `/robots.txt` itself is always allowed.

use serde::Serialize;

/// A parsed robots.txt.
#[derive(Debug, Clone, Default)]
pub struct Robots {
    groups: Vec<Group>,
    /// `Sitemap:` URLs, in file order. They apply to every crawler.
    pub sitemaps: Vec<String>,
}

#[derive(Debug, Clone, Default)]
struct Group {
    /// Lowercased product tokens (`googlebot`, `*`).
    agents: Vec<String>,
    rules: Vec<Rule>,
}

/// An `Allow` or `Disallow` line.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Rule {
    pub allow: bool,
    pub pattern: String,
    /// 1-based line number in robots.txt.
    pub line: usize,
}

impl std::fmt::Display for Rule {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let kind = if self.allow { "Allow" } else { "Disallow" };
        write!(f, "{kind}: {}", self.pattern)
    }
}

/// Whether a URL may be crawled, and the rule that decided it (none when no
/// rule matched, which means allowed).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Verdict {
    pub allowed: bool,
    pub rule: Option<Rule>,
}

impl Robots {
    pub fn parse(txt: &str) -> Self {
        let mut robots = Robots::default();
        // Whether the current group has rules yet: a User-agent line after a
        // rule starts a new group, consecutive User-agent lines share one.
        let mut in_rules = false;
        for (index, raw) in txt.lines().enumerate() {
            let line = raw.split('#').next().unwrap_or("").trim();
            let Some((key, value)) = line.split_once(':') else {
                continue;
            };
            let value = value.trim();
            match key.trim().to_ascii_lowercase().as_str() {
                "user-agent" => {
                    if in_rules || robots.groups.is_empty() {
                        robots.groups.push(Group::default());
                        in_rules = false;
                    }
                    let token = value
                        .split('/')
                        .next()
                        .unwrap_or("")
                        .trim()
                        .to_ascii_lowercase();
                    if let Some(group) = robots.groups.last_mut() {
                        group.agents.push(token);
                    }
                }
                key @ ("allow" | "disallow") => {
                    in_rules = true;
                    // An empty Disallow allows everything: it is not a rule.
                    if value.is_empty() {
                        continue;
                    }
                    if let Some(group) = robots.groups.last_mut() {
                        group.rules.push(Rule {
                            allow: key == "allow",
                            pattern: value.to_owned(),
                            line: index + 1,
                        });
                    }
                }
                "sitemap" if !value.is_empty() => robots.sitemaps.push(value.to_owned()),
                _ => {}
            }
        }
        robots
    }

    /// The rules that apply to `agent` (a product token such as `Googlebot`).
    fn rules_for(&self, agent: &str) -> Vec<&Rule> {
        let agent = agent.to_ascii_lowercase();
        let named = |token: &str| {
            self.groups
                .iter()
                .filter(|g| g.agents.iter().any(|a| a == token))
                .flat_map(|g| &g.rules)
                .collect::<Vec<_>>()
        };
        let specific = named(&agent);
        let has_group = self.groups.iter().any(|g| g.agents.contains(&agent));
        if has_group { specific } else { named("*") }
    }

    /// Checks `path` (the URL path plus query, e.g. `/shop?page=2`) for `agent`.
    pub fn check(&self, agent: &str, path: &str) -> Verdict {
        if path == "/robots.txt" {
            return Verdict {
                allowed: true,
                rule: None,
            };
        }
        let best = self
            .rules_for(agent)
            .into_iter()
            .filter(|r| matches(&r.pattern, path))
            .max_by_key(|r| (r.pattern.len(), r.allow));
        Verdict {
            allowed: best.is_none_or(|r| r.allow),
            rule: best.cloned(),
        }
    }
}

/// Whether `pattern` matches `path` from its start. `*` matches any sequence;
/// a trailing `$` requires the match to reach the end of `path`.
fn matches(pattern: &str, path: &str) -> bool {
    let (pattern, anchored) = match pattern.strip_suffix('$') {
        Some(p) => (p, true),
        None => (pattern, false),
    };
    let p = pattern.as_bytes();
    let s = path.as_bytes();
    // Classic wildcard matching with backtracking to the last `*`.
    let (mut pi, mut si) = (0, 0);
    let mut star: Option<(usize, usize)> = None;
    loop {
        if pi == p.len() && (!anchored || si == s.len()) {
            return true;
        }
        if pi < p.len() && p[pi] == b'*' {
            star = Some((pi, si));
            pi += 1;
        } else if pi < p.len() && si < s.len() && p[pi] == s[si] {
            pi += 1;
            si += 1;
        } else if let Some((sp, ss)) = star
            && ss < s.len()
        {
            pi = sp + 1;
            si = ss + 1;
            star = Some((sp, ss + 1));
        } else {
            return false;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn wildcard_matching() {
        assert!(matches("/", "/anything"));
        assert!(matches("/fish", "/fish.html"));
        assert!(!matches("/fish", "/Fish"));
        assert!(matches("/*.php$", "/folder/file.php"));
        assert!(!matches("/*.php$", "/folder/file.php?x"));
        assert!(matches("/*.php", "/folder/file.php?x"));
        assert!(matches("/fish*", "/fish"));
        assert!(matches("/*/b", "/a/x/b"));
        assert!(!matches("/a$", "/ab"));
        assert!(matches("/a$", "/a"));
    }

    const TXT: &str = "\
# comment
User-agent: *
Disallow: /private/
Allow: /private/public.html

User-agent: Googlebot
User-agent: Bingbot/2.0
Disallow: /no-google/
Disallow: /shop
Allow: /shop/
Disallow:   # empty: no rule

Sitemap: https://e.com/sitemap.xml
user-agent: GOOGLEBOT
disallow: /also-no-google
";

    #[test]
    fn groups_and_precedence() {
        let r = Robots::parse(TXT);
        assert_eq!(r.sitemaps, ["https://e.com/sitemap.xml"]);

        // Googlebot uses its own (merged) groups, not `*`.
        assert!(r.check("Googlebot", "/private/x").allowed);
        let v = r.check("googlebot", "/no-google/page");
        assert!(!v.allowed);
        assert_eq!(v.rule.as_ref().map(|r| r.line), Some(8));
        assert!(!r.check("Googlebot", "/also-no-google").allowed);
        // Longest match: Allow /shop/ beats Disallow /shop.
        assert!(r.check("Googlebot", "/shop/item").allowed);
        assert!(!r.check("Googlebot", "/shopping").allowed);
        assert!(!r.check("bingbot", "/no-google/").allowed);

        // Others fall back to `*`.
        let v = r.check("OtherBot", "/private/x");
        assert_eq!(
            v.rule.map(|r| r.to_string()).as_deref(),
            Some("Disallow: /private/")
        );
        assert!(r.check("OtherBot", "/private/public.html").allowed);
        assert!(r.check("OtherBot", "/robots.txt").allowed);
    }

    #[test]
    fn tie_goes_to_allow_and_empty_files_allow_all() {
        let r = Robots::parse("User-agent: *\nDisallow: /page\nAllow: /page\n");
        assert!(r.check("x", "/page").allowed);
        assert!(Robots::parse("").check("x", "/a").allowed);
        let all = Robots::parse("User-agent: *\nDisallow: /\n");
        assert!(!all.check("Googlebot", "/a").allowed);
    }
}

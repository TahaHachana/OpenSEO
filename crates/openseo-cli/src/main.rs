use std::process::ExitCode;
use std::time::Duration;

use clap::{Parser, Subcommand, ValueEnum};
use openseo_core::fetch::Fetched;
use openseo_core::html::{LinkKind, LinkRel};
use openseo_core::pagespeed::{PageSpeed, Rating, SpeedReport, Strategy, Unit};
use openseo_core::rules::Violation;
use openseo_core::{FetchOptions, Review, ReviewResult, UserAgent};
use serde::Serialize;

/// OpenSEO: enter a URL, get an SEO report.
#[derive(Parser)]
#[command(name = "openseo", version = openseo_core::VERSION)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Analyze a single page and print its SEO report.
    Report {
        /// The page URL. `http://` is assumed when the scheme is missing.
        url: String,
        /// Print the full report as JSON.
        #[arg(long)]
        json: bool,
        /// Also list every link and HTTP header.
        #[arg(short, long)]
        verbose: bool,
        /// Number of keywords to show per combination length.
        #[arg(long, default_value_t = 10)]
        top: usize,
        /// User-Agent: a preset (openseo, chrome, chrome-mobile, googlebot) or any string.
        #[arg(long, default_value = "openseo")]
        user_agent: UserAgent,
        /// Request timeout in seconds.
        #[arg(long, default_value_t = 30)]
        timeout: u64,
    },
    /// Run PageSpeed Insights (Lighthouse + Chrome UX Report) for a page.
    ///
    /// Sends the URL to Google. Without an API key the shared quota is usually
    /// exhausted; get a free key at
    /// https://developers.google.com/speed/docs/insights/v5/get-started
    Speed {
        /// The page URL. `http://` is assumed when the scheme is missing.
        url: String,
        #[arg(long, value_enum, default_value_t = StrategyArg::Mobile)]
        strategy: StrategyArg,
        /// PageSpeed Insights API key.
        #[arg(long, env = "OPENSEO_PAGESPEED_KEY", hide_env_values = true)]
        api_key: Option<String>,
        /// Print the full report as JSON.
        #[arg(long)]
        json: bool,
        /// Number of failing audits to show per category.
        #[arg(long, default_value_t = 5)]
        top: usize,
    },
}

#[derive(Clone, Copy, ValueEnum)]
enum StrategyArg {
    Mobile,
    Desktop,
}

impl From<StrategyArg> for Strategy {
    fn from(s: StrategyArg) -> Self {
        match s {
            StrategyArg::Mobile => Strategy::Mobile,
            StrategyArg::Desktop => Strategy::Desktop,
        }
    }
}

#[tokio::main]
async fn main() -> ExitCode {
    match Cli::parse().command {
        Command::Report {
            url,
            json,
            verbose,
            top,
            user_agent,
            timeout,
        } => {
            let options = FetchOptions {
                user_agent,
                timeout: Duration::from_secs(timeout),
                ..FetchOptions::default()
            };
            let result = openseo_core::review(&url, &options).await;
            let success = matches!(result, ReviewResult::Success(_));
            if json {
                if !print_json(&result) {
                    return ExitCode::FAILURE;
                }
            } else {
                print_result(&result, verbose, top);
            }
            if success {
                ExitCode::SUCCESS
            } else {
                ExitCode::FAILURE
            }
        }
        Command::Speed {
            url,
            strategy,
            api_key,
            json,
            top,
        } => {
            let Some(page) = openseo_core::url::normalize(&url) else {
                eprintln!("error: {url:?} is not a valid http(s) URL");
                return ExitCode::FAILURE;
            };
            let psi = match PageSpeed::new(api_key) {
                Ok(psi) => psi,
                Err(e) => {
                    eprintln!("error: {e}");
                    return ExitCode::FAILURE;
                }
            };
            eprintln!("Running Lighthouse on {page} (usually 10–60 s)…");
            match psi.run(&page, strategy.into()).await {
                Ok(report) if json => {
                    if print_json(&report) {
                        ExitCode::SUCCESS
                    } else {
                        ExitCode::FAILURE
                    }
                }
                Ok(report) => {
                    print_speed(&report, top);
                    ExitCode::SUCCESS
                }
                Err(e) => {
                    eprintln!("error: {e}");
                    ExitCode::FAILURE
                }
            }
        }
    }
}

fn print_json(value: &impl Serialize) -> bool {
    match serde_json::to_string_pretty(value) {
        Ok(s) => {
            println!("{s}");
            true
        }
        Err(e) => {
            eprintln!("error: could not serialize the report: {e}");
            false
        }
    }
}

fn rating_label(r: Option<Rating>) -> &'static str {
    match r {
        Some(Rating::Good) => "good",
        Some(Rating::NeedsImprovement) => "needs improvement",
        Some(Rating::Poor) => "poor",
        None => "",
    }
}

fn print_speed(r: &SpeedReport, top: usize) {
    let strategy = match r.strategy {
        Strategy::Mobile => "mobile",
        Strategy::Desktop => "desktop",
    };
    section(&format!("PageSpeed Insights ({strategy})"));
    if let Some(url) = &r.final_url {
        println!("URL         {url}");
    }
    if let Some(v) = &r.lighthouse_version {
        println!("Lighthouse  {v}");
    }
    for w in &r.warnings {
        println!("! {w}");
    }

    section("Scores");
    for c in &r.categories {
        let score = c.score.map_or("-".into(), |s| s.to_string());
        println!("{:<16} {score:>3}", c.title);
    }

    section("Real users (Chrome UX Report, p75)");
    match &r.field {
        None => println!("Not enough real-user data for this page or its origin."),
        Some(f) => {
            if f.origin_fallback {
                println!("(whole-origin data: this page has too little traffic)");
            }
            for m in &f.metrics {
                let value = match m.unit {
                    Unit::Ms => format!("{} ms", m.p75),
                    Unit::Unitless => format!("{:.2}", m.p75),
                };
                println!("{:<28} {value:>9}  {}", m.label, rating_label(m.rating));
            }
        }
    }

    section("Lab metrics");
    for m in &r.lab_metrics {
        println!(
            "{:<28} {:>9}",
            m.title,
            m.display_value.as_deref().unwrap_or("-")
        );
    }

    for c in r.categories.iter().filter(|c| !c.failing.is_empty()) {
        section(&format!("{}: {} to improve", c.title, c.failing.len()));
        for a in c.failing.iter().take(top) {
            let savings = a
                .display_value
                .as_deref()
                .map(|d| format!("  ({d})"))
                .unwrap_or_default();
            println!("• {}{savings}", a.title);
        }
        if c.failing.len() > top {
            println!("  … and {} more", c.failing.len() - top);
        }
    }
}

fn print_result(result: &ReviewResult, verbose: bool, top: usize) {
    match result {
        ReviewResult::InvalidUrl { input } => {
            eprintln!("error: {input:?} is not a valid http(s) URL")
        }
        ReviewResult::FetchFailed { url, reason } => {
            eprintln!("error: could not fetch {url}: {reason}")
        }
        ReviewResult::HttpError { http } => {
            print_http(http, verbose);
            eprintln!(
                "\nerror: the server answered {}; only 200 responses are analyzed",
                http.status
            );
        }
        ReviewResult::NotHtml { http } => {
            print_http(http, verbose);
            let media = http.media_type.as_deref().unwrap_or("no content type");
            eprintln!("\nerror: the page is not HTML ({media})");
        }
        ReviewResult::Success(review) => print_review(review, verbose, top),
    }
}

fn section(title: &str) {
    println!("\n{title}\n{}", "─".repeat(title.chars().count()));
}

fn print_http(http: &Fetched, verbose: bool) {
    section("HTTP");
    println!("URL            {}", http.final_url);
    for r in &http.redirects {
        println!("  redirected   {} ({}) → {}", r.url, r.status, r.location);
    }
    let media = http.media_type.as_deref().unwrap_or("-");
    println!("Status         {}", http.status);
    println!("Response time  {} ms", http.elapsed_ms);
    println!("Size           {} KB  ({media})", http.size_kb);
    if verbose {
        section(&format!("Headers ({})", http.headers.len()));
        for h in &http.headers {
            for v in &h.values {
                println!("{}: {v}", h.name);
            }
        }
    }
}

fn with_length(value: Option<&str>) -> String {
    match value {
        Some(v) => format!("{v}  ({} chars)", v.chars().count()),
        None => "-".into(),
    }
}

fn print_review(review: &Review, verbose: bool, top: usize) {
    let c = &review.content;
    print_http(&review.http, verbose);

    section("Page");
    println!("Title            {}", with_length(c.title.as_deref()));
    println!(
        "Description      {}",
        with_length(c.meta_description.as_deref())
    );
    if let Some(k) = &c.meta_keywords {
        println!("Meta keywords    {k}");
    }
    println!("Text/HTML ratio  {} %", c.text_html_ratio);

    section(&format!("Headings ({})", c.headings.len()));
    for h in &c.headings {
        let indent = "  ".repeat(usize::from(h.level.saturating_sub(1)));
        println!(
            "{indent}H{}  {}",
            h.level,
            if h.text.is_empty() {
                "(empty)"
            } else {
                &h.text
            }
        );
    }

    print_violations("Errors", &c.errors);
    print_violations("Warnings", &c.warnings);

    section("Keywords");
    for n in 1..=3u8 {
        let list: Vec<_> = c
            .keywords
            .iter()
            .filter(|k| k.words == n)
            .take(top)
            .collect();
        if list.is_empty() {
            continue;
        }
        println!("{n}-word:");
        for k in list {
            println!(
                "  {:<40} {:>4}×  {:>6.2} %",
                k.combination, k.occurrence, k.density
            );
        }
    }

    let count = |kind, rel: Option<LinkRel>| {
        c.links
            .iter()
            .filter(|l| l.kind == kind && rel.is_none_or(|r| l.rel == r))
            .count()
    };
    section(&format!("Links ({})", c.links.len()));
    println!(
        "Internal {} ({} nofollow) · External {} ({} nofollow)",
        count(LinkKind::Internal, None),
        count(LinkKind::Internal, Some(LinkRel::NoFollow)),
        count(LinkKind::External, None),
        count(LinkKind::External, Some(LinkRel::NoFollow)),
    );
    if verbose {
        for l in &c.links {
            let kind = if l.kind == LinkKind::Internal {
                "int"
            } else {
                "ext"
            };
            let rel = if l.rel == LinkRel::NoFollow {
                " nofollow"
            } else {
                ""
            };
            println!("  [{kind}{rel}] {}  \"{}\"", l.url, l.anchor);
        }
    }
}

fn print_violations(title: &str, list: &[Violation]) {
    section(&format!("{title} ({})", list.len()));
    for v in list {
        let at = v
            .position
            .map(|p| format!("  (line {}, col {})", p.line, p.column))
            .unwrap_or_default();
        println!("• {}{at}", v.heading);
        println!("    {}", v.description);
        println!("    → {}", v.recommendation);
    }
}

use clap::{Parser, Subcommand};

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
    },
}

fn main() -> anyhow::Result<()> {
    match Cli::parse().command {
        Command::Report { url, json: _ } => {
            anyhow::bail!("report is not implemented yet (Phase 1): {url}")
        }
    }
}

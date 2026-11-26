"use strict";

// Everything shown here comes from arbitrary web pages, so text is only ever
// inserted with textContent (via `h`), never as HTML.

const { invoke } = window.__TAURI__.core;
const { openUrl } = window.__TAURI__.opener;

const $ = (id) => document.getElementById(id);

/** Creates an element. `attrs` keys starting with "on" become listeners. */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
    else if (key === "class") el.className = value;
    else if (key === "style") Object.assign(el.style, value);
    else el.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : String(child));
  }
  return el;
}

const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

/** A link that opens in the system browser instead of navigating the app. */
function extLink(url, text = url, cls = "ext") {
  return h("a", {
    class: cls,
    href: url,
    title: url,
    onclick: (e) => {
      e.preventDefault();
      openUrl(url).catch((err) => console.error("openUrl failed", err));
    },
  }, text);
}

// ───────────────────────────── State & view switching ─────────────────────────────

const state = {
  review: null,
  kw: { words: 1, filter: "", sort: "occurrence", dir: "desc" },
  links: { kind: "all", filter: "" },
  settings: { userAgent: { preset: "openSeo" }, pagespeedApiKey: null, renderJavascript: true },
  /** Which HTML the content tabs analyze: "raw" (as served) or "rendered". */
  source: "raw",
  /** The rendered-page run for the current review. `token` identifies the run. */
  render: { status: "idle" },
  /** robots.txt and sitemap checks for the current review, like `render`. */
  crawl: { status: "idle" },
  issues: { level: "all" },
  /** User-Agent label of the review on screen (settings may change afterwards). */
  reviewUserAgent: "",
  /** PageSpeed runs for the current review's URL, keyed by strategy. */
  speed: { strategy: "mobile", url: null, runs: {} },
};

let requestId = 0;

function show(id) {
  for (const s of ["empty", "loading", "failure", "report"]) $(s).hidden = s !== id;
}

$("review-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = $("url").value.trim();
  if (!url) return;

  const id = ++requestId; // a newer request makes this one's result stale
  state.render = { status: "idle" };
  state.crawl = { status: "idle" };
  const userAgent = userAgentLabel(state.settings.userAgent);
  $("loading-url").textContent = url;
  $("submit").disabled = true;
  show("loading");

  let result;
  try {
    result = await invoke("review", { url });
  } catch (err) {
    result = { result: "fetchFailed", url, reason: String(err) };
  }
  if (id !== requestId) return;
  $("submit").disabled = false;
  state.reviewUserAgent = userAgent;
  render(result);
});

// Ctrl/Cmd+L focuses the URL field, like a browser.
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
    e.preventDefault();
    $("url").select();
  }
});

function render(result) {
  switch (result.result) {
    case "success":
      state.review = result;
      state.source = "raw";
      state.render = { status: state.settings.renderJavascript ? "idle" : "off" };
      state.crawl = { status: "idle" };
      renderReport(result);
      show("report");
      startCrawl();
      if (state.settings.renderJavascript) startRender();
      return;
    case "invalidUrl":
      return failure("Not a valid URL", `"${result.input}" can't be read as an http or https address.`);
    case "fetchFailed":
      return failure("Could not fetch the page", result.reason, null, result.url);
    case "httpError":
      return failure(
        `The server answered ${result.http.status}`,
        "Only pages that return 200 OK are analyzed.",
        result.http,
      );
    case "notHtml":
      return failure(
        "Not an HTML page",
        `The response is ${result.http.mediaType ?? "of an unknown type"}, so there is no markup to analyze.`,
        result.http,
      );
    default:
      return failure("Unexpected response", JSON.stringify(result));
  }
}

function failure(title, message, http = null, url = null) {
  $("failure-title").textContent = title;
  $("failure-message").textContent = message;
  const box = $("failure-http");
  box.replaceChildren();
  if (url) box.append(h("p", {}, extLink(url, url)));
  if (http) box.append(httpSummary(http));
  show("failure");
}

// ───────────────────────────── Summary ─────────────────────────────

function fact(label, value, cls) {
  return h("div", { class: `fact ${cls ?? ""}` }, h("dt", {}, label), h("dd", {}, value));
}

function redirectChain(http) {
  if (!http.redirects.length) return null;
  return h("div", { class: "redirects" },
    "Redirected: ",
    http.redirects.map((r, i) => [
      i ? " → " : "",
      h("span", { class: "hop" }, r.url),
      ` (${r.status})`,
    ]),
    " → ",
    h("span", { class: "hop" }, http.finalUrl),
  );
}

function httpSummary(http) {
  return h("div", { class: "summary" },
    h("div", { class: "summary-url" }, extLink(http.finalUrl), redirectChain(http)),
    h("dl", { class: "facts" },
      fact("Status", http.status, http.status === 200 ? "ok" : "error"),
      fact("Response", `${fmt.format(http.elapsedMs)} ms`),
      fact("Type", http.mediaType ?? "—"),
    ),
  );
}

/** The analysis the content tabs show: of the source HTML or the rendered page. */
function currentContent() {
  return state.source === "rendered" && state.render.status === "done"
    ? state.render.result.content
    : state.review.content;
}

function renderReport(r) {
  const { http } = r;

  const finalUrl = $("final-url");
  finalUrl.replaceWith(Object.assign(extLink(http.finalUrl), { id: "final-url" }));
  $("redirects").replaceChildren(...(redirectChain(http)?.childNodes ?? []));
  $("headers-count").textContent = http.headers.length;
  renderHeaders(http);

  renderContent();
  renderSourceSwitch();
  renderJs();

  // PageSpeed results belong to the previous page; start over for this one.
  state.speed.url = http.finalUrl;
  state.speed.runs = {};
  renderSpeed();
}

/**
 * Every finding on screen: the HTTP response's and the crawl's (which don't
 * depend on the HTML analyzed), then the analyzed HTML's. Each is tagged with
 * whether its position refers to the rendered DOM.
 */
function allIssues() {
  const c = currentContent();
  const rendered = c !== state.review.content;
  const page = [...c.errors, ...c.warnings, ...c.notices].map((v) => ({ ...v, rendered }));
  const crawl = state.crawl.status === "done" ? state.crawl.result.issues : [];
  const order = { Error: 0, Warning: 1, Notice: 2 };
  return [...state.review.httpIssues, ...crawl, ...page].sort((a, b) => order[a.level] - order[b.level]);
}

/** Facts and tabs that depend on which HTML is analyzed (or on the crawl). */
function renderContent() {
  const { http } = state.review;
  const c = currentContent();
  const rendered = c !== state.review.content;
  const issues = allIssues();
  const errors = issues.filter((v) => v.level === "Error").length;
  const warnings = issues.filter((v) => v.level === "Warning").length;

  $("facts").replaceChildren(
    fact("Status", http.status, "ok"),
    fact("Response", `${fmt.format(http.elapsedMs)} ms`),
    rendered
      ? fact("Rendered size", `${fmt.format(state.render.result.sizeKb)} KB`)
      : fact("Size", `${fmt.format(http.sizeKb)} KB`),
    fact("Errors", errors, errors ? "error" : "ok"),
    fact("Warnings", warnings, warnings ? "warn" : "ok"),
    fact("Links", c.links.length),
    fact("Text/HTML", `${fmt.format(c.textHtmlRatio)} %`),
    fact("User-Agent", state.reviewUserAgent),
  );

  const issuesCount = $("issues-count");
  issuesCount.textContent = errors + warnings;
  issuesCount.className = `count ${errors ? "error" : warnings ? "warn" : ""}`;
  $("links-count").textContent = c.links.length;

  renderOverview(c);
  renderIssues(issues);
  renderKeywords();
  renderLinks();
}

// ───────────────────────────── Tabs ─────────────────────────────

document.querySelectorAll(".tabs [role=tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tabs [role=tab]").forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected);
      $(`tab-${t.dataset.tab}`).hidden = !selected;
    });
  });
});

// ───────────────────────────── Overview ─────────────────────────────

/** Length meter with the recommended range shaded (thresholds match the core rules). */
function lengthMeter(length, min, max) {
  const scale = Math.max(max * 1.25, length);
  const pct = (n) => `${Math.min(100, (n / scale) * 100)}%`;
  const ok = length >= min && length <= max;
  return h("div", { class: "meter" },
    h("div", { class: "meter-track" },
      h("div", { class: "meter-range", style: { left: pct(min), width: `calc(${pct(max)} - ${pct(min)})` } }),
      h("div", { class: `meter-fill ${ok ? "" : "out"}`, style: { width: pct(length) } }),
    ),
    h("div", { class: "meter-label" },
      h("span", {}, `${length} characters`),
      h("span", { class: `status ${ok ? "ok" : "out"}` },
        ok ? `within ${min}–${max}` : length < min ? `shorter than ${min}` : `longer than ${max}`),
    ),
  );
}

function textCard(title, value, range) {
  return h("div", { class: "card" },
    h("h3", {}, title),
    value
      ? [h("div", { class: "value" }, value), range && lengthMeter([...value].length, ...range)]
      : h("div", { class: "value none" }, "Missing"),
  );
}

function renderOverview(c) {
  const levels = [1, 2, 3, 4, 5, 6]
    .map((l) => [l, c.headings.filter((x) => x.level === l).length])
    .filter(([, n]) => n);

  $("tab-overview").replaceChildren(
    h("div", { class: "grid" },
      textCard("Title", c.title, [30, 60]),
      textCard("Meta description", c.metaDescription, [70, 160]),
      indexingCard(c),
      pageSetupCard(c),
      socialCard(c),
      structuredDataCard(c),
      h("div", { class: "card" },
        h("h3", {}, "Text / HTML ratio"),
        h("div", { class: "big-number" }, `${fmt.format(c.textHtmlRatio)} %`),
        h("div", { class: "muted small" }, "Share of the HTML source that is visible text."),
      ),
      h("div", { class: "card" },
        h("h3", {}, "Meta keywords"),
        c.metaKeywords
          ? h("div", { class: "value" }, c.metaKeywords)
          : h("div", { class: "value none" }, "None (search engines ignore this tag)"),
      ),
      h("div", { class: "card wide" },
        h("h3", {}, `Headings (${c.headings.length})`,
          levels.length ? h("span", { class: "muted" }, " · ", levels.map(([l, n]) => `H${l}×${n}`).join("  ")) : null),
        c.headings.length
          ? h("ul", { class: "outline" },
              c.headings.map((x) =>
                h("li", { style: { paddingLeft: `${(x.level - 1) * 18}px` } },
                  h("span", { class: "hl" }, `H${x.level}`),
                  x.text ? h("span", {}, x.text) : h("span", { class: "empty" }, "(empty)"),
                )))
          : h("div", { class: "value none" }, "No headings"),
      ),
    ),
  );
}

/** A label/value row; `tone` (ok, warn, error) colors a status dot. */
function row(label, value, tone) {
  return [
    h("dt", {}, label),
    h("dd", {}, tone ? h("span", { class: `dot ${tone}`, "aria-hidden": "true" }) : null, value),
  ];
}

const none = (text = "None") => h("span", { class: "none" }, text);

function headerValues(name) {
  return state.review.http.headers
    .filter((hd) => hd.name.toLowerCase() === name)
    .flatMap((hd) => hd.values);
}

function robotsTxtRow() {
  const run = state.crawl;
  if (run.status === "loading") return row("robots.txt", none("Checking…"));
  if (run.status !== "done") return row("robots.txt", none("Not checked"));
  const r = run.result.robots;
  switch (r.status.status) {
    case "found":
      return r.allowed
        ? row("robots.txt", "Allows Googlebot", "ok")
        : row("robots.txt", [`Blocks Googlebot: `, h("code", {}, r.rule ?? "?"), r.ruleLine ? ` (line ${r.ruleLine})` : ""], "error");
    case "missing":
      return row("robots.txt", `None (HTTP ${r.status.httpStatus}): everything allowed`, "ok");
    case "serverError":
      return row("robots.txt", `HTTP ${r.status.httpStatus}: Google treats the site as blocked`, "error");
    default:
      return row("robots.txt", `Unreachable: ${r.status.reason}`, "warn");
  }
}

function sitemapRow() {
  const run = state.crawl;
  if (run.status === "loading") return row("Sitemap", none("Searching…"));
  if (run.status !== "done") return row("Sitemap", none("Not checked"));
  const s = run.result.sitemaps;
  if (s.listedIn) return row("Sitemap", ["Listed in ", extLink(s.listedIn)], "ok");
  if (!s.files.some((f) => f.kind)) return row("Sitemap", "No readable sitemap found", "warn");
  return row("Sitemap",
    `Not listed (${fmt.format(s.urlsChecked)} URLs in ${s.files.length} files${s.truncated ? ", stopped early" : ""})`, "warn");
}

function indexingCard(c) {
  const finalUrl = state.review.http.finalUrl.split("#")[0];
  const noindex = (v) => /\b(noindex|none)\b/i.test(v ?? "");
  const xRobots = headerValues("x-robots-tag");
  let canonical;
  if (!c.canonical) canonical = row("Canonical", none("Missing"), "warn");
  else if (c.canonical.split("#")[0] === finalUrl) canonical = row("Canonical", "This page", "ok");
  else canonical = row("Canonical", ["Another URL: ", extLink(c.canonical)], "warn");
  return h("div", { class: "card" },
    h("h3", {}, "Indexing"),
    h("dl", { class: "kv" },
      row("Meta robots", c.robots ?? none(), noindex(c.robots) ? "error" : "ok"),
      xRobots.length ? row("X-Robots-Tag", xRobots.join(" | "), xRobots.some(noindex) ? "error" : "ok") : null,
      canonical,
      robotsTxtRow(),
      sitemapRow(),
    ));
}

function pageSetupCard(c) {
  const responsive = /width\s*=\s*device-width/i.test(c.viewport ?? "");
  return h("div", { class: "card" },
    h("h3", {}, "Page setup"),
    h("dl", { class: "kv" },
      row("Language", c.lang ?? none("Missing"), c.lang ? "ok" : "warn"),
      row("Viewport", c.viewport ?? none("Missing"), responsive ? "ok" : "warn"),
      row("Favicon", c.favicon ? extLink(c.favicon) : none("Not declared"), c.favicon ? "ok" : null),
      row("HTTPS", state.review.http.finalUrl.startsWith("https:") ? "Yes" : "No", state.review.http.finalUrl.startsWith("https:") ? "ok" : "error"),
      c.hreflang.length
        ? row("hreflang", c.hreflang.map((x) => x.lang).join(", "))
        : row("hreflang", none()),
    ));
}

function socialCard(c) {
  const tag = (name) => c.social.find((t) => t.name === name)?.content;
  const og = c.social.some((t) => t.name.startsWith("og:"));
  const image = tag("og:image") ?? tag("twitter:image");
  return h("div", { class: "card" },
    h("h3", {}, "Social sharing"),
    og || tag("twitter:card")
      ? h("dl", { class: "kv" },
          row("og:title", tag("og:title") ?? none("Missing")),
          row("og:description", tag("og:description") ?? none("Missing")),
          row("Image", image ? extLink(image, image) : none("Missing")),
          row("twitter:card", tag("twitter:card") ?? none("Missing")))
      : h("div", { class: "value none" }, "No Open Graph or Twitter card tags: shares show a guessed preview."));
}

function structuredDataCard(c) {
  return h("div", { class: "card" },
    h("h3", {}, `Structured data (${c.structuredData.length})`),
    c.structuredData.length
      ? h("ul", { class: "plain" },
          c.structuredData.map((d) =>
            h("li", {},
              d.error
                ? [h("span", { class: "dot error", "aria-hidden": "true" }), "Invalid JSON: ", h("span", { class: "muted" }, d.error)]
                : [h("span", { class: `dot ${d.hasContext ? "ok" : "warn"}`, "aria-hidden": "true" }),
                   d.types.length ? d.types.join(", ") : none("No @type"),
                   d.hasContext ? null : h("span", { class: "muted" }, " (no @context)")])))
      : h("div", { class: "value none" }, "No JSON-LD on this page."));
}

// ───────────────────────────── Issues ─────────────────────────────

const LEVEL_CLASS = { Error: "error", Warning: "warn", Notice: "notice" };

function issueCard(v) {
  const { rendered } = v;
  return h("article", { class: `issue ${LEVEL_CLASS[v.level]}` },
    h("div", { class: "issue-head" },
      h("span", { class: `badge ${LEVEL_CLASS[v.level]}` }, v.level),
      h("span", { class: "badge" }, v.category),
      h("strong", {}, v.heading),
      v.position
        ? h("span", { class: "where", title: rendered ? "Position in the serialized rendered DOM" : null },
            `${rendered ? "rendered " : ""}line ${v.position.line}, col ${v.position.column}`)
        : null,
    ),
    h("p", {}, v.description),
    h("p", { class: "fix" }, v.recommendation),
  );
}

function renderIssues(issues) {
  const count = (level) => issues.filter((v) => v.level === level).length;
  const { level } = state.issues;
  const shown = level === "all" ? issues : issues.filter((v) => v.level === level);
  const filter = h("div", { class: "segmented", role: "group", "aria-label": "Level" },
    [["all", `All ${issues.length}`], ["Error", `Errors ${count("Error")}`],
     ["Warning", `Warnings ${count("Warning")}`], ["Notice", `Notices ${count("Notice")}`]]
      .map(([value, label]) => h("button", {
        "aria-pressed": String(value === level),
        onclick: () => { state.issues.level = value; renderIssues(allIssues()); },
      }, label)));
  const pending = state.crawl.status === "loading"
    ? h("span", { class: "muted small" }, "robots.txt and sitemap checks are running…")
    : null;
  $("tab-issues").replaceChildren(
    h("div", { class: "toolbar" }, filter, pending),
    shown.length
      ? h("div", { class: "issues" }, shown.map(issueCard))
      : h("div", { class: "card all-clear" },
          h("span", { class: "badge ok" }, "All clear"),
          h("p", {}, level === "all" ? "No issues found by the current rules." : "Nothing at this level.")),
  );
}

// ───────────────────────────── Keywords ─────────────────────────────

function setPressed(group, button) {
  group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === button));
}

$("kw-words").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  setPressed($("kw-words"), b);
  state.kw.words = Number(b.dataset.words);
  renderKeywords();
});

$("kw-filter").addEventListener("input", (e) => {
  state.kw.filter = e.target.value.trim().toLowerCase();
  renderKeywords();
});

document.querySelectorAll("#kw-table th[data-sort]").forEach((th) => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    state.kw.dir = state.kw.sort === key && state.kw.dir === "desc" ? "asc" : "desc";
    if (state.kw.sort !== key) state.kw.dir = key === "combination" ? "asc" : "desc";
    state.kw.sort = key;
    renderKeywords();
  });
});

const KEYWORD_ROWS = 200;

function renderKeywords() {
  if (!state.review) return;
  const { words, filter, sort, dir } = state.kw;
  const sign = dir === "asc" ? 1 : -1;
  const list = currentContent().keywords
    .filter((k) => k.words === words && (!filter || k.combination.includes(filter)))
    .sort((a, b) => {
      const x = a[sort], y = b[sort];
      return (typeof x === "string" ? x.localeCompare(y) : x - y) * sign;
    });

  document.querySelectorAll("#kw-table th[data-sort]").forEach((th) => {
    th.setAttribute("aria-sort", th.dataset.sort === sort ? (dir === "asc" ? "ascending" : "descending") : "none");
  });

  const maxDensity = Math.max(...list.map((k) => k.density), 1);
  const rows = list.slice(0, KEYWORD_ROWS).map((k) =>
    h("tr", {},
      h("td", {}, k.combination),
      h("td", { class: "num" }, k.occurrence),
      h("td", { class: "num" },
        h("span", { class: "density" },
          h("span", { class: "density-bar" }, h("span", { style: { width: `${(k.density / maxDensity) * 100}%` } })),
          `${fmt.format(k.density)} %`)),
    ));
  if (list.length > KEYWORD_ROWS) {
    rows.push(h("tr", { class: "empty-row" }, h("td", { colspan: 3 }, `${list.length - KEYWORD_ROWS} more; use the filter to narrow down.`)));
  }
  if (!rows.length) rows.push(h("tr", { class: "empty-row" }, h("td", { colspan: 3 }, "No keywords")));
  $("kw-table").tBodies[0].replaceChildren(...rows);
}

// ───────────────────────────── Links ─────────────────────────────

$("link-kind").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  setPressed($("link-kind"), b);
  state.links.kind = b.dataset.kind;
  renderLinks();
});

$("link-filter").addEventListener("input", (e) => {
  state.links.filter = e.target.value.trim().toLowerCase();
  renderLinks();
});

function renderLinks() {
  if (!state.review) return;
  const { kind, filter } = state.links;
  const list = currentContent().links.filter((l) =>
    (kind === "all" || l.kind === kind || l.rel === kind) &&
    (!filter || l.url.toLowerCase().includes(filter) || l.anchor.toLowerCase().includes(filter)));

  const rows = list.map((l) =>
    h("tr", {},
      h("td", {}, l.anchor || h("span", { class: "muted" }, "(no text)")),
      h("td", { class: "url" }, extLink(l.url)),
      h("td", {}, l.kind),
      h("td", {}, l.rel === "NoFollow" ? h("span", { class: "badge warn" }, "nofollow") : "follow"),
    ));
  if (!rows.length) rows.push(h("tr", { class: "empty-row" }, h("td", { colspan: 4 }, "No links")));
  $("link-table").tBodies[0].replaceChildren(...rows);
}

// ───────────────────────────── Headers ─────────────────────────────

function renderHeaders(http) {
  const rows = http.headers.flatMap((hd) =>
    hd.values.map((v) => h("tr", {}, h("td", { class: "header-name" }, hd.name), h("td", { class: "header-value" }, v))));
  if (!rows.length) rows.push(h("tr", { class: "empty-row" }, h("td", { colspan: 2 }, "No headers")));
  $("header-table").tBodies[0].replaceChildren(...rows);
}

// ───────────────────────────── Settings ─────────────────────────────

const USER_AGENT_LABELS = {
  openSeo: "OpenSEO",
  chromeMobile: "Chrome mobile",
  chromeDesktop: "Chrome desktop",
  googlebot: "Googlebot",
  custom: "Custom",
};

function userAgentLabel(ua) {
  return USER_AGENT_LABELS[ua?.preset] ?? "OpenSEO";
}

function syncCustomField() {
  $("ua-custom").hidden = $("ua-preset").value !== "custom";
}

function openSettings() {
  const { userAgent, pagespeedApiKey, renderJavascript } = state.settings;
  $("render-js").checked = renderJavascript !== false;
  $("ua-preset").value = userAgent.preset in USER_AGENT_LABELS ? userAgent.preset : "openSeo";
  $("ua-custom").value = userAgent.preset === "custom" ? userAgent.value ?? "" : "";
  $("psi-key").value = pagespeedApiKey ?? "";
  $("psi-key").type = "password";
  $("psi-key-toggle").textContent = "Show";
  $("settings-error").hidden = true;
  syncCustomField();
  $("settings").showModal();
}

$("open-settings").addEventListener("click", openSettings);
$("ua-preset").addEventListener("change", () => {
  syncCustomField();
  if (!$("ua-custom").hidden) $("ua-custom").focus();
});
$("settings-cancel").addEventListener("click", () => $("settings").close());
$("psi-key-toggle").addEventListener("click", () => {
  const hidden = $("psi-key").type === "password";
  $("psi-key").type = hidden ? "text" : "password";
  $("psi-key-toggle").textContent = hidden ? "Hide" : "Show";
});
$("psi-key-link").addEventListener("click", (e) => {
  e.preventDefault();
  openUrl(e.currentTarget.href).catch((err) => console.error("openUrl failed", err));
});

$("settings-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const preset = $("ua-preset").value;
  const custom = $("ua-custom").value.trim();
  const error = $("settings-error");
  if (preset === "custom" && !custom) {
    error.textContent = "Enter a User-Agent string, or pick a preset.";
    error.hidden = false;
    return;
  }
  const settings = {
    userAgent: preset === "custom" ? { preset, value: custom } : { preset },
    pagespeedApiKey: $("psi-key").value.trim() || null,
    renderJavascript: $("render-js").checked,
  };
  try {
    await invoke("save_settings", { settings });
  } catch (err) {
    error.textContent = err?.message ?? String(err);
    error.hidden = false;
    return;
  }
  state.settings = settings;
  $("settings").close();
  renderSpeed(); // the no-key hint may have changed
  if (state.review && !$("report").hidden) {
    if (settings.renderJavascript && state.render.status === "off") startRender();
    else if (!settings.renderJavascript && state.render.status === "idle") state.render = { status: "off" };
    renderJs();
  }
});

// ───────────────────────────── Speed (PageSpeed Insights) ─────────────────────────────

$("speed-strategy").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  setPressed($("speed-strategy"), b);
  state.speed.strategy = b.dataset.strategy;
  renderSpeed();
});

async function runSpeed() {
  const { url, strategy } = state.speed;
  if (!url) return;
  state.speed.runs[strategy] = { status: "loading" };
  renderSpeed();
  let run;
  try {
    run = { status: "done", report: await invoke("pagespeed", { url, strategy }) };
  } catch (err) {
    run = { status: "error", error: typeof err === "object" ? err : { kind: "unknown", message: String(err) } };
  }
  // Ignore results for a page that is no longer on screen.
  if (state.speed.url !== url) return;
  state.speed.runs[strategy] = run;
  renderSpeed();
}

/** Lighthouse colour bands: 0–49 poor, 50–89 average, 90–100 good. */
function band(score100) {
  if (score100 == null) return "";
  return score100 >= 90 ? "good" : score100 >= 50 ? "average" : "poor";
}

const RATING = {
  good: ["good", "Good"],
  needsImprovement: ["average", "Needs improvement"],
  poor: ["poor", "Poor"],
};

/** Text with `code` spans, rendered safely. */
function withCode(text) {
  return text.split("`").map((part, i) => (i % 2 ? h("code", {}, part) : part));
}

function gauge(category) {
  const el = h("div", { class: `gauge ${band(category.score)}` }, h("span", {}, category.score ?? "–"));
  el.style.setProperty("--pct", category.score ?? 0);
  return h("div", { class: "gauge-item" }, el, h("div", {}, category.title));
}

function formatMs(ms) {
  return ms >= 1000 ? `${fmt.format(Math.round(ms / 100) / 10)} s` : `${fmt.format(Math.round(ms))} ms`;
}

function fieldSection(field) {
  const title = h("h3", {}, "Real users ", h("span", { class: "muted" }, "· Chrome UX Report, 75th percentile, last 28 days"));
  if (!field) {
    return h("section", { class: "speed-section" }, title,
      h("div", { class: "card muted" }, "Not enough real-user data for this page or its site."));
  }
  const [cls, label] = RATING[field.overall] ?? ["", ""];
  return h("section", { class: "speed-section" }, title,
    h("p", { class: "muted small" },
      field.overall ? ["Overall: ", h("span", { class: `pill ${cls}` }, label), " "] : null,
      field.originFallback ? "This page has too little traffic; showing data for the whole site." : null),
    h("div", { class: "metric-grid" },
      field.metrics.map((m) => {
        const [mcls, mlabel] = RATING[m.rating] ?? ["", ""];
        return h("div", { class: `metric ${mcls}` },
          h("div", { class: "label" }, m.label),
          h("div", { class: "val" }, m.unit === "ms" ? formatMs(m.p75) : fmt.format(m.p75)),
          mlabel ? h("span", { class: `pill ${mcls}` }, mlabel) : null);
      })),
  );
}

function labSection(metrics) {
  return h("section", { class: "speed-section" },
    h("h3", {}, "Lab test ", h("span", { class: "muted" }, "· one simulated load by Lighthouse")),
    h("div", { class: "metric-grid" },
      metrics.map((m) => {
        const cls = band(m.score == null ? null : Math.round(m.score * 100));
        return h("div", { class: `metric ${cls}` },
          h("div", { class: "label" }, m.title),
          h("div", { class: "val" }, m.displayValue ?? "–"));
      })),
  );
}

function auditItem(a) {
  const savings = a.displayValue ?? (a.savingsMs ? `Est. savings ${formatMs(a.savingsMs)}` : null);
  return h("li", {},
    h("div", { class: "row" },
      h("span", { class: "title" }, withCode(a.title)),
      savings ? h("span", { class: "savings" }, savings) : null),
    a.description ? h("p", {}, withCode(a.description), " ", a.learnMore ? extLink(a.learnMore, "Docs ↗") : null) : null,
  );
}

function auditsSection(categories) {
  const withFailures = categories.filter((c) => c.failing.length);
  if (!withFailures.length) return null;
  return h("section", { class: "speed-section" },
    h("h3", {}, "To improve"),
    withFailures.map((c, i) =>
      h("details", { class: "audits", open: i === 0 },
        h("summary", {}, `${c.title} · ${c.failing.length}`),
        h("ul", {}, c.failing.map(auditItem)))),
  );
}

function speedReport(r) {
  return [
    h("div", { class: "card" }, h("div", { class: "gauges" }, r.categories.map(gauge))),
    fieldSection(r.field),
    labSection(r.labMetrics),
    auditsSection(r.categories),
    h("p", { class: "muted small" },
      [r.lighthouseVersion && `Lighthouse ${r.lighthouseVersion}`, ...r.warnings].filter(Boolean).join(" · ")),
  ];
}

function speedStart(retry = false) {
  const noKey = !state.settings.pagespeedApiKey;
  return h("div", { class: "card speed-start" },
    h("p", {}, "Lighthouse scores, Core Web Vitals and improvement tips from Google PageSpeed Insights."),
    h("p", { class: "muted small" }, "Sends the page URL to Google. A test takes 10–60 seconds."),
    noKey ? h("p", { class: "muted small" },
      "No API key set: the shared quota is usually used up. ",
      h("a", { class: "ext", href: "#", onclick: (e) => { e.preventDefault(); openSettings(); } }, "Add a free key in Settings"),
      ".") : null,
    h("button", { class: "primary", type: "button", onclick: runSpeed }, retry ? "Try again" : "Run PageSpeed test"),
  );
}

function speedError(err) {
  const keyProblem = err.kind === "quota" || err.kind === "badKey";
  return [
    h("div", { class: "card speed-error" },
      h("h3", {}, err.kind === "quota" ? "Quota exceeded" : err.kind === "badKey" ? "API key rejected" : "PageSpeed test failed"),
      h("p", {}, err.message),
      keyProblem ? h("button", { class: "secondary", type: "button", onclick: openSettings }, "Open settings") : null),
    speedStart(true),
  ];
}

function renderSpeed() {
  const run = state.speed.runs[state.speed.strategy];
  let body;
  if (!run) body = speedStart();
  else if (run.status === "loading") {
    body = h("div", { class: "state" },
      h("div", { class: "spinner", "aria-hidden": "true" }),
      h("p", {}, `Running Lighthouse (${state.speed.strategy})… usually 10–60 seconds.`));
  } else if (run.status === "error") body = speedError(run.error);
  else body = speedReport(run.report);
  $("speed-body").replaceChildren(...[body].flat(Infinity).filter(Boolean));
}

// ───────────────────────────── Rendered page (JavaScript) ─────────────────────────────

$("source").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b || b.disabled || b.dataset.source === state.source) return;
  state.source = b.dataset.source;
  renderSourceSwitch();
  renderContent();
});

function renderSourceSwitch() {
  const rendered = $("source").querySelector('[data-source="rendered"]');
  const { status } = state.render;
  setPressed($("source"), $("source").querySelector(`[data-source="${state.source}"]`));
  rendered.disabled = status !== "done";
  rendered.classList.toggle("busy", status === "loading");
  rendered.title = {
    loading: "Rendering the page…",
    error: "Rendering failed; see the JavaScript tab",
    off: "Rendering is off; see the JavaScript tab",
  }[status] ?? "The page after its JavaScript ran";
}

async function startRender() {
  const url = state.review.http.finalUrl;
  const token = {};
  state.render = { status: "loading", token, url };
  renderSourceSwitch();
  renderJs();
  let next;
  try {
    next = { status: "done", result: await invoke("render", { url }) };
  } catch (err) {
    next = { status: "error", error: typeof err === "object" ? err : { kind: "unknown", message: String(err) } };
  }
  if (state.render.token !== token) return; // a newer review or render replaced this one
  Object.assign(state.render, next);
  renderSourceSwitch();
  renderJs();
}

async function startCrawl() {
  const url = state.review.http.finalUrl;
  const token = {};
  state.crawl = { status: "loading", token };
  let next;
  try {
    next = { status: "done", result: await invoke("crawl", { url }) };
  } catch (err) {
    next = { status: "error", error: typeof err === "object" ? err : { message: String(err) } };
  }
  if (state.crawl.token !== token || state.review?.http.finalUrl !== url) return;
  Object.assign(state.crawl, next);
  renderContent();
}

function openPreview(url) {
  invoke("open_preview", { url }).catch((err) => console.error("preview failed", err));
}

const FIELD_LABELS = {
  url: "URL",
  title: "Title",
  metaDescription: "Meta description",
  canonical: "Canonical",
  robots: "Meta robots",
  h1: "H1",
};

const LINK_ROWS = 200;

function changeCount(diff) {
  return diff.fields.filter((f) => f.changed).length + diff.linksAdded.length + diff.linksRemoved.length;
}

function table(head, rows, cls = "data") {
  return h("table", { class: cls },
    h("thead", {}, h("tr", {}, head.map((t) => h("th", { class: t.cls }, t.text ?? t)))),
    h("tbody", {}, rows));
}

function fieldValues(list) {
  return list.length ? list.map((v) => h("div", {}, v)) : h("span", { class: "none" }, "(none)");
}

function linksSection(title, links, hint) {
  const rows = links.slice(0, LINK_ROWS).map((l) =>
    h("tr", {},
      h("td", {}, l.anchor || h("span", { class: "muted" }, "(no text)")),
      h("td", { class: "url" }, extLink(l.url)),
      h("td", {}, l.kind),
      h("td", {}, l.rel === "NoFollow" ? h("span", { class: "badge warn" }, "nofollow") : "follow")));
  if (links.length > LINK_ROWS) {
    rows.push(h("tr", { class: "empty-row" }, h("td", { colspan: 4 }, `${links.length - LINK_ROWS} more`)));
  }
  return h("section", { class: "js-section" },
    h("h3", {}, `${title} (${links.length})`),
    links.length
      ? [h("p", { class: "muted small" }, hint), table(["Anchor text", "URL", "Type", "Rel"], rows)]
      : h("p", { class: "muted small" }, "None."));
}

function renderedReport(r) {
  const raw = state.review.content;
  const ren = r.content;
  const changed = r.diff.fields.filter((f) => f.changed);
  const count = (c, kind) => c.links.filter((l) => l.kind === kind).length;
  const totals = [
    ["Links", raw.links.length, ren.links.length],
    ["Internal links", count(raw, "Internal"), count(ren, "Internal")],
    ["External links", count(raw, "External"), count(ren, "External")],
    ["Headings", raw.headings.length, ren.headings.length],
    ["Errors", raw.errors.length, ren.errors.length],
    ["Warnings", raw.warnings.length, ren.warnings.length],
    ["Text/HTML ratio", `${fmt.format(raw.textHtmlRatio)} %`, `${fmt.format(ren.textHtmlRatio)} %`],
  ];
  return [
    h("div", { class: "js-head" },
      h("div", { class: "grow muted" },
        `Rendered in ${formatMs(r.elapsedMs)} · ${fmt.format(r.sizeKb)} KB of HTML after scripts ran, `,
        `${fmt.format(state.review.http.sizeKb)} KB as sent · User-Agent: ${state.reviewUserAgent}`),
      h("button", { class: "secondary", type: "button", onclick: () => openPreview(r.url) }, "Open preview"),
      h("button", { class: "secondary", type: "button", onclick: startRender }, "Render again")),
    r.settled ? null : h("div", { class: "callout" },
      "The page was still loading or changing after 20 seconds. Content that arrives later is missing from this capture."),
    h("section", { class: "js-section" },
      h("h3", {}, "Key elements"),
      h("p", { class: "muted small" }, changed.length
        ? `JavaScript changes the ${changed.map((f) => FIELD_LABELS[f.field]).join(", ")}. Crawlers that don't run JavaScript see the source version.`
        : "JavaScript doesn't change these."),
      table(
        [{ text: "", cls: "label" }, "Source HTML", "Rendered", { text: "", cls: "label" }],
        r.diff.fields.map((f) =>
          h("tr", { class: f.changed ? "changed" : "" },
            h("td", { class: "label" }, FIELD_LABELS[f.field] ?? f.field),
            h("td", { class: "value-cell" }, fieldValues(f.raw)),
            h("td", { class: "value-cell" }, fieldValues(f.rendered)),
            h("td", { class: "label" }, f.changed ? h("span", { class: "badge warn" }, "changed") : h("span", { class: "muted small" }, "same")))),
        "data compare")),
    h("section", { class: "js-section" },
      h("h3", {}, "Totals"),
      table(
        ["", { text: "Source HTML", cls: "num" }, { text: "Rendered", cls: "num" }],
        totals.map(([label, a, b]) =>
          h("tr", { class: a === b ? "" : "changed" },
            h("td", {}, label), h("td", { class: "num" }, a), h("td", { class: "num" }, b))),
        "data compare")),
    linksSection("Links added by JavaScript", r.diff.linksAdded,
      "Crawlers that don't run JavaScript never see these. Google finds them only after rendering the page, which can happen well after crawling."),
    linksSection("Links removed by JavaScript", r.diff.linksRemoved,
      "In the source HTML, but gone from the rendered page."),
    h("p", { class: "muted small" },
      "Use the Source HTML / Rendered switch above the tabs to see the full analysis of either version."),
  ];
}

function renderJs() {
  const run = state.render;
  const badge = $("js-count");
  badge.textContent = "";
  badge.className = "count";
  let body = null;
  switch (run.status) {
    case "loading":
      body = h("div", { class: "state" },
        h("div", { class: "spinner", "aria-hidden": "true" }),
        h("p", {}, "Running the page's JavaScript in a hidden browser…"),
        h("p", { class: "muted small" }, "Waits until the page stops loading and changing, up to 20 seconds."));
      break;
    case "off":
      body = h("div", { class: "card speed-start" },
        h("p", {}, "See the page as browsers and Google see it after its JavaScript runs, and what the scripts change."),
        h("p", { class: "muted small" }, "Automatic rendering is off in Settings. The page's scripts run on your computer."),
        h("button", { class: "primary", type: "button", onclick: startRender }, "Render this page"));
      break;
    case "error":
      body = h("div", { class: "card speed-error" },
        h("h3", {}, "Rendering failed"),
        h("p", {}, run.error.message),
        h("button", { class: "secondary", type: "button", onclick: startRender }, "Try again"));
      break;
    case "done": {
      body = renderedReport(run.result);
      const n = changeCount(run.result.diff);
      badge.textContent = n;
      if (n) badge.className = "count warn";
      break;
    }
  }
  $("tab-js").replaceChildren(...[body].flat(Infinity).filter(Boolean));
}

// ───────────────────────────── Startup ─────────────────────────────

(async () => {
  try {
    state.settings = await invoke("get_settings");
  } catch (err) {
    console.error("could not load settings", err);
  }
  const url = await invoke("initial_url");
  if (!url) return;
  $("url").value = url;
  $("review-form").requestSubmit();
})();

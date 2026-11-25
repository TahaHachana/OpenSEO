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
  settings: { userAgent: { preset: "openSeo" }, pagespeedApiKey: null },
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
      renderReport(result);
      return show("report");
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

function renderReport(r) {
  const { http, content: c } = r;

  const finalUrl = $("final-url");
  finalUrl.replaceWith(Object.assign(extLink(http.finalUrl), { id: "final-url" }));
  $("redirects").replaceChildren(...(redirectChain(http)?.childNodes ?? []));

  $("facts").replaceChildren(
    fact("Status", http.status, "ok"),
    fact("Response", `${fmt.format(http.elapsedMs)} ms`),
    fact("Size", `${fmt.format(http.sizeKb)} KB`),
    fact("Errors", c.errors.length, c.errors.length ? "error" : "ok"),
    fact("Warnings", c.warnings.length, c.warnings.length ? "warn" : "ok"),
    fact("Links", c.links.length),
    fact("Text/HTML", `${fmt.format(c.textHtmlRatio)} %`),
    fact("User-Agent", state.reviewUserAgent),
  );

  const issues = c.errors.length + c.warnings.length;
  const issuesCount = $("issues-count");
  issuesCount.textContent = issues;
  issuesCount.className = `count ${c.errors.length ? "error" : issues ? "warn" : ""}`;
  $("links-count").textContent = c.links.length;
  $("headers-count").textContent = http.headers.length;

  renderOverview(c);
  renderIssues(c);
  renderKeywords();
  renderLinks();
  renderHeaders(http);

  // PageSpeed results belong to the previous page; start over for this one.
  state.speed.url = http.finalUrl;
  state.speed.runs = {};
  renderSpeed();
}

// ───────────────────────────── Tabs ─────────────────────────────

document.querySelectorAll(".tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((t) => {
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
      textCard("Title", c.title, [5, 65]),
      textCard("Meta description", c.metaDescription, [25, 150]),
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

// ───────────────────────────── Issues ─────────────────────────────

function issueCard(v) {
  const isError = v.level === "Error";
  return h("article", { class: `issue ${isError ? "error" : ""}` },
    h("div", { class: "issue-head" },
      h("span", { class: `badge ${isError ? "error" : "warn"}` }, v.level),
      h("span", { class: "badge" }, v.category),
      h("strong", {}, v.heading),
      v.position ? h("span", { class: "where" }, `line ${v.position.line}, col ${v.position.column}`) : null,
    ),
    h("p", {}, v.description),
    h("p", { class: "fix" }, v.recommendation),
  );
}

function renderIssues(c) {
  const all = [...c.errors, ...c.warnings];
  $("tab-issues").replaceChildren(
    all.length
      ? h("div", { class: "issues" }, all.map(issueCard))
      : h("div", { class: "card all-clear" },
          h("span", { class: "badge ok" }, "All clear"),
          h("p", {}, "No markup issues found by the current rules.")),
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
  const list = state.review.content.keywords
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
  const list = state.review.content.links.filter((l) =>
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
  const { userAgent, pagespeedApiKey } = state.settings;
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

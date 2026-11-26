// Reads back the rendered page once it has settled. Synchronous, like the probe.
(() => {
  "use strict";
  const SKIP = new Set(["script", "style", "noscript", "template"]);

  // Text as laid out: words in separate block boxes are separated, even when
  // the markup runs them together (<span>s that CSS displays as blocks).
  // Unlike innerText, this keeps the source's letter case (no text-transform),
  // which is what search engines index. Content hidden with display:none is
  // left out, as a browser would.
  const isInline = (display) =>
    display.startsWith("inline") || display === "contents" || display.startsWith("ruby");

  function layoutText(root) {
    let out = "";
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          out += child.data;
        } else if (child.nodeType === Node.ELEMENT_NODE && !SKIP.has(child.localName)) {
          if (child.localName === "br") {
            out += "\n";
            continue;
          }
          const display = getComputedStyle(child).display;
          if (display === "none") continue;
          const block = !isInline(display);
          if (block) out += "\n";
          walk(child);
          if (block) out += "\n";
        }
      }
    };
    walk(root);
    return out;
  }

  const texts = (selector, key) =>
    Array.from(document.querySelectorAll(selector), (el) => ({ key: key(el), text: layoutText(el) }));

  const doctype = document.doctype ? new XMLSerializer().serializeToString(document.doctype) + "\n" : "";
  return {
    url: location.href,
    html: doctype + document.documentElement.outerHTML,
    text: {
      links: texts("a[href]", (a) => a.getAttribute("href")),
      headings: texts("h1, h2, h3, h4, h5, h6", (h) => h.localName),
    },
  };
})()

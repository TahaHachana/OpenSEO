// Polled by Rust until the page settles. Synchronous: Linux webviews do not
// await promises returned by evaluated scripts.
(() => {
  const s = window.__openseo;
  return {
    href: location.href,
    ready: document.readyState,
    hooked: !!s,
    inflight: s ? s.inflight : 0,
    quietMs: s ? performance.now() - s.lastChange : 0,
  };
})()

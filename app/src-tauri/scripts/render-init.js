// Installed at document start in the hidden renderer window, before the page's
// own scripts. Tracks activity so Rust can tell when the page has settled, and
// keeps the page from blocking or making noise in a window nobody sees.
(() => {
  "use strict";
  if (window.__openseo) return;
  const state = (window.__openseo = { inflight: 0, lastChange: performance.now() });
  const touch = () => { state.lastChange = performance.now(); };
  const begin = () => { state.inflight++; touch(); };
  const end = () => { state.inflight--; touch(); };

  // Network activity: fetch and XMLHttpRequest in flight.
  const fetch = window.fetch;
  if (fetch) {
    window.fetch = function (...args) {
      begin();
      try {
        return fetch.apply(window, args).finally(end);
      } catch (e) {
        end();
        throw e;
      }
    };
  }
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    begin();
    this.addEventListener("loadend", end, { once: true });
    return send.apply(this, args);
  };

  // DOM changes that affect content. Style and class churn (carousels,
  // animations) is ignored, or many pages would never look settled.
  new MutationObserver(touch).observe(document, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["content", "href", "rel", "name", "src", "alt"],
  });

  // The renderer webview is never drawn, so on some platforms (WebKitGTK) the
  // engine produces no animation frames. Pages that wait for one to mount
  // content would stall; run frame callbacks on a 60 Hz timer instead.
  window.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);

  // Modal dialogs would freeze the page's script thread.
  window.alert = () => {};
  window.confirm = () => false;
  window.prompt = () => null;
  window.print = () => {};

  // No sound from a hidden window.
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    this.muted = true;
    return play.call(this);
  };
  document.addEventListener("play", (e) => { e.target.muted = true; }, true);
})();

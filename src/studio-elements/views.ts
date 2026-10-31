export function registerViews(): void {
  for (const name of [
    "sdp-spec-card",
    "sdp-maturity-map",
    "sdp-example-space",
    "sdp-trace-graph",
    "sdp-impact-view",
    "sdp-validation-findings",
  ]) {
    if (!globalThis.customElements.get(name))
      globalThis.customElements.define(name, class extends globalThis.HTMLElement {});
  }
}

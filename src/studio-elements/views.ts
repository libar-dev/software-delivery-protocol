/**
 * @sdpAnchor impl:protocol.studio-view-elements
 * @sdpLabel registers build-rendered cards, maps, spaces, trace graphs, impact and findings
 * @sdpReferences spec:consumers.spec-studio.components, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
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

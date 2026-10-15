/// <reference lib="dom" />

export function liveOutput(host: HTMLElement): HTMLOutputElement {
  const output =
    Array.from(host.querySelectorAll("output")).find(
      (candidate) =>
        candidate.closest("sdp-filter, sdp-expander, sdp-copy, sdp-search-results") === host,
    ) ?? host.ownerDocument.createElement("output");
  output.setAttribute("aria-live", "polite");
  if (!output.parentNode) host.append(output);
  return output;
}

export function button(host: HTMLElement, text: string): HTMLButtonElement {
  const control = host.ownerDocument.createElement("button");
  control.type = "button";
  control.textContent = text;
  return control;
}

export { escapeHtml } from "../projections/studio/pages/code-spans.js";

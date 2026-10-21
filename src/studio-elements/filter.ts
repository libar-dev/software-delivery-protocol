import { liveOutput } from "./dom.js";

export function rowMatches(
  row: Readonly<Record<string, string>>,
  filters: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(filters).every(
    ([name, chosen]) => chosen === "any" || (row[name] ?? "").split(/\s+/u).includes(chosen),
  );
}

/**
 * Reads each row's filter attributes and changes only its hidden state.
 *
 * @sdpAnchor impl:protocol.studio-filter
 * @sdpSatisfies spec:consumers.spec-studio.page-elements
 * @sdpReferences spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerFilter(): void {
  class Filter extends globalThis.HTMLElement {
    private readonly update = (): void => {
      const filters = Object.fromEntries(
        Array.from(this.querySelectorAll<HTMLSelectElement>("select[data-filter]"), (select) => [
          select.getAttribute("data-filter") ?? "",
          select.value,
        ]),
      );
      const rows = Array.from(this.querySelectorAll<HTMLElement>("[data-row]"));
      for (const row of rows) {
        const values = Object.fromEntries(
          Object.keys(filters).map((name) => [name, row.getAttribute(`data-${name}`) ?? ""]),
        );
        row.hidden = !rowMatches(values, filters);
      }
      liveOutput(this).textContent =
        `${String(rows.filter((row) => !row.hidden).length)} of ${String(rows.length)} shown`;
    };

    connectedCallback(): void {
      const form = this.querySelector("form");
      if (form) {
        form.hidden = false;
        form.addEventListener("submit", this.preventSubmit);
      }
      this.addEventListener("change", this.update);
      this.update();
    }

    private readonly preventSubmit = (event: Event): void => {
      event.preventDefault();
    };

    disconnectedCallback(): void {
      this.removeEventListener("change", this.update);
      this.querySelector("form")?.removeEventListener("submit", this.preventSubmit);
    }
  }
  if (!globalThis.customElements.get("sdp-filter"))
    globalThis.customElements.define("sdp-filter", Filter);
}

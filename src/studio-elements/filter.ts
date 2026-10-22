import { liveOutput } from "./dom.js";
import { fragmentTarget } from "./expander.js";

export function rowMatches(
  row: Readonly<Record<string, string>>,
  filters: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(filters).every(
    ([name, chosen]) => chosen === "any" || (row[name] ?? "").split(/\s+/u).includes(chosen),
  );
}

export function epicFilter(
  href: string,
  epics: readonly string[],
): { value: string; unknown: boolean } {
  const values = new URL(href).searchParams.getAll("epic");
  if (values.length === 0) return { value: "any", unknown: false };
  const value = values[0] ?? "";
  if (values.length !== 1 || (value !== "none" && !epics.includes(value)))
    return { value: "any", unknown: true };
  return { value, unknown: false };
}

/**
 * Reads each row's filter attributes and changes only its hidden state.
 *
 * @sdpAnchor impl:protocol.studio-filter
 * @sdpSatisfies spec:consumers.spec-studio.page-elements, spec:consumers.spec-studio.components, spec:consumers.spec-studio.capability-map-page
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole interaction
 * @sdpLabel filters build-rendered rows through their recorded attributes
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

    // A link or fragment that targets a row this filter hides clears every choice, so the
    // linked row shows; the expander opens its disclosures.
    private readonly showTarget = (id: string | null): void => {
      const target = id === null ? null : this.ownerDocument.getElementById(id);
      if (!target || !this.contains(target) || !target.closest<HTMLElement>("[data-row]")?.hidden)
        return;
      for (const select of Array.from(
        this.querySelectorAll<HTMLSelectElement>("select[data-filter]"),
      ))
        select.value = "any";
      this.update();
      const output = liveOutput(this);
      output.textContent = `${output.textContent}; the filter was cleared to show ${id ?? "the linked entry"}`;
      target.scrollIntoView();
    };

    private readonly hashChange = (): void => {
      this.showTarget(fragmentTarget(this.ownerDocument.location.hash));
    };

    private readonly linkClick = (event: Event): void => {
      const link = (event.target as Element | null)?.closest("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("#")) this.showTarget(fragmentTarget(href));
    };

    connectedCallback(): void {
      const form = this.querySelector("form");
      if (form) {
        form.hidden = false;
        form.addEventListener("submit", this.preventSubmit);
      }
      const epic = this.querySelector<HTMLSelectElement>('select[data-filter="epic"]');
      if (epic) {
        const requested = epicFilter(
          this.ownerDocument.location.href,
          Array.from(epic.options)
            .map((o) => o.value)
            .filter((v) => v !== "any" && v !== "none"),
        );
        epic.value = requested.value;
        const note = this.querySelector<HTMLElement>("[data-filter-note]");
        if (note)
          note.textContent = requested.unknown ? "Unknown epic filter. All Specs are shown." : "";
      }
      form?.addEventListener("reset", this.reset);
      this.addEventListener("change", this.change);
      this.ownerDocument.addEventListener("click", this.linkClick, true);
      this.ownerDocument.defaultView?.addEventListener("hashchange", this.hashChange);
      this.update();
      this.hashChange();
    }

    private readonly change = (): void => {
      const note = this.querySelector<HTMLElement>("[data-filter-note]");
      if (note) note.textContent = "";
      this.update();
    };

    private readonly reset = (): void => {
      // Native defaults apply after the event; let other form controls reset too.
      queueMicrotask(() => {
        for (const select of Array.from(
          this.querySelectorAll<HTMLSelectElement>("select[data-filter]"),
        ))
          select.value = "any";
        const note = this.querySelector<HTMLElement>("[data-filter-note]");
        if (note) note.textContent = "";
        this.update();
      });
    };

    private readonly preventSubmit = (event: Event): void => {
      event.preventDefault();
    };

    disconnectedCallback(): void {
      this.removeEventListener("change", this.change);
      this.ownerDocument.removeEventListener("click", this.linkClick, true);
      this.ownerDocument.defaultView?.removeEventListener("hashchange", this.hashChange);
      this.querySelector("form")?.removeEventListener("reset", this.reset);
      this.querySelector("form")?.removeEventListener("submit", this.preventSubmit);
    }
  }
  if (!globalThis.customElements.get("sdp-filter"))
    globalThis.customElements.define("sdp-filter", Filter);
}

import { button, liveOutput } from "./dom.js";

// Mermaid source stays as the reader left it in print; the print style hides a closed one.
const sourceDisclosure =
  'sdp-diagram details[id$=".source"], sdp-maturity-map details[id$=".source"]';

export function fragmentTarget(fragment: string): string | null {
  if (fragment.length < 2) return null;
  try {
    return decodeURIComponent(fragment.slice(1));
  } catch {
    return null;
  }
}

/**
 * Opens every enclosing details before scrolling to a fragment target.
 *
 * @sdpAnchor impl:protocol.studio-expander
 * @sdpSatisfies spec:consumers.spec-studio.page-elements, spec:consumers.spec-studio.export
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole interaction
 * @sdpLabel opens fragment ancestors and expands disclosures for print
 */
export function registerExpander(): void {
  class Expander extends globalThis.HTMLElement {
    private initialized = false;
    private printed: { details: HTMLDetailsElement; open: boolean }[] = [];
    private readonly beforePrint = (): void => {
      if (this.printed.length) return;
      this.printed = Array.from(this.querySelectorAll("details"))
        .filter((details) => !details.matches(sourceDisclosure))
        .map((details) => ({
          details,
          open: details.open,
        }));
      for (const { details } of this.printed) details.open = true;
    };
    private readonly afterPrint = (): void => {
      for (const { details, open } of this.printed) details.open = open;
      this.printed = [];
    };
    private readonly reveal = (): void => {
      const id = fragmentTarget(this.ownerDocument.location.hash);
      const target = id === null ? null : this.ownerDocument.getElementById(id);
      if (!target || !this.contains(target)) return;
      for (const details of Array.from(this.querySelectorAll("details"))) {
        if (details.contains(target)) details.open = true;
      }
      target.scrollIntoView();
      liveOutput(this).textContent = `Opened ${id ?? "entry"}`;
    };

    private setOpen(open: boolean): void {
      const details = Array.from(this.querySelectorAll("details"));
      for (const panel of details) panel.open = open;
      liveOutput(this).textContent =
        `${open ? "Opened" : "Closed"} ${String(details.length)} panels`;
    }

    connectedCallback(): void {
      if (!this.initialized) {
        const controls = this.ownerDocument.createElement("div");
        const open = button(this, "Open all");
        const close = button(this, "Close all");
        open.addEventListener("click", () => {
          this.setOpen(true);
        });
        close.addEventListener("click", () => {
          this.setOpen(false);
        });
        controls.append(open, close);
        this.prepend(controls);
        liveOutput(this);
        this.initialized = true;
      }
      this.ownerDocument.defaultView?.addEventListener("hashchange", this.reveal);
      this.ownerDocument.defaultView?.addEventListener("beforeprint", this.beforePrint);
      this.ownerDocument.defaultView?.addEventListener("afterprint", this.afterPrint);
      this.reveal();
    }

    disconnectedCallback(): void {
      this.ownerDocument.defaultView?.removeEventListener("hashchange", this.reveal);
      this.ownerDocument.defaultView?.removeEventListener("beforeprint", this.beforePrint);
      this.ownerDocument.defaultView?.removeEventListener("afterprint", this.afterPrint);
      this.afterPrint();
    }
  }
  if (!globalThis.customElements.get("sdp-expander"))
    globalThis.customElements.define("sdp-expander", Expander);
}

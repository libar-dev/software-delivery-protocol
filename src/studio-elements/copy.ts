import { button, liveOutput } from "./dom.js";

export type ClipboardWriter = (text: string) => Promise<void>;

export async function copyText(
  text: string,
  write: ClipboardWriter | undefined,
  select: (text: string) => void,
): Promise<string> {
  if (write) {
    try {
      await write(text);
      return "Copied";
    } catch {
      /* Offer selection when clipboard access fails. */
    }
  }
  select(text);
  return "Text selected. Copy it with your keyboard.";
}

/**
 * Falls back to a focused, selected textarea when clipboard access is unavailable.
 *
 * @sdpAnchor impl:protocol.studio-copy
 * @sdpSatisfies spec:consumers.spec-studio.page-elements
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerCopy(): void {
  class Copy extends globalThis.HTMLElement {
    private control?: HTMLButtonElement;
    private selected?: HTMLTextAreaElement;
    static get observedAttributes(): string[] {
      return ["text"];
    }

    attributeChangedCallback(): void {
      this.control?.setAttribute("aria-label", `Copy ${this.getAttribute("text") ?? ""}`);
    }

    connectedCallback(): void {
      if (this.control) return;
      this.control = button(this, "Copy");
      this.attributeChangedCallback();
      this.control.addEventListener("click", () => {
        const clipboard = this.ownerDocument.defaultView?.navigator.clipboard;
        const write =
          clipboard === undefined
            ? undefined
            : (text: string): Promise<void> => clipboard.writeText(text);
        void copyText(this.getAttribute("text") ?? "", write, (text) => {
          this.selected?.parentElement?.remove();
          const label = this.ownerDocument.createElement("label");
          label.textContent = "Text to copy ";
          this.selected = this.ownerDocument.createElement("textarea");
          this.selected.readOnly = true;
          this.selected.value = text;
          label.append(this.selected);
          this.append(label);
          this.selected.focus();
          this.selected.select();
        }).then((message) => {
          liveOutput(this).textContent = message;
        });
      });
      this.append(this.control);
      liveOutput(this);
    }
  }
  if (!globalThis.customElements.get("sdp-copy"))
    globalThis.customElements.define("sdp-copy", Copy);
}

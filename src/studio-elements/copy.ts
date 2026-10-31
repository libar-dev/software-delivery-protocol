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
 * @sdpRole interaction
 * @sdpLabel copies text with selection fallback and failure feedback
 */
export function registerCopy(): void {
  class Copy extends globalThis.HTMLElement {
    private control?: HTMLButtonElement;
    private selected?: HTMLTextAreaElement;
    static get observedAttributes(): string[] {
      return ["text", "for"];
    }

    private target(): HTMLTextAreaElement | undefined {
      const id = this.getAttribute("for");
      if (!id) return undefined;
      return Array.from(this.ownerDocument.querySelectorAll<HTMLTextAreaElement>("textarea")).find(
        (area) => area.id === id || area.getAttribute("id") === id,
      );
    }
    attributeChangedCallback(): void {
      const target = this.target();
      const label = target
        ? (Array.from(this.ownerDocument.querySelectorAll("label")).find(
            (label) => label.getAttribute("for") === (target.id || target.getAttribute("id")),
          )?.textContent ??
          target.getAttribute("aria-label") ??
          "text")
        : (this.getAttribute("text") ?? "");
      this.control?.setAttribute("aria-label", `Copy ${label}`);
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
        const target = this.target();
        if (this.getAttribute("for") && !target) return;
        void copyText(target?.value ?? this.getAttribute("text") ?? "", write, (text) => {
          if (target) {
            target.focus();
            target.select();
            return;
          }
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

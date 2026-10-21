/// <reference lib="dom" />
import { IntentPanel, pageRootPath } from "./intent-panel.js";
import type { GatheredIntent, IntentStorage } from "./intent-panel.js";
import { button } from "./dom.js";
import { copyText } from "./copy.js";
export interface IntentPanelElement extends HTMLElement {
  gather(intent: GatheredIntent): void;
}
export function gatherInPage(host: HTMLElement, intent: GatheredIntent): void {
  const panel = host.ownerDocument.querySelector<IntentPanelElement>("sdp-intent-panel");
  if (!panel) throw new Error("This page has no composing panel.");
  panel.gather(intent);
}
/**
 * @sdpAnchor impl:protocol.studio-intent-panel-element
 * @sdpLabel displays gathered requests and writes copy selections or local download links
 * @sdpSatisfies spec:consumers.spec-studio.intent-panel
 * @sdpReferences spec:consumers.edit-model, spec:consumers.intent-composition
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerIntentPanel(): void {
  class Panel extends globalThis.HTMLElement implements IntentPanelElement {
    private model?: IntentPanel;
    private base = "";
    private reason = "";
    private observer?: MutationObserver;
    private urls: string[] = [];
    private readonly refresh = (): void => {
      this.model?.refresh();
      this.render();
    };
    connectedCallback(): void {
      if (!this.model) {
        let storage: IntentStorage | undefined;
        try {
          storage = this.ownerDocument.defaultView?.localStorage;
        } catch {
          /* Keep gathered intents in this tab when storage is unavailable. */
        }
        this.model = new IntentPanel(
          storage,
          pageRootPath(this.getAttribute("page-root") ?? "./", this.ownerDocument.location.href),
        );
      }
      this.model.refresh();
      this.ownerDocument.defaultView?.addEventListener("storage", this.refresh);
      this.ownerDocument.defaultView?.addEventListener("pageshow", this.refresh);
      const stamp = this.ownerDocument.querySelector("sdp-stamp");
      if (stamp && typeof MutationObserver === "function") {
        this.observer = new MutationObserver(() => {
          this.render();
        });
        this.observer.observe(stamp, { attributes: true, attributeFilter: ["data-corpus-commit"] });
      }
      this.render();
    }
    disconnectedCallback(): void {
      this.ownerDocument.defaultView?.removeEventListener("storage", this.refresh);
      this.ownerDocument.defaultView?.removeEventListener("pageshow", this.refresh);
      this.observer?.disconnect();
      this.releaseUrls();
    }
    gather(intent: GatheredIntent): void {
      this.model?.gather(intent);
      this.render();
      const details = this.querySelector("details");
      if (details) details.open = true;
    }
    private releaseUrls(): void {
      for (const url of this.urls) URL.revokeObjectURL(url);
      this.urls = [];
    }
    private render(): void {
      if (!this.model) return;
      const model = this.model;
      const open = this.querySelector("details")?.open ?? false;
      this.releaseUrls();
      this.replaceChildren();
      const doc = this.ownerDocument;
      const details = doc.createElement("details");
      details.className = "section";
      details.open = open;
      const heading = doc.createElement("summary");
      heading.textContent = `Composing (${String(model.intents.length)})`;
      details.append(heading);
      const body = doc.createElement("div");
      body.className = "section-body";
      details.append(body);
      this.append(details);
      const output = doc.createElement("output");
      output.setAttribute("aria-live", "polite");
      const clipboard = this.ownerDocument.defaultView?.navigator.clipboard;
      const copied = (text: string): void => {
        void copyText(
          text,
          clipboard ? (value) => clipboard.writeText(value) : undefined,
          (value) => {
            const label = doc.createElement("label");
            label.textContent = "Text to copy";
            const field = doc.createElement("textarea");
            field.readOnly = true;
            field.value = value;
            label.append(field);
            body.append(label);
            field.focus();
            field.select();
          },
        ).then((message) => {
          output.textContent = message;
        });
      };
      if (this.model.storageProblem) {
        const warning = doc.createElement("p");
        warning.textContent =
          "Browser storage is unavailable or contains unreadable intents. Copy these intents before leaving the page.";
        body.append(warning);
      }
      if (!this.model.intents.length) {
        const empty = doc.createElement("p");
        empty.textContent =
          "No gathered intents. Use a composing action beside an entry, example or question.";
        body.append(empty);
      }
      const list = doc.createElement("ol");
      this.model.intents.forEach((intent, index) => {
        const row = doc.createElement("li");
        const scope = doc.createElement("code");
        scope.textContent = intent.pack ?? intent.scope.join(", ");
        row.append(scope, ` ${intent.request} `);
        const discard = button(this, "Discard");
        discard.setAttribute("aria-label", `Discard intent ${String(index + 1)}`);
        discard.addEventListener("click", () => {
          this.model?.discard(index);
          this.render();
        });
        row.append(discard);
        list.append(row);
      });
      body.append(list);
      const stamped =
        this.ownerDocument.querySelector("sdp-stamp")?.getAttribute("data-corpus-commit") ??
        undefined;
      const field = (labelText: string, value: string, onInput: (value: string) => void): void => {
        const label = doc.createElement("label");
        label.textContent = labelText;
        const input = doc.createElement("input");
        input.type = "text";
        input.value = value;
        input.addEventListener("input", () => {
          onInput(input.value);
          refreshActions();
        });
        label.append(input);
        body.append(label);
      };
      if (stamped) {
        const base = doc.createElement("p");
        base.append("Base: ");
        const code = doc.createElement("code");
        code.textContent = stamped;
        base.append(code);
        body.append(base);
      } else
        field("Base commit", this.base, (value) => {
          this.base = value;
        });
      field("Reason for the proposal", this.reason, (value) => {
        this.reason = value;
      });
      const actions = doc.createElement("div");
      actions.className = "intent-actions";
      body.append(actions, output);
      const refreshActions = (): void => {
        this.releaseUrls();
        actions.replaceChildren();
        const handoff = model.handoff(stamped ?? this.base, this.reason, stamped);
        if (handoff.proposal && handoff.memo !== null) {
          const documents = [
            ["memo", handoff.memo, "proposal.md", "text/markdown"],
            [
              "proposal",
              JSON.stringify(handoff.proposal, null, 2) + "\n",
              "proposal.json",
              "application/json",
            ],
          ] as const;
          for (const [label, content] of documents) {
            const copy = button(this, `Copy ${label}`);
            copy.addEventListener("click", () => {
              copied(content);
            });
            actions.append(copy);
          }
          for (const [label, content, file, type] of documents) {
            const save = doc.createElement("a");
            save.textContent = `Save ${label}`;
            save.download = file;
            const url = URL.createObjectURL(new Blob([content], { type }));
            this.urls.push(url);
            save.href = url;
            actions.append(save);
          }
        }
        if (handoff.apart.length) {
          const title = doc.createElement("h3");
          title.textContent = "Not in the proposal";
          const items = doc.createElement("ul");
          for (const intent of handoff.apart) {
            const row = doc.createElement("li");
            row.textContent = `${intent.pack ?? intent.scope.join(", ")}: ${intent.request}`;
            items.append(row);
          }
          const copy = button(this, "Copy scoped intent");
          copy.addEventListener("click", () => {
            copied(handoff.scopedText);
          });
          actions.append(title, items, copy);
        }
        if (model.intents.length) {
          const discard = button(this, "Discard all");
          discard.addEventListener("click", () => {
            this.model?.discardAll();
            this.render();
          });
          actions.append(discard);
        }
      };
      refreshActions();
    }
  }
  if (!globalThis.customElements.get("sdp-intent-panel"))
    globalThis.customElements.define("sdp-intent-panel", Panel);
}

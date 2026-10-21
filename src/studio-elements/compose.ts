import { button } from "./dom.js";
import { gatherInPage } from "./intent-panel-element.js";
const labels: Readonly<Record<string, string>> = {
  "resolve-question": "Resolve question",
  "promote-question": "Propose decision record",
  "edit-example": "Edit example",
  "propose-example": "Propose example",
  "change-target": "Change target",
  "propose-target": "Propose target",
  "propose-values": "Propose examples for uncovered values",
  "change-entry": "Propose new text",
};
/**
 * @sdpAnchor impl:protocol.studio-compose
 * @sdpLabel opens a native request dialog beside build-rendered scopes without changing their content
 * @sdpSatisfies spec:consumers.spec-studio.intent-panel, spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerCompose(): void {
  class Compose extends globalThis.HTMLElement {
    private control?: HTMLButtonElement;
    private dialog?: HTMLDialogElement;
    connectedCallback(): void {
      if (this.control) return;
      const action = this.getAttribute("action") ?? "";
      const label = labels[action];
      if (!label) return;
      this.control = button(this, label);
      this.control.addEventListener("click", () => {
        this.open(action, label);
      });
      this.append(this.control);
    }
    disconnectedCallback(): void {
      this.dialog?.remove();
    }
    private open(action: string, labelText: string): void {
      this.dialog?.remove();
      const doc = this.ownerDocument;
      const dialog = doc.createElement("dialog");
      this.dialog = dialog;
      const title = doc.createElement("h2");
      title.textContent = labelText;
      dialog.setAttribute("aria-label", labelText);
      dialog.append(title);
      const scope = this.getAttribute("scope") ?? "";
      const shownScope = doc.createElement("p");
      shownScope.textContent = scope;
      dialog.append(shownScope);
      const scenario = ["edit-example", "propose-example"].includes(action)
        ? Array.from(doc.querySelectorAll<HTMLTemplateElement>("template[data-scenario-for]")).find(
            (template) => template.getAttribute("data-scenario-for") === scope,
          )
        : undefined;
      if (scenario) {
        dialog.append(scenario.content.cloneNode(true));
        const cancel = button(this, "Cancel");
        cancel.addEventListener("click", () => {
          dialog.close();
        });
        dialog.append(cancel);
      } else {
        const form = doc.createElement("form");
        const requestLabel = doc.createElement("label");
        requestLabel.textContent = "Request";
        const request = doc.createElement("textarea");
        request.required = true;
        request.addEventListener("input", () => {
          request.setCustomValidity("");
        });
        requestLabel.append(request);
        form.append(requestLabel);
        const exact = [
          "change-entry",
          "change-target",
          "propose-target",
          "edit-example",
          "propose-example",
        ].includes(action)
          ? doc.createElement("textarea")
          : undefined;
        if (exact) {
          const label = doc.createElement("label");
          label.textContent = "Exact entry text";
          exact.value = this.getAttribute("data-entry-text") ?? "";
          label.append(exact);
          form.append(label);
        }
        const pack = scope.startsWith("pack:") ? scope : undefined;
        let packPart: HTMLSelectElement | undefined;
        if (pack) {
          const label = doc.createElement("label");
          label.textContent = "Change applies to";
          packPart = doc.createElement("select");
          for (const [value, text] of [
            ["members", "Member Specs"],
            ["pack", "Pack membership or framing"],
          ]) {
            const option = doc.createElement("option");
            option.value = value ?? "";
            option.textContent = text ?? "";
            packPart.append(option);
          }
          label.append(packPart);
          form.append(label);
        }
        const gather = button(this, "Gather");
        gather.type = "submit";
        const cancel = button(this, "Cancel");
        cancel.addEventListener("click", () => {
          dialog.close();
        });
        form.append(gather, cancel);
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          request.setCustomValidity(request.value.trim() ? "" : "Give the intent a request.");
          if (!form.reportValidity()) return;
          const members = (this.getAttribute("members") ?? "").split(" ").filter(Boolean);
          gatherInPage(this, {
            scope: pack ? members : [scope],
            request: request.value,
            action: packPart?.value === "pack" ? "change-pack" : action,
            ...(pack ? { pack } : {}),
            ...(exact?.value.trim() ? { text: exact.value } : {}),
            ...(action === "change-entry" && scope.includes("#") ? { replaces: scope } : {}),
          });
          dialog.close();
        });
        dialog.append(form);
      }
      dialog.addEventListener(
        "close",
        () => {
          dialog.remove();
          this.control?.focus();
        },
        { once: true },
      );
      doc.body.append(dialog);
      dialog.showModal();
    }
  }
  if (!globalThis.customElements.get("sdp-compose"))
    globalThis.customElements.define("sdp-compose", Compose);
}

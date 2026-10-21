import { button } from "./dom.js";
import { gatherInPage } from "./intent-panel-element.js";
export function scenarioText(given: string, when: string, then: string): string {
  return [
    ["Given", given],
    ["When", when],
    ["Then", then],
  ]
    .flatMap(([keyword, value]) =>
      (value ?? "")
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => `${keyword ?? ""} ${line}`),
    )
    .join("\n");
}
/**
 * @sdpAnchor impl:protocol.studio-scenario-editor
 * @sdpLabel gathers the edited Given, When and Then as exact text scoped to its subject
 * @sdpSatisfies spec:consumers.spec-studio.intent-panel
 * @sdpReferences spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.studio-elements
 * @sdpRole utility
 */
export function registerScenarioEditor(): void {
  class ScenarioEditor extends globalThis.HTMLElement {
    private initialized = false;
    connectedCallback(): void {
      if (this.initialized) return;
      this.initialized = true;
      const doc = this.ownerDocument;
      const form = doc.createElement("form");
      const fields: HTMLTextAreaElement[] = [];
      for (const keyword of ["Given", "When", "Then"]) {
        const label = doc.createElement("label");
        label.textContent = keyword;
        const input = doc.createElement("textarea");
        input.value =
          this.querySelector(`[data-step="${keyword.toLowerCase()}"]`)?.textContent ?? "";
        label.append(input);
        form.append(label);
        fields.push(input);
      }
      const requestLabel = doc.createElement("label");
      requestLabel.textContent = "Request";
      const request = doc.createElement("textarea");
      request.required = true;
      request.addEventListener("input", () => {
        request.setCustomValidity("");
      });
      request.value =
        this.getAttribute("mode") === "edit"
          ? "Edit these example steps."
          : "Propose an example with these steps.";
      requestLabel.append(request);
      form.append(requestLabel);
      const submit = button(this, "Gather");
      submit.type = "submit";
      form.append(submit);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        request.setCustomValidity(request.value.trim() ? "" : "Give the intent a request.");
        if (!form.reportValidity()) return;
        const text = scenarioText(
          fields[0]?.value ?? "",
          fields[1]?.value ?? "",
          fields[2]?.value ?? "",
        );
        gatherInPage(this, {
          scope: [this.getAttribute("spec-id") ?? ""],
          action: this.getAttribute("mode") === "edit" ? "edit-example" : "propose-example",
          request: request.value,
          ...(text.trim() ? { text } : {}),
        });
        this.closest("dialog")?.close();
      });
      this.replaceChildren(form);
    }
  }
  if (!globalThis.customElements.get("sdp-scenario-editor"))
    globalThis.customElements.define("sdp-scenario-editor", ScenarioEditor);
}

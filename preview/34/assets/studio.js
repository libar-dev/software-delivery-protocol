"use strict";
(() => {
  // src/projections/studio/pages/code-spans.ts
  function escapeHtml(value) {
    return value.replace(
      /[&<>"']/gu,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char
    );
  }
  function mapCodeSpans(value, plain, span2) {
    const runs = [...value.matchAll(/`+/gu)];
    let at = 0;
    let out = "";
    for (let i = 0; i < runs.length; i++) {
      const open = runs[i];
      if (!open) continue;
      const closing = runs.findIndex((run, j) => j > i && run[0].length === open[0].length);
      if (closing < 0) continue;
      const close = runs[closing];
      if (!close) continue;
      out += plain(value.slice(at, open.index));
      out += span2(value.slice(open.index + open[0].length, close.index));
      at = close.index + close[0].length;
      i = closing;
    }
    return out + plain(value.slice(at));
  }
  var codeSpans = (value) => mapCodeSpans(value, escapeHtml, (v) => `<code>${escapeHtml(v)}</code>`);

  // src/studio-elements/dom.ts
  function liveOutput(host) {
    const output = Array.from(host.querySelectorAll("output")).find(
      (candidate) => candidate.closest("sdp-filter, sdp-expander, sdp-copy, sdp-search-results") === host
    ) ?? host.ownerDocument.createElement("output");
    output.setAttribute("aria-live", "polite");
    if (!output.parentNode) host.append(output);
    return output;
  }
  function button(host, text) {
    const control = host.ownerDocument.createElement("button");
    control.type = "button";
    control.textContent = text;
    return control;
  }

  // src/studio-elements/memo.ts
  var longestRun = (value) => Math.max(0, ...Array.from(value.matchAll(/`+/gu), (m) => m[0].length));
  function span(value) {
    const ticks = "`".repeat(longestRun(value) + 1);
    const pad = value.startsWith("`") || value.endsWith("`") ? " " : "";
    return `${ticks}${pad}${value}${pad}${ticks}`;
  }
  function fenced(value, language = "") {
    const ticks = "`".repeat(Math.max(3, longestRun(value) + 1));
    return `${ticks}${language}
${value}
${ticks}
`;
  }
  function renderMemo(proposal) {
    let memo = `# Change proposal

Base: ${span(proposal.base)}
Reason: ${span(proposal.reason)}

`;
    proposal.changes.forEach((change, index) => {
      memo += `## Change ${String(index + 1)}

Scope: ${change.scope.map(span).join(", ")}
Request:

${fenced(change.request, "text")}`;
      if (change.replaces !== void 0) memo += `Replaces: ${span(change.replaces)}
`;
      if (change.follows !== void 0) memo += `Follows: ${span(change.follows)}
`;
      if (change.relation) {
        const r = change.relation;
        memo += `Relation: ${r.action} ${span(r.from)} ${r.type} ${span(r.target)}
`;
      }
      if (change.reason !== void 0) memo += `Reason: ${span(change.reason)}
`;
      if (change.text !== void 0) memo += `
${fenced(change.text)}`;
      memo += "\n";
    });
    return `${memo}## The proposal

${fenced(JSON.stringify(proposal, null, 2), "json")}`;
  }

  // src/studio-elements/proposal.ts
  var specId = /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*(?![\s\S])/u;
  var entryAddress = /^spec:[A-Za-z0-9][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)*#(design|ui|question|rule|term)\.([a-z][A-Za-z0-9]*)(?![\s\S])/u;
  var scopeRef = (value) => typeof value === "string" && (specId.test(value) || entryAddress.test(value));
  function proposalProblems(proposal) {
    const problems = [];
    const problem = (path, message) => {
      problems.push({ path, problem: message });
    };
    const closed = (value, path, allowed, required) => {
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        problem(path, "Expected an object.");
        return false;
      }
      for (const key of Object.keys(value))
        if (!allowed.includes(key)) problem(`${path}.${key}`, "Unknown field.");
      for (const key of required)
        if (!Object.hasOwn(value, key)) problem(`${path}.${key}`, "Required field.");
      return true;
    };
    const text = (value, path, nonempty = false) => {
      if (typeof value !== "string" || nonempty && value.length === 0)
        problem(path, nonempty ? "Expected a non-empty string." : "Expected a string.");
    };
    const reason = (value, path) => {
      text(value, path, true);
      if (typeof value === "string" && /[\r\n\u0085\u2028\u2029]/u.test(value))
        problem(path, "Expected one line.");
    };
    const authoredTypes = [
      "refines",
      "dependsOn",
      "constrainedBy",
      "decidedBy",
      "verifies",
      "supersedes"
    ];
    if (closed(
      proposal,
      "$",
      ["schema", "base", "reason", "changes"],
      ["schema", "base", "reason", "changes"]
    )) {
      if (proposal.schema !== "sdp-proposal/1") problem("$.schema", "Expected sdp-proposal/1.");
      text(proposal.base, "$.base", true);
      reason(proposal.reason, "$.reason");
      if (!Array.isArray(proposal.changes) || !proposal.changes.length)
        problem("$.changes", "Expected a non-empty list.");
      else
        proposal.changes.forEach((change, index) => {
          const path = `$.changes[${String(index)}]`;
          if (!closed(
            change,
            path,
            ["scope", "request", "text", "replaces", "follows", "relation", "reason"],
            ["scope", "request"]
          ))
            return;
          if (!Array.isArray(change.scope) || !change.scope.length)
            problem(`${path}.scope`, "Expected a non-empty list.");
          else
            change.scope.forEach((ref, index2) => {
              if (!scopeRef(ref))
                problem(`${path}.scope[${String(index2)}]`, "Expected a Spec id or entry address.");
            });
          text(change.request, `${path}.request`, true);
          if (Object.hasOwn(change, "text")) text(change.text, `${path}.text`);
          if (Object.hasOwn(change, "reason")) reason(change.reason, `${path}.reason`);
          for (const key of ["replaces", "follows"])
            if (Object.hasOwn(change, key) && (typeof change[key] !== "string" || !entryAddress.test(change[key])))
              problem(`${path}.${key}`, "Expected an entry address.");
          if (Object.hasOwn(change, "replaces") && Object.hasOwn(change, "follows"))
            problem(path, "replaces and follows are exclusive.");
          if (Object.hasOwn(change, "relation") && closed(
            change.relation,
            `${path}.relation`,
            ["action", "from", "type", "target"],
            ["action", "from", "type", "target"]
          )) {
            const relation = change.relation;
            if (relation.action !== "declare" && relation.action !== "remove")
              problem(`${path}.relation.action`, "Expected declare or remove.");
            if (typeof relation.type !== "string" || !authoredTypes.includes(relation.type))
              problem(`${path}.relation.type`, "Expected an authored relation type.");
            for (const key of ["from", "target"])
              if (typeof relation[key] !== "string" || !specId.test(relation[key]))
                problem(`${path}.relation.${key}`, "Expected a Spec id.");
          }
        });
    }
    return problems;
  }

  // src/studio-elements/intent-panel.ts
  function validIntent(value) {
    if (value === null || typeof value !== "object") return false;
    const i = value;
    return Array.isArray(i.scope) && i.scope.every((s) => typeof s === "string") && typeof i.request === "string" && i.request.trim().length > 0 && typeof i.action === "string" && (i.packMembersComplete === void 0 || typeof i.packMembersComplete === "boolean") && ["text", "replaces", "follows", "pack"].every(
      (k) => i[k] === void 0 || typeof i[k] === "string"
    );
  }
  function pageRootPath(root, page) {
    return new URL(root || "./", page).pathname;
  }
  function scopedIntentText(intents) {
    return intents.map((i) => {
      const scope = i.action === "change-pack" && i.pack ? i.pack : i.scope.join(", ");
      const pack = i.pack && i.action !== "change-pack" ? `
Pack: ${i.pack}` : "";
      return `Action: ${i.action}
Scope: ${scope}${pack}
${i.request}${i.text === void 0 ? "" : `
Exact text:
${i.text}`}
`;
    }).join("\n");
  }
  var IntentPanel = class {
    constructor(storage, rootPath) {
      this.storage = storage;
      this.key = `sdp-studio:intents:${rootPath}`;
      this.refresh();
    }
    storage;
    gathered = [];
    pending = [];
    key;
    storageProblem = false;
    refresh() {
      if (!this.storage) {
        this.storageProblem = true;
        return;
      }
      try {
        const value = JSON.parse(this.storage.getItem(this.key) ?? "[]");
        if (Array.isArray(value)) {
          this.gathered = value.filter(validIntent);
          this.storageProblem = this.gathered.length !== value.length;
          for (const change of this.pending) this.gathered = change(this.gathered);
          if (this.pending.length) this.storageProblem = true;
        } else this.storageProblem = true;
      } catch {
        this.storageProblem = true;
      }
    }
    get intents() {
      return this.gathered;
    }
    persist() {
      try {
        this.storage?.setItem(this.key, JSON.stringify(this.gathered));
        if (!this.storage) this.storageProblem = true;
        else this.pending = [];
      } catch {
        this.storageProblem = true;
      }
    }
    change(change) {
      this.refresh();
      this.gathered = change(this.gathered);
      this.pending.push(change);
      this.persist();
    }
    gather(intent) {
      if (!validIntent(intent)) throw new Error("Give the intent a scope and a request.");
      const gathered = { ...intent, scope: [...intent.scope] };
      this.change((intents) => [...intents, gathered]);
    }
    discard(index) {
      const target = this.gathered[index];
      this.change((intents) => {
        const current = intents.findIndex(
          (intent) => JSON.stringify(intent) === JSON.stringify(target)
        );
        return intents.filter((_, index2) => index2 !== current);
      });
    }
    discardAll() {
      this.change(() => []);
    }
    handoff(base, reason, stampedCommit) {
      const changes = [];
      const apart = [];
      for (const intent of this.gathered) {
        const { scope, request, text, replaces, follows } = intent;
        const change = {
          scope: [...scope],
          request,
          ...text === void 0 ? {} : { text },
          ...replaces === void 0 ? {} : { replaces },
          ...follows === void 0 ? {} : { follows }
        };
        const candidate = { schema: "sdp-proposal/1", base, reason, changes: [change] };
        const packAllowed = !intent.pack || base === stampedCommit && scope.length > 0 && intent.packMembersComplete !== false && intent.action !== "change-pack" && scope.every(scopeRef);
        if (!base.trim() || !reason.trim() || !packAllowed || proposalProblems(candidate).length)
          apart.push(intent);
        else changes.push(change);
      }
      const proposal = changes.length ? { schema: "sdp-proposal/1", base, reason, changes } : null;
      return {
        proposal,
        memo: proposal === null ? null : renderMemo(proposal),
        apart,
        scopedText: scopedIntentText(apart)
      };
    }
  };

  // src/studio-elements/copy.ts
  async function copyText(text, write, select) {
    if (write) {
      try {
        await write(text);
        return "Copied";
      } catch {
      }
    }
    select(text);
    return "Text selected. Copy it with your keyboard.";
  }
  function registerCopy() {
    class Copy extends globalThis.HTMLElement {
      control;
      selected;
      static get observedAttributes() {
        return ["text", "for"];
      }
      target() {
        const id = this.getAttribute("for");
        if (!id) return void 0;
        return Array.from(this.ownerDocument.querySelectorAll("textarea")).find(
          (area) => area.id === id || area.getAttribute("id") === id
        );
      }
      attributeChangedCallback() {
        const target = this.target();
        const label = target ? Array.from(this.ownerDocument.querySelectorAll("label")).find(
          (label2) => label2.getAttribute("for") === (target.id || target.getAttribute("id"))
        )?.textContent ?? target.getAttribute("aria-label") ?? "text" : this.getAttribute("text") ?? "";
        this.control?.setAttribute("aria-label", `Copy ${label}`);
      }
      connectedCallback() {
        if (this.control) return;
        this.control = button(this, "Copy");
        this.attributeChangedCallback();
        this.control.addEventListener("click", () => {
          const clipboard = this.ownerDocument.defaultView?.navigator.clipboard;
          const write = clipboard === void 0 ? void 0 : (text) => clipboard.writeText(text);
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

  // src/studio-elements/intent-panel-element.ts
  function gatherInPage(host, intent) {
    const panel = host.ownerDocument.querySelector("sdp-intent-panel");
    if (!panel) throw new Error("This page has no composing panel.");
    panel.gather(intent);
  }
  function registerIntentPanel() {
    class Panel extends globalThis.HTMLElement {
      model;
      base = "";
      reason = "";
      observer;
      urls = [];
      refresh = () => {
        this.model?.refresh();
        this.render();
      };
      connectedCallback() {
        if (!this.model) {
          let storage;
          try {
            storage = this.ownerDocument.defaultView?.localStorage;
          } catch {
          }
          this.model = new IntentPanel(
            storage,
            pageRootPath(this.getAttribute("page-root") ?? "./", this.ownerDocument.location.href)
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
      disconnectedCallback() {
        this.ownerDocument.defaultView?.removeEventListener("storage", this.refresh);
        this.ownerDocument.defaultView?.removeEventListener("pageshow", this.refresh);
        this.observer?.disconnect();
        this.releaseUrls();
      }
      gather(intent) {
        this.model?.gather(intent);
        this.render();
        const details = this.querySelector("details");
        if (details) details.open = true;
      }
      releaseUrls() {
        for (const url of this.urls) URL.revokeObjectURL(url);
        this.urls = [];
      }
      render() {
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
        const copied = (text) => {
          void copyText(
            text,
            clipboard ? (value) => clipboard.writeText(value) : void 0,
            (value) => {
              const label = doc.createElement("label");
              label.textContent = "Text to copy";
              const field2 = doc.createElement("textarea");
              field2.readOnly = true;
              field2.value = value;
              label.append(field2);
              body.append(label);
              field2.focus();
              field2.select();
            }
          ).then((message) => {
            output.textContent = message;
          });
        };
        if (this.model.storageProblem) {
          const warning = doc.createElement("p");
          warning.textContent = "Browser storage is unavailable or contains unreadable intents. Copy these intents before leaving the page.";
          body.append(warning);
        }
        if (!this.model.intents.length) {
          const empty = doc.createElement("p");
          empty.textContent = "No gathered intents. Use a composing action beside an entry, example or question.";
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
        const stamped = this.ownerDocument.querySelector("sdp-stamp")?.getAttribute("data-corpus-commit") ?? void 0;
        const field = (labelText, value, onInput) => {
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
        const refreshActions = () => {
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
                "application/json"
              ]
            ];
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

  // src/studio-elements/compose.ts
  var labels = {
    "resolve-question": "Resolve question",
    "promote-question": "Propose decision record",
    "edit-example": "Edit example",
    "propose-example": "Propose example",
    "change-target": "Change target",
    "propose-target": "Propose target",
    "propose-values": "Propose examples for uncovered values",
    "change-entry": "Propose new text"
  };
  function registerCompose() {
    class Compose extends globalThis.HTMLElement {
      control;
      dialog;
      connectedCallback() {
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
      disconnectedCallback() {
        this.dialog?.remove();
      }
      open(action, labelText) {
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
        const scenario = ["edit-example", "propose-example"].includes(action) ? Array.from(doc.querySelectorAll("template[data-scenario-for]")).find(
          (template) => template.getAttribute("data-scenario-for") === scope
        ) : void 0;
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
            "propose-example"
          ].includes(action) ? doc.createElement("textarea") : void 0;
          if (exact) {
            const label = doc.createElement("label");
            label.textContent = "Exact entry text";
            exact.value = this.getAttribute("data-entry-text") ?? "";
            label.append(exact);
            form.append(label);
          }
          const pack = scope.startsWith("pack:") ? scope : void 0;
          let packPart;
          if (pack) {
            const label = doc.createElement("label");
            label.textContent = "Change applies to";
            packPart = doc.createElement("select");
            for (const [value, text] of [
              ["members", "Member Specs"],
              ["pack", "Pack membership or framing"]
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
              ...pack ? { pack, packMembersComplete: this.getAttribute("members-complete") !== "false" } : {},
              ...exact?.value.trim() ? { text: exact.value } : {},
              ...action === "change-entry" && scope.includes("#") ? { replaces: scope } : {}
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
          { once: true }
        );
        doc.body.append(dialog);
        dialog.showModal();
      }
    }
    if (!globalThis.customElements.get("sdp-compose"))
      globalThis.customElements.define("sdp-compose", Compose);
  }

  // src/studio-elements/scenario-editor.ts
  function scenarioText(given, when, then) {
    return [
      ["Given", given],
      ["When", when],
      ["Then", then]
    ].flatMap(
      ([keyword, value]) => (value ?? "").split("\n").filter((line) => line.trim()).map((line) => `${keyword ?? ""} ${line}`)
    ).join("\n");
  }
  function registerScenarioEditor() {
    class ScenarioEditor extends globalThis.HTMLElement {
      initialized = false;
      connectedCallback() {
        if (this.initialized) return;
        this.initialized = true;
        const doc = this.ownerDocument;
        const form = doc.createElement("form");
        const fields = [];
        for (const keyword of ["Given", "When", "Then"]) {
          const label = doc.createElement("label");
          label.textContent = keyword;
          const input = doc.createElement("textarea");
          input.value = this.querySelector(`[data-step="${keyword.toLowerCase()}"]`)?.textContent ?? "";
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
        request.value = this.getAttribute("mode") === "edit" ? "Edit these example steps." : "Propose an example with these steps.";
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
            fields[2]?.value ?? ""
          );
          gatherInPage(this, {
            scope: [this.getAttribute("spec-id") ?? ""],
            action: this.getAttribute("mode") === "edit" ? "edit-example" : "propose-example",
            request: request.value,
            ...text.trim() ? { text } : {}
          });
          this.closest("dialog")?.close();
        });
        this.replaceChildren(form);
      }
    }
    if (!globalThis.customElements.get("sdp-scenario-editor"))
      globalThis.customElements.define("sdp-scenario-editor", ScenarioEditor);
  }

  // src/studio-elements/views.ts
  function registerViews() {
    for (const name of [
      "sdp-spec-card",
      "sdp-maturity-map",
      "sdp-example-space",
      "sdp-trace-graph",
      "sdp-impact-view",
      "sdp-validation-findings"
    ]) {
      if (!globalThis.customElements.get(name))
        globalThis.customElements.define(name, class extends globalThis.HTMLElement {
        });
    }
  }

  // src/studio-elements/diagram.ts
  function zoomViewBox(view, scale, x = view.x + view.width / 2, y = view.y + view.height / 2) {
    const factor = Math.max(0.1, Math.min(10, scale));
    return {
      x: x + (view.x - x) * factor,
      y: y + (view.y - y) * factor,
      width: view.width * factor,
      height: view.height * factor
    };
  }
  function registerDiagram() {
    class Diagram extends globalThis.HTMLElement {
      svg = null;
      original = { x: 0, y: 0, width: 1, height: 1 };
      view = this.original;
      controls = null;
      dragged = false;
      printed;
      beforePrint = () => {
        this.printed ??= this.view;
        this.view = this.original;
        this.draw();
      };
      afterPrint = () => {
        if (this.printed) {
          this.view = this.printed;
          this.printed = void 0;
          this.draw();
        }
      };
      pointers = /* @__PURE__ */ new Map();
      draw() {
        this.svg?.setAttribute(
          "viewBox",
          `${String(this.view.x)} ${String(this.view.y)} ${String(this.view.width)} ${String(this.view.height)}`
        );
      }
      zoom(scale) {
        this.view = zoomViewBox(this.view, scale);
        this.draw();
      }
      connectedCallback() {
        if (this.controls) return;
        this.svg = this.querySelector("svg");
        if (!this.svg) return;
        const box = this.svg.viewBox.baseVal;
        this.original = { x: box.x, y: box.y, width: box.width, height: box.height };
        this.view = this.original;
        this.controls = this.ownerDocument.createElement("div");
        this.controls.className = "diagram-controls";
        this.controls.setAttribute("role", "group");
        this.controls.setAttribute("aria-label", "Diagram view");
        for (const [label, action] of [
          [
            "Zoom in",
            () => {
              this.zoom(0.8);
            }
          ],
          [
            "Zoom out",
            () => {
              this.zoom(1.25);
            }
          ],
          [
            "Reset",
            () => {
              this.view = this.original;
              const viewport = this.querySelector(".diagram-scroll");
              if (viewport) {
                viewport.scrollLeft = 0;
                viewport.scrollTop = 0;
              }
              this.draw();
            }
          ]
        ]) {
          const control = button(this, label);
          control.addEventListener("click", action);
          this.controls.append(control);
        }
        this.querySelector("figcaption")?.after(this.controls);
        this.svg.style.touchAction = "none";
        this.ownerDocument.defaultView?.addEventListener("beforeprint", this.beforePrint);
        this.ownerDocument.defaultView?.addEventListener("afterprint", this.afterPrint);
        this.svg.addEventListener("click", this.handleClick);
        this.svg.addEventListener("pointerdown", this.down);
        this.svg.addEventListener("pointermove", this.move);
        this.svg.addEventListener("pointerup", this.up);
        this.svg.addEventListener("pointercancel", this.up);
        this.svg.addEventListener("wheel", this.wheel, { passive: false });
      }
      down = (e) => {
        if (e.button !== 0) return;
        if (this.pointers.size === 0) this.dragged = false;
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      };
      up = (e) => {
        this.pointers.delete(e.pointerId);
        if (this.pointers.size === 0)
          queueMicrotask(() => {
            this.dragged = false;
          });
      };
      move = (e) => {
        const before = this.pointers.get(e.pointerId), svg = this.svg;
        if (!before || !svg) return;
        const rect = svg.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        if (Math.hypot(e.clientX - before.x, e.clientY - before.y) > 3) this.dragged = true;
        if (!this.dragged && this.pointers.size < 2) return;
        svg.setPointerCapture(e.pointerId);
        const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)?.[1];
        if (other) {
          const oldDistance = Math.hypot(before.x - other.x, before.y - other.y), distance = Math.hypot(e.clientX - other.x, e.clientY - other.y);
          if (distance > 0 && oldDistance > 0) this.zoom(oldDistance / distance);
        } else
          this.view = {
            ...this.view,
            x: this.view.x - (e.clientX - before.x) * this.view.width / rect.width,
            y: this.view.y - (e.clientY - before.y) * this.view.height / rect.height
          };
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        this.draw();
      };
      handleClick = (event) => {
        if (this.dragged) event.preventDefault();
      };
      wheel = (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? 1.1 : 1 / 1.1);
      };
      disconnectedCallback() {
        this.ownerDocument.defaultView?.removeEventListener("beforeprint", this.beforePrint);
        this.ownerDocument.defaultView?.removeEventListener("afterprint", this.afterPrint);
        this.afterPrint();
        this.svg?.removeEventListener("click", this.handleClick);
        this.svg?.removeEventListener("pointerdown", this.down);
        this.svg?.removeEventListener("pointermove", this.move);
        this.svg?.removeEventListener("pointerup", this.up);
        this.svg?.removeEventListener("pointercancel", this.up);
        this.svg?.removeEventListener("wheel", this.wheel);
        if (this.svg) this.svg.style.touchAction = "";
        this.pointers.clear();
        this.controls?.remove();
        this.controls = null;
      }
    }
    if (!globalThis.customElements.get("sdp-diagram"))
      globalThis.customElements.define("sdp-diagram", Diagram);
  }

  // src/studio-elements/expander.ts
  var sourceDisclosure = 'sdp-diagram details[id$=".source"], sdp-maturity-map details[id$=".source"]';
  function fragmentTarget(fragment) {
    if (fragment.length < 2) return null;
    try {
      return decodeURIComponent(fragment.slice(1));
    } catch {
      return null;
    }
  }
  function registerExpander() {
    class Expander extends globalThis.HTMLElement {
      initialized = false;
      printed = [];
      beforePrint = () => {
        if (this.printed.length) return;
        this.printed = Array.from(this.querySelectorAll("details")).filter((details) => !details.matches(sourceDisclosure)).map((details) => ({
          details,
          open: details.open
        }));
        for (const { details } of this.printed) details.open = true;
      };
      afterPrint = () => {
        for (const { details, open } of this.printed) details.open = open;
        this.printed = [];
      };
      reveal = () => {
        const id = fragmentTarget(this.ownerDocument.location.hash);
        const target = id === null ? null : this.ownerDocument.getElementById(id);
        if (!target || !this.contains(target)) return;
        for (const details of Array.from(this.querySelectorAll("details"))) {
          if (details.contains(target)) details.open = true;
        }
        target.scrollIntoView();
        liveOutput(this).textContent = `Opened ${id ?? "entry"}`;
      };
      setOpen(open) {
        const details = Array.from(this.querySelectorAll("details"));
        for (const panel of details) panel.open = open;
        liveOutput(this).textContent = `${open ? "Opened" : "Closed"} ${String(details.length)} panels`;
      }
      connectedCallback() {
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
      disconnectedCallback() {
        this.ownerDocument.defaultView?.removeEventListener("hashchange", this.reveal);
        this.ownerDocument.defaultView?.removeEventListener("beforeprint", this.beforePrint);
        this.ownerDocument.defaultView?.removeEventListener("afterprint", this.afterPrint);
        this.afterPrint();
      }
    }
    if (!globalThis.customElements.get("sdp-expander"))
      globalThis.customElements.define("sdp-expander", Expander);
  }

  // src/studio-elements/filter.ts
  function rowMatches(row, filters) {
    return Object.entries(filters).every(
      ([name, chosen]) => chosen === "any" || (row[name] ?? "").split(/\s+/u).includes(chosen)
    );
  }
  function epicFilter(href, epics) {
    const values = new URL(href).searchParams.getAll("epic");
    if (values.length === 0) return { value: "any", unknown: false };
    const value = values[0] ?? "";
    if (values.length !== 1 || value !== "none" && !epics.includes(value))
      return { value: "any", unknown: true };
    return { value, unknown: false };
  }
  function registerFilter() {
    class Filter extends globalThis.HTMLElement {
      update = () => {
        const filters = Object.fromEntries(
          Array.from(this.querySelectorAll("select[data-filter]"), (select) => [
            select.getAttribute("data-filter") ?? "",
            select.value
          ])
        );
        const rows = Array.from(this.querySelectorAll("[data-row]"));
        for (const row of rows) {
          const values = Object.fromEntries(
            Object.keys(filters).map((name) => [name, row.getAttribute(`data-${name}`) ?? ""])
          );
          row.hidden = !rowMatches(values, filters);
        }
        liveOutput(this).textContent = `${String(rows.filter((row) => !row.hidden).length)} of ${String(rows.length)} shown`;
      };
      // A link or fragment that targets a row this filter hides clears every choice, so the
      // linked row shows; the expander opens its disclosures.
      showTarget = (id) => {
        const target = id === null ? null : this.ownerDocument.getElementById(id);
        if (!target || !this.contains(target) || !target.closest("[data-row]")?.hidden)
          return;
        for (const select of Array.from(
          this.querySelectorAll("select[data-filter]")
        ))
          select.value = "any";
        this.update();
        const output = liveOutput(this);
        output.textContent = `${output.textContent}; the filter was cleared to show ${id ?? "the linked entry"}`;
        target.scrollIntoView();
      };
      hashChange = () => {
        this.showTarget(fragmentTarget(this.ownerDocument.location.hash));
      };
      linkClick = (event) => {
        const link2 = event.target?.closest("a[href]");
        const href = link2?.getAttribute("href") ?? "";
        if (href.startsWith("#")) this.showTarget(fragmentTarget(href));
      };
      connectedCallback() {
        const form = this.querySelector("form");
        if (form) {
          form.hidden = false;
          form.addEventListener("submit", this.preventSubmit);
        }
        const epic = this.querySelector('select[data-filter="epic"]');
        if (epic) {
          const requested = epicFilter(
            this.ownerDocument.location.href,
            Array.from(epic.options).map((o) => o.value).filter((v) => v !== "any" && v !== "none")
          );
          epic.value = requested.value;
          const note = this.querySelector("[data-filter-note]");
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
      change = () => {
        const note = this.querySelector("[data-filter-note]");
        if (note) note.textContent = "";
        this.update();
      };
      reset = () => {
        queueMicrotask(() => {
          for (const select of Array.from(
            this.querySelectorAll("select[data-filter]")
          ))
            select.value = "any";
          const note = this.querySelector("[data-filter-note]");
          if (note) note.textContent = "";
          this.update();
        });
      };
      preventSubmit = (event) => {
        event.preventDefault();
      };
      disconnectedCallback() {
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

  // src/studio-elements/search.ts
  function searchFragment(term) {
    return `#q=${encodeURIComponent(term)}`;
  }
  function searchTerm(fragment) {
    if (!fragment.startsWith("#q=")) return "";
    try {
      return decodeURIComponent(fragment.slice(3));
    } catch {
      return "";
    }
  }
  function searchUrl(root, term) {
    return `${root}search.html${searchFragment(term)}`;
  }
  function registerSearch() {
    class Search extends globalThis.HTMLElement {
      submit = (event) => {
        event.preventDefault();
        const input = this.querySelector(
          'input[name="q"], input[type="search"], input[type="text"], input:not([type])'
        );
        this.ownerDocument.defaultView?.location.assign(
          searchUrl(this.getAttribute("page-root") ?? "", input?.value ?? "")
        );
      };
      connectedCallback() {
        this.addEventListener("submit", this.submit);
      }
      disconnectedCallback() {
        this.removeEventListener("submit", this.submit);
      }
    }
    if (!globalThis.customElements.get("sdp-search"))
      globalThis.customElements.define("sdp-search", Search);
  }

  // src/reader/concept-match.ts
  function compare(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  function contains(value, needle, includeKeys) {
    if (typeof value === "string") return value.toLowerCase().includes(needle);
    if (Array.isArray(value))
      return value.some((entry) => contains(entry, needle, includeKeys));
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).some(
        ([key, entry]) => includeKeys && key.toLowerCase().includes(needle) || contains(entry, needle, includeKeys)
      );
    }
    return false;
  }
  function matchConcept(records, term) {
    const needle = term.toLowerCase().trim();
    if (needle.length === 0) return [];
    const fieldRank = {
      id: 0,
      title: 1,
      label: 2,
      framing: 3,
      narrative: 4
    };
    const matches = [];
    for (const node of [...records].sort((a, b) => compare(a.id, b.id))) {
      const matchedIn = [];
      if (node.id.toLowerCase().includes(needle)) matchedIn.push("id");
      if (node.nodeType === "Primitive" || node.nodeType === "Pack") {
        if (node.title?.toLowerCase().includes(needle)) matchedIn.push("title");
      } else if (node.label?.toLowerCase().includes(needle)) matchedIn.push("label");
      if (node.nodeType === "Pack" && node.framing?.toLowerCase().includes(needle))
        matchedIn.push("framing");
      if (node.nodeType === "Primitive") {
        if (node.narrative?.toLowerCase().includes(needle)) matchedIn.push("narrative");
        for (const [name, content] of Object.entries(node.sections ?? {}).sort(
          ([a], [b]) => compare(a, b)
        )) {
          if (contains(content, needle, name === "model")) matchedIn.push(`sections.${name}`);
        }
      }
      if (matchedIn.length === 0) continue;
      matches.push({
        match: {
          id: node.id,
          nodeType: node.nodeType,
          ...(node.nodeType === "Primitive" || node.nodeType === "Pack") && node.title !== void 0 ? { title: node.title } : {},
          matchedIn
        },
        rank: Math.min(...matchedIn.map((field) => fieldRank[field] ?? 4))
      });
    }
    return matches.sort((a, b) => a.rank - b.rank || compare(a.match.id, b.match.id)).map(({ match }) => match);
  }

  // src/projections/studio/paths.ts
  function pagePath(id) {
    const namespace = id.startsWith("spec:") ? "specs" : id.startsWith("pack:") ? "packs" : null;
    if (namespace === null) return null;
    const name = id.slice(id.indexOf(":") + 1).replace(/[A-Z]/gu, (letter) => `_${letter.toLowerCase()}`);
    return `${namespace}/${name}.html`;
  }

  // src/studio-elements/search-results.ts
  var tokensOf = (text) => text.replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2").replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 0);
  function hasTokens(text, wanted) {
    const tokens = tokensOf(text);
    return wanted.length > 0 && tokens.some(
      (_token, start) => wanted.every((token, offset) => tokens[start + offset] === token)
    );
  }
  function stringEntries(record) {
    const strings = /* @__PURE__ */ new Set();
    for (const [section, content] of Object.entries(record.sections ?? {})) {
      const walk = (value, path) => {
        if (typeof value === "string") strings.add(JSON.stringify([section, path, value]));
        else if (Array.isArray(value))
          value.forEach((item, i) => {
            walk(item, `${path ?? ""}[${String(i)}]`);
          });
        else if (typeof value === "object" && value !== null)
          for (const [key, item] of Object.entries(value))
            walk(item, path === null ? key : `${path}.${key}`);
      };
      walk(content, null);
    }
    return strings;
  }
  function matchesEntry(entry, wanted, strings) {
    return entry.key !== null && hasTokens(entry.key, wanted) || entry.section === "model" && entry.address?.includes("#term.") === true && hasTokens(entry.address.split("#term.")[1] ?? "", wanted) || (entry.section === "narrative" || strings.has(JSON.stringify([entry.section, entry.entry, entry.text]))) && hasTokens(entry.text, wanted);
  }
  function searchRecords(index, term) {
    const needle = term.toLowerCase().trim();
    if (needle.length === 0) return [];
    const wanted = tokensOf(term);
    const concepts = matchConcept(index.records, term);
    const byId = new Map(index.records.map((record) => [record.id, record]));
    const conceptIds = new Set(concepts.map((hit) => hit.id));
    const makeHit = (record, fields) => {
      const strings = stringEntries(record);
      const entries = record.nodeType === "Primitive" ? record.entries.filter((entry) => matchesEntry(entry, wanted, strings)) : [];
      const matchedIn = [...fields];
      if (record.entries.some(
        (entry) => entry.key !== null && (entry.key.toLowerCase().includes(needle) || hasTokens(entry.key, wanted))
      ))
        matchedIn.push("key");
      if (record.file?.toLowerCase().includes(needle)) matchedIn.push("file");
      if (matchedIn.length === 0)
        for (const entry of entries) {
          const field = entry.section === "narrative" ? "narrative" : `sections.${entry.section}`;
          if (!matchedIn.includes(field)) matchedIn.push(field);
        }
      return {
        record,
        matchedIn,
        entries
      };
    };
    const base = concepts.flatMap((hit) => {
      const record = byId.get(hit.id);
      return record === void 0 ? [] : [makeHit(record, hit.matchedIn)];
    });
    const added = index.records.filter((record) => !conceptIds.has(record.id)).map((record) => makeHit(record, [])).filter((hit) => hit.matchedIn.length > 0).sort((a, b) => a.record.id < b.record.id ? -1 : a.record.id > b.record.id ? 1 : 0);
    return [...base, ...added];
  }
  function entryUrl(record, entry) {
    const fragment = entry.address?.split("#")[1] ?? (entry.section === "narrative" ? "narrative" : `section.${entry.section}`);
    return `${record.page ?? ""}#${fragment}`;
  }
  function resultPage(hits, limit) {
    const shown = hits.slice(0, limit);
    return {
      shown,
      total: hits.length,
      entryTotal: hits.reduce((count, hit) => count + hit.entries.length, 0),
      remaining: hits.length - shown.length
    };
  }
  var fieldsSearched = "Fields searched: ids, titles, labels, Pack framing, Spec narrative and sections, coined keys, recorded file paths.";
  var nodeWords = { Primitive: "Spec", Pack: "Pack", Anchor: "Anchor", CodeNode: "Code unit" };
  var link = (url, label, htmlLabel = escapeHtml(label)) => `<a href="${escapeHtml(url)}">${htmlLabel}</a>`;
  var plural = (n, singular, plural2 = `${singular}s`) => `${String(n)} ${n === 1 ? singular : plural2}`;
  var sectionTitle = (name) => name === "ui" ? "UI" : name.charAt(0).toUpperCase() + name.slice(1);
  function fieldLabel(field) {
    if (field.startsWith("sections.")) return `the ${sectionTitle(field.slice(9))} section`;
    return {
      key: "a coined key",
      file: "the file path",
      framing: "Pack framing",
      narrative: "narrative",
      id: "id",
      title: "title",
      label: "label"
    }[field] ?? field;
  }
  function sourceMark(file, line) {
    if (file === void 0 || line === void 0) return "";
    const value = `${file}:${String(line)}`;
    return `<code data-source-file="${escapeHtml(file)}" data-source-line="${String(line)}">${escapeHtml(value)}</code> <sdp-copy text="${escapeHtml(value)}"></sdp-copy>`;
  }
  function excerpt(text, term) {
    if (text.length <= 180) return text;
    const at = text.toLowerCase().indexOf(term.toLowerCase().trim());
    const start = at < 60 ? 0 : text.lastIndexOf(" ", at - 60) + 1;
    const boundary = text.indexOf(" ", start + 180);
    const end = boundary < 0 ? text.length : boundary;
    return `${start > 0 ? "\u2026" : ""}${text.slice(start, end).trimEnd()}${end < text.length ? "\u2026" : ""}`;
  }
  function renderResults(hits, term, limit) {
    const page = resultPage(hits, limit);
    if (term.trim().length === 0) return `<p>Type a word to search.</p><p>${fieldsSearched}</p>`;
    if (hits.length === 0)
      return `<p>No node matches ${escapeHtml(term)}</p><p>${fieldsSearched}</p>`;
    const header = `<p><code>${escapeHtml(term)}</code>: ${plural(page.total, "node")} and ${plural(page.entryTotal, "entry", "entries")} match. ${fieldsSearched}</p>`;
    return header + page.shown.map(({ record, matchedIn, entries }) => {
      const heading = record.title ?? record.label ?? record.id;
      const title = record.page === null ? codeSpans(heading) : link(record.page, heading, codeSpans(heading));
      const descriptor = record.nodeType === "Primitive" ? `<p>Spec \xB7 ${escapeHtml(record.specKind ?? "")} \xB7 stated ${escapeHtml(record.statedReadiness ?? "unknown")} \xB7 floor ${escapeHtml(record.floorReached ?? "none")}</p>` : `<p>${nodeWords[record.nodeType]}</p>`;
      const location = record.file === void 0 ? "" : `${record.file}${record.line === void 0 ? "" : `:${String(record.line)}`}`;
      const unit = record.nodeType === "Anchor" || record.nodeType === "CodeNode" ? `<p>${record.line === void 0 ? `${escapeHtml(location)} <sdp-copy text="${escapeHtml(location || record.id)}"></sdp-copy>` : sourceMark(record.file, record.line)}</p><ul>${record.bindings.map((binding) => `<li>${escapeHtml(binding.edge)} ${link(pagePath(binding.specId) ?? "", binding.specId)}</li>`).join("")}</ul>` : "";
      const entryList = entries.length === 0 ? "" : `<ul class="search-entries">${entries.map((entry) => `<li>${link(entryUrl(record, entry), entry.key ?? entry.entry ?? entry.section, `<code>${escapeHtml(entry.key ?? entry.entry ?? entry.section)}</code>`)} \xB7 ${escapeHtml(sectionTitle(entry.section))} \xB7 ${entry.line === null ? "line not recorded" : `line ${String(entry.line)} ${sourceMark(record.file, entry.line)}`} \xB7 ${escapeHtml(excerpt(entry.text, term))}</li>`).join("")}</ul>`;
      return `<article class="search-result"><h2>${title}</h2><code>${escapeHtml(record.id)}</code>${descriptor}<p>Matched in: ${escapeHtml(matchedIn.map(fieldLabel).join(", "))}</p>${unit}${entryList}</article>`;
    }).join("");
  }
  function registerSearchResults() {
    class SearchResults extends globalThis.HTMLElement {
      index = { records: [] };
      term = "";
      limit = 50;
      input;
      results;
      more;
      status;
      onInput = () => {
        this.setTerm(this.input?.value ?? "", true);
      };
      onHash = () => {
        this.setTerm(searchTerm(this.ownerDocument.location.hash), false);
      };
      setTerm(term, updateFragment) {
        this.term = term;
        this.limit = 50;
        if (this.input) this.input.value = term;
        if (updateFragment)
          this.ownerDocument.defaultView?.history.replaceState(null, "", searchFragment(term));
        this.render();
      }
      render() {
        const hits = searchRecords(this.index, this.term);
        const page = resultPage(hits, this.limit);
        if (this.results) this.results.innerHTML = renderResults(hits, this.term, this.limit);
        if (this.more) this.more.hidden = page.remaining === 0;
        if (this.status) {
          this.status.textContent = this.term.trim().length === 0 ? "Type a word to search." : hits.length === 0 ? `No node matches ${this.term}` : `Showing ${String(page.shown.length)} of ${plural(page.total, "node")}`;
          this.status.className = page.total > 50 ? "" : "visually-hidden";
        }
      }
      connectedCallback() {
        try {
          const data = JSON.parse(
            this.ownerDocument.getElementById("sdp-data")?.textContent ?? "{}"
          );
          this.index = Array.isArray(data.records) ? data : { records: [] };
        } catch {
          this.index = { records: [] };
        }
        if (!this.results) {
          this.input = this.ownerDocument.querySelector('sdp-search input[name="q"]') ?? void 0;
          const form = this.input ? void 0 : this.ownerDocument.createElement("form");
          if (form) {
            const label = this.ownerDocument.createElement("label");
            label.textContent = "Search the corpus ";
            this.input = this.ownerDocument.createElement("input");
            this.input.type = "search";
            this.input.name = "q";
            label.append(this.input);
            const submit = button(this, "Search");
            submit.type = "submit";
            form.append(label, submit);
            form.addEventListener("submit", (event) => {
              event.preventDefault();
              this.setTerm(this.input?.value ?? "", true);
            });
          }
          this.results = this.ownerDocument.createElement("div");
          this.results.className = "search-results";
          this.more = button(this, "Show next fifty");
          this.more.addEventListener("click", () => {
            this.limit += 50;
            this.render();
          });
          this.replaceChildren(...form ? [form] : []);
          this.status = liveOutput(this);
          this.append(this.results, this.more);
        }
        this.input?.addEventListener("input", this.onInput);
        this.ownerDocument.defaultView?.addEventListener("hashchange", this.onHash);
        this.onHash();
      }
      disconnectedCallback() {
        this.input?.removeEventListener("input", this.onInput);
        this.ownerDocument.defaultView?.removeEventListener("hashchange", this.onHash);
      }
    }
    if (!globalThis.customElements.get("sdp-search-results"))
      globalThis.customElements.define("sdp-search-results", SearchResults);
  }

  // src/studio-elements/stamp.ts
  function stampUrl(protocol, root) {
    return protocol === "http:" || protocol === "https:" ? `${root}stamp.json` : null;
  }
  function stampText(stamp) {
    if (typeof stamp !== "object" || stamp === null) return "";
    const value = stamp;
    if (typeof value.corpusCommit !== "string" || typeof value.engine !== "string" || typeof value.builtAt !== "string")
      return "";
    return `Corpus ${value.corpusCommit} \xB7 ${value.engine} \xB7 Built ${value.builtAt}`;
  }
  function sourceUrl(template, file, line) {
    if (!template.includes("{file}")) return null;
    const value = template.replaceAll("{file}", file.split("/").map(encodeURIComponent).join("/")).replaceAll("{line}", encodeURIComponent(line));
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }
  function registerStamp() {
    class Stamp extends globalThis.HTMLElement {
      generation = 0;
      observer;
      connectedCallback() {
        const generation = ++this.generation;
        this.observer?.disconnect();
        const url = stampUrl(
          this.ownerDocument.location.protocol,
          this.getAttribute("page-root") ?? ""
        );
        this.textContent = "";
        if (url === null) return;
        void globalThis.fetch(url).then(async (response) => {
          if (!response.ok) return;
          const data = await response.json();
          if (generation !== this.generation || !this.isConnected) return;
          this.textContent = stampText(data);
          if (!this.textContent || typeof data !== "object" || data === null) return;
          const stamp = data;
          if (typeof stamp.corpusCommit === "string")
            this.setAttribute("data-corpus-commit", stamp.corpusCommit);
          if (typeof stamp.source !== "string") return;
          const template = stamp.source;
          const linkSources = () => {
            for (const element of Array.from(
              this.ownerDocument.querySelectorAll("code[data-source-file][data-source-line]")
            )) {
              if (element.parentElement?.tagName === "A") continue;
              const url2 = sourceUrl(
                template,
                element.getAttribute("data-source-file") ?? "",
                element.getAttribute("data-source-line") ?? ""
              );
              if (url2 === null) continue;
              const link2 = this.ownerDocument.createElement("a");
              link2.setAttribute("href", url2);
              element.replaceWith(link2);
              link2.appendChild(element);
            }
          };
          linkSources();
          if (typeof globalThis.MutationObserver === "function") {
            this.observer = new globalThis.MutationObserver(linkSources);
            this.observer.observe(this.ownerDocument.body, { childList: true, subtree: true });
          }
        }).catch(() => {
        });
      }
      disconnectedCallback() {
        this.generation++;
        this.observer?.disconnect();
      }
    }
    if (!globalThis.customElements.get("sdp-stamp"))
      globalThis.customElements.define("sdp-stamp", Stamp);
  }

  // src/studio-elements/index.ts
  registerSearch();
  registerSearchResults();
  registerFilter();
  registerExpander();
  registerCopy();
  registerStamp();
  registerDiagram();
  registerViews();
  registerIntentPanel();
  registerScenarioEditor();
  registerCompose();
})();

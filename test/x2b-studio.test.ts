import { runInNewContext } from "node:vm";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, expect, it } from "vitest";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { architectureDiagrams } from "../src/projections/studio/diagrams/architecture.js";
import { packExport } from "../src/projections/studio/pages/export-page.js";
import { IntentPanel } from "../src/studio-elements/intent-panel.js";
import { carrier, probe, put } from "./helpers/vault-probe.js";
import { renderStudio } from "./helpers/studio-render.js";
import { studioDom } from "./helpers/studio-dom.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-x2b-studio-"));
  roots.push(root);
  probe(root);
  return root;
}
async function pages(root: string) {
  return renderStudio(await createStudioData(createReader(extract({ root }).graph)));
}
function required<T>(value: T | null | undefined): T {
  if (value === undefined || value === null) throw new Error("Missing fixture value");
  return value;
}
function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

it("retains the linked SVG box geometry and label when its target leaves the export", () => {
  const pack = required(createReader(extract({ root: fixture() }).graph).packContext("pack:probe"));
  const shape = '<rect x="4" y="8" width="90" height="20"></rect><text>Outside box</text>';
  const html = packExport(
    pack,
    [
      {
        path: "packs/probe.html",
        content: `<main id="main"><svg><a href="../specs/outside.html">${shape}</a></svg></main>`,
      },
    ],
    "",
  ).content;
  expect(html).toContain(`<svg><g>${shape}</g></svg>`);
  expect(html).not.toContain("<svg><code>");
});

it("renders export member pages from the graph alone with meaningful base and run inputs", async () => {
  const root = fixture();
  put(
    join(root, "test/member.test.ts"),
    "/**\n * @sdpAnchor test:probe.member\n * @sdpVerifies spec:probe.member\n */\nexport const member = true;\n",
  );
  const base = extract({ root }).graph;
  put(join(root, "member.sdp.md"), carrier("spec:probe.member", "New title"));
  const reader = createReader(extract({ root }).graph);
  const report = {
    reportFormat: "CTRF",
    specVersion: "0.0.0",
    results: {
      tool: { name: "x2b-runner" },
      environment: { commit: "external-commit" },
      summary: {
        tests: 1,
        passed: 1,
        failed: 0,
        skipped: 0,
        pending: 0,
        other: 0,
        start: 1000,
        stop: 2000,
      },
      tests: [{ name: "member", status: "passed", duration: 1, filePath: "test/member.test.ts" }],
    },
  };
  const plain = renderStudio(await createStudioData(reader));
  const enriched = renderStudio(
    await createStudioData(reader, undefined, {
      base: { graph: base, label: "earlier-design" },
      runs: [report],
    }),
  );
  const member = required(enriched.find((p) => p.path === "specs/probe.member.html")).content;
  expect(member).toContain("earlier-design");
  expect(member).toContain("data-run-result");
  for (const result of [plain, enriched]) {
    const exported = required(result.find((p) => p.path === "exports/probe.html")).content;
    expect(exported).toContain("<p><code>pack:probe</code></p>");
    expect(exported).not.toMatch(/<code>\.\.\//u);
  }
  expect(required(enriched.find((p) => p.path === "exports/probe.html")).content).toBe(
    required(plain.find((p) => p.path === "exports/probe.html")).content,
  );
});

it("draws no edge to an undrawn planned-use target", async () => {
  const root = fixture();
  put(
    join(root, "plan.sdp.md"),
    carrier(
      "spec:probe.plan",
      "Planned",
      "behavior",
      "idea",
      "\n## Design\n- id: component:probe.planned\n- context: core\n- layer: domain\n- uses: component:probe.absent\n",
    ),
  );
  const html = required((await pages(root)).find((p) => p.path === "architecture.html")).content;
  expect(html).toContain('data-id="component:probe.planned"');
  expect(html).not.toContain("component:probe.planned plans to use component:probe.absent");
  expect(html).not.toContain('data-to="component:probe.absent"');
});

it("targets each folded context box at its detailed drawing", () => {
  const result = architectureDiagrams({
    boxes: Array.from({ length: 42 }, (_, i) => ({
      id: `component:probe.c${String(i)}`,
      words: "Component",
      context: i < 21 ? "first" : "second",
      layer: "domain",
      target: "#main",
    })),
    edges: [],
  });
  expect(result.fold).toBe("context");
  expect(result.drawings[0]?.boxes.map((b) => b.target)).toEqual([
    "#context.first",
    "#context.second",
  ]);
  for (const box of required(result.drawings[0]).boxes)
    expect(result.drawings.some((d) => `#${d.subject}` === box.target)).toBe(true);
});

it("puts the resolved rendered members on the Pack page composing action", async () => {
  const html = required(
    (await pages(fixture())).find((p) => p.path === "packs/probe.html"),
  ).content;
  const attrs = required(/<sdp-compose scope="pack:probe"[^>]*>/u.exec(html)?.[0]);
  expect(attrs).toContain('members="spec:probe.member spec:probe.other"');
});

it("keeps a Pack request with an unresolved member as scoped intent text", async () => {
  const root = fixture();
  put(
    join(root, "probe.pack.sdp.md"),
    "---\nid: pack:probe\nspecs: [spec:probe.member, spec:probe.missing]\n---\n# Probe\n",
  );
  const html = required((await pages(root)).find((p) => p.path === "packs/probe.html")).content;
  const tag = required(/<sdp-compose scope="pack:probe"[^>]*>/u.exec(html)?.[0]);
  expect(tag).toContain('members="spec:probe.member"');
  const saved = storage();
  const dom = studioDom(resolve("dist/studio/studio.js"), "https://studio.test/index.html", saved);
  dom.mount("sdp-intent-panel", { "page-root": "./" });
  const attrs = Object.fromEntries(
    [...tag.matchAll(/([\w-]+)="([^"]*)"/gu)].map((m) => [required(m[1]), required(m[2])]),
  );
  const compose = dom.mount("sdp-compose", attrs);
  compose.querySelector("button")?.dispatch("click");
  const dialog = required(dom.doc.querySelector("dialog"));
  required(dialog.querySelector("textarea")).value = "Read this request";
  dialog.querySelector("form")?.dispatch("submit");
  const result = new IntentPanel(saved, "/").handoff("abc", "Review", "abc");
  expect(result.proposal).toBeNull();
  expect(result.apart).toHaveLength(1);
  expect(result.scopedText).toContain("Read this request");
});

it("keys and names each design planning the same unanchored component", async () => {
  const root = fixture();
  for (const name of ["one", "two"])
    put(
      join(root, `${name}.sdp.md`),
      carrier(
        `spec:probe.${name}`,
        `Plan ${name}`,
        "behavior",
        "idea",
        "\n## Design\n- id: component:probe.planned\n- context: core\n- layer: domain\n",
      ),
    );
  const html = required((await pages(root)).find((p) => p.path === "architecture.html")).content;
  expect(html.match(/data-id="component:probe.planned"/gu) ?? []).toHaveLength(0);
  for (const name of ["one", "two"]) {
    expect(html).toContain(`data-id="spec:probe.${name}"`);
    expect(html).toContain(`component:probe.planned, planned by spec:probe.${name}`);
  }
});

it("draws planned uses to every design of the named component and names the component in text", async () => {
  const root = fixture();
  for (const name of ["one", "two", "three"])
    put(
      join(root, `${name}.sdp.md`),
      carrier(
        `spec:probe.${name}`,
        `Plan ${name}`,
        "behavior",
        "idea",
        `\n## Design\n- id: component:probe.${name === "three" ? "user" : "planned"}\n- context: core\n- layer: domain\n${name === "three" ? "- uses: component:probe.planned\n" : ""}`,
      ),
    );
  const html = required((await pages(root)).find((p) => p.path === "architecture.html")).content;
  for (const name of ["one", "two"]) {
    expect(html).toContain(
      `data-from="component:probe.user" data-to="spec:probe.${name}" data-kind="plans to use"`,
    );
    expect(html).toContain(
      `component:probe.user plans to use component:probe.planned (planned by spec:probe.${name})`,
    );
  }
  expect(html.match(/data-kind="plans to use"/gu)).toHaveLength(2);
  expect(html.match(/stroke-dasharray="6 4" marker-end/gu)).toHaveLength(2);
  expect(html).not.toContain("component:probe.user plans to use spec:probe.");
});

it("prints a diagram whole and restores its zoom after printing", () => {
  const events = new Map<string, () => void>();
  const definitions = new Map<string, new () => Element>();
  class Element {
    textContent = "";
    className = "";
    type = "";
    style = { touchAction: "" };
    attributes = new Map<string, string>();
    listeners = new Map<string, () => void>();
    children: Element[] = [];
    ownerDocument = {
      createElement: () => new Element(),
      defaultView: {
        addEventListener: (name: string, fn: () => void) => events.set(name, fn),
        removeEventListener: (name: string) => events.delete(name),
      },
    };
    viewBox = { baseVal: { x: 0, y: 0, width: 1000, height: 500 } };
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    }
    addEventListener(name: string, fn: () => void) {
      this.listeners.set(name, fn);
    }
    removeEventListener(name: string) {
      this.listeners.delete(name);
    }
    append(child: Element) {
      this.children.push(child);
    }
    after(child: Element) {
      this.children.push(child);
    }
    remove() {
      /* This stand-in has no document parent. */
    }
    querySelector(name: string) {
      return name === "svg" ? svg : name === "figcaption" ? caption : null;
    }
  }
  const svg = new Element(),
    caption = new Element();
  runInNewContext(readFileSync(resolve("dist/studio/studio.js"), "utf8"), {
    HTMLElement: Element,
    customElements: {
      get: (name: string) => definitions.get(name),
      define: (name: string, ctor: new () => Element) => definitions.set(name, ctor),
    },
  });
  const Constructor = required(definitions.get("sdp-diagram"));
  const host = new Constructor();
  host.connectedCallback?.();
  const controls = required(caption.children[0]);
  required(controls.children.find((c) => c.textContent === "Zoom in")).listeners.get("click")?.();
  expect(svg.attributes.get("viewBox")).toBe("100 50 800 400");
  required(events.get("beforeprint"))();
  required(events.get("beforeprint"))();
  expect(svg.attributes.get("viewBox")).toBe("0 0 1000 500");
  required(events.get("afterprint"))();
  expect(svg.attributes.get("viewBox")).toBe("100 50 800 400");
  host.disconnectedCallback?.();
  expect(events.size).toBe(0);
});

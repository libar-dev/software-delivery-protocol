import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import postcss from "postcss";
import { evaluateBody } from "../src/reader/evaluate-body.js";
import { specTest, testAnchorId, ref } from "../src/anchors.js";
import { schemaVersion } from "../src/graph/schema.js";
import type { GraphSchema, PrimitiveNode } from "../src/graph/schema.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";
import {
  capabilityDiagrams,
  capabilityWalk,
} from "../src/projections/studio/diagrams/capability.js";
import type { CapabilityMap } from "../src/projections/studio/diagrams/capability.js";
import { renderDiagram } from "../src/projections/studio/diagrams/svg.js";
import { mermaidSource } from "../src/projections/studio/diagrams/mermaid.js";
import { rowMatches, epicFilter } from "../src/studio-elements/filter.js";

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Missing test value");
  return value;
}

const spec = (id: string, changes: Partial<PrimitiveNode> = {}): PrimitiveNode => ({
  id: `spec:probe.${id}`,
  file: "design/probe.sdp.md",
  nodeType: "Primitive",
  claim: "declared",
  title: `Title ${id}`,
  specKind: "behavior",
  altitude: "story",
  readiness: "scoped",
  deliveryFacts: [],
  sections: {
    intent: {
      outcome: "Read a capability",
      openQuestions: [
        { key: "choice", question: "Which choice?", blocking: false },
        { question: "Which fallback?", blocking: true },
      ],
    },
    behavior: { rules: ["A rule"] },
  },
  ...changes,
});
const refines = (from: string, to: string) => ({
  from: `spec:probe.${from}`,
  to: `spec:probe.${to}`,
  type: "refines" as const,
  claim: "declared" as const,
});
function graph(nodes: PrimitiveNode[], edges: GraphSchema["edges"] = []): GraphSchema {
  return { schemaVersion, nodes, edges, locations: [] };
}
const probe = graph(
  [
    spec("root", { altitude: "epic", specKind: "model" }),
    spec("a", { altitude: "epic" }),
    spec("b", { altitude: "feature" }),
    spec("shared", { specKind: "example" }),
    spec("decision", { specKind: "decision" }),
    spec("outside"),
  ],
  [
    refines("a", "root"),
    refines("b", "root"),
    refines("shared", "a"),
    refines("shared", "b"),
    refines("decision", "shared"),
    refines("missing", "root"),
  ],
);
let data: Awaited<ReturnType<typeof createStudioData>>;
let map: CapabilityMap;
let pages: ReturnType<typeof renderStudio>;
beforeAll(async () => {
  data = await createStudioData(createReader(probe));
  map = data.recipes.all.get(52) as CapabilityMap;
  pages = renderStudio(data);
}, 30_000);
const html = (path: string) => {
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`Missing ${path}`);
  return page.content;
};

const capabilitiesAnchor = specTest({
  id: testAnchorId("test:protocol.studio-capabilities"),
  verifies: [
    ref("spec:consumers.spec-studio.capability-map-page"),
    ref("spec:consumers.spec-studio.diagram-kinds.capability-tree"),
  ],
});
void capabilitiesAnchor;

describe("Studio capabilities", () => {
  it.each([
    [30, 1],
    [45, 5],
    [40, 40],
  ])("folds whole sibling branches for %i features with %i stories", async (features, stories) => {
    const root = spec("root", { altitude: "epic" });
    const nodes = [root];
    const edges: GraphSchema["edges"][number][] = [];
    for (let i = 0; i < features; i++) {
      const feature = `feature${String(i).padStart(2, "0")}`;
      nodes.push(spec(feature, { altitude: "feature" }));
      edges.push(refines(feature, "root"));
      for (let j = 0; j < stories; j++) {
        const story = `${feature}.story${String(j).padStart(2, "0")}`;
        nodes.push(spec(story));
        edges.push(refines(story, feature));
      }
    }
    const answer = (await evaluateBody("return recipes(52, {detail: true})", {
      graph: graph(nodes, edges),
    })) as CapabilityMap;
    const drawing = capabilityDiagrams(answer, [root.id], root.id)[0];
    const drawn = new Set(drawing.boxes.map((b) => b.id));
    expect(drawing.boxes.length).toBeLessThanOrEqual(40);
    for (const box of drawing.boxes)
      if (box.parent) expect(drawn.has(box.parent), box.id).toBe(true);
    expect(drawing.edges).toHaveLength(drawing.boxes.length - 1);
    const visible = new Set(drawing.boxes.filter((b) => !b.folded).map((b) => b.identity));
    const hidden = nodes
      .filter((n) => !visible.has(n.id))
      .map((n) => n.id)
      .sort();
    const folded = [...new Set(drawing.boxes.flatMap((b) => b.foldedIds ?? []))].sort();
    expect(folded).toEqual(hidden);
    const output = renderDiagram(drawing);
    expect(output).toContain("<svg");
    for (const match of output.matchAll(/<tspan class="box-id"[^>]*>([^<]*)<\/tspan>/gu)) {
      expect(match[1]).not.toMatch(/%3A|\.capability\.branch\./u);
    }
    expect(drawing).toEqual(capabilityDiagrams(answer, [root.id], root.id)[0]);
  });

  it("keeps reached children out of the unreached drawing and complete rows", async () => {
    const data = await createStudioData(
      createReader(
        graph(
          [spec("e", { altitude: "epic" }), spec("u"), spec("s")],
          [refines("s", "e"), refines("s", "u")],
        ),
      ),
    );
    const output = required(renderStudio(data).find((p) => p.path === "capabilities.html")).content;
    const unreached = output.slice(output.indexOf('<section id="unreached">'));
    expect(unreached).toContain("spec:probe.u");
    expect(unreached).not.toContain("spec:probe.s");
    expect(unreached).toContain("an unreached band");
  });

  it("shows cycle diagnostics outside closed disclosures", async () => {
    const data = await createStudioData(
      createReader(
        graph(
          [spec("root", { altitude: "epic" }), spec("a"), spec("b"), spec("c")],
          [refines("a", "root"), refines("b", "a"), refines("a", "b"), refines("c", "b")],
        ),
      ),
    );
    const output = required(renderStudio(data).find((p) => p.path === "capabilities.html")).content;
    const diagnostics = required(
      /<p>Refinement cycles<\/p><ul>([\s\S]*?)<\/ul>/u.exec(output)?.[1],
    );
    expect(diagnostics).toContain("spec:probe.a");
    expect(diagnostics).toContain("spec:probe.b");
    expect(output).toContain("</details><p>Refinement cycles</p>");
  });

  it("exports every cycle member and exact edge with the Mermaid fallback reason", async () => {
    const answer = (await evaluateBody("return recipes(52, {detail: true})", {
      graph: graph(
        [spec("root", { altitude: "epic" }), spec("a"), spec("b"), spec("c")],
        [refines("a", "root"), refines("b", "a"), refines("a", "b"), refines("c", "b")],
      ),
    })) as CapabilityMap;
    const drawing = capabilityDiagrams(answer, ["spec:probe.root"], "cycle")[0];
    expect(mermaidSource(drawing)).toContain("%% cycle");
    expect(mermaidSource(drawing)).toContain("spec:probe.b");
    expect(mermaidSource(drawing)).toContain("spec:probe.c refines spec:probe.b");
    expect(mermaidSource(drawing)).toContain("spec:probe.a refines spec:probe.b");
    expect(mermaidSource(drawing)).toContain("spec:probe.b refines spec:probe.a");
    const rendered = renderDiagram(drawing);
    expect(rendered).toContain("Preferred syntax: mindmap");
    expect(rendered).toContain("Chosen syntax: flowchart BT");
    expect(rendered).toContain("a cycle");
  });

  it("renders code-span titles as plain drawing words and questions as linked prose", async () => {
    const node = spec("root", {
      altitude: "epic",
      title: "`Root` title",
      sections: {
        intent: {
          outcome: "Read",
          openQuestions: [{ question: "Read `code` and spec:probe.root", blocking: false }],
        },
      },
    });
    const d = await createStudioData(createReader(graph([node])));
    const page = required(renderStudio(d).find((p) => p.path === "capabilities.html")).content;
    expect(page).toContain(
      'non-blocking</a>: Read <code>code</code> and <a href="specs/probe.root.html">',
    );
    const drawing = required(
      capabilityDiagrams(d.recipes.all.get(52) as CapabilityMap, [node.id], node.id)[0],
    );
    expect(drawing.boxes[0]?.title).toBe("Root title");
    expect(mermaidSource(drawing)).not.toContain("`Root`");
  });
  it("initializes epic filtering from the URL, intersects every control and resets native rows", async () => {
    const row = {
      epic: "spec:probe.root",
      kind: "example",
      altitude: "story",
      stated: "ready",
      floor: "defined",
      implementation: "present",
      verifier: "none",
      pack: "pack:a",
    };
    for (const query of ["?epic=spec%3Aprobe.root", "?epic=bad", "?epic=none&epic=none"]) {
      const defined = new Map<
        string,
        new () => FakeNode & { connectedCallback(): void; disconnectedCallback(): void }
      >();
      class FakeNode {
        value = "any";
        hidden = false;
        textContent = "";
        parentNode?: FakeNode;
        attributes = new Map<string, string>();
        listeners = new Map<string, (event?: Event) => void>();
        options = [{ value: "any" }, { value: "none" }, { value: "spec:probe.root" }];
        ownerDocument = {
          location: { href: `file:///index.html${query}` },
          createElement: () => new FakeNode(),
        };
        setAttribute(name: string, value: string) {
          this.attributes.set(name, value);
        }
        getAttribute(name: string) {
          return this.attributes.get(name) ?? null;
        }
        addEventListener(name: string, callback: (event?: Event) => void) {
          this.listeners.set(name, callback);
        }
        removeEventListener(name: string) {
          this.listeners.delete(name);
        }
        append(node: FakeNode) {
          node.parentNode = this;
        }
        querySelector(selector: string) {
          return selector === "form" ? form : selector === "[data-filter-note]" ? note : selects[0];
        }
        querySelectorAll(selector: string) {
          return selector === "[data-row]" ? rows : selector === "output" ? [] : selects;
        }
      }
      const form = new FakeNode(),
        note = new FakeNode();
      form.hidden = true;
      const selects = Object.keys(row).map((name) => {
        const n = new FakeNode();
        n.setAttribute("data-filter", name);
        return n;
      });
      const rows = [row, { ...row, epic: "none" }].map((values) => {
        const n = new FakeNode();
        for (const [key, value] of Object.entries(values)) n.setAttribute(`data-${key}`, value);
        return n;
      });
      runInNewContext(readFileSync(new URL("../dist/studio/studio.js", import.meta.url), "utf8"), {
        HTMLElement: FakeNode,
        Event,
        queueMicrotask,
        URL,
        customElements: {
          get: () => undefined,
          define: (
            name: string,
            ctor: new () => FakeNode & { connectedCallback(): void; disconnectedCallback(): void },
          ) => defined.set(name, ctor),
        },
      });
      const host = new (required(defined.get("sdp-filter")))();
      host.connectedCallback();
      const valid = query === "?epic=spec%3Aprobe.root";
      expect(form.hidden).toBe(false);
      expect(selects[0]?.value).toBe(valid ? "spec:probe.root" : "any");
      expect(rows.map((r) => r.hidden)).toEqual(valid ? [false, true] : [false, false]);
      expect(note.textContent).toBe(valid ? "" : "Unknown epic filter. All Specs are shown.");
      if (valid)
        for (const select of selects.slice(1)) {
          select.value = "missing";
          host.listeners.get("change")?.();
          expect(rows.map((r) => r.hidden)).toEqual([true, true]);
          select.value =
            row[required(select.getAttribute("data-filter") ?? undefined) as keyof typeof row];
          host.listeners.get("change")?.();
          expect(rows.map((r) => r.hidden)).toEqual([false, true]);
          select.value = "any";
        }
      const event = new Event("reset", { cancelable: true });
      form.listeners.get("reset")?.(event);
      expect(event.defaultPrevented).toBe(false);
      // The browser applies option defaults only after an uncancelled reset event.
      if (!event.defaultPrevented) for (const select of selects) select.value = "native-default";
      await new Promise<void>((resolve) => {
        queueMicrotask(resolve);
      });
      expect(rows.map((r) => r.hidden)).toEqual([false, false]);
      expect(note.textContent).toBe("");
      expect(selects.every((s) => s.value === "any")).toBe(true);
      host.disconnectedCallback();
      expect(form.listeners.size).toBe(0);
      expect(host.listeners.size).toBe(0);
    }
  });

  it("reflows capability cards, caps deep indentation and opens complete text for print", async () => {
    const css = postcss.parse(
      readFileSync(new URL("../src/projections/studio/studio.css", import.meta.url), "utf8"),
    );
    const declarations: string[] = [];
    css.walkRules((rule) => {
      if (rule.selector === ".capability-overview")
        rule.walkDecls((d) => {
          declarations.push(`${d.prop}:${d.value}`);
        });
    });
    expect(declarations).toContain(
      "grid-template-columns:repeat(auto-fit, minmax(min(100%, 17rem), 1fr))",
    );
    let printOpensText = false;
    css.walkAtRules("media", (rule) => {
      if (rule.params === "print")
        rule.walkRules("details::details-content", (r) => {
          r.walkDecls("content-visibility", (d) => {
            if (d.value === "visible" && d.important) printOpensText = true;
          });
        });
    });
    expect(printOpensText).toBe(true);
    const nodes = Array.from({ length: 7 }, (_, i) =>
      spec(`deep${String(i)}`, i === 0 ? { altitude: "epic" } : {}),
    );
    const data = await createStudioData(
      createReader(
        graph(
          nodes,
          nodes.slice(1).map((_, i) => refines(`deep${String(i + 1)}`, `deep${String(i)}`)),
        ),
      ),
    );
    const output = required(renderStudio(data).find((p) => p.path === "capabilities.html")).content;
    expect(output).toContain('style="--depth:4"');
    expect(output).not.toMatch(/style="--depth:[5-9]/u);
    expect(output).toContain('Parent: <a href="specs/probe.deep5.html"');
  });

  it("folds only a leaf remainder at the root, preserves first siblings and falls back for too many roots", async () => {
    const root = spec("root", { altitude: "epic" });
    const leaves = Array.from({ length: 50 }, (_, i) => spec(`leaf${String(i).padStart(2, "0")}`));
    const answer = (
      await createStudioData(
        createReader(
          graph(
            [root, ...leaves],
            leaves.map((n) => refines(n.id.slice(11), "root")),
          ),
        ),
      )
    ).recipes.all.get(52) as CapabilityMap;
    const d = capabilityDiagrams(answer, [root.id], root.id)[0];
    expect(d.boxes).toHaveLength(31);
    expect(d.boxes[1]?.identity).toBe("spec:probe.leaf00");
    expect(d.boxes.at(-1)?.foldedIds).toHaveLength(21);
    expect(d.edges.at(-1)?.to).toBe(d.boxes[0]?.id);
    const isolated = leaves.map((n) => ({ ...n, altitude: "epic" as const }));
    const many = (await createStudioData(createReader(graph(isolated)))).recipes.all.get(
      52,
    ) as CapabilityMap;
    const fallback = renderDiagram(
      capabilityDiagrams(
        many,
        isolated.map((n) => n.id),
        "many",
      )[0],
      "many.capability",
    );
    expect(fallback).not.toContain("<svg");
    expect(fallback).toContain('<details open id="diagram.many.capability.text"');
    for (const node of isolated) expect(fallback).toContain(node.id);
  });
  it("condenses a cycle into a labelled group and retains its internal relations in words", async () => {
    const g = graph(
      [spec("root", { altitude: "epic" }), spec("a"), spec("b")],
      [refines("a", "root"), refines("b", "a"), refines("a", "b")],
    );
    const m = (await createStudioData(createReader(g))).recipes.all.get(52) as CapabilityMap;
    const d = capabilityDiagrams(m, ["spec:probe.root"], "cycle")[0];
    expect(d.boxes).toHaveLength(2);
    expect(d.edges).toHaveLength(1);
    expect(d.boxes[1]?.detail).toContain("cycle · 2 unique Specs");
    const text = renderDiagram(d, "cycle.capability");
    expect(text).toContain("spec:probe.b</code> refines <code>spec:probe.a");
    expect(text).toContain("spec:probe.a</code> refines <code>spec:probe.b");
  });

  it("shares the detailed recipe answer and publishes a lens immediately after Packs", () => {
    expect(map.nodes).toHaveLength(6);
    expect(map.epics.find((e) => e.id === "spec:probe.root")?.rollup.specs).toBe(4);
    for (const page of pages.filter((p) => !p.path.startsWith("exports/"))) {
      expect(page.content).toMatch(
        /href="(?:\.\.\/)?index.html"[^>]*>Packs<\/a><a href="(?:\.\.\/)?capabilities.html"/u,
      );
    }
    expect(html("capabilities.html")).toContain('href="capabilities.html" aria-current="page"');
    expect(html("capabilities.html")).not.toContain('id="sdp-data"');
  });
  it("labels nested epics, scopes distinct rollups and separates examples and decisions", () => {
    const page = html("capabilities.html");
    expect(page).toContain('id="spec:probe.root"');
    expect(page).toContain('Inside <a href="specs/probe.root.html"');
    expect(page).toContain('Contains epic <a href="specs/probe.a.html"');
    expect(page).toContain("Distinct descendants, excluding this epic");
    expect(page).toContain("<p>4 distinct descendants · 1 example · 1 decision.</p></article>");
    expect(page).toContain("<summary>Example · Title shared</summary>");
    expect(page).toContain("<summary>Decision · Title decision</summary>");
    expect(page).toContain("implementation binding none");
    expect(page).toContain("verifier binding none");
    expect(page).toContain("stated scoped");
    expect(page).toContain("floor scoped");
    expect(page).toContain("index.html?epic=spec%3Aprobe.root#specs");
    expect(page).toContain("unresolved-refinement");
    expect(page).not.toContain('href="specs/probe.missing.html"');
  });
  it("keeps depth-first repeats, every relation and question links to real ids", () => {
    const walk = capabilityWalk(map, ["spec:probe.root"]);
    expect(walk.map((v) => [v.node.id, v.repeat])).toEqual([
      ["spec:probe.root", false],
      ["spec:probe.a", false],
      ["spec:probe.shared", false],
      ["spec:probe.decision", false],
      ["spec:probe.b", false],
      ["spec:probe.shared", true],
    ]);
    const page = html("capabilities.html");
    expect(page).toContain("Repeat of");
    expect(page).toContain("Parent:");
    expect(page).toContain("specs/probe.root.html#question.choice");
    expect(page).toContain("specs/probe.root.html#section.intent");
    expect(html("specs/probe.root.html")).toContain('id="question.choice"');
    expect(html("specs/probe.root.html")).toContain('id="section.intent"');
    for (const edge of map.edges)
      expect(page).toContain(`${edge.from}</code> refines <code>${edge.to}`);
  });
  it("renders a repeat box with its own child-to-parent arrow and groups siblings", () => {
    const d = capabilityDiagrams(map, ["spec:probe.root"], "spec:probe.root")[0];
    expect(d.boxes).toHaveLength(6);
    expect(d.edges).toHaveLength(5);
    const repeats = d.boxes.filter((b) => b.detail?.includes("repeat"));
    expect(repeats).toHaveLength(1);
    expect(repeats[0]?.target).toContain(".capability.branch.spec%253Aprobe.shared");
    expect(new Set(d.boxes.map((b) => b.band)).size).toBeGreaterThan(2);
    expect(mermaidSource(d)).toMatch(/^flowchart BT/u);
    const drawing = renderDiagram(d, "spec:probe.root.capability");
    expect(drawing).toContain("Later visits repeat a Spec and link to its first occurrence.");
    expect(drawing).toContain("repeated parentage");
    expect(drawing).toContain('id="diagram.spec:probe.root.capability.arrow"');
  });
  it("uses mindmap only for a strict tree and folds large branches without losing text", async () => {
    const nodes = [
      spec("root", { altitude: "epic" }),
      spec("a", { altitude: "feature" }),
      ...Array.from({ length: 65 }, (_, i) => spec(`leaf${String(i).padStart(2, "0")}`)),
    ];
    const edges = [
      refines("a", "root"),
      ...nodes.slice(2).map((n) => refines(n.id.slice(11), "a")),
    ];
    const answer = (await createStudioData(createReader(graph(nodes, edges)))).recipes.all.get(
      52,
    ) as CapabilityMap;
    const drawing = capabilityDiagrams(answer, ["spec:probe.root"], "large")[0];
    expect(drawing.boxes.length).toBeLessThanOrEqual(40);
    expect(drawing.boxes.some((b) => b.folded && b.foldedIds?.length === 65)).toBe(true);
    const output = renderDiagram(drawing, "large.capability");
    expect(
      [...output.matchAll(/<tspan class="box-id"[^>]*>([^<]*)<\/tspan>/gu)]
        .map((m) => m[1])
        .join(" "),
    ).not.toMatch(/%3A|\.capability\.branch\./u);
    expect(output).toContain("65 unique Specs");
    expect(output).toContain("a fold");
    for (const n of nodes) expect(output).toContain(n.id);
    const small = (
      await createStudioData(createReader(graph(nodes.slice(0, 2), edges.slice(0, 1))))
    ).recipes.all.get(52) as CapabilityMap;
    expect(mermaidSource(capabilityDiagrams(small, ["spec:probe.root"], "small")[0])).toMatch(
      /^mindmap/u,
    );
    expect(output).toEqual(
      renderDiagram(
        capabilityDiagrams(answer, ["spec:probe.root"], "large")[0],
        "large.capability",
      ),
    );
  });
  it("keeps cycles finite, labelled and complete, and handles no epics or an empty corpus", async () => {
    for (const g of [
      graph([], []),
      graph([spec("a"), spec("b")], [refines("a", "b"), refines("b", "a")]),
    ]) {
      const d = await createStudioData(createReader(g));
      const output = required(renderStudio(d).find((p) => p.path === "capabilities.html")).content;
      expect(output).toContain("No epic reaches these Specs");
      expect(output).toContain("No epics");
      if (g.nodes.length) {
        expect(output).toContain("cycle");
        expect(output).toContain("spec:probe.a</code> refines <code>spec:probe.b");
      } else expect(output).toContain("No unreached Specs.");
    }
  });
  it("records all epic memberships on index rows and preserves Pack disclosures", () => {
    const index = html("index.html");
    expect(index).toContain('data-filter="epic"');
    expect(index).toContain('<option value="none">No epic</option>');
    expect(index).toContain('data-epic="spec:probe.a spec:probe.root"');
    expect(index).toContain('data-epic="none"');
    expect(index).toContain("Filtering needs script");
    expect(index).toContain('type="reset"');
    expect(index).not.toMatch(/data-row[^>]* hidden/u);
  });
  it("intersects epic selection with every existing filter and treats no epic explicitly", () => {
    const row = {
      epic: "spec:probe.a spec:probe.root",
      kind: "example",
      altitude: "story",
      stated: "ready",
      floor: "defined",
      implementation: "present",
      verifier: "none",
      pack: "pack:a pack:b",
    };
    for (const name of Object.keys(row).filter((k) => k !== "epic")) {
      expect(
        rowMatches(row, {
          epic: "spec:probe.root",
          [name]: required(row[name as keyof typeof row].split(" ")[0]),
        }),
      ).toBe(true);
      expect(rowMatches(row, { epic: "spec:probe.root", [name]: "missing" })).toBe(false);
    }
    expect(rowMatches({ epic: "none" }, { epic: "none" })).toBe(true);
    for (const query of [
      "?epic=missing",
      "?epic=spec%3Aprobe.shared",
      "?epic=none&epic=none",
      "?epic=",
      "?epic=any",
    ])
      expect(epicFilter(`file:///index.html${query}`, ["spec:probe.root"])).toEqual({
        value: "any",
        unknown: true,
      });
    expect(epicFilter("file:///index.html?epic=spec%3Aprobe.root", ["spec:probe.root"])).toEqual({
      value: "spec:probe.root",
      unknown: false,
    });
    expect(epicFilter("file:///index.html?epic=none", [])).toEqual({
      value: "none",
      unknown: false,
    });
    expect(epicFilter("file:///index.html", [])).toEqual({ value: "any", unknown: false });
  });
});

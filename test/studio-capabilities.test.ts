import { describe, expect, it } from "vitest";
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
const data = await createStudioData(createReader(probe));
const map = data.recipes.all.get(52) as CapabilityMap;
const pages = renderStudio(data);
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
    expect(d.boxes).toHaveLength(40);
    expect(d.boxes[1]?.identity).toBe("spec:probe.leaf00");
    expect(d.boxes.at(-1)?.foldedIds).toHaveLength(12);
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
    expect(page).toContain("Inside");
    expect(page).toContain("Contains epic");
    expect(page).toContain("Distinct descendants, excluding this epic");
    expect(page).toContain("1 example");
    expect(page).toContain("1 decision");
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
    expect(output).toContain("65 unique Specs");
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

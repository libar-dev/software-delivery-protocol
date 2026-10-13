import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";
import { describe, expect, it } from "vitest";
import { recipeFiles } from "../src/cli/build-artifacts.js";
import { compileBody } from "../src/cli/q-command.js";
import { createReader, schemaVersion, validateGraph } from "../src/index.js";
import type { GraphSchema, GraphNode, GraphEdge } from "../src/index.js";

const walkRecipeAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.architecture-walk-recipe"),
  label: "asserts realization of the shipped architecture walk recipe",
  satisfies: ref("spec:validation.architecture-constraints"),
});
void walkRecipeAnchor;
const comparisonRecipeAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.planned-components-recipe"),
  label: "asserts realization of the shipped planned against realized components recipe",
  satisfies: ref("spec:model.planned-architecture"),
});
void comparisonRecipeAnchor;

const catalog = fileURLToPath(new URL("../docs/agent-surface/recipes.md", import.meta.url));
async function recipe(ordinal: number, graph: GraphSchema, params = {}) {
  const source = recipeFiles(readFileSync(catalog, "utf8")).find((row) => row.ordinal === ordinal);
  if (source === undefined) throw new Error(`missing recipe ${String(ordinal)}`);
  return (await compileBody(source.content)(
    createReader(graph),
    graph,
    validateGraph(graph),
    params,
  )) as Record<string, unknown>;
}
type MutableGraph = Omit<GraphSchema, "nodes" | "edges"> & {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
function probe(): MutableGraph {
  return {
    schemaVersion,
    nodes: [
      {
        id: "component:probe.a",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "a.ts",
        line: 1,
        layer: "domain",
        context: "platform",
        role: "service",
      },
      {
        id: "component:probe.b",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "b.ts",
        line: 1,
        layer: "infrastructure",
        context: "orders",
      },
      { id: "impl:probe.a", nodeType: "CodeNode", claim: "anchored", file: "a.ts", line: 2 },
      { id: "impl:probe.b", nodeType: "CodeNode", claim: "anchored", file: "b.ts", line: 2 },
      { id: "impl:probe.bare", nodeType: "CodeNode", claim: "anchored", file: "c.ts", line: 1 },
    ],
    edges: [
      { from: "impl:probe.a", to: "component:probe.a", type: "memberOf", claim: "anchored" },
      { from: "impl:probe.b", to: "component:probe.b", type: "memberOf", claim: "anchored" },
      { from: "impl:probe.a", to: "impl:probe.b", type: "uses", claim: "anchored" },
    ],
  };
}
function design(graph: MutableGraph, entries: Record<string, string>, id = "spec:probe.design") {
  graph.nodes.push({
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "model",
    altitude: "story",
    readiness: "idea",
    title: "Probe",
    file: "probe.sdp.md",
    sections: { intent: { outcome: "Probe" }, design: { id: "component:probe.a", ...entries } },
  });
  graph.edges.push({
    from: "component:probe.a",
    to: id,
    type: "satisfies",
    claim: "anchored",
  });
}
describe("architecture walk", () => {
  it.each([
    {},
    { forbidden: [{ from: "wrong", to: "domain" }] },
    { isolated: ["Bad"] },
    { isolated: [], severity: "info" },
    { forbidden: false },
    { isolated: "platform" },
    { forbidden: null },
    { isolated: null },
    { isolated: [], severity: null },
  ])("diagnoses malformed parameters %j", async (params) => {
    expect(await recipe(42, probe(), params)).toHaveProperty("diagnostics");
  });
  it("answers unknown names before checking values", async () => {
    expect(await recipe(42, probe(), { typo: 1, forbidden: false })).toEqual({
      unknownParams: ["typo"],
      accepts: ["forbidden", "isolated", "severity"],
    });
  });
  it("resolves members, deduplicates rules and sorts both breaches", async () => {
    const pair = { from: "domain", to: "infrastructure" };
    const result = await recipe(42, probe(), {
      forbidden: [pair, pair],
      isolated: ["platform", "platform"],
      severity: "warning",
    });
    expect(result.totals).toEqual({ usesEdges: 1, resolved: 1, findings: 2, unclassified: 0 });
    expect(result.findings).toMatchObject([
      {
        validatorId: "forbidden-layer",
        severity: "warning",
        subjectId: "impl:probe.a",
        relatedId: "impl:probe.b",
        fromComponent: { id: "component:probe.a" },
      },
      { validatorId: "isolated-context" },
    ]);
  });
  it("sorts findings and unclassified edges independently of insertion order", async () => {
    const graph = probe();
    graph.nodes.push({
      id: "impl:probe.0",
      nodeType: "CodeNode",
      claim: "anchored",
      file: "a.ts",
      line: 3,
    });
    graph.edges.push(
      { from: "impl:probe.a", to: "impl:probe.bare", type: "uses", claim: "anchored" },
      { from: "impl:probe.0", to: "component:probe.a", type: "memberOf", claim: "anchored" },
      { from: "impl:probe.0", to: "impl:probe.b", type: "uses", claim: "anchored" },
      { from: "impl:probe.0", to: "impl:probe.bare", type: "uses", claim: "anchored" },
    );
    const result = await recipe(42, graph, {
      forbidden: [{ from: "domain", to: "infrastructure" }],
    });
    expect((result.findings as { subjectId: string }[]).map((row) => row.subjectId)).toEqual([
      "impl:probe.0",
      "impl:probe.a",
    ]);
    expect((result.unclassified as { from: string }[]).map((row) => row.from)).toEqual([
      "impl:probe.0",
      "impl:probe.a",
    ]);
  });
  it("reports missing components and attributes apart, ignoring same-component uses", async () => {
    const graph = probe();
    const node = graph.nodes[1];
    if (node?.nodeType === "CodeNode") {
      const { layer: _layer, ...bare } = node;
      void _layer;
      graph.nodes[1] = bare;
    }
    graph.edges.push(
      { from: "impl:probe.a", to: "impl:probe.bare", type: "uses", claim: "anchored" },
      { from: "impl:probe.a", to: "component:probe.a", type: "uses", claim: "anchored" },
    );
    const result = await recipe(42, graph, {
      forbidden: [{ from: "domain", to: "infrastructure" }],
    });
    expect(result.totals).toEqual({ usesEdges: 3, resolved: 2, findings: 0, unclassified: 2 });
    expect(result.unclassified).toMatchObject([
      { to: "impl:probe.b", missing: ["layer"] },
      { to: "impl:probe.bare", toComponent: null, missing: ["component"] },
    ]);
    expect((await recipe(42, graph, { forbidden: [], isolated: [] })).unclassified).toEqual([]);
  });
});
describe("planned components", () => {
  it("refuses any parameter name", async () => {
    expect(await recipe(43, probe(), { typo: 1 })).toEqual({
      unknownParams: ["typo"],
      accepts: [],
    });
  });
  it("compares opening spans, role, context and the uses set", async () => {
    const graph = probe();
    design(graph, { layer: "`domain` because", role: "decider", context: "orders", uses: "none" });
    const result = await recipe(43, graph);
    expect(result.totals).toEqual({
      designs: 1,
      realized: 1,
      matching: 0,
      unrealized: 0,
      differing: 3,
      unreadable: 0,
    });
    expect(result.differing).toEqual([
      {
        spec: "spec:probe.design",
        componentId: "component:probe.a",
        field: "context",
        planned: "orders",
        realized: "platform",
      },
      {
        spec: "spec:probe.design",
        componentId: "component:probe.a",
        field: "role",
        planned: "decider",
        realized: "service",
      },
      {
        spec: "spec:probe.design",
        componentId: "component:probe.a",
        field: "uses",
        planned: [],
        realized: ["component:probe.b"],
      },
    ]);
  });
  it("sorts differing fields and unrealized designs independently of insertion order", async () => {
    const graph = probe();
    design(graph, { layer: "application", context: "orders" });
    design(graph, { id: "component:probe.z" }, "spec:probe.z");
    graph.edges.pop();
    design(graph, { id: "component:probe.0" }, "spec:probe.0");
    graph.edges.pop();
    const result = await recipe(43, graph);
    expect((result.differing as { field: string }[]).map((row) => row.field)).toEqual([
      "context",
      "layer",
    ]);
    expect((result.unrealized as { spec: string }[]).map((row) => row.spec)).toEqual([
      "spec:probe.0",
      "spec:probe.z",
    ]);
  });
  it("deduplicates padded uses and skips unstated fields", async () => {
    const graph = probe();
    design(graph, { uses: " component:probe.b , component:probe.b " });
    expect((await recipe(43, graph)).totals).toMatchObject({ matching: 1, differing: 0 });
  });
  it("does not count unreadable realized designs as matching", async () => {
    const graph = probe();
    design(graph, { layer: "domain because", uses: "impl:probe.b" });
    expect((await recipe(43, graph)).totals).toMatchObject({
      matching: 0,
      unreadable: 2,
      differing: 0,
    });
  });
  it("lists an existing but unbound anchor and preserves unstated uses", async () => {
    const graph = probe();
    design(graph, { layer: "domain" });
    graph.edges.pop();
    expect((await recipe(43, graph)).unrealized).toEqual([
      {
        spec: "spec:probe.design",
        componentId: "component:probe.a",
        anchorExists: true,
        layer: "domain",
        role: null,
        context: null,
        uses: null,
      },
    ]);
  });
});

it("recognizes component IDs with the stable-ID path grammar", async () => {
  const graph = probe();
  design(graph, { id: "component:Probe.1kernel" });
  expect((await recipe(43, graph)).totals).toMatchObject({ designs: 1, unrealized: 1 });
});

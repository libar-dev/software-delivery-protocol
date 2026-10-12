import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

import { recipeFiles } from "../src/cli/build-artifacts.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { extractValidatorId, schemaVersion } from "../src/index.js";
import type {
  ExtractionResult,
  GraphEdge,
  GraphNode,
  GraphSchema,
  PrimitiveNode,
} from "../src/index.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const slimmingImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.slimming-recipe"),
  label: "asserts realization of the shipped slimming-candidates recipe",
  satisfies: ref("spec:model.enrichment-lifecycle"),
});
void slimmingImplementationAnchor;
const curationRecipeAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.curation-recipe"),
  label: "asserts the curation report over external inferred imports",
  satisfies: ref("spec:consumers.impact-graph.curation-assist"),
  references: [ref("spec:model.planned-architecture")],
});
void curationRecipeAnchor;
const slimmingTestAnchor = specTest({
  id: testAnchorId("test:protocol.slimming-recipe"),
  verifies: ref("spec:model.enrichment-lifecycle"),
});
void slimmingTestAnchor;
const curationTestAnchor = specTest({
  id: testAnchorId("test:protocol.curation-recipe"),
  verifies: ref("spec:consumers.impact-graph.curation-assist"),
});
void curationTestAnchor;

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const catalog = recipeFiles(readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8"));

async function runRecipe(
  ordinal: number,
  graph: GraphSchema,
  params: Record<string, unknown> = {},
) {
  const recipe = catalog.find((entry) => entry.ordinal === ordinal);
  if (recipe === undefined) throw new Error(`missing recipe ${String(ordinal)}`);
  const capture = createCaptureOutput();
  const extraction: ExtractionResult = {
    graph,
    report: { validatorId: extractValidatorId, findings: [] },
    counts: { specs: 0, packs: 0, anchors: 0 },
  };
  const code = await runSdpCli(
    ["q", recipe.content, "--root", repoRoot, "--json", "--params", JSON.stringify(params)],
    capture.output,
    {
      query: { extract: () => extraction, isStdinTty: () => true },
    },
  );
  expect({ code, stderr: capture.readStderr() }).toEqual({ code: 0, stderr: "" });
  return JSON.parse(capture.readStdout()) as Record<string, unknown>;
}

function spec(
  id: string,
  design: Record<string, unknown> = {},
  facts: PrimitiveNode["deliveryFacts"] = [],
): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "model",
    altitude: "story",
    readiness: "idea",
    file: "specs/probe.sdp.md",
    sections: { design },
    deliveryFacts: facts,
  };
}
function unit(id: string, file: string): GraphNode {
  return { id, file, nodeType: "CodeNode", claim: "anchored", line: 1 };
}
function testNode(id: string): GraphNode {
  return { id, file: "test/probe.test.ts", nodeType: "Anchor", claim: "anchored", line: 2 };
}
function edge(
  from: string,
  type: GraphEdge["type"],
  to: string,
  claim: GraphEdge["claim"] = "anchored",
): GraphEdge {
  return { from, type, to, claim };
}

describe("slimming candidates recipe", () => {
  const graph: GraphSchema = {
    schemaVersion,
    nodes: [
      spec(
        "spec:probe.eligible",
        {
          zShape: "`type Shape = string` is the declaration.",
          aShape: "``a `nested` span`` explains why.",
          description: "`not a declaration`",
          prose: "Keep the explanation and `embedded span`.",
          nested: { shape: "`not a top-level declaration`" },
          multiline: "`two\nlines`",
        },
        ["implemented", "has-verifier"],
      ),
      spec("spec:probe.built", { shape: "`no verifier`" }, ["implemented"]),
      spec("spec:probe.checked", { shape: "`no implementation`" }, ["has-verifier"]),
      spec("spec:probe.bare", { shape: "`no bindings`" }),
      unit("impl:probe.eligible", "src/eligible.ts"),
      testNode("test:probe.eligible"),
      {
        id: "pack:probe.one",
        nodeType: "Pack",
        claim: "declared",
        file: "probe.pack.sdp.md",
        members: ["spec:probe.eligible"],
      },
      {
        id: "pack:probe.clean",
        nodeType: "Pack",
        claim: "declared",
        file: "clean.pack.sdp.md",
        members: ["spec:probe.bare"],
      },
    ],
    edges: [
      edge("impl:probe.eligible", "satisfies", "spec:probe.eligible"),
      edge("test:probe.eligible", "verifies", "spec:probe.eligible"),
      edge("spec:probe.eligible", "belongsTo", "pack:probe.one", "declared"),
      edge("spec:probe.bare", "belongsTo", "pack:probe.clean", "declared"),
    ],
    locations: [
      { spec: "spec:probe.eligible", file: "specs/probe.sdp.md", entry: "design.aShape", line: 17 },
    ],
  };

  it("requires both facts and uses recipe 24's opening span rule, with lines and bindings", async () => {
    const result = await runRecipe(39, graph);
    expect(result.totals).toEqual({ specs: 4, potentialCandidates: 2 });
    const bindings = {
      implementations: [
        { id: "impl:probe.eligible", file: "src/eligible.ts", line: 1, claim: "anchored" },
      ],
      verifiers: [
        {
          id: "test:probe.eligible",
          file: "test/probe.test.ts",
          via: "test-anchor",
          enabled: true,
          claim: "anchored",
        },
      ],
    };
    expect(result.rows).toEqual([
      {
        spec: "spec:probe.eligible",
        key: "aShape",
        line: 17,
        declaration: "a `nested` span",
        ...bindings,
      },
      {
        spec: "spec:probe.eligible",
        key: "zShape",
        line: null,
        declaration: "type Shape = string",
        ...bindings,
      },
    ]);
    expect(result.leftOut).toEqual([
      expect.stringContaining("entry-level realization of a declaration"),
      expect.stringContaining("entry-level realization by a bound example"),
      expect.stringContaining("Prose entries never qualify"),
    ]);
  });

  it("selects only Pack members and returns no rows for a clean Pack", async () => {
    expect((await runRecipe(39, graph, { pack: "pack:probe.one" })).totals).toEqual({
      specs: 1,
      potentialCandidates: 2,
    });
    const result = await runRecipe(39, graph, { pack: "pack:probe.clean" });
    expect(result.totals).toEqual({ specs: 1, potentialCandidates: 0 });
    expect(result.rows).toEqual([]);
  });

  it("distinguishes an unknown Pack from a clean existing Pack", async () => {
    expect(await runRecipe(39, graph, { pack: "pack:probe.unknown" })).toEqual({
      pack: "pack:probe.unknown",
      found: false,
    });
    const clean = await runRecipe(39, graph, { pack: "pack:probe.clean" });
    expect(clean.totals).toEqual({ specs: 1, potentialCandidates: 0 });
    expect(clean.rows).toEqual([]);
    expect(clean).not.toHaveProperty("found", false);
  });

  it("includes enabled example verifier bindings without claiming they realize an entry", async () => {
    const example = { ...spec("spec:probe.example"), specKind: "example" as const };
    const result = await runRecipe(39, {
      ...graph,
      nodes: [...graph.nodes, example, testNode("test:probe.example")],
      edges: [
        ...graph.edges,
        edge(example.id, "verifies", "spec:probe.eligible", "declared"),
        edge("test:probe.example", "verifies", example.id),
      ],
    });
    expect(result.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          verifiers: expect.arrayContaining([
            {
              id: example.id,
              file: "specs/probe.sdp.md",
              via: "example",
              enabled: true,
              claim: "declared",
            },
          ]) as unknown,
        }),
      ]),
    );
  });
});

describe("curation report recipe", () => {
  const graph: GraphSchema = {
    schemaVersion,
    nodes: [
      unit("component:probe.a", "code/a.ts"),
      unit("component:probe.b", "code/leaf.ts"),
      unit("component:probe.c", "code/c.ts"),
      unit("impl:probe.a", "code/a.ts"),
      unit("impl:probe.b", "code/leaf.ts"),
      unit("impl:probe.loose", "code/loose.ts"),
      testNode("test:probe.outside"),
      spec("spec:probe.missing", { id: "component:probe.missing" }),
      spec("spec:probe.unbound", { id: "`component:probe.b`" }),
      spec("spec:probe.realized", { id: "component:probe.a" }),
      spec("spec:probe.wrong-unit", { id: "component:probe.c" }),
      spec("spec:probe.not-component", { id: "a plain entry" }),
    ],
    edges: [
      edge("impl:probe.a", "memberOf", "component:probe.a"),
      edge("impl:probe.b", "memberOf", "component:probe.b"),
      edge("impl:probe.a", "uses", "impl:probe.b"),
      edge("component:probe.a", "uses", "component:probe.c"),
      edge("impl:probe.a", "uses", "component:probe.a"),
      edge("impl:probe.loose", "uses", "component:probe.a"),
      edge("component:probe.a", "satisfies", "spec:probe.realized"),
      edge("component:probe.b", "references", "spec:probe.unbound"),
      edge("impl:probe.a", "satisfies", "spec:probe.wrong-unit"),
    ],
  };
  const imports = {
    schema: "sdp-imports/1",
    adapter: "typescript",
    files: [
      { file: "code/idle.ts", imports: [] },
      { file: "code/a.ts", imports: ["code/index.ts", "code/leaf.ts"] },
      { file: "code/index.ts", imports: ["code/leaf.ts"] },
      { file: "code/leaf.ts", imports: ["code/a.ts"] },
      { file: "code/loose.ts", imports: [] },
    ],
  };

  it.each(
    [
      undefined,
      null,
      [],
      "imports",
      {},
      { schema: "sdp-imports/2", adapter: "typescript", files: [] },
      { schema: "sdp-imports/1", files: [] },
      { schema: "sdp-imports/1", adapter: "typescript", files: null },
      { schema: "sdp-imports/1", adapter: "typescript", files: [null] },
      { schema: "sdp-imports/1", adapter: "typescript", files: [1] },
      {
        schema: "sdp-imports/1",
        adapter: "typescript",
        files: [{ file: "a.ts", imports: [null] }],
      },
    ].map((input) => ({ input })),
  )("returns diagnostics and no rows for invalid imports input $input", async ({ input }) => {
    const result = await runRecipe(40, graph, input === undefined ? {} : { imports: input });
    expect(Object.keys(result)).toEqual(["diagnostics"]);
    expect(result.diagnostics).toEqual([
      { parameter: "imports", problem: "Supply an sdp-imports/1 object." },
    ]);
  });

  it.each([0, -1, 1.5, "1", null, true])(
    "returns diagnostics and no rows for invalid limit %j",
    async (limit) => {
      const result = await runRecipe(40, graph, { imports, limit });
      expect(Object.keys(result)).toEqual(["diagnostics"]);
      expect(result.diagnostics).toEqual([
        { parameter: "limit", problem: "Expected a positive integer." },
      ]);
    },
  );

  it("recognizes every lawful component-id segment and keeps invalid convention values out", async () => {
    const result = await runRecipe(
      40,
      {
        schemaVersion,
        nodes: [
          spec("spec:probe.upper", { id: "component:9API.Service-2" }),
          spec("spec:probe.invalid", { id: "component:bad_name" }),
          spec("spec:probe.empty-segment", { id: "component:bad..name" }),
        ],
        edges: [],
      },
      { imports: { schema: "sdp-imports/1", adapter: "typescript", files: [] } },
    );
    expect(result.unrealizedComponents).toEqual([
      { spec: "spec:probe.upper", componentId: "component:9API.Service-2" },
    ]);
  });

  it("echoes import exclusions without changing the supplied graph or inferring omissions", async () => {
    const before = JSON.stringify(graph);
    const exclude = ["code/generated", "code/idle.ts"];
    const result = await runRecipe(40, graph, { imports: { ...imports, exclude } });
    expect(result.input).toMatchObject({ label: "external inferred input", exclude });
    expect(result.oneSided).toEqual((await runRecipe(40, graph, { imports })).oneSided);
    expect(JSON.stringify(graph)).toBe(before);
  });

  it("joins directed component pairs, ranks uncovered files and reports incomplete input and unrealized designs", async () => {
    const before = JSON.stringify(graph);
    const result = await runRecipe(40, graph, { imports });
    expect(result).toEqual({
      input: {
        label: "external inferred input",
        schema: "sdp-imports/1",
        adapter: "typescript",
        files: 5,
        exclude: [],
      },
      totals: {
        files: 5,
        importEdges: 4,
        uncovered: 2,
        componentUses: 2,
        usesWithoutImport: 1,
        importsWithoutUses: 1,
        unrealizedComponents: 3,
        anchoredOnly: 2,
        importsOutsideComponents: 3,
      },
      uncovered: [
        { file: "code/index.ts", fanIn: 1, fanOut: 1 },
        { file: "code/idle.ts", fanIn: 0, fanOut: 0 },
      ],
      usesWithoutImport: [
        {
          from: "component:probe.a",
          to: "component:probe.c",
          fromComponent: "component:probe.a",
          toComponent: "component:probe.c",
        },
      ],
      importsWithoutUses: [
        {
          fromComponent: "component:probe.b",
          toComponent: "component:probe.a",
          imports: 1,
          sample: { from: "code/leaf.ts", to: "code/a.ts" },
        },
      ],
      unrealizedComponents: [
        { spec: "spec:probe.missing", componentId: "component:probe.missing" },
        { spec: "spec:probe.unbound", componentId: "component:probe.b" },
        { spec: "spec:probe.wrong-unit", componentId: "component:probe.c" },
      ],
      oneSided: {
        anchoredOnly: ["code/c.ts", "test/probe.test.ts"],
        importsOutsideComponents: ["code/idle.ts", "code/index.ts", "code/loose.ts"],
      },
    });
    expect(JSON.stringify(graph)).toBe(before);
  });

  it("applies the limit only to uncovered rows and counts distinct file pairs", async () => {
    const duplicated = {
      ...imports,
      files: [...imports.files, { file: "code/leaf.ts", imports: ["code/a.ts", "code/a.ts"] }],
    };
    const result = await runRecipe(40, graph, { imports: duplicated, limit: 1 });
    expect(result.uncovered).toEqual([{ file: "code/index.ts", fanIn: 1, fanOut: 1 }]);
    expect(result.totals).toMatchObject({ uncovered: 2, importEdges: 4, usesWithoutImport: 1 });
    expect(result.importsWithoutUses).toEqual([
      {
        fromComponent: "component:probe.b",
        toComponent: "component:probe.a",
        imports: 1,
        sample: { from: "code/leaf.ts", to: "code/a.ts" },
      },
    ]);
  });

  it("aggregates file pairs for a component pair and picks the first sample in path order", async () => {
    const result = await runRecipe(
      40,
      {
        ...graph,
        nodes: [...graph.nodes, unit("impl:probe.second", "code/Z.ts")],
        edges: [...graph.edges, edge("impl:probe.second", "memberOf", "component:probe.b")],
      },
      {
        imports: {
          ...imports,
          files: [...imports.files, { file: "code/Z.ts", imports: ["code/a.ts"] }],
        },
      },
    );
    expect(result.importsWithoutUses).toEqual([
      {
        fromComponent: "component:probe.b",
        toComponent: "component:probe.a",
        imports: 2,
        sample: { from: "code/Z.ts", to: "code/a.ts" },
      },
    ]);
  });

  it("uses code-unit order for tied ranks and samples, and defaults to twenty uncovered rows", async () => {
    const many = {
      ...imports,
      files: [
        ...imports.files,
        ...Array.from({ length: 23 }, (_, index) => ({
          file: `free/${String(index).padStart(2, "0")}.ts`,
          imports: [],
        })),
      ].reverse(),
    };
    const result = await runRecipe(40, graph, { imports: many });
    expect(result.uncovered).toHaveLength(20);
    expect(result.uncovered).toEqual([
      { file: "code/index.ts", fanIn: 1, fanOut: 1 },
      { file: "code/idle.ts", fanIn: 0, fanOut: 0 },
      ...Array.from({ length: 18 }, (_, index) => ({
        file: `free/${String(index).padStart(2, "0")}.ts`,
        fanIn: 0,
        fanOut: 0,
      })),
    ]);
    expect(result.totals).toMatchObject({ uncovered: 25 });
  });

  it("keeps several component bindings in one file and ignores inferred structural edges", async () => {
    const result = await runRecipe(
      40,
      {
        ...graph,
        nodes: [...graph.nodes, unit("component:probe.d", "code/a.ts")],
        edges: [...graph.edges, edge("component:probe.b", "uses", "component:probe.a", "inferred")],
      },
      { imports },
    );
    expect(result.importsWithoutUses).toEqual([
      {
        fromComponent: "component:probe.b",
        toComponent: "component:probe.a",
        imports: 1,
        sample: { from: "code/leaf.ts", to: "code/a.ts" },
      },
      {
        fromComponent: "component:probe.b",
        toComponent: "component:probe.d",
        imports: 1,
        sample: { from: "code/leaf.ts", to: "code/a.ts" },
      },
      {
        fromComponent: "component:probe.d",
        toComponent: "component:probe.b",
        imports: 1,
        sample: { from: "code/a.ts", to: "code/leaf.ts" },
      },
    ]);
  });

  it("builds a small fixture imports file and supplies its object to the recipe, backing uses through a barrel", async () => {
    const root = mkdtempSync(join(repoRoot, "explorations", ".curation-recipe-"));
    try {
      mkdirSync(join(root, "code"));
      writeFileSync(
        join(root, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { module: "esnext", moduleResolution: "bundler" } }),
      );
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({ adapter: "typescript", tsconfig: "tsconfig.json", roots: ["code"] }),
      );
      writeFileSync(
        join(root, "code", "a.ts"),
        'import { leaf } from "./index.js"; export { leaf };',
      );
      writeFileSync(join(root, "code", "index.ts"), 'export * from "./leaf.js";');
      writeFileSync(join(root, "code", "leaf.ts"), "export const leaf = 1;");
      expect(
        runSdpCli(
          ["build", root, "--imports", "imports.config.json"],
          createCaptureOutput().output,
        ),
      ).toBe(0);
      const built: unknown = JSON.parse(
        readFileSync(join(root, "generated", "imports.json"), "utf8"),
      );
      const result = await runRecipe(40, graph, { imports: built });
      expect(result.usesWithoutImport).toEqual([
        {
          from: "component:probe.a",
          to: "component:probe.c",
          fromComponent: "component:probe.a",
          toComponent: "component:probe.c",
        },
      ]);
      expect(result.importsWithoutUses).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 20_000);

  it.each([{}, { imports: {} }, { imports, limit: -1 }, { imports, limit: 1.5 }])(
    "reports missing or malformed parameter data %j",
    async (params) => {
      const recipe = catalog.find((entry) => entry.ordinal === 40);
      const capture = createCaptureOutput();
      const extraction: ExtractionResult = {
        graph,
        report: { validatorId: extractValidatorId, findings: [] },
        counts: { specs: 0, packs: 0, anchors: 0 },
      };
      expect(
        await runSdpCli(
          [
            "q",
            recipe?.content ?? "",
            "--root",
            repoRoot,
            "--params",
            JSON.stringify(params),
            "--json",
          ],
          capture.output,
          { query: { extract: () => extraction } },
        ),
      ).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(JSON.parse(capture.readStdout())).toEqual({
        diagnostics: [
          Object.hasOwn(params, "limit")
            ? { parameter: "limit", problem: "Expected a positive integer." }
            : { parameter: "imports", problem: "Supply an sdp-imports/1 object." },
        ],
      });
    },
  );
});

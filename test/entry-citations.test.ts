import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanEntryCitations } from "../src/extract/entry-citations.js";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  EntryCitationsConditions,
  EntryCitationsOutcome,
} from "../generated/contracts/extraction.entry-citations.space.js";
import { testTitleCitesDeclarationContract } from "../generated/contracts/extraction.entry-citations.test-title-cites-declaration.contract.js";
import { codeCommentCitesDeclarationContract } from "../generated/contracts/extraction.entry-citations.code-comment-cites-declaration.contract.js";
import { unanchoredFileUnreadContract } from "../generated/contracts/extraction.entry-citations.unanchored-file-unread.contract.js";
import { unresolvedCitationContract } from "../generated/contracts/extraction.entry-citations.unresolved-citation.contract.js";
import { registerTestTitleCitesDeclaration } from "./extraction.entry-citations.test-title-cites-declaration.test.generated.js";
import { registerCodeCommentCitesDeclaration } from "./extraction.entry-citations.code-comment-cites-declaration.test.generated.js";
import { registerUnanchoredFileUnread } from "./extraction.entry-citations.unanchored-file-unread.test.generated.js";
import { registerUnresolvedCitation } from "./extraction.entry-citations.unresolved-citation.test.generated.js";
import {
  createReader,
  extract,
  serializeGraph,
  validateGraph,
  ENTRY_ADDRESS_SECTIONS,
} from "../src/index.js";
import type { EntryCitation, ExtractionResult } from "../src/index.js";

const oracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.entry-citations"),
  models: ref("spec:extraction.entry-citations"),
});
void oracleAnchor;

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
const subject = "spec:probe.one";
const countStep = "the Spec context lists {citations} entry citations";
const recordedStep = "the citation {recorded}";
const testLineStep = "the citing line reads as a test line: {testLine}";
const exitStep = "the shipped entry-citations file named as a rules file exits {exitCode}";

interface World {
  root: string;
  point: Partial<EntryCitationsConditions>;
  result?: ExtractionResult;
  rows?: readonly EntryCitation[];
  code?: number;
  stderr?: string;
  stdout?: string;
}
function expectedCount(point: Partial<EntryCitationsConditions>): number {
  return point.anchored === "carries no anchor" ? 0 : 1;
}
function expected(point: Partial<EntryCitationsConditions>): EntryCitationsOutcome {
  return point.anchored === undefined
    ? unspecified
    : { kind: countStep, citations: expectedCount(point) };
}
function createWorld(point: Partial<EntryCitationsConditions>): World {
  const root = mkdtempSync(join(tmpdir(), "sdp-entry-citations-"));
  roots.push(root);
  writeFileSync(
    join(root, "one.sdp.md"),
    `---
id: ${subject}
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# One

## Intent
- outcome: Pin one declaration.

## Design
- typeOne: \`type One = string\`
`,
  );
  const lines: string[] = [];
  if (point.anchored === "carries a test anchor verifying the Spec") {
    lines.push(
      'import {ref, specTest, testAnchorId} from "@libar-dev/software-delivery-protocol";',
      `const anchor = specTest({id: testAnchorId("test:probe.one"), verifies: ref("${subject}")});`,
    );
  } else if (point.anchored === "carries a code anchor referencing the Spec") {
    lines.push("/**", " * @sdpAnchor impl:probe.one", ` * @sdpReferences ${subject}`, " */");
  }
  while (lines.length < (point.line ?? 9) - 1) lines.push("");
  lines.push(
    point.anchored === "carries a code anchor referencing the Spec"
      ? `// ${point.address}`
      : `test("${point.address}", () => {});`,
  );
  writeFileSync(join(root, "source.ts"), lines.join("\n") + "\n");
  return { root, point };
}
function invoke(world: World): void {
  const result = extract({ root: world.root });
  world.result = result;
  const context = createReader(result.graph).specContext(subject);
  expect(context).toHaveProperty("entryCitations");
  world.rows = context?.entryCitations ?? [];
  const execution = spawnSync(
    process.execPath,
    [
      resolve("dist/cli/sdp.js"),
      "validate",
      world.root,
      "--rules",
      resolve("dist/recipes/51-entry-citations.js"),
    ],
    { encoding: "utf8" },
  );
  world.code = execution.status ?? -1;
  world.stderr = execution.stderr;
  world.stdout = execution.stdout;
}
function observe(world: World): EntryCitationsOutcome {
  return { kind: countStep, citations: world.rows?.length ?? 0 };
}
function assertions(contract: {
  readonly steps: readonly {
    readonly text: string;
    readonly params: Readonly<Record<string, unknown>>;
  }[];
}) {
  return (world: World) => {
    const rows = world.rows ?? [];
    const resolves = world.point.address === world.point.declaration;
    const recorded =
      rows.length === 0 ? "is not recorded" : rows[0]?.resolves ? "resolves" : "does not resolve";
    expect(contract.steps.find((step) => step.text === recordedStep)?.params.recorded).toBe(
      recorded,
    );
    const hasStep = (text: string) => contract.steps.some((step) => step.text === text);
    if (hasStep(testLineStep))
      expect(contract.steps.find((step) => step.text === testLineStep)?.params.testLine).toBe(
        (rows[0]?.testAnchors.length ?? 0) > 0,
      );
    if (hasStep(exitStep)) {
      const exitCode = contract.steps.find((step) => step.text === exitStep)?.params.exitCode;
      expect(world.code, world.stderr).toBe(exitCode);
      expect(world.stdout).toContain(
        `corpus rules: ${exitCode === 1 ? "1" : "0"} errors · 0 warnings · 0 of 1 files failed`,
      );
    }
    const result = world.result;
    if (result === undefined) throw new Error("The world must derive a graph.");
    expect(result.report.findings).toEqual([]);
    expect(
      validateGraph(result.graph).findings.filter(
        (finding) => finding.severity === "error" || finding.relatedId?.includes("#"),
      ),
    ).toEqual([]);
    if (expectedCount(world.point) === 1) {
      expect(rows).toEqual([
        {
          address: world.point.address,
          entry: resolves ? "design.typeOne" : null,
          resolves,
          reason: resolves ? null : "entry",
          file: "source.ts",
          line: world.point.line,
          anchors: [
            world.point.anchored === "carries a code anchor referencing the Spec"
              ? "impl:probe.one"
              : "test:probe.one",
          ],
          testAnchors:
            world.point.anchored === "carries a test anchor verifying the Spec"
              ? ["test:probe.one"]
              : [],
          claim: "inferred",
        },
      ]);
    }
  };
}

const testTitleCitesDeclarationTestAnchor = specTest({
  id: testAnchorId("test:protocol.entry-citations.test-title-cites-declaration"),
  verifies: ref("spec:extraction.entry-citations.test-title-cites-declaration"),
});
void testTitleCitesDeclarationTestAnchor;
const codeCommentCitesDeclarationTestAnchor = specTest({
  id: testAnchorId("test:protocol.entry-citations.code-comment-cites-declaration"),
  verifies: ref("spec:extraction.entry-citations.code-comment-cites-declaration"),
});
void codeCommentCitesDeclarationTestAnchor;
const unanchoredFileUnreadTestAnchor = specTest({
  id: testAnchorId("test:protocol.entry-citations.unanchored-file-unread"),
  verifies: ref("spec:extraction.entry-citations.unanchored-file-unread"),
});
void unanchoredFileUnreadTestAnchor;
const unresolvedCitationTestAnchor = specTest({
  id: testAnchorId("test:protocol.entry-citations.unresolved-citation"),
  verifies: ref("spec:extraction.entry-citations.unresolved-citation"),
});
void unresolvedCitationTestAnchor;

registerTestTitleCitesDeclaration({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: assertions(testTitleCitesDeclarationContract),
});
registerCodeCommentCitesDeclaration({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: assertions(codeCommentCitesDeclarationContract),
});
registerUnanchoredFileUnread({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: assertions(unanchoredFileUnreadContract),
});
registerUnresolvedCitation({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: assertions(unresolvedCitationContract),
});

describe("entry citation extraction and reader", () => {
  const point = {
    declaration: `${subject}#design.typeOne`,
    address: `${subject}#design.typeOne`,
    anchored: "carries a test anchor verifying the Spec",
    line: 9,
  } as const;
  it("scans comments, strings and templates, deduplicates a line and keeps code-unit order", () => {
    const world = createWorld(point);
    const path = join(world.root, "source.ts");
    const source = readFileSync(path, "utf8");
    const address = point.address;
    writeFileSync(
      path,
      source +
        `// ${address}., ${address}! ${subject}#ui.Zed\r\nconst template = \`${subject}#question.choice\`;\r\nconst value = "${subject}";\n`,
    );
    writeFileSync(
      join(world.root, "Z.ts"),
      `/**\n * @sdpAnchor oracle:probe.space\n * @sdpModels ${subject}\n */\n// ${address}\n`,
    );
    const graph = extract({ root: world.root }).graph;
    expect(graph.citations).toEqual([
      { address, file: "Z.ts", line: 5 },
      { address, file: "source.ts", line: 9 },
      { address, file: "source.ts", line: 10 },
      { address: `${subject}#ui.Zed`, file: "source.ts", line: 10 },
      { address: `${subject}#question.choice`, file: "source.ts", line: 11 },
    ]);
    expect(serializeGraph({ ...graph, citations: [...(graph.citations ?? [])].reverse() })).toBe(
      serializeGraph(graph),
    );
    expect(serializeGraph(extract({ root: world.root }).graph)).toBe(serializeGraph(graph));
    expect(
      extract({ root: world.root, exclude: ["Z.ts"] }).graph.citations?.every(
        (row) => row.file !== "Z.ts",
      ),
    ).toBe(true);
  });
  it("records no citation for a token continued by interpolation, even when its prefix parses", () => {
    const world = createWorld(point);
    const file = join(world.root, "source.ts");
    writeFileSync(
      file,
      readFileSync(file, "utf8") +
        'const key = "typeOne";\n' +
        "test(`spec:probe.one#design.${key}`, () => {});\n" +
        "test(`spec:probe.one#design.typeOne${key}`, () => {});\n",
    );
    const graph = extract({ root: world.root }).graph;
    expect(graph.citations).toEqual([{ address: point.address, file: "source.ts", line: 9 }]);
    invoke(world);
    expect(world.code, world.stderr).toBe(0);
  });
  it("keeps a literal malformed token beside an interpolated token on the same line", () => {
    const source =
      'const literal = "spec:probe.one#design.$"; const dynamic = `spec:probe.one#design.${key}`;';
    expect(scanEntryCitations(source, "source.ts")).toEqual([
      { address: "spec:probe.one#design.$", file: "source.ts", line: 1 },
    ]);
  });
  it("keeps a malformed literal before a separate template interpolation", () => {
    expect(scanEntryCitations('test("spec:probe.one#design.$", `${key}`);', "source.ts")).toEqual([
      { address: "spec:probe.one#design.$", file: "source.ts", line: 1 },
    ]);
  });
  it("records no citation for a prefix with trailing punctuation before interpolation", () => {
    expect(
      scanEntryCitations("const title = `spec:probe.one#design.typeOne.${key}`;", "source.ts"),
    ).toEqual([]);
  });
  it("does not report a computed order key as an unresolved citation in recipe 51", async () => {
    const { evaluateBody } = await import("../src/reader/evaluate-body.js");
    const world = createWorld(point);
    const carrier = join(world.root, "one.sdp.md");
    writeFileSync(
      carrier,
      readFileSync(carrier, "utf8") +
        "- orderCreated: `type Created = string`\n- orderShipped: `type Shipped = string`\n",
    );
    const file = join(world.root, "source.ts");
    writeFileSync(
      file,
      readFileSync(file, "utf8") +
        'for (const kind of ["Created", "Shipped"]) {\n' +
        "  test(`spec:probe.one#design.order${kind}`, () => {});\n}\n",
    );
    const graph = extract({ root: world.root }).graph;
    expect(graph.citations).toEqual([{ address: point.address, file: "source.ts", line: 9 }]);
    expect(await evaluateBody("return recipes(51)", { graph })).toMatchObject({
      unresolved: [],
      findings: [],
    });
    invoke(world);
    expect(world.code, world.stderr).toBe(0);
  });
  it("recipe 51 locates a citation of the second keyed question", async () => {
    const { evaluateBody } = await import("../src/reader/evaluate-body.js");
    const world = createWorld(point);
    const carrier = join(world.root, "one.sdp.md");
    const text = readFileSync(carrier, "utf8").replace(
      "## Design",
      "### Open questions\n- [non-blocking #first] First?\n- [non-blocking #second] Second?\n\n## Design",
    );
    writeFileSync(carrier, text);
    const file = join(world.root, "source.ts");
    writeFileSync(file, readFileSync(file, "utf8") + "// spec:probe.one#question.second\n");
    const graph = extract({ root: world.root }).graph;
    expect(createReader(graph).specContext(subject)?.entryCitations).toContainEqual(
      expect.objectContaining({
        address: `${subject}#question.second`,
        entry: "question[1]",
        resolves: true,
      }),
    );
    const answer = await evaluateBody("return recipes(51)", { graph });
    expect(answer).toMatchObject({
      findings: [],
      entries: expect.arrayContaining([
        expect.objectContaining({
          address: `${subject}#question.second`,
          line: text.split("\n").findIndex((line) => line.includes("#second]")) + 1,
          citedBy: [
            {
              file: "source.ts",
              line: 10,
              anchors: ["test:probe.one"],
              testAnchors: ["test:probe.one"],
            },
          ],
        }),
      ]),
    });
  });
  it("ends citation tokens at source escapes before checking for an address", () => {
    const world = createWorld(point);
    const file = join(world.root, "source.ts");
    writeFileSync(
      file,
      readFileSync(file, "utf8") +
        String.raw`const fixture = "---\nid: spec:probe.one\n---\n## H";` +
        "\n" +
        String.raw`const address = "spec:probe.one#design.typeOne\n## H";` +
        "\n",
    );
    const graph = extract({ root: world.root }).graph;
    expect(graph.citations).toEqual([
      { address: point.address, file: "source.ts", line: 9 },
      { address: point.address, file: "source.ts", line: 11 },
    ]);
  });
  it("sorts in-memory citations by address on a shared source line", () => {
    const world = createWorld(point);
    const file = join(world.root, "source.ts");
    writeFileSync(file, readFileSync(file, "utf8") + `// ${subject}#ui.a ${subject}#design.b\n`);
    expect(extract({ root: world.root }).graph.citations?.slice(-2)).toEqual([
      { address: `${subject}#design.b`, file: "source.ts", line: 10 },
      { address: `${subject}#ui.a`, file: "source.ts", line: 10 },
    ]);
  });
  it("sorts reader citations by address before file and line", () => {
    const world = createWorld(point);
    const graph = extract({ root: world.root }).graph;
    const citations = [
      { address: `${subject}#ui.z`, file: "a.ts", line: 1 },
      { address: point.address, file: "z.ts", line: 9 },
      { address: point.address, file: "b.ts", line: 8 },
      { address: point.address, file: "b.ts", line: 2 },
    ];
    expect(
      createReader({ ...graph, citations })
        .specContext(subject)
        ?.entryCitations.map(({ address, file, line }) => ({ address, file, line })),
    ).toEqual([citations[3], citations[2], citations[1], citations[0]]);
  });
  it("rejects a crashed rules file even when its exit code matches the example", () => {
    const world = createWorld({ ...point, address: `${subject}#design.typeTwo` });
    invoke(world);
    expect(world.code).toBe(1);
    world.stdout = "corpus rules: 0 errors · 0 warnings · 1 of 1 files failed\n";
    expect(() => {
      assertions(unresolvedCitationContract)(world);
    }).toThrow();
  });
  it("counts Unicode source line separators as TypeScript does", () => {
    const world = createWorld(point);
    const file = join(world.root, "source.ts");
    writeFileSync(
      file,
      readFileSync(file, "utf8") +
        `// ${point.address}\u2028// ${point.address}\u2029// ${point.address}`,
    );
    expect(extract({ root: world.root }).graph.citations?.map((row) => row.line)).toEqual([
      9, 10, 11, 12,
    ]);
  });
  it("reads a file carrying only an identity anchor, and ignores carriers and unanchored sources", () => {
    const world = createWorld({ ...point, anchored: "carries no anchor" });
    writeFileSync(
      join(world.root, "identity.tsx"),
      `/**\n * @sdpAnchor impl:probe.identity\n */\n// ${point.address}\n`,
    );
    const graph = extract({ root: world.root }).graph;
    expect(graph.citations).toEqual([{ address: point.address, file: "identity.tsx", line: 4 }]);
    expect(createReader(graph).specContext(subject)?.entryCitations[0]).toMatchObject({
      anchors: ["impl:probe.identity"],
      testAnchors: [],
    });
  });
  it("includes only tests in the citing file that verify directly or through an example", () => {
    const world = createWorld(point);
    writeFileSync(
      join(world.root, "example.sdp.md"),
      `---\nid: spec:probe.example\nkind: example\naltitude: story\nreadiness: idea\nrelations:\n  verifies: ${subject}\n---\n# Example\n\n## Intent\n- outcome: Verify the subject.\n`,
    );
    writeFileSync(
      join(world.root, "source.ts"),
      `/**\n * @sdpAnchor test:probe.indirect\n * @sdpVerifies spec:probe.example\n */\n/**\n * @sdpAnchor test:probe.unrelated\n * @sdpVerifies spec:probe.other\n */\n/**\n * @sdpAnchor impl:probe.code\n */\n// ${point.address}\n`,
    );
    writeFileSync(
      join(world.root, "other.ts"),
      `/**\n * @sdpAnchor test:probe.elsewhere\n * @sdpVerifies ${subject}\n */\n`,
    );
    const graph = extract({ root: world.root }).graph;
    expect(createReader(graph).specContext(subject)?.entryCitations[0]).toMatchObject({
      anchors: ["impl:probe.code", "test:probe.indirect", "test:probe.unrelated"],
      testAnchors: ["test:probe.indirect"],
    });
    const stripped = { ...graph, citations: [] };
    expect(createReader(stripped).specs()).toEqual(createReader(graph).specs());
    expect(validateGraph(stripped)).toEqual(validateGraph(graph));
    expect(stripped.nodes).toEqual(graph.nodes);
    expect(stripped.edges).toEqual(graph.edges);
  });
  it("reads a newly shared term address through termKeys even without location rows", () => {
    const world = createWorld(point);
    const graph = extract({ root: world.root }).graph;
    const model = {
      terms: { "First term": "Its definition", "Second term": "Another definition" },
      termKeys: { first: "First term", second: "Second term" },
    };
    const candidate = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === subject && node.nodeType === "Primitive"
          ? { ...node, sections: { ...node.sections, model } }
          : node,
      ),
      locations: [],
      citations: [{ address: `${subject}#term.second`, file: "source.ts", line: 9 }],
    };
    // Simulate K extending the shared grammar. No citation parser has its own section list.
    const sections = ENTRY_ADDRESS_SECTIONS as unknown as string[];
    const added = !sections.includes("term");
    if (added) sections.push("term");
    try {
      expect(
        validateGraph({
          ...candidate,
          nodes: candidate.nodes.map((node) =>
            node.id === subject && node.nodeType === "Primitive"
              ? { ...node, narrative: `${subject}#term.second` }
              : node,
          ),
        }).findings.filter((finding) => finding.severity === "error"),
      ).toEqual([]);
      expect(createReader(candidate).specContext(subject)?.entryCitations[0]).toMatchObject({
        resolves: true,
        entry: "term[1]",
        reason: null,
      });
    } finally {
      if (added) sections.pop();
    }
  });
  it("does not treat future address sections as Model terms", () => {
    const world = createWorld(point);
    const graph = extract({ root: world.root }).graph;
    const candidate = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === subject && node.nodeType === "Primitive"
          ? {
              ...node,
              sections: {
                ...node.sections,
                model: {
                  terms: { "A term": "Definition" },
                  termKeys: { a: "A term" },
                },
              },
            }
          : node,
      ),
      citations: [{ address: `${subject}#future.a`, file: "source.ts", line: 9 }],
    };
    const sections = ENTRY_ADDRESS_SECTIONS as unknown as string[];
    sections.push("future");
    try {
      expect(createReader(candidate).specContext(subject)?.entryCitations[0]).toMatchObject({
        resolves: false,
        reason: "malformed",
        entry: null,
      });
    } finally {
      sections.pop();
    }
  });
  it("resolves UI, rules, flows and questions without depending on entry locations", () => {
    const world = createWorld(point);
    const graph = extract({ root: world.root }).graph;
    const extended = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === subject && node.nodeType === "Primitive"
          ? {
              ...node,
              sections: {
                ...node.sections,
                ui: { page: "A page" },
                behavior: {
                  rules: ["A rule"],
                  flows: ["A flow"],
                  ruleKeys: { one: "rules[0]" as const, two: "flows[0]" as const },
                },
                intent: {
                  outcome: "Probe",
                  openQuestions: [{ key: "choice", question: "Which?" }],
                },
              },
            }
          : node,
      ),
      locations: [],
      citations: [
        "ui.page",
        "rule.one",
        "rule.two",
        "question.choice",
        "design.absent",
        "ui.description",
        "bad.key",
        "design.bad_key",
      ].map((suffix) => ({ address: `${subject}#${suffix}`, file: "source.ts", line: 9 })),
    };
    const rows = createReader(extended).specContext(subject)?.entryCitations ?? [];
    expect(rows.filter((row) => row.resolves).map((row) => row.entry)).toEqual([
      "question[0]",
      "rule[0]",
      "flow[0]",
      "ui.page",
    ]);
    expect(rows.filter((row) => !row.resolves).map((row) => [row.address, row.reason])).toEqual([
      [`${subject}#bad.key`, "malformed"],
      [`${subject}#design.absent`, "entry"],
      [`${subject}#design.bad_key`, "malformed"],
      [`${subject}#ui.description`, "entry"],
    ]);
    const { citations: _citations, ...absent } = graph;
    void _citations;
    expect(createReader(absent).specContext(subject)?.entryCitations).toEqual([]);
    expect(JSON.parse(serializeGraph(absent))).toHaveProperty("citations", []);
  });
});

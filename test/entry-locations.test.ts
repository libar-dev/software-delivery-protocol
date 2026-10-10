import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { extract, reifyMarkdownCarrier, serializeGraph } from "../src/index.js";
import type { GraphSchema } from "../src/graph/schema.js";
import { deriveGraph } from "../src/extract/derive.js";
import { serializeGraphStructure } from "./helpers/graph-structure.js";

const entryLocationsTestAnchor = specTest({
  id: testAnchorId("test:protocol.entry-locations"),
  verifies: ref("spec:extraction.entry-locations"),
});
void entryLocationsTestAnchor;

const roots: string[] = [];
function corpus(file: string, source: string): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-entry-locations-"));
  roots.push(root);
  writeFileSync(join(root, file), source, "utf8");
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

const markdown = `---
id: spec:fixture.locations
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Entry locations

## Intent
- outcome: Locate authored entries.

### Open questions
- [non-blocking #choice] Which choice?
- [blocking] Who decides?

## Design
Design prose has no row.

- zeta: Last entry. More on the last entry.

- alpha: First entry.

## UI
UI prose has no row.

- screen: The screen.
`;

const typeScript = `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const subject = spec({
  id: specId("spec:fixture.locations"),
  title: "Entry locations",
  kind: "behavior", altitude: "story", readiness: "idea",
  intent: {
    outcome: "Locate authored entries.",
    openQuestions: [
      {
        key: "choice",
        question: "Which choice?",
        blocking: false,
      },
      { question: "Who decides?", blocking: true },
    ],
  },
  design: ({
    description: "Design prose has no row.",
    zeta: "Last entry. More on the last entry.",
    alpha: "First entry.",
  } as const),
  ui: { description: "UI prose has no row.", screen: "The screen." },
});
`;

const gherkin = `@spec.fixture.gherkin-locations @altitude.story @readiness.idea
Feature: Gherkin locations
  - outcome: Use the closed Gherkin description grammar.

  @spec.fixture.gherkin-locations.child @altitude.story @readiness.idea
  Scenario: A child
    Given a carrier
    When extracted
    Then the graph is derived

  Rule: The carrier has no open-question field.
`;

describe("entry locations", () => {
  it("records Markdown Design, UI, keyed and unkeyed questions at their first item lines", () => {
    const { graph, report } = extract({ root: corpus("subject.sdp.md", markdown) });
    expect(report.findings).toEqual([]);
    expect(graph.locations).toEqual([
      { spec: "spec:fixture.locations", file: "subject.sdp.md", entry: "design.alpha", line: 22 },
      { spec: "spec:fixture.locations", file: "subject.sdp.md", entry: "design.zeta", line: 20 },
      {
        spec: "spec:fixture.locations",
        file: "subject.sdp.md",
        entry: "question[0]",
        key: "choice",
        line: 14,
      },
      { spec: "spec:fixture.locations", file: "subject.sdp.md", entry: "question[1]", line: 15 },
      { spec: "spec:fixture.locations", file: "subject.sdp.md", entry: "ui.screen", line: 27 },
    ]);
  });

  it("records TypeScript property lines through transparent wrappers", () => {
    const { graph, report } = extract({ root: corpus("subject.sdp.ts", typeScript) });
    expect(report.findings).toEqual([]);
    expect(graph.locations).toEqual([
      { spec: "spec:fixture.locations", file: "subject.sdp.ts", entry: "design.alpha", line: 20 },
      { spec: "spec:fixture.locations", file: "subject.sdp.ts", entry: "design.zeta", line: 19 },
      {
        spec: "spec:fixture.locations",
        file: "subject.sdp.ts",
        entry: "question[0]",
        key: "choice",
        line: 11,
      },
      { spec: "spec:fixture.locations", file: "subject.sdp.ts", entry: "question[1]", line: 14 },
      { spec: "spec:fixture.locations", file: "subject.sdp.ts", entry: "ui.screen", line: 22 },
    ]);
  });

  it("locates TypeScript string questions and omits properties dropped as non-static", () => {
    const source = typeScript
      .replace("openQuestions: [", 'openQuestions: [\n      "A prose question",')
      .replace('alpha: "First entry."', "alpha: dynamicValue");
    const { graph, report } = extract({ root: corpus("subject.sdp.ts", source) });
    expect(report.findings.map((finding) => finding.validatorId)).toEqual([
      "extract/non-static-section",
    ]);
    expect(graph.locations).toContainEqual({
      spec: "spec:fixture.locations",
      file: "subject.sdp.ts",
      entry: "question[0]",
      line: 9,
    });
    expect(graph.locations).not.toContainEqual(expect.objectContaining({ entry: "design.alpha" }));
  });

  it("emits no Gherkin rows because its closed grammar carries no open questions", () => {
    const root = corpus("subject.sdp.gherkin", gherkin);
    const result = extract({ root });
    expect(result.report.findings).toEqual([]);
    expect(result.graph.nodes).toHaveLength(2);
    expect(result.graph.locations).toEqual([]);
    writeFileSync(
      join(root, "subject.sdp.gherkin"),
      gherkin.replace("  - outcome:", "  - openQuestions: Which choice?\n  - outcome:"),
    );
    const refused = extract({ root });
    expect(refused.graph.locations).toEqual([]);
    const grammarFinding = refused.report.findings.find(
      (finding) => finding.validatorId === "extract/gherkin-grammar",
    );
    expect(grammarFinding?.message).toContain(
      'description key "openQuestions" is outside the closed set',
    );
  });

  it("sorts Specs and entries in code-unit order and serializes reversed rows identically", () => {
    const root = corpus("z.sdp.md", markdown.replace("spec:fixture.locations", "spec:fixture.a"));
    writeFileSync(
      join(root, "a.sdp.md"),
      markdown.replace("spec:fixture.locations", "spec:fixture.Z"),
    );
    const graph = extract({ root }).graph;
    expect(graph.locations?.map(({ spec, entry }) => `${spec}#${entry}`)).toEqual([
      "spec:fixture.Z#design.alpha",
      "spec:fixture.Z#design.zeta",
      "spec:fixture.Z#question[0]",
      "spec:fixture.Z#question[1]",
      "spec:fixture.Z#ui.screen",
      "spec:fixture.a#design.alpha",
      "spec:fixture.a#design.zeta",
      "spec:fixture.a#question[0]",
      "spec:fixture.a#question[1]",
      "spec:fixture.a#ui.screen",
    ]);
    expect(serializeGraph({ ...graph, locations: [...(graph.locations ?? [])].reverse() })).toBe(
      serializeGraph(graph),
    );
  });

  it("keeps Primitive and Pack nodes line-free when an edit above entries moves their lines", () => {
    const root = corpus("subject.sdp.md", markdown);
    writeFileSync(
      join(root, "group.pack.sdp.md"),
      `---\nid: pack:fixture.locations\nspecs:\n  - spec:fixture.locations\n---\n# Location group\n`,
    );
    const first = extract({ root }).graph;
    writeFileSync(join(root, "subject.sdp.md"), markdown.replace("## Intent", "\n\n## Intent"));
    const second = extract({ root }).graph;
    expect(serializeGraphStructure(second)).toBe(serializeGraphStructure(first));
    expect(second.locations).toEqual(
      first.locations?.map((row) => ({ ...row, line: row.line + 2 })),
    );
    for (const node of second.nodes) {
      expect(node).not.toHaveProperty("line");
      expect(node).not.toHaveProperty("entryLines");
      expect(node).not.toHaveProperty("locations");
    }
    expect(second.nodes.map((node) => node.nodeType).sort()).toEqual(["Pack", "Primitive"]);
  });

  it("compares carrier parity on nodes and edges while locations differ", () => {
    const markdownGraph = extract({ root: corpus("subject.sdp.md", markdown) }).graph;
    const typeScriptGraph = extract({ root: corpus("subject.sdp.ts", typeScript) }).graph;
    expect(markdownGraph.locations).not.toEqual(typeScriptGraph.locations);
    expect(
      serializeGraphStructure(markdownGraph).replaceAll("subject.sdp.md", "subject.carrier"),
    ).toBe(
      serializeGraphStructure(typeScriptGraph).replaceAll("subject.sdp.ts", "subject.carrier"),
    );
  });

  it("serializes an empty table for entries without recorded carrier lines", () => {
    const reified = reifyMarkdownCarrier(markdown, "subject.sdp.md");
    const specs = reified.specs.map(({ data, id, file, line }) => ({ data, id, file, line }));
    const graph = deriveGraph(specs, [], []);
    expect(graph.locations).toEqual([]);
    expect(
      (
        JSON.parse(
          serializeGraph({
            schemaVersion: graph.schemaVersion,
            nodes: graph.nodes,
            edges: graph.edges,
          }),
        ) as GraphSchema
      ).locations,
    ).toEqual([]);
  });

  it("extracts the location table byte-identically twice", () => {
    const root = corpus("subject.sdp.md", markdown);
    expect(serializeGraph(extract({ root }).graph)).toBe(serializeGraph(extract({ root }).graph));
  });
});

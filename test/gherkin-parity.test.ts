import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { extract, generateContracts, serializeGraph } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";
import { materializeGherkinCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

import { serializeGraphStructure } from "./helpers/graph-structure.js";

const temporaryRoots: string[] = [];

function materialize(name: string): string {
  const root = materializeGherkinCorpus(name);
  temporaryRoots.push(root);
  return root;
}

/** A parity root holding only the carriers of one suffix, one canonical surface per id. */
function parityRoot(keptSuffix: ".sdp.md" | ".sdp.gherkin"): string {
  const root = materialize("parity");
  const droppedSuffix = keptSuffix === ".sdp.md" ? ".sdp.gherkin" : ".sdp.md";
  for (const name of readdirSync(root)) {
    if (name.endsWith(droppedSuffix)) rmSync(join(root, name));
  }
  return root;
}

/** The graph structure with every node's carrier file replaced by one carrier-neutral name. */
function carrierNeutralStructure(graph: GraphSchema): string {
  const structure = JSON.parse(serializeGraphStructure(graph)) as {
    readonly nodes: readonly Record<string, unknown>[];
  };
  return JSON.stringify({
    ...structure,
    nodes: structure.nodes.map((node) =>
      typeof node.file === "string" ? { ...node, file: "carrier" } : node,
    ),
  });
}

describe("Gherkin carrier graph parity", () => {
  afterEach(() => {
    for (const root of temporaryRoots.splice(0)) removeMaterializedCorpus(root);
  });

  it("serializes the Markdown and Gherkin twins identically modulo carrier files", () => {
    const markdown = extract({ root: parityRoot(".sdp.md") });
    const gherkin = extract({ root: parityRoot(".sdp.gherkin") });
    const markdownContracts = generateContracts(markdown.graph);
    const gherkinContracts = generateContracts(gherkin.graph);

    expect(markdown.report.findings).toEqual([]);
    expect(gherkin.report.findings).toEqual([]);
    expect(
      markdown.graph.nodes
        .filter((node) => node.nodeType === "Primitive")
        .map((node) => node.id)
        .sort(),
    ).toEqual(["spec:fixture.parity-twin", "spec:fixture.parity-twin.child"]);
    expect(carrierNeutralStructure(markdown.graph)).toBe(carrierNeutralStructure(gherkin.graph));
    expect(markdownContracts.findings).toEqual([]);
    expect(gherkinContracts.findings).toEqual([]);
    expect([...markdownContracts.files.keys()]).toContain("fixture.parity-twin.child.contract.ts");
    expect([...gherkinContracts.files.keys()]).toContain("fixture.parity-twin.child.contract.ts");
    expect([...markdownContracts.files]).toEqual([...gherkinContracts.files]);
  });

  it("repeats extraction and contract generation byte-identically", () => {
    const root = materialize("parent-child");

    const first = extract({ root });
    const second = extract({ root });
    const firstContracts = generateContracts(first.graph);
    const secondContracts = generateContracts(second.graph);

    expect(serializeGraph(first.graph)).toBe(serializeGraph(second.graph));
    expect(
      serializeGraph({
        ...first.graph,
        nodes: [...first.graph.nodes].reverse(),
        edges: [...first.graph.edges].reverse(),
      }),
    ).toBe(serializeGraph(first.graph));
    expect([...firstContracts.files]).toEqual([...secondContracts.files]);
    expect(firstContracts.findings).toEqual(secondContracts.findings);
  });

  it("excludes both cross-carrier duplicate sites and every duplicate-sourced edge", () => {
    const root = materialize("duplicate-surface");
    const result = extract({ root });
    const duplicates = result.report.findings.filter(
      (finding) => finding.validatorId === "extract/duplicate-id",
    );

    expect(duplicates).toHaveLength(2);
    expect(duplicates.map((finding) => finding.file)).toEqual([
      "a-duplicate.sdp.gherkin",
      "b-duplicate.sdp.md",
    ]);
    expect(
      duplicates.every((finding) => finding.subjectId === "spec:fixture.surface-duplicate"),
    ).toBe(true);
    expect(result.graph.nodes.some((node) => node.id === "spec:fixture.surface-duplicate")).toBe(
      false,
    );
    expect(
      result.graph.edges.some(
        (edge) =>
          edge.from === "spec:fixture.surface-duplicate" ||
          edge.to === "spec:fixture.surface-duplicate",
      ),
    ).toBe(false);
    expect(result.graph.nodes).toContainEqual(
      expect.objectContaining({
        id: "spec:fixture.surface-sibling",
        nodeType: "Primitive",
        specKind: "example",
      }),
    );
  });

  it("excludes a semantically invalid carrier whole while a healthy sibling survives", () => {
    const root = materialize("multi-finding");
    const result = extract({ root });

    expect(result.report.findings).toHaveLength(4);
    expect(result.report.findings.map(({ file, line }) => ({ file, line }))).toEqual([
      { file: "invalid.sdp.gherkin", line: 1 },
      { file: "invalid.sdp.gherkin", line: 3 },
      { file: "invalid.sdp.gherkin", line: 4 },
      { file: "invalid.sdp.gherkin", line: 5 },
    ]);
    expect(result.graph.nodes).toEqual([
      expect.objectContaining({
        id: "spec:fixture.healthy-sibling",
        nodeType: "Primitive",
      }),
    ]);
    expect(result.graph.edges).toEqual([]);
    expect(result.counts.specs).toBe(1);
  });

  it("repeats invalid carrier derivation deterministically", () => {
    const root = materialize("multi-finding");

    const first = extract({ root });
    const second = extract({ root });

    expect(second.report.findings).toEqual(first.report.findings);
    expect(serializeGraph(second.graph)).toBe(serializeGraph(first.graph));
    expect(second.counts).toEqual(first.counts);
  });
});

import { rmSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { extract, generateContracts, serializeGraph } from "../src/index.js";
import { materializeGherkinCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const temporaryRoots: string[] = [];

function materialize(name: string): string {
  const root = materializeGherkinCorpus(name);
  temporaryRoots.push(root);
  return root;
}

describe("Gherkin carrier graph parity", () => {
  afterEach(() => {
    for (const root of temporaryRoots.splice(0)) removeMaterializedCorpus(root);
  });

  it("serializes the Markdown and Gherkin twins identically modulo carrier filename", () => {
    const markdownRoot = materialize("parity");
    const gherkinRoot = materialize("parity");
    rmSync(join(markdownRoot, "twin.sdp.gherkin"));
    rmSync(join(gherkinRoot, "twin.sdp.md"));

    const markdown = extract({ root: markdownRoot });
    const gherkin = extract({ root: gherkinRoot });
    const markdownGraph = serializeGraph(markdown.graph).replaceAll("twin.sdp.md", "twin.carrier");
    const gherkinGraph = serializeGraph(gherkin.graph).replaceAll(
      "twin.sdp.gherkin",
      "twin.carrier",
    );
    const markdownContracts = generateContracts(markdown.graph);
    const gherkinContracts = generateContracts(gherkin.graph);

    expect(markdown.report.findings).toEqual([]);
    expect(gherkin.report.findings).toEqual([]);
    expect(markdownGraph).toBe(gherkinGraph);
    expect(markdownContracts.findings).toEqual([]);
    expect(gherkinContracts.findings).toEqual([]);
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

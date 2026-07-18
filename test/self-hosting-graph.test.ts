import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, validateGraph } from "../src/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const expectedSpecs = [
  {
    id: "spec:carrier.markdown-authoring",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/markdown-authoring.sdp.md",
  },
  {
    id: "spec:carrier.envelope-contract",
    specKind: "contract",
    altitude: "feature",
    readiness: "defined",
    file: "specs/carrier/envelope-contract.sdp.md",
  },
  {
    id: "spec:carrier.markdown-parser",
    specKind: "behavior",
    altitude: "feature",
    readiness: "scoped",
    file: "specs/carrier/markdown-parser.sdp.md",
  },
  {
    id: "spec:carrier.sdp-import",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    file: "specs/carrier/sdp-import.sdp.md",
  },
  {
    id: "spec:carrier.prose-ownership-rule",
    specKind: "rule",
    altitude: "story",
    readiness: "defined",
    file: "specs/carrier/prose-ownership-rule.sdp.md",
  },
] as const;

const expectedDeclaredRelations = [
  ["spec:carrier.markdown-authoring", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:carrier.envelope-contract", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "dependsOn", "spec:carrier.envelope-contract"],
  ["spec:carrier.sdp-import", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.prose-ownership-rule", "refines", "spec:carrier.markdown-authoring"],
] as const;

describe("the self-hosting phase-1 carrier corpus", () => {
  it("derives the five Markdown-canonical specs and their exact Pack checkpoint from the root", () => {
    // Given: the repository root with evidence and the worked example excluded from the authored model.
    const result = extract({ root: repoRoot, exclude: ["explorations", "examples"] });

    // When: the root corpus is reified through the public extractor.
    const nodeIds = result.graph.nodes.map((node) => node.id).sort();
    const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

    // Then: only the frozen initial corpus enters one clean graph with exact descriptors and sources.
    expect(result.report.findings).toEqual([]);
    expect(validateGraph(result.graph).findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 5, packs: 1, anchors: 0 });
    expect(nodeIds).toEqual([
      "pack:self-hosting-v1",
      "spec:carrier.envelope-contract",
      "spec:carrier.markdown-authoring",
      "spec:carrier.markdown-parser",
      "spec:carrier.prose-ownership-rule",
      "spec:carrier.sdp-import",
    ]);
    expect(
      primitiveNodes.map((node) => ({
        id: node.id,
        specKind: node.specKind,
        altitude: node.altitude,
        readiness: node.readiness,
        file: node.file,
      })),
    ).toEqual([...expectedSpecs].sort((left, right) => left.id.localeCompare(right.id)));
    expect(packNode).toEqual({
      id: "pack:self-hosting-v1",
      nodeType: "Pack",
      claim: "declared",
      title: "Self-hosting phase 1",
      framing: "The Protocol authors and validates its own phase-1 delivery model.",
      modelRefs: [],
      file: "specs/self-hosting.pack.sdp.ts",
    });
    expect(
      result.graph.edges
        .filter((edge) => edge.type !== "belongsTo")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual([...expectedDeclaredRelations].sort());
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "belongsTo")
        .map((edge) => [edge.from, edge.to, edge.claim])
        .sort(),
    ).toEqual(expectedSpecs.map((spec) => [spec.id, "pack:self-hosting-v1", "declared"]).sort());
  });
});

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
    readiness: "defined",
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
  {
    id: "spec:protocol.self-hosting",
    specKind: "behavior",
    altitude: "epic",
    readiness: "defined",
    file: "specs/protocol/self-hosting.sdp.md",
  },
  {
    id: "spec:extraction.derive-graph",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/derive-graph.sdp.md",
  },
  {
    id: "spec:extraction.determinism",
    specKind: "constraint",
    altitude: "feature",
    readiness: "ready",
    file: "specs/extraction/determinism.sdp.md",
  },
  {
    id: "spec:extraction.build-pipeline",
    specKind: "workflow",
    altitude: "feature",
    readiness: "defined",
    file: "specs/extraction/build-pipeline.sdp.md",
  },
  {
    id: "spec:validation.readiness-floor",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/readiness-floor.sdp.md",
  },
  {
    id: "spec:validation.duplicate-ids",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.sdp.md",
  },
  {
    id: "spec:model.protocol-domain",
    specKind: "model",
    altitude: "feature",
    readiness: "defined",
    file: "specs/model/protocol-domain.sdp.md",
  },
] as const;

const expectedDeclaredRelations = [
  ["spec:carrier.markdown-authoring", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:carrier.envelope-contract", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.markdown-parser", "dependsOn", "spec:carrier.envelope-contract"],
  ["spec:carrier.sdp-import", "refines", "spec:carrier.markdown-authoring"],
  ["spec:carrier.prose-ownership-rule", "refines", "spec:carrier.markdown-authoring"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:carrier.markdown-authoring"],
  ["spec:protocol.self-hosting", "dependsOn", "spec:model.protocol-domain"],
  ["spec:extraction.derive-graph", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.derive-graph", "constrainedBy", "spec:extraction.determinism"],
  ["spec:extraction.determinism", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "refines", "spec:protocol.self-hosting"],
  ["spec:extraction.build-pipeline", "dependsOn", "spec:extraction.derive-graph"],
  ["spec:validation.readiness-floor", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.readiness-floor", "dependsOn", "spec:model.protocol-domain"],
  ["spec:validation.duplicate-ids", "refines", "spec:protocol.self-hosting"],
  ["spec:validation.duplicate-ids", "dependsOn", "spec:carrier.markdown-parser"],
  ["spec:model.protocol-domain", "refines", "spec:protocol.self-hosting"],
] as const;

const expectedGapFindings = [
  "spec:extraction.derive-graph",
  "spec:extraction.determinism",
  "spec:validation.duplicate-ids",
  "spec:validation.readiness-floor",
].map((subjectId) => ({
  validatorId: "honesty/gaps",
  family: "honesty",
  severity: "warning",
  subjectId,
}));

describe("the self-hosting phase-1 carrier corpus", () => {
  it("derives the twelve Markdown-canonical specs and their exact five-member Pack checkpoint from the root", () => {
    // Given: the repository root with evidence and the worked example excluded from the authored model.
    const result = extract({ root: repoRoot, exclude: ["explorations", "examples"] });

    // When: the root corpus is reified through the public extractor.
    const nodeIds = result.graph.nodes.map((node) => node.id).sort();
    const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

    // Then: the frozen corpus enters one graph with exact descriptors, sources, and pre-anchor gaps.
    expect(result.report.findings).toEqual([]);
    expect(
      validateGraph(result.graph).findings.map(({ validatorId, family, severity, subjectId }) => ({
        validatorId,
        family,
        severity,
        subjectId,
      })),
    ).toEqual(expectedGapFindings);
    expect(result.counts).toEqual({ specs: 12, packs: 1, anchors: 0 });
    expect(nodeIds).toEqual([
      "pack:self-hosting-v1",
      "spec:carrier.envelope-contract",
      "spec:carrier.markdown-authoring",
      "spec:carrier.markdown-parser",
      "spec:carrier.prose-ownership-rule",
      "spec:carrier.sdp-import",
      "spec:extraction.build-pipeline",
      "spec:extraction.derive-graph",
      "spec:extraction.determinism",
      "spec:model.protocol-domain",
      "spec:protocol.self-hosting",
      "spec:validation.duplicate-ids",
      "spec:validation.readiness-floor",
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
      primitiveNodes.reduce<Record<string, number>>(
        (histogram, node) => ({
          ...histogram,
          [node.readiness]: (histogram[node.readiness] ?? 0) + 1,
        }),
        {},
      ),
    ).toEqual({ idea: 1, defined: 7, ready: 4 });
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "belongsTo")
        .map((edge) => [edge.from, edge.to, edge.claim])
        .sort(),
    ).toEqual(
      expectedSpecs
        .slice(0, 5)
        .map((spec) => [spec.id, "pack:self-hosting-v1", "declared"])
        .sort(),
    );
  });
});

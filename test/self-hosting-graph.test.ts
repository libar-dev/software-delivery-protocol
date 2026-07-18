import { readFileSync } from "node:fs";
import { join } from "node:path";
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

const expectedGapFindings = ["spec:validation.duplicate-ids"].map((subjectId) => ({
  validatorId: "honesty/gaps",
  family: "honesty",
  severity: "warning",
  subjectId,
}));

const expectedAnchors = [
  {
    id: "impl:protocol.extract",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/index.ts",
    constant: "extractAnchor",
    site: "export function extract",
  },
  {
    id: "impl:protocol.derive-graph",
    type: "satisfies",
    target: "spec:extraction.derive-graph",
    file: "src/extract/derive.ts",
    constant: "deriveGraphAnchor",
    site: "export function deriveGraph",
  },
  {
    id: "test:protocol.extract",
    type: "verifies",
    target: "spec:extraction.derive-graph",
    file: "test/extract.test.ts",
    constant: "extractContractTestAnchor",
    site: 'describe("anchor extraction corpora",',
  },
  {
    id: "test:protocol.extraction-determinism",
    type: "verifies",
    target: "spec:extraction.determinism",
    file: "test/cli.test.ts",
    constant: "cleanRepoDeterminismTestAnchor",
    site: 'it("clean-repo determinism: the full pipeline at a different absolute path is byte-identical"',
  },
  {
    id: "impl:protocol.readiness-floor",
    type: "satisfies",
    target: "spec:validation.readiness-floor",
    file: "src/validate/readiness-floor.ts",
    constant: "readinessFloorAnchor",
    site: "export function evaluateReadinessFloor",
  },
  {
    id: "test:protocol.readiness-floor",
    type: "verifies",
    target: "spec:validation.readiness-floor",
    file: "test/readiness.test.ts",
    constant: "readinessFloorTestAnchor",
    site: 'describe("readiness and validation contracts",',
  },
  {
    id: "impl:protocol.markdown-authoring",
    type: "satisfies",
    target: "spec:carrier.markdown-authoring",
    file: "src/extract/markdown.ts",
    constant: "markdownAuthoringAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "impl:protocol.markdown-parser",
    type: "satisfies",
    target: "spec:carrier.markdown-parser",
    file: "src/extract/markdown.ts",
    constant: "markdownParserAnchor",
    site: "export function reifyMarkdownCarrier",
  },
  {
    id: "test:protocol.markdown-parser",
    type: "verifies",
    target: "spec:carrier.markdown-parser",
    file: "test/markdown-reifier.test.ts",
    constant: "markdownParserTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.envelope-contract",
    type: "satisfies",
    target: "spec:carrier.envelope-contract",
    file: "src/extract/markdown.ts",
    constant: "envelopeContractAnchor",
    site: "export function parseMarkdownFrontmatter",
  },
  {
    id: "test:protocol.envelope-contract",
    type: "verifies",
    target: "spec:carrier.envelope-contract",
    file: "test/markdown-reifier.test.ts",
    constant: "envelopeContractTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.prose-ownership",
    type: "satisfies",
    target: "spec:carrier.prose-ownership-rule",
    file: "src/extract/markdown.ts",
    constant: "proseOwnershipAnchor",
    site: "export function readMarkdownBody",
  },
  {
    id: "test:protocol.prose-ownership",
    type: "verifies",
    target: "spec:carrier.prose-ownership-rule",
    file: "test/markdown-reifier.test.ts",
    constant: "proseOwnershipTestAnchor",
    site: 'describe("Markdown frontmatter reifier",',
  },
  {
    id: "impl:protocol.duplicate-id-exclusion",
    type: "satisfies",
    target: "spec:validation.duplicate-ids",
    file: "src/extract/index.ts",
    constant: "duplicateIdExclusionAnchor",
    site: "function findDuplicatedIds",
  },
] as const;

const expectedDeliveryFacts = new Map<string, readonly string[]>([
  ["spec:carrier.envelope-contract", ["implemented", "has-verifier"]],
  ["spec:carrier.markdown-authoring", ["implemented"]],
  ["spec:carrier.markdown-parser", ["implemented", "has-verifier"]],
  ["spec:carrier.prose-ownership-rule", ["implemented", "has-verifier"]],
  ["spec:extraction.derive-graph", ["implemented", "has-verifier"]],
  ["spec:extraction.determinism", ["has-verifier"]],
  ["spec:validation.duplicate-ids", ["implemented"]],
  ["spec:validation.readiness-floor", ["implemented", "has-verifier"]],
]);

function lineContaining(source: string, token: string): number {
  const line = source.split("\n").findIndex((entry) => entry.includes(token));

  return line + 1;
}

describe("the self-hosting phase-1 carrier corpus", () => {
  it("derives the twelve Markdown-canonical specs and their exact five-member Pack checkpoint from the root", () => {
    // Given: the repository root with evidence and the worked example excluded from the authored model.
    const result = extract({ root: repoRoot, exclude: ["explorations", "examples"] });

    // When: the root corpus is reified through the public extractor.
    const nodeIds = result.graph.nodes.map((node) => node.id).sort();
    const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
    const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

    // Then: the frozen corpus enters one graph with exact descriptors and its direct bindings.
    expect(result.report.findings).toEqual([]);
    expect(
      validateGraph(result.graph).findings.map(({ validatorId, family, severity, subjectId }) => ({
        validatorId,
        family,
        severity,
        subjectId,
      })),
    ).toEqual(expectedGapFindings);
    expect(result.counts).toEqual({ specs: 12, packs: 1, anchors: 14 });
    expect(nodeIds).toEqual(
      [
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
        ...expectedAnchors.map((anchor) => anchor.id),
      ].sort(),
    );
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
        .filter((edge) => edge.claim === "declared" && edge.type !== "belongsTo")
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
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "anchored")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual(expectedAnchors.map((anchor) => [anchor.id, anchor.type, anchor.target]).sort());
    const actualDeliveryFacts: [string, readonly string[]][] = primitiveNodes
      .filter((node) => expectedDeliveryFacts.has(node.id))
      .map((node) => [node.id, node.deliveryFacts ?? []]);

    expect(actualDeliveryFacts.sort(([left], [right]) => left.localeCompare(right))).toEqual(
      [...expectedDeliveryFacts].sort(([left], [right]) => left.localeCompare(right)),
    );

    for (const anchor of expectedAnchors) {
      const source = readFileSync(join(repoRoot, anchor.file), "utf8");
      const anchorLine = lineContaining(source, `const ${anchor.constant}`);
      const siteLine = lineContaining(source, anchor.site);
      const node = result.graph.nodes.find((entry) => entry.id === anchor.id);

      expect(anchorLine).toBeGreaterThan(0);
      expect(siteLine, anchor.id).toBeGreaterThan(0);
      expect(Math.abs(anchorLine - siteLine), anchor.id).toBeLessThanOrEqual(20);
      expect(node).toMatchObject({ file: anchor.file, line: anchorLine, claim: "anchored" });
    }
  });
});

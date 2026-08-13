import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extract, validateGraph } from "../src/index.js";
import type { ExpectedSpec } from "./self-hosting-oracle/index.js";
import {
  expectedAnchors,
  expectedDeclaredRelations,
  expectedPackMembers,
  expectedSpecs,
  expectedWarnings,
  specFamilies,
} from "./self-hosting-oracle/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// Given: the repository root with evidence and the worked example excluded from the authored model.
// The corpus walk is this suite's one expensive step, so it runs exactly once and every assertion
// below reads the same derived graph: splitting the oracle by law never multiplies extraction.
const result = extract({
  root: repoRoot,
  exclude: ["explorations", "examples", "test/fixtures/import/parity"],
});

// When: the root corpus is reified through the public extractor.
const nodeIds = result.graph.nodes.map((node) => node.id).sort();
const primitiveNodes = result.graph.nodes.filter((node) => node.nodeType === "Primitive");
const packNode = result.graph.nodes.find((node) => node.id === "pack:self-hosting-v1");

const byId = (left: { id: string }, right: { id: string }): number =>
  left.id.localeCompare(right.id);

function projectDerivedDescriptors(nodes: typeof primitiveNodes) {
  return nodes
    .map((node) => ({
      id: node.id,
      specKind: node.specKind,
      altitude: node.altitude,
      readiness: node.readiness,
      title: node.title,
      narrative: node.narrative ?? null,
      sections: node.sections,
      deliveryFacts: node.deliveryFacts ?? [],
      file: node.file,
    }))
    .sort(byId);
}

function projectAuthoredDescriptors(specs: readonly ExpectedSpec[]) {
  return [...specs].sort(byId).map((spec) => ({
    id: spec.id,
    specKind: spec.specKind,
    altitude: spec.altitude,
    readiness: spec.readiness,
    title: spec.title,
    narrative: spec.narrative,
    sections: spec.sections,
    deliveryFacts: spec.deliveryFacts,
    file: spec.file,
  }));
}

function lineContaining(source: string, token: string): number {
  const line = source.split("\n").findIndex((entry) => entry.includes(token));

  return line + 1;
}

describe("the self-hosting corpus", () => {
  // Then: the frozen corpus enters one graph with exact descriptors and its direct bindings.
  it("reifies the root corpus without an extraction finding", () => {
    expect(result.report.findings).toEqual([]);
  });

  it("derives a graph the conformance and honesty checks leave without a finding", () => {
    expect(
      validateGraph(result.graph).findings.map(({ validatorId, family, severity, subjectId }) => ({
        validatorId,
        family,
        severity,
        subjectId,
      })),
    ).toEqual(expectedWarnings);
  });

  it("holds the frozen corpus totals", () => {
    // The literals are the corpus checkpoint. The authored arrays are measured against the same
    // literals rather than standing in for them, so a transcription slip in an oracle module
    // cannot certify itself by moving both sides of a comparison at once.
    expect(result.counts).toEqual({ specs: 145, packs: 1, anchors: 134 });
    expect(expectedSpecs).toHaveLength(145);
    expect(expectedPackMembers).toHaveLength(145);
    expect(expectedAnchors).toHaveLength(134);
    expect(result.graph.nodes).toHaveLength(280);
    expect(result.graph.edges).toHaveLength(529);
  });

  it("rosters exactly the authored Spec, Pack, and anchor node ids", () => {
    // The roster is derived from the same authored arrays the descriptor and binding assertions
    // read: one oracle statement of the corpus's identities, compared against the graph once.
    expect(nodeIds).toEqual(
      [
        "pack:self-hosting-v1",
        ...expectedSpecs.map((spec) => spec.id),
        ...expectedAnchors.map((anchor) => anchor.id),
      ].sort(),
    );
  });

  for (const family of specFamilies) {
    it(`carries the authored descriptors of the ${family.name} family`, () => {
      expect(
        projectDerivedDescriptors(
          primitiveNodes.filter((node) => node.id.startsWith(family.prefix)),
        ),
      ).toEqual(projectAuthoredDescriptors(family.specs));
    });
  }

  it("leaves no authored Spec outside the families", () => {
    const familyIds = specFamilies.flatMap((family) => family.specs.map((spec) => spec.id));

    expect([...familyIds].sort()).toEqual(primitiveNodes.map((node) => node.id).sort());
    expect(new Set(familyIds).size).toBe(familyIds.length);
  });

  it("derives exactly the authored declared relations", () => {
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "declared" && edge.type !== "belongsTo")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual([...expectedDeclaredRelations].sort());
  });

  it("holds the frozen stated-readiness distribution", () => {
    expect(
      primitiveNodes.reduce<Record<string, number>>(
        (histogram, node) => ({
          ...histogram,
          [node.readiness]: (histogram[node.readiness] ?? 0) + 1,
        }),
        {},
      ),
    ).toEqual({ defined: 14, idea: 3, ready: 127, scoped: 1 });
  });

  it("derives the Pack membership edges from the manifest, in manifest order", () => {
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "belongsTo")
        .map((edge) => [edge.from, edge.to, edge.claim]),
    ).toEqual(expectedPackMembers.map((id) => [id, "pack:self-hosting-v1", "declared"]));
  });

  it("carries the Pack aggregate node exactly as authored", () => {
    expect(packNode).toEqual({
      id: "pack:self-hosting-v1",
      nodeType: "Pack",
      claim: "declared",
      title: "Self-hosting",
      framing: "The Protocol authors and validates its own delivery model.",
      modelRefs: ["spec:model.protocol-domain", "spec:model.core-model"],
      file: "specs/self-hosting.pack.sdp.md",
    });
  });

  it("derives one anchored edge per authored anchor", () => {
    expect(
      result.graph.edges
        .filter((edge) => edge.claim === "anchored")
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual(expectedAnchors.map((anchor) => [anchor.id, anchor.type, anchor.target]).sort());
  });

  it("projects every anchor and code node at the line its declaration occupies", () => {
    const expectedAnchorNodes = expectedAnchors
      .map((anchor) => {
        const source = readFileSync(join(repoRoot, anchor.file), "utf8");

        return {
          id: anchor.id,
          nodeType: anchor.nodeType,
          claim: "anchored",
          label: anchor.label,
          file: anchor.file,
          line: lineContaining(source, `const ${anchor.constant}`),
        };
      })
      .sort(byId);

    expect(
      result.graph.nodes
        .filter((node) => node.nodeType === "Anchor" || node.nodeType === "CodeNode")
        .map((node) => ({
          id: node.id,
          nodeType: node.nodeType,
          claim: node.claim,
          label: node.label,
          file: node.file,
          line: node.line,
        }))
        .sort(byId),
    ).toEqual(expectedAnchorNodes);
  });

  it("keeps every anchor beside the site it binds", () => {
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

  it("derives the duplicate-ids delivery facts from the bindings, never from authoring", () => {
    const childId = "spec:validation.duplicate-ids.dual-carrier";
    const parentId = "spec:validation.duplicate-ids";
    const child = primitiveNodes.find((node) => node.id === childId);
    const parent = primitiveNodes.find((node) => node.id === parentId);

    expect(child?.deliveryFacts).toEqual(["has-verifier"]);
    expect(parent?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.duplicate-ids.dual-carrier" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.duplicate-ids.dual-carrier",
        type: "verifies",
        to: childId,
        claim: "anchored",
      },
    ]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.type === "verifies" && edge.claim === "anchored" && edge.to === parentId,
      ),
    ).toEqual([]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "verifies" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "verifies", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === childId && edge.type === "refines" && edge.claim === "declared",
      ),
    ).toEqual([{ from: childId, type: "refines", to: parentId, claim: "declared" }]);
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === "impl:protocol.duplicate-id-exclusion" && edge.type === "satisfies",
      ),
    ).toEqual([
      {
        from: "impl:protocol.duplicate-id-exclusion",
        type: "satisfies",
        to: parentId,
        claim: "anchored",
      },
    ]);
  });

  it("derives sdp-import realization from its direct code and child verifier bindings", () => {
    const importChildId = "spec:carrier.sdp-import.round-trip";
    const importParentId = "spec:carrier.sdp-import";
    const importChild = primitiveNodes.find((node) => node.id === importChildId);
    const importParent = primitiveNodes.find((node) => node.id === importParentId);

    expect(importChild?.deliveryFacts).toEqual(["has-verifier"]);
    expect(importParent?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    expect(
      result.graph.edges.filter(
        (edge) =>
          edge.from === "test:protocol.sdp-import.round-trip" &&
          edge.type === "verifies" &&
          edge.claim === "anchored",
      ),
    ).toEqual([
      {
        from: "test:protocol.sdp-import.round-trip",
        type: "verifies",
        to: importChildId,
        claim: "anchored",
      },
    ]);
  });
});

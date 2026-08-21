import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  createCompilerHost,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  forEachChild,
  getParsedCommandLineOfConfigFile,
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  ScriptKind,
  ScriptTarget,
  sys,
} from "typescript";
import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { extract, validateGraph } from "../src/index.js";
import { auditStructuralCoverage } from "./helpers/structural-coverage.js";
import type { ExpectedSpec } from "./self-hosting-oracle/index.js";
import {
  acceptedArchitecturalUnits,
  coarseGrainCoverage,
  expectedAnchors,
  expectedComponentIds,
  expectedDeclaredRelations,
  expectedMemberOfEdges,
  expectedPackMembers,
  expectedSpecs,
  expectedUsesEdges,
  expectedWarnings,
  specFamilies,
  structuralMembershipExceptions,
} from "./self-hosting-oracle/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const parsedCompilerConfig = getParsedCommandLineOfConfigFile(
  join(repoRoot, "tsconfig.json"),
  {},
  {
    ...sys,
    onUnRecoverableConfigFileDiagnostic(diagnostic) {
      throw new Error(flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  },
);
if (parsedCompilerConfig === undefined) {
  throw new Error("the repository TypeScript project could not be parsed");
}
const structuralCoverageCompilerHost = createCompilerHost(parsedCompilerConfig.options);
structuralCoverageCompilerHost.getCurrentDirectory = () => repoRoot;
const structuralCoverageProgram = createProgram({
  rootNames: parsedCompilerConfig.fileNames,
  options: parsedCompilerConfig.options,
  projectReferences: parsedCompilerConfig.projectReferences,
  host: structuralCoverageCompilerHost,
});

const structuralSelfBindingTestAnchor = specTest({
  id: testAnchorId("test:protocol.structural-self-binding"),
  label: "verifies the accepted significant-unit set carries its declared membership",
  verifies: ref("spec:protocol.structural-self-binding"),
});
void structuralSelfBindingTestAnchor;

// An oracle site written as a bare `register<Example>(` call names an adopted generated-registrar
// activation. Its identifier resolves through the executable AST probe below, so a comment or a
// string literal can never satisfy the locality invariant (the R9 closure).
function adoptedActivationIdentifier(site: string): string | undefined {
  return /^(register[A-Za-z0-9]+)\($/u.exec(site)?.[1];
}

function executableActivationLine(source: string, activation: string): number | undefined {
  const sourceFile = createSourceFile(
    "authored-test.ts",
    source,
    ScriptTarget.Latest,
    true,
    ScriptKind.TS,
  );
  let activationLine: number | undefined;

  function visit(node: import("typescript").Node): void {
    if (
      activationLine === undefined &&
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      node.expression.text === activation &&
      isExpressionStatement(node.parent) &&
      node.parent.parent === sourceFile
    ) {
      activationLine = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    }

    forEachChild(node, visit);
  }

  visit(sourceFile);
  return activationLine;
}

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

function compareCoverageMismatch(
  left: { unit: string; anchorId: string; target: string },
  right: { unit: string; anchorId: string; target: string },
): number {
  return (
    left.unit.localeCompare(right.unit) ||
    left.anchorId.localeCompare(right.anchorId) ||
    left.target.localeCompare(right.target)
  );
}

describe("the self-hosting corpus", () => {
  // Then: the frozen corpus enters one graph with exact descriptors and its direct bindings.
  it("reifies the root corpus without an extraction finding", () => {
    expect(result.report.findings).toEqual([]);
  });

  it("reports exactly the five informative honesty gaps", () => {
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
    expect(result.counts).toEqual({ specs: 164, packs: 1, anchors: 177 });
    expect(expectedSpecs).toHaveLength(164);
    expect(expectedPackMembers).toHaveLength(164);
    expect(expectedAnchors).toHaveLength(177);
    expect(result.graph.nodes).toHaveLength(342);
    expect(result.graph.edges).toHaveLength(760);
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
    ).toEqual({ defined: 11, idea: 4, ready: 148, scoped: 1 });
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

  it("derives one binding edge per authored anchor", () => {
    expect(
      result.graph.edges
        .filter(
          (edge) => edge.claim === "anchored" && edge.type !== "memberOf" && edge.type !== "uses",
        )
        .map((edge) => [edge.from, edge.type, edge.to])
        .sort(),
    ).toEqual(expectedAnchors.map((anchor) => [anchor.id, anchor.type, anchor.target]).sort());
  });

  it("rosters exactly the accepted component set", () => {
    expect(
      result.graph.nodes
        .filter((node) => node.nodeType === "CodeNode" && node.id.startsWith("component:"))
        .map((node) => node.id)
        .sort(),
    ).toEqual([...expectedComponentIds].sort());
  });

  it("gives every owned impl/api CodeNode exactly one component", () => {
    const exceptions = new Set<string>(structuralMembershipExceptions);
    const codeUnits = result.graph.nodes.filter(
      (node) =>
        node.nodeType === "CodeNode" && (node.id.startsWith("impl:") || node.id.startsWith("api:")),
    );

    for (const codeUnit of codeUnits) {
      const memberships = result.graph.edges.filter(
        (edge) => edge.from === codeUnit.id && edge.type === "memberOf",
      );

      expect(memberships, codeUnit.id).toHaveLength(exceptions.has(codeUnit.id) ? 0 : 1);
    }

    expect(
      result.graph.edges
        .filter((edge) => edge.type === "memberOf")
        .map((edge) => [edge.from, edge.to])
        .sort(),
    ).toEqual([...expectedMemberOfEdges].sort());
  });

  it("derives exactly the sparse authored component uses edges", () => {
    expect(
      result.graph.edges
        .filter((edge) => edge.type === "uses")
        .map((edge) => [edge.from, edge.to])
        .sort(),
    ).toEqual([...expectedUsesEdges].sort());
  });

  it("covers every accepted architecturally significant unit", () => {
    const acceptedIds = new Set<string>(acceptedArchitecturalUnits.map((row) => row.anchorId));
    const exceptionIds = new Set<string>(structuralMembershipExceptions);
    const componentIds = new Set<string>(expectedComponentIds);
    const mismatches: {
      unit: string;
      anchorId: string;
      target: string;
      reason: string;
    }[] = [];

    for (const row of acceptedArchitecturalUnits) {
      const path = row.unit.slice(0, row.unit.indexOf("#"));
      const node = result.graph.nodes.find((entry) => entry.id === row.anchorId);
      const memberships = result.graph.edges.filter(
        (edge) => edge.from === row.anchorId && edge.type === "memberOf",
      );
      const target = memberships[0]?.to ?? "";

      if (node?.nodeType !== "CodeNode") {
        mismatches.push({
          unit: row.unit,
          anchorId: row.anchorId,
          target,
          reason: "anchor is not a CodeNode",
        });
        continue;
      }

      if (node.file !== path) {
        mismatches.push({
          unit: row.unit,
          anchorId: row.anchorId,
          target,
          reason: `file ${node.file} !== ${path}`,
        });
      }

      if (memberships.length !== 1) {
        mismatches.push({
          unit: row.unit,
          anchorId: row.anchorId,
          target,
          reason: `memberOf count ${String(memberships.length)}`,
        });
      } else {
        if (target !== row.componentId) {
          mismatches.push({
            unit: row.unit,
            anchorId: row.anchorId,
            target,
            reason: `memberOf target ${target} !== ${row.componentId}`,
          });
        }

        if (!componentIds.has(target)) {
          mismatches.push({
            unit: row.unit,
            anchorId: row.anchorId,
            target,
            reason: "target not in expectedComponentIds",
          });
        }
      }
    }

    for (const edge of result.graph.edges.filter((entry) => entry.type === "memberOf")) {
      if (!acceptedIds.has(edge.from) && !exceptionIds.has(edge.from)) {
        const node = result.graph.nodes.find((entry) => entry.id === edge.from);
        mismatches.push({
          unit: node && "file" in node ? node.file : edge.from,
          anchorId: edge.from,
          target: edge.to,
          reason: "unrostered memberOf",
        });
      }
    }

    for (const row of coarseGrainCoverage) {
      const memberships = result.graph.edges.filter(
        (edge) => edge.from === row.coveredBy && edge.type === "memberOf",
      );
      const covering = result.graph.nodes.find((entry) => entry.id === row.coveredBy);
      const target = memberships[0]?.to ?? "";

      if (covering === undefined) {
        mismatches.push({
          unit: row.unit,
          anchorId: row.coveredBy,
          target,
          reason: "covering anchor missing",
        });
        continue;
      }

      if (memberships.length !== 1 || target !== row.componentId) {
        mismatches.push({
          unit: row.unit,
          anchorId: row.coveredBy,
          target,
          reason: `covering anchor not a member of ${row.componentId}`,
        });
      }

      const coverage = auditStructuralCoverage(structuralCoverageProgram, row.unit, covering.file);
      if (coverage !== "ok") {
        mismatches.push({
          unit: row.unit,
          anchorId: row.coveredBy,
          target,
          reason: coverage,
        });
      }
    }

    mismatches.sort(compareCoverageMismatch);
    const message = [
      "structural self-binding coverage failed:",
      ...mismatches.map((row) => `${row.unit} ${row.anchorId} → ${row.target}: ${row.reason}`),
    ].join("\n");

    expect(mismatches, message).toEqual([]);
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

  it("rejects comment-only and string activation sites and accepts executable calls", () => {
    const commentOnlySource = "// registerExample({});\n";
    const stringOnlySource = 'const text = "registerExample({});";\n';
    const executableSource = "registerExample({});\n";

    expect(lineContaining(commentOnlySource, "registerExample(")).toBe(1);
    expect(lineContaining(stringOnlySource, "registerExample(")).toBe(1);
    expect(executableActivationLine(commentOnlySource, "registerExample")).toBeUndefined();
    expect(executableActivationLine(stringOnlySource, "registerExample")).toBeUndefined();
    expect(executableActivationLine(executableSource, "registerExample")).toBe(1);
  });

  it("keeps every anchor beside the site it binds", () => {
    for (const anchor of expectedAnchors) {
      const source = readFileSync(join(repoRoot, anchor.file), "utf8");
      const anchorLine = lineContaining(source, `const ${anchor.constant}`);
      const activation = adoptedActivationIdentifier(anchor.site);
      const siteLine =
        activation === undefined
          ? lineContaining(source, anchor.site)
          : (executableActivationLine(source, activation) ?? 0);
      const node = result.graph.nodes.find((entry) => entry.id === anchor.id);

      expect(anchorLine).toBeGreaterThan(0);
      expect(siteLine, anchor.id).toBeGreaterThan(0);
      // The densest site has four adjacent member anchors; their required component rows add
      // exactly four lines to the original 20-line locality bound.
      expect(Math.abs(anchorLine - siteLine), anchor.id).toBeLessThanOrEqual(24);
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

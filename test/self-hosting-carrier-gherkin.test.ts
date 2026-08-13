import { rmSync } from "node:fs";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { authoredFactRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.authored-fact-refused.contract.js";
import { contractParityContract } from "../generated/contracts/carrier.gherkin-authoring.contract-parity.contract.js";
import { duplicateSurfaceRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.duplicate-surface-refused.contract.js";
import { exampleSpaceExtractionContract } from "../generated/contracts/carrier.gherkin-authoring.example-space-extraction.contract.js";
import { malformedRelationRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.malformed-relation-refused.contract.js";
import { missingIdRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.missing-id-refused.contract.js";
import { parentChildExtractionContract } from "../generated/contracts/carrier.gherkin-authoring.parent-child-extraction.contract.js";
import { unboundReadyRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unbound-ready-refused.contract.js";
import { unknownTagRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unknown-tag-refused.contract.js";
import { unsupportedConstructRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unsupported-construct-refused.contract.js";
import { extract, generateContracts, serializeGraph, validateGraph } from "../src/index.js";
import type { Finding, GraphSchema, ValidationReport } from "../src/index.js";
import { materializeGherkinCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const temporaryRoots: string[] = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    removeMaterializedCorpus(root);
  }
});

function materialize(probe: string): string {
  const root = materializeGherkinCorpus(probe);
  temporaryRoots.push(root);
  return root;
}

interface GherkinWorld {
  root: string;
  graph: GraphSchema | undefined;
  extractionReport: ValidationReport | undefined;
  validationReport: ValidationReport | undefined;
}

function world(): GherkinWorld {
  return {
    root: "",
    graph: undefined,
    extractionReport: undefined,
    validationReport: undefined,
  };
}

function graphOf(state: GherkinWorld): GraphSchema {
  if (state.graph === undefined) {
    throw new Error("The fixture corpus must be extracted before the graph is asserted.");
  }
  return state.graph;
}

function extractionReportOf(state: GherkinWorld): ValidationReport {
  if (state.extractionReport === undefined) {
    throw new Error("The fixture corpus must be extracted before its findings are asserted.");
  }
  return state.extractionReport;
}

function validationReportOf(state: GherkinWorld): ValidationReport {
  if (state.validationReport === undefined) {
    throw new Error("The fixture corpus must be validated before its findings are asserted.");
  }
  return state.validationReport;
}

function findingsOf(state: GherkinWorld): readonly Finding[] {
  return [...extractionReportOf(state).findings, ...validationReportOf(state).findings];
}

function relationsOf(state: GherkinWorld, childId: string) {
  return graphOf(state)
    .edges.filter((edge) => edge.from === childId && edge.claim === "declared")
    .map((edge) => ({ type: edge.type, target: edge.to, claim: edge.claim }));
}

const bindings = {
  "the Gherkin fixture corpus {probe}": (state: GherkinWorld, params: { probe: string }) => {
    state.root = materialize(params.probe);
    if (params.probe === "parity") {
      rmSync(join(state.root, "twin.sdp.md"));
    }
  },
  "the fixture corpus is extracted and validated": (state: GherkinWorld) => {
    const result = extract({ root: state.root });
    state.graph = result.graph;
    state.extractionReport = result.report;
    state.validationReport = validateGraph(result.graph);
  },
  "extraction reports {findingCount} findings": (
    state: GherkinWorld,
    params: { findingCount: number },
  ) => {
    expect(extractionReportOf(state).findings).toHaveLength(params.findingCount);
  },
  "validation reports {findingCount} findings": (
    state: GherkinWorld,
    params: { findingCount: number },
  ) => {
    expect(validationReportOf(state).findings).toHaveLength(params.findingCount);
  },
  "the first finding is {findingId} at line {line}": (
    state: GherkinWorld,
    params: { findingId: string; line: number },
  ) => {
    expect(extractionReportOf(state).findings[0]).toMatchObject({
      validatorId: params.findingId,
      line: params.line,
    });
  },
  "the report contains finding {findingId}": (
    state: GherkinWorld,
    params: { findingId: string },
  ) => {
    expect(findingsOf(state)).toContainEqual(
      expect.objectContaining({ validatorId: params.findingId }),
    );
  },
  "the graph contains exactly {specCount} Specs": (
    state: GherkinWorld,
    params: { specCount: number },
  ) => {
    expect(graphOf(state).nodes.filter((node) => node.nodeType === "Primitive")).toHaveLength(
      params.specCount,
    );
  },
  "the graph contains the Spec {specId} with kind {specKind}": (
    state: GherkinWorld,
    params: { specId: string; specKind: "behavior" | "example" },
  ) => {
    expect(graphOf(state).nodes).toContainEqual(
      expect.objectContaining({
        id: params.specId,
        nodeType: "Primitive",
        specKind: params.specKind,
      }),
    );
  },
  "the graph contains the child Spec {childId} with kind {specKind}": (
    state: GherkinWorld,
    params: { childId: string; specKind: "behavior" | "example" },
  ) => {
    expect(graphOf(state).nodes).toContainEqual(
      expect.objectContaining({
        id: params.childId,
        nodeType: "Primitive",
        specKind: params.specKind,
      }),
    );
  },
  "the child Spec {childId} declares {relationType} to {relationTarget}": (
    state: GherkinWorld,
    params: { childId: string; relationType: string; relationTarget: string },
  ) => {
    expect(relationsOf(state, params.childId)).toContainEqual({
      type: params.relationType,
      target: params.relationTarget,
      claim: "declared",
    });
  },
  "the child Spec {childId} declares the additional relation {relationType} to {relationTarget}": (
    state: GherkinWorld,
    params: { childId: string; relationType: string; relationTarget: string },
  ) => {
    expect(relationsOf(state, params.childId)).toContainEqual({
      type: params.relationType,
      target: params.relationTarget,
      claim: "declared",
    });
  },
  "the graph omits the Spec {absentId}": (state: GherkinWorld, params: { absentId: string }) => {
    expect(graphOf(state).nodes.some((node) => node.id === params.absentId)).toBe(false);
  },
  "no graph edge names the absent Spec {absentId}": (
    state: GherkinWorld,
    params: { absentId: string },
  ) => {
    expect(
      graphOf(state).edges.some(
        (edge) => edge.from === params.absentId || edge.to === params.absentId,
      ),
    ).toBe(false);
  },
  "the parent example space contains {spaceStep}": (
    state: GherkinWorld,
    params: { spaceStep: string },
  ) => {
    const parent = graphOf(state).nodes.find((node) => node.id === "spec:fixture.space-parent");
    if (parent?.nodeType !== "Primitive") {
      throw new Error("Expected the example-space parent Primitive.");
    }
    expect(parent.sections?.behavior?.exampleSpace?.given).toContain(
      params.spaceStep.replace(/^Given /u, ""),
    );
  },
  "the graph for {parityLeft} equals the graph for {parityRight}": (
    state: GherkinWorld,
    params: { parityLeft: string; parityRight: string },
  ) => {
    const leftRoot = materialize("parity");
    const rightRoot = materialize("parity");
    rmSync(join(leftRoot, params.parityRight));
    rmSync(join(rightRoot, params.parityLeft));
    const left = extract({ root: leftRoot });
    const right = extract({ root: rightRoot });
    expect(left.report.findings).toEqual([]);
    expect(right.report.findings).toEqual([]);
    const leftBytes = serializeGraph(left.graph).replaceAll(params.parityLeft, "twin.carrier");
    const rightBytes = serializeGraph(right.graph).replaceAll(params.parityRight, "twin.carrier");
    expect(leftBytes).toBe(rightBytes);
  },
  "the contracts for {parityLeft} equal the contracts for {parityRight}": (
    state: GherkinWorld,
    params: { parityLeft: string; parityRight: string },
  ) => {
    const leftRoot = materialize("parity");
    const rightRoot = materialize("parity");
    rmSync(join(leftRoot, params.parityRight));
    rmSync(join(rightRoot, params.parityLeft));
    const left = extract({ root: leftRoot });
    const right = extract({ root: rightRoot });
    expect(generateContracts(left.graph)).toEqual(generateContracts(right.graph));
  },
};

const authoredFactRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.authored-fact-refused"),
  label: "the authored-fact-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.authored-fact-refused"),
});
void authoredFactRefusedAnchor;
bindExample(authoredFactRefusedContract, world, bindings);

const contractParityAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.contract-parity"),
  label: "the contract-parity point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.contract-parity"),
});
void contractParityAnchor;
bindExample(contractParityContract, world, bindings);

const duplicateSurfaceRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.duplicate-surface-refused"),
  label: "the duplicate-surface-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.duplicate-surface-refused"),
});
void duplicateSurfaceRefusedAnchor;
bindExample(duplicateSurfaceRefusedContract, world, bindings);

const exampleSpaceExtractionAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.example-space-extraction"),
  label: "the example-space-extraction point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.example-space-extraction"),
});
void exampleSpaceExtractionAnchor;
bindExample(exampleSpaceExtractionContract, world, bindings);

const malformedRelationRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.malformed-relation-refused"),
  label: "the malformed-relation-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.malformed-relation-refused"),
});
void malformedRelationRefusedAnchor;
bindExample(malformedRelationRefusedContract, world, bindings);

const missingIdRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.missing-id-refused"),
  label: "the missing-id-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.missing-id-refused"),
});
void missingIdRefusedAnchor;
bindExample(missingIdRefusedContract, world, bindings);

const parentChildExtractionAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.parent-child-extraction"),
  label: "the parent-child-extraction point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.parent-child-extraction"),
});
void parentChildExtractionAnchor;
bindExample(parentChildExtractionContract, world, bindings);

const unboundReadyRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.unbound-ready-refused"),
  label: "the unbound-ready-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.unbound-ready-refused"),
});
void unboundReadyRefusedAnchor;
bindExample(unboundReadyRefusedContract, world, bindings);

const unknownTagRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.unknown-tag-refused"),
  label: "the unknown-tag-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.unknown-tag-refused"),
});
void unknownTagRefusedAnchor;
bindExample(unknownTagRefusedContract, world, bindings);

const unsupportedConstructRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.unsupported-construct-refused"),
  label: "the unsupported-construct-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.unsupported-construct-refused"),
});
void unsupportedConstructRefusedAnchor;
bindExample(unsupportedConstructRefusedContract, world, bindings);

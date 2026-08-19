import { rmSync } from "node:fs";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { authoredFactRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.authored-fact-refused.contract.js";
import { contractParityContract } from "../generated/contracts/carrier.gherkin-authoring.contract-parity.contract.js";
import { descriptionLocationRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.description-location-refused.contract.js";
import { duplicateSurfaceRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.duplicate-surface-refused.contract.js";
import { exampleSpaceExtractionContract } from "../generated/contracts/carrier.gherkin-authoring.example-space-extraction.contract.js";
import { malformedRelationRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.malformed-relation-refused.contract.js";
import { missingIdRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.missing-id-refused.contract.js";
import { multiFindingBoundedContract } from "../generated/contracts/carrier.gherkin-authoring.multi-finding-bounded.contract.js";
import { parentChildExtractionContract } from "../generated/contracts/carrier.gherkin-authoring.parent-child-extraction.contract.js";
import { stepLessScenarioRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.step-less-scenario-refused.contract.js";
import { unboundReadyRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unbound-ready-refused.contract.js";
import { unknownTagRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unknown-tag-refused.contract.js";
import { unsupportedConstructRefusedContract } from "../generated/contracts/carrier.gherkin-authoring.unsupported-construct-refused.contract.js";
import type {
  GherkinAuthoringConditions,
  GherkinAuthoringOutcome,
} from "../generated/contracts/carrier.gherkin-authoring.space.js";
import { extract, generateContracts, serializeGraph, validateGraph } from "../src/index.js";
import type { Finding, GraphSchema, ValidationReport } from "../src/index.js";
import { registerAuthoredFactRefused } from "./carrier.gherkin-authoring.authored-fact-refused.test.generated.js";
import { registerDescriptionLocationRefused } from "./carrier.gherkin-authoring.description-location-refused.test.generated.js";
import { registerDuplicateSurfaceRefused } from "./carrier.gherkin-authoring.duplicate-surface-refused.test.generated.js";
import { registerExampleSpaceExtraction } from "./carrier.gherkin-authoring.example-space-extraction.test.generated.js";
import { registerMalformedRelationRefused } from "./carrier.gherkin-authoring.malformed-relation-refused.test.generated.js";
import { registerMissingIdRefused } from "./carrier.gherkin-authoring.missing-id-refused.test.generated.js";
import { registerMultiFindingBounded } from "./carrier.gherkin-authoring.multi-finding-bounded.test.generated.js";
import { registerParentChildExtraction } from "./carrier.gherkin-authoring.parent-child-extraction.test.generated.js";
import { registerStepLessScenarioRefused } from "./carrier.gherkin-authoring.step-less-scenario-refused.test.generated.js";
import { registerUnknownTagRefused } from "./carrier.gherkin-authoring.unknown-tag-refused.test.generated.js";
import { registerUnsupportedConstructRefused } from "./carrier.gherkin-authoring.unsupported-construct-refused.test.generated.js";
import { materializeGherkinCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";
import { paramsForStep } from "./helpers/generated-contract.js";

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

function createExtractionWorld(point: Partial<GherkinAuthoringConditions>): GherkinWorld {
  const state = world();
  if (point.probe !== undefined) {
    state.root = materialize(point.probe);
  }
  return state;
}

function invokeExtraction(state: GherkinWorld): void {
  if (state.root === "") {
    return;
  }

  const result = extract({ root: state.root });
  state.graph = result.graph;
  state.extractionReport = result.report;
}

function observeExtractionCount(state: GherkinWorld): GherkinAuthoringOutcome {
  return {
    kind: "extraction reports {findingCount} findings",
    findingCount: extractionReportOf(state).findings.length,
  };
}

function expectedExtractionCount(
  point: Partial<GherkinAuthoringConditions>,
  findingCount: number,
): GherkinAuthoringOutcome {
  if (point.probe === undefined) {
    return unspecified;
  }

  return { kind: "extraction reports {findingCount} findings", findingCount };
}

function assertFirstFindingAndAbsentSpec(
  state: GherkinWorld,
  finding: { readonly findingId: string; readonly line: number },
  absent: { readonly absentId: string },
): void {
  expect(extractionReportOf(state).findings[0]).toMatchObject({
    validatorId: finding.findingId,
    line: finding.line,
  });
  expect(graphOf(state).nodes.some((node) => node.id === absent.absentId)).toBe(false);
}

function assertSpecCount(state: GherkinWorld, specCount: number): void {
  expect(graphOf(state).nodes.filter((node) => node.nodeType === "Primitive")).toHaveLength(
    specCount,
  );
}

function assertGraphContainsSpec(
  state: GherkinWorld,
  specId: string,
  specKind: "behavior" | "example",
): void {
  expect(graphOf(state).nodes).toContainEqual(
    expect.objectContaining({ id: specId, nodeType: "Primitive", specKind }),
  );
}

function assertGraphOmitsSpec(state: GherkinWorld, absentId: string): void {
  expect(graphOf(state).nodes.some((node) => node.id === absentId)).toBe(false);
}

function assertNoEdgeNames(state: GherkinWorld, absentId: string): void {
  expect(graphOf(state).edges.some((edge) => edge.from === absentId || edge.to === absentId)).toBe(
    false,
  );
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
registerAuthoredFactRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(authoredFactRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(authoredFactRefusedContract, "the first finding is {findingId} at line {line}"),
      paramsForStep(authoredFactRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

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
registerDuplicateSurfaceRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(duplicateSurfaceRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    const { findingId } = paramsForStep(
      duplicateSurfaceRefusedContract,
      "the report contains finding {findingId}",
    );
    const { absentId } = paramsForStep(
      duplicateSurfaceRefusedContract,
      "the graph omits the Spec {absentId}",
    );
    const namedEdge = paramsForStep(
      duplicateSurfaceRefusedContract,
      "no graph edge names the absent Spec {absentId}",
    );
    const { specId, specKind } = paramsForStep(
      duplicateSurfaceRefusedContract,
      "the graph contains the Spec {specId} with kind {specKind}",
    );

    expect(extractionReportOf(state).findings).toContainEqual(
      expect.objectContaining({ validatorId: findingId }),
    );
    assertGraphOmitsSpec(state, absentId);
    assertNoEdgeNames(state, namedEdge.absentId);
    assertGraphContainsSpec(state, specId, specKind);
  },
});

const exampleSpaceExtractionAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.example-space-extraction"),
  label: "the example-space-extraction point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.example-space-extraction"),
});
void exampleSpaceExtractionAnchor;
registerExampleSpaceExtraction({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(exampleSpaceExtractionContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    const { specCount } = paramsForStep(
      exampleSpaceExtractionContract,
      "the graph contains exactly {specCount} Specs",
    );
    const { spaceStep } = paramsForStep(
      exampleSpaceExtractionContract,
      "the parent example space contains {spaceStep}",
    );
    const { absentId } = paramsForStep(
      exampleSpaceExtractionContract,
      "the graph omits the Spec {absentId}",
    );
    const parent = graphOf(state).nodes.find((node) => node.id === "spec:fixture.space-parent");

    assertSpecCount(state, specCount);
    if (parent?.nodeType !== "Primitive") {
      throw new Error("Expected the example-space parent Primitive.");
    }
    expect(parent.sections?.behavior?.exampleSpace?.given).toContain(
      spaceStep.replace(/^Given /u, ""),
    );
    assertGraphOmitsSpec(state, absentId);
  },
});

const malformedRelationRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.malformed-relation-refused"),
  label: "the malformed-relation-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.malformed-relation-refused"),
});
void malformedRelationRefusedAnchor;
registerMalformedRelationRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(malformedRelationRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(
        malformedRelationRefusedContract,
        "the first finding is {findingId} at line {line}",
      ),
      paramsForStep(malformedRelationRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const missingIdRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.missing-id-refused"),
  label: "the missing-id-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.missing-id-refused"),
});
void missingIdRefusedAnchor;
registerMissingIdRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(missingIdRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(missingIdRefusedContract, "the first finding is {findingId} at line {line}"),
      paramsForStep(missingIdRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const parentChildExtractionAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.parent-child-extraction"),
  label: "the parent-child-extraction point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.parent-child-extraction"),
});
void parentChildExtractionAnchor;
registerParentChildExtraction({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(parentChildExtractionContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    const { specCount } = paramsForStep(
      parentChildExtractionContract,
      "the graph contains exactly {specCount} Specs",
    );
    const parent = paramsForStep(
      parentChildExtractionContract,
      "the graph contains the Spec {specId} with kind {specKind}",
    );
    const child = paramsForStep(
      parentChildExtractionContract,
      "the graph contains the child Spec {childId} with kind {specKind}",
    );
    const relation = paramsForStep(
      parentChildExtractionContract,
      "the child Spec {childId} declares {relationType} to {relationTarget}",
    );
    const additionalRelation = paramsForStep(
      parentChildExtractionContract,
      "the child Spec {childId} declares the additional relation {relationType} to {relationTarget}",
    );

    assertSpecCount(state, specCount);
    assertGraphContainsSpec(state, parent.specId, parent.specKind);
    assertGraphContainsSpec(state, child.childId, child.specKind);
    expect(relationsOf(state, relation.childId)).toContainEqual({
      type: relation.relationType,
      target: relation.relationTarget,
      claim: "declared",
    });
    expect(relationsOf(state, additionalRelation.childId)).toContainEqual({
      type: additionalRelation.relationType,
      target: additionalRelation.relationTarget,
      claim: "declared",
    });
  },
});

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
registerUnknownTagRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(unknownTagRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(unknownTagRefusedContract, "the first finding is {findingId} at line {line}"),
      paramsForStep(unknownTagRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const unsupportedConstructRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.unsupported-construct-refused"),
  label: "the unsupported-construct-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.unsupported-construct-refused"),
});
void unsupportedConstructRefusedAnchor;
registerUnsupportedConstructRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(
        unsupportedConstructRefusedContract,
        "extraction reports {findingCount} findings",
      ).findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(
        unsupportedConstructRefusedContract,
        "the first finding is {findingId} at line {line}",
      ),
      paramsForStep(unsupportedConstructRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const descriptionLocationRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.description-location-refused"),
  label: "the description-location-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.description-location-refused"),
});
void descriptionLocationRefusedAnchor;
registerDescriptionLocationRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(
        descriptionLocationRefusedContract,
        "extraction reports {findingCount} findings",
      ).findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(
        descriptionLocationRefusedContract,
        "the first finding is {findingId} at line {line}",
      ),
      paramsForStep(descriptionLocationRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const stepLessScenarioRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.step-less-scenario-refused"),
  label: "the step-less-scenario-refused point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.step-less-scenario-refused"),
});
void stepLessScenarioRefusedAnchor;
registerStepLessScenarioRefused({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(stepLessScenarioRefusedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    assertFirstFindingAndAbsentSpec(
      state,
      paramsForStep(
        stepLessScenarioRefusedContract,
        "the first finding is {findingId} at line {line}",
      ),
      paramsForStep(stepLessScenarioRefusedContract, "the graph omits the Spec {absentId}"),
    );
  },
});

const multiFindingBoundedAnchor = specTest({
  id: testAnchorId("test:protocol.gherkin-authoring.multi-finding-bounded"),
  label: "the multi-finding-bounded point verifies the Gherkin carrier contract",
  verifies: ref("spec:carrier.gherkin-authoring.multi-finding-bounded"),
});
void multiFindingBoundedAnchor;
registerMultiFindingBounded({
  createWorld: createExtractionWorld,
  invoke: invokeExtraction,
  observe: observeExtractionCount,
  expected: (point) =>
    expectedExtractionCount(
      point,
      paramsForStep(multiFindingBoundedContract, "extraction reports {findingCount} findings")
        .findingCount,
    ),
  assertions: (state) => {
    const firstFinding = paramsForStep(
      multiFindingBoundedContract,
      "the first finding is {findingId} at line {line}",
    );
    const { specCount } = paramsForStep(
      multiFindingBoundedContract,
      "the graph contains exactly {specCount} Specs",
    );
    const omittedSpec = paramsForStep(
      multiFindingBoundedContract,
      "the graph omits the Spec {absentId}",
    );
    const absentEdge = paramsForStep(
      multiFindingBoundedContract,
      "no graph edge names the absent Spec {absentId}",
    );
    const healthySpec = paramsForStep(
      multiFindingBoundedContract,
      "the graph contains the Spec {specId} with kind {specKind}",
    );

    expect(extractionReportOf(state).findings[0]).toMatchObject({
      validatorId: firstFinding.findingId,
      line: firstFinding.line,
    });
    assertSpecCount(state, specCount);
    assertGraphOmitsSpec(state, omittedSpec.absentId);
    assertNoEdgeNames(state, absentEdge.absentId);
    assertGraphContainsSpec(state, healthySpec.specId, healthySpec.specKind);
  },
});

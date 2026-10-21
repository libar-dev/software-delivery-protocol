import { specOracle, oracleAnchorId } from "@libar-dev/software-delivery-protocol";
import { secondEntryUntargetedContract } from "../generated/contracts/validation.kind-evidence.second-entry-untargeted.contract.js";
import { registerSecondEntryUntargeted } from "./validation.kind-evidence.second-entry-untargeted.test.generated.js";
import type {
  SupersededDecisionSignalConditions,
  SupersededDecisionSignalOutcome,
} from "../generated/contracts/validation.superseded-decision-signal.space.js";
import { replacedRulingWarnsContract } from "../generated/contracts/validation.superseded-decision-signal.replaced-ruling-warns.contract.js";
import { registerReplacedRulingWarns } from "./validation.superseded-decision-signal.replaced-ruling-warns.test.generated.js";
import { chainEndNamedContract } from "../generated/contracts/validation.superseded-decision-signal.chain-end-named.contract.js";
import { registerChainEndNamed } from "./validation.superseded-decision-signal.chain-end-named.test.generated.js";
import { branchNamesEveryEndContract } from "../generated/contracts/validation.superseded-decision-signal.branch-names-every-end.contract.js";
import { registerBranchNamesEveryEnd } from "./validation.superseded-decision-signal.branch-names-every-end.test.generated.js";
import { closedChainNamedContract } from "../generated/contracts/validation.superseded-decision-signal.closed-chain-named.contract.js";
import { registerClosedChainNamed } from "./validation.superseded-decision-signal.closed-chain-named.test.generated.js";
import { dependencyUnreadContract } from "../generated/contracts/validation.superseded-decision-signal.dependency-unread.contract.js";
import { registerDependencyUnread } from "./validation.superseded-decision-signal.dependency-unread.test.generated.js";
import { supersededSubjectSilentContract } from "../generated/contracts/validation.superseded-decision-signal.superseded-subject-silent.contract.js";
import { registerSupersededSubjectSilent } from "./validation.superseded-decision-signal.superseded-subject-silent.test.generated.js";
import { replacementBelowReadyNamedContract } from "../generated/contracts/validation.superseded-decision-signal.replacement-below-ready-named.contract.js";
import { registerReplacementBelowReadyNamed } from "./validation.superseded-decision-signal.replacement-below-ready-named.test.generated.js";
import { liveReplacementWarnsContract } from "../generated/contracts/validation.superseded-decision-signal.live-replacement-warns.contract.js";
import { registerLiveReplacementWarns } from "./validation.superseded-decision-signal.live-replacement-warns.test.generated.js";
import { endAndLoopNamedContract } from "../generated/contracts/validation.superseded-decision-signal.end-and-loop-named.contract.js";
import { registerEndAndLoopNamed } from "./validation.superseded-decision-signal.end-and-loop-named.test.generated.js";
import { expect, it } from "vitest";
import { fileURLToPath } from "node:url";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import { orphanSignalContract } from "../generated/contracts/validation.warn-level-signals.orphan-signal.contract.js";
import { readyGapSignalContract } from "../generated/contracts/validation.warn-level-signals.ready-gap-signal.contract.js";
import type {
  WarnLevelSignalsConditions,
  WarnLevelSignalsOutcome,
} from "../generated/contracts/validation.warn-level-signals.space.js";
import { sectionAuthoredFactContract } from "../generated/contracts/validation.authored-honesty.section-authored-fact.contract.js";
import { unearnedStatedFactContract } from "../generated/contracts/validation.authored-honesty.unearned-stated-fact.contract.js";
import type {
  AuthoredHonestyConditions,
  AuthoredHonestyOutcome,
} from "../generated/contracts/validation.authored-honesty.space.js";
import { danglingTargetContract } from "../generated/contracts/validation.referential-integrity.dangling-target.contract.js";
import { didYouMeanContract } from "../generated/contracts/validation.referential-integrity.did-you-mean.contract.js";
import type {
  ReferentialIntegrityConditions,
  ReferentialIntegrityOutcome,
} from "../generated/contracts/validation.referential-integrity.space.js";
import { blockingOpenQuestionContract } from "../generated/contracts/validation.readiness-floor.blocking-open-question.contract.js";
import { unrelatedScopedSpecContract } from "../generated/contracts/validation.readiness-floor.unrelated-scoped-spec.contract.js";
import type {
  ReadinessFloorConditions,
  ReadinessFloorOutcome,
} from "../generated/contracts/validation.readiness-floor.space.js";
import { constraintsAloneContract } from "../generated/contracts/validation.kind-evidence.constraints-alone.contract.js";
import { emptyPromotedChildContract } from "../generated/contracts/validation.kind-evidence.empty-promoted-child.contract.js";
import type {
  KindEvidenceConditions,
  KindEvidenceOutcome,
} from "../generated/contracts/validation.kind-evidence.space.js";
import { untargetedConstraintContract } from "../generated/contracts/validation.kind-evidence.untargeted-constraint.contract.js";
import { collapsedEdgeClaimContract } from "../generated/contracts/validation.claim-separation.collapsed-edge-claim.contract.js";
import { unratifiedDescriptorContract } from "../generated/contracts/validation.claim-separation.unratified-descriptor.contract.js";
import type {
  ClaimSeparationConditions,
  ClaimSeparationOutcome,
} from "../generated/contracts/validation.claim-separation.space.js";
import { incoherentAggregateContract } from "../generated/contracts/validation.pack-coherence.incoherent-aggregate.contract.js";
import type {
  PackCoherenceConditions,
  PackCoherenceOutcome,
} from "../generated/contracts/validation.pack-coherence.space.js";
import { splitReportContract } from "../generated/contracts/validation.two-check-families.split-report.contract.js";
import type {
  TwoCheckFamiliesConditions,
  TwoCheckFamiliesOutcome,
} from "../generated/contracts/validation.two-check-families.space.js";
import { unboundExampleContract } from "../generated/contracts/validation.verification-linkage.unbound-example.contract.js";
import { unresolvedOracleContract } from "../generated/contracts/validation.verification-linkage.unresolved-oracle.contract.js";
import type {
  VerificationLinkageConditions,
  VerificationLinkageOutcome,
} from "../generated/contracts/validation.verification-linkage.space.js";
import type {
  OracleTargetEligibilityConditions,
  OracleTargetEligibilityOutcome,
} from "../generated/contracts/validation.oracle-target-eligibility.space.js";
import { createReader, extract, schemaVersion, validateGraph } from "../src/index.js";
import type {
  Finding,
  GraphClaim,
  GraphEdge,
  GraphNode,
  PrimitiveNode,
  SpecContext,
  SpecKind,
  SpecReadiness,
  ValidationReport,
} from "../src/index.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerSectionAuthoredFact } from "./validation.authored-honesty.section-authored-fact.test.generated.js";
import { registerUnearnedStatedFact } from "./validation.authored-honesty.unearned-stated-fact.test.generated.js";
import { registerCollapsedEdgeClaim } from "./validation.claim-separation.collapsed-edge-claim.test.generated.js";
import { registerUnratifiedDescriptor } from "./validation.claim-separation.unratified-descriptor.test.generated.js";
import { registerConstraintsAlone } from "./validation.kind-evidence.constraints-alone.test.generated.js";
import { registerEmptyPromotedChild } from "./validation.kind-evidence.empty-promoted-child.test.generated.js";
import { registerUntargetedConstraint } from "./validation.kind-evidence.untargeted-constraint.test.generated.js";
import { registerIncoherentAggregate } from "./validation.pack-coherence.incoherent-aggregate.test.generated.js";
import { registerBlockingOpenQuestion } from "./validation.readiness-floor.blocking-open-question.test.generated.js";
import { registerUnrelatedScopedSpec } from "./validation.readiness-floor.unrelated-scoped-spec.test.generated.js";
import { registerDanglingTarget } from "./validation.referential-integrity.dangling-target.test.generated.js";
import { registerDidYouMean } from "./validation.referential-integrity.did-you-mean.test.generated.js";
import { registerSplitReport } from "./validation.two-check-families.split-report.test.generated.js";
import { registerMissingSpaceRefused } from "./validation.oracle-target-eligibility.missing-space-refused.test.generated.js";
import { registerRuleSpaceAccepted } from "./validation.oracle-target-eligibility.rule-space-accepted.test.generated.js";
import { registerUnboundExample } from "./validation.verification-linkage.unbound-example.test.generated.js";
import { registerUnresolvedOracle } from "./validation.verification-linkage.unresolved-oracle.test.generated.js";
import { registerOrphanSignal } from "./validation.warn-level-signals.orphan-signal.test.generated.js";
import { registerReadyGapSignal } from "./validation.warn-level-signals.ready-gap-signal.test.generated.js";

/**
 * The bound executable points of the validation family: each adopted registrar below runs one
 * authored example spec against a probe graph `createWorld` assembles in memory. The graph is
 * the public validation seam, so a hand-built `GraphSchema` is the honest input class here —
 * several of these laws have teeth only for a producer other than this repository's extractor.
 *
 * The plain-vitest suite in `test/validators.test.ts` stays as regression evidence: a bound
 * contract replaces an assertion only where it honestly carries it, and these points state the
 * laws, never every table row.
 */
interface ValidatorWorld {
  readonly nodes: GraphNode[];
  readonly edges: GraphEdge[];
  subjectId: string;
  report: ValidationReport | undefined;
}

function validatorWorld(): ValidatorWorld {
  return { nodes: [], edges: [], subjectId: "", report: undefined };
}

interface ProbeOptions {
  readonly kind?: SpecKind;
  readonly readiness?: SpecReadiness;
}

/** A probe spec carrying its kind's evidence, so only the law under test moves the findings. */
function probeSpec(id: string, options: ProbeOptions = {}): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: options.kind ?? "behavior",
    altitude: "feature",
    readiness: options.readiness ?? "idea",
    title: `Probe for ${id}`,
    file: "specs/probe.sdp.md",
    sections: {
      intent: { outcome: `Probe one validator law at "${id}".` },
      behavior: { rules: ["The probe carries its own kind evidence."] },
    },
  };
}

function validate(world: ValidatorWorld): void {
  world.report = validateGraph({ schemaVersion, nodes: world.nodes, edges: world.edges });
}

function reportOf(world: ValidatorWorld): ValidationReport {
  if (world.report === undefined) {
    throw new Error("The validation step must run before the outcome is asserted.");
  }

  return world.report;
}

function findingsOf(world: ValidatorWorld, validatorId: string): readonly Finding[] {
  return reportOf(world).findings.filter((finding) => finding.validatorId === validatorId);
}

/**
 * A written decision at `defined`
 * clears the typed dependency target bound, so a decidedBy edge satisfies the relation clause
 * without adding a second floor failure.
 */
function declareDecisionRelation(world: ValidatorWorld): void {
  const decisionId = `${world.subjectId}-decider`;

  const decision = probeSpec(decisionId, { kind: "decision", readiness: "defined" });
  world.nodes.push({
    ...decision,
    sections: { ...decision.sections, decision: { decision: "Choose the probe endpoint." } },
  });
  world.edges.push({ from: decisionId, type: "dependsOn", to: world.subjectId, claim: "declared" });
  world.edges.push({
    from: world.subjectId,
    type: "decidedBy",
    to: decisionId,
    claim: "declared",
  });
}

/** Replaces the subject probe in place, so a step may enrich the node an earlier step pushed. */
function reviseSubject(
  world: ValidatorWorld,
  revise: (node: PrimitiveNode) => PrimitiveNode,
  failure: string,
): void {
  const index = world.nodes.findIndex((entry) => entry.id === world.subjectId);
  const node = world.nodes[index];

  if (node?.nodeType !== "Primitive") {
    throw new Error(failure);
  }

  world.nodes[index] = revise(node);
}

/** The shared Then step of the floor family: exactly one clause refuses, and it is the named one. */
function namesUnmetClause(world: ValidatorWorld, params: { readonly clauseId: string }): void {
  const findings = findingsOf(world, "honesty/readiness-floor");

  expect(findings.map((finding) => finding.relatedId)).toEqual([params.clauseId]);
  expect(findings.map((finding) => finding.subjectId)).toEqual([world.subjectId]);
  expect(findings.map((finding) => finding.path)).toEqual(["readiness"]);
}

function holdsErrorCount(world: ValidatorWorld, params: { readonly errorCount: number }): void {
  expect(reportOf(world).findings.filter((finding) => finding.severity === "error")).toHaveLength(
    params.errorCount,
  );
}

interface NamedFindingOutcome {
  readonly kind: "the report names {findingId} at severity {severity}";
  readonly findingId: string;
  readonly severity: "warning" | "error";
}

function observeNamedFindingAt(
  world: ValidatorWorld,
  severity: "warning" | "error",
): NamedFindingOutcome {
  const matches = reportOf(world).findings.filter((finding) => finding.severity === severity);
  const findingIds = [...new Set(matches.map((finding) => finding.validatorId))];
  const findingId = findingIds[0];

  if (findingId === undefined || findingIds.length !== 1) {
    throw new Error(
      `The validation report must hold exactly one ${severity} validator class before it is observed.`,
    );
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId,
    severity,
  };
}

function expectedNamedFindingAt(
  complete: boolean,
  findingId: string,
  severity: "warning" | "error",
): NamedFindingOutcome | typeof unspecified {
  if (!complete) {
    return unspecified;
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId,
    severity,
  };
}

function invokeValidate(world: ValidatorWorld): void {
  if (world.subjectId === "") {
    return;
  }

  validate(world);
}

function namesSubject(world: ValidatorWorld, findingId: string): void {
  expect(findingsOf(world, findingId).map((finding) => finding.subjectId)).toEqual([
    world.subjectId,
  ]);
}

/* ----- spec:validation.readiness-floor ----- */

function createReadinessFloorWorld(point: Partial<ReadinessFloorConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { specId, readiness, defect } = point;

  if (specId === undefined || readiness === undefined || defect === undefined) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(probeSpec(specId, { readiness }));

  if (defect === "records a blocking open question") {
    // Every other clause of the stated rung still passes: the blocked probe declares its relation
    // and keeps its kind evidence, so the open-questions clause is the only one that can refuse.
    reviseSubject(
      world,
      (node) => ({
        ...node,
        sections: {
          ...node.sections,
          intent: {
            ...node.sections?.intent,
            openQuestions: [
              { question: "Which rung does the probe honestly stand at?", blocking: true },
            ],
          },
        },
      }),
      "The spec step must run before its open question is recorded.",
    );
    declareDecisionRelation(world);
  }

  return world;
}

function observeReadinessFloor(world: ValidatorWorld): ReadinessFloorOutcome {
  return observeNamedFindingAt(world, "error");
}

function expectedReadinessFloor(point: Partial<ReadinessFloorConditions>): ReadinessFloorOutcome {
  return expectedNamedFindingAt(
    point.specId !== undefined && point.readiness !== undefined && point.defect !== undefined,
    "honesty/readiness-floor",
    "error",
  );
}

function assertReadinessFloor(
  world: ValidatorWorld,
  contract: typeof unrelatedScopedSpecContract | typeof blockingOpenQuestionContract,
): void {
  const { clauseId } = paramsForStep(
    contract,
    "the finding names the unmet floor clause {clauseId}",
  );
  const { errorCount } = paramsForStep(contract, "the report holds {errorCount} errors");

  namesUnmetClause(world, { clauseId });
  holdsErrorCount(world, { errorCount });
}

const unrelatedScopedSpecTestAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-floor.unrelated-scoped-spec"),
  label: "the unrelated-scoped point verifies the relation clause of the scoped rung",
  verifies: ref("spec:validation.readiness-floor.unrelated-scoped-spec"),
});
void unrelatedScopedSpecTestAnchor;
registerUnrelatedScopedSpec({
  createWorld: createReadinessFloorWorld,
  invoke: invokeValidate,
  observe: observeReadinessFloor,
  expected: expectedReadinessFloor,
  assertions: (world) => {
    assertReadinessFloor(world, unrelatedScopedSpecContract);
  },
});

const blockingOpenQuestionTestAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-floor.blocking-open-question"),
  label: "the blocked-question point verifies the open-questions clause of the defined rung",
  verifies: ref("spec:validation.readiness-floor.blocking-open-question"),
});
void blockingOpenQuestionTestAnchor;
registerBlockingOpenQuestion({
  createWorld: createReadinessFloorWorld,
  invoke: invokeValidate,
  observe: observeReadinessFloor,
  expected: expectedReadinessFloor,
  assertions: (world) => {
    assertReadinessFloor(world, blockingOpenQuestionContract);
  },
});

/* ----- spec:validation.kind-evidence ----- */

/** A probe carrying no kind evidence at all, so the evidence step alone decides what it shows. */
function evidencelessProbe(id: string, kind: SpecKind, readiness: SpecReadiness): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: kind,
    altitude: "feature",
    readiness,
    title: `Probe for ${id}`,
    file: "specs/probe.sdp.md",
    sections: { intent: { outcome: `Probe the per-kind evidence table at "${id}".` } },
  };
}

function placeKindEvidence(
  world: ValidatorWorld,
  evidence: KindEvidenceConditions["evidence"],
): void {
  if (evidence === "a targeted constraints entry and an untargeted second entry") {
    reviseSubject(
      world,
      (node) => ({
        ...node,
        sections: {
          ...node.sections,
          constraints: [
            { statement: "The probe answers within its budget.", target: "p95 < 200ms" },
            { statement: "The second entry has no target." },
          ],
        },
      }),
      "The constraint probe must be present.",
    );
    return;
  }
  if (evidence === "an empty promoted rule child") {
    // Promotion moves content out, so a stub child carrying none of its own kind's evidence is
    // not a promotion: it resolves, it refines, and it still confers nothing.
    const childId = `${world.subjectId}.promoted-stub`;

    world.nodes.push(evidencelessProbe(childId, "rule", "idea"));
    world.edges.push({
      from: childId,
      type: "refines",
      to: world.subjectId,
      claim: "declared",
    });
    return;
  }

  reviseSubject(
    world,
    (node) => ({
      ...node,
      sections: {
        ...node.sections,
        constraints: [
          evidence === "a constraints entry carrying a target"
            ? { statement: "The probe answers within its budget.", target: "p95 < 200ms" }
            : { statement: "The probe answers quickly enough." },
        ],
      },
    }),
    "The spec step must run before its evidence is placed.",
  );
}

function createKindEvidenceWorld(point: Partial<KindEvidenceConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { kind, specId, readiness, evidence } = point;

  if (
    kind === undefined ||
    specId === undefined ||
    readiness === undefined ||
    evidence === undefined
  ) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(evidencelessProbe(specId, kind, readiness));
  // The relation clause is not the law under test, so the probe always declares one.
  declareDecisionRelation(world);
  placeKindEvidence(world, evidence);
  return world;
}

function invokeKindEvidenceValidate(world: ValidatorWorld): void {
  if (world.subjectId === "") {
    return;
  }

  validate(world);
}

function observeNamedFinding(world: ValidatorWorld): KindEvidenceOutcome {
  const errors = reportOf(world).findings.filter((finding) => finding.severity === "error");
  const finding = errors[0];

  if (finding === undefined || errors.length !== 1) {
    throw new Error("The validation report must hold exactly one error before it is observed.");
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId: finding.validatorId,
    severity: "error",
  };
}

function expectedNamedFinding(
  point: Partial<KindEvidenceConditions>,
  findingId: string,
  severity: "warning" | "error",
): KindEvidenceOutcome {
  if (
    point.kind === undefined ||
    point.specId === undefined ||
    point.readiness === undefined ||
    point.evidence === undefined
  ) {
    return unspecified;
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId,
    severity,
  };
}

function assertKindEvidenceFloor(
  world: ValidatorWorld,
  clauseId: string,
  errorCount: number,
): void {
  // Second and third Thens (`the finding names the unmet floor clause`, `the report holds
  // {errorCount} errors`) are different kinds than the oracle's named-finding Then.
  namesUnmetClause(world, { clauseId });
  holdsErrorCount(world, { errorCount });
}

const constraintsAloneTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.constraints-alone"),
  label: "the constraints-alone point verifies the behavior-family complete cell",
  verifies: ref("spec:validation.kind-evidence.constraints-alone"),
});
void constraintsAloneTestAnchor;
registerConstraintsAlone({
  createWorld: createKindEvidenceWorld,
  invoke: invokeKindEvidenceValidate,
  observe: observeNamedFinding,
  expected: expectedKindEvidence,
  assertions: (world) => {
    const { clauseId } = paramsForStep(
      constraintsAloneContract,
      "the finding names the unmet floor clause {clauseId}",
    );
    const { errorCount } = paramsForStep(
      constraintsAloneContract,
      "the report holds {errorCount} errors",
    );

    assertKindEvidenceFloor(world, clauseId, errorCount);
  },
});

const untargetedConstraintTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.untargeted-constraint"),
  label: "the untargeted-constraint point verifies the constraint row's target requirement",
  verifies: ref("spec:validation.kind-evidence.untargeted-constraint"),
});
void untargetedConstraintTestAnchor;
registerUntargetedConstraint({
  createWorld: createKindEvidenceWorld,
  invoke: invokeKindEvidenceValidate,
  observe: observeNamedFinding,
  expected: expectedKindEvidence,
  assertions: (world) => {
    const { clauseId } = paramsForStep(
      untargetedConstraintContract,
      "the finding names the unmet floor clause {clauseId}",
    );
    const { errorCount } = paramsForStep(
      untargetedConstraintContract,
      "the report holds {errorCount} errors",
    );

    assertKindEvidenceFloor(world, clauseId, errorCount);
  },
});

const emptyPromotedChildTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.empty-promoted-child"),
  label: "the empty-promotion point verifies the promoted-evidence honesty bound",
  verifies: ref("spec:validation.kind-evidence.empty-promoted-child"),
});
void emptyPromotedChildTestAnchor;
registerEmptyPromotedChild({
  createWorld: createKindEvidenceWorld,
  invoke: invokeKindEvidenceValidate,
  observe: observeNamedFinding,
  expected: expectedKindEvidence,
  assertions: (world) => {
    const { clauseId } = paramsForStep(
      emptyPromotedChildContract,
      "the finding names the unmet floor clause {clauseId}",
    );
    const { errorCount } = paramsForStep(
      emptyPromotedChildContract,
      "the report holds {errorCount} errors",
    );

    assertKindEvidenceFloor(world, clauseId, errorCount);
  },
});

/* ----- spec:validation.warn-level-signals ----- */

function createWarnLevelWorld(point: Partial<WarnLevelSignalsConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { specId, readiness, relations } = point;

  if (specId === undefined || readiness === undefined || relations === undefined) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(probeSpec(specId, { readiness }));

  if (relations === "a decidedBy decision") {
    // The decision clears its own defined floor and the subject's typed dependency bound,
    // so the missing verifier remains the probe's only warning.
    declareDecisionRelation(world);
  }

  return world;
}

function observeWarnLevel(world: ValidatorWorld): WarnLevelSignalsOutcome {
  return observeNamedFindingAt(world, "warning");
}

function expectedWarnLevel(
  point: Partial<WarnLevelSignalsConditions>,
  findingId: string,
): WarnLevelSignalsOutcome {
  return expectedNamedFindingAt(
    point.specId !== undefined && point.readiness !== undefined && point.relations !== undefined,
    findingId,
    "warning",
  );
}

function assertWarnLevel(
  world: ValidatorWorld,
  contract: typeof orphanSignalContract | typeof readyGapSignalContract,
  findingId: string,
): void {
  const { errorCount } = paramsForStep(contract, "the report holds {errorCount} errors");

  namesSubject(world, findingId);
  holdsErrorCount(world, { errorCount });
}

const warnLevelOrphanTestAnchor = specTest({
  id: testAnchorId("test:protocol.warn-level-signals.orphan-signal"),
  label: "the orphan point verifies the disconnected-spec warning",
  verifies: ref("spec:validation.warn-level-signals.orphan-signal"),
});
void warnLevelOrphanTestAnchor;
registerOrphanSignal({
  createWorld: createWarnLevelWorld,
  invoke: invokeValidate,
  observe: observeWarnLevel,
  expected: (point) => expectedWarnLevel(point, "conformance/orphans"),
  assertions: (world) => {
    assertWarnLevel(world, orphanSignalContract, "conformance/orphans");
  },
});

const warnLevelGapTestAnchor = specTest({
  id: testAnchorId("test:protocol.warn-level-signals.ready-gap-signal"),
  label: "the gap point verifies the unverified-ready warning",
  verifies: ref("spec:validation.warn-level-signals.ready-gap-signal"),
});
void warnLevelGapTestAnchor;
registerReadyGapSignal({
  createWorld: createWarnLevelWorld,
  invoke: invokeValidate,
  observe: observeWarnLevel,
  expected: (point) => expectedWarnLevel(point, "honesty/gaps"),
  assertions: (world) => {
    assertWarnLevel(world, readyGapSignalContract, "honesty/gaps");
  },
});

/* ----- spec:validation.referential-integrity ----- */

function createReferentialIntegrityWorld(
  point: Partial<ReferentialIntegrityConditions>,
): ValidatorWorld {
  const world = validatorWorld();
  const { presentId, targetId } = point;

  if (presentId === undefined || targetId === undefined) {
    return world;
  }

  world.subjectId = presentId;
  world.nodes.push(probeSpec(presentId));
  world.edges.push({
    from: presentId,
    type: "dependsOn",
    to: targetId,
    claim: "declared",
  });
  return world;
}

function observeReferentialIntegrity(world: ValidatorWorld): ReferentialIntegrityOutcome {
  return observeNamedFindingAt(world, "error");
}

function expectedReferentialIntegrity(
  point: Partial<ReferentialIntegrityConditions>,
): ReferentialIntegrityOutcome {
  return expectedNamedFindingAt(
    point.presentId !== undefined && point.targetId !== undefined,
    "conformance/referential-integrity",
    "error",
  );
}

function assertReferentialIntegrity(
  world: ValidatorWorld,
  contract: typeof danglingTargetContract | typeof didYouMeanContract,
): void {
  const { suggested } = paramsForStep(
    contract,
    "the finding offers the nearest-id suggestion: {suggested}",
  );
  const message =
    findingsOf(world, "conformance/referential-integrity")[0]?.message ??
    "the referential-integrity finding is missing";

  namesSubject(world, "conformance/referential-integrity");

  if (suggested) {
    expect(message).toContain(`Did you mean "${world.subjectId}"?`);
    return;
  }

  expect(message).not.toContain("Did you mean");
}

const danglingTargetTestAnchor = specTest({
  id: testAnchorId("test:protocol.referential-integrity.dangling-target"),
  label: "the dangling-target point verifies the unresolved-reference error",
  verifies: ref("spec:validation.referential-integrity.dangling-target"),
});
void danglingTargetTestAnchor;
registerDanglingTarget({
  createWorld: createReferentialIntegrityWorld,
  invoke: invokeValidate,
  observe: observeReferentialIntegrity,
  expected: expectedReferentialIntegrity,
  assertions: (world) => {
    assertReferentialIntegrity(world, danglingTargetContract);
  },
});

const didYouMeanTestAnchor = specTest({
  id: testAnchorId("test:protocol.referential-integrity.did-you-mean"),
  label: "the near-miss point verifies the unique did-you-mean suggestion",
  verifies: ref("spec:validation.referential-integrity.did-you-mean"),
});
void didYouMeanTestAnchor;
registerDidYouMean({
  createWorld: createReferentialIntegrityWorld,
  invoke: invokeValidate,
  observe: observeReferentialIntegrity,
  expected: expectedReferentialIntegrity,
  assertions: (world) => {
    assertReferentialIntegrity(world, didYouMeanContract);
  },
});

/* ----- spec:validation.authored-honesty ----- */

function createAuthoredHonestyWorld(point: Partial<AuthoredHonestyConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { specId, factName, site } = point;

  if (specId === undefined || factName === undefined || site === undefined) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(probeSpec(specId));

  const node = world.nodes[world.nodes.length - 1];

  if (node?.nodeType !== "Primitive") {
    throw new Error("The spec step must run before the fact is smuggled onto it.");
  }

  // Typed sections are the authoring-time guardrail; the graph is a public seam, so both
  // smuggling routes are shaped here as the value data a foreign producer could hand over.
  world.nodes[world.nodes.length - 1] =
    site === "the node deliveryFacts array"
      ? { ...node, deliveryFacts: [factName] }
      : {
          ...node,
          sections: {
            ...node.sections,
            behavior: { ...node.sections?.behavior, [factName]: true },
          },
        };

  return world;
}

function observeAuthoredHonesty(world: ValidatorWorld): AuthoredHonestyOutcome {
  return observeNamedFindingAt(world, "error");
}

function expectedAuthoredHonesty(
  point: Partial<AuthoredHonestyConditions>,
  findingId: string,
): AuthoredHonestyOutcome {
  return expectedNamedFindingAt(
    point.specId !== undefined && point.factName !== undefined && point.site !== undefined,
    findingId,
    "error",
  );
}

function assertAuthoredHonesty(
  world: ValidatorWorld,
  contract: typeof sectionAuthoredFactContract | typeof unearnedStatedFactContract,
  findingId: string,
): void {
  const { relatedId, phrase } = paramsForStep(
    contract,
    "the finding names the fact {relatedId} and states {phrase}",
  );
  const findings = reportOf(world).findings.filter(
    (finding) => finding.relatedId === relatedId && finding.subjectId === world.subjectId,
  );

  namesSubject(world, findingId);
  expect(findings).toHaveLength(1);
  expect(findings[0]?.message).toContain(phrase);
}

const sectionAuthoredFactTestAnchor = specTest({
  id: testAnchorId("test:protocol.authored-honesty.section-authored-fact"),
  label: "the section point verifies the authoring-shape refusal",
  verifies: ref("spec:validation.authored-honesty.section-authored-fact"),
});
void sectionAuthoredFactTestAnchor;
registerSectionAuthoredFact({
  createWorld: createAuthoredHonestyWorld,
  invoke: invokeValidate,
  observe: observeAuthoredHonesty,
  expected: (point) => expectedAuthoredHonesty(point, "honesty/authoring-shape"),
  assertions: (world) => {
    assertAuthoredHonesty(world, sectionAuthoredFactContract, "honesty/authoring-shape");
  },
});

const unearnedStatedFactTestAnchor = specTest({
  id: testAnchorId("test:protocol.authored-honesty.unearned-stated-fact"),
  label: "the stated-fact point verifies the delivery-fact refusal",
  verifies: ref("spec:validation.authored-honesty.unearned-stated-fact"),
});
void unearnedStatedFactTestAnchor;
registerUnearnedStatedFact({
  createWorld: createAuthoredHonestyWorld,
  invoke: invokeValidate,
  observe: observeAuthoredHonesty,
  expected: (point) => expectedAuthoredHonesty(point, "honesty/delivery-facts"),
  assertions: (world) => {
    assertAuthoredHonesty(world, unearnedStatedFactContract, "honesty/delivery-facts");
  },
});

/* ----- spec:validation.claim-separation ----- */

function createClaimSeparationWorld(point: Partial<ClaimSeparationConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { specId, element, value } = point;

  if (specId === undefined || element === undefined || value === undefined) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(probeSpec(specId));

  const node = world.nodes[world.nodes.length - 1];

  if (node?.nodeType !== "Primitive") {
    throw new Error("The spec step must run before the off-contract shape is placed.");
  }

  if (element === "descriptor value") {
    world.nodes[world.nodes.length - 1] = { ...node, specKind: value as SpecKind };
    return world;
  }

  const binderId = "impl:probe.create-order-use-case";
  world.nodes.push({
    id: binderId,
    nodeType: "CodeNode",
    claim: "anchored",
    file: "src/probe/create-order.use-case.ts",
    line: 3,
  });
  world.edges.push({
    from: binderId,
    type: "satisfies",
    to: specId,
    claim: value as GraphClaim,
  });
  return world;
}

function observeClaimSeparation(world: ValidatorWorld): ClaimSeparationOutcome {
  return observeNamedFindingAt(world, "error");
}

function expectedClaimSeparation(
  point: Partial<ClaimSeparationConditions>,
): ClaimSeparationOutcome {
  return expectedNamedFindingAt(
    point.specId !== undefined && point.element !== undefined && point.value !== undefined,
    "conformance/claim-separation",
    "error",
  );
}

function assertClaimSeparation(
  world: ValidatorWorld,
  contract: typeof collapsedEdgeClaimContract | typeof unratifiedDescriptorContract,
): void {
  const { phrase } = paramsForStep(contract, "the finding message states {phrase}");
  const { floorCount } = paramsForStep(
    contract,
    "the report holds {floorCount} readiness-floor findings",
  );
  const messages = findingsOf(world, "conformance/claim-separation").map(
    (finding) => finding.message,
  );

  expect(messages.filter((message) => message.includes(phrase))).toHaveLength(1);
  expect(findingsOf(world, "honesty/readiness-floor")).toHaveLength(floorCount);
}

const collapsedEdgeClaimTestAnchor = specTest({
  id: testAnchorId("test:protocol.claim-separation.collapsed-edge-claim"),
  label: "the collapsed-claim point verifies the binding-edge contract row",
  verifies: ref("spec:validation.claim-separation.collapsed-edge-claim"),
});
void collapsedEdgeClaimTestAnchor;
registerCollapsedEdgeClaim({
  createWorld: createClaimSeparationWorld,
  invoke: invokeValidate,
  observe: observeClaimSeparation,
  expected: expectedClaimSeparation,
  assertions: (world) => {
    assertClaimSeparation(world, collapsedEdgeClaimContract);
  },
});

const unratifiedDescriptorTestAnchor = specTest({
  id: testAnchorId("test:protocol.claim-separation.unratified-descriptor"),
  label: "the unratified-kind point verifies the fail-closed descriptor law",
  verifies: ref("spec:validation.claim-separation.unratified-descriptor"),
});
void unratifiedDescriptorTestAnchor;
registerUnratifiedDescriptor({
  createWorld: createClaimSeparationWorld,
  invoke: invokeValidate,
  observe: observeClaimSeparation,
  expected: expectedClaimSeparation,
  assertions: (world) => {
    assertClaimSeparation(world, unratifiedDescriptorContract);
  },
});

/* ----- spec:validation.verification-linkage ----- */

interface SpecContextWorld extends ValidatorWorld {
  context: SpecContext | undefined;
}

function createVerificationLinkageWorld(
  point: Partial<VerificationLinkageConditions>,
): SpecContextWorld {
  const world: SpecContextWorld = { ...validatorWorld(), context: undefined };
  const { parentId, verifierKind, verifierId } = point;

  if (parentId === undefined || verifierKind === undefined || verifierId === undefined) {
    return world;
  }

  world.subjectId = parentId;
  world.nodes.push(probeSpec(parentId));

  if (verifierKind === "example spec") {
    world.nodes.push(probeSpec(verifierId, { kind: "example", readiness: "ready" }));
    world.edges.push({
      from: verifierId,
      type: "verifies",
      to: parentId,
      claim: "declared",
    });
    return world;
  }

  // The oracle anchor resolves as a node and rides its contract row; what it cannot resolve
  // through is the modelled spec's example space, which the parent probe never owns.
  world.nodes.push({
    id: verifierId,
    nodeType: "Anchor",
    claim: "anchored",
    file: "test/probe-oracle.test.ts",
    line: 5,
  });
  world.edges.push({
    from: verifierId,
    type: "models",
    to: parentId,
    claim: "anchored",
  });
  return world;
}

function invokeSpecContext(world: SpecContextWorld): void {
  if (world.subjectId === "") {
    return;
  }

  world.context = createReader({
    schemaVersion,
    nodes: world.nodes,
    edges: world.edges,
  }).specContext(world.subjectId);
}

function observeVerificationLinkage(
  world: SpecContextWorld,
  findingId: string,
): VerificationLinkageOutcome {
  const context = world.context;

  if (context === undefined) {
    throw new Error("The reader context must be stored before the outcome is observed.");
  }

  const finding = context.findings.find((entry) => entry.validatorId === findingId);

  if (finding === undefined) {
    throw new Error(`The reader context must name ${findingId} before it is observed.`);
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId: finding.validatorId,
    severity: finding.severity,
  };
}

function expectedVerificationLinkage(
  point: Partial<VerificationLinkageConditions>,
  findingId: string,
  severity: "warning" | "error",
): VerificationLinkageOutcome {
  if (
    point.parentId === undefined ||
    point.verifierKind === undefined ||
    point.verifierId === undefined
  ) {
    return unspecified;
  }

  return {
    kind: "the report names {findingId} at severity {severity}",
    findingId,
    severity,
  };
}

function assertVerificationLinkage(
  world: SpecContextWorld,
  contract: typeof unboundExampleContract | typeof unresolvedOracleContract,
): void {
  const context = world.context;

  if (context === undefined) {
    throw new Error("The reader context must be stored before the outcome is asserted.");
  }

  const step = "the parent earns the delivery fact has-verifier: {conferred}";
  const { conferred } =
    contract === unboundExampleContract
      ? paramsForStep(unboundExampleContract, step)
      : paramsForStep(unresolvedOracleContract, step);

  expect(context.deliveryFacts.includes("has-verifier")).toBe(conferred);
}

const unboundExampleTestAnchor = specTest({
  id: testAnchorId("test:protocol.verification-linkage.unbound-example"),
  label: "the unbound-example point verifies the incomplete spec-to-test trace",
  verifies: ref("spec:validation.verification-linkage.unbound-example"),
});
void unboundExampleTestAnchor;
registerUnboundExample({
  createWorld: createVerificationLinkageWorld,
  invoke: invokeSpecContext,
  observe: (world) => observeVerificationLinkage(world, "conformance/verifies-linkage"),
  expected: (point) =>
    expectedVerificationLinkage(point, "conformance/verifies-linkage", "warning"),
  assertions: (world) => {
    assertVerificationLinkage(world, unboundExampleContract);
  },
});

const unresolvedOracleTestAnchor = specTest({
  id: testAnchorId("test:protocol.verification-linkage.unresolved-oracle"),
  label: "the unresolved-oracle point verifies the oracle binding refusal",
  verifies: ref("spec:validation.verification-linkage.unresolved-oracle"),
});
void unresolvedOracleTestAnchor;
registerUnresolvedOracle({
  createWorld: createVerificationLinkageWorld,
  invoke: invokeSpecContext,
  observe: (world) => observeVerificationLinkage(world, "conformance/oracle-linkage"),
  expected: (point) => expectedVerificationLinkage(point, "conformance/oracle-linkage", "error"),
  assertions: (world) => {
    assertVerificationLinkage(world, unresolvedOracleContract);
  },
});

/* ----- spec:validation.oracle-target-eligibility ----- */

function createOracleTargetWorld(
  point: Partial<OracleTargetEligibilityConditions>,
): SpecContextWorld {
  const world: SpecContextWorld = { ...validatorWorld(), context: undefined };
  const { targetKind, ownsExampleSpace } = point;

  if (targetKind === undefined || ownsExampleSpace === undefined) {
    return world;
  }

  world.subjectId = "spec:probe.oracle-target";
  world.nodes.push(probeSpec(world.subjectId, { kind: targetKind }));
  world.nodes.push({
    id: "oracle:probe.oracle-target",
    nodeType: "Anchor",
    claim: "anchored",
    label: "probe expected outcome",
    file: "test/probe-oracle.test.ts",
    line: 5,
  });
  world.edges.push({
    from: "oracle:probe.oracle-target",
    type: "models",
    to: world.subjectId,
    claim: "anchored",
  });

  if (ownsExampleSpace) {
    reviseSubject(
      world,
      (node) => ({
        ...node,
        sections: {
          ...node.sections,
          behavior: {
            ...node.sections?.behavior,
            exampleSpace: { then: ["the probe resolves"] },
          },
        },
      }),
      "The target-kind step must run before example-space ownership is recorded.",
    );
  }

  return world;
}

function observeOracleTarget(world: SpecContextWorld): OracleTargetEligibilityOutcome {
  const context = world.context;

  if (context === undefined) {
    throw new Error("Oracle linkage must be resolved before the outcome is observed.");
  }

  return {
    kind: "oracle linkage reports {findingCount} findings and resolving presence {oraclePresent}",
    findingCount: context.findings.filter(
      (finding) => finding.validatorId === "conformance/oracle-linkage",
    ).length,
    oraclePresent: context.oracle !== undefined,
  };
}

function expectedOracleTarget(
  point: Partial<OracleTargetEligibilityConditions>,
): OracleTargetEligibilityOutcome {
  if (point.targetKind === undefined || point.ownsExampleSpace === undefined) {
    return unspecified;
  }

  return {
    kind: "oracle linkage reports {findingCount} findings and resolving presence {oraclePresent}",
    findingCount: point.ownsExampleSpace ? 0 : 1,
    oraclePresent: point.ownsExampleSpace,
  };
}

const ruleSpaceAcceptedTestAnchor = specTest({
  id: testAnchorId("test:protocol.oracle-target-eligibility.rule-space-accepted"),
  label: "the rule-space point verifies kind-neutral oracle resolution",
  verifies: ref("spec:validation.oracle-target-eligibility.rule-space-accepted"),
});
void ruleSpaceAcceptedTestAnchor;
registerRuleSpaceAccepted({
  createWorld: createOracleTargetWorld,
  invoke: invokeSpecContext,
  observe: observeOracleTarget,
  expected: expectedOracleTarget,
  assertions: (world) => {
    const context = world.context;

    if (context === undefined) {
      throw new Error("Oracle linkage must be resolved before the outcome is asserted.");
    }

    expect(
      context.findings
        .filter((finding) => finding.validatorId === "conformance/oracle-linkage")
        .every((finding) => finding.relatedId === world.subjectId),
    ).toBe(true);
  },
});

const missingSpaceRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.oracle-target-eligibility.missing-space-refused"),
  label: "the missing-space point verifies fail-closed oracle resolution",
  verifies: ref("spec:validation.oracle-target-eligibility.missing-space-refused"),
});
void missingSpaceRefusedTestAnchor;
registerMissingSpaceRefused({
  createWorld: createOracleTargetWorld,
  invoke: invokeSpecContext,
  observe: observeOracleTarget,
  expected: expectedOracleTarget,
  assertions: (world) => {
    const context = world.context;

    if (context === undefined) {
      throw new Error("Oracle linkage must be resolved before the outcome is asserted.");
    }

    expect(
      context.findings
        .filter((finding) => finding.validatorId === "conformance/oracle-linkage")
        .every((finding) => finding.relatedId === world.subjectId),
    ).toBe(true);
  },
});

/* ----- spec:validation.pack-coherence ----- */

function createPackCoherenceWorld(point: Partial<PackCoherenceConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { packId, specId, memberCount } = point;

  if (packId === undefined || specId === undefined || memberCount === undefined) {
    return world;
  }

  world.subjectId = packId;
  world.nodes.push(probeSpec(specId));
  world.nodes.push({
    id: packId,
    nodeType: "Pack",
    claim: "declared",
    title: "Probe aggregate",
    members: Array.from({ length: memberCount }, () => specId),
    file: "specs/probe.pack.sdp.ts",
  });

  // Membership is the manifest re-expressed as belongsTo edges, one per entry — a repeated
  // manifest entry is a repeated edge, which is what the coherence check counts.
  for (let entry = 0; entry < memberCount; entry += 1) {
    world.edges.push({
      from: specId,
      type: "belongsTo",
      to: packId,
      claim: "declared",
    });
  }

  const packIndex = world.nodes.findIndex((node) => node.id === packId);
  const packNode = world.nodes[packIndex];

  if (packNode?.nodeType !== "Pack") {
    throw new Error("The pack step must run before its modelRefs are named.");
  }

  world.nodes[packIndex] = { ...packNode, modelRefs: [specId] };
  return world;
}

function observePackCoherence(world: ValidatorWorld): PackCoherenceOutcome {
  return observeNamedFindingAt(world, "error");
}

function expectedPackCoherence(point: Partial<PackCoherenceConditions>): PackCoherenceOutcome {
  return expectedNamedFindingAt(
    point.packId !== undefined && point.specId !== undefined && point.memberCount !== undefined,
    "conformance/pack-coherence",
    "error",
  );
}

const incoherentAggregateTestAnchor = specTest({
  id: testAnchorId("test:protocol.pack-coherence.incoherent-aggregate"),
  label: "the incoherent-aggregate point verifies both halves of the pack law",
  verifies: ref("spec:validation.pack-coherence.incoherent-aggregate"),
});
void incoherentAggregateTestAnchor;
registerIncoherentAggregate({
  createWorld: createPackCoherenceWorld,
  invoke: invokeValidate,
  observe: observePackCoherence,
  expected: expectedPackCoherence,
  assertions: (world) => {
    const { findingCount } = paramsForStep(
      incoherentAggregateContract,
      "the report holds {findingCount} pack-coherence findings",
    );

    expect(findingsOf(world, "conformance/pack-coherence")).toHaveLength(findingCount);
  },
});

/* ----- spec:validation.two-check-families ----- */

/** The family a finding names, read from the finding itself rather than from its id spelling. */
function familyReports(
  world: ValidatorWorld,
  family: "conformance" | "honesty",
  params: { readonly findingId: string; readonly severity: "warning" | "error" },
): void {
  const findings = findingsOf(world, params.findingId);

  expect(findings.length).toBeGreaterThan(0);
  expect(findings.every((finding) => finding.family === family)).toBe(true);
  expect(findings.every((finding) => finding.severity === params.severity)).toBe(true);
}

function createTwoCheckWorld(point: Partial<TwoCheckFamiliesConditions>): ValidatorWorld {
  const world = validatorWorld();
  const { specId, readiness, targetId } = point;

  if (specId === undefined || readiness === undefined || targetId === undefined) {
    return world;
  }

  world.subjectId = specId;
  world.nodes.push(probeSpec(specId, { readiness }));
  world.edges.push({
    from: specId,
    type: "dependsOn",
    to: targetId,
    claim: "declared",
  });
  return world;
}

function observeSplitReport(world: ValidatorWorld): TwoCheckFamiliesOutcome {
  const report = reportOf(world);

  if (report.family !== undefined) {
    throw new Error("The aggregate report must not name a family of its own.");
  }

  return { kind: "the aggregate report states no family of its own" };
}

function expectedSplitReport(point: Partial<TwoCheckFamiliesConditions>): TwoCheckFamiliesOutcome {
  if (point.specId === undefined || point.readiness === undefined || point.targetId === undefined) {
    return unspecified;
  }

  return { kind: "the aggregate report states no family of its own" };
}

const splitReportTestAnchor = specTest({
  id: testAnchorId("test:protocol.two-check-families.split-report"),
  label: "the split-report point verifies both families in one aggregate report",
  verifies: ref("spec:validation.two-check-families.split-report"),
});
void splitReportTestAnchor;
registerSplitReport({
  createWorld: createTwoCheckWorld,
  invoke: invokeValidate,
  observe: observeSplitReport,
  expected: expectedSplitReport,
  assertions: (world) => {
    const { conformanceId, conformanceSeverity } = paramsForStep(
      splitReportContract,
      "the conformance family reports {conformanceId} at severity {conformanceSeverity}",
    );
    const { honestyId, honestySeverity } = paramsForStep(
      splitReportContract,
      "the honesty family reports {honestyId} at severity {honestySeverity}",
    );

    expect([...new Set(reportOf(world).findings.map((finding) => finding.family))].sort()).toEqual([
      "conformance",
      "honesty",
    ]);
    familyReports(world, "conformance", {
      findingId: conformanceId,
      severity: conformanceSeverity,
    });
    familyReports(world, "honesty", { findingId: honestyId, severity: honestySeverity });
  },
});

/* ----- spec:validation.superseded-decision-signal ----- */

type SupersededContract =
  | typeof replacedRulingWarnsContract
  | typeof chainEndNamedContract
  | typeof branchNamesEveryEndContract
  | typeof closedChainNamedContract
  | typeof dependencyUnreadContract
  | typeof supersededSubjectSilentContract
  | typeof replacementBelowReadyNamedContract
  | typeof liveReplacementWarnsContract
  | typeof endAndLoopNamedContract;

const supersededMessageDesign = extract({
  root: fileURLToPath(new URL("../specs/validation", import.meta.url)),
}).graph.nodes.find((node) => node.id === "spec:validation.superseded-decision-signal");
if (supersededMessageDesign?.nodeType !== "Primitive" || !supersededMessageDesign.sections?.design)
  throw new Error("The superseded-decision Spec must carry its message Design entries.");
const messageDesign = supersededMessageDesign.sections.design;

function createSupersededWorld(point: Partial<SupersededDecisionSignalConditions>): ValidatorWorld {
  const world = validatorWorld();
  const decision = (name: string, readiness: SpecReadiness = "ready"): void => {
    const id = `spec:probe.${name}`;
    const node = probeSpec(id, { kind: "decision", readiness });
    world.nodes.push({
      ...node,
      sections: { ...node.sections, decision: { decision: "Keep the probe ruling." } },
    });
    world.edges.push({ from: id, type: "dependsOn", to: "spec:probe.shaped", claim: "declared" });
  };
  world.nodes.push({
    ...probeSpec("spec:probe.shaped", { readiness: "defined" }),
    file: "shaped.sdp.md",
  });
  decision("decision-a");
  world.edges.push({
    from: "spec:probe.shaped",
    type: "dependsOn",
    to: "spec:probe.decision-a",
    claim: "declared",
  });
  const supersedes = (from: string, to: string): void => {
    world.edges.push({
      from: `spec:probe.${from}`,
      type: "supersedes",
      to: `spec:probe.${to}`,
      claim: "declared",
    });
  };
  if (point.replacement !== "no decision") {
    decision("decision-b", point.replacementRung);
    supersedes("decision-b", "decision-a");
  }
  switch (point.replacement) {
    case "a chain of two decisions":
      decision("decision-c", point.replacementRung);
      supersedes("decision-c", "decision-b");
      break;
    case "two decisions at once":
      decision("decision-c", point.replacementRung);
      supersedes("decision-c", "decision-a");
      break;
    case "a chain that closes on itself":
      supersedes("decision-a", "decision-b");
      break;
    case "an end and a loop at once":
      decision("decision-c", point.replacementRung);
      decision("decision-d", point.replacementRung);
      supersedes("decision-c", "decision-a");
      supersedes("decision-d", "decision-c");
      supersedes("decision-c", "decision-d");
      break;
  }
  world.subjectId =
    point.subject === "superseded decision"
      ? "spec:probe.decision-s"
      : point.subject === "replacing decision"
        ? "spec:probe.decision-b"
        : "spec:probe.shaped";
  if (point.subject === "superseded decision") {
    decision("decision-s");
    supersedes("decision-b", "decision-s");
  }
  world.edges.push({
    from: world.subjectId,
    type: point.relation ?? "decidedBy",
    to: "spec:probe.decision-a",
    claim: "declared",
  });
  return world;
}

function validateSuperseded(world: ValidatorWorld): void {
  world.report = validateGraph({
    schemaVersion,
    nodes: world.nodes,
    edges: world.edges,
    locations: [
      {
        spec: "spec:probe.shaped",
        file: "shaped.sdp.md",
        entry: "relation.decidedBy.spec:probe.decision-a",
        line: 7,
      },
    ],
  });
}

function supersededFindings(world: ValidatorWorld): readonly Finding[] {
  return findingsOf(world, "conformance/superseded-decisions");
}

function observeSuperseded(world: ValidatorWorld): SupersededDecisionSignalOutcome {
  return {
    kind: "the report holds {warnings} superseded-decision warnings",
    warnings: supersededFindings(world).length,
  };
}

const supersededDecisionOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.superseded-decision-signal"),
  models: ref("spec:validation.superseded-decision-signal"),
});
void supersededDecisionOracleAnchor;

function expectedSuperseded(
  point: Partial<SupersededDecisionSignalConditions>,
): SupersededDecisionSignalOutcome {
  if (Object.keys(point).length !== 4) return unspecified;
  return {
    kind: "the report holds {warnings} superseded-decision warnings",
    warnings:
      point.subject === "superseded decision" ||
      point.relation !== "decidedBy" ||
      point.replacement === "no decision"
        ? 0
        : 1,
  };
}

function assertSuperseded(
  world: ValidatorWorld,
  contract: SupersededContract,
  design: Readonly<Record<string, unknown>> = messageDesign,
): void {
  const warnings = supersededFindings(world);
  const warning = warnings[0];
  for (const step of contract.steps) {
    switch (step.text) {
      case "the warnings name {named}": {
        const ids = [
          ...new Set(
            warnings.flatMap((f) =>
              [...f.message.slice(f.message.indexOf(", ")).matchAll(/"(spec:[^"]+)"/g)]
                .map((m) => m[1])
                .filter((id): id is string => id !== undefined),
            ),
          ),
        ].sort();
        expect(ids.join(", ") || "nothing").toBe(step.params.named);
        break;
      }
      case "the warning is {validatorId} in the {family} family at severity {severity}":
        expect(warning).toMatchObject(step.params);
        break;
      case "the warning has the subject {subjectId} and the related Spec {relatedId}":
      case "the warning sits at {path} in {file} on line {line}":
        expect(warning).toMatchObject(step.params);
        break;
      case "the warning message follows {template}": {
        if (!warning) throw new Error("Expected the warning whose message is compared.");
        const entry = design[step.params.template];
        const template = typeof entry === "string" ? /^`([^`]+)`/u.exec(entry)?.[1] : undefined;
        if (template === undefined)
          throw new Error(`Missing message template ${step.params.template}`);
        let ids: readonly string[] | undefined;
        for (const candidate of contract.steps) {
          if (candidate.text === "the warnings name {named}") {
            ids = candidate.params.named.split(", ");
            break;
          }
        }
        if (ids === undefined) throw new Error("A message step needs the named decisions step.");
        const ends = ids.filter(
          (id) => !world.edges.some((edge) => edge.type === "supersedes" && edge.to === id),
        );
        const loops = ids.filter((id) => !ends.includes(id));
        const quoted = (values: readonly string[]): string =>
          values.map((id) => `"${id}"`).join(", ");
        const expected = template
          .replaceAll("<subjectId>", warning.subjectId ?? "")
          .replaceAll("<relatedId>", warning.relatedId ?? "")
          .replace(/"<end>"(?:, "<end>")*/gu, quoted(ends))
          .replace(/"<loop-id>"(?:, "<loop-id>")*/gu, quoted(loops));
        expect(warning.message).toBe(expected);
        break;
      }
      case "the report holds {errorCount} errors":
        holdsErrorCount(world, step.params);
        break;
    }
  }
}

const replacedRulingWarnsAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.replaced-ruling-warns"),
  verifies: ref("spec:validation.superseded-decision-signal.replaced-ruling-warns"),
});
void replacedRulingWarnsAnchor;
registerReplacedRulingWarns({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, replacedRulingWarnsContract);
  },
});

const chainEndNamedAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.chain-end-named"),
  verifies: ref("spec:validation.superseded-decision-signal.chain-end-named"),
});
void chainEndNamedAnchor;
registerChainEndNamed({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, chainEndNamedContract);
  },
});

const branchNamesEveryEndAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.branch-names-every-end"),
  verifies: ref("spec:validation.superseded-decision-signal.branch-names-every-end"),
});
void branchNamesEveryEndAnchor;
registerBranchNamesEveryEnd({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, branchNamesEveryEndContract);
  },
});

const closedChainNamedAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.closed-chain-named"),
  verifies: ref("spec:validation.superseded-decision-signal.closed-chain-named"),
});
void closedChainNamedAnchor;
registerClosedChainNamed({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, closedChainNamedContract);
  },
});

const dependencyUnreadAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.dependency-unread"),
  verifies: ref("spec:validation.superseded-decision-signal.dependency-unread"),
});
void dependencyUnreadAnchor;
registerDependencyUnread({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, dependencyUnreadContract);
  },
});

const supersededSubjectSilentAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.superseded-subject-silent"),
  verifies: ref("spec:validation.superseded-decision-signal.superseded-subject-silent"),
});
void supersededSubjectSilentAnchor;
registerSupersededSubjectSilent({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, supersededSubjectSilentContract);
  },
});

const replacementBelowReadyNamedAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.replacement-below-ready-named"),
  verifies: ref("spec:validation.superseded-decision-signal.replacement-below-ready-named"),
});
void replacementBelowReadyNamedAnchor;
registerReplacementBelowReadyNamed({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, replacementBelowReadyNamedContract);
  },
});

const liveReplacementWarnsAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.live-replacement-warns"),
  verifies: ref("spec:validation.superseded-decision-signal.live-replacement-warns"),
});
void liveReplacementWarnsAnchor;
registerLiveReplacementWarns({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, liveReplacementWarnsContract);
  },
});

const endAndLoopNamedAnchor = specTest({
  id: testAnchorId("test:protocol.superseded-decision-signal.end-and-loop-named"),
  verifies: ref("spec:validation.superseded-decision-signal.end-and-loop-named"),
});
void endAndLoopNamedAnchor;
registerEndAndLoopNamed({
  createWorld: createSupersededWorld,
  invoke: validateSuperseded,
  observe: observeSuperseded,
  expected: expectedSuperseded,
  assertions: (world) => {
    assertSuperseded(world, endAndLoopNamedContract);
  },
});

it("deduplicates stale pairs, names self loops and leaves absent locations absent", () => {
  const world = createSupersededWorld({
    subject: "live Spec",
    relation: "decidedBy",
    replacement: "one decision",
    replacementRung: "ready",
  });
  world.edges.push({
    from: "spec:probe.decision-b",
    type: "supersedes",
    to: "spec:probe.decision-b",
    claim: "declared",
  });
  world.edges.push({
    from: world.subjectId,
    type: "decidedBy",
    to: "spec:probe.decision-a",
    claim: "declared",
  });
  validate(world);
  expect(supersededFindings(world)).toHaveLength(1);
  expect(supersededFindings(world)[0]).toMatchObject({
    message:
      'Spec "spec:probe.shaped" is decided by "spec:probe.decision-a", whose chain of replacements closes on itself through "spec:probe.decision-b" (informative, never a gate).',
  });
  expect(supersededFindings(world)[0]).not.toHaveProperty("line");
});

it("warns once for each stale decision and ignores unresolved and wrongly typed replacements", () => {
  const world = createSupersededWorld({
    subject: "live Spec",
    relation: "decidedBy",
    replacement: "a chain of two decisions",
    replacementRung: "ready",
  });
  world.edges.push({
    from: world.subjectId,
    type: "decidedBy",
    to: "spec:probe.decision-b",
    claim: "declared",
  });
  validate(world);
  expect(supersededFindings(world).map((f) => f.relatedId)).toEqual([
    "spec:probe.decision-a",
    "spec:probe.decision-b",
  ]);
  world.edges.splice(0, world.edges.length, ...world.edges.filter((e) => e.type !== "supersedes"));
  world.edges.push({
    from: "spec:probe.absent",
    type: "supersedes",
    to: "spec:probe.decision-a",
    claim: "declared",
  });
  world.edges.push({
    from: world.subjectId,
    type: "supersedes",
    to: "spec:probe.decision-b",
    claim: "declared",
  });
  validate(world);
  expect(supersededFindings(world)).toEqual([]);
});

it("locates each subject separately when two Specs name the same stale decision", () => {
  const world = createSupersededWorld({
    subject: "live Spec",
    relation: "decidedBy",
    replacement: "one decision",
    replacementRung: "ready",
  });
  world.nodes.push({ ...probeSpec("spec:probe.second"), file: "second.sdp.md" });
  world.edges.push({
    from: "spec:probe.second",
    type: "decidedBy",
    to: "spec:probe.decision-a",
    claim: "declared",
  });
  world.report = validateGraph({
    schemaVersion,
    nodes: world.nodes,
    edges: world.edges,
    locations: [
      {
        spec: "spec:probe.shaped",
        file: "shaped.sdp.md",
        entry: "relation.decidedBy.spec:probe.decision-a",
        line: 7,
      },
      {
        spec: "spec:probe.second",
        file: "second.sdp.md",
        entry: "relation.decidedBy.spec:probe.decision-a",
        line: 19,
      },
    ],
  });
  expect(
    supersededFindings(world).map(({ subjectId, file, line }) => ({ subjectId, file, line })),
  ).toEqual([
    { subjectId: "spec:probe.second", file: "second.sdp.md", line: 19 },
    { subjectId: "spec:probe.shaped", file: "shaped.sdp.md", line: 7 },
  ]);
});

it("checks branch messages independently of the example id", () => {
  const world = createSupersededWorld({
    subject: "live Spec",
    relation: "decidedBy",
    replacement: "two decisions at once",
    replacementRung: "ready",
  });
  validateSuperseded(world);
  assertSuperseded(world, { ...branchNamesEveryEndContract, spec: "spec:probe.renamed-example" });
});

it.each([
  { contract: replacedRulingWarnsContract, replacement: "one decision", template: "message" },
  {
    contract: closedChainNamedContract,
    replacement: "a chain that closes on itself",
    template: "closedChainMessage",
  },
  {
    contract: endAndLoopNamedContract,
    replacement: "an end and a loop at once",
    template: "mixedChainMessage",
  },
] as const)(
  "checks the extracted $template Design entry",
  ({ contract, replacement, template }) => {
    const world = createSupersededWorld({
      subject: "live Spec",
      relation: "decidedBy",
      replacement,
      replacementRung: "ready",
    });
    validateSuperseded(world);
    const entry = messageDesign[template];
    if (typeof entry !== "string") throw new Error(`Missing Design entry ${template}`);
    expect(() => {
      assertSuperseded(world, contract, {
        ...messageDesign,
        [template]: entry.replace("informative", "changed template"),
      });
    }).toThrow();
  },
);

const kindEvidenceOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.kind-evidence"),
  models: ref("spec:validation.kind-evidence"),
});
void kindEvidenceOracleAnchor;
function expectedKindEvidence(point: Partial<KindEvidenceConditions>): KindEvidenceOutcome {
  return expectedNamedFinding(point, "honesty/readiness-floor", "error");
}

const secondEntryUntargetedAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.second-entry-untargeted"),
  verifies: ref("spec:validation.kind-evidence.second-entry-untargeted"),
});
void secondEntryUntargetedAnchor;
registerSecondEntryUntargeted({
  createWorld: createKindEvidenceWorld,
  invoke: invokeKindEvidenceValidate,
  observe: observeNamedFinding,
  expected: expectedKindEvidence,
  assertions: (world) => {
    const { clauseId } = paramsForStep(
      secondEntryUntargetedContract,
      "the finding names the unmet floor clause {clauseId}",
    );
    const { errorCount } = paramsForStep(
      secondEntryUntargetedContract,
      "the report holds {errorCount} errors",
    );
    assertKindEvidenceFloor(world, clauseId, errorCount);
  },
});

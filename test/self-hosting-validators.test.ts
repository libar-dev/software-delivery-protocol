import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { orphanSignalContract } from "../generated/contracts/validation.warn-level-signals.orphan-signal.contract.js";
import { readyGapSignalContract } from "../generated/contracts/validation.warn-level-signals.ready-gap-signal.contract.js";
import { sectionAuthoredFactContract } from "../generated/contracts/validation.authored-honesty.section-authored-fact.contract.js";
import { unearnedStatedFactContract } from "../generated/contracts/validation.authored-honesty.unearned-stated-fact.contract.js";
import { danglingTargetContract } from "../generated/contracts/validation.referential-integrity.dangling-target.contract.js";
import { didYouMeanContract } from "../generated/contracts/validation.referential-integrity.did-you-mean.contract.js";
import { blockingOpenQuestionContract } from "../generated/contracts/validation.readiness-floor.blocking-open-question.contract.js";
import { unrelatedScopedSpecContract } from "../generated/contracts/validation.readiness-floor.unrelated-scoped-spec.contract.js";
import { constraintsAloneContract } from "../generated/contracts/validation.kind-evidence.constraints-alone.contract.js";
import { emptyPromotedChildContract } from "../generated/contracts/validation.kind-evidence.empty-promoted-child.contract.js";
import { untargetedConstraintContract } from "../generated/contracts/validation.kind-evidence.untargeted-constraint.contract.js";
import { collapsedEdgeClaimContract } from "../generated/contracts/validation.claim-separation.collapsed-edge-claim.contract.js";
import { unratifiedDescriptorContract } from "../generated/contracts/validation.claim-separation.unratified-descriptor.contract.js";
import { incoherentAggregateContract } from "../generated/contracts/validation.pack-coherence.incoherent-aggregate.contract.js";
import { splitReportContract } from "../generated/contracts/validation.two-check-families.split-report.contract.js";
import { unboundExampleContract } from "../generated/contracts/validation.verification-linkage.unbound-example.contract.js";
import { unresolvedOracleContract } from "../generated/contracts/validation.verification-linkage.unresolved-oracle.contract.js";
import { computeDeliveryFacts, schemaVersion, validateGraph } from "../src/index.js";
import type {
  Finding,
  GraphClaim,
  GraphEdge,
  GraphNode,
  PrimitiveNode,
  SpecKind,
  SpecReadiness,
  ValidationReport,
} from "../src/index.js";

/**
 * The bound executable points of the validation family: each `bindExample` below runs one
 * authored example spec against a probe graph the Given steps assemble in memory. The graph is
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

/** The shared Then step of the family: the named check fires, and only at the stated severity. */
function namesFinding(
  world: ValidatorWorld,
  params: { readonly findingId: string; readonly severity: "warning" | "error" },
): void {
  const findings = findingsOf(world, params.findingId);

  expect(findings.length).toBeGreaterThan(0);
  expect(findings.every((finding) => finding.severity === params.severity)).toBe(true);
}

/**
 * A decision endpoint terminates the relation chain honestly: only the `ready` rung reads
 * dependsOn and refines targets, so a decidedBy edge satisfies the relation clause without adding
 * a second thing that could refuse below `ready`.
 */
function declareDecisionRelation(world: ValidatorWorld): void {
  const decisionId = `${world.subjectId}-decider`;

  world.nodes.push(probeSpec(decisionId, { kind: "decision" }));
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

/* ----- spec:validation.readiness-floor ----- */

const readinessFloorBindings = {
  "the graph holds a spec {specId} stating readiness {readiness}": (
    world: ValidatorWorld,
    params: { readonly specId: string; readonly readiness: "scoped" | "defined" },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(probeSpec(params.specId, { readiness: params.readiness }));
  },
  "the spec {defect}": (
    world: ValidatorWorld,
    params: { readonly defect: "declares no relation" | "records a blocking open question" },
  ) => {
    if (params.defect === "declares no relation") {
      return;
    }

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
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": namesFinding,
  "the finding names the unmet floor clause {clauseId}": namesUnmetClause,
  "the report holds {errorCount} errors": holdsErrorCount,
};

const unrelatedScopedSpecTestAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-floor.unrelated-scoped-spec"),
  label: "the unrelated-scoped point verifies the relation clause of the scoped rung",
  verifies: ref("spec:validation.readiness-floor.unrelated-scoped-spec"),
});
void unrelatedScopedSpecTestAnchor;

bindExample(unrelatedScopedSpecContract, validatorWorld, readinessFloorBindings);

const blockingOpenQuestionTestAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-floor.blocking-open-question"),
  label: "the blocked-question point verifies the open-questions clause of the defined rung",
  verifies: ref("spec:validation.readiness-floor.blocking-open-question"),
});
void blockingOpenQuestionTestAnchor;

bindExample(blockingOpenQuestionContract, validatorWorld, readinessFloorBindings);

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

const kindEvidenceBindings = {
  "the graph holds a {kind} spec {specId} stating readiness {readiness}": (
    world: ValidatorWorld,
    params: {
      readonly kind: "behavior" | "constraint";
      readonly specId: string;
      readonly readiness: "scoped" | "defined";
    },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(evidencelessProbe(params.specId, params.kind, params.readiness));
    // The relation clause is not the law under test, so the probe always declares one.
    declareDecisionRelation(world);
  },
  "its only evidence is {evidence}": (
    world: ValidatorWorld,
    params: {
      readonly evidence:
        | "a constraints entry carrying a target"
        | "a constraints entry with no target"
        | "an empty promoted rule child";
    },
  ) => {
    if (params.evidence === "an empty promoted rule child") {
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
            params.evidence === "a constraints entry carrying a target"
              ? { statement: "The probe answers within its budget.", target: "p95 < 200ms" }
              : { statement: "The probe answers quickly enough." },
          ],
        },
      }),
      "The spec step must run before its evidence is placed.",
    );
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": namesFinding,
  "the finding names the unmet floor clause {clauseId}": namesUnmetClause,
  "the report holds {errorCount} errors": holdsErrorCount,
};

const constraintsAloneTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.constraints-alone"),
  label: "the constraints-alone point verifies the behavior-family complete cell",
  verifies: ref("spec:validation.kind-evidence.constraints-alone"),
});
void constraintsAloneTestAnchor;

bindExample(constraintsAloneContract, validatorWorld, kindEvidenceBindings);

const untargetedConstraintTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.untargeted-constraint"),
  label: "the untargeted-constraint point verifies the constraint row's target requirement",
  verifies: ref("spec:validation.kind-evidence.untargeted-constraint"),
});
void untargetedConstraintTestAnchor;

bindExample(untargetedConstraintContract, validatorWorld, kindEvidenceBindings);

const emptyPromotedChildTestAnchor = specTest({
  id: testAnchorId("test:protocol.kind-evidence.empty-promoted-child"),
  label: "the empty-promotion point verifies the promoted-evidence honesty bound",
  verifies: ref("spec:validation.kind-evidence.empty-promoted-child"),
});
void emptyPromotedChildTestAnchor;

bindExample(emptyPromotedChildContract, validatorWorld, kindEvidenceBindings);

/* ----- spec:validation.warn-level-signals ----- */

const warnLevelSignalBindings = {
  "the graph holds a spec {specId} at readiness {readiness}": (
    world: ValidatorWorld,
    params: { readonly specId: string; readonly readiness: "idea" | "ready" },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(probeSpec(params.specId, { readiness: params.readiness }));
  },
  "the spec declares {relations}": (
    world: ValidatorWorld,
    params: { readonly relations: "no relation" | "a decidedBy decision" },
  ) => {
    if (params.relations === "no relation") {
      return;
    }

    // A decision endpoint terminates the chain honestly: the ready floor reads only dependsOn and
    // refines targets, so the probe's single warning stays the one under test.
    const decisionId = `${world.subjectId}-decider`;
    world.nodes.push(probeSpec(decisionId, { kind: "decision" }));
    world.edges.push({
      from: world.subjectId,
      type: "decidedBy",
      to: decisionId,
      claim: "declared",
    });
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": (
    world: ValidatorWorld,
    params: { readonly findingId: string; readonly severity: "warning" | "error" },
  ) => {
    namesFinding(world, params);
    expect(findingsOf(world, params.findingId).map((finding) => finding.subjectId)).toEqual([
      world.subjectId,
    ]);
  },
  "the report holds {errorCount} errors": (
    world: ValidatorWorld,
    params: { readonly errorCount: number },
  ) => {
    expect(reportOf(world).findings.filter((finding) => finding.severity === "error")).toHaveLength(
      params.errorCount,
    );
  },
};

const warnLevelOrphanTestAnchor = specTest({
  id: testAnchorId("test:protocol.warn-level-signals.orphan-signal"),
  label: "the orphan point verifies the disconnected-spec warning",
  verifies: ref("spec:validation.warn-level-signals.orphan-signal"),
});
void warnLevelOrphanTestAnchor;

bindExample(orphanSignalContract, validatorWorld, warnLevelSignalBindings);

const warnLevelGapTestAnchor = specTest({
  id: testAnchorId("test:protocol.warn-level-signals.ready-gap-signal"),
  label: "the gap point verifies the unverified-ready warning",
  verifies: ref("spec:validation.warn-level-signals.ready-gap-signal"),
});
void warnLevelGapTestAnchor;

bindExample(readyGapSignalContract, validatorWorld, warnLevelSignalBindings);

/* ----- spec:validation.referential-integrity ----- */

const referentialIntegrityBindings = {
  "the graph holds one spec {presentId}": (
    world: ValidatorWorld,
    params: { readonly presentId: string },
  ) => {
    world.subjectId = params.presentId;
    world.nodes.push(probeSpec(params.presentId));
  },
  "the spec declares a dependsOn relation to {targetId}": (
    world: ValidatorWorld,
    params: { readonly targetId: string },
  ) => {
    world.edges.push({
      from: world.subjectId,
      type: "dependsOn",
      to: params.targetId,
      claim: "declared",
    });
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": (
    world: ValidatorWorld,
    params: { readonly findingId: string; readonly severity: "warning" | "error" },
  ) => {
    namesFinding(world, params);
    expect(findingsOf(world, params.findingId).map((finding) => finding.subjectId)).toEqual([
      world.subjectId,
    ]);
  },
  "the finding offers the nearest-id suggestion: {suggested}": (
    world: ValidatorWorld,
    params: { readonly suggested: boolean },
  ) => {
    const message =
      findingsOf(world, "conformance/referential-integrity")[0]?.message ??
      "the referential-integrity finding is missing";

    if (params.suggested) {
      expect(message).toContain(`Did you mean "${world.subjectId}"?`);
      return;
    }

    expect(message).not.toContain("Did you mean");
  },
};

const danglingTargetTestAnchor = specTest({
  id: testAnchorId("test:protocol.referential-integrity.dangling-target"),
  label: "the dangling-target point verifies the unresolved-reference error",
  verifies: ref("spec:validation.referential-integrity.dangling-target"),
});
void danglingTargetTestAnchor;

bindExample(danglingTargetContract, validatorWorld, referentialIntegrityBindings);

const didYouMeanTestAnchor = specTest({
  id: testAnchorId("test:protocol.referential-integrity.did-you-mean"),
  label: "the near-miss point verifies the unique did-you-mean suggestion",
  verifies: ref("spec:validation.referential-integrity.did-you-mean"),
});
void didYouMeanTestAnchor;

bindExample(didYouMeanContract, validatorWorld, referentialIntegrityBindings);

/* ----- spec:validation.authored-honesty ----- */

const authoredHonestyBindings = {
  "the graph holds a spec {specId}": (
    world: ValidatorWorld,
    params: { readonly specId: string },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(probeSpec(params.specId));
  },
  "the spec hand-authors the delivery fact {factName} at {site}": (
    world: ValidatorWorld,
    params: {
      readonly factName: "implemented" | "has-verifier";
      readonly site: "a behavior section carrier" | "the node deliveryFacts array";
    },
  ) => {
    const node = world.nodes[world.nodes.length - 1];

    if (node?.nodeType !== "Primitive") {
      throw new Error("The spec step must run before the fact is smuggled onto it.");
    }

    // Typed sections are the authoring-time guardrail; the graph is a public seam, so both
    // smuggling routes are shaped here as the value data a foreign producer could hand over.
    const smuggled =
      params.site === "the node deliveryFacts array"
        ? { ...node, deliveryFacts: [params.factName] }
        : {
            ...node,
            sections: {
              ...node.sections,
              behavior: { ...node.sections?.behavior, [params.factName]: true },
            },
          };

    world.nodes[world.nodes.length - 1] = smuggled;
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": (
    world: ValidatorWorld,
    params: { readonly findingId: string; readonly severity: "warning" | "error" },
  ) => {
    namesFinding(world, params);
    expect(findingsOf(world, params.findingId).map((finding) => finding.subjectId)).toEqual([
      world.subjectId,
    ]);
  },
  "the finding names the fact {relatedId} and states {phrase}": (
    world: ValidatorWorld,
    params: { readonly relatedId: string; readonly phrase: string },
  ) => {
    const findings = reportOf(world).findings.filter(
      (finding) => finding.relatedId === params.relatedId && finding.subjectId === world.subjectId,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain(params.phrase);
  },
};

const sectionAuthoredFactTestAnchor = specTest({
  id: testAnchorId("test:protocol.authored-honesty.section-authored-fact"),
  label: "the section point verifies the authoring-shape refusal",
  verifies: ref("spec:validation.authored-honesty.section-authored-fact"),
});
void sectionAuthoredFactTestAnchor;

bindExample(sectionAuthoredFactContract, validatorWorld, authoredHonestyBindings);

const unearnedStatedFactTestAnchor = specTest({
  id: testAnchorId("test:protocol.authored-honesty.unearned-stated-fact"),
  label: "the stated-fact point verifies the delivery-fact refusal",
  verifies: ref("spec:validation.authored-honesty.unearned-stated-fact"),
});
void unearnedStatedFactTestAnchor;

bindExample(unearnedStatedFactContract, validatorWorld, authoredHonestyBindings);

/* ----- spec:validation.claim-separation ----- */

const claimSeparationBindings = {
  "the graph holds a spec {specId}": (
    world: ValidatorWorld,
    params: { readonly specId: string },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(probeSpec(params.specId));
  },
  "the graph carries an off-contract {element} spelled {value}": (
    world: ValidatorWorld,
    params: {
      readonly element: "edge claim" | "descriptor value";
      readonly value: string;
    },
  ) => {
    const node = world.nodes[world.nodes.length - 1];

    if (node?.nodeType !== "Primitive") {
      throw new Error("The spec step must run before the off-contract shape is placed.");
    }

    if (params.element === "descriptor value") {
      world.nodes[world.nodes.length - 1] = { ...node, specKind: params.value as SpecKind };
      return;
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
      to: world.subjectId,
      claim: params.value as GraphClaim,
    });
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": namesFinding,
  "the finding message states {phrase}": (
    world: ValidatorWorld,
    params: { readonly phrase: string },
  ) => {
    const messages = findingsOf(world, "conformance/claim-separation").map(
      (finding) => finding.message,
    );

    expect(messages.filter((message) => message.includes(params.phrase))).toHaveLength(1);
  },
  "the report holds {floorCount} readiness-floor findings": (
    world: ValidatorWorld,
    params: { readonly floorCount: number },
  ) => {
    expect(findingsOf(world, "honesty/readiness-floor")).toHaveLength(params.floorCount);
  },
};

const collapsedEdgeClaimTestAnchor = specTest({
  id: testAnchorId("test:protocol.claim-separation.collapsed-edge-claim"),
  label: "the collapsed-claim point verifies the binding-edge contract row",
  verifies: ref("spec:validation.claim-separation.collapsed-edge-claim"),
});
void collapsedEdgeClaimTestAnchor;

bindExample(collapsedEdgeClaimContract, validatorWorld, claimSeparationBindings);

const unratifiedDescriptorTestAnchor = specTest({
  id: testAnchorId("test:protocol.claim-separation.unratified-descriptor"),
  label: "the unratified-kind point verifies the fail-closed descriptor law",
  verifies: ref("spec:validation.claim-separation.unratified-descriptor"),
});
void unratifiedDescriptorTestAnchor;

bindExample(unratifiedDescriptorContract, validatorWorld, claimSeparationBindings);

/* ----- spec:validation.verification-linkage ----- */

const verificationLinkageBindings = {
  "the graph holds a parent spec {parentId}": (
    world: ValidatorWorld,
    params: { readonly parentId: string },
  ) => {
    world.subjectId = params.parentId;
    world.nodes.push(probeSpec(params.parentId));
  },
  "a non-resolving {verifierKind} named {verifierId} points at it": (
    world: ValidatorWorld,
    params: {
      readonly verifierKind: "example spec" | "oracle anchor";
      readonly verifierId: string;
    },
  ) => {
    if (params.verifierKind === "example spec") {
      world.nodes.push(probeSpec(params.verifierId, { kind: "example" }));
      world.edges.push({
        from: params.verifierId,
        type: "verifies",
        to: world.subjectId,
        claim: "declared",
      });
      return;
    }

    // The oracle anchor resolves as a node and rides its contract row; what it cannot resolve
    // through is the modelled spec's example space, which the parent probe never owns.
    world.nodes.push({
      id: params.verifierId,
      nodeType: "Anchor",
      claim: "anchored",
      file: "test/probe-oracle.test.ts",
      line: 5,
    });
    world.edges.push({
      from: params.verifierId,
      type: "models",
      to: world.subjectId,
      claim: "anchored",
    });
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": namesFinding,
  "the parent earns the delivery fact has-verifier: {conferred}": (
    world: ValidatorWorld,
    params: { readonly conferred: boolean },
  ) => {
    const derived = computeDeliveryFacts(world.nodes, world.edges).get(world.subjectId) ?? [];

    expect(derived.includes("has-verifier")).toBe(params.conferred);
  },
};

const unboundExampleTestAnchor = specTest({
  id: testAnchorId("test:protocol.verification-linkage.unbound-example"),
  label: "the unbound-example point verifies the incomplete spec-to-test trace",
  verifies: ref("spec:validation.verification-linkage.unbound-example"),
});
void unboundExampleTestAnchor;

bindExample(unboundExampleContract, validatorWorld, verificationLinkageBindings);

const unresolvedOracleTestAnchor = specTest({
  id: testAnchorId("test:protocol.verification-linkage.unresolved-oracle"),
  label: "the unresolved-oracle point verifies the oracle binding refusal",
  verifies: ref("spec:validation.verification-linkage.unresolved-oracle"),
});
void unresolvedOracleTestAnchor;

bindExample(unresolvedOracleContract, validatorWorld, verificationLinkageBindings);

/* ----- spec:validation.pack-coherence ----- */

const packCoherenceBindings = {
  "a pack {packId} lists the spec {specId} {memberCount} times": (
    world: ValidatorWorld,
    params: {
      readonly packId: string;
      readonly specId: string;
      readonly memberCount: number;
    },
  ) => {
    world.subjectId = params.packId;
    world.nodes.push(probeSpec(params.specId));
    world.nodes.push({
      id: params.packId,
      nodeType: "Pack",
      claim: "declared",
      title: "Probe aggregate",
      file: "specs/probe.pack.sdp.ts",
    });

    // Membership is the manifest re-expressed as belongsTo edges, one per entry — a repeated
    // manifest entry is a repeated edge, which is what the coherence check counts.
    for (let entry = 0; entry < params.memberCount; entry += 1) {
      world.edges.push({
        from: params.specId,
        type: "belongsTo",
        to: params.packId,
        claim: "declared",
      });
    }
  },
  "the pack also names that spec as a modelRef": (world: ValidatorWorld) => {
    const memberId = world.edges.find((edge) => edge.type === "belongsTo")?.from;
    const packIndex = world.nodes.findIndex((node) => node.id === world.subjectId);
    const packNode = world.nodes[packIndex];

    if (memberId === undefined || packNode?.nodeType !== "Pack") {
      throw new Error("The pack step must run before its modelRefs are named.");
    }

    world.nodes[packIndex] = { ...packNode, modelRefs: [memberId] };
  },
  "the graph is validated": validate,
  "the report names {findingId} at severity {severity}": namesFinding,
  "the report holds {findingCount} pack-coherence findings": (
    world: ValidatorWorld,
    params: { readonly findingCount: number },
  ) => {
    expect(findingsOf(world, "conformance/pack-coherence")).toHaveLength(params.findingCount);
  },
};

const incoherentAggregateTestAnchor = specTest({
  id: testAnchorId("test:protocol.pack-coherence.incoherent-aggregate"),
  label: "the incoherent-aggregate point verifies both halves of the pack law",
  verifies: ref("spec:validation.pack-coherence.incoherent-aggregate"),
});
void incoherentAggregateTestAnchor;

bindExample(incoherentAggregateContract, validatorWorld, packCoherenceBindings);

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

const twoCheckFamilyBindings = {
  "the graph holds a spec {specId} at readiness {readiness}": (
    world: ValidatorWorld,
    params: { readonly specId: string; readonly readiness: "idea" | "ready" },
  ) => {
    world.subjectId = params.specId;
    world.nodes.push(probeSpec(params.specId, { readiness: params.readiness }));
  },
  "the spec declares a dependsOn relation to the absent target {targetId}": (
    world: ValidatorWorld,
    params: { readonly targetId: string },
  ) => {
    world.edges.push({
      from: world.subjectId,
      type: "dependsOn",
      to: params.targetId,
      claim: "declared",
    });
  },
  "the graph is validated": validate,
  "the aggregate report states no family of its own": (world: ValidatorWorld) => {
    // The aggregate spans both families, so it never mislabels itself with a single one; each
    // finding names its own family, and only ever one of the two ratified ones.
    expect(reportOf(world).family).toBeUndefined();
    expect([...new Set(reportOf(world).findings.map((finding) => finding.family))].sort()).toEqual([
      "conformance",
      "honesty",
    ]);
  },
  "the conformance family reports {conformanceId} at severity {conformanceSeverity}": (
    world: ValidatorWorld,
    params: {
      readonly conformanceId: string;
      readonly conformanceSeverity: "warning" | "error";
    },
  ) => {
    familyReports(world, "conformance", {
      findingId: params.conformanceId,
      severity: params.conformanceSeverity,
    });
  },
  "the honesty family reports {honestyId} at severity {honestySeverity}": (
    world: ValidatorWorld,
    params: { readonly honestyId: string; readonly honestySeverity: "warning" | "error" },
  ) => {
    familyReports(world, "honesty", {
      findingId: params.honestyId,
      severity: params.honestySeverity,
    });
  },
};

const splitReportTestAnchor = specTest({
  id: testAnchorId("test:protocol.two-check-families.split-report"),
  label: "the split-report point verifies both families in one aggregate report",
  verifies: ref("spec:validation.two-check-families.split-report"),
});
void splitReportTestAnchor;

bindExample(splitReportContract, validatorWorld, twoCheckFamilyBindings);

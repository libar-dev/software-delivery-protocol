import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { orphanSignalContract } from "../generated/contracts/validation.warn-level-signals.orphan-signal.contract.js";
import { readyGapSignalContract } from "../generated/contracts/validation.warn-level-signals.ready-gap-signal.contract.js";
import { sectionAuthoredFactContract } from "../generated/contracts/validation.authored-honesty.section-authored-fact.contract.js";
import { unearnedStatedFactContract } from "../generated/contracts/validation.authored-honesty.unearned-stated-fact.contract.js";
import { danglingTargetContract } from "../generated/contracts/validation.referential-integrity.dangling-target.contract.js";
import { didYouMeanContract } from "../generated/contracts/validation.referential-integrity.did-you-mean.contract.js";
import { schemaVersion, validateGraph } from "../src/index.js";
import type {
  Finding,
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

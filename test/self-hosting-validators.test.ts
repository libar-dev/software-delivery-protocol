import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { orphanSignalContract } from "../generated/contracts/validation.warn-level-signals.orphan-signal.contract.js";
import { readyGapSignalContract } from "../generated/contracts/validation.warn-level-signals.ready-gap-signal.contract.js";
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
    const findings = findingsOf(world, params.findingId);

    expect(findings.map((finding) => finding.subjectId)).toEqual([world.subjectId]);
    expect(findings.every((finding) => finding.severity === params.severity)).toBe(true);
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

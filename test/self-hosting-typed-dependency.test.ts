import { expect } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  TypedDependencyFloorConditions,
  TypedDependencyFloorOutcome,
} from "../generated/contracts/validation.typed-dependency-floor.space.js";
import { createReader, schemaVersion } from "../src/index.js";
import type { GraphEdge, GraphNode, PrimitiveNode, SpecKind, SpecReadiness } from "../src/index.js";
import { registerRelationRungs } from "./validation.typed-dependency-floor.relation-rungs.test.generated.js";
import { registerMissingTargets } from "./validation.typed-dependency-floor.missing-targets.test.generated.js";
import { registerUnsettledFact } from "./validation.typed-dependency-floor.unsettled-fact.test.generated.js";
import { registerStatedReadiness } from "./validation.typed-dependency-floor.stated-readiness.test.generated.js";

const OUTCOME =
  "the matrix reports {targetFailures} target failures and {resolutionFailures} resolution failures and {questionFailures} blocking question failures";
const TARGET_CLAUSE = "typed-dependency-targets-are-defined";
const relations = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
] as const;
const dependencies = relations.slice(0, 4);
const rungs = ["idea", "scoped", "defined", "ready"] as const;
const kinds = [
  "behavior",
  "workflow",
  "example",
  "rule",
  "constraint",
  "model",
  "decision",
  "contract",
] as const;
const typedDependencyOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.typed-dependency-floor"),
  label: "expected readiness failures by typed dependency matrix",
  models: ref("spec:validation.typed-dependency-floor"),
});
void typedDependencyOracleAnchor;
function expectedFloor(
  point: Partial<TypedDependencyFloorConditions>,
): TypedDependencyFloorOutcome {
  switch (point.matrix) {
    case "relation-rungs":
      return { kind: OUTCOME, targetFailures: 24, resolutionFailures: 0, questionFailures: 0 };
    case "missing-targets":
      return { kind: OUTCOME, targetFailures: 0, resolutionFailures: 6, questionFailures: 0 };
    case "unsettled-fact":
      return { kind: OUTCOME, targetFailures: 1, resolutionFailures: 0, questionFailures: 1 };
    case "stated-readiness":
      return { kind: OUTCOME, targetFailures: 64, resolutionFailures: 0, questionFailures: 4 };
    default:
      return unspecified;
  }
}
interface Trace {
  subject: string;
  target: string;
  targetFails: boolean;
  missing: boolean;
  derivedTargetFails: boolean;
}
interface World {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traces: Trace[];
  questions: string[];
  reader?: ReturnType<typeof createReader>;
}
function primitive(
  id: string,
  kind: SpecKind,
  readiness: SpecReadiness,
  blocking = false,
): PrimitiveNode {
  const evidence = {
    behavior: { behavior: { rules: ["Probe behavior."] } },
    workflow: { behavior: { rules: ["Probe workflow."] } },
    example: {
      behavior: { examples: [{ given: ["a probe"], when: ["checked"], then: ["accepted"] }] },
    },
    rule: { behavior: { rules: ["Probe rule."] } },
    constraint: { constraints: [{ statement: "Probe bound.", target: "settled" }] },
    model: { model: { terms: { probe: "Probe term." } } },
    decision: { decision: { decision: "Choose the probe." } },
    contract: { behavior: { rules: ["Probe contract."] } },
  };
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: kind,
    altitude: "story",
    readiness,
    title: id,
    file: "specs/probe.sdp.md",
    sections: {
      intent: {
        outcome: "Probe the typed dependency bound.",
        ...(blocking
          ? { openQuestions: [{ question: "Is this fact settled?", blocking: true }] }
          : {}),
      },
      ...evidence[kind],
    },
  };
}
function addTrace(
  world: World,
  name: string,
  relation: (typeof relations)[number],
  rung: SpecReadiness,
  options: {
    missing?: boolean;
    blocking?: boolean;
    subjectRung?: SpecReadiness;
    kind?: SpecKind;
  } = {},
): void {
  const subject = `spec:probe.${name}`;
  const target = `${subject}.target`;
  const subjectRung = options.subjectRung ?? "ready";
  world.nodes.push(primitive(subject, options.kind ?? "rule", subjectRung));
  if (!options.missing) {
    world.nodes.push(
      primitive(
        target,
        relation === "constrainedBy"
          ? "constraint"
          : relation === "decidedBy" || relation === "supersedes"
            ? "decision"
            : "rule",
        rung,
        options.blocking,
      ),
    );
    // A lawful relation closes the target's scoped floor without making its own dependency fail.
    world.edges.push({ from: target, to: subject, type: "dependsOn", claim: "declared" });
  }
  world.edges.push({ from: subject, to: target, type: relation, claim: "declared" });
  world.traces.push({
    subject,
    target,
    missing: options.missing ?? false,
    derivedTargetFails:
      !options.missing && dependencies.includes(relation) && rungs.indexOf(rung) < 2,
    targetFails:
      !options.missing &&
      subjectRung === "ready" &&
      dependencies.includes(relation) &&
      rungs.indexOf(rung) < 2,
  });
  if (options.blocking && rungs.indexOf(rung) >= 2) world.questions.push(target);
}
function addMixedTrace(
  world: World,
  older: "refines" | "dependsOn",
  newer: "constrainedBy" | "decidedBy",
  olderFails: boolean,
  newerFirst: boolean,
): void {
  const name = `mixed-${older}-${newer}-${olderFails}-${newerFirst}`;
  const first = newerFirst ? newer : older;
  const second = newerFirst ? older : newer;
  const firstFails = newerFirst ? !olderFails : olderFails;
  addTrace(world, name, first, firstFails ? "scoped" : "defined");
  const trace = world.traces[world.traces.length - 1];
  if (trace === undefined) throw new Error("The mixed subject requires a trace.");
  const target = `${trace.subject}.second-target`;
  world.nodes.push(
    primitive(
      target,
      second === "constrainedBy" ? "constraint" : second === "decidedBy" ? "decision" : "rule",
      firstFails ? "defined" : "scoped",
    ),
  );
  world.edges.push(
    { from: target, to: trace.subject, type: "dependsOn", claim: "declared" },
    { from: trace.subject, to: target, type: second, claim: "declared" },
  );
  trace.targetFails = true;
  trace.derivedTargetFails = true;
}
function createWorld(point: Partial<TypedDependencyFloorConditions>): World {
  const world: World = { nodes: [], edges: [], traces: [], questions: [] };
  switch (point.matrix) {
    case "relation-rungs":
      for (const relation of relations)
        for (const rung of rungs) addTrace(world, `${relation}-${rung}`, relation, rung);
      for (const older of ["refines", "dependsOn"] as const)
        for (const newer of ["constrainedBy", "decidedBy"] as const)
          for (const olderFails of [false, true])
            for (const newerFirst of [false, true])
              addMixedTrace(world, older, newer, olderFails, newerFirst);
      break;
    case "missing-targets":
      for (const relation of relations)
        addTrace(world, `missing-${relation}`, relation, "defined", { missing: true });
      break;
    case "unsettled-fact":
      addTrace(world, "bounded-defined", "constrainedBy", "scoped", {
        blocking: true,
        subjectRung: "defined",
      });
      addTrace(world, "bounded-ready", "constrainedBy", "scoped", { blocking: true });
      // The question clause itself refuses a dishonest defined statement independently.
      addTrace(world, "fact-defined", "constrainedBy", "defined", {
        blocking: true,
        subjectRung: "defined",
      });
      break;
    case "stated-readiness":
      for (const relation of dependencies)
        addTrace(world, `stated-${relation}`, relation, "defined", { blocking: true });
      // Every Spec kind gets failing and passing targets, including excluded relations.
      for (const kind of kinds)
        for (const relation of relations)
          for (const rung of rungs)
            addTrace(world, `${kind}-${relation}-${rung}`, relation, rung, { kind });
      break;
    default:
      throw new Error(`Unknown matrix: ${String(point.matrix)}`);
  }
  return world;
}
function invoke(world: World): void {
  world.reader = createReader({ schemaVersion, nodes: world.nodes, edges: world.edges });
}
function observe(world: World): TypedDependencyFloorOutcome {
  if (world.reader === undefined) throw new Error("The matrix requires a reader.");
  const reader = world.reader;
  const floor = reader.findings().filter((f) => f.validatorId === "honesty/readiness-floor");
  const subjects = new Set(world.traces.map((t) => t.subject));
  for (const trace of world.traces) {
    const failures = floor.filter((f) => f.subjectId === trace.subject);
    expect(failures.map((f) => f.relatedId)).toEqual(
      trace.missing ? ["all-relations-resolve"] : trace.targetFails ? [TARGET_CLAUSE] : [],
    );
    for (const failure of failures)
      expect(failure).toMatchObject({ severity: "error", path: "readiness" });
    expect(reader.specContext(trace.subject)?.derivedReadiness).toBe(
      trace.missing || trace.derivedTargetFails ? "defined" : "ready",
    );
    const target = reader.specContext(trace.target);
    if (world.questions.includes(trace.target)) {
      expect(target?.derivedReadiness).toBe("scoped");
      expect(target?.statedReadiness).toBe("defined");
    } else if (target?.sections?.intent?.openQuestions !== undefined) {
      expect(target.derivedReadiness).toBe("scoped");
      expect(target.statedReadiness).toBe("scoped");
    }
  }
  expect(
    floor
      .filter((f) => f.relatedId === "no-blocking-open-questions")
      .map((f) => f.subjectId)
      .sort(),
  ).toEqual([...world.questions].sort());
  // No other floor clause may explain these outcomes.
  expect(
    floor.filter(
      (f) => !subjects.has(f.subjectId ?? "") && !world.questions.includes(f.subjectId ?? ""),
    ),
  ).toEqual([]);
  return {
    kind: OUTCOME,
    targetFailures: floor.filter(
      (f) => subjects.has(f.subjectId ?? "") && f.relatedId === TARGET_CLAUSE,
    ).length,
    resolutionFailures: floor.filter(
      (f) => subjects.has(f.subjectId ?? "") && f.relatedId === "all-relations-resolve",
    ).length,
    questionFailures: floor.filter((f) => f.relatedId === "no-blocking-open-questions").length,
  };
}
const adapters = { createWorld, invoke, observe, expected: expectedFloor };
const relationRungsTestAnchor = specTest({
  id: testAnchorId("test:protocol.typed-dependency-floor.relation-rungs"),
  label: "verifies six relations across four target rungs",
  verifies: ref("spec:validation.typed-dependency-floor.relation-rungs"),
});
void relationRungsTestAnchor;
registerRelationRungs(adapters);
const missingTargetsTestAnchor = specTest({
  id: testAnchorId("test:protocol.typed-dependency-floor.missing-targets"),
  label: "verifies unresolved targets fail resolution once",
  verifies: ref("spec:validation.typed-dependency-floor.missing-targets"),
});
void missingTargetsTestAnchor;
registerMissingTargets(adapters);
const unsettledFactTestAnchor = specTest({
  id: testAnchorId("test:protocol.typed-dependency-floor.unsettled-fact"),
  label: "verifies blocking questions and bounded readiness",
  verifies: ref("spec:validation.typed-dependency-floor.unsettled-fact"),
});
void unsettledFactTestAnchor;
registerUnsettledFact(adapters);
const statedReadinessTestAnchor = specTest({
  id: testAnchorId("test:protocol.typed-dependency-floor.stated-readiness"),
  label: "verifies stated target readiness and kind blindness",
  verifies: ref("spec:validation.typed-dependency-floor.stated-readiness"),
});
void statedReadinessTestAnchor;
registerStatedReadiness(adapters);

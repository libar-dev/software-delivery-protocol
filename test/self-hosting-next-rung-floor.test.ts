import { expect } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { blockingQuestionContract } from "../generated/contracts/validation.next-rung-floor.blocking-question.contract.js";
import { typedDependencyTargetsContract } from "../generated/contracts/validation.next-rung-floor.typed-dependency-targets.contract.js";
import type {
  NextRungFloorConditions,
  NextRungFloorOutcome,
} from "../generated/contracts/validation.next-rung-floor.space.js";
import { createReader, schemaVersion } from "../src/index.js";
import type {
  GraphEdge,
  PrimitiveNode,
  ReadinessFloorFailure,
  SpecContext,
  SpecReadiness,
} from "../src/index.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerBlockingQuestion } from "./validation.next-rung-floor.blocking-question.test.generated.js";
import { registerTypedDependencyTargets } from "./validation.next-rung-floor.typed-dependency-targets.test.generated.js";

const FLOOR_STEP = "the floor reached is {floorReached} and the next rung is {nextRung}";
const CLAUSE_STEP = "the next rung's first unmet clause is {clauseId}";
const TARGETS_STEP = "that failure names the targets {targets}";
const CURRENT_STEP = "the stated rung's floor failures number {currentFailures}";
const DEPENDS = "depends on a spec stating scoped";
const BLOCKING = "records a blocking open question";
const BASIS_ID = "spec:probe.basis";
const GROUND_ID = "spec:probe.ground";
const PARENT_ID = "spec:probe.parent";

/** Every Then value of one point, written the way the example Specs write them. */
interface NextRungAnswer {
  readonly floorReached: "scoped" | "defined";
  readonly nextRung: "defined" | "ready";
  readonly clauseId: string;
  readonly targets: string;
  readonly currentFailures: number;
}

const nextRungOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.next-rung-floor"),
  label: "expected next-rung clause and targets by structure",
  models: ref("spec:validation.next-rung-floor"),
});
void nextRungOracleAnchor;

/**
 * Authored from the Spec's rules, independently of the evaluator. A Spec resting on a `scoped`
 * dependency clears its own floor through `defined` and fails `ready` on that dependency alone.
 * A Spec with a blocking question clears `scoped` and fails `defined` on the question, which names
 * no target; it states `scoped` honestly and `defined` with that one failure.
 */
function answerFor(point: Partial<NextRungFloorConditions>): NextRungAnswer | undefined {
  if (point.specId === undefined || point.statedReadiness === undefined) return undefined;
  switch (point.structure) {
    case DEPENDS:
      return {
        floorReached: "defined",
        nextRung: "ready",
        clauseId: "typed-dependency-targets-are-defined",
        targets: `dependsOn ${BASIS_ID} (scoped)`,
        currentFailures: 0,
      };
    case BLOCKING:
      return {
        floorReached: "scoped",
        nextRung: "defined",
        clauseId: "no-blocking-open-questions",
        targets: "",
        currentFailures: point.statedReadiness === "defined" ? 1 : 0,
      };
    default:
      return undefined;
  }
}

function expectedNextRung(point: Partial<NextRungFloorConditions>): NextRungFloorOutcome {
  const answer = answerFor(point);
  return answer === undefined ? unspecified : { kind: CLAUSE_STEP, clauseId: answer.clauseId };
}

interface World {
  readonly point: Partial<NextRungFloorConditions>;
  readonly subjectId: string;
  readonly nodes: PrimitiveNode[];
  readonly edges: GraphEdge[];
  context?: SpecContext;
}

/** A story-altitude rule Spec with an Intent outcome and one rule, as both examples state. */
function ruleSpec(id: string, readiness: SpecReadiness, blocking = false): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "rule",
    altitude: "story",
    readiness,
    title: id,
    file: "specs/probe.sdp.md",
    sections: {
      intent: {
        outcome: "Probe the next rung.",
        ...(blocking
          ? { openQuestions: [{ question: "Is the probe settled?", blocking: true }] }
          : {}),
      },
      behavior: { rules: ["The probe states one rule."] },
    },
  };
}

function declared(from: string, type: GraphEdge["type"], to: string): GraphEdge {
  return { from, to, type, claim: "declared" };
}

function createWorld(point: Partial<NextRungFloorConditions>): World {
  const subjectId = point.specId ?? "";
  const stated = point.statedReadiness ?? "idea";
  switch (point.structure) {
    case DEPENDS:
      return {
        point,
        subjectId,
        nodes: [
          ruleSpec(subjectId, stated),
          ruleSpec(BASIS_ID, "scoped"),
          ruleSpec(GROUND_ID, "idea"),
        ],
        edges: [
          declared(subjectId, "dependsOn", BASIS_ID),
          declared(BASIS_ID, "refines", GROUND_ID),
        ],
      };
    case BLOCKING:
      return {
        point,
        subjectId,
        nodes: [ruleSpec(subjectId, stated, true), ruleSpec(PARENT_ID, "ready")],
        edges: [declared(subjectId, "refines", PARENT_ID)],
      };
    default:
      throw new Error(`Unknown structure: ${String(point.structure)}`);
  }
}

function invoke(world: World): void {
  world.context = createReader({
    schemaVersion,
    nodes: world.nodes,
    edges: world.edges,
  }).specContext(world.subjectId);
}

function contextOf(world: World): SpecContext {
  if (world.context === undefined) throw new Error("The reader must build the spec's context.");
  return world.context;
}

/** A target is its relation type, its id and its stated rung in parentheses, joined by `, `. */
function writeTargets(failure: ReadinessFloorFailure | undefined): string {
  return (failure?.targets ?? [])
    .map((target) => `${target.type} ${target.id} (${target.statedReadiness ?? "not a Spec"})`)
    .join(", ");
}

function observedAnswer(world: World): NextRungAnswer {
  const context = contextOf(world);
  const rungs = ["idea", "scoped", "defined", "ready"] as const;
  const floorReached = context.derivedReadiness;
  const nextRung = rungs[floorReached === undefined ? 0 : rungs.indexOf(floorReached) + 1];
  if (floorReached !== "scoped" && floorReached !== "defined") {
    throw new Error(`The probe derived an unexpected floor: ${String(floorReached)}`);
  }
  if (nextRung !== "defined" && nextRung !== "ready") {
    throw new Error(`The probe has an unexpected next rung: ${String(nextRung)}`);
  }
  const first = context.nextRungFailures[0];
  return {
    floorReached,
    nextRung,
    clauseId: first?.clauseId ?? "",
    targets: writeTargets(first),
    currentFailures: context.floorFailures.length,
  };
}

function observe(world: World): NextRungFloorOutcome {
  return { kind: CLAUSE_STEP, clauseId: observedAnswer(world).clauseId };
}

type NextRungContract = typeof typedDependencyTargetsContract | typeof blockingQuestionContract;

/** The Then values the example Spec states, read from its generated contract. */
function statedAnswer(contract: NextRungContract): NextRungAnswer {
  const floor = paramsForStep(contract, FLOOR_STEP);
  return {
    floorReached: floor.floorReached,
    nextRung: floor.nextRung,
    clauseId: paramsForStep(contract, CLAUSE_STEP).clauseId,
    targets: paramsForStep(contract, TARGETS_STEP).targets,
    currentFailures: paramsForStep(contract, CURRENT_STEP).currentFailures,
  };
}

/**
 * The comparator checks the clause step; these assertions check every other Then the same two
 * ways: the Spec's value against the oracle, and the observed value against the oracle.
 */
function assertionsFor(contract: NextRungContract): (world: World) => void {
  return (world) => {
    const answer = answerFor(world.point);
    expect(statedAnswer(contract)).toEqual(answer);
    expect(observedAnswer(world)).toEqual(answer);
    const context = contextOf(world);
    // Only the typed-dependency clause carries targets, and the next rung's failures are exactly
    // the next rung's own clauses: no lower-rung clause reappears in them.
    for (const failure of context.nextRungFailures) {
      expect(Object.hasOwn(failure, "targets")).toBe(
        failure.clauseId === "typed-dependency-targets-are-defined",
      );
    }
    expect(context.nextRungFailures.map((failure) => failure.clauseId)).toEqual([answer?.clauseId]);
  };
}

const typedDependencyTargetsTestAnchor = specTest({
  id: testAnchorId("test:protocol.next-rung-floor.typed-dependency-targets"),
  label: "verifies the next rung's failure names the dependency stated below defined",
  verifies: ref("spec:validation.next-rung-floor.typed-dependency-targets"),
});
void typedDependencyTargetsTestAnchor;
registerTypedDependencyTargets({
  createWorld,
  invoke,
  observe,
  expected: expectedNextRung,
  assertions: assertionsFor(typedDependencyTargetsContract),
});

const blockingQuestionTestAnchor = specTest({
  id: testAnchorId("test:protocol.next-rung-floor.blocking-question"),
  label: "verifies the next rung's failure names a blocking question and no target",
  verifies: ref("spec:validation.next-rung-floor.blocking-question"),
});
void blockingQuestionTestAnchor;
registerBlockingQuestion({
  createWorld,
  invoke,
  observe,
  expected: expectedNextRung,
  assertions: assertionsFor(blockingQuestionContract),
});

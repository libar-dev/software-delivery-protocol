import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  codeAnchor,
  codeAnchorId,
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  ReadinessPlannerConditions,
  ReadinessPlannerOutcome,
} from "../generated/contracts/consumers.readiness-planner.space.js";
import { dependencyOrderContract } from "../generated/contracts/consumers.readiness-planner.dependency-order.contract.js";
import { decisionFirstContract } from "../generated/contracts/consumers.readiness-planner.decision-first.contract.js";
import { cycleSharesARoundContract } from "../generated/contracts/consumers.readiness-planner.cycle-shares-a-round.contract.js";
import { ownerQuestionHoldsContract } from "../generated/contracts/consumers.readiness-planner.owner-question-holds.contract.js";
import { schemaVersion } from "../src/index.js";
import type { GraphEdge, GraphSchema, PrimitiveNode, IntentOpenQuestion } from "../src/index.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { catalogRecipe, shippedRecipe } from "./helpers/recipe-probe.js";
import { registerDependencyOrder } from "./consumers.readiness-planner.dependency-order.test.generated.js";
import { registerDecisionFirst } from "./consumers.readiness-planner.decision-first.test.generated.js";
import { registerCycleSharesARound } from "./consumers.readiness-planner.cycle-shares-a-round.test.generated.js";
import { registerOwnerQuestionHolds } from "./consumers.readiness-planner.owner-question-holds.test.generated.js";

const QUEUE = "the queue lists {queue} in that order";
const FIRST = "round 1 holds {firstRound}";
const CYCLES = "the queue reports {cycles} cycles";
const HELD = "the owner's questions hold {held}";
interface Queue {
  decider: string;
  totals: {
    waiting: number;
    firstRound: number;
    rounds: number;
    cycles: number;
    questions: number;
    blockingQuestions: number;
    withoutDecider: number;
    blockingWithoutDecider: number;
  };
  statements: {
    place: number;
    round: number;
    id: string;
    title: string;
    specKind: string;
    packs: string[];
    statedReadiness: string;
    floorReached: string;
    restsOn: string[];
  }[];
  cycles: { members: string[]; cycle: string[] }[];
  questions: {
    address: string | null;
    spec: string;
    index: number;
    question: string;
    blocking: boolean;
    decider: string;
    holds: string[];
  }[];
}
interface World {
  point: Partial<ReadinessPlannerConditions>;
  answer?: Queue;
}
const plannerDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.statement-queue-recipe"),
  label: "realizes the statement queue in the shipped recipe catalog",
  satisfies: ref("spec:consumers.readiness-planner"),
  role: "projection",
});
void plannerDocumentAnchor;
const plannerOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.readiness-planner"),
  models: ref("spec:consumers.readiness-planner"),
});
void plannerOracleAnchor;
function answerFor(point: Partial<ReadinessPlannerConditions>) {
  switch (point.corpus) {
    case "one waiting Spec depends on another":
      return {
        queue: "spec:probe.base, spec:probe.dependent",
        firstRound: "spec:probe.base",
        cycles: 0,
        held: "",
      };
    case "a waiting Spec names a waiting decision that refines it":
      return {
        queue: "spec:probe.decision, spec:probe.shaped",
        firstRound: "spec:probe.decision",
        cycles: 0,
        held: "",
      };
    case "two waiting Specs depend on each other":
      return {
        queue: "spec:probe.a, spec:probe.b",
        firstRound: "spec:probe.a, spec:probe.b",
        cycles: 1,
        held: "",
      };
    case "a Spec carries a blocking question its owner decides and another Spec depends on it":
      return {
        queue: "",
        firstRound: "",
        cycles: 0,
        held: "spec:probe.subject, spec:probe.dependent",
      };
    default:
      return undefined;
  }
}
function expected(point: Partial<ReadinessPlannerConditions>): ReadinessPlannerOutcome {
  const answer = answerFor(point);
  return answer === undefined ? unspecified : { kind: QUEUE, queue: answer.queue };
}
function document(
  id: string,
  relations: string,
  readiness = "defined",
  question = "",
  decision = false,
) {
  return `---\nid: spec:probe.${id}\nkind: ${decision ? "decision" : "behavior"}\naltitude: story\nreadiness: ${readiness}\nrelations:\n${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Order the waiting statements.\n${question}\n${decision ? "## Decision\n- context: A probe choice.\n- decision: Choose the probe." : "## Behavior\n- rule: The probe has one rule."}\n`;
}
async function invoke(world: World) {
  const root = mkdtempSync(join(tmpdir(), "sdp-statement-queue-"));
  try {
    let docs: string[];
    switch (world.point.corpus) {
      case "one waiting Spec depends on another":
        docs = [
          document("base", "  decidedBy: spec:probe.decision"),
          document("dependent", "  dependsOn: spec:probe.base"),
          document("decision", "  refines: spec:probe.base", "ready", "", true),
        ];
        break;
      case "a waiting Spec names a waiting decision that refines it":
        docs = [
          document("shaped", "  decidedBy: spec:probe.decision"),
          document("decision", "  refines: spec:probe.shaped", "defined", "", true),
        ];
        break;
      case "two waiting Specs depend on each other":
        docs = [
          document("a", "  dependsOn: spec:probe.b"),
          document("b", "  dependsOn: spec:probe.a"),
        ];
        break;
      case "a Spec carries a blocking question its owner decides and another Spec depends on it":
        docs = [
          document(
            "subject",
            "  refines: spec:probe.dependent",
            "scoped",
            "\n### Open questions\n- [blocking #choice] Which choice holds?\n  - decider: owner\n",
          ),
          document("dependent", "  dependsOn: spec:probe.subject"),
        ];
        break;
      default:
        throw new Error("The probe needs its corpus dimension.");
    }
    for (const [index, text] of docs.entries())
      writeFileSync(join(root, `${String(index)}.sdp.md`), text);
    world.answer = await shippedRecipe<Queue>("46-the-statement-queue.js", root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function observed(world: World) {
  if (world.answer === undefined) throw new Error("Run the queue first.");
  return {
    queue: world.answer.statements.map((row) => row.id).join(", "),
    firstRound: world.answer.statements
      .filter((row) => row.round === 1)
      .map((row) => row.id)
      .join(", "),
    cycles: world.answer.cycles.length,
    held: world.answer.questions.flatMap((row) => row.holds).join(", "),
  };
}
function observe(world: World): ReadinessPlannerOutcome {
  return { kind: QUEUE, queue: observed(world).queue };
}
function assertions(world: World) {
  expect(observed(world)).toEqual(answerFor(world.point));
  for (const [index, row] of (world.answer?.statements ?? []).entries())
    expect(row.place).toBe(index + 1);
}
const adapters = {
  createWorld: (point: Partial<ReadinessPlannerConditions>): World => ({ point }),
  invoke,
  observe,
  expected,
};
const dependencyOrderAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-planner.dependency-order"),
  verifies: ref("spec:consumers.readiness-planner.dependency-order"),
});
void dependencyOrderAnchor;
registerDependencyOrder({
  ...adapters,
  assertions(world) {
    assertions(world);
    expect(observed(world)).toMatchObject({
      ...paramsForStep(dependencyOrderContract, QUEUE),
      ...paramsForStep(dependencyOrderContract, FIRST),
      ...paramsForStep(dependencyOrderContract, CYCLES),
    });
  },
});
const decisionFirstAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-planner.decision-first"),
  verifies: ref("spec:consumers.readiness-planner.decision-first"),
});
void decisionFirstAnchor;
registerDecisionFirst({
  ...adapters,
  assertions(world) {
    assertions(world);
    expect(observed(world)).toMatchObject({
      ...paramsForStep(decisionFirstContract, QUEUE),
      ...paramsForStep(decisionFirstContract, FIRST),
      ...paramsForStep(decisionFirstContract, CYCLES),
    });
  },
});
const cycleSharesARoundAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-planner.cycle-shares-a-round"),
  verifies: ref("spec:consumers.readiness-planner.cycle-shares-a-round"),
});
void cycleSharesARoundAnchor;
registerCycleSharesARound({
  ...adapters,
  assertions(world) {
    assertions(world);
    expect(observed(world)).toMatchObject({
      ...paramsForStep(cycleSharesARoundContract, QUEUE),
      ...paramsForStep(cycleSharesARoundContract, FIRST),
      ...paramsForStep(cycleSharesARoundContract, CYCLES),
    });
  },
});
const ownerQuestionHoldsAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-planner.owner-question-holds"),
  verifies: ref("spec:consumers.readiness-planner.owner-question-holds"),
});
void ownerQuestionHoldsAnchor;
registerOwnerQuestionHolds({
  ...adapters,
  assertions(world) {
    assertions(world);
    expect(observed(world)).toMatchObject({
      ...paramsForStep(ownerQuestionHoldsContract, QUEUE),
      ...paramsForStep(ownerQuestionHoldsContract, HELD),
    });
  },
});

function spec(
  id: string,
  readiness: PrimitiveNode["readiness"] = "defined",
  questions: IntentOpenQuestion[] = [],
): PrimitiveNode {
  return {
    id: `spec:probe.${id}`,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "story",
    readiness,
    title: id,
    file: "probe.sdp.md",
    sections: {
      intent: { outcome: "Probe", openQuestions: questions },
      behavior: { rules: ["The probe has one rule."] },
    },
  };
}
function edge(from: string, type: GraphEdge["type"], to: string): GraphEdge {
  return { from: `spec:probe.${from}`, type, to: `spec:probe.${to}`, claim: "declared" };
}
function graph(nodes: GraphSchema["nodes"], edges: GraphEdge[] = []): GraphSchema {
  return { schemaVersion, nodes, edges };
}

describe("statement queue details", () => {
  it.each([null, false, 1, "", "Owner", "two words", "with_underscore"])(
    "diagnoses invalid decider %j",
    async (decider) => {
      expect(await catalogRecipe(46, graph([]), { decider })).toEqual({
        diagnostics: [{ parameter: "decider", problem: "Expected a lowercase token." }],
      });
    },
  );
  it("orders SCCs by longest dependency chain, ignores non-ordering and self edges, and sorts ids by code unit", async () => {
    const input = graph(
      [
        spec("a"),
        spec("Z"),
        spec("b"),
        spec("c"),
        spec("d"),
        {
          ...spec("e"),
          specKind: "decision",
          title: "A waiting decision",
          sections: {
            intent: { outcome: "Choose the probe." },
            decision: { context: "A probe choice.", decision: "Choose the probe." },
          },
        },
        ...["pack:probe.a", "pack:probe.Z"].map((id) => ({
          id,
          nodeType: "Pack" as const,
          claim: "declared" as const,
          members: ["spec:probe.a", "spec:probe.e"],
          file: "probe.pack.sdp.md",
        })),
      ],
      [
        edge("a", "dependsOn", "Z"),
        edge("b", "dependsOn", "a"),
        edge("a", "constrainedBy", "b"),
        edge("c", "decidedBy", "b"),
        edge("d", "dependsOn", "c"),
        edge("d", "dependsOn", "Z"),
        edge("e", "verifies", "d"),
        edge("Z", "dependsOn", "Z"),
        ...["pack:probe.a", "pack:probe.Z"].flatMap((to) =>
          ["spec:probe.a", "spec:probe.e"].map((from) => ({
            from,
            type: "belongsTo" as const,
            to,
            claim: "declared" as const,
          })),
        ),
      ],
    );
    const before = JSON.stringify(input);
    const result = await catalogRecipe<Queue>(46, input);
    expect(result.statements.map((row) => [row.id, row.round])).toEqual([
      ["spec:probe.Z", 1],
      ["spec:probe.e", 1],
      ["spec:probe.a", 2],
      ["spec:probe.b", 2],
      ["spec:probe.c", 3],
      ["spec:probe.d", 4],
    ]);
    expect(result.statements[1]).toEqual({
      place: 2,
      round: 1,
      id: "spec:probe.e",
      title: "A waiting decision",
      specKind: "decision",
      packs: ["pack:probe.Z", "pack:probe.a"],
      statedReadiness: "defined",
      floorReached: "ready",
      restsOn: [],
    });
    expect(result.statements.find((row) => row.id === "spec:probe.a")?.restsOn).toEqual([
      "spec:probe.Z",
      "spec:probe.b",
    ]);
    expect(result.cycles).toEqual([
      {
        members: ["spec:probe.a", "spec:probe.b"],
        cycle: ["spec:probe.a", "spec:probe.b", "spec:probe.a"],
      },
    ]);
    expect(JSON.stringify(input)).toBe(before);
    expect(
      await catalogRecipe(46, {
        ...input,
        nodes: [...input.nodes].reverse(),
        edges: [...input.edges].reverse(),
      }),
    ).toEqual(result);
  });
  it.each(["dependsOn", "constrainedBy", "decidedBy"] as const)(
    "yields refines to the reverse %s relation",
    async (type) => {
      const result = await catalogRecipe<Queue>(
        46,
        graph(
          [spec("parent"), spec("part")],
          [edge("part", "refines", "parent"), edge("parent", type, "part")],
        ),
      );
      expect(result.statements.map((row) => [row.id, row.restsOn])).toEqual([
        ["spec:probe.part", []],
        ["spec:probe.parent", ["spec:probe.part"]],
      ]);
      expect(result.cycles).toEqual([]);
    },
  );
  it("chooses a shortest cycle path before breaking ties by target id", async () => {
    const input = graph(
      [spec("a"), spec("b"), spec("c"), spec("d")],
      [
        edge("a", "dependsOn", "b"),
        edge("a", "dependsOn", "c"),
        edge("b", "dependsOn", "d"),
        edge("d", "dependsOn", "a"),
        edge("c", "dependsOn", "a"),
      ],
    );
    expect((await catalogRecipe<Queue>(46, input)).cycles).toEqual([
      {
        members: ["spec:probe.a", "spec:probe.b", "spec:probe.c", "spec:probe.d"],
        cycle: ["spec:probe.a", "spec:probe.c", "spec:probe.a"],
      },
    ]);
    const tied = { ...input, edges: [...input.edges, edge("b", "dependsOn", "a")] };
    expect((await catalogRecipe<Queue>(46, tied)).cycles[0]?.cycle).toEqual([
      "spec:probe.a",
      "spec:probe.b",
      "spec:probe.a",
    ]);
  });
  it("selects every higher floor, ignores lower or equal floors, and orders only direct waiting links", async () => {
    const input = graph(
      [
        spec("a", "scoped"),
        spec("b", "defined"),
        spec("base", "idea"),
        spec("ready", "ready"),
        spec("lower", "defined", [{ question: "Blocked", blocking: true }]),
      ],
      [
        edge("a", "dependsOn", "base"),
        edge("b", "dependsOn", "a"),
        edge("base", "dependsOn", "ready"),
        edge("lower", "dependsOn", "b"),
      ],
    );
    const result = await catalogRecipe<Queue>(46, input);
    expect(result.statements.map((row) => [row.id, row.floorReached, row.restsOn])).toEqual([
      ["spec:probe.base", "ready", []],
      ["spec:probe.a", "defined", ["spec:probe.base"]],
    ]);
    expect(result.totals).toMatchObject({ waiting: 2, firstRound: 1, rounds: 2 });
    const empty = await catalogRecipe<Queue>(46, graph([]));
    expect(empty.totals).toEqual({
      waiting: 0,
      firstRound: 0,
      rounds: 0,
      cycles: 0,
      questions: 0,
      blockingQuestions: 0,
      withoutDecider: 0,
      blockingWithoutDecider: 0,
    });
  });
  it("selects questions, counts undecided ones, and holds direct typed dependents by stated rung", async () => {
    const input = graph(
      [
        spec("subject", "scoped", [
          { key: "big", question: "A choice", blocking: true, decider: "owner" },
          { question: "Unassigned", blocking: true },
          { question: "Later", blocking: false },
        ]),
        spec("dependent"),
        spec("transitive"),
        spec("other", "scoped", [
          { question: "Small", blocking: true, decider: "owner" },
          { question: "A note", blocking: false, decider: "owner" },
          { key: "delegate", question: "Delegated", blocking: false, decider: "team-lead" },
        ]),
        spec("settled", "defined", [
          { question: "Blocking but already defined", blocking: true, decider: "owner" },
        ]),
      ],
      [
        edge("dependent", "dependsOn", "subject"),
        edge("dependent", "dependsOn", "settled"),
        edge("subject", "refines", "dependent"),
        edge("transitive", "dependsOn", "dependent"),
        edge("other", "refines", "dependent"),
        edge("settled", "refines", "dependent"),
      ],
    );
    const result = await catalogRecipe<Queue>(46, input);
    expect(result.totals).toMatchObject({
      questions: 4,
      blockingQuestions: 3,
      withoutDecider: 2,
      blockingWithoutDecider: 1,
    });
    expect(result.questions.map((row) => [row.spec, row.index, row.holds])).toEqual([
      ["spec:probe.subject", 0, ["spec:probe.subject", "spec:probe.dependent"]],
      ["spec:probe.other", 0, ["spec:probe.other"]],
      ["spec:probe.settled", 0, ["spec:probe.settled"]],
      ["spec:probe.other", 1, []],
    ]);
    expect(result.questions[0]).toEqual({
      address: "spec:probe.subject#question.big",
      spec: "spec:probe.subject",
      index: 0,
      question: "A choice",
      blocking: true,
      decider: "owner",
      holds: ["spec:probe.subject", "spec:probe.dependent"],
    });
    const delegated = await catalogRecipe<Queue>(46, input, { decider: "team-lead" });
    expect(delegated.questions).toMatchObject([
      { address: "spec:probe.other#question.delegate", holds: [] },
    ]);
    expect(delegated.totals).toMatchObject({ withoutDecider: 2, blockingWithoutDecider: 1 });
  });
});

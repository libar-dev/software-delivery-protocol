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
  RoadmapConditions,
  RoadmapOutcome,
} from "../generated/contracts/consumers.roadmap.space.js";
import type { GraphSchema } from "../src/index.js";
import { probeGraph, probePack, probeSpec, roadmap, workGraph } from "./helpers/roadmap-probe.js";
import type { Roadmap } from "./helpers/roadmap-probe.js";
import { registerBuiltWork } from "./consumers.roadmap.built-work.test.generated.js";
import { registerBuildablePart } from "./consumers.roadmap.buildable-part.test.generated.js";
import { registerStatementPart } from "./consumers.roadmap.statement-part.test.generated.js";
import { registerDesignPart } from "./consumers.roadmap.design-part.test.generated.js";
import { registerDriftingPart } from "./consumers.roadmap.drifting-part.test.generated.js";
import { registerMissingEvidence } from "./consumers.roadmap.missing-evidence.test.generated.js";
import { registerBlockingPart } from "./consumers.roadmap.blocking-part.test.generated.js";
import { registerOutsideParent } from "./consumers.roadmap.outside-parent.test.generated.js";
import { registerStatementOrder } from "./consumers.roadmap.statement-order.test.generated.js";

const oracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.roadmap"),
  models: ref("spec:consumers.roadmap"),
});
void oracleAnchor;

const NEED = "the entry's need reads {need}";
const DRIFT = "the entry counts {drift} parts as drift";
const PART = "the entry names {part} among the parts with its need, held by {clause}";
const OUTSIDE = "the entry rests on {target} through {origin}";
const ORDER = "the waiting statements list {earlier} before {later}";

function expected(point: Partial<RoadmapConditions>): RoadmapOutcome {
  if (point.work === "spec:probe.dependent")
    return { kind: ORDER, earlier: "spec:probe.base", later: "spec:probe.dependent" };
  switch (point.state) {
    case "is ready and implemented throughout":
      return { kind: NEED, need: "built" };
    case "has one part ready and not implemented":
      return { kind: NEED, need: "to build" };
    case "has one part below ready whose floor reaches ready":
      return { kind: NEED, need: "to state" };
    case "has one part below ready whose floor stops short":
      return { kind: NEED, need: "to design" };
    case "has one part implemented below ready":
      return { kind: DRIFT, drift: 1 };
    case "has a ready root and one descendant without its kind's evidence":
      return { kind: PART, part: "spec:probe.part", clause: "kind-evidence-present" };
    case "has a ready root and one descendant held by a blocking question":
      return { kind: PART, part: "spec:probe.part", clause: "no-blocking-open-questions" };
    case "has one descendant that also refines a Spec outside the roadmap":
      return { kind: OUTSIDE, target: "spec:probe.outside", origin: "spec:probe.part" };

    default:
      return unspecified;
  }
}

interface World {
  point: Partial<RoadmapConditions>;
  graph: GraphSchema;
  answer?: Roadmap;
}
function createWorld(point: Partial<RoadmapConditions>): World {
  return {
    point,
    graph:
      point.work === "spec:probe.dependent"
        ? probeGraph({
            "pack.sdp.md": probePack("probe", ["dependent", "base"]),
            "dependent.sdp.md": probeSpec("dependent", "defined", "\n  dependsOn: spec:probe.base"),
            "base.sdp.md": probeSpec("base", "defined"),
          })
        : workGraph(point.state ?? ""),
  };
}
async function invoke(world: World): Promise<void> {
  world.answer = (await roadmap(world.graph)).roadmaps[0];
}
function observe(world: World): RoadmapOutcome {
  const entry = world.answer?.entries[0];
  if (entry === undefined) return unspecified;
  if (world.point.work === "spec:probe.dependent") {
    const statements = world.answer?.waiting.statements ?? [];
    return { kind: ORDER, earlier: statements[0]?.id ?? "", later: statements[1]?.id ?? "" };
  }
  switch (world.point.state) {
    case "has one part implemented below ready":
      return { kind: DRIFT, drift: entry.work.drift ?? -1 };
    case "has a ready root and one descendant without its kind's evidence":
    case "has a ready root and one descendant held by a blocking question": {
      const part = entry.workRows.find((row) => row.need === entry.need);
      return { kind: PART, part: part?.id ?? "", clause: part?.holdsNextRung[0]?.clause ?? "" };
    }
    case "has one descendant that also refines a Spec outside the roadmap": {
      const row = entry.restsOn[0];
      return { kind: OUTSIDE, target: row?.id ?? "", origin: row?.from.join(", ") ?? "" };
    }
    case undefined: {
      const statements = world.answer?.waiting.statements ?? [];
      return { kind: ORDER, earlier: statements[0]?.id ?? "", later: statements[1]?.id ?? "" };
    }
    default: {
      if (
        entry.need !== "to design" &&
        entry.need !== "to state" &&
        entry.need !== "to build" &&
        entry.need !== "built"
      )
        return unspecified;
      return { kind: NEED, need: entry.need };
    }
  }
}
function assertions(world: World): void {
  expect(world.answer?.pack).toBe("pack:probe");
  expect(world.answer?.order).toBe("priority");
  if (world.point.work === "spec:probe.dependent") {
    expect(world.answer?.entries[0]?.earlierStatements).toEqual([
      { id: "spec:probe.base", where: "roadmap", onRoadmap: 2 },
    ]);
  } else {
    expect(world.answer?.entries[0]?.statedReadiness).toBe("ready");
    expect(world.answer?.entries[0]?.workRows).toHaveLength(2);
  }
}

const builtWorkAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.built-work"),
  verifies: ref("spec:consumers.roadmap.built-work"),
});
void builtWorkAnchor;
registerBuiltWork({ createWorld, invoke, observe, expected, assertions });

const buildablePartAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.buildable-part"),
  verifies: ref("spec:consumers.roadmap.buildable-part"),
});
void buildablePartAnchor;
registerBuildablePart({ createWorld, invoke, observe, expected, assertions });

const statementPartAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.statement-part"),
  verifies: ref("spec:consumers.roadmap.statement-part"),
});
void statementPartAnchor;
registerStatementPart({ createWorld, invoke, observe, expected, assertions });

const designPartAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.design-part"),
  verifies: ref("spec:consumers.roadmap.design-part"),
});
void designPartAnchor;
registerDesignPart({ createWorld, invoke, observe, expected, assertions });

const driftingPartAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.drifting-part"),
  verifies: ref("spec:consumers.roadmap.drifting-part"),
});
void driftingPartAnchor;
registerDriftingPart({ createWorld, invoke, observe, expected, assertions });

const missingEvidenceAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.missing-evidence"),
  verifies: ref("spec:consumers.roadmap.missing-evidence"),
});
void missingEvidenceAnchor;
registerMissingEvidence({ createWorld, invoke, observe, expected, assertions });

const blockingPartAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.blocking-part"),
  verifies: ref("spec:consumers.roadmap.blocking-part"),
});
void blockingPartAnchor;
registerBlockingPart({ createWorld, invoke, observe, expected, assertions });

const outsideParentAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.outside-parent"),
  verifies: ref("spec:consumers.roadmap.outside-parent"),
});
void outsideParentAnchor;
registerOutsideParent({ createWorld, invoke, observe, expected, assertions });

const statementOrderAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap.statement-order"),
  verifies: ref("spec:consumers.roadmap.statement-order"),
});
void statementOrderAnchor;
registerStatementOrder({ createWorld, invoke, observe, expected, assertions });

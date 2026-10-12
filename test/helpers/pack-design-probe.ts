import {
  codeAnchor,
  codeAnchorId,
  componentAnchorId,
  decidedBy,
  dependsOn,
  pack,
  packId,
  ref,
  refines,
  spec,
  specId,
  specTest,
  testAnchorId,
  verifies,
} from "../../src/index.js";
import type { EntryLocation, GraphSchema } from "../../src/index.js";
import { deriveFixtureGraph } from "./fixture-graph.js";

/**
 * The probe the Pack design tests share: a Pack whose members hold, wait at, or stay below their
 * stated next rung; carry design entries, pinned declarations, questions and decisions; are
 * realized, referenced and verified; rest on Specs outside the Pack and are rested on by others;
 * and include one member the graph does not hold.
 */

export const PACK_ID = "pack:probe.design";
export const CARRIER = "specs/fixture.sdp.ts";

/** A rule Spec with its statement in place, so the kind's evidence never holds a probe back. */
function rule(
  id: string,
  readiness: "idea" | "scoped" | "defined" | "ready",
  extra: Partial<Parameters<typeof spec>[0]> = {},
): ReturnType<typeof spec> {
  return spec({
    id: specId(id),
    title: `Probe ${id.slice("spec:probe.".length)}`,
    kind: "rule",
    altitude: "story",
    readiness,
    intent: { outcome: `Probe ${id}.` },
    behavior: { rules: ["The probe states one rule."] },
    ...extra,
  });
}

function example(id: string): ReturnType<typeof spec> {
  return spec({
    id: specId(id),
    title: `Probe ${id.slice("spec:probe.".length)}`,
    kind: "example",
    altitude: "story",
    readiness: "idea",
    intent: { outcome: `Probe ${id}.` },
    relations: [refines(specId("spec:probe.waiting")), verifies(specId("spec:probe.waiting"))],
  });
}

/** The location table rows, written out of order: the reader sorts each Spec's rows by entry. */
export const PROBE_LOCATIONS: readonly EntryLocation[] = [
  { spec: "spec:probe.blocked", file: CARRIER, entry: "question[0]", key: "scopeCut", line: 14 },
  { spec: "spec:probe.held", file: CARRIER, entry: "question[0]", key: "basisOwner", line: 21 },
  { spec: "spec:probe.held", file: CARRIER, entry: "design.tableOrders", line: 31 },
  { spec: "spec:probe.held", file: CARRIER, entry: "design.fnCreate", line: 30 },
];

export function packDesignProbeGraph(): GraphSchema {
  const graph = deriveFixtureGraph({
    specs: [
      rule("spec:probe.held", "defined", {
        intent: {
          outcome: "Hold the design.",
          openQuestions: [
            { question: "Who owns the basis?", blocking: false, key: "basisOwner" },
            "Is the <name> | # final?",
          ],
        },
        design: {
          description: "The held design.",
          fnCreate: "`create(input: Input): Order` builds the order",
          tableOrders: "``orders: Map<Id, `Order`>`` keeps them",
          note: "Plain prose is not a declaration.",
          lateSpan: "Prose before `code` is not a declaration.",
        },
        ui: { description: "UI prose.", layout: "Two columns.", signature: "`x(): y`" },
        relations: [
          dependsOn(specId("spec:probe.outside-basis")),
          decidedBy(specId("spec:probe.choice")),
        ],
      }),
      rule("spec:probe.waiting", "defined", {
        relations: [refines(specId("spec:probe.held"))],
      }),
      rule("spec:probe.blocked", "scoped", {
        intent: {
          outcome: "Stay below defined.",
          openQuestions: [{ question: "Where is the cut?", blocking: true, key: "scopeCut" }],
        },
        relations: [
          dependsOn(specId("spec:probe.outside-basis")),
          decidedBy(specId("spec:probe.absent")),
        ],
      }),
      rule("spec:probe.modest", "idea", {
        relations: [dependsOn(specId("spec:probe.outside-basis"))],
      }),
      rule("spec:probe.top", "ready", { relations: [refines(specId("spec:probe.held"))] }),
      rule("spec:probe.outside-basis", "scoped", {
        relations: [refines(specId("spec:probe.held"))],
      }),
      spec({
        id: specId("spec:probe.choice"),
        title: "Probe choice",
        kind: "decision",
        altitude: "story",
        readiness: "defined",
        intent: { outcome: "Choose." },
        decision: { context: "A choice is due.", decision: "Choose the probe." },
        relations: [dependsOn(specId("spec:probe.outside-basis"))],
      }),
      spec({
        id: specId("spec:probe.vocabulary"),
        title: "Probe vocabulary",
        kind: "model",
        altitude: "story",
        readiness: "idea",
        intent: { outcome: "Name the probe's terms." },
        model: { terms: { probe: "a synthetic Spec" } },
      }),
      example("spec:probe.waiting.case"),
      example("spec:probe.waiting.unbound"),
      // A member that verifies a Spec outside the Pack: a relation, never something it rests on.
      spec({
        id: specId("spec:probe.check"),
        title: "Probe check",
        kind: "example",
        altitude: "story",
        readiness: "idea",
        intent: { outcome: "Check the basis." },
        relations: [
          refines(specId("spec:probe.held")),
          verifies(specId("spec:probe.outside-basis")),
        ],
      }),
    ],
    packs: [
      pack({
        id: packId(PACK_ID),
        title: "Probe design",
        framing: "The probe's design as it stands.",
        specs: [
          specId("spec:probe.held"),
          specId("spec:probe.waiting"),
          specId("spec:probe.blocked"),
          specId("spec:probe.missing"),
          specId("spec:probe.modest"),
          specId("spec:probe.top"),
          specId("spec:probe.check"),
        ],
        modelRefs: [specId("spec:probe.vocabulary")],
      }),
    ],
    anchors: [
      codeAnchor({
        id: codeAnchorId("component:probe.core"),
        label: "the probe core",
        layer: "domain",
        context: "probe",
      }),
      codeAnchor({
        id: codeAnchorId("impl:probe.waiting"),
        label: "realizes the waiting rule",
        satisfies: ref("spec:probe.waiting"),
        component: componentAnchorId("component:probe.core"),
        role: "service",
      }),
      codeAnchor({
        id: codeAnchorId("impl:probe.helper"),
        references: [ref("spec:probe.blocked")],
      }),
      specTest({ id: testAnchorId("test:probe.waiting"), verifies: ref("spec:probe.waiting") }),
      specTest({ id: testAnchorId("test:probe.case"), verifies: ref("spec:probe.waiting.case") }),
    ],
  });

  return { ...graph, locations: PROBE_LOCATIONS };
}

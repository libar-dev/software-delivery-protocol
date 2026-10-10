import { describe, expect, it } from "vitest";

import { createReader } from "../src/index.js";
import type { GraphSchema, PackContext, PackMemberSummary } from "../src/index.js";
import {
  CARRIER,
  PACK_ID,
  packDesignProbeGraph as probeGraph,
} from "./helpers/pack-design-probe.js";

/**
 * The Pack design on the Pack context, read over a hand-built probe graph: the stated next rung
 * and its unmet clauses, the design columns, the bindings with their components, the verifier
 * counts, the boundary both ways, and the unresolved member.
 *
 * @sdpAnchor test:protocol.pack-design
 * @sdpLabel the Pack context carries each member's design and the Pack's boundary
 * @sdpVerifies spec:consumers.pack-design
 */

const TYPED_TARGETS = "typed-dependency-targets-are-defined";

function packDesign(): PackContext {
  const context = createReader(probeGraph()).packContext(PACK_ID);

  if (context === undefined) {
    throw new Error(`The probe graph lost "${PACK_ID}".`);
  }

  return context;
}

function member(id: string): PackMemberSummary {
  const found = packDesign().members.find((entry) => entry.id === id);

  if (found === undefined) {
    throw new Error(`The Pack context lists no member "${id}".`);
  }

  return found;
}

describe("the Pack design on the Pack context", () => {
  it("keeps the manifest's order and every existing field", () => {
    const context = packDesign();

    expect(context.members.map((entry) => entry.id)).toEqual([
      "spec:probe.held",
      "spec:probe.waiting",
      "spec:probe.blocked",
      "spec:probe.missing",
      "spec:probe.modest",
      "spec:probe.top",
      "spec:probe.check",
    ]);
    expect(member("spec:probe.held")).toMatchObject({
      resolved: true,
      title: "Probe held",
      specKind: "rule",
      altitude: "story",
      statedReadiness: "defined",
      derivedReadiness: "defined",
      deliveryFacts: [],
      file: CARRIER,
    });
    expect(context.verifierGaps.map((gap) => gap.id)).toEqual([
      "spec:probe.held",
      "spec:probe.blocked",
      "spec:probe.modest",
      "spec:probe.top",
      "spec:probe.check",
    ]);
  });

  it("names the stated next rung's unmet clauses, with the targets a dependency clause names", () => {
    const held = member("spec:probe.held");

    expect(held.statedNextRung).toBe("ready");
    expect(held.statedNextRungFailures?.map((failure) => failure.clauseId)).toEqual([
      TYPED_TARGETS,
    ]);
    expect(held.statedNextRungFailures?.[0]?.targets).toEqual([
      { type: "dependsOn", id: "spec:probe.outside-basis", statedReadiness: "scoped" },
    ]);

    const blocked = member("spec:probe.blocked");

    expect(blocked.statedNextRung).toBe("defined");
    expect(blocked.statedNextRungFailures?.map((failure) => failure.clauseId)).toEqual([
      "no-blocking-open-questions",
    ]);
    expect(blocked.statedNextRungFailures?.[0]?.targets).toBeUndefined();
  });

  it("reads an empty list where the floor already holds the stated next rung", () => {
    expect(member("spec:probe.waiting")).toMatchObject({
      statedReadiness: "defined",
      derivedReadiness: "ready",
      statedNextRung: "ready",
      statedNextRungFailures: [],
    });
  });

  it("keeps the stated reading apart from the floor-reached reading", () => {
    const reader = createReader(probeGraph());
    const modest = packDesign().members.find((entry) => entry.id === "spec:probe.modest");

    // Stated `idea`, floor reached `defined`: the rung above the stated one holds, while the
    // rung above the floor reached fails on the dependency still stated `scoped`.
    expect(modest).toMatchObject({
      statedReadiness: "idea",
      derivedReadiness: "defined",
      statedNextRung: "scoped",
      statedNextRungFailures: [],
    });
    expect(
      reader.specContext("spec:probe.modest")?.nextRungFailures.map((failure) => failure.clauseId),
    ).toEqual([TYPED_TARGETS]);
  });

  it("names no next rung above ready", () => {
    const top = member("spec:probe.top");

    expect(top.statedReadiness).toBe("ready");
    expect(top).not.toHaveProperty("statedNextRung");
    expect(top.statedNextRungFailures).toEqual([]);
  });

  it("counts the design columns: keyed entries, pinned declarations and questions", () => {
    const design = member("spec:probe.held").design;

    // Four Design keys and two UI keys, `description` excluded from both; two Design values open
    // with a code span, and a UI value never counts as a declaration.
    expect(design?.entries).toBe(6);
    expect(design?.declarations).toBe(2);
    expect(design?.blockingQuestions).toBe(0);
    expect(design?.openQuestions).toEqual([
      {
        index: 0,
        question: "Who owns the basis?",
        blocking: false,
        key: "basisOwner",
        line: 21,
      },
      { index: 1, question: "Is the <name> | # final?", blocking: false },
    ]);
    expect(member("spec:probe.blocked").design).toMatchObject({
      entries: 0,
      declarations: 0,
      blockingQuestions: 1,
      openQuestions: [
        { index: 0, question: "Where is the cut?", blocking: true, key: "scopeCut", line: 14 },
      ],
    });
  });

  it("lists the decisions a member names, unresolved when the target is no Spec", () => {
    expect(member("spec:probe.held").design?.decisions).toEqual([
      {
        id: "spec:probe.choice",
        title: "Probe choice",
        statedReadiness: "defined",
        resolved: true,
      },
    ]);
    expect(member("spec:probe.blocked").design?.decisions).toEqual([
      { id: "spec:probe.absent", resolved: false },
    ]);
  });

  it("carries each realizing and referencing unit with its component on the member and on the Spec context", () => {
    const realizing = {
      codeId: "impl:probe.waiting",
      claim: "anchored",
      label: "realizes the waiting rule",
      file: "src/fixture.ts",
      line: 2,
      role: "service",
      component: { id: "component:probe.core", layer: "domain", context: "probe" },
    };

    expect(member("spec:probe.waiting").implementations).toEqual([realizing]);
    expect(member("spec:probe.waiting").references).toEqual([]);
    expect(createReader(probeGraph()).specContext("spec:probe.waiting")?.implementations).toEqual([
      realizing,
    ]);
    expect(member("spec:probe.blocked").references).toEqual([
      { codeId: "impl:probe.helper", claim: "anchored", file: "src/fixture.ts", line: 3 },
    ]);
  });

  it("counts verifiers and verifying examples with how many are enabled", () => {
    expect(member("spec:probe.waiting")).toMatchObject({
      verifiers: { total: 3, enabled: 2 },
      examples: { total: 2, enabled: 1 },
    });
    expect(member("spec:probe.held")).toMatchObject({
      verifiers: { total: 0, enabled: 0 },
      examples: { total: 0, enabled: 0 },
    });
  });

  // `spec:probe.check` verifies the outside basis: a relation that rests on nothing, so the
  // basis row lists only the members that depend on it.
  it("lists the boundary both ways, rows by id and members in authored order", () => {
    expect(packDesign().boundary).toEqual({
      restsOn: [
        {
          id: "spec:probe.choice",
          title: "Probe choice",
          statedReadiness: "defined",
          implemented: false,
          via: [{ type: "decidedBy", members: ["spec:probe.held"] }],
        },
        {
          id: "spec:probe.outside-basis",
          title: "Probe outside-basis",
          statedReadiness: "scoped",
          implemented: false,
          via: [
            {
              type: "dependsOn",
              members: ["spec:probe.held", "spec:probe.blocked", "spec:probe.modest"],
            },
          ],
        },
      ],
      restedOnBy: [
        {
          id: "spec:probe.outside-basis",
          title: "Probe outside-basis",
          statedReadiness: "scoped",
          implemented: false,
          via: [{ type: "refines", members: ["spec:probe.held"] }],
        },
        {
          id: "spec:probe.waiting.case",
          title: "Probe waiting.case",
          statedReadiness: "idea",
          implemented: false,
          via: [
            { type: "refines", members: ["spec:probe.waiting"] },
            { type: "verifies", members: ["spec:probe.waiting"] },
          ],
        },
        {
          id: "spec:probe.waiting.unbound",
          title: "Probe waiting.unbound",
          statedReadiness: "idea",
          implemented: false,
          via: [
            { type: "refines", members: ["spec:probe.waiting"] },
            { type: "verifies", members: ["spec:probe.waiting"] },
          ],
        },
      ],
    });
  });

  it("marks an outside Spec that carries the implementation fact", () => {
    const graph = probeGraph();
    const bound: GraphSchema = {
      ...graph,
      nodes: [
        ...graph.nodes,
        {
          id: "impl:probe.basis",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/basis.ts",
          line: 1,
        },
      ],
      edges: [
        ...graph.edges,
        {
          from: "impl:probe.basis",
          type: "satisfies",
          to: "spec:probe.outside-basis",
          claim: "anchored",
        },
      ],
    };
    const restsOn = createReader(bound).packContext(PACK_ID)?.boundary.restsOn;

    expect(restsOn?.find((row) => row.id === "spec:probe.outside-basis")?.implemented).toBe(true);
    expect(restsOn?.find((row) => row.id === "spec:probe.choice")?.implemented).toBe(false);
  });

  it("keeps an unresolved member's existing row and nothing more", () => {
    expect(member("spec:probe.missing")).toEqual({
      id: "spec:probe.missing",
      resolved: false,
      deliveryFacts: [],
    });
  });

  it("carries each Spec's location rows on its Spec context, sorted by entry", () => {
    const reader = createReader(probeGraph());

    expect(reader.specContext("spec:probe.held")?.entryLocations).toEqual([
      { spec: "spec:probe.held", file: CARRIER, entry: "design.fnCreate", line: 30 },
      { spec: "spec:probe.held", file: CARRIER, entry: "design.tableOrders", line: 31 },
      { spec: "spec:probe.held", file: CARRIER, entry: "question[0]", key: "basisOwner", line: 21 },
    ]);
    expect(reader.specContext("spec:probe.top")?.entryLocations).toEqual([]);

    const { locations: _dropped, ...withoutTable } = probeGraph();
    void _dropped;
    const unlocated = createReader(withoutTable);

    expect(unlocated.specContext("spec:probe.held")?.entryLocations).toEqual([]);
    expect(
      unlocated.packContext(PACK_ID)?.members[0]?.design?.openQuestions.map((entry) => entry.line),
    ).toEqual([undefined, undefined]);
  });

  it("is a pure function of the graph: two reads of one graph are equal", () => {
    expect(JSON.stringify(packDesign())).toBe(JSON.stringify(packDesign()));
  });
});

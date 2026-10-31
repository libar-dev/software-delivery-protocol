import { registerOutsideComponents } from "./consumers.design-slice.outside-components.test.generated.js";
import { registerOutsideHolding } from "./consumers.design-slice.outside-holding.test.generated.js";
import { registerOutsideUnbound } from "./consumers.design-slice.outside-unbound.test.generated.js";
import { registerOutsideSatisfied } from "./consumers.design-slice.outside-satisfied.test.generated.js";
import { registerComponentUnreadable } from "./consumers.design-slice.component-unreadable.test.generated.js";
import { registerComponentDiffering } from "./consumers.design-slice.component-differing.test.generated.js";
import { registerComponentMatching } from "./consumers.design-slice.component-matching.test.generated.js";
import { registerComponentUnrelated } from "./consumers.design-slice.component-unrelated.test.generated.js";
import { registerComponentAbsent } from "./consumers.design-slice.component-absent.test.generated.js";
import { registerIndependentExample } from "./consumers.design-slice.independent-example.test.generated.js";
import { registerFoldedExample } from "./consumers.design-slice.folded-example.test.generated.js";
import { registerDependencyCycle } from "./consumers.design-slice.dependency-cycle.test.generated.js";
import { registerDecisionBacklink } from "./consumers.design-slice.decision-backlink.test.generated.js";
import { registerChain } from "./consumers.design-slice.chain.test.generated.js";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  DesignSliceConditions,
  DesignSliceOutcome,
} from "../generated/contracts/consumers.design-slice.space.js";
import { readFileSync } from "node:fs";
import { recipeFiles } from "../src/cli/build-artifacts.js";
import { evaluateBody } from "../src/index.js";
import {
  codeAnchor,
  codeAnchorId,
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { describe, expect, it } from "vitest";
import { catalogRecipe } from "./helpers/recipe-probe.js";
import {
  cid,
  component,
  designProbe,
  link,
  primitive,
  setMembers,
  sid,
  sliceProbe,
} from "./helpers/design-slice-probe.js";
import type { GraphSchema } from "../src/index.js";

interface Member {
  id: string;
  depth: number;
  restsOn: string[];
  exampleOf: string | null;
  exampleMembers: string[];
  holds: unknown[];
  design: Record<string, number>;
  rules: { total: number; keyed: number };
  implementedBy: string[] | number;
  referencedBy: string[] | number;
  title?: string;
  examples: { total: number; enabled: number };
  verifiers: { total: number; enabled: number };
}
interface Design {
  spec: string;
  componentId: string;
  anchorExists: boolean;
  realized: boolean;
  layer: string | null;
  uses: string[] | null;
  differing: unknown[];
  unreadable: unknown[];
}
interface Slice {
  scope: Record<string, unknown>;
  totals: {
    depth: number;
    cycles: number;
    exampleMembers: number;
    designs: Record<string, number>;
    components: Record<string, number>;
    componentUses: Record<string, number>;
  };
  members: Member[];
  structure: {
    edges: { from: string; to: string; type: string; orders: boolean; reason?: string }[];
    cycles: { members: string[]; cycle: string[] }[];
    unresolved: { from: string; to: string; type: string; reason?: string }[];
  };
  boundary: Record<
    string,
    {
      id: string;
      holds: string[];
      inPack?: boolean;
      via: { type: string; members: string[]; reasons?: { member: string; reason: string }[] }[];
    }[]
  >;
  architecture: {
    components: {
      id: string;
      members: { satisfies: string[]; references: string[] };
      restsOn: string[];
      designs: string[];
    }[];
    designs: Design[];
    uses: { from: string; to: string; count: number; outside: boolean; units: unknown[] }[];
    plannedUses: { design: string; from: string; to: string; outside: boolean }[];
    outside: { id: string; anchored: boolean; reachedBy: string[] }[];
    unplaced: unknown[];
  };
  decisions: unknown[];
  questions: {
    spec: string;
    blocking: boolean;
    holds: string[];
    origin: string;
    address: string | null;
  }[];
  leftOut?: string[];
  diagnostics?: unknown[];
}
function assertKeys(value: unknown, names: string): void {
  expect(Object.keys(value as object).sort()).toEqual(names.split(" ").sort());
}
function assertMemberKeys(value: unknown, full: boolean): void {
  assertKeys(
    value,
    full
      ? "id title specKind altitude statedReadiness floorReached statedNextRung holds depth restsOn restedOnBy exampleOf exampleMembers design rules examples verifiers implementedBy referencedBy components"
      : "id specKind statedReadiness floorReached statedNextRung holds depth restsOn exampleOf design rules implementedBy referencedBy",
  );
}
function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("The probe did not produce the expected value.");
  return value;
}
const slice = (
  graph: GraphSchema = sliceProbe(),
  params: Record<string, unknown> = { pack: "pack:probe.slice", detail: true },
) =>
  evaluateBody(
    required(
      recipeFiles(
        readFileSync(new URL("../docs/agent-surface/recipes.md", import.meta.url), "utf8"),
      ).find((row) => row.ordinal === 54),
    ).content,
    { graph, params },
  ) as Promise<Slice>;

const sliceDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.design-slice-recipe"),
  label: "realizes the design slice in the shipped recipe catalog",
  satisfies: ref("spec:consumers.design-slice"),
  role: "projection",
});
void sliceDocumentAnchor;
const sliceTestAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice"),
  verifies: ref("spec:consumers.design-slice"),
});
void sliceTestAnchor;

describe("design slice", () => {
  it("keeps authored order while assigning depth and composing whole-Pack boundary", async () => {
    const graph = sliceProbe();
    graph.nodes.push(
      primitive("outside"),
      primitive("downstream"),
      primitive("verifier", { specKind: "example" }),
    );
    graph.edges.push(
      link(sid("base"), "dependsOn", sid("outside")),
      link(sid("downstream"), "constrainedBy", sid("base")),
      link(sid("verifier"), "verifies", sid("top")),
    );
    const answer = await slice(graph);
    expect(answer.members.map(({ id, depth }) => ({ id, depth }))).toEqual([
      { id: sid("top"), depth: 2 },
      { id: sid("base"), depth: 1 },
    ]);
    const pack = await catalogRecipe<{ boundary: Record<string, unknown[]> }>(29, graph, {
      pack: "pack:probe.slice",
      detail: true,
    });
    for (const [direction, rows] of Object.entries(pack.boundary))
      expect(answer.boundary[direction]).toEqual(
        rows.map((row) => expect.objectContaining(row as object)),
      );
    expect(answer.structure.edges).toEqual([
      {
        from: sid("top"),
        to: sid("base"),
        type: "dependsOn",
        orders: true,
        reason: "the top needs its base",
      },
    ]);
  });
  it("keeps summary totals, selected full members and explicit omissions", async () => {
    const full = await slice();
    const summary = await slice(sliceProbe(), { pack: "pack:probe.slice" });
    expect(summary.totals).toEqual(full.totals);
    expect(summary.members[0]).not.toHaveProperty("title");
    expect(summary.structure.edges[0]).not.toHaveProperty("reason");
    expect(summary.leftOut?.length).toBeGreaterThan(0);
    expect(await slice(sliceProbe(), { pack: "pack:probe.slice", detail: false })).toEqual(summary);
    const mixed = await slice(sliceProbe(), {
      pack: "pack:probe.slice",
      detail: [sid("top"), sid("other")],
    });
    expect(mixed.members[0]).toEqual(full.members[0]);
    expect(mixed.members[1]).toEqual(summary.members[1]);
    expect(mixed.diagnostics).toEqual([{ id: sid("other"), reason: "not-member" }]);
  });
  it("reads an ordered Spec list and a narrowed Pack, marking excluded Pack members", async () => {
    const narrowed = await slice(sliceProbe(), {
      pack: "pack:probe.slice",
      members: [sid("top")],
      detail: true,
    });
    expect(narrowed.scope).toMatchObject({ subset: true, members: [sid("top")] });
    expect(narrowed.boundary.restsOn).toMatchObject([{ id: sid("base"), inPack: true }]);
    const list = await slice(sliceProbe(), { specs: [sid("base"), sid("top")], detail: true });
    expect(list.scope).toEqual({ specs: [sid("base"), sid("top")] });
    expect(list.members.map((row) => row.id)).toEqual([sid("base"), sid("top")]);
  });
  it.each(["dependsOn", "constrainedBy", "decidedBy"] as const)(
    "only suppresses a refinement the target answers with %s",
    async (type) => {
      const graph = sliceProbe();
      graph.edges = [link(sid("base"), "refines", sid("top")), link(sid("top"), type, sid("base"))];
      const answer = await slice(graph);
      expect(answer.structure.edges.filter((edge) => !edge.orders)).toEqual([
        { from: sid("base"), to: sid("top"), type: "refines", orders: false },
      ]);
      expect(answer.members.map((row) => row.depth)).toEqual([2, 1]);
    },
  );
  it("lists cycles at the depth after their deepest outside prerequisite", async () => {
    const graph = sliceProbe();
    graph.nodes.push(primitive("root"));
    graph.edges.push(
      link(sid("base"), "dependsOn", sid("top")),
      link(sid("base"), "dependsOn", sid("root")),
    );
    setMembers(graph, ["top", "base", "root"]);
    const answer = await slice(graph);
    expect(answer.structure.cycles).toEqual([
      { members: [sid("base"), sid("top")], cycle: [sid("base"), sid("top"), sid("base")] },
    ]);
    expect(answer.members.map((row) => row.depth)).toEqual([2, 2, 1]);
  });
  it.each(["refines", "dependsOn", "constrainedBy", "decidedBy"] as const)(
    "does not fold an example with another %s in either direction or across the boundary",
    async (type) => {
      for (const incoming of [false, true]) {
        const graph = sliceProbe();
        graph.nodes.push(primitive("example", { specKind: "example" }), primitive("outside"));
        graph.edges.push(
          link(sid("example"), "refines", sid("base")),
          incoming
            ? link(sid("outside"), type, sid("example"))
            : link(sid("example"), type, sid("outside")),
        );
        setMembers(graph, ["base", "example"]);
        expect((await slice(graph)).members[1]?.exampleOf).toBeNull();
      }
    },
  );
  it("accumulates diagnostics in contract order and skips dependent checks", async () => {
    const graph = sliceProbe();
    const run = (params: Record<string, unknown>) => catalogRecipe(54, graph, params);
    expect(await run({ detail: null })).toEqual({
      diagnostics: [
        { scope: "detail", problem: "Expected true, false or a list of member ids." },
        { scope: "scope", problem: "Supply exactly one of pack or specs." },
      ],
    });
    expect(await run({ pack: false, members: false, detail: 1 })).toEqual({
      diagnostics: [
        { scope: "detail", problem: "Expected true, false or a list of member ids." },
        { scope: "pack", problem: "Pack does not resolve." },
      ],
    });
    expect(await run({ specs: [sid("missing"), sid("absent")], members: [], detail: {} })).toEqual({
      diagnostics: [
        { scope: "detail", problem: "Expected true, false or a list of member ids." },
        { scope: sid("missing"), problem: "Spec does not resolve." },
        { scope: sid("absent"), problem: "Spec does not resolve." },
        { scope: "members", problem: "members narrows only a Pack scope." },
      ],
    });
    expect(
      await run({ pack: "pack:probe.slice", members: [sid("absent"), sid("missing")] }),
    ).toEqual({
      diagnostics: [
        { scope: sid("absent"), problem: "Not a resolved member of the Pack." },
        { scope: sid("missing"), problem: "Not a resolved member of the Pack." },
      ],
    });
    expect(await run({ pack: "pack:probe.slice", specs: [sid("base")] })).toEqual({
      diagnostics: [{ scope: "scope", problem: "Supply exactly one of pack or specs." }],
    });
    for (const value of [null, [], [1], [sid("base"), sid("base")], "bad"]) {
      expect(await run({ pack: "pack:probe.slice", members: value })).toEqual({
        diagnostics: [
          { scope: "members", problem: "Expected a non-empty list of distinct member ids." },
        ],
      });
      expect(await run({ specs: value })).toEqual({
        diagnostics: [
          { scope: "specs", problem: "Expected a non-empty list of distinct Spec ids." },
        ],
      });
    }
    expect(await run({ wrong: true, detail: null })).toEqual({
      unknownParams: ["wrong"],
      accepts: ["pack", "specs", "members", "detail"],
    });
  });
  it("pins the component Design grammar and totals to recipe 43", async () => {
    for (const anchor of [
      "no anchor holds",
      "an anchor holds without satisfying the design",
      "an anchor satisfies, matching every declared value",
      "an anchor satisfies, with a differing layer and uses",
      "an anchor satisfies, with an unreadable layer",
    ]) {
      const graph = designProbe(anchor);
      const answer = await slice(graph);
      const comparison = await catalogRecipe<{
        totals: Record<string, number>;
        differing: {
          spec: string;
          componentId: string;
          field: string;
          planned: unknown;
          realized: unknown;
        }[];
        unreadable: { spec: string; key: string; value: unknown }[];
      }>(43, graph);
      const { designs, ...totals } = comparison.totals;
      expect(answer.totals.designs).toEqual({ total: designs, ...totals });
      expect(answer.architecture.designs[0]?.differing).toEqual(
        comparison.differing.map(({ field, planned, realized }) => ({ field, planned, realized })),
      );
      expect(answer.architecture.designs[0]?.unreadable).toEqual(
        comparison.unreadable.map(({ key, value }) => ({ key, value })),
      );
    }
  });
});

const ORDER = "the members read in depth order {order}";
const COUNTS = "the slice reports {cycles} cycles and {exampleMembers} folded example members";
const DESIGN =
  "the member design reads {realized} with {differing} differing and {unreadable} unreadable rows";
const COMPONENTS =
  "the touched components are {components}, {throughRestsOn} of them reached through what the slice rests on";
const OUTSIDE = "the outside components are {outsideComponents}";
const HELD = "the outside Spec holds {held}";
interface World {
  point: Partial<DesignSliceConditions>;
  graph: GraphSchema;
  outcomeKind: DesignSliceOutcome["kind"];
  answer?: Slice;
}
function createWorld(point: Partial<DesignSliceConditions>): World {
  const graph = sliceProbe();
  const designed = designProbe(point.anchor ?? "no anchor holds");
  graph.nodes.push(
    ...designed.nodes.filter((node) => node.id === sid("design") || node.nodeType === "CodeNode"),
  );
  graph.edges.push(...designed.edges.filter((edge) => edge.type === "satisfies"));
  if (point.structure?.includes("decision")) {
    const at = graph.nodes.findIndex((node) => node.id === sid("base"));
    graph.nodes[at] = primitive("base", {
      specKind: "decision",
      sections: {
        intent: { outcome: "Shape the top." },
        decision: { context: "A probe choice.", decision: "Choose the probe." },
      },
    });
    graph.edges = [
      link(sid("top"), "decidedBy", sid("base")),
      link(sid("base"), "refines", sid("top")),
      ...graph.edges.filter((edge) => edge.type === "satisfies"),
    ];
  }
  if (point.structure?.includes("two members"))
    graph.edges.push(link(sid("base"), "dependsOn", sid("top")));
  if (point.structure?.includes("example")) {
    const at = graph.nodes.findIndex((node) => node.id === sid("top"));
    graph.nodes[at] = primitive("top", {
      specKind: "example",
      readiness: "scoped",
      sections: {
        intent: {
          outcome: "Exercise the base.",
          openQuestions: [
            { question: "What holds this example?", blocking: true, key: "hold", decider: "owner" },
          ],
        },
        behavior: { examples: [{ given: ["a probe"], when: ["it runs"], then: ["it holds"] }] },
      },
    });
    graph.edges = [
      link(sid("top"), "refines", sid("base")),
      ...graph.edges.filter((edge) => edge.type === "satisfies"),
    ];
    if (point.structure.includes("outside"))
      graph.edges.push(link(sid("top"), "dependsOn", sid("outside")));
  }
  graph.nodes.push(
    primitive(
      "outside",
      point.outside === "stated below defined"
        ? {
            readiness: "scoped",
            sections: {
              intent: {
                outcome: "Hold a member.",
                openQuestions: [
                  {
                    question: "Which contract holds?",
                    blocking: true,
                    key: "contract",
                    decider: "owner",
                    provisional: "Read the probe.",
                    links: [sid("base")],
                  },
                  { question: "Which label reads best?", blocking: false },
                ],
              },
              behavior: { rules: ["Hold the base."] },
            },
          }
        : {},
    ),
  );
  graph.edges.push(link(sid("base"), "dependsOn", sid("outside")));
  if (point.outside === "that a component's unit satisfies") {
    graph.nodes.push(
      component("dependency"),
      component("neighbor"),
      component("far"),
      primitive("downstream"),
      component("downstream"),
      {
        id: "impl:probe.dependency",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "dependency.ts",
        line: 2,
      },
    );
    graph.edges.push(
      link("impl:probe.dependency", "memberOf", cid("dependency"), "anchored"),
      link("impl:probe.dependency", "satisfies", sid("outside"), "anchored"),
      link(cid("dependency"), "uses", cid("neighbor"), "anchored"),
      link(cid("neighbor"), "uses", cid("dependency"), "anchored"),
      link(cid("neighbor"), "uses", cid("far"), "anchored"),
      link(sid("downstream"), "dependsOn", sid("base")),
      link(cid("downstream"), "satisfies", sid("downstream"), "anchored"),
    );
  }
  setMembers(graph, ["top", "base", "design"]);
  const outcomeKind = point.structure?.includes("decision")
    ? point.anchor === "an anchor satisfies, matching every declared value" &&
      point.outside === "that a component's unit satisfies"
      ? OUTSIDE
      : point.outside === "stated below defined"
        ? HELD
        : point.anchor === "an anchor holds without satisfying the design"
          ? COMPONENTS
          : ORDER
    : point.structure?.includes("two members") || point.structure?.includes("example")
      ? COUNTS
      : point.outside === "that a component's unit satisfies"
        ? DESIGN
        : ORDER;
  return { point, graph, outcomeKind };
}
function columnProbe() {
  const world = createWorld({
    structure: "rest on each other in a chain",
    outside: "stated below defined",
    anchor: "an anchor satisfies, with a differing layer and uses",
  });
  const graph = world.graph as ReturnType<typeof sliceProbe>;
  graph.nodes.push(
    primitive("choice", {
      specKind: "decision",
      readiness: "scoped",
      sections: {
        intent: {
          outcome: "Choose the contract.",
          openQuestions: [
            {
              question: "Which contract?",
              blocking: true,
              key: "contract",
              decider: "owner",
              links: [sid("base")],
              provisional: "Use the base.",
              trigger: "The contract is chosen.",
            },
            { question: "Which spelling?", blocking: false },
          ],
        },
        decision: { context: "Choose a contract.", decision: "Use the base." },
      },
    }),
    primitive("old", { specKind: "decision" }),
    primitive("new", { specKind: "decision" }),
    primitive("waiting"),
    primitive("downstream"),
    primitive("enabled", { specKind: "example" }),
    primitive("disabled", { specKind: "example" }),
    {
      id: "test:probe.enabled",
      nodeType: "Anchor",
      claim: "anchored",
      file: "enabled.test.ts",
      line: 1,
    },
    {
      id: "test:probe.direct",
      nodeType: "Anchor",
      claim: "anchored",
      file: "direct.test.ts",
      line: 1,
    },
    { id: "impl:probe.bare", nodeType: "CodeNode", claim: "anchored", file: "bare.ts", line: 1 },
  );
  graph.edges.push(
    link(sid("top"), "decidedBy", sid("choice")),
    link(sid("waiting"), "dependsOn", sid("base")),
    link(sid("choice"), "supersedes", sid("old")),
    link(sid("new"), "supersedes", sid("choice")),
    link(sid("downstream"), "dependsOn", sid("base")),
    link(sid("enabled"), "verifies", sid("base")),
    link(sid("disabled"), "verifies", sid("base")),
    link("test:probe.enabled", "verifies", sid("enabled"), "anchored"),
    link("test:probe.direct", "verifies", sid("base"), "anchored"),
    link("impl:probe.bare", "references", sid("top"), "anchored"),
  );
  setMembers(graph, ["top", "base", "design", "choice", "waiting", "missing"]);
  return graph;
}
const sliceOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.design-slice"),
  models: ref("spec:consumers.design-slice"),
});
void sliceOracleAnchor;

function expected(point: Partial<DesignSliceConditions>): DesignSliceOutcome {
  if (
    point.structure === "include a decision that refines the member it shapes" &&
    point.outside === "that a component's unit satisfies" &&
    point.anchor === "an anchor satisfies, matching every declared value"
  )
    return { kind: OUTSIDE, outsideComponents: "component:probe.neighbor" };
  if (
    point.outside === "that no code satisfies" &&
    point.anchor === "an anchor satisfies, matching every declared value"
  ) {
    if (point.structure?.includes("two members"))
      return { kind: COUNTS, cycles: 1, exampleMembers: 0 };
    if (point.structure?.includes("example"))
      return {
        kind: COUNTS,
        cycles: 0,
        exampleMembers: point.structure.includes("outside") ? 0 : 1,
      };
    return { kind: ORDER, order: "spec:probe.base, spec:probe.design, spec:probe.top" };
  }
  if (
    point.structure === "rest on each other in a chain" &&
    point.outside === "that a component's unit satisfies"
  )
    return {
      kind: DESIGN,
      realized: point.anchor?.startsWith("an anchor satisfies") ? "realized" : "unrealized",
      differing: point.anchor === "an anchor satisfies, with a differing layer and uses" ? 2 : 0,
      unreadable: point.anchor === "an anchor satisfies, with an unreadable layer" ? 1 : 0,
    };
  if (
    point.structure?.includes("decision") &&
    point.anchor === "an anchor holds without satisfying the design"
  ) {
    if (point.outside === "stated below defined") return { kind: HELD, held: "spec:probe.base" };
    return {
      kind: COMPONENTS,
      components:
        point.outside === "that a component's unit satisfies"
          ? "component:probe.dependency, component:probe.designed"
          : "component:probe.designed",
      throughRestsOn: point.outside === "that a component's unit satisfies" ? 1 : 0,
    };
  }
  return unspecified;
}
function observe(world: World): DesignSliceOutcome {
  const answer = required(world.answer);
  switch (world.outcomeKind) {
    case ORDER:
      return {
        kind: ORDER,
        order: [...answer.members]
          .sort((a, b) => a.depth - b.depth)
          .map((row) => row.id)
          .join(", "),
      };
    case COUNTS:
      return {
        kind: COUNTS,
        cycles: answer.totals.cycles,
        exampleMembers: answer.totals.exampleMembers,
      };
    case DESIGN: {
      const design = required(answer.architecture.designs[0]);
      return {
        kind: DESIGN,
        realized: design.realized ? "realized" : "unrealized",
        differing: design.differing.length,
        unreadable: design.unreadable.length,
      };
    }
    case COMPONENTS:
      return {
        kind: COMPONENTS,
        components: answer.architecture.components.map((row) => row.id).join(", "),
        throughRestsOn: required(answer.totals.components.throughRestsOn),
      };
    case OUTSIDE:
      return {
        kind: OUTSIDE,
        outsideComponents: answer.architecture.outside.map((row) => row.id).join(", "),
      };
    case HELD:
      return {
        kind: HELD,
        held: required(
          required(answer.boundary.restsOn).find((row) => row.id === sid("outside")),
        ).holds.join(", "),
      };
    default:
      return unspecified;
  }
}
const adapters = {
  createWorld,
  async invoke(world: World) {
    world.answer = await slice(world.graph);
  },
  observe,
  expected,
  assertions(world: World) {
    const answer = required(world.answer);
    if (world.point.structure === "rest on each other in a chain") {
      expect(answer.scope).toMatchObject({
        pack: "pack:probe.slice",
        subset: false,
        members: [sid("top"), sid("base"), sid("design")],
        unresolved: [],
      });
      for (const member of answer.members) assertMemberKeys(member, true);
      expect(answer.members[0]).toMatchObject({
        statedReadiness: "defined",
        floorReached: "ready",
        statedNextRung: "ready",
        rules: { total: 1, keyed: 1 },
        examples: { total: 0, enabled: 0 },
        verifiers: { total: 0, enabled: 0 },
      });
    }
    if (world.point.structure?.includes("decision")) {
      expect(answer.decisions).toEqual([
        expect.objectContaining({
          id: sid("base"),
          member: true,
          shapes: [sid("top")],
          refines: [],
          supersedes: [],
          supersededBy: [],
          openQuestions: 0,
          blockingQuestions: 0,
        }),
      ]);
    }
    if (world.point.structure?.includes("two members")) {
      expect(answer.members.map((row) => row.depth)).toEqual([1, 1, 1]);
      expect(answer.totals.depth).toBe(1);
    }
    if (
      world.point.structure ===
      "include an example that refines a member and depends on an outside Spec"
    ) {
      expect(answer.boundary.restsOn).toContainEqual(
        expect.objectContaining({
          id: sid("outside"),
          via: [{ type: "dependsOn", members: [sid("top"), sid("base")] }],
        }),
      );
    }
    if (world.point.outside === "that a component's unit satisfies") {
      expect(answer.architecture.outside).toContainEqual(
        expect.objectContaining({
          id: cid("neighbor"),
          anchored: true,
          reachedBy: ["touchedUses", "usesTouched"],
        }),
      );
      expect(answer.architecture.outside.map((row) => row.id)).not.toContain(cid("far"));
      expect(answer.architecture.components.map((row) => row.id)).not.toContain(cid("downstream"));
      expect(answer.architecture.uses).toEqual([
        expect.objectContaining({
          from: cid("dependency"),
          to: cid("neighbor"),
          count: 1,
          outside: true,
          units: [{ from: cid("dependency"), to: cid("neighbor"), claim: "anchored" }],
        }),
        expect.objectContaining({
          from: cid("neighbor"),
          to: cid("dependency"),
          count: 1,
          outside: true,
        }),
      ]);
    }
    if (world.point.anchor === "an anchor satisfies, with a differing layer and uses")
      expect(answer.architecture.outside).toContainEqual({
        id: cid("missing"),
        label: null,
        layer: null,
        context: null,
        anchored: false,
        reachedBy: ["plannedUse"],
      });
    if (world.point.structure === "include an example that refines a member") {
      expect(answer.members.find((row) => row.id === sid("top"))).toMatchObject({
        exampleOf: sid("base"),
        holds: [expect.anything()],
      });
      expect(answer.members.find((row) => row.id === sid("base"))).toMatchObject({
        exampleMembers: [sid("top")],
        holds: [],
      });
    }
    if (world.point.outside === "stated below defined")
      expect(answer.questions).toContainEqual(
        expect.objectContaining({
          spec: sid("outside"),
          origin: "restsOn",
          blocking: true,
          address: `${sid("outside")}#question.contract`,
          holds: [sid("base")],
        }),
      );
  },
};
const outsideComponentsAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.outside-components"),
  verifies: ref("spec:consumers.design-slice.outside-components"),
});
void outsideComponentsAnchor;
registerOutsideComponents(adapters);
const chainAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.chain"),
  verifies: ref("spec:consumers.design-slice.chain"),
});
void chainAnchor;
registerChain(adapters);
const decisionBacklinkAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.decision-backlink"),
  verifies: ref("spec:consumers.design-slice.decision-backlink"),
});
void decisionBacklinkAnchor;
registerDecisionBacklink(adapters);
const dependencyCycleAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.dependency-cycle"),
  verifies: ref("spec:consumers.design-slice.dependency-cycle"),
});
void dependencyCycleAnchor;
registerDependencyCycle(adapters);
const foldedExampleAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.folded-example"),
  verifies: ref("spec:consumers.design-slice.folded-example"),
});
void foldedExampleAnchor;
registerFoldedExample(adapters);
const independentExampleAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.independent-example"),
  verifies: ref("spec:consumers.design-slice.independent-example"),
});
void independentExampleAnchor;
registerIndependentExample(adapters);
const componentAbsentAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.component-absent"),
  verifies: ref("spec:consumers.design-slice.component-absent"),
});
void componentAbsentAnchor;
registerComponentAbsent(adapters);
const componentUnrelatedAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.component-unrelated"),
  verifies: ref("spec:consumers.design-slice.component-unrelated"),
});
void componentUnrelatedAnchor;
registerComponentUnrelated(adapters);
const componentMatchingAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.component-matching"),
  verifies: ref("spec:consumers.design-slice.component-matching"),
});
void componentMatchingAnchor;
registerComponentMatching(adapters);
const componentDifferingAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.component-differing"),
  verifies: ref("spec:consumers.design-slice.component-differing"),
});
void componentDifferingAnchor;
registerComponentDiffering(adapters);
const componentUnreadableAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.component-unreadable"),
  verifies: ref("spec:consumers.design-slice.component-unreadable"),
});
void componentUnreadableAnchor;
registerComponentUnreadable(adapters);
const outsideSatisfiedAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.outside-satisfied"),
  verifies: ref("spec:consumers.design-slice.outside-satisfied"),
});
void outsideSatisfiedAnchor;
registerOutsideSatisfied(adapters);
const outsideUnboundAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.outside-unbound"),
  verifies: ref("spec:consumers.design-slice.outside-unbound"),
});
void outsideUnboundAnchor;
registerOutsideUnbound(adapters);
const outsideHoldingAnchor = specTest({
  id: testAnchorId("test:protocol.design-slice.outside-holding"),
  verifies: ref("spec:consumers.design-slice.outside-holding"),
});
void outsideHoldingAnchor;
registerOutsideHolding(adapters);

describe("design slice composition", () => {
  it("keeps unresolved targets and boundary relation reasons in the recipe answer", async () => {
    const graph = sliceProbe();
    graph.nodes.push(primitive("outside"));
    graph.edges.push(
      link(sid("top"), "dependsOn", sid("outside"), "declared", "outside footing"),
      link(sid("base"), "dependsOn", sid("outside")),
      link(sid("top"), "constrainedBy", sid("missing"), "declared", "unresolved footing"),
    );
    const full = await slice(graph);
    expect(full.structure.unresolved).toEqual([
      { from: sid("top"), to: sid("missing"), type: "constrainedBy", reason: "unresolved footing" },
    ]);
    expect(required(full.boundary.restsOn).find((row) => row.id === sid("outside"))?.via).toEqual([
      {
        type: "dependsOn",
        members: [sid("top"), sid("base")],
        reasons: [{ member: sid("top"), reason: "outside footing" }],
      },
    ]);
    expect(required(full.boundary.restsOn).map((row) => row.id)).not.toContain(sid("missing"));
  });
  it("keeps bindings to unresolved components unplaced rather than touching an invented component", async () => {
    const graph = sliceProbe();
    graph.nodes.push({
      id: "impl:probe.unplaced",
      nodeType: "CodeNode",
      claim: "anchored",
      file: "unplaced.ts",
      line: 1,
    });
    graph.edges.push(
      link("impl:probe.unplaced", "satisfies", sid("top"), "anchored"),
      link("impl:probe.unplaced", "references", sid("base"), "anchored"),
      link("impl:probe.unplaced", "memberOf", cid("missing"), "anchored"),
    );
    const answer = await slice(graph);
    expect(answer.architecture.components).toEqual([]);
    expect(answer.totals.components).toMatchObject({ touched: 0, throughMembers: 0 });
    expect(answer.architecture.unplaced).toEqual([
      { unit: "impl:probe.unplaced", member: sid("top"), via: "satisfies" },
      { unit: "impl:probe.unplaced", member: sid("base"), via: "references" },
    ]);
  });
  it("pins every full and summary row shape to the carrying Design entries", async () => {
    const graph = columnProbe();
    const full = await slice(graph);
    const summary = await slice(graph, { pack: "pack:probe.slice" });
    expect(full.scope).toEqual({
      pack: "pack:probe.slice",
      title: "Probe slice",
      framing: null,
      subset: false,
      members: [sid("top"), sid("base"), sid("design"), sid("choice"), sid("waiting")],
      unresolved: [sid("missing")],
    });
    expect(summary.scope).toEqual(full.scope);
    expect(summary.totals).toEqual(full.totals);
    for (const [answer, detailed] of [
      [full, true],
      [summary, false],
    ] as const) {
      assertKeys(
        answer,
        `scope totals members structure boundary architecture decisions questions${detailed ? "" : " leftOut"}`,
      );
      assertKeys(
        answer.totals,
        "members exampleMembers relations depth cycles heldBelowNextRung waitingForAuthor restsOn holdingOutside restedOnBy verifiedBy supersededBy components designs componentUses decisions decisionsBelowReady openQuestions blockingQuestions",
      );
      assertKeys(
        answer.totals.components,
        "touched throughMembers throughRestsOn throughDesigns outside",
      );
      assertKeys(answer.totals.designs, "total realized matching unrealized differing unreadable");
      assertKeys(answer.totals.componentUses, "inside outside planned");
      for (const row of answer.members) {
        assertMemberKeys(row, detailed);
        assertKeys(row.design, "entries declarations openQuestions blockingQuestions decisions");
        assertKeys(row.rules, "total keyed");
        for (const hold of row.holds as { targets: unknown[] }[]) {
          assertKeys(hold, detailed ? "clauseId description targets" : "clauseId targets");
          for (const target of hold.targets)
            if (detailed) assertKeys(target, "type id statedReadiness");
            else expect(typeof target).toBe("string");
        }
        if (detailed) {
          assertKeys(row.examples, "total enabled");
          assertKeys(row.verifiers, "total enabled");
        }
      }
      for (const rows of Object.values(answer.boundary)) {
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows)
          assertKeys(
            row,
            detailed
              ? "id title specKind statedReadiness floorReached implemented via holds"
              : "id statedReadiness holds",
          );
      }
      for (const row of answer.decisions)
        assertKeys(
          row,
          detailed
            ? "id title statedReadiness floorReached member shapes refines supersedes supersededBy openQuestions blockingQuestions"
            : "id statedReadiness member shapes",
        );
      for (const row of answer.questions)
        assertKeys(
          row,
          detailed || row.blocking
            ? "address spec origin index question blocking deferral decider links provisional trigger holds"
            : "address spec index",
        );
      assertKeys(answer.architecture, "components designs uses plannedUses outside unplaced");
      for (const row of answer.architecture.components)
        assertKeys(
          row,
          detailed
            ? "id label layer context members restsOn designs"
            : "id layer context members restsOn designs",
        );
      for (const row of answer.architecture.designs)
        assertKeys(
          row,
          detailed
            ? "spec componentId layer context role uses anchorExists realized differing unreadable"
            : "spec componentId anchorExists realized differing unreadable",
        );
      for (const row of answer.architecture.plannedUses) assertKeys(row, "design from to outside");
      for (const row of answer.architecture.outside)
        assertKeys(
          row,
          detailed ? "id label layer context anchored reachedBy" : "id anchored reachedBy",
        );
      for (const row of answer.architecture.unplaced) assertKeys(row, "unit member via");
      for (const row of answer.structure.edges)
        assertKeys(
          row,
          detailed && row.reason !== undefined
            ? "from to type orders reason"
            : "from to type orders",
        );
    }
    const touched = createWorld({
      structure: "rest on each other in a chain",
      outside: "that a component's unit satisfies",
      anchor: "an anchor satisfies, matching every declared value",
    });
    for (const detail of [true, false]) {
      const answer = await slice(touched.graph, { pack: "pack:probe.slice", detail });
      expect(answer.architecture.uses.length).toBeGreaterThan(0);
      for (const row of answer.architecture.uses) {
        assertKeys(row, detail ? "from to count outside units" : "from to count outside");
        if (detail) for (const unit of row.units) assertKeys(unit, "from to claim");
      }
      const narrowed = await slice(graph, {
        pack: "pack:probe.slice",
        members: [sid("top")],
        detail,
      });
      for (const row of required(narrowed.boundary.restsOn))
        assertKeys(
          row,
          detail
            ? "id title specKind statedReadiness floorReached implemented via holds inPack"
            : "id statedReadiness holds inPack",
        );
    }
  });
  it("reports outside holds, waiting statements, decision replacements and own-Spec question holds", async () => {
    const graph = columnProbe();
    const full = await slice(graph);
    const summary = await slice(graph, { pack: "pack:probe.slice" });
    expect(full.totals).toMatchObject({
      holdingOutside: 1,
      decisionsBelowReady: 1,
      heldBelowNextRung: 4,
      waitingForAuthor: 1,
      supersededBy: 1,
    });
    const pack = await catalogRecipe<{
      totals: { heldBelowNextRung: number; waitingForAuthor: number };
    }>(29, graph, { pack: "pack:probe.slice", detail: true });
    expect(full.totals).toMatchObject({
      heldBelowNextRung: pack.totals.heldBelowNextRung,
      waitingForAuthor: pack.totals.waitingForAuthor,
    });
    expect(full.decisions).toEqual([
      expect.objectContaining({
        id: sid("choice"),
        supersedes: [sid("old")],
        supersededBy: [sid("new")],
        shapes: [sid("top")],
      }),
    ]);
    expect(summary.decisions).toEqual([
      { id: sid("choice"), statedReadiness: "scoped", member: true, shapes: 1 },
    ]);
    expect(full.questions.find((row) => row.spec === sid("choice") && row.blocking)).toEqual({
      address: `${sid("choice")}#question.contract`,
      spec: sid("choice"),
      origin: "member",
      index: 0,
      question: "Which contract?",
      blocking: true,
      deferral: true,
      decider: "owner",
      links: [sid("base")],
      provisional: "Use the base.",
      trigger: "The contract is chosen.",
      holds: [sid("choice"), sid("top")],
    });
    expect(summary.questions.find((row) => row.spec === sid("choice") && !row.blocking)).toEqual({
      address: null,
      spec: sid("choice"),
      index: 1,
    });
    expect(full.boundary.supersededBy).toEqual([
      expect.objectContaining({
        id: sid("new"),
        holds: [],
        via: [{ type: "supersedes", members: [sid("choice")] }],
      }),
    ]);
    expect(full.members.find((row) => row.id === sid("base"))).toMatchObject({
      examples: { total: 2, enabled: 1 },
      verifiers: { total: 3, enabled: 2 },
    });
  });
  it.each([
    ["rest on each other in a chain", "setDepth[index] = 1;"],
    ["include a decision that refines the member it shapes", "setDepth[index] = 1;"],
    ["include a decision that refines the member it shapes", "edge.orders = true;"],
  ] as const)(
    "the executable order observation rejects %s with %s",
    async (structure, mutation) => {
      const world = createWorld({
        structure,
        outside: "that no code satisfies",
        anchor: "an anchor satisfies, matching every declared value",
      });
      const body = required(
        recipeFiles(
          readFileSync(new URL("../docs/agent-surface/recipes.md", import.meta.url), "utf8"),
        ).find((row) => row.ordinal === 54),
      ).content;
      const mutated = mutation.startsWith("setDepth")
        ? body.replace("setDepth[index] = deepest + 1;", mutation)
        : body.replace(
            'edge.orders = !(edge.type === "refines" && names(edge.to, edge.from, typed.slice(1)));',
            mutation,
          );
      expect(mutated).not.toBe(body);
      world.answer = (await evaluateBody(mutated, {
        graph: world.graph,
        params: { pack: "pack:probe.slice", detail: true },
      })) as Slice;
      expect(observe(world)).not.toEqual(expected(world.point));
    },
  );
  it.each([
    ["rest on each other in a chain", "scope"],
    ["rest on each other in a chain", "memberColumns"],
    ["include a decision that refines the member it shapes", "decisionsInScope"],
    ["include an example that refines a member and depends on an outside Spec", "boundary"],
    ["include two members that depend on each other", "depth"],
  ] as const)(
    "the executable assertions reject missing %s evidence for %s",
    async (structure, rule) => {
      const world = createWorld({
        structure,
        outside: "that no code satisfies",
        anchor: "an anchor satisfies, matching every declared value",
      });
      world.answer = await slice(world.graph);
      if (rule === "scope") world.answer.scope.members = [];
      if (rule === "memberColumns") delete (world.answer.members[0] as Partial<Member>).rules;
      if (rule === "decisionsInScope") world.answer.decisions = [];
      if (rule === "boundary") world.answer.boundary.restsOn = [];
      if (rule === "depth") for (const row of world.answer.members) row.depth = 7;
      expect(() => {
        adapters.assertions(world);
      }).toThrow();
    },
  );
  it("counts only example-kind declared verifiers as examples, keeping all verifiers", async () => {
    const graph = sliceProbe();
    graph.nodes.push(
      primitive("enabled", { specKind: "example" }),
      primitive("disabled", { specKind: "example" }),
      primitive("behavior-verifier"),
      {
        id: "test:probe.enabled",
        nodeType: "Anchor",
        claim: "anchored",
        file: "enabled.test.ts",
        line: 1,
      },
      {
        id: "test:probe.direct",
        nodeType: "Anchor",
        claim: "anchored",
        file: "direct.test.ts",
        line: 1,
      },
    );
    for (const name of ["enabled", "disabled", "behavior-verifier"])
      graph.edges.push(link(sid(name), "verifies", sid("base")));
    graph.edges.push(
      link("test:probe.enabled", "verifies", sid("enabled"), "anchored"),
      link("test:probe.direct", "verifies", sid("base"), "anchored"),
    );
    const answer = await slice(graph);
    const pack = await catalogRecipe<{
      members: { id: string; examples: unknown; verifiers: unknown }[];
    }>(29, graph, { pack: "pack:probe.slice", detail: true });
    const member = required(answer.members.find((row) => row.id === sid("base")));
    expect(member.examples).toEqual({ total: 2, enabled: 1 });
    expect(member.verifiers).toEqual({ total: 4, enabled: 2 });
    expect(member.examples).toEqual(
      required(pack.members.find((row) => row.id === sid("base"))).examples,
    );
  });
  it("names the hold detail and decision shape lists the summary omits", async () => {
    const summary = await slice(sliceProbe(), { pack: "pack:probe.slice" });
    expect(summary.leftOut?.[0]).toMatch(/hold descriptions.*target types.*rungs/u);
    expect(summary.leftOut?.[7]).toMatch(/shaped member ids.*count kept/u);
  });
  it("summarizes component and design rows without losing totals", async () => {
    const world = createWorld({
      structure: "rest on each other in a chain",
      outside: "that a component's unit satisfies",
      anchor: "an anchor satisfies, matching every declared value",
    });
    const full = await slice(world.graph);
    const summary = await slice(world.graph, { pack: "pack:probe.slice" });
    expect(summary.totals).toEqual(full.totals);
    expect(summary.architecture.components).toEqual([
      {
        id: cid("dependency"),
        layer: "domain",
        context: "probe",
        members: { satisfies: 0, references: 0 },
        restsOn: 1,
        designs: 0,
      },
      {
        id: cid("designed"),
        layer: "domain",
        context: "probe",
        members: { satisfies: 1, references: 0 },
        restsOn: 0,
        designs: 1,
      },
    ]);
    expect(summary.architecture.designs).toEqual([
      {
        spec: sid("design"),
        componentId: cid("designed"),
        anchorExists: true,
        realized: true,
        differing: 0,
        unreadable: 0,
      },
    ]);
    expect(summary.architecture.outside).toEqual([
      { id: cid("neighbor"), anchored: true, reachedBy: ["touchedUses", "usesTouched"] },
    ]);
    for (const pair of summary.architecture.uses) expect(pair).not.toHaveProperty("units");
  });
  it("keeps all binding paths, unplaced units, pair counts and planned uses apart", async () => {
    const graph = sliceProbe();
    graph.nodes.push(
      component("local"),
      component("outside"),
      primitive("design", {
        specKind: "model",
        sections: {
          design: {
            id: cid("local"),
            uses: `${cid("local")}, ${cid("future")}, ${cid("missing")}`,
          },
        },
      }),
      primitive("future", { specKind: "model", sections: { design: { id: cid("future") } } }),
    );
    for (const name of ["one", "two", "bare"])
      graph.nodes.push({
        id: `impl:probe.${name}`,
        nodeType: "CodeNode",
        claim: "anchored",
        file: `${name}.ts`,
        line: 1,
      });
    graph.edges.push(
      link("impl:probe.one", "memberOf", cid("local"), "anchored"),
      link("impl:probe.two", "memberOf", cid("local"), "anchored"),
      link("impl:probe.one", "satisfies", sid("top"), "anchored"),
      link("impl:probe.two", "references", sid("base"), "anchored"),
      link("impl:probe.bare", "references", sid("top"), "anchored"),
      link(cid("local"), "satisfies", sid("design"), "anchored"),
      link("impl:probe.one", "uses", cid("outside"), "anchored"),
      link("impl:probe.two", "uses", cid("outside"), "anchored"),
      link("impl:probe.one", "uses", "impl:probe.two", "anchored"),
    );
    setMembers(graph, ["top", "base", "design", "future"]);
    const answer = await slice(graph);
    expect(answer.architecture.components).toEqual([
      expect.objectContaining({
        id: cid("local"),
        members: { satisfies: [sid("top"), sid("design")], references: [sid("base")] },
        restsOn: [],
        designs: [sid("design")],
      }),
    ]);
    expect(answer.architecture.unplaced).toEqual([
      { unit: "impl:probe.bare", member: sid("top"), via: "references" },
    ]);
    expect(answer.architecture.uses).toEqual([
      {
        from: cid("local"),
        to: cid("outside"),
        count: 2,
        outside: true,
        units: [
          { from: "impl:probe.one", to: cid("outside"), claim: "anchored" },
          { from: "impl:probe.two", to: cid("outside"), claim: "anchored" },
        ],
      },
    ]);
    expect(answer.architecture.plannedUses).toEqual([
      { design: sid("design"), from: cid("local"), to: cid("future"), outside: false },
      { design: sid("design"), from: cid("local"), to: cid("missing"), outside: true },
    ]);
    expect(answer.totals.componentUses).toEqual({ inside: 0, outside: 1, planned: 2 });
    expect(answer.members[0]).toMatchObject({
      implementedBy: ["impl:probe.one"],
      referencedBy: ["impl:probe.bare"],
      components: [cid("local")],
    });
  });
  it("reads outside decisions and orders their questions before non-blocking member questions", async () => {
    const graph = sliceProbe();
    graph.nodes.push(
      primitive("choice", {
        specKind: "decision",
        readiness: "scoped",
        sections: {
          intent: {
            outcome: "Choose the shared contract.",
            openQuestions: [
              { key: "choice", question: "Which contract?", blocking: true, decider: "owner" },
              { question: "Which label?", blocking: false },
            ],
          },
          decision: { context: "A contract is unsettled.", decision: "Choose it together." },
        },
      }),
    );
    graph.nodes[0] = primitive("base", {
      sections: {
        intent: {
          outcome: "Read the base.",
          openQuestions: [{ question: "Which spelling?", blocking: false }],
        },
        behavior: {
          rules: ["Read the base."],
          flows: ["Read before returning."],
          ruleKeys: { read: "rules[0]" },
        },
      },
    });
    graph.edges.push(
      link(sid("top"), "decidedBy", sid("choice")),
      link(sid("choice"), "refines", sid("top")),
    );
    const answer = await slice(graph);
    expect(answer.decisions).toEqual([
      expect.objectContaining({
        id: sid("choice"),
        member: false,
        shapes: [sid("top")],
        refines: [],
        openQuestions: 2,
        blockingQuestions: 1,
      }),
    ]);
    expect(answer.questions[0]).toMatchObject({
      spec: sid("choice"),
      origin: "decision",
      holds: [sid("top")],
      address: `${sid("choice")}#question.choice`,
    });
    const coverage = await catalogRecipe<{ totals: { keyedRules: number; unkeyedRules: number } }>(
      34,
      graph,
      { spec: sid("base") },
    );
    expect(answer.members[1]?.rules).toEqual({
      total: coverage.totals.keyedRules + coverage.totals.unkeyedRules,
      keyed: coverage.totals.keyedRules,
    });
  });
  it.each([
    {
      layer: "`domain` explanation",
      context: "``probe`` explanation",
      role: "service",
      uses: "`none` explanation",
    },
    { layer: "Domain", context: "Bad", role: "bad_role", uses: "component:probe.bad, invalid" },
    { uses: "component:probe.z, component:probe.a, component:probe.z" },
    {},
  ])("reads declared values with the realization comparison grammar: %j", async (entries) => {
    const graph = designProbe("an anchor holds without satisfying the design");
    graph.nodes = graph.nodes.map((node) =>
      node.id === sid("design") && node.nodeType === "Primitive"
        ? {
            ...node,
            sections: { design: { id: "``component:probe.designed`` rationale", ...entries } },
          }
        : node,
    );
    const answer = await slice(graph);
    const comparison = await catalogRecipe<{
      unrealized: { layer: unknown; context: unknown; role: unknown; uses: unknown }[];
      unreadable: { key: string; value: unknown }[];
    }>(43, graph);
    const { layer, context, role, uses } = required(comparison.unrealized[0]);
    expect(answer.architecture.designs[0]).toMatchObject({ layer, context, role, uses });
    expect(answer.architecture.designs[0]?.unreadable).toEqual(
      comparison.unreadable.map(({ key, value }) => ({ key, value })),
    );
  });
});

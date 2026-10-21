import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  ContextBundleConditions,
  ContextBundleOutcome,
} from "../generated/contracts/consumers.context-bundle.space.js";
import { partsCoverThePackContract } from "../generated/contracts/consumers.context-bundle.parts-cover-the-pack.contract.js";
import { oversizedMemberNamedContract } from "../generated/contracts/consumers.context-bundle.oversized-member-named.contract.js";
import { schemaVersion } from "../src/index.js";
import type { GraphSchema, PrimitiveNode } from "../src/index.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { catalogRecipe, shippedRecipe } from "./helpers/recipe-probe.js";
import { registerPartsCoverThePack } from "./consumers.context-bundle.parts-cover-the-pack.test.generated.js";
import { registerOversizedMemberNamed } from "./consumers.context-bundle.oversized-member-named.test.generated.js";

const PARTS = "the bundle comes in {parts} parts, each within the budget";
const COMPLETE =
  "the members of the parts, in part order, are the Pack's members in authored order, each once: {complete}";
const OVERSIZED = "the answer names the oversized items {oversizedItems}";
const ids = ["spec:probe.one", "spec:probe.two", "spec:probe.three"];
interface BundlePart {
  scope: unknown;
  budget: number;
  declarations: string;
  part: { index: number; of: number };
  used: number;
  tokenEstimate: { value: number; method: string };
  leftOut: string[];
  pack: unknown;
  members: { id: string; narrative: string | null; sections: Record<string, unknown> }[];
  boundary: unknown;
}
interface Oversized {
  part: { index: number; of: null };
  budgetExceeded: true;
  oversized: { item: string; length: number }[];
  leftOut: string[];
}
interface World {
  point: Partial<ContextBundleConditions>;
  parts: BundlePart[];
  exceeded?: Oversized;
}

const partsOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.context-bundle-parts"),
  models: ref("spec:consumers.context-bundle"),
});
void partsOracleAnchor;
function expected(point: Partial<ContextBundleConditions>): ContextBundleOutcome {
  if (point.budget !== 10000) return unspecified;
  switch (point.sizes) {
    case "while each member fits a part alone":
      return { kind: PARTS, parts: 3 };
    case "and one member carries a blocking question longer than the budget":
      return { kind: OVERSIZED, oversizedItems: "spec:probe.two" };
    default:
      return unspecified;
  }
}
async function invoke(world: World) {
  const root = mkdtempSync(join(tmpdir(), "sdp-bundle-parts-"));
  try {
    const oversized =
      world.point.sizes === "and one member carries a blocking question longer than the budget";
    for (const [index, id] of ids.entries()) {
      writeFileSync(
        join(root, `${String(index)}.sdp.md`),
        `---\nid: ${id}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe ${String(index)}\n\n${"a".repeat(oversized ? 10 : 6000)}\n\n## Intent\n- outcome: Read the whole Pack in parts.\n${oversized && index === 1 ? `\n### Open questions\n- [blocking] ${"q".repeat(12000)}\n` : ""}`,
      );
    }
    writeFileSync(
      join(root, "probe.pack.sdp.md"),
      `---\nid: pack:probe.parts\nspecs:\n${ids.map((id) => `  - ${id}`).join("\n")}\n---\n# Probe parts\n\nThe whole probe.\n`,
    );
    const params = { pack: "pack:probe.parts", budget: world.point.budget, part: 1 };
    const first = await shippedRecipe<BundlePart | Oversized>(
      "36-the-context-bundle.js",
      root,
      params,
    );
    if ("budgetExceeded" in first) {
      world.exceeded = first;
      return;
    }
    expect(first.part).toBeDefined();
    world.parts.push(first);
    for (let part = 2; part <= first.part.of; part += 1)
      world.parts.push(
        await shippedRecipe<BundlePart>("36-the-context-bundle.js", root, { ...params, part }),
      );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function observe(world: World): ContextBundleOutcome {
  return world.exceeded === undefined
    ? { kind: PARTS, parts: world.parts.length }
    : {
        kind: OVERSIZED,
        oversizedItems: world.exceeded.oversized.map((row) => row.item).join(", "),
      };
}

const partsCoverThePackAnchor = specTest({
  id: testAnchorId("test:protocol.context-bundle.parts-cover-the-pack"),
  verifies: ref("spec:consumers.context-bundle.parts-cover-the-pack"),
});
void partsCoverThePackAnchor;
registerPartsCoverThePack({
  createWorld: (point): World => ({ point, parts: [] }),
  invoke,
  observe,
  expected,
  assertions(world) {
    expect(world.parts).toHaveLength(paramsForStep(partsCoverThePackContract, PARTS).parts);
    expect(world.parts.flatMap((part) => part.members.map((member) => member.id))).toEqual(ids);
    expect(paramsForStep(partsCoverThePackContract, COMPLETE).complete).toBe(true);
    for (const [index, part] of world.parts.entries()) {
      expect(part.part).toEqual({ index: index + 1, of: 3 });
      expect(part.used).toBe(JSON.stringify(part).length);
      expect(part.used).toBeLessThanOrEqual(part.budget);
      expect(part.tokenEstimate.value).toBe(Math.ceil(part.used / 4));
      expect(part.scope).toEqual({ pack: "pack:probe.parts", subset: false, members: ids });
      expect(part.budget).toBe(10000);
      expect(part.declarations).toBe("whole");
      expect(part.pack).toEqual({
        id: "pack:probe.parts",
        title: "Probe parts",
        framing: "The whole probe.",
      });
      expect(part.leftOut).toEqual([]);
      expect(part.boundary === null).toBe(index !== 0);
    }
  },
});

const oversizedMemberNamedAnchor = specTest({
  id: testAnchorId("test:protocol.context-bundle.oversized-member-named"),
  verifies: ref("spec:consumers.context-bundle.oversized-member-named"),
});
void oversizedMemberNamedAnchor;
registerOversizedMemberNamed({
  createWorld: (point): World => ({ point, parts: [] }),
  invoke,
  observe,
  expected,
  assertions(world) {
    expect(world.parts).toEqual([]);
    expect(world.exceeded).toMatchObject({
      part: { index: 1, of: null },
      budgetExceeded: true,
      oversized: [{ item: paramsForStep(oversizedMemberNamedContract, OVERSIZED).oversizedItems }],
    });
    expect(world.exceeded?.oversized[0]?.length).toBeGreaterThan(10000);
    expect(world.exceeded).not.toHaveProperty("members");
  },
});

function graphOf(count = 3, narrativeSize = 6000): GraphSchema {
  const nodes: PrimitiveNode[] = Array.from({ length: count }, (_, index) => ({
    id: `spec:probe.m${String(index).padStart(2, "0")}`,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "story",
    readiness: "idea",
    title: "Probe",
    file: "probe.sdp.md",
    narrative: "a".repeat(narrativeSize),
    sections: { intent: { outcome: "Probe" } },
  }));
  return { schemaVersion, nodes, edges: [] };
}
function scopeOf(graph: GraphSchema) {
  return { specs: graph.nodes.map((node) => node.id) };
}

describe("bundle part budgets", () => {
  it.each([0, -1, 1.5, null, "1", true])("diagnoses invalid part %j", async (part) => {
    const graph = graphOf();
    expect(await catalogRecipe(36, graph, { ...scopeOf(graph), part })).toEqual({
      diagnostics: [{ scope: "part", problem: "Expected a positive integer." }],
    });
  });
  it("diagnoses a part beyond the final count", async () => {
    const graph = graphOf();
    expect(await catalogRecipe(36, graph, { ...scopeOf(graph), budget: 10000, part: 4 })).toEqual({
      diagnostics: [{ scope: "part", problem: "The bundle has 3 parts." }],
    });
  });
  it("accepts an exact whole-part budget and cuts only when that item cannot fit", async () => {
    const graph = graphOf(1);
    const whole = await catalogRecipe<BundlePart>(36, graph, { ...scopeOf(graph), part: 1 });
    const separated = await catalogRecipe<BundlePart>(36, graph, {
      ...scopeOf(graph),
      budget: whole.used - 10,
      part: 2,
    });
    expect(separated.part.of).toBe(2);
    const exact = await catalogRecipe<BundlePart>(36, graph, {
      ...scopeOf(graph),
      budget: separated.used,
      part: 2,
    });
    const repeat = await catalogRecipe<BundlePart>(36, graph, {
      ...scopeOf(graph),
      budget: exact.used,
      part: 2,
    });
    expect(repeat.used).toBe(exact.used);
    const cut = await catalogRecipe<BundlePart>(36, graph, {
      ...scopeOf(graph),
      budget: repeat.used - 1,
      part: 1,
    });
    expect(cut.leftOut).toEqual([
      "Boundary details; ids kept per direction.",
      "Footing details; ids kept per relation type.",
      "Member narrative.",
    ]);
    expect(cut.members[0]?.narrative).toBeNull();
  });
  it("measures two-digit part counts and takes the longest whole run at every boundary", async () => {
    const graph = graphOf(12, 2200);
    const params = { ...scopeOf(graph), budget: 4000 };
    const first = await catalogRecipe<BundlePart>(36, graph, { ...params, part: 1 });
    expect(first.part.of).toBe(12);
    const parts = [first];
    for (let part = 2; part <= first.part.of; part += 1)
      parts.push(await catalogRecipe<BundlePart>(36, graph, { ...params, part }));
    expect(parts.flatMap((part) => part.members.map((member) => member.id))).toEqual(
      graph.nodes.map((node) => node.id),
    );
    for (const [index, part] of parts.entries()) {
      expect(part.used).toBe(JSON.stringify(part).length);
      expect(part.used).toBeLessThanOrEqual(4000);
      expect(part.leftOut).toEqual([]);
      const next = parts[index + 1];
      if (next !== undefined)
        expect(
          JSON.stringify({ ...part, members: [...part.members, ...next.members.slice(0, 1)] })
            .length,
        ).toBeGreaterThan(4000);
    }
  });
  it("repartitions at the first common cut stage instead of mixing cut and whole members", async () => {
    const graph = graphOf(3, 12000);
    const result = await catalogRecipe<BundlePart>(36, graph, {
      ...scopeOf(graph),
      budget: 4000,
      part: 1,
    });
    expect(result.part).toEqual({ index: 1, of: 1 });
    expect(result.members).toHaveLength(3);
    expect(result.members.every((member) => member.narrative === null)).toBe(true);
    expect(result.leftOut).toHaveLength(3);
    expect(result.used).toBe(JSON.stringify(result).length);
  });
  it("preserves pinned declarations until addresses are allowed, and never returns a partial part", async () => {
    const graph = graphOf(1, 0);
    const member = graph.nodes[0];
    if (member?.nodeType !== "Primitive") throw new Error("Expected the probe member.");
    const pinned = {
      ...graph,
      nodes: [
        {
          ...member,
          sections: {
            ...member.sections,
            design: { signature: `\`LargeDeclaration\` ${"x".repeat(12000)}` },
          },
        },
      ],
    };
    const params = { ...scopeOf(graph), budget: 4000, part: 1 };
    const whole = await catalogRecipe<Oversized>(36, pinned, params);
    expect(whole.oversized.map((row) => row.item)).toEqual([member.id]);
    expect(whole).not.toHaveProperty("members");
    const reduced = await catalogRecipe<BundlePart>(36, pinned, {
      ...params,
      declarations: "addresses",
    });
    expect(reduced.leftOut).toHaveLength(7);
    expect(reduced.members[0]?.sections.design).toEqual({
      signature: `${member.id}#design.signature`,
    });
    expect(reduced.used).toBeLessThanOrEqual(4000);
  });
  it("gives an empty scope one complete part when it fits", async () => {
    const empty: GraphSchema = { schemaVersion, nodes: [], edges: [] };
    expect(await catalogRecipe(36, empty, { specs: [], part: 1 })).toMatchObject({
      part: { index: 1, of: 1 },
      members: [],
      boundary: { restsOn: [], restedOnBy: [], verifiedBy: [], supersededBy: [] },
    });
  });
  it("names every item when the repeated Pack framing alone exceeds the budget", async () => {
    const members = graphOf(2, 0);
    const graph: GraphSchema = {
      ...members,
      nodes: [
        ...members.nodes,
        {
          id: "pack:probe.framing",
          nodeType: "Pack",
          claim: "declared",
          members: members.nodes.map((node) => node.id),
          file: "framing.pack.sdp.md",
          framing: "p".repeat(12000),
        },
      ],
    };
    const result = await catalogRecipe<Oversized>(36, graph, {
      pack: "pack:probe.framing",
      budget: 10000,
      part: 1,
    });
    expect(result).toMatchObject({ budgetExceeded: true, part: { index: 1, of: null } });
    expect(result.oversized.map((row) => row.item)).toEqual([
      "boundary",
      ...members.nodes.map((node) => node.id),
    ]);
    for (const row of result.oversized) expect(row.length).toBeGreaterThan(12000);
    expect(result).not.toHaveProperty("members");
    expect(result).not.toHaveProperty("boundary");
  });
  it("names an oversized boundary when its outside neighbour ids exceed the budget after every cut", async () => {
    const neighbours = graphOf(601, 0);
    const member = neighbours.nodes[0];
    if (member === undefined) throw new Error("Expected the probe member.");
    const graph: GraphSchema = {
      ...neighbours,
      edges: neighbours.nodes.slice(1).map((node) => ({
        from: node.id,
        type: "dependsOn",
        to: member.id,
        claim: "declared",
      })),
    };
    const result = await catalogRecipe<Oversized>(36, graph, {
      specs: [member.id],
      budget: 10000,
      part: 1,
    });
    expect(result).toMatchObject({ budgetExceeded: true, part: { index: 1, of: null } });
    expect(result.oversized.map((row) => row.item)).toEqual(["boundary"]);
    expect(result.oversized[0]?.length).toBeGreaterThan(10000);
    expect(result.leftOut).toHaveLength(6);
    expect(result).not.toHaveProperty("members");
    expect(result).not.toHaveProperty("boundary");
  });
});

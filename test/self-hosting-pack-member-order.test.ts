import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { manifestOrderKeptContract } from "../generated/contracts/extraction.pack-member-order.manifest-order-kept.contract.js";
import type {
  PackMemberOrderConditions,
  PackMemberOrderOutcome,
} from "../generated/contracts/extraction.pack-member-order.space.js";
import {
  createReader,
  extract,
  renderDesignReview,
  serializeGraph,
  validateGraph,
} from "../src/index.js";
import type { GraphSchema, PackContext, PackNode } from "../src/index.js";
import { deriveGraph } from "../src/extract/derive.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerManifestOrderKept } from "./extraction.pack-member-order.manifest-order-kept.test.generated.js";

const PACK_ID = "pack:probe.order";
const MEMBERS_STEP = "the serialized Pack node lists the members {serializedMembers}";
const EDGES_STEP = "the serialized belongsTo edges run from {edgeSources}";
const READER_STEP = "the reader's Pack context lists the members {readerMembers}";
const VERSION_STEP = "the payload declares the schema version {schemaVersion}";
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

interface World {
  readonly root: string;
  readonly members: readonly string[];
  graph?: GraphSchema;
  context?: PackContext;
  pack?: PackNode;
  page?: string;
}

function createWorld(point: Partial<PackMemberOrderConditions>): World {
  const root = mkdtempSync(join(tmpdir(), "sdp-pack-order-"));
  roots.push(root);
  const members = point.manifestOrder?.split(", ") ?? [];
  writeFileSync(
    join(root, "order.pack.sdp.md"),
    `---\nid: ${PACK_ID}\nspecs: ${JSON.stringify(members)}\n---\n# Probe member order\n`,
  );
  for (const id of new Set(members)) {
    writeFileSync(
      join(root, `${id.slice("spec:".length)}.sdp.md`),
      `---\nid: ${id}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# ${id}\n\n## Intent\n- outcome: Keep manifest member order.\n`,
    );
  }
  return { root, members };
}

function invoke(world: World): void {
  const result = extract({ root: world.root });
  const serialized = serializeGraph(result.graph);
  world.graph = JSON.parse(serialized) as GraphSchema;
  world.pack = world.graph.nodes.find((node): node is PackNode => node.nodeType === "Pack");
  const reader = createReader(world.graph);
  world.context = reader.packContext(PACK_ID);
  world.page = renderDesignReview(reader).find(
    (page) => page.path === "pack/probe.order.md",
  )?.content;
  expect(serializeGraph(extract({ root: world.root }).graph)).toBe(serialized);
  expect(
    validateGraph(result.graph).findings.filter((finding) => finding.severity === "error"),
  ).toHaveLength(world.members.length === new Set(world.members).size ? 0 : 1);
}

function observe(world: World): PackMemberOrderOutcome {
  return { kind: MEMBERS_STEP, serializedMembers: world.pack?.members.join(", ") ?? "" };
}

function expected(point: Partial<PackMemberOrderConditions>): PackMemberOrderOutcome {
  return point.manifestOrder === undefined
    ? unspecified
    : { kind: MEMBERS_STEP, serializedMembers: point.manifestOrder };
}

function assertOrder(world: World): void {
  expect(world.pack?.members).toEqual(world.members);
  expect(world.context?.members.map((member) => member.id)).toEqual(world.members);
  expect(world.context?.verifierGaps.map((gap) => gap.id)).toEqual(world.members);
  const page = world.page ?? "";
  const tableIds = [...page.matchAll(/^\| \[`(spec:[^`]+)`\]/gm)].map((match) => match[1]);
  const gapIds = [...page.matchAll(/^- \[`(spec:[^`]+)`\]/gm)].map((match) => match[1]);
  expect(tableIds).toEqual(world.members);
  expect(gapIds).toEqual(world.members);
  expect(world.graph?.nodes.map((node) => node.id)).toEqual(
    [PACK_ID, ...new Set(world.members)].sort(),
  );
  expect(world.graph?.edges.map((edge) => edge.from)).toEqual([...world.members].sort());
  expect(Object.keys(world.pack ?? {})).toEqual([
    "id",
    "nodeType",
    "claim",
    "title",
    "file",
    "members",
  ]);
}

const packMemberOrderTestAnchor = specTest({
  id: testAnchorId("test:protocol.pack-member-order"),
  label: "verifies manifest order in the graph, reader and Pack page",
  verifies: ref("spec:extraction.pack-member-order.manifest-order-kept"),
});
void packMemberOrderTestAnchor;
registerManifestOrderKept({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertOrder(world);
    expect(world.pack?.members.join(", ")).toBe(
      paramsForStep(manifestOrderKeptContract, MEMBERS_STEP).serializedMembers,
    );
    expect(world.graph?.edges.map((edge) => edge.from).join(", ")).toBe(
      paramsForStep(manifestOrderKeptContract, EDGES_STEP).edgeSources,
    );
    expect(world.context?.members.map((member) => member.id).join(", ")).toBe(
      paramsForStep(manifestOrderKeptContract, READER_STEP).readerMembers,
    );
    expect(world.graph?.schemaVersion).toBe(
      paramsForStep(manifestOrderKeptContract, VERSION_STEP).schemaVersion,
    );
  },
});

describe("Pack member order", () => {
  it("keeps repeated members in the graph, reader, member table and gap list", () => {
    const world = createWorld({
      manifestOrder: "spec:probe.zeta, spec:probe.alpha, spec:probe.zeta, spec:probe.mid",
    });
    // Markdown refuses duplicate manifest entries before graph derivation. The TS carrier
    // lets the graph's existing pack-coherence check report the repeated belongsTo edge.
    rmSync(join(world.root, "order.pack.sdp.md"));
    writeFileSync(
      join(world.root, "order.pack.sdp.ts"),
      `import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";
export const order = pack({ id: packId("${PACK_ID}"), title: "Probe member order", specs: [${world.members.map((id) => `ref("${id}")`).join(", ")}] });
`,
    );
    invoke(world);
    assertOrder(world);
    expect(validateGraph(extract({ root: world.root }).graph).findings).toMatchObject([
      {
        validatorId: "conformance/pack-coherence",
        severity: "error",
        subjectId: PACK_ID,
        relatedId: "spec:probe.zeta",
      },
    ]);
  });

  it("carries an empty members list for an empty manifest", () => {
    const world = createWorld({});
    invoke(world);
    assertOrder(world);
  });

  it.each([undefined, "not an array"])("derives empty members when specs is %s", (specs) => {
    const graph = deriveGraph(
      [],
      [{ id: PACK_ID, file: "order.pack.sdp.md", line: 1, data: { specs } }],
      [],
    );
    expect(graph.nodes).toMatchObject([{ id: PACK_ID, members: [] }]);
  });

  it("serializes framing, file, members and modelRefs in the ruled field order", () => {
    const graph = deriveGraph(
      [],
      [
        {
          id: PACK_ID,
          file: "order.pack.sdp.md",
          line: 1,
          data: {
            title: "Order",
            framing: "Read in order.",
            specs: ["spec:probe.zeta", "spec:probe.alpha"],
            modelRefs: ["spec:probe.alpha"],
          },
        },
      ],
      [],
    );
    const pack = (JSON.parse(serializeGraph(graph)) as GraphSchema).nodes[0];
    expect(Object.keys(pack ?? {})).toEqual([
      "id",
      "nodeType",
      "claim",
      "title",
      "framing",
      "file",
      "members",
      "modelRefs",
    ]);
  });
});

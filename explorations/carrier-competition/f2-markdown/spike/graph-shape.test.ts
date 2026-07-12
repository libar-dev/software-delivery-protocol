import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

import {
  SPEC_ALTITUDES,
  SPEC_KINDS,
  SPEC_READINESS,
  SPEC_RELATION_TYPES,
  buildGraphIndex,
  evaluateReadinessFloor,
  generateContracts,
  serializeGraph,
} from "@libar-dev/software-delivery-protocol";
import type {
  GraphEdge,
  GraphNode,
  GraphSchema,
  PrimitiveNode,
} from "@libar-dev/software-delivery-protocol";
import { deriveGraph } from "../../../../src/extract/derive.js";
import type { ReifiedSpec } from "../../../../src/extract/reify.js";

import { inspectMarkdown, reifyMarkdown } from "./md-reify.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const realRoot = fileURLToPath(new URL("../../../../", import.meta.url));

function read(path: string): string {
  return readFileSync(`${root}/${path}`, "utf8");
}

function reifyFiles(paths: readonly string[]): readonly ReifiedSpec[] {
  return paths.flatMap((path) => reifyMarkdown(read(path), path).specs);
}

const livePaths = [
  "specs/orders.create-order.sdp.md",
  "specs/orders.create-order.valid-cart.sdp.md",
  "specs/orders.order-model.sdp.md",
  "specs/decisions.order-lifecycle.sdp.md",
  "specs/orders.create-order.api-contract.sdp.md",
] as const;

const realGraph = JSON.parse(
  readFileSync(`${realRoot}/examples/checkout-v1/generated/graph.json`, "utf8"),
) as GraphSchema;
const spikeGraph = deriveGraph(reifyFiles(livePaths), [], []);

function node(graph: GraphSchema, id: string): PrimitiveNode {
  const found = graph.nodes.find(
    (entry): entry is PrimitiveNode => entry.nodeType === "Primitive" && entry.id === id,
  );

  if (found === undefined) {
    throw new Error(`missing primitive ${id}`);
  }

  return found;
}

function without(
  value: PrimitiveNode,
  keys: readonly (keyof PrimitiveNode)[],
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !keys.includes(key as keyof PrimitiveNode)),
  );
}

function splicePair(markdownGraph: GraphSchema): GraphSchema {
  const ids = new Set(["spec:orders.create-order", "spec:orders.create-order.valid-cart"]);
  const replacements = markdownGraph.nodes.filter((entry) => ids.has(entry.id));
  const declaredEdges = markdownGraph.edges.filter(
    (edge) => ids.has(edge.from) && edge.claim === "declared",
  );

  return {
    schemaVersion: realGraph.schemaVersion,
    nodes: [
      ...realGraph.nodes.filter((entry) => !ids.has(entry.id)),
      ...replacements,
    ] as readonly GraphNode[],
    edges: [
      ...realGraph.edges.filter(
        (edge) => !(ids.has(edge.from) && edge.claim === "declared"),
      ),
      ...declaredEdges,
    ] as readonly GraphEdge[],
  };
}

test("markdown reifies to the committed graph fragment", () => {
  expect(serializeGraph(spikeGraph)).toBe(read("spike/emitted/graph-fragment.json"));
});

test("the live arc pair is byte-identical to the final maturity snapshots", () => {
  expect(read("specs/orders.create-order.sdp.md")).toBe(
    read("arc/04-ready/create-order.sdp.md"),
  );
  expect(read("specs/orders.create-order.valid-cart.sdp.md")).toBe(
    read("arc/04-ready/create-order.valid-cart.sdp.md"),
  );
});

test("free prose dropped at the spike seam is counted rather than silently forgotten", () => {
  const dropped = livePaths.flatMap((path) => inspectMarkdown(read(path), path).droppedProse);
  expect(dropped).toHaveLength(4);
});

test("the generated-style envelope schema stays exact to protocol enums and graph ids", () => {
  const schema = JSON.parse(read("envelope.schema.json")) as {
    properties: {
      kind: { enum: readonly string[] };
      altitude: { enum: readonly string[] };
      readiness: { enum: readonly string[] };
    };
    $defs: {
      graphNodeId: { enum: readonly string[] };
      relationType: { enum: readonly string[] };
    };
  };

  expect(schema.properties.kind.enum).toEqual(SPEC_KINDS);
  expect(schema.properties.altitude.enum).toEqual(SPEC_ALTITUDES);
  expect(schema.properties.readiness.enum).toEqual(SPEC_READINESS);
  expect(schema.$defs.relationType.enum).toEqual(SPEC_RELATION_TYPES);
  expect(schema.$defs.graphNodeId.enum).toEqual(
    realGraph.nodes.map((entry) => entry.id).sort((left, right) =>
      left < right ? -1 : left > right ? 1 : 0,
    ),
  );
});

test("the three kind ports are field-exact against the real graph", () => {
  for (const id of [
    "spec:orders.order-model",
    "spec:orders.create-order.api-contract",
    "spec:decisions.order-lifecycle",
  ]) {
    expect(without(node(spikeGraph, id), ["file"])).toEqual(
      without(node(realGraph, id), ["file"]),
    );
  }

  const portedIds = new Set([
    "spec:orders.order-model",
    "spec:orders.create-order.api-contract",
    "spec:decisions.order-lifecycle",
  ]);
  const selectEdges = (graph: GraphSchema): readonly GraphEdge[] =>
    [...graph.edges]
      .filter((edge) => portedIds.has(edge.from) && edge.type !== "belongsTo")
      .sort((left, right) =>
        `${left.from}:${left.type}:${left.to}`.localeCompare(
          `${right.from}:${right.type}:${right.to}`,
        ),
      );

  expect(selectEdges(spikeGraph)).toEqual(selectEdges(realGraph));
});

test("the ready arc pair differs only by named derived fields and the parent's stated rung", () => {
  const childId = "spec:orders.create-order.valid-cart";
  const parentId = "spec:orders.create-order";

  expect(without(node(spikeGraph, childId), ["file", "deliveryFacts"])).toEqual(
    without(node(realGraph, childId), ["file", "deliveryFacts"]),
  );

  const spikeParent = without(node(spikeGraph, parentId), ["file", "deliveryFacts"]);
  const realParent = without(node(realGraph, parentId), ["file", "deliveryFacts"]);
  expect({ ...spikeParent, readiness: realParent.readiness }).toEqual(realParent);
  expect({ spike: spikeParent.readiness, real: realParent.readiness }).toEqual({
    spike: "ready",
    real: "defined",
  });

  const spliced = splicePair(spikeGraph);
  const index = buildGraphIndex(spliced);
  expect(evaluateReadinessFloor(node(spliced, parentId), index)).toEqual([]);
  expect(evaluateReadinessFloor(node(spliced, childId), index)).toEqual([]);
});

test("every maturity snapshot clears its stated readiness floor", () => {
  for (const rung of ["01-idea", "02-scoped", "03-defined", "04-ready"] as const) {
    const snapshot = deriveGraph(
      reifyFiles([
        `arc/${rung}/create-order.sdp.md`,
        `arc/${rung}/create-order.valid-cart.sdp.md`,
      ]),
      [],
      [],
    );
    const spliced = splicePair(snapshot);
    const index = buildGraphIndex(spliced);

    for (const id of ["spec:orders.create-order", "spec:orders.create-order.valid-cart"]) {
      expect(evaluateReadinessFloor(node(spliced, id), index), `${rung}: ${id}`).toEqual([]);
    }
  }
});

test("markdown drives byte-identical generated contracts", () => {
  const generated = generateContracts(splicePair(spikeGraph));
  expect(generated.findings).toEqual([]);
  expect(generated.files.get("orders.create-order.valid-cart.contract.ts")).toBe(
    read("spike/emitted/orders.create-order.valid-cart.contract.ts"),
  );
  expect(generated.files.get("orders.create-order.valid-cart.contract.ts")).toBe(
    readFileSync(
      `${realRoot}/examples/checkout-v1/generated/contracts/orders.create-order.valid-cart.contract.ts`,
      "utf8",
    ),
  );
  expect(generated.files.get("orders.create-order.space.ts")).toBe(
    readFileSync(
      `${realRoot}/examples/checkout-v1/generated/contracts/orders.create-order.space.ts`,
      "utf8",
    ),
  );
});

test("the after-edit document regenerates the one-line-changed red-demo contract", () => {
  const editedChild = deriveGraph(
    reifyFiles(["executable/after-edit/orders.create-order.valid-cart.sdp.md"]),
    [],
    [],
  );
  const parentAndEditedChild: GraphSchema = {
    schemaVersion: spikeGraph.schemaVersion,
    nodes: [
      node(spikeGraph, "spec:orders.create-order"),
      node(editedChild, "spec:orders.create-order.valid-cart"),
    ],
    edges: [
      ...spikeGraph.edges.filter((edge) => edge.from === "spec:orders.create-order"),
      ...editedChild.edges,
    ],
  };
  const generated = generateContracts(parentAndEditedChild);

  expect(generated.findings).toEqual([]);
  expect(generated.files.get("orders.create-order.valid-cart.contract.ts")).toBe(
    read("executable/after-edit/orders.create-order.valid-cart.contract.ts"),
  );
});

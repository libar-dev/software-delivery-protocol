import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

import {
  buildGraphIndex,
  evaluateReadinessFloor,
} from "@libar-dev/software-delivery-protocol";
import type { PrimitiveNode } from "@libar-dev/software-delivery-protocol";
import { deriveGraph } from "../../../../src/extract/derive.js";

import { expandTable } from "./expand-table.js";
import { inspectSdp, reifySdp } from "./sdp-reify.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const hostPath = "table-sugar/orders.create-order.order-total.sdp";
const host = readFileSync(`${root}/${hostPath}`, "utf8");

test("the cases block expands byte-exactly to three committed sibling examples", () => {
  const expanded = expandTable(host, hostPath);
  expect(expanded.map((entry) => entry.point)).toEqual([
    "single-unit",
    "multi-line",
    "zero-price",
  ]);
  for (const document of expanded) {
    expect(document.content).toBe(
      readFileSync(`${root}/table-sugar/expanded/${document.filename}`, "utf8"),
    );
  }
});

test("static expansion reaches the graph as N one-point example children", () => {
  const hostSpec = reifySdp(host, hostPath).specs;
  const children = expandTable(host, hostPath).flatMap((document) =>
    reifySdp(document.content, `table-sugar/expanded/${document.filename}`).specs,
  );
  const graph = deriveGraph([...hostSpec, ...children], [], []);
  const childNodes = graph.nodes.filter(
    (node): node is PrimitiveNode =>
      node.nodeType === "Primitive" && node.specKind === "example",
  );
  expect(childNodes).toHaveLength(3);
  expect(
    graph.edges.filter(
      (edge) => edge.type === "refines" && edge.to === "spec:orders.create-order.order-total",
    ),
  ).toHaveLength(3);
  expect(
    childNodes.every((child) => {
      const behavior = child.sections?.behavior as { examples?: readonly unknown[] } | undefined;
      return behavior?.examples?.length === 1;
    }),
  ).toBe(true);
});

test("the host rule and every expanded sibling clear their stated defined floor", () => {
  const hostSpec = reifySdp(host, hostPath).specs;
  const children = expandTable(host, hostPath).flatMap((document) =>
    reifySdp(document.content, `table-sugar/expanded/${document.filename}`).specs,
  );
  const graph = deriveGraph([...hostSpec, ...children], [], []);
  const index = buildGraphIndex(graph);
  const primitives = graph.nodes.filter(
    (node): node is PrimitiveNode => node.nodeType === "Primitive",
  );
  expect(primitives).toHaveLength(4);
  for (const primitive of primitives) {
    expect(
      evaluateReadinessFloor(primitive, index),
      `${primitive.id} states ${primitive.readiness}`,
    ).toEqual([]);
  }
});

test("malformed tables refuse before any point can silently disappear", () => {
  expect(() => expandTable(host.replace("| ----------- |", "| single-unit |"), hostPath)).toThrow(
    /valid separator row/u,
  );
  expect(() =>
    expandTable(host.replace('| single-unit | 1 | 1 | 50    | "in stock"   | 50    |', "| single-unit | 1 | 1 |"), hostPath),
  ).toThrow(/cells; expected/u);
  expect(() =>
    expandTable(host.replace("| multi-line  |", "| single-unit |"), hostPath),
  ).toThrow(/duplicate cases point/u);
});

test("every narrated table refusal is pinned", () => {
  expect(() =>
    expandTable(
      host.replace(
        "| point       | n | q | price | availability | total |",
        "| point       | n | q | q     | availability | total |",
      ),
      hostPath,
    ),
  ).toThrow(/headers must be unique/u);
  expect(() =>
    expandTable(host.replace("| single-unit | 1", "| bad point   | 1"), hostPath),
  ).toThrow(/not a stable id segment/u);
  expect(() =>
    expandTable(
      host.replace(
        '| single-unit | 1 | 1 | 50    | "in stock"   | 50    |',
        '| single-unit | 1 | 1 | 50    | "in stock"   |       |',
      ),
      hostPath,
    ),
  ).toThrow(/empty binding/u);
});

test("bindings must be valid slot scalars before a child can be emitted", () => {
  expect(() =>
    expandTable(
      host.replace(
        '| single-unit | 1 | 1 | 50    | "in stock"   | 50    |',
        '| single-unit | 1 | 1 | 50    | "in stock"   | yes   |',
      ),
      hostPath,
    ),
  ).toThrow(/bind every slot to a valid scalar/u);
});

test("a cases block without template steps refuses before emitting empty examples", () => {
  const withoutTemplates = host.replace(
    /  cases\n(?: {4,6}.+\n)+\n/u,
    "  cases\n\n",
  );
  expect(() => expandTable(withoutTemplates, hostPath)).toThrow(
    /at least one template step/u,
  );
});

test("the cases side channel is named when ordinary reification omits it", () => {
  expect(inspectSdp(host, hostPath).droppedStructures).toEqual([
    "cases block (pre-graph expansion input)",
  ]);
});

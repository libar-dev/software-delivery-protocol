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
import { reifySdp } from "./sdp-reify.js";

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

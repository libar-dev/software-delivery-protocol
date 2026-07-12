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
import { reifyMarkdown } from "./md-reify.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const host = readFileSync(
  `${root}/table-sugar/orders.create-order.order-total.sdp.md`,
  "utf8",
);

test("the table expands byte-exactly to three committed sibling examples", () => {
  const expanded = expandTable(host);
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
  const hostSpec = reifyMarkdown(
    host,
    "table-sugar/orders.create-order.order-total.sdp.md",
  ).specs;
  const children = expandTable(host).flatMap((document) =>
    reifyMarkdown(document.content, `table-sugar/expanded/${document.filename}`).specs,
  );
  const graph = deriveGraph([...hostSpec, ...children], [], []);
  const childNodes = graph.nodes.filter(
    (node): node is PrimitiveNode =>
      node.nodeType === "Primitive" && node.specKind === "example",
  );
  const refinementEdges = graph.edges.filter(
    (edge) =>
      edge.type === "refines" && edge.to === "spec:orders.create-order.order-total",
  );

  expect(childNodes).toHaveLength(3);
  expect(refinementEdges).toHaveLength(3);
  expect(
    childNodes.every((child) => {
      const behavior = child.sections?.behavior as
        | { examples?: readonly unknown[] }
        | undefined;
      return behavior?.examples?.length === 1;
    }),
  ).toBe(true);
});

test("the host rule and every expanded sibling clear their stated defined floor", () => {
  const hostSpec = reifyMarkdown(
    host,
    "table-sugar/orders.create-order.order-total.sdp.md",
  ).specs;
  const children = expandTable(host).flatMap((document) =>
    reifyMarkdown(document.content, `table-sugar/expanded/${document.filename}`).specs,
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

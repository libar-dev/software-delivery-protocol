import { expect } from "vitest";

import {
  emitMarkdownSpec,
  extract,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
} from "../src/index.js";
import type { DeliveryFactName, GraphSchema, ReifiedSpec } from "../src/index.js";

function markdownSiblingPath(relativePath: string): string {
  return relativePath.replace(/\.sdp\.ts$/u, ".sdp.md");
}

function normalizeCarrierPath(file: string): string {
  return file.replace(/\.sdp\.(?:ts|md)$/u, "");
}

function oneSpec(specs: readonly ReifiedSpec[]): ReifiedSpec | undefined {
  expect(specs).toHaveLength(1);
  return specs[0];
}

export function assertAuthoredRoundTrip(tsSourceText: string, relativePath: string): void {
  const tsReification = reifyTypeScriptCarrier(tsSourceText, relativePath);
  expect(tsReification.findings).toEqual([]);
  const tsSpec = oneSpec(tsReification.specs);
  expect(tsSpec).toBeDefined();
  if (tsSpec === undefined) return;

  const markdownReification = reifyMarkdownCarrier(
    emitMarkdownSpec(tsSpec),
    markdownSiblingPath(relativePath),
  );
  expect(markdownReification.findings).toEqual([]);
  const markdownSpec = oneSpec(markdownReification.specs);
  expect(markdownSpec).toBeDefined();
  if (markdownSpec === undefined) return;

  expect(markdownSpec.data).toEqual(tsSpec.data);
}

function graphContent(graph: GraphSchema) {
  const packIds = new Set(
    graph.nodes.filter((node) => node.nodeType === "Pack").map((node) => node.id),
  );
  const nodes = graph.nodes
    .filter((node) => node.nodeType !== "Pack")
    .map((node) => {
      if (node.nodeType === "Primitive") {
        const { deliveryFacts, file, ...content } = node;
        void deliveryFacts;
        return { ...content, file: normalizeCarrierPath(file) };
      }

      return { ...node, file: normalizeCarrierPath(node.file) };
    });
  const edges = graph.edges.filter((edge) => !packIds.has(edge.from) && !packIds.has(edge.to));

  return { nodes, edges };
}

function deliveryFactsByNode(graph: GraphSchema): ReadonlyMap<string, readonly DeliveryFactName[]> {
  const facts = new Map<string, readonly DeliveryFactName[]>();

  for (const node of graph.nodes) {
    if (node.nodeType === "Primitive") facts.set(node.id, node.deliveryFacts ?? []);
  }

  return facts;
}

export function assertGraphRoundTrip(tsCorpusDir: string, mdCorpusDir: string): void {
  const typeScriptGraph = extract({ root: tsCorpusDir }).graph;
  const markdownGraph = extract({ root: mdCorpusDir }).graph;

  expect(markdownGraph.schemaVersion).toBe(typeScriptGraph.schemaVersion);
  expect(graphContent(markdownGraph)).toEqual(graphContent(typeScriptGraph));
  expect(deliveryFactsByNode(markdownGraph)).toEqual(deliveryFactsByNode(typeScriptGraph));
}

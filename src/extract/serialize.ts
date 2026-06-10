import type { GraphEdge, GraphNode, GraphSchema } from "../graph/schema.js";

/**
 * Every output byte is owned here, so no `ts-morph` upgrade can change them silently: nodes sorted
 * by `id`, edges by `(from, type, to)` (P3), one canonical key order per node/edge shape, 2-space
 * indent, LF, final newline, UTF-8 without BOM, no wall-clock timestamps, no run hashes, no
 * absolute paths (JS-C3). Section content is the one exception to canonical key order: it
 * serializes in authored order — it is content, and authored order is deterministic given the
 * repo.
 *
 * Sorting is code-unit string comparison, never `localeCompare`: locale-aware collation is
 * environment-dependent and would break determinism.
 */
function compareCodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

function canonicalNode(node: GraphNode): Record<string, unknown> {
  switch (node.nodeType) {
    case "Primitive":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        specKind: node.specKind,
        altitude: node.altitude,
        readiness: node.readiness,
        ...(node.title === undefined ? {} : { title: node.title }),
        file: node.file,
        ...(node.sections === undefined ? {} : { sections: node.sections }),
        ...(node.deliveryFacts === undefined || node.deliveryFacts.length === 0
          ? {}
          : { deliveryFacts: node.deliveryFacts }),
      };
    case "Pack":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        ...(node.title === undefined ? {} : { title: node.title }),
        ...(node.framing === undefined ? {} : { framing: node.framing }),
        file: node.file,
        ...(node.modelRefs === undefined ? {} : { modelRefs: node.modelRefs }),
      };
    case "Anchor":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
      };
    case "CodeNode":
      return {
        id: node.id,
        nodeType: node.nodeType,
        claim: node.claim,
        file: node.file,
        ...(node.line === undefined ? {} : { line: node.line }),
      };
  }
}

function canonicalEdge(edge: GraphEdge): Record<string, unknown> {
  return {
    from: edge.from,
    type: edge.type,
    to: edge.to,
    claim: edge.claim,
  };
}

function compareNodes(left: GraphNode, right: GraphNode): number {
  return compareCodeUnits(left.id, right.id);
}

function compareEdges(left: GraphEdge, right: GraphEdge): number {
  return (
    compareCodeUnits(left.from, right.from) ||
    compareCodeUnits(left.type, right.type) ||
    compareCodeUnits(left.to, right.to)
  );
}

export function serializeGraph(graph: GraphSchema): string {
  const canonical = {
    schemaVersion: graph.schemaVersion,
    nodes: [...graph.nodes].sort(compareNodes).map(canonicalNode),
    edges: [...graph.edges].sort(compareEdges).map(canonicalEdge),
  };

  return `${JSON.stringify(canonical, null, 2)}\n`;
}

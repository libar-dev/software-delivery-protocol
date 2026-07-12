import type { GraphEdge, GraphNode, GraphSchema, PrimitiveNode } from "../graph/schema.js";

/**
 * The indexed view of the one graph the validators read — built once per `validateGraph` run.
 * Purely derived lookup structure over the flat node/edge arrays; holds nothing the graph does
 * not (never a second store).
 */
export interface GraphIndex {
  readonly nodesById: ReadonlyMap<string, GraphNode>;
  readonly primitivesById: ReadonlyMap<string, PrimitiveNode>;
  readonly edgesByFrom: ReadonlyMap<string, readonly GraphEdge[]>;
  readonly edgesByTo: ReadonlyMap<string, readonly GraphEdge[]>;
}

function appendEdge(map: Map<string, GraphEdge[]>, key: string, edge: GraphEdge): void {
  const list = map.get(key);

  if (list === undefined) {
    map.set(key, [edge]);
    return;
  }

  list.push(edge);
}

export function buildGraphIndex(graph: GraphSchema): GraphIndex {
  const nodesById = new Map<string, GraphNode>();
  const primitivesById = new Map<string, PrimitiveNode>();
  const edgesByFrom = new Map<string, GraphEdge[]>();
  const edgesByTo = new Map<string, GraphEdge[]>();

  for (const node of graph.nodes) {
    // Duplicate node ids cannot be keyed; the first carrier wins here and the duplicate-ids
    // validator reports the ambiguity loudly (L2) — the index never auto-resolves it.
    if (!nodesById.has(node.id)) {
      nodesById.set(node.id, node);
    }

    if (node.nodeType === "Primitive" && !primitivesById.has(node.id)) {
      primitivesById.set(node.id, node);
    }
  }

  for (const edge of graph.edges) {
    appendEdge(edgesByFrom, edge.from, edge);
    appendEdge(edgesByTo, edge.to, edge);
  }

  return { nodesById, primitivesById, edgesByFrom, edgesByTo };
}

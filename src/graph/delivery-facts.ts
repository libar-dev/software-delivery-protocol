import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { DeliveryFactName, GraphEdge, GraphNode, PrimitiveNode } from "./schema.js";

/**
 * Conferral law: `spec:extraction.delivery-facts`.
 */
/**
 * Returns whether `edge` is a resolving test-anchor `verifies` edge.
 * Shared by `computeDeliveryFacts`, the verifies-linkage check, and the reader's enabled decode.
 */
export function isResolvingTestAnchorVerify(
  edge: GraphEdge,
  nodesById: ReadonlyMap<string, GraphNode>,
): boolean {
  return (
    edge.type === "verifies" &&
    edge.claim === "anchored" &&
    nodesById.get(edge.from)?.nodeType === "Anchor"
  );
}

/**
 * Returns whether `edge` is an enabled-example `verifies` edge.
 * Shared by `computeDeliveryFacts` and the reader's enabled decode; the verifies-linkage check
 * names why a declared verifier confers nothing, while this predicate only decides whether.
 */
export function isEnabledExampleVerify(
  edge: GraphEdge,
  nodesById: ReadonlyMap<string, GraphNode>,
  anchorVerified: (verifierId: string) => boolean,
): boolean {
  if (edge.type !== "verifies" || edge.claim !== "declared") {
    return false;
  }

  const source = nodesById.get(edge.from);

  return (
    source?.nodeType === "Primitive" && source.specKind === "example" && anchorVerified(source.id)
  );
}

const deliveryFactsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.delivery-facts"),
  label: "computes delivery facts from resolving binding edges",
  satisfies: ref("spec:extraction.delivery-facts"),
  component: componentAnchorId("component:protocol.graph"),
});
void deliveryFactsAnchor;

export function computeDeliveryFacts(
  nodes: readonly GraphNode[],
  edges: readonly GraphEdge[],
): ReadonlyMap<string, readonly DeliveryFactName[]> {
  const nodesById = new Map<string, GraphNode>();
  const primitivesById = new Map<string, PrimitiveNode>();

  for (const node of nodes) {
    // Duplicate ids cannot be keyed; the first carrier wins here, exactly as in the graph index,
    // and the duplicate-ids validator reports the ambiguity loudly (L2).
    if (!nodesById.has(node.id)) {
      nodesById.set(node.id, node);
    }

    if (node.nodeType === "Primitive" && !primitivesById.has(node.id)) {
      primitivesById.set(node.id, node);
    }
  }

  const implemented = new Set<string>();
  const anchorVerified = new Set<string>();

  for (const edge of edges) {
    if (!primitivesById.has(edge.to)) {
      continue;
    }

    if (
      edge.type === "satisfies" &&
      edge.claim === "anchored" &&
      nodesById.get(edge.from)?.nodeType === "CodeNode"
    ) {
      implemented.add(edge.to);
    }

    if (isResolvingTestAnchorVerify(edge, nodesById)) {
      anchorVerified.add(edge.to);
    }
  }

  const hasVerifier = new Set<string>(anchorVerified);

  for (const edge of edges) {
    if (!primitivesById.has(edge.to)) {
      continue;
    }

    if (isEnabledExampleVerify(edge, nodesById, (verifierId) => anchorVerified.has(verifierId))) {
      hasVerifier.add(edge.to);
    }
  }

  const facts = new Map<string, readonly DeliveryFactName[]>();

  for (const id of primitivesById.keys()) {
    // Implements the Spec's ladder order.
    const ladder: DeliveryFactName[] = [];

    if (implemented.has(id)) {
      ladder.push("implemented");
    }

    if (hasVerifier.has(id)) {
      ladder.push("has-verifier");
    }

    if (ladder.length > 0) {
      facts.set(id, ladder);
    }
  }

  return facts;
}

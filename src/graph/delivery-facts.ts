import type { DeliveryFactName, GraphEdge, GraphNode, PrimitiveNode } from "./schema.js";

/**
 * Delivery facts, computed exactly per `02` §2 — derived from edges, never authored. This is the
 * one derivation rule, shared by the extractor (which decorates `Primitive` nodes with it) and
 * the delivery-facts honesty check (which recomputes it over the same graph and compares) — one
 * derivation path, never two:
 *
 * - `implemented` — ≥1 `satisfies` edge resolves to the spec along its `03` §1 contract row
 *   (anchored, from a `CodeNode` present in the graph). A dangling or off-contract binding
 *   confers nothing.
 * - `has-verifier` — an **anchored** `verifies` edge resolves to the spec along its contract row
 *   (from an `Anchor` node present in the graph — a test anchored to the spec), or a **declared**
 *   `verifies` edge from an *enabled* example resolves to it — enabled = an `example`-kind spec
 *   that is itself the target of a resolving anchored `verifies` edge. Direct, per-spec, never
 *   propagated up `refines`; a declared `verifies` from a verifier that is not enabled confers
 *   nothing (binding, never liveness — MD-7).
 * - `observed` — never computed (aspirational, the liveness rung).
 *
 * Extractor output satisfies the contract-row conditions by construction (a binding node and its
 * edge derive together, claims assigned by flavor); the conditions have teeth for any other graph
 * producer — an edge the claim-separation check would reject never confers a fact (fail closed).
 *
 * Facts are listed in ladder order (`implemented` → `has-verifier`).
 */
/**
 * The one resolving-test-anchor rule: an anchored `verifies` edge counts only along its `03` §1
 * contract row — its source resolves to an `Anchor` node present in the graph. Shared by
 * delivery-fact derivation, the verifies-linkage check, and the reader's enabled decode so the
 * three surfaces can never disagree: on a malformed or foreign graph an off-contract edge (wrong
 * claim, non-Anchor source) confers nothing (fail closed).
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
    if (edge.type !== "verifies" || edge.claim !== "declared" || !primitivesById.has(edge.to)) {
      continue;
    }

    const verifier = primitivesById.get(edge.from);
    const verifierIsEnabledExample =
      verifier?.specKind === "example" && anchorVerified.has(verifier.id);

    if (verifierIsEnabledExample) {
      hasVerifier.add(edge.to);
    }
  }

  const facts = new Map<string, readonly DeliveryFactName[]>();

  for (const id of primitivesById.keys()) {
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

import { codeAnchorId, componentAnchorId, parseId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { GraphEdge, GraphNode, PrimitiveNode } from "./schema.js";

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function ownsExampleSpace(node: PrimitiveNode): boolean {
  const behavior = asRecord(node.sections?.behavior);
  return asRecord(behavior?.exampleSpace) !== undefined;
}

function hasOracleNamespace(id: string): boolean {
  try {
    return parseId(id).namespace === "oracle";
  } catch {
    return false;
  }
}

/** The complete, fail-closed oracle binding contract shared by validators and consumers. */
const oracleTargetEligibilityAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.oracle-target-eligibility"),
  label: "resolves oracle targets by example-space ownership across Spec kinds",
  satisfies: ref("spec:validation.oracle-target-eligibility"),
  component: componentAnchorId("component:protocol.graph"),
});
void oracleTargetEligibilityAnchor;

export function isResolvingOracleModel(
  edge: GraphEdge,
  nodesById: ReadonlyMap<string, GraphNode>,
): boolean {
  const source = nodesById.get(edge.from);
  const target = nodesById.get(edge.to);

  return (
    edge.type === "models" &&
    edge.claim === "anchored" &&
    source?.nodeType === "Anchor" &&
    hasOracleNamespace(source.id) &&
    target?.nodeType === "Primitive" &&
    ownsExampleSpace(target)
  );
}

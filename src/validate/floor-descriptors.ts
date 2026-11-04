import type { PrimitiveNode } from "../graph/schema.js";
import { SPEC_ALTITUDES, SPEC_KINDS } from "../model/descriptors.js";

/** A Spec descriptor the readiness floor reads, and so one whose unratified value it cannot. */
export type FloorDescriptor = "specKind" | "altitude";

const ratifiedKinds: ReadonlySet<string> = new Set(SPEC_KINDS);
const ratifiedAltitudes: ReadonlySet<string> = new Set(SPEC_ALTITUDES);

/**
 * The descriptors of a Spec node that carry an unratified value, `specKind` before `altitude`.
 * Foreign graph data can put such strings in the typed slots; descriptor conformance reports them
 * (`spec:validation.claim-separation`), and no readiness floor is evaluated over the node
 * (`spec:validation.next-rung-floor`). The evaluator, derived readiness and the reader's
 * not-evaluated state read this one predicate. Empty for every Spec the extractor derives.
 */
export function unratifiedFloorDescriptors(
  node: Pick<PrimitiveNode, "specKind" | "altitude">,
): readonly FloorDescriptor[] {
  const unratified: FloorDescriptor[] = [];

  if (!ratifiedKinds.has(node.specKind)) {
    unratified.push("specKind");
  }

  if (!ratifiedAltitudes.has(node.altitude)) {
    unratified.push("altitude");
  }

  return unratified;
}

import type { CodeAnchorId, SpecId, TestAnchorId } from "../ids.js";

/**
 * The generic code anchor (MD-8, folded here): one builder over the implementation-flavored code
 * namespaces (`impl` / `api` / `component`), because anchors are generic *by definition* — the
 * binding is the thing, framework- and location-neutral (`04` §2), and the ID grammar already
 * parses any lowercase namespace. Per-namespace sibling builders (`anchorApi`, `anchorComponent`,
 * …) were rejected as surface bloat for zero expressive gain. An anchor asserts a binding only,
 * never system-truth content (R1): identity, an optional display label, and the one `satisfies`
 * target — nothing spec-level ever rides here.
 */
export interface CodeAnchor {
  readonly id: CodeAnchorId;
  readonly label?: string;
  readonly satisfies: SpecId;
}

/**
 * The binding-only test anchor (R3): identity plus the `verifies` target, never an executing
 * callback — the graph records that an enabled verifier *exists*, never that it ran (binding,
 * never liveness — MD-7).
 */
export interface SpecTestAnchor {
  readonly id: TestAnchorId;
  readonly label?: string;
  readonly verifies: SpecId;
}

export type Anchor = CodeAnchor | SpecTestAnchor;

export function codeAnchor(anchor: CodeAnchor): CodeAnchor {
  return {
    ...anchor,
  };
}

export function specTest(anchor: SpecTestAnchor): SpecTestAnchor {
  return {
    ...anchor,
  };
}

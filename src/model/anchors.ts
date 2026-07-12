import type { CodeAnchorId, OracleAnchorId, SpecId, TestAnchorId } from "../ids.js";

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

/**
 * The binding-only oracle anchor (the plan-12 ratification, settlement 8): identity plus the one
 * `models` target — the authored `expected()` semantics live beside it as ordinary test-side
 * code, implementation-side like step bindings. The graph records that an oracle *exists* (this
 * anchor), never what it says: the oracle function is never extracted, never authoritative, and
 * confers no delivery fact (no `has-oracle` until the second-caller bar) — discovery is an
 * anchor query. Its outcome faithfulness stays human-reviewed, by law (checks police conformance
 * and honesty, never content-quality).
 */
export interface SpecOracleAnchor {
  readonly id: OracleAnchorId;
  readonly label?: string;
  readonly models: SpecId;
}

export type Anchor = CodeAnchor | SpecTestAnchor | SpecOracleAnchor;

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

export function specOracle(anchor: SpecOracleAnchor): SpecOracleAnchor {
  return {
    ...anchor,
  };
}

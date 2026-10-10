import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { CodeAnchorLayer } from "../model/anchors.js";
import type { SpecAltitude, SpecKind, SpecReadiness } from "../model/descriptors.js";
import type { SpecSections } from "../model/sections.js";

export const schemaVersion = "0.8.0" as const;

const schemaVersionAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.schema-version"),
  label: "declares the graph schema version",
  satisfies: ref("spec:extraction.schema-versioning"),
  component: componentAnchorId("component:protocol.graph"),
  role: "contract",
});
void schemaVersionAnchor;

export const graphNodeTypes = ["Primitive", "Pack", "Anchor", "CodeNode"] as const;
export type GraphNodeType = (typeof graphNodeTypes)[number];

export const graphClaims = ["declared", "anchored", "inferred"] as const;
export type GraphClaim = (typeof graphClaims)[number];

const graphComponentAnchor = codeAnchor({
  id: codeAnchorId("component:protocol.graph"),
  label: "Protocol graph seam",
  satisfies: ref("spec:extraction.claim-taxonomy"),
  uses: [
    componentAnchorId("component:protocol.model"),
    componentAnchorId("component:protocol.notation"),
  ],
  layer: "domain",
  context: "protocol",
});
const graphClaimsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.graph-claims"),
  label: "declares the graph claim taxonomy",
  satisfies: ref("spec:extraction.claim-taxonomy"),
  component: componentAnchorId("component:protocol.graph"),
  role: "contract",
});
void graphComponentAnchor;
void graphClaimsAnchor;

export const deliveryFactNames = ["implemented", "has-verifier", "observed"] as const;
export type DeliveryFactName = (typeof deliveryFactNames)[number];

export const authoredEdgeTypes = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
] as const;
export type AuthoredEdgeType = (typeof authoredEdgeTypes)[number];

/** `models` is the oracle anchor's binding edge (Anchor → Primitive, anchored) — anchor-emitted
 *  like `satisfies`, never authored; it confers no delivery fact (no `has-oracle` at MVP).
 *  `memberOf` and `uses` are anchored CodeNode → CodeNode structure. They deliberately stay out
 *  of delivery facts and the reader's binding traversal, whose destination is always a Spec.
 *  `references` is the anchored CodeNode → Primitive edge of the binding grain
 *  (`spec:decisions.anchor-binding-grain`): this code answers to that design without claiming to
 *  realize it. It confers no delivery fact, moves no floor, and the drift alarm ignores it. */
export const derivedEdgeTypes = [
  "belongsTo",
  "satisfies",
  "models",
  "memberOf",
  "uses",
  "references",
] as const;
export type DerivedEdgeType = (typeof derivedEdgeTypes)[number];

export const graphEdgeTypes = [...authoredEdgeTypes, ...derivedEdgeTypes] as const;
export type GraphEdgeType = (typeof graphEdgeTypes)[number];

const graphEdgeTypesAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.graph-edge-types"),
  label: "declares the closed list of graph edge types",
  satisfies: ref("spec:extraction.derive-graph"),
  component: componentAnchorId("component:protocol.graph"),
  references: [ref("spec:decisions.anchor-binding-grain")],
  role: "contract",
});
void graphEdgeTypesAnchor;

interface GraphNodeBase {
  readonly id: string;
  readonly nodeType: GraphNodeType;
  readonly claim: GraphClaim;
}

export interface PrimitiveNode extends GraphNodeBase {
  readonly nodeType: "Primitive";
  readonly specKind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  /** Degradable: a non-static title is dropped with a warning, never a hard error
   * (`spec:extraction.determinism`). */
  readonly title?: string;
  /** Owned Spec prose; Markdown carries it between the H1 title and the first H2. */
  readonly narrative?: string;
  /** Extraction-root-relative, POSIX separators, no leading `./` — never absolute (JS-C3). */
  readonly file: string;
  /**
   * The reified section content rides the node (the graph is the sole input every consumer reads —
   * P2): structural metadata stays flat above; content is fenced here, in authored order. Omitted
   * when the spec carries no sections.
   */
  readonly sections?: SpecSections;
  readonly deliveryFacts?: readonly DeliveryFactName[];
}

export interface PackNode extends GraphNodeBase {
  readonly nodeType: "Pack";
  readonly title?: string;
  readonly framing?: string;
  /**
   * Node data, not edges: the `spec:extraction.derive-graph` edge contract has no `modelRefs` edge type — the
   * pack-coherence check reads this (every entry resolves to a `model`-kind spec).
   */
  /** The manifest's `specs` list as authored, duplicates included; the `belongsTo` edges re-express it. */
  readonly members: readonly string[];
  readonly modelRefs?: readonly string[];
  readonly file: string;
}

/**
 * The test anchor's node (the `verifies` edge contract row: Anchor (test) → Primitive, anchored).
 * Binding nodes carry `file` + `line`: the line *is* the binding location — what a Design Review
 * links to (consumers may link to source locations recorded in the graph, R2). `Primitive`/`Pack`
 * nodes stay line-free so the golden stays robust to spec-file editing.
 */
export interface AnchorNode extends GraphNodeBase {
  readonly nodeType: "Anchor";
  readonly label?: string;
  /** Extraction-root-relative, POSIX separators, no leading `./` — never absolute (JS-C3). */
  readonly file: string;
  readonly line: number;
}

/**
 * A code anchor's node (the `satisfies` edge contract row: CodeNode → Primitive, anchored). The
 * architectural annotation decision (`spec:decisions.architectural-annotation`) adds three
 * structural attributes: `role`, the pattern the unit plays, a free corpus-owned vocabulary;
 * `layer` and `context`, the declared component's layer and bounded context, on `component:`
 * nodes only. None of them confers anything; the census renders their taxonomy from the graph.
 */
export interface CodeNode extends GraphNodeBase {
  readonly nodeType: "CodeNode";
  readonly label?: string;
  readonly file: string;
  readonly line?: number;
  readonly role?: string;
  readonly layer?: CodeAnchorLayer;
  readonly context?: string;
}

export type GraphNode = PrimitiveNode | PackNode | AnchorNode | CodeNode;

export interface GraphEdge {
  readonly from: string;
  readonly type: GraphEdgeType;
  readonly to: string;
  readonly claim: GraphClaim;
}

export interface GraphSchema {
  readonly schemaVersion: typeof schemaVersion;
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}

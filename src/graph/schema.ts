import type { SpecAltitude, SpecKind, SpecReadiness } from "../model/descriptors.js";
import type { SpecSections } from "../model/sections.js";

export const schemaVersion = "0.3.0" as const;

export const graphNodeTypes = ["Primitive", "Pack", "Anchor", "CodeNode"] as const;
export type GraphNodeType = (typeof graphNodeTypes)[number];

export const graphClaims = ["declared", "anchored", "inferred"] as const;
export type GraphClaim = (typeof graphClaims)[number];

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

export const derivedEdgeTypes = ["belongsTo", "satisfies"] as const;
export type DerivedEdgeType = (typeof derivedEdgeTypes)[number];

export const graphEdgeTypes = [...authoredEdgeTypes, ...derivedEdgeTypes] as const;
export type GraphEdgeType = (typeof graphEdgeTypes)[number];

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
  /** Degradable: a non-static title is dropped with a warning, never a hard error (`03` §2). */
  readonly title?: string;
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
   * Node data, not edges: the `03` edge contract has no `modelRefs` edge type — pack coherence
   * reads this at Slice 3 (F4).
   */
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

/** A code anchor's node (the `satisfies` edge contract row: CodeNode → Primitive, anchored). */
export interface CodeNode extends GraphNodeBase {
  readonly nodeType: "CodeNode";
  readonly label?: string;
  readonly file: string;
  readonly line?: number;
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

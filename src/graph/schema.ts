import type { SpecAltitude, SpecKind, SpecReadiness } from "../model/descriptors.js";

export const schemaVersion = "0.1.0" as const;

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
  readonly deliveryFacts?: readonly DeliveryFactName[];
}

export interface PackNode extends GraphNodeBase {
  readonly nodeType: "Pack";
}

export interface AnchorNode extends GraphNodeBase {
  readonly nodeType: "Anchor";
}

export interface CodeNode extends GraphNodeBase {
  readonly nodeType: "CodeNode";
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

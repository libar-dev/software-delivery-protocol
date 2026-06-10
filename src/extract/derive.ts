import { schemaVersion } from "../graph/schema.js";
import type {
  GraphEdge,
  GraphEdgeType,
  GraphNode,
  GraphSchema,
  PackNode,
  PrimitiveNode,
} from "../graph/schema.js";
import type { SpecAltitude, SpecKind, SpecReadiness } from "../model/descriptors.js";
import { SPEC_SECTION_NAMES } from "../model/sections.js";
import type { SpecSections } from "../model/sections.js";
import type { ReifiedPack, ReifiedSpec } from "./reify.js";

interface ReifiedRelation {
  readonly type: GraphEdgeType;
  readonly target: string;
}

function pickSections(data: Record<string, unknown>): SpecSections | undefined {
  const sectionNames = new Set<string>(SPEC_SECTION_NAMES);
  const sections: Record<string, unknown> = {};
  let present = false;

  for (const key of Object.keys(data)) {
    if (sectionNames.has(key)) {
      sections[key] = data[key];
      present = true;
    }
  }

  return present ? sections : undefined;
}

function derivePrimitiveNode(entry: ReifiedSpec): PrimitiveNode {
  const title = entry.data.title;
  const sections = pickSections(entry.data);

  return {
    id: entry.id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: entry.data.kind as SpecKind,
    altitude: entry.data.altitude as SpecAltitude,
    readiness: entry.data.readiness as SpecReadiness,
    ...(typeof title === "string" ? { title } : {}),
    file: entry.file,
    ...(sections === undefined ? {} : { sections }),
  };
}

function derivePackNode(entry: ReifiedPack): PackNode {
  const title = entry.data.title;
  const framing = entry.data.framing;
  const modelRefs = entry.data.modelRefs;

  return {
    id: entry.id,
    nodeType: "Pack",
    claim: "declared",
    ...(typeof title === "string" ? { title } : {}),
    ...(typeof framing === "string" ? { framing } : {}),
    ...(Array.isArray(modelRefs) ? { modelRefs: modelRefs as readonly string[] } : {}),
    file: entry.file,
  };
}

/**
 * The declared layer of the one graph: one `Primitive` node per spec, one `Pack` node per pack,
 * one edge per authored relation, and one derived `belongsTo` edge per manifest entry (spec →
 * pack). `belongsTo` is a deterministic re-expression of the declared manifest, so it inherits its
 * source's claim — there is no 4th claim (`03` §3). A dangling target is emitted, not dropped: the
 * unresolved id itself is the sentinel, and the referential-integrity gate rides Slice 3.
 *
 * Delivery facts stay absent: no anchored edges exist before Slice 2, and a declared `verifies`
 * relation confers nothing — `has-verifier` requires an enabled verifier (a resolvable test
 * binding; binding, never liveness — MD-7).
 */
export function deriveGraph(
  specs: readonly ReifiedSpec[],
  packs: readonly ReifiedPack[],
): GraphSchema {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const entry of specs) {
    nodes.push(derivePrimitiveNode(entry));

    const relations = Array.isArray(entry.data.relations)
      ? (entry.data.relations as readonly ReifiedRelation[])
      : [];

    for (const relation of relations) {
      edges.push({
        from: entry.id,
        type: relation.type,
        to: relation.target,
        claim: "declared",
      });
    }
  }

  for (const entry of packs) {
    nodes.push(derivePackNode(entry));

    const memberIds = Array.isArray(entry.data.specs)
      ? (entry.data.specs as readonly string[])
      : [];

    for (const memberId of memberIds) {
      edges.push({
        from: memberId,
        type: "belongsTo",
        to: entry.id,
        claim: "declared",
      });
    }
  }

  return { schemaVersion, nodes, edges };
}

import { computeDeliveryFacts } from "../graph/delivery-facts.js";
import { schemaVersion } from "../graph/schema.js";
import type {
  AnchorNode,
  CodeNode,
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
import type { ReifiedAnchor } from "./anchors.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
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
  const narrative = entry.data.narrative;
  const sections = pickSections(entry.data);

  return {
    id: entry.id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: entry.data.kind as SpecKind,
    altitude: entry.data.altitude as SpecAltitude,
    readiness: entry.data.readiness as SpecReadiness,
    ...(typeof title === "string" ? { title } : {}),
    ...(typeof narrative === "string" ? { narrative } : {}),
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

/** Test and oracle anchors both ride the `Anchor` node type — the id namespace (`test:` /
 *  `oracle:`) and the binding edge type (`verifies` / `models`) carry the flavor. */
function deriveAnchorNode(entry: ReifiedAnchor): AnchorNode | CodeNode {
  const label = entry.data.label;

  if (entry.flavor === "code") {
    return {
      id: entry.id,
      nodeType: "CodeNode",
      claim: "anchored",
      ...(typeof label === "string" ? { label } : {}),
      file: entry.file,
      line: entry.line,
    };
  }

  return {
    id: entry.id,
    nodeType: "Anchor",
    claim: "anchored",
    ...(typeof label === "string" ? { label } : {}),
    file: entry.file,
    line: entry.line,
  };
}

/**
 * The declared + anchored layers of the one graph: one `Primitive` node per spec, one `Pack` node
 * per pack, one binding node per anchor (`CodeNode` for a code anchor, `Anchor` for a test anchor
 * — the `spec:extraction.derive-graph` edge contract), one edge per authored relation, one derived `belongsTo` per
 * manifest entry, and anchored binding/structural edges per anchor. `memberOf` and `uses` connect
 * CodeNode endpoints only: they confer no delivery fact and deliberately do not join the reader's
 * binding-to-Spec traversal. `belongsTo` is a deterministic re-expression of the declared manifest,
 * so it inherits its source's claim — there is no 4th claim (`spec:extraction.claim-taxonomy`). A dangling target is emitted, not dropped: the unresolved id itself
 * is the sentinel the referential-integrity check (`validateGraph`) flags — but resolution does
 * gate the delivery facts (see `computeDeliveryFacts`). Zero `inferred` claims by decision: the
 * consumers (the reader's entry adapters and file-level impact) resolve off the curated layers
 * (`06` §2), so the first inferred producer is the aspirational impact graph.
 */
export const deriveGraphAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.derive-graph"),
  label: "derives the graph from reified carriers and bindings",
  satisfies: ref("spec:extraction.derive-graph"),
  component: componentAnchorId("component:protocol.extract"),
});

export function deriveGraph(
  specs: readonly ReifiedSpec[],
  packs: readonly ReifiedPack[],
  anchors: readonly ReifiedAnchor[],
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

  for (const entry of anchors) {
    nodes.push(deriveAnchorNode(entry));

    const targetField =
      entry.flavor === "code" ? "satisfies" : entry.flavor === "test" ? "verifies" : "models";
    const target = entry.data[targetField];

    if (typeof target === "string") {
      edges.push({
        from: entry.id,
        type: targetField,
        to: target,
        claim: "anchored",
      });
    }

    if (entry.flavor !== "code") {
      continue;
    }

    const component = entry.data.component;

    if (typeof component === "string") {
      edges.push({
        from: entry.id,
        type: "memberOf",
        to: component,
        claim: "anchored",
      });
    }

    const uses = Array.isArray(entry.data.uses) ? (entry.data.uses as readonly unknown[]) : [];

    for (const dependency of uses) {
      if (typeof dependency === "string") {
        edges.push({
          from: entry.id,
          type: "uses",
          to: dependency,
          claim: "anchored",
        });
      }
    }
  }

  const deliveryFacts = computeDeliveryFacts(nodes, edges);
  const decoratedNodes = nodes.map((node) => {
    if (node.nodeType !== "Primitive") {
      return node;
    }

    const facts = deliveryFacts.get(node.id);

    return facts === undefined ? node : { ...node, deliveryFacts: facts };
  });

  return { schemaVersion, nodes: decoratedNodes, edges };
}

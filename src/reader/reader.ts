import { computeDeliveryFacts } from "../graph/delivery-facts.js";
import { authoredEdgeTypes } from "../graph/schema.js";
import type {
  DeliveryFactName,
  GraphClaim,
  GraphEdge,
  GraphEdgeType,
  GraphNodeType,
  GraphSchema,
  PackNode,
  PrimitiveNode,
} from "../graph/schema.js";
import { SPEC_KIND_DISPLAY_LABELS } from "../model/descriptors.js";
import type { SpecAltitude, SpecKind, SpecReadiness } from "../model/descriptors.js";
import type { SpecSections } from "../model/sections.js";
import type { Finding } from "../validate/contracts.js";
import { buildGraphIndex } from "../validate/graph-index.js";
import type { GraphIndex } from "../validate/graph-index.js";
import { deriveReadiness, evaluateReadinessFloor } from "../validate/readiness-floor.js";
import type { ReadinessFloorFailure } from "../validate/readiness-floor.js";
import { validateGraph } from "../validate/validators.js";

/* ----- the plain, composable result shapes (the agent scripts these) ----- */

/** A spec row — the envelope plus the decoded derived data every consumer starts from. */
export interface SpecSummary {
  readonly id: string;
  readonly title?: string;
  readonly specKind: SpecKind;
  /** Present only for ratified kinds — the "adopt the nouns" display coordinate. */
  readonly kindDisplayLabel?: string;
  readonly altitude: SpecAltitude;
  /** The author's statement (the envelope's `readiness`) — stated, never "claimed". */
  readonly statedReadiness: SpecReadiness;
  /** The highest structurally-cleared rung (`05` §3); `undefined` when even `idea`'s clauses fail. */
  readonly derivedReadiness?: SpecReadiness;
  /** Recomputed by the one derivation rule — identical to the node's stated facts on extractor output, fail-closed otherwise. */
  readonly deliveryFacts: readonly DeliveryFactName[];
  readonly file: string;
  /** Pack ids the spec belongs to (derived `belongsTo` edges). */
  readonly packs: readonly string[];
}

export interface PackSummary {
  readonly id: string;
  readonly title?: string;
  readonly framing?: string;
  readonly file: string;
  readonly modelRefs: readonly string[];
}

/** One decoded relation end: the edge, its `claim`, and the other endpoint's display data. */
export interface RelationEnd {
  readonly type: GraphEdgeType;
  readonly claim: GraphClaim;
  readonly otherId: string;
  /** False when the other endpoint is absent from the graph (referential integrity's finding). */
  readonly resolved: boolean;
  readonly otherNodeType?: GraphNodeType;
  readonly otherTitle?: string;
}

/** A code binding (`satisfies` from a `CodeNode`) decoded to its source location. */
export interface ImplementationBinding {
  readonly codeId: string;
  readonly claim: GraphClaim;
  readonly label?: string;
  readonly file?: string;
  readonly line?: number;
}

/**
 * A verifier decoded with its enabled-status — the cross-source join an agent hand-rolling gets
 * wrong: a test anchor's `verifies` is `anchored` and is itself the binding; an example's
 * declared `verifies` confers `has-verifier` only when the example is *enabled* (a resolving test
 * anchor binds the example — MD-7, binding never liveness).
 */
export interface VerifierBinding {
  readonly verifierId: string;
  readonly via: "test-anchor" | "example";
  readonly claim: GraphClaim;
  readonly enabled: boolean;
  readonly label?: string;
  readonly file?: string;
  readonly line?: number;
}

/** The irreducible per-spec join — what a Design Review renders and an agent starts from. */
export interface SpecContext extends SpecSummary {
  readonly sections?: SpecSections;
  readonly floorFailures: readonly ReadinessFloorFailure[];
  /** The spec's authored relations (declared edges of authored types; `belongsTo` rides `packs`). */
  readonly relationsOut: readonly RelationEnd[];
  /** Authored-type edges pointing at the spec — who refines / depends on / verifies it. */
  readonly relationsIn: readonly RelationEnd[];
  readonly implementations: readonly ImplementationBinding[];
  readonly verifiers: readonly VerifierBinding[];
  /** The graph findings naming this spec (as subject or related) — the holes beside the assertions. */
  readonly findings: readonly Finding[];
}

export interface PackMemberSummary {
  readonly id: string;
  /** False when the manifest names a member absent from the graph. */
  readonly resolved: boolean;
  readonly title?: string;
  readonly specKind?: SpecKind;
  readonly altitude?: SpecAltitude;
  readonly statedReadiness?: SpecReadiness;
  readonly derivedReadiness?: SpecReadiness;
  readonly deliveryFacts: readonly DeliveryFactName[];
}

/** A member with no verifier binding — `ready` ones are the priority slice (JS-G4). */
export interface PackVerifierGap {
  readonly id: string;
  readonly statedReadiness?: SpecReadiness;
  readonly priority: boolean;
}

/** The pack reviewed as a unit: members, vocabulary refs, and the verifier gaps. */
export interface PackContext extends PackSummary {
  readonly members: readonly PackMemberSummary[];
  readonly verifierGaps: readonly PackVerifierGap[];
  readonly findings: readonly Finding[];
}

export type ConceptMatchField = "id" | "title" | "label" | "framing" | `sections.${string}`;

/** Where a concept search hit: the node plus the fields that matched. */
export interface ConceptMatch {
  readonly id: string;
  readonly nodeType: GraphNodeType;
  readonly title?: string;
  readonly matchedIn: readonly ConceptMatchField[];
}

export interface FileNodeRef {
  readonly id: string;
  readonly nodeType: GraphNodeType;
  readonly line?: number;
}

/** The file→graph bridge: what the graph records at a path, and the specs reachable from it. */
export interface FileEntry {
  readonly path: string;
  readonly nodes: readonly FileNodeRef[];
  /** Spec ids authored at the path, plus the targets of binding edges originating at it. */
  readonly specs: readonly string[];
}

/** Why a spec/pack is directly impacted: the changed file, and the binding that reached it. */
export interface ImpactReason {
  readonly file: string;
  /** Present when the impact travels through a binding node at the changed file. */
  readonly throughBinding?: {
    readonly id: string;
    readonly edgeType: GraphEdgeType;
    readonly claim: GraphClaim;
  };
}

export interface ImpactedItem {
  readonly id: string;
  readonly reasons: readonly ImpactReason[];
}

/** An at-risk reason is the connecting edge itself — fully explicit, `claim` carried (JS-G1). */
export interface AtRiskReason {
  readonly from: string;
  readonly edgeType: GraphEdgeType;
  readonly to: string;
  readonly claim: GraphClaim;
}

export interface AtRiskItem {
  readonly id: string;
  readonly nodeType: GraphNodeType;
  readonly title?: string;
  readonly reasons: readonly AtRiskReason[];
}

/**
 * File-level blast-radius (`06` §2): directly impacted specs/packs, their one-hop neighborhood
 * with the connecting edges named, and — honesty about the blind spot — every changed file the
 * graph records nothing at, surfaced as `coverageUnknown`, never silently dropped. The answer
 * never claims exhaustive reach: deeper walks are scripts over the same shapes, and symbol-level
 * reach is the aspirational impact graph.
 */
export interface BlastRadius {
  readonly changedFiles: readonly string[];
  readonly impactedSpecs: readonly ImpactedItem[];
  readonly impactedPacks: readonly ImpactedItem[];
  readonly atRisk: readonly AtRiskItem[];
  readonly coverageUnknown: readonly string[];
}

/* ----- the reader ----- */

/**
 * The thin typed loader behind the agent surface (`06` §3): joins, `claim` decode, delivery-fact
 * recomputation, derived readiness, and the validation findings are done **once at construction**;
 * accessors return plain, composable, deterministically-sorted data; nothing is persisted — a
 * front door, not a store, rebuilt fresh each load. Frozen here is only the irreducible set
 * (entry adapters · file-level blast-radius · the per-spec/per-pack joins); everything else —
 * single-field traversals, group-bys, the maturity ladder — stays a script over `graph` and the
 * flat accessors. `bySymbol` is deliberately absent, not stubbed: it rides the aspirational
 * impact graph, and a method that throws would fake the capability its absence honestly hides.
 *
 * Not a second validation path (MD-14): `findings()` exposes `validateGraph`'s output — the one
 * seam, called, never re-implemented. Exposed delivery facts are the recomputed ones (the one
 * derivation rule): identical to the nodes' stated facts on extractor output by construction;
 * for a foreign producer the divergence is already the delivery-facts honesty error, surfaced
 * through `findings()`.
 */
export interface Reader {
  readonly graph: GraphSchema;
  specs(): readonly SpecSummary[];
  packs(): readonly PackSummary[];
  findings(): readonly Finding[];
  /** The grep→graph bridge from a string: deterministic substring match, never fuzzy-scored. */
  findByConcept(text: string): readonly ConceptMatch[];
  /** The grep→graph bridge from a file (extraction-root-relative POSIX path, the graph's currency). */
  byFile(path: string): FileEntry;
  /** The grep→graph bridge from a changeset — file-level, `coverage-unknown` honest (`06` §2). */
  blastRadius(changedFiles: readonly string[]): BlastRadius;
  specContext(id: string): SpecContext | undefined;
  packContext(id: string): PackContext | undefined;
}

function compareCodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

const authoredEdgeTypeSet: ReadonlySet<string> = new Set(authoredEdgeTypes);

function normalizePath(path: string): string {
  return path.startsWith("./") ? path.slice(2) : path;
}

function titleOf(index: GraphIndex, id: string): string | undefined {
  const node = index.nodesById.get(id);

  if (node === undefined || node.nodeType === "Anchor" || node.nodeType === "CodeNode") {
    return undefined;
  }

  return node.title;
}

/** The display label, total over foreign data: an unratified kind has no display coordinate. */
function kindDisplayLabelOf(kind: string): string | undefined {
  return (SPEC_KIND_DISPLAY_LABELS as Readonly<Record<string, string>>)[kind];
}

function relationEnd(index: GraphIndex, edge: GraphEdge, otherId: string): RelationEnd {
  const other = index.nodesById.get(otherId);

  return {
    type: edge.type,
    claim: edge.claim,
    otherId,
    resolved: other !== undefined,
    ...(other === undefined ? {} : { otherNodeType: other.nodeType }),
    ...(titleOf(index, otherId) === undefined ? {} : { otherTitle: titleOf(index, otherId) }),
  };
}

function compareRelationEnds(left: RelationEnd, right: RelationEnd): number {
  return compareCodeUnits(left.type, right.type) || compareCodeUnits(left.otherId, right.otherId);
}

/** Deep scan of reified section content for a substring; returns matched section names. */
function matchSections(sections: SpecSections | undefined, needle: string): readonly string[] {
  if (sections === undefined) {
    return [];
  }

  const containsNeedle = (value: unknown, includeKeys: boolean): boolean => {
    if (typeof value === "string") {
      return value.toLowerCase().includes(needle);
    }

    if (Array.isArray(value)) {
      return value.some((entry) => containsNeedle(entry, includeKeys));
    }

    if (typeof value === "object" && value !== null) {
      return Object.entries(value as Record<string, unknown>).some(
        ([key, entry]) =>
          (includeKeys && key.toLowerCase().includes(needle)) || containsNeedle(entry, includeKeys),
      );
    }

    return false;
  };

  const matched: string[] = [];

  for (const [name, content] of Object.entries(sections as Record<string, unknown>)) {
    // String values are content everywhere; record keys are content only in `model.terms`, where
    // the keys *are* the vocabulary (`02` §3) — structural keys (`given`, `outcome`) never match.
    if (containsNeedle(content, name === "model")) {
      matched.push(name);
    }
  }

  return matched.sort(compareCodeUnits);
}

export function createReader(graph: GraphSchema): Reader {
  const index = buildGraphIndex(graph);
  const recomputedFacts = computeDeliveryFacts(graph.nodes, graph.edges);
  const allFindings = validateGraph(graph).findings;

  const factsOf = (id: string): readonly DeliveryFactName[] => recomputedFacts.get(id) ?? [];

  const packsOf = (specId: string): readonly string[] =>
    (index.edgesByFrom.get(specId) ?? [])
      .filter((edge) => edge.type === "belongsTo")
      .map((edge) => edge.to)
      .sort(compareCodeUnits);

  const summarize = (node: PrimitiveNode): SpecSummary => {
    const derived = deriveReadiness(node, index);
    const displayLabel = kindDisplayLabelOf(node.specKind);

    return {
      id: node.id,
      ...(node.title === undefined ? {} : { title: node.title }),
      specKind: node.specKind,
      ...(displayLabel === undefined ? {} : { kindDisplayLabel: displayLabel }),
      altitude: node.altitude,
      statedReadiness: node.readiness,
      ...(derived === undefined ? {} : { derivedReadiness: derived }),
      deliveryFacts: factsOf(node.id),
      file: node.file,
      packs: packsOf(node.id),
    };
  };

  const summarizePack = (node: PackNode): PackSummary => ({
    id: node.id,
    ...(node.title === undefined ? {} : { title: node.title }),
    ...(node.framing === undefined ? {} : { framing: node.framing }),
    file: node.file,
    modelRefs: node.modelRefs ?? [],
  });

  const primitiveNodes = (): readonly PrimitiveNode[] =>
    [...index.primitivesById.values()].sort((left, right) => compareCodeUnits(left.id, right.id));

  const packNodes = (): readonly PackNode[] =>
    [...index.nodesById.values()]
      .filter((node): node is PackNode => node.nodeType === "Pack")
      .sort((left, right) => compareCodeUnits(left.id, right.id));

  const findingsNaming = (id: string): readonly Finding[] =>
    allFindings.filter((finding) => finding.subjectId === id || finding.relatedId === id);

  const specContext = (id: string): SpecContext | undefined => {
    const node = index.primitivesById.get(id);

    if (node === undefined) {
      return undefined;
    }

    const relationsOut = (index.edgesByFrom.get(id) ?? [])
      .filter((edge) => edge.claim === "declared" && authoredEdgeTypeSet.has(edge.type))
      .map((edge) => relationEnd(index, edge, edge.to))
      .sort(compareRelationEnds);

    const relationsIn = (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.claim === "declared" && authoredEdgeTypeSet.has(edge.type))
      .map((edge) => relationEnd(index, edge, edge.from))
      .sort(compareRelationEnds);

    const implementations = (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.type === "satisfies")
      .map((edge): ImplementationBinding => {
        const source = index.nodesById.get(edge.from);
        const location =
          source?.nodeType === "CodeNode"
            ? {
                ...(source.label === undefined ? {} : { label: source.label }),
                file: source.file,
                ...(source.line === undefined ? {} : { line: source.line }),
              }
            : {};

        return { codeId: edge.from, claim: edge.claim, ...location };
      })
      .sort((left, right) => compareCodeUnits(left.codeId, right.codeId));

    const anchorVerified = (verifierId: string): boolean =>
      (index.edgesByTo.get(verifierId) ?? []).some(
        (edge) =>
          edge.type === "verifies" && edge.claim === "anchored" && index.nodesById.has(edge.from),
      );

    const verifiers = (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.type === "verifies")
      .map((edge): VerifierBinding => {
        const source = index.nodesById.get(edge.from);

        if (source?.nodeType === "Anchor") {
          return {
            verifierId: edge.from,
            via: "test-anchor",
            claim: edge.claim,
            // A resolving test anchor *is* the enabled binding (MD-7).
            enabled: true,
            ...(source.label === undefined ? {} : { label: source.label }),
            file: source.file,
            line: source.line,
          };
        }

        const example = index.primitivesById.get(edge.from);
        const enabled = example?.specKind === "example" && anchorVerified(example.id);

        return {
          verifierId: edge.from,
          via: "example",
          claim: edge.claim,
          enabled,
          ...(example?.title === undefined ? {} : { label: example.title }),
          ...(example === undefined ? {} : { file: example.file }),
        };
      })
      .sort((left, right) => compareCodeUnits(left.verifierId, right.verifierId));

    return {
      ...summarize(node),
      ...(node.sections === undefined ? {} : { sections: node.sections }),
      floorFailures: evaluateReadinessFloor(node, index),
      relationsOut,
      relationsIn,
      implementations,
      verifiers,
      findings: findingsNaming(id),
    };
  };

  const packContext = (id: string): PackContext | undefined => {
    const node = index.nodesById.get(id);

    if (node?.nodeType !== "Pack") {
      return undefined;
    }

    const members = (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.type === "belongsTo")
      .map((edge): PackMemberSummary => {
        const member = index.primitivesById.get(edge.from);

        if (member === undefined) {
          return { id: edge.from, resolved: false, deliveryFacts: [] };
        }

        const summary = summarize(member);

        return {
          id: summary.id,
          resolved: true,
          ...(summary.title === undefined ? {} : { title: summary.title }),
          specKind: summary.specKind,
          altitude: summary.altitude,
          statedReadiness: summary.statedReadiness,
          ...(summary.derivedReadiness === undefined
            ? {}
            : { derivedReadiness: summary.derivedReadiness }),
          deliveryFacts: summary.deliveryFacts,
        };
      })
      .sort((left, right) => compareCodeUnits(left.id, right.id));

    const verifierGaps = members
      .filter((member) => member.resolved && !member.deliveryFacts.includes("has-verifier"))
      .map(
        (member): PackVerifierGap => ({
          id: member.id,
          ...(member.statedReadiness === undefined
            ? {}
            : { statedReadiness: member.statedReadiness }),
          priority: member.statedReadiness === "ready",
        }),
      );

    return {
      ...summarizePack(node),
      members,
      verifierGaps,
      findings: findingsNaming(id),
    };
  };

  const findByConcept = (text: string): readonly ConceptMatch[] => {
    const needle = text.toLowerCase().trim();

    if (needle.length === 0) {
      return [];
    }

    const fieldRank: Readonly<Record<string, number>> = {
      id: 0,
      title: 1,
      label: 2,
      framing: 3,
    };
    const rankOf = (field: ConceptMatchField): number => fieldRank[field] ?? 4;
    const matches: { match: ConceptMatch; bestRank: number }[] = [];

    for (const node of [...index.nodesById.values()].sort((left, right) =>
      compareCodeUnits(left.id, right.id),
    )) {
      const matchedIn: ConceptMatchField[] = [];

      if (node.id.toLowerCase().includes(needle)) {
        matchedIn.push("id");
      }

      if (node.nodeType === "Primitive" || node.nodeType === "Pack") {
        if (node.title?.toLowerCase().includes(needle) === true) {
          matchedIn.push("title");
        }
      } else if (node.label?.toLowerCase().includes(needle) === true) {
        matchedIn.push("label");
      }

      if (node.nodeType === "Pack" && node.framing?.toLowerCase().includes(needle) === true) {
        matchedIn.push("framing");
      }

      if (node.nodeType === "Primitive") {
        for (const section of matchSections(node.sections, needle)) {
          matchedIn.push(`sections.${section}`);
        }
      }

      if (matchedIn.length === 0) {
        continue;
      }

      matches.push({
        match: {
          id: node.id,
          nodeType: node.nodeType,
          ...(titleOf(index, node.id) === undefined ? {} : { title: titleOf(index, node.id) }),
          matchedIn,
        },
        bestRank: Math.min(...matchedIn.map(rankOf)),
      });
    }

    return matches
      .sort(
        (left, right) =>
          left.bestRank - right.bestRank || compareCodeUnits(left.match.id, right.match.id),
      )
      .map((entry) => entry.match);
  };

  const byFile = (path: string): FileEntry => {
    const normalized = normalizePath(path);
    const nodes: FileNodeRef[] = [];
    const specIds = new Set<string>();

    for (const node of graph.nodes) {
      if (node.file !== normalized) {
        continue;
      }

      nodes.push({
        id: node.id,
        nodeType: node.nodeType,
        ...(node.nodeType === "Primitive" || node.nodeType === "Pack" || node.line === undefined
          ? {}
          : { line: node.line }),
      });

      if (node.nodeType === "Primitive") {
        specIds.add(node.id);
        continue;
      }

      // A binding node at the path reaches the specs its binding edges name — recorded targets,
      // resolution left to referential integrity.
      for (const edge of index.edgesByFrom.get(node.id) ?? []) {
        if (edge.type === "satisfies" || edge.type === "verifies") {
          specIds.add(edge.to);
        }
      }
    }

    return {
      path: normalized,
      nodes: nodes.sort((left, right) => compareCodeUnits(left.id, right.id)),
      specs: [...specIds].sort(compareCodeUnits),
    };
  };

  const blastRadius = (changedFiles: readonly string[]): BlastRadius => {
    const normalized = [...new Set(changedFiles.map(normalizePath))].sort(compareCodeUnits);
    const impactedSpecReasons = new Map<string, ImpactReason[]>();
    const impactedPackReasons = new Map<string, ImpactReason[]>();
    const coverageUnknown: string[] = [];

    const appendReason = (
      map: Map<string, ImpactReason[]>,
      id: string,
      reason: ImpactReason,
    ): void => {
      const list = map.get(id) ?? [];
      list.push(reason);
      map.set(id, list);
    };

    for (const file of normalized) {
      const entry = byFile(file);

      if (entry.nodes.length === 0) {
        // The honest blind spot (`06` §2): a changed file the graph records nothing at is named,
        // never silently dropped — file-level reach must not read as exhaustive.
        coverageUnknown.push(file);
        continue;
      }

      for (const ref of entry.nodes) {
        if (ref.nodeType === "Primitive") {
          appendReason(impactedSpecReasons, ref.id, { file });
          continue;
        }

        if (ref.nodeType === "Pack") {
          appendReason(impactedPackReasons, ref.id, { file });
          continue;
        }

        for (const edge of index.edgesByFrom.get(ref.id) ?? []) {
          if (edge.type === "satisfies" || edge.type === "verifies") {
            appendReason(impactedSpecReasons, edge.to, {
              file,
              throughBinding: { id: ref.id, edgeType: edge.type, claim: edge.claim },
            });
          }
        }
      }
    }

    const changedFileSet = new Set(normalized);
    const impactedIds = new Set([...impactedSpecReasons.keys(), ...impactedPackReasons.keys()]);
    const atRiskReasons = new Map<string, AtRiskReason[]>();

    // One explicit hop from every impacted node, any edge type and direction, `claim` carried —
    // a node whose own file changed is the change, not the risk, and is excluded.
    for (const impactedId of impactedIds) {
      const incident = [
        ...(index.edgesByFrom.get(impactedId) ?? []),
        ...(index.edgesByTo.get(impactedId) ?? []),
      ];

      for (const edge of incident) {
        const otherId = edge.from === impactedId ? edge.to : edge.from;
        const other = index.nodesById.get(otherId);

        if (other === undefined || impactedIds.has(otherId) || changedFileSet.has(other.file)) {
          continue;
        }

        const list = atRiskReasons.get(otherId) ?? [];
        list.push({ from: edge.from, edgeType: edge.type, to: edge.to, claim: edge.claim });
        atRiskReasons.set(otherId, list);
      }
    }

    const toImpacted = (map: Map<string, ImpactReason[]>): readonly ImpactedItem[] =>
      [...map.entries()]
        .map(([id, reasons]) => ({
          id,
          reasons: reasons.sort(
            (left, right) =>
              compareCodeUnits(left.file, right.file) ||
              compareCodeUnits(left.throughBinding?.id ?? "", right.throughBinding?.id ?? ""),
          ),
        }))
        .sort((left, right) => compareCodeUnits(left.id, right.id));

    const atRisk = [...atRiskReasons.entries()]
      .map(([id, reasons]): AtRiskItem => {
        const node = index.nodesById.get(id);
        const title = titleOf(index, id);

        return {
          id,
          nodeType: node?.nodeType ?? "Primitive",
          ...(title === undefined ? {} : { title }),
          reasons: reasons.sort(
            (left, right) =>
              compareCodeUnits(left.from, right.from) ||
              compareCodeUnits(left.edgeType, right.edgeType) ||
              compareCodeUnits(left.to, right.to),
          ),
        };
      })
      .sort((left, right) => compareCodeUnits(left.id, right.id));

    return {
      changedFiles: normalized,
      impactedSpecs: toImpacted(impactedSpecReasons),
      impactedPacks: toImpacted(impactedPackReasons),
      atRisk,
      coverageUnknown,
    };
  };

  return {
    graph,
    specs: () => primitiveNodes().map(summarize),
    packs: () => packNodes().map(summarizePack),
    findings: () => allFindings,
    findByConcept,
    byFile,
    blastRadius,
    specContext,
    packContext,
  };
}

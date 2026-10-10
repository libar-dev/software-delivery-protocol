import {
  computeDeliveryFacts,
  isEnabledExampleVerify,
  isResolvingTestAnchorVerify,
} from "../graph/delivery-facts.js";
import { isResolvingOracleModel } from "../graph/oracle-bindings.js";
import { authoredEdgeTypes } from "../graph/schema.js";
import type {
  AuthoredEdgeType,
  DeliveryFactName,
  EntryLocation,
  GraphClaim,
  GraphEdge,
  GraphEdgeType,
  GraphNodeType,
  GraphSchema,
  PackNode,
  PrimitiveNode,
} from "../graph/schema.js";
import type { CodeAnchorLayer } from "../model/anchors.js";
import { SPEC_KIND_DISPLAY_LABELS, SPEC_READINESS } from "../model/descriptors.js";
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
  /** Authored prose owned by the Spec itself, distinct from section descriptions. */
  readonly narrative?: string;
  readonly specKind: SpecKind;
  /** Present only for ratified kinds — the "adopt the nouns" display coordinate. */
  readonly kindDisplayLabel?: string;
  readonly altitude: SpecAltitude;
  /** The author's statement (the envelope's `readiness`) — stated, never "claimed". */
  readonly statedReadiness: SpecReadiness;
  /** The highest structurally-cleared rung (`spec:validation.readiness-floor`); `undefined` when even `idea`'s clauses fail. */
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

/**
 * The component a code unit belongs to: the target of its `memberOf` edge, with the layer and
 * context that component's anchor states. An unresolved target keeps its id and carries neither.
 */
export interface CodeUnitComponent {
  readonly id: string;
  readonly layer?: CodeAnchorLayer;
  readonly context?: string;
}

/**
 * A code unit at the source end of a binding edge, decoded to its source location and its
 * structural attributes (`spec:decisions.architectural-annotation`): `role` on any code unit,
 * `layer` and `context` on a `component:` unit, and the component the unit belongs to
 * (`spec:consumers.pack-design`). The attributes are carried as recorded; none of them confers
 * anything.
 */
export interface CodeUnitBinding {
  readonly codeId: string;
  readonly claim: GraphClaim;
  readonly label?: string;
  readonly file?: string;
  readonly line?: number;
  readonly role?: string;
  readonly layer?: CodeAnchorLayer;
  readonly context?: string;
  readonly component?: CodeUnitComponent;
}

/** A code binding (`satisfies` from a `CodeNode`) decoded to its source location. */
export type ImplementationBinding = CodeUnitBinding;

/**
 * A design reference (`references` from a `CodeNode`): this code answers to the Spec's design
 * without claiming to realize it (`spec:decisions.anchor-binding-grain`). It confers no delivery
 * fact and moves no floor, so it rides beside the implementations, never inside them.
 */
export type ReferenceBinding = CodeUnitBinding;

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

/** An oracle anchor's binding (`models`, anchored): the graph records that an expected-outcome
 *  oracle for this spec's example space *exists* — never what it says (settlement 8; no
 *  delivery fact rides this). */
export interface OracleBinding {
  readonly anchorId: string;
  readonly claim: GraphClaim;
  readonly label?: string;
  readonly file?: string;
  readonly line?: number;
}

/** The irreducible per-spec join — what a Design Review renders and an agent starts from. */
export interface SpecContext extends SpecSummary {
  readonly sections?: SpecSections;
  readonly floorFailures: readonly ReadinessFloorFailure[];
  /**
   * The unmet clauses of the rung above derived readiness (`idea` when no rung derives), by the
   * same evaluator; empty when derived readiness is `ready`. A report, never a promotion
   * (`spec:validation.next-rung-floor`).
   */
  readonly nextRungFailures: readonly ReadinessFloorFailure[];
  /** The spec's authored relations (declared edges of authored types; `belongsTo` rides `packs`). */
  readonly relationsOut: readonly RelationEnd[];
  /** Authored-type edges pointing at the spec — who refines / depends on / verifies it. */
  readonly relationsIn: readonly RelationEnd[];
  readonly implementations: readonly ImplementationBinding[];
  /** The code units that reference the Spec: they answer to its design, conferring nothing. */
  readonly references: readonly ReferenceBinding[];
  readonly verifiers: readonly VerifierBinding[];
  readonly oracle?: OracleBinding;
  /**
   * The location-table rows of this Spec (`spec:extraction.entry-locations`), sorted by entry in
   * code-unit order: where each keyed entry and open question is written. Empty when the graph
   * locates none; a missing row reads as not located, never as absent.
   */
  readonly entryLocations: readonly EntryLocation[];
  /** The graph findings naming this spec (as subject or related) — the holes beside the assertions. */
  readonly findings: readonly Finding[];
}

/** One open question of a Pack member, with its position, flag, key and recorded line. */
export interface PackMemberQuestion {
  /** The question's position among the Spec's authored open questions, from 0. */
  readonly index: number;
  readonly question: string;
  readonly blocking: boolean;
  readonly key?: string;
  /** The line the location table records for `question[<index>]`; absent when not located. */
  readonly line?: number;
}

/** A decision a Pack member names through `decidedBy`; unresolved when the target is no Spec. */
export interface PackMemberDecision {
  readonly id: string;
  readonly title?: string;
  readonly statedReadiness?: SpecReadiness;
  readonly resolved: boolean;
}

/**
 * A Pack member's design columns (`spec:consumers.pack-design`): counts and lists read from the
 * graph, never a score or a rung. `entries` counts the keyed `design` and `ui` entries other than
 * `description`; `declarations` counts the `design` entries whose value opens with a code span
 * (the pinned-declaration rule of `spec:extraction.contract-declarations`).
 */
export interface PackMemberDesign {
  readonly entries: number;
  readonly declarations: number;
  readonly blockingQuestions: number;
  readonly openQuestions: readonly PackMemberQuestion[];
  readonly decisions: readonly PackMemberDecision[];
}

/** A count beside how many of the counted bindings are enabled. */
export interface EnabledCount {
  readonly total: number;
  readonly enabled: number;
}

/**
 * A Pack member row. A resolved member carries its design (`spec:consumers.pack-design`); an
 * unresolved member keeps `id`, `resolved: false` and empty `deliveryFacts`, and nothing else.
 */
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
  readonly file?: string;
  /** The rung above the stated rung; absent when the member states `ready`. */
  readonly statedNextRung?: SpecReadiness;
  /**
   * The floor's unmet clauses with the stated next rung as target, by the one evaluator. Empty
   * when the floor already holds that rung, a rung that waits for its author and never a
   * promotion, or when there is no next rung. `SpecContext.nextRungFailures` reads the rung above
   * the floor reached instead; the two readings never share a name.
   */
  readonly statedNextRungFailures?: readonly ReadinessFloorFailure[];
  readonly design?: PackMemberDesign;
  readonly implementations?: readonly ImplementationBinding[];
  readonly references?: readonly ReferenceBinding[];
  /** Every decoded verifier, and how many are enabled. */
  readonly verifiers?: EnabledCount;
  /** The examples that declare `verifies` on the member, and how many are enabled. */
  readonly examples?: EnabledCount;
}

/** The members an outside Spec joins under one authored relation type, in authored member order. */
export interface PackBoundaryVia {
  readonly type: AuthoredEdgeType;
  readonly members: readonly string[];
}

/** A Spec outside the Pack joined to members by authored relations. */
export interface PackBoundaryRow {
  readonly id: string;
  readonly title?: string;
  readonly statedReadiness: SpecReadiness;
  /** Whether the outside Spec carries the `implemented` delivery fact. */
  readonly implemented: boolean;
  /** One entry per relation type, in the closed list's authored order. */
  readonly via: readonly PackBoundaryVia[];
}

/**
 * The Specs outside the Pack joined to a member (`spec:consumers.pack-design`): `restsOn` lists
 * those a member `refines`, `dependsOn`, is `constrainedBy` or `decidedBy`; `restedOnBy` lists
 * those relating to a member by any authored relation. Rows sort by id in code-unit order.
 */
export interface PackBoundary {
  readonly restsOn: readonly PackBoundaryRow[];
  readonly restedOnBy: readonly PackBoundaryRow[];
}

/** A member with no verifier binding — `ready` ones are the priority slice (JS-G4). */
export interface PackVerifierGap {
  readonly id: string;
  readonly statedReadiness?: SpecReadiness;
  readonly priority: boolean;
}

/** The pack reviewed as a unit: members, vocabulary refs, the verifier gaps, and its boundary. */
export interface PackContext extends PackSummary {
  readonly members: readonly PackMemberSummary[];
  readonly verifierGaps: readonly PackVerifierGap[];
  readonly boundary: PackBoundary;
  readonly findings: readonly Finding[];
}

export type ConceptMatchField =
  | "id"
  | "title"
  | "label"
  | "framing"
  | "narrative"
  | `sections.${string}`;

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

/**
 * The file→graph bridge: what the graph records at a path, and the specs reachable from it. A
 * code unit with no `satisfies` or `references` edge is still listed in `nodes`; the Spec list
 * may then be empty (an identity-only anchor is lawful).
 */
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

/** A changed code unit the graph records with no Spec linkage: no `satisfies`, no `references`. */
export interface UnlinkedCodeUnit {
  readonly file: string;
  readonly id: string;
}

/**
 * File-level blast-radius (`06` §2): directly impacted specs/packs, their one-hop neighborhood
 * with the connecting edges named, and — honesty about the blind spot — every changed file the
 * graph records nothing at, surfaced as `coverageUnknown`, never silently dropped. A changed code
 * unit with no Spec linkage is recorded, so its file is not `coverageUnknown`; it is listed in
 * `unlinked` instead, never dropped and never read as coverage. The answer never claims
 * exhaustive reach: deeper walks are scripts over the same shapes, and symbol-level reach is the
 * aspirational impact graph.
 */
/**
 * @sdpAnchor impl:protocol.reader-impact
 * @sdpLabel file-level reader blast-radius contract
 * @sdpSatisfies spec:consumers.reader
 * @sdpComponent component:protocol.reader
 * @sdpRole contract
 */
export interface BlastRadius {
  readonly changedFiles: readonly string[];
  readonly impactedSpecs: readonly ImpactedItem[];
  readonly impactedPacks: readonly ImpactedItem[];
  readonly atRisk: readonly AtRiskItem[];
  readonly coverageUnknown: readonly string[];
  readonly unlinked: readonly UnlinkedCodeUnit[];
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
    // the keys *are* the vocabulary (`spec:model.spec-sections`) — structural keys (`given`,
    // `outcome`) never match.
    if (containsNeedle(content, name === "model")) {
      matched.push(name);
    }
  }

  return matched.sort(compareCodeUnits);
}

/* ----- the Pack design (`spec:consumers.pack-design`) ----- */

/** A value that opens with a code span, by recipe 24's rule: a declaration as authored. */
const pinnedDeclaration = /^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u;

/** The relation types by which a member rests on a Spec outside its Pack. */
const restsOnTypes: ReadonlySet<string> = new Set([
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
]);

function asPlainRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : undefined;
}

/** The keyed entries of an open section (`design`, `ui`), `description` excluded. */
function keyedEntries(content: unknown): readonly (readonly [string, unknown])[] {
  return Object.entries(asPlainRecord(content) ?? {}).filter(([key]) => key !== "description");
}

/** The rung above a stated rung; none above `ready`, and none for an unratified statement. */
function statedNextRungOf(stated: SpecReadiness): SpecReadiness | undefined {
  const position = SPEC_READINESS.indexOf(stated);

  return position < 0 ? undefined : SPEC_READINESS[position + 1];
}

/**
 * The Pack design: each member's stated next rung, design columns, bindings and verifier counts,
 * and the Pack's boundary, assembled once on the Pack context from the graph alone.
 *
 * @sdpAnchor impl:protocol.pack-design
 * @sdpLabel assembles the Pack design on the Pack context
 * @sdpSatisfies spec:consumers.pack-design
 * @sdpReferences spec:extraction.entry-locations, spec:extraction.contract-declarations
 * @sdpComponent component:protocol.reader
 * @sdpUses impl:protocol.next-rung-floor
 * @sdpRole reader
 */
function packMemberDesign(
  node: PrimitiveNode,
  index: GraphIndex,
  locations: readonly EntryLocation[],
): PackMemberDesign {
  const designEntries = keyedEntries(node.sections?.design);
  const lineOf = new Map(locations.map((row) => [row.entry, row.line]));
  const authored: unknown = node.sections?.intent?.openQuestions;
  const openQuestions: PackMemberQuestion[] = [];

  // Malformed entries are the validators' finding; they keep their position and are skipped.
  (Array.isArray(authored) ? (authored as readonly unknown[]) : []).forEach((entry, position) => {
    const record = typeof entry === "string" ? undefined : asPlainRecord(entry);
    const question = typeof entry === "string" ? entry : record?.question;

    if (typeof question !== "string" || question.trim().length === 0) {
      return;
    }

    const key = record?.key;
    const line = lineOf.get(`question[${String(position)}]`);
    openQuestions.push({
      index: position,
      question,
      blocking: record?.blocking === true,
      ...(typeof key === "string" ? { key } : {}),
      ...(line === undefined ? {} : { line }),
    });
  });

  const decisionIds = new Set(
    (index.edgesByFrom.get(node.id) ?? [])
      .filter((edge) => edge.type === "decidedBy" && edge.claim === "declared")
      .map((edge) => edge.to),
  );
  const decisions = [...decisionIds].sort(compareCodeUnits).map((id): PackMemberDecision => {
    const target = index.primitivesById.get(id);

    return target === undefined
      ? { id, resolved: false }
      : {
          id,
          ...(target.title === undefined ? {} : { title: target.title }),
          statedReadiness: target.readiness,
          resolved: true,
        };
  });

  return {
    entries: designEntries.length + keyedEntries(node.sections?.ui).length,
    declarations: designEntries.filter(
      ([, value]) => typeof value === "string" && pinnedDeclaration.test(value),
    ).length,
    blockingQuestions: openQuestions.filter((entry) => entry.blocking).length,
    openQuestions,
    decisions,
  };
}

/**
 * The Specs outside the Pack joined to a resolved member by a declared authored relation whose
 * other end is a Spec in the graph. Members in each `via` keep authored order; `via` follows the
 * closed relation list's order; rows sort by id.
 */
function packBoundary(
  node: PackNode,
  index: GraphIndex,
  implementedOf: (id: string) => boolean,
): PackBoundary {
  const inside = new Set(node.members);
  const restsOn = new Map<string, Map<AuthoredEdgeType, string[]>>();
  const restedOnBy = new Map<string, Map<AuthoredEdgeType, string[]>>();

  const join = (
    rows: Map<string, Map<AuthoredEdgeType, string[]>>,
    outsideId: string,
    type: AuthoredEdgeType,
    memberId: string,
  ): void => {
    const byType = rows.get(outsideId) ?? new Map<AuthoredEdgeType, string[]>();
    const members = byType.get(type) ?? [];

    if (!members.includes(memberId)) {
      members.push(memberId);
    }

    byType.set(type, members);
    rows.set(outsideId, byType);
  };

  const isAuthored = (edge: GraphEdge): edge is GraphEdge & { type: AuthoredEdgeType } =>
    edge.claim === "declared" && authoredEdgeTypeSet.has(edge.type);

  for (const memberId of new Set(node.members)) {
    if (!index.primitivesById.has(memberId)) {
      continue;
    }

    for (const edge of index.edgesByFrom.get(memberId) ?? []) {
      if (
        isAuthored(edge) &&
        restsOnTypes.has(edge.type) &&
        !inside.has(edge.to) &&
        index.primitivesById.has(edge.to)
      ) {
        join(restsOn, edge.to, edge.type, memberId);
      }
    }

    for (const edge of index.edgesByTo.get(memberId) ?? []) {
      if (isAuthored(edge) && !inside.has(edge.from) && index.primitivesById.has(edge.from)) {
        join(restedOnBy, edge.from, edge.type, memberId);
      }
    }
  }

  const rowsOf = (rows: Map<string, Map<AuthoredEdgeType, string[]>>): PackBoundaryRow[] =>
    [...rows.entries()]
      .sort(([left], [right]) => compareCodeUnits(left, right))
      .flatMap(([id, byType]): PackBoundaryRow[] => {
        const outside = index.primitivesById.get(id);

        if (outside === undefined) {
          return [];
        }

        return [
          {
            id,
            ...(outside.title === undefined ? {} : { title: outside.title }),
            statedReadiness: outside.readiness,
            implemented: implementedOf(id),
            via: authoredEdgeTypes.flatMap((type) => {
              const members = byType.get(type);

              return members === undefined ? [] : [{ type, members }];
            }),
          },
        ];
      });

  return { restsOn: rowsOf(restsOn), restedOnBy: rowsOf(restedOnBy) };
}

/**
 * @sdpAnchor component:protocol.reader
 * @sdpLabel Protocol reader seam
 * @sdpSatisfies spec:consumers.reader
 * @sdpUses component:protocol.graph, component:protocol.validate, component:protocol.model
 * @sdpLayer application
 * @sdpContext protocol
 */
/**
 * @sdpAnchor impl:protocol.agent-surface
 * @sdpLabel typed graph reader and agent entry adapters
 * @sdpSatisfies spec:consumers.agent-surface
 * @sdpComponent component:protocol.reader
 * @sdpRole reader
 */

/**
 * @sdpAnchor impl:protocol.reader
 * @sdpLabel thin typed graph reader construction
 * @sdpSatisfies spec:consumers.reader, spec:extraction.entry-locations
 * @sdpComponent component:protocol.reader
 * @sdpUses impl:protocol.delivery-facts
 * @sdpRole reader
 */

export function createReader(graph: GraphSchema): Reader {
  const index = buildGraphIndex(graph);
  const recomputedFacts = computeDeliveryFacts(graph.nodes, graph.edges);
  const allFindings = validateGraph(graph).findings;
  const oracleEdgesByTarget = new Map<string, GraphEdge[]>();

  for (const edge of graph.edges) {
    if (isResolvingOracleModel(edge, index.nodesById)) {
      oracleEdgesByTarget.set(edge.to, [...(oracleEdgesByTarget.get(edge.to) ?? []), edge]);
    }
  }

  const usableOracleEdges = new Set(
    [...oracleEdgesByTarget.values()].flatMap((edges) => (edges.length === 1 ? edges : [])),
  );
  // Structural memberOf/uses edges are intentionally excluded: this traversal follows binding
  // nodes to Specs, while structural edges connect CodeNode endpoints and confer no Spec linkage.
  // `references` is traversed: it confers nothing, but it is the code unit's recorded linkage to
  // the design it answers to, so a change to that unit reaches the Spec.
  const isTraversableBinding = (edge: GraphEdge): boolean =>
    edge.type === "satisfies" ||
    edge.type === "references" ||
    edge.type === "verifies" ||
    (edge.type === "models" && usableOracleEdges.has(edge));

  const factsOf = (id: string): readonly DeliveryFactName[] => recomputedFacts.get(id) ?? [];

  // The location table, grouped by Spec once; each Spec's rows sort by entry in code-unit order.
  const locationsBySpec = new Map<string, EntryLocation[]>();

  for (const row of graph.locations ?? []) {
    const rows = locationsBySpec.get(row.spec) ?? [];
    rows.push(row);
    locationsBySpec.set(row.spec, rows);
  }

  for (const rows of locationsBySpec.values()) {
    rows.sort((left, right) => compareCodeUnits(left.entry, right.entry) || left.line - right.line);
  }

  const locationsOf = (id: string): readonly EntryLocation[] => locationsBySpec.get(id) ?? [];

  /** The unit's component: its `memberOf` target (the first by id, should a foreign graph hold more). */
  const componentOf = (codeId: string): CodeUnitComponent | undefined => {
    const [componentId] = (index.edgesByFrom.get(codeId) ?? [])
      .filter((edge) => edge.type === "memberOf")
      .map((edge) => edge.to)
      .sort(compareCodeUnits);

    if (componentId === undefined) {
      return undefined;
    }

    const component = index.nodesById.get(componentId);

    return component?.nodeType === "CodeNode"
      ? {
          id: componentId,
          ...(component.layer === undefined ? {} : { layer: component.layer }),
          ...(component.context === undefined ? {} : { context: component.context }),
        }
      : { id: componentId };
  };

  const codeUnitBindingsTo = (
    id: string,
    edgeType: "satisfies" | "references",
  ): readonly CodeUnitBinding[] =>
    (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.type === edgeType)
      .map((edge): CodeUnitBinding => {
        const source = index.nodesById.get(edge.from);
        const location =
          source?.nodeType === "CodeNode"
            ? {
                ...(source.label === undefined ? {} : { label: source.label }),
                file: source.file,
                ...(source.line === undefined ? {} : { line: source.line }),
                ...(source.role === undefined ? {} : { role: source.role }),
                ...(source.layer === undefined ? {} : { layer: source.layer }),
                ...(source.context === undefined ? {} : { context: source.context }),
              }
            : {};
        const component = componentOf(edge.from);

        return {
          codeId: edge.from,
          claim: edge.claim,
          ...location,
          ...(component === undefined ? {} : { component }),
        };
      })
      .sort((left, right) => compareCodeUnits(left.codeId, right.codeId));

  const anchorVerified = (verifierId: string): boolean =>
    (index.edgesByTo.get(verifierId) ?? []).some((edge) =>
      isResolvingTestAnchorVerify(edge, index.nodesById),
    );

  const verifierBindingsTo = (id: string): readonly VerifierBinding[] =>
    (index.edgesByTo.get(id) ?? [])
      .filter((edge) => edge.type === "verifies")
      .map((edge): VerifierBinding => {
        const source = index.nodesById.get(edge.from);

        if (source?.nodeType === "Anchor") {
          return {
            verifierId: edge.from,
            via: "test-anchor",
            claim: edge.claim,
            // A resolving test anchor *is* the enabled binding (MD-7) — but only along its
            // contract row: an off-contract claim confers nothing, exactly as in the derived
            // facts (the shared resolving-test-anchor rule; fail closed).
            enabled: isResolvingTestAnchorVerify(edge, index.nodesById),
            ...(source.label === undefined ? {} : { label: source.label }),
            file: source.file,
            line: source.line,
          };
        }

        const example = index.primitivesById.get(edge.from);
        // The shared enabled-example rule (delivery-facts): one predicate decides conferral for
        // the decode and the derived facts, so the two surfaces can never disagree (fail closed).
        const enabled = isEnabledExampleVerify(edge, index.nodesById, anchorVerified);

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

  const enabledCount = (verifiers: readonly VerifierBinding[]): EnabledCount => ({
    total: verifiers.length,
    enabled: verifiers.filter((verifier) => verifier.enabled).length,
  });

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
      ...(node.narrative === undefined ? {} : { narrative: node.narrative }),
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

    const implementations: readonly ImplementationBinding[] = codeUnitBindingsTo(id, "satisfies");
    const references: readonly ReferenceBinding[] = codeUnitBindingsTo(id, "references");
    const verifiers = verifierBindingsTo(id);

    // Exactly one complete oracle contract decodes as presence. Off-contract or competing edges
    // stay visible through findings, but never become an expected-outcome authority by accident.
    const resolvingOracleEdges = (index.edgesByTo.get(id) ?? []).filter((edge) =>
      usableOracleEdges.has(edge),
    );
    const oracleEdge = resolvingOracleEdges.length === 1 ? resolvingOracleEdges[0] : undefined;
    const oracle =
      oracleEdge === undefined
        ? undefined
        : (() => {
            const source = index.nodesById.get(oracleEdge.from);
            const location =
              source?.nodeType === "Anchor"
                ? {
                    ...(source.label === undefined ? {} : { label: source.label }),
                    file: source.file,
                    line: source.line,
                  }
                : {};

            return { anchorId: oracleEdge.from, claim: oracleEdge.claim, ...location };
          })();

    const summary = summarize(node);
    const nextRung =
      summary.derivedReadiness === undefined
        ? SPEC_READINESS[0]
        : SPEC_READINESS[SPEC_READINESS.indexOf(summary.derivedReadiness) + 1];

    return {
      ...summary,
      ...(node.sections === undefined ? {} : { sections: node.sections }),
      floorFailures: evaluateReadinessFloor(node, index),
      nextRungFailures: nextRung === undefined ? [] : evaluateReadinessFloor(node, index, nextRung),
      relationsOut,
      relationsIn,
      implementations,
      references,
      verifiers,
      ...(oracle === undefined ? {} : { oracle }),
      entryLocations: locationsOf(id),
      findings: findingsNaming(id),
    };
  };

  const packContext = (id: string): PackContext | undefined => {
    const node = index.nodesById.get(id);

    if (node?.nodeType !== "Pack") {
      return undefined;
    }

    const members = node.members.map((memberId): PackMemberSummary => {
      const member = index.primitivesById.get(memberId);

      if (member === undefined) {
        return { id: memberId, resolved: false, deliveryFacts: [] };
      }

      const summary = summarize(member);
      const statedNextRung = statedNextRungOf(member.readiness);
      const verifiers = verifierBindingsTo(member.id);

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
        file: summary.file,
        ...(statedNextRung === undefined ? {} : { statedNextRung }),
        statedNextRungFailures:
          statedNextRung === undefined ? [] : evaluateReadinessFloor(member, index, statedNextRung),
        design: packMemberDesign(member, index, locationsOf(member.id)),
        implementations: codeUnitBindingsTo(member.id, "satisfies"),
        references: codeUnitBindingsTo(member.id, "references"),
        verifiers: enabledCount(verifiers),
        examples: enabledCount(verifiers.filter((verifier) => verifier.via === "example")),
      };
    });

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
      boundary: packBoundary(node, index, (specId) => factsOf(specId).includes("implemented")),
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
      narrative: 4,
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
        if (node.narrative?.toLowerCase().includes(needle) === true) {
          matchedIn.push("narrative");
        }

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
      // resolution left to referential integrity. `models` walks like its binding siblings: the
      // oracle's file reaches the spec it models, or blast radius would go silently blind there.
      for (const edge of index.edgesByFrom.get(node.id) ?? []) {
        if (isTraversableBinding(edge)) {
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
    const unlinked: UnlinkedCodeUnit[] = [];

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

        let linked = false;

        for (const edge of index.edgesByFrom.get(ref.id) ?? []) {
          if (isTraversableBinding(edge)) {
            linked = true;
            appendReason(impactedSpecReasons, edge.to, {
              file,
              throughBinding: { id: ref.id, edgeType: edge.type, claim: edge.claim },
            });
          }
        }

        // A recorded code unit with no Spec linkage (an identity-only anchor) is named, never
        // dropped: its file is not coverage-unknown, and it implies no coverage either.
        if (!linked && ref.nodeType === "CodeNode") {
          unlinked.push({ file, id: ref.id });
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
      unlinked,
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

import { SPEC_KINDS, SPEC_READINESS } from "../model/descriptors.js";
import type { SpecKind, SpecReadiness } from "../model/descriptors.js";
import type { SpecSectionName } from "../model/sections.js";
import { authoredEdgeTypes } from "../graph/schema.js";
import type { GraphEdge, PrimitiveNode } from "../graph/schema.js";
import type { GraphIndex } from "./graph-index.js";

/**
 * The readiness floor — the single source of truth (MD-13), mirroring `05` §3 row-for-row:
 * kind-blind structural clauses (`readinessFloors`) plus one kind-conditional evidence clause read
 * from the per-kind evidence table (`kindEvidence`, MD-12) — `scoped` requires the kind's natural
 * evidence *present* (prose acceptable), `defined` requires it *complete* where the kind defines a
 * stronger form. The clause-id union is derived from the table, the evaluator is one generic loop,
 * and predicates read the one graph (one validation path, MD-14): the spec is a `Primitive` node,
 * relations are its declared edges, and promotion-neutrality (MD-10) walks `refines` edges into
 * the children's nodes.
 *
 * Evidence predicates are total over arbitrary section content: a graph node's sections are
 * statically-reified value data, never a typechecked instance, so a malformed shape reads as
 * absent evidence — typed sections (MD-11) stay the authoring-time guardrail, the floor never
 * throws.
 */

export type ReadinessPredicate = (node: PrimitiveNode, index: GraphIndex) => boolean;

export interface ReadinessClause {
  readonly id: string;
  readonly description: string;
  readonly predicate: ReadinessPredicate;
}

export interface ReadinessFloor {
  readonly readiness: SpecReadiness;
  readonly clauses: readonly ReadinessClause[];
}

export interface KindEvidenceCell {
  readonly description: string;
  readonly predicate: ReadinessPredicate;
}

export interface KindEvidenceRow {
  /** `scoped` — the kind's natural evidence is *present* (prose acceptable). */
  readonly scoped: KindEvidenceCell;
  /** `defined` — the evidence is *complete* where the kind defines a stronger form. */
  readonly defined: KindEvidenceCell;
}

/* ----- defensive value access (reified content, not typechecked instances) ----- */

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function asArray(value: unknown): readonly unknown[] | undefined {
  return Array.isArray(value) ? (value as readonly unknown[]) : undefined;
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasEntries(value: unknown): boolean {
  return (asArray(value)?.length ?? 0) > 0;
}

function sectionOf(node: PrimitiveNode, name: SpecSectionName): unknown {
  return node.sections?.[name];
}

/* ----- the named predicate library ----- */

function hasSpecId(node: PrimitiveNode): boolean {
  return isNonEmptyString(node.id);
}

function hasTitle(node: PrimitiveNode): boolean {
  return isNonEmptyString(node.title);
}

function hasKind(node: PrimitiveNode): boolean {
  return isNonEmptyString(node.specKind);
}

function hasAltitude(node: PrimitiveNode): boolean {
  return isNonEmptyString(node.altitude);
}

function hasIntentOutcome(node: PrimitiveNode): boolean {
  return isNonEmptyString(asRecord(sectionOf(node, "intent"))?.outcome);
}

const authoredEdgeTypeSet: ReadonlySet<string> = new Set(authoredEdgeTypes);

/**
 * The spec's authored relations on the graph: declared edges of an authored relation type.
 * `belongsTo` is derived from the pack manifest and never counts as a relation the spec declared.
 */
function declaredRelationEdges(node: PrimitiveNode, index: GraphIndex): readonly GraphEdge[] {
  return (index.edgesByFrom.get(node.id) ?? []).filter(
    (edge) => edge.claim === "declared" && authoredEdgeTypeSet.has(edge.type),
  );
}

function hasParentRelation(node: PrimitiveNode, index: GraphIndex): boolean {
  return declaredRelationEdges(node, index).some((edge) => edge.type === "refines");
}

function hasIntentOutcomeOrParentRelation(node: PrimitiveNode, index: GraphIndex): boolean {
  return hasIntentOutcome(node) || hasParentRelation(node, index);
}

function hasAtLeastOneRelation(node: PrimitiveNode, index: GraphIndex): boolean {
  return declaredRelationEdges(node, index).length > 0;
}

/** Blocking open questions live in `intent.openQuestions` (MD-9); only an entry flagged `blocking: true` blocks. */
function hasNoBlockingOpenQuestions(node: PrimitiveNode): boolean {
  const openQuestions = asArray(asRecord(sectionOf(node, "intent"))?.openQuestions) ?? [];

  return !openQuestions.some((entry) => asRecord(entry)?.blocking === true);
}

function behaviorOf(node: PrimitiveNode): Record<string, unknown> | undefined {
  return asRecord(sectionOf(node, "behavior"));
}

function hasInlineRulesOrExamples(node: PrimitiveNode): boolean {
  return hasEntries(behaviorOf(node)?.rules) || hasEntries(behaviorOf(node)?.examples);
}

function hasInlineBehaviorEvidence(node: PrimitiveNode): boolean {
  return hasInlineRulesOrExamples(node) || hasEntries(behaviorOf(node)?.flows);
}

/** Typed accessor into the evidence table — returns the cell at its declared (2-arg) predicate type. */
function evidenceCell(kind: SpecKind, rung: keyof KindEvidenceRow): KindEvidenceCell {
  return kindEvidence[kind][rung];
}

/**
 * Promotion-neutral evidence (MD-10/MD-12), bounded by MD-16: a promoted child counts wherever an
 * inline entry would — but only when the child itself carries its kind's evidence. Promotion moves
 * content out (MD-10), so an empty stub child is not a promotion and never clears a parent's
 * floor. On the graph, a promoted child is a `rule`/`example` Primitive whose declared `refines`
 * edge targets this spec.
 */
function hasPromotedRuleOrExampleEvidence(node: PrimitiveNode, index: GraphIndex): boolean {
  return (index.edgesByTo.get(node.id) ?? []).some((edge) => {
    if (edge.type !== "refines" || edge.claim !== "declared") {
      return false;
    }

    const child = index.primitivesById.get(edge.from);

    return (
      child !== undefined &&
      (child.specKind === "rule" || child.specKind === "example") &&
      evidenceCell(child.specKind, "scoped").predicate(child, index)
    );
  });
}

/**
 * The constrainedBy evidence slot is the promoted twin of the inline `constraints` section (`02` §3
 * duality), so it counts only when the edge resolves in the graph to a `constraint`-kind spec that
 * carries its own evidence (MD-16). A dangling or wrong-kind target is not evidence.
 */
function hasConstrainedByConstraintEvidence(node: PrimitiveNode, index: GraphIndex): boolean {
  return declaredRelationEdges(node, index).some((edge) => {
    if (edge.type !== "constrainedBy") {
      return false;
    }

    const target = index.primitivesById.get(edge.to);

    return (
      target?.specKind === "constraint" &&
      evidenceCell("constraint", "scoped").predicate(target, index)
    );
  });
}

function hasStructuredExampleEntry(node: PrimitiveNode): boolean {
  return (asArray(behaviorOf(node)?.examples) ?? []).some((entry) => {
    const structured = asRecord(entry);

    return (
      structured !== undefined &&
      hasEntries(structured.given) &&
      hasEntries(structured.when) &&
      hasEntries(structured.then)
    );
  });
}

function hasConstraintEntries(node: PrimitiveNode): boolean {
  return hasEntries(sectionOf(node, "constraints"));
}

function constraintTargetsAreMachineReadable(node: PrimitiveNode): boolean {
  const entries = asArray(sectionOf(node, "constraints")) ?? [];

  return entries.length > 0 && entries.every((entry) => isNonEmptyString(asRecord(entry)?.target));
}

function hasModelTerms(node: PrimitiveNode): boolean {
  const terms = asRecord(asRecord(sectionOf(node, "model"))?.terms);

  return terms !== undefined && Object.keys(terms).length > 0;
}

function hasDecisionSection(node: PrimitiveNode): boolean {
  const decision = asRecord(sectionOf(node, "decision"));

  return decision !== undefined && Object.keys(decision).length > 0;
}

function hasWrittenDecision(node: PrimitiveNode): boolean {
  return isNonEmptyString(asRecord(sectionOf(node, "decision"))?.decision);
}

/* ----- the graph-shaped ready clauses ----- */

function allRelationsResolve(node: PrimitiveNode, index: GraphIndex): boolean {
  return declaredRelationEdges(node, index).every((edge) => index.nodesById.has(edge.to));
}

const definedIndex = SPEC_READINESS.indexOf("defined");

/**
 * Evaluates resolving targets only — an unresolved target is `all-relations-resolve`'s failure,
 * never a second floor failure. A target resolving to a non-`Primitive` node is not a spec at
 * `defined` and fails (the edge contract makes that shape a conformance error besides).
 */
function dependsOnAndRefinesTargetsAreDefined(node: PrimitiveNode, index: GraphIndex): boolean {
  return declaredRelationEdges(node, index).every((edge) => {
    if (edge.type !== "dependsOn" && edge.type !== "refines") {
      return true;
    }

    if (!index.nodesById.has(edge.to)) {
      return true;
    }

    const target = index.primitivesById.get(edge.to);

    return target !== undefined && SPEC_READINESS.indexOf(target.readiness) >= definedIndex;
  });
}

/**
 * Every binding edge naming this spec originates from a binding node present in the graph — so
 * `implemented` stays derivable from a real binding (the delivery-fact computation trusts edges).
 * Extractor output satisfies this by construction (an anchor and its edge derive together); the
 * clause has teeth for any other graph producer, and a regression that emitted an edge without
 * its node would fail here.
 */
function anchorsResolve(node: PrimitiveNode, index: GraphIndex): boolean {
  return (index.edgesByTo.get(node.id) ?? []).every((edge) => {
    const isBindingEdge =
      edge.type === "satisfies" || (edge.type === "verifies" && edge.claim === "anchored");

    return !isBindingEdge || index.nodesById.has(edge.from);
  });
}

/* ----- the per-kind evidence table (MD-12; mirrors `05` §3) ----- */

const behaviorFamilyEvidence: KindEvidenceRow = {
  scoped: {
    description:
      "rules, examples, flows, or constraints — inline, or promoted (a refining rule/example child, or a constrainedBy-linked constraint, each carrying its own evidence)",
    predicate: (node, index) =>
      hasInlineBehaviorEvidence(node) ||
      hasConstraintEntries(node) ||
      hasConstrainedByConstraintEvidence(node, index) ||
      hasPromotedRuleOrExampleEvidence(node, index),
  },
  defined: {
    description:
      "rules and/or examples — inline or promoted children carrying their evidence; constraints alone no longer suffice",
    predicate: (node, index) =>
      hasInlineRulesOrExamples(node) || hasPromotedRuleOrExampleEvidence(node, index),
  },
};

export const kindEvidence = {
  behavior: behaviorFamilyEvidence,
  workflow: behaviorFamilyEvidence,
  example: {
    scoped: {
      description: "an examples entry (prose acceptable)",
      predicate: (node) => hasEntries(behaviorOf(node)?.examples),
    },
    defined: {
      description: "at least one structured { given, when, then } examples entry",
      predicate: hasStructuredExampleEntry,
    },
  },
  rule: {
    scoped: {
      description: "its statement in behavior.rules",
      predicate: (node) => hasEntries(behaviorOf(node)?.rules),
    },
    defined: {
      description: "its statement in behavior.rules — a rule's content is its statement",
      predicate: (node) => hasEntries(behaviorOf(node)?.rules),
    },
  },
  constraint: {
    scoped: {
      description: "a non-empty constraints[] section",
      predicate: hasConstraintEntries,
    },
    defined: {
      description: "every constraints[] entry carries a machine-readable target",
      predicate: constraintTargetsAreMachineReadable,
    },
  },
  model: {
    scoped: {
      description: "non-empty model.terms",
      predicate: hasModelTerms,
    },
    defined: {
      description: "non-empty model.terms — a vocabulary either has terms or it doesn't",
      predicate: hasModelTerms,
    },
  },
  decision: {
    scoped: {
      description:
        "the decision section is present (context / alternatives may precede the choice)",
      predicate: hasDecisionSection,
    },
    defined: {
      description: "decision.decision — the chosen option — is written",
      predicate: hasWrittenDecision,
    },
  },
  // Documented interim (MD-12): when a dedicated contract section lands, the typing law (MD-11)
  // pulls it in and this row repoints to it.
  contract: behaviorFamilyEvidence,
} as const satisfies Record<SpecKind, KindEvidenceRow>;

const kindEvidencePresent: ReadinessPredicate = (node, index) =>
  evidenceCell(node.specKind, "scoped").predicate(node, index);

const kindEvidenceComplete: ReadinessPredicate = (node, index) =>
  evidenceCell(node.specKind, "defined").predicate(node, index);

/* ----- the kind-blind structural clauses (mirrors `05` §3) ----- */

export const readinessFloors = {
  idea: {
    readiness: "idea",
    clauses: [
      {
        id: "id",
        description: "Envelope includes a stable spec id.",
        predicate: hasSpecId,
      },
      {
        id: "title",
        description: "Envelope includes a human-readable title.",
        predicate: hasTitle,
      },
      {
        id: "kind",
        description: "Envelope states the authored spec kind.",
        predicate: hasKind,
      },
      {
        id: "altitude",
        description: "Envelope states the authored altitude.",
        predicate: hasAltitude,
      },
      {
        id: "intent.outcome-or-parent-relation",
        description: "Spec states intent.outcome or declares a parent relation via refines.",
        predicate: hasIntentOutcomeOrParentRelation,
      },
    ],
  },
  scoped: {
    readiness: "scoped",
    clauses: [
      {
        id: "intent.outcome",
        description: "Spec states the intended outcome.",
        predicate: hasIntentOutcome,
      },
      {
        id: "at-least-one-relation",
        description: "Spec declares at least one authored relation.",
        predicate: hasAtLeastOneRelation,
      },
      {
        id: "kind-evidence-present",
        description: "The kind's natural evidence is present (per-kind evidence table).",
        predicate: kindEvidencePresent,
      },
    ],
  },
  defined: {
    readiness: "defined",
    clauses: [
      {
        id: "kind-evidence-complete",
        description: "The kind's natural evidence is complete (per-kind evidence table).",
        predicate: kindEvidenceComplete,
      },
      {
        id: "no-blocking-open-questions",
        description: "Spec has no blocking open question in intent.openQuestions.",
        predicate: hasNoBlockingOpenQuestions,
      },
    ],
  },
  ready: {
    readiness: "ready",
    clauses: [
      {
        id: "all-relations-resolve",
        description: "All authored relations resolve to known targets.",
        predicate: allRelationsResolve,
      },
      {
        id: "depends-on-and-refines-targets-are-defined",
        description: "Every dependsOn and refines target is at least defined.",
        predicate: dependsOnAndRefinesTargetsAreDefined,
      },
      {
        id: "anchors-resolve",
        description: "Any anchors present resolve.",
        predicate: anchorsResolve,
      },
    ],
  },
} as const satisfies Record<SpecReadiness, ReadinessFloor>;

/** Derived from the table — never re-enumerated (MD-13). */
export type ReadinessClauseId = (typeof readinessFloors)[SpecReadiness]["clauses"][number]["id"];

export interface ReadinessFloorFailure {
  readonly clauseId: ReadinessClauseId;
  readonly description: string;
}

const ratifiedKinds: ReadonlySet<string> = new Set(SPEC_KINDS);
const ratifiedReadiness: ReadonlySet<string> = new Set(SPEC_READINESS);

/**
 * The one generic evaluator (MD-13): floors are cumulative, so every clause at or below the stated
 * rung must hold. Evaluates a `Primitive` node against the indexed graph (one validation path,
 * MD-14).
 */
export function evaluateReadinessFloor(
  node: PrimitiveNode,
  index: GraphIndex,
): readonly ReadinessFloorFailure[] {
  // Foreign graph data can carry unratified strings in the typed descriptor slots; those are the
  // descriptor conformance errors (`05` §2 check 3 — validateGraph fails closed), and the
  // evaluator stays total: over an unratified kind or readiness it evaluates no clauses rather
  // than dereferencing the evidence table into a throw or guessing a rung.
  if (!ratifiedKinds.has(node.specKind) || !ratifiedReadiness.has(node.readiness)) {
    return [];
  }

  const statedIndex = SPEC_READINESS.indexOf(node.readiness);
  const failures: ReadinessFloorFailure[] = [];

  for (const readiness of SPEC_READINESS.slice(0, statedIndex + 1)) {
    for (const clause of readinessFloors[readiness].clauses) {
      if (clause.predicate(node, index)) {
        continue;
      }

      failures.push({ clauseId: clause.id, description: clause.description });
    }
  }

  return failures;
}

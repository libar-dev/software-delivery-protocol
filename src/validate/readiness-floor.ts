import { SPEC_READINESS } from "../model/descriptors.js";
import type { SpecKind, SpecReadiness } from "../model/descriptors.js";
import type { Spec } from "../model/spec.js";
import type { AuthoredModel } from "./authored-model.js";

/**
 * The readiness floor — the single source of truth (MD-13), mirroring `05` §3 row-for-row: kind-blind
 * structural clauses (`readinessFloors`) plus one kind-conditional evidence clause read from the
 * per-kind evidence table (`kindEvidence`, MD-12) — `scoped` requires the kind's natural evidence
 * *present* (prose acceptable), `defined` requires it *complete* where the kind defines a stronger
 * form. The clause-id union is derived from the table, the evaluator is one generic loop, and
 * evidence predicates take `(spec, model)` because promotion-neutrality (MD-10) needs the authored
 * model to count refining children.
 */

export type ReadinessPredicate = (spec: Spec, model: AuthoredModel) => boolean;

export interface ActiveReadinessClause {
  readonly id: string;
  readonly description: string;
  readonly predicate: ReadinessPredicate;
}

/** Graph-shaped clauses that execute over the one graph (MD-14, Slice 1/3); the Session-1 evaluator skips them. */
export interface DeferredReadinessClause {
  readonly id: string;
  readonly description: string;
  readonly deferredInSession1: true;
}

export type ReadinessClause = ActiveReadinessClause | DeferredReadinessClause;

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

/* ----- the named predicate library ----- */

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasEntries(value: readonly unknown[] | undefined): boolean {
  return (value?.length ?? 0) > 0;
}

function hasSpecId(spec: Spec): boolean {
  return hasNonEmptyString(spec.id);
}

function hasTitle(spec: Spec): boolean {
  return hasNonEmptyString(spec.title);
}

function hasKind(spec: Spec): boolean {
  return hasNonEmptyString(spec.kind);
}

function hasAltitude(spec: Spec): boolean {
  return hasNonEmptyString(spec.altitude);
}

function hasIntentOutcome(spec: Spec): boolean {
  return hasNonEmptyString(spec.intent?.outcome);
}

function hasParentRelation(spec: Spec): boolean {
  return (spec.relations ?? []).some((relation) => relation.type === "refines");
}

function hasIntentOutcomeOrParentRelation(spec: Spec): boolean {
  return hasIntentOutcome(spec) || hasParentRelation(spec);
}

function hasAtLeastOneRelation(spec: Spec): boolean {
  return hasEntries(spec.relations);
}

/** Blocking open questions live in `intent.openQuestions` (MD-9); only an entry flagged `blocking: true` blocks. */
function hasNoBlockingOpenQuestions(spec: Spec): boolean {
  return !(spec.intent?.openQuestions ?? []).some(
    (entry) => typeof entry !== "string" && entry.blocking === true,
  );
}

function hasInlineRulesOrExamples(spec: Spec): boolean {
  return hasEntries(spec.behavior?.rules) || hasEntries(spec.behavior?.examples);
}

function hasInlineBehaviorEvidence(spec: Spec): boolean {
  return hasInlineRulesOrExamples(spec) || hasEntries(spec.behavior?.flows);
}

/** Promotion-neutral evidence (MD-10/MD-12): a promoted child counts wherever an inline entry would. */
function hasRefiningRuleOrExampleChild(spec: Spec, model: AuthoredModel): boolean {
  return model.specs.some(
    (child) =>
      (child.kind === "rule" || child.kind === "example") &&
      (child.relations ?? []).some(
        (relation) => relation.type === "refines" && relation.target === spec.id,
      ),
  );
}

function hasConstrainedByRelation(spec: Spec): boolean {
  return (spec.relations ?? []).some((relation) => relation.type === "constrainedBy");
}

function hasStructuredExampleEntry(spec: Spec): boolean {
  return (spec.behavior?.examples ?? []).some(
    (entry) =>
      typeof entry !== "string" &&
      entry.given.length > 0 &&
      entry.when.length > 0 &&
      entry.then.length > 0,
  );
}

function hasConstraintEntries(spec: Spec): boolean {
  return hasEntries(spec.constraints);
}

function constraintTargetsAreMachineReadable(spec: Spec): boolean {
  return (
    hasConstraintEntries(spec) &&
    (spec.constraints ?? []).every((entry) => hasNonEmptyString(entry.target))
  );
}

function hasModelTerms(spec: Spec): boolean {
  return spec.model?.terms !== undefined && Object.keys(spec.model.terms).length > 0;
}

function hasDecisionSection(spec: Spec): boolean {
  return spec.decision !== undefined && Object.keys(spec.decision).length > 0;
}

function hasWrittenDecision(spec: Spec): boolean {
  return hasNonEmptyString(spec.decision?.decision);
}

/* ----- the per-kind evidence table (MD-12; mirrors `05` §3) ----- */

const behaviorFamilyEvidence: KindEvidenceRow = {
  scoped: {
    description:
      "rules, examples, flows, or constraints — inline, or promoted (a refining rule/example child, or a constrainedBy target)",
    predicate: (spec, model) =>
      hasInlineBehaviorEvidence(spec) ||
      hasConstraintEntries(spec) ||
      hasConstrainedByRelation(spec) ||
      hasRefiningRuleOrExampleChild(spec, model),
  },
  defined: {
    description:
      "rules and/or examples, inline or promoted children — constraints alone no longer suffice",
    predicate: (spec, model) =>
      hasInlineRulesOrExamples(spec) || hasRefiningRuleOrExampleChild(spec, model),
  },
};

export const kindEvidence = {
  behavior: behaviorFamilyEvidence,
  workflow: behaviorFamilyEvidence,
  example: {
    scoped: {
      description: "an examples entry (prose acceptable)",
      predicate: (spec) => hasEntries(spec.behavior?.examples),
    },
    defined: {
      description: "at least one structured { given, when, then } examples entry",
      predicate: hasStructuredExampleEntry,
    },
  },
  rule: {
    scoped: {
      description: "its statement in behavior.rules",
      predicate: (spec) => hasEntries(spec.behavior?.rules),
    },
    defined: {
      description: "its statement in behavior.rules — a rule's content is its statement",
      predicate: (spec) => hasEntries(spec.behavior?.rules),
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

const kindEvidencePresent: ReadinessPredicate = (spec, model) =>
  kindEvidence[spec.kind].scoped.predicate(spec, model);

const kindEvidenceComplete: ReadinessPredicate = (spec, model) =>
  kindEvidence[spec.kind].defined.predicate(spec, model);

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
        deferredInSession1: true,
      },
      {
        id: "depends-on-and-refines-targets-are-defined",
        description: "Every dependsOn and refines target is at least defined.",
        deferredInSession1: true,
      },
      {
        id: "anchors-resolve",
        description: "Any authored anchors present resolve.",
        deferredInSession1: true,
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

/**
 * The one generic evaluator (MD-13): floors are cumulative, so every clause at or below the stated
 * rung must hold; deferred (graph-shaped) clauses are skipped until the extractor lands.
 */
export function evaluateReadinessFloor(
  spec: Spec,
  model: AuthoredModel,
): readonly ReadinessFloorFailure[] {
  const statedIndex = SPEC_READINESS.indexOf(spec.readiness);
  const failures: ReadinessFloorFailure[] = [];

  for (const readiness of SPEC_READINESS.slice(0, statedIndex + 1)) {
    for (const clause of readinessFloors[readiness].clauses) {
      if ("deferredInSession1" in clause) {
        continue;
      }

      if (clause.predicate(spec, model)) {
        continue;
      }

      failures.push({ clauseId: clause.id, description: clause.description });
    }
  }

  return failures;
}

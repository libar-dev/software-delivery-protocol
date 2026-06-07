import type { AnchorId, PackId, SpecId } from "../ids.js";
import type { Spec } from "../model/spec.js";
import type { SpecReadiness } from "../model/descriptors.js";
import type { AuthoredModel } from "./authored-model.js";
import type { Finding, ValidationReport, ValidatorFamily } from "./contracts.js";
import { readinessFloors, readinessKindOverlays } from "./readiness-floor.js";

const duplicateIdsValidatorId = "conformance/duplicate-ids";
const danglingReferencesValidatorId = "conformance/dangling-references";
const readinessFloorValidatorId = "honesty/readiness-floor";
const authoredModelValidatorId = "conformance/authored-model";

const readinessOrder = [
  "idea",
  "scoped",
  "defined",
  "ready",
] as const satisfies readonly SpecReadiness[];

type AuthoredId = SpecId | PackId | AnchorId;

type ReadinessClauseId =
  | "id"
  | "title"
  | "kind"
  | "altitude"
  | "intent.outcome-or-parent-relation"
  | "intent.outcome"
  | "at-least-one-relation"
  | "rules-examples-or-constraints"
  | "rules-and-or-examples"
  | "constraint-targets-are-machine-readable"
  | "no-blocking-open-questions"
  | "constraint-machine-readable-target"
  | "example-given-when-then"
  | "model-term-definitions";

type OverlayKind = keyof typeof readinessKindOverlays;

function createReport(
  validatorId: string,
  family: ValidatorFamily,
  findings: readonly Finding[],
): ValidationReport {
  return {
    validatorId,
    family,
    findings,
  };
}

function createFinding(
  validatorId: string,
  family: ValidatorFamily,
  message: string,
  subjectId?: string,
  relatedId?: string,
  path?: string,
): Finding {
  return {
    validatorId,
    family,
    severity: "error",
    message,
    subjectId,
    relatedId,
    path,
  };
}

function collectAuthoredIds(model: AuthoredModel): readonly AuthoredId[] {
  return [
    ...model.specs.map((entry) => entry.id),
    ...model.packs.map((entry) => entry.id),
    ...model.anchors.map((entry) => entry.id),
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasPresentValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (isRecord(value)) {
    return Object.keys(value).length > 0;
  }

  return true;
}

function hasIntentOutcome(spec: Spec): boolean {
  return isRecord(spec.intent) && hasNonEmptyString(spec.intent.outcome);
}

function hasParentRelation(spec: Spec): boolean {
  return spec.relations?.some((relation) => relation.type === "refines") ?? false;
}

function hasAtLeastOneRelation(spec: Spec): boolean {
  return (spec.relations?.length ?? 0) > 0;
}

function hasBehaviorRules(spec: Spec): boolean {
  return isRecord(spec.behavior) && hasPresentValue(spec.behavior.rules);
}

function hasBehaviorExamples(spec: Spec): boolean {
  return isRecord(spec.behavior) && hasPresentValue(spec.behavior.examples);
}

function hasBehaviorRulesOrExamples(spec: Spec): boolean {
  return hasBehaviorRules(spec) || hasBehaviorExamples(spec);
}

function hasRulesExamplesOrConstraints(spec: Spec): boolean {
  return hasBehaviorRules(spec) || hasBehaviorExamples(spec) || hasPresentValue(spec.constraints);
}

function hasConstraintTarget(value: unknown): boolean {
  return isRecord(value) && hasPresentValue(value.target);
}

function constraintsHaveMachineReadableTargets(spec: Spec): boolean {
  if (spec.constraints === undefined) {
    return true;
  }

  const { constraints } = spec;

  if (Array.isArray(constraints)) {
    return constraints.every((entry) => hasConstraintTarget(entry));
  }

  if (!isRecord(constraints)) {
    return false;
  }

  if (hasPresentValue(constraints.target)) {
    return true;
  }

  const entries = Object.values(constraints);

  if (entries.length === 0) {
    return false;
  }

  return entries.every((entry) => hasConstraintTarget(entry));
}

function isBlockingOpenQuestion(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => isBlockingOpenQuestion(entry));
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return true;
  }

  if (!isRecord(value)) {
    return true;
  }

  if ("blocking" in value) {
    return value.blocking === true;
  }

  return Object.keys(value).length > 0;
}

function hasNoBlockingOpenQuestions(spec: Spec): boolean {
  const designOpenQuestions = isRecord(spec.design) ? spec.design.openQuestions : undefined;
  const decisionOpenQuestions = isRecord(spec.decision) ? spec.decision.openQuestions : undefined;

  return (
    !isBlockingOpenQuestion(designOpenQuestions) && !isBlockingOpenQuestion(decisionOpenQuestions)
  );
}

function hasStructuredExampleDetail(spec: Spec): boolean {
  if (!isRecord(spec.behavior)) {
    return false;
  }

  return (
    hasPresentValue(spec.behavior.given) &&
    hasPresentValue(spec.behavior.when) &&
    hasPresentValue(spec.behavior.then)
  );
}

function hasModelTermDefinitions(spec: Spec): boolean {
  return isRecord(spec.model) && hasPresentValue(spec.model.terms);
}

function evaluateClause(spec: Spec, clauseId: ReadinessClauseId): boolean {
  switch (clauseId) {
    case "id":
      return hasNonEmptyString(spec.id);
    case "title":
      return hasNonEmptyString(spec.title);
    case "kind":
      return hasNonEmptyString(spec.kind);
    case "altitude":
      return hasNonEmptyString(spec.altitude);
    case "intent.outcome-or-parent-relation":
      return hasIntentOutcome(spec) || hasParentRelation(spec);
    case "intent.outcome":
      return hasIntentOutcome(spec);
    case "at-least-one-relation":
      return hasAtLeastOneRelation(spec);
    case "rules-examples-or-constraints":
      return hasRulesExamplesOrConstraints(spec);
    case "rules-and-or-examples":
      return hasBehaviorRulesOrExamples(spec);
    case "constraint-targets-are-machine-readable":
      return constraintsHaveMachineReadableTargets(spec);
    case "no-blocking-open-questions":
      return hasNoBlockingOpenQuestions(spec);
    case "constraint-machine-readable-target":
      return constraintsHaveMachineReadableTargets(spec);
    case "example-given-when-then":
      return hasStructuredExampleDetail(spec);
    case "model-term-definitions":
      return hasModelTermDefinitions(spec);
  }
}

function readinessIndex(readiness: SpecReadiness): number {
  return readinessOrder.indexOf(readiness);
}

function isOverlayKind(kind: Spec["kind"]): kind is OverlayKind {
  return kind in readinessKindOverlays;
}

function toSupportedReadinessClauseId(clauseId: string): ReadinessClauseId | undefined {
  switch (clauseId) {
    case "id":
    case "title":
    case "kind":
    case "altitude":
    case "intent.outcome-or-parent-relation":
    case "intent.outcome":
    case "at-least-one-relation":
    case "rules-examples-or-constraints":
    case "rules-and-or-examples":
    case "constraint-targets-are-machine-readable":
    case "no-blocking-open-questions":
    case "constraint-machine-readable-target":
    case "example-given-when-then":
    case "model-term-definitions":
      return clauseId;
    default:
      return undefined;
  }
}

function getRequiredReadinessClauseIds(spec: Spec): readonly ReadinessClauseId[] {
  const clauseIds: ReadinessClauseId[] = [];
  const seen = new Set<string>();

  for (let index = 0; index <= readinessIndex(spec.readiness); index += 1) {
    const readiness = readinessOrder[index];

    if (readiness === undefined) {
      continue;
    }

    for (const clause of readinessFloors[readiness].clauses) {
      if ("deferredInSession1" in clause || clause.id === "defined-floor") {
        continue;
      }

      const supportedClauseId = toSupportedReadinessClauseId(clause.id);

      if (supportedClauseId === undefined) {
        continue;
      }

      if (seen.has(supportedClauseId)) {
        continue;
      }

      seen.add(supportedClauseId);
      clauseIds.push(supportedClauseId);
    }
  }

  const overlay = isOverlayKind(spec.kind) ? readinessKindOverlays[spec.kind] : undefined;

  if (
    overlay !== undefined &&
    readinessIndex(spec.readiness) >= readinessIndex(overlay.appliesAtOrAbove)
  ) {
    for (const clause of overlay.clauses) {
      const supportedClauseId = toSupportedReadinessClauseId(clause.id);

      if (supportedClauseId === undefined || seen.has(supportedClauseId)) {
        continue;
      }

      seen.add(supportedClauseId);
      clauseIds.push(supportedClauseId);
    }
  }

  return clauseIds;
}

export function validateDuplicateIds(model: AuthoredModel): ValidationReport {
  const seen = new Set<string>();
  const emitted = new Set<string>();
  const findings: Finding[] = [];

  for (const id of collectAuthoredIds(model)) {
    if (!seen.has(id)) {
      seen.add(id);
      continue;
    }

    if (emitted.has(id)) {
      continue;
    }

    emitted.add(id);
    findings.push(
      createFinding(duplicateIdsValidatorId, "conformance", `Duplicate authored id "${id}".`, id),
    );
  }

  return createReport(duplicateIdsValidatorId, "conformance", findings);
}

export function validateDanglingReferences(model: AuthoredModel): ValidationReport {
  const knownSpecIds = new Set(model.specs.map((entry) => entry.id));
  const findings: Finding[] = [];

  const appendMissingReference = (subjectId: string, targetId: SpecId, path: string): void => {
    if (knownSpecIds.has(targetId)) {
      return;
    }

    findings.push(
      createFinding(
        danglingReferencesValidatorId,
        "conformance",
        `Authored reference from "${subjectId}" points to missing target "${targetId}" at "${path}".`,
        subjectId,
        targetId,
        path,
      ),
    );
  };

  for (const authoredSpec of model.specs) {
    for (const [index, relation] of (authoredSpec.relations ?? []).entries()) {
      appendMissingReference(
        authoredSpec.id,
        relation.target,
        `relations[${String(index)}].target`,
      );
    }
  }

  for (const authoredPack of model.packs) {
    for (const [index, targetId] of authoredPack.specs.entries()) {
      appendMissingReference(authoredPack.id, targetId, `specs[${String(index)}]`);
    }

    for (const [index, targetId] of (authoredPack.modelRefs ?? []).entries()) {
      appendMissingReference(authoredPack.id, targetId, `modelRefs[${String(index)}]`);
    }
  }

  for (const anchor of model.anchors) {
    if ("satisfies" in anchor) {
      appendMissingReference(anchor.id, anchor.satisfies, "satisfies");
      continue;
    }

    appendMissingReference(anchor.id, anchor.verifies, "verifies");
  }

  return createReport(danglingReferencesValidatorId, "conformance", findings);
}

export function validateReadinessFloors(model: AuthoredModel): ValidationReport {
  const findings: Finding[] = [];

  for (const authoredSpec of model.specs) {
    for (const clauseId of getRequiredReadinessClauseIds(authoredSpec)) {
      if (evaluateClause(authoredSpec, clauseId)) {
        continue;
      }

      findings.push(
        createFinding(
          readinessFloorValidatorId,
          "honesty",
          `Spec "${authoredSpec.id}" states readiness "${authoredSpec.readiness}" but does not satisfy authored clause "${clauseId}".`,
          authoredSpec.id,
          clauseId,
          "readiness",
        ),
      );
    }
  }

  return createReport(readinessFloorValidatorId, "honesty", findings);
}

/**
 * Pre-graph authored-layer validation only. This composes the tiny Session 1 authored-model checks and is not the
 * Slice 3 graph validator gate.
 */
export function validateAuthoredModel(model: AuthoredModel): ValidationReport {
  const findings = [
    ...validateDuplicateIds(model).findings,
    ...validateDanglingReferences(model).findings,
    ...validateReadinessFloors(model).findings,
  ];

  return createReport(authoredModelValidatorId, "conformance", findings);
}

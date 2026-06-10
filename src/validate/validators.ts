import type { AnchorId, PackId, SpecId } from "../ids.js";
import type { AuthoredModel } from "./authored-model.js";
import type { Finding, ValidationReport, ValidatorFamily } from "./contracts.js";
import { evaluateReadinessFloor } from "./readiness-floor.js";

const duplicateIdsValidatorId = "conformance/duplicate-ids";
const danglingReferencesValidatorId = "conformance/dangling-references";
const readinessFloorValidatorId = "honesty/readiness-floor";
const authoredModelValidatorId = "authored-model";

type AuthoredId = SpecId | PackId | AnchorId;

function createReport(
  validatorId: string,
  findings: readonly Finding[],
  family?: ValidatorFamily,
): ValidationReport {
  if (family === undefined) {
    return { validatorId, findings };
  }

  return { validatorId, family, findings };
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

  return createReport(duplicateIdsValidatorId, findings, "conformance");
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

  return createReport(danglingReferencesValidatorId, findings, "conformance");
}

export function validateReadinessFloors(model: AuthoredModel): ValidationReport {
  const findings: Finding[] = [];

  for (const authoredSpec of model.specs) {
    for (const failure of evaluateReadinessFloor(authoredSpec, model)) {
      findings.push(
        createFinding(
          readinessFloorValidatorId,
          "honesty",
          `Spec "${authoredSpec.id}" states readiness "${authoredSpec.readiness}" but does not satisfy floor clause "${failure.clauseId}": ${failure.description}`,
          authoredSpec.id,
          failure.clauseId,
          "readiness",
        ),
      );
    }
  }

  return createReport(readinessFloorValidatorId, findings, "honesty");
}

/**
 * Pre-graph authored-layer validation only. This composes the tiny Session 1 authored-model checks and is not the
 * Slice 3 graph validator gate. The aggregate spans both check families, so it carries no single
 * `family` of its own — each finding states its family (`conformance` or `honesty`).
 */
export function validateAuthoredModel(model: AuthoredModel): ValidationReport {
  const findings = [
    ...validateDuplicateIds(model).findings,
    ...validateDanglingReferences(model).findings,
    ...validateReadinessFloors(model).findings,
  ];

  return createReport(authoredModelValidatorId, findings);
}

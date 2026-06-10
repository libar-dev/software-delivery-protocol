import { deliveryFactNames } from "../graph/schema.js";
import type { AnchorId, PackId, SpecId } from "../ids.js";
import { SPEC_SECTION_NAMES } from "../model/sections.js";
import type { AuthoredModel } from "./authored-model.js";
import type { Finding, ValidationReport, ValidatorFamily } from "./contracts.js";
import { evaluateReadinessFloor } from "./readiness-floor.js";

const duplicateIdsValidatorId = "conformance/duplicate-ids";
const danglingReferencesValidatorId = "conformance/dangling-references";
const authoringShapeValidatorId = "honesty/authoring-shape";
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Authoring-shape honesty (`05` §2, check 5), stood in at the authored layer until the extractor
 * lands (MD-16): no spec or pack hand-authors a delivery fact. The typed sections (MD-11) reject
 * this for inline literals at `tsc` time, but TypeScript's excess-property check fires only on
 * fresh literals — a section assembled through an intermediate variable slips past it, and this
 * runtime check is what catches it.
 */
export function validateAuthoringShape(model: AuthoredModel): ValidationReport {
  const findings: Finding[] = [];

  const appendSmuggledFact = (subjectId: string, factName: string, path: string): void => {
    findings.push(
      createFinding(
        authoringShapeValidatorId,
        "honesty",
        `"${subjectId}" hand-authors the derived delivery fact "${factName}" at "${path}" — delivery facts are derived, never authored.`,
        subjectId,
        factName,
        path,
      ),
    );
  };

  const scanCarrier = (subjectId: string, carrier: unknown, basePath: string): void => {
    if (!isRecord(carrier)) {
      return;
    }

    for (const factName of deliveryFactNames) {
      if (factName in carrier) {
        appendSmuggledFact(
          subjectId,
          factName,
          basePath === "" ? factName : `${basePath}.${factName}`,
        );
      }
    }
  };

  for (const authoredSpec of model.specs) {
    const specRecord = authoredSpec as unknown as Record<string, unknown>;
    scanCarrier(authoredSpec.id, specRecord, "");

    for (const sectionName of SPEC_SECTION_NAMES) {
      const section = specRecord[sectionName];

      if (Array.isArray(section)) {
        for (const [index, entry] of section.entries()) {
          scanCarrier(authoredSpec.id, entry, `${sectionName}[${String(index)}]`);
        }
        continue;
      }

      scanCarrier(authoredSpec.id, section, sectionName);
    }
  }

  for (const authoredPack of model.packs) {
    scanCarrier(authoredPack.id, authoredPack, "");
  }

  return createReport(authoringShapeValidatorId, findings, "honesty");
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
 * Pre-graph authored-layer validation only. This composes the pre-graph authored-model checks and
 * is not the Slice 3 graph validator gate (one validation path, MD-14). The aggregate spans both
 * check families, so it carries no single `family` of its own — each finding states its family
 * (`conformance` or `honesty`).
 */
export function validateAuthoredModel(model: AuthoredModel): ValidationReport {
  const findings = [
    ...validateDuplicateIds(model).findings,
    ...validateDanglingReferences(model).findings,
    ...validateAuthoringShape(model).findings,
    ...validateReadinessFloors(model).findings,
  ];

  return createReport(authoredModelValidatorId, findings);
}

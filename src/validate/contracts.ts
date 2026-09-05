import type { GraphSchema } from "../graph/schema.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

const validationContractsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.validation-contracts"),
  label: "conformance/honesty family currency and finding shapes",
  satisfies: ref("spec:validation.two-check-families"),
  component: componentAnchorId("component:protocol.validate"),
});
void validationContractsAnchor;

export const validatorFamilies = ["conformance", "honesty"] as const;
export type ValidatorFamily = (typeof validatorFamilies)[number];

export const validationSeverities = ["error", "warning"] as const;
export type Severity = (typeof validationSeverities)[number];

export interface Finding {
  readonly validatorId: string;
  readonly family: ValidatorFamily;
  readonly severity: Severity;
  readonly message: string;
  readonly subjectId?: string;
  readonly relatedId?: string;
  readonly path?: string;
  /**
   * Source location, carried by producers that read files (the extractor). Additive (L9) so the
   * one diagnostic currency stays one — no parallel extraction-report shape. Root-relative POSIX
   * path; 1-based line.
   */
  readonly file?: string;
  readonly line?: number;
}

export interface ValidationReport {
  readonly validatorId: string;
  /**
   * One individual validator belongs to exactly one family. An aggregate report that composes both
   * families omits this — the two families are load-bearing (`spec:validation.two-check-families`), so an aggregate never
   * mislabels itself with a single one; each finding carries its own.
   */
  readonly family?: ValidatorFamily;
  readonly findings: readonly Finding[];
}

export interface Validator<TInput = GraphSchema> {
  readonly id: string;
  readonly family: ValidatorFamily;
  validate(input: TInput): ValidationReport;
}

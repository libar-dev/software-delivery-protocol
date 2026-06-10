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
}

export interface ValidationReport {
  readonly validatorId: string;
  /**
   * One individual validator belongs to exactly one family. An aggregate report that composes both
   * families omits this — the two families are load-bearing (`05` §1), so an aggregate never
   * mislabels itself with a single one; each finding carries its own.
   */
  readonly family?: ValidatorFamily;
  readonly findings: readonly Finding[];
}

export interface Validator<TModel = unknown> {
  readonly id: string;
  readonly family: ValidatorFamily;
  validate(model: TModel): ValidationReport;
}

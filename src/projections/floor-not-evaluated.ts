/**
 * The label the Design Review, the census and the vault render for a Spec over which no readiness
 * floor is evaluated, because its kind or altitude is unratified
 * (`spec:validation.next-rung-floor#rule.notEvaluated`). It stands where a floor reached would,
 * never as `none` and never beside a divergence banner.
 */
export const FLOOR_NOT_EVALUATED_LABEL = "floor not evaluated (unratified descriptor)";

/** The reader values a floor reached is rendered from. */
interface FloorReading {
  readonly derivedReadiness?: string;
  readonly floorNotEvaluated?: readonly string[];
}

/** A floor-reached cell: the derived rung, `none` when even `idea` is unmet, or the label. */
export function floorReachedCell(spec: FloorReading): string {
  return spec.floorNotEvaluated === undefined
    ? (spec.derivedReadiness ?? "none")
    : FLOOR_NOT_EVALUATED_LABEL;
}

/** The same reading as a phrase: `floor <rung>`, `floor none`, or the label. */
export function floorPhrase(spec: FloorReading): string {
  return spec.floorNotEvaluated === undefined
    ? `floor ${spec.derivedReadiness ?? "none"}`
    : FLOOR_NOT_EVALUATED_LABEL;
}

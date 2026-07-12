// Micro-mock of the runner core, EXTENDED from 4-seam with typed step
// parameters. The 4-seam kernel proved step-TEXT drift is a tsc error; this
// kernel proves step-PARAMETER drift (renamed slot, retyped slot, out-of-union
// value) is a tsc error too. Execution is stubbed as before.

export type StepKind = "given" | "when" | "then";

/** A parameter bag: slot name → scalar or closed-union value. Tables/arrays
 *  are deliberately absent — the Examples-table form belongs to the grammar
 *  session (FINDINGS §3.6). */
export type ParamShape = Record<string, string | number | boolean>;

export interface ContractStep<S extends string, P extends ParamShape> {
  readonly kind: StepKind;
  readonly text: S;
  /** The example's AUTHORED point — values come from the spec, never the test. */
  readonly params: P;
}

/** Derived per example spec by `sdp build`, from the GRAPH (MD-14), keyed by
 *  spec ID — same legal status as the 4-seam contract; now each step carries
 *  its bound parameter point, typed per step text. */
export interface ExampleContract<S extends string, PM extends Record<S, ParamShape>> {
  readonly spec: string;
  readonly title: string;
  readonly steps: ReadonlyArray<{ [K in S]: ContractStep<K, PM[K]> }[S]>;
}

export type StepFn<W, P extends ParamShape> = (world: W, params: P) => void | Promise<void>;

/** Same law as 4-seam (every step, only the steps) — plus: the handler's
 *  params arg is typed per step, so reading a renamed slot or comparing a
 *  closed-union slot to a foreign value fails compile-time. */
export type StepBindings<W, S extends string, PM extends Record<S, ParamShape>> = {
  readonly [K in S]: StepFn<W, PM[K]>;
};

export function bindExample<W, S extends string, PM extends Record<S, ParamShape>>(
  contract: ExampleContract<S, PM>,
  world: () => W,
  bindings: StepBindings<W, S, PM>,
): void {
  // Real adapter: as 4-seam, plus each step handler is invoked with the
  // contract's authored params for that step — the spec's values flow INTO
  // the test; editing a value in the spec re-runs (and can re-redden) the
  // bound test without touching test code.
  void contract;
  void world;
  void bindings;
}

// Micro-mock of the future runner core + vitest adapter subpath exports
// ("@libar-dev/software-delivery-protocol/runner" + "/vitest").
// The TYPES here are the feasibility kernel; only the execution is stubbed.

export type StepKind = "given" | "when" | "then";

export interface ContractStep<S extends string> {
  readonly kind: StepKind;
  readonly text: S;
}

/** What `sdp build` derives per example spec — from the GRAPH (the statically
 *  reified truth, MD-14), keyed by spec ID. Derived, regenerable, importable
 *  because it is a projection, never the authored source (JS-B2.6's pattern). */
export interface ExampleContract<S extends string> {
  readonly spec: string;
  readonly title: string;
  readonly steps: ReadonlyArray<ContractStep<S>>;
}

export type StepFn<W> = (world: W) => void | Promise<void>;

/** The bindings must cover EVERY step (missing key = tsc error) and ONLY the
 *  steps (stale/typo key = excess-property error, with tsc's own did-you-mean). */
export type StepBindings<W, S extends string> = { readonly [K in S]: StepFn<W> };

export function bindExample<W, S extends string>(
  contract: ExampleContract<S>,
  world: () => W,
  bindings: StepBindings<W, S>,
): void {
  // Real adapter: emits describe(contract.title), runs steps in contract order
  // against a FRESH world per example (no module-level state, no resetState()),
  // and renders failures in spec language via the shared GWT renderer:
  //   ✗ Valid cart creates an order
  //     at step: Then an order is created
  // Mock: no-op — the demo is the type relationship above.
  void contract; void world; void bindings;
}

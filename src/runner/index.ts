import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { renderStepText } from "../notation/slots.js";

/**
 * The runner core — the framework-neutral half of the executable machinery (plan 12 §8,
 * settlement 6: `/runner` + a `/vitest` adapter subpath; the world lifecycle is the adapter's).
 * Nothing here touches the graph: the whole executable half lives below the `specTest` anchor
 * (binding, never liveness — MD-7), and the contract a test binds against is a **generated
 * projection of the graph** (derived, regenerable, importable because it is derived — JS-B2.6's
 * pattern), never the authored spec (no spec↔code import edges, JS-B2.3).
 *
 * The compile-time drift law lives in the types: `StepBindings` must cover **every** step (a
 * missing handler is a missing-property `tsc` error) and **only** the steps (a stale or typo'd
 * key is an excess-property error, with `tsc`'s own did-you-mean) — and each handler's `params`
 * argument is typed per step text, so reading a renamed slot or comparing a closed-union slot to
 * a foreign value fails compile-time too.
 */

export type StepKind = "given" | "when" | "then";

/** A parameter bag: slot name → scalar. Tables and arrays are deliberately absent — a table of
 *  cases is carrier sugar that expands to N sibling examples (point-per-example, MD-17). */
export type ParamValue = string | number | boolean;
export type ParamShape = Record<string, ParamValue>;

export interface ContractStep<S extends string, P extends ParamShape> {
  readonly kind: StepKind;
  /** The step's skeleton — slot groups normalized to `{name}` — the binding key. */
  readonly text: S;
  /** The example's authored bound point for this step — values come from the spec, never the test. */
  readonly params: P;
}

/**
 * What `sdp build` emits per example spec, keyed by spec ID and derived from the extracted graph
 * (the statically-reified truth, MD-14 — never the evaluated spec module).
 */
export interface ExampleContract<S extends string, PM extends Record<S, ParamShape>> {
  readonly spec: string;
  readonly title: string;
  readonly steps: readonly { readonly [K in S]: ContractStep<K, PM[K]> }[S][];
}

export type StepFn<W, P extends ParamShape> = (world: W, params: P) => void | Promise<void>;

/** Every step, only the steps — and each handler's params typed per step. */
export type StepBindings<W, S extends string, PM extends Record<S, ParamShape>> = {
  readonly [K in S]: StepFn<W, PM[K]>;
};

export interface PlannedStep<W> {
  readonly kind: StepKind;
  /** The skeleton text — the binding key, for machines. */
  readonly text: string;
  /** The natural reading — bound values inlined — for humans (the one renderer). */
  readonly label: string;
  readonly run: (world: W) => void | Promise<void>;
}

export interface ExamplePlan<W> {
  readonly spec: string;
  readonly title: string;
  readonly steps: readonly PlannedStep<W>[];
}

/** `Given` / `When` / `Then` — display casing for the one renderer. */
export function stepKindLabel(kind: StepKind): string {
  return kind === "given" ? "Given" : kind === "when" ? "When" : "Then";
}

/**
 * The natural reading of one contract step: `Given a customer has a cart with 2 line items` —
 * failure messages, test names, and projections all render through here (one renderer, several
 * consumers), so the spec's own language is what a red test prints.
 */
export function renderContractStep(step: {
  readonly kind: StepKind;
  readonly text: string;
  readonly params: ParamShape;
}): string {
  return `${stepKindLabel(step.kind)} ${renderStepText(substituteParams(step.text, step.params))}`;
}

/** Re-binds the skeleton's `{name}` groups with the step's params for natural rendering. */
function substituteParams(skeleton: string, params: ParamShape): string {
  return skeleton.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/gu, (group, name: string) =>
    name in params ? String(params[name]) : group,
  );
}

const exampleRunnerAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.example-runner"),
  label: "plans and executes a bound example against the caller's world",
  satisfies: ref("spec:extraction.example-runner"),
});

void exampleRunnerAnchor;

/**
 * The framework-neutral core: pairs each contract step with its bound handler, in contract order.
 * Duplicate step text within an example dedupes to one handler by construction — the bindings
 * object holds exactly one entry per step text ("same words, same meaning"), and every occurrence
 * in the scenario runs that one handler with its own authored params.
 */
export function planExample<W, S extends string, PM extends Record<S, ParamShape>>(
  contract: ExampleContract<S, PM>,
  bindings: StepBindings<W, S, PM>,
): ExamplePlan<W> {
  return {
    spec: contract.spec,
    title: contract.title,
    steps: contract.steps.map((step) => ({
      kind: step.kind,
      text: step.text,
      label: renderContractStep(step),
      run: (world: W) => bindings[step.text](world, step.params),
    })),
  };
}

/**
 * The framework-neutral execution loop the adapters share: every planned step in contract order
 * against the world the CALLER hands in — the world lifecycle is the adapter's (settlement 6:
 * the adapter creates a fresh world per example inside its test body; the core never calls a
 * factory). What the core owns is the failure law — a red step names itself in the spec's own
 * language (`at step: Then an order is created with total 100`) before the assertion detail.
 * The original error is kept where possible (assertion renderers read their own fields off it);
 * a frozen or getter-only error falls back to a wrapper carrying the original as `cause`, and a
 * non-Error throw is wrapped so the step name never gets lost.
 */
export async function runExamplePlan<W>(plan: ExamplePlan<W>, world: W): Promise<void> {
  for (const step of plan.steps) {
    try {
      await step.run(world);
    } catch (error) {
      throw prefixStepFailure(step.label, error);
    }
  }
}

function prefixStepFailure(label: string, error: unknown): unknown {
  if (error instanceof Error) {
    const prefixed = `at step: ${label}\n${error.message}`;

    try {
      error.message = prefixed;
      return error;
    } catch {
      return new Error(prefixed, { cause: error });
    }
  }

  return new Error(`at step: ${label}\n${String(error)}`);
}

/**
 * The one outcome no spec ever states — contributed by the runner core, first-class in every
 * generated Outcome union: the honest answer for a region of the example space the spec set does
 * not cover. An oracle returning it names a coverage gap; when a bound executable example selects
 * it, the registrar reddens because no authored Then may silently witness an unspecified outcome.
 */
export interface UnspecifiedOutcome {
  readonly kind: "unspecified";
}

export const unspecified: UnspecifiedOutcome = { kind: "unspecified" };

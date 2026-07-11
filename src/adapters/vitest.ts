import { describe, it } from "vitest";

import { planExample } from "../runner/index.js";
import type { ExampleContract, ParamShape, StepBindings } from "../runner/index.js";

/**
 * The vitest adapter — the framework-facing half of the runner split (plan 12 §8, settlement 6):
 * the core plans, the adapter owns the lifecycle. vitest is an **optional peer of this subpath
 * only** — the package's single-runtime-dependency posture holds everywhere else.
 *
 * Lifecycle law: a **fresh world per example** — `world()` is called inside the test body, so no
 * state survives between examples and no reset hook exists to forget. One example is one test:
 * the scenario's steps are one causal chain, not independent assertions.
 *
 * Failure law: a red step names itself in the spec's own language (the one renderer) before the
 * assertion detail — `at step: Then an order is created with total 100` — so the drift alarm
 * reads as spec text, never as a stack frame.
 */
export function bindExample<W, S extends string, PM extends Record<S, ParamShape>>(
  contract: ExampleContract<S, PM>,
  world: () => W,
  bindings: StepBindings<W, S, PM>,
): void {
  const plan = planExample(contract, bindings);

  describe(`${contract.title} (${contract.spec})`, () => {
    it("executes the bound example against a fresh world", async () => {
      const freshWorld = world();

      for (const step of plan.steps) {
        try {
          await step.run(freshWorld);
        } catch (error) {
          throw prefixStepFailure(step.label, error);
        }
      }
    });
  });
}

/**
 * Keeps the original error (vitest renders assertion diffs off its own fields) and prefixes the
 * step's natural reading; a non-Error throw is wrapped so the step name never gets lost.
 */
function prefixStepFailure(label: string, error: unknown): unknown {
  if (error instanceof Error) {
    error.message = `at step: ${label}\n${error.message}`;
    return error;
  }

  return new Error(`at step: ${label}\n${String(error)}`);
}

import { describe, it } from "vitest";

import { planExample, runExamplePlan } from "../runner/index.js";
import type { ExampleContract, ParamShape, StepBindings } from "../runner/index.js";

/**
 * The vitest adapter — the framework-facing half of the runner split (plan 12 §8, settlement 6):
 * the core plans and executes, the adapter registers. vitest is an **optional peer of this
 * subpath only** — the package's single-runtime-dependency posture holds everywhere else.
 *
 * Lifecycle law: a **fresh world per example** — the factory is called inside the test body by
 * the core's execution loop, so no state survives between examples and no reset hook exists to
 * forget. One example is one test: the scenario's steps are one causal chain, not independent
 * assertions. The failure law (a red step names itself in the spec's own language) lives in the
 * core (`runExamplePlan`), where it is unit-tested framework-free.
 */
export function bindExample<W, S extends string, PM extends Record<S, ParamShape>>(
  contract: ExampleContract<S, PM>,
  world: () => W,
  bindings: StepBindings<W, S, PM>,
): void {
  const plan = planExample(contract, bindings);

  describe(`${contract.title} (${contract.spec})`, () => {
    it("executes the bound example against a fresh world", async () => {
      await runExamplePlan(plan, world);
    });
  });
}

import { describe, it } from "vitest";

import { planExample, runExamplePlan } from "../runner/index.js";
import type { ExampleContract, ParamShape, StepBindings } from "../runner/index.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

/**
 * The vitest adapter — the framework-facing half of the runner split (plan 12 §8, settlement 6):
 * the core plans and executes steps, the adapter registers and **owns the world lifecycle** — a
 * fresh world per example, created here inside the test body, so no state survives between
 * examples and no reset hook exists to forget. One example is one test: the scenario's steps are
 * one causal chain, not independent assertions. The failure law (a red step names itself in the
 * spec's own language) lives in the core (`runExamplePlan`), where it is unit-tested
 * framework-free. vitest is an **optional peer of this subpath only** — the package's
 * single-runtime-dependency posture holds everywhere else.
 */
const exampleRunnerAdapterAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.example-runner-adapter"),
  label: "registers one test per example and owns the fresh world lifecycle",
  satisfies: ref("spec:extraction.example-runner"),
});
void exampleRunnerAdapterAnchor;

export function bindExample<W, S extends string, PM extends Record<S, ParamShape>>(
  contract: ExampleContract<S, PM>,
  world: () => W,
  bindings: StepBindings<W, S, PM>,
  after?: (world: W) => void | Promise<void>,
): void {
  const plan = planExample(contract, bindings);

  describe(`${contract.title} (${contract.spec})`, () => {
    it("executes the bound example against a fresh world", async () => {
      // The adapter's lifecycle law: the fresh world is created here, per example.
      const freshWorld = world();
      await runExamplePlan(plan, freshWorld);
      await after?.(freshWorld);
    });
  });
}

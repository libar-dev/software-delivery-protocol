import { describe, it } from "vitest";

import { planExample, runExamplePlan } from "../runner/index.js";
import type { ExampleContract, ParamShape, StepBindings } from "../runner/index.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";

/**
 * The vitest adapter — the framework-facing half of the runner split (plan 12 §8, settlement 6):
 * the core plans and executes steps, the adapter registers and **owns the world lifecycle** — a
 * fresh world per example, created here inside the test body, so no state survives between
 * examples and no reset hook exists to forget. One example is one test: the scenario's steps are
 * one causal chain, not independent assertions. The failure law (a red step names itself in the
 * spec's own language) lives in the core (`runExamplePlan`), where it is unit-tested
 * framework-free. This subpath needs Vitest 2 or later installed beside the package; the runner
 * core and other entry points do not load it.
 */
const adaptersComponentAnchor = codeAnchor({
  id: codeAnchorId("component:protocol.adapters"),
  label: "Protocol adapters: Vitest examples and TypeScript file imports",
  satisfies: ref("spec:extraction.example-runner"),
  uses: [componentAnchorId("component:protocol.runner")],
  layer: "adapter",
  context: "protocol",
});
const exampleRunnerAdapterAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.example-runner-adapter"),
  label: "registers one test per example and owns the fresh world lifecycle",
  satisfies: ref("spec:extraction.example-runner"),
  component: componentAnchorId("component:protocol.adapters"),
  uses: [codeAnchorId("impl:protocol.example-runner")],
  role: "adapter",
});
void adaptersComponentAnchor;
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
      let stepsPassed = false;
      try {
        await runExamplePlan(plan, freshWorld);
        stepsPassed = true;
      } finally {
        try {
          await after?.(freshWorld);
        } catch (error) {
          // eslint-disable-next-line no-unsafe-finally -- Only a passing step run can be replaced by a cleanup error.
          if (stepsPassed) throw error;
        }
      }
    });
  });
}

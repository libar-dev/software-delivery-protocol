import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import type { RunnableExampleAdapters } from "../src/testing/index.js";
import type { StepBindings } from "../src/runner/index.js";

const runnableModulesTypesAnchor = specTest({
  id: testAnchorId("test:protocol.runnable-modules-types"),
  label: "checks registrar skeletons and required authored adapters",
  verifies: ref("spec:extraction.runnable-modules"),
});
void runnableModulesTypesAnchor;

type GeneratedStep = "Given {n}" | "When submit" | "Then total {total}";
interface GeneratedParams {
  readonly "Given {n}": { readonly n: number };
  readonly "When submit": Record<string, never>;
  readonly "Then total {total}": { readonly total: number };
}

type GeneratedBindings = StepBindings<unknown, GeneratedStep, GeneratedParams>;

const complete = {
  "Given {n}": (_world, params) => void params.n,
  "When submit": () => undefined,
  "Then total {total}": (_world, params) => void params.total,
} satisfies GeneratedBindings;
void complete;

// The generated registrar's mapped type must keep every contract skeleton load-bearing.
// @ts-expect-error the generated When handler cannot disappear without failing typecheck
const missingWhen: GeneratedBindings = {
  "Given {n}": () => undefined,
  "Then total {total}": () => undefined,
};
void missingWhen;

const stale = {
  "Given {n}": () => undefined,
  "When submit": () => undefined,
  "Then total {total}": () => undefined,
  // @ts-expect-error stale skeleton keys are rejected by the generated mapped type
  "When stale submit": () => undefined,
} satisfies GeneratedBindings;
void stale;

type GeneratedAdapters = RunnableExampleAdapters<
  unknown,
  { readonly n: number },
  { readonly kind: "total"; readonly total: number }
>;

// @ts-expect-error a registrar requires an observe adapter supplied by the authored suite
const missingObserve: GeneratedAdapters = {
  createWorld: () => ({}),
  invoke: () => undefined,
  expected: () => ({ kind: "total", total: 1 }),
};
void missingObserve;

import { describe, expect, it } from "vitest";

import {
  compareContractOutcome,
  completeRunnableExample,
  createRunnableExample,
} from "../src/testing/index.js";
import type { ContractStep } from "../src/runner/index.js";

interface World {
  actual: Outcome;
  asserted: boolean;
}

interface Conditions {
  readonly n: number;
}
type Outcome =
  | { readonly kind: "an order totals {total}"; readonly total: number }
  | { readonly kind: "rejected because {reason}"; readonly reason: string };

const thenStep: ContractStep<"an order totals {total}", { readonly total: number }> = {
  kind: "then",
  text: "an order totals {total}",
  params: { total: 100 },
};

function execution(
  expected: (point: Partial<Conditions>) => Outcome = () => ({
    kind: "an order totals {total}",
    total: 100,
  }),
) {
  return createRunnableExample<World, Conditions, Outcome>(
    "spec:orders.example",
    { n: 2 },
    ["n"],
    {
      createWorld: () => ({
        actual: { kind: "an order totals {total}", total: 100 },
        asserted: false,
      }),
      invoke: () => undefined,
      observe: (world) => world.actual,
      expected,
      assertions: (world) => {
        world.asserted = true;
      },
    },
    [thenStep],
  );
}

describe("generated registrar testing runtime", () => {
  it("compares Spec Then params, oracle payload, and the observed outcome before assertions", async () => {
    const run = execution();

    compareContractOutcome(run, thenStep);
    await completeRunnableExample(run);

    expect(run.world.asserted).toBe(true);
  });

  it("renders the matching contract step for a Spec/oracle payload mismatch", () => {
    const run = execution(() => ({ kind: "an order totals {total}", total: 101 }));

    expect(() => {
      compareContractOutcome(run, thenStep);
    }).toThrow(
      /at step: Then an order totals 100[\s\S]*\.total[\s\S]*expected 100[\s\S]*actual 101/u,
    );
  });

  it("emits a scenario diagnostic when the oracle selects no authored Then", async () => {
    const run = execution(() => ({ kind: "rejected because {reason}", reason: "empty" }));

    await expect(completeRunnableExample(run)).rejects.toThrow(
      'scenario spec:orders.example: oracle selected "rejected because {reason}"; available Then skeletons: "an order totals {total}"',
    );
  });

  it("refuses oracle comparison for an incomplete Partial Conditions point", () => {
    expect(() =>
      createRunnableExample<World, Conditions, Outcome>(
        "spec:orders.example",
        {},
        ["n"],
        {
          createWorld: () => ({
            actual: { kind: "an order totals {total}", total: 100 },
            asserted: false,
          }),
          invoke: () => undefined,
          observe: (world) => world.actual,
          expected: () => ({ kind: "an order totals {total}", total: 100 }),
        },
        [thenStep],
      ),
    ).toThrow(
      'scenario spec:orders.example: oracle comparison refused for incomplete point; missing Conditions: "n"',
    );
  });
});

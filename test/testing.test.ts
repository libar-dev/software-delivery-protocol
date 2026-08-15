import { describe, expect, it, vi } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import {
  compareContractOutcome,
  completeRunnableExample,
  createRunnableExample,
  invokeRunnableExample,
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

const runnableModulesTestAnchor = specTest({
  id: testAnchorId("test:protocol.runnable-modules"),
  label: "verifies generated runnable-module registration and runtime semantics",
  verifies: ref("spec:extraction.runnable-modules"),
});
void runnableModulesTestAnchor;

describe("generated registrar testing runtime", () => {
  it("compares Spec Then params, oracle payload, and the observed outcome before assertions", async () => {
    const run = execution();

    compareContractOutcome(run, thenStep);
    await completeRunnableExample(run);

    expect(run.world.asserted).toBe(true);
  });

  it("invokes the scenario-level product call only once across repeated When steps", async () => {
    const run = execution();
    const invoke = vi.spyOn(run.adapters, "invoke");

    await invokeRunnableExample(run);
    await invokeRunnableExample(run);

    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("renders the matching contract step for a Spec/oracle payload mismatch", () => {
    const run = execution(() => ({ kind: "an order totals {total}", total: 101 }));

    expect(() => {
      compareContractOutcome(run, thenStep);
    }).toThrow(
      /Spec Then parameters do not match the oracle payload[\s\S]*\.total[\s\S]*expected 100[\s\S]*actual 101/u,
    );
  });

  it("stops before domain assertions when observation disagrees with the oracle", async () => {
    const run = execution();
    run.world.actual = { kind: "an order totals {total}", total: 99 };

    expect(() => {
      compareContractOutcome(run, thenStep);
    }).toThrow(
      /observed outcome does not match the oracle outcome[\s\S]*\.total[\s\S]*expected 100[\s\S]*actual 99/u,
    );
    expect(run.world.asserted).toBe(false);
    await expect(completeRunnableExample(run)).rejects.toThrow();
    expect(run.world.asserted).toBe(false);
  });

  it("emits a scenario diagnostic when the oracle selects no authored Then", async () => {
    const run = execution(() => ({ kind: "rejected because {reason}", reason: "empty" }));

    await expect(completeRunnableExample(run)).rejects.toThrow(
      'scenario spec:orders.example: oracle selected "rejected because {reason}"; available Then skeletons: "an order totals {total}"',
    );
  });

  it("refuses incomplete-point comparison at Then without calling the oracle", () => {
    const expected = vi.fn<() => Outcome>(() => ({
      kind: "an order totals {total}",
      total: 100,
    }));
    const run = createRunnableExample<World, Conditions, Outcome>(
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
        expected,
      },
      [thenStep],
    );

    expect(() => {
      compareContractOutcome(run, thenStep);
    }).toThrow(
      'scenario spec:orders.example: oracle comparison refused for incomplete point; missing Conditions: "n"',
    );
    expect(expected).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";

import {
  planExample,
  renderContractStep,
  runExamplePlan,
  stepKindLabel,
  unspecified,
} from "../src/runner/index.js";
import type { ExampleContract } from "../src/runner/index.js";

/**
 * The runner core, pinned framework-free: the plan (order, dedupe-to-one-handler, per-occurrence
 * params), the one renderer (natural reading), and the execution loop's failure law — the pieces
 * the vitest adapter registers but never owns.
 */

type Step = "a cart with {n} line items" | "the cart is submitted" | "an order is created";

// A type literal, deliberately not an interface: only type-alias object literals carry the
// implicit index signature the `Record<S, ParamShape>` constraint needs (the same reason the
// generated contracts emit `export type StepParams`).
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type StepParams = {
  "a cart with {n} line items": { readonly n: number };
  "the cart is submitted": Record<string, never>;
  "an order is created": Record<string, never>;
};

interface World {
  log: string[];
}

const pass = (): void => undefined;

// A recurring skeleton with its own params per occurrence: the dedupe law's exercise contract.
const recurringContract: ExampleContract<Step, StepParams> = {
  spec: "spec:orders.recurring",
  title: "A recurring step runs its one handler at each occurrence",
  steps: [
    { kind: "given", text: "a cart with {n} line items", params: { n: 2 } },
    { kind: "given", text: "a cart with {n} line items", params: { n: 2 } },
    { kind: "when", text: "the cart is submitted", params: {} },
    { kind: "then", text: "an order is created", params: {} },
  ],
};

describe("the runner core — plan, renderer, execution loop", () => {
  it("plans in contract order; duplicate step text dedupes to ONE handler that runs per occurrence", async () => {
    const calls: number[] = [];
    const plan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": (world, params) => {
        calls.push(params.n);
        world.log.push(`given ${String(params.n)}`);
      },
      "the cart is submitted": (world) => {
        world.log.push("when");
      },
      "an order is created": (world) => {
        world.log.push("then");
      },
    });

    expect(plan.spec).toBe("spec:orders.recurring");
    expect(plan.steps.map((step) => step.text)).toEqual([
      "a cart with {n} line items",
      "a cart with {n} line items",
      "the cart is submitted",
      "an order is created",
    ]);

    const world: World = { log: [] };
    await runExamplePlan(plan, () => world);

    // Both occurrences ran the one handler, each with its authored params, in contract order.
    expect(calls).toEqual([2, 2]);
    expect(world.log).toEqual(["given 2", "given 2", "when", "then"]);
  });

  it("renders the natural reading: kind casing, bound values inlined, unknown params left visible", () => {
    expect(stepKindLabel("given")).toBe("Given");
    expect(stepKindLabel("when")).toBe("When");
    expect(stepKindLabel("then")).toBe("Then");
    expect(
      renderContractStep({ kind: "given", text: "a cart with {n} line items", params: { n: 2 } }),
    ).toBe("Given a cart with 2 line items");
    // A skeleton slot with no param stays visible as {name} — an absence never renders silently.
    expect(
      renderContractStep({
        kind: "then",
        text: "an order is created with total {total}",
        params: {},
      }),
    ).toBe("Then an order is created with total {total}");
  });

  it("prefixes a failing step with its natural reading — the failure speaks the spec's language", async () => {
    const plan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": pass,
      "the cart is submitted": () => {
        throw new Error("boom");
      },
      "an order is created": pass,
    });

    await expect(runExamplePlan(plan, () => ({ log: [] }))).rejects.toThrow(
      "at step: When the cart is submitted\nboom",
    );
  });

  it("keeps the failure law over a frozen error (falls back to a wrapper carrying cause) and a non-Error throw", async () => {
    const frozen = Object.freeze(new Error("frozen boom"));
    const frozenPlan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- frozen IS an Error; the rule cannot see through Readonly<Error>
        throw frozen;
      },
      "the cart is submitted": pass,
      "an order is created": pass,
    });

    const caught = await runExamplePlan(frozenPlan, () => ({ log: [] })).then(
      () => undefined,
      (error: unknown) => error,
    );

    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toBe("at step: Given a cart with 2 line items\nfrozen boom");
    expect((caught as Error).cause).toBe(frozen);

    const stringPlan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "just a string";
      },
      "the cart is submitted": pass,
      "an order is created": pass,
    });

    await expect(runExamplePlan(stringPlan, () => ({ log: [] }))).rejects.toThrow(
      "at step: Given a cart with 2 line items\njust a string",
    );
  });

  it("calls the world factory once per run — a fresh world per example, no state carried over", async () => {
    let factoryCalls = 0;
    const plan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": (world) => {
        world.log.push("g");
      },
      "the cart is submitted": pass,
      "an order is created": pass,
    });

    const worlds: World[] = [];
    const factory = (): World => {
      factoryCalls += 1;
      const world: World = { log: [] };
      worlds.push(world);
      return world;
    };

    await runExamplePlan(plan, factory);
    await runExamplePlan(plan, factory);

    expect(factoryCalls).toBe(2);
    expect(worlds[0]).not.toBe(worlds[1]);
    expect(worlds[0]?.log).toEqual(["g", "g"]);
    expect(worlds[1]?.log).toEqual(["g", "g"]);
  });

  it("contributes the one outcome no spec ever states", () => {
    expect(unspecified).toEqual({ kind: "unspecified" });
  });
});

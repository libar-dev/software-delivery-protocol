import { describe, expect, it, vi } from "vitest";

import {
  planExample,
  renderContractStep,
  runExamplePlan,
  stepKindLabel,
  unspecified,
} from "../src/runner/index.js";
import type { ExampleContract, ParamShape, StepFn } from "../src/runner/index.js";

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
    {
      kind: "given",
      key: "a cart with {n} line items",
      text: "a cart with {n} line items",
      params: { n: 2 },
    },
    {
      kind: "given",
      key: "a cart with {n} line items",
      text: "a cart with {n} line items",
      params: { n: 2 },
    },
    { kind: "when", key: "the cart is submitted", text: "the cart is submitted", params: {} },
    { kind: "then", key: "an order is created", text: "an order is created", params: {} },
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
    await runExamplePlan(plan, world);

    // Both occurrences ran the one handler, each with its authored params, in contract order.
    expect(calls).toEqual([2, 2]);
    expect(world.log).toEqual(["given 2", "given 2", "when", "then"]);
  });

  it("renders the natural reading: kind casing, bound values inlined, unknown params left visible", () => {
    expect(stepKindLabel("given")).toBe("Given");
    expect(stepKindLabel("when")).toBe("When");
    expect(stepKindLabel("then")).toBe("Then");
    expect(
      renderContractStep({
        kind: "given",
        text: "a cart with {n} line items",
        params: { n: 2 },
      }),
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

    await expect(runExamplePlan(plan, { log: [] })).rejects.toThrow(
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

    const caught = await runExamplePlan(frozenPlan, { log: [] }).then(
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

    await expect(runExamplePlan(stringPlan, { log: [] })).rejects.toThrow(
      "at step: Given a cart with 2 line items\njust a string",
    );
  });

  it("executes against exactly the world the caller hands in — the lifecycle is the adapter's (settlement 6)", async () => {
    const plan = planExample<World, Step, StepParams>(recurringContract, {
      "a cart with {n} line items": (world) => {
        world.log.push("g");
      },
      "the cart is submitted": pass,
      "an order is created": pass,
    });

    // The core never calls a factory: it mutates the given world and nothing else — creating a
    // fresh world per example is the adapter's job, inside its own test body.
    const world: World = { log: [] };
    await runExamplePlan(plan, world);

    expect(world.log).toEqual(["g", "g"]);
  });

  it("contributes the one outcome no spec ever states", () => {
    expect(unspecified).toEqual({ kind: "unspecified" });
  });
});

describe("own step data", () => {
  const names = [
    "constructor",
    "toString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "toLocaleString",
    "propertyIsEnumerable",
    "__proto__",
  ];
  it.each(names)("refuses a missing own handler for %s and accepts an own handler", async (key) => {
    const step = { kind: "then" as const, key, text: key, params: {} };
    const contract = { spec: "spec:probe.own", title: "Own handlers", steps: [step] };
    await expect(runExamplePlan(planExample(contract, {}), {})).rejects.toThrow(
      `at step: Then ${key}\nno handler bound for step key "${key}"`,
    );
    const handler = vi.fn<StepFn<object, ParamShape>>();
    const world = {};
    await runExamplePlan(planExample(contract, { [key]: handler }), world);
    expect(handler).toHaveBeenCalledExactlyOnceWith(world, step.params, step);
  });
  it.each(names)("keeps missing %s parameters visible and renders own values", (key) => {
    const step = { kind: "then" as const, text: `result {${key}}`, params: {} };
    expect(renderContractStep(step)).toBe(`Then result {${key}}`);
    expect(renderContractStep({ ...step, params: { [key]: 3 } })).toBe("Then result 3");
  });
});

describe("class-instance step bindings", () => {
  it("runs inherited class methods with the bindings instance as receiver", async () => {
    class BaseSteps {
      readonly amount = 42;
      submit(world: { total: number }) {
        world.total += this.amount;
      }
    }
    class Steps extends BaseSteps {}
    const bindings = new Steps();
    const contract = {
      spec: "spec:probe.class-handlers",
      title: "Class handlers",
      steps: [{ kind: "when" as const, key: "submit" as const, text: "submit", params: {} }],
    };
    const world = { total: 0 };
    await runExamplePlan(planExample(contract, bindings), world);
    expect(world.total).toBe(42);
  });

  it.each(["toString", "valueOf", "constructor"])(
    "refuses inherited built-in handler %s on a class instance",
    async (key) => {
      class Steps {
        readonly submit = () => undefined;
      }
      const contract = {
        spec: "spec:probe.class-missing",
        title: "Missing class handler",
        steps: [{ kind: "then" as const, key, text: key, params: {} }],
      };
      await expect(
        runExamplePlan(
          planExample(
            contract,
            new Steps() as unknown as Record<string, StepFn<object, ParamShape>>,
          ),
          {},
        ),
      ).rejects.toThrow(`no handler bound for step key "${key}"`);
    },
  );

  it("refuses a constructor-function prototype constructor but runs an own constructor handler", async () => {
    const constructed = vi.fn();
    function Steps() {
      constructed();
    }
    const bindings = Reflect.construct(Steps, []) as Record<string, StepFn<object, ParamShape>>;
    const step = { kind: "then" as const, key: "constructor", text: "constructor", params: {} };
    const contract = {
      spec: "spec:probe.constructor",
      title: "Constructor handler",
      steps: [step],
    };
    await expect(runExamplePlan(planExample(contract, bindings), {})).rejects.toThrow(
      'no handler bound for step key "constructor"',
    );
    expect(constructed).toHaveBeenCalledTimes(1);

    const handler = vi.fn<StepFn<object, ParamShape>>();
    Object.defineProperty(bindings, "constructor", { value: handler });
    const world = {};
    await runExamplePlan(planExample(contract, bindings), world);
    expect(handler).toHaveBeenCalledExactlyOnceWith(world, step.params, step);
    expect(handler.mock.contexts).toEqual([bindings]);
  });
});

describe("function-shaped step bindings", () => {
  describe.each([
    {
      name: "static class",
      create: () =>
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class -- exercise class-valued bindings
        class Steps {
          static submit = pass;
        },
    },
    {
      name: "function namespace",
      create: () =>
        Object.assign(
          function Steps() {
            return undefined;
          },
          { submit: pass },
        ),
    },
  ])("$name", ({ create }) => {
    it.each(["toString", "bind", "call", "apply"])(
      "refuses inherited Function.prototype handler %s",
      async (key) => {
        const contract = {
          spec: "spec:probe.function-missing",
          title: "Missing function handler",
          steps: [{ kind: "then" as const, key, text: key, params: {} }],
        };
        const bindings = create() as unknown as Record<string, StepFn<object, ParamShape>>;
        await expect(runExamplePlan(planExample(contract, bindings), {})).rejects.toThrow(
          `at step: Then ${key}\nno handler bound for step key "${key}"`,
        );
      },
    );
  });

  it("runs inherited static methods with the bindings class as receiver", async () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class -- exercise static handler inheritance
    class BaseSteps {
      static amount = 1;
      static submit(world: { total: number }) {
        world.total += this.amount;
      }
    }
    class Steps extends BaseSteps {
      static override amount = 42;
    }
    const contract = {
      spec: "spec:probe.static-handlers",
      title: "Static handlers",
      steps: [{ kind: "when" as const, key: "submit" as const, text: "submit", params: {} }],
    };
    const world = { total: 0 };
    await runExamplePlan(planExample(contract, Steps), world);
    expect(world.total).toBe(42);
  });
});

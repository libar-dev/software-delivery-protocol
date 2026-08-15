import { isDeepStrictEqual } from "node:util";

import { bindExample } from "../adapters/vitest.js";
import type { ContractStep, ExampleContract, ParamShape, StepBindings } from "../runner/index.js";

export interface RunnableOutcome {
  readonly kind: string;
}

export interface RunnableExampleAdapters<W, C, O extends RunnableOutcome> {
  readonly createWorld: (point: Partial<C>) => W;
  readonly invoke: (world: W, point: Partial<C>) => void | Promise<void>;
  readonly observe: (world: W) => O;
  readonly expected: (point: Partial<C>) => O;
  readonly assertions?: (world: W, observed: O) => void | Promise<void>;
}

export interface RunnableExampleWorld<W, C, O extends RunnableOutcome> {
  readonly spec: string;
  readonly world: W;
  readonly point: Partial<C>;
  readonly adapters: RunnableExampleAdapters<W, C, O>;
  readonly availableThen: readonly string[];
  readonly missingConditions: readonly string[];
  oracle?: O;
  invoked: boolean;
  compared: boolean;
  observed?: O;
}

export function createRunnableExample<W, C, O extends RunnableOutcome>(
  spec: string,
  point: Partial<C>,
  requiredConditions: readonly (keyof C & string)[],
  adapters: RunnableExampleAdapters<W, C, O>,
  thenSteps: readonly ContractStep<string, ParamShape>[],
): RunnableExampleWorld<W, C, O> {
  const missing = requiredConditions.filter((name) => point[name] === undefined);

  return {
    spec,
    world: adapters.createWorld(point),
    point,
    adapters,
    availableThen: thenSteps.map((step) => step.text),
    missingConditions: missing,
    invoked: false,
    compared: false,
  };
}

export async function invokeRunnableExample<W, C, O extends RunnableOutcome>(
  execution: RunnableExampleWorld<W, C, O>,
): Promise<void> {
  if (execution.invoked) {
    return;
  }

  execution.invoked = true;
  await execution.adapters.invoke(execution.world, execution.point);
}

function oracleForComparison<W, C, O extends RunnableOutcome>(
  execution: RunnableExampleWorld<W, C, O>,
): O {
  if (execution.missingConditions.length > 0) {
    throw new Error(
      `scenario ${execution.spec}: oracle comparison refused for incomplete point; missing Conditions: ${execution.missingConditions.map((name) => JSON.stringify(name)).join(", ")}`,
    );
  }

  const oracle = execution.oracle ?? execution.adapters.expected(execution.point);
  execution.oracle = oracle;
  return oracle;
}

export function compareContractOutcome<W, C, O extends RunnableOutcome>(
  execution: RunnableExampleWorld<W, C, O>,
  step: ContractStep<string, ParamShape>,
): void {
  const oracle = oracleForComparison(execution);

  if (step.text !== oracle.kind) {
    return;
  }

  const { kind: _oracleKind, ...oraclePayload } = oracle;
  void _oracleKind;

  assertDeepEqual(
    step.params,
    oraclePayload,
    "Spec Then parameters do not match the oracle payload",
  );

  const observed = execution.adapters.observe(execution.world);
  assertDeepEqual(oracle, observed, "observed outcome does not match the oracle outcome");
  execution.observed = observed;
  execution.compared = true;
}

export async function completeRunnableExample<W, C, O extends RunnableOutcome>(
  execution: RunnableExampleWorld<W, C, O>,
): Promise<void> {
  const oracle = oracleForComparison(execution);

  if (!execution.compared) {
    const cause = new Error(`oracle kind ${JSON.stringify(oracle.kind)} has no matching Then`);
    throw new Error(
      `scenario ${execution.spec}: oracle selected ${JSON.stringify(oracle.kind)}; available Then skeletons: ${execution.availableThen.map((step) => JSON.stringify(step)).join(", ")}`,
      { cause },
    );
  }

  if (execution.adapters.assertions !== undefined) {
    await execution.adapters.assertions(
      execution.world,
      execution.observed ?? execution.adapters.observe(execution.world),
    );
  }
}

export function registerRunnableExample<
  W,
  C,
  O extends RunnableOutcome,
  S extends string,
  PM extends Record<S, ParamShape>,
>(
  contract: ExampleContract<S, PM>,
  point: Partial<C>,
  requiredConditions: readonly (keyof C & string)[],
  adapters: RunnableExampleAdapters<W, C, O>,
  bindings: StepBindings<RunnableExampleWorld<W, C, O>, S, PM>,
): void {
  const thenSteps = contract.steps.filter((step) => step.kind === "then");
  bindExample(
    contract,
    () => createRunnableExample(contract.spec, point, requiredConditions, adapters, thenSteps),
    bindings,
    completeRunnableExample,
  );
}

function assertDeepEqual(expected: unknown, actual: unknown, context: string): void {
  if (isDeepStrictEqual(expected, actual)) {
    return;
  }

  throw new Error(`${context}\n${firstDifference(expected, actual, "$", new Set())}`);
}

function firstDifference(
  expected: unknown,
  actual: unknown,
  path: string,
  visited: Set<unknown>,
): string {
  if (isDeepStrictEqual(expected, actual)) {
    return "";
  }

  if (
    typeof expected !== "object" ||
    expected === null ||
    typeof actual !== "object" ||
    actual === null
  ) {
    return `${path}: expected ${renderValue(expected)}, actual ${renderValue(actual)}`;
  }

  if (visited.has(expected)) {
    return `${path}: changed cyclic value`;
  }
  visited.add(expected);

  const expectedRecord = expected as Record<string, unknown>;
  const actualRecord = actual as Record<string, unknown>;
  const keys = [...new Set([...Object.keys(expectedRecord), ...Object.keys(actualRecord)])].sort();

  for (const key of keys) {
    if (!(key in actualRecord)) {
      return `${path}.${key}: missing; expected ${renderValue(expectedRecord[key])}`;
    }
    if (!(key in expectedRecord)) {
      return `${path}.${key}: extra; actual ${renderValue(actualRecord[key])}`;
    }
    const difference = firstDifference(
      expectedRecord[key],
      actualRecord[key],
      `${path}.${key}`,
      visited,
    );
    if (difference !== "") {
      return difference;
    }
  }

  return `${path}: expected ${renderValue(expected)}, actual ${renderValue(actual)}`;
}

function renderValue(value: unknown): string {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

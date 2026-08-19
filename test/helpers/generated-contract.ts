import type {
  ContractStep,
  ExampleContract,
  ParamShape,
} from "@libar-dev/software-delivery-protocol/runner";

/**
 * Resolve one generated step's actual bound parameters while preserving the contract's
 * skeleton-to-parameter correlation. Authored domain assertions use this for Then kinds that the
 * registrar's oracle comparator intentionally ignores.
 */
export function paramsForStep<S extends string, PM extends Record<S, ParamShape>, K extends S>(
  contract: ExampleContract<S, PM>,
  text: K,
): PM[K] {
  const step = contract.steps.find(
    (candidate): candidate is ContractStep<K, PM[K]> => candidate.text === text,
  );

  if (step === undefined) {
    throw new Error(`Generated contract ${contract.spec} has no step ${JSON.stringify(text)}.`);
  }

  return step.params;
}

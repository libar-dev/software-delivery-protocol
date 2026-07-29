import { describe, expect, it } from "vitest";

import { missingSpaceRefusedContract } from "../generated/contracts/validation.oracle-target-eligibility.missing-space-refused.contract.js";
import { ruleSpaceAcceptedContract } from "../generated/contracts/validation.oracle-target-eligibility.rule-space-accepted.contract.js";
import type { OracleTargetEligibilityConditions } from "../generated/contracts/validation.oracle-target-eligibility.space.js";
import { oracleTargetEligibilitySpace } from "../generated/contracts/validation.oracle-target-eligibility.space.js";
import { expectedOracleTargetEligibilityOutcome } from "./self-hosting-validators.oracle.js";

function completeConditions(
  point: Partial<OracleTargetEligibilityConditions>,
): OracleTargetEligibilityConditions {
  if (point.targetKind === undefined || point.ownsExampleSpace === undefined) {
    throw new Error("every oracle-eligibility witness must bind kind and example-space ownership");
  }

  return {
    targetKind: point.targetKind,
    ownsExampleSpace: point.ownsExampleSpace,
  };
}

interface AnyContractStep {
  readonly kind: "given" | "when" | "then";
  readonly text: string;
  readonly params: Readonly<Record<string, unknown>>;
}

interface AnyContract {
  readonly spec: string;
  readonly steps: readonly AnyContractStep[];
}

const contractsBySpec = {
  "spec:validation.oracle-target-eligibility.missing-space-refused": missingSpaceRefusedContract,
  "spec:validation.oracle-target-eligibility.rule-space-accepted": ruleSpaceAcceptedContract,
} as const satisfies Record<string, AnyContract>;

describe("the oracle-target-eligibility oracle", () => {
  it("assigns both generated points the outcome their contract's Then step records", () => {
    expect(oracleTargetEligibilitySpace.examples.map(({ spec }) => spec).sort()).toEqual(
      Object.keys(contractsBySpec).sort(),
    );

    // The oracle is authoritative only if it restates the authored expectation, so each outcome
    // is compared to the contract-recorded Then parameters — never to a hand-copied literal a
    // transcription slip could move in step with the oracle.
    const outcomes = oracleTargetEligibilitySpace.examples.map(({ spec, point }) => {
      const outcome = expectedOracleTargetEligibilityOutcome(completeConditions(point));
      const { kind, ...fields } = outcome;
      const contract: AnyContract = contractsBySpec[spec];
      expect(contract.spec).toBe(spec);
      const thenStep = contract.steps.find((step) => step.kind === "then" && step.text === kind);
      expect(
        thenStep,
        `${spec} states no Then step matching the oracle outcome "${kind}"`,
      ).toBeDefined();
      expect(thenStep?.params).toEqual(fields);
      return outcome;
    });

    // The two witnesses share one Then vocabulary; their parameters must still diverge.
    expect(new Set(outcomes.map((outcome) => JSON.stringify(outcome))).size).toBe(2);
    expect(outcomes.every(({ kind }) => kind !== "unspecified")).toBe(true);
  });
});

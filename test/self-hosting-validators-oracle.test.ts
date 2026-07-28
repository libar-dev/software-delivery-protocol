import { describe, expect, it } from "vitest";

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

describe("the oracle-target-eligibility oracle", () => {
  it("assigns finding count and resolving presence to both generated points", () => {
    const outcomes = oracleTargetEligibilitySpace.examples.map(({ point }) =>
      expectedOracleTargetEligibilityOutcome(completeConditions(point)),
    );

    expect(oracleTargetEligibilitySpace.examples.map(({ spec }) => spec).sort()).toEqual([
      "spec:validation.oracle-target-eligibility.missing-space-refused",
      "spec:validation.oracle-target-eligibility.rule-space-accepted",
    ]);
    expect(outcomes).toEqual([
      {
        kind: "oracle linkage reports {findingCount} findings and resolving presence {oraclePresent}",
        findingCount: 1,
        oraclePresent: false,
      },
      {
        kind: "oracle linkage reports {findingCount} findings and resolving presence {oraclePresent}",
        findingCount: 0,
        oraclePresent: true,
      },
    ]);
    expect(outcomes.every(({ kind }) => kind !== "unspecified")).toBe(true);
  });
});

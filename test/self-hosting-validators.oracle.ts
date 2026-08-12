import { oracleAnchorId, ref, specOracle } from "@libar-dev/software-delivery-protocol";

import type {
  OracleTargetEligibilityConditions,
  OracleTargetEligibilityOutcome,
} from "../generated/contracts/validation.oracle-target-eligibility.space.js";

export const oracleTargetEligibilityOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.oracle-target-eligibility"),
  label: "expected oracle-linkage result by example-space ownership",
  models: ref("spec:validation.oracle-target-eligibility"),
});

export function expectedOracleTargetEligibilityOutcome(
  conditions: OracleTargetEligibilityConditions,
): OracleTargetEligibilityOutcome {
  return {
    kind: "oracle linkage reports {findingCount} findings and resolving presence {oraclePresent}",
    findingCount: conditions.ownsExampleSpace ? 0 : 1,
    oraclePresent: conditions.ownsExampleSpace,
  };
}

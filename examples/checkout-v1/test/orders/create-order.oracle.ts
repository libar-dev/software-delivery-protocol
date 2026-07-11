import { oracleAnchorId, ref, specOracle } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import type {
  CreateOrderConditions,
  CreateOrderOutcome,
} from "../../generated/contracts/orders.create-order.space.js";

// The oracle binding (`specOracle`, the sibling of `specTest`): the graph records that an oracle
// EXISTS — never what it says. The `expected()` semantics below are implementation-side authored
// code, never extracted, never authoritative; outcome faithfulness stays human-reviewed, by law.
export const createOrderOracle = specOracle({
  id: oracleAnchorId("oracle:orders.create-order"),
  label: "expected create-order outcome over the example space",
  models: ref("spec:orders.create-order"),
});

// Typed against the generated space on both sides: the input type is the space's Conditions
// (rename a slot in the spec and this fails to compile), and the return type is the Outcome
// union derived from the parent's Then vocabulary (claiming an outcome the specs never stated
// is a `tsc` error). `unspecified` is the honest first-class answer for an unstated region.
export function expected(conditions: CreateOrderConditions): CreateOrderOutcome {
  if (conditions.n === 0) {
    return { kind: "order creation is rejected because {reason}", reason: "empty cart" };
  }

  if (conditions.availability === "out of stock") {
    return { kind: "order creation is rejected because {reason}", reason: "out of stock" };
  }

  if (conditions.q <= 0 || conditions.price <= 0) {
    return unspecified;
  }

  return {
    kind: "an order is created with total {total}",
    total: conditions.n * conditions.q * conditions.price,
  };
}

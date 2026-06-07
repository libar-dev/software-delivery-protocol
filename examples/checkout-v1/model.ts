import type { AuthoredModel } from "@libar-dev/software-delivery-protocol";

import { checkoutV1Pack } from "./specs/checkout.pack.js";
import { orderLifecycleDecisionSpec } from "./specs/decisions/order-lifecycle.spec.js";
import { createOrderInvalidCartSpec } from "./specs/orders/create-order-invalid-cart.spec.js";
import { createOrderValidCartSpec } from "./specs/orders/create-order-valid-cart.spec.js";
import { createOrderSpec } from "./specs/orders/create-order.spec.js";
import { orderInventoryRuleSpec } from "./specs/orders/order-inventory-rule.spec.js";
import { orderLatencyConstraintSpec } from "./specs/orders/order-latency-constraint.spec.js";
import { orderManagementSpec } from "./specs/orders/order-management.spec.js";
import { orderModelSpec } from "./specs/orders/order-model.spec.js";
import { orderTotalRuleSpec } from "./specs/orders/order-total-rule.spec.js";
import { createOrderUseCaseAnchor } from "./src/orders/create-order.use-case.js";
import { createOrderValidCartTest } from "./test/orders/create-order.valid-cart.test.js";

export const checkoutV1Model: AuthoredModel = {
  specs: [
    orderManagementSpec,
    createOrderSpec,
    createOrderValidCartSpec,
    createOrderInvalidCartSpec,
    orderTotalRuleSpec,
    orderInventoryRuleSpec,
    orderLatencyConstraintSpec,
    orderModelSpec,
    orderLifecycleDecisionSpec,
  ],
  packs: [checkoutV1Pack],
  anchors: [createOrderUseCaseAnchor, createOrderValidCartTest],
};

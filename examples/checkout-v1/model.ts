import type { AuthoredModel } from "@libar-dev/software-delivery-protocol";

import { checkoutV1Pack } from "./specs/checkout.pack.sdp.js";
import { orderLifecycleDecisionSpec } from "./specs/decisions/order-lifecycle.sdp.js";
import { createOrderInvalidCartSpec } from "./specs/orders/create-order-invalid-cart.sdp.js";
import { createOrderValidCartSpec } from "./specs/orders/create-order-valid-cart.sdp.js";
import { createOrderSpec } from "./specs/orders/create-order.sdp.js";
import { orderInventoryRuleSpec } from "./specs/orders/order-inventory-rule.sdp.js";
import { orderLatencyConstraintSpec } from "./specs/orders/order-latency-constraint.sdp.js";
import { orderManagementSpec } from "./specs/orders/order-management.sdp.js";
import { orderModelSpec } from "./specs/orders/order-model.sdp.js";
import { orderTotalRuleSpec } from "./specs/orders/order-total-rule.sdp.js";
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

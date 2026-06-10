import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";

export const checkoutV1Pack = pack({
  id: packId("pack:checkout-v1"),
  title: "Checkout v1",
  framing: "Let customers create orders from valid carts with honest authored traceability.",
  specs: [
    ref("spec:orders.order-management"),
    ref("spec:orders.create-order"),
    ref("spec:orders.create-order.valid-cart"),
    ref("spec:orders.create-order.invalid-cart"),
    ref("spec:orders.order-total-rule"),
    ref("spec:orders.order-inventory-rule"),
    ref("spec:orders.order-latency-constraint"),
    ref("spec:orders.order-model"),
    ref("spec:decisions.order-lifecycle"),
  ],
  modelRefs: [ref("spec:orders.order-model")],
});

import {
  constrainedBy,
  decidedBy,
  refines,
  spec,
  specId,
} from "@libar-dev/software-delivery-protocol";

export const createOrderSpec = spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "defined",
  intent: {
    actor: "customer",
    outcome: "Turn a valid cart into an order.",
    value: "Customers can complete purchases without the example modeling the rest of checkout.",
  },
  // The rules and examples stay promoted children — their refines/verifies relations are the
  // linkage of record (MD-10), and promoted evidence clears the floor. What the parent owns is
  // the EXAMPLE SPACE: the typed step vocabulary its example children bind points in; `sdp build`
  // derives the space contract (dimensions · every child's bound point · the Outcome union from
  // the then vocabulary) from here.
  behavior: {
    exampleSpace: {
      given: [
        "a customer has a cart with {n:number} line items",
        "every line item has quantity {q:number} and unit price {price:number}",
        'every cart item is {availability:"in stock"|"out of stock"}',
      ],
      when: ["the customer submits the cart for order creation"],
      then: [
        "an order is created with total {total:number}",
        "the order contains the original cart lines",
        'order creation is rejected because {reason:"empty cart"|"out of stock"}',
      ],
    },
  },
  relations: [
    refines(specId("spec:orders.order-management")),
    constrainedBy(specId("spec:orders.order-latency-constraint")),
    decidedBy(specId("spec:decisions.order-lifecycle")),
  ],
});

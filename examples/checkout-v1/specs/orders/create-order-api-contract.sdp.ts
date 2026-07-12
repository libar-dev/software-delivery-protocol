import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const createOrderApiContractSpec = spec({
  id: specId("spec:orders.create-order.api-contract"),
  title: "Create-order API contract",
  kind: "contract",
  altitude: "story",
  readiness: "idea",
  // Parked at idea: the blocking open question would fail the defined floor
  // (no-blocking-open-questions), and the contract carries no evidence yet — an honest idea-rung
  // spec, stated low and checked nowhere above its rung.
  intent: {
    outcome: "Pin the request and response shapes of POST /orders.",
    openQuestions: [
      {
        question:
          "Does the response carry the inventory-snapshot version the order was validated against?",
        blocking: true,
      },
    ],
  },
  relations: [refines(specId("spec:orders.create-order"))],
});

import type {
  DeliveryFactName,
  GraphEdge,
  GraphEdgeType,
  GraphNode,
  PrimitiveNode,
} from "../src/index.js";

const primitiveNode = {
  id: "spec:orders.create-order",
  nodeType: "Primitive",
  claim: "declared",
  specKind: "behavior",
  altitude: "feature",
  readiness: "ready",
  title: "Customer creates an order",
  file: "specs/orders/create-order.sdp.ts",
  sections: { intent: { outcome: "Turn a valid cart into an order." } },
  deliveryFacts: ["implemented", "has-verifier"] as const satisfies readonly DeliveryFactName[],
} satisfies PrimitiveNode;

const graphNode = primitiveNode satisfies GraphNode;

const graphEdge = {
  from: "impl:orders.create-order-use-case",
  type: "satisfies" satisfies GraphEdgeType,
  to: "spec:orders.create-order",
  claim: "anchored",
} satisfies GraphEdge;

void graphNode;
void graphEdge;

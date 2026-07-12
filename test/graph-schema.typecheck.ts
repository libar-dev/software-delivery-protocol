import type {
  AnchorNode,
  CodeNode,
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

// Binding nodes carry their binding location (file + line) — what a Design Review links to (R2).
const codeNode = {
  id: "impl:orders.create-order-use-case",
  nodeType: "CodeNode",
  claim: "anchored",
  label: "createOrderFromCart",
  file: "src/orders/create-order.use-case.ts",
  line: 23,
} satisfies CodeNode satisfies GraphNode;

const anchorNode = {
  id: "test:orders.create-order.valid-cart",
  nodeType: "Anchor",
  claim: "anchored",
  file: "test/orders/create-order.valid-cart.test.ts",
  line: 3,
} satisfies AnchorNode satisfies GraphNode;

const graphEdge = {
  from: "impl:orders.create-order-use-case",
  type: "satisfies" satisfies GraphEdgeType,
  to: "spec:orders.create-order",
  claim: "anchored",
} satisfies GraphEdge;

void graphNode;
void codeNode;
void anchorNode;
void graphEdge;

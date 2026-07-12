import { authoredEdgeTypes, schemaVersion } from "../src/index.js";
import type { Finding, GraphEdge, GraphSchema, ValidationReport, Validator } from "../src/index.js";

const graph = {
  schemaVersion,
  nodes: [
    {
      id: "spec:orders.create-order",
      nodeType: "Primitive",
      claim: "declared",
      specKind: "behavior",
      altitude: "feature",
      readiness: "idea",
      title: "Create order",
      file: "specs/orders/create-order.sdp.ts",
      sections: { intent: { outcome: "Turn a valid cart into an order." } },
    },
  ],
  edges: [
    {
      from: "spec:orders.create-order",
      type: "refines",
      to: "spec:orders.order-management",
      claim: "declared",
    },
  ],
} satisfies GraphSchema;

const finding = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  severity: "error",
  message: "readiness floor is not satisfied",
  subjectId: graph.nodes[0]?.id,
  relatedId: authoredEdgeTypes[0],
  path: "readiness",
} satisfies Finding;

const report = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  findings: [finding],
} satisfies ValidationReport;

// The validator contract defaults to the one validation seam: input is the graph (MD-14).
const validator: Validator = {
  id: "honesty/readiness-floor",
  family: "honesty",
  validate(input: GraphSchema) {
    void input;
    return report;
  },
};

void [graph, finding, report, validator];

// @ts-expect-error every edge records its claim (P9 — the taxonomy is never collapsed).
const invalidEdge: GraphEdge = {
  from: "spec:orders.create-order",
  type: "refines",
  to: "spec:orders.order-management",
};

void invalidEdge;

const invalidFinding: Finding = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  severity: "error",
  // @ts-expect-error findings need a stable message field.
  detail: "missing stable message field",
  message: "missing stable message field",
};

void invalidFinding;

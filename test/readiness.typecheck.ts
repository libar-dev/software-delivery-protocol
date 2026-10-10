import {
  authoredEdgeTypes,
  buildGraphIndex,
  evaluateReadinessFloor,
  readinessFloors,
  schemaVersion,
} from "../src/index.js";
import type {
  Finding,
  GraphEdge,
  GraphSchema,
  ReadinessClause,
  ReadinessFloorFailure,
  ReadinessFloorTarget,
  TypedDependencyType,
  ValidationReport,
  Validator,
} from "../src/index.js";

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

// The evaluator answers for a target rung an evaluation names; the rung is a ratified readiness.
const floorIndex = buildGraphIndex(graph);
const floorNode = floorIndex.primitivesById.get("spec:orders.create-order");
const nextRungFailures: readonly ReadinessFloorFailure[] =
  floorNode === undefined ? [] : evaluateReadinessFloor(floorNode, floorIndex, "ready");
const statedRungFailures: readonly ReadinessFloorFailure[] =
  floorNode === undefined ? [] : evaluateReadinessFloor(floorNode, floorIndex);

// A failure's targets are optional, and each target names its relation type and id; the stated
// rung is optional because a target may resolve to a node that is not a Spec.
const failureTargets: readonly ReadinessFloorTarget[] | undefined = nextRungFailures[0]?.targets;
const nonSpecTarget: ReadinessFloorTarget = { type: "decidedBy", id: "impl:orders.code" };
const specTarget: ReadinessFloorTarget = {
  type: "dependsOn",
  id: "spec:orders.basis",
  statedReadiness: "scoped",
};
const typedDependencyTypes: readonly TypedDependencyType[] = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
];
const clauseTargets: ReadinessClause["targets"] = readinessFloors.ready.clauses[1].targets;

void [statedRungFailures, failureTargets, nonSpecTarget, specTarget, typedDependencyTypes];
void clauseTargets;

if (floorNode !== undefined) {
  // @ts-expect-error a target rung is a ratified readiness, never an arbitrary string.
  evaluateReadinessFloor(floorNode, floorIndex, "shipped");
}

// @ts-expect-error `verifies` and `supersedes` are not typed dependencies.
const verifiesTarget: ReadinessFloorTarget = { type: "verifies", id: "spec:orders.example" };

void verifiesTarget;

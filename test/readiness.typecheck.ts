import {
  anchorImplementation,
  authoredEdgeTypes,
  implAnchorId,
  pack,
  packId,
  ref,
  spec,
  specId,
} from "../src/index.js";
import type { AuthoredModel, Finding, ValidationReport, Validator } from "../src/index.js";

const model = {
  specs: [
    spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "idea",
    }),
  ],
  packs: [
    pack({
      id: packId("pack:checkout-v1"),
      title: "Checkout v1",
      specs: [ref("spec:orders.create-order")],
    }),
  ],
  anchors: [
    anchorImplementation({
      id: implAnchorId("impl:orders.create-order-use-case"),
      satisfies: ref("spec:orders.create-order"),
    }),
  ],
} satisfies AuthoredModel;

const finding = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  severity: "error",
  message: "readiness floor is not satisfied",
  subjectId: model.specs[0]?.id,
  relatedId: authoredEdgeTypes[0],
  path: "readiness",
} satisfies Finding;

const report = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  findings: [finding],
} satisfies ValidationReport;

const validator: Validator<AuthoredModel> = {
  id: "honesty/readiness-floor",
  family: "honesty",
  validate(input) {
    void input;
    return report;
  },
};

void [model, finding, report, validator];

const invalidAuthoredModel: AuthoredModel = {
  specs: [],
  packs: [],
  anchors: [],
  // @ts-expect-error the pre-graph authored model is an in-memory DTO — it carries no source-file bookkeeping.
  sourceFiles: [],
};

void invalidAuthoredModel;

const invalidFinding: Finding = {
  validatorId: "honesty/readiness-floor",
  family: "honesty",
  severity: "error",
  // @ts-expect-error findings need a stable message field.
  detail: "missing stable message field",
  message: "missing stable message field",
};

void invalidFinding;

import { refines, spec, specId } from "../../src/index.js";
import type { AuthoredModel } from "../../src/index.js";

/**
 * Systematic should-pass / should-fail fixtures for the Session-1 authored-layer validators
 * (`05` §5 "Validator self-testing"). Each fixture pins a single validator outcome so a regression
 * that silently stops a validator firing is itself caught.
 *
 * The Wave-B compile-time twin lives in `test/builders.typecheck.ts`: a hand-authored delivery fact
 * inside a section (`invalid-hand-authored-delivery-fact-in-section`) is rejected by the closed
 * section types (MD-11), so it is pinned as a `@ts-expect-error` fixture, not a runtime one.
 * The extractor-era fixtures stay named for Slice 1+ (`plans/02` §3 H8): `invalid-non-static-id` ·
 * `invalid-non-static-section` · `invalid-hand-authored-satisfies-edge` ·
 * `invalid-ready-with-unresolved-dependency` · `invalid-ready-with-target-below-defined`.
 */
export interface ValidatorFixture {
  readonly name: string;
  readonly model: AuthoredModel;
  /**
   * `"pass"` asserts `validateAuthoredModel` returns no findings. Otherwise the model must produce a
   * finding from `validatorId`; when `relatedId` is given, at least one finding must also match it.
   */
  readonly expect: "pass" | { readonly validatorId: string; readonly relatedId?: string };
}

const validMinimalIdeaSpec: ValidatorFixture = {
  name: "valid-minimal-idea-spec",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.order-management"),
        title: "Order management",
        kind: "behavior",
        altitude: "epic",
        readiness: "idea",
        intent: { outcome: "Own the order lifecycle for checkout." },
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: "pass",
};

const invalidDuplicateId: ValidatorFixture = {
  name: "invalid-duplicate-id",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Turn a valid cart into an order." },
      }),
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order (duplicate)",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Accidental second definition of the same id." },
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "conformance/duplicate-ids" },
};

const invalidScopedWithoutRelation: ValidatorFixture = {
  name: "invalid-scoped-without-relation",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "scoped",
        intent: { outcome: "Turn a valid cart into an order." },
        behavior: { examples: ["Valid cart becomes an order."] },
        // No relations: a scoped spec must declare at least one authored relation.
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "at-least-one-relation" },
};

const invalidDefinedConstraintWithoutTarget: ValidatorFixture = {
  name: "invalid-defined-constraint-without-target",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Turn a valid cart into an order." },
      }),
      spec({
        id: specId("spec:orders.order-latency-constraint"),
        title: "Create-order latency budget",
        kind: "constraint",
        altitude: "story",
        readiness: "defined",
        intent: { outcome: "Keep create-order fast enough for interactive checkout." },
        // A defined constraint's evidence must be complete: every entry carries a machine-readable
        // target; this one omits it (and clears scoped on the entry's presence alone — no padding).
        constraints: [{ statement: "Create-order should respond quickly." }],
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: {
    validatorId: "honesty/readiness-floor",
    relatedId: "kind-evidence-complete",
  },
};

const invalidReadyWithBlockingQuestion: ValidatorFixture = {
  name: "invalid-ready-with-blocking-question",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.order-management"),
        title: "Order management",
        kind: "behavior",
        altitude: "epic",
        readiness: "idea",
        intent: { outcome: "Own the order lifecycle for checkout." },
      }),
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "ready",
        intent: {
          outcome: "Turn a valid cart into an order.",
          // Blocking open questions live in intent.openQuestions (MD-9); one flagged blocking
          // prevents honestly stating defined or ready.
          openQuestions: [
            { question: "Which payment provider gates order creation?", blocking: true },
          ],
        },
        behavior: { rules: ["Only valid carts become orders."] },
        relations: [refines(specId("spec:orders.order-management"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "no-blocking-open-questions" },
};

const validDefinedWithNonBlockingQuestion: ValidatorFixture = {
  name: "valid-defined-with-non-blocking-question",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.order-management"),
        title: "Order management",
        kind: "behavior",
        altitude: "epic",
        readiness: "idea",
        intent: { outcome: "Own the order lifecycle for checkout." },
      }),
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "defined",
        intent: {
          outcome: "Turn a valid cart into an order.",
          // Open questions that are prose or flagged blocking: false never block a stated rung.
          openQuestions: [
            "Should gift carts ride this use case?",
            { question: "Do we surface partial-inventory hints?", blocking: false },
          ],
        },
        behavior: { rules: ["Only valid carts become orders."] },
        relations: [refines(specId("spec:orders.order-management"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: "pass",
};

// MD-12's de-padding proof: model- and decision-kind specs clear scoped/defined on their natural
// evidence alone — no throwaway behavior.rules.
const validDefinedModelOnNaturalEvidence: ValidatorFixture = {
  name: "valid-defined-model-on-natural-evidence",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.order-management"),
        title: "Order management",
        kind: "behavior",
        altitude: "epic",
        readiness: "idea",
        intent: { outcome: "Own the order lifecycle for checkout." },
      }),
      spec({
        id: specId("spec:orders.order-model"),
        title: "Order-management domain vocabulary",
        kind: "model",
        altitude: "story",
        readiness: "defined",
        intent: { outcome: "Define the core order terms." },
        model: { terms: { cart: "A customer-selected set of line items." } },
        relations: [refines(specId("spec:orders.order-management"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: "pass",
};

const validDefinedDecisionOnNaturalEvidence: ValidatorFixture = {
  name: "valid-defined-decision-on-natural-evidence",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Turn a valid cart into an order." },
      }),
      spec({
        id: specId("spec:decisions.order-lifecycle"),
        title: "Order lifecycle keeps validation before creation",
        kind: "decision",
        altitude: "feature",
        readiness: "defined",
        intent: { outcome: "Decide when an order may be created." },
        decision: { decision: "Create orders only after cart validation succeeds." },
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: "pass",
};

export const activeValidatorFixtures: readonly ValidatorFixture[] = [
  validMinimalIdeaSpec,
  invalidDuplicateId,
  invalidScopedWithoutRelation,
  invalidDefinedConstraintWithoutTarget,
  invalidReadyWithBlockingQuestion,
  validDefinedWithNonBlockingQuestion,
  validDefinedModelOnNaturalEvidence,
  validDefinedDecisionOnNaturalEvidence,
];

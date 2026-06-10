import { constrainedBy, refines, spec, specId } from "../../src/index.js";
import type { AuthoredModel } from "../../src/index.js";

/**
 * Systematic should-pass / should-fail fixtures for the Session-1 authored-layer validators
 * (`05` §5 "Validator self-testing"). Each fixture pins a single validator outcome so a regression
 * that silently stops a validator firing is itself caught.
 *
 * The hand-authored-delivery-fact bypass is pinned twice, on purpose (MD-11 + MD-16): the
 * compile-time twin in `test/builders.typecheck.ts` proves the closed section types reject it for
 * inline literals; the runtime fixture here proves `honesty/authoring-shape` catches the non-fresh
 * object that slips past TypeScript's excess-property check.
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

// The runtime twin of the compile-time bypass fixture (MD-16): excess-property checking fires only
// on fresh literals, so a section assembled through an intermediate variable smuggles a delivery
// fact past tsc — the authoring-shape honesty check is what catches it.
const smuggledBehaviorSection = {
  rules: ["Only valid carts become orders."],
  "has-verifier": true,
};

const invalidHandAuthoredDeliveryFactInSection: ValidatorFixture = {
  name: "invalid-hand-authored-delivery-fact-in-section",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.create-order"),
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Turn a valid cart into an order." },
        behavior: smuggledBehaviorSection,
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "honesty/authoring-shape", relatedId: "has-verifier" },
};

// MD-16's promoted-evidence bound: an empty stub child is not a promotion — promotion moves content
// out (MD-10), so a child carrying no evidence of its own never clears the parent's floor.
const invalidDefinedBehaviorWithEmptyPromotedChild: ValidatorFixture = {
  name: "invalid-defined-behavior-with-empty-promoted-child",
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
        intent: { outcome: "Turn a valid cart into an order." },
        // No inline behavior content — the only would-be evidence is the empty stub child below.
        relations: [refines(specId("spec:orders.order-management"))],
      }),
      spec({
        id: specId("spec:orders.order-total-rule"),
        title: "Order total matches cart math",
        kind: "rule",
        altitude: "story",
        readiness: "idea",
        // The stub: a rule child with no behavior.rules statement. It clears its own idea floor
        // (parent relation present) but contributes no evidence to the parent.
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "kind-evidence-present" },
};

// MD-16's constrainedBy bound: the evidence slot is the promoted twin of the inline constraints
// section, so an edge to a non-constraint spec is not constraints evidence.
const invalidScopedBehaviorWithNonConstraintConstrainedBy: ValidatorFixture = {
  name: "invalid-scoped-behavior-with-non-constraint-constrained-by",
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
        readiness: "scoped",
        intent: { outcome: "Turn a valid cart into an order." },
        // The edge resolves, but to a behavior spec — not a constraint carrying its evidence.
        relations: [constrainedBy(specId("spec:orders.order-management"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "kind-evidence-present" },
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
  invalidHandAuthoredDeliveryFactInSection,
  invalidDefinedBehaviorWithEmptyPromotedChild,
  invalidScopedBehaviorWithNonConstraintConstrainedBy,
];

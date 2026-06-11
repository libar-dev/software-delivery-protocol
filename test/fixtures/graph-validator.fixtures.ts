import { constrainedBy, pack, packId, refines, spec, specId } from "../../src/index.js";
import type { FixtureModel } from "../helpers/fixture-graph.js";

/**
 * Systematic should-pass / should-fail fixtures for the graph validators (`05` §5 "Validator
 * self-testing"). Each fixture pins a single validator outcome so a regression that silently stops
 * a validator firing is itself caught. Fixtures are authored with the DSL builders and derived
 * through the real `deriveGraph` (see `helpers/fixture-graph.ts`); `validateGraph` consumes the
 * result — the same seam every consumer uses (one validation path, MD-14).
 *
 * The hand-authored-delivery-fact bypass is pinned three ways, on purpose (the typing law MD-11 +
 * carried evidence MD-16): the compile-time twin in `test/builders.typecheck.ts` proves the closed
 * section types reject it for inline literals; the runtime fixture here proves
 * `honesty/authoring-shape` catches the non-fresh object that slips past TypeScript's
 * excess-property check; and the on-disk corpus `invalid-hand-authored-delivery-fact-in-section`
 * (`test/extract.test.ts`) proves the same end-to-end from a source file the typechecker never
 * sees. The once-reserved extractor-era names are all active on-disk corpora:
 * `invalid-non-static-id` · `invalid-non-static-section` · `invalid-hand-authored-satisfies-edge`
 * · `invalid-ready-with-unresolved-dependency` · `invalid-ready-with-target-below-defined`.
 */
export interface ValidatorFixture {
  readonly name: string;
  readonly model: FixtureModel;
  /**
   * `"pass"` asserts `validateGraph` returns no findings at all. Otherwise the model must produce
   * a finding from `validatorId`; when `relatedId` and/or `path` is given, at least one finding
   * must also match them (other informative findings may legitimately accompany a should-fail
   * model).
   */
  readonly expect:
    | "pass"
    | { readonly validatorId: string; readonly relatedId?: string; readonly path?: string };
}

// The minimal clean repo: one idea spec carried by a pack — connected (a lone spec would
// legitimately surface as an orphan, pinned by the `orphan-spec` corpus instead).
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
    packs: [
      pack({
        id: packId("pack:checkout-v1"),
        title: "Checkout v1",
        specs: [specId("spec:orders.order-management")],
      }),
    ],
  },
  expect: "pass",
};

// The graph backstop for L2: the extractor excludes duplicate carriers before derivation
// (`extract/duplicate-id`), so this fixture deliberately reaches `validateGraph` with both nodes —
// the non-extractor-producer input class the graph check exists for.
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
  },
  expect: "pass",
};

// The should-fail twins of the two natural-evidence passes above: the same evidence cells with the
// evidence absent — a floor that stops reading model.terms or decision.decision regresses here,
// never silently. The section's presence is not the evidence (per-kind evidence table, MD-12).
const invalidScopedModelWithoutTerms: ValidatorFixture = {
  name: "invalid-scoped-model-without-terms",
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
        readiness: "scoped",
        intent: { outcome: "Define the core order terms." },
        // A model's evidence is its terms: the bare section carries none, so scoped's
        // evidence-present clause fails.
        model: {},
        relations: [refines(specId("spec:orders.order-management"))],
      }),
    ],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "kind-evidence-present" },
};

const invalidScopedDecisionWithoutSection: ValidatorFixture = {
  name: "invalid-scoped-decision-without-section",
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
        readiness: "scoped",
        intent: { outcome: "Decide when an order may be created." },
        // No decision section at all: a decision-kind spec's natural evidence is missing outright.
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "kind-evidence-present" },
};

const invalidDefinedDecisionWithoutWrittenChoice: ValidatorFixture = {
  name: "invalid-defined-decision-without-written-choice",
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
        // Context alone clears scoped (the section is present — context may precede the choice)
        // but not defined: evidence-complete requires decision.decision — the chosen option —
        // written.
        decision: { context: "Carts arrive at checkout both validated and unvalidated." },
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
  },
  expect: { validatorId: "honesty/readiness-floor", relatedId: "kind-evidence-complete" },
};

// The runtime twin of the compile-time bypass fixture (MD-16): excess-property checking fires only
// on fresh literals, so a section assembled through an intermediate variable smuggles a delivery
// fact past tsc — the authoring-shape honesty check over the graph is what catches it.
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
  },
  expect: { validatorId: "honesty/authoring-shape", relatedId: "has-verifier" },
};

// The array-carrier half of the same scan: an array section's carriers are its entries, so a
// delivery fact smuggled into a constraints[] entry is found at the entry's path — pinned via
// `path`, so the scan's array branch cannot regress behind the record-carrier pin above.
const smuggledConstraintEntry = {
  statement: "Create-order should respond within the checkout budget.",
  implemented: true,
};

const invalidHandAuthoredDeliveryFactInArrayEntry: ValidatorFixture = {
  name: "invalid-hand-authored-delivery-fact-in-array-entry",
  model: {
    specs: [
      spec({
        id: specId("spec:orders.order-latency-constraint"),
        title: "Create-order latency budget",
        kind: "constraint",
        altitude: "story",
        readiness: "idea",
        intent: { outcome: "Keep create-order fast enough for interactive checkout." },
        constraints: [smuggledConstraintEntry],
      }),
    ],
  },
  expect: {
    validatorId: "honesty/authoring-shape",
    relatedId: "implemented",
    path: "constraints[0].implemented",
  },
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
  invalidScopedModelWithoutTerms,
  invalidScopedDecisionWithoutSection,
  invalidDefinedDecisionWithoutWrittenChoice,
  invalidHandAuthoredDeliveryFactInSection,
  invalidHandAuthoredDeliveryFactInArrayEntry,
  invalidDefinedBehaviorWithEmptyPromotedChild,
  invalidScopedBehaviorWithNonConstraintConstrainedBy,
];

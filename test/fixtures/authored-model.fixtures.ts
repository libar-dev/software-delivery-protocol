import { refines, spec, specId } from "../../src/index.js";
import type { AuthoredModel } from "../../src/index.js";

/**
 * Systematic should-pass / should-fail fixtures for the Session-1 authored-layer validators
 * (`05` §5 "Validator self-testing"). Each fixture pins a single validator outcome so a regression
 * that silently stops a validator firing is itself caught.
 *
 * Scope: only the fixtures that exercise *current, decision-free* behavior live here as ACTIVE.
 * Two further fixtures from the hardening plan are gated on later work and are tracked as `it.todo`
 * stubs in `fixtures.test.ts`:
 *   - `invalid-ready-with-blocking-question`            — gated on H2 (open-questions canonical home)
 *   - `invalid-hand-authored-delivery-fact-in-section`  — gated on D1 (typed sections)
 * Both flip to ACTIVE in Wave B (see `plans/03-decision-resolution-and-base-reconciliation.md`).
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
        behavior: { rules: ["The create-order path stays inside a latency budget."] },
        // A defined constraint must carry a machine-readable target; this one omits it.
        constraints: { statement: "Create-order should respond quickly." },
        relations: [refines(specId("spec:orders.create-order"))],
      }),
    ],
    packs: [],
    anchors: [],
  },
  expect: {
    validatorId: "honesty/readiness-floor",
    relatedId: "constraint-machine-readable-target",
  },
};

export const activeValidatorFixtures: readonly ValidatorFixture[] = [
  validMinimalIdeaSpec,
  invalidDuplicateId,
  invalidScopedWithoutRelation,
  invalidDefinedConstraintWithoutTarget,
];

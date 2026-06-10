import { describe, expect, it } from "vitest";

import {
  SPEC_KINDS,
  evaluateReadinessFloor,
  kindEvidence,
  readinessFloors,
  refines,
  spec,
  specId,
  validationSeverities,
  validatorFamilies,
} from "../src/index.js";
import type { AuthoredModel, Spec } from "../src/index.js";

function modelOf(...specs: readonly Spec[]): AuthoredModel {
  return { specs, packs: [], anchors: [] };
}

describe("readiness and validation contracts", () => {
  it("exports the canonical validator families and severities", () => {
    expect(validatorFamilies).toEqual(["conformance", "honesty"]);
    expect(validationSeverities).toEqual(["error", "warning"]);
  });

  it("defines the kind-blind structural clauses as one table (MD-13), clause ids defined exactly once", () => {
    expect(Object.keys(readinessFloors)).toEqual(["idea", "scoped", "defined", "ready"]);

    expect(readinessFloors.idea.clauses.map((clause) => clause.id)).toEqual([
      "id",
      "title",
      "kind",
      "altitude",
      "intent.outcome-or-parent-relation",
    ]);

    expect(readinessFloors.scoped.clauses.map((clause) => clause.id)).toEqual([
      "intent.outcome",
      "at-least-one-relation",
      "kind-evidence-present",
    ]);

    expect(readinessFloors.defined.clauses.map((clause) => clause.id)).toEqual([
      "kind-evidence-complete",
      "no-blocking-open-questions",
    ]);

    expect(readinessFloors.ready.clauses.map((clause) => clause.id)).toEqual([
      "all-relations-resolve",
      "depends-on-and-refines-targets-are-defined",
      "anchors-resolve",
    ]);
  });

  it("keeps the graph-shaped ready clauses deferred in Session 1 (MD-14)", () => {
    expect(readinessFloors.ready.clauses.every((clause) => "deferredInSession1" in clause)).toBe(
      true,
    );
  });

  it("covers every kind in the evidence table; workflow and contract ride the behavior row (MD-12)", () => {
    expect(Object.keys(kindEvidence).sort()).toEqual([...SPEC_KINDS].sort());
    expect(kindEvidence.workflow).toBe(kindEvidence.behavior);
    // Documented interim: the contract row repoints when a dedicated contract section lands.
    expect(kindEvidence.contract).toBe(kindEvidence.behavior);
  });

  it("counts promoted children as evidence — promotion never costs an earned rung (MD-10/MD-12)", () => {
    const parent = spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Turn a valid cart into an order." },
      // No inline behavior content — the promoted rule child below is the evidence.
      relations: [refines(specId("spec:orders.order-management"))],
    });
    const promotedRule = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Keep totals deterministic." },
      behavior: { rules: ["The order total is the sum of all line subtotals."] },
      relations: [refines(specId("spec:orders.create-order"))],
    });

    expect(evaluateReadinessFloor(parent, modelOf(parent, promotedRule))).toEqual([]);

    expect(
      evaluateReadinessFloor(parent, modelOf(parent)).map((failure) => failure.clauseId),
    ).toEqual(["kind-evidence-present", "kind-evidence-complete"]);

    // An empty stub child is not a promotion (MD-16): promotion moves content out (MD-10), so a
    // rule child with no statement of its own contributes no evidence.
    const stubRule = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      relations: [refines(specId("spec:orders.create-order"))],
    });

    expect(
      evaluateReadinessFloor(parent, modelOf(parent, stubRule)).map((failure) => failure.clauseId),
    ).toEqual(["kind-evidence-present", "kind-evidence-complete"]);
  });

  it("keeps the constraint floor monotonic: an untargeted entry clears scoped, not defined (MD-12)", () => {
    const constraintAt = (readiness: Spec["readiness"]): Spec =>
      spec({
        id: specId("spec:orders.order-latency-constraint"),
        title: "Create-order latency budget",
        kind: "constraint",
        altitude: "story",
        readiness,
        intent: { outcome: "Keep create-order fast enough for interactive checkout." },
        constraints: [{ statement: "Create-order should respond within the checkout budget." }],
        relations: [refines(specId("spec:orders.create-order"))],
      });

    const scoped = constraintAt("scoped");
    expect(evaluateReadinessFloor(scoped, modelOf(scoped))).toEqual([]);

    const defined = constraintAt("defined");
    expect(
      evaluateReadinessFloor(defined, modelOf(defined)).map((failure) => failure.clauseId),
    ).toEqual(["kind-evidence-complete"]);
  });

  it("requires a structured GWT entry for a defined example; prose clears scoped only (MD-10)", () => {
    const exampleWith = (examples: NonNullable<Spec["behavior"]>["examples"]): Spec =>
      spec({
        id: specId("spec:orders.create-order.valid-cart"),
        title: "Valid cart creates an order",
        kind: "example",
        altitude: "story",
        readiness: "defined",
        intent: { outcome: "Show that a valid cart can become an order." },
        behavior: { examples },
        relations: [refines(specId("spec:orders.create-order"))],
      });

    const prose = exampleWith(["Valid cart becomes an order with the computed total."]);
    expect(
      evaluateReadinessFloor(prose, modelOf(prose)).map((failure) => failure.clauseId),
    ).toEqual(["kind-evidence-complete"]);

    const structured = exampleWith([
      {
        given: ["A customer has a valid cart."],
        when: ["The customer submits the cart."],
        then: ["An order is created."],
      },
    ]);
    expect(evaluateReadinessFloor(structured, modelOf(structured))).toEqual([]);
  });
});

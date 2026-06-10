import { describe, expect, it } from "vitest";

import {
  SPEC_KINDS,
  buildGraphIndex,
  deriveReadiness,
  evaluateReadinessFloor,
  kindEvidence,
  readinessFloors,
  refines,
  spec,
  specId,
  validationSeverities,
  validatorFamilies,
} from "../src/index.js";
import type { GraphIndex, PrimitiveNode, ReadinessFloorFailure, Spec } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

/** Indexes the graph derived from the given model and resolves the subject's Primitive node. */
function indexedSubject(
  subjectId: string,
  specs: readonly Spec[],
): { node: PrimitiveNode; index: GraphIndex } {
  const index = buildGraphIndex(deriveFixtureGraph({ specs }));
  const node = index.primitivesById.get(subjectId);

  if (node === undefined) {
    throw new Error(`Fixture graph is missing the subject node "${subjectId}".`);
  }

  return { node, index };
}

/** Evaluates the floor for one spec over the graph derived from the given model. */
function floorFailuresFor(
  subjectId: string,
  ...specs: readonly Spec[]
): readonly ReadinessFloorFailure[] {
  const { node, index } = indexedSubject(subjectId, specs);

  return evaluateReadinessFloor(node, index);
}

/** Derives the structural rung for one spec over the graph derived from the given model. */
function derivedReadinessFor(subjectId: string, ...specs: readonly Spec[]) {
  const { node, index } = indexedSubject(subjectId, specs);

  return deriveReadiness(node, index);
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

  it("evaluates every clause — the ready clauses included — over the one graph (one validation path, MD-14)", () => {
    for (const floor of Object.values(readinessFloors)) {
      for (const clause of floor.clauses) {
        expect(typeof clause.predicate).toBe("function");
      }
    }
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

    expect(floorFailuresFor(parent.id, parent, promotedRule)).toEqual([]);

    expect(floorFailuresFor(parent.id, parent).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-present",
      "kind-evidence-complete",
    ]);

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
      floorFailuresFor(parent.id, parent, stubRule).map((failure) => failure.clauseId),
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
    expect(floorFailuresFor(scoped.id, scoped)).toEqual([]);

    const defined = constraintAt("defined");
    expect(floorFailuresFor(defined.id, defined).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-complete",
    ]);
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
    expect(floorFailuresFor(prose.id, prose).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-complete",
    ]);

    const structured = exampleWith([
      {
        given: ["A customer has a valid cart."],
        when: ["The customer submits the cart."],
        then: ["An order is created."],
      },
    ]);
    expect(floorFailuresFor(structured.id, structured)).toEqual([]);
  });

  describe("derived readiness (the stated-vs-derived split, `05` §3)", () => {
    const parent = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "defined",
      intent: { outcome: "Coordinate the order-management slice." },
      behavior: { rules: ["Order management keeps the slice traceable."] },
    });

    /** A rule spec whose only relation resolves to the parent above. */
    const ruleAt = (readiness: Spec["readiness"], overrides?: Partial<Spec>): Spec =>
      spec({
        id: specId("spec:orders.order-total-rule"),
        title: "Order total matches cart math",
        kind: "rule",
        altitude: "story",
        readiness,
        intent: { outcome: "Keep totals deterministic." },
        behavior: { rules: ["The order total is the sum of all line subtotals."] },
        relations: [refines(specId("spec:orders.order-management"))],
        ...overrides,
      });

    it("derives the highest cumulatively-cleared rung, independent of the stated one", () => {
      // States idea but structurally clears every rung through ready — derived above stated is
      // ordinary information, never a finding (the floor is a floor, not a quota).
      expect(derivedReadinessFor("spec:orders.order-total-rule", ruleAt("idea"), parent)).toBe(
        "ready",
      );
    });

    it("derives below the stated rung exactly where the floor check fails (the divergence)", () => {
      const padded = ruleAt("ready", {
        intent: {
          outcome: "Keep totals deterministic.",
          openQuestions: [{ question: "Do bundle discounts apply per line?", blocking: true }],
        },
      });

      // The blocking open question caps the derived rung at scoped; the stated ready also fails
      // the floor check — the same table answers both readings (MD-13).
      expect(derivedReadinessFor(padded.id, padded, parent)).toBe("scoped");
      expect(
        floorFailuresFor(padded.id, padded, parent).map((failure) => failure.clauseId),
      ).toEqual(["no-blocking-open-questions"]);
    });

    it("derives undefined when even the idea clauses fail", () => {
      const bare = spec({
        id: specId("spec:orders.order-total-rule"),
        title: "Order total matches cart math",
        kind: "rule",
        altitude: "story",
        readiness: "idea",
        // No intent.outcome and no parent relation: the idea floor itself is unmet.
      });

      expect(derivedReadinessFor(bare.id, bare)).toBeUndefined();
    });

    it("stays total over an unratified kind: no rung derives, the conformance error owns it", () => {
      const { node, index } = indexedSubject("spec:orders.order-total-rule", [
        ruleAt("scoped"),
        parent,
      ]);
      const foreign = { ...node, specKind: "saga" as PrimitiveNode["specKind"] };

      expect(deriveReadiness(foreign, index)).toBeUndefined();
    });
  });
});

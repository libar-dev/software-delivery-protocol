import { describe, expect, it } from "vitest";

import {
  SPEC_KINDS,
  buildGraphIndex,
  constrainedBy,
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
    const subject = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "ready",
      intent: { outcome: "Keep totals deterministic." },
      behavior: { rules: ["The order total is the sum of all line subtotals."] },
      relations: [refines(specId("spec:orders.order-management"))],
    });
    const target = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "defined",
      intent: { outcome: "Own the order lifecycle for checkout." },
      behavior: { rules: ["Order management keeps the slice traceable."] },
    });

    // With the refines target in the graph, every clause through ready holds.
    expect(floorFailuresFor(subject.id, subject, target)).toEqual([]);

    // The identical spec over a graph missing the target flips the graph-shaped ready clause —
    // the clause reads the one graph, not the spec value alone.
    expect(floorFailuresFor(subject.id, subject).map((failure) => failure.clauseId)).toEqual([
      "all-relations-resolve",
    ]);
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

  it("keeps every kind's evidence row monotonic: defined evidence implies scoped evidence (MD-12)", () => {
    // "Monotonic by construction" (MD-12) is structural for the kind-blind clauses (the evaluator
    // is cumulative) but a table property for the evidence cells: every kind's defined cell must
    // be at least as strict as its scoped cell. The probe corpus spans every evidence form the
    // table reads — inline and promoted — so a future row whose defined cell passes where its
    // scoped cell fails is caught here, never only in review.
    const subjectId = specId("spec:orders.create-order");
    const probeSpec = (overrides: Partial<Spec>): Spec =>
      spec({
        id: subjectId,
        title: "Create order",
        kind: "behavior",
        altitude: "feature",
        readiness: "idea",
        intent: { outcome: "Turn a valid cart into an order." },
        ...overrides,
      });

    const ruleChild = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total matches cart math",
      kind: "rule",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Keep totals deterministic." },
      behavior: { rules: ["The order total is the sum of all line subtotals."] },
      relations: [refines(subjectId)],
    });
    const exampleChild = spec({
      id: specId("spec:orders.create-order.valid-cart"),
      title: "Valid cart creates an order",
      kind: "example",
      altitude: "story",
      readiness: "scoped",
      intent: { outcome: "Show that a valid cart can become an order." },
      behavior: { examples: ["Valid cart becomes an order with the computed total."] },
      relations: [refines(subjectId)],
    });
    const stubChild = spec({
      id: specId("spec:orders.order-inventory-rule"),
      title: "Order creation requires available inventory",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      relations: [refines(subjectId)],
    });
    const constraintSpec = spec({
      id: specId("spec:orders.order-latency-constraint"),
      title: "Create-order latency budget",
      kind: "constraint",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Keep create-order fast enough for interactive checkout." },
      constraints: [
        { statement: "Create-order responds within the checkout budget.", target: "latency.p95" },
      ],
    });

    const structuredExample = {
      given: ["A customer has a valid cart."],
      when: ["The customer submits the cart."],
      then: ["An order is created."],
    };

    const probes: readonly { readonly label: string; readonly specs: readonly Spec[] }[] = [
      { label: "no evidence", specs: [probeSpec({})] },
      { label: "prose rules", specs: [probeSpec({ behavior: { rules: ["Totals add up."] } })] },
      {
        label: "prose example",
        specs: [probeSpec({ behavior: { examples: ["Valid cart becomes an order."] } })],
      },
      {
        label: "structured GWT example",
        specs: [probeSpec({ behavior: { examples: [structuredExample] } })],
      },
      {
        label: "flows only",
        specs: [probeSpec({ behavior: { flows: ["Submit, validate, create."] } })],
      },
      {
        label: "untargeted constraint entry",
        specs: [probeSpec({ constraints: [{ statement: "Respond within budget." }] })],
      },
      {
        label: "targeted constraint entry",
        specs: [
          probeSpec({
            constraints: [{ statement: "Respond within budget.", target: "latency.p95" }],
          }),
        ],
      },
      {
        label: "model terms",
        specs: [probeSpec({ model: { terms: { order: "An accepted cart." } } })],
      },
      {
        label: "decision context only",
        specs: [probeSpec({ decision: { context: "Two validation orders were considered." } })],
      },
      {
        label: "written decision",
        specs: [probeSpec({ decision: { decision: "Validate before creating." } })],
      },
      { label: "promoted rule child", specs: [probeSpec({}), ruleChild] },
      { label: "promoted example child", specs: [probeSpec({}), exampleChild] },
      { label: "promoted stub child", specs: [probeSpec({}), stubChild] },
      {
        label: "constrainedBy a targeted constraint",
        specs: [probeSpec({ relations: [constrainedBy(constraintSpec.id)] }), constraintSpec],
      },
      {
        label: "every evidence form at once",
        specs: [
          probeSpec({
            behavior: {
              rules: ["Totals add up."],
              examples: [structuredExample],
              flows: ["Submit, validate, create."],
            },
            constraints: [{ statement: "Respond within budget.", target: "latency.p95" }],
            model: { terms: { order: "An accepted cart." } },
            decision: { decision: "Validate before creating." },
          }),
        ],
      },
    ];

    const violations: string[] = [];
    const definedCoverage = new Map<string, boolean>(SPEC_KINDS.map((kind) => [kind, false]));

    for (const probe of probes) {
      const { node, index } = indexedSubject(subjectId, probe.specs);

      for (const kind of SPEC_KINDS) {
        const flavored = { ...node, specKind: kind };
        const row = kindEvidence[kind];
        const defined = row.defined.predicate(flavored, index);

        if (defined) {
          definedCoverage.set(kind, true);

          if (!row.scoped.predicate(flavored, index)) {
            violations.push(`${kind} × ${probe.label}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
    // The implication must not hold vacuously: the corpus exercises every kind's defined cell
    // positively, so a new kind whose evidence form is missing here fails loudly instead of
    // passing unprobed.
    const unprobedKinds = [...definedCoverage].filter(([, covered]) => !covered).map(([k]) => k);
    expect(unprobedKinds).toEqual([]);
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

describe("the concreteness law — an example is a bound point (the plan-12 ratification)", () => {
  const exampleWith = (steps: {
    given: readonly string[];
    when: readonly string[];
    then: readonly string[];
  }): Spec =>
    spec({
      id: specId("spec:orders.create-order.point"),
      title: "A point in the parent's space",
      kind: "example",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Bind a point." },
      behavior: { examples: [steps] },
      relations: [refines(specId("spec:orders.create-order"))],
    });

  it("holds a fully bound example at defined — the clause flips on the binding alone", () => {
    const bound = exampleWith({
      given: ["a customer has a cart with {n: 2} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created with total {total: 100}"],
    });

    expect(floorFailuresFor(bound.id, bound)).toEqual([]);
  });

  it("caps an example with a bare unbound slot in a used step below defined", () => {
    const unbound = exampleWith({
      given: ["a customer has a cart with {n} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created with total {total: 100}"],
    });

    // The mutation direction, pinned: identical spec, one binding removed — the exact clause
    // flips from pass to fail (never merely green-stays-green).
    expect(floorFailuresFor(unbound.id, unbound).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-complete",
    ]);
  });

  it("caps a declaration-form slot in a used step the same way ({n:number} is not a binding)", () => {
    const declared = exampleWith({
      given: ["a customer has a cart with {n:number} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created with total {total: 100}"],
    });

    expect(floorFailuresFor(declared.id, declared).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-complete",
    ]);
  });

  it("keeps a partial point honest: an unused step binds nothing and fails nothing", () => {
    const partial = exampleWith({
      given: ["a customer has a cart with {n: 0} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ['order creation is rejected because {reason: "empty cart"}'],
    });

    expect(floorFailuresFor(partial.id, partial)).toEqual([]);
  });

  it("derives the honest rung: the unbound-slot example structurally reaches scoped, never defined", () => {
    const unbound = exampleWith({
      given: ["a customer has a cart with {n} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created"],
    });

    expect(derivedReadinessFor(unbound.id, unbound)).toBe("scoped");
  });
});

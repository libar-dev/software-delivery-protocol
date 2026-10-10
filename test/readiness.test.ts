import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import {
  SPEC_KINDS,
  buildGraphIndex,
  constrainedBy,
  dependsOn,
  deriveReadiness,
  evaluateReadinessFloor,
  kindEvidence,
  readinessFloors,
  refines,
  schemaVersion,
  spec,
  specId,
  validateGraph,
  validationSeverities,
  validatorFamilies,
} from "../src/index.js";
import type {
  GraphEdge,
  GraphIndex,
  GraphNode,
  PrimitiveNode,
  ReadinessClause,
  ReadinessFloorFailure,
  Spec,
  SpecReadiness,
} from "../src/index.js";
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

const readinessFloorTestAnchor = specTest({
  id: testAnchorId("test:protocol.readiness-floor"),
  label: "readiness-floor contracts verify stated maturity",
  verifies: ref("spec:validation.readiness-floor"),
});
void readinessFloorTestAnchor;

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
      "typed-dependency-targets-are-defined",
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

  it("keeps a workflow with flows below defined until it carries a rule", () => {
    const workflow = (behavior: NonNullable<Spec["behavior"]>): Spec =>
      spec({
        id: specId("spec:orders.order-workflow"),
        title: "Create-order workflow",
        kind: "workflow",
        altitude: "story",
        readiness: "defined",
        intent: { outcome: "Make the create-order path explicit." },
        behavior,
        relations: [refines(specId("spec:orders.order-management"))],
      });

    expect(
      floorFailuresFor(
        workflow({ flows: ["Validate then create."] }).id,
        workflow({ flows: ["Validate then create."] }),
      ).map((failure) => failure.clauseId),
    ).toEqual(["kind-evidence-complete"]);
    expect(
      floorFailuresFor(
        workflow({ flows: ["Validate then create."], rules: ["Validation precedes creation."] }).id,
        workflow({ flows: ["Validate then create."], rules: ["Validation precedes creation."] }),
      ),
    ).toEqual([]);
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

  describe("derived readiness (the stated-vs-derived split, `spec:validation.readiness-floor`)", () => {
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

  it("caps a fully bound example below defined when a parent example space no longer owns its step", () => {
    const parent = spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Create an order from a cart." },
      behavior: {
        exampleSpace: {
          given: ["a customer has a cart with {n:number} line items"],
          when: ["the customer submits the cart"],
          then: ["an order is created"],
        },
      },
    });
    const stale = exampleWith({
      given: ["a customer has a basket with {n: 2} line items"],
      when: ["the customer submits the cart"],
      then: ["an order is created"],
    });

    expect(floorFailuresFor(stale.id, stale, parent).map((failure) => failure.clauseId)).toEqual([
      "kind-evidence-complete",
    ]);
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

describe("the floor for a target rung and the targets a dependency failure names", () => {
  const subjectId = specId("spec:probe.subject");
  const basisId = specId("spec:probe.basis");
  const subjectStating = (readiness: Spec["readiness"]): Spec =>
    spec({
      id: subjectId,
      title: "Subject",
      kind: "rule",
      altitude: "story",
      readiness,
      intent: { outcome: "Rest on the basis." },
      behavior: { rules: ["The subject states one rule."] },
      relations: [dependsOn(basisId)],
    });
  const basisStating = (readiness: Spec["readiness"]): Spec =>
    spec({
      id: basisId,
      title: "Basis",
      kind: "rule",
      altitude: "story",
      readiness,
      intent: { outcome: "Carry the subject." },
      behavior: { rules: ["The basis states one rule."] },
    });
  const targetClause = "typed-dependency-targets-are-defined";

  it("names the scoped dependency at a target rung of ready on a Spec stating defined", () => {
    const { node, index } = indexedSubject(subjectId, [
      subjectStating("defined"),
      basisStating("scoped"),
    ]);

    // Stated rung: honest. Target rung `ready`: the dependency below `defined` is named.
    expect(evaluateReadinessFloor(node, index)).toEqual([]);
    expect(evaluateReadinessFloor(node, index, "ready")).toEqual([
      {
        clauseId: targetClause,
        description: readinessFloors.ready.clauses[1].description,
        targets: [{ type: "dependsOn", id: basisId, statedReadiness: "scoped" }],
      },
    ]);
  });

  it("finds nothing at ready when the same dependency states defined", () => {
    const { node, index } = indexedSubject(subjectId, [
      subjectStating("defined"),
      basisStating("defined"),
    ]);

    expect(evaluateReadinessFloor(node, index, "ready")).toEqual([]);
  });

  it("evaluates the target rung, not the stated one, in both directions", () => {
    const { node, index } = indexedSubject(subjectId, [
      subjectStating("ready"),
      basisStating("scoped"),
    ]);

    // Stated `ready` fails on the target; a lower target rung evaluates only the clauses up to it.
    expect(evaluateReadinessFloor(node, index).map((failure) => failure.clauseId)).toEqual([
      targetClause,
    ]);
    for (const rung of ["idea", "scoped", "defined"] as const) {
      expect(evaluateReadinessFloor(node, index, rung)).toEqual([]);
    }
  });

  it("evaluates the cumulative clauses of every rung up to the target", () => {
    const bare = spec({
      id: subjectId,
      title: "Bare",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      intent: {
        outcome: "Say only the outcome.",
        openQuestions: [{ question: "Q?", blocking: true }],
      },
    });
    const { node, index } = indexedSubject(subjectId, [bare]);

    expect(
      evaluateReadinessFloor(node, index, "defined").map((failure) => failure.clauseId),
    ).toEqual([
      "at-least-one-relation",
      "kind-evidence-present",
      "kind-evidence-complete",
      "no-blocking-open-questions",
    ]);
    expect(
      evaluateReadinessFloor(node, index, "scoped").map((failure) => failure.clauseId),
    ).toEqual(["at-least-one-relation", "kind-evidence-present"]);
  });

  it("yields no failure for an unratified kind or an unratified target rung", () => {
    const { node, index } = indexedSubject(subjectId, [
      subjectStating("ready"),
      basisStating("scoped"),
    ]);
    const foreignKind = { ...node, specKind: "epic" } as unknown as PrimitiveNode;
    const foreignStated = { ...node, readiness: "shipped" } as unknown as PrimitiveNode;

    expect(evaluateReadinessFloor(foreignKind, index, "ready")).toEqual([]);
    expect(evaluateReadinessFloor(node, index, "shipped" as SpecReadiness)).toEqual([]);
    // An unratified stated rung yields nothing on its own, but a named target rung is evaluated.
    expect(evaluateReadinessFloor(foreignStated, index)).toEqual([]);
    expect(
      evaluateReadinessFloor(foreignStated, index, "ready").map((failure) => failure.clauseId),
    ).toEqual([targetClause]);
  });

  it("names every distinct breaking target, sorted by relation type and then by id", () => {
    const subject = "spec:probe.subject";
    const primitive = (id: string, readiness: SpecReadiness): PrimitiveNode => ({
      id,
      nodeType: "Primitive",
      claim: "declared",
      specKind: "rule",
      altitude: "story",
      readiness,
      title: id,
      file: "specs/probe.sdp.md",
      sections: { intent: { outcome: "Probe." }, behavior: { rules: ["Probe rule."] } },
    });
    const nodes: GraphNode[] = [
      primitive(subject, "defined"),
      primitive("spec:probe.B", "idea"),
      primitive("spec:probe.a", "scoped"),
      primitive("spec:probe.c", "defined"),
      primitive("spec:probe.d", "ready"),
      primitive("spec:probe.e", "idea"),
      { id: "impl:probe.code", nodeType: "CodeNode", claim: "anchored", file: "src/probe.ts" },
    ];
    const edge = (type: GraphEdge["type"], to: string): GraphEdge => ({
      from: subject,
      to,
      type,
      claim: "declared",
    });
    const edges: GraphEdge[] = [
      edge("decidedBy", "spec:probe.a"),
      edge("decidedBy", "impl:probe.code"),
      edge("constrainedBy", "spec:probe.a"),
      edge("dependsOn", "spec:probe.a"),
      edge("dependsOn", "spec:probe.B"),
      edge("dependsOn", "spec:probe.a"),
      edge("dependsOn", "spec:probe.c"),
      edge("dependsOn", "spec:probe.missing"),
      edge("refines", "spec:probe.d"),
      edge("refines", "spec:probe.a"),
      edge("verifies", "spec:probe.e"),
      edge("supersedes", "spec:probe.e"),
      { from: subject, to: "spec:probe.e", type: "dependsOn", claim: "inferred" },
    ];
    const index = buildGraphIndex({ schemaVersion, nodes, edges });
    const node = index.primitivesById.get(subject);
    if (node === undefined) throw new Error("missing probe subject");

    const failures = evaluateReadinessFloor(node, index, "ready");

    expect(failures.map((failure) => failure.clauseId)).toEqual([
      "all-relations-resolve",
      targetClause,
    ]);
    // Only the typed-dependency clause carries targets.
    expect(Object.hasOwn(failures[0] ?? {}, "targets")).toBe(false);
    // Missing targets stay the resolution clause's; `verifies`, `supersedes`, inferred edges and
    // targets stating at least `defined` never appear; a repeated edge appears once; a non-Spec
    // target carries no stated rung; `B` sorts before `a` in code-unit order.
    expect(failures[1]?.targets).toEqual([
      { type: "refines", id: "spec:probe.a", statedReadiness: "scoped" },
      { type: "dependsOn", id: "spec:probe.B", statedReadiness: "idea" },
      { type: "dependsOn", id: "spec:probe.a", statedReadiness: "scoped" },
      { type: "constrainedBy", id: "spec:probe.a", statedReadiness: "scoped" },
      { type: "decidedBy", id: "impl:probe.code" },
      { type: "decidedBy", id: "spec:probe.a", statedReadiness: "scoped" },
    ]);
  });

  it("keeps the readiness-floor finding message free of targets", () => {
    const graph = deriveFixtureGraph({ specs: [subjectStating("ready"), basisStating("scoped")] });
    const findings = validateGraph(graph).findings.filter(
      (finding) =>
        finding.validatorId === "honesty/readiness-floor" && finding.subjectId === subjectId,
    );

    expect(findings.map((finding) => finding.message)).toEqual([
      `Spec "${subjectId}" states readiness "ready" but does not satisfy floor clause "${targetClause}": Every refines, dependsOn, constrainedBy, and decidedBy target states at least defined.`,
    ]);
  });

  it("sets a targets reader on the typed-dependency clause alone", () => {
    const withTargets = Object.values(readinessFloors)
      .flatMap((floor): readonly ReadinessClause[] => floor.clauses)
      .filter((clause) => "targets" in clause)
      .map((clause) => clause.id);

    expect(withTargets).toEqual([targetClause]);
  });
});

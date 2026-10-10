import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  constrainedBy,
  decidedBy,
  dependsOn,
  graphClaims,
  graphValidatorIds,
  oracleAnchorId,
  pack,
  packId,
  ref,
  refines,
  schemaVersion,
  spec,
  specId,
  specOracle,
  specTest,
  supersedes,
  testAnchorId,
  validateGraph,
} from "../src/index.js";
import type { Finding, GraphEdge, GraphNode, GraphSchema, PrimitiveNode } from "../src/index.js";
// The package builders bind this suite's anchor; the fixtures above build probe values from the
// source module, which the extractor does not read as authoring.
import {
  ref as anchorRef,
  specTest as anchorSpecTest,
  testAnchorId as anchorTestAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

/**
 * Synthetic graphs (hand-built `GraphSchema` values) are a deliberate input class here: the graph
 * is the public validation seam, and several checks have teeth only for a producer other than
 * this repo's extractor — which excludes duplicates and derives every edge beside its node.
 */
function syntheticGraph(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): GraphSchema {
  return { schemaVersion, nodes, edges };
}

function ideaPrimitive(id: string, outcome: string): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "feature",
    readiness: "idea",
    title: `Title for ${id}`,
    file: "specs/synthetic.sdp.ts",
    sections: { intent: { outcome } },
  };
}

describe("graph validators", () => {
  it("reports referential integrity across relations, pack members, modelRefs, and bindings", () => {
    const existingSpec = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "idea",
      intent: { outcome: "Define order management." },
    });
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.create-order"),
          title: "Create order",
          kind: "behavior",
          altitude: "feature",
          readiness: "scoped",
          intent: { outcome: "Turn a cart into an order." },
          behavior: { examples: ["valid cart"] },
          relations: [dependsOn(ref("spec:orders.missing-target"))],
        }),
        existingSpec,
      ],
      packs: [
        pack({
          id: packId("pack:checkout-v1"),
          title: "Checkout v1",
          specs: [ref(existingSpec.id), ref("spec:orders.missing-pack-member")],
          modelRefs: [ref("spec:checkout.missing-glossary")],
        }),
      ],
      anchors: [
        codeAnchor({
          id: codeAnchorId("impl:orders.create-order-use-case"),
          satisfies: ref("spec:orders.missing-anchor-target"),
        }),
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: ref("spec:orders.missing-test-target"),
        }),
      ],
    });

    const findings = validateGraph(graph).findings;
    expect(
      findings.every((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
    ).toBe(true);
    expect(findings.every((finding) => finding.severity === "error")).toBe(true);

    const pairs = findings
      .map((finding) => `${finding.subjectId ?? ""} -> ${finding.relatedId ?? ""}`)
      .sort();
    expect(pairs).toEqual([
      "impl:orders.create-order-use-case -> spec:orders.missing-anchor-target",
      "pack:checkout-v1 -> spec:checkout.missing-glossary",
      "spec:orders.create-order -> spec:orders.missing-target",
      "spec:orders.missing-pack-member -> pack:checkout-v1",
      "test:orders.create-order.valid-cart -> spec:orders.missing-test-target",
    ]);
  });

  it('offers a "did you mean" suggestion only when one nearest id is unambiguous (L2)', () => {
    const withUniqueNearMiss = syntheticGraph(
      [ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order.")],
      [
        {
          from: "spec:orders.create-order",
          type: "dependsOn",
          to: "spec:orders.create-ordr",
          claim: "declared",
        },
      ],
    );

    const suggested = validateGraph(withUniqueNearMiss).findings.find(
      (finding) => finding.validatorId === graphValidatorIds.referentialIntegrity,
    );
    expect(suggested?.message).toContain('Did you mean "spec:orders.create-order"?');

    const withTiedCandidates = syntheticGraph(
      [
        ideaPrimitive("spec:orders.create-order-a", "First near miss."),
        ideaPrimitive("spec:orders.create-order-b", "Second near miss."),
      ],
      [
        {
          from: "spec:orders.create-order-a",
          type: "dependsOn",
          to: "spec:orders.create-order-x",
          claim: "declared",
        },
      ],
    );

    const tied = validateGraph(withTiedCandidates).findings.find(
      (finding) => finding.validatorId === graphValidatorIds.referentialIntegrity,
    );
    expect(tied).toBeDefined();
    // A tie yields no suggestion: picking a winner would auto-resolve ambiguity.
    expect(tied?.message).not.toContain("Did you mean");
  });

  it("reports duplicate node ids — the graph backstop behind the extractor's per-site errors", () => {
    const duplicateId = specId("spec:orders.create-order");
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: duplicateId,
          title: "Create order",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
          intent: { outcome: "Turn a valid cart into an order." },
        }),
        spec({
          id: duplicateId,
          title: "Create order duplicate",
          kind: "behavior",
          altitude: "feature",
          readiness: "idea",
          intent: { outcome: "Accidental second definition." },
        }),
      ],
    });

    const duplicates = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.duplicateIds,
    );
    expect(duplicates).toHaveLength(2);
    expect(
      duplicates.every(
        (finding) => finding.severity === "error" && finding.subjectId === duplicateId,
      ),
    ).toBe(true);
  });

  it("keeps the claim taxonomy uncollapsed: a declared satisfies edge violates the edge contract", () => {
    const graph = syntheticGraph(
      [
        {
          id: "impl:orders.create-order-use-case",
          nodeType: "CodeNode",
          claim: "anchored",
          file: "src/orders/create-order.use-case.ts",
          line: 3,
        },
        ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
      ],
      [
        {
          from: "impl:orders.create-order-use-case",
          type: "satisfies",
          to: "spec:orders.create-order",
          claim: "declared",
        },
      ],
    );

    const findings = validateGraph(graph).findings;
    expect(findings).toHaveLength(1);
    expect(findings[0]?.validatorId).toBe(graphValidatorIds.claimSeparation);
    expect(findings[0]?.severity).toBe("error");
    expect(findings[0]?.message).toContain('a satisfies edge carries "anchored"');
  });

  it("admits no inferred edge on the ratified edge types: the claim ships designed-in and empty", () => {
    // The claim taxonomy ratifies "inferred" (the schema and every consumer decode it), but its
    // first producer is the aspirational impact graph — so no edge-contract row admits it. This
    // pin is the seam's tripwire: the first inferred producer must land its own contract row and
    // flip this test deliberately, never ride an existing row unnoticed.
    expect(graphClaims).toContain("inferred");

    const graph = syntheticGraph(
      [
        ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
        ideaPrimitive("spec:orders.create-order.valid-cart", "Show the happy path."),
      ],
      [
        // The verifies row has its own claim branch; dependsOn rides the default declared-only
        // row — an inferred claim must fail on both paths.
        {
          from: "spec:orders.create-order.valid-cart",
          type: "verifies",
          to: "spec:orders.create-order",
          claim: "inferred",
        },
        {
          from: "spec:orders.create-order",
          type: "dependsOn",
          to: "spec:orders.create-order.valid-cart",
          claim: "inferred",
        },
      ],
    );

    const claims = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
    );
    expect(claims).toHaveLength(2);
    expect(
      claims.every(
        (finding) =>
          finding.severity === "error" &&
          finding.message.includes('claim "inferred"') &&
          finding.message.includes("never collapsed"),
      ),
    ).toBe(true);
  });

  it("rejects a node claim its nodeType never carries", () => {
    const graph = syntheticGraph(
      [
        {
          ...ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
          claim: "anchored",
        },
      ],
      [],
    );

    const claims = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
    );
    expect(claims).toHaveLength(1);
    expect(claims[0]?.message).toContain('Primitive nodes carry "declared"');
  });

  it("rejects wrong-kind endpoints on the kind-typed relations — constrainedBy, decidedBy, supersedes", () => {
    const orderManagement = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "idea",
      intent: { outcome: "Define order management." },
    });
    const orderLifecycle = spec({
      id: specId("spec:decisions.order-lifecycle"),
      title: "Order lifecycle",
      kind: "decision",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Settle the order lifecycle." },
      // A decision superseding a rule-kind spec: the to-endpoint row fails.
      relations: [supersedes(specId("spec:orders.order-total-rule"))],
    });
    const orderTotalRule = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total rule",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Keep order totals consistent." },
      // A rule superseding a decision: the from-endpoint row fails.
      relations: [supersedes(orderLifecycle.id)],
    });
    const createOrder = spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "idea",
      intent: { outcome: "Turn a valid cart into an order." },
      relations: [
        // A behavior-kind bound and a behavior-kind decider: both target rows fail.
        constrainedBy(orderManagement.id),
        decidedBy(orderManagement.id),
      ],
    });

    const findings = validateGraph(
      deriveFixtureGraph({ specs: [orderManagement, orderLifecycle, orderTotalRule, createOrder] }),
    ).findings;

    expect(findings).toHaveLength(4);
    expect(
      findings.every(
        (finding) =>
          finding.validatorId === graphValidatorIds.claimSeparation && finding.severity === "error",
      ),
    ).toBe(true);

    const messages = findings.map((finding) => finding.message);
    expect(messages.some((m) => m.includes("(constrainedBy)") && m.includes("behavior-kind"))).toBe(
      true,
    );
    expect(messages.some((m) => m.includes("(decidedBy)") && m.includes("behavior-kind"))).toBe(
      true,
    );
    expect(
      messages.some((m) => m.includes("(supersedes)") && m.includes("originates from a rule-kind")),
    ).toBe(true);
    expect(
      messages.some((m) => m.includes("(supersedes)") && m.includes("targets a rule-kind")),
    ).toBe(true);
  });

  it("accepts the valid kind-typed relation shapes — rule/constraint bounds, a decision decider, decision supersedes decision", () => {
    const latencyConstraint = spec({
      id: specId("spec:orders.order-latency-constraint"),
      title: "Order latency constraint",
      kind: "constraint",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Bound order-creation latency." },
    });
    const orderTotalRule = spec({
      id: specId("spec:orders.order-total-rule"),
      title: "Order total rule",
      kind: "rule",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Keep order totals consistent." },
    });
    const orderLifecycle = spec({
      id: specId("spec:decisions.order-lifecycle"),
      title: "Order lifecycle",
      kind: "decision",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Settle the order lifecycle." },
    });
    const orderLifecycleV2 = spec({
      id: specId("spec:decisions.order-lifecycle-v2"),
      title: "Order lifecycle v2",
      kind: "decision",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Revise the order lifecycle." },
      relations: [supersedes(orderLifecycle.id)],
    });
    const createOrder = spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "idea",
      intent: { outcome: "Turn a valid cart into an order." },
      relations: [
        constrainedBy(latencyConstraint.id),
        constrainedBy(orderTotalRule.id),
        decidedBy(orderLifecycleV2.id),
      ],
    });

    const graph = deriveFixtureGraph({
      specs: [latencyConstraint, orderTotalRule, orderLifecycle, orderLifecycleV2, createOrder],
    });

    expect(validateGraph(graph).findings).toEqual([]);
  });

  it("fails the anchors-resolve ready clause when a binding edge has no binding node behind it", () => {
    const readyNode: GraphNode = {
      id: "spec:orders.create-order",
      nodeType: "Primitive",
      claim: "declared",
      specKind: "behavior",
      altitude: "feature",
      readiness: "ready",
      title: "Create order",
      file: "specs/synthetic.sdp.ts",
      sections: {
        intent: { outcome: "Turn a valid cart into an order." },
        behavior: { rules: ["Only valid carts become orders."] },
      },
    };
    const graph = syntheticGraph(
      [readyNode],
      [
        {
          from: "impl:orders.ghost-binding",
          type: "satisfies",
          to: "spec:orders.create-order",
          claim: "anchored",
        },
      ],
    );

    const findings = validateGraph(graph).findings;
    // The ghost source is a conformance error, and the floor names the unearned ready: without a
    // real binding node, `implemented` would not be derivable from a binding (MD-7).
    expect(
      findings.some((finding) => finding.validatorId === graphValidatorIds.referentialIntegrity),
    ).toBe(true);
    expect(
      findings.some(
        (finding) =>
          finding.validatorId === graphValidatorIds.readinessFloor &&
          finding.relatedId === "anchors-resolve",
      ),
    ).toBe(true);
  });

  it("reports a readiness-floor failure with the spec id, stated rung, and failing clause", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.order-management"),
          title: "Order management",
          kind: "behavior",
          altitude: "epic",
          readiness: "defined",
          intent: { outcome: "Define order management." },
          behavior: { rules: ["Orders stay traceable."] },
          relations: [dependsOn(specId("spec:orders.create-order"))],
        }),
        spec({
          id: specId("spec:orders.create-order"),
          title: "Create order",
          kind: "behavior",
          altitude: "feature",
          readiness: "ready",
          intent: { outcome: "Turn a valid cart into an order." },
          relations: [refines(specId("spec:orders.order-management"))],
          // An inline constraint clears the scoped evidence rung, but a defined behavior spec
          // needs rules and/or examples — constraints alone no longer suffice (MD-12).
          constraints: [{ statement: "order creation stays fast", target: "p95 < 200ms" }],
        }),
      ],
    });

    const floorFindings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.readinessFloor,
    );
    expect(floorFindings).toEqual([
      {
        validatorId: "honesty/readiness-floor",
        family: "honesty",
        severity: "error",
        subjectId: "spec:orders.create-order",
        relatedId: "kind-evidence-complete",
        path: "readiness",
        file: "specs/fixture.sdp.ts",
        message:
          'Spec "spec:orders.create-order" states readiness "ready" but does not satisfy floor clause "kind-evidence-complete": The kind\'s natural evidence is complete (per-kind evidence table).',
      },
    ]);
  });

  it("surfaces the gap only while no verifier resolves — a derived fact silences it, a stated one never does", () => {
    const readySpec: PrimitiveNode = {
      ...ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
      readiness: "ready",
    };
    const testAnchor: GraphNode = {
      id: "test:orders.create-order.valid-cart",
      nodeType: "Anchor",
      claim: "anchored",
      file: "test/create-order.valid-cart.test.ts",
      line: 7,
    };
    const anchoredVerifies: GraphEdge = {
      from: testAnchor.id,
      type: "verifies",
      to: readySpec.id,
      claim: "anchored",
    };

    const findingsFor = (nodes: readonly GraphNode[], edges: readonly GraphEdge[]) =>
      validateGraph(syntheticGraph(nodes, edges)).findings;
    const gapsOf = (findings: readonly Finding[]) =>
      findings.filter((finding) => finding.validatorId === graphValidatorIds.gaps);
    const factsOf = (findings: readonly Finding[]) =>
      findings.filter((finding) => finding.validatorId === graphValidatorIds.deliveryFacts);

    // No verifier at all: the gap fires, informative only.
    const unverified = findingsFor([readySpec], []);
    expect(gapsOf(unverified)).toHaveLength(1);
    expect(gapsOf(unverified)[0]?.severity).toBe("warning");

    // A resolving test binding derives has-verifier (stated consistently): the gap is silenced.
    const bound = findingsFor(
      [{ ...readySpec, deliveryFacts: ["has-verifier"] }, testAnchor],
      [anchoredVerifies],
    );
    expect(gapsOf(bound)).toEqual([]);
    expect(factsOf(bound)).toEqual([]);

    // A *stated* has-verifier no binding earns never silences the gap — the gap check reads the
    // recomputed facts, and the disagreement is the delivery-facts check's own honesty error.
    const faked = findingsFor([{ ...readySpec, deliveryFacts: ["has-verifier"] }], []);
    expect(gapsOf(faked)).toHaveLength(1);
    expect(factsOf(faked)).toHaveLength(1);
    expect(factsOf(faked)[0]?.message).toContain("derived, never authored");
  });

  it("exempts decision-kind Specs from the gap signal while other kinds still warn", () => {
    // A decision record's evidence is its registry row and complete record, never a verifier —
    // the signal is definitional noise for the kind (spec:validation.warn-level-signals).
    const readyDecision: PrimitiveNode = {
      ...ideaPrimitive("spec:orders.order-lifecycle", "Record the order lifecycle decision."),
      specKind: "decision",
      readiness: "ready",
      sections: {
        intent: { outcome: "Record the order lifecycle decision." },
        decision: {
          context: "Two lifecycle shapes were on the table.",
          decision: "The order carries its own lifecycle.",
        },
      },
    };
    const readyBehavior: PrimitiveNode = {
      ...ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
      readiness: "ready",
    };

    const findings = validateGraph(syntheticGraph([readyDecision, readyBehavior], [])).findings;
    const gaps = findings.filter((finding) => finding.validatorId === graphValidatorIds.gaps);

    expect(gaps).toHaveLength(1);
    expect(gaps[0]?.subjectId).toBe("spec:orders.create-order");
    expect(gaps[0]?.severity).toBe("warning");
  });

  it("never lets an anchored verifies edge from a non-Anchor source enable an example — fail closed", () => {
    const parent = ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order.");
    const example: PrimitiveNode = {
      ...ideaPrimitive("spec:orders.create-order.valid-cart", "Verify the happy path."),
      readiness: "ready",
      specKind: "example",
      altitude: "story",
    };
    const impostor: GraphNode = {
      id: "impl:orders.create-order-use-case",
      nodeType: "CodeNode",
      claim: "anchored",
      file: "src/orders/create-order.use-case.ts",
    };

    const findings = validateGraph(
      syntheticGraph(
        [parent, example, impostor],
        [
          { from: example.id, type: "verifies", to: parent.id, claim: "declared" },
          // Off-contract: an anchored verifies edge resolves from an Anchor node only
          // (`spec:extraction.derive-graph`).
          { from: impostor.id, type: "verifies", to: example.id, claim: "anchored" },
        ],
      ),
    ).findings;

    // The off-contract edge is the claim-separation check's own finding...
    expect(
      findings.filter((finding) => finding.validatorId === graphValidatorIds.claimSeparation),
    ).toHaveLength(1);

    // ...and it never stands in for the test binding: the example stays un-enabled, so the
    // incomplete spec↔test trace is still named loudly (the shared resolving-test-anchor rule).
    const linkage = findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.verifiesLinkage,
    );
    expect(linkage).toHaveLength(1);
    expect(linkage[0]).toMatchObject({
      subjectId: example.id,
      relatedId: parent.id,
      severity: "warning",
    });
  });

  it("rejects stated delivery facts the graph does not earn — derived, never authored", () => {
    const node = {
      ...ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
      deliveryFacts: ["implemented", "observed", "done"],
    } as unknown as PrimitiveNode;

    const findings = validateGraph(syntheticGraph([node], [])).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.deliveryFacts,
    );

    expect(findings.map((finding) => finding.relatedId).sort()).toEqual([
      "done",
      "implemented",
      "observed",
    ]);
    expect(findings.every((finding) => finding.severity === "error")).toBe(true);
    expect(findings.find((finding) => finding.relatedId === "done")?.message).toContain(
      "unknown delivery fact",
    );
    expect(findings.find((finding) => finding.relatedId === "observed")?.message).toContain(
      "aspirational",
    );
  });

  it("rejects an omitted delivery fact the graph's resolving bindings derive", () => {
    const specNode = ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order.");
    const codeNode: GraphNode = {
      id: "impl:orders.create-order-use-case",
      nodeType: "CodeNode",
      claim: "anchored",
      file: "src/orders/create-order.use-case.ts",
      line: 3,
    };

    const findings = validateGraph(
      syntheticGraph(
        [specNode, codeNode],
        [{ from: codeNode.id, type: "satisfies", to: specNode.id, claim: "anchored" }],
      ),
    ).findings.filter((finding) => finding.validatorId === graphValidatorIds.deliveryFacts);

    expect(findings).toHaveLength(1);
    expect(findings[0]?.relatedId).toBe("implemented");
    expect(findings[0]?.message).toContain("omits the delivery fact");
  });

  it("fails closed on unratified descriptor values — a conformance error, never a crash or a silent floor skip", () => {
    const bogusKind = {
      ...ideaPrimitive("spec:orders.create-order", "Turn a valid cart into an order."),
      specKind: "saga",
      readiness: "scoped",
    } as unknown as PrimitiveNode;
    const bogusReadiness = {
      ...ideaPrimitive("spec:orders.order-model", "Define the order terms."),
      readiness: "later",
    } as unknown as PrimitiveNode;
    const bogusAltitude = {
      ...ideaPrimitive("spec:orders.order-management", "Define order management."),
      altitude: "initiative",
    } as unknown as PrimitiveNode;

    // Evaluating the scoped floor over specKind "saga" used to dereference the evidence table;
    // the seam must report, never throw.
    const findings = validateGraph(
      syntheticGraph([bogusKind, bogusReadiness, bogusAltitude], []),
    ).findings;

    const descriptorErrors = findings.filter(
      (finding) =>
        finding.validatorId === graphValidatorIds.claimSeparation &&
        finding.message.includes("outside the ratified descriptor values"),
    );
    expect(descriptorErrors.map((finding) => finding.path).sort()).toEqual([
      "altitude",
      "readiness",
      "specKind",
    ]);
    expect(descriptorErrors.every((finding) => finding.severity === "error")).toBe(true);

    // Fail closed: no floor evaluation over an unratified kind or readiness — the conformance
    // error owns the finding, instead of a crash (bogus kind) or a silent skip (bogus readiness).
    expect(
      findings.filter(
        (finding) =>
          finding.validatorId === graphValidatorIds.readinessFloor &&
          (finding.subjectId === bogusKind.id || finding.subjectId === bogusReadiness.id),
      ),
    ).toEqual([]);
  });

  it("returns a valid empty aggregate report without throwing", () => {
    const report = validateGraph(syntheticGraph([], []));

    expect(report.validatorId).toBe("graph");
    // The aggregate spans both check families, so it carries no single family of its own (F3).
    expect(report.family).toBeUndefined();
    expect(report.findings).toEqual([]);
  });

  it("composes cleanly over a valid non-empty model with bindings, a pack, and a model-kind modelRef", () => {
    const orderManagement = spec({
      id: specId("spec:orders.order-management"),
      title: "Order management",
      kind: "behavior",
      altitude: "epic",
      readiness: "idea",
      intent: { outcome: "Define order management." },
    });
    const orderModel = spec({
      id: specId("spec:orders.order-model"),
      title: "Order-management domain vocabulary",
      kind: "model",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Define the core order terms." },
      model: { terms: { cart: "A customer-selected set of line items." } },
      relations: [refines(orderManagement.id)],
    });
    const createOrder = spec({
      id: specId("spec:orders.create-order"),
      title: "Create order",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Turn a valid cart into an order." },
      behavior: { rules: ["Only valid carts become orders."] },
      relations: [refines(orderManagement.id)],
    });

    const graph = deriveFixtureGraph({
      specs: [orderManagement, orderModel, createOrder],
      packs: [
        pack({
          id: packId("pack:checkout-v1"),
          title: "Checkout v1",
          specs: [orderManagement.id, orderModel.id, createOrder.id],
          modelRefs: [orderModel.id],
        }),
      ],
      anchors: [
        codeAnchor({
          id: codeAnchorId("impl:orders.create-order-use-case"),
          satisfies: createOrder.id,
        }),
        specTest({
          id: testAnchorId("test:orders.create-order.valid-cart"),
          verifies: createOrder.id,
        }),
      ],
    });

    expect(validateGraph(graph).findings).toEqual([]);
  });
});

describe("conformance/pack-coherence — the members list and the belongsTo edges agree", () => {
  const packId = "pack:probe.checkout";
  const specA = "spec:probe.a";
  const specB = "spec:probe.b";
  const codeId = "impl:probe.code";

  function probePack(members: readonly string[]): GraphNode {
    return {
      id: packId,
      nodeType: "Pack",
      claim: "declared",
      title: "Probe aggregate",
      members,
      file: "specs/probe.pack.sdp.ts",
    };
  }

  function belongsTo(from: string): GraphEdge {
    return { from, type: "belongsTo", to: packId, claim: "declared" };
  }

  function coherenceFindings(graph: GraphSchema): readonly Finding[] {
    return validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.packCoherence,
    );
  }

  const probeSpecs = [ideaPrimitive(specA, "Probe A."), ideaPrimitive(specB, "Probe B.")];

  it("reports nothing when every listed member has its one edge and every edge is listed", () => {
    const graph = syntheticGraph(
      [...probeSpecs, probePack([specA, specB])],
      [belongsTo(specA), belongsTo(specB)],
    );

    expect(coherenceFindings(graph)).toEqual([]);
  });

  it("names a listed member with no belongsTo edge into the pack", () => {
    const graph = syntheticGraph([...probeSpecs, probePack([specA, specB])], [belongsTo(specA)]);

    expect(coherenceFindings(graph)).toEqual([
      {
        validatorId: graphValidatorIds.packCoherence,
        family: "conformance",
        severity: "error",
        message: `Pack "${packId}" lists member "${specB}" with no belongsTo edge into the pack — the manifest and the derived edges must agree, or the reader answers membership differently per query.`,
        subjectId: packId,
        relatedId: specB,
        file: "specs/probe.pack.sdp.ts",
      },
    ]);
  });

  it("names a belongsTo edge whose source the members do not list", () => {
    const graph = syntheticGraph(
      [...probeSpecs, probePack([specA])],
      [belongsTo(specA), belongsTo(specB)],
    );

    expect(coherenceFindings(graph)).toEqual([
      {
        validatorId: graphValidatorIds.packCoherence,
        family: "conformance",
        severity: "error",
        message: `Pack "${packId}" has a belongsTo edge from "${specB}", which its members do not list — the manifest and the derived edges must agree, or the reader answers membership differently per query.`,
        subjectId: packId,
        relatedId: specB,
        file: "specs/probe.pack.sdp.ts",
      },
    ]);
  });

  it("names a listed member that is no Spec when no edge carries it, and defers to the edge contract when one does", () => {
    const codeNode: GraphNode = {
      id: codeId,
      nodeType: "CodeNode",
      claim: "anchored",
      file: "src/probe.ts",
      line: 1,
    };
    const unbound = syntheticGraph(
      [...probeSpecs, codeNode, probePack([specA, codeId])],
      [belongsTo(specA)],
    );

    expect(coherenceFindings(unbound)).toEqual([
      {
        validatorId: graphValidatorIds.packCoherence,
        family: "conformance",
        severity: "error",
        message: `Pack "${packId}" lists member "${codeId}", which is a CodeNode node, not a Spec — Pack members are Specs.`,
        subjectId: packId,
        relatedId: codeId,
        file: "specs/probe.pack.sdp.ts",
      },
    ]);

    // With an edge, the edge contract row already names the wrong-kind source: no second finding.
    const bound = syntheticGraph(
      [...probeSpecs, codeNode, probePack([specA, codeId])],
      [belongsTo(specA), belongsTo(codeId)],
    );
    const findings = validateGraph(bound).findings;

    expect(coherenceFindings(bound)).toEqual([]);
    expect(
      findings.some(
        (finding) =>
          finding.validatorId === graphValidatorIds.claimSeparation &&
          finding.message.includes(`originates from a CodeNode node`),
      ),
    ).toBe(true);
  });

  it("leaves an absent listed member whose edge dangles to referential integrity", () => {
    const graph = syntheticGraph(
      [...probeSpecs, probePack([specA, "spec:probe.absent"])],
      [belongsTo(specA), belongsTo("spec:probe.absent")],
    );
    const findings = validateGraph(graph).findings;

    expect(coherenceFindings(graph)).toEqual([]);
    expect(
      findings.filter(
        (finding) =>
          finding.validatorId === graphValidatorIds.referentialIntegrity &&
          finding.subjectId === "spec:probe.absent",
      ),
    ).toHaveLength(1);
  });

  it("leaves an unlisted belongsTo edge from an absent source to referential integrity", () => {
    const graph = syntheticGraph(
      [...probeSpecs, probePack([specA])],
      [belongsTo(specA), belongsTo("spec:probe.absent")],
    );
    const findings = validateGraph(graph).findings;

    expect(coherenceFindings(graph)).toEqual([]);
    expect(
      findings.filter(
        (finding) =>
          finding.validatorId === graphValidatorIds.referentialIntegrity &&
          finding.subjectId === "spec:probe.absent",
      ),
    ).toHaveLength(1);
  });

  it("leaves an unlisted belongsTo edge from a CodeNode to the edge contract", () => {
    const codeNode: GraphNode = {
      id: codeId,
      nodeType: "CodeNode",
      claim: "anchored",
      file: "src/probe.ts",
      line: 1,
    };
    const graph = syntheticGraph(
      [...probeSpecs, codeNode, probePack([specA])],
      [belongsTo(specA), belongsTo(codeId)],
    );
    const findings = validateGraph(graph).findings;

    expect(coherenceFindings(graph)).toEqual([]);
    expect(
      findings.filter(
        (finding) =>
          finding.validatorId === graphValidatorIds.claimSeparation &&
          finding.subjectId === codeId &&
          finding.message.includes("originates from a CodeNode node"),
      ),
    ).toHaveLength(1);
  });

  it("keeps the duplicate rule: a repeated member is named once, in authored order, with its count", () => {
    const repeatedEdges = syntheticGraph(
      [...probeSpecs, probePack([specB, specA, specB])],
      [belongsTo(specB), belongsTo(specA), belongsTo(specB)],
    );

    expect(
      coherenceFindings(repeatedEdges).map((finding) => [finding.relatedId, finding.message]),
    ).toEqual([
      [
        specB,
        `Pack "${packId}" lists member "${specB}" 2 times — membership is single-sourced on the manifest and duplicates are ambiguous (L2).`,
      ],
    ]);

    // A list that repeats a member its edges carry once is still one repeated member.
    const repeatedList = syntheticGraph(
      [...probeSpecs, probePack([specB, specA, specB])],
      [belongsTo(specB), belongsTo(specA)],
    );

    expect(coherenceFindings(repeatedList).map((finding) => finding.relatedId)).toEqual([specB]);
  });
});

describe("the models edge — the oracle anchor's contract row", () => {
  const modeled = spec({
    id: specId("spec:orders.create-order"),
    title: "Customer creates an order",
    kind: "behavior",
    altitude: "feature",
    readiness: "idea",
    intent: { outcome: "Turn a valid cart into an order." },
    behavior: {
      exampleSpace: {
        given: ["a customer has a cart"],
        when: ["the customer submits the cart"],
        then: ["an order is created"],
      },
    },
  });

  const oracleGraph = () =>
    deriveFixtureGraph({
      specs: [modeled],
      anchors: [
        specOracle({
          id: oracleAnchorId("oracle:orders.create-order"),
          models: ref("spec:orders.create-order"),
        }),
      ],
    });

  it("passes on its contract row (anchored, Anchor → Primitive) and confers no delivery fact", () => {
    const graph = oracleGraph();

    expect(validateGraph(graph).findings).toEqual([]);

    // The graph records that an oracle EXISTS — never a fact: no has-oracle at MVP, and models
    // never confers implemented / has-verifier (settlement 8).
    const primitive = graph.nodes.find((node) => node.id === "spec:orders.create-order");
    expect(primitive?.nodeType === "Primitive" ? (primitive.deliveryFacts ?? []) : null).toEqual(
      [],
    );
  });

  it("rejects a declared claim on a models edge — the claim taxonomy is never collapsed", () => {
    const graph = oracleGraph();
    const foreign: GraphSchema = {
      ...graph,
      edges: graph.edges.map((edge) =>
        edge.type === "models" ? { ...edge, claim: "declared" as const } : edge,
      ),
    };

    const findings = validateGraph(foreign).findings;
    const claimErrors = findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
    );

    expect(claimErrors.length).toBeGreaterThan(0);
    expect(claimErrors[0]?.severity).toBe("error");
    expect(claimErrors[0]?.message).toContain("models");
  });

  it("rejects an oracle target that does not own a behavior example space", () => {
    const withoutSpace = spec({
      id: specId("spec:orders.order-policy"),
      title: "Order policy",
      kind: "behavior",
      altitude: "feature",
      readiness: "idea",
      intent: { outcome: "State the order policy." },
    });
    const graph = deriveFixtureGraph({
      specs: [withoutSpace],
      anchors: [
        specOracle({
          id: oracleAnchorId("oracle:orders.order-policy"),
          models: withoutSpace.id,
        }),
      ],
    });

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.oracleLinkage,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.severity).toBe("error");
    expect(findings[0]?.message).toContain("Spec that owns an example space");
  });

  it("rejects competing oracle anchors for one parent example space", () => {
    const graph = deriveFixtureGraph({
      specs: [modeled],
      anchors: [
        specOracle({
          id: oracleAnchorId("oracle:orders.create-order.primary"),
          models: modeled.id,
        }),
        specOracle({
          id: oracleAnchorId("oracle:orders.create-order.competing"),
          models: modeled.id,
        }),
      ],
    });

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.oracleLinkage,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.subjectId).toBe("spec:orders.create-order");
    expect(findings[0]?.message).toContain("at most one expected-outcome authority");
  });

  it("rejects a models edge whose Anchor does not use the oracle namespace", () => {
    const graph = oracleGraph();
    const foreign: GraphSchema = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.id === "oracle:orders.create-order"
          ? { ...node, id: "test:orders.create-order-oracle" }
          : node,
      ),
      edges: graph.edges.map((edge) =>
        edge.type === "models" ? { ...edge, from: "test:orders.create-order-oracle" } : edge,
      ),
    };

    const findings = validateGraph(foreign).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.oracleLinkage,
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.message).toContain("oracle: anchor");
  });

  it("accepts a rule-kind oracle target when the rule owns an example space", () => {
    const rule = spec({
      id: specId("spec:orders.order-routing"),
      title: "Order routing rule",
      kind: "rule",
      altitude: "feature",
      readiness: "idea",
      intent: { outcome: "Rule the routing policy." },
      behavior: { exampleSpace: { then: ["the routing policy is chosen"] } },
    });
    const graph = deriveFixtureGraph({
      specs: [rule],
      anchors: [
        specOracle({
          id: oracleAnchorId("oracle:orders.order-routing"),
          models: rule.id,
        }),
      ],
    });

    expect(
      validateGraph(graph).findings.some(
        (finding) => finding.validatorId === graphValidatorIds.oracleLinkage,
      ),
    ).toBe(false);
  });

  it("rejects a models edge from a non-Anchor source — the endpoints are typed", () => {
    const graph = oracleGraph();
    const foreign: GraphSchema = {
      ...graph,
      edges: graph.edges.map((edge) =>
        edge.type === "models" ? { ...edge, from: "spec:orders.create-order" } : edge,
      ),
    };

    const findings = validateGraph(foreign).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.claimSeparation,
    );

    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]?.message).toContain("the edge contract allows");
  });

  it("flags a dangling models target through referential integrity, like every edge", () => {
    const graph = deriveFixtureGraph({
      anchors: [
        specOracle({
          id: oracleAnchorId("oracle:orders.create-order"),
          models: ref("spec:orders.create-order"),
        }),
      ],
    });

    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.referentialIntegrity,
    );

    expect(findings.length).toBeGreaterThan(0);
  });
});

const proseMentionsTestAnchor = anchorSpecTest({
  id: anchorTestAnchorId("test:protocol.prose-mentions"),
  label: "verifies prose-mention resolution and the unbacked-pair warning",
  verifies: anchorRef("spec:validation.prose-mentions"),
});
void proseMentionsTestAnchor;

describe("conformance/prose-mentions — prose mentions and their entry addresses", () => {
  const file = "specs/probe/mentions.sdp.md";
  const warningTail =
    "with no declared relation between them; informative only. Declare the relation that fits, or leave the mention as prose and let the warning stand when none does.";

  function mentionSpec(
    id: string,
    sections: Readonly<Record<string, unknown>>,
    narrative?: string,
  ): PrimitiveNode {
    return {
      id,
      nodeType: "Primitive",
      claim: "declared",
      specKind: "behavior",
      altitude: "feature",
      readiness: "idea",
      title: `Title for ${id}`,
      ...(narrative === undefined ? {} : { narrative }),
      file,
      sections,
    };
  }

  function dependsOnEdge(from: string, to: string): GraphEdge {
    return { from, type: "dependsOn", to, claim: "declared" };
  }

  function proseMentionFindings(
    nodes: readonly GraphNode[],
    edges: readonly GraphEdge[] = [],
  ): readonly Finding[] {
    return validateGraph(syntheticGraph(nodes, edges)).findings.filter(
      (finding) => finding.validatorId === graphValidatorIds.proseMentions,
    );
  }

  function mentionError(subjectId: string, relatedId: string, path: string, message: string) {
    return {
      validatorId: "conformance/prose-mentions",
      family: "conformance",
      severity: "error",
      message,
      subjectId,
      relatedId,
      path,
      file,
    };
  }

  function mentionWarning(subjectId: string, relatedId: string, path: string, message: string) {
    return { ...mentionError(subjectId, relatedId, path, message), severity: "warning" };
  }

  it("refuses a malformed token with the id grammar's own reason", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.mentioning", {
        intent: { outcome: "Mention a malformed address." },
        design: { step1: "Read spec:x#foo before the next step." },
      }),
    ]);

    expect(graphValidatorIds.proseMentions).toBe("conformance/prose-mentions");
    expect(findings).toEqual([
      mentionError(
        "spec:probe.mentioning",
        "spec:x#foo",
        "design.step1",
        'Mention "spec:x#foo" in "spec:probe.mentioning" at design.step1 is not a Spec id or entry address: entry address must be <section>.<key> with section design, ui, or question',
      ),
    ]);
  });

  it("refuses a missing target and suggests the unique nearest id", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:orders.create-order", {
        intent: { outcome: "Turn a cart into an order." },
      }),
      mentionSpec("spec:orders.place-order", {
        intent: { outcome: "Follow spec:orders.create-ordr to the end." },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:orders.place-order",
        "spec:orders.create-ordr",
        "intent.outcome",
        'Mention in "spec:orders.place-order" at intent.outcome points to missing target "spec:orders.create-ordr". Did you mean "spec:orders.create-order"?',
      ),
    ]);
  });

  it("refuses a missing target without a suggestion on a tie, once per path and distinct token", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:orders.create-order-a", { intent: { outcome: "First near miss." } }),
      mentionSpec("spec:orders.create-order-b", { intent: { outcome: "Second near miss." } }),
      mentionSpec("spec:orders.place-order", {
        intent: {
          outcome: "Follow spec:orders.create-order-x, then spec:orders.create-order-x again.",
          risks: ["spec:orders.create-order-x may never exist."],
        },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:orders.place-order",
        "spec:orders.create-order-x",
        "intent.outcome",
        'Mention in "spec:orders.place-order" at intent.outcome points to missing target "spec:orders.create-order-x".',
      ),
      mentionError(
        "spec:orders.place-order",
        "spec:orders.create-order-x",
        "intent.risks[0]",
        'Mention in "spec:orders.place-order" at intent.risks[0] points to missing target "spec:orders.create-order-x".',
      ),
    ]);
  });

  it("refuses an entry address whose key the target's section does not hold", () => {
    const findings = proseMentionFindings(
      [
        mentionSpec("spec:probe.target", {
          intent: { outcome: "Hold six steps and one panel." },
          design: {
            step1: "One.",
            step2: "Two.",
            step3: "Three.",
            step4: "Four.",
            step5: "Five.",
            step6: "Six.",
          },
          ui: { panel: "The panel." },
        }),
        mentionSpec("spec:probe.mentioning", {
          intent: { outcome: "Address the target's entries." },
          behavior: {
            rules: ["Run spec:probe.target#design.step9 after spec:probe.target#ui.panel."],
          },
        }),
      ],
      [dependsOnEdge("spec:probe.mentioning", "spec:probe.target")],
    );

    expect(findings).toEqual([
      mentionError(
        "spec:probe.mentioning",
        "spec:probe.target#design.step9",
        "behavior.rules[0]",
        'Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "design.step9" of "spec:probe.target".',
      ),
    ]);
  });

  it("never resolves an address to a section's description", () => {
    const findings = proseMentionFindings(
      [
        mentionSpec("spec:probe.target", {
          intent: { outcome: "Lead the design with prose." },
          design: { description: "The leading prose.", step1: "One." },
        }),
        mentionSpec("spec:probe.mentioning", {
          intent: { outcome: "Address the leading prose." },
          behavior: { rules: ["Quote spec:probe.target#design.description in full."] },
        }),
      ],
      [dependsOnEdge("spec:probe.mentioning", "spec:probe.target")],
    );

    expect(findings).toEqual([
      mentionError(
        "spec:probe.mentioning",
        "spec:probe.target#design.description",
        "behavior.rules[0]",
        'Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "design.description" of "spec:probe.target".',
      ),
    ]);
  });

  describe("a question address", () => {
    function questionTarget(intent: Readonly<Record<string, unknown>>, design?: unknown) {
      return mentionSpec("spec:probe.target", {
        intent: { outcome: "Hold the questions.", ...intent },
        ...(design === undefined ? {} : { design }),
      });
    }

    function questionFindings(target: PrimitiveNode, rule: string): readonly Finding[] {
      return proseMentionFindings(
        [
          target,
          mentionSpec("spec:probe.mentioning", {
            intent: { outcome: "Address the target's questions." },
            behavior: { rules: [rule] },
          }),
        ],
        [dependsOnEdge("spec:probe.mentioning", "spec:probe.target")],
      );
    }

    function missingQuestion(token: string, key: string) {
      return mentionError(
        "spec:probe.mentioning",
        token,
        "behavior.rules[0]",
        `Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "question.${key}" of "spec:probe.target".`,
      );
    }

    it("resolves to an open question that carries the key, beside unkeyed and prose questions", () => {
      const target = questionTarget({
        openQuestions: [
          "A prose question.",
          { question: "Is the name final?", blocking: false },
          {
            question: "Does the owner widen the aggregate?",
            blocking: true,
            key: "aggregateReach",
          },
        ],
      });

      expect(
        questionFindings(target, "Settle spec:probe.target#question.aggregateReach first."),
      ).toEqual([]);
    });

    it("fails every mention of an old address once its key is renamed", () => {
      const target = questionTarget({
        openQuestions: [{ question: "Does the owner widen the aggregate?", key: "aggregateScope" }],
      });

      expect(
        questionFindings(
          target,
          "Settle spec:probe.target#question.aggregateReach, then spec:probe.target#question.aggregateScope.",
        ),
      ).toEqual([missingQuestion("spec:probe.target#question.aggregateReach", "aggregateReach")]);
    });

    it("finds no entry on a Spec whose questions carry no key, or that has none", () => {
      const unkeyed = questionTarget({
        openQuestions: ["aggregateReach", { question: "aggregateReach", blocking: true }],
      });
      const bare = questionTarget({});
      const rule = "Settle spec:probe.target#question.aggregateReach first.";
      const expected = [
        missingQuestion("spec:probe.target#question.aggregateReach", "aggregateReach"),
      ];

      expect(questionFindings(unkeyed, rule)).toEqual(expected);
      expect(questionFindings(bare, rule)).toEqual(expected);
    });

    it("reads question keys only, never the Design or UI keys of the Spec", () => {
      const target = mentionSpec("spec:probe.target", {
        intent: {
          outcome: "Hold one question.",
          openQuestions: [{ question: "Where does the page live?", key: "pageHome" }],
        },
        design: { aggregateReach: "A Design entry." },
        ui: { aggregateReach: "A UI entry." },
      });

      expect(
        questionFindings(
          target,
          "Read spec:probe.target#question.aggregateReach and spec:probe.target#design.pageHome.",
        ),
      ).toEqual([
        // Findings sort by their related token, so the Design address reports first.
        mentionError(
          "spec:probe.mentioning",
          "spec:probe.target#design.pageHome",
          "behavior.rules[0]",
          'Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "design.pageHome" of "spec:probe.target".',
        ),
        missingQuestion("spec:probe.target#question.aggregateReach", "aggregateReach"),
      ]);
    });

    it("treats description as an ordinary question key", () => {
      const target = questionTarget(
        { openQuestions: [{ question: "Is description a key?", key: "description" }] },
        { description: "The leading prose." },
      );

      expect(
        questionFindings(target, "Settle spec:probe.target#question.description first."),
      ).toEqual([]);
      expect(
        questionFindings(target, "Quote spec:probe.target#design.description in full."),
      ).toEqual([
        mentionError(
          "spec:probe.mentioning",
          "spec:probe.target#design.description",
          "behavior.rules[0]",
          'Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "design.description" of "spec:probe.target".',
        ),
      ]);
    });

    it("refuses a question address with a key off the grammar by the id grammar's reason", () => {
      const target = questionTarget({
        openQuestions: [{ question: "Upper?", key: "AggregateReach" }],
      });

      expect(
        questionFindings(target, "Settle spec:probe.target#question.AggregateReach first."),
      ).toEqual([
        mentionError(
          "spec:probe.mentioning",
          "spec:probe.target#question.AggregateReach",
          "behavior.rules[0]",
          'Mention "spec:probe.target#question.AggregateReach" in "spec:probe.mentioning" at behavior.rules[0] is not a Spec id or entry address: entry address key must be lower-camel ASCII',
        ),
      ]);
    });
  });

  it("checks a self-address for its entry and never warns on it", () => {
    const findings = proseMentionFindings([
      mentionSpec(
        "spec:probe.self",
        {
          intent: { outcome: "Address my own entries." },
          behavior: {
            rules: ["Run spec:probe.self#design.step1, then spec:probe.self#design.step7."],
          },
          design: { step1: "One." },
        },
        "This Spec is spec:probe.self.",
      ),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:probe.self",
        "spec:probe.self#design.step7",
        "behavior.rules[0]",
        'Mention in "spec:probe.self" at behavior.rules[0] points to missing entry "design.step7" of "spec:probe.self".',
      ),
    ]);
  });

  it("warns once for a pair across three locations, first in scan order", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", { intent: { outcome: "Be named often." } }),
      mentionSpec("spec:probe.mentioning", {
        // Authored before behavior; the scan still reads sections in the serialized graph's order.
        design: { step2: "Hand off to spec:probe.target." },
        intent: { outcome: "Name the target three times." },
        behavior: {
          rules: [
            "Read spec:probe.target, then read spec:probe.target again.",
            "A rule without a mention.",
            "Close with spec:probe.target as well.",
          ],
        },
      }),
    ]);

    expect(findings).toEqual([
      mentionWarning(
        "spec:probe.mentioning",
        "spec:probe.target",
        "behavior.rules[0]",
        `Mention of "spec:probe.target" in "spec:probe.mentioning" at 3 locations, first at behavior.rules[0], ${warningTail}`,
      ),
    ]);
  });

  it("writes one location in the singular", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", { intent: { outcome: "Be named once." } }),
      mentionSpec("spec:probe.mentioning", {
        intent: { outcome: "Name spec:probe.target once." },
      }),
    ]);

    expect(findings).toEqual([
      mentionWarning(
        "spec:probe.mentioning",
        "spec:probe.target",
        "intent.outcome",
        `Mention of "spec:probe.target" in "spec:probe.mentioning" at 1 location, first at intent.outcome, ${warningTail}`,
      ),
    ]);
  });

  it("lets a declared relation in the reverse direction back the mention", () => {
    const findings = proseMentionFindings(
      [
        mentionSpec("spec:probe.child", { intent: { outcome: "Rest on the parent." } }),
        mentionSpec("spec:probe.parent", {
          intent: { outcome: "Name the child spec:probe.child that rests on this Spec." },
        }),
      ],
      [dependsOnEdge("spec:probe.child", "spec:probe.parent")],
    );

    expect(findings).toEqual([]);
  });

  it("counts an address mention toward its pair, resolved or not", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", {
        intent: { outcome: "Hold one step." },
        design: { step1: "One." },
      }),
      mentionSpec(
        "spec:probe.mentioning",
        {
          intent: { outcome: "Address the target's steps." },
          behavior: {
            rules: [
              "Run spec:probe.target#design.step1 first.",
              "Run spec:probe.target#design.missing next.",
            ],
          },
        },
        "This Spec leans on spec:probe.target.",
      ),
    ]);

    expect(findings).toEqual([
      mentionWarning(
        "spec:probe.mentioning",
        "spec:probe.target",
        "narrative",
        `Mention of "spec:probe.target" in "spec:probe.mentioning" at 3 locations, first at narrative, ${warningTail}`,
      ),
      mentionError(
        "spec:probe.mentioning",
        "spec:probe.target#design.missing",
        "behavior.rules[1]",
        'Mention in "spec:probe.mentioning" at behavior.rules[1] points to missing entry "design.missing" of "spec:probe.target".',
      ),
    ]);
  });

  it("never scans the gwt and gwt-vocabulary fences, and skips them by position only", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.fenced", {
        intent: { outcome: "Keep ids inside the fences." },
        behavior: {
          examples: [
            {
              given: ["spec:probe.absent holds"],
              when: ["the step reads spec:probe.absent"],
              then: ["spec:probe.absent stays unscanned"],
            },
          ],
          exampleSpace: { given: ["spec:probe.absent is a {thing}"] },
        },
        design: { exampleSpace: "Outside a fence, spec:probe.absent is a mention." },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:probe.fenced",
        "spec:probe.absent",
        "design.exampleSpace",
        'Mention in "spec:probe.fenced" at design.exampleSpace points to missing target "spec:probe.absent".',
      ),
    ]);
  });

  it.each(["design", "ui"])(
    "keeps authored order inside an object nested in %s, so a nested description is not read first",
    (section) => {
      const findings = proseMentionFindings([
        mentionSpec("spec:probe.target", { intent: { outcome: "Be named in nested data." } }),
        mentionSpec("spec:probe.mentioning", {
          intent: { outcome: "Name the target in nested data." },
          [section]: {
            nested: {
              zeta: "spec:probe.target",
              description: "spec:probe.target",
              alpha: "spec:probe.target",
            },
          },
        }),
      ]);

      expect(findings).toEqual([
        mentionWarning(
          "spec:probe.mentioning",
          "spec:probe.target",
          `${section}.nested.zeta`,
          `Mention of "spec:probe.target" in "spec:probe.mentioning" at 3 locations, first at ${section}.nested.zeta, ${warningTail}`,
        ),
      ]);
    },
  );

  it("scans arrays nested in behavior examples, as the mention audit does", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", { intent: { outcome: "Be named in an example array." } }),
      mentionSpec("spec:probe.nested-examples", {
        intent: { outcome: "Carry string arrays among the examples." },
        behavior: { examples: [["spec:missing"], [["spec:probe.target"]]] },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:probe.nested-examples",
        "spec:missing",
        "behavior.examples[0][0]",
        'Mention in "spec:probe.nested-examples" at behavior.examples[0][0] points to missing target "spec:missing".',
      ),
      mentionWarning(
        "spec:probe.nested-examples",
        "spec:probe.target",
        "behavior.examples[1][0][0]",
        `Mention of "spec:probe.target" in "spec:probe.nested-examples" at 1 location, first at behavior.examples[1][0][0], ${warningTail}`,
      ),
    ]);
  });

  it.each(["anchored", "inferred"] as const)(
    "still warns on a pair joined only by an edge whose claim is %s",
    (claim) => {
      const findings = proseMentionFindings(
        [
          mentionSpec("spec:probe.target", { intent: { outcome: "Be named." } }),
          mentionSpec("spec:probe.mentioning", {
            intent: { outcome: "Name spec:probe.target once." },
          }),
        ],
        [{ from: "spec:probe.mentioning", type: "dependsOn", to: "spec:probe.target", claim }],
      );

      expect(findings).toEqual([
        mentionWarning(
          "spec:probe.mentioning",
          "spec:probe.target",
          "intent.outcome",
          `Mention of "spec:probe.target" in "spec:probe.mentioning" at 1 location, first at intent.outcome, ${warningTail}`,
        ),
      ]);
    },
  );

  it("resolves an address only to an own key, never an inherited one", () => {
    const findings = proseMentionFindings(
      [
        mentionSpec("spec:probe.target", {
          intent: { outcome: "Hold an empty Design record." },
          design: {},
        }),
        mentionSpec("spec:probe.mentioning", {
          intent: { outcome: "Address an inherited name." },
          behavior: { rules: ["Read spec:probe.target#design.toString first."] },
        }),
      ],
      [dependsOnEdge("spec:probe.mentioning", "spec:probe.target")],
    );

    expect(findings).toEqual([
      mentionError(
        "spec:probe.mentioning",
        "spec:probe.target#design.toString",
        "behavior.rules[0]",
        'Mention in "spec:probe.mentioning" at behavior.rules[0] points to missing entry "design.toString" of "spec:probe.target".',
      ),
    ]);
  });

  it.each([
    [
      "authored entry order",
      { zeta: "Run spec:probe.target.", alpha: "Then spec:probe.target." },
      "design.zeta",
    ],
    [
      "a description authored after another mentioning entry",
      { step1: "Run spec:probe.target.", description: "Lead with spec:probe.target." },
      "design.description",
    ],
  ])(
    "puts the pair warning's first path in %s, with description first",
    (_order, design, first) => {
      const findings = proseMentionFindings([
        mentionSpec("spec:probe.target", { intent: { outcome: "Be named twice." } }),
        mentionSpec("spec:probe.mentioning", {
          intent: { outcome: "Name the target in Design only." },
          design,
        }),
      ]);

      expect(findings).toEqual([
        mentionWarning(
          "spec:probe.mentioning",
          "spec:probe.target",
          first,
          `Mention of "spec:probe.target" in "spec:probe.mentioning" at 2 locations, first at ${first}, ${warningTail}`,
        ),
      ]);
    },
  );

  it("suggests the nearest Spec id for a missing target written as an address", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:orders.create-order", {
        intent: { outcome: "Turn a cart into an order." },
        design: { step1: "Validate the cart." },
      }),
      mentionSpec("spec:orders.place-order", {
        intent: { outcome: "Follow spec:orders.create-ordr#design.step1 to the end." },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:orders.place-order",
        "spec:orders.create-ordr#design.step1",
        "intent.outcome",
        'Mention in "spec:orders.place-order" at intent.outcome points to missing target "spec:orders.create-ordr#design.step1". Did you mean "spec:orders.create-order"?',
      ),
    ]);
  });

  it.each([
    ["an underscore", "spec:probe.target_v2", "spec:probe.target_v2", "invalid path segment"],
    [
      "an underscore and a letter",
      "spec:probe.target_x",
      "spec:probe.target_x",
      "invalid path segment",
    ],
    ["a slash", "spec:probe.target/extra", "spec:probe.target/extra", "invalid path segment"],
    ["a slash and a letter", "spec:probe.target/x", "spec:probe.target/x", "invalid path segment"],
    [
      "a comma",
      "spec:probe.target,spec:probe.other",
      "spec:probe.target,spec:probe.other",
      "invalid path segment",
    ],
    ["a comma and a letter", "spec:probe.target,x", "spec:probe.target,x", "invalid path segment"],
    ["a letter outside ASCII", "spec:probe.targeté", "spec:probe.targeté", "invalid path segment"],
    // An escape is read as its punctuation, so the underscore stays inside the token.
    [
      "an escaped underscore",
      "spec:probe.target\\_x",
      "spec:probe.target_x",
      "invalid path segment",
    ],
    // A character outside ASCII that is not a separator stays in the token, so a valid prefix
    // never resolves on its own.
    ["a combining mark", "spec:probe.cafe\u0301", "spec:probe.cafe\u0301", "invalid path segment"],
    [
      "a combining mark after an entry key",
      "spec:probe.cafe#design.step1\u0301",
      "spec:probe.cafe#design.step1\u0301",
      "entry address key must be lower-camel ASCII",
    ],
    [
      "a zero-width space",
      "spec:probe.cafe\u200bx",
      "spec:probe.cafe\u200bx",
      "invalid path segment",
    ],
    [
      "fullwidth connector punctuation",
      "spec:probe.cafe\uff3fx",
      "spec:probe.cafe\uff3fx",
      "invalid path segment",
    ],
    // A control character other than whitespace stays in the token too.
    [
      "a NUL",
      "spec:probe.cafe\u0000missing",
      "spec:probe.cafe\u0000missing",
      "invalid path segment",
    ],
    [
      "an escape character",
      "spec:probe.cafe\u001bmissing",
      "spec:probe.cafe\u001bmissing",
      "invalid path segment",
    ],
    [
      "a delete character",
      "spec:probe.cafe\u007fmissing",
      "spec:probe.cafe\u007fmissing",
      "invalid path segment",
    ],
    [
      "a C1 control character",
      "spec:probe.cafe\u0080missing",
      "spec:probe.cafe\u0080missing",
      "invalid path segment",
    ],
    [
      "a hyphenated entry key",
      "spec:probe.target#design.step-1",
      "spec:probe.target#design.step-1",
      "entry address key must be lower-camel ASCII",
    ],
    [
      // The trailing dot is removed as sentence punctuation, leaving `#design`.
      "an entry suffix with no key",
      "spec:probe.target#design.",
      "spec:probe.target#design",
      "entry address must be <section>.<key> with section design, ui, or question",
    ],
    [
      "an entry suffix outside design, ui, and question",
      "spec:probe.target#model.x",
      "spec:probe.target#model.x",
      "entry address must be <section>.<key> with section design, ui, or question",
    ],
  ])(
    "reads the whole token through %s and refuses it, never the existing prefix",
    (_case, written, token, reason) => {
      const findings = proseMentionFindings([
        mentionSpec("spec:probe.target", {
          intent: { outcome: "Exist under the prefix." },
          design: { step1: "One." },
        }),
        mentionSpec("spec:probe.other", { intent: { outcome: "Exist as well." } }),
        mentionSpec("spec:probe.cafe", {
          intent: { outcome: "Exist under a prefix too." },
          design: { step1: "One." },
        }),
        mentionSpec("spec:probe.mentioning", { intent: { outcome: `Read ${written} now` } }),
      ]);

      expect(findings).toEqual([
        mentionError(
          "spec:probe.mentioning",
          token,
          "intent.outcome",
          `Mention "${token}" in "spec:probe.mentioning" at intent.outcome is not a Spec id or entry address: ${reason}`,
        ),
      ]);
    },
  );

  it.each([
    ["a sentence dot", "Read spec:probe.target."],
    ["a comma", "Read spec:probe.target, then stop."],
    ["a colon", "Read spec:probe.target: then stop."],
    ["a closing parenthesis", "Read it (spec:probe.target) now."],
    ["bold", "Read **spec:probe.target** now."],
    ["emphasis", "Read _spec:probe.target_ now."],
    ["strikethrough", "Read ~~spec:probe.target~~ now."],
    ["backticks", "Read `spec:probe.target` now."],
    ["ASCII double quotes", 'Read "spec:probe.target" now.'],
    ["ASCII single quotes", "Read 'spec:probe.target' now."],
    ["typographic double quotes", "Read “spec:probe.target” now."],
    ["typographic single quotes", "Read ‘spec:probe.target’ now."],
    ["an em dash", "Read spec:probe.target—see the rest."],
    ["an en dash", "Read spec:probe.target–see the rest."],
    ["an ellipsis", "Read spec:probe.target… and stop."],
    ["an escaped star", "Read spec:probe.target\\* now."],
    ["an escaped exclamation mark", "Read spec:probe.target\\! now."],
    ["U+0085", "Read spec:probe.target\u0085then stop."],
    ["a no-break space", "Read spec:probe.target\u00a0then stop."],
    ["a tab", "Read spec:probe.target\tthen stop."],
    ["an arrow", "Read spec:probe.target→then stop."],
  ])("reads the clean id through Markdown punctuation: %s", (_case, outcome) => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", { intent: { outcome: "Be named once." } }),
      mentionSpec("spec:probe.mentioning", { intent: { outcome } }),
    ]);

    expect(findings).toEqual([
      mentionWarning(
        "spec:probe.mentioning",
        "spec:probe.target",
        "intent.outcome",
        `Mention of "spec:probe.target" in "spec:probe.mentioning" at 1 location, first at intent.outcome, ${warningTail}`,
      ),
    ]);
  });

  it("reads a placeholder or a bare prefix as prose, not a mention", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.mentioning", {
        intent: { outcome: "Write spec:<id> for a Spec, or the bare spec: prefix, as prose." },
      }),
    ]);

    expect(findings).toEqual([]);
  });

  it("strips a sentence-final dot from a token", () => {
    const findings = proseMentionFindings([
      mentionSpec("spec:probe.target", { intent: { outcome: "End a sentence." } }),
      mentionSpec("spec:probe.mentioning", {
        intent: { outcome: "Read spec:probe.target. Then read spec:probe.absent." },
      }),
    ]);

    expect(findings).toEqual([
      mentionError(
        "spec:probe.mentioning",
        "spec:probe.absent",
        "intent.outcome",
        'Mention in "spec:probe.mentioning" at intent.outcome points to missing target "spec:probe.absent".',
      ),
      mentionWarning(
        "spec:probe.mentioning",
        "spec:probe.target",
        "intent.outcome",
        `Mention of "spec:probe.target" in "spec:probe.mentioning" at 1 location, first at intent.outcome, ${warningTail}`,
      ),
    ]);
  });
});

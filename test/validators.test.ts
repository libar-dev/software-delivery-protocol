import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  constrainedBy,
  decidedBy,
  dependsOn,
  graphValidatorIds,
  pack,
  packId,
  ref,
  refines,
  schemaVersion,
  spec,
  specId,
  specTest,
  supersedes,
  testAnchorId,
  validateGraph,
} from "../src/index.js";
import type { Finding, GraphEdge, GraphNode, GraphSchema, PrimitiveNode } from "../src/index.js";
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

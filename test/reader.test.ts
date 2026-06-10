import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  createReader,
  extract,
  graphValidatorIds,
  pack,
  packId,
  refines,
  spec,
  specId,
} from "../src/index.js";
import type { GraphSchema, Reader } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

const exampleRoot = join(fileURLToPath(new URL("..", import.meta.url)), "examples", "checkout-v1");

/** The example graph, extracted once — the canonical consumer input (one graph, many readers). */
const exampleGraph = extract({ root: exampleRoot }).graph;

function exampleReader(): Reader {
  return createReader(exampleGraph);
}

describe("the reader — the thin typed loader behind the agent surface", () => {
  describe("flat accessors", () => {
    it("summarizes every spec with the decode done once: display label, recomputed facts, packs, derived readiness", () => {
      const summaries = exampleReader().specs();

      expect(summaries.map((summary) => summary.id)).toEqual([
        "spec:decisions.order-lifecycle",
        "spec:orders.create-order",
        "spec:orders.create-order.invalid-cart",
        "spec:orders.create-order.valid-cart",
        "spec:orders.order-inventory-rule",
        "spec:orders.order-latency-constraint",
        "spec:orders.order-management",
        "spec:orders.order-model",
        "spec:orders.order-total-rule",
      ]);

      const createOrder = summaries.find((entry) => entry.id === "spec:orders.create-order");
      expect(createOrder).toMatchObject({
        title: "Customer creates an order",
        specKind: "behavior",
        kindDisplayLabel: "Use Case / Behavior",
        altitude: "feature",
        statedReadiness: "defined",
        // Structurally clears the ready clauses too — derived above stated is ordinary
        // information (the floor is never a quota); stating ready stays the human's call.
        derivedReadiness: "ready",
        deliveryFacts: ["implemented", "has-verifier"],
        packs: ["pack:checkout-v1"],
      });
    });

    it("summarizes packs and exposes the full findings — the holes beside the assertions (JS-E2)", () => {
      const reader = exampleReader();

      expect(reader.packs()).toEqual([
        {
          id: "pack:checkout-v1",
          title: "Checkout v1",
          framing:
            "Let customers create orders from valid carts with honest authored traceability.",
          file: "specs/checkout.pack.sdp.ts",
          modelRefs: ["spec:orders.order-model"],
        },
      ]);

      // The example's standing surfaced absence: the invalid-cart example's unenabled verifier.
      expect(reader.findings()).toHaveLength(1);
      expect(reader.findings()[0]).toMatchObject({
        validatorId: graphValidatorIds.verifiesLinkage,
        severity: "warning",
        subjectId: "spec:orders.create-order.invalid-cart",
      });
    });
  });

  describe("findByConcept — the grep→graph bridge from a string", () => {
    it("matches ids first, then titles/labels, then section prose — deterministic, never fuzzy", () => {
      const matches = exampleReader().findByConcept("create-order");

      expect(matches[0]?.matchedIn).toContain("id");
      expect(matches.map((match) => match.id)).toContain("impl:orders.create-order-use-case");
      expect(matches.map((match) => match.id)).toContain("spec:orders.create-order");
    });

    it("reaches the domain vocabulary: a model term key is content, not structure", () => {
      const matches = exampleReader().findByConcept("inventorySnapshot");

      expect(matches).toEqual([
        {
          id: "spec:orders.order-model",
          nodeType: "Primitive",
          title: "Order-management domain vocabulary",
          matchedIn: ["sections.model"],
        },
      ]);
    });

    it("matches an anchor label, case-insensitively", () => {
      const matches = exampleReader().findByConcept("post /ORDERS");

      expect(matches).toEqual([
        {
          id: "api:orders.post",
          nodeType: "CodeNode",
          matchedIn: ["label"],
        },
      ]);
    });

    it("never matches section structure keys: a query naming a shape key finds only content", () => {
      // Every example spec carries behavior.examples entries keyed given/when/then; the key
      // itself must not match (only model.terms keys are content).
      const matches = exampleReader().findByConcept("given");

      expect(matches.filter((match) => match.matchedIn.includes("sections.behavior"))).toEqual([]);
    });

    it("returns nothing for an empty query", () => {
      expect(exampleReader().findByConcept("   ")).toEqual([]);
    });
  });

  describe("byFile — the grep→graph bridge from a file", () => {
    it("maps a spec file to the spec authored there", () => {
      expect(exampleReader().byFile("specs/orders/create-order.sdp.ts")).toEqual({
        path: "specs/orders/create-order.sdp.ts",
        nodes: [{ id: "spec:orders.create-order", nodeType: "Primitive" }],
        specs: ["spec:orders.create-order"],
      });
    });

    it("maps a source file through its binding to the spec it satisfies (./-prefix normalized)", () => {
      expect(exampleReader().byFile("./src/orders/create-order.use-case.ts")).toEqual({
        path: "src/orders/create-order.use-case.ts",
        nodes: [{ id: "impl:orders.create-order-use-case", nodeType: "CodeNode", line: 23 }],
        specs: ["spec:orders.create-order"],
      });
    });

    it("maps a test file through its anchor to the example it verifies", () => {
      expect(exampleReader().byFile("test/orders/create-order.valid-cart.test.ts")).toEqual({
        path: "test/orders/create-order.valid-cart.test.ts",
        nodes: [{ id: "test:orders.create-order.valid-cart", nodeType: "Anchor", line: 10 }],
        specs: ["spec:orders.create-order.valid-cart"],
      });
    });

    it("answers honestly for a file the graph records nothing at", () => {
      expect(exampleReader().byFile("src/orders/pricing.ts")).toEqual({
        path: "src/orders/pricing.ts",
        nodes: [],
        specs: [],
      });
    });
  });

  describe("blastRadius — file-level impact, coverage-unknown honest (`06` §2)", () => {
    it("reaches the bound spec and its one-hop neighborhood with the connecting edges named", () => {
      const radius = exampleReader().blastRadius(["src/orders/create-order.use-case.ts"]);

      expect(radius.impactedSpecs).toEqual([
        {
          id: "spec:orders.create-order",
          reasons: [
            {
              file: "src/orders/create-order.use-case.ts",
              throughBinding: {
                id: "impl:orders.create-order-use-case",
                edgeType: "satisfies",
                claim: "anchored",
              },
            },
          ],
        },
      ]);
      expect(radius.coverageUnknown).toEqual([]);

      const atRiskIds = radius.atRisk.map((item) => item.id);
      // The parent, the children/verifiers, the pack, and the *other* binding are all one hop
      // away; the changed file's own binding node is the change, not the risk.
      expect(atRiskIds).toContain("spec:orders.order-management");
      expect(atRiskIds).toContain("spec:orders.create-order.valid-cart");
      expect(atRiskIds).toContain("pack:checkout-v1");
      expect(atRiskIds).toContain("api:orders.post");
      expect(atRiskIds).not.toContain("impl:orders.create-order-use-case");

      const parent = radius.atRisk.find((item) => item.id === "spec:orders.order-management");
      expect(parent?.reasons).toEqual([
        {
          from: "spec:orders.create-order",
          edgeType: "refines",
          to: "spec:orders.order-management",
          claim: "declared",
        },
      ]);
    });

    it("treats a changed spec file as direct impact (no binding in the reason)", () => {
      const radius = exampleReader().blastRadius(["specs/orders/create-order.sdp.ts"]);

      expect(radius.impactedSpecs).toEqual([
        {
          id: "spec:orders.create-order",
          reasons: [{ file: "specs/orders/create-order.sdp.ts" }],
        },
      ]);
    });

    it("treats a changed pack manifest as pack impact with the members at risk via belongsTo", () => {
      const radius = exampleReader().blastRadius(["specs/checkout.pack.sdp.ts"]);

      expect(radius.impactedPacks).toEqual([
        { id: "pack:checkout-v1", reasons: [{ file: "specs/checkout.pack.sdp.ts" }] },
      ]);
      expect(radius.atRisk).toHaveLength(9);
      expect(radius.atRisk[0]?.reasons[0]?.edgeType).toBe("belongsTo");
    });

    it("surfaces an unanchored changed file as coverage-unknown, never silently dropped", () => {
      const radius = exampleReader().blastRadius([
        "src/orders/pricing.ts",
        "src/orders/create-order.use-case.ts",
      ]);

      expect(radius.coverageUnknown).toEqual(["src/orders/pricing.ts"]);
      expect(radius.impactedSpecs.map((item) => item.id)).toEqual(["spec:orders.create-order"]);
    });

    it("normalizes, dedupes, and sorts the changed-file list", () => {
      const radius = exampleReader().blastRadius([
        "./specs/orders/create-order.sdp.ts",
        "specs/orders/create-order.sdp.ts",
        "src/orders/pricing.ts",
      ]);

      expect(radius.changedFiles).toEqual([
        "specs/orders/create-order.sdp.ts",
        "src/orders/pricing.ts",
      ]);
    });
  });

  describe("specContext — the irreducible per-spec join", () => {
    it("joins relations, bindings, recomputed facts, and the spec's findings in one answer", () => {
      const context = exampleReader().specContext("spec:orders.create-order");

      expect(context).toBeDefined();
      expect(context?.relationsOut).toEqual([
        {
          type: "constrainedBy",
          claim: "declared",
          otherId: "spec:orders.order-latency-constraint",
          resolved: true,
          otherNodeType: "Primitive",
          otherTitle: "Create-order latency stays within checkout budget",
        },
        {
          type: "decidedBy",
          claim: "declared",
          otherId: "spec:decisions.order-lifecycle",
          resolved: true,
          otherNodeType: "Primitive",
          otherTitle: "Order lifecycle keeps validation before creation",
        },
        {
          type: "refines",
          claim: "declared",
          otherId: "spec:orders.order-management",
          resolved: true,
          otherNodeType: "Primitive",
          otherTitle: "Order management",
        },
      ]);

      expect(context?.implementations).toEqual([
        {
          codeId: "api:orders.post",
          claim: "anchored",
          label: "POST /orders",
          file: "src/orders/create-order.route.ts",
          line: 6,
        },
        {
          codeId: "impl:orders.create-order-use-case",
          claim: "anchored",
          label: "createOrderFromCart",
          file: "src/orders/create-order.use-case.ts",
          line: 23,
        },
      ]);

      // The enabled-status decode (MD-7): the valid-cart example is anchor-backed, the
      // invalid-cart one is not — the claim taxonomy travels with the data, never collapsed.
      expect(context?.verifiers).toEqual([
        {
          verifierId: "spec:orders.create-order.invalid-cart",
          via: "example",
          claim: "declared",
          enabled: false,
          label: "Invalid cart is rejected",
          file: "specs/orders/create-order-invalid-cart.sdp.ts",
        },
        {
          verifierId: "spec:orders.create-order.valid-cart",
          via: "example",
          claim: "declared",
          enabled: true,
          label: "Valid cart creates an order",
          file: "specs/orders/create-order-valid-cart.sdp.ts",
        },
      ]);

      expect(context?.floorFailures).toEqual([]);
      // The unenabled-verifier warning names this spec as related — visible from here too.
      expect(context?.findings.map((finding) => finding.validatorId)).toEqual([
        graphValidatorIds.verifiesLinkage,
      ]);
    });

    it("decodes a test anchor as an enabled verifier binding with its source location", () => {
      const context = exampleReader().specContext("spec:orders.create-order.valid-cart");

      expect(context?.verifiers).toEqual([
        {
          verifierId: "test:orders.create-order.valid-cart",
          via: "test-anchor",
          claim: "anchored",
          enabled: true,
          label: "valid cart verifies the create-order happy path",
          file: "test/orders/create-order.valid-cart.test.ts",
          line: 10,
        },
      ]);
    });

    it("returns undefined for an id the graph does not hold", () => {
      expect(exampleReader().specContext("spec:orders.refund-order")).toBeUndefined();
    });
  });

  describe("packContext — the pack reviewed as a unit (JS-E4, JS-G4)", () => {
    it("lists members with their decode and the verifier gaps, ready ones as the priority slice", () => {
      const context = exampleReader().packContext("pack:checkout-v1");

      expect(context?.members).toHaveLength(9);
      expect(context?.members.every((member) => member.resolved)).toBe(true);

      // Verifier gaps: every member without a verifier binding; the example has two covered
      // specs (create-order and its valid-cart example) and no ready member, so no priority.
      expect(context?.verifierGaps.map((gap) => gap.id)).toEqual([
        "spec:decisions.order-lifecycle",
        "spec:orders.create-order.invalid-cart",
        "spec:orders.order-inventory-rule",
        "spec:orders.order-latency-constraint",
        "spec:orders.order-management",
        "spec:orders.order-model",
        "spec:orders.order-total-rule",
      ]);
      expect(context?.verifierGaps.every((gap) => !gap.priority)).toBe(true);
    });

    it("flags a ready member without a verifier as the priority gap", () => {
      const parent = spec({
        id: specId("spec:orders.order-management"),
        title: "Order management",
        kind: "behavior",
        altitude: "epic",
        readiness: "defined",
        intent: { outcome: "Coordinate the slice." },
        behavior: { rules: ["The slice stays traceable."] },
      });
      const readyRule = spec({
        id: specId("spec:orders.order-total-rule"),
        title: "Order total matches cart math",
        kind: "rule",
        altitude: "story",
        readiness: "ready",
        intent: { outcome: "Keep totals deterministic." },
        behavior: { rules: ["The order total is the sum of all line subtotals."] },
        relations: [refines(specId("spec:orders.order-management"))],
      });
      const graph = deriveFixtureGraph({
        specs: [parent, readyRule],
        packs: [
          pack({
            id: packId("pack:checkout-v1"),
            title: "Checkout v1",
            specs: [specId("spec:orders.order-management"), specId("spec:orders.order-total-rule")],
          }),
        ],
      });

      const gaps = createReader(graph).packContext("pack:checkout-v1")?.verifierGaps;

      expect(gaps).toEqual([
        { id: "spec:orders.order-management", statedReadiness: "defined", priority: false },
        { id: "spec:orders.order-total-rule", statedReadiness: "ready", priority: true },
      ]);
    });

    it("returns undefined for a non-pack id", () => {
      expect(exampleReader().packContext("spec:orders.create-order")).toBeUndefined();
    });
  });

  describe("honesty over foreign producers", () => {
    it("exposes recomputed delivery facts, never stated ones — the divergence stays a finding", () => {
      const graph = deriveFixtureGraph({
        specs: [
          spec({
            id: specId("spec:orders.order-total-rule"),
            title: "Order total matches cart math",
            kind: "rule",
            altitude: "story",
            readiness: "idea",
            intent: { outcome: "Keep totals deterministic." },
          }),
        ],
      });
      const faked: GraphSchema = {
        ...graph,
        nodes: graph.nodes.map((node) =>
          node.nodeType === "Primitive" ? { ...node, deliveryFacts: ["has-verifier"] } : node,
        ),
      };

      const reader = createReader(faked);

      expect(reader.specs()[0]?.deliveryFacts).toEqual([]);
      expect(
        reader
          .findings()
          .some((finding) => finding.validatorId === graphValidatorIds.deliveryFacts),
      ).toBe(true);
    });

    it("carries the claim through impact answers — machine-derived reach is marked, never promoted", () => {
      const graph = deriveFixtureGraph({
        specs: [
          spec({
            id: specId("spec:orders.order-total-rule"),
            title: "Order total matches cart math",
            kind: "rule",
            altitude: "story",
            readiness: "idea",
            intent: { outcome: "Keep totals deterministic." },
          }),
        ],
        anchors: [
          codeAnchor({
            id: codeAnchorId("impl:orders.totals"),
            satisfies: specId("spec:orders.order-total-rule"),
          }),
        ],
      });
      // A foreign producer adds an off-contract inferred edge; the reader decodes it as data —
      // the claim-separation error owns the contract violation, and the impact answer carries
      // the claim so advisory reach is never mistaken for declared certainty (JS-G1 AC5).
      const foreign: GraphSchema = {
        ...graph,
        edges: [
          ...graph.edges,
          {
            from: "impl:orders.totals",
            type: "satisfies",
            to: "spec:orders.order-total-rule",
            claim: "inferred",
          },
        ],
      };

      const radius = createReader(foreign).blastRadius(["src/fixture.ts"]);
      const reasons = radius.impactedSpecs[0]?.reasons ?? [];

      expect(reasons.map((reason) => reason.throughBinding?.claim)).toEqual([
        "anchored",
        "inferred",
      ]);
      expect(
        createReader(foreign)
          .findings()
          .some((finding) => finding.validatorId === graphValidatorIds.claimSeparation),
      ).toBe(true);
    });
  });

  describe("purity and determinism", () => {
    it("never mutates the graph and answers identically across fresh readers", () => {
      const before = JSON.stringify(exampleGraph);
      const first = createReader(exampleGraph);
      const second = createReader(exampleGraph);

      expect(first.specs()).toEqual(second.specs());
      expect(first.blastRadius(["src/orders/create-order.use-case.ts"])).toEqual(
        second.blastRadius(["src/orders/create-order.use-case.ts"]),
      );
      expect(first.findByConcept("cart")).toEqual(second.findByConcept("cart"));
      expect(JSON.stringify(exampleGraph)).toBe(before);
    });
  });
});

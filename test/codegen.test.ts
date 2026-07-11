import { describe, expect, it } from "vitest";

import { contractsFindingIds, generateContracts, refines, spec, specId } from "../src/index.js";
import type { Spec } from "../src/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

/**
 * The contracts codegen stage, unit-tested over fixture graphs (the checkout-v1 example pins the
 * end-to-end bytes through the CLI; here each generation law and each loud degradation is pinned
 * in isolation).
 */

const parent = (exampleSpace?: {
  given?: readonly string[];
  when?: readonly string[];
  then?: readonly string[];
}): Spec =>
  spec({
    id: specId("spec:orders.create-order"),
    title: "Customer creates an order",
    kind: "behavior",
    altitude: "feature",
    readiness: "defined",
    intent: { outcome: "Turn a valid cart into an order." },
    ...(exampleSpace === undefined ? {} : { behavior: { exampleSpace } }),
  });

const child = (
  gwt: { given: readonly string[]; when: readonly string[]; then: readonly string[] },
  id = "spec:orders.create-order.valid-cart",
): Spec =>
  spec({
    id: specId(id),
    title: "Valid cart creates an order",
    kind: "example",
    altitude: "story",
    readiness: "defined",
    intent: { outcome: "Show the happy path." },
    behavior: { examples: [gwt] },
    relations: [refines(specId("spec:orders.create-order"))],
  });

const VOCABULARY = {
  given: [
    "a customer has a cart with {n:number} line items",
    'every cart item is {availability:"in stock"|"out of stock"}',
  ],
  when: ["the customer submits the cart for order creation"],
  then: ["an order is created with total {total:number}"],
};

const BOUND_GWT = {
  given: [
    "a customer has a cart with {n: 2} line items",
    'every cart item is {availability: "in stock"}',
  ],
  when: ["the customer submits the cart for order creation"],
  then: ["an order is created with total {total: 100}"],
};

describe("the contracts codegen stage", () => {
  it("emits a space contract per example-space parent and a step contract per bindable example", () => {
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), child(BOUND_GWT)] });
    const generated = generateContracts(graph);

    expect([...generated.files.keys()]).toEqual([
      "orders.create-order.space.ts",
      "orders.create-order.valid-cart.contract.ts",
    ]);
    expect(generated.findings).toEqual([]);

    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    // Dimensions from the given/when typed slots; the Outcome union from the Then vocabulary,
    // variant kind = the step's own skeleton; unspecified contributed by the runner core.
    expect(space).toContain("readonly n: number;");
    expect(space).toContain('readonly availability: "in stock" | "out of stock";');
    expect(space).toContain(
      '{ readonly kind: "an order is created with total {total}"; readonly total: number }',
    );
    expect(space).toContain("| UnspecifiedOutcome;");
    expect(space).toContain(
      '{ spec: "spec:orders.create-order.valid-cart", point: { n: 2, availability: "in stock" } }',
    );

    const contract = generated.files.get("orders.create-order.valid-cart.contract.ts") ?? "";
    // The Step union carries skeletons; StepParams types slots from the vocabulary; the steps
    // carry the example's authored point — values flow from the spec, never the test.
    expect(contract).toContain('| "a customer has a cart with {n} line items"');
    expect(contract).toContain(
      'readonly "a customer has a cart with {n} line items": { readonly n: number };',
    );
    expect(contract).toContain(
      '{ kind: "given", text: "a customer has a cart with {n} line items", params: { n: 2 } }',
    );
    expect(contract).toContain("params: { total: 100 }");
  });

  it("is deterministic: two generations over one graph are byte-identical", () => {
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), child(BOUND_GWT)] });

    expect(generateContracts(graph).files).toEqual(generateContracts(graph).files);
  });

  it("refuses a prose-only example and an unbound-slot example — refusing is the honest behavior", () => {
    const prose = spec({
      id: specId("spec:orders.create-order.prose"),
      title: "Prose-only example",
      kind: "example",
      altitude: "story",
      readiness: "scoped",
      behavior: { examples: ["a prose sketch of the happy path"] },
      relations: [refines(specId("spec:orders.create-order"))],
    });
    const unbound = child(
      {
        given: ["a customer has a cart with {n} line items"],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 100}"],
      },
      "spec:orders.create-order.unbound",
    );
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), prose, unbound] });
    const generated = generateContracts(graph);

    // The parent's space still emits (the prose child binds nothing and contributes no point;
    // the unbound child is not the defined-rung bindable form) — no step contract for either.
    expect([...generated.files.keys()]).toEqual(["orders.create-order.space.ts"]);
  });

  it("emits a step contract with inferred param types when no parent vocabulary matches", () => {
    const orphanExample = child(BOUND_GWT);
    const graph = deriveFixtureGraph({ specs: [parent(), orphanExample] });
    const generated = generateContracts(graph);

    const contract = generated.files.get("orders.create-order.valid-cart.contract.ts") ?? "";
    // No vocabulary to type against: the bound value's scalar kind types the slot (the 4-seam
    // parity case — contracts exist with or without an example space).
    expect(contract).toContain(
      'readonly "a customer has a cart with {n} line items": { readonly n: number };',
    );
    expect(contract).toContain(
      'readonly "every cart item is {availability}": { readonly availability: string };',
    );
  });

  it("keeps a partial point honest: only the bound dimensions enter the point", () => {
    const partial = child(
      {
        given: ["a customer has a cart with {n: 0} line items"],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 0}"],
      },
      "spec:orders.create-order.empty-cart",
    );
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), partial] });
    const space = generateContracts(graph).files.get("orders.create-order.space.ts") ?? "";

    expect(space).toContain('{ spec: "spec:orders.create-order.empty-cart", point: { n: 0 } }');
  });

  it("warns and drops an undeclared slot from the point — loud, never silent (L2)", () => {
    const stray = child(
      {
        given: ["a customer has a cart with {n: 2} line items", "the cart weighs {kg: 3}"],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 100}"],
      },
      "spec:orders.create-order.stray",
    );
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), stray] });
    const generated = generateContracts(graph);
    const undeclared = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.undeclaredSlot,
    );

    expect(undeclared).toHaveLength(1);
    expect(undeclared[0]?.severity).toBe("warning");
    expect(undeclared[0]?.subjectId).toBe("spec:orders.create-order.stray");
    expect(undeclared[0]?.message).toContain('"{kg}"');
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).not.toContain("kg");
  });

  it("warns and drops an off-dimension value; the step contract widens the slot so it still compiles", () => {
    const offUnion = child(
      {
        given: ['every cart item is {availability: "backordered"}'],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 100}"],
      },
      "spec:orders.create-order.off-union",
    );
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), offUnion] });
    const generated = generateContracts(graph);
    const offDimension = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.offDimensionValue,
    );

    // Named twice — once for the point (dropped), once for the contract (widened): each surface
    // degrades independently and each degradation is loud.
    expect(offDimension.length).toBeGreaterThan(0);
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).toContain('{ spec: "spec:orders.create-order.off-union", point: {} }');
    const contract = generated.files.get("orders.create-order.off-union.contract.ts") ?? "";
    expect(contract).toContain(
      'readonly "every cart item is {availability}": { readonly availability: string };',
    );
  });

  it("warns on a conflicting re-binding of one skeleton within one example — first wins (MD-17)", () => {
    const conflicted = child(
      {
        given: [
          "a customer has a cart with {n: 2} line items",
          "a customer has a cart with {n: 3} line items",
        ],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 100}"],
      },
      "spec:orders.create-order.conflicted",
    );
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), conflicted] });
    const generated = generateContracts(graph);

    expect(
      generated.findings.some(
        (finding) => finding.validatorId === contractsFindingIds.conflictingBinding,
      ),
    ).toBe(true);
    const contract = generated.files.get("orders.create-order.conflicted.contract.ts") ?? "";
    // Both occurrences run, both with the first binding ("same words, same meaning").
    expect(contract).toContain("params: { n: 2 }");
    expect(contract).not.toContain("params: { n: 3 }");
  });

  it("warns on a conflicting dimension declaration across vocabulary steps — first wins", () => {
    const conflictingVocabulary = parent({
      given: ["a cart with {n:number} line items", "a batch of {n:string} items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created"],
    });
    const graph = deriveFixtureGraph({ specs: [conflictingVocabulary] });
    const generated = generateContracts(graph);

    expect(
      generated.findings.some(
        (finding) => finding.validatorId === contractsFindingIds.conflictingDimension,
      ),
    ).toBe(true);
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).toContain("readonly n: number;");
  });

  it("binding a Then-vocabulary slot is ordinary (the outcome point) — no undeclared-slot warning", () => {
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), child(BOUND_GWT)] });
    const generated = generateContracts(graph);

    // total is a Then slot, not a dimension: bound in the child, absent from the point, and not
    // warned about.
    expect(generated.findings).toEqual([]);
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).not.toContain("total: 100");
  });

  it("emits nothing over a graph with no example spaces and no bindable examples", () => {
    const graph = deriveFixtureGraph({ specs: [parent()] });

    expect(generateContracts(graph).files.size).toBe(0);
  });
});

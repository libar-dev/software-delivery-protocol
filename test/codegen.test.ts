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

  it("withholds a child contract when its steps drift outside an existing parent vocabulary", () => {
    const staleChild = child({
      ...BOUND_GWT,
      given: [
        "a customer has a basket with {n: 2} line items",
        'every cart item is {availability: "in stock"}',
      ],
    });
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), staleChild] });
    const generated = generateContracts(graph);
    const mismatch = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.unmatchedVocabularyStep,
    );

    expect(mismatch).toHaveLength(1);
    expect(mismatch[0]?.subjectId).toBe("spec:orders.create-order.valid-cart");
    expect(mismatch[0]?.message).toContain('"a customer has a basket with {n} line items"');
    expect(mismatch[0]?.message).toContain('"spec:orders.create-order"');
    expect(generated.files.has("orders.create-order.space.ts")).toBe(true);
    expect(generated.files.has("orders.create-order.valid-cart.contract.ts")).toBe(false);
  });

  it("withholds a child contract when multiple parent spaces type one skeleton incompatibly", () => {
    const otherParent = spec({
      id: specId("spec:orders.create-order-policy"),
      title: "Create-order policy",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Constrain create-order examples." },
      behavior: {
        exampleSpace: {
          ...VOCABULARY,
          given: [
            "a customer has a cart with {n:string} line items",
            'every cart item is {availability:"in stock"|"out of stock"}',
          ],
        },
      },
    });
    const multiParentChild = spec({
      ...child(BOUND_GWT),
      relations: [
        refines(specId("spec:orders.create-order")),
        refines(specId("spec:orders.create-order-policy")),
      ],
    });
    const graph = deriveFixtureGraph({
      specs: [parent(VOCABULARY), otherParent, multiParentChild],
    });
    const generated = generateContracts(graph);
    const mismatch = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.unmatchedVocabularyStep,
    );

    expect(mismatch).toHaveLength(1);
    expect(mismatch[0]?.message).toContain("bind compatibly against");
    expect(mismatch[0]?.message).toContain('"spec:orders.create-order-policy"');
    expect(generated.files.has("orders.create-order.valid-cart.contract.ts")).toBe(false);
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

  it("warns on conflicting declarations of one dimension within a vocabulary step — first wins", () => {
    const conflictingVocabulary = parent({
      given: ["a cart starts with {n:number} items and ends with {n:string} items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created"],
    });
    const graph = deriveFixtureGraph({ specs: [conflictingVocabulary] });
    const generated = generateContracts(graph);
    const conflicts = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.conflictingDimension,
    );

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]?.message).toContain("within one vocabulary step");
    expect(generated.files.get("orders.create-order.space.ts")).toContain("readonly n: number;");
  });

  it("refuses to guess the single-quoted-literal vocabulary form — deferred to the grammar session, loudly", () => {
    // The value-form's vocabulary reading is a grammar-design question the carrier ruling
    // session owns (plan 12's scope ruling: syntax is never ruled in plan 13). Until it rules,
    // the group declares nothing — and warns, so the authored slot never falls out silently.
    const valueFormVocabulary = parent({
      given: ['the payment method is {method: "card"}'],
      when: ["the customer submits the cart for order creation"],
      then: ['order creation is rejected because {reason: "empty cart"}'],
    });
    const graph = deriveFixtureGraph({ specs: [valueFormVocabulary] });
    const generated = generateContracts(graph);
    const warnings = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.untypedVocabularySlot,
    );

    expect(warnings).toHaveLength(2);
    expect(warnings.every((finding) => finding.subjectId === "spec:orders.create-order")).toBe(
      true,
    );
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).not.toContain("method");
    expect(space).toContain('{ readonly kind: "order creation is rejected because {reason}" }');
  });

  it("warns on a vocabulary slot that declares no usable type — an authored slot never falls out silently (L2)", () => {
    const untyped = parent({
      given: ["a cart with {n} line items", "a batch of {count: 5} items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created"],
    });
    const graph = deriveFixtureGraph({ specs: [untyped] });
    const generated = generateContracts(graph);
    const warnings = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.untypedVocabularySlot,
    );

    // The bare {n} and the non-string value form {count: 5} each warn, naming the parent; no
    // dimension enters the space for either.
    expect(warnings).toHaveLength(2);
    expect(warnings.every((finding) => finding.subjectId === "spec:orders.create-order")).toBe(
      true,
    );
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).not.toContain('name: "n"');
    expect(space).not.toContain('name: "count"');
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

  it("derives contract AND point from the first complete entry, and names extra entries (MD-17 made loud)", () => {
    const multi = spec({
      id: specId("spec:orders.create-order.multi"),
      title: "Two cases in one example",
      kind: "example",
      altitude: "story",
      readiness: "defined",
      intent: { outcome: "Two cases smuggled into one example." },
      behavior: {
        examples: [
          // Incomplete (no when): skipped as the point entry in favor of the first COMPLETE one —
          // matching the floor, which also accepts any complete entry.
          { given: ["a customer has a cart with {n: 9} line items"], when: [], then: [] },
          {
            given: ["a customer has a cart with {n: 2} line items"],
            when: ["the customer submits the cart for order creation"],
            then: ["an order is created with total {total: 100}"],
          },
          {
            given: ['every cart item is {availability: "out of stock"}'],
            when: ["the customer submits the cart for order creation"],
            then: ["an order is created with total {total: 0}"],
          },
        ],
      },
      relations: [refines(specId("spec:orders.create-order"))],
    });
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), multi] });
    const generated = generateContracts(graph);

    expect(
      generated.findings.some(
        (finding) =>
          finding.validatorId === contractsFindingIds.multiEntryExample &&
          finding.subjectId === "spec:orders.create-order.multi",
      ),
    ).toBe(true);

    // The contract derives from the first complete entry (n: 2)...
    const contract = generated.files.get("orders.create-order.multi.contract.ts") ?? "";
    expect(contract).toContain("params: { n: 2 }");
    expect(contract).not.toContain("params: { n: 9 }");
    // ...and the point derives from the SAME entry — the third entry's availability binding must
    // not merge in (point and contract can never mix cases).
    const space = generated.files.get("orders.create-order.space.ts") ?? "";
    expect(space).toContain('{ spec: "spec:orders.create-order.multi", point: { n: 2 } }');
  });

  it("warns on a conflicting re-binding of one slot WITHIN a single step text — first wins", () => {
    const withinStep = child(
      {
        given: ["a cart with {n: 2} items and later {n: 3} items in one step"],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created with total {total: 100}"],
      },
      "spec:orders.create-order.within-step",
    );
    const matchingParent = parent({
      ...VOCABULARY,
      given: ["a cart with {n:number} items and later {n:number} items in one step"],
    });
    const graph = deriveFixtureGraph({ specs: [matchingParent, withinStep] });
    const generated = generateContracts(graph);

    expect(
      generated.findings.some(
        (finding) =>
          finding.validatorId === contractsFindingIds.conflictingBinding &&
          finding.message.includes("within one step"),
      ),
    ).toBe(true);
    const contract = generated.files.get("orders.create-order.within-step.contract.ts") ?? "";
    expect(contract).toContain("params: { n: 2 }");
    expect(contract).not.toContain("n: 3");
  });

  it("withholds the contracts tree WHOLE on a case-colliding path — all-or-nothing, never a second gate", () => {
    const lower = child(BOUND_GWT, "spec:orders.create-order.same-case");
    const upper = child(BOUND_GWT, "spec:orders.create-order.same-Case");
    const graph = deriveFixtureGraph({ specs: [parent(VOCABULARY), lower, upper] });
    const generated = generateContracts(graph);
    const collisions = generated.findings.filter(
      (finding) => finding.validatorId === contractsFindingIds.caseCollidingPath,
    );

    expect(collisions).toHaveLength(1);
    expect(collisions[0]?.severity).toBe("warning");
    expect(collisions[0]?.message).toContain("orders.create-order.same-case.contract.ts");
    // Nothing emits: a partial tree missing two owed contracts while reading as current would be
    // its own dishonesty — the artifact is all-or-nothing, and the warning (never a gate) says
    // why it is nothing this build.
    expect(generated.files.size).toBe(0);
  });
});

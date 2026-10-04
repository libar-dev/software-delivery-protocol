import { describe, expect, it } from "vitest";

import {
  ENTRY_ADDRESS_SECTIONS,
  anchorId,
  codeAnchorId,
  componentAnchorId,
  formatId,
  packId,
  parseId,
  ref,
  specId,
  testAnchorId,
} from "../src/index.js";

const validIds = [
  "spec:orders.create-order",
  "spec:orders.create-order#design.validCart",
  "spec:orders.create-order#question.aggregateReach",
  "spec:orders.create-order#question.description",
  "pack:checkout-v1",
  "impl:orders.create-order-use-case",
  "test:orders.create-order.valid-cart",
] as const;

const invalidIds = [
  "orders.create-order",
  "spec:orders..create-order",
  "spec:orders.create order",
  "Spec:orders.create-order",
  "spec:orders.create-order#",
  "spec:orders.create-order#valid-cart",
  "spec:orders.create-order#valid.cart",
] as const;

// The entry-address refusal rows, in the order the parser tries them; the first match wins.
const entryAddressRefusals = [
  [
    "impl:x#design.k",
    "the # sub-part is an entry address and is admitted only in the spec namespace",
  ],
  ["pack:x#", "the # sub-part is an entry address and is admitted only in the spec namespace"],
  ["spec:x#", "malformed # suffix"],
  ["spec:x#a#b", "malformed # suffix"],
  ["spec:x#foo", "entry address must be <section>.<key> with section design, ui, or question"],
  [
    "spec:x#model.foo",
    "entry address must be <section>.<key> with section design, ui, or question",
  ],
  ["spec:x#design", "entry address must be <section>.<key> with section design, ui, or question"],
  ["spec:x#question", "entry address must be <section>.<key> with section design, ui, or question"],
  [
    "spec:x#questions.k",
    "entry address must be <section>.<key> with section design, ui, or question",
  ],
  [
    "spec:x#openQuestions.k",
    "entry address must be <section>.<key> with section design, ui, or question",
  ],
  [
    "spec:orders.create-order#valid-cart",
    "entry address must be <section>.<key> with section design, ui, or question",
  ],
  ["spec:x#design.1", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.Foo", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.a-b", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.a.b", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.éclair", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.café", "entry address key must be lower-camel ASCII"],
  ["spec:x#question.AggregateReach", "entry address key must be lower-camel ASCII"],
  ["spec:x#question.aggregate-reach", "entry address key must be lower-camel ASCII"],
  ["spec:x#question.", "entry address key must be lower-camel ASCII"],
] as const;

/** The complete message a call throws; a substring match would let extra text through. */
function thrownMessage(action: () => unknown): string {
  try {
    action();
  } catch (error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }

  throw new Error("expected the call to throw");
}

describe("ids", () => {
  it.each(validIds)("round-trips %s", (value) => {
    const parsed = parseId(value);

    expect(formatId(parsed)).toBe(value);
  });

  it("preserves the branded spec reference string", () => {
    const id = "spec:orders.create-order.valid-cart";

    expect(ref(id)).toBe(id);
    expect(specId(id)).toBe(id);
  });

  it("brands the required helper namespaces", () => {
    expect(packId("pack:checkout-v1")).toBe("pack:checkout-v1");
    expect(testAnchorId("test:orders.create-order.valid-cart")).toBe(
      "test:orders.create-order.valid-cart",
    );
    expect(anchorId("api:orders.post")).toBe("api:orders.post");
  });

  it("brands every implementation-flavored code namespace through the one codeAnchorId (MD-8)", () => {
    expect(codeAnchorId("impl:orders.create-order-use-case")).toBe(
      "impl:orders.create-order-use-case",
    );
    expect(codeAnchorId("api:orders.post")).toBe("api:orders.post");
    expect(codeAnchorId("component:orders.domain")).toBe("component:orders.domain");
    expect(componentAnchorId("component:orders.domain")).toBe("component:orders.domain");
  });

  it.each(invalidIds)("rejects malformed IDs: %s", (value) => {
    expect(() => parseId(value)).toThrow(value);
  });

  it.each(entryAddressRefusals)("refuses the entry address %s with its reason", (value, reason) => {
    expect(thrownMessage(() => parseId(value))).toBe(`Invalid ID "${value}": ${reason}`);
  });

  it("parses an entry address with its sub-part verbatim", () => {
    expect(parseId("spec:orders.create-order#ui.fnResume")).toEqual({
      namespace: "spec",
      path: "orders.create-order",
      subpath: "ui.fnResume",
    });
  });

  it("names the three sections an entry address may carry", () => {
    expect(ENTRY_ADDRESS_SECTIONS).toEqual(["design", "ui", "question"]);
  });

  it("parses a question address with its key verbatim", () => {
    expect(parseId("spec:orders.create-order#question.aggregateReach")).toEqual({
      namespace: "spec",
      path: "orders.create-order",
      subpath: "question.aggregateReach",
    });
  });

  it("refuses a question address where a Spec id is required", () => {
    expect(thrownMessage(() => ref("spec:x#question.k"))).toBe(
      'Invalid ID "spec:x#question.k": an entry address is not a Spec id',
    );
    expect(thrownMessage(() => codeAnchorId("impl:x#question.k"))).toBe(
      'Invalid ID "impl:x#question.k": the # sub-part is an entry address and is admitted only in the spec namespace',
    );
  });

  it("refuses an entry address where a Spec id is required", () => {
    expect(thrownMessage(() => ref("spec:x#design.k"))).toBe(
      'Invalid ID "spec:x#design.k": an entry address is not a Spec id',
    );
    expect(thrownMessage(() => specId("spec:x#design.k"))).toBe(
      'Invalid ID "spec:x#design.k": an entry address is not a Spec id',
    );
    expect(thrownMessage(() => specId("spec:x#foo"))).toBe(
      'Invalid ID "spec:x#foo": an entry address is not a Spec id',
    );
  });

  it("rejects wrong namespaces in helper branding", () => {
    expect(() => specId("pack:checkout-v1")).toThrow('expected namespace "spec"');
    expect(() => packId("spec:orders.create-order")).toThrow('expected namespace "pack"');
    expect(() => codeAnchorId("test:orders.create-order.valid-cart")).toThrow(
      'expected one of the namespaces "impl" · "api" · "component"',
    );
    expect(() => componentAnchorId("impl:orders.create-order-use-case")).toThrow(
      'expected namespace "component"',
    );
    expect(() => testAnchorId("impl:orders.create-order-use-case")).toThrow(
      'expected namespace "test"',
    );
  });
});

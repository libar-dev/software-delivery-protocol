import { describe, expect, it } from "vitest";

import {
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
  ["spec:x#foo", "entry address must be <section>.<key> with section design or ui"],
  ["spec:x#model.foo", "entry address must be <section>.<key> with section design or ui"],
  ["spec:x#design", "entry address must be <section>.<key> with section design or ui"],
  [
    "spec:orders.create-order#valid-cart",
    "entry address must be <section>.<key> with section design or ui",
  ],
  ["spec:x#design.1", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.Foo", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.a-b", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.a.b", "entry address key must be lower-camel ASCII"],
  ["spec:x#design.", "entry address key must be lower-camel ASCII"],
] as const;

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
    expect(() => parseId(value)).toThrow(`Invalid ID "${value}": ${reason}`);
  });

  it("parses an entry address with its sub-part verbatim", () => {
    expect(parseId("spec:orders.create-order#ui.fnResume")).toEqual({
      namespace: "spec",
      path: "orders.create-order",
      subpath: "ui.fnResume",
    });
  });

  it("refuses an entry address where a Spec id is required", () => {
    expect(() => ref("spec:x#design.k")).toThrow(
      'Invalid ID "spec:x#design.k": an entry address is not a Spec id',
    );
    expect(() => specId("spec:x#design.k")).toThrow(
      'Invalid ID "spec:x#design.k": an entry address is not a Spec id',
    );
    expect(() => specId("spec:x#foo")).toThrow("an entry address is not a Spec id");
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

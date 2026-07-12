import { describe, expect, it } from "vitest";

import {
  anchorId,
  codeAnchorId,
  formatId,
  packId,
  parseId,
  ref,
  specId,
  testAnchorId,
} from "../src/index.js";

const validIds = [
  "spec:orders.create-order",
  "spec:orders.create-order#valid-cart",
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
  "spec:orders.create-order#valid.cart",
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
  });

  it.each(invalidIds)("rejects malformed IDs: %s", (value) => {
    expect(() => parseId(value)).toThrowError(value);
  });

  it("rejects wrong namespaces in helper branding", () => {
    expect(() => specId("pack:checkout-v1")).toThrowError('expected namespace "spec"');
    expect(() => packId("spec:orders.create-order")).toThrowError('expected namespace "pack"');
    expect(() => codeAnchorId("test:orders.create-order.valid-cart")).toThrowError(
      'expected one of the namespaces "impl" · "api" · "component"',
    );
    expect(() => testAnchorId("impl:orders.create-order-use-case")).toThrowError(
      'expected namespace "test"',
    );
  });
});

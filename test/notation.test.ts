import { describe, expect, it } from "vitest";

import {
  boundSlotValues,
  hasUnboundSlot,
  parseSlots,
  renderStepText,
  stepSkeleton,
} from "../src/index.js";

describe("the slot micro-notation — the one owned piece of step-text syntax", () => {
  it("parses the three slot forms: bare, typed (declaration), bound (binding)", () => {
    expect(parseSlots("a cart with {n} line items")).toEqual([
      { form: "bare", name: "n", raw: "{n}" },
    ]);
    expect(parseSlots("a cart with {n:number} line items")).toEqual([
      { form: "typed", name: "n", type: { kind: "number" }, raw: "{n:number}" },
    ]);
    expect(parseSlots("a cart with {n: 2} line items")).toEqual([
      { form: "bound", name: "n", value: 2, raw: "{n: 2}" },
    ]);
  });

  it("parses closed unions as enum declarations, and a single quoted literal as a binding", () => {
    expect(parseSlots('every item is {availability:"in stock"|"out of stock"}')).toEqual([
      {
        form: "typed",
        name: "availability",
        type: { kind: "enum", values: ["in stock", "out of stock"] },
        raw: '{availability:"in stock"|"out of stock"}',
      },
    ]);
    // The single-string form parses as a binding (the example reading). What it means in a
    // vocabulary is the grammar session's to rule — until then a vocabulary consumer treats it
    // as declaring nothing, loudly (contracts/untyped-vocabulary-slot).
    expect(parseSlots('every item is {availability: "in stock"}')).toEqual([
      { form: "bound", name: "availability", value: "in stock", raw: '{availability: "in stock"}' },
    ]);
  });

  it("parses scalar bindings: negative and decimal numbers, booleans", () => {
    expect(parseSlots("{delta: -2.5}")).toEqual([
      { form: "bound", name: "delta", value: -2.5, raw: "{delta: -2.5}" },
    ]);
    expect(parseSlots("{expedited: true}")).toEqual([
      { form: "bound", name: "expedited", value: true, raw: "{expedited: true}" },
    ]);
  });

  it("treats a non-identifier brace group as prose, and an unparsable rhs as a malformed slot", () => {
    // Prose braces (no identifier head) are not slots — checks never police prose.
    expect(parseSlots('a JSON body {"a": 1} goes through')).toEqual([]);
    // An identifier-led group whose rhs is neither type nor value IS a slot — unusable, so it
    // reads as unbound (the conservative, loud direction).
    expect(parseSlots("{n: maybe}")).toEqual([{ form: "malformed", name: "n", raw: "{n: maybe}" }]);
  });

  it("rejects __proto__ as a slot name — a generated object literal would set the prototype, not a property", () => {
    expect(parseSlots("{__proto__: 5}")).toEqual([
      { form: "malformed", name: "__proto__", raw: "{__proto__: 5}" },
    ]);
    // Malformed = unbound: the concreteness law holds an example using it below defined, and the
    // codegen never emits it into a contract.
    expect(hasUnboundSlot("{__proto__: 5}")).toBe(true);
  });

  it("honors quotes during scanning: a brace inside a quoted literal does not close the group", () => {
    expect(parseSlots('{reason:"a}b"|"c"}')).toEqual([
      {
        form: "typed",
        name: "reason",
        type: { kind: "enum", values: ["a}b", "c"] },
        raw: '{reason:"a}b"|"c"}',
      },
    ]);
  });

  it("keeps lexical degradation local: a stray brace or quote never swallows a later binding", () => {
    // An unquoted "{" inside an open group abandons the earlier brace as prose and restarts.
    expect(parseSlots("a stray { then {n: 2} line items")).toEqual([
      { form: "bound", name: "n", value: 2, raw: "{n: 2}" },
    ]);
    // An unterminated quote makes its own group prose — but only up to the next candidate, so
    // the well-formed binding after it still parses (and the concreteness law still sees it).
    expect(parseSlots('{reason:"oops and {n: 2} items')).toEqual([
      { form: "bound", name: "n", value: 2, raw: "{n: 2}" },
    ]);
    expect(hasUnboundSlot('{reason:"oops and {n} items')).toBe(true);
  });

  it("normalizes every slot form to the {name} skeleton — the step's identity", () => {
    expect(stepSkeleton("a cart with {n: 2} line items")).toBe("a cart with {n} line items");
    expect(stepSkeleton("a cart with {n:number} line items")).toBe("a cart with {n} line items");
    expect(stepSkeleton("a cart with {n} line items")).toBe("a cart with {n} line items");
    // The declaration and the binding of the same step share one skeleton — that is what lets an
    // example's step match its vocabulary entry.
    expect(stepSkeleton('every item is {availability:"in stock"|"out of stock"}')).toBe(
      stepSkeleton('every item is {availability: "in stock"}'),
    );
  });

  it("renders natural reading: bound slots read as their value, unbound keep the {name}", () => {
    expect(renderStepText("a cart with {n: 2} line items")).toBe("a cart with 2 line items");
    expect(renderStepText('every item is {availability: "in stock"}')).toBe(
      "every item is in stock",
    );
    expect(renderStepText("a cart with {n:number} line items")).toBe("a cart with {n} line items");
  });

  it("collects bound values first-wins and detects unbound slots", () => {
    expect([...boundSlotValues("{n: 2} and {n: 3} and {q: 1}")]).toEqual([
      ["n", 2],
      ["q", 1],
    ]);
    expect(hasUnboundSlot("a cart with {n: 2} line items")).toBe(false);
    expect(hasUnboundSlot("a cart with {n} line items")).toBe(true);
    expect(hasUnboundSlot("a cart with {n:number} line items")).toBe(true);
    expect(hasUnboundSlot("no slots at all")).toBe(false);
  });
});

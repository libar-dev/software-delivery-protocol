import { expect, test } from "vitest";

import { parseGrammar } from "./grammar-parse.js";

const base = `spec demo.child
  example · story · defined
  refines demo.parent

Demo child

  intent
    outcome: Demonstrate refusal.

  Given a value is {n: 1}
  When it is submitted
  Then it is accepted
`;

test("the grammar subset refuses a second structural example instead of replacing the first", () => {
  expect(() =>
    parseGrammar(`${base}\n  Given another value is {n: 2}\n  When it is submitted\n  Then it is accepted\n`, "duplicate.sdp"),
  ).toThrow(/duplicate example block/u);
});

test("the grammar subset refuses duplicate section blocks instead of last-wins", () => {
  expect(() =>
    parseGrammar(`${base}\n  intent\n    outcome: This must not shadow the first.\n`, "duplicate.sdp"),
  ).toThrow(/duplicate intent block/u);
});

test("repeated relation kinds remain distinct declarations", () => {
  const parsed = parseGrammar(
    base.replace("  refines demo.parent", "  refines demo.parent\n  refines demo.other-parent"),
    "relations.sdp",
  );
  expect(parsed.relations).toEqual([
    { type: "refines", target: "spec:demo.parent" },
    { type: "refines", target: "spec:demo.other-parent" },
  ]);
});

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

test("an exact duplicate relation refuses instead of emitting duplicate edges", () => {
  expect(() =>
    parseGrammar(
      base.replace("  refines demo.parent", "  refines demo.parent\n  refines demo.parent"),
      "relations.sdp",
    ),
  ).toThrow(/duplicate refines relation/u);
});

test("relation targets must be valid ids instead of permissive colon strings", () => {
  expect(() =>
    parseGrammar(base.replace("refines demo.parent", "refines demo.a:b:c"), "target.sdp"),
  ).toThrow(/invalid relation target/u);
});

test("behavior blocks compose without an example space shadowing earlier evidence", () => {
  const parsed = parseGrammar(
    `spec demo.parent
  behavior · feature · defined
  refines demo.root

Demo parent

  intent
    outcome: Preserve every behavior block.

  rule
    Earlier behavior evidence remains visible.

  example space
    Given a value is {n:number}
    When it is submitted
    Then it is accepted
`,
    "behavior.sdp",
  );
  expect(parsed.sections.behavior).toEqual({
    rules: ["Earlier behavior evidence remains visible."],
    exampleSpace: {
      given: ["a value is {n:number}"],
      when: ["it is submitted"],
      then: ["it is accepted"],
    },
  });
});

test("a partial example space reports the vocabulary rule it actually violates", () => {
  expect(() =>
    parseGrammar(
      `${base}\n  example space\n    Given a value is {n:number}\n`,
      "partial-space.sdp",
    ),
  ).toThrow(/an example space needs at least one Given, When, and Then step/u);
});

test("cases must be final so later structural blocks cannot disappear", () => {
  expect(() =>
    parseGrammar(
      `spec demo.cases
  rule · story · defined
  refines demo.parent

Demo cases

  cases
    Given a value is {n}
    When it is submitted
    Then it is accepted

    | point | n |
    | ----- | - |
    | one   | 1 |

  verification executable
    - This block must not disappear.
`,
      "cases.sdp",
    ),
  ).toThrow(/cases must be the final structural block/u);
});

test("a second spec declaration refuses instead of becoming prose", () => {
  expect(() =>
    parseGrammar(
      `${base}\nspec demo.other\n  example · story · idea\n  refines demo.parent\n\nOther\n`,
      "two-specs.sdp",
    ),
  ).toThrow(/one spec per file/u);
});

test("a second spec glued to prose refuses before the paragraph can absorb it", () => {
  expect(() =>
    parseGrammar(
      `spec demo.first
  example · story · idea
  refines demo.parent

First

Some prose.
spec demo.other
  intent
    outcome: This must not be attributed to the first Spec.
`,
      "glued-spec.sdp",
    ),
  ).toThrow(/one spec per file; a second spec declaration is not prose/u);
});

test("step phases refuse regression instead of canonicalizing malformed order", () => {
  expect(() =>
    parseGrammar(
      base.replace(
        "  Then it is accepted",
        "  Then it is accepted\n  Given a late precondition is true",
      ),
      "interleaved.sdp",
    ),
  ).toThrow(/Given may not appear after then/u);
});

test("duplicate example-space and verification blocks refuse by structural identity", () => {
  const space = `
  example space
    Given a value is {n:number}
    When it is submitted
    Then it is accepted
`;
  const parent = `spec demo.parent
  behavior · feature · defined
  refines demo.root

Demo parent

  intent
    outcome: Demonstrate structural refusal.
${space}`;
  expect(() => parseGrammar(`${parent}${space}`, "spaces.sdp")).toThrow(
    /duplicate example space block/u,
  );

  expect(() =>
    parseGrammar(
      `${base}\n  verification manual\n    - First mode.\n\n  verification executable\n    - Second mode.\n`,
      "verification.sdp",
    ),
  ).toThrow(/duplicate verification block/u);
});

test("the descriptor line refuses a second declaration with an honest message", () => {
  expect(() =>
    parseGrammar(
      base.replace(
        "  example · story · defined",
        "  example · story · defined\n  example · story · ready",
      ),
      "descriptor.sdp",
    ),
  ).toThrow(/descriptor line may be declared only once/u);
});

test("unknown descriptor and relation words refuse at the envelope", () => {
  expect(() =>
    parseGrammar(
      base.replace("example · story · defined", "examle · story · defined"),
      "kind.sdp",
    ),
  ).toThrow(/unknown kind/u);
  expect(() =>
    parseGrammar(base.replace("refines demo.parent", "refinez demo.parent"), "relation.sdp"),
  ).toThrow(/unknown relation/u);
});

test("verification modes are closed to the typed section vocabulary", () => {
  expect(() =>
    parseGrammar(`${base}\n  verification magical\n    - Unknown mode.\n`, "mode.sdp"),
  ).toThrow(/unknown verification mode/u);
});

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { emitMarkdownSpec } from "../src/import/emit-markdown.js";
import type { ReifiedSpec } from "../src/extract/reify.js";

const checkoutSpecPaths = [
  "orders/create-order.sdp.md",
  "orders/order-placement-flow.sdp.md",
  "orders/create-order-valid-cart.sdp.md",
  "orders/create-order-invalid-cart.sdp.md",
  "orders/create-order-api-contract.sdp.md",
  "orders/order-model.sdp.md",
  "orders/order-total-rule.sdp.md",
  "orders/order-inventory-rule.sdp.md",
  "orders/order-latency-constraint.sdp.md",
  "orders/order-management.sdp.md",
  "decisions/order-lifecycle.sdp.md",
] as const;
const checkoutSpecRoot = new URL("../examples/checkout-v1/specs/", import.meta.url);

function reifiedSpec(data: Record<string, unknown>): ReifiedSpec {
  return {
    data: {
      id: "spec:import.emitter",
      kind: "behavior",
      altitude: "story",
      readiness: "idea",
      title: "Emit a Markdown carrier",
      relations: [],
      ...data,
    },
    id: "spec:import.emitter",
    file: "source.sdp.ts",
    line: 1,
  };
}

function expectMarkdownRoundTrip(source: ReifiedSpec): string {
  const emitted = emitMarkdownSpec(source);
  const result = reifyMarkdownCarrier(emitted, "emitted.sdp.md");

  expect(result.findings).toEqual([]);
  expect(result.specs[0]?.data).toEqual(source.data);
  return emitted;
}

describe("emitMarkdownSpec", () => {
  it("emits the empty envelope and maps title to the H1", () => {
    const emitted = emitMarkdownSpec(reifiedSpec({}));

    expect(emitted).toBe(`---
id: spec:import.emitter
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Emit a Markdown carrier
`);
  });

  it("round trips envelope data and narrative through the Markdown carrier", () => {
    const source = reifiedSpec({
      narrative: "The emitted document preserves author-owned prose.",
      relations: [{ type: "refines", target: "spec:import.parent", claim: "declared" }],
    });
    const emitted = emitMarkdownSpec(source);
    const result = reifyMarkdownCarrier(emitted, "emitted.sdp.md");

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toEqual(source.data);
    expect(emitted).toContain(
      "# Emit a Markdown carrier\n\nThe emitted document preserves author-owned prose.\n",
    );
    expect(emitted).not.toContain("title:");
    expect(emitted).not.toContain("narrative:");
  });

  it("emits Intent prose, fields, repeated entries, and owned open questions", () => {
    const source = reifiedSpec({
      intent: {
        description: "Intent prose belongs under Intent.",
        actor: "An author",
        problem: "Prose lacks a home.",
        outcome: "Each prose edge has an owner.",
        value: "The graph stays unambiguous.",
        risks: ["A dropped field.", "An ambiguous paragraph."],
        assumptions: ["The parser owns validation."],
        openQuestions: [
          { question: "Is the section complete?", blocking: true },
          { question: "Should we add another example?", blocking: false },
        ],
      },
    });

    const emitted = expectMarkdownRoundTrip(source);

    expect(emitted).toContain("## Intent\n\nIntent prose belongs under Intent.");
    expect(emitted).toContain("### Open questions\n\n- [blocking] Is the section complete?");
  });

  it.each([
    [
      "Behavior",
      {
        behavior: {
          description: "Behavior prose.",
          rules: ["A behavior rule."],
          flows: ["A behavior flow."],
        },
      },
      "## Behavior\n\nBehavior prose.\n\n- rule: A behavior rule.\n- flow: A behavior flow.",
    ],
    [
      "Rule",
      { kind: "rule", behavior: { rules: ["A plain rule."] } },
      "## Rule\n\n- A plain rule.",
    ],
    [
      "Workflow",
      { kind: "workflow", behavior: { rules: ["A workflow rule."], flows: ["A plain flow."] } },
      "## Workflow\n\n- A plain flow.\n- rule: A workflow rule.",
    ],
    [
      "Contract",
      { kind: "contract", behavior: { rules: ["A contract entry."] } },
      "## Contract\n\n- A contract entry.",
    ],
  ] as const)("emits the %s form in ruled list syntax", (_, data, expected) => {
    expect(expectMarkdownRoundTrip(reifiedSpec(data))).toContain(expected);
  });

  it("emits example-space vocabulary and one immediately-owned example GWT fence", () => {
    const space = reifiedSpec({
      behavior: {
        description: "Vocabulary prose.",
        exampleSpace: Object.fromEntries([
          ["given", ["a cart has {count:number} items"]],
          ["when", ["the customer submits the cart"]],
          ["t" + "hen", ["an order has {total:number}"]],
        ]),
      },
    });
    const example = reifiedSpec({
      kind: "example",
      intent: { outcome: "Exercise one bound point." },
      behavior: {
        examples: [
          Object.fromEntries([
            ["given", ["a cart has {count: 0} items"]],
            ["when", ["the customer submits the cart"]],
            ["t" + "hen", ["an order has {total: 0}"]],
          ]),
        ],
      },
    });

    const spaceEmitted = expectMarkdownRoundTrip(space);
    const exampleEmitted = expectMarkdownRoundTrip(example);

    expect(spaceEmitted).toContain("## Example space\n\nVocabulary prose.\n\n```gwt-vocabulary");
    expect(exampleEmitted).toContain("- outcome: Exercise one bound point.\n\n```gwt");
    expect(exampleEmitted.match(/```gwt\n/gu)).toHaveLength(1);
  });

  it("emits the one-entry Constraints form and preserves parser refusal without its statement", () => {
    const emitted = expectMarkdownRoundTrip(
      reifiedSpec({
        constraints: [
          {
            statement: "The output stays deterministic.",
            flavor: "quality",
            target: "bytes",
            measurableBy: "a clean check",
          },
        ],
      }),
    );
    const refused = reifyMarkdownCarrier(
      emitted.replace("- statement: The output stays deterministic.\n", ""),
      "refused.sdp.md",
    );

    expect(emitted).toContain("## Constraints\n\n- statement: The output stays deterministic.");
    expect(refused.specs).toEqual([]);
    expect(refused.findings).toContainEqual(
      expect.objectContaining({ validatorId: "extract/invalid-markdown-structure" }),
    );
  });

  it("emits Model, Design, UI, Decision, and Verification owners in authored order", () => {
    const source = reifiedSpec({
      model: { description: "Model prose.", terms: { Cart: "A cart.", Order: "An order." } },
      design: { description: "Design prose.", firstChoice: "Start.", secondChoice: "Continue." },
      ui: { description: "UI prose.", primaryAction: "Submit.", errorState: "Explain." },
      decision: {
        description: "Decision prose.",
        context: "Owners are needed.",
        decision: "Emit once.",
        rationale: ["The grammar is frozen."],
        alternatives: ["Invent a section."],
        consequences: ["Output is deterministic."],
      },
      verification: {
        description: "Verification prose.",
        mode: "contract",
        criteria: ["The document reifies."],
      },
    });

    const emitted = expectMarkdownRoundTrip(source);

    for (const heading of ["Model", "Design", "UI", "Decision", "Verification — contract"])
      expect(emitted).toContain(`## ${heading}`);
  });

  it("round trips all eleven migrated checkout Specs through the emitter", () => {
    for (const path of checkoutSpecPaths) {
      const source = readFileSync(fileURLToPath(new URL(path, checkoutSpecRoot)), "utf8");
      const markdown = reifyMarkdownCarrier(source, path);
      const spec = markdown.specs[0];

      expect(markdown.findings).toEqual([]);
      expect(spec).toBeDefined();
      if (spec !== undefined) expectMarkdownRoundTrip(spec);
    }
  });

  it("groups relation records in ruled key order and emits multiple targets as a sequence", () => {
    const emitted = emitMarkdownSpec(
      reifiedSpec({
        relations: [
          { type: "verifies", target: "spec:import.verifier", claim: "declared" },
          { type: "dependsOn", target: "spec:import.first-dependency", claim: "declared" },
          { type: "refines", target: "spec:import.parent", claim: "declared" },
          { type: "dependsOn", target: "spec:import.second-dependency", claim: "declared" },
          { type: "supersedes", target: "spec:import.previous", claim: "declared" },
          { type: "constrainedBy", target: "spec:import.constraint", claim: "declared" },
          { type: "decidedBy", target: "spec:import.decision", claim: "declared" },
        ],
      }),
    );

    expect(emitted).toContain(`relations:
  refines: spec:import.parent
  dependsOn:
    - spec:import.first-dependency
    - spec:import.second-dependency
  constrainedBy: spec:import.constraint
  decidedBy: spec:import.decision
  verifies: spec:import.verifier
  supersedes: spec:import.previous
`);
    expect(emitMarkdownSpec(reifiedSpec({ relations: [] }))).toBe(
      emitMarkdownSpec(reifiedSpec({ relations: [] })),
    );
  });

  it("is refused when a valid emitted relation key is hand-corrupted", () => {
    const emitted = emitMarkdownSpec(
      reifiedSpec({
        relations: [{ type: "dependsOn", target: "spec:import.dependency", claim: "declared" }],
      }),
    );
    const corrupted = emitted.replace("  dependsOn:", "  invalidRelation:");
    const result = reifyMarkdownCarrier(corrupted, "corrupted.sdp.md");

    expect(result.specs).toEqual([]);
    expect(result.findings).toContainEqual(
      expect.objectContaining({ validatorId: "extract/invalid-frontmatter" }),
    );
  });
});

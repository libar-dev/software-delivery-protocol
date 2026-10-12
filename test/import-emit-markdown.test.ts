import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { reifyTypeScriptCarrier } from "../src/extract/carrier.js";
import { emitMarkdownSpec } from "../src/import/emit-markdown.js";
import { assertMarkdownEmissionFidelity } from "../src/import/markdown-fidelity.js";
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
  it.each([
    {
      kind: "behavior",
      body: 'flows: ["[#flow] Flow."], rules: ["[#rule] Rule."]',
      keys: ["flow", "rule"],
    },
    {
      kind: "workflow",
      body: 'rules: ["[#rule] Rule."], flows: ["[#flow] Flow."]',
      keys: ["rule", "flow"],
    },
  ])(
    "preserves TypeScript $kind rule-key order through Markdown import",
    ({ kind, body, keys }) => {
      const result = reifyTypeScriptCarrier(
        `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const probe = spec({id: specId("spec:import.order"), title: "Ordered keys", kind: "${kind}", altitude: "story", readiness: "idea", behavior: {${body}}});`,
        "probe.sdp.ts",
      );
      expect(result.findings).toEqual([]);
      const source = result.specs[0];
      if (!source) throw new Error("missing TypeScript Spec");
      const original = source.data.behavior as { ruleKeys: Record<string, string> };
      expect(Object.keys(original.ruleKeys)).toEqual(keys);
      const markdown = reifyMarkdownCarrier(emitMarkdownSpec(source), "probe.sdp.md");
      expect(markdown.findings).toEqual([]);
      const imported = markdown.specs[0]?.data.behavior as { ruleKeys: Record<string, string> };
      expect(Object.keys(imported.ruleKeys)).toEqual(keys);
      expect(imported).toEqual(original);
    },
  );

  it("preserves unkeyed list order around keyed entries from both lists", () => {
    const source = reifiedSpec({
      behavior: {
        rules: ["Before rule.", "Rule.", "After rule."],
        flows: ["Before flow.", "Flow.", "After flow."],
        ruleKeys: { flow: "flows[1]", rule: "rules[1]" },
      },
    });
    const document = expectMarkdownRoundTrip(source);
    const behavior = reifyMarkdownCarrier(document, "probe.sdp.md").specs[0]?.data.behavior as {
      ruleKeys: Record<string, string>;
    };
    expect(Object.keys(behavior.ruleKeys)).toEqual(["flow", "rule"]);
    expect(document.indexOf("[#flow]")).toBeLessThan(document.indexOf("[#rule]"));
  });

  it("refuses a Markdown twin that only reorders rule keys", () => {
    const source = reifiedSpec({
      behavior: {
        rules: ["Rule."],
        flows: ["Flow."],
        ruleKeys: { rule: "rules[0]", flow: "flows[0]" },
      },
    });
    const reordered = emitMarkdownSpec(source).replace(
      "- rule: [#rule] Rule.\n- flow: [#flow] Flow.",
      "- flow: [#flow] Flow.\n- rule: [#rule] Rule.",
    );
    expect(() => {
      assertMarkdownEmissionFidelity(source, reordered);
    }).toThrow(/behavior\.ruleKeys/u);
  });

  it("emits a bare typed heading in scaffold mode without inventing content", () => {
    const emitted = emitMarkdownSpec(
      reifiedSpec({
        kind: "rule",
        intent: { outcome: "Probe" },
      }),
      { scaffold: true },
    );

    expect(emitted).toBe(`---
id: spec:import.emitter
kind: rule
altitude: story
readiness: idea
relations: {}
---
# Emit a Markdown carrier

## Intent

- outcome: Probe

## Rule
`);
    expect(
      emitMarkdownSpec(reifiedSpec({ kind: "rule", intent: { outcome: "Probe" } })),
    ).not.toContain("## Rule");
  });

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

  it("writes a keyed question's key after its flag and leaves an unkeyed marker as it was", () => {
    const source = reifiedSpec({
      intent: {
        outcome: "Each question keeps its key.",
        openQuestions: [
          {
            question: "Does the owner widen the aggregate?",
            blocking: true,
            key: "aggregateReach",
          },
          { question: "Is the name final?", blocking: false },
          { question: "Where does the page live?", blocking: false, key: "pageHome" },
        ],
      },
    });

    const emitted = expectMarkdownRoundTrip(source);

    expect(emitted).toContain(
      [
        "### Open questions",
        "",
        "- [blocking #aggregateReach] Does the owner widen the aggregate?",
        "- [non-blocking] Is the name final?",
        "- [non-blocking #pageHome] Where does the page live?",
      ].join("\n"),
    );
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
          ["then", ["an order has {total:number}"]],
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
            ["then", ["an order has {total: 0}"]],
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

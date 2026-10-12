import { describe, expect, it } from "vitest";
import { reifyTypeScriptCarrier } from "../src/extract/carrier.js";
import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { deriveGraph } from "../src/extract/derive.js";
import { serializeGraph } from "../src/extract/serialize.js";
import { importTypeScriptSpec } from "../src/import/import.js";
import { createReader } from "../src/reader/reader.js";
import { validateGraph } from "../src/validate/validators.js";
import { renderDesignReview } from "../src/projections/design-review.js";
import {
  dependsOn,
  refines,
  constrainedBy,
  decidedBy,
  verifies,
  supersedes,
} from "../src/model/relations.js";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import type { CarrierReification } from "../src/extract/carrier.js";
import type { GraphSchema } from "../src/graph/schema.js";

const grammarTestAnchor = specTest({
  id: testAnchorId("test:protocol.authoring-grammar"),
  label: "checks rule keys, question fields and relation reasons across the carriers",
  verifies: [
    ref("spec:model.rule-keys"),
    ref("spec:model.open-question-fields"),
    ref("spec:model.relation-reasons"),
  ],
});
void grammarTestAnchor;

const tsImports =
  'import {spec, specId, ref, refines, dependsOn, constrainedBy, decidedBy, verifies, supersedes} from "@libar-dev/software-delivery-protocol";';
function tsSpec(fields: string, kind = "behavior", id = "probe.parent"): string {
  return `${tsImports}\nexport const probe = spec({id: specId("spec:${id}"), title: "Probe", kind: "${kind}", altitude: "story", readiness: "idea", intent: {outcome: "Probe"}, ${fields}});`;
}
function mdSpec(body: string, kind = "behavior", relations = "{}", id = "probe.parent"): string {
  return `---\nid: spec:${id}\nkind: ${kind}\naltitude: story\nreadiness: idea\nrelations: ${relations}\n---\n# Probe\n\n${body}\n`;
}
function gherkin(rules: readonly string[], tags = "", featureTags = ""): string {
  return `@spec.probe.parent @altitude.story @readiness.idea ${featureTags}\nFeature: Probe\n  - outcome: Probe\n\n  @spec.probe.example @altitude.story @readiness.idea ${tags}\n  Scenario: One point\n    Given a point\n    When invoked\n    Then returned\n\n${rules.map((text) => `  Rule: ${text}`).join("\n")}\n`;
}
function graphOf(...results: CarrierReification[]): GraphSchema {
  for (const result of results) expect(result.findings).toEqual([]);
  return deriveGraph(
    results.flatMap((result) => result.specs),
    results.flatMap((result) => result.packs),
    [],
  );
}
function ruleResult(carrier: string, rules: readonly string[]): CarrierReification {
  if (carrier === "TypeScript")
    return reifyTypeScriptCarrier(
      tsSpec(`behavior: {rules: ${JSON.stringify(rules)}}`),
      "probe.sdp.ts",
    );
  if (carrier === "Gherkin") return reifyGherkinCarrier(gherkin(rules), "probe.sdp.gherkin");
  return reifyMarkdownCarrier(
    mdSpec(`## Rule\n${rules.map((rule) => `- ${rule}`).join("\n")}`, "rule"),
    "probe.sdp.md",
  );
}

describe("rule keys", () => {
  it.each(["TypeScript", "Markdown", "Gherkin"])(
    "normalizes %s keys and locates keyed and unkeyed rules",
    (carrier) => {
      const graph = graphOf(
        ruleResult(carrier, [
          "[#firstRule] First text.",
          "Unkeyed text.",
          "[#description] Third text.",
          "A later [#plain] marker.",
        ]),
      );
      const parent = createReader(graph).specContext("spec:probe.parent");
      expect(parent?.sections?.behavior).toEqual({
        rules: ["First text.", "Unkeyed text.", "Third text.", "A later [#plain] marker."],
        ruleKeys: { firstRule: "rules[0]", description: "rules[2]" },
      });
      expect(parent?.entryLocations.filter((row) => row.entry.startsWith("rule["))).toEqual([
        expect.objectContaining({
          entry: "rule[0]",
          key: "firstRule",
          line: expect.any(Number) as unknown,
        }),
        expect.objectContaining({ entry: "rule[1]", line: expect.any(Number) as unknown }),
        expect.objectContaining({
          entry: "rule[2]",
          key: "description",
          line: expect.any(Number) as unknown,
        }),
        expect.objectContaining({ entry: "rule[3]", line: expect.any(Number) as unknown }),
      ]);
      expect(parent?.entryLocations[1]).not.toHaveProperty("key");
      expect(JSON.parse(serializeGraph(graph))).toMatchObject({
        nodes: expect.arrayContaining([
          expect.objectContaining({
            sections: expect.objectContaining({ behavior: parent?.sections?.behavior }) as unknown,
          }),
        ]) as unknown,
      });
    },
  );
  it.each(["Behavior", "Rule", "Workflow", "Contract"])(
    "accepts keys on every %s entry",
    (owner) => {
      const items =
        owner === "Behavior"
          ? "- flow: [#firstFlow] First flow.\n- rule: [#firstRule] First rule."
          : owner === "Workflow"
            ? "- [#firstFlow] First flow.\n- rule: [#firstRule] First rule."
            : "- [#firstRule] First rule.";
      const graph = graphOf(reifyMarkdownCarrier(mdSpec(`## ${owner}\n${items}`), "probe.sdp.md"));
      expect(
        createReader(graph).specContext("spec:probe.parent")?.sections?.behavior?.ruleKeys,
      ).toEqual(
        owner === "Behavior" || owner === "Workflow"
          ? { firstFlow: "flows[0]", firstRule: "rules[0]" }
          : { firstRule: "rules[0]" },
      );
    },
  );
  it("keeps the TypeScript field order when it keys flows and rules", () => {
    const graph = graphOf(
      reifyTypeScriptCarrier(
        tsSpec('behavior: {flows: ["[#flowFirst] Flow."], rules: ["[#ruleNext] Rule."]}'),
        "probe.sdp.ts",
      ),
    );
    expect(
      Object.keys(
        createReader(graph).specContext("spec:probe.parent")?.sections?.behavior?.ruleKeys ?? {},
      ),
    ).toEqual(["flowFirst", "ruleNext"]);
  });
  it.each(["TypeScript", "Markdown", "Gherkin"])("reports every repeated key in %s", (carrier) => {
    const result = ruleResult(carrier, ["[#same] First text.", "[#same] Second text."]);
    expect(result.findings).toHaveLength(2);
    expect(
      result.findings.every(
        (finding) => finding.severity === "error" && finding.line !== undefined,
      ),
    ).toBe(true);
  });
  it("reports duplicate keys across rules and flows at both sites", () => {
    const result = reifyMarkdownCarrier(
      mdSpec("## Behavior\n- rule: [#same] Rule.\n- flow: [#same] Flow."),
      "probe.sdp.md",
    );
    expect(result.findings.map((finding) => finding.line)).toEqual([11, 12]);
  });
  it.each([
    "[#Bad] Text.",
    "[#bad-key] Text.",
    "[#] Text.",
    "[#key]Text.",
    "[#key]  Text.",
    "[#key] ",
  ])("refuses malformed marker %s in all carriers", (rule) => {
    for (const carrier of ["TypeScript", "Markdown", "Gherkin"]) {
      const result = ruleResult(carrier, [rule]);
      expect(
        result.findings.some(
          (finding) => finding.severity === "error" && finding.line !== undefined,
        ),
      ).toBe(true);
    }
  });
  it("omits ruleKeys when no rule is keyed and keeps Design Review rule text unchanged", () => {
    const plain = graphOf(
      reifyMarkdownCarrier(mdSpec("## Rule\n- First text.", "rule"), "probe.sdp.md"),
    );
    const keyed = graphOf(
      reifyMarkdownCarrier(mdSpec("## Rule\n- [#first] First text.", "rule"), "probe.sdp.md"),
    );
    expect(
      createReader(plain).specContext("spec:probe.parent")?.sections?.behavior,
    ).not.toHaveProperty("ruleKeys");
    expect(renderDesignReview(createReader(keyed))).toEqual(
      renderDesignReview(createReader(plain)),
    );
  });
});

describe("relation attributes", () => {
  it.each([refines, dependsOn, constrainedBy, decidedBy, verifies, supersedes])(
    "carries an optional runtime reason",
    (builder) => {
      expect(builder(ref("spec:probe.parent"), { reason: "Shapes the caller." })).toMatchObject({
        target: "spec:probe.parent",
        claim: "declared",
        reason: "Shapes the caller.",
      });
      expect(builder(ref("spec:probe.parent"))).not.toHaveProperty("reason");
    },
  );
  it("carries exercises only from a declared verifies relation", () => {
    expect(
      verifies(ref("spec:probe.parent"), { reason: "Checks this rule.", exercises: ["first"] }),
    ).toEqual({
      type: "verifies",
      target: "spec:probe.parent",
      claim: "declared",
      reason: "Checks this rule.",
      exercises: ["first"],
    });
    const parent = reifyMarkdownCarrier(
      mdSpec("## Rule\n- [#first] First text.", "rule"),
      "parent.sdp.md",
    );
    const example = reifyMarkdownCarrier(
      mdSpec(
        "## Intent\n- outcome: Exercise a rule.",
        "example",
        '{verifies: {target: spec:probe.parent, reason: "Checks this rule.", exercises: [first]}}',
        "probe.example",
      ),
      "example.sdp.md",
    );
    const graph = graphOf(parent, example);
    expect(graph.edges).toEqual([
      {
        from: "spec:probe.example",
        type: "verifies",
        to: "spec:probe.parent",
        claim: "declared",
        reason: "Checks this rule.",
        exercises: ["first"],
      },
    ]);
    expect(createReader(graph).specContext("spec:probe.parent")?.relationsIn[0]).toMatchObject({
      reason: "Checks this rule.",
      exercises: ["first"],
    });
    expect(createReader(graph).specContext("spec:probe.example")?.relationsOut[0]).toMatchObject({
      reason: "Checks this rule.",
      exercises: ["first"],
    });
    expect(JSON.parse(serializeGraph(graph))).toMatchObject({ edges: graph.edges });
    expect(
      validateGraph(graph).findings.filter(
        (finding) => finding.validatorId === "conformance/rule-exercises",
      ),
    ).toEqual([]);
    const renamed = {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeType === "Primitive" && node.id === "spec:probe.parent"
          ? {
              ...node,
              sections: {
                behavior: { rules: ["First text."], ruleKeys: { renamed: "rules[0]" as const } },
              },
            }
          : node,
      ),
    };
    expect(
      validateGraph(renamed).findings.filter(
        (finding) => finding.validatorId === "conformance/rule-exercises",
      ),
    ).toEqual([
      expect.objectContaining({ severity: "error", line: 6, relatedId: "spec:probe.parent" }),
    ]);
  });
  it("accepts mixed Markdown target forms and TypeScript second arguments", () => {
    const md = reifyMarkdownCarrier(
      mdSpec(
        "## Intent\n- outcome: Probe.",
        "behavior",
        '{dependsOn: [spec:probe.first, {target: spec:probe.second, reason: "Needs its output."}]}',
      ),
      "probe.sdp.md",
    );
    const ts = reifyTypeScriptCarrier(
      tsSpec(
        'relations: [dependsOn(ref("spec:probe.first")), dependsOn(ref("spec:probe.second"), {reason: "Needs its output."})]',
      ),
      "probe.sdp.ts",
    );
    expect(md.findings).toEqual([]);
    expect(ts.findings).toEqual([]);
    expect(md.specs[0]?.data.relations).toEqual(ts.specs[0]?.data.relations);
  });
  it.each([
    '{reason: ""}',
    '{reason: "one\\ntwo"}',
    '{strength: "hard"}',
    '{exercises: ["first"]}',
  ])("refuses invalid relation options %s", (options) => {
    const result = reifyTypeScriptCarrier(
      tsSpec(`relations: [dependsOn(ref("spec:probe.parent"), ${options})]`),
      "probe.sdp.ts",
    );
    expect(result.findings.some((finding) => finding.severity === "error")).toBe(true);
    expect(result.specs).toEqual([]);
  });
  it.each([
    '{reason: ""}',
    '{reason: "one\\ntwo"}',
    '{aspect: "shape"}',
    "{exercises: [first]}",
    '{target: spec:probe.parent, reason: "x"}',
  ])("refuses invalid Markdown relation options %s", (options) => {
    const result = reifyMarkdownCarrier(
      mdSpec(
        "## Intent\n- outcome: Probe.",
        "behavior",
        `{dependsOn: {target: spec:probe.parent, ${options.slice(1, -1)}}}`,
      ),
      "probe.sdp.md",
    );
    expect(result.findings.some((finding) => finding.severity === "error")).toBe(true);
  });
  it.each(["[]", '["first", "first"]', '["Bad"]', '"first"'])(
    "refuses malformed exercises %s",
    (keys) => {
      expect(
        reifyTypeScriptCarrier(
          tsSpec(`relations: [verifies(ref("spec:probe.parent"), {exercises: ${keys}})]`),
          "probe.sdp.ts",
        ).findings.some((finding) => finding.severity === "error"),
      ).toBe(true);
    },
  );
  it("refuses a duplicate target across plain and object forms", () => {
    expect(
      reifyMarkdownCarrier(
        mdSpec(
          "## Intent\n- outcome: Probe.",
          "behavior",
          '{dependsOn: [spec:probe.parent, {target: spec:probe.parent, reason: "Repeated."}]}',
        ),
        "probe.sdp.md",
      ).findings.some((finding) => finding.message.includes("duplicate target")),
    ).toBe(true);
    expect(
      reifyTypeScriptCarrier(
        tsSpec(
          'relations: [dependsOn(ref("spec:probe.parent")), dependsOn(ref("spec:probe.parent"), {reason: "Repeated."})]',
        ),
        "probe.sdp.ts",
      ).findings.some((finding) => finding.message.includes("duplicate target")),
    ).toBe(true);
  });
  it("maps Gherkin exercises to the default or explicit verified target", () => {
    for (const tags of ["@exercises.first", "@verifies.spec:probe.parent @exercises.first"]) {
      const graph = graphOf(
        reifyGherkinCarrier(gherkin(["[#first] First text."], tags), "probe.sdp.gherkin"),
      );
      expect(graph.edges.find((edge) => edge.type === "verifies")).toMatchObject({
        to: "spec:probe.parent",
        exercises: ["first"],
      });
    }
  });
  it.each([
    "@exercises.Bad",
    "@exercises.first @exercises.first",
    "@exercises.first @verifies.spec:probe.parent @verifies.spec:probe.other",
  ])("refuses invalid Gherkin exercises %s", (tags) => {
    const result = reifyGherkinCarrier(
      gherkin(["[#first] First text."], tags),
      "probe.sdp.gherkin",
    );
    expect(result.specs).toEqual([]);
    expect(result.findings.some((finding) => finding.severity === "error")).toBe(true);
  });
  it("refuses Gherkin exercises on a Feature or example space", () => {
    expect(
      reifyGherkinCarrier(
        gherkin(["[#first] First text."], "", "@exercises.first"),
        "probe.sdp.gherkin",
      ).specs,
    ).toEqual([]);
    expect(
      reifyGherkinCarrier(gherkin([], "@example-space @exercises.first"), "probe.sdp.gherkin")
        .specs,
    ).toEqual([]);
  });
});

describe("grammar boundary checks", () => {
  it("refuses Gherkin exercises on an otherwise lawful example-space scenario", () => {
    const source = `@spec.probe.parent @altitude.story @readiness.idea
Feature: Probe
  @example-space @exercises.first
  Scenario: Vocabulary
    Given a point
    When invoked
    Then returned
  Rule: [#first] First text.
`;
    const result = reifyGherkinCarrier(source, "probe.sdp.gherkin");
    expect(result.specs).toEqual([]);
    expect(
      result.findings.some(
        (finding) => finding.message.includes("exercises") && finding.line === 3,
      ),
    ).toBe(true);
  });
  it.each(["@exercises", "@exercise.first"])(
    "refuses a malformed or near-miss exercises tag %s",
    (tag) => {
      const result = reifyGherkinCarrier(
        gherkin(["[#first] First text."], tag),
        "probe.sdp.gherkin",
      );
      expect(result.findings.some((finding) => finding.message.includes("exercises"))).toBe(true);
      expect(result.specs).toEqual([]);
    },
  );
  it("keeps the carrier finding caps after common normalization", () => {
    const rules = Array.from({ length: 110 }, () => "[#Bad] Malformed.");
    for (const carrier of ["Markdown", "Gherkin"]) {
      const result = ruleResult(carrier, rules);
      expect(result.findings).toHaveLength(100);
      expect(result.specs).toEqual([]);
    }
  });
  it("keeps relation finding lines after serialization reorders edges", () => {
    const parent = reifyMarkdownCarrier(
      mdSpec("## Rule\n- [#first] First text.", "rule"),
      "parent.sdp.md",
    );
    const example = reifyMarkdownCarrier(
      mdSpec(
        "## Intent\n- outcome: Probe.",
        "example",
        "\n  verifies: {target: spec:probe.parent, exercises: [missing]}\n  dependsOn: spec:probe.parent",
        "probe.example",
      ),
      "example.sdp.md",
    );
    const graph = graphOf(parent, example);
    const serialized = JSON.parse(serializeGraph(graph)) as GraphSchema;
    for (const input of [graph, serialized]) {
      const finding = validateGraph(input).findings.find(
        (row) => row.validatorId === "conformance/rule-exercises",
      );
      expect(finding?.line).toBe(7);
    }
  });
  it("refuses exercises on an anchored verifies edge", () => {
    const graph = graphOf(ruleResult("Markdown", ["[#first] First text."]));
    const input: GraphSchema = {
      ...graph,
      nodes: [
        ...graph.nodes,
        { id: "test:probe", nodeType: "Anchor", claim: "anchored", file: "probe.test.ts", line: 1 },
      ],
      edges: [
        {
          from: "test:probe",
          type: "verifies",
          to: "spec:probe.parent",
          claim: "anchored",
          exercises: ["first"],
        },
      ],
    };
    expect(
      validateGraph(input).findings.filter(
        (finding) => finding.validatorId === "conformance/rule-exercises",
      ),
    ).toHaveLength(1);
  });
  it("refuses an unknown relation property even when its name is inherited", () => {
    const result = reifyMarkdownCarrier(
      mdSpec(
        "## Intent\n- outcome: Probe.",
        "behavior",
        "{dependsOn: {target: spec:probe.parent, __proto__: hidden}}",
      ),
      "probe.sdp.md",
    );
    expect(
      result.findings.some(
        (finding) => finding.severity === "error" && finding.message.includes("__proto__"),
      ),
    ).toBe(true);
  });
});

const questionBody =
  "## Intent\n- outcome: Probe.\n### Open questions\n- [blocking #settle] Who settles it?\n  - decider: design-owner\n  - links: spec:probe.parent#rule.first, spec:probe.missing\n  - provisional: Assume one caller.\n  - trigger: A second caller arrives.\n\n## Rule\n- [#first] First text.";
describe("question fields", () => {
  it("carries the fields through Markdown, serialization and the reader with exact lines", () => {
    const graph = graphOf(reifyMarkdownCarrier(mdSpec(questionBody), "probe.sdp.md"));
    const context = createReader(graph).specContext("spec:probe.parent");
    expect(context?.sections?.intent?.openQuestions?.[0]).toEqual({
      question: "Who settles it?",
      blocking: true,
      key: "settle",
      decider: "design-owner",
      links: ["spec:probe.parent#rule.first", "spec:probe.missing"],
      provisional: "Assume one caller.",
      trigger: "A second caller arrives.",
    });
    expect(context?.designColumns.openQuestions[0]).toMatchObject({
      decider: "design-owner",
      links: ["spec:probe.parent#rule.first", "spec:probe.missing"],
      provisional: "Assume one caller.",
      trigger: "A second caller arrives.",
    });
    expect(context?.entryLocations.filter((row) => row.entry.includes("]."))).toEqual(
      ["decider", "links", "provisional", "trigger"].map((field, index) => ({
        spec: "spec:probe.parent",
        file: "probe.sdp.md",
        entry: `question[0].${field}`,
        line: index + 14,
      })),
    );
    expect(JSON.parse(serializeGraph(graph))).toMatchObject({
      nodes: [
        expect.objectContaining({
          sections: expect.objectContaining({ intent: context?.sections?.intent }) as unknown,
        }),
      ],
    });
    expect(
      validateGraph(graph).findings.filter(
        (finding) => finding.validatorId === "conformance/prose-mentions",
      ),
    ).toEqual([
      expect.objectContaining({
        severity: "error",
        line: 15,
        path: "intent.openQuestions[0].links[1]",
      }),
    ]);
  });
  it("records TypeScript fields at their properties and leaves absent fields absent", () => {
    const source = tsSpec(
      'intent: {outcome: "Probe", openQuestions: [{question: "Who?", blocking: true, key: "settle",\n decider: "owner",\n links: ["spec:probe.parent"],\n provisional: "One caller.",\n trigger: "Second caller."}, {question: "Later?"}]}',
    ).replace('intent: {outcome: "Probe"}, ', "");
    const graph = graphOf(reifyTypeScriptCarrier(source, "probe.sdp.ts"));
    const questions =
      createReader(graph).specContext("spec:probe.parent")?.designColumns.openQuestions;
    expect(questions?.[0]).toMatchObject({
      decider: "owner",
      links: ["spec:probe.parent"],
      provisional: "One caller.",
      trigger: "Second caller.",
    });
    expect(questions?.[1]).not.toHaveProperty("links");
    expect(
      graph.locations?.filter((row) => row.entry.includes("].")).map((row) => row.line),
    ).toEqual([3, 4, 5, 6]);
  });
  it.each([
    "  - decider: Owner",
    "  - decider: ",
    "  - decider: owner\n  - decider: delegated",
    "  - links: ",
    "  - links: spec:probe.parent, spec:probe.parent",
    "  - provisional: ",
    "  - trigger: ",
    "  - status: waiting",
    "    - decider: owner",
    "  - decider: owner\n    continuation",
  ])("refuses invalid Markdown field %s at its line", (field) => {
    const result = reifyMarkdownCarrier(
      mdSpec(`## Intent\n- outcome: Probe.\n### Open questions\n- [blocking] Who?\n${field}`),
      "probe.sdp.md",
    );
    expect(
      result.findings.some((finding) => finding.severity === "error" && (finding.line ?? 0) >= 14),
    ).toBe(true);
    expect(result.specs).toEqual([]);
  });
  it("refuses a trigger on a non-blocking question and a field outside a question", () => {
    for (const body of [
      "## Intent\n### Open questions\n- [non-blocking] Who?\n  - trigger: A caller.",
      "## Rule\n- A rule.\n  - decider: owner",
      "## Intent\n- outcome: Probe.\n  - decider: owner",
      "## Intent\n### Open questions\n- [blocking] Who?\n\n  - decider: owner",
    ]) {
      expect(
        reifyMarkdownCarrier(mdSpec(body), "probe.sdp.md").findings.some(
          (finding) => finding.severity === "error",
        ),
      ).toBe(true);
    }
  });
  it.each([
    'decider: "Owner"',
    "links: []",
    'links: ["spec:probe.parent", "spec:probe.parent"]',
    'provisional: "one\\ntwo"',
    'trigger: "A caller."',
    'status: "waiting"',
    'decider: "owner", decider: "delegated"',
    "decider: selectOwner()",
    'links: [ref("spec:probe.parent")]',
    'links: ["spec:probe.parent", ...others]',
  ])("refuses invalid TypeScript field %s", (field) => {
    const source = tsSpec(`intent: {openQuestions: [{question: "Who?", ${field}}]}`).replace(
      'intent: {outcome: "Probe"}, ',
      "",
    );
    expect(
      reifyTypeScriptCarrier(source, "probe.sdp.ts").findings.some(
        (finding) => finding.severity === "error" && finding.line !== undefined,
      ),
    ).toBe(true);
  });
  it("checks every link as a complete token and groups unbacked pairs with prose", () => {
    const parent = reifyMarkdownCarrier(mdSpec("## Rule\n- [#first] First text."), "parent.sdp.md");
    const source = reifyMarkdownCarrier(
      mdSpec(
        "spec:probe.parent\n\n## Intent\n### Open questions\n- [blocking] Who?\n  - links: spec:probe.parent#rule.first, spec:probe.parent#rule.absent, https://example.com, pack:probe",
        "behavior",
        "{}",
        "probe.source",
      ),
      "source.sdp.md",
    );
    const graph = graphOf(parent, source);
    const findings = validateGraph(graph).findings.filter(
      (finding) => finding.validatorId === "conformance/prose-mentions",
    );
    expect(findings.filter((finding) => finding.severity === "error")).toHaveLength(3);
    expect(findings.filter((finding) => finding.severity === "warning")).toHaveLength(1);
    expect(
      findings
        .filter((finding) => finding.severity === "error")
        .every((finding) => finding.line === 15),
    ).toBe(true);
    expect(graph.edges).toEqual([]);
  });
  it("keeps readiness dependent on the blocking flag alone", () => {
    const withFields = graphOf(reifyMarkdownCarrier(mdSpec(questionBody), "probe.sdp.md"));
    const withoutFields = graphOf(
      reifyMarkdownCarrier(
        mdSpec(
          questionBody
            .split("\n")
            .filter((line) => !line.startsWith("  - "))
            .join("\n"),
        ),
        "probe.sdp.md",
      ),
    );
    expect(createReader(withFields).specContext("spec:probe.parent")?.derivedReadiness).toEqual(
      createReader(withoutFields).specContext("spec:probe.parent")?.derivedReadiness,
    );
  });
});

describe("TypeScript import", () => {
  it("preserves rule and flow keys, all question fields, reasons and exercises", () => {
    const source = tsSpec(
      'relations: [verifies(ref("spec:probe.target"), {reason: "Rule proof: first.", exercises: ["first"]}), dependsOn(ref("spec:probe.other"), {reason: "Needs # output."})], intent: {outcome: "Probe", openQuestions: [{question: "Who?", blocking: true, key: "settle", decider: "owner", links: ["spec:probe.target#rule.first"], provisional: "One caller.", trigger: "Second caller."}]}, behavior: {rules: ["[#first] First text."], flows: ["[#flow] Flow text."]}',
    ).replace('intent: {outcome: "Probe"}, ', "");
    const imported = importTypeScriptSpec(source, "probe.sdp.ts");
    expect(imported.findings).toEqual([]);
    expect(imported.emitted?.content).toContain("- rule: [#first] First text.");
    expect(imported.emitted?.content).toContain("- flow: [#flow] Flow text.");
    const md = reifyMarkdownCarrier(imported.emitted?.content ?? "", "probe.sdp.md");
    const ts = reifyTypeScriptCarrier(source, "probe.sdp.ts");
    expect(md.specs[0]?.data.behavior).toEqual(ts.specs[0]?.data.behavior);
    expect(md.specs[0]?.data.intent).toEqual(ts.specs[0]?.data.intent);
    expect(deriveGraph(md.specs, [], []).edges).toEqual(
      expect.arrayContaining([...deriveGraph(ts.specs, [], []).edges]),
    );
  });
});

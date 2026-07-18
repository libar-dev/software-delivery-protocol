import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
  deriveGraph,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
  serializeGraph,
} from "../src/index.js";

const fixtureRoot = new URL("./fixtures/extract/self-hosting-carrier/", import.meta.url);

const fixturePaths = [
  "specs/carrier/markdown-authoring.sdp.md.txt",
  "specs/carrier/envelope-contract.sdp.md.txt",
  "specs/carrier/markdown-parser.sdp.md.txt",
  "specs/carrier/sdp-import.sdp.md.txt",
  "specs/carrier/prose-ownership-rule.sdp.md.txt",
] as const;

const validFrontmatter = `---
id: spec:carrier.valid
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Deferred body parsing`;

function carrierBody(body: string, kind = "behavior"): string {
  return `---
id: spec:carrier.body
kind: ${kind}
altitude: story
readiness: idea
relations: {}
---
${body}`;
}

function reify(sourceText: string) {
  return reifyMarkdownCarrier(sourceText, "carrier.sdp.md");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecordArray(value: unknown): value is readonly Record<string, unknown>[] {
  return Array.isArray(value) && value.every(isRecord);
}

describe("Markdown frontmatter reifier", () => {
  it("reifies the frozen corpus envelopes at their id token lines", async () => {
    const fixtures = await Promise.all(
      fixturePaths.map(async (fixturePath) => ({
        fixturePath,
        sourceText: await readFile(new URL(fixturePath, fixtureRoot), "utf8"),
      })),
    );

    for (const fixture of fixtures) {
      const result = reifyMarkdownCarrier(fixture.sourceText, fixture.fixturePath.slice(0, -4));

      expect(result.findings).toEqual([]);
      expect(result.specs).toHaveLength(1);
      expect(result.specs[0]?.line).toBe(2);
      expect(result.specs[0]?.data.title).toBeDefined();
      expect(result.specs[0]?.data.intent).toHaveProperty("outcome");
    }
  });

  it("maps scalar and list relations in authored order", () => {
    const result = reify(`---
id: spec:carrier.ordered-relations
kind: behavior
altitude: story
readiness: idea
relations:
  dependsOn:
    - spec:carrier.first
    - spec:carrier.second
  refines: spec:carrier.parent
---
# Deferred body parsing`);

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toMatchObject({
      id: "spec:carrier.ordered-relations",
      relations: [
        { type: "dependsOn", target: "spec:carrier.first", claim: "declared" },
        { type: "dependsOn", target: "spec:carrier.second", claim: "declared" },
        { type: "refines", target: "spec:carrier.parent", claim: "declared" },
      ],
    });
  });

  it("distinguishes an explicit empty relation set from a missing relation key", () => {
    const accepted = reify(validFrontmatter);
    const refused = reify(validFrontmatter.replace("relations: {}\n", ""));

    expect(accepted.specs[0]?.data.relations).toEqual([]);
    expect(refused.specs).toEqual([]);
    expect(refused.findings[0]).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      line: 1,
    });
  });

  it.each([
    [
      "warning",
      "---\n%YAML 1.2\nid: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "directive",
      "---\n%TAG !e! tag:example.com,2026:\nid: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "tag",
      "---\nid: !tagged spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "anchor",
      "---\nid: &id spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "alias",
      "---\nid: *id\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "merge",
      "---\nid: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations:\n  <<: { refines: spec:carrier.parent }\n---\n# title",
      7,
    ],
    [
      "complex key",
      "---\n? [id, value]\n: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
      2,
    ],
    [
      "non-string scalar",
      "---\nid: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: true\nrelations: {}\n---\n# title",
      5,
    ],
    ["body delimiter", `${validFrontmatter}\n---\nbody`, 1],
  ])("refuses %s without throwing", (_name, sourceText, line) => {
    const result = reify(sourceText);

    expect(result.specs).toEqual([]);
    expect(result.findings[0]).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      line,
    });
  });

  it("caps findings and leaves a healthy sibling independently reifiable", () => {
    const invalidKeys = Array.from(
      { length: 100 },
      (_, index) => `invalid${String(index)}: value`,
    ).join("\n");
    const malformed = reify(validFrontmatter.replace("relations: {}", invalidKeys));
    const healthy = reify(validFrontmatter);

    expect(malformed.specs).toEqual([]);
    expect(malformed.findings).toHaveLength(100);
    expect(malformed.findings[99]).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      line: 1,
      message: "finding limit reached; additional findings suppressed",
    });
    expect(healthy.specs).toHaveLength(1);
  });

  it("refuses byte and delimiter envelope violations", () => {
    const cases = [
      `\uFEFF${validFrontmatter}`,
      ` ---\n${validFrontmatter.slice(4)}`,
      validFrontmatter.replace("---\n#", "...\n#"),
      validFrontmatter.replace(/\n/g, "\r"),
      `---\r\nid: spec:carrier.crlf\r\nkind: behavior\r\naltitude: story\r\nreadiness: idea\r\nrelations: {}\r\n---\r\n# title\n`,
    ];

    for (const sourceText of cases) {
      expect(reify(sourceText).findings[0]).toMatchObject({
        validatorId: "extract/invalid-frontmatter",
        line: 1,
      });
    }
  });

  it("maps the ruled title, intent, and behavior lists from the body", () => {
    const result = reify(
      carrierBody(`# Carrier title
Narrative first paragraph.

Narrative second paragraph.

## Intent
Intent description.
- actor: An author
- outcome: Preserve one graph.
- risk: A silent drop

### Open questions
- [blocking] Is the grammar sufficient?

## Behavior
Behavior description.
- rule: The carrier is deterministic.
- flow: Parse then derive.`),
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toMatchObject({
      title: "Carrier title",
      narrative: "Narrative first paragraph.\n\nNarrative second paragraph.",
      intent: {
        description: "Intent description.",
        actor: "An author",
        outcome: "Preserve one graph.",
        risks: ["A silent drop"],
        openQuestions: [{ question: "Is the grammar sufficient?", blocking: true }],
      },
      behavior: {
        description: "Behavior description.",
        rules: ["The carrier is deterministic."],
        flows: ["Parse then derive."],
      },
    });
  });

  it("maps the ruled fences and every remaining typed owner", () => {
    const resultKey = ["t", "hen"].join("");
    const result = reify(
      carrierBody(
        `# Example carrier
## Intent
- outcome: Bind one point.
\`\`\`gwt
Given a cart with {items: 2} entries
When the cart is submitted
Then an order is created
\`\`\`

## Example space
\`\`\`gwt-vocabulary
Given a cart with {items:number} entries
When the cart is submitted
Then an order is created
\`\`\`

## Constraints
- statement: Respond within the budget.
- target: latency.p95

## Model
- **Order** — An accepted cart.

## Design
- retryPolicy: Retry only transient failures.

## Decision
- context: The validation order was ambiguous.
- decision: Validate before persistence.
- rationale: It avoids invalid writes.

## Verification — executable
- The integration scenario exits zero.

## UI
- emptyState: Explain the next action.`,
        "example",
      ),
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toMatchObject({
      behavior: {
        examples: [{ given: ["a cart with {items: 2} entries"], when: ["the cart is submitted"] }],
        exampleSpace: {
          given: ["a cart with {items:number} entries"],
          when: ["the cart is submitted"],
        },
      },
      constraints: [{ statement: "Respond within the budget.", target: "latency.p95" }],
      model: { terms: { Order: "An accepted cart." } },
      design: { retryPolicy: "Retry only transient failures." },
      decision: {
        context: "The validation order was ambiguous.",
        decision: "Validate before persistence.",
        rationale: ["It avoids invalid writes."],
      },
      verification: { mode: "executable", criteria: ["The integration scenario exits zero."] },
      ui: { emptyState: "Explain the next action." },
    });
    expect(result.specs[0]?.data).toHaveProperty(
      ["behavior", "examples", 0, resultKey],
      ["an order is created"],
    );
    expect(result.specs[0]?.data).toHaveProperty(
      ["behavior", "exampleSpace", resultKey],
      ["an order is created"],
    );
  });

  it("serializes owned prose canonically across both public carrier reifiers", () => {
    const markdown = carrierBody(
      `# Prose carrier
Narrative owned by the Spec.

## UI
UI description.
- zeta: Last UI field.
- alpha: First UI field.

## Verification — manual
Verification description.
- A reviewer reads the graph.

## Decision
Decision description.
- decision: Keep ownership explicit.
- context: Carrier prose needs a home.
- rationale: Consumers read the graph.

## Design
Design description.
- zeta: Last design field.
- alpha: First design field.

## Model
Model description.
- **Zeta** — Last term.
- **Alpha** — First term.

## Constraints
- flavor: quality
- statement: Output stays deterministic.
- target: bytes
- measurableBy: test

## Rule
Behavior description.
- Preserve owned prose.

## Intent
Intent description.
- value: Make prose searchable.
- outcome: Carry prose through the graph.
- actor: An author
- problem: Prose lacks an owner.
- assumption: The graph is canonical.
- risk: A silent drop.

### Open questions
- [blocking] Is the owner explicit?`,
      "rule",
    ).replace("id: spec:carrier.body", "id: spec:carrier.prose");
    const typeScript = `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const prose = spec({
  ui: { zeta: "Last UI field.", description: "UI description.", alpha: "First UI field." },
  verification: { criteria: ["A reviewer reads the graph."], description: "Verification description.", mode: "manual" },
  decision: { rationale: ["Consumers read the graph."], description: "Decision description.", decision: "Keep ownership explicit.", context: "Carrier prose needs a home." },
  design: { zeta: "Last design field.", description: "Design description.", alpha: "First design field." },
  model: { terms: { Zeta: "Last term.", Alpha: "First term." }, description: "Model description." },
  constraints: [{ measurableBy: "test", target: "bytes", statement: "Output stays deterministic.", flavor: "quality" }],
  behavior: { rules: ["Preserve owned prose."], description: "Behavior description." },
  intent: { openQuestions: [{ blocking: true, question: "Is the owner explicit?" }], risks: ["A silent drop."], assumptions: ["The graph is canonical."], description: "Intent description.", value: "Make prose searchable.", outcome: "Carry prose through the graph.", actor: "An author", problem: "Prose lacks an owner." },
  narrative: "Narrative owned by the Spec.",
  title: "Prose carrier",
  readiness: "idea",
  altitude: "story",
  kind: "rule",
  id: specId("spec:carrier.prose"),
});`;

    const markdownResult = reifyMarkdownCarrier(markdown, "carrier.sdp");
    const typeScriptResult = reifyTypeScriptCarrier(typeScript, "carrier.sdp");
    const markdownGraph = deriveGraph(markdownResult.specs, markdownResult.packs, []);
    const typeScriptGraph = deriveGraph(typeScriptResult.specs, typeScriptResult.packs, []);
    const markdownSerialized = serializeGraph(markdownGraph);
    const typeScriptSerialized = serializeGraph(typeScriptGraph);

    expect(markdownResult.findings).toEqual([]);
    expect(typeScriptResult.findings).toEqual([]);
    expect(markdownSerialized).toBe(typeScriptSerialized);

    const serialized = JSON.parse(markdownSerialized) as unknown;

    if (!isRecord(serialized) || !isRecordArray(serialized.nodes)) {
      throw new Error("serialized graph must contain a primitive node");
    }

    const [primitive] = serialized.nodes;

    if (!isRecord(primitive)) {
      throw new Error("serialized graph must contain a primitive node");
    }

    const sections = primitive.sections;

    if (!isRecord(sections) || !isRecord(sections.intent) || !isRecordArray(sections.constraints)) {
      throw new Error("serialized primitive must contain canonical sections");
    }

    const constraint = sections.constraints[0];

    if (!isRecord(constraint) || !isRecord(sections.model) || !isRecord(sections.model.terms)) {
      throw new Error("serialized primitive must contain canonical section content");
    }

    expect(Object.keys(primitive)).toEqual([
      "id",
      "nodeType",
      "claim",
      "specKind",
      "altitude",
      "readiness",
      "title",
      "narrative",
      "file",
      "sections",
    ]);
    expect(Object.keys(sections)).toEqual([
      "intent",
      "behavior",
      "constraints",
      "model",
      "design",
      "decision",
      "verification",
      "ui",
    ]);
    expect(Object.keys(sections.intent)).toEqual([
      "description",
      "actor",
      "problem",
      "outcome",
      "value",
      "risks",
      "assumptions",
      "openQuestions",
    ]);
    expect(Object.keys(constraint)).toEqual(["flavor", "statement", "target", "measurableBy"]);
    expect(Object.keys(sections.model)).toEqual(["description", "terms"]);
    expect(Object.keys(sections.model.terms)).toEqual(["Alpha", "Zeta"]);
  });

  it("omits absent prose fields and rejects constraint-local prose from the TypeScript carrier", () => {
    const withoutProse = reifyTypeScriptCarrier(
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const plain = spec({ id: specId("spec:carrier.plain"), title: "Plain", kind: "rule", altitude: "story", readiness: "idea", behavior: { rules: ["A rule."] } });`,
      "plain.sdp.ts",
    );
    const constraintProse = reifyTypeScriptCarrier(
      `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const invalid = spec({ id: specId("spec:carrier.invalid-prose"), title: "Invalid", kind: "constraint", altitude: "story", readiness: "idea", constraints: [{ statement: "Stay deterministic.", description: "No owner." }] });`,
      "invalid.sdp.ts",
    );

    expect(serializeGraph(deriveGraph(withoutProse.specs, withoutProse.packs, []))).not.toContain(
      '"narrative"',
    );
    expect(constraintProse.specs).toEqual([]);
    expect(constraintProse.findings[0]?.validatorId).toBe("extract/unowned-prose");
  });

  it("uses the first minimum heading suggestion within edit distance two", () => {
    const result = reify(carrierBody("# Title\n## Intnet"));

    expect(result.findings[0]).toMatchObject({
      validatorId: "extract/unrecognized-heading",
      line: 9,
      message: 'heading "Intnet" is not recognized; did you mean "Intent"?',
    });
  });

  it("refuses mixed-mode Verification headings instead of overwriting the first section", () => {
    const result = reify(
      carrierBody(
        "# Title\n## Verification — manual\n- A reviewer checks it.\n## Verification — executable\n- The test exits zero.",
      ),
    );

    expect(result.specs).toEqual([]);
    expect(result.findings[0]?.validatorId).toBe("extract/invalid-markdown-structure");
  });

  it("preserves Behavior rules when an example Intent appears after Behavior", () => {
    const result = reify(
      carrierBody(
        "# Title\n## Behavior\n- rule: Preserve the rule.\n## Intent\n- outcome: Bind the example.\n```gwt\nGiven a valid input\nWhen it is processed\nThen an output exists\n```",
        "example",
      ),
    );

    expect(result.specs[0]?.data.behavior).toMatchObject({
      rules: ["Preserve the rule."],
      examples: [{ given: ["a valid input"], when: ["it is processed"] }],
    });
  });

  it("refuses a GWT fence under Model", () => {
    const result = reify(
      carrierBody(
        "# Title\n## Model\n```gwt\nGiven a model\nWhen it is parsed\nThen it is rejected\n```",
      ),
    );

    expect(result.specs).toEqual([]);
    expect(result.findings[0]?.validatorId).toBe("extract/invalid-markdown-structure");
  });

  it("refuses an H3 under Design", () => {
    const result = reify(carrierBody("# Title\n## Design\n### Detail\n- retryPolicy: Retry."));

    expect(result.specs).toEqual([]);
    expect(result.findings[0]?.validatorId).toBe("extract/invalid-markdown-structure");
  });

  it("refuses an open question before its H3 owner", () => {
    const result = reify(
      carrierBody(
        "# Title\n## Intent\n- [blocking] Must be owned.\n### Open questions\n- outcome: Must not cross the owner boundary.",
      ),
    );

    expect(result.specs).toEqual([]);
    expect(result.findings[0]?.validatorId).toBe("extract/invalid-markdown-structure");
  });

  it("refuses an Intent field after the open-questions H3", () => {
    const result = reify(
      carrierBody(
        "# Title\n## Intent\n### Open questions\n- outcome: Must not cross the owner boundary.",
      ),
    );

    expect(result.specs).toEqual([]);
    expect(result.findings[0]?.validatorId).toBe("extract/invalid-markdown-structure");
  });

  it.each([
    [
      "frontmatter title",
      validFrontmatter.replace("relations: {}\n---", "relations: {}\ntitle: forbidden\n---"),
      "extract/invalid-frontmatter",
      7,
    ],
    ["second H1", carrierBody("# First\n# Second"), "extract/invalid-markdown-structure", 9],
    ["near-miss heading", carrierBody("# Title\n## Intnet"), "extract/unrecognized-heading", 9],
    [
      "indented list",
      carrierBody("# Title\n## Rule\n  - text"),
      "extract/invalid-markdown-structure",
      10,
    ],
    ["empty list", carrierBody("# Title\n## Rule\n- "), "extract/invalid-markdown-structure", 10],
    [
      "nested list",
      carrierBody("# Title\n## Rule\n- text\n  - nested"),
      "extract/invalid-markdown-structure",
      11,
    ],
    ["extra heading space", carrierBody("#  Title"), "extract/invalid-markdown-structure", 8],
    [
      "extra list space",
      carrierBody("# Title\n## Rule\n-  text"),
      "extract/invalid-markdown-structure",
      10,
    ],
    [
      "invalid GWT phase",
      carrierBody(
        "# Title\n## Intent\n- outcome: Bound point.\n```gwt\nWhen action\nThen result\n```",
        "example",
      ),
      "extract/invalid-markdown-structure",
      12,
    ],
    [
      "late description",
      carrierBody("# Title\n## Rule\n- text\nLater prose"),
      "extract/unowned-prose",
      11,
    ],
    ["raw HTML", carrierBody("# Title\n<div>no</div>"), "extract/invalid-markdown-structure", 9],
    [
      "inline raw HTML",
      carrierBody("# Title\nA <b>raw</b> tag."),
      "extract/invalid-markdown-structure",
      9,
    ],
    [
      "trailing prose",
      carrierBody("# Title\n## Rule\n- text\n\nTrailing"),
      "extract/unowned-prose",
      12,
    ],
    [
      "unsupported block",
      carrierBody("# Title\n## Rule\n| a | b |"),
      "extract/invalid-markdown-structure",
      10,
    ],
    [
      "reserved authored fact",
      carrierBody("# Title\n## Behavior\n- implemented: yes"),
      "extract/reserved-property",
      10,
    ],
  ])("refuses %s through its ruled diagnostic", (_name, sourceText, validatorId, line) => {
    const result = reify(sourceText);

    expect(result.specs).toEqual([]);
    expect(result.findings[0]).toMatchObject({ validatorId, line });
  });
});

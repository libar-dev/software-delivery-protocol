import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/extract/carrier.js";

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

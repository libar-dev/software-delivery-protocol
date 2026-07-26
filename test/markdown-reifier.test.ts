import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

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

const byteIdenticalFixturePaths = [
  fixturePaths[0],
  fixturePaths[1],
  fixturePaths[3],
  fixturePaths[4],
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

function nestedRelation(levels: number): string {
  return `---
id: spec:carrier.depth
kind: behavior
altitude: story
readiness: idea
relations:
  dependsOn:
${Array.from({ length: levels }, (_, index) => `${" ".repeat(4 + index * 2)}-`).join("\n")}
${" ".repeat(4 + levels * 2)}spec:carrier.target
---
# Title`;
}

function relationTargets(count: number): string {
  return `---
id: spec:carrier.nodes
kind: behavior
altitude: story
readiness: idea
relations:
  dependsOn:
${Array.from({ length: count }, (_, index) => `    - spec:${String(index)}`).join("\n")}
---
# Title`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecordArray(value: unknown): value is readonly Record<string, unknown>[] {
  return Array.isArray(value) && value.every(isRecord);
}

const proseOwnershipTestAnchor = specTest({
  id: testAnchorId("test:protocol.prose-ownership"),
  label: "Markdown reifier tests verify prose ownership",
  verifies: ref("spec:carrier.prose-ownership-rule"),
});

const markdownParserTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-parser"),
  label: "Markdown reifier tests verify the ruled parser",
  verifies: ref("spec:carrier.markdown-parser"),
});

const envelopeContractTestAnchor = specTest({
  id: testAnchorId("test:protocol.envelope-contract"),
  label: "frontmatter contract tests verify the Markdown envelope",
  verifies: ref("spec:carrier.envelope-contract"),
});
void [proseOwnershipTestAnchor, markdownParserTestAnchor, envelopeContractTestAnchor];

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

  it.each(byteIdenticalFixturePaths)(
    "keeps %s byte-identical to its live carrier",
    async (path) => {
      const fixtureBytes = await readFile(new URL(path, fixtureRoot));
      const liveBytes = await readFile(new URL(path.slice(0, -4), new URL("../", import.meta.url)));

      expect(liveBytes).toEqual(fixtureBytes);
    },
  );

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
      "---\nid: &a: spec:carrier.invalid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# title",
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

  it("caps body findings with the frozen structure finding ID", () => {
    const invalidBody = Array.from(
      { length: 100 },
      (_, index) => `${String(index + 1)}. item`,
    ).join("\n");
    const result = reify(carrierBody(`# Title\n${invalidBody}`));

    expect(result.specs).toEqual([]);
    expect(result.findings).toHaveLength(100);
    expect(result.findings[99]).toMatchObject({
      validatorId: "extract/invalid-markdown-structure",
      line: 1,
      message: "finding limit reached; additional findings suppressed",
    });
  });

  it("reports a genuine YAML document warning", () => {
    const result = reify(
      "---\nid: &a: spec:carrier.warning\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Title",
    );

    expect(result.findings[0]).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      line: 2,
      message:
        "Anchor ending in : is ambiguous at line 2, column 7:\n\nid: &a: spec:carrier.warning\n      ^\n",
    });
  });

  it("contains the YAML parser's unknown throw at the public reifier boundary", async () => {
    vi.resetModules();
    vi.doMock("yaml", async (importOriginal) => {
      const original = await importOriginal<typeof import("yaml")>();
      return {
        ...original,
        parseAllDocuments: () => {
          const thrownValue: unknown = null;
          throw thrownValue;
        },
      };
    });

    try {
      const dynamicApi = await import("../src/index.js");
      const result = dynamicApi.reifyMarkdownCarrier(validFrontmatter, "carrier.sdp.md");

      expect(result).toMatchObject({
        specs: [],
        findings: [
          {
            validatorId: "extract/invalid-frontmatter",
            line: 1,
            message: "frontmatter parser threw an unknown value",
          },
        ],
      });
    } finally {
      vi.doUnmock("yaml");
      vi.resetModules();
    }
  });

  const carrierAtLimit = `${validFrontmatter}${" ".repeat(
    256 * 1024 - Buffer.byteLength(validFrontmatter, "utf8"),
  )}`;
  const frontmatterCore =
    "id: spec:carrier.valid\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n";
  const frontmatterAtLimit = `${frontmatterCore}${"#".repeat(
    32 * 1024 - Buffer.byteLength(frontmatterCore, "utf8"),
  )}`;
  const scalarAtLimit = `spec:${"a".repeat(16 * 1024 - 5)}`;
  it.each([
    [
      "256 KiB carrier byte limit",
      carrierAtLimit,
      `${carrierAtLimit}x`,
      "carrier exceeds the 256 KiB byte limit",
      1,
    ],
    [
      "32 KiB frontmatter byte limit",
      `---\n${frontmatterAtLimit}\n---\n# Title`,
      `---\n${frontmatterAtLimit}#\n---\n# Title`,
      "frontmatter exceeds the 32 KiB byte limit",
      1,
    ],
    [
      "16 KiB scalar byte limit",
      validFrontmatter.replace("spec:carrier.valid", scalarAtLimit),
      validFrontmatter.replace("spec:carrier.valid", `${scalarAtLimit}a`),
      "scalar exceeds the 16 KiB byte limit",
      2,
    ],
    [
      "2,000 node limit",
      relationTargets(1_987),
      relationTargets(1_988),
      "frontmatter exceeds the 2,000 node limit",
      6,
    ],
    [
      "depth limit of 16",
      nestedRelation(13),
      nestedRelation(14),
      "frontmatter exceeds the depth limit of 16",
      22,
    ],
  ])("enforces the %s at and immediately over its boundary", (_name, at, over, message, line) => {
    const atResult = reify(at);
    const overResult = reify(over);

    expect(atResult.findings).not.toContainEqual(expect.objectContaining({ message }));
    expect(overResult.findings).toContainEqual(
      expect.objectContaining({
        validatorId: "extract/invalid-frontmatter",
        message,
        line,
      }),
    );
  });

  it.each([
    [
      "duplicate relation keys",
      "  dependsOn: spec:carrier.first\n  dependsOn: spec:carrier.second",
      'relation "dependsOn" is authored more than once',
      8,
    ],
    [
      "duplicate targets within one relation list",
      "  dependsOn:\n    - spec:carrier.same\n    - spec:carrier.same",
      "duplicate target within one relation type",
      9,
    ],
    ["an empty relation sequence", "  dependsOn: []", "relation values must not be empty", 7],
    [
      "a wrong-namespace relation target",
      "  dependsOn: pack:carrier.wrong",
      "relation target must use the spec namespace",
      7,
    ],
  ])("refuses %s", (_name, relations, message, line) => {
    const result = reify(
      validFrontmatter
        .replace("relations: {}", `relations:\n${relations}`)
        .replace("# Deferred body parsing", "# Title"),
    );

    expect(result.specs).toEqual([]);
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        validatorId: "extract/invalid-frontmatter",
        message,
        line,
      }),
    );
  });

  it("accepts distinct relation keys that share a target", () => {
    const result = reify(
      validFrontmatter.replace(
        "relations: {}",
        "relations:\n  dependsOn: spec:carrier.shared\n  refines: spec:carrier.shared",
      ),
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data.relations).toEqual([
      { type: "dependsOn", target: "spec:carrier.shared", claim: "declared" },
      { type: "refines", target: "spec:carrier.shared", claim: "declared" },
    ]);
  });

  it("accepts a pure CRLF carrier", () => {
    const result = reify(validFrontmatter.replaceAll("\n", "\r\n"));

    expect(result.findings).toEqual([]);
    expect(result.specs[0]).toMatchObject({ line: 2, data: { title: "Deferred body parsing" } });
  });

  it.each([
    [
      "a byte-order mark",
      `\uFEFF${validFrontmatter}`,
      "carrier must begin at byte zero with an exact --- line",
    ],
    [
      "an indented opener",
      ` ---\n${validFrontmatter.slice(4)}`,
      "carrier must begin at byte zero with an exact --- line",
    ],
    [
      "a document-end closer",
      validFrontmatter.replace("---\n#", "...\n#"),
      "carrier requires one exact closing --- line",
    ],
    [
      "a lone CR after a valid LF carrier",
      `${validFrontmatter}\r`,
      "carrier contains a lone CR newline",
    ],
    [
      "mixed CRLF and LF newlines",
      `---\r\nid: spec:carrier.crlf\r\nkind: behavior\r\naltitude: story\r\nreadiness: idea\r\nrelations: {}\r\n---\r\n# title\n`,
      "carrier mixes LF and CRLF newlines",
    ],
  ])("refuses %s", (_name, sourceText, message) => {
    expect(reify(sourceText).findings[0]).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      line: 1,
      message,
    });
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
      ["behavior", "examples", 0, "then"],
      ["an order is created"],
    );
    expect(result.specs[0]?.data).toHaveProperty(
      ["behavior", "exampleSpace", "then"],
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

    const serialized: unknown = JSON.parse(markdownSerialized);

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

  it("serializes GWT and behavior key permutations to identical bytes", () => {
    const first = `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const permutation = spec({
  id: specId("spec:carrier.permutation"),
  title: "Permutation",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
  behavior: {
    examples: [{ given: ["given"], when: ["when"], then: ["then"] }],
    flows: ["First then second."],
    exampleSpace: { given: ["given"], when: ["when"], then: ["then"] },
  },
});`;
    const second = `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const permutation = spec({
  readiness: "idea",
  behavior: {
    exampleSpace: { then: ["then"], when: ["when"], given: ["given"] },
    flows: ["First then second."],
    examples: [{ then: ["then"], when: ["when"], given: ["given"] }],
  },
  altitude: "story",
  kind: "behavior",
  title: "Permutation",
  id: specId("spec:carrier.permutation"),
});`;
    const firstResult = reifyTypeScriptCarrier(first, "permutation.sdp.ts");
    const secondResult = reifyTypeScriptCarrier(second, "permutation.sdp.ts");

    expect(firstResult.findings).toEqual([]);
    expect(secondResult.findings).toEqual([]);
    expect(serializeGraph(deriveGraph(firstResult.specs, firstResult.packs, []))).toBe(
      serializeGraph(deriveGraph(secondResult.specs, secondResult.packs, [])),
    );
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

  it.each([
    [
      "a missing H1",
      carrierBody("Narrative"),
      "extract/invalid-markdown-structure",
      8,
      "the first body line must be an H1 title",
    ],
    [
      "an empty H1",
      carrierBody("# "),
      "extract/invalid-markdown-structure",
      8,
      "the H1 title must be nonempty and start immediately after #",
    ],
    [
      "a heading beyond suggestion distance two",
      carrierBody("# Title\n## Unrelated"),
      "extract/unrecognized-heading",
      9,
      'heading "Unrelated" is not recognized',
    ],
    [
      "a tied heading using the first minimum",
      carrierBody("# Title\n## Constrait"),
      "extract/unrecognized-heading",
      9,
      'heading "Constrait" is not recognized; did you mean "Contract"?',
    ],
    [
      "a blank line in a fence",
      carrierBody(
        "# Title\n## Intent\n```gwt\nGiven input\n\nWhen processed\nThen output\n```",
        "example",
      ),
      "extract/invalid-markdown-structure",
      12,
      "fence bodies cannot contain blank or indented lines",
    ],
    [
      "fence attributes",
      carrierBody(
        "# Title\n## Intent\n```gwt {name=value}\nGiven input\nWhen processed\nThen output\n```",
        "example",
      ),
      "extract/invalid-markdown-structure",
      10,
      "fences must be exact gwt or gwt-vocabulary fences",
    ],
    [
      "an unclosed fence",
      carrierBody(
        "# Title\n## Intent\n```gwt\nGiven input\nWhen processed\nThen output",
        "example",
      ),
      "extract/invalid-markdown-structure",
      10,
      "fence must close with an exact ``` line",
    ],
    [
      "a gwt fence on a non-example",
      carrierBody("# Title\n## Intent\n```gwt\nGiven input\nWhen processed\nThen output\n```"),
      "extract/invalid-markdown-structure",
      10,
      "only an example Intent may own one gwt fence",
    ],
    [
      "an invalid Verification mode",
      carrierBody("# Title\n## Verification — MODE"),
      "extract/unrecognized-heading",
      9,
      'heading "Verification — MODE" is not recognized',
    ],
    [
      "a repeated identical literal heading",
      carrierBody("# Title\n## Intent\n## Intent"),
      "extract/invalid-markdown-structure",
      10,
      "a single-valued Markdown owner is authored more than once",
    ],
  ])(
    "refuses %s through the frozen body diagnostic",
    (_name, sourceText, validatorId, line, message) => {
      const result = reify(sourceText);

      expect(result.specs).toEqual([]);
      expect(result.findings).toContainEqual(
        expect.objectContaining({ validatorId, line, message }),
      );
    },
  );

  it.each([
    ["ordered dot list in narrative", "# Title\n1. first", 9],
    ["ordered parenthesis list in narrative", "# Title\n1) first", 9],
    ["star list in narrative", "# Title\n* first", 9],
    ["plus list in narrative", "# Title\n+ first", 9],
    ["ordered dot tab list in narrative", "# Title\n1.\tfirst", 9],
    ["ordered parenthesis tab list in narrative", "# Title\n1)\tfirst", 9],
    ["star tab list in narrative", "# Title\n*\tfirst", 9],
    ["plus tab list in narrative", "# Title\n+\tfirst", 9],
    ["HTML comment in narrative", "# Title\nProse <!-- comment -->", 9],
    ["setext equals underline in narrative", "# Title\nProse\n===", 10],
    ["setext dash underline in narrative", "# Title\nProse\n- - -", 10],
    ["star thematic break in narrative", "# Title\n***", 9],
    ["underscore thematic break in narrative", "# Title\n___", 9],
    ["ordered list in section prose", "# Title\n## Intent\n1. first", 10],
    ["star list in section prose", "# Title\n## Intent\n* first", 10],
    ["plus list in section prose", "# Title\n## Intent\n+ first", 10],
    ["setext underline in section prose", "# Title\n## Intent\nProse\n===", 11],
    ["thematic break in section prose", "# Title\n## Intent\n***", 10],
    ["bare HTML opener in section prose", "# Title\n## Intent\n<div", 10],
    ["dash tab list in section prose", "# Title\n## Intent\n-\tfirst", 10],
    ["HTML comment in section prose", "# Title\n## Intent\nProse <!-- comment -->", 10],
    ["processing instruction in section prose", "# Title\n## Intent\nProse <?xml ?>", 10],
    ["declaration in section prose", "# Title\n## Intent\nProse <!DOCTYPE html>", 10],
  ])("refuses %s", (_name, body, line) => {
    const result = reify(carrierBody(body));

    expect(result.specs).toEqual([]);
    expect(result.findings[0]).toMatchObject({
      validatorId: "extract/invalid-markdown-structure",
      line,
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

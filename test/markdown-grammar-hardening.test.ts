import { expect, it, vi } from "vitest";

import { reifyMarkdownCarrier } from "../src/index.js";

function reify(sourceText: string) {
  return reifyMarkdownCarrier(sourceText, "grammar-hardening.sdp.md");
}

const validCarrier = `---
id: spec:carrier.grammar-hardening
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Grammar hardening`;

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
# Grammar hardening`;
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
# Grammar hardening`;
}

it.each(["1e3", "0x1F", "-.inf"])(
  "classifies the YAML 1.2 plain scalar %s as a non-string scalar",
  (spelling) => {
    const result = reify(validCarrier.replace("readiness: idea", `readiness: ${spelling}`));

    expect(result.specs).toEqual([]);
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        validatorId: "extract/invalid-frontmatter",
        line: 5,
        message: 'frontmatter field "readiness" must be a string scalar',
      }),
    );
  },
);

it("rebases YAML-native diagnostic line text with the structured finding line", () => {
  const result = reify(
    validCarrier.replace(
      "id: spec:carrier.grammar-hardening",
      "id: &a: spec:carrier.grammar-hardening",
    ),
  );
  const finding = result.findings.find((entry) => entry.message.startsWith("Anchor ending in :"));

  expect(finding).toMatchObject({
    validatorId: "extract/invalid-frontmatter",
    line: 2,
  });
  expect(finding?.message).toContain("at line 2, column 7");
});

it("refuses a YAML document-end marker before the required frontmatter closer", () => {
  const result = reify(validCarrier.replace("relations: {}\n---", "relations: {}\n...\n---"));

  expect(result.specs).toEqual([]);
  expect(result.findings).toEqual([
    expect.objectContaining({
      validatorId: "extract/invalid-frontmatter",
      line: 1,
      message: "frontmatter does not accept an exact ... document-end line",
    }),
  ]);
});

it("preserves accumulated YAML findings when the frontmatter root is not a mapping", () => {
  const result = reify(`---
%FOO bar
scalar
---
# Grammar hardening`);

  expect(result.specs).toEqual([]);
  expect(result.findings).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: "YAML directives are not accepted" }),
      expect.objectContaining({ message: "frontmatter must be a mapping" }),
    ]),
  );
});

it.each([
  [nestedRelation(30), "frontmatter exceeds the depth limit of 16"],
  [relationTargets(2_050), "frontmatter exceeds the 2,000 node limit"],
])("reports each frontmatter resource-limit breach once", (sourceText, message) => {
  const result = reify(sourceText);

  expect(result.specs).toEqual([]);
  expect(result.findings.filter((finding) => finding.message === message)).toHaveLength(1);
});

it("item f refuses an example GWT fence before the end of its Intent content", () => {
  const result = reify(
    validCarrier.replace("kind: behavior", "kind: example").replace(
      "# Grammar hardening",
      `# Grammar hardening
## Intent
\`\`\`gwt
Given valid input
When it is processed
Then output exists
\`\`\`
- outcome: This field is too late.`,
    ),
  );

  expect(result.specs).toEqual([]);
  expect(result.findings).toContainEqual(
    expect.objectContaining({
      validatorId: "extract/invalid-markdown-structure",
      message: "the example gwt fence must immediately follow the Intent block",
    }),
  );
});

it("item f accepts trailing ASCII whitespace on the Open questions heading", () => {
  const result = reify(
    validCarrier.replace(
      "# Grammar hardening",
      `# Grammar hardening
## Intent
- outcome: Preserve the trim rule.
### Open questions \t
- [blocking] Is trailing whitespace trimmed?`,
    ),
  );

  expect(result.findings).toEqual([]);
  expect(result.specs[0]?.data.intent).toMatchObject({
    openQuestions: [{ question: "Is trailing whitespace trimmed?", blocking: true }],
  });
});

it("item f treats a terminal hash as literal H1 title text", () => {
  const result = reify(validCarrier.replace("# Grammar hardening", "# Support for C#"));

  expect(result.findings).toEqual([]);
  expect(result.specs[0]?.data.title).toBe("Support for C#");
});

it("item f routes a terminal hash in H2 text through owner recognition", () => {
  const result = reify(
    validCarrier.replace("# Grammar hardening", "# Grammar hardening\n## Intent#"),
  );
  const finding = result.findings.find(
    (entry) => entry.validatorId === "extract/unrecognized-heading",
  );

  expect(result.specs).toEqual([]);
  expect(finding).toBeDefined();
  expect(finding?.message).toContain('heading "Intent#" is not recognized');
});

it("item g reports a duplicate When step exactly once", () => {
  const result = reify(
    validCarrier.replace("kind: behavior", "kind: example").replace(
      "# Grammar hardening",
      `# Grammar hardening
## Intent
\`\`\`gwt
Given valid input
When it is processed
When it is processed again
Then output exists
\`\`\``,
    ),
  );

  expect(result.specs).toEqual([]);
  expect(result.findings).toEqual([
    expect.objectContaining({
      validatorId: "extract/invalid-markdown-structure",
      message: "a GWT fence has exactly one When step",
    }),
  ]);
});

it("item h converts an unexpected body-parser throw into a finding", async () => {
  vi.resetModules();
  vi.doMock("../src/extract/markdown-body.js", () => ({
    parseMarkdownBody: () => {
      throw new Error("unexpected body failure");
    },
  }));

  try {
    const dynamicApi = await import("../src/index.js");
    const result = dynamicApi.reifyMarkdownCarrier(validCarrier, "grammar-hardening.sdp.md");

    expect(result).toEqual({
      specs: [],
      packs: [],
      findings: [
        expect.objectContaining({
          validatorId: "extract/invalid-frontmatter",
          line: 1,
          message: "the carrier could not be reified: unexpected body failure",
        }),
      ],
    });
  } finally {
    vi.doUnmock("../src/extract/markdown-body.js");
    vi.resetModules();
  }
});

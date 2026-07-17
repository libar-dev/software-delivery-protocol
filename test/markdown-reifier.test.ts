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
});

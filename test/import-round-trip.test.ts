import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { emitMarkdownSpec, reifyMarkdownCarrier, reifyTypeScriptCarrier } from "../src/index.js";
import { assertAuthoredRoundTrip, assertGraphRoundTrip } from "./import-round-trip.helpers.js";

const markdownAuthoringTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-authoring"),
  label: "TypeScript and Markdown twins derive one graph, verifying Markdown authoring",
  verifies: ref("spec:carrier.markdown-authoring"),
});
void markdownAuthoringTestAnchor;

const fixtureRoot = fileURLToPath(new URL("./fixtures/import/round-trip", import.meta.url));

function materializeMarkdownCorpus(): { readonly tsRoot: string; readonly mdRoot: string } {
  const root = mkdtempSync(join(tmpdir(), "sdp-import-round-trip-"));
  const tsRoot = join(root, "typescript");
  const mdRoot = join(root, "markdown");
  cpSync(fixtureRoot, tsRoot, { recursive: true });
  mkdirSync(mdRoot, { recursive: true });

  const specPaths = [
    "behavior.sdp.ts",
    "example.sdp.ts",
    "decision.sdp.ts",
    "constraint.sdp.ts",
    "model.sdp.ts",
    "rule.sdp.ts",
    "workflow.sdp.ts",
    "contract.sdp.ts",
  ] as const;
  for (const relativePath of [...specPaths, "anchors.ts"]) {
    renameSync(join(tsRoot, `${relativePath}.txt`), join(tsRoot, relativePath));
  }

  for (const relativePath of specPaths) {
    const source = readFileSync(join(tsRoot, relativePath), "utf8");
    const markdownPath = join(mdRoot, relativePath.replace(/\.ts$/u, ".md"));
    const reified = reifyTypeScriptCarrier(source, relativePath);
    const spec = reified.specs[0];
    mkdirSync(dirname(markdownPath), { recursive: true });
    expect(reified.findings).toEqual([]);
    expect(spec).toBeDefined();
    if (spec !== undefined) writeFileSync(markdownPath, emitMarkdownSpec(spec), "utf8");
  }

  writeFileSync(
    join(mdRoot, "anchors.ts"),
    readFileSync(join(tsRoot, "anchors.ts"), "utf8"),
    "utf8",
  );

  return { tsRoot, mdRoot };
}

describe("import round-trip harness", () => {
  it("preserves reified authored data through emitted Markdown", () => {
    // Given
    const relativePath = "behavior.sdp.ts";
    const source = readFileSync(join(fixtureRoot, `${relativePath}.txt`), "utf8");

    // When
    const roundTrip = () => {
      assertAuthoredRoundTrip(source, relativePath);
    };

    // Then
    expect(roundTrip).not.toThrow();
  });

  it("preserves the mini-corpus graph under the declared delta catalog", () => {
    // Given
    const corpus = materializeMarkdownCorpus();

    // When
    const roundTrip = () => {
      assertGraphRoundTrip(corpus.tsRoot, corpus.mdRoot);
    };

    // Then
    try {
      expect(roundTrip).not.toThrow();
    } finally {
      rmSync(dirname(corpus.tsRoot), { recursive: true, force: true });
    }
  });

  it("rejects a corrupted Markdown twin", () => {
    // Given
    const corpus = materializeMarkdownCorpus();
    const corrupted = join(corpus.mdRoot, "behavior.sdp.md");
    writeFileSync(
      corrupted,
      readFileSync(corrupted, "utf8").replace(
        "An order is accepted only when its total is positive.",
        "An order is accepted even when its total is negative.",
      ),
      "utf8",
    );

    // When
    const roundTrip = () => {
      assertGraphRoundTrip(corpus.tsRoot, corpus.mdRoot);
    };

    // Then
    try {
      expect(roundTrip).toThrow();
    } finally {
      rmSync(dirname(corpus.tsRoot), { recursive: true, force: true });
    }
  });
});

const separators = [
  ["a lone CR", "\r"],
  ["U+2028", "\u2028"],
  ["U+2029", "\u2029"],
] as const;

/** A TypeScript string literal that spells every line terminator as an escape. */
function literal(text: string): string {
  return JSON.stringify(text).replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}

function typeScriptSpec(fields: readonly string[], kind = "behavior"): string {
  return [
    'import { spec, specId } from "@libar-dev/software-delivery-protocol";',
    "",
    "export const probe = spec({",
    '  id: specId("spec:probe.lines"),',
    `  kind: "${kind}",`,
    '  altitude: "story",',
    '  readiness: "idea",',
    ...fields.map((field) => `  ${field},`),
    "});",
    "",
  ].join("\n");
}

describe("one line-ending law across the carriers", () => {
  describe.each(separators)("a title holding %s", (_name, separator) => {
    const title = `Probe title${separator}@implemented injected`;

    it("is refused by the Markdown, Gherkin and TypeScript carriers alike", () => {
      const markdown = reifyMarkdownCarrier(
        `---\nid: spec:probe.lines\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# ${title}\n`,
        "probe.sdp.md",
      );
      const gherkin = reifyGherkinCarrier(
        `@spec.probe.lines @altitude.story @readiness.idea\nFeature: ${title}\n`,
        "probe.sdp.gherkin",
      );
      const typeScript = reifyTypeScriptCarrier(
        typeScriptSpec([`title: ${literal(title)}`]),
        "probe.sdp.ts",
      );

      for (const [carrier, line] of [
        [markdown, 8],
        [gherkin, 2],
        [typeScript, 8],
      ] as const) {
        expect(carrier.specs).toEqual([]);
        expect(carrier.findings).toEqual([
          expect.objectContaining({
            severity: "error",
            line,
            message: expect.stringContaining("lone CR, U+2028 or U+2029") as unknown,
          }),
        ]);
      }
      expect(typeScript.findings[0]).toMatchObject({
        validatorId: "extract/non-static-envelope",
        subjectId: "spec:probe.lines",
        path: "title",
      });
    });
  });

  describe.each(separators)("a TypeScript string holding %s", (_name, separator) => {
    const text = `First${separator}Then hidden text`;

    it.each([
      ["the narrative", [`narrative: ${literal(text)}`], "behavior", 8],
      ["an Intent field", ["intent: {", `    outcome: ${literal(text)},`, "  }"], "behavior", 9],
      ["a rule entry", ["behavior: {", `    rules: [${literal(text)}],`, "  }"], "behavior", 9],
      [
        "an example step",
        [
          "behavior: {",
          `    exampleSpace: { given: [${literal(text)}], when: ["it runs"], then: ["it holds"] },`,
          "  }",
        ],
        "behavior",
        9,
      ],
      [
        "a Model term",
        ["model: {", `    terms: { ${literal(text)}: "A definition." },`, "  }"],
        "model",
        9,
      ],
      ["a Design value", ["design: {", `    shape: ${literal(text)},`, "  }"], "behavior", 9],
    ])("refuses the Spec when %s holds one", (_site, lines, kind, line) => {
      const result = reifyTypeScriptCarrier(
        typeScriptSpec([lines.join("\n")], kind),
        "probe.sdp.ts",
      );

      expect(result.specs).toEqual([]);
      expect(result.findings).toContainEqual(
        expect.objectContaining({
          validatorId: "extract/non-static-envelope",
          severity: "error",
          subjectId: "spec:probe.lines",
          line,
          message: expect.stringContaining("lone CR, U+2028 or U+2029") as unknown,
        }),
      );
    });

    it.each(["title", "framing"])("refuses a Pack whose %s holds one", (field) => {
      const result = reifyTypeScriptCarrier(
        [
          'import { pack, packId } from "@libar-dev/software-delivery-protocol";',
          "",
          "export const probe = pack({",
          '  id: packId("pack:probe.lines"),',
          "  specs: [],",
          `  ${field}: ${literal(text)},`,
          "});",
          "",
        ].join("\n"),
        "probe.sdp.ts",
      );

      expect(result.packs).toEqual([]);
      expect(result.findings).toEqual([
        expect.objectContaining({
          validatorId: "extract/non-static-envelope",
          severity: "error",
          subjectId: "pack:probe.lines",
          line: 6,
        }),
      ]);
    });
  });

  // A template literal may hold the raw character, and the TypeScript scanner keeps U+2028 and
  // U+2029 in its value; it normalizes a raw CR to LF, which is lawful.
  it.each([
    ["U+2028", 0x2028],
    ["U+2029", 0x2029],
  ])("refuses a raw %s inside a template literal", (_name, code) => {
    const raw = String.fromCharCode(code);
    const result = reifyTypeScriptCarrier(
      typeScriptSpec([`title: \`Probe title${raw}@implemented injected\``]),
      "probe.sdp.ts",
    );

    expect(result.specs).toEqual([]);
    expect(result.findings).toEqual([
      expect.objectContaining({ validatorId: "extract/non-static-envelope", line: 8 }),
    ]);
  });

  it("keeps LF and CRLF lawful in TypeScript prose", () => {
    for (const ending of ["\n", "\r\n"]) {
      const narrative = `First paragraph.${ending}${ending}Second paragraph.`;
      const result = reifyTypeScriptCarrier(
        typeScriptSpec([`title: "Probe title"`, `narrative: ${literal(narrative)}`]),
        "probe.sdp.ts",
      );

      expect(result.findings).toEqual([]);
      expect(result.specs[0]?.data.narrative).toBe(narrative);
    }
  });
});

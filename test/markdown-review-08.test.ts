import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/index.js";

function markdown(frontmatterEntry: string, body = ""): string {
  return `---
id: spec:markdown.review-08
kind: behavior
altitude: story
readiness: idea
relations: {}
${frontmatterEntry}
---
# Review-08 Markdown
${body}`;
}

describe("review-08 Markdown diagnostics", () => {
  it.each(["implemented", "has-verifier", "hasVerifier", "observed"])(
    "classifies frontmatter delivery fact %s as reserved",
    (name) => {
      const result = reifyMarkdownCarrier(markdown(`${name}: true`), `${name}.sdp.md`);

      expect(result.specs).toEqual([]);
      expect(result.findings).toContainEqual(
        expect.objectContaining({ validatorId: "extract/reserved-property" }),
      );
    },
  );

  it("keeps a frontmatter finding id on the finding-cap summary", () => {
    const unknownKeys = Array.from(
      { length: 110 },
      (_, index) => `unknown${String(index)}: value`,
    ).join("\n");
    const result = reifyMarkdownCarrier(markdown(unknownKeys), "finding-cap.sdp.md");

    expect(result.findings).toHaveLength(100);
    expect(result.findings.at(-1)).toMatchObject({
      validatorId: "extract/invalid-frontmatter",
      message: "finding limit reached; additional findings suppressed",
    });
  });

  it("points a non-leading YAML directive at the directive line", () => {
    const result = reifyMarkdownCarrier(
      `---
id: spec:markdown.review-08
%YAML 1.2
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Review-08 Markdown
`,
      "directive.sdp.md",
    );
    const directive = result.findings.find((finding) =>
      finding.message.includes("YAML directives are not accepted"),
    );

    expect(directive?.line).toBe(3);
  });

  it("accepts inherited object names as first authored Design keys and Model terms", () => {
    const result = reifyMarkdownCarrier(
      markdown(
        "",
        `
## Design

- constructor: A real design field.

## Model

- **constructor** — A real domain term.
`,
      ),
      "inherited-names.sdp.md",
    );

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toMatchObject({
      design: { constructor: "A real design field." },
      model: { terms: { constructor: "A real domain term." } },
    });
  });

  it("retains __proto__ as an authored Model term", () => {
    const result = reifyMarkdownCarrier(
      markdown(
        "",
        `
## Model

- **__proto__** — Something authored.
`,
      ),
      "proto-model-term.sdp.md",
    );
    const model = result.specs[0]?.data.model;

    if (
      model === undefined ||
      model === null ||
      typeof model !== "object" ||
      !("terms" in model) ||
      model.terms === null ||
      typeof model.terms !== "object"
    )
      throw new Error("expected Model terms to reify as an object");
    const terms = model.terms;

    expect(result.findings).toEqual([]);
    expect(Object.hasOwn(terms, "__proto__")).toBe(true);
    expect(Object.getOwnPropertyDescriptor(terms, "__proto__")?.value).toBe("Something authored.");
  });

  it("reports duplicate __proto__ Model terms", () => {
    const result = reifyMarkdownCarrier(
      markdown(
        "",
        `
## Model

- **__proto__** — First authored definition.
- **__proto__** — Duplicate authored definition.
`,
      ),
      "duplicate-proto-model-terms.sdp.md",
    );

    expect(result.findings).toContainEqual(
      expect.objectContaining({ message: "model terms must be unique" }),
    );
  });
});

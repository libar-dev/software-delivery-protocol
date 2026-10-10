import { describe, expect, it } from "vitest";

import { createReader, renderDesignReview, schemaVersion, spec, specId } from "../src/index.js";
import type { DesignReviewPage, GraphSchema } from "../src/index.js";
import { renderInlineCode } from "../src/projections/design-review-markdown.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

function pageByPath(pages: readonly DesignReviewPage[], path: string): string {
  const page = pages.find((entry) => entry.path === path);

  if (page === undefined) {
    throw new Error(`Missing page ${path}`);
  }

  return page.content;
}

describe("review-08 Design Review rendering", () => {
  it("preserves authored boundary spaces inside inline code", () => {
    expect(renderInlineCode(" padded ")).toBe("`  padded  `");
  });

  it.each(["design", "ui"] as const)("renders %s values as authored list bytes", (section) => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.literal-json"),
          title: "Literal values",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          [section]: {
            description: "Section prose.\nSecond paragraph.",
            zeta: "plain text",
            alpha: "first line\nsecond `line` | <tag> & #\n\nlast line",
            empty: "",
            number: 3,
            boolean: true,
            null: null,
            array: ["Review <design> & safely.", { z: true, a: null }],
            object: { z: "Keep `code` literal.", a: [1, false] },
            "`a|x`": "Keep `code` | # <tag> > & \\ *stars* [link](url) _text_",
          },
        }),
      ],
    });
    const page = pageByPath(renderDesignReview(createReader(graph)), "spec/orders.literal-json.md");
    const rendered = page
      .split(`## ${section === "design" ? "Design" : "Ui"}\n\n`)[1]
      ?.split("\n\n## ")[0];

    expect(rendered).toBe(
      [
        "Section prose.",
        "Second paragraph.",
        "",
        "- `zeta`: plain text",
        "- `alpha`: first line",
        "  second \\`line\\` \\| &lt;tag&gt; &amp; \\#",
        "  ",
        "  last line",
        "- `empty`:",
        "- `number`: `3`",
        "- `boolean`: `true`",
        "- `null`: `null`",
        "- `array`:",
        "",
        "  ```json",
        "  [",
        '    "Review <design> & safely.",',
        "    {",
        '      "z": true,',
        '      "a": null',
        "    }",
        "  ]",
        "  ```",
        "- `object`:",
        "",
        "  ```json",
        "  {",
        '    "z": "Keep `code` literal.",',
        '    "a": [',
        "      1,",
        "      false",
        "    ]",
        "  }",
        "  ```",
        "- `` `a|x` ``: Keep \\`code\\` \\| \\# &lt;tag&gt; &gt; &amp; \\\\ *stars* [link](url) _text_",
      ].join("\n"),
    );
    expect(rendered).not.toContain("description");
  });

  it("preserves literal finding locations inside delimiter-safe table code spans", () => {
    const graph: GraphSchema = {
      schemaVersion,
      nodes: [
        {
          id: "spec:orders.literal-location",
          nodeType: "Primitive",
          claim: "declared",
          specKind: "behavior",
          altitude: "story",
          readiness: "idea",
          title: "Literal location",
          file: "specs/`location<&|\ncontinuation.sdp.md",
        },
      ],
      edges: [
        {
          from: "spec:orders.literal-location",
          type: "dependsOn",
          to: "spec:orders.missing",
          claim: "declared",
        },
      ],
    };
    const page = pageByPath(
      renderDesignReview(createReader(graph)),
      "spec/orders.literal-location.md",
    );
    const findingRows = page
      .split("\n")
      .filter((line) => line.includes("conformance/referential-integrity"));
    const findingRow = findingRows[0];

    expect(findingRows).toHaveLength(1);
    expect(findingRow).toContain("specs/`location<&\\| continuation.sdp.md");
    expect(findingRow).not.toContain("&lt;");
    expect(findingRow).not.toContain("&amp;");
    expect(findingRow).toContain("\\|");
  });
});

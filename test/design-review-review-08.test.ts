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

  it("preserves fenced JSON data while sorting raw keys by code unit", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:orders.literal-json"),
          title: "Literal JSON",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          design: {
            "a|x": "Review <design> & safely.",
            ab: "Keep `code` literal.",
          },
        }),
      ],
    });
    const page = pageByPath(renderDesignReview(createReader(graph)), "spec/orders.literal-json.md");
    const fenced = /```json\n([\s\S]*?)\n```/u.exec(page)?.[1];

    expect(fenced).toBeDefined();
    expect(JSON.parse(fenced ?? "{}")).toEqual({
      ab: "Keep `code` literal.",
      "a|x": "Review <design> & safely.",
    });
    expect(fenced?.indexOf('"ab"')).toBeLessThan(fenced?.indexOf('"a|x"') ?? -1);
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

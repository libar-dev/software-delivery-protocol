import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import {
  extract,
  extractFindingIds,
  graphValidatorIds,
  serializeGraph,
  validateGraph,
} from "../src/index.js";
import type { Finding } from "../src/index.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const materializedRoots: string[] = [];

function corpusRoot(name: string): string {
  const root = materializeExtractCorpus(name);
  materializedRoots.push(root);
  return root;
}

function pin(finding: Finding): readonly (string | number | null)[] {
  return [
    finding.file ?? null,
    finding.line ?? null,
    finding.validatorId,
    finding.path ?? null,
    finding.relatedId ?? null,
  ];
}

afterAll(() => {
  for (const root of materializedRoots) {
    removeMaterializedCorpus(root);
  }
});

describe("the annotation corpora", () => {
  it("annotation-forms: a comment-form file that imports nothing and a constant-form file on the anchors subpath derive one clean graph", () => {
    const result = extract({ root: corpusRoot("annotation-forms") });

    expect(result.report.findings).toEqual([]);
    expect(result.counts).toEqual({ specs: 4, packs: 0, anchors: 8 });
    expect(validateGraph(result.graph).findings).toEqual([]);

    const goldenPath = fileURLToPath(
      new URL("./fixtures/extract/annotation-forms/expected-graph.json", import.meta.url),
    );
    expect(serializeGraph(result.graph)).toBe(readFileSync(goldenPath, "utf8"));

    // Plural targets: one satisfies edge per target; the decision reached by references alone.
    expect(
      result.graph.edges.filter(
        (edge) => edge.from === "impl:platform.rebuild" && edge.type === "satisfies",
      ),
    ).toHaveLength(2);
    expect(
      result.graph.edges
        .filter((edge) => edge.to === "spec:decisions.history-posture")
        .map((edge) => [edge.from, edge.type, edge.claim])
        .sort(),
    ).toEqual([
      ["impl:platform.gate", "references", "anchored"],
      ["impl:platform.rebuild", "references", "anchored"],
    ]);
    expect(
      result.graph.nodes.find((node) => node.id === "spec:decisions.history-posture"),
    ).not.toHaveProperty("deliveryFacts");
    expect(result.graph.nodes.find((node) => node.id === "component:platform.read-model")).toEqual(
      expect.objectContaining({ layer: "application", context: "platform" }),
    );
    expect(result.graph.nodes.find((node) => node.id === "impl:platform.barrel")).toEqual(
      expect.objectContaining({ role: "barrel", file: "src/constant-form.ts" }),
    );
  });

  it("annotation-refusals: every refusal of the two forms reports once and withholds its anchor", () => {
    const result = extract({ root: corpusRoot("annotation-refusals") });
    const envelope = extractFindingIds.nonStaticEnvelope;

    expect(result.counts).toEqual({ specs: 4, packs: 0, anchors: 0 });
    expect(result.graph.nodes.filter((node) => node.nodeType !== "Primitive")).toEqual([]);
    expect(result.report.findings.map(pin)).toEqual([
      ["src/comment-refusals.ts", 3, envelope, "sdpStatus", null],
      ["src/comment-refusals.ts", 7, envelope, "id", null],
      ["src/comment-refusals.ts", 15, envelope, "role", null],
      ["src/comment-refusals.ts", 19, envelope, "verifies", null],
      ["src/comment-refusals.ts", 21, envelope, "satisfies", null],
      ["src/comment-refusals.ts", 27, envelope, "verifies", null],
      ["src/comment-refusals.ts", 32, extractFindingIds.invalidId, "id", null],
      ["src/comment-refusals.ts", 37, extractFindingIds.invalidId, "id", null],
      ["src/comment-refusals.ts", 43, envelope, "layer", null],
      ["src/comment-refusals.ts", 49, envelope, "layer", null],
      ["src/comment-refusals.ts", 50, envelope, "context", null],
      ["src/comment-refusals.ts", 56, envelope, "satisfies[1]", null],
      ["src/comment-refusals.ts", 57, envelope, null, null],
      ["src/comment-refusals.ts", 63, envelope, "uses[1]", null],
      ["src/comment-refusals.ts", 69, envelope, "models", null],
      ["src/comment-refusals.ts", 75, envelope, "role", null],
      ["src/comment-refusals.ts", 79, envelope, "verifies", null],
      [
        "src/comment-refusals.ts",
        88,
        graphValidatorIds.structuralAnchors,
        "references",
        "spec:platform.gate",
      ],
      ["src/comment-refusals.ts", 93, envelope, null, null],
      ["src/constant-refusals.ts", 5, envelope, "satisfies", null],
      ["src/constant-refusals.ts", 10, envelope, "satisfies", null],
      ["src/constant-refusals.ts", 15, envelope, "layer", null],
      ["src/constant-refusals.ts", 20, envelope, "context", null],
      ["src/constant-refusals.ts", 25, envelope, "role", null],
      ["src/constant-refusals.ts", 30, envelope, "role", null],
      ["src/constant-refusals.ts", 35, envelope, "verifies", null],
    ]);

    const messageAt = (line: number): string =>
      result.report.findings.find(
        (finding) => finding.file === "src/comment-refusals.ts" && finding.line === line,
      )?.message ?? "";
    expect(messageAt(3)).toContain("not a reserved anchor tag");
    expect(messageAt(7)).toContain("must open its anchor with @sdpAnchor");
    expect(messageAt(15)).toContain("authored more than once");
    expect(messageAt(21)).toContain("outside the binding contract (id · verifies · label)");
    expect(messageAt(43)).toContain("the layer set is closed");
    expect(messageAt(49)).toContain("belongs to a component: anchor only");
    expect(messageAt(57)).toContain("wrapped target is refused");
    expect(messageAt(63)).toContain("empty list item");
    expect(messageAt(69)).toContain("exactly one is required");
    expect(messageAt(75)).toContain("vocabulary, never prose");
    expect(messageAt(93)).toContain("misplaced reserved tag");
  });
});

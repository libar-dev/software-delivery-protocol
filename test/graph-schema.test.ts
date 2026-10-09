import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  createReader,
  deliveryFactNames,
  derivedEdgeTypes,
  extract,
  graphEdgeTypes,
  graphNodeTypes,
  renderDesignReview,
  schemaVersion,
  serializeGraph,
  spec,
  specId,
} from "../src/index.js";

import type { GraphSchema, PrimitiveNode } from "../src/index.js";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

const openSectionOrderTestAnchor = specTest({
  id: testAnchorId("test:protocol.open-section-order"),
  label: "verifies serialized authored entry order",
  verifies: ref("spec:extraction.open-section-order"),
});
void openSectionOrderTestAnchor;

describe("graph schema", () => {
  it("serializes authored entry order with description first and schema 0.8.0", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:probe.order"),
          title: "Authored order",
          kind: "model",
          altitude: "story",
          readiness: "idea",
          design: {
            zeta: "z",
            alpha: "a",
            description: "Design prose.",
            mid10: "ten",
            mid2: "two",
          },
          ui: { zeta: "z", alpha: "a", description: "UI prose.", mid10: "ten", mid2: "two" },
          model: { terms: { zebra: "z", apple: "a" } },
        }),
      ],
    });
    const serialized = JSON.parse(serializeGraph(graph)) as GraphSchema;
    const node = serialized.nodes.find((entry) => entry.nodeType === "Primitive");
    expect(serialized.schemaVersion).toBe("0.8.0");
    expect(Object.keys(node?.sections?.design ?? {})).toEqual([
      "description",
      "zeta",
      "alpha",
      "mid10",
      "mid2",
    ]);
    expect(Object.keys(node?.sections?.ui ?? {})).toEqual([
      "description",
      "zeta",
      "alpha",
      "mid10",
      "mid2",
    ]);
    expect(Object.keys(node?.sections?.model?.terms ?? {})).toEqual(["zebra", "apple"]);
  });
  it("gives the reader, the serialized graph, and the Design Review one entry order", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-entry-order-"));

    try {
      writeFileSync(
        join(root, "order.sdp.ts"),
        `import { spec, specId } from "@libar-dev/software-delivery-protocol";
export const order = spec({
  id: specId("spec:probe.order"),
  title: "Description authored last",
  kind: "model",
  altitude: "story",
  readiness: "idea",
  intent: { outcome: "Author each section's description after its entries." },
  design: { zeta: "z", alpha: "a", description: "Design prose." },
  ui: { zeta: "z", alpha: "a", description: "UI prose." },
});
`,
      );
      writeFileSync(
        join(root, "terms.sdp.md"),
        `---
id: spec:probe.terms
kind: model
altitude: story
readiness: idea
relations: {}
---
# A Model term named description

## Intent
- outcome: Carry a Model term named description between two others.

## Model
The Model prose.

- **zeta** — The last letter.
- **description** — An ordinary term.
- **alpha** — The first letter.
`,
      );

      const { graph, report } = extract({ root });
      expect(report.findings).toEqual([]);

      const openOrder = ["description", "zeta", "alpha"];
      const termOrder = ["zeta", "description", "alpha"];
      const reader = createReader(graph);
      const read = reader.specContext("spec:probe.order")?.sections;
      expect(Object.keys(read?.design ?? {})).toEqual(openOrder);
      expect(Object.keys(read?.ui ?? {})).toEqual(openOrder);
      expect(
        Object.keys(reader.specContext("spec:probe.terms")?.sections?.model?.terms ?? {}),
      ).toEqual(termOrder);

      const serialized = JSON.parse(serializeGraph(graph)) as GraphSchema;
      const serializedSections = (id: string) =>
        serialized.nodes.find(
          (node): node is PrimitiveNode => node.nodeType === "Primitive" && node.id === id,
        )?.sections;
      expect(Object.keys(serializedSections("spec:probe.order")?.design ?? {})).toEqual(openOrder);
      expect(Object.keys(serializedSections("spec:probe.order")?.ui ?? {})).toEqual(openOrder);
      expect(Object.keys(serializedSections("spec:probe.terms")?.model?.terms ?? {})).toEqual(
        termOrder,
      );

      const pages = renderDesignReview(reader);
      const page = (path: string) => pages.find((entry) => entry.path === path)?.content ?? "";
      expect(page("spec/probe.order.md")).toContain(
        "## Design\n\nDesign prose.\n\n- `zeta`: z\n- `alpha`: a",
      );
      expect(page("spec/probe.order.md")).toContain(
        "## Ui\n\nUI prose.\n\n- `zeta`: z\n- `alpha`: a",
      );
      expect(page("spec/probe.terms.md")).toContain(
        "The Model prose.\n\n| Term | Definition |\n|---|---|\n| zeta | The last letter. |\n| description | An ordinary term. |\n| alpha | The first letter. |",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("serializes question text, optional blocking and optional key in canonical order", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:probe.questions"),
          title: "Question serialization",
          kind: "behavior",
          altitude: "story",
          readiness: "idea",
          intent: {
            openQuestions: [
              { key: "settled", blocking: false, question: "Is it settled?" },
              { key: "named", question: "Is it named?" },
              { blocking: true, question: "Is it blocked?" },
              { question: "Is it open?" },
              "A string question",
            ],
          },
        }),
      ],
    });
    const payload = JSON.parse(serializeGraph(graph)) as GraphSchema;
    const node = payload.nodes.find(
      (entry): entry is PrimitiveNode => entry.nodeType === "Primitive",
    );
    const questions = node?.sections?.intent?.openQuestions ?? [];
    expect(questions).toEqual([
      { question: "Is it settled?", blocking: false, key: "settled" },
      { question: "Is it named?", key: "named" },
      { question: "Is it blocked?", blocking: true },
      { question: "Is it open?" },
      "A string question",
    ]);
    expect(
      questions.map((question) => (typeof question === "string" ? [] : Object.keys(question))),
    ).toEqual([
      ["question", "blocking", "key"],
      ["question", "key"],
      ["question", "blocking"],
      ["question"],
      [],
    ]);
  });

  it("exports the graph schema contracts", () => {
    expect(schemaVersion).toBe("0.8.0");
    expect(graphNodeTypes).toEqual(["Primitive", "Pack", "Anchor", "CodeNode"]);
    expect(deliveryFactNames).toEqual(["implemented", "has-verifier", "observed"]);
    expect(derivedEdgeTypes).toEqual([
      "belongsTo",
      "satisfies",
      "models",
      "memberOf",
      "uses",
      "references",
    ]);
    expect(graphEdgeTypes).toEqual([
      "refines",
      "dependsOn",
      "constrainedBy",
      "decidedBy",
      "verifies",
      "supersedes",
      "belongsTo",
      "satisfies",
      "models",
      "memberOf",
      "uses",
      "references",
    ]);
  });
});

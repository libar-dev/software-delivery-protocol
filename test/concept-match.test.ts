import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { createReader, extract } from "../src/index.js";
import { ref, specTest, testAnchorId } from "../src/anchors.js";
import { matchConcept } from "../src/reader/concept-match.js";
import { searchRecords, type SearchRecord } from "../src/studio-elements/search-results.js";

const anchor = specTest({
  id: testAnchorId("test:protocol.studio-concept-match"),
  verifies: ref("spec:consumers.spec-studio.search"),
});
void anchor;

const corpora = [
  extract({
    root: process.cwd(),
    exclude: ["explorations", "examples", "test/fixtures/import/parity"],
  }).graph,
  extract({ root: `${process.cwd()}/examples/checkout-v1` }).graph,
];

describe("the concept matcher shared by the reader and Studio", () => {
  it("ships a standalone matcher module with no Node dependency", () => {
    const module = readFileSync(
      new URL("../dist/reader/concept-match.js", import.meta.url),
      "utf8",
    );
    expect(module).not.toMatch(/\b(?:import|require)\s*(?:\(|[\s\S]*?from\s*)["']node:/u);
    expect(module).toContain("matchConcept");
  });
  it.each(["order", "ready", "sentinel", "POST /ORDERS", "inventorySnapshot", "given", "", "   "])(
    "keeps reader results and their order for %j on both corpora",
    (term) => {
      for (const graph of corpora) {
        const reader = createReader(graph);
        expect(matchConcept(graph.nodes, term)).toEqual(reader.findByConcept(term));
        const records: SearchRecord[] = graph.nodes.map((node) => ({
          ...node,
          page: null,
          bindings: [],
          entries: [],
        }));
        const baseIds = reader.findByConcept(term).map((match) => match.id);
        const results = searchRecords({ records }, term);
        expect(results.slice(0, baseIds.length).map((hit) => hit.record.id)).toEqual(baseIds);
        expect(results.slice(baseIds.length).map((hit) => hit.record.id)).toEqual(
          results
            .slice(baseIds.length)
            .map((hit) => hit.record.id)
            .sort(),
        );
      }
    },
  );

  it("pins ranking and the fields the reader scans independently of its caller", () => {
    expect(
      matchConcept(
        [
          {
            id: "spec:z.needle",
            nodeType: "Primitive",
            title: "Needle",
            sections: { design: { needle: 42 } },
          },
          { id: "spec:a", nodeType: "Primitive", title: "Needle" },
          { id: "impl:a", nodeType: "CodeNode", label: "Needle" },
          { id: "pack:a", nodeType: "Pack", framing: "Needle" },
          {
            id: "spec:b",
            nodeType: "Primitive",
            narrative: "Needle",
            sections: { intent: { outcome: "Needle" }, model: { terms: { needle: 42 } } },
          },
        ],
        " NEEDLE ",
      ),
    ).toEqual([
      { id: "spec:z.needle", nodeType: "Primitive", title: "Needle", matchedIn: ["id", "title"] },
      { id: "spec:a", nodeType: "Primitive", title: "Needle", matchedIn: ["title"] },
      { id: "impl:a", nodeType: "CodeNode", matchedIn: ["label"] },
      { id: "pack:a", nodeType: "Pack", matchedIn: ["framing"] },
      {
        id: "spec:b",
        nodeType: "Primitive",
        matchedIn: ["narrative", "sections.intent", "sections.model"],
      },
    ]);
  });

  it("appends only coined-key and file matches, after concept matches", () => {
    const records: SearchRecord[] = [
      {
        id: "spec:z",
        nodeType: "Primitive",
        page: "specs/z.html",
        title: "Needle",
        bindings: [],
        entries: [],
      },
      {
        id: "spec:b",
        nodeType: "Primitive",
        page: "specs/b.html",
        sections: { design: { needleKey: 42 } },
        bindings: [],
        entries: [
          {
            section: "design",
            entry: "needleKey",
            key: "needleKey",
            text: "42",
            address: "spec:b#design.needleKey",
            line: 8,
          },
        ],
      },
      {
        id: "impl:a",
        nodeType: "CodeNode",
        page: null,
        file: "src/needle.ts",
        bindings: [],
        entries: [],
      },
      {
        id: "spec:c",
        nodeType: "Primitive",
        page: null,
        sections: { intent: { needle: 42 } },
        bindings: [],
        entries: [],
      },
    ];
    expect(
      searchRecords({ records }, "needle").map((hit) => [hit.record.id, hit.matchedIn]),
    ).toEqual([
      ["spec:z", ["title"]],
      ["impl:a", ["file"]],
      ["spec:b", ["key"]],
    ]);
    expect(searchRecords({ records }, " ")).toEqual([]);
  });
});

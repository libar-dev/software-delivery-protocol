import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { deriveGraph } from "../src/extract/derive.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { extract } from "../src/extract/index.js";
import { schemaVersion } from "../src/graph/schema.js";
import type { GraphSchema } from "../src/graph/schema.js";
import {
  createStudioData,
  embedData,
  railValues,
  searchIndex,
} from "../src/projections/studio/data.js";
import { pagePath } from "../src/projections/studio/paths.js";
import { createReader } from "../src/reader/reader.js";
import { entryMatches } from "../src/studio-elements/search-results.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const anchor = specTest({
  id: testAnchorId("test:protocol.studio-data"),
  verifies: [ref("spec:consumers.spec-studio.data"), ref("spec:consumers.spec-studio.publisher")],
});
void anchor;

const root = fileURLToPath(new URL("..", import.meta.url));
const corpora = [
  { name: "Protocol", root, exclude: ["explorations", "examples", "test/fixtures/import/parity"] },
  { name: "checkout", root: join(root, "examples/checkout-v1"), exclude: [] },
].map((corpus) => ({ ...corpus, extracted: extract(corpus) }));

function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Expected a value");
  return value;
}

function recipeBody(ordinal: number): string {
  const catalog = readFileSync(join(root, "docs/agent-surface/recipes.md"), "utf8");
  const section = catalog.split(new RegExp(`^## ${String(ordinal)}\\. `, "mu"))[1];
  const body = section?.split("```js\n")[1]?.split("\n```")[0];
  if (body === undefined) throw new Error(`recipe ${String(ordinal)} missing`);
  return body;
}

async function recipe<T>(
  ordinal: number,
  corpus: (typeof corpora)[number],
  params: Record<string, unknown>,
): Promise<T> {
  const capture = createCaptureOutput();
  expect(
    await runSdpCli(
      [
        "q",
        recipeBody(ordinal),
        "--root",
        corpus.root,
        "--params",
        JSON.stringify(params),
        "--json",
      ],
      capture.output,
      { query: { extract: () => corpus.extracted } },
    ),
  ).toBe(0);
  return JSON.parse(capture.readStdout()) as T;
}

describe.each(corpora)("Studio data over $name", (corpus) => {
  const reader = createReader(corpus.extracted.graph);

  it("counts every Pack exactly as recipe 29", async () => {
    expect(reader.packs().length).toBeGreaterThan(0);
    const data = await createStudioData(reader);
    for (const pack of reader.packs()) {
      const answer = await recipe<{ totals: unknown }>(29, corpus, { pack: pack.id });
      expect(data.packs.find((p) => p.context.id === pack.id)?.totals).toEqual(answer.totals);
    }
  });

  it("keeps one search record per node, fields unchanged and bindings decoded", () => {
    const records = searchIndex(reader).records;
    expect(records.map((record) => record.id)).toEqual(
      corpus.extracted.graph.nodes.map((node) => node.id).sort(),
    );
    for (const node of corpus.extracted.graph.nodes) {
      const record = required(records.find((candidate) => candidate.id === node.id));
      for (const field of [
        "title",
        "label",
        "framing",
        "narrative",
        "sections",
        "file",
        "line",
      ] as const) {
        expect(record[field]).toEqual(field in node ? node[field as keyof typeof node] : undefined);
      }
      const spec = reader.specContext(node.id);
      expect(record.page).toBe(
        node.nodeType === "Primitive" || node.nodeType === "Pack" ? pagePath(node.id) : null,
      );
      expect(record.bindings).toEqual(
        node.nodeType === "Anchor" || node.nodeType === "CodeNode"
          ? corpus.extracted.graph.edges
              .filter((edge) => edge.from === node.id && reader.specContext(edge.to) !== undefined)
              .map((edge) => ({ edge: edge.type, specId: edge.to }))
          : [],
      );
      expect(record.floorReached).toBe(
        spec === undefined ? undefined : (spec.derivedReadiness ?? null),
      );
      expect(record.statedReadiness).toBe(spec?.statedReadiness);
    }
  });

  it.each(["suffix", "rule", "type", "outcome", "order", "decision", "graphOnly"])(
    "matches recipe 23's exact rows for %s",
    async (term) => {
      const answer = await recipe<{
        matches: { matchedIn: string[] }[];
        totals: { matches: number };
      }>(23, corpus, {
        term,
      });
      const rows = searchIndex(reader).records.flatMap((record) =>
        record.entries.flatMap((entry) => {
          const row = {
            section: entry.section,
            entry: entry.entry,
            address: entry.address,
            line: entry.line,
            text: entry.text,
          };
          return entryMatches(record, entry, term) ? [{ id: record.id, ...row }] : [];
        }),
      );
      expect(rows.slice(0, 50)).toEqual(
        answer.matches.map(({ matchedIn, ...row }) => {
          void matchedIn;
          return row;
        }),
      );
      expect(rows.length).toBe(answer.totals.matches);
    },
  );

  it("keeps rails in Pack-id and authored-member order, with severity and space ownership", async () => {
    const rails = railValues(reader);
    expect(rails.packs.map((pack) => pack.id)).toEqual(
      reader
        .packs()
        .map((pack) => pack.id)
        .sort(),
    );
    for (const pack of rails.packs) {
      expect(pack.members.map((member) => member.id)).toEqual(
        reader.packContext(pack.id)?.members.map((member) => member.id),
      );
      for (const member of pack.members)
        expect(member.ownsExampleSpace).toBe(
          reader.specContext(member.id)?.sections?.behavior?.exampleSpace !== undefined,
        );
    }
    expect(rails.findings).toEqual({
      errors: reader.findings().filter((finding) => finding.severity === "error").length,
      warnings: reader.findings().filter((finding) => finding.severity === "warning").length,
    });
    const data = await createStudioData(reader);
    expect(data.specs).toEqual(reader.specs().map((spec) => reader.specContext(spec.id)));
    expect(data.findings).toEqual(reader.findings());
    expect(data.packs.map((pack) => pack.context)).toEqual(
      reader.packs().map((pack) => reader.packContext(pack.id)),
    );
    expect(data.rail).toEqual(rails);
  });
});

it("serializes embedded JSON with no literal less-than character", () => {
  const value = { text: "</script><script>bad()</script>", unicode: "<ä" };
  const encoded = embedData(value);
  expect(encoded).not.toContain("<");
  expect(encoded).toContain("\\u003c/script>");
  expect(JSON.parse(encoded)).toEqual(value);
});

it("encodes uppercase ids without case-insensitive page collisions", () => {
  expect(pagePath("spec:demo.CreateOrder")).toBe("specs/demo._create_order.html");
  expect(pagePath("pack:Demo")).toBe("packs/_demo.html");
  expect(pagePath("impl:demo")).toBeNull();
  expect(pagePath("spec:demo.CreateOrder")?.toLowerCase()).not.toBe(
    pagePath("spec:demo.createorder")?.toLowerCase(),
  );
});

it("preserves coined non-string entries, question and rule addresses and their lines", () => {
  const graph: GraphSchema = {
    schemaVersion,
    nodes: [
      {
        id: "spec:probe.entries",
        nodeType: "Primitive",
        claim: "declared",
        specKind: "behavior",
        altitude: "story",
        readiness: "idea",
        file: "probe.sdp.md",
        narrative: "Text",
        sections: {
          intent: {
            outcome: "Outcome",
            openQuestions: [{ question: "Question", key: "whyHere", blocking: false }],
          },
          behavior: { rules: ["Rule"], ruleKeys: { oneRule: "rules[0]" } },
          design: { coinedShape: { nested: "Nested" } },
        },
      },
    ],
    edges: [],
    locations: [
      { spec: "spec:probe.entries", entry: "design.coinedShape", file: "probe.sdp.md", line: 20 },
      { spec: "spec:probe.entries", entry: "question[0]", file: "probe.sdp.md", line: 12 },
      { spec: "spec:probe.entries", entry: "rule[0]", file: "probe.sdp.md", line: 16 },
    ],
  };
  const entries = required(searchIndex(createReader(graph)).records[0]).entries;
  expect(entries).toContainEqual({
    section: "design",
    entry: "coinedShape",
    key: "coinedShape",
    address: "spec:probe.entries#design.coinedShape",
    line: 20,
    text: '{"nested":"Nested"}',
  });
  expect(entries).toContainEqual({
    section: "design",
    entry: "coinedShape.nested",
    key: "nested",
    address: null,
    line: null,
    text: "Nested",
  });
  expect(entries).toContainEqual({
    section: "intent",
    entry: "openQuestions[0].question",
    key: "whyHere",
    address: "spec:probe.entries#question.whyHere",
    line: 12,
    text: "Question",
  });
  expect(entries).toContainEqual({
    section: "behavior",
    entry: "rules[0]",
    key: "oneRule",
    address: "spec:probe.entries#rule.oneRule",
    line: 16,
    text: "Rule",
  });
  expect(
    entries.some(
      (entry) =>
        entry.entry?.includes("ruleKeys") === true || entry.entry?.endsWith(".key") === true,
    ),
  ).toBe(false);
});

it("keeps term addresses, keys and physical lines aligned with recipe 23", async () => {
  const source = `---
id: spec:probe.terms
kind: model
altitude: story
readiness: scoped
relations: {}
---
# Terms

## Intent
- outcome: Address terms.

## Model
- **step key** — [#durableIdentity] Stable identity across wording changes.
- **slot** — An unkeyed parameter.
`;
  const reified = reifyMarkdownCarrier(source, "terms.sdp.md");
  const graph = deriveGraph(reified.specs, [], []);
  const corpus = {
    name: "terms",
    root,
    exclude: [],
    extracted: {
      graph,
      report: { validatorId: "extract", findings: reified.findings },
      counts: { specs: 1, packs: 0, anchors: 0 },
    },
  };
  const index = searchIndex(createReader(graph));
  const record = required(index.records[0]);
  const row = required(record.entries.find((entry) => entry.entry === "terms.step key"));
  expect(row.address).toBe("spec:probe.terms#term.durableIdentity");
  expect(row.line).toBe(
    source.split("\n").findIndex((line) => line.startsWith("- **step key**")) + 1,
  );
  expect(record.entries.some((entry) => entry.entry?.startsWith("termKeys"))).toBe(false);
  for (const term of ["step key", "durableIdentity", "slot"]) {
    const answer = await recipe<{
      matches: {
        id: string;
        section: string;
        entry: string;
        address: string | null;
        line: number | null;
        text: string;
        matchedIn: string[];
      }[];
    }>(23, corpus, { term });
    if (term === "durableIdentity") {
      expect(answer.matches).toEqual([
        {
          id: "spec:probe.terms",
          section: "model",
          entry: "terms.step key",
          address: "spec:probe.terms#term.durableIdentity",
          line: row.line,
          text: "Stable identity across wording changes.",
          matchedIn: ["key"],
        },
      ]);
      expect(entryMatches(record, row, term)).toBe(true);
    }
    const rows = record.entries
      .filter((entry) => entryMatches(record, entry, term))
      .map(({ key, ...row }) => {
        void key;
        return { id: record.id, ...row };
      });
    expect(rows).toEqual(
      answer.matches.map(({ matchedIn, ...row }) => {
        void matchedIn;
        return row;
      }),
    );
  }
});

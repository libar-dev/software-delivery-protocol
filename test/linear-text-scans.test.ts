import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { Project } from "ts-morph";
import { describe, expect, it } from "vitest";

import { recipeFiles } from "../src/cli/build-artifacts.js";
import { reifyAnchorSourceFile } from "../src/extract/anchors.js";
import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { hasRawHtmlOutsideCodeSpans } from "../src/extract/markdown-inline-code.js";
import { parseSlots } from "../src/notation/slots.js";
import { searchRecords, type SearchRecord } from "../src/studio-elements/search-results.js";
import {
  deriveGraph,
  evaluateBody,
  extractFindingIds,
  reifyMarkdownCarrier,
  validateGraph,
} from "../src/index.js";
import { mentionTokens } from "../src/validate/validators.js";

// Each scan below once retried a regex from every start inside one long run, so its cost grew
// with the square of the run: tens of thousands of characters took seconds. Each input here took
// several seconds that way; a linear scan takes milliseconds, and the budget leaves room for a
// loaded machine while a quadratic scan still exceeds it several times.
const RUN = 50_000;
const budgetMs = 1_000;

function timed<T>(work: () => T): { readonly value: T; readonly ms: number } {
  const start = performance.now();
  const value = work();
  return { value, ms: performance.now() - start };
}

async function timedAsync<T>(work: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const start = performance.now();
  const value = await work();
  return { value, ms: performance.now() - start };
}

const catalog = readFileSync(
  fileURLToPath(new URL("../docs/agent-surface/recipes.md", import.meta.url)),
  "utf8",
);

function recipeBody(ordinal: number): string {
  const file = recipeFiles(catalog).find((candidate) => candidate.ordinal === ordinal);
  if (file === undefined) throw new Error(`recipe ${String(ordinal)} is missing`);
  return file.content;
}

/** A one-Spec graph whose narrative is the given prose, with its validation report. */
function narrativeGraph(narrative: string) {
  const reified = reifyMarkdownCarrier(
    `---
id: spec:probe.long
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Long prose

${narrative}

## Intent

- outcome: Carry one long narrative line.
`,
    "specs/long.sdp.md",
  );
  expect(reified.findings).toEqual([]);
  const graph = deriveGraph(reified.specs, reified.packs, []);
  return { graph, report: validateGraph(graph) };
}

describe("prose mention scans", () => {
  const dots = ".".repeat(RUN);

  it("trims a mention's trailing punctuation linearly and keeps an interior run", () => {
    const { value, ms } = timed(() => mentionTokens(`See spec:a${dots}b and spec:c.d${dots}`));

    // Compared as booleans: a failing match would otherwise print the whole run.
    expect(value.length).toBe(2);
    expect(value[0] === `spec:a${dots}b`).toBe(true);
    expect(value[1]).toBe("spec:c.d");
    expect(mentionTokens("(spec:a.b), spec:c_*~; spec:!?")).toEqual(["spec:a.b", "spec:c"]);
    expect(ms).toBeLessThan(budgetMs);
  });

  it("keeps the mention audit recipe linear on an interior punctuation run", async () => {
    const { graph, report } = narrativeGraph(`See spec:a${dots}b here.`);
    const body = recipeBody(22);
    const { value, ms } = await timedAsync(() => evaluateBody(body, { graph, report }));

    const unresolved = (value as { unresolved: readonly { to: string }[] }).unresolved;
    expect(unresolved.map((pair) => pair.to === `spec:a${dots}b`)).toEqual([true]);
    expect(ms).toBeLessThan(budgetMs);
  });
});

describe("anchor comment lines", () => {
  const project = new Project({ useInMemoryFileSystem: true });

  it("reads a doc comment with a long interior blank run linearly", () => {
    const sourceFile = project.createSourceFile(
      "src/padded.ts",
      `/**
 * A diagram: left${" ".repeat(RUN)}right
 *
 * @sdpAnchor impl:probe.padded
 * @sdpSatisfies spec:probe.target
 */
export const padded = 1;
`,
    );
    const { value, ms } = timed(() => reifyAnchorSourceFile(sourceFile, "src/padded.ts"));

    expect(value.findings).toEqual([]);
    expect(value.anchors.map((anchor) => [anchor.id, anchor.line])).toEqual([
      ["impl:probe.padded", 1],
    ]);
    expect(ms).toBeLessThan(budgetMs);
  });
});

describe("Markdown raw HTML guard", () => {
  // The guard's verdict before the linear rewrite, kept as the reference it must still match.
  const reference = /<\/?[A-Za-z][^>]*>|<!--|-->|<![A-Za-z]|<\?/u;

  it("decides a line of unclosed openings linearly", () => {
    const line = `Types ${"x<a".repeat(RUN)}`;
    const { value, ms } = timed(() => hasRawHtmlOutsideCodeSpans(line));

    expect(value).toBe(false);
    expect(hasRawHtmlOutsideCodeSpans(`${line}>`)).toBe(true);
    expect(ms).toBeLessThan(budgetMs);
  });

  it("keeps a lawful prose line of unclosed openings in the carrier", () => {
    const { ms } = timed(() => narrativeGraph(`Types ${"x<a".repeat(RUN)}`));

    expect(ms).toBeLessThan(budgetMs);
  });

  it.each([
    "a <b> c",
    "Promise<T",
    "x</a y",
    "x</a>",
    "a<!-- c",
    "a --> c",
    "<!DOCTYPE",
    "<?xml",
    "a < b > c",
    "a<b c>",
    "1 <2> 3",
    "x<a y> z<b",
    "<",
    "a>b<c",
    "a>b<c>",
    "</>",
    "<a/",
    "plain",
  ])("decides %j as the reference regex does", (text) => {
    expect(hasRawHtmlOutsideCodeSpans(text)).toBe(reference.test(text));
  });
});

describe("slot number literals", () => {
  it("refuses a long digit run before a non-digit linearly", () => {
    const { value, ms } = timed(() => parseSlots(`a cart with {n: ${"0".repeat(RUN)}-} items`));

    expect(value.map((group) => group.form)).toEqual(["malformed"]);
    expect(ms).toBeLessThan(budgetMs);
  });

  it.each([
    ["2", 2],
    ["-2", -2],
    ["2.", 2],
    ["2.5", 2.5],
    [".5", 0.5],
    ["-.5", -0.5],
    ["00", 0],
  ] as const)("binds the number literal %s", (literal, value) => {
    expect(parseSlots(`{n: ${literal}}`)).toEqual([
      expect.objectContaining({ form: "bound", name: "n", value }),
    ]);
  });

  it.each(["1.2.3", "-", ".", "0x1", "-x"])("reads %s as no number", (literal) => {
    expect(parseSlots(`{n: ${literal}}`).map((group) => group.form)).toEqual(["malformed"]);
  });
});

describe("Gherkin line scans", () => {
  const tags = "@spec.probe.parent @altitude.feature @readiness.defined";

  it.each([
    ["a lone CR", "\r"],
    ["U+2028", "\u2028"],
    ["U+2029", "\u2029"],
  ])("refuses a padded keyed value holding %s linearly", (_name, separator) => {
    const source = `${tags}\nFeature: Probe\n  - value:${" ".repeat(RUN)}x${separator}y\n`;
    const { value, ms } = timed(() => reifyGherkinCarrier(source, "probe.sdp.gherkin"));

    expect(value.specs).toEqual([]);
    expect(value.findings.map((found) => [found.validatorId, found.line])).toEqual([
      [extractFindingIds.gherkinGrammar, 3],
    ]);
    expect(ms).toBeLessThan(budgetMs);
  });

  it.each([
    ["a lone CR", "\r"],
    ["U+2028", "\u2028"],
  ])("passes a long header-like comment holding %s linearly", (_name, separator) => {
    const source = `# language:g${":".repeat(RUN)}${separator}x\n${tags}\nFeature: Probe\n  - outcome: One graph\n`;
    const { value, ms } = timed(() => reifyGherkinCarrier(source, "probe.sdp.gherkin"));

    expect(value.findings).toEqual([]);
    expect(value.specs.map((spec) => spec.id)).toEqual(["spec:probe.parent"]);
    expect(ms).toBeLessThan(budgetMs);
  });

  it("refuses a language header at the line the parser read it from", () => {
    const found = reifyGherkinCarrier(
      `# leading comment\n# language : fr\n${tags}\nFonctionnalité: Essai\n`,
      "probe.sdp.gherkin",
    ).findings;

    expect(found.map((entry) => [entry.validatorId, entry.line])).toEqual([
      [extractFindingIds.gherkinGrammar, 2],
    ]);
    expect(found[0]?.message).toContain('language "fr" is refused');
  });
});

describe("Studio search tokens", () => {
  const narrative = `${"A".repeat(RUN)} needle`;
  const record: SearchRecord = {
    id: "spec:probe.capitals",
    nodeType: "Primitive",
    page: "specs/probe.capitals.html",
    narrative,
    bindings: [],
    entries: [
      { section: "narrative", entry: null, key: null, address: null, line: null, text: narrative },
    ],
  };

  it("tokenizes a long capital run linearly", () => {
    const { value, ms } = timed(() => searchRecords({ records: [record] }, "needle"));

    expect(value.map((hit) => [hit.record.id, hit.entries.length])).toEqual([
      ["spec:probe.capitals", 1],
    ]);
    expect(ms).toBeLessThan(budgetMs);
  });

  it.each([
    ["HTMLParser", "html parser"],
    ["getHTTPResponseCode", "get http response code"],
    ["XMLHttpRequest", "xml http request"],
    ["ABCDe", "abc de"],
    ["ABcDEf", "a bc d ef"],
    ["ÀÉÎoo", "àé îoo"],
  ])("splits %s into the tokens of %j", (key, term) => {
    const keyed: SearchRecord = {
      ...record,
      narrative: "",
      entries: [{ section: "design", entry: key, key, address: null, line: null, text: "x" }],
    };
    expect(searchRecords({ records: [keyed] }, term).map((hit) => hit.matchedIn)).toEqual([
      ["key"],
    ]);
  });

  it("keeps the entry search recipe linear on a long capital run", async () => {
    const { graph, report } = narrativeGraph(narrative);
    const body = recipeBody(23);
    const { value, ms } = await timedAsync(() =>
      evaluateBody(body, { graph, report, params: { term: "needle" } }),
    );

    const matches = (value as { matches: readonly { section: string }[] }).matches;
    expect(matches.map((match) => match.section)).toEqual(["narrative"]);
    expect(ms).toBeLessThan(budgetMs);
  });
});

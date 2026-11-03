import { Project } from "ts-morph";
import { describe, expect, it } from "vitest";

import { reifyAnchorSourceFile } from "../src/extract/anchors.js";
import { reifyGherkinCarrier } from "../src/extract/gherkin.js";
import { extractFindingIds } from "../src/index.js";

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

describe("Gherkin line scans", () => {
  const tags = "@spec.probe.parent @altitude.feature @readiness.defined";

  it.each([
    ["a lone CR", "\r"],
    ["U+2028", " "],
    ["U+2029", " "],
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
    ["U+2028", " "],
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

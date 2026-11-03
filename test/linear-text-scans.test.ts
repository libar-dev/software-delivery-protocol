import { Project } from "ts-morph";
import { describe, expect, it } from "vitest";

import { reifyAnchorSourceFile } from "../src/extract/anchors.js";

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

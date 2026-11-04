import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/index.js";

// A regex trim retried every start inside an interior run of blanks: one such run of this length
// took seconds, and each carrier below holds two inside its 256 KiB limit. The budget leaves room
// for a slow machine while a quadratic trim still exceeds it several times.
const run = " ".repeat(60_000);
const padded = `word${run}word`;
const budgetMs = 1_000;

function timed<T>(work: () => T): { readonly value: T; readonly ms: number } {
  const start = performance.now();
  const value = work();
  return { value, ms: performance.now() - start };
}

describe("Markdown ASCII trimming", () => {
  it("keeps a long interior blank run in Spec prose and titles linear and intact", () => {
    const source = `---
id: spec:markdown.padded
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Padded${run}title\t \t

${padded}\t
`;
    const { value, ms } = timed(() => reifyMarkdownCarrier(source, "padded.sdp.md"));
    expect(value.findings).toEqual([]);
    // Compared as booleans: a failing match would otherwise print the whole run.
    expect(value.specs[0]?.data.title === `Padded${run}title`).toBe(true);
    expect(value.specs[0]?.data.narrative === padded).toBe(true);
    expect(ms).toBeLessThan(budgetMs);
  });

  it("keeps a long interior blank run in Pack prose and titles linear and intact", () => {
    const source = `---
id: pack:padded
specs: []
---
# Padded${run}pack \t

${padded} \t
`;
    const { value, ms } = timed(() => reifyMarkdownCarrier(source, "padded.pack.sdp.md"));
    expect(value.findings).toEqual([]);
    expect(value.packs[0]?.data.title === `Padded${run}pack`).toBe(true);
    expect(value.packs[0]?.data.framing === padded).toBe(true);
    expect(ms).toBeLessThan(budgetMs);
  });
  it.each(["***", "---", "___"])("keeps thematic-break near misses linear: %s", (marker) => {
    const text = `${marker}${run}text`;
    for (const body of [`## Rule\n- ${text}`, `## Rule\n${text}`, text]) {
      const source = `---\nid: spec:probe.linear\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Title\n${body}`;
      const { value, ms } = timed(() => reifyMarkdownCarrier(source, "linear.sdp.md"));
      // Narrative disallows every leading hyphen; section prose and list text keep this text.
      if (body === text && marker === "---") expect(value.specs).toEqual([]);
      else {
        expect(value.findings).toEqual([]);
        expect(value.specs).toHaveLength(1);
      }
      expect(ms).toBeLessThan(budgetMs);
    }
    const { ms } = timed(() =>
      reifyMarkdownCarrier(
        `---\nid: pack:probe.linear\nspecs: []\n---\n# Pack\n${text}`,
        "linear.pack.sdp.md",
      ),
    );
    expect(ms).toBeLessThan(budgetMs);
  });
});

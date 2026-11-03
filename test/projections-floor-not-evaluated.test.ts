import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createReader, extract } from "../src/index.js";
import type { GraphNode, GraphSchema } from "../src/index.js";
import { renderCensus } from "../src/projections/census.js";
import { renderDesignReview } from "../src/projections/design-review.js";
import { renderVault } from "../src/projections/vault/notes.js";
import { notePath } from "../src/projections/vault/text.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const label = "floor not evaluated (unratified descriptor)";

// A foreign producer's graph: the worked example with an unratified altitude on one Spec and an
// unratified kind on another. Carriers cannot state these values; a graph handed to the reader
// can, and no readiness floor is evaluated over it. Both Specs state a rung above `idea`, so
// reading the absent floor as below `idea` would raise a banner and count them unreached.
// spec:validation.next-rung-floor#rule.notEvaluated
const unratified: Readonly<Record<string, Partial<Record<"specKind" | "altitude", string>>>> = {
  "spec:orders.order-placement-flow": { altitude: "planet" },
  "spec:orders.order-model": { specKind: "saga" },
};
const flagged = Object.keys(unratified);
const example = extract({ root: join(repoRoot, "examples/checkout-v1") }).graph;
const foreign: GraphSchema = {
  ...example,
  nodes: example.nodes.map((node) =>
    node.id in unratified ? ({ ...node, ...unratified[node.id] } as GraphNode) : node,
  ),
};

function pageAt(pages: readonly { path: string; content: string }[], path: string): string {
  const content = pages.find((page) => page.path === path)?.content;
  if (content === undefined) throw new Error(`no page ${path}`);
  return content;
}

/** The table row a Design Review page writes for one Spec, from its link to the line's end. */
function row(page: string, id: string): string {
  const start = page.indexOf(`| [\`${id}\`]`);
  if (start < 0) throw new Error(`no row for ${id}`);
  return page.slice(start, page.indexOf("\n", start));
}

describe("the Design Review over a floor the reader does not evaluate", () => {
  const pages = renderDesignReview(createReader(foreign));

  it("labels the Spec page's floor and raises no below-idea divergence banner", () => {
    for (const id of flagged) {
      const page = pageAt(pages, `spec/${id.slice("spec:".length)}.md`);
      const stated = createReader(foreign).specContext(id)?.statedReadiness ?? "";
      expect(stated, id).not.toBe("idea");
      expect(page, id).toContain(`**Readiness:** stated \`${stated}\` · ${label}`);
      expect(page, id).not.toContain("Readiness divergence");
      expect(page, id).not.toContain("below `idea`");
      expect(page, id).not.toContain("the `idea` floor is unmet");
    }
  });

  it("labels the index and the Pack member table and names no next rung", () => {
    const index = pageAt(pages, "index.md");
    const pack = pageAt(pages, "pack/checkout-v1.md");
    for (const id of flagged) {
      expect(row(index, id), id).toContain(`| ${label} |`);
      const member = row(pack, id);
      expect(member, id).toContain(`| ${label} | — |`);
      expect(member, id).not.toContain("nothing blocks");
    }
  });
});

describe("the census over a floor the reader does not evaluate", () => {
  it("counts it on its own row and leaves it out of not structurally reached", () => {
    const page = pageAt(renderCensus(createReader(foreign)), "index.md");
    expect(page).toContain("| not structurally reached | 0 |");
    expect(page).toContain(`| ${label} | 2 |`);
  });

  it("renders no such row for a corpus whose floors are all evaluated", () => {
    const page = pageAt(renderCensus(createReader(example)), "index.md");
    expect(page).toContain("| not structurally reached | 0 |");
    expect(page).not.toContain(label);
  });
});

describe("the vault over a floor the reader does not evaluate", () => {
  const files = new Map(renderVault(foreign).map((file) => [file.path, file.content]));
  const note = (id: string): string => {
    const content = files.get(notePath(id).slice("sdp/".length));
    if (content === undefined) throw new Error(`no note for ${id}`);
    return content;
  };

  it("labels a Spec note's floor in its head line and its property, with no next rung", () => {
    for (const id of flagged) {
      const content = note(id);
      expect(content, id).toContain('derivedReadiness: "not evaluated"');
      expect(content, id).not.toContain("statedNextRung:");
      const head = content.split("\n").find((line) => line.startsWith(`\`${id}\` · `)) ?? "";
      expect(head, id).toMatch(new RegExp(` · ${label.replace(/[()]/gu, "\\$&")}$`, "u"));
      expect(head, id).not.toContain("floor none");
    }
  });

  it("labels the Pack note's member lines and names no rung nothing blocks", () => {
    const lines = note("pack:checkout-v1").split("\n");
    for (const id of flagged) {
      const member = lines.find((line) => /^\d+\. /u.test(line) && line.includes(`|${id}]]`));
      expect(member, id).toBeDefined();
      expect(member, id).toMatch(new RegExp(` · ${label.replace(/[()]/gu, "\\$&")}$`, "u"));
      expect(member, id).not.toContain("nothing blocks");
    }
  });
});

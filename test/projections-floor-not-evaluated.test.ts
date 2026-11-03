import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// The Design Review and the census are read through the package's public root exports, the seam
// a foreign producer's graph reaches them by. The vault has no root export: its public surface is
// `sdp vault`, which extracts carriers that cannot state these values, so its renderer is the seam.
import { createReader, extract, renderCensus, renderDesignReview } from "../src/index.js";
import type { GraphNode, GraphSchema } from "../src/index.js";
import { renderVault } from "../src/projections/vault/notes.js";
import { notePath } from "../src/projections/vault/text.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const label = "floor not evaluated (unratified descriptor)";
const labelAtEnd = new RegExp(` · ${label.replace(/[()]/gu, "\\$&")}$`, "u");

type Descriptors = Partial<Record<"specKind" | "altitude", string>>;

// A foreign producer's graph: the worked example with an unratified altitude or an unratified kind
// on a Spec. Carriers cannot state these values; a graph handed to the reader can, and no readiness
// floor is evaluated over it. Both Specs state a rung above `idea`, so reading the absent floor as
// below `idea` would raise a banner and count them unreached.
// spec:validation.next-rung-floor#rule.notEvaluated
const altitude = { id: "spec:orders.order-placement-flow", set: { altitude: "planet" } } as const;
const kind = { id: "spec:orders.order-model", set: { specKind: "saga" } } as const;
const example = extract({ root: join(repoRoot, "examples/checkout-v1") }).graph;

function foreignGraph(unratified: Readonly<Record<string, Descriptors>>): GraphSchema {
  return {
    ...example,
    nodes: example.nodes.map((node) =>
      node.id in unratified ? ({ ...node, ...unratified[node.id] } as GraphNode) : node,
    ),
  };
}

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

describe.each([
  ["an unratified altitude", altitude],
  ["an unratified kind", kind],
])("a Spec with %s, whose floor the reader does not evaluate", (_name, { id, set }) => {
  const foreign = foreignGraph({ [id]: set });

  describe("in the Design Review", () => {
    const pages = renderDesignReview(createReader(foreign));

    it("labels the Spec page's floor and raises no below-idea divergence banner", () => {
      const page = pageAt(pages, `spec/${id.slice("spec:".length)}.md`);
      const stated = createReader(foreign).specContext(id)?.statedReadiness ?? "";
      expect(stated).not.toBe("idea");
      expect(page).toContain(`**Readiness:** stated \`${stated}\` · ${label}`);
      expect(page).not.toContain("Readiness divergence");
      expect(page).not.toContain("below `idea`");
      expect(page).not.toContain("the `idea` floor is unmet");
    });

    it("labels the index and the Pack member table and names no next rung", () => {
      expect(row(pageAt(pages, "index.md"), id)).toContain(`| ${label} |`);
      const member = row(pageAt(pages, "pack/checkout-v1.md"), id);
      expect(member).toContain(`| ${label} | — |`);
      expect(member).not.toContain("nothing blocks");
    });
  });

  it("counts it on the census's own row and leaves it out of not structurally reached", () => {
    const page = pageAt(renderCensus(createReader(foreign)), "index.md");
    expect(page).toContain("| not structurally reached | 0 |");
    expect(page).toContain(`| ${label} | 1 |`);
  });

  describe("in the vault", () => {
    const files = new Map(renderVault(foreign).map((file) => [file.path, file.content]));
    const note = (noteId: string): string => {
      const content = files.get(notePath(noteId).slice("sdp/".length));
      if (content === undefined) throw new Error(`no note for ${noteId}`);
      return content;
    };

    it("labels a Spec note's floor in its head line and its property, with no next rung", () => {
      const content = note(id);
      expect(content).toContain('derivedReadiness: "not evaluated"');
      expect(content).not.toContain("statedNextRung:");
      const head = content.split("\n").find((line) => line.startsWith(`\`${id}\` · `)) ?? "";
      expect(head).toMatch(labelAtEnd);
      expect(head).not.toContain("floor none");
      expect(head).not.toContain("nothing blocks");
    });

    it("labels the Pack note's member line and names no rung nothing blocks", () => {
      const lines = note("pack:checkout-v1").split("\n");
      const member = lines.find((line) => /^\d+\. /u.test(line) && line.includes(`|${id}]]`));
      expect(member).toBeDefined();
      expect(member).toMatch(labelAtEnd);
      expect(member).not.toContain("nothing blocks");
    });
  });
});

describe("the census over floors the reader does not evaluate", () => {
  it("counts every such Spec on its one row", () => {
    const foreign = foreignGraph({ [altitude.id]: altitude.set, [kind.id]: kind.set });
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

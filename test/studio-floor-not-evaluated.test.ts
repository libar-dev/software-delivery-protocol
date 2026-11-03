import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import { createReader, extract } from "../src/index.js";
import type { GraphNode } from "../src/index.js";
import { createStudioData } from "../src/projections/studio/data.js";
import type { StudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// A foreign producer's graph: the worked example with an unratified altitude on one roadmap entry
// and an unratified kind on the other. Carriers cannot state these values; a graph handed to the
// reader can, and no readiness floor is evaluated over it.
// spec:validation.next-rung-floor#rule.notEvaluated
// spec:consumers.spec-studio.shell#rule.rungBadge
const unratified: Readonly<Record<string, Partial<Record<"specKind" | "altitude", string>>>> = {
  "spec:orders.order-placement-flow": { altitude: "planet" },
  "spec:orders.order-model": { specKind: "saga" },
};
const flagged = Object.keys(unratified);

let data: StudioData;
let pages: ReadonlyMap<string, string>;

beforeAll(async () => {
  const example = extract({ root: join(repoRoot, "examples/checkout-v1") });
  const graph = {
    ...example.graph,
    nodes: example.graph.nodes.map((node) =>
      node.id in unratified ? ({ ...node, ...unratified[node.id] } as GraphNode) : node,
    ),
  };
  data = await createStudioData(createReader(graph));
  pages = new Map(renderStudio(data).map((page) => [page.path, page.content]));
});

function page(path: string): string {
  const content = pages.get(path);
  if (content === undefined) throw new Error(`no page ${path}`);
  return content;
}

/** The member card a Pack page, or its export under the `pack/` prefix, writes for one Spec. */
function card(html: string, id: string): string {
  const own = html.indexOf(`<details class="card" id="${id}"`);
  const start = own < 0 ? html.indexOf(`<details class="card" id="pack/${id}"`) : own;
  if (start < 0) throw new Error(`no card for ${id}`);
  return html.slice(start, html.indexOf("</details>", start));
}

describe("the Studio over a floor the reader does not evaluate", () => {
  it("labels the Spec page's floor and raises no below-idea banner or next rung", () => {
    for (const id of flagged) {
      const html = page(`specs/${id.slice("spec:".length)}.html`);
      const start = html.indexOf('<header class="page-head">');
      const header = html.slice(start, html.indexOf("</header>", start));
      expect(header, id).toContain('<span class="floor">floor not evaluated</span>');
      expect(header, id).not.toContain('class="divergence"');
      expect(header, id).not.toContain("below idea");
      expect(header, id).not.toContain("Next rung");
    }
  });

  it("labels Pack member cards, lists them apart in the maturity map and counts no waiting rung", () => {
    for (const path of ["packs/checkout-v1.html", "exports/checkout-v1.html"]) {
      const html = page(path);
      for (const id of flagged) {
        const member = card(html, id);
        expect(member, `${path} ${id}`).toContain("floor not evaluated");
        expect(member, `${path} ${id}`).not.toContain("nothing blocks");
        expect(member, `${path} ${id}`).not.toContain("next rung");
      }
      const apart = html.slice(html.indexOf("<h3>Members whose floor is not evaluated</h3>"));
      expect(apart.slice(0, apart.indexOf("</section>")), path).toContain(flagged[0]);
      expect(apart.slice(0, apart.indexOf("</section>")), path).toContain(flagged[1]);
      // No cell of the grid places them, so none reads them as floor none.
      const cells = [
        ...html.matchAll(/<details id="diagram\.[^"]+\.cell\.[^"]+">.*?<\/details>/gsu),
      ];
      for (const cell of cells) for (const id of flagged) expect(cell[0]).not.toContain(id);
    }
    const totals = data.packs.find(({ context }) => context.id === "pack:checkout-v1")?.totals;
    const waiting = data.packs
      .find(({ context }) => context.id === "pack:checkout-v1")
      ?.context.members.filter(
        (m) => m.statedNextRung !== undefined && m.statedNextRungFailures?.length === 0,
      ).length;
    expect(totals?.waitingForAuthor).toBe(waiting);
  });

  it("counts neither Spec as stated above its floor and filters them as not evaluated", () => {
    const html = page("index.html");
    expect(html).toContain("<li>No Specs stated above their floor.</li>");
    expect(html).toContain('<option value="not-evaluated">not evaluated</option>');
    for (const id of flagged)
      expect(html).toMatch(
        new RegExp(
          `<li class="spec-row" data-row [^>]*data-floor="not-evaluated"[^>]*>[^\\n]*?${id.replaceAll(".", "\\.")}`,
          "u",
        ),
      );
    expect(
      data.search.records
        .filter((record) => flagged.includes(record.id))
        .map((record) => record.floorReached),
    ).toEqual(["not evaluated", "not evaluated"]);
  });

  it("labels the roadmap, its memo, the design slice and the backlog without a next rung", () => {
    const roadmap = page("roadmap.html");
    for (const place of [1, 2]) {
      const entry = roadmap.slice(
        roadmap.indexOf(`id="roadmap-checkout-roadmap-entry-${String(place)}"`),
      );
      const body = entry.slice(0, entry.indexOf("</details>"));
      expect(body, `entry ${String(place)}`).toContain("floor not evaluated");
      expect(body, `entry ${String(place)}`).not.toContain("nothing blocks");
      expect(body, `entry ${String(place)}`).not.toContain("Next:");
    }
    expect(roadmap).toContain("itself `scoped`, floor not evaluated");
    expect(roadmap).toContain("itself `defined`, floor not evaluated");

    const slice = page("slices/checkout-roadmap.html");
    for (const id of flagged) {
      const row = slice.slice(slice.indexOf(`<tr class="member" id="member.${id}">`));
      const cells = row.slice(0, row.indexOf("</tr>"));
      expect(cells, id).toContain("floor not evaluated");
      expect(cells, id).toContain('<td class="next"></td>');
    }
    expect(slice).not.toContain("nothing blocks");

    const backlog = page("backlog.html");
    const row = backlog.slice(backlog.indexOf("<code>spec:orders.order-model</code>"));
    expect(row.slice(0, row.indexOf("</p><p>Unmet") + 40)).toContain("floor not evaluated");
    expect(row).toMatch(/^[^]*?<p>Unmet clauses: not evaluated<\/p>/u);
  });
});

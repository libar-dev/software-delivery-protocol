import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";
import {
  implementation,
  memo,
  probeGraph,
  probePack,
  probeSpec,
  roadmap,
  workGraph,
  workStates,
} from "./helpers/roadmap-probe.js";
import type { GraphSchema } from "../src/graph/schema.js";

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Expected a value");
  return value;
}

/**
 * @sdpAnchor test:protocol.studio-roadmap-page
 * @sdpVerifies spec:consumers.spec-studio.roadmap-page, spec:consumers.roadmap.memo, spec:consumers.spec-studio.navigation
 */
async function page(graph: GraphSchema) {
  const data = await createStudioData(createReader(graph));
  const pages = renderStudio(data);
  const html = pages.find((row) => row.path === "roadmap.html")?.content;
  expect(html, "roadmap.html is always published").toBeDefined();
  return { html: required(html), data, pages };
}

function main(html: string): string {
  return /<main id="main">(.*?)<\/main>/su.exec(html)?.[1] ?? "";
}
const unescape = (value: string) =>
  value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

function mixedGraph() {
  return probeGraph({
    "pack.sdp.md": probePack("probe", ["build", "design", "state", "built", "choice"]),
    "build.sdp.md": probeSpec("build", "ready", "\n  dependsOn: spec:probe.state"),
    "design.sdp.md": probeSpec(
      "design",
      "scoped",
      "\n  dependsOn: spec:probe.foundation",
      "### Open questions\n- [blocking #choose] Choose & inspect.\n  - decider: owner\n  - provisional: Keep & inspect.\n- [non-blocking #later] Discuss the other option.\n\n## Behavior\n- rule: Keep the question.",
    ),
    "state.sdp.md": probeSpec("state", "defined"),
    "built.sdp.md": probeSpec("built"),
    "built.ts": implementation("built"),
    "choice.sdp.md": probeSpec(
      "choice",
      "ready",
      "\n  refines: spec:probe.foundation",
      "## Decision\n- context: A choice.\n- decision: Keep the choice.",
      "decision",
    ),
  });
}

describe("Studio roadmap page", () => {
  it("publishes the empty state and navigation even with no roadmap", async () => {
    const { html, pages } = await page(probeGraph({}, []));
    expect(main(html)).toContain("This corpus states no roadmap.");
    expect(main(html)).toContain("order: priority");
    expect(html).toContain('<a href="roadmap.html" aria-current="page">Roadmap</a>');
    expect(html.indexOf('href="evidence.html"')).toBeLessThan(html.indexOf('href="roadmap.html"'));
    expect(html.indexOf('href="roadmap.html"')).toBeLessThan(html.indexOf('href="queue.html"'));
    expect(pages.find((row) => row.path === "index.html")?.content).toContain(
      '<a href="roadmap.html">See the next work in priority order</a>',
    );
    expect(pages.find((row) => row.path.startsWith("specs/"))?.content).toContain(
      'href="../roadmap.html"',
    );
  });

  it("renders the board, four need lists, numbered gaps, legend and entries listed apart", async () => {
    const { html } = await page(mixedGraph());
    const body = main(html);
    expect(body).toContain(
      "5 entries in priority order: 1 to design, 1 to state, 1 to build, 1 built, 1 listed apart.",
    );
    for (const label of ["To design", "To state", "To build", "Built"])
      expect(body).toContain(label);
    for (const [place, need] of [
      [1, "to-build"],
      [2, "to-design"],
      [3, "to-state"],
      [4, "built"],
    ] as const) {
      expect(body).toContain(`value="${String(place)}" data-row data-need="${need}"`);
      expect(body).toContain(`href="#roadmap-probe-entry-${String(place)}"`);
    }
    expect(body).toContain(
      "To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry&#39;s work states ready and has an implementation binding; it reports no passing test and no deployment. The entry&#39;s own readiness is shown separately.",
    );
    expect(body).toContain("Listed apart");
    expect(body).toContain('id="roadmap-probe-entry-5"');
    expect(body).toContain("decision");
    expect(body).toContain("settled");
  });

  it.each([workStates[4], workStates[6], workStates[7]])(
    "shows holding parts and their next-rung clauses: %s",
    async (state) => {
      const { html } = await page(workGraph(state));
      const body = main(html);
      for (const label of ["Id", "Parts"]) expect(body).toContain(`<b>${label}:</b>`);
      expect(body).toContain("itself");
      expect(body).toContain("floor ready");
      expect(body).toContain("1 other part");
      expect(body).toContain('href="specs/probe.part.html"');
      if (state === workStates[4]) expect(body).toContain("1 drift");
      if (state === workStates[6]) {
        expect(body).toContain('href="specs/probe.part.html#question.choice"');
        expect(body).toContain("no-blocking-open-questions");
      }
      if (state === workStates[7]) {
        expect(body).toContain("Rests on");
        expect(body).toContain("refines");
        expect(body).toContain("from");
        expect(body).toContain("holds ready");
        expect(body).toContain("outside the roadmap");
      }
    },
  );

  it("keeps waiting questions, provisional readings, unnamed deciders and statements in recipe order", async () => {
    const graph = mixedGraph();
    const { html } = await page(graph);
    const waiting = main(html).split("<h3>Waiting on the owner</h3>")[1] ?? "";
    expect(waiting).toContain('href="specs/probe.design.html#question.choose"');
    expect(waiting).toContain('text="spec:probe.design#question.choose"');
    expect(waiting).toContain("blocking");
    expect(waiting).toContain("Choose &amp; inspect.");
    expect(waiting).toContain("Provisional: Keep &amp; inspect.");
    expect(waiting).toContain("These questions have no named decider.");
    expect(waiting).toContain("Discuss the other option.");
    expect(waiting).toContain('href="#roadmap-probe-entry-2"');
    expect(waiting).toContain("floor allows");
    expect(main(html)).toContain("<b>Next:</b>");
    expect(main(html)).toContain("nothing blocks");
    expect(main(html)).toContain("<b>Build now:</b>");
    const answer = await roadmap(graph);
    const positions = required(answer.roadmaps[0]).waiting.statements.map((row) =>
      waiting.indexOf(`data-statement="${row.id}"`),
    );
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("shows decisions and their questions, dependency folds, incoming work and other Packs", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root", "inside"]),
      "also.sdp.md": probePack("also", ["root"]),
      "root.sdp.md": probeSpec(
        "root",
        "scoped",
        "\n  decidedBy: spec:probe.choice\n  dependsOn: [spec:probe.inside, spec:probe.outside]",
      ),
      "inside.sdp.md": probeSpec("inside", "defined"),
      "outside.sdp.md": probeSpec("outside", "defined"),
      "waiting.sdp.md": probeSpec("waiting", "defined", "\n  dependsOn: spec:probe.root"),
      "choice.sdp.md": probeSpec(
        "choice",
        "scoped",
        "\n  refines: spec:probe.foundation",
        "### Open questions\n- [blocking #choice] Settle this choice.\n  - decider: owner\n\n## Decision\n- context: A choice.\n- decision: Keep the choice.",
        "decision",
      ),
    });
    const { html } = await page(graph);
    const body = main(html);
    for (const label of ["Decided by", "Rests on", "Waited on by", "Also in"])
      expect(body).toContain(`<b>${label}:</b>`);
    expect(body).toContain('href="specs/probe.choice.html#question.choice"');
    expect(body).toContain('href="specs/probe.waiting.html"');
    expect(body).toContain('href="packs/also.html"');
    expect(body).toContain("<summary>1 more dependency</summary>");
    expect(body).toContain('href="#roadmap-probe-entry-2"');
  });

  it("labels an ordinary Pack answer as authored reading order", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["root"]),
      "root.sdp.md": probeSpec("root"),
    });
    const { data } = await page(graph);
    const reading = await roadmap(
      probeGraph(
        { "pack.sdp.md": probePack("probe", ["root"]), "root.sdp.md": probeSpec("root") },
        [],
      ),
      { pack: "pack:probe" },
    );
    const all = new Map(data.recipes.all).set(53, reading);
    const html = required(
      renderStudio({ ...data, recipes: { ...data.recipes, all } }).find(
        (row) => row.path === "roadmap.html",
      ),
    ).content;
    expect(main(html)).toContain("1 entry in authored reading order");
  });

  it("uses each roadmap's escaped page name for every local entry link and copies recipe 55's exact bytes", async () => {
    const graph = probeGraph(
      {
        "z.sdp.md": probePack("z", ["dependent", "base"]),
        "a.sdp.md": probePack("aRoadmap", ["dependent", "base"]),
        "dependent.sdp.md": probeSpec("dependent", "defined", "\n  dependsOn: spec:probe.base"),
        "base.sdp.md": probeSpec("base", "defined"),
        "part.sdp.md": probeSpec(
          "part",
          "defined",
          "\n  refines: [spec:probe.dependent, spec:probe.base]",
        ),
      },
      ["z", "aRoadmap"],
    );
    const { html } = await page(graph);
    const ids = [...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    const sections = [
      ...main(html).matchAll(/<section class="roadmap".*?<\/section><!-- roadmap -->/gsu),
    ];
    expect(sections).toHaveLength(2);
    for (const [at, name] of ["a_roadmap", "z"].entries()) {
      const section = required(sections[at])[0];
      const links = [...section.matchAll(/href="#(roadmap-[^"]+-entry-\d+)"/gu)].map((match) =>
        required(match[1]),
      );
      expect(links.length).toBeGreaterThan(4);
      expect(links.every((id) => id.startsWith(`roadmap-${name}-entry-`) && ids.includes(id))).toBe(
        true,
      );
      expect(section).toContain("Earlier statements");
      expect(section).toContain("Shares Specs with");
      const expected = (await memo(graph, { pack: at === 0 ? "pack:aRoadmap" : "pack:z" })).memo;
      const pre = /<pre id="[^"]+">(.*?)<\/pre>/su.exec(section)?.[1] ?? "";
      expect(unescape(pre)).toBe(expected);
      expect(section).toContain(`id="roadmap-${name}-memo"`);
      const copyText = /<sdp-copy text="([^"]*)"><\/sdp-copy><pre id=/su.exec(section)?.[1] ?? "";
      expect(unescape(copyText)).toBe(expected);
    }
    expect(html).toBe((await page(graph)).html);
  });

  it("shows every row without script and supplies the existing filter with need tokens", async () => {
    const { html } = await page(mixedGraph());
    expect(html).toContain('<form hidden class="filter-bar">');
    expect(html).toContain('data-filter="need"');
    expect([...html.matchAll(/data-row data-need="([^"]+)"/gu)].map((m) => m[1])).toEqual([
      "to-design",
      "to-state",
      "to-build",
      "built",
    ]);
    expect(html).not.toMatch(/data-row[^>]*\bhidden/u);
  });

  it("stacks the board at phone width using the Studio breakpoint", () => {
    const css = readFileSync(
      new URL("../src/projections/studio/studio.css", import.meta.url),
      "utf8",
    );
    expect(css).toMatch(
      /\.roadmap-board\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/su,
    );
    expect(css).toMatch(
      /@media \(max-width: 719\.98px\)\s*\{\s*\.roadmap-board\s*\{\s*grid-template-columns: 1fr/su,
    );
  });
});

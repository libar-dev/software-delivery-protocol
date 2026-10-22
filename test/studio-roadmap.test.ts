import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { rowMatches } from "../src/studio-elements/filter.js";
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
    "pack.sdp.md": probePack(
      "probe",
      ["build", "design", "state", "built", "choice"],
      "First & inspect.\n\nRead the `work` next.",
    ),
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
  it("shows unresolved members with their original manifest places", async () => {
    const graph = probeGraph({
      "pack.sdp.md": probePack("probe", ["first", "missing", "last"]),
      "first.sdp.md": probeSpec("first"),
      "missing.sdp.md": probeSpec("missing"),
      "last.sdp.md": probeSpec("last"),
    });
    const { html } = await page({
      ...graph,
      nodes: graph.nodes.filter((node) => node.id !== "spec:probe.missing"),
    });
    const body = main(html);
    expect(body).toContain("3 entries in priority order:");
    expect(body).toContain(", 1 unresolved.");
    expect(body).toContain("<h3>Unresolved members</h3>");
    expect(body).toContain('id="roadmap-probe-entry-2">2. <code>spec:probe.missing</code>');
    expect(body).toContain('id="roadmap-probe-entry-3"');
  });
  it("publishes the empty state and navigation even with no roadmap", async () => {
    const { html, pages } = await page(probeGraph({}, []));
    expect(main(html)).toContain("This corpus states no roadmap.");
    expect(main(html)).toContain("order: priority");
    expect(html).toContain('<a href="roadmap.html" aria-current="page">Roadmap</a>');
    expect(html.indexOf('href="evidence.html"')).toBeLessThan(html.indexOf('href="roadmap.html"'));
    expect(html.indexOf('href="roadmap.html"')).toBeLessThan(html.indexOf('href="queue.html"'));
    expect(pages.find((row) => row.path === "index.html")?.content).toContain(
      '<a href="roadmap.html">See what comes next</a></li><li><a href="queue.html">See what the owner can state first</a>',
    );
    expect(pages.find((row) => row.path.startsWith("specs/"))?.content).toContain(
      'href="../roadmap.html"',
    );
  });

  it("renders the board, four need lists, numbered gaps, legend and entries listed apart", async () => {
    const { html } = await page(mixedGraph());
    const body = main(html);
    const summary = required(/<ul class="summary">(.*?)<\/ul>/su.exec(body)?.[1]);
    expect(summary).toContain(
      "5 entries in priority order: 1 to design, 1 to state, 1 to build, 1 built, 1 listed apart.",
    );
    expect(summary).toContain(
      "1 blocking and 0 non-blocking questions wait on the owner; 1 name no decider, 0 of them blocking.",
    );
    expect(summary).toContain('<a href="queue.html">owner queue</a>');
    expect(body).toContain("<p>First &amp; inspect.</p><p>Read the <code>work</code> next.</p>");
    expect(body).toContain(
      '<header class="page-head"><h1>Roadmap</h1><p>What comes next, from the graph. A place is advisory priority: never a date, a deadline or permission to start.</p></header>',
    );
    const board = required(/<div class="roadmap-board".*?<\/div>/su.exec(body)?.[0]);
    const lists = required(/<sdp-filter>.*?<\/sdp-filter>/su.exec(body)?.[0]);
    for (const [at, label] of ["To design", "To state", "To build", "Built"].entries()) {
      expect(board).toContain(`<h3>${label} <span class="floor">1</span></h3>`);
      expect(lists).toContain(`<h3>${label}</h3><ol class="roadmap-list">`);
      if (at > 0) {
        const preceding = ["To design", "To state", "To build"][at - 1] ?? "";
        expect(board.indexOf(`<h3>${preceding} `)).toBeLessThan(board.indexOf(`<h3>${label} `));
        expect(lists.indexOf(`<h3>${preceding}</h3>`)).toBeLessThan(
          lists.indexOf(`<h3>${label}</h3>`),
        );
      }
    }
    expect(lists).toContain(
      '<span class="line2">behavior · story · <span class="badge rung-scoped">scoped</span> <span class="floor">floor scoped</span> · 1 Spec: 1 to design</span>',
    );
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

  it("counts empty board columns and gives each empty need list its own sentence", async () => {
    const { html } = await page(workGraph(workStates[0]));
    const body = main(html);
    const board = required(/<div class="roadmap-board".*?<\/div>/su.exec(body)?.[0]);
    expect([...board.matchAll(/<p>none<\/p>/gu)]).toHaveLength(3);
    for (const label of ["To design", "To state", "To build"])
      expect(board).toContain(`<h3>${label} <span class="floor">0</span></h3><p>none</p>`);
    expect(board).toContain('<h3>Built <span class="floor">1</span></h3>');
    const lists = required(/<sdp-filter>.*?<\/sdp-filter>/su.exec(body)?.[0]);
    for (const need of ["to design", "to state", "to build"])
      expect(lists).toContain(`<p>No entry has the need ${need}.</p>`);
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
    const waiting =
      required(main(html).split("<h3>Waiting on the owner</h3>")[1]).split(
        '<details class="section"><summary>The forward section',
      )[0] ?? "";
    expect(waiting).toContain('<p>blocking · <a href="specs/probe.design.html#question.choose"');
    expect(waiting).toContain('text="spec:probe.design#question.choose"');
    expect(waiting).toContain("Choose &amp; inspect.");
    expect(waiting).toContain("Provisional: Keep &amp; inspect.");
    expect(waiting).toContain("These questions have no named decider.");
    expect(waiting).toContain('<p>non-blocking · <a href="specs/probe.design.html#question.later"');
    expect(waiting).toContain("Discuss the other option.");
    expect(waiting).toContain('href="#roadmap-probe-entry-2"');
    expect(waiting).toContain(
      '<p data-statement="spec:probe.state">Statement · <a href="specs/probe.state.html">spec:probe.state</a> states <span class="badge rung-defined">defined</span>, floor allows <span class="badge rung-ready">ready</span>',
    );
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

  it("leaves out Earlier statements when no waiting statement precedes the entry", async () => {
    const { html } = await page(
      probeGraph({
        "pack.sdp.md": probePack("probe", ["state"]),
        "state.sdp.md": probeSpec("state", "defined"),
      }),
    );
    const card = required(
      /<details class="card" id="roadmap-probe-entry-1">.*?<\/details>/su.exec(main(html))?.[0],
    );
    expect(card).not.toContain("Earlier statements");
    expect(card).not.toContain("No preceding waiting statement");
  });

  it.each([0, 1, 2])(
    "uses the correct statement count and verb for %i waiting statements",
    async (n) => {
      const names = Array.from({ length: n }, (_, i) => `state-${String(i)}`);
      const { html } = await page(
        probeGraph({
          "pack.sdp.md": probePack("probe", ["built", ...names]),
          "built.sdp.md": probeSpec("built"),
          "built.ts": implementation("built"),
          ...Object.fromEntries(
            names.map((name) => [`${name}.sdp.md`, probeSpec(name, "defined")]),
          ),
        }),
      );
      const summary = required(/<ul class="summary">(.*?)<\/ul>/su.exec(main(html))?.[1]);
      expect(summary).toContain(
        `${String(n)} ${n === 1 ? "statement waits" : "statements wait"} for a person; the <a href="queue.html">owner queue</a> lists them all.`,
      );
    },
  );

  it("renders code spans and escapes authored titles consistently on the board and entry", async () => {
    const { html } = await page(
      probeGraph({
        "pack.sdp.md": probePack("probe", ["root"]),
        "root.sdp.md": probeSpec("root").replace("# root", "# Read `<work>` & inspect"),
      }),
    );
    const body = main(html);
    const board = required(/<div class="roadmap-board".*?<\/div>/su.exec(body)?.[0]);
    expect(board).toContain(
      '<a href="#roadmap-probe-entry-1">Read <code>&lt;work&gt;</code> &amp; inspect</a>',
    );
    expect(body).toContain(
      '<span class="line1">1. Read <code>&lt;work&gt;</code> &amp; inspect</span>',
    );
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
    const rows = [...html.matchAll(/data-row data-need="([^"]+)"/gu)].map((m) => ({
      need: required(m[1]),
    }));
    expect(rows.map((row) => row.need)).toEqual(["to-design", "to-state", "to-build", "built"]);
    const select = required(/<select data-filter="need">(.*?)<\/select>/su.exec(html)?.[1]);
    const options = [...select.matchAll(/<option value="([^"]+)"/gu)].map((m) => required(m[1]));
    expect(options).toEqual(["any", "to-design", "to-state", "to-build", "built"]);
    for (const need of options) {
      const matching = rows.filter((row) => rowMatches(row, { need }));
      expect(matching).toEqual(need === "any" ? rows : [{ need }]);
    }
    expect(html).not.toMatch(/data-row[^>]*\bhidden/u);
  });

  it("keeps heading, memo and entry ids distinct when roadmap names contain their suffixes", async () => {
    const names = ["a", "a-entry-1", "a-memo", "a-heading"];
    const { html } = await page(
      probeGraph(
        {
          ...Object.fromEntries(names.map((name) => [`${name}.sdp.md`, probePack(name, ["root"])])),
          "root.sdp.md": probeSpec("root"),
        },
        names,
      ),
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/gu)].map((m) => required(m[1]));
    expect(new Set(ids).size).toBe(ids.length);
    for (const match of html.matchAll(/(?:href="#|aria-labelledby=")([^"]+)"/gu))
      expect(ids).toContain(match[1]);
    for (const name of names) expect(ids).toContain(`roadmap-${name}-entry-1`);
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

import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { extract } from "../src/extract/index.js";
import { schemaVersion } from "../src/graph/schema.js";
import type { GraphSchema, PrimitiveNode } from "../src/graph/schema.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
import type { StudioPage } from "../src/projections/studio/pages/index.js";
import { pagePath } from "../src/projections/studio/paths.js";
import { text } from "../src/projections/studio/pages/text.js";
import { renderResults, searchRecords } from "../src/studio-elements/search-results.js";

const anchor = specTest({
  id: testAnchorId("test:protocol.studio-pages"),
  verifies: [
    ref("spec:consumers.spec-studio.shell"),
    ref("spec:consumers.spec-studio.index-page"),
    ref("spec:consumers.spec-studio.pack-page"),
    ref("spec:consumers.spec-studio.spec-page.core"),
    ref("spec:consumers.spec-studio.search"),
  ],
});
void anchor;

const root = fileURLToPath(new URL("..", import.meta.url));
const primitive = (id: string, changes: Partial<PrimitiveNode> = {}): PrimitiveNode => ({
  id,
  nodeType: "Primitive",
  claim: "declared",
  specKind: "behavior",
  altitude: "story",
  readiness: "defined",
  title: id,
  file: "design/probe.sdp.md",
  deliveryFacts: [],
  sections: {
    intent: { outcome: "Read the design" },
    behavior: { rules: ["A rule"], examples: ["An example"] },
  },
  ...changes,
});
const probe: GraphSchema = {
  schemaVersion,
  nodes: [
    primitive("spec:probe.all", {
      title: "Read <script> safely",
      narrative: "**Plain** `inline` spec:probe.target#design.alpha and spec:probe.absent. ",
      sections: {
        intent: {
          outcome: "The outcome",
          openQuestions: [
            {
              key: "choice",
              question: "Which choice?",
              blocking: false,
              decider: "owner",
              links: ["spec:probe.target#design.alpha"],
              provisional: "Keep this reading",
              trigger: "A reader asks",
            },
          ],
        },
        behavior: {
          rules: ["First rule", "Third rule"],
          flows: ["Second flow"],
          ruleKeys: { first: "rules[0]", second: "flows[0]" },
          examples: [{ given: ["Given text"], when: ["When text"], then: ["Then text"] }],
          exampleSpace: {
            given: ["Given {name:string}"],
            when: ["When {action:string}"],
            then: ["Then {outcome:string}"],
          },
        },
        constraints: [{ statement: "A constraint", target: "< 2 ms", flavor: "performance" }],
        model: { terms: { Order: "A model term" } },
        design: {
          zeta: "Last named first",
          alpha: "`<script>` spec:probe.target#design.alpha",
          object: { value: "Object text" },
        },
        decision: {
          context: "Decision context",
          decision: "Choose this",
          rationale: ["Because"],
          alternatives: ["Another choice"],
          consequences: ["One consequence"],
        },
        verification: { mode: "reviewed", criteria: ["Read the whole page"] },
        ui: { layout: "A layout" },
      },
    }),
    primitive("spec:probe.target", {
      sections: {
        intent: { outcome: "Target" },
        behavior: { rules: ["Target rule"] },
        design: { alpha: "Target entry" },
      },
    }),
    primitive("spec:probe.dishonest", {
      readiness: "ready",
      sections: { intent: { outcome: "Incomplete" } },
    }),
    {
      id: "pack:probe",
      nodeType: "Pack",
      claim: "declared",
      title: "Probe Pack",
      file: "design/probe.pack.sdp.md",
      framing: "The Pack framing",
      members: ["spec:probe.target", "spec:probe.all", "spec:probe.dishonest", "spec:probe.absent"],
      modelRefs: ["spec:probe.target"],
    },
    {
      id: "component:probe",
      nodeType: "CodeNode",
      claim: "anchored",
      file: "src/probe.ts",
      line: 1,
      layer: "domain",
      context: "probe",
    },
    {
      id: "impl:probe",
      nodeType: "CodeNode",
      claim: "anchored",
      label: "The implementation",
      file: "src/probe.ts",
      line: 2,
      role: "service",
    },
    { id: "test:probe", nodeType: "Anchor", claim: "anchored", file: "test/probe.ts", line: 3 },
    { id: "oracle:probe", nodeType: "Anchor", claim: "anchored", file: "test/probe.ts", line: 4 },
  ],
  edges: [
    {
      from: "spec:probe.all",
      to: "spec:probe.target",
      type: "dependsOn",
      claim: "declared",
      reason: "It supplies the entry",
      exercises: ["first"],
    },
    ...["spec:probe.target", "spec:probe.all", "spec:probe.dishonest", "spec:probe.absent"].map(
      (from) => ({
        from,
        to: "pack:probe",
        type: "belongsTo" as const,
        claim: "declared" as const,
      }),
    ),
    { from: "impl:probe", to: "spec:probe.all", type: "satisfies", claim: "anchored" },
    { from: "impl:probe", to: "component:probe", type: "memberOf", claim: "anchored" },
    { from: "test:probe", to: "spec:probe.all", type: "verifies", claim: "anchored" },
    { from: "oracle:probe", to: "spec:probe.all", type: "models", claim: "anchored" },
  ],
  locations: [
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "design.zeta", line: 40 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "design.alpha", line: 41 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "design.object", line: 42 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "ui.layout", line: 50 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "rule[0]", line: 30 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "flow[0]", line: 31 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "rule[1]", line: 32 },
    { spec: "spec:probe.all", file: "design/probe.sdp.md", entry: "question[0]", line: 20 },
  ],
};
const data = createStudioData(createReader(probe));
const pages = renderStudio(data);
const html = (id: string): string => {
  const page = pages.find((p) => p.path === (pagePath(id) ?? id));
  if (!page) throw new Error(`Missing page ${id}`);
  return page.content;
};
const decode = (s: string): string =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

function checkLinks(set: readonly StudioPage[]): void {
  const byPath = new Map(set.map((page) => [page.path, page.content]));
  for (const page of set) {
    const ids = [...page.content.matchAll(/\bid="([^"]+)"/gu)].map((m) => decode(m[1] ?? ""));
    expect(new Set(ids).size, `${page.path} duplicate ids`).toBe(ids.length);
    for (const match of page.content.matchAll(/\bhref="([^"]+)"/gu)) {
      const href = decode(match[1] ?? "");
      expect(href, `${page.path}: ${href}`).not.toMatch(/^(?:[a-z]+:|\/)/iu);
      const [path = "", fragment] = href.split("#");
      const target =
        path === "" ? page.path : posix.normalize(posix.join(posix.dirname(page.path), path));
      if (target === "assets/studio.css") continue;
      const content = byPath.get(target);
      expect(content, `${page.path}: ${href}`).toBeDefined();
      if (fragment && !(target === "search.html" && fragment.startsWith("q="))) {
        expect(content, `${page.path}: ${href}`).toContain(`id="${decodeURIComponent(fragment)}"`);
      }
    }
  }
}

describe("Studio static pages", () => {
  it("frames every page with a skip link, labelled search, rail, canvas, classic script and stamp", () => {
    for (const page of pages) {
      expect(page.content).toContain('class="skip-link" href="#main"');
      expect(page.content).toContain('<main id="main"');
      expect(page.content).toContain('<sdp-search page-root="');
      expect(page.content).toContain('for="q"');
      expect(page.content).toContain('<sdp-stamp page-root="');
      expect(page.content).toMatch(/<script defer src="(?:\.\.\/)?assets\/studio.js"><\/script>/u);
      expect(page.content).toContain("Example spaces");
      expect(page.content).toContain(`${String(data.rail.findings.errors)} errors`);
    }
    expect(html("pack:probe")).toContain('href="#spec:probe.target"');
    expect(html("spec:probe.all")).toContain('aria-current="page"');
  });
  it("opens the index with counts, four task routes, every facet and stable section ids", () => {
    const index = html("index.html");
    for (const id of ["packs", "specs", "findings"]) expect(index).toContain(`id="${id}"`);
    for (const label of [
      "Read a Pack's design",
      "Find a Spec, entry or file by a word",
      "Narrow the Specs",
      "Read the findings",
    ])
      expect(decode(index)).toContain(label);
    for (const name of [
      "kind",
      "altitude",
      "stated",
      "floor",
      "implementation",
      "verifier",
      "pack",
    ])
      expect(index).toContain(`data-facet="${name}"`);
    expect(index).toContain("3 Specs");
    expect(index).toContain("1 Pack");
    expect(index).toContain("2 Specs stated above their floor");
    expect(index).toContain("form hidden");
    expect(index).toContain("data-row");
    expect(index).toContain("3 of 3 shown");
  });
  it("gives each Spec row one rung badge and binding words", () => {
    const rows = [...html("index.html").matchAll(/<li[^>]*data-row[^>]*>(.*?)<\/li>/gsu)];
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row[1]?.match(/class="badge rung-/gu)).toHaveLength(1);
      expect(row[1]).toContain("implementation binding");
      expect(row[1]).toContain("verifier binding");
      expect(row[1]).not.toMatch(/has-verifier|implemented/gu);
    }
  });
  it("puts Pack totals before framing and folds holds into that summary", () => {
    const pack = html("pack:probe");
    expect(pack.indexOf("Where the design stands")).toBeLessThan(pack.indexOf("<h2>Framing</h2>"));
    expect(pack).not.toContain("<h2>Holds</h2>");
    expect(pack).toContain("nothing blocks");
    expect(pack).toContain("unmet clauses");
    expect(pack).toContain('href="#spec:probe.dishonest"');
    expect(pack).toContain("No members with a design reference");
    expect(pack).toContain("manifest names an id the graph does not hold");
  });
  it("renders Pack members in authored order, closed and with one colored badge per summary", () => {
    const pack = html("pack:probe");
    const cards = [
      ...pack.matchAll(/<details class="card" id="([^"]+)"><summary>(.*?)<\/summary>/gsu),
    ];
    expect(cards.map((m) => m[1])).toEqual(probe.nodes.find((n) => n.nodeType === "Pack")?.members);
    for (const card of cards.slice(0, 3))
      expect(card[2]?.match(/class="badge rung-/gu)).toHaveLength(1);
    expect(pack).toContain("<sdp-expander>");
    expect(pack).toContain("question.choice");
    expect(pack).toContain("line 20");
    expect(pack).toContain("4 design entries");
  });
  it("renders the four Pack boundary sections and the verifier gap sentence once", () => {
    const pack = html("pack:probe");
    for (const name of ["Rests on", "Rested on by", "Verified by", "Superseded by"])
      expect(pack).toContain(name);
    expect(pack.match(/The graph records bindings and never runs/gu)).toHaveLength(1);
    expect(pack).toContain("No verifier binding");
    expect(pack).not.toContain("0 verifiers");
  });
  it("shows the stated rung beside its floor and warns only in the dishonest direction", () => {
    expect(html("spec:probe.all")).toMatch(/rung-defined[^>]*>defined<\/span>.*?floor ready/u);
    expect(html("spec:probe.all")).not.toContain('class="divergence"');
    expect(html("spec:probe.all")).toContain("nothing blocks");
    expect(html("spec:probe.dishonest")).toContain('class="divergence"');
    expect(html("spec:probe.dishonest")).toContain("stated ready exceeds");
  });
  it("renders every section in order and every addressable entry with its key and recorded line", () => {
    const spec = html("spec:probe.all");
    const sections = [...spec.matchAll(/<details[^>]*id="section\.([^"]+)"[^>]*open/gu)].map(
      (m) => m[1],
    );
    expect(sections).toEqual([
      "intent",
      "behavior",
      "constraints",
      "model",
      "design",
      "decision",
      "verification",
      "ui",
    ]);
    expect(spec).toContain('id="narrative"');
    for (const id of [
      "design.zeta",
      "design.alpha",
      "design.object",
      "ui.layout",
      "rule.first",
      "rule.second",
      "question.choice",
    ])
      expect(spec).toContain(`id="${id}"`);
    expect(spec).toContain("line 41");
    expect(spec.indexOf('id="design.zeta"')).toBeLessThan(spec.indexOf('id="design.alpha"'));
    expect(spec.indexOf("First rule")).toBeLessThan(spec.indexOf("Second flow"));
    expect(spec.indexOf("Second flow")).toBeLessThan(spec.indexOf("Third rule"));
    expect(html("spec:probe.target")).not.toContain('id="section.ui"');
  });
  it("names the first unmet clause and renders a missing idea floor as none", () => {
    const dishonest = data.specs.find((s) => s.id === "spec:probe.dishonest");
    expect(dishonest?.floorFailures[0]).toBeDefined();
    expect(html("spec:probe.dishonest")).toContain("First unmet clause:");
    expect(html("spec:probe.dishonest")).toContain(dishonest?.floorFailures[0]?.description);
    const empty = renderStudio(
      createStudioData(
        createReader({
          schemaVersion,
          nodes: [primitive("spec:probe.empty", { title: "", sections: {} })],
          edges: [],
        }),
      ),
    );
    const spec = empty.find((p) => p.path === "specs/probe.empty.html")?.content ?? "";
    expect(spec).toContain("floor none");
    expect(spec).toContain("below idea");
  });
  it("shows question fields, code location, component, bindings and relations both ways", () => {
    const spec = html("spec:probe.all");
    for (const text of [
      "non-blocking",
      "owner",
      "Keep this reading",
      "A reader asks",
      "src/probe.ts:2",
      "service",
      "domain",
      "probe",
      "Implementation binding: present",
      "Verifier binding: present",
      "Expected-outcome oracle: present",
      "Runtime observation: not tracked",
      "Run results: not recorded in the graph",
      "outgoing",
      "declared",
      "It supplies the entry",
    ])
      expect(decode(spec)).toContain(text);
    expect(html("spec:probe.target")).toContain("incoming");
    expect(spec).toContain('text="src/probe.ts:2"');
    expect(spec).toContain('href="probe.target.html#design.alpha"');
  });
  it("escapes authored text, reads only code spans and links resolving mentions", () => {
    const spec = html("spec:probe.all");
    expect(spec).toContain("&lt;script&gt;");
    expect(spec).not.toContain("<script> safely");
    expect(spec).toContain("**Plain**");
    expect(spec).toContain("<code>inline</code>");
    expect(spec).not.toMatch(/href="[^"]*probe.absent/u);
    expect(spec).toContain("spec:probe.absent");
    expect(spec).toContain("Given {name:string}");
    expect(spec).toContain("Given text");
  });
  it("links validator-readable escaped mentions and preserves unequal code delimiters", () => {
    const ctx = { data, path: "specs/probe.all.html" };
    expect(text(ctx, "spec:probe.target\\#design.alpha")).toContain(
      'href="probe.target.html#design.alpha"',
    );
    expect(text(ctx, "``x ` y`` and `z`")).toBe("<code>x ` y</code> and <code>z</code>");
    expect(text(ctx, "Unmatched ` stays plain")).toBe("Unmatched ` stays plain");
  });
  it("shows findings on the index and only links page-bearing subjects", () => {
    const withFindings = renderStudio({
      ...data,
      findings: [
        {
          family: "conformance",
          validatorId: "probe",
          severity: "error",
          subjectId: "spec:probe.all",
          message: "Spec finding",
          file: "probe.ts",
          line: 9,
        },
        {
          family: "conformance",
          validatorId: "probe",
          severity: "warning",
          subjectId: "test:probe",
          message: "Anchor finding",
        },
        {
          family: "conformance",
          validatorId: "probe",
          severity: "warning",
          subjectId: "pack:probe",
          message: "Pack finding",
        },
      ],
    });
    const index = withFindings.find((p) => p.path === "index.html")?.content ?? "";
    expect(index).toContain("Spec finding");
    expect(index).toContain("Anchor finding");
    expect(index).toContain("probe.ts:9");
    expect(index).toContain('href="specs/probe.all.html"');
    expect(index).not.toMatch(/href="[^"]*test:probe/u);
    expect(withFindings.find((p) => p.path === "specs/probe.all.html")?.content).toContain(
      "Spec finding",
    );
    expect(withFindings.find((p) => p.path === "packs/probe.html")?.content).toContain(
      "Pack finding",
    );
  });
  it("embeds the index only on search and supplies its element and no-script explanation", () => {
    const search = html("search.html");
    expect(search).toContain("<sdp-search-results>");
    expect(search).toContain('<script type="application/json" id="sdp-data">');
    expect(search).toContain("Search needs JavaScript");
    expect(search).toContain('<a href="index.html">Browse the index</a>');
    expect(search).not.toContain('"<script>');
    for (const page of pages.filter((p) => p.path !== "search.html"))
      expect(page.content).not.toContain('id="sdp-data"');
  });
  it("resolves all probe links including fragments in dynamic search results", () => {
    const results = renderResults(searchRecords(data.search, "choice"), "choice", 50);
    checkLinks(
      pages.map((p) => (p.path === "search.html" ? { ...p, content: p.content + results } : p)),
    );
  });
  it("renders deterministically with no time or commit metadata", () => {
    expect(renderStudio(data)).toEqual(pages);
    expect(html("pack:probe")).toContain("The Pack framing");
    for (const page of pages)
      expect(page.content).not.toMatch(/<time|last-verified|corpusCommit|buildTime/u);
  });
  it("ships the native layout and focus stylesheet in the browser assets", () => {
    const css = readFileSync(new URL("../dist/studio/studio.css", import.meta.url), "utf8");
    expect(css).toContain("focus-visible");
    expect(css).toContain("@media (max-width: 720px)");
    expect(css).toContain("overflow-x: auto");
  });
});

describe("Protocol Studio page set", () => {
  const protocol = createStudioData(
    createReader(
      extract({ root, exclude: ["explorations", "examples", "test/fixtures/import/parity"] }).graph,
    ),
  );
  const rendered = renderStudio(protocol);
  it("resolves every page link and element fragment", () => {
    expect(
      rendered.find((p) => p.path === "specs/consumers.spec-studio.shell.html")?.content,
    ).toContain('id="rule.withoutScript"');
    checkLinks(rendered);
  });
  it("contains the complete Spec prose without executing script", () => {
    for (const spec of protocol.specs) {
      const page = rendered.find((p) => p.path === pagePath(spec.id))?.content ?? "";
      expect(page).toContain('id="section.intent"');
      for (const entry of protocol.search.records.find((r) => r.id === spec.id)?.entries ?? []) {
        if (entry.address)
          expect(page, entry.address).toContain(`id="${entry.address.split("#")[1] ?? ""}"`);
      }
    }
  });
});

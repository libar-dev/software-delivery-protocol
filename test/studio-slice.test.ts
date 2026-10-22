import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parse as parseCss } from "postcss";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";
import {
  dependencyDiagram,
  scopedArchitectureDiagrams,
} from "../src/projections/studio/diagrams/slice.js";
import { renderDiagram } from "../src/projections/studio/diagrams/index.js";
import { mermaidSource } from "../src/projections/studio/diagrams/mermaid.js";
import { layoutDiagram } from "../src/projections/studio/diagrams/layout.js";
import type { SliceAnswer, SliceArchitecture } from "../src/projections/studio/slice-answer.js";

function required<T>(v: T | undefined): T {
  if (v === undefined) throw new Error("Expected a value");
  return v;
}
const roots: string[] = [];
afterAll(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function spec(id: string, relations = "{}", body = "", kind = "behavior", readiness = "defined") {
  return `---\nid: spec:probe.${id}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read a slice.\n${body || "\n## Behavior\n- rule: Read the member.\n"}`;
}
async function fixture(empty = false, proseProbe = false) {
  const root = mkdtempSync(join(tmpdir(), "sdp-slice-page-"));
  roots.push(root);
  const files: Record<string, string> = empty
    ? {
        "empty.pack.sdp.md": "---\nid: pack:probe.Empty\nspecs: []\n---\n# Empty\n",
      }
    : {
        "pack.pack.sdp.md":
          "---\nid: pack:probe.Slice\nspecs: [spec:probe.a, spec:probe.b, spec:probe.folded, spec:probe.independent, spec:probe.design, spec:probe.unrelated, spec:probe.absent, spec:probe.matching, spec:probe.unreadable, spec:probe.decision]\n---\n# Probe slice\n",
        "a.sdp.md": spec(
          "a",
          "{dependsOn: [spec:probe.outside, {target: spec:probe.other, reason: outside footing}, {target: spec:probe.missing, reason: unresolved footing}], decidedBy: spec:probe.decision}",
          "\n### Open questions\n- [non-blocking #later] Can this wait?\n\n## Behavior\n- rule: [#first] Read.\n\n## Design\n- declaration: `First` stays pinned.\n",
        ),
        "b.sdp.md": spec("b", "{dependsOn: {target: spec:probe.a, reason: member footing}}"),
        "folded.sdp.md": spec(
          "folded",
          "{refines: spec:probe.a, verifies: spec:probe.a}",
          "\n### Open questions\n- [blocking #held] What holds the example?\n  - decider: owner\n  - links: spec:probe.a\n  - provisional: Keep it visible.\n  - trigger: a reader asks\n\n```gwt\nGiven a member\nWhen read\nThen it stays visible\n```\n",
          "example",
          "scoped",
        ),
        "independent.sdp.md": spec(
          "independent",
          "{refines: spec:probe.a, verifies: spec:probe.a, dependsOn: spec:probe.b}",
          "\n```gwt\nGiven a member\nWhen read\nThen it stays visible\n```\n",
          "example",
        ),
        "other.sdp.md": spec("other"),
        "outside.sdp.md": spec("outside", "{}", "", "behavior", "scoped"),
        "decision.sdp.md": spec(
          "decision",
          "{refines: spec:probe.a}",
          "\n## Decision\n- context: A slice needs words.\n- decision: Read them.\n",
          "decision",
        ),
        ...Object.fromEntries(
          ["design", "unrelated", "absent", "matching", "unreadable"].map((name) => [
            `${name}.sdp.md`,
            spec(
              name,
              "{}",
              `\n## Model\n- **Unit** — A planned unit.\n\n## Design\n- id: component:probe.${name}\n- layer: ${name === "unreadable" ? "middleware" : "domain"}\n- context: probe\n- uses: ${name === "absent" ? "none" : "component:probe.remote"}\n`,
              "model",
            ),
          ]),
        ),
        "code.ts": `/**\n * @sdpAnchor component:probe.design\n * @sdpSatisfies spec:probe.design\n * @sdpLayer application\n * @sdpContext probe\n * @sdpUses component:probe.remote\n */\nexport const design=1;\n/**\n * @sdpAnchor component:probe.unrelated\n */\nexport const unrelated=2;\n/**\n * @sdpAnchor component:probe.matching\n * @sdpSatisfies spec:probe.matching\n * @sdpLayer domain\n * @sdpContext probe\n * @sdpUses component:probe.remote\n */\nexport const matching=3;\n/**\n * @sdpAnchor component:probe.unreadable\n * @sdpSatisfies spec:probe.unreadable\n * @sdpLayer domain\n * @sdpContext probe\n */\nexport const unreadable=4;\n/**\n * @sdpAnchor component:probe.remote\n * @sdpLayer infrastructure\n * @sdpContext remote\n */\nexport const remote=5;\n/**\n * @sdpAnchor impl:probe.loose\n * @sdpSatisfies spec:probe.a\n */\nexport const loose=6;\n/**\n * @sdpAnchor impl:probe.member\n * @sdpReferences spec:probe.b\n * @sdpComponent component:probe.design\n */\nexport const member=7;\n`,
      };
  for (const [path, content] of Object.entries(files)) writeFileSync(join(root, path), content);
  if (proseProbe) {
    const path = join(root, "folded.sdp.md");
    writeFileSync(
      path,
      readFileSync(path, "utf8")
        .replace("What holds the example?", "What holds `code` and spec:probe.a?")
        .replace("Keep it visible.", "Keep `code` and spec:probe.a visible.")
        .replace("a reader asks", "a reader asks for `code` and spec:probe.a"),
    );
    const a = join(root, "a.sdp.md");
    writeFileSync(a, readFileSync(a, "utf8").replace("# a\n", "# `First` title\n"));
  }
  const data = await createStudioData(createReader(extract({ root }).graph));
  return {
    data,
    pages: renderStudio(data),
    answer: data.recipes.slices.get(empty ? "pack:probe.Empty" : "pack:probe.Slice") as SliceAnswer,
  };
}
let shared: Awaited<ReturnType<typeof fixture>>;
let emptyFixture: Awaited<ReturnType<typeof fixture>>;
let proseFixture: Awaited<ReturnType<typeof fixture>>;
beforeAll(async () => {
  shared = await fixture();
  emptyFixture = await fixture(true);
  proseFixture = await fixture(false, true);
}, 30_000);
function page(
  pages: readonly { path: string; content: string }[],
  path = "slices/probe._slice.html",
) {
  const found = pages.find((p) => p.path === path);
  expect(found).toBeDefined();
  return found?.content ?? "";
}
function text(html: string) {
  return html
    .replace(/<[^>]*>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}
function designCells(html: string, spec: string): string[] {
  const table = required(
    html.split('aria-label="Member component designs"')[1]?.split("</table>")[0],
  );
  const row = required(
    table.match(/<tr>[\s\S]*?<\/tr>/gu)?.find((row) => row.includes(`<code>${spec}</code>`)),
  );
  return [...row.matchAll(/<td>([\s\S]*?)<\/td>/gu)].map((cell) => text(cell[1] ?? ""));
}
const sliceAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-page"),
  verifies: ref("spec:consumers.spec-studio.slice-page"),
});
void sliceAnchor;

describe("slice page", () => {
  it("renders the complete answer in order, keeps held examples folded and independent examples separate", () => {
    const { pages, answer } = shared;
    const html = page(pages);
    const plain = text(html);
    const headings = [
      "The design as a whole",
      "How the members rest on each other",
      "What each member needs next",
      "The architecture it touches",
      "Decisions in scope",
      "Open questions in scope",
      "Where the slice meets the rest",
    ];
    expect(headings.map((h) => html.indexOf(h))).toEqual(
      headings.map((h) => html.indexOf(h)).sort((a, b) => a - b),
    );
    expect(html).toContain("Design slice: Probe slice");
    expect(html).toContain('href="../packs/probe._slice.html"');
    expect(plain).toContain("Read the Pack member by member");
    expect(plain).toContain(
      "Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.",
    );
    expect(html).toContain('href="../packs/probe._slice.html#spec:probe.a"');
    expect(html).toContain('class="slice-members"');
    expect(html).toContain("1 example members folded in, 1 held below the next rung");
    expect(html).not.toContain('id="member.spec:probe.folded"');
    expect(html).toContain('id="member.spec:probe.independent"');
    expect(plain).toContain("0 of 0 verifying examples bound");
    expect(plain).toContain("1 rules, 1 keyed");
    expect(plain).toContain("floor scoped");
    expect(plain).toContain("no-blocking-open-questions");
    expect(html).toContain('href="../specs/probe.folded.html#question.held"');
    expect(plain).toContain("Provisional:");
    expect(plain).toContain("Trigger:");
    expect(plain).toContain("layer: declared domain; anchored application");
    for (const words of [
      "absent",
      "present, does not satisfy the design",
      "satisfies the design",
      "not compared",
      "matches",
      "unreadable middleware, not compared",
      "Outside the slice, shown for context and not counted as touched",
      "a member design plans to use it",
      "implements",
      "references",
    ])
      expect(plain).toContain(words);
    expect(html).not.toContain('id="sdp-data"');
    expect(html).toContain("<sdp-expander>");
    for (const key of ["restsOn", "restedOnBy", "verifiedBy", "supersededBy"])
      expect(html).toContain(`id="boundary.${key}"`);
    expect(plain).toContain(`${String(answer.totals.members)} members`);
    expect(page(pages, "packs/probe._slice.html")).toContain('href="../slices/probe._slice.html"');
    expect(text(page(pages, "packs/probe._slice.html"))).toContain("Read this Pack as one design");
    for (const id of [
      "dependencies.text",
      "dependencies.arrow",
      "architecture.text",
      "architecture.arrow",
    ])
      expect(html).toContain(`id="diagram.pack:probe.Slice.${id}"`);
    const expectedOrder = [
      "spec:probe.design",
      "spec:probe.unrelated",
      "spec:probe.absent",
      "spec:probe.matching",
      "spec:probe.unreadable",
      "spec:probe.decision",
      "spec:probe.a",
      "spec:probe.b",
      "spec:probe.independent",
    ];
    expect(
      [...html.matchAll(/<tr class="member" id="member\.([^"]+)"/gu)].map((m) => m[1]),
    ).toEqual(expectedOrder);
    const questions = required(
      html.split('id="slice.questions"')[1]?.split('id="slice.boundary"')[0],
    );
    expect(questions).toContain("What holds the example?");
    expect(questions).toContain("Can this wait?");
    expect(questions.indexOf("What holds the example?")).toBeLessThan(
      questions.indexOf("Can this wait?"),
    );
    for (const cell of html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gu))
      expect(text(cell[1] ?? "")).not.toMatch(/\b(?:built|done|verified|approved)\b/iu);
    expect(html).toBe(page(renderStudio(shared.data)));
  });
  it("keeps declared, unreadable and comparison words in their own design cells", () => {
    const html = page(shared.pages);
    const unreadable = designCells(html, "spec:probe.unreadable");
    expect(unreadable[2]).toContain("layer: unreadable middleware");
    expect(unreadable[2]).not.toContain("layer: not stated");
    expect(unreadable[4]).toContain("layer: unreadable middleware, not compared");
    const absent = designCells(html, "spec:probe.absent");
    expect(absent[2]).toContain("role: not stated");
    expect(absent[2]).toContain("uses: none");
    expect(absent[3]).toBe("absent");
    expect(absent[4]).toBe("not compared");
    const unrelated = designCells(html, "spec:probe.unrelated");
    expect(unrelated[3]).toBe("present, does not satisfy the design");
    expect(unrelated[4]).toBe("not compared");
    const matching = designCells(html, "spec:probe.matching");
    expect(matching[3]).toBe("satisfies the design");
    expect(matching[4]).toBe("matches");
    expect(designCells(html, "spec:probe.design")[4]).toBe(
      "layer: declared domain; anchored application",
    );
  });
  it("writes the slice's Pack id as text in exports instead of a relative file path", () => {
    const { pages } = shared;
    const exported = page(pages, "exports/probe._slice.html");
    expect(exported).toContain("<p><code>pack:probe.Slice</code></p>");
    for (const p of pages.filter((p) => p.path.startsWith("exports/")))
      expect(p.content).not.toMatch(/<code>\.\.\//u);
  });
  it("uses singular summary nouns and captions that add to the section headings", () => {
    const { data, answer } = shared;
    const single = {
      ...answer,
      totals: {
        ...answer.totals,
        members: 1,
        exampleMembers: 1,
        relations: 1,
        cycles: 1,
        decisions: 1,
        openQuestions: 1,
      },
    };
    const slices = new Map(data.recipes.slices);
    slices.set("pack:probe.Slice", single);
    const html = page(renderStudio({ ...data, recipes: { ...data.recipes, slices } }));
    const summary = text(required(html.split('<ul class="summary">')[1]?.split("</ul>")[0]));
    expect(summary).toContain("1 member;");
    expect(summary).toContain("1 example member counted");
    expect(summary).toContain("1 relation among members");
    expect(summary).toContain("1 cycle.");
    expect(summary).toContain("1 decision in scope");
    expect(summary).toContain("1 open question;");
    const captions = [...html.matchAll(/<figcaption>(.*?)<\/figcaption>/gu)].map((m) =>
      text(m[1] ?? ""),
    );
    expect(captions.length).toBeGreaterThanOrEqual(2);
    expect(captions).not.toContain("How the members rest on each other");
    expect(captions).not.toContain("The architecture it touches");
  });
  it("keeps every link inside the complete page set and gives every id one owner", () => {
    const { pages } = shared;
    for (const p of pages) {
      const ids = [...p.content.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
      expect(new Set(ids).size, p.path).toBe(ids.length);
      for (const m of p.content.matchAll(/href="([^"]+)"/gu)) {
        const href = (m[1] ?? "").replaceAll("&amp;", "&");
        const [location, fragment] = href.split("#");
        // A query such as the index's epic filter selects within the page it names.
        const path = location?.split("?")[0];
        if (path?.endsWith(".css")) continue;
        const target = pages.find(
          (t) =>
            t.path ===
            posix.normalize(
              posix.join(
                posix.dirname(p.path),
                path === "" ? posix.basename(p.path) : (path ?? posix.basename(p.path)),
              ),
            ),
        );
        expect(target, `${p.path}: ${href}`).toBeDefined();
        if (fragment && !fragment.startsWith("q="))
          expect(target?.content, `${p.path}: ${href}`).toContain(
            `id="${decodeURIComponent(fragment)}"`,
          );
      }
    }
  });
  it("names empty architecture and empty sections without inventing bindings", () => {
    const { pages } = emptyFixture;
    const html = page(pages, "slices/probe._empty.html");
    expect(text(html)).toContain("No component is touched");
    expect(text(html)).toContain("0 Specs");
    expect(html).toContain("<p>None.</p>");
    expect(html).toContain("Verified by (0)");
  });
  it("stacks the member's next rung before the labelled design and code runs on a phone", () => {
    const css = readFileSync(
      new URL("../src/projections/studio/studio.css", import.meta.url),
      "utf8",
    );
    const orders = new Map<string, number>();
    let stacks = false;
    parseCss(css).walkAtRules("media", (media) => {
      if (media.params !== "(max-width: 719.98px)") return;
      media.walkRules((rule) => {
        const values = new Map<string, string>();
        rule.walkDecls((decl) => {
          values.set(decl.prop, decl.value);
        });
        if (rule.selector === ".slice-members tr")
          stacks = values.get("display") === "flex" && values.get("flex-direction") === "column";
        if (values.has("order")) orders.set(rule.selector, Number(values.get("order")));
      });
    });
    expect(stacks).toBe(true);
    // Identity, rung and next rung have the default flex order, before the labelled runs.
    expect(orders.get(".slice-members td.next") ?? 0).toBe(0);
    expect(orders.get(".slice-members td.depth")).toBe(4);
    expect(orders.get(".slice-members td.carried")).toBe(5);
    expect(orders.get(".slice-members td.code-cell")).toBe(6);
  });
});
const dependencyAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-dependency"),
  verifies: ref("spec:consumers.spec-studio.diagram-kinds.dependency"),
});
void dependencyAnchor;

describe("slice dependency drawing", () => {
  it("preserves single-member depths and opens complete text when no height-reducing fold fits", () => {
    const member = required(shared.answer.members[0]);
    const members = Array.from({ length: 10 }, (_, i) => ({
      ...member,
      id: `spec:probe.depth${String(i)}`,
      depth: i + 1,
      exampleOf: null,
      exampleMembers: [],
    }));
    const d = dependencyDiagram(
      "probe",
      {
        ...shared.answer,
        members,
        boundary: { ...shared.answer.boundary, restsOn: [], restedOnBy: [] },
        structure: {
          edges: members.slice(1).map((m, i) => ({
            from: m.id,
            to: required(members[i]).id,
            type: "dependsOn",
            orders: true,
          })),
          cycles: [],
          unresolved: [],
        },
      },
      (id) => id,
    );
    expect(d.boxes.some((b) => b.folded)).toBe(false);
    for (const m of members) expect(d.boxes.some((b) => b.id === m.id)).toBe(true);
    const html = renderDiagram(d, "probe.dependencies");
    expect(html).not.toContain("<svg");
    expect(html).toContain('<details open id="diagram.probe.dependencies.text"');
    expect(html).toContain("height budget");
    for (const m of members) expect(html).toContain(m.id);
  });
  it("aggregates boundary arrows before testing the bound, retaining every original relation in text", () => {
    const { answer } = shared;
    const member = required(answer.members.find((m) => m.id === "spec:probe.a"));
    const outside = required(answer.boundary.restsOn.find((r) => r.id === "spec:probe.other"));
    const many = {
      ...answer,
      members: [{ ...member, exampleMembers: [] }],
      structure: { edges: [], cycles: [], unresolved: [] },
      boundary: {
        ...answer.boundary,
        restsOn: Array.from({ length: 101 }, (_, i) => ({
          ...outside,
          id: `spec:probe.outside${String(i)}`,
          holds: [],
          via: [
            {
              type: "dependsOn",
              members: [member.id],
              reasons: [{ member: member.id, reason: `footing ${String(i)}` }],
            },
          ],
        })),
      },
    };
    for (const count of [3, 101]) {
      const input = {
        ...many,
        boundary: { ...many.boundary, restsOn: many.boundary.restsOn.slice(0, count) },
      };
      const d = dependencyDiagram("probe", input, (id) => id);
      expect(d.edges).toEqual([
        expect.objectContaining({ from: member.id, count, countLabel: "relations" }),
      ]);
      expect(d.boxes.some((b) => b.id === member.id)).toBe(true);
      expect(d.boxes).toHaveLength(2);
      const html = renderDiagram(d, "probe.dependencies");
      expect(html).toContain("<svg");
      expect(html).toContain(`${String(count)} relations`);
      for (const row of input.boundary.restsOn)
        expect(html).toContain(
          `${member.id} dependsOn ${row.id} · declared — ${row.via[0]?.reasons[0]?.reason ?? ""}`,
        );
    }
  });
  it("points from the Mermaid source disclosure to the full text equivalent", () => {
    const { pages } = shared;
    const source = required(
      page(pages)
        .split('id="diagram.pack:probe.Slice.dependencies.source"')[1]
        ?.split("</details>")[0],
    );
    expect(source).toContain('href="#diagram.pack:probe.Slice.dependencies.text"');
    expect(text(source)).toContain("full text equivalent");
  });
  it("uses supplied depths, folds its boundary even below the bound, and retains full text and nonordering arrows", () => {
    const { answer } = shared;
    const d = dependencyDiagram("pack:probe.Slice", answer, (id) => `#${id}`);
    const html = renderDiagram(d, "pack:probe.Slice.dependencies");
    expect(
      d.boxes.find((b) => b.id === "spec:probe.a" || b.foldedIds?.includes("spec:probe.a"))?.band,
    ).toBe(`Depth ${String(answer.members.find((m) => m.id === "spec:probe.a")?.depth)}`);
    expect(d.boxes.some((b) => b.id === "spec:probe.folded")).toBe(false);
    expect(
      d.boxes.some(
        (b) => b.id === "spec:probe.independent" || b.foldedIds?.includes("spec:probe.independent"),
      ),
    ).toBe(true);
    expect(d.boxes.some((b) => b.id === "spec:probe.outside")).toBe(true);
    expect(d.boxes.some((b) => b.folded && b.band === "Outside this scope")).toBe(true);
    expect(html).toContain("orders nothing");
    expect(html).toContain('data-orders="false"');
    expect(html).toContain("spec:probe.folded refines spec:probe.a");
    expect(html).toContain('id="diagram.pack:probe.Slice.dependencies.text"');
    // The deepest band is drawn first and each member points down at what it rests on.
    const source = mermaidSource(d);
    expect(source).toMatch(/^flowchart TB\n {2}subgraph depth0\["Depth \d+"\]/u);
    expect(source).not.toContain("flowchart BT");
    expect(html).toContain("flowchart TB");
    expect(html).toContain("outside footing");
    expect(html).toContain("unresolved footing");
    expect(html).toContain("spec:probe.missing, unresolved");
    expect(html).not.toContain('href="#spec:probe.missing"');
    expect(answer.structure.unresolved).toContainEqual({
      from: "spec:probe.a",
      to: "spec:probe.missing",
      type: "dependsOn",
      reason: "unresolved footing",
    });
    expect(
      answer.boundary.restsOn.find((r) => r.id === "spec:probe.other")?.via[0]?.reasons,
    ).toEqual([{ member: "spec:probe.a", reason: "outside footing" }]);
    const changed = { ...answer, members: answer.members.map((m) => ({ ...m, depth: 37 })) };
    expect(
      dependencyDiagram("probe", changed, (id) => id)
        .boxes.filter((b) => b.band?.startsWith("Depth"))
        .every((b) => b.band === "Depth 37"),
    ).toBe(true);
  });
  it("folds largest complete bands first and opens text when protected boundary boxes exceed the bound", () => {
    const { answer } = shared;
    const member = required(answer.members[0]);
    const expanded = {
      ...answer,
      members: Array.from({ length: 45 }, (_, i) => ({
        ...member,
        id: `spec:probe.m${String(i)}`,
        exampleOf: null,
        exampleMembers: [],
        depth: i < 25 ? 2 : 1,
      })),
      structure: { edges: [], cycles: [], unresolved: [] },
    };
    const d = dependencyDiagram("probe", expanded, (id) => id);
    expect(d.boxes.some((b) => b.id === "diagram.probe.dependencies.fold.2")).toBe(true);
    const protectedBoundary = {
      ...expanded,
      boundary: {
        ...answer.boundary,
        restsOn: Array.from({ length: 45 }, (_, i) => ({
          ...required(answer.boundary.restsOn[0]),
          id: `spec:probe.o${String(i)}`,
          holds: [member.id],
        })),
      },
    };
    const html = renderDiagram(
      dependencyDiagram("probe", protectedBoundary, (id) => id),
      "probe.dependencies",
    );
    expect(html).not.toContain("<svg");
    expect(html).toContain('<details open id="diagram.probe.dependencies.text"');
  });
  it("gives repeated scopes distinct fold element ids through their drawing occurrence", () => {
    const { answer } = shared;
    const member = required(answer.members[0]);
    const expanded = {
      ...answer,
      members: Array.from({ length: 45 }, (_, i) => ({
        ...member,
        id: `spec:probe.m${String(i)}`,
        exampleOf: null,
        exampleMembers: [],
        depth: 1,
      })),
      structure: { edges: [], cycles: [], unresolved: [] },
    };
    const html = ["probe.dependencies", "probe.second.dependencies"]
      .map((id) =>
        renderDiagram(
          dependencyDiagram("probe", expanded, (id) => id, id),
          id,
        ),
      )
      .join("");
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("diagram.probe.dependencies.fold.1");
    expect(ids).toContain("diagram.probe.second.dependencies.fold.1");
  });
  it("keeps synthetic boundary identifiers out of the visible box identity line", () => {
    const { answer } = shared;
    const d = dependencyDiagram("probe", answer, (id) => id);
    const folded = layoutDiagram(d).boxes.filter((p) => p.box.folded);
    expect(folded.length).toBeGreaterThan(0);
    for (const p of folded) expect(p.identity).toEqual([]);
  });
});
const architectureAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-architecture"),
  verifies: ref("spec:consumers.spec-studio.diagram-kinds.scoped-architecture"),
});
void architectureAnchor;

describe("scoped architecture drawing", () => {
  it("gives context and layer folds distinct ids and preserves all original rows", () => {
    const { answer } = shared;
    const component = required(answer.architecture.components[0]);
    const arch = {
      ...answer.architecture,
      components: Array.from({ length: 92 }, (_, i) => ({
        ...component,
        id: `component:probe.c${String(i)}`,
        context: i < 46 ? "alpha" : "beta",
        layer: i % 2 ? "domain" : "application",
      })),
      designs: [],
      outside: [],
      uses: [],
      plannedUses: [],
    };
    const drawings = scopedArchitectureDiagrams("pack:probe.Slice", arch, (id) => `#${id}`);
    const html = drawings
      .map((d, i) =>
        renderDiagram(
          d,
          `pack:probe.Slice.architecture${i ? `.${encodeURIComponent(required(d.occurrenceKey))}` : ""}`,
        ),
      )
      .join("");
    const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(drawings.some((d) => d.occurrenceKey?.includes("layer"))).toBe(true);
    for (const d of drawings)
      for (const b of d.boxes)
        if (b.target.startsWith("#diagram.")) expect(ids).toContain(b.target.slice(1));
    for (const c of arch.components) expect(html).toContain(`${c.id}:`);
    const pure = required(
      scopedArchitectureDiagrams("one", { ...arch, components: [component] }, (id) => id)[0],
    );
    expect(renderDiagram(pure, "one.architecture")).toContain("block-beta");
  });
  it("keeps planned and anchored identities apart, folds outside context and retains original unit edges", () => {
    const { answer } = shared;
    const drawings = scopedArchitectureDiagrams(
      "pack:probe.Slice",
      answer.architecture,
      (id) => `#${id}`,
    );
    const d = required(drawings[0]);
    const html = renderDiagram(d, "pack:probe.Slice.architecture");
    expect(d.boxes.some((b) => b.id === "spec:probe.design" && b.planned)).toBe(true);
    expect(d.boxes.some((b) => b.id === "component:probe.design" && !b.planned)).toBe(true);
    expect(d.boxes.some((b) => b.folded && b.words.includes("outside scope"))).toBe(true);
    const folded = layoutDiagram(d).boxes.filter(
      (p) => p.box.folded && p.box.words.includes("outside scope"),
    );
    expect(folded.length).toBeGreaterThan(0);
    for (const p of folded) expect(p.identity).toEqual([]);
    expect(html).toContain("plans to use");
    expect(html).toContain("realizes");
    expect(html).toContain("impl:probe.loose");
    expect(html).toContain("declared domain; anchored application");
    expect(html).toContain("component:probe.design uses component:probe.remote");
    expect(renderDiagram(d, "pack:probe.Slice.architecture")).toBe(html);
  });
  it("names uses, planned uses and realization in the legend and labels links only when a realization is drawn", () => {
    const { answer } = shared;
    const legendOf = (html: string) =>
      text(/<p class="diagram-legend">(.*?)<\/p>/u.exec(html)?.[1] ?? "");
    const edgeGroups = (html: string) => [...html.matchAll(/<g class="edge"[^>]*>.*?<\/g>/gu)];
    const render = (architecture: SliceArchitecture) =>
      renderDiagram(
        required(scopedArchitectureDiagrams("probe", architecture, (id) => `#${id}`)[0]),
        "probe.architecture",
      );

    const realized = render(answer.architecture);
    const legend = legendOf(realized);
    expect(legend).toContain("uses (anchored)");
    expect(legend).toContain("plans to use (declared)");
    expect(legend).toContain("realizes (anchored)");
    expect(legend).toContain("confers no delivery fact");
    const realizes = edgeGroups(realized).filter((m) => m[0].includes('data-kind="realizes"'));
    expect(realizes.length).toBeGreaterThan(0);
    for (const [edge] of edgeGroups(realized)) {
      const key = /data-edge-key="([^"]+)"/u.exec(edge)?.[1];
      const words = key
        ? new RegExp(`<li>${key}: ([^<]+)</li>`, "u").exec(realized)?.[1]
        : /<text[^>]*>([^<]+)<\/text>/u.exec(edge)?.[1];
      const kind = /data-kind="([^"]+)"/u.exec(edge)?.[1] ?? "";
      expect(words, edge).toMatch(new RegExp(`^${kind} · `, "u"));
    }

    const unrealized = render({
      ...answer.architecture,
      designs: answer.architecture.designs.map((d) => ({ ...d, realized: false })),
    });
    expect(unrealized).not.toContain('data-kind="realizes"');
    expect(legendOf(unrealized)).toBe(
      "Arrows: uses (anchored). Dashed arrows: plans to use (declared).",
    );
    for (const [edge] of edgeGroups(unrealized)) {
      expect(edge).not.toContain("<text");
      expect(edge).not.toContain("data-edge-key");
    }
  });
});

it("renders question fields as linked prose and dependency titles as plain text", () => {
  const result = proseFixture,
    html = page(result.pages);
  const questions = html.split('id="slice.questions"')[1]?.split('id="slice.boundary"')[0] ?? "";
  expect(questions).toContain("What holds <code>code</code> and");
  expect(questions).toContain('href="../specs/probe.a.html"');
  expect(questions).toContain("Keep <code>code</code> and");
  expect(questions).toContain("a reader asks for <code>code</code> and");
  const drawing = dependencyDiagram(
    "pack:probe.Slice",
    {
      ...result.answer,
      members: result.answer.members.filter((m) => m.id === "spec:probe.a"),
      structure: { ...result.answer.structure, edges: [], unresolved: [] },
      boundary: { ...result.answer.boundary, restsOn: [] },
    },
    () => "#main",
  );
  expect(drawing.boxes.find((b) => b.id === "spec:probe.a")?.title).toBe("First title");
  expect(mermaidSource(drawing)).not.toContain("`First`");
});

it("combines relations on one ordered pair while retaining every original text row", () => {
  const { answer } = shared;
  const original = required(
    answer.structure.edges.find((e) => e.from === "spec:probe.b" && e.to === "spec:probe.a"),
  );
  const extra = { ...original, type: "refines", reason: "Another relation" };
  const d = dependencyDiagram(
    "probe",
    { ...answer, structure: { ...answer.structure, edges: [original, extra] } },
    () => "#main",
  );
  expect(d.edges.some((e) => e.kind === "dependsOn, refines" && e.claim === "declared")).toBe(true);
  expect(d.textRows?.some((r) => r.includes("spec:probe.b dependsOn spec:probe.a"))).toBe(true);
  expect(d.textRows?.some((r) => r.includes("spec:probe.b refines spec:probe.a"))).toBe(true);
});

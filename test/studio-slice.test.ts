import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
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
import type { SliceAnswer } from "../src/projections/studio/slice-answer.js";

function required<T>(v: T | undefined): T {
  if (v === undefined) throw new Error("Expected a value");
  return v;
}
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function spec(id: string, relations = "{}", body = "", kind = "behavior", readiness = "defined") {
  return `---\nid: spec:probe.${id}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read a slice.\n${body || "\n## Behavior\n- rule: Read the member.\n"}`;
}
async function fixture(empty = false) {
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
          "\n## Behavior\n- rule: [#first] Read.\n\n## Design\n- declaration: `First` stays pinned.\n",
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
              `\n## Model\n- **Unit** — A planned unit.\n\n## Design\n- id: component:probe.${name}\n- layer: ${name === "unreadable" ? "middleware" : "domain"}\n- context: probe\n- uses: component:probe.remote\n`,
              "model",
            ),
          ]),
        ),
        "code.ts": `/**\n * @sdpAnchor component:probe.design\n * @sdpSatisfies spec:probe.design\n * @sdpLayer application\n * @sdpContext probe\n * @sdpUses component:probe.remote\n */\nexport const design=1;\n/**\n * @sdpAnchor component:probe.unrelated\n */\nexport const unrelated=2;\n/**\n * @sdpAnchor component:probe.matching\n * @sdpSatisfies spec:probe.matching\n * @sdpLayer domain\n * @sdpContext probe\n * @sdpUses component:probe.remote\n */\nexport const matching=3;\n/**\n * @sdpAnchor component:probe.unreadable\n * @sdpSatisfies spec:probe.unreadable\n * @sdpLayer domain\n * @sdpContext probe\n */\nexport const unreadable=4;\n/**\n * @sdpAnchor component:probe.remote\n * @sdpLayer infrastructure\n * @sdpContext remote\n */\nexport const remote=5;\n/**\n * @sdpAnchor impl:probe.loose\n * @sdpSatisfies spec:probe.a\n */\nexport const loose=6;\n/**\n * @sdpAnchor impl:probe.member\n * @sdpReferences spec:probe.b\n * @sdpComponent component:probe.design\n */\nexport const member=7;\n`,
      };
  for (const [path, content] of Object.entries(files)) writeFileSync(join(root, path), content);
  const data = await createStudioData(createReader(extract({ root }).graph));
  return {
    data,
    pages: renderStudio(data),
    answer: data.recipes.slices.get(empty ? "pack:probe.Empty" : "pack:probe.Slice") as SliceAnswer,
  };
}
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
const sliceAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-page"),
  verifies: ref("spec:consumers.spec-studio.slice-page"),
});
void sliceAnchor;

describe("slice page", () => {
  it("renders the complete answer in order, keeps held examples folded and independent examples separate", async () => {
    const { pages, answer } = await fixture();
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
    expect(html).toBe(page(renderStudio((await fixture()).data)));
  });
  it("keeps every link inside the complete page set and gives every id one owner", async () => {
    const { pages } = await fixture();
    for (const p of pages) {
      const ids = [...p.content.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
      expect(new Set(ids).size, p.path).toBe(ids.length);
      for (const m of p.content.matchAll(/href="([^"]+)"/gu)) {
        const href = (m[1] ?? "").replaceAll("&amp;", "&");
        const [path, fragment] = href.split("#");
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
  it("names empty architecture and empty sections without inventing bindings", async () => {
    const { pages } = await fixture(true);
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
    expect(css).toContain(".slice-members");
    expect(css).toContain(".slice-members td.depth");
    expect(css).toContain(".slice-members td.carried");
  });
});
const dependencyAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-dependency"),
  verifies: ref("spec:consumers.spec-studio.diagram-kinds.dependency"),
});
void dependencyAnchor;

describe("slice dependency drawing", () => {
  it("uses supplied depths, folds its boundary even below the bound, and retains full text and nonordering arrows", async () => {
    const { answer } = await fixture();
    const d = dependencyDiagram("pack:probe.Slice", answer, (id) => `#${id}`);
    const html = renderDiagram(d, "pack:probe.Slice.dependencies");
    expect(d.boxes.find((b) => b.id === "spec:probe.a")?.band).toBe(
      `Depth ${String(answer.members.find((m) => m.id === "spec:probe.a")?.depth)}`,
    );
    expect(d.boxes.some((b) => b.id === "spec:probe.folded")).toBe(false);
    expect(d.boxes.some((b) => b.id === "spec:probe.independent")).toBe(true);
    expect(d.boxes.some((b) => b.id === "spec:probe.outside")).toBe(true);
    expect(d.boxes.some((b) => b.folded && b.band === "Outside this scope")).toBe(true);
    expect(html).toContain("orders nothing");
    expect(html).toContain('data-orders="false"');
    expect(html).toContain("spec:probe.folded refines spec:probe.a");
    expect(html).toContain('id="diagram.pack:probe.Slice.dependencies.text"');
    expect(html).toContain("flowchart BT");
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
  it("folds largest complete bands first and opens text when protected boundary boxes exceed the bound", async () => {
    const { answer } = await fixture();
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
});
const architectureAnchor = specTest({
  id: testAnchorId("test:protocol.studio-slice-architecture"),
  verifies: ref("spec:consumers.spec-studio.diagram-kinds.scoped-architecture"),
});
void architectureAnchor;

describe("scoped architecture drawing", () => {
  it("gives context and layer folds distinct ids and preserves all original rows", async () => {
    const { answer } = await fixture();
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
  it("keeps planned and anchored identities apart, folds outside context and retains original unit edges", async () => {
    const { answer } = await fixture();
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
    expect(html).toContain("plans to use");
    expect(html).toContain("realizes");
    expect(html).toContain("impl:probe.loose");
    expect(html).toContain("declared domain; anchored application");
    expect(html).toContain("component:probe.design uses component:probe.remote");
    expect(renderDiagram(d, "pack:probe.Slice.architecture")).toBe(html);
  });
});

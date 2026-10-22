import * as diagrams from "../src/projections/studio/diagrams/index.js";
import { searchIndex } from "../src/projections/studio/data.js";
import { requirementDiagram } from "../src/projections/studio/diagrams/requirement.js";
import { renderDiagram } from "../src/projections/studio/diagrams/svg.js";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { specTest, testAnchorId, ref } from "../src/anchors.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
const carrier = (id: string, relations = "{}", readiness = "defined", kind = "behavior") =>
  `---\nid: spec:${id}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read ${id}.\n${kind === "behavior" ? "\n## Behavior\n- rule: Read the binding.\n\n## Verification — reviewed\n- Read the rule.\n" : ""}`;
const anchor = (id: string, tags = "") =>
  `/**\n * @sdpAnchor ${id}\n${tags} */\nexport const unit=1;\n`;
async function pages(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "sdp-panels-"));
  roots.push(root);
  for (const [path, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), value);
  }
  return renderStudio(await createStudioData(createReader(extract({ root }).graph)));
}
const find = (result: Awaited<ReturnType<typeof pages>>, path: string) =>
  result.find((p) => p.path === path)?.content ?? "";

const panels = specTest({
  id: testAnchorId("test:protocol.studio-architecture-maturity-requirement"),
  verifies: [
    ref("spec:consumers.spec-studio.lenses.architecture"),
    ref("spec:consumers.spec-studio.lenses.architecture.unit-register"),
    ref("spec:consumers.spec-studio.diagram-kinds.maturity-picture"),
    ref("spec:consumers.spec-studio.pack-page.maturity-map"),
    ref("spec:consumers.spec-studio.diagram-kinds.requirement-trace"),
    ref("spec:consumers.spec-studio.spec-page"),
  ],
});
void panels;
describe("architecture tables and register", () => {
  it("orders both matrix axes by layer and id, links counts to supporting unit edges and keeps zeros compact", async () => {
    const files: Record<string, string> = { "s.sdp.md": carrier("sample") };
    for (const [id, layer] of [
      ["z", "edge"],
      ["a", "domain"],
      ["b", "domain"],
      ["u", ""],
    ] as const)
      files[`${id}.ts`] = anchor(
        `component:${id}`,
        ` * @sdpLabel ${id} label\n${layer ? ` * @sdpLayer ${layer}\n` : ""}${id === "z" ? " * @sdpUses impl:a, impl:a2, component:z, impl:missing\n" : ""}`,
      );
    for (const id of ["a", "a2"])
      files[`${id}-unit.ts`] = anchor(`impl:${id}`, " * @sdpComponent component:a\n");
    files["z-unit.ts"] = anchor("impl:z", " * @sdpComponent component:z\n * @sdpUses impl:a\n");
    const page = find(await pages(files), "architecture.html");
    const matrix = page.split('class="component-uses"')[1]?.split("</table>")[0] ?? "";
    expect(matrix).toContain("Which components use which");
    expect(
      [...matrix.matchAll(/<th scope="col"[^>]*>(.*?)<\/th>/gsu)].map((m) => m[1]).join(" "),
    ).toMatch(/component:z.*component:a.*component:b.*component:u/su);
    expect(matrix).toContain('href="#uses.component:z.component:a">3</a>');
    expect(page).toContain('<div id="uses.component:z.component:a"><h4>');
    expect(page).toContain("component:z</code> uses <code>impl:a");
    expect(matrix).toContain('class="uses-self"></td>');
    expect(matrix).toContain(
      '<span aria-hidden="true">·</span><span class="visually-hidden">no anchored use recorded</span>',
    );
    expect(page).toContain("· means no anchored use recorded");
    expect(matrix).not.toContain("impl:missing");
    expect(matrix).not.toContain("Mermaid");
  });
  it("groups unfamiliar and omitted roles in code-unit order, with source rows and separate binding lists", async () => {
    const page = find(
      await pages({
        "s.sdp.md": carrier("sample"),
        "r.sdp.md": carrier("reference"),
        "c.ts": anchor("component:sample", " * @sdpSatisfies spec:sample\n"),
        "b.ts": anchor(
          "impl:B",
          " * @sdpComponent component:sample\n * @sdpRole zebra\n * @sdpReferences spec:reference\n",
        ),
        "a.ts": anchor(
          "impl:A",
          " * @sdpComponent component:sample\n * @sdpRole adopter-role\n * @sdpSatisfies spec:sample\n * @sdpReferences spec:reference\n",
        ),
        "none.ts": anchor("impl:none", " * @sdpComponent component:sample\n"),
        "free.ts": anchor("impl:free", " * @sdpRole unfamiliar\n"),
      }),
      "architecture.html",
    );
    expect(page).toContain("Significant units");
    expect(page).toContain('href="#component:sample"');
    expect(page).toContain("Component source binding");
    expect(page.indexOf("Role adopter-role")).toBeLessThan(page.indexOf("Role zebra"));
    expect(page.indexOf("Role zebra")).toBeLessThan(page.indexOf("Role not stated"));
    const row = page.split('data-unit="impl:A"')[1]?.split("</details>")[0] ?? "";
    expect(row).toContain('data-source-file="a.ts"');
    expect(row).toContain("Satisfies");
    expect(row).toContain("References");
    expect(row).toContain("spec:sample");
    expect(row).toContain("spec:reference");
    expect(page).toContain("No component");
    expect(page).toContain('data-unit="impl:free"');
    const component = page.split('<section id="component:sample"')[1]?.split("</section>")[0] ?? "";
    expect(component).not.toContain("<h3>Members by role</h3>");
    expect(component.match(/data-source-file="a.ts"/gu)).toHaveLength(1);
    expect(component).toMatch(
      /<h3>References<\/h3>(?:<ul[^>]*>.*?<\/ul>|<p>None\.<\/p>)<section><sdp-diagram/su,
    );
  });
});

describe("maturity picture", () => {
  it("draws equal categorical cells, exact counts and marks with ordered complete lists and unresolved members apart", async () => {
    const page = find(
      await pages({
        "a.sdp.md": carrier("a", "{dependsOn: spec:basis}", "idea"),
        "b.sdp.md": carrier("b", "{dependsOn: spec:basis}"),
        "c.sdp.md": carrier("c", "{dependsOn: spec:basis}", "idea"),
        "basis.sdp.md": carrier("basis"),
        "p.pack.sdp.md":
          "---\nid: pack:sample\nspecs: [spec:c, spec:a, spec:b, spec:missing]\n---\n# Sample\n",
      }),
      "packs/sample.html",
    );
    const map = page.split("<sdp-maturity-map")[1]?.split("</sdp-maturity-map>")[0] ?? "";
    expect(map).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(map.match(/class="maturity-cell /gu)).toHaveLength(20);
    expect(map.match(/class="member-mark"/gu)).toHaveLength(3);
    expect(map).toContain('id="diagram.pack:sample.maturity.text"');
    expect(map).toContain('href="#diagram.pack:sample.maturity.cell.idea.ready"');
    expect(map).toContain('<details id="diagram.pack:sample.maturity.cell.idea.ready">');
    expect(map.indexOf('href="#spec:c"')).toBeLessThan(map.indexOf('href="#spec:a"'));
    expect(map).toContain("Unresolved members");
    expect(map).toContain("spec:missing");
    expect(map).not.toContain("Stated readiness by floor reached</summary>");
    const legend = /<p class="maturity-legend">(.*?)<\/p>/su.exec(map)?.[1] ?? "";
    for (const phrase of ["matches", "floor above statement", "statement above floor"])
      expect(legend.split(phrase)).toHaveLength(2);
    const cells = [
      ...map.matchAll(
        /<g class="maturity-cell ([^"]+)" data-stated="([^"]+)" data-floor="([^"]+)">(.*?)<\/g>/gsu,
      ),
    ];
    expect(cells).toHaveLength(20);
    expect(cells.filter((c) => c[1]?.split(" ").includes("matches"))).toHaveLength(4);
    for (const cell of cells) {
      expect(cell[1]?.split(" ").includes("matches")).toBe(cell[2] === cell[3]);
      if (cell[1]?.startsWith("empty")) expect(cell[4]).not.toContain("<text");
    }
    expect(map).toContain("block-beta\n  columns 6");
    expect(map).toContain('role="group"');
    expect(map).not.toContain('role="img"');
  });
  it("puts a uniform map behind a closed disclosure and uses solid fill above the mark bound", async () => {
    const files: Record<string, string> = { "basis.sdp.md": carrier("basis") };
    const ids = Array.from({ length: 101 }, (_, i) => `spec:item${String(i)}`);
    ids.forEach(
      (id) => (files[`${id.slice(5)}.sdp.md`] = carrier(id.slice(5), "{dependsOn: spec:basis}")),
    );
    files["p.pack.sdp.md"] = `---\nid: pack:sample\nspecs: [${ids.join(", ")}]\n---\n# Sample\n`;
    const map =
      find(await pages(files), "packs/sample.html")
        .split("<sdp-maturity-map")[1]
        ?.split("</sdp-maturity-map>")[0] ?? "";
    expect(map).toContain("101 members at stated defined and floor ready");
    expect(map).toContain(
      '<details class="maturity-grid"><summary>Stated readiness by floor reached</summary>',
    );
    expect(map).toContain("maturity-cell populated solid");
    expect(map).not.toContain('class="member-mark"');
    expect([...map.matchAll(/<li><a href="#spec:item/gu)]).toHaveLength(101);
  });
});

describe("requirement drawing", () => {
  it("selects the subject, refiners and verifying examples and keeps declared and anchored claims separate", async () => {
    const page = find(
      await pages({
        "s.sdp.md": carrier("sample"),
        "child.sdp.md": carrier("child", "{refines: spec:sample}"),
        "outside.sdp.md": carrier("outside"),
        "e.sdp.md": carrier(
          "example",
          "{refines: spec:sample, verifies: spec:sample}",
          "idea",
          "example",
        ),
        "other.sdp.md": carrier("other-example", "{verifies: spec:child}", "idea", "example"),
        "impl.ts": anchor(
          "impl:sample",
          " * @sdpSatisfies spec:child\n * @sdpReferences spec:sample\n",
        ),
        "test.ts": anchor("test:example", " * @sdpVerifies spec:example\n"),
        "oracle.ts": anchor("oracle:sample", " * @sdpModels spec:sample\n"),
      }),
      "specs/sample.html",
    );
    const drawing =
      page.split("<h3>Requirement drawing</h3>")[1]?.split("<h3>Decisions</h3>")[0] ?? "";
    expect(drawing).toContain('id="diagram.spec:sample.requirement.text"');
    expect(drawing).not.toContain("Realization of");
    for (const id of [
      "spec:sample",
      "spec:child",
      "spec:example",
      "spec:other-example",
      "impl:sample",
      "test:example",
      "oracle:sample",
    ])
      expect(drawing).toContain(id);
    expect(drawing).not.toContain("spec:outside");
    const exampleBox = (id: string) => {
      const box = new RegExp(`<li>${id}: ([^<]+)<\\/li>`, "u").exec(drawing)?.[1];
      expect(box, id).toBeDefined();
      return box;
    };
    expect(exampleBox("spec:example")).not.toContain("no test binding");
    expect(exampleBox("spec:other-example")).toContain("no test binding");
    expect(drawing).not.toContain("None.");
    expect(drawing).toMatch(/data-id="impl:sample"><a href="#bindings"/u);
    expect(drawing).toMatch(/data-id="test:example"><a href="#bindings"/u);
    expect(drawing).toContain("no satisfying binding");
    expect(drawing).toContain("binding present");
    expect(drawing).toContain("anchored oracle binding");
    expect(drawing).toContain('data-source-file="test.ts"');
    expect(drawing).toContain("references");
    expect(drawing).toContain("models");
    expect(drawing).toContain("flowchart TB");
    expect(drawing).toContain("requirementDiagram");
    expect(drawing).not.toMatch(/passed|verifyMethod|risk:/u);
    expect(drawing.match(/data-id="spec:example"/gu)).toHaveLength(1);
    expect(drawing.indexOf('data-id="spec:example"')).toBeLessThan(
      drawing.indexOf('data-label="Declared verifying examples"'),
    );
  });
  it("offers requirement syntax for the supported exact relation subset", async () => {
    const page = find(
      await pages({
        "s.sdp.md": carrier("sample"),
        "impl.ts": anchor("impl:sample", " * @sdpSatisfies spec:sample\n"),
        "test.ts": anchor("test:sample", " * @sdpVerifies spec:sample\n"),
      }),
      "specs/sample.html",
    );
    const drawing =
      page.split("<h3>Requirement drawing</h3>")[1]?.split("<h3>Decisions</h3>")[0] ?? "";
    expect(drawing).toContain("requirementDiagram\n");
    expect(drawing).toContain("- satisfies -&gt;");
    expect(drawing).toContain("- verifies -&gt;");
    expect(drawing).toContain("%% claim: anchored");
    expect(drawing).toContain("type: &quot;impl:sample · anchored code");
  });
});

it("folds the largest exact relation group deterministically and keeps every original binding in text", () => {
  const boxes = [
    { id: "spec:sample", words: "Sample · declared Spec", target: "#main", band: "Intended Specs" },
    ...Array.from({ length: 60 }, (_, i) => ({
      id: `test:sample${String(i)}`,
      words: "anchored test binding · binding present",
      target: "#verification",
      band: "Test or oracle bindings",
      source: { file: `test/${String(i)}.ts`, line: 1 },
    })),
  ];
  const edges = boxes
    .slice(1)
    .map((b) => ({ from: b.id, to: "spec:sample", kind: "verifies", claim: "anchored" }));
  const input = { subject: "spec:sample", boxes, edges };
  const drawing = requirementDiagram(input);
  expect(drawing.boxes).toHaveLength(2);
  expect(
    drawing.boxes.some(
      (b) => b.id === "diagram.spec:sample.requirement.fold.verifies.incoming.anchored",
    ),
  ).toBe(true);
  expect(drawing.edges[0]?.count).toBe(60);
  const html = renderDiagram(drawing, "spec:sample.requirement");
  expect(html).toBe(renderDiagram(requirementDiagram(input), "spec:sample.requirement"));
  expect(html).toContain("flowchart TB");
  for (const b of boxes) expect(html).toContain(b.id);
  expect(html).toContain('data-source-file="test/59.ts"');
  expect(html.match(/test:sample\d+ verifies spec:sample/gu)).toHaveLength(60);
});

it("keeps a sparse large uses matrix readable with one visible zero legend and hidden cell words", async () => {
  const files: Record<string, string> = { "s.sdp.md": carrier("sample") };
  for (let i = 0; i < 24; i++) files[`unit${String(i)}.ts`] = anchor(`component:item${String(i)}`);
  const page = find(await pages(files), "architecture.html");
  const matrix = page.split('class="component-uses"')[1]?.split("</table>")[0] ?? "";
  expect(matrix.match(/class="visually-hidden">no anchored use recorded/gu)).toHaveLength(552);
  expect(matrix.match(/class="uses-self"/gu)).toHaveLength(24);
  expect(page.match(/· means no anchored use recorded/gu)).toHaveLength(1);
});

it("contains the matrix's hidden cell words inside their scroll region", () => {
  const css = readFileSync("src/projections/studio/studio.css", "utf8");
  expect(/\.component-uses td \{([^}]+)\}/u.exec(css)?.[1]).toContain("position: relative");
  expect(/\.visually-hidden \{([^}]+)\}/u.exec(css)?.[1]).toContain("overflow: hidden");
});

it("does not assert missing bindings on a boundary Spec whose bindings are outside the selected set", async () => {
  const page = find(
    await pages({
      "s.sdp.md": carrier("sample", "{refines: spec:basis}"),
      "b.sdp.md": carrier("basis"),
      "b.ts": anchor("impl:basis", " * @sdpSatisfies spec:basis\n"),
    }),
    "specs/sample.html",
  );
  const drawing =
    page.split("<h3>Requirement drawing</h3>")[1]?.split("<h3>Decisions</h3>")[0] ?? "";
  expect(drawing).toContain("spec:basis");
  expect(drawing).not.toContain("impl:basis");
  expect(drawing).not.toContain("basis · declared Spec · no satisfying binding");
});

it("lets full component ids wrap so every uses column fits the printed page", () => {
  const css = readFileSync("src/projections/studio/studio.css", "utf8");
  expect(css).toMatch(/@media print\s*\{\s*\.component-uses\s*\{[^}]*table-layout: fixed/su);
  expect(css).toMatch(/\.component-uses code\s*\{[^}]*overflow-wrap: anywhere/su);
});

it("keeps roles out of the pinned search record while preserving them on graph units", () => {
  // Use the extractor's current schema and a recorded unfamiliar role.
  const root = mkdtempSync(join(tmpdir(), "sdp-role-index-"));
  roots.push(root);
  writeFileSync(join(root, "unit.ts"), anchor("impl:role", " * @sdpRole adopter-role\n"));
  const reader = createReader(extract({ root }).graph);
  expect(reader.graph.nodes.find((n) => n.id === "impl:role")).toMatchObject({
    role: "adopter-role",
  });
  expect(searchIndex(reader).records.find((r) => r.id === "impl:role")).not.toHaveProperty("role");
});

it("lists a unit whose recorded component is missing in No component and in unresolved structure", async () => {
  const page = find(
    await pages({
      "unit.ts": anchor(
        "impl:orphan",
        " * @sdpComponent component:ghost\n * @sdpRole adopter-role\n",
      ),
    }),
    "architecture.html",
  );
  const unowned = page.split("<h2>No component</h2>")[1]?.split("</section>")[0] ?? "";
  expect(unowned).toContain("Role adopter-role");
  expect(unowned).toContain('data-unit="impl:orphan"');
  expect(page.split("<h2>Unresolved structure</h2>")[1]).toContain("component:ghost");
});

it("uses the singular member in a one-member Pack's uniform sentence", async () => {
  const page = find(
    await pages({
      "s.sdp.md": carrier("solo"),
      "p.pack.sdp.md": "---\nid: pack:solo\nspecs: [spec:solo]\n---\n# Solo\n",
    }),
    "packs/solo.html",
  );
  expect(page).toContain("1 member at stated defined and floor idea");
  expect(page).not.toContain("1 members at stated");
  expect(page).toContain("<title>stated defined, floor idea: 1 member</title>");
});

it("states each absent requirement band without implying that a populated drawing is missing", async () => {
  const page = find(await pages({ "s.sdp.md": carrier("solo") }), "specs/solo.html");
  const drawing =
    page.split("<h3>Requirement drawing</h3>")[1]?.split("<h3>Decisions</h3>")[0] ?? "";
  expect(drawing).toContain("Declared verifying examples: no declared verifying example.");
  expect(drawing).toContain("Satisfying or referencing units: no recorded binding.");
  expect(drawing).toContain("Test or oracle bindings: no recorded binding.");
});

it.each([
  {
    field: "kind",
    first: ["satisfies", "incoming", "anchored"],
    second: ["verifies", "incoming", "anchored"],
  },
  {
    field: "direction",
    first: ["verifies", "incoming", "anchored"],
    second: ["verifies", "outgoing", "anchored"],
  },
  {
    field: "claim",
    first: ["verifies", "incoming", "anchored"],
    second: ["verifies", "incoming", "declared"],
  },
])("breaks equal requirement fold groups by $field in lexical order", ({ first, second }) => {
  const subject = { id: "spec:sample", words: "Sample", target: "#main", band: "Intended Specs" };
  const groups = [first, second].map(([kind, direction, claim], group) => {
    const boxes = Array.from({ length: 20 }, (_, i) => ({
      id: `test:group${String(group)}.binding${String(i)}`,
      words: "Binding",
      target: "#bindings",
      band: "Test or oracle bindings",
    }));
    return {
      boxes,
      edges: boxes.map((b) => ({
        from: direction === "incoming" ? b.id : subject.id,
        to: direction === "incoming" ? subject.id : b.id,
        kind: kind ?? "verifies",
        claim: claim ?? "anchored",
      })),
    };
  });
  const drawing = requirementDiagram({
    subject: subject.id,
    boxes: [subject, ...groups.flatMap((g) => g.boxes)].reverse(),
    edges: groups.flatMap((g) => g.edges).reverse(),
  });
  expect(drawing.boxes.filter((b) => b.folded).map((b) => b.id)).toEqual([
    `diagram.spec:sample.requirement.fold.${first.join(".")}`,
  ]);
  expect(drawing.textEquivalent?.boxes).toHaveLength(41);
  expect(drawing.textEquivalent?.edges).toHaveLength(40);
});

it("offers only the active relation and member renderers after requirement replaces realization", () => {
  expect(diagrams).toHaveProperty("traceDiagram");
  expect(diagrams).toHaveProperty("memberDiagram");
  expect(diagrams).not.toHaveProperty("realizationDiagram");
});

it("applies the closed-source print rule to both requirement and maturity drawings", () => {
  const css = readFileSync("src/projections/studio/studio.css", "utf8");
  expect(css).toMatch(
    /sdp-maturity-map details\[id\$="\.source"\]:not\(\[open\]\)\s*\{[^}]*display: none !important/su,
  );
  expect(css).toMatch(
    /sdp-maturity-map details\[id\$="\.source"\]\[open\] textarea\s*\{[^}]*display: block !important/su,
  );
});

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { ref, specTest, testAnchorId } from "../src/anchors.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";

const catalog = specTest({
  id: testAnchorId("test:protocol.studio-diagram-catalog"),
  verifies: ref("spec:consumers.spec-studio.diagram-kinds"),
});
void catalog;

describe("the shipped diagram catalog", () => {
  let context: ReturnType<ReturnType<typeof createReader>["specContext"]>;
  beforeAll(() => {
    const graph = extract({
      root: fileURLToPath(new URL("..", import.meta.url)),
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    }).graph;
    context = createReader(graph).specContext("spec:consumers.spec-studio.diagram-kinds");
  }, 30_000);
  it("keeps the complete drawn catalog and every other family deferred or refused", () => {
    const design = context?.sections?.design ?? {};
    const choices = Object.entries(design)
      .filter(([, value]) => /^(Draw|Equivalent|Defer|Refuse)\b/u.test(String(value)))
      .map(
        ([key, value]) =>
          [key, /^(Draw|Equivalent|Defer|Refuse)\b/u.exec(String(value))?.[1]] as const,
      );
    expect(Object.fromEntries(choices)).toEqual({
      flowchart: "Draw",
      mindmap: "Draw",
      treeView: "Equivalent",
      block: "Draw",
      architecture: "Equivalent",
      usesTable: "Draw",
      requirement: "Draw",
      class: "Defer",
      entityRelationship: "Refuse",
      sequence: "Refuse",
      zenUml: "Refuse",
      state: "Refuse",
      journey: "Refuse",
      gantt: "Refuse",
      pie: "Defer",
      quadrant: "Refuse",
      gitGraph: "Refuse",
      c4: "Refuse",
      timeline: "Refuse",
      sankey: "Refuse",
      xyChart: "Defer",
      packet: "Refuse",
      kanban: "Defer",
      radar: "Refuse",
      treemap: "Defer",
      swimlanes: "Refuse",
      useCase: "Refuse",
      eventModeling: "Refuse",
      venn: "Defer",
      ishikawa: "Refuse",
      wardley: "Refuse",
      cynefin: "Refuse",
      agentFlow: "Refuse",
      railroad: "Refuse",
    });
    for (const [key, choice] of choices) {
      if (choice === "Defer" || choice === "Refuse") expect(design[key]).toMatch(/Re-enter/u);
    }
    expect(design.diagnostics).toContain("not corpus diagram kinds");
  });

  let root: string;
  let before: string;
  let after: string;
  let pages: ReturnType<typeof renderStudio>;
  let repeated: ReturnType<typeof renderStudio>;
  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "sdp-catalog-"));

    const spec = (id: string, altitude: string, relations: string) =>
      `---\nid: spec:probe.${id}\nkind: behavior\naltitude: ${altitude}\nreadiness: defined\nrelations: ${relations}\n---\n# ${id}\n\n## Intent\n- outcome: Read ${id}.\n\n## Behavior\n- rule: Keep its graph identity.\n`;
    writeFileSync(join(root, "root.sdp.md"), spec("root", "epic", "{}"));
    writeFileSync(
      join(root, "part.sdp.md"),
      spec("part", "story", "{refines: spec:probe.root, dependsOn: spec:probe.root}"),
    );
    writeFileSync(
      join(root, "pack.pack.sdp.md"),
      "---\nid: pack:probe\norder: priority\nspecs: [spec:probe.root, spec:probe.part]\n---\n# Probe\n",
    );
    writeFileSync(
      join(root, "bindings.ts"),
      `/**\n * @sdpAnchor component:probe.one\n * @sdpSatisfies spec:probe.root\n * @sdpUses component:probe.two\n */\nexport const one=1;\n/**\n * @sdpAnchor component:probe.two\n * @sdpSatisfies spec:probe.part\n */\nexport const two=2;\n`,
    );
    const graph = extract({ root }).graph;
    before = JSON.stringify(graph);
    const data = await createStudioData(createReader(graph));
    pages = renderStudio(data);
    repeated = renderStudio(data);
    after = JSON.stringify(graph);
  }, 30_000);
  afterAll(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });
  it("renders the six promised readings from explicit graph values without adding other forms", () => {
    const page = (path: string) => pages.find((row) => row.path === path)?.content ?? "";
    const slice = page("slices/probe.html");
    for (const kind of ["dependencies", "architecture"])
      expect(slice).toContain(`id="diagram.pack:probe.${kind}.text"`);
    expect(page("capabilities.html")).toContain(".capability.text");
    expect(page("packs/probe.html")).toContain('id="diagram.pack:probe.maturity.text"');
    // spec:consumers.spec-studio.diagram-kinds#design.usesTable
    const uses = /<section><h2>Component uses<\/h2>[\s\S]*?<\/section>/u.exec(
      page("architecture.html"),
    )?.[0];
    expect(uses).toBeDefined();
    expect(uses).toContain('class="component-uses"');
    expect(uses).not.toContain("<textarea");
    expect(page("specs/probe.root.html")).toContain(
      'id="diagram.spec:probe.root.requirement.text"',
    );
    // spec:consumers.spec-studio.diagram-kinds#rule.drawnKinds
    const specPage = page("specs/probe.root.html");
    const designView =
      specPage.split('id="panel.design-view"')[1]?.split('id="panel.runtime"')[0] ?? "";
    const specDrawingIds = [...designView.matchAll(/\bid="(diagram\.[^"]+)"/gu)].map(
      (match) => match[1],
    );
    expect(specDrawingIds.length).toBeGreaterThan(0);
    for (const id of specDrawingIds)
      expect(id).toMatch(/^diagram\.spec:probe\.root\.requirement\./u);
    expect(specPage).not.toContain(".realization.");
    const impact = specPage.split('id="panel.impact"')[1] ?? "";
    expect(impact).toContain('id="diagram.spec:probe.root.text"');
    const html = pages.map((row) => row.content).join("\n");
    const sources = [...html.matchAll(/<textarea[^>]*>([\s\S]*?)<\/textarea>/gu)].map(
      (match) => match[1]?.trim().split("\n")[0],
    );
    expect(sources.length).toBeGreaterThan(0);
    for (const firstLine of sources)
      expect(firstLine).toMatch(/^(flowchart (TB|BT)|mindmap|block-beta|requirementDiagram)$/u);
    expect(after).toBe(before);
    expect(repeated).toEqual(pages);
  });
});

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
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
  it("binds the complete drawn set and keeps every other family deferred or refused", () => {
    const graph = extract({
      root: fileURLToPath(new URL("..", import.meta.url)),
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    }).graph;
    const context = createReader(graph).specContext("spec:consumers.spec-studio.diagram-kinds");
    expect(context?.deliveryFacts).toEqual(["implemented", "has-verifier"]);
    const design = context?.sections?.design ?? {};
    const choices = Object.entries(design)
      .filter(([, value]) => /^(Draw|Equivalent|Defer|Refuse)\b/u.test(String(value)))
      .map(([key, value]) => [key, /^(Draw|Equivalent|Defer|Refuse)\b/u.exec(String(value))?.[1]]);
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

  it("renders the six promised readings from explicit graph values without adding other forms", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-catalog-"));
    try {
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
      const before = JSON.stringify(graph);
      const data = await createStudioData(createReader(graph));
      const pages = renderStudio(data);
      const page = (path: string) => pages.find((row) => row.path === path)?.content ?? "";
      const slice = page("slices/probe.html");
      for (const kind of ["dependencies", "architecture"])
        expect(slice).toContain(`id="diagram.pack:probe.${kind}.text"`);
      expect(page("capabilities.html")).toContain(".capability.text");
      expect(page("packs/probe.html")).toContain('id="diagram.pack:probe.maturity.text"');
      expect(page("architecture.html")).toContain('class="component-uses"');
      expect(page("specs/probe.root.html")).toContain(
        'id="diagram.spec:probe.root.requirement.text"',
      );
      const html = pages.map((row) => row.content).join("\n");
      const sources = [...html.matchAll(/<textarea[^>]*>([\s\S]*?)<\/textarea>/gu)].map(
        (match) => match[1]?.trim().split("\n")[0],
      );
      expect(sources.length).toBeGreaterThan(0);
      for (const firstLine of sources)
        expect(firstLine).toMatch(/^(flowchart (TB|BT)|mindmap|block-beta|requirementDiagram)$/u);
      expect(JSON.stringify(graph)).toBe(before);
      expect(renderStudio(data)).toEqual(pages);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

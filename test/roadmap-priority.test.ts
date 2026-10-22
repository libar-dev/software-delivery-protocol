import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { createReader, evaluateBody, extract, pack, packId, serializeGraph } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";
import { createStudioData } from "../src/projections/studio/data.js";
import type { Diff } from "../src/projections/studio/pages/register-answers.js";
import { renderStudio } from "./helpers/studio-render.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
const markdown = (order = "") =>
  `---\nid: pack:probe.review\nspecs: []\nmodelRefs: []\n${order}---\n# Review\n\nRead the next work.\n`;
const typescript = (order = "") =>
  `import { pack, packId } from "@libar-dev/software-delivery-protocol";\nexport const review = pack({ id: packId("pack:probe.review"), specs: [], modelRefs: [], title: "Review", framing: "Read the next work.", ${order} });\n`;
function corpus(source: string, extension = "md"): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-priority-"));
  roots.push(root);
  writeFileSync(join(root, `review.pack.sdp.${extension}`), source);
  return root;
}
function graphOf(priority: boolean): GraphSchema {
  return extract({ root: corpus(markdown(priority ? "order: priority\n" : "")) }).graph;
}
async function diff(base: unknown, graph: GraphSchema): Promise<Diff> {
  // Execute the catalog body itself; the build also ships these exact bytes.
  const catalog = readFileSync(
    new URL("../docs/agent-surface/recipes.md", import.meta.url),
    "utf8",
  );
  const section = catalog.split(/^## 35\. .+$/mu)[1]?.split(/^## /mu)[0];
  const body = /```js\n([\s\S]*?)\n```/u.exec(section ?? "")?.[1];
  if (body === undefined) throw new Error("Missing design diff recipe");
  return (await evaluateBody(body, { graph, params: { base, detail: true } })) as Diff;
}

const priorityAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap-priority"),
  verifies: [
    ref("spec:decisions.roadmap-priority"),
    ref("spec:carrier.markdown-pack-authoring"),
    ref("spec:model.pack-aggregate"),
    ref("spec:extraction.pack-member-order"),
    ref("spec:consumers.design-diff"),
    ref("spec:consumers.spec-studio.diff-page"),
  ],
});
void priorityAnchor;

describe("roadmap priority manifest", () => {
  it("keeps the builder's optional priority without defaulting an ordinary Pack", () => {
    expect(
      pack({ id: packId("pack:probe.review"), specs: [], title: "Review", order: "priority" })
        .order,
    ).toBe("priority");
    expect(
      pack({ id: packId("pack:probe.review"), specs: [], title: "Review" }),
    ).not.toHaveProperty("order");
  });

  it("derives equal Markdown and TypeScript Pack nodes and edges, serializes order last, and exposes it through the reader", () => {
    const mdRoot = corpus(
      markdown("order: priority\n").replace("specs: []", "specs: [spec:probe.member]"),
    );
    const tsRoot = corpus(
      typescript('order: "priority"').replace("specs: []", 'specs: ["spec:probe.member"]'),
      "ts",
    );
    for (const root of [mdRoot, tsRoot])
      writeFileSync(
        join(root, "member.sdp.md"),
        "---\nid: spec:probe.member\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Member\n\n## Intent\n- outcome: Read this member.\n",
      );
    const md = extract({ root: mdRoot });
    const ts = extract({ root: tsRoot });
    expect(md.report.findings).toEqual([]);
    expect(ts.report.findings).toEqual([]);
    const node = md.graph.nodes.find((node) => node.nodeType === "Pack");
    expect(node).toMatchObject({ nodeType: "Pack", order: "priority" });
    expect(ts.graph.nodes.find((node) => node.nodeType === "Pack")).toEqual({
      ...node,
      file: "review.pack.sdp.ts",
    });
    expect(ts.graph.edges).toEqual(md.graph.edges);
    expect(md.graph.edges).toContainEqual({
      from: "spec:probe.member",
      type: "belongsTo",
      to: "pack:probe.review",
      claim: "declared",
    });
    const serialized = JSON.parse(serializeGraph(md.graph)) as { nodes: Record<string, unknown>[] };
    expect(Object.keys(serialized.nodes[0] ?? {})).toEqual([
      "id",
      "nodeType",
      "claim",
      "title",
      "framing",
      "file",
      "members",
      "modelRefs",
      "order",
    ]);
    const reader = createReader(md.graph);
    expect(reader.packs()[0]).toHaveProperty("order", "priority");
    expect(reader.packContext("pack:probe.review")).toHaveProperty("order", "priority");
    expect(createReader(graphOf(false)).packs()[0]).not.toHaveProperty("order");
    expect(serializeGraph(graphOf(false))).not.toContain('"order"');
  });

  it.each(["reading", "arbitrary", "true", "null", "[]", "{}"])(
    "refuses the invalid Markdown value %s",
    (value) => {
      const result = extract({ root: corpus(markdown(`order: ${value}\n`)) });
      expect(result.graph.nodes).toEqual([]);
      expect(result.report.findings).toEqual([
        expect.objectContaining({
          validatorId: "extract/invalid-frontmatter",
          severity: "error",
          file: "review.pack.sdp.md",
          line: 5,
        }),
      ]);
    },
  );

  it.each(['"reading"', '"arbitrary"', "true", "null", "[]", "{}", "undefined", "chosenOrder"])(
    "refuses the invalid TypeScript value %s",
    (value) => {
      const result = extract({ root: corpus(typescript(`order: ${value}`), "ts") });
      expect(result.graph.nodes).toEqual([]);
      expect(result.report.findings).toEqual([
        expect.objectContaining({
          validatorId: "extract/invalid-frontmatter",
          severity: "error",
          file: "review.pack.sdp.ts",
          line: 2,
        }),
      ]);
    },
  );
});

describe("roadmap priority design diff", () => {
  it.each([true, false])(
    "compares a priority transition to %s without a membership edit",
    async (priority) => {
      const result = await diff(graphOf(!priority), graphOf(priority));
      expect(result.packs).toEqual([
        {
          id: "pack:probe.review",
          change: "changed",
          membersAdded: [],
          membersRemoved: [],
          reordered: false,
          orderChanged: true,
          orderBefore: priority ? "reading" : "priority",
          orderAfter: priority ? "priority" : "reading",
        },
      ]);
      expect(result.totals?.packs).toBe(1);
    },
  );

  it("reads an absent order as reading order in a base schema that predates the field", async () => {
    const result = await diff({ ...graphOf(false), schemaVersion: "0.11.0" }, graphOf(true));
    expect(result.packs?.[0]).toMatchObject({
      orderChanged: true,
      orderBefore: "reading",
      orderAfter: "priority",
    });
    expect(result.diagnostics).toEqual([{ part: "schemaVersion", base: "0.11.0", head: "0.12.0" }]);
    expect((await diff(graphOf(false), graphOf(false))).packs).toEqual([]);
    expect((await diff(graphOf(true), graphOf(true))).packs).toEqual([]);
  });

  it.each([true, false])(
    "marks the absent side of an added or removed roadmap as null (%s)",
    async (added) => {
      const empty = { ...graphOf(false), nodes: [] };
      const priority = graphOf(true);
      expect((await diff(added ? empty : priority, added ? priority : empty)).packs).toEqual([
        {
          id: "pack:probe.review",
          change: added ? "added" : "removed",
          membersAdded: [],
          membersRemoved: [],
          reordered: false,
          orderChanged: false,
          orderBefore: added ? null : "priority",
          orderAfter: added ? "priority" : null,
        },
      ]);
    },
  );

  it.each(["base", "head"])(
    "diagnoses an unknown order at the %s without comparing that Pack",
    async (side) => {
      const known = graphOf(false);
      const unknown = {
        ...known,
        nodes: known.nodes.map((node) => ({ ...node, order: "schedule" })),
      };
      const result = await diff(
        side === "base" ? unknown : known,
        (side === "head" ? unknown : known) as GraphSchema,
      );
      expect(result.packs).toEqual([]);
      expect(result.diagnostics).toEqual([
        {
          part: "order",
          id: "pack:probe.review",
          side,
          value: "schedule",
          problem: "Part is outside the common schema.",
        },
      ]);
    },
  );

  it.each([true, false])(
    "shows the roadmap transition to %s on the diff and Pack pages",
    async (priority) => {
      const data = await createStudioData(createReader(graphOf(priority)), undefined, {
        base: { graph: graphOf(!priority), label: "Earlier design" },
        runs: [],
      });
      const pages = renderStudio(data);
      for (const path of ["diff.html", "packs/probe.review.html"]) {
        expect(pages.find((page) => page.path === path)?.content).toContain(
          priority ? "now a roadmap" : "no longer a roadmap",
        );
      }
    },
  );
});

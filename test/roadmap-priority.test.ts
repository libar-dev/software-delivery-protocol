import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { createReader, evaluateBody, extract, serializeGraph } from "../src/index.js";
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
async function diff(base: unknown, graph: GraphSchema, pack?: string): Promise<Diff> {
  // Execute the catalog body itself; the build also ships these exact bytes.
  const catalog = readFileSync(
    new URL("../docs/agent-surface/recipes.md", import.meta.url),
    "utf8",
  );
  const section = catalog.split(/^## 35\. .+$/mu)[1]?.split(/^## /mu)[0];
  const body = /```js\n([\s\S]*?)\n```/u.exec(section ?? "")?.[1];
  if (body === undefined) throw new Error("Missing design diff recipe");
  return (await evaluateBody(body, {
    graph,
    params: { base, detail: true, ...(pack === undefined ? {} : { pack }) },
  })) as Diff;
}

const priorityAnchor = specTest({
  id: testAnchorId("test:protocol.roadmap-priority"),
  label: "checks Pack priority extraction, comparison and Studio change notes",
  verifies: [
    ref("spec:carrier.markdown-pack-authoring"),
    ref("spec:model.pack-aggregate"),
    ref("spec:extraction.pack-member-order"),
    ref("spec:consumers.design-diff"),
    ref("spec:consumers.spec-studio.diff-page"),
  ],
});
void priorityAnchor;

describe("roadmap priority manifest", () => {
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
  it("documents the order comparison fields, default and diagnostic in the recipe contract", () => {
    const catalog = readFileSync(
      new URL("../docs/agent-surface/recipes.md", import.meta.url),
      "utf8",
    );
    const contract = catalog.split("`packs` reports")[1]?.split("`bindings`")[0];
    for (const term of [
      "`orderChanged`",
      "`orderBefore`",
      "`orderAfter`",
      '`"reading"`',
      '{ part: "order", id, side, value, problem }',
    ]) {
      expect(contract).toContain(term);
    }
  });

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
    "diagnoses an unknown order at the %s without reporting an order change",
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

  it.each(["base", "head"])(
    "still compares membership and member order when the %s order is unknown",
    async (side) => {
      const original = graphOf(true);
      const withMembers = (members: string[], unknown: boolean) => ({
        ...original,
        nodes: original.nodes.map((node) => ({
          ...node,
          members,
          ...(unknown ? { order: "schedule" } : {}),
        })),
      });
      const result = await diff(
        withMembers(["spec:probe.a", "spec:probe.c"], side === "base"),
        withMembers(
          ["spec:probe.c", "spec:probe.a", "spec:probe.b"],
          side === "head",
        ) as GraphSchema,
      );
      expect(result.packs).toEqual([
        {
          id: "pack:probe.review",
          change: "changed",
          membersAdded: ["spec:probe.b"],
          membersRemoved: [],
          reordered: true,
          orderChanged: false,
          orderBefore: side === "base" ? null : "priority",
          orderAfter: side === "head" ? null : "priority",
        },
      ]);
      expect(result.totals?.packs).toBe(1);
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

  it("keeps an order-only change in the selected Pack's comparison scope", async () => {
    const withOther = (graph: GraphSchema): GraphSchema => {
      const pack = graph.nodes.find((node) => node.nodeType === "Pack");
      if (pack === undefined) throw new Error("Missing Pack");
      return { ...graph, nodes: [...graph.nodes, { ...pack, id: "pack:probe.other" }] };
    };
    const base = withOther(graphOf(false)),
      head = withOther(graphOf(true));
    const result = await diff(base, head, "pack:probe.review");
    expect(result.packs).toEqual([
      {
        id: "pack:probe.review",
        change: "changed",
        membersAdded: [],
        membersRemoved: [],
        reordered: false,
        orderChanged: true,
        orderBefore: "reading",
        orderAfter: "priority",
      },
    ]);
    expect(result.totals?.packs).toBe(1);
    expect(result.diagnostics).toEqual([]);
  });

  it.each([true, false])(
    "shows no roadmap transition for a membership-only change (priority %s)",
    async (priority) => {
      const base = graphOf(priority);
      const head = {
        ...base,
        nodes: base.nodes.map((node) =>
          node.nodeType === "Pack"
            ? { ...node, members: [...node.members, "spec:probe.added"] }
            : node,
        ),
      };
      const data = await createStudioData(createReader(head), undefined, {
        base: { graph: base, label: "Earlier design" },
        runs: [],
      });
      const pages = renderStudio(data);
      for (const path of ["diff.html", "packs/probe.review.html"]) {
        const content = pages.find((page) => page.path === path)?.content;
        expect(content).toContain("spec:probe.added");
        expect(content).not.toContain("now a roadmap");
        expect(content).not.toContain("no longer a roadmap");
      }
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
      const diffPage = pages.find((page) => page.path === "diff.html")?.content;
      expect(diffPage).toContain("1 Pack with membership, member order or order meaning changes.");
      expect(diffPage).toContain(
        "<h2>Packs with membership, member order or order meaning changes</h2>",
      );
      for (const path of ["diff.html", "packs/probe.review.html"]) {
        const content = pages.find((page) => page.path === path)?.content;
        expect(content).toContain("Member order unchanged.");
        expect(content).toContain(priority ? "now a roadmap" : "no longer a roadmap");
      }
    },
  );
});

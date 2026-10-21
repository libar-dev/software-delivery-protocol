import type { RunnableExampleAdapters } from "../src/testing/index.js";
import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
  specOracle,
  oracleAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  DiagramsConditions,
  DiagramsOutcome,
} from "../generated/contracts/consumers.spec-studio.diagrams.space.js";
import type {
  ArchitectureConditions,
  ArchitectureOutcome,
} from "../generated/contracts/consumers.spec-studio.lenses.architecture.space.js";
import type {
  TestsConditions,
  TestsOutcome,
} from "../generated/contracts/consumers.spec-studio.lenses.tests.space.js";
import type {
  ExampleSpaceCoverageConditions,
  ExampleSpaceCoverageOutcome,
} from "../generated/contracts/consumers.agent-surface.example-space-coverage.space.js";
import { registerWithinBound } from "./consumers.spec-studio.diagrams.within-bound.test.generated.js";

import { registerFoldsByContext } from "./consumers.spec-studio.diagrams.folds-by-context.test.generated.js";

import { registerFoldsByLayer } from "./consumers.spec-studio.diagrams.folds-by-layer.test.generated.js";

import { registerPlannedApart } from "./consumers.spec-studio.lenses.architecture.planned-apart.test.generated.js";

import { registerCoverageRow } from "./consumers.spec-studio.lenses.tests.coverage-row.test.generated.js";

import { registerUncoveredLiteral } from "./consumers.agent-surface.example-space-coverage.uncovered-literal.test.generated.js";

import { registerNumberNotEnumerable } from "./consumers.agent-surface.example-space-coverage.number-not-enumerable.test.generated.js";

import { describe, expect, it } from "vitest";
import {
  architectureDiagrams,
  renderDiagram,
  traceDiagram,
  memberDiagram,
  realizationDiagram,
} from "../src/projections/studio/diagrams/index.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
import { createReader } from "../src/reader/reader.js";
import { schemaVersion } from "../src/graph/schema.js";
import type { GraphSchema } from "../src/graph/schema.js";
import type { Diagram } from "../src/projections/studio/diagrams/model.js";

function groups(html: string, className: string, label?: string): string[] {
  const stack: { start: number; tag: string }[] = [];
  const found: string[] = [];
  for (const match of html.matchAll(/<\/?g\b[^>]*>/gu)) {
    if (!match[0].startsWith("</")) stack.push({ start: match.index, tag: match[0] });
    else {
      const start = required(stack.pop());
      if (
        start.tag.includes(`class="${className}"`) &&
        (label === undefined || start.tag.includes(`data-label="${label}"`))
      )
        found.push(html.slice(start.start, match.index + match[0].length));
    }
  }
  return found;
}
function gridMembership(drawing: Diagram): void {
  const html = renderDiagram(drawing);
  if (!html.includes("<svg")) return;
  const boxes = drawing.boxes.filter((b) => !b.folded);
  const contexts = [...new Set(boxes.map((b) => b.context ?? "not stated"))].sort((a, b) =>
    a === "not stated" ? 1 : b === "not stated" ? -1 : a < b ? -1 : a > b ? 1 : 0,
  );
  expect(groups(html, "lane").map((g) => /data-label="([^"]+)"/u.exec(g)?.[1])).toEqual(contexts);
  const layers = [
    "edge",
    "application",
    "domain",
    "adapter",
    "infrastructure",
    "not stated",
  ].filter((l) => boxes.some((b) => (b.layer ?? "not stated") === l));
  for (const lane of groups(html, "lane"))
    expect(groups(lane, "band").map((g) => /data-label="([^"]+)"/u.exec(g)?.[1])).toEqual(layers);
  for (const box of drawing.boxes.filter((b) => !b.folded)) {
    const lane = required(groups(html, "lane", box.context ?? "not stated")[0]);
    const band = required(groups(lane, "band", box.layer ?? "not stated")[0]);
    expect(band).toContain(`data-id="${box.id}"`);
  }
}

export const architectureInput = (n: number, contexts: number, layers: number, edges = 0) => {
  const boxes = Array.from({ length: n }, (_, i) => ({
    id: `component:probe.c${String(i + 1).padStart(2, "0")}`,
    words: `Component ${String(i + 1)}`,
    context: `c${String(i % contexts)}`,
    layer: required(["edge", "application", "domain", "adapter", "infrastructure"][i % layers]),
    target: `#component:probe.c${String(i + 1).padStart(2, "0")}`,
  }));
  const pairs = boxes.flatMap((from) =>
    boxes
      .filter((to) => from !== to)
      .map((to) => ({ from: from.id, to: to.id, kind: "uses", count: 1 })),
  );
  return { boxes, edges: pairs.slice(0, edges) };
};
describe("Studio diagrams", () => {
  it.each([
    [12, 3, 4, 20, "nothing", 12],
    [45, 3, 5, 0, "context", 3],
    [50, 1, 5, 0, "layer", 5],
  ] as const)("bounds and folds %i components", (n, c, l, e, fold, drawn) => {
    const input = architectureInput(n, c, l, e);
    const result = architectureDiagrams(input);
    expect(result.fold).toBe(fold);
    expect(required(result.drawings[0]).boxes).toHaveLength(drawn);
    expect(result).toEqual(architectureDiagrams(input));
    for (const drawing of result.drawings) {
      const html = renderDiagram(drawing);
      expect(html).toContain("The diagram as text");
      expect(
        (drawing.boxes.length <= 40 && drawing.edges.length <= 100) || !html.includes("<svg"),
      ).toBe(true);
    }
  });
  it("keeps every edge in an open text fallback", () => {
    const result = architectureDiagrams(architectureInput(41, 1, 1, 110));
    const last = required(result.drawings.at(-1));
    const html = renderDiagram(last);
    expect(html).not.toContain("<svg");
    expect(html).toContain("<details open");
    expect(last.edges).toHaveLength(110);
    expect(html).toContain(
      "Shown as text: this drawing exceeds the bound of 40 boxes and 100 edges.",
    );
  });
  it("orders grid contexts and layers and wraps after six boxes with pinned label metrics", () => {
    const input = architectureInput(12, 1, 1);
    const drawing = required(
      architectureDiagrams({
        ...input,
        boxes: [
          ...input.boxes,
          { id: "component:probe.unstated", words: "Unstated", target: "#u" },
          { id: "component:probe.z", words: "Z", context: "z", layer: "domain", target: "#z" },
          { id: "component:probe.a", words: "A", context: "a", layer: "application", target: "#a" },
        ],
      }).drawings[0],
    );
    gridMembership(drawing);
    const html = renderDiagram(drawing);
    expect(groups(html, "lane").map((g) => /data-label="([^"]+)"/u.exec(g)?.[1])).toEqual([
      "a",
      "c0",
      "z",
      "not stated",
    ]);
    const c0 = required(groups(html, "lane", "c0")[0]);
    expect(groups(c0, "band").map((g) => /data-label="([^"]+)"/u.exec(g)?.[1])).toEqual([
      "edge",
      "application",
      "domain",
      "not stated",
    ]);
    const nodes = groups(c0, "node");
    const y = (i: number) => /<rect x="\d+" y="(\d+)"/u.exec(required(nodes[i]))?.[1];
    expect(y(0)).toBe(y(5));
    expect(Number(y(6))).toBeGreaterThan(Number(y(5)));
    expect(y(6)).toBe(y(11));
    expect(labelLines("component:probe.a-very-long-identifier")).toEqual([
      "component:probe.",
      "a-very-long-identifier",
    ]);
    expect(labelLines("a-very-long-identifier-with-hyphens-only")).toEqual([
      "a-very-long-identifier-with-",
      "hyphens-only",
    ]);
    const node = required(nodes[0]);
    const width = Number(/width="(\d+)"/u.exec(node)?.[1]);
    expect(width).toBe(Math.ceil("component:probe.c01".length * 7.5) + 24);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-describedby="diagram.architecture.text"');
  });
  it("draws planned-use edges dashed independently of planned box outlines", () => {
    const boxes = architectureInput(2, 1, 1).boxes;
    const html = renderDiagram({
      subject: "probe",
      caption: "Probe",
      boxes,
      edges: [{ from: required(boxes[0]).id, to: required(boxes[1]).id, kind: "plans to use" }],
    });
    expect(required(groups(html, "edge")[0])).toContain('stroke-dasharray="6 4"');
  });
  it("checks the edge bound even when boxes fit", () => {
    const input = architectureInput(12, 1, 1, 101);
    const html = renderDiagram({ ...input, subject: "probe", caption: "Probe" });
    expect(html).not.toContain("<svg");
    expect(html.match(/<li>/gu)).toHaveLength(113);
  });
  it("places folded contexts and layers in their own bands below the grid", () => {
    const result = architectureDiagrams(architectureInput(45, 3, 5, 1));
    expect(required(result.drawings[0]).edges).toEqual([
      { from: "context.c0", to: "context.c1", kind: "uses", count: 1 },
    ]);
    expect(result.drawings.map((d) => d.subject)).toEqual([
      "architecture",
      "context.c0",
      "context.c1",
      "context.c2",
    ]);
    const context = required(result.drawings[1]);
    const html = renderDiagram(context);
    const folded = required(groups(html, "band", "Other contexts")[0]);
    expect(folded).toContain('data-id="context.c1"');
    expect(html.indexOf(folded)).toBeGreaterThan(html.lastIndexOf('data-label="not stated"'));
    expect(
      groups(html, "lane").every((g) => !g.startsWith('<g class="lane" data-label="Other')),
    ).toBe(true);
    const layer = required(architectureDiagrams(architectureInput(50, 1, 5, 1)).drawings[1]);
    expect(required(groups(renderDiagram(layer), "band", "Other layers")[0])).toContain(
      'data-id="context.c0.layer.application"',
    );
  });
  it("places outgoing relation bands above the subject and folds ties in relation order", () => {
    const subject = { id: "spec:probe.subject", words: "Subject", target: "#s" };
    const kinds = ["refines", "dependsOn", "constrainedBy", "decidedBy"];
    const boxes = kinds.flatMap((kind) =>
      Array.from({ length: 11 }, (_, i) => ({
        id: `spec:probe.${kind}${String(i)}`,
        words: kind,
        target: "#relations",
      })),
    );
    const edges = boxes.map((box) => ({ from: subject.id, to: box.id, kind: box.words }));
    const trace = traceDiagram({ subject: subject.id, boxes: [subject, ...boxes], edges });
    expect(trace.boxes.filter((b) => b.folded).map((b) => b.band)).toEqual(["Outgoing refines"]);
    const bands = groups(renderDiagram(trace), "band").map(
      (g) => /data-label="([^"]+)"/u.exec(g)?.[1],
    );
    expect(bands).toEqual([...kinds.map((kind) => `Outgoing ${kind}`), "Subject"]);
  });
  it("folds trace relation groups and leaves member and realization overflow as text", () => {
    const boxes = architectureInput(50, 1, 1).boxes;
    const relations = boxes
      .slice(1)
      .map((b) => ({ from: required(boxes[0]).id, to: b.id, kind: "dependsOn" }));
    const trace = traceDiagram({ subject: required(boxes[0]).id, boxes, edges: relations });
    expect(trace.boxes.length).toBeLessThanOrEqual(40);
    expect(trace.boxes.some((b) => b.folded)).toBe(true);
    expect(renderDiagram(memberDiagram({ subject: "members", boxes, edges: [] }))).not.toContain(
      "<svg",
    );
    expect(
      renderDiagram(realizationDiagram({ subject: "realization", boxes, edges: [] })),
    ).not.toContain("<svg");
  });
});
const empty: GraphSchema = { schemaVersion, nodes: [], edges: [] };
const lensAnchor = specTest({
  id: testAnchorId("test:protocol.studio-lenses"),
  verifies: [
    ref("spec:consumers.spec-studio.lenses"),
    ref("spec:consumers.spec-studio.lenses.packs"),
    ref("spec:consumers.spec-studio.lenses.evidence"),
    ref("spec:consumers.spec-studio.data.recipe-answers"),
  ],
});
void lensAnchor;
describe("Studio lenses", () => {
  it("keeps recipe and diagram edges in code-unit order under forced Czech collation", async () => {
    const reader = fixture({
      "root.sdp.md": carrier(
        "spec:probe.root",
        "behavior",
        "\n  dependsOn: [spec:probe.check, spec:probe.delta]",
        "\n## Behavior\n- rule: Root.\n",
      ),
      "check.sdp.md": carrier(
        "spec:probe.check",
        "behavior",
        "{}",
        "\n## Behavior\n- rule: Check.\n",
      ),
      "delta.sdp.md": carrier(
        "spec:probe.delta",
        "behavior",
        "{}",
        "\n## Behavior\n- rule: Delta.\n",
      ),
      "component.ts": "/**\n * @sdpAnchor component:probe.core\n */\nexport const core=1;\n",
      "members.ts": ["check", "delta", "target"]
        .map(
          (name) =>
            `/**\n * @sdpAnchor impl:probe.${name}\n * @sdpComponent component:probe.core\n${name === "target" ? "" : " * @sdpUses impl:probe.target\n"} */\nexport const ${name}=1;\n`,
        )
        .join(""),
    });
    const normal = required(
      renderStudio(await createStudioData(reader)).find((p) => p.path === "architecture.html"),
    ).content;
    const collator = new Intl.Collator("cs");
    const spy = vi.spyOn(String.prototype, "localeCompare").mockImplementation(function (
      this: string,
      other: string,
    ) {
      return collator.compare(this, other);
    });
    try {
      const architecture = (await evaluateStudioRecipe(reader, 17)) as {
        usesEdges: { from: string }[];
      };
      expect(architecture.usesEdges.map((e) => e.from)).toEqual([
        "impl:probe.check",
        "impl:probe.delta",
      ]);
      const footing = (await evaluateStudioRecipe(reader, 21, { spec: "spec:probe.root" })) as {
        footing: { id: string }[];
      };
      expect(footing.footing.map((e) => e.id)).toEqual(["spec:probe.check", "spec:probe.delta"]);
      const forced = required(
        renderStudio(await createStudioData(reader)).find((p) => p.path === "architecture.html"),
      ).content;
      expect(forced).toBe(normal);
      const boxes = architectureInput(3, 1, 1).boxes;
      const edges = [
        { from: required(boxes[1]).id, to: required(boxes[2]).id, kind: "uses" },
        { from: required(boxes[0]).id, to: required(boxes[2]).id, kind: "uses" },
      ];
      expect(renderDiagram({ subject: "probe", caption: "Probe", boxes, edges })).toBe(
        renderDiagram({ subject: "probe", caption: "Probe", boxes, edges: [...edges].reverse() }),
      );
    } finally {
      spy.mockRestore();
    }
  });
  it("publishes all four ordered lenses and honest evidence without script", async () => {
    const data = await createStudioData(
      fixture({
        "a.sdp.md": carrier("spec:probe.a", "behavior", "{}", "\n## Behavior\n- rule: A.\n"),
        "b.sdp.md": carrier("spec:probe.b", "behavior", "{}", "\n## Behavior\n- rule: B.\n"),
        "unpacked.sdp.md": carrier(
          "spec:probe.unpacked",
          "behavior",
          "{}",
          "\n## Behavior\n- rule: Unpacked.\n",
        ),
        "z.pack.sdp.md": "---\nid: pack:probe.z\nspecs: [spec:probe.a]\n---\n# Z Pack\n",
        "a.pack.sdp.md":
          "---\nid: pack:probe.a\nspecs: [spec:probe.b, spec:probe.a]\n---\n# A Pack\n",
      }),
    );
    const pages = renderStudio(data);
    for (const path of ["index.html", "architecture.html", "tests.html", "evidence.html"])
      expect(pages.some((p) => p.path === path)).toBe(true);
    const evidence = required(pages.find((p) => p.path === "evidence.html")).content;
    expect(evidence.match(/not tracked/g)).toHaveLength(4);
    expect(evidence).toContain(
      "An observation the graph records against a measurable target would bring it in.",
    );
    expect(evidence.match(/A Spec that designs this source would bring it in\./gu)).toHaveLength(3);
    const nav = required(/<nav aria-label="Studio">(.*?)<\/nav>/u.exec(evidence)?.[1]);
    expect([...nav.matchAll(/<a[^>]*>(.*?)<\/a>/gu)].map((m) => m[1])).toEqual([
      "Packs",
      "Architecture",
      "Tests",
      "Evidence",
      "Queue",
      "Questions",
      "Decisions",
      "Declarations",
      "Backlog",
      "Glossary",
    ]);
    const index = required(pages.find((p) => p.path === "index.html")).content;
    const packs = required(/<section id="packs">(.*?)<\/section>/u.exec(index)?.[1]);
    expect([...packs.matchAll(/<summary>(.*?)<\/summary>/gu)].map((m) => m[1])).toEqual([
      "A Pack · <code>pack:probe.a</code> · 2 members",
      "Z Pack · <code>pack:probe.z</code> · 1 member",
    ]);
    expect(packs).not.toContain("<details open");
    const first = required(/<ol>(.*?)<\/ol>/u.exec(packs)?.[1]);
    expect([...first.matchAll(/href="([^"]+)"/gu)].map((m) => m[1])).toEqual([
      "specs/probe.b.html",
      "specs/probe.a.html",
    ]);
    expect(first.match(/badge rung-defined/gu)).toHaveLength(2);
    const specs = required(/<section id="specs">(.*?)<\/section>/u.exec(index)?.[1]);
    expect(specs).toContain("spec:probe.unpacked");
  });
  it("reads verifier binding from the delivery fact and gives absent coverage its own filter value", async () => {
    const reader = fixture({
      "parent.sdp.md": carrier(
        "spec:probe.parent",
        "behavior",
        "{}",
        "\n## Behavior\n- rule: Parent.\n",
      ).replace("# Probe", "# `sdp studio` publishes"),
      "child.sdp.md": carrier(
        "spec:probe.child",
        "example",
        "\n  refines: spec:probe.parent\n  verifies: spec:probe.parent",
        "\n```gwt\nGiven a parent\nWhen it runs\nThen it works\n```\n",
      ),
    });
    const page = required(
      renderStudio(await createStudioData(reader)).find((p) => p.path === "tests.html"),
    ).content;
    expect.soft(page).toContain("verifier binding none: 1 verifiers, 0 enabled");
    expect.soft(page).toContain('data-binding="none" data-rules="none" data-values="none"');
    expect.soft(page).toContain("0 Specs with a verifier binding and 1 without.");
    expect.soft(page).toContain("<code>sdp studio</code> publishes</a>");
    expect.soft(page).not.toContain('<option value="present">');
    expect.soft(page).not.toContain('<option value="exercised">');
    expect.soft(page).not.toContain('<option value="covered">');
  });
  it("renders member subjects, code spans, used-by counts, differences and empty components", async () => {
    const reader = fixture({
      "design.sdp.md": carrier(
        "spec:probe.design",
        "model",
        "{}",
        "\n## Model\n- **Component** — The component.\n\n## Design\n- id: component:probe.core\n- context: changed\n- layer: domain\n",
      ),
      "components.ts":
        "/**\n * @sdpAnchor component:probe.core\n * @sdpLabel `sdp studio` core\n * @sdpSatisfies spec:probe.design\n * @sdpContext orders\n * @sdpLayer domain\n */\nexport const core=1;\n/**\n * @sdpAnchor component:probe.empty\n * @sdpContext orders\n * @sdpLayer domain\n * @sdpUses component:probe.core\n */\nexport const empty=1;\n/**\n * @sdpAnchor impl:probe.member\n * @sdpLabel `sdp census`\n * @sdpComponent component:probe.core\n */\nexport const member=1;\n",
    });
    const page = required(
      renderStudio(await createStudioData(reader)).find((p) => p.path === "architecture.html"),
    ).content;
    expect.soft(page).toContain('<sdp-diagram subject="component:probe.core">');
    expect.soft(page).toContain('id="diagram.component:probe.core.text"');
    const ids = [...page.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
    expect(ids).toEqual([...new Set(ids)]);
    expect.soft(page).not.toContain('<sdp-diagram subject="component:probe.empty">');
    expect.soft(page).toContain("<code>sdp census</code>");
    expect.soft(page).toContain("<code>sdp studio</code> core");
    expect
      .soft(page)
      .toContain(
        '<h3>Used by</h3><ul class="plain-list"><li><a href="#component:probe.empty"><code>component:probe.empty</code></a> (1 unit edges)',
      );
    expect.soft(page).toContain("<h3>Design differences</h3>");
    expect
      .soft(page)
      .toContain(
        "<code>context</code>: planned <code>&quot;changed&quot;</code>; realized <code>&quot;orders&quot;</code>",
      );
    expect.soft(page).toContain("They state 1 context and 1 layer.");
    expect.soft(page).not.toContain("from recipes 17 and 43");
  });
  it("describes evidence sources as not tracked", async () => {
    const page = required(
      renderStudio(await createStudioData(createReader(empty))).find(
        (p) => p.path === "evidence.html",
      ),
    ).content;
    expect.soft(page).not.toContain("Sources of runtime evidence recorded by the graph.");
    expect
      .soft(page)
      .toContain("Sources of runtime evidence and what would bring each into the Studio.");
  });
});

interface DiagramWorld {
  point: Partial<DiagramsConditions>;
  result?: ReturnType<typeof architectureDiagrams>;
  first?: string;
  second?: string;
}
const diagramsOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-diagrams"),
  models: ref("spec:consumers.spec-studio.diagrams"),
});
void diagramsOracle;
function diagramAnswer(p: Partial<DiagramsConditions>) {
  if (p.components === undefined || p.contexts === undefined || p.edges === undefined)
    return undefined;
  const fold = p.components <= 40 ? "nothing" : p.contexts > 1 ? "context" : "layer";
  const drawn =
    fold === "nothing" ? p.components : fold === "context" ? p.contexts : (p.layers ?? 0);
  return { identical: true, fold, drawn, named: drawn + (fold === "nothing" ? p.edges : 0) };
}
import { withinBoundContract } from "../generated/contracts/consumers.spec-studio.diagrams.within-bound.contract.js";
import { foldsByContextContract } from "../generated/contracts/consumers.spec-studio.diagrams.folds-by-context.contract.js";
import { foldsByLayerContract } from "../generated/contracts/consumers.spec-studio.diagrams.folds-by-layer.contract.js";
import { plannedApartContract } from "../generated/contracts/consumers.spec-studio.lenses.architecture.planned-apart.contract.js";
import { coverageRowContract } from "../generated/contracts/consumers.spec-studio.lenses.tests.coverage-row.contract.js";
import { uncoveredLiteralContract } from "../generated/contracts/consumers.agent-surface.example-space-coverage.uncovered-literal.contract.js";
import { numberNotEnumerableContract } from "../generated/contracts/consumers.agent-surface.example-space-coverage.number-not-enumerable.contract.js";
function thenValues(contract: {
  readonly steps: readonly { readonly kind: string; readonly params: unknown }[];
}): Record<string, unknown> {
  return Object.assign(
    {},
    ...contract.steps.filter((s) => s.kind === "then").map((s) => s.params),
  ) as Record<string, unknown>;
}
function diagramAdapters(
  contract:
    | typeof withinBoundContract
    | typeof foldsByContextContract
    | typeof foldsByLayerContract,
): RunnableExampleAdapters<DiagramWorld, DiagramsConditions, DiagramsOutcome> {
  return {
    createWorld: (point) => ({ point }),
    invoke: (world) => {
      const p = world.point;
      const input = architectureInput(
        required(p.components),
        required(p.contexts),
        required(p.layers),
        required(p.edges),
      );
      world.result = architectureDiagrams(input);
      world.first = renderDiagram(required(world.result.drawings[0]));
      world.second = renderDiagram(required(architectureDiagrams(input).drawings[0]));
    },
    expected: (p): DiagramsOutcome => {
      const a = diagramAnswer(p);
      return a
        ? { kind: "its text equivalent names {named} boxes and edges", named: a.named }
        : unspecified;
    },
    observe: (world): DiagramsOutcome => ({
      kind: "its text equivalent names {named} boxes and edges",
      named:
        required(required(world.result).drawings[0]).boxes.length +
        required(required(world.result).drawings[0]).edges.length,
    }),
    assertions: (world) => {
      const a = diagramAnswer(world.point);
      expect(thenValues(contract)).toEqual(a);
      expect({
        identical: world.first === world.second,
        fold: required(world.result).fold,
        drawn: required(required(world.result).drawings[0]).boxes.length,
        named: (required(world.first).match(/<li>/g) ?? []).length,
      }).toEqual(a);
      const result = required(world.result);
      for (const drawing of result.drawings.filter((d) => d.grid)) gridMembership(drawing);
      const p = world.point;
      const input = architectureInput(
        required(p.components),
        required(p.contexts),
        required(p.layers),
        required(p.edges),
      );
      if (result.fold === "nothing") {
        expect(result.drawings).toHaveLength(1);
        expect(required(result.drawings[0]).boxes.map((b) => b.id)).toEqual(
          input.boxes.map((b) => b.id),
        );
      } else if (result.fold === "context") {
        expect(result.drawings.map((d) => d.subject)).toEqual([
          "architecture",
          ...Array.from({ length: required(p.contexts) }, (_, i) => `context.c${String(i)}`),
        ]);
        for (const drawing of result.drawings.slice(1))
          expect(drawing.boxes.filter((b) => !b.folded).map((b) => b.id)).toEqual(
            input.boxes.filter((b) => `context.${b.context}` === drawing.subject).map((b) => b.id),
          );
        const cross = input.edges.filter(
          (e) =>
            input.boxes.find((b) => b.id === e.from)?.context !==
            input.boxes.find((b) => b.id === e.to)?.context,
        );
        expect(required(result.drawings[0]).edges.reduce((n, e) => n + (e.count ?? 1), 0)).toBe(
          cross.length,
        );
      }
    },
  };
}
const withinBoundAnchor = specTest({
  id: testAnchorId("test:protocol.studio-diagram-within-bound"),
  verifies: ref("spec:consumers.spec-studio.diagrams.within-bound"),
});
void withinBoundAnchor;
registerWithinBound(diagramAdapters(withinBoundContract));
const foldsByContextAnchor = specTest({
  id: testAnchorId("test:protocol.studio-diagram-folds-context"),
  verifies: ref("spec:consumers.spec-studio.diagrams.folds-by-context"),
});
void foldsByContextAnchor;
registerFoldsByContext(diagramAdapters(foldsByContextContract));
const foldsByLayerAnchor = specTest({
  id: testAnchorId("test:protocol.studio-diagram-folds-layer"),
  verifies: ref("spec:consumers.spec-studio.diagrams.folds-by-layer"),
});
void foldsByLayerAnchor;
registerFoldsByLayer(diagramAdapters(foldsByLayerContract));
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach } from "vitest";
import { extract } from "../src/extract/index.js";
import { evaluateStudioRecipe } from "../src/projections/studio/recipes.js";
import type { SpaceCoverage } from "../src/projections/studio/pages/tests-page.js";
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "sdp-s1-example-"));
  roots.push(root);
  for (const [name, value] of Object.entries(files)) writeFileSync(join(root, name), value);
  return createReader(extract({ root }).graph);
}
function carrier(id: string, kind: string, relations: string, body: string): string {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: defined\nrelations: ${relations}\n---\n# Probe\n\n## Intent\n- outcome: Probe the Studio.\n${body}`;
}
const architectureOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-architecture"),
  models: ref("spec:consumers.spec-studio.lenses.architecture"),
});
void architectureOracle;
interface ArchitectureWorld {
  point: Partial<ArchitectureConditions>;
  page?: string;
}
const plannedApartAnchor = specTest({
  id: testAnchorId("test:protocol.studio-architecture-planned-apart"),
  verifies: ref("spec:consumers.spec-studio.lenses.architecture.planned-apart"),
});
void plannedApartAnchor;
registerPlannedApart<ArchitectureWorld>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    const reader = fixture({
      "component.ts": `/**\n * @sdpAnchor component:probe.orders\n * @sdpContext ${String(w.point.context)}\n * @sdpLayer ${String(w.point.layer)}\n */\nexport const orders=1;\n`,
      "planned.sdp.md": carrier(
        "spec:probe.payments",
        "model",
        "{}",
        `\n## Model\n- **Payment** — The planned component.\n\n## Design\n- id: component:probe.payments\n- context: ${String(w.point.context)}\n- layer: ${String(w.point.layer)}\n`,
      ),
    });
    w.page = required(
      renderStudio(await createStudioData(reader)).find((p) => p.path === "architecture.html"),
    ).content;
  },
  expected: (p): ArchitectureOutcome =>
    p.planned === undefined
      ? unspecified
      : { kind: "the diagram marks {plannedBoxes} boxes planned", plannedBoxes: p.planned },
  observe: (w): ArchitectureOutcome => ({
    kind: "the diagram marks {plannedBoxes} boxes planned",
    plannedBoxes: (required(w.page).match(/data-planned="true"/g) ?? []).length,
  }),
  assertions: (w) => {
    const expected = { boxes: 2, plannedBoxes: 1, listed: 1 };
    expect(thenValues(plannedApartContract)).toEqual(expected);
    const lane = required(
      required(required(w.page).split('class="lane" data-label="orders"')[1]).split("</svg>")[0],
    );
    const band = required(lane.split('class="band" data-label="domain"')[1]);
    expect((band.match(/class="node"/g) ?? []).length).toBe(expected.boxes);
    expect(
      required(
        required(required(w.page).split("<h2>Designed, not built</h2>")[1]).split("</tbody>")[0],
      ).match(/<tr>/g),
    ).toHaveLength(expected.listed + 1);
  },
});
const testsOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-tests"),
  models: ref("spec:consumers.spec-studio.lenses.tests"),
});
void testsOracle;
interface TestsWorld {
  point: Partial<TestsConditions>;
  page?: string;
}
const coverageRowAnchor = specTest({
  id: testAnchorId("test:protocol.studio-tests-coverage-row"),
  verifies: ref("spec:consumers.spec-studio.lenses.tests.coverage-row"),
});
void coverageRowAnchor;
registerCoverageRow<TestsWorld>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    const rules = [
      ...Array.from(
        { length: w.point.keyed ?? 0 },
        (_, i) => `- rule: [#key${String(i)}] Rule ${String(i)}.`,
      ),
      ...Array.from(
        { length: w.point.unkeyed ?? 0 },
        (_, i) => `- rule: Unkeyed rule ${String(i)}.`,
      ),
    ];
    const keys = Array.from({ length: w.point.exercised ?? 0 }, (_, i) => `key${String(i)}`);
    const reader = fixture({
      "parent.sdp.md": carrier(
        "spec:probe.parent",
        "behavior",
        "{}",
        `\n## Behavior\n${rules.join("\n")}\n`,
      ),
      "child.sdp.md": carrier(
        "spec:probe.child",
        "example",
        `\n  refines: spec:probe.parent\n  verifies:\n    target: spec:probe.parent\n    exercises: [${keys.join(", ")}]`,
        `\n\`\`\`gwt\nGiven a parent\nWhen it runs\nThen it works\n\`\`\`\n`,
      ),
      "verify.test.ts":
        "/**\n * @sdpAnchor test:probe.child\n * @sdpVerifies spec:probe.child\n */\nexport const test=1;\n",
    });
    w.page = required(
      renderStudio(await createStudioData(reader)).find((p) => p.path === "tests.html"),
    ).content;
  },
  expected: (p): TestsOutcome =>
    p.exercised === undefined || p.keyed === undefined
      ? unspecified
      : {
          kind: "the Spec's row reads {coverage}",
          coverage: `${String(p.exercised)} of ${String(p.keyed)} keyed rules exercised`,
        },
  observe: (w) => ({
    kind: "the Spec's row reads {coverage}",
    coverage: /\d+ of \d+ keyed rules exercised/u.exec(required(w.page))?.[0] ?? "",
  }),
  assertions: (w) => {
    expect(thenValues(coverageRowContract)).toEqual({
      coverage: "1 of 2 keyed rules exercised",
      binding: "present",
    });
    expect(w.page).toContain("verifier binding present: 1 verifiers, 1 enabled");
    expect(w.page).toContain("1 unkeyed rules");
  },
});
interface CoverageWorld {
  point: Partial<ExampleSpaceCoverageConditions>;
  answer?: SpaceCoverage;
  reader?: ReturnType<typeof createReader>;
}
const coverageOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-coverage"),
  models: ref("spec:consumers.agent-surface.example-space-coverage"),
});
void coverageOracle;
function coverageAnswer(p: Partial<ExampleSpaceCoverageConditions>) {
  if (!p.declared || !p.bound) return undefined;
  const values = p.bound.split("; "),
    enumerable = p.declared.includes("|");
  return {
    enumerable,
    uncovered: enumerable
      ? p.declared
          .split("|")
          .filter((v) => !values.includes(v))
          .join(", ")
      : "",
    unbound: values
      .flatMap((v, i) => (v === "none" ? [`spec:probe.parent.c${String(i + 1)}`] : []))
      .join(", "),
  };
}
const recipeAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.example-space-coverage-recipe"),
  label: "asserts realization of shipped recipe 44",
  satisfies: ref("spec:consumers.agent-surface.example-space-coverage"),
});
void recipeAnchor;
function coverageAdapters(
  contract: typeof uncoveredLiteralContract | typeof numberNotEnumerableContract,
): RunnableExampleAdapters<
  CoverageWorld,
  ExampleSpaceCoverageConditions,
  ExampleSpaceCoverageOutcome
> {
  return {
    createWorld: (point) => ({ point }),
    invoke: async (w) => {
      const { slot, declared, bound } = w.point;
      const type = required(declared).includes("|")
        ? required(declared)
            .split("|")
            .map((v) => JSON.stringify(v))
            .join("|")
        : declared;
      const files: Record<string, string> = {
        "parent.sdp.md": carrier(
          "spec:probe.parent",
          "behavior",
          "{}",
          `\n## Behavior\n- rule: Bind each example value.\n\n## Example space\n\`\`\`gwt-vocabulary\nGiven the value {${String(slot)}:${String(type)}}\nGiven no value\nWhen it is read\nThen it is seen\n\`\`\`\n`,
        ),
      };
      required(bound)
        .split("; ")
        .forEach((v, i) => {
          files[`c${String(i + 1)}.sdp.md`] = carrier(
            `spec:probe.parent.c${String(i + 1)}`,
            "example",
            "\n  refines: spec:probe.parent\n  verifies: spec:probe.parent",
            `\n\`\`\`gwt\nGiven ${v === "none" ? "no value" : `the value {${String(slot)}: ${declared === "number" ? v : JSON.stringify(v)}}`}\nWhen it is read\nThen it is seen\n\`\`\`\n`,
          );
        });
      w.reader = fixture(files);
      const before = w.reader.findings();
      const readiness = required(w.reader.specContext("spec:probe.parent")).statedReadiness;
      w.answer = (await evaluateStudioRecipe(w.reader, 44, {
        spec: "spec:probe.parent",
      })) as SpaceCoverage;
      expect(w.reader.findings()).toEqual(before);
      expect(required(w.reader.specContext("spec:probe.parent")).statedReadiness).toBe(readiness);
    },
    expected: (p): ExampleSpaceCoverageOutcome => {
      const a = coverageAnswer(p);
      return a
        ? { kind: "the values no example binds are {uncovered}", uncovered: a.uncovered }
        : unspecified;
    },
    observe: (w) => ({
      kind: "the values no example binds are {uncovered}",
      uncovered: required(required(required(w.answer).spaces[0]).slots[0])
        .values.filter(
          (v) =>
            required(required(required(w.answer).spaces[0]).slots[0]).enumerable &&
            v.examples.length === 0,
        )
        .map((v) => v.value)
        .join(", "),
    }),
    assertions: (w) => {
      const a = coverageAnswer(w.point),
        slot = required(required(required(w.answer).spaces[0]).slots[0]);
      expect(thenValues(contract)).toEqual(a);
      expect({
        enumerable: slot.enumerable,
        uncovered: slot.values
          .filter((v) => slot.enumerable && v.examples.length === 0)
          .map((v) => v.value)
          .join(", "),
        unbound: slot.unbound.join(", "),
      }).toEqual(a);
    },
  };
}
const uncoveredLiteralAnchor = specTest({
  id: testAnchorId("test:protocol.studio-coverage-literal"),
  verifies: ref("spec:consumers.agent-surface.example-space-coverage.uncovered-literal"),
});
void uncoveredLiteralAnchor;
registerUncoveredLiteral(coverageAdapters(uncoveredLiteralContract));
const numberNotEnumerableAnchor = specTest({
  id: testAnchorId("test:protocol.studio-coverage-number"),
  verifies: ref("spec:consumers.agent-surface.example-space-coverage.number-not-enumerable"),
});
void numberNotEnumerableAnchor;
registerNumberNotEnumerable(coverageAdapters(numberNotEnumerableContract));

function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Expected a value");
  return value;
}

import * as bodyEvaluator from "../src/reader/evaluate-body.js";
import * as validators from "../src/validate/validators.js";

it("reuses the build's reader and validation findings during Studio recipe evaluation", async () => {
  const reader = fixture({
    "probe.sdp.md": carrier(
      "spec:probe.parent",
      "behavior",
      "{}",
      "\n## Behavior\n- rule: Probe.\n",
    ),
  });
  const spy = vi.spyOn(validators, "validateGraph");
  try {
    await createStudioData(reader);
    expect(spy).not.toHaveBeenCalled();
  } finally {
    spy.mockRestore();
  }
});
import { readFileSync } from "node:fs";
import { vi } from "vitest";
it("documents the component and member fields recipe 17 adds", () => {
  const catalog = readFileSync(
    new URL("../docs/agent-surface/recipes.md", import.meta.url),
    "utf8",
  );
  const prose =
    required(required(catalog.split("## 17. Architecture map")[1]).split("## 18.")[0])
      .split("```\n")
      .at(-1) ?? "";
  for (const name of [
    "label",
    "file",
    "line",
    "role",
    "layer",
    "context",
    "referencedSpecs",
    "usesCounts",
    "usedByCounts",
  ])
    expect(prose).toContain(`\`${name}\``);
});
it.each([false, true])(
  "evaluates each shipped recipe once for its assigned parameters and shares Pack totals, with base %s",
  async (withBase) => {
    const reader = fixture({
      "parent.sdp.md": carrier(
        "spec:probe.parent",
        "behavior",
        "{}",
        "\n## Behavior\n- rule: Probe.\n",
      ),
      "pack.pack.sdp.md": "---\nid: pack:probe\nspecs: [spec:probe.parent]\n---\n# Probe Pack\n",
    });
    const calls: { number: number; params: unknown }[] = [];
    const evaluate = bodyEvaluator.evaluateBodyWithReader;
    const spy = vi
      .spyOn(bodyEvaluator, "evaluateBodyWithReader")
      .mockImplementation(async (source, input) => {
        const value = await evaluate(source, input);
        if (typeof value !== "function") throw new Error("Expected the recipe caller.");
        const caller = value as (number: number, params: unknown) => Promise<unknown>;
        return async (number: number, params: unknown) => {
          calls.push({ number, params });
          return caller(number, params);
        };
      });
    try {
      const report = validators.validateGraph(reader.graph);
      const data = await createStudioData(
        reader,
        report,
        withBase ? { base: { graph: reader.graph, label: null }, runs: [] } : undefined,
      );
      expect(spy.mock.calls[0]?.[1].graph).toBe(reader.graph);
      expect(spy.mock.calls[0]?.[1].report).toBe(report);
      const expected = [
        ...[17, 20, 24, 31, 33, 43, 44, 46, 51].map((number) => ({ number, params: {} })),
        ...(withBase ? [{ number: 35, params: { base: reader.graph, detail: true } }] : []),
        { number: 29, params: { pack: "pack:probe" } },
        ...(withBase ? [{ number: 35, params: { base: reader.graph, pack: "pack:probe" } }] : []),
        { number: 21, params: { spec: "spec:probe.parent" } },
        { number: 30, params: { specs: ["spec:probe.parent"] } },
        { number: 34, params: { spec: "spec:probe.parent" } },
      ];
      expect(calls).toEqual(expected);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(data.packs[0]?.totals).toBe(
        (data.recipes.packs.get("pack:probe") as { totals: unknown }).totals,
      );
      renderStudio(data);
      renderStudio(data);
      expect(calls).toEqual(expected);
    } finally {
      spy.mockRestore();
    }
  },
);

import { labelLines } from "../src/projections/studio/diagrams/index.js";
it("keeps label lines bounded and orders member depths numerically with outside units last", () => {
  const lines = labelLines(
    "component:very-long-context.with-many.parts-and-an-even-longer-unit-name",
  );
  expect(lines.every((line) => line.length <= 30)).toBe(true);
  expect(lines.join("")).toBe(
    "component:very-long-context.with-many.parts-and-an-even-longer-unit-name",
  );
  const boxes = architectureInput(12, 1, 1).boxes;
  const edges = boxes
    .slice(1)
    .map((box, i) => ({ from: required(boxes[i]).id, to: box.id, kind: "uses" }));
  const diagram = memberDiagram({
    subject: "chain",
    boxes: [
      ...boxes,
      { id: "component:outside", words: "Outside", target: "#outside", band: "Outside component" },
    ],
    edges,
  });
  expect(diagram.boxes.map((b) => b.band)).toEqual([
    ...Array.from({ length: 12 }, (_, i) => `Member depth ${String(i)}`),
    "Outside component",
  ]);
  const realization = realizationDiagram({
    subject: "spec:probe",
    boxes: [
      { id: "impl:a", words: "Unit", target: "#unit", band: "Satisfying units" },
      { id: "component:a", words: "Owner", target: "#owner", band: "Components" },
      { id: "component:b", words: "Used", target: "#used", band: "Uses" },
    ].reverse(),
    edges: [],
  });
  expect(realization.boxes.map((b) => b.band)).toEqual(["Satisfying units", "Components", "Uses"]);
});
it("labels planned uses, reports unreadable designs and keeps unknown structure visible", async () => {
  const reader = fixture({
    "components.ts":
      "/**\n * @sdpAnchor component:probe.orders\n * @sdpContext orders\n * @sdpLayer domain\n */\nexport const orders=1;\n/**\n * @sdpAnchor impl:probe.loose\n * @sdpUses component:probe.orders\n */\nexport const loose=2;\n",
    "planned.sdp.md": carrier(
      "spec:probe.payments",
      "model",
      "{}",
      "\n## Model\n- **Payment** — A component design.\n\n## Design\n- id: component:probe.payments\n- layer: domain\n- context: orders\n- role: Unreadable\n- uses: component:probe.orders, component:probe.missing\n",
    ),
  });
  const page = required(
    renderStudio(await createStudioData(reader)).find((p) => p.path === "architecture.html"),
  ).content;
  expect(page).toContain('data-kind="plans to use"');
  expect(page).toContain('stroke-dasharray="6 4"');
  expect(page).not.toContain('data-to="component:probe.missing"');
  expect(page).toContain("component:probe.missing");
  expect(page).toContain("Unreadable <code>role</code>");
  expect(page).toContain("Unresolved structure");
  expect(page).toContain("impl:probe.loose");
});
it("gives unstated context and layer folds addressable text descriptions", () => {
  const input = architectureInput(50, 1, 1);
  const result = architectureDiagrams({
    ...input,
    boxes: input.boxes.map((box) => ({ ...box, context: null, layer: null })),
  });
  const html = result.drawings.map((drawing) => renderDiagram(drawing)).join("");
  for (const match of html.matchAll(/aria-describedby="([^"]+)"/g))
    expect(match[1]).not.toMatch(/\s/u);
});

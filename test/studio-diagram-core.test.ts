import { requirementDiagram } from "../src/projections/studio/diagrams/requirement.js";
import { describe, expect, it, vi } from "vitest";
import { specTest, testAnchorId, ref } from "../src/anchors.js";
import { labelLines, shortIds, layoutDiagram } from "../src/projections/studio/diagrams/layout.js";
import { routeDiagram } from "../src/projections/studio/diagrams/routing.js";
import { renderDiagram } from "../src/projections/studio/diagrams/svg.js";
import { mermaidSource } from "../src/projections/studio/diagrams/mermaid.js";
import type { Diagram } from "../src/projections/studio/diagrams/model.js";

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Missing test value");
  return value;
}

const drawing: Diagram = {
  subject: "spec:probe",
  caption: "Probe",
  boxes: Array.from({ length: 6 }, (_, i) => ({
    id: `spec:probe.item${String(i)}`,
    words: `Title ${String(i)}`,
    target: `#item${String(i)}`,
    band: i < 3 ? "First" : "Second",
  })),
  edges: [
    {
      from: "spec:probe.item0",
      to: "spec:probe.item4",
      kind: "dependsOn",
      claim: "declared",
      reason: "Needs its contract",
    },
    { from: "spec:probe.item0", to: "spec:probe.item5", kind: "refines", claim: "declared" },
    { from: "spec:probe.item4", to: "spec:probe.item0", kind: "verifies", claim: "anchored" },
    { from: "spec:probe.item1", to: "spec:probe.item2", kind: "uses", claim: "anchored" },
  ],
};
const core = specTest({
  id: testAnchorId("test:protocol.studio-diagram-core"),
  verifies: [
    ref("spec:consumers.spec-studio.diagram-kinds.legibility"),
    ref("spec:consumers.spec-studio.diagram-kinds.edge-routing"),
    ref("spec:consumers.spec-studio.diagram-kinds.mermaid-source"),
  ],
});
void core;
describe("shared diagram core", () => {
  it("wraps by code point and shortens shared segments without collisions", () => {
    expect(labelLines("😀".repeat(31))).toEqual(["😀".repeat(30), "😀"]);
    expect(shortIds(["spec:probe.a.one", "spec:probe.a.two"])).toEqual(
      new Map([
        ["spec:probe.a.one", "…one"],
        ["spec:probe.a.two", "…two"],
      ]),
    );
    const ids = ["spec:probe.same", "impl:probe.same", "spec:other.same"];
    expect(new Set(shortIds(ids).values()).size).toBe(3);
    const html = renderDiagram(drawing);
    expect(html).toContain('<tspan class="box-title"');
    expect(html).toContain('textLength="56" lengthAdjust="spacingAndGlyphs">Title 0');
    expect(html.indexOf(">Title 0</tspan>")).toBeLessThan(html.indexOf(">…item0</tspan>"));
    expect(html).toContain("<title>spec:probe.item0</title>");
    expect(html).toContain('tabindex="0" role="region"');
  });
  it("wraps boxes within the width budget and writes an instruction only for final wide drawings", () => {
    const l = layoutDiagram({ ...drawing, edges: [] });
    expect(l.width).toBeLessThanOrEqual(880);
    expect(renderDiagram({ ...drawing, edges: [] })).not.toContain('class="scroll-help"');
    const wide = {
      ...drawing,
      grid: true,
      boxes: drawing.boxes.map((b, i) => ({
        ...b,
        context: `context${String(i)}`,
        layer: "domain",
      })),
    };
    expect(renderDiagram(wide)).toContain("Scroll horizontally to read the whole drawing.");
  });
  it("routes forward, backward and same-band edges with distinct ports and no shared segments", () => {
    const layout = layoutDiagram(drawing);
    const routed = routeDiagram(layout, drawing.edges);
    expect(routed).not.toBeNull();
    if (!routed) throw new Error("No routes");
    expect(routed.routes).toHaveLength(4);
    assertGeometry(layout, routed);
    const ports = routed.routes
      .flatMap((r) => [r.points[0], r.points.at(-1)])
      .map((p) => JSON.stringify(p));
    expect(new Set(ports).size).toBe(ports.length);
    for (const route of routed.routes) {
      expect(route.points.every((p) => Number.isInteger(p.x) && Number.isInteger(p.y))).toBe(true);
      for (let i = 1; i < route.points.length; i++) {
        const a = required(route.points[i - 1]),
          b = required(route.points[i]);
        expect(a.x === b.x || a.y === b.y).toBe(true);
        for (const other of routed.routes)
          if (other !== route)
            for (let j = 1; j < other.points.length; j++) {
              const c = required(other.points[j - 1]),
                e = required(other.points[j]);
              if (a.x === b.x && c.x === e.x && a.x === c.x)
                expect(
                  Math.min(Math.max(a.y, b.y), Math.max(c.y, e.y)) -
                    Math.max(Math.min(a.y, b.y), Math.min(c.y, e.y)),
                ).toBeLessThanOrEqual(0);
              if (a.y === b.y && c.y === e.y && a.y === c.y)
                expect(
                  Math.min(Math.max(a.x, b.x), Math.max(c.x, e.x)) -
                    Math.max(Math.min(a.x, b.x), Math.min(c.x, e.x)),
                ).toBeLessThanOrEqual(0);
            }
      }
    }
    expect(routeDiagram(layout, drawing.edges)).toEqual(routed);
    expect(renderDiagram(drawing)).toBe(renderDiagram(drawing));
  });
  it("fails closed when routing cannot fit, retaining complete text and no partial source", () => {
    expect(routeDiagram(layoutDiagram(drawing), drawing.edges, 0)).toBeNull();
    const starBoxes = Array.from({ length: 40 }, (_, i) => ({
      id: `component:star.${String(i)}`,
      words: `Unit ${String(i)}`,
      target: "#main",
      context: "star",
      layer: "domain",
    }));
    const star = {
      subject: "star",
      caption: "Star",
      grid: true,
      boxes: starBoxes,
      edges: starBoxes.slice(1).map((b) => ({
        from: required(starBoxes[0]).id,
        to: b.id,
        kind: "uses",
        claim: "anchored",
      })),
    };
    const starLayout = layoutDiagram(star),
      starRoutes = routeDiagram(starLayout, star.edges);
    expect(starRoutes?.routes).toHaveLength(39);
    expect(renderDiagram(star)).toContain("<svg");
    const impossible = {
      ...drawing,
      edges: [{ from: "missing", to: required(drawing.boxes[0]).id, kind: "uses" }],
    };
    const html = renderDiagram(impossible);
    expect(html).not.toContain("<svg");
    expect(html).toContain(
      "Shown as text: a distinct route or label could not be placed within the routing budget.",
    );
    expect(html).toContain('<details open id="diagram.spec:probe.text"');
    expect(html).toContain("missing uses spec:probe.item0");
    expect(html).not.toContain("Mermaid source");
  });
  it("serializes full identities, exact claims, reasons, counts and folds as inert Mermaid data", () => {
    const d = {
      ...drawing,
      boxes: [
        {
          ...required(drawing.boxes[0]),
          words: '"#<script>\n%%{init: bad}',
          folded: true,
          foldedIds: ["spec:hidden"],
        },
        ...drawing.boxes.slice(1),
      ],
      edges: [{ ...required(drawing.edges[0]), count: 2 }],
    };
    const source = mermaidSource(d);
    expect(source).toContain("flowchart TB");
    expect(source).toContain("#quot;#35;#lt;script#gt;");
    expect(source).toContain("spec:hidden");
    expect(source).toContain("dependsOn · declared");
    expect(source).toContain("count: 2");
    expect(source).toContain("Needs its contract");
    expect(source).not.toMatch(/^\s*click/mu);
    expect(source).not.toContain("%%{");
    const html = renderDiagram(drawing, "spec:probe.realization");
    expect(html).toContain('id="diagram.spec:probe.realization.source"');
    expect(html).toContain("<textarea readonly");
    expect(html).toContain('<sdp-copy for="diagram.spec:probe.realization.source-text">');
    expect(html).not.toContain('<details open id="diagram.spec:probe.realization.source"');
  });
});

import { studioDom } from "./helpers/studio-dom.js";
const copyAnchor = specTest({
  id: testAnchorId("test:protocol.studio-copy-source"),
  verifies: ref("spec:consumers.spec-studio.page-elements"),
});
void copyAnchor;
it("copies the current value of the labelled textarea and selects that same area on clipboard failure", async () => {
  const dom = studioDom("dist/studio/studio.js", "file:///studio/index.html", {
    getItem: () => null,
    setItem: () => undefined,
  });
  const area = dom.mount("textarea", { id: "source" });
  area.value = "flowchart TB";
  const label = dom.mount("label", { for: "source" });
  label.textContent = "Mermaid source for Probe";
  const copy = dom.mount("sdp-copy", { for: "source" });
  expect(copy.querySelector("button")?.getAttribute("aria-label")).toContain(
    "Mermaid source for Probe",
  );
  copy.querySelector("button")?.dispatch("click");
  await Promise.resolve();
  await Promise.resolve();
  expect(dom.copied).toEqual(["flowchart TB"]);
  await vi.waitFor(() => {
    expect(copy.textContent).toContain("Copied");
  });
  area.value = "changed source";
  dom.doc.defaultView.navigator.clipboard.writeText = () =>
    Promise.reject(new Error("No clipboard"));
  copy.querySelector("button")?.dispatch("click");
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await vi.waitFor(() => {
    expect(dom.doc.selectedText).toBe("changed source");
  });
  expect(dom.doc.activeElement).toBe(area);
  expect(copy.querySelector("textarea")).toBeNull();
});

it("keeps the full box and edge bound routable with obstacles, separate lanes and edge labels", () => {
  const boxes = Array.from({ length: 40 }, (_, i) => ({
    id: `component:probe.${String(i)}`,
    words: `A title wrapping over multiple lines for component ${String(i)}`,
    target: "#main",
    context: `context${String(i % 3)}`,
    layer: ["edge", "application", "domain", "adapter", "infrastructure"][i % 5],
  }));
  const edges = Array.from({ length: 100 }, (_, i) => ({
    from: required(boxes[i % 40]).id,
    to: required(boxes[((i % 40) + 1 + Math.floor(i / 40)) % 40]).id,
    kind: i % 2 ? "uses" : "dependsOn",
    claim: i % 2 ? "anchored" : "declared",
  }));
  for (const grid of [false, true]) {
    const d = { subject: "architecture", caption: "At the bound", boxes, edges, grid };
    const layout = layoutDiagram(d),
      routed = routeDiagram(layout, edges);
    expect(routed).not.toBeNull();
    if (!routed) throw new Error("Missing bounded routes");
    assertGeometry(layout, routed);
    expect(routeDiagram(layout, edges)).toEqual(routed);
  }
}, 30000);
import * as routingChecks from "../src/projections/studio/diagrams/routing.js";

it("offers deterministic Mermaid source for each existing drawing and pins the safe text syntax", () => {
  const root = { ...drawing, edges: drawing.edges.slice(0, 1) };
  const input = { subject: root.subject, boxes: root.boxes, edges: root.edges };
  const drawings = [
    required(
      architectureDiagrams({
        ...input,
        boxes: root.boxes.map((b) => ({ ...b, context: "probe", layer: "domain" })),
      }).drawings[0],
    ),
    memberDiagram(input),
    traceDiagram(input),
    requirementDiagram(input),
  ];
  for (const d of drawings) {
    const html = renderDiagram(d);
    expect(html).toContain("<summary>Mermaid source</summary>");
    expect(html).toContain("syntax:");
    expect(html).toContain("spec:probe.item0");
    expect(mermaidSource(d)).toBe(mermaidSource(d));
  }
  expect(
    mermaidSource({
      subject: "probe",
      caption: "One",
      boxes: [{ id: "spec:probe", words: 'Title "#<>', target: "#main" }],
      edges: [],
    }),
  ).toBe('flowchart TB\n  n0["Title #quot;#35;#lt;#gt; · spec:probe"]');
});
import {
  architectureDiagrams,
  memberDiagram,
  traceDiagram,
} from "../src/projections/studio/diagrams/index.js";

it("folds reason-bearing trace groups without attributing a member reason to the group", () => {
  const root = { id: "spec:root", words: "Root", target: "#root" };
  const members = Array.from({ length: 105 }, (_, i) => ({
    id: `spec:member.${String(i)}`,
    words: "Member",
    target: "#member",
  }));
  for (const count of [45, 105]) {
    const edges = members.slice(0, count).map((b, i) => ({
      from: b.id,
      to: root.id,
      kind: "dependsOn",
      claim: "declared",
      reason: `Reason ${String(i)}`,
    }));
    const input = { subject: root.id, boxes: [root, ...members.slice(0, count)], edges };
    const d = traceDiagram(input);
    expect(d.boxes).toHaveLength(2);
    expect(d.edges).toEqual([
      {
        from: "spec:root.fold.Incoming.dependsOn",
        to: root.id,
        kind: "dependsOn",
        claim: "declared",
        count,
      },
    ]);
    expect(
      traceDiagram({ ...input, edges: edges.map((e) => ({ ...e, reason: "Shared reason" })) })
        .edges[0]?.reason,
    ).toBe("Shared reason");
  }
});
it("uses the full band budget for a single context and routes adjacent bands inside it", () => {
  const d = {
    ...drawing,
    grid: true,
    boxes: drawing.boxes.map((b) => ({
      ...b,
      context: "one",
      layer: b.band === "First" ? "edge" : "domain",
    })),
  };
  const l = layoutDiagram(d);
  expect(l.boxes[0]?.y).toBe(l.boxes[1]?.y);
  const adjacent = {
    ...drawing,
    edges: [{ from: "spec:probe.item0", to: "spec:probe.item4", kind: "uses" }],
  };
  const layout = layoutDiagram(adjacent),
    routed = routeDiagram(layout, adjacent.edges);
  expect(routed).not.toBeNull();
  expect(routed?.routes.flatMap((r) => r.points).every((p) => p.x <= layout.width)).toBe(true);
});
it("prints exact short relation words and reserves keys for wording that cannot fit", () => {
  const short = routeDiagram(layoutDiagram(drawing), drawing.edges);
  expect(short?.routes.some((r) => r.label?.text === "refines · declared")).toBe(true);
  const d = {
    ...drawing,
    edges: drawing.edges.map((e, i) => ({
      ...e,
      kind: i === 0 ? "very-long-relation-".repeat(60) : e.kind,
    })),
  };
  const routed = routeDiagram(layoutDiagram(d), d.edges);
  expect(routed).not.toBeNull();
  expect(routed?.routes.some((r) => r.label?.text === r.key)).toBe(true);
  expect(renderDiagram(d)).toContain("E1: very-long-relation-");
});
it("names viewport and instruction ids for trace and secondary views", () => {
  const d = {
    ...drawing,
    grid: true,
    boxes: drawing.boxes.map((b, i) => ({ ...b, context: String(i), layer: "domain" })),
  };
  for (const id of [drawing.subject, `${drawing.subject}.realization`]) {
    const html = renderDiagram(d, id);
    expect(html).toContain(`id="diagram.${id}.viewport"`);
    expect(html).toContain(`id="diagram.${id}.scroll-help"`);
    expect(html).toContain(`aria-describedby="diagram.${id}.scroll-help"`);
  }
});
it("names the architecture syntax and serializes aliases in displayed box order", () => {
  const d = {
    ...drawing,
    grid: true,
    boxes: [
      {
        id: "component:adapters",
        words: "Adapter",
        target: "#adapter",
        context: "one",
        layer: "adapter",
      },
      { id: "component:cli", words: "CLI", target: "#cli", context: "one", layer: "edge" },
    ],
    edges: [],
  };
  const html = renderDiagram(d);
  expect(html).toContain("Preferred syntax: block");
  expect(html).toContain("flowchart fallback because block cannot carry edge claims and counts");
  expect(html).toContain("n0[&quot;CLI · component:cli&quot;]");
});

import { readFileSync } from "node:fs";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { evaluateStudioRecipe } from "../src/projections/studio/recipes.js";
import type { Architecture } from "../src/projections/studio/pages/architecture-page.js";
import type { Layout } from "../src/projections/studio/diagrams/layout.js";
import type { Routed } from "../src/projections/studio/diagrams/routing.js";
import type { DiagramInput } from "../src/projections/studio/diagrams/model.js";
function assertGeometry(layout: Layout, routed: Routed): void {
  const failures: string[] = [];
  const ports = routed.routes.flatMap((r) => [
    JSON.stringify(r.points[0]),
    JSON.stringify(r.points.at(-1)),
  ]);
  if (new Set(ports).size !== ports.length) failures.push("shared port");
  const segments = routed.routes.flatMap((r, index) =>
    r.points.slice(1).map((b, i) => ({ a: required(r.points[i]), b, index })),
  );
  for (const [i, { a, b, index }] of segments.entries()) {
    if (a.x !== b.x && a.y !== b.y) failures.push("non-orthogonal segment");
    for (const { a: c, b: d, index: other } of segments.slice(i + 1)) {
      if (index === other) continue;
      if (
        a.x === b.x &&
        c.x === d.x &&
        a.x === c.x &&
        Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) >
          Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y))
      )
        failures.push("shared vertical segment");
      if (
        a.y === b.y &&
        c.y === d.y &&
        a.y === c.y &&
        Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) >
          Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x))
      )
        failures.push("shared horizontal segment");
    }
  }
  const labels = routed.routes.flatMap((r) => (r.label ? [r.label] : []));
  for (const [i, a] of labels.entries())
    for (const b of labels.slice(i + 1)) {
      if (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      )
        failures.push("label overlap");
    }
  for (const route of routed.routes) {
    for (let i = 1; i < route.points.length; i++) {
      const a = required(route.points[i - 1]),
        b = required(route.points[i]);
      for (const box of layout.boxes) {
        if (
          (i === 1 && box.box.id === route.edge.from) ||
          (i === route.points.length - 1 && box.box.id === route.edge.to)
        )
          continue;
        if (routingChecks.intersects(a, b, box)) failures.push("box crossing");
      }
      for (const label of [...layout.labels, ...labels])
        if (routingChecks.intersects(a, b, label)) failures.push("label crossing");
    }
  }
  expect(failures).toEqual([]);
}
it("routes the current Protocol architecture and recorded adopter architecture with distinct ports and segments", async () => {
  const reader = createReader(
    extract({
      root: process.cwd(),
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    }).graph,
  );
  const answer = (await evaluateStudioRecipe(reader, 17)) as Architecture;
  const components = answer.components.filter((c) => c.declared);
  const protocol: DiagramInput = {
    boxes: components.map((c) => ({
      id: c.id,
      words: c.label ?? c.id,
      detail: `${String(c.members.length)} members`,
      context: c.context,
      layer: c.layer,
      target: `#${c.id}`,
    })),
    edges: components.flatMap((c) =>
      c.usesCounts.map((u) => ({
        from: c.id,
        to: u.component,
        kind: "uses",
        claim: "anchored",
        count: u.edges,
      })),
    ),
  };
  // Selected diagram inputs from the adopter at b038bd4, read with the architecture recipe.
  const platform = JSON.parse(
    readFileSync(new URL("./fixtures/studio/platform-architecture.json", import.meta.url), "utf8"),
  ) as DiagramInput;
  for (const input of [protocol, platform]) {
    for (const d of architectureDiagrams(input).drawings) {
      const l = layoutDiagram(d),
        routed = routeDiagram(l, d.edges);
      expect(routed).not.toBeNull();
      if (!routed) throw new Error(`No architecture routes: ${d.subject}`);
      assertGeometry(l, routed);
      expect(routeDiagram(l, d.edges)).toEqual(routed);
    }
  }
}, 30000);

it("extends overflow rails past earlier labels on the adopter's dense traces", () => {
  const inputs = JSON.parse(
    readFileSync(new URL("./fixtures/studio/platform-traces.json", import.meta.url), "utf8"),
  ) as (DiagramInput & { subject: string })[];
  for (const input of inputs) {
    const d = traceDiagram(input),
      l = layoutDiagram(d),
      r = routeDiagram(l, d.edges);
    expect(r).not.toBeNull();
    if (!r) throw new Error(`Missing routes for ${d.subject}`);
    assertGeometry(l, r);
  }
});

it("keeps high-degree boxes inside their cells when contexts share a grid", () => {
  const boxes = Array.from({ length: 40 }, (_, i) => ({
    id: `component:wide.${String(i)}`,
    words: "Component",
    target: "#main",
    context: i === 0 ? "first" : "second",
    layer: "domain",
  }));
  const d = {
    subject: "architecture",
    caption: "Shared contexts",
    grid: true,
    boxes,
    edges: boxes
      .slice(1)
      .map((b) => ({ from: required(boxes[0]).id, to: b.id, kind: "uses", claim: "anchored" })),
  };
  const l = layoutDiagram(d);
  expect(l.boxes.every((b) => b.width <= 264)).toBe(true);
  const first = required(l.boxes.find((b) => b.box.context === "first"));
  const second = required(l.boxes.find((b) => b.box.context === "second"));
  expect(first.x + first.width + 24).toBeLessThanOrEqual(second.x);
});

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
    const failed = renderDiagram(star);
    expect(failed).not.toContain("<svg");
    expect(failed).toContain(
      "Shown as text: a distinct route or label could not be placed within the routing budget.",
    );
    expect(failed).not.toContain("Mermaid source");
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
    expect(source).not.toMatch(/^\s*(?:click|%%\{)/mu);
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
    for (const route of routed.routes)
      for (let i = 1; i < route.points.length; i++) {
        for (const obstacle of [...layout.boxes, ...layout.labels]) {
          if (i === 1 && "box" in obstacle && obstacle.box.id === route.edge.from) continue;
          if (
            i === route.points.length - 1 &&
            "box" in obstacle &&
            obstacle.box.id === route.edge.to
          )
            continue;
          const { intersects } = routingChecks;
          expect(
            intersects(required(route.points[i - 1]), required(route.points[i]), obstacle),
          ).toBe(false);
        }
        for (const other of routed.routes)
          if (other.label)
            expect(
              routingChecks.intersects(
                required(route.points[i - 1]),
                required(route.points[i]),
                other.label,
              ),
            ).toBe(false);
      }
    for (const route of routed.routes)
      for (const other of routed.routes)
        if (route !== other && route.label && other.label) {
          const a = route.label,
            b = other.label;
          expect(
            a.x < a.x + a.width &&
              a.x + a.width > b.x &&
              a.x < b.x + b.width &&
              a.y + a.height > b.y &&
              a.y < b.y + b.height,
          ).toBe(false);
        }
    expect(renderDiagram(d)).toBe(renderDiagram(d));
  }
});
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
    realizationDiagram(input),
  ];
  for (const d of drawings) {
    const html = renderDiagram(d);
    expect(html).toContain("<summary>Mermaid source</summary>");
    expect(html).toContain("Syntax:");
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
  realizationDiagram,
} from "../src/projections/studio/diagrams/index.js";

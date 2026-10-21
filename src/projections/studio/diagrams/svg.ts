import { escape } from "../pages/html.js";
import { compare, contextOf, layerOf, layers, withinBound } from "./model.js";
import type { Diagram, DiagramBox } from "./model.js";

export function labelLines(text: string): string[] {
  const result: string[] = [];
  let rest = text;
  while (rest.length > 30) {
    const prefix = rest.slice(0, 30);
    const breakAt = prefix.includes(" ")
      ? prefix.lastIndexOf(" ")
      : Math.max(prefix.lastIndexOf("."), prefix.lastIndexOf(":"));
    const fallback = prefix.lastIndexOf("-");
    const n = breakAt >= 0 ? breakAt + 1 : fallback >= 0 ? fallback + 1 : 30;
    result.push(rest.slice(0, n));
    rest = rest.slice(n);
  }
  if (rest) result.push(rest);
  return result;
}
interface Positioned {
  readonly box: DiagramBox;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
const foldedBand = (b: DiagramBox): boolean =>
  b.folded === true && (b.band === "Other contexts" || b.band === "Other layers");
function layout(d: Diagram) {
  const boxes: Positioned[] = [];
  const labels: { kind: "lane" | "band"; label: string; x: number; y: number }[] = [];
  const columns = d.grid
    ? [...new Set(d.boxes.filter((b) => !foldedBand(b)).map(contextOf))].sort((a, b) =>
        a === "not stated" ? 1 : b === "not stated" ? -1 : compare(a, b),
      )
    : [""];
  const bands = d.grid
    ? layers.filter((l) => d.boxes.some((b) => !foldedBand(b) && layerOf(b) === l))
    : [...new Set(d.boxes.map((b) => b.band ?? "Units"))];
  const cell = (c: string, b: string) =>
    d.boxes.filter((box) =>
      d.grid
        ? !foldedBand(box) && contextOf(box) === c && layerOf(box) === b
        : (box.band ?? "Units") === b,
    );
  const dimensions = (box: DiagramBox) => {
    const lines = [...labelLines(box.id), ...labelLines(box.words)];
    return {
      width: Math.ceil(Math.max(1, ...lines.map((l) => l.length)) * 7.5) + 24,
      height: lines.length * 17 + 24,
    };
  };
  const boxStride = Math.max(180, ...d.boxes.map((box) => dimensions(box).width + 24));
  const widths = new Map(
    columns.map((c) => [
      c,
      Math.max(
        180,
        ...bands.map((b) => {
          const items = cell(c, b);
          return Math.min(6, items.length) * boxStride;
        }),
      ),
    ]),
  );
  const heights = new Map(
    bands.map((b) => [
      b,
      Math.max(
        80,
        ...columns.map((c) => {
          const items = cell(c, b);
          return (
            Math.ceil(items.length / 6) *
              Math.max(60, ...items.map((item) => dimensions(item).height + 26)) +
            36
          );
        }),
      ),
    ]),
  );
  let x = 20;
  for (const column of columns) {
    if (d.grid) labels.push({ kind: "lane", label: column, x: x + 12, y: 24 });
    let y = d.grid ? 60 : 12;
    for (const band of bands) {
      labels.push({ kind: "band", label: band, x: x + 12, y: y + 20 });
      const items = cell(column, band).sort((a, b) => compare(a.id, b.id));
      const maxW = boxStride;
      const maxH = Math.max(60, ...items.map((item) => dimensions(item).height + 26));
      items.forEach((box, i) =>
        boxes.push({
          box,
          x: x + 12 + (i % 6) * maxW,
          y: y + 36 + Math.floor(i / 6) * maxH,
          ...dimensions(box),
        }),
      );
      y += heights.get(band) ?? 80;
    }
    x += (widths.get(column) ?? 180) + 28;
  }
  let bottom = (d.grid ? 60 : 12) + [...heights.values()].reduce((a, b) => a + b, 0);
  if (d.grid)
    for (const band of ["Other layers", "Other contexts"]) {
      const items = d.boxes
        .filter((b) => foldedBand(b) && b.band === band)
        .sort((a, b) => compare(a.id, b.id));
      if (items.length === 0) continue;
      labels.push({ kind: "band", label: band, x: 32, y: bottom + 20 });
      const stride = Math.max(60, ...items.map((b) => dimensions(b).height + 26));
      items.forEach((box, i) =>
        boxes.push({
          box,
          x: 32 + (i % 6) * boxStride,
          y: bottom + 36 + Math.floor(i / 6) * stride,
          ...dimensions(box),
        }),
      );
      bottom += Math.ceil(items.length / 6) * stride + 36;
      x = Math.max(x, 44 + Math.min(6, items.length) * boxStride);
    }
  return {
    boxes,
    labels,
    width: Math.max(240, x),
    boxStride,
    height: Math.max(120, bottom + 20),
  };
}
function svg(d: Diagram, textId: string, diagramId: string): string {
  const l = layout(d),
    positions = new Map(l.boxes.map((b) => [b.box.id, b]));
  const marker = `diagram.${diagramId}.arrow`;
  const singleRelation = new Set(d.edges.map((edge) => edge.kind)).size === 1;
  const edges = d.edges
    .map((e) => {
      const a = positions.get(e.from),
        b = positions.get(e.to);
      if (!a || !b) return "";
      const ax = a.x + Math.round(a.width / 2),
        ay = a.y + a.height,
        bx = b.x + Math.round(b.width / 2),
        by = b.y;
      const mid = ay + 12;
      const rail = a.x + l.boxStride - 12;
      const approach = by - 12;
      return `<g class="edge" data-from="${escape(e.from)}" data-to="${escape(e.to)}" data-kind="${escape(e.kind)}"><path d="M ${String(ax)} ${String(ay)} V ${String(mid)} H ${String(rail)} V ${String(approach)} H ${String(bx)} V ${String(by)}" fill="none"${e.kind === "plans to use" ? ' stroke-dasharray="6 4"' : ""} marker-end="url(#${escape(marker)})"/>${singleRelation ? "" : `<text x="${String(Math.round((ax + bx) / 2))}" y="${String(mid - 3)}">${escape(e.kind)}${(e.count ?? 1) > 1 ? ` (${String(e.count)} unit edges)` : ""}</text>`}</g>`;
    })
    .join("");
  const node = (p: Positioned) =>
    `<g class="node" data-id="${escape(p.box.id)}"${p.box.planned ? ' data-planned="true"' : ""}${p.box.folded ? ' data-folded="true"' : ""}><a href="${escape(p.box.target)}"><rect x="${String(p.x)}" y="${String(p.y)}" width="${String(p.width)}" height="${String(p.height)}" rx="4"${p.box.planned ? ' stroke-dasharray="6 4"' : ""}/><text x="${String(p.x + 12)}" y="${String(p.y + 23)}">${[...labelLines(p.box.id), ...labelLines(p.box.words)].map((line, i) => `<tspan x="${String(p.x + 12)}" dy="${String(i === 0 ? 0 : 17)}">${escape(line)}</tspan>`).join("")}</text></a></g>`;
  const groups = d.grid
    ? l.labels
        .filter((label) => label.kind === "lane")
        .map(
          (lane) =>
            `<g class="lane" data-label="${escape(lane.label)}"><text x="${String(lane.x)}" y="${String(lane.y)}">${escape(lane.label)}</text>${l.labels
              .filter(
                (b) =>
                  b.kind === "band" &&
                  b.x === lane.x &&
                  b.label !== "Other contexts" &&
                  b.label !== "Other layers",
              )
              .map(
                (band) =>
                  `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${escape(band.label)}</text>${l.boxes
                    .filter(
                      (p) =>
                        !foldedBand(p.box) &&
                        contextOf(p.box) === lane.label &&
                        layerOf(p.box) === band.label,
                    )
                    .map(node)
                    .join("")}</g>`,
              )
              .join("")}</g>`,
        )
        .join("") +
      l.labels
        .filter(
          (label) =>
            label.kind === "band" &&
            (label.label === "Other layers" || label.label === "Other contexts"),
        )
        .map(
          (band) =>
            `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${escape(band.label)}</text>${l.boxes
              .filter((p) => foldedBand(p.box) && p.box.band === band.label)
              .map(node)
              .join("")}</g>`,
        )
        .join("")
    : l.labels
        .map(
          (band) =>
            `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${escape(band.label)}</text>${l.boxes
              .filter((p) => (p.box.band ?? "Units") === band.label)
              .map(node)
              .join("")}</g>`,
        )
        .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby="${escape(textId)}" viewBox="0 0 ${String(l.width)} ${String(l.height)}" width="${String(l.width)}" height="${String(l.height)}"><title>${escape(d.caption)}</title><defs><marker id="${escape(marker)}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${edges}${groups}</svg>`;
}
/**
 * @sdpAnchor impl:protocol.studio-diagrams
 * @sdpLabel deterministic grid and band layouts with bounded folds and full text equivalents
 * @sdpSatisfies spec:consumers.spec-studio.diagrams
 * @sdpReferences spec:decisions.studio-diagram-renderer, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function renderDiagram(d: Diagram, diagramId = d.subject): string {
  const textId = `diagram.${diagramId}.text`,
    fits = withinBound(d);
  const edgeLabels = new Map(d.boxes.map((box) => [box.id, box.edgeLabel ?? box.id]));
  const words = (b: DiagramBox) =>
    `${b.words}${b.planned && !b.words.includes("planned") ? ", planned" : ""}${b.folded && !b.words.includes("folded") ? ", folded" : ""}`;
  const normalized = {
    ...d,
    boxes: d.boxes.map((b) => ({ ...b, words: words(b) })),
    edges: [...d.edges].sort(
      (a, b) => compare(a.from, b.from) || compare(a.to, b.to) || compare(a.kind, b.kind),
    ),
  };
  const text = `<details${fits ? "" : " open"} id="${escape(textId)}"><summary>The diagram as text</summary><ul>${normalized.boxes.map((b) => `<li>${escape(b.id)}: ${escape(b.words)}</li>`).join("")}${normalized.edges.map((e) => `<li>${escape(edgeLabels.get(e.from) ?? e.from)} ${escape(e.kind)} ${escape(edgeLabels.get(e.to) ?? e.to)}${(e.count ?? 1) > 1 ? ` (${String(e.count)} unit edges)` : ""}</li>`).join("")}</ul></details>`;
  const relation = new Set(d.edges.map((edge) => edge.kind));
  const legend =
    relation.size === 1 && fits
      ? `<p class="diagram-legend">Arrows: ${escape([...relation][0] ?? "")}.</p>`
      : "";
  const sectionId = d.sectionId === undefined ? d.subject : d.sectionId;
  return `<section${sectionId === null ? "" : ` id="${escape(sectionId)}"`}><sdp-diagram subject="${escape(d.subject)}"><figure><figcaption>${escape(d.caption)}</figcaption>${legend}${fits ? `<div class="diagram-scroll">${svg(normalized, textId, diagramId)}</div>` : "<p>Shown as text: this drawing exceeds the bound of 40 boxes and 100 edges.</p>"}${text}</figure></sdp-diagram></section>`;
}

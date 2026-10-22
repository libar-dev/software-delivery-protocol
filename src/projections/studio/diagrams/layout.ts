import { compare, contextOf, layerOf, layers } from "./model.js";
import type { Diagram, DiagramBox } from "./model.js";

export const widthBudget = 880;
export interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export interface Positioned extends Rectangle {
  readonly box: DiagramBox;
  readonly title: string[];
  readonly identity: string[];
  readonly detail: string[];
}
export interface Layout {
  readonly boxes: Positioned[];
  readonly labels: (Rectangle & { kind: "lane" | "band"; label: string; lines: string[] })[];
  readonly width: number;
  readonly height: number;
}
export const snap = (n: number): number => Math.ceil(n / 8) * 8;
export function labelLines(text: string, limit = 30): string[] {
  const result: string[] = [];
  let chars = Array.from(text);
  while (chars.length > limit) {
    const prefix = chars.slice(0, limit);
    let cut = prefix.lastIndexOf(" ");
    if (cut < 0) cut = Math.max(...[".", ":", "-"].map((c) => prefix.lastIndexOf(c)));
    const n = cut < 0 ? limit : cut + 1;
    result.push(chars.slice(0, n).join("").trim());
    chars = chars.slice(n);
  }
  if (chars.length) result.push(chars.join("").trim());
  return result;
}
export function shortIds(ids: readonly string[]): Map<string, string> {
  const parts = ids.map((id) => id.slice(id.indexOf(":") + 1).split("."));
  let shared = 0;
  while (
    parts.length &&
    parts.every((p) => p.length > shared + 1 && p[shared] === parts[0]?.[shared])
  )
    shared++;
  const result = new Map(ids.map((id, i) => [id, `…${parts[i]?.slice(shared).join(".") ?? id}`]));
  for (const id of ids) {
    const value = result.get(id);
    if (ids.some((other) => other !== id && result.get(other) === value)) {
      for (const other of ids.filter((other) => result.get(other) === value))
        result.set(other, other);
    }
  }
  return result;
}
export const foldedBand = (b: DiagramBox): boolean =>
  b.folded === true && (b.band === "Other contexts" || b.band === "Other layers");
/**
 * @sdpAnchor impl:protocol.studio-diagram-layout
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.legibility
 * @sdpReferences spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function layoutDiagram(d: Diagram): Layout {
  const short = shortIds(d.boxes.map((b) => b.id));
  const boxes: Positioned[] = [],
    labels: Layout["labels"] = [];
  const degree = (id: string) =>
    d.edges.reduce((n, e) => n + Number(e.from === id) + Number(e.to === id), 0);
  const margin = 24;
  const measure = (box: DiagramBox) => {
    const title = labelLines(box.title ?? box.words, 28),
      identity = labelLines(short.get(box.id) ?? box.id),
      detail = labelLines(box.detail ?? "");
    return {
      title,
      identity,
      detail,
      width: snap(
        Math.max(
          96,
          ...[...title, ...identity, ...detail].map((s) => Array.from(s).length * 8 + 24),
          Math.min(d.grid ? 264 : 832, degree(box.id) * 8 + 32),
        ),
      ),
      height: snap(24 + (title.length + identity.length + detail.length) * 18),
    };
  };
  const columns = d.grid
    ? [...new Set(d.boxes.filter((b) => !foldedBand(b)).map(contextOf))].sort((a, b) =>
        a === "not stated" ? 1 : b === "not stated" ? -1 : compare(a, b),
      )
    : [""];
  const bands = d.grid
    ? layers.filter((l) => d.boxes.some((b) => !foldedBand(b) && layerOf(b) === l))
    : [...new Set(d.boxes.map((b) => b.band ?? "Units"))];
  const cell = (c: string, b: string) =>
    d.boxes
      .filter((box) =>
        d.grid
          ? !foldedBand(box) && contextOf(box) === c && layerOf(box) === b
          : (box.band ?? "Units") === b,
      )
      .sort((a, b) => compare(a.id, b.id));
  const cellWidth = d.grid ? 264 : widthBudget - 48;
  const place = (items: readonly DiagramBox[], x: number, y: number, width: number) => {
    let nextX = x,
      nextY = y,
      rowHeight = 0;
    for (const box of items) {
      const size = measure(box);
      if (nextX > x && nextX + size.width > x + width) {
        nextX = x;
        nextY += rowHeight + 64;
        rowHeight = 0;
      }
      boxes.push({ box, x: nextX, y: nextY, ...size });
      nextX += size.width + 24;
      rowHeight = Math.max(rowHeight, size.height);
    }
    return nextY + rowHeight;
  };
  const label = (kind: "lane" | "band", text: string, x: number, y: number) => {
    const lines = labelLines(text, 28);
    labels.push({
      kind,
      label: text,
      lines,
      x,
      y,
      width: Math.max(8, ...lines.map((s) => Array.from(s).length * 8)),
      height: lines.length * 18,
    });
    return lines.length * 18;
  };
  const laneHeight = d.grid
    ? Math.max(18, ...columns.map((c) => labelLines(c, 28).length * 18)) + 32
    : 0;
  let y = snap(margin + laneHeight),
    maxX = margin;
  columns.forEach((c, i) => {
    if (d.grid) label("lane", c, margin + i * (cellWidth + 24), margin);
  });
  for (const band of bands) {
    const heights = columns.map((c, i) => {
      const x = margin + i * (cellWidth + 24);
      const h = label("band", band, x, y);
      const bottom = place(cell(c, band), x, snap(y + h + 80), cellWidth);
      maxX = Math.max(maxX, ...boxes.map((b) => b.x + b.width));
      return bottom;
    });
    y = snap(Math.max(y + 64, ...heights) + 96);
  }
  if (d.grid)
    for (const band of ["Other layers", "Other contexts"]) {
      const items = d.boxes
        .filter((b) => foldedBand(b) && b.band === band)
        .sort((a, b) => compare(a.id, b.id));
      if (!items.length) continue;
      const h = label("band", band, margin, y);
      y = place(items, margin, snap(y + h + 80), widthBudget - 48) + 64;
      maxX = Math.max(maxX, ...boxes.map((b) => b.x + b.width));
    }
  const labelled =
    new Set(d.edges.map((e) => `${e.kind === "plans to use" ? "uses" : e.kind}/${e.claim ?? ""}`))
      .size > 1;
  const events = [...new Set([...boxes.map((b) => b.y), ...labels.map((l) => l.y)])].sort(
    (a, b) => a - b,
  );
  let cursor = margin;
  const movedBoxes: Positioned[] = [],
    movedLabels: Layout["labels"] = [];
  for (const at of events) {
    const ls = labels.filter((l) => l.y === at),
      bs = boxes.filter((b) => b.y === at);
    if (ls.length) {
      movedLabels.push(...ls.map((l) => ({ ...l, y: cursor })));
      cursor += snap(Math.max(...ls.map((l) => l.height)) + 24);
    }
    if (bs.length) {
      const ids = new Set(bs.map((b) => b.box.id));
      const ports = d.edges.reduce(
        (n, e) => n + Number(ids.has(e.from)) + Number(ids.has(e.to)),
        0,
      );
      cursor += ports * (labelled ? 48 : 8) + 32;
      movedBoxes.push(...bs.map((b) => ({ ...b, y: cursor })));
      cursor += Math.max(...bs.map((b) => b.height)) + 32;
    }
  }
  return {
    boxes: movedBoxes,
    labels: movedLabels,
    width: snap(Math.max(240, maxX + margin, ...labels.map((l) => l.x + l.width + 24))),
    height: snap(Math.max(120, cursor + margin)),
  };
}

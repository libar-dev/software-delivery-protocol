import { compare, contextOf, layerOf, layers, needsEdgeLabels, withinBound } from "./model.js";
import type { Diagram, DiagramBox, DiagramEdge, DiagramInput } from "./model.js";

export const widthBudget = 880;
export const foldHeightBudget = 2000;
const measuredHeights = new WeakMap<DiagramInput, number>();
export const measuredHeight = (d: DiagramInput & Partial<Diagram>): number => {
  const known = measuredHeights.get(d);
  if (known !== undefined) return known;
  const height = layoutDiagram({ subject: "", caption: "", ...d }).height;
  measuredHeights.set(d, height);
  return height;
};
export const needsFold = (d: DiagramInput & Partial<Diagram>): boolean =>
  !withinBound(d) || measuredHeight(d) > foldHeightBudget;
export const reducesHeight = (
  before: DiagramInput & Partial<Diagram>,
  after: DiagramInput & Partial<Diagram>,
): boolean => measuredHeight(after) < measuredHeight(before);
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
  readonly packedLanes?: boolean;
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
  const collisions = new Map<string, Set<string>>();
  for (const [id, value] of result) {
    const group = collisions.get(value) ?? new Set<string>();
    group.add(id);
    collisions.set(value, group);
  }
  for (const group of collisions.values())
    if (group.size > 1) for (const id of group) result.set(id, id);
  return result;
}
export const foldedBand = (b: DiagramBox): boolean =>
  b.folded === true && (b.band === "Other contexts" || b.band === "Other layers");
interface LaneEnd {
  readonly id: string;
  readonly side: "top" | "bottom";
  readonly port: number;
  readonly offset: number;
  readonly size: number;
}
// Share a horizontal lane only when the endpoint spans are disjoint, including label room.
export function edgeLanes(
  boxes: readonly Positioned[],
  edges: readonly DiagramEdge[],
  packed = true,
) {
  const byId = new Map(boxes.map((b) => [b.box.id, b]));
  const ports = new Map<string, number>();
  const lanes = new Map<string, { start: number; end: number; offset: number; size: number }[]>();
  const labelled = needsEdgeLabels(edges);
  const dense =
    !packed || boxes.some((b) => b.box.context !== undefined || b.box.layer !== undefined);
  return [...edges]
    .sort(
      (a, b) =>
        compare(a.from, b.from) ||
        compare(a.to, b.to) ||
        compare(a.kind, b.kind) ||
        compare(a.claim ?? "", b.claim ?? "") ||
        compare(a.reason ?? "", b.reason ?? ""),
    )
    .map((edge) => {
      const from = byId.get(edge.from),
        to = byId.get(edge.to);
      if (!from || !to) return { edge, a: null, b: null };
      const endpoint = (box: Positioned, side: "top" | "bottom", label: boolean): LaneEnd => {
        const key = `${box.box.id}/${side}`,
          port = ports.get(key) ?? 0;
        ports.set(key, port + 1);
        const laneKey = `${String(box.y)}/${side}`;
        const spans = lanes.get(laneKey) ?? [];
        const start = dense ? 0 : Math.min(from.x, to.x),
          end = dense
            ? Number.MAX_SAFE_INTEGER
            : Math.max(from.x + from.width, to.x + to.width) + (label ? 200 : 24);
        const size = label ? 48 : 8;
        let offset = 0;
        while (
          spans.some(
            (s) =>
              start < s.end + 16 &&
              end + 16 > s.start &&
              offset < s.offset + s.size &&
              offset + size > s.offset,
          )
        )
          offset += 8;
        spans.push({ start, end, offset, size });
        lanes.set(laneKey, spans);
        return { id: box.box.id, side, port, offset, size };
      };
      return {
        edge,
        a: endpoint(from, to.y > from.y ? "bottom" : "top", labelled),
        b: endpoint(to, from.y >= to.y ? "bottom" : "top", false),
      };
    });
}
/**
 * @sdpAnchor impl:protocol.studio-diagram-layout
 * @sdpLabel title-first box placement, wrapping and band sizing for desktop and phone
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.legibility, spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function layoutDiagram(d: Diagram, packedLanes = true): Layout {
  const short = shortIds(d.boxes.map((b) => b.identity ?? b.id));
  const boxes: Positioned[] = [],
    labels: Layout["labels"] = [];
  const degrees = new Map<string, number>();
  for (const e of d.edges) {
    degrees.set(e.from, (degrees.get(e.from) ?? 0) + 1);
    degrees.set(e.to, (degrees.get(e.to) ?? 0) + 1);
  }
  const margin = 24;
  const multipleContexts =
    d.grid && new Set(d.boxes.filter((b) => !foldedBand(b)).map(contextOf)).size > 1;
  const measure = (box: DiagramBox) => {
    const title = labelLines(box.title ?? box.words, 28),
      identity = box.hideIdentity ? [] : labelLines(short.get(box.identity ?? box.id) ?? box.id),
      detail = labelLines(box.detail ?? "");
    return {
      title,
      identity,
      detail,
      width: snap(
        Math.max(
          96,
          ...[...title, ...identity, ...detail].map((s) => Array.from(s).length * 8 + 24),
          Math.min(multipleContexts ? 264 : 832, (degrees.get(box.id) ?? 0) * 8 + 32),
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
      .sort((a, b) => (d.boxOrder === "supplied" || d.preserveOrder ? 0 : compare(a.id, b.id)));
  const cellWidth = d.grid && columns.length > 1 ? 264 : widthBudget - 48;
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
        .sort((a, b) => (d.boxOrder === "supplied" || d.preserveOrder ? 0 : compare(a.id, b.id)));
      if (!items.length) continue;
      const h = label("band", band, margin, y);
      y = place(items, margin, snap(y + h + 80), widthBudget - 48) + 64;
      maxX = Math.max(maxX, ...boxes.map((b) => b.x + b.width));
    }
  const reservations = edgeLanes(boxes, d.edges, packedLanes);
  const reservationsById = new Map<string, { above: number; below: number }>();
  for (const end of reservations.flatMap((r) => [r.a, r.b])) {
    if (!end) continue;
    const space = reservationsById.get(end.id) ?? { above: 0, below: 0 };
    const side = end.side === "top" ? "above" : "below";
    space[side] = Math.max(space[side], end.offset + end.size);
    reservationsById.set(end.id, space);
  }
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
      const above = Math.max(0, ...bs.map((b) => reservationsById.get(b.box.id)?.above ?? 0));
      const below = Math.max(0, ...bs.map((b) => reservationsById.get(b.box.id)?.below ?? 0));
      cursor += above + 48;
      movedBoxes.push(...bs.map((b) => ({ ...b, y: cursor })));
      cursor += Math.max(...bs.map((b) => b.height)) + below + 48;
    }
  }
  return {
    packedLanes,
    boxes: movedBoxes,
    labels: movedLabels,
    width: snap(Math.max(240, maxX + margin, ...labels.map((l) => l.x + l.width + 24))),
    height: snap(Math.max(120, cursor + margin)),
  };
}

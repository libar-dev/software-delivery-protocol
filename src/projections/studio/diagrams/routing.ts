import { compare, needsEdgeLabels } from "./model.js";
import type { DiagramEdge } from "./model.js";
import type { Layout, Rectangle } from "./layout.js";
import { edgeLanes, snap, widthBudget } from "./layout.js";
export interface Point {
  readonly x: number;
  readonly y: number;
}
export interface Route {
  readonly edge: DiagramEdge;
  readonly points: Point[];
  readonly key: string;
  readonly label?: Rectangle & { text: string };
}
export interface Routed {
  readonly routes: Route[];
  readonly width: number;
  readonly height: number;
}
export const edgeWords = (e: DiagramEdge): string =>
  `${e.kind}${e.orders === false ? " (orders nothing)" : ""}${e.claim ? ` · ${e.claim}` : ""}${(e.count ?? 1) > 1 ? ` (${String(e.count)} ${e.countLabel ?? "unit edges"})` : ""}${e.reason ? ` — ${e.reason}` : ""}`;
export const edgeOrder = (a: DiagramEdge, b: DiagramEdge): number =>
  compare(a.from, b.from) ||
  compare(a.to, b.to) ||
  compare(a.kind, b.kind) ||
  compare(a.claim ?? "", b.claim ?? "") ||
  compare(a.reason ?? "", b.reason ?? "");
export const intersects = (a: Point, b: Point, r: Rectangle, clearance = 12): boolean =>
  a.x === b.x
    ? a.x > r.x - clearance &&
      a.x < r.x + r.width + clearance &&
      Math.max(a.y, b.y) > r.y - clearance &&
      Math.min(a.y, b.y) < r.y + r.height + clearance
    : a.y > r.y - clearance &&
      a.y < r.y + r.height + clearance &&
      Math.max(a.x, b.x) > r.x - clearance &&
      Math.min(a.x, b.x) < r.x + r.width + clearance;
/**
 * @sdpAnchor impl:protocol.studio-diagram-routing
 * @sdpLabel port, channel and overflow-rail edge routes around boxes and labels
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.edge-routing
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function routeDiagram(
  layout: Layout,
  edges: readonly DiagramEdge[],
  budget = 20_000_000,
): Routed | null {
  if (!edges.length) return { routes: [], width: layout.width, height: layout.height };
  const boxes = new Map(layout.boxes.map((b) => [b.box.id, b]));
  const multiple = needsEdgeLabels(edges);
  const routes: Route[] = [];
  const bottoms = new Map(
    layout.boxes.map((b) => [
      b.y,
      Math.max(
        ...layout.boxes.filter((other) => other.y === b.y).map((other) => other.y + other.height),
      ),
    ]),
  );
  const end = (reservation: ReturnType<typeof edgeLanes>[number]["a"]) => {
    if (!reservation) return null;
    const box = boxes.get(reservation.id);
    if (!box || 16 + reservation.port * 8 >= box.width - 12) return null;
    return {
      port: {
        x: box.x + 16 + reservation.port * 8,
        y: reservation.side === "top" ? box.y : box.y + box.height,
      },
      lane:
        reservation.side === "top"
          ? box.y - 32 - reservation.offset
          : (bottoms.get(box.y) ?? 0) + 24 + reservation.offset + reservation.size,
    };
  };
  const allocated = edgeLanes(layout.boxes, edges, layout.packedLanes).map(({ edge, a, b }) => {
    const from = end(a),
      to = end(b);
    return from && to ? { edge, a: from, b: to } : null;
  });
  if (allocated.some((e) => e === null)) return null;
  const stubs = allocated.flatMap((e) =>
    e
      ? [
          { a: e.a.port, b: { x: e.a.port.x, y: e.a.lane }, edge: e.edge },
          { a: e.b.port, b: { x: e.b.port.x, y: e.b.lane }, edge: e.edge },
        ]
      : [],
  );
  const segments = (points: readonly Point[]) =>
    points.slice(1).flatMap((p, i) => {
      const previous = points[i];
      return previous ? [[previous, p] as const] : [];
    });
  const overlaps = (a: Point, b: Point, c: Point, d: Point) =>
    a.x === b.x && c.x === d.x && a.x === c.x
      ? Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) >
        Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y))
      : a.y === b.y &&
        c.y === d.y &&
        a.y === c.y &&
        Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) >
          Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x));
  type Segment = readonly [Point, Point];
  const placedSegments: Segment[] = [];
  const verticals = new Map<number, Segment[]>(),
    horizontals = new Map<number, Segment[]>();
  const remember = ([a, b]: Segment) => {
    const index = a.x === b.x ? verticals : horizontals,
      key = a.x === b.x ? a.x : a.y;
    index.set(key, [...(index.get(key) ?? []), [a, b]]);
    placedSegments.push([a, b]);
  };
  const obstacleRows = new Map<number, Rectangle[]>();
  const indexObstacle = (r: Rectangle) => {
    for (
      let row = Math.floor((r.y - 12) / 128);
      row <= Math.floor((r.y + r.height + 12) / 128);
      row++
    )
      obstacleRows.set(row, [...(obstacleRows.get(row) ?? []), r]);
  };
  for (const r of [...layout.boxes, ...layout.labels]) indexObstacle(r);
  const obstacles = (minY: number, maxY: number): Rectangle[] => {
    const found = new Set<Rectangle>();
    for (let row = Math.floor(minY / 128); row <= Math.floor(maxY / 128); row++)
      for (const r of obstacleRows.get(row) ?? []) found.add(r);
    return [...found];
  };
  const stubVerticals = new Map<number, typeof stubs>();
  for (const stub of stubs)
    stubVerticals.set(stub.a.x, [...(stubVerticals.get(stub.a.x) ?? []), stub]);
  const clear = (points: Point[], edge: DiagramEdge) => {
    for (const [j, [a, b]] of segments(points).entries()) {
      for (const obstacle of obstacles(Math.min(a.y, b.y), Math.max(a.y, b.y))) {
        if (--budget < 0) return false;
        if (
          (j === 0 && obstacle === boxes.get(edge.from)) ||
          (j === points.length - 2 && obstacle === boxes.get(edge.to))
        )
          continue;
        if (intersects(a, b, obstacle)) return false;
      }
      if (
        a.x === b.x &&
        (stubVerticals.get(a.x) ?? []).some(
          (stub) => stub.edge !== edge && overlaps(a, b, stub.a, stub.b),
        )
      )
        return false;
      for (const [c, d] of (a.x === b.x ? verticals.get(a.x) : horizontals.get(a.y)) ?? [])
        if (--budget < 0 || overlaps(a, b, c, d)) return false;
    }
    return true;
  };
  const labelFor = (text: string, points: Point[]): Route["label"] => {
    const width = Array.from(text).length * 8;
    for (const [a, b] of segments(points).slice(1, 2)) {
      if (a.y !== b.y || Math.abs(b.x - a.x) < width + 24) continue;
      for (let x = Math.min(a.x, b.x) + 12; x + width + 12 <= Math.max(a.x, b.x); x += 8) {
        if (--budget < 0) return undefined;
        const label = { x, y: a.y - 28, width, height: 16, text };
        if (
          obstacles(label.y - 12, label.y + label.height + 12).some(
            (r) =>
              label.x < r.x + r.width + 12 &&
              label.x + label.width > r.x - 12 &&
              label.y < r.y + r.height + 12 &&
              label.y + label.height > r.y - 12,
          )
        )
          continue;
        if (stubs.some((stub) => intersects(stub.a, stub.b, label))) continue;
        if ([...placedSegments, ...segments(points)].some(([c, d]) => intersects(c, d, label)))
          continue;
        return label;
      }
    }
    return undefined;
  };
  for (const [i, entry] of allocated.entries()) {
    if (!entry) return null;
    const { edge, a, b } = entry;
    const key = `E${String(i + 1)}`;
    // Try the direct channel, then free interior rails, before spending overflow width.
    const rails = [
      ...new Set([
        b.port.x,
        a.port.x,
        ...Array.from({ length: Math.floor(layout.width / 8) }, (_, n) => (n + 1) * 8),
        ...Array.from({ length: edges.length + 1 }, (_, n) => layout.width + 24 + n * 8),
        // Earlier labels can consume the fixed gutter. Keep one free rail beyond them.
        snap(
          Math.max(
            layout.width,
            ...routes.flatMap((r) => [
              ...r.points.map((p) => p.x),
              ...(r.label ? [r.label.x + r.label.width + 12] : []),
            ]),
          ) + 48,
        ),
      ]),
    ];
    let chosen: Route | undefined;
    const wordings = multiple ? [`${edge.kind}${edge.claim ? ` · ${edge.claim}` : ""}`, key] : [""];
    const candidates = wordings
      .flatMap((wording, i) =>
        rails.map((rail) => ({
          wording,
          rail,
          rank: Number(rail > Math.max(layout.width - 24, widthBudget - 24)) * 2 + i,
        })),
      )
      .sort((a, b) => a.rank - b.rank);
    for (const { wording, rail } of candidates) {
      if (budget < 0) return null;
      const points = [
        a.port,
        { x: a.port.x, y: a.lane },
        { x: rail, y: a.lane },
        { x: rail, y: b.lane },
        { x: b.port.x, y: b.lane },
        b.port,
      ].filter((p, j, ps) => j === 0 || p.x !== ps[j - 1]?.x || p.y !== ps[j - 1]?.y);
      if (!clear(points, edge)) continue;
      const label = multiple ? labelFor(wording, points) : undefined;
      if (multiple && !label) continue;
      chosen = { edge, points, key, ...(label ? { label } : {}) };
      break;
    }
    if (!chosen) return null;
    routes.push(chosen);
    for (const segment of segments(chosen.points)) remember(segment);
    if (chosen.label) indexObstacle(chosen.label);
  }
  return {
    routes,
    width: snap(Math.max(layout.width, ...routes.flatMap((r) => r.points.map((p) => p.x + 24)))),
    height: layout.height,
  };
}

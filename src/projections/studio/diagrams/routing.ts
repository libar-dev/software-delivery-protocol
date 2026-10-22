import { compare, needsEdgeLabels } from "./model.js";
import type { DiagramEdge } from "./model.js";
import type { Layout, Rectangle } from "./layout.js";
import { snap } from "./layout.js";
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
  `${e.kind}${e.claim ? ` · ${e.claim}` : ""}${(e.count ?? 1) > 1 ? ` (${String(e.count)} unit edges)` : ""}${e.reason ? ` — ${e.reason}` : ""}`;
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
  const ports = new Map<string, number>(),
    lanes = new Map<string, number>(),
    routes: Route[] = [];
  const rowBottom = (y: number) =>
    Math.max(...layout.boxes.filter((b) => b.y === y).map((b) => b.y + b.height));
  const end = (id: string, side: "top" | "bottom", labelled: boolean) => {
    const box = boxes.get(id);
    if (!box) return null;
    const portKey = `${id}/${side}`,
      laneKey = `${String(box.y)}/${side}`;
    const port = ports.get(portKey) ?? 0;
    const previous = lanes.get(laneKey) ?? 0;
    const used = previous + (labelled ? 48 : 8);
    ports.set(portKey, port + 1);
    lanes.set(laneKey, used);
    if (16 + port * 8 >= box.width - 12) return null;
    return {
      port: { x: box.x + 16 + port * 8, y: side === "top" ? box.y : box.y + box.height },
      lane: side === "top" ? box.y - 32 - previous : rowBottom(box.y) + 24 + used,
    };
  };
  const allocated = [...edges].sort(edgeOrder).map((edge) => {
    const from = boxes.get(edge.from),
      to = boxes.get(edge.to);
    if (!from || !to) return null;
    const a = end(edge.from, to.y > from.y ? "bottom" : "top", multiple),
      b = end(edge.to, from.y >= to.y ? "bottom" : "top", false);
    return a && b ? { edge, a, b } : null;
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
  const clear = (points: Point[], edge: DiagramEdge) => {
    for (const [j, [a, b]] of segments(points).entries()) {
      for (const obstacle of [
        ...layout.boxes,
        ...layout.labels,
        ...routes.flatMap((r) => (r.label ? [r.label] : [])),
      ]) {
        if (--budget < 0) return false;
        if (
          (j === 0 && obstacle === boxes.get(edge.from)) ||
          (j === points.length - 2 && obstacle === boxes.get(edge.to))
        )
          continue;
        if (intersects(a, b, obstacle)) return false;
      }
      if (stubs.some((stub) => stub.edge !== edge && overlaps(a, b, stub.a, stub.b))) return false;
      for (const r of routes)
        for (const [c, d] of segments(r.points)) {
          if (--budget < 0 || overlaps(a, b, c, d)) return false;
        }
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
          [
            ...layout.boxes,
            ...layout.labels,
            ...routes.flatMap((r) => (r.label ? [r.label] : [])),
          ].some(
            (r) =>
              label.x < r.x + r.width + 12 &&
              label.x + label.width > r.x - 12 &&
              label.y < r.y + r.height + 12 &&
              label.y + label.height > r.y - 12,
          )
        )
          continue;
        if (stubs.some((stub) => intersects(stub.a, stub.b, label))) continue;
        if (
          [...routes.map((r) => r.points), points].some((ps) =>
            segments(ps).some(([c, d]) => intersects(c, d, label)),
          )
        )
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
      ]),
    ];
    let chosen: Route | undefined;
    for (const wording of multiple
      ? [`${edge.kind}${edge.claim ? ` · ${edge.claim}` : ""}`, key]
      : [""]) {
      for (const rail of rails) {
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
      if (chosen) break;
    }
    if (!chosen) return null;
    routes.push(chosen);
  }
  return {
    routes,
    width: snap(Math.max(layout.width, ...routes.flatMap((r) => r.points.map((p) => p.x))) + 24),
    height: layout.height,
  };
}

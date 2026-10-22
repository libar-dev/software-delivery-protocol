import { compare } from "./model.js";
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
  budget = 2_000_000,
): Routed | null {
  if (!edges.length) return { routes: [], width: layout.width, height: layout.height };
  const boxes = new Map(layout.boxes.map((b) => [b.box.id, b]));
  const multiple =
    new Set(edges.map((e) => `${e.kind === "plans to use" ? "uses" : e.kind}/${e.claim ?? ""}`))
      .size > 1;
  const ports = new Map<string, number>(),
    lanes = new Map<number, number>(),
    routes: Route[] = [];
  const end = (id: string) => {
    const box = boxes.get(id);
    if (!box) return null;
    const port = ports.get(id) ?? 0,
      lane = lanes.get(box.y) ?? 0;
    ports.set(id, port + 1);
    lanes.set(box.y, lane + 1);
    if (16 + port * 8 >= box.width - 12) return null;
    return {
      port: { x: box.x + 16 + port * 8, y: box.y },
      lane: box.y - 24 - lane * (multiple ? 48 : 8),
    };
  };
  for (const [i, edge] of [...edges].sort(edgeOrder).entries()) {
    const a = end(edge.from),
      b = end(edge.to);
    if (!a || !b) return null;
    const rail = layout.width + 88 + i * 8,
      key = `E${String(i + 1)}`;
    const points = [
      a.port,
      { x: a.port.x, y: a.lane },
      { x: rail, y: a.lane },
      { x: rail, y: b.lane },
      { x: b.port.x, y: b.lane },
      b.port,
    ];
    // Channel allocation is finite; validation refuses a bad placement instead of drawing through it.
    for (let j = 1; j < points.length; j++) {
      const from = points[j - 1],
        to = points[j];
      if (!from || !to) return null;
      for (const obstacle of [...layout.boxes, ...layout.labels]) {
        if (--budget < 0) return null;
        if (
          (j === 1 && obstacle === boxes.get(edge.from)) ||
          (j === points.length - 1 && obstacle === boxes.get(edge.to))
        )
          continue;
        if (intersects(from, to, obstacle)) return null;
      }
    }
    const label = multiple
      ? { x: layout.width + 24, y: a.lane - 28, width: key.length * 8, height: 16, text: key }
      : undefined;
    routes.push({ edge, points, key, ...(label ? { label } : {}) });
  }
  return {
    routes,
    width: snap(Math.max(layout.width, ...routes.flatMap((r) => r.points.map((p) => p.x))) + 24),
    height: layout.height,
  };
}

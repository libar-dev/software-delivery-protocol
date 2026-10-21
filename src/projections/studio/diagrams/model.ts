export interface DiagramBox {
  readonly id: string;
  readonly words: string;
  readonly target: string;
  readonly context?: string | null;
  readonly layer?: string | null;
  readonly band?: string;
  readonly planned?: boolean;
  readonly folded?: boolean;
}
export interface DiagramEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: string;
  readonly count?: number;
}
export interface DiagramInput {
  readonly boxes: readonly DiagramBox[];
  readonly edges: readonly DiagramEdge[];
}
export interface Diagram extends DiagramInput {
  readonly subject: string;
  readonly caption: string;
  readonly grid?: boolean;
  readonly sectionId?: string | null;
}
export const layers = ["edge", "application", "domain", "adapter", "infrastructure", "not stated"];
export const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
export const withinBound = (d: DiagramInput): boolean =>
  d.boxes.length <= 40 && d.edges.length <= 100;
export const contextOf = (b: DiagramBox): string => b.context ?? "not stated";
export const layerOf = (b: DiagramBox): string => b.layer ?? "not stated";
export function aggregate(
  edges: readonly DiagramEdge[],
  ids: ReadonlyMap<string, string>,
): DiagramEdge[] {
  const pairs = new Map<string, DiagramEdge>();
  for (const e of edges) {
    const from = ids.get(e.from),
      to = ids.get(e.to);
    if (from === undefined || to === undefined || from === to) continue;
    const key = JSON.stringify([from, to, e.kind]);
    pairs.set(key, {
      from,
      to,
      kind: e.kind,
      count: (pairs.get(key)?.count ?? 0) + (e.count ?? 1),
    });
  }
  return [...pairs.values()].sort(
    (a, b) => compare(a.from, b.from) || compare(a.to, b.to) || compare(a.kind, b.kind),
  );
}

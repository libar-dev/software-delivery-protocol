/**
 * @sdpAnchor impl:protocol.studio-diagram-model
 * @sdpLabel shared diagram boxes, edges and drawing bounds
 * @sdpSatisfies spec:consumers.spec-studio.diagrams
 * @sdpComponent component:protocol.projections
 * @sdpRole contract
 */
export interface DiagramBox {
  readonly id: string;
  readonly words: string;
  readonly identity?: string;
  readonly parent?: string;
  readonly title?: string;
  readonly elementId?: string;
  readonly hideIdentity?: boolean;
  readonly detail?: string;
  readonly foldedIds?: readonly string[];
  readonly cycleIds?: readonly string[];
  readonly edgeLabel?: string;
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
  readonly countLabel?: string;
  readonly claim?: string;
  readonly reason?: string;
  readonly orders?: boolean;
}
export interface DiagramInput {
  readonly boxes: readonly DiagramBox[];
  readonly edges: readonly DiagramEdge[];
}
export interface Diagram extends DiagramInput {
  readonly subject: string;
  readonly caption: string;
  readonly grid?: boolean;
  readonly boxOrder?: "supplied";
  readonly preserveOrder?: boolean;
  readonly mermaidKind?: "mindmap" | "flowchart BT" | "dependencies" | "block";
  readonly mermaidExplanation?: string;
  readonly mermaidNotes?: readonly string[];
  readonly legend?: string;
  readonly textEquivalent?: string;
  readonly textRows?: readonly string[];
  readonly note?: string;
  readonly occurrenceKey?: string;
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
    const key = JSON.stringify([from, to, e.kind, e.claim, e.orders]);
    const previous = pairs.get(key);
    const reason = previous && previous.reason !== e.reason ? undefined : e.reason;
    pairs.set(key, {
      from,
      to,
      kind: e.kind,
      ...(e.claim === undefined ? {} : { claim: e.claim }),
      ...(reason === undefined ? {} : { reason }),
      ...(e.orders === undefined ? {} : { orders: e.orders }),
      ...(e.countLabel === undefined ? {} : { countLabel: e.countLabel }),
      count: (pairs.get(key)?.count ?? 0) + (e.count ?? 1),
    });
  }
  return [...pairs.values()].sort(
    (a, b) => compare(a.from, b.from) || compare(a.to, b.to) || compare(a.kind, b.kind),
  );
}

// The dashed form states the planned half of the same architectural use relation.
export const relationFamily = (e: DiagramEdge): string =>
  `${e.kind === "plans to use" ? "uses" : e.kind}/${e.kind === "plans to use" && e.claim === "declared" ? "anchored" : (e.claim ?? "")}`;
export const needsEdgeLabels = (edges: readonly DiagramEdge[]): boolean =>
  new Set(edges.map(relationFamily)).size > 1;

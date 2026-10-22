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
  readonly source?: { readonly file?: string; readonly line?: number };
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
  readonly textEquivalentHtml?: string;
  readonly textEquivalent?: DiagramInput;
  readonly textRows?: readonly string[];
  readonly note?: string;
  readonly occurrenceKey?: string;
  readonly source?: { readonly text: string; readonly explanation: string };
  readonly sectionId?: string | null;
}
export const layers = ["edge", "application", "domain", "adapter", "infrastructure", "not stated"];
export const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
export const withinBound = (d: DiagramInput): boolean =>
  d.boxes.length <= 40 && d.edges.length <= 100;
// Fold before the hard bound when a picture would become a tall, dense edge bundle.
export const needsFold = (d: DiagramInput): boolean => {
  const bands = new Map<string, number>();
  for (const b of d.boxes) bands.set(b.band ?? "Units", (bands.get(b.band ?? "Units") ?? 0) + 1);
  const estimatedHeight =
    [...bands.values()].reduce((n, size) => n + 200 + Math.ceil(size / 3) * 176, 0) +
    d.edges.length * 16;
  return (
    !withinBound(d) ||
    d.boxes.length > 18 ||
    d.edges.length > 28 ||
    estimatedHeight > 2000 ||
    (d.boxes.length > 6 &&
      d.boxes.some((b) => d.edges.filter((e) => e.from === b.id || e.to === b.id).length > 10))
  );
};

// Keep direction, claim and ordering apart; original relations remain in the text equivalent.
export function combinePairs(edges: readonly DiagramEdge[]): DiagramEdge[] {
  const groups = new Map<string, DiagramEdge[]>();
  for (const edge of edges) {
    const key = JSON.stringify([edge.from, edge.to, edge.claim, edge.orders]);
    groups.set(key, [...(groups.get(key) ?? []), edge]);
  }
  return [...groups.values()].map((group) => {
    const first = group[0];
    if (!first) throw new Error("Empty edge group");
    if (group.length === 1) return first;
    const sameCount = group.every((e) => (e.count ?? 1) === (first.count ?? 1));
    return {
      from: first.from,
      to: first.to,
      ...(first.claim === undefined ? {} : { claim: first.claim }),
      ...(first.orders === undefined ? {} : { orders: first.orders }),
      kind: group
        .map((e) => `${e.kind}${!sameCount && (e.count ?? 1) > 1 ? ` (${String(e.count)})` : ""}`)
        .sort(compare)
        .join(", "),
      ...(sameCount && first.count !== undefined
        ? { count: first.count, countLabel: "per relation" }
        : {}),
      ...(group.every((e) => e.reason === first.reason) && first.reason !== undefined
        ? { reason: first.reason }
        : {}),
    };
  });
}
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

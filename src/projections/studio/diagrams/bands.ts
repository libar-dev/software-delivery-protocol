import { aggregate, compare, withinBound } from "./model.js";
import { needsFold, reducesHeight, foldHeightBudget } from "./layout.js";
import type { Diagram, DiagramBox, DiagramInput } from "./model.js";
const relations = ["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"];
const relationIndex = (kind: string): number => {
  const index = relations.indexOf(kind);
  return index < 0 ? relations.length : index;
};
type Rooted = DiagramInput & Pick<Diagram, "subject" | "sectionId">;
/**
 * @sdpAnchor impl:protocol.studio-relation-diagrams
 * @sdpLabel relation and member bands and bounded relation folds
 * @sdpSatisfies spec:consumers.spec-studio.diagrams
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function traceDiagram(input: Rooted): Diagram {
  const groups = new Map<string, DiagramBox[]>();
  const boxes = [...input.boxes]
    .sort((a, b) => compare(a.id, b.id))
    .map((box) => {
      if (box.id === input.subject) return { ...box, band: "Subject" };
      const edges = input.edges
        .filter((e) => e.from === box.id || e.to === box.id)
        .sort((a, b) => relationIndex(a.kind) - relationIndex(b.kind) || compare(a.kind, b.kind));
      const edge = edges[0];
      const direction = edge?.from === input.subject ? "Outgoing" : "Incoming";
      const band = `${direction} ${edge?.kind ?? "relations"}`;
      const members = groups.get(band) ?? [];
      members.push(box);
      groups.set(band, members);
      return { ...box, band };
    });
  let drawing: Diagram = {
    ...input,
    boxes,
    caption: `Relations of ${input.subject}`,
    heightBudget: foldHeightBudget,
    textEquivalent: input,
  };
  const ids = new Map(boxes.map((b) => [b.id, b.id]));
  const groupOrder = (band: string) =>
    (band.startsWith("Outgoing ") ? 0 : relations.length + 1) +
    relationIndex(band.slice(band.indexOf(" ") + 1));
  const sorted = [...groups].sort(
    ([a, aa], [b, bb]) => bb.length - aa.length || groupOrder(a) - groupOrder(b) || compare(a, b),
  );
  for (const [band, members] of sorted) {
    if (!needsFold(drawing)) break;
    if (members.length < 2) continue;
    const id = `${input.subject}.fold.${band.replaceAll(" ", ".")}`;
    const candidateIds = new Map(ids);
    for (const member of members) candidateIds.set(member.id, id);
    const candidate = {
      ...drawing,
      boxes: [
        ...drawing.boxes.filter((b) => !members.some((m) => m.id === b.id)),
        {
          id,
          words: `${String(members.length)} ${band}, folded`,
          target: "#relations",
          folded: true,
          foldedIds: members.flatMap((m) => m.foldedIds ?? [m.id]),
          band,
        },
      ],
      edges: aggregate(input.edges, candidateIds),
    };
    if (!reducesHeight(drawing, candidate)) continue;
    for (const member of members) ids.set(member.id, id);
    drawing = candidate;
  }
  const order = [
    ...relations.map((r) => `Outgoing ${r}`),
    "Subject",
    ...relations.map((r) => `Incoming ${r}`),
  ];
  return {
    ...drawing,
    boxes: [...drawing.boxes].sort((a, b) => {
      const index = (band: string) => (order.includes(band) ? order.indexOf(band) : order.length);
      return index(a.band ?? "") - index(b.band ?? "") || compare(a.id, b.id);
    }),
  };
}
export function memberDiagram(input: Rooted): Diagram {
  if (!withinBound(input)) return { ...input, caption: `Members of ${input.subject}` };
  const own = new Set(input.boxes.filter((b) => b.band !== "Outside component").map((b) => b.id));
  const depth = new Map<string, number>();
  // Bounded relaxation puts a cycle in one band instead of chasing it forever.
  const reaches = (from: string, to: string, seen = new Set<string>()): boolean => {
    if (from === to) return true;
    if (seen.has(from)) return false;
    seen.add(from);
    return input.edges
      .filter((e) => e.from === from && own.has(e.to))
      .some((e) => reaches(e.to, to, seen));
  };
  for (let i = 0; i < own.size; i++)
    for (const e of input.edges) {
      if (own.has(e.from) && own.has(e.to) && !reaches(e.to, e.from))
        depth.set(e.to, Math.max(depth.get(e.to) ?? 0, (depth.get(e.from) ?? 0) + 1));
    }
  return {
    ...input,
    caption: `Members of ${input.subject}`,
    boxes: input.boxes
      .map((b) => ({
        ...b,
        band: own.has(b.id) ? `Member depth ${String(depth.get(b.id) ?? 0)}` : "Outside component",
      }))
      .sort(
        (a, b) =>
          (own.has(a.id) ? (depth.get(a.id) ?? 0) : Infinity) -
            (own.has(b.id) ? (depth.get(b.id) ?? 0) : Infinity) || compare(a.id, b.id),
      ),
  };
}

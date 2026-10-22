import { plainTitle } from "../pages/code-spans.js";
import type { SliceAnswer, SliceArchitecture } from "../slice-answer.js";
import type { Diagram, DiagramBox, DiagramEdge } from "./model.js";
import { aggregate, combinePairs, needsFold } from "./model.js";
import { architectureDiagrams } from "./architecture.js";
type Target = (id: string) => string;
const rung = (row: { statedReadiness: string | null; floorReached: string | null }) =>
  `stated ${row.statedReadiness ?? "not recorded"}, floor ${row.floorReached ?? "none"}`;
/**
 * @sdpAnchor impl:protocol.studio-slice-dependencies
 * @sdpLabel supplied depth bands with protected boundary boxes and lossless text
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.dependency, spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function dependencyDiagram(
  subject: string,
  answer: SliceAnswer,
  target: Target,
  diagramId = `${subject}.dependencies`,
): Diagram {
  const shown = answer.members.filter((m) => m.exampleOf === null);
  const depths = [...new Set(shown.map((m) => m.depth))].sort((a, b) => b - a);
  const boxes: DiagramBox[] = depths.flatMap((depth) =>
    shown
      .filter((m) => m.depth === depth)
      .map((m) => ({
        id: m.id,
        title: plainTitle(m.title ?? m.id),
        words: `${plainTitle(m.title ?? m.id)}, ${rung(m)}, ${String(m.exampleMembers.length)} example members folded in`,
        detail: `${rung(m)}; ${String(m.exampleMembers.length)} example members folded in`,
        target: target(m.id),
        band: `Depth ${String(depth)}`,
      })),
  );
  const own = new Set(shown.map((m) => m.id));
  const edges: DiagramEdge[] = answer.structure.edges
    .filter((e) => own.has(e.from) && own.has(e.to))
    .map((e) => ({
      from: e.from,
      to: e.to,
      kind: e.type,
      claim: "declared",
      countLabel: "relations",
      orders: e.orders,
      ...(e.reason === undefined ? {} : { reason: e.reason }),
    }));
  const mapping = new Map(boxes.map((b) => [b.id, b.id]));
  const groups = new Map<string, string[]>();
  for (const row of answer.boundary.restsOn) {
    const keep =
      row.holds.length > 0 || row.statedReadiness === "idea" || row.statedReadiness === "scoped";
    if (keep) {
      boxes.push({
        id: row.id,
        title: plainTitle(row.title ?? row.id),
        words: `${plainTitle(row.title ?? row.id)}, ${rung(row)}; holds ${String(row.holds.length)} members`,
        detail: rung(row),
        target: target(row.id),
        band: "Outside this scope",
      });
      mapping.set(row.id, row.id);
    }
    for (const via of row.via) {
      const id = keep ? row.id : `diagram.${diagramId}.outside.${via.type}`;
      if (!keep) {
        const ids = groups.get(via.type) ?? [];
        if (!ids.includes(row.id)) ids.push(row.id);
        groups.set(via.type, ids);
      }
      for (const member of via.members) {
        const reason = via.reasons?.find((r) => r.member === member)?.reason;
        if (own.has(member))
          edges.push({
            from: member,
            to: id,
            kind: via.type,
            countLabel: "relations",
            claim: "declared",
            ...(reason === undefined ? {} : { reason }),
          });
      }
    }
  }
  for (const [type, ids] of groups) {
    const id = `diagram.${diagramId}.outside.${type}`;
    mapping.set(id, id);
    boxes.push({
      id,
      words: `${String(ids.length)} outside Specs, ${type}, folded`,
      title: `${String(ids.length)} outside Specs`,
      detail: `${type}, folded`,
      folded: true,
      hideIdentity: true,
      foldedIds: ids,
      target: "#boundary.restsOn",
      band: "Outside this scope",
    });
  }
  for (const end of answer.structure.unresolved) {
    if (!mapping.has(end.to)) {
      mapping.set(end.to, end.to);
      boxes.push({
        id: end.to,
        title: end.to,
        words: `${end.to}, unresolved`,
        detail: "unresolved",
        target: "",
        band: "Outside this scope",
      });
    }
    if (own.has(end.from))
      edges.push({
        from: end.from,
        to: end.to,
        kind: end.type,
        countLabel: "relations",
        claim: "declared",
        ...(end.reason ? { reason: end.reason } : {}),
      });
  }
  let drawing: Diagram = {
    subject,
    caption: "Declared relations by depth",
    sectionId: null,
    preserveOrder: true,
    mermaidKind: "dependencies",
    boxes,
    edges: combinePairs(aggregate(edges, mapping)),
  };
  for (const depth of [...depths].sort(
    (a, b) =>
      shown.filter((m) => m.depth === b).length - shown.filter((m) => m.depth === a).length ||
      a - b,
  )) {
    if (!needsFold(drawing)) break;
    const members = shown.filter((m) => m.depth === depth),
      id = `diagram.${diagramId}.fold.${String(depth)}`;
    for (const m of members) mapping.set(m.id, id);
    const at = drawing.boxes.findIndex((b) => b.band === `Depth ${String(depth)}`);
    const remaining = drawing.boxes.filter((b) => b.band !== `Depth ${String(depth)}`);
    remaining.splice(at, 0, {
      id,
      elementId: id,
      title: `${String(members.length)} members, folded`,
      words: `${String(members.length)} members at depth ${String(depth)}, folded`,
      target: "#slice.members",
      band: `Depth ${String(depth)}`,
      folded: true,
      hideIdentity: true,
      foldedIds: members.map((m) => m.id),
    });
    drawing = { ...drawing, boxes: remaining, edges: combinePairs(aggregate(edges, mapping)) };
  }
  return {
    ...drawing,
    note: "Depths are structural, never phases, dates or priority. Dashed relations order nothing. The text keeps every member and original relation.",
    textRows: [
      ...answer.members.map(
        (m) =>
          `${m.id}: ${plainTitle(m.title ?? m.id)}, depth ${String(m.depth)}, ${rung(m)}${m.exampleOf ? `; example folded into ${m.exampleOf}` : ""}`,
      ),
      ...answer.boundary.restsOn.map(
        (m) => `Outside this scope: ${m.id}: ${plainTitle(m.title ?? m.id)}, ${rung(m)}`,
      ),
      ...answer.structure.edges.map(
        (e) =>
          `${e.from} ${e.type} ${e.to} · declared${!e.orders ? ", orders nothing" : ""}${e.reason ? ` — ${e.reason}` : ""}`,
      ),
      ...answer.boundary.restsOn.flatMap((row) =>
        row.via.flatMap((via) =>
          via.members.map((member) => {
            const reason = via.reasons?.find((r) => r.member === member)?.reason;
            return `${member} ${via.type} ${row.id} · declared${reason === undefined ? "" : ` — ${reason}`}`;
          }),
        ),
      ),
      ...answer.structure.unresolved.map(
        (e) =>
          `${e.from} ${e.type} ${e.to} · declared, unresolved${e.reason ? ` — ${e.reason}` : ""}`,
      ),
      ...answer.structure.cycles.map(
        (c) => `Cycle: ${c.members.join(", ")}; ${c.cycle.join(" → ")}`,
      ),
    ],
  };
}
const value = (v: unknown): string =>
  v === null || v === undefined
    ? "not stated"
    : Array.isArray(v)
      ? v
          .map((part: unknown) => (typeof part === "string" ? part : JSON.stringify(part)))
          .join(", ")
      : typeof v === "string"
        ? v
        : JSON.stringify(v);
// A realization link makes the relations mixed, so each link carries its own label and the
// legend names every family drawn.
const realizationLegend = (edges: readonly DiagramEdge[]): string =>
  [
    ...(edges.some((e) => e.kind === "uses") ? ["Arrows: uses (anchored)."] : []),
    ...(edges.some((e) => e.kind === "plans to use")
      ? ["Dashed arrows: plans to use (declared)."]
      : []),
    "Labelled links: realizes (anchored), a component paired with the design it satisfies, never a use; it confers no delivery fact.",
  ].join(" ");
/**
 * @sdpAnchor impl:protocol.studio-slice-architecture
 * @sdpLabel selected component grid with distinct planned identities and complete unit edges
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.scoped-architecture, spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function scopedArchitectureDiagrams(
  subject: string,
  a: SliceArchitecture,
  target: Target,
): Diagram[] {
  if (!a.components.length && !a.designs.length) return [];
  const boxes: DiagramBox[] = a.components.map((c) => ({
    id: c.id,
    title: c.label ?? c.id,
    words: `${c.label ?? c.id}, anchored, layer ${c.layer ?? "not stated"}, context ${c.context ?? "not stated"}`,
    target: target(c.id),
    context: c.context,
    layer: c.layer,
  }));
  boxes.push(
    ...a.designs.map((d) => ({
      id: d.spec,
      title: `planned ${d.componentId}`,
      words: `planned ${d.componentId}, declared layer ${d.layer ?? "not stated"}, context ${d.context ?? "not stated"}`,
      target: target(d.spec),
      planned: true,
      context: d.context,
      layer: d.layer,
    })),
  );
  const outsideId = (c: SliceArchitecture["outside"][number]) =>
    `outside.${encodeURIComponent(c.context ?? "")}.${encodeURIComponent(c.layer ?? "")}`;
  const mapping = new Map(boxes.map((b) => [b.id, b.id]));
  for (const c of a.outside) mapping.set(c.id, outsideId(c));
  for (const id of new Set(a.outside.map(outsideId))) {
    const rows = a.outside.filter((c) => outsideId(c) === id),
      c = rows[0];
    if (c === undefined) continue;
    boxes.push({
      id,
      title: `outside scope: ${c.context ?? "not stated"}`,
      words: `outside scope, ${String(rows.length)} components, ${c.layer ?? "not stated"}, folded`,
      target: "#slice.outside",
      context: c.context,
      layer: c.layer,
      folded: true,
      hideIdentity: true,
      foldedIds: rows.map((c) => c.id),
    });
  }
  const edges: DiagramEdge[] = [
    ...a.uses.map((e) => ({
      from: e.from,
      to: e.to,
      kind: "uses",
      claim: "anchored",
      count: e.count,
    })),
    ...a.plannedUses.flatMap((e) => {
      const anchored = mapping.get(e.to);
      const destinations = [
        ...(anchored === undefined ? [] : [anchored]),
        ...a.designs.filter((d) => d.componentId === e.to).map((d) => d.spec),
      ];
      return destinations.map((to) => ({
        from: e.design,
        to,
        kind: "plans to use",
        claim: "declared",
      }));
    }),
    ...a.designs
      .filter((d) => d.realized)
      .map((d) => ({ from: d.componentId, to: d.spec, kind: "realizes", claim: "anchored" })),
  ];
  const original = [
    ...a.components.map(
      (c) =>
        `${c.id}: ${c.label ?? ""}, anchored, layer ${c.layer ?? "not stated"}, context ${c.context ?? "not stated"}; satisfies members ${c.members.satisfies.join(", ") || "none"}; references members ${c.members.references.join(", ") || "none"}; code for rests on ${c.restsOn.join(", ") || "none"}; member designs ${c.designs.join(", ") || "none"}`,
    ),
    ...a.outside.map(
      (c) =>
        `${c.id}: ${c.label ?? ""}, outside scope, ${c.anchored ? "anchored" : "not anchored"}, layer ${c.layer ?? "not stated"}, context ${c.context ?? "not stated"}`,
    ),
    ...a.designs.flatMap((d) => [
      `${d.spec}: planned ${d.componentId}; layer ${value(d.layer)}, context ${value(d.context)}, role ${value(d.role)}, uses ${value(d.uses)}; anchor ${d.realized ? "satisfies the design" : d.anchorExists ? "present, does not satisfy the design" : "absent"}`,
      ...d.differing.map(
        (f) => `${f.field}: declared ${value(f.planned)}; anchored ${value(f.realized)}`,
      ),
      ...d.unreadable.map((u) => `${u.key}: unreadable ${u.value}, not compared`),
    ]),
    ...a.uses.flatMap((e) => e.units.map((u) => `${u.from} uses ${u.to} · ${u.claim}`)),
    ...a.plannedUses.map((e) => `${e.design} plans to use ${e.to} · declared`),
    ...a.unplaced.map(
      (u) =>
        `${u.unit} ${u.via === "satisfies" ? "implements" : "references"} ${u.member}; no component`,
    ),
  ];
  const selected = architectureDiagrams({
    boxes,
    edges: aggregate(edges, new Map([...mapping, ...boxes.map((b) => [b.id, b.id] as const)])),
  });
  const sectionIds = new Map(
    selected.drawings.map((d, i) => [
      d.subject,
      i === 0
        ? "slice.architecture"
        : `diagram.${subject}.architecture.${encodeURIComponent(d.subject)}`,
    ]),
  );
  return selected.drawings.map((d, i) => ({
    ...d,
    subject,
    sectionId:
      i === 0
        ? null
        : (sectionIds.get(d.subject) ??
          `diagram.${subject}.architecture.${encodeURIComponent(d.subject)}`),
    ...(i === 0 ? {} : { occurrenceKey: d.subject }),
    boxes: d.boxes.map((b) => ({
      ...b,
      target: b.target.startsWith("#context.")
        ? `#${sectionIds.get(b.target.slice(1)) ?? "slice.outside"}`
        : b.target,
    })),
    caption: i === 0 ? "Anchored components and member designs" : d.caption,
    ...(d.edges.some((e) => e.kind === "realizes") ? { legend: realizationLegend(d.edges) } : {}),
    textRows: original,
    ...(selected.fold === "nothing" && !a.outside.length && !a.designs.length
      ? { mermaidKind: "block" as const }
      : {}),
  }));
}

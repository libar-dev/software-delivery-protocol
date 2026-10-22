import { plainTitle } from "../pages/code-spans.js";
import type { Diagram, DiagramBox, DiagramEdge } from "./model.js";
import { needsFold, compare } from "./model.js";
import { escape, code } from "../pages/html.js";

export interface CapabilityNode {
  readonly id: string;
  readonly title: string | null;
  readonly specKind: string;
  readonly altitude: string;
  readonly statedReadiness: string;
  readonly floorReached: string;
  readonly deliveryFacts: readonly string[];
  readonly questions: readonly {
    index: number;
    address: string | null;
    question: string;
    blocking: boolean;
  }[];
  readonly parents: readonly string[];
  readonly children: readonly string[];
  readonly epicIds: readonly string[];
}
export interface CapabilityCounts {
  readonly specs: number;
  readonly byKind: Readonly<Record<string, number>>;
  readonly byAltitude: Readonly<Record<string, number>>;
  readonly byStatedReadiness: Readonly<Record<string, number>>;
  readonly byFloorReached: Readonly<Record<string, number>>;
  readonly withImplementationBinding: number;
  readonly withVerifierBinding: number;
  readonly openQuestions: number;
  readonly blockingQuestions: number;
}
export interface CapabilityMap {
  readonly nodes: readonly CapabilityNode[];
  readonly edges: readonly { from: string; to: string; claim: string; reason: string | null }[];
  readonly epics: readonly {
    id: string;
    title: string | null;
    parentEpicIds: readonly string[];
    descendantIds: readonly string[];
    rollup: CapabilityCounts;
  }[];
  readonly unreached: { ids: readonly string[]; roots: readonly string[] };
  readonly cycles: readonly { members: readonly string[] }[];
  readonly damage: readonly { code: string; from: string; to: string }[];
}
export interface CapabilityVisit {
  readonly node: CapabilityNode;
  readonly parent: string | null;
  readonly depth: number;
  readonly repeat: boolean;
  readonly cycle: boolean;
}

// Placement is a finite traversal of the recipe's ordered adjacency, not a second reach calculation.
export function capabilityWalk(
  map: CapabilityMap,
  roots: readonly string[],
  scope?: ReadonlySet<string>,
): CapabilityVisit[] {
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const active = new Set<string>();
  const result: CapabilityVisit[] = [];
  const stack = roots
    .slice()
    .reverse()
    .map((id) => ({ id, parent: null as string | null, depth: 0, exit: false }));
  while (stack.length) {
    const next = stack.pop();
    if (!next) break;
    if (next.exit) {
      active.delete(next.id);
      continue;
    }
    const node = nodes.get(next.id);
    if (!node || (scope && !scope.has(node.id))) continue;
    const repeat = seen.has(next.id);
    result.push({
      node,
      parent: next.parent,
      depth: next.depth,
      repeat,
      cycle: active.has(next.id),
    });
    if (repeat) continue;
    seen.add(next.id);
    active.add(next.id);
    stack.push({ ...next, exit: true });
    for (const id of node.children.slice().reverse())
      stack.push({ id, parent: node.id, depth: next.depth + 1, exit: false });
  }
  return result;
}
export const capabilityBranchId = (subject: string, id: string): string =>
  `diagram.${subject}.capability.branch.${encodeURIComponent(id)}`;

/**
 * @sdpAnchor impl:protocol.studio-capability-diagrams
 * @sdpLabel places refinement occurrences and bounded branches from the capability map
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.capability-tree, spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function capabilityDiagrams(
  map: CapabilityMap,
  roots: readonly string[],
  subject: string,
  target: (id: string) => string = (id) =>
    `#${encodeURIComponent(capabilityBranchId(subject, id))}`,
): readonly [Diagram] {
  const walk = capabilityWalk(
    map,
    roots,
    subject === "unreached" ? new Set(map.unreached.ids) : undefined,
  );
  const cycleOf = new Map(
    map.cycles.flatMap((c) => c.members.map((id) => [id, c.members] as const)),
  );
  let boxes: DiagramBox[] = [];
  let edges: DiagramEdge[] = [];
  const first = new Map<string, string>();
  const parentOccurrences = new Map<string, string>();
  const cyclePlaced = new Set<readonly string[]>();
  const depths = new Map<string, number>();
  const rootOrder = new Map<string, number>();
  let rootIndex = -1;
  for (const [i, v] of walk.entries()) {
    if (v.parent === null) rootIndex++;
    const cycle = cycleOf.get(v.node.id);
    if (cycle && cyclePlaced.has(cycle) && (!v.repeat || v.cycle)) {
      const representative = cycle[0];
      const group =
        representative === undefined ? undefined : parentOccurrences.get(representative);
      if (group === undefined) throw new Error("A placed cycle has no occurrence");
      parentOccurrences.set(v.node.id, group);
      const parent = v.parent === null ? undefined : parentOccurrences.get(v.parent);
      if (parent && parent !== group)
        edges.push({ from: group, to: parent, kind: "refines", claim: "declared" });
      continue;
    }
    const id = `${capabilityBranchId(subject, v.node.id)}${v.repeat ? `.repeat.${String(i)}` : ""}`;
    const parent = v.parent === null ? undefined : parentOccurrences.get(v.parent);
    const placedDepth = parent === undefined ? 0 : (depths.get(parent) ?? 0) + 1;
    const placementParent = boxes.find((b) => b.id === parent)?.identity ?? v.parent;
    const firstId = first.get(v.node.id);
    const members = cycle ?? [v.node.id];
    boxes.push({
      id,
      identity: v.node.id,
      words: `${plainTitle(v.node.title ?? v.node.id)} · ${v.node.altitude}${cycle ? ` · cycle · ${String(cycle.length)} unique Specs` : ""}${v.repeat ? " · repeat" : ""}`,
      title: plainTitle(v.node.title ?? v.node.id),
      detail: `${v.node.altitude}${cycle ? ` · cycle · ${String(cycle.length)} unique Specs` : ""}${v.repeat ? " · repeat" : ""}`,
      target: v.repeat
        ? `#${encodeURIComponent(firstId ?? capabilityBranchId(subject, v.node.id))}`
        : target(v.node.id),
      band:
        placedDepth === 0
          ? subject === "unreached"
            ? "Unreached roots"
            : "Roots"
          : `Depth ${String(placedDepth)} · Children of ${placementParent ?? ""}`,
      ...(cycle ? { foldedIds: members, cycleIds: members } : {}),
      ...(parent ? { parent } : {}),
    });
    depths.set(id, placedDepth);
    rootOrder.set(id, rootIndex);
    if (parent && parent !== id)
      edges.push({ from: id, to: parent, kind: "refines", claim: "declared" });
    if (!v.repeat) {
      first.set(v.node.id, id);
      parentOccurrences.set(v.node.id, id);
      if (cycle) {
        cyclePlaced.add(cycle);
        for (const member of cycle) {
          first.set(member, id);
          parentOccurrences.set(member, id);
        }
      }
    }
  }
  // Replace the largest proper branch first. Roots and their relationship to a remainder survive.
  const fold = (parent: DiagramBox, removed: readonly DiagramBox[]) => {
    const ids = new Set(removed.map((b) => b.id));
    const memberIds = [...new Set(removed.flatMap((b) => b.foldedIds ?? [b.identity ?? b.id]))];
    const id = `${parent.id}.folded`;
    const remainder: DiagramBox = {
      id,
      identity: `branch of ${parent.identity ?? parent.id}`,
      words: `folded · ${String(memberIds.length)} unique Specs`,
      title: `Folded branch`,
      detail: `${String(memberIds.length)} unique Specs`,
      folded: true,
      foldedIds: memberIds,
      target: `#${encodeURIComponent(parent.id)}`,
      parent: parent.id,
      band: `Depth ${String((depths.get(parent.id) ?? 0) + 1)} · Children of ${parent.identity ?? parent.id}`,
    };
    const at = boxes.findIndex((b) => ids.has(b.id));
    boxes = boxes.flatMap((b, i) => (i === at ? [remainder] : ids.has(b.id) ? [] : [b]));
    edges = edges.filter((e) => !ids.has(e.from) && !ids.has(e.to));
    edges.push({ from: id, to: parent.id, kind: "refines", claim: "declared" });
    depths.set(id, (depths.get(parent.id) ?? 0) + 1);
    rootOrder.set(id, rootOrder.get(parent.id) ?? 0);
  };
  const descendants = (parent: DiagramBox): DiagramBox[] => {
    const ids = new Set([parent.id]);
    return boxes.filter((b) => {
      if (!b.parent || !ids.has(b.parent)) return false;
      ids.add(b.id);
      return true;
    });
  };
  while (needsFold({ boxes, edges })) {
    const branches = boxes
      .filter((b) => b.parent && !b.folded)
      .map((parent) => ({ parent, removed: descendants(parent) }))
      .filter((b) => b.removed.length > 1)
      .sort(
        (a, b) =>
          b.removed.length - a.removed.length ||
          (rootOrder.get(a.parent.id) ?? 0) - (rootOrder.get(b.parent.id) ?? 0) ||
          compare(a.parent.identity ?? a.parent.id, b.parent.identity ?? b.parent.id),
      );
    if (branches[0]) {
      fold(branches[0].parent, branches[0].removed);
      continue;
    }
    const siblings = boxes
      .map((parent) => ({ parent, children: boxes.filter((b) => b.parent === parent.id) }))
      .filter((g) => g.children.length > 1)
      .sort(
        (a, b) =>
          b.children.length - a.children.length ||
          boxes.indexOf(a.parent) - boxes.indexOf(b.parent),
      );
    const group = siblings[0];
    if (!group) break;
    const removed = new Set<DiagramBox>();
    for (const sibling of group.children.slice().reverse()) {
      removed.add(sibling);
      for (const child of descendants(sibling)) removed.add(child);
      if (removed.size >= Math.max(2, boxes.length - 39)) break;
    }
    fold(
      group.parent,
      boxes.filter((b) => removed.has(b)),
    );
  }
  const placementOrder = new Map(boxes.map((b, i) => [b.id, i]));
  boxes.sort(
    (a, b) =>
      (depths.get(a.id) ?? 0) - (depths.get(b.id) ?? 0) ||
      (placementOrder.get(a.parent ?? a.id) ?? 0) - (placementOrder.get(b.parent ?? b.id) ?? 0) ||
      (placementOrder.get(a.id) ?? 0) - (placementOrder.get(b.id) ?? 0),
  );
  const strict =
    roots.length === 1 &&
    !walk.some((v) => v.repeat) &&
    !walk.some((v) => cycleOf.has(v.node.id)) &&
    subject !== "unreached" &&
    !boxes.some((b) => b.folded);
  const identities = new Set(walk.map((v) => v.node.id));
  const fallbackReasons = [
    ...(roots.length !== 1 ? ["multiple roots"] : []),
    ...(walk.some((v) => v.repeat && !v.cycle) ? ["repeated parentage"] : []),
    ...(walk.some((v) => cycleOf.has(v.node.id)) ? ["a cycle"] : []),
    ...(subject === "unreached" ? ["an unreached band"] : []),
    ...(boxes.some((b) => b.folded) ? ["a fold"] : []),
  ];
  const complete = `<p>${String(identities.size)} unique Specs; ${String(boxes.length)} rendered boxes.</p><ul>${walk.map((v) => `<li>${code(v.node.id)}: ${escape(v.node.title)} · ${escape(v.node.altitude)}${v.repeat ? ` · ${v.cycle ? "cyclic link" : "repeat"}` : ""}</li>`).join("")}${map.edges
    .filter((e) => identities.has(e.from) && identities.has(e.to))
    .map(
      (e) =>
        `<li>${code(e.from)} refines ${code(e.to)} · declared${e.reason ? ` — ${escape(e.reason)}` : ""}</li>`,
    )
    .join("")}${map.cycles
    .filter((c) => c.members.some((id) => identities.has(id)))
    .map((c) => `<li>cycle: ${c.members.map(code).join(", ")}</li>`)
    .join(
      "",
    )}${subject === "unreached" ? `<li>Unreached ids: ${map.unreached.ids.map(code).join(", ")}</li>` : ""}</ul>`;
  return [
    {
      subject,
      sectionId: null,
      caption: "Refinement · parent to child reading order",
      boxes,
      edges,
      boxOrder: "supplied",
      mermaidKind: strict ? "mindmap" : "flowchart BT",
      mermaidExplanation: `Preferred syntax: mindmap. Chosen syntax: ${strict ? "mindmap" : `flowchart BT because the drawing has ${fallbackReasons.join(", ")}`}.`,
      mermaidNotes: map.edges
        .filter(
          (e) =>
            identities.has(e.from) &&
            identities.has(e.to) &&
            (cycleOf.has(e.from) || cycleOf.has(e.to)),
        )
        .map((e) => `${e.from} refines ${e.to} · ${e.claim}${e.reason ? ` — ${e.reason}` : ""}`),
      legend:
        "Arrows: refines (declared). Later visits repeat a Spec and link to its first occurrence.",
      textEquivalentHtml: complete,
    },
  ];
}

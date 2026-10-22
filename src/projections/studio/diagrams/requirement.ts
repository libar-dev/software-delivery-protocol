import { aggregate, compare, withinBound } from "./model.js";
import type { Diagram, DiagramBox, DiagramInput } from "./model.js";
import { mermaidSource, mermaidText } from "./mermaid.js";
const bandOrder = [
  "Intended Specs",
  "Declared verifying examples",
  "Satisfying or referencing units",
  "Test or oracle bindings",
];
/**
 * @sdpAnchor impl:protocol.studio-requirement-diagram
 * @sdpLabel folds requirement bindings by relation direction and claim and serializes exact relations
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.requirement-trace
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function requirementDiagram(input: DiagramInput & { subject: string }): Diagram {
  const order = (boxes: readonly DiagramBox[]) =>
    [...boxes].sort(
      (a, b) =>
        bandOrder.indexOf(a.band ?? "") - bandOrder.indexOf(b.band ?? "") || compare(a.id, b.id),
    );
  let drawing: Diagram = {
    ...input,
    boxes: order(input.boxes),
    sectionId: null,
    caption: `Requirement drawing for ${input.subject}`,
    textEquivalent: input,
  };
  const ids = new Map(input.boxes.map((b) => [b.id, b.id]));
  const protectedIds = new Set([input.subject]);
  // A peripheral box has one fold group, even when several bindings reach it.
  const groups = new Map<string, DiagramBox[]>();
  for (const box of input.boxes.filter((b) => !protectedIds.has(b.id))) {
    const edge = input.edges
      .filter((e) => e.from === box.id || e.to === box.id)
      .sort((a, b) =>
        compare(
          `${a.kind}.${a.from === box.id ? "incoming" : "outgoing"}.${a.claim ?? ""}`,
          `${b.kind}.${b.from === box.id ? "incoming" : "outgoing"}.${b.claim ?? ""}`,
        ),
      )[0];
    const key = edge
      ? `${edge.kind}.${edge.from === box.id ? "incoming" : "outgoing"}.${edge.claim ?? ""}`
      : `unbound.incoming.declared`;
    groups.set(key, [...(groups.get(key) ?? []), box]);
  }
  for (const [key, members] of [...groups].sort(
    ([a, aa], [b, bb]) => bb.length - aa.length || compare(a, b),
  )) {
    if (withinBound(drawing)) break;
    const id = `diagram.${input.subject}.requirement.fold.${key}`;
    for (const b of members) ids.set(b.id, id);
    drawing = {
      ...drawing,
      boxes: order([
        ...drawing.boxes.filter((b) => !members.some((m) => m.id === b.id)),
        {
          id,
          title: `${String(members.length)} bindings`,
          words: `${String(members.length)} ${key}, folded`,
          target: `#diagram.${input.subject}.requirement.text`,
          folded: true,
          foldedIds: members.map((m) => m.id),
          band: members[0]?.band ?? bandOrder[3],
        },
      ]),
      edges: aggregate(input.edges, ids),
    };
  }
  const unsupported = [
    ...new Set(
      drawing.edges
        .filter((e) => !["refines", "satisfies", "verifies"].includes(e.kind))
        .map((e) => e.kind),
    ),
  ].sort(compare);
  const folded = drawing.boxes.some((b) => b.folded);
  const fallback = unsupported.length > 0 || folded;
  const aliases = new Map(drawing.boxes.map((b, i) => [b.id, `n${String(i)}`]));
  const source = fallback
    ? mermaidSource(drawing)
    : [
        "requirementDiagram",
        ...drawing.boxes.map(
          (b) =>
            `  ${b.id.startsWith("spec:") ? "requirement" : "element"} ${aliases.get(b.id) ?? ""} {\n    ${b.id.startsWith("spec:") ? "text" : "type"}: "${mermaidText(`${b.words} · ${b.id}`)}"\n  }`,
        ),
        ...drawing.edges.flatMap((e) => [
          `  %% claim: ${mermaidText(e.claim ?? "")}${e.reason ? `; reason: ${mermaidText(e.reason)}` : ""}`,
          `  ${aliases.get(e.from) ?? ""} - ${e.kind} -> ${aliases.get(e.to) ?? ""}`,
        ]),
      ].join("\n");
  return {
    ...drawing,
    source: {
      text: source,
      explanation: fallback
        ? `Preferred syntax: requirementDiagram. Chosen syntax: flowchart TB because ${[...unsupported, ...(folded ? ["folds"] : [])].join(", ")} require exact labels unavailable in requirement syntax.`
        : "Preferred and chosen syntax: requirementDiagram; exact refines, satisfies and verifies, with claim words in nodes and per-edge comments.",
    },
  };
}

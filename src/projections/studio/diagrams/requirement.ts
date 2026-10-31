import { aggregate, compare, combinePairs } from "./model.js";
import { needsFold, reducesHeight, foldHeightBudget } from "./layout.js";
import type { Diagram, DiagramBox, DiagramInput } from "./model.js";
import { mermaidSource, mermaidText } from "./mermaid.js";
const bandOrder = [
  "Intended Specs",
  "Declared verifying examples",
  "Satisfying or referencing units",
  "Test or oracle bindings",
  "Outside the selected set",
];
/**
 * @sdpAnchor impl:protocol.studio-requirement-diagram
 * @sdpLabel folds requirement bindings by relation direction and claim and serializes exact relations
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.requirement-trace, spec:consumers.spec-studio.diagram-kinds
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
    edges: combinePairs(input.edges),
    heightBudget: foldHeightBudget,
  };
  const ids = new Map(input.boxes.map((b) => [b.id, b.id]));
  const examples = input.boxes.filter(
    (b) => b.id !== input.subject && b.band === "Declared verifying examples",
  );
  if (examples.length > 4) {
    const exampleIds = new Set(examples.map((b) => b.id));
    const tests = input.boxes.filter(
      (b) =>
        b.band === "Test or oracle bindings" &&
        input.edges.some(
          (e) =>
            e.from === b.id &&
            exampleIds.has(e.to) &&
            e.kind === "verifies" &&
            e.claim === "anchored",
        ) &&
        input.edges.every((e) => e.from !== b.id || exampleIds.has(e.to)),
    );
    const members = [...examples, ...tests];
    const id = `diagram.${input.subject}.requirement.fold.verifies.incoming.declared`;
    const candidateIds = new Map(ids);
    for (const b of members) candidateIds.set(b.id, id);
    const candidate = {
      ...drawing,
      boxes: order([
        ...drawing.boxes.filter((b) => candidateIds.get(b.id) === b.id),
        {
          id,
          title: `${String(examples.length)} verifying examples · declared`,
          words: `${String(examples.length)} verifying examples · declared; ${String(tests.length)} test bindings · anchored, folded`,
          detail: `${String(tests.length)} test bindings · anchored · folded`,
          hideIdentity: true,
          folded: true,
          foldedIds: members.map((b) => b.id),
          target: `#diagram.${input.subject}.requirement.text`,
          band: "Declared verifying examples",
        },
      ]),
      edges: combinePairs(aggregate(input.edges, candidateIds)),
    };
    if (reducesHeight(drawing, candidate)) {
      for (const b of members) ids.set(b.id, id);
      drawing = candidate;
    }
  }
  const protectedIds = new Set([input.subject]);
  // A peripheral box has one fold group, even when several bindings reach it.
  const groups = new Map<string, DiagramBox[]>();
  for (const box of input.boxes.filter((b) => !protectedIds.has(b.id) && ids.get(b.id) === b.id)) {
    const edge = input.edges
      .filter((e) => e.from === box.id || e.to === box.id)
      .sort((a, b) =>
        compare(
          `${a.kind}.${a.from === box.id ? "incoming" : "outgoing"}.${a.claim ?? ""}`,
          `${b.kind}.${b.from === box.id ? "incoming" : "outgoing"}.${b.claim ?? ""}`,
        ),
      )[0];
    const key = edge
      ? `${box.band === "Declared verifying examples" ? "verifies" : edge.kind}.${edge.from === box.id ? "incoming" : "outgoing"}.${edge.claim ?? ""}`
      : `unbound.incoming.declared`;
    const groupKey = `${key}|${box.band ?? ""}`;
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), box]);
  }
  for (const [groupKey, members] of [...groups].sort(
    ([a, aa], [b, bb]) =>
      bb.length - aa.length ||
      compare(a.split("|")[0] ?? "", b.split("|")[0] ?? "") ||
      bandOrder.indexOf(aa[0]?.band ?? "") - bandOrder.indexOf(bb[0]?.band ?? ""),
  )) {
    if (!needsFold(drawing)) break;
    if (members.length < 2) continue;
    const [key = ""] = groupKey.split("|");
    const [kind, direction, claim] = key.split(".");
    const names: Record<string, readonly [string, string]> = {
      refines: ["refining Specs", "refined Specs"],
      verifies: [
        members[0]?.band === "Declared verifying examples" ? "verifying examples" : "test bindings",
        "verified Specs",
      ],
      satisfies: ["satisfying units", "satisfied Specs"],
      references: ["referencing units", "referenced Specs"],
      models: ["oracle bindings", "modeled Specs"],
      unbound: ["unbound units", "unbound Specs"],
    };
    const title = `${String(members.length)} ${names[kind ?? ""]?.[direction === "incoming" ? 0 : 1] ?? kind ?? "related units"} · ${claim ?? ""}`;
    const splitBands = [...groups.keys()].filter((k) => k.startsWith(`${key}|`)).length > 1;
    const id = `diagram.${input.subject}.requirement.fold.${key}${splitBands ? `.band.${String(bandOrder.indexOf(members[0]?.band ?? ""))}` : ""}`;
    const candidateIds = new Map(ids);
    for (const b of members) candidateIds.set(b.id, id);
    const candidate = {
      ...drawing,
      boxes: order([
        ...drawing.boxes.filter((b) => !members.some((m) => m.id === b.id)),
        {
          id,
          title,
          hideIdentity: true,
          words: `${title}, folded`,
          target: `#diagram.${input.subject}.requirement.text`,
          folded: true,
          foldedIds: members.map((m) => m.id),
          band: members[0]?.band ?? bandOrder[3],
        },
      ]),
      edges: combinePairs(aggregate(input.edges, candidateIds)),
    };
    if (!reducesHeight(drawing, candidate)) continue;
    for (const b of members) ids.set(b.id, id);
    drawing = candidate;
  }
  // Pair labels belong to the SVG; requirement syntax keeps each exact relation.
  const exactEdges = aggregate(input.edges, ids);
  const unsupported = [
    ...new Set(
      exactEdges
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
        ...exactEdges.flatMap((e) => [
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

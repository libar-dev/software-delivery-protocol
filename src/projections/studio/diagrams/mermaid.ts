import type { Diagram } from "./model.js";
import { layoutDiagram } from "./layout.js";
import { edgeWords } from "./routing.js";
export const mermaidText = (value: string): string =>
  value
    .replace(/#/gu, "#35;")
    .replace(/%/gu, "#37;")
    .replace(/"/gu, "#quot;")
    .replace(/</gu, "#lt;")
    .replace(/>/gu, "#gt;")
    .replace(/[\r\n\u2028\u2029]/gu, " ");
/**
 * @sdpAnchor impl:protocol.studio-diagram-source
 * @sdpLabel escaped Mermaid flowchart and mindmap source in placed box order
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.mermaid-source, spec:consumers.spec-studio.diagram-kinds.capability-tree
 * @sdpReferences spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function mermaidSource(d: Diagram): string {
  const displayed = layoutDiagram(d).boxes.map((p) => p.box);
  const aliases = new Map(displayed.map((b, i) => [b.id, `n${String(i)}`]));
  if (d.mermaidKind === "mindmap") {
    const lines = ["mindmap"];
    const append = (id: string, depth: number): void => {
      const box = d.boxes.find((b) => b.id === id);
      if (!box) throw new Error(`Missing tree box: ${id}`);
      lines.push(
        `${"  ".repeat(depth + 1)}${aliases.get(id) ?? ""}["${mermaidText(`${box.words} · ${box.identity ?? box.id}`)}"]`,
      );
      for (const child of d.boxes.filter((b) => b.parent === id)) append(child.id, depth + 1);
    };
    for (const root of d.boxes.filter((b) => !b.parent)) append(root.id, 0);
    return lines.join("\n");
  }
  return [
    d.mermaidKind === "dependencies"
      ? "flowchart TB"
      : d.mermaidKind === "block"
        ? "block-beta\n  columns 1"
        : (d.mermaidKind ?? "flowchart TB"),
    ...(d.mermaidKind === "dependencies"
      ? [...new Set(displayed.map((b) => b.band))].flatMap((band, i) => [
          `  subgraph depth${String(i)}["${mermaidText(band ?? "Units")}"]`,
          ...displayed
            .filter((b) => b.band === band)
            .map(
              (b) =>
                `    ${aliases.get(b.id) ?? ""}["${mermaidText(b.hideIdentity ? b.words : `${b.words} · ${b.identity ?? b.id}`)}"]`,
            ),
          "  end",
        ])
      : []),
    ...displayed.flatMap((b) => [
      ...(d.mermaidKind === "dependencies"
        ? []
        : [
            `  ${aliases.get(b.id) ?? ""}["${mermaidText(b.hideIdentity ? b.words : `${b.words} · ${b.identity ?? b.id}`)}"]`,
          ]),
      ...(b.folded
        ? [`  %% folded ${mermaidText(b.id)}: ${(b.foldedIds ?? []).map(mermaidText).join(", ")}`]
        : []),
      ...(b.cycleIds
        ? [`  %% cycle ${mermaidText(b.id)}: ${b.cycleIds.map(mermaidText).join(", ")}`]
        : []),
    ]),
    ...d.edges.flatMap((e) => [
      ...(d.mermaidKind === "block" ? [`  %% ${mermaidText(edgeWords(e))}`] : []),
      `  ${aliases.get(e.from) ?? ""} ${e.kind === "plans to use" || e.orders === false ? "-.->" : "-->"}${d.mermaidKind === "block" ? "" : `|"${mermaidText(edgeWords(e))}"|`} ${aliases.get(e.to) ?? ""}`,
      ...(e.count === undefined
        ? []
        : [`  %% count: ${String(e.count)}; ${mermaidText(e.from)} to ${mermaidText(e.to)}`]),
    ]),
    ...(d.mermaidNotes ?? []).map((note) => `  %% ${mermaidText(note)}`),
  ].join("\n");
}

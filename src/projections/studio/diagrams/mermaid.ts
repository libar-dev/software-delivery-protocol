import type { Diagram } from "./model.js";
import { edgeWords } from "./routing.js";
export const mermaidText = (value: string): string =>
  value
    .replace(/#/gu, "#35;")
    .replace(/"/gu, "#quot;")
    .replace(/</gu, "#lt;")
    .replace(/>/gu, "#gt;")
    .replace(/[\r\n\u2028\u2029]/gu, " ");
/**
 * @sdpAnchor impl:protocol.studio-diagram-source
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.mermaid-source
 * @sdpReferences spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function mermaidSource(d: Diagram): string {
  const aliases = new Map(d.boxes.map((b, i) => [b.id, `n${String(i)}`]));
  return [
    "flowchart TB",
    ...d.boxes.flatMap((b) => [
      `  ${aliases.get(b.id) ?? ""}["${mermaidText(`${b.words} · ${b.id}`)}"]`,
      ...(b.folded
        ? [`  %% folded ${mermaidText(b.id)}: ${(b.foldedIds ?? []).map(mermaidText).join(", ")}`]
        : []),
    ]),
    ...d.edges.flatMap((e) => [
      `  ${aliases.get(e.from) ?? ""} -->|"${mermaidText(edgeWords(e))}"| ${aliases.get(e.to) ?? ""}`,
      ...(e.count === undefined
        ? []
        : [`  %% count: ${String(e.count)}; ${mermaidText(e.from)} to ${mermaidText(e.to)}`]),
    ]),
  ].join("\n");
}

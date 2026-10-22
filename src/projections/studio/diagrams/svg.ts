import { escape, sourceCode, copy, location } from "../pages/html.js";
import { contextOf, layerOf, withinBound, needsEdgeLabels } from "./model.js";
import type { Diagram, DiagramBox } from "./model.js";
import { layoutDiagram, foldedBand, widthBudget } from "./layout.js";
import type { Layout, Positioned } from "./layout.js";
import { routeDiagram, edgeOrder, edgeWords } from "./routing.js";
import type { Routed } from "./routing.js";
import { mermaidSource } from "./mermaid.js";
export { labelLines } from "./layout.js";
function svg(d: Diagram, textId: string, diagramId: string, l: Layout, routed: Routed): string {
  const marker = `diagram.${diagramId}.arrow`;
  const edges = routed.routes
    .map(
      (r) =>
        `<g class="edge" data-from="${escape(r.edge.from)}" data-to="${escape(r.edge.to)}" data-kind="${escape(r.edge.kind)}"${r.edge.claim ? ` data-claim="${escape(r.edge.claim)}"` : ""}${r.label?.text === r.key ? ` data-edge-key="${r.key}"` : ""}><path d="${r.points.map((p, i) => `${i === 0 ? "M" : "L"} ${String(p.x)} ${String(p.y)}`).join(" ")}" fill="none"${r.edge.kind === "plans to use" ? ' stroke-dasharray="6 4"' : ""} marker-end="url(#${escape(marker)})"/>${r.label ? `<text x="${String(r.label.x)}" y="${String(r.label.y + 12)}">${escape(r.label.text)}</text>` : ""}</g>`,
    )
    .join("");
  const node = (p: Positioned) =>
    `<g class="node" data-id="${escape(p.box.id)}"${p.box.planned ? ' data-planned="true"' : ""}${p.box.folded ? ' data-folded="true"' : ""}><a href="${escape(p.box.target)}"><title>${escape(p.box.id)}</title><rect x="${String(p.x)}" y="${String(p.y)}" width="${String(p.width)}" height="${String(p.height)}" rx="4"${p.box.planned ? ' stroke-dasharray="6 4"' : ""}/><text x="${String(p.x + 12)}" y="${String(p.y + 24)}">${[...p.title.map((text) => ({ text, cls: "box-title" })), ...p.identity.map((text) => ({ text, cls: "box-id" })), ...p.detail.map((text) => ({ text, cls: "box-detail" }))].map((line, i) => `<tspan class="${line.cls}" x="${String(p.x + 12)}" dy="${String(i === 0 ? 0 : 18)}" textLength="${String(Array.from(line.text).length * 8)}" lengthAdjust="spacingAndGlyphs">${escape(line.text)}</tspan>`).join("")}</text></a></g>`;
  const groups = d.grid
    ? l.labels
        .filter((label) => label.kind === "lane")
        .map(
          (lane) =>
            `<g class="lane" data-label="${escape(lane.label)}"><text x="${String(lane.x)}" y="${String(lane.y)}">${lane.lines.map((line, i) => `<tspan x="${String(lane.x)}" dy="${String(i === 0 ? 14 : 18)}">${escape(line)}</tspan>`).join("")}</text>${l.labels
              .filter(
                (b) =>
                  b.kind === "band" &&
                  b.x === lane.x &&
                  b.label !== "Other contexts" &&
                  b.label !== "Other layers",
              )
              .map(
                (band) =>
                  `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${band.lines.map((line, i) => `<tspan x="${String(band.x)}" dy="${String(i === 0 ? 14 : 18)}">${escape(line)}</tspan>`).join("")}</text>${l.boxes
                    .filter(
                      (p) =>
                        !foldedBand(p.box) &&
                        contextOf(p.box) === lane.label &&
                        layerOf(p.box) === band.label,
                    )
                    .map(node)
                    .join("")}</g>`,
              )
              .join("")}</g>`,
        )
        .join("") +
      l.labels
        .filter(
          (label) =>
            label.kind === "band" &&
            (label.label === "Other layers" || label.label === "Other contexts"),
        )
        .map(
          (band) =>
            `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${band.lines.map((line, i) => `<tspan x="${String(band.x)}" dy="${String(i === 0 ? 14 : 18)}">${escape(line)}</tspan>`).join("")}</text>${l.boxes
              .filter((p) => foldedBand(p.box) && p.box.band === band.label)
              .map(node)
              .join("")}</g>`,
        )
        .join("")
    : l.labels
        .map(
          (band) =>
            `<g class="band" data-label="${escape(band.label)}"><text x="${String(band.x)}" y="${String(band.y)}">${band.lines.map((line, i) => `<tspan x="${String(band.x)}" dy="${String(i === 0 ? 14 : 18)}">${escape(line)}</tspan>`).join("")}</text>${l.boxes
              .filter((p) => (p.box.band ?? "Units") === band.label)
              .map(node)
              .join("")}</g>`,
        )
        .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby="${escape(textId)}" viewBox="0 0 ${String(routed.width)} ${String(routed.height)}" width="${String(routed.width)}" height="${String(routed.height)}"><title>${escape(d.caption)}</title><defs><marker id="${escape(marker)}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${edges}${groups}</svg>`;
}
/**
 * @sdpAnchor impl:protocol.studio-diagrams
 * @sdpLabel deterministic grid and band layouts with bounded folds and full text equivalents
 * @sdpSatisfies spec:consumers.spec-studio.diagrams, spec:consumers.spec-studio.diagram-kinds.edge-routing, spec:consumers.spec-studio.diagram-kinds.legibility, spec:consumers.spec-studio.diagram-kinds.mermaid-source
 * @sdpReferences spec:decisions.studio-diagram-renderer, spec:decisions.studio-build-renders, spec:consumers.spec-studio.diagram-kinds
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 * @sdpUses impl:protocol.studio-diagram-model
 */
export function renderDiagram(d: Diagram, diagramId = d.subject): string {
  const textId = `diagram.${diagramId}.text`,
    fits = withinBound(d);
  const words = (b: DiagramBox) =>
    `${b.words}${b.planned && !b.words.includes("planned") ? ", planned" : ""}${b.folded && !b.words.includes("folded") ? ", folded" : ""}`;
  const normalized = {
    ...d,
    boxes: d.boxes.map((b) => ({ ...b, words: words(b) })),
    edges: [...d.edges].sort(edgeOrder),
  };
  const l = fits ? layoutDiagram(normalized) : null,
    routed = l ? routeDiagram(l, normalized.edges) : null;
  const equivalent = d.textEquivalent ?? normalized;
  const edgeLabels = new Map(equivalent.boxes.map((b) => [b.id, b.edgeLabel ?? b.id]));
  const text = `<details${routed ? "" : " open"} id="${escape(textId)}"><summary>The diagram as text</summary><ul>${equivalent.boxes.map((b) => `<li>${escape(b.id)}: ${escape(b.words)}${b.source ? ` · ${sourceCode(b.source.file, b.source.line)}${b.source.file ? copy(location(b.source.file, b.source.line)) : ""}` : ""}${b.foldedIds?.length ? ` · folded members: ${b.foldedIds.map(escape).join(", ")}` : ""}</li>`).join("")}${equivalent.edges.map((e) => `<li>${escape(edgeLabels.get(e.from) ?? e.from)} ${escape(e.kind)} ${escape(edgeLabels.get(e.to) ?? e.to)}${e.claim ? ` · ${escape(e.claim)}` : ""}${(e.count ?? 1) > 1 ? ` (${String(e.count)} unit edges)` : ""}${e.reason ? ` — ${escape(e.reason)}` : ""}</li>`).join("")}</ul></details>`;
  const relationWords = (kind: string) => {
    const claims = [
      ...new Set(d.edges.filter((e) => e.kind === kind).flatMap((e) => (e.claim ? [e.claim] : []))),
    ].sort();
    return `${kind}${claims.length ? ` (${claims.join(", ")})` : ""}`;
  };
  const legend =
    d.edges.length && !needsEdgeLabels(d.edges) && routed
      ? `<p class="diagram-legend">Arrows: ${escape(relationWords(d.edges.some((e) => e.kind === "uses") ? "uses" : (d.edges[0]?.kind ?? "")))}.${d.edges.some((e) => e.kind === "plans to use") ? ` Dashed arrows: ${escape(relationWords("plans to use"))}.` : ""}</p>`
      : routed?.routes.some((r) => r.label?.text === r.key)
        ? `<ul class="diagram-legend">${routed.routes
            .filter((r) => r.label?.text === r.key)
            .map((r) => `<li>${r.key}: ${escape(edgeWords(r.edge))}</li>`)
            .join("")}</ul>`
        : "";
  const viewportId = `diagram.${diagramId}.viewport`,
    helpId = `diagram.${diagramId}.scroll-help`;
  const help =
    routed && routed.width > widthBudget
      ? `<p class="scroll-help" id="${escape(helpId)}">Scroll horizontally to read the whole drawing.</p>`
      : "";
  const sourceId = `diagram.${diagramId}.source`,
    areaId = `${sourceId}-text`;
  const source = routed
    ? `<details id="${escape(sourceId)}"><summary>Mermaid source</summary><p>Copyable source; the Studio draws static SVG.</p><p>${d.source ? escape(d.source.explanation) : d.grid ? "Preferred syntax: block; flowchart fallback because block cannot carry edge claims and counts." : "Preferred syntax: flowchart. Chosen syntax: labelled flowchart, preserving exact relations, claims and folds."}</p><label for="${escape(areaId)}">Mermaid source for ${escape(d.caption)}</label><textarea readonly id="${escape(areaId)}" rows="8">${escape(d.source?.text ?? mermaidSource(normalized))}</textarea><sdp-copy for="${escape(areaId)}"></sdp-copy></details>`
    : "";
  const sectionId = d.sectionId === undefined ? d.subject : d.sectionId;
  return `<section${sectionId === null ? "" : ` id="${escape(sectionId)}"`}><sdp-diagram subject="${escape(d.subject)}"><figure><figcaption>${escape(d.caption)}</figcaption>${legend}${help}${routed && l ? `<div class="diagram-scroll" id="${escape(viewportId)}" tabindex="0" role="region" aria-label="${escape(d.caption)}"${help ? ` aria-describedby="${escape(helpId)}"` : ""}>${svg(normalized, textId, diagramId, l, routed)}</div>` : `<p>${fits ? "Shown as text: a distinct route or label could not be placed within the routing budget." : "Shown as text: this drawing exceeds the bound of 40 boxes and 100 edges."}</p>`}${text}${source}</figure></sdp-diagram></section>`;
}

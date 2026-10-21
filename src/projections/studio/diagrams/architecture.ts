import { aggregate, compare, contextOf, layerOf, layers, withinBound } from "./model.js";
import type { Diagram, DiagramInput, DiagramBox } from "./model.js";

export function architectureDiagrams(input: DiagramInput): {
  fold: "nothing" | "context" | "layer";
  drawings: Diagram[];
} {
  const boxes = [...input.boxes].sort((a, b) => compare(a.id, b.id));
  const contexts = [...new Set(boxes.map(contextOf))].sort((a, b) =>
    a === "not stated" ? 1 : b === "not stated" ? -1 : compare(a, b),
  );
  const base = {
    ...input,
    boxes,
    subject: "architecture",
    caption: "Components by context and layer",
    grid: true,
  };
  if (withinBound(base)) return { fold: "nothing", drawings: [base] };
  const drawings: Diagram[] = [];
  const contextId = (context: string): string =>
    `context.${context === "not stated" ? "" : context}`;
  if (contexts.length > 1) {
    const ids = new Map(boxes.map((b) => [b.id, contextId(contextOf(b))]));
    drawings.push({
      subject: "architecture",
      caption: "Architecture folded by context",
      boxes: contexts.map((c) => ({
        id: contextId(c),
        words: `${c}: ${String(boxes.filter((b) => contextOf(b) === c).length)} components, folded`,
        target: `#${contextId(c)}`,
        folded: true,
        band: "Contexts",
      })),
      edges: aggregate(input.edges, ids),
    });
  }
  let foldedLayer = false;
  for (const context of contexts) {
    const own = boxes.filter((b) => contextOf(b) === context);
    const ids = new Map(
      boxes.map((b) => [b.id, contextOf(b) === context ? b.id : contextId(contextOf(b))]),
    );
    const edges = aggregate(
      input.edges.filter((e) => own.some((b) => b.id === e.from || b.id === e.to)),
      ids,
    );
    const externalIds = new Set(
      edges.flatMap((e) => [e.from, e.to]).filter((id) => !own.some((b) => b.id === id)),
    );
    const external: DiagramBox[] = contexts
      .filter((c) => externalIds.has(contextId(c)))
      .map((c) => ({
        id: contextId(c),
        words: `${c}, folded`,
        target: `#${contextId(c)}`,
        folded: true,
        band: "Other contexts",
      }));
    const diagram: Diagram = {
      subject: contextId(context),
      caption: `Context ${context}`,
      boxes: [...own, ...external],
      edges,
      grid: true,
    };
    if (withinBound(diagram)) {
      drawings.push(diagram);
      continue;
    }
    foldedLayer = true;
    const present = layers.filter((l) => own.some((b) => layerOf(b) === l));
    const layerId = (l: string): string =>
      `${contextId(context)}.layer.${l === "not stated" ? "" : l}`;
    const layerIds = new Map(
      diagram.boxes.map((b) => [b.id, contextOf(b) === context ? layerId(layerOf(b)) : b.id]),
    );
    drawings.push({
      subject: contextId(context),
      caption: `Context ${context} folded by layer`,
      boxes: [
        ...present.map((l) => ({
          id: layerId(l),
          words: `${l}: ${String(own.filter((b) => layerOf(b) === l).length)} components, folded`,
          target: `#${layerId(l)}`,
          folded: true,
          band: "Layers",
        })),
        ...external,
      ],
      edges: aggregate(edges, layerIds),
    });
    for (const layer of present) {
      const members = own.filter((b) => layerOf(b) === layer);
      const memberIds = new Set(members.map((b) => b.id));
      const layerEdges = input.edges.filter((e) => memberIds.has(e.from) || memberIds.has(e.to));
      const endpoints = new Set(layerEdges.flatMap((e) => [e.from, e.to]));
      // Other layers stay as labelled folded boxes; no crossing use disappears.
      const other = own.filter((b) => !memberIds.has(b.id) && endpoints.has(b.id));
      const mapping = new Map(
        boxes.map((b) => [
          b.id,
          memberIds.has(b.id)
            ? b.id
            : contextOf(b) !== context
              ? contextId(contextOf(b))
              : layerId(layerOf(b)),
        ]),
      );
      const others: DiagramBox[] = [...new Set(other.map(layerOf))].map((l) => ({
        id: layerId(l),
        words: `${l}, folded`,
        target: `#${layerId(l)}`,
        folded: true,
        band: "Other layers",
      }));
      const outgoing = aggregate(layerEdges, mapping);
      const ext = external.filter((b) => outgoing.some((e) => e.from === b.id || e.to === b.id));
      drawings.push({
        subject: layerId(layer),
        caption: `Context ${context}, layer ${layer}`,
        boxes: [...members, ...others, ...ext],
        edges: outgoing,
        grid: true,
      });
    }
  }
  return { fold: contexts.length > 1 ? "context" : foldedLayer ? "layer" : "nothing", drawings };
}

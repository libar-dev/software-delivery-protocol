import type { SpecContext } from "../../../reader/reader.js";
import { requirementDiagram } from "../diagrams/requirement.js";
import { renderDiagram } from "../diagrams/svg.js";
import type { DiagramBox, DiagramEdge } from "../diagrams/model.js";
import { code, link, list } from "./html.js";
import type { PageContext } from "./html.js";
import { plainTitle } from "./code-spans.js";
/**
 * @sdpAnchor impl:protocol.studio-requirement-view
 * @sdpLabel selects Spec refiners, verifying examples and their recorded bindings
 * @sdpSatisfies spec:consumers.spec-studio.diagram-kinds.requirement-trace, spec:consumers.spec-studio.spec-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function requirementView(ctx: PageContext, spec: SpecContext): string {
  const intended = new Set([
    spec.id,
    ...spec.relationsIn.filter((r) => r.type === "refines").map((r) => r.otherId),
  ]);
  const examples = new Set(
    ctx.data.specs
      .filter(
        (s) =>
          s.specKind === "example" &&
          s.relationsOut.some((r) => r.type === "verifies" && intended.has(r.otherId)),
      )
      .map((s) => s.id),
  );
  const selected = new Set([...intended, ...examples]);
  const edges: DiagramEdge[] = ctx.data.specs.flatMap((s) =>
    s.relationsOut
      .filter(
        (r) =>
          ["refines", "verifies"].includes(r.type) &&
          (selected.has(s.id) || selected.has(r.otherId)),
      )
      .map((r) => ({
        from: s.id,
        to: r.otherId,
        kind: r.type,
        claim: r.claim,
        ...(r.reason === undefined ? {} : { reason: r.reason }),
      })),
  );
  for (const unit of ctx.data.search.records)
    for (const binding of unit.bindings)
      if (
        selected.has(binding.specId) &&
        ["satisfies", "verifies", "references", "models"].includes(binding.edge)
      )
        edges.push({ from: unit.id, to: binding.specId, kind: binding.edge, claim: "anchored" });
  const ids = new Set([...selected, ...edges.flatMap((e) => [e.from, e.to])]);
  const boxes: DiagramBox[] = [...ids].map((id) => {
    const s = ctx.data.specs.find((s) => s.id === id);
    const unit = ctx.data.search.records.find((r) => r.id === id);
    const isExample = examples.has(id) || s?.specKind === "example";
    const test = edges.some((e) => e.to === id && e.kind === "verifies" && e.claim === "anchored");
    const satisfying = (s?.implementations.length ?? 0) > 0;
    const satisfiable = !isExample && s?.specKind !== "decision";
    const claim =
      s || id.startsWith("spec:")
        ? "declared Spec"
        : id.startsWith("oracle:")
          ? "anchored oracle binding"
          : id.startsWith("test:")
            ? "anchored test binding · binding present"
            : "anchored code";
    const absence = s
      ? `${isExample && !test ? " · no test binding" : ""}${selected.has(id) && satisfiable && !satisfying ? " · no satisfying binding" : ""}`
      : "";
    const title = plainTitle(s?.title ?? unit?.label ?? id);
    return {
      id,
      title,
      detail: `${claim}${absence}`,
      words: `${title} · ${claim}${absence}`,
      target: s ? (/href="([^"]+)"/u.exec(link(ctx, id))?.[1] ?? "#main") : "#bindings",
      ...(s
        ? {}
        : {
            source: {
              ...(unit?.file === undefined ? {} : { file: unit.file }),
              ...(unit?.line === undefined ? {} : { line: unit.line }),
            },
          }),
      band:
        !selected.has(id) && (s || id.startsWith("spec:"))
          ? "Outside the selected set"
          : isExample
            ? "Declared verifying examples"
            : intended.has(id)
              ? "Intended Specs"
              : id.startsWith("impl:") || id.startsWith("api:") || id.startsWith("component:")
                ? "Satisfying or referencing units"
                : "Test or oracle bindings",
    };
  });
  const empty = [
    ...(examples.size === 0 ? ["Declared verifying examples: no declared verifying example."] : []),
    ...(!edges.some((e) => e.claim === "anchored" && ["satisfies", "references"].includes(e.kind))
      ? ["Satisfying or referencing units: no recorded binding."]
      : []),
    ...(!edges.some((e) => e.claim === "anchored" && ["verifies", "models"].includes(e.kind))
      ? ["Test or oracle bindings: no recorded binding."]
      : []),
  ];
  return `<h3>Requirement drawing</h3>${empty.length ? list(empty) : ""}${renderDiagram(requirementDiagram({ subject: spec.id, boxes, edges }), `${spec.id}.requirement`)}${edges.length ? "" : `<p>${code(spec.id)} has no requirement edges recorded.</p>`}`;
}

import type { SpecContext } from "../../../reader/reader.js";
import type { Architecture } from "./architecture-page.js";
import { realizationDiagram, renderDiagram, traceDiagram } from "../diagrams/index.js";
import type { DiagramBox, DiagramEdge } from "../diagrams/index.js";
import type { PageContext } from "./html.js";
import {
  code,
  sourceCode,
  copy,
  escape,
  link,
  list,
  location,
  relative,
  componentLink,
} from "./html.js";
import { plainTitle } from "./code-spans.js";
import { codeSpans, prose } from "./text.js";

const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
interface StructuralUnit {
  readonly id: string;
  readonly label?: string | null;
  readonly file?: string | null;
  readonly line?: number | null;
  readonly layer?: string | null;
  readonly context?: string | null;
}
function source(ctx: PageContext, unit: StructuralUnit): string {
  const at = location(unit.file ?? undefined, unit.line ?? undefined);
  return `${unit.id.startsWith("component:") ? componentLink(ctx, unit.id) : code(unit.id)}${unit.label == null ? "" : ` · ${codeSpans(unit.label)}`} · ${sourceCode(unit.file ?? undefined, unit.line ?? undefined)}${unit.file == null ? "" : copy(at)}${unit.layer == null ? "" : ` · layer ${escape(unit.layer)}`}${unit.context == null ? "" : ` · context ${escape(unit.context)}`}`;
}
function structure(ctx: PageContext, spec: SpecContext) {
  const architecture = ctx.data.recipes.all.get(17) as Architecture;
  const units = new Map<string, StructuralUnit>(
    ctx.data.search.records.filter((n) => n.nodeType === "CodeNode").map((n) => [n.id, n]),
  );
  for (const component of architecture.components)
    if (component.declared) units.set(component.id, component);
  for (const unit of spec.implementations) units.set(unit.codeId, { ...unit, id: unit.codeId });
  const own = new Set(spec.implementations.map((i) => i.codeId));
  const components = spec.implementations.flatMap((unit) =>
    unit.component === undefined
      ? []
      : [{ from: unit.codeId, to: unit.component.id, type: "memberOf" }],
  );
  const roots = new Set([...own, ...components.map((e) => e.to)]);
  const uses = architecture.usesEdges
    .filter((edge) => roots.has(edge.from))
    .map((edge) => ({ ...edge, type: "uses" }));
  return { units, own, components, uses };
}
/**
 * @sdpAnchor impl:protocol.studio-spec-structure
 * @sdpLabel renders realization and trace diagrams and the recorded structural neighborhood
 * @sdpReferences spec:consumers.spec-studio.spec-page, spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function designView(ctx: PageContext, spec: SpecContext): string {
  const { units, own, components, uses } = structure(ctx, spec);
  const selected = new Set([...own, ...components.map((e) => e.to), ...uses.map((e) => e.to)]);
  const boxes: DiagramBox[] = [...selected].sort(compare).map((id) => {
    const unit = units.get(id);
    return {
      id,
      words: unit
        ? `${plainTitle(unit.label ?? "")} ${location(unit.file ?? undefined, unit.line ?? undefined)}`.trim()
        : "unresolved",
      target:
        id.startsWith("component:") && units.has(id)
          ? `${relative(ctx, "architecture.html")}#${id}`
          : "#panel.runtime",
      band: own.has(id)
        ? "Satisfying units"
        : components.some((e) => e.to === id)
          ? "Components"
          : "Uses",
    };
  });
  const edges: DiagramEdge[] = [...components, ...uses].map((e) => ({
    from: e.from,
    to: e.to,
    kind: e.type,
  }));
  const drawing = boxes.length
    ? renderDiagram(
        realizationDiagram({ subject: spec.id, sectionId: null, boxes, edges }),
        `${spec.id}.realization`,
      )
    : "<p>No implementation binding recorded.</p>";
  const decisions = spec.relationsOut.filter((r) => r.type === "decidedBy");
  return `${drawing}<h3>Decisions</h3>${
    decisions.length
      ? list(
          decisions.map((d) => {
            const record = ctx.data.specs.find((s) => s.id === d.otherId);
            return `${link(ctx, d.otherId, d.otherTitle ?? d.otherId, codeSpans(d.otherTitle ?? d.otherId))}${record?.sections?.decision?.decision === undefined ? "<p>No decision text recorded.</p>" : prose(ctx, record.sections.decision.decision)}`;
          }),
        )
      : "<p>No decision record named.</p>"
  }`;
}
export function runtimePanel(ctx: PageContext, spec: SpecContext): string {
  const { units, own, components, uses } = structure(ctx, spec);
  const roots = [...new Set([...own, ...components.map((e) => e.to)])].sort(compare);
  return `${
    roots.length
      ? list(
          roots.map((id) => {
            const unit = units.get(id);
            const membership = components.filter((e) => e.from === id);
            const outgoing = uses.filter((e) => e.from === id);
            return `${unit ? source(ctx, unit) : code(id)}${
              membership.length
                ? `<p>Component: ${membership
                    .map((e) => {
                      const c = units.get(e.to);
                      return c ? source(ctx, c) : code(e.to);
                    })
                    .join(", ")}</p>`
                : ""
            }<p>Uses</p>${list(
              outgoing.map((e) => {
                const target = units.get(e.to);
                return target ? source(ctx, target) : `${code(e.to)} · unresolved`;
              }),
            )}`;
          }),
        )
      : "<p>No implementation neighborhood recorded.</p>"
  }<p>Runtime observation: not tracked.</p>`;
}
interface Footing {
  footing: {
    id: string;
    type: string;
    statedReadiness: string | null;
    floorReached: string | null;
  }[];
}
interface Impact {
  rows: {
    id: string;
    distance: number;
    implementedBy: { id: string; file: string | null; line: number | null }[];
    referencedBy: { id: string; file: string | null; line: number | null }[];
    enabledVerifiers: string[];
    packs: string[];
  }[];
}
export function impactView(ctx: PageContext, spec: SpecContext): string {
  const relations = [
    ...spec.relationsOut.map((r) => ({ from: spec.id, to: r.otherId, kind: r.type })),
    ...spec.relationsIn.map((r) => ({ from: r.otherId, to: spec.id, kind: r.type })),
  ];
  const ids = new Set([spec.id, ...relations.flatMap((r) => [r.from, r.to])]);
  const boxes: DiagramBox[] = [...ids].sort(compare).map((id) => ({
    id,
    words: plainTitle(ctx.data.specs.find((s) => s.id === id)?.title ?? id),
    target: /href="([^"]+)"/u.exec(link(ctx, id))?.[1] ?? "#relations",
  }));
  const trace = `<sdp-trace-graph spec-id="${escape(spec.id)}">${renderDiagram(traceDiagram({ subject: spec.id, sectionId: null, boxes, edges: relations }))}</sdp-trace-graph>`;
  const answers = ctx.data.recipes.specs.get(spec.id);
  const footing = (answers?.get(21) as Footing).footing;
  const impact = (answers?.get(30) as Impact).rows.filter((row) => row.distance > 0);
  const distances = [...new Set(impact.map((row) => row.distance))];
  const units = (rows: Impact["rows"][number]["implementedBy"]) =>
    list(
      rows.map(
        (u) =>
          `${u.id.startsWith("component:") ? componentLink(ctx, u.id) : code(u.id)} · ${sourceCode(u.file ?? undefined, u.line ?? undefined)}${u.file === null ? "" : copy(location(u.file, u.line ?? undefined))}`,
      ),
    );
  return `<sdp-impact-view spec-id="${escape(spec.id)}">${trace}<h3>Rests on</h3>${list(footing.map((row) => `${escape(row.type)} · ${link(ctx, row.id)} · stated ${escape(row.statedReadiness ?? "not recorded")}, floor ${escape(row.floorReached ?? "none")}`))}<h3>Rested on by</h3>${distances.length ? distances.map((distance) => `<h4>Distance ${String(distance)}</h4>${list(impact.filter((row) => row.distance === distance).map((row) => `${link(ctx, row.id)}<p>Implementing units</p>${units(row.implementedBy)}<p>Referencing units</p>${units(row.referencedBy)}<p>Enabled verifiers: ${row.enabledVerifiers.length ? row.enabledVerifiers.map((id) => link(ctx, id)).join(", ") : "None"}</p><p>Packs: ${row.packs.length ? row.packs.map((id) => link(ctx, id)).join(", ") : "None"}</p>`))}`).join("") : "<p>No Spec rests on this Spec.</p>"}</sdp-impact-view>`;
}

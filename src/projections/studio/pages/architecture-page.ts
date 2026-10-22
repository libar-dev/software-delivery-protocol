import { unitRegister } from "./architecture-register.js";
import { codeSpans, plainTitle } from "./code-spans.js";
import { architectureDiagrams, memberDiagram, renderDiagram } from "../diagrams/index.js";
import type { DiagramBox, DiagramEdge } from "../diagrams/index.js";
import { frame } from "./frame.js";
import { code, count, escape, link, list } from "./html.js";
import type { PageContext } from "./html.js";
interface Member {
  id: string;
  label: string | null;
  file: string | null;
  line: number | null;
  role: string | null;
}
interface Component extends Member {
  declared: boolean;
  context: string | null;
  layer: string | null;
  members: Member[];
  usesCounts: { component: string; edges: number }[];
  usedByCounts: { component: string; edges: number }[];
  satisfiedSpecs: string[];
  referencedSpecs: string[];
}
export interface Architecture {
  components: Component[];
  usesEdges: { from: string; to: string; claim: string }[];
  unresolvedUses: { from: string; to: string }[];
}
interface Planned {
  spec: string;
  componentId: string;
  anchorExists: boolean;
  context: string | null;
  layer: string | null;
  role: string | null;
  uses: string[] | null;
}
interface Plans {
  unrealized: Planned[];
  differing: {
    spec: string;
    componentId: string;
    field: string;
    planned: unknown;
    realized: unknown;
  }[];
  unreadable: { spec: string; key: string; value: unknown }[];
}
/**
 * @sdpAnchor impl:protocol.studio-architecture-lens
 * @sdpLabel renders recipe component rows and planned designs as architecture and member diagrams
 * @sdpSatisfies spec:consumers.spec-studio.lenses.architecture, spec:consumers.spec-studio.lenses
 * @sdpReferences spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function architecturePage(ctx: PageContext): string {
  const architecture = ctx.data.recipes.all.get(17) as Architecture;
  const plans = ctx.data.recipes.all.get(43) as Plans;
  const components = architecture.components
    .filter((c) => c.declared)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const register = unitRegister(ctx, architecture);
  const boxes: DiagramBox[] = components.map((c) => ({
    id: c.id,
    title: plainTitle(c.label ?? c.id),
    detail: `${String(c.members.length)} ${c.members.length === 1 ? "member" : "members"}`,
    words: `${c.label === null ? "" : `${plainTitle(c.label)}, `}${String(c.members.length)} ${c.members.length === 1 ? "member" : "members"}`,
    context: c.context,
    layer: c.layer,
    target: `#${c.id}`,
  }));
  const plannedKey = (p: Planned) =>
    components.some((c) => c.id === p.componentId) ||
    plans.unrealized.filter((other) => other.componentId === p.componentId).length > 1
      ? p.spec
      : p.componentId;
  boxes.push(
    ...plans.unrealized.map((p) => ({
      id: plannedKey(p),
      edgeLabel:
        plannedKey(p) === p.spec ? `${p.componentId} (planned by ${p.spec})` : p.componentId,
      words:
        plannedKey(p) === p.spec
          ? `${p.componentId}, planned by ${p.spec}`
          : `${p.componentId}, planned`,
      context: p.context,
      layer: p.layer,
      planned: true,
      target: linkTarget(ctx, p.spec),
    })),
  );
  const edges: DiagramEdge[] = components.flatMap((c) =>
    c.usesCounts
      .filter((e) => components.some((t) => t.id === e.component))
      .map((e) => ({
        from: c.id,
        to: e.component,
        kind: "uses",
        claim: "anchored",
        count: e.edges,
      })),
  );
  const targetsOf = (id: string): string[] => {
    if (components.some((c) => c.id === id)) return [id];
    return plans.unrealized.filter((p) => p.componentId === id).map(plannedKey);
  };
  for (const p of plans.unrealized)
    for (const use of p.uses ?? [])
      for (const target of targetsOf(use))
        edges.push({ from: plannedKey(p), to: target, kind: "plans to use", claim: "declared" });
  const diagrams = architectureDiagrams({ boxes, edges });
  const contexts = new Set(
    boxes.flatMap((b) => (b.context === null || b.context === undefined ? [] : [b.context])),
  );
  const layers = new Set(
    boxes.flatMap((b) => (b.layer === null || b.layer === undefined ? [] : [b.layer])),
  );
  const plannedRows = plans.unrealized
    .map(
      (p) =>
        `<tr><td>${link(ctx, p.spec)}</td><td>${code(p.componentId)}</td><td>${escape(p.context ?? "not stated")}</td><td>${escape(p.layer ?? "not stated")}</td><td>${escape(p.role ?? "not stated")}</td><td>${(p.uses ?? []).map(code).join(", ") || "None"}</td><td>${p.anchorExists ? "yes" : "no"}</td></tr>`,
    )
    .join("");
  const unreadable = plans.unreadable
    .map(
      (p) =>
        `<tr><td>${link(ctx, p.spec)}</td><td colspan="6">Unreadable ${code(p.key)}: ${code(JSON.stringify(p.value))}</td></tr>`,
    )
    .join("");
  const designed = `<section><h2>Designed, not built</h2>${plannedRows || unreadable ? `<div class="table-scroll"><table><thead><tr><th>Design</th><th>Component</th><th>Context</th><th>Layer</th><th>Role</th><th>Plans to use</th><th>Anchor exists without satisfying</th></tr></thead><tbody>${plannedRows}${unreadable}</tbody></table></div>` : "<p>None.</p>"}</section>`;
  const matrix = usesTable(components);
  const details = components
    .map((c) => {
      const own = new Set(c.members.map((m) => m.id));
      const uses = architecture.usesEdges.filter((e) => own.has(e.from));
      const external = [...new Set(uses.map((e) => e.to).filter((id) => !own.has(id)))].sort();
      const memberBoxes: DiagramBox[] = [
        ...c.members.map((m) => ({
          id: m.id,
          title: plainTitle(m.label ?? m.id),
          detail: m.role === null ? "" : `role ${m.role}`,
          words: `${plainTitle(m.label ?? m.id)}${m.role === null ? "" : `, role ${m.role}`}`,
          target: `#${c.id}`,
        })),
        ...external.map((id) => ({
          id,
          words: "Outside component",
          band: "Outside component",
          target: components.some((t) => t.id === id) ? `#${id}` : `#${c.id}`,
        })),
      ];
      const diagram = memberDiagram({
        subject: c.id,
        sectionId: null,
        boxes: memberBoxes,
        edges: uses.map((e) => ({ ...e, kind: "uses" })),
      });
      const directions = (rows: Component["usesCounts"]) =>
        list(
          rows.map(
            (e) =>
              `${components.some((component) => component.id === e.component) ? `<a href="#${escape(e.component)}">${code(e.component)}</a>` : code(e.component)} (${String(e.edges)} unit edges)`,
          ),
        );
      const diff = plans.differing.filter((d) => d.componentId === c.id);
      return `<section id="${escape(c.id)}"><h2>${code(c.id)}${c.label === null ? "" : ` ${codeSpans(c.label)}`}</h2><p>Layer ${escape(c.layer ?? "not stated")}, context ${escape(c.context ?? "not stated")}, role ${escape(c.role ?? "not stated")}.</p>${register.source(c.id)}<h3>Members</h3>${register.members(c.id)}<h3>Uses</h3>${directions(c.usesCounts)}${supportingUses(architecture, c, components)}<h3>Used by</h3>${directions(c.usedByCounts)}${diff.length ? `<h3>Design differences</h3>${list(diff.map((d) => `${link(ctx, d.spec)} ${code(d.field)}: planned ${code(JSON.stringify(d.planned))}; realized ${code(JSON.stringify(d.realized))}`))}` : ""}<h3>Satisfies</h3>${list(c.satisfiedSpecs.map((s) => link(ctx, s)))}<h3>References</h3>${list(c.referencedSpecs.map((s) => link(ctx, s)))}${c.members.length === 0 ? "<p>None.</p>" : renderDiagram(diagram)}</section>`;
    })
    .join("");
  const unresolved = [
    ...architecture.components
      .filter((c) => !c.declared)
      .map(
        (c) =>
          `${code(c.id)}: missing component; members ${c.members.map((m) => code(m.id)).join(", ")}`,
      ),
    ...architecture.unresolvedUses.map((e) => `${code(e.from)} uses ${code(e.to)}`),
  ];
  return frame(
    ctx,
    "Architecture",
    `<header class="page-head"><h1>Architecture</h1><p>Components, their members and uses, and planned component designs.</p><p>${String(components.length)} components realized and ${String(plans.unrealized.length)} planned. They state ${count(contexts.size, "context", "contexts", false)} and ${count(layers.size, "layer", "layers", false)}. ${String(edges.filter((e) => e.kind === "uses").length)} uses edges between components. ${String(new Set(plans.differing.map((d) => d.spec)).size)} designs differ from their components.</p></header>${diagrams.drawings.map((drawing) => renderDiagram(drawing)).join("")}${matrix}${designed}${register.index}${details}${register.unowned}${unresolved.length ? `<section><h2>Unresolved structure</h2>${list(unresolved)}</section>` : ""}`,
  );
}
function linkTarget(ctx: PageContext, id: string): string {
  return /href="([^"]+)"/u.exec(link(ctx, id))?.[1] ?? "#main";
}

const useId = (from: string, to: string) => `uses.${from}.${to}`;
function usesTable(components: Component[]): string {
  const layers = ["edge", "application", "domain", "adapter", "infrastructure"];
  const rank = (c: Component) => (c.layer === null ? layers.length : layers.indexOf(c.layer));
  const rows = [...components].sort(
    (a, b) => rank(a) - rank(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  const header = (c: Component) => `${codeSpans(c.label ?? c.id)} ${code(c.id)}`;
  return `<section><h2>Component uses</h2><p>Rows use columns. · means no anchored use recorded; a component's own cell is empty.</p><div class="table-scroll" role="region" aria-label="Which components use which" tabindex="0"><table class="component-uses"><caption>Which components use which</caption><thead><tr><th scope="col">Using / used</th>${rows.map((c) => `<th scope="col">${header(c)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(
      (from) =>
        `<tr><th scope="row">${header(from)}</th>${rows
          .map((to) => {
            if (from.id === to.id) return '<td class="uses-self"></td>';
            const n = from.usesCounts.find((u) => u.component === to.id)?.edges ?? 0;
            return n
              ? `<td><a href="#${escape(useId(from.id, to.id))}">${String(n)}</a></td>`
              : '<td><span aria-hidden="true">·</span><span class="visually-hidden">no anchored use recorded</span></td>';
          })
          .join("")}</tr>`,
    )
    .join("")}</tbody></table></div></section>`;
}
function supportingUses(
  architecture: Architecture,
  component: Component,
  components: Component[],
): string {
  const owner = new Map(
    components.flatMap(
      (c) => [[c.id, c.id], ...c.members.map((m) => [m.id, c.id])] as [string, string][],
    ),
  );
  return component.usesCounts
    .filter((u) => u.component !== component.id && components.some((c) => c.id === u.component))
    .map(
      (u) =>
        `<div id="${escape(useId(component.id, u.component))}"><h4>Uses ${code(u.component)} · ${String(u.edges)} unit edges</h4>${list(architecture.usesEdges.filter((e) => owner.get(e.from) === component.id && owner.get(e.to) === u.component).map((e) => `${code(e.from)} uses ${code(e.to)} · anchored`))}</div>`,
    )
    .join("");
}

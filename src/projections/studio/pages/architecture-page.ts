import { codeSpans, plainTitle } from "./code-spans.js";
import { architectureDiagrams, memberDiagram, renderDiagram } from "../diagrams/index.js";
import type { DiagramBox, DiagramEdge } from "../diagrams/index.js";
import { frame } from "./frame.js";
import { code, sourceCode, copy, count, escape, link, list } from "./html.js";
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
const location = (m: Member) =>
  m.file === null ? "not recorded" : `${m.file}${m.line === null ? "" : `:${String(m.line)}`}`;

/**
 * @sdpAnchor impl:protocol.studio-architecture-lens
 * @sdpLabel renders recipe component rows and planned designs as architecture and member diagrams
 * @sdpSatisfies spec:consumers.spec-studio.lenses.architecture
 * @sdpReferences spec:consumers.spec-studio.lenses, spec:decisions.studio-build-renders
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function architecturePage(ctx: PageContext): string {
  const architecture = ctx.data.recipes.all.get(17) as Architecture;
  const plans = ctx.data.recipes.all.get(43) as Plans;
  const components = architecture.components.filter((c) => c.declared);
  const boxes: DiagramBox[] = components.map((c) => ({
    id: c.id,
    words: `${c.label === null ? "" : `${plainTitle(c.label)}, `}${String(c.members.length)} ${c.members.length === 1 ? "member" : "members"}`,
    context: c.context,
    layer: c.layer,
    target: `#${c.id}`,
  }));
  const plannedKey = (p: Planned) =>
    components.some((c) => c.id === p.componentId) ? p.spec : p.componentId;
  boxes.push(
    ...plans.unrealized.map((p) => ({
      id: plannedKey(p),
      words: `${p.componentId}, planned`,
      context: p.context,
      layer: p.layer,
      planned: true,
      target: linkTarget(ctx, p.spec),
    })),
  );
  const edges: DiagramEdge[] = components.flatMap((c) =>
    c.usesCounts
      .filter((e) => components.some((t) => t.id === e.component))
      .map((e) => ({ from: c.id, to: e.component, kind: "uses", count: e.edges })),
  );
  const targetOf = (id: string): string | undefined => {
    if (components.some((c) => c.id === id)) return id;
    const planned = plans.unrealized.find((p) => p.componentId === id);
    return planned === undefined ? undefined : plannedKey(planned);
  };
  for (const p of plans.unrealized)
    for (const use of p.uses ?? []) {
      const target = targetOf(use);
      if (target !== undefined)
        edges.push({ from: plannedKey(p), to: target, kind: "plans to use" });
    }
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
  const details = components
    .map((c) => {
      const own = new Set(c.members.map((m) => m.id));
      const uses = architecture.usesEdges.filter((e) => own.has(e.from));
      const external = [...new Set(uses.map((e) => e.to).filter((id) => !own.has(id)))].sort();
      const memberBoxes: DiagramBox[] = [
        ...c.members.map((m) => ({
          id: m.id,
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
      return `<section id="${escape(c.id)}"><h2>${code(c.id)}${c.label === null ? "" : ` ${codeSpans(c.label)}`}</h2><p>Layer ${escape(c.layer ?? "not stated")}, context ${escape(c.context ?? "not stated")}, role ${escape(c.role ?? "not stated")}.</p><p>${sourceCode(c.file ?? undefined, c.line ?? undefined)}${c.file === null ? "" : copy(location(c))}</p><h3>Members</h3>${list(c.members.map((m) => `${code(m.id)} ${codeSpans(m.label ?? "")} · role ${escape(m.role ?? "not stated")} · ${sourceCode(m.file ?? undefined, m.line ?? undefined)}${m.file === null ? "" : copy(location(m))}`))}<h3>Uses</h3>${directions(c.usesCounts)}<h3>Used by</h3>${directions(c.usedByCounts)}<h3>Satisfies</h3>${list(c.satisfiedSpecs.map((s) => link(ctx, s)))}<h3>References</h3>${list(c.referencedSpecs.map((s) => link(ctx, s)))}${diff.length ? `<h3>Design differences</h3>${list(diff.map((d) => `${link(ctx, d.spec)} ${code(d.field)}: planned ${code(JSON.stringify(d.planned))}; realized ${code(JSON.stringify(d.realized))}`))}` : ""}${c.members.length === 0 ? "<p>None.</p>" : renderDiagram(diagram)}</section>`;
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
    `<header class="page-head"><h1>Architecture</h1><p>Components, their members and uses, and planned component designs.</p><p>${String(components.length)} components realized and ${String(plans.unrealized.length)} planned. They state ${count(contexts.size, "context", "contexts", false)} and ${count(layers.size, "layer", "layers", false)}. ${String(edges.filter((e) => e.kind === "uses").length)} uses edges between components. ${String(new Set(plans.differing.map((d) => d.spec)).size)} designs differ from their components.</p></header>${diagrams.drawings.map((drawing) => renderDiagram(drawing)).join("")}${designed}${details}${unresolved.length ? `<section><h2>Unresolved structure</h2>${list(unresolved)}</section>` : ""}`,
  );
}
function linkTarget(ctx: PageContext, id: string): string {
  return /href="([^"]+)"/u.exec(link(ctx, id))?.[1] ?? "#main";
}

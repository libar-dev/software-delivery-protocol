import type { PageContext } from "./html.js";
import { code, count, escape, link, present } from "./html.js";
import { frame } from "./frame.js";
import { codeSpans } from "./code-spans.js";
import { capabilityBranchId, capabilityDiagrams, capabilityWalk } from "../diagrams/capability.js";
import type { CapabilityMap, CapabilityNode, CapabilityCounts } from "../diagrams/capability.js";
import { renderDiagram } from "../diagrams/svg.js";
import { pagePath } from "../paths.js";

function specPath(id: string): string {
  const path = pagePath(id);
  if (path === null) throw new Error(`Spec has no Studio path: ${id}`);
  return path;
}
function evidence(ctx: PageContext, node: CapabilityNode): string {
  const questions = node.questions
    .map((q) => {
      const path = specPath(node.id);
      const fragment = q.address?.split("#")[1] ?? "section.intent";
      return `<li><a href="${escape(path)}#${escape(fragment)}">${q.blocking ? "blocking" : "non-blocking"}: ${escape(q.question)}</a></li>`;
    })
    .join("");
  return `${link(ctx, node.id, node.title ?? node.id, codeSpans(node.title ?? node.id))} · ${code(node.id)} · ${escape(node.specKind)} · ${escape(node.altitude)} · stated ${escape(node.statedReadiness)} · floor ${escape(node.floorReached)} · implementation binding ${present(node.deliveryFacts.includes("implemented"))} · verifier binding ${present(node.deliveryFacts.includes("has-verifier"))} · ${count(node.questions.length, "open question")} · ${count(node.questions.filter((q) => q.blocking).length, "blocking question")}${questions ? `<ul class="questions">${questions}</ul>` : ""}`;
}
function rollup(value: CapabilityCounts): string {
  return `<p><b>Distinct descendants, excluding this epic</b>: ${count(value.specs, "Spec")} · ${count(value.byKind.example ?? 0, "example")} · ${count(value.byKind.decision ?? 0, "decision")}.</p><dl class="capability-counts">${(
    [
      ["Stated rungs", value.byStatedReadiness],
      ["Floors reached", value.byFloorReached],
      ["Kinds", value.byKind],
      ["Altitudes", value.byAltitude],
    ] as const
  )
    .map(
      ([label, counts]) =>
        `<div><dt>${label}</dt><dd>${Object.entries(counts)
          .map(([key, n]) => `${escape(key)} ${String(n)}`)
          .join(" · ")}</dd></div>`,
    )
    .join(
      "",
    )}<div><dt>Binding evidence</dt><dd>${count(value.withImplementationBinding, "Spec")} with implementation binding present · ${count(value.withVerifierBinding, "Spec")} with verifier binding present</dd></div><div><dt>Questions</dt><dd>${count(value.openQuestions, "open question")} · ${count(value.blockingQuestions, "blocking question")}</dd></div></dl>`;
}
function completeText(
  ctx: PageContext,
  map: CapabilityMap,
  roots: readonly string[],
  subject: string,
): string {
  const visits = capabilityWalk(map, roots);
  return `<details class="capability-complete" id="${escape(`capability.${subject}.complete`)}"><summary>Complete refinement text</summary><ol class="capability-walk">${visits
    .map((v) => {
      const first = capabilityBranchId(subject, v.node.id);
      const row = `${evidence(ctx, v.node)}${v.repeat ? ` · ${v.cycle ? "Cyclic link" : "Repeat of"} <a href="#${encodeURIComponent(first)}">first occurrence</a>` : ""}`;
      const parent = v.parent === null ? "Root" : `Parent: ${link(ctx, v.parent)}`;
      return `<li${v.repeat ? "" : ` id="${escape(first)}"`} style="--depth:${String(Math.min(v.depth, 4))}"><p>${parent}</p>${v.node.specKind === "example" || v.node.specKind === "decision" ? `<details><summary>${escape(v.node.specKind === "example" ? "Example" : "Decision")} · ${escape(v.node.title ?? v.node.id)}</summary>${row}</details>` : row}</li>`;
    })
    .join("")}</ol></details>`;
}
const damage = (map: CapabilityMap, ids: ReadonlySet<string>): string => {
  const rows = map.damage.filter((d) => ids.has(d.from) || ids.has(d.to));
  return rows.length
    ? `<p>Unresolved refinement endpoints</p><ul>${rows.map((d) => `<li>${escape(d.code)}: ${code(d.from)} refines ${code(d.to)} · unresolved endpoint</li>`).join("")}</ul>`
    : "";
};

/**
 * @sdpAnchor impl:protocol.studio-capabilities-page
 * @sdpLabel renders epic evidence, refinement and unreached Specs from the capability map
 * @sdpSatisfies spec:consumers.spec-studio.capability-map-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function capabilitiesPage(ctx: PageContext): string {
  const map = ctx.data.recipes.all.get(52) as CapabilityMap;
  const nodes = new Map(map.nodes.map((n) => [n.id, n]));
  const label = (id: string) => nodes.get(id)?.title ?? id;
  const overview = map.epics
    .map(
      (epic) =>
        `<article class="card"><h3><a href="#${escape(epic.id)}">${codeSpans(label(epic.id))}</a></h3><p>${code(epic.id)}</p>${epic.parentEpicIds.map((id) => `<p>Inside ${link(ctx, id, label(id))}.</p>`).join("")}${map.epics
          .filter((e) => epic.descendantIds.includes(e.id))
          .map((e) => `<p>Contains epic ${link(ctx, e.id, label(e.id))}.</p>`)
          .join(
            "",
          )}<p>${count(epic.rollup.specs, "distinct descendant")} · ${count(epic.rollup.byKind.example ?? 0, "example")} · ${count(epic.rollup.byKind.decision ?? 0, "decision")}.</p></article>`,
    )
    .join("");
  const sections = map.epics
    .map((epic) => {
      const ids = new Set([epic.id, ...epic.descendantIds]);
      const own = nodes.get(epic.id);
      if (!own) throw new Error(`Epic has no capability row: ${epic.id}`);
      return `<section class="capability-section" id="${escape(epic.id)}"><h2>${codeSpans(label(epic.id))}</h2><p>Epic's own evidence</p><div class="capability-evidence">${evidence(ctx, own)}</div>${rollup(epic.rollup)}<p><a href="index.html?epic=${encodeURIComponent(epic.id)}#specs">Show these Specs</a></p>${capabilityDiagrams(
        map,
        [epic.id],
        epic.id,
        (id) => specPath(id),
      )
        .map((d) => renderDiagram(d, `${epic.id}.capability`))
        .join("")}${completeText(ctx, map, [epic.id], epic.id)}${damage(map, ids)}</section>`;
    })
    .join("");
  const unreached = map.unreached.ids.length
    ? `${capabilityDiagrams(map, map.unreached.roots, "unreached", (id) => specPath(id))
        .map((d) => renderDiagram(d, "unreached.capability"))
        .join("")}${completeText(ctx, map, map.unreached.roots, "unreached")}`
    : "<p>No unreached Specs.</p>";
  return frame(
    ctx,
    "Capabilities",
    `<header class="page-head"><h1>Capabilities</h1><p>Epics and their declared refinement, from the capability map.</p><p>Each rollup counts distinct descendants of that epic. Scopes may overlap; epic rows are not added together.</p></header>${map.epics.length ? `<div class="capability-overview">${overview}</div>` : "<p>No epics. Authors may organize Specs through declared refinement; the whole corpus is listed below.</p>"}${sections}<section id="unreached"><h2>No epic reaches these Specs</h2><p><a href="index.html?epic=none#specs">Show these Specs</a></p>${unreached}</section>${damage(map, new Set(map.damage.flatMap((d) => [d.from, d.to])))}`,
  );
}

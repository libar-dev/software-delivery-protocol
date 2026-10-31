import { text } from "./text.js";
import type { SliceAnswer, SliceMember, SliceDesign } from "../slice-answer.js";
import type { PageContext } from "./html.js";
import { code, copy, escape, link, list, relative, rungLine, componentLink } from "./html.js";
import { frame } from "./frame.js";
import { codeSpans } from "./text.js";
import { pagePath, slicePath } from "../paths.js";
import { dependencyDiagram, scopedArchitectureDiagrams } from "../diagrams/slice.js";
import { renderDiagram } from "../diagrams/index.js";
const value = (v: unknown): string =>
  v === null || v === undefined
    ? "not stated"
    : Array.isArray(v)
      ? v.join(", ") || "none"
      : typeof v === "string"
        ? v
        : JSON.stringify(v);
const lines = (rows: readonly string[]) =>
  rows.map((s) => `<span class="field">${s}</span>`).join("");
function table(label: string, heads: readonly string[], rows: readonly string[], cls = ""): string {
  return !rows.length
    ? "<p>None.</p>"
    : `<div class="table-scroll ${cls ? "slice-table-scroll" : ""}" role="region" aria-label="${escape(label)}" tabindex="0"><table${cls ? ` class="${cls}"` : ""}><thead><tr>${heads.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}
/**
 * @sdpAnchor impl:protocol.studio-slice-page
 * @sdpLabel design slice summaries, member needs, architecture comparisons and boundary tables
 * @sdpSatisfies spec:consumers.spec-studio.slice-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function slicePage(ctx: PageContext, a: SliceAnswer): string {
  const subject = a.scope.pack;
  const packPath = pagePath(subject);
  if (packPath === null) throw new Error(`Slice has no Pack page: ${subject}`);
  const members = new Map(a.members.map((m) => [m.id, m]));
  const memberLink = (id: string) =>
    `<a href="${escape(relative(ctx, packPath))}#${escape(id)}">${codeSpans(members.get(id)?.title ?? id)}</a>`;
  const ids = (rows: readonly string[], member = false) =>
    rows.length ? rows.map((id) => (member ? memberLink(id) : link(ctx, id))).join(", ") : "none";
  const target = (id: string) =>
    id.startsWith("component:")
      ? `${relative(ctx, "architecture.html")}#${id}`
      : members.has(id)
        ? `${relative(ctx, packPath)}#${id}`
        : relative(ctx, pagePath(id) ?? packPath);
  const next = (m: SliceMember) =>
    m.statedNextRung === null
      ? ""
      : `<span>next ${escape(m.statedNextRung)}: ${!m.holds.length ? "nothing blocks" : ""}</span>${m.holds.length ? list(m.holds.map((h) => `${code(h.clauseId)} · ${escape(h.description)}${h.targets.length ? list(h.targets.map((t) => `${escape(t.type)} · ${link(ctx, t.id)} · stated ${escape(t.statedReadiness ?? "not recorded")}`)) : ""}`)) : ""}`;
  const identity = (m: SliceMember) =>
    `${memberLink(m.id)}<br>${code(m.id)}<br>${escape(m.specKind)}`;
  const rows = a.members
    .filter((m) => m.exampleOf === null)
    .sort((x, y) => x.depth - y.depth)
    .map((m) => {
      const carried = [
        `${String(m.rules.total)} rules${m.rules.keyed ? `, ${String(m.rules.keyed)} keyed` : ""}`,
        `${String(m.design.entries)} entries`,
        `${String(m.design.declarations)} declarations`,
        `${String(m.design.openQuestions)} questions${m.design.blockingQuestions ? `, ${String(m.design.blockingQuestions)} blocking` : ""}`,
        `${String(m.design.decisions)} decisions`,
        `${String(m.examples.enabled)} of ${String(m.examples.total)} verifying examples bound`,
      ];
      const examples = m.exampleMembers
          .map((id) => members.get(id))
          .filter((e): e is SliceMember => e !== undefined),
        held = examples.filter((e) => e.holds.length).length;
      return `<tr class="member" id="member.${escape(m.id)}"><td class="member-cell">${identity(m)}</td><td class="depth" data-label="Depth">${String(m.depth)}</td><td class="rung" data-label="Rung">${rungLine(m.statedReadiness, m.floorReached ?? "none")}</td><td class="next"${m.statedNextRung === null ? "" : ' data-label="Next rung"'}>${next(m)}</td><td class="carried" data-label="Design carried">${lines(carried)}</td><td class="code-cell" data-label="Code">${lines([`${String(m.implementedBy.length)} implementing`, `${String(m.referencedBy.length)} referencing`])}</td></tr>${!examples.length ? "" : `<tr class="folded"><td colspan="6"><details><summary>${String(examples.length)} example members folded in${held ? `, ${String(held)} held below the next rung` : ""}</summary>${list(examples.map((e) => `${identity(e)} · ${rungLine(e.statedReadiness, e.floorReached ?? "none")}${e.statedNextRung === null ? "" : ` · ${next(e)}`}`))}</details></td></tr>`}`;
    });
  const arch = a.architecture;
  const touched = table(
    "Components the slice touches",
    ["Component", "Layer and context", "Reached through"],
    arch.components.map(
      (c) =>
        `<tr><td>${componentLink(ctx, c.id)}${c.label ? `<br>${escape(c.label)}` : ""}</td><td>${escape(c.layer ?? "not stated")} · ${escape(c.context ?? "not stated")}</td><td>${lines([`Members its code satisfies: ${ids(c.members.satisfies, true)}`, `Members its code references: ${ids(c.members.references, true)}`, `What the slice rests on, realized here: ${ids(c.restsOn)}`, `Member designs naming it: ${ids(c.designs)}`])}</td></tr>`,
    ),
  );
  const comparison = (d: SliceDesign) =>
    lines([
      ...(!d.realized
        ? ["not compared"]
        : !d.differing.length && !d.unreadable.length
          ? ["matches"]
          : []),
      ...d.differing.map((f) =>
        f.field === "uses"
          ? `uses: only declared ${escape(value(f.planned))}; only anchored ${escape(value(f.realized))}`
          : `${escape(f.field)}: declared ${escape(value(f.planned))}; anchored ${escape(value(f.realized))}`,
      ),
      ...d.unreadable.map((u) => `${escape(u.key)}: unreadable ${escape(u.value)}, not compared`),
    ]);
  const designs = table(
    "Member component designs",
    ["Design", "Component", "Declared", "Anchor", "Comparison"],
    arch.designs.map(
      (d) =>
        `<tr><td>${link(ctx, d.spec, members.get(d.spec)?.title ?? d.spec)}<br>${code(d.spec)}</td><td>${code(d.componentId)}</td><td>${lines(
          (["layer", "context", "role", "uses"] as const).map((key) => {
            const unreadable = d.unreadable.find((u) => u.key === key);
            return `${key}: ${escape(unreadable ? `unreadable ${unreadable.value}` : value(d[key]))}`;
          }),
        )}</td><td>${d.realized ? "satisfies the design" : d.anchorExists ? "present, does not satisfy the design" : "absent"}</td><td>${comparison(d)}</td></tr>`,
    ),
  );
  const reachWords: Record<string, string> = {
    touchedUses: "a touched component uses it",
    usesTouched: "it uses a touched component",
    plannedUse: "a member design plans to use it",
  };
  const architecture =
    !arch.components.length && !arch.designs.length
      ? `<p>No component is touched and no member designs a component. ${String(a.boundary.restsOn.filter((b) => !b.implemented).length)} Specs the slice rests on have no implementation binding.</p>`
      : scopedArchitectureDiagrams(subject, arch, target)
          .map((d, i) =>
            renderDiagram(
              d,
              `${subject}.architecture${i ? `.${encodeURIComponent(d.occurrenceKey ?? String(i))}` : ""}`,
            ),
          )
          .join("");
  const decisions = table(
    "Decisions in scope",
    ["Decision", "Rung", "In the slice", "Shapes", "Questions"],
    a.decisions.map(
      (d) =>
        `<tr><td>${link(ctx, d.id, d.title ?? d.id)}<br>${code(d.id)}${d.refines.length ? `<br>refines ${ids(d.refines)}` : ""}${d.supersedes.length ? `<br>supersedes ${ids(d.supersedes)}` : ""}</td><td>${rungLine(d.statedReadiness, d.floorReached ?? "none")}</td><td>${d.member ? "member" : "outside"}</td><td>${ids(d.shapes, true)}</td><td>${String(d.openQuestions)} open, ${String(d.blockingQuestions)} blocking</td></tr>`,
    ),
  );
  const questions = list(
    [...a.questions]
      .sort((x, y) => Number(y.blocking) - Number(x.blocking))
      .map(
        (q) =>
          `${q.blocking ? "blocking" : "non-blocking"} · ${q.address ? `${link(ctx, q.address, q.address.split("#")[1])}${copy(q.address)} · ` : ""}${link(ctx, q.spec)} · ${text(ctx, q.question)}${lines([...(q.decider ? [`<b>Decider:</b> ${escape(q.decider)}`] : []), ...(q.links?.length ? [`<b>Links:</b> ${ids(q.links)}`] : []), ...(q.provisional ? [`<b>Provisional:</b> ${text(ctx, q.provisional)}`] : []), ...(q.trigger ? [`<b>Trigger:</b> ${text(ctx, q.trigger)}`] : []), ...(q.holds.length ? [`Holds: ${ids(q.holds, true)}`] : [])])}`,
      ),
    "questions",
  );
  const boundary = (
    [
      ["restsOn", "Rests on"],
      ["restedOnBy", "Rested on by"],
      ["verifiedBy", "Verified by"],
      ["supersededBy", "Superseded by"],
    ] as const
  )
    .map(
      ([key, label]) =>
        `<details class="section" id="boundary.${key}"><summary>${label} (${String(a.boundary[key].length)})</summary><div class="section-body">${table(
          label,
          ["Spec", "Rung", "Implementation binding", "Joined members", "Holds"],
          a.boundary[key].map(
            (b) =>
              `<tr><td>${link(ctx, b.id, b.title ?? b.id)}<br>${code(b.id)}</td><td>${rungLine(b.statedReadiness ?? undefined, b.floorReached ?? "none")}</td><td>${b.implemented ? "present" : "none"}</td><td>${lines(b.via.map((v) => `${escape(v.type)}: ${ids(v.members, true)}`))}</td><td>${ids(b.holds, true)}</td></tr>`,
          ),
        )}</div></details>`,
    )
    .join("");
  const t = a.totals;
  const count = (n: number, noun: string) => `${String(n)} ${noun}${n === 1 ? "" : "s"}`;
  const summary = [
    `${count(t.members, "member")}; ${count(t.exampleMembers, "example member")} counted in their parents.`,
    `${count(t.relations, "relation")} among members; deepest depth ${String(t.depth)}; ${count(t.cycles, "cycle")}.`,
    `${String(t.heldBelowNextRung)} member${t.heldBelowNextRung === 1 ? "" : "s"} held below their stated next rung; ${String(t.waitingForAuthor)} waiting only for their author.`,
    `${count(t.restsOn, "outside Spec")} the slice rests on; ${String(t.holdingOutside)} ${t.holdingOutside === 1 ? "holds" : "hold"} a member; ${count(t.restedOnBy, "outside Spec")} ${t.restedOnBy === 1 ? "rests" : "rest"} on it.`,
    `${count(t.components.touched, "component")} touched: ${String(t.components.throughMembers)} through members' code, ${String(t.components.throughRestsOn)} through what the slice rests on, ${String(t.components.throughDesigns)} named by member designs; ${count(t.components.outside, "outside component")} shown for context.`,
    `${count(t.designs.total, "member component design")}; ${String(t.designs.realized)} realized; ${String(t.designs.matching)} of those match.`,
    `${count(t.decisions, "decision")} in scope; ${String(t.decisionsBelowReady)} ${t.decisionsBelowReady === 1 ? "states" : "state"} below ready.`,
    `${count(t.openQuestions, "open question")}; ${String(t.blockingQuestions)} blocking.`,
  ].map(escape);
  const missing = a.scope.unresolved;
  if (missing.length > 0)
    summary.splice(
      1,
      0,
      `${count(missing.length, "manifest member")} ${missing.length === 1 ? "resolves" : "resolve"} to no Spec: ${missing.map((id) => code(id)).join(", ")}.`,
    );
  return frame(
    ctx,
    `Design slice: ${a.scope.title ?? subject}`,
    `<header class="page-head"><h1>Design slice: ${codeSpans(a.scope.title ?? subject)}</h1><div class="ids"><span>${code(subject)}</span>${copy(subject)}</div><p><a href="${escape(relative(ctx, packPath))}">Read the Pack member by member</a></p><h2>The design as a whole</h2>${list(summary, "summary")}<p class="reading-note">Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.</p></header><sdp-expander><h2 id="slice.dependencies">How the members rest on each other</h2>${renderDiagram(dependencyDiagram(subject, a, target), `${subject}.dependencies`)}<h2 id="slice.members">What each member needs next</h2>${table("What each member needs next", ["Member", "Depth", "Rung", "Next rung", "Design carried", "Code"], rows, "slice-members")}<h2 id="slice.architecture">The architecture it touches</h2>${architecture}<h3>Components the slice touches</h3>${touched}<h3>Member component designs</h3>${designs}<h3 id="slice.outside">Outside the slice, shown for context and not counted as touched</h3>${list(arch.outside.map((c) => `${c.anchored ? componentLink(ctx, c.id) : code(c.id)}${c.label ? ` · ${escape(c.label)}` : ""} · ${c.anchored ? "anchored" : "not anchored"} · ${c.reachedBy.map((h) => escape(reachWords[h] ?? h)).join("; ")}`))}<h3>Units bound to a member and to no component</h3>${list(arch.unplaced.map((u) => `${code(u.unit)} ${u.via === "satisfies" ? "implements" : "references"} ${memberLink(u.member)}`))}<h2 id="slice.decisions">Decisions in scope</h2>${decisions}<h2 id="slice.questions">Open questions in scope</h2>${questions}<h2 id="slice.boundary">Where the slice meets the rest</h2>${boundary}</sdp-expander>`,
  );
}
export { slicePath };

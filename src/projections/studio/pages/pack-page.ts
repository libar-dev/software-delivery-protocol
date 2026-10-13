import type { PackContext, PackMemberSummary } from "../../../reader/reader.js";
import type { PackTotals } from "../data.js";
import {
  code,
  copy,
  count,
  escape,
  findingList,
  link,
  list,
  present,
  questionFields,
  rungLine,
  unitList,
} from "./html.js";
import type { PageContext } from "./html.js";
import { frame } from "./frame.js";
import { prose, text } from "./text.js";

export function holds(
  ctx: PageContext,
  rung: string | undefined,
  failures: PackMemberSummary["statedNextRungFailures"],
): string {
  if (rung === undefined) return "";
  if (!failures?.length)
    return `<p>${escape(rung)}: nothing blocks; waiting for the author's statement.</p>`;
  return `<p>${escape(rung)} waits on ${String(failures.length)} unmet clauses:</p>${list(failures.map((f) => `${code(f.clauseId)} · ${escape(f.description)}${f.targets?.length ? list(f.targets.map((t) => `${escape(t.type)} · ${link(ctx, t.id)} · stated ${escape(t.statedReadiness ?? "not recorded")}`)) : ""}`))}`;
}

function memberCard(ctx: PageContext, member: PackMemberSummary, index: number): string {
  const opening = `<details class="card" id="${escape(member.id)}"><summary>`;
  if (!member.resolved)
    return `${opening}${String(index + 1)}. ${code(member.id)}</summary><div class="card-body"><p>The manifest names an id the graph does not hold.</p></div></details>`;
  const design = member.design;
  const next =
    member.statedNextRung === undefined
      ? ""
      : ` · ${escape(member.statedNextRung)}: ${(member.statedNextRungFailures?.length ?? 0) === 0 ? "nothing blocks" : `waits on ${String(member.statedNextRungFailures?.length)} unmet clauses`}`;
  const questions = list(
    (design?.openQuestions ?? []).map(
      (q) =>
        `${q.blocking ? "blocking" : "non-blocking"}${q.key === undefined ? "" : ` · ${link(ctx, `${member.id}#question.${q.key}`, `question.${q.key}`)} ${copy(`${member.id}#question.${q.key}`)}`}${q.line === undefined ? "" : ` · line ${String(q.line)}`} · ${text(ctx, q.question)}${questionFields(ctx, q, (v) => text(ctx, v))}`,
    ),
    "questions",
  );
  const decisions = list(
    (design?.decisions ?? []).map(
      (d) =>
        `${link(ctx, d.id, d.title ?? d.id)} · stated ${escape(d.statedReadiness ?? "not recorded")}${d.resolved ? "" : " · unresolved"}`,
    ),
  );
  const verifier = (member.verifiers?.enabled ?? 0) > 0;
  const counts =
    (member.verifiers?.total ?? 0) > 0 || (member.examples?.total ?? 0) > 0
      ? ` · ${String(member.verifiers?.total ?? 0)} verifiers, ${String(member.verifiers?.enabled ?? 0)} enabled · ${String(member.examples?.total ?? 0)} verifying examples, ${String(member.examples?.enabled ?? 0)} enabled`
      : "";
  return `${opening}<span class="line1">${String(index + 1)}. ${escape(member.title ?? member.id)}</span><span class="line2">${escape(member.specKind)} · ${rungLine(member.statedReadiness, member.derivedReadiness)}${next} · ${String(design?.openQuestions.length ?? 0)} open, ${String(design?.blockingQuestions ?? 0)} blocking questions · implementation binding ${present((member.implementations?.length ?? 0) > 0)} · verifier binding ${present(verifier)}</span></summary><div class="card-body"><p>${link(ctx, member.id)}</p>${holds(ctx, member.statedNextRung, member.statedNextRungFailures)}<h3>Design</h3><p>${count(design?.entries ?? 0, "design entry", "design entries")} · ${count(design?.declarations ?? 0, "pinned declaration")}</p>${design?.decisions.length ? `<h3>Decisions</h3>${decisions}` : ""}<h3>Open questions</h3>${questions}<h3>Implementation binding: ${present((member.implementations?.length ?? 0) > 0)}</h3>${unitList(member.implementations ?? [])}<h3>Design reference: ${present((member.references?.length ?? 0) > 0)}</h3>${unitList(member.references ?? [])}<h3>Verifier binding: ${present(verifier)}</h3><p>Verifier binding: ${present(verifier)}${counts}</p></div></details>`;
}

/**
 * Renders reader Pack totals, ordered member disclosures and the four boundary directions.
 * @sdpAnchor impl:protocol.studio-pack-page
 * @sdpSatisfies spec:consumers.spec-studio.pack-page
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function packPage(ctx: PageContext, pack: PackContext, totals: PackTotals): string {
  const held = pack.members.filter((m) => (m.statedNextRungFailures?.length ?? 0) > 0);
  const waiting = pack.members.filter(
    (m) => m.resolved && m.statedNextRung !== undefined && m.statedNextRungFailures?.length === 0,
  );
  const cards = (rows: readonly PackMemberSummary[], includeFailures = false): string =>
    rows
      .map(
        (m) =>
          `<a href="#${escape(m.id)}">${escape(m.title ?? m.id)}</a>${includeFailures ? ` (${String(m.statedNextRungFailures?.length ?? 0)} unmet clauses)` : ""}`,
      )
      .join(", ");
  const summary = [
    `${count(totals.members, "member")} in authored reading order; ${count(totals.unresolved, "unresolved member")}.`,
    `${count(totals.heldBelowNextRung, "member")} held below their stated next rung${held.length ? `: ${cards(held, true)}` : ""}.`,
    `${count(totals.waitingForAuthor, "member")} waiting only for their author's statement${waiting.length && waiting.length !== pack.members.length ? `: ${cards(waiting)}` : ""}.`,
    `${count(totals.entries, "design entry", "design entries")} and ${count(totals.declarations, "pinned declaration")}.`,
    `${count(totals.openQuestions, "open question")} and ${count(totals.blockingQuestions, "blocking question")}.`,
    `${count(totals.withImplementations, "member")} with an implementation binding.`,
    `${count(totals.withReferences, "member")} with a design reference.`,
    `${count(totals.restsOn, "outside Spec")} the Pack rests on; ${count(totals.restedOnBy, "outside Spec")} rest on the Pack; ${count(totals.verifiedBy, "outside Spec")} verify it; ${count(totals.supersededBy, "outside Spec")} supersede it.`,
  ];
  const boundary = (
    [
      ["restsOn", "Rests on"],
      ["restedOnBy", "Rested on by"],
      ["verifiedBy", "Verified by"],
      ["supersededBy", "Superseded by"],
    ] as const
  )
    .map(([key, title]) => {
      const rows = pack.boundary[key];
      return `<details class="section"><summary>${title} (${String(rows.length)})</summary><div class="section-body">${rows.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="${title}" tabindex="0"><table><thead><tr><th>Spec</th><th>Stated rung</th><th>Implementation binding</th><th>Joined members</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${link(ctx, row.id, row.title ?? row.id)}<br>${code(row.id)}</td><td>${escape(row.statedReadiness)}</td><td>${present(row.implemented)}</td><td>${row.via.map((v) => `${escape(v.type)}: ${v.members.map((id) => `<a href="#${escape(id)}">${escape(id)}</a>`).join(", ")}`).join("<br>")}</td></tr>`).join("")}</tbody></table></div>`}</div></details>`;
    })
    .join("");
  const gaps = [...pack.verifierGaps].sort((a, b) => Number(b.priority) - Number(a.priority));
  return frame(
    ctx,
    pack.title ?? pack.id,
    `<header class="page-head"><h1>${escape(pack.title ?? pack.id)}</h1><div class="ids"><span>${code(pack.id)}${copy(pack.id)}</span><span>${code(pack.file)}${copy(pack.file)}</span></div><h2>Where the design stands</h2><ul class="summary">${summary.map((s) => `<li>${s}</li>`).join("")}</ul></header><h2>Framing</h2>${prose(ctx, pack.framing)}${pack.modelRefs.length === 0 ? "" : `<p>Vocabulary: ${pack.modelRefs.map((id) => link(ctx, id)).join(", ")}</p>`}<h2>Members</h2><sdp-expander>${pack.members.map((m, i) => memberCard(ctx, m, i)).join("")}<h2>Boundary</h2>${boundary}<h2>No verifier binding</h2><p class="prose">The graph records bindings and never runs, so no page shows a run result.</p>${list(gaps.map((g) => `${link(ctx, g.id)} · stated ${escape(g.statedReadiness ?? "not recorded")}`))}<h2>Findings</h2>${findingList(
      ctx,
      ctx.data.findings.filter((f) => f.subjectId === pack.id),
    )}</sdp-expander>`,
    pack.id,
  );
}

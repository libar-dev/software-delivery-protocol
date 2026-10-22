import { slicePath } from "../paths.js";
import { exportPath } from "./export-page.js";
import { maturityMap } from "./maturity-map.js";
import { packChangeNote } from "./diff-page.js";
import type { PackContext, PackMemberSummary } from "../../../reader/reader.js";
import type { PackTotals } from "../data.js";
import {
  code,
  sourceCode,
  copy,
  count,
  escape,
  findingList,
  link,
  list,
  present,
  relative,
  questionFields,
  rungLine,
  unitList,
  verb,
} from "./html.js";
import type { PageContext } from "./html.js";
import { frame } from "./frame.js";
import { codeSpans, prose, text } from "./text.js";

export function holds(
  ctx: PageContext,
  rung: string | undefined,
  failures: PackMemberSummary["statedNextRungFailures"],
): string {
  if (rung === undefined) return "";
  if (!failures?.length)
    return `<p>Next rung ${escape(rung)}: nothing blocks; it waits only for the author's statement.</p>`;
  return `<p>Next rung ${escape(rung)} waits on ${count(failures.length, "unmet clause", "unmet clauses", false)}:</p>${list(failures.map((f) => `${code(f.clauseId)} · ${escape(f.description)}${f.targets?.length ? list(f.targets.map((t) => `${escape(t.type)} · ${link(ctx, t.id)} · stated ${escape(t.statedReadiness ?? "not recorded")}`)) : ""}`))}`;
}

function memberCard(ctx: PageContext, member: PackMemberSummary, index: number): string {
  const opening = `<sdp-spec-card spec-id="${escape(member.id)}" variant="full"><details class="card" id="${escape(member.id)}"><summary>`;
  if (!member.resolved)
    return `${opening}${String(index + 1)}. ${code(member.id)}</summary><div class="card-body"><p>The manifest names an id the graph does not hold.</p></div></details></sdp-spec-card>`;
  const design = member.design;
  const next =
    member.statedNextRung === undefined
      ? ""
      : ` · next rung ${escape(member.statedNextRung)}: ${(member.statedNextRungFailures?.length ?? 0) === 0 ? "nothing blocks" : `waits on ${count(member.statedNextRungFailures?.length ?? 0, "unmet clause", "unmet clauses", false)}`}`;
  const questions = list(
    (design?.openQuestions ?? []).map(
      (q) =>
        `${q.blocking ? "blocking" : "non-blocking"}${q.key === undefined ? "" : ` · ${link(ctx, `${member.id}#question.${q.key}`, `question.${q.key}`)} ${copy(`${member.id}#question.${q.key}`)}`}${q.line === undefined ? "" : ` · line ${String(q.line)} · ${sourceCode(ctx.data.specs.find((s) => s.id === member.id)?.file, q.line)}`} · ${text(ctx, q.question)}${questionFields(ctx, q, (v) => text(ctx, v))}`,
    ),
    "questions",
  );
  const decisions = list(
    (design?.decisions ?? []).map(
      (d) =>
        `${link(ctx, d.id, d.title ?? d.id, codeSpans(d.title ?? d.id))} · stated ${escape(d.statedReadiness ?? "not recorded")}${d.resolved ? "" : " · unresolved"}`,
    ),
  );
  const verifier = (member.verifiers?.enabled ?? 0) > 0;
  const counts =
    (member.verifiers?.total ?? 0) > 0 || (member.examples?.total ?? 0) > 0
      ? `${count(member.verifiers?.total ?? 0, "verifier")}, ${String(member.verifiers?.enabled ?? 0)} enabled · ${count(member.examples?.total ?? 0, "verifying example", "verifying examples", false)}, ${String(member.examples?.enabled ?? 0)} enabled`
      : "";
  return `${opening}<span class="line1">${String(index + 1)}. ${codeSpans(member.title ?? member.id)}</span><span class="line2">${escape(member.specKind)} · ${rungLine(member.statedReadiness, member.derivedReadiness)}${next} · ${String(design?.openQuestions.length ?? 0)} open, ${String(design?.blockingQuestions ?? 0)} blocking questions · implementation binding ${present((member.implementations?.length ?? 0) > 0)} · verifier binding ${present(verifier)}</span></summary><div class="card-body"><p>${link(ctx, member.id)}</p>${holds(ctx, member.statedNextRung, member.statedNextRungFailures)}<h3>Design</h3><p>${count(design?.entries ?? 0, "design entry", "design entries")} · ${count(design?.declarations ?? 0, "pinned declaration", "pinned declarations", false)}</p>${design?.decisions.length ? `<h3>Decisions</h3>${decisions}` : ""}<h3>Open questions</h3>${questions}<h3>Implementation binding: ${present((member.implementations?.length ?? 0) > 0)}</h3>${member.implementations?.length ? unitList(member.implementations, ctx) : ""}<h3>Design reference: ${present((member.references?.length ?? 0) > 0)}</h3>${member.references?.length ? unitList(member.references, ctx) : ""}<h3>Verifier binding: ${present(verifier)}</h3>${counts ? `<p>${counts}</p>` : ""}</div></details></sdp-spec-card>`;
}

/**
 * Renders reader Pack totals, ordered member disclosures and the four boundary directions.
 * @sdpAnchor impl:protocol.studio-pack-page
 * @sdpSatisfies spec:consumers.spec-studio.pack-page, spec:consumers.spec-studio.export, spec:consumers.spec-studio.components
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 * @sdpLabel renders Pack members, maturity and boundary joins
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
          `<a href="#${escape(m.id)}">${codeSpans(m.title ?? m.id)}</a>${includeFailures ? ` (${count(m.statedNextRungFailures?.length ?? 0, "unmet clause", "unmet clauses", false)})` : ""}`,
      )
      .join(", ");
  const summary = [
    `${count(totals.members, "member")} in authored reading order; ${count(totals.unresolved, "unresolved member", "unresolved members", false)}.`,
    `${count(totals.heldBelowNextRung, "member")} held below their stated next rung${held.length ? `: ${cards(held, true)}` : ""}.`,
    `${count(totals.waitingForAuthor, "member")} waiting only for their author's statement${waiting.length && waiting.length !== pack.members.length ? `: ${cards(waiting)}` : ""}.`,
    `${count(totals.entries, "design entry", "design entries")} and ${count(totals.declarations, "pinned declaration", "pinned declarations", false)}.`,
    `${count(totals.openQuestions, "open question")} and ${count(totals.blockingQuestions, "blocking question", "blocking questions", false)}.`,
    `${count(totals.withImplementations, "member")} with an implementation binding.`,
    `${count(totals.withReferences, "member")} with a design reference.`,
    `${count(totals.restsOn, "outside Spec")} the Pack rests on; ${count(totals.restedOnBy, "outside Spec", "outside Specs", false)} ${verb(totals.restedOnBy, "rest")} on the Pack; ${count(totals.verifiedBy, "outside Spec", "outside Specs", false)} ${verb(totals.verifiedBy, "verify", "verifies")} it; ${count(totals.supersededBy, "outside Spec", "outside Specs", false)} ${verb(totals.supersededBy, "supersede")} it.`,
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
      return `<details class="section"><summary>${title} (${String(rows.length)})</summary><div class="section-body">${rows.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="${title}" tabindex="0"><table><thead><tr><th>Spec</th><th>Stated rung</th><th>Implementation binding</th><th>Joined members</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${link(ctx, row.id, row.title ?? row.id, codeSpans(row.title ?? row.id))}<br>${code(row.id)}</td><td>${escape(row.statedReadiness)}</td><td>${present(row.implemented)}</td><td>${row.via.map((v) => `${escape(v.type)}: ${v.members.map((id) => `<a href="#${escape(id)}">${escape(id)}</a>`).join(", ")}`).join("<br>")}</td></tr>`).join("")}</tbody></table></div>`}</div></details>`;
    })
    .join("");
  const gaps = [...pack.verifierGaps].sort((a, b) => Number(b.priority) - Number(a.priority));
  return frame(
    ctx,
    pack.title ?? pack.id,
    `<header class="page-head"><h1>${codeSpans(pack.title ?? pack.id)}</h1><div class="ids"><span>${code(pack.id)}${copy(pack.id)}</span><span>${code(pack.file)}${copy(pack.file)}</span></div><p><a href="${escape(relative(ctx, slicePath(pack.id)))}">Read this Pack as one design</a></p><p class="export-download"><a href="${escape(relative(ctx, exportPath(pack.id)))}" download="${escape(exportPath(pack.id).split("/").at(-1))}">Download this Pack as one file</a></p><sdp-compose scope="${escape(pack.id)}" action="change-entry" members-complete="${String(pack.members.every((m) => m.resolved))}" members="${escape(
      pack.members
        .filter((m) => m.resolved)
        .map((m) => m.id)
        .join(" "),
    )}"></sdp-compose><h2>Where the design stands</h2><ul class="summary">${summary.map((s) => `<li>${s}</li>`).join("")}</ul></header>${maturityMap(pack)}<h2>Framing</h2>${prose(ctx, pack.framing)}${pack.modelRefs.length === 0 ? "" : `<p>Vocabulary: ${pack.modelRefs.map((id) => link(ctx, id)).join(", ")}</p>`}${packChangeNote(ctx, pack.id)}<h2>Members</h2><sdp-expander>${pack.members.map((m, i) => memberCard(ctx, m, i)).join("")}<h2>Boundary</h2>${boundary}<h2>Members with no verifier binding</h2><p class="prose">The graph records bindings and never runs${ctx.data.recipes.all.has(45) ? "" : ", so no page shows a run result"}. Decision records are left out: a decision never needs a verifier binding.${ctx.data.recipes.all.has(45) ? ` The <a href="${escape(relative(ctx, "runs.html"))}">runs page</a>, the <a href="${escape(relative(ctx, "tests.html"))}">tests lens</a> and the Spec pages of the Specs their files verify show the run records as external evidence from test files.` : ""}</p>${list(gaps.map((g) => `${link(ctx, g.id, ctx.data.specs.find((s) => s.id === g.id)?.title ?? g.id, codeSpans(ctx.data.specs.find((s) => s.id === g.id)?.title ?? g.id))} · ${code(g.id)} · stated ${escape(g.statedReadiness ?? "not recorded")}`))}<h2>Findings</h2><sdp-validation-findings filter="${escape(pack.id)}">${findingList(
      ctx,
      ctx.data.findings.filter((f) => f.subjectId === pack.id),
    )}</sdp-validation-findings></sdp-expander>`,
    pack.id,
  );
}

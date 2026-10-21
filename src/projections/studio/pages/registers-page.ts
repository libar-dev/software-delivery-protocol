import { frame } from "./frame.js";
import { badge, code, copy, escape, link, list, location, questionFields } from "./html.js";
import type { PageContext } from "./html.js";
import { text } from "./text.js";
import { answer } from "./register-answers.js";
import type { Decision, Question } from "./register-answers.js";
import { filtered, filterBar, packFacet, summary, titleLink } from "./register-common.js";

const linked = (ctx: PageContext, ids: readonly string[]): string =>
  ids.length ? ids.map((id) => link(ctx, id)).join(", ") : "None";
function questionRow(ctx: PageContext, id: string, q: Question): string {
  const address = q.key === null ? null : `${id}#question.${q.key}`;
  return `<li data-row data-blocking="${q.blocking ? "blocking" : "non-blocking"}" data-decider="${escape(q.decider ?? "not-stated")}" data-deferral="${q.deferral ? "deferral" : "question"}" data-pack="${escape(ctx.data.specs.find((s) => s.id === id)?.packs.join(" ") ?? "")}">${q.blocking ? "blocking" : "non-blocking"}${q.deferral ? " · deferral" : ""}${address === null ? "" : ` · ${link(ctx, address, `question.${q.key ?? ""}`)}${copy(address)}`} · ${text(ctx, q.question)}${questionFields(ctx, { index: 0, question: q.question, blocking: q.blocking, ...(q.decider === null ? {} : { decider: q.decider }), ...(q.links.length === 0 ? {} : { links: q.links }), ...(q.provisional === null ? {} : { provisional: q.provisional }), ...(q.trigger === null ? {} : { trigger: q.trigger }) }, (value) => text(ctx, value))}</li>`;
}
function decisionRelations(
  ctx: PageContext,
  row: Decision,
  key: "supersedes" | "supersededBy" | "refines" | "refinedBy",
  label: string,
): string {
  const incoming = key === "supersededBy" || key === "refinedBy";
  const type = key.startsWith("supersed") ? "supersedes" : "refines";
  const rows = answer(ctx, 31).rows;
  return `<p><b>${label}:</b> ${
    row[key].length
      ? row[key]
          .map((id) => {
            const reasons = (
              incoming ? (rows.find((r) => r.id === id)?.reasons ?? []) : row.reasons
            ).filter((r) => r.type === type && r.to === (incoming ? row.id : id));
            return `${link(ctx, id)}${reasons.map((r) => `<span class="field">${text(ctx, r.reason)}</span>`).join("")}`;
          })
          .join(", ")
      : "None"
  }</p>`;
}
/**
 * @sdpAnchor impl:protocol.studio-registers
 * @sdpSatisfies spec:consumers.spec-studio.registers
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.studio-recipes
 * @sdpRole projection
 */
export function questionsPage(ctx: PageContext): string {
  const result = answer(ctx, 20);
  const totals = result.totals;
  const filters = filterBar({
    blocking: { label: "Blocking flag", values: ["blocking", "non-blocking"] },
    decider: {
      label: "Decider",
      values: result.specs.flatMap((s) => s.questions.map((q) => q.decider ?? "not-stated")),
    },
    deferral: { label: "Deferral", values: ["deferral", "question"] },
    pack: packFacet(ctx),
  });
  const body = result.specs
    .map(
      (s) =>
        `<section data-question-spec="${escape(s.id)}"><h2>${titleLink(ctx, s.id)} · ${badge(s.statedReadiness)}</h2><p>${code(s.id)}</p><ul class="questions">${s.questions.map((q) => questionRow(ctx, s.id, q)).join("")}</ul></section>`,
    )
    .join("");
  const lines = Object.entries(totals).map(
    ([key, n]) =>
      `${String(n)} ${({ questions: "open questions", blocking: "blocking questions", nonBlocking: "non-blocking questions", deferrals: "deferrals", holds: "blocking questions without a trigger", specs: "Specs with questions", specsWithBlocking: "Specs with blocking questions", malformed: "malformed entries" } as Record<string, string>)[key] ?? key}.`,
  );
  return frame(
    ctx,
    "Questions",
    `<header class="page-head"><h1>Open questions</h1><p>Recipe 20, the open-question register.</p>${summary(lines)}</header>${filtered(body || "<p>No open questions.</p>", filters, totals.questions ?? 0)}${result.malformed.length ? `<h2>Malformed entries</h2><pre>${escape(JSON.stringify(result.malformed, null, 2))}</pre>` : ""}`,
  );
}
export function decisionsPage(ctx: PageContext): string {
  const result = answer(ctx, 31),
    t = result.totals;
  return frame(
    ctx,
    "Decisions",
    `<header class="page-head"><h1>Decisions</h1><p>Recipe 31, the decision register.</p>${summary([`${String(t.decisions)} decisions.`, ...Object.entries(t.byRung).map(([rung, n]) => `${String(n)} decisions stated ${escape(rung)}.`), `${String(t.superseded)} superseded decisions.`, `${String(t.shapingNothing)} decisions shaping no Spec.`])}</header>${result.rows.map((row) => `<section class="spec-row"><h2>${titleLink(ctx, row.id)}</h2><p>${code(row.id)} · ${badge(row.statedReadiness)}${row.supersededBy.length ? " · superseded" : ""}</p>${decisionRelations(ctx, row, "supersedes", "Supersedes")}${decisionRelations(ctx, row, "supersededBy", "Superseded by")}${decisionRelations(ctx, row, "refines", "Refines")}${decisionRelations(ctx, row, "refinedBy", "Refined by")}<p><b>Shapes:</b> ${String(row.shapes.length)} Specs · ${linked(ctx, row.shapes)}</p><p><b>Questions:</b> ${row.questions.length ? row.questions.map((q) => `${q.blocking ? "blocking" : "non-blocking"} · ${link(ctx, q.address)}`).join(", ") : "None"}</p></section>`).join("") || "<p>No decisions.</p>"}`,
  );
}
export function declarationsPage(ctx: PageContext): string {
  const result = answer(ctx, 24),
    citations = answer(ctx, 51);
  const ids = [...new Set(result.rows.map((r) => r.spec))];
  const body = ids
    .map(
      (id) =>
        `<section><h2>${titleLink(ctx, id)}</h2>${result.rows
          .filter((r) => r.spec === id)
          .map((row) => {
            const address = `${id}#design.${row.key}`,
              cites = citations.entries.find((e) => e.address === address)?.citedBy ?? [];
            return `<article class="spec-row" data-row data-citation="${cites.length ? "recorded" : "none"}"><h3>${link(ctx, address, row.key)}</h3><pre><code>${escape(row.declaration)}</code></pre><p>Cited at</p>${cites.length ? list(cites.map((c) => `${code(location(c.file, c.line))}${copy(location(c.file, c.line))}${c.testAnchors.length ? " · test line" : ""}`)) : "<p>no citation recorded</p>"}</article>`;
          })
          .join("")}</section>`,
    )
    .join("");
  return frame(
    ctx,
    "Declarations",
    `<header class="page-head"><h1>Pinned declarations</h1><p>Recipe 24 with recipe 51's entry citations.</p>${summary([`${String(result.totals.entries)} pinned declarations.`, `${String(result.totals.specs)} Specs pin declarations.`])}</header>${filtered(body || "<p>No pinned declarations.</p>", filterBar({ citation: { label: "Citation", values: ["recorded", "none"] } }), result.totals.entries)}`,
  );
}
export function backlogPage(ctx: PageContext): string {
  const result = answer(ctx, 33),
    t = result.totals;
  return frame(
    ctx,
    "Backlog",
    `<header class="page-head"><h1>Design backlog</h1><p>Recipe 33, defined Specs without an implementation binding.</p>${summary([`${String(t.specs)} Specs in the design backlog.`, ...Object.entries(t.byFamily).map(([family, n]) => `${String(n)} Specs in ${escape(family)}.`), `${String(t.excludedExamples)} examples and ${String(t.excludedDecisions)} decisions left out.`, `${String(t.withReferences)} Specs with design references.`])}</header>${list(result.rows.map((row) => `<h2>${titleLink(ctx, row.id)}</h2>${code(row.id)}<p>${escape(row.specKind)} · ${escape(row.altitude)} · floor ${escape(row.floorReached)}</p><p>Unmet clauses: ${row.statedNextRungFailures.length ? row.statedNextRungFailures.map(code).join(", ") : "None"}</p><p>${String(row.design.entries)} entries, ${String(row.design.declarations)} declarations, ${String(row.design.openQuestions)} open, ${String(row.design.blockingQuestions)} blocking</p><p>Referencing units: ${row.referencedBy.length ? row.referencedBy.map(code).join(", ") : "None"}</p>`))}`,
  );
}

import { frame } from "./frame.js";
import { code, copy, escape, link, list } from "./html.js";
import type { PageContext } from "./html.js";
import { text } from "./text.js";
import { answer } from "./register-answers.js";
import { filtered, filterBar, packFacet, summary, titleLink } from "./register-common.js";

/**
 * @sdpAnchor impl:protocol.studio-owner-queue
 * @sdpReferences spec:consumers.spec-studio.owner-queue
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.studio-recipes
 * @sdpRole projection
 */
export function queuePage(ctx: PageContext): string {
  const q = answer(ctx, 46),
    t = q.totals;
  const readyNow = q.statements.filter((s) => s.restsOn.length === 0).length;
  const statements = `<ol class="statement-list">${q.statements.map((s) => `<li class="spec-row" id="${escape(s.id)}" data-row data-statement="${escape(s.id)}" data-pack="${escape(s.packs.join(" "))}" data-floor="${escape(s.floorReached)}" value="${String(s.place)}"><h3>${titleLink(ctx, s.id)}</h3><p>${code(s.id)} · ${escape(s.specKind)} · stated ${escape(s.statedReadiness)} · floor allows ${escape(s.floorReached)} · Round ${String(s.round)}</p><p>rests on ${s.restsOn.length ? s.restsOn.map((id) => `<a href="#${escape(id)}">${escape(id)}</a>`).join(", ") : "no waiting Spec · can be made now"}</p><p>Packs: ${s.packs.length ? s.packs.map((id) => link(ctx, id)).join(", ") : "None"}</p></li>`).join("")}</ol>`;
  const statementFilters = filterBar({
    pack: packFacet(ctx),
    floor: { label: "Floor allows", values: q.statements.map((s) => s.floorReached) },
  });
  const questionFilters = filterBar({ pack: packFacet(ctx) });
  const questions = list(
    q.questions.map(
      (row) =>
        `<div data-row data-pack="${escape(ctx.data.specs.find((s) => s.id === row.spec)?.packs.join(" ") ?? "")}"><p>${row.blocking ? "blocking" : "non-blocking"} · ${row.address === null ? titleLink(ctx, row.spec) : `${link(ctx, row.address)}${copy(row.address)}`}</p><p>${text(ctx, row.question)}</p><p>holds ${row.holds.length ? row.holds.map((id) => link(ctx, id)).join(", ") : "no Specs"}</p></div>`,
    ),
  );
  return frame(
    ctx,
    "Owner queue",
    `<header class="page-head"><h1>Owner queue</h1><p>Recipe 46, the statement queue. A rung stays a person's edit of a carrier.</p>${summary([`${String(t.waiting)} statements waiting.`, `${String(readyNow)} statements rest on no waiting Spec and can be made now.`, `${String(t.firstRound)} statements in round 1, across ${String(t.rounds)} rounds.`, `${String(t.blockingQuestions)} blocking and ${String(t.questions - t.blockingQuestions)} non-blocking owner questions.`, `${String(t.cycles)} dependency cycles.`, `${String(t.withoutDecider)} questions have no decider, ${String(t.blockingWithoutDecider)} blocking.`])}</header><h2>Waiting statements</h2>${filtered(q.statements.length ? statements : "<p>No waiting statements.</p>", statementFilters, t.waiting)}<h2>Owner questions</h2>${filtered(q.questions.length ? questions : "<p>No questions name the owner as decider.</p>", questionFilters, t.questions)}<h2>Dependency cycles</h2>${list(q.cycles.map((c) => `${c.cycle.map((id) => `<a href="#${escape(id)}">${escape(id)}</a>`).join(" → ")}<p>These waiting Specs share a round.</p>`))}`,
  );
}

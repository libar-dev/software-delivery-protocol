import { frame } from "./frame.js";
import { badge, code, copy, escape, link, list, relative, rungLine, verb } from "./html.js";
import type { PageContext } from "./html.js";
import { answer } from "./register-answers.js";
import type {
  Roadmap,
  RoadmapEntry,
  RoadmapNeed,
  RoadmapPart,
  RoadmapQuestion,
} from "./register-answers.js";
import { filtered, filterBar, summary, titleLink, total } from "./register-common.js";
import { text, codeSpans } from "./text.js";
import { pagePath } from "../paths.js";

const needs = ["to design", "to state", "to build", "built"] as const;
const labels = ["To design", "To state", "To build", "Built"] as const;
const slug = (need: RoadmapNeed) => need.replaceAll(" ", "-");
const prefix = (pack: string) => `roadmap-${pagePath(pack)?.slice(6, -5) ?? ""}`;
const entryId = (pack: string, place: number) => `${prefix(pack)}-entry-${String(place)}`;
const entryLink = (pack: string, place: number, labelHtml = escape(`entry ${String(place)}`)) =>
  `<a href="#${escape(entryId(pack, place))}">${labelHtml}</a>`;
const via: Readonly<Record<string, string>> = {
  dependsOn: "depends on",
  constrainedBy: "constrained by",
  decidedBy: "decided by",
  refines: "refines",
};

function holds(ctx: PageContext, rows: RoadmapPart["holdsNextRung"]): string {
  return rows.length === 0
    ? "nothing blocks"
    : `held by ${rows.map((row) => `${code(row.clause)}${row.targets.length ? ` (${row.targets.map((id) => link(ctx, id)).join(", ")})` : ""}`).join(", ")}`;
}
function questionLink(ctx: PageContext, q: RoadmapQuestion): string {
  return q.address === null
    ? `${link(ctx, q.spec)} question ${String(q.index + 1)}`
    : `${link(ctx, q.address)}${copy(q.address)}`;
}
function entryRow(ctx: PageContext, pack: string, entry: RoadmapEntry): string {
  const fields: string[] = [];
  const field = (label: string, value: string) => {
    if (value) fields.push(`<div class="field"><b>${label}:</b> ${value}</div>`);
  };
  field("Id", link(ctx, entry.id));
  if (entry.statedNextRung !== null)
    field(
      "Next",
      `${badge(entry.statedReadiness)} → ${badge(entry.statedNextRung)} · ${holds(ctx, entry.holdsNextRung)}`,
    );
  const part = (row: RoadmapPart) =>
    `${link(ctx, row.id, row.id === entry.id ? "itself" : row.id)} · ${escape(row.need)} · ${rungLine(row.statedReadiness, row.floorReached ?? "none")}${row.statedNextRung === null ? "" : ` → ${badge(row.statedNextRung)} · ${holds(ctx, row.holdsNextRung)}`}${row.drift ? " · <strong>drift</strong>" : ""}`;
  const setting = entry.workRows.filter((row) => row.need === entry.need);
  const ordered = [
    ...setting.filter((row) => row.id === entry.id),
    ...setting.filter((row) => row.id !== entry.id),
  ];
  const rest = entry.workRows.filter((row) => row.need !== entry.need);
  if (entry.workRows.length > 1 || setting.some((row) => row.id !== entry.id))
    field(
      "Parts",
      `${list(ordered.map(part))}${rest.length ? `<details><summary>${total(rest.length, "other part")}</summary>${list(rest.map(part))}</details>` : ""}`,
    );
  field("Build now", entry.buildNow.map((id) => titleLink(ctx, id)).join(", "));
  field(
    "Blocked by",
    listIf(
      entry.blockingQuestions.map(
        (q) => `${questionLink(ctx, q)} · ${escape(q.decider ?? "no decider")}`,
      ),
    ),
  );
  field(
    "Decided by",
    listIf(
      entry.decisions.map(
        (d) =>
          `${link(ctx, d.id)} ${badge(d.statedReadiness)}${d.blockingQuestions.length ? ` · blocked by ${d.blockingQuestions.map((q) => questionLink(ctx, q)).join(", ")}` : ""}`,
      ),
    ),
  );
  const restItem = (row: RoadmapEntry["restsOn"][number]) =>
    `${link(ctx, row.id)} · ${escape(via[row.via] ?? row.via)}${row.from.some((id) => id !== entry.id) ? ` from ${row.from.map((id) => link(ctx, id, id === entry.id ? "itself" : id)).join(", ")}` : ""} · ${escape(row.need)}${row.holdsReady ? " · holds ready" : ""} · ${row.onRoadmap === null ? "outside the roadmap" : entryLink(pack, row.onRoadmap)}`;
  const prominent = entry.restsOn.filter(
    (row) => row.need === "to design" || row.onRoadmap !== null || row.holdsReady,
  );
  const folded = entry.restsOn.filter((row) => !prominent.includes(row));
  field(
    "Rests on",
    `${listIf(prominent.map(restItem))}${folded.length ? `<details><summary>${total(folded.length, "more dependency", "more dependencies")}</summary>${list(folded.map(restItem))}</details>` : ""}`,
  );
  field(
    "Waited on by",
    listIf(
      entry.restedOnBy.map(
        (row) =>
          `${link(ctx, row.id)} · ${escape(via[row.via] ?? row.via)} · ${escape(row.need)}${row.onRoadmap === null ? "" : ` · ${entryLink(pack, row.onRoadmap)}`}`,
      ),
    ),
  );
  if (entry.need === "to state")
    field(
      "Earlier statements",
      entry.earlierStatements.length
        ? list(
            entry.earlierStatements.map(
              (row) =>
                `${link(ctx, row.id)} · ${row.where === "entry" ? "in this entry" : row.where === "roadmap" && row.onRoadmap !== null ? entryLink(pack, row.onRoadmap) : "outside the roadmap"}`,
            ),
          )
        : "",
    );
  field("Also in", entry.packs.map((id) => link(ctx, id)).join(", "));
  field(
    "Shares Specs with",
    entry.sharesScopeWith.map((place) => entryLink(pack, place)).join(", "),
  );
  const work = entry.work;
  const counts = [work.toDesign, work.toState, work.toBuild, work.built].flatMap((n, at) =>
    n ? [`${String(n)} ${needs[at] ?? ""}`] : [],
  );
  return `<li value="${String(entry.place)}" data-row data-need="${slug(entry.need)}"><details class="card" id="${escape(entryId(pack, entry.place))}"><summary><span class="line1">${String(entry.place)}. ${codeSpans(entry.title ?? entry.id)}</span><span class="line2">${escape(entry.specKind)} · ${escape(entry.altitude)} · ${rungLine(entry.statedReadiness, entry.floorReached ?? "none")} · ${total(work.specs, "Spec")}: ${counts.join(", ")}${work.drift ? ` · <strong>${String(work.drift)} drift</strong>` : ""}</span></summary><div class="card-body">${fields.join("")}</div></details></li>`;
}
const listIf = (rows: readonly string[]) => (rows.length ? list(rows) : "");

function roadmapSection(ctx: PageContext, r: Roadmap, memo: string): string {
  const t = r.totals;
  const question = (q: RoadmapQuestion & { readonly places: readonly number[] }) =>
    `<p>${q.blocking ? "blocking" : "non-blocking"} · ${questionLink(ctx, q)}</p><p>${text(ctx, q.question)}</p>${q.provisional === null ? "" : `<p>Provisional: ${text(ctx, q.provisional)}</p>`}<p>Touches ${q.places.map((p) => entryLink(r.pack, p)).join(", ")}</p>`;
  const board = `<div class="roadmap-board" role="group" aria-label="Entries by what each needs next">${needs
    .map((need, at) => {
      const rows = r.entries.filter((entry) => entry.need === need);
      return `<section class="board-column"><h3>${labels[at] ?? ""} <span class="floor">${String(rows.length)}</span></h3>${rows.length ? `<ol>${rows.map((entry) => `<li value="${String(entry.place)}"><span class="place">${String(entry.place)}</span>${entryLink(r.pack, entry.place, codeSpans(entry.title ?? entry.id))}</li>`).join("")}</ol>` : "<p>none</p>"}</section>`;
    })
    .join("")}</div>`;
  const lists = needs
    .map((need, at) => {
      const entries = r.entries.filter((entry) => entry.need === need);
      return `<h3>${labels[at] ?? ""}</h3>${entries.length ? `<ol class="roadmap-list">${entries.map((entry) => entryRow(ctx, r.pack, entry)).join("")}</ol>` : `<p>No entry has the need ${escape(need)}.</p>`}`;
    })
    .join("");
  const filters = filterBar({ need: { label: "Need", values: needs, ordered: true } }).replace(
    /value="(to design|to state|to build)"/gu,
    (_, need: RoadmapNeed) => `value="${slug(need)}"`,
  );
  const waiting = [
    ...r.waiting.questions.map(question),
    ...r.waiting.statements.map(
      (s) =>
        `<p data-statement="${escape(s.id)}">Statement · ${link(ctx, s.id)} states ${badge(s.statedReadiness)}, floor allows ${badge(s.floorReached)} · ${s.places.map((p) => entryLink(r.pack, p)).join(", ")}</p>`,
    ),
  ];
  const memoId = `${prefix(r.pack)}-memo`;
  const headingId = `${prefix(r.pack)}-heading`;
  return `<section class="roadmap" aria-labelledby="${escape(headingId)}"><h2 id="${escape(headingId)}">${link(ctx, r.pack, r.title ?? r.pack, codeSpans(r.title ?? r.pack))}</h2>${(
    r.framing ?? ""
  )
    .split(/\n\s*\n/u)
    .filter((p) => p.trim())
    .map((p) => `<p>${text(ctx, p)}</p>`)
    .join("")}${summary([
    `${total(t.entries, "entry", "entries")} ${r.order === "priority" ? "in priority order" : "in authored reading order"}: ${String(t.toDesign)} to design, ${String(t.toState)} to state, ${String(t.toBuild)} to build, ${String(t.built)} built, ${String(t.apart)} listed apart.`,
    `${String(t.blockingQuestions)} blocking and ${String(t.questions - t.blockingQuestions)} non-blocking questions wait on the owner; ${String(t.withoutDecider)} name no decider, ${String(t.blockingWithoutDecider)} of them blocking.`,
    `${total(t.statements, "statement")} ${verb(t.statements, "wait")} for a person; the <a href="${relative(ctx, "queue.html")}">owner queue</a> lists them all.`,
  ])}${board}<p class="prose">${escape("To state means the floor allows ready and a person still judges the statement. Built means every Spec of the entry's work states ready and has an implementation binding; it reports no passing test and no deployment. The entry's own readiness is shown separately.")}</p>${filtered(lists, filters, r.entries.length)}${r.apart.length ? `<h3>Listed apart</h3>${list(r.apart.map((row) => `<span id="${escape(entryId(r.pack, row.place))}">${String(row.place)}. ${titleLink(ctx, row.id)} · ${escape(row.specKind)} · ${badge(row.statedReadiness)} · ${escape(row.need)}</span>`))}` : ""}<h3>Waiting on the owner</h3>${waiting.length ? list(waiting) : "<p>Nothing in these entries waits on the owner.</p>"}${r.waiting.withoutDecider.length ? `<h3>Questions without a decider</h3><p>These questions have no named decider.</p>${list(r.waiting.withoutDecider.map(question))}` : ""}<details class="section"><summary>The forward section, as Markdown</summary><div class="section-body">${copy(memo)}<pre id="${escape(memoId)}">${escape(memo)}</pre></div></details></section><!-- roadmap -->`;
}

/**
 * @sdpAnchor impl:protocol.studio-roadmap-page
 * @sdpLabel renders roadmap needs, holding parts and the shared Markdown memo
 * @sdpSatisfies spec:consumers.spec-studio.roadmap-page, spec:consumers.roadmap.memo
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */
export function roadmapPage(ctx: PageContext): string {
  const roadmaps = answer(ctx, 53).roadmaps;
  return frame(
    ctx,
    "Roadmap",
    `<header class="page-head"><h1>Roadmap</h1><p>What comes next, from the graph. A place is advisory priority: never a date, a deadline or permission to start.</p></header>${
      roadmaps.length
        ? roadmaps
            .map((r) => {
              const memo = ctx.data.recipes.roadmapMemos.get(r.pack);
              if (memo === undefined) throw new Error(`Roadmap memo is missing: ${r.pack}`);
              return roadmapSection(ctx, r, memo);
            })
            .join("")
        : "<p>This corpus states no roadmap. A Pack becomes one when its manifest states <code>order: priority</code>.</p>"
    }`,
  );
}

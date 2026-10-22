// Prototype of the roadmap page and the roadmap memo. Throwaway evidence, never product code.
// Usage: node build.mjs <worktree> <platform-copy>
// It runs the drafted recipe 53 and 55 bodies through `sdp q` on each corpus, writes the answer,
// the memo and a static page per corpus beside this script, and drops a copy of each page into
// that corpus's built Studio so its links resolve there.
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const body53 = readFileSync(join(here, "recipe-53-the-roadmap.body"), "utf8");
export const body55 = readFileSync(join(here, "recipe-55-the-roadmap-memo.body"), "utf8").replace("/*RECIPE53*/", body53);

export const query = (sdp, corpus, body, params) => {
  const args = [sdp, "q", body, "--root", corpus.root, ...corpus.exclude.flatMap((path) => ["--exclude", path]), "--params", JSON.stringify(params), "--json"];
  return JSON.parse(execFileSync("node", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
};

const escape = (value) => String(value ?? "").replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;").replace(/'/gu, "&#39;");
const pageName = (id) => id.slice(id.indexOf(":") + 1).replace(/[A-Z]/gu, (letter) => `_${letter.toLowerCase()}`);
const specLink = (id, text) => `<a href="specs/${pageName(id)}.html">${escape(text ?? id)}</a>`;
const addressLink = (address) => {
  const [id, fragment] = address.split("#");
  return `<a href="specs/${pageName(id)}.html#${escape(fragment)}">${escape(address)}</a>`;
};
const inline = (text) => escape(text).replace(/`([^`]+)`/gu, "<code>$1</code>");
const badge = (rung) => `<span class="badge rung-${escape(rung)}">${escape(rung)}</span>`;
const laneNames = ["to design", "to state", "to build", "built"];
const laneSlug = (lane) => lane.replace(/\s+/gu, "-");
const viaWords = { dependsOn: "depends on", constrainedBy: "constrained by", decidedBy: "decided by", refines: "refines" };

// An entry's element id carries its roadmap's Pack page name, so two roadmaps never share one.
const entryId = (pack, place) => `roadmap-${pageName(pack)}-entry-${place}`;
const holdsText = (clauses) => clauses.length === 0 ? "nothing holds it" : `held by ${clauses.map((row) => `<code>${escape(row.clause)}</code>${row.targets.length === 0 ? "" : ` (${row.targets.map((id) => specLink(id)).join(", ")})`}`).join(", ")}`;

function entryCard(pack, entry, titles) {
  const toEntry = (place) => `<a href="#${entryId(pack, place)}">entry ${place}</a>`;
  const work = entry.work;
  const counts = [`${work.toDesign} to design`, `${work.toState} to state`, `${work.toBuild} to build`, `${work.built} built`].filter((text) => !text.startsWith("0 "));
  const line2 = [
    `${escape(entry.specKind)} · ${escape(entry.altitude)}`,
    `${badge(entry.statedReadiness)} <span class="floor">floor ${escape(entry.floorReached ?? "none")}</span>`,
    `${work.specs === 1 ? "1 Spec" : `${work.specs} Specs`}: ${counts.join(", ")}${work.drift > 0 ? `, <strong>${work.drift} drift</strong>` : ""}`,
  ].join(" · ");
  const fields = [];
  const field = (label, html) => { if (html !== "") fields.push(`<p class="field"><b>${label}</b> ${html}</p>`); };
  field("Id", `${specLink(entry.id, entry.id)}`);
  if (entry.statedNextRung !== null) field("Next", `${badge(entry.statedReadiness)} → ${badge(entry.statedNextRung)} ${entry.holdsNextRung.length === 0 ? "nothing blocks; it waits only for its author's statement" : holdsText(entry.holdsNextRung)}`);
  // The parts in the entry's lane set it; they show first, the entry's own part labelled "itself".
  const partRow = (row) => `${row.id === entry.id ? `${specLink(row.id, "itself")}` : specLink(row.id, titles.get(row.id) ?? row.id)} <span class="floor">${escape(row.lane)}</span> ${badge(row.statedReadiness)} <span class="floor">floor ${escape(row.floorReached ?? "none")}</span>${row.statedNextRung === null ? "" : ` → ${badge(row.statedNextRung)} ${holdsText(row.holdsNextRung)}`}${row.drift ? " <strong>drift</strong>" : ""}`;
  const setting = entry.workRows.filter((row) => row.lane === entry.lane && entry.lane !== "built");
  const ordered = [...setting.filter((row) => row.id === entry.id), ...setting.filter((row) => row.id !== entry.id)];
  const rest = entry.workRows.filter((row) => !setting.includes(row));
  if (entry.workRows.length > 1 || setting.some((row) => row.id !== entry.id)) {
    let parts = ordered.map(partRow).join("<br>");
    if (rest.length > 0) parts += `${parts === "" ? "" : "<br>"}<details><summary>${rest.length} other ${rest.length === 1 ? "part" : "parts"}</summary>${rest.map(partRow).join("<br>")}</details>`;
    field(entry.lane === "built" ? "Parts" : `Parts ${escape(entry.lane)}`, parts);
  }
  if (entry.buildNow.length > 0) field("Build now", entry.buildNow.map((id) => specLink(id, titles.get(id) ?? id)).join(", "));
  field("Blocked by", entry.blockingQuestions.map((question) => question.address === null ? specLink(question.spec) : `${addressLink(question.address)} <span class="floor">${escape(question.decider ?? "no decider")}</span>`).join("<br>"));
  field("Decided by", entry.decisions.map((decision) => `${specLink(decision.id, decision.id)} ${badge(decision.statedReadiness)}${decision.blockingQuestions.length > 0 ? ` blocked by ${decision.blockingQuestions.map((question) => question.address === null ? specLink(question.spec) : addressLink(question.address)).join(", ")}` : ""}`).join("<br>"));
  const fromText = (row) => row.from.length === 1 && row.from[0] === entry.id ? "" : ` from ${row.from.map((id) => id === entry.id ? "itself" : specLink(id)).join(", ")}`;
  const restItem = (row) => `${specLink(row.id, row.id)} <span class="floor">${escape(viaWords[row.via])}${fromText(row)} · ${escape(row.lane)}${row.holdsReady ? " · holds ready" : ""}</span> ${row.onRoadmap === null ? "outside the roadmap" : toEntry(row.onRoadmap)}`;
  const design = entry.restsOn.filter((row) => row.lane === "to design" || row.onRoadmap !== null || row.holdsReady);
  const others = entry.restsOn.filter((row) => !design.includes(row));
  let rests = design.map(restItem).join("<br>");
  if (others.length > 0) rests += `${rests === "" ? "" : "<br>"}<details><summary>${others.length} more, ${others.every((row) => row.lane === "to state") ? "each waiting only for a statement" : "not built"}</summary>${others.map(restItem).join("<br>")}</details>`;
  field("Rests on", rests);
  field("Waited on by", entry.restedOnBy.length === 0 ? "" : entry.restedOnBy.length <= 4
    ? entry.restedOnBy.map((row) => `${specLink(row.id, row.id)} <span class="floor">${escape(viaWords[row.via])} · ${escape(row.lane)}</span>`).join("<br>")
    : `<details><summary>${entry.restedOnBy.length} Specs</summary>${entry.restedOnBy.map((row) => `${specLink(row.id, row.id)} <span class="floor">${escape(viaWords[row.via])} · ${escape(row.lane)}</span>`).join("<br>")}</details>`);
  if (entry.lane === "to state") field("Earlier statements", entry.earlierStatements.length === 0 ? "No preceding waiting statement in the statement queue."
    : entry.earlierStatements.map((row) => `${specLink(row.id)} <span class="floor">${row.where === "entry" ? "in this entry" : row.where === "roadmap" ? "" : "outside the roadmap"}</span>${row.where === "roadmap" ? ` ${toEntry(row.onRoadmap)}` : ""}`).join("<br>"));
  field("Also in", entry.packs.map((pack) => `<a href="packs/${pageName(pack)}.html">${escape(pack)}</a>`).join(", "));
  if (entry.sharesScopeWith.length > 0) field("Shares Specs with", entry.sharesScopeWith.map(toEntry).join(", "));
  return `<li data-row data-lane="${laneSlug(entry.lane)}"><details class="card" id="${entryId(pack, entry.place)}"><summary><span class="line1">${entry.place}. ${escape(entry.title ?? entry.id)}</span><span class="line2">${line2}</span></summary><div class="card-body">${fields.join("")}</div></details></li>`;
}

function roadmapSection(roadmap, memo, titles) {
  const t = roadmap.totals;
  const toEntry = (place) => `<a href="#${entryId(roadmap.pack, place)}">entry ${place}</a>`;
  const parts = [];
  parts.push(`<section aria-labelledby="roadmap-${escape(pageName(roadmap.pack))}"><h2 id="roadmap-${escape(pageName(roadmap.pack))}"><a href="packs/${pageName(roadmap.pack)}.html">${escape(roadmap.title)}</a> <code>${escape(roadmap.pack)}</code></h2>`);
  for (const paragraph of (roadmap.framing ?? "").split(/\n\s*\n/u).filter((text) => text.trim() !== "")) parts.push(`<p>${inline(paragraph.trim())}</p>`);
  if (roadmap.order !== "priority") parts.push(`<p><strong>Prototype note:</strong> this Pack does not state <code>order: priority</code> yet, because the engine has no such field before the build; the page reads it because it was named.</p>`);
  const orderWords = roadmap.order === "priority" ? "in priority order" : "in authored reading order";
  parts.push(`<ul class="summary"><li>${t.entries} entries ${orderWords}: ${t.toDesign} to design, ${t.toState} to state, ${t.toBuild} to build, ${t.built} built${t.apart > 0 ? `, ${t.apart} listed apart` : ""}.</li><li>${t.blockingQuestions} blocking and ${t.questions - t.blockingQuestions} non-blocking questions wait on the owner${t.withoutDecider > 0 ? `; ${t.withoutDecider} more name no decider, ${t.blockingWithoutDecider} of them blocking` : ""}.</li><li>${t.statements} statements in the entries wait for a person, in the statement queue's order; the <a href="queue.html">owner queue</a> lists them all.</li></ul>`);
  // The board: one column per lane, each listing its entries in place order.
  parts.push(`<div class="roadmap-board" role="group" aria-label="Entries by what each needs next">`);
  for (const lane of laneNames) {
    const rows = roadmap.entries.filter((entry) => entry.lane === lane);
    parts.push(`<section class="board-column"><h3>${escape(lane[0].toUpperCase() + lane.slice(1))} <span class="floor">${rows.length}</span></h3>${rows.length === 0 ? "<p>none</p>" : `<ol>${rows.map((entry) => `<li value="${entry.place}"><span class="place">${entry.place}</span><a href="#${entryId(roadmap.pack, entry.place)}">${escape(entry.title ?? entry.id)}</a></li>`).join("")}</ol>`}</section>`);
  }
  parts.push(`</div>`);
  parts.push(`<sdp-filter><form hidden class="filter-bar"><label>Needs<select data-filter="lane"><option value="any">Any</option>${laneNames.map((lane) => `<option value="${laneSlug(lane)}">${escape(lane)}</option>`).join("")}</select></label></form><output aria-live="polite">${roadmap.entries.length} of ${roadmap.entries.length} shown</output>`);
  for (const lane of laneNames) {
    const rows = roadmap.entries.filter((entry) => entry.lane === lane);
    const heading = { "to design": "To design", "to state": "To state", "to build": "To build", built: "Built, still listed" }[lane];
    parts.push(`<h3>${heading}</h3>`);
    parts.push(rows.length === 0 ? `<p>No entry is ${lane === "built" ? "built" : lane}.</p>` : `<ul class="roadmap-list">${rows.map((entry) => entryCard(roadmap.pack, entry, titles)).join("")}</ul>`);
  }
  parts.push(`</sdp-filter>`);
  if (roadmap.apart.length > 0) parts.push(`<h3>Listed apart</h3><ul class="plain-list">${roadmap.apart.map((row) => `<li>${row.place}. ${specLink(row.id)} · ${escape(row.specKind)} · ${badge(row.statedReadiness)} · ${escape(row.lane)}</li>`).join("")}</ul>`);
  parts.push(`<h3>Waiting on the owner</h3><p>Questions follow the roadmap's places; statements keep the statement queue's order, so a Spec others rest on comes first.</p>`);
  const waiting = [];
  for (const question of roadmap.waiting.questions) waiting.push(`<li><p>${question.blocking ? "blocking" : "non-blocking"} · ${question.address === null ? specLink(question.spec) : addressLink(question.address)}${question.address === null ? "" : `<sdp-copy text="${escape(question.address)}"></sdp-copy>`}</p><p>${inline(question.question)}</p>${question.provisional === null ? "" : `<p>Provisional: ${inline(question.provisional)}</p>`}<p>touches ${question.places.map(toEntry).join(", ")}</p></li>`);
  for (const statement of roadmap.waiting.statements) waiting.push(`<li><p>statement · ${specLink(statement.id)} states ${badge(statement.statedReadiness)}, floor allows ${badge(statement.floorReached)} · ${statement.places.map(toEntry).join(", ")}</p></li>`);
  parts.push(waiting.length === 0 ? `<p>Nothing in these entries waits on the owner.</p>` : `<ul class="plain-list">${waiting.join("")}</ul>`);
  if (roadmap.waiting.withoutDecider.length > 0) {
    parts.push(`<h3>Questions without a decider</h3><p>These questions have no named decider.</p>`);
    parts.push(`<ul class="plain-list">${roadmap.waiting.withoutDecider.map((question) => `<li><p>${question.blocking ? "blocking" : "non-blocking"} · ${question.address === null ? specLink(question.spec) : addressLink(question.address)}</p><p>${inline(question.question)}</p><p>touches ${question.places.map(toEntry).join(", ")}</p></li>`).join("")}</ul>`);
  }
  parts.push(`<details class="section"><summary>The forward section, as Markdown</summary><div class="section-body"><sdp-copy text="${escape(memo)}"></sdp-copy><pre>${escape(memo)}</pre></div></details>`);
  parts.push(`</section>`);
  return parts.join("\n");
}

const style = `<style>
.roadmap-board { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0 1.5rem; }
.board-column { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 0.5rem 0.75rem; min-width: 0; }
.board-column h3 { margin: 0 0 0.5rem; font-size: 1rem; }
.board-column ol { list-style: none; margin: 0; padding: 0; }
.board-column li { display: grid; grid-template-columns: 1.75rem 1fr; margin: 0 0 0.5rem; line-height: 1.35; }
.board-column .place { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--muted); }
.roadmap-list { list-style: none; padding: 0; margin: 0; }
.roadmap-list > li { margin: 0 0 0.5rem; }
@media (max-width: 720px) { .roadmap-board { grid-template-columns: 1fr; } }
</style>`;

export function renderPage(shell, roadmaps, memos, titles) {
  const head = shell.slice(0, shell.indexOf('<main id="main">'))
    .replace("<title>Owner queue · Spec Studio</title>", `<title>Roadmap · Spec Studio</title>${style}`)
    .replace('<a href="queue.html" aria-current="page">Queue</a>', '<a href="roadmap.html" aria-current="page">Roadmap</a><a href="queue.html">Queue</a>');
  const tail = shell.slice(shell.indexOf("</main>"));
  const main = `<main id="main"><header class="page-head"><h1>Roadmap</h1><p>Recipe 53, the roadmap, over every Pack whose manifest states <code>order: priority</code>. A place is a preference: never a date, a deadline or permission to start. What each entry needs is read from the graph.</p></header>
${roadmaps.map((roadmap, at) => roadmapSection(roadmap, memos[at], titles)).join("\n")}
`;
  return `${head}${main}${tail}`;
}

function main(worktree, platform) {
  const sdp = join(worktree, "dist/cli/sdp.js");
  const corpora = [
    { name: "protocol", root: worktree, exclude: ["explorations", "examples", "test/fixtures/import/parity"] },
    { name: "platform", root: platform, exclude: [] },
  ];
  mkdirSync(join(here, "assets"), { recursive: true });
  copyFileSync(join(worktree, "generated/spec-studio/assets/studio.css"), join(here, "assets/studio.css"));
  for (const corpus of corpora) {
    const answer = query(sdp, corpus, body53, { pack: "pack:roadmap" });
    if (answer.diagnostics) throw new Error(JSON.stringify(answer.diagnostics));
    // One memo per roadmap, each rendered for its own Pack.
    const memos = answer.roadmaps.map((roadmap) => {
      const memoAnswer = query(sdp, corpus, body55, { pack: roadmap.pack });
      if (memoAnswer.diagnostics?.length) throw new Error(JSON.stringify(memoAnswer.diagnostics));
      return memoAnswer.memo;
    });
    const titles = new Map(query(sdp, corpus, "return g.specs().map((spec) => [spec.id, spec.title ?? null])", {}));
    const out = join(here, corpus.name);
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "roadmap.json"), `${JSON.stringify(answer, null, 2)}\n`);
    writeFileSync(join(out, "memo.md"), memos[0]);
    const page = renderPage(readFileSync(join(corpus.root, "generated/spec-studio/queue.html"), "utf8"), answer.roadmaps, memos, titles);
    // The copy kept here links only the stylesheet; the copy in the built Studio runs its script.
    writeFileSync(join(out, "roadmap.html"), page.replace('<script defer src="assets/studio.js"></script>', "").replaceAll('href="assets/', 'href="../assets/'));
    writeFileSync(join(corpus.root, "generated/spec-studio/roadmap.html"), page);
    // A screenshot variant with every entry opened; the page itself opens none.
    writeFileSync(join(corpus.root, "generated/spec-studio/roadmap-expanded.html"), page.replaceAll('<details class="card"', '<details open class="card"'));
    console.log(`${corpus.name}: ${answer.roadmaps[0].entries.length} entries, memo ${memos[0].length} characters`);
  }
  for (const corpus of corpora) {
    const memo = readFileSync(join(here, corpus.name, "memo.md"), "utf8");
    const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>The forward section, rendered</title><link rel="stylesheet" href="../assets/studio.css"><style>main { max-width: 64rem; margin: 2rem auto; padding: 0 1.5rem; } table { width: 100%; } td, th { vertical-align: top; }</style></head><body><main><p class="floor">Recipe 55's memo, rendered as a pull request description renders its Markdown (prototype renderer).</p>${renderMemo(memo)}</main></body></html>\n`;
    writeFileSync(join(here, corpus.name, "memo.html"), page);
  }
}

// The memo rendered as a pull request description would show it: a small renderer for the
// memo's own grammar (headings, paragraphs, bullet lists, pipe tables and code spans) only.
const spans = (text) => {
  let out = "";
  let at = 0;
  while (at < text.length) {
    const open = text.indexOf("`", at);
    if (open === -1) { out += escape(text.slice(at)); break; }
    out += escape(text.slice(at, open));
    let ticks = 0;
    while (text[open + ticks] === "`") ticks += 1;
    const close = text.indexOf("`".repeat(ticks), open + ticks);
    if (close === -1) { out += escape(text.slice(open)); break; }
    let code = text.slice(open + ticks, close);
    if (code.startsWith(" ") && code.endsWith(" ") && code.trim() !== "") code = code.slice(1, -1);
    out += `<code>${escape(code)}</code>`;
    at = close + ticks;
  }
  return out;
};
const cells = (line) => line.slice(1, -1).split(/(?<!\\)\|/u).map((cell) => cell.trim().replace(/\\\|/gu, "|"));
export function renderMemo(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  for (let at = 0; at < lines.length; at += 1) {
    const line = lines[at];
    if (line === "") continue;
    const heading = /^(#{2,3}) (.*)$/u.exec(line);
    if (heading) { html.push(`<h${heading[1].length}>${spans(heading[2])}</h${heading[1].length}>`); continue; }
    if (line.startsWith("| ")) {
      const head = cells(line);
      at += 1;
      const rows = [];
      while (lines[at + 1]?.startsWith("| ")) { at += 1; rows.push(cells(lines[at])); }
      html.push(`<div class="table-scroll"><table><thead><tr>${head.map((cell) => `<th>${spans(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${spans(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [line.slice(2)];
      while (lines[at + 1]?.startsWith("- ")) { at += 1; items.push(lines[at].slice(2)); }
      html.push(`<ul>${items.map((item) => `<li>${spans(item)}</li>`).join("")}</ul>`);
      continue;
    }
    html.push(`<p>${spans(line)}</p>`);
  }
  return html.join("\n");
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [worktree, platform] = process.argv.slice(2);
  if (!worktree || !platform) throw new Error("usage: node build.mjs <worktree> <platform-copy>");
  main(worktree, platform);
}

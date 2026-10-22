// Prototype of the Studio's slice page. Throwaway evidence, never product code.
// It runs the draft design slice body (slice-recipe.mjs) through `sdp q` on two corpora and writes
// one static HTML page per Pack, styled with a copy of the Studio's stylesheet. The drawings are a
// stand-in for the ones `spec:consumers.spec-studio.diagram-kinds` will design.
//
//   node build-slice-pages.mjs            # writes protocol/*.html, platform/*.html and answers/*.json
//   PLATFORM_ROOT=/path node build-slice-pages.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { sliceBody } from "./slice-recipe.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const worktree = resolve(here, "../../../..");
const sdp = join(worktree, "dist/cli/sdp.js");
const platformRoot = process.env.PLATFORM_ROOT ?? "/tmp/plan47-platform";
const corpora = {
  protocol: { root: worktree, excludes: ["explorations", "examples", "test/fixtures/import/parity"] },
  platform: { root: platformRoot, excludes: [] },
};
const targets = [
  ["protocol", "pack:roadmaps-and-slices-v1"],
  ["protocol", "pack:spec-studio-v1"],
  ["platform", "pack:history-view"],
  ["platform", "pack:application"],
];

const query = (corpus, body, params) => {
  const { root, excludes } = corpora[corpus];
  const args = [sdp, "q", body, "--root", root, ...excludes.flatMap((path) => ["--exclude", path]), "--json"];
  if (params !== undefined) args.push("--params", JSON.stringify(params));
  return JSON.parse(execFileSync("node", args, { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 }));
};

const escape = (text) => String(text ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pageName = (id) => id.slice(id.indexOf(":") + 1).replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const specHref = (id) => `../specs/${pageName(id)}.html`;
const code = (text) => `<code>${escape(text)}</code>`;
const badge = (rung) => `<span class="badge rung-${escape(rung)}">${escape(rung)}</span>`;
const count = (n, one, many = `${one}s`) => `${n === 0 ? "No" : n} ${n === 1 ? one : many}`;
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const titleOf = (row) => (row.title ? escape(row.title) : code(row.id));

// Word-wraps a label into lines of at most `width` characters, breaking ids after a dot or colon.
const wrap = (text, width) => {
  const words = String(text).split(/\s+/).flatMap((word) => {
    if (word.length <= width) return [word];
    const parts = [];
    let rest = word;
    while (rest.length > width) {
      const cut = Math.max(rest.lastIndexOf(".", width), rest.lastIndexOf(":", width), rest.lastIndexOf("-", width));
      const at = cut > 0 ? cut + 1 : width;
      parts.push(rest.slice(0, at));
      rest = rest.slice(at);
    }
    return [...parts, rest];
  });
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && (line + " " + word).length > width) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
};

const BOX_WIDTH = 280;
const GAP = 20;
const MARGIN = 20;
const PER_ROW = 3;
const CHARS = 34;
const LINE = 16;

// Lays boxes out in labelled bands, at most three to a row, so the drawing fits the page column at
// its own size and every label stays at 12 pixels.
const layoutBands = (bands) => {
  let y = MARGIN;
  const placed = new Map();
  const bandMarks = [];
  for (const band of bands) {
    if (band.boxes.length === 0) continue;
    bandMarks.push({ label: band.label, y: y + 12 });
    y += 24;
    for (let start = 0; start < band.boxes.length; start += PER_ROW) {
      const row = band.boxes.slice(start, start + PER_ROW);
      const height = Math.max(...row.map((box) => box.lines.length)) * LINE + 16;
      row.forEach((box, index) => {
        placed.set(box.id, { ...box, x: MARGIN + index * (BOX_WIDTH + GAP), y, w: BOX_WIDTH, h: height });
      });
      y += height + 28;
    }
    y += 8;
  }
  return { placed, bandMarks, width: MARGIN * 2 + PER_ROW * BOX_WIDTH + (PER_ROW - 1) * GAP, height: y + MARGIN };
};

const dashOf = { refines: "", dependsOn: "6 4", constrainedBy: "2 3", decidedBy: "8 3 2 3", uses: "", plans: "6 4" };

const svgDrawing = ({ subject, view, caption, bands, edges, legend, note }) => {
  const { placed, bandMarks, width, height } = layoutBands(bands);
  const markerId = `diagram.${subject}.${view}.arrow`;
  const textId = `diagram.${subject}.${view}.text`;
  const parts = [];
  for (const edge of edges) {
    const from = placed.get(edge.from);
    const to = placed.get(edge.to);
    if (!from || !to) continue;
    const x1 = from.x + from.w / 2;
    const y1 = from.y + from.h;
    const x2 = to.x + to.w / 2;
    const y2 = to.y;
    const down = y2 > y1;
    const bend = Math.max(30, Math.abs(y2 - y1) / 2);
    const d = down
      ? `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`
      : `M ${from.x + from.w} ${from.y + from.h / 2} C ${from.x + from.w + 40} ${from.y + from.h / 2}, ${to.x + to.w + 40} ${to.y + to.h / 2}, ${to.x + to.w} ${to.y + to.h / 2}`;
    const dash = dashOf[edge.kind] ? ` stroke-dasharray="${dashOf[edge.kind]}"` : "";
    parts.push(`<g class="edge"${edge.faint ? ' opacity="0.4"' : ""} data-from="${escape(edge.from)}" data-to="${escape(edge.to)}" data-kind="${escape(edge.kind)}"><path d="${d}" fill="none"${dash} marker-end="url(#${escape(markerId)})"/>${edge.label ? `<text x="${Math.round((x1 + x2) / 2) + 4}" y="${Math.round((y1 + y2) / 2)}">${escape(edge.label)}</text>` : ""}</g>`);
  }
  for (const mark of bandMarks) parts.push(`<g class="band" data-label="${escape(mark.label)}"><text x="${MARGIN}" y="${mark.y}">${escape(mark.label)}</text></g>`);
  for (const box of placed.values()) {
    const tspans = box.lines.map((line, index) => `<tspan x="${box.x + 10}" dy="${index === 0 ? 0 : LINE}"${index === 0 && box.boldFirst ? ' font-weight="650"' : ""}>${escape(line)}</tspan>`).join("");
    const dash = box.dashed ? ' stroke-dasharray="6 4"' : "";
    parts.push(`<g class="node" data-id="${escape(box.id)}"${box.dashed ? ' data-planned="true"' : ""}${box.folded ? ' data-folded="true"' : ""}><a href="${escape(box.href)}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="4"${dash}/><text x="${box.x + 10}" y="${box.y + 20}">${tspans}</text></a></g>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby="${escape(textId)}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title>${escape(caption)}</title><defs><marker id="${escape(markerId)}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${parts.join("")}</svg>`;
  const items = [
    ...[...placed.values()].map((box) => `<li>${escape(box.id)}: ${escape(box.words)}</li>`),
    ...edges.map((edge) => `<li>${escape(edge.from)} ${escape(edge.kind === "plans" ? "plans to use" : edge.kind)} ${escape(edge.to)}${edge.count > 1 ? ` (${edge.count} unit edges)` : ""}</li>`),
  ];
  return `<sdp-diagram subject="${escape(subject)}"><figure><figcaption>${escape(caption)}</figcaption>${note ? `<p class="drawing-note">${note}</p>` : ""}<p>${legend}</p><div class="diagram-scroll">${svg}</div><details id="${escape(textId)}"><summary>The diagram as text</summary><ul>${items.join("")}</ul></details></figure></sdp-diagram>`;
};

const dependencyDrawing = (answer, packId) => {
  const rows = answer.members.filter((row) => row.exampleOf === null);
  const shown = new Set(rows.map((row) => row.id));
  const deepest = Math.max(1, ...rows.map((row) => row.depth));
  const memberBox = (row) => {
    const lines = [...wrap(row.title ?? row.id, CHARS), ...wrap(row.id, CHARS), `stated ${row.statedReadiness} · floor ${row.floorReached}`];
    if (row.exampleMembers.length) lines.push(`${row.exampleMembers.length} example${row.exampleMembers.length === 1 ? "" : "s"} counted here`);
    return { id: row.id, lines, boldFirst: true, href: `#member.${row.id}`, words: `${row.title ?? row.id}, stated ${row.statedReadiness}, floor ${row.floorReached}${row.exampleMembers.length ? `, ${row.exampleMembers.length} examples` : ""}` };
  };
  const bands = [];
  for (let depth = deepest; depth >= 1; depth -= 1) {
    bands.push({ label: `Depth ${depth}${depth === 1 ? ", resting on no other member" : ""}`, boxes: rows.filter((row) => row.depth === depth).map(memberBox) });
  }
  const edges = answer.structure.edges
    .filter((edge) => shown.has(edge.from) && shown.has(edge.to))
    .map((edge) => ({ from: edge.from, to: edge.to, kind: edge.type }));
  // Outside Specs that hold a member or state below defined keep their own boxes; the rest fold into
  // one box per relation, so the drawing stays about the slice.
  const below = new Set(["idea", "scoped"]);
  const outside = answer.boundary.restsOn;
  const loud = outside.filter((row) => row.holds.length > 0 || below.has(row.statedReadiness));
  const quiet = outside.filter((row) => !loud.includes(row));
  const outsideBoxes = loud.map((row) => ({
    id: row.id,
    lines: [...wrap(row.title ?? row.id, CHARS), ...wrap(row.id, CHARS), `stated ${row.statedReadiness} · ${row.implemented ? "implementation bound" : "no implementation binding"}`, ...(row.holds.length ? [`holds ${row.holds.length} member${row.holds.length === 1 ? "" : "s"}`] : [])],
    href: specHref(row.id),
    words: `${row.title ?? row.id}, outside, stated ${row.statedReadiness}${row.holds.length ? `, holds ${row.holds.join(", ")}` : ""}`,
  }));
  for (const row of loud) for (const via of row.via) for (const member of via.members) if (shown.has(member)) edges.push({ from: member, to: row.id, kind: via.type });
  const groups = new Map();
  for (const row of quiet) {
    for (const via of row.via) {
      const group = groups.get(via.type) ?? { specs: new Set(), members: new Set() };
      group.specs.add(row.id);
      for (const member of via.members) if (shown.has(member)) group.members.add(member);
      groups.set(via.type, group);
    }
  }
  for (const [type, group] of groups) {
    outsideBoxes.push({
      id: `outside.${type}`,
      lines: [...wrap(`${group.specs.size} outside Spec${group.specs.size === 1 ? "" : "s"} named by ${type} by ${group.members.size} member${group.members.size === 1 ? "" : "s"}`, CHARS), "each states defined or ready", "and holds no member;", "folded, listed under Rests on"],
      href: "#boundary.restsOn",
      folded: true,
      words: `folded: ${group.specs.size} outside Specs the members name by ${type}, each stated defined or ready and holding no member`,
    });
    for (const member of group.members) edges.push({ from: member, to: `outside.${type}`, kind: type, faint: true });
  }
  bands.push({ label: "Outside the slice, rested on", boxes: outsideBoxes });
  const fold = groups.size > 0;
  const boxes = bands.reduce((total, band) => total + band.boxes.length, 0);
  const types = [...new Set(edges.map((edge) => edge.kind))];
  const foldWords = fold ? " Outside Specs that hold no member and state defined or ready are folded into one box per relation." : "";
  const legend = `Each member sits above the members it rests on.${foldWords} Lines: ${types.map((type) => `${type} ${dashOf[type] ? (type === "dependsOn" ? "dashed" : type === "constrainedBy" ? "dotted" : "dash-dot") : "solid"}`).join(", ")}.`;
  const over = boxes > 40 || edges.length > 100;
  return svgDrawing({
    subject: packId,
    view: "dependencies",
    caption: `How the members of ${packId} rest on each other`,
    bands,
    edges,
    legend: escape(legend),
    note: over ? `Prototype only: this drawing holds ${boxes} boxes and ${edges.length} edges, past the Studio's bound of 40 boxes and 100 edges. The fold the diagram kinds design decides what ships; the text equivalent and the table below hold every member.` : "",
  });
};

const architectureDrawing = (answer, packId) => {
  const layers = ["edge", "application", "domain", "adapter", "infrastructure", null];
  const components = answer.architecture.components;
  if (components.length === 0) return "";
  const reachLines = (row) => {
    const lines = [];
    const sat = row.members.satisfies.length;
    const ref = row.members.references.length;
    if (sat || ref) lines.push(`members: ${sat} satisfy, ${ref} reference`);
    if (row.restsOn.length) lines.push(`rests on: ${row.restsOn.length} Spec${row.restsOn.length === 1 ? "" : "s"}`);
    if (row.planned) lines.push("planned");
    return lines;
  };
  const bands = layers.map((layer) => ({
    label: layer === null ? "No layer stated" : `Layer ${layer}`,
    boxes: components.filter((row) => row.layer === layer).sort((a, b) => String(a.context).localeCompare(String(b.context)) || a.id.localeCompare(b.id)).map((row) => ({
      id: row.id,
      lines: [...wrap(row.id, CHARS), ...(row.label ? wrap(row.label, CHARS) : []), `context ${row.context ?? "not stated"}`, ...reachLines(row)],
      boldFirst: true,
      dashed: row.planned,
      href: row.planned ? specHref(row.designs[0]) : `../architecture.html#${row.id}`,
      words: `${row.label ?? row.id}, layer ${row.layer ?? "not stated"}, context ${row.context ?? "not stated"}, ${reachLines(row).join("; ")}`,
    })),
  }));
  const edges = answer.architecture.uses.map((use) => ({ from: use.from, to: use.to, kind: use.planned ? "plans" : "uses", count: use.count, label: use.planned ? "plans" : String(use.count) }));
  return svgDrawing({
    subject: packId,
    view: "architecture",
    caption: `The components ${packId} touches`,
    bands,
    edges,
    legend: escape(`Arrows: uses, labelled with the count of unit edges.${edges.some((edge) => edge.kind === "plans") ? " Dashed arrows: plans to use." : ""} Boxes sit in bands by layer; each names its context and how the slice reaches it.`),
  });
};

const holdsCell = (row) => {
  if (row.statedNextRung === null) return "none, stated ready";
  if (row.holds.length === 0) return `${escape(row.statedNextRung)}: nothing blocks`;
  return `${escape(row.statedNextRung)}: ${row.holds.map((hold) => `${escape(hold.description)}${hold.targets.length ? ` (${hold.targets.map((target) => `<a href="${specHref(target.id)}">${code(target.id)}</a> states ${escape(target.statedReadiness)}`).join(", ")})` : ""}`).join("; ")}`;
};

const listLinks = (ids, hrefOf) => ids.map((id) => `<a href="${hrefOf(id)}">${code(id)}</a>`).join(", ");

const renderPage = (corpus, packId, answer, packs) => {
  const t = answer.totals;
  const name = pageName(packId);
  const packHref = `../packs/${name}.html`;
  const memberHref = (id) => `${packHref}#${id}`;
  const rows = answer.members.filter((row) => row.exampleOf === null)
    .sort((a, b) => a.depth - b.depth || answer.scope.members.indexOf(a.id) - answer.scope.members.indexOf(b.id));
  const summary = [
    `${count(t.members, "member")}${t.exampleMembers ? `, ${t.exampleMembers} of them examples counted in the member they refine` : "; no examples counted in another member"}.`,
    `${count(t.relations, "relation")} among the members; the deepest member has depth ${t.depth}; ${t.cycles ? count(t.cycles, "cycle") : "no cycles"}.`,
    `${count(t.heldBelowNextRung, "member")} held below ${t.heldBelowNextRung === 1 ? "its" : "their"} stated next rung; ${count(t.waitingForAuthor, "member").replace(/^No /, "no ")} waiting only for ${t.waitingForAuthor === 1 ? "its" : "their"} author's statement.`,
    `${count(t.restsOn, "outside Spec")} the slice rests on, ${t.holdingOutside ? `${t.holdingOutside} of them holding a member` : "none of them holding a member"}; ${count(t.restedOnBy, "outside Spec").replace(/^No /, "no ")} rest on it.`,
    `${count(t.components.touched, "component")} touched: ${t.components.throughMembers} through the members' code, ${t.components.throughRestsOn} through the code that realizes what the slice rests on, ${t.components.planned} planned.`,
    `${count(t.decisions, "decision")} in scope, ${t.decisionsBelowReady} stated below ready.`,
    `${count(t.openQuestions, "open question")} in scope, ${t.blockingQuestions} blocking.`,
  ];
  const memberTable = `<div class="table-scroll" role="region" aria-label="What each member needs next" tabindex="0"><table class="slice-members"><thead><tr><th>Member</th><th>Depth</th><th>Rung</th><th>Next rung</th><th>Design carried</th><th>Code</th></tr></thead><tbody>${rows.map((row) => {
    const q = row.design.openQuestions;
    const b = row.design.blockingQuestions;
    return `<tr id="member.${escape(row.id)}"><td><a href="${memberHref(row.id)}">${titleOf(row)}</a><br>${code(row.id)}<br><span class="floor">${escape(row.specKind)}</span></td><td>${row.depth}</td><td>${badge(row.statedReadiness)} <span class="floor">floor ${escape(row.floorReached)}</span></td><td>${holdsCell(row)}</td><td class="carried"><span>${plural(row.rules.total, "rule")}${row.rules.keyed ? `, ${row.rules.keyed} keyed` : ""}</span><span>${plural(row.design.entries, "entry", "entries")}</span><span>${plural(row.design.declarations, "declaration")}</span><span>${plural(q, "question")}${b ? `, ${b} blocking` : ""}</span><span>${plural(row.design.decisions, "decision")}</span><span>${row.examples.total ? `${row.examples.enabled} of ${plural(row.examples.total, "example")} bound` : "0 examples"}</span></td><td>${row.implementedBy.length} implementing<br>${row.referencedBy.length} referencing</td></tr>`;
  }).join("")}</tbody></table></div>`;

  const components = answer.architecture.components;
  const reachedThrough = (row) => {
    const lines = [];
    if (row.members.satisfies.length) lines.push(`<b>Members its code satisfies:</b> ${listLinks(row.members.satisfies, memberHref)}`);
    if (row.members.references.length) lines.push(`<b>Members its code references:</b> ${listLinks(row.members.references, memberHref)}`);
    if (row.restsOn.length) lines.push(`<b>What the slice rests on, realized here:</b> ${listLinks(row.restsOn, specHref)}`);
    if (row.designs.length) lines.push(`<b>Member designs naming it:</b> ${listLinks(row.designs, specHref)}`);
    return lines.map((line) => `<span class="field">${line}</span>`).join("");
  };
  const unrealizedOutside = answer.boundary.restsOn.filter((row) => !row.implemented).length;
  const architecture = components.length === 0
    ? `<p>No component is touched yet: no member's code is bound, the code of what the slice rests on belongs to no component, and no member designs a component. ${count(unrealizedOutside, "Spec")} the slice rests on ${unrealizedOutside === 1 ? "has" : "have"} no implementation binding.</p>`
    : `${architectureDrawing(answer, answer.scope.pack)}<div class="table-scroll" role="region" aria-label="The components it touches" tabindex="0"><table><thead><tr><th>Component</th><th>Layer and context</th><th>Anchored or planned</th><th>Reached through</th></tr></thead><tbody>${components.map((row) => `<tr><td><a href="${row.planned ? specHref(row.designs[0]) : `../architecture.html#${escape(row.id)}`}">${code(row.id)}</a>${row.label ? `<br>${escape(row.label)}` : ""}</td><td>${escape(row.layer ?? "no layer")} · ${escape(row.context ?? "no context")}</td><td>${row.planned ? "planned" : "anchored"}</td><td>${reachedThrough(row)}</td></tr>`).join("")}</tbody></table></div>`;
  const unplaced = answer.architecture.unplaced.length
    ? `<ul class="units">${answer.architecture.unplaced.map((row) => `<li>${code(row.unit)} ${row.via === "satisfies" ? "implements" : "references"} <a href="${memberHref(row.member)}">${code(row.member)}</a></li>`).join("")}</ul>`
    : "<p>None.</p>";
  const differing = answer.architecture.differing.length
    ? `<ul class="units">${answer.architecture.differing.map((row) => `<li>${code(row.componentId)} ${escape(row.field)}: planned ${escape(JSON.stringify(row.planned))}, realized ${escape(JSON.stringify(row.realized))}</li>`).join("")}</ul>`
    : "<p>None.</p>";

  const decisions = answer.decisions.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="Decisions in scope" tabindex="0"><table><thead><tr><th>Decision</th><th>Rung</th><th>In the slice</th><th>Shapes</th><th>Questions</th></tr></thead><tbody>${answer.decisions.map((row) => `<tr><td><a href="${specHref(row.id)}">${titleOf(row)}</a><br>${code(row.id)}${row.refines.length ? `<br><span class="floor">refines ${row.refines.map(code).join(", ")}</span>` : ""}${row.supersedes.length ? `<br><span class="floor">supersedes ${row.supersedes.map(code).join(", ")}</span>` : ""}</td><td>${badge(row.statedReadiness)} <span class="floor">floor ${escape(row.floorReached)}</span></td><td>${row.member ? "member" : "outside"}</td><td>${row.shapes.length ? listLinks(row.shapes, memberHref) : "none"}</td><td>${row.openQuestions}${row.blockingQuestions ? ` (${row.blockingQuestions} blocking)` : ""}</td></tr>`).join("")}</tbody></table></div>`;

  const questionItem = (row) => {
    const fields = [
      row.decider ? `<span class="field"><b>Decider:</b> ${escape(row.decider)}</span>` : "",
      row.links?.length ? `<span class="field"><b>Links:</b> ${row.links.map(code).join(", ")}</span>` : "",
      row.provisional ? `<span class="field"><b>Provisional:</b> ${escape(row.provisional)}</span>` : "",
      row.trigger ? `<span class="field"><b>Trigger:</b> ${escape(row.trigger)}</span>` : "",
      row.holds.length ? `<span class="field"><b>Holds:</b> ${listLinks(row.holds, memberHref)}</span>` : "",
    ].join("");
    const address = row.address ? `<a href="${specHref(row.spec)}#question.${escape(row.address.slice(row.address.indexOf("#question.") + 10))}">${code(`question.${row.address.slice(row.address.indexOf("#question.") + 10)}`)}</a> · ` : "";
    return `<li>${row.blocking ? "blocking" : "non-blocking"} · ${address}${code(row.spec)}${row.origin === "member" ? "" : ` (${row.origin === "decision" ? "decision in scope" : "outside, holds a member"})`} · ${escape(row.question)}${fields}</li>`;
  };
  const blocking = answer.questions.filter((row) => row.blocking);
  const nonBlocking = answer.questions.filter((row) => !row.blocking);
  const questions = answer.questions.length === 0 ? "<p>None.</p>" : `${blocking.length ? `<ul class="questions">${blocking.map(questionItem).join("")}</ul>` : "<p>No blocking questions.</p>"}${nonBlocking.length ? `<details class="section"><summary>Non-blocking questions (${nonBlocking.length})</summary><div class="section-body"><ul class="questions">${nonBlocking.map(questionItem).join("")}</ul></div></details>` : ""}`;

  const boundarySection = (direction, label) => {
    const list = answer.boundary[direction];
    const body = list.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="${label}" tabindex="0"><table><thead><tr><th>Spec</th><th>Rung</th><th>Implementation binding</th><th>Joined members</th>${direction === "restsOn" ? "<th>Holds</th>" : ""}</tr></thead><tbody>${list.map((row) => `<tr><td><a href="${specHref(row.id)}">${titleOf(row)}</a><br>${code(row.id)}</td><td>${badge(row.statedReadiness)} <span class="floor">floor ${escape(row.floorReached)}</span></td><td>${row.implemented ? "present" : "none"}</td><td>${row.via.map((via) => `${escape(via.type)}: ${listLinks(via.members, memberHref)}`).join("<br>")}</td>${direction === "restsOn" ? `<td>${row.holds.length ? listLinks(row.holds, memberHref) : "none"}</td>` : ""}</tr>`).join("")}</tbody></table></div>`;
    return `<details class="section" id="boundary.${direction}"><summary>${label} (${list.length})</summary><div class="section-body">${body}</div></details>`;
  };

  const rail = `<nav class="rail" aria-label="Members, the ones others rest on first"><h2><a href="${packHref}">${escape(answer.scope.title ?? packId)}</a></h2><ol>${[...rows].sort((a, b) => a.depth - b.depth).map((row) => `<li><a href="#member.${escape(row.id)}">${titleOf(row)}</a></li>`).join("")}</ol><h2>Other Packs</h2><ul>${packs.filter((pack) => pack.id !== packId).map((pack) => `<li><a href="../slices/${pageName(pack.id)}.html">${escape(pack.title ?? pack.id)}</a></li>`).join("")}</ul></nav>`;
  const nav = ["Packs", "Architecture", "Tests", "Evidence", "Queue", "Questions", "Decisions", "Declarations", "Backlog", "Glossary"]
    .map((label) => `<a href="../${label === "Packs" ? "index" : label.toLowerCase()}.html">${label}</a>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Design slice: ${escape(answer.scope.title ?? packId)} · Spec Studio prototype</title><link rel="stylesheet" href="../studio.css"><style>
.reading-note { max-width: var(--measure); color: var(--muted); }
.drawing-note { max-width: var(--measure); background: var(--warn-bg); color: var(--warn-text); border: 1px solid var(--warn-line); border-radius: var(--radius); padding: 0.5rem 0.75rem; }
.slice-members td:nth-child(2) { text-align: right; }
.slice-members td:first-child { min-width: 15rem; }
.slice-members td:nth-child(4) { min-width: 11rem; }
.slice-members td.carried span { display: block; white-space: nowrap; font-variant-numeric: tabular-nums; }
.slice-members td:last-child { white-space: nowrap; }
.prototype-banner { font-size: 0.85rem; color: var(--muted); border-bottom: 1px solid var(--line); padding: 0.25rem 1rem; margin: 0; }
</style></head><body><p class="prototype-banner">Prototype of the slice page, ${escape(corpus)} corpus. Throwaway evidence; links resolve when the page sits in a Studio page set.</p><a class="skip-link" href="#main">Skip to the page</a><header class="top"><a class="brand" href="../index.html">Spec Studio</a><nav aria-label="Studio">${nav}</nav><form action="../search.html" role="search"><label class="visually-hidden" for="q">Search the corpus</label><input id="q" name="q" type="search" placeholder="Search Specs, keys and files"><button type="submit">Search</button></form></header><div class="layout">${rail}<main id="main"><header class="page-head"><h1>Design slice: ${escape(answer.scope.title ?? packId)}</h1><div class="ids"><span>${code(packId)}<button type="button">Copy</button></span></div><p><a href="${packHref}">Read the Pack member by member</a></p><h2>The design as a whole</h2><ul class="summary">${summary.map((line) => `<li>${line}</li>`).join("")}</ul><p class="reading-note">Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.</p></header><p><button type="button">Open all</button> <button type="button">Close all</button></p><h2 id="slice.dependencies">How the members rest on each other</h2>${dependencyDrawing(answer, packId)}<h2 id="slice.members">What each member needs next</h2>${memberTable}<h2 id="slice.architecture">The architecture it touches</h2>${architecture}<h3>Units bound to a member and to no component</h3>${unplaced}<h3>Member designs that differ from their components</h3>${differing}<h2 id="slice.decisions">Decisions in scope</h2>${decisions}<h2 id="slice.questions">Open questions in scope</h2>${questions}<h2 id="slice.boundary">Where the slice meets the rest</h2>${boundarySection("restsOn", "Rests on")}${boundarySection("restedOnBy", "Rested on by")}${boundarySection("verifiedBy", "Verified by")}${boundarySection("supersededBy", "Superseded by")}</main></div></body></html>
`;
};

const packList = {};
for (const corpus of Object.keys(corpora)) {
  packList[corpus] = query(corpus, "return g.packs().map((pack) => ({ id: pack.id, title: pack.title ?? null }))");
}
mkdirSync(join(here, "answers"), { recursive: true });
for (const [corpus, packId] of targets) {
  const answer = query(corpus, sliceBody, { pack: packId, detail: true });
  const summary = query(corpus, sliceBody, { pack: packId });
  const name = pageName(packId);
  // The full answer of the arc's own Pack is kept as a sample; the pages hold the others in full.
  if (packId === "pack:roadmaps-and-slices-v1") writeFileSync(join(here, "answers", `${corpus}-${name}.json`), `${JSON.stringify(answer, null, 2)}\n`);
  writeFileSync(join(here, "answers", `${corpus}-${name}.summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
  mkdirSync(join(here, corpus), { recursive: true });
  writeFileSync(join(here, corpus, `${name}.html`), renderPage(corpus, packId, answer, packList[corpus]));
  process.stdout.write(`${corpus} ${packId}: ${JSON.stringify(answer).length} code units in full, ${JSON.stringify(summary).length} in summary\n`);
}

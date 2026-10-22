// Prototype of the Studio's slice page. Throwaway evidence, never product code.
// It runs the draft design slice body (slice-recipe.mjs) through `sdp q` on three corpora and writes
// one static HTML page per Pack, styled with a copy of the Studio's stylesheet. The drawings are
// stand-ins for the kinds `spec:consumers.spec-studio.diagram-kinds` designs: they consume the
// slice's answer and recompute no scope, depth or order, and fold in the order this lane proposes
// to the dependency kind for a supplied order.
//
//   node make-probe.mjs                   # writes the probe corpus /tmp/plan47-platform-S first
//   node build-slice-pages.mjs            # writes protocol/, platform/, probe/ and answers/
//   PLATFORM_ROOT=/path PROBE_ROOT=/path node build-slice-pages.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { sliceBody } from "./slice-recipe.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const worktree = resolve(here, "../../../..");
const sdp = join(worktree, "dist/cli/sdp.js");
const corpora = {
  protocol: { root: worktree, excludes: ["explorations", "examples", "test/fixtures/import/parity"] },
  platform: { root: process.env.PLATFORM_ROOT ?? "/tmp/plan47-platform", excludes: [] },
  probe: { root: process.env.PROBE_ROOT ?? "/tmp/plan47-platform-S", excludes: [] },
};
const targets = [
  ["protocol", "pack:roadmaps-and-slices-v1"],
  ["protocol", "pack:spec-studio-v1"],
  ["platform", "pack:history-view"],
  ["platform", "pack:application"],
  ["probe", "pack:slice-probe"],
];
// Whole-Pack boundaries checked against the Pack's own boundary, as Pack design reads it.
const boundaryChecks = [...targets, ["protocol", "pack:self-hosting-v1"], ["platform", "pack:foundation"]];

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
const BOUND = { boxes: 40, edges: 100 };

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

const dashOf = { refines: "", dependsOn: "6 4", constrainedBy: "2 3", decidedBy: "8 3 2 3", uses: "", plans: "6 4", realizes: "2 3" };
const lineWords = { refines: "solid", dependsOn: "dashed", constrainedBy: "dotted", decidedBy: "dash-dot" };

// Draws the bands and edges; `textItems` is the complete text equivalent, which no fold shortens.
const svgDrawing = ({ subject, view, caption, bands, edges, legend, note, textItems, textOnly }) => {
  const markerId = `diagram.${subject}.${view}.arrow`;
  const textId = `diagram.${subject}.${view}.text`;
  const text = `<details id="${escape(textId)}"><summary>The diagram as text</summary><ul>${textItems.map((item) => `<li>${item}</li>`).join("")}</ul></details>`;
  if (textOnly) return `<sdp-diagram subject="${escape(subject)}"><figure><figcaption>${escape(caption)}</figcaption>${note ? `<p class="drawing-note">${note}</p>` : ""}${text}</figure></sdp-diagram>`;
  const { placed, bandMarks, width, height } = layoutBands(bands);
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
    parts.push(`<g class="edge"${edge.faint ? ' opacity="0.35"' : ""} data-from="${escape(edge.from)}" data-to="${escape(edge.to)}" data-kind="${escape(edge.kind)}"${edge.faint ? ' data-orders="false"' : ""}><path d="${d}" fill="none"${dash} marker-end="url(#${escape(markerId)})"/>${edge.label ? `<text x="${Math.round((x1 + x2) / 2) + 4}" y="${Math.round((y1 + y2) / 2)}">${escape(edge.label)}</text>` : ""}</g>`);
  }
  for (const mark of bandMarks) parts.push(`<g class="band" data-label="${escape(mark.label)}"><text x="${MARGIN}" y="${mark.y}">${escape(mark.label)}</text></g>`);
  for (const box of placed.values()) {
    const tspans = box.lines.map((line, index) => `<tspan x="${box.x + 10}" dy="${index === 0 ? 0 : LINE}"${index === 0 && box.boldFirst ? ' font-weight="650"' : ""}>${escape(line)}</tspan>`).join("");
    const dash = box.dashed ? ' stroke-dasharray="6 4"' : "";
    parts.push(`<g class="node" data-id="${escape(box.id)}"${box.elementId ? ` id="${escape(box.elementId)}"` : ""}${box.dashed ? ' data-planned="true"' : ""}${box.folded ? ' data-folded="true"' : ""}><a href="${escape(box.href)}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="4"${dash}/><text x="${box.x + 10}" y="${box.y + 20}">${tspans}</text></a></g>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-describedby="${escape(textId)}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title>${escape(caption)}</title><defs><marker id="${escape(markerId)}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${parts.join("")}</svg>`;
  return `<sdp-diagram subject="${escape(subject)}"><figure><figcaption>${escape(caption)}</figcaption>${note ? `<p class="drawing-note">${note}</p>` : ""}<p>${legend}</p><div class="diagram-scroll">${svg}</div>${text}</figure></sdp-diagram>`;
};

// Merges edges drawn between the same two boxes with the same kind, after folds re-point them.
const drawnEdges = (edges, boxOf) => {
  const merged = new Map();
  for (const edge of edges) {
    const from = boxOf.get(edge.from) ?? edge.from;
    const to = boxOf.get(edge.to) ?? edge.to;
    if (from === to) continue;
    const key = `${from}\u0000${to}\u0000${edge.kind}\u0000${edge.faint ? 1 : 0}`;
    const row = merged.get(key) ?? { ...edge, from, to, count: 0 };
    row.count += edge.count ?? 1;
    merged.set(key, row);
  }
  return [...merged.values()].map((edge) => ({ ...edge, label: edge.count > 1 && edge.label ? `${edge.label} ×${edge.count}` : edge.label }));
};

// The dependency drawing over the slice's supplied order: depth bands from the answer, every
// relation between shown members with its type, and the boundary rows in their own band.
const dependencyDrawing = (answer, packId) => {
  const rows = answer.members.filter((row) => row.exampleOf === null);
  const shown = new Set(rows.map((row) => row.id));
  const memberBox = (row) => {
    const lines = [...wrap(row.title ?? row.id, CHARS), ...wrap(row.id, CHARS), `stated ${row.statedReadiness} · floor ${row.floorReached}`];
    if (row.exampleMembers.length) lines.push(`${plural(row.exampleMembers.length, "example member")} folded in`);
    return { id: row.id, lines, boldFirst: true, href: `#member.${row.id}` };
  };
  const depths = [...new Set(rows.map((row) => row.depth))].sort((a, b) => b - a);
  const bands = depths.map((depth) => ({ key: depth, label: `Dependency depth ${depth}`, boxes: rows.filter((row) => row.depth === depth).map(memberBox) }));
  let edges = answer.structure.edges.filter((edge) => shown.has(edge.from) && shown.has(edge.to))
    .map((edge) => ({ from: edge.from, to: edge.to, kind: edge.type, faint: !edge.orders, label: edge.orders ? "" : "orders nothing" }));
  const outsideRows = answer.boundary.restsOn;
  const outsideBox = (row) => ({
    id: row.id,
    lines: [...wrap(row.title ?? row.id, CHARS), ...wrap(row.id, CHARS), `stated ${row.statedReadiness} · floor ${row.floorReached}`, ...(row.holds.length ? [`holds ${plural(row.holds.length, "member")}`] : [])],
    href: specHref(row.id),
  });
  let outsideBand = { key: "outside", label: "Outside this scope", boxes: outsideRows.map(outsideBox) };
  for (const row of outsideRows) for (const via of row.via) for (const member of via.members) if (shown.has(member)) edges.push({ from: member, to: row.id, kind: via.type, faint: false, label: "" });

  // Folding, in the order proposed to the dependency kind for a supplied order: the boundary first,
  // keeping each Spec that holds a member, then whole depth bands, largest first; then text only.
  const boxOf = new Map();
  const total = () => bands.reduce((sum, band) => sum + band.boxes.length, 0) + outsideBand.boxes.length;
  const over = () => total() > BOUND.boxes || drawnEdges(edges, boxOf).length > BOUND.edges;
  const folds = [];
  if (over()) {
    const keep = outsideRows.filter((row) => row.holds.length > 0);
    const groups = new Map();
    for (const row of outsideRows.filter((other) => other.holds.length === 0)) {
      const type = row.via[0].type;
      groups.set(type, [...(groups.get(type) ?? []), row.id]);
    }
    const foldBoxes = [...groups].map(([type, ids]) => {
      for (const id of ids) boxOf.set(id, `fold.outside.${type}`);
      return { id: `fold.outside.${type}`, lines: wrap(`${plural(ids.length, "outside Spec")} first named by ${type}, holding no member; folded`, CHARS), href: "#boundary.restsOn", folded: true };
    });
    outsideBand = { ...outsideBand, boxes: [...keep.map(outsideBox), ...foldBoxes] };
    folds.push("the outside Specs that hold no member, one box per relation");
  }
  const order = [...bands].sort((a, b) => b.boxes.length - a.boxes.length || a.key - b.key);
  for (const band of order) {
    if (!over()) break;
    const ids = band.boxes.map((box) => box.id);
    for (const id of ids) boxOf.set(id, `fold.${band.key}`);
    band.boxes = [{ id: `fold.${band.key}`, elementId: `diagram.${packId}.dependency.fold.${band.key}`, lines: wrap(`${plural(ids.length, "member")} at depth ${band.key}; folded, listed in the text and the table`, CHARS), href: "#slice.members", folded: true }];
    folds.push(`depth ${band.key}`);
  }
  const textOnly = over();
  const drawn = drawnEdges(edges, boxOf);

  const types = [...new Set(drawn.map((edge) => edge.kind))];
  const legend = `Each member sits above the members it rests on; bands carry the slice's own depths. Lines: ${types.map((type) => `${type} ${lineWords[type]}`).join(", ")}.${drawn.some((edge) => edge.faint) ? " A faint line is a relation that orders nothing." : ""}`;
  const textItems = [
    ...answer.members.map((row) => `${code(row.id)}: ${escape(row.title ?? "")}, depth ${row.depth}, stated ${escape(row.statedReadiness)}, floor ${escape(row.floorReached)}${row.exampleOf ? `, an example member folded into ${code(row.exampleOf)}` : ""}`),
    ...answer.structure.edges.map((edge) => `${code(edge.from)} ${escape(edge.type)} ${code(edge.to)}${edge.orders ? "" : ", orders nothing"}${edge.reason ? `: ${escape(edge.reason)}` : ""}`),
    ...answer.structure.cycles.map((cycle) => `A cycle: ${cycle.cycle.map(code).join(" → ")}`),
    ...outsideRows.map((row) => `Outside this scope: ${code(row.id)}, stated ${escape(row.statedReadiness)}, ${row.via.map((via) => `named by ${escape(via.type)} from ${via.members.map(code).join(", ")}`).join("; ")}${row.holds.length ? `; holds ${row.holds.map(code).join(", ")}` : ""}`),
  ];
  const note = folds.length
    ? `Prototype stand-in: the drawing holds ${total()} boxes and ${drawn.length} edges after folding ${folds.join(", then ")}, against the Studio's bound of ${BOUND.boxes} boxes and ${BOUND.edges} edges.${textOnly ? " It still exceeds the bound, so only the text is shown." : ""} The text keeps every member and relation.`
    : "";
  return svgDrawing({
    subject: packId,
    view: "dependency",
    caption: `How the members of ${packId} rest on each other`,
    bands: [...bands, outsideBand],
    edges: drawn,
    legend: escape(legend),
    note,
    textItems,
    textOnly,
  });
};

const layerOrder = ["edge", "application", "domain", "adapter", "infrastructure", null];

// The scoped architecture drawing: anchored components the slice touches, member designs as their
// own dashed boxes, and the components one step outside, each band a layer.
const architectureDrawing = (answer, packId) => {
  const { components, designs, uses, plannedUses, outside } = answer.architecture;
  const touched = new Set(components.map((row) => row.id));
  const designBoxOf = new Map(designs.filter((row) => !row.anchorExists || !touched.has(row.componentId)).map((row) => [row.componentId, `design.${row.spec}`]));
  const boxes = [
    ...components.map((row) => ({ layer: row.layer, id: row.id, lines: [...wrap(row.label ?? row.id, CHARS), ...wrap(row.id, CHARS), `context ${row.context ?? "not stated"}`], boldFirst: true, href: `../architecture.html#${row.id}` })),
    ...designs.map((row) => ({ layer: row.layer, id: `design.${row.spec}`, lines: [...wrap(`planned ${row.componentId}`, CHARS), ...wrap(row.spec, CHARS), `declared context ${row.context ?? "not stated"}`, row.realized ? "realized" : row.anchorExists ? "anchor does not satisfy it" : "no anchor"], dashed: true, href: specHref(row.spec) })),
    ...outside.map((row) => ({ layer: "outside", id: row.id, lines: [...wrap(`outside scope: ${row.label ?? row.id}`, CHARS), ...wrap(row.id, CHARS), row.anchored ? `layer ${row.layer ?? "not stated"} · context ${row.context ?? "not stated"}` : "not anchored"], href: row.anchored ? `../architecture.html#${row.id}` : "#slice.outside" })),
  ];
  // Stand-in layout: layer bands, with the outside components in a band of their own below them.
  const bands = [...layerOrder, "outside"].map((layer) => ({ label: layer === null ? "No layer stated or readable" : layer === "outside" ? "Outside this scope" : `Layer ${layer}`, boxes: boxes.filter((box) => box.layer === layer) }));
  const edges = [
    ...uses.map((row) => ({ from: row.from, to: row.to, kind: "uses", label: String(row.count), faint: false })),
    ...plannedUses.map((row) => ({ from: `design.${row.design}`, to: touched.has(row.to) ? row.to : designBoxOf.get(row.to) ?? row.to, kind: "plans", label: "plans to use", faint: false })),
    ...designs.filter((row) => row.realized).map((row) => ({ from: `design.${row.spec}`, to: row.componentId, kind: "realizes", label: "realized by", faint: false })),
  ];
  const textItems = [
    ...components.map((row) => `${code(row.id)}: ${escape(row.label ?? "")}, layer ${escape(row.layer ?? "not stated")}, context ${escape(row.context ?? "not stated")}, touched`),
    ...designs.map((row) => `Member design ${code(row.spec)} plans ${code(row.componentId)}: declared layer ${escape(row.layer ?? "not stated or unreadable")}, context ${escape(row.context ?? "not stated")}; ${row.realized ? "its anchor satisfies it" : row.anchorExists ? "an anchor holds the component and does not satisfy the design" : "no anchor holds the component"}`),
    ...outside.map((row) => `Outside scope: ${code(row.id)}, ${row.anchored ? "anchored" : "not anchored"}, reached by ${row.reachedBy.join(", ")}`),
    ...uses.map((row) => `${code(row.from)} uses ${code(row.to)}, anchored, ${plural(row.count, "unit edge")}${row.outside ? ", outside scope" : ""}`),
    ...plannedUses.map((row) => `${code(row.from)} plans to use ${code(row.to)}, declared by ${code(row.design)}${row.outside ? ", outside scope" : ""}`),
  ];
  const over = boxes.length > BOUND.boxes || edges.length > BOUND.edges;
  return svgDrawing({
    subject: packId,
    view: "scoped-architecture",
    caption: `The architecture ${packId} touches`,
    bands,
    edges,
    legend: escape(`Solid boxes are anchored components the slice touches; dashed boxes are member designs, planned, apart from any component that realizes them; boxes marked outside scope are context, one step away. Solid arrows: uses, anchored, labelled with the count of unit edges. Dashed arrows: plans to use, declared. Dotted arrows: realized by.`),
    note: over ? `Prototype stand-in: ${boxes.length} boxes and ${edges.length} edges, past the Studio's bound of ${BOUND.boxes} boxes and ${BOUND.edges} edges; the architecture folds by context and layer are the scoped architecture kind's. The tables below hold every row.` : "",
    textItems,
  });
};

const holdsCell = (row) => {
  if (row.statedNextRung === null) return "none, stated ready";
  if (row.holds.length === 0) return `${escape(row.statedNextRung)}: nothing blocks`;
  return `${escape(row.statedNextRung)}: ${row.holds.map((hold) => `${escape(hold.description)}${hold.targets.length ? ` (${hold.targets.map((target) => `<a href="${specHref(target.id)}">${code(target.id)}</a> states ${escape(target.statedReadiness)}`).join(", ")})` : ""}`).join(" ")}`;
};

const listLinks = (ids, hrefOf) => ids.map((id) => `<a href="${hrefOf(id)}">${code(id)}</a>`).join(", ");
const value = (item) => (item === null ? "not stated" : Array.isArray(item) ? (item.length ? item.join(", ") : "none") : item);

const renderPage = (corpus, packId, answer, packs) => {
  const t = answer.totals;
  const name = pageName(packId);
  const packHref = `../packs/${name}.html`;
  const memberHref = (id) => `${packHref}#${id}`;
  const byId = new Map(answer.members.map((row) => [row.id, row]));
  const rows = answer.members.filter((row) => row.exampleOf === null)
    .sort((a, b) => a.depth - b.depth || answer.scope.members.indexOf(a.id) - answer.scope.members.indexOf(b.id));
  const d = t.designs;
  const summary = [
    `${count(t.members, "member")}${t.exampleMembers ? `, ${t.exampleMembers} of them example members folded into the member they refine` : "; no example member folded into another"}.`,
    `${count(t.relations, "relation")} among the members; the deepest member has depth ${t.depth}; ${t.cycles ? count(t.cycles, "cycle") : "no cycles"}.`,
    `${count(t.heldBelowNextRung, "member")} held below ${t.heldBelowNextRung === 1 ? "its" : "their"} stated next rung; ${count(t.waitingForAuthor, "member").replace(/^No /, "no ")} waiting only for ${t.waitingForAuthor === 1 ? "its" : "their"} author's statement.`,
    `${count(t.restsOn, "outside Spec")} the slice rests on, ${t.holdingOutside ? `${t.holdingOutside} of them holding a member` : "none of them holding a member"}; ${count(t.restedOnBy, "outside Spec").replace(/^No /, "no ")} rest on it.`,
    `${count(t.components.touched, "component")} touched: ${t.components.throughMembers} through the members' code, ${t.components.throughRestsOn} through the code that realizes what the slice rests on, ${t.components.throughDesigns} named by member designs; ${t.components.outside} outside the slice shown beside them.`,
    d.total ? `${count(d.total, "member component design")}: ${d.realized} realized, ${d.matching} of them matching; ${d.unrealized} unrealized; ${plural(d.differing, "differing row")}, ${plural(d.unreadable, "unreadable row")}.` : "No member designs a component.",
    `${count(t.decisions, "decision")} in scope, ${t.decisionsBelowReady} stated below ready.`,
    `${count(t.openQuestions, "open question")} in scope, ${t.blockingQuestions} blocking.`,
  ];

  const foldedRow = (row) => {
    if (row.exampleMembers.length === 0) return "";
    const examples = row.exampleMembers.map((id) => byId.get(id));
    const held = examples.filter((example) => example.holds.length > 0).length;
    return `<tr class="folded"><td colspan="6"><details><summary>${plural(examples.length, "example member")} folded in${held ? `, ${held} held below the next rung` : ""}</summary><ul class="units">${examples.map((example) => `<li><a href="${memberHref(example.id)}">${titleOf(example)}</a> ${code(example.id)} · ${badge(example.statedReadiness)} <span class="floor">floor ${escape(example.floorReached)}</span> · next ${holdsCell(example)}</li>`).join("")}</ul></details></td></tr>`;
  };
  const memberTable = `<div class="table-scroll" role="region" aria-label="What each member needs next" tabindex="0"><table class="slice-members"><thead><tr><th>Member</th><th>Depth</th><th>Rung</th><th>Next rung</th><th>Design carried</th><th>Code</th></tr></thead><tbody>${rows.map((row) => {
    const q = row.design.openQuestions;
    const b = row.design.blockingQuestions;
    return `<tr class="member" id="member.${escape(row.id)}"><td class="member-cell"><a href="${memberHref(row.id)}">${titleOf(row)}</a><br>${code(row.id)}<br><span class="floor">${escape(row.specKind)}</span></td><td class="depth" data-label="Depth">${row.depth}</td><td class="rung" data-label="Rung">${badge(row.statedReadiness)} <span class="floor">floor ${escape(row.floorReached)}</span></td><td class="next" data-label="Next rung">${holdsCell(row)}</td><td class="carried" data-label="Design carried"><span>${plural(row.rules.total, "rule")}${row.rules.keyed ? `, ${row.rules.keyed} keyed` : ""}</span><span>${plural(row.design.entries, "entry", "entries")}</span><span>${plural(row.design.declarations, "declaration")}</span><span>${plural(q, "question")}${b ? `, ${b} blocking` : ""}</span><span>${plural(row.design.decisions, "decision")}</span><span>${row.examples.total ? `${row.examples.enabled} of ${plural(row.examples.total, "verifying example")} bound` : "0 verifying examples"}</span></td><td class="code-cell" data-label="Code"><span>${row.implementedBy.length} implementing</span><span>${row.referencedBy.length} referencing</span></td></tr>${foldedRow(row)}`;
  }).join("")}</tbody></table></div>`;

  const { components, designs, outside } = answer.architecture;
  const reachedThrough = (row) => {
    const lines = [];
    if (row.members.satisfies.length) lines.push(`<b>Members its code satisfies:</b> ${listLinks(row.members.satisfies, memberHref)}`);
    if (row.members.references.length) lines.push(`<b>Members its code references:</b> ${listLinks(row.members.references, memberHref)}`);
    if (row.restsOn.length) lines.push(`<b>What the slice rests on, realized here:</b> ${listLinks(row.restsOn, specHref)}`);
    if (row.designs.length) lines.push(`<b>Member designs naming it:</b> ${listLinks(row.designs, specHref)}`);
    return lines.map((line) => `<span class="field">${line}</span>`).join("");
  };
  const unrealizedOutside = answer.boundary.restsOn.filter((row) => !row.implemented).length;
  const componentTable = components.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="Components the slice touches" tabindex="0"><table><thead><tr><th>Component</th><th>Layer and context</th><th>Reached through</th></tr></thead><tbody>${components.map((row) => `<tr><td><a href="../architecture.html#${escape(row.id)}">${code(row.id)}</a>${row.label ? `<br>${escape(row.label)}` : ""}</td><td>${escape(row.layer ?? "no layer")} · ${escape(row.context ?? "no context")}</td><td>${reachedThrough(row)}</td></tr>`).join("")}</tbody></table></div>`;
  const anchorWords = (row) => (row.realized ? "satisfies the design" : row.anchorExists ? "present, does not satisfy the design" : "absent");
  const comparisonWords = (row) => {
    if (!row.realized && row.unreadable.length === 0) return "not compared: no anchor satisfies the design";
    const lines = [
      ...row.differing.map((diff) => (diff.field === "uses"
        ? `<span class="field"><b>uses:</b> only declared ${escape(diff.planned.length ? diff.planned.join(", ") : "nothing")}; only anchored ${escape(diff.realized.length ? diff.realized.join(", ") : "nothing")}</span>`
        : `<span class="field"><b>${escape(diff.field)}:</b> declared ${escape(value(diff.planned))}; anchored ${escape(value(diff.realized))}</span>`)),
      ...row.unreadable.map((item) => `<span class="field"><b>${escape(item.key)}:</b> unreadable ${code(item.value)}, not compared</span>`),
    ];
    return lines.length ? lines.join("") : "matches";
  };
  const designTable = designs.length === 0 ? "<p>None.</p>" : `<div class="table-scroll" role="region" aria-label="Member component designs" tabindex="0"><table><thead><tr><th>Design</th><th>Component</th><th>Declared</th><th>Anchor</th><th>Comparison</th></tr></thead><tbody>${designs.map((row) => `<tr><td><a href="${specHref(row.spec)}">${titleOf(byId.get(row.spec))}</a><br>${code(row.spec)}</td><td>${code(row.componentId)}</td><td>${["layer", "context", "role", "uses"].map((key) => `<span class="field"><b>${key}:</b> ${escape(value(row[key]))}</span>`).join("")}</td><td>${anchorWords(row)}</td><td>${comparisonWords(row)}</td></tr>`).join("")}</tbody></table></div>`;
  const reachWords = { touchedUses: "a touched component uses it", usesTouched: "it uses a touched component", plannedUse: "a member design plans to use it" };
  const outsideList = outside.length === 0 ? "<p>None.</p>" : `<ul class="units" id="slice.outside">${outside.map((row) => `<li>${row.anchored ? `<a href="../architecture.html#${escape(row.id)}">${code(row.id)}</a>` : code(row.id)}${row.label ? ` ${escape(row.label)}` : ""} · ${row.anchored ? "anchored" : "not anchored"} · ${row.reachedBy.map((how) => reachWords[how]).join("; ")}</li>`).join("")}</ul>`;
  const architecture = components.length === 0 && designs.length === 0
    ? `<p>No component is touched yet: no member's code is bound, the code of what the slice rests on belongs to no component, and no member designs a component. ${count(unrealizedOutside, "Spec")} the slice rests on ${unrealizedOutside === 1 ? "has" : "have"} no implementation binding.</p>`
    : `${architectureDrawing(answer, answer.scope.pack)}<h3>Components the slice touches</h3>${componentTable}<h3>Member component designs</h3>${designTable}<h3>Outside the slice, shown for context and not counted as touched</h3>${outsideList}`;
  const unplaced = answer.architecture.unplaced.length
    ? `<ul class="units">${answer.architecture.unplaced.map((row) => `<li>${code(row.unit)} ${row.via === "satisfies" ? "implements" : "references"} <a href="${memberHref(row.member)}">${code(row.member)}</a></li>`).join("")}</ul>`
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
    const key = row.address ? row.address.slice(row.address.indexOf("#question.") + 10) : null;
    const address = key ? `<a href="${specHref(row.spec)}#question.${escape(key)}">${code(`question.${key}`)}</a> · ` : "";
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

  const rail = `<nav class="rail" aria-label="Members, the ones others rest on first"><h2><a href="${packHref}">${escape(answer.scope.title ?? packId)}</a></h2><ol>${rows.map((row) => `<li><a href="#member.${escape(row.id)}">${titleOf(row)}</a></li>`).join("")}</ol><h2>Other Packs</h2><ul>${packs.filter((pack) => pack.id !== packId).map((pack) => `<li><a href="../slices/${pageName(pack.id)}.html">${escape(pack.title ?? pack.id)}</a></li>`).join("")}</ul></nav>`;
  const nav = ["Packs", "Architecture", "Tests", "Evidence", "Queue", "Questions", "Decisions", "Declarations", "Backlog", "Glossary"]
    .map((label) => `<a href="../${label === "Packs" ? "index" : label.toLowerCase()}.html">${label}</a>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Design slice: ${escape(answer.scope.title ?? packId)} · Spec Studio prototype</title><link rel="stylesheet" href="../studio.css"><style>
.reading-note { max-width: var(--measure); color: var(--muted); }
.drawing-note { max-width: var(--measure); background: var(--warn-bg); color: var(--warn-text); border: 1px solid var(--warn-line); border-radius: var(--radius); padding: 0.5rem 0.75rem; }
.slice-members td.depth { text-align: right; }
.slice-members td.member-cell { min-width: 15rem; }
.slice-members td.next { min-width: 11rem; }
.slice-members td.carried span, .slice-members td.code-cell span { display: block; white-space: nowrap; font-variant-numeric: tabular-nums; }
.slice-members tr.member:has(+ tr.folded) > td { border-bottom: 0; }
.slice-members tr.folded > td { padding-top: 0; }
.slice-members tr.folded summary { cursor: pointer; color: var(--muted); font-size: 0.85rem; }
.prototype-banner { font-size: 0.85rem; color: var(--muted); border-bottom: 1px solid var(--line); padding: 0.25rem 1rem; margin: 0; }
@media (max-width: 719.98px) {
  .slice-members thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .slice-members, .slice-members tbody, .slice-members td { display: block; width: auto; min-width: 0 !important; }
  .slice-members tr { display: flex; flex-direction: column; }
  .slice-members tr.member { border-top: 2px solid var(--line); padding-top: 0.5rem; }
  .slice-members td { border: 0; padding: 0.1rem 0; text-align: left !important; }
  .slice-members td.depth { order: 4; }
  .slice-members td.carried { order: 5; }
  .slice-members td.code-cell { order: 6; }
  .slice-members td[data-label]::before { content: attr(data-label) ": "; color: var(--muted); font-weight: 600; }
  .slice-members td.carried span, .slice-members td.code-cell span { display: inline; white-space: normal; }
  .slice-members td.carried span + span::before, .slice-members td.code-cell span + span::before { content: " · "; color: var(--muted); }
  .slice-members tr.folded > td { padding: 0.2rem 0 0.5rem; }
}
</style></head><body><p class="prototype-banner">Prototype of the slice page, ${escape(corpus)} corpus. Throwaway evidence; links resolve when the page sits in a Studio page set.</p><a class="skip-link" href="#main">Skip to the page</a><header class="top"><a class="brand" href="../index.html">Spec Studio</a><nav aria-label="Studio">${nav}</nav><form action="../search.html" role="search"><label class="visually-hidden" for="q">Search the corpus</label><input id="q" name="q" type="search" placeholder="Search Specs, keys and files"><button type="submit">Search</button></form></header><div class="layout">${rail}<main id="main"><header class="page-head"><h1>Design slice: ${escape(answer.scope.title ?? packId)}</h1><div class="ids"><span>${code(packId)}<button type="button">Copy</button></span></div><p><a href="${packHref}">Read the Pack member by member</a></p><h2>The design as a whole</h2><ul class="summary">${summary.map((line) => `<li>${line}</li>`).join("")}</ul><p class="reading-note">Members read with the ones others rest on first. The columns count the design each member carries beside its rung; they never judge whether it is enough. This page records no review and approves nothing.</p></header><p><button type="button">Open all</button> <button type="button">Close all</button></p><h2 id="slice.dependencies">How the members rest on each other</h2>${dependencyDrawing(answer, packId)}<h2 id="slice.members">What each member needs next</h2>${memberTable}<h2 id="slice.architecture">The architecture it touches</h2>${architecture}<h3>Units bound to a member and to no component</h3>${unplaced}<h2 id="slice.decisions">Decisions in scope</h2>${decisions}<h2 id="slice.questions">Open questions in scope</h2>${questions}<h2 id="slice.boundary">Where the slice meets the rest</h2>${boundarySection("restsOn", "Rests on")}${boundarySection("restedOnBy", "Rested on by")}${boundarySection("verifiedBy", "Verified by")}${boundarySection("supersededBy", "Superseded by")}</main></div></body></html>
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
  // Full answers of the arc's own Pack and the probe are kept as samples; the pages hold the others.
  if (packId === "pack:roadmaps-and-slices-v1" || corpus === "probe") writeFileSync(join(here, "answers", `${corpus}-${name}.json`), `${JSON.stringify(answer, null, 2)}\n`);
  writeFileSync(join(here, "answers", `${corpus}-${name}.summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
  mkdirSync(join(here, corpus), { recursive: true });
  writeFileSync(join(here, corpus, `${name}.html`), renderPage(corpus, packId, answer, packList[corpus]));
  process.stdout.write(`${corpus} ${packId}: ${JSON.stringify(answer).length} code units in full, ${JSON.stringify(summary).length} in summary\n`);
}
const boundaryIds = "const b = g.packContext(params.pack).boundary; return Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.map((row) => row.id)]));";
for (const [corpus, packId] of boundaryChecks) {
  const answer = query(corpus, sliceBody, { pack: packId });
  const expected = query(corpus, boundaryIds, { pack: packId });
  const actual = Object.fromEntries(Object.entries(answer.boundary).map(([direction, list]) => [direction, list.map((row) => row.id)]));
  process.stdout.write(`boundary ${corpus} ${packId}: ${JSON.stringify(actual) === JSON.stringify(expected) ? "matches the Pack's" : "DIFFERS"}\n`);
}

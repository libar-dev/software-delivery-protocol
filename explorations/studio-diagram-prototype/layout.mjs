// Prototype: lay out the Studio's diagrams as static, script-free SVG from the values
// dump.body.js returns. Throwaway evidence for the diagram contract, never product: the build
// writes the engine's renderer. Node only, no dependency.
//
// usage: node layout.mjs INPUT.json OUT_DIR [--bound N] [--edge-bound M] [--synthetic K]
//   --bound       the most nodes one diagram draws before it folds (default 40)
//   --edge-bound  the most edges one diagram draws before it folds (default 100)
//   --synthetic   add K planned components per layer across five synthetic contexts, to show the
//                 fold on a corpus larger than either measured one (labelled synthetic in the page)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const [inputPath, outDir] = args;
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : Number(args[index + 1]);
};
const BOUND = option("--bound", 40);
const EDGE_BOUND = option("--edge-bound", 100);
const SYNTHETIC = option("--synthetic", 0);
const data = JSON.parse(readFileSync(inputPath, "utf8"));

/* ----- fixed metrics: text is measured by character count, never by a font ----- */
const CHAR = 7.5; // advance of one character of the 12px monospace label font, in px, with slack
const LINE = 16; // one label line
const PAD = 8; // inside a box
const GAP_X = 24; // between boxes in a row
const GAP_Y = 48; // between rows
const BAND_PAD = 16; // inside a group band
const PER_ROW = 6; // boxes per row before a row wraps
const WRAP = 30; // characters per label line before an id wraps at a dot or a hyphen

const LAYERS = ["edge", "application", "domain", "adapter", "infrastructure"];
const byId = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const esc = (text) =>
  String(text).replace(/[&<>"]/gu, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Splits an id into lines no longer than WRAP, at dots, then hyphens, keeping each separator. */
function wrap(text) {
  if (text.length <= WRAP) return [text];
  const parts = text.split(/(?<=[.:])/u);
  const lines = [];
  let line = "";
  for (const part of parts) {
    if ((line + part).length > WRAP && line !== "") {
      lines.push(line);
      line = "";
    }
    if (part.length > WRAP) {
      for (const piece of part.split(/(?<=-)/u)) {
        if ((line + piece).length > WRAP && line !== "") {
          lines.push(line);
          line = "";
        }
        line += piece;
      }
    } else line += part;
  }
  if (line !== "") lines.push(line);
  return lines;
}

function box(node) {
  const lines = [...wrap(node.id), ...(node.notes ?? [])];
  const width = Math.ceil(Math.max(...lines.map((l) => l.length)) * CHAR) + 2 * PAD;
  return { ...node, lines, w: width, h: lines.length * LINE + 2 * PAD };
}

/* ----- the architecture model: components by context and layer, uses between them ----- */
function architectureModel() {
  const owner = new Map(data.memberOf.map((row) => [row.unit, row.component]));
  const members = new Map();
  for (const row of data.memberOf) members.set(row.component, (members.get(row.component) ?? 0) + 1);
  const nodes = data.components.map((c) => ({
    id: c.id,
    context: c.context,
    layer: c.layer,
    planned: false,
    notes: [`${c.layer ?? "no layer"} · ${members.get(c.id) ?? 0} units`],
  }));
  for (const p of data.planned)
    nodes.push({ id: p.id, context: p.context, layer: p.layer, planned: true, notes: [`planned · ${p.layer ?? "no layer"}`] });
  if (SYNTHETIC > 0) {
    for (const context of ["billing", "catalog", "identity", "ledger", "shipping"])
      for (const layer of LAYERS)
        for (let i = 1; i <= SYNTHETIC; i++)
          nodes.push({ id: `component:${context}.${layer}-${i}`, context, layer, planned: true, synthetic: true, notes: [`planned · ${layer}`] });
  }
  const ids = new Set(nodes.map((n) => n.id));
  const componentOf = (id) => (id.startsWith("component:") ? id : owner.get(id));
  const counts = new Map();
  for (const edge of data.uses) {
    const a = componentOf(edge.from);
    const b = componentOf(edge.to);
    if (!a || !b || a === b || !ids.has(a) || !ids.has(b)) continue;
    const key = `${a}\u0000${b}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const edges = [...counts.entries()].map(([key, count]) => {
    const [from, to] = key.split("\u0000");
    return { from, to, kind: "uses", count };
  });
  for (const p of data.planned)
    for (const target of p.uses) if (ids.has(target)) edges.push({ from: p.id, to: target, kind: "plans to use", count: 1 });
  if (SYNTHETIC > 0) {
    // Each synthetic component uses the next layer down in its own context and the domain of the
    // next context, so the fold has crossings to aggregate.
    const contexts = ["billing", "catalog", "identity", "ledger", "shipping"];
    contexts.forEach((context, ci) => {
      for (let li = 0; li < LAYERS.length - 1; li++)
        for (let i = 1; i <= SYNTHETIC; i++)
          edges.push({ from: `component:${context}.${LAYERS[li]}-${i}`, to: `component:${context}.${LAYERS[li + 1]}-${i}`, kind: "plans to use", count: 1 });
      edges.push({ from: `component:${context}.application-1`, to: `component:${contexts[(ci + 1) % contexts.length]}.domain-1`, kind: "plans to use", count: 1 });
    });
  }
  edges.sort((a, b) => byId(a.from, b.from) || byId(a.to, b.to) || byId(a.kind, b.kind));
  return { nodes: nodes.sort((a, b) => byId(a.id, b.id)), edges };
}

/* ----- the grid layout: one column per context, one band per layer ----- */
function gridLayout(nodes, edges, columnKey, rowKey, rowOrder) {
  const columns = [...new Set(nodes.map((n) => n[columnKey] ?? "\uffff"))].sort(byId);
  const rows = [...new Set(nodes.map((n) => n[rowKey] ?? "\uffff"))].sort(
    (a, b) => (rowOrder.indexOf(a) === -1 ? 99 : rowOrder.indexOf(a)) - (rowOrder.indexOf(b) === -1 ? 99 : rowOrder.indexOf(b)) || byId(a, b),
  );
  const boxes = new Map(nodes.map((n) => [n.id, box(n)]));
  // Cell contents in id order; each cell wraps after PER_ROW boxes.
  const cell = (c, r) => nodes.filter((n) => (n[columnKey] ?? "\uffff") === c && (n[rowKey] ?? "\uffff") === r).map((n) => boxes.get(n.id));
  const colWidth = columns.map((c) => Math.max(...rows.map((r) => {
    const items = cell(c, r);
    let widest = 0;
    for (let i = 0; i < items.length; i += PER_ROW) widest = Math.max(widest, items.slice(i, i + PER_ROW).reduce((s, b) => s + b.w + GAP_X, -GAP_X));
    return widest;
  }), 160) + 2 * BAND_PAD);
  const rowHeight = rows.map((r) => Math.max(...columns.map((c) => {
    const items = cell(c, r);
    let height = 0;
    for (let i = 0; i < items.length; i += PER_ROW) height += Math.max(...items.slice(i, i + PER_ROW).map((b) => b.h)) + GAP_Y / 2;
    return height;
  }), 40) + 2 * BAND_PAD);
  const HEADER = 28; // column labels
  const LEFT = 140; // row labels
  let y = HEADER;
  const placed = new Map();
  rows.forEach((r, ri) => {
    let x = LEFT;
    columns.forEach((c, ci) => {
      const items = cell(c, r);
      let rowY = y + BAND_PAD;
      for (let i = 0; i < items.length; i += PER_ROW) {
        const line = items.slice(i, i + PER_ROW);
        let bx = x + BAND_PAD;
        for (const b of line) {
          placed.set(b.id, { ...b, x: bx, y: rowY });
          bx += b.w + GAP_X;
        }
        rowY += Math.max(...line.map((b) => b.h)) + GAP_Y / 2;
      }
      x += colWidth[ci];
    });
    y += rowHeight[ri];
  });
  const width = LEFT + colWidth.reduce((s, w) => s + w, 0);
  const bands = rows.map((r, ri) => ({ label: r === "\uffff" ? `no ${rowKey} stated` : r, y: HEADER + rowHeight.slice(0, ri).reduce((s, h) => s + h, 0), h: rowHeight[ri] }));
  const lanes = columns.map((c, ci) => ({ label: c === "\uffff" ? `no ${columnKey} stated` : c, x: LEFT + colWidth.slice(0, ci).reduce((s, w) => s + w, 0), w: colWidth[ci] }));
  return { width, height: y, placed, edges: route(edges, placed), bands, lanes };
}

/* ----- the layered layout: labelled bands of a ranked graph, for trace and member graphs ----- */
// `layers` is a list of bands, each `{ label, nodes }` or a bare node list with no label. A band
// wraps after PER_ROW boxes; its label sits at the left, so the relation or rank is in words.
function layeredLayout(layers, edges) {
  const LEFT = layers.some((l) => !Array.isArray(l) && l.label) ? 160 : 16;
  const placed = new Map();
  let y = 16;
  let width = 0;
  const rowsOut = [];
  const bands = [];
  for (const layer of layers) {
    const nodes = Array.isArray(layer) ? layer : layer.nodes;
    const label = Array.isArray(layer) ? null : layer.label;
    const items = nodes.map(box);
    const top = y;
    for (let i = 0; i < items.length; i += PER_ROW) {
      const line = items.slice(i, i + PER_ROW);
      const lineWidth = line.reduce((s, b) => s + b.w + GAP_X, -GAP_X);
      rowsOut.push({ line, lineWidth, y: y + (label ? BAND_PAD : 0) });
      width = Math.max(width, lineWidth);
      y += Math.max(...line.map((b) => b.h)) + (label ? GAP_Y / 2 : GAP_Y);
    }
    if (label) {
      y += 2 * BAND_PAD;
      bands.push({ label, y: top, h: y - top });
      y += GAP_Y / 2;
    }
  }
  width += 32;
  for (const { line, lineWidth, y: rowY } of rowsOut) {
    let x = LEFT + Math.round((width - lineWidth) / 2);
    for (const b of line) {
      placed.set(b.id, { ...b, x, y: rowY });
      x += b.w + GAP_X;
    }
  }
  return { width: width + LEFT, height: y, placed, edges: route(edges, placed), bands, lanes: [] };
}

/** Straight edges from border to border of the two boxes' centers, rounded to whole pixels. */
function route(edges, placed) {
  const clip = (b, tx, ty) => {
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    const dx = tx - cx;
    const dy = ty - cy;
    if (dx === 0 && dy === 0) return [cx, cy];
    const scale = Math.min(Math.abs((b.w / 2) / (dx || 1e-9)), Math.abs((b.h / 2) / (dy || 1e-9)));
    return [Math.round(cx + dx * scale), Math.round(cy + dy * scale)];
  };
  return edges
    .filter((e) => placed.has(e.from) && placed.has(e.to))
    .map((e) => {
      const a = placed.get(e.from);
      const b = placed.get(e.to);
      const [x1, y1] = clip(a, b.x + b.w / 2, b.y + b.h / 2);
      const [x2, y2] = clip(b, a.x + a.w / 2, a.y + a.h / 2);
      return { ...e, x1, y1, x2, y2 };
    });
}

/* ----- the SVG and its text equivalent ----- */
let diagramCount = 0;
function svg(layout, title, description) {
  const id = `diagram-${++diagramCount}`;
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-text" viewBox="0 0 ${layout.width} ${layout.height}" width="${layout.width}" height="${layout.height}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12">`);
  out.push(`<title id="${id}-title">${esc(title)}</title>`);
  out.push(`<defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#444"/></marker></defs>`);
  layout.bands.forEach((band, i) => {
    out.push(`<g class="band" data-layer="${esc(band.label)}"><rect x="0" y="${band.y}" width="${layout.width}" height="${band.h}" fill="${i % 2 === 0 ? "#f4f6f8" : "#ffffff"}"/><text x="8" y="${band.y + 20}" font-weight="bold">${esc(band.label)}</text></g>`);
  });
  layout.lanes.forEach((lane) => {
    out.push(`<g class="lane" data-context="${esc(lane.label)}"><line x1="${lane.x}" y1="0" x2="${lane.x}" y2="${layout.height}" stroke="#c8ccd0"/><text x="${lane.x + 8}" y="18" font-weight="bold">${esc(lane.label)}</text></g>`);
  });
  for (const e of layout.edges) {
    const dashed = e.kind !== "uses" && e.kind !== "relation";
    out.push(`<g class="edge" data-from="${esc(e.from)}" data-to="${esc(e.to)}" data-kind="${esc(e.kind)}"><line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" stroke="#444" stroke-width="${e.count > 1 ? 2 : 1}"${dashed ? ' stroke-dasharray="6 4"' : ""} marker-end="url(#${id}-arrow)"/></g>`);
  }
  for (const b of [...layout.placed.values()].sort((x, y) => byId(x.id, y.id))) {
    const dashed = b.planned || b.folded;
    out.push(`<g class="node" data-id="${esc(b.id)}"${b.planned ? ' data-planned="true"' : ""}${b.folded ? ' data-folded="true"' : ""}><a href="#${esc(b.href ?? b.id)}"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="4" fill="${b.planned ? "#ffffff" : b.folded ? "#eef2f7" : "#e8f0fe"}" stroke="#30363d"${dashed ? ' stroke-dasharray="5 3"' : ""}/>`);
    b.lines.forEach((line, i) => out.push(`<text x="${b.x + PAD}" y="${b.y + PAD + 12 + i * LINE}">${esc(line)}</text>`));
    out.push(`</a></g>`);
  }
  out.push(`</svg>`);
  const text = [`<details id="${id}-text"><summary>The diagram as text</summary><ul>`];
  for (const b of [...layout.placed.values()].sort((x, y) => byId(x.id, y.id)))
    text.push(`<li>${esc(b.id)}: ${esc(b.lines.slice(wrap(b.id).length).join("; "))}</li>`);
  for (const e of layout.edges) text.push(`<li>${esc(e.from)} ${esc(e.label ?? e.kind)} ${esc(e.to)}${e.count > 1 ? ` (${e.count} unit edges)` : ""}</li>`);
  text.push(`</ul></details>`);
  return `<figure><figcaption>${esc(description)}</figcaption><div class="scroll">${out.join("")}</div>${text.join("")}</figure>`;
}

/* ----- the architecture lens with its fold ----- */
const report = [];
function measure(name, nodes, edges, layout) {
  report.push({ diagram: name, nodes, edges, width: layout?.width ?? null, height: layout?.height ?? null, drawn: layout !== undefined });
}

function architecturePage() {
  const model = architectureModel();
  const sections = [];
  const within = (nodes, edges) => nodes.length <= BOUND && edges.length <= EDGE_BOUND;
  if (within(model.nodes, model.edges)) {
    const layout = gridLayout(model.nodes, model.edges, "context", "layer", LAYERS);
    measure("architecture", model.nodes.length, model.edges.length, layout);
    sections.push(svg(layout, "Components by context and layer", `${model.nodes.length} components and ${model.edges.length} uses edges, within the bound of ${BOUND} nodes and ${EDGE_BOUND} edges.`));
    return sections.join("\n");
  }
  // Fold by context: one node per context, uses aggregated between contexts.
  const contextOf = new Map(model.nodes.map((n) => [n.id, n.context ?? "\uffff"]));
  const contexts = [...new Set(model.nodes.map((n) => n.context ?? "\uffff"))].sort(byId);
  const foldedNodes = contexts.map((c) => {
    const inside = model.nodes.filter((n) => (n.context ?? "\uffff") === c);
    return { id: c === "\uffff" ? "no context stated" : `context ${c}`, href: `context-${c}`, folded: true, notes: [`${inside.length} components, folded`, `${inside.filter((n) => n.planned).length} planned`] };
  });
  const between = new Map();
  for (const e of model.edges) {
    const a = contextOf.get(e.from);
    const b = contextOf.get(e.to);
    if (a === b) continue;
    const key = `${a}\u0000${b}`;
    between.set(key, (between.get(key) ?? 0) + e.count);
  }
  const foldedEdges = [...between.entries()].map(([key, count]) => {
    const [a, b] = key.split("\u0000");
    const name = (c) => (c === "\uffff" ? "no context stated" : `context ${c}`);
    return { from: name(a), to: name(b), kind: "uses", label: "uses", count };
  });
  const top = layeredLayout([foldedNodes], foldedEdges);
  measure("architecture, folded by context", foldedNodes.length, foldedEdges.length, top);
  sections.push(svg(top, "Contexts, folded", `${model.nodes.length} components exceed the bound of ${BOUND}; the diagram folds by context. Each context follows.`));
  for (const c of contexts) {
    const inside = model.nodes.filter((n) => (n.context ?? "\uffff") === c);
    const insideIds = new Set(inside.map((n) => n.id));
    const outsideContexts = new Map();
    const edges = [];
    for (const e of model.edges) {
      const fromIn = insideIds.has(e.from);
      const toIn = insideIds.has(e.to);
      if (fromIn && toIn) edges.push(e);
      else if (fromIn || toIn) {
        const other = contextOf.get(fromIn ? e.to : e.from);
        const otherId = other === "\uffff" ? "no context stated" : `context ${other}`;
        outsideContexts.set(otherId, other);
        edges.push({ ...e, from: fromIn ? e.from : otherId, to: toIn ? e.to : otherId });
      }
    }
    const stubs = [...outsideContexts.keys()].sort(byId).map((id) => ({ id, href: `context-${outsideContexts.get(id)}`, folded: true, context: c, layer: "other contexts", notes: ["another context, folded"] }));
    const nodes = [...inside, ...stubs];
    const name = c === "\uffff" ? "no context stated" : c;
    sections.push(`<h2 id="context-${esc(c)}">Context ${esc(name)}</h2>`);
    if (within(nodes, edges)) {
      const layout = gridLayout(nodes, edges, "context", "layer", LAYERS);
      measure(`context ${name}`, nodes.length, edges.length, layout);
      sections.push(svg(layout, `Context ${name} by layer`, `${inside.length} components and ${stubs.length} other contexts.`));
      continue;
    }
    // Fold by layer inside the context.
    const layers = [...new Set(inside.map((n) => n.layer ?? "\uffff"))];
    const layerNodes = layers.map((l) => ({ id: `${name} · ${l === "\uffff" ? "no layer stated" : l}`, folded: true, href: `layer-${c}-${l}`, notes: [`${inside.filter((n) => (n.layer ?? "\uffff") === l).length} components, folded`] }));
    const layout = layeredLayout([layerNodes], []);
    measure(`context ${name}, folded by layer`, layerNodes.length, 0, layout);
    sections.push(svg(layout, `Context ${name}, folded by layer`, `${inside.length} components exceed the bound; the context folds by layer.`));
    for (const l of layers) {
      const cellNodes = inside.filter((n) => (n.layer ?? "\uffff") === l);
      const cellIds = new Set(cellNodes.map((n) => n.id));
      const cellEdges = model.edges.filter((e) => cellIds.has(e.from) && cellIds.has(e.to));
      sections.push(`<h3 id="layer-${esc(c)}-${esc(l)}">${esc(name)} · ${esc(l)}</h3>`);
      if (within(cellNodes, cellEdges)) {
        const cl = gridLayout(cellNodes, cellEdges, "context", "layer", LAYERS);
        measure(`context ${name} layer ${l}`, cellNodes.length, cellEdges.length, cl);
        sections.push(svg(cl, `${name} ${l}`, `${cellNodes.length} components.`));
      } else {
        measure(`context ${name} layer ${l}`, cellNodes.length, cellEdges.length, undefined);
        sections.push(`<p>${cellNodes.length} components exceed the bound with nothing left to fold, so no diagram is drawn; the list below names them.</p>`);
      }
    }
  }
  return sections.join("\n");
}

/* ----- a component's members and what they use ----- */
function componentPages() {
  const owner = new Map(data.memberOf.map((row) => [row.unit, row.component]));
  const sections = [];
  for (const c of data.components) {
    const members = data.memberOf.filter((r) => r.component === c.id).map((r) => r.unit).sort(byId);
    if (members.length === 0) continue;
    const inside = new Set([c.id, ...members]);
    const outside = new Map();
    const edges = [];
    for (const e of data.uses) {
      if (!inside.has(e.from)) continue;
      if (inside.has(e.to)) edges.push({ ...e, kind: "uses" });
      else {
        const other = e.to.startsWith("component:") ? e.to : owner.get(e.to) ?? e.to;
        outside.set(other, true);
        edges.push({ from: e.from, to: other, kind: "uses" });
      }
    }
    const unique = [...new Map(edges.map((e) => [`${e.from}\u0000${e.to}`, e])).values()];
    const unitById = new Map(data.units.map((u) => [u.id, u]));
    const memberNodes = members.map((id) => ({ id, notes: [`${unitById.get(id)?.role ?? "no role"} · ${unitById.get(id)?.file ?? ""}:${unitById.get(id)?.line ?? ""}`] }));
    const outsideNodes = [...outside.keys()].sort(byId).map((id) => ({ id, folded: true, notes: ["outside this component"] }));
    // Rank: members that use nothing inside rank last; a simple longest-path rank over inside edges.
    const rank = new Map(members.map((id) => [id, 0]));
    for (let pass = 0; pass < members.length; pass++)
      for (const e of unique) if (rank.has(e.from) && rank.has(e.to) && rank.get(e.to) <= rank.get(e.from)) rank.set(e.to, rank.get(e.from) + 1);
    const maxRank = Math.max(0, ...rank.values());
    const layers = [];
    for (let r = 0; r <= maxRank; r++) layers.push(memberNodes.filter((n) => rank.get(n.id) === r));
    if (outsideNodes.length) layers.push(outsideNodes);
    const nodeCount = memberNodes.length + outsideNodes.length;
    sections.push(`<h2 id="${esc(c.id)}">${esc(c.id)}</h2>`);
    if (nodeCount <= BOUND && unique.length <= EDGE_BOUND) {
      const layout = layeredLayout(layers, unique);
      measure(`members of ${c.id}`, nodeCount, unique.length, layout);
      sections.push(svg(layout, `Members of ${c.id}`, `${memberNodes.length} members and ${outsideNodes.length} outside units or components they use.`));
    } else {
      measure(`members of ${c.id}`, nodeCount, unique.length, undefined);
      sections.push(`<p>${nodeCount} nodes exceed the bound of ${BOUND}; no diagram is drawn.</p>`);
    }
  }
  return sections.join("\n");
}

/* ----- one Spec's relations, folded by relation group above the bound ----- */
function tracePage(specId) {
  const titles = new Map(data.specs.map((s) => [s.id, s]));
  const out = data.relations.filter((r) => r.from === specId);
  const inn = data.relations.filter((r) => r.to === specId);
  const groups = [];
  const add = (direction, rows) => {
    const byType = new Map();
    for (const r of rows) {
      const other = direction === "rests on" ? r.to : r.from;
      const key = `${r.type}`;
      byType.set(key, [...new Set([...(byType.get(key) ?? []), other])].sort(byId));
    }
    for (const [type, ids] of [...byType.entries()].sort((a, b) => byId(a[0], b[0]))) groups.push({ direction, type, ids });
  };
  add("rests on", out);
  add("rested on by", inn);
  let count = 1 + groups.reduce((s, g) => s + g.ids.length, 0);
  const total = count;
  // Fold the largest group first, ties by direction then type, until the diagram is within the bound.
  const order = [...groups].sort((a, b) => b.ids.length - a.ids.length || byId(a.direction, b.direction) || byId(a.type, b.type));
  for (const group of order) {
    if (count <= BOUND) break;
    if (group.ids.length < 2) continue;
    count -= group.ids.length - 1;
    group.folded = true;
  }
  const nodeFor = (group, id) => ({ id, notes: [`${titles.get(id)?.specKind ?? "?"} · ${titles.get(id)?.statedReadiness ?? "?"}`] });
  const TYPES = ["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"];
  const bandsOf = (direction) =>
    groups
      .filter((g) => g.direction === direction)
      .sort((a, b) => TYPES.indexOf(a.type) - TYPES.indexOf(b.type))
      .map((group) => {
        const nodes = [];
        if (group.folded) {
          const id = `${group.ids.length} Specs, ${group.direction === "rests on" ? group.type : `${group.type} this`}`;
          nodes.push({ id, folded: true, href: "relations", notes: ["folded; the relations table lists them"] });
          edges.push(group.direction === "rests on" ? { from: specId, to: id, kind: "relation", label: group.type } : { from: id, to: specId, kind: "relation", label: group.type });
        } else
          for (const id of group.ids) {
            nodes.push(nodeFor(group, id));
            edges.push(group.direction === "rests on" ? { from: specId, to: id, kind: "relation", label: group.type } : { from: id, to: specId, kind: "relation", label: group.type });
          }
        return { label: group.direction === "rests on" ? `${group.type}` : `${group.type} this`, nodes };
      });
  const edges = [];
  const above = bandsOf("rests on");
  const below = bandsOf("rested on by");
  const center = { id: specId, notes: [`${titles.get(specId)?.specKind} · ${titles.get(specId)?.statedReadiness}`] };
  const unique = [...new Map(edges.map((e) => [`${e.from}\u0000${e.to}\u0000${e.label}`, e])).values()];
  const layout = layeredLayout([...above, { label: "this Spec", nodes: [center] }, ...below], unique);
  measure(`trace of ${specId} (${total} before folding)`, count, unique.length, layout);
  return `<h2 id="${esc(specId)}">${esc(specId)}</h2>` + svg(layout, `Relations of ${specId}`, `${total} nodes before folding, ${count} drawn.`);
}

/* ----- the pages ----- */
const css = `body{font-family:system-ui,sans-serif;margin:24px;max-width:none}figure{margin:0 0 32px}.scroll{overflow:auto;border:1px solid #d0d7de;max-width:100%}figcaption{margin:8px 0}`;
const page = (title, body) => `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head><body><h1>${esc(title)}</h1>${SYNTHETIC ? `<p>Includes ${SYNTHETIC * 25} synthetic planned components across five synthetic contexts, to show the fold.</p>` : ""}${body}</body></html>\n`;
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "architecture.html"), page("Architecture lens", architecturePage()));
writeFileSync(join(outDir, "components.html"), page("Component members", componentPages()));
const degree = new Map();
for (const r of data.relations) {
  degree.set(r.from, (degree.get(r.from) ?? 0) + 1);
  degree.set(r.to, (degree.get(r.to) ?? 0) + 1);
}
const busiest = [...degree.entries()].filter(([id]) => id.startsWith("spec:")).sort((a, b) => b[1] - a[1] || byId(a[0], b[0])).slice(0, 3).map(([id]) => id);
const median = [...degree.entries()].filter(([id]) => id.startsWith("spec:")).sort((a, b) => a[1] - b[1] || byId(a[0], b[0]))[Math.floor(degree.size / 2)][0];
writeFileSync(join(outDir, "trace.html"), page("Trace graphs", [...busiest, median].map(tracePage).join("\n")));
writeFileSync(join(outDir, "measurements.json"), `${JSON.stringify({ bound: BOUND, edgeBound: EDGE_BOUND, synthetic: SYNTHETIC, diagrams: report }, null, 2)}\n`);
console.log(JSON.stringify(report.map((r) => `${r.diagram}: ${r.nodes} nodes, ${r.edges} edges, ${r.drawn ? `${r.width}x${r.height}` : "not drawn"}`), null, 1));

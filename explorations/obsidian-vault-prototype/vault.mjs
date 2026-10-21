// Prototype, evidence only: the vault the design in pack:obsidian-vault-v1 describes, written from
// the one graph by the built engine in dist/. Never promote this code into the product.
//
// usage: node vault.mjs ROOT OUT [--exclude PATH]... [--simulate-term-keys] [--render-only]
//
// It writes only OUT/sdp/ and its manifest OUT/sdp/.sdp-vault.json, and refuses, writing nothing,
// when a file under OUT/sdp/ is not one it wrote or differs from what it wrote.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const engine = await import(join(here, "..", "..", "dist", "index.js"));
const { extract, createReader, validateGraph, mentionTokens } = engine;

export const OWNED = "sdp";
export const MANIFEST = ".sdp-vault.json";
const TEMP_SUFFIX = ".sdp-tmp";

// ---------- names and links ----------
const SECTION_OF_SEGMENT = { design: "design", ui: "ui", question: "question", rule: "rule", term: "term" };
export const noteName = (id) => id.replace(":", ".");
const family = (id) => id.slice(id.indexOf(":") + 1).split(".")[0];

export function notePath(id, graphIndex) {
  const ns = id.slice(0, id.indexOf(":"));
  if (ns === "spec") return `${OWNED}/specs/${family(id)}/${noteName(id)}`;
  if (ns === "pack") return `${OWNED}/packs/${noteName(id)}`;
  if (graphIndex.has(id)) return `${OWNED}/code/${ns}/${noteName(id)}`;
  return undefined;
}
export const termNoteName = (specId, key) => `term.${specId.slice("spec:".length)}.${key}`;
const termPath = (specId, key) => `${OWNED}/terms/${termNoteName(specId, key)}`;
const blockId = (section, key) => `${section}-${key}`;

// ---------- text ----------
// Escape what Obsidian would read as a link, embed, tag, block id, comment, highlight or math.
function escapeObsidian(text) {
  return text
    .replace(/\[\[/gu, "\\[\\[")
    .replace(/%%/gu, "\\%\\%")
    .replace(/==/gu, "\\=\\=")
    .replace(/\$/gu, "\\$")
    .replace(/(^|\s)#(?=[^\s#])/gu, "$1\\#")
    .replace(/(\s)\^(?=[A-Za-z0-9-]+\s*$)/gu, "$1\\^");
}

function splitCodeSpans(value) {
  const parts = [];
  const runs = [...value.matchAll(/`+/gu)];
  let at = 0;
  for (let i = 0; i < runs.length; i++) {
    const open = runs[i];
    const closing = runs.findIndex((run, j) => j > i && run[0].length === open[0].length);
    if (closing < 0) continue;
    const close = runs[closing];
    parts.push({ code: false, text: value.slice(at, open.index) });
    parts.push({ code: true, text: value.slice(open.index + open[0].length, close.index), fence: open[0] });
    at = close.index + close[0].length;
    i = closing;
  }
  parts.push({ code: false, text: value.slice(at) });
  return parts;
}

// ---------- the vault ----------
export function renderVault(root, exclude, options = {}) {
  const extraction = extract({ root, exclude });
  const graph = extraction.graph;
  const report = validateGraph(graph);
  const g = createReader(graph);
  const files = new Map();
  const nodesById = new Map(graph.nodes.map((n) => [n.id, n]));
  const codeIds = new Set(graph.nodes.filter((n) => n.nodeType === "CodeNode" || n.nodeType === "Anchor").map((n) => n.id));
  const specIds = new Set(graph.nodes.filter((n) => n.nodeType === "Primitive").map((n) => n.id));
  const pathOf = (id) => notePath(id, codeIds);

  // Keyed Model terms. The term-address design gives a term an authored key; until it lands the
  // prototype can simulate one per term, so link and block mechanics are exercised.
  const termKeysOf = (ctx) => {
    const terms = ctx.sections?.model?.terms ?? {};
    const authored = ctx.sections?.model?.termKeys;
    if (authored) return Object.entries(authored).map(([key, term]) => ({ key, term, definition: terms[term] }));
    if (!options.simulateTermKeys) return [];
    return Object.keys(terms).map((term) => ({
      key: term.replace(/[^A-Za-z0-9]+(.)?/gu, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./u, (c) => c.toLowerCase()),
      term,
      definition: terms[term],
    }));
  };

  // Which entry addresses resolve: keyed design and ui entries, keyed questions, rule keys, term keys.
  const addressable = new Set();
  const contexts = new Map();
  for (const id of specIds) {
    const ctx = g.specContext(id);
    contexts.set(id, ctx);
    const s = ctx.sections ?? {};
    for (const section of ["design", "ui"]) for (const key of Object.keys(s[section] ?? {})) if (key !== "description") addressable.add(`${id}#${section}.${key}`);
    for (const q of s.intent?.openQuestions ?? []) if (q.key) addressable.add(`${id}#question.${q.key}`);
    for (const key of Object.keys(s.behavior?.ruleKeys ?? {})) addressable.add(`${id}#rule.${key}`);
    for (const t of termKeysOf(ctx)) addressable.add(`${id}#term.${t.key}`);
  }

  const link = (id, display = id) => {
    const path = pathOf(id);
    return path === undefined ? `\`${id}\`` : `[[${path}.md|${display}]]`;
  };
  const mentionLink = (token) => {
    const [id, address] = token.split("#");
    if (!specIds.has(id)) return undefined;
    if (address === undefined) return `[[${pathOf(id)}.md|${token}]]`;
    if (!addressable.has(token)) return undefined;
    const [section, key] = address.split(".");
    if (!(section in SECTION_OF_SEGMENT)) return undefined;
    return `[[${pathOf(id)}.md#^${blockId(section, key)}|${token}]]`;
  };
  const prose = (value) => {
    if (value === undefined || value === null) return "";
    return splitCodeSpans(String(value))
      .map((part) => {
        if (part.code) {
          const tokens = mentionTokens(part.text);
          if (tokens.length === 1 && tokens[0] === part.text.trim()) return mentionLink(tokens[0]) ?? `${part.fence}${part.text}${part.fence}`;
          return `${part.fence}${part.text}${part.fence}`;
        }
        let out = "";
        let at = 0;
        for (const token of mentionTokens(part.text)) {
          const start = part.text.indexOf(token, at);
          if (start < 0) continue;
          const linked = mentionLink(token);
          out += escapeObsidian(part.text.slice(at, start)) + (linked ?? escapeObsidian(token));
          at = start + token.length;
        }
        return out + escapeObsidian(part.text.slice(at));
      })
      .join("");
  };
  const frontmatter = (props) =>
    `---\n${Object.entries(props)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n")}\n---\n`;
  const banner = (what, file) => `> [!info] Generated by \`sdp vault\` from the graph. Edit the ${what} \`${file}\`, never this note: a regeneration refuses while a note it wrote has changed.\n`;
  const write = (path, text) => {
    if (files.has(path)) throw new Error(`two notes share ${path}`);
    files.set(path, text.endsWith("\n") ? text : `${text}\n`);
  };
  const findingLines = (findings) =>
    findings.length === 0 ? [] : ["## Findings", "", ...findings.map((f) => `- ${f.severity} \`${f.validatorId}\`: ${prose(f.message)}`), ""];

  // ----- Spec notes -----
  const sectionOrder = ["intent", "behavior", "constraints", "model", "design", "decision", "verification", "ui"];
  for (const id of [...specIds].sort()) {
    const ctx = contexts.get(id);
    const s = ctx.sections ?? {};
    const body = [];
    for (const name of sectionOrder) {
      const section = s[name];
      if (section === undefined || section === null) continue;
      const lines = [];
      if (name === "intent") {
        for (const field of ["actor", "problem", "outcome", "value"]) if (section[field]) lines.push(`- ${field}: ${prose(section[field])}`);
        for (const r of section.risks ?? []) lines.push(`- risk: ${prose(r)}`);
        for (const a of section.assumptions ?? []) lines.push(`- assumption: ${prose(a)}`);
        if ((section.openQuestions ?? []).length) {
          lines.push("", "### Open questions", "");
          for (const q of section.openQuestions) {
            lines.push(`- ${q.blocking ? "blocking" : "non-blocking"}${q.key ? ` \`#${q.key}\`` : ""} ${prose(q.question)}${q.key ? ` ^${blockId("question", q.key)}` : ""}`);
            for (const f of ["decider", "provisional", "trigger"]) if (q[f]) lines.push(`  - ${f}: ${prose(q[f])}`);
            if (q.links?.length) lines.push(`  - links: ${q.links.map((t) => mentionLink(t) ?? `\`${t}\``).join(", ")}`);
          }
        }
      } else if (name === "behavior") {
        const keyed = new Map(Object.entries(section.ruleKeys ?? {}).map(([key, at]) => [at, key]));
        for (const field of ["rules", "flows"])
          (section[field] ?? []).forEach((text, i) => {
            const key = keyed.get(`${field}[${i}]`);
            lines.push(`- ${field === "flows" ? "flow: " : ""}${key ? `\`#${key}\` ` : ""}${prose(text)}${key ? ` ^${blockId("rule", key)}` : ""}`);
          });
        if (section.exampleSpace) lines.push("", "```gherkin", String(section.exampleSpace).trim(), "```");
        for (const ex of section.examples ?? []) {
          if (typeof ex === "string") { lines.push(`- ${prose(ex)}`); continue; }
          lines.push("", "```gherkin");
          for (const step of ["given", "when", "then"]) for (const t of ex[step] ?? []) lines.push(`${step[0].toUpperCase()}${step.slice(1)} ${t}`);
          lines.push("```");
        }
      } else if (name === "design" || name === "ui") {
        if (section.description) lines.push(prose(section.description), "");
        for (const [k, v] of Object.entries(section)) if (k !== "description") lines.push(`- **${k}**: ${prose(typeof v === "string" ? v : JSON.stringify(v))} ^${blockId(name, k)}`);
      } else if (name === "model") {
        const keyByTerm = new Map(termKeysOf(ctx).map((t) => [t.term, t.key]));
        for (const [term, def] of Object.entries(section.terms ?? {})) {
          const key = keyByTerm.get(term);
          lines.push(`- ${key ? `[[${termPath(id, key)}.md|${term}]]` : `**${escapeObsidian(term)}**`} — ${prose(def)}${key ? ` ^${blockId("term", key)}` : ""}`);
        }
      } else if (name === "decision") {
        for (const f of ["context", "decision"]) if (section[f]) lines.push(`- ${f}: ${prose(section[f])}`);
        for (const [f, label] of [["rationale", "rationale"], ["alternatives", "alternative"], ["consequences", "consequence"]]) for (const v of section[f] ?? []) lines.push(`- ${label}: ${prose(v)}`);
      } else if (name === "constraints") {
        for (const c of Array.isArray(section) ? section : [section]) for (const [k, v] of Object.entries(c)) lines.push(`- ${k}: ${prose(v)}`);
      } else if (name === "verification") {
        lines.push(`- mode: ${section.mode}`);
        for (const c of section.criteria ?? []) lines.push(`- ${prose(c)}`);
      }
      if (lines.length) body.push(`## ${name[0].toUpperCase()}${name.slice(1)}`, "", ...lines, "");
    }
    const rel = (r, otherFirst) => {
      // `exercises` names rule keys of the verified Spec: the other end going out, this Spec coming in.
      const verified = otherFirst ? id : r.otherId;
      const ex = r.exercises?.length ? ` (exercises ${r.exercises.map((k) => `[[${pathOf(verified)}.md#^rule-${k}|#${k}]]`).join(", ")})` : "";
      return `- ${otherFirst ? `${link(r.otherId)} ${r.type} this` : `${r.type} ${link(r.otherId)}`}${r.otherTitle ? ` ${escapeObsidian(r.otherTitle)}` : ""}${ex}${r.reason ? ` — ${prose(r.reason)}` : ""}`;
    };
    const relations = [
      ...(ctx.relationsOut.length ? ["### From this Spec", "", ...ctx.relationsOut.map((r) => rel(r, false)), ""] : []),
      ...(ctx.relationsIn.length ? ["### Toward this Spec", "", ...ctx.relationsIn.map((r) => rel(r, true)), ""] : []),
    ];
    const impl = ctx.deliveryFacts.includes("implemented");
    const verified = ctx.deliveryFacts.includes("has-verifier");
    const bindings = [
      "## Bindings",
      "",
      `- Implementation binding: ${impl ? "present" : "none"}`,
      ...ctx.implementations.map((u) => `  - ${link(u.codeId)} \`${u.file}:${u.line}\``),
      ...(ctx.references.length ? [`- Referenced by:`, ...ctx.references.map((u) => `  - ${link(u.codeId)} \`${u.file}:${u.line}\``)] : []),
      `- Verifier binding: ${verified ? "present" : "none"}`,
      ...ctx.verifiers.map((v) => `  - ${link(v.verifierId)}${v.via === "example" ? ` (example, ${v.enabled ? "enabled" : "not enabled"})` : ""}`),
      `- Expected-outcome oracle: ${ctx.oracle ? "present" : "none"}`,
      ...(ctx.oracle ? [`  - ${link(ctx.oracle.anchorId)}`] : []),
      "- Runtime observation: not tracked",
      "",
    ];
    const dc = ctx.designColumns;
    const props = {
      aliases: [id, ctx.title],
      title: ctx.title,
      specKind: ctx.specKind,
      altitude: ctx.altitude,
      statedReadiness: ctx.statedReadiness,
      derivedReadiness: ctx.derivedReadiness ?? "none",
      statedNextRung: ctx.statedNextRung,
      statedNextRungFailures: ctx.statedNextRungFailures.map((f) => f.clauseId),
      implementationBinding: impl,
      verifierBinding: verified,
      designEntries: dc.entries,
      declarations: dc.declarations,
      openQuestions: dc.openQuestions.length,
      blockingQuestions: dc.blockingQuestions,
      decisions: dc.decisions.filter((d) => d.resolved).map((d) => `[[${pathOf(d.id)}.md|${d.id}]]`),
      packs: ctx.packs.map((p) => `[[${pathOf(p)}.md|${p}]]`),
      carrier: ctx.file,
    };
    const head = `\`${id}\` · ${ctx.kindDisplayLabel} · ${ctx.altitude} · stated ${ctx.statedReadiness} · floor ${ctx.derivedReadiness ?? "none"}${ctx.statedNextRung ? ` · ${ctx.statedNextRung}: ${ctx.statedNextRungFailures.length ? ctx.statedNextRungFailures.map((f) => f.clauseId).join(", ") : "nothing blocks"}` : ""}`;
    write(
      `${pathOf(id)}.md`,
      [
        frontmatter(props),
        banner("carrier", ctx.file),
        `# ${escapeObsidian(ctx.title)}`,
        "",
        head,
        "",
        ...(ctx.narrative ? [...String(ctx.narrative).split(/\n\s*\n/u).map(prose).flatMap((p) => [p, ""])] : []),
        ...body,
        ...(relations.length ? ["## Relations", "", ...relations] : []),
        ...bindings,
        ...(ctx.packs.length ? ["## Packs", "", ...ctx.packs.map((p) => `- ${link(p)}`), ""] : []),
        ...findingLines(ctx.findings),
      ].join("\n"),
    );
    for (const t of termKeysOf(ctx)) {
      const address = `${id}#term.${t.key}`;
      write(
        `${termPath(id, t.key)}.md`,
        [
          frontmatter({ aliases: [t.term, address], definedIn: `[[${pathOf(id)}.md|${id}]]` }),
          banner("carrier", ctx.file),
          `# ${escapeObsidian(t.term)}`,
          "",
          prose(t.definition),
          "",
          `Defined in [[${pathOf(id)}.md#^${blockId("term", t.key)}|${address}]].`,
        ].join("\n"),
      );
    }
  }

  // ----- code notes -----
  for (const id of [...codeIds].sort()) {
    const n = nodesById.get(id);
    const ofType = (type, dir) => graph.edges.filter((e) => e.type === type && (dir === "out" ? e.from === id : e.to === id)).map((e) => (dir === "out" ? e.to : e.from));
    const groups = [
      ["Member of", ofType("memberOf", "out")],
      ["Members", ofType("memberOf", "in")],
      ["Uses", ofType("uses", "out")],
      ["Used by", ofType("uses", "in")],
      ["Satisfies", ofType("satisfies", "out")],
      ["References", ofType("references", "out")],
      ["Verifies", ofType("verifies", "out")],
      ["Models", ofType("models", "out")],
    ].filter(([, ids]) => ids.length);
    const component = ofType("memberOf", "out")[0];
    write(
      `${pathOf(id)}.md`,
      [
        frontmatter({
          aliases: [id],
          label: n.label,
          role: n.role,
          layer: n.layer,
          context: n.context,
          component: component ? `[[${pathOf(component)}.md|${component}]]` : undefined,
          sourceFile: n.file,
          sourceLine: n.line,
        }),
        banner("source file", n.file),
        `# ${id}`,
        "",
        ...(n.label ? [escapeObsidian(n.label), ""] : []),
        `\`${n.file}:${n.line}\``,
        "",
        ...groups.flatMap(([title, ids]) => [`## ${title}`, "", ...ids.map((x) => `- ${link(x)}`), ""]),
      ].join("\n"),
    );
  }

  // ----- Pack notes and Bases -----
  const fmt = (lines) => lines.join("\n");
  const displayProps = [
    "properties:",
    "  note.title:",
    "    displayName: Title",
    "  note.specKind:",
    "    displayName: Kind",
    "  note.statedReadiness:",
    "    displayName: Stated",
    "  note.derivedReadiness:",
    "    displayName: Floor reached",
    "  note.statedNextRung:",
    "    displayName: Next rung",
    "  note.statedNextRungFailures:",
    "    displayName: What holds it",
    "  formula.implementation:",
    "    displayName: Implementation binding",
    "  formula.verifier:",
    "    displayName: Verifier binding",
    "  note.designEntries:",
    "    displayName: Design entries",
    "  note.declarations:",
    "    displayName: Declarations",
    "  note.openQuestions:",
    "    displayName: Open questions",
    "  note.blockingQuestions:",
    "    displayName: Blocking",
  ];
  const formulas = ["formulas:", `  implementation: 'if(implementationBinding, "present", "none")'`, `  verifier: 'if(verifierBinding, "present", "none")'`];
  const view = (name, clauses, order) => [
    "  - type: table",
    `    name: ${JSON.stringify(name)}`,
    ...(clauses.length ? ["    filters:", "      and:", ...clauses.map((c) => `        - ${JSON.stringify(c)}`)] : []),
    "    order:",
    ...order.map((o) => `      - ${o}`),
  ];
  const memberColumns = ["file.name", "title", "specKind", "statedReadiness", "derivedReadiness", "statedNextRung", "statedNextRungFailures", "formula.implementation", "formula.verifier", "designEntries", "declarations", "openQuestions", "blockingQuestions"];
  for (const pack of graph.nodes.filter((n) => n.nodeType === "Pack").map((n) => g.packContext(n.id)).sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const path = pathOf(pack.id);
    write(
      `${path}.base`,
      fmt([
        "filters:",
        "  and:",
        `    - ${JSON.stringify(`file.inFolder("${OWNED}/specs")`)}`,
        `    - ${JSON.stringify(`packs.contains(link("${path}.md"))`)}`,
        ...formulas,
        ...displayProps,
        "views:",
        ...view("Members", [], memberColumns),
        ...view("Nothing blocks the next rung", ["!statedNextRung.isEmpty()", "statedNextRungFailures.isEmpty()"], ["file.name", "title", "statedReadiness", "statedNextRung"]),
      ]),
    );
    const boundary = Object.entries(pack.boundary).filter(([, rows]) => rows.length);
    write(
      `${path}.md`,
      [
        frontmatter({ aliases: [pack.id, pack.title ?? pack.id], title: pack.title, manifest: pack.file }),
        banner("Pack manifest", pack.file),
        `# ${escapeObsidian(pack.title ?? pack.id)}`,
        "",
        ...(pack.framing ? [prose(pack.framing), ""] : []),
        "## Members, filterable",
        "",
        `![[${path}.base]]`,
        "",
        "## Members, in reading order",
        "",
        ...pack.members.map((m, i) => `${i + 1}. ${m.resolved ? link(m.id) : `\`${m.id}\` (unresolved)`}${m.title ? ` ${escapeObsidian(m.title)}` : ""}${m.resolved ? ` · stated ${m.statedReadiness} · floor ${m.derivedReadiness ?? "none"}${m.statedNextRung ? ` · ${m.statedNextRung}: ${m.statedNextRungFailures.length ? m.statedNextRungFailures.map((f) => f.clauseId).join(", ") : "nothing blocks"}` : ""}` : ""}`),
        "",
        ...(boundary.length ? ["## Boundary", "", ...boundary.flatMap(([k, rows]) => [`### ${k}`, "", ...rows.map((r) => `- ${link(r.id)}${r.title ? ` ${escapeObsidian(r.title)}` : ""}`), ""])] : []),
        ...findingLines(pack.findings),
      ].join("\n"),
    );
  }

  // ----- the corpus Base and the index -----
  write(
    `${OWNED}/specs.base`,
    fmt([
      "filters:",
      "  and:",
      `    - ${JSON.stringify(`file.inFolder("${OWNED}/specs")`)}`,
      ...formulas,
      ...displayProps,
      "views:",
      ...view("All Specs", [], ["file.name", "title", "specKind", "altitude", "statedReadiness", "derivedReadiness", "formula.implementation", "formula.verifier"]),
      ...view("Build backlog", ['statedReadiness == "ready"', 'specKind != "example"', 'specKind != "decision"', "implementationBinding == false"], ["file.name", "title", "specKind", "formula.verifier", "designEntries", "declarations"]),
      ...view("Design backlog", ['statedReadiness == "defined"', 'specKind != "example"', 'specKind != "decision"', "implementationBinding == false"], ["file.name", "title", "specKind", "derivedReadiness", "statedNextRungFailures", "designEntries", "declarations", "openQuestions"]),
      ...view("Nothing blocks the next rung", ["!statedNextRung.isEmpty()", "statedNextRungFailures.isEmpty()"], ["file.name", "title", "specKind", "statedReadiness", "statedNextRung"]),
      ...view("Blocking questions", ["blockingQuestions > 0"], ["file.name", "title", "statedReadiness", "blockingQuestions"]),
      ...view("Decisions", ['specKind == "decision"'], ["file.name", "title", "statedReadiness", "derivedReadiness"]),
    ]),
  );
  const totals = { error: 0, warning: 0 };
  for (const f of report.findings) totals[f.severity] = (totals[f.severity] ?? 0) + 1;
  for (const f of extraction.report.findings) totals[f.severity] = (totals[f.severity] ?? 0) + 1;
  write(
    `${OWNED}/index.md`,
    [
      frontmatter({ aliases: ["Spec graph"] }),
      "> [!info] Generated by `sdp vault` from the graph. Every note under `sdp/` is regenerated; write your own notes outside it, intent notes in `intent/`.",
      "",
      "# Spec graph",
      "",
      `Findings: ${totals.error} errors, ${totals.warning} warnings.`,
      "",
      "## Standing views",
      "",
      `![[${OWNED}/specs.base]]`,
      "",
      "## Packs",
      "",
      ...graph.nodes.filter((n) => n.nodeType === "Pack").map((n) => n.id).sort().map((p) => `- ${link(p)}`),
    ].join("\n"),
  );
  return { files, graph, report, extraction, reader: g };
}

// ---------- the guard and the synchronization ----------
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function walk(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // dotfiles: Obsidian shows none; the manifest and temporaries are ours
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else out.push(relative(base, full).split(sep).join("/"));
  }
  return out;
}

export function guard(out) {
  const owned = join(out, OWNED);
  const manifestPath = join(owned, MANIFEST);
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")).files : {};
  const conflicts = [];
  for (const rel of walk(owned).sort()) {
    const known = manifest[rel];
    if (known === undefined) conflicts.push({ path: `${OWNED}/${rel}`, why: "unknown" });
    else if (!known.includes(sha256(readFileSync(join(owned, rel))))) conflicts.push({ path: `${OWNED}/${rel}`, why: "changed" });
  }
  return { manifest, conflicts };
}

const manifestText = (files) =>
  `${JSON.stringify({ schema: "sdp-vault/1", files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) }, null, 2)}\n`;

function atomicWrite(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temp = join(dirname(path), `.${path.split(sep).pop()}${TEMP_SUFFIX}`);
  writeFileSync(temp, bytes);
  renameSync(temp, path);
}

export function synchronize(out, files) {
  const { manifest, conflicts } = guard(out);
  if (conflicts.length) return { conflicts };
  const owned = join(out, OWNED);
  const next = {};
  for (const [path, text] of files) next[path.slice(OWNED.length + 1)] = [sha256(Buffer.from(text))];
  const pending = {};
  for (const rel of new Set([...Object.keys(manifest), ...Object.keys(next)])) pending[rel] = [...new Set([...(manifest[rel] ?? []), ...(next[rel] ?? [])])];
  atomicWrite(join(owned, MANIFEST), manifestText(pending));
  let written = 0;
  let unchanged = 0;
  let removed = 0;
  for (const [path, text] of files) {
    const full = join(out, path);
    if (existsSync(full) && readFileSync(full, "utf8") === text) { unchanged++; continue; }
    atomicWrite(full, text);
    written++;
  }
  for (const rel of Object.keys(manifest)) if (!(rel in next) && existsSync(join(owned, rel))) { rmSync(join(owned, rel)); removed++; }
  const prune = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) if (entry.isDirectory()) prune(join(dir, entry.name));
    if (dir !== owned && readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
  };
  prune(owned);
  atomicWrite(join(owned, MANIFEST), manifestText(next));
  return { conflicts: [], written, unchanged, removed };
}

// ---------- CLI ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const exclude = [];
  const positional = [];
  let simulateTermKeys = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exclude") exclude.push(args[++i]);
    else if (args[i] === "--simulate-term-keys") simulateTermKeys = true;
    else positional.push(args[i]);
  }
  const [root, out] = positional;
  const { files } = renderVault(resolve(root), exclude, { simulateTermKeys });
  const result = synchronize(resolve(out), files);
  if (result.conflicts.length) {
    for (const c of result.conflicts) console.error(`sdp vault: ${c.path} ${c.why === "unknown" ? "is not a note this command wrote" : "has changed since this command wrote it"} (${c.why})`);
    console.error("sdp vault: nothing was written. Move a note you wrote out of sdp/, or delete a generated note you changed after keeping what you wrote.");
    process.exit(1);
  }
  console.log(`sdp vault: ${files.size} files under ${OWNED}/ (${result.written} written, ${result.unchanged} unchanged, ${result.removed} removed)`);
}

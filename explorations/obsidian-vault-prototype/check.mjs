// Prototype checks, evidence only: what the vault design promises, measured on a corpus.
//
// usage: node check.mjs ROOT SCRATCH [--exclude PATH]... [--simulate-term-keys]
//
// SCRATCH must be an empty or absent directory outside ROOT; the checks write vaults under it.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

import { OWNED, renderVault, synchronize } from "./vault.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const exclude = [];
const positional = [];
let simulateTermKeys = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--exclude") exclude.push(args[++i]);
  else if (args[i] === "--simulate-term-keys") simulateTermKeys = true;
  else positional.push(args[i]);
}
const root = resolve(positional[0]);
const scratch = resolve(positional[1]);
rmSync(scratch, { recursive: true, force: true });
mkdirSync(scratch, { recursive: true });
const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });

const first = renderVault(root, exclude, { simulateTermKeys });
const second = renderVault(root, exclude, { simulateTermKeys });
const files = first.files;

// 1. Determinism: two renders of one graph write the same bytes.
const differing = [...files].filter(([p, t]) => second.files.get(p) !== t).map(([p]) => p);
check("two renders are byte-identical", differing.length === 0 && second.files.size === files.size, differing.slice(0, 5));

// 2. Names stay distinct on a file system that ignores case.
const lower = new Map();
for (const p of files.keys()) lower.set(p.toLowerCase(), [...(lower.get(p.toLowerCase()) ?? []), p]);
check("no two paths differ only in case", [...lower.values()].every((v) => v.length === 1));

// 3. Every wikilink, embed and block link resolves to a file and block the vault wrote.
const blocks = new Map();
for (const [p, t] of files) if (p.endsWith(".md")) blocks.set(p, new Set([...t.matchAll(/ \^([A-Za-z0-9-]+)$/gmu)].map((m) => m[1])));
let links = 0;
let blockLinks = 0;
const broken = [];
for (const [p, t] of files) {
  if (!p.endsWith(".md")) continue;
  // Obsidian reads no link inside a fenced block or a code span, so neither is scanned.
  const linkText = t.replace(/^```[\s\S]*?^```$/gmu, "").replace(/(`+)[^`]*?\1/gu, "");
  for (const m of linkText.matchAll(/(!?)\[\[([^\]|#]+)(?:#\^([^\]|]+))?(?:\|[^\]]*)?\]\]/gu)) {
    links++;
    const target = m[2];
    const file = target;
    if (!files.has(file)) broken.push(`${p}: ${m[0]}`);
    else if (m[3] !== undefined) {
      blockLinks++;
      if (!blocks.get(file)?.has(m[3])) broken.push(`${p}: ${m[0]} (no block)`);
    }
  }
}
check(`every link resolves (${links} links, ${blockLinks} block links)`, broken.length === 0, broken.slice(0, 10));

// 4. Frontmatter parses, and no property but aliases holds a value Obsidian renders as an
// external link: a string with no space that the URL parser accepts.
const isUrl = (v) => typeof v === "string" && !v.includes(" ") && !v.startsWith("[[") && (() => { try { new URL(v); return true; } catch { return false; } })();
const frontmatters = new Map();
const urlLike = [];
for (const [p, t] of files) {
  if (!p.endsWith(".md")) continue;
  const m = /^---\n([\s\S]*?)\n---\n/u.exec(t);
  if (!m) continue;
  const props = parseYaml(m[1]);
  frontmatters.set(p, props);
  for (const [k, v] of Object.entries(props)) if (k !== "aliases" && (Array.isArray(v) ? v : [v]).some(isUrl)) urlLike.push(`${p}: ${k}`);
}
check("only aliases hold an id with its colon", urlLike.length === 0, urlLike.slice(0, 5));
const aliasIsUrl = [...frontmatters.values()].some((props) => (props.aliases ?? []).some(isUrl));
check("an alias holds the id, which a text property would render as a link", aliasIsUrl);

// 5. Every Base parses, and every standing view's filter uses the closed clause grammar.
const clause = /^(?:(\w+) (==|!=) ("[^"]*"|true|false)|(\w+) > 0|(!?)(\w+)\.isEmpty\(\)|(\w+)\.contains\(link\("([^"]+)"\)\)|file\.inFolder\("([^"]+)"\))$/u;
const holds = (c, props, path) => {
  const m = clause.exec(c);
  if (m[1]) { const want = m[3] === "true" ? true : m[3] === "false" ? false : JSON.parse(m[3]); return m[2] === "==" ? props[m[1]] === want : props[m[1]] !== want; }
  if (m[4]) return props[m[4]] > 0;
  if (m[6]) { const v = props[m[6]]; const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0); return m[5] === "!" ? !empty : empty; }
  if (m[7]) return (props[m[7]] ?? []).some((l) => l.startsWith(`[[${m[8]}|`) || l === `[[${m[8]}]]`);
  if (m[9]) return path.startsWith(`${m[9]}/`);
  return false;
};
const bases = new Map();
const badClauses = [];
for (const [p, t] of files) {
  if (!p.endsWith(".base")) continue;
  const base = parseYaml(t);
  bases.set(p, base);
  const all = [...(base.filters?.and ?? []), ...base.views.flatMap((v) => v.filters?.and ?? [])];
  for (const c of all) if (!clause.test(c)) badClauses.push(`${p}: ${c}`);
}
check(`every Base parses and uses the closed clause grammar (${bases.size} Bases)`, badClauses.length === 0, badClauses);

// 6. Each standing view selects what its recipe selects over the same graph.
const recipe = async (file, params = {}) => {
  const body = readFileSync(join(here, "..", "..", "dist", "recipes", file), "utf8");
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  return new AsyncFunction("g", "graph", "report", "params", body)(first.reader, first.graph, first.report, params);
};
const select = (basePath, viewName) => {
  const base = bases.get(basePath);
  const view = base.views.find((v) => v.name === viewName);
  return [...frontmatters]
    .filter(([p, props]) => [...(base.filters?.and ?? []), ...(view.filters?.and ?? [])].every((c) => holds(c, props, p)))
    .map(([, props]) => props.aliases[0])
    .sort();
};
const sorted = (xs) => [...new Set(xs)].sort();
const r1 = await recipe("01-the-build-backlog.js");
const r33 = await recipe("33-the-design-backlog.js");
const r20 = await recipe("20-open-question-register.js");
const r31 = await recipe("31-decision-register.js");
const specsBase = `${OWNED}/specs.base`;
const expected = {
  "Build backlog": sorted(Object.values(r1.byFamily).flat().map((r) => r.id)),
  "Design backlog": sorted(r33.rows.map((r) => r.id)),
  "Nothing blocks the next rung": sorted(first.reader.specs().map((s) => first.reader.specContext(s.id)).filter((c) => c.statedNextRung !== undefined && c.statedNextRungFailures.length === 0).map((c) => c.id)),
  "Blocking questions": sorted(r20.specs.filter((s) => s.questions.some((q) => q.blocking)).map((s) => s.id)),
  "Decisions": sorted((r31.decisions ?? r31.rows ?? []).map((d) => d.id)),
};
for (const [name, want] of Object.entries(expected)) {
  const got = select(specsBase, name);
  check(`view "${name}" selects what its recipe selects (${want.length})`, JSON.stringify(got) === JSON.stringify(want), { got: got.length, want: want.length, extra: got.filter((x) => !want.includes(x)).slice(0, 3), missing: want.filter((x) => !got.includes(x)).slice(0, 3) });
}
for (const [p, base] of bases) {
  if (!p.startsWith(`${OWNED}/packs/`)) continue;
  const packId = `pack:${p.slice(`${OWNED}/packs/pack.`.length, -".base".length)}`;
  const members = sorted(first.reader.packContext(packId).members.filter((m) => m.resolved).map((m) => m.id));
  const got = select(p, "Members");
  check(`${packId} Base selects its members (${members.length})`, JSON.stringify(got) === JSON.stringify(members), { got: got.length });
}

// 7. The guard: a person's notes survive, and a regeneration refuses rather than touch one.
const vault = join(scratch, "vault");
const fresh = synchronize(vault, files);
check("a fresh vault is written", fresh.conflicts.length === 0 && fresh.written === files.size);
mkdirSync(join(vault, "intent"), { recursive: true });
mkdirSync(join(vault, ".obsidian"), { recursive: true });
writeFileSync(join(vault, "intent", "my-intent.md"), "A person's intent note.\n");
writeFileSync(join(vault, ".obsidian", "app.json"), "{}\n");
const anyNote = [...files.keys()].find((p) => p.startsWith(`${OWNED}/specs/`));
const before = statSync(join(vault, anyNote)).mtimeMs;
const again = synchronize(vault, files);
check("a regeneration of one graph writes nothing and keeps every note's modification time", again.written === 0 && again.removed === 0 && statSync(join(vault, anyNote)).mtimeMs === before);
const fewer = new Map([...files].filter(([p]) => p !== anyNote));
const shrink = synchronize(vault, fewer);
check("a note whose node left the graph is removed; a person's notes and settings survive", shrink.removed === 1 && !existsSync(join(vault, anyNote)) && readFileSync(join(vault, "intent", "my-intent.md"), "utf8") === "A person's intent note.\n" && existsSync(join(vault, ".obsidian", "app.json")));
synchronize(vault, files);
writeFileSync(join(vault, OWNED, "specs", "mine.md"), "A note a person wrote inside the generated folder.\n");
const unknown = synchronize(vault, fewer);
check("a note a person wrote in the generated folder refuses the run, which writes nothing", unknown.conflicts.length === 1 && unknown.conflicts[0].why === "unknown" && existsSync(join(vault, anyNote)) && existsSync(join(vault, OWNED, "specs", "mine.md")));
rmSync(join(vault, OWNED, "specs", "mine.md"));
writeFileSync(join(vault, anyNote), `${readFileSync(join(vault, anyNote), "utf8")}A person's edit.\n`);
const changed = synchronize(vault, files);
check("a generated note a person changed refuses the run and keeps the edit", changed.conflicts.length === 1 && changed.conflicts[0].why === "changed" && readFileSync(join(vault, anyNote), "utf8").endsWith("A person's edit.\n"));

// Report
const counts = {};
for (const p of files.keys()) { const k = p.split("/")[1].replace(/\.(md|base)$/u, ""); counts[k] = (counts[k] ?? 0) + 1; }
console.log(JSON.stringify({ root, files: files.size, byFolder: counts, checks: results }, null, 2));
process.exit(results.every((r) => r.ok) ? 0 : 1);

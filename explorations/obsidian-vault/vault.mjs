// Prototype: write an Obsidian vault from reader values dumped by dump.js. Throwaway, not product.
// usage: node vault.mjs corpus.json OUT_DIR COMMIT
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [, , corpusPath, out, commit] = process.argv;
const { specs, packs, edges, code } = JSON.parse(readFileSync(corpusPath, "utf8"));
const repo = "https://github.com/libar-dev/software-delivery-protocol";
const short = commit.slice(0, 7);

// Obsidian keeps its own state in .obsidian; regenerate everything else.
for (const path of ["Specs", "Code", "Concepts", "Packs", "SDP.base", "Start here.md"]) rmSync(join(out, path), { recursive: true, force: true });
const write = (path, text) => {
  mkdirSync(dirname(join(out, path)), { recursive: true });
  writeFileSync(join(out, path), text);
};

// Note names: Obsidian refuses ':' in names, so ids lose their namespace colon.
const specNote = (id) => id.replace(/^spec:/u, "");
const packNote = (id) => id.replace(/^pack:/u, "pack.");
const codeNote = (id) => id.replace(":", ".");
const safe = (text) => text.replace(/[\\/:*?"<>|#^[\]]/gu, "-");
const specIds = new Set(specs.map((s) => s.id));
const codeIds = new Set(code.map((c) => c.id));
const noteFor = (id) =>
  specIds.has(id) ? specNote(id) : id.startsWith("pack:") ? packNote(id) : codeIds.has(id) ? codeNote(id) : undefined;
const link = (id, label) => {
  const note = noteFor(id);
  if (note === undefined) return `\`${id}\``;
  return label === undefined || label === note ? `[[${note}]]` : `[[${note}|${label}]]`;
};
const blockId = (section, key) => `${section}-${key}`;

// Prose mentions are already checked by `conformance/prose-mentions`, so linking them cannot rot.
const mention = /spec:[a-z0-9][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)*(?:#(design|ui|question|rule)\.([A-Za-z0-9]+))?/gu;
const linkMention = (token) => {
  const match = /^(spec:[^#]+?)(?:#(design|ui|question|rule)\.([A-Za-z0-9]+))?$/u.exec(token);
  if (match === null || !specIds.has(match[1])) return undefined;
  const [, id, section, key] = match;
  return section === undefined
    ? `[[${specNote(id)}|${id}]]`
    : `[[${specNote(id)}#^${blockId(section, key)}|${token}]]`;
};
const prose = (text) =>
  String(text)
    .split(/(`[^`]*`)/u)
    .map((part) => {
      if (part.startsWith("`")) {
        const inner = part.slice(1, -1);
        return linkMention(inner) ?? part; // a code span holding exactly one mention becomes a link
      }
      return part.replace(mention, (token) => {
        const trimmed = token.replace(/[.,;:]+$/u, "");
        const linked = linkMention(trimmed);
        return linked === undefined ? token : linked + token.slice(trimmed.length);
      });
    })
    .join("");

const yaml = (value) => JSON.stringify(value);
const frontmatter = (props) =>
  `---\n${Object.entries(props)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map(yaml).join(", ")}]` : yaml(v)}`)
    .join("\n")}\n---\n`;
const banner = (file) =>
  `> [!info] Generated from the SDP graph at \`${short}\`\n> Read-only view. Edit [the carrier](${repo}/blob/${commit}/${file}), then regenerate.\n`;

const reasons = new Map(edges.filter((e) => e.reason).map((e) => [`${e.from}|${e.type}|${e.to}`, e.reason]));
const authored = new Set(["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"]);
const conceptDefs = new Map();

function renderValue(value, depth = 0) {
  const pad = "  ".repeat(depth);
  if (Array.isArray(value)) return value.map((v) => `${pad}- ${typeof v === "object" ? "\n" + renderValue(v, depth + 1) : prose(v)}`).join("\n");
  if (value !== null && typeof value === "object")
    return Object.entries(value)
      .map(([k, v]) =>
        typeof v === "object" && v !== null
          ? `${pad}- **${k}**\n${renderValue(v, depth + 1)}`
          : `${pad}- **${k}**: ${prose(v)}`,
      )
      .join("\n");
  return `${pad}${prose(value)}`;
}

function renderSections(spec) {
  const out = [];
  const sections = spec.sections ?? {};
  const rank = ["intent", "behavior", "design", "ui", "model", "decision", "constraints", "verification"];
  const named = Object.entries(sections).sort(([a], [b]) => rank.indexOf(a) - rank.indexOf(b));
  for (const [name, section] of named) {
    if (section === null || (typeof section === "object" && Object.keys(section).length === 0)) continue;
    out.push(`## ${name[0].toUpperCase()}${name.slice(1)}`);
    if (name === "intent") {
      for (const [k, v] of Object.entries(section)) {
        if (k === "openQuestions") continue;
        if (Array.isArray(v)) v.forEach((item) => out.push(`- **${k}:** ${prose(item)}`));
        else out.push(`- **${k}:** ${prose(v)}`);
      }
      if (Array.isArray(section.openQuestions) && section.openQuestions.length > 0) {
        out.push("", "### Open questions");
        for (const q of section.openQuestions) {
          const flag = q.blocking ? "**blocking**" : "non-blocking";
          const key = q.key ? ` \`#${q.key}\`` : "";
          out.push(`- ${flag}${key} ${prose(q.question)}${q.key ? ` ^${blockId("question", q.key)}` : ""}`);
          for (const field of ["decider", "links", "provisional", "trigger"]) {
            if (q[field] === undefined) continue;
            const value = Array.isArray(q[field]) ? q[field].map((t) => linkMention(t) ?? t).join(", ") : prose(q[field]);
            out.push(`  - ${field}: ${value}`);
          }
        }
      }
    } else if (name === "behavior") {
      const keyed = new Map(Object.entries(section.ruleKeys ?? {}).map(([key, at]) => [at, key]));
      for (const field of ["rules", "flows"]) {
        (section[field] ?? []).forEach((text, i) => {
          const key = keyed.get(`${field}[${i}]`);
          out.push(`- ${field === "flows" ? "flow: " : ""}${key ? `\`#${key}\` ` : ""}${prose(text)}${key ? ` ^${blockId("rule", key)}` : ""}`);
        });
      }
      for (const example of section.examples ?? []) {
        for (const step of ["given", "when", "then"])
          (example[step] ?? []).forEach((text, i) => out.push(`${i === 0 ? `**${step[0].toUpperCase()}${step.slice(1)}**` : "**And**"} ${prose(text)}  `));
        out.push("");
      }
      for (const [k, v] of Object.entries(section)) {
        if (["rules", "flows", "ruleKeys", "examples"].includes(k)) continue;
        out.push("", `**${k}**`, "", typeof v === "string" ? "```\n" + v + "\n```" : renderValue(v));
      }
    } else if (name === "design" || name === "ui") {
      for (const [k, v] of Object.entries(section)) {
        if (k === "description") out.push(prose(v), "");
        else out.push(`- **${k}**: ${prose(typeof v === "string" ? v : JSON.stringify(v))} ^${blockId(name, k)}`);
      }
    } else if (name === "model") {
      for (const [term, definition] of Object.entries(section.terms ?? {})) {
        const note = safe(term);
        out.push(`- [[${note}|${term}]] — ${prose(definition)}`);
        const defs = conceptDefs.get(note) ?? [];
        defs.push({ term, definition, spec: spec.id });
        conceptDefs.set(note, defs);
      }
    } else {
      out.push(renderValue(section));
    }
    out.push("");
  }
  return out.join("\n");
}

function relationsOf(id) {
  const outgoing = edges.filter((e) => e.from === id && authored.has(e.type) && e.claim === "declared");
  const incoming = edges.filter((e) => e.to === id && authored.has(e.type) && e.claim === "declared" && specIds.has(e.from));
  const line = (e, other) => {
    const reason = reasons.get(`${e.from}|${e.type}|${e.to}`);
    const ex = e.exercises ? ` (exercises ${e.exercises.map((k) => `[[${specNote(e.to)}#^rule-${k}|#${k}]]`).join(", ")})` : "";
    return `- ${e.type} ${link(other)}${ex}${reason ? ` — ${prose(reason)}` : ""}`;
  };
  const parts = [];
  if (outgoing.length) parts.push("### This Spec", ...outgoing.map((e) => line(e, e.to)), "");
  if (incoming.length) parts.push("### Toward this Spec", ...incoming.map((e) => `${line(e, e.from)}`), "");
  return parts.length ? `## Relations\n\n${parts.join("\n")}` : "";
}

function bindingsOf(spec) {
  const rows = [];
  for (const unit of spec.implementations ?? []) rows.push(`- realized by ${link(unit.codeId)} · \`${unit.file}:${unit.line}\``);
  for (const unit of spec.references ?? []) rows.push(`- referenced by ${link(unit.codeId)} · \`${unit.file}:${unit.line}\``);
  for (const v of spec.verifiers ?? [])
    rows.push(`- verified by ${link(v.verifierId)}${v.via === "test-anchor" ? "" : ` (${v.via})`}${v.file ? ` · \`${v.file}:${v.line}\`` : ""}`);
  return rows.length ? `## Bindings\n\n${rows.join("\n")}\n` : "## Bindings\n\nNo binding resolves to this Spec.\n";
}

// Specs
for (const spec of specs) {
  const family = specNote(spec.id).split(".")[0];
  const dc = spec.designColumns ?? {};
  const waiting = spec.stated !== "ready" && (spec.nextRungFailures ?? []).length === 0;
  const props = {
    sdp_id: spec.id,
    title: spec.title,
    aliases: [spec.id, spec.title],
    kind: spec.kind,
    altitude: spec.altitude,
    stated: spec.stated,
    floor: spec.floor,
    waiting_for_author: waiting,
    implemented: spec.facts.includes("implemented"),
    has_verifier: spec.facts.includes("has-verifier"),
    family,
    pack_ids: spec.packs,
    packs: spec.packs.map((p) => `[[${packNote(p)}]]`),
    design_entries: dc.entries ?? 0,
    declarations: dc.declarations ?? 0,
    open_questions: (spec.sections?.intent?.openQuestions ?? []).length,
    blocking_questions: dc.blockingQuestions ?? 0,
    source: `${repo}/blob/${commit}/${spec.file}`,
    tags: ["sdp/spec", `sdp/kind/${spec.kind}`, `sdp/stated/${spec.stated}`],
  };
  const facts = spec.facts.length ? spec.facts.join(", ") : "no delivery facts";
  const body = [
    frontmatter(props),
    banner(spec.file),
    `# ${spec.title}`,
    "",
    `\`${spec.id}\` · ${spec.kindLabel} · ${spec.altitude} · stated **${spec.stated}** · floor ${spec.floor}${waiting ? " · waiting for the author" : ""} · ${facts}`,
    "",
    spec.narrative ? prose(spec.narrative) + "\n" : "",
    renderSections(spec),
    relationsOf(spec.id),
    bindingsOf(spec),
    spec.packs.length ? `## Packs\n\n${spec.packs.map((p) => `- ${link(p)}`).join("\n")}\n` : "",
  ];
  write(`Specs/${family}/${specNote(spec.id)}.md`, body.join("\n"));
}

// Concepts: terms from Model sections only, linked from the Specs that define them.
for (const [note, defs] of conceptDefs) {
  write(
    `Concepts/${note}.md`,
    [
      frontmatter({ title: defs[0].term, defined_in: defs.map((d) => `[[${specNote(d.spec)}]]`), tags: ["sdp/concept"] }),
      `# ${defs[0].term}`,
      "",
      ...defs.map((d) => `> ${prose(d.definition)}\n>\n> Defined in ${link(d.spec)}\n`),
    ].join("\n"),
  );
}

// Code units and test anchors
for (const unit of code) {
  const ns = unit.id.split(":")[0];
  const rel = (type, dir) =>
    edges
      .filter((e) => e.type === type && (dir === "out" ? e.from === unit.id : e.to === unit.id))
      .map((e) => link(dir === "out" ? e.to : e.from));
  const sections = [
    ["Member of", rel("memberOf", "out")],
    ["Members", rel("memberOf", "in")],
    ["Uses", rel("uses", "out")],
    ["Used by", rel("uses", "in")],
    ["Satisfies", rel("satisfies", "out")],
    ["References", rel("references", "out")],
    ["Verifies", rel("verifies", "out")],
    ["Models", rel("models", "out")],
  ].filter(([, rows]) => rows.length);
  write(
    `Code/${ns}/${codeNote(unit.id)}.md`,
    [
      frontmatter({
        sdp_id: unit.id,
        namespace: ns,
        role: unit.role,
        layer: unit.layer,
        context: unit.context,
        file: `${unit.file}:${unit.line}`,
        tags: ["sdp/code", `sdp/code/${ns}`],
      }),
      banner(unit.file),
      `# ${unit.id}`,
      "",
      unit.label ? `${unit.label}\n` : "",
      `[\`${unit.file}:${unit.line}\`](${repo}/blob/${commit}/${unit.file}#L${unit.line})`,
      "",
      ...sections.map(([title, rows]) => `## ${title}\n\n${rows.map((r) => `- ${r}`).join("\n")}\n`),
    ].join("\n"),
  );
}

// Packs: a note in authored member order, and a Base for filtering and sorting.
const memberColumns = ["file.name", "title", "kind", "stated", "floor", "waiting_for_author", "design_entries", "declarations", "open_questions", "blocking_questions", "implemented", "has_verifier"];
const columnNames = `properties:
  note.title:
    displayName: Title
  note.waiting_for_author:
    displayName: Waiting for author
  note.design_entries:
    displayName: Design entries
  note.declarations:
    displayName: Declarations
  note.open_questions:
    displayName: Open questions
  note.blocking_questions:
    displayName: Blocking
  note.has_verifier:
    displayName: Verifier
  note.implemented:
    displayName: Implemented
`;
const order = (cols) => cols.map((c) => `      - ${c}`).join("\n");
for (const pack of packs) {
  const name = packNote(pack.id);
  write(
    `Packs/${name}.base`,
    `filters: 'pack_ids.contains("${pack.id}")'
${columnNames}views:
  - type: table
    name: Members
    order:
${order(memberColumns)}
  - type: table
    name: Needs the author
    filters:
      or:
        - 'waiting_for_author == true'
        - 'blocking_questions > 0'
    order:
${order(["file.name", "title", "stated", "floor", "waiting_for_author", "blocking_questions"])}
  - type: cards
    name: Cards
    order:
${order(["file.name", "title", "stated", "kind"])}
`,
  );
  const members = pack.members.map((m, i) => `${i + 1}. ${link(m.id)} ${m.title} · stated ${m.statedReadiness} · floor ${m.derivedReadiness}`);
  const boundary = Object.entries(pack.boundary)
    .filter(([, rows]) => rows.length)
    .map(([k, rows]) => `### ${k}\n\n${rows.map((r) => `- ${link(r.id ?? r.specId ?? r)}${r.title ? ` ${r.title}` : ""}`).join("\n")}\n`);
  write(
    `Packs/${name}.md`,
    [
      frontmatter({ sdp_id: pack.id, title: pack.title, tags: ["sdp/pack"] }),
      banner(pack.file),
      `# ${pack.title}`,
      "",
      pack.framing ? prose(pack.framing) + "\n" : "",
      "## Members, filterable",
      "",
      `![[${name}.base]]`,
      "",
      "## Members, in reading order",
      "",
      ...members,
      "",
      boundary.length ? `## Boundary\n\n${boundary.join("\n")}` : "",
    ].join("\n"),
  );
}

// The corpus Base: the standing queries as views over reader values.
write(
  "SDP.base",
  `filters: 'file.inFolder("Specs")'
${columnNames}views:
  - type: table
    name: All Specs
    groupBy:
      property: family
      direction: ASC
    order:
${order(["file.name", "title", "kind", "altitude", "stated", "floor", "implemented", "has_verifier"])}
  - type: table
    name: Build backlog
    filters:
      and:
        - 'stated == "ready"'
        - 'implemented == false'
        - 'kind != "example"'
        - 'kind != "decision"'
    order:
${order(["file.name", "title", "kind", "family"])}
  - type: table
    name: Design backlog
    filters:
      and:
        - 'stated == "defined"'
        - 'implemented == false'
        - 'kind != "example"'
    order:
${order(["file.name", "title", "design_entries", "declarations", "open_questions", "family"])}
  - type: table
    name: Waiting for the author
    filters: 'waiting_for_author == true'
    order:
${order(["file.name", "title", "stated", "floor", "kind"])}
  - type: table
    name: Blocking questions
    filters: 'blocking_questions > 0'
    order:
${order(["file.name", "title", "stated", "blocking_questions"])}
  - type: table
    name: Decisions
    filters: 'kind == "decision"'
    order:
${order(["file.name", "title", "stated", "floor"])}
`,
);

write(
  "Start here.md",
  [
    frontmatter({ tags: ["sdp/index"] }),
    `# SDP corpus, as an Obsidian vault`,
    "",
    `> [!warning] Prototype, generated at \`${short}\`\n> Every note is regenerated from the graph's reader values; nothing here is authored. Edit the carriers in the repository, then regenerate.`,
    "",
    "## Where to start",
    "",
    "- [[SDP.base|The corpus]]: every Spec, and the standing queries as views (build backlog, design backlog, waiting for the author, blocking questions, decisions).",
    ...packs.map((p) => `- ${link(p.id, p.title)}: ${p.members.length} members, in reading order and as a filterable table.`),
    "- Graph view: color groups by tag (`#sdp/stated/ready`, `#sdp/kind/decision`, `#sdp/code`).",
    "",
    "## What the links are",
    "",
    "- Relations (`refines`, `dependsOn` and the rest) become links under each Spec's Relations heading, with the reason the relation states.",
    "- Spec ids and entry addresses in prose become links. They are checked mentions, so a broken one fails `sdp validate` before it reaches this vault.",
    "- An entry address opens its block: `#design.<key>`, `#ui.<key>`, `#question.<key>`, `#rule.<key>`.",
    "- Concepts are the terms Model sections define, linked from the Specs that define them. Nothing links a term by matching words.",
    "",
    `Counts at \`${short}\`: ${specs.length} Specs, ${packs.length} Packs, ${code.length} code units and test anchors, ${conceptDefs.size} concepts.`,
    "",
  ].join("\n"),
);
console.log(`vault: ${specs.length} specs, ${packs.length} packs, ${code.length} code, ${conceptDefs.size} concepts -> ${out}`);

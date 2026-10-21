import type { GraphNode, GraphSchema } from "../../graph/schema.js";
import { createReader } from "../../reader/reader.js";
import type { Reader, RelationEnd, SpecContext } from "../../reader/reader.js";
import type { Finding } from "../../validate/contracts.js";
import { renderBase } from "./bases.js";
import { renderSections } from "./sections.js";
import { compare } from "./sync.js";
import type { VaultFile } from "./sync.js";
import { banner, code, createText, notePath, properties, termPath } from "./text.js";

export class VaultCaseCollisionError extends Error {
  constructor(readonly pairs: readonly (readonly [string, string])[]) {
    super("vault note names collide");
  }
}
export function findingLine(f: Finding, text: (v: string) => string): string {
  return `- ${f.severity} · ${f.validatorId}${f.file === undefined ? "" : ` · ${code(f.file + (f.line === undefined ? "" : `:${String(f.line)}`))}`} · ${text(f.message)}`;
}
export function assertVaultNoteNames(graph: GraphSchema): void {
  const names = new Map<string, string[]>();
  for (const node of graph.nodes) {
    const entries: [string, string][] = [[notePath(node.id), node.id]];
    if (node.nodeType === "Primitive")
      for (const key of Object.keys(node.sections?.model?.termKeys ?? {}))
        entries.push([termPath(node.id, key), `${node.id}#term.${key}`]);
    for (const [path, id] of entries) {
      const ids = names.get(path.toLowerCase()) ?? [];
      ids.push(id);
      names.set(path.toLowerCase(), ids);
    }
  }
  const pairs: [string, string][] = [];
  for (const ids of names.values()) {
    ids.sort(compare);
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++) {
        const first = ids[i],
          second = ids[j];
        if (first !== undefined && second !== undefined) pairs.push([first, second]);
      }
  }
  if (pairs.length)
    throw new VaultCaseCollisionError(
      pairs.sort(([a, b], [c, d]) => compare(a, c) || compare(b, d)),
    );
}
/**
 * @sdpAnchor impl:protocol.vault-notes
 * @sdpLabel renders reader contexts, declared relations and keyed terms as linked notes
 * @sdpSatisfies spec:consumers.obsidian-vault.notes, spec:consumers.obsidian-vault
 * @sdpComponent component:protocol.projections
 * @sdpUses impl:protocol.reader
 * @sdpRole projection
 */
export function renderVault(
  graph: GraphSchema,
  findings?: readonly Finding[],
): readonly VaultFile[] {
  assertVaultNoteNames(graph);
  const reader = createReader(graph);
  const report = findings ?? reader.findings();
  const { text, link } = createText(reader);
  const files: VaultFile[] = [];
  const paths = new Map<string, string>();
  const pairs: [string, string][] = [];
  const add = (path: string, id: string, content: string): void => {
    const previous = paths.get(path.toLowerCase());
    if (previous !== undefined && previous !== id)
      pairs.push([previous, id].sort(compare) as [string, string]);
    paths.set(path.toLowerCase(), id);
    files.push({ path: path.slice(4), content: content.trimEnd() + "\n" });
  };
  const forSubject = (id: string) => report.filter((f) => f.subjectId === id);
  for (const node of [...graph.nodes].sort((a, b) => compare(a.id, b.id))) {
    let content: string;
    if (node.nodeType === "Primitive") {
      const context = reader.specContext(node.id);
      if (context === undefined) continue;
      content = specNote(context, reader, forSubject(node.id));
      for (const [key, term] of Object.entries(node.sections?.model?.termKeys ?? {})) {
        add(
          termPath(node.id, key),
          `${node.id}#term.${key}`,
          properties({ aliases: [term, `${node.id}#term.${key}`], definedIn: link(node.id) }) +
            `\n${banner("carrier", node.file)}\n\n# ${text(term)}\n\n${text(node.sections?.model?.terms?.[term] ?? "")}\n\nDefined in [[${notePath(node.id)}#^term-${key}|${node.id}#term.${key}]].\n`,
        );
      }
    } else if (node.nodeType === "Pack") {
      const context = reader.packContext(node.id);
      if (context === undefined) continue;
      const lines = [
        properties({
          aliases: [node.id, ...(node.title === undefined ? [] : [node.title])],
          title: node.title,
          manifest: node.file,
        }),
        banner("Pack manifest", node.file),
        "",
        `# ${text(node.title ?? node.id)}`,
        "",
        text(node.framing ?? ""),
        "",
        "## Members, filterable",
        "",
        `![[${notePath(node.id).slice(0, -3)}.base]]`,
        "",
        "## Members, in reading order",
        "",
      ];
      context.members.forEach((m, i) =>
        lines.push(
          `${String(i + 1)}. ${link(m.id)} · stated ${m.statedReadiness ?? "none"} · floor ${m.derivedReadiness ?? "none"}${m.statedNextRung === undefined ? "" : ` · ${m.statedNextRung}: ${m.statedNextRungFailures?.length ? m.statedNextRungFailures.map((f) => f.clauseId).join(", ") : "nothing blocks"}`}`,
        ),
      );
      lines.push("", "## Boundary");
      for (const name of ["restsOn", "restedOnBy", "verifiedBy", "supersededBy"] as const) {
        lines.push(
          "",
          `### ${name}`,
          "",
          ...(context.boundary[name].length === 0
            ? ["none"]
            : context.boundary[name].map(
                (row) =>
                  `- ${link(row.id)} · ${row.via.map((v) => `${v.type}: ${v.members.map(link).join(", ")}`).join("; ")}`,
              )),
        );
      }
      if (forSubject(node.id).length)
        lines.push("", "## Findings", "", ...forSubject(node.id).map((f) => findingLine(f, text)));
      content = lines.join("\n");
      files.push(renderBase(node.id));
    } else content = codeNote(node, graph, reader);
    add(notePath(node.id), node.id, content);
  }
  if (pairs.length) throw new VaultCaseCollisionError(pairs);
  const noted = new Set(
    graph.nodes.filter((n) => n.nodeType === "Primitive" || n.nodeType === "Pack").map((n) => n.id),
  );
  const withoutNote = report.filter((f) => f.subjectId === undefined || !noted.has(f.subjectId));
  const index = [
    "> [!info] Generated by `sdp vault` from the graph. Every file under `sdp/` is regenerated: write your own notes outside it, and intent notes in `intent/`.",
    "",
    "# Spec graph",
    "",
    `${String(report.filter((f) => f.severity === "error").length)} errors · ${String(report.filter((f) => f.severity === "warning").length)} warnings`,
    "",
    "## Findings without a note",
    "",
    ...withoutNote.map((f) => findingLine(f, text)),
    "",
    "![[sdp/specs.base]]",
    "",
    ...reader.packs().map((p) => `- ${link(p.id)}`),
  ];
  files.push({ path: "index.md", content: index.join("\n") + "\n" }, renderBase());
  return files.sort((a, b) => compare(a.path, b.path));
}
function specNote(c: SpecContext, reader: Reader, findings: readonly Finding[]): string {
  const { text, link } = createText(reader);
  const d = c.designColumns;
  const lines = [
    properties({
      aliases: [c.id, ...(c.title === undefined ? [] : [c.title])],
      title: c.title,
      specKind: c.specKind,
      altitude: c.altitude,
      statedReadiness: c.statedReadiness,
      derivedReadiness: c.derivedReadiness ?? "none",
      statedNextRung: c.statedNextRung,
      statedNextRungFailures: c.statedNextRungFailures.map((f) => f.clauseId),
      implementationBinding: c.deliveryFacts.includes("implemented"),
      verifierBinding: c.deliveryFacts.includes("has-verifier"),
      designEntries: d.entries,
      declarations: d.declarations,
      openQuestions: d.openQuestions.length,
      blockingQuestions: d.blockingQuestions,
      decisions: d.decisions.filter((v) => v.resolved).map((v) => link(v.id)),
      packs: c.packs.map(link),
      carrier: c.file,
    }),
    banner("carrier", c.file),
    "",
    `# ${text(c.title ?? c.id)}`,
    "",
    `${code(c.id)} · ${c.kindDisplayLabel ?? c.specKind} · ${c.altitude} · stated ${c.statedReadiness} · floor ${c.derivedReadiness ?? "none"}${c.statedNextRung === undefined ? "" : ` · ${c.statedNextRung}: ${c.statedNextRungFailures.map((f) => f.clauseId).join(", ") || "nothing blocks"}`}`,
    "",
    text(c.narrative ?? ""),
    ...renderSections(c, text),
  ];
  const relation = (r: RelationEnd, verifiedId: string) =>
    `- ${r.type}: ${link(r.otherId)}${r.reason === undefined ? "" : ` · ${text(r.reason)}`}${r.exercises === undefined ? "" : ` · exercises ${r.exercises.map((key) => (reader.resolveEntryAddress(`${verifiedId}#rule.${key}`).resolves ? link(`${verifiedId}#rule.${key}`) : code(key))).join(", ")}`}`;
  if (c.relationsOut.length || c.relationsIn.length) {
    lines.push("", "## Relations");
    for (const [name, rows] of [
      ["From this Spec", c.relationsOut],
      ["Toward this Spec", c.relationsIn],
    ] as const)
      if (rows.length)
        lines.push(
          "",
          `### ${name}`,
          "",
          ...rows.map((r) => relation(r, name === "From this Spec" ? r.otherId : c.id)),
        );
  }
  lines.push(
    "",
    "## Bindings",
    "",
    `- Implementation binding: ${c.deliveryFacts.includes("implemented") ? "present" : "none"}`,
    ...c.implementations.map((v) => `  - ${link(v.codeId)}`),
    ...c.references.map((v) => `- References: ${link(v.codeId)}`),
    `- Verifier binding: ${c.deliveryFacts.includes("has-verifier") ? "present" : "none"}`,
    ...c.verifiers.map((v) => `  - ${link(v.verifierId)} · ${v.enabled ? "enabled" : "declared"}`),
    `- Expected-outcome oracle: ${c.oracle === undefined ? "none" : "present"}`,
    ...(c.oracle === undefined ? [] : [`  - ${link(c.oracle.anchorId)}`]),
    "- Runtime observation: not tracked",
  );
  if (c.packs.length) lines.push("", "## Packs", "", ...c.packs.map((p) => `- ${link(p)}`));
  if (findings.length)
    lines.push("", "## Findings", "", ...findings.map((f) => findingLine(f, text)));
  return lines.join("\n");
}
function codeNote(
  node: Extract<GraphNode, { nodeType: "CodeNode" | "Anchor" }>,
  graph: GraphSchema,
  reader: Reader,
): string {
  const { text, link } = createText(reader);
  const component = graph.edges.find((e) => e.from === node.id && e.type === "memberOf")?.to;
  const lines = [
    properties({
      aliases: [node.id],
      label: node.label,
      ...(node.nodeType === "CodeNode"
        ? { role: node.role, layer: node.layer, context: node.context }
        : {}),
      component: component === undefined ? undefined : link(component),
      sourceFile: node.file,
      sourceLine: node.line,
    }),
    banner("source file", node.file),
    "",
    `# ${code(node.id)}`,
    "",
    text(node.label ?? ""),
    "",
    code(`${node.file}${node.line === undefined ? "" : `:${String(node.line)}`}`),
  ];
  for (const [heading, type, incoming] of [
    ["Member of", "memberOf", false],
    ["Members", "memberOf", true],
    ["Uses", "uses", false],
    ["Used by", "uses", true],
    ["Satisfies", "satisfies", false],
    ["References", "references", false],
    ["Verifies", "verifies", false],
    ["Models", "models", false],
  ] as const) {
    const rows = graph.edges.filter(
      (e) => e.type === type && (incoming ? e.to : e.from) === node.id,
    );
    if (rows.length)
      lines.push(
        "",
        `## ${heading}`,
        "",
        ...rows.map((e) => `- ${link(incoming ? e.from : e.to)}`),
      );
  }
  return lines.join("\n");
}

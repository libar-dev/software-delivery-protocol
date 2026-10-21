import { isResolvingTestAnchorVerify } from "../graph/delivery-facts.js";
import type { GraphSchema, PrimitiveNode } from "../graph/schema.js";
import { ENTRY_ADDRESS_SECTIONS, parseId } from "../ids.js";
import type { GraphIndex } from "../validate/graph-index.js";

export interface EntryCitation {
  readonly address: string;
  readonly entry: string | null;
  readonly resolves: boolean;
  readonly reason: "malformed" | "section" | "entry" | null;
  readonly file: string;
  readonly line: number;
  readonly anchors: readonly string[];
  readonly testAnchors: readonly string[];
  readonly claim: "inferred";
}

const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
const record = (value: unknown): Readonly<Record<string, unknown>> | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : undefined;

function resolveCitation(
  target: PrimitiveNode,
  address: string,
): Pick<EntryCitation, "entry" | "resolves" | "reason"> {
  const miss = (reason: "malformed" | "section" | "entry") => ({
    entry: null,
    resolves: false,
    reason,
  });
  let subpath: string | undefined;
  try {
    subpath = parseId(address).subpath;
  } catch {
    return miss("malformed");
  }
  if (subpath === undefined) return miss("malformed");
  const section = subpath.slice(0, subpath.indexOf("."));
  if (!ENTRY_ADDRESS_SECTIONS.some((value) => value === section)) return miss("malformed");
  const key = subpath.slice(section.length + 1);
  const sections = target.sections;
  if (section === "question") {
    const questions = sections?.intent?.openQuestions;
    if (!Array.isArray(questions)) return miss("section");
    const position = questions.findIndex((question) => record(question)?.key === key);
    return position < 0
      ? miss("entry")
      : { entry: `question[${String(position)}]`, resolves: true, reason: null };
  }
  if (section === "rule") {
    const keys = sections?.behavior?.ruleKeys;
    if (keys === undefined) return miss("section");
    const path = Object.hasOwn(keys, key) ? keys[key] : undefined;
    const match = typeof path === "string" ? /^(rules|flows)\[(\d+)\]$/u.exec(path) : null;
    const list = match?.[1];
    const position = match?.[2];
    return list === undefined || position === undefined
      ? miss("entry")
      : {
          entry: `${list === "rules" ? "rule" : "flow"}[${position}]`,
          resolves: true,
          reason: null,
        };
  }
  const content = record(sections)?.[section];
  if (section === "design" || section === "ui") {
    const entries = record(content);
    if (entries === undefined) return miss("section");
    return key === "description" || !Object.hasOwn(entries, key)
      ? miss("entry")
      : { entry: `${section}.${key}`, resolves: true, reason: null };
  }
  // A Model term resolves through its authored name, even without a location row.
  const model = record(sections?.model);
  const keys = record(model?.termKeys);
  if (keys === undefined) return miss("section");
  const term = Object.hasOwn(keys, key) ? keys[key] : undefined;
  const terms = record(model?.terms);
  const position =
    typeof term === "string" && terms !== undefined ? Object.keys(terms).indexOf(term) : -1;
  return position < 0
    ? miss("entry")
    : { entry: `${section}[${String(position)}]`, resolves: true, reason: null };
}

/**
 * @sdpAnchor impl:protocol.entry-citation-reader
 * @sdpLabel resolves citations and joins file anchors with direct and example-based test verification
 * @sdpSatisfies spec:extraction.entry-citations
 * @sdpComponent component:protocol.reader
 * @sdpRole reader
 */
export function entryCitationsBySpec(
  graph: GraphSchema,
  index: GraphIndex,
): ReadonlyMap<string, readonly EntryCitation[]> {
  const anchorsByFile = new Map<string, string[]>();
  for (const node of index.nodesById.values()) {
    if (node.nodeType !== "Anchor" && node.nodeType !== "CodeNode") continue;
    const ids = anchorsByFile.get(node.file) ?? [];
    ids.push(node.id);
    anchorsByFile.set(node.file, ids);
  }
  for (const ids of anchorsByFile.values()) ids.sort(compare);
  const testsBySpec = new Map<string, Set<string>>();
  const add = (target: string, test: string) => {
    const ids = testsBySpec.get(target) ?? new Set<string>();
    ids.add(test);
    testsBySpec.set(target, ids);
  };
  for (const edge of graph.edges) {
    if (!isResolvingTestAnchorVerify(edge, index.nodesById)) continue;
    add(edge.to, edge.from);
    if (index.primitivesById.get(edge.to)?.specKind !== "example") continue;
    for (const verified of index.edgesByFrom.get(edge.to) ?? []) {
      if (
        verified.type === "verifies" &&
        verified.claim === "declared" &&
        index.primitivesById.has(verified.to)
      )
        add(verified.to, edge.from);
    }
  }
  const result = new Map<string, EntryCitation[]>();
  for (const row of graph.citations ?? []) {
    const id = row.address.split("#")[0] ?? "";
    const target = index.primitivesById.get(id);
    if (target === undefined) continue;
    const anchors = anchorsByFile.get(row.file) ?? [];
    const rows = result.get(id) ?? [];
    rows.push({
      ...row,
      ...resolveCitation(target, row.address),
      anchors,
      testAnchors: anchors.filter((anchor) => testsBySpec.get(id)?.has(anchor)),
      claim: "inferred",
    });
    result.set(id, rows);
  }
  for (const rows of result.values())
    rows.sort(
      (a, b) => compare(a.address, b.address) || compare(a.file, b.file) || a.line - b.line,
    );
  return result;
}

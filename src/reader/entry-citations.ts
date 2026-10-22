import { isResolvingTestAnchorVerify } from "../graph/delivery-facts.js";
import type { GraphSchema } from "../graph/schema.js";
import { resolveEntryAddress } from "../graph/entry-address.js";
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
      ...resolveEntryAddress(target, row.address),
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

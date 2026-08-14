import { codeAnchorId, ref } from "../ids.js";
import type { GraphEdge, GraphNode, GraphSchema } from "../graph/schema.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Reader } from "../reader/reader.js";

export const MAX_MERMAID_NODES_PER_DIAGRAM = 64;
export const MAX_MERMAID_EDGES_PER_DIAGRAM = 128;

export interface MermaidPage {
  /** POSIX path under the projection root (`generated/mermaid/`). */
  readonly path: string;
  readonly content: string;
}

const mermaidViewAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.mermaid-view"),
  label: "renders bounded Spec one-hop and Pack membership diagrams",
  satisfies: ref("spec:consumers.mermaid-view"),
});
void mermaidViewAnchor;

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** Escapes visible text for a Mermaid quoted label, independently of Markdown escaping. */
export function escapeMermaidLabel(value: string): string {
  const replacements: Readonly<Record<string, string>> = {
    '"': "&quot;",
    "'": "&#39;",
    "[": "&#91;",
    "]": "&#93;",
    "{": "&#123;",
    "}": "&#125;",
    "(": "&#40;",
    ")": "&#41;",
    "`": "&#96;",
    "|": "&#124;",
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\\": "&#92;",
    "\r": "&#13;",
    "\n": "&#10;",
  };
  let escaped = "";
  for (const character of value) {
    escaped += replacements[character] ?? character;
  }
  return escaped;
}

/** Injective Mermaid-safe encoding of the complete ID, including UTF-16 code units. */
export function machineToken(id: string): string {
  let token = "n_";
  for (let index = 0; index < id.length; index += 1) {
    token += id.charCodeAt(index).toString(16).padStart(4, "0");
  }
  return token;
}

/** Alias retained for callers that describe the helper as a Mermaid token encoder. */
export const mermaidToken = machineToken;

function edgeKey(edge: GraphEdge): string {
  return [edge.from, edge.type, edge.to, edge.claim].join("\0");
}

function labelOf(node: GraphNode): string {
  const visible =
    node.nodeType === "Primitive" || node.nodeType === "Pack" ? node.title : node.label;
  return [visible ?? node.id, node.id, node.nodeType].join("\n");
}

function pagePathOf(node: GraphNode): string {
  const separator = node.id.indexOf(":");
  const expectedNamespace = node.nodeType === "Primitive" ? "spec" : "pack";
  const namespace = separator === -1 ? "" : node.id.slice(0, separator);
  const body = separator === -1 ? "" : node.id.slice(separator + 1);
  if (namespace === expectedNamespace && /^[A-Za-z0-9][A-Za-z0-9.#-]*$/u.test(body)) {
    return `${expectedNamespace}/${body}.md`;
  }
  return `${expectedNamespace}/${machineToken(node.id)}.md`;
}

function assertMachineTokens(nodes: readonly GraphNode[]): void {
  const idsByToken = new Map<string, string>();
  for (const node of [...nodes].sort((left, right) => compareCodeUnits(left.id, right.id))) {
    const token = machineToken(node.id);
    const previous = idsByToken.get(token);
    if (previous !== undefined) {
      throw new Error(
        `MERMAID_MACHINE_TOKEN_COLLISION token=${token} first=${JSON.stringify(previous)} second=${JSON.stringify(node.id)}`,
      );
    }
    idsByToken.set(token, node.id);
  }
}

function assertBound(diagramId: string, bound: string, limit: number, observed: number): void {
  if (observed > limit) {
    throw new Error(
      `Mermaid diagram ${JSON.stringify(diagramId)} exceeds ${bound}: limit=${String(limit)} observed=${String(observed)}`,
    );
  }
}

interface DiagramSlice {
  readonly root: GraphNode;
  readonly nodes: readonly { readonly id: string; readonly node: GraphNode | undefined }[];
  readonly edges: readonly GraphEdge[];
}

function sliceFor(
  root: GraphNode,
  graphNodes: readonly GraphNode[],
  graphEdges: readonly GraphEdge[],
): DiagramSlice {
  const nodesById = new Map(graphNodes.map((node) => [node.id, node]));
  const edges = graphEdges
    .filter((edge) =>
      root.nodeType === "Pack"
        ? edge.type === "belongsTo" && edge.to === root.id
        : edge.from === root.id || edge.to === root.id,
    )
    .sort((left, right) => compareCodeUnits(edgeKey(left), edgeKey(right)));
  const ids = new Set<string>([root.id]);
  for (const edge of edges) {
    ids.add(edge.from);
    ids.add(edge.to);
  }
  const nodes = [...ids].sort(compareCodeUnits).map((id) => ({ id, node: nodesById.get(id) }));
  assertBound(
    root.id,
    "MAX_MERMAID_NODES_PER_DIAGRAM",
    MAX_MERMAID_NODES_PER_DIAGRAM,
    nodes.length,
  );
  assertBound(
    root.id,
    "MAX_MERMAID_EDGES_PER_DIAGRAM",
    MAX_MERMAID_EDGES_PER_DIAGRAM,
    edges.length,
  );
  assertMachineTokens(
    nodes.map((entry) => ({ id: entry.id, nodeType: "Anchor", claim: "anchored" }) as GraphNode),
  );
  return { root, nodes, edges };
}

function renderDiagram(slice: DiagramSlice): string {
  const lines = ["flowchart LR"];
  for (const entry of slice.nodes) {
    const label = entry.node === undefined ? `${entry.id}\nunresolved` : labelOf(entry.node);
    lines.push(`  ${machineToken(entry.id)}["${escapeMermaidLabel(label)}"]`);
  }
  for (const edge of slice.edges) {
    const label = escapeMermaidLabel(`${edge.type} [${edge.claim}]`);
    lines.push(`  ${machineToken(edge.from)} -->|"${label}"| ${machineToken(edge.to)}`);
  }
  return lines.join("\n");
}

function renderPage(slice: DiagramSlice): MermaidPage {
  const kind = slice.root.nodeType === "Pack" ? "Pack membership" : "Spec one-hop";
  return {
    path: pagePathOf(slice.root),
    content: [
      `# ${kind}: ${slice.root.id}`,
      "",
      "```mermaid",
      renderDiagram(slice),
      "```",
      "",
      "_Generated from the one graph by `sdp mermaid` — read-only; regenerate to update._",
      "",
    ].join("\n"),
  };
}

function renderIndex(specs: readonly GraphNode[], packs: readonly GraphNode[]): MermaidPage {
  const lines = ["# Mermaid diagrams", "", "## Specs", ""];
  lines.push(
    ...(specs.length === 0
      ? ["No Specs."]
      : specs.map((node) => `- [\`${node.id}\`](${pagePathOf(node)})`)),
    "",
    "## Packs",
    "",
    ...(packs.length === 0
      ? ["No Packs."]
      : packs.map((node) => `- [\`${node.id}\`](${pagePathOf(node)})`)),
    "",
    "_Generated from the one graph by `sdp mermaid` — read-only; regenerate to update._",
    "",
  );
  return { path: "index.md", content: lines.join("\n") };
}

/** Pure, bounded Mermaid projection over the Reader's graph. */
export function renderMermaid(reader: Reader): ReadonlyMap<string, string> {
  const graph: GraphSchema = reader.graph;
  assertMachineTokens(graph.nodes);
  const specs = graph.nodes
    .filter((node) => node.nodeType === "Primitive")
    .sort((left, right) => compareCodeUnits(left.id, right.id));
  const packs = graph.nodes
    .filter((node) => node.nodeType === "Pack")
    .sort((left, right) => compareCodeUnits(left.id, right.id));
  const rendered = [
    renderIndex(specs, packs),
    ...specs.map((node) => renderPage(sliceFor(node, graph.nodes, graph.edges))),
    ...packs.map((node) => renderPage(sliceFor(node, graph.nodes, graph.edges))),
  ].sort((left, right) => compareCodeUnits(left.path, right.path));
  return new Map(rendered.map((page) => [page.path, page.content]));
}

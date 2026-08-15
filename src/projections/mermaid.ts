import { codeAnchorId, ref } from "../ids.js";
import type { GraphEdge, GraphNode, GraphSchema } from "../graph/schema.js";
import { codeAnchor } from "../model/code-anchor.js";
import type { Reader } from "../reader/reader.js";
import { renderDiagnosticBanner } from "./diagnostic-banner.js";

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

function collisionRefusal(token: string, first: string, second: string): string {
  return `MERMAID_MACHINE_TOKEN_COLLISION token=${token} first=${JSON.stringify(first)} second=${JSON.stringify(second)}`;
}

function boundRefusal(diagramId: string, bound: string, limit: number, observed: number): string {
  return `Mermaid diagram ${JSON.stringify(diagramId)} exceeds ${bound}: limit=${String(limit)} observed=${String(observed)}`;
}

function findMachineTokenCollisions(ids: readonly string[]): {
  readonly refusal: string | undefined;
  readonly ids: ReadonlySet<string>;
} {
  const idsByToken = new Map<string, string>();
  const colliding = new Set<string>();
  let refusal: string | undefined;
  for (const id of [...ids].sort(compareCodeUnits)) {
    const token = machineToken(id);
    const previous = idsByToken.get(token);
    if (previous !== undefined) {
      colliding.add(previous);
      colliding.add(id);
      refusal ??= collisionRefusal(token, previous, id);
    } else {
      idsByToken.set(token, id);
    }
  }
  return { refusal, ids: colliding };
}

function uniqueById(nodes: readonly GraphNode[]): readonly GraphNode[] {
  const seen = new Set<string>();
  const unique: GraphNode[] = [];
  for (const node of nodes) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
      unique.push(node);
    }
  }
  return unique;
}

interface DiagramSlice {
  readonly root: GraphNode;
  readonly nodes: readonly { readonly id: string; readonly node: GraphNode | undefined }[];
  readonly edges: readonly GraphEdge[];
  readonly refusal: string | undefined;
}

function sliceFor(
  root: GraphNode,
  graphNodes: readonly GraphNode[],
  graphEdges: readonly GraphEdge[],
  graphCollisions: { readonly refusal: string | undefined; readonly ids: ReadonlySet<string> },
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
  const sliceCollision = findMachineTokenCollisions(nodes.map((entry) => entry.id)).refusal;
  const collision = graphCollisions.ids.has(root.id) ? graphCollisions.refusal : sliceCollision;
  const refusal =
    collision ??
    (nodes.length > MAX_MERMAID_NODES_PER_DIAGRAM
      ? boundRefusal(
          root.id,
          "MAX_MERMAID_NODES_PER_DIAGRAM",
          MAX_MERMAID_NODES_PER_DIAGRAM,
          nodes.length,
        )
      : edges.length > MAX_MERMAID_EDGES_PER_DIAGRAM
        ? boundRefusal(
            root.id,
            "MAX_MERMAID_EDGES_PER_DIAGRAM",
            MAX_MERMAID_EDGES_PER_DIAGRAM,
            edges.length,
          )
        : undefined);
  return { root, nodes, edges, refusal };
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
  const body =
    slice.refusal === undefined
      ? ["```mermaid", renderDiagram(slice), "```"]
      : [
          "**REFUSED**",
          "",
          slice.refusal,
          "",
          "The diagram is withheld. In-bound diagrams still publish. The projection never silently truncates, shards partially, or drops edges to fit.",
        ];
  return {
    path: pagePathOf(slice.root),
    content: [
      `# ${kind}: ${slice.root.id}`,
      "",
      ...body,
      "",
      "_Generated from the one graph by `sdp mermaid` — read-only; regenerate to update._",
      "",
    ].join("\n"),
  };
}

function indexRow(node: GraphNode, refusal: string | undefined): string {
  const link = `- [\`${node.id}\`](${pagePathOf(node)})`;
  return refusal === undefined ? link : `${link} — REFUSED ${refusal}`;
}

function renderIndex(
  specs: readonly { readonly node: GraphNode; readonly refusal: string | undefined }[],
  packs: readonly { readonly node: GraphNode; readonly refusal: string | undefined }[],
  reader: Reader,
): MermaidPage {
  const lines = [
    "# Mermaid diagrams",
    "",
    ...renderDiagnosticBanner(reader.findings()),
    "## Specs",
    "",
  ];
  lines.push(
    ...(specs.length === 0
      ? ["No Specs."]
      : specs.map((entry) => indexRow(entry.node, entry.refusal))),
    "",
    "## Packs",
    "",
    ...(packs.length === 0
      ? ["No Packs."]
      : packs.map((entry) => indexRow(entry.node, entry.refusal))),
    "",
    "_Generated from the one graph by `sdp mermaid` — read-only; regenerate to update._",
    "",
  );
  return { path: "index.md", content: lines.join("\n") };
}

/** Pure, bounded Mermaid projection over the Reader's graph. */
export function renderMermaid(reader: Reader): ReadonlyMap<string, string> {
  const graph: GraphSchema = reader.graph;
  const graphCollisions = findMachineTokenCollisions(graph.nodes.map((node) => node.id));
  const specs = uniqueById(
    graph.nodes
      .filter((node) => node.nodeType === "Primitive")
      .sort((left, right) => compareCodeUnits(left.id, right.id)),
  );
  const packs = uniqueById(
    graph.nodes
      .filter((node) => node.nodeType === "Pack")
      .sort((left, right) => compareCodeUnits(left.id, right.id)),
  );
  const specSlices = specs.map((node) => sliceFor(node, graph.nodes, graph.edges, graphCollisions));
  const packSlices = packs.map((node) => sliceFor(node, graph.nodes, graph.edges, graphCollisions));
  const rendered = [
    renderIndex(
      specSlices.map((slice) => ({ node: slice.root, refusal: slice.refusal })),
      packSlices.map((slice) => ({ node: slice.root, refusal: slice.refusal })),
      reader,
    ),
    ...specSlices.map(renderPage),
    ...packSlices.map(renderPage),
  ].sort((left, right) => compareCodeUnits(left.path, right.path));
  return new Map(rendered.map((page) => [page.path, page.content]));
}

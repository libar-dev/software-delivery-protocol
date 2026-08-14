import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { describe, expect, it } from "vitest";

import { extract } from "../src/extract/index.js";
import type { GraphEdge, GraphNode, GraphSchema } from "../src/graph/schema.js";
import { schemaVersion } from "../src/graph/schema.js";
import {
  escapeMermaidLabel,
  machineToken,
  MAX_MERMAID_EDGES_PER_DIAGRAM,
  MAX_MERMAID_NODES_PER_DIAGRAM,
  renderMermaid,
} from "../src/projections/mermaid.js";
import { createReader } from "../src/reader/reader.js";

const mermaidTestAnchor = specTest({
  id: testAnchorId("test:protocol.mermaid-view"),
  label: "verifies bounded deterministic Mermaid projection and publication",
  verifies: ref("spec:consumers.mermaid-view"),
});
void mermaidTestAnchor;

const checkoutRoot = fileURLToPath(new URL("../examples/checkout-v1", import.meta.url));
const goldenRoot = fileURLToPath(
  new URL("./fixtures/checkout-v1/expected-mermaid", import.meta.url),
);

function graph(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): GraphSchema {
  return { schemaVersion, nodes, edges };
}

function primitive(id: string, title = id): GraphNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "feature",
    readiness: "defined",
    title,
    file: `${id}.sdp.md`,
  };
}

function pack(id: string, title = id): GraphNode {
  return { id, nodeType: "Pack", claim: "declared", title, file: `${id}.pack.sdp.md` };
}

function rendered(input: GraphSchema): ReadonlyMap<string, string> {
  return renderMermaid(createReader(input));
}

function goldenPages(): ReadonlyMap<string, string> {
  const pages = new Map<string, string>();
  for (const entry of readdirSync(goldenRoot, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) {
      const absolute = join(entry.parentPath, entry.name);
      pages.set(
        relative(goldenRoot, absolute).replaceAll("\\", "/"),
        readFileSync(absolute, "utf8"),
      );
    }
  }
  return new Map([...pages].sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)));
}

describe("the bounded Mermaid projection", () => {
  it("renders every checkout-v1 Spec, Pack, and index page as the reviewed golden", () => {
    const pages = rendered(extract({ root: checkoutRoot }).graph);
    const golden = goldenPages();

    expect([...pages.keys()]).toEqual([...golden.keys()]);
    expect(pages).toEqual(golden);
    expect(pages.has("spec/orders.create-order.md")).toBe(true);
    expect(pages.has("pack/checkout-v1.md")).toBe(true);
  });

  it("is byte-identical under node and edge permutation with code-unit sorted records", () => {
    const nodes = [primitive("spec:z"), primitive("spec:a"), pack("pack:p")];
    const edges: GraphEdge[] = [
      { from: "spec:z", type: "dependsOn", to: "spec:a", claim: "declared" },
      { from: "spec:a", type: "belongsTo", to: "pack:p", claim: "declared" },
    ];

    expect(rendered(graph([...nodes].reverse(), [...edges].reverse()))).toEqual(
      rendered(graph(nodes, edges)),
    );
  });

  it("escapes hostile labels without changing injective full-ID machine tokens", () => {
    const hostile = `quotes " ' [] {} () \` | & <> \\ newline\nUnicode λ "]-->`;
    const id = "pack:hostile.λ";
    const page = rendered(graph([pack(id, hostile)], [])).get(`pack/${machineToken(id)}.md`);

    expect(page).toContain(`${machineToken(id)}["`);
    expect(page).toContain(escapeMermaidLabel(hostile));
    expect(page).not.toContain(hostile);
    expect(page).not.toContain(`"]-->`);
    expect(machineToken("spec:a")).not.toBe(machineToken("spec:A"));
    expect(machineToken("spec:λ")).not.toBe(machineToken("spec:\udbff\udfff"));
  });

  it("keeps one-hop cycles, disconnected Pack members, foreign edges, and dangling placeholders without emitting a whole graph", () => {
    const nodes = [
      primitive("spec:a", "A"),
      primitive("spec:b", "B"),
      primitive("spec:outside", "Outside"),
      primitive("spec:member-a", "Member A"),
      primitive("spec:member-b", "Member B"),
      pack("pack:p", "P"),
    ];
    const edges = [
      { from: "spec:a", type: "dependsOn", to: "spec:b", claim: "declared" },
      { from: "spec:b", type: "dependsOn", to: "spec:a", claim: "declared" },
      { from: "spec:a", type: "foreign-edge", to: "spec:missing", claim: "declared" },
      { from: "spec:member-b", type: "belongsTo", to: "pack:p", claim: "declared" },
      { from: "spec:member-a", type: "belongsTo", to: "pack:p", claim: "declared" },
    ] as unknown as readonly GraphEdge[];

    const pages = rendered(graph(nodes, edges));
    const specPage = pages.get("spec/a.md") ?? "";
    const packPage = pages.get("pack/p.md") ?? "";

    expect(specPage).toContain(`${machineToken("spec:missing")}["spec:missing&#10;unresolved"]`);
    expect(specPage).toContain("foreign-edge &#91;declared&#93;");
    expect(specPage).toContain(`${machineToken("spec:a")} -->`);
    expect(specPage).toContain(`${machineToken("spec:b")} -->`);
    expect(specPage).not.toContain(machineToken("spec:outside"));
    expect(packPage.indexOf(machineToken("spec:member-a"))).toBeLessThan(
      packPage.indexOf(machineToken("spec:member-b")),
    );
  });

  it("refuses duplicate identities and both full-diagram bounds deterministically", () => {
    const duplicate = primitive("spec:duplicate");
    expect(() => rendered(graph([duplicate, duplicate], []))).toThrow(
      /MERMAID_MACHINE_TOKEN_COLLISION.*spec:duplicate/u,
    );

    const nodeOverflowEdges = Array.from(
      { length: MAX_MERMAID_NODES_PER_DIAGRAM },
      (_, index): GraphEdge => ({
        from: "spec:root",
        type: "dependsOn",
        to: `spec:neighbor-${String(index).padStart(3, "0")}`,
        claim: "declared",
      }),
    );
    expect(() => rendered(graph([primitive("spec:root")], nodeOverflowEdges))).toThrow(
      `Mermaid diagram "spec:root" exceeds MAX_MERMAID_NODES_PER_DIAGRAM: limit=${String(MAX_MERMAID_NODES_PER_DIAGRAM)} observed=${String(MAX_MERMAID_NODES_PER_DIAGRAM + 1)}`,
    );

    const edgeOverflowEdges = Array.from(
      { length: MAX_MERMAID_EDGES_PER_DIAGRAM + 1 },
      (): GraphEdge => ({
        from: "spec:root",
        type: "dependsOn",
        to: "spec:neighbor",
        claim: "declared",
      }),
    );
    expect(() =>
      rendered(graph([primitive("spec:root"), primitive("spec:neighbor")], edgeOverflowEdges)),
    ).toThrow(
      new RegExp(
        `Mermaid diagram "spec:(?:neighbor|root)" exceeds MAX_MERMAID_EDGES_PER_DIAGRAM: limit=${String(MAX_MERMAID_EDGES_PER_DIAGRAM)} observed=${String(MAX_MERMAID_EDGES_PER_DIAGRAM + 1)}`,
        "u",
      ),
    );
  });
});

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { extract, extractFindingIds, serializeGraph, validateGraph } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";

const temporaryRoots: string[] = [];

const TARGET_SPECS = ["rebuild", "history-rebuild", "gate"] as const;

function specSource(name: string): string {
  return `---
id: spec:fixture.${name}
kind: behavior
altitude: feature
readiness: idea
relations: {}
---
# ${name}

## Intent
- outcome: Exercise the two anchor forms.
`;
}

/** One root per source file: the Specs every binding targets, plus the file under test. */
function fixtureRoot(fileName: string, source: string): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-anchor-forms-"));
  temporaryRoots.push(root);
  mkdirSync(join(root, "specs"));

  for (const name of TARGET_SPECS) {
    writeFileSync(join(root, "specs", `${name}.sdp.md`), specSource(name), "utf8");
  }

  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "src", fileName), source, "utf8");
  return root;
}

/** The graph minus binding sites: `file` and `line` locate an anchor, they are not its content. */
function siteless(graph: GraphSchema): unknown {
  const serialized = JSON.parse(serializeGraph(graph)) as GraphSchema;

  return {
    nodes: serialized.nodes.map((node) =>
      node.nodeType === "CodeNode" || node.nodeType === "Anchor"
        ? { ...node, file: undefined, line: undefined }
        : node,
    ),
    edges: serialized.edges,
  };
}

afterAll(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

const CONSTANT_FORM = `import { codeAnchor, codeAnchorId, componentAnchorId, ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol/anchors";

export const readModel = codeAnchor({
  id: codeAnchorId("component:fixture.read-model"),
  label: "the read model",
});

export const rebuild = codeAnchor({
  id: codeAnchorId("impl:fixture.rebuild"),
  label: "the online rebuild path",
  satisfies: [ref("spec:fixture.rebuild"), ref("spec:fixture.history-rebuild")],
  component: componentAnchorId("component:fixture.read-model"),
  uses: [codeAnchorId("impl:fixture.gate"), componentAnchorId("component:fixture.read-model")],
});

export const gate = codeAnchor({
  id: codeAnchorId("impl:fixture.gate"),
  satisfies: ref("spec:fixture.gate"),
});

export const rebuildTest = specTest({
  id: testAnchorId("test:fixture.rebuild"),
  label: "rebuild is verified",
  verifies: [ref("spec:fixture.rebuild"), ref("spec:fixture.gate")],
});
`;

const COMMENT_FORM = `/**
 * The read model. Prose stays local commentary and confers nothing.
 *
 * @sdp-anchor component:fixture.read-model
 * @sdp-label the read model
 */
export const readModel = {};

/**
 * @sdp-anchor impl:fixture.rebuild
 * @sdp-label the online rebuild path
 * @sdp-satisfies spec:fixture.rebuild, spec:fixture.history-rebuild
 * @sdp-component component:fixture.read-model
 * @sdp-uses impl:fixture.gate, component:fixture.read-model
 */
export async function rebuild(): Promise<void> {}

/** @sdp-anchor impl:fixture.gate
 *  @sdp-satisfies spec:fixture.gate */
export function gate(): void {}

/**
 * @sdp-anchor test:fixture.rebuild
 * @sdp-label rebuild is verified
 * @sdp-verifies spec:fixture.rebuild, spec:fixture.gate
 */
export function rebuildTest(): void {}
`;

describe("the two anchor forms", () => {
  it("reifies the constant form with plural targets through the anchors subpath", () => {
    const result = extract({ root: fixtureRoot("constant.ts", CONSTANT_FORM) });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(4);
    expect(result.graph.edges.filter((edge) => edge.from === "impl:fixture.rebuild")).toEqual([
      {
        from: "impl:fixture.rebuild",
        type: "satisfies",
        to: "spec:fixture.rebuild",
        claim: "anchored",
      },
      {
        from: "impl:fixture.rebuild",
        type: "satisfies",
        to: "spec:fixture.history-rebuild",
        claim: "anchored",
      },
      {
        from: "impl:fixture.rebuild",
        type: "memberOf",
        to: "component:fixture.read-model",
        claim: "anchored",
      },
      { from: "impl:fixture.rebuild", type: "uses", to: "impl:fixture.gate", claim: "anchored" },
      {
        from: "impl:fixture.rebuild",
        type: "uses",
        to: "component:fixture.read-model",
        claim: "anchored",
      },
    ]);
    expect(result.graph.edges.filter((edge) => edge.from === "test:fixture.rebuild")).toEqual([
      {
        from: "test:fixture.rebuild",
        type: "verifies",
        to: "spec:fixture.rebuild",
        claim: "anchored",
      },
      {
        from: "test:fixture.rebuild",
        type: "verifies",
        to: "spec:fixture.gate",
        claim: "anchored",
      },
    ]);
    // An identity-only component anchor mints a CodeNode and nothing else.
    expect(result.graph.nodes).toContainEqual(
      expect.objectContaining({ id: "component:fixture.read-model", nodeType: "CodeNode" }),
    );
    expect(result.graph.edges.some((edge) => edge.from === "component:fixture.read-model")).toBe(
      false,
    );
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("reifies the comment form from a file that imports nothing, at the block's first line", () => {
    const result = extract({ root: fixtureRoot("comment.ts", COMMENT_FORM) });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(4);
    expect(result.graph.nodes.filter((node) => node.nodeType !== "Primitive")).toEqual([
      {
        id: "component:fixture.read-model",
        nodeType: "CodeNode",
        claim: "anchored",
        label: "the read model",
        file: "src/comment.ts",
        line: 1,
      },
      {
        id: "impl:fixture.rebuild",
        nodeType: "CodeNode",
        claim: "anchored",
        label: "the online rebuild path",
        file: "src/comment.ts",
        line: 9,
      },
      {
        id: "impl:fixture.gate",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "src/comment.ts",
        line: 18,
      },
      {
        id: "test:fixture.rebuild",
        nodeType: "Anchor",
        claim: "anchored",
        label: "rebuild is verified",
        file: "src/comment.ts",
        line: 22,
      },
    ]);
    expect(validateGraph(result.graph).findings).toEqual([]);
  });

  it("gives identical graph data to identical content in either form", () => {
    const constant = extract({ root: fixtureRoot("binding.ts", CONSTANT_FORM) });
    const comment = extract({ root: fixtureRoot("binding.ts", COMMENT_FORM) });

    expect(constant.report.findings).toEqual([]);
    expect(comment.report.findings).toEqual([]);
    expect(siteless(comment.graph)).toEqual(siteless(constant.graph));
  });

  it("reads only the leading /** block of a top-level statement", () => {
    const result = extract({
      root: fixtureRoot(
        "scope.ts",
        `// @sdp-anchor impl:fixture.line-comment
/* @sdp-anchor impl:fixture.plain-block */
export function outer(): void {
  /**
   * @sdp-anchor impl:fixture.nested
   */
  const inner = 1;
  void inner;
}

export class Holder {
  /** @sdp-anchor impl:fixture.member */
  method(): void {}
}

/** @sdp-anchor impl:fixture.gate */
export const gate = 1; /** @sdp-anchor impl:fixture.trailing */
/** @sdp-anchor impl:fixture.tail */
`,
      ),
    });

    expect(result.report.findings).toEqual([]);
    expect(
      result.graph.nodes.filter((node) => node.nodeType === "CodeNode").map((n) => n.id),
    ).toEqual(["impl:fixture.gate"]);
  });

  it("reports the same duplicate id across the two forms", () => {
    const result = extract({
      root: fixtureRoot(
        "both.ts",
        `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

/**
 * @sdp-anchor impl:fixture.gate
 * @sdp-satisfies spec:fixture.gate
 */
export const gate = codeAnchor({
  id: codeAnchorId("impl:fixture.gate"),
  satisfies: ref("spec:fixture.gate"),
});
`,
      ),
    });

    expect(result.report.findings.map((finding) => [finding.validatorId, finding.line])).toEqual([
      [extractFindingIds.duplicateId, 3],
      [extractFindingIds.duplicateId, 7],
    ]);
    expect(result.graph.nodes.some((node) => node.id === "impl:fixture.gate")).toBe(false);
  });
});

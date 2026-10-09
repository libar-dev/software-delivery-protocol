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

function codeNodeIds(graph: GraphSchema): readonly string[] {
  return graph.nodes.filter((node) => node.nodeType === "CodeNode").map((node) => node.id);
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
  layer: "application",
  context: "platform",
});

export const rebuild = codeAnchor({
  id: codeAnchorId("impl:fixture.rebuild"),
  label: "the online rebuild path",
  satisfies: [ref("spec:fixture.rebuild")],
  references: [ref("spec:fixture.history-rebuild")],
  component: componentAnchorId("component:fixture.read-model"),
  uses: [codeAnchorId("impl:fixture.gate"), componentAnchorId("component:fixture.read-model")],
  role: "service",
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
 * @sdpAnchor component:fixture.read-model
 * @sdpLabel the read model
 * @sdpLayer application
 * @sdpContext platform
 */
export const readModel = {};

/**
 * @sdpAnchor impl:fixture.rebuild
 * @sdpLabel the online rebuild path
 * @sdpSatisfies spec:fixture.rebuild
 * @sdpReferences spec:fixture.history-rebuild
 * @sdpComponent component:fixture.read-model
 * @sdpUses impl:fixture.gate, component:fixture.read-model
 * @sdpRole service
 */
export async function rebuild(): Promise<void> {}

/** @sdpAnchor impl:fixture.gate
 *  @sdpSatisfies spec:fixture.gate */
export function gate(): void {}

/**
 * @sdpAnchor test:fixture.rebuild
 * @sdpLabel rebuild is verified
 * @sdpVerifies spec:fixture.rebuild, spec:fixture.gate
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
      {
        from: "impl:fixture.rebuild",
        type: "references",
        to: "spec:fixture.history-rebuild",
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
    // An identity-only component anchor mints a CodeNode, with its layer and context, and no edge.
    expect(result.graph.nodes).toContainEqual({
      id: "component:fixture.read-model",
      nodeType: "CodeNode",
      claim: "anchored",
      label: "the read model",
      file: "src/constant.ts",
      line: 3,
      layer: "application",
      context: "platform",
    });
    expect(result.graph.edges.some((edge) => edge.from === "component:fixture.read-model")).toBe(
      false,
    );
    expect(result.graph.nodes).toContainEqual(
      expect.objectContaining({ id: "impl:fixture.rebuild", role: "service" }),
    );
    // `references` confers nothing: only the satisfied Spec reads implemented.
    const primitive = (id: string) =>
      result.graph.nodes.find((node) => node.id === id && node.nodeType === "Primitive");
    expect(primitive("spec:fixture.rebuild")).toEqual(
      expect.objectContaining({ deliveryFacts: ["implemented", "has-verifier"] }),
    );
    expect(primitive("spec:fixture.history-rebuild")).not.toHaveProperty("deliveryFacts");
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
        layer: "application",
        context: "platform",
      },
      {
        id: "impl:fixture.rebuild",
        nodeType: "CodeNode",
        claim: "anchored",
        label: "the online rebuild path",
        file: "src/comment.ts",
        line: 11,
        role: "service",
      },
      {
        id: "impl:fixture.gate",
        nodeType: "CodeNode",
        claim: "anchored",
        file: "src/comment.ts",
        line: 22,
      },
      {
        id: "test:fixture.rebuild",
        nodeType: "Anchor",
        claim: "anchored",
        label: "rebuild is verified",
        file: "src/comment.ts",
        line: 26,
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

  it("reads every top-level /** block: above an import, several before one statement, after the last, alone in a file", () => {
    const result = extract({
      root: fixtureRoot(
        "attachment.ts",
        `/** @sdpAnchor impl:fixture.above-import */
import { readFileSync } from "node:fs";

/** @sdpAnchor impl:fixture.first */
/** @sdpAnchor impl:fixture.second */
export const pair = readFileSync;
/** @sdpAnchor impl:fixture.trailing */

/**
 * Ordinary documentation with a TSDoc tag and no reserved tag.
 * @param nothing - is read here
 */
export function plain(): void {}

/** @sdpAnchor impl:fixture.tail */
`,
      ),
    });
    const alone = extract({
      root: fixtureRoot("alone.ts", `/** @sdpAnchor impl:fixture.alone\n *  @sdpRole barrel */\n`),
    });

    expect(result.report.findings).toEqual([]);
    expect(codeNodeIds(result.graph)).toEqual([
      "impl:fixture.above-import",
      "impl:fixture.first",
      "impl:fixture.second",
      "impl:fixture.trailing",
      "impl:fixture.tail",
    ]);
    expect(alone.report.findings).toEqual([]);
    expect(alone.graph.nodes).toContainEqual(
      expect.objectContaining({ id: "impl:fixture.alone", role: "barrel", line: 1 }),
    );
  });

  it("refuses a reserved tag in a nested position and never reads a non-doc comment", () => {
    const result = extract({
      root: fixtureRoot(
        "nested.ts",
        `// @sdpAnchor impl:fixture.line-comment
/* @sdpAnchor impl:fixture.plain-block */
export function outer(): void {
  /**
   * @sdpAnchor impl:fixture.nested
   */
  const inner = 1;
  void inner;
}

export class Holder {
  /** @sdpAnchor impl:fixture.member */
  method(): void {}
}

export const literal = {
  // @sdpReferences spec:fixture.gate
  key: 1,
};
`,
      ),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        line: 4,
        message: expect.stringContaining("misplaced reserved tag") as string,
      }),
      expect.objectContaining({ validatorId: extractFindingIds.nonStaticEnvelope, line: 12 }),
      expect.objectContaining({ validatorId: extractFindingIds.nonStaticEnvelope, line: 17 }),
    ]);
    expect(codeNodeIds(result.graph)).toEqual([]);
  });

  it("reports the same duplicate id across the two forms", () => {
    const result = extract({
      root: fixtureRoot(
        "both.ts",
        `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

/**
 * @sdpAnchor impl:fixture.gate
 * @sdpSatisfies spec:fixture.gate
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

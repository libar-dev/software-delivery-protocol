import { Project } from "ts-morph";
import { reifyAnchorSourceFile } from "../src/extract/anchors.js";
import { reifySourceFile } from "../src/extract/reify.js";
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
  /** @sdpReferences spec:fixture.gate */
  key: 1,
};

export function quiet(): void {
  // @sdpAnchor impl:fixture.nested-line-comment
  /* @sdpAnchor impl:fixture.nested-plain-block */
  /** Explain @sdpAnchor here: prose that mentions a tag reads nothing. */
}

export function empty(): void { /** @sdpAnchor impl:fixture.empty-body */ }

export class Closing {
  method(): void {}
  /** @sdpAnchor impl:fixture.before-class-close */
}

export function afterLast(): void {
  void 0;
  /** @sdpAnchor impl:fixture.after-last-statement */
}
`,
      ),
    });

    expect(result.report.findings).toEqual(
      [4, 12, 17, 27, 31, 36].map((line): unknown =>
        expect.objectContaining({
          validatorId: extractFindingIds.nonStaticEnvelope,
          line,
          message: expect.stringContaining("misplaced reserved tag") as string,
        }),
      ),
    );
    expect(codeNodeIds(result.graph)).toEqual([]);
  });

  it("refuses a reserved tag in a JSX expression and reads nothing from JSX text", () => {
    const result = extract({
      root: fixtureRoot(
        "view.tsx",
        `export function View(): unknown {
  return (
    <section>
      {/** @sdpAnchor impl:fixture.jsx-expression */}
      /** @sdpAnchor impl:fixture.jsx-text */
    </section>
  );
}
`,
      ),
    });

    expect(result.report.findings).toEqual([
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        line: 4,
        message: expect.stringContaining("misplaced reserved tag") as string,
      }),
    ]);
    expect(codeNodeIds(result.graph)).toEqual([]);
  });

  it("refuses a misspelled reserved tag rather than reading it as prose", () => {
    const result = extract({
      root: fixtureRoot(
        "misspelled.ts",
        `/** @sdp-anchor impl:fixture.hyphenated */
export const hyphenated = 1;

/** @sdpAnchor: impl:fixture.colon */
export const colon = 1;

/**
 * @sdpBad: value
 * @sdpAnchor impl:fixture.gate
 * @sdpSatisfies spec:fixture.gate
 */
export const prefixed = 1;
`,
      ),
    });
    const malformed = (line: number, tag: string): unknown =>
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        line,
        message: expect.stringContaining(`malformed reserved tag "@${tag}"`) as string,
      });
    const missingOpener = (line: number): unknown =>
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        line,
        message: expect.stringContaining("must open its anchor with @sdpAnchor") as string,
      });

    expect(result.report.findings).toEqual([
      malformed(1, "sdp-anchor"),
      missingOpener(1),
      malformed(4, "sdpAnchor:"),
      missingOpener(4),
      malformed(8, "sdpBad:"),
    ]);
    expect(codeNodeIds(result.graph)).toEqual([]);
  });

  it.each([
    ["U+2028", "\u2028"],
    ["U+2029", "\u2029"],
    ["a lone CR", "\r"],
  ])("ends a comment line at %s, so a tag line never hides text after it", (_name, separator) => {
    const result = extract({
      root: fixtureRoot(
        "separated.ts",
        `/**
 * @sdpAnchor impl:fixture.gate
 * @sdpSatisfies spec:fixture.gate${separator}(see the gate rules)
 */
export const gate = 1;

/**
 * @sdpAnchor impl:fixture.rebuild
 * @sdpSatisfie spec:fixture.rebuild${separator}(misspelt tag)
 */
export const rebuild = 1;
`,
      ),
    });
    const refused = (line: number, text: string): unknown =>
      expect.objectContaining({
        validatorId: extractFindingIds.nonStaticEnvelope,
        line,
        message: expect.stringContaining(text) as string,
      });

    // The separator ends line 3 and line 10, as the TypeScript compiler counts lines.
    expect(result.report.findings).toEqual([
      refused(4, "must open a tag"),
      refused(10, 'tag "@sdpSatisfie" is not a reserved anchor tag'),
      refused(11, "must open a tag"),
    ]);
    expect(codeNodeIds(result.graph)).toEqual([]);
  });

  it("reads a comment form saved with CR-only line endings at the same lines", () => {
    const lf = extract({ root: fixtureRoot("comment.ts", COMMENT_FORM) });
    const cr = extract({ root: fixtureRoot("comment.ts", COMMENT_FORM.replaceAll("\n", "\r")) });

    expect(cr.report.findings).toEqual([]);
    expect(cr.counts.anchors).toBe(4);
    expect(serializeGraph(cr.graph)).toBe(serializeGraph(lf.graph));
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

// Both reifiers read the same AST, as they do for a discovered TypeScript carrier.
describe.each([
  ["LF", "\n"],
  ["CRLF", "\r\n"],
  ["CR", "\r"],
  ["U+2028", "\u2028"],
  ["U+2029", "\u2029"],
])("TypeScript source locations with %s", (_name, newline) => {
  it("locates both anchor forms, carrier findings and entries on the compiler line map", () => {
    const source = [
      'import { codeAnchor, codeAnchorId, spec, specId } from "@libar-dev/software-delivery-protocol";',
      "",
      'const bound = codeAnchor({ id: codeAnchorId("impl:probe.constant") });',
      "",
      "/** @sdpAnchor impl:probe.comment */",
      "const definition = spec({",
      '  id: specId("spec:probe.lines"), kind: "behavior", altitude: "story", readiness: "idea", relations: [],',
      '  behavior: { notes: "unknown", rules: ["Keep the entry location."] },',
      '  design: { shape: "A located entry" },',
      "});",
      "const invalid = codeAnchor({",
      '  id: codeAnchorId("impl:probe.invalid"),',
      "  unknown: true,",
      "});",
    ].join(newline);
    const project = new Project({ useInMemoryFileSystem: true });
    const file = project.createSourceFile("probe.sdp.ts", source);
    const anchors = reifyAnchorSourceFile(file, "probe.sdp.ts");
    const carrier = reifySourceFile(file, "probe.sdp.ts");
    expect(anchors.anchors.map(({ id, line }) => ({ id, line }))).toEqual([
      { id: "impl:probe.comment", line: 5 },
      { id: "impl:probe.constant", line: 3 },
    ]);
    expect(anchors.findings).toContainEqual(expect.objectContaining({ line: 13 }));
    expect(carrier.findings).toContainEqual(
      expect.objectContaining({
        validatorId: "extract/unrecognized-property",
        line: 8,
      }),
    );
    expect(carrier.specs[0]?.entryLines).toEqual(
      expect.arrayContaining([
        { entry: "rule[0]", line: 8 },
        { entry: "design.shape", line: 9 },
      ]),
    );
  });
});

import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  codeAnchor,
  codeAnchorId,
  componentAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { extract } from "../src/index.js";
import type { ExtractionResult, GraphSchema } from "../src/index.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const diffDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.design-diff-recipe"),
  label: "realizes the design diff in the shipped recipe catalog",
  satisfies: ref("spec:consumers.design-diff"),
  component: componentAnchorId("component:protocol.reader"),
  role: "projection",
});
void diffDocumentAnchor;
const diffTestAnchor = specTest({
  id: testAnchorId("test:protocol.design-diff-recipe"),
  verifies: ref("spec:consumers.design-diff"),
});
void diffTestAnchor;

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const excludes = ["explorations", "examples", "test/fixtures/import/parity"];
function bodyOf(ordinal: number): string {
  const catalog = readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8");
  const section = catalog
    .split(new RegExp(`^## ${String(ordinal)}\\. .+$`, "mu"))[1]
    ?.split(/^## /mu)[0];
  const body = /```js\n([\s\S]*?)\n```/u.exec(section ?? "")?.[1];
  if (body === undefined) throw new Error(`missing recipe ${String(ordinal)}`);
  return body;
}
async function runRecipe<T>(
  ordinal: number,
  params: Record<string, unknown>,
  derived: ExtractionResult,
): Promise<T> {
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    ["q", bodyOf(ordinal), "--root", repoRoot, "--params", JSON.stringify(params), "--json"],
    capture.output,
    {
      query: { extract: () => derived, isStdinTty: () => true },
    },
  );
  expect({ exitCode, stderr: capture.readStderr() }).toEqual({ exitCode: 0, stderr: "" });
  return JSON.parse(capture.readStdout()) as T;
}
function specDocument(id: string, body: string, relations = "{}", kind = "behavior"): string {
  return `---\nid: spec:probe.${id}\nkind: ${kind}\naltitude: story\nreadiness: scoped\nrelations: ${relations}\n---\n# ${id}\n\nNarrative for ${id}.\n\n## Intent\n- outcome: Read ${id} in context.\n\n${body}\n`;
}
const documents = {
  "a.sdp.md": specDocument(
    "a",
    "## Behavior\n- rule: [#first] First rule.\n- flow: [#last] Last flow.\n- rule: An unkeyed rule.\n\n## Design\n- alpha: `Alpha` declaration\n- beta: Beta text\n\n## UI\n- panel: Panel text",
    "\n  dependsOn:\n    - target: spec:probe.outside\n      reason: A needs the outside law.",
  ),
  "b.sdp.md": specDocument("b", "## Behavior\n- rule: B rule.\n\n## Design\n- layer: domain"),
  "outside.sdp.md": specDocument("outside", "## Behavior\n- rule: Outside rule."),
  "model.sdp.md": specDocument(
    "model",
    "## Model\n- **Order** — An order.\n- **Line** — A line.",
    "{}",
    "model",
  ),
  "review.pack.sdp.md":
    "---\nid: pack:probe.review\nspecs:\n  - spec:probe.a\n  - spec:probe.b\n  - spec:probe.model\n---\n# Probe review\n\nThe Pack framing.\n",
  "anchors.ts":
    "/**\n * @sdpAnchor impl:probe.a\n * @sdpSatisfies spec:probe.a\n */\nexport const a = 1;\n",
};
function withCorpus<T>(run: (root: string, base: ExtractionResult) => T): T {
  const directory = mkdtempSync(join(repoRoot, ".lane-l-fixture-"));
  const template = join(directory, "template");
  const copy = join(directory, "copy");
  try {
    mkdirSync(template);
    for (const [path, text] of Object.entries(documents)) writeFileSync(join(template, path), text);
    cpSync(template, copy, { recursive: true });
    const base = extract({ root: copy });
    expect(base.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
    const result = run(copy, base);
    // Keep asynchronous callbacks alive until their own finally removes the fixture.
    if (result instanceof Promise)
      return result.finally(() => {
        rmSync(directory, { recursive: true, force: true });
      }) as T;
    rmSync(directory, { recursive: true, force: true });
    return result;
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}
function edit(root: string, file: string, from: string, to: string): void {
  const path = join(root, file);
  const text = readFileSync(path, "utf8");
  expect(text).toContain(from);
  writeFileSync(path, text.replace(from, to));
}
interface Part {
  part: string;
  change: string;
  from: unknown;
  to: unknown;
}
interface Diff {
  base: { schemaVersion: string; specs: number };
  head: { schemaVersion: string; specs: number };
  diagnostics: { part: string }[];
  totals: { added: number; removed: number; changed: number; packs: number; bindings: number };
  specs: { added: string[]; removed: string[]; changed: { id: string; parts: Part[] }[] };
  packs: {
    id: string;
    change: string;
    membersAdded: string[];
    membersRemoved: string[];
    reordered: boolean;
  }[];
  bindings: {
    id: string;
    implementedBy: { added: string[]; removed: string[] };
    deliveryFacts: { added: string[]; removed: string[] };
  }[];
  leftOut: string[];
}

describe("iteration loop: design diff", () => {
  it("compares keyed values, keyed order and unkeyed sections while keeping bindings apart", async () => {
    await withCorpus(async (root, base) => {
      edit(
        root,
        "a.sdp.md",
        "- alpha: `Alpha` declaration\n- beta: Beta text",
        "- beta: Beta text\n- alpha: `Alpha` declaration\n- gamma: Added text",
      );
      edit(root, "a.sdp.md", "First rule.", "Edited first rule.");
      edit(root, "a.sdp.md", "An unkeyed rule.", "An edited unkeyed rule.");
      edit(root, "a.sdp.md", "A needs the outside law.", "A new relation reason.");
      edit(root, "a.sdp.md", "Narrative for a.", "New narrative.");
      edit(
        root,
        "model.sdp.md",
        "- **Order** — An order.\n- **Line** — A line.",
        "- **Line** — A line.\n- **Order** — A changed order.",
      );
      edit(
        root,
        "review.pack.sdp.md",
        "  - spec:probe.a\n  - spec:probe.b",
        "  - spec:probe.b\n  - spec:probe.a",
      );
      edit(root, "anchors.ts", "@sdpSatisfies spec:probe.a", "@sdpReferences spec:probe.a");
      const head = extract({ root });
      expect(head.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
      const result = await runRecipe<Diff>(35, { base: base.graph, detail: true }, head);
      expect(result.specs.changed.find((row) => row.id === "spec:probe.a")?.parts).toEqual(
        expect.arrayContaining([
          {
            part: "design.alpha",
            change: "moved",
            from: "`Alpha` declaration",
            to: "`Alpha` declaration",
          },
          { part: "design.gamma", change: "added", from: null, to: "Added text" },
          { part: "rule.first", change: "changed", from: "First rule.", to: "Edited first rule." },
          {
            part: "behavior.rules",
            change: "changed",
            from: ["First rule.", "An unkeyed rule."],
            to: ["Edited first rule.", "An edited unkeyed rule."],
          },
        ]),
      );
      expect(
        result.specs.changed
          .find((row) => row.id === "spec:probe.model")
          ?.parts.map(({ part, change }) => ({ part, change })),
      ).toEqual([
        { part: "term.Line", change: "moved" },
        { part: "term.Order", change: "changed" },
      ]);
      expect(result.packs[0]?.reordered).toBe(true);
      expect(result.bindings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "spec:probe.a",
            implementedBy: { added: [], removed: ["impl:probe.a"] },
            deliveryFacts: { added: [], removed: ["implemented"] },
          }),
        ]),
      );
      const summary = await runRecipe<{
        specs: { changed: { id: string; parts: string[] }[] };
        leftOut: string[];
      }>(35, { base: base.graph }, head);
      expect(summary.specs.changed).toEqual(
        result.specs.changed.map((row) => ({
          id: row.id,
          parts: row.parts.map((part) => part.part),
        })),
      );
      expect(summary.leftOut).toHaveLength(1);
    });
  }, 20_000);

  it("compares question fields by key, whole unkeyed questions, envelope fields and other sections", async () => {
    await withCorpus(async (root) => {
      edit(
        root,
        "b.sdp.md",
        "## Behavior",
        "### Open questions\n- [blocking #one] First question?\n  - decider: owner\n- [non-blocking #two] Second question?\n- [non-blocking] Unkeyed question?\n\n## Behavior",
      );
      const base = extract({ root });
      edit(
        root,
        "b.sdp.md",
        "- [blocking #one] First question?\n  - decider: owner\n- [non-blocking #two] Second question?",
        "- [non-blocking #two] Second question?\n- [blocking #one] First question?\n  - decider: delegated",
      );
      edit(root, "b.sdp.md", "Unkeyed question?", "Changed unkeyed question?");
      edit(root, "b.sdp.md", "readiness: scoped", "readiness: idea");
      edit(root, "b.sdp.md", "altitude: story", "altitude: feature");
      const result = await runRecipe<Diff>(
        35,
        { base: base.graph, detail: true },
        extract({ root }),
      );
      const parts = result.specs.changed.find((row) => row.id === "spec:probe.b")?.parts ?? [];
      expect(parts.map(({ part, change }) => ({ part, change }))).toEqual(
        expect.arrayContaining([
          { part: "question.one", change: "changed" },
          { part: "question.two", change: "moved" },
          { part: "intent.openQuestions", change: "changed" },
          { part: "statedReadiness", change: "changed" },
          { part: "altitude", change: "changed" },
        ]),
      );
    });
  }, 20_000);

  it("reports added and removed Specs and Packs, filters the union of membership, and ignores source lines", async () => {
    await withCorpus(async (root, base) => {
      rmSync(join(root, "b.sdp.md"));
      writeFileSync(
        join(root, "new.sdp.md"),
        specDocument("new", "## Behavior\n- rule: New rule."),
      );
      edit(root, "review.pack.sdp.md", "spec:probe.b", "spec:probe.new");
      writeFileSync(
        join(root, "new.pack.sdp.md"),
        "---\nid: pack:probe.new\nspecs: [spec:probe.new]\n---\n# New Pack\n",
      );
      const head = extract({ root });
      const result = await runRecipe<Diff>(
        35,
        { base: base.graph, pack: "pack:probe.review", detail: true },
        head,
      );
      expect(result.specs).toEqual({
        added: ["spec:probe.new"],
        removed: ["spec:probe.b"],
        changed: [],
      });
      expect(result.base.specs).toBe(3);
      expect(result.head.specs).toBe(3);
      expect(result.packs).toEqual([
        {
          id: "pack:probe.review",
          change: "changed",
          membersAdded: ["spec:probe.new"],
          membersRemoved: ["spec:probe.b"],
          reordered: false,
        },
      ]);
      const all = await runRecipe<Diff>(35, { base: base.graph }, head);
      expect(all.packs).toHaveLength(2);
      const linesOnly = { ...base.graph, locations: [] };
      expect((await runRecipe<Diff>(35, { base: linesOnly }, base)).totals).toEqual({
        added: 0,
        removed: 0,
        changed: 0,
        packs: 0,
        bindings: 0,
      });
    });
  }, 20_000);

  it("diagnoses required input and schema differences and compares common content", async () => {
    await withCorpus(async (_root, base) => {
      expect((await runRecipe<{ diagnostics: unknown[] }>(35, {}, base)).diagnostics).toHaveLength(
        1,
      );
      const old = JSON.parse(JSON.stringify(base.graph)) as GraphSchema;
      const older = {
        ...old,
        schemaVersion: "0.8.0",
        nodes: old.nodes.map((node) =>
          node.nodeType === "Primitive"
            ? {
                ...node,
                sections:
                  node.sections === undefined
                    ? undefined
                    : {
                        ...node.sections,
                        behavior:
                          node.sections.behavior === undefined
                            ? undefined
                            : {
                                rules: node.sections.behavior.rules,
                                flows: node.sections.behavior.flows,
                              },
                      },
              }
            : node,
        ),
      };
      const result = await runRecipe<Diff>(35, { base: older, detail: true }, base);
      expect(result.diagnostics.map((row) => row.part)).toEqual(
        expect.arrayContaining(["schemaVersion", "ruleKeys"]),
      );
      expect(result.specs.changed).toEqual([]);
    });
  }, 20_000);

  it("reads this repository's HEAD~1 through a temporary git worktree and compares it to the working tree", async () => {
    const directory = mkdtempSync(join(repoRoot, ".lane-l-git-"));
    const worktree = join(directory, "base");
    let added = false;
    try {
      execFileSync("git", ["-C", repoRoot, "worktree", "add", "--detach", worktree, "HEAD~1"], {
        stdio: "pipe",
      });
      added = true;
      const base = extract({ root: worktree, exclude: excludes });
      const head = extract({ root: repoRoot, exclude: excludes });
      expect(base.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
      expect(head.report.findings.filter((finding) => finding.severity === "error")).toEqual([]);
      const result = await runRecipe<Diff>(35, { base: base.graph, detail: true }, head);
      expect(result.base.specs).toBe(
        base.graph.nodes.filter((node) => node.nodeType === "Primitive").length,
      );
      expect(result.head.specs).toBe(
        head.graph.nodes.filter((node) => node.nodeType === "Primitive").length,
      );
      const authoredOf = (value: GraphSchema) =>
        new Map(
          value.nodes
            .filter((node) => node.nodeType === "Primitive")
            .map((node) => [
              node.id,
              JSON.stringify({
                node: Object.fromEntries(
                  Object.entries(node).filter(([key]) => !["file", "deliveryFacts"].includes(key)),
                ),
                relations: value.edges.filter(
                  (edge) =>
                    edge.from === node.id && edge.claim === "declared" && edge.type !== "belongsTo",
                ),
              }),
            ]),
        );
      const a = authoredOf(base.graph),
        b = authoredOf(head.graph);
      const changedIds = [...a.keys()].filter((id) => b.has(id) && a.get(id) !== b.get(id)).sort();
      expect(result.specs.changed.map((row) => row.id)).toEqual(changedIds);
    } finally {
      if (added)
        execFileSync("git", ["-C", repoRoot, "worktree", "remove", "--force", worktree], {
          stdio: "pipe",
        });
      rmSync(directory, { recursive: true, force: true });
    }
  }, 20_000);

  it("compares new Design entries across schema versions when the base corpus has none", async () => {
    await withCorpus(async (root) => {
      edit(root, "a.sdp.md", "## Design\n- alpha: `Alpha` declaration\n- beta: Beta text\n\n", "");
      edit(root, "b.sdp.md", "\n\n## Design\n- layer: domain", "");
      const base = { ...extract({ root }).graph, schemaVersion: "0.8.0" };
      edit(
        root,
        "b.sdp.md",
        "- rule: B rule.",
        "- rule: B rule.\n\n## Design\n- added: New design.",
      );
      const head = extract({ root });
      const diff = await runRecipe<Diff>(35, { base, detail: true }, head);
      expect(diff.diagnostics.map((row) => row.part)).toContain("schemaVersion");
      expect(diff.diagnostics.map((row) => row.part)).not.toContain("design");
      expect(diff.specs.changed.find((row) => row.id === "spec:probe.b")?.parts).toContainEqual({
        part: "design.added",
        change: "added",
        from: null,
        to: "New design.",
      });
      const check = await runRecipe<ProposalCheck>(
        38,
        {
          base,
          proposal: {
            ...sampleProposal,
            changes: [{ scope: ["spec:probe.b#design.added"], request: "Review new design." }],
          },
        },
        head,
      );
      expect(check.changes[0]?.scope[0]).toMatchObject({
        resolvesAtBase: false,
        resolvesAtHead: true,
        moved: true,
      });
    });
  }, 20_000);

  it("normalizes legacy rule markers when both engines declare schema 0.9.0", async () => {
    await withCorpus(async (_root, head) => {
      const base = JSON.parse(JSON.stringify(head.graph)) as GraphSchema;
      for (const node of base.nodes) {
        if (node.nodeType !== "Primitive" || !node.sections?.behavior?.ruleKeys) continue;
        const behavior = node.sections.behavior;
        for (const [key, path] of Object.entries(behavior.ruleKeys ?? {})) {
          const match = /^(rules|flows)\[(\d+)\]$/u.exec(path);
          const list = match?.[1] === "rules" ? behavior.rules : behavior.flows;
          const index = Number(match?.[2]);
          if (list) (list as string[])[index] = `[#${key}] ${String(list[index])}`;
        }
        delete (behavior as { ruleKeys?: unknown }).ruleKeys;
      }
      const diff = await runRecipe<Diff>(35, { base, detail: true }, head);
      expect(diff.diagnostics).toEqual([]);
      expect(diff.specs.changed).toEqual([]);
      const check = await runRecipe<ProposalCheck>(
        38,
        {
          base,
          proposal: {
            ...sampleProposal,
            changes: [
              {
                scope: ["spec:probe.a#rule.first", "spec:probe.a#rule.last", "spec:probe.a"],
                request: "Review unchanged rules.",
              },
            ],
          },
        },
        head,
      );
      expect(check.changes[0]?.moved).toBe(false);
      expect(
        check.changes[0]?.scope.every(
          (row) => row.resolvesAtBase && row.resolvesAtHead && row.moved === false,
        ),
      ).toBe(true);
    });
  }, 20_000);

  it("reports proposal scopes outside the common schema as incomparable", async () => {
    await withCorpus(async (_root, head) => {
      const base = { ...head.graph, schemaVersion: "0.8.0" };
      const check = await runRecipe<ProposalCheck>(
        38,
        {
          base,
          proposal: {
            ...sampleProposal,
            changes: [{ scope: ["spec:probe.a#rule.first"], request: "Review this rule." }],
          },
        },
        head,
      );
      expect(check.changes[0]?.scope[0]?.comparable).toBe(false);
      expect(typeof check.changes[0]?.scope[0]?.reason).toBe("string");
      expect(check.changes[0]?.scope[0]).not.toHaveProperty("moved");
      expect(check.changes[0]?.moved).toBeNull();
      expect(check.diagnostics?.map((row) => row.part)).toContain("schemaVersion");
    });
  }, 20_000);
});

const perspectiveDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.perspective-filter-recipe"),
  label: "realizes the perspective filter in the shipped recipe catalog",
  satisfies: ref("spec:consumers.review-perspectives"),
  component: componentAnchorId("component:protocol.reader"),
  role: "projection",
});
void perspectiveDocumentAnchor;
const perspectiveTestAnchor = specTest({
  id: testAnchorId("test:protocol.perspective-filter-recipe"),
  verifies: ref("spec:consumers.review-perspectives"),
});
void perspectiveTestAnchor;
const bundleDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.context-bundle-recipe"),
  label: "realizes the context bundle in the shipped recipe catalog",
  satisfies: ref("spec:consumers.context-bundle"),
  component: componentAnchorId("component:protocol.reader"),
  role: "projection",
});
void bundleDocumentAnchor;
const bundleTestAnchor = specTest({
  id: testAnchorId("test:protocol.context-bundle-recipe"),
  verifies: ref("spec:consumers.context-bundle"),
});
void bundleTestAnchor;

interface Perspective {
  pack: string;
  perspective: string;
  totals: { members: number; selected: number };
  diagnostics: { selector: string; problem: string }[];
  selected: {
    id: string;
    matchedOn: { selector: string; value: unknown; claim: string }[];
    blockingQuestions: { address: string | null; question: string }[];
  }[];
  notSelected: string[];
}
interface Bundle {
  scope: { pack?: string; subset?: boolean; members?: string[]; specs?: string[] };
  budget: number;
  used: number;
  tokenEstimate: { value: number; method: string };
  leftOut: string[];
  pack: { id: string; framing: string } | null;
  members: {
    id: string;
    narrative: string | null;
    sections: Record<string, unknown>;
    questions: {
      question: string;
      blocking: boolean;
      address: string | null;
      line: number;
      decider?: string;
      trigger?: string;
    }[];
    declarations: { spec: string; key: string; declaration: string }[];
    examples: { id: string; steps: unknown; enabled: boolean }[];
    footing: { type: string; id: string; claim: string }[];
  }[];
  boundary: Record<string, (string | { id: string; via: { type: string; members: string[] }[] })[]>;
}
interface BudgetExceeded {
  scope: Bundle["scope"];
  budget: number;
  budgetExceeded: true;
  protectedLength: number;
  leftOut: string[];
}
function addQuestions(root: string): void {
  edit(
    root,
    "b.sdp.md",
    "## Behavior",
    "### Open questions\n- [blocking #hold] A blocking question?\n  - decider: owner\n  - trigger: A runtime reader needs it.\n- [non-blocking #later] A later question?\n\n## Behavior",
  );
}

describe("iteration loop: perspective filter", () => {
  it("matches every declared selector, combines requirements, and keeps authored order unless prioritized", async () => {
    await withCorpus(async (root) => {
      addQuestions(root);
      const derived = extract({ root });
      const query = (select: Record<string, unknown>, order?: string[]) =>
        runRecipe<Perspective>(
          37,
          {
            pack: "pack:probe.review",
            perspective: { name: "probe", select, ...(order === undefined ? {} : { order }) },
          },
          derived,
        );
      const cases: [Record<string, unknown>, string[]][] = [
        [{}, ["a", "b", "model"]],
        [{ ids: ["spec:probe.a", "spec:probe.b"] }, ["a", "b"]],
        [{ idPrefixes: ["spec:probe.b"] }, ["b"]],
        [{ kinds: ["model"] }, ["model"]],
        [{ sections: ["model"] }, ["model"]],
        [{ designKeys: [{ key: "layer" }] }, ["b"]],
        [{ designKeys: [{ key: "layer", value: "domain" }] }, ["b"]],
        [{ questionKeys: ["hold"] }, ["b"]],
        [
          { relations: [{ type: "dependsOn", direction: "out", target: "spec:probe.outside" }] },
          ["a"],
        ],
        [{ kinds: ["behavior"], designKeys: [{ key: "layer" }] }, ["b"]],
        [{ ids: [] }, []],
        [{ kinds: ["example"] }, []],
        [{ designKeys: [{ key: "layer", value: "edge" }] }, []],
      ];
      for (const [select, expected] of cases) {
        const result = await query(select);
        expect(result.diagnostics).toEqual([]);
        expect(result.selected.map((row) => row.id)).toEqual(
          expected.map((id) => `spec:probe.${id}`),
        );
        expect(
          result.selected.flatMap((row) => row.matchedOn).every((row) => row.claim === "declared"),
        ).toBe(true);
      }
      expect(
        (await query({}, ["spec:probe.model", "spec:probe.a"])).selected.map((row) => row.id),
      ).toEqual(["spec:probe.model", "spec:probe.a", "spec:probe.b"]);
      const result = await query({ ids: ["spec:probe.b"] });
      expect(result.selected[0]?.blockingQuestions).toEqual([
        { address: "spec:probe.b#question.hold", question: "A blocking question?" },
      ]);
      expect(result.notSelected).toEqual(["spec:probe.a", "spec:probe.model"]);
      // Reading changes no content, including the member's non-blocking question.
      expect(derived.graph).toEqual(extract({ root }).graph);
      edit(root, "b.sdp.md", "relations: {}", "relations:\n  dependsOn: spec:probe.a");
      const incoming = await runRecipe<Perspective>(
        37,
        {
          pack: "pack:probe.review",
          perspective: {
            name: "incoming",
            select: { relations: [{ type: "dependsOn", direction: "in", target: "spec:probe.b" }] },
          },
        },
        extract({ root }),
      );
      expect(incoming.selected.map((row) => row.id)).toEqual(["spec:probe.a"]);
    });
  }, 20_000);

  it("matches layers and contexts only through named bindings and keeps anchored matches apart", async () => {
    await withCorpus(async (root) => {
      writeFileSync(
        join(root, "architecture.ts"),
        "/**\n * @sdpAnchor component:probe.domain\n * @sdpLayer domain\n * @sdpContext orders\n */\nexport const domain = 1;\n/**\n * @sdpAnchor impl:probe.b\n * @sdpReferences spec:probe.b\n * @sdpComponent component:probe.domain\n */\nexport const b = 1;\n",
      );
      const derived = extract({ root });
      const query = (bindings: unknown) =>
        runRecipe<Perspective>(
          37,
          { pack: "pack:probe.review", perspective: { name: "runtime", select: { bindings } } },
          derived,
        );
      expect(
        (await query({ via: ["references"], layers: ["domain"], contexts: ["orders"] })).selected,
      ).toEqual([
        expect.objectContaining({
          id: "spec:probe.b",
          matchedOn: [expect.objectContaining({ selector: "bindings", claim: "anchored" })],
        }),
      ]);
      expect((await query({ via: ["satisfies"], layers: ["domain"] })).selected).toEqual([]);
      expect((await query({ via: ["references"], contexts: [] })).selected).toEqual([]);
      expect((await query({ via: [] })).selected).toEqual([]);
      expect((await query({ via: ["references"] })).selected.map((row) => row.id)).toEqual([
        "spec:probe.b",
      ]);
      const declared = await runRecipe<Perspective>(
        37,
        {
          pack: "pack:probe.review",
          perspective: {
            name: "declared",
            select: {
              designKeys: [{ key: "layer", value: "domain" }],
              bindings: { via: ["references"] },
            },
          },
        },
        derived,
      );
      expect(declared.selected[0]?.matchedOn.map((row) => row.claim)).toEqual([
        "declared",
        "anchored",
      ]);
    });
  }, 20_000);

  it("reports malformed and unsupported selectors while applying understood ones", async () => {
    await withCorpus(async (_root, derived) => {
      const result = await runRecipe<Perspective>(
        37,
        {
          pack: "pack:probe.review",
          perspective: {
            name: "bad",
            order: 7,
            select: {
              prose: "domain",
              kinds: ["model"],
              ids: 7,
              designKeys: [null],
              relations: [{ type: "uses", direction: "out" }],
              bindings: { layers: ["domain"] },
            },
          },
        },
        derived,
      );
      expect(result.selected.map((row) => row.id)).toEqual(["spec:probe.model"]);
      expect(result.diagnostics.map((row) => row.selector)).toEqual(
        expect.arrayContaining([
          "prose",
          "ids",
          "designKeys[0]",
          "relations[0]",
          "bindings.via",
          "order",
        ]),
      );
      const missing = await runRecipe<Perspective>(37, {}, derived);
      expect(missing.selected).toEqual([]);
      expect(missing.diagnostics.length).toBeGreaterThan(0);
      for (const select of [
        { sections: "model" },
        { bindings: { via: ["uses"], layers: 1, contexts: null, unknown: [] } },
        { relations: [{ type: "dependsOn", direction: "sideways" }] },
      ]) {
        expect(
          (
            await runRecipe<Perspective>(
              37,
              { pack: "pack:probe.review", perspective: { name: "bad", select } },
              derived,
            )
          ).diagnostics.length,
        ).toBeGreaterThan(0);
      }
    });
  }, 20_000);
});

function prepareBundleCorpus(root: string): void {
  const long = "Reading material ".repeat(100);
  edit(root, "a.sdp.md", "Narrative for a.", `Narrative for a. ${long}`);
  edit(root, "outside.sdp.md", "# outside", `# outside ${long}`);
  edit(root, "a.sdp.md", "Beta text", `Beta text ${long}`);
  edit(
    root,
    "b.sdp.md",
    "## Behavior",
    `### Open questions\n- [blocking #hold] Protected blocking question?\n  - decider: delegated\n  - provisional: Keep the current design.\n  - trigger: A consumer needs the new shape.\n- [non-blocking #later] Later question? ${long}\n\n## Behavior`,
  );
  writeFileSync(
    join(root, "example.sdp.md"),
    specDocument(
      "example",
      "",
      "\n  refines: spec:probe.a\n  verifies: spec:probe.a",
      "example",
    ).replace(
      "- outcome: Read example in context.",
      `- outcome: Read example in context.\n\n\`\`\`gwt\nGiven Step text secret ${long}\nWhen an example is read\nThen its result is visible\n\`\`\``,
    ),
  );
  writeFileSync(
    join(root, "example-test.ts"),
    "/**\n * @sdpAnchor test:probe.example\n * @sdpVerifies spec:probe.example\n */\nexport const test = 1;\n",
  );
}

describe("iteration loop: context bundle", () => {
  it("composes both scopes, dependency footing, declarations, example bindings and a perspective subset", async () => {
    await withCorpus(async (root) => {
      prepareBundleCorpus(root);
      const derived = extract({ root });
      const result = await runRecipe<Bundle>(36, { pack: "pack:probe.review" }, derived);
      expect(result.leftOut).toEqual([]);
      expect(result.used).toBe(JSON.stringify(result).length);
      expect(result.tokenEstimate).toEqual({
        value: Math.ceil(result.used / 4),
        method: "UTF-16 code units divided by four, an estimate",
      });
      expect(result.members.map((member) => member.id)).toEqual([
        "spec:probe.a",
        "spec:probe.b",
        "spec:probe.model",
      ]);
      expect(result.members[0]?.footing).toEqual([
        expect.objectContaining({ id: "spec:probe.outside", type: "dependsOn", claim: "declared" }),
      ]);
      expect(result.members[0]?.declarations).toEqual([
        { spec: "spec:probe.a", key: "alpha", declaration: "Alpha" },
      ]);
      expect(result.members[0]?.examples).toEqual([
        expect.objectContaining({ id: "spec:probe.example", enabled: true }),
      ]);
      expect(typeof result.members[1]?.questions[0]?.line).toBe("number");
      expect(result.members[1]?.questions[0]).toEqual(
        expect.objectContaining({
          address: "spec:probe.b#question.hold",
          blocking: true,
          decider: "delegated",
          trigger: "A consumer needs the new shape.",
        }),
      );
      const perspective = await runRecipe<Perspective>(
        37,
        {
          pack: "pack:probe.review",
          perspective: {
            name: "small",
            select: { ids: ["spec:probe.b", "spec:probe.a"] },
            order: ["spec:probe.b"],
          },
        },
        derived,
      );
      const subset = await runRecipe<Bundle>(
        36,
        { pack: "pack:probe.review", members: perspective.selected.map((row) => row.id) },
        derived,
      );
      expect(subset.scope.subset).toBe(true);
      expect(subset.members.map((row) => row.id)).toEqual(["spec:probe.b", "spec:probe.a"]);
      expect(subset.boundary).toEqual(result.boundary);
      expect(subset.pack).toEqual(result.pack);
      const list = await runRecipe<Bundle>(
        36,
        { specs: ["spec:probe.b", "spec:probe.a"] },
        derived,
      );
      expect(list.pack).toBeNull();
      expect(list.members.map((row) => row.id)).toEqual(["spec:probe.b", "spec:probe.a"]);
      expect(list.boundary.restsOn).toEqual([
        expect.objectContaining({ id: "spec:probe.outside" }),
      ]);
      expect(list.boundary.verifiedBy).toEqual([
        expect.objectContaining({ id: "spec:probe.example" }),
      ]);
      expect(await runRecipe<Bundle>(36, { pack: "pack:probe.review" }, derived)).toEqual(result);
    });
  }, 20_000);

  it("takes all five cuts in fixed order and counts the complete returned value including Unicode", async () => {
    await withCorpus(async (root) => {
      prepareBundleCorpus(root);
      edit(root, "b.sdp.md", "# b", "# b 🐈");
      const derived = extract({ root });
      let prior = await runRecipe<Bundle>(
        36,
        { pack: "pack:probe.review", budget: 100000 },
        derived,
      );
      const full = prior;
      expect(Buffer.byteLength(JSON.stringify(full), "utf8")).toBeGreaterThan(full.used);
      const results: Bundle[] = [];
      for (let cut = 1; cut <= 5; cut += 1) {
        const budget = prior.used - 20;
        const result = await runRecipe<Bundle>(36, { pack: "pack:probe.review", budget }, derived);
        expect(result.leftOut).toHaveLength(cut);
        expect(result.used).toBe(JSON.stringify(result).length);
        expect(result.used).toBeLessThanOrEqual(budget);
        expect(result.members.map((row) => row.id)).toEqual(full.members.map((row) => row.id));
        expect(result.members[0]?.declarations).toEqual(full.members[0]?.declarations);
        expect(typeof result.members[1]?.questions[0]?.line).toBe("number");
        expect(result.members[1]?.questions[0]).toEqual(full.members[1]?.questions[0]);
        results.push(result);
        prior = result;
      }
      expect(results[0]?.boundary.restsOn).toEqual(["spec:probe.outside"]);
      expect(results[1]?.members[0]?.narrative).toBeNull();
      expect(JSON.stringify(results[2])).not.toContain("Step text secret");
      expect(JSON.stringify(results[3])).not.toContain("Later question?");
      expect(JSON.stringify(results[3])).toContain("spec:probe.b#question.later");
      expect(JSON.stringify(results[4]?.members[0]?.sections)).not.toContain("Beta text");
      expect(JSON.stringify(results[4]?.members[0]?.sections)).toContain(
        "spec:probe.a#design.beta",
      );
      expect(JSON.stringify(results[4]?.members[0]?.sections)).toContain("`Alpha` declaration");
      expect(JSON.stringify(results[4]?.members[1]?.sections)).toContain(
        "Protected blocking question?",
      );
      const equal = await runRecipe<Bundle>(
        36,
        { pack: "pack:probe.review", budget: full.used },
        derived,
      );
      expect(equal.leftOut).toEqual([]);
      expect(equal.used).toBe(JSON.stringify(equal).length);
      expect(equal.used).toBeLessThanOrEqual(full.used);
      const exceeded = await runRecipe<BudgetExceeded>(
        36,
        { pack: "pack:probe.review", budget: 1 },
        derived,
      );
      expect(exceeded).toEqual({
        scope: full.scope,
        budget: 1,
        budgetExceeded: true,
        protectedLength: exceeded.protectedLength,
        leftOut: prior.leftOut,
      });
      expect(exceeded.protectedLength).toBeGreaterThan(1);
      // Changing the budget's digits changes the measured minimum, so re-check at that unit.
      const minimum = await runRecipe<Bundle>(
        36,
        { pack: "pack:probe.review", budget: prior.used },
        derived,
      );
      expect(minimum.used).toBeLessThanOrEqual(minimum.budget);
    });
  }, 20_000);

  it("reports invalid, missing, doubled and unknown scopes without a partial bundle", async () => {
    await withCorpus(async (_root, derived) => {
      for (const params of [
        {},
        { pack: "pack:probe.review", specs: [] },
        { pack: "pack:absent" },
        { specs: ["spec:absent"] },
        { specs: "bad" },
        { specs: [], members: [] },
        { pack: "pack:probe.review", members: ["spec:absent"] },
        { pack: "pack:probe.review", members: ["spec:probe.a", "spec:probe.a"] },
        { specs: [], budget: -1 },
        { specs: [], budget: 0.5 },
        { specs: [], budget: "100" },
      ]) {
        const result = await runRecipe<{ diagnostics: unknown[] }>(36, params, derived);
        expect(Object.keys(result)).toEqual(["diagnostics"]);
        expect(result.diagnostics.length).toBeGreaterThan(0);
      }
      expect(
        (await runRecipe<Bundle>(36, { pack: "pack:probe.review", members: [] }, derived)).members,
      ).toEqual([]);
      expect(
        (await runRecipe<BudgetExceeded>(36, { specs: [], budget: 0 }, derived)).budgetExceeded,
      ).toBe(true);
    });
  }, 20_000);
});

const proposalDocumentAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.proposal-schema-and-recipe"),
  label: "realizes the shipped proposal schema and proposal check in the recipe catalog",
  satisfies: ref("spec:consumers.intent-composition.proposal"),
  component: componentAnchorId("component:protocol.reader"),
  role: "contract",
});
void proposalDocumentAnchor;
const proposalTestAnchor = specTest({
  id: testAnchorId("test:protocol.proposal-schema-and-recipe"),
  verifies: ref("spec:consumers.intent-composition.proposal"),
});
void proposalTestAnchor;
interface ProposalCheck {
  schemaProblems: { path: string; problem: string }[];
  diagnostics?: { part: string }[];
  base: string;
  totals: { changes: number; moved: number; unresolved: number };
  changes: {
    index: number;
    scope: {
      ref: string;
      resolvesAtHead: boolean;
      resolvesAtBase: boolean;
      moved?: boolean;
      comparable?: boolean;
      reason?: string;
    }[];
    moved: boolean | null;
    relationTarget: { ref: string; resolvesAtHead: boolean } | null;
  }[];
}
const sampleChange = {
  scope: ["spec:probe.a#design.alpha"],
  request: "Replace the declaration text.",
};
const sampleProposal = {
  schema: "sdp-proposal/1",
  base: "HEAD~1",
  reason: "The declaration needs review.",
  changes: [sampleChange],
};
// ESLint's dependency validates the published Draft 7 schema independently of the recipe's checks.
const Ajv = createRequire(import.meta.url)("ajv") as new () => {
  compile: (schema: unknown) => (value: unknown) => boolean;
};
const proposalSchema: unknown = JSON.parse(
  readFileSync(join(repoRoot, "schemas/sdp-proposal-1.schema.json"), "utf8"),
);
const acceptsSchema = new Ajv().compile(proposalSchema);

describe("iteration loop: proposal schema and check", () => {
  it("holds the schema and recipe to the same accepted and refused documents", async () => {
    await withCorpus(async (_root, derived) => {
      const accepted = [
        sampleProposal,
        {
          ...sampleProposal,
          changes: [
            {
              ...sampleChange,
              scope: [
                "spec:probe.a",
                "spec:probe.a#rule.first",
                "spec:probe.b#question.later",
                "spec:probe.a#ui.panel",
              ],
              text: "",
              replaces: "spec:probe.a#design.alpha",
              reason: "One line.",
            },
          ],
        },
        { ...sampleProposal, changes: [{ ...sampleChange, follows: "spec:probe.a#design.alpha" }] },
        ...["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"].flatMap(
          (type) =>
            ["declare", "remove"].map((action) => ({
              ...sampleProposal,
              changes: [
                {
                  ...sampleChange,
                  relation: { action, from: "spec:probe.a", type, target: "spec:probe.outside" },
                },
              ],
            })),
        ),
        {
          ...sampleProposal,
          changes: [{ ...sampleChange, scope: ["spec:Probe.1Ab-c#rule.someKey"] }],
        },
      ];
      const refused = [
        null,
        [],
        1,
        "proposal",
        {},
        ...["status", "date", "approval", "verdict", "proposer", "extra"].map((key) => ({
          ...sampleProposal,
          [key]: "refused",
        })),
        { ...sampleProposal, schema: "sdp-proposal/2" },
        { ...sampleProposal, base: "" },
        { ...sampleProposal, base: 1 },
        { ...sampleProposal, reason: "" },
        { ...sampleProposal, reason: null },
        ...["\n", "\r", "\u0085", "\u2028", "\u2029"].map((separator) => ({
          ...sampleProposal,
          reason: `two${separator}lines`,
        })),
        { ...sampleProposal, changes: [] },
        { ...sampleProposal, changes: {} },
        { ...sampleProposal, changes: [null] },
        ...[
          {},
          { ...sampleChange, scope: [] },
          { ...sampleChange, scope: "spec:probe.a" },
          { ...sampleChange, request: "" },
          { ...sampleChange, text: 1 },
          { ...sampleChange, reason: "two\nlines" },
          { ...sampleChange, replaces: "spec:probe.a" },
          { ...sampleChange, follows: 1 },
          {
            ...sampleChange,
            replaces: "spec:probe.a#design.alpha",
            follows: "spec:probe.a#design.beta",
          },
          { ...sampleChange, status: "done" },
          { ...sampleChange, relation: null },
          {
            ...sampleChange,
            relation: { action: "declare", from: "spec:probe.a", type: "dependsOn" },
          },
          {
            ...sampleChange,
            relation: {
              action: "apply",
              from: "spec:probe.a",
              type: "dependsOn",
              target: "spec:probe.b",
            },
          },
          {
            ...sampleChange,
            relation: {
              action: "declare",
              from: "spec:probe.a#design.alpha",
              type: "dependsOn",
              target: "spec:probe.b",
            },
          },
          {
            ...sampleChange,
            relation: {
              action: "declare",
              from: "spec:probe.a",
              type: "uses",
              target: "spec:probe.b",
            },
          },
          {
            ...sampleChange,
            relation: {
              action: "declare",
              from: "spec:probe.a",
              type: "dependsOn",
              target: "doc:external",
            },
          },
          {
            ...sampleChange,
            relation: {
              action: "declare",
              from: "spec:probe.a",
              type: "dependsOn",
              target: "spec:probe.b",
              reason: "Extra field.",
            },
          },
        ].map((change) => ({ ...sampleProposal, changes: [change] })),
        ...[
          "pack:probe.review",
          "spec:a_b",
          "spec:a..b",
          "spec:a#design.Upper",
          "spec:a#rule.key\n",
          "spec:a#term.Order",
          3,
        ].map((ref) => ({ ...sampleProposal, changes: [{ ...sampleChange, scope: [ref] }] })),
      ];
      for (const [samples, expectedAcceptance] of [
        [accepted, true],
        [refused, false],
      ] as const) {
        for (const proposal of samples) {
          expect(acceptsSchema(proposal), JSON.stringify(proposal)).toBe(expectedAcceptance);
          const result = await runRecipe<ProposalCheck>(
            38,
            { proposal, base: derived.graph },
            derived,
          );
          expect(result.schemaProblems.length === 0, JSON.stringify(proposal)).toBe(
            expectedAcceptance,
          );
          if (!expectedAcceptance) expect(result.changes).toEqual([]);
        }
      }
      const manifest = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
        files: string[];
      };
      expect(manifest.files).toContain("schemas/sdp-proposal-1.schema.json");
    });
  }, 20_000);

  it("checks the complete scope union, resolves both graphs, and reports each change independently", async () => {
    await withCorpus(async (root) => {
      addQuestions(root);
      const base = extract({ root });
      edit(root, "a.sdp.md", "`Alpha` declaration", "`Changed` declaration");
      edit(root, "a.sdp.md", "Panel text", "Changed panel text");
      edit(root, "b.sdp.md", "A blocking question?", "Changed blocking question?");
      const head = extract({ root });
      const proposal = {
        ...sampleProposal,
        changes: [
          {
            scope: ["spec:probe.a#design.beta", "spec:probe.a#design.beta"],
            request: "Edit beta after alpha.",
            follows: "spec:probe.a#design.alpha",
          },
          { scope: ["spec:probe.a#design.beta"], request: "Edit stable beta." },
          {
            scope: ["spec:probe.a#design.beta"],
            request: "Replace panel.",
            replaces: "spec:probe.a#ui.panel",
          },
          {
            scope: ["spec:probe.a#design.beta"],
            request: "Declare a relation.",
            relation: {
              action: "declare",
              from: "spec:probe.b",
              type: "dependsOn",
              target: "spec:missing",
            },
          },
          {
            scope: [
              "spec:probe.b#question.hold",
              "spec:probe.a#rule.first",
              "spec:probe.a#design.description",
              "spec:missing#design.key",
            ],
            request: "Resolve scopes.",
          },
        ],
      };
      const result = await runRecipe<ProposalCheck>(38, { proposal, base: base.graph }, head);
      expect(result.schemaProblems).toEqual([]);
      expect(result.base).toBe("HEAD~1");
      expect(result.totals).toEqual({ changes: 5, moved: 4, unresolved: 2 });
      expect(result.changes[0]?.scope.map((row) => row.ref)).toEqual([
        "spec:probe.a#design.beta",
        "spec:probe.a#design.alpha",
      ]);
      expect(result.changes[1]?.moved).toBe(false);
      expect(result.changes[3]?.scope.map((row) => row.ref)).toEqual([
        "spec:probe.a#design.beta",
        "spec:probe.b",
      ]);
      expect(result.changes[3]?.relationTarget).toEqual({
        ref: "spec:missing",
        resolvesAtHead: false,
      });
      expect(result.changes[4]?.scope).toEqual(
        expect.arrayContaining([
          {
            ref: "spec:probe.b#question.hold",
            resolvesAtHead: true,
            resolvesAtBase: true,
            moved: true,
          },
          {
            ref: "spec:probe.a#rule.first",
            resolvesAtHead: true,
            resolvesAtBase: true,
            moved: false,
          },
          {
            ref: "spec:probe.a#design.description",
            resolvesAtHead: false,
            resolvesAtBase: false,
            moved: false,
          },
          {
            ref: "spec:missing#design.key",
            resolvesAtHead: false,
            resolvesAtBase: false,
            moved: false,
          },
        ]),
      );
    });
  }, 20_000);

  it("agrees with recipe 35 on added, removed and changed entry values and on whole-Spec changes", async () => {
    await withCorpus(async (root, base) => {
      edit(
        root,
        "a.sdp.md",
        "- alpha: `Alpha` declaration\n- beta: Beta text",
        "- beta: Beta text\n- alpha: `Alpha` declaration\n- gamma: New text",
      );
      edit(root, "a.sdp.md", "First rule.", "Changed first rule.");
      edit(root, "a.sdp.md", "## UI\n- panel: Panel text", "");
      rmSync(join(root, "b.sdp.md"));
      writeFileSync(join(root, "new.sdp.md"), specDocument("new", "## Design\n- entry: New entry"));
      const head = extract({ root });
      const diff = await runRecipe<Diff>(35, { base: base.graph, detail: true }, head);
      const refs = [
        "spec:probe.a",
        "spec:probe.a#design.alpha",
        "spec:probe.a#design.beta",
        "spec:probe.a#design.gamma",
        "spec:probe.a#rule.first",
        "spec:probe.a#ui.panel",
        "spec:probe.b",
        "spec:probe.new",
        "spec:probe.new#design.entry",
        "spec:unknown",
      ];
      const result = await runRecipe<ProposalCheck>(
        38,
        {
          base: base.graph,
          proposal: {
            ...sampleProposal,
            changes: refs.map((ref) => ({ scope: [ref], request: "Review this scope." })),
          },
        },
        head,
      );
      for (const change of result.changes) {
        const row = change.scope[0];
        if (!row) throw new Error("missing scope");
        const [id, part] = row.ref.split("#");
        const changed = diff.specs.changed.find((spec) => spec.id === id);
        const expected =
          diff.specs.added.includes(id ?? "") ||
          diff.specs.removed.includes(id ?? "") ||
          (part === undefined
            ? changed !== undefined
            : changed?.parts.some((entry) => entry.part === part && entry.change !== "moved") ===
              true);
        expect(row.moved, row.ref).toBe(expected);
      }
      expect(result.changes[1]?.moved).toBe(false);
      expect(result.changes[4]?.moved).toBe(true);
      expect(result.changes[5]?.scope[0]?.resolvesAtHead).toBe(false);
      expect(result.changes[8]?.scope[0]?.resolvesAtBase).toBe(false);
    });
  }, 20_000);

  it("excludes anchor-only changes and requires the caller's base graph", async () => {
    await withCorpus(async (root, base) => {
      edit(root, "anchors.ts", "@sdpSatisfies spec:probe.a", "@sdpReferences spec:probe.a");
      const head = extract({ root });
      const result = await runRecipe<ProposalCheck>(
        38,
        {
          base: base.graph,
          proposal: {
            ...sampleProposal,
            changes: [
              {
                scope: ["spec:probe.a"],
                request: "Read the Spec again.",
                relation: {
                  action: "remove",
                  from: "spec:probe.a",
                  type: "dependsOn",
                  target: "spec:probe.outside",
                },
              },
            ],
          },
        },
        head,
      );
      expect(result.totals).toEqual({ changes: 1, moved: 0, unresolved: 0 });
      expect(result.changes[0]?.relationTarget).toBeNull();
      expect(
        (await runRecipe<ProposalCheck>(38, { proposal: sampleProposal }, head)).schemaProblems,
      ).toEqual([
        { path: "params.base", problem: "Supply the graph written at the proposal base commit." },
      ]);
      expect((await runRecipe<ProposalCheck>(38, {}, head)).changes).toEqual([]);
    });
  }, 20_000);
});

describe("iteration loop: comparison and budget edges", () => {
  it("compares interleaved keyed rules and flows in their authored order and reports verifier changes apart", async () => {
    await withCorpus(async (root, base) => {
      edit(
        root,
        "a.sdp.md",
        "- rule: [#first] First rule.\n- flow: [#last] Last flow.",
        "- flow: [#last] Last flow.\n- rule: [#first] First rule.",
      );
      writeFileSync(
        join(root, "test.ts"),
        "/**\n * @sdpAnchor test:probe.a\n * @sdpVerifies spec:probe.a\n */\nexport const test = 1;\n",
      );
      const head = extract({ root });
      const result = await runRecipe<Diff & { bindings: { verifiers: { added: string[] } }[] }>(
        35,
        { base: base.graph, detail: true },
        head,
      );
      expect(result.specs.changed[0]?.parts).toEqual([
        { part: "rule.first", change: "moved", from: "First rule.", to: "First rule." },
        { part: "rule.last", change: "moved", from: "Last flow.", to: "Last flow." },
      ]);
      expect(result.bindings[0]?.verifiers.added).toEqual(["test:probe.a"]);
      expect(result.bindings[0]?.deliveryFacts.added).toEqual(["has-verifier"]);
      rmSync(join(root, "review.pack.sdp.md"));
      const removed = await runRecipe<Diff>(35, { base: base.graph }, extract({ root }));
      expect(removed.packs).toEqual([
        {
          id: "pack:probe.review",
          change: "removed",
          membersAdded: [],
          membersRemoved: ["spec:probe.a", "spec:probe.b", "spec:probe.model"],
          reordered: false,
        },
      ]);
    });
  }, 20_000);

  it("cuts example text in both member sections and related examples and preserves locations after the fifth cut", async () => {
    await withCorpus(async (root) => {
      prepareBundleCorpus(root);
      const derived = extract({ root });
      const specs = ["spec:probe.a", "spec:probe.b", "spec:probe.example"];
      let result = await runRecipe<Bundle>(36, { specs, budget: 100000 }, derived);
      expect(JSON.stringify(result.members[0]?.examples)).toContain("Step text secret");
      expect(JSON.stringify(result.members[2]?.sections)).toContain("Step text secret");
      for (let cut = 1; cut <= 5; cut += 1) {
        result = await runRecipe<Bundle>(36, { specs, budget: result.used - 20 }, derived);
        expect(result.leftOut).toHaveLength(cut);
        if (cut >= 3) expect(JSON.stringify(result)).not.toContain("Step text secret");
        if (cut >= 4) expect(JSON.stringify(result)).not.toContain("Later question?");
      }
      expect(JSON.stringify(result.members[0]?.sections)).toContain("spec:probe.a#rule.first");
      expect(JSON.stringify(result.members[0]?.sections)).toContain('"line":null');
      expect(JSON.stringify(result.members[0]?.sections)).toContain('"path":"intent.outcome"');
      expect(JSON.stringify(result.members[1]?.sections)).toContain("Protected blocking question?");
      expect(result.used).toBe(JSON.stringify(result).length);
    });
  }, 20_000);

  it("reads the base graph and proposal from named JSON files through the real parameter seam", async () => {
    await withCorpus(async (root, derived) => {
      const basePath = join(root, "base.json");
      const proposalPath = join(root, "proposal.json");
      writeFileSync(basePath, JSON.stringify(derived.graph));
      writeFileSync(proposalPath, JSON.stringify(sampleProposal));
      const capture = createCaptureOutput();
      const code = await runSdpCli(
        [
          "q",
          bodyOf(38),
          "--root",
          root,
          "--params",
          `base=@${basePath}`,
          "--params",
          `proposal=@${proposalPath}`,
          "--json",
        ],
        capture.output,
        { query: { extract: () => derived, isStdinTty: () => true } },
      );
      expect({ code, stderr: capture.readStderr() }).toEqual({ code: 0, stderr: "" });
      const result = JSON.parse(capture.readStdout()) as ProposalCheck;
      expect(result.totals).toEqual({ changes: 1, moved: 0, unresolved: 0 });
      expect(result.changes[0]?.scope).toEqual([
        {
          ref: "spec:probe.a#design.alpha",
          resolvesAtHead: true,
          resolvesAtBase: true,
          moved: false,
        },
      ]);
    });
  }, 20_000);
});

describe("iteration loop: example enablement", () => {
  it("requires a test bound directly to an example before the bundle names it enabled", async () => {
    await withCorpus(async (root) => {
      prepareBundleCorpus(root);
      rmSync(join(root, "example-test.ts"));
      writeFileSync(
        join(root, "nested.sdp.md"),
        specDocument(
          "nested",
          "",
          "\n  refines: spec:probe.example\n  verifies: spec:probe.example",
          "example",
        ),
      );
      writeFileSync(
        join(root, "nested-test.ts"),
        "/**\n * @sdpAnchor test:probe.nested\n * @sdpVerifies spec:probe.nested\n */\nexport const test = 1;\n",
      );
      const derived = extract({ root });
      const example = derived.graph.nodes.find((node) => node.id === "spec:probe.example");
      expect(
        example?.nodeType === "Primitive" && example.deliveryFacts?.includes("has-verifier"),
      ).toBe(true);
      const bundle = await runRecipe<Bundle>(36, { specs: ["spec:probe.a"] }, derived);
      expect(bundle.members[0]?.examples[0]?.enabled).toBe(false);
    });
  }, 20_000);
});

describe("iteration loop: anonymous collection order", () => {
  it("compares whole mixed collections when an unkeyed entry moves around a keyed entry", async () => {
    await withCorpus(async (root) => {
      edit(
        root,
        "b.sdp.md",
        "## Behavior",
        "### Open questions\n- [non-blocking #one] Keyed question?\n- [non-blocking] Anonymous question?\n\n## Behavior",
      );
      const base = extract({ root });
      edit(
        root,
        "a.sdp.md",
        "- rule: [#first] First rule.\n- flow: [#last] Last flow.\n- rule: An unkeyed rule.",
        "- rule: An unkeyed rule.\n- rule: [#first] First rule.\n- flow: [#last] Last flow.",
      );
      edit(
        root,
        "b.sdp.md",
        "- [non-blocking #one] Keyed question?\n- [non-blocking] Anonymous question?",
        "- [non-blocking] Anonymous question?\n- [non-blocking #one] Keyed question?",
      );
      const head = extract({ root });
      const diff = await runRecipe<Diff>(35, { base: base.graph, detail: true }, head);
      expect(
        diff.specs.changed.map((row) => ({
          id: row.id,
          parts: row.parts.map((part) => part.part),
        })),
      ).toEqual([
        { id: "spec:probe.a", parts: ["behavior.rules"] },
        { id: "spec:probe.b", parts: ["intent.openQuestions"] },
      ]);
      const check = await runRecipe<ProposalCheck>(
        38,
        {
          base: base.graph,
          proposal: {
            ...sampleProposal,
            changes: [
              {
                scope: ["spec:probe.a", "spec:probe.b"],
                request: "Read the anonymous order changes.",
              },
              {
                scope: ["spec:probe.a#rule.first", "spec:probe.b#question.one"],
                request: "Read the unchanged keyed values.",
              },
            ],
          },
        },
        head,
      );
      expect(check.changes.map((row) => row.moved)).toEqual([true, false]);
    });
  }, 20_000);
});

describe("iteration loop: protected entry addresses", () => {
  it("keeps addresses in each place when narrative, example, question and section text are cut", async () => {
    await withCorpus(async (root) => {
      prepareBundleCorpus(root);
      edit(root, "a.sdp.md", "Narrative for a.", "Narrative for a. spec:probe.a#rule.first");
      edit(root, "a.sdp.md", "Beta text", "Beta text spec:probe.a#ui.panel");
      edit(root, "b.sdp.md", "Later question?", "Later question? spec:probe.a#design.beta");
      edit(
        root,
        "b.sdp.md",
        "\n\n## Behavior",
        "\n  - links: spec:probe.a#rule.last\n\n## Behavior",
      );
      edit(root, "example.sdp.md", "Step text secret", "Step text secret spec:probe.a#rule.first");
      const derived = extract({ root });
      let result = await runRecipe<Bundle>(
        36,
        { specs: ["spec:probe.a", "spec:probe.b", "spec:probe.example"], budget: 100000 },
        derived,
      );
      for (let cut = 1; cut <= 5; cut += 1) {
        result = await runRecipe<Bundle>(
          36,
          {
            specs: ["spec:probe.a", "spec:probe.b", "spec:probe.example"],
            budget: result.used - 20,
          },
          derived,
        );
        expect(result.leftOut).toHaveLength(cut);
      }
      expect(result.members[0]?.narrative).toBe("spec:probe.a#rule.first");
      expect(JSON.stringify(result.members[0]?.examples)).toContain("spec:probe.a#rule.first");
      expect(JSON.stringify(result.members[2]?.sections)).toContain("spec:probe.a#rule.first");
      expect(JSON.stringify(result.members[1]?.questions)).toContain("spec:probe.b#question.later");
      expect(JSON.stringify(result.members[1]?.questions)).toContain("spec:probe.a#design.beta");
      expect(JSON.stringify(result.members[1]?.questions)).toContain("spec:probe.a#rule.last");
      expect(JSON.stringify(result.members[1]?.sections)).toContain("spec:probe.b#question.later");
      expect(JSON.stringify(result.members[0]?.sections)).toContain("spec:probe.a#design.beta");
      expect(JSON.stringify(result.members[0]?.sections)).toContain("spec:probe.a#ui.panel");
      expect(result.used).toBe(JSON.stringify(result).length);
    });
  }, 20_000);
});

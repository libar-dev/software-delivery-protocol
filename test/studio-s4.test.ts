import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
  chmodSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { schemaVersion } from "../src/graph/schema.js";
import { runHeader, runRows } from "../src/projections/studio/pages/run-rows.js";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { evaluateStudioRecipe } from "../src/projections/studio/recipes.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "./helpers/studio-render.js";
import { runSdpCli } from "../src/cli/sdp.js";
import * as extraction from "../src/extract/index.js";

const roots: string[] = [];
afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "sdp-s4-"));
  roots.push(root);
  mkdirSync(join(root, "test"));
  writeFileSync(
    join(root, "page.sdp.md"),
    `---\nid: spec:probe.page\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Page\n\n## Intent\n- outcome: Read a page.\n\n## Behavior\n- rule: Render it.\n`,
  );
  writeFileSync(
    join(root, "test/page.test.ts"),
    "/**\n * @sdpAnchor test:probe.page\n * @sdpVerifies spec:probe.page\n */\nexport const test=1;\n",
  );
  writeFileSync(
    join(root, "probe.pack.sdp.md"),
    "---\nid: pack:probe\nspecs: [spec:probe.page]\n---\n# Probe\n",
  );
  return root;
}
function report(
  paths = ["/home/runner/repo/test/page.test.ts", "test/page.test.ts", "test/page.test.ts"],
) {
  return {
    reportFormat: "CTRF",
    specVersion: "0.0.0",
    results: {
      tool: { name: "vitest", version: "3.2.4" },
      summary: {
        tests: paths.length,
        passed: 2,
        failed: 1,
        skipped: 0,
        pending: 0,
        other: 0,
        start: 1000,
        stop: 2000,
      },
      environment: { commit: "abc", buildName: "CI", buildNumber: 7, branchName: "lane" },
      tests: paths.map((filePath, i) => ({
        name: `test ${i}`,
        status: i === 2 ? "failed" : "passed",
        duration: i,
        filePath,
        suite: ["suite", "nested"],
      })),
    },
  };
}
function snapshot(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else result[relative(root, path)] = readFileSync(path, "utf8");
    }
  };
  walk(root);
  return result;
}
const cli = (args: string[], out: ReturnType<typeof output>) =>
  runSdpCli(args, out, {
    studioAssets: {
      script: join(process.cwd(), "dist/studio/studio.js"),
      stylesheet: join(process.cwd(), "dist/studio/studio.css"),
    },
  });
const output = () => {
  let stdout = "",
    stderr = "";
  return {
    stdout: {
      write: (s: string) => {
        stdout += s;
      },
    },
    stderr: {
      write: (s: string) => {
        stderr += s;
      },
    },
    text: () => ({ stdout, stderr }),
  };
};
it("recipe 45 joins normalized paths, preserves records and graph facts, and diagnoses other inputs", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  const before = JSON.stringify(reader.graph);
  const value = await evaluateStudioRecipe(reader, 45, {
    runs: [report(["C:\\repo\\test\\page.test.ts", "./test/other.test.ts", ""]), {}],
    commit: "abc",
  });
  expect(value).toMatchObject({
    inputs: [{ index: 0, tool: "vitest", build: "CI 7", sameCommit: true }],
    totals: { inputs: 1, tests: 3, joined: 1, unjoined: 2, files: 1, specs: 1 },
    files: [
      {
        file: "test/page.test.ts",
        specs: ["spec:probe.page"],
        results: [{ suite: "suite > nested" }],
      },
    ],
    unjoined: [{ reason: "noTestAnchor" }, { reason: "noFilePath" }],
    diagnostics: [{ input: 1 }],
  });
  expect(JSON.stringify(reader.graph)).toBe(before);
  for (const runs of [
    undefined,
    {},
    { ...report(), reportFormat: "other" },
    { ...report(), specVersion: undefined },
  ])
    expect(await evaluateStudioRecipe(reader, 45, { runs })).toMatchObject({
      diagnostics: [{ input: runs === undefined ? null : 0, problem: expect.any(String) }],
    });
});
it("renders external run evidence with result rows, metadata, diagnostics and conditional navigation", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  const pages = renderStudio(await createStudioData(reader, undefined, { runs: [report(), {}] }));
  const runs = pages.find((p) => p.path === "runs.html")?.content ?? "";
  expect(runs).toContain("Run 1: external run evidence from vitest 3.2.4");
  expect(runs).toContain("1970-01-01T00:00:01.000Z");
  expect(runs).toContain("2 passed");
  expect(runs.match(/data-run-result/g)).toHaveLength(3);
  expect(runs).toContain("Input 2");
  expect(pages.find((p) => p.path === "tests.html")?.content).toContain(
    "external run evidence: 2 passed, 1 failed, 0 skipped, 0 pending, 0 other",
  );
  expect(pages.find((p) => p.path.startsWith("packs/"))?.content).not.toContain(
    "no page shows a run result",
  );
  expect(
    pages
      .filter((p) => !p.path.startsWith("exports/"))
      .every((p) =>
        p.content.includes('href="' + (p.path.includes("/") ? "../" : "") + 'runs.html"'),
      ),
  ).toBe(true);
  const plain = renderStudio(await createStudioData(reader));
  expect(plain.some((p) => p.path === "runs.html")).toBe(false);
  expect(plain.every((p) => !p.content.includes("run evidence"))).toBe(true);
});
it("reads repeated --runs before extraction and leaves input bytes untouched", async () => {
  const root = fixture(),
    path = join(root, "runs.json");
  writeFileSync(path, JSON.stringify(report()));
  const before = readFileSync(path, "utf8");
  const out = output();
  expect(await cli(["studio", root, "--runs", path, "--runs", path], out)).toBe(0);
  const first = snapshot(join(root, "generated/spec-studio"));
  expect(await cli(["studio", root, "--runs", path, "--runs", path, "--check-clean"], out)).toBe(0);
  expect(snapshot(join(root, "generated/spec-studio"))).toEqual(first);
  expect(readFileSync(path, "utf8")).toBe(before);
  const spy = vi.spyOn(extraction, "extract");
  const bad = output();
  expect(await cli(["studio", root, "--runs", join(root, "missing.json")], bad)).toBe(1);
  expect(spy).not.toHaveBeenCalled();
  expect(bad.text().stderr).toContain("--runs");
});
it("stamps apart, touches no page, refuses bad sources and removes the stamp on rebuild", async () => {
  const root = fixture(),
    out = output();
  expect(await cli(["stamp", root], out)).toBe(1);
  expect(await cli(["studio", root], out)).toBe(0);
  const dir = join(root, "generated/spec-studio"),
    before = snapshot(dir);
  const rootBefore = snapshot(root);
  const extractionSpy = vi.spyOn(extraction, "extract");
  expect(
    await cli(
      [
        "stamp",
        root,
        "--commit",
        "0123abc",
        "--source",
        "https://example.test/blob/0123abc/{file}#L{line}",
      ],
      out,
    ),
  ).toBe(0);
  expect(extractionSpy).not.toHaveBeenCalled();
  const rootAfter = snapshot(root);
  delete rootAfter["generated/spec-studio/stamp.json"];
  expect(rootAfter).toEqual(rootBefore);
  const after = snapshot(dir);
  const stamp = JSON.parse(after["stamp.json"] ?? "null") as Record<string, unknown>;
  delete after["stamp.json"];
  expect(after).toEqual(before);
  expect(stamp).toMatchObject({
    corpusCommit: "0123abc",
    source: "https://example.test/blob/0123abc/{file}#L{line}",
    engine: expect.stringMatching(/^sdp /),
    schemaVersion,
    builtAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
  });
  expect(await cli(["stamp", root, "--source", "https://example.test"], out)).toBe(1);
  expect(await cli(["studio", root], out)).toBe(0);
  expect(snapshot(dir)).toEqual(before);
});

import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
  specOracle,
  oracleAnchorId,
} from "@libar-dev/software-delivery-protocol";

import { registerAbsolutePathJoins } from "./observation.run-evidence.absolute-path-joins.test.generated.js";
import { registerUnanchoredFileUnjoined } from "./observation.run-evidence.unanchored-file-unjoined.test.generated.js";
import { registerExternalEvidence } from "./consumers.spec-studio.runs-page.external-evidence.test.generated.js";
import { registerGraphOnly } from "./consumers.spec-studio.data.inputs.graph-only.test.generated.js";
import { registerStampWrittenApart } from "./consumers.spec-studio.sharing.stamp-written-apart.test.generated.js";
import type { RunnableExampleAdapters } from "@libar-dev/software-delivery-protocol/testing";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  RunEvidenceConditions,
  RunEvidenceOutcome,
} from "../generated/contracts/observation.run-evidence.space.js";
import type {
  RunsPageConditions,
  RunsPageOutcome,
} from "../generated/contracts/consumers.spec-studio.runs-page.space.js";
import type {
  InputsConditions,
  InputsOutcome,
} from "../generated/contracts/consumers.spec-studio.data.inputs.space.js";
import type {
  SharingConditions,
  SharingOutcome,
} from "../generated/contracts/consumers.spec-studio.sharing.space.js";
import type { RunEvidence } from "../src/projections/studio/pages/run-rows.js";

import { absolutePathJoinsContract } from "../generated/contracts/observation.run-evidence.absolute-path-joins.contract.js";
import { unanchoredFileUnjoinedContract } from "../generated/contracts/observation.run-evidence.unanchored-file-unjoined.contract.js";
import { externalEvidenceContract } from "../generated/contracts/consumers.spec-studio.runs-page.external-evidence.contract.js";
import { graphOnlyContract } from "../generated/contracts/consumers.spec-studio.data.inputs.graph-only.contract.js";
import { stampWrittenApartContract } from "../generated/contracts/consumers.spec-studio.sharing.stamp-written-apart.contract.js";
interface BoundContract {
  readonly steps: readonly { readonly kind: string; readonly params: unknown }[];
}
function thenValues(contract: BoundContract): Record<string, unknown> {
  return Object.assign(
    {},
    ...contract.steps.filter((step) => step.kind === "then").map((step) => step.params),
  ) as Record<string, unknown>;
}

function required<T>(value: T | null | undefined): T {
  if (value === undefined || value === null) throw new Error("Expected a value");
  return value;
}
const runOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.run-evidence"),
  models: ref("spec:observation.run-evidence"),
});
void runOracle;

function expectedRun(point: Partial<RunEvidenceConditions>): RunEvidenceOutcome {
  if (point.filePath === undefined || point.anchorFile === undefined) return unspecified;
  const path = point.filePath.replaceAll("\\", "/").replace(/^\.\//u, "");
  return {
    kind: "the test joins the file {joinedFile}",
    joinedFile:
      path === point.anchorFile || path.endsWith(`/${point.anchorFile}`) ? point.anchorFile : "",
  };
}
interface RunWorld {
  point: Partial<RunEvidenceConditions>;
  answer?: RunEvidence;
  factsUnchanged?: boolean;
}
function runAdapters(
  contract: BoundContract,
): RunnableExampleAdapters<RunWorld, RunEvidenceConditions, RunEvidenceOutcome> {
  return {
    createWorld: (point) => ({ point }),
    expected: expectedRun,
    invoke: async (w) => {
      const root = fixture();
      const oldFile = join(root, "test/page.test.ts");
      const anchorFile = join(root, required(w.point.anchorFile));
      if (oldFile !== anchorFile) {
        mkdirSync(join(anchorFile, ".."), { recursive: true });
        rmSync(oldFile);
      }
      writeFileSync(
        anchorFile,
        `/**\n * @sdpAnchor test:probe.page\n * @sdpVerifies ${required(w.point.specId)}\n */\nexport const test=1;\n`,
      );
      const reader = createReader(extract({ root }).graph),
        before = JSON.stringify(reader.graph);
      const input = report([required(w.point.filePath)]);
      input.results.tests[0] = {
        ...required(input.results.tests[0]),
        name: required(w.point.testName),
        status: required(w.point.status),
      };
      w.answer = (await evaluateStudioRecipe(reader, 45, { runs: input })) as RunEvidence;
      w.factsUnchanged = JSON.stringify(reader.graph) === before;
    },
    observe: (w) => ({
      kind: "the test joins the file {joinedFile}",
      joinedFile: w.answer?.files?.[0]?.file ?? "",
    }),
    assertions: (w) => {
      expect({
        joinedFile: w.answer?.files?.[0]?.file ?? "",
        reason: w.answer?.unjoined?.[0]?.reason ?? "none",
        factsUnchanged: w.factsUnchanged,
      }).toEqual(thenValues(contract));
    },
  };
}
const absoluteAnchor = specTest({
  id: testAnchorId("test:protocol.run-absolute"),
  verifies: ref("spec:observation.run-evidence.absolute-path-joins"),
});
void absoluteAnchor;

registerAbsolutePathJoins(runAdapters(absolutePathJoinsContract));
const unjoinedAnchor = specTest({
  id: testAnchorId("test:protocol.run-unjoined"),
  verifies: ref("spec:observation.run-evidence.unanchored-file-unjoined"),
});
void unjoinedAnchor;

registerUnanchoredFileUnjoined(runAdapters(unanchoredFileUnjoinedContract));
const pageOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.runs-page"),
  models: ref("spec:consumers.spec-studio.runs-page"),
});
void pageOracle;

function expectedPage(point: Partial<RunsPageConditions>): RunsPageOutcome {
  return point.tool === undefined || point.version === undefined
    ? unspecified
    : {
        kind: "the run's heading reads {heading}",
        heading: `Run 1: external run evidence from ${point.tool} ${point.version}`,
      };
}
interface PageWorld {
  point: Partial<RunsPageConditions>;
  pages?: ReturnType<typeof renderStudio>;
}
const externalAnchor = specTest({
  id: testAnchorId("test:protocol.run-external"),
  verifies: ref("spec:consumers.spec-studio.runs-page.external-evidence"),
});
void externalAnchor;

registerExternalEvidence<PageWorld>({
  createWorld: (point) => ({ point }),
  expected: expectedPage,
  invoke: async (w) => {
    const reader = createReader(extract({ root: fixture() }).graph);
    const input = report(
      Array.from(
        { length: required<number>(w.point.passed) + required<number>(w.point.failed) },
        () => "test/page.test.ts",
      ),
    );
    input.results.tool = { name: required(w.point.tool), version: required(w.point.version) };
    input.results.tests.forEach((test, i) => {
      test.status = i < required(w.point.passed) ? "passed" : "failed";
    });
    w.pages = renderStudio(await createStudioData(reader, undefined, { runs: [input] }));
  },
  observe: (w) => ({
    kind: "the run's heading reads {heading}",
    heading:
      /<h2>(Run 1:[^<]+)<\/h2>/u.exec(
        required(required(w.pages).find((p) => p.path === "runs.html")).content,
      )?.[1] ?? "",
  }),
  assertions: (w) => {
    const runs = required(required(w.pages).find((p) => p.path === "runs.html")).content;
    const declared = thenValues(externalEvidenceContract);
    expect((runs.match(/data-run-result/g) ?? []).length).toBe(declared.rows);
    expect(required(w.pages).some((page) => /(?:Spec|verifier) passed/u.test(page.content))).toBe(
      declared.verdict,
    );
  },
});
const inputsOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-inputs"),
  models: ref("spec:consumers.spec-studio.data.inputs"),
});
void inputsOracle;

function expectedInputs(point: Partial<InputsConditions>): InputsOutcome {
  return point.base === "none" && point.runs === "none"
    ? { kind: "the two runs wrote byte-identical files: {byteIdentical}", byteIdentical: true }
    : unspecified;
}
interface InputsWorld {
  point: Partial<InputsConditions>;
  first?: Record<string, string>;
  second?: Record<string, string>;
}
const graphOnlyAnchor = specTest({
  id: testAnchorId("test:protocol.studio-graph-only"),
  verifies: ref("spec:consumers.spec-studio.data.inputs.graph-only"),
});
void graphOnlyAnchor;

registerGraphOnly<InputsWorld>({
  createWorld: (point) => ({ point }),
  expected: expectedInputs,
  invoke: async (w) => {
    const root = fixture(),
      out = output();
    expect(await cli(["studio", root], out)).toBe(0);
    w.first = snapshot(join(root, "generated/spec-studio"));
    expect(await cli(["studio", root], out)).toBe(0);
    w.second = snapshot(join(root, "generated/spec-studio"));
  },
  observe: (w) => ({
    kind: "the two runs wrote byte-identical files: {byteIdentical}",
    byteIdentical: JSON.stringify(w.first) === JSON.stringify(w.second),
  }),
  assertions: (w) => {
    const declared = thenValues(graphOnlyContract);
    expect("runs.html" in required(w.first)).toBe(declared.runsPage);
    expect("diff.html" in required(w.first)).toBe(declared.diffPage);
    expect(!/base graph|run evidence/u.test(Object.values(required(w.first)).join("\n"))).toBe(
      declared.inputsNamed,
    );
  },
});
const stampOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-sharing"),
  models: ref("spec:consumers.spec-studio.sharing"),
});
void stampOracle;

function expectedStamp(point: Partial<SharingConditions>): SharingOutcome {
  return point.commit === undefined
    ? unspecified
    : { kind: "the stamp names the corpus commit {corpusCommit}", corpusCommit: point.commit };
}
interface StampWorld {
  point: Partial<SharingConditions>;
  stamp?: Record<string, unknown>;
  pagesUntouched?: boolean;
  stampSurvives?: boolean;
}
const stampAnchor = specTest({
  id: testAnchorId("test:protocol.studio-stamp-apart"),
  verifies: ref("spec:consumers.spec-studio.sharing.stamp-written-apart"),
});
void stampAnchor;

registerStampWrittenApart<StampWorld>({
  createWorld: (point) => ({ point }),
  expected: expectedStamp,
  invoke: async (w) => {
    const root = fixture(),
      out = output(),
      path = join(root, "generated/spec-studio");
    expect(await cli(["studio", root], out)).toBe(0);
    const before = snapshot(path);
    expect(
      await cli(
        ["stamp", root, "--commit", required(w.point.commit), "--source", required(w.point.source)],
        out,
      ),
    ).toBe(0);
    const after = snapshot(path);
    w.stamp = JSON.parse(required(after["stamp.json"])) as Record<string, unknown>;
    delete after["stamp.json"];
    w.pagesUntouched = JSON.stringify(after) === JSON.stringify(before);
    expect(await cli(["studio", root], out)).toBe(0);
    w.stampSurvives = "stamp.json" in snapshot(path);
  },
  observe: (w) => ({
    kind: "the stamp names the corpus commit {corpusCommit}",
    corpusCommit: String(w.stamp?.corpusCommit),
  }),
  assertions: (w) => {
    const declared = thenValues(stampWrittenApartContract);
    expect(w.pagesUntouched).toBe(declared.pagesUntouched);
    expect(w.stampSurvives).toBe(declared.stampSurvives);
    expect(w.stamp?.source).toBe(w.point.source);
  },
});

import { sourceUrl } from "../src/studio-elements/stamp.js";
import { runInNewContext } from "node:vm";
it("the stamp links source locations only after an HTTP stamp loads, encoding path segments", async () => {
  expect(sourceUrl("https://example.test/blob/{file}#L{line}", "src/a b/#name.ts", "12")).toBe(
    "https://example.test/blob/src/a%20b/%23name.ts#L12",
  );
  expect(sourceUrl("javascript:{file}", "test.ts", "1")).toBeNull();
  const created: FakeElement[] = [];
  class FakeElement {
    tagName = "CODE";
    textContent = "";
    isConnected = true;
    attributes = new Map<string, string>();
    parentElement: FakeElement | null = null;
    replacement?: FakeElement;
    children: FakeElement[] = [];
    ownerDocument = document;
    getAttribute(name: string) {
      return this.attributes.get(name) ?? null;
    }
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    }
    replaceWith(element: FakeElement) {
      this.replacement = element;
    }
    appendChild(element: FakeElement) {
      this.children.push(element);
      element.parentElement = this;
    }
  }
  const document = {
    location: { protocol: "https:" },
    querySelectorAll: () => codes,
    createElement: (tag: string) => {
      const element = new FakeElement();
      element.tagName = tag.toUpperCase();
      created.push(element);
      return element;
    },
  };
  const codes: FakeElement[] = [];
  const code = new FakeElement();
  codes.push(code);
  code.setAttribute("data-source-file", "test/a b.test.ts");
  code.setAttribute("data-source-line", "7");
  type Element = FakeElement & { connectedCallback(): void; disconnectedCallback(): void };
  const constructors = new Map<string, new () => Element>();
  let refreshSources: (() => void) | undefined;
  const disconnect = vi.fn();
  class Observer {
    constructor(callback: () => void) {
      refreshSources = callback;
    }
    observe = vi.fn();
    disconnect = disconnect;
  }
  const fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          corpusCommit: "head",
          engine: "sdp test",
          builtAt: new Date(0).toISOString(),
          source: "https://example.test/blob/head/{file}#L{line}",
        }),
    }),
  );
  runInNewContext(readFileSync(join(process.cwd(), "dist/studio/studio.js"), "utf8"), {
    HTMLElement: FakeElement,
    MutationObserver: Observer,
    URL,
    fetch,
    customElements: {
      get: (name: string) => constructors.get(name),
      define: (name: string, value: new () => Element) => constructors.set(name, value),
    },
  });
  const Stamp = required(constructors.get("sdp-stamp"));
  const host = new Stamp();
  host.connectedCallback();
  await new Promise((resolve) => setImmediate(resolve));
  expect(host.getAttribute("data-corpus-commit")).toBe("head");
  expect(code.replacement?.getAttribute("href")).toBe(
    "https://example.test/blob/head/test/a%20b.test.ts#L7",
  );
  const later = new FakeElement();
  later.setAttribute("data-source-file", "test/later.test.ts");
  later.setAttribute("data-source-line", "9");
  codes.push(later);
  required(refreshSources)();
  expect(later.replacement?.getAttribute("href")).toBe(
    "https://example.test/blob/head/test/later.test.ts#L9",
  );
  host.disconnectedCallback();
  expect(disconnect).toHaveBeenCalled();
  document.location.protocol = "file:";
  const offline = new Stamp();
  offline.connectedCallback();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(offline.textContent).toBe("");
});

it("recipe 45 picks the longest suffix and scopes through enabled examples at file grain", async () => {
  const root = fixture();
  writeFileSync(
    join(root, "page.test.ts"),
    "/**\n * @sdpAnchor test:probe.short\n * @sdpVerifies spec:probe.page\n */\nexport const short=1;\n",
  );
  writeFileSync(
    join(root, "child.sdp.md"),
    "---\nid: spec:probe.child\nkind: example\naltitude: story\nreadiness: defined\nrelations:\n  refines: spec:probe.page\n  verifies: spec:probe.page\n---\n# Child\n\n## Intent\n- outcome: Read the page.\n\n```gwt\nGiven a page\nWhen it renders\nThen it is read\n```\n",
  );
  writeFileSync(
    join(root, "test/page.test.ts"),
    "/**\n * @sdpAnchor test:probe.child\n * @sdpVerifies spec:probe.child\n */\nexport const child=1;\n/**\n * @sdpAnchor test:probe.second\n * @sdpVerifies spec:probe.page\n */\nexport const second=2;\n",
  );
  const reader = createReader(extract({ root }).graph);
  const answer = (await evaluateStudioRecipe(reader, 45, {
    runs: report(["/repo/test/page.test.ts"]),
    spec: "spec:probe.page",
    commit: "different",
  })) as RunEvidence;
  expect(answer.inputs?.[0]?.sameCommit).toBe(false);
  expect(answer.files).toMatchObject([
    {
      file: "test/page.test.ts",
      anchors: [
        { id: "test:probe.child", verifies: ["spec:probe.child", "spec:probe.page"] },
        { id: "test:probe.second", verifies: ["spec:probe.page"] },
      ],
      specs: ["spec:probe.child", "spec:probe.page"],
      results: [{ name: "test 0" }],
    },
  ]);
  expect(
    (
      (await evaluateStudioRecipe(reader, 45, {
        runs: report(),
        spec: "spec:probe.absent",
      })) as RunEvidence
    ).files,
  ).toEqual([]);
});

import { parse } from "yaml";
const workflowAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.studio-preview-workflow"),
  label: "asserts the reusable Studio preview workflow and Protocol CI caller",
  satisfies: ref("spec:consumers.spec-studio.sharing"),
});
void workflowAnchor;
it("ships a reusable preview and calls it on pull requests with runs and diff, deployment disabled", () => {
  const workflow = parse(
    readFileSync(join(process.cwd(), ".github/workflows/studio-preview.yml"), "utf8"),
  ) as {
    on: { workflow_call: { inputs: Record<string, { default: unknown }> } };
    jobs: Record<string, unknown>;
  };
  for (const name of [
    "root",
    "exclude",
    "node-version",
    "install",
    "sdp",
    "runs-artifact",
    "diff",
    "deploy",
  ])
    expect(workflow.on.workflow_call.inputs).toHaveProperty(name);
  expect(workflow.on.workflow_call.inputs.deploy?.default).toBe(false);
  const ci = parse(readFileSync(join(process.cwd(), ".github/workflows/ci.yml"), "utf8")) as {
    jobs: Record<string, { uses?: string; with?: Record<string, unknown>; if?: string }>;
  };
  expect(ci.jobs["studio-preview"]).toMatchObject({
    uses: "./.github/workflows/studio-preview.yml",
    with: { "runs-artifact": "ctrf-runs", diff: true, deploy: false },
  });
  expect(ci.jobs["studio-preview"]?.if).toContain("needs.check.result == 'success'");
  expect(ci.jobs["studio-preview"]?.if).toContain("needs.check.result == 'failure'");
});

it("the tests lens counts file results once per Spec and names every run input", async () => {
  const root = fixture();
  writeFileSync(
    join(root, "other.sdp.md"),
    "---\nid: spec:probe.other\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Other\n\n## Intent\n- outcome: Read another page.\n",
  );
  writeFileSync(
    join(root, "test/other.test.ts"),
    "/**\n * @sdpAnchor test:probe.other\n * @sdpVerifies spec:probe.other\n */\nexport const other=1;\n",
  );
  const reader = createReader(extract({ root }).graph);
  const first = report(Array.from({ length: 6 }, () => "test/page.test.ts"));
  first.results.tests.forEach((test, index) => {
    test.status = ["passed", "failed", "skipped", "pending", "other", "custom"][index] ?? "other";
  });
  const second = report(["test/page.test.ts", "test/other.test.ts"]);
  second.results.tool.name = "second runner";
  const pages = renderStudio(await createStudioData(reader, undefined, { runs: [first, second] }));
  const tests = required(pages.find((p) => p.path === "tests.html")).content;
  expect(tests).toContain(
    "external run evidence: 2 passed, 1 failed, 1 skipped, 1 pending, 2 other",
  );
  expect(tests).toContain(
    "external run evidence: 1 passed, 0 failed, 0 skipped, 0 pending, 0 other",
  );
  expect(tests).not.toContain("data-run-result");
  const summary = tests.slice(
    tests.indexOf('<header class="page-head">'),
    tests.indexOf("</header>", tests.indexOf('<header class="page-head">')),
  );
  expect(summary).toContain("Run 1: external run evidence from vitest 3.2.4");
  expect(summary).toContain("Run 2: external run evidence from second runner 3.2.4");
  expect(summary).not.toContain("<h2>");
  expect(summary).toContain("Build: CI 7");
  expect(summary).toContain("Branch: lane");
  expect(summary).toContain("Commit: abc");
  expect(summary).toContain("1970-01-01T00:00:01.000Z");
});

it("the Pack sentence keeps the graph's binding limit and positively names external evidence", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  for (const runs of [[], [report()]]) {
    const pages = renderStudio(await createStudioData(reader, undefined, { runs }));
    const pack = required(pages.find((p) => p.path.startsWith("packs/"))).content;
    expect(pack.match(/The graph records bindings and never runs/gu)).toHaveLength(1);
    if (runs.length) {
      expect(pack).toContain('href="../runs.html">runs page</a>');
      expect(pack).toContain('href="../tests.html">tests lens</a>');
      expect(pack).toContain(
        "Spec pages of the Specs their files verify show the run records as external evidence from test files",
      );
      expect(pack).not.toContain("no page shows a run result");
    } else {
      expect(pack).toContain(
        "The graph records bindings and never runs, so no page shows a run result.",
      );
    }
  }
});

it("run metadata labels build and branch, and absent fields read not recorded", () => {
  const input = {
    index: 0,
    tool: "runner",
    toolVersion: null,
    specVersion: "1",
    commit: null,
    branch: null,
    build: null,
    start: null,
    stop: null,
    summary: { tests: 0, passed: 0, failed: 0, skipped: 0, pending: 0, other: 0 },
    sameCommit: null,
  };
  const html = runHeader(input);
  expect(html).toContain("Run 1: external run evidence from runner</h2>");
  expect(html).not.toContain("null");
  for (const label of ["Build", "Branch", "Commit", "Start", "Stop"])
    expect(html).toContain(`${label}: not recorded`);
  const recorded = runHeader({ ...input, build: "CI 7", branch: "lane" });
  expect(recorded).toContain("Build: CI 7");
  expect(recorded).toContain("Branch: lane");
});

it("unjoined records escape outside names and explain both reason codes in words", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  const input = report(["test/unanchored.test.ts", ""]);
  required(input.results.tests[0]).name = '<script>alert("run")</script>';
  const pages = renderStudio(await createStudioData(reader, undefined, { runs: [input] }));
  const html = required(pages.find((p) => p.path === "runs.html")).content;
  expect(html).toContain("&lt;script&gt;alert(&quot;run&quot;)&lt;/script&gt;");
  expect(html).not.toContain('<script>alert("run")</script>');
  expect(html).toContain("no test anchor in that file");
  expect(html).toContain("no file path");
  expect(html).not.toMatch(/noTestAnchor|noFilePath/u);
});

it("run files show the file alone, bindings and Suite, with one header per run", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  const data = await createStudioData(reader, undefined, { runs: [report()] });
  const html = required(renderStudio(data).find((p) => p.path === "runs.html")).content;
  expect(html.match(/Run 1: external run evidence/gu)).toHaveLength(1);
  expect(html.match(/Build: CI 7/gu)).toHaveLength(1);
  expect(html).toContain(
    '<h3>External run evidence from <code>test/page.test.ts</code><sdp-copy text="test/page.test.ts"></sdp-copy></h3>',
  );
  expect(html).toContain("Test anchors: <code>test:probe.page</code>");
  expect(html).toContain(
    'Specs verified by those bindings: <a href="specs/probe.page.html">spec:probe.page</a>',
  );
  expect(html).toContain("<th>Suite</th>");
  expect(html).toContain("suite &gt; nested");
  const panel = runRows({ data, path: "specs/probe.page.html" }, "spec:probe.page");
  expect(panel).toContain("Run 1: external run evidence from vitest 3.2.4");
});

it("recipe 45 does not join a suffix inside a path segment", async () => {
  const reader = createReader(extract({ root: fixture() }).graph);
  const answer = await evaluateStudioRecipe(reader, 45, {
    runs: report(["/repo/xtest/page.test.ts"]),
  });
  expect(answer).toMatchObject({ files: [], unjoined: [{ reason: "noTestAnchor" }] });
});

it("stamp defaults to unknown and a stamped page set passes check-clean", async () => {
  const root = fixture(),
    out = output();
  expect(await cli(["studio", root], out)).toBe(0);
  const directory = join(root, "generated/spec-studio"),
    before = snapshot(directory);
  expect(await cli(["stamp", root], out)).toBe(0);
  const stamp = JSON.parse(readFileSync(join(directory, "stamp.json"), "utf8")) as Record<
    string,
    unknown
  >;
  expect(stamp.corpusCommit).toBe("unknown");
  expect(stamp.schemaVersion).toBe(schemaVersion);
  expect(stamp.builtAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u);
  expect(await cli(["studio", root, "--check-clean"], out)).toBe(0);
  expect(snapshot(directory)).toEqual(before);
});

interface WorkflowStep {
  name?: string;
  id?: string;
  uses?: string;
  run?: string;
  if?: string;
  "continue-on-error"?: boolean;
  env?: Record<string, string>;
  with?: Record<string, unknown>;
}
interface WorkflowJob {
  permissions?: Record<string, string>;
  steps?: WorkflowStep[];
  if?: string;
}
interface Workflow {
  permissions?: Record<string, string>;
  jobs: Record<string, WorkflowJob>;
}
const workflow = (file: string): Workflow =>
  parse(readFileSync(join(process.cwd(), `.github/workflows/${file}.yml`), "utf8")) as Workflow;
const stepNamed = (job: WorkflowJob | undefined, name: string): WorkflowStep =>
  required(job?.steps?.find((step) => step.name === name));

it("every reusable preview job's permissions fit the CI caller's grant", () => {
  const caller = required(workflow("ci").jobs["studio-preview"]).permissions ?? {};
  const called = workflow("studio-preview");
  const rank: Record<string, number> = { none: 0, read: 1, write: 2 };
  for (const [name, job] of Object.entries(called.jobs)) {
    for (const [scope, grant] of Object.entries(job.permissions ?? called.permissions ?? {}))
      expect({
        job: name,
        scope,
        fits: (rank[grant] ?? 0) <= (rank[caller[scope] ?? "none"] ?? 0),
      }).toEqual({ job: name, scope, fits: true });
  }
});

it("PR checks and preview stamps name the same default merge checkout", () => {
  const check = required(workflow("ci").jobs.check);
  const preview = required(workflow("studio-preview").jobs.build);
  for (const job of [check, preview]) {
    const checkout = required(job.steps?.find((step) => step.uses === "actions/checkout@v4"));
    expect(checkout.with?.ref).toBeUndefined();
  }
  expect(stepNamed(check, "Check").env?.SDP_CORPUS_COMMIT).toBe("${{ github.sha }}");
  const publish = stepNamed(preview, "Build, stamp and measure the page set");
  expect(publish.env?.CORPUS_COMMIT).toBe("${{ github.sha }}");
  expect(publish.run).toContain('sdp stamp "$ROOT" --commit "$CORPUS_COMMIT"');
  expect(publish.run).toContain("/blob/$CORPUS_COMMIT/");
});

it("preview download is optional and cancelled or skipped checks do not call it", () => {
  const ci = required(workflow("ci").jobs["studio-preview"]);
  expect(ci.if).toContain("needs.check.result == 'success'");
  expect(ci.if).toContain("needs.check.result == 'failure'");
  expect(
    stepNamed(workflow("studio-preview").jobs.build, "Download run evidence")["continue-on-error"],
  ).toBe(true);
});

it.each(["gh-pages", "main", "disabled"])(
  "deploy checks the enabled Pages source before writing: %s",
  (source) => {
    const deploy = required(workflow("studio-preview").jobs.deploy);
    const check = stepNamed(deploy, "Check the Pages source");
    expect(deploy.permissions?.pages).toBe("read");
    expect(deploy.steps?.indexOf(check)).toBeLessThan(
      required(deploy.steps).indexOf(
        stepNamed(deploy, "Write the preview to the enabled Pages branch"),
      ),
    );
    expect(stepNamed(deploy, "Write the preview to the enabled Pages branch").if).toBe(
      "steps.pages.outputs.enabled == 'true'",
    );
    const root = fixture(),
      bin = join(root, "bin"),
      summary = join(root, "summary"),
      output = join(root, "output");
    mkdirSync(bin);
    writeFileSync(
      join(bin, "gh"),
      '#!/bin/bash\nprintf "%s\\n" "$*" > "$API_ARGS"\nif [[ "$PAGE_SOURCE" == disabled ]]; then exit 1; fi\nprintf "%s\\n" "$PAGE_SOURCE"\n',
    );
    chmodSync(join(bin, "gh"), 0o755);
    writeFileSync(summary, "");
    writeFileSync(output, "");
    const result = spawnSync("bash", ["-e", "-o", "pipefail", "-c", required(check.run)], {
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH ?? ""}`,
        GH_REPO: "owner/repo",
        GITHUB_REPOSITORY: "owner/repo",
        PAGE_SOURCE: source,
        API_ARGS: join(root, "args"),
        GITHUB_STEP_SUMMARY: summary,
        GITHUB_OUTPUT: output,
      },
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(join(root, "args"), "utf8")).toContain("repos/owner/repo/pages");
    expect(readFileSync(output, "utf8")).toBe(
      `enabled=${source === "gh-pages" ? "true" : "false"}\n`,
    );
    if (source !== "gh-pages") expect(readFileSync(summary, "utf8")).toContain("skipped");
  },
);

it("preview still stamps and uploads rendered pages when evidence is absent and validation fails", () => {
  const build = stepNamed(
    workflow("studio-preview").jobs.build,
    "Build, stamp and measure the page set",
  );
  const root = fixture(),
    sdp = join(root, "sdp"),
    calls = join(root, "calls"),
    summary = join(root, "summary");
  writeFileSync(
    sdp,
    '#!/bin/bash\nprintf "%s\\n" "$*" >> "$CALLS"\nif [[ "$1" == studio ]]; then mkdir -p "$2/generated/spec-studio"; echo page > "$2/generated/spec-studio/index.html"; exit 1; fi\n',
  );
  chmodSync(sdp, 0o755);
  const result = spawnSync("bash", ["-e", "-o", "pipefail", "-c", required(build.run)], {
    env: {
      ...process.env,
      ROOT: root,
      EXCLUDE: "",
      SDP: sdp,
      DIFF: "false",
      CORPUS_COMMIT: "abc",
      SOURCE_SERVER: "https://github.com",
      SOURCE_REPO: "owner/repo",
      RUNS_ARTIFACT: "missing",
      RUNNER_TEMP: root,
      GITHUB_STEP_SUMMARY: summary,
      CALLS: calls,
    },
    encoding: "utf8",
  });
  expect(result.status, result.stderr).toBe(0);
  const args = readFileSync(calls, "utf8");
  expect(args).toContain("stamp");
  expect(args).toContain("--commit abc");
  expect(args).toContain("/blob/abc/");
  expect(args).not.toContain("--runs");
  expect(readFileSync(summary, "utf8")).toContain("validation");
});

it("places external file rows under their verifier and renders shared files once", async () => {
  const root = fixture();
  writeFileSync(
    join(root, "child.sdp.md"),
    "---\nid: spec:probe.child\nkind: example\naltitude: story\nreadiness: defined\nrelations:\n  refines: spec:probe.page\n  verifies: spec:probe.page\n---\n# Child\n\n## Intent\n- outcome: Read the page.\n\n```gwt\nGiven a page\nWhen it renders\nThen it is read\n```\n",
  );
  writeFileSync(
    join(root, "test/child.test.ts"),
    "/**\n * @sdpAnchor test:probe.child\n * @sdpVerifies spec:probe.child\n */\nexport const child=1;\n/**\n * @sdpAnchor test:probe.shared\n * @sdpVerifies spec:probe.page\n */\nexport const shared=2;\n",
  );
  writeFileSync(
    join(root, "other.sdp.md"),
    "---\nid: spec:probe.other\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Other\n\n## Intent\n- outcome: Read another page.\n",
  );
  const data = await createStudioData(createReader(extract({ root }).graph), undefined, {
    runs: [report(["test/page.test.ts", "test/child.test.ts"])],
  });
  const pages = renderStudio(data);
  const page = required(pages.find((p) => p.path === "specs/probe.page.html")).content;
  const panel = required(/id="panel.verification"[^>]*>(.*?)<\/details>/su.exec(page)?.[1]);
  const rows = [...panel.matchAll(/<li>(.*?)<\/li>/gsu)].map((match) => required(match[1]));
  const direct = required(rows.find((row) => row.startsWith("test:probe.page")));
  expect(direct).toContain("External run evidence from <code>test/page.test.ts</code>");
  expect(direct).not.toContain("test/child.test.ts");
  const example = required(rows.find((row) => row.includes('href="probe.child.html"')));
  expect(example).toContain("External run evidence from <code>test/child.test.ts</code>");
  expect(example).not.toContain("test/page.test.ts");
  const shared = required(rows.find((row) => row.startsWith("test:probe.shared")));
  expect(shared).not.toContain("data-run-result");
  expect(panel.match(/data-run-result/gu)).toHaveLength(2);
  const other = required(pages.find((p) => p.path === "specs/probe.other.html")).content;
  expect(other).not.toContain("data-run-result");
});

it("accepts the preview workflow's base and run flags together", async () => {
  const root = fixture();
  const inputs = mkdtempSync(join(tmpdir(), "sdp-preview-inputs-"));
  roots.push(inputs);
  const base = join(inputs, "base.json");
  const runs = join(inputs, "runs.json");
  writeFileSync(base, JSON.stringify(extract({ root }).graph));
  writeFileSync(runs, JSON.stringify(report()));
  const out = output();
  expect(
    await cli(
      ["studio", root, "--base", base, "--base-label", "base 1234567", "--runs", runs],
      out,
    ),
  ).toBe(0);
  expect(out.text().stderr).toBe("");
  const index = readFileSync(join(root, "generated/spec-studio/index.html"), "utf8");
  expect(index.indexOf('href="diff.html"')).toBeLessThan(index.indexOf('href="runs.html"'));
  expect(readFileSync(join(root, "generated/spec-studio/diff.html"), "utf8")).toContain(
    "base 1234567",
  );
  expect(readFileSync(join(root, "generated/spec-studio/runs.html"), "utf8")).toContain(
    "test/page.test.ts",
  );
  expect(JSON.parse(readFileSync(runs, "utf8"))).toEqual(report());
});

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { evaluateStudioRecipe } from "../src/projections/studio/recipes.js";
import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
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
      diagnostics: expect.any(Array),
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
    "External run evidence from test file",
  );
  expect(pages.find((p) => p.path.startsWith("packs/"))?.content).not.toContain(
    "no page shows a run result",
  );
  expect(
    pages.every((p) =>
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
    builtAt: expect.stringMatching(/Z$/),
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
function runAdapters(): RunnableExampleAdapters<
  RunWorld,
  RunEvidenceConditions,
  RunEvidenceOutcome
> {
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
      w.factsUnchanged = JSON.stringify(extract({ root }).graph) === before;
    },
    observe: (w) => ({
      kind: "the test joins the file {joinedFile}",
      joinedFile: w.answer?.files?.[0]?.file ?? "",
    }),
    assertions: (w) => {
      expect(w.factsUnchanged).toBe(true);
      const expected = expectedRun(w.point);
      if (expected.kind !== "the test joins the file {joinedFile}")
        throw new Error("Unbound point");
      expect(w.answer?.unjoined?.[0]?.reason ?? "none").toBe(
        expected.joinedFile ? "none" : "noTestAnchor",
      );
    },
  };
}
const absoluteAnchor = specTest({
  id: testAnchorId("test:protocol.run-absolute"),
  verifies: ref("spec:observation.run-evidence.absolute-path-joins"),
});
void absoluteAnchor;

registerAbsolutePathJoins(runAdapters());
const unjoinedAnchor = specTest({
  id: testAnchorId("test:protocol.run-unjoined"),
  verifies: ref("spec:observation.run-evidence.unanchored-file-unjoined"),
});
void unjoinedAnchor;

registerUnanchoredFileUnjoined(runAdapters());
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
        { length: required(w.point.passed) + required(w.point.failed) },
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
    expect(runs.match(/data-run-result/g)).toHaveLength(
      required(w.point.passed) + required(w.point.failed),
    );
    for (const page of required(w.pages))
      expect(page.content).not.toMatch(/(?:Spec|verifier) passed/u);
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
    expect(w.first).not.toHaveProperty("runs.html");
    expect(w.first).not.toHaveProperty("diff.html");
    expect(Object.values(required(w.first)).join("\n")).not.toMatch(/base graph|run evidence/u);
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
    expect(w.pagesUntouched).toBe(true);
    expect(w.stampSurvives).toBe(false);
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
  references: [ref("spec:consumers.spec-studio.sharing")],
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
  expect(ci.jobs["studio-preview"]?.if).toBe("always() && github.event_name == 'pull_request'");
});

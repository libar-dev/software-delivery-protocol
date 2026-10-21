import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { registerRefreshKeepsIntents } from "./consumers.spec-studio.intent-panel.refresh-keeps-intents.test.generated.js";
import { registerShared } from "./consumers.intent-composition.proposal.memo.shared.test.generated.js";
import { registerSelfContained } from "./consumers.spec-studio.export.self-contained.test.generated.js";
import { registerMatchesPlainRun } from "./consumers.spec-studio.publisher.watch.matches-plain-run.test.generated.js";
import type {
  IntentPanelConditions,
  IntentPanelOutcome,
} from "../generated/contracts/consumers.spec-studio.intent-panel.space.js";
import type {
  MemoConditions,
  MemoOutcome,
} from "../generated/contracts/consumers.intent-composition.proposal.memo.space.js";
import type {
  ExportConditions,
  ExportOutcome,
} from "../generated/contracts/consumers.spec-studio.export.space.js";
import type {
  WatchConditions,
  WatchOutcome,
} from "../generated/contracts/consumers.spec-studio.publisher.watch.space.js";
import { sharedContract } from "../generated/contracts/consumers.intent-composition.proposal.memo.shared.contract.js";
import { selfContainedContract } from "../generated/contracts/consumers.spec-studio.export.self-contained.contract.js";
import { matchesPlainRunContract } from "../generated/contracts/consumers.spec-studio.publisher.watch.matches-plain-run.contract.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { fileURLToPath } from "node:url";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { specTest, testAnchorId, specOracle, oracleAnchorId, ref } from "../src/anchors.js";
import { IntentPanel } from "../src/studio-elements/intent-panel.js";
import { renderMemo } from "../src/studio-elements/memo.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { evaluateBody } from "../src/reader/evaluate-body.js";
import { schemaVersion } from "../src/graph/schema.js";
import { readPublishedStudio, studioFilesEqual } from "../src/projections/studio/publish.js";

const assets = {
  script: fileURLToPath(new URL("../dist/studio/studio.js", import.meta.url)),
  stylesheet: fileURLToPath(new URL("../dist/studio/studio.css", import.meta.url)),
};
const cli = (
  args: Parameters<typeof runSdpCli>[0],
  output: Parameters<typeof runSdpCli>[1],
  hooks: Parameters<typeof runSdpCli>[2] = {},
) => runSdpCli(args, output, { studioAssets: assets, ...hooks });
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(members = 3): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-s5-"));
  roots.push(root);
  for (let i = 0; i <= members; i++)
    writeFileSync(
      join(root, `spec${i}.sdp.md`),
      `---\nid: spec:probe.s${i}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${i === 1 ? "\n  dependsOn: spec:probe.s0" : "{}"}\n---\n# Member ${i}\n\n## Intent\n- outcome: Read the design.\n\n## Behavior\n- rule: [#read] Read it.\n`,
    );
  writeFileSync(
    join(root, "pack.pack.sdp.md"),
    `---\nid: pack:probe\nspecs: [${Array.from({ length: members }, (_, i) => `spec:probe.s${i + 1}`).join(", ")}]\n---\n# Probe\n`,
  );
  return root;
}
const proposal = {
  schema: "sdp-proposal/1" as const,
  base: "abc",
  reason: "Review the design.",
  changes: [
    {
      scope: ["spec:probe.s1#rule.read"],
      request: "Change the entry",
      text: "Use ``` here",
      replaces: "spec:probe.s1#rule.read",
    },
    {
      scope: ["spec:probe.s2"],
      request: "Declare a dependency",
      relation: {
        action: "declare" as const,
        from: "spec:probe.s2",
        type: "dependsOn" as const,
        target: "spec:probe.s1",
      },
    },
  ],
};

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
function refresh(gathered: number): number {
  const saved = storage();
  const panel = new IntentPanel(saved, "/preview/12/");
  for (let i = 0; i < gathered; i++)
    panel.gather({ scope: ["spec:probe.s1"], request: `Request ${i}`, action: "propose-example" });
  expect(new IntentPanel(saved, "/preview/13/").intents).toHaveLength(0);
  return new IntentPanel(saved, "/preview/12/").intents.length;
}
function memoProposal(changes: number, ticks: number) {
  return {
    ...proposal,
    changes: proposal.changes
      .slice(0, changes)
      .map((change, index) =>
        index === 0 ? { ...change, text: `Use ${"`".repeat(ticks)} here` } : change,
      ),
  };
}
async function memoResult(changes: number, ticks: number) {
  const document = memoProposal(changes, ticks);
  const answer = (await evaluateBody("return recipes(49, params)", {
    graph: { schemaVersion, nodes: [], edges: [] },
    params: { proposal: document },
  })) as { schemaProblems: unknown[]; memo: string };
  expect(answer.schemaProblems).toEqual([]);
  const memo = renderMemo(document);
  const blocks = [...memo.matchAll(/^(`{3,})json\n([\s\S]*?)^\1$/gmu)];
  const last = blocks.at(-1);
  return {
    identical: answer.memo === memo,
    carriesDocument: JSON.stringify(JSON.parse(last?.[2] ?? "null")) === JSON.stringify(document),
    fence: /^(`+)\nUse /mu.exec(memo)?.[1]?.length ?? 0,
  };
}
async function exportResult(members: number) {
  const root = fixture(members);
  const capture = createCaptureOutput();
  expect(await cli(["studio", root], capture.output), capture.readStderr()).toBe(0);
  const html = readFileSync(join(root, "generated/spec-studio/exports/probe.html"), "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/gu)].map((m) => m[1]);
  const links = [...html.matchAll(/\shref="([^"]+)"/gu)].map((m) => m[1] ?? "");
  expect(html).toContain("Exported from the Spec Studio");
  expect(html).not.toMatch(/<(sdp-compose|sdp-copy|sdp-intent-panel|template)\b/u);
  expect(html).not.toMatch(/<details(?![^>]*\bopen\b)/u);
  return {
    loads: [...html.matchAll(/<(?:link|img|iframe|script)\b[^>]*(?:src|href)="[^#][^"]*"/gu)]
      .length,
    scripts: [...html.matchAll(/<script\b/gu)].length,
    linksInside: links.every(
      (link) => link.startsWith("#") && ids.includes(decodeURIComponent(link.slice(1))),
    ),
    idsUnique: new Set(ids).size === ids.length,
    sections: [...html.matchAll(/data-export-member/gu)].length,
  };
}
async function watchResult(stalePage: string, changes: number) {
  const root = fixture(2);
  const controller = new AbortController();
  const out = createCaptureOutput();
  let emit: ((event: { type: "change"; path: string }) => void) | undefined;
  let cycles = 0;
  let expected: ReturnType<typeof readPublishedStudio>;
  let matches = true;
  let scriptMatches = true;
  const directory = join(root, "generated/spec-studio");
  mkdirSync(join(directory, "specs"), { recursive: true });
  writeFileSync(join(directory, stalePage), "stale");
  const exitCode = await cli(["studio", root, "--watch"], out.output, {
    abortSignal: controller.signal,
    createWatchSource: () => ({
      on: (listener) => {
        emit = listener;
      },
      onError: () => {
        /* This stand-in has no browser event side effect. */
      },
      close: () => {
        /* This stand-in has no browser event side effect. */
      },
    }),
    watchCycleGate: async () => {
      const plain = fixture(2);
      writeFileSync(join(plain, "spec1.sdp.md"), readFileSync(join(root, "spec1.sdp.md"), "utf8"));
      const capture = createCaptureOutput();
      expect(await cli(["studio", plain], capture.output), capture.readStderr()).toBe(0);
      expected = readPublishedStudio(join(plain, "generated/spec-studio"));
    },
    onWatchCycleComplete: (cycle) => {
      expect(cycle.exitCode, out.readStderr()).toBe(0);
      cycles++;
      const actual = readPublishedStudio(directory);
      matches =
        matches &&
        actual !== undefined &&
        expected !== undefined &&
        studioFilesEqual(actual, expected);
      const scripts = (files: typeof actual) =>
        files?.filter((f) => f.path.endsWith(".js")).map((f) => Buffer.from(f.content).toString());
      scriptMatches =
        scriptMatches && JSON.stringify(scripts(actual)) === JSON.stringify(scripts(expected));
      if (cycles <= changes) {
        const path = join(root, "spec1.sdp.md");
        writeFileSync(
          path,
          readFileSync(path, "utf8").replace(/# Member [^\n]+/u, `# Member change ${cycles}`),
        );
        emit?.({ type: "change", path: "spec1.sdp.md" });
      } else controller.abort();
    },
  });
  expect(cycles).toBe(changes + 1);
  return {
    exitCode,
    cyclesMatchPlainRun: matches,
    injectedScript: !scriptMatches,
    staleSurvives: existsSync(join(directory, stalePage)),
    temporarySurvives: existsSync(directory + ".tmp"),
  };
}

const refreshOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-intents"),
  models: ref("spec:consumers.spec-studio.intent-panel"),
});
void refreshOracle;
function expectedRefresh(p: Partial<IntentPanelConditions>): IntentPanelOutcome {
  return p.gathered === undefined
    ? unspecified
    : { kind: "the composing panel holds {kept} gathered intents", kept: p.gathered };
}
const refreshAnchor = specTest({
  id: testAnchorId("test:protocol.studio-intents-refresh"),
  verifies: ref("spec:consumers.spec-studio.intent-panel.refresh-keeps-intents"),
});
void refreshAnchor;
registerRefreshKeepsIntents<{ point: Partial<IntentPanelConditions>; kept: number }>({
  createWorld: (point) => ({ point, kept: 0 }),
  invoke: (w) => {
    w.kept = refresh(w.point.gathered ?? 0);
  },
  expected: expectedRefresh,
  observe: (w) => ({ kind: "the composing panel holds {kept} gathered intents", kept: w.kept }),
});
const memoOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-memo"),
  models: ref("spec:consumers.intent-composition.proposal.memo"),
});
void memoOracle;
function expectedMemo(p: Partial<MemoConditions>): MemoOutcome {
  return p.changes === undefined || p.ticks === undefined
    ? unspecified
    : { kind: "the two memos are byte-identical: {identical}", identical: true };
}
const memoAnchor = specTest({
  id: testAnchorId("test:protocol.studio-memo-shared"),
  verifies: ref("spec:consumers.intent-composition.proposal.memo.shared"),
});
void memoAnchor;
registerShared<{ point: Partial<MemoConditions>; result?: Awaited<ReturnType<typeof memoResult>> }>(
  {
    createWorld: (point) => ({ point }),
    invoke: async (w) => {
      w.result = await memoResult(w.point.changes ?? 0, w.point.ticks ?? 0);
    },
    expected: expectedMemo,
    observe: (w) => ({
      kind: "the two memos are byte-identical: {identical}",
      identical: w.result?.identical ?? false,
    }),
    assertions: (w) => {
      expect(w.result?.carriesDocument).toBe(
        paramsForStep(
          sharedContract,
          "the memo ends with the proposal as JSON in a fenced block: {carriesDocument}",
        ).carriesDocument,
      );
      expect(w.result?.fence).toBe(
        paramsForStep(sharedContract, "the fence around that exact text is {fence} backticks long")
          .fence,
      );
    },
  },
);
const exportOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-export"),
  models: ref("spec:consumers.spec-studio.export"),
});
void exportOracle;
function expectedExport(p: Partial<ExportConditions>): ExportOutcome {
  return p.members === undefined
    ? unspecified
    : { kind: "the export loads {loads} other files", loads: 0 };
}
const exportAnchor = specTest({
  id: testAnchorId("test:protocol.studio-export-contained"),
  verifies: ref("spec:consumers.spec-studio.export.self-contained"),
});
void exportAnchor;
registerSelfContained<{
  point: Partial<ExportConditions>;
  result?: Awaited<ReturnType<typeof exportResult>>;
}>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    w.result = await exportResult(w.point.members ?? 0);
  },
  expected: expectedExport,
  observe: (w) => ({ kind: "the export loads {loads} other files", loads: w.result?.loads ?? -1 }),
  assertions: (w) => {
    expect(w.result?.scripts).toBe(
      paramsForStep(selfContainedContract, "the export holds {scripts} script elements").scripts,
    );
    expect(w.result?.linksInside).toBe(
      paramsForStep(
        selfContainedContract,
        "every link in the export points inside it or is text: {linksInside}",
      ).linksInside,
    );
    expect(w.result?.idsUnique).toBe(
      paramsForStep(selfContainedContract, "no two elements in the export share an id: {idsUnique}")
        .idsUnique,
    );
    expect(w.result?.sections).toBe(
      paramsForStep(selfContainedContract, "the export holds {sections} member sections").sections,
    );
  },
});
const watchOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.studio-watch"),
  models: ref("spec:consumers.spec-studio.publisher.watch"),
});
void watchOracle;
function expectedWatch(p: Partial<WatchConditions>): WatchOutcome {
  return p.changes === undefined || p.stalePage === undefined
    ? unspecified
    : {
        kind: "each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun}",
        cyclesMatchPlainRun: true,
      };
}
const watchAnchor = specTest({
  id: testAnchorId("test:protocol.studio-watch-plain"),
  verifies: ref("spec:consumers.spec-studio.publisher.watch.matches-plain-run"),
});
void watchAnchor;
registerMatchesPlainRun<{
  point: Partial<WatchConditions>;
  result?: Awaited<ReturnType<typeof watchResult>>;
}>({
  createWorld: (point) => ({ point }),
  invoke: async (w) => {
    w.result = await watchResult(w.point.stalePage ?? "", w.point.changes ?? 0);
  },
  expected: expectedWatch,
  observe: (w) => ({
    kind: "each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun}",
    cyclesMatchPlainRun: w.result?.cyclesMatchPlainRun ?? false,
  }),
  assertions: (w) => {
    expect(w.result?.exitCode).toBe(
      paramsForStep(matchesPlainRunContract, "the watch exits {exitCode} on SIGINT").exitCode,
    );
    expect(w.result?.injectedScript).toBe(
      paramsForStep(
        matchesPlainRunContract,
        "the page set holds a script the plain run does not write: {injectedScript}",
      ).injectedScript,
    );
    expect(w.result?.staleSurvives).toBe(
      paramsForStep(matchesPlainRunContract, "the stale page survives: {staleSurvives}")
        .staleSurvives,
    );
    expect(w.result?.temporarySurvives).toBe(
      paramsForStep(
        matchesPlainRunContract,
        "a temporary Studio sibling survives: {temporarySurvives}",
      ).temporarySurvives,
    );
  },
});

import { proposalProblems } from "../src/studio-elements/proposal.js";
import { packExport } from "../src/projections/studio/pages/export-page.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { runInNewContext } from "node:vm";
import { vi } from "vitest";

const safetyAnchor = specTest({
  id: testAnchorId("test:protocol.studio-intent-handoff"),
  verifies: [
    ref("spec:consumers.spec-studio.intent-panel"),
    ref("spec:consumers.edit-model"),
    ref("spec:consumers.intent-composition"),
    ref("spec:consumers.spec-studio.responsive"),
    ref("spec:consumers.spec-studio.export"),
  ],
});
void safetyAnchor;
it("keeps unsupported intents apart and expands Pack members only against the stamped base", () => {
  const panel = new IntentPanel(storage(), "/preview/12/");
  panel.gather({
    scope: ["spec:probe.s1", "spec:probe.s2"],
    pack: "pack:probe",
    request: "Review the member Specs",
    action: "change-entry",
  });
  panel.gather({
    scope: ["spec:probe.s1"],
    pack: "pack:probe",
    request: "Change the framing",
    action: "change-pack",
  });
  panel.gather({
    scope: [],
    pack: "pack:empty",
    request: "Define members",
    action: "change-entry",
  });
  panel.gather({
    scope: ["spec:probe.s1#rule.read"],
    request: "Use new text",
    text: "Exact text",
    replaces: "spec:probe.s1#rule.read",
    action: "change-entry",
  });
  expect(panel.handoff("", "").apart).toHaveLength(4);
  expect(panel.handoff("older", "Reason", "abc").apart).toHaveLength(3);
  const result = panel.handoff("abc", "Reason", "abc");
  expect(result.proposal?.changes.map((c) => c.scope)).toEqual([
    ["spec:probe.s1", "spec:probe.s2"],
    ["spec:probe.s1#rule.read"],
  ]);
  expect(result.apart).toHaveLength(2);
  expect(result.scopedText).toContain("pack:empty");
  expect(proposalProblems(result.proposal)).toEqual([]);
  panel.discard(0);
  expect(panel.intents).toHaveLength(3);
  panel.discardAll();
  expect(new IntentPanel(storage(), "/preview/12/").intents).toHaveLength(0);
});
it("returns the same schema problems as recipe 38 and renders in any corpus", async () => {
  const graph = { schemaVersion, nodes: [], edges: [] };
  const samples: unknown[] = [
    null,
    {},
    { ...proposal, author: "a" },
    { ...proposal, reason: "two\nlines" },
    { ...proposal, changes: [] },
    { ...proposal, changes: [{ scope: ["pack:probe"], request: "x" }] },
    {
      ...proposal,
      changes: [
        {
          scope: ["spec:probe"],
          request: "x",
          replaces: "spec:probe#rule.read",
          follows: "spec:probe#rule.read",
        },
      ],
    },
    {
      ...proposal,
      changes: [
        {
          scope: ["spec:probe"],
          request: "x",
          relation: { action: "bad", from: "bad", type: "uses", target: "bad" },
        },
      ],
    },
  ];
  for (const document of samples) {
    const check = (await evaluateBody("return recipes(38,params)", {
      graph,
      params: { proposal: document, base: graph },
    })) as { schemaProblems: unknown[] };
    const memo = await evaluateBody("return recipes(49,params)", {
      graph,
      params: { proposal: document },
    });
    expect(memo).toEqual({ schemaProblems: check.schemaProblems, memo: null });
    expect(proposalProblems(document)).toEqual(check.schemaProblems);
  }
  const document = {
    ...proposal,
    base: "`base`",
    changes: [
      {
        scope: ["spec:probe#rule.read"],
        request: "Verbatim <&>",
        text: "````\n<script>\n````",
        reason: "Reason",
      },
    ],
  };
  const answer = (await evaluateBody("return recipes(49,params)", {
    graph,
    params: { proposal: document },
  })) as { memo: string };
  expect(answer.memo).toBe(renderMemo(document));
  expect(answer.memo).toContain("Base: `` `base` ``");
  expect(answer.memo).toContain("\n`````\n````\n<script>\n````\n`````\n");
  expect(answer.memo.endsWith("\n")).toBe(true);
});
it("composes locally without changing source or requesting a network service", () => {
  const root = fixture();
  const before = readFileSync(join(root, "spec1.sdp.md"), "utf8");
  const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("No requests"));
  try {
    const saved = storage();
    const panel = new IntentPanel(saved, "/preview/12/");
    panel.gather({
      scope: ["spec:probe.s1"],
      request: "Split this Spec through an ordinary source edit.",
      action: "change-entry",
    });
    const handoff = panel.handoff("abc", "A clearer design");
    expect(handoff.proposal?.changes).toHaveLength(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(readFileSync(join(root, "spec1.sdp.md"), "utf8")).toBe(before);
  } finally {
    fetch.mockRestore();
  }
});
it("keeps the last local intents when storage refuses writes", () => {
  const panel = new IntentPanel(
    {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    },
    "/",
  );
  panel.gather({ scope: ["spec:probe"], request: "Keep this request", action: "change-entry" });
  expect(panel.intents).toHaveLength(1);
  expect(panel.storageProblem).toBe(true);
});
it("rewrites SVG and accessibility references without changing subject attributes or authored text", () => {
  const root = fixture(1);
  const pack = createReader(extract({ root }).graph).packContext("pack:probe");
  if (!pack) throw new Error("No Pack");
  const pages = [
    {
      path: "packs/probe.html",
      content:
        '<main id="main"><h1>Probe</h1><a href="../specs/probe.s1.html#rule.read">Read</a><a href="../specs/probe.s0.html">Outside title</a></main>',
    },
    {
      path: "specs/probe.s1.html",
      content:
        '<main id="main"><sdp-diagram subject="spec:probe.s1" spec-id="spec:probe.s1"><svg aria-describedby="diagram.text"><defs><marker id="arrow"></marker></defs><path marker-end="url(#arrow)"></path></svg><p id="diagram.text">Text</p></sdp-diagram><label for="field">Label</label><p id="rule.read" aria-labelledby="field diagram.text">&lt;a href=&quot;outside&quot;&gt;</p><p id="field">Value</p></main>',
    },
    {
      path: "specs/probe.s0.html",
      content: '<div class="ids"><span><code>spec:probe.s0</code></span></div>',
    },
  ];
  const html = packExport(pack, pages, "body{}").content;
  expect(html).toContain('subject="spec:probe.s1" spec-id="spec:probe.s1"');
  expect(html).toContain('href="#spec:probe.s1/rule.read"');
  expect(html).toContain('marker-end="url(#spec:probe.s1/arrow)"');
  expect(html).toContain('aria-describedby="spec:probe.s1/diagram.text"');
  expect(html).toContain('for="spec:probe.s1/field"');
  expect(html).toContain('aria-labelledby="spec:probe.s1/field spec:probe.s1/diagram.text"');
  expect(html).toContain("<code>spec:probe.s0</code>");
  expect(html).toContain("&lt;a href=&quot;outside&quot;&gt;");
});
it("opens disclosures for print and restores exactly their prior state", () => {
  const definitions = new Map<
    string,
    new () => { connectedCallback(): void; disconnectedCallback(): void }
  >();
  const events = new Map<string, () => void>();
  const details = [{ open: false }, { open: true }];
  const doc = {
    location: { hash: "" },
    createElement: () => ({
      append: () => {
        /* This stand-in has no browser event side effect. */
      },
      setAttribute: () => {
        /* This stand-in has no browser event side effect. */
      },
      addEventListener: () => {
        /* The print probe does not dispatch button events. */
      },
    }),
    defaultView: {
      addEventListener: (type: string, fn: () => void) => {
        events.set(type, fn);
      },
      removeEventListener: (type: string) => events.delete(type),
    },
  };
  class Host {
    ownerDocument = doc;
    querySelectorAll(selector: string) {
      return selector === "details" ? details : [];
    }
    prepend() {
      /* The print probe does not render controls. */
    }
    append() {
      /* The print probe does not render controls. */
    }
  }
  runInNewContext(readFileSync(assets.script, "utf8"), {
    HTMLElement: Host,
    customElements: {
      get: () => undefined,
      define: (
        name: string,
        ctor: new () => { connectedCallback(): void; disconnectedCallback(): void },
      ) => definitions.set(name, ctor),
    },
  });
  const Expander = definitions.get("sdp-expander");
  if (!Expander) throw new Error("No expander");
  const expander = new Expander();
  expander.connectedCallback();
  events.get("beforeprint")?.();
  expect(details.map((d) => d.open)).toEqual([true, true]);
  events.get("afterprint")?.();
  expect(details.map((d) => d.open)).toEqual([false, true]);
  expander.disconnectedCallback();
  expect(events.size).toBe(0);
});

import { spawn } from "node:child_process";
it("stops the actual Studio watch process with exit zero on SIGINT", async () => {
  const root = fixture(1);
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../dist/cli/sdp.js", import.meta.url)), "studio", root, "--watch"],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const stderr: string[] = [];
  let stopped = false;
  child.stderr.on("data", (chunk: Buffer) => {
    stderr.push(chunk.toString());
  });
  child.stdout.on("data", (chunk: Buffer) => {
    if (!stopped && chunk.toString().includes(`Wrote ${root}/generated/spec-studio`)) {
      stopped = true;
      child.kill("SIGINT");
    }
  });
  const exit = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", resolve);
  });
  expect(exit, stderr.join("")).toBe(0);
  expect(stopped).toBe(true);
});
it("removes a failed watch publication, keeps watching and recovers on the next carrier edit", async () => {
  const root = fixture(1);
  const path = join(root, "spec1.sdp.md");
  const original = readFileSync(path, "utf8");
  const controller = new AbortController();
  const outcomes: number[] = [];
  let emit: ((event: { type: "change"; path: string }) => void) | undefined;
  const result = await cli(["studio", root, "--watch"], createCaptureOutput().output, {
    abortSignal: controller.signal,
    createWatchSource: () => ({
      on: (listener) => {
        emit = listener;
      },
      onError: () => {
        /* Errors are absent from this carrier probe. */
      },
      close: () => {
        /* The event source holds no handles. */
      },
    }),
    onWatchCycleComplete: (cycle) => {
      outcomes.push(cycle.exitCode);
      if (cycle.index === 1) {
        writeFileSync(path, "bad carrier");
        emit?.({ type: "change", path: "spec1.sdp.md" });
      } else if (cycle.index === 2) {
        expect(existsSync(join(root, "generated/spec-studio"))).toBe(false);
        expect(existsSync(join(root, "generated/spec-studio.tmp"))).toBe(false);
        writeFileSync(path, original);
        emit?.({ type: "change", path: "spec1.sdp.md" });
      } else controller.abort();
    },
  });
  expect(result).toBe(0);
  expect(outcomes).toEqual([0, 1, 0]);
  expect(existsSync(join(root, "generated/spec-studio/exports/probe.html"))).toBe(true);
});
it("ships a phone layout and a print stylesheet for the whole canvas", () => {
  const css = readFileSync(assets.stylesheet, "utf8");
  expect(css).toContain("@media (max-width: 719.98px)");
  expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
  expect(css).toContain("sdp-diagram svg {\n    width: 100%;\n    height: auto;");
  expect(css).toContain("@media print");
  expect(css).toContain("details > :not(summary)");
  expect(css).toContain("sdp-intent-panel,");
});

import { createStudioData } from "../src/projections/studio/data.js";
import { renderStudio } from "../src/projections/studio/pages/index.js";
it("keeps exports graph-only when the browsing pages receive a base and run records", async () => {
  const graph = extract({ root: fixture(1) }).graph;
  const reader = createReader(graph);
  const plain = renderStudio(await createStudioData(reader));
  const withInputs = renderStudio(
    await createStudioData(reader, undefined, {
      base: { graph, label: "base-commit-123" },
      runs: [{}],
    }),
  );
  expect(withInputs.find((p) => p.path === "exports/probe.html")?.content).toBe(
    plain.find((p) => p.path === "exports/probe.html")?.content,
  );
  expect(withInputs.find((p) => p.path === "packs/probe.html")?.content).toContain(
    "base-commit-123",
  );
});
it("starts no cycle for source or input-file events", async () => {
  const root = fixture(1);
  const controller = new AbortController();
  let emit: ((event: { type: "change"; path: string }) => void) | undefined;
  let carrierChanged = false;
  let observedOnlyCarriers = true;
  let cycles = 0;
  const result = await cli(["studio", root, "--watch"], createCaptureOutput().output, {
    abortSignal: controller.signal,
    createWatchSource: ({ files }) => {
      expect(files).toEqual([]);
      return {
        on: (listener) => {
          emit = listener;
        },
        onError: () => {
          /* No watch errors in this probe. */
        },
        close: () => {
          /* No native handles in this probe. */
        },
      };
    },
    onWatchCycleComplete: () => {
      cycles++;
      if (cycles === 1) {
        emit?.({ type: "change", path: "source.ts" });
        emit?.({ type: "change", path: "runs.json" });
        setImmediate(() => {
          if (controller.signal.aborted) return;
          carrierChanged = true;
          const path = join(root, "spec1.sdp.md");
          writeFileSync(path, readFileSync(path, "utf8").replace("# Member 1", "# Changed member"));
          emit?.({ type: "change", path: "spec1.sdp.md" });
        });
      } else {
        observedOnlyCarriers = carrierChanged;
        controller.abort();
      }
    },
  });
  expect(result).toBe(0);
  expect(cycles).toBe(2);
  expect(observedOnlyCarriers).toBe(true);
});

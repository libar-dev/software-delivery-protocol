import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, it, onTestFinished, vi } from "vitest";
import { runSdpCli } from "../src/cli/sdp.js";
import type { ValidateWatchEvent } from "../src/cli/validate-watch.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { runCorpusRules } from "../src/cli/corpus-rules.js";

vi.mock("node:fs", async (importOriginal) => {
  const fs = await importOriginal<typeof import("node:fs")>();
  return { ...fs, readFileSync: vi.fn(fs.readFileSync) };
});

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const roots: string[] = [];
function probe(cycle = true) {
  const root = mkdtempSync(join(tmpdir(), "sdp-reach-"));
  roots.push(root);
  for (const name of ["one", "two"]) {
    const other = name === "one" ? "two" : "one";
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:probe.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${name === "one" || cycle ? `{dependsOn: spec:probe.${other}}` : "{}"}\n---\n# ${name}\n\n## Intent\n- outcome: Probe recipes.\n`,
    );
  }
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

it("calls the shipped cycle recipe through q", async () => {
  const root = probe();
  const capture = createCaptureOutput();
  expect(
    await runSdpCli(
      ["q", 'return recipes(26, {severity: "warning"})', "--root", root, "--json"],
      capture.output,
    ),
  ).toBe(0);
  expect(JSON.parse(capture.readStdout())).toMatchObject({
    findings: [{ validatorId: "dependency-cycle", severity: "warning" }],
  });
});

it("runs the shipped address recipe unchanged as a rules file", async () => {
  const root = probe(false);
  const capture = createCaptureOutput();
  expect(
    await runSdpCli(
      [
        "validate",
        root,
        "--rules",
        join(repoRoot, "dist/recipes/25-address-resolution.js"),
        "--params",
        '{"addresses":["spec:probe.one#design.absent"]}',
      ],
      capture.output,
    ),
  ).toBe(1);
  expect(capture.readStderr()).toContain("unresolved-address");
  expect(capture.readStdout()).toContain("1 errors · 0 warnings · 0 of 1 files failed");
});

it("calls recipes from a rules file and fails on a dependency cycle", async () => {
  const root = probe();
  const file = join(root, "policy.js");
  writeFileSync(file, "return { findings: (await recipes(26)).findings };");
  const capture = createCaptureOutput();
  expect(await runSdpCli(["validate", root, "--rules", file], capture.output)).toBe(1);
  expect(capture.readStderr()).toContain("[error] dependency-cycle");
  expect(capture.readStdout()).toContain("1 errors · 0 warnings · 0 of 1 files failed");
});

it("combines two external registers in one rules file through the shipped recipe binding", async () => {
  const root = probe(false);
  const carrier = join(root, "one.sdp.md");
  writeFileSync(
    carrier,
    readFileSync(carrier, "utf8").replace("Probe recipes.", "Cite E-2 and R-2."),
  );
  const file = join(root, "registers.js");
  writeFileSync(
    file,
    `
    const first = await recipes(50, params.first);
    const second = await recipes(50, params.second);
    return { findings: [...first.findings, ...second.findings] };
  `,
  );
  for (const held of [false, true]) {
    const capture = createCaptureOutput();
    const params = {
      first: { register: { tokens: [held ? "E-2" : "E-1"] }, pattern: "\\bE-\\d+\\b" },
      second: { register: { tokens: [held ? "R-2" : "R-1"] }, pattern: "\\bR-\\d+\\b" },
    };
    expect(
      await runSdpCli(
        ["validate", root, "--rules", file, "--params", JSON.stringify(params)],
        capture.output,
      ),
    ).toBe(held ? 0 : 1);
    expect(capture.readStdout()).toContain(
      `${String(held ? 0 : 2)} errors · 0 warnings · 0 of 1 files failed`,
    );
    if (!held) {
      expect(capture.readStderr()).toContain("spec:probe.one cites E-2");
      expect(capture.readStderr()).toContain("spec:probe.one cites R-2");
    }
  }
});

it("compiles each shipped recipe once per evaluator context", async () => {
  const { evaluateBody } = await import("../src/reader/evaluate-body.js");
  const { extract } = await import("../src/index.js");
  const { graph } = extract({ root: probe(false) });
  const file = join(repoRoot, "dist/recipes/26-dependency-cycles.js");
  const reads = vi.mocked(readFileSync);
  reads.mockClear();
  const body = "return [await recipes(26), await recipes(26)];";
  expect(await evaluateBody(body, { graph })).toMatchObject([{ findings: [] }, { findings: [] }]);
  expect(reads.mock.calls.filter(([path]) => String(path) === file)).toHaveLength(1);
  await evaluateBody(body, { graph });
  expect(reads.mock.calls.filter(([path]) => String(path) === file)).toHaveLength(2);
});

it("retains immutable reader contexts through repeated recipe calls in one evaluation", async () => {
  const { evaluateBody } = await import("../src/reader/evaluate-body.js");
  const { extract } = await import("../src/index.js");
  const { graph } = extract({ root: probe(false) });
  const body = `
    const before = g.specContext("spec:probe.one");
    await recipes(21, { spec: "spec:probe.one" });
    return { spec: before === g.specContext("spec:probe.one"), specs: g.specs() === g.specs(), packs: g.packs() === g.packs() };
  `;
  expect(await evaluateBody(body, { graph })).toEqual({ spec: true, specs: true, packs: true });
});

it("lets a called recipe call recipes itself with the same rules-file bindings", async () => {
  const { extract, validateGraph } = await import("../src/index.js");
  const fs = await vi.importActual<typeof import("node:fs")>("node:fs");
  const root = probe();
  const file = join(root, "policy.js");
  writeFileSync(file, 'return recipes(26, { severity: "warning" });');
  const { graph } = extract({ root });
  const report = validateGraph(graph);
  const readFile = fs.readFileSync;
  const spy = vi.mocked(readFileSync).mockImplementation((path, options) => {
    if (String(path) === join(repoRoot, "dist/recipes/26-dependency-cycles.js")) {
      return `
        if (params.severity !== "warning" || !g.specContext("spec:probe.one")) throw Error("lost bindings");
        graph.sentinel = params;
        report.sentinel = params;
        g.sentinel = params;
        return recipes(25, { addresses: ["spec:probe.one#design.absent"] });
      `;
    }
    if (String(path) === join(repoRoot, "dist/recipes/25-address-resolution.js")) {
      return `
        if (g.sentinel !== graph.sentinel || report.sentinel !== graph.sentinel) throw Error("copied bindings");
        return { findings: [{ validatorId: "nested-recipe", subjectId: params.addresses[0], severity: graph.sentinel.severity, message: "nested recipe ran" }] };
      `;
    }
    return readFile(path, options);
  });
  try {
    const answer = await runCorpusRules(graph, report, [{ rulesFile: file, params: {} }]);
    expect(answer.corpusFailures).toEqual([]);
    expect(answer.corpusFindings).toEqual([
      {
        rulesFile: file,
        validatorId: "nested-recipe",
        subjectId: "spec:probe.one#design.absent",
        severity: "warning",
        message: "nested recipe ran",
      },
    ]);
    expect(graph).not.toHaveProperty("sentinel");
    expect(report).not.toHaveProperty("sentinel");
  } finally {
    spy.mockImplementation(readFile);
  }
});

it("reports a parameter reread cause without a nested CLI diagnostic", async () => {
  const { extract, validateGraph } = await import("../src/index.js");
  const root = probe(false);
  const file = join(root, "policy.js");
  const params = join(root, "params.json");
  writeFileSync(file, "return {findings:[]};");
  writeFileSync(params, "[]");
  const { graph } = extract({ root });
  const answer = await runCorpusRules(graph, validateGraph(graph), [
    {
      rulesFile: file,
      params: {},
      paramForms: [`@${params}`],
      rereadParams: true,
    },
  ]);
  expect(answer.corpusFailures).toEqual([
    {
      rulesFile: file,
      reason: `its parameters cannot be read (--params file ${JSON.stringify(params)} must be a JSON object, got an array)`,
    },
  ]);
});

it.each(["EACCES", "EPERM"])(
  "keeps watching when an optional ancestor refuses %s",
  async (code) => {
    const { realpathSync } = await import("node:fs");
    const root = probe(false);
    const outside = probe(false);
    const locked = join(outside, "locked");
    const directory = join(locked, "sub");
    mkdirSync(directory, { recursive: true });
    const file = join(directory, "policy.js");
    writeFileSync(file, "return {findings:[]};");
    const callbacks = new Map<string, (event: string, file: string | null) => void>();
    const abort = new AbortController();
    onTestFinished(() => {
      abort.abort();
    });
    const capture = createCaptureOutput();
    const cycles: number[] = [];
    try {
      expect(
        await runSdpCli(["validate", root, "--watch", "--rules", file], capture.output, {
          abortSignal: abort.signal,
          createNativeWatch(path, listener) {
            if (path === realpathSync(locked))
              throw Object.assign(new Error("ancestor denied"), { code });
            callbacks.set(path, listener);
            return {
              on() {
                return undefined;
              },
              close() {
                return undefined;
              },
            };
          },
          onWatchCycleComplete(cycle) {
            cycles.push(cycle.index);
            if (cycle.index === 1) {
              writeFileSync(
                file,
                'return {findings:[{validatorId:"probe",subjectId:"probe",severity:"warning",message:"changed"}]};',
              );
              callbacks.get(realpathSync(directory))?.("change", "policy.js");
            } else abort.abort();
          },
        }),
      ).toBe(0);
      expect(cycles).toEqual([1, 2]);
      expect(capture.readStdout()).toContain("0 errors · 1 warnings · 0 of 1 files failed");
    } finally {
      abort.abort();
    }
  },
);

it.each(["EACCES", "EPERM", "EIO"])(
  "reports %s when the named file's immediate parent cannot be watched",
  async (code) => {
    const { realpathSync } = await import("node:fs");
    const root = probe(false);
    const outside = probe(false);
    const file = join(outside, "policy.js");
    writeFileSync(file, "return {findings:[]};");
    const abort = new AbortController();
    onTestFinished(() => {
      abort.abort();
    });
    const capture = createCaptureOutput();
    try {
      expect(
        await runSdpCli(["validate", root, "--watch", "--rules", file], capture.output, {
          abortSignal: abort.signal,
          createNativeWatch(path) {
            if (path === realpathSync(outside))
              throw Object.assign(new Error("parent denied"), { code });
            return {
              on() {
                return undefined;
              },
              close() {
                return undefined;
              },
            };
          },
        }),
      ).toBe(1);
      expect(capture.readStderr()).toContain("watch failed — parent denied");
      expect(capture.readStdout()).toBe("");
    } finally {
      abort.abort();
    }
  },
);

it.each(["rules", "params", "keyed", "unreadable"])(
  "watches and rereads %s outside discovery",
  async (mode) => {
    const root = probe(false);
    const outside = probe(false);
    const file = join(root, "node_modules/probe/policy.js");
    mkdirSync(dirname(file), { recursive: true });
    const params = join(outside, "params.json");
    writeFileSync(params, '{"one":1}');
    const row = '{validatorId:"probe",subjectId:"probe",severity:"warning",message:"probe"}';
    writeFileSync(
      file,
      `return {findings: Object.keys(${mode === "keyed" ? "params.bundle" : "params"}).map(() => (${row}))};`,
    );
    const abort = new AbortController();
    onTestFinished(() => {
      abort.abort();
    });
    const capture = createCaptureOutput();
    let emit: ((event: ValidateWatchEvent) => void) | undefined;
    const cycles: number[] = [];
    try {
      await runSdpCli(
        [
          "validate",
          root,
          "--watch",
          "--rules",
          file,
          "--params",
          mode === "keyed" ? `bundle=@${params}` : `@${params}`,
        ],
        capture.output,
        {
          abortSignal: abort.signal,
          createWatchSource: () => ({
            on(listener) {
              emit = listener;
            },
            onError() {
              return undefined;
            },
            close() {
              return undefined;
            },
          }),
          onWatchCycleComplete(cycle) {
            cycles.push(cycle.index);
            if (cycle.index === 1) {
              if (mode === "rules")
                writeFileSync(file, `return {findings:[{...${row},severity:"error"}]};`);
              else writeFileSync(params, mode === "unreadable" ? "invalid" : '{"one":1,"two":2}');
              emit?.({ type: "change", path: mode === "rules" ? file : params });
            } else abort.abort();
          },
        },
      );
      expect(cycles).toEqual([1, 2]);
      expect(capture.readStdout().trim().split("\n").at(-1)).toContain(
        mode === "rules"
          ? "1 errors · 0 warnings · 0 of 1 files failed"
          : mode !== "unreadable"
            ? "0 errors · 2 warnings · 0 of 1 files failed"
            : "0 errors · 0 warnings · 1 of 1 files failed",
      );
      if (mode === "unreadable")
        expect(capture.readStderr()).toContain("its parameters cannot be read (");
    } finally {
      abort.abort();
    }
  },
);

it("exports one evaluator from the source, ESM and CommonJS main entries", async () => {
  const { evaluateBody, extract, validateGraph } = await import("../src/index.js");
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const cjs = require("../dist/index.cjs") as { evaluateBody: typeof evaluateBody };
  const esm = await import("../dist/index.js");
  const { graph } = extract({ root: probe() });
  for (const run of [evaluateBody, esm.evaluateBody, cjs.evaluateBody]) {
    expect(await run("return report", { graph })).toEqual(validateGraph(graph));
    expect(await run("return recipes(26)", { graph })).toMatchObject({
      findings: [{ validatorId: "dependency-cycle" }],
    });
    const params = { sentinel: {} };
    expect(await run("return params.sentinel", { graph, params })).toBe(params.sentinel);
    await expect(run("throw params.sentinel", { graph, params })).rejects.toBe(params.sentinel);
    // Replacing the caller's reader method proves the called body receives that very reader.
    await expect(
      run("g.specs = () => { throw params.sentinel }; return recipes(26)", { graph, params }),
    ).rejects.toBe(params.sentinel);
    await expect(run("return {", { graph })).rejects.toThrow(
      "the body does not parse at line 1, column 9:",
    );
  }
});

it.each([null, [], "text", 3, true, new Date()])(
  "refuses non-object parameters %j before running",
  async (params) => {
    const { evaluateBody, extract } = await import("../src/index.js");
    const { graph } = extract({ root: probe() });
    await expect(
      evaluateBody("throw 'ran'", { graph, params: params as unknown as Record<string, unknown> }),
    ).rejects.toThrow("evaluateBody: params takes one parameters object");
    await expect(
      evaluateBody("return recipes(26, params.value)", { graph, params: { value: params } }),
    ).rejects.toThrow("recipes: recipe 26 takes one parameters object");
  },
);

it.each([99, 0, -1, 25.5, "26"])("rejects an unknown recipe number %j by name", async (number) => {
  const { evaluateBody, extract } = await import("../src/index.js");
  const { graph } = extract({ root: probe() });
  await expect(
    evaluateBody("return recipes(params.number)", { graph, params: { number } }),
  ).rejects.toThrow(`recipes: the catalog holds no recipe ${String(number)}`);
});

it("preserves recipe diagnostics and errors and shares the parse error across CLI paths", async () => {
  const root = probe();
  const { evaluateBody, extract } = await import("../src/index.js");
  const { graph } = extract({ root });
  expect(await evaluateBody("return recipes(26, {typo: true})", { graph })).toEqual({
    unknownParams: ["typo"],
    accepts: ["severity"],
  });
  for (const number of [25, 26]) {
    for (const severity of [null, "info", 0])
      expect(
        await evaluateBody("return recipes(params.number, {severity:params.severity})", {
          graph,
          params: { number, severity },
        }),
      ).toEqual({
        diagnostics: [{ parameter: "severity", problem: "Expected error or warning." }],
      });
  }
  const q = createCaptureOutput();
  await runSdpCli(["q", "return {", "--root", root], q.output);
  const file = join(root, "parse.rules");
  writeFileSync(file, "return {");
  const rules = createCaptureOutput();
  await runSdpCli(["validate", root, "--rules", file], rules.output);
  expect(rules.readStderr()).toContain(q.readStderr().trim().replace("sdp q: the body ", ""));
});

it.each([["--help"], ["q", "--help", "--root", "/does-not-exist"]])(
  "names five bindings in help without deriving: %j",
  async (...args) => {
    const capture = createCaptureOutput();
    expect(await runSdpCli(args, capture.output)).toBe(0);
    expect(capture.readStdout()).toContain("Five bindings are injected");
    expect(capture.readStdout()).toContain("recipes(number, parameters?)");
    expect(capture.readStderr()).toBe("");
  },
);

it.each([false, true])(
  "watches named parents through delete and atomic replacement, including symlinks: %s",
  async (alias) => {
    const { renameSync, unlinkSync, symlinkSync, realpathSync } = await import("node:fs");
    const root = probe(false);
    const outside = probe(false);
    const directory = join(outside, "ignored");
    mkdirSync(directory);
    const target = join(directory, "policy.js");
    const file = alias ? join(root, "policy-link.js") : target;
    writeFileSync(target, "return {findings:[]}");
    if (alias) symlinkSync(target, file);
    const nativeDirectory = realpathSync(directory);
    const callbacks = new Map<string, (event: string, file: string | null) => void>();
    const abort = new AbortController();
    onTestFinished(() => {
      abort.abort();
    });
    const capture = createCaptureOutput();
    const exits: number[] = [];
    try {
      await runSdpCli(["validate", root, "--watch", "--rules", file], capture.output, {
        abortSignal: abort.signal,
        createNativeWatch: (directory, listener) => {
          callbacks.set(directory, listener);
          return {
            on() {
              return undefined;
            },
            close() {
              return undefined;
            },
          };
        },
        onWatchCycleComplete(cycle) {
          exits.push(cycle.exitCode);
          if (cycle.index === 1) {
            expect(callbacks.has(nativeDirectory)).toBe(true);
            callbacks.get(nativeDirectory)?.("change", "unrelated.txt");
            unlinkSync(target);
            callbacks.get(nativeDirectory)?.("rename", "policy.js");
          } else if (cycle.index === 2) {
            const temporary = join(directory, "save.tmp");
            writeFileSync(temporary, "return {findings:[]}");
            renameSync(temporary, target);
            callbacks.get(nativeDirectory)?.("rename", "policy.js");
          } else abort.abort();
        },
      });
      expect(exits).toEqual([0, 1, 0]);
      expect(capture.readStderr()).toContain("cannot be read (");
    } finally {
      abort.abort();
    }
  },
);

it("pins findings text, subjects, locations and input order beside the unchanged recipe answers", async () => {
  const { evaluateBody, extract } = await import("../src/index.js");
  const root = probe();
  writeFileSync(
    join(root, "two.sdp.md"),
    readFileSync(join(root, "two.sdp.md"), "utf8") + "\n## Design\n- present: A known entry.\n",
  );
  const { graph } = extract({ root });
  const cycle = await evaluateBody("return recipes(26)", { graph });
  expect(cycle).toEqual({
    totals: { sets: 1, selfDependent: 0, specsInCycles: 2 },
    cycles: [
      {
        members: ["spec:probe.one", "spec:probe.two"],
        cycle: ["spec:probe.one", "spec:probe.two", "spec:probe.one"],
      },
    ],
    findings: [
      {
        validatorId: "dependency-cycle",
        subjectId: "spec:probe.one",
        severity: "error",
        message:
          "spec:probe.one rests on itself through dependsOn: spec:probe.one -> spec:probe.two -> spec:probe.one",
        file: "one.sdp.md",
        line: 6,
      },
    ],
  });
  const address = await evaluateBody("return recipes(25, params)", {
    graph,
    params: {
      addresses: [
        "",
        42,
        "spec:probe.absent#design.key",
        "spec:probe.one#design.absent",
        "spec:probe.two#design.absent",
      ],
      severity: "warning",
    },
  });
  expect(address).toMatchObject({
    findings: [
      {
        validatorId: "unresolved-address",
        subjectId: '""',
        severity: "warning",
        message: '"" does not resolve: not an entry address',
      },
      {
        validatorId: "unresolved-address",
        subjectId: "42",
        severity: "warning",
        message: "42 does not resolve: not an entry address",
      },
      {
        validatorId: "unresolved-address",
        subjectId: "spec:probe.absent#design.key",
        severity: "warning",
        message: "spec:probe.absent#design.key does not resolve: no Spec spec:probe.absent",
      },
      {
        validatorId: "unresolved-address",
        subjectId: "spec:probe.one#design.absent",
        severity: "warning",
        message:
          "spec:probe.one#design.absent does not resolve: spec:probe.one has no design entries",
      },
      {
        validatorId: "unresolved-address",
        subjectId: "spec:probe.two#design.absent",
        severity: "warning",
        message:
          "spec:probe.two#design.absent does not resolve: spec:probe.two has no design entry absent",
      },
    ],
  });
});

it("locates three-member cycles and self-loops at the relation to the path's second id", async () => {
  const { evaluateBody, extract } = await import("../src/index.js");
  const root = mkdtempSync(join(tmpdir(), "sdp-reach-cycles-"));
  roots.push(root);
  for (const [name, relations] of [
    ["a", "  dependsOn:\n    - spec:cycle.d\n    - spec:cycle.b"],
    ["b", "  dependsOn: spec:cycle.c"],
    ["c", "  dependsOn: spec:cycle.a"],
    ["d", "  dependsOn: []"],
    ["s", "\n  dependsOn: spec:cycle.s"],
  ] as const) {
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:cycle.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations:\n${relations}\n---\n# Cycle ${name}\n\n## Intent\n- outcome: Locate cycle findings.\n`,
    );
  }
  const { graph } = extract({ root });
  expect(await evaluateBody("return recipes(26)", { graph })).toMatchObject({
    totals: { sets: 1, selfDependent: 1, specsInCycles: 4 },
    findings: [
      {
        validatorId: "dependency-cycle",
        subjectId: "spec:cycle.a",
        severity: "error",
        message:
          "spec:cycle.a rests on itself through dependsOn: spec:cycle.a -> spec:cycle.b -> spec:cycle.c -> spec:cycle.a",
        file: "a.sdp.md",
        line: 9,
      },
      {
        validatorId: "dependency-cycle",
        subjectId: "spec:cycle.s",
        severity: "error",
        message: "spec:cycle.s rests on itself through dependsOn: spec:cycle.s -> spec:cycle.s",
        file: "s.sdp.md",
        line: 8,
      },
    ],
  });
});

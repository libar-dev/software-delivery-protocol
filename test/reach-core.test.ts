import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, it } from "vitest";
import { runSdpCli } from "../src/cli/sdp.js";
import type { ValidateWatchEvent } from "../src/cli/validate-watch.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

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
    const capture = createCaptureOutput();
    let emit: ((event: ValidateWatchEvent) => void) | undefined;
    const timer = setTimeout(() => {
      abort.abort();
    }, 1000);
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
      clearTimeout(timer);
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
    const capture = createCaptureOutput();
    const exits: number[] = [];
    const timer = setTimeout(() => {
      abort.abort();
    }, 1000);
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
      clearTimeout(timer);
      abort.abort();
    }
  },
);

it("pins findings text, subjects, locations and input order beside the unchanged recipe answers", async () => {
  const { evaluateBody, extract } = await import("../src/index.js");
  const root = probe();
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
      addresses: ["", 42, "spec:probe.absent#design.key", "spec:probe.one#design.absent"],
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
    ],
  });
});

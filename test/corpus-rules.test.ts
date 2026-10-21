import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { parseBuildArgs } from "../src/cli/build-args.js";
import { runValidateRules } from "../src/cli/validate-view-command.js";
import type { ValidateWatchEvent } from "../src/cli/validate-watch.js";
import { runSdpCli, SDP_HELP_TEXT } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const roots: string[] = [];
function probe() {
  const root = mkdtempSync(join(tmpdir(), "sdp-corpus-"));
  roots.push(root);
  for (const [name, relation] of [
    ["first", "{}"],
    ["second", "{refines: spec:probe.first}"],
  ] as const) {
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:probe.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${relation}\n---\n# Probe ${name}\n\n## Intent\n- outcome: Probe the rules runner.\n`,
    );
  }
  return root;
}
function rules(root: string, name: string, body: string) {
  const path = join(root, name);
  writeFileSync(path, body);
  return path;
}
async function validate(root: string, ...args: string[]) {
  const capture = createCaptureOutput();
  const code = await runSdpCli(["validate", root, ...args], capture.output);
  return { code, stdout: capture.readStdout(), stderr: capture.readStderr() };
}
const finding = (severity = "error") =>
  `({ validatorId: "probe-rule", subjectId: "probe-subject", severity: "${severity}", message: "probe finding" })`;
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("corpus rule arguments", () => {
  it("documents repeatable rules, per-file parameters and check-clean", () => {
    expect(SDP_HELP_TEXT).toContain(
      "sdp validate [root] [--exclude PATH]... [--check-clean | --watch] [--rules PATH [--params FORM]...]...",
    );
    expect(SDP_HELP_TEXT).toContain("--rules combines with --check-clean");
  });
  it.each([
    ["--params", "{}"],
    ["--params", "{}", "--rules", "a"],
    ["--rules"],
    ["--rules", "a", "--rules", "./a"],
    ["--rules", "a", "--params", '{"x":1}', "--params", '{"x":2}'],
    ["--rules", "a", "--params", "[]"],
    ["--rules", "a", "--params", "bad"],
    ["--rules", "a", "--params", '{"x":1,"x":2}'],
  ])("refuses %j before deriving", (...args) => {
    const capture = createCaptureOutput();
    expect(parseBuildArgs(args, capture.output, "validate")).toBeUndefined();
    expect(capture.readStderr()).not.toBe("");
  });
  it("binds parameters to the preceding file across other options", () => {
    const capture = createCaptureOutput();
    const parsed = parseBuildArgs(
      [
        "--rules",
        "a",
        "--exclude",
        "x",
        "--params",
        '{"x":1}',
        "--rules",
        "b",
        "--params",
        '{"x":2}',
      ],
      capture.output,
      "validate",
    );
    expect(parsed).toMatchObject({
      rules: [
        { rulesFile: "a", params: { x: 1 } },
        { rulesFile: "b", params: { x: 2 } },
      ],
    });
  });
  it.each(["build", "view", "census", "mermaid", "gherkin", "q"])(
    "refuses rules on %s",
    async (command) => {
      const capture = createCaptureOutput();
      expect(await runSdpCli([command, "--rules", "a"], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("--rules");
    },
  );
});

describe("corpus rules on validate", () => {
  it("refuses the same rules file through a symlink before deriving", async () => {
    const root = probe();
    const file = rules(root, "finding.js", `return { findings: [${finding("warning")}] };`);
    const alias = join(root, "finding-alias.js");
    symlinkSync(file, alias);
    const result = await validate(root, "--rules", file, "--rules", alias);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`--rules file ${JSON.stringify(alias)} was given twice.`);
    expect(result.stdout).toBe("");
  });
  it.each([
    "/etc/passwd",
    "../outside.ts",
    "src/../../outside.ts",
    "src\\\\probe.ts",
    "C:/outside.ts",
  ])("refuses a finding file outside root-relative POSIX paths: %s", async (file) => {
    const root = probe();
    const path = rules(
      root,
      "bad-path.js",
      `return { findings: [{ ...${finding("warning")}, file: ${JSON.stringify(file)}, line: 1 }] };`,
    );
    const result = await validate(root, "--rules", path);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain("finding 1 has no lawful file");
    expect(result.stdout).toContain("0 errors · 0 warnings · 1 of 1 files failed");
  });
  it.each(["src/probe.ts", "src/../probe.ts"])(
    "reports a root-relative finding path: %s",
    async (file) => {
      const root = probe();
      const path = rules(
        root,
        "path.js",
        `return { findings: [{ ...${finding("warning")}, file: ${JSON.stringify(file)}, line: 1 }] };`,
      );
      const result = await validate(root, "--rules", path);
      expect(result.code).toBe(0);
      expect(result.stderr).toContain(`${file}:1`);
    },
  );
  it.each(["error", "warning"])(
    "reports a %s finding apart from Protocol findings",
    async (severity) => {
      const root = probe();
      const file = rules(root, "rules", `return { findings: [${finding(severity)}] };`);
      const result = await validate(root, "--rules", file, "--check-clean");
      expect(result.code).toBe(severity === "error" ? 1 : 0);
      expect(result.stdout).toContain(
        "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)\ncorpus rules:",
      );
      expect(result.stdout).toContain(
        `${severity === "error" ? "1 errors · 0 warnings" : "0 errors · 1 warnings"} · 0 of 1 files failed`,
      );
      expect(result.stderr).toContain(`corpus rules ${file}\n[${severity}] probe-rule`);
    },
  );
  it.each([
    ["throw new Error('two\\nlines')", "threw: two lines"],
    ["return {", "does not parse at line 1, column"],
    ["return { diagnostics: ['bad'] }", 'returned no findings array; diagnostics: ["bad"]'],
    [
      "return { unknownParams: ['typo'], accepts: [] }",
      'returned no findings array; unknownParams: ["typo"]; accepts: []',
    ],
    [
      "return { findings: [{ validatorId: 'a', severity: 'warning', message: 'x' }] }",
      "finding 1 has no lawful subjectId",
    ],
    [
      `return { findings: [{ ...${finding()}, severity: 'info' }] }`,
      "finding 1 has no lawful severity",
    ],
    [
      `return { findings: [{ ...${finding()}, validatorId: 'a/b' }] }`,
      "finding 1 has no lawful validatorId",
    ],
    [`return { findings: [{ ...${finding()}, line: 1 }] }`, "finding 1 has no lawful line"],
    [
      `return { findings: [{ ...${finding()}, relatedId: 1 }] }`,
      "finding 1 has no lawful relatedId",
    ],
    [`return { findings: [{ ...${finding()}, path: 1 }] }`, "finding 1 has no lawful path"],
    [`return { findings: [{ ...${finding()}, file: '' }] }`, "finding 1 has no lawful file"],
  ])("fails a broken file and continues: %s", async (body, reason) => {
    const root = probe();
    const first = rules(root, "broken", body);
    const second = rules(root, "ok", `return { findings: [${finding("warning")}] };`);
    const result = await validate(root, "--rules", first, "--rules", second);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`failed: ${reason}`);
    expect(result.stderr.indexOf(first)).toBeLessThan(result.stderr.indexOf(second));
    expect(result.stdout).toContain("0 errors · 1 warnings · 1 of 2 files failed");
  });
  it("fails an unreadable file", async () => {
    const root = probe();
    expect((await validate(root, "--rules", join(root, "missing"))).stderr).toContain(
      "cannot be read (",
    );
  });
  it("discards every finding of a malformed answer", async () => {
    const root = probe();
    const file = rules(root, "rules", `return { findings: [${finding()}, {}] };`);
    const result = await validate(root, "--rules", file);
    expect(result.stderr).toContain("finding 2 has no lawful validatorId");
    expect(result.stderr).not.toContain("probe finding");
    expect(result.stdout).toContain("0 errors · 0 warnings · 1 of 1 files failed");
  });
  it("clones the graph and report separately for each file and leaves written bytes whole", async () => {
    const root = probe();
    const first = rules(
      root,
      "first.rules",
      "graph.nodes.length = 0; graph.edges.length = 0; report.findings.push({ severity: 'error' }); return { findings: [] };",
    );
    const second = rules(
      root,
      "second.rules",
      "return { findings: graph.nodes.length === 2 && graph.edges.length === 1 && report.findings.length === 0 && !('corpusFindings' in report) && !('corpusFailures' in report) ? [] : [{ validatorId: 'changed', subjectId: 'probe', severity: 'error', message: 'changed' }] };",
    );
    const result = await validate(root, "--rules", first, "--rules", second);
    expect(result.code).toBe(0);
    expect(
      (JSON.parse(readFileSync(join(root, "generated/graph.json"), "utf8")) as { nodes: unknown[] })
        .nodes,
    ).toHaveLength(2);
  });
  it("gives each file only its own parameters, including JSON files and keyed values", async () => {
    const root = probe();
    const json = rules(root, "params.json", '{"x":1}');
    const value = rules(root, "value.json", "[2]");
    const first = rules(
      root,
      "first.rules",
      "return { findings: params.x === 1 && params.list[0] === 2 ? [] : [{ validatorId: 'params', subjectId: 'probe', severity: 'error', message: 'wrong' }] }; ",
    );
    const second = rules(
      root,
      "second.rules",
      "return { findings: Object.keys(params).length === 0 ? [] : [{ validatorId: 'params', subjectId: 'probe', severity: 'error', message: 'leaked' }] }; ",
    );
    expect(
      (
        await validate(
          root,
          "--rules",
          first,
          "--params",
          `@${json}`,
          "--params",
          `list=@${value}`,
          "--rules",
          second,
        )
      ).code,
    ).toBe(0);
  });
  it("keeps the ordinary validate output unchanged and q report free of corpus data", async () => {
    const root = probe();
    expect((await validate(root)).stdout).not.toContain("corpus rules");
    const capture = createCaptureOutput();
    expect(
      await runSdpCli(
        [
          "q",
          "return ['corpusFindings', 'corpusFailures'].filter(key => key in report)",
          "--root",
          root,
          "--json",
        ],
        capture.output,
      ),
    ).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual([]);
  });
  it("does not run rules when the graph does not derive", async () => {
    const root = probe();
    writeFileSync(join(root, "bad.sdp.md"), "---\nid: invalid\n---\n# Bad\n");
    const file = rules(root, "rules", "throw new Error('should not run');");
    const result = await validate(root, "--rules", file);
    expect(result.code).toBe(1);
    expect(result.stdout.trim().split("\n").at(-1)).toBe(
      "corpus rules: not run, the graph did not derive",
    );
    expect(result.stdout).not.toContain("validate:");
    expect(result.stderr).not.toContain("should not run");
  });
});

it("exposes corpus data only on the aggregate validate outcome", async () => {
  const root = probe();
  const capture = createCaptureOutput();
  const first = rules(
    root,
    "ok",
    `return { findings: [{ ...${finding("warning")}, relatedId: "other", path: "design.layer", extra: 1 }] };`,
  );
  const second = rules(root, "bad", "return {}");
  const parsed = parseBuildArgs(
    [root, "--rules", first, "--rules", second],
    capture.output,
    "validate",
  );
  if (parsed === undefined) throw new Error(capture.readStderr());
  const outcome = await runValidateRules(parsed, capture.output);
  expect(outcome.report).toMatchObject({
    findings: [],
    corpusFindings: [{ rulesFile: first, validatorId: "probe-rule" }],
    corpusFailures: [{ rulesFile: second, reason: "returned no findings array" }],
  });
  expect(outcome.report?.corpusFindings[0]).toEqual({
    rulesFile: first,
    validatorId: "probe-rule",
    subjectId: "probe-subject",
    severity: "warning",
    message: "probe finding",
    relatedId: "other",
    path: "design.layer",
  });
});
it("awaits bodies in file order and keeps a Protocol error fatal", async () => {
  const root = probe();
  writeFileSync(
    join(root, "dangling.sdp.md"),
    "---\nid: spec:probe.dangling\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {refines: spec:probe.missing}\n---\n# Dangling\n\n## Intent\n- outcome: Probe a Protocol error.\n",
  );
  const first = rules(
    root,
    "one",
    `await Promise.resolve(); return { findings: [${finding("warning")}] };`,
  );
  const second = rules(root, "two", `return { findings: [${finding("warning")}] };`);
  const result = await validate(root, "--rules", first, "--rules", second);
  expect(result.code).toBe(1);
  expect(result.stderr.indexOf("conformance/")).toBeLessThan(result.stderr.indexOf("corpus rules"));
  expect(result.stderr.indexOf(`corpus rules ${first}`)).toBeLessThan(
    result.stderr.indexOf(`corpus rules ${second}`),
  );
  expect(result.stdout).toContain("corpus rules: 0 errors · 2 warnings");
});

/**
 * @sdpAnchor test:protocol.validate-watch-rules
 * @sdpLabel process checks verify operator stop during active corpus rules
 * @sdpVerifies spec:consumers.validate-watch
 */
it.skipIf(process.platform === "win32").each([false, true])(
  "SIGINT exits 0 during a live rules body, with no later output or rules, even if it can settle: %s",
  async (settlesAfterStop) => {
    const root = probe();
    const first = rules(
      root,
      "pending.js",
      `const interval = setInterval(() => {}, 1000);
console.log("first rule entered");
await new Promise(resolve => {
  ${settlesAfterStop ? 'process.once("SIGINT", () => setImmediate(resolve));' : ""}
});
clearInterval(interval);
console.log("first rule resumed");
return { findings: [] };`,
    );
    const second = rules(
      root,
      "next.js",
      'console.log("second rule ran"); console.error("second rule stderr"); return { findings: [] };',
    );
    const child = spawn(
      process.execPath,
      [
        fileURLToPath(new URL("../dist/cli/sdp.js", import.meta.url)),
        "validate",
        root,
        "--watch",
        "--rules",
        first,
        "--rules",
        second,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) =>
      child.once("close", (code, signal) => {
        resolve({ code, signal });
      }),
    );
    let stdout = "";
    let stderr = "";
    let entered: (() => void) | undefined;
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
      if (stdout.includes("first rule entered\n")) entered?.();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    let startDeadline: ReturnType<typeof setTimeout> | undefined;
    let stopDeadline: ReturnType<typeof setTimeout> | undefined;
    try {
      await new Promise<void>((resolve, reject) => {
        entered = resolve;
        startDeadline = setTimeout(() => {
          reject(new Error(`first rules body did not start: ${stderr}`));
        }, 10000);
        child.once("error", reject);
        child.once("close", () => {
          reject(new Error(`watch exited before stop: ${stderr}`));
        });
      });
      clearTimeout(startDeadline);
      const beforeStop = { stdout, stderr };
      expect(child.kill("SIGINT")).toBe(true);
      const stopped = await Promise.race([
        exited,
        new Promise<never>((_resolve, reject) => {
          stopDeadline = setTimeout(() => {
            reject(new Error("watch did not exit within 2s of SIGINT during a rules body"));
          }, 2000);
        }),
      ]);
      expect(stopped).toEqual({ code: 0, signal: null });
      expect({ stdout, stderr }).toEqual(beforeStop);
      expect(stdout).not.toContain("second rule ran");
      expect(stderr).not.toContain("second rule stderr");
    } finally {
      clearTimeout(startDeadline);
      clearTimeout(stopDeadline);
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
      await exited;
    }
  },
  15000,
);

it("rereads rules when its file changes", async () => {
  const root = probe();
  const file = rules(root, "rules.js", "return { findings: [] };");
  const capture = createCaptureOutput();
  const abort = new AbortController();
  let listener: ((event: ValidateWatchEvent) => void) | undefined;
  const completed: number[] = [];
  const running = runSdpCli(["validate", root, "--watch", "--rules", file], capture.output, {
    abortSignal: abort.signal,
    createWatchSource: () => ({
      on: (callback) => {
        listener = callback;
      },
      onError: () => {
        /* This event source never fails. */
      },
      close: () => {
        /* No native watch handle is allocated. */
      },
    }),
    onWatchCycleComplete: (cycle) => {
      completed.push(cycle.exitCode);
      if (cycle.index === 1) {
        writeFileSync(file, `return { findings: [${finding()}] };`);
        listener?.({ type: "change", path: "rules.js" });
      } else abort.abort();
    },
  });
  try {
    expect(await running).toBe(0);
    expect(completed).toEqual([0, 1]);
    expect(capture.readStdout()).toContain("corpus rules: 1 errors · 0 warnings");
  } finally {
    abort.abort();
  }
});

it("gives each watch cycle fresh parameters after a body mutates them", async () => {
  const root = probe();
  const file = rules(
    root,
    "rules.js",
    `const findings = params.x === 1 ? [] : [${finding()}]; params.x = 2; return { findings };`,
  );
  const capture = createCaptureOutput();
  const abort = new AbortController();
  let listener: ((event: ValidateWatchEvent) => void) | undefined;
  const completed: number[] = [];
  try {
    const code = await runSdpCli(
      ["validate", root, "--watch", "--rules", file, "--params", '{"x":1}'],
      capture.output,
      {
        abortSignal: abort.signal,
        createWatchSource: () => ({
          on: (callback) => {
            listener = callback;
          },
          onError: () => {
            /* This event source never fails. */
          },
          close: () => {
            /* No native watch handle is allocated. */
          },
        }),
        onWatchCycleComplete: (cycle) => {
          completed.push(cycle.exitCode);
          if (cycle.index === 1) listener?.({ type: "change", path: "first.sdp.md" });
          else abort.abort();
        },
      },
    );
    expect(code).toBe(0);
    expect(completed).toEqual([0, 0]);
  } finally {
    abort.abort();
  }
});

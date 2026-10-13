import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseBuildArgs } from "../src/cli/build-args.js";
import { runValidateRules } from "../src/cli/validate-view-command.js";
import type { ValidateWatchEvent } from "../src/cli/validate-watch.js";
import { runSdpCli } from "../src/cli/sdp.js";
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
      "graph.nodes.length = 0; report.findings.push({ severity: 'error' }); return { findings: [] };",
    );
    const second = rules(
      root,
      "second.rules",
      "return { findings: graph.nodes.length === 2 && report.findings.length === 0 && !('corpusFindings' in report) && !('corpusFailures' in report) ? [] : [{ validatorId: 'changed', subjectId: 'probe', severity: 'error', message: 'changed' }] };",
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
  const first = rules(root, "ok", `return { findings: [${finding("warning")}] };`);
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
it("rereads rules on the next carrier cycle and ignores a rules-file event", async () => {
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
        queueMicrotask(() => listener?.({ type: "change", path: "first.sdp.md" }));
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

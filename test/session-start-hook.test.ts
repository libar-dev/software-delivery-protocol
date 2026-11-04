import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

// The session-start hook (spec:decisions.session-start-hook): the shared hooks file the plugin
// ships, the checkout's temporary wiring, and what the one script prints for the session's project.
// Whether Claude Code and Codex activate it is a live-session check; these tests prove the files
// and the script.

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const hook = join(repoRoot, "hooks/session-start.mjs");
const packageName = "@libar-dev/software-delivery-protocol";
// Claude Code caps hook output at 10,000 characters; Codex spills one hook's context past about
// 2,500 tokens. The script bounds its output under both.
const maxCharacters = 7_500;

const scratch = mkdtempSync(join(tmpdir(), "sdp-session-start-"));
afterAll(() => {
  rmSync(scratch, { recursive: true, force: true });
});

function carrier(id: string, title: string): string {
  return `---
id: ${id}
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# ${title}

## Intent
- outcome: The session-start hook orients this project.
`;
}

/** A project with the package installed (linked to this checkout) and the given carriers. */
function consumer(name: string, carriers: Record<string, string> = {}): string {
  const root = join(scratch, name);
  mkdirSync(join(root, "node_modules", "@libar-dev"), { recursive: true });
  symlinkSync(repoRoot, join(root, "node_modules", ...packageName.split("/")), "dir");
  writeFileSync(join(root, "package.json"), JSON.stringify({ name, private: true }));
  for (const [file, text] of Object.entries(carriers)) writeFileSync(join(root, file), text);
  return root;
}

function runHook(input: Record<string, unknown> | undefined, cwd = scratch) {
  return spawnSync(process.execPath, [hook], {
    cwd,
    encoding: "utf8",
    input: input === undefined ? "" : JSON.stringify(input),
  });
}

interface AsyncRun {
  /** Settles when the copy exits. */
  readonly done: Promise<{ status: number; stdout: string }>;
  /** True once the copy has exited. */
  readonly exited: () => boolean;
}

function startHook(input: Record<string, unknown>): AsyncRun {
  let exited = false;
  const done = new Promise<{ status: number; stdout: string }>((settle, fail) => {
    const child = spawn(process.execPath, [hook], { cwd: scratch });
    let stdout = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.on("error", fail);
    child.on("close", (status) => {
      exited = true;
      settle({ status: status ?? -1, stdout });
    });
    child.stdin.end(JSON.stringify(input));
  });
  return { done, exited: () => exited };
}

function runHookAsync(input: Record<string, unknown>): Promise<{ status: number; stdout: string }> {
  return startHook(input).done;
}

interface EventPaths {
  readonly directory: string;
  readonly claim: string;
  readonly lock: string;
}

/** The claim and lock files the hook coordinates one session event's copies through. */
async function eventPaths(input: Record<string, unknown>): Promise<EventPaths> {
  const module = (await import(pathToFileURL(hook).href)) as {
    eventPaths: (input: Record<string, unknown>) => EventPaths | undefined;
  };
  const paths = module.eventPaths(input);
  if (paths === undefined) throw new Error("an input with a session id has event paths");
  mkdirSync(paths.directory, { recursive: true });
  return paths;
}

/** An installed package whose orientation runner is the given script, for the hook's failure paths. */
function stubbedConsumer(name: string, runner: string): string {
  const root = join(scratch, name);
  const installed = join(root, "node_modules", ...packageName.split("/"));
  mkdirSync(join(installed, "skills", "sdp-agent-surface", "scripts"), { recursive: true });
  writeFileSync(join(installed, "package.json"), JSON.stringify({ name: packageName }));
  writeFileSync(join(installed, "skills", "sdp-agent-surface", "scripts", "orient.mjs"), runner);
  return root;
}

const ownProject = consumer("own", { "own.sdp.md": carrier("spec:package.own", "Own corpus") });
const emptyProject = consumer("empty");

describe("the session-start hook", () => {
  it("orients the Protocol checkout from a subdirectory within the output bound", () => {
    const run = runHook({ cwd: join(repoRoot, "specs"), source: "startup" });

    expect(run.status).toBe(0);
    expect(run.stdout).toMatch(/^Orientation answers 1 and 5 for the project at /u);
    expect(run.stdout).toContain(`for the project at ${repoRoot}, `);
    expect(run.stdout).toContain("`node skills/sdp-agent-surface/scripts/orient.mjs --only 1,5`");
    expect(run.stdout).toContain("## 1. The corpus and its surface");
    expect(run.stdout).toContain("## 5. Next work");
    expect(run.stdout).toContain("pack:roadmap");
    expect(run.stdout.length).toBeLessThanOrEqual(maxCharacters + 1);
  }, 60_000);

  it("orients the project the session runs in, never the plugin's own corpus", () => {
    // The five page roots a validate, build or publisher run would remove first.
    const roots = ["census", "design-review", "gherkin", "mermaid", "spec-studio"];
    for (const root of roots) {
      mkdirSync(join(ownProject, "generated", root), { recursive: true });
      writeFileSync(join(ownProject, "generated", root, "sentinel.txt"), root);
    }
    mkdirSync(join(ownProject, "sub"), { recursive: true });

    for (const cwd of [ownProject, join(ownProject, "sub")]) {
      const run = runHook({ cwd, source: "startup" });

      expect(run.status).toBe(0);
      expect(run.stdout).toContain(`for the project at ${ownProject}, `);
      expect(run.stdout).toContain(
        "`node node_modules/@libar-dev/software-delivery-protocol/skills/sdp-agent-surface/scripts/orient.mjs --only 1,5`",
      );
      expect(run.stdout).toContain("specs: 1,");
      expect(run.stdout).not.toContain("pack:roadmap");
    }
    expect(
      roots.filter((root) => !existsSync(join(ownProject, "generated", root, "sentinel.txt"))),
    ).toEqual([]);
  }, 60_000);

  it("prints one short line where the package is installed but no Spec derives", () => {
    const run = runHook({ cwd: emptyProject });

    expect(run.status).toBe(0);
    expect(run.stdout).toBe(
      `No Spec derives at ${emptyProject} yet, so the session-start hook has no orientation answers to add.\n`,
    );
  }, 60_000);

  it("prints nothing where no package is installed, with or without hook input", () => {
    const bare = join(scratch, "bare");
    mkdirSync(bare, { recursive: true });

    expect(runHook({ cwd: bare })).toMatchObject({ status: 0, stdout: "" });
    expect(runHook(undefined, bare)).toMatchObject({ status: 0, stdout: "" });
    expect(runHook({ cwd: 42 }, bare)).toMatchObject({ status: 0, stdout: "" });
  });

  it("prints the one-line remedy where the runner cannot run", () => {
    // A checkout whose dist/ is absent, such as a fresh worktree.
    const unbuilt = join(scratch, "unbuilt");
    mkdirSync(join(unbuilt, "src", "cli"), { recursive: true });
    writeFileSync(join(unbuilt, "src", "cli", "sdp.ts"), "");
    writeFileSync(
      join(unbuilt, "package.json"),
      JSON.stringify({ name: packageName, bin: { sdp: "./dist/cli/sdp.js" } }),
    );
    symlinkSync(join(repoRoot, "skills"), join(unbuilt, "skills"), "dir");
    // An installed package without the reading skill's runner.
    const runnerless = join(scratch, "runnerless");
    mkdirSync(join(runnerless, "node_modules", ...packageName.split("/")), { recursive: true });
    writeFileSync(
      join(runnerless, "node_modules", ...packageName.split("/"), "package.json"),
      JSON.stringify({ name: packageName }),
    );

    const remedy = (root: string, reason: string, runner: string) =>
      `Orientation did not run at session start (${reason}). From ${root}: node ${runner} --only 1,5\n`;
    expect(runHook({ cwd: unbuilt })).toMatchObject({
      status: 0,
      stdout: remedy(
        unbuilt,
        "sdp q: dist/ is absent in the Protocol checkout; run `npm run build` first",
        "skills/sdp-agent-surface/scripts/orient.mjs",
      ),
    });
    expect(runHook({ cwd: runnerless })).toMatchObject({
      status: 0,
      stdout: remedy(
        runnerless,
        "the package has no orientation runner",
        `node_modules/${packageName}/skills/sdp-agent-surface/scripts/orient.mjs`,
      ),
    });
  }, 60_000);

  it("names the refused carrier where the project's graph does not derive", () => {
    const refused = consumer("refused", {
      "own.sdp.md": carrier("spec:package.own", "Own corpus"),
      "broken.sdp.md": "not a spec\n",
    });
    const run = runHook({ cwd: refused, source: "startup" });

    expect(run.status).toBe(0);
    expect(run.stdout).toMatch(
      /^Orientation did not run at session start \(broken\.sdp\.md:\d+ — \[error\] extract\/[^)]*\)\. From /u,
    );
    expect(run.stdout).toContain(
      `From ${refused}: node node_modules/${packageName}/skills/sdp-agent-surface/scripts/orient.mjs --only 1,5\n`,
    );
    expect(run.stdout.split("\n")).toHaveLength(2);
  }, 60_000);

  it("keeps a failure to one short line, however long the runner's diagnostics", () => {
    const noisy = stubbedConsumer(
      "noisy",
      'process.stderr.write("sdp q: " + "x".repeat(12000) + "\\n");\nprocess.exitCode = 1;\n',
    );
    const run = runHook({ cwd: noisy, source: "startup" });

    expect(run.status).toBe(0);
    expect(run.stdout).toMatch(/^Orientation did not run at session start \(sdp q: x+…\)\. From /u);
    expect(run.stdout.split("\n")).toHaveLength(2);
    expect(run.stdout.length).toBeLessThan(600);
  }, 60_000);

  it("gives the runner a deadline, which stops the graph query's own process", () => {
    // The hook hands its deadline to the runner, which enforces it on the CLI it spawns.
    const recorded = join(scratch, "argv.json");
    const recording = stubbedConsumer(
      "recording",
      `import { writeFileSync } from "node:fs";\nwriteFileSync(${JSON.stringify(recorded)}, JSON.stringify(process.argv.slice(2)));\nprocess.stdout.write(JSON.stringify([{ number: 1, answer: { specs: 0 } }]));\n`,
    );
    expect(runHook({ cwd: recording, source: "startup" }).stdout).toBe(
      `No Spec derives at ${recording} yet, so the session-start hook has no orientation answers to add.\n`,
    );
    expect(JSON.parse(readFileSync(recorded, "utf8"))).toEqual([
      "--only",
      "1,5",
      "--json",
      "--timeout",
      "25000",
    ]);

    // A checkout whose CLI never answers: the runner stops it at the deadline and says so.
    const slow = join(scratch, "slow");
    const pidFile = join(scratch, "slow-cli.pid");
    mkdirSync(join(slow, "src", "cli"), { recursive: true });
    mkdirSync(join(slow, "dist", "cli"), { recursive: true });
    writeFileSync(join(slow, "src", "cli", "sdp.ts"), "");
    writeFileSync(
      join(slow, "package.json"),
      JSON.stringify({ name: packageName, bin: { sdp: "./dist/cli/sdp.js" } }),
    );
    writeFileSync(
      join(slow, "dist", "cli", "sdp.js"),
      `require("node:fs").writeFileSync(${JSON.stringify(pidFile)}, String(process.pid));\nsetTimeout(() => undefined, 120000);\n`,
    );
    const started = Date.now();
    const run = spawnSync(
      process.execPath,
      [
        join(repoRoot, "skills/sdp-agent-surface/scripts/orient.mjs"),
        "--only",
        "1",
        "--timeout",
        "1000",
      ],
      { cwd: slow, encoding: "utf8" },
    );

    expect(run.status).toBe(1);
    expect(run.stderr).toContain(
      "orient: the graph query did not finish within 1000 ms and was stopped",
    );
    expect(Date.now() - started).toBeLessThan(20_000);
    const pid = Number(readFileSync(pidFile, "utf8"));
    expect(() => process.kill(pid, 0)).toThrow();
  }, 60_000);

  it("shortens a long answer to the output bound and names the full command", () => {
    const entries = Array.from(
      { length: 150 },
      (_, index) => `spec:package.entry-${String(index)}`,
    );
    const carriers = Object.fromEntries(
      entries.map((id, index) => [
        `entry-${String(index)}.sdp.md`,
        carrier(id, `Entry ${String(index)}`),
      ]),
    );
    carriers["roadmap.pack.sdp.md"] = `---
id: pack:roadmap
order: priority
specs:
${entries.map((id) => `  - ${id}`).join("\n")}
---
# Roadmap
`;
    const run = runHook({ cwd: consumer("long", carriers) });

    expect(run.status).toBe(0);
    expect(run.stdout.length).toBeLessThanOrEqual(maxCharacters + 1);
    expect(run.stdout).toContain("## 5. Next work");
    expect(run.stdout).toMatch(
      /\n… shortened to 7500 characters; `node node_modules\/@libar-dev\/software-delivery-protocol\/skills\/sdp-agent-surface\/scripts\/orient\.mjs --only 1,5` prints both answers in full\.\n$/u,
    );
  }, 60_000);

  it("prints once for copies of one session event, run together or one after another", async () => {
    const session = randomUUID();
    const copies = await Promise.all([
      runHookAsync({ cwd: ownProject, session_id: session, source: "startup" }),
      runHookAsync({ cwd: ownProject, session_id: session, source: "startup" }),
    ]);

    expect(copies.map((copy) => copy.status)).toEqual([0, 0]);
    expect(copies.filter((copy) => copy.stdout !== "")).toHaveLength(1);
    // A client that runs its copies in turn starts the next as soon as the first exits.
    expect(runHook({ cwd: ownProject, session_id: session, source: "startup" }).stdout).toBe("");
  }, 60_000);

  it("prints again for the session's next event, of the same source or another", async () => {
    const session = randomUUID();
    const input = { cwd: ownProject, session_id: session, source: "resume" };

    expect(runHook(input).stdout).toContain("specs: 1,");
    expect(runHook({ ...input, source: "compact" }).stdout).toContain("specs: 1,");
    // A second resume a few seconds after the first one's answers is another event.
    await sleep(2_500);
    expect(runHook(input).stdout).toContain("specs: 1,");
  }, 60_000);

  it("lets exactly one copy replace an expired claim, however the copies interleave", async () => {
    const input = { cwd: ownProject, session_id: randomUUID(), source: "resume" };
    const paths = await eventPaths(input);
    const expired = JSON.stringify({ started: 1, finished: 1, token: "earlier" });

    // Two copies find the same expired claim while a third holds the lock; on release, the one
    // that takes the lock first replaces the claim and the other finds it fresh.
    writeFileSync(paths.claim, expired);
    writeFileSync(paths.lock, "held");
    const racing = [startHook(input), startHook(input)];
    await sleep(500);
    expect(racing.map((copy) => copy.exited())).toEqual([false, false]);
    rmSync(paths.lock);
    const raced = await Promise.all(racing.map((copy) => copy.done));
    expect(raced.filter((copy) => copy.stdout !== "")).toHaveLength(1);

    // A copy waiting on the lock reads the claim the holder wrote, never the one it found first.
    writeFileSync(paths.claim, expired);
    writeFileSync(paths.lock, "held");
    const waiting = startHook(input);
    await sleep(500);
    expect(waiting.exited()).toBe(false);
    writeFileSync(paths.claim, JSON.stringify({ started: Date.now(), token: "holder" }));
    rmSync(paths.lock);
    expect(await waiting.done).toEqual({ status: 0, stdout: "" });
  }, 60_000);
});

describe("the session-start hook's wiring", () => {
  const readJson = (path: string) =>
    JSON.parse(readFileSync(join(repoRoot, path), "utf8")) as {
      hooks: Record<string, { matcher?: string; hooks: Record<string, unknown>[] }[]>;
    };
  const handlers = (path: string) =>
    Object.entries(readJson(path).hooks).flatMap(([event, groups]) =>
      groups.flatMap((group) =>
        group.hooks.map((handler): Record<string, unknown> => ({ event, ...handler })),
      ),
    );

  // Each wiring, resolved as its client resolves it, runs the one script in an installed project.
  it("runs the one script from the plugin's hooks file and the checkout's temporary wiring", () => {
    const input = JSON.stringify({ cwd: emptyProject, source: "startup" });
    const expected = `No Spec derives at ${emptyProject} yet, so the session-start hook has no orientation answers to add.\n`;

    const [plugin] = handlers("hooks/hooks.json");
    expect(plugin).toMatchObject({
      event: "SessionStart",
      type: "command",
      command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs"',
    });
    const pluginRun = spawnSync(String(plugin?.command), {
      cwd: emptyProject,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: repoRoot },
      input,
      shell: true,
    });
    expect(pluginRun).toMatchObject({ status: 0, stdout: expected });

    // Claude Code, from project settings: exec form, the project-root placeholder substituted.
    const claude = handlers(".claude/settings.json");
    expect(claude).toEqual([
      {
        event: "SessionStart",
        type: "command",
        command: "node",
        args: ["${CLAUDE_PROJECT_DIR}/hooks/session-start.mjs"],
        timeout: 30,
        statusMessage: "Deriving orientation answers",
      },
    ]);
    const claudeRun = spawnSync(
      process.execPath,
      (claude[0]?.args as string[]).map((arg) => arg.replace("${CLAUDE_PROJECT_DIR}", repoRoot)),
      { cwd: emptyProject, encoding: "utf8", input },
    );
    expect(claudeRun).toMatchObject({ status: 0, stdout: expected });

    // Codex, from the project layer: shell form through the git root, run from a subdirectory.
    const codex = handlers(".codex/hooks.json");
    expect(codex).toEqual([
      {
        event: "SessionStart",
        type: "command",
        command: 'node "$(git rev-parse --show-toplevel)/hooks/session-start.mjs"',
        timeout: 30,
        statusMessage: "Deriving orientation answers",
      },
    ]);
    const codexRun = spawnSync(String(codex[0]?.command), {
      cwd: join(repoRoot, "specs"),
      encoding: "utf8",
      input,
      shell: true,
    });
    expect(codexRun).toMatchObject({ status: 0, stdout: expected });
  }, 60_000);

  it("ships the plugin's hooks file and keeps the checkout's wiring out of the package", () => {
    const { files } = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
      files: string[];
    };

    expect(files).toContain("hooks/**");
    expect(files.filter((path) => path.startsWith(".claude") || path.startsWith(".codex"))).toEqual(
      [],
    );
  });
});

#!/usr/bin/env node
// The session-start hook the package ships in its Agent Plugin (spec:decisions.session-start-hook).
// Claude Code and Codex run it from `hooks/hooks.json` at the plugin root; the Protocol checkout
// wires it for now from `.claude/settings.json` and `.codex/hooks.json`. Both clients add its
// standard output to the model's context.
//
// It orients the session's own project, never the plugin's: the Protocol checkout holding the hook
// input's `cwd`, or else the nearest directory at or above it with a `package.json`, such as a
// workspace member. The reading-skill runner of the nearest installed package, run from that
// directory, prints orientation answers 1 and 5, within a bounded size. It prints
// answers, never rules. It prints one short line when the runner fails or no Spec derives, nothing
// where no package is installed, and nothing for a second copy of the same session event, such as
// the plugin's and the checkout's wiring both firing. Clients pass no event id, so a copy is told
// from the next event by time: a copy that starts while another runs, or within two seconds after
// it ends, is a copy. It exits 0 on every path, and never validates, builds or publishes.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, parse, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";

const packageName = "@libar-dev/software-delivery-protocol";
const runnerPath = "skills/sdp-agent-surface/scripts/orient.mjs";
const answers = "1,5";
// Under Claude Code's 10,000-character hook output cap and Codex's default limit of about 2,500
// tokens for one hook's context.
const maxCharacters = 7_500;
// The longest reason a failure line quotes from the runner.
const maxReason = 200;
// The runner stops its graph query at this deadline; the client's own timeout is 30 seconds.
const queryTimeoutMs = 25_000;
// A claim still running after this long belongs to a copy the client killed at its timeout.
const runningClaimMs = 35_000;
// After a copy finishes, a copy the client starts next is silent this long: a client that runs
// copies one after another starts the next at once.
const finishedGraceMs = 2_000;
// How long a copy waits for another to finish reading or writing the claim before it prints anyway.
const lockWaitMs = 2_000;

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

/** The JSON object both clients write to standard input, or `{}` when there is none. */
function hookInput() {
  if (process.stdin.isTTY) return {};
  try {
    const input = JSON.parse(readFileSync(0, "utf8"));
    return input !== null && typeof input === "object" ? input : {};
  } catch {
    return {};
  }
}

/**
 * The session's project, `{ root, runner }`. The Protocol checkout is its own project. Elsewhere the
 * root is the nearest directory at or above `cwd` with a `package.json`, so a workspace member reads
 * its own corpus, and the runner is the nearest installed package's at or above it, which a
 * workspace may hold at its root; without a `package.json` below the installation, the root is the
 * directory holding it.
 */
function findProject(cwd) {
  let boundary;
  for (let dir = cwd; ; dir = dirname(dir)) {
    const own = readJson(join(dir, "package.json"));
    if (own?.name === packageName && existsSync(join(dir, "src", "cli", "sdp.ts")))
      return { root: dir, runner: join(dir, runnerPath) };
    if (boundary === undefined && existsSync(join(dir, "package.json"))) boundary = dir;
    const installed = join(dir, "node_modules", ...packageName.split("/"));
    if (readJson(join(installed, "package.json"))?.name === packageName)
      return { root: boundary ?? dir, runner: join(installed, runnerPath) };
    if (dir === parse(dir).root) return undefined;
  }
}

/**
 * The files that coordinate the copies of one session event: the claim, and the lock under which
 * one copy at a time reads or writes it. None without a session id, where every copy prints.
 */
export function eventPaths(input, directory = join(tmpdir(), "sdp-session-start")) {
  if (typeof input.session_id !== "string" || input.session_id === "") return undefined;
  const key = createHash("sha256")
    .update(`${input.session_id}\0${String(input.source ?? "")}`)
    .digest("hex")
    .slice(0, 32);
  return { directory, claim: join(directory, key), lock: join(directory, `${key}.lock`) };
}

function pause(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Runs `step` while this copy alone holds the lock, and returns its result; `{ timedOut: true }`
 * when the lock stays held past the wait. A lock left by a killed copy is never broken, so the
 * copies after it print rather than stay silent.
 */
function whileLocked(lock, step) {
  const deadline = Date.now() + lockWaitMs;
  for (;;) {
    try {
      writeFileSync(lock, String(process.pid), { flag: "wx" });
      break;
    } catch (error) {
      if (error?.code !== "EEXIST" || Date.now() >= deadline) return { timedOut: true };
      pause(20);
    }
  }
  try {
    return { value: step() };
  } finally {
    rmSync(lock, { force: true });
  }
}

function readClaim(claim) {
  const value = readJson(claim);
  return typeof value?.started === "number" ? value : undefined;
}

/**
 * Claims this session event for this copy of the hook. Returns `{ print, finish }`: `print` is
 * false when another copy holds the event, running now or finished within the grace; `finish`
 * records that this copy's run ended. Expiry is read and the claim replaced under the lock, so two
 * copies that find one expired claim never both win.
 */
export function claimEvent(input, paths = eventPaths(input)) {
  const open = { print: true, finish: () => undefined };
  if (paths === undefined) return open;
  try {
    mkdirSync(paths.directory, { recursive: true });
    const claimed = whileLocked(paths.lock, () => {
      const now = Date.now();
      const current = readClaim(paths.claim);
      const held =
        current !== undefined &&
        (typeof current.finished === "number"
          ? now - current.finished < finishedGraceMs
          : now - current.started < runningClaimMs);
      if (held) return undefined;
      const token = `${String(process.pid)}-${String(now)}`;
      writeFileSync(paths.claim, JSON.stringify({ started: now, token }));
      return token;
    });
    if (claimed.timedOut === true) return open;
    if (claimed.value === undefined) return { print: false, finish: () => undefined };
    const finish = () => {
      try {
        whileLocked(paths.lock, () => {
          const current = readClaim(paths.claim);
          if (current?.token === claimed.value)
            writeFileSync(paths.claim, JSON.stringify({ ...current, finished: Date.now() }));
        });
      } catch {
        // The claim stays running and lapses after its window.
      }
    };
    return { print: true, finish };
  } catch {
    // No writable temporary directory: print rather than stay silent.
    return open;
  }
}

function clip(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}

function bounded(text, command) {
  if (text.length <= maxCharacters) return text;
  const note = `\n… shortened to ${String(maxCharacters)} characters; \`${command}\` prints both answers in full.`;
  const room = maxCharacters - note.length;
  const cut = text.lastIndexOf("\n", room);
  return `${text.slice(0, cut > 0 ? cut : room)}${note}`;
}

/** The line that says why the runner failed: a refused carrier's own line first. */
function failureReason(run) {
  const lines = `${run.error?.message ?? ""}\n${run.stderr ?? ""}`
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("hint:"))
    .filter((line) => !line.startsWith("sdp q: this skill comes from"));
  return (
    lines.find((line) => /:\d+ — \[error\] /u.test(line)) ??
    lines.find((line) => /^(\w*Error\b|sdp\b|orient\b)/u.test(line)) ??
    lines.at(-1) ??
    `exit ${String(run.status)}`
  );
}

function orientation(project) {
  const command = `node ${relative(project.root, project.runner)} --only ${answers}`;
  const failed = (reason) =>
    `Orientation did not run at session start (${clip(reason.replace(/\.$/u, ""), maxReason)}). From ${project.root}: ${command}`;
  if (!existsSync(project.runner)) return failed("the package has no orientation runner");

  // The runner stops its own graph query at the deadline; this timeout only backs it up.
  const run = spawnSync(
    process.execPath,
    [project.runner, "--only", answers, "--json", "--timeout", String(queryTimeoutMs)],
    {
      cwd: project.root,
      encoding: "utf8",
      timeout: queryTimeoutMs + 3_000,
      killSignal: "SIGKILL",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (run.error !== undefined || run.status !== 0) return failed(failureReason(run));

  let parsed;
  try {
    parsed = JSON.parse(run.stdout);
  } catch {
    return failed("its answers were not JSON");
  }
  if (parsed.find((answer) => answer.number === 1)?.answer?.specs === 0)
    return `No Spec derives at ${project.root} yet, so the session-start hook has no orientation answers to add.`;

  const render = (value) =>
    inspect(value, {
      depth: Infinity,
      maxArrayLength: Infinity,
      maxStringLength: Infinity,
      breakLength: 120,
    });
  const header =
    `Orientation answers 1 and 5 for the project at ${project.root}, derived when this session ` +
    `started by \`${command}\`. The sdp-agent-surface skill's references/orientation.md says how ` +
    "to read each; the same runner gives the other answers.";
  const sections = parsed.map((answer) =>
    [
      `## ${String(answer.number)}. ${String(answer.title)}`,
      answer.error === undefined ? render(answer.answer) : `FAILED: ${String(answer.error)}`,
      `Read it with ${String(answer.notes)}`,
    ].join("\n\n"),
  );
  return bounded([header, ...sections].join("\n\n"), command);
}

function main() {
  process.stdout.on("error", () => {
    // The client stopped reading; the session starts without this context.
  });
  try {
    const input = hookInput();
    const cwd = typeof input.cwd === "string" && input.cwd !== "" ? input.cwd : process.cwd();
    const project = findProject(resolve(cwd));
    if (project === undefined) return;
    const event = claimEvent(input);
    if (!event.print) return;
    const text = orientation(project);
    event.finish();
    process.stdout.write(`${text}\n`);
  } catch {
    // Context is optional; the session starts without it.
  }
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
  main();
}

#!/usr/bin/env node
// The session-start hook the package ships in its Agent Plugin (spec:decisions.session-start-hook).
// Claude Code and Codex run it from `hooks/hooks.json` at the plugin root; the Protocol checkout
// wires it for now from `.claude/settings.json` and `.codex/hooks.json`. Both clients add its
// standard output to the model's context.
//
// It orients the session's own project, never the plugin's: the nearest directory, at or above the
// hook input's `cwd`, that is the Protocol checkout or holds the installed package. That project's
// own reading-skill runner prints orientation answers 1 and 5, within a bounded size. It prints
// answers, never rules. It prints one line when the runner fails or no Spec derives, nothing where
// no package is installed, and nothing for a second copy of the same session event, such as the
// plugin's and the checkout's wiring both firing. It exits 0 on every path, and never validates,
// builds or publishes.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, parse, relative, resolve } from "node:path";
import { inspect } from "node:util";

const packageName = "@libar-dev/software-delivery-protocol";
const runnerPath = "skills/sdp-agent-surface/scripts/orient.mjs";
const answers = "1,5";
// Under Claude Code's 10,000-character hook output cap and Codex's default limit of about 2,500
// tokens for one hook's context.
const maxCharacters = 7_500;
// How long a claimed session event keeps a second copy silent: longer than one run may take.
const claimWindowMs = 60_000;

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

/** The session's project, `{ root, runner }`: the Protocol checkout or a directory holding the package. */
function findProject(cwd) {
  for (let dir = cwd; ; dir = dirname(dir)) {
    const own = readJson(join(dir, "package.json"));
    if (own?.name === packageName && existsSync(join(dir, "src", "cli", "sdp.ts")))
      return { root: dir, runner: join(dir, runnerPath) };
    const installed = join(dir, "node_modules", ...packageName.split("/"));
    if (readJson(join(installed, "package.json"))?.name === packageName)
      return { root: dir, runner: join(installed, runnerPath) };
    if (dir === parse(dir).root) return undefined;
  }
}

/**
 * Claims this session event for this copy of the hook. Returns false when another copy claimed the
 * same session and source within the window; copies of one event start together, so the first
 * exclusive create wins. A claim older than the window is an earlier event: one copy moves it aside
 * and claims anew.
 */
function claimEvent(input) {
  if (typeof input.session_id !== "string" || input.session_id === "") return true;
  const key = createHash("sha256")
    .update(`${input.session_id}\0${String(input.source ?? "")}`)
    .digest("hex")
    .slice(0, 32);
  const directory = join(tmpdir(), "sdp-session-start");
  const claim = join(directory, key);
  try {
    mkdirSync(directory, { recursive: true });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const now = Date.now();
      try {
        writeFileSync(claim, String(now), { flag: "wx" });
        return true;
      } catch (error) {
        if (error?.code !== "EEXIST") return true;
      }
      let claimed;
      try {
        claimed = Number(readFileSync(claim, "utf8"));
      } catch {
        continue; // Another copy moved a stale claim aside; try the exclusive create again.
      }
      // An empty claim is one another copy is writing now.
      if (!(claimed > 0) || now - claimed < claimWindowMs) return false;
      const stale = `${claim}.${String(process.pid)}`;
      try {
        renameSync(claim, stale);
        rmSync(stale, { force: true });
      } catch {
        // Another copy moved it first.
      }
    }
  } catch {
    // No writable temporary directory: print rather than stay silent.
  }
  return true;
}

function bounded(text, command) {
  if (text.length <= maxCharacters) return text;
  const note = `\n… shortened to ${String(maxCharacters)} characters; \`${command}\` prints both answers in full.`;
  const room = maxCharacters - note.length;
  const cut = text.lastIndexOf("\n", room);
  return `${text.slice(0, cut > 0 ? cut : room)}${note}`;
}

function orientation(project) {
  const command = `node ${relative(project.root, project.runner)} --only ${answers}`;
  const failed = (reason) =>
    `Orientation did not run at session start (${reason}). From ${project.root}: ${command}`;
  if (!existsSync(project.runner)) return failed("the package has no orientation runner");

  const run = spawnSync(process.execPath, [project.runner, "--only", answers, "--json"], {
    cwd: project.root,
    encoding: "utf8",
    timeout: 25_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (run.error !== undefined || run.status !== 0) {
    const lines = `${run.error?.message ?? ""}\n${run.stderr ?? ""}`
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("hint:"));
    const reason =
      lines.find((line) => /^(\w*Error\b|sdp\b|orient\b)/u.test(line)) ??
      lines.at(-1) ??
      `exit ${String(run.status)}`;
    return failed(reason.replace(/\.$/u, ""));
  }

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

process.stdout.on("error", () => {
  // The client stopped reading; the session starts without this context.
});
try {
  const input = hookInput();
  const cwd = typeof input.cwd === "string" && input.cwd !== "" ? input.cwd : process.cwd();
  const project = findProject(resolve(cwd));
  if (project !== undefined && claimEvent(input)) process.stdout.write(`${orientation(project)}\n`);
} catch {
  // Context is optional; the session starts without it.
}

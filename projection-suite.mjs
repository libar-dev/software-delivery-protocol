import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, realpathSync, renameSync, rmSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const projectionCommands = [
  ["view", "design-review"],
  ["census", "census"],
  ["mermaid", "mermaid"],
  ["gherkin", "gherkin"],
  ["studio", "spec-studio"],
];

const argv = process.argv.slice(2);
const requestedRoot = argv.shift();

if (requestedRoot === undefined || requestedRoot.startsWith("--")) {
  console.error("projection-suite: expected an extraction root as the first argument");
  process.exit(1);
}

const checkClean = argv.includes("--check-clean");
const forwarded = argv.filter((argument) => argument !== "--check-clean");
const root = isAbsolute(requestedRoot) ? requestedRoot : resolve(process.cwd(), requestedRoot);
const generatedRoot = join(root, "generated");
const suiteRoot = join(generatedRoot, ".projection-suite.tmp");
const beforeRoot = join(suiteRoot, "before");
const afterRoot = join(suiteRoot, "after");

let generatedIdentity;
function check(path) {
  let parent = dirname(path);
  while (!existsSync(parent)) {
    if (lstatSync(parent, { throwIfNoEntry: false })?.isSymbolicLink())
      throw new Error(`unsafe output parent ${parent}`);
    parent = dirname(parent);
  }
  const nested = relative(realpathSync(root), realpathSync(parent));
  if (nested === ".." || nested.startsWith(`..${sep}`) || isAbsolute(nested))
    throw new Error(`unsafe output parent ${parent}`);
  const current = lstatSync(generatedRoot, { throwIfNoEntry: false });
  if (current) {
    if (!current.isDirectory()) throw new Error(`unsafe output parent ${generatedRoot}`);
    if (
      generatedIdentity &&
      (generatedIdentity.dev !== current.dev || generatedIdentity.ino !== current.ino)
    )
      throw new Error("generated directory identity changed");
    generatedIdentity = current;
  } else if (generatedIdentity) throw new Error("generated directory disappeared");
}
function remove(path, options) {
  check(path);
  // A tree removal retries when a folder gains an entry mid-removal, as Finder does with .DS_Store.
  rmSync(path, options?.recursive ? { maxRetries: 5, retryDelay: 50, ...options } : options);
  check(path);
}
function mkdir(path, options) {
  check(join(path, ".boundary"));
  mkdirSync(path, options);
  check(join(path, ".boundary"));
}
function rename(from, to) {
  check(from);
  check(to);
  renameSync(from, to);
  check(to);
}

function projectionPath(name) {
  return join(generatedRoot, name);
}

function removeLiveProjections() {
  for (const [, name] of projectionCommands) {
    remove(projectionPath(name), { recursive: true, force: true });
    remove(`${projectionPath(name)}.tmp`, { recursive: true, force: true });
  }
}

function fail(message) {
  console.error(message);
  try {
    removeLiveProjections();
    remove(suiteRoot, { recursive: true, force: true });
  } catch (error) {
    console.error(`projection-suite: cleanup refused: ${error.message}`);
  }
  process.exit(1);
}

try {
  remove(suiteRoot, { recursive: true, force: true });
  mkdir(beforeRoot, { recursive: true });
  mkdir(afterRoot, { recursive: true });

  // Under --check-clean, each published root moves aside before any build invalidates it, and
  // moves back just before its own publisher reads it. Renames, never copies: a rename cannot race
  // a folder gaining a file, as Finder does with .DS_Store. A plain run reads no prior root, so it
  // stages none.
  if (checkClean) {
    for (const [, name] of projectionCommands) {
      const live = projectionPath(name);
      if (existsSync(live)) rename(live, join(beforeRoot, name));
    }
  }

  for (const [command, name] of projectionCommands) {
    if (checkClean) {
      const prior = join(beforeRoot, name);
      if (!existsSync(prior)) {
        fail(`projection-suite: ${name} has no published tree to certify`);
      }
      remove(projectionPath(name), { recursive: true, force: true });
      rename(prior, projectionPath(name));
    }

    const result = spawnSync(
      process.execPath,
      [
        join(process.cwd(), "dist", "cli", "sdp.js"),
        command,
        root,
        ...forwarded,
        ...(checkClean ? ["--check-clean"] : []),
      ],
      { cwd: process.cwd(), encoding: "utf8", stdio: "inherit" },
    );

    if (result.error !== undefined) {
      throw result.error;
    }
    if (result.status !== 0) {
      fail(`projection-suite: ${command} failed with exit code ${String(result.status)}`);
    }

    const live = projectionPath(name);
    if (!existsSync(live)) {
      fail(`projection-suite: ${command} did not publish ${name}`);
    }
    rename(live, join(afterRoot, name));
  }

  removeLiveProjections();
  for (const [, name] of projectionCommands) {
    rename(join(afterRoot, name), projectionPath(name));
  }
  remove(suiteRoot, { recursive: true, force: true });
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  fail(`projection-suite: ${detail}`);
}

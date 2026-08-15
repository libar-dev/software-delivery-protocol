import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

const projectionCommands = [
  ["view", "design-review"],
  ["census", "census"],
  ["mermaid", "mermaid"],
  ["gherkin", "gherkin"],
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

function projectionPath(name) {
  return join(generatedRoot, name);
}

function removeLiveProjections() {
  for (const [, name] of projectionCommands) {
    rmSync(projectionPath(name), { recursive: true, force: true });
    rmSync(`${projectionPath(name)}.tmp`, { recursive: true, force: true });
  }
}

function fail(message) {
  console.error(message);
  removeLiveProjections();
  rmSync(suiteRoot, { recursive: true, force: true });
  process.exit(1);
}

try {
  rmSync(suiteRoot, { recursive: true, force: true });
  mkdirSync(beforeRoot, { recursive: true });
  mkdirSync(afterRoot, { recursive: true });

  for (const [, name] of projectionCommands) {
    const live = projectionPath(name);
    if (existsSync(live)) {
      cpSync(live, join(beforeRoot, name), { recursive: true });
    }
  }

  for (const [command, name] of projectionCommands) {
    if (checkClean) {
      const prior = join(beforeRoot, name);
      if (!existsSync(prior)) {
        fail(`projection-suite: ${name} has no published tree to certify`);
      }
      rmSync(projectionPath(name), { recursive: true, force: true });
      cpSync(prior, projectionPath(name), { recursive: true });
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
    renameSync(live, join(afterRoot, name));
  }

  removeLiveProjections();
  for (const [, name] of projectionCommands) {
    renameSync(join(afterRoot, name), projectionPath(name));
  }
  rmSync(suiteRoot, { recursive: true, force: true });
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  fail(`projection-suite: ${detail}`);
}

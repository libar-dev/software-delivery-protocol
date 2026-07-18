import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const scratchRoot = join(repoRoot, ".tmp-scratch");
const sdpPath = join(repoRoot, "dist", "cli", "sdp.js");

// The check pipeline owns precisely these outputs. Root dist/ is package assembly rather than
// generated truth; broader ignored runtime garbage remains a manual inspection responsibility.
const generationTargets = [
  {
    name: "self-hosting",
    generatedPath: "generated",
    sourcePaths: ["specs", "src", "test"],
    command: [
      "view",
      "--exclude",
      "explorations",
      "--exclude",
      "examples",
      "--exclude",
      "test/fixtures/import/parity",
    ],
  },
  {
    name: "checkout-v1",
    generatedPath: "examples/checkout-v1/generated",
    sourcePaths: [
      "examples/checkout-v1/specs",
      "examples/checkout-v1/src",
      "examples/checkout-v1/test",
    ],
    command: ["view", "examples/checkout-v1", "--check-clean"],
  },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });

  if (result.error !== undefined) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed:\n${result.stderr}`);
  }

  return result.stdout;
}

function readTree(root) {
  const files = new Map();

  if (!existsSync(root)) {
    return files;
  }

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const relativePath = entry.name;
    const absolutePath = join(root, relativePath);

    if (entry.isDirectory()) {
      for (const [childPath, content] of readTree(absolutePath)) {
        files.set(join(relativePath, childPath), content);
      }
    } else if (entry.isFile()) {
      files.set(relativePath, readFileSync(absolutePath, "utf8"));
    }
  }

  return files;
}

function compareGeneratedTree(target, expectedRoot) {
  const actual = readTree(join(repoRoot, target.generatedPath));
  const expected = readTree(expectedRoot);
  const paths = new Set([...actual.keys(), ...expected.keys()]);

  return [...paths]
    .sort()
    .filter((path) => actual.get(path) !== expected.get(path))
    .map((path) => join(target.generatedPath, path));
}

function regenerateExpectedTree(target) {
  mkdirSync(scratchRoot, { recursive: true });
  const temporaryRoot = mkdtempSync(join(scratchRoot, "preflight-"));

  try {
    for (const sourcePath of target.sourcePaths) {
      cpSync(join(repoRoot, sourcePath), join(temporaryRoot, sourcePath), { recursive: true });
    }

    run(process.execPath, [sdpPath, ...target.command], { cwd: temporaryRoot });
    return compareGeneratedTree(target, join(temporaryRoot, target.generatedPath));
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function isGeneratedPath(path) {
  return generationTargets.some(
    (target) => path === target.generatedPath || path.startsWith(`${target.generatedPath}/`),
  );
}

function gitLines(args) {
  const output = run("git", args, { cwd: repoRoot });
  return output.split("\n").filter(Boolean);
}

function semanticPaths() {
  return [
    ...new Set([
      ...gitLines(["diff", "--name-only"]),
      ...gitLines(["diff", "--cached", "--name-only"]),
    ]),
  ]
    .filter((path) => !isGeneratedPath(path))
    .sort();
}

function main() {
  const status = gitLines(["status", "--short", "--untracked-files=all"]);
  const nonignoredUntracked = gitLines(["ls-files", "--others", "--exclude-standard"])
    .filter((path) => !isGeneratedPath(path))
    .sort();
  const trackedGeneratedWrites = [
    ...new Set([
      ...gitLines(["diff", "--name-only"]),
      ...gitLines(["diff", "--cached", "--name-only"]),
    ]),
  ]
    .filter(isGeneratedPath)
    .sort();
  const generatedDrift = generationTargets.flatMap((target) => regenerateExpectedTree(target));
  const failures = [];

  if (trackedGeneratedWrites.length > 0) {
    failures.push(
      `preflight: tracked writes inside script-owned generated paths:\n${trackedGeneratedWrites.join(
        "\n",
      )}`,
    );
  }

  if (generatedDrift.length > 0) {
    failures.push(
      `preflight: generated drift not attributable to the generation scripts:\n${generatedDrift.join(
        "\n",
      )}`,
    );
  }

  if (nonignoredUntracked.length > 0) {
    failures.push(`preflight: nonignored runtime garbage:\n${nonignoredUntracked.join("\n")}`);
  }

  const semantic = semanticPaths();
  console.log("preflight: semantic diff summary");
  console.log(semantic.length === 0 ? "clean" : semantic.join("\n"));

  if (status.length > 0) {
    console.log("preflight: tracked/untracked status inspected");
  }

  if (failures.length > 0) {
    console.error(failures.join("\n\n"));
    process.exit(1);
  }
}

main();

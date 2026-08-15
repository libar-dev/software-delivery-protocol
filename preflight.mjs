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

import { trackedRegistrarDifferences } from "./preflight-registrars.mjs";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const scratchRoot = join(repoRoot, ".tmp-scratch");

// The relocated runtime: builder trust is physical identity to the *running* package's modules, so
// the clean-room must carry its own `dist/` and `package.json` and execute those. Running the
// repo's binary against a copied tree would lawfully lose every relative-import anchor and make the
// comparison meaningless; running the copy's binary proves the regeneration is relocation-independent.
const runtimePaths = ["dist", "package.json", "preflight-registrars.mjs", "projection-suite.mjs"];

// The check pipeline owns precisely these outputs. Root dist/ is package assembly rather than
// generated truth; broader ignored runtime garbage remains a manual inspection responsibility.
const generationTargets = [
  {
    name: "self-hosting",
    rootPath: ".",
    generatedPath: "generated",
    sourcePaths: ["specs", "src", "test"],
    command: [
      ".",
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
    rootPath: "examples/checkout-v1",
    generatedPath: "examples/checkout-v1/generated",
    sourcePaths: [
      "examples/checkout-v1/specs",
      "examples/checkout-v1/src",
      "examples/checkout-v1/test",
    ],
    command: ["examples/checkout-v1"],
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
    // Finder drops .DS_Store into any browsed directory; it is OS metadata, never generated content.
    if (entry.name === ".DS_Store") {
      continue;
    }

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

function compareGeneratedTree(target, actual, expected) {
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
    for (const sourcePath of [...runtimePaths, ...target.sourcePaths]) {
      cpSync(join(repoRoot, sourcePath), join(temporaryRoot, sourcePath), { recursive: true });
    }

    run(process.execPath, [join(temporaryRoot, "projection-suite.mjs"), ...target.command], {
      cwd: temporaryRoot,
    });

    const expectedGenerated = readTree(join(temporaryRoot, target.generatedPath));
    const manifestText = expectedGenerated.get("registrars.json");
    const expectedRegistrars = new Map();

    if (manifestText !== undefined) {
      const manifest = JSON.parse(manifestText);
      for (const registrarPath of manifest.files ?? []) {
        expectedRegistrars.set(
          join(target.rootPath, registrarPath).replaceAll("\\", "/").replace(/^\.\//u, ""),
          readFileSync(join(temporaryRoot, target.rootPath, registrarPath), "utf8"),
        );
      }
    }

    return {
      generatedDrift: compareGeneratedTree(
        target,
        readTree(join(repoRoot, target.generatedPath)),
        expectedGenerated,
      ),
      expectedRegistrars,
    };
  } finally {
    // Finder/Spotlight can drop metadata into the tree mid-delete; retry the transient ENOTEMPTY.
    rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
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
  const regenerated = generationTargets.map((target) => regenerateExpectedTree(target));
  const generatedDrift = regenerated.flatMap((result) => result.generatedDrift);
  const expectedRegistrars = new Map(
    regenerated.flatMap((result) => [...result.expectedRegistrars.entries()]),
  );
  const trackedRegistrars = gitLines(["ls-files", "--", ":(glob)**/*.test.generated.ts"]).sort();
  const registrarDrift = trackedRegistrars.flatMap((path) =>
    trackedRegistrarDifferences(
      path,
      expectedRegistrars.get(path),
      existsSync(join(repoRoot, path)) ? readFileSync(join(repoRoot, path), "utf8") : undefined,
      run("git", ["show", `:${path}`], { cwd: repoRoot }),
    ),
  );
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

  if (registrarDrift.length > 0) {
    failures.push(`preflight: tracked adopted registrar drift:\n${registrarDrift.join("\n")}`);
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

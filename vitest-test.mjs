import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
const vitestArgs = argv.includes("--run") ? argv : ["--run", ...argv];
const repositoryRoot = dirname(fileURLToPath(import.meta.url));

// One row per generated contract tree, listing every test file that imports from it. Rows stay
// per-tree so the recovery command a missing tree names is stated once, never repeated per suite.
const contractDependencies = [
  {
    contracts: "generated/contracts",
    generation: "npm run generate:self-hosting",
    testPaths: [
      "test/self-hosting-carrier.test.ts",
      "test/self-hosting-duplicate-ids.test.ts",
      "test/self-hosting-extraction.test.ts",
      "test/self-hosting-model.test.ts",
      "test/self-hosting-sdp-import.test.ts",
      "test/self-hosting-validators.test.ts",
    ],
  },
  {
    contracts: "examples/checkout-v1/generated/contracts",
    generation: "npm run generate:example",
    testPaths: ["examples/checkout-v1/test/orders/create-order.valid-cart.test.ts"],
  },
];

const pathFilters = argv.filter((argument) => !argument.startsWith("-"));
const hasPathFilter = pathFilters.length > 0;
const cliTestPath = "test/cli.test.ts";

// Vitest accepts substring, ./-prefixed, and absolute file filters; dependency matching must
// recognize every spelling of the same repository-relative test path.
function normalizePathFilter(filter) {
  let value = filter.replaceAll("\\", "/");

  if (isAbsolute(value)) {
    value = relative(repositoryRoot, value).replaceAll("\\", "/");
  }

  while (value.startsWith("./")) {
    value = value.slice(2);
  }

  return value.toLowerCase();
}

const matchesPathFilter = (testPath, filter) =>
  testPath.toLowerCase().includes(normalizePathFilter(filter));
const selectsCliTest = pathFilters.some((filter) => matchesPathFilter(cliTestPath, filter));
const requiredContracts = hasPathFilter
  ? contractDependencies.filter((dependency) =>
      dependency.testPaths.some((testPath) =>
        pathFilters.some((filter) => matchesPathFilter(testPath, filter)),
      ),
    )
  : contractDependencies;
const missingContracts = requiredContracts.filter(
  (dependency) => !existsSync(dependency.contracts),
);

if (missingContracts.length > 0) {
  const recovery = [
    "npm run build",
    ...missingContracts.map((dependency) => dependency.generation),
  ].join(" && ");
  console.error(
    `Generated contracts required by the selected test suite are missing.\nRun \`${recovery}\` first.`,
  );
  process.exit(1);
}

function runVitest(args) {
  const result = spawnSync("vitest", args, { stdio: "inherit" });

  if (result.error !== undefined) {
    throw result.error;
  }

  return result.status ?? 1;
}

function fingerprintGeneratedTree() {
  const treeRoot = "generated";

  if (!existsSync(treeRoot)) {
    return "absent";
  }

  const hash = createHash("sha256");
  const walk = (directory) => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
    );

    for (const entry of entries) {
      const path = join(directory, entry.name);
      hash.update(path);
      hash.update("\0");

      if (entry.isDirectory()) {
        walk(path);
      } else {
        hash.update(readFileSync(path));
        hash.update("\0");
      }
    }
  };
  walk(treeRoot);

  return hash.digest("hex");
}

// Only the dedicated test/cli.test.ts pass may regenerate repository-root generated/; every
// pooled run is fingerprinted so a root-mutating pooled test fails loudly instead of racing.
function runPooledVitest(args) {
  const before = fingerprintGeneratedTree();
  const exitCode = runVitest(args);

  if (fingerprintGeneratedTree() !== before) {
    console.error(
      "A pooled test run mutated repository-root generated/ state; only the dedicated test/cli.test.ts pass may regenerate it.",
    );
    return exitCode === 0 ? 1 : exitCode;
  }

  return exitCode;
}

if (argv.includes("--help")) {
  process.exit(runVitest(vitestArgs));
}

if (hasPathFilter && !selectsCliTest) {
  process.exit(runPooledVitest(vitestArgs));
}

if (hasPathFilter) {
  const parallelExitCode = runPooledVitest([
    ...vitestArgs,
    "--exclude",
    cliTestPath,
    "--passWithNoTests",
  ]);

  if (parallelExitCode !== 0) {
    process.exit(parallelExitCode);
  }

  process.exit(
    runVitest(["--run", cliTestPath, "--pool", "forks", "--poolOptions.forks.singleFork"]),
  );
}

// The default-root CLI case owns repository-root generated/. Keep its whole file in a dedicated
// process; every other test file remains in Vitest's normal parallel pool.
const parallelExitCode = runPooledVitest([...vitestArgs, "--exclude", cliTestPath]);

if (parallelExitCode !== 0) {
  process.exit(parallelExitCode);
}

process.exit(
  runVitest(["--run", cliTestPath, "--pool", "forks", "--poolOptions.forks.singleFork"]),
);

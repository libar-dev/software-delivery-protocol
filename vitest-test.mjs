import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { parseCLI } from "vitest/node";

import { contractDependentSuites } from "./contract-dependent-suites.mjs";

// pnpm forwards a literal `--` to the script, as does `npm test -- -- ...`. Vitest ignores every
// argument after `--`, the caller's filters and the exclusion the wrapper appends alike, so the
// wrapper drops it and Vitest reads what follows as ordinary arguments.
const argv = process.argv.slice(2).filter((argument) => argument !== "--");
const vitestArgs = argv.includes("--run") ? argv : ["--run", ...argv];
const repositoryRoot = dirname(fileURLToPath(import.meta.url));

// One row per generated contract tree, listing every test file that imports from it. Rows stay
// per-tree so the recovery command a missing tree names is stated once, never repeated per suite.
// The rows live in `contract-dependent-suites.mjs` — the shared module `eslint.config.js` reads
// too, so a new bound suite is named once and both surfaces follow.
const contractDependencies = contractDependentSuites;

// Help and the version execute no test, and parsing help prints usage, so they are forwarded once
// and never parsed.
const forwardedOnce = new Set(["--help", "-h", "--version", "-v"]);
const parseVitest = (args) =>
  parseCLI(["vitest", "run", ...args.filter((argument) => !forwardedOnce.has(argument))]);

// Vitest's own parser separates file filters from option values, so `--reporter verbose` keeps
// the dedicated CLI pass and the contract preflight. A bare argument is a filter only where that
// parser counts one; otherwise it is the value of the option before it. Parsing behind a fixed
// `run` keeps a selected command such as `list` among the positionals instead of consuming it.
const { options } = parseVitest(argv);
const positional = argv.map(() => false);
let filtersSoFar = 0;
for (const [index, argument] of argv.entries()) {
  if (argument.startsWith("-")) continue;
  const filters = parseVitest(argv.slice(0, index + 1)).filter.length;
  positional[index] = filters > filtersSoFar;
  filtersSoFar = filters;
}
const vitestCommands = new Set(["run", "watch", "dev", "related", "bench", "init", "list"]);
const positionals = argv.filter((_, index) => positional[index]);
const command = vitestCommands.has(positionals[0]) ? positionals[0] : undefined;
// `related` takes source files, never test files: which tests they reach is Vitest's to resolve,
// so the wrapper reads them as no file filter, requires every contract tree and splits the run.
const pathFilters =
  command === "related" ? [] : command === undefined ? positionals : positionals.slice(1);
const hasPathFilter = pathFilters.length > 0;
const cliTestPath = "test/cli.test.ts";

// Vitest also takes `file:line` and `file:line:column` filters; the location is no part of the
// path a filter names.
const locationSuffix = /:\d+(?::\d+)?$/u;

// Vitest accepts substring, ./-prefixed, and absolute file filters; dependency matching must
// recognize every spelling of the same repository-relative test path.
function normalizePathFilter(filter) {
  let value = filter.replace(locationSuffix, "").replaceAll("\\", "/");

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
const cliFilters = pathFilters.filter((filter) => matchesPathFilter(cliTestPath, filter));
const selectsCliTest = cliFilters.length > 0;
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
      // Finder drops .DS_Store into any browsed directory; it is OS metadata, never generated content.
      if (entry.name === ".DS_Store") {
        continue;
      }

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

if (argv.some((argument) => forwardedOnce.has(argument))) {
  process.exit(runVitest(vitestArgs));
}

// A command that executes no test, such as `list`, is forwarded once as selected. Executing
// commands (`run`, `related`, and `watch` or `dev`, which the added `--run` makes single-pass)
// keep the split, so test/cli.test.ts still runs only in its dedicated process.
if (command === "list" || command === "init") {
  process.exit(runPooledVitest(vitestArgs));
}

if (hasPathFilter && !selectsCliTest) {
  process.exit(runPooledVitest(vitestArgs));
}

// The dedicated pass runs with the caller's options too: a name pattern, a reporter, a bail
// limit, a shard. The wrapper owns how that pass runs, so the caller's run, pool, worker and
// isolation settings stay with the pooled pass.
const ownedOptions = new Set([
  "run",
  "pool",
  "maxWorkers",
  "isolate",
  "fileParallelism",
  "passWithNoTests",
]);
const optionName = (argument) =>
  argument
    .replace(/^-+/u, "")
    .split(/[=.]/u)[0]
    .replace(/^no-/u, "")
    .replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
const forwardedOptions = [];
let forwarding = false;
for (const [index, argument] of argv.entries()) {
  if (positional[index]) continue;
  if (argument.startsWith("-")) forwarding = !ownedOptions.has(optionName(argument));
  if (forwarding) forwardedOptions.push(argument);
}

// A `file:line` filter names one file, so one that selects test/cli.test.ts goes to the dedicated
// pass alone: the pooled pass cannot find that file once it is excluded. When every filter is
// such a location, no pooled pass runs.
const cliLocations = cliFilters.filter((filter) => locationSuffix.test(filter));
const cliSelection =
  cliLocations.length > 0 && cliLocations.length === cliFilters.length
    ? cliLocations
    : [cliTestPath];
const runsPooledPass =
  !hasPathFilter || pathFilters.some((filter) => !cliLocations.includes(filter));

// A report file or a coverage directory belongs to one Vitest process: the dedicated pass would
// replace what the pooled pass wrote, so the wrapper stops before either runs.
const writesReportFiles =
  options.outputFile !== undefined ||
  options.coverage?.enabled === true ||
  [options.reporter ?? []].flat().some((reporter) => reporter === "html" || reporter === "blob");

if (runsPooledPass && writesReportFiles) {
  console.error(
    `This run executes ${cliTestPath} in its own Vitest process after the others, so one report file or coverage directory cannot hold both.\nSelect test files with a filter, or run the CLI suite alone with \`npx vitest run ${cliTestPath}\`.`,
  );
  process.exit(1);
}

const passWithNoTests = options.passWithNoTests === true ? [] : ["--passWithNoTests"];

function runCliPass() {
  // A forwarded option (a shard, a project, an exclusion) may leave the file nothing to run;
  // that is the caller's selection, not a failure.
  return runVitest([
    "--run",
    ...forwardedOptions,
    ...cliSelection,
    "--pool",
    "forks",
    "--maxWorkers",
    "1",
    "--no-isolate",
    ...(forwardedOptions.length > 0 || options.passWithNoTests === true
      ? ["--passWithNoTests"]
      : []),
  ]);
}

if (hasPathFilter) {
  if (runsPooledPass) {
    const pooledArgv = argv.filter(
      (argument, index) => !(positional[index] && cliLocations.includes(argument)),
    );
    const parallelExitCode = runPooledVitest([
      ...(pooledArgv.includes("--run") ? pooledArgv : ["--run", ...pooledArgv]),
      "--exclude",
      cliTestPath,
      ...passWithNoTests,
    ]);

    if (parallelExitCode !== 0) {
      process.exit(parallelExitCode);
    }
  }

  process.exit(runCliPass());
}

// The default-root CLI case owns repository-root generated/. Keep its whole file in a dedicated
// process; every other test file remains in Vitest's normal parallel pool. `related` may reach
// only test/cli.test.ts among its tests, so its pooled pass may find none.
const parallelExitCode = runPooledVitest([
  ...vitestArgs,
  "--exclude",
  cliTestPath,
  ...(command === "related" ? passWithNoTests : []),
]);

if (parallelExitCode !== 0) {
  process.exit(parallelExitCode);
}

process.exit(runCliPass());

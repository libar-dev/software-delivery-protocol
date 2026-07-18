import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const argv = process.argv.slice(2);
const vitestArgs = argv.includes("--run") ? argv : ["--run", ...argv];

const contractDependencies = [
  {
    contracts: "generated/contracts",
    generation: "npm run generate:self-hosting",
    testPath: "test/self-hosting-duplicate-ids.test.ts",
  },
  {
    contracts: "examples/checkout-v1/generated/contracts",
    generation: "npm run generate:example",
    testPath: "examples/checkout-v1/test/orders/create-order.valid-cart.test.ts",
  },
];

const pathFilters = argv.filter((argument) => !argument.startsWith("-"));
const hasPathFilter = pathFilters.length > 0;
const cliTestPath = "test/cli.test.ts";
const matchesPathFilter = (testPath, filter) =>
  testPath.toLowerCase().includes(filter.toLowerCase());
const selectsCliTest = pathFilters.some((filter) => matchesPathFilter(cliTestPath, filter));
const requiredContracts = hasPathFilter
  ? contractDependencies.filter((dependency) =>
      pathFilters.some((filter) => matchesPathFilter(dependency.testPath, filter)),
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

if (argv.includes("--help")) {
  process.exit(runVitest(vitestArgs));
}

if (hasPathFilter && !selectsCliTest) {
  process.exit(runVitest(vitestArgs));
}

if (hasPathFilter) {
  const parallelExitCode = runVitest([
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
const parallelExitCode = runVitest([...vitestArgs, "--exclude", cliTestPath]);

if (parallelExitCode !== 0) {
  process.exit(parallelExitCode);
}

process.exit(
  runVitest(["--run", cliTestPath, "--pool", "forks", "--poolOptions.forks.singleFork"]),
);

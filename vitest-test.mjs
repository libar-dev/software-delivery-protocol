import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const argv = process.argv.slice(2);
const vitestArgs = argv.includes("--run") ? argv : ["--run", ...argv];

// Fresh-clone preflight: the example's bound test imports generated/contracts at collection
// time, so a full-suite run without a prior generation fails with a bare module-resolution
// error. Only the no-filter invocation collects the example suite, so only it is guarded.
const hasPathFilter = argv.some((argument) => !argument.startsWith("-"));

if (!hasPathFilter && !existsSync("examples/checkout-v1/generated/contracts")) {
  console.error(
    "examples/checkout-v1/generated/ is missing — the example's bound test imports the generated contracts.\n" +
      "Run `npm run build && npm run generate:example` first, or `npm run check` for the full chain.",
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

if (hasPathFilter) {
  process.exit(runVitest(vitestArgs));
}

// The default-root CLI case owns repository-root generated/. Keep its whole file in a dedicated
// process; every other test file remains in Vitest's normal parallel pool.
const parallelExitCode = runVitest([...vitestArgs, "--exclude", "test/cli.test.ts"]);

if (parallelExitCode !== 0) {
  process.exit(parallelExitCode);
}

process.exit(
  runVitest(["--run", "test/cli.test.ts", "--pool", "forks", "--poolOptions.forks.singleFork"]),
);

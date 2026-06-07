import { spawnSync } from "node:child_process";

const argv = process.argv.slice(2);
const vitestArgs = argv.includes("--run") ? argv : ["--run", ...argv];

const result = spawnSync("vitest", vitestArgs, {
  stdio: "inherit",
});

if (result.error !== undefined) {
  throw result.error;
}

process.exit(result.status ?? 1);

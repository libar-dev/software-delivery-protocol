#!/usr/bin/env node
// Runs `sdp q` over the corpus at the working directory with the right runtime, so no caller
// invokes a bare `sdp` (macOS ships an unrelated binary of that name) or `pnpm exec sdp` in the
// Protocol checkout (the package does not link its own binary there).
//
//   node scripts/q.mjs '<body>' [--params JSON | @PATH | KEY=@PATH]... [--json] [--root PATH] [--exclude PATH]...
//
// In the Protocol source checkout it runs the built CLI with the checkout's fixture exclusions,
// unless the caller names a --root of its own. Anywhere else it runs the project's installed
// @libar-dev/software-delivery-protocol. Arguments pass through to `sdp q` unchanged.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const packageName = "@libar-dev/software-delivery-protocol";

/** The fixture exclusions the Protocol source checkout needs; an adopter's corpus needs none. */
export const sourceCheckoutExclusions = ["explorations", "examples", "test/fixtures/import/parity"];

const skillPackageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return undefined;
  }
}

function binOf(packageRoot, manifest) {
  const bin = typeof manifest.bin === "string" ? manifest.bin : manifest.bin?.sdp;
  return bin === undefined ? undefined : join(packageRoot, bin);
}

/**
 * Selects the CLI for a working directory. Returns `{ mode, cli, packageRoot, exclusions }`, or
 * `{ error }` naming what to do when no runtime is available.
 */
export function selectRuntime(cwd = process.cwd()) {
  const own = readJson(join(cwd, "package.json"));
  if (own?.name === packageName && existsSync(join(cwd, "src", "cli", "sdp.ts"))) {
    const cli = binOf(cwd, own);
    if (cli === undefined || !existsSync(cli)) {
      return {
        error: "sdp q: dist/ is absent in the Protocol checkout; run `npm run build` first.",
      };
    }
    return { mode: "source", cli, packageRoot: cwd, exclusions: sourceCheckoutExclusions };
  }

  for (let dir = cwd; ; dir = dirname(dir)) {
    const packageRoot = join(dir, "node_modules", ...packageName.split("/"));
    const manifest = readJson(join(packageRoot, "package.json"));
    if (manifest?.name === packageName) {
      const cli = binOf(packageRoot, manifest);
      if (cli !== undefined && existsSync(cli)) {
        return { mode: "adopter", cli, packageRoot, exclusions: [] };
      }
      return {
        error: `sdp q: ${packageRoot} has no built CLI; reinstall the package so its prepare script builds dist/.`,
      };
    }
    if (dir === parse(dir).root) break;
  }

  return {
    error: `sdp q: ${packageName} is not installed in ${cwd} or above it. Install it (see its README for a commit pin), or run from the Protocol checkout.`,
  };
}

/** The argument list for `sdp q`: the caller's arguments, plus the exclusions when no root is named. */
export function queryArguments(runtime, args) {
  const namesRoot = args.some((arg) => arg === "--root" || arg.startsWith("--root="));
  const exclusions = namesRoot ? [] : runtime.exclusions.flatMap((path) => ["--exclude", path]);
  return [runtime.cli, "q", ...args, ...exclusions];
}

/** Warns once when this skill was loaded from a different copy of the package than the CLI it runs. */
export function skewWarning(runtime) {
  const manifest = readJson(join(skillPackageRoot, "package.json"));
  if (manifest?.name !== packageName) return undefined;
  const same = (left, right) => {
    try {
      return realpathSync(left) === realpathSync(right);
    } catch {
      return false;
    }
  };
  if (same(skillPackageRoot, runtime.packageRoot)) return undefined;
  return `sdp q: this skill comes from ${skillPackageRoot} but the CLI from ${runtime.packageRoot}; their teaching may differ. Load the skill from the installed package.`;
}

function main(args) {
  const runtime = selectRuntime();
  if ("error" in runtime) {
    console.error(runtime.error);
    return 2;
  }
  const warning = skewWarning(runtime);
  if (warning !== undefined) console.error(warning);
  const result = spawnSync(process.execPath, queryArguments(runtime, args), { stdio: "inherit" });
  if (result.error !== undefined) {
    console.error(`sdp q: ${result.error.message}`);
    return 1;
  }
  return result.status ?? 1;
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
  process.exitCode = main(process.argv.slice(2));
}

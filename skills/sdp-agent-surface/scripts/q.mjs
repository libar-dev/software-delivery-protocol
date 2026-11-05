#!/usr/bin/env node
// Runs `sdp q` over the corpus at the working directory with the right runtime, so no caller
// invokes a bare `sdp` (macOS ships an unrelated binary of that name) or `pnpm exec sdp` in the
// Protocol checkout (the package does not link its own binary there).
//
//   node scripts/q.mjs '<body>' [--params JSON | @PATH | KEY=@PATH]... [--json] [--root PATH | --protocol] [--exclude PATH]...
//
// In the Protocol source checkout it runs the built CLI with the checkout's fixture exclusions
// whenever the corpus is the checkout itself, a --root that resolves to it included; a --root
// naming another corpus gets none. Anywhere else it runs the project's installed
// @libar-dev/software-delivery-protocol. Arguments pass through to `sdp q` unchanged, except
// --protocol, which selects the root holding the Protocol's own Specs: the checkout's root, with
// its exclusions and bindings, or the installed package's specs/, which holds intent only, and
// --root=PATH, --exclude=PATH and --params=VALUE, which pass as the two-word forms `sdp q` reads.
// With no body the CLI lists call forms that run through this runner, which names itself in
// SDP_Q_COMMAND.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, parse, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const packageName = "@libar-dev/software-delivery-protocol";

/** The fixture exclusions the Protocol source checkout needs; an adopter's corpus needs none. */
export const sourceCheckoutExclusions = ["explorations", "examples", "test/fixtures/import/parity"];

// This skill's folder, and the package root that holds it when the skill ships in a copy of the
// package.
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillPackageRoot = resolve(skillRoot, "../..");
const runnerScript = fileURLToPath(import.meta.url);

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

/** The manifest of the Protocol source checkout whose root is `dir`, or undefined. */
function checkoutManifest(dir) {
  const own = readJson(join(dir, "package.json"));
  return own?.name === packageName && existsSync(join(dir, "src", "cli", "sdp.ts"))
    ? own
    : undefined;
}

/**
 * Selects the CLI for a working directory. Returns `{ mode, cli, packageRoot, exclusions }`, or
 * `{ error }` naming what to do when no runtime is available.
 */
export function selectRuntime(cwd = process.cwd()) {
  const own = checkoutManifest(cwd);
  if (own !== undefined) {
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

  // Below the checkout's root, the remedy is that root: every command runs there.
  for (let dir = dirname(cwd); ; dir = dirname(dir)) {
    if (checkoutManifest(dir) !== undefined)
      return {
        error: `sdp q: ${cwd} is inside the Protocol checkout; run from its root, ${dir}, where the graph derives.`,
      };
    if (dir === parse(dir).root) break;
  }

  return {
    error: `sdp q: ${packageName} is not installed in ${cwd} or above it. Install it (see its README for a commit pin), or run from the Protocol checkout.`,
  };
}

/**
 * The caller's arguments in the form `sdp q` reads: `--root=PATH`, `--exclude=PATH` and
 * `--params=VALUE` become two arguments each, and an option's value is never split.
 */
export function optionArguments(args, options = ["--root", "--exclude", "--params"]) {
  const out = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const equals = arg.indexOf("=");
    const name = equals > 0 ? arg.slice(0, equals) : arg;
    if (equals > 0 && options.includes(name)) {
      out.push(name, arg.slice(equals + 1));
      continue;
    }
    out.push(arg);
    if (options.includes(arg) && index + 1 < args.length) out.push(args[++index]);
  }
  return out;
}

/** The `--root` value the caller names, or undefined; option values are skipped, never read as one. */
export function namedRoot(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") return args[index + 1];
    if (arg.startsWith("--root=")) return arg.slice("--root=".length);
    if (arg === "--params" || arg === "--exclude") index += 1;
  }
  return undefined;
}

/**
 * Turns `--protocol` into the `--root` that holds the Protocol's own Specs: the source checkout's
 * root, where the checkout's exclusions then apply, or `<package root>/specs` in a project. It
 * selects the root and nothing else, so it refuses beside `--root`. Returns `{ args }` or
 * `{ error }`.
 */
export function protocolArguments(runtime, args) {
  const rest = [];
  let protocol = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--protocol") {
      protocol = true;
      continue;
    }
    rest.push(arg);
    if (["--params", "--exclude", "--root"].includes(arg) && index + 1 < args.length)
      rest.push(args[++index]);
  }
  if (!protocol) return { args: rest };
  if (namedRoot(rest) !== undefined)
    return { error: "sdp q: --protocol selects the root; pass --protocol or --root, not both." };
  const root = runtime.mode === "source" ? runtime.packageRoot : join(runtime.packageRoot, "specs");
  return { args: [...rest, "--root", root] };
}

/**
 * Whether the query reads the runtime's own package root: no root named, or a root that resolves,
 * against `cwd`, to the same directory. Only then do the source checkout's exclusions apply.
 */
export function readsPackageRoot(runtime, args, cwd = process.cwd()) {
  const root = namedRoot(args);
  if (root === undefined) return realpathOrSelf(cwd) === realpathOrSelf(runtime.packageRoot);
  return realpathOrSelf(resolve(cwd, root)) === realpathOrSelf(runtime.packageRoot);
}

function realpathOrSelf(path) {
  try {
    return realpathSync(path);
  } catch {
    return resolve(path);
  }
}

/** A shell word for `value`: as written when every character is safe, else single-quoted. */
export function shellWord(value) {
  return /^[\w@%+=:,./-]+$/u.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`;
}

/**
 * The command that runs this runner from `cwd`, `node <path>`: the path relative, with `/`
 * separators, led by `./` when it would start with `-`, and quoted for a shell. A call with no
 * body lists its call forms starting with it, so a copied form never reaches a global `sdp`.
 */
export function runnerCommand(cwd = process.cwd()) {
  const path = relative(realpathOrSelf(cwd), runnerScript).split(sep).join("/");
  return `node ${shellWord(path.startsWith("-") ? `./${path}` : path)}`;
}

/** The environment a runner gives the CLI: the caller's, naming this runner as the q command. */
export function runnerEnvironment(cwd = process.cwd()) {
  return { ...process.env, SDP_Q_COMMAND: runnerCommand(cwd) };
}

/**
 * The argument list for `sdp q`: the caller's arguments, plus the runtime's exclusions when the
 * query reads its package root. A root naming another corpus gets none, since each exclusion is a
 * path relative to the root.
 */
export function queryArguments(runtime, args, cwd = process.cwd()) {
  const exclusions = readsPackageRoot(runtime, args, cwd)
    ? runtime.exclusions.flatMap((path) => ["--exclude", path])
    : [];
  return [runtime.cli, "q", ...args, ...exclusions];
}

/**
 * The build a package root holds: its version and the full commit its CLI was built from, as the
 * build recorded it beside the CLI; undefined when either is missing or the commit is unknown.
 */
export function buildIdentity(root) {
  const version = readJson(join(root, "package.json"))?.version;
  const commit = readJson(join(root, "dist", "cli", "build-info.json"))?.commit;
  if (typeof version !== "string" || typeof commit !== "string") return undefined;
  return /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(commit) ? `${version} ${commit}` : undefined;
}

/**
 * Warns when this skill may teach another version than the CLI it runs: it comes from another
 * build of the package, or from a folder outside any copy of the package, whose build is unknown.
 * A client's cached copy of the same build stays silent; without a build on record, another copy
 * warns.
 */
export function skewWarning(runtime) {
  const manifest = readJson(join(skillPackageRoot, "package.json"));
  if (manifest?.name !== packageName)
    return `sdp q: this skill comes from ${skillRoot}, outside any copy of the package, but the CLI from ${runtime.packageRoot}; their teaching may differ. Load the plugin, or link the skill folders from the installed package.`;
  const same = (left, right) => {
    try {
      return realpathSync(left) === realpathSync(right);
    } catch {
      return false;
    }
  };
  if (same(skillPackageRoot, runtime.packageRoot)) return undefined;
  const skillBuild = buildIdentity(skillPackageRoot);
  if (skillBuild !== undefined && skillBuild === buildIdentity(runtime.packageRoot))
    return undefined;
  return `sdp q: this skill comes from ${skillPackageRoot} but the CLI from ${runtime.packageRoot}, another build or one with none on record; their teaching may differ. Load the skill from the installed package.`;
}

function main(args) {
  const runtime = selectRuntime();
  if ("error" in runtime) {
    console.error(runtime.error);
    return 2;
  }
  const warning = skewWarning(runtime);
  if (warning !== undefined) console.error(warning);
  const selected = protocolArguments(runtime, optionArguments(args));
  if ("error" in selected) {
    console.error(selected.error);
    return 2;
  }
  const result = spawnSync(process.execPath, queryArguments(runtime, selected.args), {
    stdio: "inherit",
    env: runnerEnvironment(),
  });
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

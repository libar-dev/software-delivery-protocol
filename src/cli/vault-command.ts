import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { extract } from "../extract/index.js";
import type { GraphSchema } from "../graph/schema.js";
import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import {
  assertVaultNoteNames,
  renderVault,
  VaultCaseCollisionError,
} from "../projections/vault/notes.js";
import { escapeText } from "../projections/vault/text.js";
import {
  inspectVault,
  LIST,
  synchronizeVault,
  VaultGuardError,
} from "../projections/vault/sync.js";
import type { SyncResult, VaultFile, VaultState } from "../projections/vault/sync.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";
import { runValidateWatch } from "./validate-watch.js";
import type { ValidateWatchHooks } from "./validate-watch.js";

export interface VaultHooks extends ValidationViewHooks {
  readonly vaultRename?: Parameters<typeof synchronizeVault>[3];
}
export const buildOwnedPaths = [
  "graph.json",
  "contracts",
  "registrars.json",
  "imports.json",
  "design-review",
  "census",
  "mermaid",
  "gherkin",
  "spec-studio",
].flatMap((name) => [`generated/${name}`, `generated/${name}.tmp`]);
export function vaultDirectory(parsed: BuildArgs): string {
  return resolve(parsed.vault ?? join(parsed.root, "generated/obsidian-vault"));
}
const inside = (parent: string, child: string): boolean => {
  const path = relative(parent, child);
  return path === "" || (!path.startsWith("../") && path !== ".." && !isAbsolute(path));
};
function physical(path: string): string {
  if (existsSync(path)) return realpathSync(path);
  const parent = dirname(path);
  return parent === path ? path : resolve(physical(parent), relative(parent, path));
}
export function checkVaultDirectory(parsed: BuildArgs): void {
  const out = vaultDirectory(parsed),
    resolvedOut = physical(out),
    root = physical(parsed.root);
  for (const path of buildOwnedPaths) {
    const owned = physical(join(root, path));
    if (inside(owned, resolvedOut) || inside(resolvedOut, owned))
      throw new Error(
        `sdp vault: the vault ${out} overlaps ${path}, which every build rewrites or removes; choose another directory, such as generated/obsidian-vault/`,
      );
  }
  if (inside(root, resolvedOut)) {
    const path = relative(root, resolvedOut).replaceAll("\\", "/");
    if (
      !path.split("/").some(isExcludedDiscoveryDirectory) &&
      !parsed.exclude.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
    )
      throw new Error(
        `sdp vault: the vault ${out} lies inside the root and would be read as source; choose a directory under generated/, under an excluded prefix, or outside the root`,
      );
  }
}
export function reportVaultError(error: unknown, output: CliOutput): number {
  if (error instanceof VaultGuardError) {
    for (const { path, reason } of error.refusals) {
      const phrase =
        reason === "unknown"
          ? "is not a file this command wrote (unknown)"
          : reason === "changed"
            ? "has changed since this command wrote it (changed)"
            : reason === "malformed"
              ? "is not a file list this command wrote (malformed)"
              : "is a link or a special file, which this command never writes (not a file)";
      writeStderr(output, `sdp vault: ${path} ${phrase}\n`);
    }
    writeStderr(
      output,
      "sdp vault: nothing was written or removed; keep what you wrote outside sdp/, then delete each refused path, or delete sdp/ whole\n",
    );
  } else if (error instanceof VaultCaseCollisionError) {
    for (const [first, second] of error.pairs)
      writeStderr(
        output,
        `sdp vault: ${first} and ${second} name notes whose paths differ only in case; nothing was written\n`,
      );
  } else {
    const message = errorMessage(error);
    writeStderr(output, `${message.startsWith("sdp vault:") ? "" : "sdp vault: "}${message}\n`);
  }
  return 1;
}
export function prepareVault(parsed: BuildArgs, output: CliOutput): VaultState | undefined {
  try {
    checkVaultDirectory(parsed);
    return inspectVault(vaultDirectory(parsed));
  } catch (error) {
    reportVaultError(error, output);
    return undefined;
  }
}
export function prepareVaultBuild(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: VaultHooks,
): VaultHooks | undefined {
  let extracted: ReturnType<typeof extract>;
  try {
    extracted = (hooks.extract ?? extract)({ root: parsed.root, exclude: parsed.exclude });
  } catch {
    return hooks;
  } // The shared build owns extraction failure diagnostics.
  try {
    assertVaultNoteNames(extracted.graph);
  } catch (error) {
    reportVaultError(error, output);
    return undefined;
  }
  return { ...hooks, extract: () => extracted };
}
export function publishFailedVault(
  parsed: BuildArgs,
  output: CliOutput,
  state: VaultState,
  errors: readonly string[],
  hooks: VaultHooks = {},
): number {
  try {
    const kept: VaultFile[] = [...state.files]
      .filter(([path]) => path !== LIST && !state.temporaries.includes(path) && path !== "index.md")
      .map(([path, bytes]) => ({ path, content: bytes.toString("utf8") }));
    const warning =
      "> [!warning] The last regeneration failed, and the notes show the graph of the last one that succeeded.\n\n" +
      errors.map((error) => escapeText(error.split(parsed.root).join(".").trim())).join("\n") +
      "\n";
    summarize(
      parsed,
      synchronizeVault(
        vaultDirectory(parsed),
        [...kept, { path: "index.md", content: warning }],
        state,
        hooks.vaultRename,
      ),
      output,
    );
  } catch (error) {
    return reportVaultError(error, output);
  }
  return 1;
}
function summarize(parsed: BuildArgs, result: SyncResult, output: CliOutput): void {
  writeStdout(
    output,
    `Wrote ${vaultDirectory(parsed)}/sdp (${String(result.files)} files: ${String(result.written)} written, ${String(result.unchanged)} unchanged, ${String(result.removed)} removed)\n`,
  );
}
export function publishVault(
  parsed: BuildArgs,
  graph: GraphSchema,
  output: CliOutput,
  state: VaultState,
  hooks: VaultHooks = {},
  findings?: Parameters<typeof renderVault>[1],
): number {
  try {
    summarize(
      parsed,
      synchronizeVault(
        vaultDirectory(parsed),
        renderVault(graph, findings),
        state,
        hooks.vaultRename,
      ),
      output,
    );
    return 0;
  } catch (error) {
    return reportVaultError(error, output);
  }
}
/**
 * @sdpAnchor impl:protocol.vault-command
 * @sdpLabel validates after vault preflight and retains prior notes behind a failed-extraction index
 * @sdpSatisfies spec:consumers.obsidian-vault
 * @sdpReferences spec:decisions.vault-owned-folder
 * @sdpComponent component:protocol.cli
 * @sdpUses component:protocol.projections
 * @sdpRole publisher
 */
export function runVault(parsed: BuildArgs, output: CliOutput, hooks: VaultHooks = {}): number {
  const state = prepareVault(parsed, output);
  if (state === undefined) return 1;
  const errors: string[] = [];
  const tee: CliOutput = {
    ...output,
    stderr: {
      write: (chunk) => {
        errors.push(chunk);
        writeStderr(output, chunk);
      },
    },
  };
  const preparedHooks = prepareVaultBuild(parsed, output, hooks);
  if (preparedHooks === undefined) return 1;
  const validated = runValidate(parsed, tee, "vault", preparedHooks);
  if (validated.graph !== undefined)
    return (
      publishVault(parsed, validated.graph, output, state, hooks, validated.report?.findings) ||
      validated.exitCode
    );
  return publishFailedVault(parsed, output, state, errors, hooks);
}
/**
 * @sdpAnchor impl:protocol.vault-watch
 * @sdpLabel reuses the coalescing watcher with source suffixes and a synchronous vault cycle
 * @sdpSatisfies spec:consumers.obsidian-vault.iteration
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */
export function runVaultWatch(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: VaultHooks & ValidateWatchHooks,
): Promise<number> {
  const out = vaultDirectory(parsed);
  const excluded = relative(parsed.root, out).replaceAll("\\", "/");
  const watched = {
    ...parsed,
    exclude: inside(parsed.root, out) ? [...parsed.exclude, excluded] : parsed.exclude,
  };
  return runValidateWatch(watched, output, hooks, {
    ...hooks,
    watchCommand: "vault",
    watchSources: true,
    runWatchCycle: () => ({ exitCode: runVault(parsed, output, hooks) }),
    onWatchStop: () => {
      // Cycles are synchronous; SIGINT is delivered between them. Remove only recognized whole temporaries.
      try {
        const state = inspectVault(out);
        if (state.temporaries.length)
          synchronizeVault(
            out,
            [...state.files]
              .filter(([path]) => path !== LIST && !state.temporaries.includes(path))
              .map(([path]) => ({ path, content: readFileSync(join(out, "sdp", path), "utf8") })),
            state,
          );
      } catch {
        /* A person's refused path stays untouched. */
      }
    },
  });
}

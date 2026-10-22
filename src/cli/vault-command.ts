import { physicalPath as physical, pathWithin } from "./path-identity.js";
import { readFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { generateContracts } from "../codegen/contracts.js";
import { extract } from "../extract/index.js";
import type { GraphSchema } from "../graph/schema.js";
import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import {
  assertVaultNoteNames,
  renderVault,
  VaultCaseCollisionError,
} from "../projections/vault/notes.js";
import { escapeText } from "../projections/vault/text.js";
import type { Finding } from "../validate/contracts.js";
import {
  inspectVault,
  LIST,
  synchronizeVault,
  VaultGuardError,
} from "../projections/vault/sync.js";
import type { SyncResult, VaultFile, VaultState } from "../projections/vault/sync.js";
import type { BuildArgs } from "./build-args.js";
import { buildOwnedPaths, buildOwnedRegistrarPaths } from "./build-command.js";
import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";
import { runValidateWatch } from "./validate-watch.js";
import type { ValidateWatchHooks } from "./validate-watch.js";

export interface VaultHooks extends ValidationViewHooks {
  readonly vaultRename?: Parameters<typeof synchronizeVault>[3];
}
export function vaultDirectory(parsed: BuildArgs): string {
  return resolve(parsed.vault ?? join(parsed.root, "generated/obsidian-vault"));
}
const inside = (parent: string, child: string): boolean => {
  const path = relative(parent.toLowerCase(), child.toLowerCase());
  return path === "" || (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path));
};
export function checkVaultDirectory(parsed: BuildArgs, registrars: readonly string[] = []): void {
  const out = vaultDirectory(parsed),
    resolvedOut = physical(out),
    root = physical(parsed.root);
  for (const path of [...buildOwnedPaths, ...buildOwnedRegistrarPaths(parsed.root, registrars)]) {
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
    const contracts = (hooks.generateContracts ?? generateContracts)(extracted.graph);
    checkVaultDirectory(parsed, [...contracts.registrars.keys()]);
    return { ...hooks, extract: () => extracted, generateContracts: () => contracts };
  } catch (error) {
    reportVaultError(error, output);
    return undefined;
  }
}
export function publishFailedVault(
  parsed: BuildArgs,
  output: CliOutput,
  state: VaultState,
  errors: readonly Finding[],
  hooks: VaultHooks = {},
): number {
  try {
    const kept: VaultFile[] = [...state.files]
      .filter(([path]) => path !== LIST && !state.temporaries.includes(path) && path !== "index.md")
      .map(([path, bytes]) => ({ path, content: bytes.toString("utf8") }));
    const warning =
      "> [!warning] The last regeneration failed, and the notes show the graph of the last one that succeeded.\n\n" +
      errors
        .filter((error) => error.severity === "error")
        .map((error) =>
          [error.file, escapeText(error.message)]
            .filter((value) => value !== undefined)
            .join(" · "),
        )
        .join("\n") +
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
  for (const path of result.preservedBases)
    writeStderr(output, `sdp vault: warning: sdp/${path} has changed; delete it to regenerate\n`);
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
  const preparedHooks = prepareVaultBuild(parsed, output, hooks);
  if (preparedHooks === undefined) return 1;
  const validated = runValidate(parsed, output, "vault", preparedHooks);
  if (validated.graph !== undefined)
    return (
      publishVault(parsed, validated.graph, output, state, hooks, validated.report?.findings) ||
      validated.exitCode
    );
  return publishFailedVault(
    parsed,
    output,
    state,
    validated.extractionReport?.findings ?? [],
    hooks,
  );
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
  const owned = new Set<string>();
  const refreshOwned = (): void => {
    for (const path of buildOwnedPaths) owned.add(physical(join(parsed.root, path)));
    try {
      for (const path of buildOwnedRegistrarPaths(parsed.root))
        owned.add(physical(join(parsed.root, path)));
    } catch {
      // The vault cycle reports a malformed manifest as a refusal while the watcher stays alive.
    }
  };
  refreshOwned();
  return runValidateWatch(watched, output, hooks, {
    ...hooks,
    watchCommand: "vault",
    watchSources: true,
    ignoreWatchPath: (path) => [...owned].some((parent) => pathWithin(parent, physical(path))),
    runWatchCycle: () => {
      const exitCode = runVault(parsed, output, hooks);
      refreshOwned();
      return { exitCode };
    },
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

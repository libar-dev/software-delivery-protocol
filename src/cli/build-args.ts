import { statSync } from "node:fs";
import { resolve } from "node:path";

import { InvalidExcludePathError, normalizeExcludes } from "../extract/discover.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

export interface BuildArgs {
  readonly root: string;
  readonly exclude: readonly string[];
  readonly checkClean: boolean;
  readonly watch?: boolean;
}

export function parseBuildArgs(
  args: readonly string[],
  output: CliOutput,
  command: string,
): BuildArgs | undefined {
  let root: string | undefined;
  let checkClean = false;
  let watchMode = false;
  const rawExcludes: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (argument === "--check-clean") {
      checkClean = true;
      continue;
    }

    if (argument === "--watch") {
      if (command !== "validate") {
        writeStderr(output, `sdp ${command}: --watch is only valid on validate.\n`);
        return undefined;
      }

      watchMode = true;
      continue;
    }

    if (argument === "--exclude") {
      const exclude = args[index + 1];

      if (exclude === undefined) {
        writeStderr(output, `sdp ${command}: --exclude requires a path.\n`);
        return undefined;
      }

      if (exclude.startsWith("--")) {
        writeStderr(output, `sdp ${command}: --exclude expects a path, got ${exclude}\n`);
        return undefined;
      }

      rawExcludes.push(exclude);
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      writeStderr(output, `sdp ${command}: unknown option ${argument}\n`);
      return undefined;
    }

    if (root !== undefined) {
      writeStderr(output, `sdp ${command} takes at most one root argument.\n`);
      return undefined;
    }

    root = argument;
  }

  let exclude: readonly string[];

  try {
    exclude = normalizeExcludes(rawExcludes);
  } catch (error) {
    if (error instanceof InvalidExcludePathError) {
      writeStderr(output, `sdp ${command}: invalid --exclude path "${error.path}"\n`);
      return undefined;
    }

    throw error;
  }

  if (watchMode && checkClean) {
    writeStderr(output, `sdp ${command}: --watch cannot be combined with --check-clean.\n`);
    return undefined;
  }

  const resolvedRoot = resolveExtractionRoot(root, output, command);

  return resolvedRoot === undefined
    ? undefined
    : { root: resolvedRoot, exclude, checkClean, watch: watchMode };
}

/**
 * The one root-resolution rule every verb shares: a supplied root is resolved against the invoking
 * directory into an absolute path and validated as a directory before any consumer sees it, so what
 * reaches extraction is a canonical validated identity rather than the operator's string.
 */
export function resolveExtractionRoot(
  root: string | undefined,
  output: CliOutput,
  command: string,
): string | undefined {
  // A supplied-but-empty root is an operator mistake (an unset shell variable), not a request for
  // the working directory: `resolve` would collapse it to cwd and answer about a corpus the
  // operator never named, at exit 0 — the same input the exclusion contract refuses by name.
  if (root?.trim() === "") {
    writeStderr(output, `sdp ${command}: --root requires a path.\n`);
    return undefined;
  }

  const resolvedRoot = resolve(process.cwd(), root ?? ".");

  if (!isDirectory(resolvedRoot)) {
    writeStderr(output, `sdp ${command}: root "${resolvedRoot}" is not a directory.\n`);
    return undefined;
  }

  return resolvedRoot;
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

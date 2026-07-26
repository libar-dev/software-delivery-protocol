import { statSync } from "node:fs";
import { resolve } from "node:path";

import { InvalidExcludePathError, normalizeExcludes } from "../extract/discover.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

export interface BuildArgs {
  readonly root: string;
  readonly exclude: readonly string[];
  readonly checkClean: boolean;
}

export function parseBuildArgs(
  args: readonly string[],
  output: CliOutput,
  command: string,
): BuildArgs | undefined {
  let root: string | undefined;
  let checkClean = false;
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

  const resolvedRoot = resolve(process.cwd(), root ?? ".");

  if (!isDirectory(resolvedRoot)) {
    writeStderr(output, `sdp ${command}: root "${resolvedRoot}" is not a directory.\n`);
    return undefined;
  }

  return { root: resolvedRoot, exclude, checkClean };
}

function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

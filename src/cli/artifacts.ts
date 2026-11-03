import { lstatSync, realpathSync, rmSync } from "node:fs";
import { dirname, isAbsolute, relative, sep } from "node:path";

import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr } from "./output.js";

export function removeArtifact(path: string, rm: typeof rmSync): string | undefined {
  try {
    rm(path, { recursive: true, force: true });
    return undefined;
  } catch (error) {
    const code = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;

    return code === "ENOENT" || code === "ENOTDIR" ? undefined : errorMessage(error);
  }
}

export function removeArtifacts(
  paths: readonly string[],
  output: CliOutput,
  command: string,
  rm: typeof rmSync,
): void {
  for (const path of paths) {
    const failure = removeArtifact(path, rm);

    if (failure !== undefined) {
      writeStderr(
        output,
        `sdp ${command}: stale ${path} could not be removed (${failure}) — do not read it as current.\n`,
      );
    }
  }
}

/** Check the physical parent before touching an owned output, including during recovery. */
export function assertOutputParent(root: string, path: string): void {
  let parent = dirname(path);
  for (;;) {
    try {
      lstatSync(parent);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      const ancestor = dirname(parent);
      if (ancestor === parent) throw error;
      parent = ancestor;
    }
  }
  let physicalParent: string;
  try {
    physicalParent = realpathSync.native(parent);
  } catch {
    throw new Error(`unsafe output parent "${parent}" for "${path}" cannot be resolved`);
  }
  const nested = relative(realpathSync.native(root), physicalParent);
  if (nested === ".." || nested.startsWith(`..${sep}`) || isAbsolute(nested)) {
    throw new Error(`unsafe output parent for "${path}" escapes the extraction root`);
  }
}

/** Refuse portable path collisions without changing any frozen projection's names or bytes. */
export function assertDistinctPagePaths(
  pages: readonly { readonly path: string }[],
  suffix = ".md",
): void {
  const paths = new Map<string, string>();
  for (const { path } of pages) {
    const key = path.toLowerCase();
    const prior = paths.get(key);
    if (prior !== undefined) {
      const id = (name: string): string => name.slice(0, -suffix.length).replace("/", ":");
      throw new Error(
        `case-insensitive publication path collision: "${prior}" (${id(prior)}) and "${path}" (${id(path)})`,
      );
    }
    paths.set(key, path);
  }
}

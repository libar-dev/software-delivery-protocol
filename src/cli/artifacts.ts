import { lstatSync, mkdirSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, sep } from "node:path";

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
  const generated = join(root, "generated");
  try {
    if (lstatSync(generated).isSymbolicLink())
      throw new Error(`unsafe output parent "${generated}" is a symbolic link`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

/** Recheck between mutations; Node's pathname APIs do not make this race-free. */
export function outputBoundary(root: string): (path: string) => void {
  let identity: { dev: number; ino: number } | undefined;
  return (path) => {
    assertOutputParent(root, path);
    try {
      const current = lstatSync(join(root, "generated"));
      if (!current.isDirectory())
        throw new Error("unsafe output parent: generated is not a directory");
      if (identity !== undefined && (identity.dev !== current.dev || identity.ino !== current.ino))
        throw new Error("unsafe output parent: generated directory identity changed");
      identity = current;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT" || identity !== undefined) throw error;
    }
  };
}

export function guardedOutput(
  root: string,
  hooks: { rmSync?: typeof rmSync; writeFileSync?: typeof writeFileSync } = {},
) {
  const check = outputBoundary(root);
  const remove: typeof rmSync = (path, options) => {
    check(String(path));
    (hooks.rmSync ?? rmSync)(path, options);
    check(String(path));
  };
  const mkdir: typeof mkdirSync = (path, options) => {
    check(join(String(path), ".boundary"));
    const result = mkdirSync(path, options);
    check(join(String(path), ".boundary"));
    return result;
  };
  const write: typeof writeFileSync = (path, data, options) => {
    check(String(path));
    (hooks.writeFileSync ?? writeFileSync)(path, data, options);
    check(String(path));
  };
  const rename: typeof renameSync = (from, to) => {
    check(String(from));
    check(String(to));
    renameSync(from, to);
    check(String(to));
  };
  return { check, rmSync: remove, mkdirSync: mkdir, writeFileSync: write, renameSync: rename };
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

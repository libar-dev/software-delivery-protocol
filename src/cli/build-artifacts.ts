import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { BUILD_INFO_FILE, UNKNOWN_COMMIT, isFullCommit, serializeBuildInfo } from "./build-info.js";

// The build step that runs after the bundle succeeds (`tsup.config.ts` calls it). It is build
// tooling, never part of the shipped CLI: no entry imports it.

/** The catalog the recipe files derive from, relative to the package root. */
export const RECIPE_CATALOG = "docs/agent-surface/recipes.md";

/** The recipe files' directory, relative to the build output directory. */
export const RECIPES_DIRECTORY = "recipes";

export interface RecipeFile {
  readonly ordinal: number;
  readonly fileName: string;
  /** The bytes between the body's two fence lines: each body line ended by a line feed. */
  readonly content: string;
}

const headingPattern = /^## (?<ordinal>\d+)\. (?<title>.+)$/u;

/** The heading text after the number, in lower kebab case. */
export function recipeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

export function recipeFileName(ordinal: number, title: string): string {
  return `${String(ordinal).padStart(2, "0")}-${recipeSlug(title)}.js`;
}

function refuse(message: string): never {
  throw new Error(`${RECIPE_CATALOG}: ${message}`);
}

/**
 * Pairs each numbered `## N. Title` heading with the one fenced `js` body under it. A body with
 * no heading, a heading with no body, a second body under one heading, a repeated number, or an
 * empty slug refuses the build: a file name would otherwise be guessed.
 */
export function recipeFiles(catalog: string): readonly RecipeFile[] {
  const lines = catalog.split("\n");
  const files: RecipeFile[] = [];
  const seen = new Set<number>();
  let pending: { readonly ordinal: number; readonly title: string } | undefined;
  let openedAt: number | undefined;

  for (const [index, line] of lines.entries()) {
    if (openedAt !== undefined) {
      if (line !== "```") continue;

      if (pending === undefined) {
        refuse(`the js body opened at line ${String(openedAt)} has no numbered heading`);
      }

      files.push({
        ordinal: pending.ordinal,
        fileName: recipeFileName(pending.ordinal, pending.title),
        content: lines
          .slice(openedAt, index)
          .map((bodyLine) => `${bodyLine}\n`)
          .join(""),
      });
      openedAt = undefined;
      pending = undefined;
      continue;
    }

    const heading = headingPattern.exec(line)?.groups;

    if (heading?.ordinal !== undefined && heading.title !== undefined) {
      if (pending !== undefined) {
        refuse(`recipe ${String(pending.ordinal)} has no js body`);
      }

      const ordinal = Number(heading.ordinal);

      if (seen.has(ordinal)) {
        refuse(`recipe ${String(ordinal)} is numbered twice`);
      }

      if (recipeSlug(heading.title) === "") {
        refuse(`recipe ${String(ordinal)} has no heading text to name its file`);
      }

      seen.add(ordinal);
      pending = { ordinal, title: heading.title };
      continue;
    }

    if (line === "```js") {
      if (pending === undefined) {
        refuse(`the js body at line ${String(index + 1)} has no numbered heading`);
      }

      openedAt = index + 1;
    }
  }

  if (openedAt !== undefined) {
    refuse(`the js body opened at line ${String(openedAt)} is never closed`);
  }

  if (pending !== undefined) {
    refuse(`recipe ${String(pending.ordinal)} has no js body`);
  }

  return files;
}

/** Replaces a file in one rename, so a concurrent reader sees the old bytes or the new ones. */
function replaceFile(path: string, content: string): void {
  const temporary = `${path}.${String(process.pid)}.tmp`;

  writeFileSync(temporary, content);
  renameSync(temporary, path);
}

/** Writes every recipe file, then removes any file the catalog no longer owes. */
export function writeRecipeFiles(outDir: string, files: readonly RecipeFile[]): void {
  const directory = join(outDir, RECIPES_DIRECTORY);
  const owed = new Set(files.map((file) => file.fileName));

  mkdirSync(directory, { recursive: true });

  for (const file of files) {
    replaceFile(join(directory, file.fileName), file.content);
  }

  for (const entry of readdirSync(directory)) {
    if (!owed.has(entry)) {
      rmSync(join(directory, entry), { recursive: true, force: true });
    }
  }
}

export type GitRunner = (cwd: string, args: readonly string[]) => string;

const runGit: GitRunner = (cwd, args) =>
  execFileSync("git", [...args], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

/** The full hash of the commit checked out at `root`, or `unknown` when git cannot name one. */
export function readBuildCommit(root: string, git: GitRunner = runGit): string {
  try {
    const commit = git(root, ["rev-parse", "HEAD"]).trim();

    return isFullCommit(commit) ? commit : UNKNOWN_COMMIT;
  } catch {
    return UNKNOWN_COMMIT;
  }
}

export function writeBuildInfo(outDir: string, commit: string): void {
  const directory = join(outDir, "cli");

  mkdirSync(directory, { recursive: true });
  replaceFile(join(directory, BUILD_INFO_FILE), serializeBuildInfo({ commit }));
}

/**
 * @sdpAnchor impl:protocol.build-artifacts
 * @sdpLabel the build step that writes each catalog recipe to dist/recipes and records the build commit beside the CLI
 * @sdpSatisfies spec:consumers.agent-surface.recipe-parameters, spec:consumers.engine-provenance
 * @sdpComponent component:protocol.cli
 * @sdpRole publisher
 */
export function writeBuildArtifacts(input: {
  readonly root: string;
  readonly outDir: string;
  readonly git?: GitRunner;
}): void {
  const catalog = readFileSync(join(input.root, RECIPE_CATALOG), "utf8");

  writeRecipeFiles(input.outDir, recipeFiles(catalog));
  writeBuildInfo(input.outDir, readBuildCommit(input.root, input.git));
}

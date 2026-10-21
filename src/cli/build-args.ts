import { readStudioBase } from "./studio-inputs.js";
import type { StudioInputs } from "../projections/studio/inputs.js";
import { mergeParams } from "./params.js";
import { realpathSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { InvalidExcludePathError, normalizeExcludes } from "../extract/discover.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

export interface BuildArgs {
  readonly studioInputs?: StudioInputs;
  readonly root: string;
  readonly exclude: readonly string[];
  readonly checkClean: boolean;
  readonly watch?: boolean;
  readonly imports?: string;
  readonly vault?: string;
  readonly rules?: readonly RulesInput[];
}

export interface RulesInput {
  readonly paramForms?: readonly string[];
  readonly rereadParams?: boolean;
  readonly rulesFile: string;
  readonly params: Readonly<Record<string, unknown>>;
}

export function parseBuildArgs(
  args: readonly string[],
  output: CliOutput,
  command: string,
): BuildArgs | undefined {
  let base: string | undefined;
  let baseLabel: string | undefined;
  let root: string | undefined;
  let checkClean = false;
  let watchMode = false;
  let imports: string | undefined;
  let vault: string | undefined;
  const rawExcludes: string[] = [];
  const rawRules: { rulesFile: string; forms: string[] }[] = [];
  const rulePaths = new Set<string>();

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === undefined) {
      continue;
    }

    if (argument === "--base" || argument === "--base-label") {
      if (command !== "studio") {
        writeStderr(output, `sdp ${command}: ${argument} is only valid on studio.\n`);
        return undefined;
      }
      const value = args[index + 1];
      if (value === undefined || value.trim() === "" || value.startsWith("--")) {
        writeStderr(
          output,
          `sdp studio: ${argument} requires ${argument === "--base" ? "a path" : "text"}.\n`,
        );
        return undefined;
      }
      if (
        (argument === "--base" && base !== undefined) ||
        (argument === "--base-label" && baseLabel !== undefined)
      ) {
        writeStderr(output, `sdp studio: ${argument} may be supplied only once.\n`);
        return undefined;
      }
      if (argument === "--base") base = value;
      else baseLabel = value;
      index += 1;
      continue;
    }

    if (argument === "--rules" || argument === "--params") {
      if (command !== "validate") {
        writeStderr(output, `sdp ${command}: ${argument} is only valid on validate.\n`);
        return undefined;
      }
      const value = args[index + 1];
      if (value === undefined || value.trim() === "" || value.startsWith("--")) {
        writeStderr(
          output,
          `sdp validate: ${argument} requires ${argument === "--rules" ? "a path" : "a JSON object, @PATH or KEY=@PATH"}.\n`,
        );
        return undefined;
      }
      if (argument === "--rules") {
        let path = resolve(value);
        try {
          path = realpathSync(path);
        } catch {
          // An unreadable file remains the runner's failure, with the operator's path.
        }
        if (rulePaths.has(path)) {
          writeStderr(
            output,
            `sdp validate: --rules file ${JSON.stringify(value)} was given twice.\n`,
          );
          return undefined;
        }
        rulePaths.add(path);
        rawRules.push({ rulesFile: value, forms: [] });
      } else {
        const last = rawRules.at(-1);
        if (last === undefined) {
          writeStderr(output, "sdp validate: --params must follow its --rules file.\n");
          return undefined;
        }
        last.forms.push(value);
      }
      index += 1;
      continue;
    }

    if (argument === "--check-clean") {
      checkClean = true;
      continue;
    }

    if (argument === "--vault") {
      if (command !== "generate") {
        writeStderr(output, `sdp ${command}: --vault is only valid on generate.\n`);
        return undefined;
      }
      const directory = args[index + 1];
      if (directory === undefined || directory.trim() === "" || directory.startsWith("--")) {
        writeStderr(output, "sdp generate: --vault requires a directory.\n");
        return undefined;
      }
      if (vault !== undefined) {
        writeStderr(output, "sdp generate: --vault may be supplied only once.\n");
        return undefined;
      }
      vault = directory;
      index += 1;
      continue;
    }

    if (argument === "--imports") {
      const path = args[index + 1];
      if (command !== "build") {
        writeStderr(output, `sdp ${command}: --imports is only valid on build.\n`);
        return undefined;
      }
      if (path === undefined || path.trim() === "" || path.startsWith("--")) {
        writeStderr(output, "sdp build: --imports requires a configuration path.\n");
        return undefined;
      }
      if (imports !== undefined) {
        writeStderr(output, "sdp build: --imports may be supplied only once.\n");
        return undefined;
      }
      imports = path;
      index += 1;
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

  if (baseLabel !== undefined && base === undefined) {
    writeStderr(output, "sdp studio: --base-label requires --base.\n");
    return undefined;
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

  const rules: RulesInput[] = [];
  for (const item of rawRules) {
    const params = mergeParams(item.forms, output, "validate");
    if (params === undefined) return undefined;
    rules.push({ rulesFile: item.rulesFile, params, paramForms: item.forms });
  }

  const resolvedRoot = resolveExtractionRoot(root, output, command);
  if (resolvedRoot === undefined) return undefined;
  const studioInputs =
    base === undefined ? undefined : readStudioBase(base, baseLabel ?? null, output, resolvedRoot);
  if (base !== undefined && studioInputs === undefined) return undefined;

  return {
    ...(studioInputs === undefined ? {} : { studioInputs }),
    root: resolvedRoot,
    exclude,
    checkClean,
    ...(rules.length === 0 ? {} : { rules }),
    watch: watchMode,
    ...(imports === undefined ? {} : { imports }),
    ...(vault === undefined ? {} : { vault }),
  };
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

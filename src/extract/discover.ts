import { readdirSync } from "node:fs";
import { join } from "node:path";

/** Spec carriers (MD-15): discovery reads spec files and pack manifests by suffix alone. */
const SPEC_FILE_SUFFIXES = [".sdp.ts", ".sdp.md"] as const;

/**
 * Anchor-candidate source files: the anchored layer lives in real product code (`04` §2), so any
 * TypeScript source under the root may carry an anchor constant. Spec files are the declared
 * surface (never an anchor home), and declaration files are not source.
 */
const SOURCE_FILE_SUFFIXES = [".ts", ".tsx"] as const;
const DECLARATION_FILE_SUFFIX = ".d.ts";

/**
 * The tooling-output names discovery skips (alongside every dot-directory). Other build outputs
 * (`build/`, `out/`) stay in scope under suffix-alone discovery (MD-15): a stale copy beside its
 * live source fails loudly as a duplicate id; widening the skip list is deferred until external
 * adoption needs a configurable exclude.
 */
const EXCLUDED_DIRECTORY_NAMES = new Set(["node_modules", "dist", "generated", "coverage"]);
const WINDOWS_DRIVE_LETTER_ABSOLUTE_PATH = /^[A-Za-z]:\//;

export class InvalidExcludePathError extends Error {
  readonly name = "InvalidExcludePathError";

  constructor(readonly path: string) {
    super(`normalizeExcludes: invalid exclusion path "${path}"`);
  }
}

export function normalizeExcludes(exclude: readonly string[] | undefined): readonly string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const path of exclude ?? []) {
    if (
      path === "" ||
      path === "." ||
      path.startsWith("./") ||
      path.endsWith("/") ||
      path.startsWith("/") ||
      WINDOWS_DRIVE_LETTER_ABSOLUTE_PATH.test(path) ||
      path.includes("\\") ||
      path.split("/").some((segment) => segment === "" || segment === "..")
    ) {
      throw new InvalidExcludePathError(path);
    }

    if (!seen.has(path)) {
      normalized.push(path);
      seen.add(path);
    }
  }

  return normalized;
}

export interface DiscoveredSourceFile {
  readonly absolutePath: string;
  /** Extraction-root-relative, POSIX separators, no leading `./` (JS-C3). */
  readonly relativePath: string;
}

export interface DiscoveredFiles {
  readonly specFiles: readonly DiscoveredSourceFile[];
  readonly anchorCandidateFiles: readonly DiscoveredSourceFile[];
}

interface DiscoveryState {
  readonly excludes: readonly string[];
  readonly specFiles: DiscoveredSourceFile[];
  readonly anchorCandidateFiles: DiscoveredSourceFile[];
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) {
    return -1;
  }

  return a > b ? 1 : 0;
}

function byRelativePath(left: DiscoveredSourceFile, right: DiscoveredSourceFile): number {
  return compareCodeUnits(left.relativePath, right.relativePath);
}

function isSourceFileName(name: string): boolean {
  return (
    SOURCE_FILE_SUFFIXES.some((suffix) => name.endsWith(suffix)) &&
    !name.endsWith(DECLARATION_FILE_SUFFIX)
  );
}

function isExcluded(relativePath: string, excludes: readonly string[]): boolean {
  return excludes.some(
    (exclude) => relativePath === exclude || relativePath.startsWith(`${exclude}/`),
  );
}

function walkDirectory(
  absoluteDirectory: string,
  relativeDirectory: string,
  state: DiscoveryState,
): void {
  for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath =
      relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;

    if (isExcluded(relativePath, state.excludes)) {
      continue;
    }

    if (entry.isDirectory()) {
      // No authoring surface lives in a dot-directory: a stray source copy under one (`.git`, an
      // editor history cache) would reify into phantom carriers or duplicate-id hard errors.
      if (entry.name.startsWith(".") || EXCLUDED_DIRECTORY_NAMES.has(entry.name)) {
        continue;
      }

      walkDirectory(join(absoluteDirectory, entry.name), relativePath, state);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (SPEC_FILE_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) {
      state.specFiles.push({ absolutePath: join(absoluteDirectory, entry.name), relativePath });
      continue;
    }

    if (isSourceFileName(entry.name)) {
      state.anchorCandidateFiles.push({
        absolutePath: join(absoluteDirectory, entry.name),
        relativePath,
      });
    }
  }
}

/**
 * One walk, two surfaces: every `*.sdp.ts` and `*.sdp.md` under the extraction root (the declared
 * layer) and every other `*.ts`/`*.tsx` source file (the anchor candidates), minus tooling-output
 * directories and dot-directories. Both lists are sorted (code-unit, on the root-relative path)
 * so diagnostics never depend on filesystem enumeration order; output-byte ordering is owned by
 * the serializer regardless.
 */
export function discoverFiles(root: string, exclude?: readonly string[]): DiscoveredFiles {
  const state: DiscoveryState = {
    excludes: normalizeExcludes(exclude),
    specFiles: [],
    anchorCandidateFiles: [],
  };
  walkDirectory(root, "", state);

  return {
    specFiles: state.specFiles.sort(byRelativePath),
    anchorCandidateFiles: state.anchorCandidateFiles.sort(byRelativePath),
  };
}

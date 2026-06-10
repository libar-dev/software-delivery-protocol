import { readdirSync } from "node:fs";
import { join } from "node:path";

/** The `.sdp.ts` extension (MD-15): discovery reads spec files and pack manifests by suffix alone. */
const SPEC_FILE_SUFFIX = ".sdp.ts";

/**
 * Anchor-candidate source files: the anchored layer lives in real product code (`04` §2), so any
 * TypeScript source under the root may carry an anchor constant. Spec files are the declared
 * surface (never an anchor home), and declaration files are not source.
 */
const SOURCE_FILE_SUFFIXES = [".ts", ".tsx"] as const;
const DECLARATION_FILE_SUFFIX = ".d.ts";

const EXCLUDED_DIRECTORY_NAMES = new Set(["node_modules", "dist", "generated"]);

export interface DiscoveredSourceFile {
  readonly absolutePath: string;
  /** Extraction-root-relative, POSIX separators, no leading `./` (JS-C3). */
  readonly relativePath: string;
}

export interface DiscoveredFiles {
  readonly specFiles: readonly DiscoveredSourceFile[];
  readonly anchorCandidateFiles: readonly DiscoveredSourceFile[];
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

function walkDirectory(
  absoluteDirectory: string,
  relativeDirectory: string,
  specFiles: DiscoveredSourceFile[],
  anchorCandidateFiles: DiscoveredSourceFile[],
): void {
  for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath =
      relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORY_NAMES.has(entry.name)) {
        continue;
      }

      walkDirectory(
        join(absoluteDirectory, entry.name),
        relativePath,
        specFiles,
        anchorCandidateFiles,
      );
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (entry.name.endsWith(SPEC_FILE_SUFFIX)) {
      specFiles.push({ absolutePath: join(absoluteDirectory, entry.name), relativePath });
      continue;
    }

    if (isSourceFileName(entry.name)) {
      anchorCandidateFiles.push({
        absolutePath: join(absoluteDirectory, entry.name),
        relativePath,
      });
    }
  }
}

/**
 * One walk, two surfaces: every `*.sdp.ts` under the extraction root (the declared layer) and
 * every other `*.ts`/`*.tsx` source file (the anchor candidates), minus tooling output
 * directories. Both lists are sorted (code-unit, on the root-relative path) so diagnostics never
 * depend on filesystem enumeration order; output-byte ordering is owned by the serializer
 * regardless.
 */
export function discoverFiles(root: string): DiscoveredFiles {
  const specFiles: DiscoveredSourceFile[] = [];
  const anchorCandidateFiles: DiscoveredSourceFile[] = [];
  walkDirectory(root, "", specFiles, anchorCandidateFiles);

  return {
    specFiles: specFiles.sort(byRelativePath),
    anchorCandidateFiles: anchorCandidateFiles.sort(byRelativePath),
  };
}

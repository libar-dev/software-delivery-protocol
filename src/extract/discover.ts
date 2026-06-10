import { readdirSync } from "node:fs";
import { join } from "node:path";

/** The `.sdp.ts` extension (MD-15): discovery reads spec files and pack manifests by suffix alone. */
const SPEC_FILE_SUFFIX = ".sdp.ts";

const EXCLUDED_DIRECTORY_NAMES = new Set(["node_modules", "dist", "generated"]);

export interface DiscoveredSpecFile {
  readonly absolutePath: string;
  /** Extraction-root-relative, POSIX separators, no leading `./` (JS-C3). */
  readonly relativePath: string;
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) {
    return -1;
  }

  return a > b ? 1 : 0;
}

function walkDirectory(
  absoluteDirectory: string,
  relativeDirectory: string,
  discovered: DiscoveredSpecFile[],
): void {
  for (const entry of readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath =
      relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORY_NAMES.has(entry.name)) {
        continue;
      }

      walkDirectory(join(absoluteDirectory, entry.name), relativePath, discovered);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(SPEC_FILE_SUFFIX)) {
      discovered.push({ absolutePath: join(absoluteDirectory, entry.name), relativePath });
    }
  }
}

/**
 * Every `*.sdp.ts` file under the extraction root, minus tooling output directories. The list is
 * sorted (code-unit, on the root-relative path) so diagnostics never depend on filesystem
 * enumeration order; output-byte ordering is owned by the serializer regardless.
 */
export function discoverSpecFiles(root: string): readonly DiscoveredSpecFile[] {
  const discovered: DiscoveredSpecFile[] = [];
  walkDirectory(root, "", discovered);

  return discovered.sort((left, right) => compareCodeUnits(left.relativePath, right.relativePath));
}

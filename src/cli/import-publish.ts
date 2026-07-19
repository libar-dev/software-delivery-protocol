import { linkSync, rmSync, writeFileSync } from "node:fs";

import { removeArtifact, removeArtifacts } from "./artifacts.js";
import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr } from "./output.js";

export interface ImportPublicationHooks {
  readonly writeFileSync?: typeof writeFileSync;
  readonly linkSync?: typeof linkSync;
  readonly rmSync?: typeof rmSync;
}

export interface PlannedImport {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly content: string;
}

interface PreparedImport extends PlannedImport {
  readonly temporaryPath: string;
}

export function publishImports(
  planned: readonly PlannedImport[],
  output: CliOutput,
  hooks: ImportPublicationHooks,
): boolean {
  const write = hooks.writeFileSync ?? writeFileSync;
  const link = hooks.linkSync ?? linkSync;
  const remove = hooks.rmSync ?? rmSync;
  const prepared: PreparedImport[] = planned.map((entry, index) => ({
    ...entry,
    temporaryPath: `${entry.targetPath}.sdp-import-${String(process.pid)}-${String(index)}.tmp`,
  }));
  const createdTemporaryPaths: string[] = [];
  const publishedPaths: string[] = [];

  try {
    for (const entry of prepared) {
      write(entry.temporaryPath, entry.content, { encoding: "utf8", flag: "wx" });
      createdTemporaryPaths.push(entry.temporaryPath);
    }

    for (const entry of prepared) {
      try {
        link(entry.temporaryPath, entry.targetPath);
      } catch (error) {
        throw new Error(
          `publication requires a filesystem with hard-link support (${errorMessage(error)})`,
        );
      }
      publishedPaths.push(entry.targetPath);
      const failure = removeArtifact(entry.temporaryPath, remove);

      if (failure !== undefined) {
        writeStderr(
          output,
          `sdp import: stale ${entry.temporaryPath} could not be removed (${failure}) — do not read it as current.\n`,
        );
      }
    }

    return true;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(output, `sdp import: ${detail}\n`);
    removeArtifacts([...createdTemporaryPaths, ...publishedPaths], output, "import", remove);
    return false;
  }
}

import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFUSING_SUFFIX = ".txt";

function copyDefusedTree(sourceDirectory: string, targetDirectory: string): void {
  for (const entry of readdirSync(sourceDirectory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const targetSubdirectory = join(targetDirectory, entry.name);
      mkdirSync(targetSubdirectory);
      copyDefusedTree(join(sourceDirectory, entry.name), targetSubdirectory);
      continue;
    }

    if (entry.name.endsWith(DEFUSING_SUFFIX)) {
      copyFileSync(
        join(sourceDirectory, entry.name),
        join(targetDirectory, entry.name.slice(0, -DEFUSING_SUFFIX.length)),
      );
    }
  }
}

/**
 * Extraction corpora are committed defused — `*.sdp.ts.txt` for spec files, `*.ts.txt` for anchor
 * source files — never under their real names: discovery sweeps every spec file *and* every
 * source file under a build root, so a committed hard-error corpus would poison `sdp build` from
 * any root above it (this repo's own root included), and the typecheck tsconfigs would sweep a
 * deliberately type-incorrect `.ts` corpus. Materialization copies a corpus into a temp directory
 * and strips the defusing suffix, so the extractor still reads genuine on-disk files (the corpus
 * exercises the file-reading path, never in-memory objects). Directories materialize recursively,
 * so a corpus can carry the directory layout a discovery rule is pinned against (a stray copy
 * under a dot-directory).
 */
export function materializeExtractCorpus(name: string): string {
  const source = fileURLToPath(new URL(`../fixtures/extract/${name}`, import.meta.url));
  const target = mkdtempSync(join(tmpdir(), `sdp-extract-${name}-`));
  copyDefusedTree(source, target);

  return target;
}

export function removeMaterializedCorpus(root: string): void {
  rmSync(root, { recursive: true, force: true });
}

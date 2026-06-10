import { copyFileSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CORPUS_FILE_SUFFIX = ".sdp.ts.txt";
const DEFUSING_SUFFIX = ".txt";

/**
 * Extraction corpora are committed as `*.sdp.ts.txt`, never `*.sdp.ts`: discovery sweeps every
 * spec file under a build root, so a committed hard-error corpus would poison `sdp build` from any
 * root above it (this repo's own root included), and one corpus is deliberately type-incorrect.
 * Materialization copies a corpus into a temp directory and restores the real `.sdp.ts` names, so
 * the extractor still reads genuine on-disk spec files (the corpus exercises the file-reading
 * path, never in-memory objects).
 */
export function materializeExtractCorpus(name: string): string {
  const source = fileURLToPath(new URL(`../fixtures/extract/${name}`, import.meta.url));
  const target = mkdtempSync(join(tmpdir(), `sdp-extract-${name}-`));

  for (const entry of readdirSync(source)) {
    if (entry.endsWith(CORPUS_FILE_SUFFIX)) {
      copyFileSync(join(source, entry), join(target, entry.slice(0, -DEFUSING_SUFFIX.length)));
    }
  }

  return target;
}

export function removeMaterializedCorpus(root: string): void {
  rmSync(root, { recursive: true, force: true });
}

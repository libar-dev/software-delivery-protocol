import { existsSync, readFileSync, readdirSync } from "node:fs";
import type { Dirent } from "node:fs";
import { join, relative } from "node:path";

import { isJunk } from "junk";

/**
 * Finder's metadata file: Finder writes it into any folder a window shows. The vault's ratified
 * rule (`spec:decisions.vault-owned-folder`) ignores exactly this name under its owned folder.
 */
export const OS_METADATA_FILE = ".DS_Store";

/**
 * Whether an entry under a published root is a file the operating system or a tool wrote for its
 * own use, never a page, as `spec:consumers.wholesale-view-rewrite#rule.osMetadata` states: Finder's
 * `.DS_Store`, Windows's `Thumbs.db` and the rest of the `junk` package's list. It applies to files
 * only, so a directory of such a name is still read as content.
 */
export function isOsMetadataFile(entry: Pick<Dirent, "name" | "isFile">): boolean {
  return entry.isFile() && isJunk(entry.name);
}

/**
 * Bounded retries for removing a published tree. A folder that gains an entry while it is being
 * removed, such as Finder writing `.DS_Store`, fails with `ENOTEMPTY`; Node retries the removal.
 */
export const TREE_REMOVAL_RETRIES = { maxRetries: 5, retryDelay: 50 } as const;

export interface PublishedPage<Content> {
  readonly path: string;
  readonly content: Content;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Reads every file under a published root as a page, in code-unit order of its root-relative
 * POSIX path, leaving out operating-system metadata. Returns undefined when the root is absent.
 * `onOther` receives each entry that is neither a file nor a directory; without it they are skipped.
 */
export function readPublishedTree<Content>(
  root: string,
  read: (path: string) => Content,
  options: {
    readonly skip?: (path: string) => boolean;
    readonly onOther?: (entry: Dirent) => void;
  } = {},
): readonly PublishedPage<Content>[] | undefined {
  if (!existsSync(root)) return undefined;
  const pages: PublishedPage<Content>[] = [];
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (isOsMetadataFile(entry) || options.skip?.(path) === true) continue;
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile())
        pages.push({ path: relative(root, path).replaceAll("\\", "/"), content: read(path) });
      else options.onOther?.(entry);
    }
  };
  visit(root);
  return pages.sort((left, right) => compareCodeUnits(left.path, right.path));
}

/** Reads a published root of UTF-8 text pages; see `readPublishedTree`. */
export function readPublishedTextPages(root: string): readonly PublishedPage<string>[] | undefined {
  return readPublishedTree(root, (path) => readFileSync(path, "utf8"));
}

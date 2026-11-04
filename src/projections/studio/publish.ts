import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, posix, win32 } from "node:path";

import { readPublishedTree, TREE_REMOVAL_RETRIES } from "../published-tree.js";
import type { StudioPage } from "./pages/index.js";

export interface StudioAssets {
  readonly script: string;
  readonly stylesheet: string;
}

export interface StudioFile {
  readonly path: string;
  readonly content: string | Uint8Array;
}

/**
 * @sdpAnchor impl:protocol.studio-publish
 * @sdpLabel copies local assets and replaces the Studio directory through its temporary sibling
 * @sdpSatisfies spec:consumers.spec-studio.publisher
 * @sdpComponent component:protocol.projections
 * @sdpRole publisher
 */
export function studioFiles(
  pages: readonly StudioPage[],
  assets: StudioAssets,
): readonly StudioFile[] {
  for (const page of pages) {
    if (
      page.path === "" ||
      page.path.includes("\\") ||
      posix.isAbsolute(page.path) ||
      win32.isAbsolute(page.path) ||
      posix.normalize(page.path) !== page.path ||
      page.path.split("/").some((part) => part === ".." || part === ".")
    ) {
      throw new Error(`unsafe Studio page path: ${page.path}`);
    }
  }
  return [
    ...pages,
    { path: "assets/studio.js", content: readFileSync(assets.script) },
    { path: "assets/studio.css", content: readFileSync(assets.stylesheet) },
  ].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

export function readPublishedStudio(root: string): readonly StudioFile[] | undefined {
  return readPublishedTree(root, (path) => readFileSync(path), {
    // The publishing stamp is written apart and is not part of the deterministic render.
    skip: (path) => path === join(root, "stamp.json"),
    onOther: (entry) => {
      throw new Error(`generated Studio contains a non-file entry: ${entry.name}`);
    },
  });
}

export function studioFilesEqual(
  left: readonly StudioFile[],
  right: readonly StudioFile[],
): boolean {
  return (
    left.length === right.length &&
    left.every((file, index) => {
      const other = right[index];
      return (
        file.path === other?.path && Buffer.from(file.content).equals(Buffer.from(other.content))
      );
    })
  );
}

export function publishStudio(
  root: string,
  files: readonly StudioFile[],
  fs = { rmSync, mkdirSync, writeFileSync, renameSync },
): void {
  const temporary = `${root}.tmp`;
  fs.rmSync(temporary, { recursive: true, force: true, ...TREE_REMOVAL_RETRIES });
  for (const file of files) {
    const target = join(temporary, file.path);
    fs.mkdirSync(dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, { flag: "wx" });
  }
  fs.rmSync(root, { recursive: true, force: true, ...TREE_REMOVAL_RETRIES });
  fs.renameSync(temporary, root);
}

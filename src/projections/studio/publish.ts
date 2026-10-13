import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, posix, relative, win32 } from "node:path";

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
  if (!existsSync(root)) return undefined;
  const files: StudioFile[] = [];
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile())
        files.push({
          path: relative(root, path).replaceAll("\\", "/"),
          content: readFileSync(path),
        });
      else throw new Error(`generated Studio contains a non-file entry: ${entry.name}`);
    }
  };
  walk(root);
  return files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
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

export function publishStudio(root: string, files: readonly StudioFile[]): void {
  const temporary = `${root}.tmp`;
  rmSync(temporary, { recursive: true, force: true });
  for (const file of files) {
    const target = join(temporary, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
  rmSync(root, { recursive: true, force: true });
  renameSync(temporary, root);
}

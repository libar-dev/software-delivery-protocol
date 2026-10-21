import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  rmdirSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

export interface VaultFile {
  readonly path: string;
  readonly content: string;
}
export interface FileList {
  readonly schema: "sdp-vault/1";
  readonly files: Readonly<Record<string, readonly string[]>>;
}
export interface VaultState {
  readonly files: ReadonlyMap<string, Buffer>;
  readonly list: FileList;
  readonly temporaries: readonly string[];
}
export const LIST = ".sdp-vault.json";
export const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
export const hash = (bytes: string | Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");
export const temporary = (path: string): string =>
  join(dirname(path), `.${basename(path)}.sdp-tmp`).replaceAll("\\", "/");
export function serializeList(files: Readonly<Record<string, readonly string[]>>): string {
  const entries = Object.entries(files).sort(([a], [b]) => compare(a, b));
  // Object enumeration reorders integer-looking keys even after insertion in sorted order.
  const body =
    entries.length === 0
      ? "{}"
      : "{\n" +
        entries
          .map(
            ([path, contents]) =>
              `    ${JSON.stringify(path)}: ${JSON.stringify(contents, null, 2).replaceAll("\n", "\n    ")}`,
          )
          .join(",\n") +
        "\n  }";
  return `{\n  "schema": "sdp-vault/1",\n  "files": ${body}\n}\n`;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseList(bytes: string | Buffer): FileList | undefined {
  try {
    const value: unknown = JSON.parse(bytes.toString());
    if (
      !isRecord(value) ||
      value.schema !== "sdp-vault/1" ||
      !isRecord(value.files) ||
      Object.keys(value).length !== 2
    )
      return undefined;
    const files: Record<string, readonly string[]> = {};
    for (const [path, contents] of Object.entries(value.files)) {
      if (
        path === LIST ||
        path.includes("\\") ||
        /^[A-Za-z]:/u.test(path) ||
        path.split("/").some((p) => p === "" || p === "." || p === "..") ||
        path.split("/").some((p) => p.startsWith(".") && p.endsWith(".sdp-tmp")) ||
        !Array.isArray(contents) ||
        contents.length < 1 ||
        contents.length > 2 ||
        !contents.every((h): h is string => typeof h === "string" && /^[a-f0-9]{64}$/u.test(h))
      )
        return undefined;
      Object.defineProperty(files, path, { value: contents, enumerable: true });
    }
    if (!Buffer.from(bytes).equals(Buffer.from(serializeList(files)))) return undefined;
    return { schema: "sdp-vault/1", files };
  } catch {
    return undefined;
  }
}
export class VaultGuardError extends Error {
  constructor(
    readonly refusals: readonly {
      path: string;
      reason: "unknown" | "changed" | "not a file" | "malformed";
    }[],
  ) {
    super("vault guard refused");
  }
}
function missing(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
/**
 * @sdpAnchor impl:protocol.vault-sync
 * @sdpLabel guards every owned entry and records transitional hashes before atomic file replacement
 * @sdpSatisfies spec:consumers.obsidian-vault
 * @sdpReferences spec:decisions.vault-owned-folder
 * @sdpComponent component:protocol.projections
 * @sdpRole publisher
 */
export function inspectVault(out: string): VaultState {
  const folder = join(out, "sdp");
  const files = new Map<string, Buffer>();
  const refusals: { path: string; reason: "unknown" | "changed" | "not a file" | "malformed" }[] =
    [];
  const walk = (absolute: string, path: string): void => {
    let stats;
    try {
      stats = lstatSync(absolute);
    } catch (error) {
      if (missing(error)) return;
      throw error;
    }
    if (stats.isSymbolicLink() || (!stats.isFile() && !stats.isDirectory())) {
      refusals.push({ path: path ? `sdp/${path}` : "sdp", reason: "not a file" });
      return;
    }
    if (stats.isDirectory()) {
      for (const name of readdirSync(absolute).sort(compare))
        walk(join(absolute, name), path ? `${path}/${name}` : name);
    } else if (path === "") refusals.push({ path: "sdp", reason: "not a file" });
    else files.set(path, readFileSync(absolute));
  };
  walk(folder, "");
  const listBytes = files.get(LIST);
  const parsed = listBytes === undefined ? undefined : parseList(listBytes);
  if (listBytes !== undefined && parsed === undefined)
    refusals.push({ path: `sdp/${LIST}`, reason: "malformed" });
  const list = parsed ?? { schema: "sdp-vault/1" as const, files: {} };
  const temporaries: string[] = [];
  for (const [path, bytes] of files) {
    if (path === LIST) continue;
    const target = path.split("/");
    const name = target.pop() ?? "";
    if (name.startsWith(".") && name.endsWith(".sdp-tmp")) {
      target.push(name.slice(1, -".sdp-tmp".length));
      const original = target.join("/");
      if (
        (original === LIST && parseList(bytes) !== undefined) ||
        (Object.hasOwn(list.files, original) && list.files[original]?.includes(hash(bytes)))
      ) {
        temporaries.push(path);
        continue;
      }
    } else if (Object.hasOwn(list.files, path)) {
      if (!list.files[path]?.includes(hash(bytes)))
        refusals.push({ path: `sdp/${path}`, reason: "changed" });
      continue;
    }
    refusals.push({ path: `sdp/${path}`, reason: "unknown" });
  }
  if (refusals.length) throw new VaultGuardError(refusals);
  return { files, list, temporaries };
}
export interface SyncResult {
  readonly files: number;
  readonly written: number;
  readonly unchanged: number;
  readonly removed: number;
}
export function synchronizeVault(
  out: string,
  next: readonly VaultFile[],
  state = inspectVault(out),
  rename = renameSync,
): SyncResult {
  const folder = join(out, "sdp");
  const desired = new Map(next.map((file) => [file.path, file.content]));
  const transitional: Record<string, readonly string[]> = Object.create(null) as Record<
    string,
    readonly string[]
  >;
  const final: Record<string, readonly string[]> = Object.create(null) as Record<
    string,
    readonly string[]
  >;
  for (const [path, content] of desired) {
    if (parseList(serializeList({ [path]: [hash(content)] })) === undefined)
      throw new Error(`invalid vault path ${path}`);
    final[path] = [hash(content)];
  }
  for (const path of new Set([...Object.keys(state.list.files), ...desired.keys()])) {
    const previous = state.files.get(path);
    const hashes = [
      ...new Set([...(previous === undefined ? [] : [hash(previous)]), ...(final[path] ?? [])]),
    ];
    if (hashes.length) transitional[path] = hashes;
  }
  const atomic = (path: string, content: string): void => {
    const target = join(folder, path);
    mkdirSync(dirname(target), { recursive: true });
    const temp = join(folder, temporary(path));
    writeFileSync(temp, content, "utf8");
    if (path === LIST) renameSync(temp, target);
    else rename(temp, target);
  };
  // An interrupted list replacement is recognized by its canonical bytes too.
  for (const path of state.temporaries) rmSync(join(folder, path));
  const transitionBytes = serializeList(transitional);
  if (state.files.get(LIST)?.toString("utf8") !== transitionBytes) atomic(LIST, transitionBytes);
  let written = 0,
    unchanged = 0,
    removed = 0;
  for (const [path, content] of desired) {
    if (state.files.get(path)?.equals(Buffer.from(content))) unchanged++;
    else {
      atomic(path, content);
      written++;
    }
  }
  for (const path of Object.keys(state.list.files))
    if (!desired.has(path) && state.files.has(path)) {
      rmSync(join(folder, path));
      removed++;
    }
  const prune = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true }))
      if (entry.isDirectory()) prune(join(directory, entry.name));
    if (directory !== folder && readdirSync(directory).length === 0) rmdirSync(directory);
  };
  mkdirSync(folder, { recursive: true });
  prune(folder);
  const finalBytes = serializeList(final);
  if (readFileSync(join(folder, LIST), "utf8") !== finalBytes) atomic(LIST, finalBytes);
  return { files: desired.size, written, unchanged, removed };
}

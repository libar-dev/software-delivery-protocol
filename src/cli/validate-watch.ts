import { lstatSync, readdirSync, realpathSync, watch } from "node:fs";
import type { Stats } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";

import {
  isExcludedDiscoveryDirectory,
  isSourceFileName,
  isSpecFileName,
  isWarnedSymbolicLink,
} from "../extract/discover.js";
import { parameterFiles } from "./params.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";
import { runValidate, runValidateRules } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

export interface ValidateWatchEvent {
  readonly type: "create" | "change" | "delete" | "rename";
  readonly path: string;
  /**
   * True when the event stands for a removed watched directory: the carriers underneath are gone
   * without per-file events, so the deletion must schedule a rerun even though the directory path
   * itself carries no carrier suffix.
   */
  readonly subtreeRemoved?: boolean;
  /**
   * True when the native watcher reported no filename: the change cannot be attributed to one
   * entry, so the event must schedule a rerun even though its path names a directory.
   */
  readonly unattributed?: boolean;
  /**
   * True when the event names a symbolic link discovery warns about, before or after the event:
   * creating, removing or replacing one changes the warning list although no carrier changed.
   */
  readonly skippedLink?: boolean;
}

export interface ValidateWatchEventSource {
  readonly on: (listener: (event: ValidateWatchEvent) => void) => void;
  readonly onError: (listener: (error: unknown) => void) => void;
  readonly close: () => void;
}

export interface NativeWatchHandle {
  readonly on: (event: "error", listener: (error: Error) => void) => void;
  readonly close: () => void;
}

export type NativeWatchFactory = (
  directory: string,
  listener: (eventType: string, filename: string | null) => void,
) => NativeWatchHandle;

export class ValidateWatchSourceError extends Error {
  readonly name = "ValidateWatchSourceError";

  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause), {
      cause: cause instanceof Error ? cause : undefined,
    });
  }
}

export interface ValidateWatchCycle {
  readonly index: number;
  readonly exitCode: number;
}

export interface ValidateWatchHooks {
  readonly watchSources?: boolean;
  /**
   * Drops events the cycle's own writes cause. It never sees a skipped-link event: it may resolve
   * a link to its target, while the event concerns the link itself, which no cycle creates.
   */
  readonly ignoreWatchPath?: (path: string) => boolean;
  readonly watchCommand?: string;
  readonly runWatchCycle?: () =>
    | { readonly exitCode: number }
    | Promise<{ readonly exitCode: number }>;
  readonly onWatchStop?: () => void;
  readonly abortSignal?: AbortSignal;
  readonly createWatchSource?: (input: {
    readonly root: string;
    readonly exclude: readonly string[];
    readonly files: readonly string[];
  }) => ValidateWatchEventSource;
  readonly createNativeWatch?: NativeWatchFactory;
  readonly lstatWatchPath?: (path: string) => Stats;
  readonly onWatchCycleComplete?: (cycle: ValidateWatchCycle) => void;
  readonly watchCycleGate?: (cycleIndex: number) => Promise<undefined> | undefined;
}

interface CycleWaiter {
  readonly wake: () => void;
  readonly wait: () => Promise<undefined>;
}

interface WatchLoopState {
  closed: boolean;
  running: boolean;
  pendingRerun: boolean;
  coalesceScheduled: boolean;
  cycleIndex: number;
  failure: ValidateWatchSourceError | undefined;
}

function isWatchClosed(state: WatchLoopState): boolean {
  return state.closed;
}

function hasPendingWatchRerun(state: WatchLoopState): boolean {
  return state.pendingRerun;
}

function createCycleWaiter(): CycleWaiter {
  let settle: (() => void) | undefined;
  let queued = false;

  return {
    wake() {
      if (settle === undefined) {
        queued = true;
        return;
      }

      const resume = settle;
      settle = undefined;
      resume();
    },
    wait() {
      if (queued) {
        queued = false;
        return Promise.resolve(undefined);
      }

      return new Promise<undefined>((resolve) => {
        settle = () => {
          resolve(undefined);
        };
      });
    },
  };
}

function toPosixRelative(root: string, eventPath: string): string {
  const normalized = eventPath.replaceAll("\\", "/");

  if (!isAbsolute(eventPath)) {
    return normalized;
  }

  return relative(root, eventPath).replaceAll("\\", "/");
}

function isExcludedPrefix(relativePath: string, exclude: readonly string[]): boolean {
  return exclude.some((prefix) => relativePath === prefix || relativePath.startsWith(`${prefix}/`));
}

function isWatchableDirectoryPath(
  root: string,
  directoryPath: string,
  exclude: readonly string[],
): boolean {
  const relativePath = toPosixRelative(root, directoryPath);

  if (relativePath === "" || relativePath === ".") {
    return true;
  }

  if (relativePath.startsWith("../")) {
    return false;
  }

  const segments = relativePath.split("/").filter((segment) => segment !== "");

  if (segments.some((segment) => isExcludedDiscoveryDirectory(segment))) {
    return false;
  }

  return !isExcludedPrefix(relativePath, exclude);
}

/**
 * The root-relative path of an entry discovery reaches, or `undefined` for an entry outside the
 * root, under a directory discovery skips, or under a configured exclusion.
 */
function reachedEntryPath(
  root: string,
  eventPath: string,
  exclude: readonly string[],
): string | undefined {
  const relativePath = toPosixRelative(root, eventPath);

  if (relativePath === "" || relativePath === "." || relativePath.startsWith("../")) {
    return undefined;
  }

  // Discovery skips dot-directories, never dot-files: a basename like `..cache.sdp.ts` is a
  // lawful carrier, so only the directory segments carry the exclusion check.
  const segments = relativePath.split("/").filter((segment) => segment !== "");

  if (segments.slice(0, -1).some((segment) => isExcludedDiscoveryDirectory(segment))) {
    return undefined;
  }

  return isExcludedPrefix(relativePath, exclude) ? undefined : relativePath;
}

function entryName(relativePath: string): string {
  return relativePath.slice(relativePath.lastIndexOf("/") + 1);
}

export function isWatchedCarrierPath(
  root: string,
  eventPath: string,
  exclude: readonly string[],
  sources = false,
): boolean {
  const relativePath = reachedEntryPath(root, eventPath, exclude);

  if (relativePath === undefined) {
    return false;
  }

  const name = entryName(relativePath);

  return isSpecFileName(name) || (sources && isSourceFileName(name));
}

function defaultNativeWatch(
  directory: string,
  listener: (eventType: string, filename: string | null) => void,
): NativeWatchHandle {
  return watch(directory, listener);
}

function isDescendantPath(parent: string, candidate: string): boolean {
  const nested = relative(parent, candidate);

  return nested !== "" && !nested.startsWith("..") && !isAbsolute(nested);
}

function isNotFoundError(error: unknown): boolean {
  const code =
    typeof error === "object" && error !== null && "code" in error ? error.code : undefined;

  return code === "ENOENT" || code === "ENOTDIR";
}

/** A watched directory found gone or replaced, with what now stands at its path, if anything. */
interface ReplacedDirectory {
  readonly directory: string;
  readonly replacement: Stats | undefined;
}

function createFilesystemWatchSource(input: {
  readonly root: string;
  readonly exclude: readonly string[];
  readonly createNativeWatch?: NativeWatchFactory;
  readonly watchSources?: boolean;
  readonly lstatWatchPath?: (path: string) => Stats;
}): ValidateWatchEventSource {
  const createNativeWatch = input.createNativeWatch ?? defaultNativeWatch;
  // Resolve only the selected root; descendant links stay outside the watched tree.
  const lstatWatchPath =
    input.lstatWatchPath ??
    ((path: string) => lstatSync(path === input.root ? realpathSync.native(path) : path));
  const watchers = new Map<string, NativeWatchHandle>();
  // The identity of the directory each handle was opened on. A watcher may follow the inode it
  // was opened on (inotify does) rather than the path, so a path that now holds another
  // directory needs a new handle. The birth time is 0 where the filesystem reports none.
  const identities = new Map<
    string,
    { readonly dev: number; readonly ino: number; readonly birthtimeMs: number }
  >();
  // The watched directories that, when last read, held an entry with their own name, such as
  // `docs/docs`. inotify reports a directory's own move or deletion on its handle under that name,
  // so once nothing stands at that name, an event naming the entry is told apart from the
  // directory's own by whether the entry was there.
  const holdOwnName = new Set<string>();
  // The links discovery warns about, by absolute path, so removing one still schedules a run.
  const skippedLinks = new Set<string>();
  let eventListener: ((event: ValidateWatchEvent) => void) | undefined;
  let errorListener: ((error: unknown) => void) | undefined;
  let pendingError: unknown;
  let closed = false;

  const isSkippedLink = (absolutePath: string, relativePath: string): boolean =>
    reachedEntryPath(input.root, relativePath, input.exclude) !== undefined &&
    isWarnedSymbolicLink(absolutePath, entryName(relativePath));

  const fail = (error: unknown): void => {
    if (closed) {
      return;
    }

    if (errorListener === undefined) {
      pendingError = error;
      return;
    }

    errorListener(error);
  };

  const unwatchTree = (absoluteDirectory: string): void => {
    for (const candidate of [...watchers.keys()]) {
      if (candidate !== absoluteDirectory && !isDescendantPath(absoluteDirectory, candidate)) {
        continue;
      }

      const handle = watchers.get(candidate);
      watchers.delete(candidate);
      identities.delete(candidate);
      holdOwnName.delete(candidate);
      handle?.close();
    }

    for (const link of [...skippedLinks]) {
      if (isDescendantPath(absoluteDirectory, link)) {
        skippedLinks.delete(link);
      }
    }
  };

  // True when a watched path now holds a directory other than the one its handle was opened on.
  // Some network and FUSE filesystems do not keep a directory's inode number stable, and one that
  // changes it from one read to the next would make every event look like a replacement, so a
  // changed identity counts only when a second read confirms it. On such a filesystem identity
  // cannot show a directory replaced, and only the events that report a replacement do. A
  // filesystem that changes a directory's number now and then, as when its cache drops the entry,
  // still costs one rebuild of that subtree and one run per change. A second read that fails
  // counts as another directory: the path no longer holds the one the handle was opened on.
  const isOtherDirectory = (absoluteDirectory: string, stats: Stats): boolean => {
    const opened = identities.get(absoluteDirectory);

    if (
      opened === undefined ||
      !stats.isDirectory() ||
      (opened.dev === stats.dev && opened.ino === stats.ino)
    ) {
      return false;
    }

    try {
      const again = lstatWatchPath(absoluteDirectory);

      return !again.isDirectory() || (again.dev === stats.dev && again.ino === stats.ino);
    } catch {
      return true;
    }
  };

  // True when a watched directory still has the birth time it had when its handle was opened, so it
  // is that directory and the handle lives. A directory deleted and recreated can get the deleted
  // one's inode number back, but it is born again. Only the directory's own reports need this: the
  // birth time is compared nowhere else, because a platform without birth times may report the
  // change time in their place, and that changes with every entry.
  const keepsBirthTime = (absoluteDirectory: string): boolean => {
    const opened = identities.get(absoluteDirectory);

    if (opened === undefined || !(opened.birthtimeMs > 0)) {
      return false;
    }

    try {
      const stats = lstatWatchPath(absoluteDirectory);

      return stats.isDirectory() && stats.birthtimeMs === opened.birthtimeMs;
    } catch {
      return false;
    }
  };

  // A callback names its entries by path. Once a watched directory on the way up from it is gone
  // or was replaced by a link, a file or another directory, those paths resolve through the
  // replacement, perhaps outside the root, and the retired handle may report another tree under
  // them. Returns the highest such directory below the root, whose subtree is dropped, with what
  // now stands at its path (`undefined` when nothing does).
  const replacedDirectory = (absoluteDirectory: string): ReplacedDirectory | undefined => {
    let replaced: ReplacedDirectory | undefined;

    for (
      let directory = absoluteDirectory;
      isDescendantPath(input.root, directory);
      directory = dirname(directory)
    ) {
      try {
        const stats = lstatWatchPath(directory);

        if (!stats.isDirectory() || isOtherDirectory(directory, stats)) {
          replaced = { directory, replacement: stats };
        }
      } catch (error) {
        if (!isNotFoundError(error)) {
          throw error;
        }

        replaced = { directory, replacement: undefined };
      }
    }

    return replaced;
  };

  // The root has no parent watcher, so only the handles of its own tree can show it replaced, and
  // every name they report resolves through whatever now stands at the root. True when the root is
  // gone, no longer a directory or another directory than the one its handle was opened on. A root
  // deleted and recreated with its inode reused keeps its identity; its handle's own report of the
  // deletion covers that case, as for any watched directory.
  const rootReplaced = (): boolean => {
    let stats: Stats;

    try {
      stats = lstatWatchPath(input.root);
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      return true;
    }

    return !stats.isDirectory() || isOtherDirectory(input.root, stats);
  };

  // A watched directory that is gone, or was replaced by a link, a file or another directory, loses
  // its carriers without per-file events, so its event schedules a run. A replacement link
  // discovery warns about is remembered like any other, so removing that link later schedules a
  // run too.
  const dropDirectory = (
    absoluteDirectory: string,
    relativeDirectory: string,
    replacement: Stats | undefined,
  ): void => {
    unwatchTree(absoluteDirectory);
    const wasSkippedLink = skippedLinks.has(absoluteDirectory);
    const skippedLink =
      replacement?.isSymbolicLink() === true && isSkippedLink(absoluteDirectory, relativeDirectory);

    if (skippedLink) {
      skippedLinks.add(absoluteDirectory);
    } else {
      skippedLinks.delete(absoluteDirectory);
    }

    eventListener?.({
      type: "delete",
      path: relativeDirectory,
      subtreeRemoved: true,
      ...(skippedLink || wasSkippedLink ? { skippedLink: true } : {}),
    });
  };

  // A directory whose subtree loses its watchers recovers through its parent's deletion event —
  // except the root, which has no parent watcher. A root that cannot be observed anymore would
  // leave the command alive but permanently blind to the tree it claims to validate, so it rides
  // the same typed failure path as any other watcher error.
  const failUnwatchableRoot = (cause: unknown): void => {
    const detail = cause instanceof Error ? `: ${cause.message}` : "";
    fail(
      new Error(`the watch root ${input.root} was removed or can no longer be watched${detail}`),
    );
  };

  // A native watcher may report an event without a filename (platform-dependent, common on
  // directory renames and deletions). The change cannot be attributed to one entry, so reconcile
  // the watched directory itself: drop its subtree if it is gone or no longer a real directory,
  // otherwise rebuild the subtree's watchers from the current tree and report an unattributed
  // change — the rerun re-derives everything, so attribution is never load-bearing. The rebuild
  // is unconditional because a dead handle cannot be told apart from a live one: a descendant
  // deleted or recreated without its own event keeps its path (and, after inode reuse, even its
  // inode), while the stale entry would block re-subscription forever.
  const reconcileDirectory = (absoluteDirectory: string, relativeDirectory: string): void => {
    let stats: Stats;

    try {
      stats = lstatWatchPath(absoluteDirectory);
    } catch (error) {
      if (!isNotFoundError(error)) {
        fail(error);
        return;
      }

      if (absoluteDirectory === input.root) {
        unwatchTree(absoluteDirectory);
        failUnwatchableRoot(error);
        return;
      }

      dropDirectory(absoluteDirectory, relativeDirectory, undefined);
      return;
    }

    if (!stats.isDirectory()) {
      if (absoluteDirectory === input.root) {
        unwatchTree(absoluteDirectory);
        failUnwatchableRoot(undefined);
        return;
      }

      dropDirectory(absoluteDirectory, relativeDirectory, stats);
      return;
    }

    unwatchTree(absoluteDirectory);
    subscribeTree(absoluteDirectory, relativeDirectory, false);

    if (!watchers.has(input.root)) {
      failUnwatchableRoot(undefined);
      return;
    }

    eventListener?.({ type: "change", path: relativeDirectory, unattributed: true });
  };

  const subscribeDirectory = (absoluteDirectory: string, relativeDirectory: string): void => {
    if (closed || watchers.has(absoluteDirectory)) {
      return;
    }

    if (!isWatchableDirectoryPath(input.root, relativeDirectory, input.exclude)) {
      return;
    }

    let directoryStats: Stats;

    try {
      directoryStats = lstatWatchPath(absoluteDirectory);
    } catch (error) {
      if (!isNotFoundError(error)) {
        fail(error);
      } else if (absoluteDirectory === input.root) {
        failUnwatchableRoot(error);
      }

      // A vanished non-root directory recovers through its parent's deletion event.
      return;
    }

    if (!directoryStats.isDirectory()) {
      if (absoluteDirectory === input.root) {
        failUnwatchableRoot(undefined);
      }

      return;
    }

    let handle: NativeWatchHandle | undefined;

    try {
      handle = createNativeWatch(absoluteDirectory, (eventType, filename) => {
        // A closed or retired subscription may still deliver a queued event; only the handle
        // registered for this directory speaks for it.
        if (closed || handle === undefined || watchers.get(absoluteDirectory) !== handle) {
          return;
        }

        let replacedRoot: boolean;

        try {
          replacedRoot = rootReplaced();
        } catch (error) {
          fail(error);
          return;
        }

        // Reconciling the root retires every handle, watches the directory that now stands at the
        // root in its place and schedules a run, or fails typed when no directory stands there.
        if (replacedRoot) {
          reconcileDirectory(input.root, "");
          return;
        }

        let replaced: ReplacedDirectory | undefined;

        try {
          replaced = replacedDirectory(absoluteDirectory);
        } catch (error) {
          fail(error);
          return;
        }

        if (replaced !== undefined) {
          const replacedPath = toPosixRelative(input.root, replaced.directory);
          dropDirectory(replaced.directory, replacedPath, replaced.replacement);

          // Another directory at the path is watched afresh, and its carriers join the next run.
          if (replaced.replacement?.isDirectory() === true) {
            subscribeTree(replaced.directory, replacedPath, true);
          }

          return;
        }

        if (filename === null || filename === "") {
          reconcileDirectory(absoluteDirectory, relativeDirectory);
          return;
        }

        const entryName = filename.replaceAll("\\", "/");
        const relativePath =
          relativeDirectory === "" ? entryName : `${relativeDirectory}/${entryName}`;
        const absolutePath = join(absoluteDirectory, entryName);
        const namesOwnDirectory = entryName === basename(absoluteDirectory);
        let stats: Stats;

        try {
          // lstat, never stat: a directory symlink must not be traversed or subscribed — following
          // it would watch trees outside the root and admit watcher loops.
          stats = lstatWatchPath(absolutePath);
        } catch (error) {
          if (!isNotFoundError(error)) {
            fail(error);
            return;
          }

          // inotify reports a watched directory's own move or deletion on its handle as a rename
          // under the directory's own name. Unless an entry of that name was there to go, the
          // event is the directory's own: its handle may be dead, even where a directory deleted
          // and recreated reuses the inode and keeps its identity, so the directory is reconciled
          // in place. inotify reports a change to the directory's own attributes, such as its
          // times, the same way, so such a change also rebuilds its handles and schedules a run.
          // So does an entry with the directory's name that comes and goes before its first event
          // is read.
          const heldOwnName = namesOwnDirectory && holdOwnName.delete(absoluteDirectory);

          if (namesOwnDirectory && eventType === "rename" && !heldOwnName) {
            reconcileDirectory(absoluteDirectory, relativeDirectory);
            return;
          }

          const removedWatchedDirectory = watchers.has(absolutePath);
          unwatchTree(absolutePath);
          const removedSkippedLink = skippedLinks.delete(absolutePath);
          eventListener?.({
            type: "delete",
            path: relativePath,
            ...(removedWatchedDirectory ? { subtreeRemoved: true } : {}),
            ...(removedSkippedLink ? { skippedLink: true } : {}),
          });
          return;
        }

        // With an entry of the directory's own name standing there, the entry's event and the
        // directory's own report look the same, whether or not the entry was there before: a
        // directory deleted and recreated with its inode reused may hold such an entry again. The
        // directory's birth time tells them apart. Where the filesystem reports none, the event
        // rebuilds the directory's handles and schedules a run.
        if (namesOwnDirectory) {
          if (eventType === "rename" && !keepsBirthTime(absoluteDirectory)) {
            reconcileDirectory(absoluteDirectory, relativeDirectory);
            return;
          }

          holdOwnName.add(absoluteDirectory);
        }

        // A watched directory replaced by a link, a file or another directory loses its carriers
        // without per-file events, and its retained watchers would resolve their entries through
        // the replacement or keep watching the moved directory. A directory that keeps its
        // identity keeps its handles and is not read again: macOS can report a rename for a
        // directory that has not moved, and Linux reports a change to a directory's own times as a
        // rename at its parent. When such a directory was deleted and recreated with its inode
        // reused, its own handle reports the deletion.
        const replacedWatchedDirectory =
          watchers.has(absolutePath) &&
          (!stats.isDirectory() || isOtherDirectory(absolutePath, stats));

        if (replacedWatchedDirectory) {
          unwatchTree(absolutePath);
        }

        const wasSkippedLink = skippedLinks.has(absolutePath);
        const skippedLink = stats.isSymbolicLink() && isSkippedLink(absolutePath, relativePath);

        if (skippedLink) {
          skippedLinks.add(absolutePath);
        } else {
          skippedLinks.delete(absolutePath);
        }

        if (stats.isDirectory()) {
          subscribeTree(absolutePath, relativePath, true);
        }

        eventListener?.({
          type: eventType === "rename" ? "rename" : "change",
          path: relativePath,
          ...(replacedWatchedDirectory ? { subtreeRemoved: true } : {}),
          ...(skippedLink || wasSkippedLink ? { skippedLink: true } : {}),
        });
      });
    } catch (error) {
      fail(error);
      return;
    }

    handle.on("error", (error) => {
      if (closed || watchers.get(absoluteDirectory) !== handle) {
        return;
      }

      const code = (error as NodeJS.ErrnoException).code;
      if (absoluteDirectory !== input.root && (code === "EPERM" || code === "EACCES")) {
        reconcileDirectory(absoluteDirectory, relativeDirectory);
        return;
      }

      fail(error);
    });
    watchers.set(absoluteDirectory, handle);
    identities.set(absoluteDirectory, {
      dev: directoryStats.dev,
      ino: directoryStats.ino,
      birthtimeMs: directoryStats.birthtimeMs,
    });
  };

  // Watches a directory the watch does not watch yet and every directory under it, reporting the
  // carriers already there when asked. A directory already watched is not read again: its
  // carriers are in the graph, and reporting them as created would start a run that changes
  // nothing. A directory replaced or rebuilt loses its handles first, so it is read afresh.
  const subscribeTree = (
    absoluteDirectory: string,
    relativeDirectory: string,
    emitExistingCarriers: boolean,
  ): void => {
    if (watchers.has(absoluteDirectory)) {
      return;
    }

    subscribeDirectory(absoluteDirectory, relativeDirectory);

    if (closed || !watchers.has(absoluteDirectory)) {
      return;
    }

    let entries;

    try {
      entries = readdirSync(absoluteDirectory, { withFileTypes: true });
    } catch (error) {
      fail(error);
      return;
    }

    if (entries.some((entry) => entry.name === basename(absoluteDirectory))) {
      holdOwnName.add(absoluteDirectory);
    } else {
      holdOwnName.delete(absoluteDirectory);
    }

    for (const entry of entries) {
      const relativePath =
        relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;

      if (entry.isDirectory()) {
        subscribeTree(join(absoluteDirectory, entry.name), relativePath, emitExistingCarriers);
        continue;
      }

      if (entry.isSymbolicLink()) {
        const absolutePath = join(absoluteDirectory, entry.name);

        if (isSkippedLink(absolutePath, relativePath)) {
          skippedLinks.add(absolutePath);

          if (emitExistingCarriers) {
            eventListener?.({ type: "create", path: relativePath, skippedLink: true });
          }
        }

        continue;
      }

      if (
        emitExistingCarriers &&
        entry.isFile() &&
        isWatchedCarrierPath(input.root, relativePath, input.exclude, input.watchSources)
      ) {
        eventListener?.({ type: "create", path: relativePath });
      }
    }
  };

  subscribeTree(input.root, "", false);

  return {
    on(next) {
      eventListener = next;
    },
    onError(next) {
      errorListener = next;

      if (pendingError !== undefined) {
        const error = pendingError;
        pendingError = undefined;
        next(error);
      }
    },
    close() {
      if (closed) {
        return;
      }

      closed = true;
      pendingError = undefined;

      for (const handle of watchers.values()) {
        handle.close();
      }

      watchers.clear();
      identities.clear();
      holdOwnName.clear();
    },
  };
}

function createNamedFileWatchSource(
  files: readonly string[],
  createNativeWatch: NativeWatchFactory,
): ValidateWatchEventSource {
  const watchers = new Map<string, NativeWatchHandle>();
  const targets = new Map<string, string>();
  let listener: ((event: ValidateWatchEvent) => void) | undefined;
  let onError: ((error: unknown) => void) | undefined;
  let pendingError: unknown;
  let closed = false;
  const fail = (error: unknown) => {
    if (onError) onError(error);
    else pendingError = error;
  };
  const reconcile = () => {
    const directories = new Set<string>();
    const requiredDirectories = new Set<string>();
    const permissionDenied = (error: unknown) =>
      error instanceof Error &&
      "code" in error &&
      (error.code === "EACCES" || error.code === "EPERM");
    for (const file of files) {
      try {
        targets.set(file, realpathSync.native(file));
      } catch (error) {
        if (!isNotFoundError(error)) fail(error);
      }
    }
    // Keep a symlink's last target while it is missing, so recreating it is still visible.
    for (const file of new Set([...files, ...targets.values()])) {
      let directory = dirname(file);
      let foundParent = false;
      for (;;) {
        try {
          if (lstatSync(directory).isDirectory()) {
            directories.add(directory);
            if (!foundParent) requiredDirectories.add(directory);
            foundParent = true;
          }
        } catch (error) {
          if (!isNotFoundError(error) && !(foundParent && permissionDenied(error))) fail(error);
        }
        const parent = dirname(directory);
        if (parent === directory) break;
        directory = parent;
      }
    }
    for (const [directory, handle] of watchers) {
      if (!directories.has(directory)) {
        handle.close();
        watchers.delete(directory);
      }
    }
    for (const directory of directories) {
      if (closed || watchers.has(directory)) continue;
      try {
        const handle = createNativeWatch(directory, (_type, filename) => {
          if (closed) return;
          const path = filename ? resolve(directory, filename) : directory;
          const affected = files.filter((file) =>
            [file, targets.get(file)].some(
              (target) =>
                target !== undefined && (path === target || isDescendantPath(path, target)),
            ),
          );
          if (affected.length === 0) return;
          // Reopen directory handles after renames, including saves that replace a parent.
          for (const current of watchers.values()) current.close();
          watchers.clear();
          reconcile();
          for (const file of affected) listener?.({ type: "change", path: file });
        });
        handle.on("error", (error) => {
          if (requiredDirectories.has(directory) || !permissionDenied(error)) fail(error);
          else {
            handle.close();
            watchers.delete(directory);
          }
        });
        watchers.set(directory, handle);
      } catch (error) {
        // A readable immediate parent covers file edits even when an ancestor cannot be watched.
        if (requiredDirectories.has(directory) || !permissionDenied(error)) fail(error);
      }
    }
  };
  reconcile();
  return {
    on(next) {
      listener = next;
    },
    onError(next) {
      onError = next;
      if (pendingError !== undefined) next(pendingError);
    },
    close() {
      closed = true;
      for (const handle of watchers.values()) handle.close();
      watchers.clear();
    },
  };
}

/**
 * @sdpAnchor impl:protocol.validate-watch
 * @sdpLabel watches carrier directories and coalesces events into a pending validation rerun
 * @sdpSatisfies spec:consumers.validate-watch, spec:validation.corpus-rules
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */
export async function runValidateWatch(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: ValidationViewHooks,
  watchHooks: ValidateWatchHooks,
): Promise<number> {
  const files = [
    ...new Set(
      (parsed.rules ?? [])
        .flatMap((file) => [file.rulesFile, ...parameterFiles(file.paramForms ?? [])])
        .map((file) => resolve(file)),
    ),
  ];
  const source =
    watchHooks.createWatchSource?.({ root: parsed.root, exclude: parsed.exclude, files }) ??
    createFilesystemWatchSource({
      root: parsed.root,
      exclude: parsed.exclude,
      createNativeWatch: watchHooks.createNativeWatch,
      lstatWatchPath: watchHooks.lstatWatchPath,
      watchSources: watchHooks.watchSources,
    });
  const namedSource =
    watchHooks.createWatchSource === undefined
      ? createNamedFileWatchSource(files, watchHooks.createNativeWatch ?? defaultNativeWatch)
      : undefined;
  const waiter = createCycleWaiter();
  const state: WatchLoopState = {
    closed: false,
    running: false,
    pendingRerun: false,
    coalesceScheduled: false,
    cycleIndex: 0,
    failure: undefined,
  };

  const close = (): void => {
    if (state.closed) {
      return;
    }

    state.closed = true;
    watchHooks.onWatchStop?.();
    source.close();
    namedSource?.close();
    waiter.wake();
  };

  const onAbort = (): void => {
    close();
    if (watchHooks.abortSignal === undefined) {
      // An in-process rules body cannot be cancelled and may keep live handles indefinitely.
      process.exit(0);
    }
  };

  if (watchHooks.abortSignal === undefined) {
    process.once("SIGINT", onAbort);
  } else if (watchHooks.abortSignal.aborted) {
    close();
  } else {
    watchHooks.abortSignal.addEventListener("abort", onAbort, { once: true });
  }

  const noteCarrierEvent = (): void => {
    state.pendingRerun = true;

    if (state.running || state.closed || state.coalesceScheduled) {
      return;
    }

    state.coalesceScheduled = true;
    setImmediate(() => {
      state.coalesceScheduled = false;

      if (!state.closed) {
        waiter.wake();
      }
    }).unref();
  };

  const onEvent = (event: ValidateWatchEvent) => {
    if (
      state.closed ||
      (event.skippedLink !== true && watchHooks.ignoreWatchPath?.(resolve(parsed.root, event.path)))
    ) {
      return;
    }

    if (
      event.subtreeRemoved !== true &&
      event.unattributed !== true &&
      event.skippedLink !== true &&
      !files.includes(resolve(parsed.root, event.path)) &&
      !isWatchedCarrierPath(parsed.root, event.path, parsed.exclude, watchHooks.watchSources)
    ) {
      return;
    }

    noteCarrierEvent();
  };
  source.on(onEvent);
  namedSource?.on(onEvent);

  const onError = (error: unknown) => {
    if (state.closed) {
      return;
    }

    state.failure =
      error instanceof ValidateWatchSourceError ? error : new ValidateWatchSourceError(error);
    close();
  };
  source.onError(onError);
  namedSource?.onError(onError);

  try {
    while (!isWatchClosed(state)) {
      state.pendingRerun = false;
      state.running = true;
      state.cycleIndex += 1;
      await watchHooks.watchCycleGate?.(state.cycleIndex);

      if (!isWatchClosed(state)) {
        const outcome =
          watchHooks.runWatchCycle !== undefined
            ? await watchHooks.runWatchCycle()
            : parsed.rules === undefined
              ? runValidate(parsed, output, "validate", hooks)
              : await runValidateRules(
                  {
                    ...parsed,
                    rules: parsed.rules.map((file) => ({
                      ...file,
                      rereadParams: state.cycleIndex > 1,
                    })),
                  },
                  output,
                  hooks,
                );
        watchHooks.onWatchCycleComplete?.({
          index: state.cycleIndex,
          exitCode: outcome.exitCode,
        });
      }

      state.running = false;

      if (isWatchClosed(state) || hasPendingWatchRerun(state)) {
        continue;
      }

      await waiter.wait();
    }
  } finally {
    state.running = false;

    if (watchHooks.abortSignal === undefined) {
      process.removeListener("SIGINT", onAbort);
    } else {
      watchHooks.abortSignal.removeEventListener("abort", onAbort);
    }

    close();
  }

  if (state.failure !== undefined) {
    writeStderr(
      output,
      `sdp ${watchHooks.watchCommand ?? "validate"}: watch failed — ${state.failure.message}\n`,
    );
    return 1;
  }

  return 0;
}

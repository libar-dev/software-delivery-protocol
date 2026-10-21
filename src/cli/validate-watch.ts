import { lstatSync, readdirSync, realpathSync, watch } from "node:fs";
import type { Stats } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import { parameterFiles } from "./params.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";
import { runValidate, runValidateRules } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

const CARRIER_SUFFIXES = [".sdp.ts", ".sdp.md", ".sdp.gherkin"] as const;

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

export function isWatchedCarrierPath(
  root: string,
  eventPath: string,
  exclude: readonly string[],
): boolean {
  const relativePath = toPosixRelative(root, eventPath);

  if (relativePath === "" || relativePath === "." || relativePath.startsWith("../")) {
    return false;
  }

  // Discovery skips dot-directories, never dot-files: a basename like `..cache.sdp.ts` is a
  // lawful carrier, so only the directory segments carry the exclusion check.
  const segments = relativePath.split("/").filter((segment) => segment !== "");

  if (segments.slice(0, -1).some((segment) => isExcludedDiscoveryDirectory(segment))) {
    return false;
  }

  if (isExcludedPrefix(relativePath, exclude)) {
    return false;
  }

  return CARRIER_SUFFIXES.some((suffix) => relativePath.endsWith(suffix));
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

function createFilesystemWatchSource(input: {
  readonly root: string;
  readonly exclude: readonly string[];
  readonly createNativeWatch?: NativeWatchFactory;
  readonly lstatWatchPath?: (path: string) => Stats;
}): ValidateWatchEventSource {
  const createNativeWatch = input.createNativeWatch ?? defaultNativeWatch;
  const lstatWatchPath = input.lstatWatchPath ?? lstatSync;
  const watchers = new Map<string, NativeWatchHandle>();
  let eventListener: ((event: ValidateWatchEvent) => void) | undefined;
  let errorListener: ((error: unknown) => void) | undefined;
  let pendingError: unknown;
  let closed = false;

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
      handle?.close();
    }
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

      unwatchTree(absoluteDirectory);

      if (absoluteDirectory === input.root) {
        failUnwatchableRoot(error);
        return;
      }

      eventListener?.({ type: "delete", path: relativeDirectory, subtreeRemoved: true });
      return;
    }

    if (!stats.isDirectory()) {
      unwatchTree(absoluteDirectory);

      if (absoluteDirectory === input.root) {
        failUnwatchableRoot(undefined);
        return;
      }

      eventListener?.({ type: "delete", path: relativeDirectory, subtreeRemoved: true });
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

    let handle: NativeWatchHandle;

    try {
      handle = createNativeWatch(absoluteDirectory, (eventType, filename) => {
        if (closed) {
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

          const removedWatchedDirectory = watchers.has(absolutePath);
          unwatchTree(absolutePath);
          eventListener?.({
            type: "delete",
            path: relativePath,
            ...(removedWatchedDirectory ? { subtreeRemoved: true } : {}),
          });
          return;
        }

        if (stats.isDirectory()) {
          subscribeTree(absolutePath, relativePath, true);
        }

        eventListener?.({
          type: eventType === "rename" ? "rename" : "change",
          path: relativePath,
        });
      });
    } catch (error) {
      fail(error);
      return;
    }

    handle.on("error", (error) => {
      fail(error);
    });
    watchers.set(absoluteDirectory, handle);
  };

  const subscribeTree = (
    absoluteDirectory: string,
    relativeDirectory: string,
    emitExistingCarriers: boolean,
  ): void => {
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

    for (const entry of entries) {
      const relativePath =
        relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;

      if (entry.isDirectory()) {
        subscribeTree(join(absoluteDirectory, entry.name), relativePath, emitExistingCarriers);
        continue;
      }

      if (
        emitExistingCarriers &&
        entry.isFile() &&
        isWatchedCarrierPath(input.root, relativePath, input.exclude)
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
        targets.set(file, realpathSync(file));
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
    if (state.closed) {
      return;
    }

    if (
      event.subtreeRemoved !== true &&
      event.unattributed !== true &&
      !files.includes(resolve(parsed.root, event.path)) &&
      !isWatchedCarrierPath(parsed.root, event.path, parsed.exclude)
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
          parsed.rules === undefined
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
    writeStderr(output, `sdp validate: watch failed — ${state.failure.message}\n`);
    return 1;
  }

  return 0;
}

import { readdirSync, statSync, watch } from "node:fs";
import { isAbsolute, join, relative } from "node:path";

import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

const CARRIER_SUFFIXES = [".sdp.ts", ".sdp.md", ".sdp.gherkin"] as const;

export interface ValidateWatchEvent {
  readonly type: "create" | "change" | "delete" | "rename";
  readonly path: string;
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
  }) => ValidateWatchEventSource;
  readonly createNativeWatch?: NativeWatchFactory;
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

  const segments = relativePath.split("/").filter((segment) => segment !== "");

  if (segments.some((segment) => isExcludedDiscoveryDirectory(segment))) {
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

function createFilesystemWatchSource(input: {
  readonly root: string;
  readonly exclude: readonly string[];
  readonly createNativeWatch?: NativeWatchFactory;
}): ValidateWatchEventSource {
  const createNativeWatch = input.createNativeWatch ?? defaultNativeWatch;
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

  const subscribeDirectory = (absoluteDirectory: string, relativeDirectory: string): void => {
    if (closed || watchers.has(absoluteDirectory)) {
      return;
    }

    if (!isWatchableDirectoryPath(input.root, relativeDirectory, input.exclude)) {
      return;
    }

    let handle: NativeWatchHandle;

    try {
      handle = createNativeWatch(absoluteDirectory, (eventType, filename) => {
        if (closed || filename === null || filename === "") {
          return;
        }

        const entryName = filename.replaceAll("\\", "/");
        const relativePath =
          relativeDirectory === "" ? entryName : `${relativeDirectory}/${entryName}`;
        const absolutePath = join(absoluteDirectory, entryName);
        let directoryNow = false;

        try {
          directoryNow = statSync(absolutePath).isDirectory();
        } catch {
          unwatchTree(absolutePath);
        }

        if (directoryNow) {
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

export async function runValidateWatch(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: ValidationViewHooks,
  watchHooks: ValidateWatchHooks,
): Promise<number> {
  const source =
    watchHooks.createWatchSource?.({ root: parsed.root, exclude: parsed.exclude }) ??
    createFilesystemWatchSource({
      root: parsed.root,
      exclude: parsed.exclude,
      createNativeWatch: watchHooks.createNativeWatch,
    });
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
    waiter.wake();
  };

  const onAbort = (): void => {
    close();
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

  source.on((event) => {
    if (state.closed || !isWatchedCarrierPath(parsed.root, event.path, parsed.exclude)) {
      return;
    }

    noteCarrierEvent();
  });

  source.onError((error) => {
    if (state.closed) {
      return;
    }

    state.failure =
      error instanceof ValidateWatchSourceError ? error : new ValidateWatchSourceError(error);
    close();
  });

  try {
    while (!isWatchClosed(state)) {
      state.pendingRerun = false;
      state.running = true;
      state.cycleIndex += 1;
      await watchHooks.watchCycleGate?.(state.cycleIndex);

      if (!isWatchClosed(state)) {
        const outcome = runValidate(parsed, output, "validate", hooks);
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

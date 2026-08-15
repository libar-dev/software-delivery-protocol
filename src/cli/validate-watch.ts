import { watch } from "node:fs";
import { isAbsolute, relative } from "node:path";

import { isExcludedDiscoveryDirectory } from "../extract/discover.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

const CARRIER_SUFFIXES = [".sdp.ts", ".sdp.md", ".sdp.gherkin"] as const;

export interface ValidateWatchEvent {
  readonly type: "create" | "change" | "delete" | "rename";
  readonly path: string;
}

export interface ValidateWatchEventSource {
  readonly on: (listener: (event: ValidateWatchEvent) => void) => void;
  readonly close: () => void;
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
  cycleIndex: number;
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

  if (exclude.some((prefix) => relativePath === prefix || relativePath.startsWith(`${prefix}/`))) {
    return false;
  }

  return CARRIER_SUFFIXES.some((suffix) => relativePath.endsWith(suffix));
}

function createFilesystemWatchSource(input: {
  readonly root: string;
  readonly exclude: readonly string[];
}): ValidateWatchEventSource {
  void input.exclude;

  let listener: ((event: ValidateWatchEvent) => void) | undefined;
  const watcher = watch(input.root, { recursive: true }, (eventType, filename) => {
    if (filename === null || filename === "") {
      return;
    }

    listener?.({
      type: eventType === "rename" ? "rename" : "change",
      path: filename.replaceAll("\\", "/"),
    });
  });

  return {
    on(next) {
      listener = next;
    },
    close() {
      watcher.close();
    },
  };
}

export async function runValidateWatch(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: ValidationViewHooks,
  watchHooks: ValidateWatchHooks,
): Promise<number> {
  const createSource = watchHooks.createWatchSource ?? createFilesystemWatchSource;
  const source = createSource({ root: parsed.root, exclude: parsed.exclude });
  const waiter = createCycleWaiter();
  const state: WatchLoopState = {
    closed: false,
    running: false,
    pendingRerun: false,
    cycleIndex: 0,
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

  source.on((event) => {
    if (state.closed || !isWatchedCarrierPath(parsed.root, event.path, parsed.exclude)) {
      return;
    }

    state.pendingRerun = true;

    if (!state.running) {
      waiter.wake();
    }
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

  return 0;
}

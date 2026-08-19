import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import {
  isWatchedCarrierPath,
  type NativeWatchHandle,
  type ValidateWatchCycle,
} from "../src/cli/validate-watch.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const WATCH_TIMEOUT_MS = 2_000;

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolvePromise: ((value: T) => void) | undefined;
  const promise = new Promise<T>((resolveValue) => {
    resolvePromise = resolveValue;
  });

  return {
    promise,
    resolve(value) {
      resolvePromise?.(value);
    },
  };
}

async function bounded<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${String(WATCH_TIMEOUT_MS)}ms`));
    }, WATCH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

class CycleHarness {
  readonly abort = new AbortController();
  readonly completed: ValidateWatchCycle[] = [];
  private readonly waiting = new Map<number, Deferred<ValidateWatchCycle>>();

  cycle(index: number): Promise<ValidateWatchCycle> {
    const completed = this.completed.find((cycle) => cycle.index === index);

    if (completed !== undefined) {
      return Promise.resolve(completed);
    }

    const deferred = createDeferred<ValidateWatchCycle>();
    this.waiting.set(index, deferred);
    return deferred.promise;
  }

  readonly onComplete = (cycle: ValidateWatchCycle): void => {
    this.completed.push(cycle);
    this.waiting.get(cycle.index)?.resolve(cycle);
    this.waiting.delete(cycle.index);
  };
}

interface NativeSubscription {
  readonly listener: (eventType: string, filename: string | null) => void;
  errorListener?: (error: Error) => void;
  closeCount: number;
}

class NativeWatchHarness {
  readonly subscriptions = new Map<string, NativeSubscription>();

  readonly create = (
    directory: string,
    listener: (eventType: string, filename: string | null) => void,
  ): NativeWatchHandle => {
    const subscription: NativeSubscription = { listener, closeCount: 0 };
    this.subscriptions.set(directory, subscription);

    return {
      on(_event, errorListener) {
        subscription.errorListener = errorListener;
      },
      close() {
        subscription.closeCount += 1;
      },
    };
  };
}

function writeCarrier(path: string, id: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    [
      "---",
      `id: ${id}`,
      "kind: rule",
      "altitude: story",
      "readiness: idea",
      "relations: {}",
      "---",
      "# Watch probe",
      "",
      "## Intent",
      "",
      "- outcome: Keep watch artifacts current.",
      "",
      "## Rule",
      "",
    ].join("\n"),
    "utf8",
  );
}

function errno(code: string): NodeJS.ErrnoException {
  return Object.assign(new Error(`${code}: injected watch path failure`), { code });
}

describe("validate watch filesystem source", () => {
  it("never traverses or subscribes through a newly created directory symlink, including a loop", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-symlink-root-"));
    const outside = mkdtempSync(join(tmpdir(), "sdp-watch-symlink-outside-"));
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);

    try {
      writeCarrier(join(outside, "outside.sdp.md"), "spec:tmp.watch-outside");
      symlinkSync(root, join(outside, "back"), "dir");

      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: cycles.onComplete,
          abortSignal: cycles.abort.signal,
        }),
      );

      await bounded(firstCycle, "symlink first cycle");
      symlinkSync(outside, join(root, "linked"), "dir");

      native.subscriptions.get(root)?.listener("rename", "linked");
      cycles.abort.abort();

      expect(await bounded(running, "symlink watch exit")).toBe(0);
      expect([...native.subscriptions.keys()]).toEqual([root]);
      expect(cycles.completed).toHaveLength(1);
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it("removing a watched directory with carriers causes exactly one rerun and removes stale artifacts", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-directory-remove-"));
    const carrier = join(root, "specs", "removed.sdp.md");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    writeCarrier(carrier, "spec:tmp.removed-directory");

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: (cycle) => {
            cycles.onComplete(cycle);

            if (cycle.index === 2) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );

      expect(await bounded(firstCycle, "directory removal first cycle")).toEqual({
        index: 1,
        exitCode: 0,
      });
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
        "spec:tmp.removed-directory",
      );

      rmSync(join(root, "specs"), { recursive: true });
      native.subscriptions.get(root)?.listener("rename", "specs");

      expect(await bounded(secondCycle, "directory removal rerun")).toEqual({
        index: 2,
        exitCode: 0,
      });
      expect(await bounded(running, "directory removal watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2]);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).not.toContain(
        "spec:tmp.removed-directory",
      );
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("treats a basename beginning with '..cache' as contained while rejecting real parent escapes", () => {
    const root = resolve(tmpdir(), "sdp-watch-containment-root");

    expect(isWatchedCarrierPath(root, "..cache.sdp.ts", [])).toBe(true);
    expect(isWatchedCarrierPath(root, "../escape.sdp.ts", [])).toBe(false);
    expect(isWatchedCarrierPath(root, resolve(root, "..", "escape.sdp.ts"), [])).toBe(false);
  });

  it("treats ENOTDIR as deletion and schedules one carrier-tree rerun", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-enotdir-"));
    const specs = join(root, "specs");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.watch-enotdir");
    const watchHooks = {
      lstatWatchPath: (path: string) => {
        if (path === specs) {
          throw errno("ENOTDIR");
        }

        return lstatSync(path);
      },
    };

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          ...watchHooks,
          createNativeWatch: native.create,
          onWatchCycleComplete: (cycle) => {
            cycles.onComplete(cycle);

            if (cycle.index === 2) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );

      await bounded(firstCycle, "ENOTDIR first cycle");
      native.subscriptions.get(root)?.listener("rename", "specs");

      await bounded(secondCycle, "ENOTDIR deletion rerun");
      expect(await bounded(running, "ENOTDIR watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2]);
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(["EACCES", "EMFILE", "EIO"])(
    "routes %s through the typed failure path, closes once, and exits 1",
    async (code) => {
      const root = mkdtempSync(join(tmpdir(), `sdp-watch-${code.toLowerCase()}-`));
      const capture = createCaptureOutput();
      const cycles = new CycleHarness();
      const native = new NativeWatchHarness();
      const firstCycle = cycles.cycle(1);
      const target = join(root, "probe.sdp.ts");
      const watchHooks = {
        lstatWatchPath: (path: string) => {
          if (path === target) {
            throw errno(code);
          }

          return lstatSync(path);
        },
      };

      try {
        const running = Promise.resolve(
          runSdpCli(["validate", "--watch", root], capture.output, {
            ...watchHooks,
            createNativeWatch: native.create,
            onWatchCycleComplete: cycles.onComplete,
            abortSignal: cycles.abort.signal,
          }),
        );

        await bounded(firstCycle, `${code} first cycle`);
        native.subscriptions.get(root)?.listener("rename", "probe.sdp.ts");

        expect(await bounded(running, `${code} typed watch failure`)).toBe(1);
        expect(capture.readStderr()).toContain(`sdp validate: watch failed — ${code}`);
        expect(native.subscriptions.get(root)?.closeCount).toBe(1);
        expect(cycles.completed).toHaveLength(1);
        expect(existsSync(target)).toBe(false);
      } finally {
        cycles.abort.abort();
        rmSync(root, { recursive: true, force: true });
      }
    },
  );
});

import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
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

  it("reconciles a filename-less deletion event: unwatches the removed subtree and reruns once", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-null-filename-remove-"));
    const specs = join(root, "specs");
    const carrier = join(specs, "removed.sdp.md");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    writeCarrier(carrier, "spec:tmp.null-filename-removed");

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

      await bounded(firstCycle, "null-filename first cycle");
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
        "spec:tmp.null-filename-removed",
      );

      rmSync(specs, { recursive: true });
      native.subscriptions.get(specs)?.listener("rename", null);

      await bounded(secondCycle, "null-filename deletion rerun");
      expect(await bounded(running, "null-filename watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2]);
      expect(native.subscriptions.get(specs)?.closeCount).toBe(1);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).not.toContain(
        "spec:tmp.null-filename-removed",
      );
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("reconciles a filename-less change on an intact directory: rescans subtrees and reruns", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-null-filename-change-"));
    const late = join(root, "late");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    writeCarrier(join(root, "existing.sdp.md"), "spec:tmp.null-filename-existing");

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

      await bounded(firstCycle, "null-filename change first cycle");

      writeCarrier(join(late, "late.sdp.md"), "spec:tmp.null-filename-late");
      native.subscriptions.get(root)?.listener("rename", null);

      await bounded(secondCycle, "null-filename conservative rerun");
      expect(await bounded(running, "null-filename change watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2]);
      expect(native.subscriptions.has(late)).toBe(true);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
        "spec:tmp.null-filename-late",
      );
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("prunes a dead descendant watcher on reconciliation so a recreated directory rewatches", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-recreate-"));
    const specs = join(root, "specs");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    const thirdCycle = cycles.cycle(3);
    const fourthCycle = cycles.cycle(4);
    writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.recreate-first");

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: (cycle) => {
            cycles.onComplete(cycle);

            if (cycle.index === 4) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );

      await bounded(firstCycle, "recreate first cycle");
      const deadSubscription = native.subscriptions.get(specs);
      expect(deadSubscription).toBeDefined();

      // The subtree vanishes, but the only signal is a filename-less event on the ancestor.
      rmSync(specs, { recursive: true });
      native.subscriptions.get(root)?.listener("rename", null);
      await bounded(secondCycle, "recreate reconciliation rerun");
      expect(deadSubscription?.closeCount).toBe(1);

      // The recreated directory must get a fresh watcher, not be blocked by the stale entry.
      writeCarrier(join(specs, "again.sdp.md"), "spec:tmp.recreate-second");
      native.subscriptions.get(root)?.listener("rename", "specs");
      await bounded(thirdCycle, "recreate resubscription rerun");
      const freshSubscription = native.subscriptions.get(specs);
      expect(freshSubscription).toBeDefined();
      expect(freshSubscription).not.toBe(deadSubscription);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
        "spec:tmp.recreate-second",
      );

      // And the fresh watcher must be live: a carrier change under it schedules a rerun.
      writeCarrier(join(specs, "again.sdp.md"), "spec:tmp.recreate-third");
      freshSubscription?.listener("change", "again.sdp.md");
      await bounded(fourthCycle, "recreate live-watcher rerun");

      expect(await bounded(running, "recreate watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2, 3, 4]);
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("replaces a watcher whose directory was recreated before the filename-less reconciliation", async () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-inode-swap-"));
    const specs = join(root, "specs");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    const thirdCycle = cycles.cycle(3);
    writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.inode-first");

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: (cycle) => {
            cycles.onComplete(cycle);

            if (cycle.index === 3) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );

      await bounded(firstCycle, "inode-swap first cycle");
      const deadSubscription = native.subscriptions.get(specs);
      expect(deadSubscription).toBeDefined();

      // Delete and recreate before the reconciliation runs: the path exists again, but it is a
      // new inode the dead handle does not watch.
      rmSync(specs, { recursive: true });
      writeCarrier(join(specs, "swapped.sdp.md"), "spec:tmp.inode-second");
      native.subscriptions.get(root)?.listener("rename", null);

      await bounded(secondCycle, "inode-swap reconciliation rerun");
      expect(deadSubscription?.closeCount).toBe(1);
      const freshSubscription = native.subscriptions.get(specs);
      expect(freshSubscription).toBeDefined();
      expect(freshSubscription).not.toBe(deadSubscription);

      // The replacement watcher is live.
      writeCarrier(join(specs, "swapped.sdp.md"), "spec:tmp.inode-third");
      freshSubscription?.listener("change", "swapped.sdp.md");
      await bounded(thirdCycle, "inode-swap live-watcher rerun");

      expect(await bounded(running, "inode-swap watch exit")).toBe(0);
      expect(cycles.completed.map((cycle) => cycle.index)).toEqual([1, 2, 3]);
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each([
    ["before reconciliation", 1],
    ["between reconciliation and re-subscription", 2],
  ])("fails typed when the watch root vanishes %s", async (_label, throwAtRootLstat) => {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-root-gone-"));
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    writeCarrier(join(root, "probe.sdp.md"), "spec:tmp.root-gone");
    // Armed after the first cycle: the injected not-found must model the root vanishing at event
    // time, not an unwatchable startup tree.
    let armed = false;
    let rootLstats = 0;
    const watchHooks = {
      lstatWatchPath: (path: string) => {
        if (armed && path === root) {
          rootLstats += 1;

          if (rootLstats >= throwAtRootLstat) {
            throw errno("ENOENT");
          }
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

      await bounded(firstCycle, "root-gone first cycle");
      armed = true;
      const rootSubscription = native.subscriptions.get(root);
      rootSubscription?.listener("rename", null);

      expect(await bounded(running, "root-gone typed watch failure")).toBe(1);
      expect(capture.readStderr()).toContain("sdp validate: watch failed — the watch root");
      expect(rootSubscription?.closeCount).toBe(1);
      expect(cycles.completed).toHaveLength(1);
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
    // Armed after the first cycle: subscription itself lstats the directory, and the injected
    // failure must model an event-time deletion, not an unwatchable tree.
    let armed = false;
    const watchHooks = {
      lstatWatchPath: (path: string) => {
        if (armed && path === specs) {
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
      armed = true;
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

function linkWarning(path: string): string {
  return `symbolic link "${path}" is skipped; discovery never follows links below the root`;
}

function nextTicks(): Promise<void> {
  // The watch coalesces an event on setImmediate and starts the cycle in the microtasks after it.
  return new Promise((resolveTicks) => {
    setImmediate(() => {
      setImmediate(() => {
        resolveTicks();
      });
    });
  });
}

async function deliver(
  subscription: NativeSubscription | undefined,
  eventType: string,
  filename: string,
): Promise<void> {
  subscription?.listener(eventType, filename);
  // The watch's coalescing immediate is unreferenced; a referenced one beside it keeps the event
  // loop from idling in its poll phase until the next timer before the cycle starts.
  await nextTicks();
}

describe("validate watch symbolic links", () => {
  // spec:consumers.validate-watch: a link discovery warns about schedules a run in every watch verb.
  it.each(["validate", "studio", "vault"])(
    "%s --watch reruns when a directory link discovery warns about appears or disappears",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), `sdp-watch-link-${command}-`));
      const root = join(workspace, "root");
      const outside = join(workspace, "outside");
      const specs = join(root, "specs");
      const capture = createCaptureOutput();
      const cycles = new CycleHarness();
      const native = new NativeWatchHarness();
      const stderrAtCycle: string[] = [];
      const firstCycle = cycles.cycle(1);
      const secondCycle = cycles.cycle(2);
      const thirdCycle = cycles.cycle(3);
      const fourthCycle = cycles.cycle(4);
      writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.watch-link-probe");
      writeCarrier(join(outside, "shared.sdp.md"), "spec:tmp.watch-link-outside");
      symlinkSync(outside, join(specs, "before"), "dir");

      try {
        const running = Promise.resolve(
          runSdpCli([command, root, "--watch"], capture.output, {
            createNativeWatch: native.create,
            onWatchCycleComplete: (completed) => {
              stderrAtCycle.push(capture.readStderr());
              cycles.onComplete(completed);

              if (completed.index === 4) {
                cycles.abort.abort();
              }
            },
            abortSignal: cycles.abort.signal,
          }),
        );
        const cycleStderr = (index: number): string =>
          (stderrAtCycle[index - 1] ?? "").slice((stderrAtCycle[index - 2] ?? "").length);

        await bounded(firstCycle, `${command} link first cycle`);
        expect(cycleStderr(1)).toContain(linkWarning("specs/before"));
        expect(cycleStderr(1)).not.toContain(linkWarning("specs/shared"));

        // A new directory link names no carrier, yet the warning list changes.
        symlinkSync(outside, join(specs, "shared"), "dir");
        await deliver(native.subscriptions.get(specs), "rename", "shared");
        await bounded(secondCycle, `${command} link creation rerun`);
        expect(cycleStderr(2)).toContain(linkWarning("specs/shared"));

        // Removing a link the watch found at start clears its warning.
        unlinkSync(join(specs, "before"));
        await deliver(native.subscriptions.get(specs), "rename", "before");
        await bounded(thirdCycle, `${command} start link removal`);
        expect(cycleStderr(3)).not.toContain(linkWarning("specs/before"));
        expect(cycleStderr(3)).toContain(linkWarning("specs/shared"));

        // Removing a link the watch saw created clears its warning too.
        unlinkSync(join(specs, "shared"));
        await deliver(native.subscriptions.get(specs), "rename", "shared");
        await bounded(fourthCycle, `${command} link removal rerun`);
        expect(cycleStderr(4)).not.toContain("symbolic-link-skipped");

        expect(await bounded(running, `${command} link watch exit`)).toBe(0);
        expect(cycles.completed.map((completed) => completed.index)).toEqual([1, 2, 3, 4]);
        expect([...native.subscriptions.keys()].some((path) => path.startsWith(outside))).toBe(
          false,
        );
        expect(capture.readStderr()).not.toContain("watch failed");
      } finally {
        cycles.abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it("reruns when a directory arrives holding only a link discovery warns about", async () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-link-arrival-"));
    const root = join(workspace, "root");
    const outside = join(workspace, "outside");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    writeCarrier(join(root, "probe.sdp.md"), "spec:tmp.watch-link-arrival");
    mkdirSync(outside);

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: (completed) => {
            cycles.onComplete(completed);

            if (completed.index === 2) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );

      await bounded(firstCycle, "link arrival first cycle");
      mkdirSync(join(root, "arrived"));
      symlinkSync(outside, join(root, "arrived", "shared"), "dir");
      await deliver(native.subscriptions.get(root), "rename", "arrived");

      await bounded(secondCycle, "link arrival rerun");
      expect(await bounded(running, "link arrival watch exit")).toBe(0);
      expect(capture.readStderr()).toContain(linkWarning("arrived/shared"));
    } finally {
      cycles.abort.abort();
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it.each(["link", "file"])(
    "drops a watched directory replaced by a %s, and ignores its retired watcher",
    async (replacement) => {
      const workspace = mkdtempSync(join(tmpdir(), `sdp-watch-replaced-by-${replacement}-`));
      const root = join(workspace, "root");
      const outside = join(workspace, "outside");
      const specs = join(root, "specs");
      const capture = createCaptureOutput();
      const cycles = new CycleHarness();
      const native = new NativeWatchHarness();
      const started: number[] = [];
      const firstCycle = cycles.cycle(1);
      const secondCycle = cycles.cycle(2);
      writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.watch-replaced-directory");
      mkdirSync(outside);

      try {
        const running = Promise.resolve(
          runSdpCli(["validate", "--watch", root], capture.output, {
            createNativeWatch: native.create,
            watchCycleGate: (index) => {
              started.push(index);
              return undefined;
            },
            onWatchCycleComplete: cycles.onComplete,
            abortSignal: cycles.abort.signal,
          }),
        );

        await bounded(firstCycle, "replaced directory first cycle");
        const retired = native.subscriptions.get(specs);
        expect(retired).toBeDefined();

        // Move the watched directory out and put a link to it, or a plain file, in its place.
        renameSync(specs, join(outside, "moved"));
        if (replacement === "link") {
          symlinkSync(join(outside, "moved"), specs, "dir");
        } else {
          writeFileSync(specs, "no longer a directory\n", "utf8");
        }
        await deliver(native.subscriptions.get(root), "rename", "specs");

        await bounded(secondCycle, "replaced directory rerun");
        expect(retired?.closeCount).toBe(1);
        expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).not.toContain(
          "spec:tmp.watch-replaced-directory",
        );
        expect(capture.readStderr().includes(linkWarning("specs"))).toBe(replacement === "link");

        // A queued event from the retired watcher must neither subscribe through the link nor rerun.
        mkdirSync(join(outside, "moved", "child"));
        await deliver(retired, "rename", "child");

        expect(native.subscriptions.has(join(specs, "child"))).toBe(false);
        expect(started).toEqual([1, 2]);
        cycles.abort.abort();
        expect(await bounded(running, "replaced directory watch exit")).toBe(0);
        expect(capture.readStderr()).not.toContain("watch failed");
      } finally {
        cycles.abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it("drops the subtree when a watched ancestor was replaced by a link before its own event", async () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-replaced-ancestor-"));
    const root = join(workspace, "root");
    const outside = join(workspace, "outside");
    const specs = join(root, "specs");
    const nested = join(specs, "nested");
    const capture = createCaptureOutput();
    const cycles = new CycleHarness();
    const native = new NativeWatchHarness();
    const stderrAtCycle: string[] = [];
    const firstCycle = cycles.cycle(1);
    const secondCycle = cycles.cycle(2);
    const thirdCycle = cycles.cycle(3);
    writeCarrier(join(nested, "probe.sdp.md"), "spec:tmp.watch-replaced-ancestor");
    mkdirSync(outside);

    try {
      const running = Promise.resolve(
        runSdpCli(["validate", "--watch", root], capture.output, {
          createNativeWatch: native.create,
          onWatchCycleComplete: (completed) => {
            stderrAtCycle.push(capture.readStderr());
            cycles.onComplete(completed);

            if (completed.index === 3) {
              cycles.abort.abort();
            }
          },
          abortSignal: cycles.abort.signal,
        }),
      );
      const cycleStderr = (index: number): string =>
        (stderrAtCycle[index - 1] ?? "").slice((stderrAtCycle[index - 2] ?? "").length);

      await bounded(firstCycle, "replaced ancestor first cycle");
      const specsSubscription = native.subscriptions.get(specs);
      const nestedSubscription = native.subscriptions.get(nested);
      expect(nestedSubscription).toBeDefined();

      // The ancestor is replaced, but the first event to arrive comes from the nested watcher,
      // whose entries now resolve through the link to a directory outside the root.
      renameSync(specs, join(outside, "moved"));
      symlinkSync(join(outside, "moved"), specs, "dir");
      mkdirSync(join(outside, "moved", "nested", "child"));
      await deliver(nestedSubscription, "rename", "child");

      await bounded(secondCycle, "replaced ancestor rerun");
      expect(native.subscriptions.has(join(nested, "child"))).toBe(false);
      expect(specsSubscription?.closeCount).toBe(1);
      expect(nestedSubscription?.closeCount).toBe(1);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).not.toContain(
        "spec:tmp.watch-replaced-ancestor",
      );
      expect(cycleStderr(2)).toContain(linkWarning("specs"));

      // The replacement link goes before the root's own event arrives. The watch must still know
      // the link it saw, or nothing would clear its warning.
      unlinkSync(specs);
      await deliver(native.subscriptions.get(root), "rename", "specs");

      await bounded(thirdCycle, "replacement link removal rerun");
      expect(await bounded(running, "replaced ancestor watch exit")).toBe(0);
      expect(cycleStderr(3)).not.toContain("symbolic-link-skipped");
      expect(capture.readStderr()).not.toContain("watch failed");
    } finally {
      cycles.abort.abort();
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  // The vault's owned-output filter resolves a path through a link; a link outside the build's
  // paths that points into them is still a link discovery warns about.
  it.each([
    ["shared.ts", "graph.json"],
    ["shared.sdp.md", "registrars.json"],
  ])(
    "vault --watch reruns when the link %s pointing at the build output %s appears or disappears",
    async (link, target) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-link-into-output-"));
      const root = join(workspace, "root");
      const specs = join(root, "specs");
      const capture = createCaptureOutput();
      const cycles = new CycleHarness();
      const native = new NativeWatchHarness();
      const stderrAtCycle: string[] = [];
      const started: number[] = [];
      const firstCycle = cycles.cycle(1);
      const secondCycle = cycles.cycle(2);
      const thirdCycle = cycles.cycle(3);
      writeCarrier(join(specs, "probe.sdp.md"), "spec:tmp.watch-link-into-output");

      try {
        const running = Promise.resolve(
          runSdpCli(["vault", root, "--watch"], capture.output, {
            createNativeWatch: native.create,
            watchCycleGate: (index) => {
              started.push(index);
              return undefined;
            },
            onWatchCycleComplete: (completed) => {
              stderrAtCycle.push(capture.readStderr());
              cycles.onComplete(completed);
            },
            abortSignal: cycles.abort.signal,
          }),
        );
        const cycleStderr = (index: number): string =>
          (stderrAtCycle[index - 1] ?? "").slice((stderrAtCycle[index - 2] ?? "").length);

        await bounded(firstCycle, "link into output first cycle");
        expect(existsSync(join(root, "generated", target))).toBe(true);

        symlinkSync(join(root, "generated", target), join(specs, link));
        await deliver(native.subscriptions.get(specs), "rename", link);
        await bounded(secondCycle, "link into output creation rerun");
        expect(cycleStderr(2)).toContain(linkWarning(`specs/${link}`));

        unlinkSync(join(specs, link));
        await deliver(native.subscriptions.get(specs), "rename", link);
        await bounded(thirdCycle, "link into output removal rerun");
        expect(cycleStderr(3)).not.toContain("symbolic-link-skipped");

        await nextTicks();
        expect(started).toEqual([1, 2, 3]);
        cycles.abort.abort();
        expect(await bounded(running, "link into output watch exit")).toBe(0);
        expect(capture.readStderr()).not.toContain("watch failed");
      } finally {
        cycles.abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );
});

interface WatchRun {
  readonly capture: ReturnType<typeof createCaptureOutput>;
  readonly cycles: CycleHarness;
  readonly native: NativeWatchHarness;
  readonly started: number[];
  readonly running: Promise<number>;
  readonly cycleStderr: (index: number) => string;
}

function watchRoot(
  root: string,
  lstatWatchPath?: (path: string) => ReturnType<typeof lstatSync>,
): WatchRun {
  const capture = createCaptureOutput();
  const cycles = new CycleHarness();
  const native = new NativeWatchHarness();
  const started: number[] = [];
  const stderrAtCycle: string[] = [];
  const running = Promise.resolve(
    runSdpCli(["validate", "--watch", root], capture.output, {
      createNativeWatch: native.create,
      ...(lstatWatchPath === undefined ? {} : { lstatWatchPath }),
      watchCycleGate: (index) => {
        started.push(index);
        return undefined;
      },
      onWatchCycleComplete: (completed) => {
        stderrAtCycle.push(capture.readStderr());
        cycles.onComplete(completed);
      },
      abortSignal: cycles.abort.signal,
    }),
  );

  return {
    capture,
    cycles,
    native,
    started,
    running,
    cycleStderr: (index) =>
      (stderrAtCycle[index - 1] ?? "").slice((stderrAtCycle[index - 2] ?? "").length),
  };
}

function graphText(root: string): string {
  return readFileSync(join(root, "generated", "graph.json"), "utf8");
}

// spec:consumers.validate-watch: a directory that replaces a watched one is watched in its place.
describe("validate watch directory replacement", () => {
  // A watcher such as inotify follows the inode it was opened on, so after `mv specs/sub away &&
  // mkdir specs/sub` the old handle reports the moved directory under the old path.
  it.each(["rename", "change"])(
    "retires the handle of a directory replaced by another directory on a %s event",
    async (eventType) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-other-directory-"));
      const root = join(workspace, "root");
      const specs = join(root, "specs");
      const sub = join(specs, "sub");
      const moved = join(workspace, "moved");
      writeCarrier(join(sub, "before.sdp.md"), "spec:tmp.watch-before-replacement");
      const watch = watchRoot(root);

      try {
        await bounded(watch.cycles.cycle(1), "other directory first cycle");
        const retired = watch.native.subscriptions.get(sub);
        expect(retired).toBeDefined();

        renameSync(sub, moved);
        mkdirSync(sub);
        await deliver(watch.native.subscriptions.get(specs), eventType, "sub");

        await bounded(watch.cycles.cycle(2), "other directory rerun");
        expect(retired?.closeCount).toBe(1);
        const fresh = watch.native.subscriptions.get(sub);
        expect(fresh).toBeDefined();
        expect(fresh).not.toBe(retired);
        expect(graphText(root)).not.toContain("spec:tmp.watch-before-replacement");

        // The retired handle's own events, and edits in the moved directory, start no run.
        await deliver(retired, "rename", "sub");
        writeCarrier(join(moved, "before.sdp.md"), "spec:tmp.watch-moved-edit");
        await deliver(retired, "change", "before.sdp.md");
        expect(watch.started).toEqual([1, 2]);

        // The new directory is watched: a carrier created in it joins the graph.
        writeCarrier(join(sub, "after.sdp.md"), "spec:tmp.watch-after-replacement");
        await deliver(fresh, "rename", "after.sdp.md");
        await bounded(watch.cycles.cycle(3), "new directory carrier rerun");
        expect(graphText(root)).toContain("spec:tmp.watch-after-replacement");

        watch.cycles.abort.abort();
        expect(await bounded(watch.running, "other directory watch exit")).toBe(0);
        expect(watch.started).toEqual([1, 2, 3]);
        expect(watch.capture.readStderr()).not.toContain("watch failed");
      } finally {
        watch.cycles.abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );

  it("retires the handle of a directory deleted and recreated with its inode reused", async () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-inode-reuse-"));
    const root = join(workspace, "root");
    const specs = join(root, "specs");
    const sub = join(specs, "sub");
    writeCarrier(join(sub, "before.sdp.md"), "spec:tmp.watch-before-recreation");
    const opened = lstatSync(sub);
    let reuse = false;
    // The recreated directory reports the deleted one's identity, as a reused inode would.
    const watch = watchRoot(root, (path) => (reuse && path === sub ? opened : lstatSync(path)));

    try {
      await bounded(watch.cycles.cycle(1), "inode reuse first cycle");
      const dead = watch.native.subscriptions.get(sub);
      expect(dead).toBeDefined();

      rmSync(sub, { recursive: true });
      writeCarrier(join(sub, "after.sdp.md"), "spec:tmp.watch-after-recreation");
      reuse = true;
      await deliver(watch.native.subscriptions.get(specs), "rename", "sub");

      await bounded(watch.cycles.cycle(2), "inode reuse rerun");
      expect(dead?.closeCount).toBe(1);
      expect(watch.native.subscriptions.get(sub)).not.toBe(dead);
      expect(graphText(root)).toContain("spec:tmp.watch-after-recreation");
      expect(graphText(root)).not.toContain("spec:tmp.watch-before-recreation");

      watch.cycles.abort.abort();
      expect(await bounded(watch.running, "inode reuse watch exit")).toBe(0);
    } finally {
      watch.cycles.abort.abort();
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("retires a directory replaced by another directory when a retired descendant reports first", async () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-other-ancestor-"));
    const root = join(workspace, "root");
    const sub = join(root, "specs", "sub");
    const nested = join(sub, "nested");
    const moved = join(workspace, "moved");
    writeCarrier(join(nested, "probe.sdp.md"), "spec:tmp.watch-nested-before");
    const watch = watchRoot(root);

    try {
      await bounded(watch.cycles.cycle(1), "other ancestor first cycle");
      const retiredSub = watch.native.subscriptions.get(sub);
      const retiredNested = watch.native.subscriptions.get(nested);
      expect(retiredNested).toBeDefined();

      // The first event comes from the moved tree's nested handle, before the parent's event.
      renameSync(sub, moved);
      writeCarrier(join(sub, "after.sdp.md"), "spec:tmp.watch-nested-after");
      mkdirSync(join(moved, "nested", "child"));
      await deliver(retiredNested, "rename", "child");

      await bounded(watch.cycles.cycle(2), "other ancestor rerun");
      expect(retiredSub?.closeCount).toBe(1);
      expect(retiredNested?.closeCount).toBe(1);
      expect(watch.native.subscriptions.get(sub)).not.toBe(retiredSub);
      expect(watch.native.subscriptions.has(join(nested, "child"))).toBe(false);
      expect(graphText(root)).toContain("spec:tmp.watch-nested-after");
      expect(graphText(root)).not.toContain("spec:tmp.watch-nested-before");

      watch.cycles.abort.abort();
      expect(await bounded(watch.running, "other ancestor watch exit")).toBe(0);
      expect(watch.capture.readStderr()).not.toContain("watch failed");
    } finally {
      watch.cycles.abort.abort();
      rmSync(workspace, { recursive: true, force: true });
    }
  });
});

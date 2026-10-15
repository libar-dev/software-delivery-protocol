import { expect, test, vi } from "vitest";

import { bindExample } from "../src/adapters/vitest.js";
import type { ExampleContract } from "../src/runner/index.js";

const registered = vi.hoisted(() => ({ run: undefined as (() => Promise<void>) | undefined }));

// Capture the adapter's registered body so expected failures do not fail the enclosing suite.
vi.mock("vitest", async (importOriginal) => ({
  ...(await importOriginal<typeof import("vitest")>()),
  describe: (_title: string, body: () => void) => {
    body();
  },
  it: (_title: string, body: () => Promise<void>) => {
    registered.run = body;
  },
}));

/**
 * The Vitest adapter cleans up each world it creates, whether the steps pass or fail.
 *
 * @sdpAnchor test:protocol.example-runner-cleanup
 * @sdpLabel the Vitest adapter cleans up a world whether its steps pass or fail
 * @sdpVerifies spec:extraction.example-runner
 */

const contract: ExampleContract<"a step", Record<"a step", Record<string, never>>> = {
  spec: "spec:probe.cleanup",
  title: "A world is cleaned up",
  steps: [{ kind: "when", text: "a step", params: {} }],
};

async function runRegistered(): Promise<void> {
  expect(registered.run).toBeDefined();
  await registered.run?.();
}

test.each([false, true])(
  "awaits cleanup after a failing step, cleanup also fails: %s",
  async (cleanupFails) => {
    const world = { cleaned: false };
    const stepError = new Error("step failed");
    bindExample(
      contract,
      () => world,
      {
        "a step": () => {
          throw stepError;
        },
      },
      async (created) => {
        await Promise.resolve();
        expect(created).toBe(world);
        created.cleaned = true;
        if (cleanupFails) throw new Error("cleanup failed");
      },
    );
    await expect(runRegistered()).rejects.toBe(stepError);
    expect(stepError.message).toBe("at step: When a step\nstep failed");
    expect(world.cleaned).toBe(true);
  },
);

test("fails with cleanup's error when the steps pass", async () => {
  const cleanupError = new Error("cleanup failed");
  bindExample(
    contract,
    () => ({}),
    { "a step": () => undefined },
    () => {
      throw cleanupError;
    },
  );
  await expect(runRegistered()).rejects.toBe(cleanupError);
});

test("awaits cleanup after passing steps", async () => {
  const trace: string[] = [];
  bindExample(
    contract,
    () => trace,
    {
      "a step": (world) => {
        world.push("step");
      },
    },
    async (world) => {
      await Promise.resolve();
      world.push("cleanup");
    },
  );
  await runRegistered();
  expect(trace).toEqual(["step", "cleanup"]);
});

test("preserves a factory failure without invoking cleanup", async () => {
  const factoryError = new Error("factory failed");
  const cleanup = vi.fn();
  bindExample(
    contract,
    () => {
      throw factoryError;
    },
    { "a step": () => undefined },
    cleanup,
  );
  await expect(runRegistered()).rejects.toBe(factoryError);
  expect(cleanup).not.toHaveBeenCalled();
});

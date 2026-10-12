import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import type { SdpImportOutcome } from "../generated/contracts/carrier.sdp-import.space.js";
import { importTypeScriptSpec } from "../src/index.js";
import type { ImportResult } from "../src/import/import.js";
import { registerRoundTrip } from "./carrier.sdp-import.round-trip.test.generated.js";
import { assertAuthoredRoundTrip, assertGraphRoundTrip } from "./import-round-trip.helpers.js";

interface ImportRoundTripWorld {
  readonly source: string;
  readonly relativePath: string;
  result: ImportResult | undefined;
}

function importResult(world: ImportRoundTripWorld): ImportResult {
  if (world.result === undefined) {
    throw new Error("The import step must run before the round-trip outcome is asserted.");
  }

  return world.result;
}

function emittedOf(result: ImportResult): NonNullable<ImportResult["emitted"]> {
  if (result.emitted === undefined) {
    throw new Error("The import must return emitted Markdown before the round trip is asserted.");
  }

  return result.emitted;
}

/** Extracts the source and the returned Markdown in two roots and compares the graphs. */
function assertReturnedGraphRoundTrip(
  world: ImportRoundTripWorld,
  emitted: NonNullable<ImportResult["emitted"]>,
): void {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-import-"));
  try {
    const tsRoot = join(root, "typescript");
    const mdRoot = join(root, "markdown");
    mkdirSync(tsRoot);
    mkdirSync(mdRoot);
    writeFileSync(join(tsRoot, world.relativePath), world.source, "utf8");
    writeFileSync(join(mdRoot, emitted.path), emitted.content, "utf8");
    assertGraphRoundTrip(tsRoot, mdRoot);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const sdpImportRoundTripTestAnchor = specTest({
  id: testAnchorId("test:protocol.sdp-import.round-trip"),
  label: "TypeScript import round-trip contract preserves authored data",
  verifies: ref("spec:carrier.sdp-import.round-trip"),
});
void sdpImportRoundTripTestAnchor;

registerRoundTrip({
  createWorld: (): ImportRoundTripWorld => ({
    source: readFileSync(
      fileURLToPath(new URL("./fixtures/import/round-trip/behavior.sdp.ts.txt", import.meta.url)),
      "utf8",
    ),
    relativePath: "behavior.sdp.ts",
    result: undefined,
  }),
  invoke: (world) => {
    world.result = importTypeScriptSpec(world.source, world.relativePath);
  },
  observe: (world): SdpImportOutcome => {
    importResult(world);
    return { kind: "the emitted Markdown re-parses to an equal graph" };
  },
  expected: (): SdpImportOutcome => ({
    kind: "the emitted Markdown re-parses to an equal graph",
  }),
  assertions: (world) => {
    const result = importResult(world);
    expect(result.findings).toEqual([]);
    const emitted = emittedOf(result);
    assertAuthoredRoundTrip(world.source, world.relativePath, emitted);
    assertReturnedGraphRoundTrip(world, emitted);

    // A corrupted return must fail the same check, so the point reads what import returned.
    const corrupted = {
      ...emitted,
      content: emitted.content.replace(
        "An order is accepted only when its total is positive.",
        "An order is accepted even when its total is negative.",
      ),
    };
    expect(corrupted.content).not.toBe(emitted.content);
    expect(() => {
      assertAuthoredRoundTrip(world.source, world.relativePath, corrupted);
    }).toThrow();
  },
});

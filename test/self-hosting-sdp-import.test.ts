import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import type { SdpImportOutcome } from "../generated/contracts/carrier.sdp-import.space.js";
import { importTypeScriptSpec } from "../src/index.js";
import type { ImportResult } from "../src/import/import.js";
import { registerRoundTrip } from "./carrier.sdp-import.round-trip.test.generated.js";
import { assertAuthoredRoundTrip } from "./import-round-trip.helpers.js";

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
    expect(result.emitted).toBeDefined();
    assertAuthoredRoundTrip(world.source, world.relativePath);
  },
});

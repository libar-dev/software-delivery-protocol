import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { roundTripContract } from "../generated/contracts/carrier.sdp-import.round-trip.contract.js";
import { importTypeScriptSpec } from "../src/index.js";
import type { ImportResult } from "../src/import/import.js";
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

describe("TypeScript import round-trip contract", () => {
  bindExample(
    roundTripContract,
    (): ImportRoundTripWorld => ({
      source: readFileSync(
        fileURLToPath(new URL("./fixtures/import/round-trip/behavior.sdp.ts.txt", import.meta.url)),
        "utf8",
      ),
      relativePath: "behavior.sdp.ts",
      result: undefined,
    }),
    {
      "a TS-carrier spec": (world) => {
        expect(world.relativePath).toBe("behavior.sdp.ts");
      },
      "importTypeScriptSpec runs": (world) => {
        world.result = importTypeScriptSpec(world.source, world.relativePath);
      },
      "the emitted Markdown re-parses to an equal graph": (world) => {
        const result = importResult(world);
        expect(result.findings).toEqual([]);
        expect(result.emitted).toBeDefined();
        assertAuthoredRoundTrip(world.source, world.relativePath);
      },
    },
  );
});

import { readFileSync } from "node:fs";

import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { boundedParityContract } from "../generated/contracts/carrier.markdown-parser.bounded-parity.contract.js";
import { reifyMarkdownCarrier, reifyTypeScriptCarrier } from "../src/index.js";
import type { CarrierReification } from "../src/index.js";

/**
 * The bound executable point of the ruled Markdown parser: one same-class row of the bounded
 * parity matrix, read from the paired probe carriers the matrix already owns. The claim under test
 * is exactly the authored one — a shared validator ID, with severity and extract-versus-refuse
 * outcomes left carrier-specific — so the point asserts the agreement and the divergence together.
 *
 * `test/extract-parity.test.ts` stays as regression evidence over the whole matrix, including the
 * four named non-claims; this point states the law, never every row.
 */
const fixtureRoot = new URL("./fixtures/import/parity/", import.meta.url);

interface ParityWorld {
  probe: string;
  findingId: string;
  typeScript: CarrierReification | undefined;
  markdown: CarrierReification | undefined;
}

function parityWorld(): ParityWorld {
  return { probe: "", findingId: "", typeScript: undefined, markdown: undefined };
}

function reifiedOf(world: ParityWorld, carrier: "typeScript" | "markdown"): CarrierReification {
  const reification = world[carrier];

  if (reification === undefined) {
    throw new Error("The reification step must run before the carrier outcomes are asserted.");
  }

  return reification;
}

/** The severity the shared finding class carries on one carrier — the half parity never claims. */
function severityOf(world: ParityWorld, carrier: "typeScript" | "markdown"): string | undefined {
  return reifiedOf(world, carrier).findings.find(
    (finding) => finding.validatorId === world.findingId,
  )?.severity;
}

const parityBindings = {
  "the paired carrier probes named {probe}": (
    world: ParityWorld,
    params: { readonly probe: string },
  ) => {
    world.probe = params.probe;
  },
  "both carriers reify their probe": (world: ParityWorld) => {
    world.typeScript = reifyTypeScriptCarrier(
      readFileSync(new URL(`${world.probe}.sdp.ts`, fixtureRoot), "utf8"),
      `${world.probe}.sdp.ts`,
    );
    world.markdown = reifyMarkdownCarrier(
      readFileSync(new URL(`${world.probe}.sdp.md`, fixtureRoot), "utf8"),
      `${world.probe}.sdp.md`,
    );
  },
  "both carriers report the finding class {findingId}": (
    world: ParityWorld,
    params: { readonly findingId: string },
  ) => {
    world.findingId = params.findingId;

    for (const carrier of ["typeScript", "markdown"] as const) {
      expect(
        reifiedOf(world, carrier).findings.map((finding) => finding.validatorId),
        carrier,
      ).toContain(params.findingId);
    }
  },
  "the TypeScript carrier reports severity {typeScriptSeverity} and extracts {typeScriptSpecs} specs":
    (
      world: ParityWorld,
      params: {
        readonly typeScriptSeverity: "warning" | "error";
        readonly typeScriptSpecs: number;
      },
    ) => {
      expect(severityOf(world, "typeScript")).toBe(params.typeScriptSeverity);
      expect(reifiedOf(world, "typeScript").specs).toHaveLength(params.typeScriptSpecs);
    },
  "the Markdown carrier reports severity {markdownSeverity} and extracts {markdownSpecs} specs": (
    world: ParityWorld,
    params: { readonly markdownSeverity: "warning" | "error"; readonly markdownSpecs: number },
  ) => {
    expect(severityOf(world, "markdown")).toBe(params.markdownSeverity);
    expect(reifiedOf(world, "markdown").specs).toHaveLength(params.markdownSpecs);
  },
};

const boundedParityTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-parser.bounded-parity"),
  label: "the bounded-parity point verifies one shared finding class and its split outcomes",
  verifies: ref("spec:carrier.markdown-parser.bounded-parity"),
});
void boundedParityTestAnchor;

bindExample(boundedParityContract, parityWorld, parityBindings);

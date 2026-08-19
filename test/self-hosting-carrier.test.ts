import { readFileSync } from "node:fs";

import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { boundedParityContract } from "../generated/contracts/carrier.markdown-parser.bounded-parity.contract.js";
import { refusedGuessContract } from "../generated/contracts/carrier.slot-notation.refused-guess.contract.js";
import type {
  SlotNotationConditions,
  SlotNotationOutcome,
} from "../generated/contracts/carrier.slot-notation.space.js";
import { typedDeclarationContract } from "../generated/contracts/carrier.slot-notation.typed-declaration.contract.js";
import {
  parseSlots,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
  stepSkeleton,
} from "../src/index.js";
import type { CarrierReification, SlotGroup } from "../src/index.js";
import { registerRefusedGuess } from "./carrier.slot-notation.refused-guess.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerTypedDeclaration } from "./carrier.slot-notation.typed-declaration.test.generated.js";

/**
 * The bound executable points of the carrier family: the ruled Markdown parser's bounded parity,
 * and the slot micro-notation the carrier's fenced blocks own. The parity point reads one
 * same-class row of the matrix from the paired probe carriers the matrix already owns — the claim
 * under test is exactly the authored one, a shared validator ID with severity and
 * extract-versus-refuse outcomes left carrier-specific, so the point asserts the agreement and the
 * divergence together. The notation points parse one step text in process; no filesystem is
 * involved.
 *
 * `test/extract-parity.test.ts` and `test/notation.test.ts` stay as regression evidence over the
 * whole matrix, the four named non-claims, and every slot spelling; these points state the laws,
 * never every row.
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

/* ----- spec:carrier.slot-notation ----- */

interface SlotWorld {
  stepText: string;
  slots: readonly SlotGroup[] | undefined;
}

function createSlotWorld(point: Partial<SlotNotationConditions>): SlotWorld {
  return { stepText: point.stepText ?? "", slots: undefined };
}

function invokeSlotParse(world: SlotWorld): void {
  world.slots = parseSlots(world.stepText);
}

function observeSlotCount(world: SlotWorld): SlotNotationOutcome {
  if (world.slots === undefined) {
    throw new Error("The parse step must run before the slot groups are observed.");
  }

  return {
    kind: "the notation finds {slotCount} slot groups",
    slotCount: world.slots.length,
  };
}

function expectedSlotCount(point: Partial<SlotNotationConditions>): SlotNotationOutcome {
  if (point.stepText === undefined) {
    return unspecified;
  }

  return { kind: "the notation finds {slotCount} slot groups", slotCount: 1 };
}

const slotNotationTypedTestAnchor = specTest({
  id: testAnchorId("test:protocol.slot-notation.typed-declaration"),
  label: "the declaration point verifies the typed form and its skeleton",
  verifies: ref("spec:carrier.slot-notation.typed-declaration"),
});
void slotNotationTypedTestAnchor;
registerTypedDeclaration({
  createWorld: createSlotWorld,
  invoke: invokeSlotParse,
  observe: observeSlotCount,
  expected: expectedSlotCount,
  // Second and third Thens are different kinds than the oracle's slot-count Then.
  assertions: (world) => {
    const first = world.slots?.[0];
    const { form, slotName } = paramsForStep(
      typedDeclarationContract,
      "the first group has the form {form} and the name {slotName}",
    );
    const { skeleton } = paramsForStep(typedDeclarationContract, "the step skeleton is {skeleton}");

    expect(first?.form).toBe(form);
    expect(first?.name).toBe(slotName);
    expect(stepSkeleton(world.stepText)).toBe(skeleton);
  },
});

const slotNotationRefusedTestAnchor = specTest({
  id: testAnchorId("test:protocol.slot-notation.refused-guess"),
  label: "the refusal point verifies prose braces and the unusable slot",
  verifies: ref("spec:carrier.slot-notation.refused-guess"),
});
void slotNotationRefusedTestAnchor;
registerRefusedGuess({
  createWorld: createSlotWorld,
  invoke: invokeSlotParse,
  observe: observeSlotCount,
  expected: expectedSlotCount,
  // Second and third Thens are different kinds than the oracle's slot-count Then.
  assertions: (world) => {
    const first = world.slots?.[0];
    const { form, slotName } = paramsForStep(
      refusedGuessContract,
      "the first group has the form {form} and the name {slotName}",
    );
    const { skeleton } = paramsForStep(refusedGuessContract, "the step skeleton is {skeleton}");

    expect(first?.form).toBe(form);
    expect(first?.name).toBe(slotName);
    // The stray brace stays prose in the skeleton; only the identifier-led group normalizes.
    expect(stepSkeleton(world.stepText)).toBe(skeleton);
  },
});

import { expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { malformedRefusalContract } from "../generated/contracts/model.stable-ids.malformed-refusal.contract.js";
import { namespacedRoundTripContract } from "../generated/contracts/model.stable-ids.namespaced-round-trip.contract.js";
import { formatId, parseId } from "../src/index.js";
import type { IdParts } from "../src/index.js";

/**
 * The bound executable points of the ID grammar: two representative shapes — the fullest
 * well-formed identifier the model allows, and one refusal that names its reason. The `it.each`
 * tables in `test/ids.test.ts` stay as regression evidence over every accepted and rejected
 * spelling; a law is converted, never a table row.
 */
interface IdentifierWorld {
  identifier: string;
  parsed: IdParts | undefined;
  refusal: Error | undefined;
}

function identifierWorld(): IdentifierWorld {
  return { identifier: "", parsed: undefined, refusal: undefined };
}

const stableIdBindings = {
  "the authored identifier {identifier}": (
    world: IdentifierWorld,
    params: { readonly identifier: string },
  ) => {
    world.identifier = params.identifier;
  },
  "the identifier is parsed": (world: IdentifierWorld) => {
    try {
      world.parsed = parseId(world.identifier);
    } catch (error) {
      world.refusal = error instanceof Error ? error : new Error(String(error));
    }
  },
  "parsing {outcome}": (
    world: IdentifierWorld,
    params: { readonly outcome: "resolves" | "is refused" },
  ) => {
    expect(world.parsed !== undefined).toBe(params.outcome === "resolves");
    expect(world.refusal !== undefined).toBe(params.outcome === "is refused");
  },
  "reformatting the parsed parts restores {restored}": (
    world: IdentifierWorld,
    params: { readonly restored: string },
  ) => {
    if (world.parsed === undefined) {
      throw new Error("The parse step must resolve before the parts are reformatted.");
    }

    expect(formatId(world.parsed)).toBe(params.restored);
  },
  "the refusal names the reason {reason}": (
    world: IdentifierWorld,
    params: { readonly reason: string },
  ) => {
    const message = world.refusal?.message ?? "the identifier refusal is missing";

    // The refusal names the offending value beside its reason: the ID is the durable join key, so
    // a diagnostic that hid it would leave the broken binding unfindable.
    expect(message).toContain(params.reason);
    expect(message).toContain(`"${world.identifier}"`);
  },
};

const namespacedRoundTripTestAnchor = specTest({
  id: testAnchorId("test:protocol.stable-ids.namespaced-round-trip"),
  label: "the round-trip point verifies the namespaced dotted-path grammar",
  verifies: ref("spec:model.stable-ids.namespaced-round-trip"),
});
void namespacedRoundTripTestAnchor;

bindExample(namespacedRoundTripContract, identifierWorld, stableIdBindings);

const malformedRefusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.stable-ids.malformed-refusal"),
  label: "the malformed point verifies the lowercase-namespace refusal",
  verifies: ref("spec:model.stable-ids.malformed-refusal"),
});
void malformedRefusalTestAnchor;

bindExample(malformedRefusalContract, identifierWorld, stableIdBindings);

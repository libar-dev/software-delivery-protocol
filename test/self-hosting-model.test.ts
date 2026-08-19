import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import { lookalikeRefusalContract } from "../generated/contracts/model.anchors.lookalike-refusal.contract.js";
import { physicalIdentityContract } from "../generated/contracts/model.anchors.physical-identity.contract.js";
import type {
  AnchorsConditions,
  AnchorsOutcome,
} from "../generated/contracts/model.anchors.space.js";
import { malformedRefusalContract } from "../generated/contracts/model.stable-ids.malformed-refusal.contract.js";
import { namespacedRoundTripContract } from "../generated/contracts/model.stable-ids.namespaced-round-trip.contract.js";
import type {
  StableIdsConditions,
  StableIdsOutcome,
} from "../generated/contracts/model.stable-ids.space.js";
import { extract, formatId, parseId } from "../src/index.js";
import type { ExtractionResult, IdParts } from "../src/index.js";
import { registerLookalikeRefusal } from "./model.anchors.lookalike-refusal.test.generated.js";
import { registerPhysicalIdentity } from "./model.anchors.physical-identity.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerMalformedRefusal } from "./model.stable-ids.malformed-refusal.test.generated.js";
import { registerNamespacedRoundTrip } from "./model.stable-ids.namespaced-round-trip.test.generated.js";

/**
 * The bound executable points of the ID grammar: two representative shapes — the fullest
 * well-formed identifier the model allows, and one refusal that names its reason. The `it.each`
 * tables in `test/ids.test.ts` stay as regression evidence over every accepted and rejected
 * spelling; a law is converted, never a table row.
 *
 * Beside them, the anchor-trust points: builder trust is physical module identity, so a
 * consumer-local lookalike mints nothing while a deep relative import that resolves to this
 * package's own builder modules is trusted. `test/anchor-trust.test.ts` stays as regression
 * evidence over the package-import surface and the graph shapes each case produces.
 */
interface IdentifierWorld {
  identifier: string;
  parsed: IdParts | undefined;
  refusal: Error | undefined;
}

function createIdentifierWorld(point: Partial<StableIdsConditions>): IdentifierWorld {
  return { identifier: point.identifier ?? "", parsed: undefined, refusal: undefined };
}

function invokeIdentifierParse(world: IdentifierWorld): void {
  try {
    world.parsed = parseId(world.identifier);
  } catch (error) {
    world.refusal = error instanceof Error ? error : new Error(String(error));
  }
}

function observeIdentifierParse(world: IdentifierWorld): StableIdsOutcome {
  if (world.refusal !== undefined) {
    return { kind: "parsing {outcome}", outcome: "is refused" };
  }

  if (world.parsed === undefined) {
    throw new Error("The parse step must produce a resolution or a refusal.");
  }

  return { kind: "parsing {outcome}", outcome: "resolves" };
}

function expectedParsingOutcome(
  point: Partial<StableIdsConditions>,
  outcome: "resolves" | "is refused",
): StableIdsOutcome {
  if (point.identifier === undefined) {
    return unspecified;
  }

  return { kind: "parsing {outcome}", outcome };
}

const namespacedRoundTripTestAnchor = specTest({
  id: testAnchorId("test:protocol.stable-ids.namespaced-round-trip"),
  label: "the round-trip point verifies the namespaced dotted-path grammar",
  verifies: ref("spec:model.stable-ids.namespaced-round-trip"),
});
void namespacedRoundTripTestAnchor;
registerNamespacedRoundTrip({
  createWorld: createIdentifierWorld,
  invoke: invokeIdentifierParse,
  observe: observeIdentifierParse,
  expected: (point) => expectedParsingOutcome(point, "resolves"),
  // Second Then (`reformatting…`) is a different kind than the oracle's `parsing {outcome}`.
  assertions: (world) => {
    if (world.parsed === undefined) {
      throw new Error("The parse step must resolve before the parts are reformatted.");
    }

    const { restored } = paramsForStep(
      namespacedRoundTripContract,
      "reformatting the parsed parts restores {restored}",
    );

    expect(formatId(world.parsed)).toBe(restored);
  },
});

const malformedRefusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.stable-ids.malformed-refusal"),
  label: "the malformed point verifies the lowercase-namespace refusal",
  verifies: ref("spec:model.stable-ids.malformed-refusal"),
});
void malformedRefusalTestAnchor;
registerMalformedRefusal({
  createWorld: createIdentifierWorld,
  invoke: invokeIdentifierParse,
  observe: observeIdentifierParse,
  expected: (point) => expectedParsingOutcome(point, "is refused"),
  // Second Then (`the refusal names the reason`) is a different kind than the oracle's.
  assertions: (world) => {
    const message = world.refusal?.message ?? "the identifier refusal is missing";

    // The refusal names the offending value beside its reason: the ID is the durable join key, so
    // a diagnostic that hid it would leave the broken binding unfindable.
    const { reason } = paramsForStep(
      malformedRefusalContract,
      "the refusal names the reason {reason}",
    );

    expect(message).toContain(reason);
    expect(message).toContain(`"${world.identifier}"`);
  },
});

/* ----- spec:model.anchors ----- */

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const anchorTrustRoots: string[] = [];

afterAll(() => {
  for (const root of anchorTrustRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true });
  }
});

interface AnchorTrustWorld {
  root: string;
  extraction: ExtractionResult | undefined;
}

function extractionOf(world: AnchorTrustWorld): ExtractionResult {
  if (world.extraction === undefined) {
    throw new Error("The extraction step must run before its counts are asserted.");
  }

  return world.extraction;
}

/** The one binding source under test, written into a throwaway repository root. */
const builderSourceSetup: Record<AnchorsConditions["builderSource"], (root: string) => void> = {
  "a consumer-local lookalike module": (root) => {
    mkdirSync(join(root, "src"), { recursive: true });
    writeFileSync(join(root, "src", "code-anchor.ts"), "export const codeAnchor = () => ({});\n");
    writeFileSync(
      join(root, "src", "ids.ts"),
      "export const codeAnchorId = String;\nexport const ref = String;\n",
    );
    writeFileSync(
      join(root, "src", "consumer.ts"),
      `import { codeAnchor } from "./code-anchor.js";
import { codeAnchorId, ref } from "./ids.js";

const binding = codeAnchor({
  id: codeAnchorId("impl:consumer.lookalike"),
  satisfies: ref("spec:consumer.lookalike"),
});
void binding;
`,
    );
  },
  "a relative import resolving to the Protocol builder modules": (root) => {
    mkdirSync(join(root, "model"), { recursive: true });
    mkdirSync(join(root, "deep", "nested"), { recursive: true });
    symlinkSync(join(packageRoot, "src", "ids.ts"), join(root, "ids.ts"));
    symlinkSync(
      join(packageRoot, "src", "model", "code-anchor.ts"),
      join(root, "model", "code-anchor.ts"),
    );
    writeFileSync(
      join(root, "deep", "nested", "binding.ts"),
      `import { codeAnchor } from "../../model/code-anchor.js";
import { codeAnchorId, ref } from "../../ids.js";

const binding = codeAnchor({
  id: codeAnchorId("impl:protocol.deep-binding"),
  satisfies: ref("spec:protocol.deep-binding"),
});
void binding;
`,
    );
  },
  // Declared in the parent's {builderSource} vocabulary but bound by no example point today —
  // package-import trust is regression-covered by test/anchor-trust.test.ts.
  "the published Protocol package": (root) => {
    writeFileSync(
      join(root, "binding.ts"),
      `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

const binding = codeAnchor({
  id: codeAnchorId("impl:consumer.package-binding"),
  satisfies: ref("spec:consumer.package-binding"),
});
void binding;
`,
    );
  },
};

function createAnchorTrustWorld(point: Partial<AnchorsConditions>): AnchorTrustWorld {
  const builderSource = point.builderSource;

  if (builderSource === undefined) {
    return { root: "", extraction: undefined };
  }

  const setup = builderSourceSetup[builderSource];
  const root = mkdtempSync(join(tmpdir(), "sdp-anchor-trust-"));
  anchorTrustRoots.push(root);
  setup(root);
  return { root, extraction: undefined };
}

function invokeAnchorTrustExtract(world: AnchorTrustWorld): void {
  if (world.root === "") {
    return;
  }

  world.extraction = extract({ root: world.root });
}

function observeAnchorMint(world: AnchorTrustWorld): AnchorsOutcome {
  return {
    kind: "the extraction mints {anchorCount} anchors",
    anchorCount: extractionOf(world).counts.anchors,
  };
}

function expectedAnchorMint(
  point: Partial<AnchorsConditions>,
  anchorCount: number,
): AnchorsOutcome {
  if (point.builderSource === undefined) {
    return unspecified;
  }

  return { kind: "the extraction mints {anchorCount} anchors", anchorCount };
}

function assertExtractionFindingCount(world: AnchorTrustWorld, findingCount: number): void {
  // An untrusted builder is silent, not a diagnostic: a file that never bound to the Protocol
  // is not authoring drift, so the refusal must show up as an absent anchor and nothing else.
  expect(extractionOf(world).report.findings).toHaveLength(findingCount);
}

const lookalikeRefusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.anchors.lookalike-refusal"),
  label: "the lookalike point verifies that a consumer-local builder mints nothing",
  verifies: ref("spec:model.anchors.lookalike-refusal"),
});
void lookalikeRefusalTestAnchor;
registerLookalikeRefusal({
  createWorld: createAnchorTrustWorld,
  invoke: invokeAnchorTrustExtract,
  observe: observeAnchorMint,
  expected: (point) => expectedAnchorMint(point, 0),
  // Second Then (`the extraction reports {findingCount}`) is a different kind than the oracle's.
  assertions: (world) => {
    const { findingCount } = paramsForStep(
      lookalikeRefusalContract,
      "the extraction reports {findingCount} findings",
    );

    assertExtractionFindingCount(world, findingCount);
  },
});

const physicalIdentityTestAnchor = specTest({
  id: testAnchorId("test:protocol.anchors.physical-identity"),
  label: "the physical-identity point verifies the resolved relative builder import",
  verifies: ref("spec:model.anchors.physical-identity"),
});
void physicalIdentityTestAnchor;
registerPhysicalIdentity({
  createWorld: createAnchorTrustWorld,
  invoke: invokeAnchorTrustExtract,
  observe: observeAnchorMint,
  expected: (point) => expectedAnchorMint(point, 1),
  // Second Then (`the extraction reports {findingCount}`) is a different kind than the oracle's.
  assertions: (world) => {
    const { findingCount } = paramsForStep(
      physicalIdentityContract,
      "the extraction reports {findingCount} findings",
    );

    assertExtractionFindingCount(world, findingCount);
  },
});

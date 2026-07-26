import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { lookalikeRefusalContract } from "../generated/contracts/model.anchors.lookalike-refusal.contract.js";
import { physicalIdentityContract } from "../generated/contracts/model.anchors.physical-identity.contract.js";
import { malformedRefusalContract } from "../generated/contracts/model.stable-ids.malformed-refusal.contract.js";
import { namespacedRoundTripContract } from "../generated/contracts/model.stable-ids.namespaced-round-trip.contract.js";
import { extract, formatId, parseId } from "../src/index.js";
import type { ExtractionResult, IdParts } from "../src/index.js";

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

function anchorTrustWorld(): AnchorTrustWorld {
  return { root: "", extraction: undefined };
}

function extractionOf(world: AnchorTrustWorld): ExtractionResult {
  if (world.extraction === undefined) {
    throw new Error("The extraction step must run before its counts are asserted.");
  }

  return world.extraction;
}

/** The one binding source under test, written into a throwaway repository root. */
const builderSourceSetup: Record<string, (root: string) => void> = {
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

const anchorTrustBindings = {
  "a repository whose one source file builds an anchor through {builderSource}": (
    world: AnchorTrustWorld,
    params: {
      readonly builderSource:
        | "a consumer-local lookalike module"
        | "a relative import resolving to the Protocol builder modules"
        | "the published Protocol package";
    },
  ) => {
    const setup = builderSourceSetup[params.builderSource];

    if (setup === undefined) {
      throw new Error(
        `No repository shape is written for the builder source "${params.builderSource}".`,
      );
    }

    world.root = mkdtempSync(join(tmpdir(), "sdp-anchor-trust-"));
    anchorTrustRoots.push(world.root);
    setup(world.root);
  },
  "the repository is extracted": (world: AnchorTrustWorld) => {
    world.extraction = extract({ root: world.root });
  },
  "the extraction mints {anchorCount} anchors": (
    world: AnchorTrustWorld,
    params: { readonly anchorCount: number },
  ) => {
    expect(extractionOf(world).counts.anchors).toBe(params.anchorCount);
  },
  "the extraction reports {findingCount} findings": (
    world: AnchorTrustWorld,
    params: { readonly findingCount: number },
  ) => {
    // An untrusted builder is silent, not a diagnostic: a file that never bound to the Protocol
    // is not authoring drift, so the refusal must show up as an absent anchor and nothing else.
    expect(extractionOf(world).report.findings).toHaveLength(params.findingCount);
  },
};

const lookalikeRefusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.anchors.lookalike-refusal"),
  label: "the lookalike point verifies that a consumer-local builder mints nothing",
  verifies: ref("spec:model.anchors.lookalike-refusal"),
});
void lookalikeRefusalTestAnchor;

bindExample(lookalikeRefusalContract, anchorTrustWorld, anchorTrustBindings);

const physicalIdentityTestAnchor = specTest({
  id: testAnchorId("test:protocol.anchors.physical-identity"),
  label: "the physical-identity point verifies the resolved relative builder import",
  verifies: ref("spec:model.anchors.physical-identity"),
});
void physicalIdentityTestAnchor;

bindExample(physicalIdentityContract, anchorTrustWorld, anchorTrustBindings);

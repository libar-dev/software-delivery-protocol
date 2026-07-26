import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { refusedPathContract } from "../generated/contracts/extraction.excludes.refused-path.contract.js";
import { segmentBoundaryContract } from "../generated/contracts/extraction.excludes.segment-boundary.contract.js";
import { declaredVersionContract } from "../generated/contracts/extraction.schema-versioning.declared-version.contract.js";
import { discoverFiles } from "../src/extract/discover.js";
import type { DiscoveredFiles } from "../src/extract/discover.js";
import { serializeGraph } from "../src/extract/serialize.js";
import { deriveGraph, schemaVersion } from "../src/index.js";
import type { GraphSchema } from "../src/index.js";

/**
 * The bound executable points of the extraction family. The exclusion law reads a real filesystem
 * root, so its world is a temporary fixture tree — never the repository root, which no pooled test
 * may touch. The schema-version law needs no filesystem at all: `deriveGraph` and `serializeGraph`
 * are the payload seam a consumer actually reads.
 *
 * `test/exclude-diagnostics.test.ts` and `test/graph-schema.test.ts` stay as regression evidence:
 * these points state the laws, never every diagnostic spelling or exported contract row.
 */

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  temporaryRoots.clear();
});

/* ----- spec:extraction.excludes ----- */

interface ExcludeWorld {
  readonly root: string;
  exclusion: string;
  discovered: DiscoveredFiles | undefined;
  refusal: Error | undefined;
}

function excludeWorld(): ExcludeWorld {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-excludes-"));
  temporaryRoots.add(root);

  return { root, exclusion: "", discovered: undefined, refusal: undefined };
}

function discoveredOf(world: ExcludeWorld): DiscoveredFiles {
  if (world.discovered === undefined) {
    throw new Error("The discovery step must run before the surviving carriers are asserted.");
  }

  return world.discovered;
}

const excludeBindings = {
  "the extraction root carries the tree {excludedTree} and the similar sibling {similarTree}": (
    world: ExcludeWorld,
    params: { readonly excludedTree: string; readonly similarTree: string },
  ) => {
    // Both trees carry both discovery surfaces — a spec carrier and an anchor candidate — so one
    // exclusion is observed on each surface rather than on the declared layer alone.
    for (const tree of [params.excludedTree, params.similarTree]) {
      mkdirSync(join(world.root, tree), { recursive: true });
      writeFileSync(
        join(
          world.root,
          tree,
          tree === params.excludedTree ? "excluded.sdp.ts" : "included.sdp.ts",
        ),
        "",
        "utf8",
      );
      writeFileSync(join(world.root, tree, "helper.ts"), "", "utf8");
    }
  },
  "the consumer supplies the exclusion {exclusion}": (
    world: ExcludeWorld,
    params: { readonly exclusion: string },
  ) => {
    world.exclusion = params.exclusion;
  },
  "the root is discovered": (world: ExcludeWorld) => {
    try {
      world.discovered = discoverFiles(world.root, [world.exclusion]);
    } catch (error) {
      world.refusal = error instanceof Error ? error : new Error(String(error));
    }
  },
  "the discovery attempt {outcome}": (
    world: ExcludeWorld,
    params: { readonly outcome: "completes" | "is refused" },
  ) => {
    expect(world.discovered !== undefined).toBe(params.outcome === "completes");
    expect(world.refusal !== undefined).toBe(params.outcome === "is refused");
  },
  "the surviving spec carrier is {specCarrier} and the surviving anchor candidate is {anchorCandidate}":
    (
      world: ExcludeWorld,
      params: { readonly specCarrier: string; readonly anchorCandidate: string },
    ) => {
      const discovered = discoveredOf(world);

      expect(discovered.specFiles.map((file) => file.relativePath)).toEqual([params.specCarrier]);
      expect(discovered.anchorCandidateFiles.map((file) => file.relativePath)).toEqual([
        params.anchorCandidate,
      ]);
    },
  "the refusal states {diagnostic} and names the offending path": (
    world: ExcludeWorld,
    params: { readonly diagnostic: string },
  ) => {
    const message = world.refusal?.message ?? "the exclusion refusal is missing";

    expect(message).toContain(params.diagnostic);
    expect(message).toContain(`"${world.exclusion}"`);
  },
};

const excludesSegmentBoundaryTestAnchor = specTest({
  id: testAnchorId("test:protocol.excludes.segment-boundary"),
  label: "the segment-boundary point verifies the exact-prefix exclusion rule",
  verifies: ref("spec:extraction.excludes.segment-boundary"),
});
void excludesSegmentBoundaryTestAnchor;

bindExample(segmentBoundaryContract, excludeWorld, excludeBindings);

const excludesRefusedPathTestAnchor = specTest({
  id: testAnchorId("test:protocol.excludes.refused-path"),
  label: "the refused-path point verifies the malformed-exclusion refusal",
  verifies: ref("spec:extraction.excludes.refused-path"),
});
void excludesRefusedPathTestAnchor;

bindExample(refusedPathContract, excludeWorld, excludeBindings);

/* ----- spec:extraction.schema-versioning ----- */

interface SchemaVersionWorld {
  graph: GraphSchema | undefined;
  payload: string | undefined;
}

function schemaVersionWorld(): SchemaVersionWorld {
  return { graph: undefined, payload: undefined };
}

function payloadOf(world: SchemaVersionWorld): Record<string, unknown> {
  if (world.payload === undefined) {
    throw new Error("The serialization step must run before the payload is read.");
  }

  return JSON.parse(world.payload) as Record<string, unknown>;
}

const schemaVersionBindings = {
  "a graph derived from the authored spec {specId}": (
    world: SchemaVersionWorld,
    params: { readonly specId: string },
  ) => {
    world.graph = deriveGraph(
      [
        {
          id: params.specId,
          file: "specs/probe.sdp.md",
          line: 1,
          data: {
            id: params.specId,
            title: "Probe for the declared schema version",
            kind: "rule",
            altitude: "story",
            readiness: "idea",
          },
        },
      ],
      [],
      [],
    );
  },
  "the graph payload is serialized": (world: SchemaVersionWorld) => {
    if (world.graph === undefined) {
      throw new Error("The derivation step must run before the payload is serialized.");
    }

    world.payload = serializeGraph(world.graph);
  },
  "the payload declares the schema version {schemaVersion}": (
    world: SchemaVersionWorld,
    params: { readonly schemaVersion: string },
  ) => {
    expect(payloadOf(world).schemaVersion).toBe(params.schemaVersion);
  },
  "the parsed payload agrees with the engine's declared version: {agrees}": (
    world: SchemaVersionWorld,
    params: { readonly agrees: boolean },
  ) => {
    expect(payloadOf(world).schemaVersion === schemaVersion).toBe(params.agrees);
  },
};

const schemaVersioningTestAnchor = specTest({
  id: testAnchorId("test:protocol.schema-versioning.declared-version"),
  label: "the declared-version point verifies the readable payload version",
  verifies: ref("spec:extraction.schema-versioning.declared-version"),
});
void schemaVersioningTestAnchor;

bindExample(declaredVersionContract, schemaVersionWorld, schemaVersionBindings);

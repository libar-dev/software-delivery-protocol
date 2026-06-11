import { deriveGraph } from "../../src/extract/derive.js";
import type { ReifiedAnchor } from "../../src/extract/anchors.js";
import type { ReifiedPack, ReifiedSpec } from "../../src/extract/reify.js";
import type { Anchor, GraphSchema, Pack, Spec } from "../../src/index.js";

export interface FixtureModel {
  readonly specs?: readonly Spec[];
  readonly packs?: readonly Pack[];
  readonly anchors?: readonly Anchor[];
}

/**
 * Derives a graph from DSL-built values through the real `deriveGraph` — fixtures keep the typed
 * builders and the derivation logic stays single-sourced (no parallel test-side derivation to
 * drift). Deliberately bypasses the extractor's duplicate-id exclusion: the graph-level backstop
 * validators need carriers the extractor would have excluded, which is exactly the
 * non-extractor-producer input class they exist for.
 */
export function deriveFixtureGraph(model: FixtureModel): GraphSchema {
  const specs: ReifiedSpec[] = (model.specs ?? []).map((entry, position) => ({
    data: entry as unknown as Record<string, unknown>,
    id: entry.id,
    file: "specs/fixture.sdp.ts",
    line: position + 1,
  }));

  const packs: ReifiedPack[] = (model.packs ?? []).map((entry, position) => ({
    data: entry as unknown as Record<string, unknown>,
    id: entry.id,
    file: "specs/fixture.pack.sdp.ts",
    line: position + 1,
  }));

  const anchors: ReifiedAnchor[] = (model.anchors ?? []).map((entry, position) => ({
    data: entry as unknown as Record<string, unknown>,
    id: entry.id,
    flavor: "satisfies" in entry ? "code" : "test",
    file: "src/fixture.ts",
    line: position + 1,
  }));

  return deriveGraph(specs, packs, anchors);
}

import type { Anchor } from "../model/anchors.js";
import type { Pack } from "../model/pack.js";
import type { Spec } from "../model/spec.js";

/**
 * Pre-graph authored-layer DTO — the stand-in harness until the extractor lands (one validation
 * path, MD-14): not persisted, not a graph, and never a second public validation seam (not the
 * Slice 3 gate).
 */
export interface AuthoredModel {
  readonly specs: readonly Spec[];
  readonly packs: readonly Pack[];
  readonly anchors: readonly Anchor[];
}

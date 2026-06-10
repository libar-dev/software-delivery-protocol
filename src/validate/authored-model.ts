import type { Anchor } from "../model/anchors.js";
import type { Pack } from "../model/pack.js";
import type { Spec } from "../model/spec.js";

/**
 * Pre-graph authored-layer DTO (one validation path, MD-14). Since Slice 1 the extractor is the
 * sole in-repo producer of values of this shape from real corpora (`extract(…).model` — the
 * hand-assembled example model is gone); the public export survives only because the floor table's
 * predicate signatures are keyed to it, and it retires wholesale with the Slice-3 graph-validator
 * re-key. Not persisted, not a graph, and never a second public validation seam (not the Slice 3
 * gate).
 */
export interface AuthoredModel {
  readonly specs: readonly Spec[];
  readonly packs: readonly Pack[];
  readonly anchors: readonly Anchor[];
}

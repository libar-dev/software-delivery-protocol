import type { Anchor } from "../model/anchors.js";
import type { Pack } from "../model/pack.js";
import type { Spec } from "../model/spec.js";

/**
 * Session 1 authored-layer DTO for pre-graph checks; not persisted, not a graph, and not the Slice 3 validation gate.
 */
export interface AuthoredModel {
  readonly specs: readonly Spec[];
  readonly packs: readonly Pack[];
  readonly anchors: readonly Anchor[];
}

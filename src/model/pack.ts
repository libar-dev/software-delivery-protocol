import type { PackId, SpecId } from "../ids.js";

export interface Pack {
  readonly id: PackId;
  readonly title: string;
  readonly framing?: string;
  readonly specs: readonly SpecId[];
  readonly modelRefs?: readonly SpecId[];
}

export function pack(definition: Pack): Pack {
  return {
    ...definition,
    specs: [...definition.specs],
    modelRefs: definition.modelRefs === undefined ? undefined : [...definition.modelRefs],
  };
}

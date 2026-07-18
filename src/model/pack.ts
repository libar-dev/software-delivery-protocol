import { codeAnchor } from "./code-anchor.js";

import { codeAnchorId, ref } from "../ids.js";
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

const packAggregateAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.pack-aggregate"),
  label: "Pack aggregate and model references",
  satisfies: ref("spec:model.pack-aggregate"),
});

void packAggregateAnchor;

import { codeAnchor } from "./code-anchor.js";

import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import type { SpecId } from "../ids.js";
import type { SpecAltitude, SpecKind, SpecReadiness } from "./descriptors.js";
import type { SpecRelation } from "./relations.js";
import type { SpecSections } from "./sections.js";

export interface Spec extends SpecSections {
  readonly id: SpecId;
  readonly title: string;
  /** Free prose owned by the Spec itself; Markdown carries it between the H1 and first H2. */
  readonly narrative?: string;
  readonly kind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  readonly relations?: readonly SpecRelation[];
}

const specPrimitiveAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.spec-primitive"),
  label: "Spec envelope and enrich-in-place shape",
  satisfies: ref("spec:model.core-model"),
  component: componentAnchorId("component:protocol.model"),
});

void specPrimitiveAnchor;

export function spec(definition: Spec): Spec {
  return {
    ...definition,
    relations:
      definition.relations?.map((relation) => ({
        ...relation,
      })) ?? undefined,
  };
}

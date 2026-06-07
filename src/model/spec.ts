import type { SpecId } from "../ids.js";
import type { SpecAltitude, SpecKind, SpecReadiness } from "./descriptors.js";
import type { SpecRelation } from "./relations.js";
import type { SpecSections } from "./sections.js";

export interface Spec extends SpecSections {
  readonly id: SpecId;
  readonly title: string;
  readonly kind: SpecKind;
  readonly altitude: SpecAltitude;
  readonly readiness: SpecReadiness;
  readonly relations?: readonly SpecRelation[];
}

export function spec(definition: Spec): Spec {
  return {
    ...definition,
    relations:
      definition.relations?.map((relation) => ({
        ...relation,
      })) ?? undefined,
  };
}

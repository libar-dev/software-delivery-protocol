import type { SpecId } from "../ids.js";

export const SPEC_RELATION_TYPES = [
  "refines",
  "dependsOn",
  "constrainedBy",
  "decidedBy",
  "verifies",
  "supersedes",
] as const;

export type SpecRelationType = (typeof SPEC_RELATION_TYPES)[number];

export interface SpecRelation<TType extends SpecRelationType = SpecRelationType> {
  readonly type: TType;
  readonly target: SpecId;
  readonly claim: "declared";
}

function declaredRelation<TType extends SpecRelationType>(
  type: TType,
  target: SpecId,
): SpecRelation<TType> {
  return {
    type,
    target,
    claim: "declared",
  };
}

export function refines(target: SpecId): SpecRelation<"refines"> {
  return declaredRelation("refines", target);
}

export function dependsOn(target: SpecId): SpecRelation<"dependsOn"> {
  return declaredRelation("dependsOn", target);
}

export function constrainedBy(target: SpecId): SpecRelation<"constrainedBy"> {
  return declaredRelation("constrainedBy", target);
}

export function decidedBy(target: SpecId): SpecRelation<"decidedBy"> {
  return declaredRelation("decidedBy", target);
}

export function verifies(target: SpecId): SpecRelation<"verifies"> {
  return declaredRelation("verifies", target);
}

export function supersedes(target: SpecId): SpecRelation<"supersedes"> {
  return declaredRelation("supersedes", target);
}

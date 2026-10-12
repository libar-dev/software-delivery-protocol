import { codeAnchor } from "./code-anchor.js";

import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
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
  /**
   * Authored relation targets are `spec:`-only. The base reserves `decidedBy` → `doc:` for a
   * genuinely external ADR (`spec:model.relations`), but that target type is a named deferral until the need
   * arrives (MD-16) — see also the `ref()` note in `ids.ts`.
   */
  readonly target: SpecId;
  readonly claim: "declared";
  readonly reason?: string;
  readonly exercises?: TType extends "verifies" ? readonly string[] : never;
}

export interface RelationOptions {
  readonly reason?: string;
}

export interface VerifiesOptions extends RelationOptions {
  readonly exercises?: readonly string[];
}

function declaredRelation<TType extends SpecRelationType>(
  type: TType,
  target: SpecId,
  options?: RelationOptions,
): SpecRelation<TType> {
  return {
    type,
    target,
    claim: "declared",
    ...(options?.reason === undefined ? {} : { reason: options.reason }),
  };
}

export function refines(target: SpecId, options?: RelationOptions): SpecRelation<"refines"> {
  return declaredRelation("refines", target, options);
}

export function dependsOn(target: SpecId, options?: RelationOptions): SpecRelation<"dependsOn"> {
  return declaredRelation("dependsOn", target, options);
}

export function constrainedBy(
  target: SpecId,
  options?: RelationOptions,
): SpecRelation<"constrainedBy"> {
  return declaredRelation("constrainedBy", target, options);
}

export function decidedBy(target: SpecId, options?: RelationOptions): SpecRelation<"decidedBy"> {
  return declaredRelation("decidedBy", target, options);
}

export function verifies(target: SpecId, options?: VerifiesOptions): SpecRelation<"verifies"> {
  return {
    ...declaredRelation("verifies", target, options),
    ...(options?.exercises === undefined ? {} : { exercises: options.exercises }),
  };
}

export function supersedes(target: SpecId, options?: RelationOptions): SpecRelation<"supersedes"> {
  return declaredRelation("supersedes", target, options);
}

const specRelationsAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.spec-relations"),
  label: "declared Spec relation builders",
  satisfies: ref("spec:model.relations"),
  component: componentAnchorId("component:protocol.model"),
  role: "contract",
});

void specRelationsAnchor;

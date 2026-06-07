export const SPEC_KINDS = [
  "behavior",
  "workflow",
  "example",
  "rule",
  "constraint",
  "model",
  "decision",
  "contract",
] as const;

export type SpecKind = (typeof SPEC_KINDS)[number];

export const SPEC_ALTITUDES = ["epic", "feature", "story"] as const;

export type SpecAltitude = (typeof SPEC_ALTITUDES)[number];

export const SPEC_READINESS = ["idea", "scoped", "defined", "ready"] as const;

export type SpecReadiness = (typeof SPEC_READINESS)[number];

export const SPEC_KIND_DISPLAY_LABELS = {
  behavior: "Use Case / Behavior",
  workflow: "Workflow",
  example: "Example / Scenario",
  rule: "Business Rule",
  constraint: "Constraint (NFR)",
  model: "Domain Model",
  decision: "Decision Record",
  contract: "Contract",
} as const satisfies Record<SpecKind, string>;

export type SpecKindDisplayLabel = (typeof SPEC_KIND_DISPLAY_LABELS)[SpecKind];

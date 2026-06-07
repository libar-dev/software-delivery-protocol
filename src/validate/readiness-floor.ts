import type { SpecKind, SpecReadiness } from "../model/descriptors.js";

export interface ReadinessClause {
  readonly id: string;
  readonly description: string;
  readonly authoredPaths?: readonly string[];
  readonly deferredInSession1?: true;
}

export interface ReadinessFloor {
  readonly readiness: SpecReadiness;
  readonly clauses: readonly ReadinessClause[];
}

export type ReadinessOverlayKind = Extract<SpecKind, "constraint" | "example" | "model">;

export interface ReadinessKindOverlay {
  readonly kind: ReadinessOverlayKind;
  readonly appliesAtOrAbove: Extract<SpecReadiness, "defined" | "ready">;
  readonly clauses: readonly ReadinessClause[];
}

export const readinessFloors = {
  idea: {
    readiness: "idea",
    clauses: [
      {
        id: "id",
        description: "Envelope includes a stable spec id.",
        authoredPaths: ["id"],
      },
      {
        id: "title",
        description: "Envelope includes a human-readable title.",
        authoredPaths: ["title"],
      },
      {
        id: "kind",
        description: "Envelope states the authored spec kind.",
        authoredPaths: ["kind"],
      },
      {
        id: "altitude",
        description: "Envelope states the authored altitude.",
        authoredPaths: ["altitude"],
      },
      {
        id: "intent.outcome-or-parent-relation",
        description: "Spec states intent.outcome or declares a parent relation via refines.",
        authoredPaths: ["intent.outcome", "relations"],
      },
    ],
  },
  scoped: {
    readiness: "scoped",
    clauses: [
      {
        id: "intent.outcome",
        description: "Spec states the intended outcome.",
        authoredPaths: ["intent.outcome"],
      },
      {
        id: "at-least-one-relation",
        description: "Spec declares at least one authored relation.",
        authoredPaths: ["relations"],
      },
      {
        id: "rules-examples-or-constraints",
        description:
          "Spec includes at least one of behavior.rules, behavior.examples, or constraints.",
        authoredPaths: ["behavior.rules", "behavior.examples", "constraints"],
      },
    ],
  },
  defined: {
    readiness: "defined",
    clauses: [
      {
        id: "rules-and-or-examples",
        description: "Spec includes rules and/or examples.",
        authoredPaths: ["behavior.rules", "behavior.examples"],
      },
      {
        id: "constraint-targets-are-machine-readable",
        description: "Any authored constraint detail includes a machine-readable target.",
        authoredPaths: ["constraints.*.target"],
      },
      {
        id: "no-blocking-open-questions",
        description: "Spec has no blocking open questions.",
        authoredPaths: ["design.openQuestions", "decision.openQuestions"],
      },
    ],
  },
  ready: {
    readiness: "ready",
    clauses: [
      {
        id: "defined-floor",
        description: "Spec satisfies the defined readiness floor.",
      },
      {
        id: "no-blocking-open-questions",
        description: "Spec has no blocking open questions.",
        authoredPaths: ["design.openQuestions", "decision.openQuestions"],
      },
      {
        id: "all-relations-resolve",
        description: "All authored relations resolve to known targets.",
        authoredPaths: ["relations"],
        deferredInSession1: true,
      },
      {
        id: "depends-on-and-refines-targets-are-defined",
        description: "Every dependsOn and refines target is at least defined.",
        authoredPaths: ["relations"],
        deferredInSession1: true,
      },
      {
        id: "anchors-resolve",
        description: "Any authored anchors present resolve.",
        authoredPaths: ["anchors"],
        deferredInSession1: true,
      },
    ],
  },
} as const satisfies Record<SpecReadiness, ReadinessFloor>;

export const readinessKindOverlays = {
  constraint: {
    kind: "constraint",
    appliesAtOrAbove: "defined",
    clauses: [
      {
        id: "constraint-machine-readable-target",
        description:
          "Constraint specs need a parseable, machine-readable target before defined and ready.",
        authoredPaths: ["constraints.target"],
      },
    ],
  },
  example: {
    kind: "example",
    appliesAtOrAbove: "defined",
    clauses: [
      {
        id: "example-given-when-then",
        description:
          "Example specs need structured given, when, and then detail before defined and ready.",
        authoredPaths: ["behavior.given", "behavior.when", "behavior.then"],
      },
    ],
  },
  model: {
    kind: "model",
    appliesAtOrAbove: "defined",
    clauses: [
      {
        id: "model-term-definitions",
        description: "Model specs need term definitions before defined and ready.",
        authoredPaths: ["model.terms"],
      },
    ],
  },
} as const satisfies Record<ReadinessOverlayKind, ReadinessKindOverlay>;

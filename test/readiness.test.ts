import { describe, expect, it } from "vitest";

import {
  readinessFloors,
  readinessKindOverlays,
  validationSeverities,
  validatorFamilies,
} from "../src/index.js";

describe("readiness and validation contracts", () => {
  it("exports the canonical validator families and severities", () => {
    expect(validatorFamilies).toEqual(["conformance", "honesty"]);
    expect(validationSeverities).toEqual(["error", "warning"]);
  });

  it("defines all canonical readiness floors as inert data", () => {
    expect(Object.keys(readinessFloors)).toEqual(["idea", "scoped", "defined", "ready"]);

    expect(readinessFloors.idea.clauses.map((clause) => clause.id)).toEqual([
      "id",
      "title",
      "kind",
      "altitude",
      "intent.outcome-or-parent-relation",
    ]);

    expect(readinessFloors.scoped.clauses.map((clause) => clause.id)).toEqual([
      "intent.outcome",
      "at-least-one-relation",
      "rules-examples-or-constraints",
    ]);

    expect(readinessFloors.defined.clauses.map((clause) => clause.id)).toEqual([
      "rules-and-or-examples",
      "constraint-targets-are-machine-readable",
      "no-blocking-open-questions",
    ]);

    expect(readinessFloors.ready.clauses.map((clause) => clause.id)).toEqual([
      "defined-floor",
      "no-blocking-open-questions",
      "all-relations-resolve",
      "depends-on-and-refines-targets-are-defined",
      "anchors-resolve",
    ]);
  });

  it("marks graph-shaped ready clauses as deferred in Session 1", () => {
    const deferredClauses = readinessFloors.ready.clauses
      .filter(
        (
          clause,
        ): clause is Extract<
          (typeof readinessFloors.ready.clauses)[number],
          { deferredInSession1: true }
        > => "deferredInSession1" in clause,
      )
      .map((clause) => clause.id);

    expect(deferredClauses).toEqual([
      "all-relations-resolve",
      "depends-on-and-refines-targets-are-defined",
      "anchors-resolve",
    ]);
  });

  it("defines kind-aware overlays for constraint, example, and model", () => {
    expect(Object.keys(readinessKindOverlays)).toEqual(["constraint", "example", "model"]);

    expect(readinessKindOverlays.constraint).toEqual({
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
    });

    expect(readinessKindOverlays.example).toEqual({
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
    });

    expect(readinessKindOverlays.model).toEqual({
      kind: "model",
      appliesAtOrAbove: "defined",
      clauses: [
        {
          id: "model-term-definitions",
          description: "Model specs need term definitions before defined and ready.",
          authoredPaths: ["model.terms"],
        },
      ],
    });
  });
});

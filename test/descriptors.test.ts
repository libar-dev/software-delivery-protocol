import { describe, expect, it } from "vitest";

import {
  SPEC_ALTITUDES,
  SPEC_KIND_DISPLAY_LABELS,
  SPEC_KINDS,
  SPEC_READINESS,
} from "../src/model/descriptors.js";
import { SPEC_SECTION_NAMES } from "../src/model/sections.js";

describe("descriptors", () => {
  it("exports the canonical kind literals", () => {
    expect(SPEC_KINDS).toEqual([
      "behavior",
      "workflow",
      "example",
      "rule",
      "constraint",
      "model",
      "decision",
      "contract",
    ]);
  });

  it("exports the canonical altitude literals", () => {
    expect(SPEC_ALTITUDES).toEqual(["epic", "feature", "story"]);
  });

  it("exports the canonical readiness literals", () => {
    expect(SPEC_READINESS).toEqual(["idea", "scoped", "defined", "ready"]);
  });

  it("exports the canonical kind display labels", () => {
    expect(SPEC_KIND_DISPLAY_LABELS).toEqual({
      behavior: "Use Case / Behavior",
      workflow: "Workflow",
      example: "Example / Scenario",
      rule: "Business Rule",
      constraint: "Constraint (NFR)",
      model: "Domain Model",
      decision: "Decision Record",
      contract: "Contract",
    });
  });

  it("exports the optional section names", () => {
    expect(SPEC_SECTION_NAMES).toEqual([
      "intent",
      "behavior",
      "constraints",
      "model",
      "design",
      "decision",
      "verification",
      "ui",
    ]);
  });
});

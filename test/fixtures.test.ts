import { describe, expect, it } from "vitest";

import { validateGraph } from "../src/index.js";
import { activeValidatorFixtures } from "./fixtures/graph-validator.fixtures.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

describe("graph-validator fixtures (should-pass / should-fail regression net)", () => {
  for (const fixture of activeValidatorFixtures) {
    it(fixture.name, () => {
      const { findings } = validateGraph(deriveFixtureGraph(fixture.model));
      const { expect: expected } = fixture;

      if (expected === "pass") {
        expect(findings).toEqual([]);
        return;
      }

      const matching = findings.filter(
        (finding) =>
          finding.validatorId === expected.validatorId &&
          (expected.relatedId === undefined || finding.relatedId === expected.relatedId),
      );

      expect(matching.length).toBeGreaterThan(0);
    });
  }
});

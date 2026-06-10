import { describe, expect, it } from "vitest";

import { validateAuthoredModel } from "../src/index.js";
import { activeValidatorFixtures } from "./fixtures/authored-model.fixtures.js";

describe("authored-model validator fixtures (should-pass / should-fail regression net)", () => {
  for (const fixture of activeValidatorFixtures) {
    it(fixture.name, () => {
      const { findings } = validateAuthoredModel(fixture.model);
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

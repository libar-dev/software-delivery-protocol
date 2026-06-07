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

  // Gated fixtures — the inherited checklist for Wave B (plan 03). They are deliberately not active
  // yet because the behavior they assert does not exist in Session-1 code:
  //   - the open-questions home is still design/decision, not intent (H2);
  //   - a hand-authored delivery fact inside an untyped section still typechecks and is uncaught (D1).
  it.todo("invalid-ready-with-blocking-question fails once H2 reads intent.openQuestions");
  it.todo("invalid-hand-authored-delivery-fact-in-section fails once sections are typed (D1)");
});

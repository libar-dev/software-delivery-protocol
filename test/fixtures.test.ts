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

  // The Wave-B gated stubs resolved (plans/02 §4): `invalid-ready-with-blocking-question` is active
  // above (MD-9 — the floor reads intent.openQuestions); `invalid-hand-authored-delivery-fact-in-
  // section` is pinned twice — a compile-time `@ts-expect-error` fixture in `builders.typecheck.ts`
  // (MD-11, the fresh-literal path) and the active runtime fixture above (MD-16, the non-fresh
  // object that slips past excess-property checking).
});

/**
 * Per-kind honesty dispositions from `spec:decisions.carrier-universality`.
 * Gherkin remains a lawful canonical per-ID option only for behavior and example.
 * The other six kinds stay Markdown because a Gherkin mapping would lie.
 */
export const GHERKIN_KIND_LIE_REASONS = {
  workflow: "workflow has no distinct Gherkin root and Feature mapping erases the kind",
  rule: "rule collides with Rule: already consumed as inline behavior.rules",
  constraint: "constraint needs machine-readable targets a Scenario cannot own",
  model: "model needs keyed terms",
  decision:
    "decision needs context/decision/rationale/consequences (and supersedes) that Feature structure cannot distinguish",
  contract:
    "contract shares the behavior family row today but Feature cannot structurally mark the kind",
} as const;

export type GherkinRefusedKind = keyof typeof GHERKIN_KIND_LIE_REASONS;

export function gherkinKindLieReason(kind: string): string | undefined {
  return (GHERKIN_KIND_LIE_REASONS as Readonly<Record<string, string>>)[kind];
}

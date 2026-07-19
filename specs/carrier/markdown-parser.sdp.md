---
id: spec:carrier.markdown-parser
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn: spec:carrier.envelope-contract
---
# The product parser reifies the ruled Markdown subset

## Intent
- problem: Prevent carrier-specific graph and validation paths from diverging.
- outcome: Reify authored Markdown without a second graph or validation path.
- value: Markdown-carried intent remains subject to the Protocol's deterministic checks.

## Behavior
- rule: The parser accepts only the ruled heading grammar and excludes one malformed carrier while continuing healthy siblings.
- rule: The ruled Markdown parser has bounded finding-class parity with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`; the shared validator ID is the claim, while severity and extract-versus-refuse outcomes remain carrier-specific.
- rule: Named non-claim — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.
- rule: Named non-claim — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.
- rule: Named non-claim — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.
- rule: Named non-claim — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.

## Verification — executable
- `test/extract-parity.test.ts` executes the settled finding-class parity matrix, including the six same-class findings, their carrier-specific outcomes, and four named non-claims.

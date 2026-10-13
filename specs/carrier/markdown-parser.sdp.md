---
id: spec:carrier.markdown-parser
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn:
    - spec:carrier.envelope-contract
    - spec:carrier.markdown-body-grammar
  constrainedBy: spec:carrier.inline-code-spans
---
# The Markdown parser reifies the ruled subset

## Intent
- problem: Prevent carrier-specific graph and validation paths from diverging.
- outcome: Reify authored Markdown without a second graph or validation path.
- value: Markdown-carried intent remains subject to the Protocol's deterministic checks.

## Behavior
- rule: The parser accepts the grammar stated by `spec:carrier.markdown-body-grammar`, keeps matched code spans literal under `spec:carrier.inline-code-spans`, and excludes a malformed Markdown carrier while continuing healthy siblings.
- rule: The ruled Markdown parser has bounded finding-class parity with the TypeScript carrier for `extract/non-static-envelope`, `extract/invalid-id`, `extract/duplicate-id`, `extract/reserved-property`, `extract/unowned-prose`, and `extract/unrecognized-property`; both carriers report each of these findings under the same validator id, while severity and extract-versus-refuse outcomes remain carrier-specific.
- rule: Carrier-specific finding — `extract/parse-error` remains distinct because YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.
- rule: Carrier-specific finding — `extract/non-static-section` remains distinct because TypeScript degrades optional section properties while Markdown refuses malformed documents whole.
- rule: A static envelope field that cannot be reified fails extraction in either carrier. A non-static optional TypeScript section property drops with a warning, except the question failures below; a malformed Markdown carrier is refused whole.
- rule: The TypeScript carrier refuses an integer-like Design or UI key or Model term with an error and drops only that member. An unknown property inside a question, or a malformed question key, is an error at that property; refusing it does not remove the question's blocking flag.
- rule: In the TypeScript carrier, a non-static value under a question's `decider`, `links`, `provisional` or `trigger` field drops the whole question list with an error; a non-static question text or blocking flag drops the whole list with a warning.
- rule: Carrier-specific finding — `extract/unrecognized-statement` remains distinct because Markdown owns prose and structures, not TypeScript statement recognition.
- rule: Carrier-specific finding — `extract/misplaced-authoring` remains distinct because Markdown has no executable authoring-call surface.

## Example space
```gwt-vocabulary
Given the paired carrier probes named {probe:string}
When both carriers reify their probe
Then both carriers report the finding class {findingId:string}
Then the TypeScript carrier reports severity {typeScriptSeverity:"warning"|"error"} and extracts {typeScriptSpecs:number} specs
Then the Markdown carrier reports severity {markdownSeverity:"warning"|"error"} and extracts {markdownSpecs:number} specs
```

## Verification — executable
- Each same-class matrix row reports the same validator id from both carriers, with the specified severity and extraction outcome for each carrier; carrier-specific rows keep their distinct findings.

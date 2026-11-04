---
id: spec:carrier.markdown-authoring
kind: behavior
altitude: epic
readiness: ready
relations:
  dependsOn: spec:carrier.markdown-parser
  decidedBy:
    - spec:decisions.sdp-ts-extension
    - spec:decisions.carrier-ruling
---
# Markdown authoring enters the one graph

## Intent
- outcome: Author new Protocol Specs in Markdown without creating a second truth path.

## Behavior
- rule: Markdown and TypeScript carriers feed the same reification and graph-derivation path.
- rule: [#lineEndings] Whichever carrier writes them, the title, prose, entries and steps of a Spec or Pack hold no lone CR, U+2028 or U+2029, because a renderer that breaks a line there would show a line the carrier does not state; LF and CRLF are the only line endings. A Markdown carrier holding one anywhere is refused whole at that line, as `spec:carrier.envelope-contract` states, a Gherkin carrier as `spec:carrier.gherkin-authoring#rule.physicalLines` states, and a TypeScript Spec or Pack whose title, narrative, framing or section string holds one is not extracted.

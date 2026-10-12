---
id: spec:carrier.envelope-contract
kind: contract
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn:
    - spec:model.relation-reasons
    - spec:model.rule-keys
  constrainedBy: spec:validation.authored-honesty
  decidedBy: spec:decisions.envelope-grammar-posture
---
# The Markdown envelope is explicit and bounded

## Intent
- outcome: Make a Markdown Spec's identity and descriptors deterministic to reify.

## Contract
- A Markdown Spec declares id, kind, altitude, readiness, and relations in bounded YAML frontmatter; its first H1 declares title.
- The envelope key set is closed and every one of its five keys is required: a key outside the set is refused rather than absorbed, and a missing key refuses the document rather than being defaulted.
- Each relation type takes one target or a list; its target forms follow `spec:model.relation-reasons`, and an example's declared `verifies` may carry `exercises` under `spec:model.rule-keys`.
- `relations: {}` is written explicitly when the logical relation set is empty — honest carrier syntax, not a new logical requirement: the physical key catches a truncated envelope at reification while the model itself stays relation-optional.
- A derived name is never authorable in the envelope: a delivery-fact or graph-field key (`implemented`, `has-verifier`, `hasVerifier`, `observed`, `claim`, `deliveryFacts`, `nodeType`, `specKind`, `satisfies`, `verifies`, `belongsTo` or `models`) is refused as `extract/reserved-property`, because delivery facts are derived and never authored; `title` is refused as `extract/invalid-frontmatter`, and any other unknown envelope key as `extract/unrecognized-property`.
- The Protocol owns the envelope grammar and the parser policy while the pinned YAML library stays a swappable representation behind that contract, so an unsupported YAML construct is refused within explicit byte bounds on the carrier and its frontmatter rather than silently becoming carrier semantics.
- The bounds are 256 KiB per carrier, 32 KiB of frontmatter, 16 KiB per scalar, 2,000 YAML nodes, and a nesting depth of 16; YAML anchor (`&name`) and alias (`*name`) syntax and explicit YAML tags (`!tag`) are refused at any size.
- The frontmatter opens at byte zero with an exact `---` line and closes at the next exact `---` line; a byte-order mark, a `...` line in the frontmatter, a further exact `---` line in the body, a lone CR, or mixed LF and CRLF newlines refuses the carrier.

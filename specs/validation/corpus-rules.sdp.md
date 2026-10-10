---
id: spec:validation.corpus-rules
kind: behavior
altitude: feature
readiness: scoped
relations:
  dependsOn: spec:consumers.agent-surface
  constrainedBy: spec:validation.two-check-families
---
# Corpus-authored rules run on the one validation path

The original design let a team add its own rules beside the built-in validators, each with an id, a severity and the whole graph query API, run in the same pass and reported in the same output (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.5). The Protocol has two check families, conformance and honesty, and every validator belongs to one of them. The architectural annotation decision sends a corpus's own rules to the corpus's own gate.

The first adopter's gate shows what that costs. Its 363-line check script runs `sdp validate` and parses the summary line, then holds about ten rules of its own: context isolation over declared `uses`, entry addresses written outside the Specs resolved through recipe 25, no `dependsOn` cycle through recipe 26, every open question keyed, a prose mention allowed only with a listed reason, cited laws backed by `constrainedBy`, and the Pack pages current. To read kind, readiness and relations it parses the carriers' frontmatter with regular expressions, the second read model the agent surface warns against (`libar-platform/design/tools/check.py`).

## Intent
- problem: A corpus with rules of its own checks them off the one validation path, reading the carriers a second way and reporting in a form no Protocol surface reads.
- outcome: Let a corpus author its own graph rules and have their findings join the one validation report, so no corpus re-parses its carriers to check itself.

### Open questions
- [blocking #checkFamilies] The two-check-families law puts every validator in one of two families the Protocol owns. Do corpus rules join the report as a third family the corpus owns, or as findings outside the families, and does either keep the guardrail that checks police conformance and honesty, never content quality or workflow?
- [blocking #ruleTrust] A corpus rule is corpus code that `sdp validate` would run, while the agent surface tells an operator never to run a body taken from corpus content. On what terms does validation run corpus code: an explicit flag, a file the operator names, or never by default?
- [non-blocking #ruleSeverity] May a corpus rule fail validation, or are its findings always informative and the corpus's own gate decides?

## Behavior
- rule: A corpus rule is a graph body the corpus authors, given the bindings a recipe body gets, the reader, the raw graph and the report, and returning findings that each carry a rule id, a subject, a message and a severity.
- rule: A corpus rule reads the one derived graph and nothing else, so no rule reads a carrier, a source file or the network.
- rule: Each corpus finding names its rule and its corpus as its source and stands apart from the Protocol's own findings; the Protocol states none of these rules and ships none.
- rule: A corpus rule changes no node, edge or delivery fact; it reports on the graph it is given.

---
id: spec:validation.corpus-rules
kind: behavior
altitude: feature
readiness: defined
relations:
  dependsOn:
    - spec:consumers.agent-surface
    - target: spec:validation.diagnostic-rendering
      reason: corpus findings use the shared diagnostic currency
  constrainedBy: spec:validation.two-check-families
  decidedBy:
    target: spec:decisions.architectural-annotation
    reason: architecture checks remain the corpus's own rules
---
# Corpus-authored rules run on the one validation path

The original design let a team add its own rules beside the built-in validators, each with an id, a severity and the whole graph query API, run in the same pass and reported in the same output (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.5). The Protocol has two check families, conformance and honesty, and every validator belongs to one of them. The architectural annotation decision sends a corpus's own rules to the corpus's own gate.

The first adopter's gate runs `sdp validate` and parses its summary line, then checks its own context isolation, entry addresses, dependency cycles, question keys, prose mentions, cited laws and Pack pages. It also parses carrier frontmatter to read kind, readiness and relations, a second read model that a graph-based corpus-rule runner would remove.

## Intent
- problem: A corpus with rules of its own checks them off the one validation path, reading the carriers a second way and reporting in a form no Protocol surface reads.
- outcome: Let a corpus author its own graph rules and have their findings join the one validation report, so no corpus re-parses its carriers to check itself.

### Open questions
- [non-blocking #rulesRepresentation] Does an operator-named rules file hold one async body returning findings or a module exporting named rule functions, how are parameters supplied, in what order do several files run, and does `sdp validate --watch` rerun them?
  - decider: owner
  - provisional: one async body per file, given `g`, `graph`, `report` and `params`, with `params` from `sdp validate --params` and `{}` without it; files run in the order named, each to completion; a rule id is unique within its file; `sdp validate --watch` runs the same named rules each cycle
- [non-blocking #findingCurrency] What shape does a corpus finding take beside the one diagnostic currency, where does the report carry it, and does it reach the reader's `report` or the Design Review?
  - decider: owner
  - provisional: the shared finding contract has a corpus branch beside the Protocol branch, carrying the corpus, the rule id as `validatorId`, `subjectId`, severity and message and no family, collected as `corpusFindings` in the same report and rendered under a corpus-labelled section; Protocol findings, the summary line and the Design Review stay unchanged, as the frozen-projections decision requires
- [non-blocking #ruleIsolation] Does the runner enforce that a rule reads only the graph and changes nothing, or are both obligations on the rule's author?
  - decider: owner
  - provisional: changing nothing is a guarantee, with the Protocol's validators run first and each rule given a frozen or cloned graph; reading only the graph is the author's obligation, run with the trust `sdp q` asks and no sandbox

## Behavior
- rule: A corpus rule is a graph body the corpus authors, given `g`, `graph`, `report` and `params` as a recipe body is, and returning findings that each carry a rule id, a subject, a message and a severity.
- rule: A corpus rule reads the one derived graph and nothing else, so no rule reads a carrier, a source file or the network.
- rule: Each corpus finding names its rule and its corpus as its source and stands apart from the Protocol's own findings; the Protocol states none of these rules and ships none.
- rule: Corpus findings stand outside the conformance and honesty families, in a section of the report labelled as the corpus's own, so the two families keep their meaning and the guardrail that checks never judge content quality or workflow keeps binding the Protocol's own validators.
- rule: Validation runs corpus rules only from a file the operator names with `sdp validate --rules PATH`, which may repeat, and never from a file it finds in the corpus or in a configuration; it asks the trust `sdp q` already asks, to run code the operator chose.
- rule: A corpus finding carries severity `error` or `warning`. When the operator names `--rules`, an `error` corpus finding makes `sdp validate` exit nonzero and a `warning` stays informative; without `--rules` no corpus rule runs and only the Protocol's validators set the exit code.
- rule: Corpus findings keep their own source and report section, are tallied apart from the Protocol's summary line, and neither add to, suppress nor change a Protocol finding or the exit reason it sets.
- rule: A rules file that cannot load, a rule that throws, or a rule that returns a finding without a rule id, subject, message and admitted severity is a rule execution failure; `sdp validate` reports it in the corpus section and exits nonzero, so a broken rule never passes as a clean run.
- rule: A corpus rule changes no node, edge or delivery fact; it reports on the graph it is given.

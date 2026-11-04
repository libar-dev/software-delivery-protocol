# Reading answers

What an answer does not say, and the misreadings that turn a correct answer into a wrong
conclusion.

## Empty answers that mislead

An empty list or a zero is an answer, and some read as more than they say:

- `implementedBy: []` or `referencedBy: []`: no unit is bound, not that nothing is built.
- `verifiers: { total: 0 }`: no verifier is bound, not that nothing is tested.
- Recipe 1 lists ready, unimplemented Specs excluding examples and decisions. Recipe 33 applies the
  same exclusions at `defined`. An empty answer establishes absence only within that recipe's
  selection.
- `coverageUnknownFiles: []`: every changed file is recorded somewhere, not that every reach is
  known.
- `found: false`: the id is not in this graph; in an adopter, a Protocol id needs `--root`.
- `line: null`: the entry is not located, never absent.
- No findings: conformance and honesty hold, not that the design is right.
- `floorReached: "ready"`: the structural floor allows `ready`. Read `statedReadiness` separately
  to learn whether the author has stated it.
- A perspective that selects no member: read its `diagnostics` before reading the empty list as an
  empty concern.

## What not to do

- **Do not parse `.sdp.md` files to answer graph questions.** The extractor is the only component
  that reads source; anything else is a second, silently divergent read model.
- **Do not propose new query verbs.** Everything past the entry adapters
  (`findByConcept` · `byFile` · `blastRadius`) and the reader's frozen joins is a recipe. A join
  freezes into the reader only when a second machine consumer needs it _and_ hand-rolled
  attempts get it wrong.
- **Do not read `has-verifier` as "the tests pass."** It says a resolving verifier binding _exists_.
  Pass, fail, skip, and quarantine are CI's.
- **Do not read `implemented` as "it is live."** It says a code anchor binds to the Spec. Runtime
  evidence would be `observed`, the designed-and-deferred liveness fact the graph does not derive.
- **Do not read `references` as `implemented`.** A `references` edge says the code answers to
  the design, and nothing more. Only a resolving `satisfies` confers `implemented`; recipe
  27 keeps the two in separate columns.
- **Do not use raw `ready ∧ ¬implemented` as the operational backlog.** Under the example realization
  posture and the decision readiness posture it also includes ready example evidence and ready
  decision records; recipe 1 excludes both kinds, reports the excluded counts, and audits example
  verifier health without inventing inherited implementation.
- **Do not collapse the claim taxonomy.** `declared` is authored intent, `anchored` is a human
  binding from source, `inferred` is machine-derived structure. Carry the claim into your answer.
- **Do not treat stated readiness as derived readiness.** `statedReadiness` is the author's
  statement; `derivedReadiness` is the highest rung whose floor clauses pass. Report both when they
  disagree. A Spec carrying `floorNotEvaluated` has an unratified kind or altitude and no floor was
  evaluated: report it as not evaluated, never as below `idea` or as a rung nothing blocks.
- **Do not read narrowing from a field name.** Whether a refinement narrows a decision is that
  decision's own text or its relation's reason.
- **Do not author a delivery fact or a derived edge.** They are computed; writing one by hand is an
  honesty violation the checks will refuse.

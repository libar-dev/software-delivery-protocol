# Review 26. A whole-corpus refresh

> A session artifact, not a canonical doc. Its durable findings are folded into the Specs, the
> engine and the docs on the branch `review/spec-refresh` (plan 44); keep reading those for current
> truth. Measured at `46f0280`, the merge of PR 31. Re-run the recipes rather than inheriting a number.

## What was read

Every Spec in `specs/` (258 at the base), the engine under `src/`, the tests, the recipe catalog,
the three skills, `CONTEXT.md`, the concept docs and the decision registry. The corpus was split
into thirteen units: the eight Spec families (the consumers family in four parts), the unbuilt
surfaces (the Spec Studio and the Obsidian vault), the on-ramps and skills, the decisions, the
protocol and observation Specs with the Pack manifests and the engine's own anchors, the
vocabulary and concept docs, and the candidates for the next chunk of work.

Each unit was read twice, under two lenses:

- **Fidelity** (gpt-6-sol, xhigh): each rule, Design entry, contract entry and Model term against
  the code that realizes it and the tests that verify it.
- **Quality** (Opus 5.5, xhigh): each Spec against the other Specs, the vocabulary, the decisions
  and an outside reader; stale text, contradictions, readiness honesty, prose.

Every findings file was then verified by the other model family (Opus 5.5 for gpt-6-sol's,
gpt-6.1-sol for Opus's), each finding confirmed, adjusted or refuted on its own evidence. One
Opus 5.5 pass deduplicated the verified findings into issues and lanes.

## What it found

595 findings were verified. 59 were refuted; 513 held (86 confirmed as written, 412 adjusted, 15
raised by a verifier), and 23 were questions only the owner could settle. They deduplicated into
350 issues: 1 blocker, 91 major, 207 minor, 51 nit.

| Category | Held | What it covered |
| --- | --- | --- |
| stale | 100 | Specs still describing an earlier arc: old recipe behavior, deleted decisions, counts and plan numbers |
| prose | 86 | Unclear, dense or change-record wording |
| missing law | 74 | Behavior the engine enforces that no Spec states (YAML bounds, the English-only Gherkin dialect, the duplicate-ids backstop, stable validator ids) |
| owner question | 66 | Decisions only the owner can make |
| contradiction | 57 | Two homes stating one law differently |
| terminology | 33 | Rejected or unratified terms |
| binding | 28 | Anchors that claim more or less than their code does |
| drift in code | 21 | Code that breaks a promise its Spec makes |
| drift in a Spec | 20 | A Spec that promises what the engine does not do |
| verification | 15 | Verifiers that do not check what their example claims |

## What mattered most

- **A `ready` on-ramp taught superseded law.** `spec:consumers.authoring-on-ramp` still taught one
  realization target per anchor and the constant form only, both overtaken by the comment form and
  plural bindings (MD-36, MD-37). Its skill test passed because it only checked that words appear.
- **Two homes disagreed on joint realization.** The authoring skill read `satisfies` collectively;
  `spec:protocol.structural-self-binding` read it per unit. A strict per-unit reading would have
  moved most of the 32 Specs realized by several units into the build backlog. Ruled as R01.
- **Code that broke its own promises.** Gherkin fact and status lookalikes (`@status.ready`,
  `@implemented.foo`) passed as decoration; a duplicate target could confer `implemented` through
  a later node; anchored verification accepted any anchor namespace; the census and Design Review
  published error findings without the diagnostic label their Specs require; the Gherkin view
  dropped relation reasons silently; `sdp new spec` refused a lawful `.pack.sdp.md` Spec path.
- **Verifiers that did not verify.** The import round-trip test re-ran the emitter instead of
  checking the import result; the Pack parity probe carried no `modelRefs`; the contract-parity
  probe had no ordinary Scenario.
- **Plan 43's grammar never reached the older Specs.** The location table, register recipes,
  catalog, skills and Studio pages left out rule addresses, question fields and relation rows.
- **Unbuilt Specs stated as buildable.** Corpus rules, run evidence and example-space coverage were
  stated `defined` with no Design for their shapes; the Studio's Specs disagreed on page model,
  search and data embedding. Their open questions now carry provisional answers (posture P1).
- **The schema version stood still.** Plan 43 added graph fields at `0.9.0`, so the design diff
  could not tell what a base graph could express.

## Refuted, and worth knowing

- A claimed blocker that an off-claim CodeNode could confer `implemented` was refuted: the
  claim-separation check judges an edge by its own claim and endpoint types, which conferral reads
  exactly; the node's own claim is a separate finding.
- An inferred-claim contradiction between the impact graph and the curation report was refuted:
  neither glossary definition requires a per-edge claim field.

## Rulings

Made by the main thread on the owner's delegation, with advisers, and awaiting the owner's review.
The PR description's second rulings table lists each with its carrying Spec.

| Batch | Adviser | Scope |
| --- | --- | --- |
| R01 | Fable 5.1, gpt-6-astra | Joint realization is collective: the satisfying units together realize every promise; each realizes at least one |
| R02 | Fable 5.1 | The glossary: the one graph narrowed to the sole read model, marker ratified for the bracket prefix, eight terms added, police and provenance narrowed |
| R03 | gpt-6-astra | Engine contracts: schema `0.10.0`, Gherkin reserved heads, the imports exclude list, recipe 11's stated next rung, target-only relation objects accepted, summary-first recipes named |
| R04 | the main thread | The other owner questions, the two postures (questions for later design passes; delete over defer), and the delegated readiness statements |

## Where the findings landed

Eighteen lanes applied the issues, each in its own worktree, each followed by a review from the
other model family and a fix pass. An integration pass landed the cross-lane handoffs, and a PINS
pass re-transcribed the self-hosting oracle from the carriers. A final four-reader review of the
whole branch (engine, law, docs, rulings), cross-verified, found 16 small defects, all fixed; among
them a recipe-40 input guard, an overbroad keyed rule, the `references` definition in three homes,
and three promises of `spec:model.open-question-keys` that no satisfying unit realized.

Plan 44 is the lineage pointer. The graph carries the outcome: the issues are fixed in the Specs,
the engine and the docs; the questions the review raised for unbuilt Specs are keyed open
questions with `decider: owner` and a provisional answer (recipe 20).

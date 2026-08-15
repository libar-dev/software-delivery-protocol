# Universal Spec carriers, runnable modules, projections, and structural anchors

This PR executes plan 31 and closes its independent Mixture-of-Agents review through plans 32 and
33. Briefs A–D are delivered; every adjudicated finding is resolved. Brief E remains deliberately
outside this branch, with its re-entry condition now satisfied.

## What lands

- **Honest carrier universality.** Gherkin remains a lawful per-ID carrier for `behavior` and
  `example`; Markdown remains the default and carries the other six kinds. A generated,
  visibly-lossy Gherkin-shaped read projection covers every Spec without pretending to be a
  carrier or lossless codec.
- **Derived runnable modules.** Generated registrars own mechanical registration, step dispatch,
  three-way comparison, and failure rendering. The authored valid-cart tracer keeps only five
  semantic adapters. A scenario invokes the product once; the oracle is evaluated lazily at the
  first `Then`; incomplete points refuse comparison without calling it; bound `unspecified`
  outcomes redden.
- **Four certified projections.** Design Review, census, Mermaid, and Gherkin publish through
  independent public verbs. Repository generation/check scripts certify all four roots together,
  preserve diagnostic projections on validation errors, and return the validation exit code.
- **Structural anchors.** `component` and `uses` add closed, intent-free structural edges. Dangling
  targets remain graph-visible errors without erasing the anchor's independent `satisfies` edge or
  its `implemented` delivery fact.
- **Falsifiable registrar adoption.** A versioned sorted manifest reconciles sibling registrars;
  publication stages and cleans the complete known set. `--check-clean` compares manifest and
  sibling bytes, while preflight independently checks tracked adopted bytes in both the worktree
  and Git index.

## Ratified decisions

- MD-29 — the carrier universality bound.
- MD-30 — structural anchors confer nothing.
- MD-31 — adopted registrars are committed.

Runnable modules, census, Mermaid, and Gherkin view now all state and derive `ready` with resolving
implementation and verifier bindings. The generated graph reports 156 Specs, 1 Pack, 146 anchors,
303 nodes, 571 edges, and zero extraction or validation findings. The operational build backlog is
empty; the drift alarm fell from 11 to 8 by removing the three promoted projection Specs.

## Review closure and verification

The five-agent review produced twenty adjudicated findings, preserved as the durable review brief
in `plans/32-universal-spec-review-followup-briefs.md`. Plan 33 implements all of them, including
optional polish, without reopening the plan-31 rulings or brief E.

The follow-up implementation review re-measured all twenty closures against the tree. Its sole
residual honesty note is closed: Mermaid and Gherkin indexes now visibly label projections of a
graph with validation errors as diagnostic while their commands return nonzero.

`npm run check` passed twice consecutively on the final implementation: both typechecks, 827 tests
(plus one intentional skip), all self-hosting and checkout generation/check legs, current-plan
discovery, and clean-room preflight. The adopted registrar was regenerated and staged before the
gate, so the index-byte comparison certified the bytes proposed by this PR.

## Upcoming work

1. **Brief E — the agent surface:** diff-to-at-risk recipes, write ergonomics, and the bounded MCP
   amendment attempt.
2. **Deferred registrar adoption:** 30 self-hosting families remain explicit deferrals; adoption is
   a per-family follow-on, not implied by emission.
3. **Protocol-side structural bindings:** author useful `component`/`uses` edges now that the
   vocabulary, validation, queries, and census surface exist.
4. **Remaining brief-C candidates:** reference projection, context bundle, and Spec Studio.

Still refused here: a default-carrier flip, Gherkin mappings for dishonest kinds, DocStrings and
DataTables, Gherkin Packs, an `implements` slot, engine-side execution of adopter code, Scenario
Outlines, or re-specifying the shipped Design Review.

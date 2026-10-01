# Plan 39. The first-adopter arc

> **Status:** 🧭 DRAFTED. A thin lineage pointer in the plan-38 shape, not a briefs index. The
> arc's forward intent is authored as sub-ready Specs in the corpus, and the backlog and
> readiness are read from the graph (recipes 1, 9, 11). If this file and the graph disagree, the
> graph wins and this file is stale.

## Why this arc

`application-platform` is the first corpus outside this repository to use the Protocol hard: 168
Specs of design with no code, written by parallel work packages and reviewed for three rounds.
One reader analysed that work and wrote eight proposals (P1 to P8) for the Protocol. The report
is `docs/sdp-development-from-application-platform.md` in the `application-platform` repository,
commit `497a642`, written 2026-10-01 against this repository at `25d24f2`.

The report's main point is that the adopter leans on the parts of the Protocol that the
Protocol's own corpus barely uses. Its design lives in open `Design` sections, 380 of its 492
dependency edges are `constrainedBy` or `decidedBy`, and it has no test anchors yet. This arc
turns that evidence into Specs.

## The arc's intent lives in the graph

Authored for this arc, with the proposal each one answers.

Stated without a blocking question. Their floors clear `ready`; what remains is the human
statement, and for a decision record its registry row:

- `spec:carrier.markdown-body-grammar` (P1). The body grammar the parser enforces, written down,
  with twelve refusal examples bound to the parser through
  `test/self-hosting-markdown-grammar.test.ts`, each pinned to the finding, its message, and the
  line of the construct. The parent and its twelve children are the arc's Specs that already
  carry `has-verifier`.
- `spec:carrier.inline-code-spans` (P2). A code span is content, so a generic is not HTML.
- `spec:validation.typed-dependency-floor` (P3). The `ready` floor reads all four typed
  dependencies, at a uniform `defined` threshold.
- `spec:validation.unbound-example-posture` (P4). An unbound example below `ready` is data, and
  the worked example teaches the incomplete trace through its bindings.
- `spec:consumers.adopter-on-ramp` (P5). The skills teach the ruled home for a deferral, an
  unsettled fact, a pending ruling, a probe, and a count, and `--help` points at the skills, the
  catalog, and `specs/`.
- `spec:consumers.agent-surface.register-recipes` (P5, and P6 step 1). Four catalog recipes.
- `spec:consumers.shipped-protocol-corpus` (P5). The package ships `specs/`, and the CLI points
  at them for the adopter that already has them on disk.
Held by a question the owner has not answered, carried as a blocking open question on the Spec:

- `spec:extraction.open-section-order` (P7, first half). Authored order of `design`, `ui`, and
  `model` terms survives serialization and the Design Review's key order, an ordinary revision
  with a schema bump. Open: an integer-like Model term or TypeScript key already loses its place
  in the in-memory object, so either those keys are refused or the representation becomes a
  list.
- `spec:decisions.checked-mentions` (P6 step 2). The ruling on MD-10 and on the `#` sub-part is
  written. Open: a key may repeat across Design and UI, so the address needs the section or the
  carrier refuses the repeat; and `#` is already lawful inside a complete Spec id, so precedence
  needs a rule. It shapes `spec:validation.prose-mentions`, which carries its own blocking
  question naming ratification as the trigger.
- `spec:decisions.authored-entry-order` (P7, second half). Rendering open-section entries as a
  list changes a stated rule of the Design Review, so on ratification it declares `supersedes`
  on the shipped-projections freeze (MD-32); the draft declares `dependsOn` so the graph never
  reads a landed supersession. The question is when to reopen the freeze.

Deferred, with its re-entry triggers as blocking open questions:

- `spec:extraction.contract-declarations` (P8).

Readiness and backlog for all of the above are read from the graph, never from this file. These
facts are advisory selection pressure, not authorization and not a sequence.

## Rulings made at capture

The adopter read the drafted arc against this tree and returned five rulings, which the owner
forwarded. Each is written into its Spec; this list only says where it landed.

- Checked mentions apply the content-only sections ruling (MD-10) rather than contradicting it,
  and a keyed `design` or `ui` entry is the first meaning of the id sub-part. Unkeyed bullets
  have no address, and positional addresses are refused. On `spec:decisions.checked-mentions`.
- Authored order is content for `design`, `ui`, and `model` terms, and the serializer's
  permutation invariance is given up because the lower-camel key rule already removes the
  nondeterminism it guarded against. The record split: order is an ordinary revision
  (`spec:extraction.open-section-order`), list rendering needs the superseding record
  (`spec:decisions.authored-entry-order`).
- The typed-dependency threshold is a uniform `defined`, so a design can state `ready` while the
  decisions that shape it stay proposals. On `spec:validation.typed-dependency-floor`.
- The worked example teaches the unbound trace through its bindings, not a warning. On
  `spec:validation.unbound-example-posture`.
- One constraint entry per Spec is the law, and the TypeScript model's list shape aligns to it.
  On `spec:carrier.markdown-body-grammar`, as a non-blocking question rather than a rule: both
  read-only reviewers below contest it, and the revision has not landed.

Three `ready` parents now carry a non-blocking question naming the child that revises one of
their sentences: `spec:validation.readiness-floor`, `spec:validation.verification-linkage`, and
`spec:carrier.markdown-parser`. The implementing commit edits parent and child together.

## The two read-only reviews of the capture commit

The capture commit (`11494af`) was reviewed read-only by two GPT models through the Codex
runtime, same brief, goals and decision criteria only: `gpt-6-astra` at high (7 minutes 8
seconds) and `gpt-6.1-sol` at high (12 minutes 39 seconds). Both retained the commit as a
checkpoint and refused it as implementation instructions. Their overlap was large: both found
the grammar Spec overstating the parser (suggestion only within edit distance two, HTML not
scanned in the H1 or fence steps and needing a closing `>`, Example space accepting leading
prose, `uses` and `memberOf` not in the reserved set), the entry address ambiguous across
Design and UI and colliding with a lawful `#` in a Spec id, the authored-order justification
false for integer-like Model terms and TypeScript keys, the constraint-cardinality sentence
presenting a ruling as realized law, the refusal assertions matching too loosely, the on-ramp
misusing the glossary's `probe`, and the plan's stale lines. Each caught something the other did
not: astra the Model table's own sort in `renderModel`, the parent-gap overstatement in the
unbound-example posture, and the `ready` floor's `refines` clause on children of a deferred
parent; sol the missing graph-visible hold on `spec:validation.prose-mentions` and the P8 scope
narrowed in silence. Every claim about the engine was re-checked against the tree before the
fix; all held. The fixes are in the commit after the capture. What the reviewers disagree with
in the rulings sits on the Specs as open questions, so the owner reads it there.

## What was re-measured at capture

The report says it ran no test and changed no file here. Its source claims were checked against
this tree at `25d24f2` before anything was authored. All of them hold. Four findings add to it.

- **Why open-section keys are sorted.** The report could not find the reason (its appendix C).
  It is in `plans/17b-self-hosting-sessions-1-4.md`: dynamic `model.terms`, `design`, and `ui`
  keys sort by code unit so that permuting property order through both carriers yields
  byte-identical graphs. Slice 1 had said the opposite, that section content preserves authored
  order (`plans/06-slice1-extractor.md`). So P7 is not drift repair. It reverses a deliberate
  rule that no Spec carries; after the adopter's ruling the order half is an ordinary rule
  revision and only the list rendering is a decision.
- **A third HTML guard.** The report names two sites for the raw-HTML refusal. Pack framing
  prose has a third, in `src/extract/markdown-pack.ts`.
- **The worked example pins the P4 warning.** `examples/checkout-v1` keeps one unbound example
  at `defined`, and its README and `check:example` treat the warning as the teaching signal.
  P4 changes that corpus, not only the adopter's.
- **Mentions in this corpus.** The report's mention body, run here, finds 13 prose mentions, 9
  with no declared relation across 7 Specs, and one id-shaped string that does not resolve (the
  decisions-family pattern in `spec:model.stable-ids`). Re-run it rather than inheriting these.

Two more checks, both run in a scratch directory. A root inside `node_modules` derives its own
carriers, and an adopter root never descends into `node_modules`. And the wider floor clause of
P3 fails no `ready` Spec in this corpus.

## Outside this arc

The report rejects thirteen ideas and names nine things that belong to the adopter. They are the
report's judgments, kept here as evidence. None is a Protocol ruling, and none mints a Spec.

Rejected by the report: relations to external documents and a source-coverage check, citation
aliases on the envelope, an evidence-status field, a second level of blocking, review findings
or a ledger in the Protocol, a named-recipe flag on `sdp q`, labels on Specs, a notation for
quantities, a grammar for constraint targets, table syntax for sibling examples, continuation
lines for bullets, an index-usage check, and a typed step-sequence section.

Left with the adopter: the review protocol, the policy on who states `ready`, citation tokens,
the bullet-level extension marker, Convex correctness, architecture judgment, the arithmetic of
limits, the README narrative, and session budgeting.

Two of these already have a ruled home here. A named-recipe flag is a query verb, which the
agent front door (MD-22) refuses. Labels on Specs are an open tag vocabulary, which the
architectural-significance ruling (MD-34) refuses.

## Re-measuring on the adopter corpus

The report gives an acceptance test per proposal, each a command on the adopter's corpus. The
ones this arc can move:

- P2: the adopter's Unicode angle brackets become real ones and validate stays clean.
- P3: its three assumed facts state `scoped`, and readiness divergence (recipe 7) names any of
  their eleven dependents that states `ready`.
- P4: validate prints no warning on a corpus with no test anchors.
- P5: its census sentence, open-question table, and extension register come from commands.

The adopter also said what it needs first, as it opens its eight fix units. This is evidence
about one consumer's pressure, not a sequence this plan authors: P2 before its first fix unit, so
fixes are written as pasteable TypeScript; P4 before P6 step 2, so mention warnings never join
the verifies warnings; P3 before the fix unit that touches its fact Specs; the mention recipe
now, so delta review scope is right in its next round; the order half of P7 before anyone reads
its fixed corpus; and P6 step 2 and P8 after that round.

## Discipline (unchanged)

Plan and execution stay separate. `npm run check` runs before any green claim. Readiness
promotion is a human statement after recipe 9. Checks police conformance and honesty, never
content quality and never workflow. Close records re-derive their numbers and label them as
re-derived.

# Plan 39. The first-adopter arc

> **Status:** 🧭 DRAFTED. A thin lineage pointer in the plan-38 shape, not a briefs index. Six of
> the arc's Specs are implemented with bound evidence and, with the verified body grammar, wait
> for the owner to state `ready`; five stay held by owner questions. The backlog and readiness are
> read from the graph (recipes 1, 2, 9, 11). If this file and the graph disagree, the graph wins
> and this file is stale.

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

Authored for this arc, with the proposal each one answers. Where each Spec stands is read from
the graph: the drift alarm (recipe 2), promotion preflight (recipe 9), and the lower ladder
(recipe 11).

Implemented with bound evidence: bound examples for the three engine changes, direct test anchors
for the three consumer Specs. Each states `defined`, derives `ready`, and carries `implemented` and
`has-verifier`, so the drift alarm names it until the owner states `ready`:

- `spec:carrier.inline-code-spans` (P2, `839709d`). A code span is content, so a generic is not
  HTML.
- `spec:validation.unbound-example-posture` (P4, `7b5fd68`). An unbound example below `ready` is
  data, and the worked example teaches the incomplete trace through its bindings.
- `spec:validation.typed-dependency-floor` (P3, `3561396`). The `ready` floor reads all four typed
  dependencies, at a uniform `defined` threshold.
- `spec:consumers.agent-surface.register-recipes` (P5, and P6 step 1),
  `spec:consumers.adopter-on-ramp` (P5), and `spec:consumers.shipped-protocol-corpus` (P5), built
  from one design in `728e3e5`. Recipes 20 to 23; skills that teach the ruled home for what an
  adopter would otherwise track by hand, with `--help` pointing at the skills, the catalog, the
  glossary, and `specs/`; and a package that ships `specs/` and `CONTEXT.md`.

Review findings on these units were folded in by the `test` and `fix` commits that follow them on
the branch. Each of the three engine commits also moved the sentence its Spec revised in a `ready`
parent, and removed the non-blocking question on that parent that named the child:
`spec:validation.readiness-floor`, `spec:validation.verification-linkage`, and
`spec:carrier.markdown-parser`.

Verified and waiting for the same statement:

- `spec:carrier.markdown-body-grammar` (P1). The body grammar the parser enforces, written down,
  with thirteen refusal examples bound to the parser through
  `test/self-hosting-markdown-grammar.test.ts`, each pinned to the finding, its message, and the
  line of the construct. It carries `has-verifier`.

The bound examples under these Specs also state `defined` and derive `ready`. Stating `ready` is
the owner's act, and this plan states it for none of them.

Held by a question the owner has not answered, carried as a blocking open question on the Spec.
The execution did not touch these:

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

The execution added two non-blocking questions on `spec:carrier.inline-code-spans`: a span that
crosses a line ending, and two places where the scanner reads differently from CommonMark. The
open-question register (recipe 20) lists them with every other open question in the corpus.

Readiness and backlog for all of the above are read from the graph, never from this file. These
facts are advisory selection pressure, not authorization and not a sequence.

## For the owner, not on a Spec

Facts and questions the execution surfaced that no Spec carries. None is ruled here.

- The package now ships `CONTEXT.md` and `specs/`. The rule that it ships the glossary was added
  to `spec:consumers.shipped-protocol-corpus` provisionally. Does it belong there?
- `spec:consumers.adopter-on-ramp` gained `dependsOn` on the register-recipes Spec and the
  shipped-corpus Spec.
- The recipe names "entry search" and "dependency footing" were kept, against a review that
  proposed plainer names.
- `mention` is a candidate term, waiting on `spec:decisions.checked-mentions`. The shipped skills
  and catalog already use it.
- A TypeScript carrier admits a malformed open-questions value without a finding. Recipe 20
  reports it instead of throwing; extraction is unchanged. Should extraction refuse it?
- `refines` and `dependsOn` are accepted as plain Design keys and create no edge. Should the
  carrier refuse a relation name as a key?
- Recipe 9 reports the current floor only, so it does not name what blocks the next rung. Recipe
  21 shows what a Spec rests on.
- The shipped glossary's pointers to `docs/concept/` and `src/ids.ts` are now marked as
  source-checkout only. Package readers reach `ref()`'s limit through
  `spec:decisions.carried-evidence`.

## How it was built

One Claude main thread orchestrated. `gpt-6.1-sol` implemented each unit and folded in the
findings; `gpt-6-astra` scouted, reviewed engine behavior per unit, and reviewed the arc. A Fable
agent designed the recipes, help text, and skill text before implementation, and Opus agents
reviewed and wrote the agent-facing prose. Every unit passed `npm run check` before the next
began. The method record lives outside this repository, in
`~/dev-libar/gpt-models-from-the-claude-main-thread.md`.

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

## The three read-only reviews of the capture

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

A third review, Codex's adversarial reviewer on its default model, read the whole branch against main after the fixes and found two more: the grammar let both the primary behavior heading and Example space carry leading prose while the parser maps both to one description and refuses the second, and the list-rendering decision assumed string values while the TypeScript carrier admits nested ones. Both are fixed in the commit after the review fixes: the grammar states the shared owner and a thirteenth bound example pins the refusal, and the decision defines the rendering of every lawful value shape.

## What was re-measured at capture

The report says it ran no test and changed no file here. Its source claims were checked against
this tree at `25d24f2` before anything was authored. All of them held. Four findings added to it.

- **Why open-section keys are sorted.** The report could not find the reason (its appendix C).
  It is in `plans/17b-self-hosting-sessions-1-4.md`: dynamic `model.terms`, `design`, and `ui`
  keys sort by code unit so that permuting property order through both carriers yields
  byte-identical graphs. Slice 1 had said the opposite, that section content preserves authored
  order (`plans/06-slice1-extractor.md`). So P7 is not drift repair. It reverses a deliberate
  rule that no Spec carries; after the adopter's ruling the order half is an ordinary rule
  revision and only the list rendering is a decision.
- **A third HTML guard.** The report names two sites for the raw-HTML refusal. Pack framing
  prose has a third, in `src/extract/markdown-pack.ts`.
- **The worked example pinned the P4 warning.** At capture, `examples/checkout-v1` kept one
  unbound example at `defined`, and its README and `check:example` treated the warning as the
  teaching signal, so P4 had to change that corpus too. `7b5fd68` did: the example now validates
  with no warning and teaches the trace through its verifier bindings.
- **Mentions in this corpus.** The report's mention body, run here, found 13 prose mentions, 9
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

The report gives an acceptance test per proposal, each a command on the adopter's corpus at
`497a642`. The ones this arc moved were re-measured in this session with the engine at
`4cf0b5a`. Re-run them rather than inheriting these results.

- P2 (`839709d`): a scratch copy of the corpus with every Unicode angle bracket replaced by a real
  one validates with zero errors and zero warnings.
- P3 (`3561396`): in a scratch copy with its three assumed facts held at `scoped`, the eleven Specs
  bounded by them through `constrainedBy` stop deriving `ready`. When those eleven state `ready`,
  readiness divergence (recipe 7) names all eleven, each failing
  `typed-dependency-targets-are-defined`.
- P4 (`7b5fd68`): validate prints no warning. Its `verifies-linkage` warnings went from 54 with
  the engine before `7b5fd68` to 0.
- P5 and P6 step 1 (`728e3e5`): recipes 20 to 23 run on its corpus.

The adopter also said what it needs first, as it opens its eight fix units. This is evidence
about one consumer's pressure, not a sequence this plan authors: P2 before its first fix unit, so
fixes are written as pasteable TypeScript; P4 before P6 step 2, so mention warnings never join
the verifies warnings; P3 before the fix unit that touches its fact Specs; the mention recipe
now, so delta review scope is right in its next round; the order half of P7 before anyone reads
its fixed corpus; and P6 step 2 and P8 after that round. P2, P3, P4, and the mention recipe have
landed; the rest are the held Specs above.

## Discipline (unchanged)

Plan and execution stay separate. `npm run check` runs before any green claim. Readiness
promotion is a human statement after recipe 9. Checks police conformance and honesty, never
content quality and never workflow. Close records re-derive their numbers and label them as
re-derived.

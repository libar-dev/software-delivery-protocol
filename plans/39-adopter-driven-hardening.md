# Plan 39. The first-adopter arc

> **Status:** 🧭 DRAFTED. A thin lineage pointer in the plan-38 shape, not a briefs index. Six of
> the arc's Specs are implemented with bound evidence and, with the verified body grammar, wait
> for the owner to state `ready`. The entry-address engine is built: of the four Specs the owner
> ruled, the prose-mentions validator and the open-section order carry `implemented` and wait for
> the same statement, and the checked-mentions decision and contract declarations need no engine
> binding. One Spec stays held by an owner question. The backlog and readiness are read from the
> graph (recipes 1, 2, 9, 11). If this file and the graph disagree, the graph wins and this file
> is stale.

## Why this arc

The first adopter's design corpus is where the Protocol was first used hard outside this repository:
168 Specs of design with no code, written by parallel work packages and reviewed for three rounds.
One reader analysed that work and wrote eight proposals (P1 to P8) for the Protocol. The report
lives under `docs/` in the adopter's repository at commit `497a642`, written 2026-10-01 against this
repository at `25d24f2`.

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

Ruled by the owner, with the Spec text applied in `30e19b4` and the engine built after it (see
"The entry-address engine" below). Each states `defined`, derives `ready`, and waits for the
owner's `ready` statement. The validator and the order law carry `implemented`; the decision and
the contract declarations carry no delivery fact:

- `spec:decisions.checked-mentions` (P6 step 2). The entry address carries the section, `#` is
  reserved for it in every namespace, and a declared relation in either direction backs a mention.
  Its glossary question stays non-blocking.
- `spec:validation.prose-mentions`. The validator the decision shapes: one warning per
  mentioning-Spec and target pair, and errors for a malformed token, a missing Spec, or a missing
  entry.
- `spec:extraction.open-section-order` (P7, first half). Authored key order of `design`, `ui`,
  and `model` terms becomes part of the graph contract at schema `0.6.0`. Integer-like keys are
  refused and the object representation stays.
- `spec:extraction.contract-declarations` (P8). Deferred at `idea` until its re-entry trigger fired
  on the first adopter's evidence, then moved to `scoped` by `03ce88e` with five rules on the
  declaration shape. Item B below was ruled into its sixth rule: the adopter emits the derived
  module from the pinned declarations list (recipe 24) with its own preamble until a second
  adopter needs the same one, and the module earns its place only when a changed pinned signature
  fails the adopter's typecheck against its implementation.

Still held by a question the owner has not answered, carried as a blocking open question on the
Spec:

- `spec:decisions.authored-entry-order` (P7, second half). Rendering open-section entries as a
  list changes a stated rule of the Design Review, so on ratification it declares `supersedes`
  on the shipped-projections freeze (MD-32); the draft declares `dependsOn` so the graph never
  reads a landed supersession. The question is when to reopen the freeze.

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

The design-stubs session put six questions to the owner, each with two readings in
`design-design-stubs.md`, which is kept in the owner's context repository, outside this one. The
owner ruled all six on the lean.

- A. Asked what `ready` demands of an element's code, the owner ruled that the Protocol's floor
  reports bindings and never demands them, and the adopter's own gate requires them.
- B. Asked who owns the derived declarations module and its preamble, the owner ruled that the
  adopter emits it with its own preamble until a second adopter needs the same one, now the sixth
  rule of `spec:extraction.contract-declarations`.
- C. Asked how an entry address tells a Design key from a UI key, the owner ruled that the address
  carries the section, as in `spec:<id>#design.<key>` and `spec:<id>#ui.<key>`.
- D. Asked what happens to a `#` in a Spec id once the address exists, the owner ruled that `#` is
  reserved for the entry address in every namespace and refused in every id slot.
- E. Asked how integer-like keys keep authored order, the owner ruled that Model terms and
  TypeScript open sections refuse them, the object representation stays, and authored key order
  becomes part of the graph contract.
- F. Asked whether an advisor may state `ready` on a `decision` Spec by delegation, the owner ruled
  that it may not; `ready` stays a human's statement.
- The five further items in `design-entry-address.md`, also kept in the owner's context repository,
  were ruled on the lean, with two corrections from an outside read: mention warnings aggregate per
  mentioning-Spec and target pair, and the second blocking question on
  `spec:extraction.contract-declarations` became non-blocking because its rules refuse the closed
  section it asked about.

## How it was built

One orchestrating thread ran the arc. The implementer built each unit and folded in the findings.
The behavior reviewer scouted, reviewed engine behavior per unit, and reviewed the arc. A design
agent designed the recipes, help text, and skill text before implementation, and editing agents
reviewed and wrote the agent-facing prose. Every unit passed `npm run check` before the next
began. The method record is a guide kept in the owner's context repository, outside this one.

## The design-stubs session

A design brief asked where a Spec carries the design of an architecturally significant element,
rung by rung. The answer is `design-design-stubs.md`, kept beside the brief in the owner's context
repository. Three commits followed from it.

- `03ce88e` moved `spec:extraction.contract-declarations` from `idea` to `scoped`, with five rules
  on the declaration shape.
- `5d66299` added recipe 24, pinned declarations, under a new rule of
  `spec:consumers.agent-surface.register-recipes`.
- `b4fe056` folded in the two unit reviews.

Two review lanes, the mechanics reviewer and the behavior reviewer, found one defect in the
recipe body, five mutations the tests let survive, and four Spec sentences that said more
than the evidence.

A second design pass took the leans of items C, D, and E as labelled assumptions and wrote
`design-entry-address.md` in the owner's context repository, with a proven patch to three held Specs
and two glossary candidates. Nothing from it is applied. It waits for the owner's answers.

The owner then ruled on items A to F and on the design's five further items, listed under "For the
owner, not on a Spec", and `30e19b4` applied the revised Spec text. Read from the graph (recipes 9
and 11), `spec:decisions.checked-mentions`, `spec:validation.prose-mentions`,
`spec:extraction.open-section-order`, and `spec:extraction.contract-declarations` now state
`defined` and derive `ready` with no delivery fact, and `spec:decisions.authored-entry-order` stays
`scoped` behind its blocking question on the shipped-projections freeze. Recipe 1 returns an empty
backlog because none of the four states `ready`, so the next implementation unit is the engine work
in the design's "Implementation units" section, units 1 to 5, with units 6 to 8 after them.

## The entry-address engine

Four lanes built the design's engine units in parallel worktrees, and one integrator cherry-picked
their commits onto this branch in unit order. Each new example states `defined`.

- `b806094` "feat(model): reserve # for the entry address in every namespace" and `b8b6a0f`
  "feat(extraction): refuse an entry address in every id slot" realize the reservation that
  `spec:decisions.checked-mentions` rules. `spec:model.stable-ids` names the address in its rule
  and binds the refusal example `spec:model.stable-ids.unsectioned-address-refused`.
- `e8b8590` "feat(carrier): refuse integer-like keys in Model terms and TypeScript open sections"
  and `6b86c67` "feat(extraction): keep authored entry order and move the schema to 0.6.0" realize
  `spec:extraction.open-section-order`. The body grammar binds the refusal example
  `spec:carrier.markdown-body-grammar.integer-term-refused`, and `spec:extraction.derive-graph`
  states the order rule.
- `9952e9e` "feat(validation): check prose mentions and their entry addresses" realizes
  `spec:validation.prose-mentions`.
- `38a250a` "feat(consumers): teach recipes 22 and 23 the entry address" brings both recipes to the
  validator's grammar under `spec:consumers.agent-surface.register-recipes`.
- `44e0c04` "test(self-hosting): re-derive the pins across the entry-address units" regenerates
  the warning pin and totals from the integrated graph.

`spec:validation.prose-mentions` and `spec:extraction.open-section-order` now carry `implemented`
and `has-verifier` while they state `defined`, so the drift alarm (recipe 2) names them until the
owner states `ready`. Their verifiers are the test anchors `test:protocol.prose-mentions` and
`test:protocol.open-section-order`. The self-hosting run now reports one prose-mention warning per
pair that recipe 22 lists as `unbacked`, beside the pinned honesty gaps.

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

Two read-only reviewers read the capture commit (`11494af`) from the same brief, which gave goals
and decision criteria only. Both retained the commit as a checkpoint and refused it as
implementation instructions. Their overlap was large: both found the grammar Spec overstating the
parser (suggestion only within edit distance two, HTML not scanned in the H1 or fence steps and
needing a closing `>`, Example space accepting leading prose, `uses` and `memberOf` not in the
reserved set), the entry address ambiguous across Design and UI and colliding with a lawful `#` in a
Spec id, the authored-order justification false for integer-like Model terms and TypeScript keys,
the constraint-cardinality sentence presenting a ruling as realized law, the refusal assertions
matching too loosely, the on-ramp misusing the glossary's `probe`, and the plan's stale lines. Each
caught something the other did not. The first caught the Model table's own sort in `renderModel`,
the parent-gap overstatement in the unbound-example posture, and the `ready` floor's `refines`
clause on children of a deferred parent. The second caught the missing graph-visible hold on
`spec:validation.prose-mentions` and the P8 scope narrowed in silence. Every claim about the engine
was re-checked against the tree before the fix; all held. The fixes are in the commit after the
capture. What the reviewers disagree with in the rulings sits on the Specs as open questions, so the
owner reads it there.

A third, adversarial reviewer read the whole branch against main after the fixes and found two more: the grammar let both the primary behavior heading and Example space carry leading prose while the parser maps both to one description and refuses the second, and the list-rendering decision assumed string values while the TypeScript carrier admits nested ones. Both are fixed in the commit after the review fixes: the grammar states the shared owner and a thirteenth bound example pins the refusal, and the decision defines the rendering of every lawful value shape.

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

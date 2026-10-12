# Plan 43. Design iteration on a readable graph

> **Status:** DRAFTED on `feature/design-iteration-v0`, branched from `feature/design-management-v0`
> at `bc2c84e`, PR 30's head, which `main` merged as `0353f10`. A thin lineage
> pointer: the arc's intent lives in `pack:design-iteration-v1`, and readiness, backlog and open
> questions are read from the graph (recipes 1, 9, 11, 20, 29), never from this file. If this file
> and the graph disagree, the graph wins and this file is stale.

## Why

Three inputs, read on 2026-10-12, after plan 41's fold.

- **A usability trial of the agent surface.** gpt-6.1-sol, Opus 5.5 and gpt-6-astra answered the
  same thirteen delivery questions from the skills and `sdp q` alone. All three answered every
  task correctly without opening a carrier, and all three stumbled in the same places: oversized
  answers, terse misses, two meanings of the next rung, rules with no address, a missing design
  backlog, and a recipe label each repeated as fact though it overstated the relation it read.
  Evidence: `.omo/evidence/agent-surface-trial/`.
- **A review of gen 1** (`@libar-dev/architect`). Its sound ideas, badly built: curation help from
  file-level imports, proof per rule, a slimming rule after implementation, and skill doctrine.
- **The owner's rulings** on a nine-card sheet: plan 43's scope as one follow-up PR; the order 43,
  then the Studio (plan 42); a file-level curation layer before symbol identity; rule-grain proof
  through a checked field; `supersedes` kept but parked, with replaced decisions deleted by default
  before the first release; the slimming rule; a re-entry trigger field; recipe 31 named after the
  relation it reads; and `spec:decisions.studio-web-components` ratified (MD-42). The owner's
  direction with them: fewer, larger PRs, because one developer works with capable models, and the
  first adopter's Application Platform redesign is the large design the arc is tested on.

## What this arc builds

Each item is carried by a Spec in `pack:design-iteration-v1`; the owner states `ready` on each
before its lane builds it.

1. **Answers that fit** (`spec:consumers.agent-surface.answer-shapes`). Summary-first recipes 4 and
   29 with a `detail` parameter; recipe 3 returns guarantee text; recipe 8 reports its exemptions;
   recipe 9 reports both next rungs; recipe 25 explains a miss and lists the keys that exist;
   recipe 31 reports `refines` and `refinedBy`; recipe 32 tallies same-layer edges; a design-backlog
   recipe; a catalog index and the wrap-and-filter idiom; parse errors with line and column.
2. **An authoring grammar for iteration.** Rule keys on every entry of the primary behavior owner,
   with rule lines in the location table and an example's checked field naming the rule keys it
   exercises (`spec:model.rule-keys`). Question fields `decider`, `links`, `provisional` and
   `trigger` as labelled sub-items (`spec:model.open-question-fields`). Relation reasons as an
   object per target (`spec:model.relation-reasons`). Both carriers, the envelope contract,
   extraction, validation and the reader change together.
3. **The iteration loop.** The design diff recipe, given the base graph as a parameter
   (`spec:consumers.design-diff`); the context bundle recipe within a character budget
   (`spec:consumers.context-bundle`); the perspective filter recipe
   (`spec:consumers.review-perspectives`); the change proposal's JSON schema and its check recipe
   (`spec:consumers.intent-composition.proposal`).
4. **Gen 1's structural lessons.** The slimming-candidates recipe (`spec:model.enrichment-lifecycle`)
   and the file-level curation layer with a TypeScript adapter
   (`spec:consumers.impact-graph.curation-assist`).
5. **Skills.** How much detail to write (`sdp-authoring`); review as a numbered gap list, a handoff
   template and tripwires per work shape (`sdp-sessions`); where to log friction and a list of
   ambiguous empty results (`sdp-agent-surface`).
6. **Corpus repairs.** The two stale texts the trial found: `CONTEXT.md`'s "token-budgeted" bundle,
   and `spec:consumers.spec-studio.data#question.aiSlices` calling the bundle deferred.

## The design pass first

An Opus 5.5 pass settles what each member still leaves open, and brings each answer to the owner as
a recommendation: `spec:model.rule-keys#question.exercisesCarrier`, the curation layer's adapter
home and load-bearing measure, the bundle's scopes and perspective filter, relation reasons' typed
attributes, the question fields' link targets, and the output shapes of the changed recipes. Two
typed-dependency holds need statements before their Specs can state `ready`:
`spec:consumers.intent-composition` (`idea`) under the proposal, and `spec:consumers.impact-graph`
(`idea`) under the curation layer.

## Lanes (after the statements)

| Lane | Model | Builds |
| --- | --- | --- |
| G grammar | gpt-6.1-sol | Rule keys and the exercised-rule field, question fields, relation reasons, in both carriers through the reader. |
| A answers | gpt-6.1-sol | The recipe changes, the design-backlog recipe, the catalog index, parse-error positions. |
| L loop | gpt-6.1-sol | Design diff, context bundle, perspective filter, the proposal schema and check; after G, since keyed rules compare by key. |
| C curation | gpt-6.1-sol | The import adapter, the curation report, the slimming recipe. |
| S skills | Opus 5.5 | The skill doctrine and the catalog's copy. |
| Integration | gpt-6.1-sol | The self-hosting oracle, test fallout, the gate. |
| Review | gpt-6-astra, gpt-6.1-sol | An adversarial review of the arc and a line read of the engine. |

Opus 5.5 reviews copy and API shapes during the build, and the design pass's Specs are the API
the gpt-6.1-sol lanes write against.

## Acceptance criteria

- **The trial, re-run.** The same brief and tasks on gpt-6.1-sol: 13 of 13, fewer than its 20
  calls, no answer over a tool's output limit, recipe 31's fields read as the relation, and a
  rule's source line where one was asked for.
- **The adopter's design pass.** Over one of libar-platform's capability Packs, read-only: what
  changed since the last pass in one call, the next pass's brief in one bundle within its stated
  budget, open questions with their deciders and triggers, and curation candidates over its
  source.
- `npm run check` passes.

## Candidates, ruled

The owner delegated this ruling, and on Fable 5.1's advice none joins this arc. Corpus rules with
architecture constraints change the validate path and its exit codes and depend on nothing this arc
builds; they would replace the graph-side half of the adopter's check script, about 145 of its 363
lines, not all of it. They lead a later arc, with the adopter's gate rewrite as its test.
Example-space coverage and run evidence move to plan 42, where their consumer, the Studio's tests
lens and verification panels, lives. The curation layer's two questions are ruled in its Spec: the
import adapter runs in `sdp build` and writes `generated/imports.json`, which the recipe reads
through `--params`, and load-bearing is a ranked list the caller cuts.

## Refused

- Symbol identity in this arc; curation output that authors intent, gates, or reads a layout
  convention in the engine.
- An entry address in an id slot: rule-grain proof is a checked field, never a `verifies` target.
- Reshaping the frozen Design Review to show question fields or rule anchors; the Studio shows
  them (plan 42).
- A new reader method or query verb; `--params` stays input to a body.
- A status, date or verdict on a question or a proposal.

## The design pass, as run

On 2026-10-12 the owner delegated the design pass's rulings to the Opus 5.5 main thread while away,
with Fable 5.1 (xhigh) as adviser. Fable agreed with every lean and supplied the wordings and five
fixes the list below includes. The rulings landed in their Specs; this list is lineage.

- **The two held parents.** Exhaustive symbol reach moved into
  `spec:consumers.impact-graph.symbol-reach` (`idea`), which carries the blocking symbol-identity
  question; the impact graph keeps the inferred-and-apart law, drops its comparing rule and its
  duplicate advice rule, retitles, and states `defined`. Intent composition keeps one law neither
  child owns, every composing surface hands off on the one proposal contract, and states `defined`.
- **Rule keys.** An example names the rules it exercises as `exercises` on its `verifies` target
  object, checked against the verified Spec's keys (Gherkin: `@exercises.<key>`); a rule carries no
  rationale.
- **Question fields.** A link is a Spec id or an entry address, checked by the mention validator
  with both of its findings; a lean is a provisional line on the question or a decision Spec.
- **Relation reasons.** One free reason for every relation type; `exercises` is the only typed
  attribute. Intended mentions stay corpus data that the mention audit takes as a parameter.
- **The loop.** The design diff owns comparison, the caller always names the base, and two engine
  versions compare on what both carry. A bundle takes `pack` or `specs`, and `members` from the
  perspective filter narrows a Pack scope; a fifth cut reduces section entries to their addresses.
  A proposal names no proposer.
- **Parameters.** `--params` is repeatable, with `KEY=@PATH` binding a file to one key.
- **Gherkin.** Rule keys use the same marker on a `Rule:` title; no Gherkin form for reasons or
  question fields.
- **Shapes.** Each member gained keyed Design entries stating its fields, recipe numbers 33 to 40,
  and the output shapes the build lanes write against.

gpt-6.1-sol line-read the pass read-only and found one blocker (the envelope refused `exercises`)
and nine majors, all folded: impact rows say incoming and outgoing instead of claiming dependency,
slimming rows are potential candidates, the proposal check covers every entry a change touches, the
bundle cuts text everywhere it appears, a component is realized only through `satisfies`, rule
addresses entered the address law (`spec:decisions.checked-mentions`, `CONTEXT.md`,
`spec:validation.prose-mentions`, recipe 25's Spec), a required input has no sample fallback,
question fields get location rows, and perspectives leave content intact.

Statements, on the owner's delegation: `ready` on the ten members the lanes build; the impact graph
and intent composition at `defined`; symbol reach at `idea`. Recipe 29 at the statement: 69 keyed
entries, 23 pinned declarations, no open question.

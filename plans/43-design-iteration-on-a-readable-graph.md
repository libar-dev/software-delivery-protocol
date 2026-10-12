# Plan 43. Design iteration on a readable graph

> **Status:** EXECUTED on `feature/design-iteration-v0`. The design pass's rulings and `ready`
> statements were made on the owner's delegation and await the owner's review before PR 31 merges.
> The branch started from `feature/design-management-v0` at `bc2c84e`, PR 30's head, which `main`
> merged as `0353f10`. A thin lineage
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

## Lanes, as run

Each lane ran in its own worktree from the design pass's commit or a later merge, and merged with
`--no-ff`.

| Lane | Model | Commits | What it did |
| --- | --- | --- | --- |
| Re-pin | gpt-6.1-sol | `dfab3b1` | The oracle and graph pins transcribed from the design pass's carriers. |
| S skills | Opus 5.5 | `96368ac`, `048b07f` | The three skills' doctrine for the grammar, the loop and the session shapes. |
| A answers | gpt-6.1-sol | `3e78ba5`, `cdea13a` | Repeatable `--params`, parse-error positions, summaries, both next rungs, recipe 33, the index; a parse-message fix by Opus 5.5 (`42190d8`). |
| C curation | gpt-6.1-sol | `b70d133`, `68bfb3e` | The TypeScript imports adapter, `sdp build --imports`, recipes 39 and 40. |
| G grammar | gpt-6.1-sol | `18acc35`, `6783837`, `c62180e` | Rule keys, question fields and relation reasons in three carriers through the reader; recipes 20, 22, 23, 25 and 34. |
| L loop | gpt-6.1-sol | `8296b56`, `0ceebc2` | Recipes 35 to 38, the proposal schema, the count prose. |
| Main thread | Opus 5.5 | `4fc8487`, `666589a`, `ba299d7` | Index rows; reasons in recipes 3, 19, 21 and 31; whole realizations switched to `satisfies`; the grammar used on the Protocol's own deferrals and decision refinements. |
| Integration | gpt-6.1-sol | `0ab4e3d` | The oracle, rosters and package allowlist re-pinned; the gate green. |

## Review

gpt-6-astra (xhigh) reviewed `258df34..0ab4e3d` read-only, probing carriers, recipes and the
frozen projections in memory. No blocker; four majors and five minors. All were fixed: eight by
gpt-6.1-sol (`0e6674f` to `029fcae`), each reproduced as a failing test first, and the skills'
wording by Opus 5.5 (`048b07f`).

| # | Finding | Fold |
| --- | --- | --- |
| 1 | The design diff inferred engine support from whether a corpus used a field, so a first Design entry vanished across versions and its proposal scope read unmoved; a pre-arc base left `[#key]` in rule text (major). | Every part both graphs can express is compared; a version difference is a diagnostic; a base rule opening with a marker reads as keyed; an incomparable proposal scope says so. |
| 2 | A keyed rule that became a flow was invisible to the diff and the check (major). | The owning list is part of a keyed entry's comparison value. |
| 3 | The catalog's base-worktree procedure ran the current engine on the base, which in this repository drops constant-form anchors under the import trust rule (major). | The base builds with its own engine here; an adopter may use the engine it has. |
| 4 | TypeScript-to-Markdown import reordered rule keys and its fidelity check did not notice (major). | Emission follows `ruleKeys` order; the check is order-sensitive. |
| 5 | Reasons were missing from recipe 19's refinements and recipe 36's footing (minor). | Recipe 19 lists `reasons`; the bundle's footing carries them. |
| 6 | Recipe 40 threw without its imports (minor). | It returns diagnostics. |
| 7 | A key repeated inside one `--params` object escaped the refusal (minor). | Refused before parsing collapses it. |
| 8 | Two skills still read recipe 31 as narrowing (minor). | They read refinement and point at the decision's text and reason. |
| 9 | Recipe 39 could not tell an unknown Pack from a clean result (minor). | It returns `found: false`. |

Astra found the frozen projections byte-identical for the base corpus under the old and new
engines, the Markdown and TypeScript carriers equal for every new form, and the bundle's budget
held exactly across budgets from 0 to 100,000.

### Second review

After the push, gpt-6-astra reviewed `0353f10..bac264d` for the owner and Greptile reviewed the
PR; CI failed at `bac264d`. Seven findings, two P1 and five P2, two of them found by both
reviewers. Opus 5.5 fixed all seven in `51a3225`, each reproduced as a failing test first.

| # | Finding | Fold |
| --- | --- | --- |
| 1 | A non-literal value nested in a question field, such as a `ref()` link, dropped the question list with a warning, so a blocking question could vanish and the floor rise (P1). | A failure anywhere under the four fields is an error. |
| 2 | The base-worktree test needed `HEAD~1`, absent from CI's depth-1 checkout, and its cleanup masked the cause (P1). | The test reads `HEAD` and removes only a worktree that exists. |
| 3 | The documented cleanup refused the linked `node_modules`, which `node_modules/` does not ignore; a local exclude hid it (P2). | `git worktree remove --force`; the gate also passes in a depth-1 clone. |
| 4 | `--params` read `=@` inside inline JSON or an `@PATH` as a key binding (P2, both reviewers). | Inline JSON and `@PATH` are recognized first. |
| 5 | Against a base from before rule keys, recipes 35 and 38 invented moves across rules and flows, an order that engine never kept (P2). | Keyed entries compare by order within each list, with a `ruleOrder` diagnostic; an otherwise unmoved whole-Spec scope reads incomparable. |
| 6 | The imports adapter missed `import("./b.js")` and `import("./b.js").B` (P2). | Literal import calls and import types resolve through the checker. |
| 7 | The bundle's fifth cut reduced a pinned declaration whose key contains a dot (P2, both reviewers). | Design and UI entries are read by their own key. |

gpt-6-astra then checked `51a3225`, read-only. Six fixes held. Three gaps remained, fixed in
`be35578` with tests shown to fail without the fix: the within-list position ran across both lists,
so adding a keyed rule moved every flow; recipe 38 left out the `ruleOrder` diagnostic; and the
import-type test passed without its branch, because a barrel already reached the file.

The proposal Spec's `checkRecipe` and `checkRows` now name the `diagnostics` and incomparable
items the first review's fix added. Left for a ruling: a non-literal `blocking` flag or question
text still drops a TypeScript question list with a warning, under the section tier's lossy rule.

### The description pass

Checking PR 31's description against both ruling sheets found three loose ends, fixed in
`f708cfc`. `spec:consumers.agent-surface.design-recipes` still named recipe 31's old fields; its
example-space question asked what the coverage Spec now rules; and the PR 30 ruling that a recipe
renders a proposal as a memo for people had no home, so the proposal Spec carries it as the
non-blocking `#memoRecipe`. The Pack page at the arc's base and head is rendered in
`.omo/evidence/plan-43-demo/`.

CodeRabbit reviewed `0353f10..759b911` and posted four minor findings, all valid, fixed in
`703f09c` with a test that failed first: a missing imports root surfaced as a raw `ENOENT`; the
rule-key sort had no consistent order when only some entries carry a line, and the suggested
index fallback still cycled, so the sort now runs only when every entry has a line; a
rule-exercises finding's path counted edges and changed with their order, so it now names the
relation as the location table does; and the proposal schema test used ESLint's hoisted `ajv`,
now a declared devDependency.

## Acceptance, as measured at close

Measured at the merge of the review fixes, and the gate again at `be35578`; re-run the recipes
rather than inheriting these.

- **The gate.** `npm run check` exits 0: 1,757 pooled tests in 81 files and 93 CLI tests. At
  `51a3225` it also passed in a depth-1 clone like CI's, and CI passed.
- **The graph.** 253 Specs, 4 Packs, 287 anchors, 544 nodes, 1,283 edges; validate reports 0
  errors and 4 warnings (the spec-sections gap the owner keeps, three prose mentions). Recipes 1
  and 2 are empty. Ten of the Pack's eleven members carry `implemented` and `has-verifier`; the
  impact graph states `defined` and waits for its author.
- **The trial, re-run** (`.omo/evidence/agent-surface-trial-2/`). gpt-6.1-sol answered 13 of 13,
  read recipe 31's fields as the relation, and found the bundle rule's line. Two criteria were not
  met: it made 23 calls against 20, eight of them for the open task and its own cross-checks, and
  one of its own batched calls overflowed the tool's output, though no single recipe did.
- **The adopter's design pass** (`.omo/evidence/plan-43-adopter-pass.md`), read-only on a clone of
  libar-platform. The design diff of `pack:history-view` since round 2 came back in one call. The
  whole Pack does not fit one bundle at the default budget: 190 pinned declarations stay whole, so
  it needs about 300,000 code units after every cut. One perspective's eight members fit at 98,000.
  The register reads 166 questions and no fields, because the adopter has authored none yet. The
  curation report found a file 44 others import that no anchor covers, 10 `uses` edges no import
  backs, and two cross-context imports no `uses` states.

## What comes next

- **The owner's review of the delegated rulings**, listed in "The design pass, as run"; then the
  merge of PR 31 with a merge commit.
- **Four questions this arc raised**, each for a later ruling: whether a caller may reduce pinned
  declarations to their addresses in a bundle; an `exclude` list in the imports adapter's
  configuration, since generated files rank as load-bearing; the trial's on-ramp and
  impact-answer friction (one task-to-recipe sheet, impacted Pack ids in recipe 4's summary); and
  whether any dropped question list is an error, as a dropped question field now is.
- **The adopter** re-pins once, moves its register's deciders, sources and leans onto question
  fields, and adds the two associations plan 42's acceptance needs.
- **Plan 42**, then the arc led by corpus rules and architecture constraints.

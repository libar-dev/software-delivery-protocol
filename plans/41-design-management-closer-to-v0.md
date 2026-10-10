# Plan 41. Design management, closer to the original design

> **Status:** 🛠 EXECUTING on `feature/design-management-v0`, from `main` at `822aea4`. This plan
> is the contract every session and agent on the arc reads. The arc's intent lives in the graph:
> `pack:design-management-v1` holds the built and captured Specs in reading order, and readiness,
> backlog and findings are read from the graph (recipes 1, 2, 9, 11, 20), never from this file.
> If this file and the graph disagree, the graph wins and this file is stale.

## Why this arc

The owner's direction, restated on 2026-10-10: improve the Protocol as far as it goes toward
complex, iterative design work, move closer to the original design (`docs/lineage/v0-design/`),
and improve self-hosting. Three inputs, read on 2026-10-10:

- **The first adopter's design machinery.** `libar-dev/libar-platform` designs ahead of its code
  with capability Packs, design passes by perspective, a decision register and pinned
  declarations. To do it, it hand-built about 2,400 lines of tooling: a 1,201-line Pack page
  generator (`scripts/pack-page.mjs`), a 408-line declarations emitter, a 467-line register tool
  and a 363-line check. The page re-parses carrier files for entry lines, rewrites recipe 25's
  source to pass its addresses, and scrapes recipe bodies out of the Markdown catalog. Its open
  asks to the Protocol are in `docs/feedback/sdp-feedback-01.md` and `-02.md` there.
- **The original design.** A claim-by-claim map of all nine v0 chapters against the corpus
  (research run 2026-10-10, kept in `.omo/evidence/plan-41/research/`). The three lanes that
  counted, chapters 00 to 02, 04, 06, 07 and 08, found 186 claims realized, 54 captured ahead of
  code, 111 departed by a ruling, 55 with no home and 19 out of scope; the fourth lane mapped
  chapters 03 and 05 by table. The uncaptured claims that matter most for design work: a `designed` stage (01 §1.4), components declared before
  code (03 §2.5), source lines for entries (06 §2.4), design comparison between commits (08 §6.1),
  context bundles (07 §5.5), example-space coverage (04 §4), custom corpus rules (06 §6.5), and a
  decision index (02 §1).
- **The Protocol's own corpus.** It self-hosts extraction and validation well but uses its own
  design features thinly: 2 Packs (one a 225-member aggregate), 7 Specs with a Design section,
  17 open questions without keys, guidance in `docs/concept/` and two Studio Specs that still
  teaches rulings plan 40 superseded, and plan 35's deferral triggers still living in plan prose.

## The owner's rulings of 2026-10-10

Asked in session; each answer is the recommended option.

1. **The Pack page.** Ship the Pack's design as data (an exported reader value and a recipe) and
   render it in the Design Review's Pack page, through a decision that supersedes the projections
   freeze for that page only. The Studio later renders the same data.
2. **`designed`.** No new rung. Derive design columns beside readiness (keyed entries, pinned
   declarations, decisions, open and blocking questions) and capture the rung question as an
   `idea` Spec that names the forms it weighs.
3. **Planned architecture.** Capture `spec:model.planned-architecture` at `idea`: component designs
   as Specs, a comparison with anchored components once code exists, and the architectural
   annotation ruling's realized-only component held as a keyed question.
4. **The drift queue.** A per-Spec review packet for the sixteen Specs the drift alarm names; the
   owner states `ready` on the ones accepted. The packet is the last section of this plan.

## What this arc builds

Each item is a Spec authored first, then built. Each states `defined` until the owner states
`ready`; the decision states `defined` until the owner ratifies its text.

### B1. The Pack design page (`spec:decisions.pack-design-page`)

A decision that supersedes `spec:decisions.shipped-projections-frozen` for the Design Review's Pack
page only, as `spec:decisions.authored-entry-order` did for open-section rendering. The page
presents the Pack's design as it stands: what each member is, where its readiness stands against
the next rung, what design it carries, what it rests on outside the Pack, its open questions with
their addresses and lines, and the code that realizes or references it. The Spec page, the index,
census, Mermaid and Gherkin stay frozen.

### B2. The Pack design (`spec:consumers.pack-design`)

`packContext` gains the design columns, computed once by the reader, so the page, a recipe and an
adopter's script read one answer:

- per member: the rung above the **stated** rung and its unmet clauses (empty when the floor
  holds it, the drift-queue case), beside the existing floor; the design columns (keyed Design
  and UI entries, pinned declarations by recipe 24's rule, open and blocking questions, the
  decisions it is `decidedBy` with their rungs); the realizing and referencing units, each with
  its component's layer and context; enabled verifiers and verifying examples.
- per Pack: the boundary, the Specs outside the Pack that members relate to (rests on) and that
  relate to members (rested on by), each with relation type, stated rung and `implemented`.

A code unit binding gains its component (`memberOf` target, with layer and context), additive on
`SpecContext` too. No new reader method: this extends the existing Pack context, and it clears the
second-caller bar (the Design Review and the adopter's page, whose hand-rolled walk read the rung
above the stated one where preflight reads the rung above the floor).

### B3. Entry locations (`spec:extraction.entry-locations`)

The extractor records the source line of every keyed Design and UI entry and every open question,
in a location table beside the nodes. Primitive and Pack nodes stay line-free, so node-level
goldens survive Spec edits and carrier parity compares nodes, not lines. The reader's Spec context
carries the Spec's locations. Recipe 25 returns each resolved entry's value, file and line; recipe
23 returns the line. Graph schema `0.9.0`.

### B4. Recipe parameters and recipe files (`spec:consumers.agent-surface.recipe-parameters`)

`sdp q --params JSON` (or `--params @path`) injects a fourth binding, `params`, defaulting to an
empty object. Every parameterized recipe reads its parameter from `params` and falls back to the
catalog's sample: recipes 3, 9, 19, 21 (a Spec id), 4 (files, replacing `SDP_CHANGED_FILES_JSON`),
5 and 27 (a Pack id), 25 (addresses), 22 (a scope). The build writes each catalog body to
`dist/recipes/NN-slug.js`, shipped in the package, so an adopter runs a body as shipped. The catalog
stays the one owner of the bodies; the files are derived and checked.

### B5. Design recipes (`spec:consumers.agent-surface.design-recipes`)

Four recipes, each run by the recipe test:

- 29 **Pack design**: the B2 assembly as data, the page's input for any renderer.
- 30 **Design-change impact**: from Specs being changed, the transitive inbound dependents
  (`refines` children, `dependsOn`, `constrainedBy`, `decidedBy`), and for each the units that
  satisfy or reference it, its verifiers and its Packs. What a design change asks to follow.
- 31 **Decision register**: every decision with its stated rung, its `supersedes` chain both ways,
  the Specs it shapes, its keyed open questions and its Packs. `DECISIONS.md` keeps the ratified
  names; the register's substance is read from the graph.
- 32 **Architecture crossings**: `uses` edges whose two ends, resolved to their components, sit in
  different contexts or layers. Reports, refuses nothing; a corpus gates its own rule (MD-38).

### B6. Engine provenance (`spec:consumers.engine-provenance`)

`sdp --version` prints the package version and the commit the build came from, so an adopter can
tell the engine moving from its corpus moving. The build records the commit; the graph stays free
of it.

## What this arc captures (v0, ahead of code)

Each enters at `idea` or `scoped` with keyed open questions, and a `dependsOn` or `refines` to the
realized Spec it builds on:

| Spec | v0 source | What it holds |
| --- | --- | --- |
| `spec:model.design-maturity` | 01 §1.4, §8 | The `designed` question: a fifth rung, a kind-conditional clause, the derived columns (B2), or none. |
| `spec:model.planned-architecture` | 03 §2.5, 05 | Component designs before code, compared with anchored components; MD-38's realized-only rule as a question; provider selection. |
| `spec:model.open-question-fields` | 01 §2.1 | Who decides a question, links, a provisional reading; no status. |
| `spec:model.rule-keys` | 01 §2.2 | Keys on behavior rules, addressable as `#rule.<key>`. |
| `spec:model.relation-reasons` | 01 §4 | An optional reason on an authored relation. |
| `spec:consumers.design-diff` | 08 §6.1 | Designs compared between two commits at entry grain. |
| `spec:consumers.context-bundle` | 07 §5.5 | The pass brief composed per invocation; plan 35's trigger is met by the adopter's pass task. |
| `spec:consumers.review-perspectives` | 04 §6 | Perspectives over a Pack (v0's reader types, the adopter's advisor lenses). |
| `spec:consumers.intent-composition.proposal` | 02 §2, 07 §6 | The reviewable half of the patch loop: an addressed change proposal. |
| `spec:consumers.reference-projection` | plan 35 H | Deferred, with its re-entry trigger as a keyed question. |
| `spec:consumers.structural-mermaid` | plan 35 H | Deferred, with its re-entry trigger as a keyed question. |
| `spec:validation.superseded-decision-signal` | 06 §6.3.4 | A warning for a Spec shaped by a superseded decision; partial supersession as a question. |
| `spec:validation.architecture-constraints` | 06 §6.4 | Declared architecture rules checked against anchored structure; MD-38's refusal as a question. |
| `spec:validation.corpus-rules` | 06 §6.5 | Corpus-authored rules on the one validation path. |
| `spec:observation.run-evidence` | 06 §11.2, 08 | CI run records joined to verifiers in a view, never in the graph. |
| `spec:consumers.agent-surface.example-space-coverage` | 04 §4 | Witnesses and coverage gaps per literal slot; a recipe would need a second notation parser, so the reader may decode spaces and points instead. |

## Self-hosting repairs

- **Stale guidance.** `docs/concept/04-authoring-and-binding.md` §2 dissolves into pointers to
  `spec:model.anchors` and the three plan-40 decisions; `docs/concept/07` rows that plan 35 and 40
  settled are corrected; `spec:consumers.spec-studio.lenses` moves its `decidedBy` from the
  superseded MD-34 to MD-38; `spec:consumers.spec-studio.spec-page` stops saying component and
  uses are the only structural fields; `AGENTS.md`'s status lines are re-pointed.
- **Question keys.** The 17 unkeyed questions gain keys, wording and flags unchanged.
- **Packs.** `pack:design-management-v1` for this arc; the three plan-40 decisions join the
  self-hosting Pack.
- **Graph-first planning.** Its blocking arc-boundary question gains a key and the evidence of two
  arcs authored as Packs (Studio, this one); the owner rules it.
- **The decision registry.** MD-32's row names its two narrow supersessions; D4 points at its
  carrying Spec; MD-39 enters for B1.
- **Mentions and gaps.** Each of the nine unbacked mentions gets the relation that fits or stays
  prose with its reason in this plan; a ready Spec without a verifier gets a test anchor only where
  a test checks the Spec's own promise.
- **Vocabulary.** Candidate terms (question key, stated next rung, Pack design, boundary, pinned
  declaration, location table, recipe parameter) enter `CONTEXT.md`'s flagged ambiguities for the
  owner to ratify.
- **`sdp validate --watch`** gets the Spec and anchor it lacks.

## Lanes and order

1. **Contract.** This plan and the B1 to B6 Specs, authored first and validated.
2. **Parallel lanes**, each in its own worktree, on disjoint files: E1 entry locations
   (`src/extract`, `src/graph`), E2 Pack design and page (`src/reader`, `src/projections`), E3
   CLI (`src/cli`, build), C1 captures (`specs/`), C2 self-hosting repairs (`specs/`, `docs/`,
   `CONTEXT.md`, `AGENTS.md`), D the drift packet (read-only).
3. **Integration.** Merge lanes; recipes 29 to 32 on B2 to B4; recipe catalog, skills and docs;
   self-hosting oracle pins re-derived and labelled re-measured; the engine's own anchors.
4. **Gate.** `npm run check` green.
5. **Review.** A read-only adversarial review of the branch (gpt-6-astra) and a line read
   (gpt-6.1-sol); findings ruled and folded.
6. **Adopter acceptance.** The Pack design page and recipes run read-only over the adopter's
   corpus (`pack:history-view`) from this branch's build, measured against its hand-built page.

Commit per coherent unit after its focused tests pass; the full gate before the close commit.
Never push without the owner's word.

## Acceptance, re-measured at close

- The Design Review page for `pack:spec-studio-v1`, and for the adopter's `pack:history-view`, shows
  each member's stated next rung with its unmet clauses, its design columns, its boundary, its
  open questions with addresses and lines, and its realizing and referencing units with layer and
  context, from the graph alone.
- Recipe 25 over the adopter's external addresses returns each value and line, passed with
  `--params @file` and run from `dist/recipes/` as shipped.
- Recipes 29 to 32 run as written in the recipe test.
- `sdp --version` names the package version and build commit.
- No v0 claim this arc captures lacks a carrying Spec; `npm run check` passes.

## Refused, and staying refused

- A `designed` rung this arc, or any readiness change: ruled to derived columns.
- A component node without code: MD-38 stands; the capture holds the question.
- Lines on Primitive or Pack nodes, or an entry as an anchor target (MD-37).
- A new reader method or query verb: B2 extends the Pack context; recipes grow the surface.
- Reshaping the Spec page, index, census, Mermaid or Gherkin.
- Pass, approval, reviewer or finding records in the graph; run results as delivery facts.

## The drift queue, for the owner

Filled in by lane D.

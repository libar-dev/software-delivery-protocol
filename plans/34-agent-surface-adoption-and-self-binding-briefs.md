# Plan 34 briefs — the agent surface · registrar adoption · structural self-binding · next projections

> **Status:** 🧭 DRAFTED — next-arc briefs, the sole planning input for the next arc; not
> execution authority. Four owner-commissioned briefs, consolidated from the plan-29 index
> (brief E, expanded here and superseding the plan-29 text), the plan-31/33 forward record, and
> PR #19's upcoming-work section. This file is written to be handed whole to the planning
> harness (Prometheus / `ulw-plan`): it carries the design intent, the governing law, the
> decision gates, and the dependency truths — and deliberately **no** session splits, todos, or
> operational detail. That planning is the harness's job; orchestration (Atlas) takes the
> dependency map below as its parallelism contract.
>
> **Settled ground:** plan 33 (✅ EXECUTED — the plan-31 review closed, MD-29–MD-31 ratified, the
> gate green twice) on plan 31 (✅ EXECUTED — carrier universality, derived runnable modules,
> census/Mermaid/Gherkin projections, structural anchor semantics). Plan 32 remains the durable
> review brief; plan 29 remains the prior arc's index, its brief E superseded by this file.
>
> **Numbering.** This file takes 34 and keeps it. Execution plans this arc commissions take **35
> upward**, one primary number each; this header gains a commissioned-plans line as they are cut.
> Brief lettering continues plan 29's: **E** is kept (same scope, matured), **F/G/H** are new.

## How to consume this brief (binding on the planning session)

1. **Re-measure first, inherit nothing.** Every count and finding below was measured at the
   commit that adds this file. Before cutting a single task, re-run:

   ```bash
   pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
   pnpm --silent sdp:q '<recipe 1 body>'   # operational backlog
   pnpm --silent sdp:q '<recipe 2 body>'   # drift alarm
   pnpm --silent sdp:q '<recipe 8 body>'   # warn-level signals
   ```

   A statement below that no longer reproduces is closed with that reason, not carried forward.
2. **Open the carrying owners before the concept docs.** The graph is the read model; the
   per-brief owners table below names what to open first. Concept pages are exposition.
3. **The decision-gate table below is law.** A brief marked *may end without a ruling* is allowed
   to fail its amendment honestly; a brief marked *no new decision expected* must not mint one
   without evidence that existing law does not already answer.
4. **The do-not-reopen list below is binding.** Reopening any row needs a new ruling with the
   ADR three-part test on the record, never a follow-up todo.
5. **Standing discipline applies unchanged:** plan-vs-execution separation; `npm run check`
   before any green claim; checks police conformance and honesty, never content-quality and
   never workflow; close records re-derive their numbers and label them as re-derived; the arc
   ends with an independent review in the plan-32 mold before its PR is ratified.

## The read model for every commissioning session

| Brief | Carrying owners to open first |
| --- | --- |
| E | `spec:consumers.agent-surface` · `spec:decisions.agent-front-door` (MD-22) · `spec:decisions.agent-surface-scripts-graph` (D5) · `spec:decisions.mcp-deferred` (D6) · `spec:consumers.impact-graph` (at `idea`, blocking question intact) · `docs/agent-surface/recipes.md` (eleven runnable bodies) |
| F | `spec:decisions.adopted-registrars-committed` (MD-31) · `spec:extraction.runnable-modules` (the frozen registrar interface) · `spec:extraction.executable-contracts` |
| G | `spec:decisions.structural-anchor-semantics` (MD-30) · `spec:model.anchors` · `spec:consumers.census-page` · `src/model/anchors.ts` (the closed `codeAnchor` contract) |
| H | `spec:consumers.projections-model` · `spec:consumers.design-review` (the inherited law) · `spec:consumers.census-page` · `spec:consumers.mermaid-view` · `spec:consumers.gherkin-view` (the settled publish posture) |

**Corpus context — re-measured at this commit; re-run, never inherit.** 156 Specs · 1 Pack ·
146 anchors; zero extraction or validation findings, zero warnings; the operational backlog
(recipe 1) is empty. The drift alarm (recipe 2) names eight `implemented ∧ ¬ready` Specs, all
stated `defined` and all long-standing: the `model` family parents (`core-model`,
`pack-aggregate`, `relations`, `spec-sections`) plus `projections-model`, `claim-taxonomy`,
`regenerability`, and `markdown-authoring`. Maturing those eight is **not** commissioned here —
they are honest sub-`ready` statements, and the standing posture (plan-32 theme 9) is enrichment
on evidence, never retraction — but a session that touches one of them (E and H touch
`projections-model`; G touches the anchor family) should mature what its own work makes true
rather than leaving the rung stale on purpose.

## The honest frame (binds every brief)

The previous arc built the substrate: four certified projections, structural edge vocabulary,
derived runnable modules, and falsifiable registrar adoption. **This arc makes the Protocol the
first consumer of its own new surfaces** — recipes over the census and structural edges, the
engine binding its own structure, the self-hosting corpus adopting its own registrars — before
any external adopter is asked to trust them. Every brief below is a consumption test in that
sense: if the surface is awkward for us, it is wrong, and the fix goes into the surface, not
into a workaround (the tracer-bullet discipline, turned inward).

Two permanent guardrails restated because every brief touches them: delivery facts are derived,
never authored — nothing in this arc mints a fact, a status, or a gate; and the claim taxonomy
is never collapsed — new reads and bindings carry `declared`/`anchored`/`inferred` distinctly,
with `inferred` staying **empty** until the impact graph exists.

---

## Brief E — the agent surface: read recipes · write ergonomics · the MCP amendment

**Supersedes plan-29 brief E; its re-entry trigger (census + structural edges queryable) is
satisfied — that is exactly what plan 31 delivered.** Three halves that must not be conflated,
because they answer to different laws.

### E1 — read recipes (parity with the gen-1 handle)

**Goal.** Close the read gap between `sdp q` and its gen-1 ancestor with recipes, not verbs.
Start from what exists: `blastRadius` is the file-level changeset entry; recipes 1, 2, 4, and 8
cover backlog, drift, blast radius, and warn-level signals; recipes are executed verbatim by
`test/recipes.test.ts`.

**The new reads.**

- **The diff → at-risk bridge** (gen-1's `specsReverifying`): a recipe that takes a git diff's
  changed-file list and returns impacted, at-risk, and coverage-unknown Specs over
  `blastRadius` — the read an agent wants at review time. Ships as a recipe or a thin CLI
  convenience; **the freeze-vs-script principle gates every promotion** to a frozen reader
  accessor (freeze only irreducible cross-source joins, only when a second machine consumer
  fails to hand-roll it — the same bar that gated `explain`/`search` out).
- **Census and fan-in reads** over brief-C/D substrate: component membership, `uses` fan-in/out,
  structural-edge neighborhoods. These consume G's bindings; they land honestly only once G has
  authored real rows (the dependency map below sequences this).
- **Projection-verb recipes were deliberately deferred to this brief** (plan-32 theme 10 updated
  the on-ramps but minted no new recipe bodies); this half owns them now.

**Boundaries.** `bySymbol` stays deliberately absent — `spec:consumers.impact-graph` is at
`idea` with its blocking identity question intact, and parity does not smuggle the exhaustive
impact graph in through census/fan-in reads. No mutation through `sdp q`; the q sink stays a
pure read. Recipes remain the growth valve: a question not answered by a recipe gets scripted,
never a new query verb (the front door, MD-22).

### E2 — write ergonomics (a separate half — never read parity)

**Goal.** Give authoring a floor of tooling without touching the write path's law: the write
path remains **carrier edit + git**, and checks police conformance and honesty, never content.

**The candidates,** both named in the roadmap's acceptance-criteria lens (`docs/concept/07` §4):

- **`sdp new spec`** — a scaffolder that emits an honest `idea`-rung carrier (envelope, typed
  section skeletons for the chosen kind, nothing invented) that extracts and validates
  immediately. It writes a carrier file; it never writes the graph, never states content, and
  never advances readiness.
- **`sdp validate --watch`** — re-derive and re-validate on carrier change; an authoring-loop
  convenience with zero gate semantics.

**The placement ruling this half must produce.** The front door's law is *no new query
vocabulary*; these are write-side verbs, which that ruling never addressed. The session rules
their placement explicitly — either they sit lawfully under existing law (a scaffolder and a
watcher are not graph reads and not gates) with the reasoning recorded in the plan, or the
distinction is surprising enough to earn a small decision Spec. Apply the ADR three-part test
honestly; drift repair is not a decision. `sdp explain` stays out — still below the
second-caller bar.

**Boundaries.** No template that pre-fills content prose (a scaffold states structure, not
intent); no readiness above `idea` on emitted carriers; skills and recipes docs updated in the
same pass (the on-ramps are repository-owned surface, not an afterthought).

### E3 — the MCP amendment attempt (may lawfully fail)

**Goal.** Test the MCP deferral (D6, `spec:decisions.mcp-deferred`) against its own bar:
*"deferred until a concrete caller establishes its boundary and contract."*

**Candidate callers to test against the bar, honestly.** The repository's own agent skills and
the OmO harness currently reach the graph by shelling out to `pnpm sdp:q` — the session decides
whether either constitutes a *named caller with a boundary and a contract* or remains the
burst-mode evidence class (gen-1's rule: typed twins earn their keep at ≥5 reads in close
sequence) that MD-22 already serves well. Studio-class sinks remain evidence, not a caller.

**The session ends without a ruling if the concrete-caller bar is not met** — the brief does not
assume a decision Spec results, and a recorded non-ruling with the bar restated is a lawful,
complete outcome. If the bar **is** met, the amendment names the caller, its verb boundary, and
its contract, passes the three-part test, and takes a registry row.

**Boundaries.** No speculative MCP server ships ahead of the ruling. Whatever is ruled, `sdp q`
remains the front door and the reader remains the seam — an MCP surface would be a third
entrance over the same seam, never a second read model.

---

## Brief F — deferred registrar adoption (brief B follow-on)

**Goal.** Turn the thirty deferred self-hosting families from a standing note into per-family
adoption decisions under the adopted-registrars ruling (MD-31): emission never implies adoption;
a family adopts when tracked authored code imports its registrar, and each adopted family joins
the committed, byte-checked set on its own evidence.

**The decision rule per family** (the planner selects the tranche; the rule is the governance):
adopt when the family's authored suite exists, the mechanical share the registrar removes is
real in that suite, and the five-adapter surface expresses the family's semantics without
contortion. **Refuse** when the suite would be authored only to justify adoption, or when the
family's examples are not honestly bindable — a refusal with its reason recorded is a complete
per-family outcome, and "all thirty adopt" is not the success criterion.

**Why now.** MD-31's machinery (manifest reconciliation, `--check-clean`, preflight byte
comparison) shipped and is proven on exactly one adopted registrar — the checkout valid-cart
tracer. One data point is a tracer, not a demonstrated posture; the first self-hosting tranche
is what shows the freeze holds beyond the example it was built on, and it will surface any
five-adapter friction while the interface's adopters are still all in-repo.

**Boundaries.** The frozen registrar interface is **not reopened** — friction found here is
recorded as evidence for a future ruling, not fixed by loosening the freeze mid-arc. Claim
taxonomy unchanged: the authored `specTest` anchor remains the only `has-verifier` source;
adoption confers no delivery fact and no migration claim. O4 (harness projection) and O5
(engine-side execution of adopter code) stay out.

**Dependencies.** None — independent of E, G, and H; can run first or beside anything.

---

## Brief G — Protocol-side structural bindings (the MD-30 pressure test)

**Goal.** Author the engine's own `component`/`uses` bindings in `src/` under the structural
anchor semantics ruling (MD-30). The vocabulary, validators, census rendering, and queries all
shipped in plan 31; the Protocol's own source authors **zero** structural edges, so the census's
structural sections render their empty states and every consumer of the semantics is
hypothetical. Binding the engine's own structure is the cheapest pressure test before external
consumers depend on the semantics.

**Shape of the work.** Derive the component set from the engine's real module boundaries — the
obvious candidates are the source tree's own seams (`model` · `extract` · `graph` · `validate` ·
`reader` · `projections` · `cli` · `runner` · `codegen` · `notation` · `adapters`) — author
`component` membership on the existing anchor sites, and add `uses` edges where a real,
load-bearing dependency between anchored code units is worth declaring. Sparse and true beats
complete and noisy: these are authored declarations, not an import-graph dump, and gen-1's
taxonomy drift (50 → ~26 with inconsistent counts surviving) is the standing cautionary record.

**The friction this brief must surface, not paper over.** The closed anchor contract requires
`satisfies` on every code anchor — so a pure `component:` node currently exists only by also
binding a Spec. The session resolves this honestly: either components lawfully satisfy the
design Specs they realize (arguably right, and then the convention is recorded), or the contract
needs a lawful component-declaration form — which would be an **amendment to MD-30's closed
envelope, ruled on the record**, never slipped in as a convenience. This is exactly the class of
finding the pressure test exists to force while the cost of change is still low.

**Acceptance shape.** The census's component-membership and uses sections render non-empty for
the self-hosting corpus with zero validation findings; E1's fan-in reads have real rows to
answer with; any contract friction is either resolved by recorded convention or escalated as a
ruled amendment.

**Boundaries.** Everything MD-30 refused stays refused: no free-form tags, no inference from
imports, no lifecycle metadata, no per-namespace sibling builders; structural edges confer
nothing — no realization, readiness, or delivery facts; the anchor-required lint stays
warn-level and optional. The census remains generated evidence, never a registry.

**Dependencies.** Independent to start; **feeds E1** (fan-in/census reads want real rows) —
sequence G's authoring before or beside E1's census-read recipes.

---

## Brief H — next projections (the remaining brief-C candidates)

**Goal.** Decide which, if any, of the remaining named-but-unbuilt projections earn a plan now:
the **reference projection**, the **context bundle**, **Spec Studio**, and the small carried-over
candidate of a Mermaid rendering that specializes structural edges (plan-32's forward list).
Deferring all of them with reasons is a lawful outcome; this brief exists so the deferral is a
decision, not an accident.

**Selection pressure.** The four shipped roots each answered a distinct reader (review · census ·
diagram · Gherkin shape). A new projection earns a plan only by naming a reader the four do not
serve — the context bundle's candidate reader is the agent session that today assembles its own
context from recipes (a real, in-repo consumer this arc can measure); the reference projection's
is the human outside the repo; Spec Studio implicates the OSS/commercial boundary
(`@libar-dev/` vs `@libar-ai/`) and is expected to stay deferred on that ground alone until its
home is ruled.

**Boundaries.** All shipped projection law is inherited, never re-decided: determinism,
projections confer nothing, wholesale-rewrite publication, and the settled publish posture
(after successful extraction, publish diagnostic output even over validation errors, label it
visibly, return the validation exit code). New verbs join the certified-roots gate the same way
the four did. The one new decision arises only if a session abandons the one-generated-view
posture — then it rules on the record. The census page keeps its single owner; H consumes it,
never re-specifies it.

**Dependencies.** Independent; benefits from E1's evidence about what agent sessions actually
assemble by hand. Recommended after E1 has run long enough to produce that evidence, and lawful
to defer entirely.

---

## Dependency map and sequencing (Atlas's parallelism contract)

Design-level truths only — session splits and waves are the harness's job:

- **F and G are independent of everything** and of each other; either can start immediately.
- **E2 is independent** of E1, E3, F, G, and H.
- **E1's census/fan-in reads want G's rows**; its diff → at-risk bridge does not — E1 can split
  along that line if the harness wants the bridge early.
- **E3 goes last among E's halves** — the amendment attempt is cheapest once the arc has fresh
  evidence about how agents actually call the surface.
- **H goes last overall or defers** — its selection pressure is E1's usage evidence.
- Maximum honest parallelism at arc start is therefore **F ∥ G ∥ E2** (three independent
  workstreams), with E1 joining as G's rows land.

## Decision gates

| Brief | Gate |
| --- | --- |
| E1 | No new decision expected. Recipe promotion is governed by the freeze-vs-script principle already on the record. |
| E2 | Must **rule placement** of write-side verbs — existing-law reasoning recorded in the plan, or a small decision Spec if it passes the three-part test. |
| E3 | Amendment attempt on the MCP deferral (D6). **May lawfully end without a ruling**; a recorded non-ruling is complete. |
| F | No new decision expected — MD-31 governs; each adoption/refusal is per-family evidence in the plan record. |
| G | No new decision expected — MD-30 governs; **except** the component-declaration friction, which if real is a ruled amendment to MD-30, never a slipped convenience. |
| H | No new decision unless a session abandons the one-generated-view posture — then it rules on the record. Deferral with reasons is lawful and complete. |

## Do not reopen

Carried forward from plan 32 and plan 33, updated for this arc. Reopening any row needs a new
ruling, not a follow-up todo.

- **The default-carrier flip.** Markdown stays the default (MD-29).
- **Gherkin kind expansion, DocStrings/DataTables, Gherkin Packs.** Ruled refusals, not gaps.
- **An `implements` slot.** Contract realization remains `satisfies` by authoring convention (MD-30).
- **The frozen registrar interface and its five adapters.** Friction is evidence for a future
  ruling, never a mid-arc loosening (brief F).
- **O5 engine-side execution of adopter code; Scenario Outlines as executable constructs.**
- **Re-specifying the shipped Design Review**, census, Mermaid, or Gherkin view — their law is
  inherited (brief H).
- **`bySymbol` and the impact graph.** `spec:consumers.impact-graph` stays at `idea` until its
  blocking identity question is answered; nothing in E1 approximates it.
- **The `.sdp.gherkin` suffix (MD-28)** and the settled projection publish posture.
- **Query verbs.** Reads grow by recipe; the front door stays one evaluation sink (MD-22).

## What the arc must leave behind

- Execution plan(s) numbered **35 upward** with status headers, and this file's header updated
  with the commissioned-plans line.
- For every ruling produced: the decision Spec, its registry row with ratified name and gloss,
  and lead-with-meaning pointers in prose. For every lawful non-ruling (E3, H): the recorded
  reason at the bar it failed.
- Re-derived close measurements, labeled as re-derived; an independent review in the plan-32
  mold before the arc's PR is ratified; `AGENTS.md` status and on-ramp surfaces updated in the
  same pass as the surfaces they describe.

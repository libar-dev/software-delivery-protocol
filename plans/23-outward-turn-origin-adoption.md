# Plan 23 — The outward turn, refined: origin adoption, the usage layer, and the working ladder

> **Status:** EXECUTING — **revision 3** (2026-07-28 reviewed execution). Full S0–S4 execution,
> atomic cutover after parity, and local checkpoint/stage commits are authorized. The latest ✅ EXECUTED ground is
> **plan 22** (self-hosting phase 5: the `05` dissolution and the agent front door; corpus at
> 115 Specs · 1 Pack · 86 anchors → 202 nodes · 397 edges · `ready: 80 / defined: 35`,
> 0 errors / 0 warnings). This plan executes **phase 6 as the usage turn**: the outward turn onto
> the origin project (`new-convex-es` / `libar-platform`) — unchanged from revision 1 — **plus the
> usage layer this repo owes any adopter**, promoted into scope by the refinement session. Four
> usage goals govern the phase (§a); a new workstream **W** (this repo) carries the authoring
> on-ramp, the authoring recipes, and the first honest use of the ladder's lower rungs; stages
> S1–S4 execute in the origin repo with `@libar-dev/software-delivery-protocol` as a dependency.
>
> **What revision 2 changed:** (1) the charter gains the four usage goals and the workstream W;
> (2) the authoring-workflow on-ramp moves from "named successor artifact" (§j of revision 1) to
> an in-scope deliverable; (3) S0 gains two named engine questions (the inert `verification.mode`,
> the anchored-verifier-without-binding seam); (4) S1/S3 gain explicit usage acceptance criteria
> (all four rungs exercised honestly; ≥1 end-to-end executable transition on foreign soil);
> (5) §b gains the inward evidence subsection (the 2026-07-28 engine survey). The origin evidence
> base, the S0 rulings, and the deferral list otherwise stand as drafted.
>
> **What revision 3 changed:** the execution review generalized the records gate before wiring it,
> authorized recoverable stage commits, returned both candidate rulings to the three-part test,
> restored the inline-carrier population instrument, matched the repository's single-file skill
> convention, fixed the package contract, and made stage gates explicit. The origin control-arm
> checkpoint is `4189d9cca`; the Protocol refinement checkpoint is `7a146dc`.
>
> **Spec anchors:** [the agent-surface ruling](../specs/decisions/agent-surface-scripts-graph.sdp.md)
> (`spec:decisions.agent-surface-scripts-graph`) · [the agent front door](../specs/decisions/agent-front-door.sdp.md)
> (`spec:decisions.agent-front-door`, MD-22) · [the carrier ruling](../specs/decisions/markdown-carrier.sdp.md)
> (`spec:decisions.markdown-carrier`, MD-18) · plan 22 §5c (the standing gap ledger and the
> successor items named there).

## (a) Why this plan

Plan 22 §5c named three successor items: the rule-6 bound-point candidate on
`spec:extraction.build-pipeline`, the `check-self-hosting-gates.mjs` gate-leg process change,
and the edit-model tail waiting on a write surface. This plan carries all three — and
subordinates them to a larger judgment the phase-5 close itself forced: **every piece of
evidence the corpus holds is first-caller evidence.** The second-caller bar governs every
freeze decision inside the product, but the product has no second caller. The measured-context
refusal (plan 22 §7) is the honest statement of the gap: no number exists showing the Protocol
helps a project that is not itself, and no number can be produced here.

The 2026-07-28 investigation session (gen-1 survey, playground survey, origin survey — evidence
summarized in §(b), primary sources in the two repos) established that the origin project is
not merely a candidate second caller. It is the **intended consumer, with a deadline**: its
own re-entry corpus (drafted 2026-07-14) plans a restart "in ~2 months" whose precondition is
a working delivery-process answer. That converts "SDP needs a second project" from an abstract
risk into a scheduled obligation, and it is why the outward turn outranks further inward
readiness work.

**The refinement (revision 2).** The same-day engine survey (§b, inward evidence) showed that
what the origin will actually meet on arrival is not an engine gap but a **usage gap**, and
the phase is rechartered around four usage goals:

1. **Anchors used effectively.** The binding layer works (86 anchors, three builders, the
   enabled-verifier join), but coverage is asymmetric — `has-verifier: 80` against
   `implemented: 25` — and nothing teaches when and where to bind. The origin's ~43k-LOC
   platform is the first corpus where anchor placement is a real editorial decision.
2. **The whole readiness ladder used honestly.** The corpus holds **zero** Specs at `idea` or
   `scoped` — the lower half of the ladder has never been used in anger, because the Protocol's
   own forward-looking work lives in plan prose and docket rows instead of Specs. "Managing
   requirements of all maturity levels" is the product's headline claim; today only the top two
   rungs have ever carried weight.
3. **The executable transition as a taught workflow.** The machinery is landed and self-hosted
   (50 bound points, 26 space contracts, the runner, the vitest adapter). What does not exist
   is the *workflow*: the sanctioned path from a prose example to an enabled verifier
   (example space → bound point → generated contract → `bindExample` + `specTest` →
   mutation-probed red) is recorded in plans and exercised by hand, never taught. Two inert
   seams compound it (§d, questions 5–6).
4. **The agent CLI as the working surface.** `sdp q` + the eight recipes + the reading skill
   shipped at phase 5; the missing half is *authoring-side* usage — recipes that answer "why is
   this Spec capped below `defined`," "which examples were refused contracts and by which
   finding," "what would `ready` require here" — and a skill that teaches sessions to start
   from the build-backlog recipe instead of from plan prose.

The refined thesis: **phase 6 adopts the Protocol on the origin project, and uses the adoption
to force the usage layer into existence — with this repo eating the same food first.** The
workstream W applies the Protocol to phase 6's own deliverables (Specs entering at
`idea`/`scoped`, sessions driven off `ready ∧ ¬implemented`), which is simultaneously the first
honest exercise of the lower ladder and the dress rehearsal for S3's restart backlog.

## (b) The evidence base (recorded here because the sources live outside this repo)

Three surveys, one session, numbers re-checkable at the named paths.

**Gen 1 (`~/dev-projects/architect`, `@libar-dev/architect` 2.0.0-pre.1).** The verb wall was
real: 24 top-level verbs expanding to 74 distinct invocations (11 `arch` + 28 `query`
passthroughs + 14 `documentation` types), 23 MCP tools, 6 bins, ~78k LOC, ~1,800 lines of
mandatory skill preamble, and a 66 KB `FEEDBACK.md` of agent friction. Its own terminal
experiment (the playground) measured ~89% of a PatternGraph snapshot to be precomputed views,
most with exactly one consumer — failing gen 1's own second-caller bar — and measured scripting
over loaded shapes at ~⅕ the context of the grep/verb path. The repo died mid-pivot after 211
commits in ~4 weeks; its `graph-handle` skill is the direct ancestor of `sdp q`.

**Gen 0/0.5 (the origin: `~/dev-projects/new-convex-es`, running vendored
`@libar-dev/architect` 1.0.0-pre.3).** A real production platform — event sourcing on Convex;
~43k LOC platform-core plus a 61k LOC example app — whose delivery process grew in-repo
(`libar-platform/delivery-process`, Jan 2026), was extracted, and became the prior art.
Product velocity: 122 commits (Dec) · **615** (Jan) · 217 (Feb) · 21 (Mar) · 18 (Apr) ·
34 (May) · **zero after 2026-05-09**. The terminal commits are all process work
(value-transfer doctrine PDR-022, its bulk-rollback PDR-023, deleting 21 design specs, CI
ordering for guard and docs jobs). The re-entry corpus
(`docs/sessions/reentry-journeys/`, drafted 2026-07-14) states the diagnosis in the repo's own
words: the repo is "unusually hostile to cold-start agents" partly because *"Process is part
of the product. Architect FSM, dual-source annotations, and living docs mean 'just code'
sessions fail process guardrails."*

**What the origin corpus is, concretely.** 22 authored Gherkin specs (5,675 lines) + 23 PDR
decision features + 26 design-stub TS files (6,574 LOC) + 4 release features on the authored
side; on the executable side, **124 `.feature` files / 2,434 scenarios / 830 Rule blocks**
under `packages/platform-core/tests/features/behavior/` that are the platform's *primary test
suite* (123/124 bound to vitest-cucumber step files; 17 deliberately non-executable planning
stubs). Plus `docs-living/`: 333 committed generated files (3.5 MB) frozen at the last commit
date, with internally contradictory progress counters (90/152 in `PATTERNS.md` vs 76/116 in
`REMAINING-WORK.md`) — the committed-projection anti-pattern as a museum exhibit.

**Why the mapping is favorable.** Authored spec → `behavior`-kind Spec at feature altitude;
`Rule:` blocks → `rule` children; scenarios → `example` children; PDRs → `decision` Specs;
`@architect-executable-specs` paths → verifier bindings; the 17 planning-stub features →
declared-but-not-enabled verifiers (the enabled/declared distinction models this exactly);
`@architect-status:completed` → the derived `implemented` fact it always should have been.
The four-tier ladder maps onto the readiness ladder: idea → `idea`, candidate (its
`**Open Questions:**` block is the discriminator) → `scoped`, plan → `defined`, design →
`ready` — each converted Spec entering at the rung its structure earns under the floor, never
at the tier label's word. Two authored surfaces deliberately do **not** migrate: deliverables
tables' per-row `Status` columns are authored delivery claims (the reserved-property refusal
polices the equivalent today — completion derives from anchors, never from a table cell), and
the temporal tags (`@architect-phase` / `-quarter` / `-completed:<date>` / `-release`) drop
entirely — git is the event log.

**The owner's testimony, on the record (2026-07-28).** The specs — both planned and
implemented/executable — *"truly served as replacement for PRDs, and value transfer + docs
generation proved invaluable."* This corrects two earlier framings and this plan carries the
corrected versions. First, the deletion **mechanics** of value transfer dissolve under the
Protocol (gen 0/1 had two artifacts — a planning spec and an executable spec — so
implementation left a redundant copy to distill and delete; the Protocol has one primitive
enriched in place, so the duplicate never exists), but the **outcomes** the doctrine bought
must be preserved on their own terms: the distillation discipline ("distill, don't
transcribe"; one home per explanation), and a corpus that stays lean and live because specs
are *consumed*, not accumulated. What happens to a Spec's design-time detail after its code
ships has no ruling here — that is S0's fourth question, not a solved problem. Second, the
gen-1 playground's projection critique (most projections one-consumer waste) was measured from
the *agent-sink* perspective; the owner's testimony is the *product-management* perspective,
where the generated pattern registry, roadmap, and per-pattern pages were the working PRD
surface. Both are true: the origin's failure was staleness-by-committed-artifact, never
generation itself. The restart should therefore be expected to produce honest second-caller
demand for generated views beyond the Design Review — and that demand goes through the
standing bar (a recipe freezes into a projection when a second machine consumer needs it),
not around it.

**The inward evidence — the usage gaps (engine survey, 2026-07-28; added at revision 2).**
Same-day survey of `src/` (12.6k LOC) and the derived graph, re-checkable with `sdp q` and the
named files:

- **The lower ladder is unexercised.** 115 Primitives: `ready: 80 · defined: 35 · scoped: 0 ·
  idea: 0`. Every forward-looking obligation (the write surface's design session, the
  inline-carrier competition, the gate-leg change, the on-ramp itself) lives in plan prose,
  docket rows, or deferral clauses — none is a Spec, so none appears in the build backlog.
- **Binding asymmetry.** `has-verifier: 80` vs `implemented: 25`; 30 `CodeNode`s against 56
  test/oracle anchors. Verification self-hosting ran far ahead of implementation self-hosting.
- **`verification.mode` is inert.** Authored, parsed (the `Verification — {mode}` heading),
  rendered in the Design Review — and read by no floor clause, validator, or fact.
  `mode: executable` currently *states* nothing checkable.
- **The anchor/binding seam is unobserved.** A `specTest` anchor (what makes an example an
  *enabled* verifier) and a `bindExample` call (what makes it actually run) sit side by side
  by convention only — nothing notices an anchored example whose contract no suite binds.
- **Oracles are example-corpus-only.** Zero `models` edges in the self-hosting graph; the
  `specOracle` machinery is exercised only in `examples/checkout-v1`.
- **The on-ramp gap is real and one-sided.** `.claude/skills/sdp-agent-surface/SKILL.md`
  teaches *reading* the graph (and does it well — the anti-anecdote rule, the eight recipes);
  no surface teaches *authoring against it*. Gen 1's session-typed skills
  (plan / design / implement / review) are evidence this layer mattered in production —
  evidence, never template.

## (c) Charter — what phase 6 is and is not

**Is:** the usage turn. Ruling the questions the origin poses (§d), building the usage layer
and exercising the lower ladder on this repo's own phase-6 requirements (workstream W, §e),
proving the carrier and the verifier linkage on foreign content (S1), adopting the authored
corpus (S2), modeling the origin's restart plan as the first real external backlog (S3), and
producing the measured evidence phase 5 refused to manufacture (S4). Authoring-friction
observations from W and S1–S2 are captured as the evidence base the edit-model has been
waiting for.

**Is not:** another inward self-hosting phase in the phase-1-to-5 sense. No readiness-sweep
ceremony beyond what S0's and W's own edits force; the two-review cadence of phase 5 is not
the standing default — one pre-close review for the S0 rulings session, sized to its diff, and
one for the W close, sized the same way. The `06`/`07` standing gaps (five and three rows)
remain out of scope exactly as plan 22 §5c graded them.

**Honesty guardrails, restated for both soils:** no Spec — origin or inward — is promoted
without a resolving verifier; refusals are named with reasons; a W Spec is authored only for
genuine intended system truth, never as ladder ceremony (an `idea` Spec manufactured to
decorate the backlog is the padding the floor exists to refuse); the S4 measurement is either
instrumented end-to-end or refused with its numbers recorded, exactly as the phase-5
precedent; and no origin behavior is silently promoted into intent — where the origin's
authored specs and its code disagree, that is drift to record, not to resolve unilaterally.

## (d) S0 — the rulings (this repo; PLAN → decision Specs where the bar is passed)

Four questions the origin forces, none answerable by silence:

1. **The temporal/planning axis.** The origin's phases 13–100, quarters, releases, efforts,
   and tranches were load-bearing for planning a large platform; gen 1 retired them and the
   Protocol inherited the retirement (de-temporalization, plan 05). Proposed ruling: the model
   stays atemporal — **Packs are the lawful home for wave/tranche-shaped aggregates**, the
   build backlog (`ready ∧ ¬implemented`) replaces the roadmap document, and dates live in git
   and plans, never in descriptors. This passes the ADR three-part test (hard to reverse once
   a corpus is authored against it; surprising — a delivery protocol with no schedule axis; a
   real trade-off against restart-planning ergonomics) → candidate decision Spec
   `spec:decisions.atemporal-planning` unless drafting shows the base already forced it, in
   which case it is drift repair and rides the plan record only.

2. **The Gherkin stance.** Proposed ruling: **the executable Gherkin corpus is not migrated.**
   The 124 features stay exactly where they are as the verifier layer — anchors bind them,
   `verifies` edges carry the linkage — and only the ~45 authored specs/PDRs are re-authored
   as `.sdp.md`. No `.feature → .sdp.md` importer is built at this bar (one caller, and the
   fleet path in S2 is cheaper than a parser). Named-and-deferred, not stubbed, exactly as
   `bySymbol` is.

3. **Design stubs.** The origin's 26 DS-stub files (compiling TS targeted at future paths via
   `@architect-target`) have no Protocol home. Proposed disposition: their *content* value
   lands in the carrying Spec's `design` section during S2 where still live, and the rest is
   evidence for the edit-model design — not a new artifact type. Any stronger mechanism waits
   for the write surface.

4. **The enrichment lifecycle** (raised by the owner's value-transfer testimony, §(b)). The
   Protocol rules what a Spec is *before* implementation (the floor) and what may never be
   authored (delivery vocabulary), but is silent on what happens to a Spec's design-time
   detail *after* its code ships — the content gen 1 classified as scaffold and deleted, and
   whose deletion discipline kept that corpus lean and consumed rather than accumulated. The
   Protocol's one-primitive answer ("enriched in place, never migrated") implies the honest
   equivalent is **slimming in place**: post-implementation, design-time detail either
   distills into the durable sections or is removed, with git holding the history. S0 does
   not have to rule the full policy — the origin corpus is too young in Protocol terms — but
   it must at least *scope* the question on the record (a named open question on the carrying
   model Spec is the minimum), so the corpus-growth curve has an owner before S2 makes it
   real. Content-quality judgment stays out of validators either way — checks police
   conformance and honesty, never distillation.

Two engine questions added at revision 2, forced by the executable-transition goal (§a-3) —
each is *named* at S0 and ruled only if drafting shows the base forces an answer; neither
authorizes speculative building:

5. **What may `verification.mode: executable` honestly state?** Today the field states
   nothing checkable. Candidate: a **warn-level signal** — a Spec stating
   `mode: executable` whose examples carry no enabled verifier is *stating a verification
   posture it has not realized*, the same honesty family as `honesty/gaps` (informative,
   never a gate). Counter-position: the field is descriptive authoring intent and policing it
   drifts toward content-quality. S0 decides which reading the base forces, or records the
   question on the carrying validation Spec.

6. **The anchored-but-unbound seam.** An example can be an enabled verifier (resolvable
   `specTest` anchor) while no suite binds its generated contract — the verifier *exists* and
   is structurally honest, but the step-contract drift protection silently does not apply.
   Candidate: a warn-level signal or a recipe (W3 ships the recipe regardless; the signal is
   ruled only if the recipe proves the join is one agents hand-roll wrong — the standing
   freeze bar, applied to a validator).

Also carried in S0, from plan 22 §5c: **the rule-6 bound point** on
`spec:extraction.build-pipeline` (its world now exists — `sdp q` goes through the one
extraction-and-validation seam; one point converts the strongest candidate the Spec has ever
had, and S0 is the natural session because it is this repo's first execution window in the
phase), and **the gate-leg question** for `check-self-hosting-gates.mjs` (a process change no
standing ruling authorizes; put to the owner at the S0 close as a yes/no, and wired into
`npm run check` only on a yes).

### S0 execution disposition

The three-part test was written before the carrying Specs changed:

| Candidate | Hard to reverse | Surprising without context | Real trade-off | Disposition |
|---|---|---|---|---|
| Atemporal planning | no new choice remains after the ratified descriptors, git-event-log law, and release-as-tag projection | no — the base already says schedule is not a Spec coordinate | no remaining representation trade-off | **fails admission** — no decision Spec. Packs may group wave-shaped review sets but never order them; the build backlog expresses eligibility, not a roadmap |
| Verification posture | yes — authored meaning becomes durable across carriers and consumers | yes — `mode: executable` can otherwise be mistaken for a realized verifier | yes — intended posture versus realization-derived honesty signal | **passes** — add the verification-posture-not-realization decision and no validator |
| Records-gate wiring | yes for repository process, not product semantics | yes — the historical audit looked like a perpetual phase template | yes — gate coverage versus mandatory legacy ceremony | **internal process ruling** — freeze plan-17/18 checks, require only universal current-record invariants, and wire the generalized audit |

Anchored-but-unbound detection is explicitly deferred: `bindExample` call sites are not graph data,
so neither a signal nor a recipe can compute the claim honestly. The rule-6 bound point is added,
but `spec:extraction.build-pipeline` remains `defined` because one point does not cover its ordered
workflow. The enrichment-lifecycle question enters at `scoped` and remains blocking.

**S0 gate evidence.** The generalized records audit accepts the current plan without imposing the
historical ledger shape. A mutated plan-17 owner-packet SHA fails with the historical surface
named; a handbook changed from `plan 23 is EXECUTING` to the stale plan-22 status fails both current
status invariants. The query-seam point passes through the real CLI/extractor, and replacing its
validation subjects with an empty result reddens exactly that point. The complete thirteen-leg
Protocol gate passes with `spec:extraction.build-pipeline` still stated `defined`.

## (e) W — the usage layer (this repo; execution sessions after S0)

The workstream that makes the four usage goals deliverables instead of hopes. Everything in W
is graph-read guidance and authored corpus — no new engine surface, no write path, no gate.

**W1 — spec-first self-application (the working ladder).** Phase 6's own intended
capabilities are authored as Specs *before* they are built, entering at the rung their
structure earns — expected: `idea` or `scoped` — and enriched in place as W proceeds:

- the authoring on-ramp (candidate `spec:consumers.authoring-on-ramp`, `behavior` at
  `feature`);
- the authoring-recipe additions (a clause or child on `spec:consumers.agent-surface`'s
  recipe family, not a new namespace);
- the two candidate signals from §d-5/6, *if and only if* S0 rules them in (a ruled-out
  signal gets no Spec — refusal, not decoration).

Sessions in W and after it open with the build-backlog and drift-alarm recipes — the plan
file stays the session record, but **what** is owed lives in the graph. Acceptance: the
corpus contains its first honestly-stated `idea`/`scoped` Specs; each one appears in (or
honestly outside) the build backlog for a stated reason; not one is promoted past its
structure. The guard from §(c) applies with teeth: if a candidate has no genuine intended
truth, it is not authored — three real Specs beat eight ceremonial ones.

**W2 — the authoring on-ramp skill.** A second Protocol-shipped skill beside the reading
skill — working name `.claude/skills/sdp-authoring/` — teaching the full lifecycle without
gating any of it:

- **create**: the envelope, the ID grammar, the carrier (`.sdp.md` by default, MD-18), where
  a new Spec enters (`idea`: id · title · kind · altitude · an outcome or a parent relation);
- **enrich**: what each rung's floor actually reads (the kind-evidence table), `scoped` →
  `defined` as evidence-present → evidence-complete, the concreteness law for examples, the
  open-questions home (MD-9), promotion vs inline (MD-10);
- **the executable transition**: example space on the parent (`gwt-vocabulary` fence) →
  bound point on the child (`gwt` fence) → `sdp build` emits the step/space contracts →
  `bindExample` + `specTest` side by side in the suite → **mutation-probe red before
  promotion** (the process discipline, stated as discipline, never as a check);
- **anchor**: when a `codeAnchor` is owed (the code that realizes a Spec's truth), the
  binding-only law (id · one target · label — anything else refuses), one binding per anchor;
- **state `ready`**: the floor cleared *plus* a human's declared statement, in Design Review
  context; `ready` is never conferred by tooling;
- **query throughout**: every step above names the recipe that answers its question.

The skill obeys the anti-anecdote rule (the derived graph outranks the skill) and draws on
gen 1's session-typed skills as evidence of shape, never as template. It is drafted in W,
then **revised from S1's friction log** — the origin tracer is its first foreign user.

**W3 — the authoring recipes.** Three bodies extend the catalog from eight to eleven, each
executed verbatim by the recipe check and read-only over `g` / `graph` / `report`:

1. **The promotion preflight** — for a Spec id: stated rung, floor reached, current floor
   failures, and an explicit human-statement reminder.
2. **The declared-versus-enabled verifier audit** — keeps authored example relations distinct
   from resolving graph-visible verifier bindings.
3. **The lower-ladder view** — every non-ready Spec grouped by family with its current first
   graph-visible unmet clause.

There is no query-time contract ledger: `contracts/*` findings are emitted only by `sdp build`.
There is no anchored-but-unbound recipe: `bindExample` call sites are not extracted graph data.
The authoring skill teaches both limits instead of shipping a body that cannot compute its claim.

The freeze rule stands: these are recipes; a join moves into the `reader` only at the
second-caller bar with evidence agents hand-roll it wrong.

**W4 — the friction instrument, widened.** One row per converted or authored Spec records source
and target ids/files; anchor, ladder, executable-transition, and CLI friction; and three measured
booleans — `leafAltitude`, `singleModule`, `under30Lines` — plus their combined inline-candidate
result and disposition. W rows begin below; S1 imports them verbatim into the origin ledger with
`sourceRepo`, and that file becomes canonical. S2 reports numerator, denominator, and percentage
without turning the result into a carrier ruling.

| sourceRepo | source id/file | target id/file | anchor friction | ladder friction | executable-transition friction | CLI friction | leafAltitude | singleModule | under30Lines | inline candidate | disposition |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---|
| Protocol | `specs/consumers/authoring-on-ramp.sdp.md` | `spec:consumers.authoring-on-ramp` / same file | a Markdown skill cannot carry an extracted anchor, so validating code owns the binding | entered low and matured only after the shipped asset and verifier existed | taught, not itself a bound example | the first fresh-context run invoked macOS `/usr/bin/sdp`; the skill now requires the repository-local CLI or an adopter package runner, and root-specific versus portable invocations have separate checks | false | true | true | false | keep standalone: feature-sized workflow |
| Protocol | `specs/consumers/agent-surface.authoring-recipes.sdp.md` | `spec:consumers.agent-surface.authoring-recipes` / same file | in-tree recipe/skill checks own both bindings | matured after all three bodies returned complete graph-derived sets | not applicable | portable wording initially competed with mandatory exclusions; parameterized tests resolved it | true | false | true | false | keep standalone: multiple recipe and test modules |
| Protocol | `specs/consumers/intent-composition.sdp.md` | `spec:consumers.intent-composition` / same file | none while the realizing surface is absent | deliberately states `idea` even though its minimal structure clears higher floors | deferred with the absent surface | none | true | true | true | true | measure only; no carrier ruling follows |

**W close evidence (2026-07-28).** A fresh, ephemeral, read-only `codex exec` context followed
the corrected authoring skill and reported `spec:model.enrichment-lifecycle` as stated
`scoped`, floor `scoped`, blocked by its authored post-implementation slimming question, with
`spec:model.enrichment-lifecycle` as the carrier. The first attempt had resolved bare `sdp` to
macOS `/usr/bin/sdp`; that observed friction produced the repository-local/package-runner rule
now checked for both shipped skills. The package smoke test additionally installs the packed
snapshot and reads both exact skill paths from the installed package. The S1 fresh-context run
then found that a copied skill could not resolve the repository-root recipe path from an adopter;
both skills now name the Protocol-root and installed-package catalog paths explicitly, and the
in-tree check pins both forms.

## (f) S1 — the tracer bullet on foreign soil (origin repo)

Hand-convert one coherent cluster — proposed: `production-hardening` (the largest authored
spec, 26.8 KB, `roadmap`, with its 7-file executable directory of planning stubs) plus 2–4 of
its neighbors — into `.sdp.md` under an `sdp/`-rooted corpus in the origin repo, bind anchors
to the existing code and the existing `.feature` verifiers, and run the full recipe catalog
over the derived graph. **Tracer-bullet discipline applies unchanged:** if the origin content
stops extracting or validating, fix the carrier or extractor here — never fork the grammar in
the consumer.

Deliverables: the converted cluster extracting at 0 errors; all eleven recipes returning honest
answers about it (the 17 planning stubs must surface as
declared-not-enabled, not as coverage); the friction log per W4. **Usage acceptance, added at
revision 2:** the converted cluster spans **all four rungs** honestly (the origin's four-tier
ladder guarantees candidates for each — no rung is manufactured, and none is skipped by
convenience-rounding everything to `defined`); **at least one end-to-end executable
transition** lands on foreign soil — one example carried from prose to an enabled,
contract-bound, mutation-probed verifier through the W2 workflow, with the origin's
vitest-cucumber suite untouched beside it; and the W2 skill is exercised as written, with
every divergence logged as a skill bug or a friction entry, never silently absorbed.

## (g) S2 — the fleet backfill (origin repo)

Convert the remaining authored surface (~17 specs, 23 PDRs, 4 release features → Pack/plan
dispositions per S0) using the gen-1 annotation-fleet playbook (parallel agents, small
batches, per-batch verification against the derived graph — the origin's own fleet measured
92% and 21/21 pass rates on comparable work). Every converted Spec enters at the readiness
its structure earns and not one rung higher; `@architect-status:completed` claims are checked
against resolving verifiers before any `ready` statement. Expected outcome: an origin graph
of roughly 150–300 nodes — the first corpus at 2–3× self-hosting scale, which is also the
first real test of `sdp q`'s derive-per-invocation latency (S4 measures it).

## (h) S3 — the restart plan as the first external backlog (origin repo)

Model the origin's own restart sequencing (its J5 strawman: green rails → phase-debt
disposition → Agent-BC vertical → tranche-0 hardening → vision work) as Specs with honest
readiness — **expected to enter overwhelmingly at `idea` and `scoped`**, which is the point:
this is the lower ladder doing the job it was designed for, at production scale, one
workstream after W1 rehearsed it inward. The deliverable is the origin's build backlog and
drift alarm answering from the derived graph — the exact questions its re-entry journey
documents were hand-written to approximate, now live instead of rotting. New work authored
during the restart follows the W2 workflow end-to-end (spec-first, enrich, transition,
anchor), which makes S3 the standing test of whether the on-ramp teaches or merely describes.
This stage is where the stalled project's "waiting for a new solution" ends operationally:
the restart plan is *in* the Protocol.

## (i) S4 — the measurement, done honestly this time (origin repo)

The phase-5 refusal named its own missing instrument: token accounting over two real agent
sessions. The origin provides the honest setting — a year-paused repo with a hand-authored
re-entry corpus as the control arm. Design: matched cold-start sessions on the same re-entry
questions (J1/J3-shaped: "what is real vs aspirational," "what breaks if I change X"), one arm
on journeys + grep, one arm on the skill + `sdp q`, with per-session token totals captured
from the harness. Also measured: extraction latency at S2 scale. Both numbers publish with
their design stated, or the attempt is refused with its numbers recorded — the phase-5
precedent is the standard.

## (j) What this plan does not do

- **No write surface.** The edit-model's fourth rule still refuses; W's and S1/S2's friction
  log is the evidence its design has been waiting for, and the design session is the
  successor's.
- **No Gherkin importer, no `bySymbol`, no impact graph** — each named-and-deferred at the
  second-caller bar, with S2/S4 expected to produce the demand signal that either converts or
  retires them.
- **No new validators without an S0 ruling.** §d-5/6 name two candidate warn-level signals;
  neither is built unless S0 finds the base forces it — W3's recipes carry the joins either
  way, and a recipe that proves sufficient *retires* its signal candidate.
- **No inline carrier — yet, and named rather than silent.** An in-code (JSDoc/comment-block)
  Spec carrier is a **recognized candidate**, deferred to a carrier-competition round gated on
  S2's friction evidence. The demand hypothesis: leaf-altitude, single-module Specs (a rule of
  one decider, an NFR of one store) fight the separate-file carrier hardest, and the origin's
  fleet results (92%, 21/21) were achieved *because* its carrier was inline. The instrument is
  W4's first tally: each converted Spec logged as leaf-altitude/single-module/under-30-lines
  or not, so the carrier-competition gate reads a measured population, not an impression. If
  that population is large, the response is a competition round in the MD-18 style — same
  envelope statically extractable, loud refusals (no bare-marker invisible nodes), parity
  fixtures against the Markdown form, duplicate-id policing the two-carriers-one-ID case, and
  **no delivery vocabulary inline** (the reserved-property refusal applies unchanged). Judged
  on exhibits, not on gen-1 nostalgia and not on this plan's prediction.
- **No new projections authored on speculation.** The owner's testimony (§(b)) predicts the
  restart will demand generated views beyond the Design Review (a roadmap/current-work
  surface, most likely); when a second machine consumer materializes, the standing
  recipe-to-projection bar converts it — never a pre-emptive generator suite, and never a
  committed artifact answering in the graph's name.
- **No session-typed workflow layer beyond the on-ramp.** Revision 1 deferred the whole
  authoring-workflow question; revision 2 pulls in exactly one artifact — the W2 skill,
  guidance that teaches without gating. Gen 1's full session taxonomy
  (plan / design / implement / review-spec / review-implementation / handoff) stays evidence;
  whether more skills are owed is a question W4's log answers for a successor, not this plan.
- **No inward readiness sweep.** The 35 standing refusals stand; nothing here promotes them.
  (W1 *adds* low-rung Specs; it promotes nothing existing.)

## (k) Sequencing and session shape

**S0** is one session in this repo (rulings §d-1..6 + the rule-6 point + the gate-leg
question), with one pre-close review sized to its diff. **W** follows in this repo — W1+W3
land together (the backlog Specs and the recipes that read them), W2 lands against them, W4
opens as a running log; one review at the W close, sized to its diff. **S1–S4** execute in the
origin repo as its own plan family (the origin carries its own plans; this repo's record
tracks only what changes here) — S1 gates S2; S2 gates S3 and S4's latency arm; S4's token arm
can run any time after S1. W2's skill is revised from S1's friction log as a small follow-up
session here.

The phase closes when S0 and W have landed here, S1's tracer extracts green in the origin
with its usage acceptance met, and the friction log exists with all four tallies live — the
rest is the origin's delivery, run under the Protocol it just adopted.

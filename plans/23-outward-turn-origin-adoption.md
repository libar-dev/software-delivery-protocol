# Plan 23 — The outward turn: origin adoption and the second-caller evidence

> **Status:** DRAFTED — PLAN-ONLY. No target file is touched under this plan until an execution
> session is designated. The latest ✅ EXECUTED ground is **plan 22** (self-hosting phase 5: the
> `05` dissolution and the agent front door; corpus at 115 Specs · 1 Pack · 86 anchors →
> 202 nodes · 397 edges · `ready: 80 / defined: 35`, 0 errors / 0 warnings). This plan proposes
> **phase 6 as the outward turn**: adopting the Protocol on the origin project
> (`new-convex-es` / `libar-platform`) — the stalled production codebase whose delivery process
> gave rise to the prior art in the first place — and producing the second-caller evidence the
> corpus cannot produce about itself. Stages S1–S4 execute in the origin repo with
> `@libar-dev/software-delivery-protocol` as a dependency; only S0 (rulings) and the two carried
> §5c items touch this repo.
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

## (c) Charter — what phase 6 is and is not

**Is:** the outward turn. Ruling the three questions the origin poses (§d), proving the
carrier and the verifier linkage on foreign content (S1), adopting the authored corpus (S2),
modeling the origin's restart plan as the first real external backlog (S3), and producing the
measured evidence phase 5 refused to manufacture (S4). Authoring-friction observations from
S1–S2 are captured as the evidence base the edit-model has been waiting for.

**Is not:** another inward self-hosting phase. No readiness-sweep ceremony beyond what S0's
own edits force; the two-review cadence of phase 5 is not the standing default — one pre-close
review for the S0 rulings session, sized to its diff. The `06`/`07` standing gaps (five and
three rows) remain out of scope exactly as plan 22 §5c graded them.

**Honesty guardrails, restated for foreign soil:** no origin Spec is promoted without a
resolving verifier; refusals are named with reasons; the S4 measurement is either instrumented
end-to-end or refused with its numbers recorded, exactly as the phase-5 precedent; and no
origin behavior is silently promoted into intent — where the origin's authored specs and its
code disagree, that is drift to record, not to resolve unilaterally.

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

Also carried in S0, from plan 22 §5c: **the rule-6 bound point** on
`spec:extraction.build-pipeline` (its world now exists — `sdp q` goes through the one
extraction-and-validation seam; one point converts the strongest candidate the Spec has ever
had, and S0 is the natural session because it is this repo's only execution window in the
phase), and **the gate-leg question** for `check-self-hosting-gates.mjs` (a process change no
standing ruling authorizes; put to the owner at the S0 close as a yes/no, and wired into
`npm run check` only on a yes).

## (e) S1 — the tracer bullet on foreign soil (origin repo)

Hand-convert one coherent cluster — proposed: `production-hardening` (the largest authored
spec, 26.8 KB, `roadmap`, with its 7-file executable directory of planning stubs) plus 2–4 of
its neighbors — into `.sdp.md` under an `sdp/`-rooted corpus in the origin repo, bind anchors
to the existing code and the existing `.feature` verifiers, and run the full recipe catalog
over the derived graph. **Tracer-bullet discipline applies unchanged:** if the origin content
stops extracting or validating, fix the carrier or extractor here — never fork the grammar in
the consumer. Deliverables: the converted cluster extracting at 0 errors; the eight recipes
returning honest answers about it (the 17 planning stubs must surface as
declared-not-enabled, not as coverage); a friction log — every place the grammar, the
envelope, or the binding model fought the content — as the S2 playbook input, the edit-model
evidence base, and the inline-carrier instrument (§(i)): each converted Spec is tallied as
leaf-altitude/single-module/under-30-lines or not, so the carrier-competition gate reads a
measured population, not an impression.

## (f) S2 — the fleet backfill (origin repo)

Convert the remaining authored surface (~17 specs, 23 PDRs, 4 release features → Pack/plan
dispositions per S0) using the gen-1 annotation-fleet playbook (parallel agents, small
batches, per-batch verification against the derived graph — the origin's own fleet measured
92% and 21/21 pass rates on comparable work). Every converted Spec enters at the readiness
its structure earns and not one rung higher; `@architect-status:completed` claims are checked
against resolving verifiers before any `ready` statement. Expected outcome: an origin graph
of roughly 150–300 nodes — the first corpus at 2–3× self-hosting scale, which is also the
first real test of `sdp q`'s derive-per-invocation latency (S4 measures it).

## (g) S3 — the restart plan as the first external backlog (origin repo)

Model the origin's own restart sequencing (its J5 strawman: green rails → phase-debt
disposition → Agent-BC vertical → tranche-0 hardening → vision work) as Specs with honest
readiness. The deliverable is the origin's build backlog and drift alarm answering from the
derived graph — the exact questions its re-entry journey documents were hand-written to
approximate, now live instead of rotting. This stage is where the stalled project's "waiting
for a new solution" ends operationally: the restart plan is *in* the Protocol.

## (h) S4 — the measurement, done honestly this time (origin repo)

The phase-5 refusal named its own missing instrument: token accounting over two real agent
sessions. The origin provides the honest setting — a year-paused repo with a hand-authored
re-entry corpus as the control arm. Design: matched cold-start sessions on the same re-entry
questions (J1/J3-shaped: "what is real vs aspirational," "what breaks if I change X"), one arm
on journeys + grep, one arm on the skill + `sdp q`, with per-session token totals captured
from the harness. Also measured: extraction latency at S2 scale. Both numbers publish with
their design stated, or the attempt is refused with its numbers recorded — the phase-5
precedent is the standard.

## (i) What this plan does not do

- **No write surface.** The edit-model's fourth rule still refuses; S1/S2's friction log is
  the evidence its design has been waiting for, and the design session is the successor's.
- **No Gherkin importer, no `bySymbol`, no impact graph** — each named-and-deferred at the
  second-caller bar, with S2/S4 expected to produce the demand signal that either converts or
  retires them.
- **No inline carrier — yet, and named rather than silent.** An in-code (JSDoc/comment-block)
  Spec carrier is a **recognized candidate**, deferred to a carrier-competition round gated on
  S2's friction evidence. The demand hypothesis: leaf-altitude, single-module Specs (a rule of
  one decider, an NFR of one store) fight the separate-file carrier hardest, and the origin's
  fleet results (92%, 21/21) were achieved *because* its carrier was inline. The instrument:
  S1/S2's friction log tallies which converted Specs are leaf-altitude, single-module, and
  under ~30 lines. If that population is large, the response is a competition round in the
  MD-18 style — same envelope statically extractable, loud refusals (no bare-marker invisible
  nodes), parity fixtures against the Markdown form, duplicate-id policing the two-carriers-
  one-ID case, and **no delivery vocabulary inline** (the reserved-property refusal applies
  unchanged). Judged on exhibits, not on gen-1 nostalgia and not on this plan's prediction.
- **No new projections authored on speculation.** The owner's testimony (§(b)) predicts the
  restart will demand generated views beyond the Design Review (a roadmap/current-work
  surface, most likely); when a second machine consumer materializes, the standing
  recipe-to-projection bar converts it — never a pre-emptive generator suite, and never a
  committed artifact answering in the graph's name.
- **No workflow layer — but the on-ramp gap is named.** Gen 1's session-typed skills
  (plan / design / implement / review-spec / review-implementation / handoff) were mature
  *working guidance* the Protocol has no equivalent of — the shipped skill teaches reading
  the graph, not authoring against it. The origin adoption will need an authoring-workflow
  on-ramp (a skill, possibly Protocol-shipped) that teaches sessions without gating them —
  guidance is lawful where gates are not. Scoped as a named successor artifact, informed by
  S1/S2; not built here.
- **No inward readiness sweep.** The 35 standing refusals stand; nothing here promotes them.

## (j) Sequencing and session shape

S0 is one session in this repo (rulings + rule-6 point + the gate-leg question), with one
review sized to its diff. S1–S4 execute in the origin repo as its own plan family (the origin
carries its own plans; this repo's record tracks only what changes here). S1 gates S2; S2
gates S3 and S4's latency arm; S4's token arm can run any time after S1. The phase closes when
S0 has landed here and S1's tracer extracts green in the origin — the rest is the origin's
delivery, run under the Protocol it just adopted.

# Plan 24 — The inward turn: self-hosting as the standing practice

> **Status:** DRAFTED — PLAN-ONLY. No target file is touched under this plan until an execution
> session is designated. The latest ✅ EXECUTED ground is **plan 23** (phase 6: the usage turn —
> the S0 rulings, the records gate, the usage layer W, and the origin adoption; Protocol corpus
> at 121 Specs · 1 Pack · 91 anchors → 213 nodes · 416 edges, `ready: 83 / defined: 36 /
> scoped: 1 / idea: 1`, 0 findings). The origin adoption lives on its own PR
> (libar-ai/convex-event-sourcing#181) awaiting the owner's review; **nothing in this plan
> depends on that decision**, and no session under this plan touches the origin repo. This plan
> proposes **phase 7 as the inward turn**: self-hosting as the *operating mode* — the Protocol's
> own forward work managed as Specs through its own ladder, every engine change delivered
> spec-first with executable verification, and the graph (not plan prose) carrying what is owed.
> This is the original intention of the self-hosting program resumed: **validation and iteration
> on the Protocol, by the Protocol.**
>
> **What revision 2 changed** (2026-07-28, same-day graph re-measurement — every number below
> was re-derived by query, none inherited): (1) §b gains the composition facts that reshape S1 —
> the 64-row backlog is **51 example spaces + 13 laws**, every row already verifier-bound; the
> 8 drift rows are **one cluster** (the dissolved concept-doc Specs) whose floors already derive
> `ready`; all 37 stated/derived divergences are under-claims, zero over-claims. (2) S1 is
> restructured around **one kind-level ruling** — what `implemented` honestly means for an
> example-kind Spec — applied once, instead of 64 per-row decisions; the ceremonial third path
> (51 hand anchors) is named and forbidden. (3) The drift disposition is corrected: the floor is
> already met on all 8 rows, so the work is refusal re-argument, never enrichment. (4) S2 gains
> the example-`implemented` derivation as a candidate slice, contingent on S1's ruling. (5) The
> phase milestone is stated once in §a: the proper self-hosted setup — annotations honest, the
> agent CLI the standing working surface, Specs carried through to executable Specs — enabling
> iteration on the Protocol's design and implementation by the Protocol. (6) The delivery
> vehicle is named (§i): execution expands PR #15. (7) The Vitest 2→4 migration debt recorded
> at the plan-23 close is carried as a named non-Spec chore (§g). The charter, the honesty
> guardrails, and S0 stand as drafted.
>
> **Spec anchors:** [the agent front door](../specs/decisions/agent-front-door.sdp.md)
> (`spec:decisions.agent-front-door`, MD-22) · [the verification-posture ruling](../specs/decisions/verification-posture-not-realization.sdp.md)
> (`spec:decisions.verification-posture-not-realization`, MD-23) ·
> [the intent-composition seed](../specs/consumers/intent-composition.sdp.md)
> (`spec:consumers.intent-composition`) · [the enrichment lifecycle](../specs/model/enrichment-lifecycle.sdp.md)
> (`spec:model.enrichment-lifecycle`) · plan 23 §(e) W (the usage layer this plan now *uses*).

## (a) Why this plan

Phase 6 built the usage layer and bought the first second-caller evidence, but by charter it was
not an inward phase: the Protocol repo received the tools of self-hosting practice without the
practice itself. The gap, re-measured at revision 2:

1. **The graph knows what is owed, but nothing works off it.** The build backlog
   (`ready ∧ ¬implemented`) stands at **64** Specs and the drift alarm at **8** — both now
   queryable by recipe — while the Protocol's actual forward work (the write surface, the
   observed rung, the impact graph, the Pack syntax question) still lives in plan prose,
   deferral clauses, and `06`/`07` gap rows. The product's headline claim is that the graph is
   the working surface; its own repo still works from documents.
2. **The lower ladder holds two tokens, not a practice.** `idea: 1 / scoped: 1` — the first
   honest low-rung Specs exist (phase 6, W1), but no session has yet *managed* work through
   them: entered at `idea`, enriched on evidence, promoted on the floor, implemented off the
   backlog.
3. **The binding layer is one-sided — and the asymmetry has a shape.** `has-verifier` reaches
   **84** of 121 Specs; `implemented` reaches **27**. Re-measurement locates the gap precisely:
   **all 64 backlog rows already carry verifiers**, and **51 of the 64 are example-kind
   Specs** — condition grids whose suites are bound and green while the fact that would call
   them "built" is absent. Several belong to parents that *are* implemented
   (`spec:consumers.reader` is implemented; its three example spaces sit on the backlog as
   "unimplemented" — a claim no honest reading supports). The asymmetry is concentrated in one
   kind, which makes most of the audit a single semantics ruling, not 64 binding decisions. The
   defect is in the derived facts' *input*, not in the derivation.
4. **The oracle machinery has never run on this corpus.** Zero `models` edges in the
   self-hosting graph; `specOracle` is exercised only in `examples/checkout-v1`. The
   executable half's most distinctive piece has no second caller — and self-hosting *is* the
   cheapest second caller available.
5. **Standing deferrals now have their evidence and no disposition.** The inline-carrier
   instrument came back **1/57 (1.75%)** — a population that argues for *retiring* the
   deferral, not pursuing it. The edit-model has its friction evidence and its `idea`-rung
   seed. Neither has been acted on.

The thesis: **phase 7 makes the Protocol its own first-class user.** Sessions open from the
graph, forward work enters as Specs at honest rungs, engine changes go spec-first through the
executable loop, and the phase is judged by whether the loop *iterated* — authored → enriched →
implemented → bound → verified → slimmed — on real engine work, not by corpus growth.

**The milestone, stated once.** What the phase must leave standing is the proper self-hosted
setup: **annotations** honest and complete (every backlog and drift row deliberate — bound,
refused, or known-real), the **agent CLI** as the standing working surface (every session opens
from recipes, never from prose), and **Specs carried through to executable Specs** (the oracle
machinery bound inward; at least one engine change delivered spec-first with executable
verification end to end). That setup — not any corpus number — is what enables iteration on the
Protocol's design and implementation *by the Protocol*, and it is the standard §i's close
criteria encode.

## (b) Ground truth at revision 2 (re-derived by query, not inherited)

- Corpus: 121 Specs · 1 Pack · 91 anchors → 213 nodes · 416 edges · 0 errors / 0 warnings;
  `ready: 83 / defined: 36 / scoped: 1 / idea: 1`. Delivery facts: `implemented` 27 ·
  `has-verifier` 84 · `models` edges 0.
- **Backlog 64, with composition:** 51 `example` + 11 `rule` + 1 `behavior`
  (`spec:carrier.sdp-import`) + 1 `constraint` (`spec:extraction.determinism`). All 64 carry
  `has-verifier`. The eleven rules: `spec:consumers.binding-language-views` ·
  `spec:consumers.derived-readiness-banner` · `spec:consumers.wholesale-view-rewrite` ·
  `spec:validation.authored-honesty` · `spec:validation.claim-separation` ·
  `spec:validation.diagnostic-rendering` · `spec:validation.kind-evidence` ·
  `spec:validation.pack-coherence` · `spec:validation.referential-integrity` ·
  `spec:validation.verification-linkage` · `spec:validation.warn-level-signals`. Note the
  coupling: most of these laws themselves own example spaces on the backlog, so S1's kind
  ruling and the 13 law bindings interact (§e).
- **Drift 8, one cluster:** `spec:model.core-model` · `spec:model.spec-sections` ·
  `spec:model.relations` · `spec:model.pack-aggregate` · `spec:extraction.claim-taxonomy` ·
  `spec:extraction.regenerability` · `spec:consumers.projections-model` ·
  `spec:carrier.markdown-authoring` — all dissolved-concept-doc Specs held at `defined`, and
  **all eight derive `ready`**: the floor already passes; only the standing refusals hold the
  rung.
- **Readiness divergence: 37 Specs, all under-claims** (stated below derived), zero
  over-claims — the corpus's conservatism is uniform in the honest direction.
- Assets shipped by phase 6 and now to be *used*: the `sdp-authoring` skill (the full
  create → enrich → transition → anchor → state-`ready` workflow), eleven recipes (including
  promotion preflight, verifier audit, lower-ladder view), the records gate as a required
  check leg, the adopter package contract, MD-23.
- Standing refusals: the 35 `defined` Specs refuse for named reasons (22 decisions ·
  7 vocabulary · 3 whole-pipeline · 3 singletons); **they stand** — this plan promotes nothing
  by sweep.
- Standing deferrals with state: inline carrier (instrument answered: 1/57 — retirement
  candidate); edit-model / write surface (friction evidence + `spec:consumers.intent-composition`
  at `idea`); anchored-but-unbound (deferred — `bindExample` is not graph data); `bySymbol` /
  impact graph (aspirational, `06` gap row 8a); `observed` rung (aspirational, no producer);
  Pack Markdown syntax (unruled — the one carrier question MD-18 left open); `06` five gap
  rows · `07` three gap rows (graded out of scope at plan 22 §5c, unchanged since).
- **Carried debt (non-Spec):** the plan-23 close records 8 development-dependency advisories
  (3 moderate · 4 high · 1 critical) whose actionable aggregate fix is a **Vitest 2→4 major
  migration** — deliberately recorded, not silently folded in. It changes the test runner, not
  the shipped runtime surface. Disposition in §g.
- Review soft spots carried from the phase-6 close, for the hygiene pass (§g): the
  recipe-count prose in `AGENTS.md`/the reading skill is unguarded (staleness recurs at recipe
  twelve); the records-gate discovery logic is duplicated between script and test (accepted,
  watch for drift); the document-realization anchor convention is authored discipline with no
  validator (by design — record only).

## (c) Charter — what phase 7 is and is not

**Is:** the inward practice. Converting the genuine forward intent into low-rung Specs and
managing it there (S0); completing the implementation-binding layer honestly — one kind ruling
plus thirteen law dispositions, not a binding sweep (S1); running the oracle machinery on this
corpus (S1); delivering at least one real engine improvement through the full spec-first
executable loop, selected *from the backlog by recipe at the session start* (S2);
dispositioning the deferrals whose evidence has arrived (S0); and exercising the enrichment
lifecycle's slimming half on at least one implemented Spec so
`spec:model.enrichment-lifecycle`'s question gains its first observed case (S2).

**Is not:** an origin phase — PR #181 is the owner's decision and no session here touches that
repo (if the owner later wants the adoption resumed, revised, or abandoned, that is its own
plan). Not a readiness sweep — the 35 refusals stand unless new verifiers *naturally* convert
one, in which case the promotion is argued individually against the floor. Not an engine
expansion — no write surface build, no `bySymbol`, no `observed` producer, no MCP; those enter
as `idea`/`scoped` Specs (S0) and *wait on the backlog like everything else*. Not a workflow
layer — the one skill suffices until the inward friction log says otherwise.

**Honesty guardrails:** a Spec is authored only for genuine intended system truth — three real
low-rung Specs beat eight ceremonial ones, and a refusal to author is recorded with its reason;
an anchor is added only where code genuinely realizes the Spec's truth (a law realized by many
files diffusely gets a named refusal, never a token anchor — and **51 hand anchors on example
spaces would be the same sin at scale**, forbidden by name in §e); no promotion without the
floor and a fresh human statement; every session opens with the build-backlog and drift-alarm
recipes and closes with the gate green.

## (d) S0 — the backlog becomes Specs; the evidenced deferrals get dispositions

One session. Two halves.

**The conversion half.** Survey the standing forward intent (the deferral clauses, the `06`/`07`
gap rows, the phase-6 successor notes) and author the genuine capabilities as Specs entering at
the rung their structure earns — expected `idea`, some `scoped`:

- **the runtime-observation overlay** (the `observed` delivery fact's producer — designed-in
  since `00`; the ladder's third rung has intent and no Spec);
- **the impact graph** (`bySymbol`, the `inferred`-claim producer, the two assist roles of
  `06` §2 — dissolving gap row 8a into the Spec if the audit shows the row fully carried);
- **the Pack Markdown carrier** *as intent* (the authoring side of the Pack-syntax question —
  the Spec records what a Markdown Pack surface must honor; the *ruling* itself is S2's
  candidate slice, and the Spec waits on it);
- **enrich `spec:consumers.intent-composition`** `idea → scoped` only if the friction evidence
  genuinely forces an outcome statement — otherwise it stands at `idea` and the write-surface
  design session stays a named successor.

Each candidate passes the guard or is refused by name. The Vitest migration is **not** a Spec
candidate — it is maintenance, not system truth; it stays in §g. The lower-ladder recipe is the
working surface; the session's done-record lists every authored Spec beside every refusal.

**The disposition half.** Two deferrals have their evidence:

- **The inline carrier: retire on the measured population.** 1/57 leaf-altitude single-module
  candidates is the instrument's answer — the separate-file carrier is not the friction point.
  Record the retirement (plan record + the deferral clause re-pointed; a DECISIONS entry only
  if drafting shows the three-part test genuinely passes — likely this is evidence-closure, not
  a new decision).
- **Anchored-but-unbound: keep deferred, restate the boundary.** `bindExample` sites remain
  non-graph data; extracting them is engine surface no current caller demands. The deferral
  rides `spec:model.anchors`' clause as-is.

## (e) S1 — the binding layer completed honestly; the first inward oracle

One to two sessions, driven entirely by recipes.

**First, the kind ruling.** 51 of the 64 backlog rows are example-kind Specs, every one
verifier-bound, several under parents already `implemented`. Before any binding, S1 answers
one question: **what does `implemented` honestly mean for an example-kind Spec?** Three
candidate outcomes, exactly one of which is ruled (three-part test applied — this looks like a
genuine decision: hard to reverse, surprising without the re-measurement, a real trade-off):

1. **refuse by kind** — an example space's realization *is* its parent's realization plus its
   bound suite; `implemented` does not apply below the parent. Recorded as a convention on the
   kind-evidence law (or `spec:model.anchors`), and the backlog honestly shrinks to the 13
   laws;
2. **derive through the parent** — an example space is `implemented` when its `refines` parent
   is; an extraction/validation change, which therefore enters S2 as a spec-first candidate
   slice and *waits its turn* — S1 records the ruling, S2 builds it;
3. **bind individually** — rejected on its face as the ceremonial path (§c), admissible only
   for a specific example space that genuinely owns a realization site distinct from its
   parent's.

Whichever way it lands, the ruling is made once and applied 51 times; the deliverable is the
*ruling with its reasoning*, not 51 edits.

**Then, the thirteen laws.** Walk the non-example rows with the verifier-audit and
spec-guarantees recipes. Each gets exactly one of three dispositions, recorded:

1. **bind** — engine code genuinely realizes it at a nameable location (the eleven validation
   and consumer rules are expected mostly here: each names a concrete validator or view
   behavior; `spec:extraction.determinism` names the determinism check;
   `spec:carrier.sdp-import` names the import command): add the `codeAnchor` (binding-only law
   unchanged), converting the row into honest `implemented`;
2. **refuse** — realized diffusely (a law the whole pipeline honors) or by a document: name
   the refusal; the document-realization convention (phase 6) applies only where an asserting
   suite genuinely exists;
3. **backlog** — genuinely unbuilt: the row stands, now known-real.

Note the coupling: most of the eleven rules own example spaces of their own, so under outcome
(2) of the kind ruling, binding the laws collapses most of the 64 honestly; under outcome (1)
the backlog shrinks to 13 regardless. Either way the deliverable is not a number target — it is
a backlog whose every row is *deliberate*.

**The drift rows, corrected framing.** All 8 drift rows (`implemented ∧ ¬ready`) are the
dissolved-concept cluster, and **their floors already derive `ready`** — there is nothing to
enrich. The disposition is a refusal re-argument, per row: either the standing refusal (a
vocabulary/singleton/decision reason) is re-stated against today's corpus and the rung stays
honestly `defined`, or the refusal no longer holds and the Spec is promoted *individually* on
the floor plus a fresh human statement. No batch promotion; "the floor passes" alone never
suffices — that is exactly the content-quality line checks refuse to police, so a human owns
it.

**The first inward oracle.** Pick one self-hosting parent that owns an example space — the
standing candidates are confirmed live: `spec:validation.duplicate-ids` (one space) and
`spec:extraction.build-pipeline` (one space) — and author its oracle: the `specOracle` anchor
plus the typed `expected(conditions)` function beside the bound suite, mutation-probed (a wrong
expected outcome must redden). This is the oracle machinery's second caller, on the corpus that
can least fake it. If the space's Outcome union makes an oracle vacuous (one outcome class),
record that refusal and pick the other candidate — a vacuous oracle authored for coverage would
be exactly the padding the floor forbids.

## (f) S2 — the iteration loop, proven on real engine work

The phase's point. At the session open, run the build-backlog recipe and **select the top
genuine engine slice from the graph** — the plan deliberately does not hardcode the choice,
because working off the graph *is the deliverable*. Standing candidates the backlog is expected
to surface, with their gates:

- **The example-`implemented` derivation** — *if and only if* S1's kind ruling landed on
  outcome (2): the `refines`-parent derivation enters as a Spec (likely on
  `spec:extraction.derive-graph`'s family or the kind-evidence law), is enriched to `ready`,
  and lands spec-first with the backlog's honest collapse as its observable effect. This is
  the natural first candidate because S1 will have already argued its design.
- **The Pack syntax ruling + the Markdown Pack carrier** — the one carrier question MD-18 left
  open, now with a second corpus (the origin Pack) as evidence. Requires its ruling first
  (MD-candidate, three-part test); then the carrier lands spec-first: the S0-authored intent
  Spec enriched to `ready`, parity fixtures against the TS Pack form, duplicate-ID policing,
  the one-canonical-surface law extended.
- **The write-surface design session** — PLAN-only by nature: the friction evidence read, the
  scoped-intent contract drafted, `spec:consumers.intent-composition` enriched to what the
  evidence supports. Build stays behind the second-machine-writer bar exactly as ruled.
- **A validator or extraction improvement the S1 audit surfaces** — the audit is expected to
  find at least one place where the engine's behavior and a `ready` Spec's statement disagree;
  that drift is repaired spec-first (fix the stale side deliberately, bound point red before
  the fix, green after).

Whatever is selected: the slice runs the full loop — enrich to `ready` on the floor · implement
· `codeAnchor` · executable verification bound and mutation-probed · gate green — and then the
**slimming half**: after the code ships, the Spec's design-time detail is distilled or removed
in place (git holding history), giving `spec:model.enrichment-lifecycle` its first observed
case and its open question a real datum. One slice done whole beats three started.

## (g) The hygiene pass (small, riding any session's close)

- Pin the recipe enumeration: one assertion tying the recipe *names* in `AGENTS.md` and the
  reading skill to `recipes.md`'s headings, so recipe twelve cannot re-stale the prose.
- Keep the inward friction log: the four-column instrument (anchor / ladder / executable / CLI)
  continues in this plan's record for every Spec authored or bound here — the on-ramp skill is
  revised from it if any entry recurs twice.
- The records-gate duplication (script vs test discovery logic) stands as accepted; if either
  side changes, the other moves in the same commit.
- **The Vitest 2→4 migration** stands recorded as a non-Spec chore: it is eligible as its own
  mechanical session (runner migration, gate re-proven green, no engine or corpus change mixed
  in), does not gate the phase close, and is never folded silently into another session's
  diff. If it runs, its commit says exactly what it is.

## (h) What this plan does not do

- **No origin-repo work.** PR #181 is under the owner's review; its fate is a separate decision
  and, if resumed, a separate plan.
- **No readiness sweep.** The 35 refusals stand; individual promotions must be argued against
  the floor with new evidence, never batched.
- **No speculative engine surface.** The write surface, `bySymbol`, the `observed` producer,
  and any new projection wait on their bars; S0 gives them Specs so the *waiting itself* is
  graph-visible, which is the whole correction this plan makes.
- **No new query vocabulary, no reader freezes** without the second-caller-plus-hand-rolled-wrong
  evidence, unchanged.
- **No inline carrier** — retired at S0 on its measured evidence, unless the session's drafting
  overturns the 1/57 reading, in which case the competition round remains the ruled path.
- **No anchor sweep** — the example-kind question is answered by one ruling (§e), never by 51
  per-row anchors.

## (i) Sequencing, delivery vehicle, and close

S0 → S1 → S2 in order (S1's audit needs S0's honest backlog; S2's selection needs S1's
deliberate backlog and may be gated on S1's kind ruling); the hygiene pass rides any close.
Each session: one pre-close review sized to its diff; the gate green at every close;
`AGENTS.md`'s status line moves with this plan's status (the records gate enforces the
agreement).

**Delivery vehicle.** Execution under this plan lands on the branch behind **PR #15**
(`feature/protocol-self-application-phase-6`), expanding that PR from the phase-6 record into
the self-hosted-setup milestone, per the owner's direction. At the phase close the PR title and
body are rewritten to state what it now carries — the phase-6 usage layer *plus* the phase-7
practice — so the PR's claim and its diff agree. If the owner instead merges #15 first, the
plan continues unchanged on a successor branch; nothing here depends on the choice.

The phase closes when the milestone of §a stands: the forward intent that was in prose is in
the graph at honest rungs (with refusals named); every backlog and drift row is deliberate —
the example-kind ruling made, the thirteen laws dispositioned, the eight refusals re-argued or
individually overturned; one inward oracle is bound and mutation-probed; **one engine slice has
run the whole loop including the post-implementation slimming**; the friction log is live; and
the corpus stands at 0 findings with nothing promoted that the floor and a fresh human
statement did not earn. The successor question phase 7 hands forward is the one it is designed
to answer with evidence: *does the loop hold as the standing way this repo works — and what
does it demand next?*

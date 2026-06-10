# Decision diary — Libar Software Delivery Protocol (meta-design)

> A why-focused log of hard-to-reverse decisions about **building the Protocol itself** — distinct from *in-system*
> decision records (a project's own `kind:"decision"` instances). Its job is to **recapture rationale** so choices
> stay visible and don't re-smooth into "false settledness." Entries are short and **status-tagged**
> (`ACCEPTED` / `PROPOSED` / `SUPERSEDED`). Companion to `docs/concept/ubiquitous-language.md` (the ratified
> glossary; since the 2026-06-10 Fold-A restructure the model exposition lives in `00`–`07` — historical
> `base §n` references in the entries below resolve via the §-map in the glossary header).

---

## 2026-06-06 — Session: reframe + language base

> **Retired entries (2026-06-07).** **MD-3** (three meta-levels; Phase 0 = the Protocol as code) is fully absorbed
> into `ubiquitous-language.md` §1 — conclusion *and* rationale — and was deleted. **MD-6** (Spec named;
> descriptor enums locked; bounded-context → projection) is canonical in the base ledger + §2; its one unique
> nugget — the **partial reversal of MD-4** — was folded into MD-4 below, and the entry deleted.

### MD-1 — The Protocol is an executable, self-validating software-delivery meta-model  [ACCEPTED]
**Decision.** We are building a *typed, executable meta-model of the software-delivery process*: teams author
delivery intent as **`Spec` instances** — the Protocol's one authored truth-primitive — and author only two
other non-truth constructs, **`Pack`** and **`anchor`**; the meta-model (code in the repo) deterministically
checks **conformance and honesty** and derives **one graph**; every other artifact is a **projection**.
The headline is an **executable, self-validating delivery protocol — not just executable specs.**
**Two permanent honesty guardrails** (these are what keep it from re-becoming the gating we rejected):
1. It defines the **conformance contract**, and its checks cover **conformance & honesty**, never
   **content-quality** (design goodness = human/agent judgment) and never **workflow** (no lifecycle gates —
   the lifecycle-FSM trap).
2. We claim **"deterministically validated,"** never **"provably correct."**
**Why / alternatives rejected.** "Executable specs" alone (BDD) is unremarkable; earlier delivery-process frameworks modeled the process only
*descriptively*; PM tools (Jira/Linear) have process *state* but no *meta-model*. The executable meta-model plus
conformance + honesty checks is the differentiator. Hard to reverse (everything builds on it); confirmed by the
user this session.

### MD-2 — Governing language rubric: adopt the nouns, reject the process state-machine  [ACCEPTED]
**Decision.** Use the established delivery **noun** for any concept the Protocol shares with the industry; coin/keep a
distinct word only for a real differentiator (and then it must *name the difference*). Reject process
**state-machine / lifecycle gating** vocabulary. Every term faces two tests: carries epistemic status where it
matters (authored vs derived), and is unambiguous to all three readers (typed code/CLI · coding agent · Studio
user).
**Why.** The system spans a **commercial** user-facing product (Libar Studio: Desktop/Web/CI-CD) *and* the
AI-native engine; users must not relearn delivery vocabulary. This **reverses** the prior brief's "not a PM tool /
don't adopt PM ladder names" stance (see scope note).

### MD-4 — One authored primitive; familiar delivery nouns are named coordinates  [ACCEPTED · refined & partially superseded — see note]
**Decision.** One **authored** primitive (enrich-in-place; never migrated to another artifact type), positioned by
**three descriptors**: **category of truth** (`kind`) is a *true subtype* (changes required detail + validation);
**altitude/size** and **maturity** are *positions*. Familiar nouns are **named coordinates, not separate authored
types**: Decision Record / Use Case / NFR / Contract / Model = `kind`; Epic / Feature / Story = altitude;
"Executable Spec" = an example-kind instance with a verifier. They are first-class in the **language and Studio
surfaces**, never separate authored truth-primitives.
**Why.** Preserves "one primitive" (the differentiation) while honoring "adopt the nouns" — and avoids the
combinatorial explosion of a subclass per (category × size × maturity) cell. Names deferred per method.
**Later (2026-06-06; absorbed from the since-removed MD-6).** The primitive is named **`Spec`**, and the three
descriptor enums are **locked in `ubiquitous-language.md`** (`kind` = 8 values; `altitude` = `epic → feature →
story`; `readiness` = `idea → scoped → defined → ready`, `ready` carrying a readiness floor). **Partial reversal
of the above:** a **bounded-context / domain** and a **`capability`** are **not altitudes** — `epic` is the
altitude ceiling; both are realized as **`Pack` groupings + a Capability Map projection**. Above-epic (initiative
/ theme) defers, additive later. `candidate` was dropped from readiness (an FSM-status imprint).

### MD-5 — "Software delivery protocol" adopted for the meta layer and the system name  [ACCEPTED 2026-06-07]
**Decision.** Name the meta layer a **software delivery protocol** — *"not any kind of protocol, it is software"*
(executable, a reference implementation that *is* the contract). Adopted at the **"name + meta-model noun"**
depth: "protocol" is both the **product name** (Libar Software Delivery Protocol; short form "the Protocol") and
the **noun for the meta-layer** (the meta-model *is* the conformance contract). The npm package is the single
**`@libar-dev/software-delivery-protocol`**; the CLI is **`sdp`**; the repo is `libar-dev/software-delivery-protocol`.
**Why.** A *protocol* is a **conformance contract, not a workflow** — precisely what MD-1 guardrail 1 states;
**more honest than "process,"** which carries the workflow connotation we reject. It distances the tool from
PM/ticket gating and reads cleanly alongside the commercial Studio. (External review — Gemini 3.1 Pro —
independently endorsed the framing for these reasons.)
**Resolved tensions.** "Protocol" can connote comms/wire formats, and "process" is the recognized industry noun
(MD-2 bias) — both are resolved by a **surgical split, not a blanket swap**: "process" is retained for the modeled
**software-delivery process** (the activity teams perform), for the rejected **process state-machine**, and for
**delivery-process execution**; only the meta-layer's own naming ("process meta-model" → "the protocol")
changed. This unparks the naming pass.

### MD-7 — Honesty-sharpenings from the Codex adversarial pass: liveness, impact coverage, `ready` semantics  [ACCEPTED 2026-06-07]
**Context.** An adversarial review (Codex) probed three trust signals: (1) `implemented` / `has-verifier` are
anchor-driven and assert no liveness — dead code or a skipped test can look done; (2) file-level blast-radius can
silently under-report; (3) `ready` is described as "reviewed" but the model records no review fact.
**Decision.** Resolve all three as **honesty clarifications consistent with already-settled decisions**, *not* via
the reviewer's heavier remedies:
1. **Delivery facts are binding/existence, never liveness.** Define an *enabled verifier* as a **structurally
   bound, resolvable test anchor** — skip / quarantine / glob-exclusion is CI's concern, *exactly as pass/fail
   is*; add "not reachable/live" to `implemented`; name the ladder `implemented → has-verifier → observed`, with
   **`observed`** (aspirational) as the liveness rung. *Rejected: renaming `implemented`→`has-anchor` — it guts
   the `implemented ∧ ¬ready` drift alarm, and the `claim`/`observed` ladder already answers the liveness ask.*
2. **File-level blast-radius reports its own coverage gaps.** An unanchored changed file is surfaced as an
   explicit *coverage-unknown* item, never silently dropped; the MVP never claims exhaustive reach (that is the
   deferred symbol-level impact graph). *Rejected: demoting blast-radius from the MVP — the honest-coverage
   signal preserves it.*
3. **`ready` = the structural floor + a human's `declared` statement.** "Reviewed in context" is **intended
   human practice**, not a graph fact or a checked property (checking it would be the workflow-gating §0 guardrail
   1 forbids); approval provenance, where it matters (a baseline), is **git-native** — a signed tag carries
   approver + approved-at. *Rejected: an authored review/approval primitive with approver identity — it reverses
   the one-primitive bet and the explicit "RBAC/approval outside the model" cut.*
**Scope.** Applied to the **ratified base** (§4b, §6, §7, §8) plus the derived `02`/`04`/`05`/`06`/`07` +
`jtbd-07` — tightenings of the base's own honesty ethos (§0 guardrail 1; §4b "readiness is stated, facts are
derived"), not reversals of direction.
**Forward note.** If multi-actor `ready` / baseline trust later becomes load-bearing, the guardrail-respecting
home for approval provenance is **signed git tags** (identity + approved-at, already in git) — not a new authored
primitive.

### Base refinements (R-series)  [R1/R2 ACCEPTED & applied 2026-06-10 (Fold-A) · R3 see below]
**Context.** The post-Session-1 founding-ideation review surfaced two wording imprecisions in the ratified base.
The **code already conforms** in both cases; these are language tightenings, so per the working discipline
(terminology is ratified — *flag*, don't silently edit) they were recorded as **PROPOSED** and assessed by the
post-split adversarial review as *already determined* (ratification, not deliberation). They were ratified and
applied in the **pre-grill fold session (2026-06-10)** — R1/R2 during the Fold-A base restructure, R3 in Fold-B —
rather than spending grill time on no-op-on-code wording. They are **not** model changes.
- **R1 — harmonize "anchor carries identity only" (§2) with "anchored = a human binding" (§4).**  [ACCEPTED ·
  applied] §2 said anchors carry "identity only," while §4's `claim` table called `anchored` "a human binding" —
  and a binding (it emits a `satisfies`/`verifies` edge) is more than bare identity. Unified phrasing, now in the
  glossary's `anchor` entry, `01` (epistemic boundary), and `04` §2: *"an anchor says 'this code location is the
  implementation/test binding for this Spec ID'; binding only, never system-truth content — never behavior,
  rationale, readiness, acceptance criteria, or delivery facts."* The code already conforms (anchors hold
  only `id`/`label`/target; `@ts-expect-error` proves the rest is rejected).
- **R2 — "no consumer reads source directly" → permit source *links*, forbid independent re-parsing.**  [ACCEPTED ·
  applied] The principle (`03`/`05`/`06`) is right, but a Design Review linking to source locations *recorded in
  the graph* is legitimate. Now stated in `01` P2 and `03` §4: *"Consumers may link to source locations recorded
  in the graph; consumers must not independently parse source to derive their own model."* Matters when the
  Slice-4 Design Review lands.
- **R3 — reconcile `04`'s `specTest` signature to binding-only.** `04` §2 documents `specTest(id, { verifies,
  run })` with an executing `run` callback; the implementation (`src/model/anchors.ts`) is identity-only
  (`{ id, label?, verifies }`, **no `run`**). The code is the *more* faithful one: a binding anchor carrying
  `run` would couple the graph binding to execution, contradicting "the graph records that an enabled verifier
  *exists*, never that it ran" (§4b / MD-7). So this is a **doc fidelity bug, not a code gap** — reconcile `04`
  down to a binding-only signature. Same pattern as R1/R2 (the code already conforms). Surfaced by the
  post-Session-1 adversarial review (F6).

### Scope note — relationship to the prior plan & brief
**Adopt-the-nouns reversal (kept for the record).** An earlier brief held "the Protocol is **not** a PM tool; do **not**
adopt SAFe/PM ladder names." MD-2 **reverses** that: the commercial Studio means users must not relearn delivery
vocabulary, so the Protocol adopts the established delivery **nouns** (as projections + vocabulary) and rejects only the
process **gating** FSM. The structural decisions **D1–D6** (recorded below) **still hold**, reframed under the meta-model
(MD-1); the cleanup plan that applied the ratified language across the 18 concept/JTBD docs was **executed and
retired** (2026-06-07). The first-draft input drafts (`GLOSSARY.md`, `UBIQUITOUS_LANGUAGE_{1,2}.md`) and the language-finalization
brief have since been **deleted** (consolidated); the **sole canonical base is
`docs/concept/ubiquitous-language.md`.**

---

## Structural-decision shorthand (D1–D6)  [ACCEPTED · relocated here when the cleanup plan was retired, 2026-06-07]

> These six labels come from the original structural-decisions pass. Their *content* is canonical in the
> design docs (`00`–`07` — since the Fold-A restructure rehomed the base's model exposition there); this table
> is kept for permanent traceability so any historical `(Dn)` reference still resolves now that the
> single-use cleanup plan (which previously held it) is gone. **Do not confuse this legacy D-space with the
> open-decision handles D1–D8 used by `plans/02`/`plans/03`** — those name the post-Session-1 grill agenda
> (typed sections, prose-vs-ref, floor collapse, …), a different code-space; in prose, lead with meaning.

| Label | One line | Canonical in |
|---|---|---|
| **D1** | readiness (design maturity, authored) is separate from delivery facts (derived) | `02` §2 |
| **D2** | `02` carries explicit typed **sections**, trimmed to essence (branded-ID strings; open `model` list) | `02` §3 |
| **D3** | `Pack` is a reified grouping/aggregate (not folded into `Spec`); membership single-sourced on a manifest | `02` §4 |
| **D4** | **Design Review** is the flagship curated projection — the context where a human decides to state `ready` (sharpened by MD-7; the floor is checked, the review is human practice) | `06` §5 |
| **D5** | the **agent surface** = a visible typed graph the agent *scripts* (no verb wall); `reader` = thin loader | `06` §3 |
| **D6** | the **MCP surface** = integration for user-facing apps (designed-in, deferred build, shape TBD) | `06` §7 |

## Measured evidence — figures behind the generalized doc prose  [recorded 2026-06-07]

> The concept docs deliberately carry *principle-level* wording, not point figures (figures age and read as
> false precision). The measurements that motivated those principles are preserved here as evidence.

| Figure | Context | Generalized in the docs as |
|---|---|---|
| **~⅕ tokens** | a multi-probe agent session ran at ~⅕ the tokens of a grep/verb-API equivalent (data kept in-process, only conclusions returned) | `06` §3/§10, `jtbd-05` JS-E2 → "a measured context-efficiency win" |
| **< ~50 specs** | full-rebuild-per-run is comfortable below ~50 specs | `00` / `05` / `07` → "MVP scale" |
| **~10k+ nodes** | a property-graph DB is deferred until traversal pain (~10k+ nodes) | `03` / `07` → "until measured traversal pain" |
| **single-digit to ~25%** | a curated graph is a small selection of the mechanical (impact-graph) firehose | `06` §2, `jtbd-07` JS-G3 → "a deliberately small curated selection" |

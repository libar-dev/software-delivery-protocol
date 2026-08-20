# Plan 36 briefs — later registrar tranches · drift-alarm maturation · context-bundle evidence

> **Status:** 🧭 DRAFTED — next-arc briefs, the sole planning input for the next arc; not
> execution authority. Three owner-commissioned briefs, consolidated from the plan-35 execution
> record (the F adoption ledger, the H deferral table, the E3 non-ruling) and PR #20's
> upcoming-work section. Written to be handed whole to the planning harness: design intent,
> governing law, decision gates, and dependency truths — deliberately **no** session splits,
> todos, or operational detail.
>
> **Settled ground:** plan 35 (✅ EXECUTED — briefs E–H delivered; the adjudicated independent
> review closed; the gate green twice) on plan 33 and plan 31. Plan 34 remains the prior arc's
> briefs index; every brief it carried is closed, so nothing here supersedes it — this index
> starts from its arc's forward record.
>
> **Numbering.** This file takes 36 and keeps it. Execution plans this arc commissions take
> **37 upward**, one primary number each; this header gains a commissioned-plans line as they
> are cut. Brief lettering continues plan 34's: **I**, **J**, **K**.
>
> **Commissioned plans.** **Plan 37** (`37-adoption-tranches-drift-maturation-and-bundle-measurement.md`, EXECUTED)
> closed briefs I through K. Operational tracking lives in `.omo/plans/plan-37-settling-arc.md`.

## How to consume this brief (binding on the planning session)

1. **Re-measure first, inherit nothing.** Every count below was measured at the commit that
   adds this file. Before cutting a single task, re-run:

   ```bash
   npm run --silent sdp -- validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
   npm run --silent sdp:q -- '<recipe 1 body>'   # operational backlog
   npm run --silent sdp:q -- '<recipe 2 body>'   # drift alarm
   npm run --silent sdp:q -- '<recipe 8 body>'   # warn-level signals
   rg -o 'bindExample\(' test/self-hosting-*.test.ts --count-matches   # deferred adoption census
   ```

   (`pnpm` is the canonical wrapper where present; this workstation uses the sanctioned
   `npm run --silent` twins.) A statement below that no longer reproduces is closed with that
   reason, not carried forward.
2. **Open the carrying owners before anything else.** The per-brief owners table below names
   what to open first; the graph is the read model.
3. **The decision-gate table below is law.** No brief here expects a new decision Spec; a brief
   marked *may end without commissioning* is allowed to stand down honestly.
4. **The do-not-reopen list below is binding.** Reopening any row needs a new ruling with the
   ADR three-part test on the record, never a follow-up todo.
5. **Standing discipline applies unchanged:** plan-vs-execution separation; `npm run check`
   before any green claim; checks police conformance and honesty, never content-quality and
   never workflow; close records re-derive their numbers and label them as re-derived; the arc
   ends with an independent review in the plan-32 mold before its PR is ratified.

## The read model for every commissioning session

| Brief | Carrying owners to open first |
| --- | --- |
| I | `spec:decisions.adopted-registrars-committed` (MD-31) · `spec:extraction.runnable-modules` (the frozen registrar interface) · the plan-35 F ledger (`plans/35`, five ADOPT rows + the kind-evidence friction record) · `test/helpers/generated-contract.ts` (contract-derived assertions) |
| J | the eight drift-alarm Specs themselves (recipe 2 names them) · `spec:model.enrichment-lifecycle` · recipe 9 (promotion preflight) · the plan-32 theme-9 posture: enrichment on evidence, never retraction |
| K | the plan-35 H record (context bundle: DEFER, "commission a later plan — do not build the bundle inside the arc") · `spec:consumers.projections-model` · `docs/agent-surface/recipes.md` (the sixteen bodies K measures against) · `.agents/skills/sdp-sessions/` |

**Corpus context — re-measured at this commit; re-run, never inherit.** 156 Specs · 1 Pack ·
157 anchors → 314 nodes · 660 edges; 0 errors, 0 warnings; recipe 8 clean. The operational
backlog (recipe 1) is empty, with 66 ready examples and 31 ready decisions as audited exclusions
and no verifier-less ready example. The drift alarm (recipe 2) names the same eight Specs it has
named since the plan-31 commission — `spec:carrier.markdown-authoring`,
`spec:consumers.projections-model`, `spec:extraction.claim-taxonomy`,
`spec:extraction.regenerability`, `spec:model.core-model`, `spec:model.pack-aggregate`,
`spec:model.relations`, `spec:model.spec-sections` — all stated `defined`, all with
`floorReached: ready` and **no unmet floor clause**. Adoption census: 58 `bindExample` call
sites remain across eight authored self-hosting suites (carrier-gherkin 13 · validators 16 ·
projections 11 · extraction 9 · consumers 5 · pack-markdown 2 · carrier 1 · sdp-import 1);
ten generated registrar suites are tracked from the first tranche.

## The honest frame (binds every brief)

Plan 35 turned the Protocol into the first consumer of its own surfaces. This arc **settles the
residue that consumption exposed**: the registrar freeze has five adopters and 58 deferred call
sites — the freeze either holds across the long tail or its friction record matures into a
future ruling; the drift alarm has repeated the same eight rows through three arcs — repetition
without decision is noise, so each row gets an honest disposition; and one deferral (the context
bundle) carries a re-entry trigger only this repo's own sessions can measure — so measure it.
Nothing here builds a new surface. Every brief is a settling test: if the outcome is "refuse" or
"stand down," recording that outcome is the deliverable.

Two permanent guardrails restated: delivery facts are derived, never authored — nothing in this
arc mints a fact, a status, or a gate; and readiness promotion is a **human statement** — a
clear floor is evidence, never an automatic edit.

---

## Brief I — registrar adoption, later tranches (the F follow-on)

**Goal.** Continue per-family adoption of the deferred self-hosting suites onto generated
registrars under the adopted-registrars ruling (MD-31): emission never implies adoption; a
family adopts when tracked authored code imports its registrar; each adopted family joins the
committed, byte-checked set on its own evidence.

**The decision rule per family, unchanged from plan 34's brief F:** adopt when the authored
suite exists, the mechanical share the registrar removes is real in that suite, and the
five-adapter surface expresses the family's semantics without contortion. **Refuse** when the
suite would be authored only to justify adoption or the family's examples are not honestly
bindable — a refusal with its reason recorded is a complete per-family outcome, and "all 58
sites adopt" is not the success criterion.

**What tranche one taught (standing evidence, not law).** The five ADOPT rows in the plan-35 F
ledger settled ownership splits the planner should reuse: different-kind and join-heavy Thens
live in `assertions`, comparator-owned fields stay comparator-owned, world materialization lives
in `createWorld`, and authored expectations derive from the generated contracts
(`test/helpers/generated-contract.ts`) so contract and assertion cannot silently diverge. The
kind-evidence pressure-family friction is on the record — a family whose examples strain the
five adapters is a candidate refusal, not a candidate freeze amendment.

**Selection pressure.** The planner picks tranches; the census above says where the leverage is
(validators 16, carrier-gherkin 13, projections 11). The Gherkin-carrier suite is the
shape-stressing case — its examples bind a `.sdp.gherkin` corpus and will exercise the
registrar surface hardest; budget it as its own tranche rather than a tail item.

**Boundaries.** The frozen registrar interface and its five adapters are **not reopened** —
friction is recorded as evidence for a future ruling, never fixed by loosening the freeze
mid-arc. Claim taxonomy unchanged: the authored `specTest` anchor remains the only
`has-verifier` source; adoption confers no delivery fact. O5 (engine-side execution of adopter
code) stays out.

**Dependencies.** None — independent of J and K; can start immediately and split into parallel
per-suite tranches freely (each suite is a distinct file, so single-writer discipline is cheap).

---

## Brief J — the drift-alarm eight: mature or record why not

**Goal.** Give each of the eight `implemented ∧ ¬ready` Specs an explicit disposition, ending
the arc with the drift alarm either empty or carrying only rows whose reason is written down.
The eight have held identical membership since the plan-31 commission; all stand at
`floorReached: ready` with no unmet clause — recipe 2's cheap case, where the structure exists
and only the human statement is missing.

**Shape of the work.** Per Spec (or per family group): run promotion preflight (recipe 9), read
the carrying Spec, and decide honestly — either the content earns a `ready` statement now (a
human review and a one-rung carrier edit), or it does not, and the blocking reason is named in
the Spec's own prose or the plan record (an unsettled design question, a missing worked example,
a review the owner wants first). "Stays `defined`, reason recorded" is a complete per-Spec
outcome. The plan-32 theme-9 posture binds: enrichment on evidence, never retraction — no Spec
is demoted to silence the alarm.

**Why now.** Three arcs of identical recipe-2 output means the alarm no longer alarms — it is
reread and re-explained every session. Either these are honest sub-`ready` statements whose
reasons deserve to be written where the alarm points, or they are finished designs nobody has
stated. Both resolutions are cheap; carrying the ambiguity is not.

**Boundaries.** Promotion is a human statement — the executing session prepares the evidence
and the diff, and the owner ratifies the rung. No floor, validator, or check changes: if review
finds a floor clause wrong, that is drift repair on the validator side, handled on its own
evidence. No content invented to reach a rung.

**Dependencies.** Independent of I and K. The eight touch four families (`model`, `extraction`,
`consumers`, `carrier`); a session that groups by family reads each family's context once.

---

## Brief K — the context-bundle trigger: measure it, then commission or stand down

**Goal.** Render a verdict on the one plan-35 H deferral whose re-entry trigger the repo can
measure itself. The recorded trigger: *evidence that agent sessions still hand-assemble the same
token-budgeted slice after the E1 recipes, so scripting one body at a time is no longer the
honest description.* The H record is explicit that the deferral did not commission a later plan
— this brief owns deciding whether one is now warranted.

**Shape of the work.** First define the measurement honestly: what counts as hand-assembly (a
session stitching multiple recipe outputs into one context payload; repeated multi-recipe
preambles in session records; skills instructing sequential recipe chains), and where the
evidence lives (session transcripts, `.omo/` records, the skills' own instructions). Then gather
it over real sessions from this arc — brief I and J sessions are themselves the corpus. Then
rule: **trigger met** → commission a later execution plan for the bundle (never build it inside
this arc — the H record's boundary stands); **trigger unmet** → a recorded stand-down with the
evidence, and the deferral row stays.

**Boundaries.** No bundle implementation in this arc under any outcome. No new projection, no
new query verb, no reader accessor — the measurement itself is scripts and reading, not surface.
The other three H deferrals (Spec Studio, reference projection, structural-edge Mermaid) and the
E3 MCP non-ruling are **not** re-tested here: their triggers name events (a package-home ruling,
a named unserved reader, a concrete caller) that either happened or did not — if one fires
mid-arc, that is a new commissioning input, not brief K's scope.

**Dependencies.** Runs **last** — its evidence corpus is this arc's own sessions. Lawful to end
the arc with K's verdict as the final recorded act.

---

## Dependency map and sequencing

- **I and J are independent** of each other and of everything; either can start immediately, and
  I parallelizes internally per suite.
- **K goes last** — it measures the sessions I and J produce.
- Maximum honest parallelism at arc start is **I ∥ J** (I itself fanning out per tranche), with
  K as the closing measurement.

## Decision gates

| Brief | Gate |
| --- | --- |
| I | No new decision expected — MD-31 governs; each adoption or refusal is per-family evidence in the plan record. Freeze friction accrues to the evidence record, never to a mid-arc amendment. |
| J | No new decision expected — promotion is a human statement; a Spec staying `defined` records its reason. A wrong floor clause, if found, is drift repair, not a decision. |
| K | **May end without commissioning.** Trigger met → commission a later plan (never build inline). Trigger unmet → recorded stand-down with evidence. |

## Do not reopen

Carried forward from plans 34 and 35. Reopening any row needs a new ruling, not a follow-up todo.

- **The default-carrier flip.** Markdown stays the default (MD-29).
- **Gherkin kind expansion, DocStrings/DataTables, Gherkin Packs.** Ruled refusals, not gaps.
- **An `implements` slot.** Contract realization remains `satisfies` by authoring convention (MD-30).
- **The frozen registrar interface and its five adapters** (brief I works under it, never on it).
- **O5 engine-side execution of adopter code; Scenario Outlines as executable constructs.**
- **Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projections.**
- **`bySymbol` and the impact graph.** `spec:consumers.impact-graph` stays at `idea` until its
  blocking identity question is answered.
- **The `.sdp.gherkin` suffix (MD-28)** and the settled projection publish posture.
- **Query verbs.** Reads grow by recipe; the front door stays one evaluation sink (MD-22).
- **The E2 placement ruling.** `sdp new spec` and `sdp validate --watch` are write-side
  conveniences recorded without a decision Spec; revisiting that placement needs the ADR test.
- **The E3 MCP non-ruling and the three event-triggered H deferrals** (Spec Studio, reference
  projection, structural-edge Mermaid) — they re-enter on their recorded triggers, not on a
  brief.

## What the arc must leave behind

- Execution plan(s) numbered **37 upward** with status headers, and this file's header updated
  with the commissioned-plans line.
- Brief I: a per-family adoption ledger in the plan-35 F-ledger shape — outcome, one-line
  evidence, tracked generated siblings named — plus the accumulated freeze-friction record.
- Brief J: a per-Spec disposition table for the eight — `ready` statements ratified by the
  owner, or the recorded blocking reason where each alarm row points.
- Brief K: the measurement definition, the evidence, and the verdict — a commissioned plan
  number or a recorded stand-down.
- Re-derived close measurements, labeled as re-derived; an independent review in the plan-32
  mold before the arc's PR is ratified; `AGENTS.md` status updated in the same pass.

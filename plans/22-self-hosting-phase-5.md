# Plan 22 — Self-hosting phase 5: the `05` dissolution and the agent front door

> **Status:** DRAFTED — execution begins on `feature/protocol-self-application-phase-5`. This is
> plan 22, the highest primary-numbered plan; the latest ✅ EXECUTED ground is plan 21 (the
> phase-4 close, merged at PR #13). Build state lives in **`plans/`** — read the highest
> **primary-numbered** plan's status header, plus any **active subplans it (or its parent
> family) explicitly designates as current**; ignore unnumbered files and letter-suffixed plans
> only when no primary/active plan designates them. If that plan is DRAFTED, also read the
> latest ✅ EXECUTED plan for settled ground.
>
> **Spec anchors:** [plan 21 §6 done-record and §5a deletion-cost inventory](21-self-hosting-phase-4.md) ·
> [the agent-surface ruling](../specs/decisions/agent-surface-scripts-graph.sdp.md)
> (`spec:decisions.agent-surface-scripts-graph`) · [the dissolution decision]
> (../specs/decisions/concept-docs-dissolve.sdp.md) (`spec:decisions.concept-docs-dissolve`) ·
> [the MCP deferral](../specs/decisions/mcp-deferred.sdp.md) (`spec:decisions.mcp-deferred`).

## (a) Status

This is the executable phase plan for the two items the phase-4 close named as next work, in
order: finish the `05` dissolution (the two uncarried clauses, then the one-session deletion
plan 21 §5a already priced), and then **introduce the agent front door** — the CLI-facing
realization of the agent surface, which is simultaneously the phase that builds the
whole-pipeline worlds the consumer family (`spec:consumers.agent-surface` ·
`spec:consumers.reader` · `spec:consumers.design-review`) has honestly refused promotion on
for two consecutive sweeps. Execution happens only on
`feature/protocol-self-application-phase-5`. Sessions run agent-executed and
orchestrator-verified; **owner ratification of the whole phase happens at the phase PR
review** — the gate ledger (§9) records that honestly and never claims a live owner
acceptance that did not occur.

## (b) Context

Phase 4 closed at **108 Specs · 71 `ready` / 37 `defined` · 44 bound points across seven bound
suites**, with the oracle split, the shared suite constant landed, the floor and view laws
carried, and `docs/concept/05` staying exactly two clauses short of dissolution (gaps 13/14 —
the per-team severity override and the team-overridable floor config, named nowhere else).

The agent surface is the readiness tail's largest honest block. The ruling is settled
(`spec:decisions.agent-surface-scripts-graph`: agents **script a visible typed graph** — no
verb wall), the frozen joins exist (`src/reader/reader.ts`: `findByConcept` · `byFile` ·
`blastRadius`, with `bySymbol` deliberately absent pending the impact graph), the reader is
exported from the package, and the second-caller bar is on the record (`06` §3: freeze a typed
contract only when a second machine consumer appears; the discriminator is "would an agent
hand-rolling this get it wrong?"). What does not exist: an ergonomic front door an agent can
call without authoring a TS module, a demand map and recipe corpus derived from what agents
actually start from, a skill on-ramp, and — the readiness unlock — whole-pipeline verifiers
over the full self-hosting graph.

The gen-1 evidence (the prior art's playground, its skills, and its recorded review notes) is
**evidence, never template**. Its transplantable lessons, re-derived here against the gen-2
model: typed scripting beat the verb wall at a measured ~⅕ of the context; the frozen surface
stayed tiny because a written freeze-vs-script bar was applied before every addition; recipes
with runnable-as-written bodies were the release valve that kept the surface from growing; a
skill — not a README — was the on-ramp a cold session actually used; under-typing hid real
capability ("the type is the discovery surface"); output is pre-shaped by the scripting body,
never truncated by the tool; and smoke checks assert shapes, never counts. Its
non-transplants, equally deliberate: gen-1's live-rebuild-per-call freshness doctrine answered
a silent-failure mode gen 2 already polices differently (deterministic regeneration,
`--check-clean`, preflight), and gen-1's pattern-state semantics rejected the claim taxonomy
this model is built on — so recipes and skill text are **re-derived, never transcribed**.

The permanent guardrails stand unchanged: checks police conformance and honesty, never
content-quality and never workflow; delivery facts are derived, never authored; the claim
taxonomy is never collapsed; readiness is stated only where the floor honestly clears; one
canonical surface per ID, no mixing; the one graph is the sole read model.

## (c) Scope

1. **S1 — the `05` dissolution.** Carry gaps 13/14 as one clause each on existing Specs, then
   delete `docs/concept/05` per the plan-21 §5a inventory with the full re-pointing and
   two-form sweep.
2. **S2 — the front-door ruling and build.** Rule the front door's representation on the
   record, then build it with the recorded constraints designed in; the freshness question is
   ruled in the same session.
3. **S3 — the demand map, the recipes, and the skill.** The authored on-ramp corpus: what
   agents start from, the verified runnable recipe set, and the skill that teaches the
   surface.
4. **S4 — the whole-pipeline verifier wave.** Bound points over the full self-hosting graph
   for the consumer family; promotions ride verifiers.
5. **S5 — readiness sweep + `06`/`07` re-grade.** Per-spec dispositions; honest gap ledgers;
   optionally a refreshed measured-context comparison through the new front door.
6. **S6 — close.** Adversarial mutation-probing review, remediation, full gate plus
   clean-clone proof, done-record, PR.

**Out of scope, named deliberately:** the MCP surface (apps integrate, agents script — the
deferral stands); `bySymbol` and the impact graph (aspirational; the substrate does not
exist); any structured **write** contract (the second-caller bar applied to writes —
`spec:consumers.edit-model`'s verifier is expected to stay an honest refusal); Spec Studio,
the per-PR hosted preview, and the remaining `06`/`07` gap tail beyond what this phase's laws
honestly carry (the assist roles, the discipline mapping, the distribution chart, the Mermaid
surfaces, the open questions, measure-what-hurts); the gen-1 `.feature` adapter; new
content-quality validators; bulk concept purges.

## §1 Engineering rulings

Rulings 1–9 of plan 20 and 10–14 of plan 21 carry forward verbatim (the law is the unit of
conversion; the four-artifact template; the readiness promotion law; batch-green bookkeeping;
temporal-guard discipline as amended; per-doc audited deletion ratified at the PR; drift
discipline; oracle-split preservation; one source of truth for contract-dependent suites; the
P-1 world-building lesson; mirror-faithful enrichment; no dangling registry surfaces). Phase 5
adds:

15. **The front door is ruled, never drifted into.** Its representation is decided on the
    record before it is built — as a decision Spec if it passes the three-part test (it is
    hard to reverse once agents script against it, surprising without context, and a real
    trade-off), otherwise as a plan ruling. The candidates the session weighs, each against
    the agent-surface ruling: (A) an `sdp q '<body>'` evaluation sink that derives the graph,
    injects a reader handle, evaluates the supplied body, and prints the pre-shaped return;
    (B) no new verb — a documented, skill-taught scripting pattern against the exported
    `createReader`; (C) both, with the sink as the ergonomic wrapper over the same seam. A
    wave never picks silently.
16. **The frozen surface grows only through the recipe valve.** No query verbs are added in
    this phase or any successor without passing the recorded bar: a join freezes into the
    reader only when (a) a second machine consumer needs it AND (b) recipes show agents
    hand-rolling it get it wrong. Everything else lives as a recipe. Growing the surface
    uncritically rebuilds the verb wall the agent-surface ruling exists to forbid.
17. **Recipes are runnable as written, and a machine checks that.** Every recipe body is
    executable verbatim against the self-hosting graph; a test executes each one and asserts
    **shape-level invariants, never frozen counts** (the corpus grows every phase; a count in
    a recipe check is instant rot). A recipe that stops running is a gate failure, not a doc
    bug.
18. **Lineage is re-derivation, never transcription.** Gen-1 recipe and skill text speaks a
    rejected model (no claim taxonomy, FSM state, bolt-on provenance). Every recipe, demand-map
    row, and skill instruction is authored fresh in the ratified vocabulary against the gen-2
    schema; gen-1 sources may be cited in the plan as evidence, never quoted into product or
    corpus surfaces.
19. **The front door consumes the one graph only.** Whatever S2 rules, the front door reads
    derived graph data through the extractor's lawful output — it never re-parses carriers or
    source itself (the extractor stays the only component that reads source). The freshness
    choice — derive in-process per invocation vs read the committed `generated/graph.json` —
    is a real trade-off the S2 ruling decides and records, weighing gen-1's
    staleness-hides-failures evidence against gen-2's determinism gate. This session also
    dispositions the long-carried **no-reparse read seam** docket row one way or the other.
20. **Consumer promotions ride real whole-pipeline worlds.** The S4 refusal class ("whole
    pipeline world, out of tranche") dissolves only through the real seams — the front door
    and reader exercised over the full self-hosting graph (or an honest full-graph fixture),
    never through narrowed probe worlds that would make the promotion decorative. Points
    follow the P-1 discipline: only the named law can refuse, mutation-probed before recorded.
21. **The trust boundary is resolved at the edge.** If the ruled front door evaluates supplied
    bodies or takes references from untrusted strings, inputs are resolved to canonical
    validated identities at the boundary (the gen-1 lesson: validate-then-use beats
    sanitize-in-place); the evaluation surface is a local developer tool with the same trust
    stance as `npx tsx`, and the plan records that stance explicitly rather than implying a
    sandbox that does not exist.

## §2 Session inventory

### S1 — the `05` dissolution

1. **Carry gap 13**: one clause on `spec:validation.warn-level-signals` — the per-team
   severity override for the informative signals is designed-for and deferred (stated as a
   deferral, the `doc:`-reservation precedent).
2. **Carry gap 14**: one clause on `spec:validation.readiness-floor`, beside the MD-13 posture
   it already states — the floor table is team-overridable by design, deferred (same
   discipline). Per the phase-4 review guidance: clauses on existing Specs, never new Specs —
   keep the dissolution cheap. Neither clause needs a bound point (deferrals have no
   executable seam; stating one would be decorative — record the refusal).
3. **Re-audit `05`** to the standing template over the regenerated Design Review; expected
   verdict: fully carried. Then **delete** it per plan 21 §5a's deletion-cost inventory, in
   the same change re-pointing every inbound surface (ruling 14): the DECISIONS registry rows
   MD-13 and MD-9 (→ `spec:validation.readiness-floor` / `spec:validation.kind-evidence`),
   `CONTEXT.md`'s "(→ `05`)" section pointer, `docs/concept/README.md`, the surviving concept
   docs (`01` · `06` · `07`), the checkout-v1 README, the four JTBD story citations, the
   source-comment citations (`src/validate/validators.ts` per-check comments,
   `readiness-floor.ts` header, `contracts.ts`, `reader.ts`, `design-review.ts`,
   `sections.ts`, `reify.ts`), the three test-file citations, and the **two pinned quotes in
   `check-carrier-truth.mjs`** (re-pointed at the carrying Specs, the `check-prose-schema.mjs`
   precedent). Then the two-form reference sweep (backticked/path forms AND bare `05 §`
   citation forms) to zero hits outside `plans/` and `reviews/`, with commands and counts
   recorded. If the audit finds any row honestly uncarried, `05` stays again and the residue
   is recorded — a lawful close, not a failure.

### S2 — the front-door ruling and build

1. **The ruling** (ruling 15): weigh candidates A/B/C and land the decision on the record.
   The evidence brief for the session: the agent-surface ruling (scripts-the-graph; the
   schema is the contract), the second-caller bar, and the gen-1 findings — the eval sink was
   the measured "agent sink" (~⅕ context, conclusions-only output), while its recorded
   footguns are design inputs, not reasons to refuse: the runner owns module resolution so no
   staleness flag exists to forget; stdin detection via `isatty`, never a TTY property probe;
   anchoring to the extraction root, never the invoking directory; bodies are plain JS
   function bodies (no imports, no TS-only syntax) with `return` as the output contract;
   documented examples must run as written.
2. **The freshness ruling** (ruling 19): derive-in-process vs committed-graph read, decided
   and recorded with its reason; the no-reparse docket row dispositioned.
3. **The build**: implement the ruled front door in `src/cli/` on the existing `sdp` surface;
   output is the pre-shaped return of the body (bounded inspection depth; a `--json` mode if
   ruled); failures render through the one diagnostic currency (`spec:validation.diagnostic-rendering`
   applies — no second report shape). Engine tests in the residual style land with the build
   (the bound points are S4's — do not double-author).
4. **Bookkeeping**: the CLI surface list in `AGENTS.md`/`00` updates only if the ruling adds a
   verb (drift discipline: fix the stale side deliberately); `npm run check` green.

### S3 — the demand map, the recipes, and the skill

1. **The demand map** enriches `spec:consumers.agent-surface`: the entry-point catalog — an
   agent arrives holding a **string**, a **file**, or a **changeset**, never a spec id (the
   symbol entry stays named-and-deferred with `bySymbol`). Each row names its frozen adapter
   (`findByConcept` · `byFile` · `blastRadius`) or its recipe.
2. **The recipe corpus**: an authored artifact (location the session records; suggested
   `docs/agent-surface/recipes.md`) of verified runnable bodies, re-derived for the gen-2
   model. The opening set, drawn from the demand map and the standing payoff queries — each a
   candidate, none sacred: the build backlog (`ready ∧ ¬implemented`); the drift alarm
   (`implemented ∧ ¬ready`); "what does this Spec guarantee and who verifies it" (context +
   verifier bindings with claims decoded); "what breaks if I change these files" (blast
   radius with `coverage-unknown` named, at-risk one-hop carried); "what is in this Pack and
   at what readiness" (the review backbone); "where is this concept" (`findByConcept` over
   ids, titles, narrative, sections); readiness divergence (stated vs derived, the first
   unmet clause); orphans and gaps read from the validation report. Every recipe body is
   checked per ruling 17.
3. **The skill on-ramp**: a skill teaching the surface (location per this repo's consumer
   conventions; content: load order, the bootstrap discipline — query the graph before
   reading files for corpus questions; the anti-anecdote rule — the live graph outranks any
   skill paraphrase; the output contract — pre-shape the return, never dump). The skill is a
   consumer artifact, not corpus truth: it cites Specs, it never restates law the Specs carry
   (prose-ownership discipline applied to the on-ramp).
4. **Bookkeeping**: if the recipes check lands as a new test leg or suite, it enters the
   shared constant / wrapper per ruling 11 mechanics; `npm run check` green.

### S4 — the whole-pipeline verifier wave

Bound points over the full self-hosting graph through the real seams (ruling 20), following
the four-artifact template. Planned targets:

| Parent | Law under verification | Planned points |
|---|---|---|
| `spec:consumers.agent-surface` | the front door end-to-end: a body scripted against the injected reader over the derived self-hosting graph returns pre-shaped, claim-decoded data | 1–2 |
| `spec:consumers.reader` | the entry adapters over the full graph: `findByConcept` reaches recorded context; `byFile` bridges an extraction-root-relative file; `blastRadius` names impacted, at-risk (edge + claim carried), and `coverage-unknown` honestly | 2–3 |
| `spec:consumers.design-review` | the parent's own law (the phase-4 review's named candidate): a Spec/Pack rendered in context as a pure projection — no stored finding, deterministic pages | 1 |

Worlds may run the live self-hosting extraction (the corpus oracle precedent: derive in
memory from the repo root) or an honest full-graph fixture — never a narrowed probe that
makes the promotion decorative. Every point mutation-probed before recording (ruling 12).
Promotions ride: the three parents promote only where the floor clears and the verifier
resolves (ruling 5); `spec:consumers.edit-model` is expected to refuse again with its
standing reason (no write surface this phase), and the refusal is recorded, not regretted.

### S5 — readiness sweep + re-grades

1. **Sweep**: every then-`defined` Spec dispositioned per-Spec (promote only under ruling 5;
   named refusals otherwise; the 21 decisions expected to hold their standing refusal).
2. **`06`/`07` re-grade** to the standing template: the rows this phase's laws touch (`06` §3
   the agent surface and reader rows; any row the front door or recipes now carry) re-graded
   honestly; the out-of-scope tail stays gapped by design. `06` and `07` are expected to
   **stay**; if either audit surprises toward fully-carried, the deletion runs under ruling
   14, not as a side-effect.
3. **Optional, evidence-not-quota**: refresh the measured context-efficiency comparison
   through the new front door (the agent-surface Spec already carries one measured line; a
   second measurement is recorded only if honestly comparable — never manufactured).

### S6 — close

1. Adversarial review archived as `reviews/11-self-hosting-phase-5-pre-close-review.md`:
   an independently designed mutation matrix over every new bound point; a records-honesty
   recomputation of the headline numbers; the `05` deletion's reference sweep independently
   re-run; the front door probed adversarially (malformed bodies, non-TTY stdin, off-root
   invocation, oversized returns — the ruled constraints hold or the findings say so).
2. Remediation with per-finding terminal dispositions.
3. Full twelve-leg `npm run check` plus the clean-clone proof at the close tip.
4. Done-record (§6), acceptance criteria graded (§5), watch items and docket terminal (§3–4),
   `AGENTS.md` status update, PR description.

## §3 Watch items

| Item | Fires when | State |
|---|---|---|
| verb-wall creep | any second query verb (or reader accessor) is proposed without clearing ruling 16's bar | unfired |
| recipe rot | a recipe body stops running as written (ruling 17's check is the alarm) | unfired — the alarm now exists: `test/recipes.test.ts` executes every fenced body in `docs/agent-surface/recipes.md` through the real front-door seam on each gate run, so a body that stops running is a red leg rather than a doc nobody re-read. The pairing assertion extends the alarm to omission: a documented recipe with no body fails the same suite |
| skill anecdote drift | skill text restates or contradicts law a Spec carries instead of citing it | unfired — the **anti-anecdote rule** shipped in `.claude/skills/sdp-agent-surface/SKILL.md`: the derived graph outranks the skill and any cached session summary, and on disagreement the skill is named the bug. The skill cites `spec:consumers.agent-surface` · `spec:decisions.agent-front-door` and the glossary rather than restating them. The item still fires if skill text ever states law in its own words |
| eval trust boundary | the front door's input handling grows past the recorded local-tool trust stance | unfired — the stance is now recorded (ruling 21, §5b and `spec:decisions.agent-front-door`): local developer tool, no sandbox claimed, root resolved to a canonical validated directory at the edge. The item fires if the sink ever takes input from a non-operator source or starts implying containment |
| oracle thrash | the corpus wave forces cross-family edits in the split oracle (per-family modules should localize) | unfired — S4 added six Specs and six anchors and touched exactly one per-family module (`consumers.ts`) plus the three modules that are cross-family **by construction** (`anchors.ts` · `declared-relations.ts` · `pack-members.ts`, each a single corpus-wide list). No sibling family module moved. The related risk the wave was warned about — **bound literals freezing corpus state** — was avoided by design: every literal in the six points names the S4 fixture corpus (`spec:orders.*` · `impl:orders.create-order` · `src/create-order.ts`), whose contents this repository controls and no corpus wave touches, so a future Spec, anchor, or readiness change cannot rewrite a bound point. The only self-hosting counts these points freeze are the ones the corpus oracle already owns |
| table sugar / single-literal vocabulary (carried) | real material forces the ruled-out forms | unfired |

## §4 Docket ledger (carried in from plan 21)

The Markdown Pack syntax ruling · the gen-1 `.feature` adapter · **the no-reparse read seam —
CLOSED at S2** · temporal-guard token assembly · the editor-association gap ·
control-character latitude · the separate example-id namespace. Rows close only with reasons in
the done-record.

**No-reparse read seam — closed, with the reason.** The row asked whether a read-side consumer
may ever obtain graph data by any route other than the extractor's output. S2's freshness ruling
answers it for the front door and, by the same argument, for every read consumer: the sink
**re-derives through the extractor in process on every invocation** and consumes the derived
result in memory. That is not a second parse and never was the thing the row feared — re-running
the one lawful producer *is* the one graph's production path, and the extractor remains the only
component that reads source. The alternative the row was really guarding against — a consumer
opening carrier files itself to answer faster or fresher — is refused permanently and is now
stated on a Spec (`spec:decisions.agent-front-door`, the read-only consequence) rather than
carried as a docket question. The committed `generated/graph.json` stays a published artifact for
downstream consumers and the determinism gate, never the agent path's source of truth.

## §5 Acceptance criteria

1. **`05` is dispositioned on its audit**: either deleted with gaps 13/14 carried first, the
   full §5a re-pointing landed, and the two-form sweep at zero hits — or kept with the honest
   residue recorded. No stretched verdicts.
2. **The front door is ruled, then built**: the representation and freshness decisions are on
   the record (decision Spec or plan ruling, per the three-part test) before the
   implementation lands; the recorded constraints are designed in and adversarially probed at
   S6; diagnostics flow through the one currency.
3. **The on-ramp exists and is checked**: the demand map is authored on the agent-surface
   Spec; every recipe runs as written under a machine check asserting shapes, never counts;
   the skill cites Specs rather than restating them.
4. **The consumer family earns its promotions**: every promotion carries a resolving
   whole-pipeline verifier through the executable path, visible in the regenerated graph;
   zero `honesty/gaps` warnings introduced; refusals (expected: `edit-model`, the decisions)
   carry named reasons.
5. **No surface creep**: the reader's frozen join set is unchanged unless ruling 16's bar was
   cleared on the record; the verb count changed only by what S2 ruled.
6. **The gate holds throughout**: `npm run check` green at every blessed commit; the close
   runs the full chain plus the clean-clone proof at the tip.
7. **Records continue**: ledgers terminal; docket rows dispositioned or carried with reasons;
   the adversarial review archived with every finding in a terminal disposition before close.

## §5a The S1 `05` re-audit, deletion, and reference sweep

Run to the standing per-doc template (plan 20 §7; plan 21 §5a), judged over the **regenerated**
Design Review — `npm run build && npm run generate:self-hosting`, then the carrying Specs'
`generated/design-review/spec/*.md` pages read directly, because the criterion is what the graph
carries, not what a raw spec file says. Governing criterion unchanged (the dissolution decision,
`spec:decisions.concept-docs-dissolve`): a document may be deleted only once its semantic contract
is **fully** carried by Specs and lean registries; **one gap blocks deletion**; an
`expository-only` row never blocks, provided its law is carried elsewhere — a Spec, a lean
registry, a pinned code+test surface, or a **surviving** document, named in the row.

**Terminal disposition: `05-validation-and-honesty.md` — fully carried · deleted.**

### The re-audit

The phase-4 table's 32 carried / expository-only rows were re-judged and **all stand as graded**:
every carrying surface named in them was re-verified present in the regenerated graph (32 Spec ids
and point children resolved; the surviving documents `00`, `01`, `04`, `06`, `07` all survive), and
nothing in the corpus moved between the phase-4 close and this session except the two clauses
below. The two blocking rows flip:

| Doc section | Phase-4 verdict | Carrying surface now | Re-graded |
|---|---|---|---|
| §2 check 8 parenthetical — a per-team severity override is designed-for, deferred | **gap 13** | `spec:validation.warn-level-signals`, new clause: *"The severity these informative signals carry is fixed by the Protocol and no validator reads a per-team setting, so a per-team severity override is a designed-for deferral rather than a landed capability."* Visible on the regenerated page `generated/design-review/spec/validation.warn-level-signals.md` | **carried** |
| §3 opening ¶ tail — the thresholds are a Representation and a team-overridable floor config is designed-for, deferred | **gap 14** | `spec:validation.readiness-floor`, new clause: *"The floor is the mechanism while the specific clause thresholds are one chosen representation, so a team-overridable floor configuration is a designed-for deferral rather than a landed capability: no validator reads a per-team floor setting, and the shipped clause table is the only floor any Spec is checked against."* Visible on `generated/design-review/spec/validation.readiness-floor.md` | **carried** |

Both clauses follow the `doc:`-reservation precedent (`spec:model.stable-ids`): they state the
reservation **and** its actual status, so the Spec never reads as if the capability shipped. Both
were authored in the prior commit, per the dissolution decision's rule that the carrying change is
never bundled with the deletion.

**Rows that needed judgment.** One, and it is a correction to the inventory rather than to the
audit: plan 21's deletion-cost inventory paired the registry re-points as "MD-13 and MD-9 → 
`spec:validation.readiness-floor` / `spec:validation.kind-evidence`". Read against the actual
text, MD-9's `05` §3 mirror is the **`defined`-rung clause that reads a blocking open question**,
which `spec:validation.readiness-floor` states and `spec:validation.kind-evidence` does not
mention at all. MD-9 was therefore re-pointed at `spec:validation.readiness-floor` (with the
clause named in the row), not at `kind-evidence`. Following the inventory literally would have
minted a citation to a Spec that does not carry the law.

### The deletion and the re-pointing (same change)

`docs/concept/05-validation-and-honesty.md` deleted; **24 inbound surfaces re-pointed**, verified
against the tree rather than trusted from the inventory:

| Surface | Re-point |
|---|---|
| `CONTEXT.md` | the section header `## Validation & honesty  (→ `05`)` → `(→ `spec:validation.two-check-families`, `spec:validation.readiness-floor`)`, following how the dissolved core-model and one-graph pointers were re-pointed at phase 3. No other hit in the file |
| `AGENTS.md` | the status header's "`05` stays, two clauses short" replaced by the dissolution statement; the "Where to look" concept row now names validation & honesty among the dissolved families with its carrying Specs, beside the model and extraction families |
| `docs/concept/DECISIONS.md` | MD-13 → `spec:validation.readiness-floor` (beside the surviving `src/validate/readiness-floor.ts` mirror); MD-9 → `spec:validation.readiness-floor`, naming the `defined` clause (see the judgment note above) |
| `docs/concept/README.md` | the `05` index row removed (the `03` precedent); the "Building the MVP" reading path re-pointed at the validation Specs |
| `docs/concept/01` | the Representation table's validation-layer row → `spec:validation.two-check-families` |
| `docs/concept/06` | intent composition's gate citation → `spec:validation.two-check-families`; the Design Review readiness paragraph → `spec:validation.readiness-floor`, with the `00`/`05` guardrail pair rewritten as `00` + `spec:validation.two-check-families` |
| `docs/concept/07` | §4 banner-timing row → `spec:consumers.derived-readiness-banner` + `spec:validation.readiness-floor`; §6 ③ → `spec:validation.readiness-floor` |
| `jtbd-stories/01` | two inline floor citations → `spec:validation.readiness-floor`; JS-A5's reference → `spec:validation.pack-coherence` |
| `jtbd-stories/04` | JS-D1's reference → `spec:validation.two-check-families` + `spec:validation.readiness-floor`; JS-D2's → `spec:validation.readiness-floor` + `spec:validation.kind-evidence` |
| `jtbd-stories/05` | JS-E4's reference and two inline floor citations → `spec:validation.readiness-floor` |
| `jtbd-stories/07` | the trace story's reference → `spec:validation.verification-linkage`; the coverage story's → `spec:validation.warn-level-signals` |
| `examples/checkout-v1/README.md` | the concept-map row → the three validation Specs |
| `src/validate/validators.ts` | 13 citations: the module header → `spec:validation.two-check-families`; the deferred-families note → `00` §4 / `07` §3; each per-check banner → its carrying Spec (`referential-integrity` · `duplicate-ids` · `claim-separation` ×2 · `verification-linkage` · `pack-coherence` · `warn-level-signals` ×2 · `authored-honesty` ×2 · `readiness-floor` + `kind-evidence`). Every comment's law statement kept intact |
| `src/validate/readiness-floor.ts` | 5 citations: the header's "mirroring `05` §3 row-for-row" → "mirroring `spec:validation.readiness-floor` and `spec:validation.kind-evidence` clause-for-clause"; the two table banners; the fail-closed note → `spec:validation.claim-separation`; the derived-readiness header → `spec:validation.readiness-floor` |
| `src/validate/contracts.ts` · `src/reader/reader.ts` · `src/projections/design-review.ts` · `src/model/sections.ts` · `src/extract/reify.ts` | one citation each → `spec:validation.two-check-families` · `spec:validation.readiness-floor` · `spec:consumers.derived-readiness-banner` · `spec:validation.kind-evidence` · `spec:validation.authored-honesty` |
| `test/readiness.test.ts` · `test/extract.test.ts` · `test/fixtures/graph-validator.fixtures.ts` | the three citations → `spec:validation.readiness-floor` and `spec:validation.validator-self-testing` (×2) |
| `check-carrier-truth.mjs` | the two pinned quotes — see below |

**The two pinned quotes, handled differently and deliberately.** The Family A *claim* pin ("the one
validation path keeps its law with per-carrier authoring-time feedback") was **re-pointed** at
`specs/decisions/one-validation-path.sdp.md`, with its two `present` needles re-derived from the
Spec's own words (the decision line and the consequence line, which is the per-carrier half stated
as "typed authoring feedback and extraction findings remain distinct from graph validation"). The
`absent` needle is kept unchanged, so the obsolete sole-TS phrasing cannot drift onto the carrier.
Family A reads any path directly, so the pin now enforces the content on a living surface — the
`check-prose-schema.mjs` precedent.

The Family C *classification* rule (pinning "the type system's job in the TS carrier") was
**retired with the document, not re-pointed** — the one departure from the brief's expectation,
with reasons. Family C's contract is "every retained TypeScript mention **inside the scanned
concept/JTBD corpus** is classified by an explicit rule", and the scan corpus is enumerated from
`docs/concept/*.md`, `jtbd-stories/*.md`, and `CONTEXT.md`. A rule aimed at a `specs/` file would
match no scanned line and fail as a *stale audit entry*; widening the scan to `specs/` to
accommodate it would re-scope an unrelated audit over 108 Spec files and surface a wave of
unclassified mentions. The mention itself no longer exists anywhere, so there is nothing left to
classify — precisely the phase-3 `03` precedent for this script ("5 classification rules retired
with the doc"). The law the rule guarded survives on the Family A pin above. `node
check-carrier-truth.mjs` **passes**: *29 repaired claims hold; 16 corpus files scanned; 47 retained
mentions classified.*

### The two-form reference sweep — zero hits

Run from the repo root, excluding `plans/`, `reviews/`, `explorations/`, `node_modules`, `.git`,
`generated/`, `dist/`, `coverage/` (historical references inside `plans/` and `reviews/` stay
untouched — git is the event log).

```sh
# form 1 — path and backtick forms
grep -rnE 'docs/concept/05|`05`|05-validation-and-honesty' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir=reviews \
  --exclude-dir=explorations --exclude-dir=generated --exclude-dir=dist --exclude-dir=coverage
# → 0 hits

# form 2 — the bare citation form
grep -rn '05 §' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir=reviews \
  --exclude-dir=explorations --exclude-dir=generated --exclude-dir=dist --exclude-dir=coverage
# → 0 hits

# widened residue check — any bare `05` token at word boundaries
grep -rnE '(^|[^0-9A-Za-z._/-])05([^0-9A-Za-z._-]|$)' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir=reviews \
  --exclude-dir=explorations --exclude-dir=generated --exclude-dir=dist --exclude-dir=coverage \
  --include='*.md' --include='*.ts' --include='*.mjs' --include='*.json' --include='*.yml'
# → 0 hits
```

**Judged-lawful residue: 2 hits, both use–mention, neither a reference.** A fourth sweep on the
bare string `validation-and-honesty` returns two lines that name the dissolved document in prose
while pointing at nothing: the `AGENTS.md` status sentence recording the dissolution, and the
`check-carrier-truth.mjs` comment explaining why its pin moved. Both were deliberately phrased
without the `05` token so neither sweep form can hit them, and both would be false positives to
"repair" — a deletion record has to be able to name what it deleted.

### Close state

`108 specs · 1 packs · 80 anchors → 189 nodes · 371 edges (0 errors, 0 warnings)`, `ready: 71 /
defined: 37` — identical to the opening state, as expected: two clauses on existing Specs create no
nodes and no edges. Full twelve-leg `npm run check` green.

## §5b The S2 front-door ruling, on the record

Ruling 15 forbids drifting into the front door, so the three candidates were weighed before any
implementation code was written. **Terminal disposition: candidate (C) — both entrances over one
seam — carried as a decision Spec, `spec:decisions.agent-front-door`, registered as MD-22.**

### The weighing

| Candidate | Judged against the agent-surface ruling · the second-caller bar · the gen-1 evidence | Verdict |
|---|---|---|
| **(A) the sink alone** | Satisfies the ergonomics finding (the measured "agent sink" at roughly a fifth of the context) but makes the CLI the only entrance, so a second machine consumer — a projection, an adapter, a test — would have to shell out and parse text to reach joins it can already import. It also leaves the exported reader looking incidental when it is the actual contract. | rejected |
| **(B) scripting only, no verb** | Keeps the surface at zero and preserves full static typing of the body, and it is what the package already supports. But it taxes every question with an authored TypeScript module, a compile, and a run — exactly the friction the gen-1 evidence recorded the sink removing. The second-caller bar argues *for* the sink here rather than against it: the bar governs freezing **query vocabulary**, and a single evaluation sink freezes none. | rejected |
| **(C) both, sink over the exported seam** | One law, two entrances. The CLI sink derives the graph and injects the very `createReader` the package exports, so a body scripted at the terminal and a module scripted in a repo compose the same data through the same joins. No query verb is minted, so the verb wall the agent-surface ruling forbids stays forbidden — a single sink is its opposite: it adds an evaluation entrance and zero vocabulary. | **ruled** |

### The three-part test — passed, so it is a decision Spec

- **Hard to reverse.** The injected binding names (`g` · `graph` · `report`) become a scripted
  contract the moment recipes and a skill are authored against them; renaming one breaks every
  body already written. Reversal is not a code edit, it is a corpus edit.
- **Surprising without context.** A CLI whose founding ruling is "no verb wall" adding an
  evaluation verb reads as a contradiction until one sees that a *single* sink adds no query
  vocabulary at all.
- **A real trade-off.** The sink buys ergonomics and pays in the body's static typing (a string
  body is not typechecked) and in an evaluation surface; the scripting entrance buys typing and
  pays a module per question. Neither dominates, which is why both are kept.

### The freshness ruling (ruling 19) — derive in process

The sink runs the extractor on every invocation rather than reading the committed
`generated/graph.json`. The reasons, weighed both ways: a committed-artifact read is faster and
gen-2 does police staleness with deterministic regeneration, `--check-clean`, and preflight — but
those gates run at commit time, not at query time, so between an author's edit and the next
regeneration the artifact would answer confidently about a corpus that no longer exists, and a
*just-authored* Spec would be invisible to the surface whose whole job is to make it findable.
Gen-1's staleness-hides-failures evidence points the same way. The cost is one extraction per
invocation (seconds on this corpus), which the corpus-oracle precedent already pays in the test
suite. This does **not** breach the no-reparse law: the sink never parses a carrier — it consumes
the extractor's derived output in memory, and re-running the one lawful producer is the one
graph's lawful production path (§4 closes the docket row on exactly that reasoning).

### The trust stance (ruling 21) — recorded, not implied

`sdp q` evaluates local operator-supplied JavaScript with the same trust as running a local script
through the package's own runner. **No sandbox is claimed and none exists**; the body has the
process's full authority. What the boundary does police is identity: a supplied root resolves to a
canonical absolute path and is validated as a directory before extraction sees it (the shared
`resolveExtractionRoot` seam, validate-then-use), and `--exclude` paths go through the strict
consumer-exclusion contract unchanged. The stance is stated in the decision Spec's consequences
and in the module header, so no later reader can mistake the sink for a security boundary.

## §5c The S5 re-grades (`06` and `07`) and the standing gap ledger

Run to the standing per-doc template (plan 20 §7; plan 21 §5a), judged over the **regenerated**
Design Review — `npm run build && npm run generate:self-hosting`, then the carrying Specs'
`generated/design-review/spec/*.md` pages read directly, because the criterion is what the graph
carries, not what a raw spec file says. Governing criterion unchanged (the dissolution decision,
`spec:decisions.concept-docs-dissolve`): a document may be deleted only once its semantic contract
is **fully** carried by Specs and lean registries; **one gap blocks deletion**; an
`expository-only` row never blocks, provided its law is carried elsewhere — a Spec, a lean
registry, a pinned code+test surface, or a **surviving** document, named in the row.

**Terminal dispositions this session:** `06` **stays — one gap closed, five stand** · `07`
**stays — three gaps stand, none moved**. Neither audit surprised toward fully-carried, so
ruling 14's re-pointing and two-form sweep did not run. No document was deleted and no Spec was
edited: this is a records session over the corpus S1–S4 built.

### `06-consumers-and-projections.md` — re-grade: **gaps** · stays

Only rows whose verdict moved, plus rows for doc content this phase **added**, are restated;
every other row of the phase-3 table (as amended at phase 4) stands as written.

| Doc section | Prior verdict | Carrying surface now | Re-graded |
|---|---|---|---|
| §3 `bySymbol` is frozen in shape but aspirational in build | **gap** (phase-3 gap 8, second half) | `spec:consumers.agent-surface`, S3 clause: *"The symbol entry is designed for and deferred: `bySymbol` would resolve through the aspirational impact graph, no such substrate exists, and the adapter is absent rather than stubbed so its absence cannot read as a landed capability."* Visible on `generated/design-review/spec/consumers.agent-surface.md`. This is the gaps-13/14 shape exactly — the clause states the reservation **and** its actual status in one breath (the `doc:`-reservation precedent, `spec:model.stable-ids`), so the Spec never reads as if the adapter shipped. The frozen-in-*shape* half rides the clause naming it as the fourth entry beside the three the preceding clause enumerates, and the absent-not-stubbed half is bound: `spec:consumers.agent-surface.demand-map-entries` asserts `typeof g.bySymbol === "undefined"`, so a stub cannot be added without reddening a point | **carried** (carried-deferral) |
| §3 the second-caller bar — freeze a typed contract only when a second machine consumer appears; the discriminator is "would an agent hand-rolling this get it wrong?" | expository-only against `00`/`07` | `spec:consumers.agent-surface`, S3 clause: *"Past those entry adapters the surface grows by recipe and not by verb: a join is frozen into the reader only when a second machine consumer needs it and hand-rolled attempts get it wrong, and every other question stays a body an agent scripts."* Both halves of the bar — the second-consumer condition and the hand-rolling discriminator — are now stated as law on a Spec rather than restated across two surviving documents | **carried** (moved off `00`/`07`) |
| §3 **new this phase (S2)** — "The front door — two entrances, one seam": the package exports the reader constructor and the CLI carries `sdp q`; a single sink is the anti-verb-wall because it adds no query vocabulary; derivation runs per invocation so a just-authored Spec is queryable and no committed artifact answers in the graph's name; the sink never re-parses carriers and never writes; local-developer-tool trust stance, no sandbox claimed | — (content did not exist) | `spec:decisions.agent-front-door` — the decision line (two entrances over one seam), the rationale (one sink adds no query vocabulary, so it is the opposite of a verb wall; a committed artifact would answer from a snapshot a just-authored Spec is missing from), and three of the four consequences (derive per invocation · read-only, never re-parses, writes nothing · the local-tool trust stance with roots resolved to canonical validated identities). Bound end-to-end by `spec:consumers.agent-surface.scripted-context-body`, whose point reads the sink's own stdout | **carried** |
| §3 **new this phase (S2)**, the same paragraph's tail — the sink injects "that same reader **plus the raw graph and the validation report**" | — (content did not exist) | **a pinned code+test surface, not a Spec**: `src/cli/q-command.ts` (the three injected bindings) with `test/cli-q.test.ts` pinning each one by name — *"injects a live reader: the entry adapters answer from the derived graph"*, *"injects the raw graph schema alongside the reader"* (asserting `graph === g.graph`), and *"injects the validation report as data, never as a gate"* (asserting the report's findings equal the reader's). The Spec carries the *law* (one seam, no vocabulary, read-only, per-invocation) and states the binding names' status — *"the injected binding names are a scripted contract that recipes and skills depend on"* — without enumerating them; the names themselves stand on the code+test pin, which the criterion admits. **Flagged for a future `06` deletion attempt:** this is the one row in the moved set whose carrier is not a Spec, so it must be re-judged (not assumed) if `06` is ever proposed for deletion | **carried** (code+test pin, named) |
| §3 **new this phase (S3)** — "The demand map and the recipe valve": an agent arrives holding a string, a file, or a changeset rather than the Spec id it wants; the three frozen adapters are exactly those entries; everything past them is a recipe catalogued at `docs/agent-surface/recipes.md`, each checked to run as written; the catalog is the release valve that keeps the frozen surface small | — (content did not exist) | `spec:consumers.agent-surface`, S3 clauses 6–9 (the entry-point catalog · the adapter each entry names, with `blastRadius` naming every coverage-unknown changed file · the `bySymbol` deferral · the recipe valve in the Spec's own words) · `docs/agent-surface/recipes.md` with `test/recipes.test.ts` executing every fenced body through the production `sdp q` seam on shape-level invariants. Bound by `spec:consumers.agent-surface.demand-map-entries`, which reaches all three entries in one body | **carried** |

**Rows that strengthened without moving** (recorded so a later reader does not mistake silence
for staleness; each was already `carried` and stays `carried`):

- §3 the reader row (joins and claim decode once, persists nothing; entry adapters; blast radius)
  — `spec:consumers.reader` grew from 4 rules to 8 at S4 (the field-naming half of
  `findByConcept`, both halves of `byFile`, the reason-carrying law, the realizing entrypoint) and
  gained three bound points, one per adapter law.
- §5 pure projection with no stored `Finding`, and byte-exact regeneration as the same determinism
  discipline as the graph — `spec:consumers.design-review` gained the graph-only page-identity
  clause (*"no timestamp, no commit, and no run identity"*) and the realizing entrypoint at S4, and
  the whole row is now bound by `spec:consumers.design-review.pure-projection`, which renders twice
  from **freshly re-derived** graphs and asserts the extraction root is byte-identical afterwards.
  **No `06` §5 row moved from gap to carried this phase** — §5's two gaps closed at phase 4, and
  this phase's enrichment made an already-carried row load-bearing rather than closing a new one.

**`06`'s surviving gaps — five rows** (was six): the impact graph's two assist roles (§2) · the
discipline ≈ kind/section mapping (§6) · the disciplines × phases × iterations distribution chart
(§6) · the per-PR hosted preview (§8) · the Mermaid and reference-projection rows of the §1
taxonomy. All five are named out of scope by this plan's §(c); `06` stays.

**No new gap row was minted, and that was a judgment, not an omission.** The §3 aspirational tail
(token-budgeted self-contained slices; GraphRAG retrieval for very large graphs) was decomposed on
this pass under the phase-4 parenthetical precedent and found **carried against a surviving
document** — `07` §2's ASPIRATIONAL map names "AI slices + the **MCP surface** … + GraphRAG"
explicitly — so recording it as a gap would inflate the ledger rather than sharpen it. The
distinction from gaps 13/14 is the one that matters: those were deferrals named *nowhere else*;
these are named on a document that survives.

### `07-mvp-roadmap-and-open-questions.md` — re-grade: **gaps** · stays

**No row moved.** The rows this phase's laws touch were re-judged and all keep their prior
verdict; the three surviving gaps are untouched by design.

| Doc section | Prior verdict | Re-judged against this phase | Verdict |
|---|---|---|---|
| §1 the slice table, slice 5 — "the CLI surface resolved (`build` · `validate` · `view`; `explain`/`search` below the second-caller bar, `06` §3)" | expository-only against `AGENTS.md`/`00` | unchanged. The row records what **slice 5 delivered**, which `sdp q` does not retroactively change; the current CLI surface is stated at `00` §4, which S2 re-pointed in the same change as the build. The second-caller-bar citation it leans on now also stands on a Spec (see the `06` §3 row above), which strengthens the elsewhere rather than moving this row | expository-only (unchanged) |
| §3 cut item 8 — a fuller impact graph; `bySymbol`, symbol-level identity, cross-package reach deferred | expository-only against `00` §4 (inside the nine-item cut-list row) | unchanged as a *cut-list* row. Its `bySymbol` half is separately now carried on `spec:consumers.agent-surface` (the `06` §3 re-grade), so the deferral no longer rests on the cut list alone | expository-only (unchanged) |
| §3 cut item 9 — `explain`/`search` stay below the second-caller bar | expository-only against `00` §4 | unchanged as a cut-list row; the bar itself moved onto a Spec | expository-only (unchanged) |
| §6 ① the remaining authoring levers — "later `sdp new spec` / `sdp explain` (below the second-caller bar, `06` §3)" | carried (the typing law) + the bar's citation | unchanged; the cited `06` §3 survives and the bar now has a Spec home as well | carried (unchanged) |
| §4 impact-graph depth (recorded as resolved) · §4 derived-readiness banner timing | expository-only against `06` / carried | unchanged; both mirrors survive | unchanged |

**Drift note, recorded and deliberately not repaired here.** `07` §1's slice-5 row and §3's cut
item 9 both enumerate the CLI as `build` · `validate` · `view`, and `sdp q` now ships. Neither
statement is false — both are historical statements about what the MVP slice delivered and what
the first slice cut — and `00` §4 already carries the current five-verb surface with `q`'s
rationale. This session is an audit and a sweep, so the enumeration is recorded for the successor
rather than edited under a records-only charter (the phase-4 precedent for `07` §6 ④'s three-line
quote, which S6 then repaired deliberately). **Flagged for S6.**

**`07`'s surviving gaps — three rows, unchanged**: inline-vs-centralized anchor semantics (§4,
open) · when harnesses / evidence become CORE (§4, open, the non-Gherkin half) · the
measure-what-hurts prioritization heuristic (§5). All three are named out of scope by §(c);
`07` stays.

### The standing gap ledger

| # | Gap | State after S5 |
|---|---|---|
| 1 | the readiness-floor clause tables (lower rungs + per-kind evidence) | **closed** — phase 4 S2 |
| 2 | the derived-readiness banner | **closed** — phase 4 S3 |
| 3 | the `implemented` view-label rule | **closed** — phase 4 S3 |
| 4 | the one diagnostic rendering rule | **closed** — phase 4 S3 |
| 5 | validator self-testing | **closed** — phase 4 S3 (carried at `defined`; see the sweep, §8) |
| 6 | Design Review's wholesale page rewrite | **closed** — phase 4 S3 |
| 7 | discipline ≈ kind/section mapping · the distribution chart (`06` §6) | stands — out of scope |
| 8a | the impact graph's two assist roles (`06` §2) | stands — out of scope |
| 8b | `bySymbol`'s frozen-shape-but-aspirational status (`06` §3) | **closed at S3** — `spec:consumers.agent-surface`'s deferral clause, bound by `demand-map-entries`. The phase-4 ledger carried 8a and 8b as one row; they are decomposed here because exactly one half closed, and a half-closed row is the kind of imprecision the phase-4 parenthetical precedent exists to prevent |
| 9 | the per-PR hosted preview (`06` §8) | stands — out of scope |
| 10 | inline-vs-centralized anchor semantics · when harnesses/evidence become CORE (`07` §4) | stands — out of scope |
| 11 | measure-what-hurts (`07` §5) | stands — out of scope |
| 12 | the Mermaid and reference-projection surfaces (`06` §1/§8) | stands — out of scope |
| 13 | the per-team severity override for informative signals (`05` §2 check 8) | **closed** — S1, `spec:validation.warn-level-signals` |
| 14 | the team-overridable floor config (`05` §3) | **closed** — S1, `spec:validation.readiness-floor` |

**No gap 15.** This pass minted no new row: the two paragraphs `06` §3 gained this phase are fully
carried (four rows above), and the one decomposition performed (8a/8b) records a closure rather
than a discovery.

## §6 Done-record

*(written at close)*

## §7 Conversion / corpus ledger

*(maintained by the waves; state values `planned` → `done` / `deferred` / `dropped` with
reasons)*

| Wave | Law / artifact | Carrier | Planned points | State |
|---|---|---|---|---|
| S1 | gap 13 — severity-override deferral | `spec:validation.warn-level-signals` (clause) | 0 (deferral, no seam) | **done** — one Rule clause on the carrying Spec, placed before the realizing-entrypoint clause on the `doc:`-reservation precedent (`spec:model.stable-ids`): state the deferral *and* its actual status in one breath. **Point refused, with reason:** a deferral names a capability that does not exist, so there is no executable seam a bound point could resolve against — an example would assert either nothing or an absence, and the mutation-probe discipline (ruling 12) has nothing to turn red. Recording a decorative point would inflate the bound-point count without adding verification. |
| S1 | gap 14 — floor-config deferral | `spec:validation.readiness-floor` (clause) | 0 (deferral, no seam) | **done** — one Rule clause beside the floor-table-as-truth posture (MD-13) the Spec already states, same placement discipline. **Point refused, same reason:** no per-team floor configuration exists to exercise; the clause's positive half (the shipped table is the only floor) is already carried by every existing floor point, so a new point would duplicate coverage rather than add it. |
| S2 | the front-door ruling (+ freshness) | decision Spec — `spec:decisions.agent-front-door` (`specs/decisions/agent-front-door.sdp.md`), registry row MD-22 | — | **done** — candidate (C) ruled: the CLI sink and the exported reader are two entrances over one seam; freshness ruled derive-in-process; the local-tool trust stance recorded in the Spec's consequences. The weighing, the three-part test, and both sub-rulings are on the record at §5b; the no-reparse docket row is closed at §4 |
| S2 | the front-door implementation | `src/cli/q-command.ts` + the `sdp q` dispatch | 0 (points are S4's) | **done** — `sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--json]`; bindings `g` · `graph` · `report`; body from argv or non-terminal stdin, refusing at a terminal rather than hanging; bounded `util.inspect` by default with `--json` as the exact escape; findings render through `formatFinding` only when the graph refuses to derive, never as a gate on the body; writes nothing anywhere. Nineteen residual-style tests in `test/cli-q.test.ts`, pooled leg, no wrapper change. **No implementation anchor added, with reason:** `spec:consumers.agent-surface` already carries one at `src/reader/reader.ts`, and no anchor in this corpus targets a `decision` Spec — minting one here would be a new binding convention smuggled in on a build session |
| S3 | the demand map | `spec:consumers.agent-surface` (enrichment) | — | **done** — four Rule clauses on the carrying Spec: the entry-point catalog (string · file · changeset, never a Spec id the agent does not yet hold), the adapter each one names (`findByConcept` · `byFile` · `blastRadius`, whose answer names every coverage-unknown changed file), the `bySymbol` deferral stated with its actual status on the `doc:`-reservation precedent, and the recipe valve in the Spec's own words. Oracle transcription updated in `test/self-hosting-oracle/consumers.ts`; readiness untouched at `defined`, floor-clean, promotion left to the sweep |
| S3 | the recipe corpus + machine check | `docs/agent-surface/recipes.md` + `test/recipes.test.ts` | — | **done** — eight recipes, each a fenced `js` body runnable verbatim as `sdp q '<body>'`, each with a one-line "when you need this" and a pre-shaped return; the header states the binding contract, the trust stance, and the pre-shape discipline, and cites `spec:consumers.agent-surface` · `spec:consumers.reader` · `spec:decisions.agent-front-door` rather than restating them. The check runs each body through the production seam (`runSdpCli` compiling the body and injecting `g` · `graph` · `report`) against one in-memory derivation from the repository root with the standard exclude list, asserts **shapes only** (no frozen counts), and pairs every numbered heading with exactly one body so a new recipe cannot dodge it. Pooled-lawful and correctly absent from `contract-dependent-suites.mjs` (it imports no generated contract) |
| S3 | the skill on-ramp | `.claude/skills/sdp-agent-surface/SKILL.md` (convention set this session) | — | **done** — the repo shipped no skills, so the location is the convention: `.claude/skills/<name>/SKILL.md`, standard frontmatter (`name`, `description` carrying the trigger conditions), tracked in the repo (`.claude/` is not ignored) so the on-ramp ships with the corpus it teaches. Content is the bootstrap discipline (query the graph before reading spec files; the recipes file is the catalog; `--json` for machines), the binding and body contract, the **anti-anecdote rule** (the derived graph outranks the skill and any cached summary; on disagreement the skill is the bug), and the what-not-to-do list (no carrier parsing, no new verbs, `has-verifier` ≠ tests pass, `implemented` ≠ live, never collapse claims). It cites Specs throughout and restates no law |
| S4 | the whole-pipeline world | `test/fixtures/extract/consumer-surface/` (committed, defused) | — | **done** — one materialized extraction root serves all six points: four Markdown Spec carriers and a TS Pack manifest under `specs/`, a code anchor at `src/create-order.ts`, a test anchor at `test/create-order.test.ts`, and an anchorless `src/price-book.ts`. It carries, in one corpus, every discriminator the wave needs: an **enabled** verifier beside a **declared-only** one (so the claim decode has both answers to give), a binding-only source file and a carrier file (so `byFile` has both halves), an unrecorded file (so `coverage-unknown` has a subject), a Pack (so the view has an aggregate page), and exactly one warning and zero errors (so a finding renders as data on a clean corpus). Every point runs the real extractor over it — no point anywhere in the wave is handed a hand-built graph |
| S4 | agent-surface end-to-end | `spec:consumers.agent-surface` | 1–2 | **done — 2 points.** `…​.scripted-context-body`: a body composing verifier bindings goes through `runSdpCli(["q", …, "--json"])`, and the point reads the sink's own stdout — the printed answer is byte-for-byte the body's return (no banner, no envelope, no dump), the anchored verifier decodes as enabled, and the declared-only one does not (the taxonomy is asserted un-collapsed, not merely correct). `…​.demand-map-entries`: one body reaches all three demand-map entries, and the deferred symbol entry reads as `typeof g.bySymbol === "undefined"` — absent, never stubbed. **Probes:** collapsing the reader's example-verifier `enabled` decode reddens the scripted-body point alone among bound points (plus `test/reader.test.ts` ×4 and `test/design-review.test.ts` ×3 as regression evidence); adding a `bySymbol: () => []` stub to the reader reddens the demand-map point alone (plus the published-surface test, which pins the exported shape). `git status src/` clean after each |
| S4 | reader entry adapters over the full graph | `spec:consumers.reader` | 2–3 | **done — 3 points**, one per adapter law. `…​.concept-entry`: a concept recorded **only** inside a Spec's sections (the point asserts it is in neither id nor title) is reached, and `matchedIn` names `sections.behavior` — the half a grep cannot give. `…​.file-entry`: the binding-only source file names the CodeNode at the path and reaches the Spec that binding names, while the carrier file answers with its own Spec. `…​.changeset-entry`: the impact reason carries the changed file, the binding, and the binding's claim; the one-hop at-risk neighbor carries its connecting edge and claim (and the changed file's own binding node is asserted absent — the change is not the risk); the coverage-unknown file is named and counted. **Probes:** reporting `narrative` in place of `sections.{name}` reddens the concept point alone; dropping the Primitive's own id from `byFile`'s `specs` reddens the file point alone; dropping `claim` from at-risk reasons reddens the changeset point alone. A fourth probe is recorded deliberately: dropping `coverageUnknown` entirely reddens **two** points — the changeset point and the demand-map point — because that honesty half is stated twice on purpose (`spec:consumers.agent-surface` rule 7 and `spec:consumers.reader` rule 5), so the overlap is the corpus agreeing with itself, not a defective probe |
| S4 | Design Review parent law | `spec:consumers.design-review` | 1 | **done — 1 point**, `…​.pure-projection`, stating the parent's own law rather than its children's: the page set is exactly the index plus one page per Spec and per Pack (compared against the graph's own node ids, not a transcribed list); the pack page links every member through the review table; the finding renders as data beside **every node it names and no node it does not** (the index, the whole report's aggregate, excepted); two renders each from a **freshly re-derived** graph are byte-identical (a cached handle or a run identity would survive a re-render off one graph object but not this); and the extraction root is byte-identical afterwards, with no `generated/` in it — "stores no findings and writes no canonical source" made observable. **Probes:** a per-call counter rendered into the index page reddens this point alone among bound points (plus four determinism tests in `test/design-review.test.ts`); making the reader's `findingsNaming` return every finding for every id reddens this point alone (plus the golden oracle) |
| S5 | the optional measured-context refresh | `spec:consumers.agent-surface` (would-be second measured line) | 0 | **refused, with the attempt and its numbers on the record.** Ruling 13's mirror discipline and the Spec's existing measured line (*"a multi-probe agent comparison used about one fifth of the tokens of a comparable grep or verb-API workflow"*) set the bar: a second line must be a *comparable* measurement, not a differently-shaped one wearing the same clothes. A two-arm trial was actually constructed and run before refusing. **Question:** *which Specs state `ready` but carry no implementation binding, grouped by family?* **Arm A** — one `sdp q` invocation: 207 bytes of supplied body, 3,461 bytes of printed answer (3,668 total), and the answer *is* the conclusion. **Arm B** — the smartest grep path a file-reader could take: `grep -rl 'readiness: ready' specs/` (4,051 bytes, 80 paths) plus `grep -rn 'satisfies' src/` (4,844 bytes, 58 lines) = 8,895 bytes. The naive ratio is ≈2.4×, and it is **not reportable**, for three reasons that are the refusal: (1) **arm B does not answer the question** — it returns raw material (file paths, not Spec ids; grep lines, not edges) that an agent must still fuse in-context, so the arms are not comparing like with like; (2) **arm B as measured is wrong** — the 58 `satisfies` lines include prose and code (`edge.type === "satisfies"`) against only **30** real `satisfies` edges in the graph, and the grep never touches `test/`, where verifier anchors live, so that path produces a *confidently incomplete* answer more cheaply than a correct one, which makes a bytes-per-arm ratio meaningless as an efficiency claim; (3) **the ratio is mine to set** — how far arm B is allowed to run before being declared "done" is an authoring choice that swings the number by an order of magnitude, which is the definition of a manufactured benchmark. Compounding all three: the standing line measures a **multi-probe agent session** (cumulative context across many questions), and a single-question byte count is a different construct that cannot stand as its peer, while an honest agent-session measurement needs token accounting over two real sessions that this session cannot instrument. **Nothing was added to the Spec.** The numbers are recorded here as design input for a future measurement, explicitly *not* as evidence of a ratio |

## §8 Readiness ledger

*(maintained at S4 promotions and the S5 sweep; opening distribution `ready: 71 /
defined: 37` over 108)*

**S2**: one new `decision` Spec at `defined` (`spec:decisions.agent-front-door`) — the distribution
moves to `ready: 71 / defined: 38` over 109. No existing Spec's readiness moved; the new Spec is
stated at `defined` on the standing decision-family posture (a decision states its choice; the
`ready` rung waits on the S5 sweep like its siblings).

**S4**: the consumer family's two-sweep refusal class ends. Six new `example` Specs enter at `ready`
and three parents promote, moving the distribution to **`ready: 80 / defined: 35` over 115**.

| Spec | Disposition | Evidence |
|---|---|---|
| `spec:consumers.agent-surface` | `defined` → **`ready`** | Floor: `refines` → `spec:consumers.projections-model` stands at `defined` (clause cleared, and it was checked rather than assumed — nothing was promoted to make this work); `decidedBy` → `spec:decisions.agent-surface-scripts-graph` resolves; both bound anchors resolve. Verifiers: two enabled example children, each bound by a resolving test anchor in `test/self-hosting-consumers.test.ts`. Content judged acceptance-grade as it stood — nine rules covering the surface, the demand map, the deferral, and the recipe valve — so only the example space was added |
| `spec:consumers.reader` | `defined` → **`ready`** | Floor: `refines` → `spec:consumers.agent-surface`, itself now `ready`; anchors resolve. Verifiers: three enabled example children. Content was **enriched first** (ruling 13, mirror-faithful): rule 2 stated the two adapters as one line where the code answers two different questions, so `findByConcept`'s field-naming and `byFile`'s two halves are now stated, the reason-carrying law is stated, and the realizing entrypoint is named. Nothing was invented — every added clause mirrors `src/reader/reader.ts` |
| `spec:consumers.design-review` | `defined` → **`ready`** | Floor: `refines` → `spec:consumers.projections-model` at `defined`; anchors resolve. Verifier: the pure-projection child. Content enriched with the graph-only page-identity clause (the byte-identical guarantee the renderer's header already claimed but the Spec did not state) and the realizing entrypoint |
| the six new `example` children | authored at **`ready`** | Each binds a complete point in its parent's space (every used slot bound, so the concreteness law clears `defined`), declares `refines` + `verifies` at a `ready` parent, and carries its own resolving test anchor — `has-verifier` on the graph, not on assertion |
| `spec:consumers.edit-model` | **refuses again**, recorded not regretted | Its own fourth rule is the reason and has not changed: *"No single realizing entrypoint exists for intent composition; this defined behavior records design intent and has no code anchor or verifier."* Phase 5 lands no write surface (scope, §c), so there is nothing new to bind; a point here would assert an absence and the mutation-probe discipline would have nothing to turn red |
| `spec:consumers.projections-model` | untouched at `defined` | Not this wave's target; it is the family's `model` parent and the S5 sweep owns its disposition. It cleared the dependency clause for all three promotions as it stands, so nothing was promoted to unblock anything |

**S5 — the readiness sweep.** Every one of the **35** Specs standing at `defined` when S5 opened,
dispositioned per-Spec under ruling 5. **Zero promotions, 35 named refusals.** The distribution
closes where S4 left it: **`ready: 80 / defined: 35` over 115**, and no spec file, oracle
transcription, or histogram literal moved, because nothing was promoted.

**The mechanical finding first, because it decides 35 of 35.** Not one of the 35 carries
`has-verifier` in the regenerated graph, so **every** promotion would trip `checkGaps`
(`src/validate/validators.ts` — a `ready` node without `has-verifier` emits an `honesty/gaps`
warning) and fail ruling 5's clause (b). Every one of them *does* clear the structural floor —
each page reads "structural floor reached: `ready`" — so the refusals are about missing evidence,
never about missing structure. **Eight** of the 35 additionally carry `implemented`
(`spec:carrier.markdown-authoring` · `spec:consumers.projections-model` ·
`spec:extraction.claim-taxonomy` · `spec:extraction.regenerability` · `spec:model.core-model` ·
`spec:model.pack-aggregate` · `spec:model.relations` · `spec:model.spec-sections`), which is the
ordinary `implemented ∧ ¬ready` reading and not a defect: a binding is not a verifier, and the
drift alarm is a payoff query, never a check. Inventing a verifier to enable a promotion is exactly what the ruling forbids, and this
session adds no bound points by charter.

**The two checks the charter named specifically, both answered.**

1. **Did S2's `spec:decisions.agent-front-door` land at `defined`, and does the decision-family
   refusal hold?** Yes to both. It is stated `defined` (§8's S2 note), its page reads "stated
   `defined` · structural floor reached: `ready`", and it carries no binding of any kind. It joins
   the standing decision class as its 22nd member — the class was 21 at phase 4.
2. **Was any Spec whose verifier landed in S2–S4 left behind at `defined`?** No. S2's
   `test/cli-q.test.ts` (19 tests) and S3's `test/recipes.test.ts` are **engine and corpus checks,
   not bound points** — neither authors an `example` child or a test anchor, so neither confers
   `has-verifier` on anything. S4's six bound points all landed on the three consumer parents,
   and all three promoted in the same wave (§8 above). The mechanical finding is the proof: with
   zero of the 35 carrying `has-verifier`, no Spec can have been left behind holding one.

| Spec | Disposition | Reason |
|---|---|---|
| `spec:protocol.self-hosting` | refuse | **phase-4 refusal stands verbatim**: the epic states whole-pipeline rules (one regenerable graph through one validation path; determinism in a clean clone); no cheap verifier exists and promotion would add a gap warning. Its second rule's world is the phase close's clean-clone proof, which is process evidence, not a bound point |
| `spec:carrier.markdown-authoring` | refuse | **phase-4 refusal stands verbatim**: it is the parent of four `ready` children and states one rule (both carriers feed the same reification path); the executable path lives on the children, and `has-verifier` is direct, never transitive |
| `spec:consumers.edit-model` | refuse — **its own stated rule, re-confirmed against this phase** | Its fourth rule *is* the reason and is unchanged: *"No single realizing entrypoint exists for intent composition; this defined behavior records design intent and has no code anchor or verifier."* Phase 5 landed no write surface — §(c) names any structured write contract out of scope, and the front door writes nothing anywhere — so there is nothing new to bind. It is the one Spec in the corpus whose `defined` is stated by its own content, and promoting it would falsify that content |
| `spec:consumers.projections-model` | refuse — **reason MOVED, and the move was checked rather than assumed** | The phase-4 reason ("vocabulary; … now also the parent of the view family whose points sit **two hops away**") no longer describes the graph: after S4 its children `spec:consumers.agent-surface` and `spec:consumers.design-review` are `ready` and carry points **one hop away**. The conclusion is unchanged for the reason that matters — `has-verifier` is direct and never transitive, so a child's point confers nothing upward. Its own evidence posture was re-judged against the S4 worlds as the charter asked, and **did not change**: it is a `model` Spec whose ten terms are vocabulary, two of which cannot be verified even in principle at this corpus state — *impact graph* names a substrate that does not exist (`06` §2's aspirational boundary, and `bySymbol` is absent by design), and *measured curation* is recorded evidence from a prior comparison, not runtime law. The S4 whole-pipeline worlds exercise the reader's adapters and the view's projection law; they exercise none of this vocabulary. Stating `ready` here would claim earned evidence for terms half of which name a deferral |
| `spec:extraction.build-pipeline` | refuse — **reason MOVED (refusal upheld, candidacy recorded)** | The phase-4 reason was "the ordered flow's world is the CLI pipeline — a named out-of-scope giant". That still holds for the five ordered steps. What changed is its **rule 6** (*"Every command uses the same extracted graph and validation seam"*): `sdp q` is a new command that goes through exactly that seam, and `test/cli-q.test.ts` already exercises it un-bound — the sink injects the validation report as data (*"injects the validation report as data, never as a gate"*) and refuses to run the body when the graph does not derive, rendering the extraction findings. That is a **real world for rule 6**, and it is now the strongest candidate this Spec has ever had. It is not converted here because this session authors no bound points by charter (and one point on rule 6 would not clear the whole Spec, whose ordered-flow rules still have no cheap world). **Named for the successor** |
| `spec:extraction.regenerability` | refuse | **phase-4 refusal stands verbatim**: its law is the clean-room rebuild, which is the phase close's proof, not a cheap point. Carries `implemented`, not `has-verifier` |
| `spec:extraction.claim-taxonomy` | refuse | **phase-4 refusal stands verbatim**: vocabulary; its clauses are exercised through `spec:validation.claim-separation`'s `ready` points, which verify that Spec and not this one. S4's points decode the taxonomy (the anchored-vs-declared-only assertion in `scripted-context-body`) but they verify `spec:consumers.agent-surface`, and direct-only linkage keeps that where it belongs |
| `spec:model.core-model` | refuse | **phase-4 refusal stands verbatim**: refused on ruling 1 — `test/descriptors.test.ts` is list equality, not a law |
| `spec:model.spec-sections` | refuse | **phase-4 refusal stands verbatim**: same reading as `core-model`; the section-name list is an assertion, not an example space |
| `spec:model.relations` | refuse | **phase-4 refusal stands verbatim**: vocabulary; relation grammar is exercised by referential-integrity's points |
| `spec:model.pack-aggregate` | refuse | **phase-4 refusal stands verbatim**: vocabulary; the pack law is carried executably by `spec:validation.pack-coherence`. (S4's `design-review.pure-projection` point renders a Pack page, but it verifies the projection law, not the aggregate) |
| `spec:model.protocol-domain` | refuse | **phase-4 refusal stands verbatim**: a four-term vocabulary with no runtime law to bind |
| `spec:validation.validator-self-testing` | refuse — **phase-4 refusal stands verbatim, re-judged a third time** | Re-judged against the S2/S3/S4 surfaces and unchanged: its law is evidence discipline *over* the validators, so the only mechanical check would read the test corpus for should-fail/should-pass pairs — **policing the delivery process**, which the standing guardrail forbids and which the Spec itself states as a non-goal in its own fourth clause. A point that merely re-ran an existing validator test would verify that validator, not this discipline. Honest `defined` with acceptance-grade content — the dissolution criterion asks that the law be *carried*, never that the carrier be `ready` |
| `spec:decisions.agent-front-door` | refuse — **new this phase, joins the standing class** | Authored at `defined` by S2 on the decision-family posture. The class reason applies unchanged: a Decision Record's truth is a **ratified choice**, not a runtime behavior. The behaviors the ruling produced *are* verified — `sdp q`'s law is bound through `spec:consumers.agent-surface`'s two points — but those points verify the surface Spec, and a decision does not mature because a Spec realizing it does. It carries no anchor by deliberate refusal (§7: no anchor in this corpus targets a `decision` Spec, and minting one would smuggle in a new binding convention) |
| 21 × `spec:decisions.*` — `adopt-the-nouns` · `agent-surface-scripts-graph` · `binding-not-liveness` · `carried-evidence` · `carrier-ruling` · `concept-docs-dissolve` · `content-only-sections` · `envelope-grammar-posture` · `exclusion-contract` · `executable-meta-model` · `kind-conditional-floor` · `mcp-deferred` · `one-primitive` · `one-validation-path` · `pack-reified` · `plain-language-references` · `point-per-example` · `prose-ownership` · `protocol-naming` · `sdp-ts-extension` · `typing-law` | refuse ×21 | **phase-4 refusal stands verbatim**: a Decision Record's truth is a ratified choice, not a runtime behavior — no verifier exists and none was invented. This phase reconfirms it twice over: `spec:decisions.agent-surface-scripts-graph` gained two bound points *downstream* at S4 and a `ready` citing Spec, and stays `defined`; `spec:decisions.mcp-deferred` is cited by a now-`ready` `spec:consumers.agent-surface` family and stays `defined` |

**Refusal count by class (35 = 22 + 7 + 3 + 1 + 1 + 1):** 22 decision Specs (standing precedent,
one of them new) · 7 vocabulary Specs (`projections-model` — the consumer family's `model` parent
— · `claim-taxonomy` · `core-model` · `spec-sections` · `relations` · `pack-aggregate` ·
`protocol-domain`) · 3 whole-pipeline / measured-evidence
tails (`self-hosting` · `build-pipeline` · `regenerability`) · 1 parent-of-`ready`-children
(`markdown-authoring`) · 1 workflow-policing verifier (`validator-self-testing`) · 1 self-stated
refusal (`edit-model`). **Reasons that MOVED from a prior phase: two** —
`spec:consumers.projections-model` (hop distance corrected; evidence posture re-judged against the
S4 worlds and unchanged) and `spec:extraction.build-pipeline` (rule 6 now has a real world in
`sdp q`; recorded as the successor's strongest candidate). Every other reason stands verbatim, and
each row says so explicitly.

**Opening distribution confirmed at S1** against the regenerated graph: 108 `Primitive` nodes,
`ready: 71 / defined: 37`, no other rung present. S1 moved no readiness — it enriched two
already-`ready` Specs with one clause each, and both stayed floor-clean (the `rule` kind's
evidence is its statement, so an added clause can only strengthen it).

## §9 Session and gate ledger

Sessions execute sequentially; each closes with a green twelve-leg gate, a regenerated Design
Review where the wave touched the corpus, and a commit series on the effort branch. This
ledger is git process evidence, never graph content.

| Session | Delivers | Gate discipline | State |
|---|---|---|---|
| S1 | gaps 13/14 carried; the `05` audit and (expected) deletion with full re-pointing and the two-form sweep | orchestrator-verified green gate over the regenerated Design Review | **done** — both deferrals carried as one clause each (no new Specs, both points refused with reasons, §7); the re-audit graded **fully carried** over the regenerated Design Review (§5a below); `docs/concept/05-validation-and-honesty.md` **deleted** with 24 inbound surfaces re-pointed in the same change and both sweep forms at **zero hits**. Corpus unmoved at 108 Specs · 1 Pack · 80 anchors → 189 nodes · 371 edges, `ready: 71 / defined: 37`, 0 errors / 0 warnings; full twelve-leg `npm run check` green |
| S2 | the front-door and freshness rulings; the front-door build; the no-reparse docket disposition | orchestrator-verified green gate | **done** — candidate (C) ruled and carried as `spec:decisions.agent-front-door` (MD-22) with the weighing at §5b; freshness ruled derive-in-process and the no-reparse docket row closed (§4); the trust stance recorded. `sdp q` landed in `src/cli/q-command.ts` with 19 tests in `test/cli-q.test.ts`; the CLI surface list in `docs/concept/00` §4 and the agent-surface exposition in `06` §3 re-pointed (the slice-5 provenance rows in `AGENTS.md` and `07` left as history). Corpus moves to 109 Specs · 1 Pack · 80 anchors → 190 nodes · 373 edges, `ready: 71 / defined: 38`, 0 errors / 0 warnings; full twelve-leg `npm run check` green |
| S3 | demand map · verified recipes · the skill | orchestrator-verified green gate | **done** — the demand map authored as four clauses on `spec:consumers.agent-surface` with the oracle transcribed; `docs/agent-surface/recipes.md` landed with eight runnable bodies and `test/recipes.test.ts` executing every one through the production `sdp q` seam on shape-level invariants (mutation-probed three ways); the skill on-ramp landed at `.claude/skills/sdp-agent-surface/SKILL.md`, setting this repo's skill convention. `docs/concept/06` §3 picked up the demand map and the catalog pointer in the same change (drift discipline). Corpus unmoved at 109 Specs · 1 Pack · 80 anchors → 190 nodes · 373 edges, `ready: 71 / defined: 38`, 0 errors / 0 warnings; full twelve-leg `npm run check` green |
| S4 | whole-pipeline bound points; consumer-family promotions | orchestrator-verified green gate | **done** — six bound points over one materialized whole-pipeline root (§7), each mutation-probed before recording and each probe leaving `src/` clean; all three consumer parents promoted to `ready` with `spec:consumers.edit-model`'s standing refusal recorded (§8). The new bound suite `test/self-hosting-consumers.test.ts` entered through the shared `contract-dependent-suites.mjs` row and both surfaces followed — clean-room verified with the contracts tree set aside: `npm run lint` exits 0, and `node ./vitest-test.mjs test/self-hosting-consumers.test.ts` refuses fast with *"Generated contracts required by the selected test suite are missing. Run `npm run build && npm run generate:self-hosting` first."* Corpus moves to 115 Specs · 1 Pack · 86 anchors → 202 nodes · 397 edges, `ready: 80 / defined: 35`, 0 errors / 0 warnings; full twelve-leg `npm run check` green |
| S5 | readiness sweep; `06`/`07` re-grades; optional measured-context refresh | orchestrator-verified green gate over the regenerated Design Review | **done** — the sweep dispositioned all **35** `defined` Specs with **zero promotions and 35 named refusals** (§8): none carries `has-verifier` in the regenerated graph, so every promotion would have added an `honesty/gaps` warning, and no verifier was invented to enable one. Both charter checks answered on the record — `spec:decisions.agent-front-door` landed and holds at `defined` as the decision class's 22nd member, and no Spec whose verifier landed in S2–S4 was left behind (S2's and S3's suites are engine and corpus checks that author no points; S4's six all landed on parents that promoted in the same wave). Two refusal reasons **moved**: `spec:consumers.projections-model` (its family's points are now one hop away, not two — refusal upheld on direct-only linkage, and its evidence posture re-judged against the S4 worlds and found unchanged) and `spec:extraction.build-pipeline` (`sdp q` gives its rule 6 a real world for the first time — recorded as the successor's strongest candidate, not converted, because this session authors no points). The `06`/`07` re-grades ran to the standing template (§5c): **`06` closes one gap** (`bySymbol`'s frozen-shape-but-aspirational status, carried by S3's deferral clause and bound by `demand-map-entries`), moves the second-caller bar off `00`/`07` onto a Spec, and grades this phase's two new §3 paragraphs fully carried — five gaps stand, `06` **stays**; **`07` moves no row** and its three gaps stand, `07` **stays**. Neither audit surprised toward fully-carried, so ruling 14 did not run. The optional measured-context refresh was **refused with the attempt and its numbers recorded** (§7) rather than manufactured. Records-only session — no product surface changed, graph numbers unmoved at 115/1/86 · 202 · 397 · `ready` 80 / `defined` 35, 0 errors / 0 warnings; full twelve-leg `npm run check` green |
| S6 | adversarial review, remediation, full close, done-record, PR | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner
acceptance occurs during execution.

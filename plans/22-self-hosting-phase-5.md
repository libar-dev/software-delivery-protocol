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
| recipe rot | a recipe body stops running as written (ruling 17's check is the alarm) | unfired |
| skill anecdote drift | skill text restates or contradicts law a Spec carries instead of citing it | unfired |
| eval trust boundary | the front door's input handling grows past the recorded local-tool trust stance | unfired — the stance is now recorded (ruling 21, §5b and `spec:decisions.agent-front-door`): local developer tool, no sandbox claimed, root resolved to a canonical validated directory at the edge. The item fires if the sink ever takes input from a non-operator source or starts implying containment |
| oracle thrash | the corpus wave forces cross-family edits in the split oracle (per-family modules should localize) | unfired |
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
| S3 | the demand map | `spec:consumers.agent-surface` (enrichment) | — | planned |
| S3 | the recipe corpus + machine check | authored artifact + check per ruling 17 | — | planned |
| S3 | the skill on-ramp | consumer artifact (location recorded) | — | planned |
| S4 | agent-surface end-to-end | `spec:consumers.agent-surface` | 1–2 | planned |
| S4 | reader entry adapters over the full graph | `spec:consumers.reader` | 2–3 | planned |
| S4 | Design Review parent law | `spec:consumers.design-review` | 1 | planned |

## §8 Readiness ledger

*(maintained at S4 promotions and the S5 sweep; opening distribution `ready: 71 /
defined: 37` over 108)*

**S2**: one new `decision` Spec at `defined` (`spec:decisions.agent-front-door`) — the distribution
moves to `ready: 71 / defined: 38` over 109. No existing Spec's readiness moved; the new Spec is
stated at `defined` on the standing decision-family posture (a decision states its choice; the
`ready` rung waits on the S5 sweep like its siblings).

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
| S3 | demand map · verified recipes · the skill | orchestrator-verified green gate | planned |
| S4 | whole-pipeline bound points; consumer-family promotions | orchestrator-verified green gate | planned |
| S5 | readiness sweep; `06`/`07` re-grades; optional measured-context refresh | orchestrator-verified green gate | planned |
| S6 | adversarial review, remediation, full close, done-record, PR | full chain + clean-clone; review archived | planned |

Owner ratification of every gate above happens at the phase PR review; no live owner
acceptance occurs during execution.

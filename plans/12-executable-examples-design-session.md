# Plan 12 — Executable examples: the design session (PLAN-ONLY)

> **Status: 🔲 DRAFTED 2026-06-11 — not yet run.** A **PLAN-ONLY** session: it decides and
> records; it edits no target files (a throwaway type-feasibility spike in an isolated scratch
> directory is permitted, discarded before the session closes). The session exists because the
> product owner declared the pain the roadmap says orders the next phase (`07` §5): gen 2 gained
> type safety by rejecting dual-source authoring, but lost the gen-1 DX of **executable specs** —
> the spec itself driving test execution with immediate feedback. **Every option is on the
> table, including the extension, redefinition, or reimplementation of Gherkin** — what is not
> on the table is the trust model (§1).
>
> **Queue note:** this session was pulled ahead of the decision-spec fold (the pointer plans 10
> and 11 carry); the fold stays pending and is unaffected by anything decided here.
>
> **Spec anchors:** `02` §3 (an example becomes executable as a low-altitude `example`-kind spec;
> verifier semantics — direct, per-spec, structural) · `04` §1 (the TS DSL is canonical) · `04`
> §4 (Gherkin and harnesses — named, ASPIRATIONAL) · `00` §5 (the cut table rows for Gherkin and
> harnesses) · `07` §3.3 (the dual-source anti-pattern), §5 (measured pain orders the next
> phase), §6 ① (authoring ergonomics is the headline forward risk; `--watch` is a named lever) ·
> MD-1 ("executable specs alone (BDD) is unremarkable") · MD-15 (`.sdp.ts` is deliberately not a
> test-runner glob) · JS-B1.4 (an anchor never carries verification) · JS-B2.3 (no import edges
> between specs and code) · JS-B2.6 (a generated ids union for early `tsc` checks is designed-in)
> · JS-D2 (a passing `sdp validate` is a credible statement).

## §0 — The job and the gap

The MVP's spec↔test story is **pairing, not execution**: a structured GWT `example`-kind spec is
the authored half, a hand-written runner test is the executable half, the `specTest` anchor binds
them, and the graph records that an enabled verifier *exists* (`has-verifier`), never that it ran
(MD-7). What is missing is the gen-1 DX where the spec *drives* the test: edit the spec, watch the
bound test go red, read failures in the spec's own language.

**Gen-1 evidence** (prior art `@libar-dev/architect` — evidence about the problem, never the
answer): Gherkin `.feature` files executed through `@amiceli/vitest-cucumber`
(`loadFeature` + `describeFeature`); step handlers in companion `.steps.ts` files bound by string
match at runtime. The DX wins were real — failure messages named Rule/Scenario/step, watch mode
re-ran on edit, Examples tables killed parameterization boilerplate, features doubled as living
docs. The documented costs were equally real (`FEEDBACK.md`, `VALIDATION.md`, ADR-002/ADR-008):
binding drift surfaced only at **runtime** (TypeScript cannot see a Gherkin↔handler binding); a
whole custom static analyzer (`architect-lint-steps`) existed to approximate what a type checker
gives for free; and the canonical dual-source rot (guard code vs formal spec vs skills docs) had
to be repaired by hand.

**The candidate framing the session must ratify or refute first:** *executability was never the
disease — the disease was a binding invisible to the type system, which is a property of
Gherkin-as-a-second-language, not of executable specs.* If that framing holds, the cut-list
rationale stays true and the DX is recoverable; if it does not, the options below change weight.

## §1 — Fixed points (not on the table)

Whatever surface wins, these do not move; an option that requires bending one is dead on that
clause:

1. **One graph, one Primitive.** Every authoring surface reifies to the *same* `Spec` node shape
   and the same schema — familiar nouns stay named coordinates on the one primitive. A new
   surface is a new front door, never a new room.
2. **Static reification (P5).** Extraction never executes authored sources. A surface whose
   content cannot be read statically does not extract.
3. **Binding, never liveness (MD-7).** The graph records bindings; pass/fail/skip/quarantine
   stay CI's. No option ingests run results.
4. **Delivery facts derived, never authored; the claim taxonomy never collapsed.**
5. **Checks police conformance and honesty, never content-quality.** No validator may judge
   whether a test body faithfully implements its GWT.
6. **Determinism (P3).** Any generated artifact is a pure function of the repo, regenerable,
   never authoritative.
7. **No round-trip, ever.** Generation is one-way in every option — either authored-spec →
   derived projection, or authored-surface → derived contract. Two-way sync is the recorded
   anti-pattern regardless of surface.
8. **Intent and implementation stay split.** A spec never carries executable closures
   (JS-B1.4's boundary, R1, MD-10): step *bindings* are implementation and live with tests.

## §2 — The law collisions the session must resolve by name

These are honest conflicts between recovery options and ratified text — each needs an explicit
keep / refine / supersede decision, with the paper trail the discipline demands:

- **JS-B2.3 — "linked by IDs in strings, never by TypeScript import edges; neither side imports
  the other."** A test that imports the spec value to gain literal-typed step keys breaches this
  criterion directly. Either the criterion is refined (e.g. production code never imports specs;
  a *test* consuming the spec value is a named exception) — a real supersession to record — or
  the option space must route around imports entirely. Note the base already names the lawful
  route: **JS-B2.6's generated-union pattern** (derived contracts you *may* import, because they
  are projections keyed by stable ID, not the authored source).
- **The dual-source rejection (`07` §3.3 · `00` §5 · `04` §4).** Its exact recorded sentence is
  "a single canonical authoring surface **per spec**." A surface *partition* — e.g. Gherkin as
  the sole home of `example`-kind specs, TS for everything else — satisfies the letter (each
  spec has exactly one home). The session must decide whether it satisfies the spirit, and what
  doc repair each choice requires.
- **MD-1's gloss** ("executable specs alone (BDD) is unremarkable") reads, without context, as a
  rejection of executable specs. If §0's framing is ratified, the gloss earns a refinement: the
  meta-model stays the headline *and* the executable half is a recovered surface, not a pivot.
- **MD-15.** `.sdp.ts` stays out of runner globs in every option; nothing here may make spec
  files themselves execute under the test runner.

## §3 — The option space

All options assume the anchor layer is untouched: the `specTest` anchor remains the only thing
the graph reads; everything below is DX in the runner, invisible to extraction.

| # | Option | Mechanism | Drift detection | Laws touched |
|---|---|---|---|---|
| **A1** | **Direct import, const-generic DSL** | The test imports the spec value; `spec<const T extends Spec>(d: T): T` preserves literal GWT strings; `executeExample(spec, bindings)` types bindings as `Record<StepOf<T>, StepFn>`; the adapter emits `describe`/`it` from spec text | **Compile-time** (missing handler and renamed step are `tsc` errors) | **JS-B2.3** (import edge spec→test) — needs refinement/supersession |
| **A2** | **Generated step contracts** (the JS-B2.6 pattern, extended) | `sdp build` additionally emits a derived, regenerable step-contract module per example spec (keyed by spec ID); the test imports the *generated* contract, never the spec; same `executeExample` typing | **Compile-time**, one build-step behind authoring (stale contract = stale types; `--check-clean` already pins generated-artifact freshness) | none — the pattern is already designed-in for ID unions; adds a codegen stage to `build` |
| **B** | **Gherkin as one-way projection** | `.feature` files *generated from* example specs (readability/BI surface; possibly fed to external BDD tooling read-only); execution still via A1/A2 or hand-written tests | inherits A1/A2 | none (a projection like the Design Review); does not by itself recover the DX |
| **C1** | **Gherkin as the sole authoring home of `example`-kind specs** | The extractor gains a Gherkin parser; `.feature` (or `.sdp.feature`) files reify to the same `example` Primitive (id/readiness/relations via a typed header or annotations); step contracts generated as in A2; TS DSL remains canonical for the other seven kinds | Compile-time via generated contracts (gen 1's linter becomes `tsc`) | the dual-source letter survives (one home per spec); the spirit and the cut-list rationale need an explicit ruling; second parser + grammar discipline is the recorded cost |
| **C2** | **SDP-flavored Gherkin (redefinition/reimplementation)** | An own, minimal, statically-parsed grammar — Gherkin's readable skeleton with the Protocol's envelope as first-class syntax (id · kind · altitude · readiness · relations), designed for the graph rather than annotated onto it; reifies to the same Primitive; contracts generated as in A2 | Compile-time via generated contracts | same rulings as C1, plus owning a grammar + parser forever (supply-chain note: in-house parser vs a Gherkin dependency); the strongest non-engineer surface, the largest standing cost |
| **D** | **Specs carry step closures** | `example` specs embed executable step functions | n/a | dead on §1.2/§1.8 (non-static content; intent/implementation fusion) — recorded here so it is rejected by name, not forgotten |
| **E** | **Status quo (the null option)** | Agent generates plain tests from GWT; pairing policed by the existing checks | review-time only | none — the baseline every option must beat |

Shared notes:

- **A2 and C1/C2 converge on the same codegen mechanism** — the surface choice and the
  type-safety mechanism are separable decisions. The generated contract is derived-never-authored
  (§1.6) and keyed by spec ID (JS-B2's refactor-freedom essence holds: moving files breaks
  nothing).
- **The runner half is the same everywhere:** a thin, framework-neutral core
  (`executeExample` produces a plan) plus a vitest adapter under a subpath export, keeping the
  package's single-runtime-dependency posture; vitest enters as an optional peer of the adapter
  only.
- **Prose-only examples refuse to execute** in every option — only structured GWT (the
  `defined`-rung form) is bindable; refusing is the honest behavior, not a degraded run.
- **The friction is the contract:** under compile-time binding, editing a GWT string breaks the
  bound test at `tsc` time. That is the drift alarm surfacing at the cheapest moment; binding by
  index instead would be the silent failure the model forbids elsewhere.

## §4 — Evaluation scorecard

Score each surviving option against, in order of severity:

1. §1 fixed points (pass/fail — a fail ends the option);
2. compile-time drift detection (the gen-1 lesson — runtime-only binding is what made gen 1
   build a linter);
3. per-spec single source honored in spirit, with the doc-repair bill named;
4. failure messages and watch loop in spec language (`07` §6 ①'s ergonomics bar; the `--watch`
   lever);
5. agent ergonomics — the spec stays the prompt; generation stays one-shot compilation of
   intent, not runtime interpretation;
6. non-engineer readability (the only axis where C1/C2 beat A1/A2 — weigh it against actual
   consumers: the Design Review already renders GWT for humans);
7. standing costs: second parser/grammar ownership, codegen stage in `build`, dependency
   posture, the second-caller bar for every new public surface;
8. migration story for the worked example and the acceptance criteria of record.

## §5 — Decisions this session must produce

Each with its recorded home (DECISIONS.md only where the three-part test admits it; otherwise
the plan's own pin):

1. **Ratify or refute the §0 framing** (executability vs dual-source as the disease). Likely a
   DECISIONS entry refining MD-1's gloss — surprising without context, hard to reverse once
   surfaces ship against it.
2. **Choose the surface(s):** A1 · A2 · A2+B · C1 · C2 (D dies in §3; E is the bar to beat).
3. **Rule on JS-B2.3** (keep · refine with a named test-side exception · supersede), and on the
   dual-source letter-vs-spirit question if any C option wins. Both are story/criterion edits —
   the JTBD base is the functional spec, so this is a recorded change, not drift.
4. **The typing mechanism:** const-generic DSL (A1) vs generated contracts (A2/C) — including
   `StepOf<T>` feasibility, duplicate-step semantics within one example, and the
   world/lifecycle contract of `executeExample` (per-example isolation, async steps).
5. **Package shape:** subpath export name, the framework-neutral core / vitest-adapter split,
   peer-dependency policy.
6. **Names to ratify, not coin silently** — candidates the session must take to the language
   base: *the executable half* · *step binding* · *step contract* · *execution adapter*.
7. **The doc-repair bill** for whichever option wins (`00` §5 cut table · `04` §4 · `07` §3.3 ·
   MD-1 gloss · JTBD B-theme), and **CORE/ASPIRATIONAL placement** — plus the scope of the
   execution session (plan 13) with the worked example as tracer bullet: at least one
   checkout-v1 example executing through the new surface before the session counts as done.

## §6 — Session shape

1. Walk §0–§2 to a ruling on the framing and the law collisions (the decisions everything else
   hangs on).
2. Score §3 options on §4; eliminate to one (or one + projection B).
3. Optional de-risk spike, isolated and discarded: prove `StepOf<T>` exhaustiveness over nested
   readonly GWT arrays (A1) and/or a generated-contract sample for one checkout-v1 example (A2)
   typecheck as claimed.
4. Draft the DECISIONS entries and language-base candidates; write plan 13 (execution) with its
   done-record criteria.

**Exit criteria:** one ratified option with its law rulings recorded; the naming candidates
flagged in the language base's terms; plan 13 scoped against the worked example; the cut-table /
JTBD repair list enumerated. Until those exist, nothing under `src/` or `examples/` changes.

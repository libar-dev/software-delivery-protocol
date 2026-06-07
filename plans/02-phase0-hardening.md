# Phase 0 Hardening — Fidelity & Simplification Pass (post-Session-1 review)

> **Status: DRAFT · iterating to implementation-ready.** This plan records the findings of the Session 1
> implementation review and turns them into actionable work items. It is **not** locked: several items carry an
> **open decision** (marked ⊳) that we will resolve together before this is execution-ready. Sequencing here is a
> first cut, not a contract.
> **Date:** 2026-06-07 · **Branch:** `feature/mvp-init` · **Repo state:** Session 1 committed (`eb6bf2a`); fully
> green (`npm run check`: typecheck ×2, lint, format, 43 tests, build).

This plan covers the gap between *"Slice 0 is green"* and *"Slice 0 is a faithful, lean foundation the extractor
can safely build on."* It is a **hardening pass on the already-implemented Phase 0**, not new scope. It deliberately
stays inside the Slice 0 boundary — **no extractor, no graph emission, no graph gate** — except where a fix must be
*designed now* so the extractor (Slice 1) doesn't inherit a landmine.

---

## §0 — How this fits

Session 1 implemented Slice 0 (the protocol as typed code) + bootstrap + the `checkout-v1` tracer bullet, and it is
green and largely faithful to the ratified base. The review found a through-line of issues that are **fidelity
corrections and net complexity reductions**, not polish — so they belong *before* the design ossifies under the
extractor, while it is still cheap to move.

Two framing commitments carried from `AGENTS.md`:

- **This is not over-perfection.** Every "now" item below is either (a) a divergence from the ratified base
  (`docs/concept/ubiquitous-language.md`, `02`, `04`, `05`) or (b) a *removal* of complexity that masks the design.
  General code-quality/type-coverage polish stays deferred per the working discipline ("let the design breathe").
- **Tracer-bullet discipline.** The example must keep forcing the DSL to be usable — and, from Slice 1 on, must
  survive *static* extraction. One finding (H1) is precisely where the current example would break that.

---

## §1 — Baseline: what is correct and must not regress

Recorded so the hardening pass is measured against it:

- Trust-model boundaries intact: no extractor, no `graph.json`, no graph gate; delivery facts are **derived-only
  types**; anchors are **identity-only** (`@ts-expect-error` fixtures prove they reject readiness/intent/facts).
- `graph/schema.ts` is faithful and inert: `nodeType` vs `specKind` split (`03`/`05`), `claim` on every node/edge,
  delivery facts on `PrimitiveNode`, authored vs derived edge types separated.
- IDs (`02` §5): grammar + branding only, namespace policy correctly deferred.
- Relations (`02` §6): direction + `claim:"declared"` exactly per the table; verb-form names correct.
- Core `src/` is domain-neutral (zero order/checkout names). The example's two-edge verifier semantics (test
  `verifies` the example; example `verifies` the parent) match `02` "Verifier semantics" precisely.
- `AuthoredModel` is honestly fenced (doc-comment + `deferredInSession1` clauses).

**Regression gate for this pass:** `npm run check` stays green; all current invariants above still hold.

---

## §2 — The root tension (drives H2–H5)

`src/model/sections.ts:14-23` types every section as `Record<string, unknown>`. The ratified design (**L9**,
`02` §3) intends **typed-but-optional** sections; **P7** ("types describe *shape*; validators decide
*completeness*") governs *which fields are required*, not *whether fields are typed at all*. Open bags collapse
"optional" into "unknown," with three concrete costs:

1. **The tracer bullet proves less than it claims.** The example typechecks against `unknown`, so "it compiles"
   says nothing about the DSL capturing section *shape* — the session's headline goal.
2. **The authoring-shape honesty check (`05` #5) is bypassable.** Verified: the envelope rejects a top-level
   `implemented: true` (excess-property check), but `behavior: { "has-verifier": true }` **typechecks** — a
   hand-authored delivery fact hides one level down, and no validator catches it in Session 1.
3. **Validators must string-probe at runtime** (`spec.behavior.given`, `spec.intent.outcome`); a typo in a section
   field name silently passes the floor.

⊳ **Open decision D1 — how much to type now.** Recommendation: type the **five sections the floors and the
extractor depend on** — `intent`, `behavior`, `constraints`, `model`, `verification` — and leave `design` /
`decision` / `ui` as open bags so the unsettled surfaces keep breathing. This closes H2/H3/H4 and the honesty
bypass for object literals, without over-committing the volatile sections. (Alternatives: type all eight now; or
type none and add a runtime authoring-shape validator instead. To resolve.)

---

## §3 — Work items

Severity: 🔴 act before Slice 1 · 🟠 fidelity fix · 🟡 simplification · ⚪ hygiene.
Disposition: **NOW** (this pass) · **DEFER** (named, later).

### 🔴 H1 — Make the example statically extractable (P5) · **NOW**

- **Finding.** Both scenario specs build `behavior` via a runtime call:
  `examples/checkout-v1/specs/orders/create-order-valid-cart.spec.ts:5` and
  `…/create-order-invalid-cart.spec.ts:5` use `const thenKey = "then"` +
  `Object.fromEntries([...]) as Record<string, unknown>`.
- **Why it matters.** `04` §1 (the static-data constraint, P5): a spec file is "a JSON file that TypeScript happens
  to validate"; the Slice 1 `ts-morph` extractor **reifies without executing**. `Object.fromEntries(...)` cannot be
  statically evaluated. Per the two-tier rule, a non-static *section* is **silently dropped with a warning** (L3) —
  so under Slice 1 these scenarios lose their `given/when/then`, and the `example` readiness floor (which requires
  them at `defined`+) flips them from valid → honesty violation. The tracer bullet would mine the very extractor it
  exists to de-risk.
- **Verified root cause.** The dynamic form buys nothing: a plain object literal with a `then` key **lints clean
  (eslint exit 0)** and typechecks. The `thenKey`/`Object.fromEntries` indirection is gratuitous.
- **Change.** Replace both with plain static object literals (no `thenKey`, no `Object.fromEntries`).
- **Files.** the two scenario `*.spec.ts` only.
- **Verify.** `tsc --noEmit -p tsconfig.examples.json` green; `npm test` green; manual: no function calls remain in
  `examples/**/specs/**`.
- **Forward hook (DEFER, but name now).** Slice 1's "done" must include *the example survives static extraction
  byte-for-byte*; the `sdp/spec-static` lint rule (`04` §1) is the earlier backstop.

### 🟠 H2 — Honesty check points at the wrong section (blocking open questions) · **NOW**

- **Finding.** `src/validate/validators.ts:199-206` (`hasNoBlockingOpenQuestions`) and
  `src/validate/readiness-floor.ts:91,105` read `spec.design.openQuestions` / `spec.decision.openQuestions`. The
  canonical home is **`intent.openQuestions`** (`02` §3: "openQuestions may be flagged `blocking` to prevent stating
  a readiness past `defined`"; the `04` worked example puts it under `intent`). `design`/`decision` do not
  canonically carry open questions.
- **Impact.** A doc-following author who flags a `blocking` question in `intent.openQuestions` can still state
  `defined`/`ready` and the honesty check **won't fire** — the marquee differentiator aimed at the wrong target.
  (Note: the Session-1 pre-plan introduced this path; the implementation faithfully followed the plan. It is a
  plan↔concept drift to correct at the source.)
- **Change.** Read open questions from `intent.openQuestions`; update the floor data `authoredPaths` to match. With
  a typed `IntentSection` (D1) this predicate shrinks to a few lines.
- **Files.** `validators.ts`, `readiness-floor.ts`; tests in `test/readiness.test.ts` / `test/validators.test.ts`.
- **Verify.** New test: a spec with `intent.openQuestions:[{blocking:true}]` stating `defined` **fails**; with
  `blocking:false` (or absent) **passes**.

### 🟠 H3 — `constraints` must be an array, not a single object · **NOW**

- **Finding.** `src/model/sections.ts:18` types `constraints?: ConstraintsSection` (one `Record`); `02` §1
  specifies `constraints?: ConstraintSection[]`. A spec can be bounded by several NFRs (perf + security + …); a
  single object can't express that. `validators.ts:139-165` already defends against **both** array and record forms
  — a tell that the shape was unsettled.
- **Change.** `constraints?: ConstraintSection[]` (typed per D1: `{ flavor?, statement, target?, measurableBy? }`,
  all optional except where the floor requires). Update the example (`order-latency-constraint.spec.ts`) to author
  an array. **Simplify** the validator: drop the dual array/record handling — one shape only.
- **Files.** `sections.ts`, `order-latency-constraint.spec.ts`, `validators.ts`.
- **Verify.** `constraint` floor test still passes; validator no longer branches on `Array.isArray`.

### 🟠 H4 — Referential integrity is blind to section-embedded refs · **DECIDE (likely DEFER to Slice 1)**

- **Finding.** `validateDanglingReferences` (`validators.ts:363-414`) checks relations, pack members, `modelRefs`,
  anchors — but not refs inside sections. Yet `create-order.spec.ts:22-26` puts real refs there
  (`behavior.rules:[ref(...)]`, `behavior.examples:[ref(...)]`). A typo there escapes the check. `05` §2.1 wants
  *every* referenced ID to resolve.
- **Why deferred-ish.** Session 1's dangling-ref scope was explicitly relations/packs/anchors. The proper fix
  belongs with the extractor, which must know *structurally* where refs can live — impossible while sections are
  `unknown` (this is a direct consequence of §2). Typing `behavior` (D1) makes both the check and the extractor
  tractable.
- ⊳ **Open decision D2 — modeling of `behavior.rules`.** The docs model `behavior.rules` as **prose strings** and
  only `examples` as refs; the example currently puts refs in `rules` *and* promotes the same rules to standalone
  `kind:"rule"` specs (`refines` create-order) — the linkage exists twice, once invisibly. Resolve the
  inline-vs-promote duality (`02` §3 "Section ⟷ kind"): pick prose-in-`rules` + relations for the promoted specs,
  or a typed ref list with referential-integrity coverage. To resolve before typing `behavior`.
- **Change (when scheduled).** Extend referential integrity to typed ref-bearing section fields; align the example
  to the resolved D2.

### 🟡 H5 — Trim the readiness-floor validator (complexity masking a simple design) · **NOW (small)**

- **Finding.** `validators.ts` is 453 lines for three tiny checks. Duplicate-IDs and dangling-refs are clean (~50
  lines); the bulk is readiness-floor machinery with a **two-sources-of-truth** smell, verified:
  - Clause ids are enumerated in **four** places — the `readinessFloors` data (`readiness-floor.ts`), the
    `ReadinessClauseId` union (`validators.ts:22-36`), the `toSupportedReadinessClauseId` switch
    (`validators.ts:265-285`), and the `evaluateClause` switch (`validators.ts:224-255`). Add a clause → edit 3–4
    spots; miss one and `toSupportedReadinessClauseId` **silently skips it**.
  - `authoredPaths` in the floor data is **decorative** — grep confirms it is referenced only by its own
    declaration and by tests, **never by the evaluator**, which hardcodes a predicate per clause id. The "which
    field does this clause check" fact lives in two places, free to drift (already visible:
    `constraints.*.target` in the `defined` floor vs `constraints.target` in the overlay).
- ⊳ **Open decision D3 — which direction to collapse.** Either (a) make the table the single source of truth — the
  evaluator reads `authoredPaths` + a few generic predicates (cleanest once sections are typed, D1), or (b) shrink
  the table and let the evaluator be the spec, dropping the redundant union/switches. Recommendation: (a), because
  typed sections make path-driven predicates safe and it kills the 4× enumeration. To resolve.
- **Verify.** Same floor test outcomes; clause-id list defined once; no decorative metadata.

### 🟡 H6 — Simplify the tsup build; stop leaking a shebang onto the library entry · **NOW**

- **Finding.** `dist/index.js` starts with `#!/usr/bin/env node` because `tsup.config.ts` applies `banner.js` to
  **all** entries — contradicting the implementer's own recorded decision (`.sisyphus/notepads/.../decisions.md:1`:
  "use a source-file shebang … so the library build stays clean"). The config compensates with an esbuild plugin to
  strip the CLI's source shebang **and** an `onSuccess` hook to collapse the resulting doubled CLI shebang — an
  elaborate dance around a wrong default.
- **Change.** Remove the `banner`; keep the source shebang only on `src/cli/sdp.ts`; delete the strip-plugin and the
  normalize hook (or split the CLI into its own minimal tsup build). Net: less config, correct output.
- **Files.** `tsup.config.ts` (+ confirm `src/cli/sdp.ts` keeps its source shebang).
- **Verify.** `dist/index.js` has **no** shebang; `dist/cli/sdp.js` first line is exactly `#!/usr/bin/env node`;
  `node dist/cli/sdp.js --help` exits 0.

### ⚪ H7 — Hygiene · **DECIDE (cheap)**

- **`.tmp-scratch/` is neither gitignored nor prettier-ignored** — scratch files risk being committed, and
  `npm run check` fails locally on any scratch file. Add `.tmp-scratch/` to `.gitignore` and `.prettierignore`.
- ⊳ **`.sisyphus/` is tracked** (only `.sisyphus/evidence/` is ignored) — boulder.json + notepads will enter
  history. Decide: keep runner state in the repo, or gitignore the dir. (Open.)
- `vitest-test.mjs` wrapper exists only so `npm test -- --run x` doesn't double-`--run`. Optional: revert to
  `"test": "vitest run"` unless the `-- --run` ergonomic is wanted.
- `package.json` lacks `description`/`license`/`repository` — fine until publish; note for the publish checklist.

---

## §4 — Forward-looking decision (resolve before Slice 3, name now)

⊳ **Open decision D4 — the `AuthoredModel` seam vs the one graph (P2).** The design says validators run over **the
one graph** ("no consumer maintains a parallel model", P2). When the extractor lands, either (a) these validators
migrate to consume `GraphSchema` and `AuthoredModel` retires, or (b) `AuthoredModel` stays as an explicit,
documented *pre-graph authoring lint*. Avoid two validation code paths drifting apart — H1 is already a preview of
authored-model-truth ≠ extracted-graph-truth. Pick a direction now; execute at Slice 1/3.

---

## §5 — Explicitly out of scope (still deferred)

Unchanged from the roadmap; this pass does **not** introduce any of them: the `ts-morph` extractor · `graph.json` /
graph emission · the graph-level validator gate · `--check-clean` · reader / views / Design Review · architecture
rules · custom team rules · `--lenient` · derived-readiness banner · runtime `observed` path · MCP surface ·
self-hosting the Protocol's own repo. Full typing of `design`/`decision`/`ui` sections stays deferred per D1.

---

## §6 — Sequencing (first cut — to iterate)

A loose ordering, not a contract; we will refine once D1–D4 are settled.

1. **Quick, decision-free wins:** H1 (static example), H6 (tsup), H7 (gitignore/prettier for `.tmp-scratch`).
2. **Resolve D1** (how much to type) → then H3 (`constraints` array) and the typed `intent`/`behavior` shapes.
3. **With typed sections in place:** H2 (open-questions home) and H5 (collapse the floor validator, D3).
4. **Resolve D2** → H4 (section-ref referential integrity), likely folded into the Slice 1 extractor work.
5. **Resolve D4** as a written direction before Slice 3; no code this pass.

**Done gate for the pass:** `npm run check` green; §1 baseline invariants intact; the example contains only static
literals; the honesty bypass (`behavior: { "has-verifier": true }`) is rejected for typed sections; the floor
clause-id list is defined exactly once; `dist/index.js` carries no shebang.

---

## §7 — Open decisions to resolve (collected)

| # | Decision | Recommendation |
|---|---|---|
| **D1** | How much to type sections now | Type `intent`, `behavior`, `constraints`, `model`, `verification`; leave `design`/`decision`/`ui` open |
| **D2** | `behavior.rules` — prose vs ref list; inline-vs-promote duality | Resolve `02` §3 "Section ⟷ kind" before typing `behavior` |
| **D3** | Collapse direction for the floor validator | Table-as-single-source-of-truth (path-driven predicates) once D1 lands |
| **D4** | `AuthoredModel` future vs the one graph (P2) | Decide migrate-to-`GraphSchema` vs documented pre-graph lint; execute Slice 1/3 |
| (H7) | `.sisyphus/` in history | Keep vs gitignore the runner state |

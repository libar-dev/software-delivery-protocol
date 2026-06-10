# Phase 0 Hardening — Fidelity & Simplification Pass (post-Session-1)

> **Status: ✅ EXECUTED — Wave A done · Wave B done 2026-06-10 · `npm run check` green.**
> Retired to a done-record: the outcomes live in the code, the rationale in `docs/concept/DECISIONS.md`
> (R1–R3, MD-8…MD-15), the provenance in git history and `reviews/`. Still live here: the baseline
> invariants (§1 — the standing regression gate), the carry-forwards riding later slices (§4), and the
> deferred scope (§5). Forward-looking acceptance criteria live in `docs/concept/07` §6.
> **Branch:** `feature/mvp-init` · **Next: Slice 1 — the `ts-morph` extractor** (`docs/concept/07`);
> the hardened example is its first real input.

---

## §0 — Framing commitments (carried into the next slices)

- Every item was (a) a divergence from the ratified base or (b) a *removal* of complexity masking the
  design — never general code-quality polish ("let the design breathe").
- **Tracer-bullet discipline.** The example keeps forcing the DSL to be usable — and, from Slice 1 on,
  must survive *static* extraction. "Done" for Slice 1 includes *the example survives static
  extraction byte-for-byte*; the `sdp/spec-static` lint (`04` §1) is the earlier backstop.
- **Phase 0 stays aggressively small.** The standing test against every item: does it shrink the
  conformance contract or grow it? A readiness floor is **a floor to clear, never a quota to fill**.

## §1 — Baseline invariants (verified through Wave B — the standing regression gate)

- Trust-model boundaries intact: no extractor, no `graph.json`, no graph gate; delivery facts are
  **derived-only types**; anchors are **identity-only** (`@ts-expect-error` fixtures prove rejection).
- `graph/schema.ts` faithful and inert: `nodeType` vs `specKind` split, `claim` on every node/edge,
  delivery facts on `PrimitiveNode`, authored vs derived edge types separated.
- IDs (`02` §5): grammar + branding only, namespace policy correctly deferred. Relations (`02` §6):
  direction + `claim:"declared"` exactly per the table; verb-form names correct.
- Core `src/` is domain-neutral (zero order/checkout names); the example's two-edge verifier semantics
  match `02` "Verifier semantics" precisely.
- `AuthoredModel` honestly fenced (doc-comment); it retires into (at most) an extractor-internal shape
  when the extractor lands (MD-14, Slice 1/3) — never a second public validation seam.

**Regression gate:** `npm run check` stays green; all invariants above still hold.

## §2 — The root tension — ✅ RESOLVED (MD-11 on MD-10) · executed as §4/B1

## §3 — Wave A (decision-free) — ✅ DONE

One line each — the full was/done/verified detail lives in git history (provenance: `reviews/01`).

- **H1** — the example is statically extractable (P5): plain static literals only.
- **H6** — tsup build simplified; the shebang ships only on the CLI entry.
- **H7** — hygiene: scratch dirs prettier-ignored, `.sisyphus/` untracked, `package.json` metadata.
- **H8** — the validator fixture suite (`05` §5): systematic should-pass / should-fail fixtures, each
  pinning one validator outcome. The two Wave-B gated stubs are now **active** (§4/B1–B2); the
  extractor-era fixture names for Slice 1+ are recorded in
  `test/fixtures/authored-model.fixtures.ts`'s doc comment.
- **H9** — type-level honesty defenses: `@ts-expect-error` envelope fixtures in
  `test/builders.typecheck.ts` (the excess-property caveat is recorded there); the in-section bypass
  was closed by §4/B1.

## §4 — Wave B — ✅ DONE 2026-06-10 (one session: B1 → B2 → B3 → B4)

The decision pointers were the contract; the MD entries hold the rationale and the full shapes.

- **B1 (MD-11 + MD-10; absorbed old H3)** — the six floor-bearing sections are closed-typed in
  `src/model/sections.ts` (`intent` · content-only `behavior` · `constraints[]` array · `model` ·
  `verification` · `decision` with no `status`); `design`/`ui` stay open bags. The in-section honesty
  bypass (`behavior: { "has-verifier": true }`) **fails to typecheck**, locked by the compile-time
  fixture `invalid-hand-authored-delivery-fact-in-section` in `test/builders.typecheck.ts`.
- **B2 (MD-12 + MD-13 + MD-9; absorbed old H2 + H5)** — `src/validate/readiness-floor.ts` is THE
  floor table, mirroring `05` §3 row-for-row: kind-blind clauses + the per-kind evidence map
  (`kindEvidence`); rows carry `{ id, description, predicate }` with `(spec, model)` signatures
  (promotion-neutral); the clause-id union is derived (`typeof`); the evaluator is one generic loop;
  the overlay mechanism, the hand-written id union, and decorative `authoredPaths` are deleted.
  Blocking open questions read `intent.openQuestions` (old H2, MD-9);
  `invalid-ready-with-blocking-question` is active.
- **B3 (MD-10/11/12)** — the example is de-padded: no `behavior.rules` on the
  `decision`/`model`/`constraint` specs, no section refs on `create-order` (its promoted children are
  the floor evidence), GWT nested as structured `examples` entries, no `decision.status`. The padded
  constraint fixture was re-authored; new should-pass fixtures prove `model`/`decision` kinds clear
  `scoped`/`defined` on natural content alone.
- **B4 (MD-15)** — every example spec file is `*.sdp.ts` (pack: `checkout.pack.sdp.ts`); vitest still
  sees only `test/**/*.test.ts` (the config narrowing is no longer load-bearing for the collision).

**Done gate — verified:** every clause of the contract held; the example contains only static
literals; `npm run check` green (typecheck ×2 · lint · format · tests · build).

### Carried review backlog — closed or re-homed

- **F2 ✅ (as scoped — a doc note)** — `ref()`'s spec-only nature is documented on the export
  (`src/ids.ts`), and the consequence — `decidedBy` → external `doc:` ADR is not yet representable —
  is an explicit named deferral in `02` §6 (MD-16); revisit when `doc:`-target relations or
  pack-targeting arrive (the flag stays in the glossary).
- **F3 ✅** — the aggregate `validateAuthoredModel` report no longer claims a single `family`
  (`ValidationReport.family` is optional; the aggregate id is `authored-model`); each finding carries
  its own family.
- **F4 → Slice 1/3** — `modelRefs` targets must be `kind:"model"`: rides the graph validators under
  the one-path rule (MD-14).
- **H10 → Slice 2** — the example's missing api/route anchor rides MD-8 `codeAnchor` generic-anchor
  extraction.
- **H4 — dissolved** for `behavior` (MD-10): refs cannot exist in sections, so there is nothing to
  check; what remains is exactly F4 above.

### Post-execution adversarial pass — ✅ folded in same-day (MD-16)

A post-Wave-B adversarial review (Codex) challenged three honesty surfaces; all three were resolved
and landed 2026-06-10 (rationale in MD-16): promoted evidence counts only when the promoted spec
itself carries its kind's evidence (an empty stub child or a wrong-kind/dangling `constrainedBy`
edge no longer clears a floor — regression fixtures added); `validateAuthoringShape` is the
Session-1 runtime stand-in for the `05` §2 authoring-shape honesty check (a delivery fact smuggled
into a section via a non-fresh object now fails at runtime, not only at the type level); and
`doc:`-target relations are an explicit named deferral (`02` §6).

## §5 — Explicitly out of scope (still deferred)

The `ts-morph` extractor · `graph.json` / graph emission · the graph-level validator gate ·
`--check-clean` · reader / views / Design Review · architecture rules · custom team rules · `--lenient`
· derived-readiness banner · runtime `observed` path · MCP surface · self-hosting the Protocol's own
repo. Typing of `design`/`ui` stays deferred per the typing law (MD-11 — they become typed when a floor
clause reads them); a dedicated `contract` section is a named deferral (MD-12).

## §6 — Sequencing — ✅ COMPLETE

Wave A ✅ → pre-grill folds ✅ (R1–R3; MD-8/MD-9) → the grill ✅ (MD-10…MD-15) → **Wave B ✅
(2026-06-10)**. Phase 0 hardening is closed. **Next session = Slice 1** (the extractor, reading
`*.sdp.ts` from day one — MD-15); H10 rides Slice-2 anchor extraction.

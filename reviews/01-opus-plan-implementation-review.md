Verified end-to-end and read every source, example, test, and the implementer's own decision log. Here's my review.

## Verdict

**This is a strong first session.** It's fully green (`npm run check`: typecheck × 2, lint, format, 43 tests, build all pass), faithful to the ratified language, and the trust-model boundaries are respected (no extractor, no graph emission, no graph gate, delivery facts derive-only, anchors identity-only). The test discipline is genuinely good — compile-time `@ts-expect-error` fixtures enforcing anchor honesty, exact-message validator assertions, deferred-clause coverage. The scope expansion I'd flagged (working validators) turns out to be a **deliberate decision you made in the implementation interview** ("contracts + tiny validators, overriding the pre-plan's stricter 'contracts/data only' wording"), so that's sanctioned, not creep.

That said, there are a handful of real issues — one of which I'd fix *before* Slice 1 because it sits inside the tracer bullet itself.

---

## The one I'd act on before Slice 1 — the example violates static-extractability (P5)

Both scenario specs build their `behavior` section with a runtime call:

```ts
// examples/checkout-v1/specs/orders/create-order-valid-cart.spec.ts:5
const thenKey = "then";
const createOrderValidCartBehavior = Object.fromEntries([...]) as Record<string, unknown>;
```
(same in `create-order-invalid-cart.spec.ts:5`)

`★ Insight ─────────────────────────────────────`
P5 says spec source must be **static, side-effect-free literals** — "a JSON file that TypeScript happens to validate" — because the Slice 1 `ts-morph` extractor reifies it *without executing it*. `Object.fromEntries([...])` is a function call the extractor can't statically evaluate. Per the two-tier rule (`04` §1), a non-static *section* isn't a build error — it's **silently dropped with a warning** (L3). So under the next slice, these two scenarios lose their `given/when/then`, and then the graph-level `example` readiness floor (which *requires* given/when/then at `defined`+) flips them from "valid" to an honesty violation.
`─────────────────────────────────────────────────`

This is the sharp irony: the tracer bullet exists to *de-risk the extractor*, and it's the one place that plants a landmine for it. It also perfectly illustrates the architectural seam below — the Session-1 authored-model validator sees `given/when/then` (because `Object.fromEntries` already ran at module load), but the static extractor won't. The fix is trivial (a plain object literal); the systemic fix is the deferred `sdp/spec-static` lint rule (`04` §1). I'd also add a guard so Slice 1's "done" includes *the example survives static extraction byte-for-byte.* Everything else under `examples/**/specs` (7 files) is clean static literals — this is isolated to the two scenario specs.

---

## Real findings (Slice 1/2 territory, not blockers)

**1. Sections are `Record<string, unknown>` — the biggest design divergence.** `src/model/sections.ts:14-23` types every section as an open bag.

`★ Insight ─────────────────────────────────────`
P7 ("types describe shape; validators decide *completeness*") is about which fields are *required* for a readiness — **not** about whether fields are typed at all. The design intent (L9, `02` §3) is **typed-but-optional** sections (`intent.outcome?: string`, `constraints: ConstraintSection[]`, …), with validators deciding which are required. `Record<string, unknown>` collapses "optional" into "unknown," which has three downstream costs.
`─────────────────────────────────────────────────`
- The tracer bullet's section coverage is **hollow** — the example typechecks against `unknown`, so "it compiles" proves nothing about the DSL capturing section shapes (the headline goal of the session).
- The readiness-floor validator is forced to **string-probe paths at runtime** (`spec.behavior.given`, `spec.intent.outcome`); a typo in a section field name silently passes the floor.
- It enables finding #2.

I'd type at least the sections the floors and extractor depend on (`intent`, `behavior`, `constraints`, `model`, `verification`) in Slice 1/2.

**2. Honesty bug — blocking open questions checked in the wrong section.** `validators.ts:199-206` (and `readiness-floor.ts:89-92,104-106`) read `spec.design.openQuestions` and `spec.decision.openQuestions`. The canonical home is **`intent.openQuestions`** (`02` §3: "openQuestions may be flagged blocking to prevent stating a readiness past `defined`"; the `04` worked example puts it under `intent`). As written, a spec with a blocking `intent.openQuestions` can state `defined`/`ready` and the honesty check won't catch it — and `design`/`decision` don't even canonically carry `openQuestions`. This is the genuine honesty differentiator missing its target.

**3. `constraints` is a single object, not an array.** `sections.ts:18` has `constraints?: ConstraintsSection` (one Record); `02` §1 specifies `constraints?: ConstraintSection[]`. A spec can have several NFRs (perf + security + …); the single-object shape can't express that. (Tellingly, `validators.ts:139-165` defends against *both* array and record forms — a sign the shape was unsettled.)

**4. Referential integrity is blind to section-embedded refs.** `validateDanglingReferences` (`validators.ts:363-414`) checks relations, pack members, modelRefs, and anchors — but `behavior.examples: [ref(...)]` and `behavior.rules: [ref(...)]` (see `create-order.spec.ts:22-26`) live inside the untyped section, so a dangling `ref` there escapes the check. `05` §2.1 wants *every* referenced ID to resolve. This is a direct consequence of #1. (Minor sub-note: the docs model `behavior.rules` as **prose strings** and only `examples` as refs; putting refs in `rules` is a modeling deviation.)

---

## Minor / hygiene

- **tsup banner leaks a shebang onto the library entry.** `dist/index.js` starts with `#!/usr/bin/env node` — because `tsup.config.ts:51-53` applies `banner.js` to *all* entries. This directly contradicts the implementer's own recorded decision (`decisions.md:1`: "use a source-file shebang for the CLI … so the library build stays clean"). Harmless in practice but wrong; the cleanest fix is no banner + keep the source shebang only on `src/cli/sdp.ts`, or split the CLI into its own tsup build.
- **`vitest-test.mjs` wrapper** (`package.json:24` → `node ./vitest-test.mjs`) exists only to allow `npm test -- --run x` without double-`--run`. It works, but it's a non-standard moving part; `"test": "vitest run"` is the conventional choice unless that ergonomic matters to you.
- **`.sisyphus/` will be committed** (only `.sisyphus/evidence/` is gitignored). The notepads/boulder.json are agent-runner working state — decide whether you want that in history or gitignore the whole dir. Note also that `plans/` is now gitignored, so the plan I saved is local-only (deliberate per your `.gitignore` comment).
- `package.json` lacks `description`/`license`/`repository` — fine for now, matters before any publish.

---

## Forward-looking: the AuthoredModel seam

The validators consume an `AuthoredModel` DTO, which is sanctioned and well-fenced (honest doc-comments, `deferredInSession1` clauses). The thing to decide *before* Slice 3: the design says validators run over **the one graph** (P2: "no consumer … maintains a parallel model"). When the extractor lands, either (a) these validators migrate to consume `GraphSchema`, with `AuthoredModel` retired, or (b) `AuthoredModel` stays as an explicit *pre-graph authoring lint* with a documented reason. What you want to avoid is two parallel validation code paths drifting apart — finding #1 above is already a preview of that drift (authored-model truth ≠ extracted-graph truth).

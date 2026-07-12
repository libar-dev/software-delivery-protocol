# explorations/executable-examples — micro-implementations of the contender surfaces

> **Exploration record — illustrative, nothing ratified.** Pre-session input to the
> executable-examples design session (the live plan under `plans/`); `FINDINGS.md` beside this
> file carries the argued narrowings and the pros/cons. Every syntax here is a sketch — the
> grammar/document design belongs to its own PLAN-ONLY session, and the design session may
> overrule any of it. One real spec — `spec:orders.create-order.valid-cart`, its actual authored
> content from `examples/checkout-v1` — expressed through each contender, so the comparison is
> apples-to-apples.

## The layout

| Dir | Shows | Contender |
|---|---|---|
| `1-grammar/` | the maturation arc `idea → defined → ready` in an envelope-as-syntax grammar file (same ID, enrich-in-place), plus mock `sdp validate --watch` diagnostics | **C2** (own minimal grammar) |
| `2-document/` | the same spec as markdown + frontmatter + `gwt` fence; plus a `decision`-kind spec in the same format (all eight kinds, one document family — no partition law) | **F2-layered** (markdown carrier) |
| `3-typed-markup/` | the same spec as a TSX document with typed spec components; `render/valid-cart-review.html` is the **interactive Design Review with dials** — open it in a browser | **F1** (typed markup) |
| `4-seam/` | the executable half — **identical under every surface above**: the generated step contract, the bound test (handler bodies only), and a drift demo with **real captured `tsc` errors** | **A2** (surface-independent) |
| `5-harness/` | typed step parameters as the **example space**: the parent behavior spec owns the parameterized vocabulary, examples bind points, the harness dials derive from the generated space contract, and the authored `expected()` **oracle** is typed against it (Conditions in, generated Outcome union out) — with captured `tsc` proofs for parameter drift AND oracle drift | **params-as-dials** (surface-independent, extends A2; grilled 2026-07-11 — FINDINGS §3 settlements 7–9) |
| `6-import/` | the adoption wedge: a realistic vanilla-Cucumber `.feature` (tags, Background, Rules, Scenario Outline + Examples) → the documents `sdp import` would emit (Feature→behavior, Rule→rule-kind, Scenario→example, **Outline placeholders→the example space, rows→bound points**) plus the import report listing everything the converter refuses to guess | **`sdp import`** (one-way devtool, never a canonical parse path) |
| `7-typelevel-slots/` | the slot notation parsed **at the type level** (template-literal types): `declareExampleSpace`/`bindPoint` check every authored example step against the parent's vocabulary as-you-type — unknown slot, wrong value type, out-of-union literal, and parent-side rename redden in the editor, zero codegen, while an **unbound slot compiles** (a partial point is legal authoring; the concreteness law is the floor's, never a type gate) — with the captured `tsc` transcript | **TS-DSL DX spike** (carrier-orthogonal; added 2026-07-12 at the pre-competition review, plan 14) |

## Run the seam proof

```bash
npx tsc -p explorations/executable-examples/4-seam   # errors appear ONLY in drift-demo.test.ts
cat explorations/executable-examples/4-seam/TSC-OUTPUT.txt

npx tsc -p explorations/executable-examples/5-harness   # errors ONLY in drift-demo.test.ts + oracle-drift-demo.ts
cat explorations/executable-examples/5-harness/TSC-OUTPUT.txt

npx tsc -p explorations/executable-examples/7-typelevel-slots   # errors ONLY in drift-demo.ts
cat explorations/executable-examples/7-typelevel-slots/TSC-OUTPUT.txt
```

`create-order.valid-cart.test.ts` (the correct binding) typechecks clean.
`drift-demo.test.ts` is **broken by design**: it stages the three gen-1 failure modes — a
missing handler, a spec-side step rename, a typo in a step key — and `tsc` names the exact step
strings in all three. This is what gen 1's custom step linter (twelve rules) and its runtime
`StepAbleUnknowStepError` existed to approximate.

## What to compare while reading

1. **Register** — which file would an agent emit verbatim from a conversation; which would a
   PM read or author in a PR diff.
2. **The maturation arc** — `1-grammar/stage-*.sdp` is one ID enriched in place; every other
   surface supports the same arc (readiness is envelope data everywhere).
3. **Typing** — where each surface gets guardrails: TSX = native `tsc`; markdown = generated
   JSON Schema (frontmatter) + extractor diagnostics; grammar = extractor diagnostics only
   (until an LSP). The **binding seam is typed identically everywhere** (`4-seam/`).
4. **The render** — `3-typed-markup/render/` works as the projection of *any* of the three
   authored forms (they reify to the same graph node). The dials demo is the
   interactive-harness convergence (`04` §4) — note the derived/authored split in the UI:
   everything badged "derived" is injected at render, never authored.

## Honest mocks, deliberate exclusions

- `4-seam/protocol-runner.ts` mocks the future `/runner` + `/vitest` subpath exports
  (~30 lines — the real one adds the execution plan + reporter). The step contracts under
  `4-seam/contracts/` are hand-written exactly as `sdp build` would emit them (the folder is not
  named `generated/` only because the repo rightly gitignores that name everywhere).
- The `.sdp.tsx` imports a hypothetical `/markup` subpath — it does not typecheck, by intent.
- This folder sits **outside** the root tsconfig/vitest/eslint allowlists and is
  prettier-exempt: exhibits are verbatim, never format-policed, and never gate CI (the same
  discipline gen 1's `playground/` used). The seam carries its own `tsconfig.json`; the drift
  demo's errors are the exhibit.
- Future (not mocked): typed step parameters — `"a cart with {n:number} line items"` → handler
  arg `{ n: number }`; the capability is argued in `FINDINGS.md`, the syntax belongs to the
  grammar session.

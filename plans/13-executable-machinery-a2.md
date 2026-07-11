# Plan 13 — The executable machinery (A2): generated contracts, the typed example space, the oracle, the runner

> **Status: 🔲 DRAFTED 2026-07-11 — scoped by the plan-12 session record (plan 12 §8); not yet
> run.** An **execution** session (edits `src/`, `examples/`, `test/`). It builds the
> carrier-independent executable half the plan-12 session ratified — every line of it serves
> whichever carrier wins the parallel competition, so nothing here waits on that ruling.
>
> **Queue note:** the four carrier exploration PRs (plan 12 §8 — F2 markdown · C2 grammar ·
> Gherkin extension/fork · typed-markup document) run **in parallel** with this plan and consume
> its output: each exhibit's `ready` rung must execute through the contracts this plan generates.
> The carrier ruling session follows the PRs; the `sdp import` **emitter** and the surface-design
> session follow the ruling.
>
> **Spec anchors:** plan 12 §8 (the ratifications of record) · FINDINGS §3 settlements 1–2, 4,
> 6–9 (the ratified designs; `4-seam/` and `5-harness/` are the exhibits with captured `tsc`
> proofs) · MD-14 (contracts derive from the extracted graph, never the evaluated spec value) ·
> JS-B2.6 (the generated-union pattern — importable because derived) · JS-B2.3 (kept: no
> spec↔code import edges) · MD-7 (binding, never liveness — nothing here ingests run results) ·
> MD-15 (`.sdp.ts` never a runner glob) · MD-17 (point-per-example; table sugar is carrier-side,
> **out of scope here**) · MD-12/MD-13 (the concreteness clause lands as one structural cell in
> the existing floor table).

## §1 — The job

Recover the executable-spec DX on the surface that exists today (the TS DSL), carrier-neutrally:
**edit the spec, and the bound test goes red at `tsc` time, naming the exact step that changed** —
with typed parameters flowing from the spec into the assertion, and the oracle typed against the
generated space so it can never claim an outcome the specs never stated.

## §2 — In scope (the ratified pieces, same codegen stage)

1. **The codegen stage in `sdp build`:** per-example **step contracts** (the literal-union module,
   keyed by spec ID, derived from `graph.json` — never from the evaluated spec module) and
   per-parent **space contracts** (typed dimensions of the example space · every child's bound
   point · the Outcome union derived from the parent's Then vocabulary). Derived-never-authored;
   `--check-clean` extends over the new artifacts.
2. **Typed step parameters:** the parent behavior spec's example-space section (slot vocabulary in
   step text; explicit binding on children — `{n: 2}`-style authored points, natural reading is
   the renderer's job); the **concreteness clause** in the floor (an example with an unbound slot
   in a used step does not meet `defined`) as one structural cell in the existing evaluator.
3. **The oracle law + type surface:** the `specOracle` anchor (sibling of `specTest`); the
   generated Conditions/Outcome types; `unspecified` first-class (contributed by the runner core);
   **no new derived fact** (discovery is an anchor query; `has-oracle` waits for the
   second-caller bar). Outcome faithfulness stays human-reviewed, by law.
4. **The runner:** the framework-neutral `/runner` core (`executeExample` produces a plan;
   per-example world lifecycle owned by the adapter) + the `/vitest` adapter subpath (vitest an
   optional peer of the adapter only). Failure messages render in the spec's own language via the
   **one renderer** (settlement 4 — the same renderer the Design Review and the future carrier
   projection consume).
5. **The tracer bullet:** `examples/checkout-v1` — `valid-cart` (and the parent's example space)
   executing through the generated contracts before anything counts as done; the captured drift
   cases from `4-seam/` and `5-harness/` re-land as pinned tests (missing handler · spec-side
   rename · typo/did-you-mean · renamed slot · out-of-union comparison · oracle overclaim).
6. **Optional rider (may split to a side PR):** the carrier-neutral **parser half of
   `sdp import`** — vendored Gherkin parser → intermediate model, no emitter.

## §3 — Out of scope (named, so nothing drifts in)

- Any carrier or authoring-surface change (the competition owns those; the TS DSL stays the sole
  canonical surface throughout).
- Table sugar for multi-point examples (carrier-side by MD-17).
- The interactive harness UI (a named later slice; `explorations/executable-examples/5-harness/render/`
  is its rendered spec).
- The bound-handlers overlay (ASPIRATIONAL, runner-side, recorded at settlement 8).
- Run-result ingestion of any kind (MD-7), and the `sdp import` **emitter** (waits for the
  carrier ruling).

## §4 — Exit criteria

- `npm run check` green end-to-end with the codegen stage in the pipeline; determinism holds
  (`--check-clean` byte-identical over the new generated artifacts).
- At least one checkout-v1 example executes through its generated step contract under the
  `/vitest` adapter, with parameter values flowing spec → contract → assertion (editing the
  spec's authored value reddens the bound test with zero test edits).
- Every captured drift transcript from the exploration reproduced as a pinned failing-case test.
- The concreteness clause mutation-tested like the rest of the floor (the clause flips the
  verdict, not merely green-stays-green).
- The doc-repair items this plan itself forces are landed (`04` §4's harness cut revised to
  "a projection plus one anchored oracle"; the cut table's executable-spec rows updated to point
  at the landed surface) — the carrier-dependent repairs stay with the ruling session.

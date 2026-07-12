# Plan 11 — Post-MVP review polish: the example carries the load, the floor's laws are pinned

> **Status: ✅ EXECUTED 2026-06-11** — the four findings of the post-MVP maturity review landed on
> `feature/anchors`; `npm run check` green end-to-end. The example now exercises the surface it
> was built to prove: all **8 kinds on disk** (a `workflow` feature at `scoped` — flows are
> scoped-rung evidence; a `contract` story parked at `idea` by a recorded blocking open question),
> all **4 readiness rungs stated** (`valid-cart` states `ready` and earns it through its test
> binding), and a **second bound spec** (`impl:orders.order-total` satisfies the order-total rule
> in the same file as the use-case anchor — anchors bind per spec, never per file, MD-8). The
> summary line is now `11 specs · 1 packs · 4 anchors → 16 nodes · 31 edges`; the standing
> invalid-cart warning is untouched (0 errors · 1 warning); goldens re-pinned with the diff as
> the review; every README break-it claim re-executed before being rewritten (the unbind
> experiment now also surfaces `honesty/gaps`). Two regression pins landed beside the example:
> the **kind-evidence monotonicity probe** (every kind × every evidence form, defined ⇒ scoped,
> with positive-coverage guard; mutation-verified against the historic constraint-cell bug) and
> the **inferred-claim tripwire** (no ratified edge-contract row admits `inferred`; its first
> producer must land its own row and flip the test deliberately). Two doc-comments record what
> the code alone doesn't show: the reserved deferred-check families on the validator registry
> (`05` §6 — a landed id is never reused), and the promotion-reachability note on the floor
> (a child confers by *its own kind's scoped cell*).
>
> **Execution deviations: none material.** `ready` landed on `valid-cart` rather than
> `create-order` — the spec whose binding *earns* the rung — which also keeps the README's
> dangle-a-reference and blocking-question experiments single-finding demos.
>
> **Next session: unchanged — the decision-spec fold** (plan 10's pointer stands): DECISIONS
> durables → `kind:"decision"` specs under the reserved ids.
>
> **Spec anchors:** `07` §1 (the worked example is the tracer bullet — "if this stops
> typechecking or extracting, the DSL is wrong, not the example") · `05` §3 + MD-12 (the
> kind-conditional floor; "monotonic by construction" is a table property for the evidence
> cells — the probe makes it a checked one) · `03` §3 + `07` §2 (the `inferred` claim is
> designed-in, decoded by every consumer, ships empty) · `05` §6 (the deferred check families,
> named) · MD-16 (carried evidence — the promotion bound).

## Context

The post-MVP maturity review (four parallel subsystem passes over the slice-1–5 branch) returned
solid verdicts with one structural gap and three regression-protection items. The structural gap:
the synthetic suites were heavily loaded while the **tracer bullet was underloaded** — six of
eight kinds on disk, every spec stating `defined`, anchors on one spec. By the example's own
charter that is backwards: the worked example is the integrity check the DSL and extractor are
forced to stay usable against, so it should be the *first* surface that carries each landed law.

## §1 — What this session pinned

1. **The example carries the kind and rung surface.** `workflow` and `contract` ride the
   behavior-family evidence row as documented interims (MD-12); the example now proves both
   aliases end-to-end through extraction, the floor, and the Design Review — a future dedicated
   `contract` section or `workflow` shape now has an on-disk regression to flip.
2. **Every stated rung is structurally earned, in both honest directions.** Stating less than you
   clear (most specs), stating exactly what you clear (`ready` on the bound example; `scoped` on
   the flow; `idea` under a blocking question) — the floor never nags upward, the banner never
   fires.
3. **Monotonicity is checked, not asserted.** MD-12's "monotonic by construction" held by
   construction only for the kind-blind clauses; the per-kind evidence cells were monotonic by
   review. The probe corpus closes that: defined ⇒ scoped over every evidence form, every kind,
   with a positive-coverage guard so the implication can never pass vacuously.
4. **The `inferred` seam is a deliberate flip, never a drift.** The claim is ratified and decoded
   everywhere, produced nowhere; the tripwire test makes "its first producer lands its own
   edge-contract row" an enforced sentence instead of a remembered one.

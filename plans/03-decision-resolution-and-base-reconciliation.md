# The grilling agenda — Decision Resolution & Base Reconciliation

> **Status: ✅ EXECUTED 2026-06-10 — the grill ran; all six decisions resolved and ratified (MD-10…MD-15).**
> The base was reconciled inline (`02`/`03`/`04`/`05` + the glossary), and `plans/02` Wave B was rewritten
> execution-ready. This document is the **agenda-of-record**; the resolutions — each with the full tension,
> rationale, and rejected alternatives — live in `docs/concept/DECISIONS.md` (the detailed per-decision
> agenda text was folded into those entries and removed here). **Branch:** `feature/mvp-init`.
>
> | Handle | Resolution | Recorded |
> |---|---|---|
> | **D2** | `behavior.rules`/`examples` carry **content only** (prose / structured GWT, maturing in place); linkage lives in relations; promotion is exclusive | **MD-10** |
> | **D1** | **The typing law**: every floor-bearing section is closed-typed — six today (`intent`, `behavior`, `constraints[]`, `model`, `verification`, `decision`); `design`/`ui` stay open bags; `decision.status` rejected | **MD-11** |
> | **D7** | The floor's evidence clause is **kind-conditional at both `scoped` and `defined`** (present → complete); the overlay mechanism dissolves into the per-kind table; `contract` interim = behavior-family row | **MD-12** |
> | **D3** | The floor **table is the single source of truth**: named predicates `(spec, model)`, derived clause-id union, one generic evaluator, no decorative metadata | **MD-13** |
> | **D4** | **One validation path** through the one graph (extract → graph → checks); `AuthoredModel` retires as a public seam (direction now; executes Slice 1/3) | **MD-14** |
> | **D8** | Spec files carry the **`.sdp.ts`** extension (collision-free with JS test-runner globs; the `.stories.tsx` pattern) | **MD-15** |
>
> **Folded out — do not re-litigate.** The resolvable-now items left this agenda in the 2026-06-10 fold
> session: **R1/R2/R3** ratified and applied to the base, plus **MD-8** (generic-anchor shape `codeAnchor`;
> execution rides Slice 2 / plan 02 H10) and **MD-9** (open-questions home `intent.openQuestions`; execution
> Wave B / plan 02 H2). The source reviews are tracked in `reviews/`.
>
> **Handle hygiene:** D1–D8 here are the *open-decision* code-space used by plans 02/03 — **not** the legacy
> structural D1–D6 table in `DECISIONS.md`. D5 was never assigned; D6 folded out as MD-8. In prose, lead
> with meaning.

---

## §1 — The method (base-first, not code-first) — kept as reusable discipline

The standing trap: typing a section in code *before* its canonical shape is settled in the base bakes drift
into the type system, where it is expensive to move. The method used (and to reuse for any future grill):
**(1)** settle the canonical shapes in the core model (`02`), reconciling wording in the same pass (terms are
ratified — never silently edited); **(2)** record each decision as an MD entry in `DECISIONS.md` (lead with
meaning, handles are session-local); **(3)** only then let the code type the shapes as a faithful projection.
Grilling needs a **fresh session** — and every resolution must **shrink the contract or hold it flat** (a
readiness floor is a floor to clear, never a quota to fill).

## §2 — The root tension (the driver behind D1–D3; resolved by MD-10/MD-11)

`src/model/sections.ts` types every section as `Record<string, unknown>`; the base (**L9**, `02` §3) intends
**typed-but-optional** sections. Open bags collapse "optional" into "unknown": the tracer bullet proves less
than it claims, the in-section honesty bypass typechecks, and validators string-probe at runtime.

> **The headline forward risk is authoring ergonomics, not graph theory.** If authoring feels heavy, authors
> (human **and** agent) avoid the system or overfit specs to satisfy tooling. Untyped sections give no
> autocomplete and no shape guardrails — the **heavy-authoring loop**. (H1 was the first symptom: an agent
> reached for `Object.fromEntries(...) as Record<string, unknown>` instead of a plain literal.) So typing the
> floor-bearing sections is both the honesty fix **and** the single highest-value adoption lever; `07` §6
> names "authoring ergonomics" as a Slice-2 concern.

## §3 — Outcome — ✅ all six resolved (rationale: `DECISIONS.md` MD-10…MD-15)

The grill went two steps *past* the agenda where the evidence forced it: **D7 covers `scoped` too** (the
kind-blind scoped clause was what the padding actually cleared), and **D1 became a criterion** ("floor-bearing
⟹ typed") rather than a list — which pulled `decision` into the typed set and rejected `decision.status` as
FSM vocabulary. Side effect: H4 (section-ref integrity) mostly **dissolved** under D2 — no refs in sections
means nothing to check; only the `modelRefs`-kind check survives (Slice 1/3). Execution is owned by `plans/02`
§4 (Wave B, B1–B4). No `src/`/`test/` code changed in the grill session itself (PLAN-ONLY held).

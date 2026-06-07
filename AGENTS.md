# Libar Software Delivery Protocol

A **programmatic, AI-native software-delivery system**: model the *whole delivery lifecycle* as typed code in
the repo, derive **one graph** from it, and generate every other artifact off that graph. A deliberate second
take on `@libar-dev/architect` — a year of design thinking front-loaded, **zero back-compat, zero old sins
carried over**.

This repo is the **concept made right before the engine exists**. The concept synthesis, the ratified ubiquitous
language, and the JTBD stories together **are the spec** — the product's own thesis (*the spec is the prompt is the
design*) applied to itself: there is no separate PRD.

> **Status:** concept ratified and locked; the repo is now in its **first implementation sessions**, starting with
> **Phase 0 — the protocol as typed code**. The live per-session build plan is in **`plans/`**; the slice roadmap is
> **`docs/concept/07`**. (`plans/` is the source of truth for "what now.")

## The frame

An **executable, self-validating meta-model of the software-delivery process**, on three clean levels:
**protocol** (the primitive, descriptors, relations, validators *as typed code* — **Phase 0**) → **authored model**
(a project's instances, which **conform** — checked, never workflow-gated) → **derived facts** (machine truth,
never authored).

Two permanent honesty guardrails: checks police **conformance & honesty**, never content-quality and never
workflow; and we claim **"deterministically validated," never "provably correct."**

## The model in one breath

One authored **truth-primitive — `Spec`** — enriched in place (never migrated to a new artifact type), positioned
by **three descriptors**: `kind` (a *true subtype*; 8 values) × `altitude` (`epic → feature → story`) × `readiness`
(`idea → scoped → defined → ready`). Familiar delivery nouns (Use Case / NFR / Decision Record / Contract; Epic /
Feature / Story) are **named coordinates on the one primitive, not separate types**. Two more authored things state
**no system truth**: the **`Pack`** (the grouping / review aggregate) and the in-code **`anchor`** (a binding —
identity only, never intent). **Delivery facts** (`implemented` / `has-verifier` / `observed`) are **derived, never
authored**. An **`extractor`** derives **one regenerable graph** (the sole read model); CI runs **conformance +
honesty checks**; the **`claim`** taxonomy (`declared` / `anchored` / `inferred`) is never collapsed; **git is the
event log**. Coding agents **script the typed graph** (the **agent surface** — no verb wall); edits flow
**intent → agent → git → conformance checks** (no patch loop).

## Where to look

Progressive disclosure — start at the top, follow the pointers down.

| Look here | What you get | Read |
|---|---|---|
| `docs/concept/ubiquitous-language.md` | **the vocabulary & the model** — the ratified base (§0–§8, all `[SETTLED]`); our bounded context and sole source of truth for terminology | **first, always** |
| `jtbd-stories/` | **the jobs (functional spec)** — stable `When / I want / so I can` stories (themes A–H); no personas, because consumers are heterogeneous (humans, CI, CLIs, **AI agents**) | to know *what* we serve |
| `docs/concept/00`–`07` (+ README) | **the technical design** — 9 principle-led docs: vision & MVP boundary, founding principles (P1–P10), core model, the one graph, authoring & binding, validation & honesty, consumers, roadmap | to know *how* it works |
| `docs/concept/DECISIONS.md` | **the why-log** for building the Protocol itself (MD-1/2/4/5/7, the D1–D6 shorthand, measured evidence) — rationale + open tensions | when a choice looks arbitrary |
| `plans/` | **the build plan** — what each implementation session does, and why | before writing code |

> The concept docs intentionally carry implementation detail (TS shapes, DSL, graph JSON): they double as the
> implementation spec until the code can hold it. A clean concept/representation split is a recorded future
> direction, not done yet.

## The build path

The MVP proves the founding principle on **one** bounded context — Order Management, `pack:checkout-v1`, ~8–12
specs (`spec:orders.create-order` + a few child scenarios/rules + 1 NFR + the parent `spec:orders.order-management`
behavior + the pack); **not** the whole checkout flow. It is built as thin **end-to-end slices on the Phase 0
foundation**. `docs/concept/07` is the slice roadmap; **`plans/` holds the live, canonical per-session plan** —
read it before writing code.

| Slice | Delivers |
|---|---|
| **0** | **Phase 0 — the protocol as code**: the `Spec` primitive, its three descriptors, the relation set, and every validator, as typed code. The extractor, the graph schema, and every check presuppose it — the foundation, not a detour. |
| **1** | Spec **extraction** over the DSL → a basic graph (nodes + declared relations) → `graph.json`. |
| **2** | Generic anchors + implementation binding + spec↔test linkage → `verifies` edges (`anchored` claim). |
| **3** | Core conformance + honesty checks (referential integrity · duplicate IDs · honest readiness against the floor · orphans · `verifies` linkage · authoring-shape honesty) + the CI gate. |
| **4** | The agent surface (the `reader` — entry adapters + impact) + the Design Review / one generated read-only view — both fully derived. |
| **5** | Polish: the `sdp` CLI (`build` · `validate` · maybe `explain`/`search`), error messages, the documented example, a clean-repo determinism test. |

**Where we are now (`plans/`):** **Session 1** = Slice 0 + the repo/toolchain bootstrap, authoring the
`checkout-v1` example against the DSL **so it typechecks** — pure types, no I/O, deterministic by construction;
stops *before* the extractor. **Session 2** = Slice 1, the `ts-morph` extractor (deterministic rebuild P3 +
graceful partial extraction L3); session 1's example becomes its first real input.

> **Tracer-bullet discipline.** Author the example specs and anchored code *first*, so the DSL and extractor are
> forced to be usable before they are finished. If the example doesn't typecheck, fix the DSL — not the example.

## Two reading conventions

Every doc honours both — never mistake one half for the other:

- **Principle vs Representation** — a *Principle* is a law the design stands or falls on; a *Representation* is one
  chosen mechanism among several.
- **CORE / MVP vs ASPIRATIONAL** — in the first buildable slice, or designed-for-and-deferred (named so the model
  never paints itself into a corner).

## The bets (why this shape)

- **Shared language is a performance feature.** A ratified ubiquitous language measurably leans out reasoning and
  lifts quality — solo and subagent work, not just human↔agent chat. Terminology rigor *is* throughput.
- **The spec is the prompt is the design.** One language spans intent → spec → design → code; you *enrich the same
  typed `Spec`* until it is implementable. Implementation becomes near-autopilot ("implement `spec:…`"); the real,
  iterative work is maturing and **reviewing** specs — alone and in related sets (the `Pack` / **Design Review**).
- **Maturity gates implementation; the graph is AI-native.** Don't ship code before a spec is `ready` —
  `implemented ∧ ¬ready` is the **drift alarm**, `ready ∧ ¬implemented` the build backlog. A typed graph of related
  specs is the shape an LLM already reasons in: feed the agent the graph, don't narrate at it.

## Working discipline

- **Terminology is ratified, not provisional.** Use the exact terms in the language base; flag, don't silently
  invent, new ones. The docs speak the ratified language end-to-end — a residual pre-ratification term
  (`abstraction`, `provenance`, `marker`, `facet`, "two axes", the old readiness ladder) is a **bug to fix against
  the base**, not current usage.
- **Naming is resolved — use these names.** Product **Libar Software Delivery Protocol** (short form "the
  Protocol"); CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`. Namespaces: `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
- **Plan vs execution.** Distinguish **PLAN-ONLY** work (designing, deciding) from **execution** (editing code or
  docs). For a plan under `plans/`, don't touch its target files unless the session is execution.
- **Lineage is evidence, not template.** Prior art `@libar-dev/architect`
  (`/Users/darkomijic/dev-projects/architect`) taught us the problem in production; treat its *shape* as evidence
  about the problem, never as the answer.
- **Git hygiene** follows the global rules (no `git stash`; commit early on a WIP branch; commit/push only when
  asked).

> `CLAUDE.md` is a symlink to `AGENTS.md` — **edit `AGENTS.md`.**

# Libar Software Delivery Protocol

A **programmatic, AI-native software-delivery system**: model the *whole delivery lifecycle* as typed code in
the repo, derive **one graph** from it, and generate every other artifact off that graph. A deliberate second
take on `@libar-dev/architect` — a year of design thinking front-loaded, **zero back-compat, zero old sins
carried over**.

This repo is the **concept made right before the engine exists**. The concept synthesis, the ratified ubiquitous
language, and the JTBD stories together **are the spec** — the product's own thesis (*the spec is the prompt is the
design*) applied to itself: there is no separate PRD.

> **Status:** concept ratified and locked. Build state and "what now" live in **`plans/`** — read the
> highest-numbered plan's status header; the slice roadmap is **`docs/concept/07`**.

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
| `docs/concept/ubiquitous-language.md` | **the vocabulary** — the ratified lean glossary (terms · relations · a worked dialogue · flagged ambiguities); sole source of truth for terminology; the model exposition lives in `00`–`07` | **first, always** |
| `jtbd-stories/` | **the jobs (functional spec)** — stable `When / I want / so I can` stories (themes A–H); no personas, because consumers are heterogeneous (humans, CI, CLIs, **AI agents**) | to know *what* we serve |
| `docs/concept/00`–`07` (+ README) | **the technical design and the model** — 9 principle-led docs: vision & MVP boundary, founding principles (P1–P10), core model (`02` — the primitive, descriptors, sections, relations), the one graph, authoring & binding, validation & honesty, consumers, roadmap | to know *how* it works |
| `docs/concept/DECISIONS.md` | **the why-log** for building the Protocol itself (the ratified-name registry + the MD-series, the R-series, the legacy D1–D6 shorthand, measured evidence) — rationale + open tensions | when a choice looks arbitrary |
| `plans/` | **the build plan** — what each implementation session does, and why | before writing code |
| `reviews/` | **archived session reviews** (implementation, founding-ideation, adversarial + prompts) — durable findings already folded into plans/DECISIONS; read for provenance | rarely |

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
- **DECISIONS.md admits sparingly, and reads by name.** An entry must pass the ADR three-part test — *hard to
  reverse · surprising without context · a real trade-off*. If the "Why" says the base already forced the
  answer, it's drift repair, not a decision — its paper trail is git + the plan done-record. Authoring
  guidance only, never a validator (checks police conformance and honesty, never content-quality). In prose,
  lead with meaning: "the typing law (MD-11)," never bare MD-n (the registry at the top of `DECISIONS.md`
  holds the ratified names).
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

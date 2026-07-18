# Libar Software Delivery Protocol

A **programmatic, AI-native software-delivery system**: model the *whole delivery lifecycle* as typed code in
the repo, derive **one graph** from it, and generate every other artifact off that graph. A deliberate second
take on `@libar-dev/architect` — a year of design thinking front-loaded, **zero back-compat, zero old sins
carried over**.

The concept synthesis, the ratified ubiquitous language, and the JTBD stories together **are the
spec** — the product's own thesis (*the spec is the prompt is the design*) applied to itself: there
is no separate PRD. The engine is **implemented under `src/`** (MVP slices 0–5 landed on `main`);
concept docs explain design and still hold unsettled post-MVP detail. **Intended truth**
(authored specs, ratified decisions, concept material) is authoritative for what the Protocol
claims; **`src/` and tests** are authoritative evidence of current realization. A disagreement is
**drift to resolve**, never permission to silently promote code behavior into intent.

> **Status:** concept ratified · MVP slices 0–5 landed on `main` (plan 10) · post-MVP executable
> machinery landed (plan 13) · authoring **carrier ruled** as `.sdp.md` (the carrier ruling, MD-18;
> plan 16) — product Markdown parser and self-hosting landed · **interim carrier
> rule** (the carrier ruling (MD-18), transition clause amended by plan 17): New spec IDs may be
> born Markdown-canonical once the product parser lands; pre-existing IDs and the worked example
> remain TS-canonical until the ruled flip (the product parser, `sdp import`, and the checkout-v1
> migration) · **what now:** phase-1 owner-accepted; final audit pending. Build state lives in
> **`plans/`** — read the highest
> **primary-numbered** plan's status header, plus any **active subplans it (or its parent family)
> explicitly designates as current**; ignore unnumbered files and letter-suffixed plans only when
> no primary/active plan designates them. If that plan is DRAFTED, also read the latest ✅
> EXECUTED/RUN plan for settled ground. The historical slice roadmap is **`docs/concept/07`**.

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
| `CONTEXT.md` (repo root) | **the vocabulary** — the ratified lean glossary (terms · relations · a worked dialogue · flagged ambiguities); sole source of truth for terminology; the model exposition lives in `00`–`07` | **first, always** |
| `jtbd-stories/` | **the jobs (functional spec)** — stable `When / I want / so I can` stories (themes A–H); no personas, because consumers are heterogeneous (humans, CI, CLIs, **AI agents**) | to know *what* we serve |
| `docs/concept/00`–`07` (+ README) | **the technical design and the model** — 9 principle-led docs: vision & MVP boundary, founding principles (P1–P10), core model (`02` — the primitive, descriptors, sections, relations), the one graph, authoring & binding, validation & honesty, consumers, roadmap | to know *how* it is designed |
| `docs/concept/DECISIONS.md` | **the why-log** for building the Protocol itself (the ratified-name registry + the MD-series, the R-series, the legacy D1–D6 shorthand, measured evidence) — rationale + open tensions | when a choice looks arbitrary |
| `src/` | **the engine** — `model` (Spec/descriptors/pack/anchors) · `extract` · `graph` · `validate` · `reader` (agent surface) · `projections` (Design Review) · `cli` (`sdp`) · `runner` / `codegen` / `notation` / `adapters` | when implementing or verifying **current engine** behavior |
| `examples/checkout-v1` | **the worked MVP example** (TS DSL tracer bullet) — specs, anchors, untracked `generated/` (regenerated in-pipeline); walkthrough in its README | when proving the loop end-to-end |
| `explorations/` | **evidence only** (carrier exhibits, executable-example findings) — mapping evidence for design; **never promote spike code into product** | when judging design evidence; not a source tree to ship |
| `plans/` | **the build plan** — what each implementation session does, and why | before writing code — highest primary-numbered plan's status header, plus active subplans it designates; if DRAFTED, also the latest ✅ EXECUTED/RUN plan |
| `npm run check` | **the green gate** — `check:temporal` → lint → format:check → build → `generate:self-hosting` → `generate:example` → typecheck → `typecheck:examples` → test → `check:self-hosting` → `check:example` → `preflight` | before claiming green / after engine edits |
| `reviews/` | **archived session reviews** (implementation, founding-ideation, adversarial + prompts) — durable findings already folded into plans/DECISIONS; read for provenance | rarely |

> Concept docs still carry implementation detail (TS shapes, DSL, graph JSON) for **unsettled and
> post-MVP** design. **Intended truth** (ratified decisions, concept material, and — once
> authored — specs) is authoritative for design claims; **`src/` and the test suite** are
> authoritative evidence of current realization. A disagreement is **drift to resolve** — fix the
> stale side deliberately; do not invent a third behavior, and do not silently promote code into
> intent. A clean concept/representation split remains a recorded future direction.

## The build path

The MVP proves the founding principle on **one** bounded context — Order Management, `pack:checkout-v1`, ~8–12
specs (`spec:orders.create-order` + a few child scenarios/rules + 1 NFR + the parent `spec:orders.order-management`
behavior + the pack); **not** the whole checkout flow. The worked example lives at `examples/checkout-v1`
(documented walkthrough in its README). It is built as thin **end-to-end slices on the Phase 0
foundation**. `docs/concept/07` is the slice roadmap; **`plans/` holds the live, canonical per-session plan** —
read it before writing code.

**MVP slices 0–5 are complete** (plan 10). The table below is provenance, not the live backlog —
live work is the highest primary-numbered plan under `plans/` (currently the self-hosting plan).

| Slice | Delivers |
|---|---|
| **0** | **Phase 0 — the protocol as code**: the `Spec` primitive, its three descriptors, the relation set, and every validator, as typed code. The extractor, the graph schema, and every check presuppose it — the foundation, not a detour. |
| **1** | Spec **extraction** over the DSL → a basic graph (nodes + declared relations) → `graph.json`. |
| **2** | Generic anchors + implementation binding + spec↔test linkage → `verifies` edges (`anchored` claim). |
| **3** | Core conformance + honesty checks (referential integrity · duplicate IDs · honest readiness against the floor · orphans · `verifies` linkage · authoring-shape honesty) + the CI gate. |
| **4** | The agent surface (the `reader` — entry adapters + impact) + the Design Review / one generated read-only view — both fully derived. |
| **5** | Polish: the CLI surface resolved (`build` · `validate` · `view`; `explain`/`search` below the second-caller bar), one diagnostic rendering rule, the documented example walkthrough, the clean-repo determinism test. |

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
- **Decision-spec pointers lead with names.** See [the plain-language references decision](specs/decisions/plain-language-references.sdp.md)
  (`spec:decisions.plain-language-references`) and [the concept-documents dissolution decision](specs/decisions/concept-docs-dissolve.sdp.md)
  (`spec:decisions.concept-docs-dissolve`).
- **Naming is resolved — use these names.** Product **Libar Software Delivery Protocol** (short form "the
  Protocol"); CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`. Namespaces: `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
- **Plan vs execution.** Distinguish **PLAN-ONLY** work (designing, deciding) from **execution** (editing code or
  docs). For a plan under `plans/`, don't touch its target files unless the session is execution.
- **Lineage is evidence, not template.** Prior art **`@libar-dev/architect`** (local clone when
  present, e.g. a sibling `architect` checkout) taught us the problem in production; treat its
  *shape* as evidence about the problem, never as the answer.
- **Git hygiene** follows the global rules (no `git stash`; commit early on a WIP branch; commit/push only when
  asked).

> `CLAUDE.md` is a symlink to `AGENTS.md` — **edit `AGENTS.md`.**

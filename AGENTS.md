# Libar Omni — concept repo

Second-generation concept for a **programmatic, AI-native software-delivery system**: model the *whole
delivery lifecycle* as typed code in the repo, derive one graph from it, and generate every other artifact
off that graph. This repo holds the **concept synthesis**, its **ratified ubiquitous language**, and the
**JTBD stories** that together serve **as the spec** — there is no separate PRD. They are the direct input to
building the MVP.

## What's here

| Path | What it is |
|---|---|
| `docs/concept/ubiquitous-language.md` | **The ratified base** (§0–§8 + §4b, all `[SETTLED]`). **Sole source of truth for terminology and the model.** Read this first. |
| `docs/concept/DECISIONS.md` | The decision diary (why-log) for *building Omni itself* — MD-1/2/4/5 + scope note. Recaptures rationale + open tensions; distinct from in-system `kind:"decision"` records. |
| `docs/concept/` (`00`–`07` + README) | 9 principle-led concept docs. The design: one `Spec` primitive, three descriptors, one derived graph, honest `claim`s, conformance + honesty checks, consumer surfaces. *(These predate the language base — the cleanup plan brings them into line.)* |
| `jtbd-stories/` | JTBD **job stories** (`When [situation], I want to [motivation], so I can [outcome]`, themes A–H) + README. Stable, solution-agnostic jobs — chosen over user stories because consumers are heterogeneous and evolving (humans, CI, CLIs, **AI agents**). |
| `plans/please-do-a-pedantic-tidy-dove.md` | The live cleanup plan: applies the ratified language to the 18 concept/JTBD docs. **PLAN-ONLY until an execution session runs it.** |

> Note: `CLAUDE.md` is a symlink to `AGENTS.md` — edit `AGENTS.md`. The earlier input drafts (`GLOSSARY.md`,
> `UBIQUITOUS_LANGUAGE_{1,2}.md`) and the language-finalization brief have been **deleted** (consolidated into
> the base).

## How to read the design

Two conventions run through every doc — honour them:

- **Principle vs Representation** — a *Principle* is a law the design stands or falls on; a *Representation* is
  one chosen mechanism among several. Never mistake one for the other.
- **CORE / MVP vs ASPIRATIONAL** — in the first buildable slice, or designed-for-and-deferred (named so the
  model never paints itself into a corner).

**The frame:** Omni is an **executable, self-validating meta-model of the software-delivery process** — three
levels: the **process meta-model** (the primitive, descriptors, relations, validators *as typed code* — **Phase 0
of the MVP**) → the **authored model** (a project's instances, which *conform*) → **derived facts** (machine
truth, never authored). Instances **conform** (checked, never gated). Two permanent honesty guardrails: checks
police **conformance & honesty**, never content-quality and never workflow; and we claim **"deterministically
validated," never "provably correct."**

**The model in one breath:** one authored **truth-primitive — `Spec`** — enriched in place (never migrated to a
new artifact type), positioned by **three descriptors**: `kind` (a *true subtype*; 8 values) × `altitude`
(`epic → feature → story`) × `readiness` (`idea → scoped → defined → ready`). Familiar delivery nouns
(Use Case / NFR / Decision Record / Contract; Epic / Feature / Story) are **named coordinates on the one
primitive, not separate types**. Two more authored things state **no system truth**: the **`Pack`** (the
grouping / review aggregate) and the in-code **`anchor`** (a binding — identity only, never intent). **Delivery
facts** (`implemented` / `has-verifier` / `observed`) are **derived, never authored**. An `extractor` derives
**one regenerable graph** (the sole read model); CI runs **conformance + honesty checks**; the **`claim`**
taxonomy (`declared` / `anchored` / `inferred`) is never collapsed; git is the event log. Consumers: coding
agents **script a visible typed graph** (the **agent surface** — no verb wall); user-facing apps integrate
through the **MCP surface** (designed-in, deferred build); edits flow **intent → agent → git → conformance
checks** (no patch loop).

> Concept docs intentionally carry some implementation detail (TS shapes, DSL, graph JSON). Known antipattern,
> deliberate: the docs double as the implementation spec until the code can hold it. Separating an
> implementation-agnostic concept layer from a representation layer is a recorded future direction, not done yet.

## Why this shape pays off

The bets the design rests on — and why the language/spec discipline is load-bearing, not ceremony:

- **Shared language is a performance feature.** A ratified ubiquitous language measurably leans out reasoning and
  lifts result quality — for solo and subagent work, not just human↔agent chat. Terminology rigor *is* throughput.
- **The spec is the prompt is the design.** One language spans intent → spec → design → code; you don't translate
  prose into code, you *enrich the same typed `Spec`* until it is implementable. Implementation becomes the
  near-autopilot session ("implement `spec:…`"); the real, iterative work is maturing and **reviewing** specs —
  alone and in related sets (the `Pack` / **Design Review** projection).
- **Maturity gates implementation.** Don't ship code before a spec is `ready`; premature implementation forces
  expensive refactoring. The `implemented ∧ ¬ready` **drift alarm** exists to catch exactly that (and
  `ready ∧ ¬implemented` is the build backlog).
- **The graph is AI-native.** A typed graph of related specs is the shape an LLM already reasons in —
  relationships and structure, not prose. Feed the agent the graph (the **agent surface**); don't narrate at it.

## Lineage & stance

Built on hard-won learnings from **`@libar-dev/architect`** (the `architect` CLI, Libar Studio desktop app, MCP,
projection pipeline) at `/Users/darkomijic/dev-projects/architect`. That codebase is a **source of learnings,
not a template**: this is a redesign from scratch — **0 old sins carried over**, no back-compat, every decision
and verb re-thought. When a prior implementation's *shape* is offered, treat it as evidence about the problem,
never as the answer.

## Working discipline

- **Terminology is ratified, not provisional.** Use the exact terms in `docs/concept/ubiquitous-language.md`
  (and the rationale in `DECISIONS.md`). Flag, don't silently invent, any new term. The legacy `00`–`07` docs
  still carry pre-ratification vocabulary (`abstraction`, `provenance`, `marker`, `facet`, "two axes", the old
  readiness ladder) — that is exactly what the cleanup plan fixes; don't take it as current.
- **Respect plan mode.** The cleanup plan distinguishes **PLAN-ONLY** work (designing, deciding) from
  **execution** (editing the 18 concept/JTBD docs). Don't start editing those files unless the session is
  execution.
- **Naming is parked — don't churn it.** The system / CLI / package names (`Omni`, `Libar Omni`, `AKG`, the `akg`
  CLI, `@akg/*`) are provisional placeholders owned by a later naming pass; "process" vs "protocol" (MD-5) is
  open. Leave them alone until that pass.
- **Git hygiene** follows the global rules (no `git stash`; commit early on a WIP branch; commit/push only when
  asked).

# Libar Omni — concept repo

Second-generation concept for a **programmatic, AI-native software-delivery system**: model the *whole
delivery lifecycle* as typed code in the repo, derive one graph from it, and generate every other artifact
off that graph. This repo holds the **concept synthesis** and **JTBD stories** that together serve **as the
spec** — there is no separate PRD. They are the direct input to building the MVP.

## What's here

| Path | What it is |
|---|---|
| `docs/concept/` | 9 principle-led concept docs (`00`–`07` + README). The design: one `Spec` primitive, two axes, one derived graph, honest provenance, CI validators, consumer surfaces. |
| `jtbd-stories/` | 9 JTBD **job stories** (`When [situation], I want to [motivation], so I can [outcome]`) + README. Stable, solution-agnostic jobs — chosen over user stories because consumers are heterogeneous and evolving (humans, CI, CLIs, **AI agents**). |
| `plans/` | Working plans: **`please-do-a-pedantic-tidy-dove.md`** (the live cleanup plan — read first) and **`language-finalization-brief.md`** (prep for the language-finalization grill session). |
| `docs/concept/GLOSSARY.md` | The ratifying glossary (ubiquitous language). Canonical term source the cleanup applies. |

## How to read the design

Two conventions run through every doc — honour them:

- **Principle vs Representation** — a *Principle* is a law the design stands or falls on; a *Representation* is
  one chosen mechanism among several. Never mistake one for the other.
- **CORE / MVP vs ASPIRATIONAL** — in the first buildable slice, or designed-for-and-deferred (named so the
  model never paints itself into a corner).

The model in one breath: **one `Spec` primitive** enriched in place (never migrated to a new artifact type),
positioned on **two independent axes** — `abstraction` (intent altitude) × `readiness` (design maturity) —
with **delivery facts derived, never authored** (`implemented` / `has-verifier` / `observed`). A `ts-morph`
extractor derives **one regenerable graph** (the sole read model); CI validators keep it honest; provenance
(`declared` / `annotation` / `inferred`) is never collapsed; git is the event log. Consumers: coding agents
**script a visible typed graph** via a typed CLI (no verb wall); user-facing apps integrate through an **MCP**
surface (designed-in, deferred build); edits flow as **intent → agent → git → CI** (no patch loop).

> Concept docs intentionally carry some implementation detail (TS shapes, DSL, graph JSON). Known antipattern,
> deliberate: the docs double as the implementation spec until the code can hold it. Separating an
> implementation-agnostic concept layer from a representation layer is a recorded future direction, not done yet.

## Why this shape pays off

The bets the design rests on — and why the language/spec discipline is load-bearing, not ceremony:

- **Shared language is a performance feature.** A ratified ubiquitous language measurably leans out reasoning and
  lifts result quality — for solo and subagent work, not just human↔agent chat. Terminology rigor *is* throughput.
- **The spec is the prompt is the design.** One language spans intent → spec → design → code; you don't translate
  prose into code, you *enrich the same typed spec* until it is implementable. Implementation becomes the
  near-autopilot session ("implement `spec:…`"); the real, iterative work is maturing and **reviewing** specs —
  alone and in related sets (the pack / design-review projection).
- **Maturity gates implementation.** Don't ship code before a spec is `ready`; premature implementation forces
  expensive refactoring. The `implemented ∧ ¬ready` drift alarm exists to catch exactly that.
- **The graph is AI-native.** A typed graph of related specs is the shape an LLM already reasons in —
  relationships and structure, not prose. Feed the agent the graph (D5); don't narrate at it.

## Lineage & stance

Built on hard-won learnings from **`@libar-dev/architect`** (the `architect` CLI, Libar Studio desktop app, MCP,
projection pipeline) at `/Users/darkomijic/dev-projects/architect`. That codebase is a **source of learnings,
not a template**: this is a redesign from scratch — **0 old sins carried over**, no back-compat, every decision
and verb re-thought. When a prior implementation's *shape* is offered, treat it as evidence about the problem,
never as the answer.

## Working discipline

- The current plan distinguishes **PLAN-ONLY** work (designing, deciding) from **execution** (editing the
  concept docs / stories). Respect which mode a session is in; don't start editing the 18 spec files unless the
  task is execution.
- Terminology is still **provisional** until a ubiquitous-language glossary ratifies it (planned). Prefer the
  plan's chosen terms; flag, don't silently invent, new ones.
- Git hygiene follows the global rules (no `git stash`; commit early on a WIP branch; commit/push only when asked).

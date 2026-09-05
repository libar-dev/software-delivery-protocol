---
name: Architectural patterns arc
overview: "Execute the plan-38 structural intent: rule that architectural significance rides existing primitives, annotate the engine's key abstractions and inter-decision relationships in the graph, and ship architectural-slice recipes that replace grep-style codebase investigation, highlighted in the skills and AGENTS.md."
todos:
  - id: branch
    content: Create feature branch before any changes
    status: pending
  - id: ruling
    content: 'Rule "architectural significance rides existing primitives": decision Spec + MD-34 registry row, resolve structural-patterns'' blocking questions, enrich the Spec'
    status: pending
  - id: self-binding
    content: Define the significance criterion and widen component/uses anchor coverage across src/; enrich structural-self-binding
    status: pending
  - id: decision-relations
    content: Author genuine dependsOn/supersedes relations between decision Specs
    status: pending
  - id: recipes
    content: Add recipes 17-19 (architecture map, decision map, planning slice) with test coverage
    status: pending
  - id: skills
    content: Update sdp-agent-surface and sdp-sessions skills to highlight the new views
    status: pending
  - id: agents-md
    content: "Update AGENTS.md: recipe counts and key decision record highlights"
    status: pending
  - id: gate
    content: Run npm run check, re-measure graph counts, commit at coherent boundaries
    status: pending
isProject: false
---

# Architectural Patterns and Graph-First Architecture Views

## Context

Plan 38 (merged in [PR #24](https://github.com/libar-dev/software-delivery-protocol/pull/24)) already captured this arc's intent as idea-rung Specs. This session enriches and executes them:

- [specs/model/structural-patterns.sdp.md](specs/model/structural-patterns.sdp.md) — blocking questions: what carries "pattern", and does new vocabulary pass the ADR test. **Ruled here: no new vocabulary (user-selected Option A).**
- [specs/protocol/structural-self-binding.sdp.md](specs/protocol/structural-self-binding.sdp.md) — blocking question: which engine units are architecturally significant, by what criterion.

Measured baseline (re-derive, never quote): 33 decision Specs but only 5 inter-decision relations; 11 `component:` nodes, 59 `memberOf`, 19 `uses` edges. The relationship layer between decisions is largely unauthored, and structural coverage stops at the plan-35 first tranche.

Gen-1's `by-layer.md` / `by-theme.md` are shape evidence only (per lineage discipline): patterns with dependency edges, grouped views, fan-in tables. Gen-2 equivalents are **derived on demand via `sdp q` recipes**, never committed renderings — consistent with "derived, never quoted" and the shipped-projections freeze (MD-32).

## The ruling (step 1, sets up everything else)

**Architectural significance is authored on existing primitives.** Patterns are decision/model-kind Specs; relationships between patterns are the existing relations (`dependsOn`, `supersedes`, `refines`); code linkage rides `satisfies` + `decidedBy` joins; grouping is derived from id families and the component graph, not new Packs. No new anchor field, no `component:` naming semantics, no ratified "pattern" term — the concept dissolves into existing vocabulary.

- If this passes the ADR three-part test (it mirrors MD-30's refusal shape): mint `spec:decisions.*` + an MD-34 registry row in [docs/concept/DECISIONS.md](docs/concept/DECISIONS.md), wire `decidedBy` from `spec:model.structural-patterns`.
- Resolve both blocking open questions on `spec:model.structural-patterns` and enrich it to the honest rung (`ready` stays a human statement — leave promotion to the user's review).

## Annotate (step 2, the corpus + source work)

1. **Key abstractions in code** — answer `spec:protocol.structural-self-binding`'s criterion question (proposed: exported public surface plus cross-component reach), then widen `codeAnchor` `component`/`uses` coverage across `src/` so every architecturally significant unit is a graph-visible CodeNode with membership and uses edges. Structural edges stay identity-only (MD-30).
2. **Relationships between patterns** — survey the 33 decision Specs and author `dependsOn`/`supersedes` edges only where one decision's truth genuinely needs the other (MD-33 forbids scheduling-flavored edges). Expected clusters: carrier family (partially done), agent-surface family, structural/anchor family, planning family.
3. Enrich `spec:protocol.structural-self-binding` to its honest rung once coverage lands.

## Architectural-slice recipes (step 3, the views)

Add three recipes to [docs/agent-surface/recipes.md](docs/agent-surface/recipes.md), each answering a question that today needs grep:

- **17 — Architecture map**: components with member abstractions, uses fan-in/fan-out, satisfied Specs, and the decisions that shape them (via `satisfies` → `decidedBy` join). The gen-1 "by-layer" equivalent, derived live.
- **18 — Decision map**: decision Specs with inter-decision edges, fan-in ranking, and decided subjects grouped by family. The gen-1 "by-theme" equivalent.
- **19 — Planning slice**: parameterized on a Spec id — its refinement neighborhood, constraining decisions, bound components and abstractions, verifiers, and blast-radius entry points. The "understand before implementing / plan a new feature" view.

Recipe bodies are executed verbatim by [test/recipes.test.ts](test/recipes.test.ts) (ordinal list and peplanr-recipe assertions need extending); [test/skills.test.ts](test/skills.test.ts) pins the "sixteen" count and per-skill recipe references — update in lockstep.

## Highlight (step 4, the on-ramps)

- [.agents/skills/sdp-agent-surface/SKILL.md](.agents/skills/sdp-agent-surface/SKILL.md): recipe catalog sentence (sixteen → nineteen) and a short "architecture questions" pointer at recipes 17–19.
- [.agents/skills/sdp-sessions/SKILL.md](.agents/skills/sdp-sessions/SKILL.md): point the design/implement shapes at the planning-slice recipe instead of file scanning.
- [AGENTS.md](AGENTS.md) (symlinked as CLAUDE.md): update the "sixteen runnable recipe bodies" mentions and add a lean named list of key decision record Specs (the load-bearing ones: MD-1, MD-4, MD-18, MD-22, MD-30, MD-32, MD-33 — names first, per the plain-language references decision). README's recipe count if present.

## Discipline

- Feature branch first (e.g. `feature/architectural-patterns-views`); commits at coherent boundaries are authorized on it by this plan.
- No new `plans/` file — plan 38 is the arc pointer; the graph carries the backlog.
- Gate: `npm run check` before any green claim; re-measure counts at close and label them re-derived.
- No engine `src/` behavior changes expected beyond anchor annotations; if a recipe join proves impossible without one, stop and surface it rather than minting reader surface (second-caller bar).

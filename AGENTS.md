# Libar Software Delivery Protocol

A **programmatic, AI-native software-delivery system**: model the *whole delivery lifecycle* as typed code in
the repo, derive **one graph** from it, and generate every other artifact off that graph. A deliberate second
take on `@libar-dev/architect` — a year of design thinking front-loaded, **zero back-compat, zero old sins
carried over**.

There is no separate PRD — the product's own thesis (*the spec is the prompt is the design*)
applies to itself. This repo **self-hosts**: it authors its own Specs in its own carrier (the
`.sdp.md` corpus under `specs/`), derives its own graph, and validates itself in CI — the
Protocol's first production corpus is the Protocol. The ratified ubiquitous language
(`CONTEXT.md`) and the JTBD stories carry the vocabulary and the jobs; the engine lives under
`src/`; the surviving concept docs hold the principle-led design that has not yet dissolved into
carrying Specs. **Intended truth** (authored Specs, ratified decisions, concept material) is
authoritative for what the Protocol claims; **`src/` and tests** are authoritative evidence of
current realization. A disagreement is **drift to resolve**, never permission to silently promote
code behavior into intent.

> **Status:** Specs and Packs default to the Markdown carrier; the TS DSL survives as import
> source and a lawful per-ID option (the carrier ruling, MD-18, completed by the Pack syntax
> ruling, MD-25). The Gherkin carrier option (MD-27) admits a graph-aware lawful per-ID option
> for behavior and example Specs. **plan 34 is DRAFTED** — the next-arc briefs index, the sole
> planning input for the next arc: the agent surface (brief E, expanded there and superseding
> the plan-29 text), deferred registrar adoption, Protocol-side structural self-binding, and
> next projections. Settled ground is **plan 33 is EXECUTED** — the
> adjudicated plan-31 review is closed, the graph and gate are freshly re-measured, and the ready
> PR is prepared; plan 32 remains its review brief. Beneath it, **plan 31 is EXECUTED** —
> carrier universality, derived runnable modules, census/Mermaid projections, and structural
> anchor semantics (briefs A/B/C/D). Earlier settled ground remains
> **plan 30 is EXECUTED** (MD-28 settles the canonical suffix as `.sdp.gherkin` and hardens
> locations, closed grammar, and bounded multi-finding diagnostics), **plan 28 is EXECUTED**
> (bounded carrier pipeline, parity proof, reader-family tracer bullet, guidance) and **plan 27
> is EXECUTED** (v0 lineage restored; executable-verification review selected the Gherkin
> option). Plan 29 is the next-arc briefs index (not an execution plan). Plan 26 completed native
> Packs, annotation coverage, and decision readiness. Plan 25 recovered the guidance layer and
> packaged the `sdp-sessions` on-ramp; plan 24's inward turn remains the standing practice:
> forward intent lives in the graph, so the live backlog is a graph query, not a document.
> Corpus counts, readiness, and findings are **derived, never quoted** — re-run
> `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
> (or `npm run --silent sdp --` with the same argv) and read recipes 8 and 11. Recipe 1 is the
> operational backlog, not the census. Never invoke a bare `sdp`. Build state lives in **`plans/`** — read the highest
> **primary-numbered** plan's status header, plus any **active subplans it (or its parent family)
> explicitly designates as current**; ignore unnumbered files and letter-suffixed plans only when
> no primary/active plan designates them. If that plan is DRAFTED, also read the latest ✅
> EXECUTED/RUN plan for settled ground.

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
| `CONTEXT.md` (repo root) | **the vocabulary** — the ratified lean glossary (terms · relations · a worked dialogue · flagged ambiguities); sole source of truth for terminology; the model exposition lives in the Specs under `specs/` and in the surviving concept docs | **first, always** |
| `specs/` | **the self-hosted corpus** — the Protocol's own Specs in its own carrier (families: `model` · `extraction` · `validation` · `carrier` · `consumers` · `protocol` · `observation` · `decisions`, plus the self-hosting Pack); the primary carrier of intended truth | when design truth is in question — but query it through `sdp q` first, then read the carrying Spec |
| `jtbd-stories/` | **the jobs (functional spec)** — stable `When / I want / so I can` stories (themes A–H); no personas, because consumers are heterogeneous (humans, CI, CLIs, **AI agents**) | to know *what* we serve |
| `docs/concept/` (+ README) | **the technical design** — the surviving principle-led docs: vision & MVP boundary, founding principles (P1–P10), authoring & binding, consumers, roadmap; the core model, the one graph, and validation & honesty dissolved into the `model.*`, `extraction.*`, and `validation.*` Spec families — locate any of them with concept search (recipe 6) | to know *how* it is designed |
| `docs/concept/DECISIONS.md` | **the lean decision registry** — ratified names, one-line glosses, carrying Specs, and the D1–D6 lookup; historical rationale lives in git, plans, and the Specs themselves | when resolving a decision name or following its canonical pointer |
| `src/` | **the engine** — `model` (Spec/descriptors/pack/anchors) · `extract` · `graph` · `validate` · `reader` (agent surface) · `projections` (Design Review) · `cli` (`sdp build` · `validate` · `view` · `import` · `q`) · `runner` / `codegen` / `notation` / `adapters` | when implementing or verifying **current engine** behavior |
| `.agents/skills/sdp-agent-surface/` + `.agents/skills/sdp-authoring/` + `.agents/skills/sdp-sessions/` + `docs/agent-surface/recipes.md` | **the agent on-ramps** — repository-owned reading, authoring, and advisory delivery-session skills (also exposed to Claude through the `.claude/skills` symlink) plus the eleven runnable `sdp q` bodies; see "Query the graph first" below | before answering a corpus question, authoring intent, or routing delivery work — query the graph, then follow the carrying Specs |
| `examples/checkout-v1` | **the worked MVP example** (TS DSL tracer bullet) — specs, anchors, untracked `generated/` (regenerated in-pipeline); walkthrough in its README | when proving the loop end-to-end |
| `explorations/` | **evidence only** (carrier exhibits, executable-example findings) — mapping evidence for design; **never promote spike code into product** | when judging design evidence; not a source tree to ship |
| `docs/lineage/` | restored historical design documents — the v0 concept set, verbatim with lineage headers; evidence for design reviews, never intended truth | when a review needs superseded design on the table rather than in git history |
| `plans/` | **the build plan** — what each implementation session does, and why | before writing code — highest primary-numbered plan's status header, plus active subplans it designates; if DRAFTED, also the latest ✅ EXECUTED/RUN plan |
| `npm run check` | **the green gate** — `check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight` | before claiming green / after engine edits |
| `reviews/` | **archived session reviews** (implementation, founding-ideation, adversarial + prompts) — durable findings already folded into plans/DECISIONS; read for provenance | rarely |

> Concept docs still carry implementation detail (TS shapes, DSL, graph JSON) for **unsettled and
> post-MVP** design — on a disagreement with `src/`, the drift rule above applies: fix the stale
> side deliberately, never invent a third behavior. A clean concept/representation split remains
> a recorded future direction.

## Query the graph first

The graph is the sole read model, and `sdp q` is the agent front door (MD-22): it derives the
graph in process and evaluates a plain JavaScript async-function body you supply, with three
bindings injected — `g` (the reader), `graph` (the raw schema), `report` (the validation
report). `return` is the output contract; add `--json` for machine-readable output. For any
corpus question — what a Spec guarantees, what is ready but unimplemented, what a change
touches, where a concept lives — script the graph instead of reading `.sdp.md` files by hand:

```bash
# The build backlog (recipe 1, condensed): ready implementation work, excluding examples and decisions
pnpm --silent sdp:q 'return g.specs().filter((s) => s.statedReadiness === "ready" && s.specKind !== "example" && s.specKind !== "decision" && !s.deliveryFacts.includes("implemented")).map((s) => s.id)'

# Concept search (recipe 6): where does a concept live?
pnpm --silent sdp:q 'return g.findByConcept("readiness floor").slice(0, 5).map((n) => n.id)'
```

The full CLI surface is `sdp build · validate · view · census · mermaid · gherkin · import · q`.
The four projection publishers remain independent public verbs; repository generation/check scripts
certify all four roots through the private projection-suite driver. The eleven runnable recipe
bodies live in `docs/agent-surface/recipes.md` (each executed as written by
`test/recipes.test.ts`), and the repository-owned skills (`sdp-agent-surface` for reading,
`sdp-authoring` for writing intent, `sdp-sessions` for advisory work-shape routing) are the
on-ramps. In this checkout, always go through
`pnpm --silent sdp:q '<body>'` — `pnpm exec` cannot resolve the package's own bin.

## The build path

The MVP proved the founding principle on **one** bounded context — Order Management,
`pack:checkout-v1` — built as thin **end-to-end slices on the Phase 0 foundation**; the worked
example lives at `examples/checkout-v1` (documented walkthrough in its README). **Slices 0–5 are
complete** — the per-slice record is plan 10 and the roadmap `docs/concept/07`. Live work is the
highest primary-numbered plan under `plans/` — read it before writing code.

> **Tracer-bullet discipline.** Author the example specs and anchored code *first*, so the carrier and extractor are
> forced to be usable before they are finished. If the example stops extracting or validating, fix the carrier or extractor — not the example.

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
  `implemented ∧ ¬ready` is the **drift alarm**; ready unimplemented examples and decisions are
  audited exclusions from the operational build backlog under the example realization posture
  (MD-24) and decision readiness posture (MD-26). A typed graph of related specs is the shape an
  LLM already reasons in: feed the agent the graph, don't narrate at it.

## Working discipline

- **Query before you read.** A corpus question goes to the graph first (`pnpm --silent sdp:q`
  with a recipe body), then to the carrying Spec it points at. Scanning `specs/` files to learn
  state is a smell — the graph is derived from the same carrier and is always current.
- **Write lean, and write for outsiders.** Cut unnecessary verbosity and noise in every session
  artifact — plans, records, summaries, spec prose. Use technical but plain language a wider
  open-source audience can follow: the ratified terms are the shared vocabulary, not a license
  for dense insider prose.
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
  present, e.g. a sibling `architect` checkout) taught us the problem in production — source-first
  annotations, one graph as the read model, a scriptable graph handle (the direct ancestor of
  `sdp q`). Its old sins — a sprawling authored tag registry, workflow gates on the lifecycle,
  hand-authored delivery status — are what this design deliberately rejects. Treat its *shape*
  as evidence about the problem, never as the answer.
- **A "verified" row is re-measured, never inherited.** A docket or ledger row claiming *fixed* or *verified*
  is re-checked against the tree at the moment of verification, never trusted from the row that closed it —
  the phase-4 close caught a "verified — intact" row that had been false since the commit after the one it cited.
- **OmO state is recoverable project state.** Track durable `.omo/` state that carries decisions, plans,
  review history, proofs, or orchestration recovery (`boulder.json`, `drafts/`, `plans/`, and durable
  `evidence/`). Commit coherent checkpoints when that state is created or materially changed; a plan may mark
  narrowly named runtime evidence as workspace-local. Never delete, prune, overwrite, or blanket-ignore
  unfamiliar `.omo/` state as cleanup — inspect it and preserve it until its owner and recovery value are clear.
- **Commits are recovery boundaries, not workflow gates.** An execution plan's explicit commit strategy counts
  as authorization on its work branch; otherwise ask before committing. Prefer a commit after a coherent
  logical unit and its relevant quality gate, but never force one per todo, create empty commits, absorb
  unrelated or pre-existing changes, or commit from an unsafe dirty baseline. When no clean boundary exists,
  preserve and account for the state in the tracked plan/draft rather than discarding it; commit at the next
  safe boundary. Push only on the user's explicit request; never use `git stash`.

## PR descriptions as durable context

PR descriptions are the project's durable narrative record — sessions return to them long after
merge, so write for the reader who arrives in six months with no context. The standard, set by
PR #19 (the universal-Spec arc) building on PRs #10 and #16:

- **Story before inventory.** Lead with what the PR introduces and why — the questions it answers,
  the arc it closes, the plans it executes. What-changed lists and review-closure details are
  evidence, never the headline; a description written during a review session must still be
  re-anchored on the full scope before publication.
- **Present new things, don't just name them.** Each new surface gets a short explanation of the
  idea and a linked representative artifact on the branch — a carrying Spec, a worked example, a
  plan. One stop per surface, tour-style.
- **Ratified decisions are a table.** Ratified name, one-line ruling, carrying Spec link.
- **Invite use.** A try-it block with real commands verified against the branch, plus a feedback
  call naming the open questions the PR most wants pressure on.
- **Upcoming work stays, always.** Every description keeps a forward section — what re-enters
  next, in what order, with re-entry triggers — and the durable refused list. It contextualizes
  the arc and feeds planning; never drop it, and rewrite it rather than appending stale rows.
- **Numbers are re-measured and marked.** Close measurements are re-derived at close and labeled
  as such ("re-run the recipes rather than inheriting these"), never quoted from an older record.

> `CLAUDE.md` is a symlink to `AGENTS.md` — **edit `AGENTS.md`.**

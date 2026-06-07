# Libar Software Delivery Protocol — Job Stories (JTBD)

These are **job stories**, not user stories or PRDs. Each one captures a *situation*, a *motivation*, and an *outcome* — the stable job to be done — without binding to a persona or a transient feature. Together with the [concept](../docs/concept/README.md), they are the direct input to building the MVP: there is no separate PRD layer, in keeping with the spec-driven philosophy the product itself embodies.

Format: **When [situation], I want to [motivation], so I can [outcome].**

The consumers of this system are heterogeneous and evolving — domain engineers, architects, PMs, QA, CI pipelines, the CLI, the generated views, and **AI agents** as a first-class consumer. Job stories stay valid as new consumers appear, which is exactly why we use them here.

> **Coverage note (honest scope).** These stories are deliberately **engine- and agent-first**: capturing intent, binding code, deriving the one graph, keeping it honest, and serving humans + agents. A few stories cover the wider consumer situations directly — shaping/where-to-invest (JS-A6), verifier-sufficiency planning (JS-G4), decision/audit trace (JS-G5), and the Design-Review readiness decision (JS-E4). Richer persona surfaces — exec status dashboards, architecture-enforcement checks, full compliance/sign-off workflows — are **deliberately deferred post-MVP** and are *not* yet backed by stories. The job-story shape accommodates them when they arrive; their absence here is a scope decision, not an oversight.

---

## Founding Principle — One Graph

Everything else is downstream of this. If a story ever conflicts with it, the principle wins.

1. **No second graph, ever.** There is one graph. We do not stand up a parallel store that can disagree with the repo.
2. **The repository is canonical; the graph is derived and regenerable.** Delete the graph and rebuild it byte-for-byte from the repo.
3. **The `claim` is never silently collapsed or promoted.** A *declared* fact, an *anchored* binding, and an *inferred* guess stay distinguishable forever. Inference never quietly becomes truth.
4. **Truth is authored as code in the repo.** Intent, structure, and relationships are authored as typed code committed alongside the implementation — not in an external tool. (The *graph* is derived from that authored code; see #2.)
5. **Git history is the event log.** Specs and code are the events; the graph and every view are projections of the repo at a commit. No bespoke event store.

> The graph is a *projection of the repository at a commit*. Change the repo, regenerate the projection. Nothing to sync, nothing to reconcile, nothing to trust beyond `git` and the code.

---

## Phase legend

Stories are tagged so the backlog stays MVP-disciplined without capping ambition. The same story shape holds across phases — later phases enrich it, they do not replace it. Tags are a proposal for MVP sequencing, not a frozen commitment.

| Tag | Meaning |
|---|---|
| **MVP** | Required to prove the core loop on one bounded context. Build these first. |
| **Iterate** | Adds real power once the MVP loop holds. The natural next layer. |
| **Later** | Valuable and designed-for, but not soon. Kept here so the model doesn't paint us into a corner. |

The MVP target is one bounded context — Order Management, `pack:checkout-v1`, ~8–12 specs — proving: the typed `Spec` DSL + generic anchors, the `ts-morph` one-graph extractor, core conformance + honesty checks, the Design Review / one read-only view, the agent surface (the `reader` — entry adapters + impact), and the bidirectional spec↔test trace. The write path is **edit TypeScript + git** — no patch subsystem.

---

## Story index

| ID | Job story | Phase |
|---|---|---|
| **A — Capture & evolve intent** | | |
| [JS-A1](./01-capture-and-evolve-intent.md#js-a1) | Capture a rough idea with zero ceremony | MVP |
| [JS-A2](./01-capture-and-evolve-intent.md#js-a2) | Enrich a spec in place as it matures | MVP |
| [JS-A3](./01-capture-and-evolve-intent.md#js-a3) | Refine a big idea into child specs without losing the parent | MVP |
| [JS-A4](./01-capture-and-evolve-intent.md#js-a4) | Position any spec on independent descriptors | MVP |
| [JS-A5](./01-capture-and-evolve-intent.md#js-a5) | Group related specs into a coherent pack | MVP |
| [JS-A6](./01-capture-and-evolve-intent.md#js-a6) | Survey the landscape to decide where to invest next | Iterate |
| **B — Bind code to intent** | | |
| [JS-B1](./02-bind-code-to-intent.md#js-b1) | Mark significant code with its spec ID | MVP |
| [JS-B2](./02-bind-code-to-intent.md#js-b2) | Link by stable ID so specs and code survive refactors | MVP |
| **C — One Graph** | | |
| [JS-C1](./03-one-graph.md#js-c1) | Derive one canonical graph from the repo | MVP |
| [JS-C2](./03-one-graph.md#js-c2) | Trust every edge's `claim` | MVP |
| [JS-C3](./03-one-graph.md#js-c3) | Regenerate the graph as a pure function of the repo | MVP |
| [JS-C4](./03-one-graph.md#js-c4) | Reconstruct history from git, not a second store | MVP |
| **D — Keep it honest** | | |
| [JS-D1](./04-keep-it-honest.md#js-d1) | Fail CI on broken links and false stated readiness | MVP |
| [JS-D2](./04-keep-it-honest.md#js-d2) | Enforce completeness rules per readiness level | MVP |
| **E — See & share** | | |
| [JS-E1](./05-see-and-share.md#js-e1) | Read a spec through one generated view | MVP |
| [JS-E2](./05-see-and-share.md#js-e2) | Give an AI agent structured context through the agent surface | MVP |
| [JS-E3](./05-see-and-share.md#js-e3) | Share an interactive view with stakeholders | Iterate |
| [JS-E4](./05-see-and-share.md#js-e4) | Conduct a Design Review and decide readiness | MVP |
| **F — Edit through the lens** | | |
| [JS-F1](./06-edit-through-the-lens.md#js-f1) | Drive a change as scoped intent, not a patch | Iterate |
| **G — Trace & assess impact** | | |
| [JS-G1](./07-trace-and-impact.md#js-g1) | See what a change impacts before making it | MVP |
| [JS-G2](./07-trace-and-impact.md#js-g2) | Trace a spec to its verification and back | MVP |
| [JS-G3](./07-trace-and-impact.md#js-g3) | Get curation assistance from the impact graph | Iterate |
| [JS-G4](./07-trace-and-impact.md#js-g4) | Find the specs that still need a verifier | MVP |
| [JS-G5](./07-trace-and-impact.md#js-g5) | Trace a decision to what it shaped, for an audit trail | Iterate |
| **H — Evidence** | | |
| [JS-H1](./08-evidence.md#js-h1) | Link runtime observations back to specs | Later |

---

## Out of scope for now (deliberately)

To keep the essence clean, these are *not* in the MVP and are intentionally absent from the job stories above. The model accommodates the deferred ones without refactoring the core.

- **Test-result ingestion.** The graph never stores pass/fail. Verification is *structural* — a linked, enabled verifying test exists (JS-G2, JS-D2). Run verdicts are CI's, operational.
- **A structured patch subsystem.** Edits flow as scoped intent → an agent edits source → git → conformance checks (JS-F1). The view never writes to canonical source.
- **A second store / audit table.** History lives in git; the graph carries only current state (JS-C4).
- **Runtime-composition machinery** (Fastify + Effect Layers / Awilix). The MVP binds code to intent generically — an anchor on any class, function, route, or module. *How* the runtime is wired is an extractor detail, not a job.
- **A graph database.** The one graph is a regenerable file derived from the repo. A property-graph mirror is a Later concern, only if traversal scale ever demands it.
- **Rich exports** (LikeC4 / OpenAPI / JSON-LD). Designed-for; the MVP emits the graph (agent surface + JSON) and the Design Review / one view. Runtime observation is surfaced only in JS-H1 (Later).
- **A bespoke editor / IDE plugin.** The CLI plus the generated view and agent surface are enough. Authoring stays in code.
- **Automatic trace-link recovery as truth.** The impact graph may *suggest* (JS-G3); a suggestion never becomes a declared edge silently (Founding Principle, point 3).

If we need any of these later, the story shape already accommodates them — that is the point of JTBD framing.

---

## How each story is written

- **ID & title** — stable identifier for backlog reference.
- **Phase** — MVP / Iterate / Later.
- **The job** — the When / I want / so I can sentence.
- **Essence** — one line on why this job matters, in founding-principle terms.
- **References** — the concept doc(s) that expand the detail.
- **Acceptance criteria** — 6–8 outcome- and context-focused checks: situation recognition, progress visibility, efficiency, edge cases, and integration reality.

Acceptance criteria describe *the outcome being achieved*, not an implementation. They should remain true as the system grows in complexity.

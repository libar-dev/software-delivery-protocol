# Libar Omni — Job Stories (JTBD)

These are **job stories**, not user stories or PRDs. Each one captures a *situation*, a *motivation*, and an *outcome* — the stable job to be done — without binding to a persona or a transient feature. They are deliberately compact: the essence of the [concept synthesis](../docs/concept/README.md) with the PRD noise removed.

Format: **When [situation], I want to [motivation], so I can [outcome].**

The consumers of this system are heterogeneous and evolving — domain engineers, architects, PMs, QA, CI pipelines, the CLI, the generated views, and **AI agents**. Job stories stay valid as new consumers appear, which is exactly why we use them here.

---

## Founding Principle — One Graph

Everything else is downstream of this. If a story ever conflicts with it, the principle wins.

1. **No second graph, ever.** There is one graph. We do not stand up a parallel store that can disagree with the repo.
2. **The repository is canonical; the graph is derived and regenerable.** You can delete the graph and rebuild it byte-for-byte from the repo.
3. **Provenance is never silently collapsed or promoted.** A *declared* fact, an *annotation*, and an *inferred* guess stay distinguishable forever. Inference never quietly becomes truth.
4. **Single source of truth: the graph is code in the repo.** Intent, structure, and relationships live as typed code committed alongside the implementation — not in an external tool.
5. **Event store + projections = code and git commits.** Git history *is* the event log. Specs and code are the events; the graph and every view are projections of them. No bespoke event store.

> The graph is a *projection of the repository at a commit*. Change the repo, regenerate the projection. Nothing to sync, nothing to reconcile, nothing to trust beyond `git` and the code.

---

## Phase legend

Stories are tagged so the backlog stays MVP-disciplined without capping ambition. The same story shape holds across phases — later phases enrich it, they do not replace it.

| Tag | Meaning |
|---|---|
| **MVP** | Required to prove the core loop on one slice. Build these first. |
| **Iterate** | Adds real power once the MVP loop holds. Natural next layer. |
| **Later** | Valuable and designed-for, but not soon. Kept here so the model doesn't paint us into a corner. |

---

## Story index

| ID | Job story | Phase |
|---|---|---|
| **A — Capture & evolve intent** | | |
| [JS-A1](./01-capture-and-evolve-intent.md#js-a1) | Capture a rough idea with zero ceremony | MVP |
| [JS-A2](./01-capture-and-evolve-intent.md#js-a2) | Enrich a spec in place as it matures | MVP |
| [JS-A3](./01-capture-and-evolve-intent.md#js-a3) | Refine a big idea into child specs without losing the parent | MVP |
| [JS-A4](./01-capture-and-evolve-intent.md#js-a4) | Use one shape at any altitude and readiness | MVP |
| **B — Bind code to intent** | | |
| [JS-B1](./02-bind-code-to-intent.md#js-b1) | Mark significant code with its spec ID | MVP |
| [JS-B2](./02-bind-code-to-intent.md#js-b2) | Link by ID so specs and code survive refactors | MVP |
| **C — One Graph** | | |
| [JS-C1](./03-one-graph.md#js-c1) | Derive one canonical graph from the repo | MVP |
| [JS-C2](./03-one-graph.md#js-c2) | Trust every edge's provenance | MVP |
| [JS-C3](./03-one-graph.md#js-c3) | Regenerate the graph as a pure function of the repo | MVP |
| [JS-C4](./03-one-graph.md#js-c4) | Reconstruct history from git, not a second store | Iterate |
| **D — Keep it honest** | | |
| [JS-D1](./04-keep-it-honest.md#js-d1) | Fail CI on broken links and false readiness claims | MVP |
| [JS-D2](./04-keep-it-honest.md#js-d2) | Enforce completeness rules per readiness level | MVP |
| **E — See & share** | | |
| [JS-E1](./05-see-and-share.md#js-e1) | Read a spec as a rich generated view | MVP |
| [JS-E2](./05-see-and-share.md#js-e2) | Give an AI agent a precise structured slice | MVP |
| [JS-E3](./05-see-and-share.md#js-e3) | Share an interactive view with stakeholders | Iterate |
| **F — Edit through the lens** | | |
| [JS-F1](./06-edit-through-the-lens.md#js-f1) | Round-trip a validated patch from view to code | Iterate |
| **G — Trace & assess impact** | | |
| [JS-G1](./07-trace-and-impact.md#js-g1) | See what a change impacts before making it | Iterate |
| [JS-G2](./07-trace-and-impact.md#js-g2) | Trace a spec to its verification and back | MVP |
| **H — Evidence** | | |
| [JS-H1](./08-evidence.md#js-h1) | Attach test results to the specs they verify | Iterate |
| [JS-H2](./08-evidence.md#js-h2) | Link runtime observations back to specs | Later |

---

## Out of scope for now (deliberately)

To keep the essence clean, these are *not* in the MVP and are intentionally absent from the job stories above. They were considered in the synthesis and deferred:

- **Runtime-anchor machinery** (Fastify + Effect Layers / Awilix). The MVP binds code to intent generically — a marker on any class, function, route, or module. *How* the runtime is wired is an extractor detail, not a job.
- **A graph database.** The one graph is a regenerable file derived from the repo. A property-graph mirror is a Later concern, only if traversal scale ever demands it.
- **Heavy standards plumbing** (OTel / SLSA / CycloneDX / JSON-LD / SysML). Designed-for, surfaced only in JS-H2 (Later).
- **A bespoke editor / IDE plugin.** The CLI plus the generated view are enough. Authoring stays in code.
- **Automatic trace-link recovery as truth.** Inference may *suggest*; it never becomes a declared edge silently (see the Founding Principle, point 3).

If we need any of these later, the story shape already accommodates them — that is the point of JTBD framing.

---

## How each story is written

- **ID & title** — stable handle for backlog reference.
- **Phase** — MVP / Iterate / Later.
- **The job** — the When / I want / so I can sentence.
- **Essence** — one line on why this job matters, in founding-principle terms.
- **References** — the concept doc(s) that expand the detail.
- **Acceptance criteria** — 6–8 outcome- and context-focused checks: situation recognition, progress visibility, efficiency, edge cases, and integration reality.

Acceptance criteria describe *the outcome being achieved*, not an implementation. They should remain true as the system grows in complexity.

# E — See & Share

The graph is only valuable if humans and agents can actually consume it. The job here is to turn the one graph into projections that are read-rich — a generated view for a person reviewing a spec, a typed handle for an AI agent needing context, and (later) an interactive surface for a stakeholder who will never open the repo. Every projection is a pure function of the graph; none is a second source of truth.

> Sink priority: **agents first, the human view second, document exports last.**

---

## JS-E1
### Read a spec through one generated view

**Phase:** MVP
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md)

> **When** I need to understand a spec and everything around it, **I want to** open one generated, read-only view, **so I can** absorb its intent, behaviour, links, verification status, and gaps in one place instead of reconstructing them from scattered files.

**Essence:** The view is a projection of the one graph — fully derived, never hand-maintained. Its form (clean HTML or high-quality Markdown) is a choice of mechanism, not a principle; the MVP needs *one* read-only view.

**Acceptance criteria:**
1. A spec renders showing its header (title, `kind`, `abstraction`, `readiness`, and any claimed-vs-derived readiness divergence), intent, behaviour (rules/examples), relations, and bindings together.
2. The view is generated entirely from the graph — nobody writes or edits it by hand — and lives under `generated/`.
3. Relationships are navigable, so moving from a spec to its neighbours (parent, children, dependencies, decisions) is one action, not a search.
4. Bindings link to implementing code and tests with source links, and **verification is shown structurally** — whether a linked, enabled verifying spec/test *exists* — never as a pass/fail run result.
5. Gaps and warnings (missing verifying test, unmeasured NFR target, broken link, orphan) are visible in context, alongside an impact list for the spec.
6. Provenance cues are visible — declared vs annotation vs inferred shown distinguishably — so a reader can tell asserted intent from machine-derived structure.
7. Regenerating from the same graph yields the same view (reproducible), and the dev-mode and CI surfaces are the *same* generated artifact, with no drift-prone parallel "dev view".

---

## JS-E2
### Give an AI agent structured context through a typed handle

**Phase:** MVP
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md)

> **When** an AI agent needs to reason about part of the system, **I want to** hand it a typed read handle over the graph plus the raw `graph.json`, **so I can** give it structured, joined context to script against instead of dumping the repo into a prompt.

**Essence:** Structured graph context beats raw text, and Libar Omni is a *producer* of it. The surface is one typed handle whose **method list is the documentation** — joins and taxonomy-decode done once at construction — not a 30-verb API and not raw JSON the agent must re-join.

**Acceptance criteria:**
1. The agent reads through one in-memory typed handle (rebuilt fresh each load, persisting nothing) and/or the raw `graph.json`; the type is the discovery surface, so a typed field is a usable capability and an un-typed one is hidden.
2. A small set of high-value methods is provided ("frozen"), namely the ones an agent hand-rolling would get wrong: **entry adapters** that bridge from what the agent has to what the graph knows (`findByConcept(string)`, `byFile(path)`, `bySymbol(sym)`), **blast-radius** over a changeset, and **irreducible cross-source joins** (e.g. spec → implementedBy → invariants/scenarios with maturity/provenance decode).
3. Everything else — single-field traversals, group-bys, the maturity ladder — the agent scripts on demand from the plain, composable shapes the handle returns.
4. Open questions, validation findings, and gaps are reachable through the handle so the agent sees the holes, not just the assertions.
5. Provenance travels with the data — the agent can tell `declared` facts from `annotation` and `inferred` ones.
6. The handle and `graph.json` are regenerable from the repo and stay current as it changes.
7. The surface is strictly read-only: producing context never gives the agent a direct write path to canonical source (edits go through the path in Theme F).
8. Keeping the data in-process and returning conclusions is a measured context-efficiency win (about one-fifth the tokens of a grep/verb-API equivalent on a multi-probe session); token-budgeted slices and an MCP server are a later layer over this same read-only surface.

---

## JS-E3
### Share an interactive view with stakeholders

**Phase:** Iterate
**References:** [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md)

> **When** I need a non-engineer to engage with a spec, plan, or status, **I want to** share a richer interactive view by link, **so I can** raise the odds they actually read and respond instead of ignoring a file.

**Essence:** A generated, shareable, interactive surface (Spec Studio) makes the single source of truth legible to people who will never open the codebase — still a pure projection of the graph at a known commit.

**Acceptance criteria:**
1. A view can be published and shared by link, openable in a browser without setup or a running server.
2. Content is organised for reading — grouped, navigable, visual (trees, relationship maps, readiness heatmaps) — not a flat wall of text.
3. Readiness, coverage, and open questions are presented so a non-engineer can grasp status quickly.
4. A stakeholder can explore relationships and impact without needing to understand the underlying code.
5. The shared artifact is a faithful projection of the graph at a known commit, stamped so viewers know its provenance.
6. Updating the source and regenerating produces an updated shareable view with no manual rework.
7. The interactive surface stays within the read-only gate — its only write-affordance is composing scoped intent (Theme F), never mutating canonical source.

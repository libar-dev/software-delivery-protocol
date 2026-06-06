# E — See & Share

The graph is only valuable if humans and agents can actually consume it. The job here is to turn the one graph into views that are read-rich — for a person reviewing a spec, for an AI agent needing context, and for a stakeholder who will never open the repo.

---

## JS-E1
### Read a spec as a rich generated view

**Phase:** MVP
**References:** [07 — Spec Studio & Projections](../docs/concept/07-spec-studio-and-projections.md)

> **When** I need to understand a spec and everything around it, **I want to** open a rich generated view instead of scrolling a long markdown file, **so I can** actually absorb its intent, behaviour, links, and gaps at a glance.

**Essence:** The view is a projection of the one graph — generated, never hand-maintained. Markdown stays a fallback; rich HTML is the primary lens.

**Acceptance criteria:**
1. A spec renders as a navigable view showing intent, rules, examples, constraints, links, and readiness together.
2. The view is generated entirely from the graph — nobody writes or edits it by hand.
3. Relationships are visual and clickable, so moving from a spec to its neighbours is one action, not a search.
4. Gaps and warnings (missing tests, unmeasured NFRs, broken links) are visible in context, not buried in a separate report.
5. Regenerating from the same graph yields the same view — it is reproducible.
6. A plain-text/markdown projection remains available as a fallback for tools that need it.
7. The view is shareable as a self-contained artifact, openable without the repo or a running server.

---

## JS-E2
### Give an AI agent a precise structured slice

**Phase:** MVP
**References:** [07 — Spec Studio & Projections](../docs/concept/07-spec-studio-and-projections.md)

> **When** an AI agent needs to reason about a part of the system, **I want to** hand it a structured slice of the graph — the relevant nodes, edges, source, open questions, and findings — **so I can** give it a precise neighbourhood instead of dumping the whole repo into a prompt.

**Essence:** Structured context beats raw text. The slice is a projection of the one graph, scoped to a job, with provenance intact.

**Acceptance criteria:**
1. A slice can be produced for a meaningful scope — a feature, a capability, or the impact of a single spec.
2. The slice is self-contained: it carries the nodes, edges, and the source files an agent needs to act.
3. Open questions, unknowns, and validation findings travel with the slice so the agent sees the gaps too.
4. Provenance is preserved in the slice — the agent can tell declared facts from inferred ones.
5. The slice is compact enough to fit comfortably in a model's working context.
6. Slices are regenerable from the graph and stay current as the repo changes.
7. The slice is consumable both as a file an agent can be handed and (later) via a read-only interface.
8. Producing a slice never gives an agent a direct write path to the canonical source.

---

## JS-E3
### Share an interactive view with stakeholders

**Phase:** Iterate
**References:** [07 — Spec Studio & Projections](../docs/concept/07-spec-studio-and-projections.md)

> **When** I need a non-engineer to engage with a spec, plan, or status, **I want to** share an interactive view by link, **so I can** raise the odds they actually read and respond to it instead of ignoring a markdown file.

**Essence:** Generated, shareable, interactive views make the single source of truth legible to people who will never open the codebase.

**Acceptance criteria:**
1. A view can be published and shared by link, openable in any browser without setup.
2. The content is organised for reading — grouped, navigable, visual — not a flat wall of text.
3. Readiness, coverage, and open questions are presented so a non-engineer can grasp status quickly.
4. The view is responsive enough to read on a phone as well as a laptop.
5. The shared artifact is a faithful projection of the graph at a known commit, stamped so viewers know its provenance.
6. A stakeholder can explore relationships and impact without needing to understand the underlying code.
7. Updating the source and regenerating produces an updated shareable view with no manual rework.

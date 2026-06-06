# B — Bind Code to Intent

The job here is to connect real implementation to the spec that justifies it — by a stable ID, not by an import or a fragile filename convention. The runtime framework underneath is irrelevant to this job.

---

## JS-B1
### Mark significant code with its spec ID

**Phase:** MVP
**References:** [04 — Authoring Surfaces](../docs/concept/04-authoring-surfaces.md)

> **When** I write a class, function, route, or module that realises part of a spec, **I want to** mark it with the spec's ID right where it lives, **so I can** make the implementation self-describing without maintaining a separate mapping table.

**Essence:** A marker is a one-way pointer from code to intent. It carries identity, nothing else — no business logic, no runtime behaviour.

**Acceptance criteria:**
1. Any significant code construct can carry a marker naming the spec(s) it satisfies — regardless of the framework it's built on.
2. More than one syntactic style is available (e.g. a decorator on a class, a doc-comment on a function) so the marker never fights the code's shape.
3. The marker is metadata only: removing the extractor changes nothing about how the code runs.
4. A marker states identity and bindings (which spec, which component) — never intent, readiness, or behaviour, which belong on the spec.
5. Adding a marker is a small, local edit reviewable in the same diff as the code.
6. Forgetting a marker on a designated "significant" construct is catchable as a lint signal, not a silent gap.
7. Markers are equally legible to the extractor and to a human reading the file.

---

## JS-B2
### Link by ID so specs and code survive refactors

**Phase:** MVP
**References:** [04 — Authoring Surfaces](../docs/concept/04-authoring-surfaces.md), [03 — Graph Metamodel](../docs/concept/03-graph-metamodel.md)

> **When** I rename files, move modules, or reorganise spec folders, **I want to** keep the spec-to-code linkage intact because it's bound by stable IDs rather than file paths or imports, **so I can** refactor freely without breaking the graph.

**Essence:** Identity is a stable string, not a location. Specs never import code; code never imports specs. The ID is the only contract between them.

**Acceptance criteria:**
1. Moving or renaming a source file does not break its link to a spec, because the link is the ID.
2. Reorganising spec files does not break code that points at those specs, for the same reason.
3. Spec files and source code are decoupled — neither imports the other — and a lint rule enforces that boundary both directions.
4. A misspelled or non-existent ID reference is caught early as an error, not discovered later as a dangling edge.
5. Renaming an ID itself is a deliberate, traceable act (with an explicit supersession), never an accidental silent break.
6. The set of valid IDs is discoverable so references can be checked and autocompleted rather than guessed.
7. After any refactor, regenerating the graph yields the same linkage with no manual repair.

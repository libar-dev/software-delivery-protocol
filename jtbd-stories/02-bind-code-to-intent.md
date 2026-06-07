# B — Bind Code to Intent

The job here is to connect real implementation to the spec that justifies it — by a stable ID, not by an import or a fragile filename convention. The runtime framework underneath is irrelevant to this job; binding is framework-neutral.

---

## JS-B1
### Mark significant code with its spec ID

**Phase:** MVP
**References:** [04 — Authoring & Binding](../docs/concept/04-authoring-and-binding.md)

> **When** I write a class, function, route, or module that realises part of a spec, **I want to** anchor it to the spec's ID right where it lives, **so I can** make the implementation self-describing without maintaining a separate mapping table.

**Essence:** An anchor is a one-way pointer from code to intent. It is the anchored layer of the graph — it carries identity and structural bindings, never intent.

**Acceptance criteria:**
1. Any significant code construct can carry an anchor naming the spec(s) it `satisfies` and its `component` — regardless of the framework it is built on (no Effect/Awilix/Fastify knowledge required).
2. More than one interchangeable syntax is available (decorator on a class, JSDoc on a function, anchor-constant) so the anchor never fights the code's shape; a team picks one style.
3. The anchor is metadata only: removing the extractor changes nothing about how the code runs.
4. An anchor carries identity and structural bindings (`id`, `satisfies`, `component`, `implements`) — and is **forbidden** from carrying intent, readiness, behaviour, or verification, which live only on the spec.
5. The anchor points one way: code → spec, never spec → code; it produces **anchored**-`claim` edges, kept distinct from the `declared` relations authored on specs.
6. Adding an anchor is a small, local edit reviewable in the same diff as the code.
7. A missing anchor on a designated "significant" construct is catchable as a lint signal, so meaningful code does not silently fall out of the graph — useful, not load-bearing.

---

## JS-B2
### Link by stable ID so specs and code survive refactors

**Phase:** MVP
**References:** [04 — Authoring & Binding](../docs/concept/04-authoring-and-binding.md), [02 — Core Model](../docs/concept/02-core-model.md)

> **When** I rename files, move modules, or reorganise spec folders, **I want to** keep the spec-to-code linkage intact because it is bound by stable IDs rather than file paths or imports, **so I can** refactor freely without breaking the graph.

**Essence:** Identity is a stable string, not a location. Specs never import code; code never imports specs. The ID-in-strings is the only contract between them — which is the only thing that lets either side be refactored heavily.

**Acceptance criteria:**
1. Moving or renaming a source file does not break its link to a spec, because the link is the ID, not the path.
2. Reorganising spec files does not break code that points at those specs, for the same reason.
3. Specs and code are linked by IDs *in strings*, never by TypeScript import edges, so neither side imports the other; a lint rule can enforce that boundary both directions.
4. A misspelled or non-existent ID reference is caught at build time by referential-integrity validation — with a "did you mean…?" suggestion where possible — not discovered later as a dangling edge.
5. Renaming an ID is an ordinary repo edit that git records; any reference that now dangles surfaces as a referential-integrity error to be fixed in the same change — there is no freeze-and-supersede machinery, because the graph keeps no ID history.
6. The set of valid IDs is discoverable (and optionally surfaced as a generated `spec-ids` union for early `tsc` checks) so references can be checked and autocompleted rather than guessed.
7. After any refactor, re-running `akg build` yields the same linkage with no manual repair, because the binding never depended on location.

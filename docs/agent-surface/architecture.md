# Architecture through the graph

The architecture map should explain what the code is responsible for, which decisions shape it,
and how significant units collaborate. A component inventory alone cannot answer those questions.
Recipe 17 combines those answers from the graph. Recipe 19 follows one Spec into its planning
context; recipe 3 reads its complete law and verifier bindings.

## What carries forward from gen 1

Gen 1 made named responsibilities discoverable beside their implementations and exposed forward
and reverse dependencies through one read model. Its architecture projections grouped that graph
without maintaining another architecture document by hand. Those are useful design properties.

The comparison is grounded in `@libar-dev/architect`'s `formal-spec/10-pattern-graph.md` and
`packages/architect-projection/src/projections/_shared/architecture-graph.internal.ts`. These are
lineage evidence. The Protocol's intended truth lives in its Specs.

| Gen-1 capability | Protocol representation |
| --- | --- |
| Named responsibility and when to use it | A Spec's title, Intent, and Design section, discoverable with `g.findByConcept` |
| Code realizes a named responsibility | An anchored `satisfies` edge to the appropriate Spec kind |
| Forward and reverse collaborations | Anchored `uses` edges at component or unit grain, reversed by the query |
| Grouped architecture views | `memberOf` plus query-time aggregation, with the original unit edges retained |
| Design rationale | A declared `decidedBy` edge to a decision Spec |
| Delivery state | Stated readiness beside independently derived delivery facts |

The architectural significance ruling, `spec:decisions.architectural-significance-rides-primitives`,
keeps the existing kinds. A runtime responsibility can be a behavior, an interface a contract,
and a quality bound a constraint. A decision records a qualifying trade-off. Familiar software
design pattern names can appear in ordinary Design prose without creating a tag registry,
new kind, or `pattern:` namespace.

## Shared delivery-fact policy

Search for `shared policy` through `g.findByConcept`, then inspect
`g.specContext("spec:extraction.delivery-facts")`. Its Design section explains why the policy
belongs below extraction, validation, and the reader. Its Behavior section owns the conferral law.

In recipe 17, filter `usesEdges` by `to === "impl:protocol.delivery-facts"`. The incoming bindings
name graph derivation, the delivery-facts honesty check, and the reader. Follow `realizations`
to their Specs and inspect the declared `dependsOn` relations in `subjects`. This demonstrates
two distinct claims: source declares a code collaboration, while a Spec declares that its
semantics need the shared policy to hold. The query never derives one claim from the other.

The implementation's membership places it in the graph component. The component fan-in is a
summary; the unit edges identify the actual shared responsibility. Adding a second unit edge
between the same pair of components does not increase component fan-in.

## Runner and test-framework adapter

Search for `ports and adapters`, then inspect
`g.specContext("spec:extraction.example-runner")`. Its Design section assigns step execution
to the core and test registration and world lifecycle to the adapter.

Recipe 17 retains the unit edge from `impl:protocol.example-runner-adapter` to
`impl:protocol.example-runner`. Both realize the same behavior Spec while belonging to different
components. This is an example of one responsibility realized by collaborating units; it does
not require a separate Spec or role field for each participant.

The absence of a reverse `uses` edge is only absence of a declaration. It does not prove that
the runner has no framework import. Source and tests establish the current dependency direction;
the graph preserves the accepted architectural binding.

## One read model across carrier boundaries

Search for `one read model`, then inspect `g.specContext("spec:extraction.derive-graph")`.
Its Design section explains the common input boundary between carrier reification and graph
derivation. Its `constrainedBy` relation carries determinism, and `decidedBy` carries the
one-validation-path ruling. Recipe 17 includes both relationships in the subject's context.

This preserves gen 1's strongest organizing idea: source derives one graph and consumers read
it. Adding a carrier should not require another validator model or another projection pipeline.

## Limits to keep visible

The recipes report authored intent and anchored structure. They do not infer architecture from
imports, certify forbidden dependencies, or compute exhaustive symbol impact. Missing graph nodes
remain unresolved entries. Structural edges confer no delivery facts, and a verifier binding says
that a verifier exists, not that it passed.

The two architecture Specs retain their stated readiness. Re-run promotion preflight before a
human changes it. These examples improve the explanation and bindings of existing design; they
do not make a readiness statement on the owner's behalf.

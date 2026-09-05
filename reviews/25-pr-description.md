# Architectural responsibilities and collaborations in one graph

This PR makes the Protocol's software design discoverable through its own graph. It advances the
plan-38 architecture work with component membership, architectural dependencies, shaping decisions,
and executable graph recipes. An agent can follow a responsibility from its intended law to its
implementation, callers, and verifier bindings.

Gen 1 made named responsibilities and forward/reverse dependencies useful in everyday navigation.
This PR carries those strengths into the Protocol's existing model. Specs own intent; source
anchors bind code; graph queries group the results. No role registry or separate architecture
model is added.

## A tour of the design

**Architectural significance uses the appropriate Spec kind.** Runtime responsibilities can be
behaviors, interfaces contracts, and quality bounds constraints. Model Specs explain concepts;
decision Specs record qualifying trade-offs. The
[structural model](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/model/structural-patterns.sdp.md) and
[self-binding behavior](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/protocol/structural-self-binding.sdp.md) remain stated `defined`.

**One shared delivery-fact policy.** The
[delivery-facts Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/extraction/delivery-facts.sdp.md) owns the conferral law used by graph
derivation, validation, and the reader. Its implementation is in the graph component. Unit `uses`
edges identify all three callers; declared `dependsOn` relations explain the semantic dependence.
The Spec has a direct implementation binding and an enabled verifier binding.

**The runner and its test-framework adapter.** The
[example-runner Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/extraction/example-runner.sdp.md) explains the ports-and-adapters
split. The runner owns step execution; the Vitest adapter owns registration and world lifecycle.
Their unit collaboration is visible even though both realize the same Spec.

**Architecture queries preserve their evidence.** Recipes 17, 18, and 19 provide an architecture
map, decision map, and planning slice. The architecture map includes responsibilities and design
context, retains unit edges and their claims, and exposes the binding behind each realized Spec.
Component fan counts count distinct other components. Missing nodes remain visible as unresolved
entries. The [walkthrough](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/docs/agent-surface/architecture.md) demonstrates the shared policy,
adapter boundary, and one-read-model design using these queries.

**A census of accepted structural bindings.** The self-hosting oracle records the owner-reviewed set of
significant units. Tests check membership and the narrowly declared helper-coverage relationships.
The audit certifies the accepted set; it does not classify architectural significance from imports.

## Ratified decisions

| Ratified name | Ruling | Carrying Spec |
| --- | --- | --- |
| Architectural significance rides existing primitives, MD-34 | Appropriate Spec kinds, existing relations, and structural anchors express architecture without a new pattern vocabulary. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/architectural-significance-rides-primitives.sdp.md) |
| Source commentary never enters the graph, MD-35 | Comments confer no graph content. Shared law belongs in a Spec; the anchor constant remains the code-binding syntax. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/jsdoc-graph-extraction-refused.sdp.md) |

## Try it

In a checkout of this PR branch, install and build:

```sh
npm ci
npm run build
```

Find the shared policy and inspect its intended law:

```sh
pnpm --silent sdp:q 'return g.findByConcept("shared policy").map(n => n.id)' --json
pnpm --silent sdp:q 'return g.specContext("spec:extraction.delivery-facts")' --json
```

Inspect the accepted caller bindings:

```sh
pnpm --silent sdp:q 'return graph.edges.filter(e => e.type === "uses" && e.to === "impl:protocol.delivery-facts").map(e => ({from:e.from,to:e.to,claim:e.claim}))' --json
```

Paste recipe 17 from `docs/agent-surface/recipes.md` into `pnpm --silent sdp:q '<body>' --json`
for the full architecture map. Recipe 3 reads complete law and verifier context; recipe 19 gives
the planning neighborhood. The existing projection publishers remain frozen.

Feedback is wanted on whether the responsibility boundaries and declared dependencies explain
the design, whether the accepted significant-unit set has the right grain, and whether the two
architecture Specs are ready for a human readiness statement.

## Validation and review history

`npm run check` passed, including 878 main-suite tests and 80 CLI tests, package installation,
self-hosting checks, and preflight. Current measurements and verification are recorded in
[the software-design review](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/reviews/25-architecture-design-followup.md). Re-run the recipes rather than
inheriting earlier counts. The current graph has 164 Specs, 342 nodes, and 768 edges, including
13 components, 76 memberships, and 39 uses declarations. Validation retains the five intentional
self-hosting warnings; the worked example retains its intentional verifier-linkage warning.

The branch's earlier review and remediation records remain in git history. Commit `bbf6869`
removed the OmO directory, so the description no longer links to those files as current artifacts.
The latest review adds graph-level design demonstrations, recipe regression tests, package
coverage for the guide, and a macOS path correction in the filesystem-boundary test.

## Upcoming work

Recipe 1 is the operational backlog and currently returns no implementation work.
`spec:consumers.graph-first-planning` remains at `idea`; resume its maturation when its next
scope is selected. The two architecture Specs
remain stated `defined` until a human reviews them and states `ready`.

The six non-blocking comment-promotion questions remain candidates for individual review.
Promote shared law when it needs its own identity and binding. The projections-model Spec and
the existing readiness-divergence rows retain their current dispositions.

Durable refusals remain: a pattern kind or namespace; new role fields, relation types, query verbs,
or reader methods; manufactured decision replacement or realization edges; architecture-enforcement
validators; significance inferred from imports; exhaustive symbol impact; committed architecture
renderings; comment-prose extraction; and machine-authored readiness or delivery status.
The branch also refuses manufactured anchors on marginal helpers, blocking treatment of the six
comment-promotion questions, restrictions on lawful Spec IDs to avoid JavaScript object inheritance,
and re-tracking the runtime ledger as workflow state.

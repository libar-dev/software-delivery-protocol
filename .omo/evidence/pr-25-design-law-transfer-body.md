## What this PR opens

PR #24 left two idea-rung Specs holding the architecture question: does a vocabulary beyond `component` and `uses` pass the ADR test, and which engine units deserve graph-visible structure? This branch answers both on the existing primitives. Architectural significance is authored as decision- and model-kind Specs, existing relations, and the `satisfies` → `decidedBy` join. No `pattern` kind, no new relation types, no new reader methods.

The engine's own map becomes queryable. Import and testing join the accepted component set. Extract, graph, validate, CLI, and reader coverage widens under the same criterion: exported public surface plus cross-component reach. Three catalog recipes then read that map on demand.

## Design-law transfer

This slice records the promotion-and-retarget ruling that two reviews and the gap analysis already converged on. Source commentary never authors graph content (MD-35). The one comment that uniquely carried a multi-surface law — delivery-fact conferral — promotes into `spec:extraction.delivery-facts`; the engine JSDoc demotes to a pointer. The "every significant unit is bound" promise gains a census over the accepted set: it checks that roster's conformance, and never discovers significance. Acceptance of a unit stays a human act.

Four `decidedBy` fills that survived verify-first now join the architecture map: `spec:extraction.derive-graph` → `spec:decisions.one-validation-path`, `spec:validation.authored-honesty` → `spec:decisions.binding-not-liveness`, `spec:consumers.reader` → `spec:decisions.agent-surface-scripts-graph`, and `spec:extraction.executable-contracts` → `spec:decisions.point-per-example`. The six family-parent carriers each carry one non-blocking comment-promotion question. `spec:consumers.projections-model` stays stated `defined`.

## The new surfaces

**The ruling.** [`spec:decisions.architectural-significance-rides-primitives`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/architectural-significance-rides-primitives.sdp.md) is MD-34. Specs carrying architectural significance stay `decision` or `model`. Relationships among them stay `dependsOn`, `supersedes`, `refines`, and `decidedBy`. Code never satisfies a decision Spec. Grouping is derived from id families and the component graph, not a second Pack vocabulary.

**Commentary refused.** [`spec:decisions.jsdoc-graph-extraction-refused`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/jsdoc-graph-extraction-refused.sdp.md) is MD-35. JSDoc and doc comments author no nodes, relations, membership, delivery facts, or Spec intent. The statically reified anchor constant is the only write path from code. Law-carrying comments promote into Specs.

**The two matured Specs.** [`spec:model.structural-patterns`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/model/structural-patterns.sdp.md) and [`spec:protocol.structural-self-binding`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/protocol/structural-self-binding.sdp.md) move from `idea` to stated `defined`. Blocking questions are resolved by the ruling. A `ready` statement is still a human act; both floors already clear `ready`, and this PR does not promote them. The self-binding census checks the accepted set only.

**The delivery-facts tracer.** [`spec:extraction.delivery-facts`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/extraction/delivery-facts.sdp.md) is the worked promotion: born `ready`, bound by `impl:protocol.delivery-facts` and `test:protocol.delivery-facts`, carrying `implemented` and `has-verifier`. The parent `spec:extraction.derive-graph` keeps both facts through its remaining bindings.

**Architecture as graph queries.** Recipes 17–19 live in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/docs/agent-surface/recipes.md). Recipe 17 is the architecture map (components, members, uses, satisfied Specs, shaping decisions). Recipe 18 is the decision map (inter-decision `dependsOn` / `supersedes`, ranked by inbound fan-in). Recipe 19 is the planning slice (refinement neighborhood, bound components, verifiers, file-level entry points). The shipped projections stay frozen (MD-32); these views are derived on demand.

**Two new components.** `component:protocol.import` and `component:protocol.testing` enter the accepted set. `src/` diffs for that widening are `codeAnchor` declarations only. Design-law transfer's only `src/` change is the delivery-facts `satisfies` retarget and the demoted JSDoc.

## Ratified decisions

| Ratified name | Ruling | Carrying Spec |
|---|---|---|
| architectural significance rides existing primitives (MD-34) | Specs carrying architectural significance are linked by the existing relations, code linkage rides the satisfies → decidedBy join, and grouping is derived. No pattern vocabulary is admitted. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/architectural-significance-rides-primitives.sdp.md) |
| source commentary never enters the graph (MD-35) | JSDoc and doc comments author no graph content; the statically reified anchor constant is the only write path from code, and law-carrying comments promote into Specs. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/jsdoc-graph-extraction-refused.sdp.md) |

## Review on this branch

Bugbot found one medium defect after the earlier close: recipe 17 threw on a dangling `memberOf` the same way recipe 19 used to. The catalog body now returns null member metadata, the plan copy stays lockstep, and `test/recipes.test.ts` locks both the live member roster and the dirty-graph case. Security review found no medium-or-higher issues.

The design-law census is a conformance check over the owner-reviewed accepted set. It does not classify significance from imports or exports. Recipe 17 names only the four surviving fills above; the dropped example-runner → MD-7 candidate is not a shaping row.

## Try it

Verified against this branch:

```bash
npm ci && npm run build

# Conformance + honesty over the one graph
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity

# The ruling and the two Specs it matured
pnpm --silent sdp:q 'return ["spec:decisions.architectural-significance-rides-primitives","spec:model.structural-patterns","spec:protocol.structural-self-binding"].map((id) => { const s = g.specs().find((x) => x.id === id); return { id, stated: s && s.statedReadiness, derived: s && s.derivedReadiness }; })'

# Accepted components, now including import and testing
pnpm --silent sdp:q 'return graph.nodes.filter((n) => n.nodeType === "CodeNode" && n.id.startsWith("component:")).map((n) => n.id).sort()'

# MD-35 and the delivery-facts tracer
pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }'
```

Paste recipes 17, 18, and 19 from `docs/agent-surface/recipes.md` into `pnpm --silent sdp:q '<body>' --json`. For recipe 19, set `id` to `spec:extraction.delivery-facts` to see the tracer's implementation, verifier, and parent neighborhood.

Feedback is most wanted on three points: whether the inter-decision `dependsOn` edges still survive the "genuinely needs the other" bar, whether the two defined architecture Specs should be stated `ready` after human review, and whether dirty-graph totality (null metadata, exit 0) is the right catalog contract for recipes 17 and 19.

## Numbers

Re-derived on this branch from the worktree-local CLI after `npm run check`. Re-run the commands above rather than inheriting these: 164 Specs · 1 Pack · 177 anchors → 342 nodes · 760 edges; 13 components · 76 `memberOf` · 35 `uses`; 35 decision Specs · 14 inter-decision `dependsOn` · 0 `supersedes` · 46 `decidedBy`. Validate reports 0 errors and the 5 pinned honesty-gap warnings (`spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`). The checkout example still emits the one intentional `verifies-linkage` warning. Recipe 1 operational backlog is empty (66 ready examples and 35 ready decisions excluded; no example without a verifier).

## Upcoming work

The arc's backlog is still a graph query. Recipe 1 is empty. Recipe 11 still shows `spec:consumers.graph-first-planning` at `idea`, with the arc-boundary question open. The two architecture Specs stay at stated `defined` until a human writes `ready`. The six comment-promotion questions remain non-blocking backlog. `spec:consumers.projections-model` remains `defined`.

Durable refused list:

- A `pattern` term, kind, or `pattern:` namespace
- New relation types, anchor fields, or reader methods
- Manufactured `supersedes` edges
- An architecture-enforcement validator family
- Symbol-level blast radius (recipe 19 stays file-level)
- Committed renderings of the architecture views (MD-32)
- `ready` promotion of the two enriched architecture Specs from this PR
- JSDoc or doc-comment extraction into the graph (MD-35)
- A significance classifier derived from imports or exports
- Manufactured anchors on the three marginal helper files
- `[blocking]` comment-promotion questions on the six carriers

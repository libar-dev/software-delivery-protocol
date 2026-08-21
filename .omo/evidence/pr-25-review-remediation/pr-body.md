## What this PR delivers

PR #24 closed with two questions open. Does architectural significance need vocabulary beyond `component` and `uses`? And what happens when design law lives in source comments instead of Specs? This branch answers both, in two waves that share one theme: knowledge belongs on the Spec, because the Spec is what has readiness, review, relations, and honesty checks.

**Wave 1, architecture as graph structure.** The ruling (MD-34) is that architectural significance rides existing kinds and relations: decision- and model-kind Specs, the `satisfies` → `decidedBy` join, derived grouping. No `pattern` kind, no new relation types, no new reader methods. The engine's own map becomes real. `component:protocol.import` and `component:protocol.testing` join the accepted set, and three recipes in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/docs/agent-surface/recipes.md) turn architecture questions into `sdp q` calls.

The first version of that map failed review: trustworthy in shape, not in content. The declared `uses` layer understated real imports. Notation's true fan-in was 6; the map said 1. Significant units like `reify.ts` and `new-spec-command.ts` carried no membership at all, contradicting the universal this PR itself matured. Recipe field names collided with ratified relations (`constrainingDecisions` vs `constrainedBy`, `blastRadiusEntryPoints` vs the real `g.blastRadius`). Every claimed gap was re-measured against the actual import graph, never inherited from a reviewer's list, and fixed in `ed77ee7`: ten `uses` edges added, three machinery-only edges removed under a stated convention (value and type imports count, anchor machinery never does), three units bound, recipes renamed and hardened against dangling structure, and tests that now pin the joins directly.

**Wave 2, design-law transfer.** The probe was one file, `src/graph/delivery-facts.ts`. The graph knew its identity, its component, and its realization target. Ask what the unit guarantees and the graph had one line. The real law, ten conferral rules that the extractor, the honesty check, and the reader all depend on, lived only in the file's JSDoc. An agent reading the architecture map still had to open the file to learn the design. That is the failure mode this system exists to remove.

The lineage docs had already adjudicated this fork. v0 authoring-surfaces §2.4: markers are read-only pointers from code to spec, never the reverse. So the ruling (MD-35) refuses comment extraction outright. JSDoc and doc comments author no graph content: no nodes, no relations, no membership, no delivery facts, no intent. The statically reified anchor constant stays the only write path from code. When a comment states rules other surfaces depend on, those rules promote into a Spec, and the comment demotes to local commentary plus a pointer. The ten rules moved into [`spec:extraction.delivery-facts`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/extraction/delivery-facts.sdp.md), born `ready` and test-bound. It is the only promotion. The rest of the flagged comments became graph-visible backlog: one `[non-blocking]` question on each of six carrier Specs, queryable instead of buried in session history.

Wave 2 also gave the self-binding universal its teeth. `spec:protocol.structural-self-binding` stated that every architecturally significant unit is bound, with no verifier, so the claim was unevaluable. The v0 design had the answer: an owner-accepted significant-unit list checked mechanically. That shape is back as oracle state. A roster in `test/self-hosting-oracle/structural-edges.ts` drives a census assertion in the self-hosting suite; remove a roster row and the suite fails, naming the unit. The check polices conformance of the accepted set. It never classifies significance from imports or exports, and acceptance stays a human act.

The gen-1 comparison is worth stating plainly, because this branch is where the resemblance became real. Gen 1 put pattern knowledge in the annotation: roles, statuses, free-text uses lists. Same read spine here, annotations to one graph to projections. The inversion is in who may assert truth. The anchor says only which intent the code binds to. Status is derived. Law lives in Specs. Comments explain, and confer nothing.

**Remediation after the failed merge review.** Review at `5584ed91cf2c3efbf31ad83c28054febd0ec62b7` failed on recipe family-map totality, coarse-grain helper consumption, lost OmO ledger history, trailing-space hygiene, and publication claims. This follow-through keeps the two-wave product story and repairs those seams without changing the engine, corpus, or graph contract. Recipes 1, 11, and 18 now group lawful families (`constructor`, `toString`, `valueOf`, `hasOwnProperty`) with `Object.create(null)`. Recipe 19 has a non-empty bidirectional dependency characterization on `spec:decisions.structural-anchor-semantics`. The accepted-set census now proves each rostered `path#symbol` is a runtime export value-consumed by its covering source. Three ledger snapshots (135 + 20 + 12) live under durable evidence. The 13 proven trailing spaces are gone.

## The new surfaces

**Two ratified rulings.** [`spec:decisions.architectural-significance-rides-primitives`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/architectural-significance-rides-primitives.sdp.md) (MD-34) keeps architectural significance on existing primitives. [`spec:decisions.jsdoc-graph-extraction-refused`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/jsdoc-graph-extraction-refused.sdp.md) (MD-35) refuses comment prose as graph input. Both are answerable by graph query from now on.

**Two matured architecture Specs.** [`spec:model.structural-patterns`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/model/structural-patterns.sdp.md) and [`spec:protocol.structural-self-binding`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/protocol/structural-self-binding.sdp.md) moved from `idea` to stated `defined`. `ready` stays a human statement, and this PR does not make it.

**The delivery-facts tracer.** Born `ready`, ten rules, one implementation (`impl:protocol.delivery-facts`), one enabled verifier (`test:protocol.delivery-facts`), holding `implemented` + `has-verifier`. The engine JSDoc demoted to a pointer under exclusive promotion (MD-10). Wave 2's only `src/` change, measured from `ed77ee7` to the reviewed head, is that one `satisfies` retarget plus the demoted comment in [`src/graph/delivery-facts.ts`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/src/graph/delivery-facts.ts). The whole branch still carries the Wave 1 `codeAnchor` widening under `src/`; that is not a Wave-2 or remediation delta.

**The accepted-set census.** `test/self-hosting-graph.test.ts` census-checks every owner-reviewed significant unit against its declared membership, with coarse-grain coverage rows for the helper files that have no honest `satisfies` target. After remediation, each rostered unit must resolve as a runtime function export and be value-consumed by its covering source. `spec:protocol.structural-self-binding` gained the realization-grain rule and the census-check rule, and carries `has-verifier` while staying `defined`.

**Architecture as graph queries.** Recipes 17 (architecture map), 18 (decision map), and 19 (planning slice) are derived on demand. The MD-32 projections freeze stays intact; nothing pre-rendered is committed. A worked planning-slice fixture is [`spec:decisions.structural-anchor-semantics`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/structural-anchor-semantics.sdp.md).

**Shaping decisions on the map.** Four `decidedBy` fills survived a verify-first pass and now render on recipe 17's component rows: `derive-graph` → one-validation-path (extract), `authored-honesty` → binding-not-liveness (validate), `reader` → agent-surface-scripts-graph (reader), `executable-contracts` → point-per-example (codegen, graph). A fifth candidate, example-runner → MD-7, was dropped with its reason recorded: the ruling shaped the binding's placement, not the Spec's law.

**Glossary registration.** `CONTEXT.md` now defines "architecturally significant unit" in the ratified vocabulary.

## Ratified decisions

| Ratified name | Ruling | Carrying Spec |
|---|---|---|
| architectural significance rides existing primitives (MD-34) | Architectural significance is expressed with existing Spec kinds, relations, and the satisfies → decidedBy join; grouping is derived. No pattern vocabulary is admitted. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/architectural-significance-rides-primitives.sdp.md) |
| source commentary never enters the graph (MD-35) | JSDoc and doc comments author no graph content; the statically reified anchor constant is the only write path from code, and law-carrying comments promote into Specs. | [Spec](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/specs/decisions/jsdoc-graph-extraction-refused.sdp.md) |

## Review on this branch

Wave 1 had an independent hostile-review pass before the `ed77ee7` fix. Bugbot then found one medium defect: recipe 17 threw on a dangling `memberOf`, the same class recipe 19 used to have. The catalog body now returns null member metadata and `test/recipes.test.ts` locks both the live roster and the dirty-graph case. Security review found no medium-or-higher issues.

Wave 2 ran under per-todo failing-first evidence with independent adversarial verification of every commit, then four final reviews: plan compliance, code and corpus quality, real manual QA, and scope fidelity. All confirmed. Two plan sentences were found factually wrong during verification (one readiness expectation, one anchor-site expectation) and were corrected against evidence rather than silently satisfied. Evidence is committed under `.omo/evidence/`.

The later merge review at `5584ed91` failed. Durable mapping lives in [`.omo/evidence/pr-25-review-remediation/review-findings.md`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/.omo/evidence/pr-25-review-remediation/review-findings.md). Integrated close evidence is [`.omo/evidence/pr-25-review-remediation/final-verification.md`](https://github.com/libar-dev/software-delivery-protocol/blob/feature/architectural-patterns-views/.omo/evidence/pr-25-review-remediation/final-verification.md). This body does not claim named-model review transcripts that are not in git or GitHub review artifacts.

## Try it

These commands only produce these results on the branch. Check out `feature/architectural-patterns-views` and build first:

```bash
git fetch origin
git checkout -B feature/architectural-patterns-views origin/feature/architectural-patterns-views
git merge-base --is-ancestor 34a5440ad24e8a512e7ef2d685df2ba73c81f88d HEAD
npm ci && npm run build
```

`git checkout -B` matters: a plain `git checkout` reuses a stale local branch and stays behind the PR head, which makes every query below fail or return old values. `npm ci` may report audit findings and `tsup` prints an `import.meta` CJS warning; both predate this branch.

Expected outputs below were captured at the authoritative recovery-gated head `34a5440ad24e8a512e7ef2d685df2ba73c81f88d`. The initial Todo-7 full gate succeeded but its raw receipt was lost; one fresh recovery gate was deliberately authorized and run once at this clean exact head, and its complete output is the durable receipt. If yours differ, check `git rev-parse HEAD` and ancestry first.

Three stale signals from the same try-it queries against `origin/main` (`bb97d829eea7b3689d5d8569d307e1bb5e77fd0d`): the readiness query returns `undefined` for the two decision Specs, there are no `component:` nodes, and `g.specContext("spec:extraction.delivery-facts")` returns `undefined`; dereferencing that result causes `Cannot read properties of undefined (reading 'found')`. That is `main`, not this branch.

Conformance and honesty over the one graph:

```bash
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Between those two lines the CLI writes `generated/graph.json` and contracts, then lists the five pinned honesty/gaps warnings (`spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`).

The two rulings and the two matured Specs:

```bash
pnpm --silent sdp:q 'return ["spec:decisions.architectural-significance-rides-primitives","spec:decisions.jsdoc-graph-extraction-refused","spec:model.structural-patterns","spec:protocol.structural-self-binding"].map((id) => { const s = g.specs().find((x) => x.id === id); return { id, stated: s && s.statedReadiness, derived: s && s.derivedReadiness }; })'
```

```
[
  {
    id: 'spec:decisions.architectural-significance-rides-primitives',
    stated: 'ready',
    derived: 'ready'
  },
  {
    id: 'spec:decisions.jsdoc-graph-extraction-refused',
    stated: 'ready',
    derived: 'ready'
  },
  { id: 'spec:model.structural-patterns', stated: 'defined', derived: 'ready' },
  { id: 'spec:protocol.structural-self-binding', stated: 'defined', derived: 'ready' }
]
```

The delivery-facts tracer, ready and bound:

```bash
pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }'
```

```
{
  readiness: 'ready',
  facts: [ 'implemented', 'has-verifier' ],
  implementations: 1,
  verifiers: 1
}
```

The accepted component set, now thirteen with import and testing:

```bash
pnpm --silent sdp:q 'return graph.nodes.filter((n) => n.nodeType === "CodeNode" && n.id.startsWith("component:")).map((n) => n.id).sort()'
```

```
[
  'component:protocol.adapters',
  'component:protocol.cli',
  'component:protocol.codegen',
  'component:protocol.extract',
  'component:protocol.graph',
  'component:protocol.import',
  'component:protocol.model',
  'component:protocol.notation',
  'component:protocol.projections',
  'component:protocol.reader',
  'component:protocol.runner',
  'component:protocol.testing',
  'component:protocol.validate'
]
```

Paste recipes 17, 18, and 19 from `docs/agent-surface/recipes.md` into `pnpm --silent sdp:q '<body>' --json`. For recipe 19, set `id` to `spec:extraction.delivery-facts` to see the tracer's implementation, verifier, and parent neighborhood, or to `spec:decisions.structural-anchor-semantics` for a non-empty bidirectional `dependsOn` / `dependedOnBy` slice.

Feedback is most wanted on four points: whether the inter-decision `dependsOn` edges survive the "genuinely needs the other" bar, whether the two `defined` architecture Specs should be stated `ready` after human review, whether the census roster's owner-reviewed acceptance is the right long-term home for significance, and whether recipe family maps should stay catalog-local `Object.create(null)` rather than grow a shared helper.

## Numbers

Re-derived on the integrated tree from the worktree-local CLI during the authoritative recovery gate at `34a5440ad24e8a512e7ef2d685df2ba73c81f88d`; re-run the commands above rather than inheriting these. Full-gate history is the initial successful run whose raw receipt was lost plus the single fresh authorized recovery run at this clean head. 164 Specs · 1 Pack · 177 anchors → 342 nodes · 760 edges; 13 components · 76 `memberOf` · 35 `uses`; 35 decision Specs · 14 inter-decision `dependsOn` · 0 `supersedes` · 46 `decidedBy`; readiness 148 `ready` / 11 `defined` / 4 `idea` / 1 `scoped`. Validate reports 0 errors, the 5 pinned honesty-gap warnings, and the one intentional `verifies-linkage` example warning. Recipe 1 operational backlog is empty (66 ready examples and 35 ready decisions excluded). `npm test` from the recovery gate: 862 passed, 1 skipped; CLI suite 80 passed.

## Upcoming work

The arc's backlog stays a graph query. Recipe 1 is empty; recipe 11 still shows `spec:consumers.graph-first-planning` at `idea` with the arc-boundary question open. Re-entry: a human writes that Spec's next rung, or recipe 1 stops being empty.

The two architecture Specs stay at stated `defined` until a human writes `ready`. Re-entry: a readiness statement after review of the accepted-set census.

The six comment-promotion questions remain non-blocking backlog; each is a candidate promotion review, not committed work. Re-entry: a reviewer promotes one question into a Spec the way delivery-facts was promoted.

`spec:consumers.projections-model` remains `defined` pending its own maturation.

Durable refused list:

- A `pattern` term, kind, or `pattern:` namespace (MD-34)
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
- Rejecting lawful Spec IDs to dodge JavaScript object inheritance
- Re-tracking `.omo/start-work/ledger.jsonl` as workflow state

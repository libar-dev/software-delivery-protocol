This folder holds the v0 design documents restored verbatim with lineage headers and the annotation evidence written for the owner's anchor decisions. Start with [the short annotation context](./annotation-context.md). The [archived annotation scout](./archive-annotation-scout-2026-10-04.md) retains the detailed evidence temporarily and may be removed later. All of this is historical evidence, never intended truth. The v0 concept set was superseded 2026-06-06 by the reboot and restored from `ed5f6ad^` for the executable-verification design review, `reviews/14`. Intended truth lives in `specs/`, ratified decision Specs under `specs/decisions/`, with their names in `docs/concept/DECISIONS.md`, and current realization in `src/`; on any disagreement this folder is the stale side. Restored documents enter with a lineage header naming the superseding commit. The pre-ratification vocabulary files (`docs/concept/ubiquitous-language.md`, `docs/concept/GLOSSARY.md`) were deliberately not restored: the first was renamed to root `CONTEXT.md` (live), the second was a post-reboot intermediate it superseded.

The Protocol's prior art, `@libar-dev/architect` (a sibling `architect` checkout when present), taught the problem in production: source-first annotations, one graph as the read model, and a scriptable graph handle, the direct ancestor of `sdp q`. Its old sins, a sprawling authored tag registry, workflow gates on the lifecycle and hand-authored delivery status, are what this design deliberately rejects. Treat its shape as evidence about the problem, never as the answer.

## Reading lineage now (temporary: Specs and queries replace it)

Lineage is prose, and like all planning prose in this repository it gives way to Specs and queries. Until it goes, read it through this section: the why it still carries, a translation of its terms, and the queries that already answer most of what it holds.

### Why the Protocol exists

From [the v0 vision](./v0-design/00-vision-and-product.md), written as Libar Omni and superseded by the reboot:

- **Problem.** Requirements, architecture, decisions, acceptance criteria, tests and CI evidence sit in separate tools joined by prose links that rot, so an agent reading raw files guesses the structure. The answer that survives: structure inside the repository, not more documents beside it.
- **Kept.** One Spec enriches in place and keeps its identity, because a second artifact type copies its detail and drifts (`spec:decisions.one-primitive`, `spec:model.enrichment-lifecycle`). Intent is authored; inferred structure is advisory (`spec:extraction.claim-taxonomy`). Generated artifacts are disposable and rebuild to the same bytes (`spec:extraction.regenerability`), and an authored stand-in for a derived edge or delivery fact is refused (`spec:validation.authored-honesty`). Agents are a first-class reader (`spec:consumers.agent-surface`).

### v0 terms, translated

Translate a v0 term before you use it. For a word the table misses, its Rejected entry in the [`CONTEXT.md`](../../CONTEXT.md) Term ledger names the current one.

| v0 | Now |
|---|---|
| TypeScript DSL (`.spec.ts`) | Markdown `.sdp.md` by default; `.sdp.ts`, and `.sdp.gherkin` for behavior and example Specs, per ID: the carrier ruling (MD-18) |
| facets | sections |
| abstraction levels, initiative to contract | altitude `epic`, `feature`, `story`; domains and capabilities are Packs or projections (`spec:decisions.one-primitive`) |
| readiness `sketch` to `verified` | stated readiness `idea` to `ready` is design maturity checked against its floor; realization is the derived `implemented` and `has-verifier` (`spec:model.core-model`) |
| a passing run marks a Spec `verified` | a resolving verifier binding confers `has-verifier`; run verdicts stay in CI (`spec:observation.run-evidence`) |
| source markers and decorators on Fastify + Effect code | anchors in constant or comment form in `.ts` and `.tsx` files; decorators are not extracted (`spec:model.anchors`, the comment-form ruling (MD-36)) |
| Studio patch-back: JSON patch, codemod | a view composes scoped intent; an agent edits the carrier, git records it, the same checks run (`spec:consumers.edit-model`) |
| AI context slices, JSON-LD | the agent scripts the graph through `sdp q`; a context bundle composes one pass (`spec:consumers.context-bundle`) |
| OTel, SLSA, SBOM evidence; LikeC4, OpenAPI exports | deferred: `observed` is the deferred delivery fact (`spec:model.core-model`) |
| Libar Omni, `akg`, SpecPack | the Protocol, `sdp`, Pack |

### The design from the graph

Run these from the repository root; each answer belongs to the commit it ran at.

```bash
# The pillars: each epic's outcome and the features that refine it.
pnpm --silent sdp:q 'const feature = (id) => g.specs().find((s) => s.id === id)?.altitude === "feature"; return g.specs().filter((s) => s.altitude === "epic").map((s) => ({ epic: s.id, outcome: g.specContext(s.id).sections?.intent?.outcome, features: graph.edges.filter((e) => e.type === "refines" && e.to === s.id && feature(e.from)).map((e) => e.from) }))'
# The decisions that shape the most Specs: recipe 18, dist/recipes/18-decision-map.js.
pnpm --silent sdp:q 'const title = (id) => g.specs().find((s) => s.id === id)?.title; return (await recipes(18, {})).ranking.slice(0, 10).map((r) => `${r.fanIn} ${r.id} — ${title(r.id)}`)'
# The architecture by component and layer: recipe 17, dist/recipes/17-architecture-map.js.
pnpm --silent sdp:q 'return (await recipes(17, {})).components.map((c) => `${c.id} [${c.layer}] ${c.label}`)'
# What is still open or deferred: every Spec stated below ready.
pnpm --silent sdp:q 'return g.specs().filter((s) => s.statedReadiness !== "ready").map((s) => `${s.statedReadiness} ${s.id} — ${s.title}`)'
# Where a current word lives: recipe 6, dist/recipes/06-where-is-this-concept.js.
pnpm --silent sdp:q 'return await recipes(6, params)' --params '{"term":"patch"}'
```

### Not in the graph yet

The problem statement above and the non-goal "the membrane, not a replacement" ([concept 00](../concept/00-vision-scope-and-mvp-boundary.md), §1 and §5) have no Spec yet; `spec:protocol.delivery-record-cleanup#question.durableContent` asks where such content belongs, and that Spec removes superseded concept material once the graph holds its durable content.

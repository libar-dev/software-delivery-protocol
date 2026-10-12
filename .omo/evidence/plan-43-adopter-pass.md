# Plan 43 acceptance: a read-only design pass over libar-platform

Run 2026-10-12 by the Opus 5.5 main thread with the engine at `0ab4e3d`
(`feature/design-iteration-v0`, built `dist/`), over a local clone of libar-platform at `d310eb1`
(its main after PR 12). The adopter's own checkout was not touched: every write (the base worktree,
`generated/`) went to the clone in the session's scratch directory. The adopter still pins the
Protocol at `822aea4`; this pass runs the new engine against its unchanged corpus. Re-run rather
than inherit these numbers.

The adopter's corpus validates under the new engine with 0 errors and 12 warnings, so the arc's
grammar changes are backward compatible for it.

## What changed since the last pass, in one call

Base: `a758ba4`, the merge of round 2, the last design pass before PR 12. The base graph was built
with `sdp build` in a temporary worktree of the clone.

```sh
node <protocol>/dist/cli/sdp.js q "$(cat <protocol>/dist/recipes/35-the-design-diff.js)" \
  --params base=@<base>/generated/graph.json --params '{"pack":"pack:history-view"}' --json
```

One call, an 18 KB summary: 19 Specs in scope at the head against 12 at the base, 7 added (the
history projection, the history rebuild and its five examples), 12 changed, part by part (for
example 61 changed parts on `spec:application.rebuild`, keyed Design entries by key), the Pack
itself added with its 19 members, and 11 binding rows kept apart. No diagnostic: both graphs carry
schema 0.9.0.

## The next pass's brief in one bundle

```sh
node <protocol>/dist/cli/sdp.js q "$(cat <protocol>/dist/recipes/36-the-context-bundle.js)" \
  --params '{"pack":"pack:history-view"}' --json
```

- At the default budget of 100,000 code units the bundle returns the budget-exceeded result, as its
  Spec states: the Pack's protected content alone needs 299,106 code units, because its members
  pin 190 declarations and pinned declarations are never cut.
- At a budget of 320,000 the whole Pack fits after all five cuts: 299,106 code units, about 75,000
  tokens by the recipe's estimate. Uncut, the bundle prints about 650 KB.
- Narrowed to one perspective, the rebuild concern (8 members selected by the perspective filter,
  recipe 37, from `idPrefixes`), the bundle fits the default budget: 97,783 code units, about
  24,000 tokens, with all five cuts applied.

**Finding for the owner.** In a declaration-heavy Pack, the protected set dominates the budget. A
whole-Pack brief needs a budget near 300,000 code units or a perspective subset. A later ruling
could let a caller reduce pinned declarations to their addresses, which the owner's protected list
refuses today.

## Open questions with deciders and triggers

The register (recipe 20) reads 166 questions, 10 blocking, all 10 holds and no deferral, because
the adopter has authored no question field yet; its deciders, sources and provisional readings
still live in `design/decisions/register.json`. Moving them onto the questions is the adopter's
authoring after it re-pins.

## Curation candidates over the adopter's source

Imports file built in the clone with
`{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src", "example", "harness", "fixture"] }`,
then the curation report (recipe 40) with `--params imports=@generated/imports.json`:

- 166 files, 898 import edges, 93 files no anchor covers, ranked by fan-in. The top one is
  `src/context/text.ts`, imported by 44 files.
- 10 anchored `uses` edges whose components share no import, for example
  `component:platform.gate -> component:platform.audit` and
  `component:platform.operations -> component:platform.kernel`.
- 2 imports between anchored components that no `uses` states:
  `example.inventory-context -> example.orders-domain` and
  `example.orders-context -> example.inventory-domain`, two imports each, across bounded contexts.
- No unrealized component design.

**Finding.** The adapter configuration has no exclusion, so generated Convex files
(`fixture/convex/_generated/*.d.ts`) rank among the load-bearing files. A follow-up could add an
`exclude` list to the adapter configuration, in root-relative prefixes like `--exclude`.

## Design backlog

Recipe 33: 80 Specs stated `defined` that no code realizes, by family (facts 22, laws 12,
application 10, constraints 8, obligations 8, among others), 19 of them referenced by code.

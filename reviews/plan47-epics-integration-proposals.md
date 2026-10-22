# Lane E integration proposals after review

These are exact replacements or insertions for files outside lane E's edit scope. They are
proposals, not applied changes. Navigation must be reconciled with lanes R and S before build.
The capability-kind wording awaits the owner at
`spec:consumers.capability-map.epic-kinds#question.epicKinds`.

## Studio lens contract

In `specs/consumers/spec-studio.lenses.sdp.md`, replace the title, narrative, outcome,
`#rule.order` and `#ui.lensPages`, respectively, with:

```md
# Five lenses read the graph as Packs, capabilities, architecture, tests and evidence

Each lens is a page with a Spec of its own, so each builds on the graph it reads today: the Packs, capabilities, architecture and tests lenses read what the graph records, and the evidence lens reads not tracked until the graph records an observation. This Spec keeps what the five share.

- outcome: Let a person see the graph five ways, by Pack, by capability, by architecture, by verification and by evidence, from one top navigation.

- rule: [#order] The lenses are pages of the page set, reached from the top navigation in the order Packs, capabilities, architecture, tests, evidence; the index page is the Packs lens and the default landing page.

- lensPages: `index.html` for the Packs lens, `capabilities.html` for the capabilities lens, `architecture.html`, `tests.html` and `evidence.html`, each opening with its name and one sentence saying what it reads.
```

The location is UI, not Design as the review called it. If another lane adds a lens, adjust the
number and enumeration together at integration; keep Capabilities immediately after Packs.

In `specs/consumers/spec-studio.index-page.sdp.md`, replace `#rule.filters` with:

```md
- rule: [#filters] Filters narrow the Specs section by kind, altitude, stated rung, floor reached, implementation binding, verifier binding, Pack and epic; each filter takes one value or any, the epic filter also takes no epic, the filters combine, and the section says how many of its rows it shows. Without script every row shows.
```

In `specs/consumers/spec-studio.data.sdp.md`, replace `#rule.readerValues` with:

```md
- rule: [#readerValues] The build renders the index from `specs()`, `packs()`, `findings()`, each Spec's design columns and the epic memberships recipe 52 answers, a Pack page from `packContext` and the Pack totals, a Spec page from `specContext`, and the search page from the search index; every page's rail renders the rail values. A page states no value the reader did not return or a named recipe did not answer, apart from counts the build takes of those values.
```

In `specs/consumers/spec-studio.data.recipe-answers.sdp.md`, replace the two Design entries with:

```md
- recipeEvaluations: a build evaluates each of these once, with no parameter unless one is named: recipes 17, 20, 24, 31, 33, 43, 44, 46 and 51; recipe 52 with `{ detail: true }`; recipe 29 with `{ pack: id }` for every Pack; recipe 21 with `{ spec: id }` and recipe 30 with `{ specs: [id] }` for every Spec; recipe 34 with `{ spec: id }` for every Spec that is not an example, Specs in no Pack included; given a base graph, recipe 35 with `{ base, detail: true }`, and with `{ base, pack: id, detail: true }` for every Pack; given run records, recipe 45 with `{ runs }`.
- pageRecipes: the index renders reader values and each Spec's `epicIds` from recipe 52; the glossary renders reader values only; the capabilities lens renders recipe 52; the architecture lens renders recipes 17 and 43; the tests lens renders every recipe 34 answer, recipe 44, and recipe 45 given run records; a Spec page renders its recipe 21, 30 and 34 answers, its own space from recipe 44, the recipe 51 rows that cite its entries, the recipe 45 files whose `specs` hold its id, and its own row of recipe 35's whole-corpus answer; a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer; the registers render recipes 20, 31, 24 beside recipe 51's rows, and 33; the owner queue renders recipe 46; the diff page renders recipe 35's whole-corpus answer; the runs page renders recipe 45; an export renders the values of the pages it holds.
```

In `specs/consumers/spec-studio.lenses.packs.sdp.md`, replace the narrative before Intent and
`#rule.packGrouping`, respectively, with:

```md
Packs collect Specs for review, while the separate Capabilities page reads authored refinement. The index remains the landing page and keeps each Pack's members in authored order.

- rule: [#packGrouping] The Packs lens groups Specs by Pack, each Pack's members in authored order. The separate Capabilities page reads refinement; selecting an epic narrows the index's Specs section without changing any Pack.
```

## Shared drawing contract, lane G

In `specs/consumers/spec-studio.diagram-kinds.capability-tree.sdp.md`, replace the placement
sentence in `#rule.multipleParents` with:

```md
Place a node where the capability page's disclosure order first visits it (`spec:consumers.spec-studio.capability-map-page#design.disclosureOrder`).
```

Use `unreached` everywhere this drawing calls the same map section `unplaced`. If the drawing
Spec does not already declare a relation to the page, add this dependency so the checked
mention has a truthful relation:

```yaml
    - target: spec:consumers.spec-studio.capability-map-page
      reason: the drawing and complete text use the page's disclosure order
```

Keep E's first-visit depth-first walk with children in id order. The recipe returns unique
nodes and edges; it owns no drawing occurrences. The page and G's drawing own occurrence placement.

## Glossary, subject to the owner's capability-kind decision

In `CONTEXT.md`, replace the `capability / domain` row after ratification, while the map is
still unbuilt, with:

```md
| **capability / domain** | a **`Pack` grouping** and/or a designed-for Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct, and the Capability Map is not yet built (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

At implementation close, replace that row with:

```md
| **capability / domain** | a **`Pack` grouping** and/or a Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

`rollup`, `unreached`, `repeat` and `nested epic` remain ordinary descriptive words with their
meaning in the carrying entries. They introduce no primitive, descriptor or glossary row.
The decision child is a proposed ruling, not a ratified registry entry; no DECISIONS.md row is
proposed before the owner decides whether to ratify it.

## Upgrade guide

In `docs/agent-surface/upgrade-guide.md`, insert before `Propose and apply rule keys` when
recipe 52 ships:

````md
## Organize features in epics

Here a capability is one of your corpus's own intended outcomes, not a Protocol capability
that capability adoption counts. Read the capability-map summary before choosing new parents:

```sh
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/52-the-capability-map.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/07-readiness-divergence.js)" --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/11-the-lower-ladder.js)" --json
```

Pass `--params '{"detail":true}'` for the complete map, or combine it with `epic` to read one
epic. Inspect `damage` and `cycles`; a refused parameter returns `diagnostics` without a map.

An epic states an enduring intended outcome. When an existing hub already owns that outcome,
change its altitude to `epic` and preserve its id, kind and intent. Author a new epic only when
no existing Spec owns the outcome. Choose parents by reading intended truth; paths, Pack
membership and dependencies do not establish refinement.

Keep genuine intermediate parents and multiple-parent relationships. A capability map can show
an epic inside another epic. Examples and decisions remain visible, and descendant counts do
not confer readiness or delivery facts on their parent.

Before reparenting a ready Spec, run promotion preflight, recipe 9, for the proposed parent.
That parent must state at least `defined` and clear its floor. Preserve existing readiness
statements that remain supported; the map never states a rung for you.

Review the carrier diff, validate, then re-run recipes 7, 11 and 52. Compare every previously
ready Spec's floor. Read the Studio's Capabilities page and use its Epic filter to inspect the
new scope. Unreached Specs are information, not a requirement to invent a parent. A single
broad epic is lawful; divide it only when the intended outcomes warrant separate identities.
````

## Recipe catalog and Studio skill

Append to `docs/agent-surface/recipes.md` and its index when the body ships as
`dist/recipes/52-the-capability-map.js`:

```md
## 52. The capability map

Read every epic and its distinct refinement descendants, or pass `params.epic` to select one
epic and its descendants. Every kind participates. The default summary keeps every total,
each epic's title, direct epic parents and rollup, unreached ids, cycles and damage. `leftOut`
names what `detail: true` adds: node rows, edges, descendant ids and unreached roots.
A parameter refusal returns `diagnostics` without a map; unknown names return `unknownParams`
and `accepts`. Inspect `damage` and `cycles` on a returned map.
The contract is `spec:consumers.capability-map#design.mapRecipe` through its keyed answer entries.
```

Add this index row in recipe-number order:

```md
| 52 | The capability map | `epic`, `detail` | Read capability epics, distinct descendants and direct binding evidence. |
```

Insert in `.agents/skills/sdp-studio/SKILL.md`, in `Read the pages by task` after the index row:

```md
| Read the corpus capability by capability, then narrow the Specs to one epic | `capabilities.html`, the capabilities lens (recipe 52) |
```

## Arc Pack membership

In `specs/roadmaps-and-slices.pack.sdp.md`, insert the new decision immediately after
`spec:consumers.capability-map` and the new executable epic immediately after
`spec:protocol.capability-epics`, respectively:

```yaml
  - spec:consumers.capability-map.epic-kinds
```

```yaml
  - spec:extraction.executable-examples
```

Do not insert the existing re-altituded hubs. Recipe 35 from base `44e62ef` shows their changed
coordinates without adding large ready rows to the arc's Pack design. In the PR, render the
coordinate changes and separate the delegated rulings from the capability-kind decision.

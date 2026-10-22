# Plan 46, close lane S6

The five Studio rulings are implemented on `lane/46-s6-polish`. The carriers and their oracle
entries changed together. Existing bindings continue to satisfy the amended promises; no new
example identity, anchor or delivery fact was authored. The graph query at close reports every
target stated `ready`, every target's floor `ready`, and an empty drift alarm.

| Item | Regression that failed before the fix | Implementation commit |
| --- | --- | --- |
| Phone layout | `test/studio-s5.test.ts`: `contains phone navigation, stamp and wide tables within the viewport`, parsed CSS | `99d1a8a` |
| Maturity map | `test/studio-s2.test.ts`: `places resolved Pack members in stated/floor cells in authored order` and `keeps the maturity heading and axis explanations inside the embeddable element` | `55aa232` |
| Runs and table words | `test/studio-s4.test.ts`: `formats external run durations to at most two decimals on every page`; `test/studio-s5.test.ts`: `keeps table headers and one-word cells intact while allowing word-boundary wrapping` | `a5e2c5c` |
| Diagram labels and fit | `test/studio-s1.test.ts`: `names a single edge relation once in the legend and preserves its text equivalent`; `test/studio-s5.test.ts`: `fits diagrams to their container on first view at desktop and phone widths` | `2b56b61` |
| Rule-key diff | `test/recipes.test.ts`: `reports text-preserving rule and flow key changes apart from rewording`; `test/studio-s3.test.ts`: `renders a keying proposal as one line per keyed entry and readable changed rule text`, plus `renders changed list values as lists instead of raw JSON arrays` | `ec55392` |
| Planned-use confirmation | `test/studio-s1.test.ts`: `names solid and planned uses once without repeating edge labels` | `3dbc328` |

The corrected page probes were also run against the prior renderer: the keying probe failed on
missing old/new addresses, and the list probe failed on the raw JSON array. The regression
suites now assert the resulting text. Recipe 35's catalog sample is compared with the probe's
answer. The older iteration tests now expect rule moves and individual anonymous entries under
the amended contract. The final probes for a simultaneous key rename and rewording, and for
retaining the rule/flow label in readable values, each failed before their fixes.

## Carrying Specs and bindings

All listed edges are existing `satisfies` bindings. The promise pass read the changed rules,
Design and UI entries through recipe 35 and checked the units together against the whole Spec.

| Spec | Realizing anchors relevant to this change |
| --- | --- |
| `consumers.spec-studio.responsive` | `impl:protocol.studio-frame`, `impl:protocol.studio-diagram-element`; the frame's shipped CSS contains the wrapping and scroll rules |
| `consumers.spec-studio.pack-page.maturity-map` | `impl:protocol.studio-maturity-map` |
| `consumers.spec-studio.components` | `impl:protocol.studio-maturity-map`, within the existing component's realizing units |
| `consumers.spec-studio.runs-page` | `impl:protocol.studio-run-rows`, `impl:protocol.studio-runs-page` |
| `observation.run-evidence` | `impl:protocol.run-evidence-recipe`, `impl:protocol.studio-runs-page`; recorded durations retain their precision |
| `consumers.spec-studio.diagrams` | `impl:protocol.studio-diagrams`, with the existing architecture, relation and diagram-element units |
| `consumers.design-diff` | `impl:protocol.design-diff-recipe`, the catalog realization bound by `test/iteration-recipes.test.ts` |
| `consumers.spec-studio.diff-page` | `impl:protocol.studio-diff` |

The diagram unit keeps its existing `references` to the renderer and build-rendering decisions.
No readiness statement changed and no additional example needed a registrar.

## What the pages show

The [five captures](assets/plan46-s6/README.md) record the final visual confirmation. The Pack's
desktop layout keeps its rail and member links. At 390 pixels, its navigation, stamp, ids and
summary wrap within the column, as the PR 33 reading column did. The maturity map's caption
explains its axes, its empty cells show only `—`, and its wide columns scroll locally.

The architecture overview fits the column on first view and has no repeated edge labels. Its
legend says `Arrows: uses. Dashed arrows: plans to use.` The planned component stays dashed and
labelled, and every edge remains in the text equivalent. Drawings with distinct relations keep
their relation bands and edge labels; the existing pan, zoom and pinch behavior stays bound.

The runs page shows `2.84 ms` and `0.46 ms`, intact headers and result words, and the external-file
evidence labels. The diff page shows the proposal's unchanged wording as individual `keyed`
lines with `Base: none` and the new address. The two-rule probe also rewords one rule and shows
that rule's base and current text separately. Other changed list values render as lists, and a rule moved to a flow keeps that owning list visible. A key renamed while its wording changes also reports one text change.

## Measurements and gate

Re-run these checks rather than inheriting the measurements:

- Rebuild the platform copy twice with the commands beside the captures. All 271 generated files,
  excluding the separately published stamp, had identical SHA-256 digests.
- In headless Chrome at 390 × 1600, visit every generated reading page with script execution
  disabled, excluding search, which requires script. All 268 pages, exports included, had
  `document.documentElement.scrollWidth <= innerWidth`. There were no requests outside the
  local page set during the capture and scan. The phone Pack's maturity table had 351 CSS pixels
  available and 792 pixels of content inside its own scrolling container.
- Run `pnpm --silent sdp:q 'return recipes(2)' --json` for the drift alarm and recipe 35 with a
  saved base graph for the amended entries. Run `g.specContext(id)` for each target's current
  readiness and bindings.
- Run `npm run check` and `npm run typecheck` at the lane head. The final gate result is green.

## Spec readings

Solid `uses` and dashed `plans to use` are the same use relation with different realization.
The first visual pass exposed their repeated labels on the adopter's overview; the carrier and
oracle now state that reading explicitly, and a regression preserves the planned wording in
both the legend and text equivalent. No question remains open for this lane.

Nothing from the brief is left unbuilt. The integration checkout, other lanes, the source
platform repository and `.omo/` were left alone. No push or merge was performed.

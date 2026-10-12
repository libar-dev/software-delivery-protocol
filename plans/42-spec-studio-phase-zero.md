# Plan 42. The Spec Studio, phase 0: a read-only static view

> **Status:** DRAFTED on `feature/design-management-v0`, after plan 41's fold. A thin lineage
> pointer: the Studio's intent lives in `pack:spec-studio-v1`, and its readiness, open questions and
> backlog are read from the graph (recipes 1, 9, 11, 20, 29), never from this file. If this file and
> the graph disagree, the graph wins and this file is stale.

## Why

The owner ruled the Studio's re-entry on 2026-10-12, on the PR 30 ruling sheet:

- **The reader.** A person in the repository who designs a capability ahead of its code, and a
  pull request reviewer who has only a link. The Markdown Design Review serves neither well: its
  Pack page is a 13-column table, and its pages cannot be searched or filtered. The adopter's
  reviewers read carrier files instead (`libar-platform/docs/feedback/sdp-feedback-01.md` and
  `-02.md`, items 36 to 40).
- **The measure.** The adopter's five reader tasks, completed from the Studio page set and the
  files it links to, as in the adopter's own trial: find the
  history contract, locate OD-157, explain the aggregate dependency, find one declaration's type
  comparison, and say whether a paused-rebuild example has native-backend evidence.
- **The home.** The read-only Studio ships in `@libar-dev/software-delivery-protocol`; hosted
  collaboration may later live under `@libar-ai/`.
- **Its place.** It stands beside the Markdown Design Review, which stays frozen and stays the
  surface agents, diffs and GitHub read.
- **Its stamp.** The page set carries no commit or time. A publishing step writes one stamp file
  beside it, and the shell shows it when present.

Plan 41 built what phase 0 renders: the Pack design on the reader's Pack context, design columns
on the Spec context, entry lines in the location table, and recipes 29 to 32.

## What phase 0 is

A new projection root, `sdp studio [--root] [--exclude] [--out DIR]`, writing
`generated/spec-studio/` from reader values:

- **Index.** Every Spec and Pack, filtered by kind, altitude, stated rung, floor reached, delivery
  facts and Pack, with search.
- **Pack page.** The Pack design (recipe 29's value) as member cards in authored order, each with
  its stated rung, floor, what holds it below the next rung, design columns, open questions with
  their addresses and lines, and bindings; then the boundary and the code that answers to the Pack.
  Collapsible sections replace the Markdown page's wide table.
- **Spec page.** One Spec's sections in authored order, with an anchor per entry address
  (`#design.<key>`, `#ui.<key>`, `#question.<key>`), relations both ways, bindings in binding
  language, and the stated rung beside the floor.
- **Search.** The build writes an index from the reader's concept fields, entry keys, pinned
  declarations and file paths (adopter item 14). The page matches with the reader's own matching
  code, bundled for the browser, so page search and `findByConcept` share one implementation.

Constraints: opens from `file://` with no network request; two builds of one graph are
byte-identical; the page computes no join, claim, fact or floor; keyboard navigation, text beside
every color, readable line lengths and a phone layout (`spec:consumers.spec-studio.responsive`).
Custom elements without a framework (`spec:decisions.studio-web-components`).

Later phases, each its own arc: the `--watch` live view and a one-file Pack export; PR previews
with the stamp file; run evidence once `spec:observation.run-evidence` is built; diagrams once
`spec:consumers.spec-studio.components#question.embeddedDiagrams` is ruled; the composing panel.

## The design pass first

The Studio's Specs describe the whole Studio, so phase 0's code could not satisfy them whole. An
Opus 5.5 design pass, before any code:

1. **Split for honest binding.** Give phase 0's pages their own child Specs (the Studio's Pack page,
   index and search at least), so the code satisfies whole Specs and references the parents.
   Deferred panels and lenses stay in their current Specs.
2. **Settle phase 0's open questions as UI and rules.** At least `shell#searchTags`,
   `shell#recentEdits`, `shell#railHarnesses`, `spec-page#headerFields`, `spec-page#rungColors`,
   `spec-page#questionMetadata`, `lenses#capabilityGrouping` and `data#aiSlices`. Each answer goes to
   the owner as a recommendation, as on the ruling sheet.
3. **Prototype the Pack page on real data.** One static page over recipe 29's output for
   `pack:design-management-v1` and the adopter's `pack:history-view`, for the owner to react to
   before the templates are fixed.
4. **The data and element contracts.** The data file shapes (`spec:consumers.spec-studio.data`),
   the element names and attributes for phase 0, and the CLI verb's flags, stated in their Specs.
5. **Make the five tasks answerable from the graph.** Two associations the tasks need live outside
   the adopter's graph today (gpt-6-astra, reviewing plan 41's fold). The register id OD-157 maps
   to `spec:application.history-rebuild#question.verifyPassUnderPause` only in
   `design/decisions/register.json`. The type-comparison suite `tests/types/pinned.test-d.ts`
   checks `spec:application.history-projection#design.typeHistoryEvent` with no test anchor, so
   the Spec shows no verifier. A Studio that renders graph values cannot supply either. Recommend
   lawful homes the graph already reads, both adopter authoring: the register id in the
   question's text, and a `specTest` anchor on the suite verifying the Spec. The adopter applies
   them when it re-pins.

The owner states `ready` on the phase 0 Specs; building starts from those statements.

## Build lanes (after the statements)

| Lane | Model | Builds |
| --- | --- | --- |
| S1 data and verb | gpt-6.1-sol | `sdp studio`, the data writer, determinism and `file://` tests. |
| S2 pages | gpt-6.1-sol | Page templates against the UI entries the design pass wrote. |
| S3 elements | gpt-6.1-sol | Filter, search and collapse elements; the bundled matcher. |
| Review | gpt-6-astra | An adversarial review of the branch. |
| Acceptance | gpt-6-astra | The five reader tasks over a Studio build of libar-platform, read-only. |

Opus 5.5 reviews the pages' copy and the element APIs against the design pass during the build.

## Acceptance criteria

- An Astra job given only the Studio page set built from libar-platform, and the files it links to,
  completes the five reader tasks once the two associations above are in the adopter's graph, and
  its notes name where it got stuck.
- Two renders of one graph are byte-identical; the pages open from `file://` with no network
  request; validation findings show as data on the pages that carry them.
- The Markdown Design Review, census, Mermaid and Gherkin projections are unchanged.
- `npm run check` passes.

## Refused

- A second graph in the page, or any join, claim, fact or floor computed in the browser.
- Writing to canonical source from the page; a pull request opened from the page.
- A commit, time or run identity inside the page set.
- A framework; a CDN or any network fetch.
- HTML replacing the Markdown Design Review, or reshaping a frozen projection.

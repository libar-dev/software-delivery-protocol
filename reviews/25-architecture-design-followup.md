# PR 25 software-design review

Reviewed the active PR at `bbf68692871ec8f851bef8e2de305b47f94ce9e2`, on
`feature/architectural-patterns-views`. The workspace was clean at entry. Gen-1 comparison used
the sibling `architect` checkout at `854f4a75936dda043d3683a977be0eeee4ade655`.

This is an execution review authorized by the owner's request to improve the active PR.
Plan 38 remains the current drafted arc; plan 37 records the settled implementation.
The existing deletion of `.omo/` state belongs to the reviewed baseline and was not reversed.

## Findings and changes

| Finding | Improvement |
| --- | --- |
| P1: The architectural-significance ruling admitted only model and decision kinds, contradicting the PR's behavior-kind delivery-facts example and the one-primitive design. | Corrected the ruling and structural model to choose the kind of truth. No new kind, role field, or namespace. Aligned the significance criterion's conjunction with the glossary's existing "or". |
| P2: Component aggregation erased the participating units and their claims. The delivery-facts tracer had no incoming unit `uses` edges, so its shared-policy design was not demonstrated structurally. | Added three caller bindings and one adapter-to-runner binding. Recipe 17 retains original unit edges and per-unit realization bindings. The existing component fan counts remain distinct-neighbor counts. |
| P2: The architecture map listed Spec IDs but could not explain responsibilities or expose their quality constraints without another join. | Added deduplicated subject context with titles, kinds, outcomes, Design descriptions, and outgoing relations with claims and resolution. The shared policy, ports-and-adapters split, and one-read-model boundary are searchable in their existing Specs. |
| P2: A valid collaboration inside one component counted that component as its own dependency. | Excluded local edges from component fan counts while retaining the original edge and claim. A synthetic graph tests this case. |
| P2: The shared policy's callers had no declared semantic dependency on it. The source-commentary ruling shaped no subject in the decision map. | Added the three `dependsOn` relations to delivery-facts and `anchors decidedBy jsdoc-graph-extraction-refused`. The dependency follows a shared law, not scheduling or an import inferred as intent. |
| P2: A filesystem-boundary test did not perform its injected swap on macOS temporary-directory aliases. | Canonicalized that test's temporary root and asserted that the swap occurred. Product filesystem behavior is unchanged. |

The guide at `docs/agent-surface/architecture.md` records the gen-1 comparison and explains how to
inspect each example through the existing recipes. It ships with the recipe catalog and is
checked by the installed-package smoke test. The graph remains the read model; the guide is a
walkthrough, not a hand-maintained architecture snapshot.

The new relationships bind responsibilities already implemented by the code. They add no runtime
behavior, no architecture validator, and no reader method. All stated readiness remains unchanged.

## Verification

The focused architecture, self-hosting, and structural-coverage suites passed all 86 tests.
New regressions cover the shared-policy callers, adapter direction, searchable design context,
constraint visibility, claim preservation, component fan counts, and unresolved subjects.

The first full gate caught the missing packaged-guide expectation and the macOS test defect.
Both were corrected before the final gate. `npm run check` then passed in full: lint, formatting,
build, generation, both typechecks, 878 main-suite tests, 80 CLI tests, self-hosting gates,
projection freshness checks, and preflight. The raw workspace-local receipt is
`/tmp/pr25-design-check-final.log`. `git diff --check` also passed.

Fresh graph measurements: 164 Specs, 342 nodes, 768 edges, 13 components, 76 `memberOf`, and
39 `uses`. Validation reports zero errors and the five pinned `honesty/gaps` warnings.
Recipe 1 is empty. Recipe 2 still reports the three existing stated-`defined` implementation
bindings on projections-model, regenerability, and core-model. The two architecture Specs remain
stated `defined` with derived `ready`. Re-run the recipes rather than inheriting these numbers.

## Publication follow-through

`reviews/25-pr-description.md` is a prepared replacement description for the updated PR. It leads
with the design, removes the destructive `git checkout -B` instructions, and replaces links to
deleted review evidence with commit-history references. It describes the updated workspace and
should accompany publication of these changes. The initial review left the changes local; the
owner subsequently authorized committing, pushing, polishing the PR, and merging after checks pass.
The pre-publication re-run of `npm run check` passed with the same 878 main-suite and 80 CLI
tests; its workspace-local receipt is `/tmp/pr25-merge-check.log`.

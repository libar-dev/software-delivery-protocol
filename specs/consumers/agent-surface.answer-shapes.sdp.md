---
id: spec:consumers.agent-surface.answer-shapes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  dependsOn:
    - spec:consumers.agent-surface.design-recipes
    - target: spec:consumers.agent-surface.evaluation-sink
      reason: a caller runs a shipped body, and wraps it in its own body, through the evaluation sink
---
# Recipe answers fit an agent's context and explain their misses

A usability trial gave agents only the skills, the recipe catalog and `sdp q` and a fixed set of delivery questions. Every answer was reachable without opening a carrier or source file. The agents repeatedly met oversized answers, unexplained misses, ambiguous next-rung labels and fields whose names overstated the relations they reported.

## Intent

- actor: An agent answering a delivery question through the catalog recipes.
- problem: An agent spends calls trimming oversized answers, decoding terse misses and writing the same missing body, and can repeat a recipe's label as fact when the label says more than the graph does.
- outcome: Let an agent get each answer in one call that fits its context, with every miss explained.

## Behavior

- rule: Changed-file impact, Pack design, design diff, the design slice and the law a Spec rests on, recipes 4, 29, 35, 54 and 56, accept `detail: true` and default to summaries preserving every total and explicitly naming omitted detail.
- rule: The guarantees recipe (recipe 3) returns each section's entries as the Spec states them and the binding fields the Spec context carries, not only the names of the sections.
- rule: The orphans and gaps recipe (recipe 8) reports each kind the verifier-gap signal exempts and how many ready Specs it exempts, as the build backlog reports its exclusions.
- rule: A design-backlog recipe lists the Specs stated `defined` that no code realizes, with their design columns, excluding examples and decisions as the build backlog does.
- rule: [#floorNotEvaluated] A recipe that reports a Spec's floor reached reports `not evaluated`, never `none`, for a Spec over whose unratified kind or altitude the reader evaluates no floor, with no stated next rung and no unmet clause; readiness divergence leaves such a Spec out, and a count by floor reached counts it under a `not evaluated` key, present only when such a Spec is counted.
- rule: The catalog opens with an index that sorts every recipe into exactly one of a small set of categories, one row per recipe, and shows how to run a shipped body inside a caller's own body to filter its answer.

## Design

- detailParameter: recipes 4, 29, 35, 54 and 56 read `params.detail`, absent or `false` for the summary and `true` for every row in full; recipe 29's and recipe 54's `detail` may also be a list of member ids, which returns full rows for those members and summary rows for the rest of the Pack, and an id that is not a member is a diagnostic in the result. A summary keeps `totals` as the full answer counts them and adds `leftOut`, one line for each kind of detail it omits.
- impactSummary: `{ changedFiles, totals, impactedSpecs: [id], impactedPacks: [id], atRisk: { incomingSpecs: [id], outgoingSpecs: [id], other: [id] }, coverageUnknownFiles, unlinkedUnits: [id], leftOut }` is recipe 4's summary. Incoming and outgoing name the connecting edge's direction relative to the impacted node and assert no dependency, since the edge may be any type; a Spec reached both ways is listed in both, and `other` holds the at-risk nodes that are not Specs.
- impactDetail: With `detail: true`, recipe 4 returns full rows and reasons; every at-risk reason carries `direction`, `incoming` or `outgoing`, relative to its impacted end.
- packDesignSummary: `{ id, specKind, statedReadiness, floorReached, statedNextRung, holds: [{ clauseId, targets: [id] }], openQuestions, blockingQuestions, implementedBy, referencedBy }` is recipe 29's summary row, with counts for the last four; the summary's boundary lists ids per direction, and `totals` is unchanged. `holds` is the summary of `statedNextRungFailures`, retaining each `clauseId` and target ids.
- guaranteeShape: Recipe 3 returns its narrative, null when it has none, and `sections` as the graph holds them, `designColumns`, `packs`, `implementations` and `references` in recipe 29's unit shape, with id, file, line, role and component with its layer and context, plus each verifier with its `line`, relations with claims and reasons, and findings.
- gapExemptions: Recipe 8 returns `exemptions` as `{ validatorId, exemptKind, readySpecs }`, one row for each exempt kind, and `leftOut` when more signals exist than the 25 listed.
- preflightRungs: The Spec context carries `statedNextRung` when one exists and `statedNextRungFailures`; promotion preflight reads those fields and the floor's next rung without computing a floor, and renders a missing next rung as null.
- designBacklog: recipe 33, the design backlog, takes no parameter and returns `{ totals: { specs, byFamily, excludedExamples, excludedDecisions, withReferences }, rows }`, each row `{ id, specKind, altitude, floorReached, statedNextRungFailures: [clauseId], design: { entries, declarations, openQuestions, blockingQuestions }, referencedBy, packs }`, sorted by id.
- catalogIndex: the catalog opens with its index before the contract: one `###` heading per category, and under it a table of that category's recipes, each row giving the recipe's number, name, parameters and a one-line use that may name a recipe it pairs with; every recipe has exactly one row, in one category; the build writes one file per body and none for the index.
- wrapIdiom: to filter a shipped answer, the caller calls the recipe through the `recipes` binding with only the recipe's own parameters, `const answer = await recipes(<number>, { <the recipe's own parameters> });`, inside its own body, and returns a filtered value, so the caller's own parameters never reach the recipe as names it does not take and the shipped body is never inlined into the caller's; the catalog shows the shell form and states that the caller's part must hold no shell expansion.

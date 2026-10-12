---
id: spec:consumers.agent-surface.answer-shapes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  dependsOn: spec:consumers.agent-surface.design-recipes
---
# Recipe answers fit an agent's context and explain their misses

Three agents of two model families, gpt-6.1-sol, Opus 5.5 and gpt-6-astra, tried the agent surface with only the skills, the recipe catalog and `sdp q`. Each answered the same thirteen delivery questions correctly, without opening a carrier or source file. They stumbled in the same places: answers too large for a tool's output, misses that named no reason, two meanings of the next rung, a recipe whose title promised more than it returned, and one label all three believed though it overstated the relation it read (`.omo/evidence/agent-surface-trial/`). The owner accepted the fixes as one arc's scope.

## Intent

- actor: An agent answering a delivery question through the catalog recipes.
- problem: An agent spends calls trimming oversized answers, decoding terse misses and writing the same missing body, and can repeat a recipe's label as fact when the label says more than the graph does.
- outcome: Let an agent get each answer in one call that fits its context, with every miss explained.

## Behavior

- rule: A recipe whose full answer can run past a few hundred lines takes a `detail` parameter and by default returns a summary that keeps every total and names what it left out; changed-file impact (recipe 4) and Pack design (recipe 29) take it first.
- rule: The guarantees recipe (recipe 3) returns each section's entries as the Spec states them and the binding fields the Spec context carries, not only the names of the sections.
- rule: Promotion preflight (recipe 9) reports the rung above the stated rung beside the rung above the floor, with the clauses that fail at each, so a Spec stated below its floor shows both.
- rule: The orphans and gaps recipe (recipe 8) reports each kind the verifier-gap signal exempts and how many ready Specs it exempts, as the build backlog reports its exclusions.
- rule: Address resolution (recipe 25) keeps the Spec, section and key it parsed when an address misses, names the part that failed, and lists the keys that section of the Spec does carry.
- rule: The decision register (recipe 31) names its fields after the relation it reads, `refines` and `refinedBy` beside `supersedes` and `supersededBy`; whether a refinement narrows a decision is that decision's own text.
- rule: Architecture crossings (recipe 32) tallies the same-layer `uses` edges beside the crossings.
- rule: A design-backlog recipe lists the Specs stated `defined` that no code realizes, with their design columns, excluding examples and decisions as the build backlog does.
- rule: The catalog opens with a one-line index of its recipes and shows how to run a shipped body inside a caller's own body to filter its answer.
- rule: A body that fails to parse is reported with the line and column of the error in the body the caller wrote.

## Design

- detailParameter: `params.detail`, absent or `false` for the summary and `true` for every row in full; recipe 29's `detail` may also be a list of member ids, which returns full rows for those members and summary rows for the rest of the Pack, and an id that is not a member is a diagnostic in the result. A summary keeps `totals` as the full answer counts them and adds `leftOut`, one line for each kind of detail it omits.
- impactSummary: `{ changedFiles, totals, impactedSpecs: [id], atRisk: { incomingSpecs: [id], outgoingSpecs: [id], other: [id] }, coverageUnknownFiles, unlinkedUnits: [id], leftOut }` is recipe 4's summary. Incoming and outgoing name the connecting edge's direction relative to the impacted node and assert no dependency, since the edge may be any type; a Spec reached both ways is listed in both, and `other` holds the at-risk nodes that are not Specs.
- impactDetail: with `detail: true`, recipe 4 returns its rows with their reasons as it does today, and every at-risk reason gains `direction`, `incoming` or `outgoing`, relative to its impacted end.
- packDesignSummary: `{ id, specKind, statedReadiness, floorReached, statedNextRung, holds: [{ clauseId, targets: [id] }], openQuestions, blockingQuestions, implementedBy, referencedBy }` is recipe 29's summary row, with counts for the last four; the summary's boundary lists ids per direction, and `totals` is unchanged.
- guaranteeShape: recipe 3 returns `sections` as the graph holds them, `designColumns`, `packs`, `implementations` and `references` in recipe 29's unit shape (id, file, line, role, component with its layer and context), and each verifier with its `line`, beside the relations and findings it returns today.
- gapExemptions: recipe 8 adds `exemptions: [{ validatorId, exemptKind, readySpecs }]`, today one row for `honesty/gaps` exempting `decision`, and a `leftOut` line when more signals exist than the 25 it lists.
- preflightRungs: recipe 9 replaces `nextRung` and its failure fields with `aboveStated` and `aboveFloor`, each `{ rung, failures, firstUnmetClause }` with `rung` null at `ready`. The Spec context gains `statedNextRung` and `statedNextRungFailures`, the two fields a Pack member already carries, so the recipe computes no floor.
- addressMiss: a miss in recipe 25 keeps the `id`, `section` and `key` it parsed; `reason` is `malformed`, `spec`, `section` when the Spec has no such section, or `entry`; a `section` or `entry` miss carries `available`, the keys that section of the Spec does carry in code-unit order, and a `malformed` miss carries `expected`, the address grammar in one line.
- decisionRefinement: recipe 31's `narrows` and `narrowedBy` become `refines` and `refinedBy`, still listing decision-kind ends only.
- sameLayerTally: recipe 32 adds `totals.sameLayer` and `totals.sameContext`, the resolved edges whose two components state one layer or one context, and `totals.bySameLayer`, a count per layer; two units of one component count in neither.
- designBacklog: recipe 33, the design backlog, takes no parameter and returns `{ totals: { specs, byFamily, excludedExamples, excludedDecisions, withReferences }, rows }`, each row `{ id, specKind, altitude, floorReached, statedNextRungFailures: [clauseId], design: { entries, declarations, openQuestions, blockingQuestions }, referencedBy, packs }`, sorted by id.
- catalogIndex: the catalog opens with a table of every recipe, its number, name, parameters and a one-line use, before the contract; the build keeps writing one file per body and none for the index.
- wrapIdiom: to filter a shipped answer, the caller wraps the shipped body in an async arrow function inside its own body, `const answer = await (async () => { <shipped body> })();`, and returns a filtered value; the catalog shows the shell form and states that the caller's part must hold no shell expansion.
- parseErrorLine: a body that does not parse prints one stderr line, `sdp q: the body does not parse at line L, column C: <message>`, with 1-based positions in the body as the caller wrote it, exits 1 and prints nothing on stdout; a runtime error keeps the report it has today.
- recipeNumbers: this arc's new recipes take the next numbers in this order: 33 design backlog, 34 rule coverage, 35 design diff, 36 context bundle, 37 perspective filter, 38 proposal check, 39 slimming candidates, 40 curation report.

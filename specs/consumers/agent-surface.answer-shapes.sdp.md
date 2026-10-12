---
id: spec:consumers.agent-surface.answer-shapes
kind: behavior
altitude: story
readiness: defined
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

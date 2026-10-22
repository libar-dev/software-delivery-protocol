---
id: spec:consumers.spec-studio.data.recipe-answers
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.data
  dependsOn:
    target: spec:consumers.agent-surface.evaluation-sink
    reason: the build composes recipe answers through the same body evaluation `sdp q` runs
---
# A page takes each recipe answer from the recipe's shipped body

The lenses, the registers, the owner queue, the slice and roadmap pages, the diff and runs pages and the panels of a Spec page show recipe answers. Each takes its answer from the recipe's shipped body, evaluated over the graph the build derived, so a page and `sdp q` give one answer. The two Design entries name every evaluation a build runs and which page reads each answer, so a builder and a test author read one list.

## Intent
- outcome: Compose every recipe answer a Studio page shows by evaluating the recipe's shipped body over the graph the build derived, so a page and `sdp q` give one answer.

## Contract
- [#recipeEvaluation] The build composes each recipe answer a page shows by evaluating that recipe's shipped body, the one `dist/recipes/` holds, over the graph, reader and validation report it derived, with the parameters the recipe evaluations name, through the body evaluation `sdp q` runs; it re-implements no recipe, so a page and `sdp q` give one answer.
- [#oncePerBuild] Each evaluation the recipe evaluations name runs once per build, and every page that shows its answer reads that one answer.

## Design
- recipeEvaluations: a build evaluates each of these once, with no parameter unless one is named: recipes 17, 20, 24, 31, 33, 43, 44, 46, 51 and 53; recipe 52 with `{ detail: true }`; recipe 29 with `{ pack: id }` and recipe 54 with `{ pack: id, detail: true }` for every Pack; recipe 55 with `{ pack: id }` for every Pack whose manifest states `order: priority`; recipe 21 with `{ spec: id }` and recipe 30 with `{ specs: [id] }` for every Spec; recipe 34 with `{ spec: id }` for every Spec that is not an example, Specs in no Pack included; given a base graph, recipe 35 with `{ base, detail: true }`, and with `{ base, pack: id, detail: true }` for every Pack; given run records, recipe 45 with `{ runs }`.
- pageRecipes: the index renders reader values and each Spec's `epicIds` from recipe 52; the glossary renders reader values only; the capabilities lens renders recipe 52; the architecture lens renders recipes 17 and 43; the tests lens renders every recipe 34 answer, recipe 44, and recipe 45 given run records; a Spec page renders its recipe 21, 30 and 34 answers, its own space from recipe 44, the recipe 51 rows that cite its entries, the recipe 45 files whose `specs` hold its id, and its own row of recipe 35's whole-corpus answer; a Pack page renders the totals of its recipe 29 answer and, given a base graph, its own recipe 35 answer; a slice page renders its Pack's recipe 54 answer; the roadmap page renders recipe 53 and each roadmap's recipe 55 memo; the registers render recipes 20, 31, 24 beside recipe 51's rows, and 33; the owner queue renders recipe 46; the diff page renders recipe 35's whole-corpus answer; the runs page renders recipe 45; an export renders the values of the pages it holds.

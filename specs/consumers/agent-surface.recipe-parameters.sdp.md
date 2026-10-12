---
id: spec:consumers.agent-surface.recipe-parameters
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  decidedBy: spec:decisions.agent-front-door
---
# Recipes take parameters as data and ship as runnable files

## Intent
- problem: A recipe that takes its input in its own source makes a caller rewrite the body for each input, a long list included, and a script that runs a recipe must first cut its body out of the Markdown catalog.
- outcome: Pass a recipe's parameter as data through the one evaluation sink, and ship every catalog body as a file a caller runs as written.

## Behavior
- rule: `sdp q` takes `--params` with a JSON object, or `--params @PATH` with a file holding one, the path resolved from the working directory, and injects it as a fourth binding, `params`, beside `g`, `graph` and `report`. Without the flag `params` is an empty object. In these two forms, a value that is not valid JSON, JSON that is not an object (null, an array, a string, a number or a boolean), or a file that cannot be read is refused before the body runs, with exit 1, one line on stderr and no output on stdout.
- rule: `--params` is repeatable in three forms: a JSON object, `@PATH` naming a file that holds one, and `KEY=@PATH` binding the JSON value in the file, of any type, to `params.KEY`, with `KEY` on the lower-camel grammar. Objects merge at the top level from left to right, and a key given twice by any form is refused before the body runs, with exit 1, one line on stderr and no output on stdout, so a recipe takes a large file such as a base graph beside its other parameters.
- rule: The bindings `g`, `graph` and `report` keep their names and meaning beside `params`. The sink evaluates one operator-supplied body and adds no query vocabulary: a parameter is input to a body, never a verb.
- rule: Every recipe reads its parameters under the names the catalog states. A parameter with a documented sample falls back to it when absent, so each body runs as written; a required input with no sample, such as a base graph, a proposal or an imports file, returns diagnostics when absent. Recipe 4 reads its changed files from `params.files`.
- rule: The package build writes each catalog body to `dist/recipes/<NN>-<slug>.js`, where `NN` is the two-digit recipe number and the slug is the recipe's heading in lower kebab case, and the package ships that directory. The catalog stays the one owner of the bodies; the files are derived, and the recipe test checks that each file equals its catalog body byte for byte.

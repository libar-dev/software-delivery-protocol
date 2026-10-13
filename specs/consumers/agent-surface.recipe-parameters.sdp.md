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

A body reads its parameters by name, so a name it does not read would be dropped without a word, and a recipe with a sample would answer for the sample: a misspelled name would look like a successful call. A recipe therefore answers a name it does not take with that name and the names it does take, and nothing else. A body cannot import and the reader holds no recipe metadata, so each body declares its own names in its first statement, and the recipe check holds that declaration to the catalog.

## Intent
- problem: A recipe that takes its input in its own source makes a caller rewrite the body for each input, a long list included, and a script that runs a recipe must first cut its body out of the Markdown catalog.
- outcome: Pass a recipe's parameter as data through the one evaluation sink, and ship every catalog body as a file a caller runs as written.

## Behavior
- rule: `sdp q` takes `--params` with a JSON object, or `--params @PATH` with a file holding one, the path resolved from the working directory, and injects it as a fourth binding, `params`, beside `g`, `graph` and `report`. Without the flag `params` is an empty object. In these two forms, a value that is not valid JSON, JSON that is not an object (null, an array, a string, a number or a boolean), or a file that cannot be read is refused before the body runs, with exit 1, one line on stderr and no output on stdout.
- rule: `--params` is repeatable in three forms: a JSON object, `@PATH` naming a file that holds one, and `KEY=@PATH` binding the JSON value in the file, of any type, to `params.KEY`, with `KEY` on the lower-camel grammar. Objects merge at the top level from left to right, and a key given twice by any form is refused before the body runs, with exit 1, one line on stderr and no output on stdout, so a recipe takes a large file such as a base graph beside its other parameters.
- rule: The bindings `g`, `graph` and `report` keep their names and meaning beside `params`. The sink evaluates one operator-supplied body and adds no query vocabulary: a parameter is input to a body, never a verb.
- rule: Every recipe reads its parameters under the names the catalog states. A parameter with a documented sample falls back to it when absent, so each body runs as written; a required input with no sample, such as a base graph, a proposal or an imports file, returns diagnostics when absent. Recipe 4 reads its changed files from `params.files`.
- rule: [#declaredNames] Each catalog body opens by declaring the parameter names it takes, in the order the catalog's index lists them, and checks `params` against that list before it reads anything else; a recipe that takes no parameter declares an empty list.
- rule: [#unknownNames] A recipe given a parameter name it does not take returns `{ unknownParams, accepts }` as its whole answer, and `sdp q` exits 0; it never answers for its sample, for an empty input or for the names it does take in that case.
- rule: [#namesChecked] The recipe check holds each body's declared names to the catalog's index and to the `params` names the body reads, and runs each body with a name it does not take.
- rule: The package build writes each catalog body to `dist/recipes/<NN>-<slug>.js`, where `NN` is the two-digit recipe number and the slug is the recipe's heading in lower kebab case, and the package ships that directory. The catalog stays the one owner of the bodies; the files are derived, and the recipe test checks that each file equals its catalog body byte for byte.

## Design

- acceptsPreamble: `const accepts = [...]; const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name)); if (unknownParams.length > 0) return { unknownParams, accepts };` opens every catalog body as three statements on three lines, with the recipe's names in the brackets as double-quoted strings.
- unknownAnswer: `{ unknownParams, accepts }` is the whole answer for a name a recipe does not take, where `unknownParams` lists every such name in the order `params` holds them, and `accepts` repeats the recipe's declared names.

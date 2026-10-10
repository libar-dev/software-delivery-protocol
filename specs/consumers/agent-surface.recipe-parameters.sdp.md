---
id: spec:consumers.agent-surface.recipe-parameters
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface
  decidedBy: spec:decisions.agent-front-door
---
# Recipes take parameters as data and ship as runnable files

## Intent
- problem: A parameterized recipe takes its input on its opening line, so a caller rewrites the body's source to pass 489 addresses, recipe 4 alone reads an environment variable, and every script that runs a recipe cuts its body out of the Markdown catalog first.
- outcome: Pass a recipe's parameter as data through the one evaluation sink, and ship every catalog body as a file a caller runs as written.

## Behavior
- rule: `sdp q` takes `--params` with a JSON object, or `--params @PATH` with a file holding one, the path resolved from the working directory, and injects it as a fourth binding, `params`, beside `g`, `graph` and `report`. Without the flag `params` is an empty object. A value that is not valid JSON, JSON that is not an object (null, an array, a string, a number or a boolean), or a file that cannot be read, is refused before the body runs, with exit 1, one line on stderr and no output on stdout.
- rule: The three existing bindings keep their names and meaning. The sink still evaluates one operator-supplied body and adds no query vocabulary: a parameter is input to a body, never a verb.
- rule: Every recipe that takes a parameter reads it from `params` under the name the catalog states and falls back to the catalog's sample when the name is absent, so each body still runs as written. Recipe 4 reads its changed files from `params.files`, and the environment variable it used before is retired.
- rule: The build writes each catalog body to `dist/recipes/<NN>-<slug>.js`, where `NN` is the two-digit recipe number and the slug is the recipe's heading in lower kebab case, and the package ships that directory. The catalog stays the one owner of the bodies; the files are derived, and the recipe test checks that each file equals its catalog body byte for byte.
- rule: The realizing sites are `src/cli/q-command.ts` for the flag and binding, and the build step that writes `dist/recipes/`.

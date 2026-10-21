---
id: spec:consumers.agent-surface.evaluation-sink
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  decidedBy: spec:decisions.agent-front-door
---
# The evaluation sink runs one body and prints its return

Without a way to call a shipped recipe, a body that needs its answer pastes the recipe's file into its own text, and a rules file keeps its own copy of the recipe's code. The `recipes` binding lets a body call a shipped recipe by its catalog number over the graph it already holds, so the answer is the recipe's own and nothing derives twice. A recipe call is a binding, never a reader verb: the catalog stays the one owner of the bodies, and the reader gains no query vocabulary. The package exports the same evaluator, so a script that holds a graph runs a body, or a shipped recipe through that body, without deriving the graph again.

## Intent
- problem: How `sdp q` takes a body, prints its answer and refuses is stated only in the CLI help and the reading skill, so a caller and a script that runs a recipe learn the contract by trial.
- outcome: State how the evaluation sink takes a body, renders its return and refuses, so every caller relies on one contract.

## Behavior
- rule: `sdp q` takes one positional JavaScript async-function body, which takes precedence over stdin; with no positional body it reads non-terminal stdin, and absent, unreadable or empty input refuses with exit 1 before evaluation.
- rule: The sink supplies `g`, `graph`, `report` and `params`, permits `await` and prints the returned value using bounded `util.inspect` by default or `JSON.stringify` with `--json`; it does not suppress console output, so machine-consumed bodies must avoid it.
- rule: A body that returns `undefined` prints no answer, reports on stderr that `return` is the output contract and exits 0; a `--json` result with no JSON form or one that cannot be serialized refuses with exit 1 and no rendered answer.
- rule: An extraction error prevents evaluation, renders the extraction findings and exits 1; validation findings are supplied as `report` and do not gate evaluation. A compilation, evaluation or rendering failure exits 1 and reports its error on stderr.
- rule: A body that fails to parse is reported with the line and column of the error in the body the caller wrote.
- rule: [#fifthBinding] The sink supplies a fifth binding, `recipes`, beside `g`, `graph`, `report` and `params`, and every body it, the rules runner or the exported evaluator runs receives it, a recipe called through it included.
- rule: [#recipeCall] A body calls a shipped recipe as a function of its catalog number and one parameters object; the call runs the recipe's body over the caller's own `g`, `graph` and `report`, with no second derivation and no copy, and resolves to the recipe's answer unchanged, `{ unknownParams, accepts }` and `{ diagnostics }` included.
- rule: [#callRefusals] A call names a recipe the catalog holds and passes one plain object or nothing; any other number or parameters reject the call with a message naming the recipe, and a recipe that throws rejects the call with its error, so a mistaken call fails loudly instead of answering for a sample.
- rule: [#oneEvaluator] `sdp q`, the rules runner and the exported evaluator compile and run a body one way: the same compilation, the same parse-error message and the same five bindings.
- rule: [#exportedEvaluator] The package exports the body evaluator, so a script that holds a graph runs a body, or a shipped recipe through `recipes`, without deriving the graph again; the evaluator writes and prints nothing and claims no sandbox, as the sink claims none.

## Design
- parseErrorLine: A body that does not parse prints one stderr line, `sdp q: the body does not parse at line L, column C: <message>`, with 1-based positions in the caller's body, exits 1 and prints nothing on stdout.
- recipesBinding: `recipes(number, parameters?)`, where `number` is a recipe number the catalog's index lists, an integer, and `parameters` is one plain object, `{}` when omitted; it returns a promise of the value the recipe's body returns, the same value and never a copy or a JSON round trip.
- recipeSource: a call runs the body the package ships for that number as `dist/recipes/<NN>-<slug>.js`, the file the catalog derives, read from the package that runs the engine and never from the corpus or the working directory.
- calledBindings: a called recipe receives the caller's `g`, `graph` and `report`, the same objects; its parameters object as `params`; and `recipes` itself, so one recipe may call another.
- callRejections: `recipes: the catalog holds no recipe <number>` rejects a call whose number the catalog does not list, or that is not an integer; `recipes: recipe <number> takes one parameters object` rejects parameters that are null, an array, a string, a number or a boolean.
- evaluatorExport: `evaluateBody(body: string, input: { graph: GraphSchema; report?: ValidationReport; params?: Readonly<Record<string, unknown>> }): Promise<unknown>`, exported from the package's main entry, `@libar-dev/software-delivery-protocol`; it binds `g` to the reader over `graph`, `report` to the given report or, when absent, the validation report of `graph`, `params` to the given object or `{}`, and `recipes` over the same three, and resolves to the body's return.
- evaluatorRejections: a body that does not parse rejects with an Error whose message is `the body does not parse at line L, column C: <message>`, the text the sink prints after `sdp q: `; a body that throws rejects with what it threw; `params` that are not a plain object reject before the body runs.

## Example space
```gwt-vocabulary
Given a probe corpus in which two Specs depend on each other through dependsOn
Given a body that calls {call:"recipe 26 with no parameters"|"recipe 26 with the severity warning"|"a recipe number the catalog does not hold"}
When the body runs {entrance:"through sdp q"|"through the exported evaluator over a graph derived once"}
Then the call {outcome:"resolves"|"rejects"}
Then the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer:boolean}
Then the rejection reads {rejection:string}
```

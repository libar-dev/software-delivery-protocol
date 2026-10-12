---
id: spec:consumers.agent-surface.evaluation-sink
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface
  decidedBy: spec:decisions.agent-front-door
---
# The evaluation sink runs one body and prints its return

## Intent
- problem: How `sdp q` takes a body, prints its answer and refuses is stated only in the CLI help and the reading skill, so a caller and a script that runs a recipe learn the contract by trial.
- outcome: State how the evaluation sink takes a body, renders its return and refuses, so every caller relies on one contract.

## Behavior
- rule: `sdp q` takes one positional JavaScript async-function body, which takes precedence over stdin; with no positional body it reads non-terminal stdin, and absent, unreadable or empty input refuses with exit 1 before evaluation.
- rule: The sink supplies `g`, `graph`, `report` and `params`, permits `await` and prints the returned value using bounded `util.inspect` by default or `JSON.stringify` with `--json`; it does not suppress console output, so machine-consumed bodies must avoid it.
- rule: A body that returns `undefined` prints no answer, reports on stderr that `return` is the output contract and exits 0; a `--json` result with no JSON form or one that cannot be serialized refuses with exit 1 and no rendered answer.
- rule: An extraction error prevents evaluation, renders the extraction findings and exits 1; validation findings are supplied as `report` and do not gate evaluation. A compilation, evaluation or rendering failure exits 1 and reports its error on stderr.
- rule: A body that fails to parse is reported with the line and column of the error in the body the caller wrote.

## Design
- parseErrorLine: A body that does not parse prints one stderr line, `sdp q: the body does not parse at line L, column C: <message>`, with 1-based positions in the caller's body, exits 1 and prints nothing on stdout.

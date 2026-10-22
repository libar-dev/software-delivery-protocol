---
id: spec:extraction.executable-examples
kind: behavior
altitude: epic
readiness: defined
relations:
  dependsOn:
    target: spec:extraction.derive-graph
    reason: executable contracts read the one graph rather than another carrier path
---
# Bound examples execute their authored steps

The capability connects authored intent to an example's execution. Contract generation and the runner own narrower parts of that outcome; neither alone owns it. A change to the authored example must reach its test through the generated contract.

## Intent

- actor: An author binding an example to a test of the intended behavior.
- problem: A separately handwritten test can drift from the Spec's own steps and expected outcome.
- outcome: Run an example against its authored intent through graph-derived contracts and report failures in the words of its steps.

## Behavior

- rule: [#authoredSteps] Execution reads the steps and bound values from contracts derived from the graph; it adds no second authored description of the example.
- rule: [#binding] A bound test supplies the world and step handlers, and the runner executes the contract's steps in authored order. Contract generation and execution keep their separate responsibilities.
- rule: [#failure] A failing step names the authored intent it exercised. An unspecified expected outcome remains explicit and cannot become a passing comparison by assumption.
- rule: [#facts] A verifier binding says the example has a verifier. Execution results stay outside the graph and confer no readiness or delivery fact on this epic.

## Verification — reviewed

- Trace a bound example from its graph steps through generated contracts to runner dispatch, then change an expected outcome and check that its test fails in the example's words.
- Read the epic's own binding facts separately from the bindings on its contract-generation and runner descendants.

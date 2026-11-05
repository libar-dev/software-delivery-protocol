---
id: spec:consumers.reading-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.agent-surface
    reason: the skill is the shipped on-ramp to the agent surface, one body over the one graph beside an agent's own tools
  dependsOn:
    - target: spec:extraction.derive-graph
      reason: the skill names the closed node and edge types this Spec fixes
    - target: spec:extraction.claim-taxonomy
      reason: the skill names the three claims and keeps each fact's claim apart
    - target: spec:extraction.delivery-facts
      reason: the skill teaches how delivery facts derive and what each one establishes
    - target: spec:consumers.agent-surface.evaluation-sink
      reason: the skill teaches the body contract the sink runs, its bindings, its output and its refusals
    - target: spec:consumers.reader
      reason: the skill teaches the reader's entry methods and the context a body reads through them
    - target: spec:consumers.agent-surface.answer-shapes
      reason: the skill points at the catalog index and teaches summary answers and what they leave out
    - target: spec:consumers.wholesale-view-rewrite
      reason: the skill warns that every build removes the page roots, so findings are read through the report
    - target: spec:consumers.shipped-protocol-corpus
      reason: the skill keeps the shared skill shape and sends a project to the shipped Specs, whose delivery facts read empty there
  decidedBy:
    - target: spec:decisions.agent-front-door
      reason: the skill teaches scripting the graph through `sdp q`, with no verb wall, as this ruling sets
    - target: spec:decisions.binding-not-liveness
      reason: the skill reads `implemented` and `has-verifier` as existence, never liveness
    - target: spec:decisions.checked-mentions
      reason: the skill cites a Spec id or entry address only in the checked form this ruling defines
---
# The reading skill teaches agents to query the graph

## Intent
- outcome: Give an agent a shipped reading on-ramp that selects current graph evidence and the Spec that owns each law.

## Behavior
- rule: [#schemaPointer] The skill points at the Specs that close the graph's node types, edge types and claims, and restates only the names a first body needs.
- rule: [#factLimits] The skill teaches how delivery facts derive and explains the limits of empty answers, keeping a binding distinct from passing tests and runtime observation.
- rule: [#runner] The skill bootstraps through its runner script, which runs the built CLI with the root's fixture exclusions in the Protocol source checkout and the project's installed package anywhere else, refuses with a named remedy when neither exists, and never relies on a global `sdp`. The skill teaches the direct forms that select a root and its exclusions, and states once that every command runs from the project root, where the runner derives the graph, and how a skill reaches its own files, a sibling skill's files and the package's files, in the checkout and in an installed plugin. Both runners read an option written with `=`, such as `--root=PATH`, as its two-word form.
- rule: [#pairing] The skill presents `sdp q` as a complement to an agent's own search and file tools: one body answers structure, claims and derived delivery facts, and a text search then reads the lines the answer names.
- rule: [#orientation] The skill carries the orientation queries as body files and a runner that evaluates them over one graph derivation. Each body takes its subject from `params`, answers every part on the subject given, and derives one from the graph only when none is given, so orientation runs in the Protocol checkout and in an adopter's corpus. An answer that prints part of a list says how much of it prints.
- rule: [#recipeNaming] The skill directs the reader from a question to the numbered, named catalog recipe that answers it, passes subjects as `params`, and teaches summary and detail output without creating query verbs.
- rule: [#stateAndLaw] The skill answers a state question from current graph data and a question of intended truth from the carrying Spec.
- rule: [#taskIndex] The skill points at the recipe catalog's index as the one map from a task to its recipe, and the other shipped skills point into that index for every recipe they do not name at a step.
- rule: [#protocolRoot] The runner's `--protocol` selects the root that holds the Protocol's own Specs and nothing else: in the Protocol source checkout its root, with the checkout's exclusions and bindings; anywhere else the installed package's `specs/`, which holds intent only; beside `--root` it refuses.
- rule: [#orientationOutput] The orientation runner prints each answer as its number and title, the command that runs it, and its answer, with no prose that restates either. A query whose body names the subject an agent arrives with, run without `--subjects` naming it, prints its command with the body's subject placeholder and a shortened answer over a subject the graph supplies; given its subject, the command carries it and the answer is whole. `--json` prints every answer in full, with its title, the line its body says the query teaches, and its notes. A printed run, `--only` included, ends with the recipe catalog by category and the call forms, as `sdp q` prints them for a call with no body, taken from the CLI the run used so the listing matches the installed package.

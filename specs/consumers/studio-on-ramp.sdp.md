---
id: spec:consumers.studio-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.reading-on-ramp
    reason: a Studio page is a person's reading of the one graph, and the skill sends an agent from a page to the graph behind it
  dependsOn:
    - target: spec:consumers.spec-studio.publisher
      reason: the skill teaches the verb, its watch and what each shared build removes
    - target: spec:consumers.spec-studio.data.inputs
      reason: the skill teaches the base graph and run records and where they may lie
    - target: spec:consumers.spec-studio.sharing
      reason: the skill teaches the stamp, its lifetime and the pull-request preview workflow
    - target: spec:consumers.spec-studio.export
      reason: the skill teaches the Pack export and what it leaves out
    - target: spec:consumers.spec-studio.intent-panel
      reason: the skill teaches what the composing panel hands off and what stays scoped-intent text
    - target: spec:consumers.intent-composition
      reason: a received proposal is checked and applied as the hand-off law states
---
# The Studio skill teaches agents to publish, share and read the Spec Studio

The Studio's work reaches an agent in three forms: a person or an agent holding only a link, a coding agent that publishes pages or receives intent a person composed in them, and a developer who sets up previews in CI. Each needs steps that most graph questions never use, so the Studio has its own skill and the reading skill points to it.

## Intent
- outcome: Give an agent a shipped on-ramp that publishes and shares the Spec Studio, reads it by task from a repository or a link, and turns intent composed in it into checked carrier edits.

## Behavior
- rule: [#ownSkill] The Studio is taught in its own shipped skill, beside the reading, authoring and session skills, and the reading skill points to it.
- rule: [#startFromEvidence] The skill starts from what the agent holds: a repository to publish from, a page set or a link to read, composed intent to apply, or a CI workflow to set up; a reader holding only a link reads the pages without building a graph.
- rule: [#publishRun] The skill teaches `sdp studio` for a page set with a base graph or run records and `sdp generate` for every root without them; that every command entering the shared build removes the page set; that supplied inputs lie outside every path the build writes or removes; and that the watch rebuilds on carrier edits with no server.
- rule: [#stampAndShare] The skill teaches stamping after the final build with the commit the build read, that a later build removes the stamp, that source links need a stamp served over http or https, and the reusable preview workflow's inputs, permissions, artifact, deployment and fork behavior.
- rule: [#readByTask] The skill maps a reviewer's task to the page that answers it, and states what a page does not: it shows values the build computed, its order sets no priority, a run row is no verdict, and a Pack export carries no stamp or composing panel.
- rule: [#receiveIntent] The skill teaches receiving the composing panel's hand-off: the proposal and its memo, and the scoped-intent text the proposal cannot carry. The agent writes the graph at the proposal's base, runs the proposal check, sends a moved or uncheckable change to a person, applies the rest through the authoring skill, and writes scoped-intent text into a proposal against a known base before checking it.
- rule: [#citesLaw] The skill cites the Studio's Specs for law and each verb's `--help` for its flags, and restates neither.

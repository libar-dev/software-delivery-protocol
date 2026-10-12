---
id: spec:consumers.spec-studio.intent-panel
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.intent-composition
  dependsOn:
    - spec:consumers.edit-model
    - spec:model.open-question-keys
    - spec:consumers.intent-composition.proposal
---
# A composing panel on every page gathers scoped intent for an agent

## Intent
- outcome: Let a person gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.
### Open questions
- [non-blocking #proposalBase] The change-proposal contract requires the commit whose graph the person read, and a generated page set carries no commit; where does the panel get the proposal's base, and does it ask the person for a reason?
  - decider: owner
  - links: spec:consumers.intent-composition.proposal
  - provisional: the base is the commit a present build stamp names, otherwise one the person supplies, and the person supplies one reason for the whole proposal; without a base and a reason the panel exports scoped intent as text, and the receiving agent writes the proposal against a known commit
- [non-blocking #packScope] The change-proposal contract scopes a change by Spec ids and entry addresses only, while the panel gathers intent bounded by a Pack or a Spec's neighbors; does a Pack or neighbors scope expand to its member or neighbor Spec ids at hand-off, or does a later proposal schema admit Pack scopes?
  - decider: owner
  - links: spec:consumers.intent-composition.proposal
  - provisional: the ready proposal contract stands; a Pack-scoped request expands to the member Spec ids read from that Pack at the proposal base, and a request that changes Pack membership or framing, or names an empty Pack, stays scoped-intent text

## Behavior
- rule: The composing panel is visible on every page.
- rule: The panel writes no source; its hand-off follows `spec:consumers.intent-composition`.
- rule: A person gathers intents across pages before handing them off.
- rule: Gathered intents persist in the browser's local storage, so refreshing a tab on a phone loses none.
- rule: A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.
- rule: The panel hands its gathered intents off as one change proposal, on the change-proposal contract, which the person copies as text or saves as a document. The page opens no pull request, because a static page holds no credentials; any pull request comes from the agent's ordinary source edit.

## UI
- gatheredIntents: the intents gathered so far, headed with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target.
- panelActions: discard, copy the proposal as text, and save the proposal as a document.
- composingActions: the actions on other panels that compose intent: resolve an open question or promote it to a decision record, propose or edit an example, propose or adjust a constraint target, and propose examples for missing slot values.

## Example space
```gwt-vocabulary
Given the composing panel holds {gathered:number} gathered intents
When the person refreshes the tab
Then the composing panel holds {kept:number} gathered intents
```

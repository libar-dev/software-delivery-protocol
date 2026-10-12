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
- outcome: Let a reader gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.
## Behavior
- rule: The composing panel is visible on every page.
- rule: The panel writes nothing: source changes only when an agent edits it and git records the edit, and the conformance and honesty checks judge that edit as they judge every edit.
- rule: A reader gathers intents across pages before handing them off.
- rule: Gathered intents persist in the browser's local storage, so refreshing a tab on a phone loses none.
- rule: A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.
- rule: The panel hands its gathered intents off as one change proposal, on the change-proposal contract, which the reader copies as text or saves as a document. The agent that applies the proposal opens the pull request; the page opens none, because a static page holds no credentials.
- rule: No part of the original's patch loop returns to the page: it stages no patch, applies nothing to source or to a copy of the graph, and the proposal is the reviewable half of that loop, applied as an ordinary edit.

## UI
- gatheredIntents: the intents gathered so far, headed with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target.
- panelActions: discard, copy the proposal as text, and save the proposal as a document.
- composingActions: the actions on other panels that compose intent: resolve an open question or promote it to a decision record, propose or edit an example, propose or adjust a constraint target, and propose examples for missing combinations.

## Example space
```gwt-vocabulary
Given the composing panel holds {gathered:number} gathered intents
When the reader refreshes the tab
Then the composing panel holds {kept:number} gathered intents
```

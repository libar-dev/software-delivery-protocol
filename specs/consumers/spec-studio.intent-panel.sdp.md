---
id: spec:consumers.spec-studio.intent-panel
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.intent-composition
  dependsOn:
    - spec:consumers.edit-model
    - spec:model.open-question-keys
---
# A composing panel on every page gathers scoped intent for an agent

## Intent
- outcome: Let a reader gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.
### Open questions
- [blocking #handOff] How does a static page hand composed intent to an agent: as a file the reader saves, as text the reader copies, or as a pull request? The original exports patch JSON or opens a pull request, and `spec:consumers.intent-composition` names no entrypoint for the composing surface.
- [non-blocking #patchLoop] The original stages each change as a JSON patch, checks its schema in the browser and its effect on the graph through the CLI or an agent, and applies it to canonical source; `spec:consumers.edit-model` has a view compose scoped intent that an agent turns into an ordinary source edit, with no patch loop. Does any part of the patch loop return, or is scoped intent the panel's only output?

## Behavior
- rule: The composing panel is visible on every page.
- rule: The panel writes nothing: source changes only when an agent edits it and git records the edit, and the conformance and honesty checks judge that edit as they judge every edit.
- rule: A reader gathers intents across pages before handing them off.
- rule: Gathered intents persist in the browser's local storage, so refreshing a tab on a phone loses none.
- rule: A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.

## UI
- gatheredIntents: the intents gathered so far, headed with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target.
- panelActions: discard, hand off, and open as a pull request.
- composingActions: the actions on other panels that compose intent: resolve an open question or promote it to a decision record, propose or edit an example, propose or adjust a constraint target, and propose examples for missing combinations.

## Example space
```gwt-vocabulary
Given the composing panel holds {gathered:number} gathered intents
When the reader refreshes the tab
Then the composing panel holds {kept:number} gathered intents
```

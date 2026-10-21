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
    - target: spec:consumers.intent-composition.proposal
      reason: the panel hands off a change proposal and the memo recipe 49 renders for it
---
# A composing panel on every page gathers scoped intent for an agent

The change-proposal contract requires the commit whose graph the person read, and a generated page set carries no commit, so a proposal's base comes from the build stamp when one is present and from the person otherwise. The panel hands off the same Markdown memo an agent gets from recipe 49 for the same proposal, so a person, a reviewer and an agent read one text. A static page holds no credentials, so the panel opens no pull request and writes nothing but its own gathered intents in the browser.

## Intent
- outcome: Let a person gather the changes they want while they read, each bounded by a Spec, its neighbors, a Pack or one open question, and hand them to an agent that edits source.

## Behavior
- rule: [#everyPage] The composing panel is on every page, after the canvas, closed by default with its heading and the count of gathered intents; without script it says that composing needs the script.
- rule: The panel writes no source; its hand-off follows `spec:consumers.intent-composition`.
- rule: A person gathers intents across pages before handing them off.
- rule: [#persist] Gathered intents persist in the browser's local storage under the page set's own key, so refreshing a tab on a phone loses none, and two page sets served from one host never share intents.
- rule: A composed intent names its scope by id or entry address, so the agent that receives it reads the same Spec, Pack, entry or question through the graph.
- rule: [#handOff] The panel hands its gathered intents off as one change proposal, on the change-proposal contract, and as the memo recipe 49 renders for it: the person copies the memo or the proposal as text, or saves either as a file. The page opens no pull request, because a static page holds no credentials; any pull request comes from the agent's ordinary source edit.
- rule: [#sameMemo] The memo the panel writes for a proposal is byte for byte the memo recipe 49 returns for the same proposal.
- rule: [#proposalBase] A proposal's base is the commit a present build stamp names, otherwise one the person supplies, and the person gives one reason for the whole proposal; without a base and a reason the panel exports its intents as scoped-intent text, and the agent that receives them writes the proposal against a commit it knows.
- rule: [#packScope] A request scoped to a Pack expands at hand-off to the member Spec ids that Pack holds at the proposal's base; a request that changes a Pack's membership or framing, or names an empty Pack, stays scoped-intent text, so the change-proposal contract keeps its Spec and entry scopes.
- rule: [#noRequest] The panel requests nothing over the network and sends its intents nowhere.

## UI
- gatheredIntents: the intents gathered so far, headed `Composing` with their count, each on one line naming its scope and the change it asks for, such as adding an example or changing a constraint's target, with a button that discards it.
- baseAndReason: the base as code when a stamp names it, otherwise a labelled text field for a commit, then a labelled text field for the proposal's reason.
- panelActions: `Copy memo`, `Copy proposal`, `Save memo`, `Save proposal` and `Discard all`, the copy and save actions shown only when a base and a reason are present, and `Copy scoped intent` otherwise.
- composingActions: the actions on other panels that compose intent: propose new text for a keyed entry, resolve an open question or promote it to a decision record, propose or edit an example, propose or change a constraint target, and propose examples for values no example binds.
- composeDialog: a native dialog with a labelled text area for the request, a second for the exact entry text when the action proposes one, and `Gather` and `Cancel` buttons.

## Design
- storageKey: `sdp-studio:intents:<root path>`, where the root path is the URL path of the page set's root as the page's `page-root` attribute resolves it, so a page set at `/preview/12/` and one at `/preview/13/` keep apart.
- intentRecord: `{ scope: string[]; request: string; text?: string; replaces?: string; follows?: string; pack?: string; action: string }` per gathered intent, in gathering order, where `action` names the composing action that gathered it, such as `edit-example`, and `pack` keeps the Pack a Pack-scoped request named, its members already in `scope`.
- savedFiles: `proposal.json` holding the proposal document and `proposal.md` holding its memo, each saved through a link the panel writes with the `download` attribute.
- baseSource: the panel reads the base from the `data-corpus-commit` attribute the page's `sdp-stamp` sets once its stamp loads, and requests no stamp of its own.

## Example space
```gwt-vocabulary
Given the composing panel holds {gathered:number} gathered intents
When the person refreshes the tab
Then the composing panel holds {kept:number} gathered intents
```

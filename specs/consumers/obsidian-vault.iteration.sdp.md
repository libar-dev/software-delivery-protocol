---
id: spec:consumers.obsidian-vault.iteration
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    - target: spec:consumers.edit-model
      reason: the vault composes intent and never patches a carrier
    - target: spec:consumers.intent-composition.proposal
      reason: intent composed in the vault hands off on the one proposal contract
---
# A design pass is followed and answered from the vault

A design pass is a loop: an agent edits carriers, the graph changes, a person reads the change and answers it. In a vault the reading half is cheap, because Obsidian reloads a note when its file changes, so a vault regenerated as the carriers change shows each edit where the person is already reading. The answering half must not become a second write path. A person who edits a generated note loses the edit at the next regeneration, and the edit model refuses patches to canonical source from a view. A person composes intent beside the generated notes instead, citing entries by their block links, and an agent turns it into a change proposal that the proposal check reads before the agent applies it.

## Intent

- outcome: Let a person follow a design pass in the vault as an agent edits the carriers, and answer it from the vault with intent an agent hands off as a change proposal.
- risk: Regenerating the vault while a person reads could move them off their place or overwrite a note they are editing.

### Open questions
- [blocking #composeHome] Where does a person compose intent in the vault?
  - decider: owner
  - links: spec:consumers.intent-composition.proposal
  - provisional: a folder of intent notes the generator never writes, each citing entries by block link, which an agent turns into a proposal and runs through the proposal check
- [blocking #regenerationTrigger] What regenerates the vault while a pass runs?
  - decider: owner
  - provisional: a watch mode on the carrier events `sdp validate --watch` already handles, rewriting only the notes whose values changed
- [non-blocking #editGuard] How does the vault discourage editing a generated note?
  - provisional: a read-only banner naming the carrier on every note, and a regeneration that reports any generated note changed since it last wrote it

## Behavior

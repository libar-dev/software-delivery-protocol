---
id: spec:consumers.obsidian-vault.iteration
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    - target: spec:consumers.edit-model
      reason: the vault composes intent and never patches a carrier
    - target: spec:consumers.intent-composition.proposal
      reason: intent composed in the vault hands off on the one proposal contract
    - target: spec:consumers.validate-watch
      reason: the vault's watch runs the same loop over carriers and anchored source files
---
# A design pass is followed and answered from the vault

A design pass is a loop: an agent edits carriers, the graph changes, a person reads the change and answers it. In a vault the reading half is cheap, because Obsidian reloads a note when its file changes, so a vault regenerated as the carriers change shows each edit where the person is already reading. Rewriting only the notes whose bytes changed keeps every other note, and the person's place in it, as it was.

The answering half must not become a second write path. The edit model refuses patches to canonical source from a view, and a person's edit to a generated note would never reach the carrier. So a regeneration refuses while a generated note has changed, and a person composes intent in notes of their own beside the generated ones, citing entries by their block links. An agent turns such a note into a change proposal, runs the proposal check, uses its per-change findings to send moved scopes to a person and apply the remaining changes as ordinary carrier edits, which git records and validation checks.

## Intent
- outcome: Let a person follow a design pass in the vault as an agent edits the carriers, and answer it from the vault with intent an agent hands off as a change proposal.
- risk: Regenerating the vault while a person reads could move them off their place or overwrite a note they are editing.

## Behavior
- rule: [#composeHome] A person composes intent in notes outside the generated folder, by convention in `intent/` at the top of the vault, citing entries by block link or by entry address; the vault command never writes there.
- rule: [#handOff] The vault writes no carrier and no proposal.
- rule: [#watch] `sdp vault --watch` runs once and then again after every create, change, delete or rename of a carrier or an anchored source file, a `.ts` or `.tsx` file other than a `.d.ts`, under the root, outside the directories discovery skips, the exclusions, the vault and every path the shared build writes; it runs the loop `spec:consumers.validate-watch` states, so events during a run coalesce into one pending run, findings, refusals and failed extractions print while the process stays alive, and an operator's SIGINT exits 0 and leaves no temporary under `sdp/`.
- rule: [#carriersOnlyForValidate] The vault's source-file watching does not widen `sdp validate --watch`: validation watches carriers and any rules and parameter files explicitly named with `--rules` and its `--params`, but does not watch ordinary source edits.
- rule: [#inPlace] A regeneration under `--watch` writes only the notes whose bytes change and removes the notes whose node or entry left the graph, so a note a person is reading reloads in place and every other note keeps its bytes and modification time.
- rule: [#editGuard] Every generated note opens with a banner naming the file to edit instead, and a regeneration that finds a generated note changed refuses as `spec:consumers.obsidian-vault#rule.guard` states, naming it, so a person's edit is never overwritten and the person moves those words into an intent note.

## Example space
The world writes a probe corpus and starts the vault command with `--watch`, waits for the first run, edits one carrier or adds a comment-form anchor that satisfies the Spec in a new `.ts` source file, waits for the next run, records each generated file's bytes and modification time before and after, and stops the process with SIGINT.

```gwt-vocabulary
Given a vault the vault command wrote from an extraction root and now watches
When the Spec {specId:string} is edited by {edit:"a title change in its carrier"|"an anchor added in a source file"}
Then the note of that Spec shows the new title: {shown:boolean}
Then the note of that Spec shows an implementation binding: {bindingShown:boolean}
Then every note whose bytes the change leaves alone keeps its modification time: {othersUntouched:boolean}
Then the watch process stays alive and exits {exitCode:number} on SIGINT
```

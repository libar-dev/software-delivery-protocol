---
id: spec:consumers.vault-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.reading-on-ramp
    reason: a vault note is a person's reading of the one graph, and the skill turns what the person writes beside it into checked edits
  dependsOn:
    - target: spec:consumers.obsidian-vault
      reason: the skill teaches the verb, where the vault may lie and the guard's refusals
    - target: spec:consumers.obsidian-vault.notes
      reason: the skill converts a note name or block id back to the id or entry address it names
    - target: spec:consumers.obsidian-vault.iteration
      reason: the skill teaches the watch and the intent notes a design pass is answered in
    - target: spec:consumers.intent-composition
      reason: intent written in the vault is applied through a checked change proposal
  decidedBy:
    target: spec:decisions.vault-owned-folder
    reason: the skill keeps a person's notes outside the one folder the command owns
---
# The vault skill teaches agents to keep an Obsidian vault of the graph

A person keeps the vault open beside an agent's design pass and writes notes of their own in it. The agent has to place and refresh the vault without touching those notes, recover a refused run without losing them, and turn them into carrier edits. None of that belongs in the on-ramp for graph questions, so the vault has its own skill and the reading skill points to it.

## Intent
- outcome: Give an agent a shipped on-ramp that places, synchronizes and recovers the Obsidian vault without losing a person's notes, and turns the intent a person writes there into checked carrier edits.

## Behavior
- rule: [#ownSkill] The vault is taught in its own shipped skill, beside the reading, authoring, session and Studio skills, and the reading skill points to it.
- rule: [#placement] The skill teaches choosing the vault directory: `--out` resolves against the working directory, a vault inside the root lies under a directory discovery skips or an excluded prefix and apart from every path the build writes or removes, and a person opens that directory itself as the vault.
- rule: [#ownership] The skill teaches that the command writes only the vault's `sdp/` folder, and that a person's notes, intent notes under `intent/` by convention, and Obsidian's settings lie outside it.
- rule: [#synchronize] The skill teaches synchronizing and watching: `sdp vault` enters the shared build and removes the five page roots, `sdp generate --vault DIR` publishes those roots and the vault together, the watch follows carriers and TypeScript sources, and an index that opens with a failed-regeneration warning shows an older graph.
- rule: [#recover] The skill teaches recovering a refused run without losing a person's work: name what each refusal means, move the person's words out of `sdp/` before deleting a refused path, and keep or delete a changed Base on purpose.
- rule: [#intentNotes] The skill teaches turning an intent note into carrier edits: convert its links to ids and entry addresses, write a change proposal against the graph the person read, run the proposal check, send a moved or uncheckable change to a person, and apply the rest through the authoring skill.
- rule: [#citesLaw] The skill cites the vault's Specs for law and the verb's `--help` for its flags, and restates neither.

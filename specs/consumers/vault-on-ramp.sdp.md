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
    - target: spec:consumers.delivery-session-on-ramp
      reason: the skill applies an intent note's proposal through the session skill's one receive procedure
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
- rule: [#placement] The skill teaches choosing the vault directory with the person, outside `generated/` for notes worth keeping, and that a person opens that directory itself as the vault.
- rule: [#ownership] The skill teaches that the command writes only the vault's `sdp/` folder, and that a person's notes, intent notes under `intent/` by convention, and Obsidian's settings lie outside it.
- rule: [#synchronize] The skill teaches synchronizing: `sdp vault` enters the shared build and removes the five page roots, `sdp generate --vault DIR` publishes those roots and the vault together, and an index that opens with a failed-regeneration warning shows an older graph.
- rule: [#recover] The skill teaches recovering a refused run without losing a person's work: name what each refusal means, move the person's words out of `sdp/` before deleting a refused path, and keep or delete a changed Base on purpose.
- rule: [#intentNotes] The skill teaches turning an intent note into a change proposal against the graph the person read, converting each link back to the id or entry address it names, and applies it through `spec:consumers.delivery-session-on-ramp#rule.receiveProposal`.

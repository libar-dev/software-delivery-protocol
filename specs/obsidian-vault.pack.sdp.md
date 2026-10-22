---
id: pack:obsidian-vault-v1
specs:
  - spec:consumers.obsidian-vault
  - spec:decisions.vault-owned-folder
  - spec:consumers.obsidian-vault.fresh-vault
  - spec:consumers.obsidian-vault.person-notes-survive
  - spec:consumers.obsidian-vault.unknown-note-refused
  - spec:consumers.obsidian-vault.changed-note-refused
  - spec:consumers.obsidian-vault.hidden-file-refused
  - spec:consumers.obsidian-vault.vault-in-build-path-refused
  - spec:consumers.obsidian-vault.interrupted-run-recovered
  - spec:consumers.obsidian-vault.failed-extraction-keeps-notes
  - spec:consumers.obsidian-vault.failed-extraction-recovered
  - spec:consumers.obsidian-vault.notes
  - spec:consumers.obsidian-vault.notes.entry-address-link
  - spec:consumers.obsidian-vault.notes.unresolved-mention-stays
  - spec:consumers.obsidian-vault.notes.term-address-link
  - spec:consumers.obsidian-vault.notes.case-collision-refused
  - spec:consumers.obsidian-vault.bases
  - spec:consumers.obsidian-vault.bases.views-match-sources
  - spec:consumers.obsidian-vault.iteration
  - spec:consumers.obsidian-vault.iteration.watch-rewrites-changed-notes
  - spec:consumers.obsidian-vault.iteration.watch-source-anchor
  - spec:consumers.vault-on-ramp
  - spec:model.term-addresses
---
# Obsidian vault

A human interface for iterating on designs: the one graph regenerated as an Obsidian vault of linked notes, read beside the carriers an agent edits. First the vault, its verb and its place among the projections, with the decision that its generator owns one folder of the vault and never touches a note a person wrote. Then its notes and links, its tables, the loop a design pass runs through it, and the skill that teaches an agent to keep the vault and answer a pass from it. Each Spec is followed by the examples that will verify it. Last, the one model change the vault asks for, an address for a Model term, so a concept links as exactly as a Spec does.

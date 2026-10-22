---
id: spec:decisions.vault-owned-folder
kind: decision
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.obsidian-vault
    reason: settles which files the vault's generator owns and how it regenerates them
---
# The vault's generator owns one folder and synchronizes it

## Intent
- outcome: Regenerate the vault from the one graph as often as a design pass needs without ever removing or rewriting a note a person wrote in it.

## Decision
- context: Every projection root is rewritten wholesale, and every command that enters the shared build removes all of them first, because an absent view is honest and a stale one is not. A vault is different: a person keeps it open in Obsidian, keeps Obsidian's settings in it, and writes intent notes beside the generated ones.
- decision: The vault's generator owns one folder of the vault, `sdp/`, and keeps there a file list naming every file it wrote with a hash of its content. A `.DS_Store` file under `sdp/` is ignored. A listed `.base` file a person changed is kept, even when it leaves the generated set, with its recorded content unchanged in the list; the run warns with its path and the words `delete it to regenerate` and goes on. For every other file, a run refuses, writing and removing nothing, while that folder holds a file the list does not name or one whose content the list does not record. Otherwise it synchronizes the folder: it writes the files whose content changed, leaves the others untouched, and removes the files it wrote that the graph no longer holds. The vault is not one of the projection roots the shared build rewrites: no build removes it, a vault directory where the build writes or removes is refused, and only the vault's synchronization writes it, whether `sdp vault` or the verb that writes every projection root runs it.
- rationale: A wholesale rewrite removes whatever a person put in the root, and a regeneration that removes or rewrites a note a person wrote is refused.
- rationale: Writing only the files that changed keeps every other note's bytes and modification time, so Obsidian keeps a person's place while a pass runs; a wholesale rename shows Obsidian every note removed and created again.
- rationale: A list of written contents tells the generator's files from a person's without marking any note, and it is a function of the graph like the notes it lists, so the vault keeps its determinism.
- alternative: Rewrite the folder wholesale through a temporary sibling, as the five roots are rewritten; refused, because it moves a reader off their place and removes any note a person left in the folder.
- alternative: Overwrite a generated note a person changed and report it afterwards; refused, because the overwrite loses what the person wrote.
- alternative: Mark each generated note with a hash in its own properties; refused, because a person's copy of a generated note carries a valid mark and would be removed as stale, and the mark shows on every note.
- alternative: Make the vault a sixth projection root; refused, because the shared build's invalidation would remove a person's intent notes with it.
- consequence: While a run is under way the folder may hold notes of two generations, each note whole, and the file list lets the next run recognize what an interrupted run left.
- consequence: A run whose extraction fails keeps the last notes and says so on the index note, so a broken carrier never empties the vault a person is reading.
- consequence: The vault's determinism is checked by tests, since the repository's projection suite certifies the five projection roots only.

---
id: spec:consumers.obsidian-vault
kind: behavior
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:consumers.projections-model
    reason: a projection for a person who iterates on designs in a notes app
  dependsOn:
    - target: spec:consumers.reader
      reason: the generator reads the graph through the reader's joined values
    - target: spec:consumers.wholesale-view-rewrite
      reason: the shared build's invalidation removes the five projection roots and never the vault
  constrainedBy: spec:extraction.determinism
  decidedBy:
    - target: spec:decisions.shipped-projections-frozen
      reason: the vault is a new root, since the four shipped projections stay frozen
    - target: spec:decisions.vault-owned-folder
      reason: the generator owns one folder of the vault and synchronizes it instead of rewriting a root
---
# An Obsidian vault lets a person iterate on designs from the one graph

The Design Review links a Spec's relations both ways and gives keyed Pack questions a separate carrier-line link, but it offers no built-in filtering of a Pack or navigation from arbitrary prose mentions to their entries. The Spec Studio serves a person who iterates on a design in the repository and a pull request reviewer who holds only a link. A linked-notes view lets a person follow relations, filter members by rung and design columns, open entries by address and see each pass's edits arrive. It is a projection of its own, not the Studio's local half: the Studio's page set serves a reader who holds a link, the vault serves a person who iterates in a notes app, and each has its own verb.

Obsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. The first prototype, in `explorations/obsidian-vault/`, wrote notes from dumped graph and reader values, with relations and checked mentions as wikilinks, entry addresses as block links, and Bases for Pack members and standing queries. The second, in `explorations/obsidian-vault-prototype/`, writes the vault this Pack designs from the built engine and checks it on the Protocol's corpus and the first adopter's: links that resolve, Bases whose views select what their recipes select, two identical renders, and a person's notes that survive.

The principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two runs over one graph write the same bytes, so no note names a commit or a time. Intent is still written only in the carriers. One thing sets the vault apart from the other projections: a person keeps it open and writes notes of their own in it. So the command owns one folder of the vault and a list of what it wrote there, and synchronizes that folder instead of rewriting a root wholesale; the vault's owned-folder decision, `spec:decisions.vault-owned-folder`, says why.

The default vault sits under `generated/`, which discovery skips and an adopter usually keeps out of git. A person who wants to keep the intent notes they write in the vault points `--out` at a directory of their own.

## Intent
- actor: A person in the repository who designs a capability in passes while an agent edits the carriers.
- problem: The Markdown Design Review offers no built-in Pack filters or navigation from arbitrary prose mentions to their entries, so a person iterating on a design still reads carrier files alongside it.
- outcome: Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.
- risk: A notes app invites editing, and an edit to a generated note never reaches the carrier.

## Behavior
- rule: [#ownProjection] The vault is a projection of its own, written only by `sdp vault`, and no part of the Studio's page set.
- rule: [#verb] `sdp vault [root] [--exclude PATH]... [--out DIR] [--watch]` validates the graph as `sdp validate` does and then synchronizes the vault at `DIR`, by default `generated/obsidian-vault/` under the root; `root` defaults to the working directory, each exclusion is a root-relative path prefix as for the publishers, `--out` resolves against the working directory, and any other option refuses the run.
- rule: [#outsideExtraction] A vault directory inside the root must lie under a directory discovery skips or under an excluded prefix, so no file in the vault is ever read as a carrier or a source; any other vault directory inside the root refuses the run before the build.
- rule: [#ownedFolder] The command writes only the generated folder `sdp/` inside the vault; Obsidian's settings, a person's intent notes and every other file of the vault lie outside it and are never written, moved or removed.
- rule: [#guard] Before the build, a run reads every file under `sdp/` whose path holds no name that begins with a dot; a file the file list does not name, or whose bytes match no content the list records for it, refuses the run, which then writes nothing, removes nothing, names each such path and exits 1.
- rule: [#synchronize] A run that passes the guard writes each generated file whose bytes differ from the file on disk through a temporary sibling renamed into place, leaves every file whose bytes already match untouched, removes each file the list names that the new set no longer holds, removes the directories under `sdp/` it leaves empty, and writes the file list last.
- rule: [#interruptedRun] Before it changes any file, a run records in the file list both the content each path holds and the content it will hold, so a run stopped at any point leaves every generated file matching the list, and the next run recognizes each as its own.
- rule: [#standsApart] The vault is not a projection root of the shared build: the build's invalidation never removes it, the verb that writes every projection root leaves it out, and the repository's projection suite does not certify it; `sdp vault` enters the shared build, so it removes the five projection roots as `sdp validate` does.
- rule: [#deterministic] Two runs over one graph write byte-identical files under `sdp/`, the file list included, and no file there holds a time, a commit, an absolute path or a host name.
- rule: [#linksResolve] Every wikilink, embed and block link a generated note writes resolves to a file the run wrote and, with a block, to a block id that file carries; no note links outside the vault, a carrier or source file is named by its root-relative path in a code span, and text in a code span or a fenced block, where Obsidian reads no link, is no link.
- rule: [#findingsShown] Findings never withhold the vault: a run over a graph with validation findings still synchronizes and returns the validation exit code, each finding shows on the note of the Spec or Pack it names, and the index note counts them by severity.
- rule: [#failedExtraction] A run whose extraction fails keeps every generated note but the index, which it rewrites to open with a warning naming the failure, and exits 1; the next run that succeeds writes the index whole again.
- rule: [#plainNotes] Notes are plain Markdown with YAML properties, wikilinks and block ids, which other notes tools read; only the `.base` files are Obsidian's own.
- rule: [#openAsVault] A person opens the vault directory itself as an Obsidian vault, and every link and Base filter names its target by a path from that directory.

## Design
- layout: the generated folder `sdp/` holds `index.md`, `specs.base`, `specs/<family>/<note>.md`, `packs/<note>.md` beside `packs/<note>.base`, `code/<namespace>/<note>.md`, `terms/<note>.md` and the file list `.sdp-vault.json`; `<family>` is the first segment of a Spec's path, `<namespace>` a code unit's or anchor's namespace, and `<note>` the note name `spec:consumers.obsidian-vault.notes#design.noteName` states.
- fileList: `{ "schema": "sdp-vault/1", "files": { "<path under sdp/>": ["<sha256 hex of the file's bytes>"] } }` in `sdp/.sdp-vault.json`, paths sorted in code-unit order, JSON with two-space indentation and a closing newline; a path lists one content after a completed run and at most two while a run is under way.
- temporaryName: a file is written as `.<name>.sdp-tmp` in its own directory and renamed over `<name>`; a run removes any such temporary it finds under `sdp/`.
- guardMessage: one stderr line per refused path, `sdp vault: <path> is not a file this command wrote (unknown)` or `sdp vault: <path> has changed since this command wrote it (changed)`, with `<path>` relative to the vault, then `sdp vault: nothing was written; move a note you wrote out of sdp/, or delete a generated note you changed after keeping what you wrote`.
- outsideExtractionMessage: `sdp vault: the vault <out> lies inside the root and would be read as source; choose a directory under generated/, under an excluded prefix, or outside the root`.
- summaryLine: on stdout after a synchronization, `Wrote <out>/sdp (<n> files: <w> written, <u> unchanged, <r> removed)`.
- exitCodes: 0 when the vault is synchronized over a graph with no validation error; the validation exit code when it is synchronized over one with errors; 1 on a guard refusal, a vault inside the extraction, a failed extraction or a write that fails.
- indexNote: `sdp/index.md` opens with `` > [!info] Generated by `sdp vault` from the graph. Every file under `sdp/` is regenerated: write your own notes outside it, and intent notes in `intent/`. ``, then `# Spec graph`, the finding counts by severity, the corpus Base embedded, and a link to each Pack note in id order.
- failedIndex: after a failed extraction, `sdp/index.md` opens with `> [!warning] The last regeneration failed, and the notes show the graph of the last one that succeeded.` followed by one line per extraction error, its root-relative file and its message.

## Example space
The world writes a probe corpus of one Pack and its member Specs, runs the vault command with the vault under the root's `generated/` directory, and reads the vault from disk; a second run reads the same graph.

```gwt-vocabulary
Given an extraction root holding a Pack and its member Specs, among them {member:string}
Given a vault whose generated folder holds {generated:"nothing"|"the files an earlier run wrote"}
Given the vault holds {extra:"no other file"|"an intent note and Obsidian settings outside the generated folder"|"a note a person wrote inside the generated folder"|"a generated note a person changed"}
Given the member {change:"stays in the corpus"|"leaves the corpus"}
When the vault command runs at that root
Then the run exits {exitCode:number}
Then the run refuses the path {refusedPath:string} as {refusal:"unknown"|"changed"}
Then a second run over the same graph leaves every generated file byte-identical: {byteIdentical:boolean}
Then the member's note is present: {memberNote:boolean}
Then every file the person wrote is byte-identical: {personFilesKept:boolean}
Then every link a generated note writes resolves inside the vault: {linksResolve:boolean}
```

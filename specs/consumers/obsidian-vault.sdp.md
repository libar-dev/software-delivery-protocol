---
id: spec:consumers.obsidian-vault
kind: behavior
altitude: feature
readiness: ready
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

The Design Review links a Spec's relations both ways and gives keyed Pack questions a separate carrier-line link, but it offers no built-in filtering of a Pack or navigation from arbitrary prose mentions to their entries. The Spec Studio serves a person who iterates on a design in the repository and a pull request reviewer who holds only a link. A linked-notes view lets a person follow relations, filter members by rung and design columns, open entries by address and see each pass's edits arrive. It is a projection of its own, not the Studio's local half: the Studio's page set serves a reader who holds a link, the vault serves a person who iterates in a notes app, and each has its own verb; the verb that writes every projection root writes the vault too.

Obsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. The first prototype, in `explorations/obsidian-vault/`, wrote notes from dumped graph and reader values, with relations and checked mentions as wikilinks, entry addresses as block links, and Bases for Pack members and standing queries. The second prototype checked the vault this Pack designs on the Protocol's corpus and the first adopter's: links that resolve, Bases whose views select what their recipes select, two identical renders, and a person's notes that survive. Its measurements remain in `reviews/assets/plan46-prototypes/vault-measurements.md`; git holds the replaced prototype.

The principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two runs over one graph write the same bytes, so no note names a commit or a time. Intent is still written only in the carriers. One thing sets the vault apart from the other projections: a person keeps it open and writes notes of their own in it. So the command owns one folder of the vault and a list of what it wrote there, and synchronizes that folder instead of rewriting a root wholesale; the vault's owned-folder decision, `spec:decisions.vault-owned-folder`, says why. For the same reason the vault never lies where the shared build removes files, and a run refuses rather than guess whose a file is.

The default vault sits under `generated/`, which discovery skips and an adopter usually keeps out of git. A person who wants to keep the intent notes they write in the vault points `--out` at a directory of their own.

## Intent
- actor: A person in the repository who designs a capability in passes while an agent edits the carriers.
- problem: The Markdown Design Review offers no built-in Pack filters or navigation from arbitrary prose mentions to their entries, so a person iterating on a design still reads carrier files alongside it.
- outcome: Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.
- risk: A notes app invites editing, and an edit to a generated note never reaches the carrier.

## Behavior
- rule: [#ownProjection] The vault is a projection of its own, written only through its synchronization, which `sdp vault` and the verb that writes every projection root run, and no part of the Studio's page set.
- rule: [#verb] `sdp vault [root | --root PATH] [--exclude PATH]... [--out DIR] [--watch]` validates the graph as `sdp validate` does and then synchronizes the vault at `DIR`, by default `generated/obsidian-vault/` under the root; the root is given as an argument or by `--root`, never both, and defaults to the working directory, each exclusion is a root-relative path prefix as for the publishers, and `--out` resolves against the working directory; a root given both ways, `--root` or `--out` given twice or without a value, and any other option refuse the run.
- rule: [#outsideExtraction] A vault directory inside the root must lie under a directory discovery skips or under an excluded prefix, so no file in the vault is ever read as a carrier or a source; any other vault directory inside the root refuses the run before the build, writing and removing nothing.
- rule: [#apartFromBuild] A vault directory that is, lies inside or holds a path the shared build writes or removes, as `spec:consumers.obsidian-vault#design.buildOwnedPaths` lists, refuses the run before the build, writing and removing nothing, so no build ever removes a file in the vault.
- rule: [#ownedFolder] The command writes only the generated folder `sdp/` inside the vault; Obsidian's settings, a person's intent notes and every other file of the vault lie outside it and are never written, moved or removed.
- rule: [#guard] Before the build and before any cleanup, a run inspects `sdp/` and every entry under it, names that begin with a dot included, and refuses when `sdp/` or an entry under it is a symbolic link or neither a file nor a directory, when the file list is not well formed, when a file other than the file list, the command's own temporaries and a `.DS_Store` file is one the list does not name, or when a listed file other than a `.base` file has bytes matching no content the list records for it; a refused run writes nothing, removes nothing, names each such path and exits 1. A `.DS_Store` file under `sdp/` is ignored. A listed `.base` file whose bytes a person changed is kept, even when it leaves the generated set; the run warns with its path and the words `delete it to regenerate`, keeps its recorded content in the list, and goes on. Without a file list, every file under `sdp/` other than `.DS_Store` is one the list does not name.
- rule: [#synchronize] A run that passes the guard first removes each file the list names that the new set no longer holds, except a changed `.base` file; then it writes each generated file whose bytes differ from the file on disk through a temporary sibling renamed into place, except a changed `.base` file, leaves every file whose bytes already match untouched, removes every directory under `sdp/` left empty, and writes the file list last.
- rule: [#interruptedRun] Before it changes any file, a run records in the file list both the content each path holds and the content it will hold, so a run stopped at any point leaves every generated file other than a kept, changed `.base` file matching the list, and the next run recognizes each, and each whole temporary, as its own and completes the synchronization; a temporary cut short while it was written matches no recorded content, so the guard refuses it as unknown and the person deletes it.
- rule: [#standsApart] The vault is not one of the five projection roots the shared build rewrites: the build's invalidation never removes it, and the repository's projection suite does not certify it. The verb that writes every projection root also synchronizes the vault, at the directory `sdp vault` would use for the same root unless that verb names another, through the same directory checks and guard, before it publishes any root; a refusal there leaves the vault untouched and fails that run. `sdp vault` enters the shared build, so it removes the five projection roots as `sdp validate` does.
- rule: [#deterministic] Without kept, changed `.base` files, two runs over one graph write byte-identical files under `sdp/`, the file list included, and no file there holds a time, a commit, an absolute path or a host name.
- rule: [#linksResolve] Every wikilink, embed and block link a generated note writes resolves to a file the run wrote and, with a block, to a block id that file carries; no note links outside the vault, a carrier or source file is named by its root-relative path in a code span, and text in a code span or a fenced block, where Obsidian reads no link, is no link.
- rule: [#findingsShown] Findings never withhold the vault: a run over a graph with validation findings still synchronizes and returns the validation exit code. A finding whose subject is a Spec or a Pack with a note shows on that note; every other finding shows on the index with its severity, its validator, its file and line when known and its message; and the index counts every finding by severity.
- rule: [#failedExtraction] A run whose extraction fails keeps every generated file but the index and the file list: it rewrites the index to open with a warning naming the failure, through the steps `spec:consumers.obsidian-vault#rule.interruptedRun` and `spec:consumers.obsidian-vault#rule.synchronize` state, so the file list ends recording the warning index, and exits 1. The next run that succeeds finds the index matching the list and writes it whole again; with no earlier run, the failed run leaves only that index and the file list under `sdp/`.
- rule: [#plainNotes] Notes are plain Markdown with YAML properties, wikilinks and block ids, which other notes tools read; only the `.base` files are Obsidian's own.
- rule: [#openAsVault] A person opens the vault directory itself as an Obsidian vault, and every link and Base filter names its target by a path from that directory.

## Design
- layout: the generated folder `sdp/` holds `index.md`, `specs.base`, `specs/<family>/<note>.md`, `packs/<note>.md` beside `packs/<note>.base`, `code/<namespace>/<note>.md`, `terms/<note>.md` and the file list `.sdp-vault.json`; `<family>` is the first segment of a Spec's path, `<namespace>` a code unit's or anchor's namespace, and `<note>` the note name `spec:consumers.obsidian-vault.notes#design.noteName` states.
- fileList: `{ "schema": "sdp-vault/1", "files": { "<path under sdp/>": ["<sha256 hex of the file's bytes>"] } }` in `sdp/.sdp-vault.json`, paths sorted in code-unit order, JSON with two-space indentation and a closing newline; a path lists one content after a completed run and at most two while a run is under way, the content it held first.
- wellFormedList: a file list is well formed when it parses to the `fileList` shape, every path is relative to `sdp/`, `/`-separated, with no empty, `.` or `..` segment, and names neither the file list nor a temporary, every content is 64 lowercase hex digits, every path lists one or two contents, and the file's bytes equal the serialization `spec:consumers.obsidian-vault#design.fileList` states of what it parses to, so a repeated or reordered path is not well formed.
- temporaryName: a file is written as `.<name>.sdp-tmp` in its own directory and renamed over `<name>`; a temporary a run finds is the command's own only when its bytes match a content the file list records for `<name>`, and the run removes it after the guard passes; the file list's own temporary is the command's own only when it is itself a well-formed file list; any other file of a temporary's name is one the list does not name.
- buildOwnedPaths: under the root, `generated/graph.json`, `generated/contracts/`, `generated/registrars.json`, `generated/imports.json`, `generated/design-review/`, `generated/census/`, `generated/mermaid/`, `generated/gherkin/` and `generated/spec-studio/`, each with its `.tmp` sibling, and every path the shared build comes to write or remove.
- guardMessage: one stderr line per refused path, with `<path>` relative to the vault: `sdp vault: <path> is not a file this command wrote (unknown)`, `sdp vault: <path> has changed since this command wrote it (changed)`, `sdp vault: <path> is a link or a special file, which this command never writes (not a file)` or `sdp vault: sdp/.sdp-vault.json is not a file list this command wrote (malformed)`; then `sdp vault: nothing was written or removed; keep what you wrote outside sdp/, then delete each refused path, or delete sdp/ whole`.
- outsideExtractionMessage: `sdp vault: the vault <out> lies inside the root and would be read as source; choose a directory under generated/, under an excluded prefix, or outside the root`.
- buildOwnedMessage: `sdp vault: the vault <out> overlaps <path>, which every build rewrites or removes; choose another directory, such as generated/obsidian-vault/`, with `<path>` the first overlapping path in the order `spec:consumers.obsidian-vault#design.buildOwnedPaths` lists them.
- summaryLine: on stdout after a synchronization, `Wrote <out>/sdp (<n> files: <w> written, <u> unchanged, <r> removed)`.
- exitCodes: 0 when the vault is synchronized over a graph with no validation error; the validation exit code when it is synchronized over one with errors; 1 on a refused option, a refused vault directory, a guard refusal, a case collision, a failed extraction or a write that fails.
- indexNote: `sdp/index.md` opens with `` > [!info] Generated by `sdp vault` from the graph. Every file under `sdp/` is regenerated: write your own notes outside it, and intent notes in `intent/`. ``, then `# Spec graph`, the finding counts by severity, `## Findings without a note` with one line per finding whose subject has no Spec or Pack note, in report order, the corpus Base embedded, and a link to each Pack note in id order.
- findingLine: `- <severity> · <validator id> · <file>:<line> · <message>`, leaving out the file and line when the finding names none and the line when it names only a file, with the message escaped as `spec:consumers.obsidian-vault.notes#rule.textEscaped` states.
- failedIndex: after a failed extraction, `sdp/index.md` opens with `> [!warning] The last regeneration failed, and the notes show the graph of the last one that succeeded.` followed by one line per extraction error, its root-relative file and its message.

## Example space
The world writes a probe corpus of one Pack and its member Specs, runs the vault command with the vault under the root's `generated/` directory unless a point names another, and reads the vault from disk; a second run reads the same graph. The world leaves a stopped run's files by running the command with its first rename failing, which leaves the file list recording both contents and a whole temporary beside its target, and a failed run's files by running it while the member's carrier is one the extractor refuses, then repairing that carrier. A fresh vault is one the command writes into an empty directory from the same graph.

```gwt-vocabulary
Given an extraction root holding a Pack and its member Specs, among them {member:string}
Given the vault command names the vault directory {out:string}
Given a vault whose generated folder holds {generated:"nothing"|"the files an earlier run wrote"|"the files a run stopped at its first rename left"|"the files a run whose extraction failed left"}
Given the vault holds {extra:"no other file"|"an intent note and Obsidian settings outside the generated folder"|"a note a person wrote inside the generated folder"|"a file a person wrote inside the generated folder under a temporary's name"|"a generated note a person changed"}
Given the member {change:"stays in the corpus"|"leaves the corpus"|"changes its title"|"has a carrier the extractor refuses"}
When the vault command runs at that root
Then the run exits {exitCode:number}
Then the run refuses the path {refusedPath:string} as {refusal:"unknown"|"changed"}
Then the run refuses the vault directory as {placement:"overlapping a path the build owns"|"inside the extraction"}
Then the index note warns that the last regeneration failed: {indexWarns:boolean}
Then every generated file matches a content the file list records for it: {listMatches:boolean}
Then the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh:boolean}
Then a second run over the same graph leaves every generated file byte-identical: {byteIdentical:boolean}
Then the member's note is present: {memberNote:boolean}
Then every file the person wrote is byte-identical: {personFilesKept:boolean}
Then every link a generated note writes resolves inside the vault: {linksResolve:boolean}
```

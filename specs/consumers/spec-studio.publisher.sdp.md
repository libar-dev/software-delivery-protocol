---
id: spec:consumers.spec-studio.publisher
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:consumers.wholesale-view-rewrite
      reason: the Studio's root is written, invalidated and certified the way the shipped roots are
    - target: spec:consumers.validate-watch
      reason: the watch reruns on the carrier events validate's watch follows
  constrainedBy: spec:extraction.determinism
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: the Studio publishes to a root of its own beside the four frozen ones
---
# `sdp studio` publishes the Studio as one page set

The Studio has its own verb and root beside the four shipped publishers, and is written the way they are. Its page set opens from the file system and uploads to a static host unchanged. The run adds no stamp, commit or time of its own, so two runs over one graph and the same inputs write the same bytes, and a publishing step that wants build context writes its stamp beside the page set. While an author edits, the watch rebuilds the page set on each carrier change, and a person reloads the page to read it.

## Intent
- outcome: Publish the Studio under its own root as one page set the graph and its named inputs alone determine, which opens through `file://` and uploads to a static host unchanged.

## Behavior
- rule: [#verb] `sdp studio [root] [--exclude PATH]... [--check-clean | --watch] [--base PATH [--base-label TEXT]] [--runs PATH]...` validates the graph and writes the Studio's page set to `<root>/generated/spec-studio/`; `root` defaults to the working directory, and each exclusion is a root-relative path prefix, as for the shipped publishers.
- rule: [#inputFlags] `--base PATH` names the base graph, a JSON file `sdp build` wrote, and `--base-label TEXT` the words that name it on its pages; `--runs PATH` names one run record, a JSON file in the Common Test Report Format, and repeats, the records keeping their order. `--base-label` without `--base`, or `--base` given twice, is refused.
- rule: [#unreadableInput] An input file that cannot be read or does not hold JSON refuses the run before extraction, with exit 1 and one line on stderr naming the flag and the path; a JSON value a recipe cannot read shows on its page as that recipe's diagnostics.
- rule: [#ownRoot] A run writes nothing outside its root, writes no stamp, and leaves every carrier and source file under the root, and every input file, byte-identical.
- rule: [#wholesale] A run writes its page set to `generated/spec-studio.tmp/`, removes the prior root and renames the temporary into place, so no page of an earlier run survives a later one and no temporary survives a completed run.
- rule: [#buildInvalidates] Every command that enters the shared build, `sdp studio` among them, removes `generated/spec-studio/` and its temporary sibling before extraction, beside the four roots `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` names; a removal failure refuses the command before extraction.
- rule: [#checkClean] `sdp studio --check-clean` renders an independent twin and refuses divergent renders, then compares the current root with the new render; missing or drifted output returns nonzero and is removed, and clean output is replaced wholesale with byte-identical content.
- rule: [#findingsShown] Findings never withhold the page set: a run over a graph with validation findings still publishes and returns the validation exit code, and each finding shows on the index, and also on its subject's page when its subject is a Spec or a Pack. A run whose extraction fails publishes nothing and returns nonzero.
- rule: [#pageSet] The page set holds `index.html`, `search.html`, `architecture.html`, `tests.html`, `evidence.html`, `queue.html`, `questions.html`, `decisions.html`, `declarations.html`, `backlog.html` and `glossary.html`; `diff.html` given a base graph and `runs.html` given run records; one `packs/<name>.html` and one `exports/<name>.html` per Pack; one `specs/<name>.html` per Spec; and `assets/studio.css` and `assets/studio.js`. `<name>` is the id after its namespace, with each uppercase ASCII letter written as `_` and its lowercase, so no two pages collide on a file system that ignores case.
- rule: [#deterministic] Two runs over one graph and the same inputs write byte-identical files, and no file holds a time, a commit, an absolute path or a host name of the run's own; a value an input carries, such as a run's commit and times, shows only on the pages that name that input.
- rule: [#linksResolve] Every link a page writes stays inside the page set: it resolves to a page the run wrote and, with a fragment, to an element id that page carries, apart from the search page's term fragment `search.html#q=<term>`, which names no element. No page links a carrier or source file, an editor URI or an external address; the only link that leaves the page set is one the stamp element adds in the browser from a present stamp's source template.
- rule: [#watch] `sdp studio --watch` installs the carrier watcher validate's watch installs, publishes once at start and again after every carrier create, change, delete or rename, each cycle writing the page set a plain `sdp studio` with the same arguments writes, byte for byte; it serves no page and injects no script, so a reader reloads to read the new build. Findings print each cycle and the process stays alive; a cycle whose extraction fails removes the page set; operator SIGINT exits 0; edits to source files and input files start no cycle; `--watch` cannot combine with `--check-clean`.

## Example space
```gwt-vocabulary
Given an extraction root holding {corpus:"a Pack and its member Specs"|"a Spec with a validation error"|"a carrier the extractor refuses"} and a stale Studio page {stalePage:string}
When the studio command runs at that root {run:"twice"|"twice with check-clean"|"under watch while one member carrier changes twice"}
Then each run exits {exitCode:number}
Then the page set holds the entry page {entryPage:string}
Then the two runs wrote byte-identical files: {byteIdentical:boolean}
Then each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun:boolean}
Then the page set holds a script the plain run does not write: {injectedScript:boolean}
Then the stale page survives: {staleSurvives:boolean}
Then a temporary Studio sibling survives: {temporarySurvives:boolean}
Then every carrier and source file under the root stays byte-identical: {rootUntouched:boolean}
Then every link a page writes resolves inside the page set: {linksResolve:boolean}
```

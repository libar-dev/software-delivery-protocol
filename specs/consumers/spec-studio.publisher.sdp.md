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
  constrainedBy: spec:extraction.determinism
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: the Studio publishes to a root of its own beside the four frozen ones
---
# `sdp studio` publishes the Studio as one page set

The Studio has its own verb and root beside the four shipped publishers, and is written the way they are. Its page set opens from the file system and uploads to a static host unchanged. The run adds no stamp, commit or time, so two runs over one graph write the same bytes, and a publishing step that wants build context writes its stamp beside the page set.

## Intent
- outcome: Publish the Studio under its own root as one page set the graph alone determines, which opens through `file://` and uploads to a static host unchanged.

## Behavior
- rule: [#verb] `sdp studio [root] [--exclude PATH]... [--check-clean]` validates the graph and writes the Studio's page set to `<root>/generated/spec-studio/`; `root` defaults to the working directory, and each exclusion is a root-relative path prefix, as for the shipped publishers.
- rule: [#ownRoot] A run writes nothing outside its root, writes no stamp, and leaves every carrier and source file under the root byte-identical.
- rule: [#wholesale] A run writes its page set to `generated/spec-studio.tmp/`, removes the prior root and renames the temporary into place, so no page of an earlier run survives a later one and no temporary survives a completed run.
- rule: [#buildInvalidates] Every command that enters the shared build, `sdp studio` among them, removes `generated/spec-studio/` and its temporary sibling before extraction, beside the four roots `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` names; a removal failure refuses the command before extraction.
- rule: [#checkClean] `sdp studio --check-clean` renders an independent twin and refuses divergent renders, then compares the current root with the new render; missing or drifted output returns nonzero and is removed, and clean output is replaced wholesale with byte-identical content.
- rule: [#findingsShown] Findings never withhold the page set: a run over a graph with validation findings still publishes and returns the validation exit code, and each finding shows on the index, and also on its subject's page when its subject is a Spec or a Pack. A run whose extraction fails publishes nothing and returns nonzero.
- rule: [#pageSet] The page set holds `index.html`, `search.html`, one `packs/<name>.html` per Pack, one `specs/<name>.html` per Spec, and `assets/studio.css` and `assets/studio.js`. `<name>` is the id after its namespace, with each uppercase ASCII letter written as `_` and its lowercase, so no two pages collide on a file system that ignores case.
- rule: [#deterministic] Two runs over one graph write byte-identical files, and no file holds a time, a commit, an absolute path or a host name.
- rule: [#linksResolve] Every link a page writes stays inside the page set: it resolves to a page the run wrote and, with a fragment, to an element id that page carries, apart from the search page's term fragment `search.html#q=<term>`, which names no element. No page links a carrier or source file, an editor URI or an external address.

## Example space
```gwt-vocabulary
Given an extraction root holding {corpus:"a Pack and its member Specs"|"a Spec with a validation error"|"a carrier the extractor refuses"} and a stale Studio page {stalePage:string}
When the studio command runs twice at that root, with check-clean {checkClean:boolean}
Then each run exits {exitCode:number}
Then the page set holds the entry page {entryPage:string}
Then the two runs wrote byte-identical files: {byteIdentical:boolean}
Then the stale page survives: {staleSurvives:boolean}
Then a temporary Studio sibling survives: {temporarySurvives:boolean}
Then every carrier and source file under the root stays byte-identical: {rootUntouched:boolean}
Then every link a page writes resolves inside the page set: {linksResolve:boolean}
```

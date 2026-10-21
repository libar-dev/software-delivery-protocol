---
id: spec:consumers.spec-studio.publisher.watch
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.publisher
  dependsOn:
    target: spec:consumers.validate-watch
    reason: the watch reruns on the carrier events validate's watch follows
---
# `sdp studio --watch` rebuilds the page set on each carrier change

While an author edits, the watch rebuilds the page set on each carrier change, and a person reloads the page to read it. Each cycle writes exactly what a plain run with the same arguments writes, so the watch adds no server, no live reload and no script of its own.

## Intent
- outcome: Rebuild the Studio's page set on every carrier change while an author edits, each cycle byte for byte what a plain run writes, with no server and no injected script.

## Behavior
- rule: [#watch] `sdp studio --watch` installs the carrier watcher validate's watch installs, publishes once at start and again after every carrier create, change, delete or rename, each cycle writing the page set a plain `sdp studio` with the same arguments writes, byte for byte; it serves no page and injects no script, so a reader reloads to read the new build. Findings print each cycle and the process stays alive; a cycle whose extraction fails removes the page set; operator SIGINT exits 0; edits to source files and input files start no cycle; `--watch` cannot combine with `--check-clean`.

## Example space
```gwt-vocabulary
Given an extraction root holding a Pack and its member Specs and a stale Studio page {stalePage:string}
When the studio command runs under watch at that root while one member carrier changes {changes:number} times
Then the watch exits {exitCode:number} on SIGINT
Then each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun:boolean}
Then the page set holds a script the plain run does not write: {injectedScript:boolean}
Then the stale page survives: {staleSurvives:boolean}
Then a temporary Studio sibling survives: {temporarySurvives:boolean}
```

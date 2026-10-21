---
id: spec:consumers.validate-watch
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.authoring-on-ramp
  dependsOn:
    - spec:decisions.one-validation-path
    - spec:extraction.excludes
---
# Validation re-runs while an author edits carriers

## Intent
- problem: An author editing a Spec re-runs `sdp validate` by hand after every save.
- outcome: Let `sdp validate --watch` re-run the one validation path on every carrier change and stay alive after findings, as a loop for authoring and never a second validation path.

## Behavior
- rule: `sdp validate --watch [root]` installs its watcher first, then runs the same validate path `sdp validate` runs, from scratch, once at start and again after every carrier create, change, delete or rename under the root.
- rule: A carrier ends in `.sdp.md`, `.sdp.gherkin` or `.sdp.ts`. The watcher ignores the directories discovery skips, the configured exclusion prefixes and every non-carrier path other than the rules files and parameter files `--rules` names, which it watches wherever they live, as `spec:validation.corpus-rules#rule.watchReruns` states; a removed watched directory and an event with no filename each schedule a run because their affected carriers cannot be named.
- rule: Events that arrive while a run is in progress coalesce into one pending run.
- rule: [#operatorStop] Findings print as `sdp validate` prints them and the process stays alive; operator SIGINT terminates the process with exit 0 even while a rules body is active, without waiting for it. No further rules file runs or output is written after the stop.
- rule: `--watch` is a validate option only and cannot combine with `--check-clean`. It re-runs on carrier edits and on edits to the files `--rules` names, and never on source edits, so an author re-runs validation after editing an anchor.

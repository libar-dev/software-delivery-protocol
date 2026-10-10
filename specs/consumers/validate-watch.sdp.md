---
id: spec:consumers.validate-watch
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.authoring-on-ramp
  dependsOn: spec:decisions.one-validation-path
---
# Validation re-runs while an author edits carriers

## Intent
- problem: An author editing a Spec re-runs `sdp validate` by hand after every save, and the watch loop that removes that step shipped in plan 35 with no Spec stating what it promises.
- outcome: Let `sdp validate --watch` re-run the one validation path on every carrier change and stay alive after findings, as a loop for authoring and never a second validation path.

## Behavior
- rule: `sdp validate --watch [root]` installs its watcher first, then runs the same validate path `sdp validate` runs, from scratch, once at start and again after every carrier create, change, delete or rename under the root.
- rule: A carrier is a file ending in `.sdp.md`, `.sdp.gherkin` or `.sdp.ts`. The watcher ignores `generated`, `dist`, `node_modules`, `coverage`, dot-directories, the configured `--exclude` prefixes and every non-carrier path; a removed watched directory and an event with no filename each schedule a run, because the carriers they stand for cannot be named.
- rule: Events that arrive while a run is in progress coalesce into one pending run.
- rule: Findings print as `sdp validate` prints them and the process stays alive; an operator stop exits 0.
- rule: `--watch` is a validate option only and cannot combine with `--check-clean`. It re-runs on carrier edits and never on source edits, so an author re-runs validation after editing an anchor.
- rule: The realizing site is `runValidateWatch` in `src/cli/validate-watch.ts`.

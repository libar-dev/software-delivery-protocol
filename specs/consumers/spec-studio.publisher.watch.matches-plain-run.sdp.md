---
id: spec:consumers.spec-studio.publisher.watch.matches-plain-run
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.publisher.watch
  verifies:
    target: spec:consumers.spec-studio.publisher.watch
    exercises: [watch]
---
# Each watch cycle writes the page set a plain run writes

## Intent
- outcome: Execute the watch on a root whose member carrier changes, and hold each cycle's page set to a plain run's.
- assumption: The world writes a root with one Pack of two member Specs and plants the stale page, starts the watch through the command's watch hooks, changes the first member's title twice, waiting for each cycle, and after each cycle runs a plain studio command over a copy of the root as it stands and compares the two page sets file by file; it then stops the watch with SIGINT and reads the exit code.

```gwt
Given an extraction root holding a Pack and its member Specs and a stale Studio page {stalePage: "specs/probe.departed.html"}
When the studio command runs under watch at that root while one member carrier changes {changes: 2} times
Then the watch exits {exitCode: 0} on SIGINT
Then each watch cycle wrote the page set a plain run writes: {cyclesMatchPlainRun: true}
Then the page set holds a script the plain run does not write: {injectedScript: false}
Then the stale page survives: {staleSurvives: false}
Then a temporary Studio sibling survives: {temporarySurvives: false}
```

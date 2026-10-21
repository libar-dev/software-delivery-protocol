---
id: spec:consumers.command-line.verb-help-touches-nothing
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.command-line
  verifies:
    target: spec:consumers.command-line
    exercises: [verbHelp, oneHelpText]
---
# A publisher's --help prints its help and touches no root

## Intent
- outcome: Execute the help rule on a publisher whose build would otherwise remove every projection root.
- assumption: The world writes the extraction root and stale pages of the generate example, runs `sdp view --help` on it, checks that standard output holds the view's usage line and its paragraph from `sdp --help`, and that every stale page is still in place.

```gwt
Given an extraction root holding two authored Specs and {roots: "a stale page in each of the five projection roots"}
When the command {command: "sdp view --help"} runs at that root
Then the command exits {exitCode: 0}
Then the stale pages survive: {staleSurvive: true}
Then the roots holding the current pages for those Specs are {currentRoots: ""}
Then the absent projection roots are {absentRoots: ""}
Then standard output opens with the line {firstLine: "Usage:"}
```

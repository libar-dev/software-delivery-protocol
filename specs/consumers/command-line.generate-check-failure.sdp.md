---
id: spec:consumers.command-line.generate-check-failure
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.command-line
  verifies:
    target: spec:consumers.command-line
    exercises: [generateCheck]
---
# A root that fails its check is removed while sdp generate writes the others

## Intent
- outcome: Execute the check rule of the all-roots verb over five current roots, one of which holds a page its publisher would not write.
- assumption: The world writes the extraction root of the generate example, runs `sdp generate` on it so every root is current, since each publisher alone would leave only its own root, then plants one stale page in the census root. It runs `sdp generate --check-clean` on the root, then checks that the census root is gone and that each other root's files equal the files its own publisher writes when run alone on a copy of the same root. Lists of roots read as in the generate example.

```gwt
Given an extraction root holding two authored Specs and {roots: "five current projection roots, one stale page planted in the census root"}
When the command {command: "sdp generate --check-clean"} runs at that root
Then the command exits {exitCode: 1}
Then the stale pages survive: {staleSurvive: false}
Then the roots holding the current pages for those Specs are {currentRoots: "design-review, mermaid, gherkin, spec-studio"}
Then the absent projection roots are {absentRoots: "census"}
```

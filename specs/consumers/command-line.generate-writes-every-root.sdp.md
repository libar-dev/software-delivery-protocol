---
id: spec:consumers.command-line.generate-writes-every-root
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.command-line
  verifies:
    target: spec:consumers.command-line
    exercises: [generateVerb, sameBytes, generateExit]
---
# One run of sdp generate leaves all five roots current

## Intent
- outcome: Execute the all-roots verb over a root whose five projection roots each hold a stale page.
- assumption: The world writes an extraction root of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol's validators report no finding, and plants one stale page in each of the five projection roots. It runs `sdp generate` on the root, then checks that no stale page survives and that each root's files equal the files its own publisher writes when run alone on a copy of the same root.

```gwt
Given an extraction root holding one authored Spec and a stale page in each of the five projection roots
When the command {command: "sdp generate"} runs at that root
Then the command exits {exitCode: 0}
Then the stale pages survive: {staleSurvive: false}
Then every projection root holds the current pages for that Spec: {current: true}
```

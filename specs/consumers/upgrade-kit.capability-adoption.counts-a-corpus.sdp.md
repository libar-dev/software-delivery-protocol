---
id: spec:consumers.upgrade-kit.capability-adoption.counts-a-corpus
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.upgrade-kit.capability-adoption
  verifies:
    target: spec:consumers.upgrade-kit.capability-adoption
    exercises: [capabilityRows, outsideTheGraph]
---
# Capability adoption counts keyed rules and reasoned relations

## Intent
- outcome: Execute the capability rows on a probe corpus with known counts of keyed rules and reasoned relations, and no perspectives passed.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome. The first carries three rules, one of them keyed, and declares `dependsOn` on the second with a reason; the second carries no rule and declares `refines` on the first with no reason. It runs the shipped capability adoption file through `sdp q --json` with no parameters; a row reads `<inUse> of <applicable>`, and `null` when a count is null.

```gwt
Given a probe corpus with {rules: 3} rule entries of which {keyed: 1} carry a key, and {relations: 2} authored relations of which {reasons: 1} carry a reason
When capability adoption runs over it without perspectives
Then the rule-key row reads {ruleKeys: "1 of 3"}
Then the relation-reason row reads {relationReasons: "1 of 2"}
Then the perspectives row reads {perspectives: "null of null"}
```

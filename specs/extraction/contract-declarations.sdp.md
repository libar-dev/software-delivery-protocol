---
id: spec:extraction.contract-declarations
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:extraction.executable-contracts
  dependsOn: spec:carrier.inline-code-spans
  decidedBy: spec:decisions.typing-law
---
# Contract declarations derive a compilable module

## Intent
- problem: Signatures and types in a design are code, yet an author writes them as prose entries no compiler reads, so a name used and never declared, or declared twice, is found only by a reviewer.
- outcome: Give contract content a closed typed section whose declarations derive one compilable module per corpus, so a Spec that disagrees with its code fails the build the way a step contract does.

### Open questions
- [blocking] This Spec re-enters on evidence. Has code first had to agree with signatures authored at design time, or has a second adopter authored signatures in a Design section? Until one holds, the declaration shape stays unruled.
- [blocking] Does an opaque, language-tagged fence owned by one keyed entry fit the carrier ruling's small owned grammar, or does it need a decision of its own?
- [non-blocking] When the contract section lands, the `contract` row of the kind-evidence table repoints to it. Which evidence counts as present, and which as complete?

## Behavior

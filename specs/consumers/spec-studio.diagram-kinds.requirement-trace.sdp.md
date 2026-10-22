---
id: spec:consumers.spec-studio.diagram-kinds.requirement-trace
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.data
---
# A requirement drawing separates intent from realization and verification

## Intent
- outcome: Read a Spec's refinement, satisfying code and verifier bindings in one picture without mistaking a declared example for a running test.

## Behavior
- rule: [#exactEdges] For the Spec page's selected set, draw declared refines, declared and anchored verifies, and anchored satisfies edges incident on the set, plus anchored verifies on its declared verifying examples. Draw code references and oracle models only as their own named kinds, never as realization or successful verification.
- rule: [#claimsApart] Every box and edge names its claim. A declared verifying example with no resolving test says `no test binding`; an anchored verifier says `binding present`, never passed. Missing satisfies says `no satisfying binding`, never unimplemented by inference through a child.
- rule: [#fold] Above the shared bound, fold the largest group by edge kind, direction and claim, ties in that lexical order, until it fits. Keep every original edge and box in the text equivalent. If the fold still cannot fit, omit the drawing and open its text.

## Design
- placement: On a Spec page the requirement drawing replaces the realization drawing under its heading; its set is the Spec, the Specs that refine it, and the examples that verify any of them.
- bands: Place intended Specs, declared verifying examples, satisfying or referencing units, and test or oracle bindings in labelled bands. A node reached in several bands has one placement at its first band and keeps every edge. Empty bands state which binding or intent is absent.
- wordsBesideStyle: Box subtitles say `declared Spec`, `anchored code`, `anchored test binding` or `anchored oracle binding`; edge labels carry both the exact relation and claim. Verification modes, risk levels and assertion results are not invented.
- textEquivalent: List every full id and title or binding label, each binding's file and line, every exact edge with its claim and reason, and examples with no test binding. This drawing replaces the realization drawing and complements the detailed verification panels.
- elementIds: Use `diagram.<subject>.requirement.text`, `.requirement.arrow` and `.requirement.fold.<kind>.<direction>.<claim>`.
- mermaidKind: `requirementDiagram` for the exact refines, satisfies and verifies subset, generic requirement nodes and element nodes for code and bindings; omit risk and verifyMethod. Put claim words in node text and per-edge comments. Use `flowchart TB` with exact labels when references, models or folds require relations requirement syntax cannot express; never rename them traces.

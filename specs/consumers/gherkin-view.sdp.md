---
id: spec:consumers.gherkin-view
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    - target: spec:consumers.wholesale-view-rewrite
      reason: the shared build invalidates the projection roots before this publisher renders
  decidedBy:
    - spec:decisions.carrier-universality
    - spec:decisions.shipped-projections-frozen
    - target: spec:decisions.prose-ownership
      reason: description prose stays on its typed graph owner
---
# Gherkin view renders any Spec as a disposable read shape

## Intent
- outcome: Give maintainers a generated Gherkin-shaped page for reading any Spec, without making it a carrier, changing the default carrier or claiming conversion back to the authored Spec.

## Behavior
- rule: `renderGherkinView` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.
- rule: Every Spec renders as one Gherkin-shaped page plus one deterministic index. Pages use `spec/<id body>.feature.md`, with the `spec:` namespace removed from the id. Packs are not projected. The projection never uses `.sdp.gherkin` and never claims round-trip parity.
- rule: Each page says it is generated and disposable. A page for a kind the Gherkin carrier does not carry has a `# LOSSY:` comment in its header giving that kind's reason, and content Gherkin cannot carry honestly is marked the same way rather than invented as structure.
- rule: Description prose lands only on the narrative and keyed description bullets under the prose-ownership decision, `spec:decisions.prose-ownership`; the projection never emits DocStrings, DataTables, Scenario Outlines, Examples tables, backgrounds, star steps or leading conjunctions.
- rule: Every emitted record is ordered by deterministic code-unit order independent of graph input order. Hostile characters are escaped so they cannot close a fence or invent a DocString.
- rule: After the shared build, publication owns only `generated/gherkin/` and uses the explicit `sdp gherkin` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.
- rule: A Gherkin-view run writes its complete page set to `generated/gherkin.tmp/`, removes the prior Gherkin-view root, and renames the temporary root into place. The shared build invalidates this root and all sibling projection roots before extraction, as `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` states, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Gherkin-view root it cannot certify.
- rule: `sdp gherkin --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.
- rule: When extraction succeeds but graph validation reports errors, the Gherkin view still publishes the labelled diagnostic projection and returns the nonzero validation exit code.
- rule: The projection adds no Gherkin-specific Reader accessors and confers nothing back into the graph.

## Example space
```gwt-vocabulary
Given a graph containing behavior, example, and refused-kind Specs with hostile titles
When the Gherkin-view projection renders and publishes through the explicit gherkin command
Then each Spec page is a visibly generated Gherkin-shaped read
Then refused-kind pages carry the per-kind lie-reason as lossy commentary
Then a clean independent render is byte-identical
Then hostile characters cannot close a fence or invent a DocString
Then generated/gherkin/ is the only current Gherkin-view root
Then validation errors label the index as a diagnostic projection
Then no page uses the .sdp.gherkin suffix
```

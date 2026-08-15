---
id: spec:consumers.gherkin-view
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  decidedBy: spec:decisions.carrier-universality
---
# Gherkin view renders any Spec as a disposable read shape

## Intent
- outcome: Give maintainers a generated Gherkin-shaped READ projection of any Spec without creating a second carrier, a default flip, or round-trip parity.

## Behavior
- rule: `renderGherkinView` is a pure `Reader -> pages` projection with no filesystem or clock access; equal reader data produces byte-identical pages.
- rule: Every Spec renders as one Gherkin-shaped page plus one deterministic index. Packs are not projected. The projection never uses `.sdp.gherkin` and never claims round-trip parity.
- rule: Each page is visibly generated and disposable. Refused kinds carry lossy commentary naming the per-kind lie-reason; content Gherkin cannot carry honestly is marked the same way rather than invented as structure.
- rule: Description prose lands only on MD-19's existing owners — narrative or keyed description bullets — and the projection never emits DocStrings, DataTables, Scenario Outlines, Examples tables, backgrounds, star steps, or leading conjunctions.
- rule: Every emitted record is ordered by deterministic code-unit order independent of graph input order. Hostile characters are escaped so they cannot close a fence or invent a DocString.
- rule: Publication owns only `generated/gherkin/` and uses the explicit `sdp gherkin` surface. It is not a child of or an extra write inside Design Review's transaction, and it shares no publication bus or hidden side channel with other projections.
- rule: A Gherkin-view run writes its complete page set to `generated/gherkin.tmp/`, removes the prior Gherkin-view root, and renames the temporary root into place. Every build attempt invalidates both Gherkin-view roots before extraction, so failure leaves honest absence rather than stale output that looks current. A failed publish removes any live or temporary Gherkin-view root it cannot certify.
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
Then no page uses the .sdp.gherkin suffix
```

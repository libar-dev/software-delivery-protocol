---
id: spec:validation.duplicate-ids
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:validation.two-check-families
    reason: duplicate identity is a conformance refusal
  dependsOn:
    target: spec:carrier.markdown-parser
    reason: duplicate exclusion includes the default Markdown carrier
---
# Duplicate carrier IDs are excluded loudly

## Intent
- outcome: Prevent ambiguous authored identity from entering the graph.

## Behavior
- rule: If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.
- rule: Over a graph from any producer, every node whose id is carried by another node receives a conformance/duplicate-ids error; the extractor separately excludes ambiguous authored carriers through extract/duplicate-id.

## Example space
```gwt-vocabulary
Given a {firstCarrier:string} carrier declares {specId:string}
Given a {secondCarrier:string} carrier declares {specId:string}
When the extraction root is read
Then both sites report {findingId:string}
Then no graph node is emitted for {specId:string}
```

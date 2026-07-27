---
id: spec:consumers.agent-surface.scripted-context-body
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  verifies: spec:consumers.agent-surface
---
# A scripted body returns claim-decoded context, pre-shaped by the body

## Intent
- outcome: Execute the whole path an agent uses — a root, the extractor, the graph, the injected reader, one scripted body — and read back the decode a hand-rolled join gets wrong.

```gwt
Given an extraction root the front door derives in process on the invocation
Given the corpus binds the spec {specId: "spec:orders.create-order"} to one anchored verifier and one declared-only verifier
When the agent scripts a body {body: "composing that spec's verifier bindings"} through the front door
Then the front door exits {exitCode: 0} with an empty error stream
Then the printed answer is exactly the body's pre-shaped return {printedAnswer: "spec:orders.create-order.empty-cart is a declared verifier · spec:orders.create-order.valid-cart is an enabled verifier"}
Then the anchored verifier {anchoredVerifierId: "spec:orders.create-order.valid-cart"} decodes as enabled while the declared-only verifier {declaredVerifierId: "spec:orders.create-order.empty-cart"} does not
```

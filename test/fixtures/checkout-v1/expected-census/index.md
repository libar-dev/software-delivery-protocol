# Census

A disposable projection of the one graph (schema `0.9.0`): 17 nodes · 32 edges · 11 Specs.

## Spec kinds

| Value | Display label | Count |
| --- | --- | ---: |
| `behavior` | Use Case / Behavior | 2 |
| `workflow` | Workflow | 1 |
| `example` | Example / Scenario | 2 |
| `rule` | Business Rule | 2 |
| `constraint` | Constraint (NFR) | 1 |
| `model` | Domain Model | 1 |
| `decision` | Decision Record | 1 |
| `contract` | Contract | 1 |

## Spec altitudes

| Value | Count |
| --- | ---: |
| `epic` | 1 |
| `feature` | 3 |
| `story` | 7 |

## Stated readiness

| Value | Count |
| --- | ---: |
| `idea` | 1 |
| `scoped` | 1 |
| `defined` | 8 |
| `ready` | 1 |

## Derived readiness

| Value | Count |
| --- | ---: |
| `idea` | 1 |
| `scoped` | 1 |
| `defined` | 0 |
| `ready` | 9 |
| not structurally reached | 0 |

## Graph node types

| Value | Count |
| --- | ---: |
| `Primitive` | 11 |
| `Pack` | 1 |
| `Anchor` | 2 |
| `CodeNode` | 3 |

## Graph node claims

| Value | Count |
| --- | ---: |
| `declared` | 12 |
| `anchored` | 5 |
| `inferred` | 0 |

## Delivery facts

| Value | Count |
| --- | ---: |
| `implemented` | 2 |
| `has-verifier` | 2 |
| `observed` | 0 |

## Graph edge types

| Value | Count |
| --- | ---: |
| `refines` | 10 |
| `dependsOn` | 1 |
| `constrainedBy` | 1 |
| `decidedBy` | 2 |
| `verifies` | 3 |
| `supersedes` | 0 |
| `belongsTo` | 11 |
| `satisfies` | 3 |
| `models` | 1 |
| `memberOf` | 0 |
| `uses` | 0 |
| `references` | 0 |

## Graph edge claims

| Value | Count |
| --- | ---: |
| `declared` | 27 |
| `anchored` | 5 |
| `inferred` | 0 |

## Anchor flavor

Anchor flavor is the binding node type plus its ID namespace plus each outgoing binding edge.

| Node type | Namespace | Binding edge | Count |
| --- | --- | --- | ---: |
| Anchor | `oracle` | `models` | 1 |
| Anchor | `test` | `verifies` | 1 |
| CodeNode | `api` | `satisfies` | 1 |
| CodeNode | `impl` | `satisfies` | 2 |

## Structural bindings

Anchored `memberOf`, `uses`, and `references` edges and the `role`, `layer`, and `context` attributes of code units are rendered as structure; they confer no delivery fact or readiness. Units are counted apart from edges.

| Structure | Count |
| --- | ---: |
| Code units | 3 |
| Component units | 0 |
| `memberOf` edges | 0 |
| `uses` edges | 0 |
| `references` edges | 0 |

No structural bindings exist.

## Findings

No findings.

*Generated from the one graph by `sdp census` — read-only; regenerate to update.*

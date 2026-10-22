---
id: spec:consumers.spec-studio.diagram-kinds.edge-routing
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagrams
---
# Edges route around boxes with deterministic orthogonal paths

## Intent
- outcome: Follow an arrow without it crossing a box or covering a label, using the engine's own static layout.

## Contract
- [#obstacles] After box placement and label wrapping, reserve each box and band label rectangle as an obstacle with clearance. An edge may touch only its own source and destination ports; no other segment may intersect a reserved rectangle's interior.
- [#routes] Route edges deterministically in code-unit order by from, to, kind and claim with orthogonal whole-pixel paths around the reserved obstacles. Add no layout dependency and read no browser measurement. The build owns the search representation, weights and tie-break implementation.
- [#ports] Choose source and destination sides deterministically for forward, same-band and backward edges. Every incident edge has its own port. A cycle and a backward edge remain directed and route around intervening boxes.
- [#labels] Reserve an edge label's rectangle beside a free segment. If the exact relation and claim words do not fit, use a stable edge key and name its full wording in the adjacent legend and text equivalent. Every placed label rectangle is an obstacle for later labels and routes; no two labels overlap. An edge carries a label only where spec:consumers.spec-studio.diagrams#rule.wordsBesideStyle asks for one; a drawing whose edges share one relation and one claim names them once in its legend.
- [#noPath] If any required route, distinct lane or label cannot be placed within the deterministic routing budget, omit that SVG and open its text equivalent with an explicit routing explanation. Never draw a straight line through a box as fallback.

## Design
- clearance: `12` logical pixels around boxes and text, with ports connected through their own clearance by a stub. Lane spacing is `8` pixels and gutter margin is `24` pixels; all coordinates and costs are integers.
- cost: Crossings remain permitted at free points, never through nodes or labels. Two edges never share a collinear segment: they take distinct ports and lanes `8` pixels apart, and an edge that cannot get a lane is a routing failure under the no-path rule.
- searchBound: The build chooses a finite deterministic search budget and tests its routing-failure explanation; tuning the search changes no graph meaning. The shared box and edge bound applies first.
- overflow: Routing gutters may increase SVG width beyond the box layout budget to preserve distinct lanes; the desktop scroll instruction follows that final width. No label is shrunk to fit.
- routeModel: Each route retains from, to, kind, claim, optional aggregation count and relation reason, plus its integer point list; ports and routes are presentation values, never graph edges.
- elementIds: Preserve `.edge` data-from, data-to and data-kind, add data-claim when present and a stable data-edge-key for legend lookup; arrow marker ids remain scoped to subject and view.

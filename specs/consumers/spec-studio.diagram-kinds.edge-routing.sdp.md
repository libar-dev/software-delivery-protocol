---
id: spec:consumers.spec-studio.diagram-kinds.edge-routing
kind: contract
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.diagrams
---
# Edges route around boxes with deterministic orthogonal paths

## Intent
- outcome: Follow an arrow without it crossing a box or covering a label, using the engine's own static layout.

## Contract
- [#obstacles] After box placement and label wrapping, reserve each box and band label rectangle as an obstacle with clearance. An edge may touch only its own source and destination ports; no other segment may intersect a reserved rectangle's interior.
- [#routes] Route edges in code-unit order by from, to, kind and claim. Search a whole-pixel orthogonal visibility grid of obstacle boundaries, port stubs and outer gutters. Minimize path length plus bend and occupied-segment penalties, ties by coordinate sequence. Add no layout dependency and read no browser measurement.
- [#ports] Choose source and destination sides by band direction, then deterministic nearest-side order for same-band or backward edges. Parallel edges get distinct ports and lanes where space allows. A cycle and a backward edge remain directed and use outer gutters rather than traversing intervening boxes.
- [#labels] Reserve an edge label's rectangle on a free horizontal segment. If no segment fits the exact relation and claim words, use a stable edge key beside the route and list that key's full wording in the adjacent legend and complete text. Never hide the relation to save space.
- [#noPath] If any required route or edge key cannot be placed within the deterministic routing budget, omit that SVG and open the complete text with an explicit routing explanation. Never draw a straight line through a box as fallback.

## Design
- clearance: `12` logical pixels around boxes and text, with ports connected through their own clearance by a stub. Lane spacing is `8` pixels and gutter margin is `24` pixels; all coordinates and costs are integers.
- cost: `length + 24 * bends + 40 * occupiedSegments`, with ties by the full sequence of x then y coordinates in numeric lexicographic order. Crossings remain permitted at free points, never through nodes or labels; shared segments are penalized, not silently treated as bundled relations.
- searchBound: At most `256` distinct x coordinates, `256` distinct y coordinates and `65536` visibility vertices per drawing. Deduplicate coordinates before search, and omit with complete text if the bound is exceeded. The shared box and edge bound still applies first.
- routeModel: Each route retains from, to, kind, claim, optional aggregation count and relation reason, plus its integer point list; ports and routes are presentation values, never graph edges.
- elementIds: Preserve `.edge` data-from, data-to and data-kind, add data-claim when present and a stable data-edge-key for legend lookup; arrow marker ids remain scoped to subject and view.

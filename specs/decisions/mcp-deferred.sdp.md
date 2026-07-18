---
id: spec:decisions.mcp-deferred
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
---
# MCP integration remains deferred

## Intent
- outcome: Preserve a clean projection model without prematurely fixing an application integration surface.

## Decision
- context: The graph already supports typed agent and human projections without an MCP transport.
- decision: MCP integration is deferred until a concrete caller establishes its boundary and contract.
- rationale: Adding an MCP surface without a caller invents verbs and persistence choices outside the projection model.
- consequence: Consumers use the current graph and reader surfaces while MCP remains designed-in rather than claimed.

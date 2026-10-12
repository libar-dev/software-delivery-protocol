import type { GraphSchema } from "../../src/graph/schema.js";
import { serializeGraph } from "../../src/extract/serialize.js";

/** Carrier parity and node goldens exclude the carrier-specific location table. */
export function serializeGraphStructure(graph: GraphSchema): string {
  const { schemaVersion, nodes, edges } = JSON.parse(serializeGraph(graph)) as GraphSchema;
  return `${JSON.stringify({ schemaVersion, nodes, edges }, null, 2)}\n`;
}

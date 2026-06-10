import { describe, expect, it } from "vitest";

import {
  deliveryFactNames,
  derivedEdgeTypes,
  graphEdgeTypes,
  graphNodeTypes,
  schemaVersion,
} from "../src/index.js";

describe("graph schema", () => {
  it("exports the graph schema contracts", () => {
    expect(schemaVersion).toBe("0.2.0");
    expect(graphNodeTypes).toEqual(["Primitive", "Pack", "Anchor", "CodeNode"]);
    expect(deliveryFactNames).toEqual(["implemented", "has-verifier", "observed"]);
    expect(derivedEdgeTypes).toEqual(["belongsTo", "satisfies"]);
    expect(graphEdgeTypes).toEqual([
      "refines",
      "dependsOn",
      "constrainedBy",
      "decidedBy",
      "verifies",
      "supersedes",
      "belongsTo",
      "satisfies",
    ]);
  });
});

import { describe, expect, it } from "vitest";

import {
  deliveryFactNames,
  derivedEdgeTypes,
  graphEdgeTypes,
  graphNodeTypes,
  schemaVersion,
  serializeGraph,
  spec,
  specId,
} from "../src/index.js";

import type { GraphSchema } from "../src/index.js";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

const openSectionOrderTestAnchor = specTest({
  id: testAnchorId("test:protocol.open-section-order"),
  label: "verifies serialized authored entry order",
  verifies: ref("spec:extraction.open-section-order"),
});
void openSectionOrderTestAnchor;

describe("graph schema", () => {
  it("serializes authored entry order with description first and schema 0.6.0", () => {
    const graph = deriveFixtureGraph({
      specs: [
        spec({
          id: specId("spec:probe.order"),
          title: "Authored order",
          kind: "model",
          altitude: "story",
          readiness: "idea",
          design: {
            zeta: "z",
            alpha: "a",
            description: "Design prose.",
            mid10: "ten",
            mid2: "two",
          },
          ui: { zeta: "z", alpha: "a", description: "UI prose.", mid10: "ten", mid2: "two" },
          model: { terms: { zebra: "z", apple: "a" } },
        }),
      ],
    });
    const serialized = JSON.parse(serializeGraph(graph)) as GraphSchema;
    const node = serialized.nodes.find((entry) => entry.nodeType === "Primitive");
    expect(serialized.schemaVersion).toBe("0.6.0");
    expect(Object.keys(node?.sections?.design ?? {})).toEqual([
      "description",
      "zeta",
      "alpha",
      "mid10",
      "mid2",
    ]);
    expect(Object.keys(node?.sections?.ui ?? {})).toEqual([
      "description",
      "zeta",
      "alpha",
      "mid10",
      "mid2",
    ]);
    expect(Object.keys(node?.sections?.model?.terms ?? {})).toEqual(["zebra", "apple"]);
  });
  it("exports the graph schema contracts", () => {
    expect(schemaVersion).toBe("0.6.0");
    expect(graphNodeTypes).toEqual(["Primitive", "Pack", "Anchor", "CodeNode"]);
    expect(deliveryFactNames).toEqual(["implemented", "has-verifier", "observed"]);
    expect(derivedEdgeTypes).toEqual(["belongsTo", "satisfies", "models", "memberOf", "uses"]);
    expect(graphEdgeTypes).toEqual([
      "refines",
      "dependsOn",
      "constrainedBy",
      "decidedBy",
      "verifies",
      "supersedes",
      "belongsTo",
      "satisfies",
      "models",
      "memberOf",
      "uses",
    ]);
  });
});

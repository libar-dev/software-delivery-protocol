import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import {
  buildGraphIndex,
  evaluateReadinessFloor,
  extract,
  generateContracts,
} from "../src/index.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
let result: ReturnType<typeof extract>;

describe("the self-hosting duplicate-ID example contracts", () => {
  beforeAll(() => {
    result = extract({
      root: repoRoot,
      exclude: ["explorations", "examples", "test/fixtures/import/parity"],
    });
  });

  it("carries the exact duplicate-ID example-space vocabulary", () => {
    // Given: the root corpus with the duplicate-ID rule.
    const index = buildGraphIndex(result.graph);
    const parent = index.primitivesById.get("spec:validation.duplicate-ids");

    if (parent === undefined) {
      throw new Error("The duplicate-ID rule must be present in the root graph.");
    }

    // When: its authored behavior is read from the graph.
    const behavior = parent.sections?.behavior;
    const vocabulary = behavior?.exampleSpace;

    expect(behavior?.rules).toEqual([
      "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
    ]);
    expect(vocabulary?.given).toEqual([
      "a {firstCarrier:string} carrier declares {specId:string}",
      "a {secondCarrier:string} carrier declares {specId:string}",
    ]);
    expect(vocabulary?.when).toEqual(["the extraction root is read"]);
    expect(vocabulary?.then).toEqual([
      "both sites report {findingId:string}",
      "no graph node is emitted for {specId:string}",
    ]);
  });

  it("binds one ready point with distinct refines and verifies relations", () => {
    // Given: the root corpus and the parent vocabulary it owns.
    const index = buildGraphIndex(result.graph);
    const point = index.primitivesById.get("spec:validation.duplicate-ids.dual-carrier");

    if (point === undefined) {
      throw new Error("The duplicate-ID example point must be present in the root graph.");
    }

    // When: the point's declared relations and floor are evaluated.
    const relations = result.graph.edges
      .filter(
        (edge) =>
          edge.from === point.id &&
          edge.to === "spec:validation.duplicate-ids" &&
          edge.claim === "declared",
      )
      .map((edge) => edge.type)
      .sort();

    // Then: refines binds the point and verifies separately declares parent-verification semantics.
    expect(relations).toEqual(["refines", "verifies"]);
    expect(evaluateReadinessFloor(point, index)).toEqual([]);
  });

  it("derives the bound space and step contracts", () => {
    // Given: the root corpus carries the duplicate-ID vocabulary and its bound point.
    // When: contracts are generated from the root graph.
    const generated = generateContracts(result.graph);
    const space = generated.files.get("validation.duplicate-ids.space.ts") ?? "";
    const contract = generated.files.get("validation.duplicate-ids.dual-carrier.contract.ts") ?? "";

    // Then: the vocabulary drives concrete parameter and outcome types.
    expect(generated.findings).toEqual([]);
    expect(space).toContain("readonly firstCarrier: string;");
    expect(space).toContain("readonly secondCarrier: string;");
    expect(space).toContain("readonly specId: string;");
    expect(space).toContain(
      '{ readonly kind: "both sites report {findingId}"; readonly findingId: string }',
    );
    expect(space).toContain(
      '{ spec: "spec:validation.duplicate-ids.dual-carrier", point: { firstCarrier: "TypeScript", specId: "spec:fixture.duplicate", secondCarrier: "Markdown" } }',
    );
    expect(contract).toContain('| "a {firstCarrier} carrier declares {specId}"');
    expect(contract).toContain(
      'readonly "a {firstCarrier} carrier declares {specId}": { readonly firstCarrier: string; readonly specId: string };',
    );
    expect(contract).toContain(
      'params: { firstCarrier: "TypeScript", specId: "spec:fixture.duplicate" }',
    );
    expect(contract).toContain(
      'params: { secondCarrier: "Markdown", specId: "spec:fixture.duplicate" }',
    );
    expect(contract).toContain('params: { findingId: "extract/duplicate-id" }');
  });
});

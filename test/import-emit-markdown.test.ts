import { describe, expect, it } from "vitest";

import { reifyMarkdownCarrier } from "../src/extract/markdown.js";
import { emitMarkdownSpec } from "../src/import/emit-markdown.js";
import type { ReifiedSpec } from "../src/extract/reify.js";

function reifiedSpec(data: Record<string, unknown>): ReifiedSpec {
  return {
    data: {
      id: "spec:import.emitter",
      kind: "behavior",
      altitude: "story",
      readiness: "idea",
      title: "Emit a Markdown carrier",
      relations: [],
      ...data,
    },
    id: "spec:import.emitter",
    file: "source.sdp.ts",
    line: 1,
  };
}

describe("emitMarkdownSpec", () => {
  it("emits the empty envelope and maps title to the H1", () => {
    const emitted = emitMarkdownSpec(reifiedSpec({}));

    expect(emitted).toBe(`---
id: spec:import.emitter
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Emit a Markdown carrier
`);
  });

  it("round trips envelope data and narrative through the Markdown carrier", () => {
    const source = reifiedSpec({
      narrative: "The emitted document preserves author-owned prose.",
      relations: [{ type: "refines", target: "spec:import.parent", claim: "declared" }],
    });
    const emitted = emitMarkdownSpec(source);
    const result = reifyMarkdownCarrier(emitted, "emitted.sdp.md");

    expect(result.findings).toEqual([]);
    expect(result.specs[0]?.data).toEqual(source.data);
    expect(emitted).toContain(
      "# Emit a Markdown carrier\n\nThe emitted document preserves author-owned prose.\n",
    );
    expect(emitted).not.toContain("title:");
    expect(emitted).not.toContain("narrative:");
  });

  it.each(["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"])(
    "emits %s as a scalar relation target",
    (type) => {
      const emitted = emitMarkdownSpec(
        reifiedSpec({
          relations: [{ type, target: `spec:import.${type}`, claim: "declared" }],
        }),
      );

      expect(emitted).toContain(`  ${type}: spec:import.${type}\n`);
    },
  );

  it("groups relation records in ruled key order and emits multiple targets as a sequence", () => {
    const emitted = emitMarkdownSpec(
      reifiedSpec({
        relations: [
          { type: "verifies", target: "spec:import.verifier", claim: "declared" },
          { type: "dependsOn", target: "spec:import.first-dependency", claim: "declared" },
          { type: "refines", target: "spec:import.parent", claim: "declared" },
          { type: "dependsOn", target: "spec:import.second-dependency", claim: "declared" },
          { type: "supersedes", target: "spec:import.previous", claim: "declared" },
          { type: "constrainedBy", target: "spec:import.constraint", claim: "declared" },
          { type: "decidedBy", target: "spec:import.decision", claim: "declared" },
        ],
      }),
    );

    expect(emitted).toContain(`relations:
  refines: spec:import.parent
  dependsOn:
    - spec:import.first-dependency
    - spec:import.second-dependency
  constrainedBy: spec:import.constraint
  decidedBy: spec:import.decision
  verifies: spec:import.verifier
  supersedes: spec:import.previous
`);
    expect(emitMarkdownSpec(reifiedSpec({ relations: [] }))).toBe(
      emitMarkdownSpec(reifiedSpec({ relations: [] })),
    );
  });

  it("is refused when a valid emitted relation key is hand-corrupted", () => {
    const emitted = emitMarkdownSpec(
      reifiedSpec({
        relations: [{ type: "dependsOn", target: "spec:import.dependency", claim: "declared" }],
      }),
    );
    const corrupted = emitted.replace("  dependsOn:", "  invalidRelation:");
    const result = reifyMarkdownCarrier(corrupted, "corrupted.sdp.md");

    expect(result.specs).toEqual([]);
    expect(result.findings).toContainEqual(
      expect.objectContaining({ validatorId: "extract/invalid-frontmatter" }),
    );
  });
});

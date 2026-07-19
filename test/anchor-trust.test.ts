import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { extract } from "../src/index.js";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const temporaryRoots: string[] = [];

function temporaryRoot(name: string): string {
  const root = mkdtempSync(join(tmpdir(), `sdp-anchor-trust-${name}-`));
  temporaryRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true });
  }
});

describe("Protocol builder trust", () => {
  it("ignores consumer-local modules whose relative names resemble Protocol builders", () => {
    const root = temporaryRoot("consumer-lookalike");
    mkdirSync(join(root, "src"), { recursive: true });
    mkdirSync(join(root, "specs"), { recursive: true });
    writeFileSync(join(root, "src", "code-anchor.ts"), "export const codeAnchor = () => ({});\n");
    writeFileSync(
      join(root, "src", "ids.ts"),
      "export const codeAnchorId = String; export const ref = String; export const spec = (value: unknown) => value; export const specId = String;\n",
    );
    writeFileSync(
      join(root, "src", "consumer.ts"),
      `import { codeAnchor } from "./code-anchor.js";
import { codeAnchorId, ref } from "./ids.js";

const binding = codeAnchor({
  id: codeAnchorId("impl:consumer.lookalike"),
  satisfies: ref("spec:consumer.lookalike"),
});
void binding;
`,
    );
    writeFileSync(
      join(root, "specs", "ids.ts"),
      "export const spec = (value: unknown) => value; export const specId = String;\n",
    );
    writeFileSync(
      join(root, "specs", "lookalike.sdp.ts"),
      `import { spec, specId } from "./ids.js";

export const lookalike = spec({
  id: specId("spec:consumer.lookalike"),
  title: "Consumer lookalike",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});
`,
    );

    const result = extract({ root });

    expect(result.counts).toEqual({ specs: 0, packs: 0, anchors: 0 });
    expect(result.graph.nodes).toEqual([]);
    expect(result.graph.edges).toEqual([]);
  });

  it("recognizes deep relative imports only when they resolve to the Protocol builder modules", () => {
    const root = temporaryRoot("physical-identity");
    mkdirSync(join(root, "model"), { recursive: true });
    mkdirSync(join(root, "deep", "nested"), { recursive: true });
    symlinkSync(join(repositoryRoot, "src", "ids.ts"), join(root, "ids.ts"));
    symlinkSync(
      join(repositoryRoot, "src", "model", "code-anchor.ts"),
      join(root, "model", "code-anchor.ts"),
    );
    writeFileSync(
      join(root, "deep", "nested", "binding.ts"),
      `import { codeAnchor } from "../../model/code-anchor.js";
import { codeAnchorId, ref } from "../../ids.js";

const binding = codeAnchor({
  id: codeAnchorId("impl:protocol.deep-binding"),
  satisfies: ref("spec:protocol.deep-binding"),
});
void binding;
`,
    );

    const result = extract({ root });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(1);
    expect(result.graph.nodes).toContainEqual(
      expect.objectContaining({ id: "impl:protocol.deep-binding", nodeType: "CodeNode" }),
    );
  });

  it("continues to recognize package imports in consumer repositories", () => {
    const root = temporaryRoot("package-import");
    writeFileSync(
      join(root, "binding.ts"),
      `import { codeAnchor, codeAnchorId, ref } from "@libar-dev/software-delivery-protocol";

const binding = codeAnchor({
  id: codeAnchorId("impl:consumer.package-binding"),
  satisfies: ref("spec:consumer.package-binding"),
});
void binding;
`,
    );

    const result = extract({ root });

    expect(result.report.findings).toEqual([]);
    expect(result.counts.anchors).toBe(1);
  });
});

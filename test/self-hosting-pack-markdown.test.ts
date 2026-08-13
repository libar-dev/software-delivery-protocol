import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { markdownTsParityContract } from "../generated/contracts/carrier.markdown-pack-authoring.markdown-ts-parity.contract.js";
import { specEnvelopeRefusedContract } from "../generated/contracts/carrier.markdown-pack-authoring.spec-envelope-refused.contract.js";
import { extract } from "../src/index.js";
import type { ExtractionResult, GraphEdge, GraphNode } from "../src/index.js";

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) rmSync(root, { recursive: true, force: true });
  temporaryRoots.clear();
});

function temporaryRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  temporaryRoots.add(root);
  return root;
}

function writeMember(root: string): void {
  writeFileSync(
    join(root, "member.sdp.md"),
    `---
id: spec:probe.member
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Probe member

## Intent
- outcome: Exist only as Pack membership evidence.
`,
    "utf8",
  );
}

function withoutFile(node: GraphNode | undefined): Omit<GraphNode, "file"> | undefined {
  if (node === undefined) return undefined;
  const { file: _file, ...rest } = node;
  void _file;
  return rest;
}

function membership(result: ExtractionResult, packId: string): readonly GraphEdge[] {
  return result.graph.edges.filter((edge) => edge.type === "belongsTo" && edge.to === packId);
}

interface PackWorld {
  carrierSource: string;
  markdownRoot?: string;
  typeScriptRoot?: string;
  markdown?: ExtractionResult;
  typeScript?: ExtractionResult;
}

function packWorld(): PackWorld {
  return { carrierSource: "" };
}

const packBindings = {
  "an extraction root holding the pack carrier {carrierSource}": (
    world: PackWorld,
    params: { readonly carrierSource: string },
  ) => {
    world.carrierSource = params.carrierSource;
    world.markdownRoot = temporaryRoot("sdp-markdown-pack-");

    if (params.carrierSource === "the Markdown twin of a TS manifest") {
      world.typeScriptRoot = temporaryRoot("sdp-typescript-pack-");
      writeMember(world.markdownRoot);
      writeMember(world.typeScriptRoot);
      writeFileSync(
        join(world.markdownRoot, "parity.pack.sdp.md"),
        `---
id: pack:probe.parity
specs:
  - spec:probe.member
---
# Probe parity pack

The Pack parity point.
`,
        "utf8",
      );
      writeFileSync(
        join(world.typeScriptRoot, "parity.pack.sdp.ts"),
        `import { pack, packId, ref } from "@libar-dev/software-delivery-protocol";

export const parityPack = pack({
  id: packId("pack:probe.parity"),
  title: "Probe parity pack",
  framing: "The Pack parity point.",
  specs: [ref("spec:probe.member")],
});
`,
        "utf8",
      );
      return;
    }

    writeFileSync(
      join(world.markdownRoot, "refused.pack.sdp.md"),
      `---
id: pack:probe.refused
specs: []
kind: behavior
---
# Refused probe pack
`,
      "utf8",
    );
  },
  "the extractor derives the graph": (world: PackWorld) => {
    if (world.markdownRoot === undefined)
      throw new Error("The carrier step must create the Markdown root before extraction.");
    world.markdown = extract({ root: world.markdownRoot });
    if (world.typeScriptRoot !== undefined)
      world.typeScript = extract({ root: world.typeScriptRoot });
  },
  "the graph holds the pack {packId} whose membership names {memberId}": (
    world: PackWorld,
    params: { readonly packId: string; readonly memberId: string },
  ) => {
    if (world.markdown === undefined || world.typeScript === undefined)
      throw new Error("The parity point requires both carrier extractions.");

    const markdownPack = world.markdown.graph.nodes.find((node) => node.id === params.packId);
    const typeScriptPack = world.typeScript.graph.nodes.find((node) => node.id === params.packId);
    expect(markdownPack?.nodeType).toBe("Pack");
    expect(withoutFile(markdownPack)).toEqual(withoutFile(typeScriptPack));
    expect(membership(world.markdown, params.packId)).toEqual(
      membership(world.typeScript, params.packId),
    );
    expect(membership(world.markdown, params.packId)).toContainEqual({
      from: params.memberId,
      type: "belongsTo",
      to: params.packId,
      claim: "declared",
    });
  },
  "the report names the refusal {findingId} and the graph holds no pack node": (
    world: PackWorld,
    params: { readonly findingId: string },
  ) => {
    if (world.markdown === undefined)
      throw new Error("The refusal point requires the Markdown extraction.");
    expect(world.markdown.report.findings).toContainEqual(
      expect.objectContaining({ validatorId: params.findingId }),
    );
    expect(world.markdown.graph.nodes.some((node) => node.nodeType === "Pack")).toBe(false);
  },
};

const parityTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-pack-authoring.markdown-ts-parity"),
  label: "the parity point verifies equal Markdown and TypeScript Pack derivation",
  verifies: ref("spec:carrier.markdown-pack-authoring.markdown-ts-parity"),
});

const refusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.markdown-pack-authoring.spec-envelope-refused"),
  label: "the refusal point verifies the Markdown Pack closed envelope",
  verifies: ref("spec:carrier.markdown-pack-authoring.spec-envelope-refused"),
});
void [parityTestAnchor, refusalTestAnchor];

bindExample(markdownTsParityContract, packWorld, packBindings);
bindExample(specEnvelopeRefusedContract, packWorld, packBindings);

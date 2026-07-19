import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const packageName = "@libar-dev/software-delivery-protocol";
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const importFixture = join(repositoryRoot, "test/fixtures/import/round-trip/behavior.sdp.ts.txt");

const expectedRootExports = [
  "CODE_ANCHOR_NAMESPACES",
  "PROTOCOL_MODULE_SPECIFIER",
  "SPEC_ALTITUDES",
  "SPEC_KINDS",
  "SPEC_KIND_DISPLAY_LABELS",
  "SPEC_READINESS",
  "SPEC_RELATION_TYPES",
  "SPEC_SECTION_NAMES",
  "anchorId",
  "authoredEdgeTypes",
  "boundSlotValues",
  "buildGraphIndex",
  "codeAnchor",
  "codeAnchorId",
  "computeDeliveryFacts",
  "constrainedBy",
  "contractsFindingIds",
  "createReader",
  "decidedBy",
  "deliveryFactNames",
  "dependsOn",
  "deriveGraph",
  "deriveReadiness",
  "derivedEdgeTypes",
  "duplicateIdExclusionAnchor",
  "emitMarkdownSpec",
  "evaluateReadinessFloor",
  "extract",
  "extractAnchor",
  "extractFindingIds",
  "extractValidatorId",
  "formatId",
  "generateContracts",
  "graphClaims",
  "graphEdgeTypes",
  "graphNodeTypes",
  "graphReportId",
  "graphValidatorIds",
  "hasUnboundSlot",
  "importFindingIds",
  "importTypeScriptSpec",
  "isEnabledExampleVerify",
  "isResolvingTestAnchorVerify",
  "kindEvidence",
  "MarkdownEmissionError",
  "oracleAnchorId",
  "pack",
  "packId",
  "parseId",
  "parseSlots",
  "readinessFloorAnchor",
  "readinessFloors",
  "ref",
  "refines",
  "reifyMarkdownCarrier",
  "reifyTypeScriptCarrier",
  "renderDesignReview",
  "renderStepText",
  "schemaVersion",
  "serializeGraph",
  "spec",
  "specId",
  "specOracle",
  "specTest",
  "stepSkeleton",
  "supersedes",
  "testAnchorId",
  "validateGraph",
  "validationSeverities",
  "validatorFamilies",
  "verifies",
] as const;

const typeOnlyRootExports = [
  "CarrierReification",
  "CarrierReifier",
  "ImportResult",
  "ReifiedAnchor",
  "ReifiedPack",
  "ReifiedSpec",
] as const;

function run(command: string, args: readonly string[], cwd: string): string {
  return execFileSync(command, args, { cwd, encoding: "utf8" });
}

function consumerDriver(): string {
  const namedImports = expectedRootExports.join(", ");
  const boundValues = expectedRootExports.join(", ");

  return `import * as protocol from "${packageName}";
import { ${namedImports} } from "${packageName}";

void [${boundValues}];

const typeScript = protocol.reifyTypeScriptCarrier(\`import { spec } from "${packageName}";
const carrier = spec({ id: "spec:package.typescript", kind: "behavior", altitude: "story", readiness: "idea" });\`, "package.sdp.ts");
const markdown = protocol.reifyMarkdownCarrier(\`---
id: spec:package.markdown
kind: behavior
altitude: story
readiness: idea
relations: {}
---
# Package Markdown carrier

## Intent
- outcome: The installed runtime parses YAML frontmatter.
\`, "package.sdp.md");
const graph = protocol.deriveGraph([...typeScript.specs, ...markdown.specs], [], []);

if (
  typeScript.findings.length !== 0 ||
  markdown.findings.length !== 0 ||
  graph.nodes.length !== 2
) {
  throw new Error("Installed package did not reify both carriers into a graph.");
}

console.log(
  JSON.stringify({
    exports: Object.keys(protocol).sort(),
    nodes: graph.nodes.map((node) => node.id),
  }),
);
`;
}

describe("published package surface", () => {
  it("proves the installed tarball lists import, dry-runs conversion without writes, and exposes the barrel", async () => {
    const packageRoot = await mkdtemp(join(tmpdir(), "sdp-package-smoke-"));
    const consumer = join(packageRoot, "consumer");

    try {
      run("npm", ["run", "build"], repositoryRoot);
      run("npm", ["pack", "--pack-destination", packageRoot], repositoryRoot);

      const tarballs = await readdir(packageRoot);
      const tarball = tarballs.find((entry) => entry.endsWith(".tgz"));

      if (tarball === undefined) {
        throw new Error("npm pack did not create a tarball.");
      }

      await mkdir(consumer);
      await writeFile(
        join(consumer, "package.json"),
        JSON.stringify({ name: "sdp-package-smoke", private: true, type: "module" }),
      );

      run(
        "npm",
        [
          "install",
          "--ignore-scripts",
          "--omit=dev",
          join(packageRoot, tarball),
          "--prefix",
          consumer,
        ],
        repositoryRoot,
      );
      await writeFile(join(consumer, "consumer.mjs"), consumerDriver());
      await writeFile(
        join(consumer, "type-surface.mts"),
        `import { ${expectedRootExports.join(", ")} } from "${packageName}";
import type { ${typeOnlyRootExports.join(", ")} } from "${packageName}";
void [${expectedRootExports.join(", ")}];
`,
      );

      run(
        join(repositoryRoot, "node_modules", ".bin", "tsc"),
        [
          "--module",
          "NodeNext",
          "--moduleResolution",
          "NodeNext",
          "--target",
          "ES2022",
          "--strict",
          "--skipLibCheck",
          "--noEmit",
          "type-surface.mts",
        ],
        consumer,
      );

      const sdpHelp = run(join(consumer, "node_modules", ".bin", "sdp"), ["--help"], consumer);
      await copyFile(importFixture, join(consumer, "behavior.sdp.ts"));
      const sdpImportDryRun = run(
        join(consumer, "node_modules", ".bin", "sdp"),
        ["import", "--dry-run", "behavior.sdp.ts"],
        consumer,
      );
      const driver = run(process.execPath, ["consumer.mjs"], consumer);
      const barrelCheck = run(
        process.execPath,
        [
          "-e",
          `const m=require("${packageName}"); if(typeof m.emitMarkdownSpec!=="function"||typeof m.importTypeScriptSpec!=="function"||typeof m.importFindingIds!=="object"||typeof m.MarkdownEmissionError!=="function") process.exit(1); console.log("barrel imports available")`,
        ],
        consumer,
      );

      expect(JSON.parse(driver)).toEqual({
        exports: [...expectedRootExports].sort(),
        nodes: ["spec:package.typescript", "spec:package.markdown"],
      });
      expect(sdpHelp).toContain("sdp import");
      expect(sdpImportDryRun).toContain("id: spec:round-trip.behavior");
      expect(await readdir(consumer)).not.toContain("behavior.sdp.md");
      expect(barrelCheck).toBe("barrel imports available\n");
    } finally {
      await rm(packageRoot, { force: true, recursive: true });
    }
  }, 60_000);
});

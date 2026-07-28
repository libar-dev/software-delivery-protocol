import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  deriveGraph,
  extractFindingIds,
  reifyMarkdownCarrier,
  reifyTypeScriptCarrier,
} from "@libar-dev/software-delivery-protocol";
import * as protocol from "@libar-dev/software-delivery-protocol";
import type {
  CarrierReification,
  CarrierReifier,
  ReifiedAnchor,
  ReifiedPack,
  ReifiedSpec,
} from "@libar-dev/software-delivery-protocol";

const validTypeScriptCarrier = `import { spec } from "@libar-dev/software-delivery-protocol";

const carrier = spec({
  id: "spec:carrier.public-seam",
  title: "Publish the carrier seam",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});`;

const healthyTypeScriptCarrier = `import { spec } from "@libar-dev/software-delivery-protocol";

const carrier = spec({
  id: "spec:carrier.healthy-sibling",
  kind: "behavior",
  altitude: "story",
  readiness: "idea",
});`;

describe("bootstrap package surface", () => {
  it("resolves the package name through the Vitest alias", () => {
    expect(protocol).toBeDefined();
    expect(typeof protocol).toBe("object");
  });

  it("keeps the expected package.json bootstrap shape", async () => {
    const packageJsonPath = fileURLToPath(new URL("../package.json", import.meta.url));
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      type: string;
      bin: { sdp: string };
      exports: Record<string, { types: string; import: string }>;
      scripts: Record<string, string>;
    };
    const rootExport = packageJson.exports["."];

    if (rootExport === undefined) {
      throw new Error("Missing root export in package.json");
    }

    expect(packageJson.type).toBe("module");
    expect(packageJson.bin.sdp).toBe("./dist/cli/sdp.js");
    expect(rootExport.types).toBe("./dist/index.d.ts");
    expect(rootExport.import).toBe("./dist/index.js");
    expect(packageJson.scripts["generate:self-hosting"]).toBe(
      "node ./dist/cli/sdp.js view . --exclude explorations --exclude examples --exclude test/fixtures/import/parity",
    );
    expect(packageJson.scripts["check:self-hosting"]).toBe(
      "node ./dist/cli/sdp.js view . --exclude explorations --exclude examples --exclude test/fixtures/import/parity --check-clean",
    );
    expect(packageJson.scripts["check:self-hosting-gates"]).toBe(
      "node ./check-self-hosting-gates.mjs",
    );
    expect(packageJson.scripts.preflight).toBe("node ./preflight.mjs");
    expect(packageJson.scripts.check).toBe(
      "npm run check:temporal && npm run lint && npm run format:check && npm run build && npm run generate:self-hosting && npm run generate:example && npm run typecheck && npm run typecheck:examples && npm test && npm run check:self-hosting-gates && npm run check:self-hosting && npm run check:example && npm run preflight",
    );
  });

  it("reifies a TypeScript carrier and derives a graph through the public root", () => {
    const typeScriptReifier: CarrierReifier = reifyTypeScriptCarrier;
    const reification: CarrierReification = typeScriptReifier(
      validTypeScriptCarrier,
      "carrier.sdp.ts",
    );
    const specs: readonly ReifiedSpec[] = reification.specs;
    const packs: readonly ReifiedPack[] = reification.packs;
    const anchors: readonly ReifiedAnchor[] = [];
    const graph = deriveGraph(specs, packs, anchors);

    expect(reification.findings).toEqual([]);
    expect(Object.keys(reification.specs[0] ?? {}).sort()).toEqual(["data", "file", "id", "line"]);
    expect(graph.nodes.map((node) => node.id)).toEqual(["spec:carrier.public-seam"]);
  });

  it("returns a syntax finding while a healthy TypeScript sibling remains usable", () => {
    const malformed = reifyTypeScriptCarrier("const carrier = ;", "broken.sdp.ts");
    const healthy = reifyTypeScriptCarrier(healthyTypeScriptCarrier, "healthy.sdp.ts");

    expect(malformed.specs).toEqual([]);
    expect(malformed.findings[0]?.validatorId).toBe(extractFindingIds.parseError);
    expect(healthy.specs.map((entry) => entry.id)).toEqual(["spec:carrier.healthy-sibling"]);
  });

  it("returns a finding for unsupported Markdown carrier content", () => {
    const markdown = reifyMarkdownCarrier("not markdown carrier syntax", "carrier.sdp.md");

    expect(markdown.specs).toEqual([]);
    expect(markdown.findings[0]?.validatorId).toBe("extract/invalid-frontmatter");
  });
});

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { dualCarrierContract } from "../generated/contracts/validation.duplicate-ids.dual-carrier.contract.js";
import { extract } from "../src/index.js";
import type { ExtractionResult } from "../src/index.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

interface DuplicateIdWorld {
  readonly root: string;
  result: ExtractionResult | undefined;
}

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const temporaryRoots = new Set<string>();
const temporaryPreflightRoots = new Set<string>();
const selfHostingContracts = "generated/contracts";
const checkoutContracts = "examples/checkout-v1/generated/contracts";
const selfHostingTest = "test/self-hosting-duplicate-ids.test.ts";
const checkoutTest = "examples/checkout-v1/test/orders/create-order.valid-cart.test.ts";

function extractedResult(world: DuplicateIdWorld): ExtractionResult {
  if (world.result === undefined) {
    throw new Error("The extraction step must run before the outcome is asserted.");
  }

  return world.result;
}

function runPreflight(root: string, paths: readonly string[]) {
  return spawnSync(
    process.execPath,
    [join(repoRoot, "vitest-test.mjs"), "--run", "--help", ...paths],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
}

function preflightRoot(contractDirectories: readonly string[]): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-generated-preflight-"));
  temporaryPreflightRoots.add(root);

  for (const directory of contractDirectories) {
    mkdirSync(join(root, directory), { recursive: true });
  }

  return root;
}

afterEach(() => {
  for (const root of temporaryRoots) {
    removeMaterializedCorpus(root);
  }
  temporaryRoots.clear();

  for (const root of temporaryPreflightRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  temporaryPreflightRoots.clear();
});

describe("generated contract preflight", () => {
  it("names self-hosting generation before collecting its filtered tracer", () => {
    const result = runPreflight(preflightRoot([checkoutContracts]), [selfHostingTest]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run generate:self-hosting` first.\n",
    );
  });

  it("names checkout generation before collecting its filtered example", () => {
    const result = runPreflight(preflightRoot([selfHostingContracts]), [checkoutTest]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run generate:example` first.\n",
    );
  });

  it("names both generations when an unfiltered suite lacks both contract trees", () => {
    const result = runPreflight(preflightRoot([]), []);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run generate:self-hosting && npm run generate:example` first.\n",
    );
  });

  it("proceeds for the unfiltered invocation once both contract trees are generated", () => {
    expect(runPreflight(repoRoot, []).status).toBe(0);
  });
});

it("keeps the duplicate-ID example unanchored while its executable binding passes", () => {
  const result = extract({ root: repoRoot, exclude: ["explorations", "examples"] });
  const child = result.graph.nodes.find(
    (node) => node.nodeType === "Primitive" && node.id === dualCarrierContract.spec,
  );

  if (child?.nodeType !== "Primitive") {
    throw new Error("The generated duplicate-ID contract must name a root graph primitive.");
  }

  expect(child.deliveryFacts).toBeUndefined();
});

bindExample(
  dualCarrierContract,
  (): DuplicateIdWorld => {
    const root = materializeExtractCorpus("duplicate-id");
    temporaryRoots.add(root);

    return { root, result: undefined };
  },
  {
    "a {firstCarrier} carrier declares {specId}": (_world, params) => {
      expect(params.firstCarrier).toBe("TypeScript");
      expect(params.specId).toBe("spec:fixture.duplicate");
    },
    "a {secondCarrier} carrier declares {specId}": (_world, params) => {
      expect(params.secondCarrier).toBe("Markdown");
      expect(params.specId).toBe("spec:fixture.duplicate");
    },
    "the extraction root is read": (world) => {
      world.result = extract({ root: world.root });
    },
    "both sites report {findingId}": (world, params) => {
      const duplicateFindings = extractedResult(world).report.findings.filter(
        (finding) => finding.validatorId === params.findingId,
      );

      expect(duplicateFindings).toHaveLength(2);
    },
    "no graph node is emitted for {specId}": (world, params) => {
      const result = extractedResult(world);

      expect(result.graph.nodes.some((node) => node.id === params.specId)).toBe(false);
      expect(result.graph.nodes.some((node) => node.id === "spec:fixture.healthy-sibling")).toBe(
        true,
      );
    },
  },
);

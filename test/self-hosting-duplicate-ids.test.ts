import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";

import type {
  DuplicateIdsConditions,
  DuplicateIdsOutcome,
} from "../generated/contracts/validation.duplicate-ids.space.js";
import { dualCarrierContract } from "../generated/contracts/validation.duplicate-ids.dual-carrier.contract.js";
import { extract } from "../src/index.js";
import type { ExtractionResult } from "../src/index.js";
import { registerDualCarrier } from "./validation.duplicate-ids.dual-carrier.test.generated.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

interface DuplicateIdWorld {
  readonly root: string;
  result: ExtractionResult | undefined;
}

function createDuplicateIdWorld(point: Partial<DuplicateIdsConditions>): DuplicateIdWorld {
  void point;
  const root = materializeExtractCorpus("duplicate-id");
  temporaryRoots.add(root);

  return { root, result: undefined };
}

function invokeDuplicateIdExtract(world: DuplicateIdWorld): void {
  world.result = extract({ root: world.root });
}

function observeDuplicateIds(world: DuplicateIdWorld): DuplicateIdsOutcome {
  const duplicateFindings = extractedResult(world).report.findings.filter(
    (finding) => finding.validatorId === "extract/duplicate-id",
  );

  return {
    kind: "both sites report {findingId}",
    findingId: duplicateFindings[0]?.validatorId ?? "",
  };
}

function expectedDuplicateIds(point: Partial<DuplicateIdsConditions>): DuplicateIdsOutcome {
  if (
    point.firstCarrier === undefined ||
    point.specId === undefined ||
    point.secondCarrier === undefined
  ) {
    return unspecified;
  }

  return { kind: "both sites report {findingId}", findingId: "extract/duplicate-id" };
}

function assertDuplicateIdSemantics(world: DuplicateIdWorld): void {
  const result = extractedResult(world);
  const duplicateFindings = result.report.findings.filter(
    (finding) => finding.validatorId === "extract/duplicate-id",
  );

  expect(duplicateFindings.map((finding) => finding.file).sort()).toEqual([
    "first-site.sdp.ts",
    "second-site.sdp.md",
  ]);
  expect(result.graph.nodes.some((node) => node.id === "spec:fixture.duplicate")).toBe(false);
  expect(result.graph.nodes.some((node) => node.id === "spec:fixture.healthy-sibling")).toBe(true);
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
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting` first.\n",
    );
  });

  it("names checkout generation before collecting its filtered example", () => {
    const result = runPreflight(preflightRoot([selfHostingContracts]), [checkoutTest]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:example` first.\n",
    );
  });

  it("names both generations when an unfiltered suite lacks both contract trees", () => {
    const result = runPreflight(preflightRoot([]), []);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting && npm run generate:example` first.\n",
    );
  });

  it("matches a Vitest substring filter before collecting the self-hosting tracer", () => {
    const result = runPreflight(preflightRoot([checkoutContracts]), ["duplicate-ids"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting` first.\n",
    );
  });

  it("matches a ./-prefixed filter before collecting the self-hosting tracer", () => {
    const result = runPreflight(preflightRoot([checkoutContracts]), [`./${selfHostingTest}`]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting` first.\n",
    );
  });

  it("matches an absolute-path filter before collecting the self-hosting tracer", () => {
    const result = runPreflight(preflightRoot([checkoutContracts]), [
      join(repoRoot, selfHostingTest),
    ]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting` first.\n",
    );
  });

  it("does not require contracts for an unrelated Vitest filter", () => {
    expect(runPreflight(preflightRoot([]), ["test/bootstrap.test.ts"]).status).toBe(0);
  });

  it("proceeds for the unfiltered invocation once both contract trees are generated", () => {
    expect(runPreflight(preflightRoot([selfHostingContracts, checkoutContracts]), []).status).toBe(
      0,
    );
  });
});

function shimmedPoolRoot(shimBody: string): { root: string; environment: NodeJS.ProcessEnv } {
  const root = preflightRoot([]);
  mkdirSync(join(root, "generated"), { recursive: true });
  writeFileSync(join(root, "generated", "sentinel.txt"), "before\n");

  const binDirectory = join(root, "shim-bin");
  mkdirSync(binDirectory);
  const shim = join(binDirectory, "vitest");
  writeFileSync(shim, `#!/usr/bin/env node\n${shimBody}\nprocess.exit(0);\n`);
  chmodSync(shim, 0o755);

  return {
    root,
    environment: { ...process.env, PATH: `${binDirectory}:${process.env.PATH ?? ""}` },
  };
}

function runPooledWrapper(root: string, environment: NodeJS.ProcessEnv) {
  return spawnSync(
    process.execPath,
    [join(repoRoot, "vitest-test.mjs"), "--run", "test/bootstrap.test.ts"],
    { cwd: root, encoding: "utf8", env: environment },
  );
}

describe("pooled root generated-state sentinel", () => {
  it("fails a pooled run that mutates repository-root generated state", () => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("generated/sentinel.txt", "mutated\\n");',
    );
    const result = runPooledWrapper(root, environment);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "A pooled test run mutated repository-root generated/ state; only the dedicated test/cli.test.ts pass may regenerate it.",
    );
  });

  it("passes a pooled run that leaves repository-root generated state untouched", () => {
    const { root, environment } = shimmedPoolRoot("");
    const result = runPooledWrapper(root, environment);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });
});

it("derives the duplicate-ID verifier facts from the bound executable example", () => {
  const result = extract({
    root: repoRoot,
    exclude: ["explorations", "examples", "test/fixtures/import/parity"],
  });
  const child = result.graph.nodes.find(
    (node) => node.nodeType === "Primitive" && node.id === dualCarrierContract.spec,
  );
  const parent = result.graph.nodes.find(
    (node) => node.nodeType === "Primitive" && node.id === "spec:validation.duplicate-ids",
  );

  if (child?.nodeType !== "Primitive") {
    throw new Error("The generated duplicate-ID contract must name a root graph primitive.");
  }

  if (parent?.nodeType !== "Primitive") {
    throw new Error("The duplicate-ID example must retain its parent root graph primitive.");
  }

  expect(child.deliveryFacts).toEqual(["has-verifier"]);
  expect(parent.deliveryFacts).toEqual(["implemented", "has-verifier"]);
}, 20_000);

const dualCarrierDuplicateTestAnchor = specTest({
  id: testAnchorId("test:protocol.duplicate-ids.dual-carrier"),
  label: "dual-carrier duplicate-ID contract verifies carrier exclusion",
  verifies: ref("spec:validation.duplicate-ids.dual-carrier"),
});
void dualCarrierDuplicateTestAnchor;

registerDualCarrier({
  createWorld: createDuplicateIdWorld,
  invoke: invokeDuplicateIdExtract,
  observe: observeDuplicateIds,
  expected: expectedDuplicateIds,
  assertions: assertDuplicateIdSemantics,
});

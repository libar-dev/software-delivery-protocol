import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { registerDualCarrier } from "./validation.duplicate-ids.dual-carrier.test.generated.js";

interface DuplicateIdWorld {
  readonly root: string;
  readonly point: DuplicateIdsConditions;
  result: ExtractionResult | undefined;
}

function completeDuplicateIdPoint(point: Partial<DuplicateIdsConditions>): DuplicateIdsConditions {
  const { firstCarrier, secondCarrier, specId } = point;

  if (firstCarrier === undefined || secondCarrier === undefined || specId === undefined) {
    throw new Error("The generated duplicate-ID point must bind both carriers and the spec ID.");
  }

  return { firstCarrier, secondCarrier, specId };
}

const duplicateFixtureId = "spec:fixture.duplicate";
const duplicateFixtureFiles = ["first-site.sdp.ts", "second-site.sdp.md"] as const;

function materializeDuplicateIdPoint(point: DuplicateIdsConditions): string {
  const root = materializeExtractCorpus("duplicate-id");
  temporaryRoots.add(root);

  for (const file of duplicateFixtureFiles) {
    const path = join(root, file);
    const source = readFileSync(path, "utf8");
    writeFileSync(path, source.replaceAll(duplicateFixtureId, point.specId));
  }

  return root;
}

function fixtureFileForCarrier(carrier: string): (typeof duplicateFixtureFiles)[number] {
  if (carrier === "TypeScript") {
    return "first-site.sdp.ts";
  }
  if (carrier === "Markdown") {
    return "second-site.sdp.md";
  }

  throw new Error(`The duplicate-ID fixture has no generated ${JSON.stringify(carrier)} carrier.`);
}

function createDuplicateIdWorld(point: Partial<DuplicateIdsConditions>): DuplicateIdWorld {
  const completePoint = completeDuplicateIdPoint(point);

  return {
    root: materializeDuplicateIdPoint(completePoint),
    point: completePoint,
    result: undefined,
  };
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
  const { findingId } = paramsForStep(dualCarrierContract, "both sites report {findingId}");
  const { specId } = paramsForStep(dualCarrierContract, "no graph node is emitted for {specId}");
  const duplicateFindings = result.report.findings.filter(
    (finding) => finding.validatorId === findingId,
  );
  const expectedFiles = [
    fixtureFileForCarrier(world.point.firstCarrier),
    fixtureFileForCarrier(world.point.secondCarrier),
  ].sort();

  expect(duplicateFindings.map((finding) => finding.file).sort()).toEqual(expectedFiles);
  expect(result.graph.nodes.some((node) => node.id === specId)).toBe(false);
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

  it.each([[["--reporter", "verbose"]], [["--maxWorkers", "1"]], [["-t", "duplicate"]]])(
    "reads an option value %j as no file filter, so the whole suite's contracts are required",
    (options) => {
      const result = runPreflight(preflightRoot([]), options);

      expect(result.status).toBe(1);
      expect(result.stderr).toBe(
        "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting && npm run generate:example` first.\n",
      );
    },
  );

  it("matches a file:line filter by its file before collecting the self-hosting tracer", () => {
    const result = runPreflight(preflightRoot([checkoutContracts]), [`${selfHostingTest}:200`]);

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      "Generated contracts required by the selected test suite are missing.\nRun `npm run build && npm run generate:self-hosting` first.\n",
    );
  });

  it.each([[[checkoutContracts]], [[selfHostingContracts]]])(
    "requires every contract tree for `related`, whose source paths name no test file (present: %j)",
    (present) => {
      const result = runPreflight(preflightRoot(present), ["related", "src/runner/index.ts"]);

      expect(result.status).toBe(1);
      expect(result.stderr).toBe(
        `Generated contracts required by the selected test suite are missing.\nRun \`npm run build && ${present[0] === checkoutContracts ? "npm run generate:self-hosting" : "npm run generate:example"}\` first.\n`,
      );
    },
  );

  it("does not require contracts for an unrelated Vitest filter", () => {
    expect(runPreflight(preflightRoot([]), ["test/bootstrap.test.ts"]).status).toBe(0);
  });

  it("proceeds for the unfiltered invocation once both contract trees are generated", () => {
    expect(runPreflight(preflightRoot([selfHostingContracts, checkoutContracts]), []).status).toBe(
      0,
    );
  });
});

function shimmedPoolRoot(
  shimBody: string,
  contractDirectories: readonly string[] = [],
): { root: string; environment: NodeJS.ProcessEnv } {
  const root = preflightRoot(contractDirectories);
  mkdirSync(join(root, "generated"), { recursive: true });
  writeFileSync(join(root, "generated", "sentinel.txt"), "before\n");

  const binDirectory = join(root, "shim-bin");
  mkdirSync(binDirectory);
  writeFileSync(join(binDirectory, "package.json"), '{"type":"commonjs"}\n');
  const shim = join(binDirectory, "vitest");
  writeFileSync(shim, `#!/usr/bin/env node\n${shimBody}\nprocess.exit(0);\n`);
  chmodSync(shim, 0o755);

  return {
    root,
    environment: { ...process.env, PATH: `${binDirectory}:${process.env.PATH ?? ""}` },
  };
}

/** The options with which a pass of a split run records its blob report. */
function blob(pass: string): string[] {
  return ["--reporter=blob", `--outputFile=<reports>/${pass}.json`];
}

function recordedSpawns(root: string): string[][] {
  return readFileSync(join(root, "spawns.log"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as string[]);
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

  it("keeps the dedicated CLI pass when an option carries a separate value, and forwards it there", () => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    const result = spawnSync(
      process.execPath,
      [join(repoRoot, "vitest-test.mjs"), "--run", "--reporter", "verbose", "--maxWorkers", "4"],
      { cwd: root, encoding: "utf8", env: environment },
    );

    expect(result.status).toBe(0);
    expect(recordedSpawns(root)).toEqual([
      ["--run", "--reporter", "verbose", "--maxWorkers", "4", "--exclude", "test/cli.test.ts"],
      [
        "--run",
        "--reporter",
        "verbose",
        "test/cli.test.ts",
        "--pool",
        "forks",
        "--maxWorkers",
        "1",
        "--no-isolate",
        "--passWithNoTests",
      ],
    ]);
  });

  it.each([
    // pnpm forwards a literal `--`; Vitest would ignore the filter and the exclusion behind it.
    [["--", "test/bootstrap.test.ts"], [["--run", "test/bootstrap.test.ts"]]],
    [
      ["--", "--reporter", "dot"],
      [
        ["--run", "--reporter", "dot", "--exclude", "test/cli.test.ts"],
        [
          "--run",
          "--reporter",
          "dot",
          "test/cli.test.ts",
          "--pool",
          "forks",
          "--maxWorkers",
          "1",
          "--no-isolate",
          "--passWithNoTests",
        ],
      ],
    ],
    // `related` takes source files, so it splits whatever tests they reach.
    [
      ["related", "src/cli/validate-watch.ts"],
      [
        [
          "--run",
          "related",
          "src/cli/validate-watch.ts",
          "--exclude",
          "test/cli.test.ts",
          "--passWithNoTests",
        ],
        ["--run", "test/cli.test.ts", "--pool", "forks", "--maxWorkers", "1", "--no-isolate"],
      ],
    ],
    // A file:line filter on the CLI suite goes to the dedicated pass alone.
    [
      ["test/cli.test.ts:120"],
      [["--run", "test/cli.test.ts:120", "--pool", "forks", "--maxWorkers", "1", "--no-isolate"]],
    ],
    [
      ["test/bootstrap.test.ts", "test/cli.test.ts:120:3"],
      [
        ["--run", "test/bootstrap.test.ts", "--exclude", "test/cli.test.ts", "--passWithNoTests"],
        ["--run", "test/cli.test.ts:120:3", "--pool", "forks", "--maxWorkers", "1", "--no-isolate"],
      ],
    ],
    [["-h"], [["--run", "-h"]]],
    [["--version"], [["--run", "--version"]]],
    // Help behind pnpm's separator is still help, forwarded once.
    [["--", "--help"], [["--run", "--help"]]],
    [["--", "-h"], [["--run", "-h"]]],
    // A second `--` is the caller's own delimiter: Vitest ignores what follows it, so the wrapper
    // reads nothing there, help included, and keeps it last, behind its own exclusion.
    [
      ["--", "--", "--help"],
      [
        ["--run", "--exclude", "test/cli.test.ts", "--", "--help"],
        [
          "--run",
          "test/cli.test.ts",
          "--pool",
          "forks",
          "--maxWorkers",
          "1",
          "--no-isolate",
          "--",
          "--help",
        ],
      ],
    ],
  ])("routes %j without running test/cli.test.ts in the pool", (options, expected) => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(recordedSpawns(root)).toEqual(expected);
  });

  it.each([
    [
      ["--reporter=junit", "--outputFile=report.xml"],
      [
        ["--run", "--exclude", "test/cli.test.ts", ...blob("pooled")],
        [
          "--run",
          "test/cli.test.ts",
          "--pool",
          "forks",
          "--maxWorkers",
          "1",
          "--no-isolate",
          ...blob("cli"),
        ],
        ["--run", "--merge-reports", "<reports>", "--reporter=junit", "--outputFile=report.xml"],
      ],
    ],
    [
      ["test/bootstrap.test.ts", "test/cli.test.ts", "--reporter", "html", "-t", "alpha"],
      [
        [
          "--run",
          "test/bootstrap.test.ts",
          "test/cli.test.ts",
          "-t",
          "alpha",
          "--exclude",
          "test/cli.test.ts",
          "--passWithNoTests",
          ...blob("pooled"),
        ],
        [
          "--run",
          "-t",
          "alpha",
          "test/cli.test.ts",
          "--pool",
          "forks",
          "--maxWorkers",
          "1",
          "--no-isolate",
          "--passWithNoTests",
          ...blob("cli"),
        ],
        ["--run", "--merge-reports", "<reports>", "--reporter", "html", "-t", "alpha"],
      ],
    ],
  ])(
    "records each pass of a split run writing %j as a blob report and merges them",
    (options, expected) => {
      // The shim writes the blob report a pass asks for, as Vitest's blob reporter would.
      const { root, environment } = shimmedPoolRoot(
        [
          'const fs = require("node:fs");',
          "const args = process.argv.slice(2);",
          'fs.appendFileSync("spawns.log", JSON.stringify(args) + "\\n");',
          'const output = args.find((arg) => arg.startsWith("--outputFile=") && args.includes("--reporter=blob"));',
          'if (output !== undefined) fs.writeFileSync(output.slice("--outputFile=".length), "blob");',
        ].join("\n"),
        [selfHostingContracts, checkoutContracts],
      );
      // The html reporter needs @vitest/ui, which the wrapper looks for from the root first.
      mkdirSync(join(root, "node_modules", "@vitest", "ui"), { recursive: true });
      writeFileSync(join(root, "node_modules", "@vitest", "ui", "package.json"), "{}\n");
      const temporary = join(root, "tmp");
      mkdirSync(temporary);
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: { ...environment, TMPDIR: temporary },
      });

      expect(result.stderr).toBe("");
      expect(result.status).toBe(0);
      const spawns = recordedSpawns(root);
      const reports = spawns.at(-1)?.[2] ?? "";
      expect(reports.startsWith(join(temporary, "sdp-test-reports-"))).toBe(true);
      expect(spawns.map((spawn) => spawn.map((arg) => arg.replace(reports, "<reports>")))).toEqual(
        expected,
      );
      expect(readdirSync(temporary)).toEqual([]);
    },
  );

  it("refuses coverage in a split run and says no coverage provider is installed", () => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), "--coverage"], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toBe(
      "Coverage needs a Vitest coverage provider, and none is installed (@vitest/coverage-v8 or @vitest/coverage-istanbul).\n",
    );
    expect(existsSync(join(root, "spawns.log"))).toBe(false);
  });

  it.each([[["--reporter=html"]], [["--reporter", "html", "--outputFile=report/index.html"]]])(
    "refuses a split run writing the html report %j before any pass while @vitest/ui is missing",
    (options) => {
      const { root, environment } = shimmedPoolRoot(
        'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
        [selfHostingContracts, checkoutContracts],
      );
      const temporary = join(root, "tmp");
      mkdirSync(temporary);
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: { ...environment, TMPDIR: temporary },
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toBe("The html reporter needs @vitest/ui, and it is not installed.\n");
      expect(existsSync(join(root, "spawns.log"))).toBe(false);
      expect(readdirSync(temporary)).toEqual([]);
    },
  );

  it.each([[["--reporter", "blob"]], [["--reporter=blob", "--outputFile=blob.json"]]])(
    "refuses a split run writing the blob report %j, which Vitest cannot merge into",
    (options) => {
      const { root, environment } = shimmedPoolRoot(
        'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
        [selfHostingContracts, checkoutContracts],
      );
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "This run executes test/cli.test.ts in its own Vitest process after the others, and Vitest cannot merge two runs into one blob report.",
      );
      expect(existsSync(join(root, "spawns.log"))).toBe(false);
    },
  );

  it.each([
    [
      'reporters: ["blob"]',
      "This run executes test/cli.test.ts in its own Vitest process after the others, and Vitest cannot merge two runs into one blob report.",
    ],
    [
      "coverage: { enabled: true }",
      "Coverage needs a Vitest coverage provider, and none is installed (@vitest/coverage-v8 or @vitest/coverage-istanbul).",
    ],
    ['reporters: ["html"]', "The html reporter needs @vitest/ui, and it is not installed."],
  ])("refuses a split run whose configuration sets %s", (setting, refusal) => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    writeFileSync(join(root, "vitest.config.mjs"), `export default { test: { ${setting} } };\n`);
    const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs")], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(refusal);
    expect(existsSync(join(root, "spawns.log"))).toBe(false);
  });

  it("leaves a configuration Vitest cannot load to the passes, reading the caller's options alone", () => {
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    writeFileSync(join(root, "vitest.config.mjs"), 'throw new Error("broken configuration");\n');
    const result = spawnSync(
      process.execPath,
      [join(repoRoot, "vitest-test.mjs"), "--reporter=junit", "--outputFile=report.xml"],
      { cwd: root, encoding: "utf8", env: environment },
    );

    // The shim stands in for Vitest and records no blob report, so nothing is merged.
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(recordedSpawns(root).map((spawn) => spawn.slice(0, 2))).toEqual([
      ["--run", "--exclude"],
      ["--run", "test/cli.test.ts"],
    ]);
    expect(recordedSpawns(root)[0]).toContain("--reporter=blob");
  });

  it("hands each pass the caller's environment, untouched by reading the configuration", () => {
    // The wrapper sets the first three as Vitest does before it loads a configuration, and Vite
    // sets the rest while it loads one.
    const viteVariables = ["NODE_ENV", "VITEST", "TEST", "MODE", "DEV", "PROD", "BASE_URL"];
    const { root, environment } = shimmedPoolRoot(
      `require("node:fs").appendFileSync("spawns.log", JSON.stringify(${JSON.stringify(viteVariables)}.map((name) => process.env[name] ?? null)) + "\\n");`,
      [selfHostingContracts, checkoutContracts],
    );
    writeFileSync(join(root, "vitest.config.mjs"), "export default { test: {} };\n");
    const callerEnvironment = Object.fromEntries(
      Object.entries(environment).filter(([name]) => !viteVariables.includes(name)),
    );
    const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs")], {
      cwd: root,
      encoding: "utf8",
      env: callerEnvironment,
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    const unset = viteVariables.map(() => null);
    expect(recordedSpawns(root)).toEqual([unset, unset]);
  });

  it("leaves each pass its configured reporters when none of them writes a report file", () => {
    // The repository's CI reporter has this shape: an inline reporter that writes one file per
    // process, with no output file configured.
    const { root, environment } = shimmedPoolRoot(
      'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      [selfHostingContracts, checkoutContracts],
    );
    writeFileSync(
      join(root, "vitest.config.mjs"),
      'export default { test: { reporters: ["default", { onTestRunEnd() {} }] } };\n',
    );
    const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs")], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(recordedSpawns(root)).toEqual([
      ["--run", "--exclude", "test/cli.test.ts"],
      ["--run", "test/cli.test.ts", "--pool", "forks", "--maxWorkers", "1", "--no-isolate"],
    ]);
  });

  it.each([[["list", "--filesOnly"]], [["--reporter", "verbose", "list", "test/cli.test.ts"]]])(
    "forwards the listing command %j once, without running the CLI suite",
    (options) => {
      const { root, environment } = shimmedPoolRoot(
        'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
        [selfHostingContracts, checkoutContracts],
      );
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });

      expect(result.status).toBe(0);
      const spawns = readFileSync(join(root, "spawns.log"), "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line) as string[]);
      expect(spawns).toEqual([["--run", ...options]]);
    },
  );

  it.each([
    [["bench"], ["--run", "bench"]],
    [
      ["bench", "test/cli.test.ts"],
      ["--run", "bench", "test/cli.test.ts"],
    ],
    [
      ["--", "bench"],
      ["--run", "bench"],
    ],
  ])(
    "forwards the benchmark command %j once, with no CLI unit pass and no contract tree",
    (options, expected) => {
      const { root, environment } = shimmedPoolRoot(
        'require("node:fs").appendFileSync("spawns.log", JSON.stringify(process.argv.slice(2)) + "\\n");',
      );
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });

      expect(result.stderr).toBe("");
      expect(result.status).toBe(0);
      expect(recordedSpawns(root)).toEqual([expected]);
    },
  );

  it.each([["watch"], ["dev"]])(
    "keeps the dedicated CLI pass for the executing command %s",
    (command) => {
      // The shim stands in for the CLI suite: it regenerates generated/ whenever it executes
      // test/cli.test.ts, which only the dedicated pass may do.
      const { root, environment } = shimmedPoolRoot(
        [
          'const fs = require("node:fs");',
          "const args = process.argv.slice(2);",
          'fs.appendFileSync("spawns.log", JSON.stringify(args) + "\\n");',
          'if (args.includes("test/cli.test.ts") && !args.includes("--exclude")) fs.writeFileSync("generated/sentinel.txt", "after\\n");',
        ].join("\n"),
        [selfHostingContracts, checkoutContracts],
      );
      const result = spawnSync(
        process.execPath,
        [join(repoRoot, "vitest-test.mjs"), command, "test/cli.test.ts"],
        { cwd: root, encoding: "utf8", env: environment },
      );

      expect(result.stderr).toBe("");
      expect(result.status).toBe(0);
      const spawns = readFileSync(join(root, "spawns.log"), "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line) as string[]);
      expect(spawns).toEqual([
        [
          "--run",
          command,
          "test/cli.test.ts",
          "--exclude",
          "test/cli.test.ts",
          "--passWithNoTests",
        ],
        ["--run", "test/cli.test.ts", "--pool", "forks", "--maxWorkers", "1", "--no-isolate"],
      ]);
    },
  );

  it("passes a pooled run that leaves repository-root generated state untouched", () => {
    const { root, environment } = shimmedPoolRoot("");
    const result = runPooledWrapper(root, environment);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
  });
});

// A root the wrapper runs with the repository's own Vitest: a CLI suite of two tests and one other
// suite, each recording the tests that ran. Globals spare the files an import Vitest would have to
// resolve from the temporary root.
function realVitestRoot(): { root: string; environment: NodeJS.ProcessEnv } {
  const root = preflightRoot([selfHostingContracts, checkoutContracts]);
  mkdirSync(join(root, "test"));
  writeFileSync(
    join(root, "vitest.config.mjs"),
    'export default { test: { globals: true, include: ["test/**/*.test.ts"] } };\n',
  );
  const suite = (names: readonly string[]) =>
    [
      'import { appendFileSync } from "node:fs";',
      ...names.map(
        (name) => `it(${JSON.stringify(name)}, () => appendFileSync("ran.log", "${name}\\n"));`,
      ),
    ].join("\n");
  writeFileSync(join(root, "test", "cli.test.ts"), suite(["cli alpha", "cli beta"]));
  writeFileSync(join(root, "test", "other.test.ts"), suite(["other gamma"]));

  return {
    root,
    environment: {
      ...process.env,
      PATH: `${join(repoRoot, "node_modules", ".bin")}:${process.env.PATH ?? ""}`,
    },
  };
}

describe("the test wrapper over real Vitest", () => {
  it.each([
    [["-t", "cli alpha"], ["cli alpha"]],
    [["--testNamePattern", "gamma"], ["other gamma"]],
    [["--", "test/other.test.ts"], ["other gamma"]],
    [["--", "-t", "beta"], ["cli beta"]],
    // Vitest ignores a filter behind the caller's own delimiter, and so does the wrapper.
    [
      ["--", "--", "test/other.test.ts"],
      ["cli alpha", "cli beta", "other gamma"],
    ],
  ])(
    "runs %j as Vitest would select it, with the CLI suite only in its own pass",
    (options, ran) => {
      const { root, environment } = realVitestRoot();
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });

      expect(result.status, result.stderr).toBe(0);
      const log = join(root, "ran.log");
      expect(existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").sort() : []).toEqual(
        ran,
      );
    },
    120_000,
  );

  it.each([
    [["--reporter", "junit", "--outputFile", "report.xml"]],
    [["--reporter=junit", "--outputFile=report.xml"]],
    [["--reporter=junit", "--outputFile.junit=report.xml", "-t", "a"]],
  ])(
    "writes one report holding both passes for %j",
    (options) => {
      const { root, environment } = realVitestRoot();
      const temporary = join(root, "tmp");
      mkdirSync(temporary);
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: { ...environment, TMPDIR: temporary },
      });

      expect(result.status, result.stderr).toBe(0);
      const ran = ["cli alpha", "cli beta", "other gamma"];
      expect(readFileSync(join(root, "ran.log"), "utf8").trim().split("\n").sort()).toEqual(ran);
      const report = readFileSync(join(root, "report.xml"), "utf8");
      expect(
        [...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
      ).toEqual(ran);
      expect(readdirSync(temporary).filter((name) => name.startsWith("sdp-test-reports-"))).toEqual(
        [],
      );
    },
    120_000,
  );

  it("writes one JUnit document to stdout when no output file is named", () => {
    const { root, environment } = realVitestRoot();
    const result = spawnSync(
      process.execPath,
      [join(repoRoot, "vitest-test.mjs"), "--reporter=junit"],
      {
        cwd: root,
        encoding: "utf8",
        env: environment,
      },
    );

    expect(result.status, result.stderr).toBe(0);
    const ran = ["cli alpha", "cli beta", "other gamma"];
    expect(readFileSync(join(root, "ran.log"), "utf8").trim().split("\n").sort()).toEqual(ran);
    expect([...result.stdout.matchAll(/<\?xml\b/gu)]).toHaveLength(1);
    expect(
      [...result.stdout.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
    ).toEqual(ran);
  }, 120_000);

  it.each([[["--config", "custom.config.mjs"]], [["-c", "custom.config.mjs"]]])(
    "merges both passes with the configuration file %j they ran with",
    (configuration) => {
      // A configuration that names its project: the merge must read it to know the project.
      const { root, environment } = realVitestRoot();
      rmSync(join(root, "vitest.config.mjs"));
      writeFileSync(
        join(root, "custom.config.mjs"),
        'export default { test: { name: "custom", globals: true, include: ["test/**/*.test.ts"] } };\n',
      );
      const result = spawnSync(
        process.execPath,
        [
          join(repoRoot, "vitest-test.mjs"),
          ...configuration,
          "--reporter=junit",
          "--outputFile=report.xml",
        ],
        { cwd: root, encoding: "utf8", env: environment },
      );

      expect(result.status, result.stderr).toBe(0);
      const report = readFileSync(join(root, "report.xml"), "utf8");
      expect(
        [...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
      ).toEqual(["cli alpha", "cli beta", "other gamma"]);
    },
    120_000,
  );

  it.each([
    ['reporters: ["junit"], outputFile: "report.xml"'],
    ['reporters: [["junit", { outputFile: "report.xml" }]]'],
  ])(
    "merges both passes into the report file the configuration names with %s",
    (reporting) => {
      // No reporting option on the command line: the configuration file alone asks for the file.
      const { root, environment } = realVitestRoot();
      writeFileSync(
        join(root, "vitest.config.mjs"),
        `export default { test: { globals: true, include: ["test/**/*.test.ts"], ${reporting} } };\n`,
      );
      const temporary = join(root, "tmp");
      mkdirSync(temporary);
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs")], {
        cwd: root,
        encoding: "utf8",
        env: { ...environment, TMPDIR: temporary },
      });

      expect(result.status, result.stderr).toBe(0);
      const ran = ["cli alpha", "cli beta", "other gamma"];
      expect(readFileSync(join(root, "ran.log"), "utf8").trim().split("\n").sort()).toEqual(ran);
      const report = readFileSync(join(root, "report.xml"), "utf8");
      expect(
        [...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
      ).toEqual(ran);
      expect(readdirSync(temporary)).toEqual([]);
    },
    120_000,
  );

  it("merges both passes into the report file a configuration names when it loads with the runner loader alone", () => {
    // The configuration imports its reporting settings by a relative path at run time. The default
    // loader bundles the configuration into the nearest node_modules/.vite-temp, where that path
    // finds nothing; `--configLoader runner` loads the file where it is. Without a node_modules
    // folder above it, Vite bundles beside the configuration and the path resolves, so the root
    // has its own.
    const { root, environment } = realVitestRoot();
    mkdirSync(join(root, "node_modules"));
    writeFileSync(
      join(root, "settings.mjs"),
      'export default { reporters: ["junit"], outputFile: "report.xml" };\n',
    );
    writeFileSync(
      join(root, "vitest.config.mjs"),
      [
        'const settings = "./settings.mjs";',
        "const reporting = (await import(/* @vite-ignore */ settings)).default;",
        'export default { test: { globals: true, include: ["test/**/*.test.ts"], ...reporting } };',
        "",
      ].join("\n"),
    );
    const result = spawnSync(
      process.execPath,
      [join(repoRoot, "vitest-test.mjs"), "--configLoader", "runner"],
      { cwd: root, encoding: "utf8", env: environment },
    );

    expect(result.status, result.stderr).toBe(0);
    const report = readFileSync(join(root, "report.xml"), "utf8");
    expect([...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort()).toEqual(
      ["cli alpha", "cli beta", "other gamma"],
    );
  }, 120_000);

  it.each([
    ["its main file", { main: "index.mjs" }],
    ["its exports for import alone", { exports: { ".": { import: "./index.mjs" } } }],
    [
      "its exports for import, where require names another file",
      { exports: { ".": { require: "./plain.cjs", import: "./index.mjs" } } },
    ],
  ])(
    "merges both passes into the report file a configuration from a package names through %s",
    (_shape, entry) => {
      // Vitest looks a `--config` value up as a module from the root before it reads it as a path,
      // and it resolves a package's exports as an import does. The file required from the package
      // asks for no report.
      const { root, environment } = realVitestRoot();
      rmSync(join(root, "vitest.config.mjs"));
      const configurationPackage = join(root, "node_modules", "shared-test-config");
      mkdirSync(configurationPackage, { recursive: true });
      writeFileSync(
        join(configurationPackage, "package.json"),
        `${JSON.stringify({ name: "shared-test-config", version: "1.0.0", ...entry })}\n`,
      );
      writeFileSync(
        join(configurationPackage, "index.mjs"),
        'export default { test: { globals: true, include: ["test/**/*.test.ts"], reporters: ["junit"], outputFile: "report.xml" } };\n',
      );
      writeFileSync(
        join(configurationPackage, "plain.cjs"),
        'module.exports = { test: { globals: true, include: ["test/**/*.test.ts"] } };\n',
      );
      const result = spawnSync(
        process.execPath,
        [join(repoRoot, "vitest-test.mjs"), "--config", "shared-test-config"],
        { cwd: root, encoding: "utf8", env: environment },
      );

      expect(result.status, result.stderr).toBe(0);
      expect(readFileSync(join(root, "ran.log"), "utf8").trim().split("\n").sort()).toEqual([
        "cli alpha",
        "cli beta",
        "other gamma",
      ]);
      const report = readFileSync(join(root, "report.xml"), "utf8");
      expect(
        [...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
      ).toEqual(["cli alpha", "cli beta", "other gamma"]);
    },
    120_000,
  );

  it.each([
    ['process.env.NODE_ENV === "test"', {}],
    ['process.env.VITEST === "true"', {}],
    ['process.env.TEST === "true"', {}],
    ['process.env.NODE_ENV === "production"', { NODE_ENV: "production" }],
  ])(
    "reads a configuration that asks for a report file when %s as the passes read it",
    (condition, callerVariables) => {
      // Vitest sets these before it loads a configuration. A run started from a shell seldom has
      // them, so the caller's environment leaves them unset, or sets the one the case names.
      const testVariables = ["NODE_ENV", "VITEST", "TEST"];
      const { root, environment } = realVitestRoot();
      writeFileSync(
        join(root, "vitest.config.mjs"),
        `export default { test: { globals: true, include: ["test/**/*.test.ts"], ...(${condition} ? { reporters: ["junit"], outputFile: "report.xml" } : {}) } };\n`,
      );
      const callerEnvironment = {
        ...Object.fromEntries(
          Object.entries(environment).filter(([name]) => !testVariables.includes(name)),
        ),
        ...callerVariables,
      };
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs")], {
        cwd: root,
        encoding: "utf8",
        env: callerEnvironment,
      });

      expect(result.status, result.stderr).toBe(0);
      const report = readFileSync(join(root, "report.xml"), "utf8");
      expect(
        [...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort(),
      ).toEqual(["cli alpha", "cli beta", "other gamma"]);
    },
    120_000,
  );

  it("reports a failing pooled pass in the merged report and stops before the CLI pass", () => {
    const { root, environment } = realVitestRoot();
    writeFileSync(
      join(root, "test", "fails.test.ts"),
      'it("other fails", () => { throw new Error("boom"); });\n',
    );
    const result = spawnSync(
      process.execPath,
      [join(repoRoot, "vitest-test.mjs"), "--reporter=junit", "--outputFile=report.xml"],
      { cwd: root, encoding: "utf8", env: environment },
    );

    expect(result.status).toBe(1);
    expect(readFileSync(join(root, "ran.log"), "utf8")).toBe("other gamma\n");
    const report = readFileSync(join(root, "report.xml"), "utf8");
    expect([...report.matchAll(/<testcase [^>]*name="([^"]*)"/gu)].map((m) => m[1]).sort()).toEqual(
      ["other fails", "other gamma"],
    );
    expect(report).toContain('<failure message="boom"');
  }, 120_000);

  it.each([[["--", "--help"]], [["--", "-h"]]])(
    "prints usage for %j and runs no test",
    (options) => {
      const { root, environment } = realVitestRoot();
      const result = spawnSync(process.execPath, [join(repoRoot, "vitest-test.mjs"), ...options], {
        cwd: root,
        encoding: "utf8",
        env: environment,
      });

      expect(result.status, result.stderr).toBe(0);
      expect(result.stdout).toContain("Usage:");
      expect(existsSync(join(root, "ran.log"))).toBe(false);
    },
    120_000,
  );
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

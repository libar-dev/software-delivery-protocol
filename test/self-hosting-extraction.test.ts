import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { refusedPathContract } from "../generated/contracts/extraction.excludes.refused-path.contract.js";
import { segmentBoundaryContract } from "../generated/contracts/extraction.excludes.segment-boundary.contract.js";
import { caseCollidingPathContract } from "../generated/contracts/extraction.executable-contracts.case-colliding-path.contract.js";
import { concretenessRefusalContract } from "../generated/contracts/extraction.executable-contracts.concreteness-refusal.contract.js";
import { multiEntryExampleContract } from "../generated/contracts/extraction.executable-contracts.multi-entry-example.contract.js";
import { redStepNamingContract } from "../generated/contracts/extraction.example-runner.red-step-naming.contract.js";
import { stepOrderContract } from "../generated/contracts/extraction.example-runner.step-order.contract.js";
import { declaredVersionContract } from "../generated/contracts/extraction.schema-versioning.declared-version.contract.js";
import { discoverFiles } from "../src/extract/discover.js";
import type { DiscoveredFiles } from "../src/extract/discover.js";
import { serializeGraph } from "../src/extract/serialize.js";
import {
  deriveGraph,
  generateContracts,
  refines,
  schemaVersion,
  spec,
  specId,
} from "../src/index.js";
import type { GeneratedContracts, GraphSchema, Spec } from "../src/index.js";
import { planExample, runExamplePlan } from "../src/runner/index.js";
import type { ExampleContract, StepKind } from "../src/runner/index.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

/**
 * The bound executable points of the extraction family. The exclusion law reads a real filesystem
 * root, so its world is a temporary fixture tree — never the repository root, which no pooled test
 * may touch. The schema-version law needs no filesystem at all: `deriveGraph` and `serializeGraph`
 * are the payload seam a consumer actually reads. The contract-generation and runner laws run over
 * in-memory probe graphs and in-memory contracts, so no point here touches repository-root
 * `generated/`.
 *
 * `test/exclude-diagnostics.test.ts`, `test/graph-schema.test.ts`, `test/codegen.test.ts`, and
 * `test/runner.test.ts` stay as regression evidence: these points state the laws, never every
 * diagnostic spelling, degradation row, or exported contract field.
 */

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  temporaryRoots.clear();
});

/* ----- spec:extraction.excludes ----- */

interface ExcludeWorld {
  readonly root: string;
  exclusion: string;
  discovered: DiscoveredFiles | undefined;
  refusal: Error | undefined;
}

function excludeWorld(): ExcludeWorld {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-excludes-"));
  temporaryRoots.add(root);

  return { root, exclusion: "", discovered: undefined, refusal: undefined };
}

function discoveredOf(world: ExcludeWorld): DiscoveredFiles {
  if (world.discovered === undefined) {
    throw new Error("The discovery step must run before the surviving carriers are asserted.");
  }

  return world.discovered;
}

const excludeBindings = {
  "the extraction root carries the tree {excludedTree} and the similar sibling {similarTree}": (
    world: ExcludeWorld,
    params: { readonly excludedTree: string; readonly similarTree: string },
  ) => {
    // Both trees carry both discovery surfaces — a spec carrier and an anchor candidate — so one
    // exclusion is observed on each surface rather than on the declared layer alone.
    for (const tree of [params.excludedTree, params.similarTree]) {
      mkdirSync(join(world.root, tree), { recursive: true });
      writeFileSync(
        join(
          world.root,
          tree,
          tree === params.excludedTree ? "excluded.sdp.ts" : "included.sdp.ts",
        ),
        "",
        "utf8",
      );
      writeFileSync(join(world.root, tree, "helper.ts"), "", "utf8");
    }
  },
  "the consumer supplies the exclusion {exclusion}": (
    world: ExcludeWorld,
    params: { readonly exclusion: string },
  ) => {
    world.exclusion = params.exclusion;
  },
  "the root is discovered": (world: ExcludeWorld) => {
    try {
      world.discovered = discoverFiles(world.root, [world.exclusion]);
    } catch (error) {
      world.refusal = error instanceof Error ? error : new Error(String(error));
    }
  },
  "the discovery attempt {outcome}": (
    world: ExcludeWorld,
    params: { readonly outcome: "completes" | "is refused" },
  ) => {
    expect(world.discovered !== undefined).toBe(params.outcome === "completes");
    expect(world.refusal !== undefined).toBe(params.outcome === "is refused");
  },
  "the surviving spec carrier is {specCarrier} and the surviving anchor candidate is {anchorCandidate}":
    (
      world: ExcludeWorld,
      params: { readonly specCarrier: string; readonly anchorCandidate: string },
    ) => {
      const discovered = discoveredOf(world);

      expect(discovered.specFiles.map((file) => file.relativePath)).toEqual([params.specCarrier]);
      expect(discovered.anchorCandidateFiles.map((file) => file.relativePath)).toEqual([
        params.anchorCandidate,
      ]);
    },
  "the refusal states {diagnostic} and names the offending path": (
    world: ExcludeWorld,
    params: { readonly diagnostic: string },
  ) => {
    const message = world.refusal?.message ?? "the exclusion refusal is missing";

    expect(message).toContain(params.diagnostic);
    expect(message).toContain(`"${world.exclusion}"`);
  },
};

const excludesSegmentBoundaryTestAnchor = specTest({
  id: testAnchorId("test:protocol.excludes.segment-boundary"),
  label: "the segment-boundary point verifies the exact-prefix exclusion rule",
  verifies: ref("spec:extraction.excludes.segment-boundary"),
});
void excludesSegmentBoundaryTestAnchor;

bindExample(segmentBoundaryContract, excludeWorld, excludeBindings);

const excludesRefusedPathTestAnchor = specTest({
  id: testAnchorId("test:protocol.excludes.refused-path"),
  label: "the refused-path point verifies the malformed-exclusion refusal",
  verifies: ref("spec:extraction.excludes.refused-path"),
});
void excludesRefusedPathTestAnchor;

bindExample(refusedPathContract, excludeWorld, excludeBindings);

/* ----- spec:extraction.schema-versioning ----- */

interface SchemaVersionWorld {
  graph: GraphSchema | undefined;
  payload: string | undefined;
}

function schemaVersionWorld(): SchemaVersionWorld {
  return { graph: undefined, payload: undefined };
}

function payloadOf(world: SchemaVersionWorld): Record<string, unknown> {
  if (world.payload === undefined) {
    throw new Error("The serialization step must run before the payload is read.");
  }

  return JSON.parse(world.payload) as Record<string, unknown>;
}

const schemaVersionBindings = {
  "a graph derived from the authored spec {specId}": (
    world: SchemaVersionWorld,
    params: { readonly specId: string },
  ) => {
    world.graph = deriveGraph(
      [
        {
          id: params.specId,
          file: "specs/probe.sdp.md",
          line: 1,
          data: {
            id: params.specId,
            title: "Probe for the declared schema version",
            kind: "rule",
            altitude: "story",
            readiness: "idea",
          },
        },
      ],
      [],
      [],
    );
  },
  "the graph payload is serialized": (world: SchemaVersionWorld) => {
    if (world.graph === undefined) {
      throw new Error("The derivation step must run before the payload is serialized.");
    }

    world.payload = serializeGraph(world.graph);
  },
  "the payload declares the schema version {schemaVersion}": (
    world: SchemaVersionWorld,
    params: { readonly schemaVersion: string },
  ) => {
    expect(payloadOf(world).schemaVersion).toBe(params.schemaVersion);
  },
  "the parsed payload agrees with the engine's declared version: {agrees}": (
    world: SchemaVersionWorld,
    params: { readonly agrees: boolean },
  ) => {
    expect(payloadOf(world).schemaVersion === schemaVersion).toBe(params.agrees);
  },
};

const schemaVersioningTestAnchor = specTest({
  id: testAnchorId("test:protocol.schema-versioning.declared-version"),
  label: "the declared-version point verifies the readable payload version",
  verifies: ref("spec:extraction.schema-versioning.declared-version"),
});
void schemaVersioningTestAnchor;

bindExample(declaredVersionContract, schemaVersionWorld, schemaVersionBindings);

/* ----- spec:extraction.executable-contracts ----- */

const PROBE_PARENT_ID = "spec:probe.create-order";

interface ContractsWorld {
  dimension: string;
  exampleId: string;
  binds: boolean;
  entryCount: number;
  twinId: string | undefined;
  generated: GeneratedContracts | undefined;
}

function contractsWorld(): ContractsWorld {
  return {
    dimension: "",
    exampleId: "",
    binds: true,
    entryCount: 1,
    twinId: undefined,
    generated: undefined,
  };
}

function generatedOf(world: ContractsWorld): GeneratedContracts {
  if (world.generated === undefined) {
    throw new Error("The generation step must run before the emitted tree is read.");
  }

  return world.generated;
}

/** The contract path a spec ID claims — the case-folded collision surface the law is about. */
function contractPathOf(id: string): string {
  return `${id.slice(id.indexOf(":") + 1)}.contract.ts`;
}

function probeParent(dimension: string): Spec {
  return spec({
    id: specId(PROBE_PARENT_ID),
    title: "Probe parent for contract generation",
    kind: "behavior",
    altitude: "feature",
    readiness: "defined",
    intent: { outcome: "Declare one typed dimension for a probe example space." },
    behavior: {
      exampleSpace: {
        given: [`a customer has a cart with {${dimension}:number} line items`],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created"],
      },
    },
  });
}

function probeExample(id: string, world: ContractsWorld): Spec {
  const entries = Array.from({ length: world.entryCount }, (_, index) => ({
    given: [
      world.binds
        ? `a customer has a cart with {${world.dimension}: ${String(2 + index)}} line items`
        : `a customer has a cart with {${world.dimension}} line items`,
    ],
    when: ["the customer submits the cart for order creation"],
    then: ["an order is created"],
  }));

  return spec({
    id: specId(id),
    title: "Probe example for contract generation",
    kind: "example",
    altitude: "story",
    readiness: "defined",
    intent: { outcome: "Bind one point against the probe example space." },
    behavior: { examples: entries },
    relations: [refines(specId(PROBE_PARENT_ID))],
  });
}

const contractsBindings = {
  "a parent spec whose example space declares the slot {dimension}": (
    world: ContractsWorld,
    params: { readonly dimension: string },
  ) => {
    world.dimension = params.dimension;
  },
  "a refining example {exampleId} whose used step {binding} that slot": (
    world: ContractsWorld,
    params: { readonly exampleId: string; readonly binding: "binds" | "leaves unbound" },
  ) => {
    world.exampleId = params.exampleId;
    world.binds = params.binding === "binds";
  },
  "the example carries {entryCount} structured entries": (
    world: ContractsWorld,
    params: { readonly entryCount: number },
  ) => {
    world.entryCount = params.entryCount;
  },
  "a case-twin example {twinId} whose contract path differs only by letter case": (
    world: ContractsWorld,
    params: { readonly twinId: string },
  ) => {
    world.twinId = params.twinId;
  },
  "the contracts are generated from the derived graph": (world: ContractsWorld) => {
    const specs = [probeParent(world.dimension), probeExample(world.exampleId, world)];

    if (world.twinId !== undefined) {
      specs.push(probeExample(world.twinId, world));
    }

    world.generated = generateContracts(deriveFixtureGraph({ specs }));
  },
  "the generated tree holds {fileCount} files": (
    world: ContractsWorld,
    params: { readonly fileCount: number },
  ) => {
    expect(generatedOf(world).files.size).toBe(params.fileCount);
  },
  "the step contract for the example is emitted: {emitted}": (
    world: ContractsWorld,
    params: { readonly emitted: boolean },
  ) => {
    expect(generatedOf(world).files.has(contractPathOf(world.exampleId))).toBe(params.emitted);
  },
  "the findings name {findingId}": (
    world: ContractsWorld,
    params: { readonly findingId: string },
  ) => {
    const named = generatedOf(world).findings.filter(
      (finding) => finding.validatorId === params.findingId,
    );

    expect(named.length).toBeGreaterThan(0);
    // Generation findings describe what did not emit; gating is validateGraph's alone.
    expect(named.every((finding) => finding.severity === "warning")).toBe(true);
  },
};

const concretenessRefusalTestAnchor = specTest({
  id: testAnchorId("test:protocol.executable-contracts.concreteness-refusal"),
  label: "the concreteness point verifies the unbound-slot refusal",
  verifies: ref("spec:extraction.executable-contracts.concreteness-refusal"),
});
void concretenessRefusalTestAnchor;

bindExample(concretenessRefusalContract, contractsWorld, contractsBindings);

const multiEntryExampleTestAnchor = specTest({
  id: testAnchorId("test:protocol.executable-contracts.multi-entry-example"),
  label: "the multi-entry point verifies the named second entry",
  verifies: ref("spec:extraction.executable-contracts.multi-entry-example"),
});
void multiEntryExampleTestAnchor;

bindExample(multiEntryExampleContract, contractsWorld, contractsBindings);

const caseCollidingPathTestAnchor = specTest({
  id: testAnchorId("test:protocol.executable-contracts.case-colliding-path"),
  label: "the collision point verifies the all-or-nothing withholding",
  verifies: ref("spec:extraction.executable-contracts.case-colliding-path"),
});
void caseCollidingPathTestAnchor;

bindExample(caseCollidingPathContract, contractsWorld, contractsBindings);

/* ----- spec:extraction.example-runner ----- */

type CartStep = "a cart with {n} line items" | "the cart is submitted" | "an order is created";

// A type literal, deliberately not an interface: only type-alias object literals carry the
// implicit index signature the `Record<S, ParamShape>` constraint needs.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CartStepParams = {
  "a cart with {n} line items": { readonly n: number };
  "the cart is submitted": Record<string, never>;
  "an order is created": Record<string, never>;
};

type CartContract = ExampleContract<CartStep, CartStepParams>;

interface RunnerWorld {
  occurrences: number;
  failingPhase: StepKind | undefined;
  thrown: Error | undefined;
  readonly trace: string[];
  failure: unknown;
  completed: boolean;
}

function runnerWorld(): RunnerWorld {
  return {
    occurrences: 0,
    failingPhase: undefined,
    thrown: undefined,
    trace: [],
    failure: undefined,
    completed: false,
  };
}

function cartContract(occurrences: number): CartContract {
  const steps: CartContract["steps"][number][] = [];

  for (let occurrence = 0; occurrence < occurrences; occurrence += 1) {
    steps.push({ kind: "given", text: "a cart with {n} line items", params: { n: 2 } });
  }

  steps.push({ kind: "when", text: "the cart is submitted", params: {} });
  steps.push({ kind: "then", text: "an order is created", params: {} });

  return { spec: "spec:probe.cart", title: "A probe cart example", steps };
}

function throwWhenRed(world: RunnerWorld, phase: StepKind): void {
  if (world.failingPhase === phase && world.thrown !== undefined) {
    throw world.thrown;
  }
}

function failureOf(world: RunnerWorld): Error {
  if (!(world.failure instanceof Error)) {
    throw new Error("The run step must fail before the failure message is read.");
  }

  return world.failure;
}

const runnerBindings = {
  "a contract whose given step repeats {occurrences} times before one when step and one then step":
    (world: RunnerWorld, params: { readonly occurrences: number }) => {
      world.occurrences = params.occurrences;
    },
  "the handler bound to the {failingPhase} step throws {thrown}": (
    world: RunnerWorld,
    params: { readonly failingPhase: "given" | "when" | "then"; readonly thrown: string },
  ) => {
    world.failingPhase = params.failingPhase;
    world.thrown = new Error(params.thrown);
  },
  "the bound plan runs against a fresh world": async (world: RunnerWorld) => {
    const plan = planExample<RunnerWorld, CartStep, CartStepParams>(
      cartContract(world.occurrences),
      {
        "a cart with {n} line items": (running, params) => {
          throwWhenRed(running, "given");
          running.trace.push(`given ${String(params.n)}`);
        },
        "the cart is submitted": (running) => {
          throwWhenRed(running, "when");
          running.trace.push("when");
        },
        "an order is created": (running) => {
          throwWhenRed(running, "then");
          running.trace.push("then");
        },
      },
    );

    try {
      await runExamplePlan(plan, world);
      world.completed = true;
    } catch (error) {
      world.failure = error;
    }
  },
  "the world records the handler trace {trace}": (
    world: RunnerWorld,
    params: { readonly trace: string },
  ) => {
    expect(world.trace.join(" | ")).toBe(params.trace);
  },
  "the run {outcome}": (
    world: RunnerWorld,
    params: { readonly outcome: "completes" | "fails" },
  ) => {
    expect(world.completed).toBe(params.outcome === "completes");
    expect(world.failure !== undefined).toBe(params.outcome === "fails");
  },
  "the failure names the step in the Spec's own words as {failureLabel}": (
    world: RunnerWorld,
    params: { readonly failureLabel: string },
  ) => {
    expect(failureOf(world).message.startsWith(params.failureLabel)).toBe(true);
  },
  "the failure preserves the original detail {detail}": (
    world: RunnerWorld,
    params: { readonly detail: string },
  ) => {
    // The original error survives as the thrown object, so an assertion renderer still reads its
    // own fields off it; the step name is a prefix, never a replacement.
    expect(failureOf(world)).toBe(world.thrown);
    expect(failureOf(world).message).toContain(params.detail);
  },
};

const exampleRunnerStepOrderTestAnchor = specTest({
  id: testAnchorId("test:protocol.example-runner.step-order"),
  label: "the step-order point verifies contract order and the one handler per step",
  verifies: ref("spec:extraction.example-runner.step-order"),
});
void exampleRunnerStepOrderTestAnchor;

bindExample(stepOrderContract, runnerWorld, runnerBindings);

const exampleRunnerRedStepTestAnchor = specTest({
  id: testAnchorId("test:protocol.example-runner.red-step-naming"),
  label: "the red-step point verifies the self-naming failure law",
  verifies: ref("spec:extraction.example-runner.red-step-naming"),
});
void exampleRunnerRedStepTestAnchor;

bindExample(redStepNamingContract, runnerWorld, runnerBindings);

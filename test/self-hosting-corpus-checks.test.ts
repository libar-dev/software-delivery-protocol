import { unrealizedDesignContract } from "../generated/contracts/model.planned-architecture.unrealized-design.contract.js";
import { registerUnrealizedDesign } from "./model.planned-architecture.unrealized-design.test.generated.js";
import { matchingDesignContract } from "../generated/contracts/model.planned-architecture.matching-design.contract.js";
import { registerMatchingDesign } from "./model.planned-architecture.matching-design.test.generated.js";
import { differingLayerAndUsesContract } from "../generated/contracts/model.planned-architecture.differing-layer-and-uses.contract.js";
import { registerDifferingLayerAndUses } from "./model.planned-architecture.differing-layer-and-uses.test.generated.js";
import { unstatedLayerUnclassifiedContract } from "../generated/contracts/validation.architecture-constraints.unstated-layer-unclassified.contract.js";
import { registerUnstatedLayerUnclassified } from "./validation.architecture-constraints.unstated-layer-unclassified.test.generated.js";
import { isolatedContextAsRuleContract } from "../generated/contracts/validation.architecture-constraints.isolated-context-as-rule.contract.js";
import { registerIsolatedContextAsRule } from "./validation.architecture-constraints.isolated-context-as-rule.test.generated.js";
import { forbiddenLayerPairContract } from "../generated/contracts/validation.architecture-constraints.forbidden-layer-pair.contract.js";
import { registerForbiddenLayerPair } from "./validation.architecture-constraints.forbidden-layer-pair.test.generated.js";
import { warningFindingInformsContract } from "../generated/contracts/validation.corpus-rules.warning-finding-informs.contract.js";
import { registerWarningFindingInforms } from "./validation.corpus-rules.warning-finding-informs.test.generated.js";
import { malformedFindingFailsContract } from "../generated/contracts/validation.corpus-rules.malformed-finding-fails.contract.js";
import { registerMalformedFindingFails } from "./validation.corpus-rules.malformed-finding-fails.test.generated.js";
import { errorFindingFailsContract } from "../generated/contracts/validation.corpus-rules.error-finding-fails.contract.js";
import { registerErrorFindingFails } from "./validation.corpus-rules.error-finding-fails.test.generated.js";
import { copiesContainChangesContract } from "../generated/contracts/validation.corpus-rules.copies-contain-changes.contract.js";
import { registerCopiesContainChanges } from "./validation.corpus-rules.copies-contain-changes.test.generated.js";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";
import { specTest, testAnchorId, ref } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  CorpusRulesConditions,
  CorpusRulesOutcome,
} from "../generated/contracts/validation.corpus-rules.space.js";
import type {
  ArchitectureConstraintsConditions,
  ArchitectureConstraintsOutcome,
} from "../generated/contracts/validation.architecture-constraints.space.js";
import type {
  PlannedArchitectureConditions,
  PlannedArchitectureOutcome,
} from "../generated/contracts/model.planned-architecture.space.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const protocolSummary =
  "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)";
function probeRoot() {
  return mkdtempSync(join(tmpdir(), "sdp-bound-corpus-"));
}
function corpus(root: string) {
  for (const [name, relation] of [
    ["first", "{}"],
    ["second", "{refines: spec:probe.first}"],
  ])
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:probe.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${relation}\n---\n# Probe ${name}\n\n## Intent\n- outcome: Probe corpus rules.\n`,
    );
}
function component(id: string, layer?: string, context?: string, satisfies?: string) {
  return `/**\n * @sdpAnchor ${id}\n${layer === undefined ? "" : ` * @sdpLayer ${layer}\n`}${context === undefined ? "" : ` * @sdpContext ${context}\n`}${satisfies === undefined ? "" : ` * @sdpSatisfies ${satisfies}\n`} */\n`;
}
function member(id: string, componentId: string, uses?: string) {
  return `/**\n * @sdpAnchor ${id}\n * @sdpComponent ${componentId}\n${uses === undefined ? "" : ` * @sdpUses ${uses}\n`} */\n`;
}
interface Contract {
  readonly steps: readonly {
    readonly kind: string;
    readonly params: Readonly<Record<string, unknown>>;
  }[];
}
function assertThens(
  contract: Contract,
  actual: Readonly<Record<string, unknown>>,
  expected: Readonly<Record<string, unknown>>,
) {
  for (const step of contract.steps.filter((row) => row.kind === "then"))
    for (const [key, value] of Object.entries(step.params)) {
      expect(value).toEqual(expected[key]);
      expect(actual[key]).toEqual(expected[key]);
    }
}
interface CorpusWorld {
  readonly point: Partial<CorpusRulesConditions>;
  answer?: Record<string, unknown>;
  stderr?: string;
}
function corpusExpected(point: Partial<CorpusRulesConditions>): Record<string, unknown> {
  const first = point.first;
  const error = first === "returns one error finding";
  const warning = first === "returns one warning finding";
  const broken = first === "returns a finding with no subject";
  return {
    exitCode: error || broken ? 1 : 0,
    protocolSummary,
    corpusSummary: `corpus rules: ${error ? "1" : "0"} errors · ${warning ? "1" : "0"} warnings · ${broken ? "1" : "0"} of ${first === "empties the graph it receives" ? "2" : "1"} files failed (the corpus's own rules)`,
  };
}
const corpusAdapters = (contract: Contract) => ({
  createWorld: (point: Partial<CorpusRulesConditions>): CorpusWorld => ({ point }),
  async invoke(world: CorpusWorld) {
    const root = probeRoot();
    try {
      corpus(root);
      const file = join(root, "first.rules");
      const first = world.point.first;
      const row = {
        validatorId: "probe-rule",
        subjectId: "probe-subject",
        severity: first === "returns one error finding" ? "error" : "warning",
        message: "the probe rule reports its subject",
      };
      const body =
        first === "empties the graph it receives"
          ? "graph.nodes.length = 0; graph.edges.length = 0; return { findings: [] };"
          : `return { findings: [${JSON.stringify(first === "returns a finding with no subject" ? { validatorId: row.validatorId, severity: row.severity, message: row.message } : row)}] };`;
      writeFileSync(file, body);
      const args = ["validate", root, "--rules", file];
      if (first === "empties the graph it receives") {
        const second = join(root, "second.rules");
        writeFileSync(
          second,
          `return { findings: graph.nodes.length === 0 ? [${JSON.stringify(row)}] : [] };`,
        );
        args.push("--rules", second);
      }
      const capture = createCaptureOutput();
      const code = await runSdpCli(args, capture.output);
      const lines = capture.readStdout().trim().split("\n");
      world.answer = {
        exitCode: code,
        protocolSummary: lines.find((line) => line.startsWith("validate:")),
        corpusSummary: lines.at(-1),
      };
      world.stderr = capture.readStderr();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: CorpusWorld): CorpusRulesOutcome => ({
    kind: "the command exits {exitCode}",
    exitCode: Number(world.answer?.exitCode),
  }),
  expected: (point: Partial<CorpusRulesConditions>): CorpusRulesOutcome =>
    point.first === undefined
      ? unspecified
      : { kind: "the command exits {exitCode}", exitCode: Number(corpusExpected(point).exitCode) },
  assertions: (world: CorpusWorld) => {
    assertThens(contract, world.answer ?? {}, corpusExpected(world.point));
    if (world.point.first === "returns a finding with no subject")
      expect(world.stderr).toContain("finding 1 has no lawful subjectId");
  },
});
interface WalkWorld {
  readonly point: Partial<ArchitectureConstraintsConditions>;
  answer?: Record<string, unknown>;
}
function walkExpected(point: Partial<ArchitectureConstraintsConditions>) {
  const layer = point.fromLayer === "domain" && point.toLayer === "infrastructure";
  const isolation = point.fromContext === "platform" && point.toContext === "orders";
  return {
    findings: Number(layer) + Number(isolation),
    ruleIds: [layer ? "forbidden-layer" : "", isolation ? "isolated-context" : ""]
      .filter(Boolean)
      .join(", "),
    unclassified: point.toLayer === "unstated" ? 1 : 0,
    exitCode: point.invocation === "through sdp q" ? 0 : Number(layer || isolation),
  };
}
const walkAdapters = (contract: Contract) => ({
  createWorld: (point: Partial<ArchitectureConstraintsConditions>): WalkWorld => ({ point }),
  async invoke(world: WalkWorld) {
    const root = probeRoot();
    try {
      const p = world.point;
      writeFileSync(
        join(root, "anchors.ts"),
        component("component:probe.from", p.fromLayer, p.fromContext) +
          component(
            "component:probe.to",
            p.toLayer === "unstated" ? undefined : p.toLayer,
            p.toContext,
          ) +
          member("impl:probe.from", "component:probe.from", "impl:probe.to") +
          member("impl:probe.to", "component:probe.to"),
      );
      const file = join(repoRoot, "dist/recipes/42-the-architecture-walk.js");
      const params = JSON.stringify({
        forbidden: [{ from: "domain", to: "infrastructure" }],
        isolated: ["platform"],
      });
      const capture = createCaptureOutput();
      const args =
        p.invocation === "through sdp q"
          ? ["q", readFileSync(file, "utf8"), "--root", root, "--json", "--params", params]
          : ["validate", root, "--rules", file, "--params", params];
      const code = await runSdpCli(args, capture.output);
      if (p.invocation === "through sdp q") {
        const result = JSON.parse(capture.readStdout()) as {
          findings: { validatorId: string }[];
          unclassified: unknown[];
        };
        world.answer = {
          findings: result.findings.length,
          ruleIds: result.findings.map((row) => row.validatorId).join(", "),
          unclassified: result.unclassified.length,
          exitCode: code,
        };
      } else {
        const ids = [...capture.readStderr().matchAll(/^\[error\] ([a-z-]+) —/gmu)].map(
          (match) => match[1],
        );
        world.answer = { findings: ids.length, ruleIds: ids.join(", "), exitCode: code };
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: WalkWorld): ArchitectureConstraintsOutcome => ({
    kind: "the walk reports {findings} findings with the rule ids {ruleIds}",
    findings: Number(world.answer?.findings),
    ruleIds: String(world.answer?.ruleIds),
  }),
  expected: (
    point: Partial<ArchitectureConstraintsConditions>,
  ): ArchitectureConstraintsOutcome => ({
    kind: "the walk reports {findings} findings with the rule ids {ruleIds}",
    findings: walkExpected(point).findings,
    ruleIds: walkExpected(point).ruleIds,
  }),
  assertions: (world: WalkWorld) => {
    assertThens(contract, world.answer ?? {}, walkExpected(world.point));
  },
});
interface PlanWorld {
  readonly point: Partial<PlannedArchitectureConditions>;
  answer?: Record<string, unknown>;
}
function planExpected(point: Partial<PlannedArchitectureConditions>) {
  const absent = point.anchor === "is absent";
  const fields = absent
    ? []
    : [
        point.plannedLayer !== point.realizedLayer ? "layer" : "",
        point.plannedUses !== point.realizedUses ? "uses" : "",
      ].filter(Boolean);
  return {
    unrealized: absent ? 1 : 0,
    matching: !absent && fields.length === 0 ? 1 : 0,
    differing: fields.length,
    fields: fields.join(", "),
  };
}
const planAdapters = (contract: Contract) => ({
  createWorld: (point: Partial<PlannedArchitectureConditions>): PlanWorld => ({ point }),
  async invoke(world: PlanWorld) {
    const root = probeRoot();
    try {
      const p = world.point;
      writeFileSync(
        join(root, "design.sdp.md"),
        `---\nid: spec:probe.design\nkind: model\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Planned probe\n\n## Intent\n- outcome: Probe planned components.\n\n## Model\n- **probe** — A component design.\n\n## Design\n- id: ${p.componentId ?? ""}\n- layer: ${p.plannedLayer ?? ""}\n- uses: ${p.plannedUses ?? ""}\n`,
      );
      let anchors =
        component("component:probe.kernel") +
        member("impl:probe.kernel", "component:probe.kernel") +
        component("component:probe.audit") +
        member("impl:probe.audit", "component:probe.audit");
      if (p.anchor === "satisfies the design")
        anchors +=
          component(p.componentId ?? "", p.realizedLayer, undefined, "spec:probe.design") +
          member(
            "impl:probe.history",
            p.componentId ?? "",
            (p.realizedUses ?? "").replace("component:", "impl:"),
          );
      writeFileSync(join(root, "anchors.ts"), anchors);
      const capture = createCaptureOutput();
      expect(
        await runSdpCli(
          [
            "q",
            readFileSync(
              join(repoRoot, "dist/recipes/43-planned-against-realized-components.js"),
              "utf8",
            ),
            "--root",
            root,
            "--json",
          ],
          capture.output,
        ),
      ).toBe(0);
      const result = JSON.parse(capture.readStdout()) as {
        totals: Record<string, unknown>;
        differing: { field: string }[];
      };
      world.answer = {
        ...result.totals,
        fields: result.differing.map((row) => row.field).join(", "),
      };
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: PlanWorld): PlannedArchitectureOutcome => ({
    kind: "the differing fields are {fields}",
    fields: String(world.answer?.fields),
  }),
  expected: (point: Partial<PlannedArchitectureConditions>): PlannedArchitectureOutcome => ({
    kind: "the differing fields are {fields}",
    fields: planExpected(point).fields,
  }),
  assertions: (world: PlanWorld) => {
    assertThens(contract, world.answer ?? {}, planExpected(world.point));
  },
});

const copiesContainChangesAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.copies-contain-changes"),
  verifies: ref("spec:validation.corpus-rules.copies-contain-changes"),
});
void copiesContainChangesAnchor;
registerCopiesContainChanges(corpusAdapters(copiesContainChangesContract));

const errorFindingFailsAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.error-finding-fails"),
  verifies: ref("spec:validation.corpus-rules.error-finding-fails"),
});
void errorFindingFailsAnchor;
registerErrorFindingFails(corpusAdapters(errorFindingFailsContract));

const malformedFindingFailsAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.malformed-finding-fails"),
  verifies: ref("spec:validation.corpus-rules.malformed-finding-fails"),
});
void malformedFindingFailsAnchor;
registerMalformedFindingFails(corpusAdapters(malformedFindingFailsContract));

const warningFindingInformsAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.warning-finding-informs"),
  verifies: ref("spec:validation.corpus-rules.warning-finding-informs"),
});
void warningFindingInformsAnchor;
registerWarningFindingInforms(corpusAdapters(warningFindingInformsContract));

const forbiddenLayerPairAnchor = specTest({
  id: testAnchorId("test:protocol.validation.architecture-constraints.forbidden-layer-pair"),
  verifies: ref("spec:validation.architecture-constraints.forbidden-layer-pair"),
});
void forbiddenLayerPairAnchor;
registerForbiddenLayerPair(walkAdapters(forbiddenLayerPairContract));

const isolatedContextAsRuleAnchor = specTest({
  id: testAnchorId("test:protocol.validation.architecture-constraints.isolated-context-as-rule"),
  verifies: ref("spec:validation.architecture-constraints.isolated-context-as-rule"),
});
void isolatedContextAsRuleAnchor;
registerIsolatedContextAsRule(walkAdapters(isolatedContextAsRuleContract));

const unstatedLayerUnclassifiedAnchor = specTest({
  id: testAnchorId("test:protocol.validation.architecture-constraints.unstated-layer-unclassified"),
  verifies: ref("spec:validation.architecture-constraints.unstated-layer-unclassified"),
});
void unstatedLayerUnclassifiedAnchor;
registerUnstatedLayerUnclassified(walkAdapters(unstatedLayerUnclassifiedContract));

const differingLayerAndUsesAnchor = specTest({
  id: testAnchorId("test:protocol.model.planned-architecture.differing-layer-and-uses"),
  verifies: ref("spec:model.planned-architecture.differing-layer-and-uses"),
});
void differingLayerAndUsesAnchor;
registerDifferingLayerAndUses(planAdapters(differingLayerAndUsesContract));

const matchingDesignAnchor = specTest({
  id: testAnchorId("test:protocol.model.planned-architecture.matching-design"),
  verifies: ref("spec:model.planned-architecture.matching-design"),
});
void matchingDesignAnchor;
registerMatchingDesign(planAdapters(matchingDesignContract));

const unrealizedDesignAnchor = specTest({
  id: testAnchorId("test:protocol.model.planned-architecture.unrealized-design"),
  verifies: ref("spec:model.planned-architecture.unrealized-design"),
});
void unrealizedDesignAnchor;
registerUnrealizedDesign(planAdapters(unrealizedDesignContract));

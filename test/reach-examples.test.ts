import {
  specTest,
  testAnchorId,
  ref,
  specOracle,
  oracleAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { recipeCallContract } from "../generated/contracts/consumers.agent-surface.evaluation-sink.recipe-call.contract.js";
import { registerRecipeCall } from "./consumers.agent-surface.evaluation-sink.recipe-call.test.generated.js";
import { unknownRecipeContract } from "../generated/contracts/consumers.agent-surface.evaluation-sink.unknown-recipe.contract.js";
import { registerUnknownRecipe } from "./consumers.agent-surface.evaluation-sink.unknown-recipe.test.generated.js";
import { exportedEvaluatorContract } from "../generated/contracts/consumers.agent-surface.evaluation-sink.exported-evaluator.contract.js";
import { registerExportedEvaluator } from "./consumers.agent-surface.evaluation-sink.exported-evaluator.test.generated.js";
import { chainReportsNothingContract } from "../generated/contracts/consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing.contract.js";
import { registerChainReportsNothing } from "./consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing.test.generated.js";
import { cycleFailsARulesRunContract } from "../generated/contracts/consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run.contract.js";
import { registerCycleFailsARulesRun } from "./consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run.test.generated.js";
import { unresolvedAddressFailsARulesRunContract } from "../generated/contracts/consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run.contract.js";
import { registerUnresolvedAddressFailsARulesRun } from "./consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run.test.generated.js";
import { rulesEditStartsACycleContract } from "../generated/contracts/validation.corpus-rules.rules-edit-starts-a-cycle.contract.js";
import { registerRulesEditStartsACycle } from "./validation.corpus-rules.rules-edit-starts-a-cycle.test.generated.js";
import { paramsEditStartsACycleContract } from "../generated/contracts/validation.corpus-rules.params-edit-starts-a-cycle.contract.js";
import { registerParamsEditStartsACycle } from "./validation.corpus-rules.params-edit-starts-a-cycle.test.generated.js";
import { unreadableParamsFailOneFileContract } from "../generated/contracts/validation.corpus-rules.unreadable-params-fail-one-file.contract.js";
import { registerUnreadableParamsFailOneFile } from "./validation.corpus-rules.unreadable-params-fail-one-file.test.generated.js";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { expect } from "vitest";
import { evaluateBody, extract } from "../src/index.js";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  EvaluationSinkConditions,
  EvaluationSinkOutcome,
} from "../generated/contracts/consumers.agent-surface.evaluation-sink.space.js";
import type {
  AddressAndCycleRecipesConditions,
  AddressAndCycleRecipesOutcome,
} from "../generated/contracts/consumers.agent-surface.address-and-cycle-recipes.space.js";
import type {
  CorpusRulesConditions,
  CorpusRulesOutcome,
} from "../generated/contracts/validation.corpus-rules.space.js";
import type { ValidateWatchEvent } from "../src/cli/validate-watch.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
function probe(root: string, cycle: boolean) {
  for (const name of ["one", "two"]) {
    const other = name === "one" ? "two" : "one";
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:probe.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${name === "one" || cycle ? `{dependsOn: spec:probe.${other}}` : "{}"}\n---\n# ${name}\n\n## Intent\n- outcome: Probe recipes.\n`,
    );
  }
}
interface Contract {
  readonly steps: readonly {
    readonly kind: string;
    readonly params: Readonly<Record<string, unknown>>;
  }[];
}
function assertThens(
  contract: Contract,
  answer: Record<string, unknown>,
  expected: Record<string, unknown>,
) {
  for (const step of contract.steps.filter((step) => step.kind === "then")) {
    for (const [key, value] of Object.entries(step.params)) {
      expect(value).toEqual(expected[key]);
      expect(answer[key]).toEqual(expected[key]);
    }
  }
}
interface World<P> {
  readonly point: Partial<P>;
  answer: Record<string, unknown>;
}
const world = <P>(point: Partial<P>): World<P> => ({ point, answer: {} });
function sinkExpected(point: Partial<EvaluationSinkConditions>) {
  return point.call === "a recipe number the catalog does not hold"
    ? { outcome: "rejects", rejection: "recipes: the catalog holds no recipe 99" }
    : { outcome: "resolves", sameAnswer: true };
}
const evaluationsinkOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.consumers.agent-surface.evaluation-sink"),
  models: ref("spec:consumers.agent-surface.evaluation-sink"),
});
void evaluationsinkOracleAnchor;
function sinkOracle(point: Partial<EvaluationSinkConditions>): EvaluationSinkOutcome {
  return point.call === undefined
    ? unspecified
    : {
        kind: "the call {outcome}",
        outcome:
          point.call === "a recipe number the catalog does not hold" ? "rejects" : "resolves",
      };
}
const sinkAdapters = (contract: Contract) => ({
  createWorld: world<EvaluationSinkConditions>,
  async invoke(world: World<EvaluationSinkConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-sink-example-"));
    try {
      probe(root, true);
      const warning = world.point.call === "recipe 26 with the severity warning";
      const unknown = world.point.call === "a recipe number the catalog does not hold";
      const body = unknown
        ? "return recipes(99);"
        : warning
          ? 'return recipes(26, {severity: "warning"});'
          : "return recipes(26);";
      const shipped = readFileSync(join(repoRoot, "dist/recipes/26-dependency-cycles.js"), "utf8");
      if (world.point.entrance === "through the exported evaluator over a graph derived once") {
        const { graph } = extract({ root });
        const actual = await evaluateBody(body, { graph });
        const direct = await evaluateBody(shipped, { graph, params: { severity: "warning" } });
        world.answer = { outcome: "resolves", sameAnswer: isDeepStrictEqual(actual, direct) };
        expect(actual).toMatchObject({ findings: [{ severity: "warning" }] });
      } else {
        const capture = createCaptureOutput();
        const exit = await runSdpCli(["q", body, "--root", root, "--json"], capture.output);
        if (unknown) {
          expect(exit).toBe(1);
          expect(capture.readStdout()).toBe("");
          world.answer = {
            outcome: "rejects",
            rejection: capture
              .readStderr()
              .trim()
              .replace(/^sdp q: /u, ""),
          };
        } else {
          expect(exit).toBe(0);
          const direct = createCaptureOutput();
          expect(await runSdpCli(["q", shipped, "--root", root, "--json"], direct.output)).toBe(0);
          world.answer = {
            outcome: "resolves",
            sameAnswer: isDeepStrictEqual(
              JSON.parse(capture.readStdout()),
              JSON.parse(direct.readStdout()),
            ),
          };
        }
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: World<EvaluationSinkConditions>): EvaluationSinkOutcome => ({
    kind: "the call {outcome}",
    outcome: world.answer.outcome === "resolves" ? "resolves" : "rejects",
  }),
  expected: sinkOracle,
  assertions: (world: World<EvaluationSinkConditions>) => {
    assertThens(contract, world.answer, sinkExpected(world.point));
  },
});
function addressExpected(point: Partial<AddressAndCycleRecipesConditions>) {
  const cycle = point.corpus === "two Specs depend on each other through dependsOn";
  const address = point.recipe === "address resolution";
  return {
    exitCode: point.invocation === "through sdp q" ? 0 : 1,
    findings: cycle || address ? 1 : 0,
    ruleIds: cycle ? "dependency-cycle" : address ? "unresolved-address" : "",
  };
}
const addressandcyclerecipesOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.consumers.agent-surface.address-and-cycle-recipes"),
  models: ref("spec:consumers.agent-surface.address-and-cycle-recipes"),
});
void addressandcyclerecipesOracleAnchor;
function addressOracle(
  point: Partial<AddressAndCycleRecipesConditions>,
): AddressAndCycleRecipesOutcome {
  return {
    kind: "the answer carries {findings} findings with the rule ids {ruleIds}",
    findings: addressExpected(point).findings,
    ruleIds: addressExpected(point).ruleIds,
  };
}
const addressAdapters = (contract: Contract) => ({
  createWorld: world<AddressAndCycleRecipesConditions>,
  async invoke(world: World<AddressAndCycleRecipesConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-address-example-"));
    try {
      probe(root, world.point.corpus === "two Specs depend on each other through dependsOn");
      const file = join(
        repoRoot,
        world.point.recipe === "address resolution"
          ? "dist/recipes/25-address-resolution.js"
          : "dist/recipes/26-dependency-cycles.js",
      );
      const args =
        world.point.invocation === "through sdp q"
          ? ["q", readFileSync(file, "utf8"), "--root", root, "--json"]
          : ["validate", root, "--rules", file];
      if (world.point.addresses !== "none")
        args.push("--params", JSON.stringify({ addresses: [world.point.addresses] }));
      const capture = createCaptureOutput();
      const exitCode = await runSdpCli(args, capture.output);
      if (world.point.invocation === "through sdp q") {
        const answer = JSON.parse(capture.readStdout()) as { findings: { validatorId: string }[] };
        expect(Object.keys(answer).sort()).toEqual(["cycles", "findings", "totals"]);
        world.answer = {
          exitCode,
          findings: answer.findings.length,
          ruleIds: answer.findings.map((f) => f.validatorId).join(", "),
        };
      } else {
        const ids = [
          ...capture.readStderr().matchAll(/\[error\] (unresolved-address|dependency-cycle) —/gu),
        ].map((match) => match[1]);
        expect(capture.readStdout()).toContain("0 of 1 files failed");
        world.answer = { exitCode, findings: ids.length, ruleIds: ids.join(", ") };
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: World<AddressAndCycleRecipesConditions>): AddressAndCycleRecipesOutcome => ({
    kind: "the answer carries {findings} findings with the rule ids {ruleIds}",
    findings: Number(world.answer.findings),
    ruleIds: String(world.answer.ruleIds),
  }),
  expected: addressOracle,
  assertions: (world: World<AddressAndCycleRecipesConditions>) => {
    assertThens(contract, world.answer, addressExpected(world.point));
  },
});
const watchedParametersOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.corpus-rules-watch"),
  models: ref("spec:validation.corpus-rules"),
});
void watchedParametersOracleAnchor;
function watchExpected(point: Partial<CorpusRulesConditions>) {
  const first = point.first ?? "";
  const counts = first.startsWith("is rewritten")
    ? "1 errors · 0 warnings · 0"
    : first.includes("gains a key")
      ? "0 errors · 2 warnings · 0"
      : "0 errors · 0 warnings · 1";
  return {
    corpusSummary: `corpus rules: ${counts} of 2 files failed (the corpus's own rules)`,
    running: true,
  };
}
const watchAdapters = (contract: Contract) => ({
  createWorld: world<CorpusRulesConditions>,
  async invoke(world: World<CorpusRulesConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-watch-example-"));
    const outside = mkdtempSync(join(tmpdir(), "sdp-watch-params-"));
    const abort = new AbortController();
    const timer = setTimeout(() => {
      abort.abort();
    }, 1000);
    try {
      probe(root, false);
      const file = join(root, "node_modules/probe/policy.js");
      mkdirSync(dirname(file), { recursive: true });
      const params = join(outside, "params.json");
      writeFileSync(params, '{"one":1}');
      const row = '{validatorId:"probe",subjectId:"probe",severity:"warning",message:"probe"}';
      const rulesEdit = world.point.first?.startsWith("is rewritten");
      writeFileSync(
        file,
        rulesEdit
          ? `return {findings:[${row}]};`
          : `return {findings:Object.keys(params).map(()=>(${row}))};`,
      );
      const second = join(root, "second.rules");
      writeFileSync(second, `return {findings:graph.nodes.length === 0 ? [${row}] : []};`);
      const args = ["validate", root, "--watch", "--rules", file];
      if (!rulesEdit) args.push("--params", `@${params}`);
      args.push("--rules", second);
      const capture = createCaptureOutput();
      let emit: ((event: ValidateWatchEvent) => void) | undefined;
      let cycles = 0;
      await runSdpCli(args, capture.output, {
        abortSignal: abort.signal,
        createWatchSource: () => ({
          on(listener) {
            emit = listener;
          },
          onError() {
            return undefined;
          },
          close() {
            return undefined;
          },
        }),
        onWatchCycleComplete(cycle) {
          cycles = cycle.index;
          if (cycle.index === 1) {
            if (rulesEdit) writeFileSync(file, `return {findings:[{...${row},severity:"error"}]};`);
            else
              writeFileSync(
                params,
                world.point.first?.includes("gains a key") ? '{"one":1,"two":2}' : "invalid",
              );
            emit?.({ type: "change", path: rulesEdit ? file : params });
          } else {
            world.answer = {
              corpusSummary: capture.readStdout().trim().split("\n").at(-1),
              running: !abort.signal.aborted,
            };
            abort.abort();
          }
        },
      });
      expect(cycles).toBe(2);
      if (world.point.first?.includes("stops being JSON"))
        expect(capture.readStderr()).toContain("failed: its parameters cannot be read (");
    } finally {
      clearTimeout(timer);
      abort.abort();
      rmSync(root, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  },
  observe: (world: World<CorpusRulesConditions>): CorpusRulesOutcome => ({
    kind: "the second cycle's corpus summary line reads {corpusSummary}",
    corpusSummary: String(world.answer.corpusSummary),
  }),
  expected: (point: Partial<CorpusRulesConditions>): CorpusRulesOutcome => ({
    kind: "the second cycle's corpus summary line reads {corpusSummary}",
    corpusSummary: watchExpected(point).corpusSummary,
  }),
  assertions: (world: World<CorpusRulesConditions>) => {
    assertThens(contract, world.answer, watchExpected(world.point));
  },
});
const recipeCallAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.agent-surface.evaluation-sink.recipe-call"),
  verifies: ref("spec:consumers.agent-surface.evaluation-sink.recipe-call"),
});
void recipeCallAnchor;
registerRecipeCall(sinkAdapters(recipeCallContract));
const unknownRecipeAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.agent-surface.evaluation-sink.unknown-recipe"),
  verifies: ref("spec:consumers.agent-surface.evaluation-sink.unknown-recipe"),
});
void unknownRecipeAnchor;
registerUnknownRecipe(sinkAdapters(unknownRecipeContract));
const exportedEvaluatorAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.agent-surface.evaluation-sink.exported-evaluator"),
  verifies: ref("spec:consumers.agent-surface.evaluation-sink.exported-evaluator"),
});
void exportedEvaluatorAnchor;
registerExportedEvaluator(sinkAdapters(exportedEvaluatorContract));
const chainReportsNothingAnchor = specTest({
  id: testAnchorId(
    "test:protocol.consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing",
  ),
  verifies: ref("spec:consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing"),
});
void chainReportsNothingAnchor;
registerChainReportsNothing(addressAdapters(chainReportsNothingContract));
const cycleFailsARulesRunAnchor = specTest({
  id: testAnchorId(
    "test:protocol.consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run",
  ),
  verifies: ref("spec:consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run"),
});
void cycleFailsARulesRunAnchor;
registerCycleFailsARulesRun(addressAdapters(cycleFailsARulesRunContract));
const unresolvedAddressFailsARulesRunAnchor = specTest({
  id: testAnchorId(
    "test:protocol.consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run",
  ),
  verifies: ref(
    "spec:consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run",
  ),
});
void unresolvedAddressFailsARulesRunAnchor;
registerUnresolvedAddressFailsARulesRun(addressAdapters(unresolvedAddressFailsARulesRunContract));
const rulesEditStartsACycleAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.rules-edit-starts-a-cycle"),
  verifies: ref("spec:validation.corpus-rules.rules-edit-starts-a-cycle"),
});
void rulesEditStartsACycleAnchor;
registerRulesEditStartsACycle(watchAdapters(rulesEditStartsACycleContract));
const paramsEditStartsACycleAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.params-edit-starts-a-cycle"),
  verifies: ref("spec:validation.corpus-rules.params-edit-starts-a-cycle"),
});
void paramsEditStartsACycleAnchor;
registerParamsEditStartsACycle(watchAdapters(paramsEditStartsACycleContract));
const unreadableParamsFailOneFileAnchor = specTest({
  id: testAnchorId("test:protocol.validation.corpus-rules.unreadable-params-fail-one-file"),
  verifies: ref("spec:validation.corpus-rules.unreadable-params-fail-one-file"),
});
void unreadableParamsFailOneFileAnchor;
registerUnreadableParamsFailOneFile(watchAdapters(unreadableParamsFailOneFileContract));

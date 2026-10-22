import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  ExternalRegistersConditions,
  ExternalRegistersOutcome,
} from "../generated/contracts/validation.external-registers.space.js";
import { unknownAndRetiredContract } from "../generated/contracts/validation.external-registers.unknown-and-retired.contract.js";
import { uncitedOnRequestContract } from "../generated/contracts/validation.external-registers.uncited-on-request.contract.js";
import { registerUnknownAndRetired } from "./validation.external-registers.unknown-and-retired.test.generated.js";
import { registerUncitedOnRequest } from "./validation.external-registers.uncited-on-request.test.generated.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { writeProbeCorpus } from "./helpers/probe-corpus.js";

interface World {
  point: Partial<ExternalRegistersConditions>;
  answer?: { exitCode: number; ruleIds: string };
}
const oracle = specOracle({
  id: oracleAnchorId("oracle:protocol.external-registers"),
  models: ref("spec:validation.external-registers"),
});
void oracle;

function answer(point: Partial<ExternalRegistersConditions>) {
  if (
    point.cited === undefined ||
    point.held === undefined ||
    point.retired === undefined ||
    point.uncited === undefined
  )
    return undefined;
  const cited = point.cited.split(" ").filter(Boolean);
  const held = point.held.split(" ").filter(Boolean);
  const retired = point.retired.split(" ").filter(Boolean);
  const rules = [...new Set(cited)]
    .sort()
    .flatMap((token) =>
      retired.includes(token) ? ["retired-token"] : held.includes(token) ? [] : ["unknown-token"],
    );
  if (point.uncited)
    rules.push(...held.filter((token) => !cited.includes(token)).map(() => "uncited-token"));
  return { exitCode: Number(rules.length > 0), ruleIds: rules.join(", ") };
}
type Contract = typeof unknownAndRetiredContract | typeof uncitedOnRequestContract;
const adapters = (contract: Contract) => ({
  createWorld: (point: Partial<ExternalRegistersConditions>): World => ({ point }),
  async invoke(world: World) {
    const root = mkdtempSync(join(tmpdir(), "sdp-register-example-"));
    try {
      writeProbeCorpus(root);
      writeFileSync(
        join(root, "first.sdp.md"),
        `---\nid: spec:probe.first\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe first\n\n## Intent\n- outcome: Cite ${world.point.cited ?? ""}.\n`,
      );
      const register = join(root, "register.json");
      writeFileSync(
        register,
        JSON.stringify({
          tokens: [
            ...(world.point.held ?? "").split(" ").filter(Boolean),
            ...(world.point.retired ?? "")
              .split(" ")
              .filter(Boolean)
              .map((token) => ({ token, retired: true })),
          ],
        }),
      );
      const capture = createCaptureOutput();
      const exitCode = await runSdpCli(
        [
          "validate",
          root,
          "--rules",
          resolve("dist/recipes/50-external-registers.js"),
          "--params",
          `register=@${register}`,
          "--params",
          JSON.stringify({ pattern: "\\bE-\\d+\\b", uncited: world.point.uncited }),
        ],
        capture.output,
      );
      expect(capture.readStdout()).toContain("validate: 0 errors · 0 warnings");
      world.answer = {
        exitCode,
        ruleIds: [...capture.readStderr().matchAll(/(?:^| — )\[error\] ([a-z-]+) —/gmu)]
          .map((match) => match[1])
          .join(", "),
      };
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (world: World): ExternalRegistersOutcome => ({
    kind: "the corpus findings carry the rule ids {ruleIds}",
    ruleIds: world.answer?.ruleIds ?? "",
  }),
  expected: (point: Partial<ExternalRegistersConditions>): ExternalRegistersOutcome => {
    const expected = answer(point);
    return expected === undefined
      ? unspecified
      : { kind: "the corpus findings carry the rule ids {ruleIds}", ruleIds: expected.ruleIds };
  },
  assertions(world: World) {
    expect(world.answer).toEqual(answer(world.point));
    for (const step of contract.steps.filter((step) => step.kind === "then")) {
      for (const [key, value] of Object.entries(step.params))
        expect(value).toEqual(answer(world.point)?.[key as "exitCode" | "ruleIds"]);
    }
  },
});
const unknownAndRetiredAnchor = specTest({
  id: testAnchorId("test:protocol.external-registers.unknown-and-retired"),
  verifies: ref("spec:validation.external-registers.unknown-and-retired"),
});
void unknownAndRetiredAnchor;
registerUnknownAndRetired(adapters(unknownAndRetiredContract));
const uncitedOnRequestAnchor = specTest({
  id: testAnchorId("test:protocol.external-registers.uncited-on-request"),
  verifies: ref("spec:validation.external-registers.uncited-on-request"),
});
void uncitedOnRequestAnchor;
registerUncitedOnRequest(adapters(uncitedOnRequestContract));

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
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
  CommandLineConditions,
  CommandLineOutcome,
} from "../generated/contracts/consumers.command-line.space.js";
import { generateWritesEveryRootContract } from "../generated/contracts/consumers.command-line.generate-writes-every-root.contract.js";
import { generateCheckFailureContract } from "../generated/contracts/consumers.command-line.generate-check-failure.contract.js";
import { verbHelpTouchesNothingContract } from "../generated/contracts/consumers.command-line.verb-help-touches-nothing.contract.js";
import { registerGenerateWritesEveryRoot } from "./consumers.command-line.generate-writes-every-root.test.generated.js";
import { registerGenerateCheckFailure } from "./consumers.command-line.generate-check-failure.test.generated.js";
import { registerVerbHelpTouchesNothing } from "./consumers.command-line.verb-help-touches-nothing.test.generated.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { writeProbeCorpus } from "./helpers/probe-corpus.js";

const hooks = {
  studioAssets: {
    script: resolve("dist/studio/studio.js"),
    stylesheet: resolve("dist/studio/studio.css"),
  },
};
const roots = ["design-review", "census", "mermaid", "gherkin", "spec-studio"] as const;
const verbs = ["view", "census", "mermaid", "gherkin", "studio"] as const;

function files(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!existsSync(root)) return result;
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else result[relative(root, path)] = readFileSync(path, "utf8");
    }
  };
  visit(root);
  return result;
}
interface Answer {
  exitCode: number;
  staleSurvive: boolean;
  currentRoots: string;
  absentRoots: string;
  firstLine: string;
}
interface World {
  point: Partial<CommandLineConditions>;
  answer?: Answer;
}
const oracle = specOracle({
  id: oracleAnchorId("oracle:protocol.command-line"),
  models: ref("spec:consumers.command-line"),
});
void oracle;

function answer(point: Partial<CommandLineConditions>): Answer | undefined {
  if (point.command === undefined || point.roots === undefined) return undefined;
  const help = point.command === "sdp view --help";
  const check = point.command === "sdp generate --check-clean";
  return {
    exitCode: Number(check),
    staleSurvive: help,
    currentRoots: help ? "" : roots.filter((root) => !check || root !== "census").join(", "),
    absentRoots: check ? "census" : "",
    firstLine: help ? "Usage:" : "",
  };
}
type Contract =
  | typeof generateWritesEveryRootContract
  | typeof generateCheckFailureContract
  | typeof verbHelpTouchesNothingContract;
const adapters = (contract: Contract) => ({
  createWorld: (point: Partial<CommandLineConditions>): World => ({ point }),
  async invoke(world: World) {
    const root = mkdtempSync(join(tmpdir(), "sdp-command-example-"));
    const comparison = mkdtempSync(join(tmpdir(), "sdp-command-publishers-"));
    try {
      writeProbeCorpus(root);
      cpSync(join(root, "first.sdp.md"), join(comparison, "first.sdp.md"));
      cpSync(join(root, "second.sdp.md"), join(comparison, "second.sdp.md"));
      const check = world.point.roots?.startsWith("five current") === true;
      if (check) {
        const setup = createCaptureOutput();
        expect(await runSdpCli(["generate", root], setup.output, hooks), setup.readStderr()).toBe(
          0,
        );
      }
      for (const name of check ? ["census"] : roots) {
        mkdirSync(join(root, "generated", name), { recursive: true });
        writeFileSync(join(root, "generated", name, "stale.txt"), "stale");
      }
      const capture = createCaptureOutput();
      const command = world.point.command ?? "";
      const args =
        command === "sdp view --help"
          ? ["view", root, "--help"]
          : ["generate", root, ...(check ? ["--check-clean"] : [])];
      const exitCode = await runSdpCli(args, capture.output, hooks);
      const current: string[] = [];
      const absent: string[] = [];
      const help = command === "sdp view --help";
      for (const [index, name] of roots.entries()) {
        const path = join(root, "generated", name);
        if (!existsSync(path)) {
          absent.push(name);
          continue;
        }
        if (!help) {
          const verb = verbs[index];
          if (verb === undefined) throw new Error("Each root needs its publisher.");
          const published = createCaptureOutput();
          expect(
            await runSdpCli([verb, comparison], published.output, hooks),
            published.readStderr(),
          ).toBe(0);
          expect(files(path)).toEqual(files(join(comparison, "generated", name)));
          current.push(name);
        }
      }
      world.answer = {
        exitCode,
        staleSurvive: help
          ? roots.every((name) => existsSync(join(root, "generated", name, "stale.txt")))
          : roots.some((name) => existsSync(join(root, "generated", name, "stale.txt"))),
        currentRoots: current.join(", "),
        absentRoots: absent.join(", "),
        firstLine: help ? (capture.readStdout().split("\n")[0] ?? "") : "",
      };
      if (help) expect(capture.readStdout()).toContain("sdp view [root]");
      if (!help) expect(capture.readStdout().match(/^validate:/gmu)).toHaveLength(1);
      if (check) expect(capture.readStderr()).toContain("generated census differs");
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(comparison, { recursive: true, force: true });
    }
  },
  observe: (world: World): CommandLineOutcome => ({
    kind: "the command exits {exitCode}",
    exitCode: world.answer?.exitCode ?? -1,
  }),
  expected: (point: Partial<CommandLineConditions>): CommandLineOutcome => {
    const expected = answer(point);
    return expected === undefined
      ? unspecified
      : { kind: "the command exits {exitCode}", exitCode: expected.exitCode };
  },
  assertions(world: World) {
    expect(world.answer).toEqual(answer(world.point));
    for (const step of contract.steps.filter((step) => step.kind === "then")) {
      for (const [key, value] of Object.entries(step.params))
        expect(value).toEqual(answer(world.point)?.[key as keyof Answer]);
    }
  },
});
const generateWritesEveryRootAnchor = specTest({
  id: testAnchorId("test:protocol.command-line.generate-writes-every-root"),
  verifies: ref("spec:consumers.command-line.generate-writes-every-root"),
});
void generateWritesEveryRootAnchor;
registerGenerateWritesEveryRoot(adapters(generateWritesEveryRootContract));
const generateCheckFailureAnchor = specTest({
  id: testAnchorId("test:protocol.command-line.generate-check-failure"),
  verifies: ref("spec:consumers.command-line.generate-check-failure"),
});
void generateCheckFailureAnchor;
registerGenerateCheckFailure(adapters(generateCheckFailureContract));
const verbHelpTouchesNothingAnchor = specTest({
  id: testAnchorId("test:protocol.command-line.verb-help-touches-nothing"),
  verifies: ref("spec:consumers.command-line.verb-help-touches-nothing"),
});
void verbHelpTouchesNothingAnchor;
registerVerbHelpTouchesNothing(adapters(verbHelpTouchesNothingContract));

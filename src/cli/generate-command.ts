import type { GraphSchema } from "../graph/schema.js";
import type { BuildArgs } from "./build-args.js";
import { prepareCensusPublication } from "./census-command.js";
import type { CensusHooks } from "./census-command.js";
import { prepareGherkinPublication } from "./gherkin-command.js";
import type { GherkinViewHooks } from "./gherkin-command.js";
import { prepareMermaidPublication } from "./mermaid-command.js";
import type { MermaidHooks } from "./mermaid-command.js";
import { errorMessage, writeStderr } from "./output.js";
import type { CliOutput } from "./output.js";
import { prepareStudioPublication } from "./studio-command.js";
import type { StudioHooks } from "./studio-command.js";
import { publishDesignReview, runValidate } from "./validate-view-command.js";

export interface GenerateHooks extends CensusHooks, GherkinViewHooks, MermaidHooks, StudioHooks {
  readonly synchronizeVaultBeforeGenerate?: typeof synchronizeVaultBeforeGenerate;
}

/**
 * Lane V fills this seam with the vault publisher's directory checks and synchronization.
 * Until that publisher exists, generate parses --vault and leaves the vault untouched.
 */
export function synchronizeVaultBeforeGenerate(
  parsed: BuildArgs,
  graph: GraphSchema,
  output: CliOutput,
): number {
  void [parsed, graph, output];
  return 0;
}

/**
 * @sdpAnchor impl:protocol.generate-command
 * @sdpLabel prepares all prior roots before one shared build and publishes with each verb's checks
 * @sdpReferences spec:consumers.command-line
 * @sdpComponent component:protocol.cli
 * @sdpRole publisher
 */
export async function runGenerate(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: GenerateHooks = {},
): Promise<number> {
  // Preparation captures every prior tree before runBuild invalidates the five roots.
  const publishers = [
    (validated: Parameters<typeof publishDesignReview>[0]) =>
      publishDesignReview(validated, parsed, output, hooks, "generate"),
    prepareCensusPublication(parsed, output, hooks, "generate"),
    prepareMermaidPublication(parsed, output, hooks, "generate"),
    prepareGherkinPublication(parsed, output, hooks, "generate"),
    prepareStudioPublication(parsed, output, hooks, "generate"),
  ];
  const validated = runValidate(parsed, output, "generate", hooks);
  if (validated.graph === undefined) return 1;

  if (!parsed.checkClean) {
    try {
      const synchronize = hooks.synchronizeVaultBeforeGenerate ?? synchronizeVaultBeforeGenerate;
      if (synchronize(parsed, validated.graph, output) !== 0) return 1;
    } catch (error) {
      writeStderr(output, `sdp generate: ${errorMessage(error)}\n`);
      return 1;
    }
  }

  let exitCode = validated.exitCode;
  for (const publish of publishers) {
    if (publish === undefined || (await publish(validated)) !== 0) exitCode = 1;
  }
  return exitCode;
}

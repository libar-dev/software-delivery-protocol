import { runValidateWatch } from "./validate-watch.js";
import type { ValidateWatchHooks } from "./validate-watch.js";
import { checkStudioInputPlacement, readStudioBase } from "./studio-inputs.js";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { createStudioData } from "../projections/studio/data.js";
import { renderStudio } from "../projections/studio/pages/index.js";
import {
  publishStudio,
  readPublishedStudio,
  studioFiles,
  studioFilesEqual,
} from "../projections/studio/publish.js";
import type { StudioAssets, StudioFile } from "../projections/studio/publish.js";
import { createReader } from "../reader/reader.js";
import { removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ProtocolValidationOutcome, ValidationViewHooks } from "./validate-view-command.js";

export type { StudioAssets } from "../projections/studio/publish.js";

export interface StudioHooks extends ValidationViewHooks {
  readonly studioAssets?: StudioAssets;
  readonly renderStudio?: typeof renderStudio;
}

export function prepareStudioPublication(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: StudioHooks = {},
  command = "studio",
): ((validated: ProtocolValidationOutcome) => Promise<number>) | undefined {
  const studioPath = join(parsed.root, "generated", "spec-studio");
  const temporaryPath = `${studioPath}.tmp`;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const fail = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([studioPath, temporaryPath], output, command, recoveryRm);
    return 1;
  };
  for (const path of parsed.runs ?? [])
    if (!checkStudioInputPlacement(path, "--runs", parsed.root, output)) return undefined;
  const runs: unknown[] = [];
  for (const path of parsed.runs ?? []) {
    try {
      runs.push(JSON.parse(readFileSync(path, "utf8")) as unknown);
    } catch {
      writeStderr(output, `sdp ${command}: cannot read --runs ${JSON.stringify(path)} as JSON.\n`);
      return undefined;
    }
  }
  let prior: readonly StudioFile[] | undefined;
  try {
    if (parsed.checkClean) prior = readPublishedStudio(studioPath);
  } catch (error) {
    fail(`sdp ${command} --check-clean: cannot read generated Studio (${errorMessage(error)}).\n`);
    return undefined;
  }
  return async (validated) => {
    if (validated.graph === undefined) {
      removeArtifacts([studioPath, temporaryPath], output, command, recoveryRm);
      return validated.exitCode;
    }
    try {
      const render = hooks.renderStudio ?? renderStudio;
      const assets = hooks.studioAssets ?? {
        script: fileURLToPath(new URL("../studio/studio.js", import.meta.url)),
        stylesheet: fileURLToPath(new URL("../studio/studio.css", import.meta.url)),
      };
      const stylesheet = readFileSync(assets.stylesheet, "utf8");
      const files = studioFiles(
        render(
          await createStudioData(
            createReader(validated.graph, validated.report),
            validated.report,
            { ...parsed.studioInputs, runs },
          ),
          stylesheet,
        ),
        assets,
      );
      if (parsed.checkClean) {
        const twin = studioFiles(
          render(
            await createStudioData(
              createReader(validated.graph, validated.report),
              validated.report,
              { ...parsed.studioInputs, runs },
            ),
            stylesheet,
          ),
          assets,
        );
        if (!studioFilesEqual(files, twin))
          return fail(`sdp ${command} --check-clean: two independent renders diverged.\n`);
        if (prior === undefined || !studioFilesEqual(prior, files))
          return fail(
            `sdp ${command} --check-clean: generated Studio differs from the current projection.\n`,
          );
      }
      publishStudio(studioPath, files);
      writeStdout(output, `Wrote ${studioPath} (${String(files.length)} files)\n`);
      return validated.exitCode;
    } catch (error) {
      return fail(`sdp ${command}: ${errorMessage(error)}\n`);
    }
  };
}

/**
 * @sdpAnchor impl:protocol.studio-command
 * @sdpLabel validates and renders the Studio with independent byte checks and diagnostic exit codes
 * @sdpSatisfies spec:consumers.spec-studio.publisher, spec:consumers.spec-studio.data.inputs, spec:consumers.spec-studio
 * @sdpComponent component:protocol.cli
 * @sdpRole publisher
 */
export async function runStudio(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: StudioHooks = {},
): Promise<number> {
  const publish = prepareStudioPublication(parsed, output, hooks);
  return publish === undefined ? 1 : publish(runValidate(parsed, output, "studio", hooks));
}

/**
 * @sdpAnchor impl:protocol.studio-watch
 * @sdpLabel awaits the plain Studio publication in each coalesced carrier-watch cycle
 * @sdpSatisfies spec:consumers.spec-studio.publisher.watch
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */
export async function runStudioWatch(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: StudioHooks & ValidateWatchHooks = {},
): Promise<number> {
  return runValidateWatch(parsed, output, hooks, {
    ...hooks,
    watchCommand: "studio",
    watchSources: false,
    runWatchCycle: async () => {
      let current = parsed;
      if (parsed.studioBaseFile !== undefined) {
        const studioInputs = readStudioBase(
          parsed.studioBaseFile,
          parsed.studioBaseLabel ?? null,
          output,
          parsed.root,
        );
        if (studioInputs === undefined) return { exitCode: 1 };
        current = { ...parsed, studioInputs };
      }
      return { exitCode: await runStudio(current, output, hooks) };
    },
  });
}

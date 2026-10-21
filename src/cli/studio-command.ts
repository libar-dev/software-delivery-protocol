import { rmSync } from "node:fs";
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
import type { ValidationViewHooks } from "./validate-view-command.js";

export type { StudioAssets } from "../projections/studio/publish.js";

export interface StudioHooks extends ValidationViewHooks {
  readonly studioAssets?: StudioAssets;
  readonly renderStudio?: typeof renderStudio;
}

/**
 * @sdpAnchor impl:protocol.studio-command
 * @sdpLabel validates and renders the Studio with independent byte checks and diagnostic exit codes
 * @sdpSatisfies spec:consumers.spec-studio.publisher
 * @sdpComponent component:protocol.cli
 * @sdpRole publisher
 */
export async function runStudio(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: StudioHooks = {},
): Promise<number> {
  const studioPath = join(parsed.root, "generated", "spec-studio");
  const temporaryPath = `${studioPath}.tmp`;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const fail = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([studioPath, temporaryPath], output, "studio", recoveryRm);
    return 1;
  };
  let prior: readonly StudioFile[] | undefined;
  try {
    if (parsed.checkClean) prior = readPublishedStudio(studioPath);
  } catch (error) {
    return fail(
      `sdp studio --check-clean: cannot read generated Studio (${errorMessage(error)}).\n`,
    );
  }
  const validated = runValidate(parsed, output, "studio", hooks);
  if (validated.graph === undefined) {
    removeArtifacts([studioPath, temporaryPath], output, "studio", recoveryRm);
    return validated.exitCode;
  }
  try {
    const render = hooks.renderStudio ?? renderStudio;
    const assets = hooks.studioAssets ?? {
      script: fileURLToPath(new URL("../studio/studio.js", import.meta.url)),
      stylesheet: fileURLToPath(new URL("../studio/studio.css", import.meta.url)),
    };
    const files = studioFiles(
      render(await createStudioData(createReader(validated.graph))),
      assets,
    );
    if (parsed.checkClean) {
      const twin = studioFiles(
        render(await createStudioData(createReader(validated.graph))),
        assets,
      );
      if (!studioFilesEqual(files, twin))
        return fail("sdp studio --check-clean: two independent renders diverged.\n");
      if (prior === undefined || !studioFilesEqual(prior, files))
        return fail(
          "sdp studio --check-clean: generated Studio differs from the current projection.\n",
        );
    }
    publishStudio(studioPath, files);
    writeStdout(output, `Wrote ${studioPath} (${String(files.length)} files)\n`);
    return validated.exitCode;
  } catch (error) {
    return fail(`sdp studio: ${errorMessage(error)}\n`);
  }
}

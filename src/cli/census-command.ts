import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { renderCensus } from "../projections/census.js";
import type { CensusPage } from "../projections/census.js";
import { createReader } from "../reader/reader.js";
import { removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

export interface CensusHooks extends ValidationViewHooks {
  readonly renderCensus?: typeof renderCensus;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readPublishedPages(root: string): readonly CensusPage[] | undefined {
  if (!existsSync(root)) {
    return undefined;
  }

  const pages: CensusPage[] = [];
  const visit = (directory: string): void => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      compareCodeUnits(left.name, right.name),
    );

    for (const entry of entries) {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        visit(path);
      } else if (entry.isFile()) {
        pages.push({
          path: relative(root, path).replaceAll("\\", "/"),
          content: readFileSync(path, "utf8"),
        });
      }
    }
  };
  visit(root);

  return pages.sort((left, right) => compareCodeUnits(left.path, right.path));
}

function pagesEqual(left: readonly CensusPage[], right: readonly CensusPage[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

const censusPageCliAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.census-page-cli"),
  label: "publishes the census through the explicit `sdp census` surface",
  satisfies: ref("spec:consumers.census-page"),
  component: componentAnchorId("component:protocol.cli"),
});
void censusPageCliAnchor;

/** Publishes the census independently of Design Review as one wholesale tmp-to-rename root. */
export function runCensus(parsed: BuildArgs, output: CliOutput, hooks: CensusHooks): number {
  const render = hooks.renderCensus ?? renderCensus;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const censusPath = join(parsed.root, "generated", "census");
  const temporaryPath = `${censusPath}.tmp`;
  let publishedBeforeBuild: readonly CensusPage[] | undefined;

  try {
    publishedBeforeBuild = parsed.checkClean ? readPublishedPages(censusPath) : undefined;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(output, `sdp census --check-clean: cannot read generated census (${detail}).\n`);
    removeArtifacts([censusPath, temporaryPath], output, "census", recoveryRm);
    return 1;
  }

  const validate = runValidate(parsed, output, "census", hooks);

  if (validate.graph === undefined) {
    removeArtifacts([censusPath, temporaryPath], output, "census", recoveryRm);
    return validate.exitCode;
  }

  const failCensus = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([censusPath, temporaryPath], output, "census", recoveryRm);
    return 1;
  };

  try {
    const pages = render(createReader(validate.graph));

    if (parsed.checkClean) {
      const second = render(createReader(validate.graph));

      if (!pagesEqual(second, pages)) {
        return failCensus(
          "sdp census --check-clean: two independent renders diverged — the census is not deterministic.\n",
        );
      }

      if (publishedBeforeBuild === undefined || !pagesEqual(publishedBeforeBuild, pages)) {
        return failCensus(
          "sdp census --check-clean: generated census differs from the current projection.\n",
        );
      }
    }

    rmSync(temporaryPath, { recursive: true, force: true });

    for (const page of pages) {
      const target = join(temporaryPath, page.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, page.content, "utf8");
    }

    rmSync(censusPath, { recursive: true, force: true });
    renameSync(temporaryPath, censusPath);
    writeStdout(output, `Wrote ${censusPath} (${String(pages.length)} pages)\n`);
    return validate.exitCode;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    return failCensus(`sdp census: ${detail}\n`);
  }
}

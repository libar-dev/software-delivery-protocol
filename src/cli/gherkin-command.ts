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
import { renderGherkinView } from "../projections/gherkin-view.js";
import type { GherkinViewPage } from "../projections/gherkin-view.js";
import { createReader } from "../reader/reader.js";
import { removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

export interface GherkinViewHooks extends ValidationViewHooks {
  readonly renderGherkinView?: typeof renderGherkinView;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readPublishedPages(root: string): readonly GherkinViewPage[] | undefined {
  if (!existsSync(root)) {
    return undefined;
  }

  const pages: GherkinViewPage[] = [];
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

function pagesEqual(left: readonly GherkinViewPage[], right: readonly GherkinViewPage[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

const gherkinViewCliAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.gherkin-view-cli"),
  label: "publishes the Gherkin view through the explicit `sdp gherkin` surface",
  satisfies: ref("spec:consumers.gherkin-view"),
  component: componentAnchorId("component:protocol.cli"),
});
void gherkinViewCliAnchor;

/** Publishes the Gherkin-shaped READ projection independently as one wholesale tmp-to-rename root. */
export function runGherkinView(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: GherkinViewHooks,
): number {
  const render = hooks.renderGherkinView ?? renderGherkinView;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const viewPath = join(parsed.root, "generated", "gherkin");
  const temporaryPath = `${viewPath}.tmp`;
  let publishedBeforeBuild: readonly GherkinViewPage[] | undefined;

  try {
    publishedBeforeBuild = parsed.checkClean ? readPublishedPages(viewPath) : undefined;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(
      output,
      `sdp gherkin --check-clean: cannot read generated Gherkin view (${detail}).\n`,
    );
    removeArtifacts([viewPath, temporaryPath], output, "gherkin", recoveryRm);
    return 1;
  }

  const validate = runValidate(parsed, output, "gherkin", hooks);

  if (validate.graph === undefined) {
    removeArtifacts([viewPath, temporaryPath], output, "gherkin", recoveryRm);
    return validate.exitCode;
  }

  const failView = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([viewPath, temporaryPath], output, "gherkin", recoveryRm);
    return 1;
  };

  try {
    const pages = render(createReader(validate.graph));

    if (parsed.checkClean) {
      const second = render(createReader(validate.graph));

      if (!pagesEqual(second, pages)) {
        return failView(
          "sdp gherkin --check-clean: two independent renders diverged — the Gherkin view is not deterministic.\n",
        );
      }

      if (publishedBeforeBuild === undefined || !pagesEqual(publishedBeforeBuild, pages)) {
        return failView(
          "sdp gherkin --check-clean: generated Gherkin view differs from the current projection.\n",
        );
      }
    }

    rmSync(temporaryPath, { recursive: true, force: true });

    for (const page of pages) {
      const target = join(temporaryPath, page.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, page.content, "utf8");
    }

    rmSync(viewPath, { recursive: true, force: true });
    renameSync(temporaryPath, viewPath);
    writeStdout(output, `Wrote ${viewPath} (${String(pages.length)} pages)\n`);
    return validate.exitCode;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    return failView(`sdp gherkin: ${detail}\n`);
  }
}

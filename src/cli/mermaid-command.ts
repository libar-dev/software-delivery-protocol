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

import { renderMermaid } from "../projections/mermaid.js";
import { createReader } from "../reader/reader.js";
import type { Reader } from "../reader/reader.js";
import { removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";
import { runValidate } from "./validate-view-command.js";
import type { ValidationViewHooks } from "./validate-view-command.js";

interface MermaidPage {
  readonly path: string;
  readonly content: string;
}

type MermaidOutput = readonly MermaidPage[] | ReadonlyMap<string, string>;
type MermaidRenderer = (reader: Reader) => MermaidOutput;

export interface MermaidHooks extends ValidationViewHooks {
  readonly renderMermaid?: MermaidRenderer;
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readPublishedPages(root: string): readonly MermaidPage[] | undefined {
  if (!existsSync(root)) {
    return undefined;
  }

  const pages: MermaidPage[] = [];
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

function normalizePages(output: MermaidOutput): readonly MermaidPage[] {
  const pages = Array.isArray(output)
    ? [...(output as readonly MermaidPage[])]
    : [...(output as ReadonlyMap<string, string>)].map(([path, content]) => ({ path, content }));

  return pages.sort((left, right) => compareCodeUnits(left.path, right.path));
}

function pagesEqual(left: readonly MermaidPage[], right: readonly MermaidPage[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** Publishes Mermaid independently as one wholesale tmp-to-rename root. */
export function runMermaid(parsed: BuildArgs, output: CliOutput, hooks: MermaidHooks): number {
  const render: MermaidRenderer = hooks.renderMermaid ?? renderMermaid;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const mermaidPath = join(parsed.root, "generated", "mermaid");
  const temporaryPath = `${mermaidPath}.tmp`;
  let publishedBeforeBuild: readonly MermaidPage[] | undefined;

  try {
    publishedBeforeBuild = parsed.checkClean ? readPublishedPages(mermaidPath) : undefined;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(output, `sdp mermaid --check-clean: cannot read generated Mermaid (${detail}).\n`);
    removeArtifacts([mermaidPath, temporaryPath], output, "mermaid", recoveryRm);
    return 1;
  }

  const validate = runValidate(parsed, output, "mermaid", hooks);

  if (validate.graph === undefined) {
    removeArtifacts([mermaidPath, temporaryPath], output, "mermaid", recoveryRm);
    return validate.exitCode;
  }

  const failMermaid = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([mermaidPath, temporaryPath], output, "mermaid", recoveryRm);
    return 1;
  };

  try {
    const pages = normalizePages(render(createReader(validate.graph)));

    if (parsed.checkClean) {
      const second = normalizePages(render(createReader(validate.graph)));

      if (!pagesEqual(second, pages)) {
        return failMermaid(
          "sdp mermaid --check-clean: two independent renders diverged — Mermaid is not deterministic.\n",
        );
      }

      if (publishedBeforeBuild === undefined || !pagesEqual(publishedBeforeBuild, pages)) {
        return failMermaid(
          "sdp mermaid --check-clean: generated Mermaid differs from the current projection.\n",
        );
      }
    }

    rmSync(temporaryPath, { recursive: true, force: true });

    for (const page of pages) {
      const target = join(temporaryPath, page.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, page.content, "utf8");
    }

    rmSync(mermaidPath, { recursive: true, force: true });
    renameSync(temporaryPath, mermaidPath);
    writeStdout(output, `Wrote ${mermaidPath} (${String(pages.length)} pages)\n`);
    return validate.exitCode;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    return failMermaid(`sdp mermaid: ${detail}\n`);
  }
}

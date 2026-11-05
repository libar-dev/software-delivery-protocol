import { dirname, join } from "node:path";

import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { readPublishedTextPages } from "../projections/published-tree.js";
import { renderMermaid } from "../projections/mermaid.js";
import { createReader } from "../reader/reader.js";
import type { Reader } from "../reader/reader.js";
import { guardedOutput, assertDistinctPagePaths, removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import type { BuildOutcome } from "./build-command.js";
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
  return readPublishedTextPages(root);
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

const mermaidViewCliAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.mermaid-view-cli"),
  label: "publishes Mermaid through the explicit `sdp mermaid` surface",
  satisfies: ref("spec:consumers.mermaid-view"),
  component: componentAnchorId("component:protocol.cli"),
  role: "publisher",
});
void mermaidViewCliAnchor;

/** Publishes Mermaid independently as one wholesale tmp-to-rename root. */
export function prepareMermaidPublication(
  parsed: BuildArgs,
  output: CliOutput,
  hooks: MermaidHooks,
  command = "mermaid",
): ((validated: BuildOutcome) => number) | undefined {
  const {
    rmSync: remove,
    mkdirSync: mkdir,
    writeFileSync: writeOutput,
    renameSync: rename,
    check,
  } = guardedOutput(parsed.root, hooks);
  const render: MermaidRenderer = hooks.renderMermaid ?? renderMermaid;
  const recoveryRm = remove;
  const mermaidPath = join(parsed.root, "generated", "mermaid");
  const temporaryPath = `${mermaidPath}.tmp`;
  let publishedBeforeBuild: readonly MermaidPage[] | undefined;

  try {
    publishedBeforeBuild = parsed.checkClean ? readPublishedPages(mermaidPath) : undefined;
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(
      output,
      `sdp ${command} --check-clean: cannot read generated Mermaid (${detail}).\n`,
    );
    removeArtifacts([mermaidPath, temporaryPath], output, command, recoveryRm);
    return undefined;
  }

  return (validate) => {
    if (validate.graph === undefined) {
      removeArtifacts([mermaidPath, temporaryPath], output, command, recoveryRm);
      return validate.exitCode;
    }

    const failMermaid = (message: string): number => {
      writeStderr(output, message);
      removeArtifacts([mermaidPath, temporaryPath], output, command, recoveryRm);
      return 1;
    };

    try {
      const pages = normalizePages(render(createReader(validate.graph)));
      assertDistinctPagePaths(pages);

      if (parsed.checkClean) {
        const second = normalizePages(render(createReader(validate.graph)));

        if (!pagesEqual(second, pages)) {
          return failMermaid(
            `sdp ${command} --check-clean: two independent renders diverged — Mermaid is not deterministic.\n`,
          );
        }

        if (publishedBeforeBuild === undefined || !pagesEqual(publishedBeforeBuild, pages)) {
          return failMermaid(
            `sdp ${command} --check-clean: generated Mermaid differs from the current projection.\n`,
          );
        }
      }

      remove(temporaryPath, { recursive: true, force: true });

      for (const page of pages) {
        const target = join(temporaryPath, page.path);
        mkdir(dirname(target), { recursive: true });
        writeOutput(target, page.content, { encoding: "utf8", flag: "wx" });
      }

      remove(mermaidPath, { recursive: true, force: true });
      rename(temporaryPath, mermaidPath);
      check(join(parsed.root, "generated", ".boundary"));
      writeStdout(output, `Wrote ${mermaidPath} (${String(pages.length)} pages)\n`);
      return validate.exitCode;
    } catch (error) {
      const detail = error instanceof Error ? error.message : errorMessage(error);
      return failMermaid(`sdp ${command}: ${detail}\n`);
    }
  };
}

export function runMermaid(parsed: BuildArgs, output: CliOutput, hooks: MermaidHooks): number {
  const publish = prepareMermaidPublication(parsed, output, hooks);
  return publish === undefined ? 1 : publish(runValidate(parsed, output, "mermaid", hooks));
}

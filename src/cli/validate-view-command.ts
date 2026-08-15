import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { renderDesignReview } from "../projections/design-review.js";
import { createReader } from "../reader/reader.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { validateGraph } from "../validate/validators.js";
import { removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import { runBuild } from "./build-command.js";
import type { BuildHooks, BuildOutcome } from "./build-command.js";
import type { CliOutput } from "./output.js";
import { errorMessage, formatFinding, writeStderr, writeStdout } from "./output.js";

export interface ValidationViewHooks extends BuildHooks {
  readonly renderDesignReview?: typeof renderDesignReview;
  readonly validateGraph?: typeof validateGraph;
}

export function runValidate(
  parsed: BuildArgs,
  output: CliOutput,
  command: string,
  hooks: ValidationViewHooks,
): BuildOutcome {
  const build = runBuild(parsed, output, command, hooks);

  if (build.graph === undefined) {
    return build;
  }

  const runValidateGraph = hooks.validateGraph ?? validateGraph;

  try {
    const findings = runValidateGraph(build.graph).findings;

    for (const finding of findings) {
      writeStderr(output, formatFinding(finding));
    }

    const errorCount = findings.filter((finding) => finding.severity === "error").length;
    const warningCount = findings.length - errorCount;
    writeStdout(
      output,
      `validate: ${String(errorCount)} errors · ${String(warningCount)} warnings (conformance + honesty over the one graph)\n`,
    );

    return { exitCode: errorCount > 0 ? 1 : 0, graph: build.graph };
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    writeStderr(output, `sdp ${command}: ${detail}\n`);
    return { exitCode: 1 };
  }
}

const wholesaleViewRewriteAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.wholesale-view-rewrite"),
  label: "publishes each Design Review as one wholesale temporary-directory replacement",
  satisfies: ref("spec:consumers.wholesale-view-rewrite"),
  component: componentAnchorId("component:protocol.cli"),
});
void wholesaleViewRewriteAnchor;

export function runView(parsed: BuildArgs, output: CliOutput, hooks: ValidationViewHooks): number {
  const render = hooks.renderDesignReview ?? renderDesignReview;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const viewPath = join(parsed.root, "generated", "design-review");
  const validate = runValidate(parsed, output, "view", hooks);

  if (validate.graph === undefined) {
    removeArtifacts([viewPath], output, "view", recoveryRm);
    return validate.exitCode;
  }

  const temporaryPath = `${viewPath}.tmp`;
  const failView = (message: string): number => {
    writeStderr(output, message);
    removeArtifacts([viewPath, temporaryPath], output, "view", recoveryRm);
    return 1;
  };

  try {
    const pages = render(createReader(validate.graph));

    if (parsed.checkClean) {
      const second = render(createReader(validate.graph));

      if (JSON.stringify(second) !== JSON.stringify(pages)) {
        return failView(
          "sdp view --check-clean: two independent renders diverged — the view is not deterministic.\n",
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
    return failView(`sdp view: ${detail}\n`);
  }
}

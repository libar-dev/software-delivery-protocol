import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { generateContracts } from "../codegen/contracts.js";
import { extract } from "../extract/index.js";
import { serializeGraph } from "../extract/serialize.js";
import type { GraphSchema } from "../graph/schema.js";
import { codeAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { removeArtifact, removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { errorMessage, formatFinding, writeStderr, writeStdout } from "./output.js";

export interface BuildHooks {
  readonly extract?: typeof extract;
  readonly generateContracts?: typeof generateContracts;
  readonly rmSync?: typeof rmSync;
}

export interface BuildOutcome {
  readonly exitCode: number;
  readonly graph?: GraphSchema;
}

function contractFilesEqual(
  first: ReadonlyMap<string, string>,
  second: ReadonlyMap<string, string>,
): boolean {
  if (first.size !== second.size) {
    return false;
  }

  for (const [path, content] of first) {
    if (second.get(path) !== content) {
      return false;
    }
  }

  return true;
}

const determinismAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.extraction-determinism"),
  label: "repeats and byte-compares graph and contract generation under --check-clean",
  satisfies: ref("spec:extraction.determinism"),
});
const regenerabilityAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.regenerability"),
  label: "repeats graph and contract producers for deterministic regeneration",
  satisfies: ref("spec:extraction.regenerability"),
});
const wholesaleViewBuildInvalidationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.wholesale-view-build-invalidation"),
  label: "invalidates the prior Design Review before every build attempt",
  satisfies: ref("spec:consumers.wholesale-view-rewrite"),
});
const buildPipelineEmitAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.build-pipeline-emit"),
  label: "the build command owns the ordered flow through artifact emission",
  satisfies: ref("spec:extraction.build-pipeline"),
});
void determinismAnchor;
void regenerabilityAnchor;
void wholesaleViewBuildInvalidationAnchor;
void buildPipelineEmitAnchor;

export function runBuild(
  parsed: BuildArgs,
  output: CliOutput,
  command: string,
  hooks: BuildHooks,
): BuildOutcome {
  const { root: resolvedRoot, exclude, checkClean } = parsed;
  const extractionOptions = { root: resolvedRoot, exclude };
  const runExtract = hooks.extract ?? extract;
  const runGenerateContracts = hooks.generateContracts ?? generateContracts;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const graphPath = join(resolvedRoot, "generated", "graph.json");
  const contractsPath = join(resolvedRoot, "generated", "contracts");
  const viewPath = join(resolvedRoot, "generated", "design-review");

  const failBuild = (message: string): BuildOutcome => {
    writeStderr(output, message);
    removeArtifacts(
      [graphPath, `${graphPath}.tmp`, contractsPath, `${contractsPath}.tmp`],
      output,
      command,
      recoveryRm,
    );
    return { exitCode: 1 };
  };

  for (const staleViewPath of [viewPath, `${viewPath}.tmp`]) {
    const failure = removeArtifact(staleViewPath, recoveryRm);

    if (failure !== undefined) {
      return failBuild(
        `sdp ${command}: stale ${staleViewPath} could not be removed (${failure}) — build stopped so it cannot read as current.\n`,
      );
    }
  }

  try {
    const result = runExtract(extractionOptions);
    const findings = result.report.findings;

    for (const finding of findings) {
      writeStderr(output, formatFinding(finding));
    }

    if (
      result.counts.specs === 0 &&
      !findings.some(
        (finding) =>
          finding.file?.endsWith(".sdp.ts") === true || finding.file?.endsWith(".sdp.md") === true,
      )
    ) {
      writeStderr(
        output,
        `note: no *.sdp.ts or *.sdp.md spec files found under ${resolvedRoot} — the authored model is empty. Is this the right extraction root?\n`,
      );
    }

    const extractionErrorCount = findings.filter((finding) => finding.severity === "error").length;

    if (extractionErrorCount > 0) {
      const warningCount = findings.length - extractionErrorCount;
      writeStdout(
        output,
        `${String(result.counts.specs)} specs · ${String(result.counts.packs)} packs · ${String(result.counts.anchors)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(extractionErrorCount)} errors, ${String(warningCount)} warnings)\n`,
      );
      return failBuild(`sdp ${command}: hard errors present — graph.json not written.\n`);
    }

    const serialized = serializeGraph(result.graph);
    const contracts = runGenerateContracts(result.graph);

    for (const finding of contracts.findings) {
      writeStderr(output, formatFinding(finding));
    }

    const allFindings = [...findings, ...contracts.findings];
    const errorCount = allFindings.filter((finding) => finding.severity === "error").length;
    const warningCount = allFindings.length - errorCount;
    const summary = `${String(result.counts.specs)} specs · ${String(result.counts.packs)} packs · ${String(result.counts.anchors)} anchors → ${String(result.graph.nodes.length)} nodes · ${String(result.graph.edges.length)} edges (${String(errorCount)} errors, ${String(warningCount)} warnings)\n`;

    if (checkClean) {
      const secondResult = runExtract(extractionOptions);
      const second = serializeGraph(secondResult.graph);

      if (second !== serialized) {
        return failBuild(
          `sdp ${command} --check-clean: two independent extractions diverged — the build is not deterministic.\n`,
        );
      }

      const secondContracts = runGenerateContracts(secondResult.graph);

      if (!contractFilesEqual(contracts.files, secondContracts.files)) {
        return failBuild(
          `sdp ${command} --check-clean: two independent contract generations diverged — the build is not deterministic.\n`,
        );
      }
    }

    const temporaryPath = `${graphPath}.tmp`;
    mkdirSync(join(resolvedRoot, "generated"), { recursive: true });
    writeFileSync(temporaryPath, serialized, "utf8");
    renameSync(temporaryPath, graphPath);

    const contractsTemporaryPath = `${contractsPath}.tmp`;
    rmSync(contractsTemporaryPath, { recursive: true, force: true });

    if (contracts.files.size > 0) {
      mkdirSync(contractsTemporaryPath, { recursive: true });

      for (const [relativePath, content] of contracts.files) {
        writeFileSync(join(contractsTemporaryPath, relativePath), content, "utf8");
      }

      rmSync(contractsPath, { recursive: true, force: true });
      renameSync(contractsTemporaryPath, contractsPath);
    } else {
      rmSync(contractsPath, { recursive: true, force: true });
    }

    writeStdout(output, summary);
    writeStdout(output, `Wrote ${graphPath}\n`);

    if (contracts.files.size > 0) {
      writeStdout(output, `Wrote ${contractsPath} (${String(contracts.files.size)} modules)\n`);
    }

    return { exitCode: 0, graph: result.graph };
  } catch (error) {
    const detail = error instanceof Error ? error.message : errorMessage(error);
    return failBuild(`sdp ${command}: ${detail}\n`);
  }
}

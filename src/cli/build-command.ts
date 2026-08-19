import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, posix, relative, sep, win32 } from "node:path";

import { generateContracts } from "../codegen/contracts.js";
import { extract } from "../extract/index.js";
import { serializeGraph } from "../extract/serialize.js";
import type { GraphSchema } from "../graph/schema.js";
import { codeAnchorId, componentAnchorId, ref } from "../ids.js";
import { codeAnchor } from "../model/code-anchor.js";
import { removeArtifact, removeArtifacts } from "./artifacts.js";
import type { BuildArgs } from "./build-args.js";
import type { CliOutput } from "./output.js";
import { errorMessage, formatFinding, writeStderr, writeStdout } from "./output.js";

const cliComponentAnchor = codeAnchor({
  id: codeAnchorId("component:protocol.cli"),
  label: "Protocol CLI seam",
  satisfies: ref("spec:extraction.build-pipeline"),
  uses: [
    componentAnchorId("component:protocol.extract"),
    componentAnchorId("component:protocol.reader"),
    componentAnchorId("component:protocol.projections"),
    componentAnchorId("component:protocol.codegen"),
    componentAnchorId("component:protocol.validate"),
  ],
});

export interface BuildHooks {
  readonly extract?: typeof extract;
  readonly generateContracts?: typeof generateContracts;
  readonly rmSync?: typeof rmSync;
  readonly writeFileSync?: typeof writeFileSync;
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

const REGISTRAR_MANIFEST_VERSION = 1;

interface RegistrarManifest {
  readonly version: typeof REGISTRAR_MANIFEST_VERSION;
  readonly files: readonly string[];
}

function isNotFound(error: unknown): boolean {
  const code =
    typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
  return code === "ENOENT" || code === "ENOTDIR";
}

function containedWithin(root: string, candidate: string): boolean {
  const nested = relative(root, candidate);
  return (
    nested === "" || (!nested.startsWith(`..${sep}`) && nested !== ".." && !isAbsolute(nested))
  );
}

function closestExistingAncestor(path: string): string {
  let candidate = path;

  for (;;) {
    try {
      lstatSync(candidate);
      return candidate;
    } catch (error) {
      if (!isNotFound(error)) {
        throw error;
      }

      const parent = dirname(candidate);

      if (parent === candidate) {
        throw error;
      }

      candidate = parent;
    }
  }
}

/** Parse one manifest key and resolve its existing parent without trusting lexical containment. */
function confinedRegistrarPath(
  root: string,
  rootReal: string,
  path: string,
  createParent = false,
): string | undefined {
  const parsed = posix.parse(path);

  if (
    path === "" ||
    path.includes("\\") ||
    parsed.root !== "" ||
    win32.parse(path).root !== "" ||
    posix.normalize(path) !== path ||
    !parsed.base.endsWith(".test.generated.ts")
  ) {
    throw new Error(`unsafe registrar sibling path "${path}"`);
  }

  const lexicalParent = join(root, ...parsed.dir.split("/").filter((segment) => segment !== ""));
  const existingParent = closestExistingAncestor(lexicalParent);
  let existingParentReal: string;

  try {
    existingParentReal = realpathSync(existingParent);
  } catch (error) {
    throw new Error(`unsafe registrar sibling path "${path}": ${errorMessage(error)}`);
  }

  if (!containedWithin(rootReal, existingParentReal)) {
    throw new Error(`unsafe registrar sibling path "${path}" escapes the extraction root`);
  }

  if (existingParent !== lexicalParent) {
    if (!createParent) {
      return undefined;
    }

    mkdirSync(lexicalParent, { recursive: true });
  }

  let parentReal: string;

  try {
    parentReal = realpathSync(lexicalParent);
  } catch (error) {
    throw new Error(`unsafe registrar sibling path "${path}": ${errorMessage(error)}`);
  }

  if (!containedWithin(rootReal, parentReal)) {
    throw new Error(`unsafe registrar sibling path "${path}" escapes the extraction root`);
  }

  return join(parentReal, parsed.base);
}

function serializeRegistrarManifest(paths: readonly string[]): string {
  return `${JSON.stringify({ version: REGISTRAR_MANIFEST_VERSION, files: paths }, null, 2)}\n`;
}

function readRegistrarManifest(path: string, root: string, rootReal: string): readonly string[] {
  if (!existsSync(path)) {
    return [];
  }

  const decoded: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    (decoded as Partial<RegistrarManifest>).version !== REGISTRAR_MANIFEST_VERSION ||
    !Array.isArray((decoded as Partial<RegistrarManifest>).files)
  ) {
    throw new Error(`registrar manifest ${path} has an unsupported shape or version`);
  }

  const files = (decoded as RegistrarManifest).files;

  if (
    files.some((entry) => typeof entry !== "string") ||
    new Set(files).size !== files.length ||
    [...files].sort().some((entry, index) => entry !== files[index])
  ) {
    throw new Error(`registrar manifest ${path} must contain unique sorted safe sibling paths`);
  }

  for (const entry of files) {
    confinedRegistrarPath(root, rootReal, entry);
  }

  return files;
}
const wholesaleViewBuildInvalidationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.wholesale-view-build-invalidation"),
  label: "invalidates the prior Design Review before every build attempt",
  satisfies: ref("spec:consumers.wholesale-view-rewrite"),
  component: componentAnchorId("component:protocol.cli"),
});
const buildPipelineEmitAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.build-pipeline-emit"),
  label: "the build command owns the ordered flow through artifact emission",
  satisfies: ref("spec:extraction.build-pipeline"),
  component: componentAnchorId("component:protocol.cli"),
});
const determinismAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.extraction-determinism"),
  label: "repeats and byte-compares graph and contract generation under --check-clean",
  satisfies: ref("spec:extraction.determinism"),
  component: componentAnchorId("component:protocol.cli"),
});
const regenerabilityAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.regenerability"),
  label: "repeats graph and contract producers for deterministic regeneration",
  satisfies: ref("spec:extraction.regenerability"),
  component: componentAnchorId("component:protocol.cli"),
});
export function runBuild(
  parsed: BuildArgs,
  output: CliOutput,
  command: string,
  hooks: BuildHooks,
): BuildOutcome {
  void [
    cliComponentAnchor,
    determinismAnchor,
    regenerabilityAnchor,
    wholesaleViewBuildInvalidationAnchor,
    buildPipelineEmitAnchor,
  ];
  const { root: resolvedRoot, exclude, checkClean } = parsed;
  const extractionOptions = { root: resolvedRoot, exclude };
  const runExtract = hooks.extract ?? extract;
  const runGenerateContracts = hooks.generateContracts ?? generateContracts;
  const recoveryRm = hooks.rmSync ?? rmSync;
  const write = hooks.writeFileSync ?? writeFileSync;
  const graphPath = join(resolvedRoot, "generated", "graph.json");
  const contractsPath = join(resolvedRoot, "generated", "contracts");
  const registrarManifestPath = join(resolvedRoot, "generated", "registrars.json");
  const registrarRootReal = realpathSync(resolvedRoot);
  let priorRegistrarPaths: readonly string[] = [];
  let nextRegistrarPaths: readonly string[] = [];
  const projectionPaths = [
    join(resolvedRoot, "generated", "design-review"),
    join(resolvedRoot, "generated", "census"),
    join(resolvedRoot, "generated", "mermaid"),
    join(resolvedRoot, "generated", "gherkin"),
  ];

  const failBuild = (message: string): BuildOutcome => {
    writeStderr(output, message);
    removeArtifacts(
      [
        graphPath,
        `${graphPath}.tmp`,
        contractsPath,
        `${contractsPath}.tmp`,
        registrarManifestPath,
        `${registrarManifestPath}.tmp`,
      ],
      output,
      command,
      recoveryRm,
    );

    for (const path of new Set([...priorRegistrarPaths, ...nextRegistrarPaths])) {
      try {
        const registrarPath = confinedRegistrarPath(resolvedRoot, registrarRootReal, path);

        if (registrarPath !== undefined) {
          removeArtifacts([registrarPath, `${registrarPath}.tmp`], output, command, recoveryRm);
        }
      } catch {
        // An untrusted or swapped parent is outside generated ownership and must not be followed.
      }
    }

    return { exitCode: 1 };
  };

  for (const projectionPath of projectionPaths) {
    for (const staleProjectionPath of [projectionPath, `${projectionPath}.tmp`]) {
      const failure = removeArtifact(staleProjectionPath, recoveryRm);

      if (failure !== undefined) {
        return failBuild(
          `sdp ${command}: stale ${staleProjectionPath} could not be removed (${failure}) — build stopped so it cannot read as current.\n`,
        );
      }
    }
  }

  try {
    priorRegistrarPaths = readRegistrarManifest(
      registrarManifestPath,
      resolvedRoot,
      registrarRootReal,
    );
    const result = runExtract(extractionOptions);
    const findings = result.report.findings;

    for (const finding of findings) {
      writeStderr(output, formatFinding(finding));
    }

    if (
      result.counts.specs === 0 &&
      !findings.some(
        (finding) =>
          finding.file?.endsWith(".sdp.ts") === true ||
          finding.file?.endsWith(".sdp.md") === true ||
          finding.file?.endsWith(".sdp.gherkin") === true,
      )
    ) {
      writeStderr(
        output,
        `note: no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found under ${resolvedRoot} — the authored model is empty. Is this the right extraction root?\n`,
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
    const generatedRegistrarPaths = [...contracts.registrars.keys()].sort();

    try {
      for (const path of generatedRegistrarPaths) {
        confinedRegistrarPath(resolvedRoot, registrarRootReal, path);
      }
    } catch {
      return failBuild(`sdp ${command}: generated an unsafe registrar sibling path.\n`);
    }

    nextRegistrarPaths = generatedRegistrarPaths;

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

      if (
        !contractFilesEqual(contracts.files, secondContracts.files) ||
        !contractFilesEqual(contracts.registrars, secondContracts.registrars)
      ) {
        return failBuild(
          `sdp ${command} --check-clean: two independent contract generations diverged — the build is not deterministic.\n`,
        );
      }

      if (
        priorRegistrarPaths.length !== nextRegistrarPaths.length ||
        priorRegistrarPaths.some((path, index) => path !== nextRegistrarPaths[index]) ||
        nextRegistrarPaths.some((path) => {
          const registrarPath = confinedRegistrarPath(resolvedRoot, registrarRootReal, path);
          return (
            registrarPath === undefined ||
            !existsSync(registrarPath) ||
            readFileSync(registrarPath, "utf8") !== contracts.registrars.get(path)
          );
        })
      ) {
        return failBuild(
          `sdp ${command} --check-clean: generated registrar manifest or sibling bytes differ from the current projection.\n`,
        );
      }
    }

    const temporaryPath = `${graphPath}.tmp`;
    mkdirSync(join(resolvedRoot, "generated"), { recursive: true });
    write(temporaryPath, serialized, "utf8");

    const contractsTemporaryPath = `${contractsPath}.tmp`;
    rmSync(contractsTemporaryPath, { recursive: true, force: true });

    if (contracts.files.size > 0) {
      mkdirSync(contractsTemporaryPath, { recursive: true });

      for (const [relativePath, content] of contracts.files) {
        const target = join(contractsTemporaryPath, relativePath);
        mkdirSync(join(target, ".."), { recursive: true });
        write(target, content, "utf8");
      }
    }

    for (const [relativePath, content] of contracts.registrars) {
      const createdRegistrarPath = confinedRegistrarPath(
        resolvedRoot,
        registrarRootReal,
        relativePath,
        true,
      );

      if (createdRegistrarPath === undefined) {
        throw new Error(`unsafe registrar sibling path "${relativePath}"`);
      }

      rmSync(`${createdRegistrarPath}.tmp`, { force: true });
      const registrarPath = confinedRegistrarPath(resolvedRoot, registrarRootReal, relativePath);

      if (registrarPath === undefined) {
        throw new Error(`unsafe registrar sibling path "${relativePath}"`);
      }

      write(`${registrarPath}.tmp`, content, "utf8");
    }

    const registrarManifestTemporaryPath = `${registrarManifestPath}.tmp`;
    write(registrarManifestTemporaryPath, serializeRegistrarManifest(nextRegistrarPaths), "utf8");

    // Every owed byte now exists in a temporary location. Publish, reconcile, and remove stale
    // siblings; any later failure falls through failBuild, which removes the whole known set so
    // partially current output cannot survive.
    renameSync(temporaryPath, graphPath);
    rmSync(contractsPath, { recursive: true, force: true });
    if (contracts.files.size > 0) {
      renameSync(contractsTemporaryPath, contractsPath);
    }
    for (const stalePath of priorRegistrarPaths.filter(
      (path) => !nextRegistrarPaths.includes(path),
    )) {
      const registrarPath = confinedRegistrarPath(resolvedRoot, registrarRootReal, stalePath);

      if (registrarPath !== undefined) {
        rmSync(registrarPath, { force: true });
      }
    }
    for (const relativePath of nextRegistrarPaths) {
      const registrarPath = confinedRegistrarPath(resolvedRoot, registrarRootReal, relativePath);

      if (registrarPath === undefined) {
        throw new Error(`unsafe registrar sibling path "${relativePath}"`);
      }

      renameSync(`${registrarPath}.tmp`, registrarPath);
    }
    renameSync(registrarManifestTemporaryPath, registrarManifestPath);

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

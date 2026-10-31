import { readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { buildOwnedPaths } from "./build-command.js";
import { pathWithin, physicalPath } from "./path-identity.js";
import type { StudioInputs } from "../projections/studio/inputs.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

/**
 * @sdpAnchor impl:protocol.studio-base-input
 * @sdpSatisfies spec:consumers.spec-studio.data.inputs
 * @sdpComponent component:protocol.cli
 * @sdpRole codec
 * @sdpLabel reads named Studio base graphs and run inputs
 */
export function readStudioBase(
  path: string,
  label: string | null,
  output: CliOutput,
  root: string,
): StudioInputs | undefined {
  try {
    if (!checkStudioInputPlacement(path, "--base", root, output)) return undefined;
    const graph: unknown = JSON.parse(readFileSync(path, "utf8"));
    return { base: { graph, label }, runs: [] };
  } catch {
    writeStderr(output, `sdp studio: --base ${JSON.stringify(path)} cannot be read as JSON.\n`);
    return undefined;
  }
}

export function readStudioRuns(
  paths: readonly string[],
  root: string,
  output: CliOutput,
  command = "studio",
): unknown[] | undefined {
  for (const path of paths)
    if (!checkStudioInputPlacement(path, "--runs", root, output)) return undefined;
  const runs: unknown[] = [];
  for (const path of paths) {
    try {
      runs.push(JSON.parse(readFileSync(path, "utf8")) as unknown);
    } catch {
      writeStderr(output, `sdp ${command}: cannot read --runs ${JSON.stringify(path)} as JSON.\n`);
      return undefined;
    }
  }
  return runs;
}

export function checkStudioInputPlacement(
  path: string,
  flag: "--base" | "--runs",
  root: string,
  output: CliOutput,
): boolean {
  const candidates = [
    resolve(path),
    join(physicalPath(dirname(path)), basename(path)),
    physicalPath(path),
  ];
  const owned = buildOwnedPaths;
  const overlaps = owned.some((entry) =>
    [resolve(root, entry), physicalPath(join(root, entry))].some((directory) =>
      candidates.some((candidate) => pathWithin(directory, candidate)),
    ),
  );
  // New registrar siblings are not in the previous manifest yet. Their reserved suffix is
  // build-owned anywhere under the extraction root, before extraction can discover the next set.
  const registrar = candidates.some(
    (candidate) =>
      pathWithin(physicalPath(root), candidate) &&
      /\.test\.generated\.ts(?:\.tmp)?$/u.test(candidate),
  );
  if (!overlaps && !registrar) return true;
  writeStderr(
    output,
    `sdp studio: ${flag} ${JSON.stringify(path)} is inside generated output or another path the build writes or removes; copy it outside build output before running studio.\n`,
  );
  return false;
}

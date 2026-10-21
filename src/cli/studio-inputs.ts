import { readFileSync, realpathSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import type { StudioInputs } from "../projections/studio/inputs.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

/**
 * @sdpAnchor impl:protocol.studio-base-input
 * @sdpSatisfies spec:consumers.spec-studio.data.inputs
 * @sdpComponent component:protocol.cli
 * @sdpRole codec
 */
export function readStudioBase(
  path: string,
  label: string | null,
  output: CliOutput,
  root: string,
): StudioInputs | undefined {
  try {
    const generated = join(realpathSync(root), "generated");
    let outputRoot = generated;
    try {
      outputRoot = realpathSync(generated);
    } catch {
      // A first build has no generated directory yet.
    }
    if (
      isWithin(join(root, "generated"), resolve(path)) ||
      isWithin(outputRoot, join(realpathSync(dirname(path)), basename(path))) ||
      isWithin(outputRoot, realpathSync(path))
    ) {
      writeStderr(
        output,
        `sdp studio: --base ${JSON.stringify(path)} is inside generated output; copy it outside ${JSON.stringify(generated)} before running studio.\n`,
      );
      return undefined;
    }
    const graph: unknown = JSON.parse(readFileSync(path, "utf8"));
    return { base: { graph, label }, runs: [] };
  } catch {
    writeStderr(output, `sdp studio: --base ${JSON.stringify(path)} cannot be read as JSON.\n`);
    return undefined;
  }
}

function isWithin(directory: string, file: string): boolean {
  const path = relative(directory, file);
  return path === "" || (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path));
}

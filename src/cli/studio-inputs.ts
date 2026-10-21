import { readFileSync } from "node:fs";
import type { StudioInputs } from "../projections/studio/inputs.js";
import type { CliOutput } from "./output.js";
import { writeStderr } from "./output.js";

/**
 * @sdpAnchor impl:protocol.studio-base-input
 * @sdpReferences spec:consumers.spec-studio.data.inputs
 * @sdpComponent component:protocol.cli
 * @sdpRole codec
 */
export function readStudioBase(
  path: string,
  label: string | null,
  output: CliOutput,
): StudioInputs | undefined {
  try {
    const graph: unknown = JSON.parse(readFileSync(path, "utf8"));
    return { base: { graph, label }, runs: [] };
  } catch {
    writeStderr(output, `sdp studio: --base ${JSON.stringify(path)} cannot be read as JSON.\n`);
    return undefined;
  }
}

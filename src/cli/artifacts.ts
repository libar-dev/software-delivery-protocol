import { rmSync } from "node:fs";

import type { CliOutput } from "./output.js";
import { errorMessage, writeStderr } from "./output.js";

export function removeArtifact(path: string, rm: typeof rmSync): string | undefined {
  try {
    rm(path, { recursive: true, force: true });
    return undefined;
  } catch (error) {
    const code = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;

    return code === "ENOENT" || code === "ENOTDIR" ? undefined : errorMessage(error);
  }
}

export function removeArtifacts(
  paths: readonly string[],
  output: CliOutput,
  command: string,
  rm: typeof rmSync,
): void {
  for (const path of paths) {
    const failure = removeArtifact(path, rm);

    if (failure !== undefined) {
      writeStderr(
        output,
        `sdp ${command}: stale ${path} could not be removed (${failure}) — do not read it as current.\n`,
      );
    }
  }
}

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { ExtractionResult } from "../../src/index.js";

/** Native Node supplies dynamic imports in query bodies, which Vitest's VM cannot load. */
export function nativeQuery(
  body: string,
  extraction: ExtractionResult,
  params: Readonly<Record<string, unknown>> = {},
): unknown {
  const script = `
import { readFileSync } from "node:fs";
import { runSdpCli } from "./dist/cli/sdp.js";
const {body, extraction, params} = JSON.parse(readFileSync(0, "utf8"));
const output = {stdout: process.stdout, stderr: process.stderr};
process.exitCode = await runSdpCli(["q", body, "--json", "--params", JSON.stringify(params)], output, {query: {extract: () => extraction}});
`;
  const output = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: fileURLToPath(new URL("../..", import.meta.url)),
    input: JSON.stringify({ body, extraction, params }),
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return JSON.parse(output) as unknown;
}

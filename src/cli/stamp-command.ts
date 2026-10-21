import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { schemaVersion } from "../graph/schema.js";
import { resolveExtractionRoot } from "./build-args.js";
import { errorMessage, writeStderr, writeStdout } from "./output.js";
import type { CliOutput } from "./output.js";

/**
 * @sdpAnchor impl:protocol.stamp-command
 * @sdpLabel writes the publishing stamp without extraction or rendering
 * @sdpReferences spec:consumers.spec-studio.sharing
 * @sdpComponent component:protocol.cli
 * @sdpUses impl:protocol.schema-version
 * @sdpRole publisher
 */
export function runStamp(args: readonly string[], output: CliOutput, engine: string): number {
  let root: string | undefined,
    commit = "unknown",
    source: string | undefined;
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index++) {
    const value = args[index];
    if (value === undefined) continue;
    if (value === "--commit" || value === "--source") {
      const next = args[++index];
      if (seen.has(value) || next === undefined || next.trim() === "" || next.startsWith("--")) {
        writeStderr(output, `sdp stamp: ${value} requires one value.\n`);
        return 1;
      }
      seen.add(value);
      if (value === "--commit") commit = next;
      else source = next;
    } else if (value.startsWith("--") || root !== undefined) {
      writeStderr(output, `sdp stamp: unexpected argument ${JSON.stringify(value)}.\n`);
      return 1;
    } else root = value;
  }
  if (source !== undefined) {
    let valid = false;
    try {
      const url = new URL(source);
      valid = ["http:", "https:"].includes(url.protocol) && source.includes("{file}");
    } catch {
      /* Invalid source URL. */
    }
    if (!valid) {
      writeStderr(output, "sdp stamp: --source requires an http(s) URL template holding {file}.\n");
      return 1;
    }
  }
  const resolved = resolveExtractionRoot(root, output, "stamp");
  if (resolved === undefined) return 1;
  const directory = join(resolved, "generated/spec-studio");
  if (!existsSync(join(directory, "index.html"))) {
    writeStderr(output, "sdp stamp: root holds no Studio page set.\n");
    return 1;
  }
  try {
    const stamp = {
      schemaVersion,
      corpusCommit: commit,
      engine,
      builtAt: new Date().toISOString().replace(/\.\d{3}Z$/u, "Z"),
      ...(source === undefined ? {} : { source }),
    };
    writeFileSync(join(directory, "stamp.json"), `${JSON.stringify(stamp)}\n`);
    writeStdout(output, `Wrote ${join(directory, "stamp.json")}\n`);
    return 0;
  } catch (error) {
    writeStderr(output, `sdp stamp: ${errorMessage(error)}\n`);
    return 1;
  }
}

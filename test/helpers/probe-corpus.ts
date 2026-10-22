import { writeFileSync } from "node:fs";
import { join } from "node:path";

/** Two related idea Specs avoid unrelated validator findings in CLI probes. */
export function writeProbeCorpus(root: string, outcome = "Probe the command line."): void {
  for (const [name, relation] of [
    ["first", "{}"],
    ["second", "{refines: spec:probe.first}"],
  ] as const) {
    writeFileSync(
      join(root, `${name}.sdp.md`),
      `---\nid: spec:probe.${name}\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: ${relation}\n---\n# Probe ${name}\n\n## Intent\n- outcome: ${outcome}\n`,
    );
  }
}

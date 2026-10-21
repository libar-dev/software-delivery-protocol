import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { schemaVersion } from "../src/graph/schema.js";
import { createReader } from "../src/reader/reader.js";
import { createStudioData } from "../src/projections/studio/data.js";

const root = fileURLToPath(new URL("..", import.meta.url));

it("evaluates S3's recipe 46 and S2's recipe 51 in the shared Studio build", async () => {
  const data = await createStudioData(createReader({ schemaVersion, nodes: [], edges: [] }));
  for (const number of [46, 51]) {
    expect(data.recipes.all.has(number)).toBe(true);
  }
});

interface Measurement {
  name: string;
  command: string[];
  portableCommand?: string[];
}

it("records future measurement commands as run and provides portable commands separately", () => {
  const scratch = mkdtempSync(join(tmpdir(), "sdp-measure-evidence-"));
  try {
    const [base, head, platform] = ["base", "head", "platform"].map((name) => join(scratch, name));
    for (const engine of [base, head]) {
      if (engine === undefined) throw new Error("Expected a probe engine.");
      mkdirSync(join(engine, "dist/cli"), { recursive: true });
      writeFileSync(
        join(engine, "dist/cli/sdp.js"),
        `const fs = require("node:fs"); const path = require("node:path"); const root = path.join(process.argv[3], "generated/spec-studio"); fs.mkdirSync(root, {recursive:true}); fs.writeFileSync(path.join(root, "architecture.html"), "<html></html>");`,
      );
    }
    if (base === undefined || head === undefined || platform === undefined)
      throw new Error("Expected probe paths.");
    const run = spawnSync(
      process.execPath,
      [join(root, "reviews/assets/plan46-s1/measure.mjs"), base, head, platform],
      { encoding: "utf8" },
    );
    expect({ status: run.status, error: run.error }).toEqual({ status: 0, error: undefined });
    const evidence = JSON.parse(run.stdout) as { measurements: Measurement[] };
    expect(evidence.measurements).toHaveLength(12);
    for (const row of evidence.measurements) {
      const engine = row.name.startsWith("base-") ? base : head;
      const portableEngine = row.name.startsWith("base-") ? "$BASE" : "$HEAD";
      const protocol = row.name.endsWith("-repository");
      expect(row.command.slice(0, 4)).toEqual([
        process.execPath,
        join(engine, "dist/cli/sdp.js"),
        "studio",
        protocol ? engine : platform,
      ]);
      expect(row.portableCommand).toEqual([
        "node",
        `${portableEngine}/dist/cli/sdp.js`,
        "studio",
        protocol ? portableEngine : "$PLATFORM",
        ...row.command.slice(4),
      ]);
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});

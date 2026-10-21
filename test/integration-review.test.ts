import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

it("cites the carrying Specs for every marker form in the glossary", () => {
  const glossary = readFileSync(join(root, "CONTEXT.md"), "utf8");
  const marker = glossary.split("\n").find((line) => line.startsWith("| **marker** |"));
  for (const spec of [
    "spec:model.open-question-keys",
    "spec:model.rule-keys",
    "spec:carrier.step-keys",
    "spec:model.term-addresses",
  ])
    expect(marker).toContain(spec);
});

interface Measurement {
  name: string;
  command: string[];
  portableCommand?: string[];
}

it("preserves the original S1 measurement commands with the measured Node binary and paths", () => {
  const evidence = JSON.parse(
    readFileSync(join(root, "reviews/assets/plan46-s1/measurements.json"), "utf8"),
  ) as { measurements: Measurement[] };
  expect(evidence.measurements).toHaveLength(12);
  for (const row of evidence.measurements) {
    const engine = row.name.startsWith("base-")
      ? "/tmp/s1-base-corpus"
      : "/Users/darkomijic/dev-libar/sdp-plan46-lanes/build-s1";
    const protocol = row.name.endsWith("-repository");
    expect(row.command).toEqual([
      "/opt/homebrew/Cellar/node@24/24.21.0/bin/node",
      `${engine}/dist/cli/sdp.js`,
      "studio",
      protocol ? engine : "/tmp/s1-platform",
      ...(protocol
        ? [
            "--exclude",
            "explorations",
            "--exclude",
            "examples",
            "--exclude",
            "test/fixtures/import/parity",
          ]
        : []),
    ]);
  }
});

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

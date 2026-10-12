import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { deriveTypeScriptImports } from "../src/adapters/typescript-imports.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { extract, serializeGraph } from "../src/index.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const importsTestAnchor = specTest({
  id: testAnchorId("test:protocol.curation-imports"),
  verifies: ref("spec:consumers.impact-graph.curation-assist"),
});
void importsTestAnchor;

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function withFixture(run: (root: string) => void): void {
  const root = mkdtempSync(join(repoRoot, "explorations", ".curation-imports-"));
  try {
    const files = {
      "tsconfig.json": JSON.stringify({
        compilerOptions: {
          moduleResolution: "bundler",
          module: "esnext",
          paths: { "@core/*": ["./code/*"] },
        },
        include: ["other/**/*.ts"],
      }),
      "imports.config.json": JSON.stringify({
        adapter: "typescript",
        tsconfig: "tsconfig.json",
        roots: ["code"],
      }),
      "code/a.ts":
        'import { value } from "@core/index.js"; import type { Shape } from "./leaf.js"; import "./leaf.js"; import "../other/outside.js"; import "missing-package"; export { value };',
      "code/index.ts": 'export * from "./nested.js";',
      "code/nested.ts": 'export { value } from "./leaf.js"; export * from "./index.js";',
      "code/leaf.ts": "export const value = 1; export interface Shape {}",
      "code/idle.tsx": "export const idle = 1;",
      "code/legacy.cts": 'import leaf = require("./leaf.js"); export = leaf;',
      "other/outside.ts": "export const outside = 1;",
    };
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe("TypeScript curation imports", () => {
  it("resolves aliases, JS specifiers, types, side effects, import equals and cyclic barrels within configured roots", () => {
    withFixture((root) => {
      expect(deriveTypeScriptImports(root, "imports.config.json")).toEqual({
        schema: "sdp-imports/1",
        adapter: "typescript",
        files: [
          { file: "code/a.ts", imports: ["code/index.ts", "code/leaf.ts", "code/nested.ts"] },
          { file: "code/idle.tsx", imports: [] },
          { file: "code/index.ts", imports: ["code/index.ts", "code/leaf.ts", "code/nested.ts"] },
          { file: "code/leaf.ts", imports: [] },
          { file: "code/legacy.cts", imports: ["code/leaf.ts"] },
          { file: "code/nested.ts", imports: ["code/index.ts", "code/leaf.ts", "code/nested.ts"] },
        ],
      });
    });
  });

  it("sorts paths by code unit, includes empty files, and deduplicates overlapping roots", () => {
    withFixture((root) => {
      mkdirSync(join(root, "code", "sub"));
      writeFileSync(join(root, "code", "Z.mts"), "");
      writeFileSync(join(root, "code", "sub", "é.ts"), "");
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          adapter: "typescript",
          tsconfig: "tsconfig.json",
          roots: ["code/sub", "code", "code"],
        }),
      );
      const first = deriveTypeScriptImports(root, "imports.config.json");
      expect(first.files.map((entry) => entry.file)).toEqual([
        "code/Z.mts",
        "code/a.ts",
        "code/idle.tsx",
        "code/index.ts",
        "code/leaf.ts",
        "code/legacy.cts",
        "code/nested.ts",
        "code/sub/é.ts",
      ]);
      expect(first).toEqual(deriveTypeScriptImports(root, "imports.config.json"));
    });
  });

  it.each([
    {},
    { adapter: "other", tsconfig: "tsconfig.json", roots: ["code"] },
    { adapter: "typescript", tsconfig: "tsconfig.json", roots: [] },
    { adapter: "typescript", tsconfig: "tsconfig.json", roots: [1] },
    { adapter: "typescript", tsconfig: "../tsconfig.json", roots: ["code"] },
    { adapter: "typescript", tsconfig: "tsconfig.json", roots: ["../"] },
    { adapter: "typescript", tsconfig: "tsconfig.json", roots: ["/src"] },
  ])("refuses invalid configuration %j", (config) => {
    withFixture((root) => {
      writeFileSync(join(root, "imports.config.json"), JSON.stringify(config));
      expect(() => deriveTypeScriptImports(root, "imports.config.json")).toThrow(
        /imports configuration/u,
      );
    });
  });

  it("builds the imports file atomically and leaves the curated graph byte-identical", () => {
    withFixture((root) => {
      const before = serializeGraph(extract({ root }).graph);
      const capture = createCaptureOutput();
      expect(
        runSdpCli(
          ["build", root, "--imports", "imports.config.json", "--check-clean"],
          capture.output,
        ),
      ).toBe(0);
      const path = join(root, "generated", "imports.json");
      const bytes = readFileSync(path, "utf8");
      expect(JSON.parse(bytes)).toEqual(deriveTypeScriptImports(root, "imports.config.json"));
      expect(bytes).toBe(
        `${JSON.stringify(deriveTypeScriptImports(root, "imports.config.json"), null, 2)}\n`,
      );
      expect(existsSync(`${path}.tmp`)).toBe(false);
      expect(capture.readStdout()).toContain(`Wrote ${path} (external inferred input)`);
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toBe(before);
      expect(serializeGraph(extract({ root }).graph)).toBe(before);
      const query = createCaptureOutput();
      writeFileSync(path, "not JSON");
      expect(runSdpCli(["validate", root], query.output)).toBe(0);
      expect(serializeGraph(extract({ root }).graph)).toBe(before);
    });
  }, 20_000);

  it("writes no imports file without the flag and preserves an existing file even on build failure", () => {
    withFixture((root) => {
      const path = join(root, "generated", "imports.json");
      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);
      expect(existsSync(path)).toBe(false);
      writeFileSync(path, "keep these bytes");
      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);
      expect(readFileSync(path, "utf8")).toBe("keep these bytes");
      writeFileSync(join(root, "broken.sdp.md"), "---\ninvalid: yes\n---\n# Broken\n");
      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(1);
      expect(readFileSync(path, "utf8")).toBe("keep these bytes");
    });
  }, 20_000);

  it("removes requested stale imports after a configuration or extraction failure", () => {
    withFixture((root) => {
      const path = join(root, "generated", "imports.json");
      expect(
        runSdpCli(
          ["build", root, "--imports", "imports.config.json"],
          createCaptureOutput().output,
        ),
      ).toBe(0);
      writeFileSync(join(root, "imports.config.json"), "{}");
      const capture = createCaptureOutput();
      expect(runSdpCli(["build", root, "--imports", "imports.config.json"], capture.output)).toBe(
        1,
      );
      expect(capture.readStderr()).toContain("imports configuration");
      expect(existsSync(path)).toBe(false);
      expect(existsSync(`${path}.tmp`)).toBe(false);
      writeFileSync(path, "stale");
      writeFileSync(join(root, "broken.sdp.md"), "---\ninvalid: yes\n---\n# Broken\n");
      expect(
        runSdpCli(
          ["build", root, "--imports", "imports.config.json"],
          createCaptureOutput().output,
        ),
      ).toBe(1);
      expect(existsSync(path)).toBe(false);
    });
  }, 20_000);

  it.each([
    ["build", "--imports"],
    ["build", "--imports", "--check-clean"],
    ["build", "--imports", ""],
    ["build", "--imports", "a.json", "--imports", "b.json"],
    ...["validate", "view", "census", "mermaid", "gherkin"].map((command) => [
      command,
      "--imports",
      "a.json",
    ]),
  ])("refuses invalid build flag argv %j", (...args) => {
    const capture = createCaptureOutput();
    expect(runSdpCli(args, capture.output)).toBe(1);
    expect(capture.readStderr()).toContain("--imports");
  });

  it("completes over the repository src and lists a known build-command import", () => {
    withFixture((root) => {
      const configPath = join(root, "repo-imports.json");
      writeFileSync(
        configPath,
        JSON.stringify({ adapter: "typescript", tsconfig: "tsconfig.json", roots: ["src"] }),
      );
      const result = deriveTypeScriptImports(repoRoot, configPath);
      expect(result.files.length).toBeGreaterThan(0);
      expect(
        result.files.find((entry) => entry.file === "src/cli/build-command.ts")?.imports,
      ).toContain("src/extract/index.ts");
      expect(result.files.every((entry) => entry.file.startsWith("src/"))).toBe(true);
    });
  }, 20_000);
});

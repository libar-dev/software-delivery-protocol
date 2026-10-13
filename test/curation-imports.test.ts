import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, win32 } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import {
  deriveTypeScriptImports,
  includedSourcePaths,
  rootRelativePath,
} from "../src/adapters/typescript-imports.js";
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
  it("compares Windows source paths in the form the compiler returns them", () => {
    const files = ["C:/repo/src/a.ts", "C:/repo/src/generated/b.ts", "C:/repo/srcx/c.ts"];

    expect(rootRelativePath("C:\\repo", "C:/repo/src/a.ts", win32)).toBe("src/a.ts");
    expect([...includedSourcePaths("C:\\repo", files, [], win32)]).toEqual(files);
    expect([...includedSourcePaths("C:\\repo", files, ["src/generated"], win32)]).toEqual([
      "C:/repo/src/a.ts",
      "C:/repo/srcx/c.ts",
    ]);
  });

  it("resolves aliases, JS specifiers, types, side effects, import equals and cyclic barrels within configured roots", () => {
    withFixture((root) => {
      expect(deriveTypeScriptImports(root, "imports.config.json")).toEqual({
        schema: "sdp-imports/1",
        adapter: "typescript",
        exclude: [],
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

  it("follows re-exports through files outside the roots but never follows ordinary transitive imports", () => {
    withFixture((root) => {
      writeFileSync(join(root, "code", "index.ts"), 'export * from "../other/outside.js";');
      writeFileSync(join(root, "other", "outside.ts"), 'export * from "../code/leaf.js";');
      writeFileSync(join(root, "code", "leaf.ts"), 'import "./idle.js"; export const value = 1;');
      const result = deriveTypeScriptImports(root, "imports.config.json");
      expect(result.files.find((entry) => entry.file === "code/a.ts")?.imports).toEqual([
        "code/index.ts",
        "code/leaf.ts",
      ]);
      expect(result.files.find((entry) => entry.file === "code/leaf.ts")?.imports).toEqual([
        "code/idle.tsx",
      ]);
      expect(result.files.some((entry) => entry.file.startsWith("other/"))).toBe(false);
    });
  });

  it("reads literal dynamic imports and import types, and skips computed specifiers", () => {
    withFixture((root) => {
      // One form per file, so each form's resolution is tested on its own.
      writeFileSync(
        join(root, "code", "idle.tsx"),
        'export type Leaf = import("./leaf.js").Shape;',
      );
      writeFileSync(
        join(root, "code", "lazy.ts"),
        'export const load = () => import("@core/index.js"); const name = "./a.js"; export const computed = () => import(name);',
      );
      writeFileSync(
        join(root, "code", "later.ts"),
        "export const later = () => import(`./legacy.cjs`);",
      );
      const imports = (file: string) =>
        deriveTypeScriptImports(root, "imports.config.json").files.find(
          (entry) => entry.file === file,
        )?.imports;
      expect(imports("code/idle.tsx")).toEqual(["code/leaf.ts"]);
      expect(imports("code/lazy.ts")).toEqual(["code/index.ts", "code/leaf.ts", "code/nested.ts"]);
      expect(imports("code/later.ts")).toEqual(["code/legacy.cts"]);
    });
  });

  it("excludes exact files and subtrees with segment boundaries and normalized metadata", () => {
    withFixture((root) => {
      mkdirSync(join(root, "code", "sub"));
      mkdirSync(join(root, "code", "submarine"));
      writeFileSync(join(root, "code", "sub", "hidden.ts"), "export const hidden = 1;");
      writeFileSync(join(root, "code", "submarine", "kept.ts"), "export const kept = 1;");
      writeFileSync(join(root, "code", "leaf.ts.extra.ts"), "export const extra = 1;");
      writeFileSync(
        join(root, "code", "idle.tsx"),
        'import "./sub/hidden.js"; import "./submarine/kept.js";',
      );
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          adapter: "typescript",
          tsconfig: "tsconfig.json",
          roots: ["code"],
          exclude: ["code/sub", "code/leaf.ts", "code/sub"],
        }),
      );
      const first = deriveTypeScriptImports(root, "imports.config.json");
      expect(first).toMatchObject({ exclude: ["code/leaf.ts", "code/sub"] });
      expect(first.files.map(({ file }) => file)).toEqual([
        "code/a.ts",
        "code/idle.tsx",
        "code/index.ts",
        "code/leaf.ts.extra.ts",
        "code/legacy.cts",
        "code/nested.ts",
        "code/submarine/kept.ts",
      ]);
      expect(first.files.find(({ file }) => file === "code/a.ts")?.imports).toEqual([
        "code/index.ts",
        "code/nested.ts",
      ]);
      expect(first.files.find(({ file }) => file === "code/idle.tsx")?.imports).toEqual([
        "code/submarine/kept.ts",
      ]);
      expect(first.files.flatMap(({ imports }) => imports)).not.toContain("code/leaf.ts");
      expect(first).toEqual(deriveTypeScriptImports(root, "imports.config.json"));
    });
  });

  it("resolves barrel reach through excluded intermediates without emitting them", () => {
    withFixture((root) => {
      writeFileSync(
        join(root, "code", "a.ts"),
        'import { value } from "./index.js"; export { value };',
      );
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          adapter: "typescript",
          tsconfig: "tsconfig.json",
          roots: ["code"],
          exclude: ["code/nested.ts", "code/index.ts"],
        }),
      );
      const result = deriveTypeScriptImports(root, "imports.config.json");
      expect(result.files.map(({ file }) => file)).not.toContain("code/index.ts");
      expect(result.files.map(({ file }) => file)).not.toContain("code/nested.ts");
      expect(result.files.find(({ file }) => file === "code/a.ts")?.imports).toEqual([
        "code/leaf.ts",
      ]);
    });
  });

  it("accepts empty exclusions and normalizes root-relative exclusion spellings", () => {
    withFixture((root) => {
      const config = { adapter: "typescript", tsconfig: "tsconfig.json", roots: ["code"] };
      const unfiltered = deriveTypeScriptImports(root, "imports.config.json");
      writeFileSync(join(root, "imports.config.json"), JSON.stringify({ ...config, exclude: [] }));
      expect(deriveTypeScriptImports(root, "imports.config.json")).toEqual(unfiltered);
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          ...config,
          exclude: ["./code/idle.tsx", "code/./idle.tsx", "code/missing/"],
        }),
      );
      const result = deriveTypeScriptImports(root, "imports.config.json");
      expect(result).toMatchObject({ exclude: ["code/idle.tsx", "code/missing"] });
      expect(result.files.some(({ file }) => file === "code/idle.tsx")).toBe(false);
    });
  });

  it.each([
    { extra: true },
    { exclude: null },
    { exclude: "code" },
    { exclude: [1] },
    ...[
      "",
      " ",
      ".",
      "./",
      "../other",
      "code/../../other",
      "/code",
      "C:/code",
      "C:code",
      "code\\leaf.ts",
    ].map((path) => ({ exclude: [path] })),
  ])("refuses invalid exclusion configuration %j", (options) => {
    withFixture((root) => {
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          adapter: "typescript",
          tsconfig: "tsconfig.json",
          roots: ["code"],
          ...options,
        }),
      );
      expect(() => deriveTypeScriptImports(root, "imports.config.json")).toThrow(
        /imports configuration/u,
      );
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

  it.each(["missing", "code/leaf.ts"])(
    "refuses the source root %s by its configured path",
    (path) => {
      withFixture((root) => {
        writeFileSync(
          join(root, "imports.config.json"),
          JSON.stringify({ adapter: "typescript", tsconfig: "tsconfig.json", roots: [path] }),
        );
        expect(() => deriveTypeScriptImports(root, "imports.config.json")).toThrow(
          `imports source root "${join(root, path)}" is not a directory`,
        );
      });
    },
  );

  it("builds the imports file atomically and leaves the curated graph byte-identical", () => {
    withFixture((root) => {
      writeFileSync(
        join(root, "imports.config.json"),
        JSON.stringify({
          adapter: "typescript",
          tsconfig: "tsconfig.json",
          roots: ["code"],
          exclude: ["code/index.ts"],
        }),
      );
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

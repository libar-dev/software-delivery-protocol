import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function git(root: string, args: readonly string[]): void {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
}

function fixture(sourcePath: string, source: string): string {
  const scratch = join(repoRoot, ".tmp-scratch");
  mkdirSync(scratch, { recursive: true });
  const root = mkdtempSync(join(scratch, "adopted-registrar-"));
  for (const path of [
    "dist",
    "specs",
    "src",
    "test",
    "generated",
    "examples/checkout-v1/specs",
    "examples/checkout-v1/src",
    "examples/checkout-v1/test",
    "examples/checkout-v1/generated",
  ]) {
    mkdirSync(join(root, path), { recursive: true });
  }
  for (const path of ["preflight.mjs", "preflight-registrars.mjs"]) {
    copyFileSync(join(repoRoot, path), join(root, path));
  }
  symlinkSync(join(repoRoot, "node_modules"), join(root, "node_modules"), "dir");
  writeFileSync(join(root, "package.json"), '{"type":"module"}\n');
  writeFileSync(
    join(root, ".gitignore"),
    "generated/\ndist/\nnode_modules/\n**/*.test.generated.ts\n",
  );
  // Isolate preflight's Git-index guard from the independent regeneration check.
  writeFileSync(
    join(root, "projection-suite.mjs"),
    `import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const root = process.argv[2];
mkdirSync(join(root, "generated"), { recursive: true });
const files = existsSync(join(root, "test/example.test.generated.ts")) ? ["test/example.test.generated.ts"] : [];
writeFileSync(join(root, "generated/registrars.json"), JSON.stringify({ version: 1, files }));
`,
  );
  writeFileSync(
    join(root, "generated/registrars.json"),
    JSON.stringify({
      version: 1,
      files: ["test/example.test.generated.ts"],
    }),
  );
  writeFileSync(
    join(root, "examples/checkout-v1/generated/registrars.json"),
    JSON.stringify({
      version: 1,
      files: [],
    }),
  );
  writeFileSync(join(root, sourcePath), source);
  writeFileSync(
    join(root, "test/example.test.generated.ts"),
    "export const register = () => {};\n",
  );
  git(root, ["init", "--quiet"]);
  git(root, ["add", "."]);
  return root;
}

function preflight(root: string): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [join(root, "preflight.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
}

describe("preflight adopted registrar tracking", () => {
  it.each([
    ["test/authored.ts", 'import { register } from "./example.test.generated.js";'],
    ["test/authored.mts", 'import { register } from "./example.test.generated";'],
    ["src/authored.mjs", 'import { register } from "../test/example.test.generated.js";'],
    ["test/authored.tsx", 'import { register } from "./example.test.generated.js";'],
    ["test/authored.cts", 'import { register } from "./example.test.generated.js";'],
    ["test/authored.js", 'import { register } from "./example.test.generated.js";'],
    ["test/authored.cjs", 'const { register } = require("./example.test.generated.js");'],
  ])("refuses an ignored registrar imported by tracked %s", (path, source) => {
    const root = fixture(path, `${source}\n`);
    try {
      const result = preflight(root);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        "preflight: adopted registrar imported by tracked code is not tracked: test/example.test.generated.ts",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("accepts a tracked registrar and ignores imports in comments and strings", () => {
    const root = fixture(
      "test/authored.ts",
      `import { register } from "./example.test.generated.js";
// import "./missing.test.generated.js";
const text = 'import "./missing.test.generated.js"';
`,
    );
    try {
      git(root, ["add", "--force", "test/example.test.generated.ts"]);
      const result = preflight(root);
      expect(result.status, String(result.stderr)).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("ignores adoption imports inside generated registrars", () => {
    const root = fixture("test/authored.ts", "export {};\n");
    try {
      writeFileSync(
        join(root, "test/example.test.generated.ts"),
        'import "./missing.test.generated.js";\n',
      );
      git(root, ["add", "--force", "test/example.test.generated.ts"]);
      const result = preflight(root);
      expect(result.status, String(result.stderr)).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

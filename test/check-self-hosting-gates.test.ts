import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const guardPath = join(repoRoot, "check-self-hosting-gates.mjs");
const roots: string[] = [];
const copiedPaths = [
  "AGENTS.md",
  "CONTEXT.md",
  "package.json",
  "docs/concept/DECISIONS.md",
  ["plans", "16-carrier-ruling.md"].join("/"),
  ["plans", "17-self-hosting-v1.md"].join("/"),
  ["plans", "18-self-hosting-phase-2.md"].join("/"),
  ["plans", "23-outward-turn-origin-adoption.md"].join("/"),
] as const;

function copyRecordTree(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-gates-"));
  roots.push(root);

  for (const path of copiedPaths) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(join(repoRoot, path), join(root, path));
  }

  return root;
}

function runGuard(root: string) {
  return spawnSync(process.execPath, [guardPath, root], { encoding: "utf8" });
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("the self-hosting records gate", () => {
  it("accepts the current record without requiring the historical ledger shape", () => {
    const result = runGuard(copyRecordTree());

    expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
  });

  it("fails when a frozen historical owner-packet pin is broken", () => {
    const root = copyRecordTree();
    const path = join(root, "plans", "17-self-hosting-v1.md");
    const source = readFileSync(path, "utf8");
    writeFileSync(
      path,
      source.replace(
        "aca79090529c2f6625ceafc78f33e16da81bfcb1",
        "0000000000000000000000000000000000000000",
      ),
    );

    const result = runGuard(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Gate 1 ledger SHA disagrees with the owner packet");
  });

  it("fails when the handbook carries a stale current-plan status", () => {
    const root = copyRecordTree();
    const path = join(root, "AGENTS.md");
    const source = readFileSync(path, "utf8");
    writeFileSync(path, source.replace("plan 23 is EXECUTED", "plan 22 is DRAFTED"));

    const result = runGuard(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("the handbook does not name the current primary plan");
    expect(result.stderr).toContain("the handbook status disagrees with the current primary plan");
  });
});

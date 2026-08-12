import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const guardPath = join(repoRoot, "check-self-hosting-gates.mjs");
const roots: string[] = [];
const primaryPlans = readdirSync(join(repoRoot, "plans"), { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => {
    const match = /^(?<number>\d+)-[a-z0-9][a-z0-9-]*\.md$/u.exec(entry.name);
    const number = match?.groups?.number;
    return number === undefined ? null : { name: entry.name, number: Number(number) };
  })
  .filter((entry) => entry !== null)
  .sort((left, right) => right.number - left.number);
const currentPlan = primaryPlans[0];

if (currentPlan === undefined) {
  throw new Error("test fixture requires a current primary-numbered plan");
}

const currentPlanPath = ["plans", currentPlan.name].join("/");
const currentPlanSource = readFileSync(join(repoRoot, currentPlanPath), "utf8");
const currentStatus = /\b(DRAFTED|EXECUTING|RUN|EXECUTED)\b/u.exec(
  currentPlanSource.split("\n").find((line) => line.startsWith("> **Status:**")) ?? "",
)?.[1];

if (currentStatus === undefined) {
  throw new Error(`${currentPlanPath} has no readable status`);
}

const copiedPaths = [
  "AGENTS.md",
  "CONTEXT.md",
  "package.json",
  "docs/concept/DECISIONS.md",
  ["plans", "16-carrier-ruling.md"].join("/"),
  ["plans", "17-self-hosting-v1.md"].join("/"),
  ["plans", "18-self-hosting-phase-2.md"].join("/"),
  currentPlanPath,
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

  it("selects a zero-padded primary plan over a lower unpadded number", () => {
    const root = copyRecordTree();
    const nextPlanPath = join(root, "plans", "026-next.md");
    writeFileSync(nextPlanPath, "> **Status:** ✅ EXECUTED — selector probe\n", "utf8");
    const handbook = join(root, "AGENTS.md");
    writeFileSync(
      handbook,
      readFileSync(handbook, "utf8").replaceAll(
        `plan ${String(currentPlan.number)} is ${currentStatus}`,
        "plan 26 is EXECUTED",
      ),
      "utf8",
    );

    const result = runGuard(root);

    expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
  });

  it("ignores a letter-suffixed plan when selecting the current primary", () => {
    const root = copyRecordTree();
    writeFileSync(
      join(root, "plans", `${String(currentPlan.number + 1)}a-notes.md`),
      "> **Status:** DRAFTED — letter-suffix probe\n",
      "utf8",
    );

    const result = runGuard(root);

    expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
  });

  it("fails when the handbook carries a stale current-plan status", () => {
    const root = copyRecordTree();
    const path = join(root, "AGENTS.md");
    const source = readFileSync(path, "utf8");
    writeFileSync(
      path,
      source.replace(
        `plan ${String(currentPlan.number)} is ${currentStatus}`,
        `plan ${String(currentPlan.number - 1)} is DRAFTED`,
      ),
    );

    const result = runGuard(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("the handbook does not name the current primary plan");
    expect(result.stderr).toContain("the handbook status disagrees with the current primary plan");
  });
});

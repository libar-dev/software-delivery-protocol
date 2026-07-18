import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const guardName = "check-temporal.mjs";
const bannedToken = [
  "Session",
  "[ -]",
  "[0-9]",
  "|",
  "Wave",
  "[- ]",
  "[A-Z]",
  "|",
  "Fold-",
  "[A-Z]",
  "|",
  "deferred",
  "In",
  "Session",
  "|",
  "plans",
  "/",
  "[0-9]+",
  "|",
  "20",
  "[0-9]{2}",
  "-",
  "[0-9]{2}",
  "-",
  "[0-9]{2}",
].join("");
const selfLine = `  "${bannedToken}";`;

function runGit(root: string, args: readonly string[]): void {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr);
  }
}

function createRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-temporal-"));
  copyFileSync(join(repoRoot, guardName), join(root, guardName));
  writeFileSync(join(root, ".gitignore"), "generated/\n", "utf8");
  runGit(root, ["init", "--quiet"]);
  runGit(root, ["add", guardName, ".gitignore"]);

  return root;
}

function runGuard(root: string) {
  return spawnSync(process.execPath, [join(root, guardName)], {
    cwd: root,
    encoding: "utf8",
  });
}

function withRoot(assertion: (root: string) => void): void {
  const root = createRoot();

  try {
    assertion(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writeExcludedFile(root: string, path: string): void {
  mkdirSync(join(root, path, ".."), { recursive: true });
  writeFileSync(join(root, path), bannedToken, "utf8");
}

describe("check:temporal", () => {
  it("fails for banned content in a nonignored untracked file", () => {
    withRoot((root) => {
      writeFileSync(join(root, "untracked.txt"), bannedToken, "utf8");

      const result = runGuard(root);

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("untracked.txt:1");
    });
  });

  it("does not scan ignored generated output", () => {
    withRoot((root) => {
      mkdirSync(join(root, "generated"), { recursive: true });
      writeFileSync(join(root, "generated", "control.txt"), bannedToken, "utf8");

      expect(runGuard(root).status).toBe(0);
    });
  });

  it("keeps each explicit temporal genre exclusion", () => {
    withRoot((root) => {
      writeExcludedFile(root, "docs/concept/DECISIONS.md");
      writeExcludedFile(root, "plans/record.md");
      writeExcludedFile(root, "reviews/record.md");
      writeExcludedFile(root, "explorations/record.md");
      writeExcludedFile(root, "package-lock.json");

      expect(runGuard(root).status).toBe(0);
    });
  });

  it("fails closed when file enumeration fails", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-temporal-no-git-"));

    try {
      copyFileSync(join(repoRoot, guardName), join(root, guardName));

      const result = runGuard(root);

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("file enumeration failed");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("fails closed when an enumerated file cannot be read", () => {
    withRoot((root) => {
      writeFileSync(join(root, "unreadable.txt"), "ordinary content", "utf8");
      runGit(root, ["add", "unreadable.txt"]);
      rmSync(join(root, "unreadable.txt"));

      const result = runGuard(root);

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("could not read unreadable.txt");
    });
  });

  it("allows only the one byte-exact self-pattern line in the guard", () => {
    withRoot((root) => {
      expect(runGuard(root).status).toBe(0);
    });
  });

  it("fails when the self-pattern line has leading whitespace", () => {
    withRoot((root) => {
      const script = join(root, guardName);
      writeFileSync(script, readFileSync(script, "utf8").replace(selfLine, ` ${selfLine}`), "utf8");

      expect(runGuard(root).status).not.toBe(0);
    });
  });

  it("fails when the self-pattern line has trailing whitespace", () => {
    withRoot((root) => {
      const script = join(root, guardName);
      writeFileSync(script, readFileSync(script, "utf8").replace(selfLine, `${selfLine} `), "utf8");

      expect(runGuard(root).status).not.toBe(0);
    });
  });

  it("fails when the exact self-pattern line appears in another file", () => {
    withRoot((root) => {
      writeFileSync(join(root, "copied.mjs"), selfLine, "utf8");

      expect(runGuard(root).status).not.toBe(0);
    });
  });

  it("fails when the guard contains two exact self-pattern lines", () => {
    withRoot((root) => {
      const script = join(root, guardName);
      writeFileSync(script, `${readFileSync(script, "utf8")}\n${selfLine}\n`, "utf8");

      expect(runGuard(root).status).not.toBe(0);
    });
  });

  it("fails when adjacent content shares the self-pattern line", () => {
    withRoot((root) => {
      const script = join(root, guardName);
      writeFileSync(
        script,
        readFileSync(script, "utf8").replace(selfLine, `${selfLine} adjacent`),
        "utf8",
      );

      expect(runGuard(root).status).not.toBe(0);
    });
  });
});

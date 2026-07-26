import {
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import type { ImportResult } from "../src/index.js";

const caseProbeRoot = mkdtempSync(join(tmpdir(), "sdp-import-case-probe-"));
writeFileSync(join(caseProbeRoot, "ProbeCase.sdp.ts"), "probe\n");
const caseInsensitive = existsSync(join(caseProbeRoot, "probecase.sdp.ts"));
rmSync(caseProbeRoot, { force: true, recursive: true });

function captureOutput() {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    output: {
      stdout: { write: (chunk: string) => stdout.push(chunk) },
      stderr: { write: (chunk: string) => stderr.push(chunk) },
    },
    stdout: () => stdout.join(""),
    stderr: () => stderr.join(""),
  };
}

function emitted(path: string): ImportResult {
  return {
    emitted: { path: path.replace(/\.sdp\.ts$/u, ".sdp.md"), content: "# Imported\n" },
    findings: [],
  };
}

function refused(path: string): ImportResult {
  return {
    findings: [
      {
        validatorId: "import/refusal",
        family: "conformance",
        severity: "error" as const,
        message: "refused",
        file: path,
        line: 1,
      },
    ],
  };
}

describe("review-08 import regressions", () => {
  it("skips tooling and dot directories without following directory symlinks", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-bounded-"));
    const valid = join(root, "valid.sdp.ts");
    const ignored = ["node_modules", "dist", "generated", "coverage", ".hidden"];
    writeFileSync(valid, "source\n");

    for (const directory of ignored) {
      mkdirSync(join(root, directory), { recursive: true });
      writeFileSync(join(root, directory, `${directory.replaceAll(".", "")}.sdp.ts`), "ignored\n");
    }
    symlinkSync(root, join(root, "cycle"));

    try {
      const result = runSdpCli(["import", root], captureOutput().output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(0);
      expect(existsSync(join(root, "valid.sdp.md"))).toBe(true);
      for (const directory of ignored) {
        expect(existsSync(join(root, directory, `${directory.replaceAll(".", "")}.sdp.md`))).toBe(
          false,
        );
      }
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("collects every source refusal and publishes nothing", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-collect-"));
    for (const name of ["bad-a", "bad-b", "bad-c", "good"]) {
      writeFileSync(join(root, `${name}.sdp.ts`), "source\n");
    }

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", root], capture.output, {
        import: {
          importTypeScriptSpec: (_source, path) =>
            path.includes("bad-") ? refused(path) : emitted(path),
        },
      });

      expect(result).toBe(1);
      expect(capture.stderr().match(/import\/refusal/gu)).toHaveLength(3);
      expect(existsSync(join(root, "good.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("collects a canonicalization failure and still plans healthy siblings", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-canonical-failure-"));
    const failedSource = join(root, "a.sdp.ts");
    const healthySource = join(root, "b.sdp.ts");
    const importedPaths: string[] = [];
    writeFileSync(failedSource, "a\n");
    writeFileSync(healthySource, "b\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", root], capture.output, {
        import: {
          realpathSync: (path) => {
            if (path === failedSource) {
              throw new Error("canonicalization denied");
            }
            return realpathSync(path);
          },
          importTypeScriptSpec: (_source, path) => {
            importedPaths.push(path);
            return emitted(path);
          },
        },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain(`${failedSource} — canonicalization denied`);
      expect(importedPaths).toEqual([realpathSync(healthySource)]);
      expect(existsSync(join(root, "b.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("deduplicates physical sources before dry-run and publication", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-dedupe-"));
    const realDirectory = join(root, "real");
    const aliasDirectory = join(root, "alias");
    mkdirSync(realDirectory);
    const canonicalDirectory = realpathSync(realDirectory);
    writeFileSync(join(realDirectory, "order.sdp.ts"), "source\n");
    symlinkSync(realDirectory, aliasDirectory);

    try {
      const dryRun = captureOutput();
      const dryCode = runSdpCli(
        [
          "import",
          join(aliasDirectory, "order.sdp.ts"),
          join(realDirectory, "order.sdp.ts"),
          "--dry-run",
        ],
        dryRun.output,
        { import: { importTypeScriptSpec: (_source, path) => emitted(path) } },
      );
      const writeCode = runSdpCli(
        ["import", join(aliasDirectory, "order.sdp.ts"), join(realDirectory, "order.sdp.ts")],
        captureOutput().output,
        { import: { importTypeScriptSpec: (_source, path) => emitted(path) } },
      );

      expect(dryCode).toBe(0);
      expect(dryRun.stdout().match(/^=== /gmu)).toHaveLength(1);
      expect(dryRun.stdout()).toContain(join(canonicalDirectory, "order.sdp.md"));
      expect(dryRun.stdout()).not.toContain(join(aliasDirectory, "order.sdp.md"));
      expect(writeCode).toBe(0);
      expect(readFileSync(join(realDirectory, "order.sdp.md"), "utf8")).toBe("# Imported\n");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("reports an explicit non-carrier operand and withholds valid siblings", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-operand-"));
    const valid = join(root, "valid.sdp.ts");
    const typo = join(root, "order.spd.ts");
    writeFileSync(valid, "source\n");
    writeFileSync(typo, "typo\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", valid, typo], capture.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain("import/invalid-source-path");
      expect(capture.stderr()).toContain(typo);
      expect(existsSync(join(root, "valid.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("reports the publish error and every rollback survivor without throwing", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-rollback-"));
    const first = join(root, "a.sdp.ts");
    const second = join(root, "b.sdp.ts");
    const firstTarget = join(realpathSync(root), "a.sdp.md");
    writeFileSync(first, "a\n");
    writeFileSync(second, "b\n");
    let publishes = 0;

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", root], capture.output, {
        import: {
          importTypeScriptSpec: (_source, path) => emitted(path),
          linkSync: (from, to) => {
            publishes += 1;
            if (publishes === 2) throw new Error("publish failed");
            linkSync(from, to);
          },
          rmSync: (path, options) => {
            if (path === firstTarget)
              throw Object.assign(new Error("removal denied"), { code: "EACCES" });
            rmSync(path, options);
          },
        },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain("publish failed");
      expect(capture.stderr()).toContain(`stale ${firstTarget} could not be removed`);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("does not overwrite a target created during publication", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-race-"));
    const source = join(root, "order.sdp.ts");
    const target = join(root, "order.sdp.md");
    writeFileSync(source, "source\n");

    try {
      const result = runSdpCli(["import", source], captureOutput().output, {
        import: {
          importTypeScriptSpec: (_source, path) => emitted(path),
          linkSync: (from, to) => {
            writeFileSync(to, "# Concurrent writer\n");
            linkSync(from, to);
          },
        },
      });

      expect(result).toBe(1);
      expect(readFileSync(target, "utf8")).toBe("# Concurrent writer\n");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("preserves a pre-existing temporary path that this invocation did not create", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-temp-owner-"));
    const source = join(root, "order.sdp.ts");
    const canonicalRoot = realpathSync(root);
    const target = join(canonicalRoot, "order.sdp.md");
    const temporary = `${target}.sdp-import-${String(process.pid)}-0.tmp`;
    writeFileSync(source, "source\n");
    writeFileSync(temporary, "foreign temporary\n");

    try {
      const result = runSdpCli(["import", source], captureOutput().output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(1);
      expect(readFileSync(temporary, "utf8")).toBe("foreign temporary\n");
      expect(existsSync(target)).toBe(false);
      expect(existsSync(source)).toBe(true);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("treats operands after -- as paths", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-terminator-"));
    const source = join(root, "--carrier.sdp.ts");
    writeFileSync(source, "source\n");

    try {
      const result = runSdpCli(["import", "--", source], captureOutput().output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(0);
      expect(existsSync(join(root, "--carrier.sdp.md"))).toBe(true);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("deduplicates hardlink operands by physical identity during dry-run", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-hardlink-dedupe-"));
    const original = join(root, "original.sdp.ts");
    const hardlink = join(root, "hardlink.sdp.ts");
    writeFileSync(original, "source\n");
    linkSync(original, hardlink);

    try {
      const dryRun = captureOutput();
      const result = runSdpCli(["import", original, hardlink, "--dry-run"], dryRun.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(0);
      expect(dryRun.stdout().match(/^=== /gmu)).toHaveLength(1);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it.skipIf(!caseInsensitive)(
    "deduplicates case-alias operands before dry-run and publication",
    () => {
      const root = mkdtempSync(join(tmpdir(), "sdp-import-case-alias-dedupe-"));
      const source = join(root, "CaseAlias.sdp.ts");
      const alias = join(root, "casealias.sdp.ts");
      writeFileSync(source, "source\n");

      try {
        const dryRun = captureOutput();
        const dryRunResult = runSdpCli(["import", source, alias, "--dry-run"], dryRun.output, {
          import: { importTypeScriptSpec: (_source, path) => emitted(path) },
        });
        const publication = captureOutput();
        const publicationResult = runSdpCli(["import", source, alias], publication.output, {
          import: { importTypeScriptSpec: (_source, path) => emitted(path) },
        });

        expect(dryRunResult).toBe(0);
        expect(dryRun.stdout().match(/^=== /gmu)).toHaveLength(1);
        expect(publicationResult).toBe(0);
        expect(existsSync(realpathSync(source).replace(/\.sdp\.ts$/u, ".sdp.md"))).toBe(true);
        expect(publication.stderr()).not.toContain("EEXIST");
      } finally {
        rmSync(root, { force: true, recursive: true });
      }
    },
  );

  it("plans distinct physical operands independently during dry-run", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-distinct-dedupe-"));
    const first = join(root, "first.sdp.ts");
    const second = join(root, "second.sdp.ts");
    writeFileSync(first, "first\n");
    writeFileSync(second, "second\n");

    try {
      const dryRun = captureOutput();
      const result = runSdpCli(["import", first, second, "--dry-run"], dryRun.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(0);
      expect(dryRun.stdout().match(/^=== /gmu)).toHaveLength(2);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("publishes valid sources when an empty directory produces only a warning", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-warning-batch-"));
    const emptyDirectory = join(root, "empty");
    const valid = join(root, "valid.sdp.ts");
    mkdirSync(emptyDirectory);
    writeFileSync(valid, "source\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", emptyDirectory, valid], capture.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(0);
      expect(capture.stderr()).toContain("import/no-sources");
      expect(readFileSync(join(root, "valid.sdp.md"), "utf8")).toBe("# Imported\n");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("fails an empty directory because it produces no import plan", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-empty-plan-"));
    const emptyDirectory = join(root, "empty");
    mkdirSync(emptyDirectory);

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", emptyDirectory], capture.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain("import/no-sources");
      expect(capture.stdout()).toBe("");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("withholds valid sources when an explicit non-carrier operand is an error", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-error-batch-"));
    const valid = join(root, "valid.sdp.ts");
    const invalid = join(root, "invalid.ts");
    writeFileSync(valid, "source\n");
    writeFileSync(invalid, "invalid\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", valid, invalid], capture.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain("import/invalid-source-path");
      expect(existsSync(join(root, "valid.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("withholds valid sources when an operand cannot be stat'ed", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-operational-batch-"));
    const valid = join(root, "valid.sdp.ts");
    const missing = join(root, "missing.sdp.ts");
    writeFileSync(valid, "source\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", valid, missing], capture.output, {
        import: { importTypeScriptSpec: (_source, path) => emitted(path) },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain(missing);
      expect(existsSync(join(root, "valid.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("keeps a published target when its temporary cleanup fails", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-temp-cleanup-"));
    const source = join(root, "order.sdp.ts");
    const canonicalRoot = realpathSync(root);
    const target = join(canonicalRoot, "order.sdp.md");
    const temporary = `${target}.sdp-import-${String(process.pid)}-0.tmp`;
    writeFileSync(source, "source\n");

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", source], capture.output, {
        import: {
          importTypeScriptSpec: (_source, path) => emitted(path),
          rmSync: (path, options) => {
            if (path === temporary) throw new Error("temporary removal denied");
            rmSync(path, options);
          },
        },
      });

      expect(result).toBe(0);
      expect(existsSync(target)).toBe(true);
      expect(capture.stderr()).toMatch(/stale .* could not be removed/u);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("reports unavailable hard-link support and rolls back publication", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-import-hard-link-support-"));
    const first = join(root, "a.sdp.ts");
    const second = join(root, "b.sdp.ts");
    const canonicalRoot = realpathSync(root);
    const firstTarget = join(canonicalRoot, "a.sdp.md");
    const secondTarget = join(canonicalRoot, "b.sdp.md");
    const firstTemporary = `${firstTarget}.sdp-import-${String(process.pid)}-0.tmp`;
    const secondTemporary = `${secondTarget}.sdp-import-${String(process.pid)}-1.tmp`;
    writeFileSync(first, "first\n");
    writeFileSync(second, "second\n");
    let attempts = 0;

    try {
      const capture = captureOutput();
      const result = runSdpCli(["import", first, second], capture.output, {
        import: {
          importTypeScriptSpec: (_source, path) => emitted(path),
          linkSync: (from, to) => {
            attempts += 1;
            if (attempts === 2) {
              throw Object.assign(new Error("cross-device link"), { code: "EXDEV" });
            }
            linkSync(from, to);
          },
        },
      });

      expect(result).toBe(1);
      expect(capture.stderr()).toContain("hard-link support");
      expect(existsSync(firstTarget)).toBe(false);
      expect(existsSync(secondTarget)).toBe(false);
      expect(existsSync(firstTemporary)).toBe(false);
      expect(existsSync(secondTemporary)).toBe(false);
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  });

  it("documents the hard-link requirement in import help", () => {
    const capture = captureOutput();
    const result = runSdpCli(["--help"], capture.output);

    expect(result).toBe(0);
    expect(capture.stdout()).toContain("hard link");
  });
});

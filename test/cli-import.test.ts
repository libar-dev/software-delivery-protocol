import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { ImportResult } from "../src/index.js";
import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";

function createCaptureOutput() {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  return {
    output: {
      stdout: { write: (chunk: string) => stdoutChunks.push(chunk) },
      stderr: { write: (chunk: string) => stderrChunks.push(chunk) },
    },
    readStdout: () => stdoutChunks.join(""),
    readStderr: () => stderrChunks.join(""),
  };
}

function emittedImport(relativePath: string): ImportResult {
  return {
    emitted: {
      path: relativePath.replace(/\.sdp\.ts$/u, ".sdp.md"),
      content: "# Imported Spec\n",
    },
    findings: [],
  };
}

describe("sdp import", () => {
  it("documents the import verb", () => {
    // Given: the public CLI help surface.
    // When: consumers inspect the command list.
    // Then: the durable import invocation is discoverable.
    expect(SDP_HELP_TEXT).toContain("sdp import <path...> [--dry-run]");
  });

  it("prints would-be Markdown without writing when dry-run is requested", () => {
    // Given: one source document under a disposable root.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-dry-run-"));
    const sourcePath = join(root, "specs", "order.sdp.ts");
    mkdirSync(join(root, "specs"), { recursive: true });
    writeFileSync(sourcePath, "source\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: import runs in preview mode.
      const exitCode = runSdpCli(["import", root, "--dry-run"], capture.output, {
        import: { importTypeScriptSpec: (_source, relativePath) => emittedImport(relativePath) },
      });

      // Then: it emits the document to stdout and leaves no sibling behind.
      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toBe(
        `=== ${join(realpathSync(root), "specs", "order.sdp.md")} ===\n# Imported Spec\n`,
      );
      expect(existsSync(join(root, "specs", "order.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("writes an imported document beside its TypeScript source", () => {
    // Given: a nested TypeScript carrier.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-write-beside-"));
    const sourcePath = join(root, "nested", "order.sdp.ts");
    mkdirSync(join(root, "nested"), { recursive: true });
    writeFileSync(sourcePath, "source\n", "utf8");

    try {
      // When: import receives the root.
      const exitCode = runSdpCli(["import", root], createCaptureOutput().output, {
        import: { importTypeScriptSpec: (_source, relativePath) => emittedImport(relativePath) },
      });

      // Then: the Markdown sibling lands and the TypeScript source remains.
      expect(exitCode).toBe(0);
      expect(readFileSync(join(root, "nested", "order.sdp.md"), "utf8")).toBe("# Imported Spec\n");
      expect(existsSync(sourcePath)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses an existing Markdown target without overwriting it", () => {
    // Given: a TypeScript carrier whose sibling already exists.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-target-exists-"));
    const sourcePath = join(root, "order.sdp.ts");
    const targetPath = join(root, "order.sdp.md");
    writeFileSync(sourcePath, "source\n", "utf8");
    writeFileSync(targetPath, "# Existing\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: import would write that sibling.
      const exitCode = runSdpCli(["import", sourcePath], capture.output, {
        import: { importTypeScriptSpec: (_source, relativePath) => emittedImport(relativePath) },
      });

      // Then: it reports the refusal and preserves the existing content.
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("import/target-exists");
      expect(readFileSync(targetPath, "utf8")).toBe("# Existing\n");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("leaves every target absent when one carrier is refused", () => {
    // Given: a Pack carrier followed by a valid Spec carrier.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-pack-"));
    const packPath = join(root, "bundle.pack.sdp.ts");
    const specPath = join(root, "order.sdp.ts");
    writeFileSync(packPath, "pack\n", "utf8");
    writeFileSync(specPath, "source\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: the root is imported.
      const exitCode = runSdpCli(["import", root], capture.output, {
        import: {
          importTypeScriptSpec: (_source, relativePath) =>
            relativePath.endsWith(".pack.sdp.ts")
              ? {
                  findings: [
                    {
                      validatorId: "import/pack-unsupported",
                      family: "conformance",
                      severity: "error" as const,
                      message: "Pack remains TypeScript-authored.",
                      file: relativePath,
                      line: 1,
                    },
                  ],
                }
              : emittedImport(relativePath),
        },
      });

      // Then: the Pack is named and no partial import is published.
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("import/pack-unsupported");
      expect(existsSync(join(root, "order.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("rejects an unknown import flag by name", () => {
    // Given: an unrecognized import option.
    const capture = createCaptureOutput();

    // When: the parser receives it.
    const exitCode = runSdpCli(["import", "--exclude", "--foo"], capture.output);

    // Then: invocation fails before any import work begins.
    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toBe("sdp import: unknown option --exclude\n");
  });

  it("refuses a requested path with no TypeScript carriers", () => {
    // Given: an explicitly requested ordinary file.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-no-sources-"));
    const sourcePath = join(root, "README.md");
    writeFileSync(sourcePath, "# Readme\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: import receives no carrier source.
      const exitCode = runSdpCli(["import", sourcePath], capture.output);

      // Then: it reports the failed request rather than claiming success.
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("import/invalid-source-path");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("renders refusal findings and exits 1", () => {
    // Given: a source whose adapter refuses to emit.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-refusal-"));
    const sourcePath = join(root, "refused.sdp.ts");
    writeFileSync(sourcePath, "source\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: import receives the refused source.
      const exitCode = runSdpCli(["import", sourcePath], capture.output, {
        import: {
          importTypeScriptSpec: (_source, relativePath) => ({
            findings: [
              {
                validatorId: "import/refusal",
                family: "conformance",
                severity: "error" as const,
                message: "The source was refused.",
                file: relativePath,
                line: 1,
              },
            ],
          }),
        },
      });

      // Then: the shared finding renderer names the refusal and the command fails.
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("[error] import/refusal");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("renders an injected write failure as one operational error line", () => {
    // Given: a writable source and a deterministic denied-write producer.
    const root = mkdtempSync(join(tmpdir(), "sdp-import-write-error-"));
    const sourcePath = join(root, "order.sdp.ts");
    writeFileSync(sourcePath, "source\n", "utf8");

    try {
      const capture = createCaptureOutput();

      // When: the CLI writes the emitted sibling through the injected filesystem seam.
      const exitCode = runSdpCli(["import", sourcePath], capture.output, {
        import: {
          importTypeScriptSpec: (_source, relativePath) => emittedImport(relativePath),
          writeFileSync: () => {
            throw new Error("EACCES: permission denied, open 'order.sdp.md'");
          },
        },
      });

      // Then: the boundary reports the operational failure without a stack trace.
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toBe(
        "sdp import: EACCES: permission denied, open 'order.sdp.md'\n",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

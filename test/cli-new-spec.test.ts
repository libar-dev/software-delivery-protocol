import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { SDP_HELP_TEXT, runSdpCli } from "../src/cli/sdp.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { validateGraph } from "../src/validate/validators.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

const twinSectionKinds = [
  ["behavior", "Behavior"],
  ["workflow", "Workflow"],
  ["rule", "Rule"],
  ["model", "Model"],
  ["decision", "Decision"],
  ["contract", "Contract"],
  ["example", "Behavior"],
] as const;

function expectedScaffold(kind: string, heading: string): string {
  return `---
id: spec:tmp.probe
kind: ${kind}
altitude: story
readiness: idea
relations: {}
---
# Probe

## Intent

- outcome: Probe

## ${heading}
`;
}

function runNewSpec(
  args: readonly string[],
  cwd: string,
): { readonly exitCode: number; readonly stdout: string; readonly stderr: string } {
  const capture = createCaptureOutput();
  const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(cwd);

  try {
    const exitCode = runSdpCli(["new", "spec", ...args], capture.output);
    expect(exitCode).toEqual(expect.any(Number));
    return {
      exitCode: exitCode as number,
      stdout: capture.readStdout(),
      stderr: capture.readStderr(),
    };
  } finally {
    cwdSpy.mockRestore();
  }
}

function requiredFlags(
  overrides: {
    readonly path?: string;
    readonly id?: string;
    readonly kind?: string;
    readonly altitude?: string;
    readonly title?: string;
    readonly outcome?: string;
  } = {},
): string[] {
  return [
    overrides.path ?? "specs/probe.sdp.md",
    "--id",
    overrides.id ?? "spec:tmp.probe",
    "--kind",
    overrides.kind ?? "rule",
    "--altitude",
    overrides.altitude ?? "story",
    "--title",
    overrides.title ?? "Probe",
    "--outcome",
    overrides.outcome ?? "Probe",
  ];
}

describe("sdp new spec", () => {
  it("documents the scaffolder on the public help surface", () => {
    const capture = createCaptureOutput();

    expect(runSdpCli(["--help"], capture.output)).toBe(0);
    expect(SDP_HELP_TEXT).toContain(
      "sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME",
    );
    expect(capture.readStdout()).toContain("sdp new spec PATH");
  });

  it("prints focused help for sdp new spec --help", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["new", "spec", "--help"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toContain("sdp new spec PATH");
    expect(capture.readStderr()).toBe("");
  });

  it.each(twinSectionKinds)(
    "emits exact idea-rung bytes for kind %s with a bare %s heading",
    (kind, heading) => {
      const root = mkdtempSync(join(tmpdir(), `sdp-new-spec-${kind}-`));

      try {
        const result = runNewSpec(requiredFlags({ kind, path: "probe.sdp.md" }), root);

        expect(result.exitCode).toBe(0);
        expect(result.stderr).toBe("");
        expect(readFileSync(join(root, "probe.sdp.md"), "utf8")).toBe(
          expectedScaffold(kind, heading),
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
  );

  it("refuses constraint because no lawful bare skeleton exists and writes no file", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-constraint-"));

    try {
      const result = runNewSpec(requiredFlags({ kind: "constraint", path: "probe.sdp.md" }), root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/constraint/u);
      expect(result.stderr).toMatch(/statement|bare skeleton|no lawful/u);
      expect(existsSync(join(root, "probe.sdp.md"))).toBe(false);
      expect(existsSync(join(root, "specs"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("places the carrier at the cwd-relative PATH, creating parent directories", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-path-"));

    try {
      const result = runNewSpec(requiredFlags({ path: "specs/tmp/probe.sdp.md" }), root);

      expect(result.exitCode).toBe(0);
      expect(existsSync(join(root, "specs", "tmp", "probe.sdp.md"))).toBe(true);
      expect(existsSync(join(root, "generated"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses to overwrite an existing target and leaves its bytes unchanged", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-collision-"));
    const target = join(root, "probe.sdp.md");
    writeFileSync(target, "# Existing\n", "utf8");

    try {
      const result = runNewSpec(requiredFlags({ path: "probe.sdp.md" }), root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/already exists|will not be overwritten/u);
      expect(readFileSync(target, "utf8")).toBe("# Existing\n");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a second write to the same PATH and keeps the first scaffold intact", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-second-write-"));

    try {
      expect(runNewSpec(requiredFlags({ path: "probe.sdp.md" }), root).exitCode).toBe(0);
      const first = readFileSync(join(root, "probe.sdp.md"), "utf8");
      const second = runNewSpec(requiredFlags({ path: "probe.sdp.md" }), root);

      expect(second.exitCode).toBe(1);
      expect(second.stderr).toMatch(/already exists|will not be overwritten/u);
      expect(readFileSync(join(root, "probe.sdp.md"), "utf8")).toBe(first);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each([
    ["an unknown kind", requiredFlags({ kind: "gherkin", path: "probe.sdp.md" }), /--kind/u],
    [
      "an invalid spec id",
      requiredFlags({ id: "impl:tmp.probe", path: "probe.sdp.md" }),
      /--id|Invalid ID/u,
    ],
    [
      "an invalid altitude",
      requiredFlags({ altitude: "theme", path: "probe.sdp.md" }),
      /--altitude/u,
    ],
    ["a missing title", requiredFlags({ title: "", path: "probe.sdp.md" }), /--title/u],
    [
      "a multiline title",
      requiredFlags({ title: "Probe\nExtra", path: "probe.sdp.md" }),
      /--title/u,
    ],
    ["a missing outcome", requiredFlags({ outcome: "", path: "probe.sdp.md" }), /--outcome/u],
    [
      "a multiline outcome",
      requiredFlags({ outcome: "Probe\nExtra", path: "probe.sdp.md" }),
      /--outcome/u,
    ],
    ["a path that escapes cwd", requiredFlags({ path: "../probe.sdp.md" }), /cwd-relative|\.\./u],
    ["an absolute path", requiredFlags({ path: "/tmp/probe.sdp.md" }), /cwd-relative|absolute/u],
    ["a non-markdown path", requiredFlags({ path: "probe.sdp.ts" }), /\.sdp\.md/u],
  ])("refuses %s and writes no bytes", (_label, args, stderr) => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-malformed-"));

    try {
      const result = runNewSpec(args, root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(stderr);
      expect(existsSync(join(root, "probe.sdp.md"))).toBe(false);
      expect(existsSync(join(root, "specs"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses missing required flags before creating a file", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-missing-"));

    try {
      const result = runNewSpec(["probe.sdp.md", "--kind", "rule"], root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/--id|--altitude|--title|--outcome/u);
      expect(existsSync(join(root, "probe.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("extracts and validates every scaffolded kind with readiness staying idea", () => {
    const kinds = twinSectionKinds.map(([kind]) => kind);

    for (const kind of kinds) {
      const root = mkdtempSync(join(tmpdir(), `sdp-new-spec-validate-${kind}-`));

      try {
        expect(runNewSpec(requiredFlags({ kind, path: "probe.sdp.md" }), root).exitCode).toBe(0);

        const extracted = extract({ root });
        const validation = validateGraph(extracted.graph);
        const errors = [...extracted.report.findings, ...validation.findings].filter(
          (finding) => finding.severity === "error",
        );
        const context = createReader(extracted.graph).specContext("spec:tmp.probe");

        expect(errors).toEqual([]);
        expect(context?.statedReadiness).toBe("idea");
        expect(context?.derivedReadiness).toBe("idea");
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  });

  it("validates a cwd-relative scaffold through the real validate verb with 0 errors", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-cli-validate-"));

    try {
      expect(runNewSpec(requiredFlags({ path: "specs/probe.sdp.md" }), root).exitCode).toBe(0);

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", root], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toMatch(/validate: 0 errors/u);
      expect(capture.readStderr()).not.toMatch(/\[error\]/u);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("does not treat new as an unknown top-level command", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["new"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).not.toContain("Unknown command: new");
    expect(capture.readStderr()).toMatch(/spec/u);
  });
});

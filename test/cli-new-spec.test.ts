import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, sep } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { parseNewSpecArgs, runNewSpec as executeNewSpec } from "../src/cli/new-spec-command.js";
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

function expectedConstraintScaffold(): string {
  return `---
id: spec:tmp.probe
kind: constraint
altitude: story
readiness: idea
relations: {}
---
# Probe

## Intent

- outcome: Probe
`;
}

function collectHardErrors(root: string): readonly unknown[] {
  const extracted = extract({ root });
  const validation = validateGraph(extracted.graph);
  return [...extracted.report.findings, ...validation.findings].filter(
    (finding) => finding.severity === "error",
  );
}

function isInsideRoot(candidate: string, root: string): boolean {
  const relativePath = relative(realpathSync(root), realpathSync(candidate));
  return relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath);
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

/**
 * @sdpAnchor test:protocol.spec-scaffolder
 * @sdpVerifies spec:consumers.authoring-on-ramp
 */
describe("sdp new spec", () => {
  it("leaves help to the command dispatcher and parses only scaffold arguments", () => {
    const capture = createCaptureOutput();
    expect(parseNewSpecArgs(["--help"], capture.output)).toBeUndefined();
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("unknown option --help");
  });
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
    expect(capture.readStdout()).toMatch(/constraint/u);
    expect(capture.readStdout()).toMatch(/no twin|Intent-only|without a twin/u);
    expect(capture.readStdout()).not.toMatch(/refused/u);
    // spec:consumers.authoring-on-ramp#rule.scaffoldWriteBoundary, as the help states it.
    const help = capture.readStdout().replace(/\s+/gu, " ");
    expect(help).toContain("must not contain .. segments");
    expect(help).toContain("Its parent must resolve inside the working directory");
    expect(help).toContain("ends the command with exit 1 before anything is created");
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

  it("emits the no-twin constraint scaffold: envelope, title, and Intent only", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-constraint-"));

    try {
      const result = runNewSpec(requiredFlags({ kind: "constraint", path: "probe.sdp.md" }), root);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(readFileSync(join(root, "probe.sdp.md"), "utf8")).toBe(expectedConstraintScaffold());
      expect(readFileSync(join(root, "probe.sdp.md"), "utf8")).not.toMatch(/## Constraints/u);
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

  it("accepts a .pack.sdp.md path when the envelope names a Spec", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-pack-suffix-"));

    try {
      const result = runNewSpec(requiredFlags({ path: "probe.pack.sdp.md" }), root);

      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      expect(readFileSync(join(root, "probe.pack.sdp.md"), "utf8")).toBe(
        expectedScaffold("rule", "Rule"),
      );
      const extracted = extract({ root });
      expect(collectHardErrors(root)).toEqual([]);
      expect(createReader(extracted.graph).specContext("spec:tmp.probe")?.file).toBe(
        "probe.pack.sdp.md",
      );
      expect(extracted.graph.nodes.some((node) => node.nodeType === "Pack")).toBe(false);
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
    [
      "a title holding U+2028",
      requiredFlags({ title: "Probe\u2028@implemented injected", path: "probe.sdp.md" }),
      /--title must be a single line/u,
    ],
    [
      "a title holding a lone CR",
      requiredFlags({ title: "Probe\rExtra", path: "probe.sdp.md" }),
      /--title must be a single line/u,
    ],
    ["a missing outcome", requiredFlags({ outcome: "", path: "probe.sdp.md" }), /--outcome/u],
    [
      "an outcome holding U+2029",
      requiredFlags({ outcome: "Probe\u2029Extra", path: "probe.sdp.md" }),
      /--outcome must be a single line/u,
    ],
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
    const kinds = [...twinSectionKinds.map(([kind]) => kind), "constraint"] as const;

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

  // spec:consumers.authoring-on-ramp#rule.scaffoldWriteBoundary
  it("rejects an existing parent symlink that escapes cwd before any outside write", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-new-spec-symlink-"));
    const outside = join(workspace, "outside");
    const root = join(workspace, "root");
    const escapedTarget = join(outside, "probe.sdp.md");

    mkdirSync(outside);
    mkdirSync(root);
    symlinkSync(outside, join(root, "linked"));

    try {
      const result = runNewSpec(requiredFlags({ path: "linked/probe.sdp.md" }), root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/cwd-relative|symlink|escapes|outside/u);
      expect(existsSync(escapedTarget)).toBe(false);
      expect(existsSync(join(root, "linked", "probe.sdp.md"))).toBe(false);
      expect(lstatSync(join(root, "linked")).isSymbolicLink()).toBe(true);
      expect(realpathSync(join(root, "linked"))).toBe(realpathSync(outside));
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("rejects an escaping closest-existing ancestor before creating nested parents", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-new-spec-ancestor-"));
    const outside = join(workspace, "outside");
    const root = join(workspace, "root");
    const escapedNested = join(outside, "nested");
    const escapedTarget = join(escapedNested, "probe.sdp.md");

    mkdirSync(outside);
    mkdirSync(root);
    symlinkSync(outside, join(root, "linked"));

    try {
      const result = runNewSpec(requiredFlags({ path: "linked/nested/probe.sdp.md" }), root);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/cwd-relative|symlink|escapes|outside/u);
      expect(existsSync(escapedTarget)).toBe(false);
      expect(existsSync(escapedNested)).toBe(false);
      expect(existsSync(join(root, "linked", "nested"))).toBe(false);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("cannot use an in-cwd parent symlink to bypass containment", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-new-spec-incwd-"));
    const outside = join(workspace, "outside");
    const root = join(workspace, "root");
    const inside = join(root, "inside");

    mkdirSync(outside);
    mkdirSync(inside, { recursive: true });
    symlinkSync(inside, join(root, "alias"));

    try {
      const result = runNewSpec(requiredFlags({ path: "alias/probe.sdp.md" }), root);

      expect(result.exitCode).toBe(0);
      expect(existsSync(join(inside, "probe.sdp.md"))).toBe(true);
      expect(existsSync(join(outside, "probe.sdp.md"))).toBe(false);
      expect(realpathSync(join(root, "alias", "probe.sdp.md"))).toBe(
        realpathSync(join(inside, "probe.sdp.md")),
      );
      expect(isInsideRoot(dirname(join(root, "alias", "probe.sdp.md")), root)).toBe(true);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  // spec:consumers.authoring-on-ramp#rule.scaffoldWriteBoundary
  it("rechecks the created parent boundary after mkdir and refuses a swapped outside parent", () => {
    // process.cwd() resolves aliases such as macOS /var -> /private/var. Use the same
    // physical path so the injected swap runs on the directory the command creates.
    const workspace = realpathSync(mkdtempSync(join(tmpdir(), "sdp-new-spec-postmkdir-")));
    const outside = join(workspace, "outside");
    const root = join(workspace, "root");
    const parent = join(root, "specs");
    const escapedTarget = join(outside, "probe.sdp.md");
    const capture = createCaptureOutput();

    mkdirSync(outside);
    mkdirSync(root);
    // A real chdir, not a cwd mock: the held-handle write path resolves "." through
    // process.cwd(), so mocking it would split the checked world from the written world.
    process.chdir(root);

    try {
      const parsed = parseNewSpecArgs(
        requiredFlags({ path: "specs/probe.sdp.md" }),
        capture.output,
      );
      expect(parsed).toBeDefined();
      if (parsed === undefined) {
        return;
      }

      let swapped = false;
      const exitCode = executeNewSpec(parsed, capture.output, {
        mkdirSync(target, options) {
          const created = mkdirSync(target, options);
          if (String(target) === "specs") {
            rmSync(parent, { recursive: true, force: true });
            symlinkSync(outside, parent);
            swapped = true;
          }
          return created;
        },
      });

      expect(swapped).toBe(true);
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toMatch(/cwd-relative|symlink|escapes|outside/u);
      expect(existsSync(escapedTarget)).toBe(false);
      expect(existsSync(join(parent, "probe.sdp.md"))).toBe(false);
    } finally {
      process.chdir(tmpdir());
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("refuses a post-check parent relocation and removes the scaffold from the held directory", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-new-spec-writeswap-"));
    const outside = join(workspace, "outside");
    const root = join(workspace, "root");
    const parent = join(root, "specs");
    const moved = join(workspace, "moved");
    const capture = createCaptureOutput();

    mkdirSync(outside);
    mkdirSync(root);
    // A real chdir, not a cwd mock: the held-handle write path resolves "." through
    // process.cwd(), so mocking it would split the checked world from the written world.
    process.chdir(root);

    try {
      const parsed = parseNewSpecArgs(
        requiredFlags({ path: "specs/probe.sdp.md" }),
        capture.output,
      );
      expect(parsed).toBeDefined();
      if (parsed === undefined) {
        return;
      }

      const exitCode = executeNewSpec(parsed, capture.output, {
        onBeforeScaffoldWrite() {
          // The adversary's window: the parent was already checked and verified, and the swap
          // lands immediately before the write. The held-handle write must not follow the
          // symlink outside, and the relocated create must be undone.
          renameSync(parent, moved);
          symlinkSync(outside, parent);
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toMatch(/symlink|escapes|outside/u);
      expect(existsSync(join(outside, "probe.sdp.md"))).toBe(false);
      expect(existsSync(join(moved, "probe.sdp.md"))).toBe(false);
      expect(existsSync(join(parent, "probe.sdp.md"))).toBe(false);
    } finally {
      process.chdir(tmpdir());
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("refuses extractor-rejected raw HTML outcome text before creating a file", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-html-"));

    try {
      const result = runNewSpec(
        requiredFlags({ path: "probe.sdp.md", outcome: "<script>alert(1)</script>" }),
        root,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/raw HTML is unsupported|invalid-markdown-structure/u);
      expect(existsSync(join(root, "probe.sdp.md"))).toBe(false);
      expect(existsSync(join(root, "specs"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses other extractor-rejected outcome text and still writes no file", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-new-spec-html-comment-"));

    try {
      const result = runNewSpec(
        requiredFlags({ path: "probe.sdp.md", outcome: "<!-- not lawful -->" }),
        root,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toMatch(/raw HTML is unsupported|invalid-markdown-structure/u);
      expect(existsSync(join(root, "probe.sdp.md"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("accepts lawful Markdown and plain-text outcomes that the extractor already accepts", () => {
    const cases = [
      ["plain", "Stay within the checkout budget"],
      ["markdown", "Stay within the **checkout** budget"],
    ] as const;

    for (const [label, outcome] of cases) {
      const root = mkdtempSync(join(tmpdir(), `sdp-new-spec-lawful-${label}-`));

      try {
        const result = runNewSpec(requiredFlags({ path: "probe.sdp.md", outcome }), root);

        expect(result.exitCode).toBe(0);
        expect(result.stderr).toBe("");
        expect(readFileSync(join(root, "probe.sdp.md"), "utf8")).toContain(`- outcome: ${outcome}`);
        expect(collectHardErrors(root)).toEqual([]);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
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

// spec:consumers.authoring-on-ramp#rule.scaffoldWriteBoundary
it("creates missing parents through the held directory when its path is swapped before mkdir", () => {
  const original = process.cwd();
  const workspace = mkdtempSync(join(tmpdir(), "sdp-new-parent-swap-"));
  const root = join(workspace, "root"),
    parent = join(root, "specs"),
    outside = join(workspace, "outside");
  mkdirSync(parent, { recursive: true });
  mkdirSync(outside);
  process.chdir(root);
  try {
    const capture = createCaptureOutput();
    const parsed = parseNewSpecArgs(
      requiredFlags({ path: "specs/nested/deeper/probe.sdp.md" }),
      capture.output,
    );
    if (parsed === undefined) throw new Error(capture.readStderr());
    let swapped = false;
    const code = executeNewSpec(parsed, capture.output, {
      mkdirSync: (target, options) => {
        if (!swapped) {
          renameSync(parent, join(root, "saved"));
          symlinkSync(outside, parent);
          swapped = true;
        }
        return mkdirSync(target, options);
      },
    });
    expect(code).toBe(1);
    expect(existsSync(join(outside, "nested"))).toBe(false);
    expect(existsSync(join(outside, "probe.sdp.md"))).toBe(false);
  } finally {
    process.chdir(original);
    rmSync(workspace, { recursive: true, force: true });
  }
});

// spec:consumers.authoring-on-ramp#rule.scaffoldWriteBoundary: each recheck refuses at its own
// checkpoint. The checks overlap, so without one the next refuses later, after a creation or
// with another message; each test below fails when its own check is removed.
describe("sdp new spec containment checkpoints", () => {
  interface Workspace {
    readonly root: string;
    readonly outside: string;
    readonly moved: string;
  }

  function scaffoldIn(
    path: string,
    hooks: (workspace: Workspace) => Parameters<typeof executeNewSpec>[2],
    arrange: (workspace: Workspace) => void = () => undefined,
  ): Workspace & { readonly exitCode: number; readonly stderr: string } {
    const original = process.cwd();
    // The physical path, so the paths a test swaps match the ones the command holds.
    const base = realpathSync(mkdtempSync(join(tmpdir(), "sdp-new-spec-checkpoint-")));
    const workspace = {
      root: join(base, "root"),
      outside: join(base, "outside"),
      moved: join(base, "moved"),
    };
    mkdirSync(workspace.root);
    mkdirSync(workspace.outside);
    arrange(workspace);
    process.chdir(workspace.root);
    const capture = createCaptureOutput();
    try {
      const parsed = parseNewSpecArgs(requiredFlags({ path }), capture.output);
      if (parsed === undefined) throw new Error(capture.readStderr());
      const exitCode = executeNewSpec(parsed, capture.output, hooks(workspace));
      return { exitCode, stderr: capture.readStderr(), ...workspace };
    } finally {
      process.chdir(original);
    }
  }

  function cleanup(workspace: Workspace): void {
    rmSync(dirname(workspace.root), { recursive: true, force: true });
  }

  it("refuses a statically planted escaping parent before attempting any parent creation", () => {
    const created: string[] = [];
    const result = scaffoldIn(
      "linked/nested/probe.sdp.md",
      () => ({
        mkdirSync: (target, options) => {
          created.push(String(target));
          return mkdirSync(target, options);
        },
      }),
      ({ root, outside }) => {
        symlinkSync(outside, join(root, "linked"));
      },
    );
    try {
      expect(result.exitCode).toBe(1);
      expect(created).toEqual([]);
      expect(result.stderr).toBe(
        "sdp new spec: PATH escapes the current working directory through a parent symlink.\n",
      );
      expect(existsSync(join(result.outside, "nested"))).toBe(false);
    } finally {
      cleanup(result);
    }
  });

  it("refuses before creating a parent when the directory that would hold it moved out", () => {
    const result = scaffoldIn("specs/nested/probe.sdp.md", ({ root, moved }) => ({
      onScaffoldCheckpoint: (checkpoint, name) => {
        if (checkpoint === "create" && name === "nested") renameSync(join(root, "specs"), moved);
      },
    }));
    try {
      expect(result.exitCode).toBe(1);
      expect(existsSync(join(result.moved, "nested"))).toBe(false);
      expect(result.stderr).toBe(
        "sdp new spec: PATH cannot be resolved inside the current working directory: the directory that holds nested lies outside it before nested is created\n",
      );
    } finally {
      cleanup(result);
    }
  });

  it("refuses right after entering a parent swapped for an escaping link", () => {
    const result = scaffoldIn("specs/nested/probe.sdp.md", ({ root, outside }) => ({
      mkdirSync: (target, options) => {
        const created = mkdirSync(target, options);
        if (String(target) === "specs") {
          rmSync(join(root, "specs"), { recursive: true });
          symlinkSync(outside, join(root, "specs"));
        }
        return created;
      },
    }));
    try {
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe(
        "sdp new spec: PATH cannot be resolved inside the current working directory: specs lies outside it once entered\n",
      );
      expect(existsSync(join(result.outside, "nested"))).toBe(false);
      expect(existsSync(join(result.outside, "probe.sdp.md"))).toBe(false);
    } finally {
      cleanup(result);
    }
  });

  it("refuses before the write when the held parent moved out after the last parent check", () => {
    let reachedWrite = false;
    const result = scaffoldIn("specs/probe.sdp.md", ({ root, moved }) => ({
      onScaffoldCheckpoint: (checkpoint) => {
        if (checkpoint === "hold") renameSync(join(root, "specs"), moved);
      },
      onBeforeScaffoldWrite: () => {
        reachedWrite = true;
      },
    }));
    try {
      expect(result.exitCode).toBe(1);
      expect(reachedWrite).toBe(false);
      expect(result.stderr).toBe(
        "sdp new spec: PATH escapes the current working directory: the scaffold's directory lies outside it before the write.\n",
      );
      expect(existsSync(join(result.moved, "probe.sdp.md"))).toBe(false);
    } finally {
      cleanup(result);
    }
  });
});

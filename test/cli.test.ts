import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, it } from "vitest";

import { SDP_HELP_TEXT, isCliEntrypoint, runSdpCli } from "../src/cli/sdp.js";
import { extract } from "../src/extract/index.js";
import { renderDesignReview } from "../src/projections/design-review.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleRoot = join(repoRoot, "examples", "checkout-v1");

function createCaptureOutput() {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  return {
    output: {
      stdout: {
        write(chunk: string) {
          stdoutChunks.push(chunk);
        },
      },
      stderr: {
        write(chunk: string) {
          stderrChunks.push(chunk);
        },
      },
    },
    readStdout() {
      return stdoutChunks.join("");
    },
    readStderr() {
      return stderrChunks.join("");
    },
  };
}

describe("sdp cli", () => {
  it("prints the exact help text for no args", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli([], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`${SDP_HELP_TEXT}\n`);
    expect(capture.readStderr()).toBe("");
  });

  it("prints the exact help text for --help", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["--help"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`${SDP_HELP_TEXT}\n`);
    expect(capture.readStderr()).toBe("");
  });

  it("builds the checkout-v1 example: writes graph.json (and no temp leftover) and exits 0", () => {
    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", exampleRoot], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    expect(readdirSync(join(exampleRoot, "generated"))).toEqual(["graph.json"]);
  });

  it("builds cleanly with no root argument from the repository root (the default-root path)", () => {
    // The repo itself must stay a clean default root: corpora are committed defused
    // (*.sdp.ts.txt / *.ts.txt), so the only *.sdp.ts under the root is the example model, and
    // the anchor sweep finds only the example's anchors (recognition is by import binding — this
    // repo's own tests import the protocol by relative path, so they bind nothing).
    rmSync(join(repoRoot, "generated"), { recursive: true, force: true });
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    rmSync(join(repoRoot, "generated"), { recursive: true, force: true });
  });

  it("passes --check-clean on the example (determinism self-check through the CLI)", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", exampleRoot, "--check-clean"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe("");
  });

  it("clean-repo determinism: the full pipeline at a different absolute path is byte-identical", () => {
    // --check-clean runs the pipeline twice over the *same* root, and delete-generated/-and-rerun
    // reuses the same root too — neither can catch an absolute path leaking into artifact bytes.
    // A working-tree copy of the authored surfaces (never `git archive`: an uncommitted example
    // edit must not fail a determinism test) at a fresh absolute path pins the projection
    // property: bytes are a function of the root's *content*, never its location or leftover
    // local state.
    const cleanRoot = mkdtempSync(join(tmpdir(), "sdp-clean-repo-"));

    try {
      for (const surface of ["specs", "src", "test"]) {
        cpSync(join(exampleRoot, surface), join(cleanRoot, surface), { recursive: true });
      }

      expect(runSdpCli(["view", exampleRoot, "--check-clean"], createCaptureOutput().output)).toBe(
        0,
      );
      expect(runSdpCli(["view", cleanRoot, "--check-clean"], createCaptureOutput().output)).toBe(0);

      const readArtifactTree = (root: string): ReadonlyMap<string, string> => {
        const tree = new Map<string, string>();

        for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
          if (entry.isFile()) {
            const absolute = join(entry.parentPath, entry.name);
            tree.set(absolute.slice(root.length + 1), readFileSync(absolute, "utf8"));
          }
        }

        return tree;
      };

      expect(readArtifactTree(join(cleanRoot, "generated"))).toEqual(
        readArtifactTree(join(exampleRoot, "generated")),
      );
    } finally {
      rmSync(cleanRoot, { recursive: true, force: true });
    }
  });

  it("end-to-end determinism self-check: delete generated/, rebuild, byte-identical", () => {
    const graphPath = join(exampleRoot, "generated", "graph.json");
    expect(runSdpCli(["build", exampleRoot], createCaptureOutput().output)).toBe(0);
    const firstBuild = readFileSync(graphPath, "utf8");

    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    expect(runSdpCli(["build", exampleRoot], createCaptureOutput().output)).toBe(0);

    expect(readFileSync(graphPath, "utf8")).toBe(firstBuild);
  });

  it("fails clean on a root that is not a directory: one line, exit 1, never a stack trace", () => {
    const missingRoot = join(tmpdir(), "sdp-no-such-root");
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", missingRoot], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(`sdp build: root "${missingRoot}" is not a directory.\n`);

    // A file as root is the same invocation mistake and gets the same one-liner.
    const fileRoot = join(repoRoot, "package.json");
    const fileCapture = createCaptureOutput();
    expect(runSdpCli(["validate", fileRoot], fileCapture.output)).toBe(1);
    expect(fileCapture.readStderr()).toBe(`sdp validate: root "${fileRoot}" is not a directory.\n`);
  });

  it("rejects an unknown option: one line, exit 1, nothing runs", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", "--bogus"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("Unknown option for build: --bogus\n");
  });

  it("rejects a second root argument: one line, exit 1, nothing runs", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["build", "first-root", "second-root"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("sdp build takes at most one root argument.\n");
  });

  it("notes an empty authored model: zero spec files still builds and exits 0, but says where it looked", () => {
    const emptyRoot = mkdtempSync(join(tmpdir(), "sdp-empty-root-"));

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", emptyRoot], capture.output);

      // An empty authored model is conformant — no finding, the graph written, exit 0; the note
      // is invocation feedback (a typo'd cwd must never be a silent success).
      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toContain("0 specs · 0 packs · 0 anchors");
      expect(capture.readStderr()).toContain(
        `note: no *.sdp.ts spec files found under ${emptyRoot}`,
      );
      expect(existsSync(join(emptyRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      rmSync(emptyRoot, { recursive: true, force: true });
    }
  });

  it("renders a finding's location exactly once, from the structured fields: file:line — [severity]", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const capture = createCaptureOutput();
      runSdpCli(["build", corpusRoot], capture.output);

      expect(capture.readStderr()).toMatch(
        /non-static-id\.sdp\.ts:\d+ — \[error\] extract\/non-static-envelope — /,
      );

      // One diagnostic rendering rule: the location lives in the `file`/`line` fields and is
      // printed by the formatter — never embedded in the message a second time.
      const findingLine = capture
        .readStderr()
        .split("\n")
        .find((line) => line.includes("extract/non-static-envelope"));
      expect(findingLine?.match(/non-static-id\.sdp\.ts/g)).toHaveLength(1);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("exits 1, writes nothing, and removes a stale graph.json on a hard-error corpus", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const stalePath = join(corpusRoot, "generated", "graph.json");
      mkdirSync(join(corpusRoot, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(capture.readStderr()).toContain("graph.json not written");
      // The stale artifact is gone: a failed build leaves no graph that could read as current.
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("fails --check-clean on a diverging second extraction: exit 1, the stale graph.json removed", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const stalePath = join(corpusRoot, "generated", "graph.json");
      mkdirSync(join(corpusRoot, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");

      // The divergence branch is unreachable from honest inputs (extraction is deterministic),
      // so the second extraction is forced to diverge through the injection seam.
      let extractions = 0;
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot, "--check-clean"], capture.output, {
        extract: (options) => {
          extractions += 1;
          const result = extract(options);

          return extractions === 1 ? result : { ...result, graph: { ...result.graph, edges: [] } };
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe(
        "sdp build --check-clean: two independent extractions diverged — the build is not deterministic; any previous graph.json at this root was removed.\n",
      );
      // The stale artifact is gone: nothing at this root reads as current.
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("fails clean when extraction throws past discovery: one line, exit 1, the stale graph.json removed", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-unreadable-root-"));

    try {
      const stalePath = join(root, "generated", "graph.json");
      mkdirSync(join(root, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");

      // A mid-extraction filesystem error (e.g. an unreadable file under the root) is
      // deterministic only through the injection seam — never a chmod trick in a test.
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root], capture.output, {
        extract: () => {
          throw new Error("EACCES: permission denied, open 'specs/locked.sdp.ts'");
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe(
        "sdp build: EACCES: permission denied, open 'specs/locked.sdp.ts'\n",
      );
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("recognizes the published-bin path: a .bin-style symlink resolves to the entry module", () => {
    const directory = mkdtempSync(join(tmpdir(), "sdp-bin-"));

    try {
      const entryFile = join(directory, "sdp.js");
      writeFileSync(entryFile, "// stand-in for the built CLI entry\n", "utf8");
      const binLink = join(directory, "sdp");
      symlinkSync(entryFile, binLink);
      const moduleUrl = pathToFileURL(entryFile).href;

      expect(isCliEntrypoint(binLink, moduleUrl)).toBe(true);
      expect(isCliEntrypoint(entryFile, moduleUrl)).toBe(true);
      expect(isCliEntrypoint(join(directory, "unrelated.js"), moduleUrl)).toBe(false);
      expect(isCliEntrypoint(undefined, moduleUrl)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("validates the example: exit 0, the artifact written, and exactly the one surfaced warning", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["validate", exampleRoot, "--check-clean"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toContain("9 specs · 1 packs · 3 anchors → 13 nodes · 25 edges");
    expect(capture.readStdout()).toContain(
      "validate: 0 errors · 1 warnings (conformance + honesty over the one graph)",
    );
    // The standing warning is the invalid-cart example's unenabled verifier — informative, never
    // a gate (it is the surfaced absence the check exists for, not noise to silence).
    expect(capture.readStderr()).toContain("conformance/verifies-linkage");
    expect(capture.readStderr()).not.toContain("[error]");
    expect(existsSync(join(exampleRoot, "generated", "graph.json"))).toBe(true);
  });

  it("gates on the checks, not the build: a clean-building broken link validates to exit 1 with the artifact kept", () => {
    const corpusRoot = materializeExtractCorpus("dangling-relation");

    try {
      expect(runSdpCli(["build", corpusRoot], createCaptureOutput().output)).toBe(0);

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("conformance/referential-integrity");
      expect(capture.readStdout()).toContain("validate: 1 errors · 0 warnings");
      // The artifact stays: the graph is the faithful projection — the check errors describe the
      // repo's conformance, not the artifact.
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("short-circuits the checks on extraction hard errors: validate keeps build semantics", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(capture.readStderr()).toContain("sdp validate: hard errors present");
      expect(capture.readStdout()).not.toContain("conformance");
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("prints help plus an unknown-command error", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["bogus"], capture.output);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(`${SDP_HELP_TEXT}\n\nUnknown command: bogus\n`);
  });

  it("views the example: validate + the Design Review written, with the one standing warning", () => {
    const capture = createCaptureOutput();

    const exitCode = runSdpCli(["view", exampleRoot, "--check-clean"], capture.output);

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toContain(
      "validate: 0 errors · 1 warnings (conformance + honesty over the one graph)",
    );
    expect(capture.readStdout()).toContain("(11 pages)");

    const viewRoot = join(exampleRoot, "generated", "design-review");
    expect(readdirSync(viewRoot).sort()).toEqual(["index.md", "pack", "spec"]);
    expect(existsSync(join(viewRoot, "spec", "orders.create-order.md"))).toBe(true);
    // No temp leftover: the tree lands via temp-then-rename.
    expect(readdirSync(join(exampleRoot, "generated")).sort()).toEqual([
      "design-review",
      "graph.json",
    ]);
  });

  it("owns the view directory wholesale: a stale page does not survive a re-render", () => {
    const stalePath = join(exampleRoot, "generated", "design-review", "spec", "orders.gone.md");
    mkdirSync(join(exampleRoot, "generated", "design-review", "spec"), { recursive: true });
    writeFileSync(stalePath, "# A spec deleted from the repo\n", "utf8");

    const exitCode = runSdpCli(["view", exampleRoot], createCaptureOutput().output);

    expect(exitCode).toBe(0);
    expect(existsSync(stalePath)).toBe(false);
  });

  it("regenerates the view byte-identically: delete generated/, re-view, same bytes", () => {
    const pagePath = join(
      exampleRoot,
      "generated",
      "design-review",
      "spec",
      "orders.create-order.md",
    );
    expect(runSdpCli(["view", exampleRoot], createCaptureOutput().output)).toBe(0);
    const firstRender = readFileSync(pagePath, "utf8");

    rmSync(join(exampleRoot, "generated"), { recursive: true, force: true });
    expect(runSdpCli(["view", exampleRoot], createCaptureOutput().output)).toBe(0);

    expect(readFileSync(pagePath, "utf8")).toBe(firstRender);
  });

  it("writes the view even when checks fail: findings render in it, the exit code is validate's", () => {
    const corpusRoot = materializeExtractCorpus("dangling-relation");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["view", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("conformance/referential-integrity");
      // Both artifacts stay — the graph and the view are faithful projections, and the
      // review surface exists to show exactly these findings in context.
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
      const indexPage = readFileSync(
        join(corpusRoot, "generated", "design-review", "index.md"),
        "utf8",
      );
      expect(indexPage).toContain("conformance/referential-integrity");
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("keeps build semantics on extraction hard errors: no graph, no view, stale view removed", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const staleViewPath = join(corpusRoot, "generated", "design-review", "index.md");
      mkdirSync(join(corpusRoot, "generated", "design-review"), { recursive: true });
      writeFileSync(staleViewPath, "# A view from a previous run\n", "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["view", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(false);
      // A stale view from a previous run is as dishonest as a stale graph.json.
      expect(existsSync(join(corpusRoot, "generated", "design-review"))).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("fails view --check-clean on a diverging second render: exit 1, the stale view removed", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const viewPath = join(corpusRoot, "generated", "design-review");
      mkdirSync(viewPath, { recursive: true });
      writeFileSync(join(viewPath, "index.md"), "# A view from a previous run\n", "utf8");

      // The divergence branch is unreachable from honest inputs (rendering is deterministic),
      // so the second render is forced to diverge through the injection seam.
      let renders = 0;
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["view", corpusRoot, "--check-clean"], capture.output, {
        renderDesignReview: (reader) => {
          renders += 1;
          const pages = renderDesignReview(reader);

          return renders === 1 ? pages : pages.slice(1);
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain(
        "sdp view --check-clean: two independent renders diverged — the view is not deterministic; any previous design-review at this root was removed.\n",
      );
      // The stale view is gone; graph.json stays — the build and its determinism check were clean.
      expect(existsSync(viewPath)).toBe(false);
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("fails clean when the render throws: one line on stderr, exit 1, the stale view removed", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const viewPath = join(corpusRoot, "generated", "design-review");
      mkdirSync(viewPath, { recursive: true });
      writeFileSync(join(viewPath, "index.md"), "# A view from a previous run\n", "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["view", corpusRoot], capture.output, {
        renderDesignReview: () => {
          throw new Error("ENOSPC: no space left on device, write");
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("sdp view: ENOSPC: no space left on device, write\n");
      expect(existsSync(viewPath)).toBe(false);
      // graph.json stays: it was written by a clean build, and the check errors (none here) and
      // the render failure describe the run, not that artifact.
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });
});

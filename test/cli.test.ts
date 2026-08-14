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

import { afterAll, describe, expect, it, vi } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { SDP_HELP_TEXT, isCliEntrypoint, onStdoutError, runSdpCli } from "../src/cli/sdp.js";
import { generateContracts } from "../src/codegen/contracts.js";
import { extract } from "../src/extract/index.js";
import { renderDesignReview } from "../src/projections/design-review.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import {
  materializeExtractCorpus,
  materializeGherkinCorpus,
  removeMaterializedCorpus,
} from "./helpers/extract-corpus.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleRoot = join(repoRoot, "examples", "checkout-v1");

/**
 * A working-tree copy of the example's authored surfaces at a temp root. Every CLI test that
 * writes or deletes generated artifacts runs on a copy, never on the in-repo example: the
 * example's own bound test imports generated/contracts at collection time, and a parallel test
 * worker rewriting that tree mid-run would race it — the executable tracer made generated/ a
 * live import target.
 */
function materializeExampleCopy(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-example-copy-"));

  for (const surface of ["specs", "src", "test"]) {
    cpSync(join(exampleRoot, surface), join(root, surface), { recursive: true });
  }

  return root;
}

function materializeSelfHostingCopy(): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-copy-"));

  for (const surface of ["specs", "src", "test"]) {
    cpSync(join(repoRoot, surface), join(root, surface), {
      recursive: true,
      filter: (source) => !source.endsWith(".test.generated.ts"),
    });
  }

  return root;
}

function readGeneratedTree(root: string): ReadonlyMap<string, string> {
  const tree = new Map<string, string>();
  const generatedRoot = join(root, "generated");

  for (const entry of readdirSync(generatedRoot, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) {
      const absolute = join(entry.parentPath, entry.name);
      tree.set(absolute.slice(generatedRoot.length + 1), readFileSync(absolute, "utf8"));
    }
  }

  return tree;
}

describe("sdp cli", () => {
  afterAll(() => {
    expect(existsSync(join(repoRoot, "generated", "graph.json"))).toBe(true);
    expect(existsSync(join(repoRoot, "generated", "contracts"))).toBe(true);
    expect(existsSync(join(repoRoot, "generated", "design-review"))).toBe(true);
  });

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

  it("builds the checkout-v1 example: writes graph.json + contracts (and no temp leftover) and exits 0", () => {
    const root = materializeExampleCopy();

    try {
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(["build", root], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(capture.readStdout()).toContain(
        "11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges",
      );
      expect(capture.readStdout()).toContain("(3 modules)");
      expect(readdirSync(join(root, "generated")).sort()).toEqual(["contracts", "graph.json"]);
      expect(readdirSync(join(root, "generated", "contracts")).sort()).toEqual([
        "orders.create-order.invalid-cart.contract.ts",
        "orders.create-order.space.ts",
        "orders.create-order.valid-cart.contract.ts",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("invalidates an existing Design Review when build replaces its source graph", () => {
    const root = materializeExampleCopy();

    try {
      expect(runSdpCli(["view", root], createCaptureOutput().output)).toBe(0);
      const viewPath = join(root, "generated", "design-review");
      expect(existsSync(viewPath)).toBe(true);

      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);

      expect(existsSync(viewPath)).toBe(false);
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(true);
      expect(existsSync(join(root, "generated", "contracts"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("views the self-hosting corpus from the default repository root", () => {
    // Exercise the no-root-argument default against an isolated corpus. Writing the live root
    // here races read-only CLI suites under Vitest's file-level parallelism.
    const root = materializeSelfHostingCopy();
    const cwd = vi.spyOn(process, "cwd").mockReturnValue(root);

    try {
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(
        [
          "view",
          "--check-clean",
          "--exclude",
          "explorations",
          "--exclude",
          "examples",
          "--exclude",
          "test/fixtures/import/parity",
        ],
        capture.output,
      );

      expect(exitCode).toBe(0);
      expect(capture.readStderr()).toBe("");
      expect(capture.readStdout()).toContain("validate: 0 errors · 0 warnings");
      expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
        '"id": "pack:self-hosting-v1"',
      );
      expect(existsSync(join(root, "generated", "design-review"))).toBe(true);
    } finally {
      cwd.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  }, 15_000);

  it("renders contracts warnings through the one formatter and counts them in the summary", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-contracts-warning-"));

    try {
      mkdirSync(join(root, "specs"), { recursive: true });
      writeFileSync(
        join(root, "specs", "parent.sdp.ts"),
        `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const parentSpec = spec({
  id: specId("spec:orders.create-order"),
  title: "Customer creates an order",
  kind: "behavior",
  altitude: "feature",
  readiness: "idea",
  intent: { outcome: "Turn a valid cart into an order." },
  behavior: {
    exampleSpace: {
      given: ["a customer has a cart with {n:number} line items"],
      when: ["the customer submits the cart for order creation"],
      then: ["an order is created"],
    },
  },
});

`,
        "utf8",
      );
      writeFileSync(
        join(root, "specs", "child.sdp.ts"),
        `import { refines, spec, specId } from "@libar-dev/software-delivery-protocol";

export const childSpec = spec({
  id: specId("spec:orders.create-order.stray"),
  title: "A stray binding",
  kind: "example",
  altitude: "story",
  readiness: "defined",
  intent: { outcome: "Bind a slot the parent never declares." },
  behavior: {
    examples: [
      {
        given: ["a customer has a cart with {n: 2} line items", "the cart weighs {kg: 3}"],
        when: ["the customer submits the cart for order creation"],
        then: ["an order is created"],
      },
    ],
  },
  relations: [refines(specId("spec:orders.create-order"))],
});
`,
        "utf8",
      );

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root], capture.output);

      // A contracts warning never gates (exit 0), renders location-first through the one
      // formatter, and counts into the build summary beside the extraction findings.
      expect(exitCode).toBe(0);
      expect(capture.readStderr()).toMatch(/\[warning\] contracts\/undeclared-slot — /);
      expect(capture.readStderr()).toMatch(/\[warning\] contracts\/unmatched-vocabulary-step — /);
      expect(capture.readStdout()).toContain("(0 errors, 2 warnings)");
      expect(existsSync(join(root, "generated", "contracts"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("withholds case-colliding contract paths with a warning: graph kept, nothing gates", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-case-collision-"));

    try {
      mkdirSync(join(root, "specs"), { recursive: true });

      const exampleSource = (idSegment: string): string =>
        `import { spec, specId } from "@libar-dev/software-delivery-protocol";

export const example${idSegment.replace(/[^A-Za-z0-9]/gu, "")} = spec({
  id: specId("spec:orders.${idSegment}"),
  title: "Case twin ${idSegment}",
  kind: "example",
  altitude: "story",
  readiness: "defined",
  intent: { outcome: "Collide on a case-insensitive filesystem." },
  behavior: {
    examples: [
      {
        given: ["a cart with {n: 1} line items"],
        when: ["the cart is submitted"],
        then: ["an order is created"],
      },
    ],
  },
});
`;
      writeFileSync(join(root, "specs", "lower.sdp.ts"), exampleSource("case-twin"), "utf8");
      writeFileSync(join(root, "specs", "upper.sdp.ts"), exampleSource("case-Twin"), "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root], capture.output);

      // A codegen degradation warns and withholds — it never gates (warnings never do; gating
      // is validateGraph's alone). The graph stays; the contracts tree is withheld whole (the
      // artifact is all-or-nothing — no partial tree may read as current), so no contracts
      // directory appears at all.
      expect(exitCode).toBe(0);
      expect(capture.readStderr()).toMatch(/\[warning\] contracts\/case-colliding-path — /);
      expect(capture.readStderr()).toContain("the contracts tree is not written");
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(true);
      expect(existsSync(join(root, "generated", "contracts"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("passes --check-clean on the example (determinism self-check through the CLI)", () => {
    const root = materializeExampleCopy();

    try {
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(["build", root, "--check-clean"], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStderr()).toBe("");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("end-to-end determinism self-check: delete generated/, rebuild, byte-identical", () => {
    const root = materializeExampleCopy();

    try {
      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);
      const firstBuild = readGeneratedTree(root);

      rmSync(join(root, "generated"), { recursive: true, force: true });
      expect(runSdpCli(["build", root], createCaptureOutput().output)).toBe(0);

      // The whole generated tree — graph.json and every contract module — regenerates
      // byte-identically.
      expect(readGeneratedTree(root)).toEqual(firstBuild);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
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
    expect(capture.readStderr()).toBe("sdp build: unknown option --bogus\n");
  });

  it.each(["build", "validate", "view"] as const)(
    "accepts repeatable --exclude paths for %s",
    (command) => {
      // Given: a disposable authored model and two valid consumer prefixes.
      const root = materializeExtractCorpus("anchored-binding");

      try {
        const capture = createCaptureOutput();
        const extractionOptions: Parameters<typeof extract>[0][] = [];

        // When: each extraction command receives repeatable exclusions.
        const exitCode = runSdpCli(
          [command, root, "--exclude", "future", "--exclude", "also-future"],
          capture.output,
          {
            extract: (options) => {
              extractionOptions.push(options);
              return extract(options);
            },
          },
        );

        // Then: parsing succeeds and the normalized options reach the extractor.
        expect(exitCode).toBe(0);
        expect(extractionOptions).toEqual([{ root, exclude: ["future", "also-future"] }]);
      } finally {
        removeMaterializedCorpus(root);
      }
    },
  );

  it("uses the identical normalized exclusions in both --check-clean extractions", () => {
    // Given: a clean disposable corpus and duplicate consumer options.
    const root = materializeExtractCorpus("anchored-binding");

    try {
      const extractionOptions: Parameters<typeof extract>[0][] = [];

      // When: the clean-check reruns extraction.
      const exitCode = runSdpCli(
        ["build", root, "--exclude", "explorations", "--exclude", "explorations", "--check-clean"],
        createCaptureOutput().output,
        {
          extract: (options) => {
            extractionOptions.push(options);
            return extract(options);
          },
        },
      );

      // Then: both passes receive the same deduplicated options object shape.
      expect(exitCode).toBe(0);
      expect(extractionOptions).toEqual([
        { root, exclude: ["explorations"] },
        { root, exclude: ["explorations"] },
      ]);
    } finally {
      removeMaterializedCorpus(root);
    }
  });

  it.each([
    "",
    ".",
    "./explorations",
    "explorations/",
    "/explorations",
    "../x",
    "a/../b",
    "a//b",
    "a\\b",
  ])("refuses invalid --exclude path %j before build writes", (exclude) => {
    // Given: a writable empty root and an invalid consumer prefix.
    const root = mkdtempSync(join(tmpdir(), "sdp-invalid-exclude-"));

    try {
      const capture = createCaptureOutput();

      // When: build parses the option.
      const exitCode = runSdpCli(["build", root, "--exclude", exclude], capture.output);

      // Then: invocation fails in one line and no artifact directory is created.
      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe(`sdp build: invalid --exclude path "${exclude}"\n`);
      expect(capture.readStderr().trimEnd().split("\n")).toHaveLength(1);
      expect(existsSync(join(root, "generated"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a missing --exclude operand before build writes", () => {
    // Given: a writable empty root.
    const root = mkdtempSync(join(tmpdir(), "sdp-missing-exclude-"));

    try {
      const capture = createCaptureOutput();

      // When: the option has no following path.
      const exitCode = runSdpCli(["build", root, "--exclude"], capture.output);

      // Then: the error is one invocation line and no artifact directory is created.
      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe("sdp build: --exclude requires a path.\n");
      expect(capture.readStderr().trimEnd().split("\n")).toHaveLength(1);
      expect(existsSync(join(root, "generated"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("names a flag supplied as an --exclude operand before build writes", () => {
    // Given: a writable empty root and a flag where an exclusion path is required.
    const root = mkdtempSync(join(tmpdir(), "sdp-flag-exclude-"));

    try {
      const capture = createCaptureOutput();

      // When: the option consumes another flag instead of a path.
      const exitCode = runSdpCli(["build", root, "--exclude", "--foo"], capture.output);

      // Then: the usage error identifies the offending flag and no artifact directory is created.
      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe("sdp build: --exclude expects a path, got --foo\n");
      expect(existsSync(join(root, "generated"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("documents repeatable --exclude paths in help", () => {
    expect(SDP_HELP_TEXT).toContain("[--exclude PATH]...");
    expect(SDP_HELP_TEXT).toContain("*.sdp.ts, *.sdp.md, and *.sdp.gherkin");
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
        `note: no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found under ${emptyRoot}`,
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
      // `build` resolves synchronously; only `q` returns a promise from the dispatcher, so the
      // discarded result here is a number and the `void` states that rather than hiding a wait.
      void runSdpCli(["build", corpusRoot], capture.output);

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

  it("renders a Gherkin parser failure through the public CLI", () => {
    const corpusRoot = materializeGherkinCorpus("syntax-error");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toMatch(
        /broken\.sdp\.gherkin:4 — \[error\] extract\/gherkin-syntax — /,
      );
      expect(capture.readStderr()).toContain("graph.json not written");
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("exits 1, writes nothing, and removes a stale graph.json on a hard-error corpus", () => {
    const corpusRoot = materializeExtractCorpus("invalid-non-static-id");

    try {
      const stalePath = join(corpusRoot, "generated", "graph.json");
      const staleView = join(corpusRoot, "generated", "design-review", "index.md");
      mkdirSync(join(corpusRoot, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");
      mkdirSync(join(corpusRoot, "generated", "design-review"), { recursive: true });
      writeFileSync(staleView, "# Previous review\n", "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/non-static-envelope");
      expect(capture.readStderr()).toContain("graph.json not written");
      // The stale artifact is gone: a failed build leaves no graph that could read as current.
      expect(existsSync(stalePath)).toBe(false);
      expect(existsSync(join(corpusRoot, "generated", "design-review"))).toBe(false);
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
        "sdp build --check-clean: two independent extractions diverged — the build is not deterministic.\n",
      );
      // The stale artifact is gone: nothing at this root reads as current.
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("fails --check-clean on a diverging second contract generation: exit 1, no artifact survives", () => {
    const root = materializeExampleCopy();

    try {
      // Contract generation is a pure function of the graph (deterministic), so the divergence
      // branch is forced through the injection seam — same law as the extraction twin above.
      let generations = 0;
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root, "--check-clean"], capture.output, {
        generateContracts: (graph) => {
          generations += 1;
          const result = generateContracts(graph);

          return generations === 1
            ? result
            : { ...result, files: new Map([["diverged.contract.ts", "// diverged\n"]]) };
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain(
        "sdp build --check-clean: two independent contract generations diverged — the build is not deterministic.\n",
      );
      // Nothing at this root reads as current: neither the graph nor a contracts tree.
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(false);
      expect(existsSync(join(root, "generated", "contracts"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("owns the contracts tree wholesale: with nothing to generate, a stale contracts dir is removed", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const staleContract = join(corpusRoot, "generated", "contracts", "orders.gone.contract.ts");
      mkdirSync(join(corpusRoot, "generated", "contracts"), { recursive: true });
      writeFileSync(staleContract, "// a contract from a previous run\n", "utf8");

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(0);
      // No example space and no bindable example in this corpus: nothing generates, the "Wrote
      // … contracts" line stays silent, and the stale tree from a previous run must not read as
      // current.
      expect(capture.readStdout()).not.toContain("modules");
      expect(existsSync(join(corpusRoot, "generated", "contracts"))).toBe(false);
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
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

  it("fails clean when generated exists as a file: one line each for build and view, never a stack trace", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      // `generated` as a file makes the write phase throw — and the recovery itself must not
      // re-throw (a non-recursive remove raises ENOTDIR through a file parent).
      writeFileSync(join(corpusRoot, "generated"), "not a directory\n", "utf8");

      const buildCapture = createCaptureOutput();
      expect(runSdpCli(["build", corpusRoot], buildCapture.output)).toBe(1);
      expect(buildCapture.readStderr()).toMatch(/^sdp build: /);
      expect(buildCapture.readStderr().trimEnd().split("\n")).toHaveLength(1);
      expect(buildCapture.readStderr()).not.toContain("    at ");

      const viewCapture = createCaptureOutput();
      expect(runSdpCli(["view", corpusRoot], viewCapture.output)).toBe(1);
      expect(viewCapture.readStderr()).not.toContain("    at ");
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("names the survivor when a recovery-path removal is denied: a stale artifact never silently reads as current", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-denied-removal-"));

    try {
      const stalePath = join(root, "generated", "graph.json");
      mkdirSync(join(root, "generated"), { recursive: true });
      writeFileSync(stalePath, '{ "stale": true }\n', "utf8");

      // A denied removal (EACCES/EPERM) is deterministic only through the injection seam — never
      // a chmod trick in a test. The nothing-readable failures (ENOENT/ENOTDIR) stay silent; any
      // other failure must name the survivor instead of silently breaking the removal promise.
      const denyExisting: typeof rmSync = (path) => {
        if (existsSync(path)) {
          const denied: NodeJS.ErrnoException = new Error("EACCES: permission denied");
          denied.code = "EACCES";
          throw denied;
        }
      };

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root], capture.output, {
        extract: () => {
          throw new Error("extractor exploded");
        },
        rmSync: denyExisting,
      });

      expect(exitCode).toBe(1);
      const lines = capture.readStderr().trimEnd().split("\n");
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe("sdp build: extractor exploded");
      expect(lines[1]).toContain(`sdp build: stale ${stalePath} could not be removed`);
      expect(lines[1]).toContain("do not read it as current");
      expect(capture.readStderr()).not.toContain("    at ");
      // The artifact genuinely survived — the survivor line told the truth.
      expect(existsSync(stalePath)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("stops a build when an existing Design Review cannot be invalidated", () => {
    const root = materializeExampleCopy();

    try {
      const staleView = join(root, "generated", "design-review", "index.md");
      mkdirSync(join(root, "generated", "design-review"), { recursive: true });
      writeFileSync(staleView, "# Previous review\n", "utf8");
      const denyView: typeof rmSync = (path, options) => {
        if (String(path).includes("design-review") && existsSync(path)) {
          const denied: NodeJS.ErrnoException = new Error("EACCES: permission denied");
          denied.code = "EACCES";
          throw denied;
        }

        rmSync(path, options);
      };
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(["build", root], capture.output, { rmSync: denyView });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain(`stale ${join(root, "generated", "design-review")}`);
      expect(capture.readStderr()).toContain("build stopped so it cannot read as current");
      expect(existsSync(staleView)).toBe(true);
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("fails clean when the checks throw: one line, exit 1, the built graph.json stays", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["validate", corpusRoot], capture.output, {
        validateGraph: () => {
          throw new Error("validator exploded");
        },
      });

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toBe("sdp validate: validator exploded\n");
      // The graph was cleanly built before the checks ran; the failure describes the checks,
      // not the artifact, so graph.json stays.
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("suppresses the empty-model note when spec files were found but none reified — a failed file is not an absent one", () => {
    const corpusRoot = materializeExtractCorpus("invalid-wrong-builder");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toContain("extract/invalid-id");
      expect(capture.readStderr()).not.toContain(
        "no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found",
      );
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("treats a root of only ordinary .feature files as an empty authored model, not a missing-identity error", () => {
    const featureOnlyRoot = mkdtempSync(join(tmpdir(), "sdp-feature-only-cli-"));

    try {
      writeFileSync(
        join(featureOnlyRoot, "cucumber-login.feature"),
        ["Feature: Login", "  Scenario: user logs in", "    Given valid credentials", ""].join(
          "\n",
        ),
        "utf8",
      );

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", featureOnlyRoot], capture.output);

      // Ordinary Cucumber is not a carrier: empty model, exit 0 — never a Gherkin identity refusal.
      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toContain("0 specs · 0 packs · 0 anchors");
      expect(capture.readStderr()).toContain(
        `note: no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found under ${featureOnlyRoot}`,
      );
      expect(capture.readStderr()).not.toContain("missing @spec");
      expect(capture.readStderr()).not.toContain("extract/gherkin-grammar");
      expect(existsSync(join(featureOnlyRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      rmSync(featureOnlyRoot, { recursive: true, force: true });
    }
  });

  it("suppresses the empty-model note when a failed .sdp.gherkin finding.file matches the carrier suffix predicate", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-gherkin-failed-cli-"));

    try {
      writeFileSync(
        join(root, "broken.sdp.gherkin"),
        ["@altitude.feature", "@readiness.defined", "Feature: Missing identity", ""].join("\n"),
        "utf8",
      );

      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", root], capture.output);

      // Code-level finding.file suffix predicate: a discovered-but-refused carrier is not "absent".
      expect(exitCode).toBe(1);
      expect(capture.readStderr()).toMatch(
        /broken\.sdp\.gherkin:\d+ — \[error\] extract\/gherkin-grammar — /,
      );
      expect(capture.readStderr()).toContain("missing @spec");
      expect(capture.readStderr()).not.toContain(
        "no *.sdp.ts, *.sdp.md, or *.sdp.gherkin spec files found",
      );
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("builds a mixed root with one .sdp.gherkin carrier and ignores the ordinary .feature sibling", () => {
    const corpusRoot = materializeGherkinCorpus("suffix-discovery");

    try {
      const capture = createCaptureOutput();
      const exitCode = runSdpCli(["build", corpusRoot], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toContain("1 specs · 0 packs · 0 anchors");
      expect(capture.readStderr()).not.toContain("missing @spec");
      expect(capture.readStderr()).not.toContain("extract/gherkin-grammar");
      expect(capture.readStderr()).not.toContain("no *.sdp.ts, *.sdp.md, or *.sdp.gherkin");
      expect(existsSync(join(corpusRoot, "generated", "graph.json"))).toBe(true);
    } finally {
      removeMaterializedCorpus(corpusRoot);
    }
  });

  it("removes the temp twin on a failed build and a failed view — no partial .tmp artifact survives", () => {
    const corpusRoot = materializeExtractCorpus("anchored-binding");

    try {
      const temporaryGraph = join(corpusRoot, "generated", "graph.json.tmp");
      const temporaryView = join(corpusRoot, "generated", "design-review.tmp");
      mkdirSync(join(corpusRoot, "generated"), { recursive: true });
      writeFileSync(temporaryGraph, "partial\n", "utf8");
      mkdirSync(temporaryView, { recursive: true });
      writeFileSync(join(temporaryView, "index.md"), "partial\n", "utf8");

      let extractions = 0;
      const buildCapture = createCaptureOutput();
      const buildExit = runSdpCli(["build", corpusRoot, "--check-clean"], buildCapture.output, {
        extract: (options) => {
          extractions += 1;
          const result = extract(options);

          return extractions === 1 ? result : { ...result, graph: { ...result.graph, edges: [] } };
        },
      });

      expect(buildExit).toBe(1);
      expect(existsSync(temporaryGraph)).toBe(false);

      mkdirSync(temporaryView, { recursive: true });
      writeFileSync(join(temporaryView, "index.md"), "partial\n", "utf8");

      let renders = 0;
      const viewCapture = createCaptureOutput();
      const viewExit = runSdpCli(["view", corpusRoot, "--check-clean"], viewCapture.output, {
        renderDesignReview: (reader) => {
          renders += 1;
          const pages = renderDesignReview(reader);

          return renders === 1 ? pages : pages.slice(1);
        },
      });

      expect(viewExit).toBe(1);
      expect(existsSync(temporaryView)).toBe(false);
    } finally {
      removeMaterializedCorpus(corpusRoot);
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

  it("exits 0 quietly on a stdout EPIPE and stays fatal for any other stream error", () => {
    // The entrypoint installs this handler on process.stdout: a downstream reader closing early
    // (`sdp q '…' --json | head`) must end the process quietly at 0, never as an engine stack.
    const exits: number[] = [];
    const epipe = Object.assign(new Error("write EPIPE"), { code: "EPIPE" });

    onStdoutError(epipe, (code) => exits.push(code));
    expect(exits).toEqual([0]);

    const foreign = Object.assign(new Error("write EACCES"), { code: "EACCES" });
    expect(() => {
      onStdoutError(foreign, (code) => exits.push(code));
    }).toThrow("write EACCES");
    expect(exits).toEqual([0]);
  });

  it("validates the example: exit 0, the artifact written, and exactly the one surfaced warning", () => {
    const root = materializeExampleCopy();

    try {
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(["validate", root, "--check-clean"], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toContain(
        "11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges",
      );
      expect(capture.readStdout()).toContain(
        "validate: 0 errors · 1 warnings (conformance + honesty over the one graph)",
      );
      // The standing warning is the invalid-cart example's unenabled verifier — informative,
      // never a gate (it is the surfaced absence the check exists for, not noise to silence).
      expect(capture.readStderr()).toContain("conformance/verifies-linkage");
      expect(capture.readStderr()).not.toContain("[error]");
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
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
    const root = materializeExampleCopy();

    try {
      const capture = createCaptureOutput();

      const exitCode = runSdpCli(["view", root, "--check-clean"], capture.output);

      expect(exitCode).toBe(0);
      expect(capture.readStdout()).toContain(
        "validate: 0 errors · 1 warnings (conformance + honesty over the one graph)",
      );
      expect(capture.readStdout()).toContain("(13 pages)");

      const viewRoot = join(root, "generated", "design-review");
      expect(readdirSync(viewRoot).sort()).toEqual(["index.md", "pack", "spec"]);
      expect(existsSync(join(viewRoot, "spec", "orders.create-order.md"))).toBe(true);
      // No temp leftover: the trees land via temp-then-rename.
      expect(readdirSync(join(root, "generated")).sort()).toEqual([
        "contracts",
        "design-review",
        "graph.json",
      ]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("owns the view directory wholesale: a stale page does not survive a re-render", () => {
    const root = materializeExampleCopy();

    try {
      const stalePath = join(root, "generated", "design-review", "spec", "orders.gone.md");
      mkdirSync(join(root, "generated", "design-review", "spec"), { recursive: true });
      writeFileSync(stalePath, "# A spec deleted from the repo\n", "utf8");

      const exitCode = runSdpCli(["view", root], createCaptureOutput().output);

      expect(exitCode).toBe(0);
      expect(existsSync(stalePath)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("regenerates the view byte-identically: delete generated/, re-view, same bytes", () => {
    const root = materializeExampleCopy();

    try {
      const pagePath = join(root, "generated", "design-review", "spec", "orders.create-order.md");
      expect(runSdpCli(["view", root], createCaptureOutput().output)).toBe(0);
      const firstRender = readFileSync(pagePath, "utf8");

      rmSync(join(root, "generated"), { recursive: true, force: true });
      expect(runSdpCli(["view", root], createCaptureOutput().output)).toBe(0);

      expect(readFileSync(pagePath, "utf8")).toBe(firstRender);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
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
        "sdp view --check-clean: two independent renders diverged — the view is not deterministic.\n",
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

const cleanRepoDeterminismTestAnchor = specTest({
  id: testAnchorId("test:protocol.extraction-determinism"),
  label: "clean-repo pipeline determinism verifies byte-identical output",
  verifies: ref("spec:extraction.determinism"),
});
void cleanRepoDeterminismTestAnchor;

it("clean-repo determinism: the full pipeline at a different absolute path is byte-identical", () => {
  const firstRoot = materializeExampleCopy();
  const secondRoot = materializeExampleCopy();

  try {
    expect(runSdpCli(["view", firstRoot, "--check-clean"], createCaptureOutput().output)).toBe(0);
    expect(runSdpCli(["view", secondRoot, "--check-clean"], createCaptureOutput().output)).toBe(0);
    expect(readGeneratedTree(secondRoot)).toEqual(readGeneratedTree(firstRoot));
  } finally {
    rmSync(firstRoot, { recursive: true, force: true });
    rmSync(secondRoot, { recursive: true, force: true });
  }
});

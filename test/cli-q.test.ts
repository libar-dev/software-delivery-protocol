import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isatty } from "node:tty";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

import { verbHelpText } from "../src/cli/help.js";
import { queryHint, recipeListing } from "../src/cli/recipe-catalog.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { answeredStderr } from "./helpers/query-hint.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";
import { isOsMetadataFile } from "../src/projections/published-tree.js";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/**
 * A content fingerprint of a tree, `"absent"` when it does not exist: the "writes nothing" case
 * compares before and after, so it detects a write at the invoking root without requiring the
 * gitignored `generated/` tree to exist (both reads are `"absent"` in a clean clone).
 */
function fingerprintTree(root: string): string {
  if (!existsSync(root)) {
    return "absent";
  }

  const hash = createHash("sha256");

  const walk = (directory: string): void => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    for (const entry of entries) {
      if (isOsMetadataFile(entry)) continue;
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(path);
      } else {
        hash.update(path);
        hash.update(readFileSync(path));
      }
    }
  };

  walk(root);
  return hash.digest("hex");
}

// A committed corpus root, materialized per suite: the sink derives the graph in process from real
// on-disk files, so the fixture exercises the same production path the repository root does at a
// size the assertions can read. The suite never names the repository root as `--root`, so nothing
// here can touch root generated/ and the file stays in the pooled test leg.
const corpusRoot = materializeExtractCorpus("anchored-binding");
const parentId = "spec:orders.anchored-parent";
const exampleId = "spec:orders.anchored-parent.example";

// stdin is a real terminal-or-not decision in production; the suite drives both answers through the
// injected hooks rather than reshaping the process's own descriptors under a parallel test runner.
const pipedStdin = (body: string) => ({
  query: { isStdinTty: () => false, readStdin: () => body },
});
const terminalStdin = {
  query: {
    isStdinTty: () => true,
    readStdin: (): string => {
      throw new Error("stdin must never be read when it is a terminal");
    },
  },
};

async function runQ(
  args: readonly string[],
  capture: ReturnType<typeof createCaptureOutput>,
  hooks: Parameters<typeof runSdpCli>[2] = {},
): Promise<number> {
  return await runSdpCli(["q", ...args], capture.output, hooks);
}

const evaluationSinkTestAnchor = specTest({
  id: testAnchorId("test:protocol.evaluation-sink"),
  label: "front-door checks verify how the sink takes a body, prints its return and refuses",
  verifies: ref("spec:consumers.agent-surface.evaluation-sink"),
});
void evaluationSinkTestAnchor;

describe("sdp q — the agent front door", () => {
  afterAll(() => {
    removeMaterializedCorpus(corpusRoot);
  });

  it("evaluates an argv body over the derived graph and prints the pre-shaped return", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return g.specs().map((spec) => spec.id)", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`[ '${parentId}', '${exampleId}' ]\n`);
    expect(capture.readStderr()).toBe(answeredStderr);
  });

  it("reads the body from stdin when stdin is not a terminal", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["--root", corpusRoot],
      capture,
      pipedStdin("return g.specs().length"),
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("2\n");
  });

  it("prefers the argv body over stdin when both are available", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 'argv'", "--root", corpusRoot],
      capture,
      pipedStdin("return 'stdin'"),
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("'argv'\n");
  });

  it("refuses with no body when stdin is a terminal instead of waiting on it", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("no body supplied and stdin is a terminal");
  });

  it("refuses an empty body rather than evaluating nothing", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["   ", "--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toContain("the body is empty");
  });

  it("lists the catalog's categories and the call forms when no body arrives, deriving no graph", async () => {
    // Read apart from the engine's parser: each category heading and the first row under it.
    const index = readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8").split(
      /^## 1\. /mu,
    )[0];
    const firstRows = [
      ...(index ?? "").matchAll(
        /^### (.+)\n\n\| No\.[^\n]*\n\| -[^\n]*\n\| (\d+) \| ([^|]+) \|/gmu,
      ),
    ].map((match) => `  ${match[1] ?? ""}: ${match[2] ?? ""} ${(match[3] ?? "").trim()}`);
    expect(firstRows.length).toBeGreaterThan(1);
    const noGraph = { extract: () => expect.unreachable("a call with no body derives no graph") };

    for (const [args, stdin, refusal] of [
      [[], { isStdinTty: () => true }, "sdp q: no body supplied and stdin is a terminal."],
      [[], { isStdinTty: () => false, readStdin: () => "" }, "sdp q: the body is empty"],
      [["  \n"], { isStdinTty: () => true }, "sdp q: the body is empty"],
    ] as const) {
      const capture = createCaptureOutput();
      const exitCode = await runQ([...args, "--root", corpusRoot], capture, {
        query: { ...stdin, ...noGraph },
      });
      const stderr = capture.readStderr();

      expect({ exitCode, stdout: capture.readStdout() }).toEqual({ exitCode: 1, stdout: "" });
      expect(stderr.startsWith(refusal)).toBe(true);
      expect(stderr).toContain("docs/agent-surface/recipes.md holds each one's parameters");
      for (const row of firstRows) expect(stderr).toContain(row);
      expect(stderr).toContain("dist/recipes/NN-slug.js");
      expect(stderr).toContain("await recipes(N, {})");
      expect(stderr).not.toContain("hint:");
    }
  });

  // spec:consumers.agent-surface.recipe-parameters#rule.missingSubject: the help an agent reads
  // for the verb says what a recipe does without its subject, never that it answers a sample.
  it("states in its help that a recipe refuses an absent subject", () => {
    const help = (verbHelpText("q") ?? "").replaceAll(/\s+/gu, " ");

    expect(help).toContain(
      "one that answers for a subject refuses, naming the parameter, when that subject is absent",
    );
    expect(help).not.toMatch(/falls back to the catalog's sample/u);
  });

  it("ends an answered call's stderr with one hint line and keeps stdout to the answer", async () => {
    const recipeCount = (
      readFileSync(join(repoRoot, "docs/agent-surface/recipes.md"), "utf8").match(
        /^## \d+\. /gmu,
      ) ?? []
    ).length;
    const answered = createCaptureOutput();
    expect(await runQ(["return 1", "--root", corpusRoot, "--json"], answered, terminalStdin)).toBe(
      0,
    );
    expect(answered.readStdout()).toBe("1\n");
    expect(answered.readStderr()).toBe(
      `hint: run q with no body to list the ${String(recipeCount)} recipes by category; inside a body, await recipes(N, params) runs recipe N.\n`,
    );

    const nothing = createCaptureOutput();
    expect(await runQ(["return undefined", "--root", corpusRoot], nothing, terminalStdin)).toBe(0);
    expect(nothing.readStderr()).toBe(
      `sdp q: the body returned nothing — \`return\` is the output contract.\n${answeredStderr}`,
    );

    const refused = createCaptureOutput();
    expect(
      await runQ(["throw new Error('no')", "--root", corpusRoot], refused, terminalStdin),
    ).toBe(1);
    expect(refused.readStderr()).toBe("sdp q: no\n");
  });

  it("falls back to the call forms and a shorter hint when the catalog cannot be read", () => {
    expect(queryHint([])).toBe(
      "hint: inside a body, await recipes(N, params) runs catalog recipe N.",
    );
    expect(recipeListing([], "").startsWith("Call forms:\n")).toBe(true);
    const prefixed = recipeListing(
      [{ name: "Probe", recipes: [{ number: 7, name: "One", parameters: "none", use: "Use" }] }],
      "node_modules/pkg/",
    );
    expect(prefixed).toContain("node_modules/pkg/docs/agent-surface/recipes.md");
    expect(prefixed).toContain("  Probe: 7 One\n");
    expect(prefixed).toContain('"$(cat node_modules/pkg/dist/recipes/NN-slug.js)"');
  });

  it("quotes a package path a shell would split or expand in the recipe call form", () => {
    const place = mkdtempSync(join(tmpdir(), "sdp-catalog-quote-"));
    try {
      const prefix = "My SDK/it's $HOME `x`/";
      mkdirSync(join(place, prefix, "dist", "recipes"), { recursive: true });
      writeFileSync(join(place, prefix, "dist", "recipes", "NN-slug.js"), "return 1;");
      const form = /"\$\(cat .+?\)"/u.exec(recipeListing([], prefix))?.[0] ?? "";

      expect(form).toBe(`"$(cat 'My SDK/it'\\''s $HOME \`x\`/dist/recipes/NN-slug.js')"`);
      // Copied into a shell as printed, the substitution reads the one file.
      const copied = spawnSync(`printf %s ${form}`, { cwd: place, encoding: "utf8", shell: true });
      expect({ status: copied.status, stdout: copied.stdout }).toEqual({
        status: 0,
        stdout: "return 1;",
      });
    } finally {
      rmSync(place, { recursive: true, force: true });
    }
  });

  it("prints JSON for --json", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return { ids: g.specs().map((spec) => spec.id) }", "--root", corpusRoot, "--json"],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({ ids: [parentId, exampleId] });
  });

  it("exits 1 and names the failure when the body throws", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["throw new Error('the body refused')", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q: the body refused");
  });

  it("exits 1 on a body that does not compile", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return (", "--root", corpusRoot], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q:");
  });

  it("awaits an asynchronous body", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return await Promise.resolve(g.specs().length)", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("2\n");
  });

  it("injects a live reader: the entry adapters answer from the derived graph", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "const context = g.specContext(g.specs()[0].id); return { concept: g.findByConcept('anchored').length > 0, boundSpecs: g.byFile('bindings.ts').specs, facts: context.deliveryFacts };",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      concept: true,
      boundSpecs: [parentId, exampleId],
      facts: ["implemented", "has-verifier"],
    });
  });

  it("injects the raw graph schema alongside the reader", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { sameGraph: graph === g.graph, nodeTypes: [...new Set(graph.nodes.map((node) => node.nodeType))].sort() }",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      sameGraph: true,
      nodeTypes: ["Anchor", "CodeNode", "Primitive"],
    });
  });

  it("injects the validation report as data, never as a gate", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { validatorId: report.validatorId, findings: report.findings.length, sameAsReader: report.findings.length === g.findings().length }",
        "--root",
        corpusRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      validatorId: "graph",
      findings: 0,
      sameAsReader: true,
    });
  });

  it("runs the body when the graph merely reports findings — checks never gate the read path", async () => {
    const findingRoot = materializeExtractCorpus("orphan-spec");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        [
          "return report.findings.map((finding) => finding.severity)",
          "--root",
          findingRoot,
          "--json",
        ],
        capture,
        terminalStdin,
      );

      expect(exitCode).toBe(0);

      const severities = JSON.parse(capture.readStdout()) as readonly string[];
      expect(severities.length).toBeGreaterThan(0);
      expect(severities).not.toContain("error");
    } finally {
      removeMaterializedCorpus(findingRoot);
    }
  });

  it("refuses to run the body when the graph does not derive, rendering the extraction findings", async () => {
    const brokenRoot = materializeExtractCorpus("duplicate-id");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        ["return 'the body must not run'", "--root", brokenRoot],
        capture,
        terminalStdin,
      );

      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toContain("[error]");
      expect(capture.readStderr()).toContain("the graph did not derive");
    } finally {
      removeMaterializedCorpus(brokenRoot);
    }
  });

  it("reports a body that returns nothing rather than printing a silent blank", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["g.specs().length;", "--root", corpusRoot],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("the body returned nothing");
  });

  it("refuses an unknown option and a second body without deriving anything", async () => {
    const unknownOption = createCaptureOutput();
    expect(await runQ(["return 1", "--wat"], unknownOption, terminalStdin)).toBe(1);
    expect(unknownOption.readStderr()).toContain("unknown option --wat");

    const secondBody = createCaptureOutput();
    expect(await runQ(["return 1", "return 2"], secondBody, terminalStdin)).toBe(1);
    expect(secondBody.readStderr()).toContain("at most one body argument");

    const missingRoot = createCaptureOutput();
    expect(await runQ(["return 1", "--root"], missingRoot, terminalStdin)).toBe(1);
    expect(missingRoot.readStderr()).toContain("--root requires a path");
  });

  it("refuses an empty --root instead of reinterpreting it as the working directory", async () => {
    // An unset shell variable must not become "answer about cwd at exit 0" — the wrong-corpus
    // answer is the one failure mode an agent cannot detect from the output.
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return 1", "--root", ""], capture, terminalStdin);

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("--root requires a path");
  });

  it("refuses a root that is not a directory, naming the resolved absolute path", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 1", "--root", join(corpusRoot, "no-such-directory")],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStderr()).toContain("is not a directory");
    expect(capture.readStderr()).toContain(join(corpusRoot, "no-such-directory"));
  });

  it("honours --exclude, so the sink omits exactly the paths the caller names", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return g.specs().map((spec) => spec.id)",
        "--root",
        corpusRoot,
        "--exclude",
        "verifying-example.sdp.ts",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStdout()).toBe(`[ '${parentId}' ]\n`);
  });

  it("runs the body when extraction itself only warns — the warning is data, never a gate", async () => {
    const warningRoot = materializeExtractCorpus("unrecognized-statement");
    const capture = createCaptureOutput();

    try {
      const exitCode = await runQ(
        ["return g.specs().map((spec) => spec.id)", "--root", warningRoot, "--json"],
        capture,
        terminalStdin,
      );

      // The refusal is keyed to a graph that did not derive, never to a graph that merely had
      // something to say: a warning-level extraction finding leaves the body running.
      expect(exitCode).toBe(0);
      expect(JSON.parse(capture.readStdout())).toEqual(["spec:orders.recognized"]);
      // And it still reaches the operator, through the one diagnostic currency, beside the
      // answer rather than instead of it.
      expect(capture.readStderr()).toContain("[warning] extract/unrecognized-statement");
    } finally {
      removeMaterializedCorpus(warningRoot);
    }
  });

  it("detects a terminal from the file descriptor, never from a stream property", async () => {
    const forged = !isatty(0);
    const descriptor = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
    const capture = createCaptureOutput();

    // The gen-1 footgun the front-door ruling named by name: `process.stdin.isTTY` is a stream
    // property that can be absent, stale, or — as here — simply wrong, while `isatty(0)` asks the
    // descriptor itself. Forging the property must not move the answer. The forgery is this
    // process's own property rather than its descriptors, and it is restored below.
    Object.defineProperty(process.stdin, "isTTY", { value: forged, configurable: true });

    try {
      const exitCode = await runQ(["--root", corpusRoot], capture, {
        query: { readStdin: () => "return g.specs().length" },
      });

      if (isatty(0)) {
        expect(exitCode).toBe(1);
        expect(capture.readStderr()).toContain("stdin is a terminal");
      } else {
        expect(exitCode).toBe(0);
        expect(capture.readStdout()).toBe("2\n");
      }
    } finally {
      if (descriptor === undefined) {
        delete (process.stdin as { isTTY?: boolean }).isTTY;
      } else {
        Object.defineProperty(process.stdin, "isTTY", descriptor);
      }
    }
  });

  it("puts --exclude through the strict exclusion contract before deriving anything", async () => {
    // The trust boundary the ruling records is identity, not containment: an exclusion path is
    // resolved and validated at the edge, so an absolute path, a traversal, the empty string, and
    // the root itself are refused by name rather than quietly reinterpreted.
    for (const path of ["/etc", "../outside", "", "."]) {
      const capture = createCaptureOutput();

      expect(
        await runQ(["return 1", "--root", corpusRoot, "--exclude", path], capture, terminalStdin),
      ).toBe(1);
      expect(capture.readStderr()).toContain(`invalid --exclude path "${path}"`);
      expect(capture.readStdout()).toBe("");
    }
  });

  it("reports a throw from rendering the return value through the one diagnostic currency", async () => {
    // The rendering path runs after the body's own try/catch; a hostile custom-inspect method (or
    // a poisoned getter) must still exit 1 as `sdp q: …`, never escape as an unhandled rejection.
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "const custom = Symbol.for('nodejs.util.inspect.custom'); return { [custom]() { throw new Error('rendering refused'); } };",
        "--root",
        corpusRoot,
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("sdp q: rendering refused");
  });

  it("refuses a --json return value whose toJSON yields no JSON form", async () => {
    // `JSON.stringify` answers `undefined` here rather than throwing; printing that would put the
    // literal text `undefined` on stdout under a success exit — non-JSON on the JSON contract.
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return { toJSON: () => undefined }", "--root", corpusRoot, "--json"],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("has no JSON form");
  });

  it("writes nothing: the sink is a pure read tool", async () => {
    const rootGenerated = join(repoRoot, "generated");
    const before = fingerprintTree(rootGenerated);
    const capture = createCaptureOutput();

    const exitCode = await runQ(["return g.specs().length", "--root", corpusRoot], capture, {
      query: { isStdinTty: () => true, readStdin: () => "" },
    });

    expect(exitCode).toBe(0);
    expect(existsSync(join(corpusRoot, "generated"))).toBe(false);
    // cwd is the repository root under the pooled runner, so an unchanged fingerprint pins "no
    // write at the invoking root" in the direction the test name claims.
    expect(fingerprintTree(rootGenerated)).toBe(before);
  });
});

const queryParamsTestAnchor = specTest({
  id: testAnchorId("test:protocol.query-params"),
  label: "front-door checks verify --params as the fourth binding and its refusals",
  verifies: ref("spec:consumers.agent-surface.recipe-parameters"),
});
void queryParamsTestAnchor;

describe("sdp q --params — a recipe parameter as data", () => {
  const paramsRoot = materializeExtractCorpus("anchored-binding");
  const scratch = mkdtempSync(join(tmpdir(), "sdp-q-params-"));

  afterAll(() => {
    removeMaterializedCorpus(paramsRoot);
    rmSync(scratch, { recursive: true, force: true });
  });

  /** An extraction that records whether it ran: a refusal must land before the graph derives. */
  function watchedExtraction() {
    const seen = { extracted: false };
    return {
      seen,
      hooks: {
        query: {
          ...terminalStdin.query,
          extract: () => {
            seen.extracted = true;
            throw new Error("the graph must not derive after a --params refusal");
          },
        },
      },
    };
  }

  it("injects params as a fourth binding beside g, graph and report", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { params, g: typeof g.specs, graph: Array.isArray(graph.nodes), report: report.validatorId }",
        "--root",
        paramsRoot,
        "--params",
        '{"spec":"spec:orders.anchored-parent","files":["a b.ts"],"depth":2}',
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe(answeredStderr);
    expect(JSON.parse(capture.readStdout())).toEqual({
      params: { spec: parentId, files: ["a b.ts"], depth: 2 },
      g: "function",
      graph: true,
      report: "graph",
    });
  });

  it("binds params to an empty object without the flag", async () => {
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return { params, isObject: Object.getPrototypeOf(params) === Object.prototype }",
        "--root",
        paramsRoot,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({ params: {}, isObject: true });
  });

  it("passes any JSON object through unchanged", async () => {
    for (const value of ["{}", '{"nested":{"list":[1,null,"x"]},"flag":false}']) {
      const capture = createCaptureOutput();

      const exitCode = await runQ(
        ["return { params }", "--root", paramsRoot, "--params", value, "--json"],
        capture,
        terminalStdin,
      );

      expect(exitCode).toBe(0);
      expect(JSON.parse(capture.readStdout())).toEqual({ params: JSON.parse(value) as unknown });
    }
  });

  it("reads params from a file named with @PATH, a byte-order mark dropped", async () => {
    const path = join(scratch, "params.json");
    writeFileSync(path, `\uFEFF${JSON.stringify({ spec: parentId })}\n`);
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      [
        "return g.specContext(params.spec)?.id ?? null",
        "--root",
        paramsRoot,
        "--params",
        `@${path}`,
        "--json",
      ],
      capture,
      terminalStdin,
    );

    expect(exitCode).toBe(0);
    expect(capture.readStderr()).toBe(answeredStderr);
    expect(JSON.parse(capture.readStdout())).toBe(parentId);
  });

  it.each([
    [
      "inline text that is not JSON",
      ["--params", "{spec: 1}"],
      "sdp q: --params is not valid JSON (",
    ],
    ["an empty value", ["--params", ""], "sdp q: --params is not valid JSON ("],
    ["null", ["--params", "null"], "sdp q: --params must be a JSON object, got null."],
    ["an array", ["--params", "[1,2]"], "sdp q: --params must be a JSON object, got an array."],
    [
      "a string",
      ["--params", '"spec:orders.anchored-parent"'],
      "sdp q: --params must be a JSON object, got a string.",
    ],
    ["a number", ["--params", "42"], "sdp q: --params must be a JSON object, got a number."],
    ["a boolean", ["--params", "true"], "sdp q: --params must be a JSON object, got a boolean."],
    [
      "a file that cannot be read",
      ["--params", "@/no/such/params.json"],
      'sdp q: --params file "/no/such/params.json" could not be read (',
    ],
    ["an @ with no path", ["--params", "@"], "sdp q: --params @PATH requires a path after @."],
    [
      "a missing value",
      ["--params"],
      "sdp q: --params requires a JSON object, @PATH or KEY=@PATH.",
    ],
    [
      "a flag in place of the value",
      ["--params", "--json"],
      "sdp q: --params expects a JSON object, @PATH or KEY=@PATH, got --json",
    ],
    [
      "a repeated key",
      ["--params", '{"spec":1}', "--params", '{"spec":2}'],
      'sdp q: --params key "spec" was given twice.',
    ],
    [
      "a key outside the lower-camel grammar",
      ["--params", "Bad=@missing.json"],
      "sdp q: --params KEY=@PATH requires a lower-camel key.",
    ],
  ])(
    "refuses %s before the body runs: exit 1, one line, nothing on stdout",
    async (_case, args, message) => {
      const { seen, hooks } = watchedExtraction();
      const capture = createCaptureOutput();

      const exitCode = await runQ(
        ["return 'the body must not run'", "--root", paramsRoot, ...args],
        capture,
        hooks,
      );

      expect(exitCode).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr().startsWith(message)).toBe(true);
      expect(capture.readStderr().split("\n")).toHaveLength(2);
      expect(seen.extracted).toBe(false);
    },
  );

  it("refuses a file whose JSON is not an object, in one line naming the file", async () => {
    const path = join(scratch, "null.json");
    writeFileSync(path, "null\n");
    const { seen, hooks } = watchedExtraction();
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 'the body must not run'", "--root", paramsRoot, "--params", `@${path}`],
      capture,
      hooks,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe(
      `sdp q: --params file ${JSON.stringify(path)} must be a JSON object, got null.\n`,
    );
    expect(seen.extracted).toBe(false);
  });

  it("refuses a file whose text is not JSON, in one line naming the file", async () => {
    const path = join(scratch, "broken.json");
    writeFileSync(path, '{\n  "spec": \n}\n');
    const { seen, hooks } = watchedExtraction();
    const capture = createCaptureOutput();

    const exitCode = await runQ(
      ["return 'the body must not run'", "--root", paramsRoot, "--params", `@${path}`],
      capture,
      hooks,
    );

    expect(exitCode).toBe(1);
    expect(capture.readStdout()).toBe("");
    const stderr = capture.readStderr();
    expect(
      stderr.startsWith(`sdp q: --params file ${JSON.stringify(path)} is not valid JSON (`),
    ).toBe(true);
    expect(stderr.endsWith(").\n")).toBe(true);
    expect(stderr.split("\n")).toHaveLength(2);
    expect(seen.extracted).toBe(false);
  });
});

const answerShapesTestAnchor = specTest({
  id: testAnchorId("test:protocol.query-answer-shapes"),
  verifies: [
    ref("spec:consumers.agent-surface.evaluation-sink"),
    ref("spec:consumers.agent-surface.recipe-parameters"),
  ],
});
void answerShapesTestAnchor;

describe("query body positions and merged parameters", () => {
  const scratch = mkdtempSync(join(repoRoot, ".q-answers-"));
  afterAll(() => {
    rmSync(scratch, { recursive: true, force: true });
  });

  it.each([
    ["return )", 1, 8],
    ["return 1;\nfoo bar", 2, 5],
    ["let x = 'a' 'bcdef';", 1, 13],
    ["const value = 1;\n\nreturn )", 3, 8],
    ["return (", 1, 9],
  ])("locates a refused body %s", async (body, line, column) => {
    const capture = createCaptureOutput();
    expect(await runQ([body, "--root", scratch], capture)).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toMatch(
      new RegExp(
        `^sdp q: the body does not parse at line ${String(line)}, column ${String(column)}: [^\\n]+\\n$`,
      ),
    );
  });

  it("names a body that stops short instead of the wrapper's closing brace", async () => {
    const capture = createCaptureOutput();
    expect(await runQ(["return [1, 2", "--root", scratch], capture)).toBe(1);
    expect(capture.readStderr()).toBe(
      "sdp q: the body does not parse at line 1, column 13: the body ends before it is complete\n",
    );
  });

  it.each([
    ["return `abc", 1, 12],
    ["const a = 1;\nreturn `x${a`", 2, 14],
  ])("names a body that stops inside a template literal %s", async (body, line, column) => {
    const capture = createCaptureOutput();
    expect(await runQ([body, "--root", scratch], capture)).toBe(1);
    expect(capture.readStderr()).toBe(
      `sdp q: the body does not parse at line ${String(line)}, column ${String(column)}: the body ends before it is complete\n`,
    );
  });

  // Node prints no caret once an error's range runs past its first line, so these columns come
  // from the engine's own start position, never a column the stack lacks.
  it.each([
    [
      "const s = { id: 1 };\nreturn `id: ${Object.keys(s ?? {",
      2,
      15,
      "Missing } in template expression",
    ],
    ["return a; /* note", 1, 11, "Invalid or unexpected token"],
    ["  const { id", 1, 9, "Missing initializer in destructuring declaration"],
    ["const x = (a\n+ b) = 1;\nreturn x;", 1, 11, "Invalid left-hand side in assignment"],
  ])("locates an error whose range runs past its line %j", async (body, line, column, message) => {
    const capture = createCaptureOutput();
    expect(await runQ([body, "--root", scratch], capture)).toBe(1);
    expect(capture.readStderr()).toBe(
      `sdp q: the body does not parse at line ${String(line)}, column ${String(column)}: ${message}\n`,
    );
  });

  it.each([
    ["CR", "\r"],
    ["CRLF", "\r\n"],
    ["U+2028", "\u2028"],
    ["U+2029", "\u2029"],
  ])("counts a %s as the line terminator the engine counts", async (_name, separator) => {
    const concrete = createCaptureOutput();
    expect(await runQ([`const a = 1;${separator}const b = ;`, "--root", scratch], concrete)).toBe(
      1,
    );
    expect(concrete.readStderr()).toBe(
      "sdp q: the body does not parse at line 2, column 11: Unexpected token ';'\n",
    );
    const template = createCaptureOutput();
    expect(
      await runQ([`const a = 1;${separator}return \`x\${a\``, "--root", scratch], template),
    ).toBe(1);
    expect(template.readStderr()).toBe(
      "sdp q: the body does not parse at line 2, column 14: the body ends before it is complete\n",
    );
  });

  it.each([
    ["return 1;\n})\n;(function(){", 2, 1],
    ["const a = 1;\r\n  return a; })\n(function(){", 2, 13],
    ["const a = g.specs();\nreturn a; }", 2, 11],
  ])(
    "locates the brace of a body that closes its function early %j",
    async (body, line, column) => {
      const capture = createCaptureOutput();
      expect(await runQ([body, "--root", scratch], capture)).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe(
        `sdp q: the body does not parse at line ${String(line)}, column ${String(column)}: this brace closes the function the body runs in, before the body ends\n`,
      );
    },
  );

  it("keeps runtime failures separate, including a thrown SyntaxError", async () => {
    const capture = createCaptureOutput();
    expect(
      await runQ(["throw new SyntaxError('runtime refusal')", "--root", scratch], capture),
    ).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toBe("sdp q: runtime refusal\n");
  });

  it.each(["inline", "file"])(
    "refuses repeated top-level keys inside one %s object before extraction",
    async (form) => {
      for (const { text, key } of [
        { text: '{"subject":1,"subject":2}', key: "subject" },
        { text: String.raw`{"\u0073ubject":1,"subject":2}`, key: "subject" },
        { text: '{"__proto__":1,"__proto__":2}', key: "__proto__" },
        { text: String.raw`{ "a\"b": {"x":1}, "a\"b": [2] }`, key: 'a"b' },
        { text: '{"first":1,"second":2,"second":3,"first":4}', key: "second" },
      ]) {
        const path = join(scratch, "duplicate-object.json");
        writeFileSync(path, `\uFEFF${text}`);
        const seen = { extracted: false };
        const hooks = {
          query: {
            extract: () => {
              seen.extracted = true;
              throw new Error("the graph must not derive after a --params refusal");
            },
          },
        };
        const capture = createCaptureOutput();
        const code = await runQ(
          [
            "return 'the body must not run'",
            "--root",
            scratch,
            "--params",
            form === "inline" ? text : `@${path}`,
            "--json",
          ],
          capture,
          hooks,
        );
        expect(code, text).toBe(1);
        expect(capture.readStdout(), text).toBe("");
        expect(capture.readStderr(), text).toBe(
          `sdp q: --params key ${JSON.stringify(key)} was given twice.\n`,
        );
        expect(seen.extracted, text).toBe(false);
      }
    },
  );

  it("accepts nested duplicates and duplicate-looking text inside values", async () => {
    const text = String.raw`{"outer":{"same":1,"same":2},"items":[{"same":3,"same":4}],"text":"{\"subject\":1,\"subject\":2}","quote":"\\\"","subject":false}`;
    const capture = createCaptureOutput();
    expect(
      await runQ(["return params", "--root", scratch, "--params", text, "--json"], capture),
    ).toBe(0);
    expect(capture.readStderr()).toBe(answeredStderr);
    expect(JSON.parse(capture.readStdout())).toEqual(JSON.parse(text));
  });

  it.each([null, [1, 2], "text", 4, true, { nested: { a: 1 } }])(
    "binds a keyed file's JSON value %j beside merged objects",
    async (value) => {
      const objectPath = join(scratch, "object.json");
      const valuePath = join(scratch, "value.json");
      writeFileSync(objectPath, '{"second":{"b":2}}');
      writeFileSync(valuePath, `\uFEFF${JSON.stringify(value)}`);
      const capture = createCaptureOutput();
      expect(
        await runQ(
          [
            "return params",
            "--root",
            scratch,
            "--json",
            "--params",
            '{"first":{"a":1}}',
            "--params",
            `@${objectPath}`,
            "--params",
            `baseGraph=@${valuePath}`,
            "--params",
            "{}",
          ],
          capture,
        ),
      ).toBe(0);
      expect(JSON.parse(capture.readStdout())).toEqual({
        first: { a: 1 },
        second: { b: 2 },
        baseGraph: value,
      });
      expect(capture.readStderr()).toBe(answeredStderr);
    },
  );

  it.each(["inline-file", "file-inline", "keyed-inline", "inline-keyed", "keyed-keyed"])(
    "refuses duplicate keys from %s before extraction",
    async (form) => {
      const path = join(scratch, "duplicate.json");
      writeFileSync(path, '{"subject":null}');
      const inline = '{"subject":false}';
      const file = `@${path}`;
      const keyed = `subject=@${path}`;
      const forms: Record<string, readonly string[]> = {
        "inline-file": [inline, file],
        "file-inline": [file, inline],
        "keyed-inline": [keyed, inline],
        "inline-keyed": [inline, keyed],
        "keyed-keyed": [keyed, keyed],
      };
      const capture = createCaptureOutput();
      expect(
        await runQ(
          [
            "return params",
            "--root",
            scratch,
            ...(forms[form] ?? []).flatMap((item) => ["--params", item]),
          ],
          capture,
          {
            query: {
              extract: () => {
                throw new Error("must not extract");
              },
            },
          },
        ),
      ).toBe(1);
      expect(capture.readStdout()).toBe("");
      expect(capture.readStderr()).toBe('sdp q: --params key "subject" was given twice.\n');
    },
  );

  it("keeps merged parameter keys writable for the caller's body", async () => {
    const capture = createCaptureOutput();
    expect(
      await runQ(
        [
          "params.value = 2; delete params.removable; return params",
          "--root",
          scratch,
          "--json",
          "--params",
          '{"value":1}',
          "--params",
          '{"removable":true}',
        ],
        capture,
      ),
    ).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({ value: 2 });
  });

  it.each([
    ["key=@", "sdp q: --params @PATH requires a path after @."],
    ["key=@missing-file.json", "could not be read"],
    ["bad-key=@missing-file.json", "requires a lower-camel key"],
    ["bad_key=@missing-file.json", "requires a lower-camel key"],
  ])("refuses an invalid keyed input %s before extraction", async (value, message) => {
    const capture = createCaptureOutput();
    expect(
      await runQ(["return params", "--root", scratch, "--params", value], capture, {
        query: {
          extract: () => {
            throw new Error("must not extract");
          },
        },
      }),
    ).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain(message);
    expect(capture.readStderr().trimEnd().split("\n")).toHaveLength(1);
  });

  it("reads inline JSON and @PATH before KEY=@PATH when the input contains =@", async () => {
    const path = join(scratch, "params=@base.json");
    writeFileSync(path, '{"fromFile":"x=@y"}');
    const capture = createCaptureOutput();
    expect(
      await runQ(
        [
          "return params",
          "--root",
          scratch,
          "--json",
          "--params",
          '{"request":"Use --params base=@graph.json"}',
          "--params",
          ' {"spaced":"a=@b"}',
          "--params",
          `@${path}`,
        ],
        capture,
      ),
    ).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      request: "Use --params base=@graph.json",
      spaced: "a=@b",
      fromFile: "x=@y",
    });
    expect(capture.readStderr()).toBe(answeredStderr);
  });

  it("refuses a keyed file holding invalid JSON before extraction", async () => {
    const path = join(scratch, "invalid.json");
    writeFileSync(path, "{broken");
    const capture = createCaptureOutput();
    expect(
      await runQ(["return params", "--root", scratch, "--params", `base=@${path}`], capture, {
        query: {
          extract: () => {
            throw new Error("must not extract");
          },
        },
      }),
    ).toBe(1);
    expect(capture.readStdout()).toBe("");
    expect(capture.readStderr()).toContain("is not valid JSON");
    expect(capture.readStderr().trimEnd().split("\n")).toHaveLength(1);
  });

  it("merges own keys without treating __proto__ as an assignment", async () => {
    const capture = createCaptureOutput();
    expect(
      await runQ(
        [
          "return { keys: Object.keys(params), prototype: Object.getPrototypeOf(params) === Object.prototype, value: params.__proto__ }",
          "--root",
          scratch,
          "--json",
          "--params",
          '{"__proto__":{"polluted":true}}',
        ],
        capture,
      ),
    ).toBe(0);
    expect(JSON.parse(capture.readStdout())).toEqual({
      keys: ["__proto__"],
      prototype: true,
      value: { polluted: true },
    });
  });
});

import {
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";

function writeCarrier(root: string, file: string, id: string): void {
  writeFileSync(
    join(root, file),
    `---\nid: ${id}\nkind: rule\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Probe\n\n## Intent\n\n- outcome: Exercise publication.\n\n## Rule\n`,
  );
}

describe("build write boundaries", () => {
  it.each(
    ["graph.json", "imports.json", "registrars.json"].flatMap((name) =>
      ["symbolic", "hard"].map((kind) => ({ name, kind })),
    ),
  )("replaces a stale $kind link at $name without touching its target", ({ name, kind }) => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-stage-link-"));
    const root = join(workspace, "corpus");
    const sentinel = join(workspace, "sentinel");
    const temporary = join(root, "generated", `${name}.tmp`);
    mkdirSync(join(root, "generated"), { recursive: true });
    writeFileSync(sentinel, "unrelated bytes\n");
    writeFileSync(join(root, "source.ts"), "export const value = 1;\n");
    writeFileSync(join(root, "tsconfig.json"), '{"files":["source.ts"]}');
    writeFileSync(
      join(root, "imports-config.json"),
      JSON.stringify({ adapter: "typescript", tsconfig: "tsconfig.json", roots: ["."] }),
    );
    if (kind === "symbolic") symlinkSync(sentinel, temporary);
    else linkSync(sentinel, temporary);
    try {
      const capture = createCaptureOutput();
      expect(
        runSdpCli(["build", root, "--imports", join(root, "imports-config.json")], capture.output),
        capture.readStderr(),
      ).toBe(0);
      expect(readFileSync(sentinel, "utf8")).toBe("unrelated bytes\n");
      const published = join(root, "generated", name);
      expect(lstatSync(published).isSymbolicLink()).toBe(false);
      expect(lstatSync(published).nlink).toBe(1);
      expect(existsSync(temporary)).toBe(false);
      expect(() => JSON.parse(readFileSync(published, "utf8")) as unknown).not.toThrow();
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it("names an unresolvable output parent when generated is a dangling link", () => {
    const root = mkdtempSync(join(tmpdir(), "sdp-dangling-output-"));
    const parent = join(root, "generated");
    symlinkSync(join(root, "missing"), parent, "dir");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli(["build", root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain(`unsafe output parent "${parent}"`);
      expect(capture.readStderr()).toContain("cannot be resolved");
      expect(lstatSync(parent).isSymbolicLink()).toBe(true);
      expect(existsSync(join(root, "missing"))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("refuses a staging link planted after stale removal", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-stage-race-"));
    const root = join(workspace, "corpus");
    const sentinel = join(workspace, "sentinel");
    mkdirSync(root);
    writeFileSync(sentinel, "unrelated bytes\n");
    try {
      const capture = createCaptureOutput();
      expect(
        runSdpCli(["build", root], capture.output, {
          writeFileSync: (path, data, options) => {
            if (String(path).endsWith("graph.json.tmp")) symlinkSync(sentinel, String(path));
            writeFileSync(path, data, options);
          },
        }),
      ).toBe(1);
      expect(readFileSync(sentinel, "utf8")).toBe("unrelated bytes\n");
      expect(capture.readStderr()).toContain("EEXIST");
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(false);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it.each(["build", "view", "mermaid", "gherkin", "studio", "generate"])(
    "%s refuses an escaping generated parent before writing or cleanup",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-output-parent-"));
      const root = join(workspace, "corpus");
      const outside = join(workspace, "outside");
      mkdirSync(root);
      mkdirSync(join(outside, "design-review"), { recursive: true });
      writeFileSync(join(outside, "graph.json"), "unrelated graph\n");
      writeFileSync(join(outside, "design-review", "index.md"), "unrelated page\n");
      symlinkSync(outside, join(root, "generated"), "dir");
      try {
        const capture = createCaptureOutput();
        expect(await runSdpCli([command, root], capture.output)).toBe(1);
        expect(capture.readStderr()).toContain("escapes the extraction root");
        expect(readFileSync(join(outside, "graph.json"), "utf8")).toBe("unrelated graph\n");
        expect(readFileSync(join(outside, "design-review", "index.md"), "utf8")).toBe(
          "unrelated page\n",
        );
        expect(existsSync(join(outside, "registrars.json"))).toBe(false);
      } finally {
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );
});

describe("explicit symlinked watch root", () => {
  it("keeps the named root in ordinary command output", () => {
    const workspace = mkdtempSync(join(tmpdir(), "sdp-named-root-"));
    const root = join(workspace, "corpus");
    const alias = join(workspace, "alias");
    mkdirSync(root);
    symlinkSync(root, alias, "dir");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli(["build", alias], capture.output)).toBe(0);
      expect(capture.readStdout()).toContain(join(alias, "generated", "graph.json"));
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });

  it.each(["validate", "studio", "vault"])(
    "%s starts and reruns through the named root",
    async (command) => {
      const workspace = mkdtempSync(join(tmpdir(), "sdp-watch-root-link-"));
      const root = join(workspace, "corpus");
      const alias = join(workspace, "alias");
      mkdirSync(root);
      symlinkSync(root, alias, "dir");
      symlinkSync(root, join(root, "loop"), "dir");
      writeCarrier(root, "probe.sdp.md", "spec:probe.watch");
      const subscriptions = new Map<string, (event: string, filename: string) => void>();
      const abort = new AbortController();
      const capture = createCaptureOutput();
      let cycles = 0;
      const timer = setTimeout(() => {
        abort.abort();
      }, 2_000);
      try {
        const exitCode = await runSdpCli(
          [
            command,
            alias,
            "--watch",
            ...(command === "vault" ? ["--out", join(root, ".vault")] : []),
          ],
          capture.output,
          {
            abortSignal: abort.signal,
            studioAssets: {
              script: join(process.cwd(), "dist/studio/studio.js"),
              stylesheet: join(process.cwd(), "dist/studio/studio.css"),
            },
            createNativeWatch: (directory, listener) => {
              subscriptions.set(directory, listener);
              return { on: () => undefined, close: () => undefined };
            },
            onWatchCycleComplete: (cycle) => {
              expect(cycle.exitCode, capture.readStderr()).toBe(0);
              cycles += 1;
              if (cycles === 1) {
                writeCarrier(root, "next.sdp.md", "spec:probe.next");
                subscriptions.get(alias)?.("rename", "next.sdp.md");
              } else abort.abort();
            },
          },
        );
        expect(exitCode, capture.readStderr()).toBe(0);
        expect(cycles).toBe(2);
        expect([...subscriptions.keys()]).toEqual([alias]);
        expect(capture.readStderr()).not.toContain("watch failed");
        expect(readFileSync(join(root, "generated", "graph.json"), "utf8")).toContain(
          "spec:probe.next",
        );
      } finally {
        clearTimeout(timer);
        abort.abort();
        rmSync(workspace, { recursive: true, force: true });
      }
    },
  );
});

describe("portable projection publication", () => {
  it.each([
    ["view", "design-review"],
    ["mermaid", "mermaid"],
    ["gherkin", "gherkin"],
  ])("%s refuses case-colliding pages and removes stale output", (command, directory) => {
    const root = mkdtempSync(join(tmpdir(), "sdp-page-collision-"));
    const view = join(root, "generated", directory);
    mkdirSync(view, { recursive: true });
    writeFileSync(join(view, "stale.md"), "stale\n");
    writeCarrier(root, "first.sdp.md", "spec:probe.Twin");
    writeCarrier(root, "second.sdp.md", "spec:probe.twin");
    try {
      const capture = createCaptureOutput();
      expect(runSdpCli([command, root], capture.output)).toBe(1);
      expect(capture.readStderr()).toContain("case-insensitive publication path collision");
      expect(capture.readStderr()).toContain("spec:probe.Twin");
      expect(capture.readStderr()).toContain("spec:probe.twin");
      expect(existsSync(view)).toBe(false);
      expect(existsSync(`${view}.tmp`)).toBe(false);
      expect(existsSync(join(root, "generated", "graph.json"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

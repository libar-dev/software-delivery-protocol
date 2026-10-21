import { spawn } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, expect, it } from "vitest";
import { buildOwnedPaths } from "../src/cli/build-command.js";
import { verbHelpText } from "../src/cli/help.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { bytes, carrier, probe, put } from "./helpers/vault-probe.js";

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture(bound = false): string {
  const root = mkdtempSync(join(tmpdir(), "sdp-x2b-"));
  roots.push(root);
  probe(root);
  if (bound) {
    put(
      join(root, "member.sdp.md"),
      carrier(
        "spec:probe.member",
        "Member",
        "behavior",
        "defined",
        "\n## Behavior\n- rule: Read it.\n\n## Example space\n```gwt-vocabulary\nGiven a page\nWhen it renders\nThen it is read: {read:boolean}\n```\n",
        "\n  dependsOn: spec:probe.other",
      ),
    );
    put(
      join(root, "example.sdp.md"),
      carrier(
        "spec:probe.example",
        "Example",
        "example",
        "defined",
        "\n```gwt\nGiven a page\nWhen it renders\nThen it is read: {read:true}\n```\n",
        "\n  refines: spec:probe.member\n  verifies: spec:probe.member",
      ),
    );
    put(
      join(root, "test/example.test.ts"),
      "/**\n * @sdpAnchor test:probe.example\n * @sdpVerifies spec:probe.example\n */\nexport const example = true;\n",
    );
  }
  return root;
}
const assets = {
  script: resolve("dist/studio/studio.js"),
  stylesheet: resolve("dist/studio/studio.css"),
};
const run = (args: string[]) =>
  runSdpCli(args, createCaptureOutput().output, { studioAssets: assets });
function caseInsensitive(root: string): boolean {
  put(join(root, "CaseProbe"), "probe");
  const insensitive = existsSync(join(root, "caseprobe"));
  rmSync(join(root, "CaseProbe"));
  return insensitive;
}

it("leaves unchanged registrar bytes, inode and temporary path untouched", async () => {
  const root = fixture(true);
  expect(await run(["build", root])).toBe(0);
  const path = join(root, "test/probe.example.test.generated.ts");
  const before = statSync(path);
  const writes: string[] = [];
  expect(
    await runSdpCli(["build", root], createCaptureOutput().output, {
      writeFileSync(path, ...args) {
        writes.push(String(path));
        writeFileSync(path, ...args);
      },
    }),
  ).toBe(0);
  expect(writes.some((p) => p.endsWith("/probe.example.test.generated.ts.tmp"))).toBe(false);
  expect(statSync(path).ino).toBe(before.ino);
  expect(statSync(path).mtimeMs).toBe(before.mtimeMs);
});

it("idles with a bound example and preserves a Studio written beside the watched vault", async () => {
  const root = fixture(true);
  const child = spawn(process.execPath, [resolve("dist/cli/sdp.js"), "vault", root, "--watch"], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "",
    stderr = "";
  child.stdout.on("data", (b: Buffer) => {
    stdout += b.toString();
  });
  child.stderr.on("data", (b: Buffer) => {
    stderr += b.toString();
  });
  const stopped = new Promise<number | null>((done) => child.once("exit", done));
  try {
    await new Promise<void>((done, fail) => {
      const start = Date.now();
      const tick = () => {
        if (stdout.includes("/sdp (")) done();
        else if (child.exitCode !== null || Date.now() - start > 4000)
          fail(new Error(`${stdout}\n${stderr}`));
        else setTimeout(tick, 10);
      };
      tick();
    });
    await new Promise((done) => setTimeout(done, 1100));
    expect(stdout.match(/Wrote .*\/sdp \(/gu), stderr).toHaveLength(1);
    const publication = createCaptureOutput();
    const publicationExit = await runSdpCli(["studio", root], publication.output, {
      studioAssets: assets,
    });
    expect(publicationExit, publication.readStderr()).toBe(0);
    const studio = bytes(join(root, "generated/spec-studio"));
    // Even changed build-owned siblings must never widen the source watch.
    const registrar = join(root, "test/probe.example.test.generated.ts");
    put(registrar, readFileSync(registrar, "utf8") + "\n");
    await new Promise((done) => setTimeout(done, 1000));
    expect(stdout.match(/Wrote .*\/sdp \(/gu), stderr).toHaveLength(1);
    expect(bytes(join(root, "generated/spec-studio"))).toEqual(studio);
    child.kill("SIGINT");
    expect(await stopped).toBe(0);
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    await stopped;
  }
});

for (const [beforeId, afterId] of [
  ["spec:probe.Member", "spec:probe.member"],
  ["spec:Probe.member", "spec:probe.member"],
]) {
  it(`keeps a note after a case-only rename of ${beforeId ?? ""}`, async (context) => {
    const root = fixture();
    if (!caseInsensitive(root)) context.skip();
    rmSync(join(root, "other.sdp.md"));
    const change = (id: string) => {
      put(join(root, "member.sdp.md"), carrier(id));
      put(join(root, "probe.pack.sdp.md"), `---\nid: pack:probe\nspecs: [${id}]\n---\n# Probe\n`);
    };
    change(beforeId ?? "");
    expect(await run(["vault", root])).toBe(0);
    change(afterId ?? "");
    expect(await run(["vault", root])).toBe(0);
    expect(
      readFileSync(
        join(root, "generated/obsidian-vault/sdp/specs/probe/spec.probe.member.md"),
        "utf8",
      ),
    ).toContain("spec:probe.member");
    expect(await run(["vault", root])).toBe(0);
  });
}

it("refuses the same rules file under a case alias", async (context) => {
  const root = fixture();
  if (!caseInsensitive(root)) context.skip();
  const path = join(root, "rule.js");
  put(path, "return {findings: []}");
  const out = createCaptureOutput();
  expect(
    await runSdpCli(
      ["validate", root, "--rules", path, "--rules", join(root, "RULE.js")],
      out.output,
      { studioAssets: assets },
    ),
  ).toBe(1);
  expect(out.readStderr()).toContain("given twice");
});

for (const flag of ["--base", "--runs"])
  it(`refuses a case alias of build output for ${flag}`, async (context) => {
    const root = fixture();
    if (!caseInsensitive(root)) context.skip();
    await run(["build", root]);
    const before = bytes(root);
    const out = createCaptureOutput();
    expect(
      await runSdpCli(["studio", root, flag, join(root, "GENERATED/graph.json")], out.output, {
        studioAssets: assets,
      }),
    ).toBe(1);
    expect(out.readStderr()).toContain(flag);
    expect(bytes(root)).toEqual(before);
  });

it.each(["--base", "--runs"])(
  "refuses direct and symbolic build-owned %s inputs without changing a file",
  async (flag) => {
    for (const alias of [false, true]) {
      const root = fixture();
      const owned = join(root, "generated/spec-studio/report.json");
      put(owned, "{}\n");
      const input = alias ? join(root, "alias.json") : owned;
      if (alias) symlinkSync(owned, input);
      const before = bytes(root);
      const out = createCaptureOutput();
      let extracted = false;
      expect(
        await runSdpCli(["studio", root, flag, input], out.output, {
          studioAssets: assets,
          extract: () => {
            extracted = true;
            throw new Error("Extraction must not start");
          },
        }),
      ).toBe(1);
      expect(extracted).toBe(false);
      expect(out.readStderr()).toContain(flag);
      expect(out.readStderr()).toContain(input);
      expect(bytes(root)).toEqual(before);
    }
  },
);

it("keeps a changed Base with a warning and regenerates it only after deletion", async () => {
  const root = fixture();
  expect(await run(["vault", root])).toBe(0);
  const base = join(root, "generated/obsidian-vault/sdp/specs.base");
  put(base, "My sorted Base\n");
  put(join(root, "member.sdp.md"), carrier("spec:probe.member", "Changed"));
  const out = createCaptureOutput();
  expect(await runSdpCli(["vault", root], out.output)).toBe(0);
  expect(readFileSync(base, "utf8")).toBe("My sorted Base\n");
  expect(out.readStderr()).toContain("warning");
  expect(out.readStderr()).toContain("sdp/specs.base");
  expect(out.readStderr()).toContain("delete it to regenerate");
  expect(
    readFileSync(
      join(root, "generated/obsidian-vault/sdp/specs/probe/spec.probe.member.md"),
      "utf8",
    ),
  ).toContain("# Changed");
  expect(await run(["vault", root])).toBe(0);
  expect(readFileSync(base, "utf8")).toBe("My sorted Base\n");
  rmSync(base);
  expect(await run(["vault", root])).toBe(0);
  expect(readFileSync(base, "utf8")).toContain("views:");
});

it("ignores Finder's .DS_Store under the owned folder", async () => {
  const root = fixture();
  expect(await run(["vault", root])).toBe(0);
  const path = join(root, "generated/obsidian-vault/sdp/specs/.DS_Store");
  put(path, "Finder bytes");
  expect(await run(["vault", root])).toBe(0);
  expect(readFileSync(path, "utf8")).toBe("Finder bytes");
});

it.each(buildOwnedPaths)("refuses an input beneath build-owned %s", async (owned) => {
  const root = fixture();
  const input = join(root, owned, "input.json");
  put(input, "{}");
  const before = bytes(root);
  const out = createCaptureOutput();
  expect(await runSdpCli(["studio", root, "--runs", input], out.output)).toBe(1);
  expect(out.readStderr()).toContain("--runs");
  expect(bytes(root)).toEqual(before);
});
it("refuses a future registrar input before extraction", async () => {
  const root = fixture();
  const input = join(root, "test/future.test.generated.ts");
  put(input, "{}");
  const before = bytes(root);
  const out = createCaptureOutput();
  expect(await runSdpCli(["studio", root, "--base", input], out.output)).toBe(1);
  expect(out.readStderr()).toContain("--base");
  expect(bytes(root)).toEqual(before);
});
it("states the working-directory resolution of generate --vault in help", () => {
  expect(verbHelpText("generate")).toContain("--vault DIR, resolved against cwd");
});

it("keeps the vault watcher alive after a malformed registrar manifest refusal", async () => {
  const root = fixture();
  put(join(root, "generated/registrars.json"), "not a manifest");
  const controller = new AbortController();
  const out = createCaptureOutput();
  let cycles = 0;
  expect(
    await runSdpCli(["vault", root, "--watch"], out.output, {
      abortSignal: controller.signal,
      onWatchCycleComplete: () => {
        cycles++;
        controller.abort();
      },
    }),
  ).toBe(0);
  expect(cycles).toBe(1);
  expect(out.readStderr()).toContain("sdp vault:");
  expect(readFileSync(join(root, "generated/registrars.json"), "utf8")).toBe("not a manifest");
});

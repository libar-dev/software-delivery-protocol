import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

// A committed-source install needs network access and dependency builds. Keep it outside the
// pooled unit suite and run it explicitly, or as the final CI step, against the selected commit.
const root = dirname(fileURLToPath(import.meta.url));
const packageName = "@libar-dev/software-delivery-protocol";
const revision = process.argv[2] ?? "HEAD";
const parent = resolve(process.argv[3] ?? tmpdir());
mkdirSync(parent, { recursive: true });
const scratch = mkdtempSync(join(parent, "sdp-git-install-"));
const run = (command, args, cwd = root) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    timeout: 300_000,
    maxBuffer: 8 * 1024 * 1024,
  });
const commit = run("git", ["rev-parse", "--verify", `${revision}^{commit}`]).trim();
const cloneDependency = `git+${pathToFileURL(root).href}#${commit}`;

try {
  const managers = ["npm"];
  const pnpm = spawnSync("pnpm", ["--version"], { encoding: "utf8" });
  if (pnpm.status === 0) managers.push("pnpm");
  else console.log("pnpm unavailable; npm install only");
  // Build the archived source exactly where no enclosing checkout can supply a commit.
  // npm pack runs prepare; a direct tarball install alone would not run this build.
  const archiveRoot = join(scratch, "archive-source");
  const archive = join(scratch, "source.tar");
  mkdirSync(archiveRoot);
  run("git", ["archive", "--format=tar", "--output", archive, commit]);
  run("tar", ["-xf", archive, "-C", archiveRoot]);
  assert.ok(!existsSync(join(archiveRoot, ".git")));
  run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], archiveRoot);
  const packed = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", scratch], archiveRoot),
  );
  assert.equal(
    JSON.parse(readFileSync(join(archiveRoot, "dist/cli/build-info.json"), "utf8")).commit,
    commit,
  );
  const routes = [
    ...managers.map((manager) => ({ manager, route: "clone", dependency: cloneDependency })),
    { manager: "npm", route: "archive", dependency: `file:${join(scratch, packed[0].filename)}` },
  ];
  for (const { manager, route, dependency } of routes) {
    const consumer = join(scratch, `${manager}-${route}`);
    mkdirSync(consumer);
    writeFileSync(
      join(consumer, "package.json"),
      JSON.stringify({
        name: "sdp-git-consumer",
        private: true,
        type: "module",
        dependencies: { [packageName]: dependency },
        ...(manager === "npm"
          ? { allowScripts: { [`git+${pathToFileURL(root).href}`]: true } }
          : {}),
      }),
    );
    if (manager === "npm") {
      writeFileSync(join(consumer, ".npmrc"), "allow-git=root\n");
    } else {
      const major = Number(pnpm.stdout.trim().split(".")[0]);
      writeFileSync(
        join(consumer, "pnpm-workspace.yaml"),
        major >= 11
          ? `allowBuilds:\n  ${JSON.stringify(`${packageName}@${dependency}`)}: true\n`
          : `onlyBuiltDependencies:\n  - ${JSON.stringify(`${packageName}@${dependency}`)}\n`,
      );
    }
    const started = Date.now();
    run(
      manager,
      [
        "install",
        ...(manager === "npm"
          ? ["--no-audit", "--no-fund"]
          : ["--reporter=append-only", "--store-dir", join(scratch, "pnpm-store")]),
      ],
      consumer,
    );
    const installed = join(consumer, "node_modules", ...packageName.split("/"));
    assert.ok(!existsSync(join(consumer, "node_modules", "vitest")));
    const cli = join(consumer, "node_modules", ".bin", "sdp");
    const version = run(cli, ["--version"], consumer).trim();
    assert.ok(version.includes(commit), `${version} does not name ${commit}`);
    const manifest = JSON.parse(readFileSync(join(installed, "package.json"), "utf8"));
    for (const surface of Object.values(manifest.exports)) {
      for (const path of Object.values(surface)) assert.ok(existsSync(join(installed, path)), path);
    }
    const recipe = readFileSync(join(installed, "dist/recipes/25-address-resolution.js"), "utf8");
    writeFileSync(
      join(consumer, "own.sdp.md"),
      `---\nid: spec:probe.installed\nkind: behavior\naltitude: story\nreadiness: idea\nrelations: {}\n---\n# Installed corpus\n\n## Intent\n- outcome: Read an installed recipe.\n\n## Behavior\n- rule: [#installed] Resolve this rule.\n`,
    );
    const result = JSON.parse(
      run(
        cli,
        [
          "q",
          recipe,
          "--params",
          '{"addresses":["spec:probe.installed#rule.installed"]}',
          "--json",
        ],
        consumer,
      ),
    );
    assert.equal(result.totals.addresses, 1);
    assert.equal(result.totals.resolved, 1);
    console.log(
      `${manager} ${route}: ${version}; exports and shipped recipe work; ${((Date.now() - started) / 1000).toFixed(1)}s; commit ${commit}`,
    );
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, expect, it, vi } from "vitest";

import { snapshot } from "./helpers/vault-probe.js";

// The vault sync writes a staging file and renames it into place. This stands in for that rename
// landing between the probe's read of the staging file and its stat.
const race = vi.hoisted(() => ({ staging: undefined as string | undefined, target: "" }));

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  const readFileSync = ((...args: Parameters<typeof actual.readFileSync>) => {
    const content = actual.readFileSync(...args);
    if (args[0] === race.staging) {
      race.staging = undefined;
      actual.renameSync(args[0], race.target);
    }
    return content;
  }) as typeof actual.readFileSync;
  return { ...actual, readFileSync };
});

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

it("snapshots a vault folder whose staging file is renamed while it is read", () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-vault-probe-"));
  roots.push(root);
  mkdirSync(join(root, "specs"));
  writeFileSync(join(root, "specs", "note.md"), "note\n");
  writeFileSync(join(root, ".sdp-vault.json"), "old list\n");
  race.staging = join(root, "..sdp-vault.json.sdp-tmp");
  race.target = join(root, ".sdp-vault.json");
  writeFileSync(race.staging, "new list\n");

  const files = snapshot(root);

  expect(race.staging).toBeUndefined();
  expect(Object.keys(files).sort()).toEqual([".sdp-vault.json", "specs/note.md"]);
  expect(files["specs/note.md"]?.content).toBe("note\n");
});

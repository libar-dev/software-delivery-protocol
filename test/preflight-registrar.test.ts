import { expect, it } from "vitest";

import { trackedRegistrarDifferences } from "../preflight-registrars.mjs";

it("names tracked registrar drift independently in the worktree and Git index", () => {
  const path = "test/example.test.generated.ts";

  expect(trackedRegistrarDifferences(path, "fresh\n", "stale worktree\n", "stale index\n")).toEqual(
    [`${path} (worktree bytes differ)`, `${path} (Git index bytes differ)`],
  );
  expect(trackedRegistrarDifferences(path, "fresh\n", "fresh\n", "fresh\n")).toEqual([]);
  expect(trackedRegistrarDifferences(path, undefined, "orphan\n", "orphan\n")).toEqual([
    `${path} (tracked registrar is no longer owed)`,
  ]);
});

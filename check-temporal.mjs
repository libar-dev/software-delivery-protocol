import { spawnSync } from "node:child_process";

// The temporal-token guard (plans/05 §5): durable artifacts carry current truth, so calendar and
// session tokens are banned from code and the timeless docs. `docs/concept/DECISIONS.md` is exempt
// by genre (a dated diary); `plans/` and `reviews/` are outside the swept set for the same reason.
// `Slice N` / `Phase 0` (roadmap-relative capability names) and `MD-n` citations are allowed.
const pattern =
  "Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/0[0-9]|20[0-9]{2}-[0-9]{2}-[0-9]{2}";
const pathspecs = [
  "src",
  "test",
  "examples",
  "AGENTS.md",
  "docs/concept/*.md",
  ":(exclude)docs/concept/DECISIONS.md",
];

const result = spawnSync("git", ["grep", "-nE", pattern, "--", ...pathspecs], {
  encoding: "utf8",
});

if (result.error !== undefined) {
  throw result.error;
}

// `git grep` exit codes: 1 = no matches (the only pass), 0 = matches found, anything else = the
// command itself failed. A guard that errors must never pass — fail closed.
if (result.status === 1) {
  process.exit(0);
}

if (result.status === 0) {
  console.error("check:temporal — banned temporal tokens found:\n");
  console.error(result.stdout);
  process.exit(1);
}

console.error(`check:temporal — git grep failed (exit ${result.status}); failing closed.`);
if (result.stderr !== "") {
  console.error(result.stderr);
}
process.exit(1);

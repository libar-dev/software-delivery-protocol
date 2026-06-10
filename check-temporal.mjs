import { spawnSync } from "node:child_process";

// The temporal-token guard: durable artifacts carry current truth, so calendar and session tokens
// (session/wave/fold handles, ISO dates, numbered plan-file refs) are banned from every tracked
// file. Only the temporal-by-genre artifacts are exempt: the dated decision diary, the per-session
// plan done-records, the archived reviews — plus the machine-generated lockfile (derived, not
// authored prose) and this file itself, which must *mention* the tokens it bans (use–mention: the
// pattern below literally contains one). `Slice N` / `Phase 0` (roadmap-relative capability names)
// and `MD-n` citations are allowed.
const pattern =
  "Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/0[0-9]|20[0-9]{2}-[0-9]{2}-[0-9]{2}";
const pathspecs = [
  ".",
  ":(exclude)docs/concept/DECISIONS.md",
  ":(exclude)plans",
  ":(exclude)reviews",
  ":(exclude)package-lock.json",
  ":(exclude)check-temporal.mjs",
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

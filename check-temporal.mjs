import { spawnSync } from "node:child_process";

// The temporal-token guard: durable artifacts carry current truth, so calendar and session tokens
// (session/wave/fold handles, ISO dates, numbered plan-file refs) are banned from every tracked
// file. Only the temporal-by-genre artifacts are exempt: the dated decision diary, the per-session
// plan done-records, the archived reviews — plus the machine-generated lockfile (derived, not
// authored prose). `Slice N` / `Phase 0` (roadmap-relative capability names) and `MD-n` citations
// are allowed.
const pattern =
  "Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/[0-9]+|20[0-9]{2}-[0-9]{2}-[0-9]{2}";
const pathspecs = [
  ".",
  ":(exclude)docs/concept/DECISIONS.md",
  ":(exclude)plans",
  ":(exclude)reviews",
  ":(exclude)package-lock.json",
];

const result = spawnSync("git", ["grep", "-nE", pattern, "--", ...pathspecs], {
  encoding: "utf8",
});

if (result.error !== undefined) {
  throw result.error;
}

// `git grep` exit codes: 1 = no matches, 0 = matches found, anything else = the command itself
// failed. A guard that errors must never pass — fail closed.
if (result.status !== 0 && result.status !== 1) {
  console.error(`check:temporal — git grep failed (exit ${result.status}); failing closed.`);
  if (result.stderr !== "") {
    console.error(result.stderr);
  }
  process.exit(1);
}

// This file is swept like every other; its single allowance is line-level use–mention: the guard
// must name the tokens it bans, so the one line that *is* the pattern literal is permitted. Any
// other matching line here — a comment, a header — is a violation like any file's. (If this file
// is renamed, the allowance stops matching and the pattern line fails loudly: fail closed.)
const matches = result.status === 0 ? result.stdout.split("\n").filter(Boolean) : [];
const violations = matches.filter(
  (line) => !(line.startsWith("check-temporal.mjs:") && line.includes(pattern)),
);

if (violations.length > 0) {
  console.error("check:temporal — banned temporal tokens found:\n");
  console.error(violations.join("\n"));
  process.exit(1);
}

process.exit(0);

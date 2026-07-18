import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

// The temporal-token guard: durable artifacts carry current truth, so calendar and session tokens
// (session/wave/fold handles, ISO dates, numbered plan-file refs) are banned from every tracked
// and nonignored untracked file. Only the temporal-by-genre artifacts are exempt: the dated
// decision diary, the per-session plan done-records, the archived reviews, the dated exploration
// records (verbatim exhibits, diary-dated like DECISIONS) — plus the machine-generated lockfile
// (derived, not authored prose). `Slice N` / `Phase 0` (roadmap-relative capability names) and
// `MD-n` citations are allowed.
const pattern =
  "Session[ -][0-9]|Wave[- ][A-Z]|Fold-[A-Z]|deferredInSession|plans/[0-9]+|20[0-9]{2}-[0-9]{2}-[0-9]{2}";
const expression = new RegExp(pattern, "u");
const excludedFiles = ["docs/concept/DECISIONS.md", "package-lock.json"];
const excludedDirectories = ["plans/", "reviews/", "explorations/"];

function isExcluded(path) {
  return (
    excludedFiles.includes(path) ||
    excludedDirectories.some((directory) => path.startsWith(directory))
  );
}

function fail(message, detail = "") {
  console.error(`check:temporal — ${message}; failing closed.`);

  if (detail !== "") {
    console.error(detail);
  }

  process.exit(1);
}

const enumerated = spawnSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  {
    encoding: "utf8",
  },
);

if (enumerated.error !== undefined || enumerated.status !== 0) {
  fail("file enumeration failed", enumerated.stderr);
}

const paths = enumerated.stdout.split("\0").filter((path) => path !== "" && !isExcluded(path));

// This file is swept like every other; its single allowance is line-level use–mention: the guard
// must name the tokens it bans, so exactly one line — the pattern literal, alone on its line — is
// permitted. The predicate is byte-exact equality: leading/trailing whitespace, adjacent content,
// a copied line, or a second copy is a violation. (If this file is renamed, the allowance stops
// matching and the pattern line fails loudly: fail closed.)
const allowedSelfLine = `  "${pattern}";`;
let selfAllowanceUsed = false;
const violations = [];

for (const path of paths) {
  let source;

  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    fail(`could not read ${path}`, error instanceof Error ? error.message : String(error));
  }

  for (const [index, line] of source.split("\n").entries()) {
    if (!expression.test(line)) {
      continue;
    }

    const isAllowedSelfLine =
      path === "check-temporal.mjs" && line === allowedSelfLine && !selfAllowanceUsed;

    if (isAllowedSelfLine) {
      selfAllowanceUsed = true;
      continue;
    }

    violations.push(`${path}:${index + 1}:${line}`);
  }
}

if (violations.length > 0) {
  console.error("check:temporal — banned temporal tokens found:\n");
  console.error(violations.join("\n"));
  process.exit(1);
}

process.exit(0);

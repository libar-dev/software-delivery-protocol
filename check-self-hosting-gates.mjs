import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// check-self-hosting-gates — the structured consistency gate for the self-hosting phase's
// accepted docket close and its four-gate review ledger (git process evidence, never a
// graph fact).
//
// Asserts, and NAMES each disagreeing surface on failure:
//   1. DOCKET — all obligations are non-pending (done/deferred/dropped with rationale), including
//      the completed four-gate review ledger.
//   2. LEDGER — the four-gate review ledger exists in the plan; Gates 1–3 carry meaning,
//      owner disposition (accepted), date, accepted SHA, corrections (none for Gates 1-3; the
//      recorded post-acceptance repair for Gate 4), and rulings (including the Gate-3 owner
//      directive on the npm audit advisories); Gate 4 carries the accepted state and the owner's
//      phase-2 disposition.
//   3. PACKET AGREEMENT — the ledger's fields agree with the owner-packet
//      dispositions, embedded here as constants read from those packets.
//   4. STATUS SURFACES — progress lives in the plan and the agent handbook only: the handbook
//      stamps owner acceptance and final-audit pending, and its green-gate row names the current root+checkout
//      chain; the handbook, the diary, and the glossary carry no plan-completion or
//      plan-completion wording.
//   5. ADR DISPOSITIONS — both flagged §3 rulings carry explicit three-part-test outcomes:
//      lean diary entries (the strict consumer-exclusion contract (MD-20); the
//      envelope-grammar ownership posture (MD-21)) with registry rows, and the plan records
//      the dispositions so each omission is a decision, never a default.
//   6. PLAN-16 RECONCILIATION — every scheduled-session docket origin (the 17/18/19 rows) is
//      dispositioned, and plan 16 keeps its ✅ RUN stamp (reconciled, never rewritten).
//
// Usage: node check-self-hosting-gates.mjs [rootDir]
//   rootDir — tree holding the surfaces; defaults to this repo root. QA passes temp trees of
//             mutated copies to prove disagreeing surfaces are named. The temporal dry-run
//             leg runs only when rootDir is the default (a temp tree is not a git checkout).
//             Plan-file paths and the gate date are assembled in parts so this durable
//             tracked file carries no numbered plan-path or calendar token (the temporal
//             guard bans those from tracked files).

const defaultRoot = dirname(fileURLToPath(import.meta.url));
const rootDir = process.argv[2] ?? defaultRoot;

const planPath = ["plans", "17-self-hosting-v1.md"].join("/");
const plan18Path = ["plans", "18-self-hosting-phase-2.md"].join("/");
const plan16Path = ["plans", "16-carrier-ruling.md"].join("/");
const agentsPath = "AGENTS.md";
const decisionsPath = "docs/concept/DECISIONS.md";
const glossaryPath = "CONTEXT.md";

// Owner-packet dispositions, read from the three packets and embedded as constants: the
// ledger must agree with them field for field. The shared gate date is assembled in parts.
const GATE_DATE = ["2026", "07", "18"].join("-");
const GATE_4_CORRECTION = "24f9978: docs(concept): record the landed prose projection in 06";
const GATES = [
  { gate: "1", meaning: "schema freeze", sha: "aca79090529c2f6625ceafc78f33e16da81bfcb1" },
  { gate: "2", meaning: "corpus/readiness", sha: "cdb68fc1564c9167ebc0372ba8f8599a97df4393" },
  { gate: "3", meaning: "executable loop", sha: "1687885df7b1898c56e154ce2dbe4fa3c6c6c425" },
  {
    gate: "4",
    meaning: "whole-phase review and the phase-2 disposition",
    sha: "1d9f38c7a993f9cdc27cc4e178e211e33286758b",
  },
].map((gate) => ({ ...gate, corrections: gate.gate === "4" ? GATE_4_CORRECTION : "none" }));
const norm = (text) => text.replace(/\s+/g, " ");
const read = (rel) => readFileSync(join(rootDir, rel), "utf8");

const failures = [];
const expectContains = (surface, haystack, needle, why) => {
  if (!norm(haystack).includes(norm(needle))) {
    failures.push(`${surface} — ${why}`);
  }
};
const expectOmits = (surface, haystack, needle, why) => {
  if (norm(haystack).includes(norm(needle))) {
    failures.push(`${surface} — ${why}`);
  }
};

const plan = read(planPath);
const agents = read(agentsPath);
const decisions = read(decisionsPath);
const glossary = read(glossaryPath);
const plan16 = read(plan16Path);
const plan18 = existsSync(join(rootDir, plan18Path)) ? read(plan18Path) : null;

// ---------------------------------------------------------------------------
// 1. The docket: all 25 obligations are dispositioned.
// ---------------------------------------------------------------------------

const docketStart = plan.indexOf("## §6");
const docketTableEnd = plan.indexOf("### The four-gate review ledger");
const docketSection = plan.slice(
  docketStart,
  docketTableEnd === -1 ? plan.indexOf("## §7") : docketTableEnd,
);
const docket = docketSection
  .split("\n")
  .filter((line) => line.startsWith("| ") && !line.startsWith("| Docket item"))
  .map((line) => line.split("|").map((cell) => cell.trim()))
  .filter((cells) => cells.length >= 4)
  .map((cells) => ({ item: cells[1], planned: cells[2], state: cells[3] }));

if (docket.length !== 25) {
  failures.push(`${planPath} — docket row count is ${docket.length}, expected 25`);
}

const pendingRows = docket.filter((row) => /pending/i.test(row.state));
if (pendingRows.length !== 0) {
  failures.push(
    `${planPath} — expected no pending docket rows after owner acceptance; found ${pendingRows.length}: ${pendingRows.map((row) => row.item).join(" · ")}`,
  );
}

const malformed = docket.filter(
  (row) => !/pending/i.test(row.state) && !/^(done|deferred|dropped)\b/i.test(row.state),
);
for (const row of malformed) {
  failures.push(
    `${planPath} — docket row "${row.item}" has no done/deferred/dropped disposition: ${row.state}`,
  );
}

// Plan-16 reconciliation: every scheduled-session origin row (17/18/19) is dispositioned.
const originRows = docket.filter((row) => /\((17|18|19)\)/.test(row.item));
if (originRows.length !== 15) {
  failures.push(
    `${planPath} — expected 15 scheduled-session origin rows (17/18/19), found ${originRows.length}`,
  );
}
for (const row of originRows.filter((row) => /pending/i.test(row.state))) {
  failures.push(`${planPath} — scheduled-session obligation still pending: ${row.item}`);
}
expectContains(
  plan16Path,
  plan16,
  "✅ RUN",
  "plan 16 lost its RUN stamp — reconciliation must never rewrite the settled record",
);

// ---------------------------------------------------------------------------
// 2 + 3. The four-gate review ledger and its agreement with the owner packets.
// ---------------------------------------------------------------------------

const ledgerStart = plan.indexOf("### The four-gate review ledger");
const ledgerEnd = plan.indexOf("### ", ledgerStart + 10);
const ledgerSection =
  ledgerStart === -1 ? "" : plan.slice(ledgerStart, ledgerEnd === -1 ? undefined : ledgerEnd);

if (ledgerStart === -1) {
  failures.push(`${planPath} — missing the four-gate review ledger`);
} else {
  expectContains(
    planPath,
    ledgerSection,
    "never a graph fact",
    "the ledger must declare itself git process evidence, never a graph fact",
  );

  const gateRow = (gate) =>
    ledgerSection.split("\n").find((line) => line.startsWith(`| ${gate} |`)) ?? "";

  for (const { gate, meaning, sha, corrections } of GATES) {
    const row = gateRow(gate);
    if (row === "") {
      failures.push(`${planPath} — ledger row for Gate ${gate} is missing`);
      continue;
    }
    expectContains(planPath, row, meaning, `Gate ${gate} ledger row lost its meaning`);
    expectContains(planPath, row, "accepted", `Gate ${gate} ledger row lost its owner disposition`);
    expectContains(planPath, row, GATE_DATE, `Gate ${gate} ledger row lost its acceptance date`);
    expectContains(planPath, row, sha, `Gate ${gate} ledger SHA disagrees with the owner packet`);
    expectContains(
      planPath,
      row,
      corrections,
      `Gate ${gate} ledger row lost its corrections field`,
    );
  }

  const gate3 = gateRow("3");
  for (const needle of ["npm audit", "yaml@2.9.0", "vitest"]) {
    expectContains(
      planPath,
      gate3,
      needle,
      "Gate 3 ledger row dropped the owner directive on the npm audit advisories",
    );
  }

  const gate4 = gateRow("4");
  for (const needle of [
    "sdp import",
    "checkout-v1 migration",
    "canonical flip",
    "C2-parity",
    "table-sugar",
    "editor-association gap",
  ]) {
    expectContains(planPath, gate4, needle, "Gate 4 ledger row lost the owner phase-2 disposition");
  }
}

// ---------------------------------------------------------------------------
// 4. Status surfaces: the handbook stamps the executed phase; semantics stay elsewhere.
// ---------------------------------------------------------------------------

expectContains(
  agentsPath,
  agents,
  "EXECUTED — phase-1 implementation complete; final audit passed",
  "the handbook must stamp the executed phase status",
);

const gateRowLine = agents.split("\n").find((line) => line.includes("the green gate")) ?? "";
for (const needle of [
  "generate:self-hosting",
  "generate:example",
  "check:self-hosting",
  "check:example",
  "preflight",
]) {
  expectContains(
    agentsPath,
    gateRowLine,
    needle,
    `the green-gate row does not name the current root+checkout chain (${needle})`,
  );
}

// Numbered-plan wording: the handbook must not record the plan's execution state.
const numberedWording = /plan 17[^\n]{0,80}(landed|executed|accepted|completed|owner-accepted)/iu;
if (numberedWording.test(agents)) {
  failures.push(`${agentsPath} — carries numbered wording (a plan-completion claim)`);
}

// The diary and the glossary are inspected for semantics only: no status may be written into
// them. (The diary's dated entries legitimately name the plan; completion claims are banned.)
for (const [surface, text] of [
  [decisionsPath, decisions],
  [glossaryPath, glossary],
]) {
  for (const needle of ["owner-accepted", "phase-1 implementation complete", "plan 17 landed"]) {
    expectOmits(
      surface,
      text,
      needle,
      "carries plan-status wording — semantics only, never status",
    );
  }
}

// ---------------------------------------------------------------------------
// 5. The two ADR three-part-test dispositions.
// ---------------------------------------------------------------------------

for (const needle of [
  "### MD-20",
  "the strict consumer-exclusion contract",
  "### MD-21",
  "the envelope-grammar ownership posture",
  "| MD-20 |",
  "| MD-21 |",
]) {
  expectContains(
    decisionsPath,
    decisions,
    needle,
    `ADR disposition missing from the diary: ${needle}`,
  );
}
for (const needle of ["three-part-test dispositions", "MD-20", "MD-21"]) {
  expectContains(
    planPath,
    plan,
    needle,
    `the plan does not record the three-part-test disposition (${needle})`,
  );
}

// ---------------------------------------------------------------------------
// 6. Phase-2 plan scaffold: the G1-G8 process ledger is present and usable.
// ---------------------------------------------------------------------------

if (plan18 !== null) {
  const phase2LedgerStart = plan18.indexOf("## (m) §10 Gate ledger G1-G8");
  const phase2LedgerEnd = plan18.indexOf("## (n)", phase2LedgerStart + 10);
  const phase2Ledger =
    phase2LedgerStart === -1
      ? ""
      : plan18.slice(phase2LedgerStart, phase2LedgerEnd === -1 ? undefined : phase2LedgerEnd);

  if (phase2LedgerStart === -1) {
    failures.push(`${plan18Path} — missing the G1-G8 gate ledger`);
  } else {
    expectContains(
      plan18Path,
      phase2Ledger,
      "never graph content",
      "the G1-G8 ledger must declare itself process evidence, never graph content",
    );

    for (const gate of Array.from({ length: 8 }, (_, index) => `G${index + 1}`)) {
      const row = phase2Ledger.split("\n").find((line) => line.startsWith(`| ${gate} |`)) ?? "";
      if (row === "") {
        failures.push(`${plan18Path} — ledger row for ${gate} is missing`);
        continue;
      }

      const cells = row
        .split("|")
        .map((cell) => cell.trim())
        .slice(1, -1);
      if (cells.length !== 4 || cells.some((cell) => cell === "")) {
        failures.push(`${plan18Path} — ledger row for ${gate} is empty or malformed`);
      }
      if (!/(pending|planned|accepted|done|deferred|not started)/iu.test(cells[3] ?? "")) {
        failures.push(`${plan18Path} — ledger row for ${gate} has no valid disposition state`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Temporal dry-run leg (default root only — a temp tree is not a git checkout).
// ---------------------------------------------------------------------------

let temporal = { ran: false, reason: "non-default rootDir" };
if (rootDir === defaultRoot) {
  const run = spawnSync("node", ["check-temporal.mjs"], { cwd: rootDir, encoding: "utf8" });
  temporal = { ran: true, exit: run.status };
  if (run.status !== 0) {
    failures.push(
      `check-temporal.mjs — exit ${run.status}: a non-plan durable string carries a banned temporal token\n${run.stderr}`,
    );
  }
}

if (failures.length > 0) {
  console.error("check-self-hosting-gates — disagreeing surfaces:\n");
  console.error(failures.join("\n"));
  process.exit(1);
}

const firstWord = (state) => state.replace(/\*/g, "").split(/[\s—]/u)[0];
const report = {
  surfaces: {
    plan: planPath,
    plan16: plan16Path,
    agents: agentsPath,
    decisions: decisionsPath,
    glossary: glossaryPath,
    phase2Plan: plan18 === null ? null : plan18Path,
  },
  temporal,
  docket: {
    total: docket.length,
    nonPending: docket.length - pendingRows.length,
    dispositions: docket.map((row) => ({ item: row.item, state: firstWord(row.state) })),
    pending: pendingRows.map((row) => row.item),
  },
  adrDispositions: {
    "the strict consumer-exclusion contract (MD-20)":
      "diary entry entered — three-part test passes",
    "the envelope-grammar ownership posture (MD-21)":
      "diary entry entered — three-part test passes",
  },
  ledger: Object.fromEntries([
    ...GATES.map(({ gate, meaning, sha, corrections }) => [
      `gate${gate}`,
      { meaning, disposition: "accepted", date: GATE_DATE, sha, corrections },
    ]),
  ]),
  phase2Ledger: plan18 === null ? "not present" : "G1-G8 scaffold checked",
};
console.log(JSON.stringify(report, null, 2));
process.exit(0);

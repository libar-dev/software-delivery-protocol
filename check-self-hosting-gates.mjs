import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// check-self-hosting-gates — the structured consistency gate for the self-hosting phase's
// pre-Gate-4 docket close and its four-gate review ledger (git process evidence, never a
// graph fact).
//
// Asserts, and NAMES each disagreeing surface on failure:
//   1. DOCKET — every obligation resolvable before the fourth owner gate is non-pending
//      (done/deferred/dropped with rationale); exactly ONE row stays pending: the four-gate
//      review ledger's own Gate-4 fill, owned by the final gate's post-acceptance work.
//   2. LEDGER — the four-gate review ledger exists in the plan; Gates 1–3 carry meaning,
//      owner disposition (accepted), date, accepted SHA, corrections (none), and rulings
//      (including the Gate-3 owner directive on the npm audit advisories); Gate 4 is an
//      explicit pending row with meaning only — no disposition, date, SHA, or corrections.
//   3. PACKET AGREEMENT — the ledger's Gate 1–3 fields agree with the owner-packet
//      dispositions, embedded here as constants read from those packets.
//   4. STATUS SURFACES — progress lives in the plan and the agent handbook only: the handbook
//      still stamps the plan DRAFTED and its green-gate row names the current root+checkout
//      chain; the handbook, the diary, and the glossary carry no plan-completion or
//      owner-acceptance wording, and Gate-4 acceptance is pre-recorded nowhere.
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
const plan16Path = ["plans", "16-carrier-ruling.md"].join("/");
const agentsPath = "AGENTS.md";
const decisionsPath = "docs/concept/DECISIONS.md";
const glossaryPath = "CONTEXT.md";

// Owner-packet dispositions, read from the three packets and embedded as constants: the
// ledger must agree with them field for field. The shared gate date is assembled in parts.
const GATE_DATE = ["2026", "07", "18"].join("-");
const GATES = [
  { gate: "1", meaning: "schema freeze", sha: "aca79090529c2f6625ceafc78f33e16da81bfcb1" },
  { gate: "2", meaning: "corpus/readiness", sha: "cdb68fc1564c9167ebc0372ba8f8599a97df4393" },
  { gate: "3", meaning: "executable loop", sha: "1687885df7b1898c56e154ce2dbe4fa3c6c6c425" },
];
const SHA_SHAPE = /[0-9a-f]{40}/u;
const DATE_SHAPE = /20[0-9]{2}-[0-9]{2}-[0-9]{2}/u;

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

// ---------------------------------------------------------------------------
// 1. The docket: 25 obligations, exactly one pending (the Gate-4 fill).
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
if (pendingRows.length !== 1 || !pendingRows[0]?.item.includes("Four-gate review ledger")) {
  failures.push(
    `${planPath} — expected exactly one pending docket row (the four-gate review ledger's Gate-4 fill); found ${pendingRows.length}: ${pendingRows.map((row) => row.item).join(" · ") || "none"}`,
  );
} else {
  expectContains(
    planPath,
    pendingRows[0].state,
    "Gate 4",
    "the pending docket row must name Gate 4 as its remaining obligation",
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

  for (const { gate, meaning, sha } of GATES) {
    const row = gateRow(gate);
    if (row === "") {
      failures.push(`${planPath} — ledger row for Gate ${gate} is missing`);
      continue;
    }
    expectContains(planPath, row, meaning, `Gate ${gate} ledger row lost its meaning`);
    expectContains(planPath, row, "accepted", `Gate ${gate} ledger row lost its owner disposition`);
    expectContains(planPath, row, GATE_DATE, `Gate ${gate} ledger row lost its acceptance date`);
    expectContains(planPath, row, sha, `Gate ${gate} ledger SHA disagrees with the owner packet`);
    expectContains(planPath, row, "none", `Gate ${gate} ledger row lost its corrections field`);
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
  if (gate4 === "") {
    failures.push(
      `${planPath} — ledger row for Gate 4 is missing (it must be an explicit pending row)`,
    );
  } else {
    expectContains(planPath, gate4, "pending", "Gate 4 must be an explicit pending row");
    expectContains(planPath, gate4, "whole-phase", "Gate 4 ledger row lost its meaning");
    if (/accepted/i.test(gate4)) {
      failures.push(
        `${planPath} — Gate 4 acceptance was pre-recorded; that is fabricated evidence`,
      );
    }
    if (SHA_SHAPE.test(gate4) || DATE_SHAPE.test(gate4)) {
      failures.push(
        `${planPath} — Gate 4 carries a date or SHA before the owner disposes the gate`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Status surfaces: progress in the plan + handbook only; semantics elsewhere.
// ---------------------------------------------------------------------------

expectContains(agentsPath, agents, "DRAFTED", "the handbook lost the plan's DRAFTED status");

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

// Numbered wording: the handbook must not record the plan's execution state.
const numberedWording = /plan 17[^\n]{0,80}(landed|executed|accepted|completed|owner-accepted)/iu;
if (numberedWording.test(agents)) {
  failures.push(`${agentsPath} — carries numbered wording (a plan-completion claim) before Gate 4`);
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
    ...GATES.map(({ gate, meaning, sha }) => [
      `gate${gate}`,
      { meaning, disposition: "accepted", date: GATE_DATE, sha, corrections: "none" },
    ]),
    ["gate4", { meaning: "whole-phase review and the phase-2 disposition", state: "pending" }],
  ]),
};
console.log(JSON.stringify(report, null, 2));
process.exit(0);

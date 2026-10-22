// Probes for the review of lane R's roadmap reading. Throwaway evidence, never product code.
// Usage: node probes.mjs <worktree> <scratch-dir>
// It writes a small probe corpus into <scratch-dir> (outside the repository, so the extractor of
// this corpus never reads it), runs the drafted recipe 53 and 55 bodies over two probe roadmaps,
// checks what the review asked for, renders both roadmaps on one page, checks that every entry id
// is unique and that every entry link lands in its own roadmap, and writes `probes/answer.json`,
// `probes/checks.json`, `probes/memo.md` and `probes/roadmap.html` beside this script.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { body53, body55, query, renderPage } from "./build.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const [worktree, scratch] = process.argv.slice(2);
if (!worktree || !scratch) throw new Error("usage: node probes.mjs <worktree> <scratch-dir>");
const sdp = join(worktree, "dist/cli/sdp.js");

const carrier = (id, kind, altitude, readiness, relations, title, body) => `---
id: ${id}
kind: ${kind}
altitude: ${altitude}
readiness: ${readiness}
relations:${relations === "" ? " {}" : `\n${relations}`}
---
# ${title}

${body}
`;
const rules = (text) => `## Behavior\n\n- rule: ${text}\n`;
const files = {
  "root.sdp.md": carrier("spec:probe.root", "behavior", "epic", "ready", "  decidedBy: spec:probe.choice", "The probe root",
    `## Intent\n\n- outcome: Hold the probe entries.\n\n${rules("The root holds its entries.")}`),
  "choice.sdp.md": carrier("spec:probe.choice", "decision", "feature", "ready", "  refines: spec:probe.root", "The probe choice",
    "## Intent\n\n- outcome: Settle the probe root.\n\n## Decision\n\n- context: The probe needs a settled root.\n- decision: The root stands.\n"),
  "gamma.sdp.md": carrier("spec:probe.gamma", "behavior", "feature", "defined", "  refines: spec:probe.root\n  dependsOn: spec:probe.delta", "Gamma, first on the roadmap",
    `## Intent\n\n- outcome: Rest on delta while it stands first.\n\n### Open questions\n\n- [non-blocking #gammaChoice] Which gamma does the owner want?\n  - decider: owner\n\n${rules("Gamma rests on delta.")}`),
  "delta.sdp.md": carrier("spec:probe.delta", "behavior", "feature", "defined", "  refines: spec:probe.root", "Delta, second on the roadmap",
    `## Intent\n\n- outcome: Stand second while gamma rests on it.\n\n${rules("Delta stands alone.")}`),
  "alpha.sdp.md": carrier("spec:probe.alpha", "behavior", "feature", "ready", "  refines: spec:probe.root", "Alpha, a ready root",
    `## Intent\n\n- outcome: State ready while its descendants are not.\n\n${rules("Alpha is ready.")}`),
  "alpha.bare.sdp.md": carrier("spec:probe.alpha.bare", "behavior", "story", "idea", "  refines: spec:probe.alpha", "A bare descendant",
    "## Intent\n\n- outcome: Lack its kind's evidence.\n"),
  "alpha.open.sdp.md": carrier("spec:probe.alpha.open", "behavior", "story", "scoped", "  refines: spec:probe.alpha", "An open descendant",
    `## Intent\n\n- outcome: Wait on a blocking question.\n\n### Open questions\n\n- [blocking #openChoice] Which way does the descendant go?\n  - decider: owner\n\n${rules("The descendant goes one way.")}`),
  "epsilon.sdp.md": carrier("spec:probe.epsilon", "behavior", "feature", "defined", "  refines: spec:probe.root", "Epsilon, with a diamond",
    `## Intent\n\n- outcome: Hold a descendant with a second parent.\n\n### Open questions\n\n- [non-blocking #epsilonOpen] Who settles this one?\n\n${rules("Epsilon holds the diamond.")}`),
  "epsilon.diamond.sdp.md": carrier("spec:probe.epsilon.diamond", "behavior", "story", "defined", "  refines:\n    - spec:probe.epsilon\n    - spec:probe.outside", "The diamond",
    `## Intent\n\n- outcome: Refine epsilon and a Spec outside the roadmap.\n\n${rules("The diamond has two parents.")}`),
  "outside.sdp.md": carrier("spec:probe.outside", "behavior", "feature", "scoped", "  refines: spec:probe.root", "Outside the roadmap",
    `## Intent\n\n- outcome: Stay off the roadmap below defined.\n\n### Open questions\n\n- [blocking #outsideChoice] What does outside settle?\n  - decider: delegated\n\n${rules("Outside stays scoped.")}`),
  "first.pack.sdp.md": "---\nid: pack:probe-first\nspecs:\n  - spec:probe.gamma\n  - spec:probe.delta\n  - spec:probe.alpha\n  - spec:probe.epsilon\n---\n# The first probe roadmap\n\nGamma first, though it rests on delta.\n",
  "second.pack.sdp.md": "---\nid: pack:probe-second\nspecs:\n  - spec:probe.delta\n  - spec:probe.gamma\n---\n# The second probe roadmap\n\nThe same two Specs, the other way round.\n",
};
rmSync(scratch, { recursive: true, force: true });
mkdirSync(join(scratch, "specs"), { recursive: true });
for (const [name, text] of Object.entries(files)) writeFileSync(join(scratch, "specs", name), text);
const validation = execFileSync("node", [sdp, "validate", scratch], { encoding: "utf8" });
execFileSync("node", [sdp, "studio", scratch], { encoding: "utf8" });

const corpus = { root: scratch, exclude: [] };
const answers = ["pack:probe-first", "pack:probe-second"].map((pack) => query(sdp, corpus, body53, { pack }));
const [first, second] = answers.map((answer) => answer.roadmaps[0]);
const memos = [first, second].map((roadmap) => query(sdp, corpus, body55, { pack: roadmap.pack }).memo);
const entry = (roadmap, id) => roadmap.entries.find((row) => row.id === id);
const checks = [];
const check = (finding, claim, value) => checks.push({ finding, claim, pass: value === true });

// Finding 1: statements keep the statement queue's order whatever the roadmap's places.
const statementOrder = first.waiting.statements.map((row) => row.id);
check(1, "delta (place 2) is listed before gamma (place 1), which rests on it", statementOrder.indexOf("spec:probe.delta") < statementOrder.indexOf("spec:probe.gamma"));
check(1, "the second roadmap lists the statements in the same order", JSON.stringify(second.waiting.statements.map((row) => row.id)) === JSON.stringify(statementOrder.filter((id) => second.waiting.statements.some((row) => row.id === id))));
// Finding 2: a ready root with unfinished descendants names them and what holds them.
const alpha = entry(first, "spec:probe.alpha");
const part = (id) => alpha.workRows.find((row) => row.id === id);
check(2, "alpha states ready and reads to design", alpha.statedReadiness === "ready" && alpha.lane === "to design");
check(2, "the bare descendant is a part in alpha's lane, held by kind-evidence-present", part("spec:probe.alpha.bare")?.lane === "to design" && part("spec:probe.alpha.bare").holdsNextRung.some((row) => row.clause === "kind-evidence-present"));
check(2, "the open descendant is a part in alpha's lane, held by no-blocking-open-questions", part("spec:probe.alpha.open")?.lane === "to design" && part("spec:probe.alpha.open").holdsNextRung.some((row) => row.clause === "no-blocking-open-questions"));
// Finding 4: earlier waiting statements come from the statement queue.
check(4, "gamma's earlier statement is delta, on the roadmap at place 2", JSON.stringify(entry(first, "spec:probe.gamma").earlierStatements) === JSON.stringify([{ id: "spec:probe.delta", where: "roadmap", onRoadmap: 2 }]));
check(4, "delta has no earlier statement", entry(first, "spec:probe.delta").earlierStatements.length === 0);
check(4, "the memo says so for delta", memos[0].includes("No preceding waiting statement in the statement queue."));
// Finding 5: a descendant's outside parent is a rests-on row naming that descendant.
const epsilon = entry(first, "spec:probe.epsilon");
const outsideRow = epsilon.restsOn.find((row) => row.id === "spec:probe.outside");
check(5, "epsilon rests on outside through refines from the diamond", outsideRow?.via === "refines" && JSON.stringify(outsideRow.from) === JSON.stringify(["spec:probe.epsilon.diamond"]) && outsideRow.onRoadmap === null);
check(5, "the diamond's holding row names outside as the typed-dependency target", epsilon.workRows.find((row) => row.id === "spec:probe.epsilon.diamond")?.holdsNextRung.some((row) => row.clause === "typed-dependency-targets-are-defined" && row.targets.includes("spec:probe.outside")));
// Finding 6: questions with no decider are listed apart and counted.
check(6, "epsilon's undecided question is listed apart and counted", first.totals.withoutDecider === 1 && first.waiting.withoutDecider[0]?.address === "spec:probe.epsilon#question.epsilonOpen");
check(6, "the owner's questions are listed as before", first.waiting.questions.map((row) => row.address).join() === "spec:probe.gamma#question.gammaChoice,spec:probe.alpha.open#question.openChoice");
check(6, "the memo names the questions with no decider", memos[0].includes("These questions have no named decider."));
// Finding 7: two roadmaps on one page share no entry id, and every entry link stays in its roadmap.
const titles = new Map(query(sdp, corpus, "return g.specs().map((spec) => [spec.id, spec.title ?? null])", {}));
const page = renderPage(readFileSync(join(scratch, "generated/spec-studio/queue.html"), "utf8"), [first, second], memos, titles);
const ids = [...page.matchAll(/ id="([^"]+)"/gu)].map((match) => match[1]);
check(7, "no element id repeats", new Set(ids).size === ids.length);
const sections = page.split("<section aria-labelledby=").slice(1);
const links = sections.flatMap((section, at) => [...section.matchAll(/href="#(roadmap-[^"]+)"/gu)].map((match) => ({ at, target: match[1] })));
check(7, "every entry link names an id on the page", links.every((link) => ids.includes(link.target)));
check(7, "every entry link lands in its own roadmap's section", links.every((link) => link.target.startsWith(`roadmap-probe-${link.at === 0 ? "first" : "second"}-entry-`)));
// Finding 10: a Pack without the field reads in authored reading order.
check(10, "the summary says authored reading order, never priority order", page.includes("in authored reading order") && !page.includes("entries in priority order"));

const out = join(here, "probes");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "answer.json"), `${JSON.stringify({ first, second }, null, 2)}\n`);
writeFileSync(join(out, "checks.json"), `${JSON.stringify({ validation: validation.trim().split("\n").at(-1), links: links.length, checks }, null, 2)}\n`);
writeFileSync(join(out, "memo.md"), memos[0]);
writeFileSync(join(out, "roadmap.html"), page.replace('<script defer src="assets/studio.js"></script>', "").replaceAll('href="assets/', 'href="../assets/'));
writeFileSync(join(scratch, "generated/spec-studio/roadmap-expanded.html"), page.replaceAll('<details class="card"', '<details open class="card"'));
for (const row of checks) console.log(`${row.pass ? "pass" : "FAIL"}  finding ${row.finding}: ${row.claim}`);
if (checks.some((row) => !row.pass)) process.exitCode = 1;

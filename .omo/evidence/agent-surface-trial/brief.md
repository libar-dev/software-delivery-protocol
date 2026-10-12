# Usability trial of the Protocol's agent surface

You are one of several agents trying the agent surface of the Libar Software Delivery Protocol, in
the repository at /Users/darkomijic/dev-libar/software-delivery-protocol, branch
`feature/design-management-v0` at `bc2c84e`. The owner wants an honest assessment of how usable the
graph and its interface are for an agent, as input for upcoming work. This is not a code review.
Report what was hard, slow, confusing or impossible as plainly as what worked.

## Rules

- **Read-only.** Write no files anywhere.
- **Files you may read, and only these:** `.agents/skills/sdp-agent-surface/SKILL.md`,
  `.agents/skills/sdp-authoring/SKILL.md`, `.agents/skills/sdp-sessions/SKILL.md`,
  `docs/agent-surface/recipes.md`, the files under `dist/recipes/`, and `CONTEXT.md`.
- **Everything else comes from the graph,** through the evaluation sink run from the repository
  root: `pnpm --silent sdp:q '<body>'`, with `--params '<json>'` or `--params @<file>` and `--json`
  as the skills describe. If `pnpm` is unavailable, the same call is
  `node ./dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity '<body>'`.
  Do not run any other `sdp` verb (they write files), and do not use git,
  `grep`, `cat`, `ls`, `find` or an editor on any other repository file: not `specs/`, `src/`,
  `test/`, `plans/`, `docs/concept/`, `AGENTS.md`, `generated/` or history.
- **When the graph cannot give you something,** or you want to open a file you may not read, do not
  work around it. Record it in the friction log and answer with what the graph gave you.
- **Back every answer** with the command you ran (a recipe number, or the body you wrote) and a
  short quote of the output that supports it. Say "not answerable from the graph" when that is the
  truth.

## Tasks

1. What implementation work is ready but not built? And which Specs that are neither examples nor
   decisions are stated `defined` but have no implementation yet?
2. Is any Spec implemented while stated below `ready`? Does any Spec state a readiness above what
   its floor supports?
3. Before changing `spec:consumers.pack-design`: which Specs rest on it, directly or transitively,
   and which code units, verifiers and Packs would need to follow the change?
4. Which decisions narrow `spec:decisions.shipped-projections-frozen`? Does any decision currently
   supersede another? Which Specs does the freeze still shape?
5. Which `ready` Specs have no verifier binding? What other warnings does validation report?
6. Where does the corpus say what a context bundle returns when the content it may never cut
   already exceeds the budget, and what does it say?
7. In `pack:design-management-v1`, which members are held below their next rung, by which clause
   and which target, and which members wait only for their author's statement?
8. Which code realizes `spec:consumers.pack-design` (file, line, component, layer, context), and
   which test verifies it?
9. What is affected if `src/reader/reader.ts` changes?
10. Does any `uses` edge cross a bounded context? Which layer-to-layer directions occur, and does
    any run outward, for example from domain to edge?
11. List the blocking open questions in the corpus. Which are deferral triggers waiting for a named
    reader, and which are design holds?
12. Can `spec:consumers.spec-studio` be stated `ready` now? If not, what holds it, and what would
    have to change?
13. Resolve `spec:consumers.spec-studio.sharing#design.buildStamp` and
    `spec:model.design-maturity#question.designedRung`. Give the value and source line of what
    resolves, and explain why anything does not.

**Open task.** Using only the graph, assess the Protocol's delivery state: what is built and
verified, what is designed but unbuilt, where the design is thinnest, and what the next arc should
be, with reasons drawn from graph answers. At most 300 words.

## Report format

Keep the whole report under 2,500 words.

1. **Answers.** For each task: the answer; the commands behind it; your confidence (high, medium
   or low); and any friction, in one line.
2. **Friction log.** A table, one row per incident: what you wanted, what you tried, what you got,
   what you did instead, and how much it cost you (minor, slowed, blocked).
3. **Assessment.** Rate each 1 to 5 with one line of evidence: finding the right recipe or body;
   the shape of outputs; error messages and diagnostics; the vocabulary; how accurately the skills
   describe what the graph actually does; how clearly claims and delivery facts read; speed. Then
   the five improvements you would make first, ranked, each tied to friction rows. Then what worked
   best.
4. **The open task.**
5. **Commands.** How many `sdp q` calls you made, and a list with bodies abbreviated.

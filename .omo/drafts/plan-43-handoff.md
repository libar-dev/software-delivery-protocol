# Handoff: the main thread for plan 43

Written 2026-10-12 by the Claude Opus 5.5 session that folded plan 41, ran the agent-surface trial
and drafted plan 43, so a fresh main thread can continue without that session's context. Re-measure
everything below before relying on it; the graph wins over this note.

## Where things stand

- **PR #30** (plan 41, design management) is merged into `main` as `0353f10`.
- **PR #31** (plan 43, draft) is open against `main` from `feature/design-iteration-v0`. Its CI was
  green at `6a58736`; later commits on the branch are `12fc1dd` (candidate and adapter rulings)
  and this note. The PR carries the whole arc: the design pass and the build land on this branch.
- **Gate at `12fc1dd`:** `npm run check` exits 0 (1,540 pooled tests in 77 files, 93 CLI tests).
  Validate: 252 Specs, 4 Packs, 263 anchors, 519 nodes, 1,238 edges, 0 errors, 4 warnings (the
  spec-sections gap the owner keeps, three prose mentions with recorded reasons). Recipes 1 and 2
  are empty.
- **Plan order, ruled:** plan 43 (this arc), then plan 42 (Studio phase 0, drafted), then a later
  arc led by corpus rules and architecture constraints.

## Read first, in order

1. `AGENTS.md` (law, discipline, PR description standard).
2. The three skills: `.agents/skills/sdp-agent-surface/SKILL.md`, `sdp-authoring/SKILL.md`,
   `sdp-sessions/SKILL.md`.
3. `plans/43-design-iteration-on-a-readable-graph.md`, then `plans/42-spec-studio-phase-zero.md`.
4. The last sections of `plans/41-design-management-closer-to-v0.md`: the owner's rulings, the
   fold's lanes and reviews, the second round.
5. `.omo/evidence/agent-surface-trial/synthesis.md` and `brief.md`.
6. The arc in the graph: `pnpm --silent sdp:q "$(cat dist/recipes/29-pack-design.js)" --params '{"pack":"pack:design-iteration-v1"}' --json`.

## The next step: the design pass

Plan 43 opens with an Opus 5.5 design pass over `pack:design-iteration-v1`, before any code:

- Settle each member's remaining open questions as recommendations for the owner, among them
  `spec:model.rule-keys#question.exercisesCarrier`, relation reasons' typed attributes and mention
  reasons, the question fields' link targets and lean home, the bundle's scopes and perspective
  filter, the design diff's comparing-rule home and pass base, and the proposal's proposer.
- Design the output shapes of the changed recipes (`spec:consumers.agent-surface.answer-shapes`)
  and the grammar details, written into the Specs as rules, Design entries or contracts, so the
  gpt-6.1-sol lanes write against them.
- Two typed-dependency holds need statements before their children can state `ready`:
  `spec:consumers.intent-composition` (`idea`, parent of the proposal) and
  `spec:consumers.impact-graph` (`idea`, parent of the curation layer).
- Bring the recommendations to the owner on a ruling sheet (below), then the owner states `ready`
  on each member as its lane starts.

Then the lanes in plan 43's table, the integration lane, gpt-6-astra's review, and the acceptance:
the trial re-run on gpt-6.1-sol with the same brief (refresh the answer key first, since this arc
changes recipe outputs), a read-only design pass over one of libar-platform's capability Packs, and
the gate.

## How the owner works

- **Model routing.** Opus 5.5 for copy, API design and work needing taste. gpt-6.1-sol as a writer
  against designed APIs and as a line reviewer. gpt-6-astra (xhigh) for deep adversarial reviews.
  Fable 5.1 (high) as an advisor to converge on a ruling's exact wording. Cross-family review during
  execution is deliberate: Sol reads Opus's corpus edits mid-run, Astra reviews the whole fold.
- **Relay.** Load the `relay:jobs` skill. Launch with `Agent({ subagent_type: "relay:job", ... })`
  and a header of `model`, `effort`, `mode` (`read-only` for reviews; the `yolo` default for
  writers, fenced in the brief), `cd`, optionally `brief: /abs/path`, then `---` and the brief.
  Lanes run in their own worktrees: `git worktree add ../sdp-<lane> -b <branch> HEAD`, symlink
  `node_modules`, `npm run build`, merge with `--no-ff`, remove the worktree after.
- **Ruling sheets.** The owner rules through an Artifact page with the `db` and `user` capabilities:
  one card per decision, options with a recommendation and reasons, a note field, picks saved to
  the `rulings` collection and read back with `ArtifactData` `list`. "Copy rulings" is the fallback.
  The two sheets so far: https://claude.ai/artifact/LjdpDyyK1RsttVxM2nCkCX (PR 30, 49 cards) and
  https://claude.ai/artifact/KAqivXzXeAS4j193HYaprT (next arc, 9 cards). The second sheet's HTML is a
  workable template.
- **Preferences.** Fewer, larger PRs and bigger leaps; the adopter's Application Platform redesign
  is the showcase. Delete noise: everything is unreleased and the owner is the only user. Pushing
  this work is approved; merges use merge commits, as #28 to #30 did; ask before merging #31. The
  owner may delegate a ruling ("advise Fable and rule"); record that it was delegated.
- **Writing.** Lean, plain prose for outsiders, in the ratified terms; no em dashes in new prose
  except where the Model grammar requires one; the `unslop` skill applies.

## Gotchas this session hit

- `npm run check:temporal` bans ISO dates in Specs, `AGENTS.md` and `CONTEXT.md`; `plans/`,
  `docs/concept/DECISIONS.md` and `.omo/evidence/` are exempt.
- The self-hosting oracle (`test/self-hosting-oracle/`) is a transcription of carriers, never graph
  output. Any carrier change needs its oracle entry changed to the same text, plus the readiness
  distribution and totals in `test/self-hosting-graph.test.ts` and the current-plan pin. gpt-6.1-sol
  re-pins well from a brief naming the commit to follow; small edits can change carrier and oracle
  with the same string.
- A `spec:` id in prose must resolve (error) and should have a declared relation either way
  (warning). Every Spec belongs to a Pack.
- Every body entry is one physical line; Model entries use `**term** — definition`.
- `pnpm --silent sdp:q` from the repository root; never a bare `sdp`; `npm run build` after engine
  edits. Bash's working directory resets each call, so use absolute paths in worktrees.
- CI runs twice per push (push and pull_request events); a heavy test needs an explicit timeout
  (`}, 20_000);`), as the every-Pack design test now has.
- Recipe 31 still calls every decision-to-decision `refines` a narrowing; the arc renames its fields
  to `refines` and `refinedBy`. Until then, read the label as the relation.

## After this arc

The adopter re-pins after the merge and adds the two associations plan 42's acceptance needs
(OD-157 in its question's text; a test anchor on `tests/types/pinned.test-d.ts`). Then plan 42.

## Status after the second main thread (2026-10-12)

The owner delegated the design pass and the rest of the arc while away. Done on the branch, all
committed locally: the design pass with Fable 5.1's advice and a gpt-6.1-sol line review; the
delegated rulings and `ready` statements; lanes S, A, C, G and L; integration; gpt-6-astra's review
and its fixes; the trial re-run; the adopter's read-only pass. Plan 43's last sections are the
record, and `npm run check` exits 0.

Not done, for the owner:

- **Review the delegated rulings** (plan 43, "The design pass, as run") before merging.
- The four questions in plan 43's "What comes next".

The owner pushed and applied `.omo/drafts/pr31-body.md` to PR 31. A second review (gpt-6-astra
for the owner, and Greptile) found seven defects at `bac264d`, CI failing on one; all seven were
fixed in `51a3225`, with three gaps from a check of that fix closed in `be35578`, and recorded in
plan 43's "Second review". The PR description's source stays
`.omo/drafts/pr31-body.md`; keep Greptile's appended block when re-applying it.

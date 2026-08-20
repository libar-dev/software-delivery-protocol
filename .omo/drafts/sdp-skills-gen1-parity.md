---
slug: sdp-skills-gen1-parity
status: reviewed
intent: clear
review_required: true
plan_path: .omo/plans/sdp-skills-gen1-parity.md
plan_sha256: d07ffa136e2d3de6028d6fa1f48a29f998c26f0bb4b2c408948c4cf0e96c74e3
review_round_id: sdp-skills-gen1-parity-r1-20260820055259
review_round_limit: 5
pending-action: execute .omo/plans/sdp-skills-gen1-parity.md only after plan 37 closes, through /start-work
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: null
    target: .omo/plans/sdp-skills-gen1-parity.md
    round_id: sdp-skills-gen1-parity-r1-20260820055259
    plan_sha256: d07ffa136e2d3de6028d6fa1f48a29f998c26f0bb4b2c408948c4cf0e96c74e3
    launch_id: launch-d07ffa136e2d-20260820055259
    session: st_01a01dbb
    result: "[OKAY] All referenced files and code paths exist and support the described work. Each todo has actionable steps and executable QA scenarios; plan 37 is explicitly guarded as a prerequisite."
approach: Tighten the existing three published SDP skills into a lean first version. Reuse Gen 1's clear routing, graph-first reads, compact decision guides, and live-truth discipline without adding a base skill, reference trees, renamed skills, copied doctrine, workflow gates, or new product behavior.
---

# Draft: sdp-skills-gen1-parity

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
| id | outcome | status | evidence path |
| --- | --- | --- | --- |
| read-on-ramp | Keep `sdp-agent-surface` as the sole graph bootstrap; add a compact start-from guide and correct the stdout contract | active | `.agents/skills/sdp-agent-surface/SKILL.md`; `src/cli/q-command.ts` |
| write-on-ramp | Slim `sdp-authoring` to the executable authoring path and replace duplicated carrier law with graph and Spec pointers | active | `.agents/skills/sdp-authoring/SKILL.md`; `spec:consumers.authoring-on-ramp` |
| session-router | Keep `sdp-sessions` byte-for-byte unchanged because it already is the lean Gen 1-inspired router | active | `.agents/skills/sdp-sessions/SKILL.md`; `spec:consumers.delivery-session-on-ramp` |
| checks-and-package | Preserve all existing tests and package assets unchanged; use them as the regression gate | active | `test/skills.test.ts`; `test/recipes.test.ts`; `test/package-smoke.test.ts` |
| public-guidance-sync | Correct the stale recipe count and keep the public on-ramp description aligned with the shipped trio | active | `README.md` |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
| assumption | adopted default | rationale | reversible? |
| --- | --- | --- | --- |
| Gen 1 is inspiration, not topology | Keep `sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`; do not add `sdp-base` or use the avoided term `handle` | Owner clarification plus the current carrying Specs and published package topology | No |
| Recipe ownership | Keep every runnable body in `docs/agent-surface/recipes.md`; skill references cite it | The catalog is executed verbatim and is the ratified growth valve | Yes |
| Active plan ordering | Execute this work after plan 37 closes | Plan 37 freezes recipe guidance during K measurement and is still at its owner-ratification checkpoint | Yes |
| Initial-version depth | Keep all three skills single-file and concise; add no `references/` directories | The current authoring skill can lose duplicated law instead of moving it into more files | Yes |

## Findings (cited - path:lines)
- Gen 1 separates mandatory vocabulary, the scriptable graph read path, and session routing, then uses skill-local references for progressive disclosure: `/home/darkomijic/dev-libar/architect/.agents/skills/architect-base/SKILL.md:1`, `/home/darkomijic/dev-libar/architect/.agents/skills/architect-graph-handle/SKILL.md:1`, `/home/darkomijic/dev-libar/architect/.agents/skills/architect-sessions/SKILL.md:1`.
- The Protocol already publishes a different, ratified split: read, write, and advisory session routing. `package.json:11`, `test/skills.test.ts:13`, `README.md:142`, and `AGENTS.md` all name `sdp-agent-surface`, `sdp-authoring`, and `sdp-sessions`.
- The live graph reports `spec:consumers.agent-surface`, `spec:consumers.authoring-on-ramp`, and `spec:consumers.delivery-session-on-ramp` at stated and derived `ready`, with resolving implementation and verifier bindings.
- `sdp-agent-surface` already owns graph-first bootstrap, the anti-anecdote rule, claim honesty, and the frozen adapter boundary: `.agents/skills/sdp-agent-surface/SKILL.md:15`.
- `sdp-authoring` carries the most removable duplication, including the full Gherkin grammar, editor setup, and parser versions alongside its actual procedure: `.agents/skills/sdp-authoring/SKILL.md:33`.
- `sdp-sessions` already routes capture, design, implementation, review, close, and handoff without phases or gates: `.agents/skills/sdp-sessions/SKILL.md:37`.
- The package currently ships only the three `SKILL.md` files and the shared recipe catalog, so new references require manifest and installed-package smoke coverage: `package.json:11`, `test/package-smoke.test.ts:84`.
- Plan 37 is still executing and freezes `docs/agent-surface/recipes.md` while measuring context assembly: `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md:3`, `.omo/plans/plan-37-settling-arc.md:22`.
- Public README prose is already stale at eleven recipes while the executable catalog has sixteen: `README.md:30`, `README.md:149`, `test/skills.test.ts:259`.
- The detailed runtime review found one concrete guidance bug: `.agents/skills/sdp-agent-surface/SKILL.md` says only the returned value is printed, but `src/cli/q-command.ts` permits `console.*` output before rendering the return. The skill should document `return` as the machine contract and forbid console output in shipped recipes rather than claiming suppression.
- The advisory lanes disagree on topology. The architecture lane recommends preserving the current three published jobs and deepening them. The detail-design lane recommends adding a fourth `sdp-base` with a new carrying Spec while retaining the other three. Both reject a renamed `sdp-graph-handle`.
- Live verification reproduced the stdout mismatch: `pnpm --silent sdp:q 'console.log("side-output"); return "value"'` exited successfully and printed both `side-output` and the rendered return.
- Current size is uneven: `sdp-agent-surface` 120 lines, `sdp-authoring` 197 lines, `sdp-sessions` 87 lines. The authoring skill is the clear slimming target; the session router is already close to the desired first-version size.

## Decisions (with rationale)
- Preserve the derived graph and carrying Specs as law. Skill prose cites them and never becomes a second glossary, grammar, readiness ladder, or workflow model.
- Reuse Gen 1's clear routing, state-driven reads, anti-anecdote rule, and verification discipline.
- Reject Gen 1's PatternGraph vocabulary, `@architect-*` taxonomy, folder promotion, FSM, scope gates, unlock reasons, design-Spec deletion, MCP twins, `bySymbol`, and skill-local recipe fork.
- Keep `docs/agent-surface/recipes.md` as the sole runnable recipe owner.
- Keep the initial version single-file. Progressive disclosure can be reconsidered only after observed context pressure.
- Treat `return` as the documented machine-output contract, not as a claim that the runtime suppresses `console.*`.
- Leave `sdp-sessions`, tests, and package metadata unchanged. Metis confirmed their current contracts already fit the accepted first version.

## Scope IN
- Correct `.agents/skills/sdp-agent-surface/SKILL.md` so its machine-output guidance matches the unchanged runtime, without adding a section or growing the file.
- Slim `.agents/skills/sdp-authoring/SKILL.md` by deleting only duplicated Gherkin grammar, editor setup, and parser-version prose, replacing them with the carrying Spec pointer.
- Preserve `.agents/skills/sdp-sessions/SKILL.md` byte-for-byte.
- Correct README's stale recipe count and preserve the published three-skill description.
- Preserve every existing test and package file unchanged.
- Focused tests, full `npm run check`, tarball inventory, source-checkout command probes, and the existing installed-package smoke test.

## Scope OUT (Must NOT have)
- No product implementation under `src/`.
- No `sdp-base`, `sdp-graph-handle`, fourth skill, or skill rename.
- No new `references/` directories in the initial version.
- No new carrying Spec or change to an existing Spec's behavior.
- No package-manifest expansion; the same three `SKILL.md` files and shared recipe catalog remain shipped.
- No test edit.
- No new query verb, reader accessor, projection, context bundle, or MCP surface.
- No edit to `docs/agent-surface/recipes.md`.
- No Gen 1 taxonomy, FSM, process gate, folder-promotion ladder, design-Spec deletion rule, or `handle` terminology.
- No rewrite of historical plans.
- No execution before plan 37 closes.

## Open questions
- None. The owner clarified that Gen 1 is inspiration only and requested a lean initial version.

## Approval gate
status: awaiting-approval
approach: Keep the published read/write/session trio, correct the query stdout guidance, delete duplicated carrier law from authoring, leave sessions and tests unchanged, and verify the existing source and package contracts.
test-strategy: Prose-only edits get no new wording tests. Preserve the existing skill, recipe, CLI, and package suites unchanged; run focused suites, full `npm run check`, package dry-run, and real source commands.
next-action: After explicit approval, scaffold `.omo/plans/sdp-skills-gen1-parity.md`, append decision-complete todos, run one Momus review, repair any blocking findings within the five-round cap, and hand off for separate `/start-work` execution after plan 37 closes.
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->

## Review convergence ledger
- Round 1 launch: `sdp-skills-gen1-parity-r1-20260820055259`
- Plan SHA-256: `d07ffa136e2d3de6028d6fa1f48a29f998c26f0bb4b2c408948c4cf0e96c74e3`
- Native receipt: `st_01a01dbb`
- Accepted blockers: none
- Non-blocking notes: none
- Result: APPROVED
- Final live SHA-256 validation: `d07ffa136e2d3de6028d6fa1f48a29f998c26f0bb4b2c408948c4cf0e96c74e3` matched the reviewed artifact after completion.

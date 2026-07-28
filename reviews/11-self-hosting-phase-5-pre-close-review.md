# 11 - Self-hosting phase-5 pre-close adversarial review

**Reviewed:** the full `main...feature/protocol-self-application-phase-5` diff at `7a309db`
(12 commits, 65 files, +3746 / −236), against `plans/22-self-hosting-phase-5.md` — its §1
engineering rulings (15–21, plus 1–14 carried from plans 20 and 21) and its §5 acceptance criteria
are this review's yardstick.

**Method:** mutation testing plus adversarial probing of the built product, independently designed.
A full clone of the branch was built outside the repository
(`/private/tmp/.../scratchpad/mut`), its engine broken one law at a time, and the whole 630-test
tree re-run after each mutation so *discrimination* is measured, not assumed. **Fourteen mutations**
were run: eleven against the engine (E1–E10, E6b), one against the corpus (D3), and two engine lies
aimed specifically at the recipe check (D2a, D2b). **None replays a probe §7 recorded** — every one
was designed against the source. Alongside them, **thirty-one adversarial probes** were run against
the *built* CLI (`node dist/cli/sdp.js q …`), never the test harness, because the ruled contract is
a CLI contract. Every headline number was recomputed from scratch at all six blessed commits by
re-deriving the graph, not by reading the ledger. The real checkout was never mutated; `git status`
was clean at start and after every probe.

**Disposition:** the disposition column at the foot is terminal — every finding carries
fixed / declined-with-reason / carried-with-reason, landed on this branch before the phase PR.
(`reviews/` is Prettier-ignored and temporal-guard-exempt.)

---

## Verdict

The phase is honest and lands what it claims. Every quantitative claim in §7, §8 and §9 reproduces
**exactly** — six recomputations at six commits, zero corrections. The `05` dissolution is clean:
both sweep forms and the widened residue sweep return zero, the two new deferral clauses state the
reservation *and* its status, the re-pointed audit pin genuinely bites under mutation, and 131 Spec
citations across the 21 re-pointed files resolve with zero dangling. All six S4 bound points are
real: each goes red when its named law is removed, and five of the six discriminate to exactly one
point.

The defects are concentrated in one place, and it is the place a front-door phase can least afford:
**the on-ramp's own documented invocations did not run as written at this repository's root**, and
**three of the ruled boundary behaviours had no test at all** — a warning-level extraction finding
gating the body, terminal detection by stream property rather than by descriptor, and `--exclude`
bypassing the strict exclusion contract all survived mutation with the entire 630-test tree green.
All four are fixed on this branch and each fix was re-verified to kill the mutant that found it.

---

## Dimension 1 — The mutation matrix

Baseline: 630 tests (576 pooled + 54 serial), all green. A mutation "kills" a point when that
point's suite goes red; it *discriminates* when the other bound points stay green.

### The six S4 bound points

| Point | Law under verification |
|---|---|
| `…agent-surface.scripted-context-body` | the front door end-to-end; the printed answer is byte-for-byte the body's return; the claim taxonomy is not collapsed |
| `…agent-surface.demand-map-entries` | all three demand-map entries answered in one body; the symbol entry honestly absent |
| `…reader.concept-entry` | the string bridge reaches section-only context and names the field |
| `…reader.file-entry` | both halves of the file bridge (binding-only source, and a carrier) |
| `…reader.changeset-entry` | impact reason, one-hop at-risk with its claim, coverage-unknown |
| `…design-review.pure-projection` | the parent's own law: page set, finding-as-data, byte-identical re-render, untouched root |

### The mutations, and what each killed

| # | Engine mutation | Bound points killed | Other suites killed (regression evidence) |
|---|---|---|---|
| E1 | `q-command`: wrap the printed return in a `{ value: … }` envelope | scripted-context-body · demand-map-entries | `cli-q` ×5, `recipes` ×8 |
| E2 | `reader.specContext`: drop declared-only verifiers (collapse the taxonomy by omission) | **scripted-context-body alone** | `reader` ×5, `design-review` ×4 |
| E3 | `reader.findByConcept`: name `id` as a matched field on every hit | **concept-entry alone** | `reader` ×3 |
| E4 | `reader.byFile`: answer with an absolute path instead of the root-relative one | **file-entry alone** | `reader` ×5 |
| E5 | `reader.blastRadius`: let the changed file's own binding node count as at-risk | **changeset-entry alone** | `reader` ×1 |
| E6 | `design-review`: drop the Pack page from the page set | pure-projection · pack-member-table | `design-review` ×3 |
| E6b | `reader.findingsNaming`: a Spec page stops rendering the finding that names it | **pure-projection alone** | `reader` ×1, `design-review` ×4, `review-08` ×1, `package-smoke` |
| E9 | `q-command`: read stdin at a terminal instead of refusing (the gen-1 hang footgun) | — | `cli-q` ×1 (the named refusal test) |
| D2a | `reader`: derived readiness reports a rung that is not on the ladder | banner points ×2 | **`recipes` ×2** (drift alarm, readiness divergence) |
| D2b | `reader`: at-risk reasons stop carrying the claim | changeset-entry | **`recipes` ×1** (blast radius), `reader` ×1 |
| D3 | corpus: a documented recipe heading with **no** runnable body | — | **`recipes` ×1** (the pairing assertion, and only it) |

**Read of the matrix.** Five of the six points discriminate to exactly one point (E2, E3, E4, E5,
E6b); E1 kills both front-door points because both read the sink's stdout, and E6 kills the Pack
page for two points because two points state page-set laws — in both cases the overlap is the
corpus agreeing with itself, not a defective probe, and it matches the fourth-probe finding §7
already recorded honestly for `coverageUnknown`.

**The recipes check is a real alarm, not decoration.** D2a and D2b are engine lies that make a
recipe body's law false without touching the recipe; the check catches both, at the shape level,
without a frozen count anywhere. D3 confirms the omission half: a documented recipe with no body
fails the pairing assertion and only it.

### The three survivors — findings F-2, F-3, F-4

Three mutations left the entire 630-test tree green. Each removes a behaviour the phase's own
rulings name.

| # | Mutation | Why it survived |
|---|---|---|
| **E7** | `q-command`: gate the read path on *any* extraction finding, not just an error (`findings.length > 0`) | The one test that names this law (`runs the body when the graph merely reports findings — checks never gate the read path`) uses the `orphan-spec` corpus, whose findings are *validation*-level. Its extraction report is empty, so the mutant never fires. Nothing anywhere pinned that a **warning-level extraction finding** leaves the body running — confirmed live: a root with `extract/unrecognized-statement` prints the warning to stderr and returns the body's answer at exit 0, and no test would have noticed if it had refused instead. |
| **E8** | `q-command`: `return process.stdin.isTTY === true` in place of `return isatty(0)` | Every suite injects the `isStdinTty` hook, so the default detector is never exercised. The recorded S2 constraint is explicit — *"stdin detection via `isatty`, never a TTY property probe"* — and the exact gen-1 footgun it names could be reintroduced with the gate green. |
| **E10** | `q-command`: `exclude = rawExcludes` in place of `normalizeExcludes(rawExcludes)` | The suite's `--exclude` test passes one ordinary relative path, which behaves identically either way. §5b claims `--exclude` paths "go through the strict consumer-exclusion contract unchanged" as part of the ruled trust boundary (ruling 21); nothing pinned `q`'s wiring to it. |

All three were remediated (below) and **each fix was re-run against the mutation that found it**:
E7, E8 and E10 now each redden exactly one test and nothing else.

---

## Dimension 2 — The front door probed adversarially

Thirty-one probes against the **built** CLI. Every behaviour below matches the ruled contract
unless the row says otherwise.

**Bodies.** Syntax error → `sdp q: Unexpected token '}'`, exit 1, empty stdout. Top-level `import`
→ `Cannot use import statement outside a module`, exit 1 (the "plain JS function body" rule refuses
at the right place). TypeScript-only syntax (`const x: number = 1`) → exit 1. `await` at body top
level → works (async body, as ruled). A body that throws → exit 1, the message rendered through the
one currency. A returned rejected promise → exit 1, same shape. Empty body → *"the body is empty —
`return` is the output contract."*, exit 1.

**Returns.** `undefined` → nothing on stdout, the diagnostic *"the body returned nothing"* on
stderr, **exit 0** — deliberate and pinned by an existing test, so no finding. Cyclic value →
renders as `<ref *1> { self: [Circular *1] }` under default inspect, and under `--json` fails
cleanly with the serializer's own reason, exit 1. Function and symbol under `--json` → *"a
function/symbol return value has no JSON form."*, exit 1. `BigInt` → the serializer's reason,
exit 1. A huge return (all 202 nodes) → 139 KB, elided by `util.inspect`'s own visible notation at
depth 4 / 200 array items; `--json` is unbounded, exactly as the help states.

**Stdin.** `echo -n | sdp q` (the hang probe) → returns immediately, exit 1, *"the body is empty"* —
**no hang**. A body on stdin → runs. Body on argv *and* stdin → argv wins, stdin never read. A real
terminal with no body (verified under `script`) → usage note, exit 1, no wait.

**Root and exclusions.** `--root` at a file → *"root … is not a directory"* with the resolved
absolute path, exit 1. Nonexistent path → same. Two `--root` → refused. `--root` with no value →
refused. A path outside the repository → derives it, correctly: no containment is claimed and none
is implied. Off-root invocation (`cd src`) → derives the empty corpus and answers `0`, consistent
with `sdp build`'s own cwd default. `--exclude /etc`, `../foo`, `""`, `.` → all four refused by
name at the boundary before anything derives.

**Writes.** The tool writes nothing: `git status` byte-identical across an invocation and no
`generated/` appears under the root. The **body** can write (`fs.writeFileSync` from the body
succeeded) — which is exactly the recorded stance, *"no sandbox is claimed and none exists"*, and
not something stronger. The records claim no containment, so the stance is what it says it is.

**Quoting.** No recipe body contains a single quote (the check asserts it, and the assertion is not
vacuous — eight bodies run through it). Bodies with double-quoted string literals pass through the
documented `sdp q '<body>'` form unchanged.

**Help.** The top-level `q` block states the bindings, the body rules, the freshness law, the
"nothing is written anywhere" claim, the bounded default and the `--json` escape, and the exit
codes — all verified true by the probes above. `sdp q --help` reports *"unknown option --help"*;
see F-10.

**The one probe that failed against the documentation, not the code:** the invocations printed in
`docs/agent-surface/recipes.md` and `.claude/skills/sdp-agent-surface/SKILL.md` do not run at this
repository's root. See F-1.

---

## Dimension 3 — Records honesty, recomputed from scratch

Every number below was re-derived by checking out the commit in a separate clone, rebuilding, and
re-deriving the graph — never by reading the ledger.

| Blessed commit | Session | Recomputed | §9 claim | Verdict |
|---|---|---|---|---|
| `9f2b069` | S1 | 108 Primitives · 189 nodes · 371 edges · `ready 71 / defined 37` · 0/0 | 108 · 189 · 371 · 71/37 · 0/0 | **matches** |
| `3002bdb` | S2 | 109 · 190 · 373 · `71/38` · 0/0 | identical | **matches** |
| `4246c28` | S3 | 109 · 190 · 373 · `71/38` · 0/0 | identical | **matches** |
| `bc94d03` | S4 (work) | 115 · 202 · 397 · `80/35` · 0/0 | identical | **matches** |
| `fe9c6e6` | S4 (record) | 115 · 202 · 397 · `80/35` · 0/0 | identical | **matches** |
| `7a309db` | S5 / tip | 115 · 202 · 397 · `80/35` · 0/0 | identical | **matches** |

Anchor arithmetic checked independently: 30 `CodeNode` + 56 `Anchor` = **86 anchors**;
115 + 1 + 30 + 56 = **202 nodes**; the edge census sums to **397**.

**The `05` sweeps, re-run independently at HEAD.** Form 1 (path/backtick) → **0**. Form 2 (bare
`05 §`) → **0**. The widened bare-`05` residue sweep → **0**. The judged-lawful residue is exactly
the two recorded use–mentions (`AGENTS.md`'s status sentence and `check-carrier-truth.mjs`'s
comment) and nothing else. `docs/concept/` holds exactly `00 · 01 · 04 · 06 · 07 · DECISIONS ·
README`. `9f2b069` touched 25 files — the 24 re-pointed surfaces plus the plan.

**The S5 sweep table.** The `defined` set in the graph is exactly **35**. The table's 13 named
non-decision rows plus `agent-front-door` plus the "21 × `spec:decisions.*`" row enumerate exactly
those 35 ids — set difference **empty in both directions**, no id named that is not `defined`, none
`defined` and unnamed. The mechanical finding holds: `defined ∧ has-verifier` = **0**, so all 35
refusals stand on the stated ground. Exactly **8** also carry `implemented`, and they are byte-for-byte
the eight named. The decision class is **22**, all `defined`. The class arithmetic
`35 = 22 + 7 + 3 + 1 + 1 + 1` checks out by membership, not only by sum. All 35 pages read
"structural floor reached: `ready`", so the refusals really are about evidence and not structure.
**Zero promotions happened.**

**The S4 promotions.** All three parents are `ready` with `deliveryFacts: ["implemented",
"has-verifier"]`. All six new example children are `ready` with `has-verifier`, each carrying a
resolving `anchored` `test:protocol.*` verifies edge. `sdp validate` reports **0 errors · 0
warnings**, so zero `honesty/gaps` — the promotions are on the graph, not on assertion.

**The §9 ledger against git.** All eleven named commits exist with subjects matching their
attributed session. The twelfth commit on the branch is `ab2393e` (drafting plan 22), structurally
outside a session row. S5's records-only claim is exact: `7a309db` changes one file, the plan.

**The S5 measurement refusal (§7) — honest, and number-exact.** Every figure reproduces:
`grep -rl 'readiness: ready' specs/` → **80 paths / 4051 bytes**; `grep -rn 'satisfies' src/` →
**58 lines / 4844 bytes**; the graph carries **30** real `satisfies` edges. The record states the
attempt, the numbers, three named reasons the ratio is not reportable, and that **nothing was added
to the Spec**. It claims no ratio. This is the shape a refusal should have.

**§7 spot-checks.** Eight recipes / eight fenced bodies, 1:1. Nineteen `it()`s in `test/cli-q.test.ts`
at the S2 record's time of writing. The S4 fixture root derives to `4 specs · 1 pack · 2 anchors →
7 nodes · 11 edges` with **exactly one warning and zero errors**, and the warning is
`conformance/verifies-linkage` on the declared-only verifier — precisely the discriminator §7 says
it carries. No anchor in the corpus targets a `decision` Spec, as §7 claims. `test/recipes.test.ts`
is correctly absent from `contract-dependent-suites.mjs`; `test/self-hosting-consumers.test.ts` is
correctly present.

**One imprecision — F-7.** §8's `projections-model` row said it "cleared the dependency clause for
all three promotions". It is a direct `refines` target of two of the three (`agent-surface`,
`design-review`); `reader` refines `agent-surface`. The row's conclusion is unaffected, and its
sibling rows state the direct targets correctly.

---

## Dimension 4 — Spec quality, read word-for-word against the mirrors

**`spec:decisions.agent-front-door` vs `src/cli/q-command.ts`.** The decision states what the code
does, and only that. Two entrances over one seam — the sink calls the very `createReader` the
package exports. Derive-in-process on every invocation — the extractor runs per call. Read-only,
never re-parses a carrier, writes no artifact — verified by probe. The trust stance is stated as a
local developer tool with roots resolved to canonical validated identities — verified by probe, and
the module header repeats it so no later reader can mistake the sink for a boundary. The injected
binding names are named as a scripted contract without being enumerated, which is the deliberate
`06`-tail split (below). **No invented third behaviour, no decorative claim.**

**The `06` front-door-tail row's code+test pin holds** (the item flagged forward). §5c says the
three injected bindings stand on `src/cli/q-command.ts` pinned by three named tests. All three
exist and assert what the row claims: *"injects a live reader"* (adapters answer from the derived
graph), *"injects the raw graph schema alongside the reader"* (asserting `graph === g.graph`), and
*"injects the validation report as data, never as a gate"* (asserting the report's findings equal
the reader's). The pin is real; the flag for a future `06` deletion attempt is correctly recorded.

**`spec:consumers.agent-surface`'s S3 clauses vs `reader.ts` + `q-command.ts`.** The entry-point
catalogue, the three adapters, the `bySymbol` deferral (verified absent, not stubbed), and the
recipe valve all mirror the code. The deferral clause states the reservation *and* its status.

**`spec:consumers.reader`'s S4 enrichment vs `reader.ts`.** Rule by rule: `findByConcept`'s field
list matches the code's `matchedIn` exactly (`id`, `title`, `label`, `framing`, `narrative`,
`sections.{name}`); `byFile`'s two halves match; the reason-carrying law matches the shape the code
builds; the realizing entrypoint is named and correct. Nothing invented.

**`spec:consumers.design-review`'s S4 clauses vs the renderer.** The graph-only page-identity clause
("no timestamp, no commit, and no run identity") is what the renderer does, and the realizing
entrypoint is named with the honest caveat that writing is the caller's job.

**The S1 deferral clauses vs the code — still true.** Both clauses assert "no validator reads a
per-team setting". A sweep of `src/validate/` for any configuration, settings, or override read
returns **nothing**. The claims hold.

**The skill and the recipes cite rather than restate.** Both point at `spec:consumers.agent-surface`,
`spec:consumers.reader`, `spec:decisions.agent-front-door` and `CONTEXT.md` rather than paraphrasing
their law, and the skill's anti-anecdote rule names itself as the bug on disagreement. The
what-not-to-do list is accurate against the model in every clause (delivery facts, claims, stated
vs derived readiness). The one thing in them that **was** false against the tree is their own
invocation lines — F-1.

**`07`'s historical CLI enumerations — the recorded reading holds.** §1's slice-5 row and §3's cut
item 9 both name `build · validate · view`. Both are statements about what slice 5 delivered and
what the first slice cut; neither claims to enumerate the current surface, and `00` §4 carries the
live five-verb surface (`build · validate · view · import · q`) with `q`'s rationale. Nothing in
`07` is false. Recording them as lawful history rather than editing them under a records-only
charter was right.

---

## Dimension 5 — Dissolution integrity

**Fourteen `05` audit rows spot-checked against a regenerated Design Review** (117 pages, derived
from an independent clean clone at the tip): every carrying surface states the law its row claims,
quoted from the generated page. Both new clauses are visible on their pages and both state
reservation-plus-status. **Zero stretched verdicts.** The thinnest of the fourteen is the
`spec:model.relations` row (F-11) — inherited from phase 4, and the law is carried abstractly
elsewhere.

**The re-pointed `check-carrier-truth.mjs` pin genuinely bites.** Under four separate mutations of a
copy — deleting the `decision:` line, deleting the `consequence:` line, re-adding the obsolete
sole-TS phrasing, and deleting the target file entirely — the script exits 1 every time and names
the disagreeing surface, including failing *closed* when the file is gone rather than skipping. All
29 claims resolve to files that exist (10 distinct files, zero missing). The retired Family C rule
is lawful: the phrase it classified exists nowhere in the tree except inside the script's own
`absent` needle. F-9 records the one marginal narrowing.

**The registry rows point true.** MD-13's carrier states the floor-table-as-truth posture. MD-9's
§5a correction is **verified sound**: `spec:validation.readiness-floor` really does state the
`defined`-rung clause about a blocking open question, and `spec:validation.kind-evidence` really
does not mention it anywhere — following plan 21's inventory literally would have minted a citation
to a Spec that does not carry the law. MD-22 exists and its Spec states what the row claims. All 25
relative links and all 3 code paths in `DECISIONS.md` resolve; no dangling registry surface. Two
convention nits on MD-22 are F-8.

**131 Spec citations across the 21 re-pointed files resolve against the graph, zero dangling.**

---

## Findings

| id | severity | finding | disposition |
|---|---|---|---|
| **F-1** | **major** | The documented `sdp q` invocations in `docs/agent-surface/recipes.md` and `.claude/skills/sdp-agent-surface/SKILL.md` do not run as written at this repository's root: the recipes header showed a bare `sdp q '<body>'` and a two-exclusion form, and the skill's bootstrap block showed two bare invocations. All four exit 1 with `the graph did not derive` — the corpus needs all three of `explorations`, `examples`, `test/fixtures/import/parity`. The recipe check could not see it: it injects a memoized extraction with the correct list and never parses a documented command line. This is the S2 constraint *"documented examples must run as written"* failing on the on-ramp itself. | **fixed** — both surfaces now show the full, runnable form and say why the exclusions are required; `test/recipes.test.ts` gained an assertion that every documented concrete `sdp q '…'` invocation in either file names the same exclusion set the check derives with. Re-verified: shortening a documented list by one now reddens exactly that assertion. |
| **F-2** | **major** | The guardrail *"checks never gate the read path"* was unverified for extraction-level findings. Mutation E7 (gate on any finding, not only an error) left all 630 tests green; the one test naming the law exercises *validation* findings over a corpus with an empty extraction report. | **fixed** — new `test/cli-q.test.ts` case runs a body over the `unrecognized-statement` corpus and asserts exit 0, the body's answer, and the warning still rendered to stderr. Re-verified: E7 now reddens exactly this test. |
| **F-3** | **minor** | The ruled constraint *"stdin detection via `isatty`, never a TTY property probe"* was unverified — every suite injects the `isStdinTty` hook, so E8 (property probe) survived the whole tree, reintroducing the named gen-1 hang footgun with the gate green. | **fixed** — new case forges `process.stdin.isTTY` to the opposite of the descriptor's truth (restoring the original descriptor in `finally`) and asserts the sink follows `isatty(0)`. Re-verified: E8 now reddens exactly this test. |
| **F-4** | **minor** | `sdp q`'s wiring to the strict consumer-exclusion contract (ruling 21, §5b) was unverified: E10 (`exclude = rawExcludes`) survived, because the existing `--exclude` test passes one ordinary relative path. | **fixed** — new case asserts `/etc`, `../outside`, `""` and `.` are each refused by name with nothing on stdout. Re-verified: E10 now reddens exactly this test. |
| **F-5** | **major** | `AGENTS.md`'s status header was stale by a whole phase — phase-4 framing, `ready: 66 / defined: 37` over 103 Specs against a branch carrying 115 Specs at `80 / 35` — and `check-self-hosting-gates.mjs` had been **failing since `881fbcf`** (the phase-4 close), which dropped the executed-phase stamp string the script pins. | **fixed** at the close — the status is rewritten for phase 5 with the branch's real numbers, and the historic phase-1 stamp quotation is restored the way the phase-3 close carried it, so `node check-self-hosting-gates.mjs` passes again. |
| **F-6** | **minor** | `check-self-hosting-gates.mjs` is **not** a leg of `npm run check`, which is why F-5 went undetected across an entire phase; its rule-4 needle is also pinned to the phase-1 stamp string rather than tracking the current phase. | **carried, with reason** — adding a thirteenth gate leg, or re-scoping an audit script's needle, is a gate change no ruling in this phase authorizes, and doing it inside a close would smuggle a process change into a records session. Named explicitly for the successor. |
| **F-7** | **minor** | §8's `spec:consumers.projections-model` row claimed it "cleared the dependency clause for all three promotions"; the `refines` relation is direct for two of the three and transitive for `reader`. | **fixed** — the row now names the direct pair and the transitive third, and says the phrasing was sharpened at S6. |
| **F-8** | **minor** | Two registry-convention drifts introduced this phase: MD-22's gloss ran ~100 words inlining the whole three-part test, against the registry's own "one-line glosses" rule (its longest peer is two short sentences), and `spec:decisions.agent-front-door` was listed **twice** — in the MD table and in "Current executable decision-spec pointers", the only entry in both, where every other entry has no MD row. | **fixed** — the gloss is one line (the three-part test stands at plan §5b and in the Spec), and the duplicate pointer is removed. |
| **F-9** | **minor** | Retiring the Family C classification rule with the document narrowed the guard on the obsolete sole-TS phrasing: the `absent` needle is now file-scoped to `specs/decisions/one-validation-path.sdp.md`, and `specs/` is outside the Family B corpus sweep, so the phrase could reappear in a different `specs/` file uncaught. Its previous home was in-corpus. | **carried, with reason** — §5a's reasoning stands and is not being argued away: widening the scan to `specs/` re-scopes an unrelated audit over 115 Spec files and would surface a wave of unclassified mentions. The phrase exists nowhere in the tree today, and the pin still catches a literal re-import into the carrying Spec. Recorded so a future widening is a decision, not a discovery. |
| **F-10** | **informational** | `sdp q --help` answers *"unknown option --help"* rather than printing the verb's help. | **declined, with reason** — every verb on the surface behaves identically (`build`, `validate`, `view`, `import` all do), so this is the CLI's existing shape and not a front-door defect; the top-level help documents `q` in full. Minting per-verb help is a CLI change no ruling authorizes. |
| **F-11** | **informational** | Of the fourteen `05` audit rows spot-checked, the `spec:model.relations` row is the thinnest: the Spec states relation roles in plain language rather than a kind-typed endpoint contract. | **carried, with reason** — inherited from the phase-4 grading, not introduced this phase; the law is carried abstractly by `spec:validation.claim-separation`, which the row's elsewhere already names, so the row holds as written. |

---

## Acceptance criteria (§5), graded

1. **`05` dispositioned on its audit** — met. Deleted with gaps 13/14 carried first, 24 surfaces
   re-pointed, both sweep forms and the widened residue at zero, independently re-run. Fourteen
   carrying surfaces spot-checked on a regenerated view; no stretched verdict.
2. **The front door ruled, then built** — met. `spec:decisions.agent-front-door` (MD-22) and the
   freshness ruling landed at `343ff10`, before the build at `b09bffa`. Thirty-one adversarial
   probes; every recorded constraint holds in the built product. Diagnostics flow through
   `formatFinding` only.
3. **The on-ramp exists and is checked** — met **after remediation**. The demand map is on the
   Spec, every recipe body runs as written under a shape-only check, and the skill cites rather
   than restates. F-1 was the gap: the *invocations* were not checked, and did not run. They are
   now, and the check pins them.
4. **The consumer family earns its promotions** — met. Three parents and six children carry
   `has-verifier` in the regenerated graph; zero `honesty/gaps`; every refusal named.
5. **No surface creep** — met. The frozen join set is unchanged (`findByConcept` · `byFile` ·
   `blastRadius`, `bySymbol` absent and asserted absent); exactly one verb was added, the one S2
   ruled.
6. **The gate holds throughout** — met. Green at every blessed commit; the close runs the full
   chain plus the clean-clone proof.
7. **Records continue** — met. Ledgers terminal, docket dispositioned, this review archived with
   every finding terminal.

---

## What the owner is asked to ratify at the PR

1. **The `05` deletion itself** — `docs/concept/05-validation-and-honesty.md` is gone. Per-doc
   audited deletion is ratified at the PR by standing ruling; this is the fourth such deletion.
2. **`sdp q` and its recorded trust stance** — a new CLI verb that evaluates operator-supplied
   JavaScript with no sandbox. The stance is recorded rather than implied, and this review confirms
   the tool writes nothing while the body has the process's full authority.
3. **The skill and the recipe catalogue as shipped consumer artifacts** — `.claude/skills/` is a
   convention this phase set, and both files ship with the corpus they teach.
4. **The measurement refusal** — the second measured context line was attempted, measured, and
   refused rather than manufactured.

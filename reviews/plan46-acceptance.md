# Plan 46 acceptance on a platform copy

Measured on 2026-10-22, Europe/Zagreb. Most requested measurements pass. Acceptance is incomplete: the packed Vitest adapter fails before registering the platform's example tests, and the browser tool refused the standalone export's `file://` URL. The step-key behavior passes through a copy-only adapter over the shipped runner. That result does not certify the packed Vitest adapter.

## Identity and reproduction

| Input | Measured value |
| --- | --- |
| Protocol worktree | `/Users/darkomijic/dev-libar/sdp-plan46-lanes/accept-x3`, branch `lane/46-accept-x3` |
| Protocol head built and packed | `78eb96c41645a1de1dc3455049f6bc9b6c7f84ba` |
| Platform copy | `/tmp/plan46/accept/platform`, also resolved by macOS as `/private/tmp/plan46/accept/platform` |
| Platform commit | `b038bd4a77d51690b1ac5bdc31223576193e1266`, detached HEAD |
| Package | `/tmp/plan46/accept/libar-dev-software-delivery-protocol-0.0.0.tgz` |
| Tarball SHA-256 | `72d1fd6f281e8cec2c28c707e1821b4bd76dc7ebcd4f4333c51e6a87eca282d1` |
| Tools | Node `v24.21.0`, npm `11.19.0`, platform Vitest `5.0.3` |
| Installed CLI | `sdp 0.0.0 (78eb96c41645a1de1dc3455049f6bc9b6c7f84ba)` |

The original platform and its worktrees were never written. Nothing was pushed. The Protocol's engine and tests were not changed. The copy is intentionally dirty with the acceptance edits described below; its HEAD and the stamp's `corpusCommit` identify the starting commit, not a commit containing those edits. Source links in the stamp point to that starting commit.

The [command ledger](plan46-acceptance/commands.jsonl) records commands, working directories, exit statuses, elapsed seconds and output-log names. It includes unsuccessful probes. Complete output remains under `/tmp/plan46/accept/evidence/`. The [measurement scripts](plan46-acceptance/scripts/) preserve the final versions of the mutations, proposal application, reporter and checks; they are acceptance tools, not Protocol engine changes. Each is archived with a `.txt` suffix; remove that suffix when restoring it under `/tmp/plan46/accept/`. The ledger retains the intervening corrections. Commands inside these scripts are explicit argument lists. The watch result also records both CLI invocations, and `planted-results.json` in the scratch evidence contains all 39 captured subprocess results.

Read before measuring: `AGENTS.md`, `CONTEXT.md`, the repository's graph, authoring and session skills, plan 46's Why, Acceptance and Rulings sections, and plan 42's five tasks in The measure. This is the close/review shape. The independent reader job still owns the five reader tasks and the three new tasks.

```bash
# In the Protocol worktree
npm run build
npm pack --pack-destination /tmp/plan46/accept --json

# In /tmp/plan46/accept
git clone -q /Users/darkomijic/dev-libar/libar-platform/.git /tmp/plan46/accept/platform
git -C /tmp/plan46/accept/platform checkout -q b038bd4

# All subsequent platform commands run in the copy
cd /tmp/plan46/accept/platform
npm ci
npm install /tmp/plan46/accept/libar-dev-software-delivery-protocol-0.0.0.tgz
```

Every direct Protocol CLI invocation in the copy used its own `npx sdp`. The platform's existing Python gate and tests internally locate that same installed dependency's CLI. No platform measurement selected the Protocol worktree's CLI.

## 1. Rules files and the extension register

Replaced the address resolver and strongly connected component algorithm in `design/rules/policy.js` with `await recipes(25, { addresses })` and `await recipes(26)`. The policy keeps its own finding names and messages. This removes 73 old lines and adds 16, with no copied resolver or cycle algorithm remaining.

```bash
python3 /tmp/plan46/accept/rewrite-policy.py
python3 design/tools/check.py
npm run pages
python3 design/tools/check.py
python3 -m unittest -v design/tools/test_decisions.py
python3 /tmp/plan46/accept/trace-tests.py
```

The first full gate exited 1 solely because the committed Pack page still named the old Protocol pin. After `npm run pages`, the gate exited 0: `OK`, zero corpus-rule errors, 12 listed prose-mention warnings, one current Pack page and a deterministic Studio. The underlying graph had 243 Specs, 6 Packs, 181 anchors, 430 nodes and 1,510 edges.

The initial 54-test Python run reported three failures and one error. Two failures expected the policy's previous cycle wording; preserving that wording around recipe 26 fixed them. The gate-dependent error came from the stale Pack page. The remaining failure is an adopter test stub that evaluates the rules body with only four bindings, then simulates a future entry section. It supplies no `recipes` binding and raises `ReferenceError: recipes is not defined`. This test needs a fifth-binding stub when the platform adopts the new evaluator. No Protocol change is justified by that stub failure.

The focused rerun kept the original mistake-planting tests intact and excluded that four-binding simulation. All 11 tests passed. The trace captured 39 subprocess results: 30 refused inputs exited 1, while all nine clean controls exited 0. Each negative still reached the expected finding:

| Planted mistake | Result |
| --- | --- |
| Absent Spec, absent Design entry, malformed entry address | `address-resolves`; valid addresses remain accepted |
| Absent or malformed rule address | `address-resolves`; existing rule key accepted |
| Three-Spec `dependsOn` cycle | `dependency-cycle`; the chain control passes |
| Platform component uses another context | `isolated-context`; the same-context control passes |
| Unapproved `ready`, floor divergence, blocking question above `scoped`, missing question key | `owner-states-ready`, `readiness-divergence`, `blocking-means-scoped`, `question-key`; unexpected warnings remain refused |
| Law and fact cited without the required edges | `cited-without-edge` |
| Stale intended mention, blank reason, unlisted mention | `stale-mention`, `mention-reason`, `unlisted-mention`; a listed reason passes |
| Register question source names an absent key, wrong section or wrong file | `question-source` |
| Register question source mixes old/new fields, adds a line, says `open: true`, or supplies a non-string address | `question-source` |
| Closed source has an invalid status or its question returns, including whitespace-normalized and decimal/citation text | `question-source` |
| Source key renamed or removed; closed sources in each of the three non-closed statuses | `question-source`; `decided` and `folded` controls pass |
| Whole-gate fixture plants an absent address, cycle, missing question key and stale page together | All four failures appear; gate exits 1 with exactly the expected two gate-level failure lines |

Built `design/rules/extensions.json` from the 54 `E-N` rows in `design/README.md`, preserving README order. Its shape is `{"tokens":["E-1",...]}`. The rules file is one line, `return await recipes(50, params);`.

```bash
python3 /tmp/plan46/accept/register.py
npx sdp q 'return await recipes(50, params)' \
  --params register=@design/rules/extensions.json \
  --params '{"pattern":"\\bE-\\d+\\b","uncited":true}' --json
npx sdp validate --rules design/rules/extensions.js \
  --params register=@design/rules/extensions.json \
  --params '{"pattern":"\\bE-\\d+\\b","uncited":true}'
```

Recipe 50 found 1,976 token occurrences, 54 distinct tokens, zero unknown tokens, zero retired tokens and zero uncited tokens. Its rules-file run exited 0 with zero corpus-rule errors. On the same 243-Spec copy, `check.py` reported 54 registered extensions and neither a cited-but-unregistered extension nor a registered-but-uncited extension. The sets agree. Their traversal differs: recipe 50 reads graph prose fields; `check.py` scans raw carrier text. The matching result here does not assert that those traversal contracts are identical.

## 2. Bundles in parts

```bash
npx sdp q "$(cat /tmp/plan46/accept/bundles.js)" --json
```

The script requests recipe 36 with `part: 1` through `part.of` and no budget override, then compares against a whole bundle at a sufficiently large budget. Sizes are UTF-16 code units, the recipe's unit, not bytes.

| Pack | Whole members | Whole size | Part sizes, in order |
| --- | ---: | ---: | --- |
| `application` | 54 | 566,657 | 97,966; 71,577; 71,797; 91,861; 75,736; 77,549; 97,635; 20,959 |
| `foundation` | 103 | 493,071 | 84,928; 95,447; 94,735; 97,158; 92,671; 66,269 |

All eight application parts and all six foundation parts fit the default 100,000 budget. Every `leftOut` list is empty. Concatenating the parts' members equals the whole bundle's member array, including every value and its order. The Pack and scope headers match. The boundary occurs once, in part 1; its union equals the whole boundary. Repeated headers explain why part sizes do not sum to the whole size.

## 3. Step keys

Target: `spec:kernel.domain-kernel.evaluate-twice`, bound by `tests/pure/domain-kernel.evaluate-twice.test.ts` for both document and stock fixtures. Added `[#freezeInputs]` to the shared vocabulary's input-freezing step and the example. Its sibling inherits the vocabulary key; reworded that sibling too, and left both suites' handlers under `freezeInputs` in the copy.

```bash
python3 /tmp/plan46/accept/step-mutate.py key
npx sdp build
npx vitest run --project pure tests/pure/domain-kernel.evaluate-twice.test.ts
```

This packaged-adapter run failed before registering a test, as Defect 1 records. The unmodified, unkeyed suite fails in exactly the same place.

For an independent measurement of the generated contract, `step-shim.py` gives this copy's suite a small local adapter using its own Vitest's `describe` and `it`, and the tarball's public `planExample` and `runExamplePlan`. It changes no Protocol file. The saved script and the copy's `scripts/acceptance-vitest.ts` show the entire adapter.

| State | Command after mutation | Result |
| --- | --- | --- |
| Key added; handler named `freezeInputs` | `npx sdp build` then the same Vitest command | 2 passed |
| Key kept; vocabulary and both examples reworded to “all decision inputs are frozen before evaluation” | Same build and suite | 2 passed |
| Key removed; text reworded again to “the decision inputs are immutable before evaluation”; handler unchanged | Same build and suite | 2 failed |
| Keyed, reworded state restored | Included in the CTRF run below | 2 passed |

The negative fails at the intended step with `bindings[step.key] is not a function`, naming `Given the decision inputs are immutable before evaluation`. One exploratory build withheld the sibling's contract until its shared wording was updated; the corrected build emitted all 140 modules without codegen warnings. The copy retains the keyed, reworded state and the local adapter. The packaged-adapter acceptance remains failed.

## 4. The upgrade kit

```bash
npx sdp q 'return await recipes(47)' --json
```

Measured before the acceptance mutations:

| Plan 46 survey item | Recipe 47 | Difference |
| --- | --- | --- |
| 243 Specs, 6 Packs, 122 examples, 22 decisions, 12 component units | Exactly those counts | None |
| 0 stated `ready`; 221 floors at `ready` | 0; 221 | None |
| Rule keys | 0 / 987 | None |
| Question fields | 0 / 166 | None |
| Relation reasons | 0 / 978 | None |
| `exercises` | 0 / 123 | None |
| Component designs | 0 / 12 applicable components | None |
| Perspectives | `null` / `null` | Recipe 47 requires caller-supplied perspectives; no input means unknown, not a counted zero. The survey's “none” is an authored-file observation. |
| Oversized bundles | Recipe 47 does not measure them | Recipe 36 above measures both completely in parts. |
| Copied rules bodies | Recipe 47 does not measure them | The policy diff above measures their removal. |

Additional measurements absent from the survey are 166/166 keyed questions, 401 pinned declarations, 0/941 step keys, 0/103 term keys and 82/401 pinned declarations with entry citations. These are additional columns, not disagreements with the survey.

```bash
npx sdp q 'return await recipes(48,{pack:"pack:history-view",commit:"b038bd4a77d51690b1ac5bdc31223576193e1266"})' --json
npx sdp build
cp generated/graph.json /tmp/plan46/accept/base-graph.json
npx sdp q 'return await recipes(38,params)' \
  --params proposal=@/tmp/plan46/accept/proposal.json \
  --params base=@/tmp/plan46/accept/base-graph.json --json
python3 /tmp/plan46/accept/apply-proposal.py
npx sdp validate
```

Recipe 48 proposed 237 keys across 19 Pack members, with zero pre-existing keys and zero unkeyable entries. Recipe 38 reported 237 changes, zero moved scopes, zero unresolved scopes and no schema problems. The small application script checks each carrier's expected original line before inserting the proposed marker. It changed 12 carriers. Validation exited 0 with zero errors and the same 12 prose-mention warnings. It stated no readiness rung.

The saved base is the graph `npx sdp build` wrote immediately before applying the proposal, outside `generated/`. It includes the restored step-key experiment; therefore the later diff isolates the proposal plus the deliberately added component design, not the earlier step rewording.

## 5. Component designs

Recipe 43 initially reported zero designs. Read `spec:model.planned-architecture` through the Protocol graph, then added `design/specs/application/history-view-component.sdp.md` in the copy. The design follows the roadmap's section 5d, which plans the history projection and paused rebuild. It stays `scoped`, declares dependencies on their Specs and states:

| Design key | Value |
| --- | --- |
| `id` | `component:platform.history-view` |
| `layer` | `application` |
| `context` | `platform` |
| `role` | `projection` |
| `uses` | `component:platform.read-model`, `component:platform.gate`, `component:platform.context` |

```bash
python3 /tmp/plan46/accept/component.py
npx sdp q 'return await recipes(43)' --json
npx sdp validate
```

An initial malformed Model bullet was refused and corrected to the carrier's required `**TERM**` form before measurement. Recipe 43 then reported one design, unrealized, with `anchorExists: false`; no fictional component anchor was added. Validation exited 0 with zero errors and 12 warnings. The final graph has 244 Specs, 6 Packs, 181 anchors, 431 nodes and 1,512 edges.

## 6. The Studio

The platform's reporter supports custom reporters, but its existing `harness/evidence.ts` writes a different native-run format and writes nothing for a pure-only run. Added `scripts/acceptance-ctrf.ts` in the copy. Its callbacks serialize actual Vitest TestCase results as CTRF; no run results were hand-authored.

```bash
python3 /tmp/plan46/accept/write-reporter.py
npx vitest run --project pure \
  tests/pure/domain-kernel.evaluate-twice.test.ts \
  tests/pure/pinned-pairs.test.ts \
  tests/pure/order-allocation-history.test.ts \
  tests/pure/order-allocation-history-row-size.test.ts \
  --reporter default --reporter ./scripts/acceptance-ctrf.ts
npx sdp studio --base /tmp/plan46/accept/base-graph.json \
  --base-label "Before the history-view rule-key proposal" \
  --runs evidence/plan46-ctrf.json
npx sdp stamp --commit b038bd4a77d51690b1ac5bdc31223576193e1266 \
  --source 'https://github.com/libar-dev/libar-platform/blob/b038bd4a77d51690b1ac5bdc31223576193e1266/{file}#L{line}'
python3 /tmp/plan46/accept/check-pages.py
python3 /tmp/plan46/accept/network.py
```

Four suites passed, 11 tests total. Two tests join the bound example's file; nine results correctly remain unjoined because those files carry no test anchor. This is pure-tier evidence only. The two example tests use the copy-only adapter described above. No native backend was run, and no native-backend evidence is claimed for a paused-rebuild example.

Checks read every generated HTML page and compare relevant contents with recipes 44, 46 and 51 and the generated graph. Page names below are relative to `generated/spec-studio/`.

| Requirement | Page and element | Measured result |
| --- | --- | --- |
| Architecture by context and layer | `architecture.html`, `sdp-diagram[subject=architecture]` and its SVG | 12 realized components plus one planned; grid labels include all four contexts and four stated layers |
| Designed, unbuilt component apart | Same diagram, `g[data-id="component:platform.history-view"][data-planned="true"]`; Designed, not built table | `rect[stroke-dasharray="6 4"]`, text says `planned`, table names the design and says no anchor exists |
| Every Pack maturity map | All six `packs/*.html`, `h2` Maturity map and table | Six present, including `packs/history-view.html` |
| Every Spec's rule coverage | All 244 `specs/*.html`; keyed rule `div.entry` and `p.rule-coverage` | All 237 keyed rows present; all 69 rule/flow owners report their unkeyed count, 750 entries total |
| Coverage where the Spec owns an example space | All 18 owning Spec pages, `#panel.verification`, Coverage heading and tables | All 18 present; representative `specs/kernel.domain-kernel.html` shows enumerable exercise values and the non-enumerable commands slot |
| Test lines beside pinned declarations | `specs/application.history-projection.html#design.typeHistoryEvent`, `.citations` | Test line `tests/types/pinned.test-d.ts:301`, anchor `test:history-view.pinned-declarations`; all 84 citing lines on pinned declarations appear, 81 labelled as test lines; uncited pins say so |
| Every waiting statement in dependency order | `queue.html`, statement element ids and Round labels | All 222 ids equal recipe 46's order; 19 rounds, 11 statements first, three cycles sharing rounds; every waiting prerequisite is in the same or an earlier round |
| Owner-question honesty | `queue.html`, Owner questions | Zero name the owner as decider; the recipe reports 166 without a decider, ten blocking. The page does not guess ownership. |
| Proposal comparison | `diff.html`, named base and `.spec-row` sections | 12 changed Specs and one added component design, zero removals, zero changed Packs or bindings; all 12 changed ids match the proposal's files |
| Run input labelled | `runs.html`, Run 1 heading and summary | “External run evidence from vitest 5.0.3”; 11 passed, zero failed; unjoined records listed apart |
| Standalone Pack export | `exports/history-view.html`, inline `style` and fragment links | Zero external asset dependencies, one embedded stylesheet, no scripts; browser opening is unverified because the tool refused `file://` |
| Stamp | `stamp.json`; shell's `sdp-stamp` reads it on HTTP(S) | Names measured engine, starting corpus commit, publishing time and source template; browser display not verified |

The first Studio build took 2.993 seconds end to end, including `npx` startup, extraction, validation and code generation. The repeat took 2.907 seconds. SHA-256 manifests of all 271 files matched exactly before stamping. A later watch/plain comparison also matched all 271 files after a carrier change. The final page set has 269 HTML files, two assets and a separate stamp: 272 files, 37,911,275 bytes. The earlier unstamped, pre-watch build was 37,910,791 bytes. The stamp's publishing time is deliberately outside build determinism.

The HTML scan found zero automatic remote resource references and zero missing local assets. A literal `http` search is not empty: 537 SVG namespace occurrences, source-documentation URLs in prose, fixture issuer/deployment strings, and ids containing `http` remain. None is an automatic remote load. CSS has no remote URL. The sole JavaScript `fetch` reads local `stamp.json` only on HTTP(S); on `file:` its URL is null and it returns without fetching. The source template sits in `stamp.json` and creates source links when supplied. Runtime request interception was not performed because local browser opening was blocked; this is a static finding, not a captured network trace.

## 7. The vault

```bash
npx sdp vault
python3 /tmp/plan46/accept/vault-probe.py edit
npx sdp vault
python3 /tmp/plan46/accept/vault-probe.py restore
npx sdp vault
python3 /tmp/plan46/accept/vault-probe.py count
```

The first synchronization wrote 439 owned files. Added `generated/obsidian-vault/intent/acceptance.md`, then edited one generated note. Regeneration exited 1 and named:

```text
sdp/code/component/component.example.inventory-context.md has changed since this command wrote it (changed)
nothing was written or removed
```

After restoring its original bytes, synchronization exited 0 with 439 unchanged and zero written or removed. The owned directory contains 440 files including its manifest: 432 Markdown notes and seven other generated files, plus the manifest. The notes contain 5,448 wikilinks. The intent note remains byte-identical, SHA-256 `503af80b8672024bdf961b18dc4d45fd0e3c8ea833a6cde4d1604ab317c15e6e`. A final synchronization after the watch edit updated the relevant generated design note and again preserved the intent note. No Obsidian GUI session was opened in this lane.

## 8. Watch

```bash
python3 /tmp/plan46/accept/watch.py
# The script runs, in the copy:
npx sdp studio --watch --base /tmp/plan46/accept/base-graph.json \
  --base-label "Before the history-view rule-key proposal" \
  --runs evidence/plan46-ctrf.json
```

After the initial build, the script changes one sentence in the new component design carrier. Exactly one rebuild followed, two cycles total. All 271 output files matched a plain Studio build over those same inputs and that edited carrier. The plain build took 2.937 seconds. SIGINT to the CLI stopped it with exit 0, and `npx` returned 0. An initial probe signalled the whole process group, causing the npm launcher itself to report signal 2; the corrected probe stops the CLI and observes its exit through the launcher. No watch process remains. The final copy retains the edited sentence, synchronized vault and rebuilt, stamped Studio.

## Defects

### 1. The tarball's Vitest adapter embeds a second runner and fails under platform Vitest 5

The packed `dist/adapters/vitest.js` contains bundled `@vitest/runner` implementation. The platform's own runner is Vitest 5.0.3. Calling the package's `bindExample` fails in bundled `initSuite` while reading `config`; zero tests register. This blocks the requested passing bound-example suite through the shipped adapter. It also occurs with the platform's original unkeyed carrier and unchanged suite, so it is independent of step-key authoring.

Exact reproduction on the retained copy, with automatic restoration of its acceptance edits:

```bash
cd /tmp/plan46/accept/platform
python3 /tmp/plan46/accept/baseline-repro.py
```

The script saves the modified parent, both examples and target suite; replaces those four files with `git show HEAD:<path>` bytes; runs the commands below; and restores all four files in `finally`.

```bash
npx sdp build
npx vitest run --project pure tests/pure/domain-kernel.evaluate-twice.test.ts
```

Build exits 0. Vitest exits 1:

```text
TypeError: Cannot read properties of undefined (reading 'config')
  initSuite .../dist/adapters/vitest.js:3140:25
  createSuiteCollector .../dist/adapters/vitest.js:3004:3
  bindExample .../dist/adapters/vitest.js:4236:3
Test Files  1 failed (1)
Tests  no tests
```

The local adapter makes the same example assertions pass using the tarball's framework-free runner, but is only a diagnostic workaround in the disposable copy. This lane changed no Protocol engine code or tests. A fix lane must add the failing package-install test and resolve the packaged runner identity before acceptance can be closed.

## Reader handoff and remaining limits

Open `/tmp/plan46/accept/platform/generated/spec-studio/index.html`. The standalone file is `exports/history-view.html`. The base graph remains `/tmp/plan46/accept/base-graph.json`; the proposal remains `/tmp/plan46/accept/proposal.json`; actual run input is `platform/evidence/plan46-ctrf.json`.

The browser action attempted `cua.createBrowserTab("chrome", "file:///tmp/plan46/accept/platform/generated/spec-studio/exports/history-view.html", ...)`. The tool refused it because its URL policy permits only HTTP and HTTPS, and expressly forbade an alternate route around the refusal. No browser workaround was attempted. Static dependency checks passed, but opening the export alone, visual page inspection and runtime request capture remain unverified. This is a tool-access limitation, not an observed Protocol defect.

The reader job should use only the page set and files it links to for plan 42's five tasks: the history contract, OD-157, the aggregate dependency, a declaration's type comparison, and native-backend evidence for a paused-rebuild example. It also reads the first waiting statements, the changes since the named base, and designed but unbuilt components. This lane does not pre-claim that reader result.

No `ready` statement was authored. No public host, CI preview, release, repository setting or merge was attempted. `npm run check` for the Protocol and cross-family lane review are separate close work, not claims of this measurement. The record commit is authorized by the user's instruction:

```bash
git add reviews/plan46-acceptance.md reviews/plan46-acceptance
git commit -m 'close(x3): the acceptance measured on a copy of the platform' \
  -m 'Co-Authored-By: GPT-6.1-Sol <noreply@openai.com>'
```

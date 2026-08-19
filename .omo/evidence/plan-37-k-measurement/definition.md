# Brief K operational definition (FROZEN)

**Status:** FROZEN before any census results exist.
**Frozen-at (authoring clock):** 2026-08-19T17:53:41+02:00
**Definition-file mtime at freeze (before any census output):** 2026-08-19 17:54:55.626426014 +0200
**Frozen-by:** plan-37 todo 4 (Wave 0). This file is the measurement law for todo 17.
**Catalog baseline (sha256 of `docs/agent-surface/recipes.md` at freeze):** `9571ac632a11cad25126e733a7ca5aa8ac5fc699a9d14369faff41b35bbd8b87`
**Authority:** `.omo/plans/plan-37-settling-arc.md` todo 4; `.omo/drafts/plan-37-settling-arc.md` Findings ("Brief K measurement design", "Brief K evidence surface"); plans/35 H record (context-bundle row); plans/36 brief K.
**Re-open rule:** this file is not edited mid-gather. A later plan may supersede it by writing a new definition, never by mutating this one in place. The catalog hash above is the identity baseline; a later catalog byte change is a new measurement, not a silent rematch.

This definition is frozen **before any results are examined**. Tooling validation against plan-35-era sessions (todo 4) is not a verdict. The verdict corpus is Wave 3 (todo 17). Census scripts count only; they do not adjudicate co-use and they do not emit a MET / UNMET / UNDERPOWERED verdict.

No estimated tokens are reported anywhere in this measurement. Sizes are **bytes only**.

---

## 0. What is being measured

The plan-35 H record (context-bundle row) deferred with this re-entry trigger, quoted verbatim:

> Later evidence that agent sessions still hand-assemble the same token-budgeted slice after the E1 recipes, so scripting one body at a time is no longer the honest description. Then commission a later plan. Do not build the bundle inside plan 35.

Plans/36 brief K restates the same trigger:

> evidence that agent sessions still hand-assemble the same token-budgeted slice after the E1 recipes, so scripting one body at a time is no longer the honest description.

This definition operationalizes that trigger so a later gather can render exactly one of:

- `COMMISSION <n>` — trigger MET; record the later plan number; **never build** a bundle, projection, verb, or accessor.
- `STAND-DOWN (unmet)` — adequate corpus, at least one conjunct failed; retain the trigger.
- `STAND-DOWN (underpowered)` — corpus below the adequacy floor; retain the trigger.

Under any outcome: no bundle implementation, no new projection, no new query verb, no reader accessor. Measurement lives under `.omo/evidence/plan-37-k-measurement/` only — never in `src/` or `package.json`.

---

## 1. Assembly window

An **assembly window** is the closed-open interval:

- **opens** at the first **successful** `sdp q` recipe invocation in a session (see §6 success);
- **closes** at the first subsequent **product mutation or disposition** in that same session.

Product mutation/disposition (window closer), any one of:

- a write/edit to a product surface (`src/`, `specs/`, `test/` excluding evidence-only notes, `generated/`, `plans/` stamp files, `AGENTS.md`, `docs/` other than quoted catalog text);
- a readiness statement or other carrier disposition (`readiness:` edit, oracle descriptor edit, apply of a prepared one-rung patch);
- a commit that lands product bytes;
- a `sdp new`, `sdp build`, `generate:*`, or other verb that mutates the graph or carriers.

Not a closer:

- further `sdp q` / `sdp:q` invocations;
- reads, greps, listings, diagnostics;
- writes confined to `.omo/evidence/` (including this measurement directory);
- census script execution itself.

A session may contain zero windows (no successful recipe invocation) or one window (the first successful invocation until the first closer, or until session end if no closer occurs). Later recipe invocations after a closer start a new candidate window only if they are themselves successful; Wave 3 adjudicates whether multiple windows in one session are distinct episodes. The census script reports **candidate windows** only; it does not decide episode identity.

---

## 2. Qualifying episode

A **qualifying episode** is one assembly window that satisfies **all three** conjuncts:

1. **≥2 distinct catalog recipe bodies** in that one window — identity per §3 (normalized match against the sixteen fenced bodies). Distinct means distinct recipe IDs after normalization, not two runs of the same ID.
2. **Visible co-use** in one context / rationale / verdict — the session text (assistant or operator) joins those recipe outputs into a single subsequent judgment, packet, ledger row, disposition, or hand-off. Mere sequential invocation is not co-use. Co-use is **manually adjudicated** at gather time; the census script never marks co-use true.
3. **Operator-context acquisition** — the invocations were run to inform live operator/agent work, **not** test/QA runs (see §7 disqualifiers).

Fail any conjunct → the window is not a qualifying episode.

---

## 3. Recipe identity

Recipe identity is matched against the **sixteen fenced bodies** in `docs/agent-surface/recipes.md` (the frozen catalog for this arc).

Numbering is the catalog heading number (1–16), not document order of prose.

### 3.1 Normalization (parameterized recipes)

Parameter lines are normalized for recipes **3, 6, 9, 14** before comparison:

| ID | Parameter line (catalog default) | Normalization |
| --- | --- | --- |
| 3 | `const id = "spec:consumers.reader";` | rewrite the string literal to a placeholder; remainder of body compared |
| 6 | `const term = "blast radius";` | rewrite the string literal to a placeholder; remainder of body compared |
| 9 | `const id = "spec:model.enrichment-lifecycle";` | rewrite the string literal to a placeholder; remainder of body compared |
| 14 | `const subject = "component:protocol.reader";` | rewrite the string literal to a placeholder; remainder of body compared |

Normalization procedure (binding):

1. Extract the JavaScript body actually passed to `sdp q` / `sdp:q` (see §8).
2. Apply whitespace canonicalization (§3.3) to both the extracted body and each catalog fence.
3. For candidates 3, 6, 9, 14: replace the first matching parameter assignment
   (`const id = "…";` / `const term = "…";` / `const subject = "…";`) with a
   canonical placeholder (`const id = $PARAM;` / `const term = $PARAM;` /
   `const subject = $PARAM;`) on both the extracted body and the catalog body.
4. Compare the resulting strings for exact equality. First catalog ID that matches wins.
   A body matching none of the sixteen is recorded as `unmatched`.

### 3.2 Recipe 4 (filenames from env)

Recipe 4 takes filenames from the environment variable `SDP_CHANGED_FILES_JSON`. Callers **never** substitute filenames into the JavaScript fence. Identity is the static query body:

```js
const changed = JSON.parse(process.env.SDP_CHANGED_FILES_JSON ?? "[]");
const radius = g.blastRadius(changed);
const impactReasons = (item) => ({ id: item.id, reasons: item.reasons.map((reason) => reason.throughBinding === undefined ? { file: reason.file, via: null } : { file: reason.file, via: reason.throughBinding.id, edgeType: reason.throughBinding.edgeType, claim: reason.throughBinding.claim }) });
const atRiskReasons = (item) => ({ id: item.id, nodeType: item.nodeType, reasons: item.reasons.map((reason) => ({ from: reason.from, edgeType: reason.edgeType, to: reason.to, claim: reason.claim })) });
return { changedFiles: radius.changedFiles, impactedSpecs: radius.impactedSpecs.map(impactReasons), atRiskSpecs: radius.atRisk.filter((item) => item.nodeType === "Primitive").map(atRiskReasons), atRiskOther: radius.atRisk.filter((item) => item.nodeType !== "Primitive").map(atRiskReasons), coverageUnknownFiles: radius.coverageUnknown };
```

Presence or absence of `SDP_CHANGED_FILES_JSON` does not change identity. A wrapper that inlines filenames into the body is **not** recipe 4 (`unmatched`).

### 3.3 Whitespace and wrapper canonicalization

Before comparison:

- trim leading/trailing whitespace;
- collapse runs of ASCII whitespace (space, tab, CR, LF) inside the body to a single space;
- strip a surrounding `async () => { … }` / `async function () { … }` wrapper if the inner body is what remains;
- accept both `sdp q '<body>'` and the repository wrapper `sdp:q -- '<body>'` / `npm run --silent sdp:q -- '<body>'` / `pnpm --silent sdp:q '<body>'` as the same invocation class;
- `--json` is a flag on the invocation, not part of the body; it does not change identity;
- `--root` / `--exclude` are runner arguments, not body text.

A truncated or edited catalog body that does not match after these steps is `unmatched`. Partial / "close enough" matching is forbidden.

---

## 4. Corpus (verdict corpus — Wave 3 only)

The **verdict corpus** is this arc's completed I/J execution sessions.

Adequacy floor (both conjuncts required):

- **≥6 eligible** completed I/J execution sessions;
- **≥2 per brief** (at least two Brief I sessions and at least two Brief J sessions).

Else the corpus is **underpowered**. An underpowered corpus produces `STAND-DOWN (underpowered)` and retains the trigger. It does not produce MET or UNMET.

Eligible (Wave 3 inventory decides membership; this freeze only names the rule):

- completed todos whose work is Brief I (registrar adopt/refuse) or Brief J (drift-alarm packets / ratification apply);
- a recoverable transcript exists (primary `~/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/*.jsonl`, and/or `.omo/senpi-task/children/*/sessions/`, joined via `.omo/boulder.json` session ids and `.omo/start-work/ledger.jsonl`).

Not eligible (see also §7):

- planning, advisory, review, close-gate, commission-hygiene, and K's own activity (todo 4 definition+tooling, todo 17 gather+verdict);
- sessions whose only recipe activity is a disqualified class.

Todo 4 **must not** examine this arc's (2026-08-19) sessions for a verdict. Plan-35-era sessions are tooling-validation only.

---

## 5. Trigger MET / UNMET

**Trigger MET** if and only if **all** of the following hold:

1. Corpus is adequate (§4).
2. **≥3 qualifying episodes** (§2).
3. Those episodes come from **different tasks** (distinct plan-37 todo identities; two windows in one task count as one task).
4. The episodes share a **normalized core of ≥2 recipe IDs** — the intersection (or, if the gather records a declared core set, that set) of recipe IDs across the counted episodes has size ≥ 2, and each counted episode exhibits **visible co-use** of at least those core IDs.
5. The counted episodes **span both briefs** (at least one I and at least one J) **or** cover **≥50% of a repeated work-shape stratum** (a work-shape stratum is a repeated I-family or J-family cut already named in the plan: e.g. I-validators, I-Gherkin, J-model; "repeated" means the stratum has ≥2 eligible sessions). The ≥50% is of eligible sessions in that stratum, not of all sessions.

**Any failed conjunct with an adequate corpus = unmet** → `STAND-DOWN (unmet)`. The trigger is retained.

Script counts only. Co-use adjudication is manual. The census table is an input to the arithmetic, not the arithmetic.

---

## 6. Success and failure of an invocation

A recipe invocation is **successful** when the tool/process that ran `sdp q` / `sdp:q` exited 0 and produced a body of output (byte size may be 0 only if the sink legitimately printed nothing; empty-and-nonzero-exit is a failure).

A recipe invocation is **failed** when:

- the process exited non-zero;
- the tool call recorded an error / abort / timeout;
- the command was not actually executed (quoted-not-run).

Failed calls do not open a window and do not count toward the ≥2 distinct IDs in a window.

---

## 7. Disqualifiers

The following never contribute a qualifying episode, never open a window that can become one, and never count as corpus members for the adequacy floor if they are the session's only recipe activity:

1. **Recipe test suites** — invocations whose purpose is to assert catalog bodies (recipe-check tests, `docs/agent-surface` certification, self-hosting recipe tests).
2. **QA-certification runs** — invocations whose purpose is a todo's failure-QA / happy-QA scenario, gate certification, or evidence paste of a known body, rather than operator-context acquisition for the work itself.
3. **Failed calls** — §6.
4. **Duplicate / resumed transcripts** — a later jsonl that replays or resumes an earlier session without new invocations; count the earliest complete transcript once. A resume that adds new invocations is a continuation of the same session, not a second eligible session.
5. **Quoted-not-run commands** — command text appearing in prose, plan snippets, evidence templates, or assistant "I will run" blocks that the runtime never executed.
6. **K's own activity** — todo 4 (this freeze and its census) and todo 17 (gather + verdict), including any recipe the K lane runs to validate tooling.

A session that mixes disqualified and eligible invocations: only the eligible invocations can form a window; disqualified ones are listed in the census as `disqualified_candidate` when the script can see them, and are dropped from episode arithmetic at gather time.

---

## 8. Skill-prescribed chains (corroboration only)

Skill-prescribed chains are **corroboration, never trigger evidence**.

Quoted from `.agents/skills/sdp-sessions/SKILL.md` (advisory work shapes):

- Capture / refine: recipe 6 → recipe 11 → recipe 9
- Design: recipe 9 → recipe 7
- Implement: recipe 1 → recipe 3 (optionally 12 → 13)
- Review: recipe 5 + recipe 8, or recipe 3 + recipe 8 (optionally 14 → 15 → 16)
- Close / slim: recipe 2 → recipe 4

Quoted from `.agents/skills/sdp-authoring/SKILL.md`:

- Session-start: recipes 1 + 2
- "run recipes 7–11" after binding / review

Observing that a session executed a skill-mandated sequence, by itself, is **not** a qualifying episode and **not** trigger evidence. It may be cited in the verdict record as corroboration that the catalog is in use. Trigger evidence still requires §2 (including visible co-use that is more than "the skill said to run these") and §5.

No skill says "assemble a context bundle" or "token budget". Recipe 3 is already the one-Spec-in-one-shot payload. **No catalog recipe is a multi-Spec token-budgeted bundle.** That absence is why the trigger exists; it is not itself evidence the trigger is met.

---

## 9. What the census script emits (not a verdict)

`node .omo/evidence/plan-37-k-measurement/census.mjs <session.jsonl>` is read-only. It:

- scans one session jsonl for ordered `sdp q` / `sdp:q` invocations;
- extracts and normalizes bodies;
- matches recipe IDs per §3;
- emits a per-session table: recipe sequence, distinct ids, output byte sizes, candidate windows.

It does **not**: write outside `.omo/evidence/plan-37-k-measurement/`; examine Wave-3 sessions unless an operator later points it at one; adjudicate co-use; compute MET/UNMET; report tokens.

Output byte size is the UTF-8 byte length of the tool/process stdout (or the recorded tool result payload). When the transcript does not retain stdout, the script reports `output_bytes=unknown` rather than inventing a number.

**Post-freeze amendment A1 (does not rewrite the frozen sentence above).** Recorded 2026-08-19T18:33:46+02:00. Reason: AdversarialVerify needs-fix, verifier `st_01a01acd`: shared-stdout contract was implemented and evidenced but absent from the frozen law; amendment added before any Wave-3 verdict corpus is examined. The freeze remains meaningful because no verdict-corpus examination has happened — tooling validation was plan-35-era only.

Amendment text (binding, matches `census.mjs` exactly): an inseparable shared multi-`sdp q` / `sdp:q` tool result — more than one recipe invocation recovered from a single bash `toolCall`, so the recorded stdout is a combined payload — must be reported as `output_bytes=unknown`. That is required, not a miss, and never a fabricated per-invocation split. The combined payload byte length, when the transcript retains it, is emitted separately as `shared_tool_result_bytes` with the note `per-invocation stdout not separable`. Script line: `outputBytes: shared || resultBytes === null ? "unknown" : resultBytes,` (`census.mjs`; `shared` is `extracted.length !== 1`).

---

## 10. Stand-down / commission record shape (Wave 3 writes this; named now)

A Wave-3 verdict record must contain:

- baseline commit + catalog hashes (`docs/agent-surface/recipes.md` sha256 as frozen at this definition);
- this predeclared definition and its thresholds (pointer to this file);
- full task inventory with inclusion/exclusion reasons;
- per-session tables from the census;
- exact verdict arithmetic (each §5 conjunct true/false with counts);
- bounded conclusion;
- no-build confirmation.

Underpowered conclusion, verbatim-grade: "no qualifying repeated slice demonstrated in this corpus" is reserved for unmet-with-adequate-corpus; underpowered uses: "corpus underpowered; trigger retained."

---

## 11. Blind spots (honest limits, frozen as known)

These do not weaken thresholds:

- no token-count or bundle-payload records exist to inspect;
- in-process `createReader` use is invisible to shell/transcript grep;
- mental assembly without tool calls is invisible;
- multi-recipe ≠ stitching without manual co-use adjudication;
- `.omo/senpi-task/logs/*.jsonl` record tool names only, not full `sdp:q` argv (weak for identity).

---

## 12. Todo-4 vs todo-17 split (binding)

| Activity | Todo 4 (this freeze) | Todo 17 (Wave 3) |
| --- | --- | --- |
| Write this file | yes, first | no edits |
| Build census script | yes | no edits except bugfix recorded as such |
| Run census on plan-35-era 2026-08-15 sessions | tooling validation only | not the verdict |
| Run census on this arc's 2026-08-19 I/J sessions | **forbidden for verdict** | required |
| Adjudicate co-use / apply §5 | **forbidden** | required |
| Emit COMMISSION / STAND-DOWN | **forbidden** | required |

Plan-35-era identification for tooling validation: the two `2026-08-15` jsonl files under `~/.omo/agent/sessions/--home-darkomijic-dev-libar-software-delivery-protocol--/`. `.omo/start-work/ledger.jsonl` may be inspected for command-array shape. Neither inspection is a verdict.

---

## Post-freeze amendments

Amendments below do not rewrite frozen sentences. They close a contract hole found after the freeze and before any Wave-3 verdict-corpus examination.

### A1 — shared / inseparable multi-`sdp:q` stdout (2026-08-19T18:33:46+02:00)

- **Trigger:** AdversarialVerify NEEDS-FIX, verifier `st_01a01acd`.
- **Reason:** shared-stdout contract was implemented in `census.mjs` and discussed in the todo-4 evidence file, but the frozen §9 sentence only covered the missing-stdout case.
- **Frozen sentence left intact:** "When the transcript does not retain stdout, the script reports `output_bytes=unknown` rather than inventing a number."
- **Added law:** an inseparable shared multi-`sdp q` / `sdp:q` tool result (more than one recipe invocation recovered from one bash `toolCall`; the recorded stdout is a combined payload) must be reported as `output_bytes=unknown`. Required, not a miss. Never a fabricated per-invocation split. Combined payload bytes, when retained, appear as `shared_tool_result_bytes` with `per-invocation stdout not separable`.
- **Script line this amendment matches:** `outputBytes: shared || resultBytes === null ? "unknown" : resultBytes,` where `const shared = extracted.length !== 1;` and `const resultBytes = result ? byteLen(result.text) : null;`.

### A2 — census bugfix: mutating verbs missing from `bashIsCloser` (2026-08-19T22:37:01+02:00)

- **Trigger:** PR #21 code review (Bugbot finding: `sdp validate` was not recognized as a window closer).
- **Reason:** §1 already names "a `sdp new`, `sdp build`, `generate:*`, or other verb that mutates the graph or carriers" as a closer, but `census.mjs`'s `bashIsCloser` only matched `sdp new` / `sdp build` / `npm|pnpm run build` / `generate:*` / `git commit`. Against the engine: `runValidate` calls `runBuild`, so `sdp validate`, `sdp view`, `sdp census`, `sdp mermaid`, and `sdp gherkin` all rewrite `generated/` artifacts; `sdp import` (without `--dry-run`) writes carrier files; the repository scripts `check`, `check:self-hosting`, `check:example`, `format`, and direct `projection-suite.mjs` runs regenerate product bytes.
- **Law unchanged:** this is a census-script bugfix recorded as such (§12), not a new closer definition. No frozen sentence is rewritten.
- **Script change:** `bashIsCloser` now recognizes `sdp(.js) validate|view|census|mermaid|gherkin` (in addition to `new`/`build`), `sdp import` without `--dry-run`, `projection-suite.mjs`, and `npm run` / `pnpm [run]` `check` / `check:self-hosting` / `check:example` / `format`. Still non-closers: `sdp q` / `sdp:q` (derives in process, writes nothing), `sdp import --dry-run`, `check:temporal`, `check:self-hosting-gates`, `format:check`, `npm test`, `lint`, and reader-head statements.
- **Scratch-root scoping:** a matched sdp verb or `projection-suite.mjs` statement with an operand under `/tmp/` is **not** a closer — it rewrites a throwaway graph, not the product graph or carriers. This mirrors the product scoping the edit/write prong already applies through `isProductPath` (writes under `/tmp` never closed windows). Observed in the plan-35 tooling-validation corpus: `node ./dist/cli/sdp.js validate /tmp/scaffold-probe` is a diagnostic probe, not a product mutation.
- **Recorded before any Wave-3 verdict-corpus examination.** The plan-35-era tooling-validation outputs (`validation-plan35-session-*.txt`) and QA captures are re-captured with the fixed script in the same change.

### A3 — census bugfix: scratch-root quote / `--root=` miss + prettier closer (2026-08-19T23:09:35+02:00)

- **Trigger:** PR #21 full code review (pending review on the draft): `bashIsCloser` stripped shell quotes before scratch detection, so quoted `/tmp` operands and `--root=/tmp/...` were misclassified as product closers; the regenerator comment claimed `prettier --write` while the matcher only closed `npm`/`pnpm run format`.
- **Reason:** A2's scratch-root law is unchanged — a mutating verb aimed at `/tmp` is still not a closer. The A2 implementation only matched bare unquoted `/tmp/...` tokens after quote-stripping, which erased `'/tmp/...'` / `"/tmp/..."` and left `--root=/tmp/...` as a single non-`^/tmp/` token.
- **Law unchanged:** census-script bugfix recorded as such (§12). No frozen sentence rewritten.
- **Script change:** statement-split now respects quotes; `targetsScratchRoot` runs on the original statement and matches bare, single-quoted, double-quoted, and `--root=` / `--root` forms; direct `prettier --write` (and `npx` / `node_modules/.bin` forms) closes unless aimed at `/tmp`; `prettier --check` stays a non-closer. `--self-check` asserts the closer matrix including the quoted / equals-form scratch cases.
- **Recorded before any Wave-3 verdict-corpus examination.** Plan-35 tooling-validation outputs re-captured with the fixed script.

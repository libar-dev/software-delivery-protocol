# Task 11 evidence — plan 37 Brief J extraction packets

## Scope

Prepared two evidence packets only:

- `.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md`
- `.omo/evidence/plan-37-j-packets/extraction/regenerability.md`

No carrier, oracle, source, generated, or product file was edited. No `git add`, commit, or push was run.

## Packet audits

### `spec:extraction.claim-taxonomy`

- Template identity fields: complete.
- Recipe 9 command/body and complete raw output: exact catalog Recipe 9 Promotion preflight body is recorded with the packet Spec id substituted; task-3 output is explicitly marked reused evidence; `defined`, floor `ready`, no failures, first unmet `null`, human statement required.
- Recipe 3 command/body and complete raw output: recorded; sections, one resolved outbound `refines` relation, no inbound relations, two anchored implementation bindings, no verifiers, verifier semantics, and empty findings are preserved.
- Finished-design evidence: all five glossary carrier lines 15-19 quoted verbatim with paths and line numbers; relevant model section, relation, and bindings identified.
- Settle-first evidence: `none found`; no reason was invented.
- Prepared disposition: unapplied one-rung carrier diff and matching oracle descriptor readiness diff from `defined` to `ready`; owner decision remains pending.
- Adversarial probes: `misleading_success_output` and `stale_state` each have a one-line audit; other classes are explicitly N/A.

### `spec:extraction.regenerability`

- Template identity fields: complete.
- Recipe 9 command/body and complete raw output: exact catalog Recipe 9 Promotion preflight body is recorded with the packet Spec id substituted; task-3 output is explicitly marked reused evidence; `defined`, floor `ready`, no failures, first unmet `null`, human statement required.
- Recipe 3 command/body and complete raw output: recorded; sections, one resolved outbound `refines` relation, no inbound relations, one anchored implementation binding, no verifiers, verifier semantics, and empty findings are preserved.
- Finished-design evidence: disposable rebuild, consumer boundary, and graph/DB deferral carrier lines 15-17 quoted verbatim with paths and line numbers; relation and implementation binding identified.
- Settle-first evidence: carrier lines 18-19 quote the approximate thresholds' measured-evidence prerequisite. The missing measurement artifact is recorded as the blocking reason; no artifact or measurement value was invented.
- Prepared disposition: defined candidate with explicit reopen condition; owner decision remains pending.
- Adversarial probes: `misleading_success_output` and `stale_state` each have a one-line audit; other classes are explicitly N/A.

## Adversarial verification and correction

Initial adversarial verification verdict: `NEEDS-FIX` (0.93). Two evidence defects were identified and corrected without product edits:

1. Both packets had mislabeled the Recipe 2 alarm-finder body as Recipe 9 while attaching Recipe 9-shaped output. Each packet now records the exact catalog Recipe 9 Promotion preflight body from `docs/agent-surface/recipes.md` §9 with its Spec id substituted, and explicitly marks the already-verified task-3 Recipe 9 output as reused evidence.
2. The claim-taxonomy packet inventoried `relationsIn: []` but did not engage the leaf fact in both judgment readings. Its finished-design reading now explains that no inbound refiners supports a bounded foundational glossary; its settle-first reading now records that no inbound refiner or downstream worked-example/consumer obligation weakens usage-breadth evidence, while noting that this is not a carrier-stated blocking question.

## Verification and QA

- Template section audit: both packets contain sections 1 through 5.
- `git diff --check -- .omo/evidence/plan-37-j-packets/extraction`: passed with no output.
- Scope proof command:

```text
git status --porcelain -- specs/extraction/claim-taxonomy.sdp.md specs/extraction/regenerability.sdp.md test/self-hosting-oracle/extraction.ts
```

Result: empty output (zero modified spec/oracle files).

- No npm command was needed: the corrected packets quote the exact catalog Recipe 9 body and reuse the already-recorded Recipe 9 and Recipe 3 outputs from task 3, with no query gap requiring a rerun.
- No product tests or build were run because this lane is evidence-only and must not touch product files.

## DoneClaim

```json
{
  "task": "st_01a01af6 / todo 11",
  "changed_files": [
    ".omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md",
    ".omo/evidence/plan-37-j-packets/extraction/regenerability.md",
    ".omo/evidence/task-11-plan-37-settling-arc.md"
  ],
  "tests": "not run; evidence-only lane",
  "manual_qa": "adversarial NEEDS-FIX corrections applied; exact catalog Recipe 9 bodies compared for both packets; leaf fact engaged in both claim-taxonomy readings; template audits and raw-output retention passed",
  "cleanup": "none required; no product files touched and no git operations, build, generate, check, or npm command run",
  "risks": "owner ratification is intentionally pending; regenerability thresholds remain blocked on the absent measured artifact"
}
```

# Plan 37 Brief J evidence packet

> Fill one copy of this packet per drift-alarm Spec. This is an evidence form, not a
> readiness verdict. Promotion is a human statement; do not infer a disposition from a
> clear floor alone. Do not demote a Spec to silence the alarm.

## 1. Identity and carrier

- [ ] **Spec id:** `spec:<family>.<name>`
- [ ] **Carrier path:** `specs/<family>/<name>.sdp.md`
- [ ] **Title:**
- [ ] **Kind:**
- [ ] **Altitude:**

## 2. Stated readiness and floor evidence

- [ ] **Stated readiness:** `idea | scoped | defined | ready`
- [ ] **Recipe 9 command/body:** record the exact `pnpm --silent sdp:q` invocation (recipe 9,
  with this Spec id substituted).
- [ ] **Recipe 9 raw output:** preserve the complete output.
- [ ] **Floor reached:**
- [ ] **Next rung:**
- [ ] **Current floor failures:** list each `{ clauseId, description }`, or record `[]`.
- [ ] **First unmet clause:** record the exact value, including `null` when none.
- [ ] **Human-statement marker:** record `promotionRequiresHumanStatement`.

## 3. Section inventory and graph context

- [ ] **Recipe 3 command/body:** record the exact `pnpm --silent sdp:q` invocation (recipe 3,
  with this Spec id substituted).
- [ ] **Recipe 3 raw output:** preserve the complete output.
- [ ] **Section inventory:** copy `sections` exactly.
- [ ] **Relations out:** copy every `relationsOut` row with `type`, `other`, `claim`, and
  `resolved`.
- [ ] **Relations in:** copy every `relationsIn` row with `type`, `other`, `claim`, and
  `resolved`.
- [ ] **Implementations/bindings:** copy every implementation's `codeId`, `claim`, `file`, and
  `line`.
- [ ] **Verifiers:** copy every verifier's `verifierId`, `via`, `claim`, `enabled`, and `file`.
- [ ] **Verifier semantics:** retain the recipe-3 note that a resolving verifier exists; the
  graph does not record pass/fail.
- [ ] **Findings:** copy every graph finding with `validatorId`, `severity`, and `message`.

## 4. Judgment aid (evidence, not a pre-judgment)

### Finished-design evidence

- [ ] State the evidence that the authored design is complete enough for a human `ready`
  statement.
- [ ] Identify the relevant section(s), relation(s), and implementation binding(s).
- [ ] Quote the carrier line(s) verbatim, with path and line number.

### Settle-first evidence

- [ ] State the unresolved design question, missing worked example, requested review, or other
  reason to remain at `defined`.
- [ ] Quote the carrier or plan line(s) that carry that reason verbatim, with path and line
  number. Do not invent a reason to fill this field.
- [ ] If no settle-first evidence is present, record `none found` and leave the disposition for
  owner review.

## 5. Prepared disposition (owner decides; leave alternatives visible)

Choose exactly one after reviewing the evidence; this template itself chooses neither:

- [ ] **Ready:** proposed one-rung carrier diff from `readiness: defined` to
  `readiness: ready`; include the exact path, old line, and new line. Do not apply it here.
- [ ] **Defined:** recorded reason for staying at `defined`; cite the quoted carrier/plan line
  above and state what evidence would reopen promotion.

- **Owner/rater:**
- **Owner decision:**
- **Decision date:**
- **Ratification/evidence reference:**

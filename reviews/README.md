# Reviews — session artifacts (tracked)

Review reports and the prompts that produced them, moved here from the gitignored `.tmp-scratch/` so the
signal survives a clean clone (the optional-archive step of `plans/04` §3). These are **session artifacts,
not canonical docs**: their durable findings were folded into the tracked plans and `docs/concept/DECISIONS.md`
at the time; keep reading those for current truth. Like every markdown here, they are temporary scaffold —
in the finished Protocol, review artifacts become graph projections.

| File | What it is | Durable findings landed in |
|---|---|---|
| `01-opus-plan-implementation-review.md` | post-Session-1 implementation review (found H1 — the example's P5 violation — and the Wave-A backlog) | `plans/02` Wave A (executed) |
| `02-founding-ideation-back-for-review.md` | the founding-ideation review of the concept set ("I would build this direction") — surfaced the R1/R2 wording imprecisions | `DECISIONS.md` R-series |
| `03-post-split-adverserial-review-prompt.md` | the bespoke 3-view prompt that produced review 04 | — |
| `04-post-split-adversarial-review.md` | the post-split adversarial review (F1–F7; D7 kind-aware floor, D8 `.spec.ts` collision, the resolvable-now assessment) | `plans/03` agenda + `DECISIONS.md` |
| `05-plan-finalization-prompt.md` | the prompt that launched the pre-grill fold session (2026-06-10: Fold-A, Fold-B, this archive) | `plans/04` §3–§4 (executed) |
| `06-self-hosting-phase-1-code-review.md` | the multi-agent adversarially-verified code review of the self-hosting phase-1 implementation (post-Gate-4, pre-F1–F4: 4 highs — todo-14 generated-state contract, unsupported-block acceptance, preflight recovery prefix, untested grammar limits — plus 8 mediums and the low/info tail) | plan 17's review-06 remediation reconciliation ledger (all highs/mediums fixed + verified in the doc's addendum; low tail dispositioned) |
| `07-self-hosting-phase-2-code-review.md` | the archived phase-2 adversarial code review (two import-surface blockers — silent content loss, partial batch publication — plus three change requests, all remediated and re-probed) | plan 18's remediation record and docket (`plans/18a` ledgers) |
| `08-self-hosting-phase-2-pre-merge-review.md` | the five-dimension pre-merge branch review of the full phase-2 diff (R-1…R-31: 8 majors, 12 minors, 11 notes; the 06/07 remediations re-probed and held) | the follow-up session's docket (open at merge — findings deliberately not fixed on this branch) |

The gen-1 (`@libar-dev/architect`) formal-spec study from the same arc was chat-only; its takeaway is
formalized in `plans/04` §0/§2 ("lineage is evidence, not template" — no patterns transferred).

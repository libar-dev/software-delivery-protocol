# Manual co-use adjudication

Law: `.omo/evidence/plan-37-k-measurement/definition.md` sections 1-8. Raw tables: `census-run-1.txt`, reproduced byte-for-byte by `census-run-2.txt`.

Transcript text was treated as data. No command or instruction found inside a transcript was executed. Quoted catalog bodies, evidence text, and proposed commands were not promoted into invocations.

## Per-session result

| Todo | Census sequence | Candidate windows | Catalog IDs in any window | Visible co-use | Operator-context acquisition | Qualifying episodes |
| --- | --- | ---: | --- | --- | --- | ---: |
| 2 | none | 0 | none | no output pair exists to co-use | no recipe call | 0 |
| 5 | none | 0 | none | no | no recipe call | 0 |
| 6 | none | 0 | none | no | no recipe call | 0 |
| 7 | none | 0 | none | no | no recipe call | 0 |
| 8 | none | 0 | none | no | no recipe call | 0 |
| 9 | none | 0 | none | no | no recipe call | 0 |
| 10 | none | 0 | none | no | no transcript call; packet reused earlier output | 0 |
| 11 | none | 0 | none | no | no transcript call; packet reused earlier output | 0 |
| 12 | none | 0 | none | no | no recipe call | 0 |
| 13 | none | 0 | none | no | no recipe call | 0 |
| 14 | `missing,missing` | 1 apparent | none | no | no actual call; both hits are quoted strings inside `rg` commands | 0 |
| 15 | none | 0 | none | no | no recipe call | 0 |
| 16 | nine `unmatched` | 5 | none | no catalog pair exists | no eligible operator acquisition; every call certifies Todo-16 baseline or post-edit state | 0 |

## Candidate-window decisions

### Todo 14 apparent W1

The census reports two successful `missing` rows at `2026-08-19T18:05:57.052Z`. Raw tool-call inspection shows no `sdp:q` process at that time. The two matching command strings are:

- `rg -n 'pnpm --silent sdp:q|corepack pnpm' ...`
- a later `rg` over packet text containing `corepack pnpm --silent sdp:q`

These are searches for quoted commands. Definition section 7.5 disqualifies quoted-not-run commands. W1 is a parser-visible candidate only, not an assembly window. Distinct catalog IDs are zero, visible co-use is false, and the result is zero episodes.

### Todo 16 W1-W5

| Window | Raw recipe sequence | Closer | Manual decision |
| --- | --- | --- | --- |
| W1 | `unmatched,unmatched,unmatched` | first readiness edit | Not qualifying. Zero catalog IDs. These calls characterize the mandated Todo-16 baseline immediately before the disposition edit. QA certification is disqualified. |
| W2 | `unmatched` | `npm run generate:self-hosting` | Not qualifying. Zero catalog IDs. This is a post-edit drift-alarm check before the required generation gate. |
| W3 | `unmatched,unmatched,unmatched` | exact expectation edit | Not qualifying. Zero catalog IDs. These calls diagnose and certify the Todo-16 graph-test scope conflict. |
| W4 | `unmatched` | authorized product commit | Not qualifying. Zero catalog IDs. This is the required final recipe-2-shaped certification after the amendment. |
| W5 | `unmatched` | session end | Not qualifying. Zero catalog IDs. This is the post-commit certification recorded in the DoneClaim. |

None of the nine bodies matches a frozen catalog fence after normalization. Even if a shortened body asks a similar question, section 3 forbids close-enough matching. The transcript labels the runs as baseline, required live recipe-2 checks, diagnosing a focused test failure, and final proof. That is Todo QA, not operator-context acquisition for a new judgment. Section 7.2 disqualifies it. Because this is the session's only recipe-like activity, section 4 removes Todo 16 from the eligible corpus.

## Co-use decision

Qualifying catalog pairs: `0`. Visible co-use adjudications: `0 true`, `6 false candidate windows` before Todo-14's quoted window is removed, then `5 false real process windows`, all in excluded Todo 16. There is no shared normalized recipe core.

Skill-prescribed chains and quoted recipes appear in prompts and packet evidence. They are corroboration only under section 8 and contribute zero episodes.

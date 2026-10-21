# Plan 46 S5 review fixes

This follows the review at `dff9bf5`, on `lane/46-build-s5`. The fix brief authorizes the recipe-49 skill pointers that the original build left to integration. No carrier promise or readiness statement changes in this fix.

## Findings

The behavior regressions ran against the reviewed implementation before their fixes. Coverage findings use deliberate mutations, then restore the implementation and rerun the tests. The tests and recipes below carry the repeatable evidence; temporary red-run logs are under `/tmp/plan46/reports/fix-s5-*.log`.

| Finding | Result | Test that failed first, or reason |
| --- | --- | --- |
| 1. Missing recipe-49 guidance | Fixed | Existing `test/skills.test.ts` task-sheet coverage and `test/recipes.test.ts` recipe on-ramp coverage failed. Added the task row and the session pointers beside recipe 38. |
| 2. Corrupted exact-text prefill | Fixed | `prefills compose with the authored entry text including code spans and no rendered annotations` failed before the build supplied escaped `data-entry-text` and the element read it. The rendered labels, coverage and citations stay outside the replacement text. |
| 3. Stale storage overwrites intents | Fixed | `merges concurrent panels before gathering or discarding and flags rejected storage records` and `refreshes the browser panel on storage and pageshow and removes those listeners on disconnect` failed first. Every mutation rereads storage; discarded rows match their original intent instead of a stale index. Invalid records raise the storage warning and valid records remain. Pending local changes survive failed writes, held by the additional quota regression, which also failed first. |
| 4. Browser interaction coverage and refresh binding | Fixed | The registrar now mounts the bundled element with a page URL and `page-root`, gathers through its element method and refreshes onto another page in the same preview. Giving each page its own storage key made the bound example fail. DOM tests cover stamp updates, base and reason fields, action visibility, copied bytes, download names, excluded intents, native compose submission, Pack framing choice and scenario text. |
| 5. Memo agreement without an independent expected value | Fixed | `matches the literal memo for the shared proposal, including the full relation and document` compares both renderers with a literal golden memo. Mutating both renderers to `## Item` and relation-type-only output made it fail. |
| 6. Blank exact text and whitespace requests | Fixed | `omits blank exact text and reports whitespace requests in the compose dialog` failed on the old unhandled whitespace request. Compose and scenario submission omit blank exact text and report a blank request through native form validity. |
| 7. Action order | Fixed | `uses the stamp base, labels fields, orders actions and copies and saves the named documents` failed on the interleaved order. Copy actions now precede save actions. |
| 8. Unreadable watch base removes output | Fixed | `keeps the last watch pages when an optional base becomes unreadable, just like a plain run` failed before removing the watch-only cleanup. Extraction failure still removes output and recovers, as the existing watch test checks. |
| 9. Component contract mismatches | Reported for integration | The brief explicitly reserves these carrier changes for the design fold. The two questions below name the carrying entries. |
| 10. Fixed stylesheet path | Fixed | `inlines the selected stylesheet asset in exports and publishes those same style bytes` failed with a custom stylesheet. The CLI now supplies stylesheet text to the pure renderer; tests supply it explicitly through their shared helper. Removed the fixed-path module. |
| 11. Missing satisfying units | Fixed | Adding the two expected binding edges made the self-hosting binding roster and graph totals fail before the anchors changed. The Pack page now satisfies export and the frame satisfies intent-panel. No other binding changes. |
| 12. Responsive assertions ignore media scope | Fixed | The phone-layout test parses CSS with PostCSS and checks the layout column and diagram dimensions inside the 719.98px media query. Moving either rule outside that query, keeping its declarations intact, made the test fail. PostCSS was already installed transitively and is now a pinned direct development dependency. |
| 13. Help and catalog ordering | Fixed | `introduces studio before its watch option and gives recipe 49 a use case` failed first. The Studio description now precedes its watch option and recipe 49 has its use-case line. |
| 14. Export size and remaining parent promises | Recorded, no behavior change | The review labels these observations, not defects. Export partitioning and parent-Spec restructuring change design promises and belong to integration. The reference-only binding remains honest for the applying caller's promises. |

## Spec questions for the integration fold

1. `spec:consumers.spec-studio.components#design.composeAction` admits a Spec id or entry address, while `spec:consumers.spec-studio.intent-panel#rule.packScope` requires Pack requests. Should the component entry also admit a Pack id, its rendered `members` and the `Change applies to` choice? This lane retains the panel's Pack behavior and reports the narrower component contract.
2. `spec:consumers.spec-studio.components#design.scenarioEditor` promises visible steps without script, but the build places the editor in an inert template. Should the no-script steps appear outside that template, or should the component promise describe its template use? This lane leaves that promise for the design fold.
3. The `edit-model` and `intent-composition` parents retain the applying caller's ordinary source edits, git record, changed-scope routing and validation promises. The browser units cannot realize those. Integration should name their applying unit or split those promises before changing `references` to `satisfies`.
4. The large self-hosting export remains the result of the one-file-per-Pack promise. Integration can weigh attachment size against that promise; this fix adds no unrequested export format.

## Re-measure

- `npm run check` is the complete gate.
- `npm test -- test/studio-s5.test.ts` runs the composing, memo, export and watch regressions and all four bound examples.
- `npm test -- test/self-hosting-graph.test.ts test/skills.test.ts test/recipes.test.ts` checks binding transcription and shipped guidance.
- `pnpm --silent sdp:q 'return { backlog: await recipes(1), drift: await recipes(2) }' --json` derives the current backlog and drift alarm.

The four deliberate mutations above were rejected, and their files were restored before the complete gate. The browser tests run the shipped classic bundle under Node with a DOM stand-in; they make no claim about pixel layout in a real browser.

## Close measurements

Re-derived at fix close; rerun the commands above instead of inheriting these values.

- `npm run check` passed: 2,719 tests in the main run and 100 tests in the separate CLI run, followed by both projection checks and preflight. Self-hosting validation reports 0 errors and the same 4 expected verifier-gap warnings; the worked example reports 0 errors and 0 warnings.
- Recipes 1 and 2 report 14 backlog items and no drift alarm. `edit-model` and `intent-composition` remain in that backlog for the promise-pass reason above.
- The regenerated `exports/self-hosting-v1.html` is 23,415,505 bytes, measured with `statSync` after the complete gate. Attachment size remains the integration question above.

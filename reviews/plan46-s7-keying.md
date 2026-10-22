# S7: keying reads as keying

Continues `lane/46-s6-polish` from `c27957c`. The executing thread's delegated rulings close
findings 5, 6, 8 and the keyed-row part of finding 10 in the S6 review.

| Item | Change and carrying Spec | Test that failed first | Commit |
| --- | --- | --- | --- |
| Change notes | `spec:consumers.spec-studio.diff-page#rule.specChangeNotes`, `#rule.packChangeNotes` and `#ui.changeNote` count keyed parts separately and label Pack members `keyed only` only when every part is keyed. Pack comparisons request detail from recipe 35; `spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations` pins those parameters. Carriers and oracle changed together. | `test/studio-s3.test.ts`: both cases of `counts keyed rules apart from changed parts, mixed changes: %s`, and `marks only members with exclusively keyed changes as keyed only`. All three failed first. | `744e4f2` |
| Keyed lines | The diff page's `#rule.diffSections` and `#ui.changedSpec` require head rule and flow order and entry text beside Base and Now addresses. The text uses the Spec page's renderer. Removed keys use the unchanged base wording to locate their head entry. Carrier and oracle changed together. | `test/studio-s3.test.ts`: `renders a keying proposal as one line per keyed entry and readable changed rule text`, and `lists keyed lines in head rule order with rendered text for added, renamed and removed keys`. Both failed first. | `72784d3` |
| Removed entry names | `spec:consumers.design-diff#design.diffParts` and recipe 35 mark removed anonymous rules and flows with their base position, such as `behavior.rules[1] (base)`, in detail and summary output. Carrier and oracle changed together. | `test/recipes.test.ts`: both cases of `distinguishes removed unkeyed %s base positions from head positions`. Both failed first. | `ae6092d` |
| Recipe 38 prose | The catalog now says keyed entries compare by key, rule and flow values include list and text, and a list containing an unkeyed entry also compares as a whole. | Prose only, so no behavior test was added. Recipe 38's executable body is byte-identical to the lane base, SHA-256 `35666db828ea3fa657ac11c1342b025cd4aeabd54ea508872b033bb710ae0e0e`. The existing proposal and recipe suites passed. | `ae6092d` |

The existing anchors remain the bindings: `impl:protocol.studio-diff` satisfies the diff-page
Spec; `impl:protocol.design-diff-recipe` satisfies the design-diff Spec; and
`impl:protocol.studio-recipes` satisfies the recipe-answer Spec. The promise pass found no
unrealized promise after these changes. No anchor set, readiness statement or example binding
changed. The existing changed-entry registrar remains adopted in `test/studio-s3.test.ts`.

The three failing runs were:

```sh
npm test -- test/studio-s3.test.ts -t 'counts keyed rules|marks only members'
npm test -- test/studio-s3.test.ts -t 'keying proposal|lists keyed lines'
npm test -- test/recipes.test.ts -t 'distinguishes removed unkeyed'
```

The combined affected suites passed 432 tests after rebuilding the shipped recipe files:

```sh
npm run build
npm test -- test/recipes.test.ts test/iteration-recipes.test.ts test/studio-s3.test.ts test/self-hosting-graph.test.ts
```

The requested platform-copy Studio was rebuilt with `/tmp/plan46/accept/base-graph.json` and
`evidence/plan46-ctrf.json`. I inspected the diff, Generation registry and History view pages on
desktop and a true 390 px viewport, with page script disabled. The Spec note counts 17 keyed
rules; the Pack marks its 12 changed members `keyed only`; the diff includes readable rule text
and follows head order on every changed Spec row. Captures, commands and measurements are in
[the evidence directory](assets/plan46-s7-keying/README.md). No external request or browser error
was recorded. The mechanical UI detector reported no findings.

Recipes 2, 4, 9 and 22 were rerun over this change. No drift alarm, unresolved mention or missing
prose relation was found in the impacted scope. All three amended Specs remain stated and derived
`ready`. Recipe 4 leaves the catalog and the internal rendering helper coverage-unknown at file
grain; no new anchor was added just to fill that column.

No Spec question needed a provisional reading. Finding 7's keying precedence remains as ruled;
this lane does not change it. The other S6 findings are outside this close's scope.

The first full gate caught the old Pack recipe-call expectation in `test/studio-s1.test.ts`. The recipe-evaluations entry, oracle and expectation were aligned with the new detailed Pack answer. The final `npm run check` exited 0, passing 2,814 main-suite tests in 117 files and 100 secondary-suite tests, both corpus checks, and preflight. A separate `npm run typecheck` exited 0. Logs are `/tmp/s7-check-final.log` and `/tmp/s7-typecheck-final.log`.

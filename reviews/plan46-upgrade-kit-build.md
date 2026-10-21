# Upgrade kit build

Lane U realizes `spec:consumers.upgrade-kit` and its capability-adoption and rule-key-proposal
children. The upgrade guide ships with the package. Recipes 47 and 48 live in the catalog and
ship as `dist/recipes/47-capability-adoption.js` and `48-the-rule-key-proposal.js`.

## Built and bound

| Spec | Realization | Binding |
| --- | --- | --- |
| `spec:consumers.upgrade-kit` | `docs/agent-surface/upgrade-guide.md`, package inclusion and the inherited help index | `impl:protocol.upgrade-guide` satisfies it; `test:protocol.upgrade-guide` verifies the document |
| `spec:consumers.upgrade-kit.capability-adoption` | Recipe 47, eleven capability rows, corpus totals, Pack counts, selected Spec rows and explicit perspectives input | `impl:protocol.capability-adoption-recipe` satisfies it |
| `spec:consumers.upgrade-kit.rule-key-proposal` | Recipe 48, scope diagnostics, deterministic keys, collision suffixes, unkeyable entries and the proposal contract | `impl:protocol.rule-key-proposal-recipe` satisfies it |

The document anchors live in `test/upgrade-kit.test.ts`, following the skills' document-realization
convention. These units sit outside the engine components and have no invented membership.
The promise pass covers every rule and Design entry across the document, catalog and package
inclusion. The existing CLI help already names the guide, so this lane adds no help text.

The same suite binds and activates all three examples through their committed generated registrars:

| Example suffix | Test anchor suffix | Oracle |
| --- | --- | --- |
| `capability-adoption.counts-a-corpus` | `capability-adoption.counts-a-corpus` | `oracle:protocol.capability-adoption` |
| `rule-key-proposal.proposal-applies-clean` | `rule-key-proposal.proposal-applies-clean` | `oracle:protocol.rule-key-proposal` |
| `rule-key-proposal.collision-and-unkeyable` | `rule-key-proposal.collision-and-unkeyable` | `oracle:protocol.rule-key-proposal` |

Example ids begin `spec:consumers.upgrade-kit.` and test ids begin `test:protocol.`.
Promotion preflight, recipe 9, reports no failure above each example's former `defined` statement.
The bound, passing examples now state `ready`; their oracle entries and verifier-gap expectations
move with them.

## Spec questions

One reading makes the pinned shape concrete. No carrier changed.

- `spec:consumers.upgrade-kit.capability-adoption#design.packRow`: `members` is the number of
  distinct resolving members. Repeated membership never doubles a place, as `#rule.perPackAndSpec`
  requires. Component counts use sets across those members and the corpus-wide design set.

## Measurements on the platform copy

Re-measured from platform commit `b038bd4a77d51690b1ac5bdc31223576193e1266`. The original platform
checkout was never written. The committed summary is
[measurement.json](assets/plan46-u/measurement.json); the script reproduces the measurements and
applies the proposal only in its disposable clone.

| Survey item | Recipe 47 before edits | Difference |
| --- | --- | --- |
| Specs and Packs | 243 Specs, 6 Packs | none |
| Examples, decisions, component units | 122, 22, 12 | none |
| Stated ready and floor ready | 0 and 221 | none |
| Rule and flow keys | 0 of 987 | none |
| Question fields | 0 of 166 | none; every question already has a key |
| Relation reasons | 0 of 978 | none |
| Example verifies edges with exercises | 0 of 123 | none |
| Component designs | 0 of 12 | the survey said none; recipe 47 adds the 12 possible component places |
| Perspectives | 0 of null with an explicit empty list | the survey said none; without input the recipe reports null of null because files are outside the graph |

The remaining rows extend the survey. Question keys are 166 of 166; pinned declarations are
401 of 987 Design entries; step keys are 0 of 941 steps; term keys are 0 of 103 Model terms;
entry citations cover 82 of 401 pinned declarations. A declaration cited on several lines counts
once. The two denominators of 987 describe different sets, rules and flows versus Design entries.

Recipe 48 scoped to `pack:application` reads 54 members and 251 unkeyed rule and flow entries.
It proposes all 251 keys and lists no unkeyable entry. Recipe 38 reports 251 changes, no schema
problems, no moved change and no unresolved scope. The agent script applies only those markers
in 12 carrier files. Validation then reports **0 errors and 12 warnings**. The full findings are
identical before and after the edits, including the 12 existing warnings. Recipe 47 after the
application reports 251 of 987 rule and flow entries keyed.

Reproduce from this Protocol checkout after `npm run build`, using fresh output paths:

```sh
git clone -q /Users/darkomijic/dev-libar/libar-platform/.git /tmp/u-platform
git -C /tmp/u-platform checkout -q b038bd4
node reviews/assets/plan46-u/measure-upgrade.mjs /tmp/u-platform /tmp/u-upgrade-measurement
```

The script calls these bodies through `node dist/cli/sdp.js q`, with the copy as `--root`:

```js
return await recipes(47, params);
return await recipes(48, params);
return await recipes(38, params);
```

It passes `{ perspectives: [] }` to 47 and `{ commit, pack: "pack:application" }` to 48.
It passes `{ proposal, base }` to 38 through `--params @PATH`, preserving the entire saved base
graph without putting it on the command line. It then runs `node dist/cli/sdp.js validate COPY`.
The output folder contains the before and after answers, base graph, proposal, proposal check,
validation output, diff stat and summary.

## Verification

The initial tests failed because the guide and both recipes were absent. The suite checks every
capability, component deduplication, optional tables, parameter diagnostics, scope order, location
requests, existing keys, Unicode normalization, opening tags, repeated words and
numeric words. One numeric-word test failed before the coining order was corrected.

A temporary mutation changed one expected result in each example. All three then failed through
the generated registrar's Spec comparison. The carriers and contracts were restored and
regenerated afterward. No mutation remains in the tree.

`npm pack --dry-run --json --ignore-scripts` confirms the guide and both recipe files are in the
package. `npm run check` is the final gate; its result is reported with the lane's head commit.

## Left

No lane-U capability is deferred. The guide points to the other lanes' shipped recipes and
publishing command. The integration lane owns the README, skills and handbook updates, the
cross-family review, combined acceptance and publication.

## Build review fixes

Applied the review of `cf2c065` from `/tmp/plan46/reports/review-build-u.md`. Every test named
below lives in `test/upgrade-kit.test.ts`. The first run of the new assertions had seven failures
before the recipe and guide fixes. The focused suite now passes all 30 tests.

| Finding | Disposition | Failing evidence before the fix |
| --- | --- | --- |
| 1. Step-key adoption undercounts | Fixed. Count distinct skeletons per Spec, normalize typed and bound slots, and include keys inherited from a verified or refined parent's vocabulary. | `counts distinct step skeletons and vocabulary keys inherited through %s` failed for both relations, reporting 3 of 7 instead of 6 of 6. `counts repeated vocabulary and example steps once per skeleton within a Spec` reported 1 of 4 instead of 1 of 1. |
| 2. Guide sections lack carrying Specs | Fixed. Name the capability-adoption, rule-key-proposal and adopter-on-ramp Specs in their sections. | `names a carrying Spec in every guide section` failed on the measurement section. |
| 3. Rules-file snippet checks repository sample addresses | Fixed. Pass an empty address list when no addresses are supplied. | `runs the guide's rules file on a clean corpus with no address parameters` failed with four corpus errors and exit 1. |
| 4a. Corpus totals untested | Fixed. Assert every total with differing stated and derived readiness. | Setting stated-ready to count `defined`, floor-ready to zero, or component units to zero each failed `counts all capabilities...`. |
| 4b. Authored and example filters untested | Fixed. Add test-anchor bindings, an adversarial primitive-sourced anchored edge, and a non-example declared verifies edge. | Removing the declared-claim filter or the example-kind filter each failed `counts all capabilities...`. |
| 4c. Both valid scopes untested | Fixed. Supply a resolving Pack and resolving Spec list together. | Removing the scope diagnostic failed `diagnoses both scopes even when each resolves`. |
| 4d. Proposal strings untested | Fixed. Assert a full change object, both scope labels and the unlocated request. | Four separate mutations of the change reason, corpus label, Spec-list label and unlocated request failed `preserves scope and entry order and skips existing keys and tags`. |
| 4e. Guide content and order untested | Fixed. Assert heading order and each pinned step, including the version check. | Removing each of the rules, parts/queue, publish and parameters sections, removing the version check, and swapping headings each failed `teaches the upgrade steps in the pinned order`. |
| 5. Extra reserved-key list | Fixed. Remove the list. Rule-key markers admit these names; the Markdown section-property refusals do not apply to them. No Spec promise changed. | `preserves scope and entry order and skips existing keys and tags` failed because the recipe proposed `implemented2` instead of `implemented`. |
| 6. Skills invariants weakened | Declined as a lane-local edit. The common build brief assigns shared skills to integration; integration 2b must teach both recipes and restore the invariants below. | No lane-local fix or changed assertion is claimed. |
| 7. Catalog law pointers, rule-key action and report name | Fixed. Add both carrying Spec pointers, use recipe 48 for the rule-key action, and rename this report to the plan46 convention. | `names the recipes' carrying Specs and teaches rule-key proposal as the rule-key action` failed before the prose changes; the new report path was absent before the rename. |

The missing-test fixes were checked with 16 temporary mutations, one at a time. Every mutation
failed at an assertion, then the original content was restored. No mutation remains. Re-run
`npm test -- test/upgrade-kit.test.ts` for the committed assertions.

The earlier step-key reading under Spec questions was wrong and is removed. The vocabulary-home
and one-key-one-step rules already settle the behavior. The reserved-property list was also an
implementation defect, so neither fix needs a new ruling or a carrier edit.

The platform measurement was re-run on a fresh disposable clone at `b038bd4` after both recipe
fixes. Every count above remains unchanged, including 0 of 941 step skeletons: the platform has
no keyed vocabulary to inherit and no repeated skeleton within a Spec. Recipe 48 still proposes
251 keys in 12 files, recipe 38 reports no problem, and validation reports 0 errors with the same
12 warnings. The original platform checkout was not written.

## Integration 2b handoff for finding 6

Keep the upgrade guide, and also teach recipes 47 and 48 in the shared skills:

- Add capability adoption and the rule-key proposal to the task table in
  `.agents/skills/sdp-agent-surface/SKILL.md`.
- Teach measuring adoption with recipe 47 and proposing rule keys with recipe 48 in
  `.agents/skills/sdp-sessions/SKILL.md`, including the proposal check before application.
- In `test/skills.test.ts`, require the task table's ordinals alone to equal the catalog's
  ordinals. Remove the guide's 47/48 union.
- In `test/recipes.test.ts`, require `onRamps.sessions` to name every catalog recipe from 12
  onward. Remove the 47/48 guide fallback.

These shared files stay unchanged in this fix commit. This handoff is required before integration
closes finding 6; the guide has not been ruled an alternative to the two skills.

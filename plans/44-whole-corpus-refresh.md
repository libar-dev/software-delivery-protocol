# Plan 44. A whole-corpus refresh before the next arc

> **Status:** ✅ EXECUTED on `review/spec-refresh`, from `main` at `46f0280`, the merge of PR 31.
> Every Spec was read against the engine, the other Specs and the vocabulary, and what the read
> found is fixed, ruled, or given a graph home. The rulings were made on the owner's delegation and
> await the owner's review; `reviews/26-whole-corpus-refresh.md` is the review's record. A thin
> lineage pointer: readiness, backlog, open questions and findings are read from the graph
> (recipes 1, 2, 9, 11, 20, 33), never from this file. If this file and the graph disagree, the
> graph wins and this file is stale.

## Why

Five arcs merged between 2026-10-01 and 2026-10-12 (PRs 27 to 31, plans 39 to 43). Each was
reviewed on its own diff; nobody had read the whole corpus against the whole engine since. Before
the next chunk is planned (plan 42's Studio phase 0, corpus rules and architecture constraints,
the vault, run evidence), the owner asked for a detailed refresh of every Spec, implemented or
not, checked against the code, and polished, as one pull request.

On 2026-10-12 the owner delegated tactical and high-confidence rulings to the main thread, with
advisers where a fresh view helps, and set one preference: delete low-value, high-noise prior state
rather than supersede it, because git is the event log, the graph the current state and everything
else a projection. The owner also ruled that `.omo/` belongs to OmO alone and that tests are the
evidence in most cases.

## How it ran

1. **Review.** Thirteen units: the eight Spec families (the consumers family in four parts), the
   unbuilt surfaces, the on-ramps and skills, the decisions, the protocol and observation Specs
   with the Pack manifests and the engine's own anchors, the vocabulary and concept docs, and the
   candidates for the next chunk. Each was read twice: for fidelity against code and tests
   (gpt-6-sol, xhigh) and for quality against the other Specs, the vocabulary and an outside reader
   (Opus 5.5, xhigh).
2. **Verification.** Each findings file was checked by the other model family, finding by finding:
   595 findings, 59 refuted.
3. **Triage.** One Opus 5.5 pass merged the 513 findings that held into 350 issues and 18 lanes
   with disjoint file sets, and listed 101 owner questions in five groups.
4. **Rulings.** R01, joint realization, on the advice of Fable 5.1 and gpt-6-astra; R02, the
   glossary, on Fable 5.1's; R03, engine contracts, on gpt-6-astra's; R04, the rest, by the main
   thread, with two postures: questions for a later design pass become keyed open questions with a
   provisional answer, and a deferral with no named reader is deleted rather than captured.
5. **Lanes.** Eighteen lanes in their own worktrees, Opus 5.5 for Spec text and docs, gpt-6.1-sol
   for engine, recipes and tests; each lane was reviewed by the other family and then fixed.
6. **Integration and pins.** gpt-6.1-sol landed the cross-lane handoffs, then re-transcribed the
   self-hosting oracle from the carriers and brought the gate to green.
7. **Final review.** Four readers over the whole branch (engine and law by gpt-6-sol, docs and
   rulings by Opus 5.5), each cross-verified: 16 small defects, all fixed.

The main thread made two corrections. The integration pass read a wording slip in R02 ("unique with
its question keys") as law and added a refusal; it was reverted, so rule keys and question keys keep
separate namespaces, and `spec:model.rule-keys` says why. The integration pass also wrote its
evidence under `.omo/`; it moved out, and `AGENTS.md` now says only OmO writes there.

## Measured at close

Re-run the recipes rather than inheriting these.

- `npm run check` exits 0: 1,889 pooled tests in 82 files and 98 CLI tests.
- 260 Specs, 5 Packs, 299 anchors, 564 nodes, 1,452 edges, schema `0.10.0`. Validate reports 0
  errors and 7 warnings: the owner-kept gap on `spec:model.spec-sections` and six prose mentions
  that question `links:` fields write.
- Recipes 1, 2 and 7 are empty. Recipe 20: 80 open questions, 18 blocking, 7 of them deferrals with
  triggers. Recipe 33: 16 designed, unbuilt Specs.
- The design diff from `46f0280` (recipe 35, with the base graph `sdp build` wrote there): 3 Specs
  added, 1 removed, 183 changed, 27 with binding changes; 36 rung statements.

## What comes next

- **The owner's review** of R01 to R04 and the delegated statements; then the merge.
- **Plan 42**, the Studio's phase 0. Its design pass starts from the keyed questions this refresh
  recorded on the Studio's Specs, each with a provisional answer (recipe 20).
- **Corpus rules and architecture constraints.** Their open design questions carry provisionals,
  so the arc opens with a short ruling pass.
- **The first adopter** re-pins: schema `0.10.0`, and a Gherkin carrier using a reserved tag head
  now fails.

# Skills refactoring review

**5 November 2026 · `feat/agent-plugin-1` at `38d738bcc23d1e43fcf1fdde7af117ef71298449` · [draft PR #43][pr]**

## Judgment

Keep the five-skill architecture. The rewrite cut the material loaded when an individual skill fires, put reusable queries in the catalog, and gave an adopter a working route from a local Spec to the Protocol law that governs it. I reproduced the engineering gate at the reviewed head. The outstanding acceptance question is whether an agent can turn a person's request directly into Specs **while leaving undecided choices open**. In the first round, both cold-authoring runs in each environment added meaning the requester had never supplied. The branch now teaches that case explicitly. A completed, independently judged re-run is the evidence needed to claim success.

Three implementation findings merit attention independent of the agent trials. The authoring check can give identical answers for two different Pack orders or two different promises. The session-start hook can describe a different corpus from the one the session's own query reads. The Studio hand-off instructs a reader to pass some Pack edits through a proposal schema that cannot represent them. All three matter in normal user tasks. The project has already built most of the primitives needed to fix them.

The public PR description and the scratchpad `pr-description.md` are the same substantive record. Its graph measurements mostly reproduce. Its opening claims more about authoring fidelity and client activation than its verification section establishes, and one command for reproducing its central comparison fails as printed. Those are worth correcting before the owner uses it to close the arc.

## What was checked

<!-- prettier-ignore -->
| Comparison | Scope and result |
| --- | --- |
| Stacked PR base | `design/foundation-1` at `760a88c5` to `38d738bc`, 30 commits. The first seven established the plugin and technical template. |
| Refactoring plan baseline | `894d9b2d` to `38d738bc`, 23 commits. This is the comparison for the plan's size targets and rewrite work. |
| First full trial round | `9cedddb6`. Seven subsequent commits changed the hook, runners, tests, skill wording or handbook. The first-round judgments remain evidence at that earlier commit. |
| Engineering at the reviewed head | Plain `npm run check` in a disposable clone with a separate copy of the installed dependencies, Node `v24.22.1`. Exit 0. The first test run passed 4,127 tests across 136 files, the second passed 102. Self-hosting had 0 errors and 3 expected `honesty/gaps` warnings. The checkout example had 0 errors and 0 warnings. Preflight reported clean. |
| Design and bindings | The 20-member arc Pack has 17 members at stated/derived `ready/ready`, the hook decision at `defined/ready`, and two follow-ups at `idea/idea`. All eight on-ramp Specs have implementation and verifier bindings, and all of their recipe-56 footing rows have reasons. The drift alarm is empty. Recipe 22 found zero unbacked and zero unresolved mentions in its scope. |
| Change from the base | I built the base engine separately, derived its graph, and passed that graph to recipe 35 at the head. The Pack comparison reports 4 Specs added, 16 changed, 0 removed, 1 Pack change and 1 binding change. The whole-corpus comparison includes a second Pack change. The mention audit, the dependency-cycle check and the four-relation walk answer different questions. Two loops through outward on-ramp relations reproduce, including the plugin decision that refines the Spec which names it through `decidedBy`. |
| Evidence reviewed | The brief, owner ideas, original on-ramp observations, revised IA plan, six content ledgers and their survival audit, owner rulings, consolidated checklist, calibration notes, trial records, fix and closure records, PR draft and split proposal memo. I checked the skills, handbook, relevant carriers, implementation, tests and installed-package checks against those claims. The probes below used disposable inputs. [Brief][brief] · [IA plan][plan] · [Owner rulings][rulings] · [Original observations][observations] · [Arc Pack][pack] |

CodeRabbit CLI's authentication-status check succeeded, but the review service then rejected the session or Git-provider access before analysis. The findings below are from direct inspection and reproduction.

## The first verification round and the re-run

The session report identified over-specification as the main failure. The transcripts make the distinction concrete. The author of a password-reset Spec had permission to record a one-time link, a new password and an undecided lifetime. Giving a provisional value the force of a rule changes the product. A correct query, a syntactically valid carrier and an honest readiness floor can all coexist with that mistake.

<!-- prettier-ignore -->
| Trial at `9cedddb6` | What the evidence establishes | What would close it at the reviewed head |
| --- | --- | --- |
| 1. Cold read, checkout | First corpus call was recipe 56. The run made no edits. The claims judge received clipped results and marked sourced claims unsupported. That verdict diagnoses the packet. | Judge the complete outputs and the final answer. Keep an unsupported claim distinct from evidence the instrument discarded. |
| 2. Cold author, checkout | Both runs updated required self-hosting bookkeeping and ran the gate. Those actions explain two mechanical failures and were calibrated. One run also committed without authority. Both fidelity judgments found invented mechanisms or outputs. | Both fresh runs preserve “convert or also confirm” as an open choice, leave the work uncommitted under this prompt, and pass the corrected checks. |
| 2. Cold author, installed project | Both runs passed the mechanical criteria. Both were judged unfaithful. One promoted an undecided lifetime into a blocking design choice. The authors also chose different stated rungs. | Both captures preserve the requester’s requirements, their provisional value and who decides. Compare every new commitment, including narrative and examples, with the request. |
| 3. Resume after compaction | Both counted runs wrote before re-measuring. An example settled part of the open lifetime. Missing reasons on an example's `refines` and `verifies` edges were an instrument issue under the existing law. | After a genuine compaction, the first relevant action re-reads the touched work. A blind judge sees the complete example and the exact request. Voided runs stay separate. |
| 4. Adopter install | Eight mechanical checks and 67 resolved paths are useful coverage. Project queries, Protocol-law queries, and the worked call ran in the packed installation. The claims judge did not run. | Keep a separate claims verdict. Record which install route was exercised, including a real client cache if claiming cache activation. |
| 5. Session-start hook | The first script and headless Claude runs demonstrated activation and duplicate suppression in those setups. A quick resume and missing assertions led to `75ea200c`. The suite now tests refusal, page preservation, subdirectory execution, deadlines and competing hook copies. | Separately record interactive Claude startup/resume/compact, Codex trust and activation, and project-plus-plugin duplicate behavior. A command run under a simulated client environment cannot establish client discovery. |

The re-run is a separate activity. At 00:43 CET on 5 November, `ia/vt-r1` contained the head marker, the completed gate and adopter setup, and running transcripts for the cold read, adopter authoring and install trials. Its evidence directory contained no consolidated verdict at that observation. I did not start a competing round or change its inputs. A completed head-level judgment is needed for each row claimed as accepted. Retain which runs used the temporary handbook block, trusted hooks and a physically cached plugin. The trials that strip the block answer the owner’s question about retiring it. They do not measure the startup cost paid by a user on this branch. [Verification protocol and calibrations][verification] · [First-round fixes and dispositions][fixes] · [Re-check closure][close] · [Hook wiring tests][hooktests]

**One addition to the acceptance method.** Keep one fresh, outcome-level request outside the wording-fix loop. The existing password-reset and vault-link cases are excellent regression cases. A single new choice in another domain will help distinguish a general improvement from teaching agents how to pass those two prompts. Have the judge separately identify missing requirements, added promises and decisions that changed from provisional to settled. Two runs per setting describe those runs. They do not establish a cross-client success rate. This can stay an acceptance exercise for the arc, consistent with the brief's deferral of a maintained eval suite.

## Implementation findings

### 1. The authoring loop can confirm the wrong edit

**High.** The advertised completion check returns stated rung, floor, local findings, other files' node IDs and a global error count. It never returns the changed promise. In a scratch Spec I left a 60-minute reset-link lifetime provisional, then added an unconditional rule expiring it at 60 minutes. Both runs returned the same `idea/idea`, the same existing orphan warning, and `errors: 0`. In a two-member Pack, reversing the members also returned identical output with only `pack:probe` recorded. A direct `g.packContext` read showed the two opposite orders. The test exercises rungs and presence or absence of anchors, with no Pack edit among its touched files. [Authoring loop, lines 24–64][author] · [Test fixture and assertions, lines 207–249][authtest]

Keep the quick structural check. Change its completion criterion to include one readback of the change the person asked for. For a Pack, inspect ordered members or framing. For a binding, inspect the intended target and edge type. For a Spec, compare the changed requirement, example or open question with the request. The graph can show the authored meaning. Deciding whether it was requested needs judgment. A regression case can distinguish two lawful Pack orders. The blind writing trial should assess the provisional choice.

### 2. The session-start hook can give a workspace member its sibling's delivery context

**High for adopters with a shared installation.** I created two package directories, each with its own manifest and one Spec, with the Protocol installed at their common workspace root. From `packages/one`, `q.mjs` returned only `spec:one.intent`. With exactly that directory as hook input `cwd`, the hook reported **two** Specs and the families `one` and `two`. The hook uses the first directory holding the installation for both runtime discovery and graph extraction. The query runner already treats these as separate choices. A reader can therefore receive one project’s roadmap at startup and obtain another project’s state from the first manual query. [Hook root selection and child process][hookroot] · [Query runner selection][qroot] · [Hook decision][hookdec]

Define how this hook chooses the corpus when dependency and project roots differ. With per-package corpora, use the package boundary for the graph and the nearest installation for the runner. A workspace-wide corpus should have an explicit, documented selection. Exercise two siblings, a nested `src/` directory within the intended package and an intentional workspace-root launch. The acceptance condition is that the injected corpus and the direct query from the intended project agree.

### 3. The Studio hand-off sends a lawful Pack-only request to an incompatible checker

**High for Pack editing.** The skill first tells the reader to edit Pack membership or framing in the manifest with the person’s agreement. Its next sentences direct scoped text into a proposal and both kinds of intent through the receive procedure. A proposal scoped to `pack:agent-on-ramps-v1` returned `$.changes[0].scope[0] — Expected a Spec id or entry address.` A request to change only the Pack's framing has no honest member Spec to substitute. The composing panel also offers only scoped text when there is no base or reason, while the skill opens by asking for both parts. The panel's own Spec already distinguishes all these cases. [Studio hand-off, lines 51–70][studio] · [Panel rules and available actions][panel] · [Proposal scope schema][schema]

Separate the hand-off by what the person supplied. Check representable Spec changes through recipe 38. Resolve member-scoped text against the agreed base before expanding it. Handle a Pack manifest edit directly with the person. Accept a text-only hand-off when that is what the panel could export. Close with one Pack-only example and one mixed hand-off, accounting for each requested change exactly once.

### 4. The handbook's commit-authority fix does not reach every entry point

**High where a workflow enters through the vault.** The first checkout trial produced an unauthorized commit. The handbook now scopes both ordinary and work-in-progress commits to authority. The shared proposal procedure also branches on authority. The vault skill still begins its intent workflow with “commit pending carrier edits,” before it reaches that procedure. The executable-example reference likewise directs an author to commit a registrar. Its carrying decision establishes that an adopted registrar belongs in version control. That repository requirement can be fulfilled when the change is authorized for commit. [Handbook owner rules][authority] · [Vault procedure, lines 39–48][vault] · [Shared receive procedure][receive] · [Registrar reference][registrar]

At vault entry, use a confirmed commit that contains what the person read. If relevant edits are pending, surface the need for a baseline and follow the session's commit authority. Describe the registrar as a file that belongs in the authorized change. A clean base should require no new commit. A dirty, unauthorized task should leave unrelated work uncommitted. This is a wording gap on two paths. The recorded unauthorized commit occurred in the earlier authoring trial.

### 5. Three graph-reading instructions can answer a different question from the one asked

<!-- prettier-ignore -->
| Reproduced case | Consequence and correction |
| --- | --- |
| Orientation 9, `{"9":{"files":["skills/sdp-vault/SKILL.md"]}}` | Its first `file.path` was `src/adapters/typescript-imports.ts`. Only the changeset described the requested skill. Passing only `file` instead produced a changeset of two sample files. Its printed template encourages supplying just `files`. Derive both outputs from the supplied subject or label the other as a separate demonstration. Answer 9 also drops recipe 4's incoming/outgoing at-risk Spec IDs while retaining a total and a `leftOut` list that omits this extra cut. [Answer 9][o9] |
| Orientation 8 on `anchor`, including with `--json` | The string says “237 entries in 102 Specs, 50 shown” and prints **four** entries. The wrapper copies recipe 23's `shown` value before taking another slice. Report four displayed, distinguish the upstream 50, and point to the underlying recipe for those rows. This is the same kind of evidence loss that compromised the first claims judge. [Answer 8][o8] |
| Reading with a Pack | The skill routes “a Spec or a Pack” to recipe 56 for its law. `{pack: …}` returns `unknownParams`, `{spec: "pack:agent-on-ramps-v1"}` returns `found: false`, and omitting the subject can select the reading Spec sample. Read the Pack's members and framing first, then run 56 on the relevant **member Spec**. [Reading routes][readroutes] · [Recipe 56 inputs][r56] |

One smaller runner inconsistency also reproduces. The orientation parser explicitly accepts `--root=examples/checkout-v1` and passes it unchanged to `sdp q`, which rejects it as an unknown option. The documented two-argument spelling reads the example's 11 Specs. Normalize the equals form or reject it at the wrapper with the supported spelling. [Orientation argument parser][oparse] · [CLI argument parser][qparse]

### 6. Recipe 56's Spec promises more coverage than the recipe exposes

**Medium.** The rule promises each target behavior rule’s location and counts for its other sections. The recipe caps locations at twelve per target, accepts only `spec`, and counts selected sections. On the authoring on-ramp, the omitted locations included 10 Gherkin-authoring rules, 4 corpus-rule rules and 2 readiness-floor rules. `leftOut` tells the reader how many were clipped, but the recipe has no full-detail mode. A target's Intent can also be present without a count in `alsoHolds`. The catalog documents the cap. The checklist records the cap as delegated for owner review. [Carrying rule][speclaw] · [Recipe implementation and answer contract][r56] · [Delegated rulings][checklist]

The owner can keep the bounded default and say exactly how to obtain the missing locations, or keep the rule's promise and expose them all. The important repair is agreement between the ruled Spec, the teaching and the output. The report's final section contains a checked proposal for recording that choice without changing the rule in this review.

### 7. The two open authoring questions have different answers in the current sources

- **Readiness authority.** The capture rule already assigns _every later readiness edit_ to a human statement, and promotion preflight returns `promotionRequiresHumanStatement: true`. The skill singles out `ready` and tells the reader to state no higher than the floor. One trial left `idea`; another promoted to `scoped` on the same request. Under the current rule a runner may report eligibility, and an author may apply a person's stated rung. Passing preflight alone supplies no authority to promote. If the owner wants agents to choose lower rungs independently, that would be a policy change. [Capture rule][capture] · [Authoring guidance][honest]
- **Invalid question fields.** I replaced `decider: owner` with `decider: product team` in the taught Markdown carrier and queried its scratch root. The CLI exited 1 with `extract/unrecognized-property` at the field line, before the query body ran. The carrying Design entry describes a conformance error. These two classifications determine whether an author can use `report` to investigate the problem. Decide which behavior should hold, then align the carrier and regression coverage for Markdown and the corresponding supported TypeScript case. The skill already explains the token grammar. More grammar prose alone would leave the discrepancy. [Field description][field] · [Normalizer][normalize] · [Query error boundary][qerror]

## Information architecture against the brief

The byte counts below use the plan's `894d9b2d` baseline. “All prose” includes each entry file and its Markdown references. The number loaded on activation is the entry file alone. These are file sizes, not inferred token counts or measured attention.

<!-- prettier-ignore -->
| Surface | All prose before | All prose now | Entry now | References now | Assessment |
| --- | ---: | ---: | ---: | ---: | --- |
| Reading | 51,566 B | 16,533 B | 5,568 B | 5 | Paths, reader fields, trust and empty answers are discoverable. Put one short example of **subject → query → open the named line** on the main path. Today the central worked call is a Protocol-law query, and a reader holding a project file must assemble that pairing. |
| Authoring | 45,455 B | 18,191 B | 6,545 B | 5 | The one edit loop is easier to find. Its check and rules for what belongs where take space ahead of binding hazards. Keep the fidelity instruction beside the edit and show how to read back the thing being changed. The main entry says constant-form anchors bind *only* via package imports, while the self-hosting checkout lawfully uses trusted relative modules. Limit the wording to an adopter or point at the checkout convention. [Self-hosting guidance][selfhost] · [Anchor model][anchors] |
| Sessions | 12,095 B | 6,575 B | 3,288 B | 2 | The requested work selects the session shape. The common proposal procedure earns its own reference. Its last step currently calls for a Studio rebuild or vault run even when a reviewer supplied a proposal directly. Make refreshing a projection conditional on a person using that projection. Otherwise an ordinary proposal can cause a needless build and invalidate generated pages. [Session routes][sessions] · [Receive procedure][receive] |
| Studio | 13,535 B | 9,160 B | 4,234 B | 2 | Task-to-page mapping and preview setup are good disclosed references. A link-only reader encounters the CTRF run-evidence command before the route for reading a page. Move the command to the run-evidence branch while keeping the commit-matching hazard next to it. The Pack/text hand-off above takes priority. |
| Vault | 9,020 B | 3,970 B | 3,970 B | 0 | A short single file fits this task. Ownership, recovery and saving a person's edits warrant early placement. Keep the irreversible recovery guidance visible. Tighten the commit boundary and resist adding another reference solely for symmetry. |
| **Total** | **131,671 B** | **54,429 B** | **23,605 B** | **14** | **58.7% less total prose**. Entry files together fell from 85,314 B to 23,605 B. The largest entry is now 6,545 B, down from 45,455 B. |

**The handbook and startup load.** `AGENTS.md` fell from 36,278 to 10,458 B. Its owner-supplied block, measured through the closing fence and newline, is byte-identical to `343aaa1c` at 2,423 B. The remaining handbook is 8,035 B, 35 B above the original 8,000 B aim. All five descriptions total 1,356 characters against 1,400. The two new contributing pages total 7,104 B. `CLAUDE.md` resolves to `AGENTS.md`. These changes delivered the main savings while preserving a place for checkout-only practice. [Handbook][handbook] · [Contributing guidance][arc]

The plan's 50,500 B combined editorial target was exceeded by 3,929 B. Reading, authoring, sessions and Studio exceed their original per-skill totals. The later ruling retired those per-skill test limits. Each individual entry and reference fits the retained 8,000 B / 120-line and 6,000 B ceilings. Treat the difference as a reason to inspect the expensive paths, without cutting a safety clause to satisfy a historical number. The original goal for the reading entry alone was 5,209 B. The revised entry grew by 359 B while shedding more than 35 KB across its references. [Original budgets][plan] · [Superseding checklist][checklist]

**The remaining cost is concentrated at startup.** The default orientation alone emitted 20,758 B to stdout, compared with the plan's approximate 16,000 B. The notes are 4,346 B, and the required glossary prefix is 14,931 B. The three commands in the _temporary_ block emitted a further 20,703 B when run as printed, including another corpus summary. Some of these reads overlap. The owner has explicitly retained the block until verification. Separate measurements with and without it, and measure a first useful answer on a concrete task. The plan's “largest activation” measure by itself misses these costs. The two skills most likely to improve from another editing pass are reading and authoring. [Start instructions][handbook] · [Plan and intended load][plan]

**The tests deserve the same editorial scrutiny.** `test/skills.test.ts` fell from 2,699 to 1,964 lines. With the new 937-line helper, that pair is 2,901 lines, 202 more than the former file. The hook has a separate 469-line suite for new runtime behavior. The highest-value tests run actual commands, extract the taught carrier, compare preview input shapes and exercise the installed tarball. Keep them. Some helper code recognizes English number words and shell fragments. Its generic body check skips placeholders and file-fed parameters, and recognizes only `unknownParams` and top-level `found: false` as empty results. It can pass a returned diagnostics object or a structurally valid but misleading answer. The Studio table test verifies that a printed number and name agree with each other, not that this page uses that recipe. Prefer a small semantic fixture for an observed failure over another regular expression about prose. [Generic checks][helper] · [Studio table test][tabletest] · [Packed consumer smoke test][smoke]

**Plan dispositions.** D1's first-action recipe-file rule, D2's eight categories, D5's query-bearing briefs and hand-offs, and D6's protected temporary block are represented in the code or guidance. D3 is a deliberate variation: an answered call gets the hint, a missing body gets the listing on stderr and exits 1, and other refusals keep their diagnostics. D7 superseded D4's repository-only hook. The package and temporary checkout wiring exist. Real-client acceptance is a separate row above. The CLI packages the orientation scripts and tests run them on both corpora, closing the earlier observation about missing orientation assets. The observation about skills lying outside the graph still holds for the Markdown files themselves. `metadata.realizes`, recipe 56, and the test anchors give a traceable route around that boundary. The two `idea` captures have owner-decided questions with re-entry triggers. Keeping the temporary block, omitting a new Markdown anchor mechanism, and postponing the heads-up display, diff-context command, client implementation and maintained eval suite all follow the scope decisions. [Owner ideas][ideas] · [Rulings][rulings] · [Shipping contract][shape]

The survival audit found no item classified as lost, but did mark two partials. The resume instruction has since moved to the handbook, adopter block and authoring loop. Its behavioral re-run remains relevant. The cut list still needs an owner disposition for floor waits (AU26), the wider editorial cuts and the removed checkout bootstrap details. Recipe 9's `firstUnmetClause` gives a concrete reason to accept the AU26 cut if the owner wants that detail on demand. The earlier audit is valuable evidence of placement at its commit, rather than a blanket sign-off on every later sentence. [Survival audit][audit] · [Disposition of the earlier findings][fixes]

## Review of the PR description

1. **Put the acceptance result in the opening.** The first page says the arc “proves the on-ramps” and makes the path work “in any project.” Its own trial table reports unfaithful writing runs and outstanding live-client work. A more accurate opening would read **“This change ships five smaller on-ramps and a graph-first authoring loop. The engineering gate passes. The first writing trials exposed added requirements, and the revised wording is undergoing a second round.”** Update that last sentence when a judged result exists. The same distinction applies to the claim that both clients inject context. The tests demonstrate the script and configuration under simulated environments, and the transcripts provide additional coverage for headless Claude.
2. **Correct the branch record.** GitHub and local HEAD both identify `38d738bc`. The scratch draft and published opening still say the remote is `894d9b2d`; the Record section says 23 commits are unpushed. `git rev-list --count 760a88c5..38d738bc` gives **30**, and `894d9b2d..38d738bc` gives **23**. The pasted session report's 25 commits uses neither of those ranges. Preserve the historical trial commit in a separate field. Likewise, the head's plain gate passed, while early slice gates substituted ignore rules. The checklist and the PR's verification section already name those exceptions. [PR][pr] · [Commit history][history] · [Gate log account][checklist]
3. **Repair the recipe 35 reproduction.** In the draft's graph section, line 82, `node -e '…writeFileSync(process.argv[2], …)' "$TMPDIR/r35.json"` has one user argument. Node places it at `process.argv[1]`. I reproduced `ERR_INVALID_ARG_TYPE` on the undefined path. If a prior `r35.json` survives, a shell that continues after failure can compare the wrong graph. The argument-merging form below avoids creating that intermediary. Use a fresh base graph from the base's own engine, outside the head's generated directory. The Pack result should read 4 added, 16 changed, 0 removed, 1 Pack and 1 binding. [PR graph section][prgraph] · [Local draft][prdraft]
4. **Keep the distinction between deployment and owner review.** I re-ran the draft's 61-change comparison against this head. It classified 60 as matching and only change 57 as different. The owner’s D1 wording explains that difference. The check compares carrier text or graph edges and reasons. A removed marker or a matching substring is evidence of placement, not a decision on the merits. The two memo files exist. Link their actual PR comments once available, and separate the owner's approval from the existence of the memo. When checked on 5 November, the public discussion contained the automated review-skip comment. The two local memo parts and the public PR body should be distinguished when describing Gate A. [Split memo, first part][memo1] · [Proposal document][memo2] · [PR discussion][pr]
5. **Make the record readable at two depths.** Keep the short delivery summary, trial table, open owner decisions and reproduction commands visible. Retain the full ruling tables, roadmap memo and historical working note under disclosures or links. The scratch description is 58,780 characters. The formatted public body includes the earlier temporary TODO a second time. Keep its two owner requests once: revisit the `*.tmp.md` ignore and make worktree handling harness-agnostic. They coexist with the earlier ruling to ignore the owner's temporary files during the arc. Avoid presenting either as a standing decision to delete those files.
6. **Tighten two claims next to their evidence.** A skill or handbook file has unknown changed-file reach, but a Studio page _can_ show its carrying Spec and test-file binding. Likewise, some joined rows have no rule location. The recipe's `leftOut`, null lines, and unkeyed rules are part of the answer. The main-page pitch should describe what a reader can actually follow. In the Try-it section, `orient.mjs --only 1,5` runs the same two queries as the hook, but the hook formats and bounds its own output. Label it as the runner demonstration. [Reading contract][readlaw] · [Recipe output][r56] · [Hook rendering][hookrender]

## Decisions when work resumes

<!-- prettier-ignore -->
| Owner or evidence needed | Smallest useful closure |
| --- | --- |
| Faithful capture and re-measurement | Finish the independent head-level round in both environments. Distinguish a conformance pass, a fidelity verdict and an instrument failure. Retire the temporary block only on the owner's instruction. |
| Hook decision and project boundary | Resolve the shared-installation case. Record the real-client observations and consent to the event-deduplication trade-off, then decide the stated rung, decision-registry entry and non-blocking `arcBlock` question. |
| Authoring and schema drift | Apply the current human-statement rule unless the owner changes it. Settle the question-field failure boundary and recipe 56's coverage. Check each change against an observable case. |
| Remaining editorial rulings | Decide AU26 and the other flagged cuts, the third bet's wording, permanent ignore/worktree policy and the evidence location. Preserve the two captured follow-ups and existing roadmap order until the owner changes them. |
| PR close | Update the public status, replace the broken reproduction, link the proposal and acceptance evidence, and date each claim to its own commit. Gate A is the owner's proposal review, B their reading of the skill and handbook, and C their close of the arc. |

## Reproducing the review

These are read-only graph calls from the Protocol checkout. The `BASE_GRAPH` variable in the recipe 35 call is a previously derived graph file. In the independent comparison I built `760a88c5` in a separate directory with that commit's engine and ran its `q 'return graph'` with the normal three fixture exclusions.

```sh
git rev-parse HEAD
git rev-list --count 760a88c5..38d738bc
git rev-list --count 894d9b2d..38d738bc

pnpm --silent sdp:q 'return {pack:(await recipes(29,params)).totals,drift:(await recipes(2)).total,findings:report.findings.map(f=>[f.severity,f.validatorId,f.subjectId])}' --params '{"pack":"pack:agent-on-ramps-v1"}' --json

pnpm --silent sdp:q 'return (await recipes(35,params)).totals' --params "base=@$BASE_GRAPH" --params '{"pack":"pack:agent-on-ramps-v1"}' --json

pnpm --silent sdp:q 'const r=await recipes(56,params); return {found:r.found,targets:r.law.length,leftOut:r.leftOut}' --params '{"spec":"spec:consumers.authoring-on-ramp"}' --json

node skills/sdp-agent-surface/scripts/orient.mjs --only 9 --subjects '{"9":{"files":["skills/sdp-vault/SKILL.md"]}}' --json
node skills/sdp-agent-surface/scripts/orient.mjs --only 8 --subjects '{"8":{"terms":["anchor"]}}' --json
```

The original plan, its verification appendix and the first-round evidence are session working files. The report records their findings and commit boundaries so that the review can still be read after those temporary paths expire. Repository source links below are pinned to the reviewed commit. The public PR and any ongoing trial evidence can change after this snapshot.

## Checked change proposal for the owner

The one proposed carrier edit records the unresolved recipe 56 choice. The other findings concern implementation, teaching, the verification instrument or the PR record under already stated intent. I ran the proposal check (recipe 38) against the graph of the reviewed commit and rendered the memo with recipe 49. One change, zero schema problems, zero moved scopes and zero unresolved scopes. The JSON is included here for review. Nothing was applied or posted.

<details><summary>Proposal for the recipe 56 coverage question</summary>

```json
{
  "schema": "sdp-proposal/1",
  "base": "38d738bcc23d1e43fcf1fdde7af117ef71298449",
  "reason": "Resolve the difference between the rule-line coverage promised for recipe 56 and the bounded answer readers receive.",
  "changes": [
    {
      "scope": ["spec:consumers.agent-surface.register-recipes#rule.specLaw"],
      "request": "Add a non-blocking question under Intent for the owner to settle the coverage promised by the rule.",
      "text": "- [non-blocking #lawCoverage] How many behavior rule locations must the law recipe return per target, and which other sections must it count?\n  - decider: owner\n  - provisional: keep the bounded answer and its omission counts while the owner reviews the wording\n  - links: spec:consumers.agent-surface.register-recipes#rule.specLaw",
      "reason": "The authoring on-ramp currently has three targets whose remaining rule locations cannot be requested through recipe 56."
    }
  ]
}
```

</details>

[pr]: https://github.com/libar-dev/software-delivery-protocol/pull/43
[prgraph]: https://github.com/libar-dev/software-delivery-protocol/pull/43
[history]: https://github.com/libar-dev/software-delivery-protocol/compare/760a88c5...38d738bc
[brief]: /Users/darkomijic/dev-libar/software-delivery-protocol/skills-refactoring-brief.tmp.md
[ideas]: /Users/darkomijic/dev-libar/software-delivery-protocol/USER_IDEAS.skills-refactoring.tmp.md
[plan]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/ia-plan.md
[rulings]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/land-00-owner-rulings.md
[verification]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/ia-verification.md
[fixes]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/complete/fix.md
[close]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/complete/close.md
[checklist]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/ia-checklist.md
[audit]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/complete/audit.md
[prdraft]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/pr-description.md
[memo1]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/pr-gate-a-memo-1.md
[memo2]: /private/tmp/claude-502/-Users-darkomijic-dev-libar-software-delivery-protocol/fc8a475b-e3f2-4924-9309-e3d519a77d79/scratchpad/ia/pr-gate-a-memo-2.md
[observations]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/design/07-graph-needs.md?plain=1#L124-L178
[pack]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/agent-on-ramps.pack.sdp.md?plain=1#L1-L27
[hooktests]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/session-start-hook.test.ts#L388-L456
[author]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-authoring/SKILL.md?plain=1#L24-L64
[authtest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/skills.test.ts#L207-L249
[hookroot]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/hooks/session-start.mjs#L61-L70
[qroot]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/q.mjs#L44-L73
[hookdec]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/decisions/session-start-hook.sdp.md?plain=1#L23-L44
[studio]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-studio/SKILL.md?plain=1#L51-L70
[panel]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/spec-studio.intent-panel.sdp.md?plain=1#L32-L40
[schema]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/schemas/sdp-proposal-1.schema.json#L27-L38
[authority]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/AGENTS.md?plain=1#L113-L121
[vault]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-vault/SKILL.md?plain=1#L39-L65
[receive]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-sessions/references/proposals.md?plain=1#L17-L38
[registrar]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-authoring/references/examples.md?plain=1#L11-L23
[o9]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/orientation/09-arrive-with-a-file.js#L5-L30
[o8]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/orientation/08-arrive-with-a-word.js#L14-L30
[readroutes]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/SKILL.md?plain=1#L76-L90
[r56]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/agent-surface/recipes.md?plain=1#L6366-L6446
[oparse]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-agent-surface/scripts/orient.mjs#L120-L141
[qparse]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/cli/q-command.ts#L100-L155
[speclaw]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/agent-surface.register-recipes.sdp.md?plain=1#L37-L41
[capture]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/authoring-on-ramp.sdp.md?plain=1#L50-L55
[honest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-authoring/SKILL.md?plain=1#L66-L85
[field]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/model/open-question-fields.sdp.md?plain=1#L52-L59
[normalize]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/extract/authoring-normalization.ts#L137-L165
[qerror]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/src/cli/q-command.ts#L255-L281
[selfhost]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/contributing/self-hosting.md?plain=1#L22-L31
[anchors]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/model/anchors.sdp.md?plain=1#L39
[sessions]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/skills/sdp-sessions/SKILL.md?plain=1#L17-L61
[handbook]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/AGENTS.md?plain=1#L44-L76
[arc]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/docs/contributing/arc-record.md?plain=1#L24-L55
[helper]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/helpers/on-ramp-checks.ts#L861-L913
[tabletest]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/skills.test.ts#L1655-L1674
[smoke]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/test/package-smoke.test.ts#L789-L899
[shape]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/shipped-protocol-corpus.sdp.md?plain=1#L25-L31
[readlaw]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/specs/consumers/reading-on-ramp.sdp.md?plain=1#L40-L50
[hookrender]: https://github.com/libar-dev/software-delivery-protocol/blob/38d738bcc23d1e43fcf1fdde7af117ef71298449/hooks/session-start.mjs#L216-L237

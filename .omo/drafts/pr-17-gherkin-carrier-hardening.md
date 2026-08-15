---
slug: pr-17-gherkin-carrier-hardening
status: complete
intent: clear
review_required: true
plan_path: .omo/plans/pr-17-gherkin-carrier-hardening.md
plan_sha256: 6ea2a82c005fc59250c487bd1f504e4fab675d2342f5ec8727281e3fdfec46e9
review_round_id: round-2-46dd633718cb
review_round_limit: 5
pending-action: execute .omo/plans/pr-17-gherkin-carrier-hardening.md via /start-work
review:
  momus:
    status: approved
    workspace_root: /home/darkomijic/dev-libar/software-delivery-protocol
    runtime_home: /home/darkomijic
    target: .omo/plans/pr-17-gherkin-carrier-hardening.md
    round_id: round-2-46dd633718cb
    plan_sha256: 6ea2a82c005fc59250c487bd1f504e4fab675d2342f5ec8727281e3fdfec46e9
    launch_id: launch-9193f2fd6be5
    session: st_019ffd98
    result: "[OKAY] Referenced files and patterns verified; actionable todos and concrete QA; no blocking contradictions."
review_history:
  - round_id: round-1-7e6a2ae82124
    session: st_019ffd97
    result: inconclusive
    reason: Explicit OpenAI provider had no configured API key; Momus never began review.
  - round_id: round-2-46dd633718cb
    session: st_019ffd98
    result: approved
    plan_sha256: 6ea2a82c005fc59250c487bd1f504e4fab675d2342f5ec8727281e3fdfec46e9
approach: Harden the bounded Gherkin carrier against every review finding, preserve the one-graph and anchored-execution laws, and close the PR with focused executable examples plus the full repository gate.
---

# Draft: pr-17-gherkin-carrier-hardening

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
| id | outcome | status | evidence path |
| --- | --- | --- | --- |
| source-locations | Every Gherkin description refusal reports the true physical source line despite blank lines and comments | active | `src/extract/gherkin.ts:385-479`, `src/extract/gherkin.ts:695-727`, `src/extract/gherkin.ts:762-831` |
| discovery-policy | `.sdp.gherkin` becomes the canonical collision-safe Gherkin carrier while bare `.feature` remains available to import tooling | active | `src/extract/discover.ts:4-5`, `src/cli/build-command.ts:116-124`, `specs/decisions/sdp-ts-extension.sdp.md`, `specs/decisions/gherkin-carrier-option.sdp.md:12-21` |
| closed-grammar | Decoration suggestions, step-less Scenarios, prose constraints, and per-file finding behavior are exact and ergonomic | active | `src/extract/gherkin.ts:117-239`, `src/extract/gherkin.ts:385-642`, `src/extract/gherkin.ts:744-798` |
| carrying-truth | The carrier Spec, executable examples, authoring skill, concepts, and oracle rationale state the hardened behavior consistently | active | `specs/carrier/gherkin-authoring.sdp.md:13-24`, `.agents/skills/sdp-authoring/SKILL.md:77-98`, `test/self-hosting-oracle/index.ts:52` |
| dependency-posture | The exact runtime parser dependency posture is explicit without speculative lazy-loading | active | `package.json`, README carrier guidance |
| pr-close | Focused tests, graph checks, generated artifacts, type checks, manual CLI QA, and `npm run check` prove merge readiness | active | `test/gherkin-reifier.test.ts`, `test/self-hosting-carrier-gherkin.test.ts`, `test/gherkin-parity.test.ts` |

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
| assumption | adopted default | rationale | reversible? |
| --- | --- | --- | --- |
| Similarity threshold | Use edit distance 1 for reserved heads of five characters or fewer and 2 for longer heads; diagnostics name authored and suggested heads | Retains typo protection while admitting the review's innocent examples | yes |
| Step-less ordinary Scenario | Refuse it at the Scenario keyword line before graph insertion | An ordinary Scenario promises exactly one bound point and Markdown cannot author an empty GWT point | yes |
| Narrative restrictions | Preserve the closed classification and document exact lawful rewrites instead of loosening it before brief A | Relaxation would silently pre-decide plan 29's rich-content ruling; ordinary `Context: details` remains narrative while title-only `Context:` remains refused | yes |
| Per-file diagnostics | Accumulate independent Gherkin grammar findings where safe, but exclude the entire file and never leak partial nodes | Addresses authoring friction without weakening all-or-nothing graph honesty | yes |
| Runtime parser packages | Keep exact runtime pins and document that carrier support is installed for all consumers | Lazy-loading complicates a synchronous extraction boundary and does not remove installed package weight | yes |
| Historical drift | Repair the complete already-known declined-Gherkin drift inventory now; do not wait for brief A | MD-27 already overturned the old blanket decline, so this is drift repair rather than a new ruling | yes |
| Additional migration | Do not migrate a second Spec family merely for dogfooding | The review calls it a non-issue; migration expands PR blast radius without closing a defect | yes |
| Editor tooling | Ship a repository editor association and authoring guidance for `.sdp.gherkin` | Collision safety necessarily sacrifices default `.feature` syntax highlighting/formatting; the cost must be explicit and mitigated | yes |
| Decision classification | Add a dedicated suffix decision Spec and registry entry, then repoint MD-15/MD-27 | The ADR test passes: an adopter-facing canonical suffix is hard to reverse after adoption, surprising without the tooling trade-off, and chooses collision safety over default editor recognition | no |

## Findings (cited - path:lines)
- Confirmed: `parseDescription` derives finding lines from `keyword line + index`, while the Cucumber parser omits source-only blanks/comments; Rule and `@example-space` description refusals repeat the same arithmetic (`src/extract/gherkin.ts:385-479`, `src/extract/gherkin.ts:695-727`, `src/extract/gherkin.ts:762-831`).
- Confirmed owner-policy fork: suffix-only discovery claims every `.feature` below the extraction root, and a missing identity is a hard grammar error (`src/extract/discover.ts:4-5`, `src/extract/gherkin.ts:349-359`).
- Architecture consultation confirms this is an incomplete application of the anti-glob carrier-identity law (MD-15), not part of plan 29 brief A's kind/default-carrier ruling. Bare `.feature` collides inbound because SDP discovers ordinary Cucumber suites and outbound because Cucumber globs discover Protocol carriers.
- Owner selected `.sdp.gherkin`. The ruling explicitly accepts loss of default Gherkin editor/tool associations in exchange for collision safety, ships repository association guidance, and distinguishes bare `.feature` as a future/import-source shape rather than a canonical carrier.
- Verified suffix touch points include discovery (`src/extract/discover.ts:5,148-149`), code-level carrier checks and empty-corpus help (`src/cli/build-command.ts:116-124`), `.prettierignore:26-29`, extractor routing/copy logic, the one live reader carrier, all defused fixtures/tests/docs/skills, and frozen graph oracles whose `file` values change (`test/self-hosting-oracle/consumers.ts:146-149,672-739`).
- Confirmed: `nearest` globally accepts distance 2 and the diagnostic calls the authored head reserved instead of naming the reserved suggestion (`src/extract/gherkin.ts:117-151`, `src/extract/gherkin.ts:229-236`).
- Confirmed: `parseSteps([])` succeeds and ordinary Scenario reification emits one empty example point (`src/extract/gherkin.ts:497-588`, `src/extract/gherkin.ts:744-798`).
- Confirmed: any unknown `- word:` line enters keyed parsing and the broad uppercase-colon regex refuses ordinary prose (`src/extract/gherkin.ts:76-77`, `src/extract/gherkin.ts:385-479`); intended truth names the restrictions but author guidance does not explain their practical boundary (`specs/carrier/gherkin-authoring.sdp.md:20`, `.agents/skills/sdp-authoring/SKILL.md:87-88`).
- Confirmed polish: the explanatory `expectedWarnings = []` rationale is absent (`test/self-hosting-oracle/index.ts:52`); the current reifier returns the first file finding; parser packages are exact runtime dependencies; plan 29 records a complete stale declined-Gherkin inventory (`plans/29-universal-carrier-annotations-and-agent-surface-briefs.md:111-115`).
- Graph evidence: `spec:carrier.gherkin-authoring` is ready, implemented, and has a verifier; all ten child example Specs are ready and have verifiers. The remediation must update carrying truth before implementation and preserve those derived facts.

## Decisions (with rationale)
- Test first at the authored seam: add ready executable example Specs and defused fixture corpora for physical-line honesty, harmless decoration tags, step-less refusal, and narrative boundaries; bind them through the existing `specTest`/generated-contract suite.
- Source-line mapping will build one source index from physical lines plus official parser comment locations, align each AST description line monotonically and exactly while skipping only blanks/comments, and fail with `extract/gherkin-syntax` if alignment becomes impossible. Rule and pseudo-scenario refusals use the first located prose line; LF and CRLF must agree.
- Keep the carrier closed, graph-neutral, and non-executing: no authored facts, Cucumber execution, partial graph insertion, parallel tags, or carrier-specific contract path.
- Treat the known roadmap statements as drift repair against MD-27, not as part of the future carrier-universality ruling.
- Rename the canonical suffix atomically to `.sdp.gherkin`; preserve suffix-only discovery and do not content-sniff for `@spec.`, impose a path caste, add dual-suffix compatibility, or add an opt-in discovery mode. `.sdp.feature` remains invalid because it still matches Cucumber globs.
- The planning session applied the ADR three-part test and it passes. Execution adds a dedicated `.sdp.gherkin` suffix decision Spec and registry entry, then updates MD-15 and MD-27 as predecessor/context pointers without rewriting their original choices.
- Lead commissioned plan 30 with the suffix ruling, keep grammar findings as riders, and update plan 29 brief A to state that it builds on the plan-30 `.sdp.gherkin` surface.
- Reserved-head matching uses distance 1 for candidates of five characters or fewer and distance 2 for longer candidates, suggests only a unique nearest lawful tag form, and names both authored and reserved heads. Accepted decoration tags remain graph-inert.
- Ordinary and `@example-space` Scenarios with zero steps are refused at the Scenario line; a Feature with no Scenarios and a Scenario with one lawful Given remain valid. No broader complete-GWT or phase-cardinality rule is added.
- Description classification remains: closed keyed bullets first, uppercase title-only colon lines refused as heading-shaped, all other nonblank lines narrative, comments omitted. Guidance gives lawful rewrites; tests assert parsed values rather than prose wording.
- Semantic grammar findings accumulate in physical source order up to 100, with the 100th suppressing the remainder. Parser errors and file-level gates stop semantic traversal; any semantic finding excludes every node and edge from that carrier while healthy sibling files survive.

## Scope IN
- Findings 1, 3, 4, and 5 with carrying Specs, fixtures, implementation, focused tests, and author guidance, including LF/CRLF source alignment and empty pseudo-scenario refusal.
- Finding 2 after the owner selects the public discovery policy.
- Atomic `.sdp.gherkin` migration across discovery/routing/help/copy predicates, ignore/tooling configuration, the live reader family, fixtures, docs/skills, and all frozen graph oracles.
- Minor-item dispositions: oracle rationale restoration, multi-finding authoring ergonomics, runtime dependency documentation, and complete declined-Gherkin drift repair.
- Generated contracts/oracles/counts affected by new ready examples.
- Full PR verification and real CLI happy/failure/help QA.

## Scope OUT (Must NOT have)
- No plan 29 carrier-universality ruling, default-carrier flip, new Spec kinds, rich Gherkin bodies, derived runnable modules, projections, structural anchors, or MCP work.
- No second family migration solely for dogfooding.
- No lazy parser loader unless verification disproves the synchronous installed-dependency posture.
- No Cucumber execution path, authored delivery facts, partial graph on a refused file, or weakening of duplicate-surface refusal.
- No handwritten Gherkin parser, tag autocorrection, rich Markdown/doc-string/data-table support, complete-GWT expansion, or empty-contract workaround in codegen.

## Open questions
- None. The owner selected `.sdp.gherkin`, and the planning session resolved the durable record as a new decision Spec because the ADR three-part test passes.

## Approval gate
status: awaiting-approval
approach: Commission plan 30 as a suffix-ruling-led PR hardening session: atomically establish `.sdp.gherkin`, state and mitigate the editor-tooling trade-off, then land findings 1/3/4/5 and minor polish as riders against the same syntax owner before full PR close.
next workflow action: On approval, create `.omo/plans/pr-17-gherkin-carrier-hardening.md`, run Metis gap analysis, complete the decision-ready task plan, then run up to five fresh Momus review rounds because high-accuracy review is default-on.
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->

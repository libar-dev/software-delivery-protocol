# Open questions from the review

Each confirmed design finding, written as an open question ready to author on its carrying Spec.
The form follows `spec:model.open-question-fields`: a `[blocking]` or `[non-blocking]` flag with a
key, then optional `decider`, `provisional`, `links` and, on a blocking question, `trigger`. Only
the `[blocking]` flag moves a readiness floor.

- **Questions 1, 2 and 6** sit on Specs that state `ready`, so they are proposed non-blocking: a
  blocking question would hold a ready, implemented Spec below its floor for a gap that does not
  make the stated law false, only incomplete. The owner may rule otherwise.
- **Questions 3, 4 and 5** are deferrals. Each is a blocking question with a `trigger`, on a new
  `idea` capture, the way the corpus records other unbuilt directions (reference projection,
  runtime overlay, symbol reach). A capture holds no ready Spec below its floor and adds no
  roadmap priority.

Authoring any of these is a Spec edit. The change proposal does not carry them: the owner rules on
each question's flag, decider and home first, and an authoring session then adds it (a capture
cannot travel in a proposal; see `not-proposed.md`). Questions are numbered by source lane, then
severity: L3-02 and L9-F3 from the engineering lanes, then L11-01 and L12-02 (medium) and L10-9
(low) from the product-lens and PR-record lanes. Unsettled items from the PR-record lane follow
at the end; they are not findings.

## 1. Symbolic links in discovery (from L3-02)

- **Spec:** `spec:extraction.excludes` (`specs/extraction/excludes.sdp.md`), beside
  `#rule.canonicalDiscovery`.
- **Authored form:**

  ```markdown
  - [non-blocking #symbolicLinks] Does discovery follow a symbolic link to a carrier or a directory of carriers, refuse it, or skip it with a finding? Today it skips it with no finding, and `canonicalDiscovery` does not name the skip.
    - decider: owner
    - provisional: discovery never follows a symbolic link, and each one it meets outside an excluded or skipped path is named in a warning, the same stance watch mode already takes
    - links: spec:extraction.excludes#rule.canonicalDiscovery
  ```

- **Blocking:** no (see above). It blocks the code change: no fix lands until the policy is stated.
- **Decider:** owner.
- **Provisional answer:** do not follow links; warn once per skipped link
  (`extract/symbolic-link-skipped` or similar), and state the skip in `canonicalDiscovery`. This keeps
  discovery consistent with `src/cli/validate-watch.ts:378`, which refuses links on purpose.
- **Evidence:** `src/extract/discover.ts:130-143`; probe8 (a `specs` symlink gives "0 specs", exit 0)
  and probe1 (a linked carrier shows only as a dangling reference from another Spec).
- **Related:** L4-04 (watch rejects a symlinked root) touches the same policy at the root level; the
  answer here should say whether an explicitly selected root may be a link while links below it are
  not followed.

## 2. Token budget in the composing view (from L9-F3)

- **Spec:** `spec:consumers.spec-studio.intent-panel`
  (`specs/consumers/spec-studio.intent-panel.sdp.md`).
- **Authored form:**

  ```markdown
  - [non-blocking #viewBudget] Should the composing panel show the token budget of what the receiving agent will be given, as job JS-F1 promises, or does the hand-off name its scope and leave the budgeted reading to the agent's context bundle?
    - decider: owner
    - provisional: the panel shows no budget; the hand-off names its scope, the receiving agent reads it with the context bundle (recipe 36), and JS-F1's acceptance criteria 1 and 7 are amended to say so
    - links: spec:consumers.context-bundle, spec:consumers.intent-composition
  ```

- **Blocking:** no. The panel is implemented and verified against its current rules; the question
  decides whether the job or the Spec moves.
- **Decider:** owner.
- **Provisional answer:** amend the job, not the Spec. The current design deliberately delegates
  scope reading to the receiving agent (`spec-studio.intent-panel.sdp.md:28`), and a view-side budget
  would need a tokenizer choice the Protocol does not otherwise make.
- **Evidence:** `jtbd-stories/06-edit-through-the-lens.md:13,18,24`; `findByConcept("budget")` and
  `findByConcept("token")` find nothing in the composition family or the intent panel.
- **Note on links:** a link that names a Spec with no declared relation either way raises the
  `conformance/prose-mentions` warning for that pair, which the self-hosting oracle pins at zero.
  At the base, the intent panel `refines` `spec:consumers.intent-composition` (backed), but declares
  no relation with `spec:consumers.context-bundle`. Either add a `dependsOn` with a reason or drop
  that link and name the context bundle in the provisional line only; re-check with recipe 22.

## 3. A boundary for AI-written presentation (from L11-01)

- **Spec:** a new capture, `spec:consumers.ai-assisted-reading` (behavior, story, readiness
  `idea`). Outcome: "Let a reader ask for a useful existing reading and inspect why it was selected
  and what scope it omits." The verifier moved the question here from a non-blocking question on
  the ready, implemented `spec:consumers.projections-model`.
- **Authored form:**

  ```markdown
  ### Open questions

  - [blocking #aiPresentationBoundary] If an assistant generates explanations or arrangements beyond selecting deterministic readings, what contract keeps its output distinct from graph claims and makes the exact reading reviewable?
    - decider: owner
    - provisional: begin with selecting existing deterministic readings; keep variable explanations outside the Studio and the frozen projections, labelled as assistant-generated and not byte-reproducible, keeping the original claims on cited facts and showing source commit, scope and omissions, and decide how to retain the exact output with its model, prompt and inputs; add no claim category, delivery fact, or quality or workflow validator
    - links: spec:consumers.projections-model, spec:extraction.claim-taxonomy, spec:consumers.spec-studio#rule.namedInputs, spec:consumers.context-bundle#rule.cutOrder, spec:consumers.review-perspectives#rule.contentIntact, spec:decisions.shipped-projections-frozen
    - trigger: the UX design pass measures that assistant selection or a generated explanation helps a named review task
  ```

- **Blocking:** yes, as a deferral on its own capture.
- **Decider:** owner.
- **Provisional answer:** start with selection of existing deterministic readings; any
  model-written text stays outside the Studio and the four frozen projections and is labelled as
  such.
- **Evidence:** Part 5 of the PR #34 articles (at `230b0d28`, lines 35-56 and 64-72) names the
  boundary between variable model-written prose and projections that are pure functions of the
  graph. Recipe 20 returns 16 questions and 6 deferrals at the base, none on an assistant; recipe 6
  finds nothing for LLM, assistant, language model, adaptive, non-deterministic, GraphRAG or
  retrieval. Founding principle P3, deterministic derivation, bounds it; name P3 in the capture's
  narrative, since a link must be a Spec id or an entry address.
- **Relations to declare:** every link needs a declared relation either way, or recipe 22 reports
  the pair. For example: `refines` `spec:consumers.projections-model`, and `dependsOn`, each with
  a reason, on the other five targets. All six addresses resolve at the base (recipe 25).

## 4. When bound-file changes make run evidence stale (from L12-02)

- **Spec:** a new capture, `spec:observation.run-evidence.bound-file-freshness` (`idea`), refining
  `spec:observation.run-evidence`. The existing non-blocking question
  `spec:observation.run-evidence#question.freshness` moves here and becomes the deferral.
- **Authored form:**

  ```markdown
  ### Open questions

  - [blocking #freshness] When should changes to bound files make recorded run evidence stale?
    - decider: owner
    - provisional: keep the current differing-commit display until a file-sensitive policy is designed
    - links: spec:observation.run-evidence
    - trigger: a reader is misled by a run whose commit matches but whose files moved
  ```

- **Blocking:** yes, as a deferral on its own capture; the ready parent keeps no question.
- **Decider:** owner. The reader proposed the decider; the owner should confirm it.
- **Provisional answer:** keep the differing-commit display.
- **Parent edits in the same change:** remove `#freshness` from `spec:observation.run-evidence`,
  and replace its narrative sentence "The freshness question records what remains unsettled about
  comparing a run with the source being read." with one naming the capture. Update the pinned
  narrative and question list in `test/self-hosting-oracle/observation.ts`.
- **Evidence:** PR #35 lists bound-file freshness as deferred, and its trigger lives only in the
  plan "Designs people can read, and an adopter at full speed", which the cleanup removes. The
  placement law (`specs/decisions/planning-truths-placement.sdp.md:18`) puts a deferral's trigger
  on its own blocking question. Recipe 55's "Deferred, with their triggers" lists six items at the
  base, and not this one.

## 5. Which slot-value combinations coverage reports (from L12-02)

- **Spec:** a new capture, `spec:consumers.agent-surface.combination-coverage` (`idea`), refining
  `spec:consumers.agent-surface.example-space-coverage`.
- **Authored form:**

  ```markdown
  ### Open questions

  - [blocking #combinationCoverage] Which combinations of slot values should coverage enumerate and report?
    - decider: owner
    - provisional: keep recipe 44 limited to individual slot values
    - links: spec:consumers.agent-surface.example-space-coverage#rule.perSlotOnly
    - trigger: a design pass asks which combinations no example exercises
  ```

- **Blocking:** yes, as a deferral on its own capture.
- **Decider:** owner. The reader proposed the decider; the owner should confirm it.
- **Provisional answer:** coverage stays per slot value.
- **Parent edit in the same change:** `#perSlotOnly` loses its in-rule deferral and reads
  "Coverage is reported per slot value; the recipe reports no combination of two or more slots."
  The key stays, so `exercises: [... perSlotOnly ...]` on the number-not-enumerable example still
  resolves. Update the pinned rule text in `test/self-hosting-oracle/consumers.ts`.
- **Evidence:** PR #35 lists slot-combination coverage as deferred; the deferral lives only inside
  the ready rule (`specs/consumers/agent-surface.example-space-coverage.sdp.md:25`) and its trigger
  only in the plan named in question 4. Recipe 55 does not list it.

## 6. A preview of the hand-off in the composing panel (from L10-9)

- **Spec:** `spec:consumers.spec-studio.intent-panel`
  (`specs/consumers/spec-studio.intent-panel.sdp.md`). It has no `### Open questions` yet; add one
  at the end of Intent. If question 2 (`#viewBudget`) lands too, both share it.
- **Authored form:**

  ```markdown
  ### Open questions

  - [non-blocking #handOffPreview] Should the panel show the memo it will hand off, and each row's action and exact text, before Copy or Save?
    - decider: owner
    - provisional: yes, a collapsed read-only memo preview and the action label on each row, with no new data
    - links: spec:consumers.intent-composition.proposal.memo
  ```

- **Blocking:** no. The panel meets its current rules, `#handOff` included; this is a design
  improvement, not a breach.
- **Decider:** owner.
- **Provisional answer:** a collapsed read-only memo preview and an action label per row.
- **Evidence:** `src/studio-elements/intent-panel-element.ts:129-130` and `:178-202`: rows show
  scope and the free-text request, not the action ("Change target", "Propose example") or the exact
  text, and the memo is readable only after Copy or by opening the saved file. The verifier
  narrowed the failure: the exclusions under "Not in the proposal" are visible. Part 2's question 6
  asks for this; the seed's pending-changes panel showed it
  (`docs/lineage/v0-design/07-spec-studio-and-projections.md:268-273`).
- **Links:** the panel already declares `dependsOn` `spec:consumers.intent-composition.proposal.memo`,
  so the link raises no prose-mentions warning.

## Unsettled: items the PR-record lane raised but no verifier ruled on

These come from L12's per-PR ledger, not its findings list. They are not findings and are not
counted as confirmed. Each says what would settle it.

- **U1. The whole-corpus refresh's delegated choices have no recorded owner confirmation.** PR #32
  carried a batch of delegated choices (collective satisfaction, prose ownership, separate rule and
  question namespaces, additive schema increments and others). The later confirmation row in the
  plan "Designs people can read, and an adopter at full speed" names two other plans only, and none
  of the five descriptions read confirms this batch. The law is carried and mostly ready, and later
  rulings narrowed some of it (MD-43, MD-44, MD-47). **Settles it:** the owner says whether the
  batch was reviewed; GitHub review comments on PR #32, not checked, may already show it. If it was
  not: a question on the cleanup Spec, for example
  `spec:protocol.delivery-record-cleanup#question.delegatedRulingsReview`, decider owner,
  provisional "the delegated choices of the whole-corpus refresh stand as carried", linking the
  carrying Specs named in the PR #32 ledger row of `pr-record.md`. If proposal change 4 has removed
  that Spec's `### Open questions`, the question restores the subsection.
- **U2. PR #35's "the Studio build computes a join" reads broader than the carrying law.** The page
  and reader boundary in `spec:consumers.spec-studio` and its data children is the law.
  **Settles it:** read the phrase against those Specs; if they disagree, the inventory's record
  note says the Spec wins. Not a Spec edit.

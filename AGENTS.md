# Libar Software Delivery Protocol

A **programmatic, AI-native software-delivery system**: model the *whole delivery lifecycle* as typed code in
the repo, derive **one graph** from it, and generate every other artifact off that graph. A deliberate second
take on `@libar-dev/architect` — a year of design thinking front-loaded, **zero back-compat, zero old sins
carried over**.

There is no separate PRD — the product's own thesis (*the spec is the prompt is the design*)
applies to itself. This repo **self-hosts**: it authors its own Specs in its own carrier (the
`.sdp.md` corpus under `specs/`), derives its own graph, and validates itself in CI — the
Protocol's first production corpus is the Protocol. The ratified ubiquitous language
(`CONTEXT.md`) and the JTBD stories carry the vocabulary and the jobs; the engine lives under
`src/`; the surviving concept docs hold the principle-led design that has not yet dissolved into
carrying Specs. **Intended truth** (authored Specs, ratified decisions, concept material) is
authoritative for what the Protocol claims; **`src/` and tests** are authoritative evidence of
current realization. A disagreement is **drift to resolve**, never permission to silently promote
code behavior into intent.

> **Next work** is read from the graph: run the roadmap, recipe 53, over `pack:roadmap`
> (`pnpm --silent sdp:q "$(cat dist/recipes/53-the-roadmap.js)" --params '{"pack":"pack:roadmap"}'`),
> follow each entry to its Packs and carrying Specs, and read the open arc's draft pull request for
> its record. `plans/` and `reviews/` are frozen history of earlier arcs until a cleanup arc
> removes or archives them; nothing is added to either. Corpus counts, readiness, and findings are
> **derived, never quoted** — re-run
> `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
> and read recipes 8 and 11. Recipe 1 is the operational backlog, not the census. Never invoke a bare `sdp`.

## The frame

An **executable, self-validating meta-model of the software-delivery process**, on three clean levels:
**protocol** (the primitive, descriptors, relations, validators *as typed code* — **Phase 0**) → **authored model**
(a project's instances, which **conform** — checked, never workflow-gated) → **derived facts** (machine truth,
never authored).

Two permanent honesty guardrails: checks police **conformance & honesty**, never content-quality and never
workflow; and we claim **"deterministically validated," never "provably correct."**

## The model in one breath

One authored **truth-primitive — `Spec`** — enriched in place (never migrated to a new artifact type), positioned
by **three descriptors**: `kind` (a *true subtype*; 8 values) × `altitude` (`epic → feature → story`) × `readiness`
(`idea → scoped → defined → ready`). Familiar delivery nouns (Use Case / NFR / Decision Record / Contract; Epic /
Feature / Story) are **named coordinates on the one primitive, not separate types**. Two more authored things state
**no system truth**: the **`Pack`** (the grouping / review aggregate) and the in-code **`anchor`** (a binding —
identity only, never intent). **Delivery facts** (`implemented` / `has-verifier` / `observed`) are **derived, never
authored**. An **`extractor`** derives **one regenerable graph** (the sole read model); CI runs **conformance +
honesty checks**; the **`claim`** taxonomy (`declared` / `anchored` / `inferred`) is never collapsed; **git is the
event log**. Coding agents **script the typed graph** (the **agent surface** — no verb wall); edits flow
**intent → agent → git → conformance checks** (no patch loop).

## Where to look

Progressive disclosure — start at the top, follow the pointers down.

| Look here | What you get | Read |
|---|---|---|
| `CONTEXT.md` (repo root) | **the vocabulary** — the ratified lean glossary (terms · relations · a worked dialogue · flagged ambiguities); sole source of truth for terminology; the model exposition lives in the Specs under `specs/` and in the surviving concept docs | **first, always** |
| `.agents/skills/` + `docs/agent-surface/recipes.md` | **the agent on-ramps** — five repository-owned skills: `sdp-agent-surface` (reading the graph), `sdp-authoring` (authoring intent), `sdp-sessions` (advisory delivery-session routing), `sdp-studio` (publishing, sharing and reading the Studio), `sdp-vault` (keeping the Obsidian vault), also exposed to Claude through the `.claude/skills` symlink; plus the catalog of runnable `sdp q` bodies | **mandatory** — after `CONTEXT.md`, load the matching skill before any corpus question, Spec authoring, delivery-session routing, Studio publishing or reading, or vault work; see "Query the graph first" |
| `specs/` | **the self-hosted corpus** — the Protocol's own Specs in its own carrier (families: `model` · `extraction` · `validation` · `carrier` · `consumers` · `protocol` · `observation` · `decisions`, plus Pack manifests for self-hosting and grouped design work); the primary carrier of intended truth | when design truth is in question — but query it through `sdp q` first, then read the carrying Spec |
| `jtbd-stories/` | **the jobs (functional spec)** — stable `When / I want / so I can` stories (themes A–H); no personas, because consumers are heterogeneous (humans, CI, CLIs, **AI agents**) | to know *what* we serve |
| `docs/concept/` (+ README) | **the technical design** — the surviving principle-led docs: vision & MVP boundary, founding principles (P1–P10), authoring & binding, the consumer pointers and discipline mapping (06), and the MVP acceptance of record (07); the core model, the one graph, validation & honesty and the consumer law dissolved into the `model.*`, `extraction.*`, `validation.*` and `consumers.*` Spec families; the historical MVP slice record lives in the slice-5 plan under `plans/` and in `examples/checkout-v1`, while forward roadmap intent lives in capture Specs — locate any of them with concept search (recipe 6) | to know *how* it is designed |
| `docs/concept/DECISIONS.md` | **the lean decision registry** — ratified names, one-line glosses, carrying Specs, and the D1–D6 lookup; historical rationale lives in git, plans, and the Specs themselves | when resolving a decision name or following its canonical pointer |
| `src/` | **the engine** — `model` (Spec/descriptors/pack/anchors) · `extract` · `graph` · `validate` · `reader` (agent surface) · `projections` (Design Review, census, Mermaid, Gherkin and Studio) · `cli` (`sdp build` · `validate` · `view` · `census` · `mermaid` · `gherkin` · `studio` · `vault` · `stamp` · `generate` · `import` · `new spec` · `q`) · `import` (carrier conversion and import analysis) · `testing` (the registrar runtime exported through `./testing`) · `runner` / `codegen` / `notation` / `adapters` | when implementing or verifying **current engine** behavior |
| `examples/checkout-v1` | **the worked MVP example** (Markdown carriers; originally the TS DSL tracer bullet) — specs, anchors, untracked `generated/` (regenerated in-pipeline); walkthrough in its README | when proving the loop end-to-end |
| `explorations/` | **evidence only** (carrier exhibits, executable-example findings) — mapping evidence for design; **never promote spike code into product** | when judging design evidence; not a source tree to ship |
| `docs/lineage/` | restored historical design documents — the v0 concept set, verbatim with lineage headers; evidence for design reviews, never intended truth | when a review needs superseded design on the table rather than in git history |
| `pack:roadmap` + recipe 53 | **the next work** — the owner's advisory priority over upcoming capabilities, each entry placed by the graph as to design, to state, to build or built; the open arc's record is its draft pull request | before writing code |
| `npm run check` | **the green gate** — `check:temporal` → `lint` → `format:check` → `build` → `generate:self-hosting` → `generate:example` → `typecheck` → `typecheck:examples` → `test` → `check:self-hosting-gates` → `check:self-hosting` → `check:example` → `preflight` | before claiming green / after engine edits |
| `plans/`, `reviews/` | **frozen history** of earlier arcs: plans, session reviews, prompts and assets; read for provenance; nothing is added | rarely |

Key decisions (names first): the executable meta-model (MD-1); one primitive named coordinates (MD-4); the carrier ruling (MD-18); the agent front door (MD-22); the shipped projections stay frozen (MD-32); planning truths live in ruled graph homes (MD-33); the comment form (MD-36); bindings are optional, plural, and may reference a design (MD-37); architectural significance is annotated where it is realized (MD-38).

> Concept docs still carry implementation detail (TS shapes, DSL, graph JSON) for **unsettled and
> post-MVP** design — on a disagreement with `src/`, the drift rule above applies: fix the stale
> side deliberately, never invent a third behavior. A clean concept/representation split remains
> a recorded future direction.

## Query the graph first

**The skills are mandatory on-ramps; the graph is the sole read model.** Before any corpus
question, load `.agents/skills/sdp-agent-surface/SKILL.md`. Before authoring or editing a carrier,
load `.agents/skills/sdp-authoring/SKILL.md`. Before routing delivery work, load
`.agents/skills/sdp-sessions/SKILL.md`. Before publishing or reading the Studio, or keeping the
vault, load `sdp-studio` or `sdp-vault`. The skills teach the workflow; the graph answers the
questions.

`sdp q` is the agent front door (MD-22): it derives the graph in process and evaluates a plain
JavaScript async-function body you supply, with five bindings injected — `g` (the reader),
`graph` (the raw schema), `report` (the validation report), `params` (the JSON a caller passes
with `--params`, `{}` without it), and `recipes(number, parameters?)` (a shipped body over the same
graph). `return` is the output contract; add `--json` for
machine-readable output. For any corpus question — what a Spec guarantees, what is
ready but unimplemented, what a change touches, where a concept lives — script the graph instead
of reading `.sdp.md` files by hand:

```bash
# The build backlog (recipe 1, condensed): ready implementation work, excluding examples and decisions
pnpm --silent sdp:q 'return g.specs().filter((s) => s.statedReadiness === "ready" && s.specKind !== "example" && s.specKind !== "decision" && !s.deliveryFacts.includes("implemented")).map((s) => s.id)'

# Concept search (recipe 6): where does a concept live?
pnpm --silent sdp:q "$(cat dist/recipes/06-where-is-this-concept.js)" --params '{"term":"readiness floor"}'
```

The full CLI surface is `sdp build · validate · view · census · mermaid · gherkin · studio · vault · stamp · generate · import · new spec · q`.
`sdp validate --watch` re-runs that same validate path on carrier create, change, delete, or rename
and stays alive after findings; operator stop exits 0. `validate --watch` cannot combine
with `--check-clean`. `sdp validate --rules PATH [--params FORM]...` runs an operator-selected corpus
rule, with each `--params` after its own `--rules`, corpus findings and failed files reported apart
from Protocol findings, and rules reread on each watch cycle. The five projection publishers remain
independent public verbs; `sdp generate` publishes all five roots from one validated graph, synchronizing the vault first and leaving it alone under `--check-clean`. Repository
generation/check scripts certify all five roots through the private projection-suite driver. The
Studio also takes `--base PATH` with optional `--base-label TEXT`, repeatable `--runs PATH` for
CTRF evidence, and `--watch` for carrier changes, with no server; source and input edits start no
Studio cycle. Keep a base graph outside `generated/`. `sdp stamp` writes publishing metadata after
the build. `sdp vault --out DIR` synchronizes linked notes in its owned `sdp/` folder, and its
`--watch` follows carriers and source anchors. The vault stays outside the five rewritten roots.
The upgrade guide is `docs/agent-surface/upgrade-guide.md`. The
runnable recipe bodies live in `docs/agent-surface/recipes.md` (each executed as written by
`test/recipes.test.ts`), and the repository-owned skills (`sdp-agent-surface` for reading,
`sdp-authoring` for writing intent, `sdp-sessions` for advisory work-shape routing, `sdp-studio`
for the Studio, `sdp-vault` for the vault) are the on-ramps. In this checkout, always go through
`pnpm --silent sdp:q '<body>'` — `pnpm exec` cannot resolve the package's own bin.

## The build path

The MVP proved the founding principle on **one** bounded context — Order Management,
`pack:checkout-v1` — built as thin **end-to-end slices on the Phase 0 foundation**; the worked
example lives at `examples/checkout-v1` (documented walkthrough in its README). **Slices 0–5 are
complete** — the per-slice record is plan 10. Live work is read from the
roadmap, recipe 53 over `pack:roadmap` — run it before writing code.

> **Tracer-bullet discipline.** Author the example specs and anchored code *first*, so the carrier and extractor are
> forced to be usable before they are finished. If the example stops extracting or validating, fix the carrier or extractor — not the example.

## Two reading conventions

Every doc honours both — never mistake one half for the other:

- **Principle vs Representation** — a *Principle* is a law the design stands or falls on; a *Representation* is one
  chosen mechanism among several.
- **CORE / MVP vs ASPIRATIONAL** — in the first buildable slice, or designed-for-and-deferred (named so the model
  never paints itself into a corner).

## The bets (why this shape)

- **Shared language is a performance feature.** A ratified ubiquitous language measurably leans out reasoning and
  lifts quality — solo and subagent work, not just human↔agent chat. Terminology rigor *is* throughput.
- **The spec is the prompt is the design.** One language spans intent → spec → design → code; you *enrich the same
  typed `Spec`* until it is implementable. Implementation becomes near-autopilot ("implement `spec:…`"); the real,
  iterative work is maturing and **reviewing** specs — alone and in related sets (the `Pack` / **Design Review**).
- **Maturity gates implementation; the graph is AI-native.** Don't ship code before a spec is `ready` —
  `implemented ∧ ¬ready` is the **drift alarm**; ready unimplemented examples and decisions are
  audited exclusions from the operational build backlog under the example realization posture
  (MD-24) and decision readiness posture (MD-26). A typed graph of related specs is the shape an
  LLM already reasons in: feed the agent the graph, don't narrate at it.

## Working discipline

- **Skills first, graph second, files last.** Load the matching skill before the work starts; then
  query the graph (`pnpm --silent sdp:q` with a recipe body); then read the carrying Spec it points
  at. Scanning `specs/` files to learn state is a smell — the graph is derived from the same
  carrier and is always current.
- **Write lean, and write for outsiders.** Cut unnecessary verbosity and noise in every session
  artifact — plans, records, summaries, spec prose. Use technical but plain language a wider
  open-source audience can follow: the ratified terms are the shared vocabulary, not a license
  for dense insider prose.
- **Terminology is ratified, not provisional.** Use the exact terms in the language base; flag, don't silently
  invent, new ones. The docs speak the ratified language end-to-end — a residual pre-ratification term
  (`abstraction`, `provenance` for a claim, `marker` for an anchor, `facet`, "two axes", the old readiness
  ladder) is a **bug to fix against the base**, not current usage.
- **DECISIONS.md admits sparingly, and reads by name.** An entry must pass the ADR three-part test — *hard to
  reverse · surprising without context · a real trade-off*. If the "Why" says the base already forced the
  answer, it's drift repair, not a decision — its paper trail is git and the pull request description. Authoring
  guidance only, never a validator (checks police conformance and honesty, never content-quality). In prose,
  lead with meaning: "the typing law (MD-11)," never bare MD-n (the registry at the top of `DECISIONS.md`
  holds the ratified names).
- **Decision-spec pointers lead with names.** See [the plain-language references decision](specs/decisions/plain-language-references.sdp.md)
  (`spec:decisions.plain-language-references`) and [the concept-documents dissolution decision](specs/decisions/concept-docs-dissolve.sdp.md)
  (`spec:decisions.concept-docs-dissolve`).
- **Naming is resolved — use these names.** Product **Libar Software Delivery Protocol** (short form "the
  Protocol"); CLI **`sdp`**; npm **`@libar-dev/software-delivery-protocol`** (single package); repo
  `libar-dev/software-delivery-protocol`. Namespaces: `@libar-dev/` (OSS) vs `@libar-ai/` (commercial).
- **Design vs execution.** Distinguish design work (Specs, decisions, open questions) from execution
  (code, tests, docs). A design session edits carriers and leaves the code its Specs will change alone.
- **Lineage is evidence, not template.** Prior art **`@libar-dev/architect`** (local clone when
  present, e.g. a sibling `architect` checkout) taught us the problem in production — source-first
  annotations, one graph as the read model, a scriptable graph handle (the direct ancestor of
  `sdp q`). Its old sins — a sprawling authored tag registry, workflow gates on the lifecycle,
  hand-authored delivery status — are what this design deliberately rejects. Treat its *shape*
  as evidence about the problem, never as the answer.
- **A "verified" row is re-measured, never inherited.** A docket or ledger row claiming *fixed* or *verified*
  is re-checked against the tree at the moment of verification, never trusted from the row that closed it —
  the phase-4 close caught a "verified — intact" row that had been false since the commit after the one it cited.
- **`.omo/` belongs to OmO.** It is the oh-my-openagent harness's state, and only OmO sessions read or
  write it, under OmO's own protocol. Every other agent leaves it alone: it adds no plan, draft or evidence
  there and never deletes, prunes or overwrites what is there. A Claude session keeps its working material
  in its own scratchpad.
- **Tests are the evidence.** A change proves itself with a test that fails without it; recipes
  re-derive corpus state. Acceptance links bound examples and run evidence at the measured commit
  with the commands, never an inherited verdict. A run's commit must match a preview's stamp to
  evidence it; a preview remains a current view. Evidence no test or recipe carries is committed
  on the arc's branch with its commands, linked from the description at that commit, and removed
  before merge. The Protocol merges its pull requests with merge commits, and GitHub keeps each
  pull request's head ref, so links at the evidence commit keep resolving. A squash or rebase merge
  would need the evidence published to a durable ref first.
- **Commits are recovery boundaries, not workflow gates.** The owner's instruction that opens an
  arc authorizes commits and its push; the convention creates no authority. The first commit message
  states the owner's working rules, base and arc's Pack. Open the draft pull request at the first coherent commit,
  normally the scaffold, and repeat those rules there with the branch, base, lanes and rulings.
  Without such an instruction, ask before committing. Commit each coherent unit after its gate;
  never force one per todo, create empty commits, absorb unrelated or pre-existing changes, or
  commit from an unsafe dirty baseline. If a session must stop without a clean boundary, commit
  its work in progress saying what is incomplete. Resume from
  the branch, commits, draft description and graph; git cannot recover uncommitted work.
  Outstanding work is read from the arc's Pack, backlogs and open-question register.
  Push only on the user's explicit request; never use `git stash`.
- **Reviews travel as proposals.** Findings against Specs form one change proposal
  (`schemas/sdp-proposal-1.schema.json`), based on the branch-head commit the reviewer read;
  a proposal composed in a preview names the preview's merge commit from its stamp. Check it with
  recipe 38 against that base, read moved, unresolved or incomparable scopes again, and post
  recipe 49's memo to the pull request.
  Findings against code or other files are pull request comments on their lines; a review proposing no Spec edit
  has no proposal. An open design finding becomes an open question with `decider`, `provisional`
  and `links`; a deferral adds its blocking question's `trigger`. A code defect against settled
  intent stays a code finding. An applying commit carries the proposal's reason line and base;
  acceptance stays in git and the discussion. Briefs and prompts stay in the session.
- **Unreleased OmO installs are user-controlled.** The user switches the official
  `~/dev-admin/oh-my-openagent` clone to `dev` when needed and owns `~/.omo/omo.jsonc`. Agents may inspect and
  report that state, but must not checkout, pull, build, globally install, or edit the OmO configuration unless
  the user explicitly requests that action.

## PR descriptions as durable context

PR descriptions are the project's durable narrative record. Sessions return to them long after
merge, for planning as much as for history, so write for the reader who arrives in six months with
no context. Length follows use: a long description is fine when every section answers a question
that reader brings. The standard, set by PR #19 (the universal-Spec arc) building on PRs #10 and
#16, and extended by PR #31 (human views, ruling tables, the next PR's lanes):

- **Story before inventory.** Lead with what the PR introduces and why: the questions it answers,
  the arc it closes, the capability it delivers. What-changed lists and review-closure details are
  evidence, never the headline; a description written during a review session must still be
  re-anchored on the full scope before publication.
- **Present new things, don't just name them.** Each new surface gets a short explanation of the
  idea and a linked representative artifact on the branch: a carrying Spec, a worked example, a
  Pack. One stop per surface, tour-style.
- **Show it to a person.** Prose, rendered tables and screenshots are welcome. When the PR moves a
  human view, such as a Design Review page, show it at the arc's base and at the head. Render a
  recipe's answer as a short table rather than pasting JSON, and say plainly what no human view
  shows yet. `gh` cannot attach images, so commit them on the arc's branch with a
  short README naming the commands, pin links to that commit, and remove them before merge.
- **Self-hosted and graph-measured.** The arc's intent is a Pack in the corpus: link it, and
  describe its state and its changes with the Protocol's own recipes, Pack design (29) and the
  design diff (35) from the arc's base among them. Check every claim about the Protocol's own
  corpus with a query before writing it.
- **Rulings are tables.** Ruling or ratified name, one line, carrying Spec link. Rulings the owner
  made sit in one table, and rulings delegated to an agent that await the owner's review sit in a
  second. Every registry row the PR adds appears.
- **Invite use.** A try-it block with real commands, re-run at the head before publishing, plus a
  feedback call naming the open questions the PR most wants pressure on.
- **Plan the next PR.** The forward section is recipe 55's memo over `pack:roadmap`, rendered at
  the head, with the owner's reason for each entry's priority, the re-entry condition and the
  durable refused list in the author's words around it. The pull request completing an entry's
  selected work removes it in the same change; entries join or move only on the owner's word.
- **Numbers are re-measured and marked.** Close measurements are re-derived at close and labeled
  as such ("re-run the recipes rather than inheriting these"), never quoted from an older record.
- **Audit, then publish.** Check the description against the arc's Pack, every ruling record the PR
  carries out, and the diff stat from the base, so each finished piece of work appears or is left
  out on purpose. Pin links and images to a commit so they outlive the branch (`blob/<sha>/…`,
  `raw.githubusercontent.com/<owner>/<repo>/<sha>/…`; a line anchor on a Markdown file needs
  `?plain=1#L…`), and confirm each linked path exists at that commit. Draft the body in your own
  working area; the published description is the record. When replacing the body, keep the sections
  Greptile and CodeRabbit append.

> `CLAUDE.md` is a symlink to `AGENTS.md` — **edit `AGENTS.md`.**

## Cursor Cloud specific instructions

This repo is a self-contained TypeScript CLI (`sdp`) — no servers, databases, or external services
to run. Development is terminal-driven. Node ≥ 20 (Node 22 is installed); dependencies install from
the committed `package-lock.json` (npm is the lockfile-native package manager; `pnpm` scripts also
work, but never a bare `sdp`).

`npm ci` builds the package through its `prepare` script. CI installs with `--ignore-scripts`
and builds in `npm run check`. `npm run check:git-install` checks installation from a commit.

Non-obvious gotcha: `npm test` refuses to run until the generated contracts exist and errors with
"Generated contracts required by the selected test suite are missing." Build and generate first:
`npm run build && npm run generate:self-hosting && npm run generate:example`, then `npm test`. The
documented green gate `npm run check` already sequences build → generate → typecheck → test →
self-hosting/example checks → preflight correctly, so prefer it after engine edits.

The `check:example` step reports 0 errors and 0 warnings. The unbound `defined` example stays
visible in the Design Review verifier bindings and recipe 10, declared versus enabled verifiers.

The `check:self-hosting` step emits two kinds of intentional warning: `honesty/gaps`, one per
owner-ratified ready Spec without a resolving verifier binding, and `conformance/prose-mentions`,
one per mentioning Spec and target pair with no declared relation either way (recipe 22 lists the
pairs). The self-hosting oracle pins both sets; they are expected, not a regression.

# 09 — Design method

This document describes how the long-running design project is done and judged: who reads, which
tasks they take, how prototypes are built over the graph, which corpora and states they run on, and
how findings reach engineering. It is design material that confers nothing on the corpus; where it
and a Spec disagree, the Spec wins.

**Every piece of design work is partly specified in graph queries.** A brief, a prototype, a task
given to a reader and a cycle record each carry the runnable `sdp:q` bodies or recipe calls that
define their scope and their evidence, beside the prose. Whoever picks the work up, a person or an
agent, starts from the graph rather than from a description of it, and a claim about the Protocol
carries the query that backs it. Briefs that name exact queries are followed; briefs that only say
"use the graph" are not ([07](07-graph-needs.md#agent-on-ramp-observations)).

## 1. Evaluation: readers, tasks, success, record

**Who reads.** A session names its reader by delivery role and situation, never by person. The
first cycles take the tier-1 delivery roles in [01](01-roles-and-perspectives.md), and the pull
request reviewer who holds only a link, the actor the Studio is written for
(`spec:consumers.spec-studio`). The other tiers, the non-human readers and the AI-assisted readings
in [05](05-specialised-and-ai-readings.md) join as the cycles reach them: tier 1 is a focus, not a
limit. A persona is a design-material word here (see the [README](README.md)). It is paired with job
stories (When / I want / so I can) for its jobs, because the
[job stories](../../jtbd-stories/README.md) deliberately bind to no persona.

Two kinds of reader take the same tasks:

- **Agent readers**, given a stamped link and no repository. They are cheap and repeatable, and
  they run across model families so that one model's habits do not pass for the design's. The
  precedent is the first adopter's feedback record (`libar-platform/docs/feedback/sdp-feedback-01.md`,
  which the Studio's manual verification cites): passes by agents from different model families
  took the same tasks against the same page, each task was scored full or partial, and the missing
  material was named. Those tasks became the Studio's manual acceptance tasks.
- **People**: the owner, people at the first adopter, and outside readers as the project finds
  them. Slower, and the only evidence of how a person reads.

**Which tasks.** Every cycle uses three task sets:

| Set | Source | What it asks |
|---|---|---|
| Studio acceptance | `spec:consumers.spec-studio`, manual verification | the first adopter's findability tasks over its history-view Pack; then naming what the owner can state first (owner queue), what changed since a base (diff page) and which components are designed but not built (architecture lens) |
| Article 2's design questions | [Article 2](../articles/02-one-graph-many-views.md#a-compact-brief-for-the-first-uxui-design-pass) | what a reviewer can do from a stamped link alone; the fastest route from "what changed?" to "is this design ready?" for one Pack; telling intent, code bindings, inferred structure and supplied runs apart; telling the kinds of absence apart; diagram or prose, and on a phone; gathering requests and knowing what goes to an agent; which pages solve real jobs |
| Delivery-role tasks | the first questions and task flows in [04](04-reading-model-and-ia.md) | one job story per task, with its acceptance. For example: "When a Pack is up for review, I want to see what stands before each member's stated next rung, so I can state `ready` or answer what holds it" |

Article 2 calls the Studio's tasks "specified acceptance criteria, not evidence that a person has
completed them". Sessions are how they become evidence.

**What counts as success.** Each task is scored per reader, never averaged into one score:

- **Outcome**: full, partial or failed, with the missing material named.
- **Route**: the pages, or the reader calls, in order. Route length matters most for "what
  changed?" to "is this design ready?".
- **Misreadings** of an honesty distinction, each one recorded: `has-verifier` read as tests
  passing, `implemented` read as live, stated readiness read as the floor reached, an `inferred`
  edge read as `declared`, a supplied run or base graph read as graph data, one kind of absence
  read as another. A reading succeeds with no misreadings, not with a shorter route.
- **Agreement**: what the reader took from a page equals the answer of the recipe the page names, at
  the same commit. A page computes nothing of its own (`spec:consumers.spec-studio#rule.noSecondGraph`),
  so a disagreement is either a misreading or a page defect, and both are findings.
- **Hand-off**: a change proposal composed during a task passes the proposal check (recipe 38)
  against its base.

The Studio's page elements load nothing at run time and request only the stamp
(`spec:consumers.spec-studio.page-elements#rule.noRequest`), and the composing panel sends its
intents nowhere (`spec:consumers.spec-studio.intent-panel#rule.noRequest`). The product reports
nothing about its readers, so every measure comes from sessions. For an AI step, the same task runs
with and without the step: that comparison is what the re-entry trigger of
`spec:consumers.ai-assisted-reading#question.aiPresentationBoundary` asks for ("the UX design pass
measures that assistant selection or a generated explanation helps a named review task").

**How a session is recorded.** One record per reader per session:

| Field | Content |
|---|---|
| Reader | delivery role and situation; an agent with its model family, or a person (by delivery role, never by name) |
| What was read | corpus and commit; the page set's stamp, or "no stamp" for a page opened through `file://` (`spec:consumers.spec-studio.shell#rule.stamp`); each named input and its commit |
| States | the cells of the table in section 4 the session ran in |
| Tasks | each task's wording, as given |
| Results | per task: outcome, route, misreadings, missing material |
| Follow-ups | a row in [07](07-graph-needs.md), a change proposal (section 6), or a design question in [06](06-design-cycles.md) |

A record is evidence no test or recipe carries. It is committed on the arc's branch with the
commands that made it, linked from the pull request description at that commit, and removed before
merge (`spec:protocol.roadmap-replaces-plans#rule.evidence`). The description carries the summary.

## 2. The baseline

The comparison point is [10 — Studio baseline](10-studio-baseline.md): today's Studio, recorded at a
pinned commit before any redesign. The first task run (cycle 0 in [06](06-design-cycles.md)) applies
section 1 to that pin, on the corpora and states in section 4. Every later prototype runs the same
tasks on the same corpora and states, and its arc's description shows its results beside the
baseline's. Moving the baseline to a new pin is a deliberate step, named in the description of the
arc that takes it; the earlier record stays reachable through its commit link.

## 3. Prototypes

A prototype is a reading composed over a real graph, never a mock-up with typed-in data.

- **Material.** An `sdp q` body, or a shipped recipe with its parameters, produces everything the
  prototype shows, and the prototype names those recipes. This mirrors the Studio's own law: a page
  shows a recipe's answer only when its Spec names that recipe
  (`spec:consumers.spec-studio#rule.recipeAnswers`).
- **Renderer.** A disposable script turns that output into the prototype and reads nothing else: no
  carrier, no source file. The vault exploration is the working shape, a dump body and a generator
  over its output, with a README naming the commit and saying nothing is ratified
  ([`explorations/obsidian-vault/`](../../explorations/obsidian-vault/README.md)).
- **Outside `generated/`.** Every build and publisher first removes the projection roots
  (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`), and a prototype must never be
  taken for a projection.
- **Gaps stay visible.** Material the graph lacks shows as a named absence, and a row lands in
  [07](07-graph-needs.md) with the query that shows the gap. A prototype never fills a gap by hand.
- **Fidelity, lowest first.** (a) Answer sheets: recipe output laid out as answer, evidence and
  source ([04](04-reading-model-and-ia.md)). (b) Obsidian Bases over the vault's notes: the vault
  keeps a Base a person changed (the vault-folder decision, MD-45), so an entry reading can be tried
  with no engine change. (c) Static HTML over a dump. All three stay at structure, with no visual
  style before the design system arrives. Each interaction pattern a prototype relies on is noted,
  so it can be checked against the custom-elements decision (MD-42).
- **Where it lives.** On the arc's branch as evidence, with its commands, removed before merge
  (`spec:protocol.roadmap-replaces-plans#rule.evidence`). `explorations/` holds evidence only, and
  its code is never promoted into the product. The vault exploration landed there in commit
  `1b014d01`; the decision that puts the roadmap and the pull request over plan and review files
  (MD-47) later refused keeping arc evidence in a committed folder on the main line. Whether any
  prototype earns a lasting place is the owner's question.

## 4. Test corpora and states

| Corpus | How to read it | Why it is in the set |
|---|---|---|
| The self-hosted corpus | `pnpm --silent sdp:q '<body>'` | large and skewed: examples are about half its Specs, constraint Specs are almost absent, and one Pack holds every Spec (re-derive with the query below) |
| The worked example, `examples/checkout-v1` | `pnpm --silent sdp q '<body>' --root examples/checkout-v1` | small, one bounded context, Specs on every readiness rung, its own roadmap Pack |
| The first adopter's corpus, at a pinned commit | its package runner, with `--root` and its own exclusions | an adopter's own corpus, and the one the Studio's acceptance tasks were written over |
| A small or deliberately awkward corpus | requested through [07](07-graph-needs.md#log) | states the others cannot supply |

```sh
# The self-hosted corpus by kind, and whether pack:self-hosting-v1 holds every Spec
pnpm --silent sdp:q 'const kinds = {}; for (const s of g.specs()) kinds[s.specKind] = (kinds[s.specKind] ?? 0) + 1; const everySpec = graph.nodes.find((n) => n.id === "pack:self-hosting-v1").members.length === g.specs().length; return { kinds, everySpec }'
# Packs whose members all state idea (add --root examples/checkout-v1 for the worked example)
pnpm --silent sdp:q 'return graph.nodes.filter((n) => n.nodeType === "Pack" && n.members.every((m) => g.specContext(m)?.statedReadiness === "idea")).map((n) => n.id)'
```

The states every reading must survive come from the Studio's law:

| State | Where the law or the query is |
|---|---|
| A stamped page set served over http or https | the stamp line (`spec:consumers.spec-studio.shell#ui.stampLine`) |
| A page opened through `file://`: no stamp, no requests | `spec:consumers.spec-studio.shell#rule.stamp`, `spec:consumers.spec-studio.page-elements#rule.noRequest` |
| No script | every page but search reads in full (`spec:consumers.spec-studio.shell#rule.withoutScript`) |
| Phone width | the same pages serve both widths (`spec:consumers.spec-studio.responsive`) |
| A base graph, run records, both, neither | the diff and runs pages appear only with their inputs, each named where it shows (`spec:consumers.spec-studio#rule.namedInputs`); keep a base graph outside `generated/` (`spec:consumers.spec-studio.data.inputs#rule.inputPlacement`) |
| `floor not evaluated` | `spec:consumers.spec-studio.shell#rule.rungBadge` |
| An idea-only Pack | the query above; neither corpus in this repository holds one today |
| A perspective that selects no member | its diagnostics in the perspective filter (recipe 37) |
| A Pack too large for one context bundle | read in parts (recipe 36) |
| Keyboard only, screen reader | section 9 |

Each brief and session record names the cells it was tried in. A cell no corpus can supply says so.

## 5. Design terms

[`CONTEXT.md`](../../CONTEXT.md) is binding, and the [README](README.md) keeps the provisional
words and their status. A new design word takes this path:

1. **Flagged where it first appears**, and added to the README's provisional table.
2. **Checked against the governing rubric** in `CONTEXT.md`: adopt the established delivery noun;
   coin a word only for a genuine differentiator, and then the word must name the difference;
   reject lifecycle gating; and pass both naming tests, carrying epistemic status where it matters
   and staying concrete for all three readers (typed code and the CLI, the coding agent, a Studio
   user).
3. **Checked for collisions** against the ratified terms and their aliases to avoid. Cases already
   found: bare "role" (the ratified anchor value), "lens" (the Studio's graph views, and an alias to
   avoid for perspective), "basis" (close to `base`, the base graph), "cycle" (this folder's
   stretch of design work, apart from a dependency cycle) and 07's "graph need" (apart from the
   *need* of a roadmap entry).
4. **Tried with readers.** A word a reader misunderstands is a misreading under section 1.
5. **Ruled by the owner.** A word that ships lands through a carrying Spec and a `CONTEXT.md` row,
   which is engineering-session work recorded in [07](07-graph-needs.md). `CONTEXT.md`'s "Flagged
   ambiguities" is where a candidate waits: "vault" and "term address" were flagged there in commit
   `1b014d01` and resolved later. It still holds one item for this project: a friendlier
   Studio-facing name for the "epistemic boundary".

## 6. Hand-off to engineering

AGENTS.md counts Specs, decisions and open questions as design work. In this project an engineering
session makes those carrier edits: the sessions that write this material leave every graph input
alone and hand their findings over in these forms.

| Finding | Form | Who acts |
|---|---|---|
| Material the graph lacks | a row in [07](07-graph-needs.md), with the query that shows the gap | an engineering session and the owner |
| A change to an existing Spec or entry, such as what a `ready` Studio page shows | one change proposal per review, in the shape of `schemas/sdp-proposal-1.schema.json`, based on the commit the reviewer read; checked with the proposal check (recipe 38) against the graph at that commit; rendered with the proposal memo (recipe 49) and posted to the pull request | an engineering session applies it, and the applying commit carries the proposal's reason line and base |
| A design question left open | a question in [06](06-design-cycles.md) for now; with a corpus home (section 8), a keyed open question with `decider`, `provisional` and `links`, and a `trigger` on a deferral (`spec:protocol.roadmap-replaces-plans#rule.openFindings`) | the owner rules; an engineering session writes it |
| A reading that needs a new carrying Spec | a request in [07](07-graph-needs.md), or the corpus home in section 8 | an engineering session, on the owner's word |
| Drift between a Spec and its code, or between a concept document and the graph | recorded in the document that found it ([10](10-studio-baseline.md), [11](11-rup-roles-and-artifacts.md)) and raised as a pull-request comment on the lines; a code defect against settled intent stays a code finding | an engineering session |

- Before proposing a change to a Spec others rest on, run design-change impact (recipe 30) over it.
- A proposal scopes Spec ids and entry addresses only. A finding that changes no Spec is not
  dressed as one.
- A brief names the recipes its reading shows. A new recipe also needs a catalog entry in
  [`docs/agent-surface/recipes.md`](../agent-surface/recipes.md), whose bodies a test runs as
  written.
- Briefs and prompts stay in the session that used them (AGENTS.md). What lasts is the arc's
  evidence, its description, the rows in 07 and the proposals.
- The path from a brief to a `ready` Spec is in [06](06-design-cycles.md#how-design-outputs-become-product).

```sh
pnpm --silent sdp:q "$(cat dist/recipes/30-design-change-impact.js)" --params '{"specs":["spec:consumers.spec-studio.index-page"]}' --json
pnpm --silent sdp:q "$(cat dist/recipes/38-the-proposal-check.js)" --params proposal=@proposal.json --params base=@base-graph.json --json
pnpm --silent sdp:q "$(cat dist/recipes/49-the-proposal-memo.js)" --params proposal=@proposal.json --json
```

## 7. Opening and closing a cycle

A cycle runs as one or more arcs. This section restates what AGENTS.md says about an arc:

- **Opening.** The owner's instruction opens an arc and authorizes its commits and push; without
  it, ask before committing. The first commit message states the owner's working rules, the base
  and the arc's Pack. The draft pull request opens at the first coherent commit, normally the
  scaffold, and repeats those rules with the branch, base, lanes and rulings. It is the arc's
  record.
- **Working.** Commits are recovery boundaries, not workflow gates: commit each coherent unit after
  its gate, and if a session must stop without a clean boundary, commit the work in progress saying
  what is incomplete. A session resumes from the branch, its commits, the draft description and the
  graph. Push only on the owner's explicit request; never use `git stash`.
- **Evidence.** Evidence no test or recipe carries is committed on the branch with its commands,
  linked from the description at that commit, and removed before merge. Images, which `gh` cannot
  attach, go on the branch with a short README naming the commands.
- **The description.** The story first, change lists after; a human view the arc moves shown at
  base and head;
  rulings in two tables, those the owner made and those delegated awaiting the owner's review;
  numbers re-measured at close and marked; a try-it block; and a forward section that is recipe 55's
  memo over `pack:roadmap`. The arc's intent is a Pack in the corpus, described with Pack design
  (recipe 29) and the design diff (recipe 35) from the arc's base.
- **The roadmap.** Entries join or move only on the owner's word.

This method adds two rules. A cycle closes on evidence, when its named tasks have recorded outcomes
on its named corpora and states, compared with the baseline; it never closes on a date. Until the
corpus home in section 8 exists, a design arc links and measures the Packs it reads, such as
`pack:spec-studio-v1`, and the design project never adds itself to the roadmap.

## 8. Proposal: a corpus home for the design project

A design Pack of `idea` captures, holding [06](06-design-cycles.md)'s long-horizon questions as keyed
open questions, is a proposal for an engineering session and the owner, not done and not something
a design session does; [07](07-graph-needs.md#a-corpus-home-for-these-needs-a-proposal) sets it out
with the case for and against.

## 9. Accessibility baseline

The baseline is Studio law already stated `ready` and implemented. Its verifier bindings say a
binding exists, not that an accessibility audit passed.

| Need | Law |
|---|---|
| Keyboard | every link and control reachable in reading order, with focus shown (`spec:consumers.spec-studio.shell#rule.keyboard`); every control an element adds is a native button, link, select or input with a text label (`spec:consumers.spec-studio.page-elements#rule.nativeControls`); every page opens with a link that skips to the canvas (`spec:consumers.spec-studio.shell`) |
| Color | every meaning a color conveys is also in words (`spec:consumers.spec-studio.shell#rule.wordsBesideColor`); rung badges from a palette that stays distinct under color blindness (`spec:consumers.spec-studio.shell#rule.rungBadge`); the current page marked by `aria-current` and an underline (`spec:consumers.spec-studio.navigation#rule.currentPage`) |
| No script | every page but search reads in full (`spec:consumers.spec-studio.shell#rule.withoutScript`) |
| Reading width | prose no wider than about 80 characters; a wide table scrolls in its own box (`spec:consumers.spec-studio.shell#rule.lineLength`) |
| Diagrams | a text equivalent after each, named by the SVG as its description (`spec:consumers.spec-studio.diagrams#rule.textEquivalent`); a keyboard-accessible scroll region (`spec:consumers.spec-studio.diagrams#rule.panZoomOnly`) |
| Changes on screen | an element that changes what a page shows says so in a polite live region (`spec:consumers.spec-studio.page-elements#rule.liveCounts`) |
| Phone | the same pages serve a desktop and a phone (`spec:consumers.spec-studio.responsive`) |

Sessions add keyboard-only, no-script, phone-width and screen-reader passes (section 4). No
automated accessibility audit of the generated pages runs today, and no Spec names a conformance
target: concept search (recipe 6) finds nothing for "WCAG". Which target applies, WCAG 2.2 AA being
one candidate, is a long-horizon question in [06](06-design-cycles.md), answered with the design
system. An automated audit, if one is added, is an engine test and never a corpus validator: checks
police conformance and honesty, never design quality.

## Open method questions

These are worked through over the cycles, not settled up front:

- Do agent readers' results predict people's on the same tasks?
- Do the delivery-role tasks become job stories in [`jtbd-stories/`](../../jtbd-stories/README.md),
  or stay design material?
- How are outside readers found, and recorded by delivery role without exposing who they are?
- Does any prototype earn a lasting home after its arc?

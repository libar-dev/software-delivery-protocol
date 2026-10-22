# Plan 47 design wave: what every lane shares

You run one design lane of plan 47 of the Libar Software Delivery Protocol. Design only: no build.

## Where you work

- Your lane has its own git worktree and branch (named in your lane brief), cut from
  `feature/roadmap-and-slices-v0` after the arc's capture commit. Work only inside it, with
  absolute paths. Dependencies are installed and `dist/` is built there.
- Never push, never `git stash`, never touch `.omo/`, never merge. Commit your work on your lane
  branch when it validates, with a plain message that says what the lane designed.
- libar-platform is read-only. A copy of its branch `sdp/design-at-scale` at `b038bd4` is at
  `/tmp/plan47-platform`. Never edit that copy: if you need to try an edit (an epic, a roadmap Pack),
  copy it first to `/tmp/plan47-platform-<your lane letter>` and edit the copy. Never edit
  `~/dev-libar/libar-platform`. Read it with this branch's engine:
  `node <worktree>/dist/cli/sdp.js q --root /tmp/plan47-platform '<body>' --json`.
- The Architect lineage (`@libar-dev/architect`, the predecessor) is checked out read-only at
  `~/dev-libar/architect`; `docs/lineage/` holds the v0 design. Both are evidence, never templates.

## Read first

`AGENTS.md` (the handbook) and `CONTEXT.md` (the ratified vocabulary). Then load the skills under
`.agents/skills/` before the work they cover: `sdp-sessions` (you are in its Design shape),
`sdp-agent-surface` (reading the graph), `sdp-authoring` (writing Specs), and `sdp-studio` for
Studio work. Query the graph before reading carriers:
`node ./dist/cli/sdp.js q --exclude explorations --exclude examples --exclude test/fixtures/import/parity '<body>' --json`
from the worktree root (`pnpm --silent sdp:q` is the same wrapper). Never run a bare `sdp`.

The arc: `plans/47-roadmaps-capability-maps-and-slices.md` (a thin pointer) and the Pack
`pack:roadmaps-and-slices-v1` (`specs/roadmaps-and-slices.pack.sdp.md`), whose captures are at
`idea`. PR 35's description is the forward record of where things stand: `gh pr view 35`.

## What the owner asked for (verbatim where quoted)

1. Epics: "Filtering only shows one epic, so we should organize features in epics." The
   Protocol's corpus has 1 epic, 106 features and 298 stories; the platform 1 epic, 58 features.
   The glossary's Capability Map is designed and never built.
2. Roadmap and priority: "Prioritize upcoming features, like a roadmap, tied directly to our PR
   descriptions: things to design, and a prioritized list of things to implement." The planning
   truths decision (MD-33, `spec:decisions.planning-truths-placement`) refuses recorded work order
   as graph structure; `spec:consumers.projections-model.roadmap-views` waits for a named reader.
   The owner is that reader now.
3. Diagrams and annotations: "Architecture views are an amazing addition, but we don't leverage
   many Mermaid diagram types. Probably tied to a deep review of missing annotations for
   architecturally significant patterns and abstractions, and the relationships between them."
   Also: the architecture diagram's labels are too small at desktop width unless zoomed, and the
   maturity map reads as a long list rather than a picture.
4. Slices: "Gen 1 prepared architecturally significant views and architectural slices for
   reviewing the design of upcoming features and feature Packs: features related so that we must
   review them as a whole. A key strength for iterative development: rounds of design and
   refinement with gradually increasing detail, within rational limits, since some decisions
   belong to implementation."
5. Self-hosting: "Can we replace plans with actual Specs: no prose in the plan, but designed,
   grouped, prioritized roadmaps and sets of features or epics?"

And the owner's direction for this arc:

- "Set a solid example of all of these aspects." The roadmap is an example, not an inventory:
  "You should not cover every single feature in the roadmap. For roadmap items, like those to
  design, iterate on, and execute/implement for ones which are ready, we should have enough work
  for some amount of upcoming PRs. Iteratively constantly update."
- The annotation review needs "as comprehensive an approach as possible", "making sure we cover
  architecturally significant patterns and abstractions and not everything. Everything would be
  noise and everything would be something that would be auto-generated. The idea is to have
  curated lists, which are needed for design and development of the project."

## Lanes and who owns what

| Lane | Owns (edit only these Specs and new children of them) | Pre-assigned |
| --- | --- | --- |
| A annotations | `spec:protocol.significant-units-review`, `spec:protocol.role-vocabulary`; the review record `reviews/plan47-annotation-review.md` | none |
| E epics | `spec:consumers.capability-map`, `spec:consumers.spec-studio.capability-map-page`, `spec:protocol.capability-epics`, and the epic Specs and `refines` changes it authors | recipe 52, the capability map |
| G diagrams | `spec:consumers.spec-studio.diagram-kinds` and its children; proposals for `spec:consumers.spec-studio.diagrams` and `spec:consumers.spec-studio.pack-page.maturity-map` | none |
| S slices | `spec:consumers.design-slice`, `spec:consumers.spec-studio.slice-page` | recipe 54, the design slice |
| R roadmap and plans | `spec:decisions.roadmap-priority`, `spec:consumers.roadmap`, `spec:consumers.spec-studio.roadmap-page`, `spec:consumers.roadmap.memo`, `spec:decisions.roadmap-over-plans`, `spec:protocol.roadmap-replaces-plans`, `spec:consumers.projections-model.roadmap-views`, `spec:consumers.spec-studio.cited-line-text`, `spec:consumers.spec-studio.register-input`, and a new roadmap Pack | recipe 53, the roadmap; recipe 55, the roadmap memo |

Another lane's work: refer to it through `spec:consumers.spec-studio.diagram-kinds` (G's drawings),
`spec:consumers.capability-map` (E), `spec:consumers.design-slice` (S) and `spec:consumers.roadmap`
(R); these ids exist now. Say in your report what you need from another lane.

## Rules of the design

- Graph first, carriers second. Write lean, plain language a wider open-source audience follows,
  in the ratified terms of `CONTEXT.md`; flag a new term rather than inventing it silently.
- Honest rungs. A lane may take its Specs up to `defined` where the floor allows (recipe 9).
  Never state `ready`: the executing thread proposes `ready` statements after the reviews.
  Decision Specs stay below `ready`: ratification is the owner's.
- A ruling you make is delegated: record it in its carrying Spec, and list it in your report with
  its carrying entry. A choice that is the owner's (a new decision record, priority in the graph,
  retiring plans) stays open as a decision Spec with options and a recommendation.
- Checks police conformance and honesty, never content quality and never workflow. Refuse any
  design that gates, schedules, dates, or scores work, authors a delivery fact, or infers
  intent from prose, paths or imports.
- No count, date, plan number, session or wave token in a Spec (`check:temporal` bans dates and
  `plans/<n>` outside `plans/` and `reviews/`).
- A `spec:` id written in Spec prose or a question's `links:` is a checked mention: it needs a
  declared relation in one direction, or it becomes a warning the self-hosting oracle rejects.
  Your lane must add no warning.
- Validate before you commit, from the worktree root:
  `node ./dist/cli/sdp.js validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
  must report 0 errors and exactly the one existing warning (`honesty/gaps` on
  `spec:model.spec-sections`).
- Do not edit: `src/`, `test/` (the self-hosting oracle is updated at integration), any Pack
  manifest (list the new Spec ids you want in `pack:roadmaps-and-slices-v1` in your report, in
  reading order; lane R authors its new roadmap Pack), `CONTEXT.md`, `docs/concept/DECISIONS.md`,
  `AGENTS.md`, `.agents/skills/`, `docs/agent-surface/`. Propose each such edit in your report as
  exact text.
- A recipe you design is a set of keyed Design entries naming its parameters and answer shape, as
  `spec:consumers.readiness-planner` and `spec:model.planned-architecture` do. You may draft its
  body in your prototype folder.

## Prototypes

Prototype every new page or drawing you design on two corpora, the Protocol's own (your worktree)
and the platform copy, so the owner sees it before any build. A prototype is throwaway evidence,
never product code:

- Put it under `reviews/assets/plan47-prototypes/<lane letter>-<short name>/`: the script (`.mjs`)
  that reads the graph through `sdp q` (or the reader) and writes static HTML, the HTML it wrote
  for each corpus, screenshots, and a `README.md` naming the commands and the commit.
- A prototype file never contains an `@sdp` tag or imports an anchor builder, and is never named
  `*.sdp.md` or `*.sdp.gherkin` (the extractor would read it).
- Match the Studio's look: link `generated/spec-studio/assets/*.css` or copy its rules; a prototype
  page should read like a page the Studio could ship.
- Screenshots: `node /tmp/plan47-tools/capture.mjs <url> <out.png> [width] [height] [fullPage 0|1] [cssSelectorToScrollTo]`
  drives headless Chrome with an exact CSS viewport; `file:///abs/path.html` URLs work. Capture at
  1440 wide (and 390 for a page you expect on a phone). Look at your screenshots with your image
  reader and fix what reads badly before you report.
- The current Studio of the Protocol's corpus is served at `http://127.0.0.1:8471/` (built at the
  arc's base) and is in `generated/spec-studio/` after `npm run generate:self-hosting` in your
  worktree. Build the platform copy's Studio with
  `node <worktree>/dist/cli/sdp.js studio /tmp/plan47-platform` into a copy if you need it (it writes
  `generated/` under the root it reads, so copy the platform first).

## Your report

Write your final report to `/tmp/plan47-reports/<lane letter>-<step>.md` (the step is named in your
lane brief) and return the same text as your final answer. Lead with the outcome, then:

1. Specs created or changed, each with its stated rung and the floor recipe 9 reports.
2. Rulings you made on delegation: ruling, one line, carrying entry.
3. Decisions for the owner: the question, the options, your recommendation and your confidence.
4. Prototypes: paths of scripts, HTML and screenshots, with one line on what each shows.
5. Proposed edits to files you may not edit (exact text, with the file and the place).
6. What the build needs: files, recipes, tests, and the order of the work.
7. What you added to, dropped from or reshaped in your brief, and why.
8. Risks and open questions.
9. The commit you left on your lane branch.

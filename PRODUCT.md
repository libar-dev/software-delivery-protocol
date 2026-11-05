# Product

<!-- impeccable:product-schema 1 -->

> The product brief for design work on the Libar Software Delivery Protocol's human-facing readings: users,
> jobs, positioning and constraints, with no visual decisions. It is not a requirements document and confers
> nothing. Intended truth lives in the carrying Specs, and on any conflict they and the ratified language in
> [`CONTEXT.md`](CONTEXT.md) win. Design words used here, such as _reading_, _delivery role_ and _persona_, are
> provisional and listed in [`docs/design/`](docs/design/README.md). Corpus counts are derived, never quoted.

## Platform

web

The open-source Studio is a static HTML page set, deterministic for one graph and its named inputs, and
stamped when it is published. A commercial Studio is under exploratory consideration as a desktop app, a web
app and a CI/CD surface (see Capabilities and Constraints); all three are assumed to be built on web
technology, which is why the platform stays `web`.

## Users

The design work serves **typical software delivery roles**: the people whose work the classic Rational Unified
Process disciplines describe. The Protocol maps those disciplines onto its graph as filters by kind or section,
never as roles or phases ([`docs/concept/06`](docs/concept/06-consumers-and-projections.md), section 6); which
readings each delivery role needs is design work ([RUP roles and artifacts](docs/design/11-rup-roles-and-artifacts.md)).
A delivery role is a person's job in delivery, distinct from the ratified `role`, the architectural pattern on a
code anchor. Every role below is in scope. The first design cycles concentrate on technically minded roles,
because that is where the Protocol is strongest.

| Delivery role                                   | Situation                                                                                                                                                                    | Job the readings serve                                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Technical product manager**                   | Owns what a bounded context should do and why, and thinks in capabilities, constraints and architecture rather than visual product design                                    | Survey where intent stands across Packs, find what blocks a capability, decide where to invest next, and send precise change requests (JS-A6, JS-E3, JS-F1) |
| **Readiness author / question decider**         | States a Spec's readiness by editing its carrier and settles the open questions whose `decider` names them; the graph records no Spec owner, and git records who stated what | Review a Spec or Pack in context, see what holds its stated next rung, work the statement queue, state `ready` as a deliberate edit (JS-E4)                 |
| **Software architect**                          | Works with components, contexts, layers, decisions and architecture rules                                                                                                    | See planned against realized components, follow a decision to what it shaped, judge a change's impact before it happens (JS-G1, JS-G5)                      |
| **Engineer / implementer**                      | Builds against `ready` Specs, usually through an AI coding agent                                                                                                             | Trace a Spec to its bindings, verifiers and source, read blast radius over a changeset, hand scoped context to an agent (JS-G1, JS-G2, JS-E2)               |
| **Tester / QA**                                 | Works on examples, example spaces and verifier bindings                                                                                                                      | Find Specs that still need a verifier, see example-space coverage, read supplied run evidence beside the bindings (JS-G2, JS-G4)                            |
| **Engineering leader / project lead / auditor** | Needs a trustworthy picture of delivery without hand-authored status                                                                                                         | Read the roadmap's needs, readiness and realization side by side, follow decision trails, without a progress score that invents certainty (JS-A6, JS-G5)    |

**Pull-request reviewer.** The first cycles also take the pull-request reviewer who holds only a link to a
stamped preview, the actor the Studio is written for (`spec:consumers.spec-studio`): see what changed in the
design, what it touches and whether it is ready, from the pages alone (JS-E3, JS-G1).
[Roles and perspectives](docs/design/01-roles-and-perspectives.md) keeps it in its extended tier.

**The full range stays open.** The roles above are the first design cycles' focus, not the limit of the
product. Because readings are cheap to regenerate, the product deliberately keeps room for niche, specialised
and ultra-specialised personas (for example a security or compliance reviewer, an NFR budget owner, a newcomer
onboarding to a codebase, a corpus curator) and for AI-powered readings. None of them is ruled out by focusing
on traditional delivery views first. _Persona_ is a design-material word here: the
[job stories](jtbd-stories/README.md) deliberately name no personas, so each persona is paired with the job
stories it serves. The working catalogue lives in [`docs/design/`](docs/design/README.md).

**Later audience.** Product designers who work on visual product design are a later audience for the
readings, not an early design target.

**Non-human consumers.** AI coding agents are first-class consumers through the agent surface (`sdp q`,
recipes, context bundles), and CI is a consumer of the checks. Neither needs a visual view, but every human
reading must hand off cleanly to an agent as scoped intent and must agree with what the agent surface
answers.

## Product Purpose

The Protocol models the whole software delivery lifecycle as typed content in the repository, derives
**one graph** from it, and generates every other artifact from that graph. The graph is the single read
model. Design Review, census, Mermaid, Gherkin, the Spec Studio and the vault's notes are **projections**:
pure, disposable, regenerable readings of it, never second stores. Agents and the command line read the same
graph through `sdp q` and its shipped recipes.

Because a projection is cheap to regenerate, readings can change freely. The design work exists to turn that
freedom into **dedicated readings for each delivery role and kind of work**, instead of one general Studio
that exposes data because it is available. The current Studio is working material for learning which readings
help, not a layout to preserve. Its present layout is still intended truth, carried by ready Specs in
`pack:spec-studio-v1` (for example `spec:consumers.spec-studio.navigation#rule.topEntries`), so changing it
means an engineering session revises those Specs and their tests.

Success is a direction, not yet a measure: a person in one of the roles above can do their delivery job from
a published reading, without opening the repository, and can see what the reading rests on. The nearest
measure on record is the Studio's manual acceptance, in which a person given only a link completes named
review tasks from the pages alone (`spec:consumers.spec-studio`, `spec:consumers.spec-studio.slice-page`).

## Positioning

- **One primitive, one graph, many readings.** Ideas, use cases, NFRs, decisions, contracts and examples
  are all one `Spec`, enriched in place and positioned by `kind`, `altitude` and stated `readiness`. Every
  view is a function of the same graph (and, for the Studio, of the inputs it names), so views agree with
  each other and with the repository state they were built from; a stamped Studio names that commit.
- **Honest by construction.** The `claim` of every fact (`declared`, `anchored`, `inferred`) is never
  collapsed. Delivery facts (`implemented`, `has-verifier`, `observed`) are derived, never authored.
  Stated readiness sits beside derived readiness, the floor reached. The Protocol claims "deterministically
  validated," never "provably correct."
- **Disciplines without gates.** It keeps the established delivery nouns and RUP's disciplines as
  filters over the graph, and rejects phase gates, ticket state machines and hand-authored status.
  Phase, iteration and milestone are descriptive words a roadmap may use; the roadmap itself is a Pack read
  in the owner's priority order, and release and baseline views stay deferred
  (`spec:consumers.projections-model.roadmap-views#question.releaseReader`). None is a gate.
- **AI-native, not AI-dependent.** The spec is the prompt is the design. Agents script the typed graph
  instead of guessing from raw files, and people review in readings built for review.
- **The membrane, not a replacement.** It is designed to complement ticketing, design and observability
  tools and, later, to link to them; it does not try to replace Jira, Figma or CI dashboards. The links are
  aspirational today ([`docs/concept/00`](docs/concept/00-vision-scope-and-mvp-boundary.md)).

## Operating Context

- **Where truth lives.** Authored Specs and Packs in carriers (Markdown `.sdp.md` by default; behavior and
  example Specs may use Gherkin, `.sdp.gherkin`, and the TypeScript DSL is a lawful per-ID option), anchors
  in source code, and git as the event log. A reading shows what the graph derives, plus a stamp and any
  outside inputs, each labelled as such; none of them becomes graph data or delivery truth.
- **How readings are produced.** `sdp generate` publishes all five projection roots from one validated
  graph. The Studio is a static page set that works from `file://` or any static host, with no server.
  A publishing step after the build (`sdp stamp`) writes a stamp naming the corpus commit, the engine, the
  graph schema version and the publishing time, and optionally a source template that turns each recorded
  file and line into a code-host link; a page opened through `file://` shows no stamp. The same graph is
  also projected into an Obsidian vault (generated notes and Bases beside a person's own notes), and every
  diagram is generated from the graph, never drawn by hand. A UI view is one more projection.
- **How the graph grows to serve readings.** The graph is not complete: architecturally significant
  units may carry no anchor and relations may be missing. Design work is one of the ways those gaps
  are found. A reading never invents missing material. Design sessions record the need
  ([`docs/design/07-graph-needs.md`](docs/design/07-graph-needs.md)) for engineering sessions to
  consider; they never edit anchors or other graph inputs themselves. When an engineering session
  extends the graph, the reading is generated from it.
- **How readings are shared.** A reusable workflow builds, stamps and uploads a Studio for each pull
  request, and deploys it as a preview where the repository has chosen a host, as this one has (for
  example the [PR #34 preview](https://libar-dev.github.io/software-delivery-protocol/preview/34/index.html)).
  A Pack exports as one self-contained HTML file. Reviews happen on desktop and on phones.
- **How change flows.** A reader gathers **scoped intent** in the composing panel, which hands it off as a
  change proposal and its memo against a named base; an agent applies it as an ordinary source edit; git
  records it; the conformance and honesty checks evaluate it; a regenerated graph produces new readings. A
  view never writes to canonical source.
- **Outside inputs.** A base graph (for the design diff) and CTRF run records (run evidence) can be
  supplied to a Studio build (`sdp studio --base`, `--runs`); `sdp generate` takes neither. Each is named
  on every page that shows it: the base graph by its label, schema version and Spec count, and a run by the
  commit its record holds, or `not recorded`. Neither becomes graph data or a delivery fact.
- **Rituals the readings serve.** Pack design passes, Design Review before stating `ready`, pull-request
  review from a preview link, roadmap reading (recipe 53 over `pack:roadmap`), the statement queue
  (recipe 46, and the Studio's owner queue page), and review findings that travel as change proposals.

## Capabilities and Constraints

**Fixed ground for every design.** Each line is carried by the Spec or decision it cites. The seed design
and the article series' brief first wrote much of it down, but they are evidence, not its authority.

- The repository is canonical and the graph is the sole read model; a view states no truth and confers
  nothing back into the graph (`spec:consumers.projections-model`,
  `spec:consumers.spec-studio#rule.noSecondGraph`).
- Claims, stated readiness, derived readiness and delivery facts stay visibly distinct, and none is merged
  into a progress score (`spec:extraction.claim-taxonomy`, `spec:consumers.pack-design`,
  `spec:consumers.capability-map`).
- A binding is not a verdict: `implemented` and `has-verifier` mean a binding exists, not that code works
  or a test passed (`spec:decisions.binding-not-liveness`).
- Absence is named. Missing verifiers, example-space values no example binds, spaces that are
  `not measurable`, slots that are `not enumerable`, `coverage-unknown` files and floors that are
  `not evaluated` each read as their own kind of absence (`spec:consumers.spec-studio.lenses.tests`,
  `spec:consumers.spec-studio.verification-panels`).
- Every diagram has a complete text equivalent that survives when the drawing is folded or omitted
  (`spec:consumers.spec-studio.diagrams#rule.textEquivalent`).
- The only write affordance is composing scoped intent; source edits and git history happen outside the
  view (`spec:consumers.edit-model`).
- Outside inputs stay named wherever they appear (`spec:consumers.spec-studio#rule.namedInputs`).
- Conformance and honesty checks never judge content, visual or design quality
  (`spec:validation.two-check-families`).
- The shipped-projections decision (MD-32) freezes Design Review, census, Mermaid and Gherkin; reshaping one
  needs a decision that refines or supersedes it. The Studio and any new reading evolve under their own
  Specs, within the Studio's own decisions: the derived-HTML decision (MD-41), the custom-elements decision
  (MD-42), the build-renders decision (MD-43) and the diagram-layout decision (MD-44). A design that
  crosses one of them needs a decision that refines or supersedes it.

**Open design space:** navigation and page structure; which current Studio pages survive, merge or
disappear; role- and work-specific readings; how a person moves between a Pack, a Spec, an entry and its
source; desktop against phone review; what belongs in the first reading and what behind disclosure.

**Product direction:**

- The core Protocol is and stays **open source and free** (Apache-2.0), as the package
  `@libar-dev/software-delivery-protocol`, installed from a pinned commit until a first release is
  published. The Studio's Spec records that the read-only Studio ships in that package, and that hosted
  review, shared comments and hosted previews may later ship under the commercial `@libar-ai/` namespace
  (`spec:consumers.spec-studio`).
- **Exploratory:** a **commercial Studio** is under consideration, possibly as a desktop app, a web app
  and a CI/CD surface. This is the owner's direction for the design work and is recorded in no Spec yet;
  its scope, packaging and pricing are undecided. The open-source package already ships a CI preview
  workflow (`spec:consumers.spec-studio.sharing#rule.previewWorkflow`).

**Open product questions.** A long-horizon research backlog, answered over many design cycles rather than
settled now. Giving these questions a corpus home, as keyed open questions in a design Pack, is a proposal
for an engineering session and the owner, recorded with the other [graph needs](docs/design/07-graph-needs.md);
design sessions do not author it. These questions sit in the one register of design questions,
[`docs/design/06`](docs/design/06-design-cycles.md#design-questions-for-the-long-horizon).

- What separates the free static Studio from a commercial Studio, and which readings belong to each.
- Which product state a commercial surface may hold, where it lives, and how it stays out of the graph. The
  static Studio already keeps a reader's gathered intents in the browser
  (`spec:consumers.spec-studio.intent-panel#rule.persist`), and shared comments are already named as a
  commercial candidate.
- How AI-assisted reading works. `spec:consumers.ai-assisted-reading` states `idea`. Its provisional answer
  lets an assistant only select existing deterministic readings, and keeps any generated text outside the
  Studio and the frozen projections, labelled as assistant output with its source commit and scope, adding
  no claim, fact or validator. How that output is retained with its model, prompt and inputs is part of the
  open question. The design pass may prototype assistant selection or a generated explanation against a
  named review task, which is the question's trigger; shipping either waits on the owner's decision.

## Brand Commitments

- **Names:** product **Libar Software Delivery Protocol**, short form "the Protocol"; CLI **`sdp`**; the
  human workbench is the **Spec Studio** ("the Studio").
- **Language:** the ratified vocabulary in [`CONTEXT.md`](CONTEXT.md) is binding in every reading, label
  and message. Readiness is _stated_, never "claimed"; `claim` names epistemic status only. Pre-ratification
  terms are bugs to fix.
- **Voice:** lean, plain, technical language that a wider open-source audience can follow; no insider
  shorthand, no overclaiming, uncertainty stated as uncertainty.
- **Design system:** an existing UI library and design system will be introduced later and will be
  binding. The custom-elements decision (MD-42) builds the Studio without a framework, so a CSS-level
  system fits as things stand, while a framework-based component library would need a decision that
  refines or supersedes it. Until then, design work stays at the level of UX, information architecture and
  task flows, and defines no visual styles, palettes or type.

## Evidence on Hand

- **Seed design**, written before any code: [`docs/lineage/v0-design/`](docs/lineage/v0-design/README.md),
  above all [00](docs/lineage/v0-design/00-vision-and-product.md) (vision, personas, the North Star
  scenario) and [07](docs/lineage/v0-design/07-spec-studio-and-projections.md) (the Studio as a workbench).
  It is product context and direction, not current law.
- **Article series:** [`docs/articles/`](docs/articles/README.md); Article 2 holds the compact brief for the
  first UX/UI design pass and its open questions; Article 5 sets the AI-reading boundaries.
- **Jobs:** [`jtbd-stories/`](jtbd-stories/README.md), themes A–H, with acceptance criteria per job.
- **Working prototype:** the current Studio. The preview workflow builds it for each pull request with
  `sdp studio`, a base graph and run records, then stamps it with `sdp stamp`; `sdp generate` writes the
  same Studio locally without those inputs. Its manual acceptance tasks live in `spec:consumers.spec-studio`
  and `spec:consumers.spec-studio.slice-page`, one of them on a phone. At the close of PR #35 a reader job
  given only the pages of the first adopter's copy completed the Studio's tasks; no recorded session shows a
  person completing them.
- **First-adopter feedback**, kept in the first adopter's repository and cited by
  `spec:consumers.spec-studio` and `spec:consumers.review-perspectives`: agent readers working named review
  tasks from a generated page, and the adopter's request to make the human reading experience the next
  milestone. It is agent task evidence and adopter demand, not human usability results.
- **Real corpora:** the Protocol's own self-hosted corpus under `specs/`, the worked example
  `examples/checkout-v1`, and one first adopter (historical figures cited to the pull requests that
  measured them).
- **Absent, and not to be fabricated:** user research or human usability results, testimonials, named
  customers, adoption metrics beyond those measured in pull requests, commercial pricing or packaging, and
  benchmarks for AI-assisted reading.

## Product Principles

1. **Design for the job, not for the data.** Readings are free to regenerate, so each one should serve a
   named delivery role doing a named task. A page that only exposes what the graph happens to hold has not
   earned its place.
2. **Make the basis visible.** A reading keeps intent, bindings, inferred structure and outside inputs
   visibly apart, and a published Studio names the commit and engine it was built from through its stamp.
   Pages opened through `file://`, Pack exports and vault notes name no commit today; how they show their
   basis is an open design question. Trust comes from what a reader can inspect, not from polish.
3. **Disciplines are filters, never gates.** A discipline selects Specs by kind or section, a perspective
   selects and orders a Pack's members for one concern, and a delivery role decides which readings a person
   needs. No reading implies a phase to pass, a quota to fill or a status someone typed in.
4. **Read richly, write through intent.** A view helps people understand, compare and decide, and its only
   output is scoped intent for an agent and git to carry. It never becomes an editor of truth.
5. **Name every absence.** What is missing, unmeasured or unknown is shown as its own kind of absence, so
   no empty space is left for a reader to guess about.

## Accessibility & Inclusion

- Every diagram keeps a complete text equivalent
  (`spec:consumers.spec-studio.diagrams#rule.textEquivalent`), as both an accessibility rule and an honesty
  rule.
- The Studio's Specs already set a baseline: every link and control is reachable from the keyboard with
  visible focus (`spec:consumers.spec-studio.shell#rule.keyboard`) and is a native, labelled control
  (`spec:consumers.spec-studio.page-elements#rule.nativeControls`); every meaning a colour conveys is also
  in words (`spec:consumers.spec-studio.shell#rule.wordsBesideColor`,
  `spec:consumers.spec-studio.shell#rule.rungBadge`), including the current page
  (`spec:consumers.spec-studio.navigation#rule.currentPage`); and every page but search reads without its
  script (`spec:consumers.spec-studio.shell#rule.withoutScript`).
- Phone review is a real use: reviewers open stamped previews on phones, so readings must keep their
  meaning at phone width.
- A formal conformance target (such as a WCAG level) has not been set.

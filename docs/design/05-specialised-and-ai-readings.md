# 05 — Specialised and AI-powered readings

The first cycles design traditional delivery views (tier 1 in [01](01-roles-and-perspectives.md)).
That is the first focus, not the limit. This document keeps the wider option space open:
specialised readings for niche and ultra-specialised roles, and AI roles that could make those
readings affordable. Nothing here is a commitment; it is a map of what the foundation allows, kept
as a long-horizon research backlog. *Reading* and *persona* are provisional design-material words
(see the [README](README.md)), not ratified terms.

## Why specialised readings are affordable here

In most tools, every new view is a product feature with its own data, permissions and maintenance.
Here, a reading is a function of the graph and of the inputs a caller names beside it (a base
graph, run records, a perspective): no new store, nothing to keep in sync. Its output is
regenerated, never maintained by hand. Its cost is the code that composes it, which is reviewed and
tested like any other source, plus the design work any Protocol reading carries:

- A reading the Protocol ships needs a carrying Spec stated `ready` before its code, because
  maturity gates implementation.
- A Studio page shows only the recipe answers the Studio's design names
  (`spec:consumers.spec-studio#rule.recipeAnswers`), and the recipe catalog runs only the bodies
  the package ships, never one found in the corpus
  (`spec:consumers.agent-surface.evaluation-sink#design.recipeSource`).
- An adopter's own body over the reader needs neither: past the entry adapters, the agent surface
  grows by bodies an agent scripts (`spec:consumers.agent-surface#rule.growByRecipe`).

That changes the economics: a reading for one role and one question is reasonable to build, as
long as it keeps the same honesty obligations as every other reading. Readings over git history
are an open extension. The graph holds one commit and only the extractor reads the repository, so
such a reading would take graphs written at named commits as a named input, as the design diff
takes its base graph ([08](08-what-the-repo-settles.md#3-history-beyond-one-commit) says how it may
ship; [06](06-design-cycles.md#history) asks whether any reader needs one;
[07](07-graph-needs.md) logs the need).

## Candidate specialised readings

Each row is a candidate, not a commitment. [01](01-roles-and-perspectives.md) lists the personas by
job (tiers 3 and 4); this table lists the readings by the material they draw on, and one reading
may serve several personas. Where a persona helps, pair it with the
[job stories](../../jtbd-stories/README.md) it serves, which deliberately name no persona. Each
status cell states what the repository confirms today.

| Reading | Serves | Material | Status of the material |
|---|---|---|---|
| **Discipline activity over time** (the RUP hump chart, derived) | leader, process engineer | a series of graphs written at named commits, filtered by discipline | not built; needs a named history input and a carrying Spec (the design diff's pattern: the caller writes each graph) |
| **Decision lineage** | auditor, architect, decision archaeologist | decision register (recipe 31), decision map (recipe 18) for `decidedBy` reach, `supersedes` edges | register and reach available; a superseded record stays only while its text is still needed, so older lineage and its dates need graphs from earlier commits |
| **Example-space explorer** | stakeholder, requirements specifier, BDD practitioner | example-space slots, bound points and slot-value coverage (recipe 44); the Outcome union the space contract derives from the parent's Then steps | slot-value coverage available; witnesses are not in the graph, because they need the oracle evaluated at test time; the seed's harness ([seed 04 §4](../lineage/v0-design/04-authoring-surfaces.md)) is the precedent |
| **NFR board** | NFR budget owner, operations | `constraint` Specs with their `target` and `measurableBy` entries | targets available; measurements wait on the deferred `observed` fact |
| **Contract handshake** | API consumer, partner team | pinned declarations shared by two parties (recipe 24), key-family register (recipe 41) | material available; no per-contract reading yet |
| **Context tour** | newcomer | capability map (recipe 52), design slice (recipe 54), Model terms, bound code | available; ordering is design work |
| **Due-diligence dossier** | outside assessor | census, drift alarm (recipe 2), gaps (recipe 8), coverage-unknown (recipe 4), decision register (recipe 31) | available; must lead with its own limits |
| **Corpus hygiene board** | corpus curator | orphans (recipe 8), mention audit (recipe 22), curation report (recipe 40), slimming candidates (recipe 39) | available |
| **Adoption board** | adoption lead | capability adoption (recipe 47), rule-key proposal (recipe 48), the upgrade kit | available |
| **Pull-request change narrative** | reviewer, leader | design diff (recipe 35, with a base graph), blast radius (recipe 4, with changed files), statement-queue movement | diff and blast radius available; queue movement would need the statement queue (recipe 46) run at both commits, and no reading compares the two yet |
| **Migration progress by component** | migration lead | planned against realized components (recipe 43) | available; the seed drew it as a heatmap ([seed 05 §6](../lineage/v0-design/05-runtime-anchors.md)) |
| **Release contents** | release manager | git tags | deferred; the first published release reopens the owner's blocking question (`spec:consumers.projections-model.roadmap-views#question.releaseReader`) and does not by itself authorize the view |

## The AI ladder

[Article 5](../articles/05-ai-can-shape-the-reading.md), a direction article rather than intended
truth, separates three AI roles: **reader** (built), **editor through hand-off** (built) and
**presentation assistant** (future). This ladder breaks the third role into steps and adds the
drafting edge of the second (A6), ordered roughly by how much of the deterministic guarantee each
one keeps. Today, `graph = f(repo)`, and a shipped projection is a pure function of the graph and
the inputs a caller names: the same graph and inputs give the same bytes.

The boundary's carrying Spec is `spec:consumers.ai-assisted-reading`, stated `idea`, with nothing
built. Its blocking question
(`spec:consumers.ai-assisted-reading#question.aiPresentationBoundary`, decided by the owner) asks
what contract keeps an assistant's own explanations or arrangements apart from what the graph
states and makes the exact reading reviewable, including how the exact output is kept with its
model, prompt and inputs. Its provisional answer
is intent, not a ruling: select existing deterministic readings only; any generated text stays
outside the Studio and the frozen projections, labelled as assistant output with its source commit
and scope, and adds no claim, fact or validator.

| Step | What the AI does | Determinism | Boundary | Where it stands |
|---|---|---|---|---|
| **A0 · None** | nothing; a person navigates | full | — | today |
| **A1 · Select** | picks which existing reading answers a person's question | full: the reading is unchanged | the choice is shown with why it was selected and what scope it omits, and is reversible | within the provisional answer; not built, and building waits on the owner's question and a `ready` statement |
| **A2 · Compose a perspective** | writes the perspective JSON (selectors and order) for a concern the person names; the perspective filter (recipe 37) applies it | full once written: the perspective is data, reviewable and saveable | the perspective is named as a supplied input and shown with its selectors; every selected member's blocking questions stay visible by rule, and unselected members are listed by id | prototypable on the agent surface today (recipe 37, with recipes 36 and 54 taking its selection); the Studio takes no perspective input, so a Studio version is a Spec change to its named inputs; whether a written perspective counts as selection is part of the owner's question |
| **A3 · Write a projection** | writes the code of a new reading for a narrow question; it is reviewed, checked and then runs like any projection | full once accepted: the AI wrote the generator, not each render | lands as code through git and the checks; for a Protocol reading, a carrying Spec stated `ready` comes first | open; the strongest route to ultra-specialised readings. Precedents: corpus rules (operator-named code over the graph), the edit model, and the vault's prototype generator, kept as evidence before the vault was specified and built. Whether it needs the assistant-output contract is part of the owner's question |
| **A4 · Explain beside** | writes prose beside a deterministic reading: why two Specs conflict, what a floor clause means | none: model output varies | labelled as assistant output with its source commit and scope; under the provisional answer, outside the Studio and the frozen projections; how its model, prompt and inputs are kept is the open question | beyond the provisional answer; waits on the owner's question |
| **A5 · Converse** | answers questions about the graph in conversation, citing addresses for every statement | none for the words; every cited fact is checkable | every sentence that states a fact links to its address; unsupported statements are marked | beyond the provisional answer; waits on the owner's question |
| **A6 · Draft intent** | drafts scoped intents or a change proposal from a person's review notes | none for the draft | the person sees the exact memo before it leaves; the proposal check (recipe 38) runs against its base | editor role: agents already return change proposals from the advisory design loop (`spec:consumers.delivery-session-on-ramp`), and the rule-key proposal (recipe 48) writes one mechanically; drafting from review notes inside a reading is open |
| **A7 · Adapt arrangement** | reorders or condenses a reading for one reader | varies | may not drop a blocking question, turn an inferred edge into an authored one, or hide an input whose commit differs from the page | riskiest; an arrangement beyond selection, so it waits on the owner's question and needs measured evidence first |

**The key observation.** Steps A2 and A3 are the candidate route by which tier-3 and tier-4
personas become affordable while the output stays a deterministic function of the graph: the AI
authors the selection (a perspective) or the generator (a projection's reviewed code), and the graph
supplies the content. The provisional answer allows only selecting existing readings, so this route
is not law yet. Whether a written perspective counts as selection, and whether a reviewed generator
needs the assistant-output contract, both sit inside the owner's blocking question. "AI authors the
selection; the graph supplies the content" is a candidate answer to that question, to be tested over
the design cycles. It avoids *lens* on purpose: lens is the Studio's owner-ruled name for its graph
views (`spec:consumers.review-perspectives`), and the glossary lists it as a word to avoid for a
perspective.

## Boundaries every step keeps

From Article 5, restated as tests a prototype must pass:

- A model may explain a `declared` relation but may not present its own inference as declared.
- `implemented` still means a resolving `satisfies` edge; `has-verifier` still means a resolving
  verifier exists. A summary may not soften or strengthen either.
- Supplied run results never become `observed` and never imply a pass that no record shows.
- A model may recommend a readiness statement. Only an author states readiness.
- A displayed proposal is not canonical. The view writes no source: a proposal leaves it only as a
  hand-off, a saved proposal and memo that an agent checks against its base before applying.
- Omitting detail is allowed only when the reading says what was left out, as a context bundle does.
- The page set stays static and offline under current law: the Studio is a static page set
  (`spec:consumers.spec-studio#rule.staticPageSet`), its composing panel requests nothing over the
  network and sends its intents nowhere (`spec:consumers.spec-studio.intent-panel#rule.noRequest`),
  and no page element requests anything under `file://`
  (`spec:consumers.spec-studio.page-elements#rule.noRequest`). The seed's further rule, that the
  browser runs no model and holds no keys
  ([seed 07 §4](../lineage/v0-design/07-spec-studio-and-projections.md)), is a proposed boundary,
  not current law. An AI step that needs a model runs where the person's agent runs, or in a
  commercial service (exploratory; see [PRODUCT.md](../../PRODUCT.md)), and the reading states
  which.

## What the design pass should measure

The capture's trigger reopens its blocking question when "the UX design pass measures that
assistant selection or a generated explanation helps a named review task". These are long-horizon
research questions for the design cycles, not one-off checks. The Studio is static and sends
nothing, so evidence comes from task sessions with named readers, never from usage analytics;
[09](09-design-method.md) holds the method. Measurements for prototypes:

1. Does A1 selection get a reviewer to the right reading faster than navigating from the index
   alone?
2. Does an A2 perspective, written from a stated concern, select the members a human would?
3. Does an A4 explanation help a reviewer understand a Pack without making them less likely to open
   its Specs?
4. Does an A7 arrangement save effort, or does a stable structure make review easier?

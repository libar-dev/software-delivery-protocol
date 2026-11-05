# Design foundation

Working material for the Protocol's UX and information-architecture design. It sits between
[`PRODUCT.md`](../../PRODUCT.md), the product record for this design work (users, purpose,
constraints; design material, not intended truth), and the surface briefs that later design passes
write for individual readings.

**Status.** This is design-pass material, not intended truth, and it confers nothing on the corpus.
When a design here would change what the Studio or a new reading does, the change reaches the
product as a Spec change through the authoring workflow, made in an engineering session; a change
to a `ready` Spec travels as a change proposal. The Spec wins. The Design Review, census, Mermaid
and Gherkin projections stay frozen under the shipped-projections decision (MD-32): reshaping one
of them needs a decision record that refines or supersedes that decision, never a follow-up work
item. The seed design in [`docs/lineage/v0-design/`](../lineage/v0-design/README.md) is context,
not law.

**Design sessions never edit graph inputs.** They leave carriers, Packs, anchors and everything
else the graph is derived from alone. What they find the graph lacking is logged in
[07](07-graph-needs.md) for an engineering session and the owner to weigh. The corpus does not yet
record this design project: no Pack or roadmap entry carries it. A corpus home for it is a proposal
for an engineering session and the owner, set out in
[07](07-graph-needs.md#a-corpus-home-for-these-needs-a-proposal); a design session does not author it.

**Scope.** UX, information architecture, task flows and option space. The Studio and new readings
come first. The other readings people use stay in the option space: CLI output (finding messages,
the default print of `sdp q`), the vault, and the roadmap and proposal memos (recipes 55 and 49).
Which of them the cycles take up is itself a design question. The frozen projections above are out
of scope unless a decision record reopens one.

**No visual style.** An existing UI library and design system will be introduced later and will be
binding; until then this material stays at UX and IA level. One constraint already applies: the
decision that the Studio is built from custom elements, not a framework (MD-42). A CSS-level design
system or framework-free custom elements fit it; a framework-based component library would need a
decision that refines or supersedes it.

**Open source first.** The core is and stays open source and free. The read-only Studio ships in
the open-source package, and its Spec leaves room for hosted review, shared comments and hosted
previews under `@libar-ai/` (`spec:consumers.spec-studio`). A commercial Studio, possibly a desktop
app, a web app and a CI/CD surface, is under consideration: exploratory, labelled as such wherever
it appears, and kept in the option space.

**Time horizon.** Technical questions are answered from the repository;
[08](08-what-the-repo-settles.md) collects those answers. Design questions form a long-horizon
research backlog, worked through over at least six months of iterative cycles
([06](06-design-cycles.md), [09](09-design-method.md)). They are not owner to-dos to settle now.

## Working method: the graph first

This repository is self-hosted: its own delivery intent is a corpus, and the derived graph is how it
is explored. Every design session, and every agent a design session briefs, works in this order:

1. **Load the reading skill** (`skills/sdp-agent-surface/`) before any question about the corpus.
2. **Ask the graph** through `pnpm --silent sdp:q` and the shipped recipes: the entry adapters for
   a word, a file or a changeset (`findByConcept`, `byFile`, `blastRadius`); `specContext`,
   `packContext` and `resolveEntryAddress` for one Spec, Pack or entry; recipes for recurring
   questions. Compose ad-hoc bodies freely; there is no verb per question.
3. **Read a carrier last**, and only for its exact wording, at the location the graph returned.

Text search over the carriers is not a research method here: it bypasses the claims, the derived
facts and the blind spots the graph reports. Sources outside the corpus (`CONTEXT.md`, the concept
documents, the recipe catalog, the lineage) may be read directly; concept search (recipe 6) finds
where a concept lives. A design claim about the Protocol is checked by a query, and the query
belongs in the claim's evidence. Counts are derived, never quoted: a document names the query or
recipe that derives a number instead of writing the number down. The same rule shapes the product:
people should enter the readings the way agents enter the graph
([04](04-reading-model-and-ia.md#2-how-people-arrive)).

## Contents

| Document | Question it answers |
|---|---|
| [`PRODUCT.md`](../../PRODUCT.md), the product record | Whom the readings serve, what they are for, and the constraints every design keeps |
| [01 — Roles and perspectives](01-roles-and-perspectives.md) | Who reads the graph, in which situation, for which job: core delivery roles first, then extended, niche, ultra-specialised and non-human readers |
| [02 — The seed's experience, mapped to now](02-seed-experience-map.md) | What the pre-code seed design imagined for people, what became of each idea, and the design opportunity each leaves |
| [03 — Reading material](03-reading-material.md) | What a reading can draw on: what the graph holds, what the recipes already answer, what named inputs supply, and what the graph does not hold |
| [04 — Reading model and information architecture](04-reading-model-and-ia.md) | What a reading is made of, how people arrive, how readings fit together, and which surfaces carry them |
| [05 — Specialised and AI-powered readings](05-specialised-and-ai-readings.md) | The wider option space: readings for narrow roles, and a ladder of AI roles with their trust boundaries |
| [06 — Design cycles](06-design-cycles.md) | How the work runs in cycles, which briefs to shape first, and the long-horizon design questions the cycles work through |
| [07 — Graph needs](07-graph-needs.md) | What design work finds the graph lacking, logged for engineering sessions and the owner, since design sessions never edit graph inputs |
| [08 — What the repository settles](08-what-the-repo-settles.md) | Which technical questions the repository already answers for design, with the Specs and queries that carry each answer |
| [09 — Design method](09-design-method.md) | How design work is done and judged: task sets, readers, what counts as success, prototypes, and how a session is recorded |
| [10 — Studio baseline](10-studio-baseline.md) | What today's Studio gives its readers, recorded at a pinned commit as the point every later cycle compares against; so far the page-reading half of cycle 0, with no task outcomes recorded yet |
| [11 — RUP roles and artifacts](11-rup-roles-and-artifacts.md) | How the roles and artifacts of the Rational Unified Process (RUP) map onto what the graph holds and the readings it could carry |
| [12 — Analogous products](12-analogous-products.md) | What comparable products do for the same jobs, and what each teaches the design, as evidence rather than template |

Suggested reading order: `PRODUCT.md`, this README, 01, 02, 08, 03, 10, 04, 05, 11, 12, 09, 06,
07. 02 and 08 come early: the seed design was written before any code, and much of its human
experience is not in today's Studio; 08 shows which questions need no design work because the
repository already answers them. The catalogue in 01 keeps the whole range of readers in view: the first
cycles focus on core delivery roles, and that is a focus, not a limit.

**Numbers in these documents.** A linked two-digit number (such as [08](08-what-the-repo-settles.md))
is one of these documents. "(N)" in a material column, or "recipe N", is a recipe in the
[catalog](../agent-surface/recipes.md). "seed NN §x" points into the seed design
([`docs/lineage/v0-design/`](../lineage/v0-design/README.md)), and "concept NN" into
[`docs/concept/`](../concept/README.md). "Tier N" is a persona tier in 01, "cycle N" a design cycle
in 06, and A0–A7 are the steps of 05's AI ladder. JS-xN (shortened to xN in 01's tables) is a
[job story](../../jtbd-stories/README.md) id. MD-n and D1–D6 are entries of the decision registry
([`DECISIONS.md`](../concept/DECISIONS.md)), always given beside the decision's name.

## Words used here

The ratified language in [`CONTEXT.md`](../../CONTEXT.md) is binding: use its terms, and never use
as current usage a word it lists as an alias to avoid. These words do specific work in this design
and must not blur:

- **perspective** (ratified): a reader's concern a Pack is read from, such as the domain model,
  operations or the runtime platform. It is corpus data a recipe takes as a parameter (the
  perspective filter, recipe 37) to select and order a Pack's members, leaving each member's
  content whole. The corpus owns its perspectives; the Protocol ships none.
- **discipline** (an adopted delivery noun): a filter that selects or groups Specs by kind or
  section. It is never a phase to pass through.
- **lens** (the Studio's name, not a glossary term): one of the Studio's graph views, today Packs,
  capabilities, architecture, tests and evidence (`spec:consumers.spec-studio.lenses`). The owner
  ruled the split in `spec:consumers.review-perspectives`, and `CONTEXT.md` lists "lens" as an alias
  to avoid for perspective, so a lens never names a reader's concern.
- **role** (ratified): the one-token value on a code anchor naming the architectural pattern its
  unit plays (the architectural-annotation ruling, MD-38). People are never "roles" bare here; see
  *delivery role* below.
- **decider** (ratified, as an open-question field): who answers an open question. It is also a
  value in this corpus's anchor role vocabulary, so it never names a persona.

Design terms this foundation introduces are **provisional**: design-material words, not ratified
and not for labels, Specs or the glossary unless the owner rules them in. Their status:

| Provisional term | Meaning here | Status |
|---|---|---|
| **reading** | what a person or agent takes from the graph for one question, whatever carries it: a page, a projection's output, a recipe's answer | **Keep as a design-prose word**, with this one meaning across these documents. The corpus already uses it informally the same way ("a design slice is a reading and not an artifact", `spec:consumers.design-slice`). Do not confuse it with fixed phrases: reading order (`spec:consumers.roadmap`), a question's provisional reading, the reading skill, and the context bundle's reading material (03's title uses that phrase in its plain sense). Where precision matters, use the exact noun: projection, page, page set, recipe answer. |
| **persona** | a design-research description of a person in a delivery role: situation, jobs, first questions | **Keep as a design-material word**, by the owner's choice. `CONTEXT.md` does not reject it, and the concept vision speaks of multi-persona consumption, but the [job stories](../../jtbd-stories/README.md) deliberately bind to no persona because the Protocol's readers are heterogeneous. So a persona is paired with job stories (When / I want / so I can) for its jobs; a Spec names whom it serves through its Intent `actor`; and a persona never becomes a label, a Spec term or a perspective. |
| **delivery role** | the people sense of role: analyst, architect, tester, product manager and the rest | **Always qualified.** Bare `role` is the ratified anchor token above. |
| **role home** | the landing reading a delivery role opens first, composed from shared readings | **Avoid as a name; the idea stays a candidate.** It builds on the ratified `role`, and the graph cannot select by person. Today's nearest names are the index, the Studio's default landing page (`spec:consumers.spec-studio.lenses`), and selection by concern, which is a perspective. A replacement name is open; documents that still use this one mean the idea above. |
| **object page** | the one canonical reading of a single thing (a Spec, Pack, decision, question, component) | **Prefer the Studio's own pattern**: Spec page, Pack page, slice page, "*thing* page". Decision records already have Spec pages. Some candidates contradict `ready` Studio rules and reach the product only as change proposals against them: a page per code unit (the page set holds none, `spec:consumers.spec-studio.spec-page#rule.sourceText`), one canonical page per Pack (a Pack has a Pack page and a slice page by design, `spec:consumers.spec-studio#rule.staticPageSet`), and pages for unkeyed open questions (only a keyed question has an address, `spec:model.open-question-keys`). |
| **basis line** | a statement on a reading of what it projects: corpus commit, engine and named inputs | **Avoid as a name; the need stays a design question.** The existing element is the stamp line (`spec:consumers.spec-studio.shell#ui.stampLine`), showing the corpus commit, engine and build time that `stamp.json` names, and each page that shows an input names it (`spec:consumers.spec-studio.data.inputs#rule.inputNaming`). Neither is always present: the build writes no stamp (`spec:consumers.spec-studio.sharing#rule.buildWritesNoStamp`), a page opened through `file://` shows none (`spec:consumers.spec-studio.shell#rule.stamp`), a later build removes it, a Pack export leaves the stamp line out, and vault notes name no commit. Making it always present would change `ready` rules and bears on the determinism constraint (`spec:extraction.determinism`). "Basis" also collides with *base* (the base graph, `--base`) and with the settled basis a `ready` statement rests on (`spec:validation.typed-dependency-floor`). Documents that still use this name mean the need above. |
| **other coinages** | task flow, claim cue, absence word, agent hand-off and jump ([04](04-reading-model-and-ia.md)); cycle ([06](06-design-cycles.md)); graph need ([07](07-graph-needs.md)); the AI ladder's step names A0–A7 ([05](05-specialised-and-ai-readings.md#the-ai-ladder)); the artifact fit labels ([11](11-rup-roles-and-artifacts.md#catalogue-2--rup-artifacts-as-projections)) | **Design prose only.** Each is flagged where it first appears and means only what that document says. |

Any other word these documents coin is provisional in the same way: flagged where it first
appears and added to the last row above. A coinage that duplicates an existing name gives way to it: the Studio's composing panel
(`spec:consumers.spec-studio.intent-panel`) needs no second name. A provisional term becomes shared
vocabulary only through the governing rubric in `CONTEXT.md` (adopt the established delivery noun,
coin a word only for a genuine differentiator, and pass both naming tests). A shipped Studio name
then lands through a carrying Spec and a `CONTEXT.md` row, as perspective did: engineering-session
work, which design sessions record as a need in [07](07-graph-needs.md).

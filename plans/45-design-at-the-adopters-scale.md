# Plan 45. Design at the adopter's scale

> **Status:** ✅ EXECUTED on `feature/design-at-scale-v0`, from `main` at `7eef29b`, the merge of
> PR 32, as PR 33; the platform's side is `sdp/design-at-scale` of libar-platform. Every lane landed,
> each reviewed across model families, and the rulings below were made on the owner's delegation
> and await the owner's review. A thin lineage pointer: readiness, backlog and open questions are
> read from the graph (recipes 1, 9, 11, 20, 29, 33), never from this file. If this file and the
> graph disagree, the graph wins and this file is stale.

## Why

The first adopter, libar-platform, designs a Convex transactional domain platform as a corpus of
about 240 Specs in six Packs. It is a large design, and most of it will stay design for months:
layers 3 to 6 exist only on paper. On 2026-10-13 the owner asked for the next chunk to unlock as
much of the Protocol as possible for that design work, without machinery no reader needs.

A read of the platform, its feedback and the Protocol's backlog found four needs, in order:

1. **Reach `main` cheaply.** The platform pins the Protocol at `822aea4`, a vendored tarball from
   before PRs 30 to 32. About fifteen of its asks are delivered on `main` and unusable at its pin.
   Main's engine validates its corpus identically and passes its tests; one script must change.
2. **Design passes that fit a model's budget.** The context bundle (recipe 36) overflows its
   default budget on every platform Pack: most of the cut bundle is repeated locations and
   pinned declarations carried twice.
3. **A page a person can read.** The owner wants to present designs ahead of their code, and the
   platform's reviewers read carrier files because the Markdown Pack page is a 13-column table.
   This is the Spec Studio's phase 0 (plan 42).
4. **The platform's own rules inside `sdp validate`.** The platform's gate (`design/tools/check.py`)
   parses carriers to check citation edges, isolation and readiness policy. Corpus rules and
   architecture constraints give those checks a Protocol home; planned architecture lets layers 3
   to 6 state their components before their code.

## The lanes

| Lane | Delivers | Kind | Models |
| --- | --- | --- | --- |
| **P** the adopter on-ramp | Install from a commit; `bindExample` runs `after` in a `finally`; `check-carrier-rule.mjs` wired or deleted; an adopter migration note | build | gpt-6.1-sol, reviewed by Opus 5.5 |
| **L** the loop at scale | A compact context bundle; `declarations: "addresses"`; recipe 41, the key-family register; a diagnostic for a parameter a recipe does not take | design, then build | Opus 5.5 designs, gpt-6.1-sol builds, Opus 5.5 reviews |
| **B** corpus checks | Design: keyed Design entries for corpus rules, architecture constraints and planned architecture, and `pack:corpus-checks-v1`. Build: `sdp validate --rules`, recipe 42 (the architecture walk), recipe 43 (planned against realized components) | design, then build | Opus 5.5 designs, gpt-6-sol reviews; gpt-6.1-sol builds |
| **S** the Studio's phase 0 | Plan 42's design pass (child Specs, the phase-0 questions, a Pack-page prototype, the data and element contracts), then its lanes S1 to S3 | design, then build | Opus 5.5 designs, Fable 5.1 and gpt-6-sol review; gpt-6.1-sol builds |
| **E** the platform on `main` | In libar-platform: the re-pin, its migration, the tooling the Protocol now replaces, and the two associations the Studio's reader tasks need | adopter build | gpt-6.1-sol, reviewed by Opus 5.5 |
| **X** integration and close | Recipe catalog, self-hosting oracle, skills, `CONTEXT.md`, help text; an adversarial review; the Studio's acceptance on the platform; the PR | close | gpt-6.1-sol, gpt-6-sol, gpt-6-astra |

Wave 1 runs P, L and the design passes of B and S in parallel worktrees. The main thread then
rules on what the design passes recommend and states the `ready` the builds start from. Wave 2
builds B and S. Wave 3 integrates, reviews and measures. Recipe numbers are pre-assigned so lanes
do not collide: 41 to L, 42 and 43 to B.

When the platform needs a capability, the Protocol builds it; the platform does not work around
it. Lane **E** then moves the platform onto the chunk's head in its own repository, on the owner's
word of 2026-10-13: install from the commit, apply the migration the read found, and retire the
platform's home-grown tooling where the Protocol now serves (the graph-side half of `check.py` as
rules files, recipe bodies cut from the catalog by regular expression, the hand-built Pack page).
A gap E finds comes back to the Protocol as a fix in this chunk.

## Rulings at the start

Made by the main thread on the owner's delegation, before the lanes; each awaits the owner's
review.

| Ruling | Carrying Spec |
| --- | --- |
| One branch and one PR for the chunk; plan 42 is lane S's brief | — |
| An adopter installs from a commit through a `prepare` script that builds the package; no npm prerelease while the version is `0.0.0` | `spec:consumers.adopter-on-ramp` |
| The context bundle may cut pinned declarations to entry addresses, opt-in through `params.declarations`; a partial bundle stays refused | `spec:consumers.context-bundle` |
| The key-family register is one recipe and needs no model change | `spec:consumers.agent-surface.register-recipes` |
| A parameter name a recipe does not take is reported in its answer, never ignored | `spec:consumers.agent-surface.recipe-parameters` |
| A corpus-checks Pack holds corpus rules, architecture constraints and planned architecture | `spec:consumers.graph-first-planning` |
| The provisional answers on corpus rules and architecture constraints stand | `spec:validation.corpus-rules`, `spec:validation.architecture-constraints` |
| Choosing a provider stays prose; one runtime owner per concern is a corpus's own rule, not a Protocol shape | `spec:model.planned-architecture` |
| The provisional answers on the Studio's Specs stand, `spec-page#sourceLinks` among them; phase 0 has no AI slices | `pack:spec-studio-v1` |
| The vault is its own projection, not the Studio's local half, and waits for a reader | `spec:consumers.obsidian-vault` |

## Rulings after wave 1

Wave 1 merged at `af30233`. Each design pass was reviewed across model families (B by gpt-6-sol;
S by gpt-6-sol and Fable 5.1; L and P by Opus 5.5) and fixed before the main thread ruled. These
rulings were delegated, and each awaits the owner's review.

| Ruling | Carrying Spec |
| --- | --- |
| A cut entry without an entry address keeps only `{ line }`; its row and its place in the bundle name the rest | `spec:consumers.context-bundle#design.pointer` |
| A parameter name a recipe does not take replaces the whole answer with `{ unknownParams, accepts }` | `spec:consumers.agent-surface.recipe-parameters#rule.unknownNames` |
| A rules file is one `sdp q` body returning `{ findings }`, so a recipe that returns findings is a rules file as shipped | `spec:validation.corpus-rules#design.ruleAnswer` |
| A rule id is one kebab token, never a Protocol validator id; a corpus finding names its rule and rules file | `spec:validation.corpus-rules#design.ruleFinding` |
| Each `--params` belongs to the `--rules` before it; each file gets its own copy of the graph and report; one path named twice is refused | `spec:validation.corpus-rules#design.paramsFlag` |
| `validate` exits 1 on any Protocol error, corpus error or failed rules file; the two summary lines say which | `spec:validation.corpus-rules#design.exitCodes` |
| Under `--watch`, rules files are read again each cycle; editing one does not start a cycle | `spec:validation.corpus-rules#rule.watchReruns` |
| A component design states an empty `uses` as `none` | `spec:model.planned-architecture#design.designKeys` |
| The Studio publishes static pages that read without script, except search; elements only enhance | `spec:consumers.spec-studio#rule.staticPageSet` |
| Search lives on one page that embeds the index and shares `findByConcept`'s matcher, adding coined keys and file paths | `spec:consumers.spec-studio.search` |
| A Pack page leads with its computed summary, folds the holds into it, and gives each card one colored badge | `spec:consumers.spec-studio.pack-page` |
| The fifth reader task passes when the reader finds whether a verifier is bound, since the platform binds none there | `spec:consumers.spec-studio` |
| The Studio joins the repository's projection suite; element tests run under Node without a DOM library | `spec:consumers.spec-studio.publisher` |

Stated on the same delegation, each at the floor recipe 9 reported: `ready` for corpus rules,
architecture constraints, planned architecture, and the Studio's data, shell, search, publisher,
index page, Pack page, Spec page core and page elements; `defined` for the Studio's lenses, Spec
page, components and responsive layout. Their build lands in wave 2; until then each `ready` one
reports an honest verifier gap.

Wave 2 runs in parallel: an integration pass (the oracle, the shared skills and the line a
mention in a rule loses), the corpus-checks build, the Studio's data and verb beside its elements
and then its pages, and lane E's first half, which moves the platform to this commit. Lane E's
second half follows the builds: rules files and the Studio on the platform.

## Rulings after wave 2

Wave 2 merged at `eef8ba9`. Each build was reviewed by Opus 5.5, and the Studio's pages also by
Fable 5.1, before the main thread ruled. Delegated; each awaits the owner's review.

| Ruling | Carrying Spec |
| --- | --- |
| Search indexes only the graph; an adopter's register id is found once the adopter writes it into a Spec, so the second reader task keeps its wording | `spec:consumers.spec-studio.search` |
| A keyed question on a Spec page shows its key, with a copy action for the full address | `spec:consumers.spec-studio.spec-page.core#ui.questionItem` |
| The left rail lists example-space owners only on Pack and Spec pages | `spec:consumers.spec-studio.shell#ui.leftRail` |
| An example states a component design no anchor realizes as `realizedLayer: "absent"` | `spec:model.planned-architecture` |
| The rules runner lives in the CLI; the validation layer holds only the corpus finding types | `spec:validation.corpus-rules` |
| The concept matcher ships as the browser-safe subpath `./concept-match`, as the anchor builders ship as `./anchors` | `spec:consumers.spec-studio.search` |

## Rulings after wave 3

Two adversarial reviews (gpt-6-sol on the code, Opus 5.5 on the design's honesty) and the
platform's second half found the last defects; each was fixed with a test that failed first.
Delegated; each awaits the owner's review.

| Ruling | Carrying Spec |
| --- | --- |
| A build from a git archive, as npm builds a GitHub pin, records its commit through `export-subst`, so `sdp --version` names the pinned commit on every install route | `spec:consumers.engine-provenance` |
| A corpus finding's `file` is a root-relative POSIX path; one rules file named twice is refused through a symlink too | `spec:validation.corpus-rules#design.ruleFinding` |
| The key-family register answers an unresolved Pack member with a diagnostic, never a partial register | `spec:consumers.agent-surface.register-recipes#design.familyRecipe` |
| Lane E keeps the platform's committed Pack page beside the Studio: the platform's decision 58 makes it the page a pass reads first, and replacing it is the owner's call | — |

## Acceptance, measured at close

- `npm run check` passes; the Markdown Design Review, census, Mermaid and Gherkin projections are
  unchanged, and the Studio joins the projection suite as a fifth root.
- The platform's history-view Pack fits the context bundle's default budget with
  `declarations: "addresses"`: 93,806 of 100,000 units, on the platform itself.
- The graph-side half of the platform's `check.py` runs as `design/rules/policy.js` and recipe 42
  under `sdp validate --rules`, in the platform's own gate, and every planted mistake its tests
  carry still fails it.
- An Astra job given only the platform's Studio pages answered four of the five reader tasks from
  them. The fourth, a declaration's type comparison, is met in part: the page names the suite that
  compares the Pack's declarations and its file and line, but no page shows the assertion for one
  declaration, since no link leaves the page set.

## Deferred, with their triggers

| Item | Comes back when |
| --- | --- |
| A context bundle for the platform's application and foundation Packs, which stay over budget after every cut | A design pass needs either Pack whole; until then, read them through a perspective (recipe 37) |
| Watching rules files under `--watch` | An author asks for a rerun on editing a rules file |
| Exporting `sdp q`'s body evaluator from the package, so a script holding a graph runs shipped recipes without deriving it again | An adopter script other than the Pack page the Studio retires needs it |
| Address resolution and cycle search a rules file can call, as a reader verb or as `findings` answers from recipes 25 and 26; the platform's rules file keeps a copy of both, its section list read from the package | The next arc's design pass, first lane: a second rules file needs either |
| A Studio view of one declaration's comparison, from its pin to the assertion that checks it | A reader task needs the assertion, not only the suite's file and line |
| Run evidence | The platform's CI writes CTRF for its native tier, or the Studio's verification panels open |
| Example-space coverage | A design pass asks which slot values no example exercises |
| The Obsidian vault | A reader asks for it after the Studio's phase 0 ships |
| Lineage roots and checked external references | Ruled by the owner at plan 46's close: for now the platform may cite its earlier system, `@libar-dev/architect` (Architect), and recipe 50 checks those citations against a register of Architect references the platform keeps |
| A readiness-statement planner | The owner cannot order the platform's `ready` statements with recipes 9, 21, 29 and 30 |
| Wording-stable step keys | Rewording breaks bound examples during the platform's next slices |

## Acceptance

- `npm run check` passes; the Markdown Design Review, census, Mermaid and Gherkin projections are
  unchanged.
- The platform's history-view Pack fits the context bundle's default budget with
  `declarations: "addresses"`, measured read-only on a copy of the platform.
- The graph-side half of the platform's `check.py` runs as rules files under
  `sdp validate --rules`, on a copy of the platform.
- An Astra job given only the Studio pages built from the platform, and the files they link to,
  completes plan 42's five reader tasks, with the two associations applied on its copy.

# Plan — author the three remaining carrier-competition execution plans (15b · 15c · 15d)

> **Amended 2026-07-12, same session, after the plans landed:** owner revised decision 3 —
> carrier PRs merge **one at a time** and each next branch cuts from **current `main`**, not
> from the pinned commit (carrier PRs touch only `explorations/`, so the machinery stays the
> PR #3 snapshot; each session verifies `git log 2517361..main -- src/` is empty before
> writing, and nothing under `src/` merges until the plan-16 ruling). The "consequence"
> paragraph below is superseded accordingly: the plans and earlier exhibits *are* in each
> branch's tree; the plans stay self-contained anyway. Plans 14 and 15b–15d were updated in
> place.

## Context

Plan 14 opened the carrier competition: four exploration PRs against one exhibit bar, judged at a
dedicated PLAN-ONLY ruling session. The first competitor — **F2, the markdown carrier** — is
implemented and open as **PR #4** (`feature/markdown-carrier`), executed from a dedicated plan
(`plans/please-use-the-context-peaceful-valley.md`). The remaining three competitors — **C2 own
grammar** (full exhibit bar) and the two timeboxed entrants, **Gherkin extension/fork** and
**typed markup** (honest-CLOSED.md exits) — have no execution plans yet.

This session authors those three plans, in the F2 plan's register and level of detail, so each
can be handed to a dedicated implementation session with zero re-derivation. The user implements
sequentially, switching to `main` before each session.

**Decisions taken with the owner this session:**

1. **Naming: the fork gets letter-suffixed plan numbers.** The four carrier plans are
   `15a`–`15d` (a fork in the project direction — only one survives); the ruling session becomes
   **plan 16**. Concretely: rename `please-use-the-context-peaceful-valley.md` →
   `15a-carrier-f2-markdown-exhibits.md`; the new plans are
   `15b-carrier-c2-grammar-exhibits.md`, `15c-carrier-gherkin-fork-closed.md`,
   `15d-carrier-typed-markup-closed.md`. The other placeholder,
   `please-check-the-context-nifty-zephyr.md` (the pre-competition expansion of PR #3, already on
   `main`), is renamed `14a-pre-competition-expansion.md` — it amends plan 14, not the fork.
2. **Branch names: plan 14 §1's names** — `explore/carrier-c2-grammar` ·
   `explore/carrier-gherkin-fork` · `explore/carrier-typed-markup` (F2's
   `feature/markdown-carrier` deviation stays F2-only, as its plan recorded).
3. **The pinned branching commit: `251736137f6baa9748abeebe0fbbfa03e4dfa300`** (`2517361`, the
   PR #3 merge — current `main` tip, and the verified merge-base of PR #4). All three branches
   cut from this exact commit, *regardless of where `main` has moved by then* — every exhibit
   proves itself against the identical fixed reference PR #4 used, and each PR's merge-base diff
   stays clean.
4. **The three plan files land on PR #4's branch** (`feature/markdown-carrier`), committed there
   so they reach `main` with the merge — one coordination surface.

**Consequence the plans must carry (verified this session):** because the carrier branches are
cut from `2517361`, neither the F2 exhibit (`explorations/carrier-competition/f2-markdown/`) nor
these plan files exist in the branch's tree. Each plan is therefore **self-contained** — it
restates every verified fact and embeds the full wiring recipe rather than pointing at F2's
files — and each header tells the implementing session to read the plan from the main checkout
(e.g. `git show main:plans/15b-carrier-c2-grammar-exhibits.md`) instead of expecting it on the
branch. Also verified: `examples/checkout-v1/generated/` is **not committed** at `2517361` — every
implementing session must run `npm install && npm run build && npm run generate:example` before
its executable exhibit can bind the real generated contracts.

## Files created / renamed / edited (all under `plans/`, plus one plan-14 amendment)

| Action | File | What |
|---|---|---|
| rename | `please-use-the-context-peaceful-valley.md` → `15a-carrier-f2-markdown-exhibits.md` | + one-line header update: "filed as 15a; the ruling session is plan 16" (replacing its old renumbering note) |
| rename | `please-check-the-context-nifty-zephyr.md` → `14a-pre-competition-expansion.md` | rename only (its content already reads as a plan-14 amendment record) |
| edit | `14-carrier-competition.md` | small drift-repair amendment (see "Plan 14 amendment" below) |
| create | `15b-carrier-c2-grammar-exhibits.md` | the C2 full-bar execution plan (§B below is its content spec) |
| create | `15c-carrier-gherkin-fork-closed.md` | the Gherkin timeboxed-session plan (§C) |
| create | `15d-carrier-typed-markup-closed.md` | the typed-markup timeboxed-session plan (§D) |

Nothing outside `plans/` changes. Commit to `feature/markdown-carrier` with the session trailer.

## Shared spine (all three plans open with this, adapted per carrier)

- **Status header**: DRAFTED 2026-07-12; spec anchors → plan 14 §1–§3 (as amended), plan 12 §8,
  FINDINGS §2 ("The fork question") / §4 (scorecard) / "Directions dismissed by name", the
  carrier's seed directory, CONTEXT.md "The executable half" (*notation*/*carrier* stay flagged).
- **Branch note**: `git switch -c <branch> 2517361` (full hash spelled out; from the `main`
  checkout), why the pin (fixed reference identical to PR #4's base), what is absent from the
  tree (this plan, the F2 exhibit) and how to read the plan (`git show main:plans/…`).
- **Scope fence**: all files under `explorations/carrier-competition/<carrier>/`; nothing under
  `src/`, `examples/`, `docs/concept/`, `CONTEXT.md`, root configs, `package.json` (zero new
  dependencies); the TS DSL stays the sole canonical authoring surface; evidence, never product.
- **House rules**: no gen-1 product name anywhere in exhibits (say "gen 1" / "the prior art");
  ratified vocabulary end-to-end; transcripts committed verbatim; `git status` at the end shows
  changes only under the exhibit directory.
- **Setup**: `npm install && npm run build && npm run generate:example` (generated contracts are
  not committed at the pin).
- **Verification section**: `npm run check` untouched and green; the exhibit-local commands per
  carrier; the deliverable→file checklist.

---

## §B — Content spec for `15b-carrier-c2-grammar-exhibits.md` (full bar; the only competitor that can beat F2)

Mirrors the F2 plan's structure section-for-section (§0 context → §11 out-of-scope). ~The same
length and density as the F2 plan. Key content:

**§0 Context / posture.** C2 is the identity maximalist (FINDINGS §4: sharpest differentiation
sentence, the strongest standalone no-toolchain wedge, at maximal permanent ownership cost). Its
plan-14 §3 posture obligations beyond the bar: make the **ownership cost concrete**, show the
**`idea` rung in a grammar file** (the prose-poor end — gen 1's truncated docstrings are the
cautionary tale), and sketch the **grammar's error surface**. Owner choices mirrored from 15a for
evidence parity: the graph-shape proof is a spike parser reusing the real notation functions;
**both** structure-heavy kinds ported (`model` and `contract`) — together with F2's twins they
generate exactly the evidence the kind-partitioned dual-carrier docket item needs.

**§1 The bar restated** — the five deliverables + house rules (same text discipline as 15a §1),
with C2's posture questions named-not-ruled: envelope-as-syntax (vs frontmatter — FINDINGS §5's
first open question; C2 exhibits the syntax side), how prose is delimited in a grammar file, and
prose-in-graph (shared with F2; named for the ruling, C2 adds no second proposal).

**§2 Verified facts** — restate the F2 plan's §2 table verbatim where it transfers (all of it
does; the facts were verified against `2517361` and `src/` is untouched since): `deriveGraph`
reachable only by relative deep import of `src/extract/derive.ts`; the barrel exports
(`serializeGraph`, `generateContracts`, `buildGraphIndex`, `evaluateReadinessFloor`,
`parseSlots`, `stepSkeleton`, `renderStepText`, `boundSlotValues`, `hasUnboundSlot`,
`SPEC_SECTION_NAMES`, `SPEC_RELATION_TYPES`); the real parent states `defined` with three
relations; both arc nodes carry `deliveryFacts` and `belongsTo` (normalized out by name);
the parent's third `then` vocabulary step is
`'order creation is rejected because {reason:"empty cart"|"out of stock"}'`; the one-line
diagnostic shape `file[:line] — [severity] validatorId — message`; toolchain exemptions for
`explorations/**`; the readiness-floor clauses per rung; the exact `ReifiedSpec` /
`FileReification` seam shape. Plus one new fact: generated contracts are not committed at the
pin (setup step).

**§3 The exhibit tree** — all under `explorations/carrier-competition/c2-grammar/`:

```
c2-grammar/
├── README.md            # deliverable map · run commands · .sdp→graph mapping table
├── SCORECARD.md         # 12 axes, each row pointing at this exhibit's own files
├── IMPORT-NOTES.md      # sdp-import emitter targeting .sdp (6-import maps; emitter = a renderer of the grammar)
├── OWNERSHIP.md         # the owned-surface bill made concrete (plan 14 §3's demand)
├── PROSE-NOTES.md       # prose delimitation in a grammar file + truncated-docstrings caution; prose-in-graph named, not ruled
├── DIAGNOSTICS.txt      # deliverable 5: mock sdp validate over a typo'd envelope, real formatFinding shape + pinned ids
├── arc/01-idea .. 04-ready/   # create-order.sdp · create-order.valid-cart.sdp (two files × four rungs)
├── specs/               # arc-final pair + decisions.order-lifecycle.sdp · orders.order-model.sdp · orders.create-order.api-contract.sdp
├── table-sugar/         # TABLE-NOTES.md · host rule spec (.sdp) · expanded/ (3 generated sibling .sdp files)
├── spike/               # grammar-parse.ts · sdp-reify.ts · expand-table.ts · graph-shape.test.ts · table-expansion.test.ts · emitted/ · SPIKE-OUTPUT.txt
├── executable/          # create-order.valid-cart.test.ts · drift-demo.red.test.ts · after-edit/ · GREEN-RUN.txt · RED-RUN.txt
├── tsconfig.json        # embedded verbatim in the plan (15a's, paths identical — same directory depth)
└── vitest.config.ts     # embedded verbatim in the plan; red-demo env var SDP_C2_RED
```

No `envelope.schema.json` — C2's envelope-typing story is *extractor diagnostics until an LSP*
(FINDINGS §4 row); `DIAGNOSTICS.txt` and `OWNERSHIP.md` carry that axis honestly.

**§4 The grammar and the arc.** The syntax extends the `1-grammar/` seed's recorded forms
(header comment discipline: *syntax illustrative; the grammar session owns the real design*).
Envelope: `spec <id>` / `<kind> · <altitude> · <readiness>` / indented relation lines
(`refines <id>`, `verifies <id>`, …). The `spec` keyword is the namespace — reify maps
`orders.create-order` → `spec:orders.create-order`. Line-orientation law: keyword-led lines are
structure, everything else is prose. The rungs (floor clauses drive them; work backwards from
`04-ready` by removal, exactly as 15a §4 did; mirror the real specs' field strings verbatim so
node diffs are field-exact):

- `01-idea` — the minimum honest spec, the scored minimum-ceremony axis:

  ```
  spec orders.create-order
    behavior · feature · idea
    refines orders.order-management

  Customer creates an order
  ```

- `02-scoped` — adds an `intent` block (`outcome:` / `value:` lines) and, on the child, the
  `verifies` relation + a prose GWT block (the seed's stage-2 form).
- `03-defined` — parent gains the **example space** block (typed slots verbatim from
  `create-order.sdp.ts`, including the corrected third `then`); child's GWT flips to the bound
  point (`{n: 2}` · `{q: 1}` · `{price: 50}` · `{availability: "in stock"}` · `{total: 100}`);
  parent adds `constrainedBy` + `decidedBy`.
- `04-ready` — child adds the `verification executable` block (the seed's stage-3 form) and
  states `ready`; parent states `ready` with the honesty note in prose (in-repo TS twin states
  `defined`; stating less than you clear is lawful); `04-ready/*` byte-identical to `specs/`.

The three ports: `decision` kind (a `decision` block with `decision:` scalar + `rationale:` /
`consequences:` lists — prose paragraphs are where the grammar is weakest; that is evidence, not
a defect to hide), `model` kind (a `model` block, one `term — definition` line per term), and
the `contract` kind parked at `idea` by a `? …? [blocking]` open-question line (the seed's form).

**§5 The spike parser.** `grammar-parse.ts` (a hand-rolled, line-oriented,
indentation-sensitive subset that throws outside the subset — spike, never product) +
`sdp-reify.ts` (→ `FileReification`, reusing the package's real `parseSlots` /
`hasUnboundSlot` / `SPEC_SECTION_NAMES` via the alias, deep-importing only the seam *type*).
`graph-shape.test.ts` runs the same five checks as 15a §5: committed
`emitted/graph-fragment.json`; field-exact node diff for the three ports (drop `file` — the one
named normalization); edge diff excluding `belongsTo`; the arc pair splice + readiness-floor
pass at every stated rung against the spliced real graph; and the **contract byte-diff**
(`generateContracts` over the spliced graph reproduces
`orders.create-order.valid-cart.contract.ts` byte-for-byte). Prose lines dropped from the data
record are **counted, never silent** — the count feeds `PROSE-NOTES.md`.

**§6 The executable proof.** Green: `executable/create-order.valid-cart.test.ts` mirrors the
in-repo bound test (same World, same handlers, `bindExample` from the `/vitest` subpath),
importing the **real** generated contract — `specTest` anchor deliberately omitted with the
reason in a comment (15a's discipline). Red: `after-edit/` holds the `.sdp` copy with
`{total: 100}` → `{total: 150}`, the spike emits the one-line-diff contract (committed),
`drift-demo.red.test.ts` binds it with identical handlers, reds naming the step in the spec's
language. Transcripts `GREEN-RUN.txt` / `RED-RUN.txt` captured verbatim; red gated behind
`SDP_C2_RED=1` in the vitest include. The wiring configs embedded in the plan verbatim (15a's
landed `tsconfig.json` / `vitest.config.ts`, alias paths unchanged — same depth).

**§7 Table sugar.** A `cases` block inside a host `rule`-kind spec: template steps with unbound
slots, then a pipe table whose first column (`point`) names each row's identity → stable child
id `spec:….order-total.<point>` — same three points as F2 (`single-unit` · `multi-line` ·
`zero-price`, totals 50/120/0) so the ruling session compares the same material.
`expand-table.ts` emits N complete sibling `.sdp` files (committed under `expanded/`, pinned
byte-exact by `table-expansion.test.ts`, fed through reify → `deriveGraph` → N example nodes).
`TABLE-NOTES.md` argues the diff/merge story (a row edit is a one-line diff in a line-oriented
file — C2's strongest register).

**§8 The prose deliverables.** `OWNERSHIP.md` — the bill, made concrete and itemized: grammar
spec, parser, formatter, syntax highlighting (a TextMate-grammar sketch as the concreteness
artifact), GitHub rendering (**show it**: the raw-text screenshot/statement that GitHub renders
`.sdp` as plain text today — the rented-page contrast, stated honestly), editor plugins, LSP —
each with "forever" attached. `DIAGNOSTICS.txt` — same three-error transcript family as the
seed's (did-you-mean id, honest-readiness, `examle` kind typo), re-rendered in the real
`formatFinding` shape with real pinned finding ids. `SCORECARD.md` — the 12 axes with the C2
column confirmed/adjusted against this exhibit's own files (minimum-ceremony scores
`arc/01-idea/`; read-back axis counts tokens *plus the grammar-context tax the FINDINGS row
records*; diff axis scores the after-edit and row-edit diffs). `IMPORT-NOTES.md` — the emitter
targets `.sdp` as a renderer of the grammar; note the `deriveGraph`-not-public seam fact.
`README.md` last: deliverable map, run commands, the `.sdp`→graph mapping table.

**§9 Execution order** — same discipline as 15a §9: wiring first (the deep-import +
alias + explicit-root risk step, proven before any content), executable green, spike core with
the `model` port first, arc backwards from `04-ready`, red demo, table sugar, prose
deliverables, house-rule sweep.

**§10 Verification / §11 Out of scope** — as 15a's, with C2 substitutions; out-of-scope
explicitly includes: ruling envelope-as-syntax vs frontmatter, any real `.sdp` product parser,
LSP/highlighting implementations (OWNERSHIP.md *names* them; building any would be exhibit
theater), and the other carriers.

---

## §C — Content spec for `15c-carrier-gherkin-fork-closed.md` (timeboxed; CLOSED.md is the deliverable)

**§0 Context.** This entrant arrives against a *completed source-level reduction* (FINDINGS "The
fork question", recorded 2026-07-11): the static Gherkin parser was gen 1's least painful
component (3 of 13 linter rules; zero complaints); the runtime matcher was the dominant pain (10
of 13) and is already cured by the settled `/runner` + contracts architecture; the tag/metadata
encoding was the largest structural cost and is exactly what a *compatible* fork cannot fix. The
reduction: **compatible fork = tags-on-Gherkin = gen 1's own shape (fails the differentiation
test); incompatible fork = C2 on a forked `.berp` chassis (strictly worse than owning a minimal
line-oriented parser).** Plan 14 §3 timeboxes this session; the honest CLOSED.md is the primary
deliverable and is itself ruling evidence — it inoculates the record against "why didn't you
just extend Gherkin?" permanently. The exhibit bar is attempted **only if** the escape probe
succeeds early.

**§1 The timebox and the escape test.** One short session (~half a day ceiling; the probes
themselves ≤ 1 hour). The escape test, stated crisply so the session cannot drift: *find a
mechanism giving `.feature` files a first-class typed envelope (kind · altitude · readiness ·
relations) and a typed slot vocabulary that (i) still parses with stock `@cucumber/gherkin`
unchanged, and (ii) is not re-parsing tags, descriptions, or comments with a second bespoke
micro-parser.* If (i) and (ii) cannot hold simultaneously, the reduction stands and the session
writes CLOSED.md. Materials **on the branch** at the pin: FINDINGS §2 ("The fork question"),
`explorations/executable-examples/6-import/` (the realistic `.feature` input + the honest import
mapping), and the vendored-parser posture (devtool-only, never the canonical parse path).

**§2 The five named probes** (each gets a verdict paragraph in CLOSED.md; committed artifacts
only where a probe actually produces one):

1. **Envelope in tags** (`@kind:example @readiness:ready @refines:orders.create-order`) — the
   compatible fork's only metadata slot. Probe artifact: `probes/envelope-in-tags.feature`
   (the 6-import legacy feature re-annotated) beside a paragraph tracing it to gen 1's recorded
   shape — the four formal-spec chapters and the silent-failure traps ("annotation mistakes fail
   silently to zero") existed *because* of exactly this encoding. Verdict expected: fails the
   differentiation test by the recorded evidence.
2. **Envelope in description slots** (frontmatter-in-description) — requires a second bespoke
   micro-parser over prose: the bold-pseudo-field disease by construction. Paper verdict; no
   artifact needed beyond the argument.
3. **Envelope in comments** (`# sdp: …`) — comments survive the lexer but are positionally
   fragile and still a second parser; same disease, worse ergonomics.
4. **Newer-Gherkin syntax points** (`Rule:`, tag expressions, docstring media types) — walk the
   actual grammar surface for any *typed* metadata slot. Expected finding: none exists; record
   which constructs were checked so the walk is reproducible.
5. **The incompatible fork** (add envelope keywords to a forked `.berp` grammar) — priced
   honestly: inherits the machine-generated parser pipeline and ~70 i18n keyword sets to get a
   surface that is C2 with a heavier chassis; not a new option (the reduction's second horn).

**§3 CLOSED.md structure** (the deliverable of record): the standing reduction restated in one
paragraph → the escape test → the five probes with verdicts → the concession ruling ("the
reduction held; this carrier concedes") → **the two salvages reaffirmed** (`sdp import` on the
vendored parser as a devtool — the wedge 6-import proves; and `GherkinInMarkdownTokenMatcher`
as industrial prior art *for the markdown carrier*) → what enters the ruling docket (judged on
whether the reduction held, never against the five deliverables — plan 14 §2's recorded
alternative). House rule reminder made prominent: the prior art is "gen 1", never the product
name, even in CLOSED.md.

**§4 If the escape succeeds** (the recorded contingency, expected dormant): stop, do not grind
the full bar in the same session — record the escape mechanism as a finding, then re-plan
against the full five-deliverable bar using 15b's structure as the recipe (the spike/wiring
recipe transfers; the reified seam is carrier-neutral).

**§5 Verification**: `npm run check` untouched; the exhibit directory contains CLOSED.md +
probes only; every claim in CLOSED.md either cites FINDINGS/6-import by section or points at a
committed probe artifact; PR body in the house register (a concession PR is still an evidence
PR).

---

## §D — Content spec for `15d-carrier-typed-markup-closed.md` (timeboxed; CLOSED.md is the deliverable)

**§0 Context.** This entrant arrives against **settlement 5** (ratified at plan 12, standing
evidence per plan 14 §3): building the interactive review page proved everything interactive
derives from the *graph* — envelope chips, derived-readiness banner, GWT, live coverage verdict
— so interactivity is a rendering concern, not an authoring-format requirement; what
TSX-as-authoring uniquely buys shrank to as-you-type envelope typing for the persona already
best served by tooling, while JSX is a genuinely poor prose medium and children-typing is too
weak to enforce document structure. The seed (`explorations/executable-examples/3-typed-markup/`
— on the branch at the pin) carries both the TSX document and the settlement-5 HTML evidence.

**§1 The timebox and the escape test.** Same shape as 15c. The escape test: *an authoring
exhibit that beats settlement 5 across the maturity arc* — concretely, TSX must (i) make the
`idea` rung's ceremony competitive with a five-line envelope + one heading, (ii) carry
`decision`-kind prose without escaping/whitespace/markdown loss, and (iii) buy something at
authoring time that the graph-derived projection does not already provide. Settlement 5's
evidence says (iii) is empty; probes (i) and (ii) measure the rest.

**§2 The probes** (~1 hour, committed as `probes/`):

1. **`probes/01-idea.create-order.sdp.tsx`** — the minimum-ceremony probe: the smallest honest
   `idea`-rung spec the format allows (import + JSX wrapper + envelope props). Beside it, the
   ceremony count stated against the five-line frontmatter form. Expected verdict: the floor of
   the format is an import statement and a component tree; the highest-volume authoring event
   pays the most tax.
2. **`probes/decision-prose.sdp.tsx`** — the prose-hostility probe: port the `decision` record's
   Context paragraphs into JSX text. Expected findings, shown not asserted: brace escaping,
   whitespace collapse, no markdown emphasis/links without components.
3. **The typecheck honesty note** (in CLOSED.md, not a probe): the
   `…/markup` component library does not exist — making the probes *actually* typecheck requires
   building it first, which is itself the bootstrap cost settlement 5 priced; the probes stay
   illustrative exactly as the seed is, and the plan says so rather than mocking a green `tsc`.
4. **The retained-value paragraph**: what survives regardless — the component library as
   *projection-layer* machinery (Design Review, Studio, the review page), where it threatens no
   authoring law. The concession is about authoring only.

**§3 CLOSED.md structure**: settlement 5 restated → the escape test → the three probe verdicts
with the committed artifacts → the concession ruling → the retained projection-layer value →
docket entry (judged on whether settlement 5 held). **§4 contingency** and **§5 verification**
mirror 15c's.

---

## Plan 14 amendment (drift repair, minimal)

A short dated note in plan 14's status header + §1, recording what has already diverged and what
this session fixes forward — no re-litigation:

- F2 landed as PR #4 on `feature/markdown-carrier` (its recorded deviation); the remaining three
  carriers run **sequentially** in dedicated sessions (not four parallel worktrees), each cut
  from the pinned commit `251736137f6baa9748abeebe0fbbfa03e4dfa300` with plan 14 §1's branch
  names — the worktree commands stand for anyone running them in parallel, with the pin
  substituted for `main`.
- Per-carrier execution plans exist: `15a`–`15d` (the fork numbering); the ruling session is
  **plan 16** (the exit-criteria sentence that said "plan 15" updated).

## Execution order

1. `git mv` the two placeholder plans to their new names; update 15a's header filing note.
2. Amend plan 14 (the two bullets above).
3. Write `15b`, `15c`, `15d` per §B/§C/§D — full plan documents in the F2 plan's register
   (15b at 15a's length; 15c/15d shorter, matching their timeboxed scope).
4. Run `npm run check` (guards against any toolchain surprise from files under `plans/` — the
   temporal-language check in particular).
5. Commit everything to `feature/markdown-carrier` with the session trailer (per owner decision
   the plans travel with PR #4). Do not push unless asked.

## Verification

- `npm run check` green after the writes/renames.
- `git status` clean after commit; changes only under `plans/`.
- Each new plan self-contained: no reference that assumes the F2 exhibit or the plan file itself
  is present on the carrier branch; the wiring configs embedded verbatim in 15b; the pinned
  commit hash spelled out in all three.
- Cross-references consistent: plan 14 ↔ 15a–15d ↔ ruling-session = plan 16.

## Out of scope

- Updating PR #4's body to mention the added plans (offer to the owner after the commit; not
  done unilaterally).
- Any change under `src/`, `examples/`, `docs/concept/`, `explorations/`, or root configs.
- Running any carrier implementation, and anything plan 14 §4 dockets for the ruling session.

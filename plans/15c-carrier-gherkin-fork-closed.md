# Plan 15c — Gherkin extension/fork: the timeboxed session (CLOSED.md is the deliverable)

> **Status: 🔲 DRAFTED 2026-07-12 — execution plan for the Gherkin-fork carrier session.**
> Part of the plan-15 fork (`15a`–`15d`; plan 16 is the ruling session). This entrant is
> **timeboxed** by plan 14 §1/§3: its *primary* deliverable is an honest `CLOSED.md` — the
> recorded alternative to the exhibit bar (plan 14 §2), judged at the ruling session on whether
> its standing reduction held, never against the five deliverables. The full bar is attempted
> only if the escape probe succeeds early (§4).
>
> **Spec anchors:** plan 14 §1–§3 as amended · plan 12 §8 (the competition's terms) ·
> FINDINGS §2, "The fork question" (the standing source-level reduction this session tests) ·
> `explorations/executable-examples/6-import/` (the realistic `.feature` material and the
> honest import mapping — on the branch at the pin) · CONTEXT.md (ratified vocabulary).

## §0 — Context: what this session is, and what it is not

This entrant arrives against a **completed source-level reduction** (FINDINGS "The fork
question", recorded 2026-07-11 from a reread of gen 1 at source). Its three findings, restated:

- **The static Gherkin parser was gen 1's *least* painful component** — zero recorded
  complaints, a clean wrapper, no ADR ever considered replacing it; only 3 of the linter's 13
  rules trace to grammar quirks. Forking it fixes the component that was never broken, and
  inherits a foreign machine-generated codebase (the `.berp` grammar pipeline, ~70 i18n keyword
  sets, the token-matcher architecture).
- **The runtime matcher was the dominant pain (10 of 13 linter rules)** — and that half is
  already cured by the settled architecture: the framework-neutral `/runner` core + `/vitest`
  adapter over generated contracts (plan 13, landed), which strictly dominates the gen-1 shape
  (compile-time binding; typed parameter slots instead of untyped string tables).
- **The tag/metadata encoding was the largest structural cost** — four formal-spec chapters and
  the bold-markdown pseudo-fields existed *solely* because delivery state could not parse as
  syntax, with recorded silent-failure traps ("annotation mistakes fail silently to zero").
  A fork only relieves this by adding first-class metadata slots — i.e. by breaking Gherkin
  compatibility — at which point every benefit of forking is forfeit.

**The reduction:** a *compatible* fork = tags-on-Gherkin = gen 1's own shape — fails the
differentiation test on the recorded evidence; an *incompatible* fork = C2 on a forked `.berp`
chassis — strictly worse than owning a minimal line-oriented parser. Neither is a new option.

This session's job is to **test that reduction honestly one more time, with the escape stated
as a falsifiable condition, and record the outcome** — a `CLOSED.md` that inoculates the record
against "why didn't you just extend Gherkin?" permanently. A concession PR is still an evidence
PR; that is the house method (arguments become committed records, even in defeat).

**Branch and reference:**

- Cut from the **pinned commit `251736137f6baa9748abeebe0fbbfa03e4dfa300`** (the PR #3 merge —
  the same fixed reference every carrier binds), from the main checkout:

  ```sh
  git switch -c explore/carrier-gherkin-fork 251736137f6baa9748abeebe0fbbfa03e4dfa300
  ```

- **This plan file and the sibling 15-family plans/exhibits are not in the branch's tree** —
  read this plan via `git show main:plans/15c-carrier-gherkin-fork-closed.md`. What *is* on the
  branch and is this session's working material: `explorations/executable-examples/FINDINGS.md`
  ("The fork question") and `explorations/executable-examples/6-import/` (the deliberately
  messy vanilla `.feature` input — tags, Background, Rule blocks, a Scenario Outline with an
  Examples table — beside the seven honest imported documents and the import report).
- No build/setup step is needed unless the escape succeeds (the probes are static files and
  argument; nothing executes).

**Scope fence:** all files under `explorations/carrier-competition/gherkin-fork/`; nothing
under `src/`, `examples/`, `docs/concept/`, `CONTEXT.md`, root configs, `package.json` (zero
new dependencies — in particular, **no vendored Gherkin parser lands in this session**; the
vendoring posture belongs to the `sdp import` side PR, devtool-only, per the recorded salvage).

**House rules (prominent, because a concession document tempts narrative):** the prior art is
"gen 1" / "the prior art" — **the product name appears nowhere**, including `CLOSED.md`;
ratified vocabulary end-to-end; every claim cites FINDINGS/6-import by section or points at a
committed probe artifact.

## §1 — The timebox and the escape test

**Timebox:** one short session — the probes themselves ≤ 1 hour; the whole session (probes +
`CLOSED.md` + PR) roughly half a day, ceiling. The timebox is plan 14 §1's ruling ("attempted
only if the session finds a genuine escape from the standing reduction early, not ground out
for its own sake") — do not let probe 4's grammar walk expand into a survey.

**The escape test, stated crisply so the session cannot drift:** *find a mechanism that gives
`.feature` files a first-class typed envelope (kind · altitude · readiness · relations) and a
typed slot vocabulary, such that (i) the files still parse with stock `@cucumber/gherkin`
unchanged — the compatible horn — and (ii) the mechanism is not re-parsing tags, descriptions,
or comments with a second bespoke micro-parser — the pseudo-field disease.* If (i) and (ii)
cannot hold simultaneously, the reduction stands and the session writes `CLOSED.md`. The two
horns are exhaustive: dropping (i) is the incompatible fork (probe 5); satisfying (i) without
(ii) has exactly three metadata surfaces in the grammar (tags, descriptions, comments — probes
1–3), plus whatever newer grammar constructs offer (probe 4).

## §2 — The five named probes (each gets a verdict paragraph in CLOSED.md)

Committed artifacts only where a probe actually produces one; paper verdicts cite the record.

1. **Envelope in tags** — `@kind:example @altitude:story @readiness:ready
   @refines:orders.create-order`, the compatible fork's only structured metadata slot.
   Probe artifact: `probes/envelope-in-tags.feature` — the 6-import legacy feature
   (`explorations/executable-examples/6-import/legacy/create-order.feature`) re-annotated with
   the full envelope-in-tags encoding, so the reader sees the shape at realistic scale rather
   than in a toy. The verdict paragraph traces it to gen 1's recorded shape: the four
   formal-spec chapters (tag system · tag registry · spec evolution · delivery lifecycle) and
   the silent-failure traps existed *because* of exactly this encoding — it is the disease, not
   the cure, and it fails the differentiation test ("what does this carrier know that Gherkin
   doesn't?" — nothing; it *is* Gherkin plus conventions).
2. **Envelope in description slots** — frontmatter-style `key: value` lines inside the
   Feature/Scenario description blocks. Paper verdict: descriptions are free text to the
   parser, so the envelope requires a second bespoke micro-parser over prose — the
   bold-pseudo-field disease by construction (condition (ii) fails definitionally). No artifact
   needed beyond the argument.
3. **Envelope in comments** — `# sdp: kind=example …` lines. Paper verdict: comments survive
   the lexer but are positionally fragile (attachment to the following node is a convention,
   not grammar) and still a second parser; the same disease with worse ergonomics, plus the
   gen-1 `#`-comment lexing quirks are among the 3 recorded grammar-rule pains.
4. **Newer-Gherkin syntax points** — walk the current grammar surface (`Rule:` blocks, tag
   expressions, docstring media types, the Examples-table headers) for any construct that
   carries *typed, first-class* metadata. Record which constructs were checked, so the walk is
   reproducible and the ruling session can see nothing was skipped. Expected finding: none
   exists — every candidate reduces to probes 1–3's surfaces. (Timebox note: this is a checklist
   over the grammar reference, not research; ≤ 20 minutes.)
5. **The incompatible fork, priced honestly** — add envelope keywords to a forked `.berp`
   grammar. Paper verdict from the record: inherits the machine-generated parser pipeline and
   ~70 i18n keyword sets to reach a surface that is C2 with a heavier chassis; forfeits the
   ecosystem tooling and verbatim familiarity that were the fork's entire appeal; not a new
   option — the reduction's second horn, already covered by the 15b competitor.

## §3 — CLOSED.md (the deliverable of record)

Structure, in order:

1. **The standing reduction** restated in one paragraph, with its FINDINGS citation.
2. **The escape test** (§1's condition, verbatim) — the falsifiable statement of what would
   have reopened this carrier.
3. **The five probes** with verdicts, each pointing at its artifact or its citation.
4. **The concession ruling:** the reduction held; this carrier concedes the competition. One
   paragraph on what the concession *means*: the question is permanently answered on evidence,
   and re-litigating it requires new evidence against a named probe, not a new opinion.
5. **The two salvages reaffirmed** (they survive the concession — they were never the fork):
   `sdp import` on the vendored parser as a devtool-only converter (the wedge 6-import proves,
   a small carrier-neutral side PR that can land anytime), and the markdown token matcher in
   Cucumber's own codebase as industrial prior art *for the markdown carrier* (evidence entry
   for the ruling session, credited to the F2 column).
6. **The docket entry:** what the ruling session judges this PR on — whether the standing
   reduction held (plan 14 §2's recorded alternative), never the five deliverables.

## §4 — If the escape succeeds (recorded contingency, expected dormant)

Stop — do not grind the full exhibit bar in the same session. Record the escape mechanism as a
finding (the probe that produced it, the artifact, why conditions (i) and (ii) both hold), then
re-plan against the full five-deliverable bar using plan 15b's structure as the recipe: the
spike → `deriveGraph` → splice/floor → contract-byte-diff evidence chain and the vitest/tsc
wiring are carrier-neutral and transfer unchanged. The re-plan is a new session with its own
plan; this session's deliverable becomes the escape finding itself.

## §5 — Verification (what "done" means)

- `explorations/carrier-competition/gherkin-fork/` contains `CLOSED.md` + `probes/` only;
  `git status` shows nothing outside it.
- `npm run check` at the repo root — untouched and green (nothing entered any toolchain scope;
  no dependency was added).
- Every claim in `CLOSED.md` cites FINDINGS/6-import by section or points at a committed probe
  artifact; the escape test is stated as the falsifiable condition of §1; the product name of
  the prior art appears nowhere (grep for it).
- PR body in the house register: what was probed, what the verdicts were, why a concession is
  the honest outcome, and what the ruling session should read first (`CLOSED.md`, then the
  re-annotated probe feature).

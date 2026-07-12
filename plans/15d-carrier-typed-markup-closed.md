# Plan 15d — Typed markup: the timeboxed session (CLOSED.md is the deliverable)

> **Status: 🔲 DRAFTED 2026-07-12 — execution plan for the typed-markup carrier session.**
> Part of the plan-15 fork (`15a`–`15d`; plan 16 is the ruling session). This entrant is
> **timeboxed** by plan 14 §1/§3: its *primary* deliverable is an honest `CLOSED.md` — the
> recorded alternative to the exhibit bar (plan 14 §2), judged at the ruling session on whether
> its standing evidence (settlement 5) held, never against the five deliverables. The full bar
> is attempted only if the escape probe succeeds early (§4).
>
> **Spec anchors:** plan 14 §1–§3 as amended · plan 12 §8 (settlement 5 downgraded to standing
> evidence a competitor must overturn) · FINDINGS §3 settlement 5 + §4 (the pre-scored F1
> column) · `explorations/executable-examples/3-typed-markup/` (the seed and the settlement-5
> evidence — on the branch at the pin) · CONTEXT.md (ratified vocabulary).

## §0 — Context: what this session is, and what it is not

This entrant arrives against **settlement 5** (ratified at the plan-12 session; plan 14 §3
enters it as the standing evidence this carrier must beat). Restated:

- Building the interactive review page (`3-typed-markup/render/valid-cart-review.html`) proved
  the decoupling: everything interactive on that page — the envelope chips, the derived
  readiness banner, the GWT rendering, the live coverage verdict with its draft-example
  affordance — **derives from the graph at render time**, not from the authored document. The
  interactive review therefore works identically over a spec authored in the grammar, markdown,
  or the TS DSL: **interactivity is a rendering concern, not an authoring-format requirement.**
- What TSX-as-authoring uniquely buys shrank to **as-you-type envelope typing** — for the
  persona (engineers) already best served by tooling either way.
- Against that: **JSX is a genuinely poor prose medium** (brace escaping, whitespace collapse,
  no markdown emphasis/links without components), and **children-typing is too weak to enforce
  document structure** — "full `tsc` coverage" oversells what it checks (step text stays an
  unchecked string; element order and nesting are not enforceable at useful granularity).
- The component library itself survives as a **projection-layer competency** (Design Review,
  Studio, the review harness) — where it threatens no authoring law.

This session's job is to **test settlement 5 one more time as authoring evidence, with the
escape stated as a falsifiable condition, and record the outcome** — a `CLOSED.md` that
permanently answers "why not typed JSX documents?". A concession PR is still an evidence PR.

**Branch and reference:**

- Cut from the **pinned commit `251736137f6baa9748abeebe0fbbfa03e4dfa300`** (the PR #3 merge —
  the same fixed reference every carrier binds), from the main checkout:

  ```sh
  git switch -c explore/carrier-typed-markup 251736137f6baa9748abeebe0fbbfa03e4dfa300
  ```

- **This plan file and the sibling 15-family plans/exhibits are not in the branch's tree** —
  read this plan via `git show main:plans/15d-carrier-typed-markup-closed.md`. What *is* on the
  branch and is this session's working material:
  `explorations/executable-examples/3-typed-markup/` (the seed TSX document and the
  settlement-5 HTML page) and FINDINGS §3/§4. The real TS-DSL specs the probes port from are
  under `examples/checkout-v1/specs/`.
- No build/setup step is needed unless the escape succeeds (the probes are static files;
  nothing executes and nothing typechecks — see the honesty note in §2.3).

**Scope fence:** all files under `explorations/carrier-competition/typed-markup/`; nothing
under `src/`, `examples/`, `docs/concept/`, `CONTEXT.md`, root configs, `package.json` (zero
new dependencies).

**House rules:** the prior art is "gen 1" — the product name appears nowhere; ratified
vocabulary end-to-end; every claim cites FINDINGS/the seed by name or points at a committed
probe artifact.

## §1 — The timebox and the escape test

**Timebox:** one short session — the probes ≤ 1 hour; probes + `CLOSED.md` + PR roughly half a
day, ceiling (plan 14 §1's asymmetry ruling: not ground out for its own sake).

**The escape test, stated crisply:** *an authoring exhibit that beats settlement 5 across the
maturity arc* — concretely, TSX-as-authoring must show it can (i) make the `idea` rung's
ceremony competitive with a five-line envelope plus one heading (the minimum-ceremony axis —
the highest-volume authoring event), (ii) carry `decision`-kind prose without
escaping/whitespace/markdown loss (the prose axis), and (iii) buy something *at authoring time*
that the graph-derived projection does not already provide (the settlement-5 core). Settlement
5's evidence says (iii) is empty — the review page derives everything from the graph; probes
(i) and (ii) measure the rest. If any of the three fails, the settlement stands and the session
writes `CLOSED.md`.

## §2 — The probes (~1 hour, committed under `probes/`)

1. **`probes/01-idea.create-order.sdp.tsx`** — the minimum-ceremony probe: the smallest honest
   `idea`-rung spec this format allows (the import statement, the JSX wrapper, the envelope as
   props, the title), written in the seed's mocked-component style. Beside it (in `CLOSED.md`),
   the ceremony count stated against the competing minimum — a five-line envelope and one
   heading. Expected verdict: the format's floor is an import statement and a component tree;
   the highest-volume authoring event pays the format's highest relative tax.
2. **`probes/decision-prose.sdp.tsx`** — the prose-hostility probe: port the real `decision`
   record's Context paragraphs (`examples/checkout-v1/specs/` — the order-lifecycle decision)
   into JSX text, faithfully. Expected findings, **shown not asserted**, each marked in the
   file where it bites: braces in prose must be escaped; meaningful whitespace/paragraph breaks
   collapse; emphasis and links need components. If the port comes out clean, that is evidence
   too — record it.
3. **The typecheck honesty note** (a `CLOSED.md` section, not a probe): the
   `…/markup` component library **does not exist** — the seed mocks its import. Making these
   probes *actually* typecheck (the format's one unique promise) requires building the
   component library first, which is itself the bootstrap cost settlement 5 priced. The probes
   therefore stay illustrative exactly as the seed is, and `CLOSED.md` says so plainly rather
   than mocking a green `tsc` transcript. (Do not build the library in this session — that
   would be the exhibit-theater trap: real effort spent making the conceded case look
   stronger than its record.)
4. **The retained-value paragraph** (a `CLOSED.md` section): what survives the concession
   regardless — the typed component library as *projection-layer* machinery (the Design Review,
   the Studio direction, the interactive review harness), where settlement 5 itself locates it.
   The concession is about **authoring only**.

## §3 — CLOSED.md (the deliverable of record)

Structure, in order:

1. **Settlement 5 restated** in one paragraph, with its FINDINGS citation and the seed's HTML
   page named as the original evidence.
2. **The escape test** (§1's three-part condition, verbatim) — the falsifiable statement of
   what would have reopened this carrier.
3. **The probe verdicts** — minimum-ceremony (probe 1, with the count), prose (probe 2, with
   the marked bites), and the typecheck honesty note (§2.3) standing in for the
   as-you-type claim.
4. **The concession ruling:** settlement 5 held; this carrier concedes the competition.
   Re-litigating requires new evidence against a named probe, not a new opinion.
5. **The retained projection-layer value** (§2.4) — so the concession cannot be misread as
   killing the component library.
6. **The docket entry:** the ruling session judges this PR on whether settlement 5 held
   (plan 14 §2's recorded alternative), never against the five deliverables.

## §4 — If the escape succeeds (recorded contingency, expected dormant)

Stop — do not grind the full exhibit bar in the same session. Record the escape finding (which
probe overturned which clause, with the artifact), then re-plan against the full
five-deliverable bar using plan 15b's structure as the recipe (the spike → `deriveGraph` →
splice/floor → contract-byte-diff chain and the wiring are carrier-neutral). Note the known
extra cost unique to this carrier: a real exhibit would also need the minimal component library
to exist before its documents typecheck — price that in the re-plan.

## §5 — Verification (what "done" means)

- `explorations/carrier-competition/typed-markup/` contains `CLOSED.md` + `probes/` only;
  `git status` shows nothing outside it.
- `npm run check` at the repo root — untouched and green (nothing entered any toolchain scope;
  no dependency was added).
- Every claim in `CLOSED.md` cites FINDINGS/the seed by name or points at a committed probe
  artifact; the escape test is stated as §1's falsifiable condition; no green-`tsc` theater
  (the honesty note stands in its place); the prior art's product name appears nowhere (grep
  for it).
- PR body in the house register: what was probed, the verdicts, why the concession is the
  honest outcome, what survives at the projection layer, and what the ruling session should
  read first (`CLOSED.md`, then the two probes).

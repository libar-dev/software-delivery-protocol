# Plan 19 — Review-08 remediation

> **Status:** ✅ EXECUTED — review-08 remediation complete; final architecture review blockers,
> repeated full gate, and live product probes all passed.

## Goal

Resolve every valid major and minor finding from review 08, plus the adjacent note-level defects
that close the same contracts. Preserve the carrier, one-graph, conformance-and-honesty, and
never-delete-source laws. Record observations that have no governing defect instead of silently
inventing policy.

## Validated disposition

| Item | Disposition |
|---|---|
| R-1 | Fix: import rollback uses the shared never-throw removal path, preserves the publish error, and names every survivor. |
| R-2 | Fix: recursive import discovery shares the extractor's built-in directory exclusions and never follows discovered directory symlinks. A new user exclusion flag is not required to close the reproduced defect. |
| R-3 | Fix: lawful-but-unrepresentable TS shapes refuse with the first divergent authored path; title-less Specs name the required H1 boundary instead of emitting a fabricated title. |
| R-4 | Fix: package imports are trusted by specifier; relative imports are trusted only when they resolve to this runtime package's canonical builder modules. No public trust override. |
| R-5 | Fix: escaping follows Markdown context. Prose, headings, links, and tables escape; fenced JSON and inline code preserve literal data with context-specific encoding. |
| R-6 | Fix: every delivery-fact spelling is reserved in Markdown frontmatter and parity evidence covers them. |
| R-7 | Fix: replace both `localeCompare` uses with code-unit comparison. |
| R-8 | Fix: `AGENTS.md` describes the lean decision registry and routes rationale to git, plans, and carrying Specs. |
| R-9 | Fix: import computes and reports every source result before returning; any failure publishes nothing. |
| R-10 | Fix: canonical physical source identity deduplicates aliases before both dry-run and publication. |
| R-11 | Fix: a mixed Spec+Pack carrier refuses publication and names the required source split; import never creates a guaranteed duplicate-carrier state. |
| R-12 | Fix: an explicitly named non-carrier file is an `import/invalid-source-path` error even when other operands are valid. |
| R-13 | Fix: Pack findings are computed before the multi-Spec refusal and both are returned. |
| R-14 | Fix: the public typed emission error is exported beside the public function that throws it. |
| R-15 | Fix: the authored claim says finding-class parity and records severity/outcome asymmetry. |
| R-16 | Fix: a frontmatter finding flood retains the frontmatter finding id. |
| R-17 | Fix: directive findings point at the directive line. |
| R-18 | Fix: `CONTEXT.md` no longer sends rationale readers to the lean registry. |
| R-19 | Fix: D3, D5, and D6 point to their carrying decision Specs. |
| R-20 | Fix: the example-space comment describes context-aware escaping, not verbatim rendering. |
| R-21 | Fix: import findings use the shared `error`/`warning` severity vocabulary. |
| R-22 | Fix with scoped regression coverage for the R-3 refusal family, public typed error, omitted kinds/sections, and multi-target relations. |
| R-23 | Fix the contract-bearing tail: atomic no-clobber publication, `--` operand termination, path-free messages, no fabricated lines, and no dead branch. SIGKILL residue is not claimed recoverable. |
| R-24 | Record only: control characters have the same authored latitude as TS strings; no carrier law forbids them. |
| R-25 | Fix: own-property checks prevent inherited names from producing false duplicate diagnostics. |
| R-26 | Fix with R-5: fenced JSON sorts and emits raw keys, so visible order and copied data agree. |
| R-27 | Partial fix with explicit exception: internal builder imports become relative. The two stable-id anchor casts remain the bootstrap seam because same-module local builder calls are intentionally not recognized as imported Protocol bindings. |
| R-28 | Record only: test granularity is real maintenance debt, but the systematic executable-spec rewrite is the named next program and this remediation does not churn the 2,282-line corpus test. |
| R-29 | Fix: the registry explains that retired/reserved decision numbers are never reused. |
| R-30 | Record only: root and example corpora are separate extraction roots and no current namespace collision exists. |
| R-31 | Already resolved by review 08; re-run the temporal guard only. |

## Architecture rulings

### Anchor-builder trust

Raw relative spelling is not authority. The extraction boundary constructs an internal binding
scope from the runtime package's physical modules. `@libar-dev/software-delivery-protocol` always
qualifies. A relative import qualifies only when importer-relative resolution, including the
TypeScript `.js`-to-`.ts` convention, canonicalizes to this package's `ids` or
`model/code-anchor` module. Consumer-local lookalikes therefore mint no anchors, while deeply
nested Protocol source imports remain eligible. This is drift repair to the documented
import-binding contract, not a new public option.

### Import transaction

The CLI workflow separates scan, plan, prepare, and publish. Scanning is bounded and canonical;
planning reads and reifies every source and checks every target before writing. A failed plan
publishes nothing. Preparation writes exclusive temporary siblings. Publication uses atomic
hard-link creation so an existing target cannot be replaced; temporary names are then removed.
Rollback attempts every temporary and every target created by this invocation through the shared
never-throw removal helper, reports the original failure first, and never includes a TS source.
Dry-run consumes the same complete plan as publication.

### Markdown rendering contexts

Markdown text positions use field escaping. Fenced JSON canonicalizes object key order but leaves
keys and string values raw before `JSON.stringify`. Inline code uses a delimiter longer than any
backtick run in the value. No global escape or global exemption is lawful.

## Execution order

1. Add RED regressions for anchor trust; extract protocol-binding recognition to a small internal module and fix R-4.
2. Replace Protocol package self-imports and document the necessary stable-id bootstrap casts (R-27).
3. Split the import CLI responsibility out of `src/cli/sdp.ts` without behavior change.
4. Add RED regressions for R-1/R-2/R-7/R-9/R-10/R-12/R-23; implement bounded canonical planning, fail collection, atomic publication, and never-throw rollback.
5. Fix import finding currency and mixed/multi carrier behavior (R-11/R-13/R-21).
6. Split emitter helpers before adding R-3 diagnostics; export the typed error and add the scoped round-trip coverage (R-3/R-14/R-22).
7. Fix reserved frontmatter vocabulary and parity semantics (R-6/R-15).
8. Fix frontmatter/body diagnostic accuracy (R-16/R-17/R-25).
9. Split Design Review section rendering without behavior change, then implement context-aware literal rendering (R-5/R-20/R-26).
10. Repair operative navigation and decision-registry drift (R-8/R-18/R-19/R-29), update carrying Specs, and regenerate self-hosting projections once.
11. Run diagnostics, focused suites, strict TypeScript audits, `npm run check`, and live CLI/library/view probes. Mark this plan executed only after all pass.

## Verification contract

- Focused tests: import CLI, pure import/emitter, round trip, extraction/parity, Markdown reifier,
  Design Review, barrel/package smoke, and self-hosting graph.
- Static checks: diagnostics on every changed TypeScript file, lint, format, typecheck, example
  typecheck, and the no-excuse audit.
- Full gate: `npm run check`.
- Manual surfaces: real built `sdp import` roots for exclusions, symlink aliases, multiple refusals,
  explicit non-carrier operands, `--` operands, mixed carriers, and target collision; built library
  import for the typed emission error; real `sdp view` output for fenced JSON and inline code;
  consumer extraction for local builder lookalikes.

## Done record

- Every accepted R-1 through R-23, R-25 through R-27, and R-29 remediation landed. R-24, R-28,
  and R-30 remain recorded observations without an invented policy; R-31 remained resolved.
- The import boundary now scans bounded canonical sources, reports all planning failures before
  writing, publishes with atomic no-clobber links, rolls back through never-throw recovery, and
  never deletes a TypeScript source.
- Builder trust now follows package import or physical Protocol module identity. Consumer-local
  lookalikes produce no anchors; source, installed ESM, and CommonJS package surfaces pass.
- Design Review now encodes prose, fenced JSON, and inline code according to their Markdown syntax
  contexts. Import fidelity reports the first divergent authored path, and Markdown refusal
  diagnostics retain the correct finding class and location.
- Final architecture review found two edge-path blockers after the first green gate: an exclusive
  temp-create failure could remove an unowned path, and source canonicalization could throw past
  the CLI boundary. Regressions now prove rollback removes only created artifacts and
  canonicalization failures collect while healthy siblings continue planning.
- `npm run check` passed: lint and format, package build, both typechecks, 461 repository tests,
  the isolated 54-test CLI suite, deterministic self-hosting and example checks, and preflight.
  The gate was run with the remediation's new files staged: preflight classifies untracked non-ignored files as runtime garbage by design, so `npm run check` requires a staged-or-committed tree.
  The self-hosting graph remains 58 Specs, 1 Pack, 36 anchors, 95 nodes, and 180 edges with zero
  findings.
- The strict TypeScript no-excuse audit passed across every changed and added TypeScript file. LSP
  diagnostics report zero errors across the changed CLI module; broader directory requests were
  intermittently unavailable, while the repository compiler, linter, declaration build, and
  package smoke test supplied the full static proof.
- Live QA drove the built CLI through `--help`, dry-run with no target write, successful publication
  with source preservation, existing-target refusal, explicit invalid-operand refusal, and the
  public ESM barrel exports.

### Closing wave — after the done record above

Four repairs landed after that gate run, three of them fallout from the anchor-trust ruling and the
`setOwn` cluster reaching surfaces the remediation waves had not swept:

- **Serialization keeps author-controlled keys.** The `setOwn` law stopped at reification; an
  authored `__proto__` key survived extraction and then vanished in the canonical section
  serializer, which rebuilt sections with plain assignment. The serializer now uses `setOwn` too,
  so the carrier-to-graph path is own-property throughout, with a regression pinning it.
- **The agent workspace leaves the published tree.** `.gitignore` excludes `.omo/`, yet an
  arbitrary slice of it had become tracked: the whole phase-2 workspace, but only five of the
  remediation session's ~30 evidence files and one of its four notepads. That partial snapshot is
  what forced a temporal-guard exemption for an ignored directory. The slice is untracked (the
  files stay on disk), and the exemption is deleted with it — enumeration already honours
  `.gitignore`, so the guard needed no carve-out once the tracking was honest. The durable
  ledgers were archived into this directory for exactly this reason; the `.omo/…` evidence links
  inside the archived phase plans stay session-local pointers, never published artifacts.
- **Preflight regenerates at trusted package identity.** Builder trust is physical identity to the
  *running* package's modules, so a clean-room copy driven by the repository's own binary lawfully
  loses every relative-import anchor. The first repair dropped the clean room and re-ran in place —
  which, sitting downstream of `generate:*` and both `--check-clean` legs in the same chain, proved
  little beyond two consecutive runs agreeing.
- **The clean room is restored, correctly this time.** The scratch root now carries `dist/` and
  `package.json` beside the sources and executes *its own* `sdp`, so `nearestPackageRoot` lands
  inside the copy and relative builder trust holds there. Preflight compares the committed tree
  against a regeneration performed entirely outside this checkout: 58 Specs, 1 Pack, 36 anchors,
  95 nodes, 180 edges, byte-identical. Relocation-independence is proven rather than assumed, and
  the trust ruling is now something the gate exercises instead of something it had to concede to.
- Gate at close: `npm run check` green end to end — 478 repository tests plus the isolated 54-test
  CLI suite, both `--check-clean` legs, and the restored preflight clean room.

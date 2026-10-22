# Plan 46 S1 build

Historical record of the initial S1 build at `93b3265`. Review fixes landed at `08e699d`.
The measurements and gate below describe that earlier tree; the wave-2a integration record is
[plan46-wave2a-integration.md](plan46-wave2a-integration.md). Commands use the directory
placeholders defined in the [asset README](assets/plan46-s1/README.md).

Built on `lane/46-build-s1` from `2f2611c3eaf6cecc183e1e912303941271ee9745`.
The final session report names the delivery commit.

## Built and bound

| Carrying Spec | Realization and binding |
| --- | --- |
| `spec:consumers.spec-studio.data.recipe-answers` | `impl:protocol.studio-recipes` references it. `studio/recipes.ts` compiles the shipped bodies with the sink's existing compiler, caches the compiler and report for the build, and shares one answer for each assigned parameter set. Pack totals come directly from recipe 29. R1 replaces only `evaluateStudioRecipe`. The assembly evaluates recipes 17, 20, 24, 31, 33, 43 and 44, recipe 29 per Pack, recipes 21 and 30 per Spec, and recipe 34 per non-example Spec. |
| `spec:consumers.spec-studio.diagrams` | `impl:protocol.studio-diagrams` and `impl:protocol.studio-diagram-element` satisfy it. The engine renders context/layer grids, member-depth bands, relation bands and realization bands, bounded folds, inline SVG and a full text equivalent. Overflow retains open text. The element changes only the view box for drag, zoom and pinch. Links remain clickable. |
| `spec:decisions.studio-diagram-renderer` | Both diagram anchors reference the decision. No dependency or browser layout engine was added. |
| `spec:decisions.studio-build-renders` | The recipe, diagram and lens anchors reference it. All new views render in the engine. Both decisions remain `defined` for the owner. |
| `spec:consumers.spec-studio.lenses` | The frame and new lens anchors reference it. Navigation reaches Packs, Architecture, Tests and Evidence in that order. The composing panel belongs to S5. |
| `spec:consumers.spec-studio.lenses.packs` | `impl:protocol.studio-index-page` satisfies it alongside its existing index-page target. The landing page names the Packs lens and retains authored membership order and the complete Spec list. |
| `spec:consumers.spec-studio.lenses.architecture` | `impl:protocol.studio-architecture-lens` satisfies it. The page renders recipes 17 and 43, planned boxes and dashed planned uses, unreadable and differing designs, component details and member diagrams, and unresolved structure. Recipe 17 adds the pinned component fields, member roles, references and per-pair use counts. |
| `spec:consumers.spec-studio.lenses.tests` | `impl:protocol.studio-tests-lens` references it. The page renders verifier bindings, enabled counts, keyed and unkeyed rules, uncovered values, unbound children and the four filters. External run rows belong to S4. The existing Spec-page binding list now provides the `verification` fragment the lens links to. |
| `spec:consumers.spec-studio.lenses.evidence` | `impl:protocol.studio-evidence-lens` satisfies it. All four sources explicitly read `not tracked` and name what would bring them in. |
| `spec:consumers.agent-surface.example-space-coverage` | `impl:protocol.example-space-decoding` and `impl:protocol.example-space-coverage-recipe` satisfy it. The notation module owns the interpretation previously in code generation; the reader exposes decoded slots and bound points. Recipe 44 reports per-value coverage and diagnoses invalid scopes. Other slot types, including boolean, remain non-enumerable. |

Seven examples are bound through committed generated registrars in `test/studio-s1.test.ts`.
The parent id is followed by each example suffix below.

| Parent | Example | Verifier anchor suffix after `test:protocol.studio-` |
| --- | --- | --- |
| `spec:consumers.spec-studio.diagrams` | `within-bound` | `diagram-within-bound` |
| same | `folds-by-context` | `diagram-folds-context` |
| same | `folds-by-layer` | `diagram-folds-layer` |
| `spec:consumers.spec-studio.lenses.architecture` | `planned-apart` | `architecture-planned-apart` |
| `spec:consumers.spec-studio.lenses.tests` | `coverage-row` | `tests-coverage-row` |
| `spec:consumers.agent-surface.example-space-coverage` | `uncovered-literal` | `coverage-literal` |
| same | `number-not-enumerable` | `coverage-number` |

Four typed oracle anchors model those example spaces. Each example states `ready` after its
floor cleared and its registrar passed. A mutation of one authored primary expected result per
example made all seven fail with `Spec Then parameters do not match the oracle payload`;
restoring the carriers restored all seven. Extra tests cover overflow, trace folding, numeric
member depths, realization order, label wrapping, planned uses, unreadable designs, unresolved
structure, recipe evaluation counts and the browser element's interactions and cleanup.

The self-hosting oracle transcribes the authored anchors, bindings, structure, readiness and gap
changes. Eight parent gap warnings leave the roster. The link test now matches actual `id`
attributes instead of also matching the diagrams' required `data-id` attributes.

## Spec questions and integration

- `spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations`: recipes 46 and 51
  belong to Q and D and are not shipped in S1. Base-graph and run-record inputs belong to S3 and
  S4. The assembly keeps `references` until those evaluations join it. There is one integration
  point for R1's `evaluateBody`, `src/projections/studio/recipes.ts#evaluateStudioRecipe`.
- `spec:consumers.spec-studio.lenses.tests#rule.bindingsOnly`: external run evidence stays with
  S4, so the tests lens keeps `references` despite completing its graph-only rows and filters.
- `spec:consumers.spec-studio.lenses#rule.readOnly`: composing actions stay with S5. This lane
  references the shared parent rather than claiming the composing-panel promise is built.
- `spec:consumers.spec-studio.lenses.architecture#rule.plannedApart`: if a component anchor
  exists without satisfying its design, the realized box retains the component id and the planned
  box uses the design Spec id as its drawing identity. Its words still name the planned component
  id. This preserves two separately linked boxes without ambiguous edge endpoints.
- `spec:consumers.agent-surface.example-space-coverage#rule.eligibleChildren`: the shared decoder
  collects only example children with a complete given/when/then entry. Code generation and the
  reader now consume that same collection.

No non-example carrying Spec was rewritten. The two decisions await the owner's ratification.
The common brief assigns skill edits to integration. The unchanged on-ramp tests require recipe
44 in the reading skill's task table and the sessions skill's guidance. The requested exception
is two pointers only; the original complete-coverage assertions remain intact. Without that
exception, these two tests prevent the lane's full gate from passing.

## Measurements

Three sequential trials per case. These are wall-clock measurements under concurrent lane load,
with no claimed speedup. Sizes include HTML, JavaScript and CSS. Re-run the measurements rather
than inheriting them.

| Corpus | Engine | Median seconds | Files | Bytes |
| --- | --- | ---: | ---: | ---: |
| Protocol | Base | 4.735 | 414 | 32,165,515 |
| Protocol | S1 | 4.996 | 417 | 32,572,337 |
| Platform copy | Base | 2.097 | 253 | 9,710,213 |
| Platform copy | S1 | 2.332 | 256 | 9,939,294 |

The Protocol comparison reads the base corpus at the base engine and S1's corpus at S1. The
platform comparison holds the corpus at `b038bd4`. The Protocol grows by 406,822 bytes, 1.26%;
the platform by 229,081 bytes, 2.36%. Every case's three builds produced the same SHA-256 over
sorted file paths and bytes. The platform overview has **12 boxes and 36 edges**, without a fold;
including all member diagrams, its architecture page has **52 boxes and 36 edges**.

The base engine must live inside its own source checkout: the extractor trusts relative builder
imports against that engine's package root. Running a copied bundle outside the source checkout
would silently omit relative constant-form anchors, making a false baseline.

The platform was cloned to `$PLATFORM` and checked out at `b038bd4`; its source checkout
was never written. The base corpus is a `git archive` of the base commit at `$BASE`,
with its base `dist/` and a dependency symlink. Commands:

```sh
node reviews/assets/plan46-s1/measure.mjs "$BASE" "$HEAD" "$PLATFORM"
pnpm --silent sdp:q 'return g.specContext("spec:consumers.spec-studio.diagrams")' --json
npm run check
```

[measurements.json](assets/plan46-s1/measurements.json) records every trial, exact command,
page-set hash and per-diagram count. The adjacent PNGs render the Protocol and platform SVGs
offline with their light-theme colors. They are diagram renders, not browser screenshots. The
browser security policy rejected the generated `file://` URL; browser-based responsive checks
could not run. Interaction tests run the shipped bundle against a DOM fixture. The design
detector reported no findings.

## Left

S2 embeds the trace and realization layouts into its Spec-page panels. S3 adds the registers,
queue, glossary and diff inputs; S4 supplies run evidence; S5 supplies composing, export, print
and watch. This lane adds no CLI verb, flag, preview publication or platform corpus edit.

## Gate

`npm run check` is blocked by two existing on-ramp coverage assertions, both caused by recipe 44
being absent from the integration-owned skills:

- `test/skills.test.ts`: maps a task to every catalog recipe in one sheet.
- `test/recipes.test.ts`: teaches parameters as data and keeps the on-ramps naming the CLI verbs
  and recipes.

The close run passed 2,218 other pooled tests. The final unstated-fold regression passed after
that run. All 100 CLI tests passed separately. Lint, formatting, build, both typechecks,
self-hosting gates, both five-root projection checks and staged preflight passed. The seven
adopted registrars are tracked. The skills and their complete-coverage assertions remain
unchanged, pending the requested two-entry scope exception.

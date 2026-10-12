---
id: spec:consumers.impact-graph.curation-assist
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.impact-graph
  dependsOn:
    target: spec:model.planned-architecture
    reason: the report uses the component-design convention to identify unrealized planned components
  decidedBy: spec:decisions.architectural-annotation
---
# File-level imports show where curation is missing

Gen 1 of this tool, `@libar-dev/architect`, derived a mechanical import graph beside its curated one and used it to show authors where curation was missing: load-bearing modules no anchor covered, coverage by package, and designed modules no code realized yet. The idea held; the build did not. It hard-coded the repository's layout into the engine, read TypeScript only, and mixed both graphs in one query handle. A review of gen 1 found that the file-level layer gave most of its curation value and that only symbol queries need a symbol identity, which the impact graph's symbol-reach child holds open, so the file-level layer stands on its own.

## Intent

- actor: An author curating anchors across a codebase, or a design pass over a large redesign.
- problem: Nothing tells an author which load-bearing files no anchor covers, where anchored `uses` and the code's imports disagree, or which component designs no code realizes yet, so curation gaps surface only when someone reads the code.
- outcome: Report from file-level imports where anchors and component designs are missing or drifting, as advice that never authors intent.

## Behavior

- rule: The layer reads file-level import edges from a per-language adapter and identifies each file by its repository-relative path, so it needs no symbol identity.
- rule: Every import relationship it derives is `inferred`; the imports file's schema and the recipe's external-inferred-input label carry that claim for all of them at once, so no relationship carries its own. The relationships stay apart from the curated graph: no `uses`, `memberOf`, `satisfies` or delivery fact derives from them, and a query of the curated graph never reads them unless the caller asks.
- rule: It reports the files with the highest import fan-in that no anchor covers, the anchored `uses` edges between two components whose files share no import, the imports between two anchored components that no `uses` states, and the component designs no `component:` anchor realizes yet.
- rule: Every report is advice: it refuses nothing, fails no validation and authors no anchor, and an author who agrees edits an anchor or a Spec as usual.
- rule: The engine reads no repository layout convention: source roots and module resolution come from the adapter's configuration, and a file belongs to a component only when it holds that `component:` anchor or a code anchor `memberOf` it, never through a path pattern in the engine.
- rule: The TypeScript adapter reads imports through the compiler library extraction already depends on; another language arrives as another adapter.
- rule: The adapter runs outside extraction and outside `sdp q`: `sdp build`, given the adapter's configuration, writes the import edges to `generated/imports.json`, sorted and without a timestamp, and the curation recipe reads that file through `--params`, so no query derives imports and no validator sees an inferred edge.
- rule: The imports configuration accepts optional root-relative `exclude` paths matching a file or directory subtree, refuses unknown keys, and records exclusions in its output so curation distinguishes deliberate omissions from missing input.
- rule: The recipe labels the file as external inferred input and reports a file present on one side only; it states nothing in the graph's name.
- rule: The adapter follows re-exports through barrel files, so a `uses` that reaches a component through an index file counts as backed by an import.
- rule: Load-bearing is a ranked list, not a threshold: the recipe reports each uncovered file's import fan-in and fan-out, takes a `limit`, and leaves the cut to the caller.

## Design

- importsFlag: `sdp build --imports PATH` names the adapter configuration, a JSON object `{ "adapter": "typescript", "tsconfig": "tsconfig.json", "roots": ["src"], "exclude": ["src/generated"] }` with root-relative paths, where `exclude` is optional and each of its paths names a file or a directory subtree, and a key outside these four is refused; without the flag the build writes no imports file and leaves an existing one untouched.
- importsFile: `{ "schema": "sdp-imports/1", "adapter": "typescript", "exclude": ["src/generated"], "files": [{ "file": "src/a.ts", "imports": ["src/b.ts"] }] }` in `generated/imports.json`, files and imports sorted in code-unit order, paths root-relative with POSIX separators, `exclude` recording the configuration's exclusions in that form and sorted, every file the adapter reads under the configured roots and outside the exclusions listed even when it imports nothing, and imports outside the roots or under an exclusion left out. The schema and the recipe's `external inferred input` label give every listed relationship the `inferred` claim.
- barrelImports: when a file imports a barrel that re-exports another file, its `imports` lists the barrel and every file the barrel's re-exports reach, so the list is already the backing a `uses` check reads; a barrel under an exclusion is left out of the list while the files reached through it stay.
- importForms: the TypeScript adapter reads the `.ts`, `.cts`, `.mts` and `.tsx` files under the configured roots and the module references the compiler resolves in them: import and export-from declarations, type-only and side-effect imports included, `import x = require(...)`, and `import(...)` calls and import types with a literal specifier; a computed specifier and a plain `require(...)` call are not read.
- curationRecipe: recipe 40, the curation report, takes `params.imports`, the imports file's object, and `params.limit`, 20 by default, and returns `{ input, totals, uncovered, usesWithoutImport, importsWithoutUses, unrealizedComponents, oneSided }`.
- curationRows: `uncovered` rows are `{ file, fanIn, fanOut }` for files no anchor sits in, ranked by fan-in then path and cut at `limit`; `usesWithoutImport` rows are `{ from, to, fromComponent, toComponent }`; `importsWithoutUses` rows are `{ fromComponent, toComponent, imports, sample: { from, to } }`; `unrealizedComponents` rows are `{ spec, componentId }` for component designs with no resolving anchored `satisfies` edge from the planned `component:` unit to the design, so an existing id without that binding stays unrealized.
- curationInput: `input` is `{ label: "external inferred input", schema, adapter, exclude, files }`, with `exclude` echoing the imports file's exclusions, and `oneSided` lists anchored source files the imports file does not list and imports-file entries outside every anchored component, so a stale or partial file shows.

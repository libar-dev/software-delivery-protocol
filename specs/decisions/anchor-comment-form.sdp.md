---
id: spec:decisions.anchor-comment-form
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.anchors
  supersedes: spec:decisions.jsdoc-graph-extraction-refused
  dependsOn: spec:decisions.one-validation-path
---
# The comment form is a second anchor representation

## Intent
- outcome: Admit a doc comment carrying reserved `@sdp-*` lines as a second extracted representation of the anchor, feeding the same closed envelope as the constant form, so code that cannot import the Protocol binds at its real site and comment prose still authors nothing.

## Decision
- context: The source-commentary ruling it supersedes (`spec:decisions.jsdoc-graph-extraction-refused`, MD-35) refused two things in one record: comment prose authoring graph content, and identity tags in doc comments. Its rationale said the refusal "is about prose, not identity", while its operative alternative also refused structured identity tags; the annotation scout under `docs/lineage/` names that mismatch and finds that gen 1's drift was duplicate identities, scan scope, and syntax handling, never an extracted identity tag as such. The first adopter showed the cost of the single form: every one of its code anchors sits in a test or a harness because its runtime code cannot import this package, `byFile` on a source file returns nothing, and a hand-kept join stands in for the binding. The original design (`docs/lineage/v0-design/04-authoring-surfaces.md` §2) supported three marker styles feeding one extractor, and its package shape (`docs/lineage/v0-design/02-system-architecture.md` §3) kept the marker library free of runtime dependencies so product code could import it. The owner's direction opening plan 40 is to move closer to that design.
- decision: An anchor has two extracted representations that feed one closed envelope, the constant form as ruled and a comment form. The comment form is a `/** … */` comment attached as the leading doc comment of a top-level statement in a `.ts` or `.tsx` file, carrying reserved `@sdp-*` lines; `@sdp-anchor <id>` opens it, and the id's namespace selects the flavor exactly as the constant builders do. Comment prose still authors nothing: only the reserved lines are read, and a comment that does not open with `/**` is never read. Trust is by reserved grammar, not by builder import, so no import is required. The same id in two forms is a duplicate id. The package also ships a zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors` exporting the id builders and the three anchor builders and nothing else, for runtimes that may import but must not load `node:*` modules or ts-morph; the extractor trusts that specifier as a Protocol builder module.
- rationale: Hard to reverse: a second write path from source becomes a contract for the extractor, the validators, and every adopter's code. Surprising without context: the superseded ruling refused the obvious parity move, and this one admits exactly the half its own rationale left open while keeping the half it was about. Real trade-off: a line grammar in a comment gets no compiler check and the extractor gains a second parser; in exchange, code that cannot import the package binds at its real site and `byFile` answers for it.
- rationale: What survives from the superseded ruling: comment prose authors nothing; a comment's wording beyond the reserved lines produces no graph finding; a comment that states law other surfaces depend on still promotes into a Spec under the promotion law, and restating promoted law in a comment still violates exclusive promotion (MD-10); one graph language stays, because both forms feed one envelope and one extraction path (one validation path, MD-14).
- consequence: `@sdp-anchor <id>` opens the anchor; `impl:`, `api:`, and `component:` ids are code anchors, `test:` is a test anchor, `oracle:` is an oracle anchor.
- consequence: Target lines by flavor are `@sdp-satisfies` on a code anchor, `@sdp-verifies` on a test anchor, and `@sdp-models` on an oracle anchor; lists are comma-separated.
- consequence: Structural lines are admitted on code anchors only: `@sdp-component`, `@sdp-uses`, `@sdp-references`, `@sdp-role`; a component anchor additionally takes `@sdp-layer` and `@sdp-context`.
- consequence: `@sdp-label` is admitted on any flavor.
- consequence: Any other `@sdp-*` line is an envelope error, because the envelope is closed exactly as it is in the constant form.
- consequence: A block with `@sdp-*` lines and no `@sdp-anchor` line is an envelope error.
- consequence: The block's first line is the binding's file and line.
- consequence: Parsing reads the raw comment text with a line grammar; it does not depend on the TypeScript JSDoc tag parser.
- consequence: The `hasProtocolBuilderImport` prefilter admits a file that contains `@sdp-anchor`.
- consequence: The same id written in both forms reports through the existing duplicate-id validator.
- consequence: The `/anchors` subpath carries no dependency and loads no `node:*` module; a runtime that imports it ships nothing beyond the id and anchor builders.
- consequence: The decorator form stays an unextracted representation.
- alternative: Keeping the constant form as the single binding syntax was refused: the adopter's runtime code cannot import this package, so its anchors would stay in tests and the graph would keep answering nothing for source files.
- alternative: Extracting the comment form through the TypeScript JSDoc tag parser was refused: it would couple the reserved grammar to the compiler's tag model and its versioning, where a line grammar over the raw comment text is owned here.
- alternative: Parsing comment prose into Spec sections stays refused: it inverts the separation of intent from binding and recreates a shadow intent carrier beside the Specs.

---
id: spec:decisions.anchor-comment-form
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  supersedes: spec:decisions.jsdoc-graph-extraction-refused
  dependsOn: spec:decisions.one-validation-path
---
# The comment form is a second anchor representation

## Intent
- outcome: Admit a doc comment carrying reserved `@sdp*` tags as a second extracted representation of the anchor, feeding the same closed envelope as the constant form, so code that cannot import the Protocol binds at its real site and comment prose still authors nothing.

### Open questions
- [non-blocking #attachmentIdentity] The comment form records the block's file and line and nothing about the statement beneath it. The original design's Implementation node carried the attachment kind and the exported symbol name (`docs/lineage/v0-design/03-graph-metamodel.md` §2.7). Does a later ruling record the attachment kind and symbol name on the CodeNode, so a rename or a move reports, or does the binding stay a file-and-line pin? Re-entry trigger: a consumer needs to name the symbol a CodeNode binds, twice.

## Decision
- context: The source-commentary ruling it supersedes (`spec:decisions.jsdoc-graph-extraction-refused`, MD-35) refused two things in one record: comment prose authoring graph content, and identity tags in doc comments. Its rationale said the refusal "is about prose, not identity", while its operative alternative also refused structured identity tags; the annotation scout under `docs/lineage/` names that mismatch and finds that gen 1's drift was duplicate identities, scan scope, and syntax handling, never an extracted identity tag as such. The first adopter showed the cost of the single form: every one of its code anchors sits in a test or a harness because its runtime code cannot import this package, `byFile` on a source file returns nothing, and a hand-kept join stands in for the binding. The original design (`docs/lineage/v0-design/04-authoring-surfaces.md` §2) supported three marker styles feeding one extractor, and its package shape (`docs/lineage/v0-design/02-system-architecture.md` §3) kept the marker library free of runtime dependencies so product code could import it. The owner's direction opening plan 40 is to move closer to that design.
- decision: An anchor has two extracted representations that feed one closed envelope, the constant form as ruled and a comment form. The comment form is a top-level `/** … */` block in a `.ts` or `.tsx` file carrying reserved camelCase, TSDoc-compatible tags; `@sdpAnchor <id>` opens it, and the id's namespace selects the flavor exactly as the constant builders do. Comment prose still authors nothing: only the reserved tags are read, and a comment that does not open with `/**` is never read. Trust is by reserved grammar, not by builder import, so no import is required. The same id in two forms is a duplicate id. The package also ships a zero-dependency subpath `@libar-dev/software-delivery-protocol/anchors` exporting the id builders and the three anchor builders and nothing else, for runtimes that may import but must not load `node:*` modules or ts-morph; the extractor trusts that specifier as a Protocol builder module.
- rationale: Hard to reverse: a second write path from source becomes a contract for the extractor, the validators, and every adopter's code. Surprising without context: the superseded ruling refused the obvious parity move, and this one admits exactly the half its own rationale left open while keeping the half it was about. Real trade-off: a tag grammar in a comment gets no compiler check and the extractor gains a second parser; in exchange, code that cannot import the package binds at its real site and `byFile` answers for it.
- rationale: What survives from the superseded ruling: comment prose authors nothing; a comment's wording beyond the reserved tags produces no graph finding; a comment that states law other surfaces depend on still promotes into a Spec under the promotion law, and restating promoted law in a comment violates exclusive promotion (MD-10), so the comment demotes to local commentary plus a Spec pointer; one graph language stays, because both forms feed one envelope and one extraction path (one validation path, MD-14).
- consequence: The reserved tags are `@sdpAnchor`, `@sdpLabel`, `@sdpSatisfies`, `@sdpVerifies`, `@sdpModels`, `@sdpReferences`, `@sdpComponent`, `@sdpUses`, `@sdpRole`, `@sdpLayer`, and `@sdpContext`; the spelling is camelCase so TSDoc tooling reads each as one tag.
- consequence: `@sdpAnchor <id>` opens the anchor; `impl:`, `api:`, and `component:` ids are code anchors, `test:` is a test anchor, `oracle:` is an oracle anchor.
- consequence: Target tags by flavor are `@sdpSatisfies` on a code anchor, `@sdpVerifies` on a test anchor, and `@sdpModels` on an oracle anchor; lists are comma-separated.
- consequence: Structural tags are admitted on code anchors only: `@sdpComponent`, `@sdpUses`, `@sdpReferences`, `@sdpRole`; a component anchor additionally takes `@sdpLayer` and `@sdpContext`.
- consequence: `@sdpLabel` is admitted on any flavor.
- consequence: Any other `@sdp*` tag is an envelope error, because the envelope is closed exactly as it is in the constant form; a line that opens with `@sdp` is a reserved tag line, so a misspelling such as `@sdp-anchor` or `@sdpAnchor:` is refused rather than read as prose.
- consequence: Attachment: every top-level `/** … */` block that contains a reserved tag is one anchor with exactly one `@sdpAnchor`; a block with reserved tags and no `@sdpAnchor` is an envelope error, and a block with two is an envelope error, as any repeated tag is.
- consequence: Blocks above the first import, trailing blocks with no statement beneath them, and comment-only files are read; a `/** … */` block with a reserved tag in a nested position, inside a function body, a class member, an object literal, or a JSX expression, is a misplaced-tag error, and a nested comment the top level would not read stays unread.
- consequence: The block's first line is the binding's file and line.
- consequence: Cardinalities: each reserved tag appears at most once per block; `@sdpModels` takes one target; a list tag is non-empty, carries no empty item, and repeats no target.
- consequence: Prose precedes the tags; after the first reserved tag, a non-empty line that does not open a tag is a refused continuation, and an ordinary TSDoc tag such as `@param` stays lawful and unread.
- consequence: Parsing reads the raw comment text with a tag grammar; it does not depend on the TypeScript JSDoc tag parser.
- consequence: The `hasProtocolBuilderImport` prefilter admits a file that contains the `@sdp` prefix.
- consequence: The same id written in both forms reports through the existing duplicate-id validator.
- consequence: The `/anchors` subpath is ESM with type declarations, built from the leaf id and anchor modules, carries no dependency, loads no `node:*` module, and its dependency closure is tested; a runtime that imports it ships nothing beyond the id and anchor builders.
- consequence: The decorator form stays an unextracted representation.
- alternative: Keeping the constant form as the single binding syntax was refused: the adopter's runtime code cannot import this package, so its anchors would stay in tests and the graph would keep answering nothing for source files.
- alternative: Extracting the comment form through the TypeScript JSDoc tag parser was refused: it would couple the reserved grammar to the compiler's tag model and its versioning, where a tag grammar over the raw comment text is owned here.
- alternative: A hyphenated spelling such as `@sdp-anchor` was refused: TSDoc tooling splits a hyphenated tag at the hyphen, so the tag would render as `@sdp` with a stray suffix in every documentation projection.
- alternative: Parsing comment prose into Spec sections stays refused: it inverts the separation of intent from binding and recreates a shadow intent carrier beside the Specs.

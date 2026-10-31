---
id: spec:consumers.spec-studio.diagram-kinds.mermaid-source
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.page-elements
  decidedBy:
    - spec:decisions.studio-diagram-renderer
    - spec:decisions.shipped-projections-frozen
---
# A diagram offers Mermaid source as copyable text

Mermaid source is a second serialization of the drawing's supplied values. It changes neither the static SVG renderer nor the separately shipped Mermaid root, so it requires no decision refining either ruling. A future Mermaid runtime, layout library or change to that root would need its own decision.

## Intent
- outcome: Copy a drawing into another document while keeping the Studio usable without script or a Mermaid runtime.

## Behavior
- rule: [#sourceOnly] Build escaped Mermaid text from the same selected and folded diagram values as the SVG. Source is an optional export, never a browser rendering path, a network request, a new command or a write to the shipped Mermaid root.
- rule: [#losslessMeaning] Each kind names its preferred syntax. Use a labelled flowchart fallback whenever that syntax cannot state the drawing's exact relations, claims or folds. State the chosen syntax and fallback reason beside the source. Preserve full ids in labels or comments and every aggregation count and folded member identity in comments; the text equivalent remains authoritative for the diagram's reading.
- rule: [#copy] A closed source disclosure contains a read-only text area with a visible label. Without script a reader selects and copies it. The page elements' copy control enhances this same text with its Copy button, Copied feedback and select-the-text fallback. The diagram element keeps only its viewport controls.
- rule: [#escaping] Treat every title, label, id and reason as data. Escape HTML at the page boundary and Mermaid syntax at the source boundary; never emit source directives, executable links, raw HTML or configuration supplied by corpus text.
- rule: [#omission] A drawing omitted for bounds or routing offers its text equivalent and a reason; it offers no partial Mermaid source that appears complete. Source follows the same explicit scope and folds as its figure.

## Design
- disclosure: Summary `Mermaid source`, a paragraph `Copyable source; the Studio draws static SVG.`, a syntax label and optional fallback explanation, then a labelled read-only textarea and the script-added copy button.
- sourceElement: The disclosure's copy button is the page elements' `sdp-copy`, given a `for` attribute that names the source text area so a long source is not repeated in an attribute; no new element is added, and `sdp-diagram` still adds only pan, zoom and pinch.
- sourceEscaping: Inside a quoted label, `"`, `#`, `%`, `<` and `>` become Mermaid entity codes (`#quot;`, `#35;`, `#37;`, `#lt;`, `#gt;`); a backtick becomes `#96;`, a line break becomes a space, and every other character is kept.
- sourceIds: Stable safe aliases assigned in displayed box order, with full graph ids in quoted labels or escaped comments. Aliases are local serialization names, never graph identities. No click directive or initialization directive is emitted.
- elementIds: Use `diagram.<subject>[.<view>].source` and `.source-text`, inserting the view name exactly where the diagram's own ids do, so a trace graph's source is `diagram.<subject>.source`.
- export: The self-contained Pack export retains source as selectable text and omits the copy script; print expands the text equivalent and leaves source closed unless the reader opened it.

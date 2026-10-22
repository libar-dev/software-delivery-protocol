---
id: spec:consumers.spec-studio.diagram-kinds.mermaid-source
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
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
- rule: [#losslessMeaning] Each kind names its preferred syntax. Use a labelled flowchart fallback whenever that syntax cannot state the drawing's exact relations, claims or folds. State the chosen syntax and fallback reason beside the source. Preserve full ids in labels or comments and every aggregation count and folded member identity in comments; the complete text remains authoritative for the diagram's reading.
- rule: [#copy] A closed source disclosure contains a read-only text area with a visible label. Without script a reader selects and copies it. A separate source element adds a Copy Mermaid source button only when copying is supported, reports success accessibly, and on failure selects the text with an instruction to copy manually. The diagram element keeps only its viewport controls.
- rule: [#escaping] Treat every title, label, id and reason as data. Escape HTML at the page boundary and Mermaid syntax at the source boundary; never emit source directives, executable links, raw HTML or configuration supplied by corpus text.
- rule: [#omission] A drawing omitted for bounds or routing offers its complete text and a reason; it offers no partial Mermaid source that appears complete. Source follows the same explicit scope and folds as its figure.

## Design
- disclosure: Summary `Mermaid source`, a paragraph `Copyable source; the Studio draws static SVG.`, a syntax label and optional fallback explanation, then a labelled read-only textarea and the script-added copy button.
- sourceElement: `sdp-diagram-source` wraps the build-rendered disclosure and enhances copying only; it neither lays out nor changes the diagram. The surrounding `sdp-diagram` still adds only pan, zoom and pinch.
- sourceIds: Stable safe aliases assigned in displayed box order, with full graph ids in quoted labels or escaped comments. Aliases are local serialization names, never graph identities. No click directive or initialization directive is emitted.
- elementIds: Use `diagram.<subject>.<view>.source` for the disclosure and `.source-text` for its text area; copied feedback uses `.copy-result` with a polite live region. Existing views use explicit view keys too, so source ids cannot collide with trace or realization.
- export: The self-contained Pack export retains source as selectable text and omits the copy script; print expands the complete text and may leave source closed unless the reader opened it.

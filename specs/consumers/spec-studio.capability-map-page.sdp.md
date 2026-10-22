---
id: spec:consumers.spec-studio.capability-map-page
kind: behavior
altitude: story
readiness: defined
relations:
  refines:
    target: spec:consumers.spec-studio.lenses
    reason: the Capabilities page is a lens that reads refinement
  dependsOn:
    - target: spec:consumers.spec-studio.index-page
      reason: the Epic filter extends the index's Specs filters
    - target: spec:consumers.binding-language-views
      reason: aggregate rows use the same binding labels as Spec pages
    - target: spec:consumers.capability-map
      reason: the page and index filter render the capability map's answer
    - target: spec:consumers.spec-studio.diagram-kinds
      reason: the refinement drawing shares the Studio's diagram layout and accessible text contract
---
# The capability map page makes refinement readable by epic

## Intent

- actor: A reviewer looking for a capability before choosing a Spec or Pack.
- problem: A flat altitude filter hides how a capability is decomposed, and a large refinement drawing becomes unreadable when shrunk to the page width.
- outcome: Read an epic overview, inspect its refinement structure and evidence, and narrow the index's Specs to its descendants.

## Behavior

- rule: [#page] The Studio publishes `capabilities.html` on every build and links it as `Capabilities` immediately after `Packs` in the top navigation. The Packs lens keeps its membership order and the index remains the landing page.
- rule: [#recipeData] The page reads recipe 52 with `{ detail: true }` and no epic parameter. It renders every epic's own evidence beside its descendant rollup and names the rollup's scope. Examples and decisions have separate counts and expandable rows. There is no combined total obtained by adding epic rows.
- rule: [#drawing] Each epic has a refinement drawing supplied by the shared diagram implementation. It keeps parent-to-child reading order while arrows, if drawn, point child to parent and the legend says `refines`. Repeated nodes link to their first occurrence within that epic section. A nested epic remains a labelled epic, not a new altitude.
- rule: [#bounded] A large branch folds at the shared diagram bound and links to its complete refinement text. It never scales labels below the shared legibility size to fit an entire tree. The text includes every node and edge, repeats and cyclic links labelled in words, and stays readable without script.
- rule: [#links] Every node title links to that Spec's Studio page. A separate `Show these Specs` link goes to the index's Specs section with the epic selected. Keyed questions link to their entry on the Spec page; unkeyed questions link to the Spec page's `section.intent`. Unresolved endpoints are text with their diagnostics, never plausible Spec links.
- rule: [#filter] The index's Specs filter gains `Epic`, with `Any`, `No epic` and every epic by title and id. An epic selects its own Spec and every Spec whose full-corpus epicIds contains it. It intersects with the existing filters, resets with them, and never changes Pack membership or hides Pack cards.
- rule: [#withoutScript] Native links, disclosures, complete refinement text and all Spec rows work without script. Index filtering is an enhancement: before script applies a requested epic, the index says filtering needs script and shows all rows. A supplied id that is absent or not epic reports `Unknown epic filter` and leaves all rows visible.
- rule: [#emptyAndDamage] The page always has `No epic reaches these Specs`, including an explicit empty message. With no epics it explains that authors may organize Specs through refinement and still lists the whole corpus. Cycles and unresolved edges are visible diagnostics beside the complete text, without a new validation rule.

## Design

- route: `capabilities.html`; an epic's section id is its Spec id. The filtered-index route is `index.html?epic=<percent-encoded Spec id>#specs`; `epic=none` selects unreached Specs, absence selects Any. An unknown or repeated epic parameter reports the unknown-filter message without applying it.
- diagramInput: recipe 52's node, edge, epic and unreached rows supply the drawing and its text; layout derives no reach, floor or delivery fact. The shared drawing implementation owns folding, label metrics and SVG or Mermaid representation. A capability drawing must support same-altitude edges, skipped altitudes, multiple parents, nested epics, and cycles without pretending to be a strict three-level tree.
- disclosureOrder: epic overview cards and sections follow recipe order. Each section opens with the epic's own rung, floor, binding evidence and questions, then the rollup labelled `Distinct descendants, excluding this epic`. Refinement text expands a depth-first walk with children in id order and renders later visits as references; it follows the recipe's root order and uses per-section visited ids. Examples and decisions fold through native disclosures without pruning their descendants.
- rowEvidence: each row names kind and altitude, `stated <rung>`, `floor <rung>`, the implementation binding and the verifier binding as `present` or `none`, and open and blocking question counts with their text available. Facts that are absent stay absent; a folded branch's counts never become the parent's badges.
- nestedEpics: a card for an epic that refines another epic says `Inside <title>`, using `parentEpicIds`, and a card whose descendants include an epic names it, so overlapping counts read as overlap.
- responsive: overview cards reflow to one column on a narrow viewport; refinement text wraps ids and titles, caps visual indentation, and names the parent in words so deep trees remain readable. Diagram labels use the shared readable size and bounded branches instead of shrinking the whole graph. Print opens the disclosures and retains the complete text.

## Verification — reviewed

- Read the same page on a corpus with one broad epic, several epics, and no epics, with script disabled and at a narrow viewport.
- Follow a shared descendant from both parents and verify that the rollup counts it once and the index filter lists it once.
- Select an epic on the index, combine it with kind and readiness filters, reset it, and open the filtered URL directly; invalid and repeated epic parameters never show a false empty result.

---
id: spec:consumers.spec-studio.shell
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:consumers.spec-studio.lenses
      reason: the top navigation opens each lens
    - target: spec:consumers.spec-studio.responsive
      reason: the rail moves below the canvas under the phone breakpoint
    - target: spec:validation.prose-mentions
      reason: a mention links where the validator resolves it
    - target: spec:consumers.spec-studio.sharing
      reason: the shell shows the stamp a publishing step writes beside the page set
    - target: spec:consumers.spec-studio.intent-panel
      reason: the composing panel follows the canvas on every page
---
# The Studio's shell frames every page with navigation, a rail and a canvas

The shell carries what every page shares, including the rules that keep a page readable: by keyboard, without color, on a phone and without its script. Recent edits stay out of it, because a page is a function of the graph alone and git holds the history.

## Intent
- outcome: Let a person move between the index, the lenses, the registers, Packs and Specs from any page, find a Spec by what they remember of it, and read every page by keyboard, on a phone and without its script.

## Behavior
- rule: Every page has the same shell: a top navigation, a left rail, a main canvas and the composing panel after it, and it opens with a link that skips to the canvas.
- rule: A search field is on every page; `spec:consumers.spec-studio.search` states what it matches and how its results show.
- rule: The rail's count of findings is the count of the validation report's findings, never a count the page derives.
- rule: [#noRecentEdits] The shell shows no recent edits and no other history: git holds it.
- rule: [#stamp] Served over http or https, the shell reads `stamp.json` beside the page set and, when it loads, shows the build context it names; a page opened through `file://` requests nothing and shows no stamp.
- rule: [#sourceLinks] Every recorded file and line a page shows as text carries its file and line as data on its element, and when a loaded stamp names a source template the shell links each to the template with the file and line filled in; without such a stamp, or through `file://`, each stays text.
- rule: [#rungBadge] A stated rung shows as a badge that carries the rung's word, colored from a palette of four that stays distinct under color blindness; the floor reached shows beside it as words with no color of its own, and only the divergence banner adds a warning color, beside its words.
- rule: [#wordsBesideColor] Every status a color marks is also written in words, so no reading depends on color.
- rule: [#keyboard] Every link and control is reachable from the keyboard in reading order and shows where the focus is.
- rule: [#lineLength] Prose runs no wider than about 80 characters, and a table or a diagram wider than the canvas scrolls inside its own box, never the page.
- rule: [#text] Authored text renders as plain text with each inline code span as code, and no other Markdown is read. A mention the prose-mentions validator reads links to its target's page when the target resolves, and to the entry when the mention is an entry address.
- rule: [#withoutScript] Every page but the search page reads in full without its script: its collapsible parts are native disclosure elements, and only filtering, copying, the stamp, pan and zoom, and the composing panel need the script. The search page needs its script to match, and without it says so and links to the index.

## UI
The parts of the shell, top to bottom and left to right.
- topNavigation: the Studio's name linking to the index, then in order Packs, linking to the index's Packs section, Architecture, Tests, Evidence, Queue, Questions, Decisions, Declarations, Backlog and Glossary, then Diff when the build was given a base graph and Runs when it was given run records, then the search field; the link to the current page is marked as current.
- stampLine: at the end of the top navigation, the stamp's corpus commit, engine and build time, when the stamp loads.
- leftRail: on a Pack page, the Pack's members in authored order, each linked to its card on the page; on a Spec page, each Pack the Spec belongs to with its members in authored order, each linked to its Spec page and the current one marked; on any other page, every Pack; then, on a Pack or Spec page, under an `Example spaces` heading shown only when there is one, each member of the rail's Packs that owns an example space, linked to its Spec page, with no harness named; then the validation report's finding counts by severity, linked to the index's findings.
- railOnPhone: below the phone breakpoint the rail follows the canvas, so a page opens on its content.
- mainCanvas: the page of the Spec, Pack, lens or register selected in the navigation, the rail or a link.
- sourceMark: a recorded file and line written as `<file>:<line>` in a `code` element carrying `data-source-file` and `data-source-line`, beside its copy action.

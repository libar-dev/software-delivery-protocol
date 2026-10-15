---
id: spec:consumers.spec-studio.page-elements
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.components
  dependsOn:
    - spec:consumers.spec-studio.shell
    - spec:consumers.spec-studio.search
  decidedBy: spec:decisions.studio-web-components
---
# A few custom elements filter, search, open and copy on a rendered page

The build renders every page whole, so these elements add behavior to markup that is already there rather than rendering views of their own. A browser refuses a module script on a page opened through `file://`, so they ship as one classic script.

## Intent
- outcome: Give the Studio's pages their few interactions through custom elements that enhance markup the build wrote, so a page with its script filters, searches and copies, and every page but the search page still reads in full without it.

## Contract
- [#oneScript] The elements ship in one classic script, `assets/studio.js`, with no module syntax and nothing loaded at run time; the build bundles it from the package's source, with the concept matcher.
- [#enhanceOnly] Each element enhances markup the build wrote and renders no graph value of its own, except that the search results element renders values from the search index its page embeds.
- [#noRequest] No element requests anything on a page opened through `file://`; the stamp element requests `stamp.json` only over http or https.
- [#nativeControls] Every control an element adds is a native button, link, select or input with a text label, reachable from the keyboard in reading order.
- [#liveCounts] An element that changes what a page shows says so in words in a polite live region, such as how many rows a filter shows.

## Design
- search: `sdp-search` with `page-root`, the relative path from its page to the page-set root: wraps the search field's form and, on submit, opens `<page-root>search.html#q=<term>` with the term percent-encoded.
- searchResults: `sdp-search-results`: on the search page, reads the index from the `sdp-data` element, matches the fragment's term and each term the person types, writes the results `spec:consumers.spec-studio.search` designs, and keeps the term in the fragment.
- filter: `sdp-filter`: wraps a hidden form of labelled `select` elements, each with `data-facet="<name>"` and an `any` option, and the rows marked `data-row`. On upgrade it shows the form, hides each row whose `data-<name>` differs from a chosen value, and writes `<shown> of <total> shown` in its `output` element; a row whose attribute holds several space-separated values, such as its Packs, matches when one of them equals the choice.
- expander: `sdp-expander`: adds `Open all` and `Close all` buttons for the `details` elements inside it, and on load and on each fragment change opens every `details` that holds the fragment's target and scrolls the target into view.
- copy: `sdp-copy` with `text`: a `Copy` button whose accessible name includes the text; it copies the text to the clipboard and says `Copied`, and where the clipboard is unavailable it selects the text so the person can copy it.
- stamp: `sdp-stamp` with `page-root`: served over http or https, it requests `<page-root>stamp.json` and, when it loads, shows its corpus commit, engine and build time as text; otherwise it shows nothing.

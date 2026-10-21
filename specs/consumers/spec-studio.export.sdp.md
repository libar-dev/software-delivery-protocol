---
id: spec:consumers.spec-studio.export
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:consumers.spec-studio.pack-page
      reason: an export opens with its Pack page's content
    - target: spec:consumers.spec-studio.spec-page
      reason: an export holds each member's Spec page content
    - target: spec:consumers.spec-studio.publisher
      reason: the export files are part of the page set the publisher writes
  constrainedBy: spec:extraction.determinism
---
# A Pack exports as one file, and every page prints as a document

A design is sent and archived as well as browsed: attached to a message, handed to someone outside the repository, printed for a review meeting. Every build writes each Pack as one self-contained HTML file inside the page set, so a reader with only a link downloads it from the Pack page, and the file opens anywhere with nothing beside it. Every page also prints as a document.

## Intent
- outcome: Let a person take a Pack's whole design away as one file that opens anywhere, and print any page as a readable document.

## Behavior
- rule: [#exportPerPack] The page set holds one export file per Pack, `exports/<name>.html`, its name formed from the Pack's id as the Pack's page name is.
- rule: [#selfContained] An export is one HTML file that loads nothing: its style is inline, it carries no script, and every diagram in it is inline SVG, so it opens from any folder or as an attachment with no other file.
- rule: [#exportContent] An export holds the Pack page's content and then each member's Spec page content in authored order, every disclosure written open; it leaves out the navigation, the rail, the search field, the stamp line, the composing panel and every control that needs the script.
- rule: [#exportLinks] Inside an export, a link to the Pack or to a member points at its section in the file, a link to an element of the Pack page or of a member's page points at that element in the file, and a link to anything else becomes its id as text, so no link leaves the file.
- rule: [#uniqueExportIds] Within an export, every element id copied from the Pack page takes the prefix `pack/` and every id copied from a member's page the prefix `<Spec id>/`, while each member's section keeps its Spec id as its own id; every fragment link and every attribute that names an element id, such as `aria-describedby` or a label's `for`, is rewritten to the prefixed id, so no two elements in the file share an id.
- rule: [#exportFromPackPage] Each Pack page links its export under the header, as `Download this Pack as one file`.
- rule: [#printAsDocument] Every page prints as a document: the print style hides the navigation, the rail, the search field, the composing panel and every control, gives the canvas the page's width, prints a diagram whole at that width, and prints every disclosure open, the expander opening each before printing and restoring it after.
- rule: [#exportBytes] An export is a function of the graph like every page: the same graph writes the same bytes, and an export holds no time, commit or stamp.

## UI
- exportTitle: the export opens with the Pack's title, its id, and the line `Exported from the Spec Studio`, with no date or commit.
- exportLink: under the Pack page's header, a link reading `Download this Pack as one file`, with the `download` attribute naming the file.
- memberSection: each member's section has its Spec id as its element id and opens with the member's position, title and id.

## Design
- exportIds: a copied id is written `pack/<id>` for the Pack page and `<Spec id>/<id>` for a member's page, so a member's `section.behavior` becomes its Spec id, a slash and `section.behavior`; the slash appears in no graph id, so a prefixed id never equals a member's section id or another prefixed id.
- expanderPrint: `sdp-expander`, before the page prints, opens every `details` inside it, and after printing restores each one's state.

## Example space
```gwt-vocabulary
Given a Pack of {members:number} member Specs, one of which names a Spec outside the Pack
When the build writes the Pack's export file
Then the export loads {loads:number} other files
Then the export holds {scripts:number} script elements
Then every link in the export points inside it or is text: {linksInside:boolean}
Then no two elements in the export share an id: {idsUnique:boolean}
Then the export holds {sections:number} member sections
```

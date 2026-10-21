---
id: spec:consumers.spec-studio.export.self-contained
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.export
  verifies:
    target: spec:consumers.spec-studio.export
    exercises: [exportPerPack, selfContained, exportContent, exportLinks, uniqueExportIds]
---
# A Pack's export opens alone and keeps its links inside it

## Intent
- outcome: Execute the export's self-containment on a Pack whose member names a Spec outside it.
- assumption: The world writes a root with one Pack of three member Specs and one further Spec outside the Pack that the first member names through `dependsOn`, builds the page set, and reads the one export file: it counts the `link`, `img`, `iframe` and `script` elements with a `src` or `href` reaching another file, the `script` elements of any kind, and the member sections, checks that every `a` element's `href` is a fragment the file holds, and collects every element id in the file to check that none repeats.

```gwt
Given a Pack of {members: 3} member Specs, one of which names a Spec outside the Pack
When the build writes the Pack's export file
Then the export loads {loads: 0} other files
Then the export holds {scripts: 0} script elements
Then every link in the export points inside it or is text: {linksInside: true}
Then no two elements in the export share an id: {idsUnique: true}
Then the export holds {sections: 3} member sections
```

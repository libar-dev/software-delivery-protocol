---
id: pack:spec-studio-v1
specs:
  - spec:consumers.spec-studio
  - spec:decisions.studio-html-surface
  - spec:consumers.spec-studio.data
  - spec:consumers.spec-studio.publisher
  - spec:consumers.spec-studio.shell
  - spec:consumers.spec-studio.search
  - spec:consumers.spec-studio.lenses
  - spec:consumers.spec-studio.index-page
  - spec:consumers.spec-studio.pack-page
  - spec:consumers.spec-studio.spec-page
  - spec:consumers.spec-studio.spec-page.core
  - spec:consumers.spec-studio.verification-panels
  - spec:consumers.spec-studio.intent-panel
  - spec:consumers.spec-studio.components
  - spec:decisions.studio-web-components
  - spec:consumers.spec-studio.page-elements
  - spec:consumers.spec-studio.responsive
  - spec:consumers.spec-studio.sharing
modelRefs:
  - spec:consumers.projections-model
---
# Spec Studio

The Spec Studio of the original design, `docs/lineage/v0-design/07-spec-studio-and-projections.md` sections 1 to 3, 11 and 12, in the order a reviewer reads it: what the Studio is and why it renders HTML, the data it reads and the verb that publishes it, its shell and search, its lenses and the index, the Pack page, the Spec page with its core and its panels, the composing panel, its custom elements, its phone layout, and how a build is shared. The publisher, the shell, search, the index, the Pack page, the Spec page's core and the page elements make up the static page set; the other panels, the other lenses and the composing panel build on it. Recipe 27, references into a design, shows each member's code bindings and the implemented Specs it builds on.

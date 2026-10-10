---
id: pack:spec-studio-v1
specs:
  - spec:consumers.spec-studio
  - spec:decisions.studio-html-surface
  - spec:consumers.spec-studio.data
  - spec:consumers.spec-studio.shell
  - spec:consumers.spec-studio.lenses
  - spec:consumers.spec-studio.spec-page
  - spec:consumers.spec-studio.verification-panels
  - spec:consumers.spec-studio.intent-panel
  - spec:consumers.spec-studio.components
  - spec:decisions.studio-web-components
  - spec:consumers.spec-studio.responsive
  - spec:consumers.spec-studio.sharing
modelRefs:
  - spec:consumers.projections-model
---
# Spec Studio

The Spec Studio of the original design, `docs/lineage/v0-design/07-spec-studio-and-projections.md` sections 1 to 3, 11 and 12, in the order a reviewer reads it: what the Studio is and why it renders HTML, the data it reads, its shell and lenses, the Spec page and its panels, the composing panel, its custom elements, its phone layout, and how a build is shared. No member is built. A member reaches built code through the realized Spec it relates to where one exists; `spec:consumers.spec-studio.shell`, `spec:consumers.spec-studio.components` and `spec:decisions.studio-web-components` have none yet.
